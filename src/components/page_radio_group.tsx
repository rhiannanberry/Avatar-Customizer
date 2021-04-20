import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import Radio from './radio';

interface PageRadioGroupProps {
    iconPaths: string[];
    pageNames: string[];
    onClickCallback: Function;
}
export default class PageRadioGroup extends Component {
    props: PageRadioGroupProps;
    selectedPage: string;

    static propTypes = {
        iconPaths: PropTypes.arrayOf(PropTypes.string),
        pageNames: PropTypes.arrayOf(PropTypes.string),
        onClickCallback: PropTypes.func,
    };

    constructor(props: PageRadioGroupProps) {
        super(props);

        this.selectedPage = this.props.pageNames[0];
        this.togglePage = this.togglePage.bind(this);
    }

    togglePage(pageName: string): void {
        this.selectedPage = pageName;
        this.props.onClickCallback(pageName);
        this.forceUpdate();
    }

    render(): JSX.Element {
        const buttons = this.props.iconPaths.map((path, i) => (
            <Radio
                key={i}
                onClickCallback={this.togglePage}
                className="page"
                value={this.props.pageNames[i]}
                selected={this.selectedPage == this.props.pageNames[i]}
                setTitle
            >
                <img className="icon" src={path} />
            </Radio>
        ));

        return <div className="swatchContainer">{buttons}</div>;
    }
}
