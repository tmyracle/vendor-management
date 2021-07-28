import React, { useEffect } from "react";
import "./fillbar.css"

const FillBar = (props) => {
  useEffect(() => {
    document.getElementById("inner-bar").style.width = `${props.percentNumber}%`
    if (props.lowThreshold && props.percentNumber < props.lowThreshold) {
      document.getElementById("inner-bar").style.backgroundColor = "rgba(185, 28, 28, 1)"
    } else if (props.midThreshold && props.percentNumber > props.lowThreshold && props.percentNumber < props.midThreshold) {
      document.getElementById("inner-bar").style.backgroundColor = "rgba(252, 211, 77, 1)"
    } else {
      document.getElementById("inner-bar").style.backgroundColor = "rgba(16, 185, 129, 1)"
    }
  }, [props])

  return (
    <div className="w-full h-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <div 
      id="inner-bar"
      className="inner-bar rounded-lg">
      </div>
    </div>
  )
}

export default FillBar;