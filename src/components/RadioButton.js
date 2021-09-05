import React from 'react';

const RadioButton = props => {
    return (
        <div className="radio-button">
            <label className="radio-container">
                {props.label}
                <input
                    value={props.value}
                    type="radio"
                    name={props.name}
                    onChange={props.onChange}
                    checked={props.checked} />
                <span className="checkmark"></span>
            </label>
        </div>
    );
}

export default RadioButton;
