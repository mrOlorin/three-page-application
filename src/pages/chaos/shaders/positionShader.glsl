uniform float time;

void main() {
    vec2 particleId = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture(texturePosition, particleId).xyz;
    vec3 velocity = texture(textureVelocity, particleId).xyz;
    gl_FragColor = vec4(position + velocity, 1.);
}
