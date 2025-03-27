// fetcher.js

const BASE_URL = "http://localhost:8080"; // Adjust if your backend runs on a different URL

// Utility function to handle fetch requests
const fetcher = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "An error occurred");
  }

  try {
    return await res.json();
  } catch {
    return null; // in case response is not JSON (like for successful POST)
  }
};

// Register a new user
export const registerUser = async (username, password, role = "APP_USER") => {
  const body = JSON.stringify({ username, password, role });
  return fetcher(`${BASE_URL}/auth/register`, {
    method: "POST",
    body,
  });
};

// Login a user
export const loginUser = async (username, password) => {
  const body = JSON.stringify({ username, password });
  return fetcher(`${BASE_URL}/auth/login`, {
    method: "POST",
    body,
  });
};

// Create or Update a category (requires ADMIN role)
export const saveCategory = async (category) => {
  const body = JSON.stringify(category);
  return fetcher(`${BASE_URL}/categories`, {
    // Changed from `/categories/category`
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

// Get a category by title
export const getCategoryByTitle = async (title) => {
  return fetcher(`${BASE_URL}/categories/${title}`);
};

// Get all categories
export const getAllCategories = async () => {
  return fetcher(`${BASE_URL}/categories`);
};

// Delete a category by title (requires ADMIN role)
export const deleteCategory = async (title) => {
  return fetcher(`${BASE_URL}/categories/${title}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Create or Update a product (requires ADMIN role)
export const saveProduct = async (product) => {
  const body = JSON.stringify(product);
  return fetcher(`${BASE_URL}/products`, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json", // Ensure this is included
    },
  });
};

// Get a product by title
export const getProductByTitle = async (title) => {
  return fetcher(`${BASE_URL}/products/${title}`);
};

// Get all products
export const getAllProducts = async () => {
  return fetcher(`${BASE_URL}/products`);
};

// Delete a product by title (requires ADMIN role)
export const deleteProduct = async (title) => {
  return fetcher(`${BASE_URL}/products/${title}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

/** 🛒 User Cart APIs **/

// Add a product to the cart (requires ADMIN role)
export const addProductToCart = async (product) => {
  const body = JSON.stringify(product);
  return fetcher(`${BASE_URL}/carts/addProduct`, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Get the user's cart
export const getUserCart = async () => {
  return fetcher(`${BASE_URL}/carts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
