import { model } from 'modules/Model/Model';

class Door {
    constructor(x, y) {
        this.game = model.el('game');

        this.x = x;
        this.y = y;

        this.destroyed = false;
        this.isWinPlayed = false;

        this.sprite = this.game.add.graphics(x, y);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(handleDoorClick, this);

        this.sprite.beginFill(0xFF0000);
        this.sprite.drawRect(0, 0, 50, 50);

    }

    win() {
        console.log('I am win door!', this.sprite);
        this.game.add.tween(this.sprite)
            .to({alpha: 0}, 500, 'Linear', true);
    }
}

export class Bonus {

    init() {
        this.doors = [];
        console.log('I am inited!');
    }

    create() {
        for (let i = 0; i < 5; i++) {
            this.doors.push(new Door(100 * i, 150 * i));
        }
    }

    update() {
        this.doors.forEach((door) => {
            if (door.destroyed && !door.isWinPlayed) {
                door.win();
            }
        });
    }


}
    function handleDoorClick() {
        this.win();
        console.log('I am clicked!');
    }
