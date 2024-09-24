// ==UserScript==
// @name         Not Pixel Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*notpx.app/*
// @version      1.7
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Not-Pixel
// ==/UserScript==

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback), 500);
  }
}

function simulatePointerEvents(element, startX, startY, endX, endY) {
  const events = [
    new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: endX, clientY: endY, bubbles: true }),
    new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true })
  ];

  events.forEach(event => element.dispatchEvent(event));
}

function openPaintWindow() {
  waitForElement('#canvasHolder', (canvas) => {
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    simulatePointerEvents(canvas, centerX, centerY, centerX, centerY);
    console.log('Попытка открыть окно рисования');
  });
}

function randomClick() {
  if (isPaused()) {
    console.log('Скрипт на паузе.');
    setTimeout(randomClick, 1000);
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
        const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
        setTimeout(randomClick, nextClickDelay);
      });
    } else if (buttonText === 'No energy') {
      const randomPause = Math.floor(Math.random() * 120000) + 60000; // От 60000 мс (1 минута) до 180000 мс (3 минуты)
      console.log(`Нет энергии. Рандомная пауза: ${randomPause} мс.`);
      setTimeout(randomClick, randomPause);
    } else {
      const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
      setTimeout(randomClick, nextClickDelay);
    }
  } else {
    console.log('Окно рисования не найдено. Попытка открыть.');
    openPaintWindow();
    setTimeout(randomClick, 2000);
  }
}

function checkGameCrash() {
  if (isPaused()) {
    setTimeout(checkGameCrash, 2000);
    return;
  }

  const crashElement = document.querySelector('div._container_ieygs_8');
  if (crashElement) {
    console.log('Игра вылетела. Обновление страницы.');
    location.reload();
  } else {
    setTimeout(checkGameCrash, 2000);
  }
}

function isPaused() {
  const pauseUntil = localStorage.getItem('pauseUntil');
  if (pauseUntil) {
    const pauseUntilDate = new Date(pauseUntil);
    return pauseUntilDate > new Date();
  }
  return false;
}

function createPauseButton() {
  const button = document.createElement('button');
  button.textContent = 'Pause';
  button.style.position = 'fixed';
  button.style.color = 'black';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = 1000;
  button.style.backgroundColor = '#f0f0f0';
  button.style.borderRadius = '5px';
  button.addEventListener('click', () => {
    const existingContainer = document.querySelector('.pause-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    } else {
      const pauseUntil = promptForDate();
      if (pauseUntil) {
        localStorage.setItem('pauseUntil', pauseUntil.toISOString());
      }
    }
  });
  document.body.appendChild(button);
}

function promptForDate() {
  const container = document.createElement('div');
  container.className = 'pause-container';
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.backgroundColor = 'white';
  container.style.padding = '20px';
  container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  container.style.zIndex = 1001;

  const input = document.createElement('input');
  input.type = 'datetime-local';
  input.style.marginBottom = '10px';
  container.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'OK';
  button.style.color = 'black';
  button.addEventListener('click', () => {
    const date = new Date(input.value);
    if (!isNaN(date)) {
      localStorage.setItem('pauseUntil', date.toISOString());
      document.body.removeChild(container);
    } else {
      alert('Неверная дата');
    }
  });
  container.appendChild(button);

  document.body.appendChild(container);
}

function startScript() {
  createPauseButton();
  openPaintWindow();
  setTimeout(randomClick, 2000);
  checkGameCrash();
}

startScript();
