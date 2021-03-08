import {InitialState} from "../../core/gpu/InitialState";
import kub from "./initialStates/cube";
import flat from "./initialStates/flat";
import random from "./initialStates/random";

const availableScenes: Array<InitialState> = [
    kub,
    flat,
    random,
]
export default availableScenes;
