import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import PieChart from './PieChart';

import 'assets/css/view.scss';

const TimeSlider = withStyles({
    mark: {
        backgroundColor: '#bfbfbf',
        height: 16,
        width: 2,
        marginTop: -8,
      },
})(Slider);

export default class ViewContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            from_date: null,
            to_date: null,
            time_range: [0, 24],
            slider_marks: [
                { value: 0 },
                { value: 24}
            ],
            time_max: 24,
        }
        this.handle_time = this.handle_time.bind(this);
        this.handle_date = this.handle_date.bind(this);
        this.slider_val_format = this.slider_val_format.bind(this);
    }

    handle_time(event, new_range) {
        this.setState({
            time_range: new_range,
        })
    };

    handle_date(date, type) {
        var from_date = this.state.from_date;
        var to_date = this.state.to_date
        if (type === 'from') {
            from_date = new Date(date);
            from_date.setMinutes( from_date.getMinutes() + from_date.getTimezoneOffset() );
            console.log(from_date.toString())
        }
        else {
            to_date = new Date(date);
            to_date.setMinutes( to_date.getMinutes() + to_date.getTimezoneOffset() );
            console.log(to_date.toString())
        }
        if (from_date === null || to_date === null || from_date > to_date) {
            this.setState({
                from_date: from_date,
                to_date: to_date,
            })
            document.getElementById('time_slider').classList.add("Mui-disabled");
            return
        }
        document.getElementById('time_slider').classList.remove("Mui-disabled");
        var diff_hours = (to_date.getTime()-from_date.getTime()) / (1000 * 60 * 60)
        
        var marks = []
        var num_days = Math.ceil(diff_hours / 24)
        for (let i = 0; i < num_days + 1; i ++){
            var date = new Date(from_date)
            date.setDate(from_date.getDate() + i)
            marks.push({ 
                value: i * 24,
                label: date.getMonth()+1 + '/' + date.getDate() + '/' +date.getFullYear().toString().substr(-2) ,
            })
            
        }
        document.getElementById('time_slider').classList.remove("Mui-disabled");
        this.setState({
            from_date: from_date,
            to_date: to_date,
            time_range: [0, diff_hours],
            time_max: diff_hours,
            slider_marks: marks,
        }) 
    }

    slider_val_format(value) {
        return value % 24 + ":00"
    }

    componentDidMount() {
        document.getElementById('time_slider').classList.add("Mui-disabled");
    }

    render() {
        return(
            <div className='container_wrapper view_container'>
                <div className='view_title_wrapper'>
                    <h1>Lorem Ipsum</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
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
                                onChange={ (e) => { 
                                    this.handle_date(e.target.value, "from")
                                } }
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
                                onChange={ (e) => { 
                                    this.handle_date(e.target.value, "to")
                                } }
                            />
                        </div>
                    </div>

                    <div className='time_input'>
                        <TimeSlider
                            value={this.state.time_range}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            onChange={ this.handle_time }
                            marks={ this.state.slider_marks }
                            max={this.state.time_max}
                            valueLabelFormat={ this.slider_val_format }
                            valueLabelDisplay="on"
                            id='time_slider'
                        />
                    </div>
                    <PieChart />
                </div>
            </div>
        )
    }
    
}