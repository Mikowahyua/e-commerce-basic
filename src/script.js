
// ANIMASI WELCOME SECTION
document.addEventListener('DOMContentLoaded', function() {
    // Cek jika element welcome section ada
    const welcomeSection = document.getElementById('welcome-section');
    if (!welcomeSection) return;

    // Elemen yang akan dianimasikan
    const elementsToAnimate = [
        { element: document.getElementById('main-heading'), delay: 100 },
        { element: document.getElementById('sub-heading'), delay: 300 },
        { element: document.getElementById('description'), delay: 500 },
        { element: document.getElementById('button-container'), delay: 700 }
    ];

    // Fungsi untuk memulai animasi
    function startAnimations() {
        elementsToAnimate.forEach(item => {
            if (item.element) {
                setTimeout(() => {
                    item.element.classList.remove('opacity-0');
                    item.element.classList.remove('-translate-x-4');
                }, item.delay);
            }
        });
    }

    // Tambahkan efek hover pada tombol
    function addButtonEffects() {
        const shopButton = document.querySelector('#button-container button');
        if (shopButton) {
            shopButton.addEventListener('mouseenter', () => {
                shopButton.style.transform = 'scale(1.05)';
                shopButton.style.transition = 'transform 0.2s ease';
            });
            
            shopButton.addEventListener('mouseleave', () => {
                shopButton.style.transform = 'scale(1)';
            });
        }
    }

    // Jalankan animasi dan efek
    startAnimations();
    addButtonEffects();
});


// BUAT FLASH SALE//
document.addEventListener('DOMContentLoaded', () => {
    // Set waktu akhir flash sale (24 jam dari sekarang)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
  
    function updateCountdown() {
      const now = new Date();
      const diff = endTime - now;
  
      // Jika waktu sudah habis
      if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<div class="bg-red-600 text-white rounded-lg px-4 py-2">Flash Sale Ended!</div>';
        return;
      }
  
      // Hitung jam, menit, detik
      const hours = Math.floor(diff / (10000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
      // Tampilkan waktu
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
  
    // Update setiap detik
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  });



// KODE UNTUK HALAMAN INDEX/BERANDA
if (window.location.pathname.includes('index.html') || 
    window.location.pathname.includes('berandahome.html') || 
    window.location.pathname.includes('detail.html') || 
    window.location.pathname.includes('checkout.html') || 
    window.location.pathname.includes('hasilorder.html') || 
    window.location.pathname === '/') {
    
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    let semuaData = [];

    document.addEventListener('DOMContentLoaded', async () => {
        await loadProducts();
        updateCartCount();
        setupSearch();
        setupCartIcon();
    });

    async function loadProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            semuaData = await response.json();
            renderProducts(semuaData);
        } catch (err) {
            console.error("Gagal ambil data:", err);
        }
    }

    function renderProducts(products) {
        const container = document.getElementById("data-produk");
        if (!container) return;
        
        container.innerHTML = '';

        products.forEach(produk => {
            const el = document.createElement("div");
            el.className = "bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col";

            el.innerHTML = `
                <a href="detail.html?id=${produk.id}">
                    <img src="${produk.image}" alt="${produk.title}" class="w-32 h-36 mx-auto object-contain mb-3" />
                    <h3 class="font-semibold text-sm mb-1 line-clamp-2">${produk.title}</h3>
                    <p class="text-xs text-gray-500 mb-2 capitalize font-bold">${produk.category}</p>
                </a>
                <span class="font-bold text-black text-sm">$${produk.price}</span>
                <button onclick="tambahKeKeranjang(${produk.id}, event)" class="mt-2 bg-black text-white text-sm px-3 py-1 rounded">
                    + Keranjang
                </button>
            `;
            container.appendChild(el);
        });
    }

    // Fungsi untuk setup pencarian
    function setupSearch() {
        const searchInput = document.querySelector('.relative input[type="text"]');
        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length > 0) {
                const filteredProducts = semuaData.filter(produk => 
                    produk.title.toLowerCase().includes(searchTerm) || 
                    produk.category.toLowerCase().includes(searchTerm)
                );
                renderProducts(filteredProducts);
            } else {
                renderProducts(semuaData);
            }
        });
    }

    // Fungsi untuk setup ikon keranjang dengan badge
    function setupCartIcon() {
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (!cartLink) return;

        // Buat element badge jika belum ada
        if (!cartLink.querySelector('.cart-badge')) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
            cartLink.appendChild(badge);
            cartLink.style.position = 'relative'; // Untuk positioning badge
        }

        updateCartBadge();
    }

    // Update tampilan badge keranjang
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = keranjang.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    window.tambahKeKeranjang = function(productId, event) {
        event.preventDefault();
        event.stopPropagation();

        const produk = semuaData.find(p => p.id === productId);
        if (!produk) return;

        const existingItem = keranjang.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            keranjang.push({
                id: produk.id,
                title: produk.title,
                price: produk.price,
                image: produk.image,
                quantity: 1
            });
        }

        localStorage.setItem('keranjang', JSON.stringify(keranjang));
        updateCartCount();
        updateCartBadge();
        alert('Produk ditambahkan ke keranjang!');
    };

    function updateCartCount() {
        const totalItems = keranjang.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }
}


