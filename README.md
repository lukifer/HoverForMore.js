HoverForMore.js
===============

#### { [text-overflow: ellipsis;][] } on steroids ####
  
Example: http://lukifer.github.com/HoverForMore.js

 * Two handy modes: Scroll-To-End and Looping
 * Requires [jQuery][] or [Zepto][].
 * Lightweight: Less than 2k when minified+gzipped
 * Uses CSS3 animations & transitions, with GPU acceleration where available
 * Supports all modern browsers: Chrome, Firefox, Safari, IE10, iOS, & Android
 * Degrades gracefully on IE7-IE9
 * MIT Licensed

### Coming Soon ###
 * Full support for IE7-9
 * You tell me!


Usage
-----

```HTML
<div style="width: 100px;">
  <div class="overflowing">
		Lorem ipsum dolor sit amet, consectetur adipiscing.
	</div>
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
	loop: true,			// Scroll to the end and stop, or loop continuously?
	gap: 20,			// When looping, insert this many pixels of blank space
	target: false,		// Hover on this CSS selector instead of the text line itself
	removeTitle: true,	// By default, remove the title attribute, as a tooltip is redundant
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
		
**Q: Do I need to add any CSS for this to work?**

A: Technically, no. Target a block element with too much text to fit within its parent, and this plugin does the rest.

However, to prevent a Flash of Unstyled Content and support users without Javascript, it is strongly recommended you also add the three CSS rules displayed above.


**Q: I'm seeing a visual flicker when hovering on items in Chrome/Safari.**

A: That's not a question. But it's a known issue with GPU accelerated CSS3 on WebKit.

You can correct this by adding `-webkit-transform: translateZ(0);` to the `<body>`. If that doesn't work, try adding `-webkit-transform-style: preserve-3d;` or `-webkit-transform-style: flat;` to the affected items.

		
**Q: Shouldn't you just design your layout around your content, thus making this plugin unnecessary?**

A: Yes. No. Shut up. Hey, what's that behind you? ...No, the other behind you.


Version History
---------------
### v1.1 ###
 * Attaching hover target to arbitrary CSS selector
 * Firefox bug fixes
 * Documentation and examples

### v1.0 ###
 * Initial release into the wild


Contact
-------
Luke Dennis  
http://lukifer.net  
[@lkfr][]

 
[text-overflow: ellipsis;]: http://www.quirksmode.org/css/textoverflow.html
[jQuery]: http://jquery.com
[Zepto]: http://zeptojs.com
[@lkfr]: http://twitter.com/lkfr