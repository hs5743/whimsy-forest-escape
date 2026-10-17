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

def create_kitchen_hearth(output_path):
    clear_scene()

    # Materials
    mat_stone_hearth = create_pbr_material("Mat_HearthStone", base_color=(0.42, 0.40, 0.38, 1.0), roughness=0.85, metallic=0.0)
    mat_iron_grate = create_pbr_material("Mat_IronGrate", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.6, metallic=0.85)
    mat_copper_pot = create_pbr_material("Mat_HammeredCopper", base_color=(0.85, 0.42, 0.22, 1.0), roughness=0.32, metallic=0.88)
    mat_soup_broth = create_pbr_material("Mat_GoldenSoup", base_color=(0.95, 0.72, 0.18, 1.0), roughness=0.15, metallic=0.0, emission_color=(0.95, 0.65, 0.10, 1.0), emission_strength=1.8)
    mat_ember_glow = create_pbr_material("Mat_FireEmbers", base_color=(1.0, 0.35, 0.05, 1.0), roughness=0.4, metallic=0.0, emission_color=(1.0, 0.30, 0.02, 1.0), emission_strength=4.0)
    mat_wood_ladle = create_pbr_material("Mat_CarvedWood", base_color=(0.48, 0.30, 0.15, 1.0), roughness=0.7, metallic=0.0)

    root = bpy.data.objects.new("KitchenHearthRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Stone Hearth Cooking Range Block
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    hearth = bpy.context.active_object
    hearth.name = "HearthBody"
    hearth.scale = (2.2, 1.4, 0.95)
    hearth.location = (0.0, 0.0, 0.475)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = hearth.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.04
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    hearth.data.materials.append(mat_stone_hearth)
    hearth.parent = root

    # Backsplash stone chimney hood rising at back
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    backsplash = bpy.context.active_object
    backsplash.name = "HearthBacksplash"
    backsplash.scale = (2.2, 0.35, 1.2)
    backsplash.location = (0.0, -0.52, 1.55)
    backsplash.data.materials.append(mat_stone_hearth)
    backsplash.parent = root

    # 2. Glowing Fire Grate & Embers in Center Firebox
    bpy.ops.mesh.primitive_cylinder_add(radius=0.45, depth=0.1, vertices=16)
    fire_pit = bpy.context.active_object
    fire_pit.name = "FirePit"
    fire_pit.location = (0.0, 0.1, 0.98)
    fire_pit.data.materials.append(mat_ember_glow)
    fire_pit.parent = root

    # Iron burner trivet rings
    for tr_r in [0.38, 0.48]:
        bpy.ops.mesh.primitive_torus_add(major_radius=tr_r, minor_radius=0.02, major_segments=16, minor_segments=8)
        trivet = bpy.context.active_object
        trivet.name = f"TrivetRing_{tr_r}"
        trivet.location = (0.0, 0.1, 1.02)
        trivet.data.materials.append(mat_iron_grate)
        trivet.parent = root

    # 3. Heavy Hammered Copper Soup Cauldron (SOUP POT)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=0.55, vertices=24)
    cauldron = bpy.context.active_object
    cauldron.name = "SoupCauldron"
    cauldron.location = (0.0, 0.1, 1.32)
    mod = cauldron.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.03
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    cauldron.data.materials.append(mat_copper_pot)
    cauldron.parent = root

    # Two heavy brass handles on cauldron sides
    for hx in [-0.44, 0.44]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.08, minor_radius=0.018, major_segments=12, minor_segments=8)
        handle = bpy.context.active_object
        handle.name = f"CauldronHandle_{hx}"
        handle.rotation_euler = (0, math.pi / 2, 0)
        handle.location = (hx, 0.1, 1.45)
        handle.data.materials.append(mat_copper_pot)
        handle.parent = root

    # Golden bubbling soup liquid surface inside cauldron
    bpy.ops.mesh.primitive_cylinder_add(radius=0.39, depth=0.03, vertices=20)
    broth = bpy.context.active_object
    broth.name = "SoupBroth"
    broth.location = (0.0, 0.1, 1.54)
    broth.data.materials.append(mat_soup_broth)
    broth.parent = root

    # 4. Wooden Soup Ladle resting on the edge
    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.6, vertices=10)
    ladle_handle = bpy.context.active_object
    ladle_handle.name = "SoupLadle"
    ladle_handle.rotation_euler = (math.radians(-35), math.radians(20), 0)
    ladle_handle.location = (0.22, 0.22, 1.62)
    ladle_handle.data.materials.append(mat_wood_ladle)
    ladle_handle.parent = root

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, segments=12, ring_count=8)
    ladle_bowl = bpy.context.active_object
    ladle_bowl.name = "LadleBowl"
    ladle_bowl.scale = (1.0, 1.0, 0.5)
    ladle_bowl.location = (0.1, 0.1, 1.45)
    ladle_bowl.data.materials.append(mat_wood_ladle)
    ladle_bowl.parent = root

    # 5. Seasoning spice jars on hearth ledge
    mat_clay = create_pbr_material("Mat_TerracottaClay", base_color=(0.75, 0.38, 0.20, 1.0), roughness=0.75, metallic=0.0)
    for jx in [-0.75, -0.60, 0.65, 0.80]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.18, vertices=12)
        jar = bpy.context.active_object
        jar.name = f"SpiceJar_{jx}"
        jar.location = (jx, -0.4, 1.08)
        jar.data.materials.append(mat_clay)
        jar.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[KitchenHearth] Exported to: {output_path}")

