import React, { Component,  } from "react";
import ReactDOM from "react-dom"
import * as THREE from "three";

import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faPalette } from "@fortawesome/free-solid-svg-icons/faPalette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ColorPicker from "./color-picker"

import PropTypes from "prop-types";

class Swatch extends Component { 
    static propTypes = {
        className: PropTypes.string,
        innerClassName: PropTypes.string,
        first: PropTypes.bool,
        selected: PropTypes.bool,
        color: PropTypes.string,
        src: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.object,
        material: PropTypes.array
    }

    static defaultProps = {
        className: "",
        innerClassName: "",
        first: false,
        selected: false,
        color: "#e0e0e0",
        onClick: () => {},
        style: {},
        material: []
    }

    constructor(props) {
        super(props);
    }
    
    render() {
        var swatchStyle = {...this.props.style};

        if (this.props.first) swatchStyle.marginLeft = '0px';
        if (this.props.selected) swatchStyle.boxShadow= `0 0 6px ${this.props.color}`
        
        return(
            <span className={"swatch" + " " + this.props.className } style={swatchStyle} onClick={()=>{this.props.onClick()}}>
                <div style={{backgroundColor:this.props.color}} className={"inner" + " " + this.props.innerClassName }>
                    {this.props.children}
                </div>
            </span>
        );
    }
}

class ColorSwatch extends Component {
    static propTypes = {
        className: PropTypes.string,
        first: PropTypes.bool,
        selected: PropTypes.bool,
        color: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.object,
        material: PropTypes.array
    }

    static defaultProps = {
        className: "",
        first: false,
        selected: false,
        color: "#e0e0e0",
        onClick: () => {},
        style: {},
        material: []
    }

    constructor(props) {
        super(props);
        if (this.props.selected) {
            this.props.material.forEach(m => {
                m.setActive(true);
                m.setColor(this.props.color);
            });
        }

    }

    onClickHandler() {
        this.props.material.forEach(m => {
            m.setActive(true);
            m.setColor(this.props.color);
        });
        this.props.onClick(this.props.color);
    }

    render() {
        return(
            <Swatch {...this.props} onClick={()=>this.onClickHandler()}/>
        );
    }

}

class TextureSwatch extends Component {
    
    static defaultProps = {
        className: "",
        first: false,
        selected: false,
        color: "#e0e0e0",
        onClick: () => {},
        style: {},
        material: []
    }
    constructor(props) {
        super(props);
         
    }

    onClickHandler() {
        this.props.material.forEach(m => {
            const noTex = (this.props.src == false || this.props.src == 'none');
            m.setActive(!noTex);
            (noTex) ? null : m.setTextureByPath(this.props.src) ;
        });
        
        this.props.onClick(this.props.src);
    }
    
    render() {
        const onclickhandler = ()=>{this.onClickHandler()}
        const props = {...this.props, onClick:onclickhandler}
        return(
            <Swatch {...props} className="texture">
                <img className="icon" src={this.props.src} />
            </Swatch>
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
        } else if (this.props.value == "none") {
            this.props.material.forEach(m => {
                m.setActive(false);
                
            })
        }
        this.props.onClick(this.props.value);
    }

    onUpload(e) {
        
        if (typeof this.props.onUpload == "function") {
            const path = window.URL.createObjectURL(e.target.files[0]);
            this.props.material.forEach(m => {
                m.addTexture(path);
                m.setActive(true);
                m.setTextureByPath(path)
                
            })
        }
    }
    
    render() {
        const props = {
            ...this.props,
            onClick: ()=>{this.onClick()},
        }
        
        return(
            <Swatch {...props} >
                <FontAwesomeIcon className="icon" icon={this.props.icon}/>    
                    {this.props.value == "upload" ? 
                    <input ref={this.file} type="file" hidden accept="image/png" onChange={(e)=>{this.onUpload(e)}} hidden/>
                : null}
            </Swatch>
            
        );
    }
}

class CustomColorSwatch extends Component {

    //if not selected, close 
    //if selected and open, close

    static propTypes = {
        open : PropTypes.bool,
        innerClassName: PropTypes.string
    }

    static defaultProps = {
        open : false,
        innerClassName : "custom"
    }

    constructor(props) {
        super(props);
        this.state = {open: this.props.open, color: this.props.color, clicked: false}
        this.clicked = false;

        this.picker = React.createRef();
    }

    onClickHandler() {
        const open = (!this.state.open || this.clicked) || (this.props.value != "custom");
        this.setState({open: open})

        if (open) {
            ReactDOM.findDOMNode(this.picker.current).focus();
        }

        this.props.material.forEach(m => {
            m.setActive(true);
            m.setColor(this.state.color);
        });
        this.clicked = false
        this.props.onClick("custom");
    }

    onCustomClickHandler() {
        this.clicked=true;
    }

    render() {
        return (
            <Swatch  {...this.props} color={this.state.color} onClick={()=>this.onClickHandler()}  > 
                <ColorPicker 
                    ref={this.picker}
                    color={this.state.color} 
                    open={this.state.open && this.props.selected || this.clicked} 
                    onClick={()=>this.onCustomClickHandler()} 
                    onChange={(e) => {this.setState({color:e.hex})}} 
                />
                <FontAwesomeIcon className="icon" icon={faPalette} color={this.state.color}/>   
            </Swatch>
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
        selected: PropTypes.string,
        material: PropTypes.array
    }

    static defaultProps = {
        onChange: () => {},
        onUpload: () => {},
        colors: [],
        textures: [],
        selected: '',
        material: []
    }

    constructor(props) {
        super(props);
        this.state = {selected: this.props.selected}
        this.size = {};

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
        const randColor = new THREE.Color().randomize().getHexStringFull();

        return(
            <div className="swatchContainer">
                {canDisable ? 
                    <IconSwatch 
                        first={true} 
                        value="none"
                        selected={"none" == this.state.selected} 
                        onClick={this.onClickHandler.bind(this)}
                        style={this.size}
                        icon={faBan}
                        material={this.props.material}
                        className={this.props.textures.length > 0 ? "texture" : ""}
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
                        material={this.props.material}
                        className={this.props.textures.length > 0 ? "texture" : ""}
                    /> 
                    : null
                }

                {
                    this.props.colors.length > 0 ?
                    
                    <CustomColorSwatch
                        first={canDisable == false}
                        material={this.props.material}
                        selected={this.state.selected == "custom"}
                        onClick={this.onClickHandler.bind(this)}
                        color={randColor}
                        value={this.state.selected}
                        
                    />
                    : null
                }

                {this.props.colors.map((c,i) => {
                    return(
                        <ColorSwatch
                            key={i}
                            first={false}
                            color={c}
                            selected={c.toLowerCase() == this.state.selected.toLowerCase()}
                            onClick={this.onClickHandler.bind(this)}
                            material={this.props.material}
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
                            material={this.props.material}
                            onClick={this.onClickHandler.bind(this)}
                            style={this.size}
                        />
                    );
                })}
            </div>
        );
    }

    
}