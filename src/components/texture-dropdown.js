import React, { Component } from "react";
import PropTypes from "prop-types";

export class TextureDropdown extends Component {
  static propTypes = {
    filenames: PropTypes.arrayOf(PropTypes.string),
    setTexFunc: PropTypes.func,
    active: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.filenames = this.props.filenames;
    this.state = { value: this.props.filenames[0], hidden: this.filenames.length <= 1 };
    this.handleChange = this.handleChange.bind(this);
    this.self = React.createRef();
  }

  handleChange(e) {
    this.props.setTexFunc(e.target.value);
    this.setState({ value: e.target.value });
  }

  addOption(option) {
    if (this.filenames.includes(option) == false) this.filenames.push(option);
    this.setState({ hidden: this.filenames.length <= 1 });
    this.state.value = this.filenames.slice(-1)[0];
  }

  render() {
    const optionList = this.filenames.map(function(opt, i) {
      return (
        <option key={i} value={i}>
          {opt}
        </option>
      );
    });

    return (
      <select
        ref={this.self}
        className="dropdown"
        disabled={!this.props.active}
        value={this.state.value}
        onChange={this.handleChange}
        hidden={this.filenames.length <= 1}
      >
        {optionList}
      </select>
    );
  }
}
