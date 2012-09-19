// jQuery.hoverForMore v1.0
// --------------------------
// Author: Luke Dennis
// Website: http://lukifer.net/hover-for-more
// License: http://opensource.org/licenses/mit-license.php

;(function($, window, undefined)
{
	var isjQuery = !!$.fn.jquery;

	var defaults = {
		"speed": 60.0,
		"gap": 15,
		"loop": true,
		"removeTitle": true,
		"snapback": true,
		"alwaysOn": false,
		"addStyles": true,
		"startEvent": isjQuery ? "mouseenter" : "mouseover",
		"stopEvent": isjQuery ? "mouseleave" : "mouseout",
	};


	$.fn['hoverForMore'] = function(options)
	{
		var self = this;
		var head = document.getElementsByTagName('head')[0];
		var originalOverflow, originalOverflowParent, startTime;

		options = $.extend({}, defaults, options);
		
		// Always-on without looping is just silly
		if(options.alwaysOn)
		{
			options.loop = true;
			options.startEvent = "startLooping"; // only triggered programmatically
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
			+	'}</style>')[0]);
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
		
		// Non-animation fallback. TODO: Animate with jQuery instead?
		if(!hasAnimation)
		{
			// Fallback to title text hover
			$item.attr("title", $item.text());
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
		
		// Attach start event
		$(self.selector).live(options.startEvent, function(e)
		{
			startTime = (new Date()).getTime();
		
			// Get hovered item, and ensure that it contains an overflown item
			var $item = $(this);
			var $parent = $item.parent();
			var pixelDiff = this.scrollWidth - $item.width();

			if(pixelDiff <= 0) // && !options.alwaysOn
				return true;
			
			if(options.removeTitle) $item.removeAttr("title");
			
			// Over-ride the text overflow, and cache the overflow css that we started with
			originalOverflowParent = originalOverflowParent	|| $parent.css("overflow");
			originalOverflow       = originalOverflow       || $item  .css("overflow");
			
			$parent.css("overflow", "hidden");
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

				this.style[animationString] = 'hoverForMoreSlide '+sec+'s linear infinite';
			}

			else // if(!options.loop)
			{
				var sec = pixelDiff / parseFloat(options.speed);

				// Apply transition + transform instead of looping
				this.style[transitionString] = cssPrefix+'transform '+sec+'s linear';
				this.style[transformString] = 'translateX(-'+pixelDiff+'px)';				
			}
		});


		// Attach stop event
		if(!options.alwaysOn)
		$(self.selector).live(options.stopEvent, function(e)
		{
			var $item = $(this);
		
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
					this.style[animationString] = 'hoverForMoreSlideReverse '+(sec>1?1:sec)+'s linear';
	
					$item.removeClass("scrolling");
	
					// After animation resolves, restore original overflow setting, and remove the cloned element
					setTimeout(function(){
						if($item.is(".scrolling")) return;
						$item
							.children(".hoverForMoreContent")
							.remove();
						$item.css("overflow", originalOverflow);
						$item.parent().css("overflow", originalOverflowParent);
					}, sec * 1000 - -50);
				}
				
				else // if(!options.snapback)
				{
					this.style[animationString] = '';

					$item
						.css("overflow", originalOverflow)
						.find(".hoverForMoreContent")
						.remove();			
							
					$item.parent().css("overflow", originalOverflowParent);
				}
			}
			
			else // if(!options.loop)
			{
				if(!options.snapback)
					this.style[transitionString] = '';								

				$item.removeClass("scrolling")
				this.style[transformString] = 'translateX(0px)';
				
				if(!options.snapback)
					$item.css("overflow", originalOverflow);

				else // if(options.snapback)
				{
					var sec = (this.scrollWidth - $item.width()) / parseFloat(options.speed);
					setTimeout(function() {
						if($item.is(".scrolling")) return;
						$item.css("overflow", originalOverflow);
					}, (sec * 1000 - -50));
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
