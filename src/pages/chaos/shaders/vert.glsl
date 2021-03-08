uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float uTime;
uniform float cameraConstant;

out vec2 particleId;

void main() {
    particleId = uv;
    vec4 posTemp = texture(texturePosition, particleId);
    vec3 pos = posTemp.xyz;
    vec4 velTemp = texture(textureVelocity, particleId);
    vec3 vel = velTemp.xyz;
    float mass = velTemp.w;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = cameraConstant / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
