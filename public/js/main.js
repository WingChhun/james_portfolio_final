//Start every Javascript document with doc.ready
$(document).ready(function () {
    $(window).scroll(function () {
        //If 
        if ($(window).scrollTop() > 970) {
            //select nav bar, add bootstrap sticky header class
            $('.navbar').addClass('fixed-top');
            $('.navbar').css({
                "backgroundColor": "rgba(0,0,0,0.5)"
            });
        }
        if ($(window).scrollTop() < 971) {
            //remove the navbar-fixed-top class
            $('.navbar').removeClass('fixed-top');
            $('.navbar').css({
                "backgroundColor": "rgba(0,0,0,0.4)"
            });
        }
    });
    $(".burger-nav").on("click", function () {
        $("header nav ul").toggleClass('open').delay(2000);
    });
});
$(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 500);
                return false;
            }
        }
    });
});