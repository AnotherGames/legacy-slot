let _checkAttr = function (param, attr, check, msg) {
    if (Array.isArray(attr)) {
        if (!attr.some(function (item) {
            return check(param, item);
        }) ) {
            console.error(msg);
            return false;
        }
    } else
    if (!check(param, attr)) {
        console.error(msg);
        return false;
    }
    return true;
};

export let checkParam = function (param, check, errorMsg) {
    if (typeof param !== 'object') {
        console.error('CheckParam: param is undefined.', errorMsg, param);
        return false;
    }
    for (let paramKey in check) {
        if (!param[paramKey]) {
            console.error('CheckParam: '+paramKey+' is undefined.', errorMsg, param);
            return false;
        }
        for (let attrKey in check[paramKey]) {
            let isCheck;
            switch (attrKey) {
                case 'class':
                    isCheck = _checkAttr(param[paramKey], check[paramKey].class, (_instance, _class) => {
                        if (_instance instanceof _class) return true;
                        else return false;
                    }, { error: 'CheckParam: ('+paramKey+') class is incorrect.', msg: errorMsg, param});
                    if (!isCheck) return false;
                    break;
                case 'type':
                    isCheck = _checkAttr(param[paramKey], check[paramKey].type, (_param, _check) => {
                        if (typeof(_param) === _check.toLowerCase()) return true;
                        else return false;
                    }, { error: 'CheckParam: ('+paramKey+') type is incorrect.', msg: errorMsg, param});
                    if (!isCheck) return false;
                    break;
                case 'attr':
                    for (let attrObjKey in check[paramKey].attr) {
                        if (!param[paramKey][attrObjKey]) {
                            console.error('CheckParam: attribute ('+attrObjKey+') in ('+paramKey+') is undefined.', errorMsg, param);
                            return false;
                        }
                        isCheck = _checkAttr(param[paramKey][attrObjKey], check[paramKey].attr[attrObjKey], (_param, _check) => {
                            if (_param === _check) return true;
                            else return false;
                        }, { error: 'CheckParam: attribute ('+attrObjKey+') in ('+paramKey+') is incorrect.', msg: errorMsg, param});
                        if (!isCheck) return false;
                    }
                    break;
            }
        }
    }
    return true;
}
