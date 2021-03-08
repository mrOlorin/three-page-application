import {
    BufferGeometry,
    Float32BufferAttribute,
    GLSL3,
    MathUtils, NormalBlending,
    Points,
    ShaderMaterial,
} from "three";
import {Object3D} from "three/src/core/Object3D";

export default class Particles extends Object3D {

    public readonly material: ShaderMaterial;
    private points: Points;

    public constructor(count: number, vertexShader: string, fragmentShader: string) {
        super();
        this.points = this.buildPoints(count, vertexShader, fragmentShader);
        this.material = this.points.material as ShaderMaterial;
        this.add(this.points);
    }

    private buildPoints(count: number, vertexShader: string, fragmentShader: string): Points {
        const geometry = this.initGeometry(count);
        const zoom = 1.0000001;
        const fov = 90;
        const cameraConstant = window.innerHeight / (Math.tan(MathUtils.DEG2RAD * 0.5 * fov) / zoom);

        const material = new ShaderMaterial({
            uniforms: {
                cameraConstant: {value: cameraConstant},
                texturePosition: {value: null},
                textureVelocity: {value: null},
                dt: {value: 0},
                t: {value: 0},
            },
            transparent: true,
            vertexShader,
            fragmentShader,
            colorWrite: true,
            depthWrite: true,
            glslVersion: GLSL3,
            precision: "highp",
            blending: NormalBlending,
        });
        const points = new Points(geometry, material);
        points.frustumCulled = false;
        return points;
    }

    private initGeometry(count: number) {
        const buildUvs = (size: number) => {
            const uvs = new Float32Array(size * size * 2);
            let p = 0;
            for (let j = 0; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    uvs[p++] = i / (size - 1);
                    uvs[p++] = j / (size - 1);
                }
            }
            return uvs;
        };
        const geometry = new BufferGeometry();
        const dummyPositions = new Float32Array(count * 3);
        geometry.setAttribute('position', new Float32BufferAttribute(dummyPositions, 3));
        geometry.setAttribute('uv', new Float32BufferAttribute(buildUvs(Math.sqrt(count)), 2));
        return geometry;
    }

}