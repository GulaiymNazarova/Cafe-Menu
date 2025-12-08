let language = 'en';
let currentCategory = null;
const categoryTemplate = document.getElementById('category-template').content;
const itemTemplate = document.getElementById('item-template').content;

// Данные для каруселя (акции)
const promotions = [
    {
        image: "https://i.pinimg.com/1200x/e7/a8/e9/e7a8e991b065ea8e0794ae9a70b62e8b.jpg",
        title: { en: "Happy Hours", kg: "Баалуу сааттар" },
        description: {
            en: "50% OFF on all drinks from 3 PM to 6 PM",
            kg: "15:00дөн 18:00го чейин бардык суусундуктарга 50% арзандатуу"
        },
        details: {
            en: "Every weekday. Limited offer!",
            kg: "Ар ишемби күнү. Чектелген сунуш!"
        }
    },
    {
        image: "https://i.pinimg.com/736x/56/e3/23/56e3239139420efcaabb312e800629a3.jpg",
        title: { en: "Coffee Lovers", kg: "Кофе сүйүүчүлөр" },
        description: {
            en: "Buy 4 coffees, get 1 free!",
            kg: "4 кофе сатып алыңыз, 1 кофе бекер алыңыз!"
        },
        details: {
            en: "Any type of coffee. Collect stamps.",
            kg: "Кандайдыр бир кофе. Штамп чогултуңуз."
        }
    },
    {
        image: "https://i.pinimg.com/736x/fe/f6/c6/fef6c6a8206d573f47841a441e2d91d5.jpg",
        title: { en: "Weekend Brunch", kg: "Апта аягы бранчы" },
        description: {
            en: "Special weekend menu 20% OFF",
            kg: "Апта аягындагы атайын меню 20% арзандатуу"
        },
        details: {
            en: "Saturday & Sunday, 10 AM - 2 PM",
            kg: "Ишемби жана жекшемби, саат 10:00 - 14:00"
        }
    },
    {
        image: "https://i.pinimg.com/1200x/dc/4e/03/dc4e032e55257d0a1f7eea715a109f1e.jpg",
        title: { en: "Student Discount", kg: "Студенттер үчүн арзандатуу" },
        description: {
            en: "20% OFF with student ID",
            kg: "Студенттик карта менен 20% арзандатуу"
        },
        details: {
            en: "All day, every day for students",
            kg: "Күн бою, ар күнү студенттер үчүн"
        }
    }
];

// Переменные для каруселя
let currentSlide = 0;
let autoSlideInterval;

function setLanguage(lang) {
    language = lang;
    localStorage.setItem('language', lang);

    // Обновляем все тексты с атрибутами data-en/data-kg
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.getAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });

    // Скрываем блок выбора языка
    document.getElementById('language-block').style.display = 'none';

    // Показываем шапку и баннер
    document.getElementById('header').style.display = 'block';
    document.getElementById('banner-carousel').style.display = 'block';

    // Инициализируем карусель
    initCarousel();

    // Показываем первую секцию
    showSection('about');
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = language === 'en' ? el.dataset.en : el.dataset.kg;
    });
}

function showSection(section) {
    // Скрываем все секции
    ['about', 'menu', 'get-bonus', 'my-bonuses', 'contacts'].forEach(s => {
        const sec = document.getElementById(s);
        if (sec) {
            sec.style.display = (s === section) ? 'block' : 'none';
        }
    });

    // Показываем баннер на всех страницах кроме выбора языка
    const banner = document.getElementById('banner-carousel');
    if (banner && section !== 'language-block') {
        banner.style.display = 'block';
    }

    if(section === 'menu') {
        loadCategories();
    }
}

