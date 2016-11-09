import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileSettings/view';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    function init() {

        view.drawSettingsContainer({});
        view.drawOverlay({});

        let menuBG = view.drawMenuBG({});
            menuBG.inputEnabled = true;
            menuBG.input.priorityID = 1;

        view.drawMenuBorder({});
        view.drawMenuTitle({});

        // let soundButton = view.drawSoundButton({});
        //     soundButton.inputEnabled = true;
        //     soundButton.input.priorityID = 2;
        //     soundButton.events.onInputDown.add(handleSoundButton);
        //
        // view.drawSoundButtonText({});
        // let musicButton = view.drawMusicButton({});
        //     musicButton.inputEnabled = true;
        //     musicButton.input.priorityID = 2;
        //     musicButton.events.onInputDown.add(handleMusicButton);
        //
        // view.drawMusicButtonText({});
    }

    function handleSoundButton() {
        // if (controller.isEvent) return;
        // events.trigger('buttons:changeSoundButton');

        sound.sounds.button.play();

        if (model.state('sound')) {
            view.changeSoundButtonFrameToOff();
            model.state('sound', false);
        } else {
            view.changeSoundButtonFrameToOn();
            model.state('sound', true);
        }
    }

    function handleMusicButton() {

        sound.sounds.button.play();

        if (model.state('music')) {
            view.changeMusicButtonFrameToOff();
            model.state('music', false);
        } else {
            view.changeMusicButtonFrameToOn();
            model.state('music', true);
        }
    }

    return {
        init
    };
})();
