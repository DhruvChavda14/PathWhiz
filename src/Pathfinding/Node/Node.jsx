import React, { Component } from "react";
import './Node.css'

export default class Node extends Component {
    render() {
        const {
            row, col, isFinish, isStart, isWall, onMouseDown, onMouseUp, onMouseEnter
        } = this.props;

        const extraClassName = isFinish
            ? 'node-finish'
            : isStart? 'node-start'
            : isWall? 'node-wall': '';

        const symbol = isStart ? '🚀' : isFinish ? '🏁' : '';
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
                title={isStart ? 'Start Node' : isFinish ? 'Finish Node' : ''}
                >
                <span className="symbol">{symbol}</span>
                </div>
        )
    }

}