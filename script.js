// Данные магазина
let storeData = JSON.parse(localStorage.getItem('smokin174_data')) || {
    name: 'SMOKIN174',
    products: [
        {
            id: Date.now(),
            name: "Пример товара 1",
            category: "Электроника",
            price: 9990,
            image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: Date.now() + 1,
            name: "Пример товара 2",
            category: "Одежда",
            price: 2990,
            image: "https://images.unsplash.com/photo-1553545204-5336bc12ca32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]
};

// Инициализация магазина
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем товары
    loadProducts();
    
    // Секретный вход (тройной клик)
    let clickCount = 0;
    let clickTimer;
    
    document.getElementById('secretAdmin').addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 3) {
            showSecretPanel();
            clickCount = 0;
        }
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1000);
    });
});

// Сохранение данных магазина
function saveStoreData() {
    localStorage.setItem('smokin174_data', JSON.stringify(storeData));
}

// Загрузка товаров
function loadProducts() {
    displayCategories();
    displayProducts(storeData.products);
}

// Отображение категорий
function displayCategories() {
    const categories = ['Все товары', ...new Set(storeData.products.map(p => p.category))];
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.onclick = (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts(category);
        };
        
        if (category === 'Все товары') {
            btn.classList.add('active');
        }
        
        container.appendChild(btn);
    });
}

// Фильтрация товаров
function filterProducts(category) {
    const filtered = category === 'Все товары' 
        ? storeData.products 
        : storeData.products.filter(p => p.category === category);
    
    displayProducts(filtered);
}

