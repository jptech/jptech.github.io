---
title: "Building This Site with Astro"
description: "A quick overview of the tech stack and design decisions behind this blog."
date: 2026-03-01
tags: ["astro", "web", "tailwind"]
category: project
draft: true
---

I built this site during a month off between jobs. The goal was simple: a fast, clean blog where I could write about technical topics without fighting the tooling.

## The Stack

- **Astro 5** for static site generation
- **Tailwind CSS v4** for styling
- **Shiki** for syntax highlighting with dual light/dark themes
- **Mermaid** for diagrams rendered client-side
- **GitHub Pages** for hosting

## Why Astro?

Astro ships zero JavaScript by default. For a content site, this is exactly what you want. Pages are rendered to static HTML at build time, and the only JS that runs client-side is what you explicitly opt into — like the theme toggle and Mermaid initialization.

```typescript
// Content collections give you type-safe frontmatter
const posts = await getCollection('blog', ({ data }) => !data.draft);
```

## Design Decisions

The visual design follows a few principles:

1. **Content-first** — typography and whitespace do the work
2. **Cool/neutral palette** — blue-gray tones, single accent color
3. **No decorative chrome** — borders and background shifts for hierarchy, no shadows

The color system uses CSS custom properties that flip between light and dark mode, keeping the Tailwind utilities clean and the theme logic centralized.
