import React, { Component } from "react";
import PropTypes from "prop-types";

export class EditorPage extends Component {
  static propTypes = {
    selected: PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    }
  }

  setActive(isActive) {
    this.setState({selected:isActive})
  }

  render() {
    return (
      
      <div
      className="editorPage"
      style={{display: (this.state.selected) ? 'flex' : 'none'}}>
      {this.props.children}
      </div>
      
    );
  }
  }