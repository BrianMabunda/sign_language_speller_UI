import React from 'react'
import "../styles/Header.css"

export default function Header() {
  return (
    <div className="headerContainer">

        <div className='headerTitle'>

            <h1 className='projectName'>SIGN LANGUAGE RECOGNITION</h1>

            <h2 className='projectSubName'>DASHBOARD</h2>

            <div class="scan-line-container">

                <div class="scan-line-beam"></div>
                
            </div>
        </div>


      
    </div>
  )
}
