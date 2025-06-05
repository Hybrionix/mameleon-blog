export async function onRequest(context, next) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // If the path contains any uppercase letters, redirect to lowercase
  if (/[A-Z]/.test(pathname)) {
    url.pathname = pathname.toLowerCase();
    return Response.redirect(url.toString(), 301);
  }

  const response = await next();

  // Set your cache headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}