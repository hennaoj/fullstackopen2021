import React from 'react'




const Header = (props) => {
//luo otsikon
  return (
    <div>
      <h2>{props.course.name}</h2>
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.part.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = (props) => {
  var total = props.part.reduce(function(sum, part) {
    return sum + part.exercises
  },0)
  return (
    <p><b>total of {total} exercises</b></p>
  )
}


const Course = (props) => {
  return (
    <div>
      <Header  course={props.course}/>
      <Content part={props.course.parts} exercises={props.course.parts}/>
      <Total part={props.course.parts}/>
    </div>
  )
}

export default Course
