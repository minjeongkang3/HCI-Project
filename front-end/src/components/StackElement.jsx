import React, { Component } from 'react';

export default class StackElement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div onClick={(e) => { this.props.onclick_handler(this.props.data) }}  className={`stack_element ${this.props.current > 0 ? 'current' + this.props.current : ""}`}>
                <h4>{ this.props.data.name }</h4>
            </div>
        )
    }
    
}