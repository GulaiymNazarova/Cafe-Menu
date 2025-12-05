let language = 'en';
let currentCategory = null;
const categoryTemplate = document.getElementById('category-template').content;
const itemTemplate = document.getElementById('item-template').content;

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
                const name = language === 'kg' ? cat.name_kg : cat.name_en;

                const card = categoryTemplate.cloneNode(true);
                card.querySelector('img').src = cat.image_url || '';
                card.querySelector('img').alt = name;
                card.querySelector('h3').textContent = name;

                card.querySelector('.category-card').onclick = () => loadItems(cat.id);
                block.appendChild(card);
            });

            document.getElementById('items-block').style.display = 'none';
            document.getElementById('back-btn').style.display = 'none';
            document.getElementById('categories-block').style.display = 'grid';
        })
        .catch(err => console.error(err));
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
                const priceLabel = language === 'kg' ? 'сом' : 'som';

                const card = itemTemplate.cloneNode(true);
                card.querySelector('img').src = item.image_url || '';
                card.querySelector('img').alt = name;
                card.querySelector('.item-name').textContent = name || '—';
                card.querySelector('.description').textContent = desc || '';
                card.querySelector('.price strong').textContent = `${item.price || '—'} ${priceLabel}`;

                block.appendChild(card);
            });

            document.getElementById('categories-block').style.display = 'none';
            block.style.display = 'grid';
            document.getElementById('back-btn').style.display = 'block';
        })
        .catch(err => console.error(err));
}

function goBack() {
    const itemsBlock = document.getElementById('items-block');
    const categoriesBlock = document.getElementById('categories-block');
    const backBtn = document.getElementById('back-btn');

    // Проверяем, видим ли блок товаров
    if (itemsBlock.style.display === 'grid' || getComputedStyle(itemsBlock).display === 'grid') {
        itemsBlock.style.display = 'none';
        categoriesBlock.style.display = 'grid';
        backBtn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
