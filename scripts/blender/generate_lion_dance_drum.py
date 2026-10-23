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

def create_lion_dance_head(output_path):
    clear_scene()

    # Traditional Festive Colors: Red, Gold, Jade Green, Cyan, Crisp White, Gloss Black
    mat_red = create_pbr_material("Mat_FestiveRed", base_color=(0.85, 0.08, 0.12, 1.0), roughness=0.35, metallic=0.1)
    mat_gold = create_pbr_material("Mat_ImperialGold", base_color=(0.95, 0.75, 0.15, 1.0), roughness=0.22, metallic=0.88)
    mat_green = create_pbr_material("Mat_JadeGreen", base_color=(0.08, 0.65, 0.35, 1.0), roughness=0.35, metallic=0.1)
    mat_cyan = create_pbr_material("Mat_BrightCyan", base_color=(0.1, 0.75, 0.88, 1.0), roughness=0.35, metallic=0.1)
    mat_white = create_pbr_material("Mat_PureWhite", base_color=(0.95, 0.95, 0.95, 1.0), roughness=0.4, metallic=0.0)
    mat_black = create_pbr_material("Mat_GlossBlack", base_color=(0.03, 0.03, 0.03, 1.0), roughness=0.15, metallic=0.1)
    mat_mirror = create_pbr_material("Mat_ForeheadMirror", base_color=(0.95, 0.95, 1.0, 1.0), roughness=0.05, metallic=0.95, emission_color=(0.8, 0.9, 1.0, 1.0), emission_strength=1.5)

    root = bpy.data.objects.new("LionHeadRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Main Head Dome Base (Smooth stylized shape)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.75)
    cranium = bpy.context.active_object
    cranium.name = "LionCranium"
    cranium.scale = (0.85, 0.75, 0.70)
    cranium.location = (0.0, 0.0, 0.15)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    cranium.data.materials.append(mat_green)
    cranium.parent = root

    # 2. Forehead Golden Horn (象徵勇猛與智慧的頭頂獨角)
    bpy.ops.mesh.primitive_cone_add(radius1=0.12, depth=0.38, vertices=16)
    horn = bpy.context.active_object
    horn.name = "LionHorn"
    horn.rotation_euler = (0.35, 0.0, 0.0)
    horn.location = (0.0, 0.35, 0.78)
    horn.data.materials.append(mat_gold)
    horn.parent = root

    # Forehead Bagua Spirit Mirror (額頭八卦鎮煞凸鏡)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.03, vertices=24)
    mirror_frame = bpy.context.active_object
    mirror_frame.name = "MirrorFrame"
    mirror_frame.rotation_euler = (0.45, 0.0, 0.0)
    mirror_frame.location = (0.0, 0.58, 0.45)
    mirror_frame.data.materials.append(mat_gold)
    mirror_frame.parent = root

    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11)
    mirror = bpy.context.active_object
    mirror.name = "MirrorCenter"
    mirror.scale = (1.0, 0.25, 1.0)
    mirror.rotation_euler = (0.45, 0.0, 0.0)
    mirror.location = (0.0, 0.60, 0.46)
    mirror.data.materials.append(mat_mirror)
    mirror.parent = root

    # 3. Big Expressive Eyes & Eyelids (Left & Right)
    for side, ex in [(-1, -0.36), (1, 0.36)]:
        # Eyeball White
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22)
        eye_white = bpy.context.active_object
        eye_white.name = f"EyeWhite_{side}"
        eye_white.location = (ex, 0.48, 0.22)
        eye_white.data.materials.append(mat_white)
        eye_white.parent = root

        # Pupil Black
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11)
        pupil = bpy.context.active_object
        pupil.name = f"Pupil_{side}"
        pupil.location = (ex, 0.65, 0.24)
        pupil.data.materials.append(mat_black)
        pupil.parent = root

        # Pupil Highlight Spark
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035)
        spark = bpy.context.active_object
        spark.name = f"EyeSpark_{side}"
        spark.location = (ex - 0.03 * side, 0.72, 0.29)
        spark.data.materials.append(mat_white)
        spark.parent = root

        # Layered Decorative Eyebrow Rings (Gold & Cyan Toruses)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.045, major_segments=20, minor_segments=8)
        brow_gold = bpy.context.active_object
        brow_gold.name = f"BrowGold_{side}"
        brow_gold.rotation_euler = (math.pi / 2 - 0.3, 0, side * 0.2)
        brow_gold.location = (ex, 0.44, 0.42)
        brow_gold.data.materials.append(mat_gold)
        brow_gold.parent = root

        # Curled Temple Fur Wing (鬢毛裝飾)
        bpy.ops.mesh.primitive_cone_add(radius1=0.10, depth=0.35, vertices=12)
        wing = bpy.context.active_object
        wing.name = f"TempleWing_{side}"
        wing.rotation_euler = (-0.2, side * 0.7, side * 0.4)
        wing.location = (ex * 1.5, 0.1, 0.25)
        wing.data.materials.append(mat_red)
        wing.parent = root

    # 4. Wide Smiling Lion Snout & Mouth
    # Snout Bridge (Red Bulbous Nose)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.20)
    snout = bpy.context.active_object
    snout.name = "LionSnout"
    snout.scale = (1.3, 0.9, 0.8)
    snout.location = (0.0, 0.68, 0.05)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    snout.data.materials.append(mat_red)
    snout.parent = root

    # Nostrils / Whiskers Puffs
    for side, nx in [(-1, -0.16), (1, 0.16)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12)
        puff = bpy.context.active_object
        puff.name = f"NosePuff_{side}"
        puff.location = (nx, 0.74, 0.02)
        puff.data.materials.append(mat_gold)
        puff.parent = root

    # Lower Jaw & White Soft Fur Beard (長髯白鬍子)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.45, depth=0.15, vertices=24)
    jaw = bpy.context.active_object
    jaw.name = "LowerJaw"
    jaw.location = (0.0, 0.52, -0.18)
    jaw.data.materials.append(mat_red)
    jaw.parent = root

    # White Tooth Row
    for tx in [-0.22, -0.07, 0.07, 0.22]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        tooth = bpy.context.active_object
        tooth.name = f"Tooth_{tx}"
        tooth.scale = (0.09, 0.07, 0.11)
        tooth.location = (tx, 0.68, -0.13)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        tooth.data.materials.append(mat_white)
        tooth.parent = root

    # Cascading White Fur Beard (Tassel strands)
    for bx in range(-5, 6):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.55, vertices=8)
        beard = bpy.context.active_object
        beard.name = f"BeardStrand_{bx}"
        beard.location = (bx * 0.07, 0.62, -0.45 + abs(bx) * 0.03)
        beard.data.materials.append(mat_white)
        beard.parent = root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Lion Dance Head to {output_path}")

