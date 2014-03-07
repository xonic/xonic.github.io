
//The build will inline common dependencies into this file.
requirejs.config(
{
	paths:
	{
		// Libraries
		'jquery'					: '../js/vendor/jquery-1.10.2',
		'modernizr'					: '../js/vendor/modernizr',
		'selectivizr'				: '../js/vendor/customized/selectivizr',

		// Custom modules
		'slider'					: '../js/modules/Slider'
	},

	shim:
	{
		// Since it's not require-jquery.js
		// we need to shim it.
		'jquery':
		{
			exports: '$'
		},

		'modernizr':
		{
			exports: 'Modernizr'
		}
	}
});

require(["slider", "modernizr", "selectivizr"], function(Slider, Modernizr, Selectivizr)
{
	// Add this event listener to prevent mobile safari 
	// from disabling the ::active pseudo class
	document.addEventListener("touchstart", function() {});

	// Check if we need Selectivizr
	if (!Modernizr.mq('only all'))
	{
		var slvzr = new Selectivizr();
		slvzr.startup();
	}

	// Initialize Slider
	if(!Modernizr.touch && document.querySelector(".slider") !== null)
	{
		Slider.init();
	}
				
});