import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshPhongMaterial,
    Scene,
    PointLight,
    Object3D,
    FrontSide, Color,
} from "three";
import {Page} from "../../core/Page";

export default class BoxPage extends Page {
    public readonly scene: Scene;
    public readonly root: Object3D;

    public constructor() {
        super();
        this.scene = new Scene();
        this.scene.background = new Color(.95, .95, 1);
        this.root = new Object3D()
        this.scene.add(this.root);

        this.root.add(BoxPage.buildCube());
        this.setLight();
    }

    private static buildCube() {
        const geometry = new BoxGeometry(100, 200, 50);
        const material = new MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x000000,
            specular: 0x111111,
            side: FrontSide,
            shininess: 30,
        });
        return new Mesh(geometry, material);
    }

    private setLight() {
        this.scene.add(new AmbientLight(0x111111));
        const directionalLight = new DirectionalLight(0xffffff, 1.);
        directionalLight.position.set(5, 1, 3).normalize();
        this.scene.add(directionalLight);

        const pointLight = new PointLight( 0xffffff, 1, 100 );
        pointLight.position.set( 10, 10, 10 );
        this.scene.add( pointLight );

        //const sphereSize = 1;
        //const pointLightHelper = new PointLightHelper( pointLight, sphereSize );
        //this.scene.add( pointLightHelper );
    }

}
