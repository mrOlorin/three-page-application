uniform float uTime;

uniform vec3 rayOrigin;
uniform vec3 rayDirection;
out mat3 camera;
out vec3 vPosition;

void setCamera(out mat3 camera) {
    vec3 rayDirection = vec3(0, 0, -1);
    vec3 forward = normalize(rayDirection);
    vec3 right = normalize(cross(vec3(0., 1., 0.), forward));
    vec3 up = normalize(cross(forward, right));
    camera = mat3(right, up, forward);
}

vec3 getPosition(in vec3 p) {
    float t = uTime * .5;
    p.x -= 50. * cos((p.x)*.01 - t);
    p.z -= 50. * sin((p.x-p.y)*.01 - t);
    p.y -= 50. * sin((p.y*p.y*.001-p.x)*.01 - t);
    return p;
}

void main() {
    setCamera(camera);
    vPosition = getPosition(position);

    vec4 mvPosition = modelViewMatrix * vec4(vPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (30000. / -mvPosition.z);
}
