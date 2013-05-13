var App = {
	items: [],
	types: [
		[
			{ n: 1, text: 'g'},
			{ n: 1000, text: 'KG'}
		],
		[
			{ n: 1, text: 'ml'},
			{ n: 1000, text: 'L'}
		],
		[
			{ n: 1, text: 'mm'},
			{ n: 100, text: 'cm'},
			{ n: 1000, text: 'M'}
		]
	],
	typeID: 0,
	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		var load = document.getElementById('load'),
			home = document.getElementById('home'),
			btnBack = document.getElementById('btn-back'),
			typeSelect = document.getElementById('tipo'),
			btnMenu = document.getElementById('menu-button'),
			body = $('body');

		$('#load').addClass('load-hide');

		btnBack.addEventListener('click', Dom.back, false);
		typeSelect.addEventListener('change', Dom.selectType, false);

		body.on('click', '#btn-calc', function(event) {
			event.preventDefault();
			App.calc();
		});

		body.on('click', '#btn-new-item', function(event) {
			event.preventDefault();
			Dom.newItem();
		});

		body.on('click', '.del', function(event) {
			event.preventDefault();
			Dom.removeItem($(this));
		});
	},
	calc: function() {
		var self = this,
			valid = true;

		$('.line-item').each(function(event) {
			var line = this,
				price = parseFloat(line.querySelector('.price').value),
				qtd = line.querySelector('.qtd').value,
				type = line.querySelector('.type').value,
				umElem = line.querySelector(".type"),
				um = umElem.options[umElem.selectedIndex].text,
				value = self.convertPrice(type, price, qtd);

			if (!price || !qtd) {
				if (!price) {
					line.querySelector('.price').focus();
				}
				else {
					line.querySelector('.qtd').focus();
				}
				valid = false;
				self.clearItems();
				return false;
			}

			item = {
				price: price.toFixed(2).replace('.', ','),
				printValue: value.toFixed(3).replace('.', ','),
				qtd: qtd,
				tipo: type,
				um: um,
				value: value,
				win: false
			}

			self.items.push(item);
		});

		if (valid) {
			Dom.renderResult();
		}
	},
	convertPrice: function(tipo, price, qtd) {
		if (tipo == 1) {
			result = price / qtd;
		}
		else if (tipo == 1000) {
			result = price / (tipo * qtd);
		}
		return result;
	},
	orderPrice: function() {
		this.items.sort(function(a, b) {
			var x = a.value,
				y = b.value;
			if (x < y) return -1;
			if (x > y) return 1;
			return 0;
		});

		winPrice = this.items[0].value;
		this.items.map(function(i) {
			if (i.value == winPrice) i.win = true;
		})

		return this.items;
	},
	clearItems: function() {
		this.items = [];
	}
}

var Dom = {
	newItem: function() {
		var idItem = document.querySelectorAll('.line-item').length + 1;

		data = {
			item: idItem,
			i: App.types[App.typeID]
		}

		var query = data,
			source = $('#new-line').html(),
			compiledTpl = Handlebars.compile(source),
			result = compiledTpl(query);

		if (idItem > 2) $('.del').removeClass('hide');

		$('#form-items').append(result);
	},
	removeItem: function(btn) {
		btn.parent().remove();
		var idItem = document.querySelectorAll('.line-item').length;
		if (idItem <= 2) $('.del').addClass('hide');
	},
	back: function() {
		$('#btn-home').show();
		$('#btn-result').hide();
		$('#home').removeClass('section-hide');
		$('#view').addClass('section-hide');
	},
	selectType: function() {
		var typeID = document.getElementById('tipo').value,
			types = App.types[typeID],
			data = {
				types: types
			}

		var query = data,
			source = $('#items').html(),
			compiledTpl = Handlebars.compile(source),
			result = compiledTpl(query);

		$('.type').html(result);

		App.typeID = typeID;
	},
	renderResult: function() {
		var data = {
				items: App.orderPrice()
			}

		var query = data,
			source = $('#result').html(),
			compiledTpl = Handlebars.compile(source),
			result = compiledTpl(query);

		$('#list-item').html(result);

		$('#home').addClass('section-hide');
		$('#view').removeClass('section-hide');
		$('#btn-home').hide();
		$('#btn-result').show();

		App.clearItems();
	}
}