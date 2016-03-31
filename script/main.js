// portfolio script
var Portfolio = {

    Init: function() {
		Portfolio.SetPager();
		// slide & zoom the captions (portfolio & portfolio detail)
		var zoom=10;
		$('#portfolio ul.items li a, .portfolio-detail ul.items li a').each(function(){
			$(this).append('<span class="caption"></span>' + '<span class="text">' + $(this).find('img').attr('alt') + '</span>');
		});
		$('#portfolio ul.items li a, .portfolio-detail ul.items li a').hover(function(){
			$("span.caption", this).stop().animate({bottom:'-20px'},{duration:300});
			$("span.text", this).stop().animate({bottom:'6px'},{duration:300});

			var imgwidth=parseInt($(this).find('img').width());
			 $(this).find('img')
				.stop()
				.data('width',imgwidth)
				.animate({
					width: imgwidth + zoom,
					left: -1*zoom/2,
					top: -1*zoom/2
			},{duration:300});

		}, function() {
			$("span.caption", this).stop().animate({bottom:'-50px'},{duration:200});
			$("span.text", this).stop().animate({bottom:'-50px'},{duration:200});

			var imgwidth=$(this).find('img').data('width');
			 $(this).find('img').stop().animate({
				width: imgwidth,
				left: 0,
				top: 0
			},{duration:200});
		});
		// portfolio category navigation fadeIn/fadeOut
		$('#portfolio ul.nav li a').click(function(){
			var $this=$(this);
			if($this.hasClass('active'))
				return;
			$this.addClass('active').parent('li').siblings().find('a').removeClass('active');
			var category=$this.attr('rel');
			$('#portfolio ul.items li').not('.hidden').fadeOut(200,function() {
				$(this).addClass('hidden');
				// fade in all elements, or just for category
				var $el= category != '' ? $('#portfolio ul.items li.' + category) : $('#portfolio ul.items li');
				$el.removeClass('hidden').fadeIn(200);
				Portfolio.SetPager();
			});
		});
		// portfolio detail: wire prettyPhoto
		$('.portfolio-detail ul.items li a[rel^="prettyPhoto"]').prettyPhoto({
			animationSpeed: 'fast',
			allowresize: true,
			theme:'light_square'
		});
    },

	SetPager: function() {
		// portfolio pager
		var PageSize=9;
		// prepare pager:
		$('#pager-wrap').empty().append('<ul class="pager"></ul>');
		// calculate items per page & how many pages in total
		var iPP=$('#portfolio ul.items li').not('.hidden').length / PageSize;
		var pages=Math.round(iPP) + (Math.round(iPP) > iPP ? 0 : 1);
		// reset position to 1st page (top), always
		$('#portfolio ul.items').css('marginTop',0);
		// no pager if only 1 page
		if(pages == 1)
			return;
		// calculate rowHeight
		var $li=$('#portfolio ul.items li:first');
		// don't do the pager stuff if item is not present (no height):
		if($li.height() ==  null)
			return;
		var rowHeight=$li.outerHeight(true);
		// add page links
		for(var i=0; i < pages; i++) {
			var cls = (i == 0) ? 'active' : '';
			$('#portfolio ul.pager').append('<li><a href="#" class="' + cls + '">' + (i + 1) + '</a></li>');
		}
		// wire pager clicks
		$('#portfolio ul.pager li a').click(function() {
			// set active class
			$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
			// 3 rows / page * -1
			var offset=3 * ($(this).html() * 1 - 1) * rowHeight * -1;
			$('#portfolio ul.items').animate({
					marginTop : offset
				}, 500);
		});
	}
}

// tweeter script
var Tweeter = {
	Init: function(username, tweets) {
		// get twitter cloud <div>
		var $t=$('#twitter');
		// * get tweets from tweeter:
		$t.tweet({
			username: username,
			join_text: null,
			avatar_size: null,
			count: tweets,
			loading_text: "loading tweets..."
		});

		// * sillhouette pop-up speech bubble animation
		$t
			// set opacity and change display mode - this is needed to determine top & left margin
			.css('opacity',0)
			.css('display','block')
			// save original position for later - to reset the bubble back
			.data('top', $t.css('top'));
		$('#silhouette')
			// remove alt attribute to prevent showing
			.attr('alt','')
			// add mouseover/mouseout:
			.hover(function(){
				$t.stop()
					.animate({
						opacity:1,
						top:20
					}, 500);
			},function(){
				if($t.css('opacity') < 1) {
					$t
						.stop()
						.animate({
							opacity:0
							}, 300, function(){
								$t.css('top', $t.data('top'));
							});
					return;
				}
				$t.stop()
					.delay(1500)
						.animate({
							opacity:0
							}, 300, function(){
								$t.css('top', $t.data('top'));
							});
		});
	}
}

