// HoverForMore.js v1.2.1
// ----------------------
// Author: Luke Dennis
// Website: http://lukifer.github.com/HoverForMore.js
// License: http://opensource.org/licenses/mit-license.php

;(function($, window)
{
	var isjQuery = !!$.fn.jquery;

	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isMobile  = /Mobile/ .test(navigator.userAgent);

	var defaults = {
		"speed": 60.0,
		"gap": 20,
		"loop": true,
		"removeTitle": true,
		"snapback": true,
		"alwaysOn": false,
		"addStyles": true,
		"target": false,
		"startEvent": isMobile ? "touchstart" : (isjQuery ? "mouseenter" : "mouseover"),
		"stopEvent":  isMobile ? "touchend"   : (isjQuery ? "mouseleave" : "mouseout" )
	};


	$.fn['hoverForMore'] = function(options)
	{
		var self = this;
		var head = document.getElementsByTagName('head')[0];
		var originalOverflow, originalOverflowParent, startTime;

		options = $.extend({}, defaults, options);

		var targetSelector = options.target || self.selector;
		
		// Always-on without looping is just silly
		if(options.alwaysOn)
		{
			options.loop = true;
			options.startEvent = "startLooping"; // only triggered programmatically
		}

		// Detect CSS prefix and presence of CSS animation
		var hasAnimation = document.body.style.animationName ? true : false,
			animationString = 'animation',
			transitionString = 'transition',
			transformString = 'transform',
			keyframePrefix = '',
			domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			pfx  = '';
	
		// Find the CSS prefix, if necessary
		if( hasAnimation === false )
		for( var i = 0; i < domPrefixes.length; i++ )
		{
			if( document.body.style[ domPrefixes[i] + 'AnimationName' ] === undefined )
				continue;
			
			pfx = domPrefixes[ i ];
			animationString = pfx + 'Animation';
			transitionString = pfx + 'Transition';
			transformString = pfx + 'Transform';
			cssPrefix = '-' + pfx.toLowerCase() + '-';
			hasAnimation = true;
			break;
		}

		// Auto-add ellipsis and such
		if(options.addStyles)
		{
			head.appendChild($(
			'<style type="text/css">'
			+	self.selector+'{'
			+		'cursor:default;'
			+		'text-align:left;'
			+		'display:block;'
			+		'overflow:hidden;'
			+		'white-space:nowrap;'
			+		'text-overflow:ellipsis;'
			+		cssPrefix+'user-select: none;'
			+	'}</style>')[0]);
		}
		
		// Non-animation fallback. TODO: Animate with jQuery instead
		if(!hasAnimation)
		{
			// Fallback to title text hover
			$(options.target || self.selector).each(function(n, el)
			{
				var $el = $(el);
				$el.attr("title", $.trim($el.text()));
			});
			return self;
		}
		
		// Keyframes are only used in loop mode
		if(options.loop)
		{
			// Attach global style
			var $keyframeStyle = $('<style type="text/css"></style>');
			var $keyframeStyleReverse = $('<style type="text/css"></style>');
			head.appendChild($keyframeStyle[0]);
			head.appendChild($keyframeStyleReverse[0]);
		}
		
		// For non-loop mode, set an empty transform value (FireFox needs this to transition properly)
		else
		{
			$(self.selector).each(function(n, el)
			{	el.style[transformString] = 'translateX(0px)';
			});
		}
		
		
		// Attach start event
		$(targetSelector).live(options.startEvent, function(e)
		{
			startTime = (new Date()).getTime();
		
			// Get hovered item, and ensure that it contains an overflown item
			var $item = $(options.target ? self.selector : this).filter(":first");
			if(!$item.length) return true;

			var $parent = $item.parent();
			var pixelDiff = $item[0].scrollWidth - $item.width();

			if(pixelDiff <= 0) // && !options.alwaysOn // TODO: <marquee> without overflow
				return true;
			
			if(options.removeTitle) $item.removeAttr("title");
			
			// Over-ride the text overflow, and cache the overflow css that we started with
			originalOverflowParent = originalOverflowParent	|| $parent.css("overflow");
			originalOverflow       = originalOverflow       || $item  .css("overflow");
			
			$parent.css("overflow", "hidden");
			if(isMobile && options.addStyles)
				$('body').css(cssPrefix+"user-select", "none");

			$item
				.css("overflow", "visible")
				.addClass("scrolling");
			
			if(options.loop)
			{
				// Remove a previous clone
				$item.children(".hoverForMoreContent").remove();

				// Attach a duplicate string which will allow content to appear wrapped
				var $contentClone = $('<span class="hoverForMoreContent" />')
					.css({"paddingLeft": parseInt(options.gap)+"px"})
					.text($item.text());

				$item.append($contentClone);
				var contentWidth = ($contentClone.width() + parseInt(options.gap));
	
				// Build keyframe string and attach to global style
				var keyframes = '@' + cssPrefix + 'keyframes hoverForMoreSlide { '
				+		'from {' 	+ cssPrefix + 'transform:translateX( 0 ) }'
				+		  'to {' 	+ cssPrefix + 'transform:translateX( -'+contentWidth+'px ) }'
				+	'}';
				$keyframeStyle[0].innerHTML = keyframes;
				
				// Go go gadget animation!
				var sec = contentWidth / parseFloat(options.speed);

				$item[0].style[animationString] = 'hoverForMoreSlide '+sec+'s linear infinite';
			}

			else // if(!options.loop)
			{
				var sec = pixelDiff / parseFloat(options.speed);

				// Apply transition + transform instead of looping
				$item[0].style[transitionString] = cssPrefix+'transform '+sec+'s linear';
				
				// Alas, Firefox won't honor the transition immediately
				if(!isFirefox)
					$item[0].style[transformString] = 'translateX(-'+pixelDiff+'px)';
				
				else setTimeout(function()
				{
					$item[0].style[transformString] = 'translateX(-'+pixelDiff+'px)';
				}, 0);
			}
		});



		// Attach stop event
		if(!options.alwaysOn)
		$(targetSelector).live(options.stopEvent, function(e)
		{
			var $item = $(options.target ? self.selector : this).filter(":first");
			if(!$item.length) return true;
		
			if(options.loop)
			{
				if(options.snapback)
				{
					// Reverse our animation
					var contentWidth = $item.children('.hoverForMoreContent').width() + parseInt(options.gap);
					var timeDiff = ((new Date()).getTime() - startTime)*0.001;
					var offsetX = (timeDiff * options.speed) % contentWidth;
					var switchDirection = offsetX > (contentWidth/2);
	
					// Build keyframe string and attach to global style
					var keyframes = '@' + cssPrefix + 'keyframes hoverForMoreSlideReverse { '
					+		'from {' 	+ cssPrefix + 'transform:translateX( '+(0 - offsetX)+'px ) }'
					+		  'to {' 	+ cssPrefix + 'transform:translateX( '
					+									(switchDirection ? 0-contentWidth : 0)+'px ) }'
					+	'}';
					$keyframeStyleReverse[0].innerHTML = keyframes;
	
					var sec = (switchDirection ? contentWidth-offsetX : offsetX) * 0.2 / parseFloat(options.speed);
					$item[0].style[animationString] = 'hoverForMoreSlideReverse '+(sec>1?1:sec)+'s linear';
	
					$item.removeClass("scrolling");
	
					// After animation resolves, restore original overflow setting, and remove the cloned element
					setTimeout(function()
					{
						if($item.is(".scrolling")) return;
						
						$item
							.children(".hoverForMoreContent")
							.remove();
							
						$item.css("overflow", originalOverflow);
						$item.parent().css("overflow", originalOverflowParent);

						if(isMobile && options.addStyles)
							$('body').css(cssPrefix+"user-select", 'text');
					}, (sec * 1000) - -50);
				}
				
				else // if(!options.snapback)
				{
					$item[0].style[animationString] = '';

					$item
						.css("overflow", originalOverflow)
						.find(".hoverForMoreContent")
						.remove();			
							
					$item.parent().css("overflow", originalOverflowParent);

					if(isMobile && options.addStyles)
						$('body').css(cssPrefix+"user-select", 'text');
				}
			}
			
			else // if(!options.loop)
			{
				var timeDiff = ((new Date()).getTime() - startTime) / 1000.0;
				var match = $item[0].style[transitionString].match(/transform (.*)s/);
				var sec = (match && match[1] && parseFloat(match[1]) < timeDiff) ? parseFloat(match[1]) : timeDiff;
				sec *= 0.5;

				if(!options.snapback)
					$item[0].style[transitionString] = '';
				else
					$item[0].style[transitionString] = cssPrefix+'transform '+sec+'s linear';

				$item.removeClass("scrolling")
				
				// Firefox needs a delay for the transition to take effect
				if(!isFirefox)
					$item[0].style[transformString] = 'translateX(0px)';
					
				else setTimeout(function(){
					$item[0].style[transformString] = 'translateX(0px)';
				}, 0);
				
				if(!options.snapback)
				{
					$item.css("overflow", originalOverflow);

					if(isMobile && options.addStyles)
						$('body').css(cssPrefix+"user-select", 'text');
				}

				else // if(options.snapback)
				{
					setTimeout(function()
					{
						if($item.is(".scrolling")) return;
						$item.css("overflow", originalOverflow);

						if(isMobile && options.addStyles)
							$('body').css(cssPrefix+"user-select", 'text');
					}, sec * 1000);
				}
			}
		
		});
		
		
		// To manually refresh active elements when in always-on mode
		self.refresh = function()
		{
			$(self.selector).each(function(n,el)
			{
				$(el).not(".scrolling").trigger(options.startEvent);
			})
		};

		
		// Always-on mode, activate! <marquee>, eat your heart out.
		if(options.alwaysOn)
			self.refresh();
		
		return self;
	};
	
})(window.jQuery || $);
