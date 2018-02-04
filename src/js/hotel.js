'use strict';

define([
	'hotel-base'
	], function(HotelBase) {

	/**
	 * Массив соответствий округленного вниз рейтинга классу DOM-элемента.
	 * @enum {string}
	 */
	var ratingClassName = {
		'2':  'hotel__rating--two',
		'3':  'hotel__rating--three',
	 	'4':  'hotel__rating--four',
	 	'5':  'hotel__rating--five',
	 	'6':  'hotel__rating--six',
	 	'7':  'hotel__rating--seven',
	 	'8':  'hotel__rating--eight',
	 	'9':  'hotel__rating--nine',
	 	'10': 'hotel__rating--ten'
	};


	/**
	 * Массив соответствий id дополнительных удобств классам DOM-элементов.
	 * @enum {string}
	 */
	var optionClassName = {
	 	'wi-fi': 'hotel__option--wifi',
	 	'parking': 'hotel__option--parking',
	 	'breakfast': 'hotel__option--breakfast',
	 	'pool': 'hotel__option--pool'
	};


	/**
	 * Конструктор объекта Hotel.
	 * @constructor
	 * @extends {HotelBase}
	 */
	function Hotel() {
		this._onClick = this._onClick.bind(this);
	};

	Hotel.prototype = new HotelBase();


	/**
	 * Метод рендеринга отелей (создание ноды отеля).
	 * @this {Hotel}
	 * @override
	 */
	Hotel.prototype.render = function() {
		// получение из DOM ноды шаблона с разметкой отеля
		var template = document.querySelector('#hotel-template');

		// проверка есть ли свойство content у template (проверка на старые IE)
		if ('content' in template) {
			// клонирование содержимого шаблона в свойство element отеля
			this.element = template.content.children[0].cloneNode(true);
		} else {
			// клонирование содержимого шаблона в свойство element отеля для старых IE
			this.element = template.children[0].cloneNode(true);
		};

		// заполнение шаблона ноды данными
		// заполнение блока звездности
		for (var i = 0; i < this.getStars(); i++) {
			var starHotel = document.createElement('span');
			starHotel.classList.add('hotel__star');
			this.element.querySelector('.hotel__stars').appendChild(starHotel);
		};
		// заполнение блока с названием отеля
		this.element.querySelector('.hotel__name').textContent = this.getName();
		// заполнение блока с расстоянием до центра
		this.element.querySelector('.hotel__distance').textContent = this.getDistance() + ' км до центра';
		// заполнение блока с рейтингом отеля
		this.element.querySelector('.hotel__rating').textContent = this.getRating().toFixed(2);
		this.element.querySelector('.hotel__rating').classList.add(ratingClassName[Math.floor(this.getRating())]);
		// заполнение блока опций
		for (var i = 0; i < this.getOptions().length; i++) {
			var optionHotel = document.createElement('li');
			optionHotel.classList.add('hotel__option');
			optionHotel.classList.add(optionClassName[this.getOptions()[i]]);
			this.element.querySelector('.hotel__options').appendChild(optionHotel);
		}
		
		// заполнение блока с ценой отеля
		var priceHotel = this.getPrice();
		priceHotel = String(priceHotel);
		priceHotel = priceHotel.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
		this.element.querySelector('.hotel__price').textContent = priceHotel + ' ₽';

		/**
		 * Создание изображения.
		 * @type {Image}
		 */
		var backgroundImage = new Image();		

		/**
		 * Обработка повисшего сервера.
		 * @const
		 * @type {number}
		 */
		var IMAGE_TIMEOUT = 10000; // константа таймаута загрузки изображения
		// установка таймаута на случай повисшего сервера
		var imageLoadTimeout = setTimeout(function() {
			// прекращение попытки загрузить изображение
			backgroundImage.src = "";
			// назначение класса hotel--nophoto
			this.element.classList.add('hotel--nophoto');
		}.bind(this), IMAGE_TIMEOUT); // ?? не протестировал

		// обработчик загрузки изображения с сервера
		backgroundImage.onload = function() {
			// отмена таймаута повисшего сервера
			clearTimeout(imageLoadTimeout);
			// установка изображения в качестве фона отеля
			this.element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
		}.bind(this);

		// обработчик ошибки загрузки изображения
		backgroundImage.onerror = function() {
			// назначение класса hotel--nophoto
			this.element.classList.add('hotel--nophoto');
		}.bind(this);

		// передача изображению ссылки на загрузку с сервера
		backgroundImage.src = '/' + this.getPreview();

		// регистрация обработчика клика по отелю, для показа галереи
		this.element.addEventListener('click', this._onClick);
	};


	/**
	 * Метод удаления обработчика клика по отелю.
	 * @this {Hotel}
	 * @override
	 */
	Hotel.prototype.remove = function () {
		this.element.removeEventListener('click', this._onClick);
	};


	/**
	 * Обработчик кликов по отелю.
	 * @this {Hotel}
	 * @private
	 */
	Hotel.prototype._onClick = function(evt) {
		// проверка клика и наличие превью у отеля
		if (evt.target.classList.contains('hotel') && !this.element.classList.contains('hotel--nophoto')) {
			// проверка существует ли функция обработчик, определенная снаружи
			if (typeof this.onClick === 'function') {
				this.onClick();
			};
		};
	};

	
	// возврат объекта Hotel
	return Hotel;
});