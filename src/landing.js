    // KODE UNTUK HALAMAN INDEX/BERANDA
    if (window.location.pathname.includes('index.html') ||
        window.location.pathname.includes('berandahome.html') ||
        window.location.pathname.includes('detail.html') ||
        window.location.pathname.includes('checkout.html') ||
        window.location.pathname.includes('hasilorder.html') ||
        window.location.pathname === '/') {

        let keranjang = JSON.parse(localStorage.getItem('keranjang')) || []; // jika nanti memang diberlakukan
        let semuaData = [];

        document.addEventListener('DOMContentLoaded', async () => {
            await loadProducts();
            updateCartCount();
            setupSearch();
            setupCartIcon();
        });

        // Fungsi untuk mengambil data produk dari API
        async function loadProducts() {
            try {
                const response = await fetch("https://fakestoreapi.com/products");

                semuaData = await response.json();

                renderProducts(semuaData);
            } catch (err) {
                console.error("Gagal ambil data.", err);
            }
        }

        // Fungsi untuk menampilkan daftar produk
        function renderProducts(products) {
            const container = document.getElementById("produk-landing");

            if (!container) return;

            container.innerHTML = '';
            products.forEach(produk => {
                const el = document.createElement("div");

                el.className = "bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col";

                el.innerHTML = `
                <a href="#" onclick="redirectToLogin()">
                    <img src="${produk.image}" alt="${produk.title}" class="w-32 h-36 mx-auto object-contain mb-3" />
                </a>
                <h3 class="font-semibold text-sm mb-1 line-clamp-2"><a href="#" onclick="redirectToLogin()">${produk.title}</a></h3>
                <p class="text-xs text-gray-500 mb-2 capitalize font-semibold">${produk.category}</p>                                
                <span class="font-semibold text-black text-sm">$${produk.price}</span>
                <button onclick="redirectToLogin()" class="mt-2 bg-black text-white text-sm px-3 py-1 rounded">
                    + Keranjang
                </button>
            `;
                container.appendChild(el);
            });
        }

        // Fungsi untuk mencari produk
        function setupSearch() {
            const searchInput = document.querySelector('.relative input[type="text"]');
            if (!searchInput) return;

            searchInput.addEventListener('input', function () {
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

        // Fungsi untuk redirected ke login
        function redirectToLogin() {
            window.location.href = "masuk.html";
        }
    }

