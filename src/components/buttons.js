import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons/faDownload";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";

export class DownloadButton extends Component {
    static propTypes = {
      src: PropTypes.string
    };
  
    constructor(props) {
      super(props);
      this.link = document.createElement("a");
      this.link.href = this.props.src;
      this.link.download = true;
      this.link.hidden = true; 
    }

    render() {
        return(
            <div className="layer-button" title="Download layout PNG to customize" onClick={()=>this.link.click()}>
                <a href={this.props.src} download hidden> </a>
                <FontAwesomeIcon icon={faDownload} />
            </div>
        );
    }
}

export class UploadButton extends Component {
    static propTypes = {
        placeholder: PropTypes.string
    }
    static defaultProps = {
        placeholder: 'uh'
    }
    constructor(props) {
        super(props);
        this.input = document.createElement("input");
        this.input.type = "file";
        this.input.hidden = true;
    }
    render() {
        return(
            <div className="layer-button" title="Upload custom layer texture" onClick={()=>this.input.click()}>
                <input type="file" hidden />
                <FontAwesomeIcon icon={faUpload}/>
            </div>
        );
    }
}