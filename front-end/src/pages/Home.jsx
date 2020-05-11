import React, { Component } from 'react';
import PieChartContainer from 'components/PieChartContainer';
import StackContainer from 'components/StackContainer';
import ViewContainer from 'components/ViewContainer';

import 'assets/css/general.scss';

// dummy data for pie chart
const init_pie_chart_data = [
    {
        name: "DB",
        value: 50,
    },
    {
        name: "FS",
        value: 50,
    },
    {
        name: "ApacheS",
        value: 50,
    },
    {
        name: "SYS8",
        value: 50,
    },
    {
        name: "SYS1",
        value: 50,
    }
]

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pie_chart_data: init_pie_chart_data,
            stack_data_visited: [],
            stack_data_current: [],
            active: false,
        }  
        this.handle_click_visited = this.handle_click_visited.bind(this)
        this.handle_click_current = this.handle_click_current.bind(this)
        this.get_current_options = this.get_current_options.bind(this)
        this.handle_click_piechart = this.handle_click_piechart.bind(this)
        this.update_piechart = this.update_piechart.bind(this)
        this.sort_by_value = this.sort_by_value.bind(this)
        this.set_active = this.set_active.bind(this)

        this.view_ref = React.createRef();
    }

    // sorts a list of objects by 'value'
    sort_by_value(list) {
        list.sort((a,b) => { return b.value - a.value})
        return list
    }
    
    componentDidMount() {
        // initialize pie chart
        let data = init_pie_chart_data
        data = this.sort_by_value(data)
        this.setState({
            pie_chart_data: data,
        })
    }

    // set 'active' based on whether date inputs are valid
    set_active(active) {
        this.setState({
            active: active
        })
    }

    // click handler for visited stack items
    handle_click_visited(option){
        if (this.state.active){
            let stack_data_visited = this.state.stack_data_visited.slice(0, option.index+1)
            this.setState({
                stack_data_visited: stack_data_visited,
                stack_data_current: this.get_current_options(stack_data_visited)
            })
            this.view_ref.current.restore_view(option.index)
        }
    }

    // click handler for current stack items
    handle_click_current(option){
        if (this.state.active){
            let stack_data_visited = this.state.stack_data_visited
            stack_data_visited.push({
                name: option.name,
                index: stack_data_visited.length
            })
            this.setState({
                stack_data_visited: stack_data_visited,
                stack_data_current: this.get_current_options(stack_data_visited)
            })
            this.view_ref.current.store_view()
            this.view_ref.current.update_heatmap_data()
        }
    }

    // click handler for pie chart segments
    handle_click_piechart(option){
        if (this.state.active){
            if (this.state.stack_data_visited.length > 0) {
                this.view_ref.current.update_heatmap_data()
            }
            let stack_data_visited = []
            stack_data_visited.push({
                name: option.name,
                index: stack_data_visited.length
            })
            this.setState({
                stack_data_visited: stack_data_visited,
                stack_data_current: this.get_current_options(stack_data_visited)
            })
        }
    }

    // updates pie chart with randomly generated data
    update_piechart(from_datetime, to_date_times){
        var pie_chart_data = this.state.pie_chart_data
        for (let i =0; i < pie_chart_data.length; i++) {
            pie_chart_data[i].value = Math.floor(Math.random() * 40 + 60)
        }
        pie_chart_data = this.sort_by_value(pie_chart_data)
        this.setState({
            pie_chart_data: pie_chart_data
        })
    }   

    // gives current options based on the visited options
    // for now, just returns dummy data
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
                        <PieChartContainer pie_chart_data={ this.state.pie_chart_data }
                            onclick_piechart={ this.handle_click_piechart } />
                        <StackContainer stack_data_visited={ this.state.stack_data_visited } 
                            stack_data_current={ this.state.stack_data_current} 
                            onclick_current={ this.handle_click_current }
                            onclick_visited={ this.handle_click_visited }
                        />
                    </div>
                    <div className='col_flex main_col'>
                        <ViewContainer 
                            update_piechart={ this.update_piechart } 
                            set_active={ this.set_active }
                            display={ this.state.stack_data_visited.length > 0}
                            ref={this.view_ref}
                        />
                    </div>
                </div>
            </div>
        )
    }
    
}