def create_tavern_table(output_path):
    clear_scene()

    mat_oak = create_pbr_material("Mat_TavernOak", base_color=(0.36, 0.22, 0.12, 1.0), roughness=0.75, metallic=0.02)
    mat_ceramic = create_pbr_material("Mat_GlazedCeramic", base_color=(0.94, 0.92, 0.86, 1.0), roughness=0.25, metallic=0.05)
    mat_soup = create_pbr_material("Mat_ServingSoup", base_color=(0.95, 0.68, 0.18, 1.0), roughness=0.2, metallic=0.0, emission_color=(0.95, 0.62, 0.10, 1.0), emission_strength=1.5)
    mat_spoon = create_pbr_material("Mat_BrassSpoon", base_color=(0.92, 0.78, 0.26, 1.0), roughness=0.25, metallic=0.88)
    mat_candle_wax = create_pbr_material("Mat_TavernWax", base_color=(0.96, 0.94, 0.85, 1.0), roughness=0.4, metallic=0.0)
    mat_flame = create_pbr_material("Mat_TavernFlame", base_color=(1.0, 0.8, 0.2, 1.0), roughness=0.1, metallic=0.0, emission_color=(1.0, 0.7, 0.1, 1.0), emission_strength=4.0)

    root = bpy.data.objects.new("TavernTableRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Thick Oak Tabletop
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    top = bpy.context.active_object
    top.name = "TableTop"
    top.scale = (2.4, 1.4, 0.12)
    top.location = (0.0, 0.0, 0.96)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = top.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.02
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    top.data.materials.append(mat_oak)
    top.parent = root

    # 2. Sturdy Trestle Legs & Stretcher
    for lx in [-0.85, 0.85]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        leg = bpy.context.active_object
        leg.name = f"TableLeg_{lx}"
        leg.scale = (0.14, 1.1, 0.9)
        leg.location = (lx, 0.0, 0.45)
        leg.data.materials.append(mat_oak)
        leg.parent = root

    # Center stretcher beam
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    stretcher = bpy.context.active_object
    stretcher.name = "TableStretcher"
    stretcher.scale = (1.8, 0.08, 0.14)
    stretcher.location = (0.0, 0.0, 0.25)
    stretcher.data.materials.append(mat_oak)
    stretcher.parent = root

    # 3. Two Long Oak Benches along sides
    for by, b_name in [(-1.05, "BenchNorth"), (1.05, "BenchSouth")]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        bench = bpy.context.active_object
        bench.name = b_name
        bench.scale = (2.2, 0.38, 0.08)
        bench.location = (0.0, by, 0.52)
        bench.data.materials.append(mat_oak)
        bench.parent = root

        for bx in [-0.8, 0.8]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.48, vertices=10)
            b_leg = bpy.context.active_object
            b_leg.name = f"{b_name}_Leg_{bx}"
            b_leg.location = (bx, by, 0.24)
            b_leg.data.materials.append(mat_oak)
            b_leg.parent = root

    # 4. Tableware: Ceramic Soup Bowls with Steaming Soup & Brass Spoons
    for i, (sx, sy) in enumerate([(-0.55, -0.32), (0.55, -0.32), (-0.55, 0.32), (0.55, 0.32)]):
        # Bowl
        bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.11, vertices=16)
        bowl = bpy.context.active_object
        bowl.name = f"SoupBowl_{i}"
        bowl.location = (sx, sy, 1.08)
        bowl.data.materials.append(mat_ceramic)
        bowl.parent = root

        # Soup inside bowl
        bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.02, vertices=14)
        soup = bpy.context.active_object
        soup.name = f"ServingSoup_{i}"
        soup.location = (sx, sy, 1.12)
        soup.data.materials.append(mat_soup)
        soup.parent = root

        # Brass Spoon
        bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.22, vertices=8)
        spoon = bpy.context.active_object
        spoon.name = f"BrassSpoon_{i}"
        spoon.rotation_euler = (0, 0, math.radians(70))
        spoon.location = (sx + 0.22, sy, 1.04)
        spoon.data.materials.append(mat_spoon)
        spoon.parent = root

    # 5. Central Ambient Candle Lamp
    bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.18, vertices=12)
    candle = bpy.context.active_object
    candle.name = "TableCandle"
    candle.location = (0.0, 0.0, 1.12)
    candle.data.materials.append(mat_candle_wax)
    candle.parent = root

    bpy.ops.mesh.primitive_cone_add(radius1=0.025, radius2=0.0, depth=0.06, vertices=8)
    flame = bpy.context.active_object
    flame.name = "TableCandleFlame"
    flame.location = (0.0, 0.0, 1.24)
    flame.data.materials.append(mat_flame)
    flame.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[TavernTable] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_kitchen_hearth(os.path.join(out_dir, "restaurant_kitchen_hearth.glb"))
    create_tavern_table(os.path.join(out_dir, "tavern_dining_table.glb"))
