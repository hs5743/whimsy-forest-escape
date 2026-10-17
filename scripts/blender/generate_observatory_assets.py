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

def create_celestial_telescope(output_path):
    clear_scene()

    # Materials
    mat_brass = create_pbr_material("Mat_TelescopeBrass", base_color=(0.95, 0.80, 0.28, 1.0), roughness=0.20, metallic=0.90)
    mat_dark_brass = create_pbr_material("Mat_DarkBrass", base_color=(0.65, 0.50, 0.18, 1.0), roughness=0.35, metallic=0.85)
    mat_mahogany = create_pbr_material("Mat_MahoganyTripod", base_color=(0.28, 0.12, 0.08, 1.0), roughness=0.65, metallic=0.02)
    mat_lens_glass = create_pbr_material("Mat_OpticalLens", base_color=(0.7, 0.92, 1.0, 0.7), roughness=0.05, metallic=0.1, emission_color=(0.4, 0.8, 1.0, 1.0), emission_strength=1.5)
    mat_iron = create_pbr_material("Mat_MountIron", base_color=(0.15, 0.15, 0.18, 1.0), roughness=0.5, metallic=0.8)

    root = bpy.data.objects.new("TelescopeRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Mahogany & Brass Heavy Tripod Legs
    for i in range(3):
        angle = i * (2 * math.pi / 3)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=1.9, vertices=12)
        leg = bpy.context.active_object
        leg.name = f"TripodLeg_{i}"
        # Splay legs outward
        tilt = math.radians(22)
        leg.rotation_euler = (math.sin(angle) * tilt, -math.cos(angle) * tilt, angle)
        leg.location = (math.cos(angle) * 0.45, math.sin(angle) * 0.45, 0.9)
        leg.data.materials.append(mat_mahogany)
        leg.parent = root

        # Brass foot tip
        bpy.ops.mesh.primitive_cylinder_add(radius=0.065, depth=0.2, vertices=12)
        foot = bpy.context.active_object
        foot.name = f"TripodFoot_{i}"
        foot.location = (math.cos(angle) * 0.8, math.sin(angle) * 0.8, 0.1)
        foot.data.materials.append(mat_brass)
        foot.parent = root

    # Central Tripod Head / Pier Hub
    bpy.ops.mesh.primitive_cylinder_add(radius=0.28, depth=0.25, vertices=16)
    hub = bpy.context.active_object
    hub.name = "TripodHub"
    hub.location = (0.0, 0.0, 1.78)
    hub.data.materials.append(mat_brass)
    hub.parent = root

    # 2. German Equatorial Mount
    # RA Axis (Right Ascension)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.5, vertices=16)
    ra_axis = bpy.context.active_object
    ra_axis.name = "RA_Axis"
    ra_axis.rotation_euler = (math.radians(35), 0, 0)
    ra_axis.location = (0.0, -0.08, 2.05)
    ra_axis.data.materials.append(mat_iron)
    ra_axis.parent = root

    # Declination setting circle (engraved brass dial)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.06, vertices=24)
    dec_circle = bpy.context.active_object
    dec_circle.name = "SettingCircle"
    dec_circle.rotation_euler = (math.radians(35), 0, 0)
    dec_circle.location = (0.0, -0.08, 2.22)
    dec_circle.data.materials.append(mat_brass)
    dec_circle.parent = root

    # Counterweight shaft and brass counterweight
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.9, vertices=12)
    cw_shaft = bpy.context.active_object
    cw_shaft.name = "CounterweightShaft"
    cw_shaft.rotation_euler = (0, math.pi / 2, 0)
    cw_shaft.location = (-0.45, -0.08, 2.22)
    cw_shaft.data.materials.append(mat_dark_brass)
    cw_shaft.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.25, vertices=16)
    c_weight = bpy.context.active_object
    c_weight.name = "CounterWeight"
    c_weight.rotation_euler = (0, math.pi / 2, 0)
    c_weight.location = (-0.65, -0.08, 2.22)
    c_weight.data.materials.append(mat_brass)
    c_weight.parent = root

    # 3. Main Telescope Optical Tube Assembly (Pointing towards sky at 45 deg)
    telescope_tube_group = bpy.data.objects.new("TelescopeTubeGroup", None)
    bpy.context.collection.objects.link(telescope_tube_group)
    telescope_tube_group.rotation_euler = (math.radians(-42), 0, math.radians(25))
    telescope_tube_group.location = (0.15, 0.05, 2.35)
    telescope_tube_group.parent = root

    # Main Brass Tube (stepped cylinders)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=2.4, vertices=24)
    main_tube = bpy.context.active_object
    main_tube.name = "MainTelescopeTube"
    main_tube.location = (0.0, 0.0, 0.0)
    main_tube.data.materials.append(mat_brass)
    main_tube.parent = telescope_tube_group

    # Dew shield / Objective lens housing at top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.19, depth=0.45, vertices=24)
    dew_shield = bpy.context.active_object
    dew_shield.name = "DewShield"
    dew_shield.location = (0.0, 0.0, 1.25)
    dew_shield.data.materials.append(mat_brass)
    dew_shield.parent = telescope_tube_group

    # Optical Objective Lens (Glass)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.175, depth=0.03, vertices=24)
    lens = bpy.context.active_object
    lens.name = "ObjectiveLens"
    lens.location = (0.0, 0.0, 1.42)
    lens.data.materials.append(mat_lens_glass)
    lens.parent = telescope_tube_group

    # Eyepiece Drawtube and Knurled Focus Knobs at bottom
    bpy.ops.mesh.primitive_cylinder_add(radius=0.075, depth=0.45, vertices=16)
    drawtube = bpy.context.active_object
    drawtube.name = "EyepieceDrawtube"
    drawtube.location = (0.0, 0.0, -1.35)
    drawtube.data.materials.append(mat_brass)
    drawtube.parent = telescope_tube_group

    # Star Diagonal & Eyepiece
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    diagonal = bpy.context.active_object
    diagonal.name = "StarDiagonal"
    diagonal.scale = (0.1, 0.1, 0.1)
    diagonal.location = (0.0, 0.0, -1.6)
    diagonal.data.materials.append(mat_brass)
    diagonal.parent = telescope_tube_group

    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.15, vertices=12)
    eyepiece = bpy.context.active_object
    eyepiece.name = "Eyepiece"
    eyepiece.rotation_euler = (math.radians(90), 0, 0)
    eyepiece.location = (0.0, 0.1, -1.6)
    eyepiece.data.materials.append(mat_dark_brass)
    eyepiece.parent = telescope_tube_group

    # 4. Finder Scope Mounted on Top
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.85, vertices=16)
    finder = bpy.context.active_object
    finder.name = "FinderScope"
    finder.location = (0.0, 0.22, 0.4)
    finder.data.materials.append(mat_dark_brass)
    finder.parent = telescope_tube_group

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[CelestialTelescope] Exported to: {output_path}")

