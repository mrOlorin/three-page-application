import {AxesHelper, Mesh, Scene} from "three";
import Renderer from "../../core/Renderer";
import VectorField from "./VectorField";
import Particle from "./Particle";
import {Page} from "../../core/Page";

export default class FieldPage extends Page {
    public readonly scene: Scene;
    private readonly particles: Array<Mesh> = [];
    private readonly vectorField: VectorField;
    private _time: number;

    public constructor(renderer: Renderer) {
        super();
        this.vectorField = new VectorField();
        this.scene = new Scene();
        this.scene.add(this.vectorField);
        renderer.camera.position.set(5, 3, 20);

        this.scene.add(new AxesHelper(1));
        this.particles.push(new Particle());
        this.scene.add(this.particles[0]);
        this._time = performance.now() * .001;
        this.scene.onBeforeRender = this.onBeforeRender;
    }

    private get time() {
        return performance.now() * .001 - this._time;
    }

    public onBeforeRender = () => {
        this.particles.forEach(particle => {
            particle.position.x = 3 + 2 * Math.cos(this.time);
            particle.position.y = 3 + 2 * Math.sin(this.time);
            particle.position.z = 3;

            this.vectorField.attract(particle.position);
            /*this.vectorField.vectors.forEach(vector => {
                const distSq = particle.position.clone().sub(vector.position).lengthSq();
                const force = 1 / distSq;

                const scale = Math.min(force, 1);
                vector.scale.set(scale, scale, scale);
                distSq < 5 && vector.lookAt(particle.position);
            });*/
        });
        // this.vectorField.rotation.y = performance.now()*.001;
        // this.cube.rotation.y = this.cube.rotation.x = performance.now() * .001;
    }

}
