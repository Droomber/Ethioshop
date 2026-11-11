document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#products-grid");
  if (!grid) return;
  const search = document.querySelector("#search");
  const categorySelect = document.querySelector("#category");
  const sort = document.querySelector("#sort");
  const count = document.querySelector("#result-count");
  const errorBox = document.querySelector("#shop-error");
  const categoryButtons = [...document.querySelectorAll("[data-category]")];
  let allProducts = [];
  let activeCategory = new URLSearchParams(location.search).get("category") || "";
  let timer;

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = value => `ETB ${Number(value || 0).toLocaleString("en-ET")}`;
  const setCategory = value => {
    activeCategory = value;
    categoryButtons.forEach(button => button.classList.toggle("active", button.dataset.category === value));
    if (categorySelect) categorySelect.value = value;
    const heading = document.querySelector(".results-heading h2");
    if (heading) heading.innerHTML = `${escapeHTML(value || "All products")} <span class="heading-dot">.</span>`;
    render();
  };

  function render() {
    const term = (search?.value || "").trim().toLowerCase();
    let items = allProducts.filter(product => {
      const haystack = [product.name, product.description, product.category, product.brand].join(" ").toLowerCase();
      return (!activeCategory || product.category === activeCategory) && (!term || haystack.includes(term));
    });
    switch (sort?.value) {
      case "price-low": items.sort((a,b) => Number(a.price)-Number(b.price)); break;
      case "price-high": items.sort((a,b) => Number(b.price)-Number(a.price)); break;
      case "name": items.sort((a,b) => String(a.name).localeCompare(String(b.name))); break;
    }
    if (count) count.textContent = `${items.length} ${items.length === 1 ? "product" : "products"}`;
    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML = `<div class="empty-shop"><span>⌕</span><h3>No products found</h3><p>Try another search or choose a different collection.</p><button class="btn" id="clear-filters">Clear filters</button></div>`;
      grid.querySelector("#clear-filters").addEventListener("click", () => { if(search) search.value=""; setCategory(""); });
      return;
    }
    items.forEach((product, index) => {
      const card = document.createElement("article");
      card.className = "product-tile";
      const image = escapeHTML(product.image || "https://placehold.co/700x700?text=EthioMarket");
      const soldOut = Number(product.stock) < 1;
      card.innerHTML = `<a class="tile-image" href="product.html?id=${encodeURIComponent(product._id)}"><img src="${image}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.src='https://placehold.co/700x700?text=Image+unavailable'"><span class="tile-index">${String(index+1).padStart(2,"0")}</span>${soldOut ? '<span class="tile-badge sold">SOLD OUT</span>' : '<span class="tile-badge">LOCAL FIND ✳</span>'}</a><div class="tile-info"><div class="tile-meta"><span>${escapeHTML(product.category || "COLLECTION")}</span><span>${product.stock > 0 ? "IN STOCK" : "UNAVAILABLE"}</span></div><a href="product.html?id=${encodeURIComponent(product._id)}"><h3>${escapeHTML(product.name)}</h3></a><p>${escapeHTML(product.brand || "EthioMarket Select")}</p><div class="tile-bottom"><strong>${money(product.price)}</strong><button class="tile-add" type="button" ${soldOut ? "disabled" : ""} aria-label="Add ${escapeHTML(product.name)} to bag">${soldOut ? "—" : "+ Add"}</button></div></div>`;
      card.querySelector(".tile-add")?.addEventListener("click", () => {
        if (typeof addToCart === "function") addToCart(product);
        else location.href = "login.html";
      });
      grid.appendChild(card);
    });
  }

  async function loadProducts() {
    try {
      const data = await api("/products");
      allProducts = Array.isArray(data.products) ? data.products : [];
      if (count) count.textContent = `${allProducts.length} products`;
      setCategory(activeCategory);
    } catch (error) {
      if (count) count.textContent = "Collection unavailable";
      if (errorBox) errorBox.textContent = `${error.message}. Check that the backend is running and the API URL is configured in js/app.js.`;
      grid.innerHTML = `<div class="empty-shop"><span>↗</span><h3>We couldn't load the collection</h3><p>Make sure EthioMarket's API is running, then refresh this page.</p><button class="btn" id="retry-products">Try again</button></div>`;
      grid.querySelector("#retry-products")?.addEventListener("click", loadProducts);
    }
  }

  search?.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(render, 180); });
  sort?.addEventListener("change", render);
  categorySelect?.addEventListener("change", () => setCategory(categorySelect.value));
  categoryButtons.forEach(button => button.addEventListener("click", () => setCategory(button.dataset.category)));
  setCategory(activeCategory);
  loadProducts();
});
