function arrayToMat(squares) {
	let mat = []
	let k = 0;
	for (let i = 0; i < 3; i++) {
		mat[i] = [];
		for (let j = 0; j < 3; j++) mat[i][j] = squares[k++];
	}
	return mat;
}

function hasMovesLeft(mat) {
	// If it has an empty space, keep playing
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (mat[i][j] === null) return true;
		}
	}
	return false;
}

function evaluate(mat, depth) {

	// Check every row
	for (let i = 0; i < 3; i++) {
		if (mat[i][0] === mat[i][1] && mat[i][0] === mat[i][2] && mat[i][1] === mat[i][2]) {
			if (mat[i][0] === 'X') return 100 - depth;
			if (mat[i][0] === 'O') return depth - 100;
		}
	}

	// Check every col
	for (let j = 0; j < 3; j++) {
		if (mat[0][j] === mat[1][j] && mat[0][j] === mat[2][j] && mat[1][j] === mat[2][j]) {
			if (mat[0][j] === 'X') return 100 - depth;
			if (mat[0][j] === 'O') return depth - 100;
		}
	}

	// Check the diagonals
	if (mat[0][0] === mat[1][1] && mat[0][0] === mat[2][2] && mat[1][1] === mat[2][2]) {
		if (mat[0][0] === 'X') return 100 - depth;
		if (mat[0][0] === 'O') return depth - 100;
	}
	
	if (mat[0][2] === mat[1][1] && mat[0][2] === mat[2][0] && mat[1][1] === mat[2][0]) {
		if (mat[0][2] === 'X') return 100 - depth;
		if (mat[0][2] === 'O') return depth - 100;
	}
	
	// If the game hasn't finished yet
	return 0;
}

function minmax(mat, depth, get_max) {
	if (hasMovesLeft(mat) === false) {
		return evaluate(mat, depth);
	}
	
	let val = evaluate(mat, depth);
	
	if (val !== 0) return val;
	
	if (get_max) {
		let best = -Infinity;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (mat[i][j] === null) {
					mat[i][j] = 'X';
					best = Math.max(best, minmax(mat, depth+1, !get_max));
					mat[i][j] = null;
				}
			}
		}
		return best;
	}
	else {
		let best = Infinity;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (mat[i][j] === null) {
					mat[i][j] = 'O';
					best = Math.min(best, minmax(mat, depth+1, !get_max));
					mat[i][j] = null;
				}
			}
		}
		return best;
	}

}

export function find_best_move(squares, difficulty) {
	let mat = arrayToMat(squares);
	let val, row = -1, col = -1, best = -Infinity;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (mat[i][j] === null) {
				if(difficulty === 'easy') {
					mat[i][j] = 'O';
				} 
				// else if(difficulty === 'hard') {
				// 	mat[i][j] = 'o';
				// } 
				else if(difficulty === 'expert') {
					mat[i][j] = 'X';
				}
				val = minmax(mat, 0, false);
				mat[i][j] = null;
				if (val > best) {
					best = val;
					row = i;
					col = j;
				}
			}
		}
	}
	return (3 * row) + col;
}