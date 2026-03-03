import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../utils/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
      description: post.data.description,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category, description } = props as {
    title: string;
    category: string;
    description: string;
  };

  const png = await generateOgImage(title, { category, description });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
