import React from 'react';
class Square extends React.Component {
	// constructor(props) {
	// 	super(props)
	// }
	render() {
		return (
			<button
				/* className={`square ${this.props.isActive ? 'activeWin '+ this.props.value : '' + this.props.value}`} */
				className={`square ${this.props.value}`}
				onClick={this.props.onClick}
			>
				{this.props.value}
			</button>
		);
	}
}

export default Square;