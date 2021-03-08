import {
    BufferGeometry,
    DynamicDrawUsage,
    Float32BufferAttribute, GLSL3, NormalBlending, Points, ShaderMaterial, TextureLoader
} from 'three';
import vertexShader from './pointsVert.glsl';
import fragmentShader from './pointsFrag.glsl';

export default class MyPoints extends Points {
    public material: ShaderMaterial;
    private scaleFactor = 100;

    public constructor() {
        super();
        this.initGeometry();
        this.initMaterial();
        this.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
    }

    public onBeforeRender = () => {
        this.material.uniforms.uTime.value = performance.now() * .00001;
    }

    private initGeometry() {
        this.geometry = new BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        //let color = 1;
        for (let i = 0; i < 100000; i++) {
            positions.push(
                .5 - Math.random(),
                .5 - Math.random(),
                .5 - Math.random()
            );
            colors.push(Math.random(), Math.random(), Math.random());
            //colors.push(color, color, color);
            sizes.push(Math.random() * this.scaleFactor);
        }
        this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        this.geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1).setUsage(DynamicDrawUsage));
    }

    private initMaterial() {
        this.material = new ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                pointTexture: {value: new TextureLoader().load('assets/textures/sprites/disc.png')},
            },
            glslVersion: GLSL3,
            vertexShader,
            fragmentShader,
            blending: NormalBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });

    }

}
