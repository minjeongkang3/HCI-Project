import React, { Component } from 'react';
import { VictoryTheme, VictoryChart, VictoryLine, VictoryBrushContainer, VictoryAxis, VictoryZoomContainer } from 'victory';

const colors = [
    "#259436",
    "#851f99",
    "#c7082b",
    "#162387",
    "#eb5f0e",
]

export default class LineGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.generate_random_data = this.generate_random_data.bind(this)
    }

    generate_random_data(start_datetime) {
        var data = []
        for(let i=0; i<60; i++){
            var new_datetime = new Date(start_datetime.getTime() + i*60000)
            data.push(
                { x: new_datetime, y: Math.floor(Math.random() * 200) }
            )
        }
        return data
    }

    handleZoom(domain) {
        this.setState({selectedDomain: domain});
    }
    
    handleBrush(domain) {
        this.setState({zoomDomain: domain});
    }

    componentDidMount() {
        this.setState({
            data: this.generate_random_data(this.props.start_datetime) 
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            data: this.generate_random_data(props.start_datetime) 
        })
    }

    render() {
        
        return (
            <div className='line_graph_wrapper'>
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={480}
                    height={300}
                    scale={{x: "time"}}
                    containerComponent={
                        <VictoryZoomContainer responsive={false}
                        zoomDimension="x"
                        zoomDomain={this.state.zoomDomain}
                        onZoomDomainChange={this.handleZoom.bind(this)}
                        />
                    }
                >
                    <VictoryLine
                    style={{
                        data: {stroke: colors[this.props.index]},
                    }}
                    data={ this.state.data }
                    />
                </VictoryChart>

                <VictoryChart
                    theme={VictoryTheme.material}
                    width={480}
                    height={100}
                    scale={{x: "time"}}
                    padding={{top: 0, left: 50, right: 50, bottom: 30}}
                    containerComponent={
                    <VictoryBrushContainer responsive={false}
                        brushDimension="x"
                        brushDomain={this.state.selectedDomain}
                        onBrushDomainChange={this.handleBrush.bind(this)}
                    />
                    }
                >
                    <VictoryAxis/>
                    <VictoryLine
                    style={{
                        data: {stroke: colors[this.props.index]}
                    }}
                    data={ this.state.data }
                    />
                </VictoryChart>
            </div>
        )
    }
}