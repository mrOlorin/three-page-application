import {Scene } from "three";
import Points from "./Points";
import {Page} from "../../core/Page";

export default class PointsPage extends Page {
    public readonly scene: Scene;

    public constructor() {
        super();
        this.scene = new Scene();
        const points = new Points();
        points.scale.setScalar(2000);
        this.scene.add(points);
    }

}
