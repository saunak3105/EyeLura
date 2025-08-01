
# 3D Glasses Models

This directory should contain your `.glb` 3D model files for the AR try-on feature.

## Required Files:
- `glasses1.glb` - First glasses model
- `glasses2.glb` - Second glasses model  
- `glasses3.glb` - Third glasses model

## Model Requirements:
- Format: `.glb` (Binary glTF)
- Optimization: Use tools like gltf-pipeline to optimize file size
- Positioning: Models should be centered and properly scaled
- Materials: Use PBR materials for realistic rendering

## Creating Models:
1. Use Blender, Maya, or other 3D software
2. Model glasses with proper proportions
3. Apply realistic materials and textures
4. Export as `.glb` format
5. Test positioning with the AR component

## File Size:
- Keep models under 1MB each for optimal loading
- Use texture compression when possible
- Consider LOD (Level of Detail) for different distances

## TODO:
Replace the placeholder paths in `ARTryOn.jsx` with your actual model files.
