let language = 'en';
let currentCategory = null;
const categoryTemplate = document.getElementById('category-template').content;
const itemTemplate = document.getElementById('item-template').content;
let currentPhone = '';
let currentBonusPoints = 0;

// Акциялар
const promotions = [
    {
        image: "https://i.pinimg.com/736x/1d/ad/38/1dad3816104bc2f57b7ebbd196b8ab0b.jpg",
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
        image: "https://i.pinimg.com/1200x/63/cc/55/63cc55cda1f1715a78610d75ae797955.jpg",
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
        image: "https://i.pinimg.com/736x/53/dd/a0/53dda0e8a2dbf6e6eee9ecc49b2cb2be.jpg",
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
        image: "https://i.pinimg.com/736x/26/25/de/2625dee5980661fc024df49857f40610.jpg",
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

// каруселди которгонго керек
let currentSlide = 0;
let autoSlideInterval;

// оюндар
let memoryLevel = 1;
let memorySequence = [];
let playerSequence = [];
let rpsPlayerScore = 0;
let rpsComputerScore = 0;
let rpsRoundsPlayed = 0;

function setLanguage(lang) {
    language = lang;
    localStorage.setItem('language', lang);

    // data-en/data-kg бар жердин баарын озгортот
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.getAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });

    document.getElementById('language-block').style.display = 'none';

    //Шапка баннер
    document.getElementById('header').style.display = 'block';
    document.getElementById('banner-carousel').style.display = 'block';

    //каруселди киргизет
    initCarousel();

    //биринчи секцияны ачат
    showSection('about');
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = language === 'en' ? el.dataset.en : el.dataset.kg;
    });
}

function showSection(section) {
    ['about', 'menu', 'get-bonus', 'contacts'].forEach(s => {
        const sec = document.getElementById(s);
        if (sec) {
            sec.style.display = (s === section) ? 'block' : 'none';
        }
    });

    // тилден башка жердин баарына баннерди кошот
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

                //башкы файлдагы шаблонду колдонот
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

                // бул жакта дагы шаблон
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

    // текшеребиз
    if (itemsBlock.style.display === 'grid' || getComputedStyle(itemsBlock).display === 'grid') {
        itemsBlock.style.display = 'none';
        categoriesBlock.style.display = 'grid';
        backBtn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// каруселди чакырганда ачылчу
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

// ============ БОНУСНАЯ СИСТЕМА ============

// Функция для форматирования номера телефона
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);

    if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1 $2');
    }

    input.value = value;
}

// Проверка бонусов
async function checkBonus() {
    const phoneInput = document.getElementById('phone-input');
    let phone = phoneInput.value.replace(/\D/g, '');

    if (phone.length !== 10) {
        alert(language === 'kg' ? '10 сандан турган номерди киргизиңиз!' : 'Please enter a 10-digit number!');
        phoneInput.focus();
        return;
    }

    currentPhone = phone;
    localStorage.setItem('currentPhone', phone);

    try {
        // Проверяем или создаем клиента
        const response = await fetch('/api/client/check-bonus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: phone })
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const data = await response.json();

        // Поддерживаем оба варианта названия поля
        const bonusPoints = data.bonus_points !== undefined ? data.bonus_points : data.bonusPoints;

        // Обновляем отображение
        document.getElementById('display-phone').textContent = phone;
        currentBonusPoints = bonusPoints || 0;
        document.getElementById('bonus-points').textContent = currentBonusPoints;

        // Переключаем шаги
        document.getElementById('phone-input-step').style.display = 'none';
        document.getElementById('bonus-display-step').style.display = 'block';

        // Прокручиваем к бонусной карте
        document.getElementById('bonus-display-step').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Ошибка при проверке бонусов:', error);
        // Для тестирования показываем демо-данные
        showDemoBonus(phone);
    }
}

// Функция для демо-данных (если нет бэкенда)
function showDemoBonus(phone) {
    // Симуляция получения данных
    document.getElementById('display-phone').textContent = phone;
    currentBonusPoints = Math.floor(Math.random() * 50); // Случайные бонусы для демо
    document.getElementById('bonus-points').textContent = currentBonusPoints;

    document.getElementById('phone-input-step').style.display = 'none';
    document.getElementById('bonus-display-step').style.display = 'block';
    document.getElementById('bonus-display-step').scrollIntoView({ behavior: 'smooth' });
}

// Смена номера телефона
function changePhoneNumber() {
    document.getElementById('phone-input-step').style.display = 'block';
    document.getElementById('bonus-display-step').style.display = 'none';
    document.getElementById('phone-input').value = '';
    document.getElementById('phone-input').focus();
}

// Обновление бонусов (после игры)
async function updateBonus(pointsToAdd) {
    if (!currentPhone) return;

    try {
        const response = await fetch('/api/client/update-bonus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: currentPhone,
                points: pointsToAdd
            })
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const data = await response.json();

        // Поддерживаем оба варианта названия поля
        const bonusPoints = data.bonus_points !== undefined ? data.bonus_points : data.bonusPoints;

        currentBonusPoints = bonusPoints || currentBonusPoints + pointsToAdd;

        // Критически важно: обновляем отображение бонусов
        const bonusPointsElement = document.getElementById('bonus-points');
        if (bonusPointsElement) {
            bonusPointsElement.textContent = currentBonusPoints;
        }

        // Показываем уведомление
        showBonusNotification(pointsToAdd);

    } catch (error) {
        console.error('Ошибка при обновлении бонусов:', error);
        // Для тестирования обновляем локально
        currentBonusPoints += pointsToAdd;
        const bonusPointsElement = document.getElementById('bonus-points');
        if (bonusPointsElement) {
            bonusPointsElement.textContent = currentBonusPoints;
        }
        showBonusNotification(pointsToAdd);
    }
}

