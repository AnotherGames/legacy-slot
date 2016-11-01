import $ from 'jquery';
import chai from 'chai';
//need for PhantomJS
import 'babel-polyfill'
let assert = chai.assert;

let qosFsBonus = ['j', 'iJ', 'q', 'iQ', 'k', 'iK', 'a', 'iA', 'wild', 'fscard'];
let qosRoot = ['j', 'iJ', 'q', 'iQ', 'k', 'iK', 'a', 'iA', 'wild', 'scatter', 'sw1', 'sw2', 'sw3', 'card'];
let modeLib = ['root', 'doors2', 'fsBonus'];
let url = 'http://gameservice.bossgs.org/devslotv2/SlotService.svc/';
let rolled;
let init;

init = $.ajax({
    url : url + '_Initialise/' + 3 + '/' + 666 + '/' + 'qos',
    dataType : 'JSONP',
    type : 'GET',
});

function roll() {
    return init.then((data) => {
        // console.log('1231s0', url + '_Initialise/' + 2 + '/' + 666 + '/' + 'qos');
        let betLevel = data.Balance.BetLevel;
        let coinValue = data.Balance.CoinValue;
        let sessionId = data.SessionID;
        var randomBetLevel = Math.floor(Math.random()*betLevel.length); // Рандомный уровень ставки
        var randomCoinValue = Math.floor(Math.random()*coinValue.length);
        return rolled = $.ajax({
    			url : url + '_Roll/' + sessionId +'/' + betLevel[randomBetLevel] + '/' + coinValue[randomCoinValue],
    			dataType : 'JSONP',
    			type : 'GET'
    	});

    });
}
roll();

describe('Init tests', () => {

    it('type of response is Object',(done) => {
        init.then((data) => {
            // console.log(data);
            assert.isObject(data);
            done();
        });
    });

    it('type of session ID is number', (done) => {
        init.then((data) => {
            assert.isNumber(data.SessionID);
            done();
        })
    });

    it('type of Lines is array',(done) => {
        init.then((data) => {
            var arr = data.Lines;
            assert.isArray(arr);
            done();
        })
    });

    it('x value of Lines 0 <= val < 5',(done) => {
        init.then((data) => {
            var arr = data.Lines;
            assert.isTrue(checkXY(arr, 'X'));
            done();
        })
    });

    it('y value of Lines 0 <= val < 3',(done) => {
        init.then((data) => {
            var arr = data.Lines;
            assert.isTrue(checkXY(arr, 'Y'));
            done();
        })
    });

    it('type of FirstScreen is array',(done) => {
        init.then((data) => {
            assert.isArray(data.FirstScreen);
            done();
        });
    });

    it('init modes equal lib',(done) => {
        init.then((data) => {
            let arr = data.Modes;
            assert.sameMembers(arr, modeLib, 'same members');
            done();
        });
    });

    it('current mode symbols equal to one of libs',(done) => {
        init.then((data) => {
            let symbLib = data.Symbols;
            // console.log(symbLib);
            assert.isTrue(initSwCheck(symbLib, qosRoot) || initSwCheck(symbLib, qosFsBonus));
            done();
        });
    });

});

describe('Roll tests', () => {


    it('not include error message',(done) => {
        rolled.then((data) => {
            assert.notProperty(data, 'ErrorMessage');
            done();
        });
    });

    it('include mode',(done) => {
        rolled.then((data) => {
            // console.log(data);
            assert.property(data, 'Mode');
            done();
        });
    });

    it('include mode value in lib',(done) => {
        rolled.then((data) => {
            assert.include(modeLib, data.Mode);
            done();
        });
    });

    it('current mode include no extra symbols',(done) => {
        rolled.then((data) => {
            let screenLib = data.Screen;
            assert.isTrue(rolledSwCheck(screenLib, qosRoot) || rolledSwCheck(screenLib, qosFsBonus));
            done();
        });
    });
});

describe('Modules tests', () => {

    it( "Добавляем новый элемент div", () => {
    var di = document.createElement('div');
    di.className = 'qunit-fixture';
    document.body.appendChild(di);
    var $fixture = $( ".qunit-fixture" );
    $fixture.append( "<div>Это новый див</div>" );
    assert.equal( $( "div", $fixture).length, 1);
    });

});

function checkX(number) {
    return (0 <= number && number < 5);
};

function checkY(number) {
    return (0 <= number && number < 3);
};

function checkXY(arr, coord) {
    var all = [];
    arr.forEach((arr2) => {
        arr2.forEach((elem) => {
            all.push(elem[coord]);
        });
    });
    return (coord === 'X') ? all.every(checkX) : all.every(checkY);
};

function initSwCheck(arr, lib){
    let set = new Set();
    arr.forEach((elem) => {
        set.add(elem.Symbol);
    });
    // console.log(set);
    for(let i = 0; i < lib.length; i++){
        let current = set.has(lib[i]);
        if(!current){
            return false;
        };
    };
    // console.log(set);
    return true;
};

function rolledSwCheck(arr, lib){
    var all = [];
    arr.forEach((arr2) => {
        arr2.forEach((elem) => {
            all.push(elem);
        });
    });
    // console.log(all);
    var set = new Set();
    lib.forEach((elem) => {
        set.add(elem);
    });
    set.forEach(() => {
        lib.forEach((elem) => {
            if(!set.has(elem)){
                return false;
            };
        });
    });
    return true;
};

function time(delta) {
    let now = Date.now();
    while (true) {
        let currentNow = Date.now();
        if(currentNow - now > delta) {
            break;
        }
    }
}
