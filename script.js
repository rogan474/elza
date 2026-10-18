/* ========== НАСТРОЙКИ ========== */

// Сюда вставь свою почту, чтобы получать уведомления
const EMAIL = "roganovak_38@mail.ru"; 

// Фото для финального экрана (пикселизация)
const FINAL_PHOTO = "img/elza.png"; // Название файла с её фото

// Фото для письма (Экран 3)
const LETTER_PHOTO = "img/we.png"; // Сюда тоже можно вставить фото

/* ========== ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ========== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  setTimeout(() => {
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
  }, 50);
}

/* ========== ЭКРАН 1: PIN ========== */

/* ⬇⬇⬇ ВОТ ТУТ ПАРОЛЬ ⬇⬇⬇ */
const CORRECT_PIN = "260426";
/* ⬆⬆⬆ ВОТ ТУТ ПАРОЛЬ ⬆⬆⬆ */

let pinValue = "";

const keypad = document.getElementById('keypad');
const pinDisplay = document.getElementById('pinDisplay');
const pinError = document.getElementById('pinError');
const pinContainer = document.getElementById('pinContainer');
const btnSubmitPin = document.getElementById('btnSubmitPin');

function updateDisplay() {
  if (pinValue.length === 0) {
    pinDisplay.textContent = "_ _ _ _ _ _";
    pinDisplay.classList.remove('error');
  } else {
    pinDisplay.textContent = pinValue;
    pinDisplay.classList.remove('error');
  }
}

/* Ввод с клавиатуры (цифры на экране) */
keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn || btn.classList.contains('empty')) return;
  const key = btn.dataset.key;

  if (key === 'del') {
    pinValue = pinValue.slice(0, -1);
    pinError.textContent = "";
  } else if (pinValue.length < 6) {
    pinValue += key;
  }
  updateDisplay();
});

/* Кнопка "Отправить" */
btnSubmitPin.addEventListener('click', checkPin);

/* Проверка пароля */
function checkPin() {
  if (pinValue === CORRECT_PIN) {
    pinError.textContent = "";
    pinError.style.color = "#8fffaa";
    pinError.textContent = "Верно ❤️";
    setTimeout(() => showScreen('screen-envelope'), 600);
  } else {
    pinError.style.color = "#ff5577";
    pinError.textContent = "Не та дата, подумай ещё 😝";
    pinDisplay.classList.add('error');
    pinContainer.classList.add('shake');

    setTimeout(() => {
      pinContainer.classList.remove('shake');
      pinDisplay.classList.remove('error');
    }, 600);

    pinValue = "";
    setTimeout(updateDisplay, 400);
  }
}

/* Enter на клавиатуре = отправить */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('screen-pin').classList.contains('active')) {
    checkPin();
  }
});

/* ========== ЭКРАН 2: КОНВЕРТ ========== */
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelope  = document.getElementById('envelope');
const waxSeal   = document.getElementById('waxSeal');
const envelopeHint = document.getElementById('envelopeHint');

const sealBase  = document.getElementById('sealBase');
const sealHeart = document.getElementById('sealHeart');
const crack1    = document.getElementById('crack1');
const crack2    = document.getElementById('crack2');
const shard1    = document.getElementById('shard1');
const shard2    = document.getElementById('shard2');
const shard3    = document.getElementById('shard3');

let sealClicks = 0;

waxSeal.addEventListener('click', (e) => {
  e.stopPropagation();
  if (sealClicks >= 3) return;

  sealClicks++;

  if (sealClicks === 1) {
    waxSeal.classList.add('crack-1');
    crack1.style.opacity = 1;
    envelopeHint.textContent = "Надкололся... 💔";
  } else if (sealClicks === 2) {
    waxSeal.classList.add('crack-2');
    crack2.style.opacity = 1;
    sealHeart.style.transform = 'scale(1.15)';
    setTimeout(() => sealHeart.style.transform = 'scale(1)', 300);
    envelopeHint.textContent = "Ещё чуть-чуть... 💥";
  } else if (sealClicks === 3) {
    envelopeHint.textContent = "Раскололся!";
    sealBase.style.transition = 'opacity 0.3s';
    sealBase.style.opacity = 0;
    sealHeart.style.opacity = 0;
    crack1.style.opacity = 0;
    crack2.style.opacity = 0;

    shard1.setAttribute('opacity', 1);
    shard2.setAttribute('opacity', 1);
    shard3.setAttribute('opacity', 1);

    setTimeout(() => {
      shard1.style.transform = 'translate(-90px, -70px) rotate(-55deg)';
      shard1.style.opacity = 0;
    }, 150);

    setTimeout(() => {
      shard2.style.transform = 'translate(95px, -75px) rotate(60deg)';
      shard2.style.opacity = 0;
    }, 220);

    setTimeout(() => {
      shard3.style.transform = 'translate(10px, 100px) rotate(25deg)';
      shard3.style.opacity = 0;
    }, 300);

    setTimeout(() => {
      envelope.classList.add('opening');
      setTimeout(() => {
        buildLetterBg();
        showScreen('screen-letter');
      }, 1600);
    }, 1200);
  }
});

