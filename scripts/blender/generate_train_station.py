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

def create_steam_locomotive(output_path):
    clear_scene()

    # Materials
    mat_black_iron = create_pbr_material("Mat_BlackIron", base_color=(0.10, 0.11, 0.12, 1.0), roughness=0.55, metallic=0.75)
    mat_dark_steel = create_pbr_material("Mat_DarkSteel", base_color=(0.20, 0.22, 0.25, 1.0), roughness=0.45, metallic=0.85)
    mat_brass = create_pbr_material("Mat_LocoBrass", base_color=(0.95, 0.78, 0.25, 1.0), roughness=0.22, metallic=0.9)
    mat_red_trim = create_pbr_material("Mat_LocoRed", base_color=(0.75, 0.12, 0.12, 1.0), roughness=0.4, metallic=0.2)
    mat_light_glow = create_pbr_material("Mat_HeadlightGlow", base_color=(1.0, 0.95, 0.7, 1.0), roughness=0.1, metallic=0.1, emission_color=(1.0, 0.92, 0.6, 1.0), emission_strength=4.0)
    mat_cab_wood = create_pbr_material("Mat_CabWood", base_color=(0.32, 0.18, 0.10, 1.0), roughness=0.7, metallic=0.0)

    root = bpy.data.objects.new("SteamLocomotiveRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Main Locomotive Frame / Chassis
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    chassis = bpy.context.active_object
    chassis.name = "ChassisFrame"
    chassis.scale = (5.8, 1.8, 0.35)
    chassis.location = (0.0, 0.0, 0.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    chassis.data.materials.append(mat_red_trim)
    chassis.parent = root

    # 2. Main Cylindrical Boiler
    bpy.ops.mesh.primitive_cylinder_add(radius=0.72, depth=3.6, vertices=24)
    boiler = bpy.context.active_object
    boiler.name = "BoilerBody"
    boiler.rotation_euler = (0, math.pi / 2, 0)
    boiler.location = (0.6, 0.0, 1.7)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    boiler.data.materials.append(mat_black_iron)
    boiler.parent = root

    # Front Boiler Smoke Box Door (Curved cap)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.72, segments=20, ring_count=12)
    boiler_door = bpy.context.active_object
    boiler_door.name = "BoilerDoor"
    boiler_door.scale = (0.3, 1.0, 1.0)
    boiler_door.location = (2.42, 0.0, 1.7)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    boiler_door.data.materials.append(mat_black_iron)
    boiler_door.parent = root

    # Boiler Brass Bands (3 decorative rings around boiler)
    for bx in [-0.6, 0.4, 1.4]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.73, minor_radius=0.025, major_segments=24, minor_segments=8)
        band = bpy.context.active_object
        band.name = f"BoilerBand_{bx}"
        band.rotation_euler = (0, math.pi / 2, 0)
        band.location = (bx, 0.0, 1.7)
        band.data.materials.append(mat_brass)
        band.parent = root

    # 3. Smokestack (Chimney)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.75, vertices=16)
    smokestack = bpy.context.active_object
    smokestack.name = "Smokestack"
    smokestack.location = (1.9, 0.0, 2.7)
    smokestack.data.materials.append(mat_black_iron)
    smokestack.parent = root

    # Brass flared lip on top of smokestack
    bpy.ops.mesh.primitive_torus_add(major_radius=0.24, minor_radius=0.04, major_segments=16, minor_segments=8)
    stack_lip = bpy.context.active_object
    stack_lip.name = "SmokestackLip"
    stack_lip.location = (1.9, 0.0, 3.08)
    stack_lip.data.materials.append(mat_brass)
    stack_lip.parent = root

    # Steam Dome and Sand Dome
    for dx, d_name in [(1.0, "SandDome"), (0.0, "SteamDome")]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.32, segments=16, ring_count=10)
        dome = bpy.context.active_object
        dome.name = d_name
        dome.scale = (1.0, 1.0, 1.1)
        dome.location = (dx, 0.0, 2.5)
        dome.data.materials.append(mat_brass)
        dome.parent = root

    # 4. Front Headlight Lantern (Big Golden Vintage Searchlight)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    headlight_box = bpy.context.active_object
    headlight_box.name = "HeadlightHousing"
    headlight_box.scale = (0.42, 0.42, 0.48)
    headlight_box.location = (2.6, 0.0, 2.3)
    headlight_box.data.materials.append(mat_brass)
    headlight_box.parent = root

    # Glowing Headlight Lens
    bpy.ops.mesh.primitive_cylinder_add(radius=0.17, depth=0.05, vertices=16)
    headlight_lens = bpy.context.active_object
    headlight_lens.name = "HeadlightLamp"
    headlight_lens.rotation_euler = (0, math.pi / 2, 0)
    headlight_lens.location = (2.82, 0.0, 2.3)
    headlight_lens.data.materials.append(mat_light_glow)
    headlight_lens.parent = root

    # 5. Front Cowcatcher (Wedge Pilot)
    bpy.ops.mesh.primitive_cone_add(radius1=0.9, radius2=0.0, depth=0.9, vertices=4)
    cowcatcher = bpy.context.active_object
    cowcatcher.name = "Cowcatcher"
    cowcatcher.rotation_euler = (0, math.radians(-90), math.radians(45))
    cowcatcher.scale = (0.8, 1.2, 0.6)
    cowcatcher.location = (2.9, 0.0, 0.5)
    cowcatcher.data.materials.append(mat_dark_steel)
    cowcatcher.parent = root

    # 6. Driver's Cabin
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    cab = bpy.context.active_object
    cab.name = "DriversCab"
    cab.scale = (1.7, 1.9, 1.8)
    cab.location = (-1.8, 0.0, 1.9)
    cab.data.materials.append(mat_black_iron)
    cab.parent = root

    # Cab Arched Roof
    bpy.ops.mesh.primitive_cylinder_add(radius=1.05, depth=1.85, vertices=20)
    cab_roof = bpy.context.active_object
    cab_roof.name = "CabRoof"
    cab_roof.rotation_euler = (0, math.pi / 2, 0)
    cab_roof.scale = (1.0, 1.0, 0.4)
    cab_roof.location = (-1.8, 0.0, 2.85)
    cab_roof.data.materials.append(mat_dark_steel)
    cab_roof.parent = root

    # Cab Windows
    for side_y in [-0.96, 0.96]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        win = bpy.context.active_object
        win.scale = (0.7, 0.02, 0.5)
        win.location = (-1.8, side_y, 2.2)
        win.data.materials.append(mat_brass)
        win.parent = root

    # 7. Six Heavy Spoked Driving Wheels & Connecting Rods
    for wx in [-0.9, 0.3, 1.5]:
        for wy in [-0.95, 0.95]:
            # Wheel Rim
            bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.05, major_segments=24, minor_segments=8)
            wheel = bpy.context.active_object
            wheel.name = f"DriveWheel_{wx}_{wy}"
            wheel.rotation_euler = (math.pi / 2, 0, 0)
            wheel.location = (wx, wy, 0.6)
            wheel.data.materials.append(mat_dark_steel)
            wheel.parent = root

            # Hub
            bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.14, vertices=12)
            hub = bpy.context.active_object
            hub.rotation_euler = (math.pi / 2, 0, 0)
            hub.location = (wx, wy, 0.6)
            hub.data.materials.append(mat_brass)
            hub.parent = root

            # Spokes
            for s in range(8):
                angle = s * (math.pi / 4)
                bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=1.0, vertices=8)
                spk = bpy.context.active_object
                spk.rotation_euler = (0, angle, 0)
                spk.location = (wx, wy, 0.6)
                spk.data.materials.append(mat_dark_steel)
                spk.parent = root

    # Side Connecting Rods on both sides
    for ry in [-1.02, 1.02]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        rod = bpy.context.active_object
        rod.name = f"ConnectingRod_{ry}"
        rod.scale = (2.6, 0.04, 0.08)
        rod.location = (0.3, ry, 0.45)
        rod.data.materials.append(mat_dark_steel)
        rod.parent = root

        # Piston cylinder at front
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.8, vertices=16)
        piston = bpy.context.active_object
        piston.rotation_euler = (0, math.pi / 2, 0)
        piston.location = (2.0, ry, 0.55)
        piston.data.materials.append(mat_brass)
        piston.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[SteamLocomotive] Exported to: {output_path}")

