'use strict';

define(function() {

	/**
	 * Конструктор объекта HotelBase (базовый объект для Hotel и Gallery)
	 * @constructor
	 */
	function HotelBase() {

	};

	/**
	 * Свойство для хранения ноды объекта.
	 * @type {?Node}
	 */
	HotelBase.prototype.element = null;

	/**
	 * Свойство для хранения данных об объекте.
	 * @type {?Object}
	 */
	HotelBase.prototype.data = null;

	/**
	 * Метод рендеринга объекта.
	 * @this {HotelBase}
	 */
	HotelBase.prototype.render = function() {};

	/**
	 * Метод удаления объекта.
	 * @this {HotelBase}
	 */
	HotelBase.prototype.remove = function() {};

	/**
	 * Метод записи данных в объект.
	 * @this {HotelBase}
	 * @param {Object} data
	 */
	HotelBase.prototype.setData = function(data) {
		this.data = data;
	};

	/**
	 * Метод чтения данных из объекта.
	 * @this {HotelBase}
	 * @return {Object}
	 */
	HotelBase.prototype.getData = function() {
		return this.data;
	};

	/**
	 * Метод извлечения названия отеля.
	 * @this {HotelBase}
	 * @return {string} name
	 */
	HotelBase.prototype.getName = function() {
		return this.data.name;
	};


	/**
	 * Метод извлечения расстояния до центра.
	 * @this {HotelBase}
	 * @return {number} distance
	 */
	HotelBase.prototype.getDistance = function() {
		return this.data.distance;
	};


	/**
	 * Метод извлечения количества звезд отеля.
	 * @this {HotelBase}
	 * @return {number} stars
	 */
	HotelBase.prototype.getStars = function() {
		return this.data.stars;
	};


	/**
	 * Метод извлечения рейтинга отеля.
	 * @this {HotelBase}
	 * @return {number} rating
	 */
	HotelBase.prototype.getRating = function() {
		return this.data.rating;
	};


	/**
	 * Метод извлечения дополнительных опций отеля.
	 * @this {HotelBase}
	 * @return {Array} options
	 */
	HotelBase.prototype.getOptions = function() {
		return this.data.options;
	};


	/**
	 * Метод извлечения стоимости отеля.
	 * @this {HotelBase}
	 * @return {number} price
	 */
	HotelBase.prototype.getPrice = function() {
		return this.data.price;
	};


	/**
	 * Метод извлечения превью отеля.
	 * @this {HotelBase}
	 * @return {string} preview
	 */
	HotelBase.prototype.getPreview = function() {
		return this.data.preview;
	};


	/**
	 * Метод извлечения картинок галереи отеля.
	 * @this {HotelBase}
	 * @return {Array} pictures
	 */
	HotelBase.prototype.getPictures = function() {
		return this.data.pictures;
	};

	
	// возврат объекта HotelBase
	return HotelBase;
});