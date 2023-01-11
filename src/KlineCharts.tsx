import React, { Component, useEffect } from 'react'
import * as d3 from 'd3'

// 交易日期，开盘价、最低价、最高价、收盘价、交易量、交易金额
const EXCHANGE_DATE = 0
const PRICE_OPEN = 1
const PRICE_MIN = 2
const PRICE_MAX = 3
const PRICE_CLOSE = 4
const EXCHANGE_NUM = 5
const EXCHANGE_MONEY = 6

// class KlineChart extends Component {
const KlineCharts = () => {
    // componentDidMount() {
    //     this.drawChart();
    // }

    const mockData = () => {
        const dataset = [
            [20111216, 25.000, 24.900, 26.800, 26.440, 1171773, 3013978000.00],
            [20111219, 26.210, 26.000, 27.490, 26.960, 524161, 1393216000.00],
            [20111220, 27.100, 26.650, 27.590, 26.880, 274802, 744248000.00],
            [20111221, 27.140, 26.290, 27.650, 26.390, 221804, 599846800.00],
            [20111222, 25.960, 25.560, 27.200, 26.800, 147229, 386845500.00],
            [20111223, 26.520, 25.820, 27.170, 27.090, 126590, 337348500.00],
            [20111226, 26.710, 26.490, 27.320, 26.710, 74700, 200983900.00],
            [20111227, 26.450, 26.020, 29.380, 27.070, 139441, 385938100.00],
            [20111228, 26.470, 25.130, 27.420, 27.120, 107477, 284469300.00],
            [20111229, 26.610, 26.610, 28.300, 28.120, 99828, 277077400.00],
            [20111230, 27.970, 27.800, 28.690, 27.870, 113659, 320882300.00],
            [20120104, 27.920, 27.700, 28.550, 27.970, 76590, 215469100.00],
            [20120105, 27.940, 26.880, 28.420, 27.100, 89823, 248863800.00],
            [20120106, 26.600, 26.600, 28.210, 28.140, 61342, 168226600.00],
            [20120109, 28.090, 27.610, 29.550, 29.380, 67159, 192597700.00],
            [20120110, 29.380, 29.000, 30.300, 30.120, 84051, 250574200.00],
            [20120111, 29.950, 29.100, 30.200, 29.870, 47952, 142677200.00],
            [20120112, 29.620, 29.620, 30.950, 30.380, 55554, 168174300.00],
            [20120113, 30.480, 28.950, 30.580, 29.870, 49726, 147160100.00],
            [20120116, 29.500, 28.130, 29.770, 28.280, 36006, 105667100.00],
            [20120117, 28.580, 28.500, 30.920, 30.870, 91777, 271016900.00],
            [20120118, 30.540, 29.180, 30.900, 29.730, 64588, 195056000.00],
            [20120119, 29.730, 29.370, 30.600, 30.210, 38141, 115276000.00],
            [20120120, 30.100, 30.100, 32.220, 31.890, 66314, 207219200.00]
        ]
        return dataset
    }

    const test = (data: number[][]) => {
        console.log(data)
    }

    const getPrices = (data: number[]) => {
        return data.slice(1, 5); // 取 1~4 （开盘价、最低价、最高价、收盘价） 数据
    }

    const getMinPrice = (d: number[]) => {
        return d3.min(getPrices(d)) ?? 0;
    }

    const getMaxPrice = (d: number[]) => {
        return d3.max(getPrices(d)) ?? 0;
    }

    const getColor = (data: number[]) => {
        return (data[PRICE_OPEN] < data[PRICE_CLOSE]) ? 'red' : 'green';
    }

    const initCanvas = () => {
        const dataset = mockData()
        test(dataset)
        var dataCnt = dataset.length
        var w = 500, h = 300;
        var barPadding = 4;
        var svg = d3.select("#divChart").append('svg').attr('width', w).attr('height', h).style("background", "#fcfcfc");
        var priceMin = d3.min(dataset, getMinPrice) ?? 0;
        var priceMax = d3.max(dataset, getMaxPrice) ?? 0;

        var yscale = d3.scaleLinear()
            .domain([priceMin, priceMax])
            .range([0, h]);

        // 画K线
        svg.selectAll('line').data(dataset).enter().append('line')
            .attr('x1', function (d, i) {
                return i * (w / dataCnt) + (w / dataCnt - barPadding) / 2;
            })
            .attr('x2', function (d, i) {
                return i * (w / dataCnt) + (w / dataCnt - barPadding) / 2;
            })
            .attr('y1', function (d, i) {
                return h - yscale(getMaxPrice(d));
            })
            .attr('y2', function (d, i) {
                return h - yscale(getMinPrice(d));
            })
            .attr("stroke", getColor);

        // 画方框
        svg.selectAll('rect').data(dataset).enter().append('rect')
            .attr('x', function (d, i) {
                return i * (w / dataCnt)
            })
            .attr('y', function (d, i) {
                const da = d[PRICE_OPEN] ?? 0
                const db = d[PRICE_CLOSE] ?? 0
                return h - yscale(d3.max([da, db]) ?? 0);
            })
            .attr('width', function (d, i) {
                return w / dataCnt - barPadding;
            })
            .attr('height', function (d, i) {
                var vv = Math.abs(yscale(d[PRICE_OPEN]) - yscale(d[PRICE_CLOSE]));
                if (vv < 0.5) {
                    vv = 0.5; // 防止数据为0或高度过小
                }
                return vv;
            })
            .attr("fill", getColor)
            .attr('title', function (d, i) {
                return "交易日期：" + d[EXCHANGE_DATE] + "&#13;交易量：" + d[EXCHANGE_NUM] + "&#13;交易金额：" + d[EXCHANGE_MONEY];
            });

        svg.selectAll('rect')
            .on("mouseover", function (d, i) {

                console.log(d + i)
            })



        //     const X = d3.map(data, date);
        //     const Yo = d3.map(data, open);
        //     const Yc = d3.map(data, close);
        //     const Yh = d3.map(data, high);
        //     const Yl = d3.map(data, low);
        //     const I = d3.range(X.length);

        //     const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop + 1);
        //     const weekdays = (start, stop) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

        //     // Compute default domains and ticks.
        //     if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
        //     if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
        //     if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

        //     // Construct scales and axes.
        //     // If you were to plot a stock using d3.scaleUtc, you’d see distracting gaps
        //     // every weekend. This chart therefore uses a d3.scaleBand whose domain is every
        //     // weekday in the dataset. A few gaps remain for holiday weekdays, such as
        //     // Christmas, but these are infrequent and allow the labeling of Mondays. As a
        //     // band scale, we specify explicit tick values.
        //     const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
        //     const yScale = yType(yDomain, yRange);
        //     const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
        //     const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

        //     // Compute titles.
        //     if (title === undefined) {
        //       const formatDate = d3.utcFormat("%B %-d, %Y");
        //       const formatValue = d3.format(".2f");
        //       const formatChange = (f => (y0, y1) => f((y1 - y0) / y0))(d3.format("+.2%"));
        //       title = i => `${formatDate(X[i])}
        //   Open: ${formatValue(Yo[i])}
        //   Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
        //   Low: ${formatValue(Yl[i])}
        //   High: ${formatValue(Yh[i])}`;
        //     } else if (title !== null) {
        //       const T = d3.map(data, title);
        //       title = i => T[i];
        //     }

        //     const svg = d3.create("svg")
        //         .attr("width", width)
        //         .attr("height", height)
        //         .attr("viewBox", [0, 0, width, height])
        //         .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        //     svg.append("g")
        //         .attr("transform", `translate(0,${height - marginBottom})`)
        //         .call(xAxis)
        //         .call(g => g.select(".domain").remove());

        //     svg.append("g")
        //         .attr("transform", `translate(${marginLeft},0)`)
        //         .call(yAxis)
        //         .call(g => g.select(".domain").remove())
        //         .call(g => g.selectAll(".tick line").clone()
        //             .attr("stroke-opacity", 0.2)
        //             .attr("x2", width - marginLeft - marginRight))
        //         .call(g => g.append("text")
        //             .attr("x", -marginLeft)
        //             .attr("y", 10)
        //             .attr("fill", "currentColor")
        //             .attr("text-anchor", "start")
        //             .text(yLabel));

        //     const g = svg.append("g")
        //         .attr("stroke", stroke)
        //         .attr("stroke-linecap", strokeLinecap)
        //         .selectAll("g")
        //         .data(I)
        //         .join("g")
        //         .attr("transform", i => `translate(${xScale(X[i])},0)`);

        //     g.append("line")
        //         .attr("y1", i => yScale(Yl[i]))
        //         .attr("y2", i => yScale(Yh[i]));

        //     g.append("line")
        //         .attr("y1", i => yScale(Yo[i]))
        //         .attr("y2", i => yScale(Yc[i]))
        //         .attr("stroke-width", xScale.bandwidth())
        //         .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

        //     if (title) g.append("title")
        //         .text(title);

        //     return svg.node();

        // const svgWidth = 1380;
        // const svgHeight = 900;

        // const padding = 0;
        // //基于数据设置画布中心，这里changsha就是对象化了的数据
        // const svg = d3.select(".changsha")
        //     .attr("height", svgHeight)
        //     .attr("width", svgWidth);

        // /*
        //  * 创建一个地理投影
        //  * .center 设置投影中心位置
        //  * .scale 设置缩放系数 
        //  */
        // const x0 = padding;
        // const y0 = padding;
        // const x1 = svgWidth - padding * 2;
        // const y1 = svgHeight - padding * 2;
        // const projection = d3.geoMercator().fitExtent(
        //     [
        //         [x0, y0],
        //         [x1, y1],
        //     ], changsha
        // );
        // //如果采用手动设定中心，可以稍稍加快运算速度
        // // 创建路径生成器path
        // var path = d3.geoPath().projection(projection);

        // /*
        //  * 渲染地图
        //  */
        // const mapPath = svg.selectAll("path");
        // mapPath.data(changsha.features)
        //     .join('path')
        //     .attr('d', path)
        //     .attr("stroke-width", 2)
        //     .attr("stroke", "#00cc00")
        //     .attr("fill", "#000000")
    }

    React.useEffect(() => {
        initCanvas()
    }, [])


    const styleText = {
        width: '400px',
        height: '700px',
        border: "1px solid #999999"
        // margin: 0 auto,
        // text-align: center
    }

    return (<>
        <div id="divChart" style={styleText} > </div>
    </>)

}

export default KlineCharts