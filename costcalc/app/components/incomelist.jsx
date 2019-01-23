import React from 'react';
import ValueSlider from './valueslider';

// implements an extensible list of inputs

export default class IncomeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      income: [0],
      keys: [0],
      nextKey: 1
    }

    this.callback = props.callback
    this.id = props.id
  }

  setIncome(key, value) {
    const newState = Object.assign({}, this.state)
    const index = newState.keys.indexOf(key)
    newState.income[index] = value
    this.setState(newState)
    const totalIncome = this.updateTotal()
    this.callback(totalIncome)
  }

  addIncome() {
    if (this.state.income.length < 6) {
      const newState = Object.assign({}, this.state)
      newState.income.push(0)
      newState.keys.push(newState.nextKey)
      newState.nextKey += 1
      this.setState(newState)
    }
  }

  delIncome(key) {
    if (this.state.income.length > 1) {
      const newState = Object.assign({}, this.state)
      const idx = newState.keys.indexOf(key)
      newState.income.splice(idx, 1)
      newState.keys.splice(idx, 1)
      this.setState(newState)
      const totalIncome = this.updateTotal()
      this.callback(totalIncome)
    }
  }

  updateTotal() {
    var totalIncome = 0.0
    for (const value of this.state.income.values()){
      if (!Number.isNaN(Number.parseFloat(value))) {
        totalIncome += Number.parseFloat(value)
      }
    }
    return totalIncome
  }

  render() {
    const incomeList = []
    for (let item of this.state.income.entries()) {
      const key = this.state.keys[item[0]]
      incomeList.push(this.labeledInput(item[1], key))
    }

    let addIncome = <div className={'cfs-income-list-add-income'} 
      onClick={() => this.addIncome()}>
        <i className={"far fa-plus-square"}></i> {'income source'}
      </div>
    if (this.state.income.length == 6){
      addIncome = null
    }

    let className = 'cfs-income-list'
    if (this.state.income.length == 1) {
      className = 'cfs-income-list cfs-disable-x'
    }

    return (
      <div id={this.id} className={className}>
        {incomeList}
        {addIncome}

      </div>
    )
  }

  // TODO: add validation highlighting
  labeledInput(value, key) {
    let inputClass = 'input-valid'
    if (Number.isNaN(Number.parseFloat(value))){
      inputClass = 'input-invalid'
    }
    return <div key={key}>
      <ValueSlider
        label={'Income ' + (key + 1)}
        value={value}
        id={key}
        callback={(x) => this.setIncome(key, x)}
        delCallback={()=>this.delIncome(key)}
        className={inputClass}
        />
      </div>
  }

}

// class labeledInput extends React.Component {

// }