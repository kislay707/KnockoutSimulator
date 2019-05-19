import React, {Component} from 'react';

class GameContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            round: 0
        }
        this.playing = false;
    }

    componentDidMount() {
        this.getData().then((data) => {
            let info = JSON.parse(data);
            this.setState({
                info : info
            });
            this.randomlyPair();
        })
    }

    powerOf2 = (v) => {
        return v && !(v & (v - 1));
    }

    randomlyPair = () => {
        let total = this.state.info.length;

        let a = this.powerOf2(total);
        let number = Math.log2(total);
        let remaining;
        //let arr = [];
        if (!a) {
            number = Math.trunc(number);
            let nextNum = Math.pow(2, number + 1);
            remaining = nextNum - total;
            //arr.fill("dummy", 0, remaining);
        }
        let arr = this.state.info;
        for (var i = 0; i < remaining ; i++) {
            arr.push("dummy");
        }
        this.setState({
            info: arr
        })
        this.pairElements();
    }

    pairElements = () => {
        //let copyArr = Object.assign({}, this.state.info);
        let copyArr = [...this.state.info];
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
        this.playing = true;
        window.setTimeout(() => {
            this.setState({
                matchArr : matchArr,
                round : this.state.round + 1
            });
            this.decideWinner();
        }, 2000)
        
    }

    matchWinnerPromise = () => {
        return new Promise((resolve, reject) => {

            window.setTimeout(() => {
                var randomIndex = Math.floor(Math.random()*2);
                resolve(randomIndex);
            }, 4000);
        });
    }

    decideWinner = () => {
        var promiseArray =[], winner;
        var matchArr = [...this.state.matchArr];
        for (var i = 0; i< this.state.matchArr.length; i++) {
            if (matchArr[i].element1[0] === "dummy" ) {
                winner = 1;
            } else if (matchArr[i].element2[0] === "dummy") {
                winner = 0;
            } else {
                winner = this.matchWinnerPromise();
            }
            promiseArray.push(winner);
        }

        Promise.all(promiseArray).then((data) => {
            console.log(data);
            var newPlayersArray = [];
            for(var i = 0; i < matchArr.length ; i++) {
                if (data[i] ===0) {
                    newPlayersArray.push(matchArr[i].element1[0]);
                } else {
                    newPlayersArray.push(matchArr[i].element2[0]);
                }
            }
            this.setState({
                info : newPlayersArray
            })
            this.playing = false;
            if (this.state.info.length !== 1) {
                this.randomlyPair();
            }

        });
    }

    getData = () => {
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

    renderTeamDivs = () => {
        let style = {
            width: '200px',
            margin: '10px 5px 0px 5px'
        };
        return this.state.info ? this.state.info.map((info, key) => <div
            key={key}
            style={style}>
            {info.simpleName ? info.simpleName : ""}
        </div>) : null
    }

    renderMatch = () => {
        let style = {
            width: '200px',
            margin: '10px 5px 0px 5px'
        };
        return this.state.matchArr ? this.state.matchArr.map((match, key) => <div
            key={key}
            style={style}>
            {match.element1[0].simpleName ? match.element1[0].simpleName : "dummyBye"} 
            Vs
            {match.element2[0].simpleName ? match.element2[0].simpleName : "dummyBye"} 
        </div>) : null
    }

    render() {
        return (
            <div>
                {this.state.round ? <h1> Round {this.state.round}</h1> : <h1> Teams Lineup</h1>}
                {!this.playing ? this.renderTeamDivs() : this.renderMatch()}
            </div>
        ) ;
        
    }
}

export default GameContainer;