import { model } from 'modules/Model/Model';
import { view } from 'modules/AutoDeskButton/view';

export let controller = (() => {

    function init() {
        let autoButton = view.drawAutoButton({
            x: 500,
            y: 100
        });
        autoButton.onInputDown.add(() => {
            if (model.state('autoButton:open')) {
                view.showNormalAutoButton({});
                autoButton.freezeFrames = false;
                view.closeAutoButton({})
                    .onComplete.add(() => {
                        model.state('autoButton:open', false);
                    });
            } else {
                view.showEmptyAutoButton({});
                autoButton.freezeFrames = true;
                view.openAutoButton({})
                    .onComplete.add(() => {
                        model.state('autoButton:open', true);
                    });
            }
        });
    }

    return {
        init
    }
})();
