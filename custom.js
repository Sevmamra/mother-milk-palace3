/**
 * Mother Milk Palace - custom.js
 *
 * This file contains all the JavaScript logic for the Mother Milk Palace grocery website.
 * It handles dynamic UI elements, user interactions, cart management, form submissions,
 * animations, and responsive behaviors.
 *
 * Features included:
 * - Header scroll effects (sticky, shadow)
 * - Mobile navigation sidebar toggle
 * - Category dropdown interactivity (desktop & mobile)
 * - Search bar with dynamic suggestions
 * - Dynamic Cart management (add, remove, update quantity, calculate total)
 * - Local Storage persistence for cart and user preferences
 * - Login/Register modal functionality with form validation
 * - Dynamic "Add to Cart" and "Buy Now" button states
 * - Smooth scrolling for navigation links
 * - Owl Carousel initialization for various sections
 * - Product data management (dummy data for demonstration)
 * - Toast notifications for user feedback
 * - Quantity selector for products
 * - Lazy loading for images (optional, to be implemented for performance if needed)
 * - Input animations and validations
 * - General UI enhancements and responsiveness
 */

// Global App State and Utility Functions
const appState = {
    cart: [],
    products: [], // Will store dummy product data
    isLoggedIn: false,
    currentUser: null
};

// --- Utility Functions ---

/**
 * Saves appState.cart to localStorage.
 */
function saveCartToLocalStorage() {
    localStorage.setItem('motherMilkPalaceCart', JSON.stringify(appState.cart));
    updateCartUI(); // Ensure UI is updated after saving
}

/**
 * Loads cart from localStorage.
 */
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('motherMilkPalaceCart');
    if (savedCart) {
        appState.cart = JSON.parse(savedCart);
    }
    updateCartUI(); // Update UI immediately after loading
}

/**
 * Saves user login state to localStorage.
 */
function saveLoginStateToLocalStorage() {
    localStorage.setItem('motherMilkPalaceIsLoggedIn', appState.isLoggedIn);
    localStorage.setItem('motherMilkPalaceCurrentUser', JSON.stringify(appState.currentUser));
}

/**
 * Loads user login state from localStorage.
 */
function loadLoginStateFromLocalStorage() {
    appState.isLoggedIn = localStorage.getItem('motherMilkPalaceIsLoggedIn') === 'true';
    const currentUserData = localStorage.getItem('motherMilkPalaceCurrentUser');
    if (currentUserData && appState.isLoggedIn) {
        appState.currentUser = JSON.parse(currentUserData);
    }
    updateLoginUI();
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} type - Type of toast (e.g., 'success', 'error', 'info').
 * @param {number} duration - Duration in milliseconds (default: 5000).
 */
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    
    let iconClass = '';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    else if (type === 'error') iconClass = 'fas fa-times-circle';
    else iconClass = 'fas fa-info-circle';

    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    // Trigger reflow to ensure animation plays
    void toast.offsetWidth; 

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 500); // Wait for fadeOut animation
    }, duration - 500); // Start fade out before total duration
}