// MAIN STARTUP SCRIPT
$(function () {

	// * Cufon: replace heading fonts & navigation (all pages)
	Cufon.replace('#nav ul li a, .page h1, #logo .name', {
		fontFamily: 'ChunkFive',
		hover: true,
		forceHitArea: true
	});

    // center the content (15% margin top)
    var margin=$(window).height() / 100 * 15;
    $('#pages').css('margin-top',margin + 'px');
    $('#silhouette').css('top',margin + 'px');

	// * roundabout plugin setup (homepage)
	$('#roundabout ul').roundabout({
		minScale: .0001,
		maxScale: 1,
		minOpacity: 1,
		maxOpacity: 1,
		bearing: 0,
		focusBearing: 0
	});
	// roundabout - wire title showing/fading
	var $title=$('#roundabout h3 a');
	if($title.length > 0) {
		$('#roundabout ul li').click(function(e) {
			if($(this).hasClass('roundabout-in-focus'))
				return;
			$title.stop().fadeOut(200);
		});
		$('#roundabout ul li').focus(function(e) {
			var t=$(this).find('img').attr('alt');
			var h=$(this).find('a').attr('href');
			$title.attr('href',h).text(t).fadeTo(300,1);
		});
		$('#roundabout ul li').focus(function(e) {
			$title.fadeIn(200);
		});

		// set initial text & fadeIn
		var t=$('#roundabout ul li.roundabout-in-focus').find('img').attr('alt');
		var h=$('#roundabout ul li.roundabout-in-focus').find('a').attr('href');
		$title.attr('href',h).text(t).fadeIn(1000);
	}

	

	// * navigation fading, not working in opera/ie
	if(!$.browser.opera && !$.browser.msie) {
		// add navigation <span>'s
		$('#nav ul li a').each(function(){
			$(this).append('<span>' + $(this).html() + '</span>');
		});
		// animate <spans>
		$('#nav ul li a')
			.hover(
				// mouseover
				function(){
					// do not animate active link
					if($(this).hasClass('active'))
						return;
					$(this).find('span').stop().animate({opacity:1}, 300);
				},
				// mouseout
				function(){
					$(this).find('span').stop().animate({opacity:0}, 50);
				})
			.find('span').css('opacity',0);
	}
	else {
		$('#nav ul li a')
			.hover(
				// mouseover
				function(){
					$(this).addClass('hover');
				},
				// mouseout
				function(){
					$(this).removeClass('hover');
				});
	}

	// * RSS icon tooltip
	$('#logo .rss').tooltip({
		// one configuration property
		position: "bottom center",
		// use the built-in fadeIn/fadeOut effect
		effect: "fade",
		fadeInSpeed: 500,
		fadeOutSpeed: 100,
		predelay: 300,
		delay: 100,
		offset: [3,0],
		// use this single tooltip element
		tip: '.tooltip-top'
	});

	// * bottom icons tooltip
	$('#bottom ul li a').tooltip({
		// one configuration property
		position: "top center",
		// use the built-in fadeIn/fadeOut effect
		effect: "fade",
		fadeInSpeed: 500,
		fadeOutSpeed: 100,
		predelay: 300,
		delay: 100,
		offset: [3,0],
		// use this single tooltip element
		tip: '.tooltip-bottom'
	})
		.hover(function(){
            if(!$.browser.msie)
                $(this).css('opacity',1);
		},function(){
            if(!$.browser.msie)
                $(this).css('opacity',.8);
		});

	// * Blog: add search field focus/blur
	$('#searchForm input').focus(function(){
		$(this).addClass('focus');
		if($(this).val() == $(this).attr('title'))
			$(this).val('');
	}).blur(function(){
		if($(this).val() == '') {
			$(this)
				.removeClass('focus')
				.val($(this).attr('title'));
			}
	}).val($('#searchForm input').attr('title'));

	// * Logo: link whole logo to name link
	$('#logo').click(function(){
		var href=$('a.name', this).attr('href');
		// no link if singlepage mode
		if(href!= '#homepage')
			window.location = href;
	});

	// wire portfolio - zooming, caption, paging, lightbox
	Portfolio.Init();

	// * wire rotator for blockquotes (about page)
	$("#about .testimonials ul").rotator({
		itemFade: 500,
		pagerFade: 0,
		itemShow: 4000,
		autoPlay : true,
		showPager : false
	});
	

	// * Get tweets. Parameters:
	// "username", NumberOfTweets to fetch
	Tweeter.Init("themeforest",1);

	// * forms validation (contact page & blog-post page)
	$("#postform").validate();

	// * contact page ajax form
	// define ajax submit handler
	var AjaxSubmit = function(){
		var btnText=$('#contactform .submit').val();
		// inform client that data is been sent:
		$('#contactform .submit').val('Sending...');
		$.ajax({
			type: 'POST',
			url: $('#contactform').attr('action'),
			data: $('#contactform').serialize(),
			// successful POST - display result in success div:
			success: function(msg){
				$('#contactform .form').slideUp(500,function(){
					$('#contactform div.success').removeClass('hiddne').fadeIn(500);
				});
			},
			// error on server, or wrong url - display status text in error div:
			error: function(response) {
				$('#contactform .submit').val(btnText);
				$('#contactform div.error').html(response.statusText).slideDown(500);
			}
		});
		// prevent default submit button behaviour:
		return false;
	}
	// wire client validation
	$("#contactform").validate({
		submitHandler: AjaxSubmit
	});
});