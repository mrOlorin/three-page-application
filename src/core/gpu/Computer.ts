import {DataTexture, WebGLRenderer, WebGLRenderTarget} from "three";
import {GPUComputationRenderer, Variable} from "three/examples/jsm/misc/GPUComputationRenderer";
import {IUniform} from "three/src/renderers/shaders/UniformsLib";

export interface ComputerConfig {
    renderer: WebGLRenderer;
    size: number;
    fillPositions: (array: Uint8ClampedArray) => void;
    fillVelocities: (array: Uint8ClampedArray, positions: Uint8ClampedArray) => void;
    positionShader: string;
    velocityShader: string;
    velocityFunction?: string;
    target: {
        positions: IUniform,
        velocities: IUniform
    }
}

export default class Computer {
    private gpuCompute: GPUComputationRenderer;
    private positionVariable: Variable;
    private velocityVariable: Variable;
    public position: Float32Array;
    public velocity: Float32Array;
    public readVelocities: () => Float32Array;
    public readPositions: () => Float32Array;

    public constructor(private config: ComputerConfig) {
        if (this.config.size % 1 !== 0) {
            throw new Error("Unequal sides");
        }
        this.initComputationRenderer();
    }

    public compute = (t: number, dt: number) => {
        this.positionVariable.material.uniforms.t.value = t;
        this.velocityVariable.material.uniforms.t.value = t;
        this.positionVariable.material.uniforms.dt.value = dt;
        this.velocityVariable.material.uniforms.dt.value = dt;
        this.gpuCompute.compute();
        this.config.target.positions.value =
            (this.gpuCompute.getCurrentRenderTarget(this.positionVariable) as WebGLRenderTarget).texture;
        this.config.target.velocities.value =
            (this.gpuCompute.getCurrentRenderTarget(this.velocityVariable) as WebGLRenderTarget).texture;
    }

    private readTexture(renderTarget: WebGLRenderTarget, buf: Float32Array): Float32Array {
        this.config.renderer.readRenderTargetPixels(renderTarget, 0, 0, this.config.size, this.config.size, buf);
        return buf;
    }

    private initComputationRenderer(): void {
        const gpuCompute = new GPUComputationRenderer(this.config.size, this.config.size, this.config.renderer);
        const dtPosition: DataTexture = gpuCompute.createTexture();
        const dtVelocity: DataTexture = gpuCompute.createTexture();

        this.config.fillPositions(dtPosition.image.data);
        this.config.fillVelocities(dtVelocity.image.data, dtPosition.image.data);

        this.positionVariable = gpuCompute.addVariable(
            'texturePosition',
            this.config.positionShader,
            dtPosition,
        );
        this.position = new Float32Array(this.config.size * this.config.size * 4);
        this.readPositions = (): Float32Array => {
            this.readTexture(this.gpuCompute.getCurrentRenderTarget(this.positionVariable) as WebGLRenderTarget, this.position);
            return this.position;
        }

        this.velocityVariable = gpuCompute.addVariable(
            'textureVelocity',
            this.config.velocityShader,
            dtVelocity,
        );
        this.velocity = new Float32Array(this.config.size * this.config.size * 4);
        this.readVelocities = (): Float32Array => {
            this.readTexture(this.gpuCompute.getCurrentRenderTarget(this.velocityVariable) as WebGLRenderTarget, this.velocity);
            return this.velocity;
        }

        gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
        gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

        this.positionVariable.material.uniforms.t = { value: 0.0 };
        this.positionVariable.material.uniforms.dt = { value: 0.0 };
        this.velocityVariable.material.uniforms.t = { value: 0.0 };
        this.velocityVariable.material.uniforms.dt = { value: 0.0 };

        const errorMessage = gpuCompute.init();
        if (errorMessage !== null) {
            throw new Error(errorMessage);
        }
        this.gpuCompute = gpuCompute;
    }

}
