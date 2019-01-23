import React from 'react';
import ValueSlider from './valueslider';
import TuitionPlot from './plot-tuition';
import IncomeList from './incomelist';
import {model3, stepModel, model4, MODEL3, STEPMODEL, MODEL4} from './models';

// Ideas: 
//  - plot sliding scale function and show current point on it
//  - save multiple points
//  - add min/max for income values
//  - show cost by different payment options (year, monthly, quarterly)
//  - input components let you enter a specific value
//  - input components let you click and drag left or right to increase/decrease value

export default class Advanced extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pointIncomeList: [0, 0, 0],
      pointLabelList: ['Last Year', 'Next Year', 'In Two Years'],
      pointModelList: [STEPMODEL, MODEL4, MODEL3]
    }

    this.colors = [
      'rgb(127,201,127)',
      'rgb(190,174,212)',
      'rgb(253,192,134)',
      'rgb(255,255,153)',
      'rgb(56,108,176)'
      ]
  }

  addPoint() {
    if (this.state.pointIncomeList.length < 5){
      const newState = Object.assign({}, this.state)
      newState.pointIncomeList.push(0)
      newState.pointLabelList.push('label')
      newState.pointModelList.push(MODEL4)
      this.setState(newState)
    }
  }

  deletePoint(index) {
    const newState = Object.assign({}, this.state)
    newState.pointIncomeList = newState.pointIncomeList.slice(0, index) + newState.pointIncomeList.slice(index+1)
    newState.pointLabelList = newState.pointLabelList.slice(0, index) + newState.pointLabelList.slice(index+1)
    newState.pointModelList = newState.pointModelList.slice(0, index) + newState.pointModelList.slice(index+1)
    this.setState(newState)
  }

  setIncome(index, income){
    const newState = Object.assign({}, this.state)
    newState.pointIncomeList[index] = income
    this.setState(newState)
  }

  setLabel(index, label){
    const newState = Object.assign({}, this.state)
    newState.pointLabelList[index] = label
    this.setState(newState)
  }

  setModel(index, model){
    const newState = Object.assign({}, this.state)
    newState.pointModelList[index] = model
    this.setState(newState)
  }

  getModelFunc(model){
    if (model === STEPMODEL){
      return stepModel
    } else if (model === MODEL3) {
      return model3
    } else if (model === MODEL4) {
      return model4
    }
  }

  renderPoint(i) {
    const optlist = [STEPMODEL, MODEL4, MODEL3].map(
      (model) => {
        return <option value={model}>{model}</option>
      })
    const modelfunc = this.getModelFunc(this.state.pointModelList[i])
    const total = this.state.pointIncomeList[i]
    const adjusted = modelfunc(total)
    const fmtTotal = formatMoney(total)
    const fmtAdjusted = formatMoney(adjusted)
    return(
      <div className='cfs-income-list-container'>
        <input type='text' 
          className='cfs-income-list-label'
          value={this.state.pointLabelList[i]} 
          onChange={(e) => this.setLabel(i, e.target.value)}/>
        <select onChange={(e)=>this.setModel(i, e.target.value)} value={this.state.pointModelList[i]}>
          {optlist}
        </select>
        <IncomeList id={'cfs_imcome_list_' + i}
          callback={(income) => this.setIncome(i, income)} />
        <div>
          <div className={'cfs-income-list-total-income'}>
            {'Total: $' + fmtTotal}
          </div>
          <div className={'cfs-income-list-adjusted-tuition'}>
            {'Tuition: $' + fmtAdjusted}
          </div>
          </div>
      </div>
      )
  }

  renderAddPoint() {
    return(
      <div className={'cfs-income-list-container'} onClick={() => this.addPoint()}>
        <div className={'cfs-add-income-container'}>
        <i className={"fas fa-plus-square cfs-add-income-point"}></i>
        </div>
      </div>
    )
  }


  render() {
    // points at which to estimate tuition
    const pointList = []
    for (let i of this.state.pointIncomeList.keys()) {
      pointList.push(this.renderPoint(i))
    }

    if (pointList.length < 5) {
      pointList.push(this.renderAddPoint())
    }

    // sort points to be plotted by year/model
    const prevYearPoints = []
    const nextYearPoints = []
    const twoYearPoints = []
    for (let i of this.state.pointModelList.keys()) {
      if (this.state.pointModelList[i] == STEPMODEL) {
        prevYearPoints.push({
          income: this.state.pointIncomeList[i],
          color: this.colors[i],
          name: this.state.pointLabelList[i]
        })
      } else if (this.state.pointModelList[i] == MODEL4) {
        nextYearPoints.push({
          income: this.state.pointIncomeList[i],
          color: this.colors[i],
          name: this.state.pointLabelList[i]
        })
      } else {
        twoYearPoints.push({
          income: this.state.pointIncomeList[i],
          color: this.colors[i],
          name: this.state.pointLabelList[i]
        })
      }
    }

    const prevYearPlot = <TuitionPlot
      width={300}
      height={300}
      valueList={prevYearPoints}
      linefunc={(i) => stepModel(i)}
      title={'Step Scale'}
      />
    const nextYearPlot = <TuitionPlot
      width={300}
      height={300}
      valueList={nextYearPoints}
      linefunc={(i) => model4(i)}
      title={'Transitional Scale'}
      />
    const twoYearPlot = <TuitionPlot
      width={300}
      height={300}
      valueList={twoYearPoints}
      linefunc={(i) => model3(i)}
      title={'Smooth Scale'}
      />

    return (
      <div id="app">
        <h2>{'Income Points'}</h2>
        <div className={'cfs-income-list-grid-wrapper'}>
          {pointList}
        </div>

        <div className={'cfs-plot-grid-wrapper'}>
          {prevYearPlot}
          {nextYearPlot}
          {twoYearPlot}
        </div>
      </div>
    );
  }
}

function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};