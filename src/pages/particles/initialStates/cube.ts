import Util from "../../../core/Util";
import {InitialState} from "../../../core/gpu/InitialState";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import velocityFunction from "../shaders/velocityFunction.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

const state: InitialState = {
    id: 'cube',
    count: 125 ** 2,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader: velocityShader.replace(/\/\/ {{velocityFunction}}/, velocityFunction),
    fillPositions: (array: Uint8ClampedArray) => {
        let mass = 1000;
        const sideCount = 25;
        const step = 20;
        const translate = sideCount * step * .5;
        for (let offset = 0, len = state.count * 4; offset < len; offset += 4) {
            let pos = Util.cubePosition(offset / 4, sideCount, step);
            array[offset] = pos[0] - translate;
            array[offset + 1] = pos[1] - translate;
            array[offset + 2] = pos[2] - translate;
            array[offset + 3] = mass * Math.random();
            mass = 1001 - mass;
        }
    },
    fillVelocities: (array: Uint8ClampedArray) => {
        let charge = 1;

        for (let offset = 0, len = state.count * 4; offset <= len; offset += 4) {
            array[offset] = 0; //rand(1);
            array[offset + 1] = 0; //rand(1);
            array[offset + 2] = 0; // rand(1);
            array[offset + 3] = charge;
            charge = -charge;
        }
    }
}
export default state;
