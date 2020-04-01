import React, { Component } from 'react';
import * as d3 from 'd3';
import { scaleRadial } from 'd3-scale';

const margin = { top: 10, right: 10, bottom: 10, left: 10 },
width = 100 - margin.left - margin.right,
height = 100 - margin.top - margin.bottom;

const inner_radius = 40;
const outer_radius = 100;

export default class PieChartContainer extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        const svg = d3.select(this.ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 100) + ")"); // Add 100 on Y translation
        ;

        d3.csv(this.props.pie_chart_data).then(function(data) { 
            var x = d3.scaleBand()
                .range([0, 2 * Math.PI])    // X axis  0 to 2pi = all around the circle.
                .align(0)                  
                .domain(data.map(function (d) { return d.System; })); 

            var y = scaleRadial()
                .range([inner_radius, outer_radius])   
                .domain([0, 100]); // Domain of Y is from 0 to the max in the data

            svg.append("g")
                .selectAll("path")
                .data(data)
                .enter()
                .append("path")
                .attr("fill", "#69b3a2")
                .attr("d", d3.arc()
                    .innerRadius(inner_radius)
                    .outerRadius(function (d) { return y(d['Value']); })
                    .startAngle(function (d) { return x(d.System); })
                    .endAngle(function (d) { return x(d.System) + x.bandwidth(); })
                    .padAngle(0.01)
                    .padRadius(inner_radius))
            
            // Add the labels
            svg.append("g")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("text-anchor", function (d) { return (x(d.System) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
                .attr("transform", function (d) { return "rotate(" + ((x(d.System) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['Value']) + 10) + ",0)"; })
                .append("text")
                .text(function (d) { return (d.System) })
                .attr("transform", function (d) { return (x(d.System) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
                .style("font-size", "11px")
                .attr("alignment-baseline", "middle")
        })
        .catch(function(err) {
            throw err;
        });
       
    }

    render() {
        return(
            <div className='container_wrapper piechart_container'>
                <svg ref={this.ref} />
            </div>
        )
    }
    
}