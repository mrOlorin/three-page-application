import * as THREE from "three";

export interface RoutesDictionary {
    [key: string]: {
        new(params?: any): THREE.Scene
    };
}