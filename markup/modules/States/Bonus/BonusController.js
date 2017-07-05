import {model} from "modules/Model/Model";
import {request} from "../../../../Info/Request";
import {config} from "modules/Util/Config";
import Footer from "../../../../Info/Footer";
import DoorLevel from 'modules/Class/DoorLevel';

import {view as balanceView} from "modules/Balance/BalanceView";
import {view as bonusView} from "modules/States/Bonus/BonusView";
import {controller as soundController} from "../../../../Info/SoundController";
import {controller as mobileSetBetController} from "modules/Menu/SetBet/MenuSetBetController";

export class Bonus {

	init() {
		this.game = model.el('game');
		this.game.winAnims = [];
		this.doors = [];
		this.level = 0;

		this.game.frameAnims = [];
		this.game.spriteAnims = [];

		model.data('bonusWinCoins', 0);
		model.state('bonus', true);
		model.state('bonusReady', true);

		bonusView.create.groups({});

	}

	create() {
		let footer = new Footer({model, soundController, request});
		model.el('footer', footer);
		footer.initMobile();
		balanceView.draw.FSMobileBalance({});
		balanceView.draw.CashBalance({});


		// Играем фоновую музыку
		soundController.music.stopMusic('startPerehod');
		soundController.music.stopMusic('fon');
		soundController.music.stopMusic('initFon');
		soundController.music.playMusic('bonusFon');

		if (model.data('savedFS')) {
			this.drawRecoveredPanel();
		} else {
			model.updateBalance({startBonus: true});
			model.updateBalance({startFSRoll: true});
		}

		let level = new DoorLevel({container: model.group('main'), level: this.level});
		if (model.mobile) {
			mobileSetBetController.init({});
		}


	}

	update() {
		let game = model.el('game');

		model.el('footer').updateTime();
		game.winAnims.forEach((anim) => {
			anim();
		});

		if (model.mobile && !game.device.iOS) {
			(game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
		}
	}

	drawRecoveredPanel() {
		let saved = model.data('savedFS').PrevValues;
		if (saved.length === 0) {
			model.data('bonusWinCoins', 0)
		} else {
			model.data('bonusWinCoins', model.data('bonusWinCoins') + saved[saved.length - 1].TotalWinCoins)
		}
		console.log(saved);
		this.level = saved.length;
		model.data('savedFS', null);
	}

}