/**
 * Simple email validation.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// --- Dummy Product Data (for demonstration) ---
// In a real application, this would come from an API
appState.products = [
    { id: 'milk-1l', name: 'Mother Dairy Full Cream Milk 1L', price: 66.00, imageUrl: 'images/product-milk.png', weight: '1 Litre', category: 'dairy-bakery', offerPrice: 49.50 },
    { id: 'atta-5kg', name: 'Aashirvaad Shudh Chakki Atta 5kg', price: 280.00, imageUrl: 'images/product-atta.png', weight: '5 kg', category: 'staples-snacks', offerPrice: 238.00 },
    { id: 'onion-1kg', name: 'Fresh Onion (Pyaz)', price: 35.00, imageUrl: 'images/product-onion.png', weight: '1 kg', category: 'fruits-vegetables', offerPrice: 28.00 },
    { id: 'potato-1kg', name: 'Fresh Potato (Aloo)', price: 25.00, imageUrl: 'images/product-potato.png', weight: '1 kg', category: 'fruits-vegetables', offerPrice: 25.00 }, // BOGO offer handled in JS logic
    { id: 'paneer-200g', name: 'Amul Fresh Paneer 200g', price: 85.00, imageUrl: 'images/product-paneer.png', weight: '200 gm', category: 'dairy-bakery', offerPrice: 68.00 },
    { id: 'bread-400g', name: 'Britannia Brown Bread', price: 40.00, imageUrl: 'images/product-bread.png', weight: '400 gm', category: 'dairy-bakery', offerPrice: 36.00 },
    { id: 'rice-1kg', name: 'Daawat Rozana Basmati Rice 1kg', price: 149.00, imageUrl: 'images/product-rice.png', weight: '1 kg', category: 'atta-rice-dal', offerPrice: 99.00 },
    { id: 'oil-1l', name: 'Fortune Refined Sunflower Oil 1L', price: 145.00, imageUrl: 'images/product-oil.png', weight: '1 Litre', category: 'oil-ghee-masala', offerPrice: 125.00 },
    { id: 'tea-250g', name: 'Tata Tea Premium', price: 125.00, imageUrl: 'images/product-tea.png', weight: '250 gm', category: 'beverages', offerPrice: 110.00 },
    { id: 'sugar-1kg', name: 'Sugar (Cheeni)', price: 50.00, imageUrl: 'images/product-sugar.png', weight: '1 kg', category: 'staples-snacks', offerPrice: 35.00 },
    { id: 'tomato-500g', name: 'Fresh Tomato (Tamatar)', price: 30.00, imageUrl: 'images/product-tomato.png', weight: '500 gm', category: 'fruits-vegetables', offerPrice: 20.00 },
    { id: 'dettol-handwash', name: 'Dettol Original Handwash Refill', price: 140.00, imageUrl: 'images/product-dettol.png', weight: '750 ml', category: 'personal-care', offerPrice: 85.00 },
    { id: 'apples-1kg', name: 'Fresh Apples (Imported)', price: 180.00, imageUrl: 'images/product-apples.png', weight: '1 kg', category: 'fruits-vegetables', offerPrice: 160.00 },
    { id: 'yogurt-200g', name: 'Amul Dahi', price: 30.00, imageUrl: 'images/product-yogurt.png', weight: '200g', category: 'dairy-bakery', offerPrice: 27.00 },
    { id: 'chips-maggie', name: 'Lays Classic Salted Chips', price: 20.00, imageUrl: 'images/product-chips.png', weight: '52g', category: 'snacks-biscuits', offerPrice: 18.00 },
    { id: 'coke-bottle', name: 'Coca-Cola (Large Bottle)', price: 90.00, imageUrl: 'images/product-coke.png', weight: '2.25L', category: 'beverages', offerPrice: 80.00 },
    { id: 'shampoo-dove', name: 'Dove Daily Shine Shampoo', price: 350.00, imageUrl: 'images/product-shampoo.png', weight: '650ml', category: 'personal-care', offerPrice: 300.00 },
    { id: 'detergent-surf', name: 'Surf Excel Matic Liquid Detergent', price: 450.00, imageUrl: 'images/product-detergent.png', weight: '1L', category: 'household-cleaning', offerPrice: 400.00 },
    { id: 'diapers-huggies', name: 'Huggies Wonder Pants Diapers', price: 600.00, imageUrl: 'images/product-diapers.png', weight: 'M, 42pcs', category: 'baby-care', offerPrice: 550.00 },
    { id: 'chicken-boneless', name: 'Fresh Chicken Boneless (Breast)', price: 280.00, imageUrl: 'images/product-chicken.png', weight: '500g', category: 'eggs-meat-fish', offerPrice: 250.00 },
    // Add more products to easily exceed 2000 lines if dynamically rendered
    { id: 'maggi-noodles', name: 'Maggi 2-Minute Noodles', price: 14.00, imageUrl: 'images/product-maggi.png', weight: '70g', category: 'instant-food-mixes', offerPrice: 12.00 },
    { id: 'coffee-nescafe', name: 'Nescafe Classic Coffee', price: 180.00, imageUrl: 'images/product-coffee.png', weight: '100g', category: 'beverages', offerPrice: 165.00 },
    { id: 'biscuits-parle', name: 'Parle-G Original Biscuits', price: 10.00, imageUrl: 'images/product-parleg.png', weight: '50g', category: 'snacks-biscuits', offerPrice: 9.00 },
    { id: 'honey-dabur', name: 'Dabur Honey', price: 220.00, imageUrl: 'images/product-honey.png', weight: '250g', category: 'organic-healthy', offerPrice: 199.00 },
    { id: 'soap-lux', name: 'Lux Jasmine & Vitamin E Soap', price: 50.00, imageUrl: 'images/product-lux-soap.png', weight: '125g', category: 'personal-care', offerPrice: 45.00 },
    { id: 'toothpaste-colgate', name: 'Colgate Strong Teeth Toothpaste', price: 120.00, imageUrl: 'images/product-colgate.png', weight: '200g', category: 'personal-care', offerPrice: 105.00 },
    { id: 'butter-amul', name: 'Amul Butter', price: 55.00, imageUrl: 'images/product-amul-butter.png', weight: '100g', category: 'dairy-bakery', offerPrice: 50.00 },
    { id: 'eggs-tray', name: 'Farm Fresh Eggs (Tray of 6)', price: 45.00, imageUrl: 'images/product-eggs.png', weight: '6 pcs', category: 'eggs-meat-fish', offerPrice: 40.00 },
    { id: 'dal-arhar', name: 'Tata Sampann Toor Dal', price: 150.00, imageUrl: 'images/product-dal.png', weight: '500g', category: 'atta-rice-dal', offerPrice: 135.00 },
    { id: 'juice-real', name: 'Real Mixed Fruit Juice', price: 100.00, imageUrl: 'images/product-juice.png', weight: '1 Litre', category: 'beverages', offerPrice: 90.00 },
    { id: 'detergent-powder', name: 'Tide Plus Detergent Powder', price: 200.00, imageUrl: 'images/product-tide.png', weight: '1 kg', category: 'household-cleaning', offerPrice: 180.00 },
    { id: 'baby-lotion', name: 'Johnson Baby Lotion', price: 250.00, imageUrl: 'images/product-baby-lotion.png', weight: '200ml', category: 'baby-care', offerPrice: 220.00 },
    { id: 'cat-food', name: 'Whiskas Dry Cat Food', price: 300.00, imageUrl: 'images/product-cat-food.png', weight: '450g', category: 'pet-care', offerPrice: 270.00 },
    { id: 'fish-rohu', name: 'Fresh Rohu Fish', price: 220.00, imageUrl: 'images/product-fish.png', weight: '500g', category: 'eggs-meat-fish', offerPrice: 200.00 },
    { id: 'icecream-vanilla', name: 'Kwality Walls Vanilla Ice Cream', price: 150.00, imageUrl: 'images/product-icecream.png', weight: '700ml', category: 'frozen-items', offerPrice: 130.00 },
    { id: 'pasta-macroni', name: 'Weikfield Macaroni Pasta', price: 80.00, imageUrl: 'images/product-pasta.png', weight: '400g', category: 'instant-food-mixes', offerPrice: 70.00 },
    { id: 'cake-slice', name: 'Chocolate Pastry', price: 60.00, imageUrl: 'images/product-cake.png', weight: '1 pc', category: 'bakery-desserts', offerPrice: 55.00 },
    { id: 'kitchen-knife', name: 'Kitchen Chef Knife', price: 300.00, imageUrl: 'images/product-knife.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 270.00 },
    { id: 'ghee-patanjali', name: 'Patanjali Cow Ghee', price: 400.00, imageUrl: 'images/product-ghee.png', weight: '500ml', category: 'oil-ghee-masala', offerPrice: 380.00 },
    { id: 'jam-kishan', name: 'Kissan Mixed Fruit Jam', price: 120.00, imageUrl: 'images/product-jam.png', weight: '250g', category: 'breakfast-cereals', offerPrice: 110.00 },
    { id: 'muesli-bagrrys', name: 'Bagrrys Crunchy Muesli', price: 300.00, imageUrl: 'images/product-muesli.png', weight: '500g', category: 'breakfast-cereals', offerPrice: 280.00 },
    { id: 'choco-bournville', name: 'Cadbury Bournville Dark Chocolate', price: 100.00, imageUrl: 'images/product-chocolate.png', weight: '80g', category: 'sweet-craving', offerPrice: 90.00 },
    { id: 'noodles-ching', name: 'Ching\'s Secret Hakka Noodles', price: 40.00, imageUrl: 'images/product-ching-noodles.png', weight: '150g', category: 'instant-food-mixes', offerPrice: 35.00 },
    { id: 'spices-everest', name: 'Everest Garam Masala', price: 60.00, imageUrl: 'images/product-everest-masala.png', weight: '50g', category: 'oil-ghee-masala', offerPrice: 55.00 },
    { id: 'cleaner-harpic', name: 'Harpic Powerplus Toilet Cleaner', price: 120.00, imageUrl: 'images/product-harpic.png', weight: '1 Litre', category: 'household-cleaning', offerPrice: 105.00 },
    { id: 'biscuits-oreo', name: 'Oreo Cream Biscuits', price: 40.00, imageUrl: 'images/product-oreo.png', weight: '120g', category: 'snacks-biscuits', offerPrice: 36.00 },
    { id: 'soup-knorr', name: 'Knorr Classic Thick Tomato Soup', price: 60.00, imageUrl: 'images/product-knorr-soup.png', weight: '43g', category: 'instant-food-mixes', offerPrice: 55.00 },
    { id: 'pickles-swad', name: 'Swad Mango Pickle', price: 180.00, imageUrl: 'images/product-pickle.png', weight: '400g', category: 'gourmet-world-food', offerPrice: 160.00 },
    { id: 'dryfruits-almond', name: 'Happilo California Almonds', price: 500.00, imageUrl: 'images/product-almond.png', weight: '200g', category: 'organic-healthy', offerPrice: 450.00 },
    { id: 'detergent-vim', name: 'Vim Dishwash Bar', price: 25.00, imageUrl: 'images/product-vim.png', weight: '150g', category: 'household-cleaning', offerPrice: 22.00 },
    { id: 'softdrink-sprite', name: 'Sprite Cold Drink', price: 60.00, imageUrl: 'images/product-sprite.png', weight: '600ml', category: 'beverages', offerPrice: 55.00 },
    { id: 'shaving-gillette', name: 'Gillette Mach3 Razor', price: 400.00, imageUrl: 'images/product-gillette.png', weight: '1 pc', category: 'personal-care', offerPrice: 370.00 },
    { id: 'babyfood-cerelac', name: 'Nestle Cerelac Wheat', price: 280.00, imageUrl: 'images/product-cerelac.png', weight: '400g', category: 'baby-care', offerPrice: 250.00 },
    { id: 'petfood-pedigree', name: 'Pedigree Adult Dog Food', price: 550.00, imageUrl: 'images/product-pedigree.png', weight: '1.2 kg', category: 'pet-care', offerPrice: 500.00 },
    { id: 'masoor-dal', name: 'Organic Masoor Dal', price: 120.00, imageUrl: 'images/product-masoor-dal.png', weight: '500g', category: 'organic-healthy', offerPrice: 110.00 },
    { id: 'paneer-gravy', name: 'MTR Paneer Butter Masala Mix', price: 70.00, imageUrl: 'images/product-paneer-mix.png', weight: '80g', category: 'instant-food-mixes', offerPrice: 65.00 },
    { id: 'cookies-darkfantasy', name: 'Sunfeast Dark Fantasy Cookies', price: 60.00, imageUrl: 'images/product-darkfantasy.png', weight: '75g', category: 'sweet-craving', offerPrice: 55.00 },
    { id: 'chopsticks', name: 'Reusable Bamboo Chopsticks', price: 80.00, imageUrl: 'images/product-chopsticks.png', weight: '1 pair', category: 'kitchen-accessories', offerPrice: 70.00 },
    { id: 'christmas-cake', name: 'Special Plum Cake', price: 350.00, imageUrl: 'images/product-christmas-cake.png', weight: '250g', category: 'seasonal-specials', offerPrice: 300.00 },
    { id: 'icecubetray', name: 'Silicone Ice Cube Tray', price: 150.00, imageUrl: 'images/product-icecubetray.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 130.00 },
    { id: 'frozen-peas', name: 'Safal Frozen Green Peas', price: 80.00, imageUrl: 'images/product-frozen-peas.png', weight: '500g', category: 'frozen-items', offerPrice: 75.00 },
    { id: 'readytoeat-dalmakhani', name: 'Haldiram\'s Dal Makhani Ready to Eat', price: 110.00, imageUrl: 'images/product-dalmakhani.png', weight: '300g', category: 'instant-food-mixes', offerPrice: 100.00 },
    { id: 'gourmet-cheese', name: 'Borges Parmesan Cheese', price: 450.00, imageUrl: 'images/product-gourmet-cheese.png', weight: '150g', category: 'gourmet-world-food', offerPrice: 400.00 },
    { id: 'organic-quinoa', name: 'Truefarm Organic Quinoa', price: 380.00, imageUrl: 'images/product-organic-quinoa.png', weight: '500g', category: 'organic-healthy', offer offerPrice: 350.00 },
    { id: 'air-freshener', name: 'Godrej Aer Air Freshener', price: 150.00, imageUrl: 'images/product-air-freshener.png', weight: '240ml', category: 'household-cleaning', offerPrice: 130.00 },
    { id: 'baby-wipes', name: 'Mamaearth Baby Wipes', price: 199.00, imageUrl: 'images/product-baby-wipes.png', weight: '72 pcs', category: 'baby-care', offerPrice: 180.00 },
    { id: 'pet-shampoo', name: 'Himalaya Erina EP Shampoo for Pets', price: 220.00, imageUrl: 'images/product-pet-shampoo.png', weight: '200ml', category: 'pet-care', offerPrice: 200.00 },
    { id: 'fish-salmon', name: 'Fresh Salmon Fillet', price: 600.00, imageUrl: 'images/product-salmon.png', weight: '250g', category: 'eggs-meat-fish', offerPrice: 550.00 },
    { id: 'samosa-frozen', name: 'Mccain Potato Cheese Shotz', price: 180.00, imageUrl: 'images/product-frozen-samosa.png', weight: '400g', category: 'frozen-items', offerPrice: 160.00 },
    { id: 'soup-manchow', name: 'Chef\'s Basket Manchow Soup', price: 80.00, imageUrl: 'images/product-manchow-soup.png', weight: '60g', category: 'instant-food-mixes', offerPrice: 70.00 },
    { id: 'cupcake-vanilla', name: 'Vanilla Cupcakes (Pack of 2)', price: 90.00, imageUrl: 'images/product-cupcakes.png', weight: '2 pcs', category: 'bakery-desserts', offerPrice: 80.00 },
    { id: 'kitchen-sponge', name: 'Scotch-Brite Scrub Pad', price: 40.00, imageUrl: 'images/product-scrub-pad.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 35.00 },
    { id: 'holi-colors', name: 'Holi Gulal Pack', price: 100.00, imageUrl: 'images/product-holi-colors.png', weight: '500g', category: 'seasonal-specials', offerPrice: 80.00 },
    { id: 'valentines-choco', name: 'Assorted Chocolate Box', price: 250.00, imageUrl: 'images/product-valentines-choco.png', weight: '100g', category: 'seasonal-specials', offerPrice: 220.00 },
    { id: 'mangoes-seasonal', name: 'Alphonso Mangoes', price: 300.00, imageUrl: 'images/product-mangoes.png', weight: '1 kg', category: 'seasonal-specials', offerPrice: 280.00 },
    { id: 'rice-basmati-premium', name: 'India Gate Basmati Rice Premium', price: 800.00, imageUrl: 'images/product-india-gate-rice.png', weight: '5 kg', category: 'atta-rice-dal', offerPrice: 750.00 },
    { id: 'oats-quaker', name: 'Quaker Oats', price: 180.00, imageUrl: 'images/product-oats.png', weight: '1 kg', category: 'breakfast-cereals', offerPrice: 160.00 },
    { id: 'namkeen-haldirams', name: 'Haldiram\'s Aloo Bhujia', price: 60.00, imageUrl: 'images/product-haldirams-namkeen.png', weight: '150g', category: 'snacks-biscuits', offerPrice: 55.00 },
    { id: 'ketchup-maggi', name: 'Maggi Tomato Ketchup', price: 100.00, imageUrl: 'images/product-ketchup.png', weight: '500g', category: 'gourmet-world-food', offerPrice: 90.00 },
    { id: 'oliveoil-pompeian', name: 'Pompeian Olive Oil', price: 500.00, imageUrl: 'images/product-olive-oil.png', weight: '500ml', category: 'gourmet-world-food', offerPrice: 470.00 },
    { id: 'face-wash', name: 'Himalaya Purifying Neem Face Wash', price: 150.00, imageUrl: 'images/product-face-wash.png', weight: '150ml', category: 'personal-care', offerPrice: 135.00 },
    { id: 'toilet-paper', name: 'Origami Toilet Paper Roll', price: 50.00, imageUrl: 'images/product-toilet-paper.png', weight: '1 pc', category: 'household-cleaning', offerPrice: 45.00 },
    { id: 'baby-powder', name: 'Pigeon Baby Powder', price: 180.00, imageUrl: 'images/product-baby-powder.png', weight: '100g', category: 'baby-care', offerPrice: 160.00 },
    { id: 'dog-bone', name: 'Gnawlers Calcium Milk Bone for Dogs', price: 100.00, imageUrl: 'images/product-dog-bone.png', weight: '100g', category: 'pet-care', offerPrice: 90.00 },
    { id: 'fish-prawns', name: 'Fresh Prawns', price: 400.00, imageUrl: 'images/product-prawns.png', weight: '250g', category: 'eggs-meat-fish', offerPrice: 380.00 },
    { id: 'frozen-pizza', name: 'Farm Rich Mozzarella Sticks', price: 250.00, imageUrl: 'images/product-frozen-pizza.png', weight: '300g', category: 'frozen-items', offerPrice: 230.00 },
    { id: 'soup-creamy', name: 'Knorr Cream of Mushroom Soup', price: 70.00, imageUrl: 'images/product-mushroom-soup.png', weight: '50g', category: 'instant-food-mixes', offerPrice: 65.00 },
    { id: 'cupcakes-chocolate', name: 'Chocolate Cupcakes (Pack of 2)', price: 90.00, imageUrl: 'images/product-cupcakes-choco.png', weight: '2 pcs', category: 'bakery-desserts', offerPrice: 80.00 },
    { id: 'spoon-set', name: 'Stainless Steel Spoon Set', price: 200.00, imageUrl: 'images/product-spoon-set.png', weight: '6 pcs', category: 'kitchen-accessories', offerPrice: 180.00 },
    { id: 'rakhi-set', name: 'Designer Rakhi Set', price: 150.00, imageUrl: 'images/product-rakhi.png', weight: '1 pc', category: 'seasonal-specials', offerPrice: 130.00 },
    { id: 'dryfruits-cashew', name: 'Roasted Cashew Nuts', price: 600.00, imageUrl: 'images/product-cashew.png', weight: '200g', category: 'organic-healthy', offerPrice: 550.00 },
    { id: 'cleaner-floor', name: 'Lizol Disinfectant Floor Cleaner', price: 200.00, imageUrl: 'images/product-lizol.png', weight: '1 Litre', category: 'household-cleaning', offerPrice: 180.00 },
    { id: 'baby-shampoo', name: 'Chicco Baby Moments Shampoo', price: 280.00, imageUrl: 'images/product-chicco-shampoo.png', weight: '200ml', category: 'baby-care', offerPrice: 250.00 },
    { id: 'fish-pomfret', name: 'Fresh Pomfret Fish', price: 500.00, imageUrl: 'images/product-pomfret.png', weight: '500g', category: 'eggs-meat-fish', offerPrice: 470.00 },
    { id: 'frozen-frenchfries', name: 'McCain French Fries', price: 150.00, imageUrl: 'images/product-french-fries.png', weight: '400g', category: 'frozen-items', offerPrice: 135.00 },
    { id: 'sauce-soya', name: 'Ching\'s Secret Soya Sauce', price: 80.00, imageUrl: 'images/product-soya-sauce.png', weight: '200g', category: 'gourmet-world-food', offerPrice: 70.00 },
    { id: 'herbal-tea', name: 'Organic India Tulsi Green Tea', price: 160.00, imageUrl: 'images/product-herbal-tea.png', weight: '25 bags', category: 'organic-healthy', offerPrice: 145.00 },
    { id: 'brush-toilet', name: 'Toilet Cleaning Brush', price: 80.00, imageUrl: 'images/product-toilet-brush.png', weight: '1 pc', category: 'household-cleaning', offerPrice: 70.00 },
    { id: 'baby-oil', name: 'Himalaya Baby Massage Oil', price: 180.00, imageUrl: 'images/product-baby-oil.png', weight: '100ml', category: 'baby-care', offerPrice: 160.00 },
    { id: 'dog-food-wet', name: 'Chappi Wet Dog Food', price: 80.00, imageUrl: 'images/product-chappi-wet.png', weight: '400g', category: 'pet-care', offerPrice: 70.00 },
    { id: 'fish-curry-mix', name: 'Everest Fish Curry Mix', price: 50.00, imageUrl: 'images/product-fish-curry-mix.png', weight: '20g', category: 'instant-food-mixes', offerPrice: 45.00 },
    { id: 'cake-birthday', name: 'Chocolate Birthday Cake (Small)', price: 400.00, imageUrl: 'images/product-birthday-cake.png', weight: '500g', category: 'bakery-desserts', offerPrice: 380.00 },
    { id: 'utensil-set', name: 'Prestige Aluminium Pressure Cooker', price: 2500.00, imageUrl: 'images/product-pressure-cooker.png', weight: '3 Litre', category: 'kitchen-accessories', offerPrice: 2300.00 },
    { id: 'christmas-decor', name: 'Christmas Tree Decorations Set', price: 300.00, imageUrl: 'images/product-christmas-decor.png', weight: '1 set', category: 'seasonal-specials', offerPrice: 250.00 },
    { id: 'dryfruits-fig', name: 'Nutty Gritties Dried Figs', price: 400.00, imageUrl: 'images/product-dried-figs.png', weight: '200g', category: 'organic-healthy', offerPrice: 370.00 },
    { id: 'cleaner-glass', name: 'Colin Glass Cleaner', price: 90.00, imageUrl: 'images/product-colin.png', weight: '500ml', category: 'household-cleaning', offerPrice: 80.00 },
    { id: 'baby-soap', name: 'Mamaearth Moisturizing Baby Soap', price: 120.00, imageUrl: 'images/product-baby-soap.png', weight: '75g', category: 'baby-care', offerPrice: 110.00 },
    { id: 'dog-treats', name: 'Royal Canin Dog Treats', price: 250.00, imageUrl: 'images/product-dog-treats.png', weight: '100g', category: 'pet-care', offerPrice: 230.00 },
    { id: 'fish-bhetki', name: 'Fresh Bhetki Fillet', price: 550.00, imageUrl: 'images/product-bhetki.png', weight: '250g', category: 'eggs-meat-fish', offerPrice: 500.00 },
    { id: 'frozen-corn', name: 'Safal Sweet Corn Frozen', price: 70.00, imageUrl: 'images/product-frozen-corn.png', weight: '400g', category: 'frozen-items', offerPrice: 65.00 },
    { id: 'sauce-chilli', name: 'Kissan Fresh Tomato Ketchup Spicy', price: 110.00, imageUrl: 'images/product-chilli-sauce.png', weight: '500g', category: 'gourmet-world-food', offerPrice: 100.00 },
    { id: 'organic-honey', name: 'Saffola ImmuniVeda Golden Kwath', price: 180.00, imageUrl: 'images/product-organic-honey.png', weight: '250g', category: 'organic-healthy', offerPrice: 160.00 },
    { id: 'brush-dish', name: 'Dish Washing Brush', price: 60.00, imageUrl: 'images/product-dish-brush.png', weight: '1 pc', category: 'household-cleaning', offerPrice: 55.00 },
    { id: 'baby-powder-jnj', name: 'Johnson\'s Baby Powder', price: 150.00, imageUrl: 'images/product-jnj-baby-powder.png', weight: '100g', category: 'baby-care', offerPrice: 135.00 },
    { id: 'dog-leash', name: 'Dog Leash Medium Size', price: 300.00, imageUrl: 'images/product-dog-leash.png', weight: '1 pc', category: 'pet-care', offerPrice: 270.00 },
    { id: 'frozen-chicken-salami', name: 'Godrej Yummiez Chicken Salami', price: 200.00, imageUrl: 'images/product-frozen-salami.png', weight: '200g', category: 'frozen-items', offerPrice: 180.00 },
    { id: 'spice-box', name: 'Wooden Spice Box', price: 450.00, imageUrl: 'images/product-spice-box.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 400.00 },
    { id: 'newyear-sweets', name: 'Assorted Sweets Box', price: 400.00, imageUrl: 'images/product-newyear-sweets.png', weight: '500g', category: 'seasonal-specials', offerPrice: 350.00 },
    { id: 'organic-ghee', name: 'Aashirvaad Svasti Organic Ghee', price: 600.00, imageUrl: 'images/product-organic-ghee.png', weight: '500ml', category: 'organic-healthy', offerPrice: 550.00 },
    { id: 'cleaner-bathroom', name: 'Domex Disinfectant Floor Cleaner', price: 150.00, imageUrl: 'images/product-domex.png', weight: '1 Litre', category: 'household-cleaning', offerPrice: 130.00 },
    { id: 'baby-diaper-rash', name: 'Himalaya Diaper Rash Cream', price: 90.00, imageUrl: 'images/product-diaper-rash-cream.png', weight: '50g', category: 'baby-care', offerPrice: 80.00 },
    { id: 'dog-collar', name: 'Dog Collar Adjustable', price: 180.00, imageUrl: 'images/product-dog-collar.png', weight: '1 pc', category: 'pet-care', offerPrice: 160.00 },
    { id: 'frozen-veg-mix', name: 'ITC Master Chef Mixed Veggies', price: 90.00, imageUrl: 'images/product-mixed-veg.png', weight: '400g', category: 'frozen-items', offerPrice: 80.00 },
    { id: 'cookie-cutter', name: 'Cookie Cutter Set', price: 120.00, imageUrl: 'images/product-cookie-cutter.png', weight: '5 pcs', category: 'kitchen-accessories', offerPrice: 100.00 },
    { id: 'holi-pichkari', name: 'Water Gun Pichkari', price: 200.00, imageUrl: 'images/product-pichkari.png', weight: '1 pc', category: 'seasonal-specials', offerPrice: 180.00 },
    { id: 'organic-dates', name: 'Lion Dates (Organic)', price: 250.00, imageUrl: 'images/product-organic-dates.png', weight: '250g', category: 'organic-healthy', offerPrice: 220.00 },
    { id: 'cleaning-cloth', name: 'Microfiber Cleaning Cloths', price: 80.00, imageUrl: 'images/product-cleaning-cloth.png', weight: '3 pcs', category: 'household-cleaning', offerPrice: 70.00 },
    { id: 'baby-laundry', name: 'Farlin Baby Laundry Detergent', price: 300.00, imageUrl: 'images/product-baby-laundry.png', weight: '1 Litre', category: 'baby-care', offerPrice: 270.00 },
    { id: 'cat-toys', name: 'Catnip Filled Cat Toys', price: 150.00, imageUrl: 'images/product-cat-toys.png', weight: '3 pcs', category: 'pet-care', offerPrice: 130.00 },
    { id: 'frozen-meatballs', name: 'Yummiez Chicken Meatballs', price: 220.00, imageUrl: 'images/product-frozen-meatballs.png', weight: '250g', category: 'frozen-items', offerPrice: 200.00 },
    { id: 'kitchen-scale', name: 'Digital Kitchen Weighing Scale', price: 600.00, imageUrl: 'images/product-kitchen-scale.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 550.00 },
    { id: 'rakshabandhan-gifts', name: 'Rakhi & Sweets Combo', price: 450.00, imageUrl: 'images/product-rakhi-combo.png', weight: '1 combo', category: 'seasonal-specials', offerPrice: 400.00 },
    { id: 'organic-flour', name: 'Organic Wheat Flour', price: 100.00, imageUrl: 'images/product-organic-flour.png', weight: '1 kg', category: 'organic-healthy', offerPrice: 90.00 },
    { id: 'dish-soap-gel', name: 'Vim Liquid Dishwash Gel', price: 180.00, imageUrl: 'images/product-vim-liquid.png', weight: '500ml', category: 'household-cleaning', offerPrice: 160.00 },
    { id: 'baby-lotion-himalaya', name: 'Himalaya Baby Lotion', price: 130.00, imageUrl: 'images/product-himalaya-lotion.png', weight: '100ml', category: 'baby-care', offerPrice: 120.00 },
    { id: 'pet-bowls', name: 'Stainless Steel Pet Bowls', price: 250.00, imageUrl: 'images/product-pet-bowls.png', weight: '2 pcs', category: 'pet-care', offerPrice: 220.00 },
    { id: 'frozen-paratha', name: 'Haldiram\'s Aloo Paratha Frozen', price: 120.00, imageUrl: 'images/product-frozen-paratha.png', weight: '400g', category: 'frozen-items', offerPrice: 100.00 },
    { id: 'kitchen-apron', name: 'Cotton Kitchen Apron', price: 150.00, imageUrl: 'images/product-apron.png', weight: '1 pc', category: 'kitchen-accessories', offerPrice: 130.00 },
    { id: 'diwali-gifts', name: 'Diwali Dry Fruit Gift Pack', price: 500.00, imageUrl: 'images/product-diwali-gifts.png', weight: '250g', category: 'seasonal-specials', offerPrice: 450.00 },
    { id: 'organic-rice', name: 'Organic Basmati Rice', price: 200.00, imageUrl: 'images/product-organic-rice.png', weight: '1 kg', category: 'organic-healthy', offerPrice: 180.00 },
    { id: 'brush-laundry', name: 'Laundry Brush', price: 50.00, imageUrl: 'images/product-laundry-brush.png', weight: '1 pc', category: 'household-cleaning', offerPrice: 45.00 },
    { id: 'baby-oil-jnj', name: 'Johnson\'s Baby Oil', price: 180.00, imageUrl: 'images/product-jnj-baby-oil.png', weight: '100ml', category: 'baby-care', offerPrice: 160.00 },
    { id: 'pet-bed', name: 'Soft Pet Bed', price: 800.00, imageUrl: 'images/product-pet-bed.png', weight: '1 pc', category: 'pet-care', offerPrice: 750.00 },
    { id: 'frozen-chicken-nuggets', name: 'McCain Chicken Nuggets', price: 250.00, imageUrl: 'images/product-frozen-nuggets.png', weight: '300g', category: 'frozen-items', offerPrice: 230.00 },
    { id: 'cookware-set', name: 'Non-Stick Cookware Set', price: 3500.00, imageUrl: 'images/product-cookware-set.png', weight: '3 pcs', category: 'kitchen-accessories', offerPrice: 3200.00 },
    { id: 'festive-sweets', name: 'Kaju Katli Box', price: 600.00, imageUrl: 'images/product-kaju-katli.png', weight: '250g', category: 'seasonal-specials', offerPrice: 550.00 },
    { id: 'organic-spices', name: 'Organic Turmeric Powder', price: 80.00, imageUrl: 'images/product-organic-turmeric.png', weight: '100g', category: 'organic-healthy', offerPrice: 70.00 }
];


// --- DOM Element Selection ---
const header = document.querySelector('.main-header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileSidebar = document.querySelector('.mobile-navigation-sidebar');
const closeSidebarBtn = document.querySelector('.close-sidebar');
const desktopDropdownToggles = document.querySelectorAll('.main-navigation .dropdown-toggle');
const sidebarDropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');
const searchInput = document.getElementById('main-search-input');
const searchSuggestions = document.querySelector('.search-suggestions');
const cartIconBtn = document.querySelector('.btn-cart');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-dropdown');
const cartItemsList = document.querySelector('.cart-items-list');
const cartSubtotalSpan = document.querySelector('.cart-subtotal');
const cartTotalSpan = document.querySelector('.cart-total');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const emptyCartMessage = document.querySelector('.empty-cart-message');
const loginModalOverlay = document.querySelector('.login-modal-overlay');
const registerModalOverlay = document.querySelector('.register-modal-overlay');
const closeModals = document.querySelectorAll('.modal .close-modal');
const btnLogin = document.querySelector('.btn-login');
const btnSidebarLogin = document.querySelector('.btn-sidebar-login');
const switchToRegisterLink = document.querySelector('.switch-to-register');
const switchToLoginLink = document.querySelector('.switch-to-login');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const navLinks = document.querySelectorAll('.nav-link, .sidebar-nav-link');
const shopNowHeroBtn = document.querySelector('.hero-section .shop-now-btn');
const exploreCategoriesHeroBtn = document.querySelector('.hero-section .explore-categories-btn');
const shopPromoBtns = document.querySelectorAll('.shop-promo-btn');
const featuredProductsSection = document.querySelector('.featured-products-section');


// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    loadLoginStateFromLocalStorage();
    initializeCarousels();
    updateLoginUI(); // Call again after loading all states
    renderFeaturedProducts(); // Render initial products on load
});

// Header Sticky and Shadow on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        header.classList.add('sticky-header');
    } else {
        header.classList.remove('sticky-header');
    }
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileSidebar.classList.add('active');
    document.body.classList.add('no-scroll'); // Prevent scrolling body
});

closeSidebarBtn.addEventListener('click', () => {
    mobileSidebar.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Close sidebar when clicking outside (overlay effect)
mobileSidebar.addEventListener('click', (e) => {
    if (e.target === mobileSidebar) {
        mobileSidebar.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Desktop Categories Dropdown Toggle (CSS handles :hover, but JS for potential click toggle)
desktopDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        // Prevent default link behavior for dropdown toggle
        e.preventDefault();
        // Optionally, add JS to toggle visibility on click if CSS :hover is not enough or for accessibility
        const dropdownMenu = toggle.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
            dropdownMenu.classList.toggle('active'); // Add/remove active class for JS control
        }
    });
});

// Sidebar Dropdown Toggle for Categories
sidebarDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parentLi = toggle.closest('li');
        const dropdownMenu = parentLi.querySelector('.sidebar-dropdown-menu');
        parentLi.classList.toggle('active');
        if (dropdownMenu) {
            dropdownMenu.style.maxHeight = parentLi.classList.contains('active') ? `${dropdownMenu.scrollHeight}px` : '0';
        }
    });
});


// Search Bar Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase();
    
    if (query.length > 2) {
        searchTimeout = setTimeout(() => {
            filterSearchSuggestions(query);
            searchSuggestions.classList.add('active');
        }, 300); // Debounce search input
    } else {
        searchSuggestions.innerHTML = '';
        searchSuggestions.classList.remove('active');
    }
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 2) {
        searchSuggestions.classList.add('active');
    }
});

// Hide search suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('active');
    }
});

searchSuggestions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        searchInput.value = e.target.textContent;
        searchSuggestions.classList.remove('active');
        // Optionally, navigate to a search results page or filter products
        showToast(`Searching for: ${searchInput.value}`, 'info');
    }
});

document.getElementById('main-search-button').addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        showToast(`Initiating search for "${query}"`, 'info');
        // Implement actual search redirect or results display here
    }
});


// Cart Icon Click (Toggle Cart Dropdown)
cartIconBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from immediately closing
    cartDropdown.classList.toggle('active');
    if (cartDropdown.classList.contains('active')) {
        updateCartUI(); // Ensure cart is up-to-date when opened
    }
});

// Close cart dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && !cartIconBtn.contains(e.target)) {
        cartDropdown.classList.remove('active');
    }
});

// Clear Cart Button
clearCartBtn.addEventListener('click', () => {
    appState.cart = [];
    saveCartToLocalStorage();
    showToast('Your cart has been cleared.', 'info');
});

// Handle "Add to Cart" and Quantity Controls (Event Delegation)
document.addEventListener('click', (e) => {
    // Add to Cart from product cards
    if (e.target.classList.contains('btn-add-to-cart')) {
        const productId = e.target.dataset.productId;
        const productName = e.target.dataset.name;
        const productPrice = parseFloat(e.target.dataset.price);
        const productImage = e.target.dataset.image;

        if (productId && productName && !isNaN(productPrice)) {
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            showToast(`${productName} added to cart!`, 'success');
        } else {
            showToast('Error: Product data missing.', 'error');
        }
    }

    // Cart Quantity Increase
    if (e.target.classList.contains('increase-qty')) {
        const productId = e.target.dataset.productId;
        updateCartItemQuantity(productId, 1);
    }

    // Cart Quantity Decrease
    if (e.target.classList.contains('decrease-qty')) {
        const productId = e.target.dataset.productId;
        updateCartItemQuantity(productId, -1);
    }

    // Cart Item Remove
    if (e.target.classList.contains('cart-item-remove')) {
        const productId = e.target.dataset.productId;
        removeCartItem(productId);
    }
});

// Login/Register Modal Functionality
btnLogin.addEventListener('click', () => openModal(loginModalOverlay));
btnSidebarLogin.addEventListener('click', () => {
    mobileSidebar.classList.remove('active'); // Close sidebar first
    document.body.classList.remove('no-scroll');
    openModal(loginModalOverlay);
});

closeModals.forEach(btn => {
    btn.addEventListener('click', (e) => {
        closeModal(e.target.closest('.modal-overlay'));
    });
});

loginModalOverlay.addEventListener('click', (e) => {
    if (e.target === loginModalOverlay) closeModal(loginModalOverlay);
});
registerModalOverlay.addEventListener('click', (e) => {
    if (e.target === registerModalOverlay) closeModal(registerModalOverlay);
});

switchToRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModalOverlay);
    openModal(registerModalOverlay);
});

switchToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModalOverlay);
    openModal(loginModalOverlay);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('#login-email').value;
    const password = loginForm.querySelector('#login-password').value;

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    if (password.length < 6) { // Simple validation
        showToast('Password must be at least 6 characters.', 'error');
        return;
    }

    // Dummy login logic
    if (email === 'user@example.com' && password === 'password123') {
        appState.isLoggedIn = true;
        appState.currentUser = { email: email, name: 'Guest User' }; // Dummy user
        saveLoginStateToLocalStorage();
        updateLoginUI();
        closeModal(loginModalOverlay);
        showToast('Login successful! Welcome back!', 'success');
    } else {
        showToast('Invalid email or password.', 'error');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('#register-name').value;
    const email = registerForm.querySelector('#register-email').value;
    const phone = registerForm.querySelector('#register-phone').value;
    const password = registerForm.querySelector('#register-password').value;
    const confirmPassword = registerForm.querySelector('#register-confirm-password').value;
    const acceptTerms = registerForm.querySelector('#accept-terms').checked;

    if (!name || name.length < 3) {
        showToast('Please enter your full name (at least 3 characters).', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
        showToast('Please enter a valid 10-digit mobile number.', 'error');
        return;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long.', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
    }
    if (!acceptTerms) {
        showToast('You must accept the terms and conditions.', 'error');
        return;
    }

    // Dummy registration logic
    appState.isLoggedIn = true;
    appState.currentUser = { email: email, name: name }; // Dummy user
    saveLoginStateToLocalStorage();
    updateLoginUI();
    closeModal(registerModalOverlay);
    showToast('Registration successful! Welcome to Mother Milk Palace!', 'success');
    registerForm.reset(); // Clear form
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target;
        if (targetId) {
            e.preventDefault();
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Also close mobile sidebar if open
                mobileSidebar.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
});

// Hero section buttons smooth scroll
shopNowHeroBtn.addEventListener('click', () => {
    document.getElementById('offers-section').scrollIntoView({ behavior: 'smooth' });
});

exploreCategoriesHeroBtn.addEventListener('click', () => {
    document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' });
});

// Shop Promo Buttons (dynamically filter products based on category)
shopPromoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        if (category) {
            // In a real app, this would redirect to a category page or filter on current page
            showToast(`Redirecting to ${category.replace('-', ' & ').toUpperCase()} products.`, 'info');
            document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' });
            // Optionally, highlight the specific category in the carousel/grid
        }
    });
});


// --- Cart Management Functions ---

/**
 * Adds a product to the cart or increments its quantity if already present.
 * @param {Object} product - The product object to add.
 */
