import Util from "../../../core/Util";
import {InitialState} from "../../../core/gpu/InitialState";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";
//729
const state: InitialState = {
    id: 'kubik',
    count: 729 ** 2,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader,
    fillPositions: (array: Uint8ClampedArray) => {
        const sideCount = 81;
        const step = 0.01;
        const translate = .4646464646 + sideCount * step * .5;
        for (let offset = 0, len = state.count * 4; offset < len; offset += 4) {
            let pos = Util.cubePosition(offset / 4, sideCount, step);
            array[offset] = pos[0] - translate;
            array[offset + 1] = pos[1] - translate;
            array[offset + 2] = pos[2] - translate;
            array[offset + 3] = 0;
        }
    },
    fillVelocities: (array: Uint8ClampedArray) => {
        for (let offset = 0, len = state.count * 4; offset <= len; offset += 4) {
            array[offset] = 0;
            array[offset + 1] = 0;
            array[offset + 2] = 0;
            array[offset + 3] = 0;
        }
    }
}
export default state;
