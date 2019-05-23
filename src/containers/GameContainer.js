import React, {Component} from 'react';
import * as utils from '../utils/utils.js';

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
        utils.getData().then((data) => {
            let info = JSON.parse(data);
            this.setState({
                info : info
            });
            this.startNextRound();
        })
    }

    startNextRound() {
        let teams = utils.getTeams(this.state.info);
        this.setState({
            info: teams
        })
        let matchArr = utils.pairElements(teams);
        this.playing = true;
        window.setTimeout(() => {
            this.setState({
                matchArr : matchArr,
                round : this.state.round + 1
            });
            this.decideWinner();
        }, 2000)
    }

    decideWinner = () => {
        var promiseArray =[], winner;
        var matchArr = [...this.state.matchArr];
        var tempArr = [...this.state.matchArr];
        for (var i = 0; i< this.state.matchArr.length; i++) {
            if (matchArr[i].element1[0] === "dummy" ) {
                winner = 1;
            } else if (matchArr[i].element2[0] === "dummy") {
                winner = 0;
            } else {
                winner = utils.matchWinnerPromise(i);
                winner.then((data) => {
                    var elem = this.state.matchArr[data.i];
                    elem.winner = data.randomIndex === 1 ? 2 : 1
                    
                    tempArr[data.i] =  elem;
                    this.setState({
                        matchArr : tempArr
                    });
                });
            }
            promiseArray.push(winner);
        }

        Promise.all(promiseArray).then((data) => {
            console.log(data);
            var newPlayersArray = [];
            for(var i = 0; i < matchArr.length ; i++) {
                var comp = data[i].i ? data[i].i : data[i];
                if (comp === 0) {
                    newPlayersArray.push(matchArr[i].element1[0]);
                } else {
                    newPlayersArray.push(matchArr[i].element2[0]);
                }
            }
            this.playing = false;
                this.setState({
                    info : newPlayersArray
                })
                
                if (this.state.info.length !== 1) {
                    this.startNextRound();
                }            
        });
    }

    renderTeamPlayers = () => {
        // If currently no match is going then render all current players
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

    getWinner = (match) => {
        // if there is winner then return hin
        if (match.winner) {
            if (match.winner === 2) {
                return match.element2[0].simpleName ? match.element2[0].simpleName : "dummyBye";
            } else {
                return match.element1[0].simpleName ? match.element1[0].simpleName : "dummyBye";
            }
        }
        
    }

    getOpponents = (match) => {
        // if watch is going on and no one has won then return opponents
        var firstTeam = match.element1[0].simpleName ? match.element1[0].simpleName : "dummyBye";
        var secondTeam = match.element2[0].simpleName ? match.element2[0].simpleName : "dummyBye";
        return firstTeam + " Vs " + secondTeam;;
    }


    renderMatch = () => {
        // if match is going then render match
        let style = {
            width: '200px',
            margin: '10px 5px 10px 5px'
        };
        return this.state.matchArr ? this.state.matchArr.map((match, key) => <div
            key={key}
            style={style}>
            {match.winner ? this.getWinner(match): this.getOpponents(match)}
        </div>) : null
    }

    render() {
        return (
            <div>
                {this.state.round ? <h1> Round {this.state.round}</h1> : <h1> Teams Lineup</h1>}
                {!this.playing ? this.renderTeamPlayers() : this.renderMatch()}
            </div>
        ) ;
        
    }
}

export default GameContainer;