import {Page} from '../../core/Page';
import {
    Scene, ShaderMaterial, TextureLoader, WebGLCubeRenderTarget
} from 'three';
import Renderer from '../../core/Renderer';
import {InitialState} from '../../core/gpu/InitialState';
import Particles from './Particles';
import Computer from '../../core/gpu/Computer';

export default class ChaosPage extends Page {
    public readonly scene: Scene;
    private particles: Particles;
    private t: number = 0;
    private dt: number = .001;

    public constructor(private world: Renderer) {
        super();
        this.scene = new Scene();
        this.loadState('kubik');
        // this.loadEnvironment();
    }

    private loadEnvironment() {
        new TextureLoader().load(
            'assets/table_mountain_1.jpg',
            (texture) => {
                const rt = new WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(this.world.webGLRenderer, texture);
                this.scene.background = rt;
            });
    }

    private async loadState(stateName: string) {
        const state: InitialState = (await import(`./initialStates/${stateName}`)).default;
        this.particles = new Particles(state.count, state.vertexShader, state.fragmentShader);
        this.particles.scale.setScalar(80);
        this.initComputer(state, this.particles.material);
        //this.world.camera.position.set(...state.cameraPosition);
        this.scene.add(this.particles);
    }

    private initComputer(state: InitialState, material: ShaderMaterial) {
        let size = Math.sqrt(state.count);
        if (size % 1 !== 0) {
            size = Math.ceil(size);
            console.info(`Count ${state.count} is not power of 2, we'll create ${size ** 2} points`);
        }
        const pointsMaterial = material as ShaderMaterial;
        const computer = new Computer({
            renderer: this.world.webGLRenderer,
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
        pointsMaterial.uniforms.dt.value = this.dt;
        this.scene.onBeforeRender = () => {
            computer.compute(this.t, this.dt);
            pointsMaterial.uniforms.t.value = this.t;
            this.t += this.dt;
        }
    }
}
