import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ACCENT = '#2563eb';
const ACCENT_DARK = '#1d4ed8';
const TEXT = '#1a1d24';
const TEXT_MUTED = '#5e6671';
const SURFACE = '#fcfcfc';
const BORDER = '#e9ecf0';

const categoryColors: Record<string, { bg: string; text: string }> = {
  'deep-dive': { bg: '#eff6ff', text: '#1d4ed8' },
  project: { bg: '#ecfdf5', text: '#047857' },
  note: { bg: '#fffbeb', text: '#b45309' },
};

const categoryLabels: Record<string, string> = {
  'deep-dive': 'Deep Dive',
  project: 'Project',
  note: 'Note',
};

async function loadFont(): Promise<ArrayBuffer> {
  // Fetch IBM Plex Sans Bold with a UA that returns TrueType (needed by satori)
  const cssResponse = await fetch(
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
      },
    },
  );
  const css = await cssResponse.text();

  // Extract font URLs from CSS — get the 600 weight
  const fontUrls = [...css.matchAll(/src:\s*url\(([^)]+)\)/g)].map((m) => m[1]);
  const fontUrl = fontUrls[fontUrls.length - 1] ?? fontUrls[0];

  if (!fontUrl) throw new Error('Could not extract font URL from Google Fonts CSS');

  const fontResponse = await fetch(fontUrl);
  return fontResponse.arrayBuffer();
}

let _fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (!_fontCache) {
    _fontCache = await loadFont();
  }
  return _fontCache;
}

export async function generateOgImage(
  title: string,
  opts?: { category?: string; description?: string },
): Promise<Buffer> {
  const fontData = await getFont();
  const category = opts?.category;

  const badge = category
    ? {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontSize: 16,
            fontWeight: 600,
            color: categoryColors[category]?.text ?? TEXT_MUTED,
            backgroundColor: categoryColors[category]?.bg ?? BORDER,
            padding: '6px 16px',
            borderRadius: 20,
          },
          children: categoryLabels[category] ?? category,
        },
      }
    : null;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: SURFACE,
          padding: '60px 64px',
          fontFamily: 'IBM Plex Sans',
        },
        children: [
          // Top: accent bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: 80,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
              },
              children: [],
            },
          },
          // Middle: category badge + title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                flex: 1,
                justifyContent: 'center',
              },
              children: [
                ...(badge ? [badge] : []),
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: title.length > 60 ? 40 : 48,
                      fontWeight: 600,
                      color: TEXT,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      lineClamp: 3,
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Bottom: author
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 24,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: 18,
                            fontWeight: 600,
                            color: TEXT,
                          },
                          children: 'Parker Mitchell',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: 14,
                            color: TEXT_MUTED,
                          },
                          children: 'jptech.github.io',
                        },
                      },
                    ],
                  },
                },
                // Accent square decoration
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: ACCENT,
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 20,
                      fontWeight: 600,
                    },
                    children: 'P',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'IBM Plex Sans',
          data: fontData,
          weight: 600,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return Buffer.from(resvg.render().asPng());
}
