import { model } from '../../modules/Model/Model';

export let util = (function() {
    const serviceUrl = 'http://gameservice.bossgs.org/devslotv2/SlotService.svc';
    const casinoID = 1;
    const userID = 1;
    const mode = {
        normal: 'qos',
        fsBonus: 'qo5',
        bonus: 'qo2'
    };

    function request(name, options) {
        let url;
        switch (name) {
            case '_Initialise':
                url = `${serviceUrl}/${name}/${userID}/${casinoID}/${mode[options]}`
                break;
            case '_Roll':
                url = `${serviceUrl}/${name}/${model.data('sessionID')}/${model.data('currentBalance').betValue}/${model.data('currentBalance').coinsValue}`
                break;
            case '_Ready':
                url = `${serviceUrl}/${name}/${model.data('sessionID')}`
                break;
            case '_Logout':
                url = `${serviceUrl}/${name}/${model.data('sessionID')}`
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
        request
    }
})();