// KODE UNTUK HALAMAN DETAIL PRODUK
if (window.location.pathname.includes('detail.html')) {
    // ... (kode untuk halaman detail produk tetap sama)
    // Pastikan untuk memindahkan kode detail produk ke sini
}

// FUNGSI UMUM YANG DIGUNAKAN DI BERBAGAI HALAMAN
function changeImage(src) {
    const mainImage = document.getElementById('main-image');
    if (mainImage) mainImage.src = src;
}

 // Simple tab functionality
 document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent');
        });
        button.classList.add('border-blue-500', 'text-blue-600');
        button.classList.remove('border-transparent');
    });
});

// Change main product image
function changeImage(src) {
    document.getElementById('main-image').src = src;
}

// Quantity controls
document.getElementById('increase-qty').addEventListener('click', () => {
    const quantityElement = document.getElementById('quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantityElement.textContent = quantity + 1;
});

document.getElementById('decrease-qty').addEventListener('click', () => {
    const quantityElement = document.getElementById('quantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantityElement.textContent = quantity - 1;
    }
});


function formatRupiah(price) { //INI TADINYA RUPIAH DIGANTI JADI USD
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(price * 1); 
}

// Generate star rating HTML
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Load product data from FakeStore API
async function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        document.getElementById('product-container').innerHTML = '<div class="col-span-2 text-center py-12">Produk tidak ditemukan</div>';
        return;
    }
    
    try {
        // Fetch product details
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();
        
        if (!product || !product.id) {
            throw new Error('Product not found');
        }
        
        // Update product info
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = formatRupiah(product.price);
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-category').textContent = product.category;
        
        // Update rating
        document.getElementById('product-rating').innerHTML = generateRatingStars(product.rating.rate);
        document.getElementById('review-count').textContent = `(${product.rating.count} ulasan)`;
        
        // Update stock status
        document.getElementById('stock-status').textContent = 'Tersedia';
        
        // Update images
        const mainImage = document.getElementById('main-image');
        mainImage.src = product.image;
        mainImage.alt = product.title;
        
        const thumbnailGallery = document.getElementById('thumbnail-gallery');
        // FakeStore API only provides one image, so we'll create some variations
        thumbnailGallery.innerHTML = `
            <button onclick="changeImage('${product.image}')" class="flex-shrink-0 border-2 border-blue-500 rounded-lg overflow-hidden">
                <img src="${product.image}" class="w-20 h-20 object-contain">
            </button>
            <button onclick="changeImage('https://via.placeholder.com/600/771796')" class="flex-shrink-0 border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden">
                <img src="https://via.placeholder.com/150/771796" class="w-20 h-20 object-cover">
            </button>
            <button onclick="changeImage('https://via.placeholder.com/600/24f355')" class="flex-shrink-0 border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden">
                <img src="https://via.placeholder.com/150/24f355" class="w-20 h-20 object-cover">
            </button>
        `;
        
        // Update product details tab
        document.getElementById('product-details').innerHTML = `
            <h3 class="text-xl font-semibold mb-4">Detail Produk</h3>
            <p>${product.description}</p>
            <ul class="list-disc pl-5 mt-4">
                <li>Kategori: ${product.category}</li>
                <li>Rating: ${product.rating.rate} (${product.rating.count} ulasan)</li>
                <li>Harga: ${formatRupiah(product.price)}</li>
            </ul>
        `;
        
        // Load related products (from same category)
        loadRelatedProducts(product.category, product.id);
        
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-container').innerHTML = `
            <div class="col-span-2 text-center py-12">
                <h3 class="text-xl font-semibold mb-2">Gagal memuat produk</h3>
                <p class="text-gray-600">Silakan coba lagi nanti</p>
            </div>
        `;

        
    }
}

// Load related products from the same category
async function loadRelatedProducts(category, excludeId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`);
        const products = await response.json();
        
        // Filter out the current product and limit to 4 items
        const relatedProducts = products
            .filter(p => p.id !== excludeId)
            .slice(0, 4);
        
        const relatedProductsContainer = document.getElementById('related-products');
        
        if (relatedProducts.length === 0) {
            relatedProductsContainer.innerHTML = '<div class="col-span-4 text-center py-8">Tidak ada produk terkait</div>';
            return;
        }
        
        let productsHTML = '';
        
        relatedProducts.forEach(product => {
            productsHTML += `
                <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <a href="detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}" class="w-full h-80  object-contain p-4">
                        <div class="p-4">
                            <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">${product.title}</h3>
                            <div class="flex items-center mb-2">
                                <div class="flex text-yellow-400 text-xs">
                                    ${generateRatingStars(product.rating.rate)}
                                </div>
                                <span class="text-gray-500 text-xs ml-1">(${product.rating.count})</span>
                            </div>
                            <div class="flex items-center">
                                <span class="font-bold text-gray-900">${formatRupiah(product.price)}</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });
        
        relatedProductsContainer.innerHTML = productsHTML;
        
    } catch (error) {
        console.error('Error loading related products:', error);
        document.getElementById('related-products').innerHTML = `
            <div class="col-span-4 text-center py-8">
                Gagal memuat produk terkait
            </div>
        `;
    }
}



// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProductData();
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const addToCartBtn = document.getElementById('addToCartBtn');
    const checkoutBtn = document.getElementById('checkout-btn');
    let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

    if (productId) {
        try {
            const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
            const produk = await res.json();

            // Update UI dengan data produk
            document.getElementById('product-title').textContent = produk.title;
            document.getElementById('product-price').textContent = `$${produk.price.toFixed(2)}`;
            document.getElementById('product-description').textContent = produk.description;
            document.getElementById('main-image').src = produk.image;
            
            // Event listener untuk tombol tambah ke keranjang
            addToCartBtn.addEventListener('click', () => {
                const existingItem = keranjang.find(item => item.id == produk.id);
                const quantity = parseInt(document.getElementById('quantity').textContent);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    keranjang.push({
                        id: produk.id,
                        title: produk.title,
                        price: produk.price,
                        image: produk.image,
                        quantity: quantity
                    });
                }

                localStorage.setItem('keranjang', JSON.stringify(keranjang));
                alert(`Produk ditambahkan ke keranjang!`);
            });

            // Event listener untuk tombol checkout langsung
            checkoutBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').textContent);
                const checkoutItems = [{
                    id: produk.id,
                    title: produk.title,
                    price: produk.price,
                    image: produk.image,
                    quantity: quantity
                }];
                
                localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
                window.location.href = 'checkout.html';
            });

            // Event listener untuk tombol +/- quantity
            document.getElementById('increase-qty').addEventListener('click', () => {
                const quantityEl = document.getElementById('quantity');
                quantityEl.textContent = parseInt(quantityEl.textContent) + 1;
            });

            document.getElementById('decrease-qty').addEventListener('click', () => {
                const quantityEl = document.getElementById('quantity');
                const current = parseInt(quantityEl.textContent);
                if (current > 1) {
                    quantityEl.textContent = current - 1;
                }
            });

        } catch (error) {
            console.error("Gagal memuat detail produk:", error);
            alert("Terjadi kesalahan saat memuat detail produk");
        }
    }
});

