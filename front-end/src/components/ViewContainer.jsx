import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';

import 'assets/css/view.scss';

export default class ViewContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_range: [0, 20]
        }
        this.handle_time = this.handle_time.bind(this);
    }

    handle_time(event, new_range) {
        this.setState({
            time_range: new_range,
        })
    };

    render() {
        return(
            <div className='container_wrapper view_container'>
                <div className='view_title_wrapper'>
                    <h1>Lorem Ipsum</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
                </div>

                <div className='input_wrapper'>
                    <div className='date_input_wrapper'>
                        <div className='date_input'>
                            <TextField
                                id="date"
                                label="From"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                        <div className='date_input'>
                            <TextField
                                id="date"
                                label="To"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>

                    <div className='time_input'>
                        <Slider
                            value={this.state.time_range}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            onChange={ this.handle_time }
                        />
                    </div>
                </div>
            </div>
        )
    }
    
}