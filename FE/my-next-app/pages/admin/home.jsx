import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  getAllCategories,
  getCategoryByTitle,
  saveCategory,
  deleteCategory,
  saveProduct,
  deleteProduct,
} from "../../utils/fetcher";

const Home = () => {
  // Categories & Form states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({
    title: "",
    description: "",
  });
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    category_title: "",
  });
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Selected category state to show its products inline
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Initial fetch of categories
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

    // Transparent image for custom drag image
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

  // When clicking a category, fetch its full details (including products)
  const handleCategoryClick = async (categoryTitle) => {
    if (isDragging) return;
    setLoadingCategory(true);
    try {
      const data = await getCategoryByTitle(categoryTitle);
      setSelectedCategory(data);
    } catch (err) {
      setError("Failed to fetch category details");
    } finally {
      setLoadingCategory(false);
    }
  };

  // Delete category handler (for the categories list)
  const handleDeleteCategory = async (title) => {
    try {
      await deleteCategory(title);
      setCategories(categories.filter((category) => category.title !== title));
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  // Delete product handler (for the selected category view)
  const handleDeleteProduct = async (productTitle) => {
    try {
      await deleteProduct(productTitle);
      // Re-fetch the category details to update the product list
      const updatedCategory = await getCategoryByTitle(selectedCategory.title);
      setSelectedCategory(updatedCategory);
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleAddCategoryClick = () => {
    setShowAddCategoryForm(!showAddCategoryForm);
    setShowAddProductForm(false);
  };

  const handleAddProductClick = () => {
    setShowAddProductForm(!showAddProductForm);
    setShowAddCategoryForm(false);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const category = await saveCategory(newCategory);
      setCategories([...categories, category]);
      setNewCategory({ title: "", description: "" });
    } catch (err) {
      setError("Failed to add category");
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const selectedCat = categories.find(
        (cat) => cat.title === newProduct.category_title
      );
      if (!selectedCat) {
        throw new Error("Selected category not found");
      }

      const productToSubmit = {
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: selectedCat,
      };

      await saveProduct(productToSubmit);
      setNewProduct({
        title: "",
        description: "",
        price: 0,
        category_title: "",
      });
      alert("Product added successfully!");

      // If the new product is added to the currently viewed category, update it
      if (selectedCategory && selectedCategory.title === selectedCat.title) {
        const updatedCategory = await getCategoryByTitle(selectedCat.title);
        setSelectedCategory(updatedCategory);
      }
    } catch (err) {
      setError("Failed to add product: " + err.message);
    }
  };

  // Handler to go back to the categories list view
  const handleGoBack = () => {
    setSelectedCategory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow p-8">
        {loading ? (
          <div className="text-center">
            <p className="text-lg text-gray-500">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : selectedCategory || loadingCategory ? (
          // Category details view with products
          <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            {loadingCategory ? (
              <p className="text-lg text-gray-500">
                Loading category details...
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleGoBack}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    ← Back to Categories
                  </button>
                  {showAddProductForm === false &&
                    showAddCategoryForm === false && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddCategoryClick}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Add Category
                        </button>
                        <button
                          onClick={handleAddProductClick}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Add Product
                        </button>
                      </div>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedCategory?.title}
                </h1>
                <p className="text-gray-600 mb-6">
                  {selectedCategory?.description}
                </p>
                <h2 className="text-2xl font-semibold mb-4">Products</h2>
                <ul className="space-y-4">
                  {selectedCategory?.products &&
                  selectedCategory.products.length > 0 ? (
                    selectedCategory.products.map((product) => (
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
                          onClick={() => handleDeleteProduct(product.title)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete Product
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No products available in this category.
                    </p>
                  )}
                </ul>
              </>
            )}
          </div>
        ) : (
          // Categories list view
          <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCategoryClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {showAddCategoryForm ? "Cancel" : "Add Category"}
                </button>
                <button
                  onClick={handleAddProductClick}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {showAddProductForm ? "Cancel" : "Add Product"}
                </button>
              </div>
            </div>

            {showAddCategoryForm && (
              <form
                onSubmit={handleSubmitCategory}
                className="max-w-lg mx-auto bg-gray-50 p-6 rounded-lg shadow mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Add New Category
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Category Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newCategory.title}
                    onChange={handleCategoryChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter category title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Category Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter category description"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            )}

            {showAddProductForm && (
              <form
                onSubmit={handleSubmitProduct}
                className="max-w-lg mx-auto bg-gray-50 p-6 rounded-lg shadow mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Add New Product
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="product-title"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Product Title
                  </label>
                  <input
                    type="text"
                    id="product-title"
                    name="title"
                    value={newProduct.title}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder="Enter product title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="product-description"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder="Enter product description"
                    rows="4"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="product-price"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Product Price
                  </label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder="Enter product price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="product-category"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="product-category"
                    name="category_title"
                    value={newProduct.category_title}
                    onChange={handleProductChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.title} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            )}

            <ul className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li
                    key={category.title}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-move transition ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      onClick={() => handleCategoryClick(category.title)}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <h2 className="text-2xl font-semibold text-blue-600">
                          {category.title}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {category.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.title);
                        }}
                        className="ml-4 text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>
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
