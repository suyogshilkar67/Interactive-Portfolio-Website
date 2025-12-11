// --- 1. Loader & Initialization ---
$(window).on('load', function() {
    // Animate Loader Out
    setTimeout(function() {
        $('#loader').fadeOut(500);
    }, 1000);
});

// --- 2. Navigation Logic (GSAP) ---
$(document).ready(function() {
    // Open Menu
    $('.menubar').on('click', function() {
        gsap.to('#navigation-content', {display: 'flex', opacity: 1, duration: 0.5, ease: "power2.out"});
        gsap.fromTo('.navigation-links a',
            {y: 50, opacity: 0},
            {y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "back.out(1.7)"}
        );
    });

    // Close Menu
    $('#nav-close').on('click', function() {
        gsap.to('#navigation-content', {opacity: 0, duration: 0.5, onComplete: function() {
            $('#navigation-content').css('display', 'none');
        }});
    });

    // Navigate to Section
    $('.navigation-links a').on('click', function() {
        var target = $(this).attr('href');

        // Fade out menu
        gsap.to('#navigation-content', {opacity: 0, duration: 0.3, onComplete: function() {
            $('#navigation-content').css('display', 'none');
        }});

        // "Breaker" Transition Animation
        $('#breaker').css('width', '100%');
        $('#breaker-two').css('width', '100%');

        setTimeout(() => {
            $('#breaker').animate({width: "0"}, 800, "swing");
            $('#breaker-two').animate({width: "0"}, 800, "swing");

            // Smooth Scroll to Section
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 0);
        }, 400);

        return false;
    });
});

// --- 3. Custom Cursor ---
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: "+(e.clientY)+"px; left: "+(e.clientX)+"px;");
});

// Add hover effect to interactive elements
$('a, button, .menubar, .color-panel, input, textarea, .cursor-pointer').on('mouseenter', function() {
    $('.cursor').addClass('active');
});
$('a, button, .menubar, .color-panel, input, textarea, .cursor-pointer').on('mouseleave', function() {
    $('.cursor').removeClass('active');
});

// --- 4. Color Theme Switcher ---
$('.color-panel').on('click', function() {
    $('.color-changer').toggleClass('active');
});

function changeColor(color) {
    document.documentElement.style.setProperty('--main-color', color);
}

// --- 5. Typing Animation (TxtRotate) ---
var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
};

// --- 6. Particle Background Animation ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
// Use innerWidth/innerHeight from the global scope which will be available in the main thread
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        // Corrected usage of canvas dimensions within Particle update
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // Recalculate based on current canvas dimensions
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        // Use innerWidth/innerHeight only for initial calculation if needed,
        // but here it's better to use canvas.width/height or ensure they are consistent.
        // I will use innerWidth/innerHeight as per the original code's intent for screen size
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#dcdcdc';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    // Corrected to use global dimensions for clearRect as per standard practice,
    // though canvas.width/height would also work if they are accurately set.
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Initialization and animation loop start
if (canvas && ctx) {
    init();
    animate();

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
}


// --- 7. Smooth Skills Animation ---
const skillsSection = document.querySelector('#skills');
const progressBars = document.querySelectorAll('.progress-bar-fill');
const counters = document.querySelectorAll('.counter');
let skillsAnimated = false;

const animateSkills = () => {
    if (skillsAnimated) return;

    // Animate Bars
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });

    // Animate Counters
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // ms
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            counter.innerText = current + "%";

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + "%";
            }
        };
        requestAnimationFrame(updateCounter);
    });

    skillsAnimated = true;
};

// Check if skillsSection exists before creating the observer
if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateSkills();
        }
    }, { threshold: 0.3 });

    skillObserver.observe(skillsSection);
}