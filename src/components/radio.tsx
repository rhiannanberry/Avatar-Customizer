import React, { Component,  } from "react";
import * as PropTypes from "prop-types";

interface RadioProps {
    children: Object;
    color: string;
    onClickCallback: Function;
    selected: Boolean;
    setTitle: Boolean;
    value: string|number;
}

export default class Radio extends Component {
    props: RadioProps;
    value: string|number;

    static propTypes = {
        children: PropTypes.object,
        color: PropTypes.string,
        onClickCallback: PropTypes.func,
        selected: PropTypes.bool,
        setTitle: PropTypes.bool,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }

    static defaultProps = {
        // @ts-ignore
        children: null,
        color: "#b8b8b8",
        selected: false,
        setTitle: false,
        // @ts-ignore
        value: null
    }

    constructor(props: RadioProps) {
        super(props);

        this.value = this.props.value != null ? this.props.value : this.props.color;
        this.onClickValue = this.onClickValue.bind(this);
    }

    onClickValue() {
        this.props.onClickCallback(this.value);
        //only send back up if SUCCESSFUL for texture upload attempts
    }

    render() {
        var swatchStyle = {
            backgroundColor: this.props.color,
            boxShadow: this.props.selected ? `0 0 6px ${this.props.color}` : null
        };
        return (
            <span className="swatch" onClick={this.onClickValue} title={this.props.setTitle? this.value as string : null}>
                <div style={swatchStyle} className="inner">
                    {this.props.children}
                </div>
            </span>
        )
    }
}
