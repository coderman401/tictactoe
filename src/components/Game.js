import React from 'react';
import swalll from 'sweetalert';
import swal from '@sweetalert/with-react'
import Board from './Board';
import { find_best_move } from '../logic/AI';
import { calculateWinner } from '../logic/Win';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			stepNumber: 0,
			moveCount: 0,
			xIsNextTwoPlayer: true,
			xIsNextVsAI: false,
			player: 'single',
			difficulty: 'expert',
			keep_play: true
		};
		this.onPlayerChange = this.onPlayerChange.bind(this);
		this.onDifficultyChange = this.onDifficultyChange.bind(this);
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winnerdata = calculateWinner(squares);
		if (winnerdata|| squares[i]) {
			return;
		}
		if(this.state.player === 'two') {
			squares[i] = this.state.xIsNextTwoPlayer ? "X" : "O";
			this.setState({
				history: history.concat([
					{
						squares: squares
					}
				]),
				stepNumber: history.length,
				xIsNextTwoPlayer: !this.state.xIsNextTwoPlayer
			});
		}
		if (this.state.player === 'single') {
			if (winnerdata) {
				return;
			} else {
				squares[i] = 'O';
				let difficulty = this.state.difficulty;
				let ai_index = find_best_move(squares, difficulty);
				if (ai_index !== -4) squares[ai_index] = 'X';
				this.setState({
					history: history.concat([
						{
							squares: squares
						}
					]),
					stepNumber: history.length
				});
			}
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNextTwoPlayer: (step % 2) === 0,
		});
	}
	restartGame(x_wins, o_wins, draw, turn = null, player = null) {
		if(player === 'single') {
			this.setState({
				history: [
					{
						squares: Array(9).fill(null)
					}
				],
				stepNumber: 0,
				moveCount: 0,
				xIsNextTwoPlayer: turn,
				x_wins_single: x_wins,
				o_wins_single: o_wins,
				draw_single: draw,
			});
		} else {
			this.setState({
				history: [
					{
						squares: Array(9).fill(null)
					}
				],
				stepNumber: 0,
				moveCount: 0,
				xIsNextTwoPlayer: turn,
				x_wins_two: x_wins,
				o_wins_two: o_wins,
				draw_two: draw,
			});
		}
	}
	onPlayerChange(e) {
		this.setState({
			player : e.currentTarget.value
		});
		if(e.currentTarget.value === 'single') {
			this.restartGame(this.state.x_wins_two, this.state.o_wins_two, this.state.draw_two);
		} else {
			this.restartGame(this.state.x_wins_single, this.state.o_wins_single, this.state.draw_single, true, 'single');
		}
	}
	onDifficultyChange(e) {
		this.setState({
			difficulty : e.currentTarget.value
		});
		this.restartGame(this.state.x_wins_single, this.state.o_wins_single, this.state.draw_single, true, 'single');
	}
	showStats() {
		swal({
			title: "Game Statitics",
			buttons:  "OK",
			content: (
				<div className="stats-tabel">
					<table className="table table-bordered">
						<thead>
							<tr>
								<th></th>
								<th>X-Wins</th>
								<th>O-Wins</th>
								<th>Draw</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Single Player</td>
								<td>{this.state.x_wins_single ? this.state.x_wins_single : 0}</td>
								<td>{this.state.o_wins_single ? this.state.o_wins_single : 0}</td>
								<td>{this.state.draw_single ? this.state.draw_single : 0}</td>
							</tr>
							<tr>
								<td>Two Player</td>
								<td>{this.state.x_wins_two ? this.state.x_wins_two : 0}</td>
								<td>{this.state.o_wins_two ? this.state.o_wins_two : 0}</td>
								<td>{this.state.draw_two ? this.state.draw_two : 0}</td>
							</tr>
						</tbody>
					</table>
				</div> 
			)
		});
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares;
		const winnerdata = calculateWinner(squares);
		
		let player_turn, winner_player;
		let x_wins_single = this.state.x_wins_single ? this.state.x_wins_single : 0;
		let o_wins_single = this.state.o_wins_single ? this.state.o_wins_single : 0;
		let draw_single = this.state.draw_single ? this.state.draw_single : 0;
		let x_wins_two = this.state.x_wins_two ? this.state.x_wins_two : 0;
		let o_wins_two = this.state.o_wins_two ? this.state.o_wins_two : 0;
		let draw_two = this.state.draw_two ? this.state.draw_two : 0;
		let turn;
		let draw_line = [];

		if(this.state.player === 'single') {
			if (winnerdata) {
				winner_player = winnerdata.winner.toUpperCase();
				if(winner_player === 'X') {
					winner_player = 'Kishan';
					x_wins_single += 1;
				} else {
					winner_player = 'You';
					o_wins_single += 1;
				}
				swalll({title : winner_player + ' Won'}).then(() =>{
					setTimeout(() => {
						this.restartGame(x_wins_single, o_wins_single, draw_single, turn, this.state.player);
					}, 1000);
				});
			} else if(!current.squares.includes(null)) {
				draw_line = [0,1,2,3,4,5,6,7,8,9];
				draw_single += 1;
				swalll({title :'Game Draw !!!'}).then(() =>{
					setTimeout(() => {
						this.restartGame(x_wins_single, o_wins_single, draw_single, this.state.xIsNextTwoPlayer, this.state.player);
					}, 1000);
				});
			}
		} else {
			if(winnerdata) {
				winner_player = winnerdata.winner.toUpperCase();
				if(winner_player === 'X') {
					x_wins_two += 1;
					turn = true;
				}
				if(winner_player === 'O') {
					o_wins_two += 1;
					turn = false;
				}
				swalll({title : winner_player + ' Won'}).then(() =>{
					setTimeout(() => {
						this.restartGame(x_wins_two, o_wins_two, draw_two, turn, this.state.player);
					}, 1000);
				});
			} else if(!current.squares.includes(null)) {
				draw_line = [0,1,2,3,4,5,6,7,8,9];
				draw_two += 1;
				swalll({title :'Game Draw !!!'}).then(() =>{
					setTimeout(() => {
						this.restartGame(x_wins_two, o_wins_two, draw_two, this.state.xIsNextTwoPlayer);
					}, 1000);
				});
			} else {
				player_turn = <img alt="player" src={`image/${ this.state.xIsNextTwoPlayer ? "x.png" : "o.png"}`} width="18"/>
			}

		}
		return (
			<div className="game">
				<div className="game-info">
					<p className="title"><span>Tic Tac Toe</span>&nbsp;&nbsp;&nbsp;(Versoin : 6.24)</p>
				<a href="https://www.instagram.com/frustrated_developer/"><h4 className="developedby">Developed By : frustrated_developer</h4></a>
					<div className="select_player">
						<label className="container">Single Player
							<input value="single" type="radio" name="radio" onChange={this.onPlayerChange} checked={this.state.player === 'single'}/>
							<span className="checkmark"></span>
						</label>
						<label className="container">Two Player
							<input value="two" type="radio" name="radio" onChange={this.onPlayerChange} checked={this.state.player === 'two'} />
							<span className="checkmark"></span>
						</label>
					</div>
					{ this.state.player === 'single' ?
						<div className="select_difficulty">
							<label className="container">Easy
								<input value="easy" type="radio" name="radio1" onChange={this.onDifficultyChange} checked={this.state.difficulty === 'easy'}/>
								<span className="checkmark"></span>
							</label>
							{/* <label className="container">Hard
								<input value="hard" type="radio" name="radio1" onChange={this.onDifficultyChange} checked={this.state.difficulty === 'hard'}/>
								<span className="checkmark"></span>
							</label> */}
							<label className="container">Expert
								<input value="expert" type="radio" name="radio1" onChange={this.onDifficultyChange} checked={this.state.difficulty === 'expert'} />
								<span className="checkmark"></span>
							</label>
						</div>
						: ''
					}
					{ this.state.player === 'two' ?  
						<div className="single_info">
							<label>Turn : {player_turn} - Player </label>
						</div> 
						: '' 
					}
					{ this.state.player === 'single' ? 
						<div className="single_info">
							<label>You : <img src="image/o.png" width="18" alt="O"/></label>
							<label>Computer: <img src="image/x.png" width="18" alt="X"/></label>
							
						</div>
						: ''
					}
				</div>
				<Board
					activeSquares={winnerdata ? winnerdata.line : draw_line ? draw_line : []}
					squares={current.squares}
					onClick={i => this.handleClick(i)}
				/>
				<div className="game-stats">
					<p className="stats"><img src="image/x.png" width="15" alt="X"/> - Wins : <br></br><span>{this.state.player === 'single' ? x_wins_single : x_wins_two}</span></p>
					<p className="stats"><img src="image/o.png" width="15" alt="O"/> - Wins : <br></br><span>{this.state.player === 'single' ? o_wins_single : o_wins_two}</span></p>
					<p className="stats">Draw : <br></br><span>{this.state.player === 'single' ? draw_single : draw_two}</span></p>
					<p className="stats" onClick={()=> this.showStats()}><b>View<br/>Stats</b></p>
				</div>
				{/* <p onClick={()=> this.showStats()}>All Stats</p> */}
			</div>
		);
	}
}
export default Game;