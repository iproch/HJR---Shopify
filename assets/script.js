/* navigation mobile */
function navigation_mobile() {
	var hammer = new Hammer($('#header .fa-bars')[0], {});
	
	/*$('#header .fa-bars').on('click', function(e) {
		e.preventDefault();

		//$('.mobile-navigation-overlay, .mobile-navigation, .fa-bars').toggleClass('active');

		//$('#header .fa-bars, #header .navigation').toggleClass('active');
	});*/

	hammer.on('tap', function(ev) {
	    $('#header .fa-bars, #header .navigation').toggleClass('active');
	});
}

/* home slides */
function home_slides()
{
    $('#banners').slidesjs({
		width: 1624,
		height: 1080,
		navigation: {
			active: false,
			effect: 'slide'
		},
		pagination: {
			active: false,
			effect: 'slide'
		},
		play: {
			active: false,
			effect: 'slide',
			interval: 7500,
			auto: true,
			swap: false,
			pauseOnHover: true,
			restartDelay: 7500
		}
    });
}

/* shop taps */
function shop_taps() {
	var hammer_product = $('.hammer-product')[0],
        hammer = new Hammer.Manager(hammer_product, {}),
        singletap = new Hammer.Tap({ event: 'singletap' }),
        doubletap = new Hammer.Tap({event: 'doubletap', taps: 2 });

    hammer.add([doubletap, singletap]);

	doubletap.recognizeWith(singletap);

	singletap.requireFailure([doubletap]);

	// doubletap
	hammer.on('doubletap', function(ev) {
		alert('doubletap! :}');
	});

    // singletap
	hammer.on('singletap', function(ev) {
		var hammered = ev.target;

		$('.hammer-product').unbind('click');
		//hammered.parent().trigger('click');

		alert('singletap... try a doubletap. ;}');
	});

	// prevent default on hammer element
	$('.hammer-product').on('click', function(e) {
		e.preventDefault();
	});
}

/* product tabs */
function product_tabs() {
	$('#content .product-tabs ul li a').on('click', function(e) {
		e.preventDefault();

		var clicked = $(this)
			clickedHref = clicked.attr('href').replace('#', '');

		$('#content .product-tabs ul li').removeClass('active');
		$('#content .product-tab').hide();
		clicked.closest('li').addClass('active');
		$('#product-' + clickedHref + '.product-tab').show();
	});
}

/* lookbook collections */
function lookbook_collections()
{
	$('.lookbook-sidebar .categories li a').on('click', function(e) {
		e.preventDefault();

		var current = $('.lookbook-sidebar .categories li.active'),
			clicked = $(this),
			collection_id = $(this).attr('href'),
			collection_id = collection_id.replace('#', ''),
			photo_id = clicked.attr('data-photo-id');

		// remove/add class to sidebar lookbook collections
		current.removeClass('active');
		clicked.parent().addClass('active');

		// remove/add class to lookbook slides
		$('.lookbook-banners').removeClass('active');
		$('#lookbook-' + collection_id + '.lookbook-banners').addClass('active');

		// remove/add class to sidebar "shop the look"
		$('.lookbook-sidebar .shop-the-look .latest-posts').removeClass('active');
		$('.lookbook-sidebar .shop-the-look .photo-' + photo_id).addClass('active');

		// load slides
		lookbook_slides('#lookbook-' + collection_id);
	});
}

/* lookbook slides */
function lookbook_slides(collection_id)
{
	$(collection_id).slidesjs({
		width: 895,
		height: 595,
		navigation: {
			active: true,
			effect: 'slide'
		},
		pagination: {
			active: true,
			effect: 'slide'
		},
		play: {
			active: false,
			effect: 'slide',
			interval: 7500,
			auto: false,
			swap: false,
			pauseOnHover: true,
			estartDelay: 2500
		},
		callback: {
			loaded: function(number) {
				var number_fix = number - 1,
					slide_id = $(collection_id).find('[slidesjs-index=' + number_fix + ']').attr('id'),
					slide_id = slide_id.replace('banner-', '');

				// add arrow class to next/prev
				$('.slidesjs-previous').addClass('banner-pagination fa-angle-left');
        		$('.slidesjs-next').addClass('banner-pagination fa-angle-right');

        		// add active class to sidebar "shop the look"
				$('.lookbook-sidebar .shop-the-look .photo-' + slide_id).addClass('active');
			},
			start: function(number) {},
			complete: function(number) {
				var number_fix = number - 1,
					slide_id = $(collection_id).find('[slidesjs-index=' + number_fix + ']').attr('id'),
					slide_id = slide_id.replace('banner-', ''),
					collection_id_fix = collection_id.replace('#lookbook-', '');

				// remove/add active class to sidebar "shop the look"
				$('.lookbook-sidebar .shop-the-look .latest-posts').removeClass('active');
				$('.lookbook-sidebar .shop-the-look .photo-' + slide_id).addClass('active');

				// change "data-photo-id" value to current slide
				$('.lookbook-sidebar .categories li a[href="#' + collection_id_fix + '"]').attr('data-photo-id', slide_id);
			}
		}
    });
}

/* faq accordion */
function faq_accordion() {
	$('#content .content-margin-top .faq-block h3').on('click', function(e) {
		e.preventDefault();

		var clicked = $(this);

		clicked.parent().toggleClass('active');
	});
}

