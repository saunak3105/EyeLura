// Enhanced model loading utilities
export class ModelLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  async preloadModel(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          this.cache.set(path, gltf);
          this.loadingPromises.delete(path);
          resolve(gltf);
        },
        (progress) => {
          // Progress callback
          console.log(`Loading ${path}: ${(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          this.loadingPromises.delete(path);
          reject(error);
        }
      );
    });

    this.loadingPromises.set(path, loadPromise);
    return loadPromise;
  }

  async preloadAllModels(modelPaths) {
    const promises = modelPaths.map(path => this.preloadModel(path));
    return Promise.allSettled(promises);
  }

  getModel(path) {
    return this.cache.get(path);
  }

  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const modelLoader = new ModelLoader();

// Fallback model generator for when GLB files fail to load
export function createFallbackGlasses(style = 'classic') {
  const styles = {
    classic: { 
      frameColor: '#2c2c2c', 
      lensColor: '#87CEEB', 
      lensOpacity: 0.25,
      frameThickness: 0.06 
    },
    aviator: { 
      frameColor: '#E8E8E8', 
      lensColor: '#1a1a2e', 
      lensOpacity: 0.4,
      frameThickness: 0.04 
    },
    modern: { 
      frameColor: '#1a1a1a', 
      lensColor: '#191970', 
      lensOpacity: 0.25,
      frameThickness: 0.08 
    }
  };

  const config = styles[style] || styles.classic;

  return {
    scene: {
      children: [
        // This would be a procedurally generated glasses model
        // For now, we'll use the existing Three.js geometry approach
      ]
    }
  };
}