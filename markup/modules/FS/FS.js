import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let fs = (function () {

    let fsCount;
    let fsEnd;
    let fsText;
    let brainCount = 0;

    function initFS(amount) {
        let game = model.el('game');
        let fsLevel = model.el('fsLevel');
        if (model.flag('mobile')) {
            fsText = game.add.text(fsLevel.x, fsLevel.y, amount, {font: '60px Arial, Helvetica', fill: '#fff'});
            fsText.anchor.set(0.5);
        } else {
            fsText = game.add.text(fsLevel.x, fsLevel.y, amount, {font: '80px Arial, Helvetica', fill: '#fff'});
            fsText.anchor.set(0.5);
        }
        fsCount = amount;
        fsEnd = false;
        model.state('fsEnd', false);
        model.data('fsMulti', 2);
        startFSRoll();
        drawBrainPanel();
    }

    function startFSRoll() {
        fsCount = model.data('rollResponse').FreeSpinsLeft;
        fsCount--;
        if (!fsEnd) {
            // if (utils.lowBalance()) {
            //     autoEnd = true;
            //     stopAutoplay();
            //     utils.showPopup('Low balance!');
            //     storage.changeState('autoplay', 'ended');
            //     events.trigger('autoplay:ended');
            // } else {
                events.trigger('autoplay:startRoll');
            // }
        }
        if (fsCount > 0) {
            fsText.text = fsCount;
            model.data('fsCount', fsCount);
            // events.trigger('fsplay:count', fsCount);
        } else {
            events.trigger('fs:stop');
            // model.state('autoplay', null);
        }
    }

    function stopFS() {
        fsEnd = true;
        let game = model.el('game');
        model.state('fsEnd', true);
        fsText.destroy();
        events.trigger('main:drawWinScreen');
        // setTimeout(() => {
        //     if (game.state.current != 'Main') {
        //         game.state.start('Main');
        //     }
        // }, 2500);
        // clearTimeout(model.data('autoTimeout'));
    }

    function fsBrain() {
        fsText.text = '+3';
        let fsMulti = model.el('fsMulti');
        let multiValue = model.data('rollResponse').FsBonus.Multi;
        fsMulti.frameName = 'multi' + multiValue + '.png';

        if (multiValue > model.data('fsMulti')) {
            model.el('zombie').Up();
            model.data('fsMulti', multiValue);
        }

        // if (model.data('fsMulti') === 7) {
        //     let brain = model.el('flyingBrain');
        //     brain.setAnimationByName(0, 'Win2', false);
        //     let zombie = model.el('zombie');
        //     zombie.Up();
        //     zombie.Up();
        // }
        changeBrainPanel();
    }

    function drawBrainPanel() {
        let x, y;
        let game = model.el('game');
        if (model.flag('mobile')) {
            let mozgCountBG = model.el('mozgCountBG');
            x = mozgCountBG.x;
            y = mozgCountBG.y;
        } else {
            x = 972;
            y = 949;
        }
        let brainPanel = game.add.sprite(x, y, 'mozgiPanel', '01.png');
        brainPanel.anchor.set(0.5);
        brainPanel.visible = false;
        model.el('brainPanel', brainPanel);
    }

    function changeBrainPanel() {
        let levelValue = model.data('rollResponse').FsBonus.Level;
        let levelABS = levelValue % 3;
        let brainPanel = model.el('brainPanel');
        if (levelABS === 0) {
            brainPanel.frameName = `03.png`;
            setTimeout(() => {
                brainPanel.visible = false;
            }, 500);
        } else {
            brainPanel.visible = true;
            brainPanel.frameName = `0${levelABS}.png`;
        }
    }

    events.on('fs:init', initFS);
    events.on('fs:next', startFSRoll);
    events.on('fs:stop', stopFS);
    events.on('fs:brain', fsBrain);
    // events.on('autoplay:init:desktop', initAutoplay);
    // events.on('autoplay:stop', stopAutoplay);
    // events.on('autoplay:stop:desktop', stopAutoplay);

    return {
        initFS
    };

})();
