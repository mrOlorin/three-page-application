import {InitialState} from "../../../core/gpu/InitialState";
import positionShader from "../shaders/positionShader.glsl";
import velocityShader from "../shaders/velocityShader.glsl";
import velocityFunction from "../shaders/velocityFunction.glsl";
import vertexShader from "../shaders/vert.glsl";
import fragmentShader from "../shaders/frag.glsl";

const state: InitialState = {
    id: 'four',
    count: 4,
    vertexShader,
    fragmentShader,
    positionShader,
    velocityShader: velocityShader.replace(/\/\/ {{velocityFunction}}/, velocityFunction),
    fillPositions: (array: Uint8ClampedArray) => {
        const d = 15;
        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = 1000;

        array[4] = d * Math.cos(Math.PI / 3);
        array[5] = d * Math.sin(Math.PI / 3);
        array[6] = 0;
        array[7] = .001;

        array[8] = d * Math.cos(3 * Math.PI / 3);
        array[9] = d * Math.sin(3 * Math.PI / 3);
        array[10] = 0;
        array[11] = .001;

        array[12] = d * Math.cos(5 * Math.PI / 3);
        array[13] = d * Math.sin(5 * Math.PI / 3);
        array[14] = 0;
        array[15] = .001;
    },
    fillVelocities: (array: Uint8ClampedArray) => {
        const vel = .0;
        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = 1;

        array[4] = 0;
        array[5] = vel;
        array[6] = 0;
        array[7] = -1;

        array[8] = -vel;
        array[9] = 0;
        array[10] = 0;
        array[11] = -1;

        array[12] = 0;
        array[13] = -vel;
        array[14] = 0;
        array[15] = -1;
    }
}
export default state;
