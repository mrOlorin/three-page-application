#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
    vec3 direction;
    vec3 color;
    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float uTime;
uniform float cameraConstant;

out vec2 particleId;
const float PI = 3.14159265358979323;
const float THREE_BY_FOUR_PI = (3.0 / (4.0 * PI));
const float ONE_THIRD = (1.0 / 3.0);
const float density = 1.;

float radiusFromMass(float mass) {
    return pow(THREE_BY_FOUR_PI * mass / (density), ONE_THIRD);
}

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
