import React, { Component } from 'react';
import PieChartContainer from 'components/PieChartContainer';
import StackContainer from 'components/StackContainer';
import ViewContainer from 'components/ViewContainer';
import pieChartCsv from 'static/data/piechartData.csv';

import 'assets/css/general.scss';

const pie_chart_data = [
    {
        'System': "DB",
        'Value': 100,
    },
    {
        'System': "FS",
        'Value': 60,
    },
    {
        'System': "ApacheS",
        'Value': 30,
    },
    {
        'System': "SYS8",
        'Value': 20,
    }
]

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pie_chart_data: pieChartCsv,
            stack_data_visited: [
                'SYS8',
                'DB',
            ],
            stack_data_current: [
                'Option 1',
                'Option 2',
                'Option 3',
                'Option 4'
            ]
        }  
    }

    render() {
        return(
            <div className='wrapper home_wrapper'>
                <div className='row'>
                    <div className='col_flex side_col'>
                        <PieChartContainer pie_chart_data={ this.state.pie_chart_data } />
                        <StackContainer stack_data_visited={ this.state.stack_data_visited } stack_data_current={ this.state.stack_data_current} />
                    </div>
                    <div className='col_flex main_col'>
                        <ViewContainer />
                    </div>
                </div>
            </div>
        )
    }
    
}