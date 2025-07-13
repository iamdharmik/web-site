// Admin dashboard functionality
let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    if (!requireAdmin()) {
        return;
    }
    
    loadDashboardData();
});

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentSection = sectionName;
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'categories':
            loadCategories();
            break;
    }
}

function loadDashboardData() {
    const products = getProducts();
    const users = getUsers().filter(u => u.role === 'customer');
    const orders = getOrders();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Update stats
    const totalOrdersElement = document.getElementById('total-orders');
    const totalUsersElement = document.getElementById('total-users');
    const totalProductsElement = document.getElementById('total-products');
    const totalRevenueElement = document.getElementById('total-revenue');
    
    if (totalOrdersElement) totalOrdersElement.textContent = orders.length;
    if (totalUsersElement) totalUsersElement.textContent = users.length;
    if (totalProductsElement) totalProductsElement.textContent = products.length;
    if (totalRevenueElement) totalRevenueElement.textContent = `₹${totalRevenue.toLocaleString()}`;
    
    // Load recent orders
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersTable = document.getElementById('recent-orders');
    
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = recentOrders.map(order => {
            const user = users.find(u => u.id === order.userId) || { name: 'Unknown' };
            return `
                <tr>
                    <td>#${order.id}</td>
                    <td>${user.name}</td>
                    <td>₹${order.total.toLocaleString()}</td>
                    <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                </tr>
            `;
        }).join('');
    }
    
    // Load low stock products
    const lowStockProducts = products.filter(p => p.stock < 10);
    const lowStockTable = document.getElementById('low-stock-products');
    
    if (lowStockTable) {
        lowStockTable.innerHTML = lowStockProducts.map(product => `
            <tr>
                <td>${product.name}</td>
                <td><span class="badge bg-warning">${product.stock}</span></td>
                <td><button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Update</button></td>
            </tr>
        `).join('');
    }
}

function loadProducts() {
    const products = getProducts();
    const productsTable = document.getElementById('products-table');
    
    if (productsTable) {
        productsTable.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function loadOrders() {
    const orders = getOrders();
    const users = getUsers();
    const ordersTable = document.getElementById('orders-table');
    
    if (ordersTable) {
        ordersTable.innerHTML = orders.map(order => {
            const user = users.find(u => u.id === order.userId) || { name: 'Unknown', email: 'Unknown' };
            return `
                <tr>
                    <td>#${order.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>₹${order.total.toLocaleString()}</td>
                    <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                    <td>${formatDate(order.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-info me-1" onclick="viewOrder(${order.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="updateOrderStatus(${order.id})">
                            <i class="fas fa-check"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function loadUsers() {
    const users = getUsers().filter(u => u.role === 'customer');
    const usersTable = document.getElementById('users-table');
    
    if (usersTable) {
        usersTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function loadCategories() {
    const categories = getCategories();
    const categoriesTable = document.getElementById('categories-table');
    
    if (categoriesTable) {
        categoriesTable.innerHTML = categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function showAddProductModal() {
    const form = document.getElementById('productForm');
    if (form) {
        form.reset();
        document.querySelector('#productModal .modal-title').textContent = 'Add Product';
        new bootstrap.Modal(document.getElementById('productModal')).show();
    }
}

function saveProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const products = getProducts();
    const newProduct = {
        id: products.length + 1,
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        image: formData.get('image') || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    products.push(newProduct);
    setProducts(products);
    
    showAlert('Product added successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    loadProducts();
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = getProducts();
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        
        showAlert('Product deleted successfully!', 'success');
        loadProducts();
    }
}

function updateOrderStatus(orderId) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        const currentStatus = orders[orderIndex].status;
        let newStatus;
        
        switch (currentStatus) {
            case 'pending':
                newStatus = 'processing';
                break;
            case 'processing':
                newStatus = 'shipped';
                break;
            case 'shipped':
                newStatus = 'delivered';
                break;
            default:
                return;
        }
        
        orders[orderIndex].status = newStatus;
        setOrders(orders);
        
        showAlert(`Order status updated to ${newStatus}!`, 'success');
        loadOrders();
    }
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

// Placeholder functions for future implementation
function editProduct(productId) {
    showAlert('Edit product feature coming soon!', 'info');
}

function viewOrder(orderId) {
    showAlert('View order details feature coming soon!', 'info');
}

function editUser(userId) {
    showAlert('Edit user feature coming soon!', 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        showAlert('Delete user feature coming soon!', 'info');
    }
}

function showAddCategoryModal() {
    showAlert('Add category feature coming soon!', 'info');
}

function editCategory(categoryId) {
    showAlert('Edit category feature coming soon!', 'info');
}

function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        showAlert('Delete category feature coming soon!', 'info');
    }
}