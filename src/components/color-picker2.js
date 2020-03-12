import React, { Component } from "react";
import * as THREE from "three";
import EditorUtils from "./editor-utils";
import {EditorPage} from "./editor-page"
import Buttons, {TextureButton} from "./buttons"
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from "prop-types";
import { LabeledTexture } from "../labeled-texture";

const styles = {
    swatch: {
      width: '30px',
      height: '30px',
      float: 'left',
      borderRadius: '4px',
      marginLeft: '6px',
      cursor: 'pointer'
    },
    swatchInner: {
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: '80%',
        height: '80%',
        objectFit: 'contain'
    },
    swatchContainer: {
      display: 'flex',
      justifyContent:'center'

    }
  }

class Swatch extends Component { 
    constructor(props) {
        super(props);        
    }
    
    render() {
        var swatchStyle = {...styles.swatch};

        if (this.props.first) swatchStyle.marginLeft = '0px';

        if (this.props.selected) swatchStyle.boxShadow= `0 0 6px ${this.props.color}`
        
        return(
            <span style={swatchStyle} onClick={()=>{this.props.onClick(this.props.color)}}>
                <div style={{...styles.swatchInner, backgroundColor:this.props.color}} />
            </span>
        );
    }
}

class TextureSwatch extends Component {
    constructor(props) {
        super(props);        
    }
    
    render() {
        var swatchStyle = (this.props.style) ? {...styles.swatch, ...this.props.style} : {...styles.swatch};

        if (this.props.first) swatchStyle.marginLeft = '0px';
        
        if (this.props.selected) swatchStyle.boxShadow = `0 0 6px grey`
        
        return(
            <span style={swatchStyle} onClick={()=>{this.props.onClick(this.props.src)}}>
                <div style={{...styles.swatchInner, backgroundColor:'#e0e0e0'}} >
                    <img src={this.props.src} style={styles.icon}/>
                </div>
            </span>
        );
    }
}

class IconSwatch extends Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
    }

    onClick() {
        if (this.props.value == "upload") {
            this.file.current.click();
        }
        this.props.onClick(this.props.value);
    }
    onUpload(e) {
        if (typeof this.props.onUpload == "function") {

            this.props.onUpload(e.target.files[0]);
        }
    }
    
    render() {
        var swatchStyle = (this.props.style) ? {...styles.swatch, ...this.props.style} : {...styles.swatch};

        if (this.props.first) swatchStyle.marginLeft = '0px';
        
        if (this.props.selected) swatchStyle.boxShadow = `0 0 6px grey`
        
        return(
            <span style={swatchStyle} onClick={()=>{this.onClick()}}>
                <div style={{...styles.swatchInner, backgroundColor:'#e0e0e0'}} >
                    <FontAwesomeIcon className="icon" icon={this.props.icon} style={styles.icon}/>    
                    {this.props.value == "upload" ? 
                    
                    <input ref={this.file} type="file" hidden accept="image/png" onChange={(e)=>{this.onUpload(e)}} hidden/>
                : null}
                </div>
            </span>
        );
    }
}

class Disable extends Component {
    constructor(props) {
        super(props);        
    }
    
    render() {
        var swatchStyle = (this.props.style) ? {...styles.swatch, ...this.props.style} : {...styles.swatch};

        if (this.props.first) swatchStyle.marginLeft = '0px';
        
        if (this.props.selected) swatchStyle.boxShadow = `0 0 6px grey`
        
        return(
            <span style={swatchStyle} onClick={()=>{this.props.onClick('none')}}>
                <div style={{...styles.swatchInner, backgroundColor:'#e0e0e0'}} >
                    <FontAwesomeIcon className="icon" icon={faBan} style={styles.icon}/>    
                </div>
            </span>
        );
    }
}

export default class Swatches extends Component {
    static propTypes = {
        canDisable: PropTypes.bool,
        canUpload: PropTypes.bool,
        colors: PropTypes.array,
        textures: PropTypes.array,
        onChange: PropTypes.func,
        onUpload: PropTypes.func, 
        width: PropTypes.string,
        height: PropTypes.string,
        selected: PropTypes.string
    }

    static defaultProps = {
        onChange: () => {},
        onUpload: () => {},
        colors: [],
        textures: [],
        selected: ''
    }

    constructor(props) {
        super(props);
        this.state = {selected: this.props.selected}
        this.size = {};

        console.log(this.props.selected)
        if (this.props.width) this.size.width = this.props.width;
        if (this.props.height) this.size.height = this.props.height;
    }

    onClickHandler(value) {
        this.setState({selected: value});
        this.props.onChange(value);
    }

    render() {
        const canDisable = this.props.canDisable;
        const canUpload = this.props.canUpload;

        return(
            <div style={styles.swatchContainer}>
                {canDisable ? 
                    <IconSwatch 
                        first={true} 
                        value="none"
                        selected={"none" == this.state.selected} 
                        onClick={this.onClickHandler.bind(this)}
                        style={this.size}
                        icon={faBan}
                    /> 
                    : null
                }

                {canUpload ? 
                    <IconSwatch 
                        first={false} 
                        value="upload"
                        selected={"upload" == this.state.selected} 
                        onClick={this.onClickHandler.bind(this)}
                        onUpload={this.props.onUpload}
                        style={this.size}
                        icon={faUpload}
                    /> 
                    : null
                }

                {this.props.colors.map((c,i) => {
                    return(
                        <Swatch
                            key={i}
                            first={!canDisable && i==0}
                            color={c}
                            selected={c.toLowerCase() == this.state.selected.toLowerCase()}
                            onClick={this.onClickHandler.bind(this)}
                        />
                    );
                })}

                {this.props.textures.map((s,i) => {
                    return(
                        <TextureSwatch
                            key={i}
                            first={!canDisable && !canUpload && i==0}
                            src={s}
                            selected={s.toLowerCase() == this.state.selected.toLowerCase()}
                            onClick={this.onClickHandler.bind(this)}
                            style={this.size}
                        />
                    );
                })}
            </div>
        );
    }

    
}