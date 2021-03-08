uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float dt;
uniform float t;
in vec2 particleId;
out vec4 fragColor;

const float hBar = 1.;

vec2 cExp(float x) {
    float s = sin(x);
    return vec2(-s, s) + cos(x);
}
vec2 psi(float p, float m) {
    float E = 1.;

    float K = sqrt(2. * m * E) / hBar;
    float A = .07;
    float B = .07;
    float hBarKOverTwoMT = ((hBar * K) / 2. * m) * t * .0000001;
    return A * cExp(K * (p - hBarKOverTwoMT)) + B * cExp(-K * (p + hBarKOverTwoMT));
}
float dist(vec3 ro, vec3 rd, vec3 p) {
    return length(cross(p-ro, rd)) / length(rd);
}
void main() {
    vec2 uv = gl_PointCoord - vec2(.5);
    float cUv = length(uv);
    float charge = texture(textureVelocity, particleId).w;
    vec4 particlePosition = texture(texturePosition, particleId);

    vec3 chargeColor = vec3(.548, 0., -.548);

    vec3 ro = vec3(0, 0, -1.5);
    vec3 rd = vec3(uv, 0) - ro;
    vec3 p = vec3(0, 0, 0);
    chargeColor.xy += psi(particlePosition.z, particlePosition.w);
    chargeColor.yz += psi(particlePosition.x, particlePosition.w);
    chargeColor.zx += psi(particlePosition.y, particlePosition.w);
    float d = dist(ro, rd, p);

    d = smoothstep(.5, 0., d);
    fragColor = vec4(chargeColor * charge, d);
}
