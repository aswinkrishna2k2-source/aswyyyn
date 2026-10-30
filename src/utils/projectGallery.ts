const modules = import.meta.glob('../assets/projects/*/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export function getProjectGallery(slug: string): string[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/projects/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

const thumbs = import.meta.glob('../assets/projects/*/thumbs/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** The same images in smaller copies for cards; any image without a copy stays full size. */
export function getProjectThumbs(slug: string): string[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/projects/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => thumbs[path.replace(/([^/]+)\.\w+$/, 'thumbs/$1.webp')] ?? url);
}
