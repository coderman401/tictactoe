import React from 'react';
import Square from './Square';

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				key={i}
				isActive={this.props.activeSquares.includes(i)}
				value={this.props.squares[i] ? this.props.squares[i] : ''}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}
	createBoard= () => {
		let board = [];
		let k = 0;
		// Outer loop to create parent
		for (let i = 0; i < 3; i++) {
			let children = []
			//Inner loop to create children
			for (let j = 0; j < 3; j++) {
				children.push(this.renderSquare(k));
				k++
			}
			//Create the parent and add the children
			board.push(
				<div key={i}
					className="board-row"
				>
					{children}
				</div>
			);
		}
		return board
	}
	render() {
		return (
			<div className="game-board">
				<div className="board">
					{this.createBoard()}
				</div>
			</div>
			/* <div className="game-board">
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div> */
		);
	}
}
export default Board;