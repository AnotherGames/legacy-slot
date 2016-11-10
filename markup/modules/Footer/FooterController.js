import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Footer/FooterView';

export let controller = (() => {

    function initDesktop() {
        view.drawDesktopFooter({});
    }

    function initMobile() {
        view.drawMobileFooter({});

    }

    return {
        initDesktop,
        initMobile
    }

})();
