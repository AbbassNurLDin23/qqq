import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  getAllCategories,
  getCategoryByTitle,
  addProductToCart,
} from "../../utils/fetcher";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    setDraggedIndex(index);

    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    setIsDragging(false);
    setDraggedIndex(null);

    if (draggedIndex === targetIndex) return;

    const newCategories = [...categories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedItem);
    setCategories(newCategories);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const handleCategoryClick = async (categoryTitle) => {
    if (isDragging) return;
    try {
      setLoading(true);
      const category = await getCategoryByTitle(categoryTitle);
      setSelectedCategory(category);

      if (category?.products) {
        setProducts(category.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError("Failed to fetch category products");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  const handleAddToCart = async (product) => {
    try {
      await addProductToCart(product);
      setCartMessage(`Added "${product.title}" to cart!`);
      setTimeout(() => setCartMessage(""), 2000);
    } catch (err) {
      setCartMessage("Failed to add product to cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow p-8">
        {loading ? (
          <div className="text-center">
            <p className="text-lg text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : selectedCategory ? (
          // Category details view
          <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <button
              onClick={handleBackToCategories}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              ← Back to Categories
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedCategory.title}
            </h1>
            <p className="text-gray-600 mb-6">{selectedCategory.description}</p>
            {cartMessage && (
              <p className="text-green-600 font-semibold mb-4">{cartMessage}</p>
            )}
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Products
            </h2>
            {products.length > 0 ? (
              <ul className="space-y-4">
                {products.map((product) => (
                  <li
                    key={product.title}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-xl font-semibold text-blue-600">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {product.description}
                      </p>
                      <p className="text-gray-800 font-medium mt-1">
                        ${product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      🛒 Add to Cart
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No products available in this category.
              </p>
            )}
          </div>
        ) : (
          // Categories list view
          <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Categories
            </h1>
            <ul className="space-y-6">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li
                    key={category.title}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleCategoryClick(category.title)}
                    className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    <h2 className="text-2xl font-semibold text-blue-600">
                      {category.title}
                    </h2>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No categories available</p>
              )}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
