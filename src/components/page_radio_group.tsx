import React, { Component, createRef, KeyboardEvent, RefObject } from 'react';
import * as PropTypes from 'prop-types';

import Radio from './radio';

interface PageRadioGroupProps {
    pageLabels: string[];
    pageNames: string[];
    onClickCallback: Function;
}
export default class PageRadioGroup extends Component {
    props: PageRadioGroupProps;
    selectedPage: number;
    focused = -1;
    tabRefs: RefObject<HTMLButtonElement>[] = [];

    static propTypes = {
        iconPaths: PropTypes.arrayOf(PropTypes.string),
        pageLabels: PropTypes.arrayOf(PropTypes.string),
        pageNames: PropTypes.arrayOf(PropTypes.string),
        onClickCallback: PropTypes.func,
    };

    constructor(props: PageRadioGroupProps) {
        super(props);

        this.props.pageNames.forEach((v, i) => {
            this.tabRefs.push(createRef<HTMLButtonElement>())
        });

        this.selectedPage = 0;
        this.togglePage = this.togglePage.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    togglePage(i: number): void {
        const pageName = this.props.pageNames[i];
        this.selectedPage = i;
        this.props.onClickCallback(i);
        this.forceUpdate();
    }

    moveFocus(index: number, direction: number): void {
        const length = this.tabRefs.length;
        const ind = (index + direction + length) % length;
        this.tabRefs[ind].current.focus();
        this.forceUpdate();
    }

    keyDown(i: number, e: KeyboardEvent<HTMLButtonElement>): void {
        const key = e.key;
        switch (key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.moveFocus(i, -1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.moveFocus(i, 1);
                break;
        }
    }

    render(): JSX.Element {
        const pages = this.props.pageNames.map((name, i) => (
            <button
                id={this.props.pageLabels[i]}
                key={i}
                aria-controls={`${this.props.pageLabels[i]}-page`}
                ref={this.tabRefs[i]}
                role='tab'
                aria-selected={this.selectedPage == i}
                tabIndex={this.selectedPage === i ? 1:-1}
                onClick={()=>this.togglePage(i)}
                onKeyDown={(e) => this.keyDown(i, e)}>
                {name}
            </button>
        ));

        return <div className="swatchContainer page-container" role='tablist'>{pages}</div>;
    }
}
