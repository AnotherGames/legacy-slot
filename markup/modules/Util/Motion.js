import { model } from 'modules/Model/Model';

export let motionPath = (() => {

let motion = {

    addPath: function({
        game = model.el('game'),
        anim = game.add.spine(0, 0, 'closed'),
        coordX = [ -anim.width, game.width * 0.2, game.width * 0.4, game.width * 0.6, game.width * 0.8, game.width + anim.width],
        coordY = [ -anim.height, game.height * 0.2, game.height * 0.4, game.height * 0.6, game.height * 0.8, game.height + anim.height],
        randomY = false,
        randomX = false,
        side = 'left',
        randomSide = false,
        rectPath = false,
        scale = anim.scale,
        speed = 1,
        rotation = false,
        name = 'motionClosed',
        repeat = false
    }){

        if(randomSide){
            side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let scaleY = (side == 'left') ? scale.y : scale.y * -1;
                anim.scale.set(scale.x, scaleY);
        }

        let pi = 0;
        let path = motion._calcPath({
            coordX: coordX,
            coordY: coordY,
            randomY : randomY,
            side: side,
            rotation: rotation
        });

        function addToFA(){
            anim.x = path[pi].x;
            anim.y = path[pi].y;

            if(rotation){
                anim.rotation = path[pi].angle;
            }

            pi += speed;

            if (pi >= path.length) {
                if(!repeat){
                    motion.destroyPath({name: name});
                }
                if(randomSide){
                    side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
                    let scaleY = (side == 'left') ? scale.y : scale.y * -1;
                        anim.scale.set(scale.x, scaleY);
                }

                path = motion._calcPath({
                    coordX: coordX,
                    coordY: coordY,
                    randomY : randomY,
                    side: side,
                    rotation: rotation
                });
                pi = 0;
            }
        }

        addToFA.delName = name;
        game.frameAnims.push(addToFA);
        // motion.destroyPath({name: 'deer'})
        // console.log(anim.name);
        // console.log(game.frameAnims[0].delName);
        // game.frameAnims.pop()
    },

    destroyPath: function({
        game = model.el('game'),
        name = 'motionClosed'
    }){
        let frameArr = game.frameAnims;
        for(let i = 0; i < frameArr.length; i++){
            if (name == frameArr[i].delName){
                frameArr.splice(i, 1);
            }
        }
    },

    _calcPath: function({
        game = model.el('game'),
        coordX = [game.width],
        coordY = [game.height],
        randomY = false,
        randomX = false,
        side = 'left',
        rectPath = false,
        rotation = false
    }){

        if(side == 'right'){
            coordX.reverse();
            coordY.reverse();
        }

        if(rectPath){
            let bmd = game.add.bitmapData(game.width, game.height);
            bmd.addToWorld();
        };

        let points = {
            'x': coordX,
            'y': coordY
        };

        let py = points.y;
        let path = [];
        let x = 1 / game.width;
        let ix = 0;

        if(randomY){
            for (let i = 0; i < py.length; i++) {
                py[i] = game.rnd.between(0, game.height);
            }
        }

        if(randomX){
            for (let i = 0; i < px.length; i++) {
                px[i] = game.rnd.between(0, game.width);
            }
        }

        for (let i = 0; i <= 1; i += x) {
            let px = game.math.bezierInterpolation(points.x, i);
            let py= game.math.bezierInterpolation(points.y, i);
            let node = {x: px, y: py, angle: 0};

            if (ix > 0 && rotation){
                node.angle = game.math.angleBetweenPoints(path[ix - 1], node);
            }
            path.push(node);

            ix++;

            if(rectPath){
                bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
            }
        }

        if(rectPath){
            for (let p = 0; p < points.x.length; p++)
            {
                bmd.rect(points.x[p]-3, points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
            }
        }

        return path;

    }
}

return {
    motion
}

})();
