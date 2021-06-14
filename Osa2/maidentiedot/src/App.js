import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country, setSearch}) => {
  //Country-komponentti palauttaa maan nimen ja napin,
  //jota painamalla maan voi valita

  const showCountry = () => {
    //nappia painaessa asetetaan search-muuttujan 
    //tilaksi kyseisen maan nimi, jolloin sen tiedot tulevat näkyviin
    //suodatuksen ansiosta

    setSearch(country.name)
    //console.log(search)
  }

  return (
    <div>
      {country.name} <button onClick={showCountry}>show</button>
    </div>
  )
}


const Language = ({language}) =>  {
  //Language-komponentti luo listaelementin yksittäisestä kielestä
  return (
    <li>{language.name}</li>
  )
}

const Weather = ({country}) => {
  //Weather-komponentti hakee säätiedot valitun maan pääkaupungissa
  //ja sijoittaa ne weather-muuttujaan

  const city = country.capital
  const api_key = process.env.REACT_APP_API_KEY
  const [weather, setWeather] = useState({current: {temp_c: 0, condition: {icon: '', text: ''} , feelslike_c: 0, wind_kph: 0}})

  //talletetaan api-avain ja kaupungin nimi erilliseen listaan axiosia varten
  const params = {
    key: api_key,
    q: city
  }
  console.log(params)

  useEffect(() => {
    console.log('weather effect')
    axios
      .get('http://api.weatherapi.com/v1/current.json', {params})
      .then(response => {
        console.log('weather promise fulfilled')
        setWeather(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Weather in {city}</h2>
      <WeatherInfo weather={weather} />
    </div>
  )

}

const WeatherInfo = ({weather}) => {
  //WeatherInfo-komponentti huolehtii säätietojen näyttämisestä
  
  console.log(weather)
  return (
    <div>
      <img src={weather.current.condition.icon} width='100' alt={'weather'} />
      <p>Description: {weather.current.condition.text}</p>
      <p>Temperature: {weather.current.temp_c} Celsius</p>
      <p>Feels like: {weather.current.feelslike_c} Celsius</p>
      <p>Wind: {(weather.current.wind_kph*0.28).toFixed(2)} m/s</p>
    </div>
  )
}

const CountryInfo = ({country}) => {
  //CountryInfo-komponentti palauttaa yhden maan perustiedot; maan nimen, 
  //lipun, pääkaupungin, asukasluvun ja puhutut kielet

  //console.log(country.flag)
  return (
    <div>
      <h2>{country.name}</h2>
      <img src={country.flag} width='200' alt={country.flag} />
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language => //käydään kielet läpi map:in ja Language-komponentin avulla
          <Language key={language.name} language={language} />)}
      </ul>
      <Weather key={country.name} country={country} />
    </div>
  )
}

const Filter = (props) => {
  //Filter-komponentti hyödyntää filterCountries-funktiota maiden suodattamiseen
  //ja luo matching-taulukon maista, joiden nimet sopivat käyttäjän antamaan hakusanaan

  console.log('filtering')
  var matching = props.filterCountries()

  //jos sopivia maita on enemmän kuin 10, pyydetään tarkempaa/toista hakusanaa
  if (matching.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  //jos sopivia maita on enemmän kuin 1 (mutta vähemmän kuin 10), näytetään
  //lista maiden nimistä
  else if (matching.length > 1) {
    return (
      <div>
        {matching.map(country => 
          <Country key={country.name} country={country} setSearch={props.setSearch}/>)}
      </div>
    )
  }

  //jos sopivia maita ei ole, ilmoitetaan tästä
  else if (matching.length === 0) {
    return <p>No matches</p>
  }

  //jos sopivia maita on vain yksi, näytetään sen perustiedot
  if (matching.length === 1) {
    return (
      <div>
        <CountryInfo country={matching[0]}/>
      </div>
    )
  }

}

function App() {

  //alustukset
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  ///haetaaan maiden tiedot restcountries-rajapinnasta axiosin avulla
  //ja tallennetaan ne countries-taulukkoon
  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [] )

  //console.log(countries[0])

  console.log(countries)

  const handleSearchChange = (event) => {
    //päivittää search-muuttujan käyttäjän kirjoittaessa

    setSearch(event.target.value)
    //console.log(search)
  }

  const filterCountries = () => {
    //funktio suodattaa maat käyttäjän syöttämän merkkijonon avulla
    //ja palauttaa suodatukseen sopivat maat

    var matching = countries.filter(country => country.name.toLowerCase()
    .includes(search.toLowerCase()))
    //console.log(matching)
    return matching
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange}></input>
      <Filter filterCountries={filterCountries} search={search} setSearch={setSearch}/>
    </div>
  )
}

export default App;
