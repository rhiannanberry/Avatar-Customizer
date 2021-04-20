import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';

import AvatarPart from '../models/avatar_part';
import Radio from './radio';

interface AvatarPartRadioGroupProps {
    avatarPart: AvatarPart;
    iconPaths: string[];
    labels: string[];
}

export default class AvatarPartRadioGroup extends Component {
    disabled: boolean;
    isRequired: boolean;
    props: AvatarPartRadioGroupProps;

    static propTypes = {
        avatarPart: PropTypes.instanceOf(AvatarPart),
        iconPaths: PropTypes.arrayOf(PropTypes.string),
        labels: PropTypes.arrayOf(PropTypes.string),
    };

    constructor(props: AvatarPartRadioGroupProps) {
        super(props);

        this.isRequired = this.props.avatarPart.isRequired;

        this.disablePart = this.disablePart.bind(this);
        this.togglePart = this.togglePart.bind(this);
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

    disablePart(): void {
        this.props.avatarPart.disable();
        this.forceUpdate();
    }

    togglePart(partIndex: number): void {
        this.props.avatarPart.toggleMesh(partIndex);
        this.forceUpdate();
    }

    render(): JSX.Element {
        const disableButton = this.isRequired ? null : (
            <Radio onClickCallback={this.disablePart} selected={this.props.avatarPart.disabled} className="part">
                <FontAwesomeIcon className="icon" icon={faBan} />
            </Radio>
        );

        const parts = this.props.iconPaths.map((path, i) => (
            <Radio
                key={i}
                className="part"
                onClickCallback={this.togglePart}
                value={i}
                selected={!this.props.avatarPart.disabled && this.props.avatarPart.isSelected(i)}
            >
                <img className="icon" src={path} />
            </Radio>
        ));

        return (
            <div className="swatchContainer">
                {disableButton}
                {parts}
            </div>
        );
    }
}
