import React from 'react'

import { CustomPicker } from 'react-color'
import { Hue, Saturation, Swatch } from 'react-color/lib/components/common'
import color from 'react-color/lib/helpers/color'

export const ColorPicker = ({ hsl, hsv, colors, onChange }) => {
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
      //background: hex,
      borderRadius: 4
    },
  }
  const uh = (t) => {
    return t;
  }

  const uhh = (e) => {
    onChange(e)
  }
  return (
    <div>
      <div style={styles.customContainer}>
        <div style={styles.sliders}>

          <div style={ styles.hue }>
            <Hue
              hsl={ hsl } onChange={ uhh } />
          </div>
          <div style={ styles.saturation }>
            <Saturation 
              hsl={ hsl }
              hsv={ hsv }
              color={color}
              onChange={ uhh }/>
          </div>

        </div>
        <div style={ styles.swatch }>

        </div>
      </div>
      <div>
        <PresetColors colors={ colors } onChange={onChange}/>
      </div>
      
    </div>
  )
}

const PresetColors = ({ colors, onChange = () => {}, onSwatchHover }) => {
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
  const handleChange = (hexcode, e) => {
    console.log(hexcode)
    color.isValidHex(hexcode) && onChange({
      hex: hexcode,
      source:'hex'
    }, e)
  }

  return (
    <div style={styles.swatchContainer}>
      {colors.map((c,i) => {
        var swatchStyle = {...styles.swatch};
        swatchStyle.marginLeft = i === 0 ? '0' : swatchStyle.marginLeft;

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
