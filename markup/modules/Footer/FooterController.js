import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Footer/FooterView';

export let controller = (() => {

    function initDesktop() {
        view.drawDesktopFooter({});
        view.drawTime({});
    }

    function initMobile() {
        view.drawMobileFooter({});
        view.drawTime({});
    }

    function updateTime() {
        view.updateTime();
    }

    return {
        initDesktop,
        initMobile,
        updateTime
    }

})();
