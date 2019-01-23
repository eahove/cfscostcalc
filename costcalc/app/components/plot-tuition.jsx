import React from 'react';
import * as Plotly from 'plotly.js-dist';

export default class TuitionPlot extends React.Component{
  constructor(props) {
    super(props)
    this.linefunc = props.linefunc
    this.width = props.width || 400
    this.height = props.height || 400
    this.title = props.title || 'Scaled Tuition'
  }
  componentDidMount() {
    this.pi = new PlotlyInterface(
      this.el,
      this.width,
      this.height,
      this.linefunc,
      this.title)
    this.pi.initialize(this.props.valueList)
  }

  componentDidUpdate(){
    this.pi.update(this.props.valueList)
  }

  render() {
    return(
      <div>
        <div ref={(el) => this.el = el}></div>
      </div>
    )
  }
}

class PlotlyInterface{
  constructor(element, width, height, linefunc, title){
    this.el = element
    this.width = width
    this.height = height
    this.linefunc = linefunc
    this.title = title
    var n = 200
    const x_min = 0
    const x_max = 120000
    const x_delta = (x_max - x_min) / n
    var x = Array.from(Array(n + 1).keys()).map(i => i * x_delta)
    this.linetrace = {
      x: x, // 100 points in range 0 -> 120000 
      y: x.map(this.linefunc), // map this.linefunc, x
      mode: 'lines',
      name: 'Tuition Scale',
      type: 'scatter',
      line: {
        shape: 'linear',
        color: 'rgb(229, 229, 218)'
      } // try shape: 'spline'
    }
    this.layout = {
      title: this.title,
      width: this.width,
      height: this.height,
      showlegend: false,
      xaxis: {
        title: 'Scaled Tuition',
        fixedrange: true,
        zeroline: false,
        showgrid: false
      },
      yaxis: {
        title: 'Total Income',
        fixedrange: true,
        zeroline: false,
        showgrid: false
      }
    }
  }

  update(valueList) {
    const data = [this.linetrace]
    for (let v of valueList.values()) {
      var y = this.linefunc(v.income)
      data.push({
        x: [v.income],
        y: [y],
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: v.color,
          name: v.name,
          size: 12
        }
      })
    }
    Plotly.react(this.el, data, this.layout)
      // Plotly.animate(
      //   this.el,
      //   {
      //     data: [{x: [v], y: [y]}],
      //     traces: [1],
      //     layout: {}
      //    },
      //    {
      //     transition: {
      //       duration: 500,
      //       easing: 'cubic-in-out'
      //     },
      //     frame: { duration: 500 }
      //    })
  }

  initialize(valueList) {
    const data = [this.linetrace]
    for (let v of valueList.values()) {
      var y = this.linefunc(v.income)
      data.push({
        x: [v.income],
        y: [y],
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: v.color,
          name: v.name,
          size: 12
        }
      })
    }
    Plotly.newPlot(this.el, data, this.layout)
  }
}