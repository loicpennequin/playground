/*
    NOTE : j'utilise beaucoup d'arrow functions qui se présentent de la façon suivante :
    () => {
        ...
    }
    Même si cela a d'autres subtilités très intéressantes, le principal à savoir est que c'est la même chose que faire
    function() {
        ...
    }
    ça va juste plus vite et j'ai pris l'habitude.
*/

SVG.on(document, 'DOMContentLoaded', render);

function render(){
    //constantes du canvas
    const width                     = window.innerWidth,
          height                    = window.innerHeight * 0.7,
          header                    = SVG('drawing').size(width, height),
    //constantes des elements triangle
          trnglSide                 = 30,
          trnglColorVariance        = 360,
          trnglPath                 = `0,0 ${trnglSide}, 0 ${trnglSide / 2}, -${Math.sqrt(Math.pow(trnglSide, 2) -  Math.pow(trnglSide / 2, 2))}`, //nique ta mère pythagore
          trnglAmount               = 8,
          trnglOpacity              = 0.5;


    let headerinteractionEnabled    = false,
        //On utilise un tableau pour pouvoir cibler les triangles individuellement, et un group pour pouvoir les selectionner en tant qu'un seul élément.
        triangles                   = [],
        trnglGroup                  = header.group();
        // angles                      = [];


    //initialisation des triangles
    //1) On les génère
    for (let i = 0 ; i < trnglAmount ; i++){
        let angle = i * (360/trnglAmount),
            color = i * (trnglColorVariance/trnglAmount);

        triangles.push(header.polygon(trnglPath)
                             .fill(`hsla(${color},80%,55%, ${trnglOpacity})`)
                             .stroke(`hsla(${color},80%,55%, 1`)
                             .center(width / 2, height / 2)
                             .rotate(angle))
    }
    triangles.forEach( triangle => {
        //2) on les ajoute au group
        trnglGroup.add(triangle);
        triangle.opacity(0);
        //3) on leur applique l'animation de départ
        triangle.animate(800).opacity(trnglOpacity)
                .transform({scale: 3 })
                .transform({rotation: 180}, true)
                .after( () => {
                    triangle.animate(800).dmove(trnglSide/2, trnglSide/2)
                    .after( () => {
                        headerinteractionEnabled = true;
                        // angles.push(triangle.transform('rotation'));
                    });
                });

        //4)on leur ajoute l'évènement mouseover pour les faire tourner au survol
        triangle.on('mouseover', () => {
            triangle.animate(2000).transform({ rotation: 360}, true) //l'argument "true" permet d'ajouter la rotation à celle déjà existantes, sans quoi celle ci est absolue
        });
    });


    //Initialisation du texte
    let title,
        titleWrap = header.text(add => {
            title = add.tspan('Badaboum')
                       .font({ size: 60})
                       .fill('#000')
                       .attr('fill-opacity', 0.3)
                       .stroke('#fff')
                       .style('font-family', 'Kavivanar')
        })
    titleWrap.center(width/2, height/2);

    //Ajout du filtre de flou au survol
    let blur,
        blurAmount = 10;

    title.on('mouseover', () => {
        titleWrap.animate(300).transform({scale : 1.2});
        title.animate(300).attr({ 'fill-opacity': 0.6 });
        trnglGroup.filter(add => {
            blur = add.gaussianBlur(0);
        })
        trnglGroup.animate(300).transform({scale: 1.5});
        blur.animate(300).attr('stdDeviation', `${blurAmount} ${blurAmount}`);
    });

    title.on('mouseout', () => {
        titleWrap.animate(300).transform({scale : 1});
        title.animate(300).attr({ 'fill-opacity': 0.3 });
        trnglGroup.animate(300).transform({scale: 1});
        blur.animate(300).attr('stdDeviation', '0 0').after( () => {
            trnglGroup.unfilter();
        });
    });

    //On ajoute un évènement qui redessine le SVG lorsque l'on redimensionne la fenêtre
    //J'utilise ici une librairie externe appelée lodash qui fournit plein (PLEIN) de trucs utiles
    //comme par exemple ici la possibilité de debounce, c'est-à-dire d'attendre que l'on ait pas resize depuis 200ms
    //avant de redessiner. Sinon le SVG serait redessiné constamment lorsque l'on redimensionne à la souris, c'est très mauvais pour les performances.
    window.addEventListener('resize', _.debounce(()=>{
        header.remove();
        render();
    }, 200));
}
