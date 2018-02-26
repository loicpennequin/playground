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
        background, blackLayer, mask, circle, blur, logo;

    setupElements();

    setTimeout(() =>{
        startAnimation(startAnimationTime);
    }, 500)


    function setupElements(){
        background = draw.image('assets/images/galaxy.jpg')
                         .loaded(function(loader){this.size(width,width * loader.ratio)})
                         .center(width/2, height/2).scale(1.5, 1.5),
        blackLayer = draw.rect(width, height).fill(black),
        mask       = draw.mask(),
        circle     = draw.circle(1).center(width/2, height/2).fill(black)

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
            initParticles()
            unblurBackground(unBlurBackgroundTime, drawLogo, 200);
        }, duration * 0.5);
    };

    function drawLogo(){
        const panelWidth    = width/2,
              panelHeight   = height/4

        logo = draw.path();
        logo.fill({color: black, opacity: 0}).stroke({color: black, width: 3});
        drawPath(panelWidth, panelHeight);
        logo.animate(logoAnimationTime/4)
            .fill({opacity: 0.5})
            .after( ()=>{
                animateLogo();
            })
    };

    function drawPath(panelWidth, panelHeight){
        logo.M(width/2, 0)
            .v(50)
            .h(panelWidth/2)
            .c(
                {x: panelHeight/2, y: 0},
                {x: panelHeight/2, y: height/4},
                {x : 0, y: height/4})
            .h(-width/2)
            .c(
                {x: -panelHeight/2, y: 0},
                {x: -panelHeight/2, y: -height/4},
                {x : 0, y: -height/4})
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

        // logoSwing();
    }

    function logoSwing(){
        function first(){
            logo.animate(500, ">")
                .rotate(5, width/2, 0)
                .after(second)
        }
        function second(){
            logo.animate(1000, "<>")
                .rotate(-5, width/2, 0)
                .after(third)
        }
        function third(){
            logo.animate(500, "<")
                .rotate(0, width/2, 0)
                .after(first)
        }

        first();
    }

    class Particle{
        constructor(timeout){
            this.timeout = timeout
        }

        init(){
            setTimeout( () =>{
                this.rendered = draw.path()
                .stroke({color: "#fff", width: 2})
                .opacity(0)
                .center(width/2, height/2)
                .h(1)

                let mask = draw.mask();
                mask.add(draw.circle(width, height).fill('#fff'))
                this.rendered.maskWith(mask);

                this.animate()
            }, this.timeout)
        }

        animate(){
            let duration = 1000 + Math.round(Math.random()*2000);
            this.rendered.rotate(Math.round(Math.random()*360));
            this.rendered.animate(duration).plot(`M ${width} ${height/2} h 150`).opacity(1).loop()
        }
    }

    function initParticles(){
        for(let i = 0 ; i < particlesNumber ; i++){
            let p = new Particle(100*i);
            p.init();
        }
    }

    draw.on('mousemove', e =>{
        let x = (e.clientX-window.innerWidth/2)/window.innerWidth * width,
            y = (e.clientY-window.innerHeight/2)/window.innerHeight * height,
            coef = 0.1;
        background.move(x*coef, y*coef)
    })
};
