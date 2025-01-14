import React, { useState } from 'react'
import ProfileInfo from '../cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../searchBar/SearchBar'

const Navbar = ({userInfo ,  onSearchNote , handleClearSearch}) => {
  const [searchQuery,setSearchQuery] = useState("")
  const navigate = useNavigate()
  
  const onLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h1 className='text-xl  font-bold text-black py-2'>Notes</h1>
        <SearchBar 
        value={searchQuery}
        onChange={({target}) => {
        setSearchQuery(target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />
        <ProfileInfo onLogout={onLogout} userInfo={userInfo}/>
    </div>
  )
}

export default Navbar