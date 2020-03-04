import React, { Component } from "react";
import {EditorPage} from "./editor-page"
import {DisableButton, PresetColorButton, CustomColorButton} from "./buttons"

export default class ShirtEditor extends Component {
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
            <label>Shirt Color</label>
            <div>
                <CustomColorButton value="1" defaultChecked={true} name="shirt-color" color='#ff22dd'/>
                <PresetColorButton value="2" defaultChecked={false} name="shirt-color" color='#aa9234'/>    
                <PresetColorButton value="3" defaultChecked={false} name="shirt-color" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="shirt-color" color='#aa9234'/>
            </div>
            <label>Logo Front</label>
            <div>
                <DisableButton value="1" name="shirt-logo-front" />
                <PresetColorButton value="2" defaultChecked={true} name="shirt-logo-front" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="shirt-logo-front" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="shirt-logo-front" color='#aa9234'/>
            </div>
            <label>Logo Back</label>
            <div>
                <DisableButton value="1" name="shirt-logo-back" />
                <PresetColorButton value="2" defaultChecked={true} name="shirt-logo-back" color='#aa9234'/>
                <PresetColorButton value="3" defaultChecked={false} name="shirt-logo-back" color='#aa9234'/>
                <PresetColorButton value="4" defaultChecked={false} name="shirt-logo-back" color='#aa9234'/>
            </div>
        </EditorPage>
      );

    }
}