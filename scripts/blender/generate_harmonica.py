import bpy
import math
import os

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, emission_color=(0, 0, 0, 1.0), emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
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

def create_chromatic_harmonica(output_path):
    clear_scene()

    # Materials: Polished Chrome, Dark Acrylic Comb, Brass Reeds, Velvet Display Cushion
    mat_chrome = create_pbr_material("Mat_ChromePlate", base_color=(0.95, 0.95, 0.98, 1.0), roughness=0.12, metallic=0.98)
    mat_comb = create_pbr_material("Mat_BlackComb", base_color=(0.06, 0.06, 0.07, 1.0), roughness=0.35, metallic=0.1)
    mat_brass = create_pbr_material("Mat_ReedBrass", base_color=(0.90, 0.75, 0.25, 1.0), roughness=0.25, metallic=0.88)
    mat_velvet = create_pbr_material("Mat_RoyalVelvet", base_color=(0.08, 0.18, 0.35, 1.0), roughness=0.85, metallic=0.0)
    mat_box = create_pbr_material("Mat_DisplayWood", base_color=(0.20, 0.10, 0.05, 1.0), roughness=0.4, metallic=0.05)

    root = bpy.data.objects.new("HarmonicaRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Wooden Display Stand Box
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    box = bpy.context.active_object
    box.name = "DisplayCase"
    box.scale = (1.4, 0.7, 0.12)
    box.location = (0.0, 0.0, 0.06)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = box.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    box.data.materials.append(mat_box)
    box.parent = root

    # Velvet Inset Cushion
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    cushion = bpy.context.active_object
    cushion.name = "VelvetCushion"
    cushion.scale = (1.28, 0.58, 0.04)
    cushion.location = (0.0, 0.0, 0.11)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = cushion.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.01
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    cushion.data.materials.append(mat_velvet)
    cushion.parent = root

    # 2. Harmonica Assembly (Tilted slightly on display cushion)
    harmonica = bpy.data.objects.new("HarmonicaBody", None)
    bpy.context.collection.objects.link(harmonica)
    harmonica.location = (0.0, 0.0, 0.22)
    harmonica.rotation_euler = (0.22, 0.0, 0.0) # Slight tilt towards camera
    harmonica.parent = root

    # Central Acrylic Comb (琴身內格)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    comb = bpy.context.active_object
    comb.name = "HarmonicaComb"
    comb.scale = (0.96, 0.24, 0.10)
    comb.location = (0.0, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    comb.data.materials.append(mat_comb)
    comb.parent = harmonica

    # 12 Mouth Holes on Front Edge (12 音孔)
    for i in range(12):
        hx = -0.42 + i * 0.076
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        hole = bpy.context.active_object
        hole.name = f"SoundHole_{i+1}"
        hole.scale = (0.048, 0.03, 0.065)
        hole.location = (hx, 0.122, 0.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        hole.data.materials.append(mat_comb)
        hole.parent = harmonica

    # Brass Reed Plates (Upper and Lower)
    for rz in [-0.052, 0.052]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        reed = bpy.context.active_object
        reed.name = f"ReedPlate_{rz}"
        reed.scale = (0.97, 0.25, 0.012)
        reed.location = (0.0, 0.0, rz)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        reed.data.materials.append(mat_brass)
        reed.parent = harmonica

    # Top & Bottom Curved Chrome Cover Plates (弧形鍍鉻蓋板)
    for side, cz in [(-1, -0.075), (1, 0.075)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        plate = bpy.context.active_object
        plate.name = f"CoverPlate_{side}"
        plate.scale = (1.00, 0.26, 0.03)
        plate.location = (0.0, 0.0, cz)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = plate.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.012
        mod.segments = 3
        bpy.ops.object.modifier_apply(modifier="Bevel")
        plate.data.materials.append(mat_chrome)
        plate.parent = harmonica

    # Chromatic Slider Spring Button (半音推鍵 - 右側按鈕)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.08, vertices=16)
    btn = bpy.context.active_object
    btn.name = "SliderButton"
    btn.rotation_euler = (0, math.pi / 2, 0)
    btn.location = (0.54, 0.08, 0.0)
    btn.data.materials.append(mat_chrome)
    btn.parent = harmonica

    # Fastening Screws on ends
    for sx in [-0.48, 0.48]:
        for sy in [-0.08, 0.08]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.01, vertices=12)
            screw = bpy.context.active_object
            screw.name = f"Screw_{sx}_{sy}"
            screw.location = (sx, sy, 0.092)
            screw.data.materials.append(mat_chrome)
            screw.parent = harmonica

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Chromatic Harmonica to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\chromatic_harmonica.glb")
    create_chromatic_harmonica(out)
