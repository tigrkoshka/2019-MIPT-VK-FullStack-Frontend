import * as d3 from 'd3'
import _ from 'lodash'
import React from 'react'

import initData from '../static/data.json'
import { Axis, AxisCalc, D3Short, DailyRecord, GraphData, Margin, Size, UsefulData } from '../types/types'

function sortByDate(a: DailyRecord, b: DailyRecord): number {
  return +a.graph.date - +b.graph.date
}

function manageData(): UsefulData {
  const usedData: DailyRecord[] = initData.map(
    ({ dateChecked, positive, state }): DailyRecord => ({
      graph: {
        date: new Date(dateChecked),
        value: positive,
      },
      state,
    }),
  )

  usedData.sort(sortByDate)
  const dateRange: Date[] = [usedData[0].graph.date, usedData[usedData.length - 1].graph.date]
  const maxCases: number = d3.max(usedData, (d: DailyRecord): number => d.graph.value)!

  const extendedData: { [x: string]: DailyRecord[] } = _.groupBy<DailyRecord>(
    usedData,
    (r: DailyRecord): string => r.state,
  )

  const data: { [x: string]: GraphData[] } = {}
  for (const [key, value] of Object.entries(extendedData)) {
    data[key] = value.map((gr: DailyRecord): GraphData => gr.graph)
  }

  return { dateRange, data, maxCases }
}

function getAxisCalculations(dateRange: Date[], maxCases: number, size: Size, margin: Margin): AxisCalc {
  const x: d3.ScaleTime<number, number> = d3
    .scaleUtc()
    .domain(dateRange)
    .range([margin.left, size.width - margin.right])

  const y: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .domain([0, maxCases])
    .nice()
    .range([size.height - margin.bottom, margin.top])

  return { xCalc: x, yCalc: y }
}

function getAxis(calc: AxisCalc, size: Size, margin: Margin): Axis {
  const xAxis: (g: D3Short) => D3Short = (g: D3Short): D3Short =>
    g.attr('transform', `translate(0,${size.height - margin.bottom})`).call(
      d3
        .axisBottom(calc.xCalc)
        .ticks(size.width / 100)
        .tickSizeOuter(0),
    )

  const yAxis: (g: D3Short) => D3Short = (g: D3Short): D3Short =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(calc.yCalc)
          .ticks(size.width / 100)
          .tickSizeOuter(0),
      )
      .call((g: D3Short): D3Short => g.select('.domain').remove())
      .call(
        (g: D3Short): D3Short =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .text('Number of positive Covid-19 tests in the US by states'),
      )

  return { xAxis, yAxis }
}

class App extends React.Component {
  margin: Margin = { top: 20, right: 30, bottom: 30, left: 50 }
  ref!: SVGSVGElement
  windowSize: Size = { height: document.documentElement.clientHeight, width: document.documentElement.clientWidth }

  componentDidMount(): void {
    const { dateRange, data, maxCases }: UsefulData = manageData()

    const { xCalc, yCalc }: AxisCalc = getAxisCalculations(dateRange, maxCases, this.windowSize, this.margin)

    const { xAxis, yAxis }: Axis = getAxis({ xCalc, yCalc }, this.windowSize, this.margin)

    const line: d3.Line<GraphData> = d3
      .line<GraphData>()
      .defined((d: GraphData): boolean => d !== undefined)
      .x((d: GraphData): number => xCalc(d.date))
      .y((d: GraphData): number => yCalc(d.value))

    const svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3
      .select(this.ref)
      .attr('viewBox', `0, 0, ${this.windowSize.width}, ${this.windowSize.height}`)

    svg.append('g').call(xAxis)

    svg.append('g').call(yAxis)

    for (const value of Object.values(data)) {
      if (value.length > 45) {
        svg
          .append('path')
          .datum(value)
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', line)
      }
    }
  }

  render(): React.ReactElement {
    return (
      <svg
        className="container"
        ref={(ref: SVGSVGElement): SVGSVGElement => (this.ref = ref)}
        height="100%"
        width="100%"
      />
    )
  }
}

export default App
