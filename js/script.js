


{
    // body element
    const body = document.body;

    // helper functions
    const MathUtils = {
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b,
        // distance between two points
        distance: (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1)
    }

    // get the mouse position
    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        }
        else if (ev.clientX || ev.clientY) 	{
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }
        return {x: posx, y: posy};
    }

    // mousePos: current mouse position
    // cacheMousePos: previous mouse position
    // lastMousePos: last last recorded mouse position (at the time the last image was shown)
    let mousePos = lastMousePos = cacheMousePos = {x: 0, y: 0};
    
    // update the mouse position
    window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));
    
    // gets the distance from the current mouse position to the last recorded mouse position
    const getMouseDistance = () => MathUtils.distance(mousePos.x,mousePos.y,lastMousePos.x,lastMousePos.y);

    class Image {
        constructor(el) {
            this.DOM = {el: el};
            // image deafult styles
            this.defaultStyle = {
                scale: 1,
                x: 0,
                y: 0,
                opacity: 0
            };
            // get sizes/position
            this.getRect();
            // init/bind events
            this.initEvents();
        }
        initEvents() {
            // on resize get updated sizes/position
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // reset styles
            TweenMax.set(this.DOM.el, this.defaultStyle);
            // get sizes/position
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
        }
        isActive() {
            // check if image is animating or if it's visible
            return TweenMax.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
        }
    }

    class ImageTrail {
        constructor() {
            // images container
            this.DOM = {content: document.querySelector('.content')};
            // array of Image objs, one per image element
            this.images = [];
            [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
            // total number of images
            this.imagesTotal = this.images.length;
            // upcoming image index
            this.imgPosition = 0;
            // zIndex value to apply to the upcoming image
            this.zIndexVal = 1;
            // mouse distance required to show the next image
            this.threshold = 100;
            // render the images
            requestAnimationFrame(() => this.render());
        }
        render() {
            // get distance between the current mouse position and the position of the previous image
            let distance = getMouseDistance();
            // cache previous mouse position
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

            // if the mouse moved more than [this.threshold] then show the next image
            if ( distance > this.threshold ) {
                this.showNextImage();

                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal-1 ? this.imgPosition+1 : 0;
                
                lastMousePos = mousePos;
            }

            // check when mousemove stops and all images are inactive (not visible and not animating)
            let isIdle = true;
            for (let img of this.images) {
                if ( img.isActive() ) {
                    isIdle = false;
                    break;
                }
            }
            // reset z-index initial value
            if ( isIdle && this.zIndexVal !== 1 ) {
                this.zIndexVal = 1;
            }

            // loop..
            requestAnimationFrame(() => this.render());
        }
        showNextImage() {
            // show image at position [this.imgPosition]
            const img = this.images[this.imgPosition];
            // kill any tween on the image
            TweenMax.killTweensOf(img.DOM.el);

            new TimelineMax()
            // show the image
            .set(img.DOM.el, {
                startAt: {opacity: 0, scale: 1},
                opacity: 1,
                scale: 1,
                zIndex: this.zIndexVal,
                x: cacheMousePos.x - img.rect.width/2,
                y: cacheMousePos.y - img.rect.height/2
            }, 0)
            // animate position
            .to(img.DOM.el, 0.9, {
                ease: Expo.easeOut,
                x: mousePos.x - img.rect.width/2,
                y: mousePos.y - img.rect.height/2
            }, 0)
            // then make it disappear
            .to(img.DOM.el, 1, {
                ease: Power1.easeOut,
                opacity: 0
            }, 0.4)
            // scale down the image
            .to(img.DOM.el, 1, {
                ease: Quint.easeOut,
                scale: 1
            }, 0.4);
        }
    }
    
    
    /***********************************/
    /********** Preload stuff **********/
    /*
    
    // Preload images
    const preloadImages = () => {
        
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.content__img'), resolve);

        });

        
    };
    
    // And then..
    preloadImages().then(() => {
        // Remove the loader
        //document.body.classList.remove('loading');
        var el = document.getElementsByClassName( 'loading' );
        $(el).removeClass('loading');
        new ImageTrail();
    });

    */

   window.onload = function() {


        const progressBar = document.querySelector('.js-loader-progress-bar')
        const progressNumber = document.querySelector('.js-loader-progress-number')
        
        const imgLoad = imagesLoaded('body');
        const imgTotal = imgLoad.images.length;
        
        let imgLoaded = 0;
        let progressSpeed = 2;
        let progressCount = 0;
        let progressResult = 0;
        
        
        let progressInit = setInterval(function () {
        updateProgress();
        }, 40);
        
        
        imgLoad.on('progress', function (instance, image) {
        imgLoaded++
        })
        
        function updateProgress() {
        
        
        progressCount += (imgLoaded / imgTotal) * progressSpeed;
        
        if(progressCount >= 100 && imgTotal > imgLoaded) {
        
            progressResult = 99;
        } else if(progressCount > 99.9) {
        
            progressResult = 100;
        } else {
            
            progressResult = progressCount;
        }
        
        
        progressBar.style.width = progressResult + '%';
        progressNumber.innerText = Math.floor(progressResult) + '%';
        
        
        if (progressResult >= 100 && imgTotal == imgLoaded) {
            clearInterval(progressInit);
            
            
            setTimeout(function () {
            document.querySelector('body').classList.add('is-loaded');
            }, 800);
            

            new ImageTrail();
        }
        }
    
    }
    
}



