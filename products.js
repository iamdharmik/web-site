// Products page functionality
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProducts();
    setupEventListeners();
});

function loadCategories() {
    const categories = getCategories();
    const categorySelect = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

function loadProducts() {
    allProducts = getProducts();
    filteredProducts = [...allProducts];
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        document.getElementById('categoryFilter').value = categoryParam;
        applyFilters();
    } else {
        displayProducts();
        updatePagination();
    }
}

function displayProducts() {
    const container = document.getElementById('products-container');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found matching your criteria.</div></div>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="text-primary mb-0">₹${product.price.toLocaleString()}</h6>
                            <small class="text-muted">${product.category}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <small class="text-muted">Stock: ${product.stock}</small>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})" 
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> 
                                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts();
    updatePagination();
    
    // Scroll to top of products section
    document.querySelector('.col-lg-9').scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceRange').value;
    
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = category === 'all' || product.category === category;
        
        // Price filter
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const price = product.price;
            switch (priceRange) {
                case '0-1000':
                    matchesPrice = price < 1000;
                    break;
                case '1000-5000':
                    matchesPrice = price >= 1000 && price < 5000;
                    break;
                case '5000-20000':
                    matchesPrice = price >= 5000 && price < 20000;
                    break;
                case '20000-50000':
                    matchesPrice = price >= 20000 && price < 50000;
                    break;
                case '50000+':
                    matchesPrice = price >= 50000;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Apply sorting
    const sortBy = document.getElementById('sortBy').value;
    sortProducts(sortBy);
    
    currentPage = 1;
    displayProducts();
    updatePagination();
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
}

function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
    
    // Sort select
    document.getElementById('sortBy').addEventListener('change', applyFilters);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceRange').value = 'all';
    document.getElementById('sortBy').value = 'name';
    
    filteredProducts = [...allProducts];
    currentPage = 1;
    displayProducts();
    updatePagination();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}