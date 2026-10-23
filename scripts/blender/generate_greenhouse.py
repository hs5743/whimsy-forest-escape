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

def create_greenhouse_botanicals(output_path):
    clear_scene()

    mat_terracotta = create_pbr_material("Mat_Terracotta", base_color=(0.78, 0.42, 0.28, 1.0), roughness=0.75, metallic=0.0)
    mat_soil = create_pbr_material("Mat_RichSoil", base_color=(0.18, 0.12, 0.08, 1.0), roughness=0.9, metallic=0.0)
    mat_leaf = create_pbr_material("Mat_JungleLeaf", base_color=(0.15, 0.65, 0.25, 1.0), roughness=0.4, metallic=0.0)
    mat_petal = create_pbr_material("Mat_OrchidPetal", base_color=(0.95, 0.45, 0.65, 1.0), roughness=0.35, metallic=0.0, emission_color=(0.8, 0.2, 0.4, 1.0), emission_strength=0.8)
    mat_stamen = create_pbr_material("Mat_GoldStamen", base_color=(1.0, 0.85, 0.15, 1.0), roughness=0.2, metallic=0.3, emission_color=(1.0, 0.85, 0.15, 1.0), emission_strength=2.0)
    
    # Bee Materials
    mat_bee_yellow = create_pbr_material("Mat_BeeFuzzYellow", base_color=(0.98, 0.78, 0.12, 1.0), roughness=0.8, metallic=0.0)
    mat_bee_black = create_pbr_material("Mat_BeeBlack", base_color=(0.05, 0.05, 0.05, 1.0), roughness=0.6, metallic=0.05)
    mat_bee_wing = create_pbr_material("Mat_BeeWing", base_color=(0.85, 0.95, 1.0, 0.35), roughness=0.1, metallic=0.2)

    root = bpy.data.objects.new("GreenhouseBotanicalRoot", None)
    bpy.context.collection.objects.link(root)

    # ==========================================
    # 1. Stylized Giant Blooming Orchid Pot (Center)
    # ==========================================
    pot_root = bpy.data.objects.new("OrchidPot", None)
    bpy.context.collection.objects.link(pot_root)
    pot_root.location = (0.0, 0.0, 0.0)
    pot_root.parent = root

    # Terracotta Pot
    bpy.ops.mesh.primitive_cylinder_add(radius=0.45, depth=0.6, vertices=24)
    pot = bpy.context.active_object
    pot.name = "TerracottaPot"
    pot.location = (0.0, 0.0, 0.3)
    mod = pot.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    pot.data.materials.append(mat_terracotta)
    pot.parent = pot_root

    # Pot Rim Collar
    bpy.ops.mesh.primitive_cylinder_add(radius=0.48, depth=0.1, vertices=24)
    rim = bpy.context.active_object
    rim.name = "PotRim"
    rim.location = (0.0, 0.0, 0.55)
    rim.data.materials.append(mat_terracotta)
    rim.parent = pot_root

    # Soil
    bpy.ops.mesh.primitive_cylinder_add(radius=0.44, depth=0.05, vertices=20)
    soil = bpy.context.active_object
    soil.name = "PotSoil"
    soil.location = (0.0, 0.0, 0.53)
    soil.data.materials.append(mat_soil)
    soil.parent = pot_root

    # Curved Central Stem
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.8, vertices=12)
    stem = bpy.context.active_object
    stem.name = "FlowerStem"
    stem.rotation_euler = (0.1, 0.0, 0.0)
    stem.location = (0.0, 0.04, 0.92)
    stem.data.materials.append(mat_leaf)
    stem.parent = pot_root

    # 6 Broad Curved Green Leaves around base
    for i in range(6):
        angle = i * (math.pi / 3)
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        leaf = bpy.context.active_object
        leaf.name = f"PotLeaf_{i}"
        leaf.scale = (0.14, 0.45, 0.015)
        leaf.rotation_euler = (0.75, 0.0, angle)
        leaf.location = (math.sin(angle) * 0.28, math.cos(angle) * 0.28, 0.62)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = leaf.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.01
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        leaf.data.materials.append(mat_leaf)
        leaf.parent = pot_root

    # Blooming Magical Orchid Flower Head
    flower_head = bpy.data.objects.new("BloomingFlowerHead", None)
    bpy.context.collection.objects.link(flower_head)
    flower_head.location = (0.0, 0.08, 1.35)
    flower_head.parent = pot_root

    # 5 Sculpted Petals
    for p in range(5):
        p_angle = p * (2 * math.pi / 5)
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        petal = bpy.context.active_object
        petal.name = f"OrchidPetal_{p}"
        petal.scale = (0.16, 0.32, 0.02)
        petal.rotation_euler = (0.5, 0.0, p_angle)
        petal.location = (math.sin(p_angle) * 0.16, math.cos(p_angle) * 0.16, 0.05)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = petal.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.015
        mod.segments = 3
        bpy.ops.object.modifier_apply(modifier="Bevel")
        petal.data.materials.append(mat_petal)
        petal.parent = flower_head

    # Glowing Golden Center Stamen
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.08)
    stamen = bpy.context.active_object
    stamen.name = "FlowerStamen"
    stamen.location = (0.0, 0.0, 0.08)
    stamen.data.materials.append(mat_stamen)
    stamen.parent = flower_head

    # ==========================================
    # 2. Cute Hovering Bumblebee (Hovering to the side)
    # ==========================================
    bee_root = bpy.data.objects.new("Bumblebee", None)
    bpy.context.collection.objects.link(bee_root)
    bee_root.location = (0.65, 0.25, 1.45)
    bee_root.rotation_euler = (0.15, -0.2, 0.8)
    bee_root.parent = root

    # Fuzzy Bee Body (Egg shape)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12)
    bee_body = bpy.context.active_object
    bee_body.name = "BeeBody"
    bee_body.scale = (0.8, 1.3, 0.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bee_body.data.materials.append(mat_bee_yellow)
    bee_body.parent = bee_root

    # Black Stripes (2 toruses around body)
    for bz in [-0.03, 0.04]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.10, minor_radius=0.015, major_segments=16, minor_segments=8)
        stripe = bpy.context.active_object
        stripe.name = f"BeeStripe_{bz}"
        stripe.rotation_euler = (math.pi / 2, 0, 0)
        stripe.location = (0.0, bz, 0.0)
        stripe.data.materials.append(mat_bee_black)
        stripe.parent = bee_root

    # Cute Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075)
    bee_head = bpy.context.active_object
    bee_head.name = "BeeHead"
    bee_head.location = (0.0, 0.16, 0.0)
    bee_head.data.materials.append(mat_bee_black)
    bee_head.parent = bee_root

    # Translucent Wings (Left & Right)
    for side, wx in [(-1, -0.08), (1, 0.08)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        wing = bpy.context.active_object
        wing.name = f"BeeWing_{side}"
        wing.scale = (0.18, 0.32, 0.005)
        wing.rotation_euler = (-0.25, side * 0.4, side * 0.3)
        wing.location = (wx + side * 0.08, -0.05, 0.11)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = wing.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.008
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        wing.data.materials.append(mat_bee_wing)
        wing.parent = bee_root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Greenhouse Botanicals to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\greenhouse_botanical.glb")
    create_greenhouse_botanicals(out)