def create_astrolabe_sphere(output_path):
    clear_scene()

    mat_stone_pedestal = create_pbr_material("Mat_BasaltPedestal", base_color=(0.18, 0.18, 0.22, 1.0), roughness=0.8, metallic=0.1)
    mat_brass = create_pbr_material("Mat_AstrolabeBrass", base_color=(0.95, 0.78, 0.25, 1.0), roughness=0.22, metallic=0.90)
    mat_dark_bronze = create_pbr_material("Mat_AntiqueBronze", base_color=(0.55, 0.40, 0.15, 1.0), roughness=0.35, metallic=0.85)
    mat_core_glow = create_pbr_material("Mat_CelestialCoreGlow", base_color=(1.0, 0.92, 0.5, 1.0), roughness=0.1, metallic=0.0, emission_color=(1.0, 0.88, 0.35, 1.0), emission_strength=4.5)

    root = bpy.data.objects.new("AstrolabeRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Carved Basalt Pedestal
    bpy.ops.mesh.primitive_cylinder_add(radius=0.65, depth=0.3, vertices=8)
    base = bpy.context.active_object
    base.name = "PedestalBase"
    base.location = (0.0, 0.0, 0.15)
    base.data.materials.append(mat_stone_pedestal)
    base.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.8, vertices=8)
    shaft = bpy.context.active_object
    shaft.name = "PedestalShaft"
    shaft.location = (0.0, 0.0, 0.7)
    shaft.data.materials.append(mat_stone_pedestal)
    shaft.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.55, depth=0.15, vertices=8)
    capital = bpy.context.active_object
    capital.name = "PedestalCapital"
    capital.location = (0.0, 0.0, 1.15)
    capital.data.materials.append(mat_stone_pedestal)
    capital.parent = root

    # 2. Outer Supporting Meridian Ring Stand
    bpy.ops.mesh.primitive_torus_add(major_radius=0.85, minor_radius=0.04, major_segments=24, minor_segments=8)
    meridian_stand = bpy.context.active_object
    meridian_stand.name = "MeridianStand"
    meridian_stand.rotation_euler = (math.pi / 2, 0, 0)
    meridian_stand.location = (0.0, 0.0, 2.05)
    meridian_stand.data.materials.append(mat_dark_bronze)
    meridian_stand.parent = root

    # 3. Inner Armillary Gimbal Rings (Nested concentric rings)
    # Equatorial Ring
    bpy.ops.mesh.primitive_torus_add(major_radius=0.78, minor_radius=0.03, major_segments=24, minor_segments=8)
    eq_ring = bpy.context.active_object
    eq_ring.name = "EquatorialRing"
    eq_ring.location = (0.0, 0.0, 2.05)
    eq_ring.data.materials.append(mat_brass)
    eq_ring.parent = root

    # Solstitial Colure Ring
    bpy.ops.mesh.primitive_torus_add(major_radius=0.72, minor_radius=0.028, major_segments=24, minor_segments=8)
    colure_ring = bpy.context.active_object
    colure_ring.name = "ColureRing"
    colure_ring.rotation_euler = (0, math.pi / 2, 0)
    colure_ring.location = (0.0, 0.0, 2.05)
    colure_ring.data.materials.append(mat_brass)
    colure_ring.parent = root

    # Slanted Ecliptic Zodiac Band (Broad flat band)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.66, minor_radius=0.045, major_segments=24, minor_segments=8)
    zodiac_band = bpy.context.active_object
    zodiac_band.name = "ZodiacBand"
    zodiac_band.rotation_euler = (math.radians(23.5), math.radians(15), 0)
    zodiac_band.location = (0.0, 0.0, 2.05)
    zodiac_band.data.materials.append(mat_brass)
    zodiac_band.parent = root

    # 4. Central Glowing Celestial Sun Core
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, segments=20, ring_count=12)
    core = bpy.context.active_object
    core.name = "CelestialCore"
    core.location = (0.0, 0.0, 2.05)
    core.data.materials.append(mat_core_glow)
    core.parent = root

    # Central Polar Axis Needle
    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=1.75, vertices=12)
    axis_needle = bpy.context.active_object
    axis_needle.name = "PolarAxisNeedle"
    axis_needle.rotation_euler = (math.radians(23.5), 0, 0)
    axis_needle.location = (0.0, 0.0, 2.05)
    axis_needle.data.materials.append(mat_brass)
    axis_needle.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[AstrolabeSphere] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_celestial_telescope(os.path.join(out_dir, "celestial_telescope.glb"))
    create_astrolabe_sphere(os.path.join(out_dir, "astrolabe_sphere.glb"))
