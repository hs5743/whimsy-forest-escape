import bpy
import math
import os

OUTPUT_DIR = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def make_mat(name, color, metallic=0.0, roughness=0.5, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        if emission and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat

def build_airport_plane():
    clear_scene()
    hull_mat = make_mat("AirlinerHull", (0.95, 0.97, 1.0), metallic=0.25, roughness=0.22)
    livery_mat = make_mat("StarlightBlue", (0.08, 0.32, 0.68), metallic=0.35, roughness=0.25)
    gold_mat = make_mat("StarlightGold", (0.88, 0.68, 0.22), metallic=0.85, roughness=0.22)
    glass_mat = make_mat("CockpitGlass", (0.12, 0.22, 0.38), metallic=0.8, roughness=0.08, emission=(0.25, 0.55, 0.95), emission_strength=0.35)
    steel_mat = make_mat("TurbineSteel", (0.65, 0.70, 0.76), metallic=0.9, roughness=0.2)
    dark_mat = make_mat("TireRubber", (0.10, 0.12, 0.15), metallic=0.1, roughness=0.8)

    # Fuselage cylinder along Y (which exports to Z in glTF)
    bpy.ops.mesh.primitive_cylinder_add(vertices=28, radius=0.42, depth=2.6, location=(0, 0, 1.55), rotation=(math.pi / 2, 0, 0))
    fuselage = bpy.context.active_object
    fuselage.data.materials.append(hull_mat)
    bpy.ops.object.shade_smooth()

    # Gold cheatline stripe along fuselage
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.05, 1.56))
    stripe = bpy.context.active_object
    stripe.scale = (0.435, 1.28, 0.035)
    stripe.data.materials.append(gold_mat)

    # Nose cone
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.42, location=(0, 1.3, 1.55))
    nose = bpy.context.active_object
    nose.scale = (0.98, 1.35, 0.92)
    nose.data.materials.append(hull_mat)
    bpy.ops.object.shade_smooth()

    # Cockpit windshield visor
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, radius=0.32, location=(0, 1.42, 1.68))
    visor = bpy.context.active_object
    visor.scale = (0.88, 0.95, 0.48)
    visor.data.materials.append(glass_mat)
    bpy.ops.object.shade_smooth()

    # Tail cone
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.42, radius2=0.08, depth=0.95, location=(0, -1.75, 1.62), rotation=(-math.pi / 2, 0, 0))
    tail_cone = bpy.context.active_object
    tail_cone.data.materials.append(hull_mat)
    bpy.ops.object.shade_smooth()

    # Vertical tail fin (swept)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.72, 2.22), rotation=(0.28, 0, 0))
    vfin = bpy.context.active_object
    vfin.scale = (0.05, 0.36, 0.52)
    vfin.data.materials.append(livery_mat)

    # Gold star emblem on tail fin
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.14, depth=0.12, location=(0, -1.72, 2.26), rotation=(0, math.pi / 2, 0))
    emblem = bpy.context.active_object
    emblem.data.materials.append(gold_mat)

    # Horizontal stabilizers
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.75, 1.68))
    hstab = bpy.context.active_object
    hstab.scale = (0.75, 0.22, 0.03)
    hstab.data.materials.append(livery_mat)

    # Main swept wings + winglets + twin turbofan nacelles
    for sign in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 1.05, -0.05, 1.48), rotation=(0, -sign * 0.06, -sign * 0.18))
        wing = bpy.context.active_object
        wing.scale = (0.92, 0.32, 0.04)
        wing.data.materials.append(hull_mat)

        # Winglet
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sign * 1.92, -0.22, 1.68), rotation=(0.2, sign * 0.22, 0))
        winglet = bpy.context.active_object
        winglet.scale = (0.03, 0.14, 0.20)
        winglet.data.materials.append(livery_mat)

        # Engine nacelle
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.18, depth=0.55, location=(sign * 0.85, 0.18, 1.28), rotation=(math.pi / 2, 0, 0))
        nacelle = bpy.context.active_object
        nacelle.data.materials.append(livery_mat)
        bpy.ops.object.shade_smooth()

        # Engine intake lip
        bpy.ops.mesh.primitive_torus_add(major_radius=0.17, minor_radius=0.025, location=(sign * 0.85, 0.45, 1.28), rotation=(math.pi / 2, 0, 0))
        lip = bpy.context.active_object
        lip.data.materials.append(steel_mat)
        bpy.ops.object.shade_smooth()

        # Cabin illuminated windows
        for i in range(6):
            wy = 0.85 - i * 0.34
            bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.055, depth=0.04, location=(sign * 0.41, wy, 1.64), rotation=(0, math.pi / 2, 0))
            win = bpy.context.active_object
            win.data.materials.append(glass_mat)

    # Display stand pedestal pillars
    for dy in (-0.55, 0.55):
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.07, depth=0.65, location=(0, dy, 0.95))
        strut = bpy.context.active_object
        strut.data.materials.append(gold_mat)

        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.16, depth=0.06, location=(0, dy, 0.65))
        pad = bpy.context.active_object
        pad.data.materials.append(dark_mat)

    out_path = os.path.join(OUTPUT_DIR, "airport_plane.glb")
    bpy.ops.export_scene.gltf(filepath=out_path, export_format='GLB')
    print("Exported:", out_path)

if __name__ == "__main__":
    build_airport_plane()
