/**
 * Created by i.sungurov on 04.07.14.
 */
$(function () {

    var

    setSizes = function () {
        var blockHeight = $(window).height(),
            headerHeight = $(".header").height();

        $(".landing > section").css("minHeight",((blockHeight + headerHeight)) + "px");
    },

    elementInViewport = function (el) {
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;

            while(el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }

            return (
                top < (window.pageYOffset + window.innerHeight) &&
                    left < (window.pageXOffset + window.innerWidth) &&
                    (top + height) > window.pageYOffset &&
                    (left + width) > window.pageXOffset
                );
        };


    $(window).resize(function () {
        setSizes();
    });

    $(window).scroll(function(){
        if(true){

        }
    });


    setSizes();


    $(".action-link").click(function () {
        var that = $(this);
        $('html, body').animate({
            scrollTop: $("#" + that.data("related")).offset().top
        }, 1000);
    });




    $('#myCarousel').carousel({
        interval: 4000
    });



// handles the carousel thumbnails
    $('[id^=carousel-selector-]').click( function(){
        var id_selector = $(this).attr("id");
        var id = id_selector.substr(id_selector.length -1);
        id = parseInt(id);
        $('#myCarousel').carousel(id);
        $('[id^=carousel-selector-]').removeClass('selected');
        $(this).addClass('selected');
    });

// when the carousel slides, auto update
    $('#myCarousel').on('slid', function (e) {
        var id = $('.item.active').data('slide-number');
        id = parseInt(id);
        $('[id^=carousel-selector-]').removeClass('selected');
        $('[id^=carousel-selector-'+id+']').addClass('selected');
    });


});