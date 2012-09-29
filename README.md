HoverForMore.js
===============

## { text-overflow: ellipsis; } on steroids ##

Example: http://lukifer.github.com/HoverForMore.js

 * Requires your choice of [jQuery][] or [Zepto][].
 * Lightweight: Less than 2k when minified+gzipped
 * Uses HTML5 animations & transitions, with GPU acceleration where possible
 * Supports all modern browsers: Chrome, Firefox, Safari, IE10, iOS, & Android
 * Degrades gracefully on IE7-IE9, using title attribute and text-overflow: ellipsis
 * MIT License

##### Coming Soon #####
 * Full support for IE7-9
 * Ability to hover on different CSS selector than the text being scrolled.
 * You tell me!


Usage
-----

```HTML
<div>
  <span class="overflowing">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	</span>
</div>
```

```CSS
.overflowing {
	white-space: none;
	overflow: hidden;
	text-overflow: ellipsis;
}
```

```Javascript
$(".overflowing").hoverForMore({
	speed: 60.0,		// Measured in pixels-per-second
	loop: true,		// Scroll to the end and stop, or loop continuously?
	gap: 15,		// When looping, insert this many pixels of blank space
	removeTitle: true,	// By default, remove the title, as a tooltip is redundant
	snapback: true,		// Animate when de-activating, as opposed to instantly reverting
	addStyles: true,	// Auto-add CSS; leave this on unless you need to override default styles
	alwaysOn: false,	// If you're insane, you can turn this into a <marquee> tag. (Please don't.)

	// In case you want to alter the events which activate and de-activate the effect:
	startEvent: "mouseenter",
	stopEvent: "mouseleave"
});
```

Fervently Asked Questions
-------------------------
		
**Q: Do I need any CSS of my own for this to work?**

A: Technically, no. The element you're targeting simply needs to be an inline element with too much text to fit within its parent block element; this plugin does the rest.

However, to prevent a Flash of Unstyled Content and support Javascript-less users, it is strongly recommended you also add the three CSS rules displayed above.
		
**Q: Shouldn't you just design your layout around your content, thus making this plugin unnecessary?**

A: Yes. No. Shut up. Hey, what's that behind you? ...No, the other behind you.


Version History
---------------
### v1.0 ###
 * Initial release into the wild.
 * Documentation and examples


Contact
-------
Luke Dennis
http://lukifer.net
[@lkfr][]

 
[jQuery]: http://jquery.com
[Zepto]: http://zeptojs.com
[@lkfr]: http://twitter.com/lkfr