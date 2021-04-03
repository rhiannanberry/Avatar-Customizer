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
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    
    componentDidMount() {
        const color = tinycolor(this.props.color);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });
    }

    //TODO:  Clean up and convert to TS. also rename

    onChange(e) {
        const color = tinycolor(e);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });

        this.props.onChange(color.toHex());
    }

    render() {
        const style = {
            width: '100%',
            position: 'relative',
            display: 'block',
            height: '60px'
        }
        const saturationStyle = {
            height: '80%',
            position: 'relative'
        }

        const hueStyle = {
            height: '20%',
            position: 'relative'
        }
        return <span style={style} >
            <div style={saturationStyle}>
                <Saturation hsl={this.state.hsl} hsv={this.state.hsv} onChange={this.onChange}/>
            </div>
            <div style={hueStyle}><Hue hsl={this.state.hsl} onChange={this.onChange}/></div>
        </span>;
    }
}

export default CustomPicker(MyColorPicker);
