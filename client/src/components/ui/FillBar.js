import React, { useState, useEffect } from 'react'

const FillBar = (props) => {
  const [bgColor, setBgColor] = useState('#fff')
  useEffect(() => {
    if (props.lowThreshold && props.percentNumber < props.lowThreshold) {
      setBgColor('rgba(239, 68, 68, 1)') // Red
    } else if (
      props.midThreshold &&
      props.percentNumber > props.lowThreshold &&
      props.percentNumber < props.midThreshold
    ) {
      setBgColor('rgba(253, 230, 138, 1)') // Yellow
    } else {
      setBgColor('rgba(16, 185, 129, 1)') // Green
    }
  }, [props])

  return (
    <div className="w-full h-4 border border-gray-200 rounded-lg bg-white shadow-sm">
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
