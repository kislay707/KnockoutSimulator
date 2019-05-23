
const powerOf2 = (v) => {
    return v && !(v & (v - 1));
}

exports.getTeams = (info) => {
    let total = info.length;

    let a = powerOf2(total);
    let number = Math.log2(total);
    let remaining;
    if (!a) {
        number = Math.trunc(number);
        let nextNum = Math.pow(2, number + 1);
        remaining = nextNum - total;
        //arr.fill("dummy", 0, remaining);
    }
    let arr = info;
    for (var i = 0; i < remaining ; i++) {
        arr.push("dummy");
    }
    return arr;
}

exports.getData = () => {
    var req = new XMLHttpRequest();
    const promise = new Promise((resolve, reject) => {
        req.open("GET", "https://raw.githubusercontent.com/bttmly/nba/master/data/teams.json");
        req.onload = () => {
            resolve(req.responseText);
        };
        req.onerror = () => {
            reject(new Error(
                req.responseText));
        };
        req.send();
    });
    return promise;
}

exports.pairElements = (teams) => {
    let copyArr = [...teams];
    let matchArr = [];
    while(copyArr.length > 0) {
        var randomIndex = Math.floor(Math.random()*copyArr.length);
        var randomItem = copyArr[randomIndex];
        var element1 = copyArr.splice(randomIndex, 1);

        var randomIndex2 = Math.floor(Math.random()*copyArr.length);
        var randomItem2 = copyArr[randomIndex2];
        var element2 = copyArr.splice(randomIndex2, 1);

        if (randomItem === "dummy" && randomItem2 === "dummy") {
            copyArr.push("dummy");
            copyArr.push("dummy");
            continue;
        }

        matchArr.push({element1, element2});
    }
    return matchArr;
}

exports.matchWinnerPromise = (i) => {
    return new Promise((resolve, reject) => {
        var randomDelay = Math.floor(Math.random() * 10000);
        window.setTimeout(() => {
            var randomIndex = Math.floor(Math.random()*2);
            
            resolve({randomIndex, i});
        }, 500 + randomDelay);
    });
}