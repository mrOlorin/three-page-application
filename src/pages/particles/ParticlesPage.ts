import {Scene} from 'three';
import Renderer from '../../core/Renderer';
import initialStates from './initialStates';
import {Page} from '../../core/Page';
import {InitialState} from '../../core/gpu/InitialState';
import {CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer';
import Particles from './Particles';

export default class ParticlesPage extends Page {
    public readonly scene: Scene;
    private readonly particles: Particles;

    public constructor(private world: Renderer, private urlSegments: Array<string>) {
        super();
        this.scene = new Scene();
        this.particles = new Particles(world.webGLRenderer);
        this.scene.add(this.particles);
        const stateName = urlSegments[0];
        this.loadState(stateName || 'random');
        this.scene.add(this.buildNav());
    }

    public buildNav(): CSS3DObject {
        const navElement = document.createElement('nav');
        initialStates.map((state: InitialState) => {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.setAttribute('href', `#el/${state.id}`);
            a.textContent = state.id;
            p.appendChild(a);
            navElement.appendChild(p);
        });
        const nav3DElement = new CSS3DObject(navElement);
        nav3DElement.position.x = -300;
        return nav3DElement;
    }

    private async loadState(stateName: string) {
        const state: InitialState = (await import(`./initialStates/${stateName}`)).default;
        this.particles.loadState(state);
    }

}
