import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";

export default class Particle extends Mesh {

    public constructor() {
        super();
        this.geometry = new SphereBufferGeometry( .1, 8, 8 );
        this.material = new MeshBasicMaterial( {color: 0xff0000} );
    }

}
