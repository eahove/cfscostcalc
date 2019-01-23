import React from 'react';

export default class ValueSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }

    this.callback = props.callback
    this.delCallback = props.delCallback
    this.label = props.label
    this.id = props.id
  }

  handleValueChange(value){
    if (value !== this.state.value){
      // TODO: validate inputs

      // update callback
      this.callback(value)

      // update internal state
      const newState = Object.assign({}, this.state)
      newState.value = value
      this.setState(newState)
    }
  }

  render(){
    return(
      <div className={'cfs-input-div'} id={this.id}>
        <div>
          <i className={"fas fa-times-circle cfs-button-x"}
            onClick={() => this.delCallback()}></i>
        </div>
        <div className={'cfs-input-container'}>
          <label htmlFor={this.id} className={'cfs-input-label'}>{this.label + " : "}</label>
          <input
            type={'text'}
            className={'cfs-input'}
            value={this.state.value}
            id={this.id}
            onChange={(e) => this.handleValueChange(e.target.value)}
            />
        </div>
      </div>
    )
  }
}