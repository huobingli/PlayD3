import React, { Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
    constructor() {
        super()
        console.log("constructor!! ")
    }

    componentDidMount() {
        console.log("componentDidMount!! ")
        this.drawChart();
    }

    componentDidUpdate() {
        console.log("componentDidUpdate!! ")
    }

    componentWillUnmount() {
        console.log("componentWillUnmount!! ")
    }

    drawChart() {
        const data = [12, 5, 6, 6, 9, 10];

        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", 700)
                    .attr("height", 300);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }
    render() {
        console.log(`render!! ${this.props.id}`)
        return <div id={"#" + this.props.id}>{this.props.id}</div>
    }
}
export default BarChart;