uniform sampler2D pointTexture;
in vec3 vColor;
out vec4 fragColor;

float sdLine(in vec2 p, in vec2 a, in vec2 b)
{
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float sdSnowflake(in vec2 p)
{
    const vec2 k = vec2(0.5, -0.86602540378);
    p = p.yx;
    p = abs(p);
    p -= 2.0 * min(dot(k, p), 0.0) * k;
    p = abs(p);
    float d = sdLine(p, vec2(.00, 0), vec2(.75, 0));
    d = min(d, sdLine(p, vec2(.50, 0), vec2(.50, 0) + .10));
    d = min(d, sdLine(p, vec2(.25, 0), vec2(.25, 0) + .15));
    return d - .04;
}

void main() {
    if (length(gl_PointCoord.xy - .5) > .4) discard;
    //fragColor = vec4(vec3(.1/sdSnowflake(1. - 2.*gl_PointCoord.xy)), 1.);
    fragColor = vec4(vColor, 1.0) * texture(pointTexture, gl_PointCoord);
}
