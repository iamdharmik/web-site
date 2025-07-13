// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
});

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Your cart is empty</h5>
                <p class="text-muted">Add some products to your cart to see them here.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        
        subtotalElement.textContent = '₹0';
        shippingElement.textContent = '₹0';
        taxElement.textContent = '₹0';
        totalElement.textContent = '₹0';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" class="me-3">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <p class="text-muted small mb-0">Price: ₹${item.price.toLocaleString()}</p>
            </div>
            <div class="quantity-controls me-3">
                <button class="quantity-decrease" data-product-id="${item.id}">-</button>
                <input type="number" class="quantity-input" data-product-id="${item.id}" value="${item.quantity}" min="1">
                <button class="quantity-increase" data-product-id="${item.id}">+</button>
            </div>
            <div class="me-3">
                <strong>₹${(item.price * item.quantity).toLocaleString()}</strong>
            </div>
            <button class="btn btn-danger btn-sm remove-from-cart" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    shippingElement.textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    taxElement.textContent = `₹${tax.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
    
    checkoutBtn.disabled = false;
    
    // Add event listeners for quantity controls
    setupQuantityControls();
}

function setupQuantityControls() {
    // Quantity decrease buttons
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const quantityInput = this.nextElementSibling;
            const currentQuantity = parseInt(quantityInput.value);
            
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
                updateCartQuantity(productId, currentQuantity - 1);
                updateCartDisplay();
            }
        });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const quantityInput = this.previousElementSibling;
            const currentQuantity = parseInt(quantityInput.value);
            
            quantityInput.value = currentQuantity + 1;
            updateCartQuantity(productId, currentQuantity + 1);
            updateCartDisplay();
        });
    });
    
    // Quantity input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.productId);
            const quantity = parseInt(this.value);
            
            if (quantity > 0) {
                updateCartQuantity(productId, quantity);
                updateCartDisplay();
            }
        });
    });
    
    // Remove from cart buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            removeFromCart(productId);
            updateCartDisplay();
        });
    });
}

function proceedToCheckout() {
    if (!currentUser) {
        showAlert('Please login to proceed to checkout', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'warning');
        return;
    }
    
    window.location.href = 'checkout.html';
}