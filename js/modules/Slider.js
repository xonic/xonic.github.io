// Module definition
define(["jquery"], function(jQuery) {
    var ScrollController = {
        scroller: undefined,
        scroll_container: undefined,
        scroll_dir: undefined,
        item: undefined,
        item_width: undefined,
        mod: undefined,
        pos: undefined,
        direction_nav: undefined,

        rateLimitTimer: [],


        init: function() {
            this.scroller = jQuery(".slider");
            this.scroll_container = jQuery(".slides");
            this.scroll_dir = jQuery(".slider__prev, .slider__next");
            this.direction_nav = jQuery(".slider__controls");
            this.bindListeners();

            this.item = this.scroll_container.children(":first-child");
        },

        bindListeners: function() {
            var self = this;
            jQuery(this.scroll_dir).on("click", function(e) {
                self.clickHandler.call(self, e);
            });
            jQuery(this.scroller).on("scroll", function(e) {
                self.scrollHandler.call(self, e);
            });
        },

        clickHandler: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.item_width = Math.floor(this.item.outerWidth(true));
            this.pos = this.scroller.scrollLeft();
            this.mod = this.pos % this.item_width;

            if (jQuery(e.currentTarget).hasClass("slider__prev")) {
                if (this.mod === 0) this.mod = this.item_width;
                this.scroller.stop().animate({
                    scrollLeft: this.pos - this.mod
                }, {
                    duration: 500,
                    easing: "swing"
                });
            } else {
                this.scroller.stop().animate({
                    scrollLeft: this.item_width - this.mod + this.pos
                }, {
                    duration: 500,
                    easing: "swing"
                });
            }


        },

        scrollHandler: function(e) {
            var self = this;
            this.limitExecRate(200, "slide_scroll", this.toggleDirectionNav, self);
        },

        toggleDirectionNav: function() {
            this.pos = this.scroller.scrollLeft();

            if (this.pos === 0) {
                this.direction_nav.addClass("slider__controls--is-start").removeClass("slider__controls--is-end");

            } else if (this.pos + 2 >= Math.floor(this.scroll_container.outerWidth() - this.scroller.outerWidth())) {
                this.direction_nav.addClass("slider__controls--is-end").removeClass("slider__controls--is-start");
            } else {
                this.direction_nav.removeClass("slider__controls--is-start slider__controls--is-end");
            }
        },

        limitExecRate: function(ms, fname, fn) {
            // 
            var args = Array.prototype.slice.call(arguments),
                self = this;

            // If the passed in function already exists, 
            // the timer gets resetted
            this.rateLimitTimer[fname] && clearTimeout(this.rateLimitTimer[fname]);

            // Set a new timer
            this.rateLimitTimer[fname] = setTimeout(function() {
                // Call the passed in function with the rest 
                // of the parameters (args.slice(3,4)[0] = IndicatorView)
                // fun.apply(thisArg[, argsArray]) --> thisArg = value of this, 
                // argsArray = additional params to pass to the function
                fn.apply(args.slice(3, 4)[0], []);

                // The timer was completed, the function executed.
                // Reset the limiter array
                self.rateLimitTimer[fname] = null;
            }, ms);
        }
    };

    return ScrollController;
});