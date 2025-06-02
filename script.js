const BACKEND_URL = "https://joyboynosekai-backend.onrender.com";

const productContainer = document.getElementById("product-container");
const navLinks = document.querySelectorAll(".nav-menu a[data-category]");
const searchInput = document.getElementById("search-input");
const themeToggle = document.getElementById("themeToggle");

let allProducts = [];

// Fetch products from backend
async function fetchProducts() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/products`);
    if (!response.ok) throw new Error("Network response was not ok");
    const products = await response.json();
    allProducts = products;
    displayProducts(products);
  } catch (error) {
    productContainer.innerHTML = `<p style="color: red; text-align:center;">Failed to load products. Please try again later.</p>`;
    console.error("Fetch error:", error);
  }
}

// Display products in the container
function displayProducts(products) {
  if (products.length === 0) {
    productContainer.innerHTML = "<p style='text-align:center;'>No products found.</p>";
    return;
  }

  productContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="images/${product.category.toLowerCase()}/${product.image}" alt="${product.name}" loading="lazy" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>R${product.price.toFixed(2)}</strong></p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;

    productContainer.appendChild(card);
  });
}

// Filter products by category
function filterByCategory(category) {
  if (!category) {
    displayProducts(allProducts);
    return;
  }
  const filtered = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  displayProducts(filtered);
}

// Search products by name or description
function searchProducts() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    displayProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );

  displayProducts(filtered);
}

// Add product to cart (simple localStorage implementation)
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

// Event listeners for category navigation
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = e.target.getAttribute("data-category");
    filterByCategory(category);

    // Update active link styling
    navLinks.forEach(lnk => lnk.classList.remove("active"));
    e.target.classList.add("active");
  });
});

// Search input listener (search on enter key)
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchProducts();
  }
});

// Optional: You can add a search button listener if you add a button for search

// Theme toggle button functionality
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});

// On page load, set theme from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  fetchProducts();
});
