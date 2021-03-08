attribute float size;
uniform float uTime;
out vec3 vColor;

void main() {
    vColor = color;
    vec3 pos = position;

    vec3 shift = vec3(
        .1 * cos(uTime * 10.),
        0.,
        .1 * sin(uTime * 10.)
    );

    shift.y -= uTime * (size * .01);
    shift.xz /= (size * .01);
    pos += shift;
    pos = mod(pos, 1.) - .5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (50. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
