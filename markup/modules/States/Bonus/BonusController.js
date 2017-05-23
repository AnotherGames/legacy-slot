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
		this.deltaTime = 100 * index;

		this.destroyed = false;
		this.isWinPlayed = false;

		this.light = this.game.add.sprite(this.x, this.y, 'light');
		this.light.anchor.set(0.5);
		this.light.alpha = 0;
		model.group('bg').add(this.light);

		this.sprite = this.game.add.sprite(this.x, this.y, 'illuminators', `${index}.png`);
		this.sprite.anchor.set(0.5);
		this.sprite.inputEnabled = true;
		this.sprite.events.onInputDown.add(handleDoorClick, this);
		model.group('bg').add(this.sprite);

		this.lightBlinking(1000);
		this._x = x;
	}

	win() {
		let rnd = this.game.rnd.integerInRange(1, 3);
		soundController.sound.playSound({sound: `illumBreak${rnd}`});
		soundController.sound.playSound({sound: 'illumWin', duration: 1200});

		this.destroyed = true;

		this._playGold();
		this._playGlassBoom();
		this._playTable(parseInt(this.data.CurrentValue.Multi, 10));
	}

	fail() {
		this.destroyed = true;

		soundController.sound.playSound({sound: 'illumFail', soundVolume: 3});

		this.doors.forEach((door) => {
			door.tentacle = this.game.add.sprite(door.x - 50, door.y + 5, 'tentacles');
			door.tentacle.anchor.set(0.5);
			door.tentacle.angle = this.game.rnd.integerInRange(-40, 40);
			if (model.mobile) {
				door.tentacle.scale.set(0.66);
				door.tentacle.angle = this.game.rnd.integerInRange(-30, 30);
			}
			model.group('bg').add(door.tentacle);

			let tentacleShow = door.tentacle.animations.add('show', Phaser.Animation.generateFrameNames('tc1_', 0, 16, '.png', 2), 20, false);
			door.tentacle.animations.add('move', Phaser.Animation.generateFrameNames('tc2_', 0, 16, '.png', 2), 20, true);
			door.tentacle.animations.play('show');
			tentacleShow.onComplete.add(() => {
				door.tentacle.animations.play('move');
			}, door);

			this.game.add.tween(door.sprite)
				.to({alpha: 0}, 500, 'Linear', true);
			if (door.table) {
				this.game.add.tween(door.table)
					.to({alpha: 0}, 300, 'Linear', true);
			}
		});

	}

	lightBlinking(delay = 0) {
		let game = model.el('game');
		game.time.events.add(delay, () => {
			if (this.destroyed || model.state('doorFinish')) {
				return;
			}
			this.game.add.tween(this.light).to({alpha: 0.6}, 500, 'Linear', true, 0, 0, true)
				.onComplete.add(() => {
				this.lightBlinking(4000);
			})
		});
	}

	_playGold() {
		this.gold = this.game.add.sprite(this.x, this.y, 'coins', 'skeleton-2_01.png');
		this.gold.animations.add('gold', Phaser.Animation.generateFrameNames('skeleton-2_', 1, 44, '.png', 2), 30, false);
		this.gold.anchor.set(0.5, 0.1);
		this.gold.alpha = 0;
		if (model.desktop) this.gold.scale.set(1.5);

		this.gold.play('gold')
			.onComplete.add(() => {
			this.gold.alpha = 0;
		});
		this.game.add.tween(this.gold)
			.to({alpha: 1}, 500, 'Linear', true);

		model.group('bg').add(this.gold);
	}

	_playGlassBoom() {
		this.glass = this.game.add.sprite(this.x, this.y, 'coins', 'skeleton-1_01.png');
		this.glass.animations.add('glassBoom', Phaser.Animation.generateFrameNames('skeleton-1_', 1, 19, '.png', 2), 30, false);
		this.glass.anchor.set(0.5);
		this.glass.alpha = 0;


		this.glass.play('glassBoom')
			.onComplete.add(() => {
			this.glass.alpha = 0;
		});
		this.game.add.tween(this.glass)
			.to({alpha: 1}, 500, 'Linear', true);

		model.group('bg').add(this.glass);
	}

	_playTable(value) {
		this.game.add.tween(this.sprite)
			.to({alpha: 0}, 300, 'Linear', true);
		this.table = this.game.add.sprite(this.x, this.y, 'bonusNumber', `x${value}.png`);
		this.table.anchor.set(0.6, 0.8);
		this.table.alpha = 0;
		this.table.angle = this.game.rnd.integerInRange(-15, 15);
		if (model.mobile) this.table.scale.set(0.66);

		this.game.add.tween(this.table)
			.to({alpha: 1}, 500, 'Linear', true);
		this.game.add.tween(this.table)
			.from({y: this.table.y + 50}, 400, 'Linear', true);
		model.group('bg').add(this.table);
	}

}

