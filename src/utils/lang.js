export function getLangProps(pathname) {
  const lang = pathname.startsWith('/en') ? 'en' : 'nl';
  // Remove '/en' prefix for nlPath, keep the rest of the path
  const nlPath = pathname.replace(/^\/en/, '') || '/';
  // Add '/en' prefix for enPath, unless already present
  const enPath = pathname.startsWith('/en') ? pathname : (pathname === '/' ? '/en' : '/en' + pathname);
  return { lang, nlPath, enPath };
}