uniform float uTime;

uniform vec3 rayOrigin;
uniform vec3 rayDirection;
out mat3 camera;
out vec3 vPosition;

void setCamera(out mat3 camera) {
    vec3 forward = normalize(rayDirection);
    vec3 right = normalize(cross(forward, vec3(0., 1., 0.)));
    vec3 up = normalize(cross(right, forward));
    camera = mat3(right, up, forward);
}

void main() {
    setCamera(camera);
    vPosition = position;

    vec4 mvPosition = modelViewMatrix * vec4(vPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
