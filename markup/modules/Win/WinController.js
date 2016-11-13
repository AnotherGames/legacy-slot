import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Win/WinView';

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

            events.trigger('autoplay:stop');

            // setTimeout(() => {
            //     events.trigger('main:drawTransitionScreen');
            // }, 2000);
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
    }

    function cleanWin() {
        let container = model.group('winTop');
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);
        view.hide.WinTop({})
            .onComplete.add(() => {
                container.removeAll();
                container.alpha = 1;
            });;
    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin);
    events.on('win:clean', cleanWin);

})();
