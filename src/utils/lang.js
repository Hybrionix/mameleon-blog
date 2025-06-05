export function getLangProps(pathname) {
  const lang = pathname.startsWith('/en') ? 'en' : 'nl';
  const nlPath = lang === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname;
  const enPath = lang === 'nl' ? '/en' + (pathname === '/' ? '' : pathname) : pathname;
  return { lang, nlPath, enPath };
}