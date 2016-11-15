import { model } from 'modules/Model/Model';
import { noConnect } from 'modules/Util/NoConnect';

export let request = (() => {
    const serviceUrl = 'http://gameservice.bossgs.org/devslotv2/SlotService.svc';
    let casinoID = 1;
    let userID = 1;

    if (localStorage.getItem('userID')) {
        userID = localStorage.getItem('userID');
    }
    if (localStorage.getItem('casinoID')) {
        casinoID = localStorage.getItem('casinoID');
    }

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
        return new Promise(function (resolve, reject) {
            if (model.state('isNoConnect')) {
                resolve(noConnect[name]);
            } else {
                let func = function (res) {
                    console.info(`Request: ${url}`);
                    console.log('success', name, res);
                    resolve(res);
                };
                $.ajax({
                    url: url,
                    dataType: 'JSONP',
                    type: 'GET',
                    success: func,
                    error: reject
                });
            }
        });
    }
    return {
        send
    };
})();
