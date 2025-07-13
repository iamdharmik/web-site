// Sample data for the e-commerce website
// This simulates a database using localStorage

// Initialize sample data
function initializeData() {
    // Sample users
    const users = [
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@shopease.com',
            password: 'admin123',
            phone: '9876543210',
            address: 'Admin Office, Mumbai, India',
            role: 'admin',
            joinDate: '2024-01-01'
        },
        {
            id: 2,
            name: 'Demo User',
            email: 'user@shopease.com',
            password: 'user123',
            phone: '9876543211',
            address: 'Demo Address, Delhi, India',
            role: 'customer',
            joinDate: '2024-01-15'
        }
    ];

    // Sample products
    const products = [
        {
            id: 1,
            name: 'Smartphone',
            price: 25999,
            description: 'Latest Android smartphone with 128GB storage',
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 50
        },
        {
            id: 2,
            name: 'Laptop',
            price: 45999,
            description: 'High-performance laptop for work and gaming',
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
            stock: 30
        },
        {
            id: 3,
            name: 'Wireless Headphones',
            price: 8999,
            description: 'Premium noise-cancelling wireless headphones',
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 75
        },
        {
            id: 4,
            name: 'T-Shirt',
            price: 599,
            description: 'Comfortable cotton t-shirt',
            category: 'Clothing',
            image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 100
        },
        {
            id: 5,
            name: 'Jeans',
            price: 1999,
            description: 'Premium denim jeans',
            category: 'Clothing',
            image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 80
        },
        {
            id: 6,
            name: 'Coffee Maker',
            price: 3999,
            description: 'Automatic coffee maker with timer',
            category: 'Home & Kitchen',
            image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 25
        },
        {
            id: 7,
            name: 'Blender',
            price: 2499,
            description: 'High-speed blender for smoothies',
            category: 'Home & Kitchen',
            image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 40
        },
        {
            id: 8,
            name: 'Programming Book',
            price: 899,
            description: 'Learn web development from scratch',
            category: 'Books',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 60
        },
        {
            id: 9,
            name: 'Running Shoes',
            price: 3499,
            description: 'Comfortable running shoes for daily exercise',
            category: 'Sports',
            image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 45
        },
        {
            id: 10,
            name: 'Yoga Mat',
            price: 1299,
            description: 'Non-slip yoga mat for home workouts',
            category: 'Sports',
            image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 35
        }
    ];

    // Sample categories
    const categories = [
        { id: 1, name: 'Electronics', description: 'Latest electronic gadgets' },
        { id: 2, name: 'Clothing', description: 'Fashion and apparel' },
        { id: 3, name: 'Home & Kitchen', description: 'Home appliances and kitchen items' },
        { id: 4, name: 'Books', description: 'Books and educational materials' },
        { id: 5, name: 'Sports', description: 'Sports equipment and accessories' }
    ];

    // Sample orders
    const orders = [
        {
            id: 1,
            userId: 2,
            items: [
                { id: 1, name: 'Smartphone', price: 25999, quantity: 1, image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ],
            total: 25999,
            status: 'delivered',
            createdAt: '2024-01-20T10:30:00Z',
            shippingAddress: {
                firstName: 'Demo',
                lastName: 'User',
                email: 'user@shopease.com',
                phone: '9876543211',
                address: 'Demo Address',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001'
            },
            paymentMethod: 'card'
        },
        {
            id: 2,
            userId: 2,
            items: [
                { id: 4, name: 'T-Shirt', price: 599, quantity: 2, image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { id: 5, name: 'Jeans', price: 1999, quantity: 1, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ],
            total: 3197,
            status: 'shipped',
            createdAt: '2024-01-25T14:15:00Z',
            shippingAddress: {
                firstName: 'Demo',
                lastName: 'User',
                email: 'user@shopease.com',
                phone: '9876543211',
                address: 'Demo Address',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001'
            },
            paymentMethod: 'upi'
        }
    ];

    // Store in localStorage if not already present
    if (!localStorage.getItem('shopease_users')) {
        localStorage.setItem('shopease_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('shopease_products')) {
        localStorage.setItem('shopease_products', JSON.stringify(products));
    }
    if (!localStorage.getItem('shopease_categories')) {
        localStorage.setItem('shopease_categories', JSON.stringify(categories));
    }
    if (!localStorage.getItem('shopease_orders')) {
        localStorage.setItem('shopease_orders', JSON.stringify(orders));
    }
    if (!localStorage.getItem('shopease_cart')) {
        localStorage.setItem('shopease_cart', JSON.stringify([]));
    }
}

// Data access functions
function getUsers() {
    return JSON.parse(localStorage.getItem('shopease_users') || '[]');
}

function setUsers(users) {
    localStorage.setItem('shopease_users', JSON.stringify(users));
}

function getProducts() {
    return JSON.parse(localStorage.getItem('shopease_products') || '[]');
}

function setProducts(products) {
    localStorage.setItem('shopease_products', JSON.stringify(products));
}

function getCategories() {
    return JSON.parse(localStorage.getItem('shopease_categories') || '[]');
}

function setCategories(categories) {
    localStorage.setItem('shopease_categories', JSON.stringify(categories));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('shopease_orders') || '[]');
}

function setOrders(orders) {
    localStorage.setItem('shopease_orders', JSON.stringify(orders));
}

function getCart() {
    return JSON.parse(localStorage.getItem('shopease_cart') || '[]');
}

function setCart(cart) {
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('shopease_current_user') || 'null');
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('shopease_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('shopease_current_user');
    }
}

// User authentication functions
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        return true;
    }
    return false;
}

function registerUser(userData) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return false;
    }
    
    // Add new user
    const newUser = {
        id: users.length + 1,
        ...userData,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    setUsers(users);
    return true;
}

function logoutUser() {
    setCurrentUser(null);
}

// Initialize data when the script loads
initializeData();