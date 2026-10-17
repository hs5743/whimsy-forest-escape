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

def create_harbor_galleon(output_path):
    clear_scene()

    # Materials
    mat_hull_oak = create_pbr_material("Mat_HullOak", base_color=(0.32, 0.20, 0.11, 1.0), roughness=0.75, metallic=0.02)
    mat_deck_pine = create_pbr_material("Mat_DeckPine", base_color=(0.60, 0.48, 0.30, 1.0), roughness=0.7, metallic=0.0)
    mat_dark_wood = create_pbr_material("Mat_DarkTrim", base_color=(0.18, 0.10, 0.05, 1.0), roughness=0.8, metallic=0.0)
    mat_canvas_sail = create_pbr_material("Mat_CanvasSail", base_color=(0.95, 0.92, 0.82, 1.0), roughness=0.85, metallic=0.0)
    mat_brass_gold = create_pbr_material("Mat_GalleonGold", base_color=(0.92, 0.78, 0.25, 1.0), roughness=0.25, metallic=0.85)
    mat_iron = create_pbr_material("Mat_GalleonIron", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.55, metallic=0.8)

    root = bpy.data.objects.new("GalleonRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Main Hull
    # Lower hull (waterline to deck)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    hull = bpy.context.active_object
    hull.name = "GalleonHull"
    hull.scale = (8.5, 2.6, 1.6)
    hull.location = (0.0, 0.0, 0.9)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = hull.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.35
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    hull.data.materials.append(mat_hull_oak)
    hull.parent = root

    # Sterncastle (Elevated rear poop deck)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    stern = bpy.context.active_object
    stern.name = "SternCastle"
    stern.scale = (2.6, 2.4, 1.2)
    stern.location = (-2.8, 0.0, 2.2)
    stern.data.materials.append(mat_hull_oak)
    stern.parent = root

    # Forecastle (Elevated front deck)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    forecastle = bpy.context.active_object
    forecastle.name = "ForeCastle"
    forecastle.scale = (1.8, 2.0, 0.8)
    forecastle.location = (3.2, 0.0, 1.9)
    forecastle.data.materials.append(mat_hull_oak)
    forecastle.parent = root

    # Stern Galley Balcony (Decorative gold trim)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    balcony = bpy.context.active_object
    balcony.name = "SternBalcony"
    balcony.scale = (0.3, 2.0, 0.6)
    balcony.location = (-4.2, 0.0, 2.2)
    balcony.data.materials.append(mat_brass_gold)
    balcony.parent = root

    # Bowsprit (Diagonal mast pointing forward)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=3.2, vertices=12)
    bowsprit = bpy.context.active_object
    bowsprit.name = "Bowsprit"
    bowsprit.rotation_euler = (0, math.radians(-70), 0)
    bowsprit.location = (5.2, 0.0, 2.3)
    bowsprit.data.materials.append(mat_dark_wood)
    bowsprit.parent = root

    # 2. Main Deck Planking
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    deck = bpy.context.active_object
    deck.name = "MainDeck"
    deck.scale = (6.0, 2.3, 0.05)
    deck.location = (0.0, 0.0, 1.72)
    deck.data.materials.append(mat_deck_pine)
    deck.parent = root

    # Ship's Helm Wheel
    bpy.ops.mesh.primitive_torus_add(major_radius=0.28, minor_radius=0.025, major_segments=16, minor_segments=8)
    helm = bpy.context.active_object
    helm.name = "HelmWheel"
    helm.rotation_euler = (0, math.pi / 2, 0)
    helm.location = (-2.0, 0.0, 2.85)
    helm.data.materials.append(mat_brass_gold)
    helm.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.6, vertices=10)
    helm_stand = bpy.context.active_object
    helm_stand.location = (-2.0, 0.0, 2.5)
    helm_stand.data.materials.append(mat_dark_wood)
    helm_stand.parent = root

    # 3. Three Towering Masts & Sails
    masts_data = [
        ("ForeMast", (1.8, 0.0, 4.8), 6.5, 2.8),
        ("MainMast", (-0.4, 0.0, 5.5), 7.8, 3.4),
        ("MizzenMast", (-2.6, 0.0, 4.4), 5.6, 2.2),
    ]

    for m_name, pos, height, yard_len in masts_data:
        # Mast column
        bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=height, vertices=12)
        mast = bpy.context.active_object
        mast.name = m_name
        mast.location = pos
        mast.data.materials.append(mat_dark_wood)
        mast.parent = root

        # Crow's Nest near top
        bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.35, vertices=16)
        crows_nest = bpy.context.active_object
        crows_nest.name = f"{m_name}_CrowsNest"
        crows_nest.location = (pos[0], pos[1], pos[2] + height * 0.35)
        crows_nest.data.materials.append(mat_hull_oak)
        crows_nest.parent = root

        # Yardarm (horizontal spar)
        bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=yard_len, vertices=10)
        yard = bpy.context.active_object
        yard.name = f"{m_name}_Yard"
        yard.rotation_euler = (math.pi / 2, 0, 0)
        yard.location = (pos[0], pos[1], pos[2] + height * 0.15)
        yard.data.materials.append(mat_dark_wood)
        yard.parent = root

        # Billowing Canvas Square Sail
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        sail = bpy.context.active_object
        sail.name = f"{m_name}_Sail"
        sail.scale = (0.04, yard_len * 0.9, height * 0.38)
        sail.location = (pos[0] + 0.12, pos[1], pos[2] - height * 0.05)
        sail.data.materials.append(mat_canvas_sail)
        sail.parent = root

    # 4. Iron Anchor hanging on port bow
    bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.04, major_segments=16, minor_segments=8)
    anchor_fluke = bpy.context.active_object
    anchor_fluke.name = "AnchorMesh"
    anchor_fluke.rotation_euler = (0, math.pi / 2, 0)
    anchor_fluke.location = (3.8, 1.4, 0.9)
    anchor_fluke.data.materials.append(mat_iron)
    anchor_fluke.parent = root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.9, vertices=10)
    anchor_shank = bpy.context.active_object
    anchor_shank.location = (3.8, 1.4, 1.25)
    anchor_shank.data.materials.append(mat_iron)
    anchor_shank.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[HarborGalleon] Exported to: {output_path}")

