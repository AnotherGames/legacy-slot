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

		soundController.music.stopMusic('startPerehod');
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

// function handleDoorClick() {
// 	if (this.destroyed || model.state('doorFinish') || !model.state('bonusReady')) return;
// 	let doorIndex = this.doors.findIndex((element) => {
// 		return this === element;
// 	});
//
// 	request.send('Roll', null, doorIndex)
// 		.then((data) => {
// 			model.state('bonusReady', false);
// 			this.data = data;
// 			model.data('bonusRollResponse', data);
// 			if (data.ErrorCode) {
// 				mainView.draw.showPopup({message: data.ErrorMessage});
// 				return;
// 			}
// 			model.data('bonusWinCoins', model.data('bonusWinCoins') + data.CurrentValue.TotalWinCoins);
// 			console.log(data);
// 		})
// 		.then(() => {
//
// 			return request.send('Ready');
// 		})
// 		.then((readyData) => {
// 			if (readyData.ErrorCode) {
// 				mainView.draw.showPopup({message: readyData.ErrorMessage});
// 				return;
// 			}
//
// 			model.state('bonusReady', true);
// 		})
// 		.then(() => {
// 			model.updateBalance({startBonusRoll: true});
// 			if (!this.isWinPlayed) {
//
// 				if (this.data.CurrentValue.Multi != 'Exit') {
// 					this.win();
// 					this.isWinPlayed = true;
// 					if (this.data.BonusEnd) {
// 						// Переходной экран Big Win
// 						soundController.sound.playSound({sound: 'illumWin'});
// 						this.doors.forEach((door) => {
// 							door.finalGold = this.game.add.sprite(door.x, door.y, 'coins', 'skeleton-2_01.png');
// 							door.finalGold.animations.add('gold', Phaser.Animation.generateFrameNames('skeleton-2_', 1, 44, '.png', 2), 30, false);
// 							door.finalGold.anchor.set(0.5, 0.1);
// 							door.finalGold.alpha = 0;
// 							if (model.desktop) door.finalGold.scale.set(1.5);
//
// 							door.finalGold.play('gold')
// 								.onComplete.add(() => {
// 								door.finalGold.alpha = 0;
// 							});
// 							door.game.add.tween(door.finalGold)
// 								.to({alpha: 1}, 500, 'Linear', true);
// 						});
// 						soundController.sound.playSound({sound: 'win'});
// 						bonusView.draw.showWin({winTextFrame: 'bigW.png'});
// 						soundController.music.stopMusic('bonusFon');
// 						setTimeout(() => {
// 							endBonus();
// 						}, 4500);
// 					}
// 				} else {
// 					model.state('doorFinish', true);
// 					this.fail();
// 					this.isWinPlayed = true;
// 					bonusView.draw.showOctopus({});
// 					// Переходной экран Total Win
// 					bonusView.draw.showWin({});
// 					soundController.music.stopMusic('bonusFon');
// 					setTimeout(() => {
// 						endBonus();
// 					}, 4500);
// 				}
// 			}
// 		})
// 		.catch((err) => {
// 			if (err.status) {
// 				mainView.draw.showPopup({message: 'Connection problem. Click to restart'});
// 			}
// 			console.error(err);
// 		});
// }
