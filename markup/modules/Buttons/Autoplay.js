import { model } from '../../modules/Model/Model';

export function drawAutoDesktop(container, game, mainContainer, autoButton) {
    // console.log(container);
    const autoDesktopContainer = game.add.group();
    container.addAt(autoDesktopContainer, 1);

    autoDesktopContainer.x = 650;
    autoDesktopContainer.y = autoButton.y;
    autoDesktopContainer.alpha = 0;
    model.el('autoDesktopContainer', autoDesktopContainer);

    const autoplayBG = game.add.sprite(
        0,
        0,
        'autoSelect',
        null,
        autoDesktopContainer);
    autoplayBG.anchor.set(0.5);

    const autoBG10 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 72, 37);
    autoBG10.x = -83;
    autoBG10.y = -60;
    autoBG10.alpha = 0;

    const autoText10 = game.add.text(
        autoBG10.x + autoBG10.width / 2,
        autoBG10.y + autoBG10.height / 2,
        '10',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText10.anchor.set(0.5);
    autoText10.setShadow(0, 0, '#e8b075', 2);

    autoBG10.inputEnabled = true;
    autoBG10.events.onInputOver.add(function () {
        autoBG10.alpha = 1;
    });
    autoBG10.events.onInputOut.add(function () {
        autoBG10.alpha = 0;
    });
    autoBG10.events.onInputDown.add(function () {
        console.log('i am autoBG10');
    });

    const autoBG25 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 75, 37);
    autoBG25.x = -5;
    autoBG25.y = -60;
    autoBG25.alpha = 0;

    const autoText25 = game.add.text(
        autoBG25.x + autoBG25.width / 2,
        autoBG25.y + autoBG25.height / 2,
        '25',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText25.anchor.set(0.5);
    autoText25.setShadow(0, 0, '#e8b075', 2);

    autoBG25.inputEnabled = true;
    autoBG25.events.onInputOver.add(function () {
        autoBG25.alpha = 1;
    });
    autoBG25.events.onInputOut.add(function () {
        autoBG25.alpha = 0;
    });
    autoBG25.events.onInputDown.add(function () {
        console.log('i am autoBG25');
    });

    const autoBG50 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 72, 37);
    autoBG50.x = -83;
    autoBG50.y = -19;
    autoBG50.alpha = 0;

    const autoText50 = game.add.text(
        autoBG50.x + autoBG50.width / 2,
        autoBG50.y + autoBG50.height / 2,
        '50',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText50.anchor.set(0.5);
    autoText50.setShadow(0, 0, '#e8b075', 2);

    autoBG50.inputEnabled = true;
    autoBG50.events.onInputOver.add(function () {
        autoBG50.alpha = 1;
    });
    autoBG50.events.onInputOut.add(function () {
        autoBG50.alpha = 0;
    });
    autoBG50.events.onInputDown.add(function () {
        console.log('i am autoBG50');
    });

    const autoBG100 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 75, 37);
    autoBG100.x = -5;
    autoBG100.y = -19;
    autoBG100.alpha = 0;

    const autoText100 = game.add.text(
        autoBG100.x + autoBG100.width / 2,
        autoBG100.y + autoBG100.height / 2,
        '100',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText100.anchor.set(0.5);
    autoText100.setShadow(0, 0, '#e8b075', 2);

    autoBG100.inputEnabled = true;
    autoBG100.events.onInputOver.add(function () {
        autoBG100.alpha = 1;
    });
    autoBG100.events.onInputOut.add(function () {
        autoBG100.alpha = 0;
    });
    autoBG100.events.onInputDown.add(function () {
        console.log('i am autoBG100');
    });

    const autoBG250 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 70, 37);
    autoBG250.x = -83;
    autoBG250.y = 23;
    autoBG250.alpha = 0;

    const autoText250 = game.add.text(
        autoBG250.x + autoBG250.width / 2,
        autoBG250.y + autoBG250.height / 2,
        '250',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText250.anchor.set(0.5);
    autoText250.setShadow(0, 0, '#e8b075', 2);

    autoBG250.inputEnabled = true;
    autoBG250.events.onInputOver.add(function () {
        autoBG250.alpha = 1;
    });
    autoBG250.events.onInputOut.add(function () {
        autoBG250.alpha = 0;
    });
    autoBG250.events.onInputDown.add(function () {
        console.log('i am autoBG250');
    });

    const autoBG500 = game.add.graphics(0, 0, autoDesktopContainer).beginFill(0xffffff, 0.2).drawRect(0, 0, 75, 37);
    autoBG500.x = -5;
    autoBG500.y = 23;
    autoBG500.alpha = 0;

    const autoText500 = game.add.text(
        autoBG500.x + autoBG500.width / 2,
        autoBG500.y + autoBG500.height / 2,
        '500',
        {font: 'normal 24px Arial', fill: '#e8b075', align: 'center'},
        autoDesktopContainer);
    autoText500.anchor.set(0.5);
    autoText500.setShadow(0, 0, '#e8b075', 2);

    autoBG500.inputEnabled = true;
    autoBG500.events.onInputOver.add(function () {
        autoBG500.alpha = 1;
    });
    autoBG500.events.onInputOut.add(function () {
        autoBG500.alpha = 0;
    });
    autoBG500.events.onInputDown.add(function () {
        console.log('i am autoBG500');
    });

}