function loadCategories() {
    console.log('Loading categories...');
    fetch('/api/client/categories')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log('Categories loaded:', data);
            const block = document.getElementById('categories-block');
            if (!block) return;

            block.innerHTML = '';
            data.forEach(cat => {
                const name = language === 'kg' ? cat.name_kg : cat.name_en;

                // Используем шаблон
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
        .catch(err => {
            console.error('Ошибка при загрузке категорий:', err);
            // Для тестирования можно показать демо-данные
            const block = document.getElementById('categories-block');
            if (block) {
                block.innerHTML = '<p>Ошибка загрузки. Проверьте подключение к серверу.</p>';
            }
        });
}

function loadItems(categoryId) {
    currentCategory = categoryId;
    console.log('Loading items for category:', categoryId);

    fetch(`/api/client/items/${categoryId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log('Items loaded:', data);
            const block = document.getElementById('items-block');
            if (!block) return;

            block.innerHTML = '';

            data.forEach(item => {
                const name = language === 'kg' ? item.name_kg : item.name_en;
                const desc = language === 'kg' ? item.description_kg : item.description_en;
                const priceLabel = language === 'kg' ? 'сом' : 'som';

                // Используем шаблон
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
        .catch(err => {
            console.error('Ошибка при загрузке позиций:', err);
            const block = document.getElementById('items-block');
            if (block) {
                block.innerHTML = '<p>Ошибка загрузки товаров.</p>';
            }
        });
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

// Инициализация каруселя
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !dotsContainer) return;

    // Очищаем предыдущие слайды
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Создаем слайды
    promotions.forEach((promo, index) => {
        // Создаем слайд
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
            <img src="${promo.image}" alt="${promo.title[language] || promo.title.en}">
            <div class="slide-content">
                <h3>${promo.title[language] || promo.title.en}</h3>
                <p>${promo.description[language] || promo.description.en}</p>
                <p><small>${promo.details[language] || promo.details.en}</small></p>
            </div>
        `;
        track.appendChild(slide);

        // Создаем точки
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Стартуем автопрокрутку
    startAutoSlide();
}

// Переход к конкретному слайду
function goToSlide(index) {
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.dot');

    if (!track || !dots.length) return;

    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Обновляем активную точку
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });

    // Сбрасываем автопрокрутку
    resetAutoSlide();
}

// Следующий слайд
function nextSlide() {
    currentSlide = (currentSlide + 1) % promotions.length;
    goToSlide(currentSlide);
}

// Предыдущий слайд
function prevSlide() {
    currentSlide = (currentSlide - 1 + promotions.length) % promotions.length;
    goToSlide(currentSlide);
}

// Запуск автоматической прокрутки
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // 5 секунд
}

// Сброс автопрокрутки
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Скрываем всё кроме блока выбора языка
    document.getElementById('header').style.display = 'none';
    document.getElementById('banner-carousel').style.display = 'none';

    // Скрываем все секции контента
    ['about', 'menu', 'get-bonus', 'my-bonuses', 'contacts'].forEach(s => {
        const sec = document.getElementById(s);
        if (sec) {
            sec.style.display = 'none';
        }
    });

    // Показываем только блок выбора языка
    document.getElementById('language-block').style.display = 'flex';

    // Восстанавливаем язык только если он был выбран ранее
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        // Обновляем текст кнопок на сохраненный язык (но не применяем его полностью)
        document.querySelectorAll('[data-en]').forEach(element => {
            if (element.getAttribute(`data-${savedLang}`)) {
                element.textContent = element.getAttribute(`data-${savedLang}`);
            }
        });
    }

    // Останавливаем автопрокрутку при наведении на баннер
    const carousel = document.getElementById('banner-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        // Добавляем обработчики для свайпа на мобильных
        let startX = 0;
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Минимальная дистанция свайпа
                if (diff > 0) {
                    nextSlide(); // Свайп влево
                } else {
                    prevSlide(); // Свайп вправо
                }
            }
        });
    }
});

javascript
// Фиксация баннера при скролле (опционально)
window.addEventListener('scroll', function() {
    const banner = document.getElementById('banner-carousel');
    const header = document.getElementById('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (banner && header) {
        const headerHeight = header.offsetHeight;

        if (scrollTop > headerHeight) {
            banner.classList.add('fixed');
            document.body.style.paddingTop = '400px'; // Высота баннера
        } else {
            banner.classList.remove('fixed');
            document.body.style.paddingTop = '0';
        }
    }
});



