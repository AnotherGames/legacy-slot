import {model} from "modules/Model/Model";
import {request} from "../../../../Info/Request";
import {config} from "modules/Util/Config";

import Footer from "../../../../Info/Footer";

import {view as balanceView} from "modules/Balance/BalanceView";
import {view as bonusView} from "modules/States/Bonus/BonusView";
import {view as mainView} from "modules/States/Main/MainView";
import {controller as soundController} from "../../../../Info/SoundController";
import {controller as mobileSetBetController} from "modules/Menu/SetBet/MenuSetBetController";

class Door {
	constructor(x, y, arr, index) {
		this.game = model.el('game');

		this.x = (model.desktop) ? x : x * 2 / 3;
		this.y = (model.desktop) ? y : y * 2 / 3;
		this.doors = arr;
		this.index = index;
		this.deltaTime = 100 * this.index;

		this.destroyed = false;
		this.isWinPlayed = false;

		this.sprite = this.game.add.sprite(this.x, this.y, 'doors', `${index}.png`);
		this.sprite.anchor.set(0.5);
		this.sprite.inputEnabled = true;
		this.sprite.events.onInputDown.add(handleDoorClick, this);
		this.sprite.events.onInputOver.add(handleDoorHover, this);
		this.sprite.alpha = 0.01;
		model.group('bg').add(this.sprite);

	}

	showHover() {
		if (this.destroyed === true) return;
		let number = this.index;
		bonusView.draw.changeAnim({number: number, anim: 'target'});

		if (model.el('targetTimer')) {
			let targetTimer = model.el('targetTimer');
			this.game.time.events.remove(targetTimer);
		}

		let newTimer = this.game.time.events.add(4000, () => {
			bonusView.draw.targetAnim({});
		});
		model.el('targetTimer', newTimer);
	}

	win() {

		this.destroyed = true;

		soundController.sound.playSound({sound: 'coins', duration: 1500, volume: 2});

		let number = this.index;
		bonusView.draw.showWinAnim({number: number});

		let numberMulti = parseInt(this.data.CurrentValue.Multi, 10);
		this.animMulti(numberMulti);
	}

	animMulti(multi) {
		this.multi = this.game.add.sprite(this.x, this.y, 'multi', `x${multi}.png`, model.group('bg'));
		this.multi.anchor.set(0.6, 0.8);
		this.multi.anchor.set(0.5);
		this.multi.alpha = 0;
		this.multi.scale.set(0.1);

		this.game.add.tween(this.multi).to({alpha: 1}, 500, 'Linear', true);
		this.game.add.tween(this.multi.scale).to({x: 2.0, y: 2.0}, 700, Phaser.Easing.Bounce.Out, true)
			.onComplete.add(() => {
			this.game.add.tween(this.multi.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true)
		});
	}

	fail() {
		this.destroyed = true;
		let number = this.index;
		bonusView.draw.changeAnim({number: number, anim: 'open'});
		bonusView.draw.showFailBubbles({x: this.x, y: this.y, number: number});
		soundController.sound.playSound({sound: 'bubbleFail', soundVolume: 3});
	}

}

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
		soundController.music.stopMusic('startPerehod');
		soundController.music.stopMusic('fon');
		soundController.music.stopMusic('initFon');
		soundController.music.playMusic('bonusFon');

		bonusView.draw.mainBG({});
		bonusView.draw.doorsElements({});

		for (let i = 0; i < 5; i++) {
			this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
		}

		model.el('doors', this.doors);

		if (model.desktop) {
			mainView.draw.addBubbles({container: model.group('bg'), x: this.game.world.centerX});
			// mainView.draw.addFishes({ y1: 650, y2: 900 });
			bonusView.draw.addLight({});
			bonusView.draw.upperBG({});
			footer.initFsDesktop();
			footer.addTopFooter();
			balanceView.draw.FSMobileBalance({});
		} else {
			footer.initMobile();
			mobileSetBetController.init({});
			balanceView.draw.FSMobileBalance({});
		}
		balanceView.draw.CashBalance({});

		if (model.data('savedFS')) {
			this.drawRecoveredPanel();
			// model.updateBalance({});
		} else {
			model.updateBalance({startBonus: true});
		}

	}

	update() {
		let game = model.el('game');

		model.el('footer').update();
		game.winAnims.forEach((anim) => {
			anim();
		});

		if (model.mobile && !game.device.iOS) {
			(game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
		}
	}

	drawRecoveredPanel() {
		let saved = model.data('savedFS').PrevValues;
		for (let i = 0; i < saved.length; i++) {
			let index = parseInt(saved[i].Index, 10);
			let multi = parseInt(saved[i].Multi);
			let door = this.doors[index];

			door.destroyed = true;
			bonusView.draw.showWinAnim({number: index + 1});
			// bonusView.draw.changeAnim({number: index + 1, anim: 'target'});
			door.animMulti(multi)
			if (saved.length === 0) {
				model.data('bonusWinCoins', 0)
			} else {
				model.data('bonusWinCoins', saved[saved.length - 1].TotalWinCoins)
			}
			model.data('savedFS', null);
		}
	}


}

function handleDoorHover() {
	if (model.state('hoverBonus') == false) return;
	this.showHover();
}

function handleDoorClick() {
	if (this.destroyed || model.state('doorFinish') || !model.state('bonusReady')) return;
	this.destroyed = true;
	model.state('bonusReady', false);
	request.send('Roll', null, this.index - 1)
		.then((data) => {
			this.data = data;
			model.data('bonusRollResponse', data);
			if (data.ErrorCode) {
				model.el('popup').showReloadPopup(data.ErrorMessage);
				return;
			}
			model.data('bonusWinCoins', data.CurrentValue.TotalWinCoins);
			console.log(data);
		})
		.then(() => {
			return request.send('Ready');
		})
		.then((readyData) => {
			if (readyData.ErrorCode) {
				model.el('popup').showReloadPopup(readyData.ErrorMessage);
				return;
			}
		})
		.then(() => {
			model.updateBalance({startBonusRoll: true});
			if (!this.isWinPlayed) {
				if (this.data.CurrentValue.Multi != 'Exit') {
					model.state('bonusReady', true);
					this.win();
					this.isWinPlayed = true;
					if (this.data.BonusEnd) {
						// Переходной экран Big Win
						bonusView.draw.showWin({winTextFrame: 'bigW.png'});
						soundController.sound.playSound({sound: 'win'});
						soundController.music.stopMusic('bonusFon');
						setTimeout(() => {
							endBonus();
						}, 4500);
					}
				} else {
					model.state('doorFinish', true);
					this.fail(this.sprite);
					this.isWinPlayed = true;
					// Переходной экран Total Win
					bonusView.draw.showWin({});
					soundController.sound.playSound({sound: 'win'});
					soundController.music.stopMusic('bonusFon');
					setTimeout(() => {
						endBonus();
					}, 4500);
				}
			}
		})
		.catch((err) => {
			model.el('popup').showReloadPopup();
			console.error(err);
		});
}


function endBonus() {
	model.updateBalance({endBonus: true});
	model.state('buttons:locked', false);
	model.state('bonus', false);
	model.state('doorFinish', false);
	model.el('game').state.start('Main');
}
