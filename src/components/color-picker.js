import React from 'react'

import { CustomPicker } from 'react-color'
import { Hue, Saturation, Swatch } from 'react-color/lib/components/common'
import * as COLOR from 'react-color/lib/helpers/color';


export const ColorPicker = ({ hex, hsl, hsv, onChange, color, open, onClick}) => {


  return (
    <div className={"customContainer" + (open ? "" : " closed") } onClick={onClick}>


        <div className="hue">
          <Hue
            hsl={ hsl } onChange={ onChange } />
        </div>
        <div className="saturation">
          <Saturation 
            hsl={ hsl }
            hsv={ hsv }
            //color={color}
            onChange={ onChange }/>
        </div>

    </div>
  )
}

const PresetColors = ({ colors, onChange = () => {}, onSwatchHover, color}) => {
  const styles = {
    swatch: {
      width: '30px',
      height: '30px',
      float: 'left',
      borderRadius: '4px',
      marginLeft: '6px'
    },
    swatchContainer: {
      display: 'flex',

    }
  }

  var clr = null

  const handleChange = (hexcode, e) => {
    clr = hexcode;
    onChange({
      hex: hexcode,
      source:'hex'
    }, e)
  }


  return (
    <div style={styles.swatchContainer}>
      {colors.map((c,i) => {
        var swatchStyle = {...styles.swatch};
        swatchStyle.marginLeft = i === 0 ? '0' : swatchStyle.marginLeft;
        
        if (color.hex != undefined && color.hex.toLowerCase() == c.toLowerCase()) {
          swatchStyle.boxShadow= `0 0 4px ${c}`
        }

        return (
          <Swatch
            key={i}
            color={c}
            hex={c}
            style={swatchStyle}
            onClick={handleChange}
            focusStyle={{
              boxShadow: `0 0 4px ${c}`
            }}
          />
        )
      })}
    </div>
  )
}

export default CustomPicker(ColorPicker)
