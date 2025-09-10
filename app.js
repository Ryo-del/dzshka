// Данные о предметах и днях недели
const subjects = [
  { 
    name: "Компьютерная графика", 
    emoji: "🎨",
    days: [1,3],
    link: "CG/CG.html"
  },
  { 
    name: "Информационные технологии", 
    emoji: "💻",
    days: [1,4,6],
    link: "IT/IT.html"
  },
  { 
    name: "Элементы высш. матем.", 
    emoji: "📊",
    days: [1,6],
    link: "math/math.html"
  },
  { 
    name: "Английский язык 113", 
    emoji: "🇬🇧",
    days: [3],
    link: "engl113/engl113.html"
  },
    { 
    name: "Коммуникативный практикум", 
    emoji: "💬",
    days: [5],
    link: "CP/CP.html"
  },
    { 
    name: "Английский язык 208", 
    emoji: "🇬🇧",
    days: [3],
    link: "engl208/engl208.html"
  },
  { 
    name: "ОАП", 
    emoji: "👨‍💻",
    days: [2,4],
    link: "oap/oap.html"
  },
  { 
    name: "ОСС", 
    emoji: "⚙️",
    days: [2,4,5]
    ,link: "oss/oss.html"
  },
  { 
    name: "ОФГ", 
    emoji: "💰",
    days: [4],
    link: "ofg/ofg.html"
  },
  { 
    name: "БЖД", 
    emoji: "🚨",
    days: [5],
    link: "bjd/bjd.html"
  },
  { 
    name: "ОП 1C", 
    emoji: "1С",
    days: [4,6],
    link: "op1c/op1c.html"
  }
];

// Русские названия дней недели
const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Функция для форматирования даты
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
}

// Функция для вычисления следующей даты для заданных дней недели
function getNextDayDate(daysArray) {
  const today = new Date();
  const todayDay = today.getDay();
  
  let minDiff = 7;
  
  daysArray.forEach(day => {
    let diff = day - todayDay;
    if (diff < 0) diff += 7;
    
    if (diff === 0) {
      // Если сегодня этот день, всегда показываем следующий раз
      diff = 7;
    }
    
    if (diff < minDiff) {
      minDiff = diff;
    }
  });
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + minDiff);
  return nextDate;
}

// Функция для определения отображаемого текста
function getDisplayText(daysArray) {
  const today = new Date();
  const nextDate = getNextDayDate(daysArray);
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Сегодня';
  } else if (diffDays === 1) {
    return 'Завтра';
  } else if (diffDays === 2) {
    return 'Послезавтра';
  } else if (diffDays < 7) {
    return daysOfWeek[nextDate.getDay()];
  } else {
    return formatDate(nextDate);
  }
}

// Функция для отображения текущей даты
function displayCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = now.toLocaleDateString('ru-RU', options);
}

// Функция для обновления индикатора текущего дня
function updateDayIndicator() {
  const today = new Date().getDay();
  document.querySelectorAll('.day-dot').forEach(dot => {
    const day = parseInt(dot.getAttribute('data-day'));
    dot.classList.toggle('active', day === today);
  });
}

// Функция для отрисовки списка предметов
function renderSubjects() {
  const workList = document.getElementById('work-list');
  workList.innerHTML = '';
  
  // Сортируем предметы по дням недели
  const sortedSubjects = [...subjects].sort((a, b) => {
    const nextDateA = getNextDayDate(a.days);
    const nextDateB = getNextDayDate(b.days);
    return nextDateA - nextDateB;
  });
  
  if (sortedSubjects.length === 0) {
    workList.innerHTML = '<div class="no-results">Предметы не найдены</div>';
    return;
  }
  
  sortedSubjects.forEach(subject => {
    const displayText = getDisplayText(subject.days);
    const daysText = Array.isArray(subject.days) 
      ? subject.days.map(day => shortDays[day]).join(', ')
      : shortDays[subject.days];
    
    const card = document.createElement('div');
    card.className = 'work-card';
    card.innerHTML = `
      <p class="work-avatar">${subject.emoji}</p>
      <div class="work-info">
        <p class="work-name">${subject.name}</p>
        <p class="work-time">${displayText}</p>
        <p class="work-days">Дни: ${daysText}</p>
      </div>
    `;
    

if (subject.link) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    if (window.Telegram && Telegram.WebApp) {
      // Открываем внутри Web App
      e.preventDefault();
      if (subject.link.startsWith('http')) {
        // Для внешних ссылок
        Telegram.WebApp.openLink(subject.link);
      } else {
        // Для внутренних страниц
        Telegram.WebApp.openTelegramLink(subject.link);
      }
    } else {
      // Если не в Web App, открываем обычным способом
      window.location.href = subject.link;
    }
  });
}
    
    workList.appendChild(card);
  });
} // ← Эту закрывающую скобку нужно добавить

// Проверяем, открыто ли в Telegram Web App
function initTelegramWebApp() {
    if (window.Telegram && Telegram.WebApp) {
        // Инициализация Web App
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Основная кнопка для отправки данных
        Telegram.WebApp.MainButton.setText("Отправить данные")
            .show()
            .onClick(() => {
                const data = {
                    action: "schedule_data",
                    timestamp: new Date().toISOString()
                };
                Telegram.WebApp.sendData(JSON.stringify(data));
            });
        
        return true;
    }
    return false;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const isTelegram = initTelegramWebApp();
    
    // Ваш существующий код
    displayCurrentDate();
    updateDayIndicator();
    renderSubjects();
    
    // Поиск
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredSubjects = subjects.filter(subject => 
            subject.name.toLowerCase().includes(query)
        );
        
        const originalSubjects = [...subjects];
        subjects.length = 0;
        subjects.push(...filteredSubjects);
        renderSubjects();
        subjects.length = 0;
        subjects.push(...originalSubjects);
    });
});
// Обновление каждые 10 минут
setInterval(() => {
  updateDayIndicator();
  renderSubjects();
}, 600000);