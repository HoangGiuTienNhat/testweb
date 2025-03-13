// Hàm lấy tham số truy vấn từ URL
function getQueryParam(param) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

window.onload = function() {
  const productId = getQueryParam("id");
  if (!productId) {
    document.body.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }
  let productNumber = productId.split('-')[1] || '';
  let productName = "Sản phẩm " + productNumber;
  // Sử dụng thumbSrc làm nguồn hiển thị (ảnh sẽ được CSS phóng to trong banner)
  let thumbSrc = `images/product${productNumber}-thumb.jpg`;
  let price = "113000";  // Giá mặc định
  let productDescription = localStorage.getItem(productId + "-description") || "Miêu tả sản phẩm " + productName;
  
  document.getElementById("detail-title").textContent = productName;
  document.getElementById("detail-image").src = thumbSrc;
  document.getElementById("detail-price").textContent = "Giá: " + price + " VND";
  document.getElementById("detail-description").textContent = productDescription;
  
  // Thu nhỏ header bằng cách thêm class "shrink" (animation qua CSS)
  const header = document.getElementById("detail-header");
  header.classList.add("shrink");
  
  // Load gợi ý sản phẩm khác
  loadSuggestions(productId);
};

function editDescription() {
  const productId = new URLSearchParams(window.location.search).get("id");
  const newDescription = prompt("Nhập mô tả sản phẩm:");
  if (newDescription) {
    localStorage.setItem(productId + "-description", newDescription);
    document.getElementById("detail-description").textContent = newDescription;
  }
}

function submitReview() {
  const rating = document.querySelector('input[name="rating"]:checked');
  const comment = document.getElementById("review-comment").value;
  if (rating) {
    const reviewsDiv = document.getElementById("reviews-list");
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.innerHTML = `<strong>Đánh giá: ${rating.value} sao</strong><p>${comment}</p>`;
    reviewsDiv.appendChild(reviewItem);
    document.getElementById("review-comment").value = "";
    document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
  } else {
    alert("Vui lòng chọn đánh giá sao.");
  }
}

// Load gợi ý: hiển thị 4 sản phẩm ngẫu nhiên khác với sản phẩm hiện tại
function loadSuggestions(currentProductId) {
  const suggestionContainer = document.querySelector(".suggestion-container");
  suggestionContainer.innerHTML = "";
  
  let suggestions = [];
  while (suggestions.length < 4) {
    let rand = Math.floor(Math.random() * 50) + 1;
    let pid = "product-" + rand;
    if (pid !== currentProductId && !suggestions.includes(pid)) {
      suggestions.push(pid);
    }
  }
  
  suggestions.forEach(pid => {
    let div = document.createElement("div");
    div.className = "suggestion-item";
    let img = document.createElement("img");
    img.src = `images/product${pid.split('-')[1]}-thumb.jpg`;
    img.onerror = function() {
      this.onerror = null;
      this.src = 'https://via.placeholder.com/150x100?text=Default+Cat';
    };
    let name = document.createElement("p");
    name.textContent = "Sản phẩm " + pid.split('-')[1];
    div.appendChild(img);
    div.appendChild(name);
    div.onclick = function() {
      window.location.href = "product.html?id=" + pid;
    };
    suggestionContainer.appendChild(div);
  });
}