/* ========== ЭКРАН 3: ПИСЬМО ========== */
function buildLetterBg() {
  const photoEl = document.getElementById('paperPhoto');
  if (photoEl) {
    photoEl.style.backgroundImage = `url(${LETTER_PHOTO})`;
  }
}

/* Кнопка "НЕТ" — убегает */
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');

function moveNo() {
  const x = (Math.random() - 0.5) * 400;
  const y = (Math.random() - 0.5) * 300;
  btnNo.style.transform = `translate(${x}px, ${y}px)`;
}

btnNo.addEventListener('mouseenter', moveNo);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); });
btnNo.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });

btnYes.addEventListener('click', () => {
  showScreen('screen-choose');
});

/* ========== ЭКРАН 4: ВЫБОР ========== */

// Храним выбор
const choice = {
  date: null,
  time: null,
  cuisine: null,
  cuisineName: null,
  place: null
};

// Твои рестораны (обновленный список)
const PLACES = {
  italian:  ["Olio", "Extra Lounge"],
  japanese: ["Sakyra by Tasigo", "Лапшичная хорошим людям", "OmNomNom"],
  georgian: ["Грузинские истории", "Сулгуни", "Супра", "Vasilchuki Chaihona № 1"],
  french:   ["Шербурские зонтики", "Smorodina"],
  tatar:    ["Гусь", "Азу", "Толока"],
  custom:   ["Свое предложение"] 
};

