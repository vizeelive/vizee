function cdnImage(url, opts) {
  let uri = new URL(url);
  let qs = new URLSearchParams(opts);
  return `https://vizee.imgix.net/${uri.pathname}?${qs.toString()}`;
}

export default cdnImage;
