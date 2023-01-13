import React, { Component, useEffect } from 'react'
import * as d3 from 'd3'


interface DataProps {
    [key: string]: string | number | undefined;
}

interface colorType {
    [key: string]: string | number;
}

const color: colorType = {
    武汉: "#ff1c12",
    黄石: "#de5991",
    十堰: "#759AA0",
    荆州: "#E69D87",
    宜昌: "#be3259",
    襄阳: "#EA7E53",
    鄂州: "#EEDD78",
    荆门: "#9359b1",
    孝感: "#47c0d4",
    黄冈: "#F49F42",
    咸宁: "#AA312C",
    恩施州: "#B35E45",
    随州: "#4B8E6F",
    仙桃: "#ff8603",
    天门: "#ffde1d",
    潜江: "#1e9d95",
    神农架: "#7289AB"
};

const PlotCanvas = () => {
    const xValue = (d: any) => {
        return Math.log(d["确诊人数"] + 1);
    };
    const yValue = (d: any) => {
        return Math.log(d["新增确诊"] + 1);
    };

    const width = 700//+svg.attr("width");
    const height = 500//+svg.attr("height");
    const svg = d3.select("#PlotCanvas").append('svg').attr('width', width).attr('height', height).style("background", "#fcfcfc");;
    const margin = { top: 40, right: 40, bottom: 80, left: 100 };
    const iWidth: number = width - margin.left - margin.right;
    const iHeight: number = height - margin.top - margin.bottom;

    let allDates: any;
    let sequantial: any;
    let xScale: any, yScale: any;
    const xAxisLabel = "累计确诊人数（对数）";
    const yAxisLabel = "新增人数（对数）";
    const aduration = 1;

    const renderInit = (data: Record<string, any>[]) => {
        xScale = d3
            .scaleLinear()
            .domain([d3.min(data, xValue) ?? 0, d3.max(data, xValue) ?? 0])
            .range([0, iWidth])
            .nice();

        const extent = [0, 10]
        // const extent = d3.extent(data, yValue).reverse() 

        yScale = d3
            .scaleLinear()
            .domain(extent)
            .range([0, iHeight])
            .nice();

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("id", "svg");

        const yAxis = d3.axisLeft(yScale).tickSize(-iWidth).tickPadding(10);

        const xAxis = d3.axisBottom(xScale).tickSize(-iHeight).tickPadding(10);

        let yAxisGroup = g.append("g").call(yAxis).attr("id", "yaxis");
        yAxisGroup
            .append("text")
            .attr("font-size", "2em")
            .attr("transform", "rotate(-90)")
            .attr("x", -iHeight / 2)
            .attr("y", -50)
            .attr("fill", "#333333")
            .text(yAxisLabel)
            .attr("text-anchor", "middle");
        yAxisGroup.selectAll(".domain").remove();

        let xAxisGroup = g
            .append("g")
            .call(xAxis)
            .attr("transform", `translate(0, ${iHeight})`)
            .attr("id", "xaxis");
        xAxisGroup
            .append("text")
            .attr("font-size", "2em")
            .attr("y", 60)
            .attr("x", iWidth / 2)
            .attr("fill", "#333333")
            .text(xAxisLabel);
        xAxisGroup.selectAll(".domain").remove();
    };

    const renderUpdate = (seq: DataProps[]) => {

        console.log(seq)
        const g = d3.select("#svg");

        let circleUpdates = g.selectAll("circle").data(seq, (d: any) => d["地区"]);

        const circleEnter = circleUpdates
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(xValue(d)))
            .attr("cy", (d) => yScale(yValue(d)))
            .attr("r", 10)
            .attr("fill", (d) => color[d["地区"] ?? ""])
            .attr("opacity", 0.8);

        circleUpdates
            // https://www.cnblogs.com/xiaoxu-xmy/p/13762730.html
            // .merge(circleEnter)
            .merge(d3.selectAll("circle"))
            .transition()
            .ease(d3.easeLinear)
            .duration(aduration)
            .attr("cx", (d) => xScale(xValue(d)))
            .attr("cy", (d) => yScale(yValue(d)));
    };

    const init = () => {
        d3.csv("./hubeinxt.csv").then(
            // (data) => {
            //     console.log(data)
            // }

            (data: DataProps[]) => {
                
                if (data === undefined) {
                    return
                }
                data = data.filter((d) => d["地区"] !== "总计");
                data.forEach((d) => {
                    d["确诊人数"] = +(d["确诊人数"] ?? 0)
                    d["新增确诊"] = +(d["新增确诊"] ?? 0)
                    if (d["新增确诊"] < 0) {
                        d["新增确诊"] = 0
                    }
                });
                
                allDates = Array.from(new Set(data.map((d) => d["日期"])));
                
                allDates = allDates.sort((a: number, b: number) => {
                    //@ts-ignore
                    return new Date(a) - new Date(b);
                });
                
                sequantial = [];
                allDates.forEach(() => {
                    sequantial.push([]);
                });
                data.forEach((d) => {
                    // @ts-ignore
                    sequantial[allDates.indexOf(d["日期"])].push(d);
                });
                
                renderInit(data);

                let c = 0;
                let timer = setInterval(() => {
                    if (c >= allDates.length) {
                        clearInterval(timer);
                    } else {
                        renderUpdate(sequantial[c]);
                        c = c + 1;
                    }
                }, aduration);
            }
        );
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
        <div id="PlotCanvas" style={styleText} > </div>
    </>)
}

export default PlotCanvas;















