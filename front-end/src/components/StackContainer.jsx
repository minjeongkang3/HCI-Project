import React, { Component } from 'react';
import StackElement from 'components/StackElement';
import 'assets/css/stack.scss';

export default class StackContainer extends Component {

    render() {
        const stack_visited_items = []
        for (const [index, value] of this.props.stack_data_visited.entries()) {
            stack_visited_items.push(
                <StackElement key={index} data={ value } current={ 0 }
                onclick_handler={ this.props.onclick_visited }
                />
            )
        }

        const stack_current_items = []
        for (const [index, value] of this.props.stack_data_current.entries()) {
            stack_current_items.push(
                <StackElement key={index} data={ value } 
                    current={ index + 1 }
                    onclick_handler={ this.props.onclick_current }
                    />
            )
        }

        var empty_stack;
        if (stack_current_items.length === 0 || stack_visited_items.length === 0) {
            empty_stack = <h4 className='note'>Stack is empty</h4>;
          } else {
            empty_stack = null;
          }
        return(
            <div className='container_wrapper stack_container'>
                { empty_stack }
                { stack_visited_items }
                <div className='stack_space'></div>
                { stack_current_items }
            </div>
        )
    }
    
}