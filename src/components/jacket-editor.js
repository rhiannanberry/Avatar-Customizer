import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

export default class JacketEditor extends Component {
    constructor(props) {
      super(props);
      this.editorPage = React.createRef();
    }

    setActive(isActive) {
      this.editorPage.current.setActive(isActive);
    }

    render() {
      return (
        <EditorPage ref={this.editorPage}>
            <label>Jacket Color</label>
            <div>
                <DisableButton defaultChecked={true} value="1" name="jacket-color" />
                <CustomColorButton value="2" defaultChecked={true} name="jacket-color" color='#ff22dd'/>
                <PresetColorButton value="3" defaultChecked={false} name="jacket-color" color='#aa9234'/>    
                <PresetColorButton value="4" defaultChecked={false} name="jacket-color" color='#aa9234'/>
                <PresetColorButton value="5" defaultChecked={false} name="jacket-color" color='#aa9234'/>
            </div>
            <label>Logo Front</label>
            <div>
                <DisableButton value="1" name="jacket-logo" />
                <PresetColorButton value="2" defaultChecked={true} name="jacket-logo" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="jacket-logo" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="jacket-logo" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}