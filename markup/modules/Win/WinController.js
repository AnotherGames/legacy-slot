import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let controller = (() => {

    model.data('glistaFiredCounter', 0);
    model.data('glistaDoneCounter', 0);

    function showWin() {

        let mainContainer = model.group('main'),
            winTopContainer = model.group('winTop');

        let data = model.data('rollResponse'),
            winTotalData = data.Balance.TotalWinCoins,
            winLines = data.WinLines,
            mode = data.Mode,
            nextMode = data.NextMode;

        if (mode == 'root' && nextMode == 'fsBonus') {

            model.state('lockedButtons', true);

            if (!model.state('autoEnd')) {
                events.trigger('autoplay:stop');
            }

            setTimeout(() => {
                transitionView.fsStart();
            }, 1500);
        }

        if (winLines.length) {
            view.play.WinSound();
        }

        view.draw.TotalWin({winTotalData});

        winLines.forEach((winLine) => {
            view.draw.WinNumber({number: winLine.Line});
            view.draw.WinElements({number: winLine.Line, amount: winLine.Count});
            view.draw.WinGlista({number: winLine.Line});
        });
        model.state('showAllLines', true);
    }

    function cleanWin(cleanAlpha = false) {
        let container = model.group('winTop');
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);
        if (cleanAlpha) {
            let wheels = model.el('wheels');
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.sprite.alpha = 1;
                });
            });
        }
        view.hide.WinTop({})
            .onComplete.add(() => {
                console.log('I am hiding winTop!');
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

    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin.bind(null, true));
    events.on('win:clean', cleanWin);
    events.on('win:oneAfterAnother', oneAfterAnother);
    events.on('win:oneAfterAnother:next', oneAfterAnother);

})();
