// Данные магазина - теперь единый источник истины
let storeData = {
    name: 'SMOKIN174',
    products: [
        {
            id: 1,
            name: "Пример товара 1",
            category: "Электроника",
            price: 9990,
            image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Пример товара 2",
            category: "Одежда",
            price: 2990,
            image: "https://images.unsplash.com/photo-1553545204-5336bc12ca32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]
};

// Загружаем данные из localStorage при запуске
try {
    const savedData = localStorage.getItem('smokin174_data');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Array.isArray(parsedData.products)) {
            storeData = parsedData;
        }
    }
} catch (e) {
    console.log('Ошибка загрузки данных, используем стандартные');
}

// Инициализация магазина
document.addEventListener('DOMContentLoaded', function() {
    console.log('Загружаем товары:', storeData.products.length);
    loadProducts();
    
    // Секретный вход (тройной клик в правом верхнем углу)
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

// Сохранение данных
function saveStoreData() {
    localStorage.setItem('smokin174_data', JSON.stringify(storeData));
    console.log('Данные сохранены:', storeData.products.length, 'товаров');
}

// Загрузка товаров
function loadProducts() {
    console.log('Отображаем товары:', storeData.products);
    displayCategories();
    displayProducts(storeData.products);
}

// Отображение категорий
function displayCategories() {
    const categories = ['Все товары'];
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    // Собираем уникальные категории
    const categorySet = new Set();
    storeData.products.forEach(product => {
        if (product.category && product.category.trim()) {
            categorySet.add(product.category);
        }
    });
    
    categories.push(...Array.from(categorySet));
    
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
    
    if (!productsToShow || productsToShow.length === 0) {
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
    
    if (password === 'admin') {
        btn.innerHTML = 'Вход в систему <span class="loading"></span>';
        btn.disabled = true;
        
        setTimeout(() => {
            hideSecretPanel();
            openAdminPanel();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 500);
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

// ОТКРЫТИЕ АДМИН-ПАНЕЛИ (УПРОЩЕННАЯ И РАБОЧАЯ ВЕРСИЯ)
function openAdminPanel() {
    // Открываем новое окно
    const adminWindow = window.open('admin-panel.html', '_blank', 'width=1100,height=700');
    
    // Передаем данные через localStorage
    localStorage.setItem('smokin174_admin_open', Date.now().toString());
    
    // Слушаем сообщения от админки
    window.addEventListener('message', function(event) {
        if (event.data.type === 'UPDATE_PRODUCTS') {
            console.log('Получены обновленные товары:', event.data.products);
            storeData.products = event.data.products;
            saveStoreData();
            loadProducts(); // Сразу обновляем отображение
        }
    });
}