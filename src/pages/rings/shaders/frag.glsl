#define PI 3.141592653589793

#define MAX_STEPS 128
#define MAX_DIST 100.
#define MIN_DIST .0001
#define GAMMA_CORRECTION vec3(0.45454545454545453)

uniform vec3 rayOrigin;
uniform float uTime;

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

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float sdf(in vec3 p) {
    vec2 t = vec2(1.2, .5);
    vec2 q = vec2(length(p.xy)-t.x,p.z);
    float torus = length(q)-t.y;
    return torus;
}
Material getMaterial(in vec3 p) {
    Material m;
    m.color.rg = vec2(1.5-vPosition*.003);
    m.diffuse = .3;
    m.specular = .2;
    m.ambient = .2;
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

vec3 getNormal(in vec3 p) {
    const vec2 swizzleStep = vec2(MIN_DIST, 0);
    return normalize(sdf(p) - vec3(
        sdf(p - swizzleStep.xyy),
        sdf(p - swizzleStep.yxy),
        sdf(p - swizzleStep.yyx)
    ));
}
float softShadow(in vec3 point, in vec3 lightDir) {
    return 1.;
    /*point += lightDir * .1;
    float totalDist = .1;
    float result = 1.;
    float d;
    for ( int i = 0; i < 32; i ++ ) {
        d = sdf(point);
        if (d <= MIN_DIST) return 0.;
        result = min(result, d / (totalDist * .001));
        totalDist += d;
        if (totalDist > 10.) return result;
        point += lightDir * d;
    }
    return result;*/
}
float calcAO(in vec3 p, in vec3 n) {
    return 1.;
    /*float k = 1.;
    float occ = 0.;
    float len;
    for ( float i = 1.; i < 6.; i += 1. ) {
        len = .15 * i;
        occ += (len - sdf(n * len + p)) * k;
        k *= .5;
    }
    return clamp(1. - occ, 0., 1.);*/
}
vec3 phongLighting(in vec3 p, in Material mat, in vec3 ray) {
    vec3 normal = getNormal(p);
    vec3 lightPos = vec3(-1, -1, 3);
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
    vec2 uv = gl_PointCoord - vec2(.5);
    // fragColor = getColor(rayOrigin, normalize(camera * vec3(uv, .6)));
    fragColor = getColor(vec3(0,0,3), normalize(camera * vec3(uv, .6)));
    //if (length(gl_PointCoord.xy - .5) > .5) discard;
    //fragColor = vec4(vec3(0), 1.0);
}
