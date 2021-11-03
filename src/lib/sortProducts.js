export default function sortByPrice(products) {
  return products.sort((a, b) => {
    let c = parseFloat(a.price.replace('$', '').replace(',', ''));
    let d = parseFloat(b.price.replace('$', '').replace(',', ''));
    if (c < d) {
      return -1;
    }
    if (c > d) {
      return 1;
    }
  });
}
