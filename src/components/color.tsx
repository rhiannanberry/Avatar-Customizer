import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { CustomPicker, ColorResult } from 'react-color';
import tinycolor from 'tinycolor2';

import { Hue, Saturation } from 'react-color/lib/components/common';

interface MyColorPickerProps {
    color: string;
    onChange: Function;
}

class MyColorPicker extends Component {
    props: MyColorPickerProps;
    state = {
        hsl: { h: 0, s: 0, l: 0 },
        hsv: { h: 0, s: 0, v: 0 },
        hex: 'aaaaaa',
    };

    static propTypes = {
        color: PropTypes.string,
        onChange: PropTypes.func,
    };

    constructor(props: MyColorPickerProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(): void {
        const color = tinycolor(this.props.color);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });
    }

    // e actually takes the form of hsl or hsv exclusively. do not believe the lies!!
    onChange(c: ColorResult): void {
        // @ts-ignore
        const color = tinycolor(c);
        this.setState({
            hsv: color.toHsv(),
            hsl: color.toHsl(),
            hex: color.toHex(),
        });

        this.props.onChange(color.toHex());
    }

    render(): JSX.Element {
        const style = {
            width: '100%',
            position: 'relative',
            display: 'block',
            height: '60px',
        } as React.CSSProperties;

        const saturationStyle = {
            height: '80%',
            position: 'relative',
        } as React.CSSProperties;

        const hueStyle = {
            height: '20%',
            position: 'relative',
        } as React.CSSProperties;

        return (
            <span style={style}>
                <div style={saturationStyle}>
                    <Saturation
                        // @ts-ignore
                        hsl={this.state.hsl}
                        hsv={this.state.hsv}
                        onChange={this.onChange}
                    />
                </div>
                <div style={hueStyle}>
                    <Hue
                        // @ts-ignore
                        hsl={this.state.hsl}
                        onChange={this.onChange}
                    />
                </div>
            </span>
        );
    }
}

//@ts-ignore
export default CustomPicker(MyColorPicker);
