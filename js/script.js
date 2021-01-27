$(".appear").ready(function() {
    
    $(".js-reveal").animate({
        opacity: 1,
      }, 1000, function() {
        // Animation complete.
      });
})

$('#toggle').click(function() {
    $(this).toggleClass('active');
    $(".menu__overlay").toggleClass('visible');
    $(".oLink").toggleClass('is-appear');
    $(".overlay__footer").toggleClass('is-opacity');
});
$('.js-tilt').tilt({
    maxTilt: 12,
    scale: 1.05,
    speed: 800,
    transition: true
})

var swiper = new Swiper('.slider__index', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 1000,
    loop: true,
    mousewheel: true,
    pagination: {
        el: '.swiper-pagination',
        type: 'custom',
        renderCustom: function (swiper, current, total) {
        /*return ('0' + current).slice(-2) + ' <span class="slide__bar"></span> ' + ('0' + total).slice(-2);*/
            return '<span class="current">'+ ('0' + current).slice(-2) +'</span>' +
                    ' <span class="slide__bar"></span> ' +
                    '<span class="total">'+ ('0' + total).slice(-2) +'</span>';
        }
    },
});

var swiper = new Swiper('.swiper__content', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 1000,
    loop: true,
    mousewheel: true,
    pagination: {
        el: '.swiper-pagination',
        type: 'custom',
        renderCustom: function (swiper, current, total) {
        /*return ('0' + current).slice(-2) + ' <span class="slide__bar"></span> ' + ('0' + total).slice(-2);*/
            return '<span class="current__c">'+'<span class="current">'+ ('0' + current).slice(-2) +'</span>'+'</span>' +
                    ' <span class="slide__bar"></span> ' +
                    '<span class="total__c">'+'<span class="total">'+ ('0' + total).slice(-2) +'</span>'+'</span>';
        }
    },
});