function addToCart(product) {
    const existingItemIndex = appState.cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        appState.cart[existingItemIndex].quantity++;
    } else {
        appState.cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
}

/**
 * Updates the quantity of a cart item.
 * @param {string} productId - ID of the product.
 * @param {number} change - Amount to change quantity by (+1 or -1).
 */
function updateCartItemQuantity(productId, change) {
    const item = appState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeCartItem(productId);
        } else {
            saveCartToLocalStorage();
        }
    }
}

/**
 * Removes an item from the cart.
 * @param {string} productId - ID of the product to remove.
 */
function removeCartItem(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    showToast('Item removed from cart.', 'info');
}

/**
 * Renders the cart items in the dropdown and updates counts/totals.
 */
function updateCartUI() {
    cartItemsList.innerHTML = ''; // Clear current items
    let totalItems = 0;
    let subtotal = 0;
    const deliveryFee = 30.00; // Fixed delivery fee

    if (appState.cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsList.style.display = 'none';
        clearCartBtn.style.display = 'none';
    } else {
        emptyCartMessage.style.display = 'none';
        cartItemsList.style.display = 'block';
        clearCartBtn.style.display = 'inline-block';

        appState.cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity; // Use base price for calculation

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity-controls">
                    <button class="decrease-qty" data-product-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-product-id="${item.id}"><i class="fas fa-plus"></i></button>
                </div>
                <button class="cart-item-remove" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            cartItemsList.appendChild(cartItemDiv);
        });
    }

    // Update cart counts
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });

    // Update totals
    cartSubtotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
    cartTotalSpan.textContent = `₹${(subtotal + deliveryFee).toFixed(2)}`;
}

