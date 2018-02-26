SVG.on(document, 'DOMContentLoaded', ()=>{
    setTimeout( () => {
        initLandingPageSVG();
    });
});

function initLandingPageSVG(){
    const DOMElement                = document.querySelector('#landing-page'),
          width                     = DOMElement.offsetWidth,
          height                    = DOMElement.offsetHeight;
          draw                      = SVG(DOMElement);

    new ResizeObserver((entries) =>{
        let newWidth = entries[0].contentRect.width,
            newHeight = entries[0].contentRect.height;
        draw.remove();
        draw = SVG(DOMElement);
        renderLandingPageSVG(draw, DOMElement, newWidth, newHeight);
    }).observe(DOMElement);

    renderLandingPageSVG(draw, DOMElement, width, height);
};

function renderLandingPageSVG(draw, DOMElement, width, height){
    draw.clear();
    draw.size(width, height);

    let startAnimationTime = 1000,
        blurValue = 7,
        unBlurBackgroundTime = 500,
        logoAnimationTime = 1500,
        particlesNumber = 30,
        black = 'hsl(0,0%,10.33%)',
        logoGroup = draw.group(),
        background, blackLayer, mask, circle, blur, logo, text;


    class Particle{
        constructor(timeout){
            this.timeout = timeout;
        }

        init(){
            // setTimeout( () =>{
                this.rendered = draw.path()
                .stroke({color: "#fff", width: 2})
                .opacity(0)
                .center(width/2, height/2)
                .h(1)
                this.animate()
            // }, this.timeout)
        }

        animate(){
            let duration = 500 + Math.round(Math.random()*1000);
            this.rendered.rotate(Math.round(Math.random()*360));
            this.rendered.animate(duration).plot(`M ${width} ${height/2} h 150`).opacity(1).loop()
        }
    }
    setupElements();

    setTimeout(() =>{
        startAnimation(startAnimationTime);
    }, 500)


    function setupElements(){
        background = draw.image('assets/images/galaxy.jpg')
                         .loaded(function(loader){
                             if (width >= height){
                                 this.size(width,width * loader.ratio)
                             }else {
                                 this.size(height,height * loader.ratio)
                             }
                             this.center(width/2, height/2)
                                 .scale(1.5, 1.5)
                         });
        initParticles();
        blackLayer = draw.rect(width, height).fill(black);
        mask       = draw.mask();
        circle     = draw.circle(1).center(width/2, height/2).fill(black);

        blurBackground(blurValue);
        setupInitialMask();
    };

    function blurBackground(value){
        background.filter(add => {
            blur = add.gaussianBlur(value)
        });
    };

    function unblurBackground(duration, cb, timeout){
        blur.animate(duration, 'backIn').attr('stdDeviation', `0 0`)
                                    .after ( ()=>{
                                        background.unfilter();
                                        setTimeout(cb, timeout);
                                    });
    };

    function setupInitialMask(){
        mask.add(blackLayer.clone().fill('#fff'))
            .add(circle);

        blackLayer.maskWith(mask);
    };

    function startAnimation(duration){
        circle.animate(duration, "backOut")
              .size(width);

        setTimeout( () => {
            unblurBackground(unBlurBackgroundTime, drawLogo, 200);
        }, duration * 0.5);
    };

    function drawLogo(){
        const panelWidth    = width/2,
              panelHeight   = height/4


        logo = draw.path();
        logo.fill({color: black, opacity: 0}).stroke({color: black, width: 3});
        text = draw.text('Coming Soon')
                   .fill(draw.gradient('linear', function(stop) {
                       stop.at(0, 'hsl(40, 85%, 75%)')
                       stop.at(1, 'hsl(320, 75%, 40%)')
                   }))
                   .font({size: panelHeight/2})
                   .opacity(0)
                   .center(width/2 + panelWidth/4, panelHeight/2 - 50 )
                   .attr('class', 'svg-text');
        drawPath(panelWidth, panelHeight);
        logo.animate(logoAnimationTime/4)
            .fill({opacity: 0.5})
            .after( ()=>{
                animateLogo();
            })
        setTimeout(()=>{
            text.animate(1000, 'bounce')
                .dy(height/3 - 50)
                .opacity(1);
        }, logoAnimationTime*1.25);
    };

    function drawPath(panelWidth, panelHeight){
        logo.M(width/2, 0)
            .v(50)
            .h(panelWidth/2)
            .c(
                {x: panelHeight/2, y: 0},
                {x: panelHeight/2, y: panelHeight/2},
                {x : 0, y: panelHeight})
            .h(-width/2)
            .c(
                {x: -panelHeight/2, y: 0},
                {x: -panelHeight/2, y: -panelHeight/2},
                {x : 0, y: -panelHeight})
            .h(width/4)
            .drawAnimated({
                duration: logoAnimationTime
            });
    }

    function animateLogo(){
        const getPathString = (path, segment) => path + " " + segment.type + segment.coords.reduce(getCoordString),
              getCoordString = (coordStr, coord) => coordStr + " " + coord;

        let segments = [];

        for(let i = 0 ; i < logo.getSegmentCount(); i++){
            segments.push(logo.getSegment(i));
        }

        segments[1].coords[0] = height/3;

        let newPath = segments.reduce(getPathString, "");

        logo.attr('stroke-dasharray', null);
        logo.animate(1000, 'bounce')
            .plot(newPath);

        logoSwing();
    }

    function logoSwing(){
        function first(){
            logo.animate(500, ">")
                .rotate(5, width/2, 0)
                .after(second)
            text.animate(500, ">")
                .rotate(5, width/2, 0)
        }
        function second(){
            logo.animate(1000, "<>")
                .rotate(-5, width/2, 0)
                .after(third)
            text.animate(1000, "<>")
                .rotate(-5, width/2, 0)
        }
        function third(){
            logo.animate(500, "<")
                .rotate(0, width/2, 0)
                .after(first)
            text.animate(500, "<")
                .rotate(0, width/2, 0)
        }

        first();
    }

    function initParticles(){
        for(let i = 0 ; i < particlesNumber ; i++){
            let p = new Particle(100*i);
            p.init();
        }
    }

    document.addEventListener('mousemove', e =>{
        let x = (e.clientX-window.innerWidth/2)/window.innerWidth * width,
            y = (e.clientY-window.innerHeight/2)/window.innerHeight * height,
            coef = 0.10;

        background.move(x*coef, y*coef);
    })
};
