---
layout: post
title:  "Don’t use data attributes to find HTML elements with JS"
date:   2013-07-17
categories: javascript best-practices
---

## The HTML5 data attribute

With the introduction of HTML5, JavaScript developers have been blessed with a new customizable and highly flexible HTML tag attribute: the data attribute. Using this attribute to store small chunks of arbitrary data, developers are able to avoid unneccessary AJAX calls and enhance user experience. The W3C specification defines the data attribute as follows:

<figure class="blockquote">
	<blockquote>
		A custom data attribute is an attribute in no namespace whose name starts with the string “data-”, has at least one character after the hyphen, is XML-compatible, and contains no uppercase ASCII letters.

		Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements.
 
		These attributes are not intended for use by software that is independent of the site that uses the attributes.

		Every HTML element may have any number of custom data attributes specified, with any value.
	</blockquote>
	<figcaption class="blockquote__source"><a href="http://www.w3.org/html/wg/drafts/html/master/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes" title="View source">W3C specification (Editor’s Draft)</a></figcaption>
</figure>

## How it should be used

The data attribute is meant to store small amounts of invisible data which is not crucial to the user and might become visible later on. If the data is crucial to the user, it should be presented in a visible and more accessible way. Information contained in the data attribute can only become visible through JavaScript or through the CSS `content` property.

Let’s look at a simple example of proper usage. On the website of a car rental company we find a list of available cars. Usually available colors are not very important to customers looking to rent a car for a couple of days. That’s going to be our invisible, low priority data.

### HTML

{% highlight html %}
<ul class="cars">
 <li data-colors="white, red, yellow">Fiat 500</li>
 <li data-colors="white, black">BMW M3</li>
 <li data-colors="white, black, blue">Audi R8 Coupe</li>
</ul>
{% endhighlight %}

If we wanted to show the data to our users when they click on a list element, we could easily achieve this with some JavaScript.

### JavaScript

{% highlight javascript %}
var cars = document.querySelector(".cars");

cars.addEventListener("click", function(e)
{
  alert("Available colors: " + e.target.dataset.colors);
});
{% endhighlight %}

[Try it yourself](http://codepen.io/anon/pen/tfExB "Show interactive code")

This is all very basic stuff but it clearly demonstrates one way the data attribute can and should be used. Of course there are other situations where the data attribute comes in handy. Say you want to dynamically load a video object. The data attribute would then hold some metadata, i. e. duration, bitrate, codec… you get the point.

## How I have used it

It always bugged me that dependencies between styling (CSS) and logic (JS) arise through shared classes. The class `cars` for example can be used in CSS as well as in JS.

### CSS

{% highlight css %}
.cars
{
 list-style-type:none;
}
{% endhighlight %}

### JavaScript

{% highlight javascript %}
var list = document.querySelector(".cars");
{% endhighlight %}

As we can see, both CSS and JS use the same class to get their job done. But one fine day the CEO of the rental company might decide that it would be totally awesome to extend their offer and include motorcycles for rent. Let’s assume that the integration of motorcycles would require some CSS refactoring. The developer renames the HTML class from `cars` to `vehicles`. Through this change both CSS and JS won’t work anymore. Of course, the developer should know and check both, but it would be nice if this wasn’t necessary. With the new data attribute at hand, the idea of using the `[data-foo='bar']` selector in JavaScript came along.

### HTML

{% highlight html %}
<ul class="vehicles" data-list="cars">
 <li data-colors="white, red, yellow">Fiat 500</li>
 <li data-colors="white, black">BMW M3</li>
 <li data-colors="black, blue">Audi R8 Coupe</li>
</ul>
{% endhighlight %}

### JavaScript

{% highlight javascript %}
var cars = document.querySelector("[data-list='cars']");
cars.addEventListener("click", function(e)
{
  alert("Available colors: " + e.target.dataset.colors);
});
{% endhighlight %}

[Try it yourself](http://codepen.io/anon/pen/csrbK "Show interactive code")

We instantly see the benefit of this approach: renaming the class is not going to affect the functionality of our JavaScript components. In this specific example although, there is the drawback of having a too specific name for the JS module and that just feels wrong. In real life one should try to generalize the name of a JS component to describe its functionality, regardless of the content. A more scalable and robust module could look like this:

### HTML

{% highlight html %}
<ul class="vehicles" data-list="interactive">
 <li data-additional-info="white, red, yellow">Fiat 500</li>
 <li data-additional-info="white, black">BMW M3</li>
 <li data-additional-info="black, blue">Audi R8 Coupe</li>
</ul>
{% endhighlight %}

The names of the data attributes are no more associated to the content within the module. This way we can use it throughout the whole site.

Trying to decouple CSS and JS by using data attributes is not a new thing. Roy Tomeij adviced to [use data attributes to find HTML elements with JS](http://roytomeij.com/2012/dont-use-class-names-to-find-HTML-elements-with-JS.html "View article") before and I have seen others do the same.

## So what’s wrong with it?

Well, for one there are performance issues. Measured in percentages, selecting DOM elements based on data attributes can be significantly slower than classes. In his follow up article, Roy Tomeij analyzes the exact [differences in performance](http://roytomeij.com/2012/follow-up-don-t-use-class-names-to-find-html-elements-with-js.html "View article"). According to him, this is only an issue for very large and complex sites. I think he is right. But then again, performance is always an issue and I don’t consider avoiding data attributes for selection to be premature optimization.

Besides the performance issue, what bothers me more is the fact that the data attribute, by definition, is just not intended to be used that way. Remember the W3C definition?

<figure class="blockquote">
	<blockquote>
		[...] Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements. [...]
	</blockquote>
	<figcaption class="blockquote__source"><a href="http://www.w3.org/html/wg/drafts/html/master/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes" title="View source">W3C specification (Editor’s Draft)</a></figcaption>
</figure>

That’s it. Nothing more, nothing less. And that is why at the end of the day I don’t feel comfortable with using data attributes to select DOM nodes. Period.

## Use prefixed classes instead!

The trick is to rely on classes for DOM node selection in JavaScript to gain performance but to use a naming convention and strictly separate styling classes from logic classes. Applying this technique, our car rental website could look like this:

### HTML

{% highlight html %}
<ul class="vehicles js-interactive-list">
 <li data-additional-info="white, red, yellow">Fiat 500</li>
 <li data-additional-info="white, black">BMW M3</li>
 <li data-additional-info="black, blue">Audi R8 Coupe</li>
</ul>
{% endhighlight %}

### CSS

{% highlight css %}
.vehicles
{
 list-style-type:none;
 margin:0;
 padding:0;
}
{% endhighlight %}

### JavaScript

{% highlight javascript %}
var list = document.querySelector(".js-interactive-list");

list.addEventListener("click", function(e)
{
  alert("Available colors: " + e.target.dataset.additionalInfo);
});
{% endhighlight %}

[Try it yourself](http://codepen.io/anon/pen/DrHBG "Show interactive code")

We see the classes used in JavaScript are prefixed with `js-`. **These classes must never be used for styling!** Only that way we can assure that CSS and JS are decoupled and less of a PITA when it comes to refactoring.