// slider function
let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const indicators = document.querySelectorAll(".indicator");

function showSlide(index) {
  // Remove active classes
  slides[currentIndex].classList.remove("active");
  indicators[currentIndex].classList.remove("active");

  // Update currentIndex and add active classes
  currentIndex = index;
  slides[currentIndex].classList.add("active");
  indicators[currentIndex].classList.add("active");

  // Move slides container to show the selected slide
  document.querySelector(".slides").style.transform = `translateX(-${
    currentIndex * 100
  }%)`;
}
setInterval(() => {
  let nextIndex = (currentIndex + 1) % slides.length;
  showSlide(nextIndex);
}, 3000);

// Get elements
const wishlistBtn = document.getElementById("wishlist-btn");
const cartBtn = document.getElementById("cart-btn");
const wishlist = document.getElementById("wishlist");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const closeWishlist = document.getElementById("close-wishlist");
const closeCart = document.getElementById("close-cart");

// Function to open aside
function openAside(aside) {
  aside.classList.add("active");
  overlay.classList.add("active");
}

// Function to close aside
function closeAside() {
  wishlist.classList.remove("active");
  cart.classList.remove("active");
  overlay.classList.remove("active");
}

// Event Listeners
wishlistBtn.addEventListener("click", () => openAside(wishlist));
cartBtn.addEventListener("click", () => openAside(cart));

closeWishlist.addEventListener("click", closeAside);
closeCart.addEventListener("click", closeAside);
overlay.addEventListener("click", closeAside);
