var cursor = {
    delay: 8,
    _x: 0,
    _y: 0,
    endX: (window.innerWidth / 2),
    endY: (window.innerHeight / 2),
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('.cursor-dot'),
    $outline: document.querySelector('.cursor-dot-outline'),
    
    init: function() {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;
        
        this.setupEventListeners();
        this.animateDotOutline();
    },
    
  //     updateCursor: function(e) {
  //         var self = this;
        
  //         console.log(e)
        
  //         // Show the cursor
  //         self.cursorVisible = true;
  //         self.toggleCursorVisibility();
  
  //         // Position the dot
  //         self.endX = e.pageX;
  //         self.endY = e.pageY;
  //         self.$dot.style.top = self.endY + 'px';
  //         self.$dot.style.left = self.endX + 'px';
  //     },
    
    setupEventListeners: function() {
        var self = this;
        
        // Anchor hovering
        document.querySelectorAll('a').forEach(function(el) {
            el.addEventListener('mouseover', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            el.addEventListener('mouseout', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
        });
        
        // Click events
        document.addEventListener('mousedown', function() {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
        });
        document.addEventListener('mouseup', function() {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
        });
  
  
        document.addEventListener('mousemove', function(e) {
            // Show the cursor
            self.cursorVisible = true;
            self.toggleCursorVisibility();
  
            // Position the dot
            self.endX = e.pageX;
            self.endY = e.pageY;
            self.$dot.style.top = self.endY + 'px';
            self.$dot.style.left = self.endX + 'px';
        });
        
        // Hide/show cursor
        document.addEventListener('mouseenter', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        });
        
        document.addEventListener('mouseleave', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        });
    },
    
    animateDotOutline: function() {
        var self = this;
        
        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + 'px';
        self.$outline.style.left = self._x + 'px';
        
        requestAnimationFrame(this.animateDotOutline.bind(self));
    },
    
    toggleCursorSize: function() {
        var self = this;
        
        if (self.cursorEnlarged) {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    },
    
    toggleCursorVisibility: function() {
        var self = this;
        
        if (self.cursorVisible) {
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        } else {
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        }
    }
  }
  
  cursor.init();
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
});



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
