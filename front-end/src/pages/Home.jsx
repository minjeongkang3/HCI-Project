import React, { Component } from 'react';
import PieChartContainer from 'components/PieChartContainer';
import StackContainer from 'components/StackContainer';
import ViewContainer from 'components/ViewContainer';
import pieChartCsv from 'static/data/piechartData.csv';

import 'assets/css/general.scss';

const pie_chart_data = [
    {
        name: "DB",
        value: 100,
    },
    {
        name: "FS",
        value: 60,
    },
    {
        name: "ApacheS",
        value: 30,
    },
    {
        name: "SYS8",
        value: 20,
    }
]

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pie_chart_data: pieChartCsv,
            stack_data_visited: [],
            stack_data_current: []
        }  
        this.handle_click_visited = this.handle_click_visited.bind(this)
        this.handle_click_current = this.handle_click_current.bind(this)
        this.get_current_options = this.get_current_options.bind(this)
    }

    componentDidMount() {
        let data = pie_chart_data
        data.sort((a,b) => { return b.value - a.value})
        this.setState({
            stack_data_current: data
        })
    }

    handle_click_visited(option){
        let stack_data_visited = this.state.stack_data_visited.slice(0, option.index+1)
        this.setState({
            stack_data_visited: stack_data_visited,
            stack_data_current: this.get_current_options(stack_data_visited)
        })
    }

    handle_click_current(option){
        let stack_data_visited = this.state.stack_data_visited
        stack_data_visited.push({
            name: option.name,
            index: stack_data_visited.length
        })
        this.setState({
            stack_data_visited: stack_data_visited,
            stack_data_current: this.get_current_options(stack_data_visited)
        })
    }

    get_current_options(visited_options) {
        let new_options = [
            {
                name: 'Option1',
                value : 30,
            },
            {
                name: 'Option2',
                value : 10,
            },
            {
                name: 'Option3',
                value : 40,
            },
            {
                name: 'Option4',
                value : 100,
            }
        ]
        return new_options
    }

    render() {
        return(
            <div className='wrapper home_wrapper'>
                <div className='row'>
                    <div className='col_flex side_col'>
                        <PieChartContainer pie_chart_data={ this.state.pie_chart_data } />
                        <StackContainer stack_data_visited={ this.state.stack_data_visited } 
                            stack_data_current={ this.state.stack_data_current} 
                            onclick_current={ this.handle_click_current}
                            onclick_visited={ this.handle_click_visited}
                        />
                    </div>
                    <div className='col_flex main_col'>
                        <ViewContainer />
                    </div>
                </div>
            </div>
        )
    }
    
}