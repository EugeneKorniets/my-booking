'use strict';

define([
	'hotel',
	'gallery'
	], function(Hotel, Gallery) {

	/**
	 * Конструктор объекта HotelList.
	 * @constructor
	 */
	function HotelList () {
		this.container = document.querySelector('.hotel-list__container');
		this.activeFilter = 'filter-reset';
		this.hotels = [];
		this.filteredHotels = [];
		this.renderedHotels = [];
		this.currentPage = 0;
		this.PAGE_SIZE = 9;
	};


	// создание галереи
	var gallery = new Gallery();


	/**
	 * Метод загрузки списка отелей.
	 * @this {HotelList}
	 */
	HotelList.prototype.getHotels = function() {
		// создание запроса
		var xhr = new XMLHttpRequest();

		/**
		 * Открытие запроса AJAX.
		 * @param {string} method
		 * @param {string} URL
		 * @param [boolean] async
		 */
		xhr.open('GET', 'data/hotels.json');

		// задание таймаута
		xhr.timeout = 10000;

		/**
		 * Обработчик ответа сервера.
		 * @this hotelList
		 */
		xhr.onload = function(evt) {
			// парс строки ответа в JSON
			if (evt.srcElement) {
				this.hotels = JSON.parse(evt.srcElement.response);
			} else {
				// Firefox
				this.hotels = JSON.parse(evt.target.response);
			};

			// копирование массива
			this.filteredHotels = this.hotels.slice(0);

			// вызов рендеринга загруженных отелей на страницу
			this.renderHotels(this.hotels, this.currentPage, true);
		}.bind(this);

		// отправка запроса
		xhr.send();
	};


	/**
	 * Метод установки активного фильтра.
	 * @this {HotelList}
	 * @param {string} id
	 */
	HotelList.prototype.setActiveFilter = function(id) {
		// защита от повторной фильтрации
		if (id === this.activeFilter) {
			return;
		} else {
			// снятие выбора с активного фильтра
			document.querySelector('#' + this.activeFilter).classList.remove('hotel-list__filter--selected');
			document.querySelector('#' + id).classList.add('hotel-list__filter--selected');
			this.activeFilter = id;

			// копирование массива
			this.filteredHotels = this.hotels.slice(0);

			// сортировка и фильтрация отелей 
			switch (id) {
				// сортировка Сначала дорогие
				case 'filter-expensive-hotels':
					this.filteredHotels.sort(function(hotel1, hotel2) {
						return hotel2.price - hotel1.price;
					});
					break;

				// сортировка Сначала дешевые
				case 'filter-cheap-hotels':
					this.filteredHotels.sort(function(hotel1, hotel2) {
						return hotel1.price - hotel2.price;
					});
					break;

				// фильтрация и сортировка От 2 звезд
				case 'filter-stars':
					this.filteredHotels = this.filteredHotels.filter(function(hotel) {
						if (hotel.stars >= 2) {
							return hotel;
						};
					});
					this.filteredHotels.sort(function(hotel1, hotel2) {
						return hotel1.stars - hotel2.stars;
					});
					break;

				// фильтрация и сортировка По рейтингу не ниже 6
				case 'filter-rating':
					this.filteredHotels = this.filteredHotels.filter(function(hotel) {
						if (hotel.rating >= 6) {
							return hotel;
						};
					});
					this.filteredHotels.sort(function(hotel1, hotel2) {
						return hotel1.rating - hotel2.rating;
					});
					break;

				// фильтрация и сортировка по Расстоянию от центра
				case 'filter-distance':
					this.filteredHotels = this.filteredHotels.filter(function(hotel) {
						if (hotel.distance <= 1) {
							return hotel;
						};
					});
					this.filteredHotels.sort(function(hotel1, hotel2) {
						return hotel1.rating - hotel2.rating;
					});
					break;

				case 'filter-reset':
					// действий не требуется, далее отрисуется исходный массив отелей, полученный с сервера
					break;
			};

			// проверка наличия отелей в обработанном списке
			if (this.filteredHotels.length > 0) {
				// отели есть: установка текущей страницы в 0 и рендеринг, с очисткой контейнера
				this.currentPage = 0;
				this.renderHotels(this.filteredHotels, this.currentPage, true);
			} else {
				// отелей нет: выдача сообщения в результатах
				var resultsContainer = document.querySelector('.hotel-list__result');
				resultsContainer.innerHTML = 'Вариантов не найдено';
				// выдача результата в контейнер
				this.container.innerHTML = '';
				var message = document.createElement('p');
				message.classList.add('hotel-list__message');
				message.innerHTML = 'К сожалению, ни один отель не соответствует требованиям поиска.';
				var advice = document.createElement('p');
				advice.classList.add('hotel-list__advice')
				advice.innerHTML = 'Попробуйте изменить условия поиска :-)';
				this.container.appendChild(message);
				this.container.appendChild(advice);
			};
		};
	};


	/**
	 * Метод отрисовки отелей.
	 * @this {HotelList}
	 * @param {Array.<Object>} hotels
	 * @param {number} currentPage
	 * @param {boolean=} replace
	 */
	HotelList.prototype.renderHotels = function(hotelsToRender, pageNumber, replace) {
		// проверка необходимости очистки контейнера
		if (replace) {
			var hotel;
			// очистка массива отрендеренных отелей 
			while (hotel = this.renderedHotels.shift()) {
				// удаление обработчиков кликов по отелю (очистка памяти)
				hotel.onClick = null;
				hotel.remove();
			};
			// очистка контейнера
			this.container.innerHTML = '';
		};

		// получение из DOM контейнера для результатов
		var resultsContainer = document.querySelector('.hotel-list__result');
		resultsContainer.innerHTML = 'Найдено ' + hotelsToRender.length + ' вариантов';

		// создание фрагмента для записи отелей в цикле
		var fragment = document.createDocumentFragment();

		// переменная для значения ОТ (с какого отеля продолжается рендеринг)
		var from = pageNumber * this.PAGE_SIZE;

		// переменная для значения ДО (до какого отеля необходим рендеринг)
		var to = from + this.PAGE_SIZE;

		// вырезка отелей соответствующих странице
		var pageHotels = hotelsToRender.slice(from, to);

		// добавление новых элементов в список отрендеренных отелей
		this.renderedHotels = this.renderedHotels.concat(pageHotels.map(function(hotel) {
			// создание объекта (структуры данных) для каждого отеля
			var hotelElement = new Hotel();
			hotelElement.setData(hotel);
			// подготовка DOM-ноды каждого отеля
			hotelElement.render();
			// добавление DOM-ноды во фрагмент
			fragment.appendChild(hotelElement.element);

			// регистрация обработчика кликов для появления галереи (передача превьюшек в галерею)
			hotelElement.onClick = function() {
				gallery.setData(hotelElement.getData());
				gallery.render();
			};
			
			// возврат элемента для записи в массив renderedHotels
			return hotelElement;
		}));

		// добавление фрагмента с отелями на страницу
		this.container.appendChild(fragment);
	};


	// возврат объекта HotelList
	return HotelList;

});