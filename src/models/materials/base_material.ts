import { Material } from './material';

export class BaseMaterial extends Material {
    constructor(textureURL: string = null) {
        super(textureURL, true);
    }
}
