// ==UserScript==
// @name         Not Pixel Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*notpx.app/*
// @version      1.1
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Not-Pixel/raw/main/not-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Not-Pixel
// ==/UserScript==

function simulateClick(element, x, y) {
	const rect = element.getBoundingClientRect();
	const events = [
	  new PointerEvent('pointerdown', { clientX: x, clientY: y, bubbles: true }),
	  new PointerEvent('pointerup', { clientX: x, clientY: y, bubbles: true }),
	  new MouseEvent('mouseup', { clientX: x, clientY: y, bubbles: true }),
	  new PointerEvent('click', { clientX: x, clientY: y, bubbles: true })
	];

	events.forEach(event => element.dispatchEvent(event));
  }

  function moveMap() {
	const canvas = document.getElementById('canvasHolder');
	const maxMove = Math.min(canvas.width, canvas.height) * 0.15; // Движение до 15% от размера экрана
	const startX = Math.floor(Math.random() * canvas.width);
	const startY = Math.floor(Math.random() * canvas.height);
	const endX = Math.max(0, Math.min(canvas.width, startX + (Math.random() - 0.5) * maxMove * 2));
	const endY = Math.max(0, Math.min(canvas.height, startY + (Math.random() - 0.5) * maxMove * 2));

	const pointerDownEvent = new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true });
	const pointerMoveEvent = new PointerEvent('pointermove', { clientX: endX, clientY: endY, bubbles: true });
	const pointerUpEvent = new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true });

	canvas.dispatchEvent(pointerDownEvent);
	canvas.dispatchEvent(pointerMoveEvent);
	canvas.dispatchEvent(pointerUpEvent);
  }

  function openPaintWindow() {
	const canvas = document.getElementById('canvasHolder');
	if (canvas) {
	  const centerX = Math.floor(canvas.width / 2);
	  const centerY = Math.floor(canvas.height / 2);
	  simulateClick(canvas, centerX, centerY);
	  console.log('Попытка открыть окно рисования');
	}
  }

  function randomClick() {
	const paintButton = document.querySelector('button._button_ihilj_146');

	if (paintButton) {
	  const buttonText = paintButton.querySelector('._button_text_ihilj_170').textContent;

	  if (buttonText === 'Paint') {
		moveMap();
		const canvas = document.getElementById('canvasHolder');
		const x = Math.floor(Math.random() * canvas.width);
		const y = Math.floor(Math.random() * canvas.height);
		simulateClick(canvas, x, y);
		simulateClick(paintButton, 0, 0);
		const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
		setTimeout(randomClick, nextClickDelay);
	  } else if (buttonText === 'No energy') {
		console.log('Нет энергии. Пауза на 1 минуту.');
		setTimeout(randomClick, 60000);
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

  function startScript() {
	openPaintWindow();
	setTimeout(randomClick, 2000);
  }

  startScript();
  randomClick();