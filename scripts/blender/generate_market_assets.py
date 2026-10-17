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

def create_market_stall(output_path):
    clear_scene()

    # Materials
    mat_wood = create_pbr_material("Mat_OakWood", base_color=(0.35, 0.22, 0.12, 1.0), roughness=0.75, metallic=0.02)
    mat_dark_wood = create_pbr_material("Mat_DarkWood", base_color=(0.20, 0.12, 0.07, 1.0), roughness=0.8, metallic=0.0)
    mat_awning_red = create_pbr_material("Mat_AwningRed", base_color=(0.85, 0.15, 0.15, 1.0), roughness=0.7, metallic=0.0)
    mat_awning_cream = create_pbr_material("Mat_AwningCream", base_color=(0.96, 0.93, 0.82, 1.0), roughness=0.6, metallic=0.0)
    mat_brass = create_pbr_material("Mat_Brass", base_color=(0.92, 0.75, 0.25, 1.0), roughness=0.25, metallic=0.85)
    mat_wicker = create_pbr_material("Mat_WickerBasket", base_color=(0.72, 0.55, 0.32, 1.0), roughness=0.85, metallic=0.0)
    mat_apple = create_pbr_material("Mat_RedApple", base_color=(0.88, 0.08, 0.08, 1.0), roughness=0.35, metallic=0.05)
    mat_banana = create_pbr_material("Mat_YellowBanana", base_color=(0.95, 0.85, 0.12, 1.0), roughness=0.45, metallic=0.0)
    mat_iron = create_pbr_material("Mat_CastIron", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.6, metallic=0.8)

    root = bpy.data.objects.new("MarketStallRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Timber Table Top
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    counter = bpy.context.active_object
    counter.name = "CounterTop"
    counter.scale = (2.4, 1.1, 0.1)
    counter.location = (0.0, 0.0, 0.95)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = counter.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    counter.data.materials.append(mat_wood)
    counter.parent = root

    # 2. Four Table Legs
    for x in [-1.05, 1.05]:
        for y in [-0.45, 0.45]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.9, vertices=12)
            leg = bpy.context.active_object
            leg.name = f"CounterLeg_{x}_{y}"
            leg.location = (x, y, 0.45)
            leg.data.materials.append(mat_wood)
            leg.parent = root

    # Cross bracing
    for y in [-0.45, 0.45]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        brace = bpy.context.active_object
        brace.scale = (2.1, 0.04, 0.06)
        brace.location = (0.0, y, 0.25)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        brace.data.materials.append(mat_dark_wood)
        brace.parent = root

    # 3. Four Corner Canopy Posts extending upwards
    for x in [-1.15, 1.15]:
        for y in [-0.5, 0.5]:
            post_h = 2.4 if y < 0 else 2.1  # slightly slanted awning
            bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=post_h, vertices=12)
            post = bpy.context.active_object
            post.name = f"CanopyPost_{x}_{y}"
            post.location = (x, y, post_h / 2)
            post.data.materials.append(mat_wood)
            post.parent = root

    # 4. Striped Awning Canopy Roof
    # Create multi-segment striped arched awning
    stripes = 10
    total_w = 2.5
    stripe_w = total_w / stripes
    start_x = -total_w / 2 + stripe_w / 2
    for s in range(stripes):
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        stripe = bpy.context.active_object
        stripe.name = f"AwningStripe_{s}"
        stripe.scale = (stripe_w * 0.98, 1.4, 0.03)
        # tilt angle matching the posts
        stripe.rotation_euler = (math.radians(-12), 0, 0)
        stripe.location = (start_x + s * stripe_w, 0.0, 2.3)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        stripe.data.materials.append(mat_awning_red if s % 2 == 0 else mat_awning_cream)
        stripe.parent = root

    # Scalloped valance fringe at front
    for s in range(stripes):
        bpy.ops.mesh.primitive_cylinder_add(radius=stripe_w * 0.45, depth=0.02, vertices=12)
        fringe = bpy.context.active_object
        fringe.name = f"AwningFringe_{s}"
        fringe.rotation_euler = (math.pi / 2, 0, 0)
        fringe.location = (start_x + s * stripe_w, -0.68, 2.12)
        fringe.data.materials.append(mat_awning_red if s % 2 == 0 else mat_awning_cream)
        fringe.parent = root

    # 5. Wicker Fruit Baskets on Counter
    for i, bx in enumerate([-0.65, 0.0, 0.65]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.15, vertices=16)
        basket = bpy.context.active_object
        basket.name = f"WickerBasket_{i}"
        basket.location = (bx, 0.05, 1.08)
        basket.data.materials.append(mat_wicker)
        basket.parent = root

        # Apples in basket 0 and 1
        if i < 2:
            for ax in [-0.08, 0.08]:
                for ay in [-0.08, 0.08]:
                    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, segments=12, ring_count=8)
                    apple = bpy.context.active_object
                    apple.name = f"StallApple_{i}_{ax}_{ay}"
                    apple.location = (bx + ax, 0.05 + ay, 1.18)
                    apple.data.materials.append(mat_apple)
                    apple.parent = root
            # Top center apple
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, segments=12, ring_count=8)
            apple_top = bpy.context.active_object
            apple_top.name = f"StallAppleTop_{i}"
            apple_top.location = (bx, 0.05, 1.25)
            apple_top.data.materials.append(mat_apple)
            apple_top.parent = root
        else:
            # Bananas in basket 2
            for b_idx in range(4):
                bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.22, vertices=10)
                banana = bpy.context.active_object
                banana.name = f"StallBanana_{b_idx}"
                banana.rotation_euler = (math.radians(25), math.radians(b_idx * 40 - 60), math.radians(20))
                banana.location = (bx + (b_idx - 1.5) * 0.06, 0.05, 1.18)
                banana.data.materials.append(mat_banana)
                banana.parent = root

    # 6. Antique Brass Balance Scale on table side
    scale_base_x = -0.92
    bpy.ops.mesh.primitive_cylinder_add(radius=0.1, depth=0.04, vertices=16)
    scale_base = bpy.context.active_object
    scale_base.name = "ScaleBase"
    scale_base.location = (scale_base_x, 0.15, 1.02)
    scale_base.data.materials.append(mat_brass)
    scale_base.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.35, vertices=12)
    scale_pillar = bpy.context.active_object
    scale_pillar.name = "ScalePillar"
    scale_pillar.location = (scale_base_x, 0.15, 1.2)
    scale_pillar.data.materials.append(mat_brass)
    scale_pillar.parent = root

    # Cross beam
    bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.3, vertices=10)
    scale_beam = bpy.context.active_object
    scale_beam.name = "ScaleBeam"
    scale_beam.rotation_euler = (0, math.radians(85), 0)
    scale_beam.location = (scale_base_x, 0.15, 1.36)
    scale_beam.data.materials.append(mat_brass)
    scale_beam.parent = root

    # Two hanging brass weighing pans
    for p_offset in [-0.14, 0.14]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.015, vertices=12)
        pan = bpy.context.active_object
        pan.name = f"ScalePan_{p_offset}"
        pan.location = (scale_base_x + p_offset, 0.15, 1.26 + (0.02 if p_offset > 0 else -0.02))
        pan.data.materials.append(mat_brass)
        pan.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[MarketStall] Exported to: {output_path}")

