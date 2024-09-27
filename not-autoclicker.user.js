// ==UserScript==
// @name         Not Pixel Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.notpx.app/*
// @version      2.0
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Not-Pixel
// ==/UserScript==

// Ожидание элемента
function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback), 500);
  }
}

// Симуляция событий указателя
function simulatePointerEvents(element, startX, startY, endX, endY) {
  const events = [
    new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: endX, clientY: endY, bubbles: true }),
    new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true })
  ];

  events.forEach(event => element.dispatchEvent(event));
}

// Триггеры событий
function triggerEvents(element) {
  const events = [
      new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0.5, pointerType: "touch" }),
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new PointerEvent('pointerup', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new MouseEvent('mouseup', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new PointerEvent('click', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new PointerEvent('pointerout', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new PointerEvent('pointerleave', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new MouseEvent('mouseout', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new MouseEvent('mouseleave', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 })
  ];

  events.forEach((event, index) => {
      setTimeout(() => element.dispatchEvent(event), index * 100);
  });
} 

// Открытие окна рисования
function openPaintWindow() {
  waitForElement('#canvasHolder', (canvas) => {
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    simulatePointerEvents(canvas, centerX, centerY, centerX, centerY);
    console.log('Попытка открыть окно рисования');
  });
}

// Случайный клик
function randomClick() {
  if (isClickInProgress) {
      return;
  }

  isClickInProgress = true;

  checkPause();
  if (isAutoclickerPaused) {
      isClickInProgress = false;
      setTimeout(randomClick, 1000); // Проверка паузы
      return;
  }
  
  const paintButton = document.evaluate('//*[@id="root"]/div/div[5]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (paintButton) {
    const buttonText = paintButton.querySelector('span[class^="_button_text_"]').textContent;

    if (buttonText === 'Paint') {
      waitForElement('#canvasHolder', (canvas) => {
        // Случайное перемещение карты
        const moveX = Math.floor(Math.random() * 200) - 100; // От -100 до 100
        const moveY = Math.floor(Math.random() * 200) - 100; // От -100 до 100
        simulatePointerEvents(canvas, canvas.width / 2, canvas.height / 2, canvas.width / 2 + moveX, canvas.height / 2 + moveY);

        // Случайная точка для рисования
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        simulatePointerEvents(canvas, x, y, x, y);

        simulatePointerEvents(paintButton, 0, 0, 0, 0);
        const nextClickDelay = getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay);
        isClickInProgress = false;
        setTimeout(randomClick, nextClickDelay);
      });
    } else if (buttonText === 'No energy') {
      if (noEnergyTimeout === null) {
        const randomPause = getRandomDelay(GAME_SETTINGS.minPauseDuration, GAME_SETTINGS.maxPauseDuration);
        console.log(`Нет энергии. Рандомная пауза: ${randomPause} мс.`);
        noEnergyTimeout = setTimeout(() => {
          noEnergyTimeout = null;
          isClickInProgress = false;
          randomClick();
        }, randomPause);
      } else {
        isClickInProgress = false;
        setTimeout(randomClick, 1000); // Проверяем каждую секунду
      }
    } else {
      const nextClickDelay = getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay);
      isClickInProgress = false;
      setTimeout(randomClick, nextClickDelay);
    }
  } else {
    console.log('Окно рисования не найдено. Попытка открыть окно рисования.');
    openPaintWindow();
    isClickInProgress = false;
    setTimeout(randomClick, 2000);
  }
}

// Рандомная задержка
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Клик на кнопку "Okay, promise" и "Let’s Gooooooo!"
function clickOkayPromiseButton() {
  function tryClickOkayPromiseButton() {
      const okayPromiseButton = document.querySelector('button._button_1boq4_54');
      const letsGoButton = document.querySelector('button._button_1drph_81');
      
      if (okayPromiseButton && okayPromiseButton.textContent.includes('Okay, promise')) {
          triggerEvents(okayPromiseButton);
      }
      
      if (letsGoButton && letsGoButton.textContent.includes('Let’s Gooooooo!')) {
          triggerEvents(letsGoButton);
      }
      
      setTimeout(tryClickOkayPromiseButton, 3000);
  }

  tryClickOkayPromiseButton();
}

// Проверка на падение игры
function checkGameCrash() {
  const crashElement = document.querySelector('div._container_ieygs_8');
  if (crashElement) {
    console.log('Игра вылетела. Обновление страницы.');
    location.reload();
  } else {
    setTimeout(checkGameCrash, 2000);
  }
}

checkGameCrash();

// Запуск скрипта
function startScript() {
  openPaintWindow();
  setTimeout(randomClick, 2000);
}

startScript();

const GAME_SETTINGS = {
  minDelay: 1000, // 1 секунда
  maxDelay: 2000, // 2 секунды
  minPauseDuration: 60000, // 1 минута
  maxPauseDuration: 180000, // 3 минуты
  pauseUntil: null, // По умолчанию пауза не установлена
  autoClaimEnabled: false, // По умолчанию автозабор награды выключен
  autoClaimMinDelay: 120000, // 2 минуты
  autoClaimMaxDelay: 600000, // 10 минут
  autoChangeColorEnabled: false, // По умолчанию автосмена цвета выключена
  autoChangeColorMinDelay: 120000, // 2 минуты
  autoChangeColorMaxDelay: 600000 // 10 минут
};

// Автозабор награды
function autoClaimReward() {
  if (!GAME_SETTINGS.autoClaimEnabled) {
      return; // Автозабор отключен
  }

  function tryClaimReward() {
      const openRewardButton = document.querySelector('button._button_184v8_1');
      if (!openRewardButton) {
          setTimeout(tryClaimReward, 1000);
          return;
      }
      triggerEvents(openRewardButton);

      const loadingInfo = document.querySelector('div._container_3i6l4_1 > div._info_3i6l4_32');
      const claimButton = document.querySelector('button._button_3i6l4_11');

      if (loadingInfo && loadingInfo.textContent === 'Loading...') {
          setTimeout(() => {
              const loadingInfoCheck = document.querySelector('div._container_3i6l4_1 > div._info_3i6l4_32');
              if (loadingInfoCheck && loadingInfoCheck.textContent === 'Loading...') {
                  const exitButton = document.querySelector('button._button_1cryl_1');
                  if (exitButton) {
                      triggerEvents(exitButton);
                  }
                  const nextClaimDelay = getRandomDelay(GAME_SETTINGS.autoClaimMinDelay, GAME_SETTINGS.autoClaimMaxDelay);
                  console.log(`Следующая попытка получить награду через ${nextClaimDelay / 1000} секунд`);
                  setTimeout(tryClaimReward, nextClaimDelay);
              } else {
                  setTimeout(tryClaimReward, 1000);
              }
          }, 10000);
          return;
      }

      if (claimButton && claimButton.textContent.includes('Claim')) {
          triggerEvents(claimButton);
          console.log('Награда получена!');
      }

      const claimInInfo = document.querySelector('div._info_3i6l4_32');
      if (claimInInfo && claimInInfo.textContent.includes('CLAIM IN')) {
          const exitButton = document.querySelector('button._button_1cryl_1');
          if (exitButton) {
              triggerEvents(exitButton);
          }

          const nextClaimDelay = getRandomDelay(GAME_SETTINGS.autoClaimMinDelay, GAME_SETTINGS.autoClaimMaxDelay);
          console.log(`Следующая попытка получить награду через ${nextClaimDelay / 1000} секунд`);
          setTimeout(tryClaimReward, nextClaimDelay);
          return;
      }

      setTimeout(tryClaimReward, 1000);
  }

  tryClaimReward();
}

// Автосмена цвета
function changeColor() {
  if (!GAME_SETTINGS.autoChangeColorEnabled) {
      return; // Автосмена цвета отключена
  }

  function tryChangeColor() {
      // Проверяем состояние элемента
      const expandablePanel = document.querySelector('div._expandable_panel_layout_1v9vd_1');
      if (expandablePanel && expandablePanel.style.height !== '0px' && expandablePanel.style.opacity !== '0') {
          // Получаем список всех цветов
          const colors = document.querySelectorAll('div._color_item_epppt_22');
          if (colors.length === 0) {
              setTimeout(tryChangeColor, 1000);
              return;
          }

          // Выбираем случайный цвет из списка
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          // Нажимаем на случайный цвет
          console.log('Выбран новый цвет:', randomColor); // Логируем выбранный цвет
          setTimeout(() => triggerEvents(randomColor), 1000);

          // Применяем выбранный цвет
          setTimeout(() => triggerEvents(activeColor), 2000);
          return;
      }

      // Нажимаем на активный цвет
      const activeColor = document.evaluate('//*[@id="root"]/div/div[5]/div/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!activeColor) {
          setTimeout(tryChangeColor, 1000);
          return;
      }
      triggerEvents(activeColor);

      // Получаем список всех цветов
      const colors = document.querySelectorAll('div._color_item_epppt_22');
      if (colors.length === 0) {
          setTimeout(tryChangeColor, 1000);
          return;
      }

      // Выбираем случайный цвет из списка
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Нажимаем на случайный цвет
      console.log('Выбран новый цвет:', randomColor); // Логируем выбранный цвет
      setTimeout(() => triggerEvents(randomColor), 1000);

      // Применяем выбранный цвет
      setTimeout(() => triggerEvents(activeColor), 2000);
  }

  tryChangeColor();

  const nextChangeDelay = getRandomDelay(GAME_SETTINGS.autoChangeColorMinDelay, GAME_SETTINGS.autoChangeColorMaxDelay);
  console.log(`Следующая смена цвета через ${nextChangeDelay / 1000} секунд`);
  setTimeout(changeColor, nextChangeDelay);
}

// Запуск автозабора награды
function startAutoClaimReward() {
  if (GAME_SETTINGS.autoClaimEnabled) {
    console.log('Автозабор награды включен!');
    const initialDelay = getRandomDelay(GAME_SETTINGS.autoClaimMinDelay, GAME_SETTINGS.autoClaimMaxDelay);
    console.log(`Первая попытка получить награду через ${initialDelay / 1000} секунд`);
    setTimeout(autoClaimReward, initialDelay);
  }
}

// Запуск автосмены цвета
function startAutoChangeColor() {
  if (GAME_SETTINGS.autoChangeColorEnabled) {
      console.log('Автосмена цвета включена!');
      const initialDelay = getRandomDelay(GAME_SETTINGS.autoChangeColorMinDelay, GAME_SETTINGS.autoChangeColorMaxDelay);
      console.log(`Первая попытка смены цвета через ${initialDelay / 1000} секунд`);
      setTimeout(changeColor, initialDelay);
  }
}

const settingsMenu = document.createElement('div');
settingsMenu.className = 'settings-menu';
settingsMenu.style.display = 'none';

const menuTitle = document.createElement('h3');
menuTitle.className = 'settings-title';
menuTitle.textContent = 'Not Pixel Autoclicker';

const closeButton = document.createElement('button');
closeButton.className = 'settings-close-button';
closeButton.textContent = '×';
closeButton.onclick = () => {
  settingsMenu.style.display = 'none';
};

menuTitle.appendChild(closeButton);
settingsMenu.appendChild(menuTitle);

// Обновление настроек
function updateSettingsMenu() {
  document.getElementById('minDelay').value = GAME_SETTINGS.minDelay;
  document.getElementById('minDelayDisplay').textContent = GAME_SETTINGS.minDelay;
  document.getElementById('maxDelay').value = GAME_SETTINGS.maxDelay;
  document.getElementById('maxDelayDisplay').textContent = GAME_SETTINGS.maxDelay;
  document.getElementById('minPauseDuration').value = GAME_SETTINGS.minPauseDuration;
  document.getElementById('minPauseDurationDisplay').textContent = GAME_SETTINGS.minPauseDuration;
  document.getElementById('maxPauseDuration').value = GAME_SETTINGS.maxPauseDuration;
  document.getElementById('maxPauseDurationDisplay').textContent = GAME_SETTINGS.maxPauseDuration;
  document.getElementById('autoClaimEnabled').checked = GAME_SETTINGS.autoClaimEnabled;
  document.getElementById('autoChangeColorEnabled').checked = GAME_SETTINGS.autoChangeColorEnabled;
}

settingsMenu.appendChild(createSettingElement('Min delay (ms)', 'minDelay', 'range', 100, 5000, 100,
  'EN: Minimum delay between clicks.<br>' +
  'RU: Минимальная задержка между кликами.'));
settingsMenu.appendChild(createSettingElement('Max delay (ms)', 'maxDelay', 'range', 100, 15000, 100,
  'EN: Maximum delay between clicks.<br>' +
  'RU: Максимальная задержка между кликами.'));
settingsMenu.appendChild(createSettingElement('Min pause duration (ms)', 'minPauseDuration', 'range', 10000, 300000, 1000,
  'EN: Minimum pause duration when energy is low.<br>' +
  'RU: Минимальная длительность паузы при низкой энергии.'));
settingsMenu.appendChild(createSettingElement('Max pause duration (ms)', 'maxPauseDuration', 'range', 10000, 900000, 1000,
  'EN: Maximum pause duration when energy is low.<br>' +
  'RU: Максимальная длительность паузы при низкой энергии.'));
settingsMenu.appendChild(createCheckboxSetting('Enable Auto Claim', 'autoClaimEnabled',
  'EN: Automatically claims the reward when it is available.<br>' +
  'RU: Автоматически забирает награду, когда она доступна.'));
settingsMenu.appendChild(createCheckboxSetting('Enable Auto Change Color', 'autoChangeColorEnabled',
  'EN: Automatically changes the drawing color randomly.<br>' +
  'RU: Автоматически меняет цвет рисования на случайный.'));

const pauseResumeButton = document.createElement('button');
pauseResumeButton.textContent = 'Pause';
pauseResumeButton.className = 'pause-resume-btn';
pauseResumeButton.onclick = toggleAutoclicker;
pauseResumeButton.style.backgroundColor = '#98c379';
settingsMenu.appendChild(pauseResumeButton);

const socialButtons = document.createElement('div');
socialButtons.className = 'social-buttons';

const githubButton = document.createElement('a');
githubButton.href = 'https://github.com/mudachyo/Not-Pixel';
githubButton.target = '_blank';
githubButton.className = 'social-button';
githubButton.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADtklEQVR4nO2ZSWgVQRCGP2OCS3CJYoy7uCtiDi6o8aAIikvQi4oGvCiiRo2E6FXJQdxQg4LgUTx4cyPuHhVRD0bcsyDu4IJrTNTnSEMNPOfNm1czb2YSJD8UDNNT1fV3V1dX90AH/l8UAEuBfUAt8Bj4CLSKmOdH0ma+WQL0pp2gC1AGXAJ+A5ZPMToXgFViK3Z0AyqBVwGcTycvga1A17hILAAaQiTglHpgfpQEzNTXREjAKcdl5kNFf+BOjCQskVtAYVgkhst0W20kT8WHrNBP0qjVxtIAFAUl0bWNwsnyCLNAKfpoO3DecsjhICnWy+B2CbspwA7gWRbOmd1+G1As1cGBDN/P05LoptgnBruEoSH0A7gKVACzgNFAvsgYebcROAN8BTYDnR22ihWLXxVilYpRTLf75mlHy+PbAYr+zUB5oouy7Ah9o0pCkaL/F5lmpUwZ1+MiJFKi9GGll5FLSiPLIyRSrvThfDoDBT5K8eoIiRxT+vAL6OlmYKnSwGdZkFFhPPBT6Uupm4H9SmWT56PGSaUve92Ua5XK02Igskzpy1k35afKuMyNgchYJRFT0KbgvULRfBMHhiiJvHNTblUomm86xUBkoiMKPor8cfjT4qZsZ4rZUu+MAPoAA+XZljiIJCNXtoYC6dtUFYOSBjYFn6TxJnAXaJRQeiPPtqwgehz2iIrvScvAzFIKnkjjNUmxWyRPm4p1khw37VGJGjnS11BggmTKRVI575a7MPsIkIKL0rhLqsuDwCngOlAns/FBpnN1xLPRIqPdBDwAbgPngCNyFtrvVaZUKzOFkW8yU2FjncuC9pKdbkbm+jBgpBlYE1KomZJ8j08SRua4GeuuTMFOuSFryXnS0yBfBqMxQL8tXucie504xZxT1soGlM7wW+AEsEFGaiTQK8l2XznHmOvQKikvvgYgYImYkiotSj1SXomcwd8qw65KbihtFMq75iyct5JkYaa015RGsU7apwJfMpAwpNOhJAQy9eKLJyo8DJhcbpcQFyU07J84z4ErwOJMHQDrsyRSrr3duBckLn0gx6MPK4Pc9VOBzwQSLkYSIe4fGwKQSADT/XZ0JI2xT3KxNlgTpx4YFYBITZCO8qTu8tNRZ5/2/di+7PMC8B/09BnLfqG1+yCMP8DDgIdtSOS+nBhDQQ+pNOMmciWKf/F5UmInYiCSAA5FfdExWc4HURGpA2YQE3IlBTc4fvj7xeskfWNrU0zXTSnIkbLldFL54gelorswyz2pAx0gIvwFLXDNiM6zHVAAAAAASUVORK5CYII=">GitHub';
socialButtons.appendChild(githubButton);

const telegramButton = document.createElement('a');
telegramButton.href = 'https://t.me/shopalenka';
telegramButton.target = '_blank';
telegramButton.className = 'social-button';
telegramButton.innerHTML = '<img src="data:image/png;base64,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">Telegram Channel';
socialButtons.appendChild(telegramButton);

settingsMenu.appendChild(socialButtons);

document.body.appendChild(settingsMenu);

const settingsButton = document.createElement('button');
settingsButton.className = 'settings-button';
settingsButton.textContent = '⚙️';
settingsButton.onclick = () => {
  settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
};
settingsButton.ontouchstart = (e) => {
  e.preventDefault();
  settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
};
document.body.appendChild(settingsButton);

const style = document.createElement('style');
style.textContent = `
  .settings-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(40, 44, 52, 0.95);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      color: #abb2bf;
      font-family: 'Arial', sans-serif;
      z-index: 10000;
      padding: 20px;
      width: 300px;
  }
  .settings-title {
      color: #61afef;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
  .settings-close-button {
      background: none;
      border: none;
      color: #e06c75;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
  }
  .setting-item {
      margin-bottom: 12px;
  }
  .setting-label {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
  }

  .checkbox-label { /* Стили для label чекбокса */
      cursor: pointer; /* Добавляем курсор "указатель" */
      user-select: none; /* Отключаем выделение текста */
  }

  .setting-label-text {
      color: #e5c07b;
      margin-right: 5px;
  }
  .help-icon {
      cursor: help;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #61afef;
      color: #282c34;
      font-size: 10px;
      font-weight: bold;
  }
  .setting-input {
      display: flex;
      align-items: center;
  }
  .setting-slider {
      flex-grow: 1;
      margin-right: 8px;
  }
  .setting-value {
      min-width: 30px;
      text-align: right;
      font-size: 11px;
  }
  .tooltip {
      position: relative;
  }
  .tooltip .tooltiptext {
      visibility: hidden;
      width: 200px;
      background-color: #4b5263;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      margin-left: -100px;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 11px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
  }
  .pause-resume-btn {
      display: block;
      width: calc(100% - 10px);
      padding: 8px;
      margin: 15px 5px;
      background-color: #98c379;
      color: #282c34;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: background-color 0.3s;
  }
  .pause-resume-btn:hover {
      background-color: #7cb668;
  }
  .social-buttons {
      margin-top: 15px;
      display: flex;
      justify-content: space-around;
      white-space: nowrap;
  }
  .social-button {
      display: inline-flex;
      align-items: center;
      padding: 5px 8px;
      border-radius: 4px;
      background-color: #282c34;
      color: #abb2bf;
      text-decoration: none;
      font-size: 12px;
      transition: background-color 0.3s;
  }
  .social-button:hover {
      background-color: #4b5263;
  }
  .social-button img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
  }
  .settings-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: rgba(36, 146, 255, 0.8);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      touch-action: manipulation;
  }
  .pause-button {
      position: fixed;
      bottom: 20px;
      right: 70px;
      background-color: rgba(255, 193, 7, 0.8);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 9999;
  }
  .pause-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(40, 44, 52, 0.95);
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      color: #dcdfe4;
      font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
      z-index: 10001;
      padding: 25px;
      width: 320px;
      text-align: center;
      transition: all 0.3s ease;
      opacity: 0;
      visibility: hidden;
  }

  .pause-menu h3 {
      color: #61dafb;
      margin-bottom: 15px;
      font-size: 1.4em;
  }

  .pause-menu input, .pause-menu button {
      margin: 12px 0;
      width: 100%;
      padding: 10px;
      border: 1px solid #3e4451;
      border-radius: 6px;
      font-size: 1em;
      transition: all 0.3s ease;
      box-sizing: border-box;
  }

  .pause-menu input {
      background-color: #2c313c;
      color: #abb2bf;
      text-align: center;
  }

  .pause-menu button {
      background-color: #61dafb;
      color: #282c34;
      cursor: pointer;
      font-weight: bold;
  }

  .pause-menu button:hover {
      background-color: #4ab2e1;
  }

  .pause-menu.show {
      opacity: 1;
      visibility: visible;
  }

`;
document.head.appendChild(style);

// Создание элемента настройки
function createSettingElement(label, id, type, min, max, step, tooltipText) {
  const container = document.createElement('div');
  container.className = 'setting-item';

  const labelContainer = document.createElement('div');
  labelContainer.className = 'setting-label';

  const labelElement = document.createElement('span');
  labelElement.className = 'setting-label-text';
  labelElement.textContent = label;

  const helpIcon = document.createElement('span');
  helpIcon.textContent = '?';
  helpIcon.className = 'help-icon tooltip';

  const tooltipSpan = document.createElement('span');
  tooltipSpan.className = 'tooltiptext';
  tooltipSpan.innerHTML = tooltipText;
  helpIcon.appendChild(tooltipSpan);

  labelContainer.appendChild(labelElement);
  labelContainer.appendChild(helpIcon);

  const inputContainer = document.createElement('div');
  inputContainer.className = 'setting-input';

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = GAME_SETTINGS[id];
  input.className = 'setting-slider';

  const valueDisplay = document.createElement('span');
  valueDisplay.id = `${id}Display`;
  valueDisplay.textContent = GAME_SETTINGS[id];
  valueDisplay.className = 'setting-value';

  input.addEventListener('input', (e) => {
      GAME_SETTINGS[id] = parseFloat(e.target.value);
      valueDisplay.textContent = e.target.value;
      saveSettings();
  });

  inputContainer.appendChild(input);
  inputContainer.appendChild(valueDisplay);

  container.appendChild(labelContainer);
  container.appendChild(inputContainer);
  return container;
}

// Создание элемента чекбокса
function createCheckboxSetting(label, id, tooltipText) {
  const container = document.createElement('div');
  container.className = 'setting-item';

  const labelContainer = document.createElement('label');
  labelContainer.className = 'setting-label checkbox-label';
  labelContainer.htmlFor = id; // Связываем label с checkbox

  const labelElement = document.createElement('span');
  labelElement.className = 'setting-label-text';
  labelElement.textContent = label;

  const helpIcon = document.createElement('span');
  helpIcon.textContent = '?';
  helpIcon.className = 'help-icon tooltip';

  const tooltipSpan = document.createElement('span');
  tooltipSpan.className = 'tooltiptext';
  tooltipSpan.innerHTML = tooltipText;
  helpIcon.appendChild(tooltipSpan);

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.checked = GAME_SETTINGS[id]; // Загружаем сохраненное значение

  input.addEventListener('change', (e) => {
    GAME_SETTINGS[id] = e.target.checked;
    saveSettings();

    if (id === 'autoClaimEnabled') {
      if (GAME_SETTINGS.autoClaimEnabled) {
        console.log('Автозабор награды включен!');
        startAutoClaimReward();
      } else {
        console.log('Автозабор награды выключен!');
      }
    }
  });

  input.addEventListener('change', (e) => {
      GAME_SETTINGS[id] = e.target.checked;
      saveSettings();
  
      if (id === 'autoChangeColorEnabled' && GAME_SETTINGS.autoChangeColorEnabled) {
          console.log('Автосмена цвета включена!');
          changeColor(); // Запуск смены цвета
      } else {
          console.log('Автосмена цвета выключена!');
      }
  });

  labelContainer.appendChild(input);
  labelContainer.appendChild(labelElement);
  labelContainer.appendChild(helpIcon);

  container.appendChild(labelContainer);
  return container;
}

// Сохранение настроек
function saveSettings() {
  localStorage.setItem('NotPixelAutoclickerSettings', JSON.stringify(GAME_SETTINGS));
}

// Загрузка настроек
function loadSettings() {
  const savedSettings = localStorage.getItem('NotPixelAutoclickerSettings');
  if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      Object.assign(GAME_SETTINGS, parsedSettings);
  }
  updateSettingsMenu();
  updatePauseButton();
}

