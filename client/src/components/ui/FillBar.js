import React, { useState, useEffect } from 'react'

const FillBar = (props) => {
  const [bgColor, setBgColor] = useState('#fff')
  useEffect(() => {
    if (props.lowThreshold && props.percentNumber < props.lowThreshold) {
      setBgColor('rgba(185, 28, 28, 1)')
    } else if (
      props.midThreshold &&
      props.percentNumber > props.lowThreshold &&
      props.percentNumber < props.midThreshold
    ) {
      setBgColor('rgba(252, 211, 77, 1)')
    } else {
      setBgColor('rgba(16, 185, 129, 1)')
    }
  }, [props])

  return (
    <div className="w-full h-4 border border-gray-300 rounded-lg bg-white shadow-sm">
      <div
        id="inner-bar"
        style={{
          height: 'calc(1rem - 2px)',
          width: `${props.percentNumber}%`,
          backgroundColor: bgColor,
        }}
        className="inner-bar rounded-lg"
      ></div>
    </div>
  )
}

export default FillBar
