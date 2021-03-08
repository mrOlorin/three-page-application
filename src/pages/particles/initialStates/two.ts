import {InitialState} from "../../../core/gpu/InitialState";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import velocityFunction from "../shaders/velocityFunction.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

const state: InitialState = {
    id: 'two',
    count: 2,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader: velocityShader.replace(/\/\/ {{velocityFunction}}/, velocityFunction),
    fillPositions: (array: Uint8ClampedArray) => {
        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = 1;

        array[4] = 0;
        array[5] = 35.8;
        array[6] = 0;
        array[7] = 0.00054;
    },
    fillVelocities: (array: Uint8ClampedArray) => {
        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = 1;

        array[4] = 1;
        array[5] = 0;
        array[6] = 0;
        array[7] = -1;
    }
}
export default state;
