---
layout: post
title:  "An improved Sass rem mixin for unitless numbers"
date:   2012-11-23
categories: sass
---

Since we started using Sass in our projects here at intuio, our workflow has improved a lot. There are a lot of useful mixins out there, let alone the comprehensive compass mixins library. Given the fact that most of our projects are to be designed responsive, we do only use relative sizing units. While ‘em’ units can cause a lot of headache because it’s up to you to always calculate the desired values, ‘rem’ units are a great relief for every designer.

As [Jonathan Snook explained before](http://snook.ca/archives/html_and_css/font-size-with-rem "View article"), using ‘rem’ with a ‘px’ fallback is perfectly fine for all major browsers (including IE8) and there is a [nice mixin for setting the font-size](http://css-tricks.com/snippets/css/less-mixin-for-rem-font-sizing/ "View article") by Chris Coyier. Heck, there’s even a [very similar mixin](https://gist.github.com/1134548 "View article") published by bitmanic but none of these perfectly fit our needs. We love to work with unitless variables, which is why I created (yet) another mixin that covers just that coding style. Lets dig into some code…

## Assumptions

There are a couple of assumptions:

* You use unitless numbers
* Your html font-size is set to 62.5%

{% highlight scss %}
$htmlFontSize: 62.5%; // Set the font-size to 10px
$bodyFontSize: 1.6; // Unitless number, equals 16px
{% endhighlight %}

## The @mixin

So far so good, now let’s look at the mixin.

{% highlight scss %}
// Mixin that allows to specify arbitrary CSS properties with
// unitless numbers. The output has rem unit with pixel fallback.
// Shorthand assignments are supported too!
$base_line: 10;

@mixin rem($property, $values)
{
  // Placeholder variables
  $shorthand_px:  "";
  $shorthand_rem: "";

  // Parameter $values might be a list of elements
  @each $value in $values
  {
    // Current value is a valid number and greater than 0
    @if $value != auto and $value != 0
    {
      // Add 'px' and 'rm' to the current value and store in
      // placeholder variables
      $shorthand_px: #{ $shorthand_px + " " + $value * $base_line + px };
      $shorthand_rem: #{ $shorthand_rem + " " + $value + rem };
    }
    // Current value is 'auto' or 0
    @else
    {
      // Add only 'auto' or 0 to the placeholder variables
      $shorthand_px: #{ $shorthand_px + " " + $value };
      $shorthand_rem: #{ $shorthand_rem + " " + $value };
    }
  }

  // Output the CSS property in pixels and rems
  #{$property}:$shorthand_px;
  #{$property}:$shorthand_rem;
}
{% endhighlight %}

## Usage

{% highlight scss %}
body
{
  @include rem(font-size, $bodyFontSize);
  @include rem(padding, 0 $bodyFontSize);
}

.wrapper
{
  @include rem(margin, 0 auto $bodyFontSize);
}
{% endhighlight %}

## Output

{% highlight css %}
body
{
  font-size:16px;
  font-size:1.6rem;

  padding:0 16px;
  padding:0 1.6rem;
}

.wrapper
{
  margin:0 auto 16px;
  margin:0 auto 1.6rem;
}
{% endhighlight %}

## Conclusion

So, if you’re working with unitless number as we do, this little mixin might come in handy. I am sure there is room for improvement and I would love to hear any suggestions. Happy coding!