import {model} from "modules/Model/Model";
import {request} from "../../../../Info/Request";
import {config} from "modules/Util/Config";
import Footer from "../../../../Info/Footer";
import DoorLevel from 'modules/Class/DoorLevel';

import {view as balanceView} from "modules/Balance/BalanceView";
import {view as bonusView} from "modules/States/Bonus/BonusView";
import {view as mainView} from "modules/States/Main/MainView";
import {controller as soundController} from "../../../../Info/SoundController";
import {controller as mobileSetBetController} from "modules/Menu/SetBet/MenuSetBetController";

export class Bonus {

	init() {
		this.game = model.el('game');
		this.game.winAnims = [];
		this.doors = [];

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
		model.updateBalance({startBonus: true});

		// Играем фоновую музыку
		soundController.music.stopMusic('startPerehod');
		soundController.music.stopMusic('fon');
		soundController.music.stopMusic('initFon');
		soundController.music.playMusic('bonusFon');

		let level = new DoorLevel({container: model.group('main'), level: 0});

		if (model.mobile) {
			mobileSetBetController.init({});
		}

		if (model.data('savedFS')) {
			this.drawRecoveredPanel();
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
		// for (let i = 0; i < saved.length; i++) {
		// 	let index = parseInt(saved[i].Index);
		// 	let door = this.doors[index];
		// 	door.destroyed = true;
		// 	door._playGold();
		// 	door._playGlassBoom();
		// 	let multi = parseInt(saved[i].Multi);
		//
		// 	door._playTable(multi);
		// }
		if (saved.length === 0) {
			model.data('bonusWinCoins', 0)
		} else {
			model.data('bonusWinCoins', model.data('bonusWinCoins') + saved[saved.length - 1].TotalWinCoins)
		}
		model.data('savedFS', null);
	}

}