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

def create_marble_fountain(output_path):
    clear_scene()

    mat_carrara = create_pbr_material("Mat_CarraraMarble", base_color=(0.94, 0.94, 0.92, 1.0), roughness=0.35, metallic=0.05)
    mat_brass_gargoyle = create_pbr_material("Mat_FountainBrass", base_color=(0.92, 0.78, 0.28, 1.0), roughness=0.25, metallic=0.85)
    mat_water = create_pbr_material("Mat_ClearFountainWater", base_color=(0.35, 0.78, 0.95, 0.75), roughness=0.08, metallic=0.1, emission_color=(0.20, 0.65, 0.88, 1.0), emission_strength=1.2)

    root = bpy.data.objects.new("MarbleFountainRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Outer Lower Basin (Octagonal reservoir)
    bpy.ops.mesh.primitive_cylinder_add(radius=2.6, depth=0.5, vertices=12)
    outer_rim = bpy.context.active_object
    outer_rim.name = "BasinOuterRim"
    outer_rim.location = (0.0, 0.0, 0.25)
    outer_rim.data.materials.append(mat_carrara)
    outer_rim.parent = root

    # Lower Water Pool Surface
    bpy.ops.mesh.primitive_cylinder_add(radius=2.45, depth=0.05, vertices=16)
    water_pool = bpy.context.active_object
    water_pool.name = "WaterPoolSurface"
    water_pool.location = (0.0, 0.0, 0.45)
    water_pool.data.materials.append(mat_water)
    water_pool.parent = root

    # 2. Central Fluted Marble Pedestal
    bpy.ops.mesh.primitive_cylinder_add(radius=0.6, depth=1.1, vertices=16)
    pedestal = bpy.context.active_object
    pedestal.name = "CentralPedestal"
    pedestal.location = (0.0, 0.0, 0.85)
    pedestal.data.materials.append(mat_carrara)
    pedestal.parent = root

    # Fluted pedestal decorative rings
    for rz in [0.45, 1.25]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.62, minor_radius=0.04, major_segments=16, minor_segments=8)
        ring = bpy.context.active_object
        ring.name = f"PedestalRing_{rz}"
        ring.location = (0.0, 0.0, rz)
        ring.data.materials.append(mat_carrara)
        ring.parent = root

    # 3. Middle Carved Fountain Bowl (Upper tier)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.35, depth=0.35, vertices=20)
    mid_bowl = bpy.context.active_object
    mid_bowl.name = "UpperTierBowl"
    mid_bowl.location = (0.0, 0.0, 1.48)
    mid_bowl.data.materials.append(mat_carrara)
    mid_bowl.parent = root

    # Middle Water Surface
    bpy.ops.mesh.primitive_cylinder_add(radius=1.28, depth=0.03, vertices=16)
    mid_water = bpy.context.active_object
    mid_water.name = "UpperTierWater"
    mid_water.location = (0.0, 0.0, 1.62)
    mid_water.data.materials.append(mat_water)
    mid_water.parent = root

    # 4. Four Brass Spout Nozzles around Middle Bowl
    for i in range(4):
        angle = i * (math.pi / 2)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.25, vertices=10)
        spout = bpy.context.active_object
        spout.name = f"BrassSpout_{i}"
        spout.rotation_euler = (math.sin(angle) * math.radians(75), -math.cos(angle) * math.radians(75), angle)
        spout.location = (math.cos(angle) * 1.35, math.sin(angle) * 1.35, 1.55)
        spout.data.materials.append(mat_brass_gargoyle)
        spout.parent = root

    # 5. Top Classical Bubbling Finial
    bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.65, vertices=12)
    top_pillar = bpy.context.active_object
    top_pillar.name = "TopPillar"
    top_pillar.location = (0.0, 0.0, 1.95)
    top_pillar.data.materials.append(mat_carrara)
    top_pillar.parent = root

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.26, segments=16, ring_count=10)
    finial_sphere = bpy.context.active_object
    finial_sphere.name = "BubblingWaterFinial"
    finial_sphere.location = (0.0, 0.0, 2.38)
    finial_sphere.data.materials.append(mat_water)
    finial_sphere.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[MarbleFountain] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_marble_fountain(os.path.join(out_dir, "marble_fountain.glb"))