def create_station_clocktower(output_path):
    clear_scene()

    mat_brick = create_pbr_material("Mat_StationBrick", base_color=(0.58, 0.22, 0.16, 1.0), roughness=0.85, metallic=0.0)
    mat_stone = create_pbr_material("Mat_PlinthStone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.8, metallic=0.05)
    mat_copper = create_pbr_material("Mat_PatinaCopper", base_color=(0.28, 0.58, 0.52, 1.0), roughness=0.55, metallic=0.2)
    mat_brass = create_pbr_material("Mat_ClockBrass", base_color=(0.92, 0.76, 0.25, 1.0), roughness=0.25, metallic=0.85)
    mat_clockface = create_pbr_material("Mat_ClockDial", base_color=(0.98, 0.97, 0.92, 1.0), roughness=0.3, metallic=0.0, emission_color=(0.98, 0.95, 0.85, 1.0), emission_strength=1.2)
    mat_hands = create_pbr_material("Mat_ClockHands", base_color=(0.08, 0.08, 0.09, 1.0), roughness=0.3, metallic=0.8)

    root = bpy.data.objects.new("ClocktowerRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Base Stone Plinth
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    base = bpy.context.active_object
    base.name = "TowerBase"
    base.scale = (2.4, 2.4, 1.2)
    base.location = (0.0, 0.0, 0.6)
    base.data.materials.append(mat_stone)
    base.parent = root

    # 2. Main Brick Shaft
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    shaft = bpy.context.active_object
    shaft.name = "TowerShaft"
    shaft.scale = (1.9, 1.9, 5.2)
    shaft.location = (0.0, 0.0, 3.8)
    shaft.data.materials.append(mat_brick)
    shaft.parent = root

    # Stone Stringcourses (Horizontal decorative bands)
    for zy in [2.2, 4.4, 6.3]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        belt = bpy.context.active_object
        belt.scale = (2.05, 2.05, 0.18)
        belt.location = (0.0, 0.0, zy)
        belt.data.materials.append(mat_stone)
        belt.parent = root

    # 3. Clock Chamber (Upper room)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    chamber = bpy.context.active_object
    chamber.name = "ClockChamber"
    chamber.scale = (2.2, 2.2, 2.0)
    chamber.location = (0.0, 0.0, 7.4)
    chamber.data.materials.append(mat_stone)
    chamber.parent = root

    # 4. Four Large Circular Clock Faces (North, South, East, West)
    faces_config = [
        ("ClockNorth", (0.0, 1.12, 7.4), (math.pi / 2, 0, 0)),
        ("ClockSouth", (0.0, -1.12, 7.4), (-math.pi / 2, 0, 0)),
        ("ClockEast", (1.12, 0.0, 7.4), (0, math.pi / 2, 0)),
        ("ClockWest", (-1.12, 0.0, 7.4), (0, -math.pi / 2, 0)),
    ]

    for name, pos, rot in faces_config:
        # Brass Bezel Rim
        bpy.ops.mesh.primitive_torus_add(major_radius=0.72, minor_radius=0.04, major_segments=24, minor_segments=8)
        bezel = bpy.context.active_object
        bezel.name = f"{name}_Bezel"
        bezel.rotation_euler = rot
        bezel.location = pos
        bezel.data.materials.append(mat_brass)
        bezel.parent = root

        # Dial Face (Luminescent white)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.70, depth=0.03, vertices=24)
        dial = bpy.context.active_object
        dial.name = f"{name}_Dial"
        dial.rotation_euler = rot
        dial.location = pos
        dial.data.materials.append(mat_clockface)
        dial.parent = root

        # Hour Hand & Minute Hand
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        h_hand = bpy.context.active_object
        h_hand.name = f"{name}_HourHand"
        h_hand.scale = (0.03, 0.35, 0.01)
        h_hand.rotation_euler = (rot[0], rot[1], rot[2] + math.radians(45))
        h_hand.location = (pos[0] + (0.02 if pos[0] > 0 else (-0.02 if pos[0] < 0 else 0)),
                           pos[1] + (0.02 if pos[1] > 0 else (-0.02 if pos[1] < 0 else 0)),
                           pos[2] + 0.12)
        h_hand.data.materials.append(mat_hands)
        h_hand.parent = root

        bpy.ops.mesh.primitive_cube_add(size=1.0)
        m_hand = bpy.context.active_object
        m_hand.name = f"{name}_MinuteHand"
        m_hand.scale = (0.02, 0.52, 0.01)
        m_hand.rotation_euler = rot
        m_hand.location = (pos[0] + (0.025 if pos[0] > 0 else (-0.025 if pos[0] < 0 else 0)),
                           pos[1] + (0.025 if pos[1] > 0 else (-0.025 if pos[1] < 0 else 0)),
                           pos[2] + 0.18)
        m_hand.data.materials.append(mat_hands)
        m_hand.parent = root

    # 5. Patina Copper Pyramidal Spire Roof
    bpy.ops.mesh.primitive_cone_add(radius1=1.65, radius2=0.0, depth=3.2, vertices=4)
    spire = bpy.context.active_object
    spire.name = "TowerSpire"
    spire.rotation_euler = (0, 0, math.radians(45))
    spire.location = (0.0, 0.0, 10.0)
    spire.data.materials.append(mat_copper)
    spire.parent = root

    # Weather Vane Finial (Brass rooster / arrow)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=1.2, vertices=10)
    vane_pole = bpy.context.active_object
    vane_pole.name = "WeatherVanePole"
    vane_pole.location = (0.0, 0.0, 11.9)
    vane_pole.data.materials.append(mat_brass)
    vane_pole.parent = root

    bpy.ops.mesh.primitive_cube_add(size=1.0)
    vane_arrow = bpy.context.active_object
    vane_arrow.name = "WeatherVaneArrow"
    vane_arrow.scale = (0.6, 0.02, 0.12)
    vane_arrow.location = (0.0, 0.0, 12.3)
    vane_arrow.data.materials.append(mat_brass)
    vane_arrow.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[StationClocktower] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_steam_locomotive(os.path.join(out_dir, "steam_locomotive.glb"))
    create_station_clocktower(os.path.join(out_dir, "station_clocktower.glb"))
