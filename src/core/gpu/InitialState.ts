export interface InitialState {
    id: string;
    name?: string;
    count: number;
    dt?: number;
    positionShader: string,
    velocityShader: string,
    vertexShader: string,
    fragmentShader: string,
    fillPositions: (array: Uint8ClampedArray) => void;
    fillVelocities: (array: Uint8ClampedArray, positions: Uint8ClampedArray) => void;
}
