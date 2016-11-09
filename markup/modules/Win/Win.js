import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';
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
        let mode = data.Mode;

        if (mode == 'root' && nextMode == 'fsBonus') {
            if (model.flag('mobile') && !model.state('autoEnd')) {
                events.trigger('autoplay:stop');
            } else if (model.flag('desktop') && !model.state('autoEnd')) {
                events.trigger('autoplay:stop:desktop');
            }
            setTimeout(() => {
                let game = model.el('game');
                events.trigger('main:drawTransitionScreen');
            }, 2000);
        }

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let winSound = Math.round(Math.random()) ? sound.sounds.lineWin : sound.sounds.lineWin2;
        winSound.addMarker('win', 0, 1, 1, false);
        winSound.play('win');

        // if (model.el('winTop')) {
        //
        // }
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
        if (winTotalData === 0) return;

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let winTop = model.el('winTop');
        let gameMachine;
        if (model.state('FSMode')) {
            gameMachine = mainContainer.getAt(0);
        } else {
            gameMachine = mainContainer.getAt(2);
        }

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
            wheels.forEach((wheelObj) => {
                wheelObj.elements.forEach((element) => {
                    let elementName = parseInt(element.sprite.animations.currentAnim.name);
                    if (elementName == '10') {
                        element.play(`${elementName}-w`);
                    }
                    if (elementName == '11') {
                        let game = model.el('game');
                        console.log('Brains!');
                        events.trigger('fs:brain');
                        model.state('evilBrain', true);
                        game.add.tween(element.sprite.scale).to({x: 1.7, y: 1.7}, 700, 'Linear', true)
                            .onComplete.add(() => {
                                if (model.flag('mobile')) {
                                    element.sprite.scale.x = element.sprite.scale.y = 1.5;
                                } else {
                                    element.sprite.scale.x = element.sprite.scale.y = 1;
                                }
                            });
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
        glista.start(glistaMas, 1000, function () {
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

    function drawWinScreen() {
        let game = model.el('game');
        let transitionContainer = model.el('transitionContainer');

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        const winText = game.add.sprite(game.world.width / 2,
            -400,
            'text',
            'totalW.png',
            transitionContainer);
        winText.anchor.set(0.5);

        let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins;

        const winCount = game.add.text(game.world.width / 2,
            -200,
            winCountValue,
            {font: 'bold 140px Helvetica, Arial', fill: '#fff', align: 'center'},
            transitionContainer);
        winCount.anchor.set(0.5);

        const skull = game.add.sprite(game.world.width / 2,
            game.world.height * 0.7,
            'skull',
            null,
            transitionContainer);
        skull.anchor.set(0.5);
        skull.scale.setTo(0.1, 0.1);

        const continueText = game.add.sprite(game.world.width / 2,
            game.world.height * 0.9,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.setTo(0.1, 0.1);

        continueText.inputEnabled = true;
        continueText.input.priorityID = 2;
        continueText.events.onInputDown.add(function () {
            sound.sounds.button.play();
            game.state.start('Main');
        });

        game.add.tween(winText).to({y: game.world.height * 0.2}, 1000, Phaser.Easing.Bounce.Out, true);
        game.add.tween(winCount).to({y: game.world.height * 0.45}, 1000, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        game.add.tween(skull.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true, 300)
            .onComplete.add(() => {
                skull.rotation = 0.1;
                game.add.tween(skull).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        skull.rotation = 0;
                    }, this);
            }, this);
    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin);
    events.on('win:clean', cleanWinElements);

    events.on('main:drawWinScreen', drawWinScreen);

    return {

    };

})();
