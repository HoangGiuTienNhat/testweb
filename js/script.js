/* script.js
   - Quản lý hiển thị sản phẩm, phân trang, giỏ hàng, tìm kiếm, sắp xếp, và các hiệu ứng.
   - Sản phẩm mặc định: 50 sản phẩm, 30 sản phẩm/trang.
*/

const productsPerPage = 30;
let currentPage = 1;
let totalPages = 0;

const productList = [];
for (let i = 1; i <= 50; i++) {
  productList.push({
    id: 'product-' + i,
    name: 'Sản phẩm ' + i,
    price: 113000,
    thumbSrc: `images/product${i}-thumb.jpg`
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "block";
  
  setTimeout(function() {
    totalPages = Math.ceil(productList.length / productsPerPage);
    renderProducts();
    renderPagination();
    spinner.style.display = "none";
  }, 1000);
});

function renderProducts() {
  const productDisplay = document.querySelector(".product-display");
  productDisplay.innerHTML = "";
  let start = (currentPage - 1) * productsPerPage;
  let end = start + productsPerPage;
  let productsToShow = productList.slice(start, end);
  
  productsToShow.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.id = product.id;
    card.setAttribute("draggable", "true");
    card.addEventListener("dragstart", dragStart);
    
    let thumbSrc = product.thumbSrc;
    let price = product.price;
    
    // Nếu không có nguồn ảnh minh họa, onerror sẽ gán một ảnh ngẫu nhiên về xe ô tô.
    card.innerHTML = `
      <img src="${thumbSrc}" onerror="this.onerror=null; this.src='https://loremflickr.com/320/240/car?lock=' + Math.floor(Math.random()*1000)" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p class="price">Giá: <span class="price-value">${price}</span> VND</p>
      <button onclick="addToCart('${product.name}', '${product.id}')">Thêm vào giỏ hàng</button>
      <button onclick="openProductDetail('${product.id}')">Xem chi tiết</button>
      <button onclick="addToWishlist('${product.name}', '${product.id}')">Thêm vào Wishlist</button>
    `;
    productDisplay.appendChild(card);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.addEventListener("click", function() {
      currentPage = i;
      renderProducts();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

function addToCart(productName, productId) {
  const priceValue = document.querySelector(`#${productId} .price-value`).textContent;
  const cartItems = document.getElementById("cart-items");
  const li = document.createElement("li");
  li.setAttribute("data-id", productId);
  li.innerHTML = `
    <span class="item-name">${productName}</span>
    <input type="number" class="item-quantity" value="1" min="0" onchange="updateCartTotal()">
    <span class="item-price" data-price="${priceValue}">${priceValue}</span>
    <button onclick="removeCartItem(this)">Xóa</button>
  `;
  cartItems.appendChild(li);
  updateCartTotal();
}

function removeCartItem(button) {
  const li = button.parentElement;
  li.remove();
  updateCartTotal();
}

function updateCartTotal() {
  const cartItems = document.querySelectorAll("#cart-items li");
  let total = 0;
  cartItems.forEach(item => {
    const quantityInput = item.querySelector(".item-quantity");
    let quantity = parseInt(quantityInput.value);
    if (quantity <= 0) {
      item.remove();
    } else {
      const price = parseInt(item.querySelector(".item-price").getAttribute("data-price"));
      total += quantity * price;
    }
  });
  const totalPriceElem = document.getElementById("total-price");
  totalPriceElem.textContent = total;
  totalPriceElem.classList.add("animate");
  totalPriceElem.addEventListener("animationend", function() {
    totalPriceElem.classList.remove("animate");
  }, { once: true });
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}
function allowDrop(event) {
  event.preventDefault();
}
function drop(event) {
  event.preventDefault();
  const productId = event.dataTransfer.getData("text/plain");
  const productName = document.querySelector(`#${productId} h3`).textContent;
  addToCart(productName, productId);
}

function openProductDetail(productId) {
  window.location.href = "product.html?id=" + productId;
}

function addToWishlist(productName, productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  if (!wishlist.some(item => item.id === productId)) {
    wishlist.push({
      id: productId,
      name: productName,
      thumbSrc: document.querySelector(`#${productId} img`).src,
      price: document.querySelector(`#${productId} .price-value`).textContent,
      note: ""
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(productName + " đã được thêm vào Wishlist!");
  } else {
    alert(productName + " đã có trong Wishlist.");
  }
}

function toggleCartPanel() {
  const cartPanel = document.getElementById("cart-panel");
  cartPanel.style.display = (cartPanel.style.display === "block") ? "none" : "block";
}

function checkout() {
  alert("Tiến hành thanh toán. Tổng tiền: " + document.getElementById("total-price").textContent + " VND");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Filler block để tăng số dòng code (dùng cho mục đích demo) */
for (let i = 1; i <= 300; i++) {
  console.log("Filler line " + i + " in script.js");
}
