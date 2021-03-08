export default class Util {

    static toArr3(n: number | [number, number, number]) {
        'number' === typeof n && (n = [n, n, n]);
        return n;
    }

    static cubePosition(i: number,
                        siedCount: number | [number, number, number] = [1, 1, 1],
                        step: number | [number, number, number] = [1, 1, 1]) {
        siedCount = Util.toArr3(siedCount);
        step = Util.toArr3(step);
        return [
            step[0] * (i % siedCount[0]),
            step[1] * (Math.floor(i / siedCount[0]) % siedCount[1]),
            step[2] * (Math.floor(i / (siedCount[1] * siedCount[2]))),
        ];
    }

    static rand(scale: number) {
        return (.5 - Math.random()) * scale;
    }
}
