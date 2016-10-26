import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';
import { util } from '../../modules/Util/Util';

export class Boot {
    constructor(game) {

    }
    init() {
        console.info('Boot State!');
        util.request('_Initialise', 'normal')
            .then(this.parseInitData)
            .catch((error) => {
                console.error(error.message);
            });

        // if (this.game.device.desktop) {
            // this.game.scale.setGameSize(1920, 1080);
            // model.flag('desktop', true);
            // model.state('res', 'fullHD');
        // } else {
        this.game.scale.setGameSize(1280, 720);
        model.flag('mobile', true);
        model.state('res', 'HD');
        // }
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    preload() {
        this.load.path = `static/img/content/${model.state('res')}/`;
        this.load.image('preloadBar', 'preloader/preloaderBar.png');
        this.load.atlasJSONHash('preloadCoin', 'preloader/coin-0.png', 'preloader/coin.json');
    }
    create() {
        this.state.start('Preload');
    }

    parseInitData(data) {
        model.data('sessionID', data.SessionID);
        model.data('initBalance', data.Balance);
        model.data('lines', data.Lines);
        model.data('symbols', data.Symbols);
        model.data('saved', data.Saved);
        model.data('firstScreen', data.FirstScreen);
        let currentBalance = {
            betValue: data.Balance.BetLevel[0],
            coinsValue: data.Balance.CoinValue[0],
            currency: data.Balance.Currency,
            scoreCents: data.Balance.ScoreCents,
            scoreCoins: data.Balance.ScoreCoins
        };
        model.data('currentBalance', currentBalance);

        model.log();
    }
}
