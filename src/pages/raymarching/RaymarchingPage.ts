import {
    BoxBufferGeometry,
    Scene,
    Object3D,
    ShaderMaterial,
    TextureLoader,
    GLSL3,
    BackSide,
    Vector3,
    WebGLRenderer,
    PerspectiveCamera,
    Vector2,
    NoBlending, InstancedMesh,
} from "three";
import {Page} from "../../core/Page";
import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";
import Renderer from "../../core/Renderer";

export default class RaymarchingPage extends Page {
    public readonly scene: Scene;
    private readonly root: Object3D;
    private material: ShaderMaterial;

    public constructor(renderer: Renderer) {
        super();
        this.scene = new Scene();
        this.root = new Object3D()
        this.scene.add(this.root);
        this.root.add(this.buildCube());
        renderer.camera.position.set(0, 0, 20);
    }

    private buildCube() {
        const geometry = new BoxBufferGeometry(1e6, 1e6, 1e6);
        this.material = new ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                pointTexture: {value: new TextureLoader().load('assets/textures/sprites/disc.png')},
                rayOrigin: {value: new Vector3()},
                rayDirection: {value: new Vector3()},
                resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
            },
            glslVersion: GLSL3,
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            transparent: true,
            side: BackSide,
        });
        window.addEventListener("resize", () => {
            this.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        });
        const mesh = new InstancedMesh(geometry, this.material, 1);
        mesh.onBeforeRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) => {
            camera.getWorldPosition(this.material.uniforms.rayOrigin.value);
            camera.getWorldDirection(this.material.uniforms.rayDirection.value);
            this.material.uniforms.uTime.value = performance.now() * .001;
        };
        return mesh;
    }

}
