import {InitialState} from "../../../core/gpu/InitialState";
import Util from "../../../core/Util";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import velocityFunction from "../shaders/velocityFunction.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

const state: InitialState = {
    id: 'random',
    count: 125 ** 2,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader: velocityShader.replace(/\/\/ {{velocityFunction}}/, velocityFunction),
    fillPositions: (array: Uint8ClampedArray) => {
        let mass = 1000;
        const size = 500;
        for (let offset = 0, len = state.count * 4; offset < len; offset += 4) {
            array[offset] = Util.rand(size);
            array[offset + 1] = Util.rand(size);
            array[offset + 2] = Util.rand(size);
            array[offset + 3] = mass; //. * Math.random();
            mass = 1001 - mass;
        }
    },
    fillVelocities: (array: Uint8ClampedArray) => {
        let charge = 1;
        for (let offset = 0, len = state.count * 4; offset <= len; offset += 4) {
            array[offset] = 0;
            array[offset + 1] = 0;
            array[offset + 2] = 0;
            array[offset + 3] = charge;
            charge = -charge;
        }
    }
}
export default state;
