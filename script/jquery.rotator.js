/*
jQuery Rotator v1.0 (c) Nenad Rogic

Turns a <ul> list items into a slideshow

General usage:

$("#element").rotator({
    itemShow: 3000,     // duration how long each item should be shown
    itemFade: 500,      // speed of fading in/out each element
    autoPlay : true,    // should slides autoplay?
    showPager : true,   // add pager or not? adds <ul class="pager"><li class='current'>1</li>...</ul> to root element
    pagerFade: 0        // fade in/out pager also? 0 = no animation
});
*/

// create closure
(function($) {
// plugin definition
$.fn.rotator = function(options) {

	// default configuration properties
	var defaults = {
		pagerFade: 1000,
		itemFade: 700,
		itemShow :3000,
		autoPlay : false,
		showPager: true
	};
	// extend defaults with options
	options = $.extend({}, defaults, options);

	// private variables
	var $active = {}; // active rotator
	var currentPage = 0;
	var totalPages = 0;
	var timer = {};

	return this.each(function() {
			// prepare
			$active=$(this).hide();
			$('li', $active).hide();
			$active.show();

			// fade-in first item
			$('li:first', $active).fadeIn(options.itemFade);

			// get indexes
			totalPages=$('li', $active).length;
			currentPage=0;

			// autoPlay:
			if(options.autoPlay && totalPages > 1)
			{
				var start=function(){
					timer = setInterval(function () { delay(); }, options.itemShow);
				};

				// if image in first <li></li>, wait to be loaded:
				var $img=$('li:eq(0) img', $active);
				if( $img.length > 0) {
                    var img = new Image();
                    $(img).load(function() {
                        start();
                    })
                    .attr('src', $img.attr('src'));
				}
				else
                    start();
			}

			if(options.showPager)
			{
				// create pager and hide it
				$('<ul class="pager"></ul>').appendTo($active).hide();

				// add links for each item to pager
				var counter = 0;
				$('li', $active).each(function() {
					counter++;
					var cls = (counter == 1) ? 'current' : '';
					$('.pager', $active).append('<li><a class="' + cls + '">' + counter + '</a></li>');
				});

				// only 1 item exist - remove paging
				if (counter == 1)
					$('.pager', $active).remove();

				$('.pager', $active).fadeIn(options.pagerFade);

				// wiring:
				$('.pager a', $active)
					.css('cursor', 'pointer')
					.click(function() {
						if($(this).hasClass('current')) {
							// stop
							clearInterval(timer);
							return;
							}
						clearInterval(timer);
						$(this).blur();
						showpage(this.innerHTML - 1);
						return false;
					});
			}


			});

		function delay() {
			clearInterval(timer);
			timer = setInterval(function () { playnext(); }, options.itemFade * 2);
		}

		function playnext() {
			clearInterval(timer);
			var index=currentPage + 1;
			if(index > (totalPages - 1))
				index=0;
			showpage(index);
			timer = setInterval(function () { delay(); }, options.itemShow);
		}

		function showpage(index) {

			if(currentPage == index)
				return;

			var $pager=$('.pager', $active);
			if(options.showPager) {
				if(options.pagerFade != 0) {
					$($pager).hide();
				}
				$('a', $pager).removeClass('current');
				$('li:eq(' + index + ') a', $pager).addClass('current');
			}

            // save index for later because of animation delay
            var toShow=index;
			$('li:eq(' + currentPage + ')', $active).fadeOut(options.itemFade,function() {
				$($active).children('li').hide();
				$('li:eq(' + toShow + ')', $active).fadeIn(options.itemFade);
				currentPage=toShow;
			});

			if(options.showPager && options.pagerFade != 0)
				$($pager).fadeIn(options.pagerFade);
		}
};
// end of closure
})(jQuery);