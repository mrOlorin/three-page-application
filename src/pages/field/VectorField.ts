import {CylinderBufferGeometry, Object3D, Vector3, MeshStandardMaterial, InstancedMesh, Matrix4,} from 'three';

export default class VectorField extends Object3D {
    public readonly size: number;
    private readonly electricArrows: InstancedMesh;

    public constructor(size: number = 8) {
        super();
        this.size = size;
        this.electricArrows = this.initArrows();
        this.add(this.electricArrows);
    }

    public attract: (position: Vector3) => void = (() => {
        const arrowMatrix = new Matrix4();
        const up = new Vector3(0, 1, 0);
        const dummyVec = new Vector3();

        return (position: Vector3) => {
            for (let i = 0, len = this.size ** 3; i < len; i++) {
                this.electricArrows.getMatrixAt(i, arrowMatrix);

                dummyVec.setFromMatrixPosition(arrowMatrix);
                arrowMatrix.lookAt(position, dummyVec, up);
                dummyVec.sub(position);
                const scale = Math.min(1 / (dummyVec.lengthSq()), 1);
                dummyVec.setScalar(scale);
                arrowMatrix.scale(dummyVec);

                this.electricArrows.setMatrixAt(i, arrowMatrix);
            }
            this.electricArrows.instanceMatrix.needsUpdate = true;
        };
    })();

    private cubicPosition: (i: number, size: number) => Vector3 = (() => {
        const dummy = new Vector3();
        return (i: number, size: number) => {
            dummy.set(
                (i % size),
                Math.floor(i / size) % size,
                Math.floor(i / (size * size)),
            );
            return dummy;
        }
    })()

    private initArrows(): InstancedMesh {
        const geometry = new CylinderBufferGeometry(0, .03, 1, 12);
        geometry.rotateX(Math.PI / 2);
        const material = new MeshStandardMaterial();
        material.color.set(0x0);
        const mesh = new InstancedMesh(geometry, material, this.size ** 3);

        const dummy = new Object3D();
        for (let i = 0; i < this.size ** 3; i++) {
            const pos = this.cubicPosition(i, this.size);
            dummy.position.copy(pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        return mesh;
    }
}
