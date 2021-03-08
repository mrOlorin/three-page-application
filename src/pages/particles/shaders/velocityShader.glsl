uniform float t;
uniform float dt;

struct Particle {
    vec3 position;
    vec3 velocity;
    float charge;
    float mass;
};

// {{velocityFunction}}

void fetchParticle(in vec2 uv, out Particle particle) {
    vec4 positionData = texture2D(texturePosition, uv);
    vec4 velocityData = texture2D(textureVelocity, uv);
    particle.position = positionData.xyz;
    particle.velocity = velocityData.xyz;
    particle.mass = positionData.w;
    particle.charge = velocityData.w;
}

const float width = resolution.x;
const float height = resolution.y;
const vec2 size = vec2(width, height);

void main() {
    Particle selfParticle, anotherParticle;
    vec2 selfId, anotherId;
    selfId = gl_FragCoord.xy / size;
    fetchParticle(selfId, selfParticle);
    if (selfParticle.mass > 0.) {
        for (float y = 0.0; y < height; y++) {
            for (float x = 0.0; x < width; x++) {
                anotherId = vec2(x + 0.5, y + 0.5) / size;
                fetchParticle(anotherId, anotherParticle);
                if (selfId == anotherId || anotherParticle.mass == 0.) continue;
                interact(selfParticle, anotherParticle);
            }
        }
    }
    gl_FragColor = vec4(selfParticle.velocity, selfParticle.charge);
}
