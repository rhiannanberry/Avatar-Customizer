import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

interface RadioProps {
    children?: JSX.Element[] | JSX.Element | null;
    color: string;
    onClickCallback: Function;
    selected: boolean;
    setTitle: boolean;
    className?: string;
    value?: string | number;
    label?: string;
}

export default class Radio extends Component {
    props: RadioProps;
    value: string | number;

    static propTypes = {
        color: PropTypes.string,
        onClickCallback: PropTypes.func,
        selected: PropTypes.bool,
        setTitle: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        className: PropTypes.string,
    };

    static defaultProps = {
        color: '#b8b8b8',
        selected: false,
        setTitle: false,
    };

    constructor(props: RadioProps) {
        super(props);

        this.value = this.props.value != null ? this.props.value : this.props.color;
        this.onClickValue = this.onClickValue.bind(this);
    }

    onClickValue(): void {
        this.props.onClickCallback(this.value);
        //only send back up if SUCCESSFUL for texture upload attempts
    }

    render(): JSX.Element {
        const swatchStyle = {
            backgroundColor: this.props.color,
            boxShadow: this.props.selected ? `0 0 6px 2px ${this.props.color}` : null,
        };

        const classNames = `swatch ${this.props.className}`;
        return (
            <span
                className={classNames}
                onClick={this.onClickValue}
                title={this.props.setTitle ? (this.value as string) : null}
                tabIndex={0}
            >
                <div style={swatchStyle} className="inner">
                    {this.props.children}
                </div>
            </span>
        );
    }
}
