let language = 'en';
let currentCategory = null;

function setLanguage(lang) {
    language = lang;
    document.getElementById('language-block').style.display = 'none';
    document.getElementById('header').style.display = 'flex';
    updateLanguage();
    showSection('about');
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = language === 'en' ? el.dataset.en : el.dataset.kg;
    });
}

function showSection(section) {
    ['about','menu','contacts'].forEach(s => {
        document.getElementById(s).style.display = (s === section) ? 'block' : 'none';
    });
    if(section === 'menu') {
        loadCategories();
    }
}

function loadCategories() {
    fetch('/api/client/categories')
        .then(res => res.json())
        .then(data => {
            const block = document.getElementById('categories-block');
            block.innerHTML = '';
            data.forEach(cat => {
                const div = document.createElement('div');
                div.className = 'category-card';
                div.innerHTML = `
                    <h3>${language === 'kg' ? cat.name_kg : cat.name_en}</h3>
                    <img src="${cat.image_url}" alt="${cat.name_en}">
                `;
                div.onclick = () => loadItems(cat.id);
                block.appendChild(div);
            });
            document.getElementById('items-block').style.display = 'none';
            document.getElementById('back-btn').style.display = 'none';
        })
        .catch(err => console.error('Ошибка при загрузке категорий:', err));
}


function loadItems(categoryId) {
    currentCategory = categoryId;
    fetch(`/api/client/items/${categoryId}`)
        .then(res => res.json())
        .then(data => {
            const block = document.getElementById('items-block');
            block.innerHTML = '';
            data.forEach(item => {
                const name = language === 'kg' ? item.name_kg : item.name_en;
                const desc = language === 'kg' ? item.description_kg : item.description_en;
                const priceLabel = language === 'kg' ? 'Баасы' : 'Price';
                block.innerHTML += `
                    <div class="item-card">
                        <h4>${name || '---'}</h4>
                        <p>${priceLabel}: ${item.price ?? '---'}</p>
                        <img src="${item.image_url}" alt="${name}">
                        <p>${desc || '---'}</p>
                    </div>
                `;
            });
            document.getElementById('categories-block').style.display = 'none';
            block.style.display = 'flex';
            document.getElementById('back-btn').style.display = 'block';
        })
        .catch(err => console.error('Ошибка при загрузке позиций:', err));
}

function goBack() {
    if(document.getElementById('items-block').style.display === 'flex') {
        document.getElementById('items-block').style.display = 'none';
        document.getElementById('categories-block').style.display = 'flex';
        document.getElementById('back-btn').style.display = 'none';
    }
}
