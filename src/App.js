import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import styles from './App.module.css'
import { useEffect, useState } from 'react'
import { fetchTopAlbums, fetchNewAlbums, fetchSongs } from './api/api'
import Section from './components/Section/Section.jsx'
import FilterSection from './components/FilterSection/FilterSection'

function App() {

  const [topAlbumSongs, setTopAlbumSongs] = useState([])
  const [newAlbumSongs, setNewAlbumSongs] = useState([])
  
  const [filteredDataValues, setFilteredDataValues] = useState([''])
  const [toggle, setToggle] = useState(false)
  const [value, setValue] = useState(0);

  const generateSongsData = (value) => {
    let songData = newAlbumSongs[0].songs;
    let key;
    if (value === 0) {
      setFilteredDataValues(songData)
      return;
    }
    else if (value === 1) {
      key = 'rock'
    }
    else if (value === 2) {
      key = 'pop'
    }
    else if (value === 3) {
      key = 'jazz'
    }
    else if (value === 4) {
      key = 'blues'
    }
    const data = songData.filter((item) => {
      return item.genre.key === key
    })
    setFilteredDataValues(data)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
    generateSongsData(newValue)
  }
  const handleToggle = () => {
    setToggle(!toggle)
  }

  const filteredData = (val) => {
    generateSongsData(val)
    // console.log(val + ' filteredData is called from app.js')
  }

  const generateTopAlbumSongs = async () => {
    try {
      const topAlbumSongs = await fetchTopAlbums()
      setTopAlbumSongs(topAlbumSongs)
    }
    catch (error) {
      console.log(error)
      return null
    }

  }
  const generateNewAlbumSongs = async () => {
    try {
      const newAlbumSongs = await fetchNewAlbums()
      setNewAlbumSongs(newAlbumSongs);
      // setFilteredDataValues(newAlbumSongs);
    }
    catch (error) {
      console.log(error)
      return null
    }
  }

  const generateFilterSongs = async () => {
    try {
      const newAlbumSongs = await fetchSongs()
      // setNewAlbumSongs(newAlbumSongs);
      setFilteredDataValues(newAlbumSongs);
    }
    catch (error) {
      console.log(error)
      return null
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
  }, [value])

  useEffect(() => {
    
    generateTopAlbumSongs();
    generateNewAlbumSongs();
    generateFilterSongs();
    // setFilteredDataValues(newAlbumSongs);

  }, [])
  
  
  return (
    <>
      <Navbar />
      <Hero />
      <div className={styles.sectionWrapper}>
        <Section type='album' title='Top Albums' data={topAlbumSongs} />
        <Section type='album' title='New Albums' data={newAlbumSongs} />
        <FilterSection data={newAlbumSongs} type='songFilter' title='Songs' filteredData={filteredData} filteredDataValues={filteredDataValues} value={value} handleChange={handleChange} handleToggle={handleToggle}/>
      </div>
    </>
  )
}

export default App