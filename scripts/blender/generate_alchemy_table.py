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

def create_alchemy_table(output_path):
    clear_scene()

    # Materials
    mat_stone = create_pbr_material("Mat_BasaltStone", base_color=(0.14, 0.14, 0.16, 1.0), roughness=0.7, metallic=0.05)
    mat_rune_gold = create_pbr_material("Mat_RuneGoldInlay", base_color=(0.95, 0.82, 0.28, 1.0), roughness=0.2, metallic=0.9, emission_color=(0.95, 0.82, 0.28, 1.0), emission_strength=1.2)
    mat_glass = create_pbr_material("Mat_FlaskGlass", base_color=(0.9, 0.95, 1.0, 0.3), roughness=0.1, metallic=0.1)
    mat_liquid = create_pbr_material("Mat_PotionLiquid", base_color=(0.6, 0.35, 0.95, 0.85), roughness=0.15, metallic=0.0, emission_color=(0.5, 0.2, 0.9, 1.0), emission_strength=1.5)
    mat_cork = create_pbr_material("Mat_CorkStopper", base_color=(0.55, 0.38, 0.22, 1.0), roughness=0.9, metallic=0.0)
    mat_star = create_pbr_material("Mat_StarStone", base_color=(1.0, 0.9, 0.2, 1.0), roughness=0.15, metallic=0.2, emission_color=(1.0, 0.85, 0.1, 1.0), emission_strength=3.5)
    mat_ceramic = create_pbr_material("Mat_CeramicMortar", base_color=(0.85, 0.82, 0.78, 1.0), roughness=0.5, metallic=0.0)

    root = bpy.data.objects.new("AlchemyRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Carved Basalt Stone Table Top (1.6m x 1.0m, height at 0.85m)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    slab = bpy.context.active_object
    slab.name = "StoneSlab"
    slab.scale = (1.6, 1.0, 0.12)
    slab.location = (0.0, 0.0, 0.79)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = slab.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.02
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    slab.data.materials.append(mat_stone)
    slab.parent = root

    # Inlaid Gold Transmutation Circle Ring on Table Top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.38, depth=0.003, vertices=32)
    circle = bpy.context.active_object
    circle.name = "TransmutationCircle"
    circle.location = (0.0, 0.0, 0.852)
    circle.data.materials.append(mat_rune_gold)
    circle.parent = root

    # 4 Carved Heavy Stone Column Legs
    for lx in [-0.65, 0.65]:
        for ly in [-0.38, 0.38]:
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            col = bpy.context.active_object
            col.name = f"StoneLeg_{lx}_{ly}"
            col.scale = (0.18, 0.18, 0.73)
            col.location = (lx, ly, 0.365)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            mod = col.modifiers.new(name="Bevel", type='BEVEL')
            mod.width = 0.015
            mod.segments = 2
            bpy.ops.object.modifier_apply(modifier="Bevel")
            col.data.materials.append(mat_stone)
            col.parent = root

    # Lower Stone Stretcher Shelf
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    shelf = bpy.context.active_object
    shelf.name = "LowerStoneShelf"
    shelf.scale = (1.4, 0.8, 0.06)
    shelf.location = (0.0, 0.0, 0.18)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    shelf.data.materials.append(mat_stone)
    shelf.parent = root

    # ==========================================
    # 2. Glass Alchemy Flask & Potion Liquid
    # ==========================================
    # Flask Glass Outer Vessel
    bpy.ops.mesh.primitive_cone_add(radius1=0.20, depth=0.36, vertices=24)
    flask = bpy.context.active_object
    flask.name = "AlchemyFlaskGlass"
    flask.location = (0.0, 0.0, 1.03)
    flask.data.materials.append(mat_glass)
    flask.parent = root

    # Flask Neck
    bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.14, vertices=20)
    neck = bpy.context.active_object
    neck.name = "FlaskNeck"
    neck.location = (0.0, 0.0, 1.25)
    neck.data.materials.append(mat_glass)
    neck.parent = root

    # Cork Stopper
    bpy.ops.mesh.primitive_cylinder_add(radius=0.058, depth=0.06, vertices=16)
    stopper = bpy.context.active_object
    stopper.name = "CorkStopper"
    stopper.location = (0.0, 0.0, 1.33)
    stopper.data.materials.append(mat_cork)
    stopper.parent = root

    # Liquid Volume Inside Flask (Named FlaskLiquid for Three.js color swapping)
    bpy.ops.mesh.primitive_cone_add(radius1=0.18, depth=0.26, vertices=24)
    liquid = bpy.context.active_object
    liquid.name = "FlaskLiquid"
    liquid.location = (0.0, 0.0, 0.98)
    liquid.data.materials.append(mat_liquid)
    liquid.parent = root

    # ==========================================
    # 3. Floating Faceted Star Stone (StarStone)
    # ==========================================
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.15)
    star = bpy.context.active_object
    star.name = "StarStone"
    star.location = (0.0, 0.0, 1.45)
    star.data.materials.append(mat_star)
    star.parent = root

    # ==========================================
    # 4. Alchemical Accessories on Table
    # ==========================================
    # Mortar and Pestle on the side
    bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.10, vertices=20)
    mortar = bpy.context.active_object
    mortar.name = "Mortar"
    mortar.location = (-0.52, 0.22, 0.90)
    mortar.data.materials.append(mat_ceramic)
    mortar.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.14, vertices=12)
    pestle = bpy.context.active_object
    pestle.name = "Pestle"
    pestle.rotation_euler = (0.35, 0.2, 0)
    pestle.location = (-0.50, 0.20, 0.94)
    pestle.data.materials.append(mat_ceramic)
    pestle.parent = root

    # Two Small Herb Potion Vials
    for i, vx in enumerate([0.48, 0.58]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.12, vertices=16)
        vial = bpy.context.active_object
        vial.name = f"HerbVial_{i}"
        vial.location = (vx, 0.25, 0.91)
        vial.data.materials.append(mat_glass)
        vial.parent = root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Alchemy Table to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\alchemy_table.glb")
    create_alchemy_table(out)
