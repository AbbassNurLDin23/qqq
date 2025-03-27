import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserCart } from "../utils/fetcher";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getUserCart();
        if (cartData) {
          setCart(cartData);
        } else {
          setCart({ products: [] });
        }
      } catch (err) {
        setError("Failed to fetch cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">Loading cart...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          {!cart || cart.products.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-6">
              Your cart is empty.
            </p>
          ) : (
            <div className="grid gap-4">
              {cart.products.map((product) => (
                <div
                  key={product.title}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {product.title}
                    </h2>
                    <p className="text-gray-700 mt-1">{product.description}</p>
                    <p className="text-blue-600 font-bold mt-1">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
            >
              ⬅ Go Back
            </button>
            <button
              onClick={() =>
                alert("Proceed to Checkout (Feature not implemented)")
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              🛒 Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
