'use strict';

requirejs.config({
	baseUrl: 'js'
});

define([
	'hotel-list'
	], function(HotelList) {

	// создание объекта HotelList
	var hotelList = new HotelList;


	// работа с формой
	var MIN_DAYS = 1; // константа минимального количества дней в бронировании
	// подтягивание годы формы из DOM
	var pageForm = document.querySelector('.page-form');
	// подтягивание инпутов из DOM
	var arrivalInput = pageForm.querySelector('[name="date-arrival"]');
	var departureInput = pageForm.querySelector('[name="date-departure"]');
	// подтягивание кнопки из DOM
	var formButton = document.querySelector('.page-form__button');
	// подтягивание ноды для отрисовки дат на страницу
	var dateContainer = document.querySelector('.hotel-list__date');
	// текущая дата
	var now = new Date();

	// установка min и value в поле Дата заезда
	arrivalInput.min = formatDate(now);
	arrivalInput.value = formatDate(now);

	// увеличение даты на минимальный период бронирования
	now.setDate(now.getDate() + MIN_DAYS);

	// установка min и value в поле Дата выезда
	departureInput.min = formatDate(now);
	departureInput.value = formatDate(now);

	// обработчик изменения Даты заезда
	arrivalInput.addEventListener('change', function() {
		var newDate = arrivalInput.value;
		var newDate = new Date(newDate);
		newDate.setDate(newDate.getDate() + MIN_DAYS);
		departureInput.min = formatDate(newDate);
		departureInput.value = formatDate(newDate);
	});

	// обработчик кликов по кнопке формы
	formButton.addEventListener('click', function(evt) {
		evt.preventDefault();
		var dateArrival = new Date(arrivalInput.value);
		dateArrival = formatDateOutput(dateArrival);
		var dateDeparture = new Date(departureInput.value);
		dateDeparture = formatDateOutput(dateDeparture);
		
		dateContainer.innerHTML = dateArrival + ' - ' + dateDeparture;

		hotelList.setActiveFilter('filter-reset');
	});

	// функция форматирования даты для установки min, max, value в инпуты
	function formatDate(date) {
		var arr = new Array(date.getFullYear(), date.getMonth(), date.getDate());

		arr[1] = parseInt(arr[1]) + 1;

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].toString().length == 1) arr[i] = "0" + arr[i];
		};

		return arr[0] + "-" + arr[1] + "-" + arr[2];
	};

	// функция форматирования даты для вывода
	function formatDateOutput(date) {
		/**
		 * Массив соответствий месяцев.
		 * @enum {string}
		 */
		var months = {
			'0':  'января',
			'1':  'февраля',
			'2':  'марта',
			'3':  'апреля',
			'4':  'мая',
			'5':  'июня',
			'6':  'июля',
			'7':  'августа',
			'8':  'сентября',
			'9':  'октября',
			'10': 'ноября',
			'11': 'декабря' 
		};

		var arr = new Array(date.getDate(), date.getMonth());

		if (arr[0].toString().length == 1) arr[0] = "0" + arr[0];

		return arr[0] + " " + months[arr[1]];
	};


	// делегирование обработки событий клика по фильтрам блоку с фильтрами
	var filters = document.querySelector('.hotel-list__filters');
	filters.addEventListener('click', function(evt) {
		evt.preventDefault();
		var clickedElement = evt.target;
		if (clickedElement.classList.contains('hotel-list__filter')) {
			hotelList.setActiveFilter(clickedElement.id);
		};
	});


	// переменная для throttle (задержка обработки событий)
	var scrollTimeout;
	// обработчик скрола (инфинити скролл)
	window.addEventListener('scroll', function(evt) {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function() {
			// определение координаты футера
			var footerCoordinates = document.querySelector('.page-footer').getBoundingClientRect();

			// определение высоты вьюпорта
			var viewportSize = window.innerHeight;

			// проверка виден ли футер
			if (footerCoordinates.bottom - viewportSize <  footerCoordinates.height) {
				if (hotelList.currentPage < Math.ceil(hotelList.filteredHotels.length / hotelList.PAGE_SIZE) - 1) {
					hotelList.renderHotels(hotelList.filteredHotels, ++hotelList.currentPage);
				};
			};
		}, 100);
	});


	// вызов загрузки списка отелей с сервера
	hotelList.getHotels();

});