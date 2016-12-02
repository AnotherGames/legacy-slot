import { model } from 'modules/Model/Model';

import { view } from 'modules/Win/View';
import { view as transitionView } from 'modules/Transition/View';

import { controller as autoplayController } from 'modules/Autoplay/Controller';

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
        if (mode == 'root' && nextMode == 'fsBonus') {

            model.state('buttons:locked', true);

            if (model.state('autoplay:start')) {
                if (!model.state('autoStopWhenFS')) {
                    model.data('remainAutoCount', model.data('autoplay:count'));
                }
                autoplayController.stop();
            }

            model.data('startFSScreen', data.Screen);
            model.data('firstScreen', data.Screen);
            game.input.keyboard.enabled = false;

            game.time.events.add(1500, () => {
                transitionView.fsStart();

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
            if (model.state('autoplay:end')
            && model.state('fs:end')
            && !model.state('roll:progress')) {
                oneAfterAnother();
            }
        });
    }

    function cleanWin(cleanAlpha = false) {
        let container = model.group('winTop');
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);

        if (cleanAlpha) {
            let wheels = model.el('wheels');
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.show();
                    // element.normal();
                });
            });
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
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count, alpha: 0.5});
                view.draw.WinGlista({number: currentLine.Line});
                view.draw.WinLineTable({line: currentLine});
            } else {
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count, alpha: 0.5});
                view.draw.WinLineTable({line: currentLine, scatter: true});
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

    return {
        showWin,
        cleanWin
    };

})();
