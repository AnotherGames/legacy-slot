import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('transition', game.add.group());
            model.group('footerMenu', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let deltaY = (model.desktop) ? 30 : -10;
            let gameMachineBG = game.add.sprite(0, deltaY, 'initBG', null, container);
            gameMachineBG.anchor.set(0.5);
            if (model.desktop) {
	            gameMachineBG.scale.set(0.675);
            } else {
	            gameMachineBG.scale.set(0.76);
            }
            model.el('gameMachineBG', gameMachineBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 3);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 4);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 5);
            model.group('winTop', winTop);

            machineGroup.glistaLightContainer = game.add.group();
            model.group('glistaLight', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.group('elements', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.group('glista', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 30 : -10;
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        addLantern: function({
	            game = model.el('game'),
	            container = model.group('main'),
	            x,
	            y
        }) {
          let lantern = game.add.sprite(x, y, 'lantern', null, container)
	        lantern.anchor.set(0.5, 0);
	        model.el('lantern', lantern);

	        if (model.desktop) {
		        draw.rotateLantern(lantern);
	        }
        },

        rotateLantern: function(lantern) {
	        let game = model.el('game');
	        game.add.tween(lantern).to({rotation: -Math.PI / 16}, 1500, 'Linear', true)
                .onComplete.add(()=> {
		            game.add.tween(lantern).to({rotation: Math.PI / 16}, 3000, 'Linear', true)
                        .onComplete.add(()=> {
			                game.add.tween(lantern).to({rotation: 0}, 1500, 'Linear', true)
                                .onComplete.add(()=> {
			                    draw.rotateLantern(lantern)
                            })
                    })
            });
        },

        addGerman: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let germanAnims = [];
            for (let i = 1; i < 4; i++) {
                let german = game.add.sprite(-game.width / 2, 70, `german${i}`, null, container);
                german.anchor.set(0.5);
                german.scale.set(1.5);
                german.animations.add('move');
                if (i !== 1) {
                    german.visible = false;
                }
                germanAnims.push(german);
            }

            model.el('germanAnims', germanAnims);

            game.time.events.add(5000, () => {
                this.moveGerman({});
            });
        },

        moveGerman: function ({
            game = model.el('game')
        }) {
            let germanAnims = model.el('germanAnims');
            let rnd = game.rnd.integerInRange(0, 2);
            let time = game.rnd.integerInRange(10, 20);

            germanAnims.forEach((anim, index) => {
                if (index === rnd) {
                    anim.visible = true;
                    anim.animations.play('move', 10, false);
                } else {
                    anim.visible = false;
                }
            });

            game.time.events.add(time * 1000, () => {
                this.moveGerman({});
            });
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let lineNumbersArr = [];

            let y = (model.desktop) ?
                [252, 297, 342, 390, 495, 543, 590, 735, 785, 830, 875, 252, 297, 345, 390, 543, 590, 637, 737, 782, 832, 877] :
                [73, 108, 143, 178, 258, 292, 328, 438, 473, 508, 543, 73, 108, 143, 178, 290, 325, 360, 438, 473, 508, 543];

            let numbs = [4, 6, 18, 11, 9, 1, 20, 10, 19, 7, 5, 13, 15, 2, 17, 1, 21, 8, 16, 3, 14, 12];

            let deltaXright = (model.desktop) ? 45 : 18;
            let deltaXleft = (model.desktop) ? 29 : 12;
            if (model.state('fs')) {
                deltaXright = (model.desktop) ? 39 : 18;
            }
            let x = gameMachine.left + deltaXleft;
            let deltaY = (model.desktop) ? 97 : 0;

            for (let i = 0; i < 22; i++) {
                if (i == 11) x = gameMachine.right - deltaXright;
                let lineNumber = game.add.sprite(x, y[i] - gameMachine.height / 2,
                    'winSplash',
                    null,
                    container);

                lineNumber.name = numbs[i];
                lineNumber.anchor.set(0.5);
                if (model.mobile) {
                    lineNumber.scale.set(0.75);
                }
                lineNumber.alpha = 0.05;

                lineNumber.animations.add('win');

                if (model.state('fs')) {
                    lineNumber.y = lineNumber.y - deltaY;
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.hitArea = new Phaser.Circle(0, 0, 50);

                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        game.time.events.add(4000, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.lineShape.destroy();
                            }
                        });
                    });
                }

                lineNumbersArr.push(lineNumber);
            }

            model.el('lineNumbersArr', lineNumbersArr);
        },

        lineShape: function (number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            let gameMachine = model.el('gameMachine');
            let deltaX = 50;
            let deltaY = (model.desktop) ? 200 : 40;
            lineShape
               .lineStyle(4, 0x634c42, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[0].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[1].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[1].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[2].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[2].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[3].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[3].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY)
               .lineTo((line[4].X + 0.5) * elSize.width - gameMachine.width / 2 + deltaX, (line[4].Y + 0.5) * elSize.height - gameMachine.height / 2 + deltaY);
            return lineShape;
        }
    };

    return {
        create,
        draw
    };
})();
