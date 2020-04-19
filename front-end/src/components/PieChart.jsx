import React, { Component } from 'react';
import * as d3 from 'd3';


export default class PieChart extends Component {
    create_pie() {
        const pie = d3.pie().value(d => d.Value)
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}