$(".explore").click(function(){
    var title1 = document.getElementById("t1");
    var title2 = document.getElementById("t2");
    var explore = document.getElementsByClassName('explore');
    var tl = new TimelineMax();
    tl.to(title1, 0.3, {top: "100px", ease: "power3.inOut"} );
    tl.to(title2, 0.3, {delay: 0.01, top: "150px", ease: "power3.inOut"});
    tl.to(explore, 0.3, {delay: 0.02, opacity: 0});
    setTimeout(function(){ 
        window.location.href = 'works.html';
 }, 1300); 
});



$('.js-tilt').tilt({
    maxTilt:        20,
    easing:         "cubic-bezier(.03,.98,.52,.99)", 
    scale:          1,    
    speed:          500,   
    transition:     true,   
    reset:          true,  
   
})

$(".work__img").mouseover(function() {
    var src = $(this).find('img').attr('src');
    var t = $(this).find('h2').text();
    var ht = $(this).find('.work__title');
    $('.hover-bg__item').css('backgroundImage', 'url(' + src + ')');
    $('.hover-bg').addClass('is-hover');
    $(this).addClass('is-hover');
    $(ht).addClass('is-hover');
    $(ht).text(t);
    $('.work__img').addClass('is-opacity');
    $('.navbar').addClass('is-invert');
    $('.brand').addClass('is-invert');
    $('.scrolldown').addClass('is-invert');
});

$(".work__img").mouseleave(function() {
    $('.hover-bg').removeClass('is-hover'); 
    $('.work__title').removeClass('is-hover');
    $(this).removeClass('is-hover');
    $('.work__img').removeClass('is-opacity');
    $('.navbar').removeClass('is-invert');
    $('.brand').removeClass('is-invert');
    $('.scrolldown').removeClass('is-invert');
});


$('.work__img').click(function(){
    $('.work__overlay').addClass('is-visible');
    $('.bg__dark').addClass('is-visible');
    window.setTimeout(function(){$('.bg__white').addClass('is-visible');}, 500);
    $('body').addClass('no-scroll');
   
});

$('#close').click(function(){
    $('.work__overlay').removeClass('is-visible');
    window.setTimeout(function(){$('.bg__dark').removeClass('is-visible');}, 500);
    $('.bg__white').removeClass('is-visible');
    $('body').removeClass('no-scroll');
});



