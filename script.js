// Данные магазина
let storeData = {
    name: 'SMOKIN174',
    products: []
};

// Загружаем данные при запуске
function loadStoreData() {
    try {
        const saved = localStorage.getItem('smokin174_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.products)) {
                storeData = parsed;
            }
        }
    } catch (e) {
        console.log('Ошибка загрузки данных');
    }
    
    // НИКАКИХ ПРИМЕРНЫХ ТОВАРОВ!
    // Если данных нет - оставляем пустой массив
    saveStoreData();
}

// Сохраняем данные
function saveStoreData() {
    localStorage.setItem('smokin174_data', JSON.stringify(storeData));
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadStoreData();
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

// Загрузка товаров
function loadProducts() {
    displayCategories();
    displayProducts(storeData.products);
}

// Отображение категорий
function displayCategories() {
    const categories = ['Все товары'];
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
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

// Отображение товаров - ВАЖНО: используем только URL картинок
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    if (!productsToShow || productsToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 20px;">🛒</div>
                <h3>Товаров нет</h3>
                <p>Добавьте товары в админке</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.setProperty('--index', index);
        
        // ВАЖНО: используем только URL или заглушку
        const imageUrl = product.image && product.image.startsWith('http') 
            ? product.image 
            : 'https://via.placeholder.com/400x300?text=Нет+фото';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=Ошибка+загрузки'">
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
        btn.disabled = true;
        btn.textContent = 'Вход...';
        
        setTimeout(() => {
            hideSecretPanel();
            openAdminPanel();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 300);
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

// Открытие админ-панели
function openAdminPanel() {
    const adminWindow = window.open('admin-panel.html', '_blank', 'width=1100,height=700,scrollbars=yes');
    
    // Ждем загрузки и передаем данные
    const checkAdminLoaded = setInterval(() => {
        if (adminWindow && !adminWindow.closed) {
            try {
                adminWindow.postMessage({
                    type: 'INIT_DATA',
                    products: storeData.products
                }, '*');
                clearInterval(checkAdminLoaded);
            } catch (e) {}
        } else {
            clearInterval(checkAdminLoaded);
        }
    }, 100);
    
    // Слушаем обновления от админки
    window.addEventListener('message', function(event) {
        if (event.data.type === 'UPDATE_PRODUCTS') {
            storeData.products = event.data.products;
            saveStoreData();
            loadProducts();
        }
    });
}

// Сохранение при закрытии
window.addEventListener('beforeunload', function() {
    saveStoreData();
});

// Функция для принудительного сброса
function resetAllData() {
    if (confirm('Удалить ВСЕ данные на всех устройствах?')) {
        localStorage.removeItem('smokin174_data');
        storeData.products = [];
        saveStoreData();
        loadProducts();
        alert('Все данные сброшены!');
    }
}