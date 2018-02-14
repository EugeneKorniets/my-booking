'use strict';

define([
	'hotel-base'
	], function(HotelBase) {

	/**
	 * Конструктор объекта Gallery.
	 * @constructor
	 * @extends {HotelBase}
	 */
	function Gallery() {
		this.element = document.querySelector('.gallery');
		this._closeButton = this.element.querySelector('.gallery__close-btn');
		this._onCloseClick = this._onCloseClick.bind(this);
		this._controlPrev = this.element.querySelector('.gallery__control-prev');
		this._onPrevClick = this._onPrevClick.bind(this);
		this._controlNext = this.element.querySelector('.gallery__control-next');
		this._onNextClick = this._onNextClick.bind(this);
		this._currentImage;
	};

	Gallery.prototype = new HotelBase();


	/**
	 * Метод показа галереи.
	 * @this {Gallery}
	 * @override
	 */
	Gallery.prototype.render = function() {
		// получение из DOM-ноды контейнера для названия отеля
		var nameContainer = this.element.querySelector('.gallery__name');
		// создание параграфа для названия отеля
		var nameElement = document.createElement('p');
		// получение из DOM-ноды контейнера для главной картинки
		var pictureContainer = this.element.querySelector('.gallery__picture');
		// получение из DOM-ноды контейнера для превью фотографий
		var thumbnailsContainer = this.element.querySelector('.gallery__thumbnails');

		// заполнение названия отеля и рендеринг в контейнер
		nameElement.innerHTML = this.getName();
		nameContainer.appendChild(nameElement);

		// цикл прохода по всем картинкам в галерее
		this.getPictures().forEach(function(pic, i) {
			// создание изображения
			var picture = new Image();
			// присвоение класса картинке
			picture.classList.add('gallery__thumbnail');
			// передача изображению ссылки на источник
			picture.src = pic;

			// добавление изображения в контейнер
			thumbnailsContainer.appendChild(picture);
		});

		// регистрация обработчика кликов по превьюшкам
		thumbnailsContainer.onclick = function(evt) {
			this._onClickThumbnail(evt);
		}.bind(this);

		// регистрация обработчиков кликов переключения слайдов
		this._controlPrev.addEventListener('click', this._onPrevClick);
		this._controlNext.addEventListener('click', this._onNextClick);

		// регистрация обработчика клика закрытия галереи
		this._closeButton.addEventListener("click", this._onCloseClick);

		// показ галереи
		this.element.classList.remove('gallery--hidden');
		
		// установка активной первой картинки
		this.setCurrentImage(0);
	};


	/**
	 * Метод скрытия галереи.
	 * @this {Gallery}
	 * @override
	 */
	Gallery.prototype.remove = function() {
		// скрытие галереи
		this.element.classList.add('gallery--hidden');
		// удаление обработчика клика закрытия галереи
		this._closeButton.removeEventListener('click', this._onCloseClick);
		// очистка блока с именем
		this.element.querySelector('.gallery__name').innerHTML = '';
		// очистка контейнера для главной картинки
		this.element.querySelector('.gallery__picture').innerHTML = '';
		// очистка контейнера с превьюхами
		this.element.querySelector('.gallery__thumbnails').innerHTML = '';
		// очистка смещения контейнера
		this.element.querySelector('.gallery__thumbnails').style.marginLeft = '';
		// удаление обработчиков кликов переключения слайдов
		this._controlPrev.removeEventListener('click', this._onPrevClick);
		this._controlNext.removeEventListener('click', this._onNextClick);
	};


	/**
	 * Обработчик клика закрытия галереи.
	 * @this {Gallery}
	 * @private
	 */
	Gallery.prototype._onCloseClick = function(){
		this.remove();
	};


	/**
	 * Метод переключения предыдущего слайда.
	 * @this {Gallery}
	 * @private
	 */
	Gallery.prototype._onPrevClick = function() {
		// подтягивание контейнера для превью
		var container = this.element.querySelector('.gallery__thumbnails')
		// определение ширины одной превью
		var thumbnailWidth = this.element.querySelector('.gallery__thumbnail').offsetWidth;
		// определение текущего смещения
		var currentTranslate = container.style.marginLeft;
		// оцифровка текущего смещения
		if (currentTranslate == '') {
			currentTranslate = 0;
		} else {
			currentTranslate = parseInt(currentTranslate.replace(/\D+/g,""));
		};

		// определение нужно ли скролить превьюшки
		if (currentTranslate > 0) {
			// скролим до тех пор пока не дойдем до конца
			container.style.marginLeft = -(currentTranslate - thumbnailWidth) + 'px';
		};
	};

	/**
	 * Метод переключения следующего слайда.
	 * @this {Gallery}
	 * @private
	 */
	Gallery.prototype._onNextClick = function() {
		// подтягивание контейнера для превью
		var container = this.element.querySelector('.gallery__thumbnails')
		// определение ширины одной превью
		var thumbnailWidth = this.element.querySelector('.gallery__thumbnail').offsetWidth;
		// определение ширины контейнера превьюшек
		var containerWidth = container.offsetWidth;
		// определение количества превьюшек
		var thumbnailCount = this.getPictures().length;
		// определение ширины всех превьюшек
		var thumbnailsWidth = thumbnailWidth * thumbnailCount;
		// определение текущего смещения
		var currentTranslate = container.style.marginLeft;
		// оцифровка текущего смещения
		if (currentTranslate == '') {
			currentTranslate = 0;
		} else {
			currentTranslate = parseInt(currentTranslate.replace(/\D+/g,""));
		};

		// определение нужно ли скролить превьюшки
		if (containerWidth < thumbnailsWidth) {
			// скролим до тех пор пока не дойдем до конца (описать)
			container.style.marginLeft = -(currentTranslate + thumbnailWidth) + 'px';
		};
	};


	/**
	 * Метод переключения превью в галерее.
	 * @this {Gallery}
	 * @private
	 */
	Gallery.prototype._onClickThumbnail = function(evt) {
		if (evt.target.classList.contains('gallery__thumbnail--selected')) {
			return;
		}
		if (evt.target.classList.contains('gallery__thumbnail')) {
			// поиск активной картинки
			if (this.element.querySelector('.gallery__thumbnail--selected')) {
			// деактивация активной картинки
			this.element.querySelector('.gallery__thumbnail--selected').classList.remove('gallery__thumbnail--selected');
			};

			// активация картинки
			evt.target.classList.add('gallery__thumbnail--selected');

			// подтягивание контейнера для главной картинки
			var pictureContainer = this.element.querySelector('.gallery__picture');

			// добавление главной картинки фоном контейнера
			pictureContainer.style.backgroundImage = 'url(' + evt.target.src + ')';
		};
	};


	/**
	 * Метод установки активной картинки в галерее.
	 * @this {Gallery}
	 */
	Gallery.prototype.setCurrentImage = function(i) {

		// сохранение текущей картинки в объекте
		this._currentImage = i;

		// поиск активной превью
		var activeThumbnail = this.element.querySelector('.gallery__thumbnail--selected');

		// деактивация активной превью
		if (activeThumbnail) {
			activeThumbnail.classList.remove('gallery__thumbnail--selected');
		};

		// активация превью, переданной индексом в аргументе
		this.element.querySelectorAll('.gallery__thumbnail')[i].classList.add('gallery__thumbnail--selected');

		// создание нового изображения для главной картинки в галерее
		var mainPicture = new Image();
		mainPicture.src = this.getPictures()[i];

		// подтягивание контейнера для главной картинки
		var pictureContainer = this.element.querySelector('.gallery__picture');

		// добавление главной картинки фоном контейнера
		pictureContainer.style.backgroundImage = 'url(\'' + mainPicture.src + '\')';
	};


	// возврат объекта Gallery
	return Gallery;

});