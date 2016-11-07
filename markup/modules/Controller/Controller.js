export let controller = (function () {
    let touch = {
        _isEvent: false,
        mobile: {
            menu: {
                open: function () {},
                close: function () {}
            }
        }
    };

    return {
        touch
    };
})();
