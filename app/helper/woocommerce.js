// woocommerce.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";


const api = new WooCommerceRestApi({
  url: "https://codedigi.net/",
  consumerKey: "ck_80342a68f75bdcbf962b234a94d23affd5de1ca8",
  consumerSecret: "cs_d18bbea899a873da84694673efbd20e2fa7bc0e8",
  version: "wc/v3"
});

export default api;


// const api = new WooCommerceRestApi({
//   url: process.env.WOOCOMMERCE_STORE_URL,
//   consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
//   consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
//   version: process.env.VERSION,
// });