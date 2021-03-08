import {Scene } from "three";
import Rings from "./Rings";
import {Page} from "../../core/Page";

export default class PointsPage extends Page {
    public readonly scene: Scene;

    public constructor() {
        super();
        this.scene = new Scene();
        const rings = new Rings();
        this.scene.add(rings);
    }

}
