import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

export class BodyEditor extends Component{
    constructor(props) {
      super(props);
      this.colorPicker1 = React.createRef();
    }

    changed(e) {
      
    }

    render() {
      return (
        <EditorPage>
            <label>Body Type</label>
            <div>
                <PresetColorButton value="1" defaultChecked={true} name="body-type" color='#aa9234'/>    
                <PresetColorButton value="2" defaultChecked={false} name="body-type" color='#aa9234'/>
            </div>
            <label>Skin Color</label>
            <div>
                <CustomColorButton value="1" defaultChecked={true} name="body-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="body-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="body-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="body-color" color='#aa9234'/>
            </div>
            <label>Blush</label>
            <div>
                <DisableButton name="blush-color" />
                <CustomColorButton value="1" defaultChecked={true} name="blush-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="blush-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="blush-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="blush-color" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}