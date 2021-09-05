import React from 'react';

const GameState = props => {
    return (
        <div className="game-stats">
            <p className="stats"><img src="image/x.png" width="15" alt="X" /> - Wins : <br></br><span>{props.xWins}</span></p>
            <p className="stats"><img src="image/o.png" width="15" alt="O" /> - Wins : <br></br><span>{props.oWins}</span></p>
            <p className="stats">Draw : <br></br><span>{props.draw}</span></p>
            <p className="stats" onClick={props.onClickElement}>View<br />Stats</p>
        </div>
    );
}

export default GameState;
