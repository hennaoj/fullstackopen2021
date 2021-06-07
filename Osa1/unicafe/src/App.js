import React, { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
        {props.text}
    </button>
  )
}

const Statistics = (props) => {
  var sum = props.good*1+props.bad*(-1) //laskee arvostelujen summan, kun good=1 ja bad=-1 (neutral=0)
  var total = (props.good+props.neutral+props.bad) //laskee annetujen arvostelujen yhteismäärän

  //jos arvosteluja ei ole, ei näytetä statistiikkaa
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }  

  //jos arvosteluja on, näytetään statistiikka
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' value={props.good} />
          <StatisticLine text='neutral' value={props.neutral} />
          <StatisticLine text='bad' value={props.bad} />
          <StatisticLine text='all' value={total} />
          <StatisticLine text='average' value={sum/total} />
          <StatisticLine text='positive' value={100*props.good/total} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticLine = (props) => {


  //laittaa %-merkin positiivisten arvostelujen prosenttiosuuden perään
  if (props.text === 'positive') {
    return (
      <tr>
        <td>{props.text} {props.value} %</td>
      </tr>
    )
    }
  return (
    <tr>
      <td>{props.text} {props.value}</td>
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text='good' handleClick={() => setGood(good+1)} />
      <Button text='neutral' handleClick={() => setNeutral(neutral+1)} />
      <Button text='bad' handleClick={() => setBad(bad+1)} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App