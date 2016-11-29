import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { keyboard } from 'modules/Keyboard/Keyboard';

export let controller = (() => {

    model.data('glistaFiredCounter', 0);
    model.data('glistaDoneCounter', 0);

    function showWin() {

        let game = model.el('game'),
            mainContainer = model.group('main'),
            winTopContainer = model.group('winTop');

        let data = model.data('rollResponse'),
            winTotalData = data.Balance.TotalWinCoins,
            winLines = data.WinLines,
            mode = data.Mode,
            nextMode = data.NextMode;

        if (winLines.length === 0) return;

        // Check for FS
        if (mode == 'root' && nextMode.split('-')[0] == 'fsBonus') {

            model.state('lockedButtons', true);

            if (!model.state('autoEnd')) {
                if (!model.state('autoStopWhenFS')) {
                    model.data('remainAutoCount', model.data('autoCount'));
                }
                events.trigger('autoplay:stop');
            }

            model.data('startFSScreen', data.Screen);
            model.data('firstScreen', data.Screen);
            keyboard.removeDefaultKey();

            game.time.events.add(1500, () => {
                transitionView.fsStart();
                console.log('I am in FS!');
                // game.state.start('FS');
            });
        }

        view.play.WinSound();
        view.draw.TotalWin({winTotalData});

        winLines.forEach((winLine) => {
            view.draw.WinNumber({number: winLine.Line});
            view.draw.WinElements({number: winLine.Line, amount: winLine.Count});
            view.draw.WinGlista({number: winLine.Line});
        });

        game.time.events.add(1400, () => {
            if (model.state('autoEnd')
            && model.state('fsEnd')
            && !model.state('roll:progress')) {
                oneAfterAnother();
            }
        });
    }

    function cleanWin(cleanAlpha = false) {
        let container = model.group('winTop');
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);
        let leftArr = model.el('leftArr');
        let rightArr = model.el('rightArr');

        leftArr.forEach((el) => {
            el.normal();
        });

        rightArr.forEach((el) => {
            el.normal();
        })

        if (cleanAlpha) {
            // let wheels = model.el('wheels');
            // wheels.forEach((wheel) => {
            //     wheel.elements.forEach((element) => {
            //         element.sprite.alpha = 1;
            //     });
            // });
        }

        view.hide.WinTop({})
            .onComplete.add(() => {
                container.removeAll();
                container.alpha = 1;
            });;
    }

    function oneAfterAnother() {
        if (model.state('roll:progress')) return;

        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);

        let index = model.data('currentLineIndex') || 0;
        let winLines = model.data('rollResponse').WinLines;
        if (index >= winLines.length) {
            index = 0;
        }
        let currentLine = winLines[index];

        if (currentLine) {
            if (currentLine.Line > 0) {
                model.state('axesPlaing', false);
                view.draw.WinNumber({number: currentLine.Line});
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count, alpha: 1});
                view.draw.WinGlista({number: currentLine.Line});
                view.draw.WinLineTable({line: currentLine});
            } else {
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count, alpha: 1});
                // view.draw.WinLineTable({line: currentLine, scatter: true});
            }
        } else {
            return;
        }

        let nextIndex = ++index;
        if (nextIndex == winLines.length) {
            nextIndex = 0;
        }

        model.data('currentLineIndex', nextIndex);

        let game = model.el('game');
        game.time.events.add(1400, () => {
            oneAfterAnother();
        });

    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin.bind(null, true));
    events.on('win:clean', cleanWin);

})();
