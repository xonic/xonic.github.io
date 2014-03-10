
require(["slider", "modernizr", "selectivizr"], function(Slider, Modernizr, Selectivizr)
{
	// Add this event listener to prevent mobile safari 
	// from disabling the ::active pseudo class
	document.addEventListener("touchstart", function() {});

	// Deobfuscate email address
	var links = $(".js-deobfuscate");
	links.attr("href", links.attr("href").split("(at)").join("@"));

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