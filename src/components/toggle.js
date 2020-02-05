import React, { Component } from "react";
import PropTypes from "prop-types";

export class LayerToggle extends Component {
  static propTypes = {
    active: PropTypes.bool,
    checked: PropTypes.bool,
    onToggle: PropTypes.func
  };

  static defaultProps = {
    active: false,
    checked: false,
    onToggle: () => {
      return;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked
    };
  }

  onToggle(e) {
    this.setState({ checked: e.target.checked });
    this.props.onToggle(e.target.checked);
  }

  render() {
    return (
      <div className="layer-toggle">
        <input
          type="checkbox"
          hidden={!this.props.active}
          checked={this.state.checked}
          onChange={this.onToggle.bind(this)}
        />
      </div>
    );
  }
}
