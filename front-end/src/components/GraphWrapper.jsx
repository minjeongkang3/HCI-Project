import React, { Component } from 'react';
import LineGraph from 'components/LineGraph';
import 'assets/css/cal_heatmap.css';
import 'assets/css/graphs.scss';
import prev from 'assets/img/prev.png';
import next from 'assets/img/next.png';

export default class GraphWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cal_heatmap: new window.CalHeatMap(),
            start: new Date(2020, 5, 1),
            heatmap_active: false,
            valid_range: false,
            selected_cell: null,
        }
        this.update_heatmap_start = this.update_heatmap_start.bind(this)
        this.update_heatmap_data = this.update_heatmap_data.bind(this)
        this.get_next = this.get_next.bind(this)
        this.get_previous = this.get_previous.bind(this)
        this.parser = this.parser.bind(this)
        this.sleep = this.sleep.bind(this)
        this.to_date = this.to_date.bind(this)
        this.heatmap_on_click = this.heatmap_on_click.bind(this)
    }

    // parser for heatmap data 
    parser(data) {
        var stats = {};
	    for (var d in data) {
		    stats[data[d].date] = data[d].value;
	    }
	    return stats;
    }

    // removes time from datetime
    to_date(datetime) {
        datetime.setHours(0)
        datetime.setMinutes(0);
        datetime.setSeconds(0);
        datetime.setMilliseconds(0);
        return datetime
    }

    componentWillReceiveProps(props) {
        // update heatmap whenever receives new props
        this.update_heatmap_start(props.heatmap_data)
    }
    
    // update the start date of the heatmap
    update_heatmap_start(heatmap_data) {
        if (heatmap_data.length > 0) {
            var start = new Date(heatmap_data[0].date * 1000)
            start = this.to_date(start)
            var diff_time = this.state.start - start;
            var diff_days = Math.ceil(Math.abs(diff_time) / (1000 * 60 * 60 * 24)); 
            if (diff_time > 0) {
                this.state.cal_heatmap.previous(diff_days) 
            }
            else {
                this.state.cal_heatmap.next(diff_days) 
            }
          
            this.setState({
                heatmap_active : false,
                valid_range: true,
                start: start,
                selected_cell: null
            })

            this.sleep(500).then(() => {
                this.update_heatmap_data(this.props.heatmap_data)
            })
        }
        else {
            this.sleep(500).then(() => {
                this.update_heatmap_data([])
            })
            this.setState({
                heatmap_active : false,
                valid_range: false,
                selected_cell: null
            })
        }
    }

    // update heatmap with given data
    update_heatmap_data(heatmap_data) {
        if (heatmap_data.length > 0) {
            this.state.cal_heatmap.update(heatmap_data)  
        }
        else {
            this.state.cal_heatmap.update([])  
        }
        this.setState({
            heatmap_active: true
        })
    }
    
    // next arrow button for heatmap
    get_next() {
        if (this.state.heatmap_active) {
            var cur_end = new Date(this.state.start)
            cur_end.setDate(cur_end.getDate() + 4);
            var end = new Date(this.props.heatmap_data[this.props.heatmap_data.length-1].date * 1000)
            if (cur_end < this.to_date(end)) {
                this.state.cal_heatmap.next()
                this.state.start.setDate(this.state.start.getDate() + 1)
                this.setState({
                    start: this.state.start,
                    heatmap_active: false,
                })
                this.sleep(500).then(() => {
                    this.update_heatmap_data(this.props.heatmap_data)
                })
            }
        }
    }

    // previous arrow button for heatmap
    get_previous() {
        if (this.state.heatmap_active) {
            var start = new Date(this.props.heatmap_data[0].date * 1000)
            if (this.state.start > this.to_date(start)) {
                this.state.cal_heatmap.previous()
                this.state.start.setDate(this.state.start.getDate() - 1)
                this.setState({
                    start: this.state.start,
                    heatmap_active: false,
                })
                this.sleep(500).then(() => {
                    this.update_heatmap_data(this.props.heatmap_data)
                })
            }
        }
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // on click handler for heatmap. renders line graphs
    heatmap_on_click(datetime, val) {
        if (this.state.heatmap_active) {
            var selected = this.props.heatmap_data.find(function(cell, index) {
                var cur_datetime = new Date(cell.date * 1000)
                if (cur_datetime.getTime() === datetime.getTime()) {
                    return true
                }
                return false
            })
            if (selected) {
                this.setState({
                    selected_cell: selected
                })
            }
        }
    }

    componentDidMount() {
        // instantiate the heatmap
        this.state.cal_heatmap.init({
            itemSelector: "#heatmap",
            range: 5,
            // this can be changed to month
            domain: "day",
            //  hours left to right
            subDomain: "x_hour",
            // Each cell label
            start: this.state.start,
            subDomainTextFormat: "%H",
            afterLoadData: this.parser,
            // Set size of each hour
            cellSize: 25,
            // Set spacing between domains
            domainGutter: 10,
            domainMargin: 5,
            // Set animation speed
            animationDuration: 400,
            tooltip: true,
            //labels tool tips
            itemName: ["item", "items"],
            displayLegend: true,
            legendVerticalPosition: 'top',
            onClick: this.heatmap_on_click,
        });
        this.update_heatmap_start(this.props.heatmap_data)
    }

    render() {
        const line_graphs = []
        if (this.state.valid_range && this.state.selected_cell){
            for (const [index, value] of this.state.selected_cell.ts_ids.entries()) {
                line_graphs.push(
                    <LineGraph key={index} ts_id={value} index={ index } 
                    start_datetime={new Date(this.state.selected_cell.date * 1000)}/>
                )
            }
        }

        return(
            <div className='graph_wrapper'> 
                <div className='heatmap_wrapper'>
                    <div id='prev_btn' className='selector_btn' onClick={ this.get_previous }>
                        <img className='icon_btn' src={ prev } alt=""/>
                    </div>
                    <div id='heatmap'>
                    </div>
                    <div id='next_btn' className='selector_btn'>
                        <img className='icon_btn' src={ next } onClick={ this.get_next } alt=""/>
                    </div>
                </div>

                <div className='line_graphs_wrapper'>
                    { line_graphs }
                </div>
            </div>
        )
    }
}