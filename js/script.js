// ==========================================================
// --- CORE WEBSITE FUNCTIONALITY ---
// ==========================================================

let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};

document.querySelectorAll('.image-slider img').forEach(images => {
    images.onclick = () => {
        var src = images.getAttribute('src');
        document.querySelector('.main-home-image').src = src;
    };
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        }
    },
});

// ==========================================================
// --- SHOP PAGE: CART TRACKING AND DROPDOWN DISPLAY (FIXED LOGIC) ---
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const cartIconWrapper = document.getElementById('cart-wrapper');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartCounter = document.querySelector('.cart-icon-counter');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const addToCartButtons = document.querySelectorAll('.product-item .btn');

    // State
    let cart = []; // Array to hold all added product objects

    // --- Core Functions ---

    function updateCartDisplay() {
        // 1. Update Counter
        let count = cart.length;
        if (cartCounter) {
            cartCounter.textContent = count;
        }

        // 2. Update Items List
        cartItemsList.innerHTML = '';
        let total = 0;

        if (count === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                // Calculate item price (remove '$' and convert to number)
                const priceValue = parseFloat(item.price.replace('$', ''));
                total += priceValue;

                itemElement.classList.add('cart-item-display');
                itemElement.innerHTML = `
                    <p style="margin: 5px 0; display: flex; justify-content: space-between;">
                        <span>${item.name}</span>
                        <span style="font-weight: bold;">${item.price}</span>
                    </p>
                `;
                cartItemsList.appendChild(itemElement);
            });
        }

        // 3. Update Total
        cartTotalAmount.textContent = total.toFixed(2);
    }

    // --- Event Listeners ---

    // 1. Toggle Cart Dropdown Visibility on Icon Click (FIXED!)
    if (cartIconWrapper) {
        cartIconWrapper.addEventListener('click', (e) => {
            // Stop click event propagation to prevent immediate closing by document listener
            e.stopPropagation(); 
            
            const isVisible = cartDropdown.style.display === 'block';
            cartDropdown.style.display = isVisible ? 'none' : 'block';
        });
    }
    
    // New: Close cart if user clicks outside of the cart or the icon
    document.addEventListener('click', (e) => {
        // If the click target is neither the wrapper nor inside the dropdown, close it.
        if (cartDropdown && cartIconWrapper) {
            if (!cartIconWrapper.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.style.display = 'none';
            }
        }
    });


    // 2. Add to Cart Button Logic
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const productItem = this.closest('.product-item');
            const productName = productItem.querySelector('h4').textContent;
            const productPrice = productItem.querySelector('.price').textContent;

            // Add item to the cart array
            cart.push({ name: productName, price: productPrice });

            // Update all cart visual elements
            updateCartDisplay();

            // Provide user feedback (Button change)
            this.textContent = 'Added! 👍';
            this.style.backgroundColor = '#4CAF50'; 
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#E67E22'; 
            }, 1500); 

            // IMPORTANT: Stop propagation here to prevent the document listener from closing the cart immediately
            event.stopPropagation();
        });
    });

    // 3. Initialize the cart display on load
    updateCartDisplay();
});


// ==========================================================
// --- SHOP PAGE: PRODUCT SEARCH FILTER ---
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search-input');
    // Get all product items and category headers
    const productItems = document.querySelectorAll('.product-grid .product-item');
    const categoryHeaders = document.querySelectorAll('.main-products h2');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let visibleProductsCount = 0;

            productItems.forEach(item => {
                // Get the name and brand of the current product
                const name = item.querySelector('h4').textContent.toLowerCase();
                const brand = item.querySelector('.brand').textContent.toLowerCase();

                // Check if the search term is present in the name or brand
                if (name.includes(searchTerm) || brand.includes(searchTerm)) {
                    item.style.display = 'block';
                    visibleProductsCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Logic to hide category headers if all products under them are hidden
            categoryHeaders.forEach(header => {
                const nextGrid = header.nextElementSibling; // This assumes the product grid follows the h2
                let gridHasVisibleProduct = false;
                
                if (nextGrid && nextGrid.classList.contains('product-grid')) {
                    const productsInGrid = nextGrid.querySelectorAll('.product-item');
                    
                    productsInGrid.forEach(product => {
                        if (product.style.display !== 'none') {
                            gridHasVisibleProduct = true;
                        }
                    });
                }

                // If searching and the grid is empty, hide the category header
                if (searchTerm.length > 0 && !gridHasVisibleProduct) {
                    header.classList.add('category-hidden');
                } else {
                    header.classList.remove('category-hidden');
                }
            });
        });
    }
});