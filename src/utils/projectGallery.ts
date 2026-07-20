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
