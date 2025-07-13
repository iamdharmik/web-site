// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!requireLogin()) {
        return;
    }
    
    loadOrderSummary();
    setupPaymentMethodToggle();
    setupFormValidation();
    loadUserInfo();
});

function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-muted">No items in cart</p>';
        return;
    }
    
    // Display order items
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded">
                <div>
                    <small class="fw-bold">${item.name}</small>
                    <br>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
            </div>
            <span class="fw-bold">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    shippingElement.textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    taxElement.textContent = `₹${tax.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
}

function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    const upiDetails = document.getElementById('upiDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                upiDetails.style.display = 'none';
            } else if (this.value === 'upi') {
                cardDetails.style.display = 'none';
                upiDetails.style.display = 'block';
            }
        });
    });
}

function setupFormValidation() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Pincode validation
    const pincode = document.getElementById('pincode');
    if (pincode) {
        pincode.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
}

function loadUserInfo() {
    if (currentUser) {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.value = currentUser.email || '';
        }
        
        // Pre-fill other fields if user data is available
        if (currentUser.name) {
            const nameParts = currentUser.name.split(' ');
            const firstNameField = document.getElementById('firstName');
            const lastNameField = document.getElementById('lastName');
            
            if (firstNameField && nameParts.length > 0) {
                firstNameField.value = nameParts[0];
            }
            if (lastNameField && nameParts.length > 1) {
                lastNameField.value = nameParts.slice(1).join(' ');
            }
        }
        
        if (currentUser.phone) {
            const phoneField = document.getElementById('phone');
            if (phoneField) {
                phoneField.value = currentUser.phone;
            }
        }
        
        if (currentUser.address) {
            const addressField = document.getElementById('address');
            if (addressField) {
                addressField.value = currentUser.address;
            }
        }
    }
}

function placeOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Validate payment method specific fields
    const paymentMethod = formData.get('paymentMethod');
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            showAlert('Please fill in all card details', 'danger');
            return;
        }
    } else if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId) {
            showAlert('Please enter UPI ID', 'danger');
            return;
        }
    }
    
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'warning');
        return;
    }
    
    // Prepare order data
    const shippingAddress = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode')
    };
    
    const subtotal = getCartTotal();
    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    
    // Create new order
    const orders = getOrders();
    const newOrder = {
        id: orders.length + 1,
        userId: currentUser.id,
        items: [...cart],
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod
    };
    
    orders.push(newOrder);
    setOrders(orders);
    
    // Update product stock
    const products = getProducts();
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });
    setProducts(products);
    
    // Clear cart
    clearCart();
    
    // Show success message
    showAlert('Order placed successfully!', 'success');
    
    // Redirect to orders page
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 2000);
}