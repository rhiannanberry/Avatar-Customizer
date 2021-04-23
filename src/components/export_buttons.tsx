import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import AvatarBase from '../models/avatar_base';

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

interface ExportButtonProps {
    avatarBase: AvatarBase;
    texture: boolean;
}

export default class ExportButton extends Component {
    props: ExportButtonProps;

    static propTypes = {
        AvatarBase: PropTypes.instanceOf(AvatarBase),
        texture: PropTypes.bool,
    };

    static defaultProps = {
        texture: false,
    };

    constructor(props: ExportButtonProps) {
        super(props);

        this.exportGLB = this.exportGLB.bind(this);
        this.exportTexture = this.exportTexture.bind(this);
    }

    exportGLB(): void {
        const exporter = new GLTFExporter();
        this.props.avatarBase.getMergedGLTF().then(val => {
            exporter.parse(
                val.scene,
                glb => {
                    this.props.avatarBase.postExportRestore();
                    const blob = new Blob([glb as Blob], { type: 'model/gltf-binary' });
                    const el = document.createElement('a');
                    el.style.display = 'none';
                    el.href = URL.createObjectURL(blob);
                    el.download = 'custom_avatar.glb';
                    el.click();
                    el.remove();
                    val.animations.forEach((anim) => {
                        if (anim.name == "idle_eyes") {
                            
                            const t:THREE.KeyframeTrack[] = [];
                            anim.tracks.forEach((track) => {
                                if (track.name.includes('Eye')) {
                                    t.push(track);
                                }
                            })
                            anim.tracks = t;
                            anim.optimize();

                            const right = anim.tracks[0];
                            const left = anim.tracks[3];

                            right.values.forEach((v, i) => {
                                left.values[i] = i%3 == 0 ? -v : v;
                            })

                        } else {
                            anim.optimize();
                        }
                    })
                },
                { animations: val.animations, binary: true, includeCustomExtensions: true },
            );
        });
    }

    exportTexture(): void {
        const url = this.props.avatarBase.getMergedTexture();
        const el = document.createElement('a');
        el.style.display = 'none';
        el.href = url;
        el.download = 'custom_avatar_texture.png';
        el.click();
        el.remove();
    }

    render(): JSX.Element {
        const label = this.props.texture ? 'Export Texture' : 'Export Avatar';
        const func = this.props.texture ? this.exportTexture : this.exportGLB;
        return (
            <button aria-label={label.toLowerCase()} onClick={func} >
                {label}
            </button>
        );
    }
}
