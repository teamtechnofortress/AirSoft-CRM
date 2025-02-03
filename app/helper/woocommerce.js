// woocommerce.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";


const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_STORE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: process.env.VERSION,
});

export default api;
