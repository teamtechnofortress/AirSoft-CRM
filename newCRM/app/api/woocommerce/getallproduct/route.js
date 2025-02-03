import { NextResponse } from 'next/server';
import WooCommerceAPI from 'helper/woocommerce';


export async function GET() {
  try {
    // Fetch products from the WooCommerce API
    const response = await WooCommerceAPI.get("products", {
      per_page: 100,  // Fetch 100 products per page
    });

    // Return the data using NextResponse
    return NextResponse.json({ data: response.data });

  } catch (error) {
    console.error("Error fetching products:", error);

    // Return an error message with status 500
    return NextResponse.json({ message: "Failed to fetch products", error: error.message }, { status: 500 });
  }
}
