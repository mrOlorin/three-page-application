#define PI 3.141592653589793

#define MAX_STEPS 128
#define MAX_DIST 2000.
#define MIN_DIST .001
#define GAMMA_CORRECTION vec3(0.45454545454545453)

uniform vec3 rayOrigin;
uniform float uTime;
uniform vec2 resolution;

in mat3 camera;
in vec3 vPosition;

out vec4 fragColor;

struct Material {
    vec3 color;
    float diffuse;
    float specular;
    float ambient;
    float shininess;
    float receiveShadows;
};

mat2 rotate2d(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(s, c, c, -s);
}
mat2 rotateq(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(s, c, c, -s);
}
float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5*(d2-d1)/k, 0.0, 1.0);
    return mix(d2, d1, h) - k*h*(1.0-h);
}
float opSmoothSubtraction(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5*(d2+d1)/k, 0.0, 1.0);
    return mix(d2, -d1, h) + k*h*(1.0-h); }

float opSmoothIntersection(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5*(d2-d1)/k, 0.0, 1.0);
    return mix(d2, d1, h) + k*h*(1.0-h); }
float sdBox( vec3 p, vec3 b ) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdBox4 (vec4 p, vec4 b) {
    p = abs(p) - b;
    return min(max(p.x, max(p.y, max(p.z, p.w))), 0.0) + length(max(p, 0.0));
}