// Показать уведомление о бонусе
function showBonusNotification(points) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'bonus-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <span>+${points} ${language === 'kg' ? 'бонус упай' : 'bonus points'}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Убираем через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ============ ИГРЫ ============

// Открытие модального окна игры
function openGameModal(title, contentHTML, onCloseCallback = null) {
    const modal = document.getElementById('game-modal');
    const gameContent = document.getElementById('game-content');

    gameContent.innerHTML = `
        <div class="game-screen">
            <h2 class="game-title">${title}</h2>
            ${contentHTML}
        </div>
    `;

    modal.style.display = 'flex';

    // Сохраняем callback для закрытия
    if (onCloseCallback) {
        modal.dataset.closeCallback = onCloseCallback;
    }
}

// Закрытие модального окна
function closeGameModal() {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';

    // Вызываем callback если есть
    if (modal.dataset.closeCallback) {
        try {
            if (typeof window[modal.dataset.closeCallback] === 'function') {
                window[modal.dataset.closeCallback]();
            }
        } catch (e) {
            console.error('Error calling close callback:', e);
        }
        delete modal.dataset.closeCallback;
    }
}

// ИГРА 1: Угадай число - ИСПРАВЛЕННАЯ ВЕРСИЯ
function startGuessGame() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    let attempts = 3;

    const content = `
        <div class="game-instructions" id="guess-instructions">
            ${language === 'kg' ? `1ден 10го чейинки санды табыңыз. ${attempts} аракет калды!` : `Guess a number from 1 to 10. You have ${attempts} attempts!`}
        </div>
        <input type="number" id="guess-input" class="game-input" min="1" max="10" placeholder="1-10">
        <div id="guess-feedback" style="margin: 15px 0; min-height: 30px;"></div>
        <button class="game-btn" onclick="makeGuess(${randomNumber}, ${attempts})">
            ${language === 'kg' ? 'Тап' : 'Guess'}
        </button>
    `;

    openGameModal(
        language === 'kg' ? 'Санды тап' : 'Guess the Number',
        content,
        'resetGuessGame'
    );
}

