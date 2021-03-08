const float PI = 3.14159265358979323;
const float TWO_PI = 2.0 * PI;
const float FOUR_PI = 2.0 * TWO_PI;
const float THREE_BY_FOUR_PI = (3.0 / FOUR_PI);
const float ONE_THIRD = (1.0 / 3.0);
const float c = 137.;
const float cc = 137. * 137.;
const float FOUR_PI_BY_C = FOUR_PI / c;

float radiusFromMass(float mass) {
    const float density = 1.;
    return pow(THREE_BY_FOUR_PI * mass / (density), ONE_THIRD);
}

vec3 rotateZ(vec3 r, float a) {
    return r * mat3(
    cos(a), sin(a), 0.,
    -sin(a), cos(a), 0.,
    0., 0., 1.);
}

vec4 length4(vec4 v1, vec4 v2) {
    return vec4(1);
}
void interact(inout Particle selfParticle, in Particle anotherParticle) {
    vec3 r = selfParticle.position - anotherParticle.position;
    float distanceSquared = dot(r, r);
    vec3 velocity = anotherParticle.velocity - selfParticle.velocity;
    float charge = selfParticle.charge * anotherParticle.charge;

    float srel = -dot(velocity, velocity) / (cc);
    float rel = max(sqrt(1. + srel), 0.0000001);

    //float E0 = selfParticle.mass * (c * c);

    vec3 E = normalize(r) / distanceSquared;
    vec3 Fe = charge * E;

    //vec3 B = cross(velocity, Fe);
    //vec3 Fb = cross(B, velocity);

    vec3 Fl = Fe;// + Fb;
    selfParticle.velocity += (dt * Fl) / (selfParticle.mass);
}
void interact1(inout Particle selfParticle, in Particle anotherParticle) {
    vec3 r = selfParticle.position - anotherParticle.position;
    float distanceSquared = dot(r, r);
    float distance = sqrt(distanceSquared);

    float charge = selfParticle.charge * anotherParticle.charge;
    vec3 velocity = anotherParticle.velocity - selfParticle.velocity;
    float velocitySquared = dot(velocity, velocity);

    // float relSqrt = 1. / sqrt(1. - pow(sqrt(velocitySquared) / c, 2.));

    vec3 srel = 1. - (velocity * velocity) / (c * c);
    vec3 rel = sqrt(srel);
    //vec3 P = (selfParticle.mass * velocity) / rel;
    //vec3 Fe = normalize(r) * (charge / distanceSquared);
    // vec3 Frel = (selfParticle.mass * c) / (selfParticle.mass * P);
    //vec3 crossComponent = Fe - Fe + normalize(cross(velocity, Fe));
    //Fe = (Fe - crossComponent) + crossComponent / rel;
    //Fe = (F);

    //vec3 qqr2 = normalize(r) * anotherParticle.charge * (selfParticle.charge / distanceSquared);
    //vec3 Fe2 = qqr2 / rel;
    //vec3 Fe3 = qqr2 * (sqrt(velocitySquared) / c) * (length(selfParticle.velocity) / (c * rel));

    vec3 Fe4 = normalize(r) * anotherParticle.charge * (selfParticle.charge / (distanceSquared));

    //vec3 E =  (normalize(r) * selfParticle.charge) / (distanceSquared * rel);
    //vec3 B = ((normalize(r) * selfParticle.charge) / distanceSquared) * (length(selfParticle.velocity) / (c * rel));
    //vec3 Fe5 = anotherParticle.charge * E - anotherParticle.charge * (length(anotherParticle.velocity) / c) * B;

    /*vec3 beta = velocity / c;
    float gamma = 1. / rel;
    vec3 a = normalize(r) * anotherParticle.charge * (selfParticle.charge / (distanceSquared));
    float m = selfParticle.mass*gamma;
    vec3 Fe6 = m * gamma * a + m * pow(gamma, 3.) * beta * (beta * a);*/
    vec3 P = (selfParticle.mass * velocity) / rel;
    vec3 E = (selfParticle.mass * c * c) / rel;
    vec3 E2 = P*P*c*c+selfParticle.mass*selfParticle.mass*c*c*c*c;

    selfParticle.velocity += (dt * Fe4) / (selfParticle.mass);
}