float sdBoundingBox(vec3 p, vec3 b, float e) {
    p = abs(p) - b;
    vec3 q = abs(p + e) - e;
    return min(min(length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
    length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
    length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}
float sdBoundingBox4(vec4 p, vec4 b, float e) {
    p = abs(p) - b;
    vec4 q = abs(p + e) - e;

    //float x3 = length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0);
    float x = length(max(vec4(p.x, q.y, q.z, q.w), 0.0)) + min(max(p.x, max(q.y, max(q.z, q.w))), 0.0);

    //float y3 = length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0);
    float y = length(max(vec4(q.x, p.y, q.z, q.w), 0.0)) + min(max(q.x, max(p.y, max(q.z, q.w))), 0.0);

    //float z3 = length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0);
    float z = length(max(vec4(q.x, q.y, p.z, q.w), 0.0)) + min(max(q.x, max(q.y, max(p.z, q.w))), 0.0);

    float w = length(max(vec4(q.x, q.y, q.z, p.w), 0.0)) + min(max(q.x, max(q.y, max(q.z, p.w))), 0.0);
    //return min(x3, min(y3, z3));
    return min(x, min(y, min(z, w)));
}
float sdBoundingBoxes(in vec3 p) {
    float d = MAX_DIST;
    float t = uTime * .05;
    mat2 r;
    for (float i = 1.; i <= 3.; i+= 1.) {
        r = rotate2d(t);
        p.xy *= r;
        p.yz *= r;
        p.zx *= r;
        d = min(d, sdBoundingBox(p, vec3(i), .1));
    }
    return d;
}
float sdTorus(in vec3 p, in vec2 t) {
    vec2 q = vec2(length(p.xy)-t.x, p.z);
    return length(q)-t.y;
}
float sdDuoCylinder(vec4 p, vec2 t) {
    vec2 q = abs(vec2(length(p.xz), length(p.yw))) - t;
    return min(max(q.x, q.y), 0.) + length(max(q, 0.));
}
float sdCircle(in vec2 p, in float r) {
    return length(p) - r;
}
float sdSphere(in vec3 p, in float r) {
    return length(p) - r;
}
float sdRoundedX( in vec2 p, in float w, in float r ) {
    p = abs(p);
    return length(p-min(p.x + p.y,w) * 0.5) - r;
}
float sdRectangle( in vec2 p, in vec2 b ) {
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}
float sdTorusKnot(in vec3 p) {
    float r1 = 5.;
    float r2 = .5;
    float thickness = .1;
    vec2 cp = vec2(sdCircle(p.xy, r1), p.z);
    float a = atan(p.x, p.y) * 0.5;
    cp *= rotate2d(a);
    //cp.y = abs(cp.y) - .1;
    return sdRectangle(cp, vec2(r2, thickness)) * .9;
}
float sdToruses(in vec3 p) {
    float d = MAX_DIST;
    float t = uTime * .03;
    mat2 r;
    vec3 pt;
    for (float i = 1.; i <= 10.; i+= 1.1) {
        pt = p;
        r = rotate2d(t*i);
        pt.yz *= r;
        pt.xy *= r;
        pt.zx *= r;
        float radius = i-.9;
        float thickness = .2;
        d = opSmoothUnion(d, sdTorus(pt, vec2(radius, thickness)), 2.);
    }
    return d;
}
vec4 mul(vec4 q1, vec4 q2) {
    return vec4(
        q1.w * q2.w + dot(q1.xyz, q2.xyz),
        q1.xyz * q2.w + q2.xyz * q1.w + cross(q1.xyz, q2.xyz)
    );
}
vec4 mul(vec4 q, vec3 v) {
    return vec4(
        -q.x * v.x - q.y * v.y - q.z * q.z,
        q.w * v.x + q.y * v.z + q.z * q.y,
        q.w * v.y + q.z * v.x + q.x * q.z,
        q.w * v.z + q.x * v.y + q.y * q.x
    );
}
float backWall(vec3 p) {
    return p.z + 30.;
}
float sdf(in vec3 p) {
    return min(sdToruses(p), backWall(p));
}
Material getMaterial(in vec3 p) {
    Material m;
    m.color = vec3(1., 1., 1.);
    m.diffuse = .4;
    m.specular = 0.2;
    m.ambient = 0.4;
    m.shininess = 1.;
    m.receiveShadows = 1.;
    return m;
}

float raymarch(in vec3 rayOrigin, in vec3 rayDirection) {
    float distance = 0.;
    float stepDistance;
    for (int i = 0; i < MAX_STEPS; i++) {
        stepDistance = sdf(rayOrigin + rayDirection * distance);
        distance += stepDistance;
        if (stepDistance <= MIN_DIST || stepDistance >= MAX_DIST) break;
    }
    return distance;
}

const vec2 swizzleStep = vec2(MIN_DIST, 0);
vec3 getNormal(in vec3 p) {
    return normalize(sdf(p) -
    vec3(sdf(p - swizzleStep.xyy), sdf(p - swizzleStep.yxy), sdf(p - swizzleStep.yyx)));
}
float softShadow(in vec3 point, in vec3 lightDir) {
    point += lightDir * .1;
    float totalDist = .1;
    float result = 1.;
    float d;
    for (int i = 0; i < 32; i ++) {
        d = sdf(point);
        if (d <= MIN_DIST) return 0.;
        result = min(result, d / (totalDist * .001));
        totalDist += d;
        if (totalDist > 10.) return result;
        point += lightDir * d;
    }
    return result;
}
float calcAO(in vec3 p, in vec3 n) {
    float k = 1.;
    float occ = 0.;
    float len;
    for (float i = 1.; i < 6.; i += 1.) {
        len = .15 * i;
        occ += (len - sdf(n * len + p)) * k;
        k *= .5;
    }
    return clamp(1. - occ, 0., 1.);
}
vec3 phongLighting(in vec3 p, in Material mat, in vec3 ray) {
    vec3 normal = getNormal(p);
    vec3 lightPos = vec3(38, 8, 38);
    vec3 lightDir = normalize(lightPos - p);
    float diffuse = max(0., mat.diffuse * dot(normal, lightDir));
    float specular = pow(max(0., mat.specular * dot(lightDir, reflect(ray, normal))), mat.shininess);
    float shadow = mat.receiveShadows * softShadow(p, lightDir) * calcAO(p, normal);
    return (mat.ambient + diffuse * shadow) * pow(mat.color, GAMMA_CORRECTION) + specular * shadow * vec3(1.);
}
vec4 getColor(in vec3 origin, in vec3 direction) {
    float distance = raymarch(origin, direction);
    if (distance >= MAX_DIST) {
        discard;
    }
    vec3 p = origin + direction * distance;
    Material material = getMaterial(p);
    vec3 color = phongLighting(p, material, direction);
    return vec4(color, 1.);//blend(color, FOG_COLOR, hitObject.distance / FOG_DIST);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;
    fragColor = getColor(rayOrigin, normalize(camera * vec3(uv, .6)));
}
