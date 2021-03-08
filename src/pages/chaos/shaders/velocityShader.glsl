uniform float t;
uniform float dt;
const float width = resolution.x;
const float height = resolution.y;
const vec2 size = vec2(width, height);

struct Particle {
    vec3 position;
    vec3 velocity;
    float charge;
    float mass;
};

void fetchParticle(in vec2 uv, out Particle particle) {
    vec4 positionData = texture2D(texturePosition, uv);
    vec4 velocityData = texture2D(textureVelocity, uv);
    particle.position = positionData.xyz;
    particle.velocity = velocityData.xyz;
    particle.mass = positionData.w;
    particle.charge = velocityData.w;
}

vec3 lorenzAttractor(in vec3 p, in float t, in float dt) {
    dt *= 3.;
    float a = 10. + 3. * cos(t);
    const float b = 28.;
    const float c = 8./3.;
    return dt * vec3(
        a * (p.y - p.x),
        p.x * (b - p.z) - p.y,
        p.x * p.y - c * p.z
    );
}

vec3 aizawaAttractor(in vec3 p, in float t, in float dt) {
    float a = .95;
    float b = .7;
    float c = .6;
    float d = 3.5;
    float e = .25;
    float f = .01;
    return dt * vec3(
    (p.z - b) * p.x - d * p.y,
    d * p.x + (p.z - b) * p.y,
    c + a * p.z - pow(p.z, 3.) / 3. - p.x * p.x + f * p.z * pow(p.x, 3.)
    );
}

vec3 halvorsenAttractor (in vec3 p, in float t, in float dt) {
    float a = 1.4;
    return dt * vec3(
    -a * p.x - 4. * p.y - 4. * p.z - p.y * p.y,
    -a * p.y - 4. * p.z - 4. * p.x - p.z * p.z,
    -a * p.z - 4. * p.x - 4. * p.y - p.x * p.x
    );
}

vec3 thomasAttractor(in vec3 p, in float phase, in float dt) {
    dt *= 100.;
    float b = .173 + .07 * cos(phase);
    return dt * vec3(
        sin(p.y) - b * p.x,
        sin(p.z) - b * p.y,
        sin(p.x) - b * p.z
    );
}

void main() {
    Particle selfParticle, anotherParticle;
    vec2 selfId, anotherId;
    selfId = gl_FragCoord.xy / size;
    fetchParticle(selfId, selfParticle);

    selfParticle.velocity = thomasAttractor(selfParticle.position, t, dt);
    gl_FragColor = vec4(selfParticle.velocity, selfParticle.charge);
}