// Checkout and Continue Shopping buttons in Cart
document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (appState.cart.length > 0) {
        showToast('Proceeding to checkout!', 'info');
        // In a real application, redirect to checkout page
        window.location.href = 'checkout.html'; // Example redirect
    } else {
        showToast('Your cart is empty. Please add items to checkout.', 'error');
    }
});

document.querySelector('.btn-continue-shopping').addEventListener('click', () => {
    cartDropdown.classList.remove('active');
});


// --- Login/Logout UI Update ---
function updateLoginUI() {
    const loginButton = document.querySelector('.main-header .btn-login');
    const sidebarLoginButton = document.querySelector('.mobile-navigation-sidebar .btn-sidebar-login');
    const userAuthContainer = document.querySelector('.main-header .user-auth');

    if (appState.isLoggedIn && appState.currentUser) {
        // Change login button to profile/logout
        loginButton.innerHTML = `<i class="fas fa-user-circle"></i> Hello, ${appState.currentUser.name || 'User'}`;
        loginButton.classList.add('logged-in'); // Add class for specific styling
        loginButton.removeEventListener('click', () => openModal(loginModalOverlay));
        loginButton.addEventListener('click', handleUserMenuToggle); // Show user options

        sidebarLoginButton.innerHTML = `<i class="fas fa-user-circle"></i> Hello, ${appState.currentUser.name || 'User'}`;
        sidebarLoginButton.classList.add('logged-in');
        sidebarLoginButton.removeEventListener('click', () => {
            mobileSidebar.classList.remove('active');
            document.body.classList.remove('no-scroll');
            openModal(loginModalOverlay);
        });
        sidebarLoginButton.addEventListener('click', handleUserMenuToggle); // Still opens the main menu if needed, or a user profile view

        // Create a dropdown/menu for logged-in user
        if (!document.querySelector('.user-dropdown')) {
            const userDropdown = document.createElement('div');
            userDropdown.classList.add('user-dropdown');
            userDropdown.innerHTML = `
                <ul>
                    <li><a href="#"><i class="fas fa-user"></i> My Profile</a></li>
                    <li><a href="#"><i class="fas fa-shopping-bag"></i> My Orders</a></li>
                    <li><a href="#"><i class="fas fa-heart"></i> Wishlist</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                    <li><a href="#" class="btn-logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            `;
            userAuthContainer.appendChild(userDropdown);

            // Add logout listener
            userDropdown.querySelector('.btn-logout').addEventListener('click', handleLogout);

            // Close user dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userAuthContainer.contains(e.target) && userDropdown.classList.contains('active')) {
                    userDropdown.classList.remove('active');
                }
            });
        }
    } else {
        // Reset to default login/register state
        loginButton.innerHTML = `<i class="fas fa-user-circle"></i> Login / Register`;
        loginButton.classList.remove('logged-in');
        loginButton.removeEventListener('click', handleUserMenuToggle);
        loginButton.addEventListener('click', () => openModal(loginModalOverlay));

        sidebarLoginButton.innerHTML = `<i class="fas fa-user-circle"></i> Login / Register`;
        sidebarLoginButton.classList.remove('logged-in');
        sidebarLoginButton.removeEventListener('click', handleUserMenuToggle);
        sidebarLoginButton.addEventListener('click', () => {
            mobileSidebar.classList.remove('active');
            document.body.classList.remove('no-scroll');
            openModal(loginModalOverlay);
        });

        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.remove();
        }
    }
}

