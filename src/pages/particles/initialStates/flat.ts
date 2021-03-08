import Util from "../../../core/Util";
import {InitialState} from "../../../core/gpu/InitialState";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import velocityFunction from "../shaders/velocityFunction.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

const state: InitialState = {
    id: 'flat',
    count: 125 ** 2,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader: velocityShader.replace(/\/\/ {{velocityFunction}}/, velocityFunction),
    fillPositions: (array: Uint8ClampedArray) => {
        const siedCount: [number, number, number] = [120, 1, 120];
        const step = 5;
        for (let offset = 0, len = state.count * 4; offset < len; offset += 4) {
            let pos = Util.cubePosition(offset / 4, siedCount, step);
            array[offset] = pos[0] - siedCount[0] * step * .5;
            array[offset + 1] = pos[1] - 150;
            array[offset + 2] = -pos[2] + siedCount[2] * step * .5;
            array[offset + 3] = 10;
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
