export function getLangProps(pathname) {
  const lang = pathname.startsWith('/en') ? 'en' : 'nl';
  // Remove '/en' prefix for nlPath, keep the rest
  const nlPath = pathname.replace(/^\/en/, '') || '/';
  // Always remove '/en' for enPath as well, if you want both to point to the same path
  const enPath = nlPath;
  return { lang, nlPath, enPath };
}