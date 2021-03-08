uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float dt;
uniform float t;
in vec2 particleId;
out vec4 fragColor;

void main() {
    vec2 uv = gl_PointCoord - vec2(.5);
    float cUv = length(uv);
    if (cUv > .5) discard;
    vec3 velocity = texture(textureVelocity, particleId).xyz;
    vec3 particleColor = (1. - normalize(velocity)) * .5;
    fragColor = vec4(particleColor, 1.);
}