def create_market_cart(output_path):
    clear_scene()

    mat_wood = create_pbr_material("Mat_CartWood", base_color=(0.38, 0.24, 0.14, 1.0), roughness=0.75, metallic=0.02)
    mat_dark_wood = create_pbr_material("Mat_DarkWood", base_color=(0.22, 0.14, 0.08, 1.0), roughness=0.8, metallic=0.0)
    mat_iron = create_pbr_material("Mat_CartIron", base_color=(0.14, 0.14, 0.16, 1.0), roughness=0.5, metallic=0.85)
    mat_bread = create_pbr_material("Mat_CrustyBread", base_color=(0.78, 0.52, 0.22, 1.0), roughness=0.8, metallic=0.0)
    mat_glass = create_pbr_material("Mat_MilkBottleGlass", base_color=(0.88, 0.95, 0.98, 0.8), roughness=0.1, metallic=0.1)
    mat_milk = create_pbr_material("Mat_FreshMilk", base_color=(0.97, 0.97, 0.95, 1.0), roughness=0.2, metallic=0.0)

    root = bpy.data.objects.new("MarketCartRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Cart Slatted Bed Box
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    bed = bpy.context.active_object
    bed.name = "CartBed"
    bed.scale = (1.6, 1.0, 0.08)
    bed.location = (0.0, 0.0, 0.65)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bed.data.materials.append(mat_wood)
    bed.parent = root

    # Cart sideboards (left, right, back)
    # Left sideboard
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    sb_left = bpy.context.active_object
    sb_left.scale = (1.6, 0.06, 0.35)
    sb_left.location = (0.0, 0.47, 0.82)
    sb_left.data.materials.append(mat_wood)
    sb_left.parent = root

    # Right sideboard
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    sb_right = bpy.context.active_object
    sb_right.scale = (1.6, 0.06, 0.35)
    sb_right.location = (0.0, -0.47, 0.82)
    sb_right.data.materials.append(mat_wood)
    sb_right.parent = root

    # Back sideboard
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    sb_back = bpy.context.active_object
    sb_back.scale = (0.06, 1.0, 0.35)
    sb_back.location = (-0.77, 0.0, 0.82)
    sb_back.data.materials.append(mat_wood)
    sb_back.parent = root

    # 2. Main Axle and Large Spoked Wheels
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=1.3, vertices=12)
    axle = bpy.context.active_object
    axle.name = "WheelAxle"
    axle.rotation_euler = (math.pi / 2, 0, 0)
    axle.location = (-0.1, 0.0, 0.45)
    axle.data.materials.append(mat_iron)
    axle.parent = root

    for wy in [-0.62, 0.62]:
        # Iron tire rim
        bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.03, major_segments=24, minor_segments=8)
        rim = bpy.context.active_object
        rim.name = f"WheelRim_{wy}"
        rim.rotation_euler = (math.pi / 2, 0, 0)
        rim.location = (-0.1, wy, 0.45)
        rim.data.materials.append(mat_iron)
        rim.parent = root

        # Hub
        bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.1, vertices=12)
        hub = bpy.context.active_object
        hub.name = f"WheelHub_{wy}"
        hub.rotation_euler = (math.pi / 2, 0, 0)
        hub.location = (-0.1, wy, 0.45)
        hub.data.materials.append(mat_dark_wood)
        hub.parent = root

        # 8 Spokes per wheel
        for spk in range(8):
            angle = spk * (math.pi / 4)
            bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.82, vertices=8)
            spoke = bpy.context.active_object
            spoke.name = f"Spoke_{wy}_{spk}"
            spoke.rotation_euler = (0, angle, 0)
            spoke.location = (-0.1, wy, 0.45)
            spoke.data.materials.append(mat_wood)
            spoke.parent = root

    # 3. Pull Shafts / Handles at front
    for hy in [-0.35, 0.35]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=1.4, vertices=10)
        shaft = bpy.context.active_object
        shaft.name = f"CartHandle_{hy}"
        shaft.rotation_euler = (0, math.radians(-15), 0)
        shaft.location = (1.2, hy, 0.5)
        shaft.data.materials.append(mat_wood)
        shaft.parent = root

    # Front resting stand legs
    for sy in [-0.35, 0.35]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.45, vertices=8)
        stand = bpy.context.active_object
        stand.name = f"StandLeg_{sy}"
        stand.location = (0.6, sy, 0.22)
        stand.data.materials.append(mat_wood)
        stand.parent = root

    # 4. Cargo: Bread Basket with Baguettes & Wooden Crates with Milk Bottles
    # Bread crate
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    crate1 = bpy.context.active_object
    crate1.scale = (0.55, 0.42, 0.25)
    crate1.location = (-0.35, -0.18, 0.8)
    crate1.data.materials.append(mat_dark_wood)
    crate1.parent = root

    # 3 Crusty French Baguettes (BREAD)
    for bi, b_rot in enumerate([-15, 0, 18]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.55, vertices=12)
        baguette = bpy.context.active_object
        baguette.name = f"BreadMesh_{bi}"
        baguette.rotation_euler = (math.radians(20), math.radians(b_rot), math.radians(35))
        baguette.location = (-0.35 + bi * 0.08, -0.18, 0.95 + bi * 0.03)
        baguette.data.materials.append(mat_bread)
        baguette.parent = root

    # Milk crate
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    crate2 = bpy.context.active_object
    crate2.scale = (0.5, 0.42, 0.25)
    crate2.location = (0.28, 0.18, 0.8)
    crate2.data.materials.append(mat_dark_wood)
    crate2.parent = root

    # 4 Milk bottles (MILK)
    for mx in [-0.09, 0.09]:
        for my in [-0.09, 0.09]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.22, vertices=12)
            bottle = bpy.context.active_object
            bottle.name = f"MilkMesh_{mx}_{my}"
            bottle.location = (0.28 + mx, 0.18 + my, 0.92)
            bottle.data.materials.append(mat_milk)
            bottle.parent = root

            # Bottle neck
            bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.06, vertices=10)
            neck = bpy.context.active_object
            neck.location = (0.28 + mx, 0.18 + my, 1.05)
            neck.data.materials.append(mat_milk)
            neck.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[MarketCart] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_market_stall(os.path.join(out_dir, "market_stall.glb"))
    create_market_cart(os.path.join(out_dir, "market_cart.glb"))
