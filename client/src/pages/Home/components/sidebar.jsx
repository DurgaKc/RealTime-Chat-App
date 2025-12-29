import React, { useState } from 'react'
import Search from './search'

const Sidebar = () => {
  const[searchKey, setSearchKey] = useState('');
  return (
    <div>
{/* search */}
  <Search 
  searchKey={searchKey}  
  setSearchKey={setSearchKey}>
    
  </Search>

    </div>
  )
}

export default Sidebar