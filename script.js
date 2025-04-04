document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const appContainer = document.querySelector('.app-container'),
          allScreens = document.querySelectorAll('.screen'),
          navigationElements = document.querySelectorAll('[data-target]'),
          htmlElement = document.documentElement,
          bodyElement = document.body,
          loginEmailInput = document.getElementById('login-email'),
          loginPasswordInput = document.getElementById('login-password'),
          loginSubmitButton = document.getElementById('login-submit'),
          loginErrorMsg = document.getElementById('login-error'),
          gotoAdminLoginButton = document.getElementById('goto-admin-login-button'),
          registerEmailInput = document.getElementById('register-email'),
          registerPasswordInput = document.getElementById('register-password'),
          registerPasswordConfirmInput = document.getElementById('register-password-confirm'),
          registerPhotoPicker = document.getElementById('register-photo-picker'),
          registerSubmitButton = document.getElementById('register-submit'),
          registerErrorMsg = document.getElementById('register-error'),
          logoutButton = document.getElementById('logout-button'),
          menuGrid = document.getElementById('menu-grid'),
          menuSortButtonsContainer = document.getElementById('menu-sort-buttons'),
          discoverButton = document.getElementById('discover-button'), // Button on Screen 3
          cartBadge = document.getElementById('cart-badge'),
          cartItemsContainer = document.getElementById('cart-items-container'),
          totalCalculationDetails = document.getElementById('total-calculation-details'),
          checkoutButton = document.getElementById('checkout-button'),
          userDisplayName = document.getElementById('user-display-name'),
          userProfileImage = document.getElementById('user-profile-image-display'),
          guestUserIcon = document.getElementById('guest-user-icon'),
          paymentMethodsContainer = document.getElementById('payment-methods'),
          adminEmailInput = document.getElementById('admin-email'),
          adminPasswordInput = document.getElementById('admin-password'),
          adminLoginSubmitButton = document.getElementById('admin-login-submit'),
          adminLoginErrorMsg = document.getElementById('admin-login-error'),
          mgmtBackToLoginButton = document.getElementById('mgmt-back-to-login'),
          orderSearchInput = document.getElementById('order-search-input'),
          orderSearchButton = document.getElementById('order-search-button'),
          orderLogContainer = document.getElementById('order-log-container'),
          orderPreviewSection = document.getElementById('order-preview-section'),
          orderPreviewContent = document.getElementById('order-preview-content'),
          orderStatusControls = document.getElementById('order-status-controls'),
          // Screen 7 elements
          itemPreviewBackButton = document.getElementById('item-preview-back-button'),
          previewItemImage = document.getElementById('preview-item-image'),
          previewItemName = document.getElementById('preview-item-name'),
          previewItemDescription = document.getElementById('preview-item-description'),
          previewItemPrice = document.getElementById('preview-item-price'),
          addToCartPreviewButton = document.getElementById('add-to-cart-preview-button'),
          cartBadgePreview = document.getElementById('cart-badge-preview'),
          // Screen 8 elements
          cartBadgeDiscovery = document.getElementById('cart-badge-discovery'),
          discoveryBundlesScroller = document.getElementById('discovery-bundles-scroller'),
          discoverySuggestionsGrid = document.getElementById('discovery-suggestions-grid'),
          discoveryCategoriesContainer = document.getElementById('discovery-categories-container'),
          // Fixed & Settings
          toggleFullScreenButton = document.getElementById('toggle-fullscreen-btn'),
          settingsBtn = document.getElementById('settings-btn'),
          settingsPanel = document.getElementById('settings-panel'),
          languageGroup = document.getElementById('language-group'),
          currentLanguageDisplay = document.getElementById('current-language-display'),
          currentLanguageText = document.getElementById('current-language-text'),
          languageOptions = document.getElementById('language-options'),
          themeGroup = document.getElementById('theme-group'),
          currentThemeDisplay = document.getElementById('current-theme-display'),
          currentThemeText = document.getElementById('current-theme-text'),
          currentThemeSwatch = document.getElementById('current-theme-swatch'),
          themeOptions = document.getElementById('theme-options'),
          discoveryModeToggle = document.getElementById('discovery-mode-toggle'); // Toggle in Settings

    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const customAlertBox = document.getElementById('custom-alert-box');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close');
    const customAlertTitle = customAlertBox.querySelector('h3');

    // Passcode Modal Elements (Updated IDs)
    const passcodeModalOverlay = document.getElementById('passcode-modal-overlay');
    const passcodeModalBox = document.getElementById('passcode-modal-box');
    const passcodeModalTitle = document.getElementById('passcode-modal-title');
    const passcodeModalInput = document.getElementById('passcode-modal-input');
    const passcodeModalError = document.getElementById('passcode-modal-error');
    const passcodeModalOk = document.getElementById('passcode-modal-ok');
    const passcodeModalCancel = document.getElementById('passcode-modal-cancel');

    // Product Management Elements
    const productListContainer = document.getElementById('product-list-container');
    const addProductForm = document.querySelector('.add-product-form');
    const newProductNameInput = document.getElementById('new-product-name');
    const newProductDescInput = document.getElementById('new-product-desc');
    const newProductPriceInput = document.getElementById('new-product-price');
    const newProductQuantityInput = document.getElementById('new-product-quantity');
    const newProductImageInput = document.getElementById('new-product-image');
    const newProductCategorySelect = document.getElementById('new-product-category');
    const addNewProductButton = document.getElementById('add-new-product-button');
    const addProductErrorMsg = document.getElementById('add-product-error');
    const productPriceLabel = document.querySelector('label[for="new-product-price"]'); // For currency symbol


    // --- State Variables ---
    let currentScreen = null,
        currentUser = null,
        cart = [],
        selectedPaymentMethod = 'cash',
        allOrders = [],
        currentAdminOrderSelection = null;
    const ADMIN_EMAIL = "admin@canteen.app",
          ADMIN_PASSWORD = "admin123",
          DISCOVERY_PASSCODE = "4321",
          DEFAULT_PROFILE_PIC = 'https://i.postimg.cc/XYGqh5B2/IMG.png';
    let currentLanguage = localStorage.getItem('appLanguage') || 'en';
    let currentTheme = localStorage.getItem('appTheme') || 'blue';
    let isDiscoveryModeActivated = localStorage.getItem('discoveryModeActivated') === 'true';
    let previousScreenId = null; // Variable to track screen before item preview
    let previewButtonTimeout = null;
    let bundleButtonTimeouts = {};
    let suggestionButtonTimeouts = {};


    // --- Data & Translations ---
    // MODIFIED: Added quantity to baseMenuData items
    let baseMenuData = [ // Changed to let for adding new products
        {id: 'coffee', price: 30, image: 'https://media.elwatannews.com/media/img/mediaarc/large/20237496061663046251.jpg', category: 'sweet', quantity: 999, name_key: 'item_name_coffee', description_key: 'item_desc_coffee'},
        {id: 'pizza', price: 70, image: 'https://www.foodandwine.com/thmb/4qg95tjf0mgdHqez5OLLYc0PNT4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg', category: 'lunch', quantity: 999, name_key: 'item_name_pizza', description_key: 'item_desc_pizza'},
        {id: 'cookies', price: 20, image: 'https://interpretationfordream.com/wp-content/uploads/2024/09/069873874340983.webp', category: 'sweet', quantity: 999, name_key: 'item_name_cookies', description_key: 'item_desc_cookies'},
        {id: 'fries', price: 35, image: 'https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=1200&q=82&auto=format&fit=crop&dm=1662474181&s=687036746e03f50b6204c1390acdb537', category: 'snacks', quantity: 999, name_key: 'item_name_fries', description_key: 'item_desc_fries'},
        {id: 'burger', price: 60, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScReRWtq7d-yl2aIG7jOJs5FUrxeJpi-DyfZ8OycsNa_taC8mePeUW6-JE&s=10', category: 'lunch', quantity: 999, name_key: 'item_name_burger', description_key: 'item_desc_burger'},
        {id: 'soda', price: 15, image: 'https://jx.sa/8860-large_default/soda-star-water-300-ml-x-24.jpg', category: 'snacks', quantity: 999, name_key: 'item_name_soda', description_key: 'item_desc_soda'},
        {id: 'salad', price: 45, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5sqfCpGLeoxFBPGxFxzmygHlKJgDnU-SJHEx9hVIyhnrpGmldu20OirA&s=10', category: 'lunch', quantity: 999, name_key: 'item_name_salad', description_key: 'item_desc_salad'},
        {id: 'cake', price: 40, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFIIgqKfBgFotly6OrxXqxBGO_jLh-DIINS_e-_o4gaKlk3I9tvobZaKk&s=10', category: 'sweet', quantity: 999, name_key: 'item_name_cake', description_key: 'item_desc_cake'},
        {id: 'croissant', price: 25, image: 'https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-articleLarge.jpg', category: 'sweet', quantity: 999, name_key: 'item_name_croissant', description_key: 'item_desc_croissant'},
        {id: 'pasta', price: 55, image: 'https://images.services.kitchenstories.io/eT6sd87C6s0sOmsM8S2IDw96_Xs=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R131-final-photo-3-sg.jpg', category: 'lunch', quantity: 999, name_key: 'item_name_pasta', description_key: 'item_desc_pasta'},
        {id: 'chips', price: 10, image: 'https://preppykitchen.com/wp-content/uploads/2024/05/Homemade-Potato-Chips-Recipe-Card.jpg', category: 'snacks', quantity: 999, name_key: 'item_name_chips', description_key: 'item_desc_chips'},
        {id: 'juice', price: 20, image: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/orange-juice-1296x728-feature.jpg', category: 'sweet', quantity: 999, name_key: 'item_name_juice', description_key: 'item_desc_juice'},
        {id: 'sandwich', price: 50, image: 'https://www.dukeshill.co.uk/cdn/shop/articles/20240725081844-chicken-20bacon-20club-20sandwich-20main-20landscape_1024x1024.jpg?v=1724401314', category: 'lunch', quantity: 999, name_key: 'item_name_sandwich', description_key: 'item_desc_sandwich'},
        {id: 'muffin', price: 22, image: 'https://www.giallozafferano.com/images/269-26998/Chocolate-Chip-Muffins_1200x800.jpg', category: 'sweet', quantity: 999, name_key: 'item_name_muffin', description_key: 'item_desc_muffin'},
        {id: 'onionrings', price: 30, image: 'https://i0.wp.com/www.angsarap.net/wp-content/uploads/2015/03/Onion-Rings-Wide.jpg', category: 'snacks', quantity: 999, name_key: 'item_name_onionrings', description_key: 'item_desc_onionrings'},
        {id: 'soup', price: 35, image: 'https://i.postimg.cc/HxCYPzWN/Soup.jpg', category: 'lunch', quantity: 999, name_key: 'item_name_soup', description_key: 'item_desc_soup'}
    ];
    const mealSuggestions = [
        { id: 'sugg-1', name_key: 'suggestion_burger_combo_name', description_key: 'suggestion_burger_combo_desc', itemIds: ['burger', 'fries', 'soda'] },
        { id: 'sugg-2', name_key: 'suggestion_coffee_break_name', description_key: 'suggestion_coffee_break_desc', itemIds: ['coffee', 'muffin'] },
        { id: 'sugg-3', name_key: 'suggestion_lunch_light_name', description_key: 'suggestion_lunch_light_desc', itemIds: ['salad', 'juice'] }
    ];
    const bundleOffers = [
        { id: 'bundle-lunch-deal', name_key: 'bundle_lunch_deal_name', description_key: 'bundle_lunch_deal_desc', itemIds: ['pizza', 'salad', 'soda'], discountPercent: 15 },
        { id: 'bundle-sweet-treat', name_key: 'bundle_sweet_treat_name', description_key: 'bundle_sweet_treat_desc', itemIds: ['cake', 'coffee', 'croissant'], discountPercent: 20 }
    ];

    let translations = { // Changed to let for adding new keys
        welcome_title: { en: "Welcome to<br>EVA Canteen", ar: "أهلاً بكم في<br>كانتين إيفا" },
        canteen_name: { en: "EVA Canteen", ar: "كانتين إيفا" },
        sign_in_label: { en: "sign in", ar: "تسجيل الدخول" },
        email_placeholder: { en: "email.....", ar: "البريد الإلكتروني....." },
        password_placeholder: { en: "password*****", ar: "كلمة المرور*****" },
        password_again_placeholder: { en: "password again*****", ar: "كلمة المرور مرة أخرى*****" },
        submit_button: { en: "submit", ar: "تأكيد" },
        register_button: { en: "Register", ar: "تسجيل" },
        login_button: { en: "Login", ar: "دخول" },
        new_account_prompt: { en: "new account?", ar: "حساب جديد؟" },
        pick_photo_label: { en: "pick photo", ar: "اختر صورة" },
        back_to_login_button: { en: "Back to Login", ar: "العودة للدخول" },
        back_to_welcome_button: { en: "Back to Welcome", ar: "العودة للترحيب" },
        back_button: { en: "Back", ar: "رجوع" },
        logout_button: { en: "Log out", ar: "تسجيل الخروج" },
        cart_label: { en: "Cart", ar: "السلة" },
        menu_label: { en: "Menu", ar: "القائمة" },
        sort_label: { en: "Sort", ar: "فرز" },
        sort_sweet: { en: "sweet", ar: "حلويات" },
        sort_lunch: { en: "lunch", ar: "غداء" },
        sort_snacks: { en: "snacks", ar: "خفيف" },
        total_label: { en: "Total", ar: "الإجمالي" },
        payment_method_label: { en: "Payment Method", ar: "طريقة الدفع" },
        payment_cash: { en: "Cash", ar: "نقداً" },
        payment_card: { en: "Card", ar: "بطاقة" },
        add_to_cart_button: { en: "Add to Cart", ar: "أضف إلى السلة" },
        added_to_cart_button: { en: "Added!", ar: "تمت الإضافة!" },
        item_details_title: { en: "Item Details", ar: "تفاصيل المنتج" },
        item_name_placeholder: { en: "Item Name", ar: "اسم المنتج" },
        item_description_placeholder: { en: "Item description loading...", ar: "جاري تحميل وصف المنتج..." },
        cart_empty_message: { en: "Your cart is empty.", ar: "سلتك فارغة." },
        checkout_success_alert: { en: "Payment Method: {method}\nOrder ID: {id}\n\nYour order is placed (simulation).", ar: "الإجمالي: {total}\nطريقة الدفع: {method}\nرقم الطلب: {id}\n\nجاري إعداد طلبك (محاكاة)." },
        checkout_success_title: { en: "Order Confirmed!", ar: "تم تأكيد الطلب!" },
        ok_button: { en: "OK", ar: "تم" },
        cart_is_empty_alert: { en: "Your cart is empty!", ar: "سلتك فارغة!" },
        currency_symbol: { en: "L.E", ar: "ج.م" },
        quantity_prefix: { en: "x", ar: "×" },
        login_error_invalid: { en: "Invalid credentials.", ar: "بيانات الاعتماد غير صالحة." },
        login_error_fields: { en: "Please enter email and password.", ar: "الرجاء إدخال البريد الإلكتروني وكلمة المرور." },
        register_error_match: { en: "Passwords don't match or field empty.", ar: "كلمات المرور غير متطابقة أو الحقل فارغ." },
        register_error_fields: { en: "Please fill all fields.", ar: "الرجاء ملء جميع الحقول." },
        register_error_photo: { en: "Please select a profile picture.", ar: "الرجاء اختيار صورة شخصية." },
        management_button: { en: "Management", ar: "الإدارة" },
        admin_login_title: { en: "Management<br>Login", ar: "تسجيل دخول<br>الإدارة" },
        admin_enter_creds: { en: "Enter Credentials", ar: "أدخل بيانات الاعتماد" },
        admin_email_placeholder: { en: "admin email.....", ar: "بريد المدير....." },
        admin_password_placeholder: { en: "admin password*****", ar: "كلمة مرور المدير*****" },
        admin_login_error: { en: "Invalid admin credentials.", ar: "بيانات اعتماد المدير غير صالحة." },
        exit_button: { en: "Exit", ar: "خروج" },
        order_management_title: { en: "Order Management", ar: "إدارة الطلبات" },
        search_order_id_placeholder: { en: "Search by Order ID...", ar: "ابحث برقم الطلب..." },
        search_button: { en: "Search", ar: "بحث" },
        order_log_title: { en: "Order Log", ar: "سجل الطلبات" },
        no_orders_found: { en: "No orders found.", ar: "لم يتم العثور على طلبات." },
        order_preview_title: { en: "Order Preview", ar: "معاينة الطلب" },
        order_preview_placeholder: { en: "Select an order from the log to view details.", ar: "اختر طلبًا من السجل لعرض التفاصيل." },
        order_id_label: { en: "Order ID", ar: "رقم الطلب" },
        order_placed_label: { en: "Placed", ar: "تاريخ الطلب" },
        order_status_label: { en: "Status", ar: "الحالة" },
        order_payment_label: { en: "Payment", ar: "الدفع" },
        order_total_label: { en: "Total", ar: "الإجمالي" },
        order_items_label: { en: "Items", ar: "المنتجات" },
        order_status_pending: { en: "pending", ar: "قيد الانتظار" },
        order_status_preparing: { en: "preparing", ar: "قيد التجهيز" },
        order_status_delivered: { en: "delivered", ar: "تم التوصيل" },
         subtotal_label: { en: "Subtotal", ar: "المجموع قبل الخصم" }, // ADDED Subtotal translation
         settings_title: { en: "Settings", ar: "الإعدادات" }, settings_button_label: { en: "Settings", ar: "الإعدادات" }, language_setting_label: { en: "Language", ar: "اللغة" }, theme_setting_label: { en: "App Theme", ar: "سمة التطبيق" },
         theme_blue: { en: "Blue (Default)", ar: "الأزرق (الافتراضي)" }, theme_green: { en: "Green", ar: "الأخضر" }, theme_purple: { en: "Purple", ar: "البنفسجي" },
         theme_light_blue: { en: "Light Blue", ar: "أزرق فاتح" }, theme_mono_light: { en: "Monochrome Light", ar: "أبيض وأسود فاتح" }, theme_dark_grey: { en: "Dark Grey", ar: "رمادي داكن" }, theme_night: { en: "Night Mode", ar: "الوضع الليلي" },
         theme_mono_dark: { en: "Monochrome Dark", ar: "أبيض وأسود داكن" },
         theme_yellow: { en: "Yellow", ar: "أصفر" },
         theme_orange: { en: "Orange", ar: "برتقالي" },
         item_name_coffee: { en: "Coffee", ar: "قهوة" }, item_name_pizza: { en: "Pizza", ar: "بيتزا" }, item_name_cookies: { en: "Cookies", ar: "كوكيز" }, item_name_fries: { en: "French fries", ar: "بطاطس مقلية" }, item_name_burger: { en: "Burger", ar: "برجر" }, item_name_soda: { en: "Soda", ar: "صودا" }, item_name_salad: { en: "Salad", ar: "سلطة" }, item_name_cake: { en: "Cake Slice", ar: "شريحة كيك" }, item_name_croissant: { en: "Croissant", ar: "كرواسون" }, item_name_pasta: { en: "Pasta Aglio e Olio", ar: "باستا أليو إي أوليو" }, item_name_chips: { en: "Potato Chips", ar: "رقائق البطاطس" }, item_name_juice: { en: "Orange Juice", ar: "عصير برتقال" }, item_name_sandwich: { en: "Club Sandwich", ar: "كلوب ساندويتش" }, item_name_muffin: { en: "Muffin", ar: "مافن" }, item_name_onionrings: { en: "Onion Rings", ar: "حلقات بصل" }, item_name_soup: { en: "Soup of the Day", ar: "شوربة اليوم" },
         item_desc_coffee: { en: "A rich and aromatic blend, perfect to kickstart your day or enjoy a relaxing break.", ar: "مزيج غني وعطري، مثالي لبدء يومك أو الاستمتاع باستراحة مريحة." }, item_desc_pizza: { en: "Classic cheese pizza with a tangy tomato sauce and a crispy crust. Always a favorite!", ar: "بيتزا جبنة كلاسيكية بصلصة طماطم منعشة وقشرة مقرمشة. الخيار المفضل دائماً!" }, item_desc_cookies: { en: "Deliciously chewy chocolate chip cookies, baked fresh. Irresistible!", ar: "كوكيز برقائق الشوكولاتة لذيذة ومخبوزة طازجة. لا تقاوم!" }, item_desc_fries: { en: "Crispy golden french fries, lightly salted. The perfect side or snack.", ar: "بطاطس مقلية ذهبية مقرمشة، مملحة قليلاً. الطبق الجانبي أو الوجبة الخفيفة المثالية." }, item_desc_burger: { en: "Juicy beef patty on a toasted bun with lettuce, tomato, and our special sauce.", ar: "قطعة لحم بقري طرية على خبز محمص مع خس وطماطم وصلصتنا الخاصة." }, item_desc_soda: { en: "A cold and refreshing fizzy drink to quench your thirst.", ar: "مشروب غازي بارد ومنعش لإرواء عطشك." }, item_desc_salad: { en: "A fresh mix of greens, vegetables, and a light vinaigrette dressing. Healthy and tasty!", ar: "مزيج طازج من الخضروات الورقية والخضروات وصلصة الخل الخفيفة. صحي ولذيذ!" }, item_desc_cake: { en: "A moist and decadent slice of chocolate cake with creamy frosting. Pure indulgence!", ar: "شريحة كيك شوكولاتة رطبة وغنية مع كريمة غنية. متعة خالصة!" }, item_desc_croissant: { en: "A buttery, flaky, viennoiserie pastry inspired by the shape of the Austrian kipferl.", ar: "معجنات فيينوازري زبدية وهشة مستوحاة من شكل الكيفرل النمساوي." }, item_desc_pasta: { en: "Simple yet delicious Italian pasta dish with garlic, olive oil, and red pepper flakes.", ar: "طبق باستا إيطالي بسيط ولكنه لذيذ بالثوم وزيت الزيتون ورقائق الفلفل الأحمر." }, item_desc_chips: { en: "Thinly sliced potatoes, deep-fried or baked until crispy. The ultimate salty snack!", ar: "شرائح بطاطس رفيعة، مقلية أو مخبوزة حتى تصبح مقرمشة. الوجبة الخفيفة المالحة المطلقة!" }, item_desc_juice: { en: "Freshly squeezed orange juice, packed with Vitamin C and natural sweetness.", ar: "عصير برتقال طازج، غني بفيتامين سي وحلاوة طبيعية." }, item_desc_sandwich: { en: "Classic club sandwich with layers of turkey, bacon, lettuce, tomato, and mayo on toasted bread.", ar: "كلوب ساندويتش كلاسيكي بطبقات من الديك الرومي، لحم مقدد، خس، طماطم، ومايونيز على خبز محمص." }, item_desc_muffin: { en: "A soft and moist muffin, perfect for breakfast or a sweet treat. Ask for today's flavor!", ar: "مافن طري ورطب، مثالي للإفطار أو كحلوى. اسأل عن نكهة اليوم!" }, item_desc_onionrings: { en: "Thick-cut onion rings coated in a crispy batter and fried to golden perfection.", ar: "حلقات بصل سميكة مغطاة بعجينة مقرمشة ومقلية حتى الكمال الذهبي." }, item_desc_soup: { en: "Warm and comforting soup made fresh daily. Please ask your server for today's selection.", ar: "شوربة دافئة ومريحة تحضر طازجة يوميًا. يرجى سؤال النادل عن اختيار اليوم." }, item_desc_default: { en: "A tasty item from our menu.", ar: "منتج لذيذ من قائمتنا." },
         // Discovery Mode Translations
         discover_button: { en: "Discover", ar: "اكتشف" },
         discovery_mode_title: { en: "Discovery Mode", ar: "وضع الاستكشاف" },
         discovery_mode_enable_label: { en: "Enable Discovery Mode", ar: "تفعيل وضع الاستكشاف" },
         discovery_bundles_title: { en: "Special Bundles", ar: "عروض خاصة" },
         discovery_suggestions_title: { en: "Meal Ideas", ar: "أفكار وجبات" },
         discovery_all_items_title: { en: "Explore the Menu", ar: "استكشف القائمة" },
         suggestion_burger_combo_name: { en: "Classic Combo", ar: "كومبو كلاسيك" },
         suggestion_burger_combo_desc: { en: "The perfect trio: Burger, Fries, and Soda.", ar: "الثلاثي المثالي: برجر، بطاطس، وصودا." },
         suggestion_coffee_break_name: { en: "Coffee Break", ar: "استراحة قهوة" },
         suggestion_coffee_break_desc: { en: "Relax with a warm Coffee and a soft Muffin.", ar: "استرخِ مع قهوة دافئة ومافن طري." },
         suggestion_lunch_light_name: { en: "Light Lunch", ar: "غداء خفيف" },
         suggestion_lunch_light_desc: { en: "A healthy and refreshing Salad paired with Juice.", ar: "سلطة صحية ومنعشة مع عصير." },
         bundle_lunch_deal_name: { en: "Lunch Power Deal", ar: "عرض الغداء القوي" },
         bundle_lunch_deal_desc: { en: "Grab a Pizza, Salad, and Soda together and save!", ar: "احصل على بيتزا وسلطة وصودا معًا ووفر!" },
         bundle_sweet_treat_name: { en: "Sweet Treat Bundle", ar: "حزمة الحلوى اللذيذة" },
         bundle_sweet_treat_desc: { en: "Indulge with Cake, Coffee, and a Croissant at a special price.", ar: "دلل نفسك بالكيك والقهوة والكرواسون بسعر خاص." },
         add_bundle_button: { en: "Add Bundle", ar: "أضف الحزمة" },
         bundle_added_button: { en: "Bundle Added!", ar: "تمت إضافة الحزمة!" },
         discount_tag: { en: "{percent}% OFF", ar: "خصم {percent}%" },
         includes_items: { en: "Includes:", ar: "يشمل:" },
         original_price: { en: "Original:", ar: "الأصلي:" },
         bundle_price: { en: "Bundle Price:", ar: "سعر الحزمة:" },
         add_suggestion_button: { en: "Add All Items", ar: "أضف كل المنتجات" },
         suggestion_added_button: { en: "Items Added!", ar: "تمت إضافة المنتجات!" },
         suggestion_total_price: { en: "Total Price:", ar: "السعر الإجمالي:" },
         bundle_discount_applied: { en: "Bundle Discount", ar: "خصم الحزمة" },
         // Passcode Modal Translations
         discovery_passcode_prompt: { en: "Enter Discovery Mode Passcode:", ar: "أدخل رمز مرور وضع الاستكشاف:" },
         discovery_passcode_modal_title: { en: "Enter Passcode", ar: "أدخل الرمز" },
         discovery_passcode_incorrect_message: { en: "Incorrect passcode entered.", ar: "تم إدخال رمز مرور غير صحيح." },
         cancel_button: { en: "Cancel", ar: "إلغاء" },
         // Product Management Translations
         manage_products_title: { en: "Manage Products", ar: "إدارة المنتجات" },
         add_new_product_title: { en: "Add New Product", ar: "إضافة منتج جديد" },
         product_name_label: { en: "Product Name:", ar: "اسم المنتج:" },
         product_name_placeholder: { en: "e.g., Special Sandwich", ar: "مثال: ساندويتش خاص" },
         product_desc_label: { en: "Description:", ar: "الوصف:" },
         product_desc_placeholder: { en: "e.g., Chicken, lettuce, tomato...", ar: "مثال: دجاج، خس، طماطم..." },
         product_price_label: { en: "Price ({currency}):", ar: "السعر ({currency}):" },
         product_price_placeholder: { en: "e.g., 55.50", ar: "مثال: 55.50" },
         product_quantity_label: { en: "Initial Quantity:", ar: "الكمية الأولية:" },
         product_quantity_placeholder: { en: "e.g., 50 (999 for unlimited)", ar: "مثال: 50 (999 للمتاح دائماً)" },
         product_image_label: { en: "Image URL:", ar: "رابط الصورة:" },
         product_image_placeholder: { en: "https://...", ar: "https://..." },
         product_category_label: { en: "Category:", ar: "الفئة:" },
         add_product_button: { en: "Add Product", ar: "إضافة المنتج" },
         save_button: { en: "Save", ar: "حفظ" },
         saved_button: { en: "Saved!", ar: "تم الحفظ!" },
         product_quantity_header: { en: "Qty", ar: "الكمية" }, // Optional header for list
         add_product_error_generic: { en: "Please fill all fields correctly.", ar: "الرجاء ملء جميع الحقول بشكل صحيح." },
         add_product_error_price: { en: "Invalid price.", ar: "السعر غير صالح." },
         add_product_error_quantity: { en: "Invalid quantity.", ar: "الكمية غير صالحة." },
         add_product_error_image: { en: "Invalid image URL.", ar: "رابط الصورة غير صالح." },
         add_product_success: { en: "Product '{name}' added successfully!", ar: "تمت إضافة المنتج '{name}' بنجاح!" }
    };


    // --- Helper Functions ---
    function getText(key) { const ts = translations[key]; if (ts) return ts[currentLanguage] || ts['en'] || `[${key}]`; console.warn(`TKey not found: ${key}`); return `[${key}]`; }
    function getCurrency() { return getText('currency_symbol'); } function formatPrice(p) { return `${p} ${getCurrency()}`; }

    // --- Theme Switching Function ---
    function applyTheme(themeName) { console.log("Applying theme:", themeName); bodyElement.dataset.theme = themeName; currentTheme = themeName; localStorage.setItem('appTheme', themeName); if (settingsPanel) updateThemeDisplay(); }

    // --- Settings Panel Logic ---
    function toggleSettingsPanel(show) { if (!settingsPanel) return; const i = settingsPanel.classList.contains('visible'); if (typeof show === 'boolean') { if (show && !i) { settingsPanel.classList.add('visible'); document.addEventListener('click', handleOutsideSettingsClick, true); updateSettingsDisplays(); } else if (!show && i) { closeAllSettingsDropdowns(); settingsPanel.classList.remove('visible'); document.removeEventListener('click', handleOutsideSettingsClick, true); } } else { toggleSettingsPanel(!i); } }
    function handleOutsideSettingsClick(e) { if (settingsPanel && !settingsPanel.contains(e.target) && settingsBtn && !settingsBtn.contains(e.target)) { toggleSettingsPanel(false); } else { const isDropdownControl = currentLanguageDisplay?.contains(e.target) || currentThemeDisplay?.contains(e.target); const isDropdownList = languageOptions?.contains(e.target) || themeOptions?.contains(e.target); const isToggleControl = discoveryModeToggle?.contains(e.target); /* Check for toggle click */ if (settingsPanel && settingsPanel.contains(e.target) && !isDropdownControl && !isDropdownList && !isToggleControl) { closeAllSettingsDropdowns(); } } }
    function toggleSettingsDropdown(g) { if (!g) return; const o = g === languageGroup ? themeGroup : languageGroup; const i = !g.classList.contains('open'); const d = g.querySelector('.settings-current-display'); const l = g.querySelector('.settings-options-list'); if (i && o && o.classList.contains('open')) { o.classList.remove('open', 'open-upward'); const oD = o.querySelector('.settings-current-display'); if (oD) oD.setAttribute('aria-expanded', 'false'); } let u = false; if (i && d && l) { const e = 150; const r = d.getBoundingClientRect(); const sB = window.innerHeight - r.bottom - 10; const sA = r.top - 10; if (sB < e && sA > sB) { u = true; } } g.classList.remove('open-upward'); if(i) { if (u) { g.classList.add('open-upward'); } g.classList.add('open'); } else { g.classList.remove('open'); } if (d) d.setAttribute('aria-expanded', i); }
    function closeAllSettingsDropdowns() { if(languageGroup) languageGroup.classList.remove('open', 'open-upward'); if(themeGroup) themeGroup.classList.remove('open', 'open-upward'); if(currentLanguageDisplay) currentLanguageDisplay.setAttribute('aria-expanded', 'false'); if(currentThemeDisplay) currentThemeDisplay.setAttribute('aria-expanded', 'false'); }
    function updateLanguageDisplay() { const s = languageOptions?.querySelector(`.option-item[data-lang="${currentLanguage}"]`); if (s && currentLanguageText) { currentLanguageText.textContent = s.querySelector('span').textContent; languageOptions?.querySelectorAll('.option-item').forEach(i => { const a = i.dataset.lang === currentLanguage; i.classList.toggle('active', a); i.setAttribute('aria-selected', a); }); } }
    function updateThemeDisplay() { const s = themeOptions?.querySelector(`.option-item[data-theme="${currentTheme}"]`); if (s && currentThemeText && currentThemeSwatch) { const tK = s.querySelector('span:not(.theme-swatch)')?.dataset.langKey; if (tK) { currentThemeText.textContent = getText(tK); } else { currentThemeText.textContent = s.querySelector('span:not(.theme-swatch)')?.textContent || currentTheme; } const w = s.querySelector('.theme-swatch'); if (w) { currentThemeSwatch.style.background = w.style.background; currentThemeSwatch.className = 'theme-swatch'; const c = Array.from(w.classList).find(cls => cls !== 'theme-swatch'); if (c) { currentThemeSwatch.classList.add(c); } } themeOptions?.querySelectorAll('.option-item').forEach(i => { const a = i.dataset.theme === currentTheme; i.classList.toggle('active', a); i.setAttribute('aria-selected', a); }); } }
    // Update Discovery Mode Toggle Visuals
    function updateDiscoveryToggleVisualState() {
        if (discoveryModeToggle) {
            discoveryModeToggle.setAttribute('aria-checked', isDiscoveryModeActivated);
        }
    }
    function updateSettingsDisplays() { updateLanguageDisplay(); updateThemeDisplay(); updateDiscoveryToggleVisualState(); }

    // Function to update visibility of Discover button on Screen 3
    function updateDiscoverButtonVisibility() {
        if (discoverButton) {
            discoverButton.style.display = isDiscoveryModeActivated ? 'inline-flex' : 'none'; // Use inline-flex
        }
    }
    // --- End Settings Panel Logic ---

    // --- Language and UI Update Functions ---
    function updateLanguageUI() {
         htmlElement.lang = currentLanguage;
         document.querySelectorAll('[data-lang-key]').forEach(el => {
             const key = el.dataset.langKey;
             let translation = getText(key);
             // Special handling for price label to include currency
             if (key === 'product_price_label' && productPriceLabel) { // Check if element exists
                 translation = translation.replace('{currency}', getCurrency());
             }

             if (['welcome_title', 'admin_login_title'].includes(key)) { el.innerHTML = translation; }
             else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                 if (el.dataset.langValueTarget) { el.setAttribute(el.dataset.langValueTarget, translation); }
             }
             else if (el.tagName === 'OPTION') {
                el.textContent = translation; // Update select option text
             }
             else { el.textContent = translation; }
         });
         document.querySelectorAll('[data-lang-placeholder-key]').forEach(el => {
             const key = el.dataset.langPlaceholderKey;
             if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                 el.placeholder = getText(key);
             }
         });
         updateSettingsDisplays(); // Includes updates for settings and discover button
         populateMenuGrid();
         updateCartUI(); // Always redraw on language change for item names etc.
         if (currentScreen && currentScreen.id === 'screen-5') {
             // Existing order management updates...
             const logTitle = currentScreen.querySelector('.order-log-section h4');
             const previewTitle = currentScreen.querySelector('.order-preview-section h4');
             if(logTitle) logTitle.textContent = getText('order_log_title');
             if(previewTitle) previewTitle.textContent = getText('order_preview_title');
             renderOrderLog();
             if (currentAdminOrderSelection) showOrderDetails(currentAdminOrderSelection); else clearOrderPreview();
             // Update product management section titles etc.
             populateProductManagementList(); // Repopulate product list on lang change
             const pmTitle = currentScreen.querySelector('.product-management-section h4');
             const apTitle = currentScreen.querySelector('.add-product-form h5');
             if (pmTitle) pmTitle.textContent = getText('manage_products_title');
             if (apTitle) apTitle.textContent = getText('add_new_product_title');
         }
         if (currentScreen && currentScreen.id === 'screen-7') { const currentItemId = addToCartPreviewButton?.dataset.itemId; if (currentItemId) { showItemPreview(currentItemId, false); const isAdded = addToCartPreviewButton.classList.contains('added'); setPreviewButtonState(isAdded); } }
         if (currentScreen && currentScreen.id === 'screen-8') { populateDiscoveryMode(); }
         updateModalLanguage();
         if (addToCartPreviewButton && addToCartPreviewButton.dataset.itemId) { const isAdded = addToCartPreviewButton.classList.contains('added'); setPreviewButtonState(isAdded); }
        if (currentScreen && currentScreen.id === 'screen-8') {
            if(discoveryBundlesScroller) { discoveryBundlesScroller.querySelectorAll('.add-bundle-button.added span').forEach(span => { if(span) span.textContent = getText('bundle_added_button'); }); }
            if(discoverySuggestionsGrid) { discoverySuggestionsGrid.querySelectorAll('.add-suggestion-button.added span').forEach(span => { if(span) span.textContent = getText('suggestion_added_button'); }); }
         }
         updatePasscodeModalLanguage(); // Update passcode modal text
         updateDiscoverButtonVisibility(); // Update button visibility on lang change
     }


    // --- Screen Management ---
     function showScreen(id, skip = false) {
         const targetScreen = document.getElementById(id);
         if (targetScreen && targetScreen !== currentScreen) {
             toggleSettingsPanel(false);
             let fromScreenId = null;
             if (currentScreen) {
                 fromScreenId = currentScreen.id;
                 currentScreen.classList.remove('active');
                 if (fromScreenId === 'screen-7') { resetPreviewButtonState(); }
                 if (fromScreenId === 'screen-8') { Object.values(suggestionButtonTimeouts).forEach(clearTimeout); Object.values(bundleButtonTimeouts).forEach(clearTimeout); suggestionButtonTimeouts = {}; bundleButtonTimeouts = {}; }
             }
             requestAnimationFrame(() => {
                 targetScreen.classList.add('active');
                 currentScreen = targetScreen;

                 // Store previous screen ID ONLY when navigating TO screen 7 from menu or discovery
                 if (id === 'screen-7' && fromScreenId && ['screen-3', 'screen-8'].includes(fromScreenId)) {
                     previousScreenId = fromScreenId;
                     console.log("Navigating to Screen 7 from:", previousScreenId);
                 } else if (id !== 'screen-7' && fromScreenId !== 'screen-7') {
                    // Reset only if navigating between non-preview related screens
                     previousScreenId = null;
                     console.log("Resetting previousScreenId (not navigating to/from preview)");
                 }

                 if (id === 'screen-4') updateCartUI();
                 if (id === 'screen-5') {
                    renderOrderLog();
                    clearOrderPreview();
                    if(orderSearchInput) orderSearchInput.value = '';
                    populateProductManagementList(); // <<< ADDED: Populate products when screen 5 shown
                    if(addProductErrorMsg) addProductErrorMsg.style.display = 'none'; // Hide error on screen load
                    // Don't reset the add product form itself on screen load, only on successful add
                    // if(addProductForm) addProductForm.reset();
                 }
                 if (id === 'screen-6') { if(adminLoginErrorMsg) adminLoginErrorMsg.style.display = 'none'; }
                 if (id === 'screen-3' || id === 'screen-7' || id === 'screen-8') updateCartBadge();
                 if (id === 'screen-8') { populateDiscoveryMode(); }
                 if (id === 'screen-3') { updateDiscoverButtonVisibility(); }
                 if (targetScreen && !skip) targetScreen.scrollTop = 0;
             });
         } else if (!targetScreen) {
             console.error(`Screen ${id} not found`);
         } else if (targetScreen === currentScreen && !skip) {
             targetScreen.scrollTop = 0;
             toggleSettingsPanel(false);
         }
     }

    // --- User and Profile Functions ---
    function updateUserInfoUI() { if (currentUser) { const n = currentUser.email.split('@')[0]; if(userDisplayName) userDisplayName.textContent = `@${n}`; if(userProfileImage) { userProfileImage.src = currentUser.profilePic; userProfileImage.alt = `${n}'s PP`; userProfileImage.style.display = 'block'; } if(guestUserIcon) guestUserIcon.style.display = 'none'; } else { if(userDisplayName) userDisplayName.textContent = '@guest'; if(userProfileImage) { userProfileImage.src = ''; userProfileImage.alt = 'User Profile'; userProfileImage.style.display = 'none'; } if(guestUserIcon) guestUserIcon.style.display = 'block'; } }

    // --- Menu and Filtering Functions ---
    function populateMenuGrid() { if(!menuGrid || !menuSortButtonsContainer) return; menuGrid.innerHTML = ''; const a = menuSortButtonsContainer.querySelector('.sort-button.active'); let c = 'sweet'; if (a) c = a.dataset.category; else { const s = menuSortButtonsContainer.querySelector('[data-category="sweet"]'); if(s) s.classList.add('active'); } baseMenuData.forEach((item, i) => { const m = document.createElement('div'); m.className = 'menu-item'; m.dataset.id = item.id; m.dataset.category = item.category; const n = getText(item.name_key), p = formatPrice(item.price); m.innerHTML = `<img src="${item.image}" alt="${n}"><p>${n}</p><span class="price-button">${p}</span>`; if (item.category !== c) { m.classList.add('hidden'); m.style.animation = 'none'; } else m.style.animation = `fadeInItem 0.4s ${i * 0.04}s ease-out backwards`; menuGrid.appendChild(m); }); }
    function applyFilter(s, a = true) { if (!s || s.id !== 'screen-3') return; const m = s.querySelectorAll('.menu-grid .menu-item'), b = s.querySelector('.sort-buttons .sort-button.active'), c = b ? b.dataset.category : null; m.forEach((i, x) => { const v = !c || i.dataset.category === c; i.classList.toggle('hidden', !v); i.style.animation = (v && a) ? `fadeInItem 0.4s ${x * 0.04}s ease-out backwards` : 'none'; }); }

    // --- Cart Functions ---
    function updateCartBadge() { const totalQuantity = cart.reduce((sum, item) => sum + (item.isDiscount ? 0 : item.quantity), 0); [cartBadge, cartBadgePreview, cartBadgeDiscovery].forEach(badgeElement => { if (badgeElement) { badgeElement.textContent = totalQuantity; badgeElement.classList.toggle('visible', totalQuantity > 0); } }); }
    function updateCartUI() {
        if (!cartItemsContainer || !totalCalculationDetails || !checkoutButton) return;
        cartItemsContainer.innerHTML = '';
        totalCalculationDetails.innerHTML = '';
        let totalPriceBeforeDiscounts = 0;
        let totalDiscount = 0;
        const currencySymbol = getCurrency();
        const quantityPrefix = getText('quantity_prefix');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-cart-message">${getText('cart_empty_message')}</p>`;
        } else {
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                if (item.isDiscount) {
                    totalDiscount += Math.abs(itemSubtotal);
                    const discountName = getText(item.name_key) || "Discount";
                    totalCalculationDetails.innerHTML += `<p style="color: var(--active-green); font-weight: bold;">${discountName}: -${formatPrice(Math.abs(item.price))}</p>`;
                    const cartItemEl = document.createElement('div');
                    cartItemEl.className = 'cart-item discount-item';
                    cartItemEl.dataset.id = item.id; // Use the unique discount ID here
                    cartItemEl.innerHTML = `
                        <img src="${item.image || 'https://img.icons8.com/ios-filled/50/discount--v1.png'}" alt="Discount" style="opacity:0.5; filter: grayscale(80%); width: 40px; height: 40px; object-fit: contain;">
                        <div class="item-details">
                            <div class="item-info"><p>${discountName}</p></div>
                            <span class="item-price-button" style="color: var(--active-green); font-weight: bold; background: transparent; border: none; padding: 6px 0;">-${formatPrice(Math.abs(item.price))}</span>
                        </div>
                        <button class="remove-item-button" title="Remove discount">&times;</button>`;
                    cartItemsContainer.appendChild(cartItemEl);
                } else {
                    totalPriceBeforeDiscounts += itemSubtotal;
                    const itemName = getText(item.name_key);
                    totalCalculationDetails.innerHTML += `<p>${quantityPrefix}${item.quantity} ${itemName} = ${formatPrice(itemSubtotal)}</p>`;
                    const cartItemEl = document.createElement('div');
                    cartItemEl.className = 'cart-item';
                    cartItemEl.dataset.id = item.id; // Use the product ID
                    cartItemEl.innerHTML = `
                        <img src="${item.image}" alt="${itemName}">
                        <div class="item-details">
                            <div class="item-info"><p title="${itemName}">${itemName}</p><span class="item-quantity">${quantityPrefix}${item.quantity}</span></div>
                            <span class="item-price-button">${formatPrice(itemSubtotal)}</span>
                        </div>
                        <button class="remove-item-button" title="Remove item">&times;</button>`;
                    cartItemsContainer.appendChild(cartItemEl);
                }
            });
        }

        const finalTotal = totalPriceBeforeDiscounts - totalDiscount;
        checkoutButton.textContent = formatPrice(finalTotal);
        checkoutButton.disabled = cart.filter(item => !item.isDiscount).length === 0;
        updateCartBadge();
    }

    function addToCart(id) {
        const productIndex = baseMenuData.findIndex(i => i.id === id);
        if (productIndex === -1) {
            console.warn(`Product with ID ${id} not found in baseMenuData.`);
            return;
        }
        const productData = baseMenuData[productIndex];

        // --- Quantity Check ---
        const cartItem = cart.find(i => i.id === id && !i.isDiscount);
        const currentCartQuantity = cartItem ? cartItem.quantity : 0;

        if (productData.quantity <= currentCartQuantity) {
            showCustomAlert(`Sorry, '${getText(productData.name_key)}' is out of stock!`, 'checkout_success_title'); // Reuse title or add new key
            console.log(`Item ${id} out of stock. Available: ${productData.quantity}, In cart: ${currentCartQuantity}`);
            // Optionally disable the button visually or provide other feedback
            return; // Stop adding
        }
        // --- End Quantity Check ---


        const existingCartItemIndex = cart.findIndex(i => i.id === id && !i.isDiscount);
        if (existingCartItemIndex > -1) {
            cart[existingCartItemIndex].quantity++;
        } else {
            // Create a *copy* of the relevant product data for the cart
            const cartProductData = {
                id: productData.id,
                price: productData.price,
                image: productData.image,
                category: productData.category,
                name_key: productData.name_key,
                description_key: productData.description_key,
                quantity: 1 // This is cart quantity, not stock quantity
            };
             cart.push(cartProductData);
        }
        updateCartUI();
    }

    function removeFromCart(id) {
        const itemIndex = cart.findIndex(i => i.id === id);
        if (itemIndex === -1) return;
        // If it's a discount or quantity is 1, remove completely
        if (cart[itemIndex].isDiscount || cart[itemIndex].quantity <= 1) {
            cart.splice(itemIndex, 1);
        } else {
            // Otherwise, just decrease quantity
            cart[itemIndex].quantity--;
        }
        updateCartUI();
    }

    // --- Item Preview Functions ---
    function showItemPreview(id, n = true) { const d = baseMenuData.find(i => i.id === id); if (!d || !previewItemImage || !previewItemName || !previewItemDescription || !previewItemPrice || !addToCartPreviewButton) return; const nm = getText(d.name_key), ds = getText(d.description_key || 'item_desc_default'), p = formatPrice(d.price); previewItemImage.src = d.image; previewItemImage.alt = nm; previewItemName.textContent = nm; previewItemDescription.textContent = ds; previewItemPrice.textContent = p; addToCartPreviewButton.dataset.itemId = id; setPreviewButtonState(false); if (n) showScreen('screen-7'); else updateCartBadge(); }
    function setPreviewButtonState(a) { if (!addToCartPreviewButton) return; addToCartPreviewButton.classList.toggle('added', a); const k = a ? 'added_to_cart_button' : 'add_to_cart_button'; const c = a ? 'fas fa-check' : 'fas fa-cart-plus'; let s = addToCartPreviewButton.querySelector('span'); if (!s) { s = document.createElement('span'); addToCartPreviewButton.appendChild(s); } s.dataset.langKey = k; s.textContent = getText(k); let i = addToCartPreviewButton.querySelector('i'); if (!i) { i = document.createElement('i'); addToCartPreviewButton.prepend(i); } i.className = c; i.style.marginRight = ''; i.style.marginLeft = ''; }
    function resetPreviewButtonState() { if(addToCartPreviewButton) { if (previewButtonTimeout) { clearTimeout(previewButtonTimeout); previewButtonTimeout = null; } setPreviewButtonState(false); addToCartPreviewButton.dataset.itemId = ''; } }

    // --- Order Placement and Management Functions ---
     function generateOrderId() { return `ORD-${Date.now()}-${Math.floor(Math.random()*10)}`; }
     function placeOrder() {
         const actualItems = cart.filter(item => !item.isDiscount);
         if (actualItems.length === 0) {
             showCustomAlert(getText('cart_is_empty_alert'));
             return;
         }

        // --- Deduct Stock ---
        let stockSufficient = true;
        const stockUpdates = []; // To apply only if all items are in stock

        actualItems.forEach(cartItem => {
            const productIndex = baseMenuData.findIndex(p => p.id === cartItem.id);
            if (productIndex > -1) {
                if (baseMenuData[productIndex].quantity < cartItem.quantity) {
                    stockSufficient = false;
                    showCustomAlert(`Sorry, only ${baseMenuData[productIndex].quantity} of '${getText(baseMenuData[productIndex].name_key)}' available!`, 'checkout_success_title');
                } else {
                    stockUpdates.push({ index: productIndex, quantityToDeduct: cartItem.quantity });
                }
            } else {
                // Should ideally not happen if cart validation is correct
                console.error(`Product ${cartItem.id} in cart not found in baseMenuData during checkout.`);
                stockSufficient = false;
            }
        });

        if (!stockSufficient) {
            return; // Stop order placement
        }

        // Apply stock deductions *after* checking all items
        stockUpdates.forEach(update => {
            baseMenuData[update.index].quantity -= update.quantityToDeduct;
            console.log(`Stock for ${baseMenuData[update.index].id} reduced by ${update.quantityToDeduct}. New stock: ${baseMenuData[update.index].quantity}`);
        });
        // --- End Stock Deduction ---


         const finalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
         const o = {
             id: generateOrderId(),
             items: cart.map(i => ({ // Deep copy items for the order record
                id: i.id,
                name_key: i.name_key,
                price: i.price,
                quantity: i.quantity,
                isDiscount: i.isDiscount || false
             })),
             totalAmount: finalTotal,
             timestamp: new Date(),
             status: 'pending',
             paymentMethod: selectedPaymentMethod
         };
         allOrders.push(o);
         console.log("Order Placed:", o);

         // Clear cart and reset UI
         cart = [];
         selectedPaymentMethod = 'cash';
         updateCartUI();
         if (paymentMethodsContainer) paymentMethodsContainer.querySelectorAll('.payment-button').forEach(b => b.classList.toggle('active', b.dataset.method === 'cash'));

         // Show confirmation
         const m = getText('checkout_success_alert')
                     .replace('{method}', getText(`payment_${o.paymentMethod}`))
                     .replace('{id}', o.id)
                     .replace('{total}', formatPrice(o.totalAmount));
         showCustomAlert(m);

         // Refresh product management list if on screen 5
         if (currentScreen && currentScreen.id === 'screen-5') {
             populateProductManagementList();
         }
     }
     function renderOrderLog(f = allOrders) { if(!orderLogContainer) return; orderLogContainer.innerHTML = ''; const s = [...f].sort((a, b) => b.timestamp - a.timestamp), c = getCurrency(); if (s.length === 0) { orderLogContainer.innerHTML = `<p class="no-orders-message">${getText('no_orders_found')}</p>`; return; } s.forEach(o => { const l = document.createElement('div'); l.className = 'order-log-item'; l.dataset.orderId = o.id; const t = getText(`order_status_${o.status}`); l.innerHTML = `<span class="order-id" title="${o.id}">${o.id}</span><span class="order-status ${o.status}">${t}</span><span class="order-total">${o.totalAmount} ${c}</span>`; l.classList.toggle('active', o.id === currentAdminOrderSelection); l.addEventListener('click', () => { currentAdminOrderSelection = o.id; showOrderDetails(o.id); renderOrderLog(f); }); orderLogContainer.appendChild(l); }); }
     function clearOrderPreview() { if(!orderPreviewContent || !orderStatusControls) return; orderPreviewContent.innerHTML = `<p class="order-preview-placeholder">${getText('order_preview_placeholder')}</p>`; orderStatusControls.innerHTML = ''; currentAdminOrderSelection = null; orderLogContainer?.querySelectorAll('.order-log-item.active').forEach(i => i.classList.remove('active')); }
     function showOrderDetails(id) {
        const o = allOrders.find(ord => ord.id === id);
        if (!o || !orderPreviewContent) { clearOrderPreview(); return; }
        const c = getCurrency(),
              l = currentLanguage === 'ar' ? 'ar-EG' : 'en-GB',
              ft = o.timestamp.toLocaleString(l, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }), // Use 24hr format maybe
              tst = getText(`order_status_${o.status}`),
              tp = getText(`payment_${o.paymentMethod}`);

        let ih = '<ul>';
        let originalSubTotal = 0;
        let hasDiscount = false;
        o.items.forEach(i => {
            const n = getText(i.name_key); // Use name_key from order item
            if (i.isDiscount) {
                ih += `<li style="color: var(--active-green);"><em>${n}: -${formatPrice(Math.abs(i.price))}</em></li>`;
                hasDiscount = true;
            } else {
                ih += `<li>${getText('quantity_prefix')}${i.quantity} ${n} (${formatPrice(i.price * i.quantity)})</li>`;
                originalSubTotal += i.price * i.quantity;
            }
        });
        ih += '</ul>';

        let subtotalHtml = '';
         if (hasDiscount && originalSubTotal > 0) { // Display subtotal only if there was a discount
             // Use translation key here
             subtotalHtml = `<p><strong>${getText('subtotal_label')}:</strong> <span style="text-decoration: line-through;">${formatPrice(originalSubTotal)}</span></p>`;
         }

        orderPreviewContent.innerHTML = `
            <p><strong>${getText('order_id_label')}:</strong> <span>${o.id}</span></p>
            <p><strong>${getText('order_placed_label')}:</strong> <span>${ft}</span></p>
            <p><strong>${getText('order_status_label')}:</strong><span style="text-transform:capitalize;font-weight:bold;"> ${tst}</span></p>
            <p><strong>${getText('order_payment_label')}:</strong><span style="text-transform:capitalize;"> ${tp}</span></p>
            ${subtotalHtml}
            <p><strong>${getText('order_total_label')}:</strong> <span>${formatPrice(o.totalAmount)}</span></p>
            <p><strong>${getText('order_items_label')}:</strong></p>${ih}`;
        renderStatusButtons(o);
    }
     function renderStatusButtons(o) { if(!orderStatusControls) return; orderStatusControls.innerHTML = ''; const p = ['pending', 'preparing', 'delivered']; p.forEach(s => { const b = document.createElement('button'); b.className = 'button small-button status-button'; b.dataset.status = s; const t = getText(`order_status_${s}`); b.textContent = t.charAt(0).toUpperCase() + t.slice(1); b.disabled = (o.status === s); b.classList.toggle('active', o.status === s); let ic = ''; if (s === 'pending') ic = 'fas fa-hourglass-start'; else if (s === 'preparing') ic = 'fas fa-cogs'; else if (s === 'delivered') ic = 'fas fa-check-circle'; if(ic) { const i = document.createElement('i'); i.className = ic; b.prepend(i, ' '); } b.addEventListener('click', () => updateOrderStatus(o.id, s)); orderStatusControls.appendChild(b); }); }
     function updateOrderStatus(id, n) { const i = allOrders.findIndex(o => o.id === id); if (i === -1) return; allOrders[i].status = n; console.log(`Order ${id} status -> ${n}`); handleOrderSearch(); }
     function handleOrderSearch() { if(!orderSearchInput) return; const s = orderSearchInput.value.trim().toLowerCase(), o = s ? allOrders.filter(ord => ord.id.toLowerCase().includes(s)) : allOrders; renderOrderLog(o); if (currentAdminOrderSelection && o.some(ord => ord.id === currentAdminOrderSelection)) showOrderDetails(currentAdminOrderSelection); else clearOrderPreview(); }

    // --- START: Product Management Functions ---
     function populateProductManagementList() {
        if (!productListContainer) return;
        productListContainer.innerHTML = ''; // Clear existing list

        baseMenuData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'product-list-item';
            itemDiv.dataset.productId = item.id;

            const name = getText(item.name_key);
            const price = formatPrice(item.price);

            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${name}" onerror="this.src='https://via.placeholder.com/40x40/eee?text=Img'; this.onerror=null;">
                <div class="product-list-info">
                    <span class="product-list-name" title="${name}">${name}</span>
                    <span class="product-list-price">${price}</span>
                </div>
                <div class="product-quantity-control">

                    <input type="number" value="${item.quantity}" min="0" step="1" data-id="${item.id}" aria-label="${getText('product_quantity_label')} for ${name}">
                    <button class="button small-button save-quantity-button" data-id="${item.id}">
                        ${getText('save_button')}
                    </button>
                </div>
            `;
            productListContainer.appendChild(itemDiv);
        });
    }

    function handleSaveQuantity(productId) {
        const itemDiv = productListContainer.querySelector(`.product-list-item[data-product-id="${productId}"]`);
        if (!itemDiv) return;

        const inputElement = itemDiv.querySelector(`input[type="number"][data-id="${productId}"]`);
        const saveButton = itemDiv.querySelector(`button.save-quantity-button[data-id="${productId}"]`);
        if (!inputElement || !saveButton) return;

        const newQuantity = parseInt(inputElement.value, 10);

        if (isNaN(newQuantity) || newQuantity < 0) {
            showCustomAlert("Invalid quantity entered. Please enter a number 0 or greater.", 'checkout_success_title'); // Reuse title or make specific
            // Optionally revert input value
            const originalItem = baseMenuData.find(item => item.id === productId);
            if (originalItem) inputElement.value = originalItem.quantity;
            return;
        }

        // Find the item in the main data array and update it
        const itemIndex = baseMenuData.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            baseMenuData[itemIndex].quantity = newQuantity;
            console.log(`Updated quantity for ${productId} to ${newQuantity}`);

            // Visual feedback on save button
            saveButton.innerHTML = `<i class="fas fa-check"></i>`; // Show checkmark
            saveButton.classList.add('saved');
            setTimeout(() => {
                saveButton.textContent = getText('save_button');
                saveButton.classList.remove('saved');
            }, 1500); // Revert after 1.5 seconds

        } else {
            console.error(`Could not find product with ID ${productId} in baseMenuData to update quantity.`);
        }
    }

    function handleAddNewProduct() {
        if (!newProductNameInput || !newProductDescInput || !newProductPriceInput ||
            !newProductQuantityInput || !newProductImageInput || !newProductCategorySelect ||
            !addProductErrorMsg || !addNewProductButton) return;

        addProductErrorMsg.style.display = 'none'; // Hide previous error

        const name = newProductNameInput.value.trim();
        const description = newProductDescInput.value.trim();
        const priceStr = newProductPriceInput.value;
        const quantityStr = newProductQuantityInput.value;
        const imageUrl = newProductImageInput.value.trim();
        const category = newProductCategorySelect.value;

        // --- Validation ---
        if (!name || !description || !priceStr || !quantityStr || !imageUrl || !category) {
            addProductErrorMsg.textContent = getText('add_product_error_generic');
            addProductErrorMsg.style.display = 'block';
            return;
        }
        const price = parseFloat(priceStr);
        if (isNaN(price) || price < 0) {
            addProductErrorMsg.textContent = getText('add_product_error_price');
            addProductErrorMsg.style.display = 'block';
            return;
        }
        const quantity = parseInt(quantityStr, 10);
         if (isNaN(quantity) || quantity < 0) {
            addProductErrorMsg.textContent = getText('add_product_error_quantity');
            addProductErrorMsg.style.display = 'block';
            return;
        }
         // Basic URL check (can be improved)
         if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            addProductErrorMsg.textContent = getText('add_product_error_image');
            addProductErrorMsg.style.display = 'block';
            return;
         }
         // --- End Validation ---

         // Generate ID and translation keys
         const newId = `prod-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
         const nameKey = `item_name_${newId}`;
         const descKey = `item_desc_${newId}`;

         // Add to translations (important for dynamic display)
         // For simplicity, setting both en and ar to the entered text.
         // A real app might require separate translation input or workflow.
         translations[nameKey] = { en: name, ar: name };
         translations[descKey] = { en: description, ar: description };

         // Create new product object
         const newProduct = {
             id: newId,
             price: price,
             image: imageUrl,
             category: category,
             quantity: quantity,
             name_key: nameKey,
             description_key: descKey
         };

         // Add to main data array
         baseMenuData.push(newProduct);

         // Refresh the product management list
         populateProductManagementList();

         // Refresh the main menu grid (in case user navigates back)
         populateMenuGrid();

         // Clear the form
         newProductNameInput.value = '';
         newProductDescInput.value = '';
         newProductPriceInput.value = '';
         newProductQuantityInput.value = '';
         newProductImageInput.value = '';
         newProductCategorySelect.value = 'sweet'; // Reset to default category

         console.log("New product added:", newProduct);
         // Show success alert *after* a short delay to allow UI to potentially update
         setTimeout(() => {
             showCustomAlert(getText('add_product_success').replace('{name}', name));
         }, 100);
    }
     // --- END: Product Management Functions ---


    // --- Discovery Mode Functions ---
    function populateDiscoveryMode() {
        if (!discoveryBundlesScroller || !discoverySuggestionsGrid || !discoveryCategoriesContainer) return;
        discoveryBundlesScroller.innerHTML = '';
        discoverySuggestionsGrid.innerHTML = '';
        discoveryCategoriesContainer.innerHTML = '';
        const MAX_IMAGES_SHOWN = 4; // For bundles

        // Bundles
        bundleOffers.forEach(bundle => { const card = document.createElement('div'); card.className = 'offer-card bundle-offer'; card.dataset.bundleId = bundle.id; const bundleName = getText(bundle.name_key); const bundleDesc = getText(bundle.description_key); let itemsHtml = `<p class="offer-items"><strong>${getText('includes_items')}</strong> `; let imageGridHtml = ''; let originalTotalPrice = 0; let allItemsFound = true; let imageCount = 0; bundle.itemIds.forEach(itemId => { const itemData = baseMenuData.find(i => i.id === itemId); if (itemData) { itemsHtml += `<span>${getText(itemData.name_key)}</span>`; originalTotalPrice += itemData.price; if (imageCount < MAX_IMAGES_SHOWN) { imageGridHtml += `<img src="${itemData.image}" alt="${getText(itemData.name_key)}">`; imageCount++; } } else { allItemsFound = false; console.warn(`Item ${itemId} not found for bundle ${bundle.id}`); } }); itemsHtml += '</p>'; let gridClass = 'offer-image-grid'; if (imageCount === 1) gridClass += ' count-1'; else if (imageCount === 3) gridClass += ' count-3'; const imageGridContainer = `<div class="${gridClass}">${imageGridHtml}</div>`; if (allItemsFound && originalTotalPrice > 0) { const discountMultiplier = (100 - bundle.discountPercent) / 100; const finalPrice = Math.round(originalTotalPrice * discountMultiplier); const discountTag = `<span class="bundle-discount-tag">${getText('discount_tag').replace('{percent}', bundle.discountPercent)}</span>`; card.innerHTML = ` ${discountTag} <h5>${bundleName}</h5> ${imageCount > 0 ? imageGridContainer : ''} <p class="offer-description">${bundleDesc}</p> ${itemsHtml} <div class="offer-actions"> <div class="bundle-pricing"> <span class="bundle-original-price">${getText('original_price')} ${formatPrice(originalTotalPrice)}</span> <span class="bundle-final-price">${getText('bundle_price')} ${formatPrice(finalPrice)}</span> </div> <button class="button rect-button add-bundle-button"> <i class="fas fa-cart-plus"></i> <span data-lang-key="add_bundle_button">${getText('add_bundle_button')}</span> </button> </div>`; discoveryBundlesScroller.appendChild(card); } });

        // Meal Ideas (Suggestions)
        mealSuggestions.forEach(suggestion => {
            const gridItem = document.createElement('div');
            gridItem.className = 'suggestion-grid-item';
            gridItem.dataset.suggestionId = suggestion.id;
            const suggName = getText(suggestion.name_key);
            let itemsHtml = `<div class="suggestion-items">`; // Text list of items
            let itemImagesHtml = ''; // Image row HTML
            let allItemsFound = true;
            let suggestionTotalPrice = 0;

            suggestion.itemIds.forEach((itemId, index) => {
                const itemData = baseMenuData.find(i => i.id === itemId);
                if (itemData) {
                    itemsHtml += `<span>${getText(itemData.name_key)}</span>`;
                    suggestionTotalPrice += itemData.price;
                    // Add image to the image row
                    itemImagesHtml += `<img src="${itemData.image}" alt="${getText(itemData.name_key)}" title="${getText(itemData.name_key)}">`;
                    // Add plus separator if not the last item
                    if (index < suggestion.itemIds.length - 1) {
                        itemImagesHtml += ` <span class="plus-separator">+</span> `;
                    }
                } else {
                    allItemsFound = false;
                    console.warn(`Item ${itemId} not found for suggestion ${suggestion.id}`);
                }
            });
            itemsHtml += '</div>'; // Close text list

            const itemImagesContainer = `<div class="suggestion-item-images">${itemImagesHtml}</div>`;
            const totalPriceHtml = `<p class="suggestion-total-price"><strong>${getText('suggestion_total_price')}</strong> ${formatPrice(suggestionTotalPrice)}</p>`;

            if (allItemsFound) {
                const buttonHtml = ` <button class="button rect-button add-suggestion-button"> <i class="fas fa-cart-plus"></i> <span data-lang-key="add_suggestion_button">${getText('add_suggestion_button')}</span> </button>`;
                // Assemble the grid item HTML - Replace icon with image container
                gridItem.innerHTML = `
                    ${itemImagesContainer}
                    <h5>${suggName}</h5>
                    ${itemsHtml}
                    ${totalPriceHtml}
                    ${buttonHtml}
                `;
                discoverySuggestionsGrid.appendChild(gridItem);
            }
        });

        // Categories
        const categories = [...new Set(baseMenuData.map(item => item.category))]; categories.forEach(category => { const categorySection = document.createElement('div'); categorySection.className = 'discovery-category-section'; const categoryTitle = document.createElement('h5'); const categoryTitleKey = `sort_${category.toLowerCase()}`; categoryTitle.textContent = getText(categoryTitleKey) || category.charAt(0).toUpperCase() + category.slice(1); categorySection.appendChild(categoryTitle); const categoryGrid = document.createElement('div'); categoryGrid.className = 'discovery-category-grid'; const categoryItems = baseMenuData.filter(item => item.category === category); categoryItems.forEach(item => { const itemEl = document.createElement('div'); itemEl.className = 'discovery-category-item'; itemEl.dataset.id = item.id; const itemName = getText(item.name_key); const itemPrice = formatPrice(item.price); itemEl.innerHTML = ` <img src="${item.image}" alt="${itemName}"> <p title="${itemName}">${itemName}</p> <span class="price-button">${itemPrice}</span> `; itemEl.addEventListener('click', (e) => { if (!e.target.classList.contains('price-button')) { showItemPreview(item.id); } }); const priceButton = itemEl.querySelector('.price-button'); if (priceButton) { priceButton.addEventListener('click', (e) => { e.stopPropagation(); addToCart(item.id); priceButton.style.transition = 'transform 0.1s ease-out, background-color 0.1s ease-out'; priceButton.style.backgroundColor = 'var(--active-green)'; priceButton.style.transform = 'scale(1.1)'; setTimeout(() => { priceButton.style.backgroundColor = ''; priceButton.style.transform = ''; setTimeout(() => priceButton.style.transition = '', 150); }, 150); }); } categoryGrid.appendChild(itemEl); }); categorySection.appendChild(categoryGrid); discoveryCategoriesContainer.appendChild(categorySection); }); updateCartBadge();
    }
    function addSuggestionToCart(suggestionId, buttonElement) {
        const suggestion = mealSuggestions.find(s => s.id === suggestionId);
        if (!suggestion || !buttonElement) return;

        // --- Check Stock Before Adding ---
        let allStockSufficient = true;
        const itemsToAdd = []; // Store { id, data } for items with sufficient stock

        for (const itemId of suggestion.itemIds) {
            const itemData = baseMenuData.find(i => i.id === itemId);
            if (!itemData) {
                console.warn(`Item ${itemId} in suggestion ${suggestionId} not found.`);
                allStockSufficient = false; // Mark as insufficient if any item is missing (though shouldn't happen)
                break;
            }

            const cartItem = cart.find(i => i.id === itemId && !i.isDiscount);
            const currentCartQuantity = cartItem ? cartItem.quantity : 0;

            if (itemData.quantity <= currentCartQuantity) {
                allStockSufficient = false;
                showCustomAlert(`Sorry, '${getText(itemData.name_key)}' is out of stock!`, 'checkout_success_title');
                break; // Stop checking if one item is out of stock
            }
            itemsToAdd.push({ id: itemId, data: itemData }); // Store valid item to add
        }

        if (!allStockSufficient) {
            return; // Don't add anything if stock is insufficient for any item
        }
        // --- End Stock Check ---

        // Add items now that stock is confirmed
        itemsToAdd.forEach(itemInfo => {
            const itemExists = cart.find(i => i.id === itemInfo.id && !i.isDiscount);
            if (itemExists) {
                itemExists.quantity++;
            } else {
                const cartProductData = { // Create copy for cart
                    id: itemInfo.data.id,
                    price: itemInfo.data.price,
                    image: itemInfo.data.image,
                    category: itemInfo.data.category,
                    name_key: itemInfo.data.name_key,
                    description_key: itemInfo.data.description_key,
                    quantity: 1
                };
                cart.push(cartProductData);
            }
        });

        updateCartUI();

        // Button feedback
        if (suggestionButtonTimeouts[suggestionId]) { clearTimeout(suggestionButtonTimeouts[suggestionId]); }
        buttonElement.classList.add('added');
        const icon = buttonElement.querySelector('i');
        const span = buttonElement.querySelector('span');
        if (icon) icon.className = 'fas fa-check';
        if (span) { span.dataset.langKey = 'suggestion_added_button'; span.textContent = getText('suggestion_added_button'); }

        suggestionButtonTimeouts[suggestionId] = setTimeout(() => {
            if (buttonElement && buttonElement.classList.contains('added')) {
                buttonElement.classList.remove('added');
                if (icon) icon.className = 'fas fa-cart-plus';
                if (span) { span.dataset.langKey = 'add_suggestion_button'; span.textContent = getText('add_suggestion_button'); }
            }
            delete suggestionButtonTimeouts[suggestionId];
        }, 1500);
    }

    function addBundleToCart(bundleId, buttonElement) {
        const bundle = bundleOffers.find(b => b.id === bundleId);
        if (!bundle || !buttonElement) return;

        // --- Check Stock Before Adding ---
        let allStockSufficient = true;
        const itemsToAdd = []; // Store { id, data } for items with sufficient stock

        for (const itemId of bundle.itemIds) {
            const itemData = baseMenuData.find(i => i.id === itemId);
            if (!itemData) {
                console.warn(`Item ${itemId} in bundle ${bundleId} not found.`);
                allStockSufficient = false;
                break;
            }

            const cartItem = cart.find(i => i.id === itemId && !i.isDiscount);
            const currentCartQuantity = cartItem ? cartItem.quantity : 0;

            if (itemData.quantity <= currentCartQuantity) {
                allStockSufficient = false;
                showCustomAlert(`Sorry, '${getText(itemData.name_key)}' is out of stock!`, 'checkout_success_title');
                break;
            }
            itemsToAdd.push({ id: itemId, data: itemData });
        }

        if (!allStockSufficient) {
            return;
        }
        // --- End Stock Check ---

        // Add items and calculate discount
        let originalTotalPrice = 0;
        itemsToAdd.forEach(itemInfo => {
            originalTotalPrice += itemInfo.data.price;
            const itemExists = cart.find(cartItem => cartItem.id === itemInfo.id && !cartItem.isDiscount);
            if (itemExists) {
                itemExists.quantity++;
            } else {
                 const cartProductData = { // Create copy for cart
                    id: itemInfo.data.id,
                    price: itemInfo.data.price,
                    image: itemInfo.data.image,
                    category: itemInfo.data.category,
                    name_key: itemInfo.data.name_key,
                    description_key: itemInfo.data.description_key,
                    quantity: 1
                };
                cart.push(cartProductData);
            }
        });

        // Add discount item if applicable
        const discountMultiplier = (100 - bundle.discountPercent) / 100;
        const finalPrice = Math.round(originalTotalPrice * discountMultiplier);
        const discountAmount = originalTotalPrice - finalPrice;
        if (discountAmount > 0) {
            const discountItemId = `discount-${bundleId}-${Date.now()}`;
            const discountItem = {
                id: discountItemId,
                name_key: 'bundle_discount_applied',
                price: -discountAmount,
                quantity: 1,
                isDiscount: true,
                image: 'https://img.icons8.com/ios-filled/50/discount--v1.png' // Placeholder image for discount
            };
            cart.push(discountItem);
            console.log(`Applied discount: ${discountAmount} for bundle ${bundleId}`);
        }

        updateCartUI();

        // Button feedback
        if (bundleButtonTimeouts[bundleId]) { clearTimeout(bundleButtonTimeouts[bundleId]); }
        buttonElement.classList.add('added');
        const icon = buttonElement.querySelector('i');
        const span = buttonElement.querySelector('span');
        if (icon) icon.className = 'fas fa-check';
        if (span) { span.dataset.langKey = 'bundle_added_button'; span.textContent = getText('bundle_added_button'); }

        bundleButtonTimeouts[bundleId] = setTimeout(() => {
            if (buttonElement && buttonElement.classList.contains('added')) {
                buttonElement.classList.remove('added');
                if (icon) icon.className = 'fas fa-cart-plus';
                if (span) { span.dataset.langKey = 'add_bundle_button'; span.textContent = getText('add_bundle_button'); }
            }
            delete bundleButtonTimeouts[bundleId];
        }, 1500);
    }
    // --- End Discovery Mode Functions ---

    // --- Custom Alert Functions ---
    function updateModalLanguage() { if (customAlertTitle) { const titleKey = customAlertTitle.dataset.langKey || 'checkout_success_title'; customAlertTitle.textContent = getText(titleKey); } if (customAlertCloseBtn) customAlertCloseBtn.textContent = getText('ok_button'); }
    function showCustomAlert(m, titleKey = 'checkout_success_title') { if (!customAlertOverlay || !customAlertMessage) return; if(customAlertTitle) customAlertTitle.dataset.langKey = titleKey; updateModalLanguage(); customAlertMessage.textContent = m; requestAnimationFrame(() => { customAlertOverlay.classList.add('visible'); }); }
    function hideCustomAlert() {
        if (!customAlertOverlay || !customAlertOverlay.classList.contains('visible')) return;
        const msg = customAlertMessage?.textContent; // Get message before hiding
        customAlertOverlay.classList.remove('visible');
        const isCartEmptyAlert = msg === getText('cart_is_empty_alert');
        const isOutOfStockAlert = msg?.includes('out of stock') || msg?.includes('available'); // Simple check
        // Navigate back only if it was a successful order confirmation
        if(currentScreen?.id !== 'screen-3' && !isCartEmptyAlert && !isOutOfStockAlert){
            showScreen('screen-3');
        }
    }
    // --- End Custom Alert Functions ---

    // --- Passcode Modal Functions ---
    function updatePasscodeModalLanguage() {
        if(passcodeModalTitle) passcodeModalTitle.textContent = getText('discovery_passcode_modal_title');
        if(passcodeModalInput) passcodeModalInput.placeholder = getText('discovery_passcode_prompt');
        if(passcodeModalError) passcodeModalError.textContent = getText('discovery_passcode_incorrect_message'); // Set text even if hidden
        if(passcodeModalOk) passcodeModalOk.textContent = getText('ok_button');
        if(passcodeModalCancel) passcodeModalCancel.textContent = getText('cancel_button'); // Changed key
    }
    function showPasscodeModal() {
        if (!passcodeModalOverlay) return;
        updatePasscodeModalLanguage();
        if(passcodeModalInput) passcodeModalInput.value = '';
        if(passcodeModalError) passcodeModalError.style.display = 'none';
        requestAnimationFrame(() => {
            passcodeModalOverlay.classList.add('visible');
            if(passcodeModalInput) passcodeModalInput.focus();
        });
    }
    function hidePasscodeModal() {
        if (!passcodeModalOverlay) return;
        passcodeModalOverlay.classList.remove('visible');
    }
    function handlePasscodeSubmit() {
        const enteredPasscode = passcodeModalInput?.value;
        if (enteredPasscode === DISCOVERY_PASSCODE) {
            isDiscoveryModeActivated = true;
            localStorage.setItem('discoveryModeActivated', isDiscoveryModeActivated);
            updateDiscoveryToggleVisualState();
            updateDiscoverButtonVisibility();
            hidePasscodeModal();
        } else {
            if (passcodeModalError) passcodeModalError.style.display = 'block';
            if (passcodeModalInput) passcodeModalInput.value = '';
            console.warn("Incorrect passcode entered");
        }
    }
    // --- End Passcode Modal Functions ---


    // --- Event Listeners ---
    // General Navigation (using data-target)
     navigationElements.forEach(e => {
         const targetId = e.dataset.target;
         // Exclude the preview back button from this generic handler
         if (targetId && e.id !== 'item-preview-back-button') {
             e.addEventListener('click', () => showScreen(targetId));
         }
     });

    loginSubmitButton?.addEventListener('click', () => { const e = loginEmailInput.value.trim(), p = loginPasswordInput.value; if(!loginErrorMsg) return; loginErrorMsg.style.display = 'none'; if (e && p) { currentUser = { email: e, profilePic: DEFAULT_PROFILE_PIC }; loginEmailInput.value = ''; loginPasswordInput.value = ''; updateUserInfoUI(); showScreen('screen-3'); } else { loginErrorMsg.textContent = getText('login_error_fields'); loginErrorMsg.style.display = 'block'; } });
    gotoAdminLoginButton?.addEventListener('click', () => showScreen('screen-6'));
    registerSubmitButton?.addEventListener('click', () => { const e = registerEmailInput.value.trim(), p = registerPasswordInput.value, c = registerPasswordConfirmInput.value, a = registerPhotoPicker?.querySelector('.profile-pic.active'); if(!registerErrorMsg) return; registerErrorMsg.style.display = 'none'; if (!e || !p || !c) { registerErrorMsg.textContent = getText('register_error_fields'); registerErrorMsg.style.display = 'block'; return; } if (p !== c) { registerErrorMsg.textContent = getText('register_error_match'); registerErrorMsg.style.display = 'block'; return; } if (!a) { registerErrorMsg.textContent = getText('register_error_photo'); registerErrorMsg.style.display = 'block'; return; } currentUser = { email: e, profilePic: a.src }; registerEmailInput.value = ''; registerPasswordInput.value = ''; registerPasswordConfirmInput.value = ''; updateUserInfoUI(); showScreen('screen-3'); });
    registerPhotoPicker?.addEventListener('click', e => { if (e.target.classList.contains('profile-pic')) { registerPhotoPicker.querySelectorAll('.profile-pic').forEach(p => p.classList.remove('active')); e.target.classList.add('active'); } });
    logoutButton?.addEventListener('click', () => { currentUser = null; cart = []; selectedPaymentMethod = 'cash'; updateCartUI(); updateUserInfoUI(); if(paymentMethodsContainer) paymentMethodsContainer.querySelectorAll('.payment-button').forEach(b => b.classList.toggle('active', b.dataset.method === 'cash')); if (menuSortButtonsContainer) { const d = baseMenuData[0]?.category || 'sweet'; menuSortButtonsContainer.querySelectorAll('.sort-button').forEach(b => b.classList.toggle('active', b.dataset.category === d)); populateMenuGrid(); } isDiscoveryModeActivated = false; localStorage.removeItem('discoveryModeActivated'); updateDiscoverButtonVisibility(); updateDiscoveryToggleVisualState(); /* Added toggle update */ showScreen('screen-1'); });
    menuGrid?.addEventListener('click', e => { const m = e.target.closest('.menu-item'), p = e.target.closest('.price-button'); if (m) { const id = m.dataset.id; if (p) { addToCart(id); p.style.transition = 'transform 0.1s ease-out, background-color 0.1s ease-out'; p.style.backgroundColor = 'var(--active-green)'; p.style.transform = 'scale(1.1)'; setTimeout(() => { p.style.backgroundColor = ''; p.style.transform = ''; setTimeout(() => p.style.transition = '', 150); }, 150); } else { showItemPreview(id); } } });
    menuSortButtonsContainer?.addEventListener('click', e => { if (e.target.classList.contains('sort-button')) { const b = e.target; if (b.classList.contains('active')) return; menuSortButtonsContainer.querySelectorAll('.sort-button').forEach(btn => btn.classList.remove('active')); b.classList.add('active'); applyFilter(document.getElementById('screen-3'), true); } });
    paymentMethodsContainer?.addEventListener('click', e => { const b = e.target.closest('.payment-button'); if (b && !b.classList.contains('active')) { selectedPaymentMethod = b.dataset.method; paymentMethodsContainer.querySelectorAll('.payment-button').forEach(btn => btn.classList.remove('active')); b.classList.add('active'); } });
    cartItemsContainer?.addEventListener('click', e => { if (e.target.classList.contains('remove-item-button')) { const c = e.target.closest('.cart-item'), id = c?.dataset.id; if (id) removeFromCart(id); } });
    checkoutButton?.addEventListener('click', () => { placeOrder(); });
    adminLoginSubmitButton?.addEventListener('click', () => { const e = adminEmailInput.value, p = adminPasswordInput.value; if(!adminLoginErrorMsg) return; adminLoginErrorMsg.style.display = 'none'; if (e === ADMIN_EMAIL && p === ADMIN_PASSWORD) { console.log("Admin login OK"); showScreen('screen-5'); } else { console.log("Admin login FAIL"); adminLoginErrorMsg.textContent = getText('admin_login_error'); adminLoginErrorMsg.style.display = 'block'; } });
    mgmtBackToLoginButton?.addEventListener('click', () => { clearOrderPreview(); if(orderSearchInput) orderSearchInput.value = ''; showScreen('screen-1'); });
    orderSearchButton?.addEventListener('click', handleOrderSearch);
    orderSearchInput?.addEventListener('keypress', e => { if (e.key === 'Enter') handleOrderSearch(); });
    orderSearchInput?.addEventListener('input', () => { if (orderSearchInput.value.trim() === '') handleOrderSearch(); });

    // Item Preview Back Button Listener
    itemPreviewBackButton?.addEventListener('click', () => {
         const targetScreenId = previousScreenId || 'screen-3'; // Default back to menu
         console.log("Going back to:", targetScreenId);
         showScreen(targetScreenId);
         // Reset previousScreenId AFTER navigating back
         previousScreenId = null;
     });

    addToCartPreviewButton?.addEventListener('click', e => { const b = e.target.closest('button'), id = b?.dataset.itemId; if (id) { addToCart(id); if (previewButtonTimeout) { clearTimeout(previewButtonTimeout); } setPreviewButtonState(true); previewButtonTimeout = setTimeout(() => { if (currentScreen && currentScreen.id === 'screen-7' && addToCartPreviewButton.dataset.itemId === id) { setPreviewButtonState(false); } previewButtonTimeout = null; }, 1500); } });
    toggleFullScreenButton?.addEventListener('click', () => { bodyElement.classList.toggle('full-screen-mode'); const f = bodyElement.classList.contains('full-screen-mode'); toggleFullScreenButton.innerHTML = f ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>'; toggleFullScreenButton.title = f ? 'Exit Full Screen' : 'Enter Full Screen'; });

    // Listener for Discover button (navigates if activated)
     discoverButton?.addEventListener('click', () => {
         if (isDiscoveryModeActivated) {
             showScreen('screen-8');
         } else {
             console.warn("Discover button clicked but Discovery Mode is not activated.");
         }
     });

     // Event delegation for Discovery Screen
    discoveryBundlesScroller?.addEventListener('click', (e) => { const bundleButton = e.target.closest('.add-bundle-button'); if (bundleButton) { const card = bundleButton.closest('.offer-card'); const bundleId = card?.dataset.bundleId; if (bundleId) { addBundleToCart(bundleId, bundleButton); } } });
    discoverySuggestionsGrid?.addEventListener('click', (e) => { const suggestionButton = e.target.closest('.add-suggestion-button'); if (suggestionButton) { const card = suggestionButton.closest('.suggestion-grid-item'); const suggestionId = card?.dataset.suggestionId; if (suggestionId) { addSuggestionToCart(suggestionId, suggestionButton); } } });
    discoveryCategoriesContainer?.addEventListener('click', e => { const categoryItem = e.target.closest('.discovery-category-item'); const priceButton = e.target.closest('.price-button'); if (categoryItem && !priceButton) { const itemId = categoryItem.dataset.id; if(itemId) { showItemPreview(itemId); } } });

    // --- Settings Panel Event Listeners ---
     if (settingsBtn) { settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSettingsPanel(); }); }
    if (currentLanguageDisplay) { currentLanguageDisplay.addEventListener('click', (e) => { e.stopPropagation(); toggleSettingsDropdown(languageGroup); }); currentLanguageDisplay.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSettingsDropdown(languageGroup); } }); }
    if (currentThemeDisplay) { currentThemeDisplay.addEventListener('click', (e) => { e.stopPropagation(); toggleSettingsDropdown(themeGroup); }); currentThemeDisplay.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSettingsDropdown(themeGroup); } }); }
    if (languageOptions) { languageOptions.addEventListener('click', (e) => { const o = e.target.closest('.option-item[data-lang]'); if (o && !o.classList.contains('active')) { const n = o.dataset.lang; appContainer.classList.add('language-switching'); setTimeout(() => { currentLanguage = n; localStorage.setItem('appLanguage', currentLanguage); updateLanguageUI(); closeAllSettingsDropdowns(); requestAnimationFrame(() => { appContainer.classList.remove('language-switching'); }); }, parseFloat(getComputedStyle(appContainer).getPropertyValue('--lang-change-speed') || '0.3') * 1000); } else if (o) { closeAllSettingsDropdowns(); } }); }
    if (themeOptions) { themeOptions.addEventListener('click', (e) => { const o = e.target.closest('.option-item[data-theme]'); if (o && !o.classList.contains('active')) { const n = o.dataset.theme; applyTheme(n); updateThemeDisplay(); closeAllSettingsDropdowns(); } else if (o) { closeAllSettingsDropdowns(); } }); }

     // MODIFIED: Add Passcode check for Discovery Mode Toggle
    if (discoveryModeToggle) {
        const toggleAction = () => {
            if (isDiscoveryModeActivated) {
                // Currently ON, turn OFF (no passcode needed)
                isDiscoveryModeActivated = false;
                localStorage.setItem('discoveryModeActivated', isDiscoveryModeActivated);
                updateDiscoveryToggleVisualState();
                updateDiscoverButtonVisibility();
            } else {
                // Currently OFF, show modal to turn ON
                showPasscodeModal();
            }
         };
         discoveryModeToggle.addEventListener('click', toggleAction);
         discoveryModeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                 e.preventDefault();
                 toggleAction();
            }
         });
     }

    // --- End Settings Panel Event Listeners ---

    // --- Custom Alert Event Listeners ---
    customAlertCloseBtn?.addEventListener('click', hideCustomAlert);
    customAlertOverlay?.addEventListener('click', (e) => { if (e.target === customAlertOverlay) { hideCustomAlert(); } });
    // --- Passcode Modal Event Listeners (Updated IDs & Logic) ---
    passcodeModalOk?.addEventListener('click', handlePasscodeSubmit);
    passcodeModalCancel?.addEventListener('click', hidePasscodeModal);
    passcodeModalOverlay?.addEventListener('click', (e) => { if (e.target === passcodeModalOverlay) { hidePasscodeModal(); } });
    passcodeModalInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') { handlePasscodeSubmit(); } });
    // --- End Passcode Modal Event Listeners ---

    // --- START: Product Management Listeners ---
    productListContainer?.addEventListener('click', e => {
        if (e.target.classList.contains('save-quantity-button')) {
            const productId = e.target.dataset.id;
            if (productId) {
                handleSaveQuantity(productId);
            }
        }
        // Prevent clicks on input/button triggering anything else if needed
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
            e.stopPropagation();
        }
    });

    // Prevent form submission if inside a form element (though it's divs here)
    productListContainer?.addEventListener('keypress', e => {
         if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'number') {
             e.preventDefault(); // Prevent potential form submission
             const productId = e.target.dataset.id;
             if(productId) {
                 handleSaveQuantity(productId); // Save on Enter key in quantity input
                 e.target.blur(); // Unfocus the input
             }
         }
     });


    addNewProductButton?.addEventListener('click', handleAddNewProduct);
     // --- END: Product Management Listeners ---


    // --- Initialization ---
    applyTheme(currentTheme);
    updateLanguageUI(); // Includes updates for settings and discover button
    showScreen('screen-1');
    updateCartUI();
    updateUserInfoUI();
    // Initial visibility checks
    updateDiscoverButtonVisibility();
    updateDiscoveryToggleVisualState(); // Set toggle based on saved state
});