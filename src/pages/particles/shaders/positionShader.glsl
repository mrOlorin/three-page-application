uniform float time;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture(texturePosition, uv);
    vec3 position = tmpPos.xyz;
    vec3 velocity = texture(textureVelocity, uv).xyz;

    float phase = tmpPos.w;

    gl_FragColor = vec4(position + velocity, phase);
}
