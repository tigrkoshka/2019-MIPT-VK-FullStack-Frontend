import * as d3 from 'd3'

export type Margin = {
  top: number
  right: number
  bottom: number
  left: number
}

export type GraphData = {
  date: Date
  value: number
}

export type DailyRecord = {
  graph: GraphData
  state: string
}

export type UsefulData = {
  dateRange: Date[]
  data: { [key: string]: GraphData[] }
  maxCases: number
}

export type AxisCalc = {
  xCalc: d3.ScaleTime<number, number>
  yCalc: d3.ScaleLinear<number, number>
}

export type Axis = {
  xAxis: (g: any) => any
  yAxis: (g: any) => any
}

export type Size = {
  height: number
  width: number
}

export type D3Short = d3.Selection<any, any, any, any> // более точно  не удаётся задать