function showStep(id) {
  document.querySelectorAll('.choose-step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* --- ШАГ 1: ДАТА --- */
document.getElementById('nextDate').addEventListener('click', () => {
  const val = document.getElementById('dateInput').value;
  if (!val) { alert("Выбери дату 💕"); return; }
  choice.date = val;
  showStep('step-time');
});

/* --- ШАГ 2: ВРЕМЯ --- */
document.getElementById('backTime').addEventListener('click', () => showStep('step-date'));
document.getElementById('nextTime').addEventListener('click', () => {
  const val = document.getElementById('timeInput').value;
  if (!val) { alert("Выбери время 💕"); return; }
  choice.time = val;
  showStep('step-cuisine');
});

/* --- ШАГ 3: КУХНЯ --- */
document.getElementById('backCuisine').addEventListener('click', () => showStep('step-time'));

document.getElementById('cuisineGrid').addEventListener('click', (e) => {
  const card = e.target.closest('.cuisine-card');
  if (!card) return;

  document.querySelectorAll('.cuisine-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  choice.cuisine = card.dataset.value;
  choice.cuisineName = card.querySelector('.cuisine-name').textContent;

  const list = document.getElementById('placeList');
  list.innerHTML = "";

  // Если выбрали "Свое предложение" — показываем поле ввода
  if (choice.cuisine === 'custom') {
    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Куда хочешь ты? 💕";
    input.className = "pretty-input";
    input.style.marginBottom = "20px";
    
    input.addEventListener('input', (e) => {
      choice.place = e.target.value;
      const confirmBtn = document.getElementById('btnConfirm');
      confirmBtn.style.display = choice.place.trim() ? 'block' : 'none';
    });
    
    list.appendChild(input);
  } else {
    PLACES[choice.cuisine].forEach(place => {
      const btn = document.createElement('button');
      btn.className = 'place-card';
      btn.textContent = place;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.place-card').forEach(p => p.classList.remove('selected'));
        btn.classList.add('selected');
        choice.place = place;

        const confirmBtn = document.getElementById('btnConfirm');
        confirmBtn.style.display = 'block';
        confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      list.appendChild(btn);
    });
  }

  showStep('step-place');
});

/* --- ШАГ 4: МЕСТО --- */
document.getElementById('backPlace').addEventListener('click', () => showStep('step-cuisine'));

/* --- ПОДТВЕРЖДЕНИЕ --- */
document.getElementById('btnConfirm').addEventListener('click', () => {
  if (!choice.date || !choice.time || !choice.cuisine || !choice.place) {
    alert("Что-то не заполнено 💕");
    return;
  }

  const dateRu = new Date(choice.date).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  document.getElementById('finalTitle').textContent = `Выходим в ${choice.place}! 💖`;
  document.getElementById('finalDetails').innerHTML =
    `📅 ${dateRu}<br>⏰ ${choice.time}<br>🍽 ${choice.cuisineName} кухня<br>📍 ${choice.place}`;

  showScreen('screen-final');
  startPixelReveal();

  // Отправка на почту
  sendEmail({
    date: dateRu,
    time: choice.time,
    cuisine: choice.cuisineName,
    place: choice.place
  });
});

/* ========== ПИКСЕЛЬНОЕ ПОЯВЛЕНИЕ ФОТО ========== */
function startPixelReveal() {
  const container = document.getElementById('finalPhoto');
  container.innerHTML = ""; 
  
  const canvas = document.createElement('canvas');
  const size = 260; // Размер круга (должен совпадать с CSS .final-photo)
  canvas.width = canvas.height = size;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Скрытый холст для обработки в оригинальном разрешении
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = FINAL_PHOTO;
  
  img.onload = () => {
    // 1. Вычисляем пропорции, чтобы фото не сплющилось
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;

    offCanvas.width = w;
    offCanvas.height = h;

    // 2. Рисуем фото на скрытом холсте
    offCtx.drawImage(img, 0, 0, w, h);

    // 3. Делаем фото черно-белым
    const imgData = offCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; 
      data[i] = avg; data[i + 1] = avg; data[i + 2] = avg; 
    }
    offCtx.putImageData(imgData, 0, 0);

    // --- ЭТАП 1: Огромные пиксели ---
    const pixelSize1 = 35; // Чем больше, тем крупнее квадраты
    drawPixelated(ctx, offCanvas, size, x, y, pixelSize1);

    // --- ЭТАП 2: Средние пиксели ---
    setTimeout(() => {
      const pixelSize2 = 15;
      drawPixelated(ctx, offCanvas, size, x, y, pixelSize2);
    }, 2000); // Через 2 секунды

    // --- ЭТАП 3: Четкое фото с эффектом "сборки" ---
    setTimeout(() => {
      startFinalAssembly(ctx, offCanvas, size, x, y);
    }, 4000); // Через 4 секунды
  };

  img.onerror = () => {
    console.error("Не удалось загрузить фото: " + FINAL_PHOTO);
    container.innerHTML = "<p style='color:white; font-size:14px;'>Фото не найдено :(</p>";
  };
}

// Вспомогательная функция для отрисовки крупных пикселей
function drawPixelated(ctx, sourceCanvas, size, x, y, pixelSize) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = Math.ceil(sourceCanvas.width / pixelSize);
  tempCanvas.height = Math.ceil(sourceCanvas.height / pixelSize);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.imageSmoothingEnabled = false;
  
  tempCtx.drawImage(sourceCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, x, y, sourceCanvas.width, sourceCanvas.height);
}

// Функция для красивой сборки фото из мелких пикселей в конце
function startFinalAssembly(ctx, sourceCanvas, size, x, y) {
  const pixelSize = 4; // Размер финальных кусочков
  const cols = Math.ceil(sourceCanvas.width / pixelSize);
  const rows = Math.ceil(sourceCanvas.height / pixelSize);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cols;
  tempCanvas.height = rows;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(sourceCanvas, 0, 0, cols, rows);
  
  const imgData = tempCtx.getImageData(0, 0, cols, rows).data;
  ctx.clearRect(0, 0, size, size);

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      cells.push({
        x: c, y: r,
        color: `rgb(${imgData[i]},${imgData[i]},${imgData[i]})` // Берем один канал, т.к. фото ЧБ
      });
    }
  }
  shuffle(cells);

  let idx = 0;
  const total = cells.length;
  const interval = setInterval(() => {
    for (let k = 0; k < 10 && idx < total; k++, idx++) {
      const cell = cells[idx];
      ctx.fillStyle = cell.color;
      ctx.fillRect(x + cell.x * pixelSize, y + cell.y * pixelSize, pixelSize, pixelSize);
    }
    if (idx >= total) clearInterval(interval);
  }, 20);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ========== ОТПРАВКА НА ПОЧТУ ========== */
function sendEmail(data) {
  fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      _subject: "💖 Она сказала ДА!",
      Дата: data.date,
      Время: data.time,
      Кухня: data.cuisine,
      Место: data.place
    })
  })
  .then(r => r.json())
  .then(res => console.log("Письмо отправлено:", res))
  .catch(err => console.error("Ошибка:", err));
}

/* Инициализация */
updateDisplay();