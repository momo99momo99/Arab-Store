
// Products data
const products = [
    // Laptops
    {
        id: 1,
        name: "لابتوب Dell XPS 13",
        price: 4500,
        category: "laptops",
        image: "assets/photo-1588872657578-7efd1f1555ed.avif"
    },
    {
        id: 2,
        name: "لابتوب MacBook Pro 14",
        price: 8500,
        category: "laptops",
        image: "assets/photo-1517336714731-489689fd1ca8.avif"
    },
    {
        id: 3,
        name: "لابتوب HP Pavilion",
        price: 3200,
        category: "laptops",
        image: "assets/photo-1496181133206-80ce9b88a853.avif"
    },
    {
        id: 4,
        name: "لابتوب ASUS ROG Gaming",
        price: 6500,
        category: "laptops",
        image: "assets/photo-1603302576837-37561b2e2302.avif"
    },
    
    // Accessories
    {
        id: 5,
        name: "ماوس لوجيتك MX Master 3",
        price: 320,
        category: "accessories",
        image: "assets/photo-1527864550417-7fd91fc51a46.avif"
    },
    {
        id: 6,
        name: "كيبورد ميكانيكي RGB",
        price: 450,
        category: "accessories",
        image: "assets/photo-1541140532154-b024d705b90a.avif"
    },
    {
        id: 7,
        name: "لابتوب TOSHIBA-Black",
        price: 12000,
        category: "laptops",
        image: "assets/٢٠٢٥٠٧٢٣_١١٤٥٠٣.jpg"
    },
    {
        id: 8,
        name: "كاميرا ويب عالية الدقة",
        price: 280,
        category: "accessories",
        image: "assets/photo-1587825140708-dfaf72ae4b04.avif"
    },
    
    // Parts
    {
        id: 9,
        name: "ذاكرة RAM 16GB DDR4",
        price: 520,
        category: "parts",
        image: "assets/photo-1591799264318-7e6ef8ddb7ea.avif"
    },
    {
        id: 10,
        name: "هارد SSD 1TB Samsung",
        price: 680,
        category: "parts",
        image: "assets/photo-1597872200969-2b65d56bd16b.avif"
    },
    {
        id: 11,
        name: "سماعة Sony xv-99",
        price: 180,
        category: "accessories",
        image: "assets/s.avif"
    },
    {
        id: 12,
        name: "سماعات JBL متميزة",
        price: 350,
        category: "accessories",
        image: "assets/IMG_9564.JPG"
    }
];

// Cart array
let cart = JSON.parse(localStorage.getItem('arabStoreCart')) || [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartSection = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const tabButtons = document.querySelectorAll('.tab-button');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    updateCartUI();
    initNavigation();
    initContactForm();
});

// Display products
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price} جنيه</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    إضافة للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// Category tabs functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        displayProducts(category);
    });
});

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification('تم إضافة المنتج للسلة');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
    displayCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
            displayCart();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    if (totalPrice) {
        totalPrice.textContent = total;
    }
}

// Display cart
function displayCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">السلة فارغة</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.price} جنيه</p>
            </div>
            <div class="item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('arabStoreCart', JSON.stringify(cart));
}

// Navigation functionality
function initNavigation() {
    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#cart') {
                e.preventDefault();
                showCart();
            } else if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Hide cart if showing
                    cartSection.style.display = 'none';
                    // Show target section
                    if (targetId !== 'cart') {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });
}

// Show cart
function showCart() {
    cartSection.style.display = 'block';
    cartSection.scrollIntoView({ behavior: 'smooth' });
    displayCart();
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Here you would typically send the data to a server
            showNotification('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً');
            contactForm.reset();
        });
    }
}

// Checkout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            showNotification('السلة فارغة');
            return;
        }
        
        // Here you would integrate with a payment system
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const message = `مرحباً، أريد شراء المنتجات التالية:%0A%0A${cart.map(item => 
            `${item.name} - الكمية: ${item.quantity} - السعر: ${item.price * item.quantity} جنيه`
        ).join('%0A')}%0A%0Aالمجموع الكلي: ${total} جنيه`;
        
        const whatsappUrl = `https://wa.me/201011347171?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});
