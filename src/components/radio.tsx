import React, { Component, createRef, KeyboardEvent, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface RadioProps {
    children?: JSX.Element[] | JSX.Element | null;
    color: string;
    onClickCallback: Function;
    selected: boolean;
    setTitle: boolean;
    className?: string;
    icon?: string;
    faIcon?: IconDefinition;
    value?: string | number;
    label?: string;
    onMoveFocus?: Function;
    left?: RefObject<Radio>;
    right?: RefObject<Radio>;
}

export default class Radio extends Component {
    props: RadioProps;
    value: string | number;
    radioRef: RefObject<HTMLSpanElement>;

    static propTypes = {
        color: PropTypes.string,
        icon: PropTypes.string,
        onClickCallback: PropTypes.func,
        selected: PropTypes.bool,
        setTitle: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        className: PropTypes.string,
        onMoveFocus: PropTypes.func,
    };

    static defaultProps = {
        color: '#ece5eb',
        selected: false,
        setTitle: false,
    };

    constructor(props: RadioProps) {
        super(props);

        this.radioRef = createRef<HTMLSpanElement>();
        this.value = this.props.value != null ? this.props.value : this.props.color;
        this.keyDown = this.keyDown.bind(this);
        this.onClickValue = this.onClickValue.bind(this);
    }

    onClickValue(): void {
        this.props.onClickCallback(this.value);
        //only send back up if SUCCESSFUL for texture upload attempts
    }

    keyDown(e: KeyboardEvent<HTMLSpanElement>): void{
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.onClickValue();
                return;
            case 'ArrowLeft':
                e.preventDefault();
                this.props.onMoveFocus? this.props.onMoveFocus(-1, this) : null;
                return;
            case 'ArrowRight':
                e.preventDefault();
                this.props.onMoveFocus? this.props.onMoveFocus(1, this) : null;
                return;
        }
    }

    focus() {
        this.radioRef.current.focus();
        this.forceUpdate();
    }

    render(): JSX.Element {
        const isCustomColor = this.props.className === 'custom-color';
        let swatchStyle = {
            backgroundColor: this.props.faIcon ? '#ece5eb' : this.props.color,
            color: isCustomColor ? this.props.color : '#381327'
        };

        const classNames = `swatch ${this.props.className} ${this.props.selected? 'selected':''}`;

        return (
            <span
                role="radio"
                aria-checked={this.props.selected}
                ref={this.radioRef}
                className={classNames}
                onClick={this.onClickValue}
                onKeyDown={this.keyDown}
                title={this.props.setTitle ? (this.value as string) : null}
                aria-label={this.props.label ? (this.props.label) : null}
                tabIndex={this.props.selected ? 1 : -1}
            >
                <div style={swatchStyle} className="inner" tabIndex={-1}>
                    {this.props.children}
                    
                    {  (() => {
                            if (this.props.icon) {
                                return (<img className='icon' src={this.props.icon} tabIndex={-1}/>)
                            } else if (this.props.faIcon) {
                                return (<FontAwesomeIcon className='icon' icon={this.props.faIcon} />)
                            }
                        })()
                    }
                </div>
            </span>
        );
    }
}
