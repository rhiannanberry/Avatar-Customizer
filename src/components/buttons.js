import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons/faDownload";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";

export class DownloadButton extends Component {
    static propTypes = {
      name: PropTypes.string,
      onClick: PropTypes.func
    };

  
    constructor(props) {
      super(props);
      this.link = React.createRef();
    }

    async clickHandler() {
        const src = await this.props.onClick();
        this.link.current.download = this.props.name + '.png';
        this.link.current.href = src;
        this.link.current.click();
    }

    render() {
        return(
            <>
            <div className="layer-button" title="Download layout PNG to customize" onClick={()=>this.clickHandler()}>
                <FontAwesomeIcon icon={faDownload} />
                <a ref={this.link} download hidden onClick={(e) => e.stopPropagation()}> </a>
            </div>
            </>
        );
    }
}

export class UploadButton extends Component {
    static propTypes = {
        onUpload: PropTypes.func
    }
    static defaultProps = {
        onUpload: ()=>{}
    }
    constructor(props) {
        super(props);
        this.input = document.createElement("input");
        this.input.type = "file";
        this.input.hidden = true;
        this.file = React.createRef();
    }

    changeHandler(e) {
        const imgsrc = window.URL.createObjectURL(e.target.files[0])
        this.props.onUpload(e.target.files[0]);
    }

    render() {
        return(
            <div className="layer-button" title="Upload custom layer texture" onClick={()=>this.file.current.click()}>
                <input type="file" ref={this.file} hidden accept="image/png" onChange={this.changeHandler.bind(this)}/>
                <FontAwesomeIcon icon={faUpload}/>
            </div>
        );
    }
}