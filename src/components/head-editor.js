import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

export default class HeadEditor extends Component {
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
            <label>Hair Type</label>
            <div>
                <DisableButton value="1" name="hair-type" />
                <PresetColorButton value="2" defaultChecked={true} name="hair-type" color='#aa9234'/>    
                <PresetColorButton value="3" defaultChecked={false} name="hair-type" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="hair-type" color='#aa9234'/>
            </div>
            <label>Hair Color</label>
            <div>
                <CustomColorButton value="1" defaultChecked={true} name="hair-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="hair-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="hair-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="hair-color" color='#aa9234'/>
            </div>
            <label>Eye Color</label>
            <div>
                <CustomColorButton value="1" defaultChecked={true} name="eye-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="eye-color" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="eye-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="eye-color" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}