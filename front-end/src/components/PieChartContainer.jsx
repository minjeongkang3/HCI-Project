import React, { Component } from 'react';
import { Polar } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import 'assets/css/piechart.scss';
import vars from 'assets/css/stack.scss';

const colors = [vars.currentColor1, vars.currentColor2, vars.currentColor3, vars.currentColor4, vars.currentColor5] 

export default class PieChartContainer extends Component {
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this)
    }

    handle_click(e, item) {
        if (item.length > 0) {
            this.props.onclick_piechart(this.props.pie_chart_data[item[0]._index])
        }
    }

    render() {
        const data = []
        const labels = []
        for (let i=0; i < this.props.pie_chart_data.length; i++){
            data.push(this.props.pie_chart_data[i].value)
            labels.push(this.props.pie_chart_data[i].name)
        }
        const pie_chart_data = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                hoverBackgroundColor: [vars.currentColor1_2, vars.currentColor2_2, vars.currentColor3_2, vars.currentColor4_2, vars.currentColor5_2] 
            }],

        }
        const pie_chart_options = {
            plugins: {
                labels: {
                    render: 'label',
                    fontColor: '#ffffff',
                    fontSize: 14,
                    fontStyle: 'bold',
                    fontFamily: "Open Sans",
                    position: 'inside',
                    textMargin: 3,
                }
            },
            legend: {
                display: false
             },
            scale: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            onClick: this.handle_click,
            hover: {
                onHover: function(e) {
                   var point = this.getElementAtEvent(e);
                   if (point.length) e.target.style.cursor = 'pointer';
                   else e.target.style.cursor = 'default';
                }
            },

            maintainAspectRatio: false
            
        }
        return(
            <div className='container_wrapper piechart_container'>
                <Polar
                    id='pie_chart'
                    width={80}
                    height={80}
                    data={ pie_chart_data }
                    options={ pie_chart_options }
                />
            </div>
        )
    }
    
}