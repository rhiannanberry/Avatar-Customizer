import React, { Component, createRef, KeyboardEvent, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface RadioProps {
    children?: JSX.Element[] | JSX.Element | null;
    color: string;
    onClickCallback: Function;
    selected: boolean;
    className?: string;
    icon?: string;
    faIcon?: IconDefinition;
    value?: string | number;
    label?: string;
    onMoveFocus?: Function;
    left?: RefObject<Radio>;
    right?: RefObject<Radio>;
    generatePreview?: boolean;
}

export default class Radio extends Component {
    props: RadioProps;
    value: string | number;
    radioRef: RefObject<HTMLSpanElement>;
    previewIcon: string;

    static propTypes = {
        color: PropTypes.string,
        icon: PropTypes.string,
        onClickCallback: PropTypes.func,
        selected: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        className: PropTypes.string,
        onMoveFocus: PropTypes.func,
        generatePreview: PropTypes.bool,
    };

    static defaultProps = {
        color: '#ece5eb',
        selected: false,
    };

    constructor(props: RadioProps) {
        super(props);

        this.radioRef = createRef<HTMLSpanElement>();
        this.value = this.props.value != null ? this.props.value : this.props.color;
        this.keyDown = this.keyDown.bind(this);
        this.onClickValue = this.onClickValue.bind(this);

        if (this.props.icon && this.props.generatePreview) {
            this.getPreviewIcon();
        }
    }

    getPreviewIcon(): void {
        const img = new Image();
        img.src = this.props.icon;
        img.onload = (): void => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, img.width, img.height);
            let startY = Infinity;
            let startX = Infinity;
            let endY = 0;
            let endX = 0;
            // get region of non-transparent pixels
            loopOuter: for (let y = 0; y < img.height; y++) {
                const indy = y * img.width * 4;
                for (let x = 0; x < img.width; x++) {
                    const ind = indy + (x + 1) * 4;
                    if (imgData.data[ind] > 0) {
                        startY = y;
                        break loopOuter;
                    }
                }
            }
            loopOuter: for (let y = img.height - 1; y >= 0; y--) {
                const indy = y * img.width * 4;
                for (let x = 0; x < img.width; x++) {
                    const ind = indy + (x + 1) * 4;
                    if (imgData.data[ind] > 0) {
                        endY = y + 1;
                        break loopOuter;
                    }
                }
            }

            loopOuter: for (let x = 0; x < img.width; x++) {
                const indx = (x + 1) * 4;
                for (let y = 0; y < img.height; y++) {
                    const ind = y * img.width * 4 + indx;
                    if (imgData.data[ind] > 0) {
                        startX = x + 1;
                        break loopOuter;
                    }
                }
            }

            loopOuter: for (let x = img.width - 1; x >= 0; x--) {
                const indx = (x + 1) * 4;
                for (let y = 0; y < img.height; y++) {
                    const ind = y * img.width * 4 + indx;
                    if (imgData.data[ind] > 0) {
                        endX = x + 2;
                        break loopOuter;
                    }
                }
            }
            const w = endX - startX;
            const h = endY - startY;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tctx = tempCanvas.getContext('2d');
            tctx.drawImage(img, startX, startY, w, h, 0, 0, w, h);
            this.previewIcon = tempCanvas.toDataURL();
        };
    }

    onClickValue(): void {
        this.props.onClickCallback(this.value);
        //only send back up if SUCCESSFUL for texture upload attempts
    }

    keyDown(e: KeyboardEvent<HTMLSpanElement>): void {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.onClickValue();
                return;
            case 'ArrowLeft':
                e.preventDefault();
                this.props.onMoveFocus ? this.props.onMoveFocus(-1, this) : null;
                return;
            case 'ArrowRight':
                e.preventDefault();
                this.props.onMoveFocus ? this.props.onMoveFocus(1, this) : null;
                return;
        }
    }

    focus(): void {
        this.radioRef.current.focus();
        this.forceUpdate();
    }

    render(): JSX.Element {
        const isCustomColor = this.props.className === 'custom-color';
        const swatchStyle = {
            backgroundColor: this.props.faIcon ? '#ece5eb' : this.props.color,
            color: isCustomColor ? this.props.color : '#381327',
        };
        const classNames = `swatch ${this.props.className ? this.props.className : ''} ${
            this.props.selected ? 'selected' : ''
        }`;

        return (
            <span
                role="radio"
                aria-checked={this.props.selected}
                ref={this.radioRef}
                className={classNames}
                onClick={this.onClickValue}
                onKeyDown={this.keyDown}
                aria-label={this.props.label ? this.props.label : null}
                tabIndex={this.props.selected ? 1 : -1}
            >
                <div style={swatchStyle} className="inner" tabIndex={-1}>
                    {this.props.children}

                    {((): JSX.Element => {
                        if (this.props.icon) {
                            return (
                                <img
                                    className={`icon ${this.previewIcon ? 'invert' : ''}`}
                                    src={this.props.generatePreview ? this.previewIcon : this.props.icon}
                                    tabIndex={-1}
                                />
                            );
                        } else if (this.props.faIcon) {
                            return <FontAwesomeIcon className="icon" icon={this.props.faIcon} />;
                        }
                    })()}
                </div>
            </span>
        );
    }
}