// Отображение товаров
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-leaf"></i>
                <h3>Товаров нет</h3>
                <p>Выберите другую категорию или добавьте товары в админке</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.setProperty('--index', index);
        
        card.innerHTML = `
            <div class="product-category">${product.category}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toLocaleString()}</div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Секретная панель
function showSecretPanel() {
    const panel = document.getElementById('secretPanel');
    panel.style.display = 'flex';
    document.getElementById('adminPassword').focus();
}

function hideSecretPanel() {
    document.getElementById('secretPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// Вход админа
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const btn = document.querySelector('.btn-login');
    const originalText = btn.textContent;
    
    // Простой пароль
    if (password === 'admin') {
        btn.innerHTML = 'Вход в систему <span class="loading"></span>';
        btn.disabled = true;
        
        setTimeout(() => {
            hideSecretPanel();
            openAdminPanel();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 800);
    } else {
        const input = document.getElementById('adminPassword');
        input.style.borderColor = '#e74c3c';
        input.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            input.style.animation = '';
            input.style.borderColor = '#e0f7e9';
        }, 500);
        
        input.value = '';
        input.focus();
    }
}

// ОТКРЫТИЕ АДМИН-ПАНЕЛИ (ГЛАВНОЕ ИСПРАВЛЕНИЕ!)
function openAdminPanel() {
    const adminWindow = window.open('', '_blank', 'width=1100,height=700,scrollbars=yes');
    
    // Передаем данные в админку
    adminWindow.storeData = JSON.parse(JSON.stringify(storeData)); // Глубокая копия
    
    adminWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Панель управления | SMOKIN174</title>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Inter', sans-serif;
                }
                
                body {
                    background: #f8f9fa;
                    color: #333;
                    min-height: 100vh;
                }
                
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                }
                
                /* Сайдбар с категориями */
                .admin-sidebar {
                    width: 250px;
                    background: white;
                    border-right: 1px solid #e0f7e9;
                    padding: 25px 0;
                    box-shadow: 2px 0 15px rgba(39, 174, 96, 0.05);
                }
                
                .admin-header {
                    padding: 0 25px 25px;
                    border-bottom: 1px solid #e0f7e9;
                    margin-bottom: 20px;
                }
                
                .admin-header h1 {
                    color: #27ae60;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .admin-header p {
                    color: #7f8c8d;
                    font-size: 0.9rem;
                }
                
                .categories-list {
                    padding: 0 15px;
                }
                
                .category-tab {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    margin-bottom: 8px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: #2d3436;
                    font-weight: 500;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    font-size: 0.95rem;
                }
                
                .category-tab i {
                    margin-right: 10px;
                    width: 20px;
                    color: #95a5a6;
                }
                
                .category-tab:hover {
                    background: rgba(39, 174, 96, 0.08);
                    color: #27ae60;
                }
                
                .category-tab.active {
                    background: #27ae60;
                    color: white;
                }
                
                .category-tab.active i {
                    color: white;
                }
                
                /* Основное содержимое */
                .admin-main {
                    flex: 1;
                    padding: 25px;
                    overflow-y: auto;
                }
                
                .main-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e0f7e9;
                }
                
                .main-header h2 {
                    color: #2d3436;
                    font-weight: 600;
                    font-size: 1.5rem;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 12px;
                }
                
                .admin-action-btn {
                    padding: 10px 22px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-save {
                    background: #27ae60;
                    color: white;
                }
                
                .btn-save:hover {
                    background: #219653;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
                }
                
                .btn-add {
                    background: white;
                    color: #27ae60;
                    border: 2px solid #27ae60;
                }
                
                .btn-add:hover {
                    background: #27ae60;
                    color: white;
                }
                
                .btn-back {
                    background: #95a5a6;
                    color: white;
                }
                
                .btn-back:hover {
                    background: #7f8c8d;
                }
                
                /* Сетка товаров в админке */
                .admin-products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 25px;
                }
                
                .admin-product-card {
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    border: 2px solid #e0f7e9;
                    transition: all 0.3s;
                }
                
                .admin-product-card:hover {
                    border-color: #27ae60;
                    box-shadow: 0 10px 25px rgba(39, 174, 96, 0.1);
                }
                
                .product-form-group {
                    margin-bottom: 18px;
                }
                
                .product-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #2d3436;
                    font-size: 0.9rem;
                }
                
                .product-form-group input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 2px solid #e0f7e9;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: all 0.3s;
                    background: white;
                }
                
                .product-form-group input:focus {
                    outline: none;
                    border-color: #27ae60;
                    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
                }
                
                .image-upload-container {
                    position: relative;
                }
                
                .image-preview {
                    width: 100%;
                    height: 180px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-top: 8px;
                    border: 2px dashed #e0f7e9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .image-preview img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: cover;
                }
                
                .image-preview.empty {
                    flex-direction: column;
                    color: #95a5a6;
                    font-size: 0.9rem;
                }
                
                .image-preview.empty i {
                    font-size: 2rem;
                    margin-bottom: 10px;
                    color: #bdc3c7;
                }
                
                .upload-btn {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: #27ae60;
                    color: white;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                
                .upload-btn:hover {
                    background: #219653;
                    transform: scale(1.1);
                }
                
                .file-input {
                    display: none;
                }
                
                .product-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .btn-remove {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: opacity 0.3s;
                    flex: 1;
                }
                
                .btn-remove:hover {
                    opacity: 0.9;
                }
                
                .empty-category {
                    text-align: center;
                    padding: 60px 20px;
                    color: #95a5a6;
                    grid-column: 1 / -1;
                }
                
                .empty-category i {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    color: #bdc3c7;
                }
                
                /* Уведомления */
                .notification {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    background: #27ae60;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    display: none;
                    align-items: center;
                    gap: 12px;
                    animation: slideInRight 0.3s;
                    z-index: 1000;
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .notification i {
                    font-size: 1.2rem;
                }
                
                /* Адаптивность админки */
                @media (max-width: 900px) {
                    .admin-container {
                        flex-direction: column;
                    }
                    
                    .admin-sidebar {
                        width: 100%;
                        border-right: none;
                        border-bottom: 1px solid #e0f7e9;
                        padding: 20px;
                    }
                    
                    .categories-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    
                    .category-tab {
                        margin-bottom: 0;
                        width: auto;
                    }
                }
                
                @media (max-width: 600px) {
                    .admin-products-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .main-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                    
                    .action-buttons {
                        width: 100%;
                    }
                    
                    .admin-action-btn {
                        flex: 1;
                        justify-content: center;
                    }
                }
            </style>
        </head>
        <body>
            <div class="admin-container">
                <!-- Сайдбар с категориями -->
                <div class="admin-sidebar">
                    <div class="admin-header">
                        <h1><i class="fas fa-cogs"></i> Панель управления</h1>
                        <p>SMOKIN174</p>
                    </div>
                    
                    <div class="categories-list" id="adminCategories">
                        <!-- Категории загружаются динамически -->
                    </div>
                </div>
                
                <!-- Основное содержимое -->
                <div class="admin-main">
                    <div class="main-header">
                        <h2 id="currentCategoryTitle">Все товары</h2>
                        <div class="action-buttons">
                            <button class="admin-action-btn btn-add" onclick="addProduct()">
                                <i class="fas fa-plus"></i> Добавить товар
                            </button>
                            <button class="admin-action-btn btn-save" onclick="saveAllProducts()">
                                <i class="fas fa-save"></i> Сохранить все
                            </button>
                            <button class="admin-action-btn btn-back" onclick="window.close()">
                                <i class="fas fa-times"></i> Закрыть
                            </button>
                        </div>
                    </div>
                    
                    <div class="admin-products-grid" id="productsContainer">
                        <!-- Товары загружаются динамически -->
                    </div>
                </div>
            </div>
            
            <div id="notification" class="notification">
                <i class="fas fa-check-circle"></i>
                <span id="notificationText"></span>
            </div>
            
            <script>
                // ВАЖНО: Получаем данные из родительского окна
                let products = window.storeData.products || [];
                let currentCategory = 'Все товары';
                
                // Функция для обновления категорий
                function updateCategoriesList() {
                    const categories = ['Все товары', ...new Set(products.map(p => p.category))];
                    const container = document.getElementById('adminCategories');
                    container.innerHTML = '';
                    
                    categories.forEach(category => {
                        const tab = document.createElement('button');
                        tab.className = 'category-tab';
                        tab.innerHTML = \`
                            <i class="fas \${category === 'Все товары' ? 'fa-boxes' : 'fa-tag'}"></i>
                            \${category}
                        \`;
                        
                        tab.onclick = () => {
                            currentCategory = category;
                            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                            tab.classList.add('active');
                            document.getElementById('currentCategoryTitle').textContent = category;
                            renderProducts();
                        };
                        
                        if (category === 'Все товары') {
                            tab.classList.add('active');
                        }
                        
                        container.appendChild(tab);
                    });
                }
                
                // Функция для отображения товаров
                function renderProducts() {
                    const filteredProducts = currentCategory === 'Все товары' 
                        ? products 
                        : products.filter(p => p.category === currentCategory);
                    
                    const container = document.getElementById('productsContainer');
                    
                    if (filteredProducts.length === 0) {
                        container.innerHTML = \`
                            <div class="empty-category">
                                <i class="fas fa-leaf"></i>
                                <h3>Товаров нет</h3>
                                <p>Добавьте товары в эту категорию</p>
                            </div>
                        \`;
                        return;
                    }
                    
                    container.innerHTML = '';
                    
                    filteredProducts.forEach((product, index) => {
                        const productDiv = document.createElement('div');
                        productDiv.className = 'admin-product-card';
                        
                        const inputId = 'product_' + product.id;
                        
                        productDiv.innerHTML = \`
                            <div class="product-form-group">
                                <label>Название товара</label>
                                <input type="text" 
                                       id="\${inputId}_name" 
                                       value="\${product.name}"
                                       placeholder="Введите название"
                                       oninput="updateProductField('\${product.id}', 'name', this.value)">
                            </div>
                            
                            <div class="product-form-group">
                                <label>Категория</label>
                                <input type="text" 
                                       id="\${inputId}_category" 
                                       value="\${product.category}"
                                       placeholder="Например: Электроника"
                                       oninput="updateProductField('\${product.id}', 'category', this.value)">
                            </div>
                            
                            <div class="product-form-group">
                                <label>Цена (₽)</label>
                                <input type="number" 
                                       id="\${inputId}_price" 
                                       value="\${product.price}"
                                       placeholder="0"
                                       oninput="updateProductField('\${product.id}', 'price', this.value)">
                            </div>
                            
                            <div class="product-form-group">
                                <label>Изображение товара</label>
                                <div class="image-upload-container">
                                    <div class="image-preview \${!product.image ? 'empty' : ''}" 
                                         onclick="document.getElementById('\${inputId}_file').click()">
                                        \${product.image ? 
                                            '<img src="' + product.image + '" alt="Превью">' : 
                                            '<i class="fas fa-image"></i><span>Загрузить изображение</span>'
                                        }
                                    </div>
                                    <input type="file" 
                                           class="file-input" 
                                           id="\${inputId}_file"
                                           accept="image/*"
                                           onchange="uploadProductImage('\${product.id}', this)">
                                    <button class="upload-btn" onclick="document.getElementById('\${inputId}_file').click()">
                                        <i class="fas fa-upload"></i>
                                    </button>
                                    <input type="text" 
                                           id="\${inputId}_image" 
                                           value="\${product.image || ''}"
                                           placeholder="Или вставьте URL картинки"
                                           style="display: none;"
                                           oninput="updateProductField('\${product.id}', 'image', this.value)">
                                </div>
                            </div>
                            
                            <div class="product-actions">
                                <button class="btn-remove" onclick="removeProduct('\${product.id}')">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            </div>
                        \`;
                        
                        container.appendChild(productDiv);
                    });
                }
                
                // Обновление поля товара
                window.updateProductField = function(productId, field, value) {
                    const product = products.find(p => p.id == productId);
                    if (product) {
                        if (field === 'price') {
                            value = parseInt(value) || 0;
                        }
                        product[field] = value;
                        
                        // Обновляем превью изображения если нужно
                        if (field === 'image' && value) {
                            const inputId = 'product_' + productId;
                            const preview = document.querySelector('#' + inputId + '_file').closest('.image-upload-container').querySelector('.image-preview');
                            if (preview) {
                                preview.innerHTML = '<img src="' + value + '" alt="Превью">';
                                preview.classList.remove('empty');
                            }
                        }
                        
                        showNotification('Изменения сохранены');
                    }
                };
                
                // Загрузка изображения
                window.uploadProductImage = function(productId, fileInput) {
                    const file = fileInput.files[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageUrl = e.target.result;
                        const product = products.find(p => p.id == productId);
                        if (product) {
                            product.image = imageUrl;
                            
                            // Обновляем поле и превью
                            const inputId = 'product_' + productId;
                            const imageInput = document.getElementById(inputId + '_image');
                            const preview = fileInput.closest('.image-upload-container').querySelector('.image-preview');
                            
                            if (imageInput) imageInput.value = imageUrl;
                            if (preview) {
                                preview.innerHTML = '<img src="' + imageUrl + '" alt="Превью">';
                                preview.classList.remove('empty');
                            }
                            
                            showNotification('Изображение загружено');
                        }
                    };
                    reader.readAsDataURL(file);
                };
                
                // Удаление товара
                window.removeProduct = function(productId) {
                    if (confirm('Удалить этот товар?')) {
                        const index = products.findIndex(p => p.id == productId);
                        if (index !== -1) {
                            products.splice(index, 1);
                            updateCategoriesList();
                            renderProducts();
                            showNotification('Товар удален');
                        }
                    }
                };
                
                // Добавление товара
                window.addProduct = function() {
                    const newProduct = {
                        id: Date.now(),
                        name: 'Новый товар',
                        category: currentCategory === 'Все товары' ? 'Новая категория' : currentCategory,
                        price: 0,
                        image: ''
                    };
                    
                    products.push(newProduct);
                    updateCategoriesList();
                    renderProducts();
                    showNotification('Новый товар добавлен');
                };
                
                // Сохранение всех товаров
                window.saveAllProducts = function() {
                    // Сохраняем в localStorage родительского окна
                    if (window.opener && !window.opener.closed) {
                        const updatedData = {
                            name: 'SMOKIN174',
                            products: products
                        };
                        
                        window.opener.localStorage.setItem('smokin174_data', JSON.stringify(updatedData));
                        window.opener.location.reload();
                    }
                    
                    // Сохраняем в текущем окне для восстановления
                    localStorage.setItem('smokin174_admin_data', JSON.stringify(products));
                    
                    showNotification('Все изменения сохранены! Магазин обновлен.');
                };
                
                // Показ уведомления
                window.showNotification = function(text) {
                    const notification = document.getElementById('notification');
                    const textEl = document.getElementById('notificationText');
                    
                    textEl.textContent = text;
                    notification.style.display = 'flex';
                    
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 3000);
                };
                
                // Восстановление данных при загрузке
                function initAdminPanel() {
                    // Пробуем восстановить из локального хранилища админки
                    const savedData = localStorage.getItem('smokin174_admin_data');
                    if (savedData) {
                        try {
                            const parsed = JSON.parse(savedData);
                            if (Array.isArray(parsed)) {
                                products = parsed;
                            }
                        } catch(e) {
                            console.log('Не удалось восстановить данные');
                        }
                    }
                    
                    updateCategoriesList();
                    renderProducts();
                }
                
                // Инициализация при загрузке
                document.addEventListener('DOMContentLoaded', initAdminPanel);
                
                // Автосохранение при закрытии
                window.addEventListener('beforeunload', function() {
                    if (window.opener && !window.opener.closed) {
                        saveAllProducts();
                    }
                });
            </script>
        </body>
        </html>
    `);
}

// Сохранение при закрытии
window.addEventListener('beforeunload', function() {
    saveStoreData();
});