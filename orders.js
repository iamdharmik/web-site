// Orders page functionality
let allOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!requireLogin()) {
        return;
    }
    
    loadOrders();
    setupEventListeners();
});

function loadOrders() {
    const orders = getOrders();
    allOrders = orders.filter(order => order.userId === currentUser.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    displayOrders(allOrders);
}

function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No orders found</h5>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="card mb-4 order-card">
            <div class="card-header">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6 class="mb-0">Order #${order.id}</h6>
                        <small class="text-muted">${formatDate(order.createdAt)}</small>
                    </div>
                    <div class="col-md-3">
                        <span class="badge bg-${getStatusColor(order.status)} fs-6">${order.status.toUpperCase()}</span>
                    </div>
                    <div class="col-md-3">
                        <strong>₹${order.total.toLocaleString()}</strong>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails(${order.id})">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h6>Items (${order.items.length})</h6>
                        <div class="order-items">
                            ${order.items.slice(0, 3).map(item => `
                                <div class="d-flex align-items-center mb-2">
                                    <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded">
                                    <div>
                                        <small class="fw-bold">${item.name}</small>
                                        <br>
                                        <small class="text-muted">Qty: ${item.quantity} × ₹${item.price.toLocaleString()}</small>
                                    </div>
                                </div>
                            `).join('')}
                            ${order.items.length > 3 ? `<small class="text-muted">+${order.items.length - 3} more items</small>` : ''}
                        </div>
                    </div>
                    <div class="col-md-4">
                        <h6>Shipping Address</h6>
                        <address class="small">
                            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                            <i class="fas fa-phone me-1"></i>${order.shippingAddress.phone}
                        </address>
                    </div>
                </div>
                
                <!-- Order Progress -->
                <div class="mt-3">
                    <div class="progress-container">
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-${getStatusColor(order.status)}" 
                                 style="width: ${getProgressWidth(order.status)}%"></div>
                        </div>
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted">Order Placed</small>
                            <small class="text-muted">Processing</small>
                            <small class="text-muted">Shipped</small>
                            <small class="text-muted">Delivered</small>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="mt-3 d-flex gap-2">
                    ${getOrderActions(order)}
                </div>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            if (status === 'all') {
                displayOrders(allOrders);
            } else {
                const filteredOrders = allOrders.filter(order => order.status === status);
                displayOrders(filteredOrders);
            }
        });
    }
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modalContent = document.getElementById('orderDetailsContent');
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Order Information</h6>
                <table class="table table-sm">
                    <tr><td><strong>Order ID:</strong></td><td>#${order.id}</td></tr>
                    <tr><td><strong>Date:</strong></td><td>${formatDate(order.createdAt)}</td></tr>
                    <tr><td><strong>Status:</strong></td><td><span class="badge bg-${getStatusColor(order.status)}">${order.status.toUpperCase()}</span></td></tr>
                    <tr><td><strong>Payment Method:</strong></td><td>${order.paymentMethod || 'Card'}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Shipping Address</h6>
                <address>
                    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                    ${order.shippingAddress.address}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                    <i class="fas fa-phone me-1"></i>${order.shippingAddress.phone}<br>
                    <i class="fas fa-envelope me-1"></i>${order.shippingAddress.email}
                </address>
            </div>
        </div>
        
        <hr>
        
        <h6>Order Items</h6>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2 rounded">
                                    <div>
                                        <div class="fw-bold">${item.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td>₹${item.price.toLocaleString()}</td>
                            <td>${item.quantity}</td>
                            <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Total Amount</th>
                        <th>₹${order.total.toLocaleString()}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    // Show track order button for shipped orders
    const trackBtn = document.getElementById('trackOrderBtn');
    if (order.status === 'shipped' || order.status === 'delivered') {
        trackBtn.style.display = 'block';
        trackBtn.onclick = () => trackOrder(orderId);
    } else {
        trackBtn.style.display = 'none';
    }
    
    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'warning';
        case 'processing': return 'info';
        case 'shipped': return 'primary';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

function getProgressWidth(status) {
    switch (status) {
        case 'pending': return 25;
        case 'processing': return 50;
        case 'shipped': return 75;
        case 'delivered': return 100;
        case 'cancelled': return 0;
        default: return 0;
    }
}

function getOrderActions(order) {
    let actions = '';
    
    switch (order.status) {
        case 'pending':
            actions = `
                <button class="btn btn-outline-danger btn-sm" onclick="cancelOrder(${order.id})">
                    <i class="fas fa-times me-1"></i>Cancel Order
                </button>
            `;
            break;
        case 'processing':
            actions = `
                <button class="btn btn-outline-info btn-sm" onclick="contactSupport(${order.id})">
                    <i class="fas fa-headset me-1"></i>Contact Support
                </button>
            `;
            break;
        case 'shipped':
            actions = `
                <button class="btn btn-outline-primary btn-sm" onclick="trackOrder(${order.id})">
                    <i class="fas fa-truck me-1"></i>Track Order
                </button>
            `;
            break;
        case 'delivered':
            actions = `
                <button class="btn btn-outline-success btn-sm" onclick="reorderItems(${order.id})">
                    <i class="fas fa-redo me-1"></i>Reorder
                </button>
                <button class="btn btn-outline-warning btn-sm" onclick="returnOrder(${order.id})">
                    <i class="fas fa-undo me-1"></i>Return
                </button>
            `;
            break;
    }
    
    return actions;
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            setOrders(orders);
            loadOrders();
            showAlert('Order cancelled successfully', 'info');
        }
    }
}

function trackOrder(orderId) {
    showAlert('Tracking: Your order is on the way! Expected delivery: Tomorrow', 'info');
}

function contactSupport(orderId) {
    showAlert('Support ticket created for Order #' + orderId, 'info');
}

function reorderItems(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        // Add items to cart
        order.items.forEach(item => {
            addToCart(item.id);
        });
        showAlert('Items added to cart!', 'success');
    }
}

function returnOrder(orderId) {
    showAlert('Return request submitted for Order #' + orderId, 'info');
}