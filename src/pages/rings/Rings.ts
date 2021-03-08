import {
    BufferGeometry,
    Float32BufferAttribute,
    GLSL3,
    PerspectiveCamera,
    Points,
    Scene,
    ShaderMaterial,
    Vector3,
    WebGLRenderer,
} from 'three';
import vertexShader from './shaders/vert.glsl';
import fragmentShader from './shaders/frag.glsl';
import Util from "../../core/Util";

export default class Rings extends Points {
    public material: ShaderMaterial;

    public constructor() {
        super();
        this.initGeometry();
        this.initMaterial();
        this.matrixAutoUpdate = true;
    }

    private rayOrigin = new Vector3(0., 0., 0.);
    private rayDirection = new Vector3(0., 0., 0.);
    private uglyFix = new Vector3(-1., -1., 1.);

    public onBeforeRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) => {
        camera.getWorldPosition(this.rayOrigin);
        camera.getWorldDirection(this.rayDirection);
        this.material.uniforms.rayOrigin.value.copy(this.rayOrigin.multiply(this.uglyFix));
        this.material.uniforms.rayDirection.value.copy(this.rayDirection.multiply(this.uglyFix));
        this.material.uniforms.uTime.value = performance.now() * .001;
    }

    private initGeometry() {
        this.geometry = new BufferGeometry();
        const count = 100 ** 2;
        const sideCount: [number, number, number] = [100, 100, 1];
        const step = 20;
        const itemSize = 3;
        const positions = [];
        for (let offset = 0, len = count * itemSize; offset < len; offset += itemSize) {
            let pos = Util.cubePosition(offset / itemSize, sideCount, step);
            positions[offset] = pos[0] - sideCount[0] * step * .5;
            positions[offset + 1] = pos[1] - sideCount[1] * step * .5;
            positions[offset + 2] = 0;
        }
        this.geometry.setAttribute('position', new Float32BufferAttribute(positions, itemSize));
    }

    private initMaterial() {
        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {value: 0},
                rayOrigin: {value: new Vector3()},
                rayDirection: {value: new Vector3()},
            },
            glslVersion: GLSL3,
        });
    }

}
