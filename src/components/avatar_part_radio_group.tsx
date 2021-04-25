import React, { Component, createRef, RefObject } from 'react';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';

import AvatarPart from '../models/avatar_part';
import Radio from './radio';

interface AvatarPartRadioGroupProps {
    avatarPart: AvatarPart;
    iconPaths: string[];
    labels: string[];
    title: string;
}

export default class AvatarPartRadioGroup extends Component {
    disabled: boolean;
    isRequired: boolean;
    props: AvatarPartRadioGroupProps;
    idPrefix: string;
    partsRefs: RefObject<Radio>[] = [];

    static propTypes = {
        avatarPart: PropTypes.instanceOf(AvatarPart),
        iconPaths: PropTypes.arrayOf(PropTypes.string),
        labels: PropTypes.arrayOf(PropTypes.string),
        title: PropTypes.string,
    };

    constructor(props: AvatarPartRadioGroupProps) {
        super(props);

        this.idPrefix = this.props.title.replace(/\s/g, '-').toLowerCase();

        this.isRequired = this.props.avatarPart.isRequired;

        this.disablePart = this.disablePart.bind(this);
        this.togglePart = this.togglePart.bind(this);

        this.moveFocus = this.moveFocus.bind(this);

        const refCount = this.props.labels.length + (this.isRequired ? 0 : 1);
        for (let i = 0; i < refCount; i++) {
            this.partsRefs.push(createRef<Radio>());
        }
    }

    componentDidMount(): void {
        //random start
        const count = this.props.iconPaths.length;
        const rand = Math.floor(Math.random() * count);

        if (this.isRequired || Math.random() < 1 - 1 / count) {
            this.togglePart(rand);
        } else {
            this.disablePart();
        }
    }

    moveFocus(index: number, direction: number): void {
        const length = this.partsRefs.length;
        const ind = (index + direction + length) % length;
        this.partsRefs[ind].current.focus();
    }

    disablePart(): void {
        this.props.avatarPart.disable();
        this.forceUpdate();
    }

    togglePart(partIndex: number): void {
        this.props.avatarPart.toggleMesh(this.props.labels[partIndex]);
        this.forceUpdate();
    }

    render(): JSX.Element {
        const d = this.isRequired ? 0 : 1;
        const disableButton = this.isRequired ? null : (
            <Radio
                onClickCallback={this.disablePart}
                ref={this.partsRefs[0]}
                onMoveFocus={(dir: number): void => this.moveFocus(0, dir)}
                selected={this.props.avatarPart.disabled}
                className="part"
                label="Disable"
            >
                <FontAwesomeIcon className="icon" icon={faBan} />
            </Radio>
        );

        const parts = this.props.iconPaths.map((path, i) => (
            <Radio
                key={i}
                ref={this.partsRefs[d + i]}
                onMoveFocus={(dir: number): void => this.moveFocus(d + i, dir)}
                className="part"
                onClickCallback={this.togglePart}
                value={i}
                label={this.props.labels[i]}
                selected={!this.props.avatarPart.disabled && this.props.avatarPart.isSelected(i)}
                icon={path}
            ></Radio>
        ));

        return (
            <>
                <h3 id={`${this.idPrefix}-label`}>{this.props.title}</h3>
                <div
                    id={this.idPrefix}
                    className="swatch-container part-container"
                    role="radiogroup"
                    aria-labelledby={`${this.idPrefix}-label`}
                >
                    {disableButton}
                    {parts}
                </div>
            </>
        );
    }
}