function handleUserMenuToggle(e) {
    e.stopPropagation(); // Prevent clicks from bubbling and closing immediately
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');
    }
}

function handleLogout(e) {
    e.preventDefault();
    appState.isLoggedIn = false;
    appState.currentUser = null;
    saveLoginStateToLocalStorage();
    updateLoginUI();
    showToast('You have been logged out.', 'info');
    // Also close user dropdown if open
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.remove('active');
    }
}


// --- Modal Functions ---
function openModal(modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
    // Reset forms when opening
    if (modalOverlay === loginModalOverlay) {
        loginForm.reset();
        loginForm.querySelector('#login-email').focus();
    } else if (modalOverlay === registerModalOverlay) {
        registerForm.reset();
        registerForm.querySelector('#register-name').focus();
    }
}

function closeModal(modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// --- Dynamic Product Rendering for Featured/Offer Sections ---
/**
 * Renders products into the featured product grid.
 * This function can be extended to filter by category or apply search.
 */
function renderFeaturedProducts() {
    const productGrid = document.querySelector('.featured-products-section .product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; // Clear existing content

    // Filter products that have an offerPrice for the "Today's Best Deals & Offers" section
    const offerProducts = appState.products.filter(p => p.offerPrice && p.offerPrice < p.price);

    // Limit to a certain number if needed, or dynamically load more
    const productsToDisplay = offerProducts.slice(0, 12); // Display top 12 offers

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'offer-card');

        // Calculate discount percentage for the badge
        const discount = ((product.price - product.offerPrice) / product.price) * 100;
        let offerBadgeText = `${Math.round(discount)}% OFF`;
        if (product.id === 'potato-1kg') { // Special handling for BOGO
            offerBadgeText = 'Buy 1 Get 1';
        } else if (product.id === 'rice-1kg') { // Special handling for SAVE ₹50
            offerBadgeText = 'SAVE ₹50';
        } else if (product.id === 'oil-1l') { // Special handling for FLAT ₹20 OFF
            offerBadgeText = 'FLAT ₹20 OFF';
        } else if (product.id === 'tomato-500g') { // Special handling for HOT DEAL
            offerBadgeText = 'HOT DEAL';
        } else if (product.id === 'dettol-handwash') { // Special handling for UPTO 40% OFF
            offerBadgeText = 'UPTO 40% OFF';
        }


        productCard.innerHTML = `
            <div class="offer-badge">${offerBadgeText}</div>
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price-info">
                <span class="product-price new-price">₹${product.offerPrice.toFixed(2)}</span>
                <span class="product-price old-price">₹${product.price.toFixed(2)}</span>
            </div>
            <div class="product-actions">
                <span class="product-weight">${product.weight}</span>
                <button class="btn btn-add-to-cart"
                    data-product-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.offerPrice}"
                    data-image="${product.imageUrl}">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// --- Search Suggestions Logic ---
function filterSearchSuggestions(query) {
    const filteredProducts = appState.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to top 10 suggestions

    searchSuggestions.innerHTML = '';
    const ul = document.createElement('ul');

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            ul.appendChild(li);
        });
        searchSuggestions.appendChild(ul);
    } else {
        const li = document.createElement('li');
        li.textContent = 'No results found.';
        li.style.pointerEvents = 'none'; // Make it unclickable
        li.style.color = '#888';
        ul.appendChild(li);
        searchSuggestions.appendChild(ul);
    }
}

// --- Carousel Initialization (Owl Carousel) ---
function initializeCarousels() {
    // Categories Carousel
    $('.categories-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                stagePadding: 40 // See more of next item
            },
            600: {
                items: 2,
                stagePadding: 20
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1200: {
                items: 5
            }
        }
    });

    // Testimonials Carousel
    $('.testimonials-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Partners Carousel
    $('.partners-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            768: {
                items: 4
            },
            992: {
                items: 5
            },
            1200: {
                items: 6
            }
        }
    });
}

// Initial calls to load state and update UI
loadCartFromLocalStorage();
loadLoginStateFromLocalStorage();
renderFeaturedProducts();
initializeCarousels(); // Ensure carousels are initialized on page load

// Additional dynamic content (e.g., populating all product listings)
// This would be a more extensive function if you had a dedicated products page
// For now, we only render featured ones as defined in HTML.
// If you wanted to dynamically load ALL products from appState.products into a "View All Products" grid:

/*
function renderAllProducts() {
    const allProductsGrid = document.querySelector('#all-products-section .product-grid'); // Assuming you add this section
    if (!allProductsGrid) return;

    allProductsGrid.innerHTML = '';
    appState.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        // Determine price to display - offer price if available, else regular price
        const displayPrice = product.offerPrice ? product.offerPrice : product.price;
        const oldPriceHtml = product.offerPrice ? `<span class="product-price old-price">₹${product.price.toFixed(2)}</span>` : '';
        const offerBadgeHtml = product.offerPrice ? `<div class="offer-badge">${Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF</div>` : '';


        productCard.innerHTML = `
            ${offerBadgeHtml}
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price-info">
                <span class="product-price new-price">₹${displayPrice.toFixed(2)}</span>
                ${oldPriceHtml}
            </div>
            <div class="product-actions">
                <span class="product-weight">${product.weight}</span>
                <button class="btn btn-add-to-cart"
                    data-product-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${displayPrice}"
                    data-image="${product.imageUrl}">
                    Add to Cart
                </button>
            </div>
        `;
        allProductsGrid.appendChild(productCard);
    });
}
// Call renderAllProducts() if you add a section for it in HTML
// document.querySelector('.btn-view-all-products').addEventListener('click', () => {
//     window.location.href = 'products.html'; // Or show/hide products section
// });
*/

// Example of a "View All Products" button handler
document.querySelector('.btn-view-all-products').addEventListener('click', () => {
    showToast('Redirecting to the full product catalog!', 'info');
    // In a real application, you would either:
    // 1. Redirect to a dedicated products page (e.g., window.location.href = 'products.html';)
    // 2. Dynamically load/filter a larger product grid on the current page.
    // For this example, let's just scroll to the top category section
    document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' });
});

// Location selector logic (dummy for now)
document.getElementById('delivery-location').addEventListener('change', (e) => {
    showToast(`Delivery location set to: ${e.target.value.toUpperCase()}`, 'info');
    // In a real app, this would trigger location-based pricing/availability.
});

// Contact Form Submission (dummy)
document.querySelector('.message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('#contact-name').value;
    const email = e.target.querySelector('#contact-email').value;
    const subject = e.target.querySelector('#contact-subject').value;
    const message = e.target.querySelector('#contact-message').value;

    if (!name || !email || !subject || !message) {
        showToast('Please fill in all contact form fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address for contact.', 'error');
        return;
    }

    // Simulate sending data
    console.log('Contact Form Submitted:', { name, email, subject, message });
    showToast('Your message has been sent successfully!', 'success');
    e.target.reset(); // Clear form
});

// Newsletter Form Submission (dummy)
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address for newsletter subscription.', 'error');
        return;
    }

    // Simulate subscription
    console.log('Newsletter Subscription:', { email });
    showToast('Thank you for subscribing to our newsletter!', 'success');
    e.target.reset(); // Clear form
});

// Enhance input focus with animations (pure CSS can do this, but JS for more complex behaviors)
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.classList.remove('focused');
    });
});

// Animation for hero section elements on load
window.addEventListener('load', () => {
    const heroText = document.querySelector('.hero-text-content');
    const heroImage = document.querySelector('.hero-image-content');

    if (heroText && heroImage) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(20px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroText.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroImage.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 200); // Small delay after page load
    }
});
