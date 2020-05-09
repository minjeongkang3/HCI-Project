import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import GraphWrapper from 'components/GraphWrapper';

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
        var init_max = 24
        this.state = {
            from_date: null,
            to_date: null,
            time_range: [0, init_max],
            slider_marks: [
                { value: 0 },
                { value: init_max}
            ],
            time_max: init_max,
            heatmap_data: [],
            visited_views: [],
        }
        this.handle_time = this.handle_time.bind(this);
        this.handle_date = this.handle_date.bind(this);
        this.slider_val_format = this.slider_val_format.bind(this);
        this.get_heatmap_data = this.get_heatmap_data.bind(this);
        this.generate_random_ids = this.generate_random_ids.bind(this);
        this.update_heatmap_data = this.update_heatmap_data.bind(this)
        this.format_date = this.format_date.bind(this)
    }

    handle_time(event, new_range) {
        this.setState({
            time_range: new_range,
        })
    }

    update_heatmap_data(event){
        this.setState({
            heatmap_data: this.get_heatmap_data(this.state.from_date, this.state.time_range)
        })
    }

    format_date(date) {
        if (!date) {
            return ""
        }
        return date.toISOString().slice(0,10)
    }

    handle_date(date, type) {
        var from_date = this.state.from_date;
        var to_date = this.state.to_date
        if (type === 'from') {
            from_date = new Date(date);
            from_date.setMinutes( from_date.getMinutes() + from_date.getTimezoneOffset() );
        }
        else {
            to_date = new Date(date);
            to_date.setMinutes( to_date.getMinutes() + to_date.getTimezoneOffset() );
        }
        if (from_date === null || to_date === null || from_date >= to_date) {
            this.setState({
                from_date: from_date,
                to_date: to_date,
                heatmap_data: []
            })
            document.getElementById('time_slider').classList.add("Mui-disabled");
            this.props.set_active(false)
            return
        }
        document.getElementById('time_slider').classList.remove("Mui-disabled");
        var diff_hours = (to_date.getTime()-from_date.getTime()) / (1000 * 60 * 60)
        
        var marks = []
        var num_days = Math.ceil(diff_hours / 24)
        for (let i = 0; i < num_days + 1; i ++){
            var mark_date = new Date(from_date)
            mark_date.setDate(from_date.getDate() + i)
            marks.push({ 
                value: i * 24,
                label: mark_date.getMonth()+1 + '/' + mark_date.getDate() + '/' +mark_date.getFullYear().toString().substr(-2) ,
            })
            
        }
        document.getElementById('time_slider').classList.remove("Mui-disabled");
        this.setState({
            from_date: from_date,
            to_date: to_date,
            time_range: [0, diff_hours],
            time_max: diff_hours,
            slider_marks: marks,
            heatmap_data: this.get_heatmap_data(from_date, [0, diff_hours])
        }) 
        this.props.update_piechart(from_date, to_date)
        this.props.set_active(true)
    }

    slider_val_format(value) {
        return value % 24 + ":00"
    }

    get_heatmap_data(from_data, time_range){
        var start_datetime = new Date(from_data);
        start_datetime.setHours(start_datetime.getHours() + time_range[0]);
        var diff_hours = time_range[1] - time_range[0] 
        var data = []
        for (var i=0; i < diff_hours; i++){
            var cur_date = new Date(start_datetime);
            cur_date.setHours(cur_date.getHours() + i)
            var value = Math.floor(Math.random() * 60)
            data.push(
                {
                    date: cur_date.getTime() / 1000,
                    value: value,
                    ts_ids: this.generate_random_ids(Math.max(1, Math.floor(value/10)))
                }
            )
        }
        return data 
    }

    update_heatmap_data() {
        this.setState({
            heatmap_data: this.get_heatmap_data(this.state.from_date,this.state.time_range)
        })
    }

    store_view(){
        var visited_views = this.state.visited_views
        visited_views.push(
            this.state
        )
        this.setState({
            visited_views: visited_views
        })
    }

    restore_view(index) {
        var view = this.state.visited_views[index]
        this.setState({
            from_date: view.from_date,
            to_date: view.to_date,
            time_max: view.time_max,
            slider_marks: view.slider_marks,
            time_range: view.time_range,
        })
        this.setState({
            heatmap_data: view.heatmap_data,
            visited_views: view.visited_views
        })
    }

    generate_random_ids(num) {
        var ids = []
        for (let i=0; i < num; i++){
            ids.push(Math.floor(Math.random() * 9)+1)
        }
        return ids
    }

    componentDidMount() {
        document.getElementById('time_slider').classList.add("Mui-disabled");
    }

    render() {
        var graph_wrapper = null
        if (this.props.display){
            graph_wrapper=<GraphWrapper heatmap_data={ this.state.heatmap_data }/>
        }
        
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
                                id="date_from"
                                label="From"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={ (e) => { 
                                    this.handle_date(e.target.value, "from")
                                } }
                                value={this.format_date(this.state.from_date)}
                            />
                        </div>
                        <div className='date_input'>
                            <TextField
                                id="date_to"
                                label="To"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={ (e) => { 
                                    this.handle_date(e.target.value, "to")
                                } }
                                value={this.format_date(this.state.to_date)}
                            />
                        </div>
                    </div>

                    <div className='time_input'>
                        <TimeSlider
                            value={this.state.time_range}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            onChange={ this.handle_time }
                            onMouseUp={this.update_heatmap_data}
                            marks={ this.state.slider_marks }
                            max={this.state.time_max}
                            valueLabelFormat={ this.slider_val_format }
                            valueLabelDisplay="on"
                            id='time_slider'
                        />
                    </div>
                </div>

                { graph_wrapper }
            </div>
        )
    }
    
}