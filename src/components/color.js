import React from 'react';
import { CustomPicker } from 'react-color';
import * as tinycolor from 'tinycolor2'

import { Hue, Saturation} from 'react-color/lib/components/common'


class MyColorPicker extends React.Component {
    state = {
        hsl: {
          h: 0,
          s: 0,
          l: 0
        },
        hsv: {
          h: 0,
          s: 0,
          v: 0
        },
        hex: 'aaaaaa'
      };
    componentDidMount() {
        const color = tinycolor(this.props.color);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });
    }
    render() {
        const style = {
            width: '50px',
            position: 'relative'
        }
        return <div style={style} >
            <Hue hsl={this.state.hsl} />
            <Saturation hsl={this.state.hsl} hsv={this.state.hsv} />
        </div>;
    }
}

export default CustomPicker(MyColorPicker);