// Флаги для управления автокликером
let isClickInProgress = false;
let isAutoclickerPaused = false;
let noEnergyTimeout = null;

// Переключение паузы
function toggleAutoclicker() {
  isAutoclickerPaused = !isAutoclickerPaused;
  updatePauseResumeButton();
  
  if (!isAutoclickerPaused) {
      setTimeout(randomClick, getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay));
  }
}

// Обновление кнопки паузы
function updatePauseResumeButton() {
  pauseResumeButton.textContent = isAutoclickerPaused ? 'Resume' : 'Pause';
  pauseResumeButton.style.backgroundColor = isAutoclickerPaused ? '#e5c07b' : '#98c379';
}

const pauseButton = document.createElement('button');
pauseButton.className = 'pause-button';
pauseButton.textContent = '⏸️';
pauseButton.onclick = () => {
  if (pauseMenu.classList.contains('show')) {
      hidePauseMenu();
  } else {
      showPauseMenu();
  }
};
document.body.appendChild(pauseButton);

const pauseMenu = document.createElement('div');
pauseMenu.className = 'pause-menu';
pauseMenu.innerHTML = `
  <h3>Pause until:</h3>
  <input type="datetime-local" id="pauseDateTime">
  <button id="cancelPause">Cancel</button>
  <button id="acceptPause">Apply</button>
`;
document.body.appendChild(pauseMenu);

