import React, { Component, useEffect } from 'react'
import * as d3 from 'd3'

const width = 1000
const height = 500
const margin = { top: 50, right: 30, bottom: 30, left: 80 }


// const getCandlestickWidth = (dataLength) => (width - margin.left - margin.right) / dataLength - 3

interface dataset {
    [key: number]: number;
}

// class KlineChart extends Component {
const CandleChart = () => {



    const drawTitle = (value: string) => {
        d3.select('#CandleChart').append('text')
            .text(value)
            .attr('x', margin.left)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
    }

    const drawAxisX = (data: dataset[]) => {
        const svg = d3.select('#CandleChart').append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
        console.log(data)
        const dates = d3.map(data, v => v[0])

        console.log(dates)

        const scale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, width - margin.left - margin.right])

        const axis = d3.axisBottom(scale)
            .ticks(10)
            // .tickFormat((d, i) => ['a', 'e', 'i', 'o', 'u'][i])
            .tickFormat(i => { return dates[i] })

        svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
            .call(axis)

        return scale
    }

    // const drawAxisY = (data: dataset[]) => {
    //     // 找到最高价和最低价，用来作为蜡烛图的参照坐标
    //     const highPrices = d3.map(data, v => v[3])
    //     const lowPrices = d3.map(data, v => v[4])
    //     const pricePending = Math.round(d3.max(highPrices) / 100)

    //     // 绘制竖坐标
    //     const scale = d3.scaleLinear()
    //         .domain([d3.min(lowPrices) - pricePending, d3.max(highPrices) + pricePending])
    //         .range([0, height - margin.top - margin.bottom])

    //     const axis = d3.axisLeft(scale).ticks(10)

    //     svg.append('g')
    //         .attr('transform', 'translate(' + (margin.left - 5) + ', ' + margin.top + ')')
    //         .call(axis)
    //         .call(g => g.select('.domain').remove())
    //         .call(g => {
    //             g.selectAll('.tick line')
    //                 .clone()
    //                 .attr('stroke-opacity', 0.1)
    //                 .attr('stroke-dasharray', 5)
    //                 .attr('x2', width - margin.left - margin.right)
    //         })

    //     return scale
    // }

    const init = () => {


        // 获取数据并开始绘制
        d3.json('./data.json').then((data: any) => {
            console.log(data["data"])
            const drawData = data["data"]
            drawAxisX(drawData)
            // const yScale = drawAxisY(data.data)

            drawTitle(data["name"])
        })
    }

    React.useEffect(() => {
        init()
    }, [])

    const styleText = {
        width: '700px',
        height: '400px',
        border: "1px solid #999999"
        // margin: 0 auto,
        // text-align: center
    }

    return (<>
        <div id="CandleChart" style={styleText} > </div>
    </>)
}

export default CandleChart;