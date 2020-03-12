import React from 'react'

import { CustomPicker } from 'react-color'
import { Hue, Saturation, Swatch } from 'react-color/lib/components/common'
import * as COLOR from 'react-color/lib/helpers/color';


export const ColorPicker = ({ hex, hsl, hsv, colors, onChange, color}) => {
  const styles = {
    customContainer: {
      height: 50,
      width: 250,
      display: 'flex',
      alignItems: 'center',
      marginBottom: 8,
      position: 'relative'
    },
    sliders: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      height: '100%',
      marginRight: 8
    },
    hue: {
      height: 10,
      position: 'relative',
      marginBottom: 6,
    },
    saturation: {
      flexGrow: 1,
      position: 'relative',
    },
    swatch: {
      width: 50,
      height: 50,
      background: hex,
      borderRadius: 4
    },
  }

  const onClick = (e) => {
    disabled = e.disabled;
  }

  const customColorMenu = (e) => {
    return (<div style={styles.customContainer}>
      <div style={styles.sliders}>

        <div style={ styles.hue }>
          <Hue
            hsl={ hsl } onChange={ onChange } />
        </div>
        <div style={ styles.saturation }>
          <Saturation 
            hsl={ hsl }
            hsv={ hsv }
            //color={color}
            onChange={ onChange }/>
        </div>

      </div>
      <div style={ styles.swatch }>

      </div>
    </div>)
  }
  return (
    <div>
      {}
      <div>
        <PresetColors colors={ colors } onChange={ onChange } color={color}/>
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
