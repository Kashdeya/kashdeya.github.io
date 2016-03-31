/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

/**
 * jQuery.LocalScroll - Animated scrolling navigation, using anchors.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 * @author Ariel Flesler
 * @version 1.2.7
 **/
;(function($){var l=location.href.replace(/#.*/,'');var g=$.localScroll=function(a){$('body').localScroll(a)};g.defaults={duration:1e3,axis:'y',event:'click',stop:true,target:window,reset:true};g.hash=function(a){if(location.hash){a=$.extend({},g.defaults,a);a.hash=false;if(a.reset){var e=a.duration;delete a.duration;$(a.target).scrollTo(0,a);a.duration=e}i(0,location,a)}};$.fn.localScroll=function(b){b=$.extend({},g.defaults,b);return b.lazy?this.bind(b.event,function(a){var e=$([a.target,a.target.parentNode]).filter(d)[0];if(e)i(a,e,b)}):this.find('a,area').filter(d).bind(b.event,function(a){i(a,this,b)}).end().end();function d(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')==l&&(!b.filter||$(this).is(b.filter))}};function i(a,e,b){var d=e.hash.slice(1),f=document.getElementById(d)||document.getElementsByName(d)[0];if(!f)return;if(a)a.preventDefault();var h=$(b.target);if(b.lock&&h.is(':animated')||b.onBefore&&b.onBefore.call(b,a,f,h)===false)return;if(b.stop)h.stop(true);if(b.hash){var j=f.id==d?'id':'name',k=$('<a> </a>').attr(j,d).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});f[j]='';$('body').prepend(k);location=e.hash;k.remove();f[j]=d}h.scrollTo(f,b).trigger('notify.serialScroll',[f])}})(jQuery);

// MAIN startup script
$(document).ready(function(){
	// global scroll settings:
	 var scroll={
		easing: 'linear', // elasout, swing, linear
		hash: true,
		duration: 400,
		axis:'x',
		offset: {left:0, top:180},
		target: '#pages',
		//filter: '#logo a.name, #nav ul li a, .page a:not(.noscroll)',
		filter: '#nav ul li a, .page a:not(.noscroll)',
		onBefore: PreScroll,
		onAfter: PostScroll
	};

	// scroll on load if there's a hash (#something):
	$.localScroll.hash(scroll);
	// and on all elemtns with href=#elementID
	$.localScroll(scroll);

	function PreScroll(ev,el) {
		// disable scrolling if element is already marked as active (in navigation & pages)
		if($(el).hasClass('active'))
			return false;
		FadeOut();
	}

	function PostScroll(el) {
		// mark navigation element active for selected page:
		$('#nav ul li a[href="#' + $(el).attr('id') + '"]').addClass('active');
		// set the page 'active'
		$(el).addClass('active').siblings().removeClass('active');
		// increase the height of the pages div to fit the content of new page (if needed)
		$('#pages').css('height',$(el).height());
		 // prevent scroll jump
		 $('html,body,#pages').scrollTop(0);
		FadeIn();
	}
	
	// set back opacity
	function FadeIn() {
		if(!$.browser.msie)
			$('#pages-scroller').animate({opacity:1},200);
	}

	// set opacity lower
	function FadeOut() {
		if(!$.browser.msie)
			$('#pages-scroller').animate({opacity:.3},200);
	}

	// highlight in main menu what's active
	$('#nav ul li a').click(function(){
		if($(this).hasClass('active'))
			return false;
		var $sib=$(this).addClass('active').parent('li').siblings().find('a').removeClass('active');
		 Cufon.refresh();
	});
	
	// * roundabout fix:
	$('li.roundabout-in-focus a').live('click',function(){
		FadeOut();
		$('#pages').scrollTo($(this).attr('href'), scroll);
		window.location.hash=$(this).attr('href');
		FadeIn();
	});

	// * Logo: link whole logo to name link
	$('#logo').click(function(){
		if($('#homepage').hasClass('active'))
			return false;
		$('#nav ul li a').removeClass('active');
		FadeOut();
		$('#pages').scrollTo($(this).find('a.name').attr('href'), scroll);
		FadeIn();
		window.location.hash='';
		return false;
	});
});