def create_harbor_lighthouse(output_path):
    clear_scene()

    mat_stone_white = create_pbr_material("Mat_LighthouseWhite", base_color=(0.90, 0.88, 0.84, 1.0), roughness=0.8, metallic=0.0)
    mat_stone_red = create_pbr_material("Mat_LighthouseRed", base_color=(0.78, 0.16, 0.16, 1.0), roughness=0.75, metallic=0.02)
    mat_granite_base = create_pbr_material("Mat_GranitePlinth", base_color=(0.42, 0.42, 0.44, 1.0), roughness=0.85, metallic=0.05)
    mat_iron_gallery = create_pbr_material("Mat_GalleryIron", base_color=(0.14, 0.14, 0.16, 1.0), roughness=0.5, metallic=0.85)
    mat_brass = create_pbr_material("Mat_FresnelBrass", base_color=(0.95, 0.80, 0.28, 1.0), roughness=0.25, metallic=0.85)
    mat_beacon_glow = create_pbr_material("Mat_FresnelBeaconGlow", base_color=(1.0, 0.96, 0.65, 1.0), roughness=0.1, metallic=0.0, emission_color=(1.0, 0.95, 0.60, 1.0), emission_strength=5.0)
    mat_patina_copper = create_pbr_material("Mat_PatinaDome", base_color=(0.28, 0.58, 0.52, 1.0), roughness=0.5, metallic=0.25)

    root = bpy.data.objects.new("LighthouseRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Octagonal Stone Plinth Base
    bpy.ops.mesh.primitive_cylinder_add(radius=2.8, depth=1.4, vertices=8)
    base = bpy.context.active_object
    base.name = "LighthouseBase"
    base.location = (0.0, 0.0, 0.7)
    base.data.materials.append(mat_granite_base)
    base.parent = root

    # 2. Tapering Cylindrical Tower in alternating red & white masonry bands
    bands_info = [
        (0.0, 1.4, 2.5, 2.3, mat_stone_white),
        (1.4, 3.2, 2.3, 2.1, mat_stone_red),
        (3.2, 5.0, 2.1, 1.9, mat_stone_white),
        (5.0, 6.8, 1.9, 1.7, mat_stone_red),
        (6.8, 8.6, 1.7, 1.5, mat_stone_white),
    ]

    for b_start, b_end, r_bottom, r_top, mat in bands_info:
        b_height = b_end - b_start
        b_mid = b_start + b_height / 2 + 1.4
        bpy.ops.mesh.primitive_cone_add(radius1=r_bottom, radius2=r_top, depth=b_height, vertices=24)
        band = bpy.context.active_object
        band.name = f"TowerBand_{b_start:.1f}"
        band.location = (0.0, 0.0, b_mid)
        band.data.materials.append(mat)
        band.parent = root

    # 3. Upper Balcony Gallery Platform
    bpy.ops.mesh.primitive_cylinder_add(radius=2.0, depth=0.25, vertices=24)
    gallery_floor = bpy.context.active_object
    gallery_floor.name = "GalleryFloor"
    gallery_floor.location = (0.0, 0.0, 10.15)
    gallery_floor.data.materials.append(mat_granite_base)
    gallery_floor.parent = root

    # Iron Railing around gallery
    bpy.ops.mesh.primitive_torus_add(major_radius=1.92, minor_radius=0.035, major_segments=24, minor_segments=8)
    railing = bpy.context.active_object
    railing.name = "GalleryRailing"
    railing.location = (0.0, 0.0, 10.9)
    railing.data.materials.append(mat_iron_gallery)
    railing.parent = root

    # 4. Glass Lantern Room Housing
    bpy.ops.mesh.primitive_cylinder_add(radius=1.35, depth=1.6, vertices=16)
    lantern_glass = bpy.context.active_object
    lantern_glass.name = "LanternRoomHousing"
    lantern_glass.location = (0.0, 0.0, 11.05)
    lantern_glass.data.materials.append(mat_granite_base)
    lantern_glass.parent = root

    # 5. Inner Rotating Fresnel Lens Crystal Beacon
    bpy.ops.mesh.primitive_cylinder_add(radius=0.6, depth=1.1, vertices=16)
    beacon = bpy.context.active_object
    beacon.name = "FresnelBeacon"
    beacon.location = (0.0, 0.0, 11.05)
    beacon.data.materials.append(mat_beacon_glow)
    beacon.parent = root

    # Brass Concentric Lens Rings around Beacon
    for r_z in [-0.35, 0.0, 0.35]:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.65, minor_radius=0.03, major_segments=16, minor_segments=8)
        ring = bpy.context.active_object
        ring.name = f"FresnelRing_{r_z}"
        ring.location = (0.0, 0.0, 11.05 + r_z)
        ring.data.materials.append(mat_brass)
        ring.parent = root

    # 6. Patina Copper Roof Dome with Weather Finial
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.45, segments=20, ring_count=12)
    dome = bpy.context.active_object
    dome.name = "LanternDome"
    dome.scale = (1.0, 1.0, 0.65)
    dome.location = (0.0, 0.0, 12.0)
    dome.data.materials.append(mat_patina_copper)
    dome.parent = root

    bpy.ops.mesh.primitive_cone_add(radius1=0.12, radius2=0.0, depth=0.8, vertices=8)
    finial = bpy.context.active_object
    finial.name = "LighthouseFinial"
    finial.location = (0.0, 0.0, 13.0)
    finial.data.materials.append(mat_brass)
    finial.parent = root

    # Export GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"[HarborLighthouse] Exported to: {output_path}")

if __name__ == "__main__":
    out_dir = r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models"
    create_harbor_galleon(os.path.join(out_dir, "harbor_galleon.glb"))
    create_harbor_lighthouse(os.path.join(out_dir, "harbor_lighthouse.glb"))