def create_festival_drum(output_path):
    clear_scene()

    mat_crimson = create_pbr_material("Mat_DrumRed", base_color=(0.75, 0.06, 0.08, 1.0), roughness=0.3, metallic=0.1) # Red lacquer
    mat_skin = create_pbr_material("Mat_DrumSkin", base_color=(0.92, 0.85, 0.72, 1.0), roughness=0.7, metallic=0.0) # Cowhide drum head
    mat_stud = create_pbr_material("Mat_DrumStud", base_color=(0.92, 0.78, 0.22, 1.0), roughness=0.25, metallic=0.85) # Brass studs
    mat_wood_stand = create_pbr_material("Mat_StandWood", base_color=(0.25, 0.14, 0.08, 1.0), roughness=0.6, metallic=0.05)

    root = bpy.data.objects.new("DrumRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Red Lacquer Drum Barrel (0.8m diameter, 0.7m height, height center at 1.0m)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.44, depth=0.68, vertices=32)
    barrel = bpy.context.active_object
    barrel.name = "DrumBarrel"
    barrel.location = (0.0, 0.0, 1.0)
    # Bulge barrel in middle
    barrel.scale = (1.05, 1.05, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    barrel.data.materials.append(mat_crimson)
    barrel.parent = root

    # Top & Bottom Cowhide Drumheads
    for top_z in [1.345, 0.655]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.43, depth=0.02, vertices=32)
        head = bpy.context.active_object
        head.name = f"DrumHead_{top_z}"
        head.location = (0.0, 0.0, top_z)
        head.data.materials.append(mat_skin)
        head.parent = root

        # Ring of Brass Studs around edge (鼓釘)
        for i in range(16):
            angle = i * (2 * math.pi / 16)
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018)
            stud = bpy.context.active_object
            stud.name = f"DrumStud_{top_z}_{i}"
            stud.location = (math.cos(angle) * 0.445, math.sin(angle) * 0.445, top_z + (0.01 if top_z > 1.0 else -0.01))
            stud.data.materials.append(mat_stud)
            stud.parent = root

    # 2. Crossed Heavy Wooden Trestle Stand (X-Stand)
    for leg_angle in [math.pi / 4, 3 * math.pi / 4, 5 * math.pi / 4, 7 * math.pi / 4]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        leg = bpy.context.active_object
        leg.name = f"StandLeg_{leg_angle}"
        leg.scale = (0.08, 0.08, 0.85)
        leg.rotation_euler = (0.22 * math.cos(leg_angle), 0.22 * math.sin(leg_angle), 0)
        leg.location = (math.cos(leg_angle) * 0.42, math.sin(leg_angle) * 0.42, 0.42)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        leg.data.materials.append(mat_wood_stand)
        leg.parent = root

    # Cross Struts on Stand
    for i in range(4):
        a = i * (math.pi / 2)
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        strut = bpy.context.active_object
        strut.name = f"StandStrut_{i}"
        strut.scale = (0.05, 0.55, 0.05)
        strut.rotation_euler = (0, 0, a)
        strut.location = (0.0, 0.0, 0.35)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        strut.data.materials.append(mat_wood_stand)
        strut.parent = root

    # 3. Two Drumsticks (鼓棒) resting on top of drum
    for side, dx in [(-0.12, -0.15), (0.12, 0.15)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.014, depth=0.45, vertices=12)
        stick = bpy.context.active_object
        stick.name = f"Drumstick_{dx}"
        stick.rotation_euler = (math.pi / 2, 0.15 * side, 0.3)
        stick.location = (dx, 0.0, 1.37)
        stick.data.materials.append(mat_wood_stand)
        stick.parent = root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Festival Drum to {output_path}")

if __name__ == "__main__":
    out_lion = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\lion_head.glb")
    out_drum = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\festival_drum.glb")
    create_lion_dance_head(out_lion)
    create_festival_drum(out_drum)
