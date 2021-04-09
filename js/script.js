$(document).ready(function(){

    
    // Preload images
    const preloadImages = () => {
            
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('img'), resolve);
            $('body').addClass('stop-scrolling');
            $('body').bind('touchmove', function(e){e.preventDefault()});

        });

        
    };
    
    // And then..
    preloadImages().then(() => {
        // Remove the loader
        //document.body.classList.remove('loading');
        var el = document.getElementsByClassName( 'loading' );
        $(el).remove();
        $('body').removeClass('stop-scrolling');
        $('body').unbind('touchmove');
    });

    
});

$(".toggle__menu").click(function(){
    $('.menu__span').toggleClass('is-active');
    $('.menu__overlay').toggleClass('menu-visible');
    $('body').toggleClass('stop-scrolling');
});

$(document).ready(function (){
    $("#mLink").click(function (){
        $('html, body').animate({
            scrollTop: $("#movies").offset().top
        }, 1000);
        $('.menu__overlay').removeClass('menu-visible');
        $('.menu__span').removeClass('is-active');
        $('body').addClass('stop-scrolling');
        $('body').bind('touchmove', function(e){e.preventDefault()});
    });

    $("#pLink").click(function (){
        $('html, body').animate({
            scrollTop: $("#photos").offset().top
        }, 1000);
        $('.menu__overlay').removeClass('menu-visible');
        $('.menu__span').removeClass('is-active');
        $('body').removeClass('stop-scrolling');
        $('body').unbind('touchmove');
    });
});




$(function(){
    $(".Vlinks").click(function(){
      $("#modal").fadeIn();
      $(".close__video").addClass('is-appear');
      $('body').addClass('stop-scrolling');
      $('body').bind('touchmove', function(e){e.preventDefault()});
      
    });
    $("#modal .closeV").click(function(){
      $("#modal").fadeOut();
      $("#mainVid").attr("src", "");
      $('body').removeClass('stop-scrolling');
      $('body').unbind('touchmove');
      
    });
});



$(".pc").click(function(){
    var src = $(this).find('img').attr('src');
    var img = $(this).find('img').hasClass('o__i');
    $('body').addClass('stop-scrolling');
    $('.photo__overlay').addClass('is-visible');
    $(".overlay__img").append($('<img>',{class: 'o__img',src: src}));
    $(".close__span").addClass('is-appear');
    if (src = img) {
        $(".overlay__img").addClass("portrait");
    }

    else {
        $(".overlay__img").addClass("landscape"); 
    }

    $('.bg__po').addClass('bg-visible');
    $('.o__content').addClass('is-appear');
    $('body').bind('touchmove', function(e){e.preventDefault()});

});

$(".close").click(function(){
    var src = $(this).find('img').attr('src');
    $('.photo__overlay').removeClass('is-visible');
    $(".o__img").remove(src);
    $(".overlay__img").removeClass("portrait");
    $(".overlay__img").removeClass("landscape");
    $('.bg__po').removeClass('bg-visible');
    $('.o__content').removeClass('is-appear');
    $(".close__span").removeClass('is-appear');
    $('body').removeClass('stop-scrolling');
    $('body').unbind('touchmove');
});


$("#email").click(function() {

    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById("email"));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById("email"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    document.execCommand("copy");

    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    else if (document.selection) {
        document.selection.empty();
    }

    var posEmailX = $("#email").offset().left;
    var posEmailY = $("#email").offset().top;
    var emailHeight = $("#email").height();
    let emailContent = document.getElementById("email").innerHTML;

    document.getElementById("email").innerHTML = "Email copied to clipboard";

    setTimeout(function(){
        document.getElementById("email").innerHTML = "hello@antoinecorniere.com";
    }, 1200);
});

$("#email2").click(function() {

    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById("email2"));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById("email2"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    document.execCommand("copy");

    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    else if (document.selection) {
        document.selection.empty();
    }

    var posEmailX = $("#email2").offset().left;
    var posEmailY = $("#email2").offset().top;
    var emailHeight = $("#email2").height();
    let emailContent = document.getElementById("email2").innerHTML;

    document.getElementById("email2").innerHTML = "Email copied to clipboard";

    setTimeout(function(){
        document.getElementById("email2").innerHTML = "hello@antoinecorniere.com";
    }, 1200);
});