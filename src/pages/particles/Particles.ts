import {
    BufferGeometry,
    Float32BufferAttribute,
    GLSL3,
    MathUtils,
    Points,
    ShaderMaterial,
    WebGLRenderer
} from "three";
import {Object3D} from "three/src/core/Object3D";
import {InitialState} from "../../core/gpu/InitialState";
import Computer from "../../core/gpu/Computer";

export default class Particles extends Object3D {

    private points: Points;

    public constructor(private renderer: WebGLRenderer) {
        super();
    }

    public async loadState(state: InitialState) {
        const points = this.buildPoints(state.count, state.vertexShader, state.fragmentShader);
        points.frustumCulled = false;
        let size = Math.sqrt(state.count);
        if (size % 1 !== 0) {
            size = Math.ceil(size);
            console.info(`Count ${state.count} is not power of 2, we'll create ${size ** 2} points`);
        }
        const pointsMaterial = points.material as ShaderMaterial;
        const computer = new Computer({
            renderer: this.renderer,
            size,
            fillPositions: state.fillPositions,
            fillVelocities: state.fillVelocities,
            positionShader: state.positionShader,
            velocityShader: state.velocityShader,
            target: {
                positions: pointsMaterial.uniforms['texturePosition'],
                velocities: pointsMaterial.uniforms['textureVelocity'],
            }
        });

        let t = 0;
        const dt = 0.01;
        points.onBeforeRender = () => {
            computer.compute(t, dt);
            pointsMaterial.uniforms.dt.value = dt;
            pointsMaterial.uniforms.t.value = t;
            t += dt;
        }

        if (this.points) {
            this.remove(this.points);
        }
        this.points = points;
        this.add(this.points);
    }

    private buildPoints(count: number, vertexShader: string, fragmentShader: string): Points {
        const geometry = this.initGeometry(count);
        const zoom = 3;
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
            depthTest: true,
            depthWrite: true,
            glslVersion: GLSL3,
            precision: "highp",
        });
        return new Points(geometry, material);
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