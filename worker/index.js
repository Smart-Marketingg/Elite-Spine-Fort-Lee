// Static-site Worker for www.elitespine-nj.com.
// Sends http:// and bare-domain page requests to https://www.elitespine-nj.com with one 301,
// then serves the static files. Other hosts (workers.dev previews) are left alone.
const CANONICAL_HOST = 'www.elitespine-nj.com';
const BARE_HOST = 'elitespine-nj.com';

export function canonicalRedirect(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  if (url.hostname !== CANONICAL_HOST && url.hostname !== BARE_HOST) return null;
  if (url.hostname === CANONICAL_HOST && url.protocol === 'https:') return null;
  url.protocol = 'https:';
  url.hostname = CANONICAL_HOST;
  url.port = '';
  return Response.redirect(url.toString(), 301);
}

export default {
  async fetch(request, env) {
    return canonicalRedirect(request) || env.ASSETS.fetch(request);
  }
};
