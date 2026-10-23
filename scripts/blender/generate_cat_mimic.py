import bpy
import bmesh
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

def create_cat_mimic(output_path):
    clear_scene()

    # Materials
    mat_wood = create_pbr_material("Mat_ChestWood", base_color=(0.32, 0.16, 0.08, 1.0), roughness=0.55, metallic=0.05)
    mat_iron = create_pbr_material("Mat_ChestIron", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.35, metallic=0.8)
    mat_gold = create_pbr_material("Mat_ChestGold", base_color=(0.92, 0.72, 0.22, 1.0), roughness=0.25, metallic=0.85)
    mat_ear = create_pbr_material("Mat_CatEar", base_color=(0.85, 0.52, 0.38, 1.0), roughness=0.6, metallic=0.0)
    mat_ear_inner = create_pbr_material("Mat_EarInner", base_color=(0.98, 0.72, 0.75, 1.0), roughness=0.7, metallic=0.0)
    mat_interior = create_pbr_material("Mat_MouthInterior", base_color=(0.15, 0.03, 0.04, 1.0), roughness=0.8, metallic=0.0)
    mat_tongue = create_pbr_material("Mat_CatTongue", base_color=(0.95, 0.35, 0.45, 1.0), roughness=0.3, metallic=0.0)
    mat_fang = create_pbr_material("Mat_CatFang", base_color=(0.95, 0.95, 0.9, 1.0), roughness=0.2, metallic=0.05)

    root = bpy.data.objects.new("MimicRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Chest Lower Body (Hollowed interior feel)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    body = bpy.context.active_object
    body.name = "ChestBody"
    body.scale = (0.7, 0.45, 0.5)
    body.location = (0.0, 0.0, 0.225)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = body.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.02
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    body.data.materials.append(mat_wood)
    body.parent = root

    # Corner Iron Reinforcements on Body
    for cx in [-0.34, 0.34]:
        for cz in [-0.24, 0.24]:
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            corner_bracket = bpy.context.active_object
            corner_bracket.name = f"BodyBracket_{cx}_{cz}"
            corner_bracket.scale = (0.05, 0.05, 0.44)
            corner_bracket.location = (cx, cz, 0.225)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            mod = corner_bracket.modifiers.new(name="Bevel", type='BEVEL')
            mod.width = 0.005
            mod.segments = 2
            bpy.ops.object.modifier_apply(modifier="Bevel")
            corner_bracket.data.materials.append(mat_iron)
            corner_bracket.parent = root

    # Bottom Base Iron Skirt
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    base_skirt = bpy.context.active_object
    base_skirt.name = "BaseSkirt"
    base_skirt.scale = (0.72, 0.52, 0.04)
    base_skirt.location = (0.0, 0.0, 0.02)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = base_skirt.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.006
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    base_skirt.data.materials.append(mat_iron)
    base_skirt.parent = root

    # Mouth Interior (Dark cavity inside)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    cavity = bpy.context.active_object
    cavity.name = "MouthCavity"
    cavity.scale = (0.62, 0.40, 0.15)
    cavity.location = (0.0, 0.0, 0.36)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    cavity.data.materials.append(mat_interior)
    cavity.parent = root

    # Cat Tongue
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    tongue = bpy.context.active_object
    tongue.name = "CatTongue"
    tongue.scale = (0.16, 0.22, 0.03)
    tongue.location = (0.0, 0.16, 0.43)
    tongue.rotation_euler = (0.2, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    mod = tongue.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    tongue.data.materials.append(mat_tongue)
    tongue.parent = root

    # Cute Lower Fangs (2 little pointy teeth)
    for fx in [-0.18, 0.18]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.02, depth=0.05, vertices=8)
        fang = bpy.context.active_object
        fang.name = f"LowerFang_{fx}"
        fang.location = (fx, 0.21, 0.46)
        fang.data.materials.append(mat_fang)
        fang.parent = root

    # Front Cat Face Lock Plate (Keyhole & Whiskers)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    lock_plate = bpy.context.active_object
    lock_plate.name = "CatLockPlate"
    lock_plate.scale = (0.14, 0.02, 0.16)
    lock_plate.location = (0.0, 0.255, 0.40)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = lock_plate.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.008
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    lock_plate.data.materials.append(mat_gold)
    lock_plate.parent = root

    # Cat Whiskers on lock plate
    for wy in [-0.02, 0.02]:
        for side in [-1, 1]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.003, depth=0.06, vertices=8)
            whisker = bpy.context.active_object
            whisker.name = f"Whisker_{side}_{wy}"
            whisker.rotation_euler = (0, math.pi / 2, side * 0.15)
            whisker.location = (side * 0.09, 0.262, 0.40 + wy)
            whisker.data.materials.append(mat_gold)
            whisker.parent = root

    # ==========================================
    # 2. Chest Lid (Hinged at top-back z=0.45, y=-0.25)
    # Matching Three.js mimicLid rotation pivot!
    # ==========================================
    lid_hinge = bpy.data.objects.new("MimicLid", None)
    bpy.context.collection.objects.link(lid_hinge)
    # Hinge axis position at back edge of chest top
    lid_hinge.location = (0.0, -0.25, 0.45)
    lid_hinge.parent = root

    # Barrel Vault Lid
    # In local lid coords, back hinge is at y=0, z=0, lid extends forward towards y=0.5
    bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.7, vertices=24)
    lid_mesh = bpy.context.active_object
    lid_mesh.name = "LidArch"
    lid_mesh.rotation_euler = (0, math.pi / 2, 0)
    lid_mesh.location = (0.0, 0.25, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    
    # Scale into curved half-barrel
    lid_mesh.scale = (1.0, 1.0, 0.7)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    lid_mesh.data.materials.append(mat_wood)
    lid_mesh.parent = lid_hinge

    # Lid Iron Arch Bands (2 arched metal bands over the top)
    for bx in [-0.24, 0.24]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.26, depth=0.05, vertices=24)
        band = bpy.context.active_object
        band.name = f"LidBand_{bx}"
        band.rotation_euler = (0, math.pi / 2, 0)
        band.location = (bx, 0.25, 0.0)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        band.scale = (1.0, 1.0, 0.71)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        band.data.materials.append(mat_iron)
        band.parent = lid_hinge

    # Cat Ears on Lid (Left & Right)
    for ex in [-0.22, 0.22]:
        # Outer Ear
        bpy.ops.mesh.primitive_cone_add(radius1=0.07, depth=0.18, vertices=4)
        ear = bpy.context.active_object
        ear.name = f"CatEarOuter_{ex}"
        ear.rotation_euler = (0.3, 0.0, -math.copysign(0.25, ex))
        ear.location = (ex, 0.22, 0.20)
        ear.data.materials.append(mat_ear)
        ear.parent = lid_hinge

        # Inner Ear Pink Fluff
        bpy.ops.mesh.primitive_cone_add(radius1=0.045, depth=0.14, vertices=4)
        ear_in = bpy.context.active_object
        ear_in.name = f"CatEarInner_{ex}"
        ear_in.rotation_euler = (0.3, 0.0, -math.copysign(0.25, ex))
        ear_in.location = (ex, 0.25, 0.20)
        ear_in.data.materials.append(mat_ear_inner)
        ear_in.parent = lid_hinge

    # Upper Cat Fangs on Lid
    for fx in [-0.15, 0.15]:
        bpy.ops.mesh.primitive_cone_add(radius1=0.022, depth=0.06, vertices=8)
        ufang = bpy.context.active_object
        ufang.name = f"UpperFang_{fx}"
        ufang.rotation_euler = (math.pi, 0, 0)
        ufang.location = (fx, 0.49, 0.0)
        ufang.data.materials.append(mat_fang)
        ufang.parent = lid_hinge

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Cat Mimic to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\cat_mimic.glb")
    create_cat_mimic(out)
