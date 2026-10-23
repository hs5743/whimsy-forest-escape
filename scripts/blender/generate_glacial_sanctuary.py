import bpy
import bmesh
import math
import os

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, emission_color=(0, 0, 0, 1.0), emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = base_color
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metallic
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = emission_color
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = emission_color
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat

def create_glacial_obelisk(output_path):
    clear_scene()

    mat_permafrost_rock = create_pbr_material("Mat_PermafrostRock", base_color=(0.30, 0.35, 0.42, 1.0), roughness=0.85, metallic=0.05)
    mat_glacial_ice = create_pbr_material("Mat_GlacialIce", base_color=(0.55, 0.88, 0.98, 0.8), roughness=0.12, metallic=0.15, emission_color=(0.25, 0.75, 0.95, 1.0), emission_strength=1.8)
    mat_frost_rune = create_pbr_material("Mat_FrostRuneGlow", base_color=(0.6, 0.95, 1.0, 1.0), roughness=0.05, metallic=0.0, emission_color=(0.5, 0.95, 1.0, 1.0), emission_strength=4.8)

    root = bpy.data.objects.new("GlacialObeliskRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Carved Permafrost Dais Platform
    bpy.ops.mesh.primitive_cylinder_add(radius=1.8, depth=0.45, vertices=6)
    dais = bpy.context.active_object
    dais.name = "PermafrostDais"
    dais.location = (0.0, 0.0, 0.225)
    dais.data.materials.append(mat_permafrost_rock)
    dais.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=1.35, depth=0.35, vertices=6)
    dais_upper = bpy.context.active_object
    dais_upper.name = "DaisUpperTier"
    dais_upper.location = (0.0, 0.0, 0.55)
    dais_upper.data.materials.append(mat_permafrost_rock)
    dais_upper.parent = root

    # 2. Main Glacial Ice Obelisk (Towering hexagonal crystal monolith)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.75, depth=4.8, vertices=6)
    obelisk = bpy.context.active_object
    obelisk.name = "IceMonolith"
    obelisk.location = (0.0, 0.0, 2.95)
    obelisk.data.materials.append(mat_glacial_ice)
    obelisk.parent = root

    # Sharply faceted hexagonal crystal pyramid cap at top
    bpy.ops.mesh.primitive_cone_add(radius1=0.75, radius2=0.0, depth=1.6, vertices=6)
    cap = bpy.context.active_object
    cap.name = "CrystalPyramidCap"
    cap.location = (0.0, 0.0, 6.15)
    cap.data.materials.append(mat_glacial_ice)
    cap.parent = root

    # 3. Glowing Frost Runes carved down the obelisk facets
    for r_z in [1.8, 2.8, 3.8, 4.8]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        rune = bpy.context.active_object
        rune.name = f"FrostRune_{r_z}"
        rune.scale = (0.12, 0.12, 0.28)
        rune.rotation_euler = (0, 0, math.radians(45))
        rune.location = (0.0, 0.73, r_z)
        rune.data.materials.append(mat_frost_rune)
        rune.parent = root

    # 4. Floating Satellite Frost Crystal Shards surrounding the monolith
    for i in range(4):
        angle = i * (math.pi / 2) + math.radians(25)
        dist = 1.35
        bpy.ops.mesh.primitive_cone_add(radius1=0.22, radius2=0.0, depth=0.85, vertices=5)
        shard = bpy.context.active_object
        shard.name = f"FloatingShard_{i}"
        shard.rotation_euler = (math.radians(15), math.radians(i * 35), angle)
        shard.location = (math.cos(angle) * dist, math.sin(angle) * dist, 2.5 + (i % 2) * 0.8)
        shard.data.materials.append(mat_frost_rune)
        shard.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[GlacialObelisk] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_glacial_obelisk(os.path.join(out_dir, "glacial_obelisk.glb"))
