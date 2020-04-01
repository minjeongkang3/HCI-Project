import React, { Component } from 'react';

export default class StackElement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={`stack_element ${this.props.current > 0 ? 'current' + this.props.current : ""}`}>
                <h4>{ this.props.data }</h4>
            </div>
        )
    }
    
}