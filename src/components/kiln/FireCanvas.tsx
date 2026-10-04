"use client";

import React, { useEffect, useRef } from "react";

/*
 * Living fire for the hero: a WebGL fragment shader of domain-warped fractal
 * noise, rising from the bottom edge and dissolving upward and at the sides,
 * coloured along the heat ramp. Rendered at reduced resolution (fire is soft,
 * the browser scales it up) and paused off screen. Under reduced motion the
 * fire keeps burning in place at a slower pace: no travel, parallax or zoom.
 * Without WebGL the CSS gradient behind it shows.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 res;
uniform float t;
uniform float pulse;
uniform float lean;
uniform vec3 mouse;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / res;
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x * aspect * 2.2, uv.y * 2.0);

  float d = distance(vec2(uv.x * aspect, uv.y), vec2(mouse.x * aspect, mouse.y));
  float pull = exp(-d * 2.5) * mouse.z;
  p.x -= (mouse.x - uv.x) * aspect * 2.2 * pull * 0.6 * lean * uv.y;

  // Domain warp, scrolling upward: the licking motion
  vec2 q = vec2(fbm(p + vec2(0.0, -t * 0.9)), fbm(p + vec2(5.2, -t * 1.1)));
  float n = fbm(p * 1.3 + q * 1.6 + vec2(0.0, -t * 1.6));

  // Hot at the floor, gone before the top; widest in the middle, fading at the sides
  float sides = smoothstep(0.0, 0.32, uv.x) * smoothstep(1.0, 0.68, uv.x);
  float height = 0.36 + 0.3 * sides + 0.12 * pulse;
  float f = (1.0 - uv.y / height) * 1.1 + (n - 0.55) * 1.1;
  f *= 0.35 + 0.65 * sides;
  f += 0.15 * pulse + 0.18 * pull;
  f = clamp(f, 0.0, 1.0);

  vec3 ember = vec3(0.56, 0.18, 0.07);
  vec3 terra = vec3(0.85, 0.38, 0.17);
  vec3 flame = vec3(0.95, 0.55, 0.22);
  vec3 glow  = vec3(1.0, 0.77, 0.43);
  vec3 hot   = vec3(1.0, 0.96, 0.86);
  vec3 c = mix(ember, terra, smoothstep(0.05, 0.3, f));
  c = mix(c, flame, smoothstep(0.3, 0.55, f));
  c = mix(c, glow, smoothstep(0.62, 0.88, f));
  c = mix(c, hot, smoothstep(0.92, 1.0, f));

  float a = smoothstep(0.02, 0.35, f);
  gl_FragColor = vec4(c * a, a);
}
`;

interface FireCanvasProps {
  className?: string;
  scale?: number;
  pulseKey?: number | bigint;
}

export const FireCanvas: React.FC<FireCanvasProps> = ({ className = "", scale = 0.5, pulseKey }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pulseAt = useRef(Number.NEGATIVE_INFINITY);
  const lastKey = useRef(pulseKey);

  useEffect(() => {
    if (pulseKey === lastKey.current) return;
    lastKey.current = pulseKey;
    pulseAt.current = performance.now();
  }, [pulseKey]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let raf = 0;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    // If the GPU drops the context, hide the canvas so the CSS glow behind it shows instead of a blank box
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "res");
    const uT = gl.getUniformLocation(prog, "t");
    const uPulse = gl.getUniformLocation(prog, "pulse");
    const uLean = gl.getUniformLocation(prog, "lean");
    const uMouse = gl.getUniformLocation(prog, "mouse");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduced ? 0.4 : 1;
    const pulseAmp = reduced ? 0.5 : 1;
    gl.uniform1f(uLean, reduced ? 0 : 1);

    const target = { x: 0.5, y: 0.5, on: 0 };
    const cur = { x: 0.5, y: 0.5, on: 0 };
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      gl.uniform1f(uT, ((time - start) / 1000) * speed);
      gl.uniform1f(uPulse, Math.exp(-(performance.now() - pulseAt.current) / 350) * pulseAmp);
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      cur.on += (target.on - cur.on) * 0.08;
      gl.uniform3f(uMouse, cur.x, cur.y, cur.on);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (time: number) => {
      draw(time);
      if (visible) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(loop);
    });
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(loop);
    };
    const onResize = () => resize();
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      if (target.on === 0 && cur.on < 0.01) {
        cur.x = x;
        cur.y = y;
      }
      target.x = x;
      target.y = y;
      target.on = 1;
    };
    const onPointerLeave = () => {
      target.on = 0;
    };

    resize();
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [scale]);

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />;
};

export default FireCanvas;
