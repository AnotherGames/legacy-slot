import { model } from '../../modules/Model/Model';

export function drawAutoMenu(container, game) {
    const autoContainer = game.add.group();
    container.add(autoContainer);

    const autoplay = game.add.text(
        container.width / 2,
        game.world.height * 0.07,
        'AUTOPLAY',
        {font: 'bold 40px Arial', fill: '#fff', align: 'center'},
        autoContainer);
    autoplay.anchor.set(0.5);
    autoplay.setShadow(0, 0, '#fff', 4);

    const autoBG10 = game.add.sprite(
        0,
        game.world.height * 0.25,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG10.anchor.set(0.5);

    let deltaX = (container.width - autoBG10.width * 2.5) / 3;
    autoBG10.x = deltaX + autoBG10.width / 2;

    const autoText10 = game.add.text(
        autoBG10.x,
        autoBG10.y,
        '10',
        {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText10.anchor.set(0.5);
    autoText10.setShadow(0, 0, '#90fd5a', 6);

    autoBG10.inputEnabled = true;
    autoBG10.input.priorityID = 2;
    autoBG10.events.onInputDown.add(function () {
        console.log('i am autoBG10');
    });

    const autoBG25 = game.add.sprite(
        2 * deltaX + 1.5 * autoBG10.width,
        game.world.height * 0.25,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG25.anchor.set(0.5);

    const autoText25 = game.add.text(
        autoBG25.x,
        autoBG25.y,
        '25',
        {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText25.anchor.set(0.5);
    autoText25.setShadow(0, 0, '#90fd5a', 6);

    autoBG25.inputEnabled = true;
    autoBG25.input.priorityID = 2;
    autoBG25.events.onInputDown.add(function () {
        console.log('i am autoBG25');
    });

    const autoBG50 = game.add.sprite(
        autoBG10.x,
        game.world.height * 0.47,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG50.anchor.set(0.5);

    const autoText50 = game.add.text(
        autoBG50.x,
        autoBG50.y,
        '50',
        {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText50.anchor.set(0.5);
    autoText50.setShadow(0, 0, '#90fd5a', 6);

    autoBG50.inputEnabled = true;
    autoBG50.input.priorityID = 2;
    autoBG50.events.onInputDown.add(function () {
        console.log('i am autoBG50');
    });

    const autoBG100 = game.add.sprite(
        autoBG25.x,
        game.world.height * 0.47,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG100.anchor.set(0.5);

    const autoText100 = game.add.text(
        autoBG100.x,
        autoBG100.y,
        '100',
        {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText100.anchor.set(0.5);
    autoText100.setShadow(0, 0, '#90fd5a', 6);

    autoBG100.inputEnabled = true;
    autoBG100.input.priorityID = 2;
    autoBG100.events.onInputDown.add(function () {
        console.log('i am autoBG100');
    });

    const autoBG250 = game.add.sprite(
        autoBG10.x,
        game.world.height * 0.7,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG250.anchor.set(0.5);

    const autoText250 = game.add.text(
        autoBG250.x,
        autoBG250.y,
        '250',
        {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText250.anchor.set(0.5);
    autoText250.setShadow(0, 0, '#90fd5a', 6);

    autoBG250.inputEnabled = true;
    autoBG250.input.priorityID = 2;
    autoBG250.events.onInputDown.add(function () {
        console.log('i am autoBG250');
    });

    const autoBG500 = game.add.sprite(
        autoBG25.x,
        game.world.height * 0.7,
        'menuButtons',
        'empty.png',
        autoContainer);
    autoBG500.anchor.set(0.5);

    const autoText500 = game.add.text(
        autoBG500.x,
        autoBG500.y,
        '500',
        {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'},
        autoContainer);
    autoText500.anchor.set(0.5);
    autoText500.setShadow(0, 0, '#90fd5a', 6);

    autoBG500.inputEnabled = true;
    autoBG500.input.priorityID = 2;
    autoBG500.events.onInputDown.add(function () {
        console.log('i am autoBG500');
    });

}
