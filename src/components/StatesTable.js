import React from 'react';

const StateTable = props => {
    return (
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
                    <td>{props.xSingleWins}</td>
                    <td>{props.oSingleWins}</td>
                    <td>{props.drawSingle}</td>
                </tr>
                <tr>
                    <td>Two Player</td>
                    <td>{props.xTwoWins}</td>
                    <td>{props.oTwoWins}</td>
                    <td>{props.drawTwo}</td>
                </tr>
            </tbody>
        </table>
    );
}

export default StateTable;
