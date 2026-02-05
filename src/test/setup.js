import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
    })),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
  },
  ScrollTrigger: {},
  SplitText: {},
}));

// Mock @gsap/react
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => {
    // Execute callback immediately in tests
    if (typeof callback === 'function') {
      callback();
    }
  }),
}));

// Mock react-responsive
vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false),
}));

// Mock react-three/fiber
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    scene: {},
    gl: {},
  })),
}));

// Mock react-three/drei
vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(() => ({
    nodes: {
      Object_10: { geometry: {} },
      Object_16: { geometry: {} },
      Object_20: { geometry: {} },
      Object_22: { geometry: {} },
      Object_30: { geometry: {} },
      Object_32: { geometry: {} },
      Object_34: { geometry: {} },
      Object_38: { geometry: {} },
      Object_42: { geometry: {} },
      Object_48: { geometry: {} },
      Object_54: { geometry: {} },
      Object_58: { geometry: {} },
      Object_66: { geometry: {} },
      Object_74: { geometry: {} },
      Object_82: { geometry: {} },
      Object_96: { geometry: {} },
      Object_107: { geometry: {} },
      Object_123: { geometry: {} },
      Object_127: { geometry: {} },
    },
    materials: {
      PaletteMaterial001: {},
      zhGRTuGrQoJflBD: {},
      PaletteMaterial002: {},
      lmWQsEjxpsebDlK: {},
      LtEafgAVRolQqRw: {},
      iyDJFXmHelnMTbD: {},
      eJObPwhgFzvfaoZ: {},
      nDsMUuDKliqGFdU: {},
      CRQixVLpahJzhJc: {},
      YYwBgwvcyZVOOAA: {},
      SLGkCohDDelqXBu: {},
      WnHKXHhScfUbJQi: {},
      fNHiBfcxHUJCahl: {},
      LpqXZqhaGCeSzdu: {},
      gMtYExgrEUqPfln: {},
      PaletteMaterial003: {},
      JvMFZolVCdpPqjj: {},
      ZCDwChwkbBfITSW: {},
    },
    scene: {
      traverse: vi.fn((callback) => {
        // Mock mesh objects
        const mockMeshes = [
          { isMesh: true, name: 'Object_50', material: { color: null } },
          { isMesh: true, name: 'Object_60', material: { color: null } },
          { isMesh: true, name: 'Object_10', material: { color: null } },
        ];
        mockMeshes.forEach(callback);
      }),
    },
  })),
  useTexture: vi.fn(() => ({
    colorSpace: null,
    needsUpdate: false,
  })),
}));

// Mock Three.js Color
vi.mock('three', () => ({
  Color: vi.fn(function(color) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.set = vi.fn();
    return this;
  }),
  SRGBColorSpace: 'srgb',
}));

// Mock HTML media elements
window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};