import React from 'react'
import "../styles/ContentBody.css"
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

var height=window.innerHeight;
var width=window.innerWidth;




export default function ContentBody() {
  return (
    <div className="ContentBodyContainer">

        <LeftContainer />
        <RightContainer />  

    </div>
  )
}
