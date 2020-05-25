/**
 *
 *  Main JavaScript
 *
 *  @package gleesik_scripts
 *
 **/

// IIFE - Immediately Invoked Function Expression
(function ($, window, document) {

    // The $ is now locally scoped
    $.fn.exists = function(fn) { if ($(this).length) fn(); };

    // Listen for the jQuery ready event on the document
    $(function () {

        // The DOM is ready!

        // Global Variables
        var $window = $(window);

        function rgba(e, alpha) { //e = jQuery element, alpha = background-opacity
            var b = e.css('backgroundColor');
            e.css('backgroundColor', 'rgba' +
                b.slice(b.indexOf('('), (b.match(/,/g).length === 2) ? -1 : b.lastIndexOf(',')) + ', ' + alpha + ')');
        }

        $('.site-navigation-bar').exists(function() {
            var navBar = $('.site-navigation-bar');
            rgba(navBar, Math.min(1.0, window.pageYOffset/$('.site-header').height()));

            $(window).scroll(function() {
                var opacity = Math.min(1.0, window.pageYOffset/$('.site-header').height());
                rgba(navBar, opacity);
            });
        });

        /**
         *  Page Loader
         **/
        setTimeout(function () {
            $('.page-loader').addClass('load-complete');
        }, 1500);

        /**
         *  Parallax with Scrollax.js - Initialization
         **/
        'use strict';
        $.Scrollax();

        /**
         *  Main Menu Navigation
         **/
        var $body = $('body');
        var $nav_menu = $('.navigation-bar');
        var $nav_menu_link = $('#navMenu').find('ul li a');
        var $toggle_menu_button = $('.navTrigger');

        var $contact = $('#mc-embedded-subscribe-form');

        var $contactButton = $('#mc-embedded-subscribe');
        var $contactResult = $('#subscribe-result');

        $contact.submit(function (event, $form) {
            $contactButton.attr('disabled', true);
            $contactButton.text('Sending...');
            $.ajax({
                type: $contact.attr('method'),
                url: $contact.attr('action'),
                data: $contact.serialize(),
                cache: false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                error: function (err) {
                    $contactResult.html('Could not connect to the registration server. Please try again later.');
                },
                success: function (data) {
                    if (data.result === 'success') {
                        $contactButton.text("Success!");
                        $contactResult.html('Thank you for contacting us! A member of our team will reach out to you shortly.');
                    } else {
                        $contactButton.text("Try Again!");
                        $contactButton.attr('disabled', false);
                        $('#mce-EMAIL').css('borderColor', '#ff8282');
                        $contactResult.css('color', '#ff8282');
                        $contactResult.html(data.msg);
                    }
                }
            });

            event.preventDefault();
        });

        // Navigation Menu Link
        $nav_menu_link.on('click', function () {

            // Select Current Navigation Item
            $nav_menu_link.parent().removeClass('current-menu-item');
            $(this).parent().addClass('current-menu-item');

            // Close Mobile Menu
            $nav_menu.removeClass('active');
            $toggle_menu_button.removeClass('active');
            $body.removeClass('no-scroll');

        });

        // Toggle Mobile Menu
        $toggle_menu_button.on('click', function () {
            $nav_menu.toggleClass('active');
            $body.toggleClass('no-scroll');
            $(this).toggleClass('active');
        });

        // Remove all classes on window resize
        $window.on('resize', function () {
            $nav_menu.removeClass('active');
            $body.removeClass('no-scroll');
            $toggle_menu_button.removeClass('active');
        });

        /**
         *  Portfolio
         **/
        var $filter_menu_item = $('.filter-menu ul li');
        var $portfolio_grid = $('.portfolio-grid');
        var $portfolio_grid_item = $portfolio_grid.children(".item");
        var $overlay = $portfolio_grid.children("#overlay");
        var $img = '<img alt="Portfolio Overlay Image" />';
        var $data_filters = null;

        // Filter Menu
        $filter_menu_item.on('click', function () {

            // Filter Menu
            $filter_menu_item.removeClass('current');
            $(this).addClass('current');

            // Collecting Data Filters
            $data_filters = $(this).data('filter');

            // Hide All Portfolio Items
            if ($data_filters === 'all') {
                $portfolio_grid_item.addClass('visible');
            }
            else { // Show Portfolio Items from filter
                $portfolio_grid_item.removeClass('visible');
                $($data_filters).addClass('visible');
            }

        });

        // Show Image - Lightbox
        $portfolio_grid_item.find(".item-expand").on('click', function (e) {

            // Prevent Default Link Event
            e.preventDefault();

            // Get Image Link
            var $src = $(this).attr("href");

            // Create Image on the DOM
            $overlay.append($img);

            // Show Overlay Image
            $overlay.fadeIn(200).children("img").attr("src", $src);

            // Lock Body Scroll
            $body.toggleClass('no-scroll');

        });

        // Hide Overlay Lightbox
        $overlay.on('click', function () {

            // Hide Overlay Image
            $(this).fadeOut(200);

            // Remove Image from DOM
            $overlay.children("img").remove();

            // Unlock Body Scroll
            $body.toggleClass('no-scroll');

        });

        /**
         *  Scroll Event
         **/
        $window.scroll(function () {

            // Scroll Variables
            var $scrollTop = $window.scrollTop();
            var $windowHeight = $window.height();

            /**
             *  Go to Top Button
             **/
            var $go_top = $('.go-to-top-button');

            if ($scrollTop > 600) {
                $go_top.addClass('active');
            } else {
                $go_top.removeClass('active');
            }

            // Reveal Item on Scroll
            function revealItem($container, $item) {
                if ($scrollTop > ($container.offset().top - $windowHeight / 1.3 )) {

                    $item.each(function (i) {
                        setTimeout(function () {
                            $item.eq(i).addClass("is-showing");
                        }, 150 * (i + 1));
                    });

                }
            }

            // Portfolio Reveal Images
            $portfolio_grid.exists(function() {
                revealItem($portfolio_grid, $portfolio_grid_item);
            });

        });

        /**
         *  Testimonials Carousel Setup
         **/
        $("#testimonials-carousel").owlCarousel({

            navigation: true, // Show next & prev buttons
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: true

        });

        /**
         *  Smooth Scrolling for Links
         **/
        $('a[href*="#"]:not([href="#"])').on('click', function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });

    });

    $("#typed-tagline").exists(function() {
        new TypeIt('#typed-tagline', {
            speed: 50,
            autoStart: false,
            cursorChar: '_',
            nextStringDelay: 1000
        });
        // new TypeIt('#typed-tagline', {
        //     stringsElement: '#typed-strings',
        //     typeSpeed: 40,
        //     backSpeed: 40,
        //     backDelay: 1000,
        //     startDelay: 1500,
        //     cursorChar: '_',
        //     loop: false
        // });
    });
}(window.jQuery, window, document));
// The global jQuery object is passed as a parameter
