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

def create_study_door(output_path):
    clear_scene()

    mat_stone = create_pbr_material("Mat_ArchStone", base_color=(0.28, 0.28, 0.30, 1.0), roughness=0.8, metallic=0.02)
    mat_wood = create_pbr_material("Mat_DoorOak", base_color=(0.22, 0.11, 0.05, 1.0), roughness=0.5, metallic=0.05)
    mat_iron = create_pbr_material("Mat_DoorIron", base_color=(0.14, 0.14, 0.16, 1.0), roughness=0.35, metallic=0.85)
    mat_socket_inactive = create_pbr_material("Mat_SocketInactive", base_color=(0.25, 0.25, 0.28, 1.0), roughness=0.4, metallic=0.3)
    mat_socket_star = create_pbr_material("Mat_SocketStar", base_color=(1.0, 0.88, 0.1, 1.0), roughness=0.15, metallic=0.2, emission_color=(1.0, 0.85, 0.1, 1.0), emission_strength=2.5)
    mat_socket_flower = create_pbr_material("Mat_SocketFlower", base_color=(0.25, 0.65, 1.0, 1.0), roughness=0.15, metallic=0.2, emission_color=(0.2, 0.6, 1.0, 1.0), emission_strength=2.5)

    root = bpy.data.objects.new("StudyDoorRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Gothic Arch Outer Stone Portal Frame (Height 3.6m, width 3.6m)
    # Left Stone Column
    for sx, cx in [(-1, -1.8), (1, 1.8)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        col = bpy.context.active_object
        col.name = f"StonePortalCol_{sx}"
        col.scale = (0.45, 0.35, 3.6)
        col.location = (cx, 0.0, 1.8)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = col.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.03
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        col.data.materials.append(mat_stone)
        col.parent = root

    # Top Arch Keystone Lintel
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    lintel = bpy.context.active_object
    lintel.name = "StoneLintel"
    lintel.scale = (4.0, 0.42, 0.45)
    lintel.location = (0.0, 0.0, 3.62)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = lintel.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.03
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    lintel.data.materials.append(mat_stone)
    lintel.parent = root

    # Center Keystone (Embossed shield stone)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    keystone = bpy.context.active_object
    keystone.name = "Keystone"
    keystone.scale = (0.45, 0.48, 0.55)
    keystone.location = (0.0, 0.04, 3.65)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = keystone.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.04
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    keystone.data.materials.append(mat_stone)
    keystone.parent = root

    # ==========================================
    # 2. Left Door Leaf (Named DoorLeft for Three.js sliding/opening)
    # Default location: x = -0.8, y = 0, z = 1.6
    # ==========================================
    door_left = bpy.data.objects.new("DoorLeft", None)
    bpy.context.collection.objects.link(door_left)
    door_left.location = (-0.8, 0.0, 1.6)
    door_left.parent = root

    # Left Door Panel Mesh
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    panel_l = bpy.context.active_object
    panel_l.name = "DoorPanelLeft"
    panel_l.scale = (1.56, 0.14, 3.2)
    panel_l.location = (0.0, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = panel_l.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    panel_l.data.materials.append(mat_wood)
    panel_l.parent = door_left

    # Horizontal Iron Reinforcement Straps (Left)
    for bz in [-1.1, 0.0, 1.1]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        strap = bpy.context.active_object
        strap.name = f"IronStrapL_{bz}"
        strap.scale = (1.58, 0.16, 0.08)
        strap.location = (0.0, 0.0, bz)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        strap.data.materials.append(mat_iron)
        strap.parent = door_left

    # Left Iron Ring Handle
    bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.014, major_segments=16, minor_segments=8)
    handle_l = bpy.context.active_object
    handle_l.name = "HandleRingL"
    handle_l.rotation_euler = (math.pi / 2, 0, 0)
    handle_l.location = (0.55, 0.10, 0.0)
    handle_l.data.materials.append(mat_iron)
    handle_l.parent = door_left

    # Left Star Stone Socket (Named SocketStar)
    # Position on left door near seam
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.03, vertices=16)
    socket_star_esc = bpy.context.active_object
    socket_star_esc.name = "SocketStarEscutcheon"
    socket_star_esc.rotation_euler = (math.pi / 2, 0, 0)
    socket_star_esc.location = (0.45, 0.08, 0.25)
    socket_star_esc.data.materials.append(mat_iron)
    socket_star_esc.parent = door_left

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.11)
    socket_star = bpy.context.active_object
    socket_star.name = "SocketStar"
    socket_star.location = (0.45, 0.09, 0.25)
    socket_star.data.materials.append(mat_socket_inactive)
    socket_star.parent = door_left

    # ==========================================
    # 3. Right Door Leaf (Named DoorRight)
    # Default location: x = 0.8, y = 0, z = 1.6
    # ==========================================
    door_right = bpy.data.objects.new("DoorRight", None)
    bpy.context.collection.objects.link(door_right)
    door_right.location = (0.8, 0.0, 1.6)
    door_right.parent = root

    # Right Door Panel Mesh
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    panel_r = bpy.context.active_object
    panel_r.name = "DoorPanelRight"
    panel_r.scale = (1.56, 0.14, 3.2)
    panel_r.location = (0.0, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = panel_r.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.015
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    panel_r.data.materials.append(mat_wood)
    panel_r.parent = door_right

    # Horizontal Iron Reinforcement Straps (Right)
    for bz in [-1.1, 0.0, 1.1]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        strap = bpy.context.active_object
        strap.name = f"IronStrapR_{bz}"
        strap.scale = (1.58, 0.16, 0.08)
        strap.location = (0.0, 0.0, bz)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        strap.data.materials.append(mat_iron)
        strap.parent = door_right

    # Right Iron Ring Handle
    bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.014, major_segments=16, minor_segments=8)
    handle_r = bpy.context.active_object
    handle_r.name = "HandleRingR"
    handle_r.rotation_euler = (math.pi / 2, 0, 0)
    handle_r.location = (-0.55, 0.10, 0.0)
    handle_r.data.materials.append(mat_iron)
    handle_r.parent = door_right

    # Right Flower Stone Socket (Named SocketFlower)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.14, depth=0.03, vertices=16)
    socket_flower_esc = bpy.context.active_object
    socket_flower_esc.name = "SocketFlowerEscutcheon"
    socket_flower_esc.rotation_euler = (math.pi / 2, 0, 0)
    socket_flower_esc.location = (-0.45, 0.08, 0.25)
    socket_flower_esc.data.materials.append(mat_iron)
    socket_flower_esc.parent = door_right

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.11)
    socket_flower = bpy.context.active_object
    socket_flower.name = "SocketFlower"
    socket_flower.location = (-0.45, 0.09, 0.25)
    socket_flower.data.materials.append(mat_socket_inactive)
    socket_flower.parent = door_right

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Study Door to {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\study_exit_door.glb")
    create_study_door(out)
