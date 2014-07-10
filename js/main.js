/**
 * Created by i.sungurov on 04.07.14.
 */

$(function () {

    var
        pages = {
            index: 1,
            interface: 2,
            devices: 3,
            technologies: 4,
            implementation: 5,
            solutions: 6,
            costs: 7,
            contacts: 8
        },

        scroller = $(".pages").onepage_scroll({

            animationTime: 700,

            keyboard: true,

            beforeMove: function(pageIndex) {

                if(pageIndex == pages.index){
                    $("header").removeClass("navbar-fixed-top").addClass("navbar-fixed-bottom");
                }else{
                    $("header").removeClass("navbar-fixed-bottom").addClass("navbar-fixed-top");
                }

                if(pageIndex == pages.technologies || pageIndex == pages.implementation){
                    $("header").removeClass("navbar-navbar-default").addClass("navbar-inverse");
                }else{
                    $("header").removeClass("navbar-inverse").addClass("navbar-navbar-default");
                }
            }
        });


    $(".slider-thumbs li").click(function(){

        var element = $(this);
        var parent = element.parents(".slider-thumbs");
        var marker = parent.find("li.marker");

/*        marker.stop().animate({
            left: element.position().left,
            width: element.outerWidth(),
            height: element.outerHeight()
        }, 700);*/

        marker.css("left", element.position().left+"px")
            .width(element.outerWidth())
            .height( element.outerHeight());
    });

    /*copy paste*/
    $(".navbar-nav li").click(function(){

        var element = $(this);

        var parent = element.parents(".navbar-nav");
        parent.find(".active").removeClass("active");

        var marker = parent.find("li.marker");

        /*        marker.stop().animate({
         left: element.position().left,
         width: element.outerWidth(),
         height: element.outerHeight()
         }, 700);*/

        element.addClass("active");

        marker.css("left", element.position().left+"px")
            .width(element.outerWidth())
            .height( element.outerHeight());


    });

    /*

    $(function() {

     var $el, leftPos, newWidth,
     $mainNav = $("#example-one");

     $mainNav.append("<li id='magic-line'></li>");
     var $magicLine = $("#magic-line");

     $magicLine
     .width($(".current_page_item").width())
     .css("left", $(".current_page_item a").position().left)
     .data("origLeft", $magicLine.position().left)
     .data("origWidth", $magicLine.width());

     $("#example-one li a").hover(function() {
     $el = $(this);
     leftPos = $el.position().left;
     newWidth = $el.parent().width();
     $magicLine.stop().animate({
     left: leftPos,
     width: newWidth
     });
     }, function() {
     $magicLine.stop().animate({
     left: $magicLine.data("origLeft"),
     width: $magicLine.data("origWidth")
     });
     });
     });

     */

    $('.arrow').viewportChecker({
        offset: 200,
        classToAdd: 'animated',
        callbackFunction: function(elem){
            setTimeout(function(){
                elem.removeClass("hidden").addClass("animated");
            },2000);
        }
    });


    $("[data-link]").click(function(e){
        $(".pages").moveTo(pages[$(this).data("link")]);
        e.preventDefault();
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