/* account */
function account()
{
	$('.forgot-password-show').on('click', function(e) {
		e.preventDefault();

		$('#customer_login').hide();
		$('form[action*="/account/recover"]').show();
	});

	$('.forgot-password-hide').on('click', function(e) {
		e.preventDefault();

		$('#customer_login').show();
		$('form[action*="/account/recover"]').hide();
	});

	if(window.location.hash == '#recover') { $('.forgot-password-show').trigger('click'); }
}

/* account wish list */
function account_wish_list(user_id)
{
	$.getJSON('https://ocean-lab.pinkdolphinonline.com/axp-social-feeds/index.php?shopify-store=hausofjr&social-network=wish-list&user_id=' + user_id, function(result) {
		$.each(result, function(i, item) {
			if(item.results_count == 0) {
				$('<li>' + item.results + '</li>').appendTo('.account-wish-list ul');
			} else {
				$.getJSON('/products/' + item.product_handle + '.js', function(product) {
					var featured_image = product.featured_image.replace(/\.(?=[^.]*$)/, "_grande.");

					$('<li><div class="img"><a href="' + product.url + '/" title="' + product.title + '"><img src="' + featured_image + '" alt="' + product.title + '" /></a></div><div class="info"><h3 title="' + product.title + '"><a href="' + product.url + '/" title="' + product.title + '">' + product.title + '</a></h3><span class="price">' + Shopify.formatMoney(product.price) + '</span><div class="description">' + product.description + '</div><div class="actions"><a class="button" href="' + product.url + '/" title="' + product.title + '">More Info</a><a class="button invert" href="#delete-from-wish-list" title="Delete From Wish List" data-user-id="' + user_id + '" data-product-id="' + product.id + '">- Wish List</a></div></div></li>').appendTo('.account-wish-list ul');
				});
			}
		});
	});
}

/* account wish list exists */
function account_wish_list_exists(user_id, product_id)
{
	$.getJSON('https://ocean-lab.pinkdolphinonline.com/axp-social-feeds/index.php?shopify-store=hausofjr&social-network=wish-list/exists&user_id=' + user_id + '&product_id=' + product_id, function(result) {
		if(result[0].error == true)
		{
			$('a[href="#add-to-wish-list"]').remove();
			$('<a class="button invert" href="/pages/wish-list/" title="Wish List">View Wish List</a>').appendTo('.product-info .actions');
		}
	});
}

/* account wish list add */
function account_wish_list_add_anchor()
{
	$('a[href="#add-to-wish-list"]').on('click', function(e) {
		e.preventDefault();

		var clicked = $(this),
			user_id = clicked.attr('data-user-id'),
			product_id = clicked.attr('data-product-id'),
			product_handle = clicked.attr('data-product-handle');

		account_wish_list_add(user_id, product_id, product_handle);
	});
}

function account_wish_list_add(user_id, product_id, product_handle)
{
	$.getJSON('https://ocean-lab.pinkdolphinonline.com/axp-social-feeds/index.php?shopify-store=hausofjr&social-network=wish-list/add&user_id=' + user_id + '&product_id=' + product_id + '&product_handle=' + product_handle, function(result) {
		if(result[0].error == false)
		{
			$('a[href="#add-to-wish-list"]').remove();
			$('<a class="button invert" href="/pages/wish-list/" title="Wish List">View Wish List</a>').appendTo('.product-info .actions');
			$('#content .product-info .actions').after('<div class="add-to-cart-error" style="margin: 0 0 20px 0; padding: 20px; border: 1px solid #f1f1f1;">This item has been added to your <a href="/pages/wish-list/" title="Wish List">wish list</a>.</a></div>');
		}
	});
}

/* account wish list delete */
function account_wish_list_delete_anchor()
{
	$(document).on('click', 'a[href="#delete-from-wish-list"]', function(e) {
		e.preventDefault();

		var clicked = $(this),
			user_id = clicked.attr('data-user-id'),
			product_id = clicked.attr('data-product-id');

		account_wish_list_delete(clicked, user_id, product_id);
	});
}

function account_wish_list_delete(clicked, user_id, product_id)
{
	$.getJSON('https://ocean-lab.pinkdolphinonline.com/axp-social-feeds/index.php?shopify-store=hausofjr&social-network=wish-list/delete&user_id=' + user_id + '&product_id=' + product_id, function(result) {
		var clicked_parent = clicked.parent().parent().parent();

		if(result[0].error == false)
		{
			clicked.parent().parent().parent().find('.img').css({'opacity': '0.10'});
			clicked.parent().parent().css({'opacity': '0.10'});
			$('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"><div style="display: table; width: 100%; height: 100%;"><div style="display: table-cell; height: 100%; text-align: center; vertical-align: middle;">This item has been deleted from your wish list.</div></div></div>').appendTo(clicked_parent);
		}
	});
}

/* sizing */
function sizing_tabs()
{
	$('#content .sizing-chart ul li a').on('click', function(e) {
		e.preventDefault();

		var clicked = $(this)
			clickedHref = clicked.attr('href').replace('#', '');

		$('#content .sizing-chart ul li').removeClass('active');
		$('#content .table-tab').removeClass('active');
		clicked.closest('li').addClass('active');
		$('.table-tab.' + clickedHref).addClass('active');
	});
}

//$(document).ready(function() {
$(function() {
	navigation_mobile();
	product_tabs();
	faq_accordion();
	account();
	sizing_tabs();
});