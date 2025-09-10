document.addEventListener('DOMContentLoaded', function() {
  // --- Ваш основной код ---
  const homeworkContent = document.getElementById('homework-content');
  const editSection = document.getElementById('edit-section');
  const homeworkText = document.getElementById('homework-text');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const editBtn = document.getElementById('edit-btn');
  const applyBtn = document.getElementById('apply-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const errorElement = document.getElementById('error');

  let currentHomework = null;
  let selectedFiles = [];

  const API_BASE_URL = 'https://backend-production-cf98.up.railway.app/api'; // для локального теста

  // --- Загрузка сохраненных данных с сервера ---
  async function loadHomework() {
    try {
      const response = await fetch(`${API_BASE_URL}/homework/ofg`);
      if (response.status === 404) {
        homeworkContent.innerHTML = '<p class="no-homework">Домашнее задание не добавлено</p>';
        return;
      }
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      currentHomework = await response.json();
      selectedFiles = currentHomework.files || [];
      displayHomework();
    } catch (error) {
      console.error('Error loading homework:', error);
      errorElement.textContent = 'Ошибка загрузки данных. Проверьте подключение к интернету.';
    }
  }

  // --- Отображение текущего ДЗ ---
  function displayHomework() {
    if (!currentHomework) {
      homeworkContent.innerHTML = '<p class="no-homework">Домашнее задание не добавлено</p>';
      return;
    }
    let content = '';
    if (currentHomework.text) {
      content += `<p>${currentHomework.text}</p>`;
    }
    if (currentHomework.files && currentHomework.files.length > 0) {
      content += '<div class="files-container">';
      currentHomework.files.forEach(file => {
        if (file.type.startsWith('image/')) {
          content += `
            <div class="file-item">
              <img src="${file.url}" alt="Домашнее задание" class="homework-image">
              <span class="file-name">${file.name}</span>
            </div>
          `;
        } else {
          content += `
            <div class="file-item">
              <a href="${file.url}" target="_blank" class="homework-file">
                📄 ${file.name}
              </a>
            </div>
          `;
        }
      });
      content += '</div>';
    }
    content += `<p class="update-time">Обновлено: ${currentHomework.updated_at}</p>`;
    homeworkContent.innerHTML = content;
  }

  // --- Режим редактирования ---
  editBtn.addEventListener('click', function() {
    editSection.style.display = 'block';
    editBtn.style.display = 'none';
    applyBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    if (currentHomework) {
      homeworkText.value = currentHomework.text || '';
      selectedFiles = currentHomework.files || [];
      updateFilePreview();
    }
  });

  // --- Отмена редактирования ---
  cancelBtn.addEventListener('click', function() {
    editSection.style.display = 'none';
    editBtn.style.display = 'inline-block';
    applyBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    homeworkText.value = '';
    selectedFiles = [];
    filePreview.innerHTML = '';
    errorElement.textContent = '';
  });

  // --- Применение изменений ---
  applyBtn.addEventListener('click', async function() {
    const text = homeworkText.value.trim();
    if (!text && selectedFiles.length === 0) {
      errorElement.textContent = 'Добавьте текст или файл домашнего задания';
      return;
    }
    errorElement.textContent = '';
    const homeworkData = {
      text: text,
      files: selectedFiles,
      updated_at: new Date().toISOString()
    };
    try {
      const response = await fetch(`${API_BASE_URL}/homework/ofg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeworkData)
      });
      if (!response.ok) {
        throw new Error('Ошибка сохранения данных');
      }
      currentHomework = homeworkData;
      displayHomework();
      cancelBtn.click();
    } catch (error) {
      console.error('Error saving homework:', error);
      errorElement.textContent = 'Ошибка сохранения данных. Попробуйте еще раз.';
    }
  });

  // --- Загрузка файлов ---
  fileInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const fileData = {
          name: file.name,
          type: file.type,
          url: e.target.result
        };
        selectedFiles.push(fileData);
        updateFilePreview();
      };
      reader.readAsDataURL(file);
    });
  });

  // --- Обновление превью файлов ---
  function updateFilePreview() {
    filePreview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item-preview';
      if (file.type.startsWith('image/')) {
        fileItem.innerHTML = `
          <div class="file-preview-content">
            <span class="file-emoji">🖼️</span>
            <span class="file-name">${file.name}</span>
            <button class="remove-btn" onclick="removeFile(${index})">×</button>
          </div>
        `;
      } else {
        fileItem.innerHTML = `
          <div class="file-preview-content">
            <span class="file-emoji">📄</span>
            <span class="file-name">${file.name}</span>
            <button class="remove-btn" onclick="removeFile(${index})">×</button>
          </div>
        `;
      }
      filePreview.appendChild(fileItem);
    });
  }

  // --- Обработчик перехода по предметам ---
  const subjectLinks = {
    'button-cp': '../CP/CP.html', // вставьте ссылку на КП
    'button-it': '../IT/IT.html', // вставьте ссылку на ИТ
    'button-engl113': '../engl113/engl113.html', // вставьте ссылку на Англ. 113
    'button-engl208': '../engl208/engl208.html', // вставьте ссылку на Англ. 208
    'button-math': '../math/math.html', // вставьте ссылку на математику
    'button-oap': '../oap/oap.html', // вставьте ссылку на ОАП
    'button-oss': '../oss/oss.html', // вставьте ссылку на ОСС
    'button-ofg': '../ofg/ofg.html', // вставьте ссылку на ОФГ
    'button-bjd': '../bjd/bjd.html', // вставьте ссылку на БЖД
    'button-op1c': '../op1c/op1c.html', // вставьте ссылку на ОП 1C
    'button-cg': '../CG/CG.html'
  };
  Object.keys(subjectLinks).forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() {
        const link = subjectLinks[id];
        if (link) {
          window.location.href = link;
        } else {
          alert('Ссылка для этого предмета не указана');
        }
      });
    }
  });

  // --- Удаление файла ---
  window.removeFile = function(index) {
    selectedFiles.splice(index, 1);
    updateFilePreview();
  };

  // --- Загружаем данные при старте ---
  loadHomework();
});