export class Bonus {

	init() {
		this.game = model.el('game');
		this.game.winAnims = [];
		this.doors = [];

		this.game.frameAnims = [];
		this.game.spriteAnims = [];

		model.updateBalance({startFSRoll: true})
		model.data('bonusWinCoins', 0);
		model.state('bonus', true);
		model.state('bonusReady', true);

		bonusView.create.groups({});

	}

	create() {
		let footer = new Footer({model, soundController, request});
		model.el('footer', footer);

		footer.initMobile();
		soundController.music.stopMusic('fon');

		soundController.music.playMusic('bonusFon');
		bonusView.draw.mainBG({});

		bonusView.draw.bigFish({});
		for (let i = 0; i < 5; i++) {
			this.doors.push(new Door(config.illuminatorsCoords[i].x, config.illuminatorsCoords[i].y, this.doors, i + 1));
		}


		model.el('doors', this.doors);
		if (model.desktop) {
			mainView.draw.addBubbles({});
			mainView.draw.addFishes({y1: 650, y2: 900});
			bonusView.draw.addLight({});
			bonusView.draw.upperBG({});
			balanceView.draw.FSMobileBalance({});
		} else {
			mobileSetBetController.init({});
			balanceView.draw.FSMobileBalance({});
		}

		balanceView.draw.CashBalance({});
		model.updateBalance({startBonus: true});

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
		for (let i = 0; i < saved.length; i++) {
			let index = parseInt(saved[i].Index);
			let door = this.doors[index];
			door.destroyed = true;
			door._playGold();
			door._playGlassBoom();
			let multi = parseInt(saved[i].Multi);

			door._playTable(multi);
		}
		if (saved.length === 0) {
			model.data('bonusWinCoins', 0)
		} else {
			model.data('bonusWinCoins', model.data('bonusWinCoins') + saved[saved.length - 1].TotalWinCoins)
		}
		model.data('savedFS', null);
	}

}

function handleDoorClick() {
	if (this.destroyed || model.state('doorFinish') || !model.state('bonusReady')) return;
	let doorIndex = this.doors.findIndex((element) => {
		return this === element;
	});

	request.send('Roll', null, doorIndex)
		.then((data) => {
			model.state('bonusReady', false);
			this.data = data;
			model.data('bonusRollResponse', data);
			if (data.ErrorCode) {
				model.el('popup').showReloadPopup(data.ErrorMessage);
				return;
			}
			model.data('bonusWinCoins', model.data('bonusWinCoins') + data.CurrentValue.TotalWinCoins);
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

			model.state('bonusReady', true);
		})
		.then(() => {
			model.updateBalance({startBonusRoll: true});
			if (!this.isWinPlayed) {

				if (this.data.CurrentValue.Multi != 'Exit') {
					this.win();
					this.isWinPlayed = true;
					if (this.data.BonusEnd) {
						// Переходной экран Big Win
						soundController.sound.playSound({sound: 'illumWin'});
						this.doors.forEach((door) => {
							door.finalGold = this.game.add.sprite(door.x, door.y, 'coins', 'skeleton-2_01.png');
							door.finalGold.animations.add('gold', Phaser.Animation.generateFrameNames('skeleton-2_', 1, 44, '.png', 2), 30, false);
							door.finalGold.anchor.set(0.5, 0.1);
							door.finalGold.alpha = 0;
							if (model.desktop) door.finalGold.scale.set(1.5);

							door.finalGold.play('gold')
								.onComplete.add(() => {
								door.finalGold.alpha = 0;
							});
							door.game.add.tween(door.finalGold)
								.to({alpha: 1}, 500, 'Linear', true);
						});
						soundController.sound.playSound({sound: 'win'});
						bonusView.draw.showWin({winTextFrame: 'bigW.png'});
						soundController.music.stopMusic('bonusFon');
						setTimeout(() => {
							endBonus();
						}, 4500);
					}
				} else {
					model.state('doorFinish', true);
					this.fail();
					this.isWinPlayed = true;
					bonusView.draw.showOctopus({});
					// Переходной экран Total Win
					bonusView.draw.showWin({});
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
