import React, { useState, useEffect } from 'react'
import personService from './services/persons.js'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notif">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Person = ({person, deleteNumber}) => {
  //Person-komponentti huolehtii yksittäisen henkilön tietojen esittämisen
  return (
    <div>
    {person.name} {person.number}  <button onClick={deleteNumber}> delete </button>
    </div>
  )
}

const Filter = (props) => {
  //Filter-komponentti sisältää fillteröintilomakkeen, jonka
  //inputin ja filterNames-funktion avulla näytettävät nimet suodatetaan
  return (
    <form onSubmit={props.filterNames}>
      <div>
        filter shown with <input value={props.filter} onChange={props.handleFilterChange}/>
        <button type='submit'>filter</button>
      </div>
    </form>
  )
}

const Form = (props) => {
  //Form-komponentti sisältää uuden henkilön nimen 
  //ja numeron lisäämiseen käytetyn lomakkeen
  return (
    <div>
      <form onSubmit={props.addName}>
        <div>
          name: <input value={props.name} onChange={props.nameChange}/>
        </div>
        <div>
          number: <input value={props.number} onChange={props.numberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Phonebook = (props) => {
  //Phonebook-komponetti esittää koko puhelinluettelon map:in ja 
  //Perosn-komponentin avulla
  return (
    <div>
      {props.showPersons.map(person =>
        <Person key={person.id} person={person} deleteNumber={() => props.deleteNumber(person.id, person.name)}/>
      )}
    </div>
  )
}

const App = () => {
  //alustetaan tyhjät taulukot
  const [ persons, setPersons] = useState([])
  const [ showPersons, setShowPersons ] = useState([])

  //haetaan data puhelinluetteloon palvelimelta
  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
        setShowPersons(initialPersons)
      })
  }, [] )

  //alustetaan syötteet
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ notifMessage, setNotifMessage ] = useState(null)

  const addName = (event) => {
    //funktio lisää lomakkeella syötetyn nimen ja/tai numeron puhelinluetteloon
    event.preventDefault()

    //tarkistetaan, onko lisättävä nimi jo luettelossa
    if (persons.some(person => person.name === newName)) {

      //varmistetaan käyttäjältä, halutaanko numero muuttaa
      if (window.confirm(`${newName} is already added to phonebook,\
 would you like to replace the old number with a new one?`)) {

        const person = persons.find(n => n.name === newName)
        const id = person.id
        const changedPerson = {name: newName, number: newNumber}

        personService
          .update(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setShowPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNotifMessage('Changed  the number of ' + newName)
            setTimeout(() => {
              setNotifMessage(null)
            }, 4000)
          })
          .catch(error => {
            setErrorMessage(person.name + ' has already been deleted from the server')
            setTimeout(() => {
              setErrorMessage(null)
            }, 4000)
          })
      }
    }

    //jos nimi ei ole luettelossa, lisätään se palvelimelle
    else {
      personService
        .create({name: newName, number: newNumber})
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setShowPersons(persons.concat(returnedPerson))
          setNotifMessage('Added ' + newName) //ilmoitetaan onnistuneesta lisäyksestä käyttäjälle
          setTimeout(() => {
            setNotifMessage(null)
          }, 4000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
        })
    }
    setNewName('')
    setNewNumber('')
    setFilter('')
  }


  const deleteNumber = (id, name) => {
    //funktion avulla poistetaan tietty yhteystieto puhelinluettelosta

    //varmistetaan käyttäjältä, että yhteystieto halutaan poistaa
    if (window.confirm('Delete ' + name + '?')) {
      personService
        .deleteById(id)
        .then(returned => {
          console.log(returned)
          setNotifMessage('Deleted ' + name) //ilmoitetaan onnistuneesta poistosta
          setTimeout(() => {
            setNotifMessage(null)
          }, 4000)
          setPersons(persons.filter(n => n.id !== id)) //poistetaan yhteystieto myös listoilta persons ja showPersons
          setShowPersons(persons.filter(n => n.id !== id))
        })
        .catch(error => {
          setErrorMessage(name + ' has already been deleted from the server') //näytetään virheviesti, jos yhteystieto on jo poistettu
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
        })
    }
  }

  const filterNames = (event) => {
    //funktio filtteröi nimet annetun merkkijonon perusteella

    event.preventDefault()
    var filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    setShowPersons(filtered)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} />
      <Error message={errorMessage} />
      <Filter filterNames={filterNames} filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new contact</h2>
      <Form name={newName} number={newNumber} nameChange={handleNameChange}
      numberChange={handleNumberChange} addName={addName}/>
      <h2>Numbers</h2>
      <Phonebook persons={persons} showPersons={showPersons} deleteNumber={deleteNumber}/>
    </div>
  )

}

export default App
