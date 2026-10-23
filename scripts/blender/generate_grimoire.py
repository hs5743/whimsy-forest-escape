import bpy
import bmesh
import math
import os

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_pbr_material(name, base_color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, emission_color=(0, 0, 0, 1.0), emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        # Principled BSDF inputs in Blender 4.x / 5.x
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

def create_grimoire(output_path):
    clear_scene()

    # Materials
    mat_leather = create_pbr_material("Mat_Leather", base_color=(0.18, 0.05, 0.04, 1.0), roughness=0.45, metallic=0.05)
    mat_gold = create_pbr_material("Mat_Gold", base_color=(0.95, 0.78, 0.25, 1.0), roughness=0.25, metallic=0.85)
    mat_pages = create_pbr_material("Mat_Pages", base_color=(0.92, 0.86, 0.72, 1.0), roughness=0.85, metallic=0.0)
    mat_rune = create_pbr_material("Mat_RuneGlow", base_color=(0.3, 0.8, 1.0, 1.0), roughness=0.1, metallic=0.1, emission_color=(0.2, 0.8, 1.0, 1.0), emission_strength=3.0)
    mat_gem = create_pbr_material("Mat_RubyGem", base_color=(0.9, 0.05, 0.15, 1.0), roughness=0.1, metallic=0.2, emission_color=(0.8, 0.05, 0.15, 1.0), emission_strength=1.5)

    # Root Grimoire object (Empty)
    root = bpy.data.objects.new("GrimoireRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Back Cover
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    back_cover = bpy.context.active_object
    back_cover.name = "BackCover"
    back_cover.scale = (0.46, 0.36, 0.02)
    back_cover.location = (0.0, 0.0, -0.045)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    # Bevel Back Cover
    mod = back_cover.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.006
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    back_cover.data.materials.append(mat_leather)
    back_cover.parent = root

    # 2. Pages Block
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    pages = bpy.context.active_object
    pages.name = "PagesBlock"
    pages.scale = (0.42, 0.33, 0.07)
    pages.location = (0.01, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = pages.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.003
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    pages.data.materials.append(mat_pages)
    pages.parent = root

    # 3. Spine
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.36, vertices=16)
    spine = bpy.context.active_object
    spine.name = "BookSpine"
    spine.rotation_euler = (math.pi / 2, 0, 0)
    spine.location = (-0.23, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    spine.data.materials.append(mat_leather)
    spine.parent = root

    # Decorative Spine Ribs (3 gold bands)
    for i, y_pos in enumerate([-0.1, 0.0, 0.1]):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.048, minor_radius=0.005, major_segments=16, minor_segments=8)
        rib = bpy.context.active_object
        rib.name = f"SpineRib_{i}"
        rib.rotation_euler = (math.pi / 2, 0, 0)
        rib.location = (-0.23, y_pos, 0.0)
        rib.data.materials.append(mat_gold)
        rib.parent = root

    # 4. Front Cover Hinge (Empty/Group placed at hinge line x=-0.23, z=0.043)
    hinge = bpy.data.objects.new("BookCoverHinge", None)
    bpy.context.collection.objects.link(hinge)
    hinge.location = (-0.23, 0.0, 0.043)
    hinge.parent = root

    # Front Cover Mesh attached to hinge
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    front_cover = bpy.context.active_object
    front_cover.name = "FrontCover"
    front_cover.scale = (0.46, 0.36, 0.02)
    # Relative to hinge at (-0.23, 0, 0.043), center is at (+0.23, 0, 0)
    front_cover.location = (0.23, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = front_cover.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.006
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    front_cover.data.materials.append(mat_leather)
    front_cover.parent = hinge

    # Front Cover Ornate Gold Corners (4 corners)
    for cx in [-0.19, 0.19]:
        for cy in [-0.14, 0.14]:
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            corner = bpy.context.active_object
            corner.name = f"Corner_{cx}_{cy}"
            corner.scale = (0.05, 0.05, 0.025)
            corner.location = (0.23 + cx, cy, 0.005)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            mod = corner.modifiers.new(name="Bevel", type='BEVEL')
            mod.width = 0.004
            mod.segments = 2
            bpy.ops.object.modifier_apply(modifier="Bevel")
            corner.data.materials.append(mat_gold)
            corner.parent = hinge

    # Front Cover Magic Runic Circle
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.006, vertices=32)
    rune_circle = bpy.context.active_object
    rune_circle.name = "RunicCircle"
    rune_circle.location = (0.23, 0.0, 0.015)
    rune_circle.data.materials.append(mat_rune)
    rune_circle.parent = hinge

    # Central Ruby Gem (faceted octahedron-like crystal)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.035)
    gem = bpy.context.active_object
    gem.name = "CenterGem"
    gem.scale = (1.0, 1.0, 0.6)
    gem.location = (0.23, 0.0, 0.022)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    gem.data.materials.append(mat_gem)
    gem.parent = hinge

    # 5. Floating Magic Key (KeyMesh, positioned inside book)
    key_root = bpy.data.objects.new("KeyMesh", None)
    bpy.context.collection.objects.link(key_root)
    key_root.location = (0.0, 0.0, 0.0)
    key_root.parent = root

    # Key Bow (Ring)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.045, minor_radius=0.012, major_segments=24, minor_segments=12)
    key_bow = bpy.context.active_object
    key_bow.name = "KeyBow"
    key_bow.location = (0.0, 0.0, 0.06)
    key_bow.data.materials.append(mat_gold)
    key_bow.parent = key_root

    # Key Shaft
    bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.12, vertices=16)
    key_shaft = bpy.context.active_object
    key_shaft.name = "KeyShaft"
    key_shaft.location = (0.0, 0.0, -0.01)
    key_shaft.data.materials.append(mat_gold)
    key_shaft.parent = key_root

    # Key Teeth
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    key_bit = bpy.context.active_object
    key_bit.name = "KeyBit"
    key_bit.scale = (0.01, 0.03, 0.04)
    key_bit.location = (0.0, 0.018, -0.05)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    key_bit.data.materials.append(mat_gold)
    key_bit.parent = key_root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Grimoire to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\grimoire.glb")
    create_grimoire(out)
