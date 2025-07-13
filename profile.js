// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!requireLogin()) {
        return;
    }
    
    loadUserProfile();
    loadUserStats();
    setupFormHandlers();
});

function loadUserProfile() {
    if (currentUser) {
        // Update sidebar
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;
        
        // Update form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const addressField = document.getElementById('address');
        const joinDateField = document.getElementById('joinDate');
        
        if (nameField) nameField.value = currentUser.name || '';
        if (emailField) emailField.value = currentUser.email || '';
        if (phoneField) phoneField.value = currentUser.phone || '';
        if (addressField) addressField.value = currentUser.address || '';
        if (joinDateField) joinDateField.value = formatDate(currentUser.joinDate) || 'January 2024';
    }
}

function loadUserStats() {
    // Load user orders
    const orders = getOrders().filter(order => order.userId === currentUser.id);
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const totalOrdersElement = document.getElementById('totalOrders');
    const totalSpentElement = document.getElementById('totalSpent');
    const cartItemsElement = document.getElementById('cartItems');
    const wishlistItemsElement = document.getElementById('wishlistItems');
    
    if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
    if (totalSpentElement) totalSpentElement.textContent = `₹${totalSpent.toLocaleString()}`;
    if (cartItemsElement) cartItemsElement.textContent = cartItemsCount;
    if (wishlistItemsElement) wishlistItemsElement.textContent = '0'; // Mock data
}

function setupFormHandlers() {
    // Profile form handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const profileData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address')
            };
            
            // Update user data
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    ...profileData
                };
                
                setUsers(users);
                
                // Update current user
                currentUser = users[userIndex];
                setCurrentUser(currentUser);
                
                showAlert('Profile updated successfully!', 'success');
                loadUserProfile(); // Reload profile data
            } else {
                showAlert('Failed to update profile', 'danger');
            }
        });
    }
    
    // Password form handler
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            // Validate current password
            if (currentPassword !== currentUser.password) {
                showAlert('Current password is incorrect!', 'danger');
                return;
            }
            
            // Validate new passwords match
            if (newPassword !== confirmPassword) {
                showAlert('New passwords do not match!', 'danger');
                return;
            }
            
            // Update password
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                setUsers(users);
                
                // Update current user
                currentUser = users[userIndex];
                setCurrentUser(currentUser);
                
                showAlert('Password changed successfully!', 'success');
                this.reset(); // Clear form
            } else {
                showAlert('Failed to change password', 'danger');
            }
        });
    }
}