function showPauseMenu() {
  pauseMenu.classList.add('show');
}

function hidePauseMenu() {
  pauseMenu.classList.remove('show');
}

document.getElementById('cancelPause').addEventListener('click', () => {
  GAME_SETTINGS.pauseUntil = null;
  saveSettings();
  hidePauseMenu();
  updatePauseButton();
});

document.getElementById('acceptPause').addEventListener('click', () => {
  const pauseDateTime = document.getElementById('pauseDateTime').value;
  if (pauseDateTime) {
      GAME_SETTINGS.pauseUntil = new Date(pauseDateTime).getTime();
      saveSettings();
      hidePauseMenu();
      updatePauseButton();
  }
});

// Обновление кнопки паузы
function updatePauseButton() {
  if (GAME_SETTINGS.pauseUntil && GAME_SETTINGS.pauseUntil > Date.now()) {
      pauseButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
      pauseButton.textContent = '▶️';
  } else {
      pauseButton.style.backgroundColor = 'rgba(255, 193, 7, 0.8)';
      pauseButton.textContent = '⏸️';
  }
}

// Проверка на паузу
function checkPause() {
  if (GAME_SETTINGS.pauseUntil) {
      if (Date.now() >= GAME_SETTINGS.pauseUntil) {
          console.log("Пауза закончилась. Возобновление работы автокликера.");
          GAME_SETTINGS.pauseUntil = null;
          isAutoclickerPaused = false;
          saveSettings();
          updatePauseButton();
          updateSettingsMenu();
          updatePauseResumeButton();
          setTimeout(randomClick, getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay));
      } else {
          isAutoclickerPaused = true;
      }
  }
  updatePauseResumeButton();
}

// Инициализация скрипта
function initializeScript() {
  loadSettings(); // Загрузка настроек
  updateSettingsMenu(); // Обновление меню настроек
  updatePauseButton(); // Обновление кнопки паузы
  startScript(); // Запуск автокликера
  startAutoClaimReward(); // Автозабор награды
  clickOkayPromiseButton(); // Нажатие на кнопки "Okay, promise" и "Let’s Gooooooo!"
  startAutoChangeColor(); // Автосмена цвета
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScript);
} else {
  initializeScript();
}