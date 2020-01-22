import * as React from 'react';
import * as ReactDOM from 'react-dom';

type ColorProps = {
    label: string; 
    color: string;
    func: Function;
}

export class ColorPicker extends React.Component<ColorProps, {label : string, color : string}>  {

    constructor(props : ColorProps) {
        super(props);
        this.state = {
            label : props.label,
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
        <div>
        <label>{this.props.label}</label>        
        <input className="color-picker" name="Color Picker" type="color" value={this.state.color} onInput={(e:any) => this.updateColor(e.target.value)}/>
        </div>
      );
    }
  }