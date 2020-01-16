import * as React from 'react';
import * as ReactDOM from 'react-dom';

type ColorProps = {
    color: string;
    func: Function;
}

export class ColorPicker extends React.Component<ColorProps, {color : string}>  {

    constructor(props : ColorProps) {
        super(props);
        this.state = {
            color : props.color
        }
        this.updateColor(this.state.color);
    }

    updateColor(value) {
        this.setState({color : value});
        this.props.func(value);

    }

    render() {
      return (
          // @ts-ignore
        <input className="color-picker" name="Color Picker" type="color" value={this.state.color} onInput={(e) => this.updateColor(e.target.value)}/>
      );
    }
  }