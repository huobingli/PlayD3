import React, { Component } from 'react'
import * as d3 from 'd3'


class KlineChart extends Component {
    constructor() {
        super()
        console.log("constructor")
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        // 交易日期，开盘价、最低价、最高价、收盘价、交易量、交易金额
        var EXCHANGE_DATE = 0,
            PRICE_OPEN = 1,
            PRICE_MIN = 2,
            PRICE_MAX = 3,
            PRICE_CLOSE = 4,
            EXCHANGE_NUM = 5,
            EXCHANGE_MONEY = 6;

        var dataset = [
            ['2011-12-16', 25.000, 24.900, 26.800, 26.440, 1171773, 3013978000.00],
            ['2011-12-19', 26.210, 26.000, 27.490, 26.960, 524161, 1393216000.00],
            ['2011-12-20', 27.100, 26.650, 27.590, 26.880, 274802, 744248000.00],
            ['2011-12-21', 27.140, 26.290, 27.650, 26.390, 221804, 599846800.00],
            ['2011-12-22', 25.960, 25.560, 27.200, 26.800, 147229, 386845500.00],
            ['2011-12-23', 26.520, 25.820, 27.170, 27.090, 126590, 337348500.00],
            ['2011-12-26', 26.710, 26.490, 27.320, 26.710, 74700, 200983900.00],
            ['2011-12-27', 26.450, 26.020, 29.380, 27.070, 139441, 385938100.00],
            ['2011-12-28', 26.470, 25.130, 27.420, 27.120, 107477, 284469300.00],
            ['2011-12-29', 26.610, 26.610, 28.300, 28.120, 99828, 277077400.00],
            ['2011-12-30', 27.970, 27.800, 28.690, 27.870, 113659, 320882300.00],
            ['2012-01-04', 27.920, 27.700, 28.550, 27.970, 76590, 215469100.00],
            ['2012-01-05', 27.940, 26.880, 28.420, 27.100, 89823, 248863800.00],
            ['2012-01-06', 26.600, 26.600, 28.210, 28.140, 61342, 168226600.00],
            ['2012-01-09', 28.090, 27.610, 29.550, 29.380, 67159, 192597700.00],
            ['2012-01-10', 29.380, 29.000, 30.300, 30.120, 84051, 250574200.00],
            ['2012-01-11', 29.950, 29.100, 30.200, 29.870, 47952, 142677200.00],
            ['2012-01-12', 29.620, 29.620, 30.950, 30.380, 55554, 168174300.00],
            ['2012-01-13', 30.480, 28.950, 30.580, 29.870, 49726, 147160100.00],
            ['2012-01-16', 29.500, 28.130, 29.770, 28.280, 36006, 105667100.00],
            ['2012-01-17', 28.580, 28.500, 30.920, 30.870, 91777, 271016900.00],
            ['2012-01-18', 30.540, 29.180, 30.900, 29.730, 64588, 195056000.00],
            ['2012-01-19', 29.730, 29.370, 30.600, 30.210, 38141, 115276000.00],
            ['2012-01-20', 30.100, 30.100, 32.220, 31.890, 66314, 207219200.00]
        ];

        var getPrices = function (data) {
            return data.slice(1, 5); // 取 1~4 （开盘价、最低价、最高价、收盘价） 数据
        };
        var getMinPrice = function (d) {
            return d3.min(getPrices(d));
        };
        var getMaxPrice = function (d) {
            return d3.max(getPrices(d));
        };
        var getColor = function (d) {
            // 1-开盘价、4-收盘价
            return (d[PRICE_OPEN] < d[PRICE_CLOSE]) ? 'red' : 'green';
        };

        var dataCnt = dataset.length;
        var w = 500, h = 200;
        var barPadding = 4;
        var svg = d3.select("#divChart").append('svg').attr('width', w).attr('height', h).style("background", "#fcfcfc");
        var priceMin = d3.min(dataset, getMinPrice);
        var priceMax = d3.max(dataset, getMaxPrice);

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
                return h - yscale(d3.max([d[PRICE_OPEN], d[PRICE_CLOSE]]));
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
    }

    render() {
        console.log(`render!! ${this.props.id}`)
        return (<div></div>)
    }

}

export default KlineChart