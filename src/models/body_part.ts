import AvatarPart from "./avatar_part"

export default class BodyPart extends AvatarPart {

    constructor(skinnedMeshes: THREE.SkinnedMesh[]) {
        super(true, true, skinnedMeshes);
    }
}