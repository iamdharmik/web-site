// Global variables
let cart = getCart();
let currentUser = getCurrentUser();

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateNavigation();
});

// Navigation functions
function updateNavigation() {
    const userNav = document.getElementById('user-nav');
    const guestNav = document.getElementById('guest-nav');
    const userName = document.getElementById('user-name');
    
    // Check if navigation elements exist before manipulating them
    if (!userNav || !guestNav || !userName) {
        return;
    }
    
    if (currentUser) {
        userNav.style.display = 'block';
        guestNav.style.display = 'none';
        userName.textContent = currentUser.name;
        
        // Show admin link if user is admin
        if (currentUser.role === 'admin') {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = '<a class="dropdown-item" href="admin/dashboard.html">Admin Dashboard</a>';
            const dropdownMenu = userNav.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                const divider = dropdownMenu.querySelector('.dropdown-divider');
                if (divider) {
                    dropdownMenu.insertBefore(adminLink, divider);
                }
            }
        }
    } else {
        userNav.style.display = 'none';
        guestNav.style.display = 'block';
    }
}

function logout() {
    logoutUser();
    currentUser = null;
    updateNavigation();
    window.location.href = 'index.html';
}

// Cart functions
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showAlert('Product not found!', 'danger');
        return;
    }
    
    if (product.stock <= 0) {
        showAlert('Product is out of stock!', 'warning');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showAlert('Cannot add more items. Stock limit reached!', 'warning');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    setCart(cart);
    updateCartCount();
    showAlert('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    updateCartCount();
    showAlert('Product removed from cart!', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        
        if (quantity > product.stock) {
            showAlert('Cannot add more items. Stock limit reached!', 'warning');
            return;
        }
        
        item.quantity = Math.max(1, quantity);
        setCart(cart);
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    setCart(cart);
    updateCartCount();
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Check if user is logged in
function requireLogin() {
    if (!currentUser) {
        showAlert('Please login to continue', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}

// Check if user is admin
function requireAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('Access denied. Admin privileges required.', 'danger');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return false;
    }
    return true;
}