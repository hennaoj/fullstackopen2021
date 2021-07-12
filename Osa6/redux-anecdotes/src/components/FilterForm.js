import React from 'react'
import { connect } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const FilterForm = (props) => {
  //form for setting the filter

  const handleChange = (event) => {
    //handles filter change using the filterChange function
    event.preventDefault()
    props.filterChange(event.target.value)
  }
  const style = {
    marginBottom: 20
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default connect(null,{filterChange})(FilterForm)