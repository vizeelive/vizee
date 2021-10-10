function cdnImage(url, opts) {
  let qs = new URLSearchParams(opts);
  let fragment = url.replace('https://vizee-media.s3.amazonaws.com', '');
  return `https://vizee.imgix.net/${fragment}?${qs.toString()}`;
}

export default cdnImage;
