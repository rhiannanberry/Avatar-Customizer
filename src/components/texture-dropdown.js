import React, { Component } from "react";
import PropTypes from "prop-types";

export class TextureDropdown extends Component {
  static propTypes = {
    filenames: PropTypes.arrayOf(PropTypes.string),
    setTexFunc: PropTypes.func,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { value: this.props.filenames[0] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.setTexFunc(e.target.value);
    this.setState({ value: e.target.value });
  }

  render() {
    const optionList = this.props.filenames.map(function(opt, i) {
      const optLabel = (opt) ? opt.charAt(0).toUpperCase() + opt.slice(1) : 'None';
      return (
        <option key={i} value={opt}>
          {optLabel}
        </option>
      );
    });

    return (
      <select className="dropdown" disabled={this.props.disabled} value={this.state.value} onChange={this.handleChange}>
        {optionList}
      </select>
    );
  }
}
