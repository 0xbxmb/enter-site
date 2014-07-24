/**
 * Created by i.sungurov on 04.07.14.
 */

$(function () {

    var
        pages = {
            index: 1,
            interface: 2,
            menutuning: 3,
            devices: 4,
            technologies: 5,

//            algorithms: 10,
            implementation: 6,


            solutions: 7,
            costs: 8,
            contacts: 9
        },

        video = document.getElementById("implementation-video"),

        scroller = $(".pages").onepage_scroll({

            animationTime: 500,

            keyboard: true,
            loop: false,

            afterMove:function(pageIndex){
                $(".arrow").parents("section").each(function(){
                    if($(this).offset().top === 0){
                        $(this).find(".arrow").removeClass("hidden").addClass("animated")
                    }
                });
                if (pageIndex == pages.implementation) {
                    video.play();
                }
            },

            beforeMove: function(pageIndex) {

                if(pageIndex == pages.index){
                    $("header").removeClass("navbar-fixed-top").addClass("navbar-fixed-bottom");
                }else{
                    $("header").removeClass("navbar-fixed-bottom").addClass("navbar-fixed-top");
                }

                if(pageIndex >= pages.technologies && pageIndex < pages.solutions ){
                    $("header").removeClass("navbar-navbar-default").addClass("navbar-inverse");
                }else{
                    $("header").removeClass("navbar-inverse").addClass("navbar-navbar-default");
                }

                var index = $($(".landing section")[pageIndex - 1]).data("menuItemIndex"),
                    menuElements = $(".navbar-nav li"),
                    parent = menuElements.parents(".navbar-nav"),
                    marker = parent.find("li.marker");

                if(index >= 0){
                    var element = $(menuElements[index]);
                    parent.find(".active").removeClass("active");
                    element.addClass("active");

                    marker.show().css("left", element.position().left+"px")
                        .width(element.outerWidth())
                        .height( element.outerHeight());
                }else{
                    marker.hide();
                    parent.find(".active").removeClass("active");
                }

                /*        marker.stop().animate({
                 left: element.position().left,
                 width: element.outerWidth(),
                 height: element.outerHeight()
                 }, 700);*/
            }
        }),

        initCarousel = function(el){

            el.carousel({
                interval: false
            });

            $('[id^=' + el.attr("id") + '-selector-]').click( function(){
                var id_selector = $(this).attr("id");
                var id = id_selector.substr(id_selector.length -1);
                id = parseInt(id);
                el.carousel(id);
                $('[id^='+ el.attr("id") +'-selector-]').removeClass('selected');
                $(this).addClass('selected');
            });

/*            el.bind('slid.bs.carousel', function() {
                var id = $('.item.active').data('slide-number');
                id = parseInt(id);
                $('[id^='+ el.attr("id") +'-selector-]').removeClass('selected');
                $('[id^='+ el.attr("id") +'-selector-'+id+']').addClass('selected');
            });*/
        };

    initCarousel($("#settings-carousel"));
    initCarousel($("#devices-carousel"));

    video.addEventListener('canplay', function() {
        video.style.width = 'auto';
        video.style.height = 'auto';
    });

    var selectSliderItem = function(element){
        var parent = element.parents(".slider-thumbs");
        var marker = parent.find("li.marker");

        /*        marker.stop().animate({
         left: element.position().left,
         width: element.outerWidth(),
         height: element.outerHeight()
         }, 700);*/
        marker.css("left", element.position().left+"px")
            .width(element.width())
            .height( element.height());
    };

    $(".slider-thumbs li").click(function(){
        if(!$(this).hasClass("marker")){
            selectSliderItem($(this));
        }
    });

    $(".navbar-nav li").click(function(){
        var element = $(this);
        if(!$(this).hasClass("marker")){
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
        }
    });

    $("[data-link]").click(function(e){
        $(".pages").moveTo(pages[$(this).data("link")]);
        e.preventDefault();
    });

    $(".slider-thumbs .selected").each(function(index, item){
        selectSliderItem($(item));
    });


    $("#owl-demo").owlCarousel({

        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        pagination: true,
        items : 1

        // "singleItem:true" is a shortcut for:
        // ,
        // itemsDesktop : false,
        // itemsDesktopSmall : false,
        // itemsTablet: false,
        // itemsMobile : false

    });

});