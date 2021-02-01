import React from 'react';
import swalll from 'sweetalert';
import swal from '@sweetalert/with-react'
import Board from './components/Board';
import RadioButton from './components/RadioButton';
import findBestMove from './logic/AI';
import calculateWinner from './logic/Win';
import StateTable from './components/StatesTable';
import GameState from './components/GameStates';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNextTwoPlayer: true,
            xIsNextVsAI: false,
            player: 'single',
            difficulty: 'expert',
            x_wins_single: 0,
            x_wins_two: 0,
            draw_single: 0,
            o_wins_single: 0,
            o_wins_two: 0,
            draw_two: 0,
        };

        this.onPlayerChange = this.onPlayerChange.bind(this);
        this.onDifficultyChange = this.onDifficultyChange.bind(this);
    }
 

    handleClick(i) {
        const {squares} = this.state;
        const winnerdata = calculateWinner(squares);
        if (winnerdata|| squares[i]) {
            return;
        }

        if (this.state.player === 'two') {
            squares[i] = this.state.xIsNextTwoPlayer ? "X" : "O";
            this.setState({
                squares,
                xIsNextTwoPlayer: !this.state.xIsNextTwoPlayer
            });
        }

        if (this.state.player === 'single') {
            if (winnerdata) {
                return;
            } else {
                squares[i] = 'O';
                let difficulty = this.state.difficulty;
                let ai_index = findBestMove(squares, difficulty);
                if (ai_index !== -4) squares[ai_index] = 'X';
                this.setState({
                    squares,
                });
            }
        }
    }

    restartGame(x_wins, o_wins, draw, turn = null, player = null) {
        if (player === 'single') {
            this.setState({
                squares: Array(9).fill(null),
                xIsNextTwoPlayer: turn,
                x_wins_single: x_wins,
                o_wins_single: o_wins,
                draw_single: draw,
            });
        } else {
            this.setState({
                squares: Array(9).fill(null),
                xIsNextTwoPlayer: turn,
                x_wins_two: x_wins,
                o_wins_two: o_wins,
                draw_two: draw,
            });
        }
    }

    onPlayerChange(e) {
        const {x_wins_single, o_wins_single, draw_single, x_wins_two, o_wins_two, draw_two} = this.state;
        this.setState({
            player : e.currentTarget.value
        });
        if (e.currentTarget.value === 'single') {
            this.restartGame(x_wins_two, o_wins_two, draw_two);
        } else {
            this.restartGame(x_wins_single, o_wins_single, draw_single, true, 'single');
        }
    }
    
    onDifficultyChange(e) {
        const {x_wins_two, o_wins_two, draw_two} = this.state;
        this.setState({
            difficulty : e.currentTarget.value
        });
        this.restartGame(x_wins_two, o_wins_two, draw_two);
    }

    showStats() {
        const {x_wins_single, o_wins_single, draw_single, x_wins_two, o_wins_two, draw_two} = this.state;
        swal({
            title: "Game Statitics",
            buttons:  "OK",
            content: (
                <div className="stats-tabel">
                    <StateTable
                        xSingleWins={x_wins_single}
                        oSingleWins={o_wins_single}
                        drawSingle={draw_single}
                        xTwoWins={x_wins_two}
                        oTwoWins={o_wins_two}
                        drawTwo={draw_two}
                    />
                </div>
            )
        });
    };

    renderPlayers = () => {
        const {player} = this.state;
        const playersComponent = (
            <div className="select_player">
                <RadioButton
                    value="single"
                    label="Single Player"
                    name="radio"
                    onChange={this.onPlayerChange}
                    checked={player === 'single'}
                />
                <RadioButton
                    value="two"
                    label="Two Player"
                    name="radio"
                    onChange={this.onPlayerChange}
                    checked={player === 'two'}
                />
            </div>
        );
        return playersComponent
    }

    renderDifficulty = () => {
        const {player, difficulty} = this.state;
        if (player === 'single') {
            const difficultyComponent = (
                <div className="select_difficulty">
                    <RadioButton 
                        value="easy"
                        label="Easy"
                        name="radio1"
                        onChange={this.onDifficultyChange}
                        checked={difficulty === 'easy'}
                    />
                    <RadioButton 
                        value="hard"
                        label="Hard"
                        name="radio1"
                        onChange={this.onDifficultyChange}
                        checked={difficulty === 'hard'}
                    />
                    <RadioButton 
                        value="expert"
                        label="Expert"
                        name="radio1"
                        onChange={this.onDifficultyChange}
                        checked={difficulty === 'expert'}
                    />
                </div>
            );
            return difficultyComponent;
        }
    }

    renderPlayerTurnInfo = () => {
        const { player, xIsNextTwoPlayer } = this.state;
        let turnInfoComponent;
        const playerTurn = <img alt="player" src={`image/${ xIsNextTwoPlayer ? "x.png" : "o.png"}`} width="18"/>
        if (player === 'two') {
            turnInfoComponent = (
                <div className="single_info">
                    <label>Turn : {playerTurn} - Player </label>
                </div> 
            );
        } 
        if (player === 'single') {
            turnInfoComponent = (
                <div className="single_info">
                    <label>You : <img src="image/o.png" width="18" alt="O"/></label>
                    <label>Computer: <img src="image/x.png" width="18" alt="X"/></label>
                </div>
            );
        }
        return turnInfoComponent;
    }
    checkForWinner = () => {
        const { squares, player, xIsNextTwoPlayer } = this.state;
        let { x_wins_single, o_wins_single, draw_single, x_wins_two, o_wins_two, draw_two} = this.state;
        const winnerdata = calculateWinner(squares);
        let winner_player, turn;

        if (player === 'single') {
            if (winnerdata) {
                winner_player = winnerdata.winner.toUpperCase();
                if (winner_player === 'X') {
                    winner_player = 'AI';
                    x_wins_single += 1;
                } else {
                    winner_player = 'You';
                    o_wins_single += 1;
                }
                swalll({title : winner_player + ' Won'}).then(() =>{
                    setTimeout(() => {
                        this.restartGame(x_wins_single, o_wins_single, draw_single, turn, player);
                    }, 1000);
                });
            } else if (!squares.includes(null)) {
                draw_single += 1;
                swalll({title :'Game Draw !!!'}).then(() =>{
                    setTimeout(() => {
                        this.restartGame(x_wins_single, o_wins_single, draw_single, xIsNextTwoPlayer, player);
                    }, 1000);
                });
            }
        } else {
            if (winnerdata) {
                winner_player = winnerdata.winner.toUpperCase();
                if (winner_player === 'X') {
                    x_wins_two += 1;
                    turn = true;
                }
                if (winner_player === 'O') {
                    o_wins_two += 1;
                    turn = false;
                }
                swalll({title : winner_player + ' Won'}).then(() =>{
                    setTimeout(() => {
                        this.restartGame(x_wins_two, o_wins_two, draw_two, turn, player);
                    }, 1000);
                });
            } else if (!squares.includes(null)) {
                draw_two += 1;
                swalll({title :'Game Draw !!!'}).then(() =>{
                    setTimeout(() => {
                        this.restartGame(x_wins_two, o_wins_two, draw_two, xIsNextTwoPlayer);
                    }, 1000);
                });
            }
        }
    }

    render() {
        const { squares, player } = this.state;
        let { x_wins_single, o_wins_single, draw_single, x_wins_two, o_wins_two, draw_two} = this.state;
        this.checkForWinner();

        return (
            <div className="game-wrapper">
                <div className="game-info">
                    <h2 className="title">Tic Tac Toe<span className="version">(Versoin : 2.24)</span></h2>
                    { this.renderPlayers() }
                    { this.renderDifficulty() }
                    { this.renderPlayerTurnInfo() }
                </div>
                <div className="board-wrapper">
                    <Board
                        squares={squares}
                        onClick={i => this.handleClick(i)}
                    />
                    <GameState
                        xWins={player === 'single' ? x_wins_single : x_wins_two}
                        oWins={player === 'single' ? o_wins_single : o_wins_two}
                        draw={player === 'single' ? draw_single : draw_two}
                        onClickElement={()=> this.showStats()} />
                </div>
                <h5 className="developedby">Developed By : coderman_401</h5>
                <a className="link" target="blank" href="https://coderman-401.web.app/demos">Visit here for more.</a>
            </div>
        );
    }
}

export default Game;