function makeGuess(correctNumber, attemptsLeft) {
    const input = document.getElementById('guess-input');
    const feedback = document.getElementById('guess-feedback');
    const instructions = document.getElementById('guess-instructions');
    const guess = parseInt(input.value);

    if (isNaN(guess) || guess < 1 || guess > 10) {
        feedback.innerHTML = language === 'kg'
            ? '1ден 10го чейинки санды киргизиңиз!'
            : 'Please enter a number between 1 and 10!';
        feedback.className = 'result-failure';
        return;
    }

    attemptsLeft--;

    // Обновляем инструкции
    if (instructions) {
        instructions.textContent = language === 'kg'
            ? `1ден 10го чейинки санды табыңыз. ${attemptsLeft} аракет калды!`
            : `Guess a number from 1 to 10. ${attemptsLeft} attempts left!`;
    }

    if (guess === correctNumber) {
        feedback.innerHTML = language === 'kg'
            ? `✅ Так таптыңыз! Жооп: ${correctNumber}`
            : `✅ Correct! The number was ${correctNumber}`;
        feedback.className = 'result-success';

        setTimeout(() => {
            updateBonus(5);
            showGameResult(
                language === 'kg' ? 'Уттуңуз! 5 бонус упай кошулду!' : 'You won! 5 bonus points added!',
                true
            );
        }, 1000);
        return;
    }

    if (attemptsLeft > 0) {
        const hint = guess < correctNumber
            ? (language === 'kg' ? 'Жогору' : 'Higher')
            : (language === 'kg' ? 'Төмөн' : 'Lower');

        feedback.innerHTML = language === 'kg'
            ? `${hint}! ${attemptsLeft} аракет калды.`
            : `${hint}! ${attemptsLeft} attempts left.`;
        feedback.className = 'result-neutral';

        // Обновляем обработчик с новым количеством попыток
        const guessBtn = document.querySelector('.game-btn');
        if (guessBtn) {
            guessBtn.onclick = () => makeGuess(correctNumber, attemptsLeft);
        }
    } else {
        feedback.innerHTML = language === 'kg'
            ? `❌ Кечиресиз, жооп: ${correctNumber}`
            : `❌ Sorry, the number was ${correctNumber}`;
        feedback.className = 'result-failure';

        setTimeout(() => {
            showGameResult(
                language === 'kg' ? 'Утулдуңуз, кийинки жолу ийгиликтүү болсун!' : 'You lost, better luck next time!',
                false
            );
        }, 1000);
    }

    input.value = '';
    input.focus();
}

// ИГРА 2: Камень-Ножницы-Бумага - ИСПРАВЛЕННАЯ ВЕРСИЯ
function startRPSGame() {
    // Сбрасываем счёт
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    rpsRoundsPlayed = 0;

    const content = `
        <div class="game-instructions">
            ${language === 'kg' ? 'Таш, Кайчы же Кагазды тандаңыз. 2 раундду уткан жеңет!' : 'Choose Rock, Paper or Scissors. First to win 2 rounds!'}
        </div>
        <div class="game-choices">
            <button class="choice-btn" onclick="playRPSRound('rock')">👊 ${language === 'kg' ? 'Таш' : 'Rock'}</button>
            <button class="choice-btn" onclick="playRPSRound('paper')">✋ ${language === 'kg' ? 'Кагаз' : 'Paper'}</button>
            <button class="choice-btn" onclick="playRPSRound('scissors')">✌️ ${language === 'kg' ? 'Кайчы' : 'Scissors'}</button>
        </div>
        <div id="rps-result" style="margin: 25px 0; min-height: 80px;">
            <p id="round-result"></p>
            <p id="score">${language === 'kg' ? 'Эсеп:' : 'Score:'} 0 - 0</p>
            <p id="rounds">${language === 'kg' ? 'Ойнолгон раунд:' : 'Rounds played:'} 0</p>
        </div>
    `;

    openGameModal(
        language === 'kg' ? 'Таш Кайчы Кагаз' : 'Rock Paper Scissors',
        content,
        'resetRPSGame'
    );
}

