import { model } from 'modules/Model/Model';

export let request = (() => {
    const serviceUrl = 'http://gameservice.bossgs.org/devslotv2/SlotService.svc';
    const casinoID = 1;
    const userID = 1;

    const mode = {
        normal: 'zombienorm2',
        fsBonus: 'zombiefs2'
    };

    function send(name, options) {
        let url;
        switch (name) {
            case 'Initialise':
                url = `${serviceUrl}/_${name}/${userID}/${casinoID}/${mode[options]}`;
                break;
            case 'Roll':
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}/${model.balance('betValue')}/${model.balance('coinValue') * 100}`;
                break;
            case 'Ready':
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}`;
                break;
            case 'Logout':
                url = `${serviceUrl}/_${name}/${model.data('sessionID')}`;
                break;
            default:
                console.warn('We have no such request!');
                break;
        }
        console.info(`Request: ${url}`);
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                dataType: 'JSONP',
                type: 'GET',
                success: resolve,
                error: reject
            });
        });
    }
    return {
        send
    };
})();
