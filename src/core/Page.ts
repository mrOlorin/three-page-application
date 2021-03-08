import {Scene} from "three";
import Renderer from "./Renderer";

export interface OnDestroy {
    onDestroy: () => void;
}

export abstract class Page {
    public scene: Scene;

    public constructor(renderer?: Renderer, segments?: Array<string>) {
    }

    public requiresDestroy(): this is OnDestroy {
        return 'onDestroy' in this;
    }
}