function playRPSRound(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result = '';
    let roundResult = document.getElementById('round-result');
    let scoreElement = document.getElementById('score');
    let roundsElement = document.getElementById('rounds');

    // Определяем победителя раунда
    if (playerChoice === computerChoice) {
        result = language === 'kg' ? 'Тен!' : 'Tie!';
        roundResult.className = 'result-neutral';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = language === 'kg' ? 'Сиз уттуңуз!' : 'You win this round!';
        rpsPlayerScore++;
        roundResult.className = 'result-success';
    } else {
        result = language === 'kg' ? 'Компьютер утту!' : 'Computer wins this round!';
        rpsComputerScore++;
        roundResult.className = 'result-failure';
    }

    rpsRoundsPlayed++;

    // Обновляем отображение
    roundResult.innerHTML = language === 'kg'
        ? `Сиз: ${getRPSLabel(playerChoice, true)} | Компьютер: ${getRPSLabel(computerChoice, true)}<br>${result}`
        : `You: ${getRPSLabel(playerChoice, false)} | Computer: ${getRPSLabel(computerChoice, false)}<br>${result}`;

    scoreElement.textContent = language === 'kg'
        ? `Эсеп: ${rpsPlayerScore} - ${rpsComputerScore}`
        : `Score: ${rpsPlayerScore} - ${rpsComputerScore}`;

    roundsElement.textContent = language === 'kg'
        ? `Ойнолгон раунд: ${rpsRoundsPlayed}`
        : `Rounds played: ${rpsRoundsPlayed}`;

    // Проверяем конец игры (лучший из 3 раундов)
    if (rpsPlayerScore === 2 || rpsComputerScore === 2 || rpsRoundsPlayed === 3) {
        setTimeout(() => {
            if (rpsPlayerScore > rpsComputerScore) {
                updateBonus(3);
                showGameResult(
                    language === 'kg' ? `Уттуңуз! ${rpsPlayerScore}-${rpsComputerScore}. 3 бонус упай кошулду!` :
                    `You won! ${rpsPlayerScore}-${rpsComputerScore}. 3 bonus points added!`,
                    true
                );
            } else if (rpsPlayerScore === rpsComputerScore) {
                showGameResult(
                    language === 'kg' ? `Тен! ${rpsPlayerScore}-${rpsComputerScore}. Бонус жок.` :
                    `Tie! ${rpsPlayerScore}-${rpsComputerScore}. No bonus.`,
                    false
                );
            } else {
                showGameResult(
                    language === 'kg' ? `Утулдуңуз! ${rpsPlayerScore}-${rpsComputerScore}. Кийинки жолу ийгиликтүү болсун!` :
                    `You lost! ${rpsPlayerScore}-${rpsComputerScore}. Better luck next time!`,
                    false
                );
            }
        }, 1500);
    }
}

function getRPSLabel(choice, isKg) {
    const labelsKg = { rock: 'Таш', paper: 'Кагаз', scissors: 'Кайчы' };
    const labelsEn = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };
    return isKg ? labelsKg[choice] : labelsEn[choice];
}


// Показ результата игры
function showGameResult(message, isSuccess) {
    const content = `
        <div class="game-result ${isSuccess ? 'result-success' : 'result-failure'}">
            <h3>${isSuccess ? (language === 'kg' ? 'Куттуктайбыз!' : 'Congratulations!') : (language === 'kg' ? 'Кечиресиз' : 'Sorry')}</h3>
            <p>${message}</p>
            <button class="game-btn" onclick="closeGameModal()" style="margin-top: 20px;">
                ${language === 'kg' ? 'Макул' : 'OK'}
            </button>
        </div>
    `;

    document.getElementById('game-content').innerHTML = content;
}


function resetRPSGame() {
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    rpsRoundsPlayed = 0;
}

// Обновление текстов в бонусной секции
function updateBonusSectionLanguage() {
    // Обновляем все тексты в бонусной секции
    document.querySelectorAll('#get-bonus [data-en]').forEach(el => {
        el.textContent = language === 'en' ? el.dataset.en : el.dataset.kg;
    });
}
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // Скрываем всё кроме блока выбора языка
    document.getElementById('header').style.display = 'none';
    document.getElementById('banner-carousel').style.display = 'none';

    // Скрываем все секции контента
    ['about', 'menu', 'get-bonus', 'contacts'].forEach(s => {
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

    // Проверяем, был ли уже введен номер телефона
    const savedPhone = localStorage.getItem('currentPhone');
    if (savedPhone) {
        currentPhone = savedPhone;
        // Автоматически проверяем бонусы
        setTimeout(() => checkBonus(), 1000);
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

    // Добавляем обработчик Enter для поля телефона
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkBonus();
            }
        });
    }
});