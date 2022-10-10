import React, { Component } from 'react'
import './App.css';
import { Input, Select, Card } from 'antd';
import 'antd/dist/antd.min.css'

import axios from './API';
const { Search } = Input;
const { Option } = Select;

export default class App extends Component {
  state = {
    apikey:"jfx8iqPG1uJjLRsgXmUWbXD61MEdGwXj",
    cityData:[],
    weaDayData:[],
    weaNowData:[],
    url:"",
  }
 
  // get city code
  searchCity = (e) => { 
    // use encodeURI to prevent {} becomes %7B
    axios.get("locations/v1/search",{
      params: {
        q:e.target.value,
        apikey:encodeURI(this.state.apikey)
      }
    })
    .then((res) => {
      // use a filter to keep city only
      let newCityData = res.data.filter((item)=>{
        return item.Type === 'City'
      })
      // console.log(newCityData);
      // deep copy & replace the old data
      this.setState( {
        cityData : newCityData
      })
    })
    .catch( (err) =>{
      alert("please re-enter city")
      console.log(err);
    })
    // clear input area
    e.target.value = ""
   
  }

  // get weather of the city
  checkWeather = (value) => {
    let key = encodeURI(this.state.apikey)
    axios.get(`/forecasts/v1/daily/1day/${value}?apikey=${key}`)
    .then((res) => {
      // console.log(res);
      let newWeaData = res.data.DailyForecasts[0]
      this.setState({
        weaDayData : newWeaData
      })
    })
    axios.get(`/forecasts/v1/hourly/1hour/${value}?apikey=${key}`)
    .then((res) =>{
      // console.log(res);
      this.setState({
        weaNowData : res.data[0],
        url : `https://developer.accuweather.com/sites/default/files/${res.data[0].WeatherIcon}-s.png`
      })
    })
  }
  
  render() {
    const { cityData,weaDayData,weaNowData,url} = this.state
    return (
      <div>
        <h1 className='title'>1 day weather Check</h1>
        <Search className='searchInput' enterButton="Search" onPressEnter={ this.searchCity }  placeholder="input city name"/>
        <div className='choseCity'>
          please choose city:
          <div>
            <Select defaultValue="" style={{ width: 300 }}  onChange={ this.checkWeather }>
               {
                 cityData.map(items => {
                    return <Option value={ items.Key } key = { items.Key } >
                       { items.LocalizedName} ({ items.Country.EnglishName })
                    </Option>
                  })
                }
            </Select>
          </div>
        </div>
        { weaDayData.Date && weaNowData.DateTime ? 
        <Card title="the weather of your city is:">
          <div className='details'>
            <div className='textInfo'>
              <h2>{weaNowData.IconPhrase}</h2>
              <p>Now : {parseInt((weaNowData.Temperature.Value - 32)/1.8)} ℃</p>
            </div>
            <div className='Icon'>
              <img alt="" src={url}></img>
            </div>
          </div>
          <div className='downInfo'>
            <span>Minimum: {parseInt((weaDayData.Temperature.Minimum.Value - 32)/1.8)} ℃</span>
            <span>Maximum: {parseInt((weaDayData.Temperature.Maximum.Value - 32)/1.8)} ℃</span>
          </div>
        </Card> : <p className='pendingInfo'>Checking...</p>}
      </div>
    )
  }
}

