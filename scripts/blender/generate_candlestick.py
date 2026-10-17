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

def create_candlestick(output_path):
    clear_scene()

    # Materials
    mat_wood = create_pbr_material("Mat_TableWood", base_color=(0.28, 0.15, 0.08, 1.0), roughness=0.4, metallic=0.05)
    mat_brass = create_pbr_material("Mat_AntiqueBrass", base_color=(0.88, 0.68, 0.22, 1.0), roughness=0.28, metallic=0.85)
    mat_wax = create_pbr_material("Mat_CandleWax", base_color=(0.96, 0.94, 0.82, 1.0), roughness=0.6, metallic=0.0)
    mat_flame = create_pbr_material("Mat_CandleFlame", base_color=(1.0, 0.7, 0.1, 1.0), roughness=0.1, metallic=0.0, emission_color=(1.0, 0.65, 0.1, 1.0), emission_strength=4.0)
    mat_wick = create_pbr_material("Mat_CandleWick", base_color=(0.1, 0.1, 0.1, 1.0), roughness=0.9, metallic=0.0)

    root = bpy.data.objects.new("CandleTableRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Antique Wooden Round Tea Table (Table Height = 0.85m)
    # Table top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.52, depth=0.05, vertices=32)
    top = bpy.context.active_object
    top.name = "TableTop"
    top.location = (0.0, 0.0, 0.825)
    mod = top.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.01
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    top.data.materials.append(mat_wood)
    top.parent = root

    # Central Turned Pedestal Column
    for r, h, z in [(0.12, 0.1, 0.75), (0.07, 0.35, 0.52), (0.13, 0.15, 0.28), (0.18, 0.08, 0.16)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=24)
        ped = bpy.context.active_object
        ped.name = f"TablePedestal_{z}"
        ped.location = (0.0, 0.0, z)
        ped.data.materials.append(mat_wood)
        ped.parent = root

    # 3 Curved Cabriole Table Feet (120 degrees apart)
    for i in range(3):
        angle = i * (2 * math.pi / 3)
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        leg = bpy.context.active_object
        leg.name = f"TableLeg_{i}"
        leg.scale = (0.06, 0.28, 0.14)
        leg.rotation_euler = (-0.25, 0, angle)
        leg.location = (math.sin(angle) * 0.28, math.cos(angle) * 0.28, 0.07)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = leg.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.01
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        leg.data.materials.append(mat_wood)
        leg.parent = root

    # ==========================================
    # 2. Ornate Brass Candlestick (rests on top of table at z=0.85)
    # ==========================================
    candle_group = bpy.data.objects.new("CandleGroup", None)
    bpy.context.collection.objects.link(candle_group)
    candle_group.location = (0.0, 0.0, 0.85)
    candle_group.parent = root

    # Base flared plate
    bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.03, vertices=24)
    c_base = bpy.context.active_object
    c_base.name = "CandleBasePlate"
    c_base.location = (0.0, 0.0, 0.015)
    mod = c_base.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.008
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    c_base.data.materials.append(mat_brass)
    c_base.parent = candle_group

    # Fluted brass stem & turned rings
    for r, h, cz in [(0.07, 0.04, 0.05), (0.035, 0.14, 0.14), (0.055, 0.03, 0.22), (0.04, 0.05, 0.26)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=20)
        part = bpy.context.active_object
        part.name = f"CandleStem_{cz}"
        part.location = (0.0, 0.0, cz)
        part.data.materials.append(mat_brass)
        part.parent = candle_group

    # Drip catcher pan
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.02, vertices=24)
    pan = bpy.context.active_object
    pan.name = "CandleDripPan"
    pan.location = (0.0, 0.0, 0.29)
    pan.data.materials.append(mat_brass)
    pan.parent = candle_group

    # Candle Wax Column
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.20, vertices=20)
    wax = bpy.context.active_object
    wax.name = "CandleWax"
    wax.location = (0.0, 0.0, 0.40)
    mod = wax.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.005
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    wax.data.materials.append(mat_wax)
    wax.parent = candle_group

    # Wax Drips running down the side (3 drips)
    for i in range(4):
        angle = i * (math.pi / 2)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.016)
        drip = bpy.context.active_object
        drip.name = f"WaxDrip_{i}"
        drip.scale = (0.6, 0.6, 1.8)
        drip.location = (math.cos(angle) * 0.044, math.sin(angle) * 0.044, 0.46 - i * 0.025)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        drip.data.materials.append(mat_wax)
        drip.parent = candle_group

    # Black Wick
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.03, vertices=8)
    wick = bpy.context.active_object
    wick.name = "CandleWick"
    wick.location = (0.0, 0.0, 0.515)
    wick.data.materials.append(mat_wick)
    wick.parent = candle_group

    # Stylized Teardrop Candle Flame (CandleFlame mesh)
    bpy.ops.mesh.primitive_cone_add(radius1=0.035, depth=0.09, vertices=16)
    flame = bpy.context.active_object
    flame.name = "CandleFlame"
    flame.location = (0.0, 0.0, 0.56)
    flame.data.materials.append(mat_flame)
    flame.parent = candle_group

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Candlestick & Table to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\candlestick.glb")
    create_candlestick(out)
