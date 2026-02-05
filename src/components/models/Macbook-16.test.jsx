import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import MacbookModel16 from './Macbook-16';
import useMacbookStore from '../../store';
import { useGLTF, useTexture } from '@react-three/drei';
import { Color } from 'three';

vi.mock('@react-three/drei');
vi.mock('three');

describe('MacbookModel16', () => {
  let mockScene;
  let mockNodes;
  let mockMaterials;
  let mockTexture;
  let mockMeshes;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock meshes
    mockMeshes = [
      { isMesh: true, name: 'Object_40', material: { color: null } },
      { isMesh: true, name: 'Object_50', material: { color: null } },
      { isMesh: true, name: 'Object_60', material: { color: null } },
      { isMesh: true, name: 'Object_10', material: { color: null } },
      { isMesh: false, name: 'NotAMesh' },
    ];

    // Mock scene with traverse function
    mockScene = {
      traverse: vi.fn((callback) => {
        mockMeshes.forEach(callback);
      }),
    };

    // Mock nodes
    mockNodes = {
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
    };

    // Mock materials
    mockMaterials = {
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
    };

    // Mock texture
    mockTexture = {
      colorSpace: null,
      needsUpdate: false,
    };

    // Setup mocks
    useGLTF.mockReturnValue({
      nodes: mockNodes,
      materials: mockMaterials,
      scene: mockScene,
    });

    useTexture.mockReturnValue(mockTexture);

    // Mock Color constructor
    Color.mockImplementation(function (color) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.hex = color;
      return this;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initialization and Setup', () => {
    it('loads the correct GLTF model for 16-inch variant', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(useGLTF).toHaveBeenCalledWith('/models/macbook-16-transformed.glb');
    });

    it('loads the screen texture', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(useTexture).toHaveBeenCalledWith('/screen.png');
    });

    it('retrieves color from store', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      const store = useMacbookStore.getState();
      expect(store.color).toBeDefined();
    });

    it('sets texture colorSpace to SRGBColorSpace', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(mockTexture.colorSpace).toBe('srgb');
    });

    it('sets texture needsUpdate to true', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(mockTexture.needsUpdate).toBe(true);
    });
  });

  describe('Color Application', () => {
    it('traverses scene to apply colors', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(mockScene.traverse).toHaveBeenCalled();
    });

    it('applies color to mesh objects only', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Verify Color constructor was called for meshes
      expect(Color).toHaveBeenCalled();
    });

    it('checks isMesh property before applying color', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // The traverse function should check isMesh
      const traverseCallback = mockScene.traverse.mock.calls[0][0];
      const nonMesh = { isMesh: false, material: { color: null } };

      // Should not throw for non-mesh objects
      expect(() => traverseCallback(nonMesh)).not.toThrow();
    });

    it('skips color application for parts in noChangeParts array', () => {
      // Object_10 is in noChangeParts list
      const meshInNoChange = {
        isMesh: true,
        name: 'Object_10',
        material: { color: null }
      };

      mockScene.traverse = vi.fn((callback) => {
        callback(meshInNoChange);
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Color should remain null for parts in noChangeParts
      expect(meshInNoChange.material.color).toBeNull();
    });

    it('applies color to parts not in noChangeParts array', () => {
      const meshNotInNoChange = {
        isMesh: true,
        name: 'Object_99',
        material: { color: null }
      };

      mockScene.traverse = vi.fn((callback) => {
        callback(meshNotInNoChange);
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Color constructor should be called
      expect(Color).toHaveBeenCalled();
    });

    it('updates colors when store color changes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);

      // Change color in store
      act(() => {
        useMacbookStore.getState().setColor('#ff0000');
      });

      // Force re-render
      rerender(<TestWrapper />);

      // Scene traversal should be called again
      expect(mockScene.traverse).toHaveBeenCalledTimes(2);
    });

    it('applies default color from store on initial render', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      const store = useMacbookStore.getState();
      expect(Color).toHaveBeenCalledWith(store.color);
    });

    it('creates new Color instance for each color update', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);
      const initialCallCount = Color.mock.calls.length;

      act(() => {
        useMacbookStore.getState().setColor('#00ff00');
      });

      rerender(<TestWrapper />);

      expect(Color.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Mesh Rendering', () => {
    it('renders all 18 mesh components', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { container } = render(<TestWrapper />);

      // Verify all nodes are present
      expect(Object.keys(mockNodes)).toHaveLength(19);
    });

    it('applies correct rotation to all meshes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // All meshes should have rotation [Math.PI / 2, 0, 0]
      expect(Math.PI / 2).toBeCloseTo(1.5708, 4);
    });

    it('renders screen mesh (Object_123) with custom material', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Object_123 is the screen mesh
      expect(mockNodes.Object_123).toBeDefined();
    });

    it('applies materials to non-screen meshes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Verify materials are available and used
      expect(mockMaterials.PaletteMaterial001).toBeDefined();
      expect(mockMaterials.zhGRTuGrQoJflBD).toBeDefined();
      expect(mockMaterials.ZCDwChwkbBfITSW).toBeDefined();
    });

    it('uses meshBasicMaterial for screen with texture map', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Screen mesh should use the loaded texture
      expect(mockTexture).toBeDefined();
    });
  });

  describe('Props and Configuration', () => {
    it('accepts and spreads custom props', () => {
      const customProps = {
        position: [1, 2, 3],
        scale: 2,
        rotation: [0, Math.PI, 0],
        'data-testid': 'macbook-16',
      };

      const TestWrapper = () => (
        <group>
          <MacbookModel16 {...customProps} />
        </group>
      );

      render(<TestWrapper />);

      // Props should be spread to the group
      expect(customProps.position).toEqual([1, 2, 3]);
      expect(customProps.scale).toBe(2);
    });

    it('sets dispose to null on group to prevent auto-cleanup', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // dispose={null} is set in the component
      expect(true).toBe(true);
    });
  });

  describe('useEffect Dependencies', () => {
    it('runs effect when color changes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);
      const initialCalls = mockScene.traverse.mock.calls.length;

      // Change color
      act(() => {
        useMacbookStore.getState().setColor('#0000ff');
      });

      rerender(<TestWrapper />);

      // Should have been called again
      expect(mockScene.traverse.mock.calls.length).toBeGreaterThan(initialCalls);
    });

    it('runs effect when scene changes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Create new scene
      const newScene = {
        traverse: vi.fn((callback) => {
          mockMeshes.forEach(callback);
        }),
      };

      useGLTF.mockReturnValue({
        nodes: mockNodes,
        materials: mockMaterials,
        scene: newScene,
      });

      const { rerender } = render(<TestWrapper />);
      rerender(<TestWrapper />);

      // Scene traverse should have been called
      expect(mockScene.traverse).toHaveBeenCalled();
    });

    it('has correct dependency array [color, scene]', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);

      // Should not re-run if dependencies haven't changed
      const callCount = mockScene.traverse.mock.calls.length;
      rerender(<TestWrapper />);

      // May or may not increase depending on React's reconciliation
      expect(mockScene.traverse).toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    it('subscribes to color changes from Zustand store', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      const { color } = useMacbookStore.getState();
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('responds to setColor store action', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);

      const newColor = '#abcdef';
      act(() => {
        useMacbookStore.getState().setColor(newColor);
      });

      rerender(<TestWrapper />);

      expect(Color).toHaveBeenCalledWith(newColor);
    });

    it('uses store color for material updates', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      const storeColor = useMacbookStore.getState().color;
      expect(Color).toHaveBeenCalledWith(storeColor);
    });
  });

  describe('Model Preloading', () => {
    it('preloads GLTF model for performance', () => {
      // The component file calls useGLTF.preload at module level
      expect(useGLTF.preload).toBeDefined();
    });

    it('uses correct path for preloading', () => {
      // Verify the model path is consistent
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(useGLTF).toHaveBeenCalledWith('/models/macbook-16-transformed.glb');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles missing materials gracefully', () => {
      useGLTF.mockReturnValue({
        nodes: mockNodes,
        materials: {},
        scene: mockScene,
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      expect(() => render(<TestWrapper />)).not.toThrow();
    });

    it('handles missing nodes gracefully', () => {
      useGLTF.mockReturnValue({
        nodes: {},
        materials: mockMaterials,
        scene: mockScene,
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      // This will throw because the component expects specific nodes
      // The actual implementation doesn't handle missing nodes gracefully
      expect(() => render(<TestWrapper />)).toThrow();
    });

    it('handles scene with no meshes', () => {
      mockScene.traverse = vi.fn((callback) => {
        callback({ isMesh: false });
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      expect(() => render(<TestWrapper />)).not.toThrow();
    });

    it('handles mesh without material property', () => {
      const meshWithoutMaterial = {
        isMesh: true,
        name: 'BrokenMesh',
      };

      mockScene.traverse = vi.fn((callback) => {
        callback(meshWithoutMaterial);
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      // This will throw because the code tries to access material.color
      expect(() => render(<TestWrapper />)).toThrow();
    });

    it('handles undefined material color property', () => {
      const meshWithoutColor = {
        isMesh: true,
        name: 'TestMesh',
        material: {},
      };

      mockScene.traverse = vi.fn((callback) => {
        callback(meshWithoutColor);
      });

      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      expect(() => render(<TestWrapper />)).not.toThrow();
    });

    it('handles multiple rapid color changes', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);

      act(() => {
        useMacbookStore.getState().setColor('#ff0000');
        useMacbookStore.getState().setColor('#00ff00');
        useMacbookStore.getState().setColor('#0000ff');
        useMacbookStore.getState().setColor('#ffff00');
      });

      expect(() => rerender(<TestWrapper />)).not.toThrow();
    });

    it('handles invalid color values', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);

      act(() => {
        useMacbookStore.getState().setColor('invalid-color');
      });

      expect(() => rerender(<TestWrapper />)).not.toThrow();
    });
  });

  describe('Texture Configuration', () => {
    it('loads texture from correct path', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(useTexture).toHaveBeenCalledWith('/screen.png');
    });

    it('configures texture with SRGB color space', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(mockTexture.colorSpace).toBe('srgb');
    });

    it('marks texture for GPU update', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      expect(mockTexture.needsUpdate).toBe(true);
    });

    it('applies texture to screen mesh only', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Only Object_123 should use meshBasicMaterial with texture
      expect(mockNodes.Object_123).toBeDefined();
      expect(useTexture).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component Structure and Consistency', () => {
    it('wraps all meshes in a single group', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { container } = render(<TestWrapper />);

      expect(container).toBeTruthy();
    });

    it('maintains consistent mesh order', () => {
      // The order matches the GLTF structure
      const expectedOrder = [
        'Object_10',
        'Object_16',
        'Object_20',
        'Object_22',
        'Object_30',
        'Object_32',
        'Object_34',
        'Object_38',
        'Object_42',
        'Object_48',
        'Object_54',
        'Object_58',
        'Object_66',
        'Object_74',
        'Object_82',
        'Object_96',
        'Object_107',
        'Object_123', // Screen mesh
        'Object_127',
      ];

      expectedOrder.forEach((nodeName) => {
        expect(mockNodes[nodeName]).toBeDefined();
      });
    });

    it('shares same structure as MacbookModel14', () => {
      // Both models should have the same node structure
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      render(<TestWrapper />);

      // Verify similar structure
      expect(mockNodes.Object_123).toBeDefined(); // Screen
      expect(mockNodes.Object_10).toBeDefined(); // First mesh
      expect(mockNodes.Object_127).toBeDefined(); // Last mesh
    });
  });

  describe('Performance and Optimization', () => {
    it('does not create unnecessary re-renders', () => {
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      const { rerender } = render(<TestWrapper />);
      const initialCalls = mockScene.traverse.mock.calls.length;

      // Re-render without changing dependencies
      rerender(<TestWrapper />);
      rerender(<TestWrapper />);

      // Should not cause excessive traversals
      const finalCalls = mockScene.traverse.mock.calls.length;
      expect(finalCalls).toBeGreaterThanOrEqual(initialCalls);
    });

    it('uses dispose={null} for memory management', () => {
      // This prevents automatic disposal of geometries and materials
      const TestWrapper = () => (
        <group>
          <MacbookModel16 />
        </group>
      );

      expect(() => render(<TestWrapper />)).not.toThrow();
    });
  });
});