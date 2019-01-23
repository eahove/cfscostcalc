import React from 'react';
import TuitionPlot from './plot-tuition';
import IncomeList from './incomelist';
import {model3, stepModel, model4, MODEL3, STEPMODEL, MODEL4} from './models';

const minPrekTuition = 3500
const minTuition = 1600

export default class TuitionBasic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      totalIncome: 0,
      pre2019Family: false,
      students: [{name: 'Student Name', preK: false, tuition: 1600, key: 0}],
      nextKey: 1,
    }
  }

  updateIncome(income){
    if (income !== this.state.totalIncome){
      const newState = Object.assign({}, this.state)
      newState.totalIncome = income
      // update tuitions
      newState.students = this.updateTuitions(newState)
      this.setState(newState)
    }
  }

  addStudent(){
    if (this.state.students.length < 3){
      const newState = Object.assign({}, this.state)
      newState.students.push({
        name: 'Student Name',
        preK: false,
        tuition: calcTuition(false, 0, newState.pre2019Family, true),
        key: newState.nextKey})
      // update tuitions
      newState.students = this.updateTuitions(newState)
      newState.nextKey += 1
      this.setState(newState)
    }
  }

  removeStudent(key){
    if (this.state.students.length > 1){
      const newState = Object.assign({}, this.state)
      const index = newState.students.findIndex((s)=>s.key === key)
      newState.students.splice(index, 1)
      // update tuitions
      newState.students = this.updateTuitions(newState)
      this.setState(newState)
    }
  }

  setStudentName(name, key){
    const newState = Object.assign({}, this.state)
    const index = newState.students.findIndex((s)=>s.key === key)
    newState.students[index].name = name
    this.setState(newState)
  }

  toggleStudentPreK(key){
    const newState = Object.assign({}, this.state)
    const index = newState.students.findIndex((s)=>s.key === key)
    newState.students[index].preK = !newState.students[index].preK
    // update tuitions
    newState.students = this.updateTuitions(newState)
    this.setState(newState)
  }

  updateTuitions(newState){
    // update tuitions on newState.student and return student array
    const students = []
    // if there is a non-prek student in the array
    // then only a non-prek student can be primary
    // otherwise a prek student can be primary
    let primary = newState.students.findIndex((s) => !s.preK)
    if (primary === -1){
      primary = 0
    }
    for (let i = 0; i < newState.students.length; i++){
      const sibling = i !== primary
      newState.students[i].tuition = calcTuition(
        newState.students[i].preK, newState.totalIncome, newState.pre2019Family, sibling)
    }
    return newState.students
  }

  togglePre2019Family(){
    const newState = Object.assign({}, this.state)
    newState.pre2019Family = !newState.pre2019Family
    // update tuitions
    newState.students = this.updateTuitions(newState)
    this.setState(newState)
  }

  renderStudentList(){
    const studentList = []
    let className = 'cfs-input-div'
    if (this.state.students.length == 1) {
      className = 'cfs-input-div cfs-disable-x'
    }
    for (let student of this.state.students){
      const id = 'cfs-checkbox-' + student.key
      
      studentList.push(
        <div key={student.key}>
          <div className={className} id={this.id}>
            <div>
              <i className={"fas fa-times-circle cfs-button-x"}
                onClick={() => this.removeStudent(student.key)}></i>
            </div>
            <div className={'cfs-input-container'}>
              <input type='text' value={student.name} className={'cfs-input'}
                onChange={(e) => this.setStudentName(e.target.value, student.key)} />
              <input type='checkbox' 
                id={id}
                onClick={()=>this.toggleStudentPreK(student.key)}
                checked={student.preK} />
              <label htmlFor={id}>{'Pre-K'}</label>
              <div className={'cfs-student-tuition'}>
                {'Tuition: $' + formatMoney(student.tuition)}
              </div>
            </div>
          </div>
        </div>)
    }
    let addStudent = <div className={'cfs-income-list-add-income'} 
      onClick={() => this.addStudent()}>
        <i className={"far fa-plus-square"}></i> {'student'}
      </div>
    if (this.state.students.length === 3){
      addStudent = null
    }
    return(
      <div>
        {studentList}
        {addStudent}
      </div>
    )
  }

  render(){
    const studentList = this.renderStudentList()
    let totalTuition = 0
    for (let student of this.state.students){
      totalTuition += student.tuition
    }

    return(
      <div>
        <h2>Estimate Tuition for 2019-2020</h2>
      <div className='cfs-basic-container'>
        
        <div className={'cfs-list-container'}>
          <div className={'cfs-list-container-title'}>{'Income Sources (2019-2020)'}</div>
          <IncomeList callback={(i) => this.updateIncome(i)} />
          <div className={'cfs-income-list-total-income'}>
            {'Total Income: $' + formatMoney(this.state.totalIncome)}
          </div>
          <div>
            <input type='checkbox' id='cfs-pre2019' 
              onClick={()=>this.togglePre2019Family()} value={this.state.pre2019Family}/>
            <label htmlFor='cfs-pre2019'>{'Family enrolled prior to Jan 2019'}</label>
          </div>
        </div>
        <div className={'cfs-list-container'}>
          <div className={'cfs-list-container-title'}>{'Students'}</div>
          {studentList}
        </div>
        <div className={'cfs-list-container'}>
          <div className={'cfs-list-container-title'}>{'Tuition Estimate (2019-2020)'}</div>
          <div className={'cfs-basic-tuition'}>
            {'Total Tuition: $' + formatMoney(totalTuition)}
          </div>
          <div>
            {'10 monthly payments: $' + formatMoney(totalTuition / 10)}
          </div>
        </div>
      </div>
      </div>
    )
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
}

function calcTuition(preK, income, pre2019Family, sibling){
  let tuition = model4(income)
  
  // set minimum tuition
  let min = minTuition
  if (preK){
    min = minPrekTuition
  }

  // set rate for pre-2019 sibling discount
  if (sibling) {
    let rate = 0.65
    if (pre2019Family){
      rate = 0.5
    }
    tuition = tuition * rate
  }
  
  if (tuition < min){
    tuition = min
  }

  return tuition
}