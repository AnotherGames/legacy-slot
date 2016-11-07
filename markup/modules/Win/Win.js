import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Glista/Glista';
import { sound } from '../../modules/Sound/Sound';

export let win = (function () {

    let glistaDoneCounter;
    let glistaFiredCounter;

    function showWin() {

        glistaFiredCounter = glistaDoneCounter = 0;

        let data = model.data('rollResponse');
        let winTotalData = data.Balance.TotalWinCoins;
        let winLines = data.WinLines;
        let nextMode = data.NextMode;

        if (nextMode == 'fsBonus') {
            if (model.flag('mobile')) {
                events.trigger('autoplay:stop');
            } else {
                events.trigger('autoplay:stop:desktop');
            }
            setTimeout(() => {
                let game = model.el('game');
                game.state.start('FS');
            }, 2000);
        }
        if (winTotalData === 0) return;

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let winSound = Math.round(Math.random()) ? sound.sounds.lineWin : sound.sounds.lineWin2;
        winSound.addMarker('win', 0, 1, 1, false);
        winSound.play('win');


        let winTop = game.add.group();

        mainContainer.addAt(winTop, mainContainer.children.length);
        model.el('winTop', winTop);

        drawTotalWin(winTotalData);

        winLines.forEach((winLine) => {
            drawWinNumber(winLine.Line);
            drawWinElements(winLine.Line, winLine.Count);
            drawWinGlista(winLine.Line);
        });
    }

    function drawTotalWin(winTotalData) {

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let winTop = model.el('winTop');
        let gameMachine = mainContainer.getAt(2);

        let winTotal = game.add.sprite(gameMachine.width / 2, gameMachine.height / 2, 'winTotal', null, winTop);
        winTotal.anchor.set(0.5);

        let winTotalText = game.add.text(gameMachine.width / 2, gameMachine.height / 2 + 5, winTotalData, {font: '60px Helvetice, Arial', fill: '#e8b075', align: 'center'}, winTop);
        winTotalText.anchor.set(0.5);

    }

    function drawWinNumber(number) {
        if (number < 0) return;

        addWinSplash(number, 0);
        addWinSplash(number, 1);

    }

    function addWinSplash(number, indx) {
        let game = model.el('game');
        let winTop = model.el('winTop');

        let winSplash = game.add.sprite(0, 0, 'win', null, winTop);
        winSplash.anchor.set(0.5);
        winSplash.position.x = config[model.state('res')].win[number][indx].x;
        winSplash.position.y = config[model.state('res')].win[number][indx].y;
        winSplash.animations.add('win', Phaser.Animation.generateFrameNames('Splash-Splash', 1, 14, '.png', 1), 15, false);
        winSplash.animations.play('win');
        winSplash.animations.getAnimation('win').killOnComplete = true;
    }

    function drawWinElements(number, amount) {
        let wheels = model.el('wheels');
        if (number > 0) {
            let line = model.data('lines')[number - 1];
            for (let col = 0; col < amount; col++) {
                let wheel = wheels[col].elements;
                let coord = line[col].Y;
                let element = wheel[coord];
                let elementName = parseInt(element.sprite.animations.currentAnim.name);
                element.play(`${elementName}-w`);

            }
        } else {
            console.log();
            wheels.forEach((wheelObj) => {
                wheelObj.elements.forEach((element) => {
                    let elementName = parseInt(element.sprite.animations.currentAnim.name);
                    if (elementName == '9') { // нужно будет поправить на 10
                        element.play(`${elementName}-w`);
                    }
                });
            });
        }
    }

    function drawWinGlista(number) {
        if (number < 0) return;

        glistaFiredCounter++;

        let line = model.data('lines')[number - 1];
        let game = model.el('game');
        let glistaLightContainer = model.el('glistaLightContainer');
        let glistaContainer = model.el('glistaContainer');
        let glista = new Glista({
            game,
            lightParent: glistaLightContainer,
            parent: glistaContainer,
            elSize: config[model.state('res')].elements
        });
        let glistaMas = [];
        line.forEach((coord) => {
            glistaMas.push(coord.Y);
        });
        cleanWinElements();
        glista.start(glistaMas, 1000, function() {
            glista.remove();
            glistaDoneCounter++;
            if (glistaDoneCounter == glistaFiredCounter) {
                cleanWin();
            }
        });
    }

    function cleanWinElements() {
        let wheels = model.el('wheels');
        wheels.forEach((wheelObj) => {
            let wheel = wheelObj.elements;
            wheel.forEach((element) => {
                let elementName = parseInt(element.sprite.animations.currentAnim.name);
                element.sprite.animations.getAnimation(`${elementName}-w`).onComplete.add(() => {
                    element.play(`${elementName}-n`);
                });
            });
        });
    }

    function cleanWin() {
        let game = model.el('game');
        let winTop = model.el('winTop');
        if (winTop) {
            let winClean = game.add.tween(winTop).to( { alpha: 0 }, 300, 'Linear', true);
            winClean.onComplete.add(() => {
                winTop.removeAll(true);
            });
        }
    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin);
    events.on('win:clean', cleanWinElements);

    return {

    };

})();
