import React, { Component } from "react";
import PropTypes from "prop-types";

export class LayerToggle extends Component {
    static propTypes = {
        active: PropTypes.bool,
        checked: PropTypes.bool
    }

    static defaultProps = {
        active: false,
        checked: false
    }
  
    constructor(props) {
      super(props);
      this.state = {
        checked: this.props.checked
      };
      this.myRef = React.createRef();
    
    }

    onToggle() {
        this.setState(({ checked }) => (
            {
              checked: !checked,
            }
          ));
        console.log(!this.state.checked)
    }

    render() {
        return(
            <div className="layer-toggle">
                <input ref={this.myRef} type="checkbox" hidden={!this.props.active} checked={this.state.checked} onChange={this.onToggle.bind(this)}/>
            </div>
        );
    }
}