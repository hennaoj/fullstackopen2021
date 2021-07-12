const filterReducer = (state= '', action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return action.filter
      default:
        return state
    }
  }
  
  export const filterChange = filter => {
    //changes the filter in the store to a string received as a parameter
      return {
          type: 'SET_FILTER',
          filter,
      }
  }
  
  export default filterReducer