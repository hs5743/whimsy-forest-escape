import bpy
import math
import random
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

def create_study_desk(output_path):
    clear_scene()

    mat_wood = create_pbr_material("Mat_DeskWood", base_color=(0.26, 0.13, 0.07, 1.0), roughness=0.42, metallic=0.05)
    mat_inlay = create_pbr_material("Mat_LeatherInlay", base_color=(0.12, 0.22, 0.16, 1.0), roughness=0.6, metallic=0.0) # Green leather desk blotter
    mat_brass = create_pbr_material("Mat_DeskBrass", base_color=(0.92, 0.74, 0.25, 1.0), roughness=0.25, metallic=0.85)

    root = bpy.data.objects.new("StudyDeskRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Main Desktop (2.4m wide x 1.2m deep x 0.1m thick, top height = 0.95m)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    top = bpy.context.active_object
    top.name = "DeskTop"
    top.scale = (2.4, 1.2, 0.1)
    top.location = (0.0, 0.0, 0.90)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = top.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.02
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    top.data.materials.append(mat_wood)
    top.parent = root

    # Green Leather Writing Blotter Inlay
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    blotter = bpy.context.active_object
    blotter.name = "WritingBlotter"
    blotter.scale = (1.6, 0.8, 0.005)
    blotter.location = (0.0, 0.0, 0.953)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    blotter.data.materials.append(mat_inlay)
    blotter.parent = root

    # Gold Edge Trimming around desk
    for side, sy in [(-1, -0.60), (1, 0.60)]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        trim = bpy.context.active_object
        trim.name = f"GoldTrim_{side}"
        trim.scale = (2.42, 0.03, 0.03)
        trim.location = (0.0, sy, 0.90)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        trim.data.materials.append(mat_brass)
        trim.parent = root

    # 4 Carved Cabriole Legs
    for lx in [-1.05, 1.05]:
        for ly in [-0.48, 0.48]:
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            leg = bpy.context.active_object
            leg.name = f"DeskLeg_{lx}_{ly}"
            leg.scale = (0.12, 0.12, 0.85)
            leg.location = (lx, ly, 0.425)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            mod = leg.modifiers.new(name="Bevel", type='BEVEL')
            mod.width = 0.015
            mod.segments = 2
            bpy.ops.object.modifier_apply(modifier="Bevel")
            leg.data.materials.append(mat_wood)
            leg.parent = root

    # Left & Right Pedestal Cabinets
    for px in [-0.75, 0.75]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        ped = bpy.context.active_object
        ped.name = f"DeskPedestal_{px}"
        ped.scale = (0.50, 0.85, 0.55)
        ped.location = (px, 0.0, 0.575)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = ped.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.01
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        ped.data.materials.append(mat_wood)
        ped.parent = root

    # Interactive Center/Right Sliding Drawer (Named DrawerMesh)
    drawer_root = bpy.data.objects.new("DrawerMesh", None)
    bpy.context.collection.objects.link(drawer_root)
    drawer_root.location = (0.6, 0.0, 0.80)
    drawer_root.parent = root

    # Drawer Box Body
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    drawer_box = bpy.context.active_object
    drawer_box.name = "DrawerBox"
    drawer_box.scale = (0.45, 0.80, 0.22)
    drawer_box.location = (0.0, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = drawer_box.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.01
    mod.segments = 2
    bpy.ops.object.modifier_apply(modifier="Bevel")
    drawer_box.data.materials.append(mat_wood)
    drawer_box.parent = drawer_root

    # Brass Pull Handle & Keyhole
    bpy.ops.mesh.primitive_torus_add(major_radius=0.035, minor_radius=0.008, major_segments=16, minor_segments=8)
    pull = bpy.context.active_object
    pull.name = "DrawerPull"
    pull.rotation_euler = (math.pi / 2, 0, 0)
    pull.location = (0.0, 0.42, 0.0)
    pull.data.materials.append(mat_brass)
    pull.parent = drawer_root

    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.008, vertices=12)
    escutcheon = bpy.context.active_object
    escutcheon.name = "DrawerKeyhole"
    escutcheon.rotation_euler = (math.pi / 2, 0, 0)
    escutcheon.location = (0.0, 0.41, 0.05)
    escutcheon.data.materials.append(mat_brass)
    escutcheon.parent = drawer_root

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Study Desk to {output_path}")

def create_bookshelf(output_path):
    clear_scene()

    mat_wood = create_pbr_material("Mat_ShelfWood", base_color=(0.28, 0.14, 0.07, 1.0), roughness=0.5, metallic=0.05)
    mat_gold = create_pbr_material("Mat_ShelfGold", base_color=(0.92, 0.75, 0.25, 1.0), roughness=0.3, metallic=0.85)

    book_mats = [
        create_pbr_material("Mat_BookCrimson", base_color=(0.65, 0.12, 0.15, 1.0), roughness=0.6),
        create_pbr_material("Mat_BookNavy", base_color=(0.12, 0.22, 0.55, 1.0), roughness=0.6),
        create_pbr_material("Mat_BookEmerald", base_color=(0.15, 0.45, 0.25, 1.0), roughness=0.6),
        create_pbr_material("Mat_BookAmber", base_color=(0.82, 0.55, 0.18, 1.0), roughness=0.5),
        create_pbr_material("Mat_BookViolet", base_color=(0.45, 0.18, 0.55, 1.0), roughness=0.6),
    ]

    root = bpy.data.objects.new("BookshelfRoot", None)
    bpy.context.collection.objects.link(root)

    # 1. Main Outer Frame (3.2m wide, 3.6m tall, 0.6m deep)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    frame = bpy.context.active_object
    frame.name = "ShelfFrame"
    frame.scale = (3.2, 0.6, 3.6)
    frame.location = (0.0, 0.0, 1.8)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = frame.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.025
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    frame.data.materials.append(mat_wood)
    frame.parent = root

    # Carved Crown Moulding / Cornice at top
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    cornice = bpy.context.active_object
    cornice.name = "ShelfCornice"
    cornice.scale = (3.35, 0.70, 0.18)
    cornice.location = (0.0, 0.0, 3.65)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = cornice.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = 0.03
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    cornice.data.materials.append(mat_wood)
    cornice.parent = root

    # Carved Side Fluted Pilasters
    for px in [-1.55, 1.55]:
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        pilaster = bpy.context.active_object
        pilaster.name = f"Pilaster_{px}"
        pilaster.scale = (0.16, 0.64, 3.6)
        pilaster.location = (px, 0.0, 1.8)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = pilaster.modifiers.new(name="Bevel", type='BEVEL')
        mod.width = 0.015
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier="Bevel")
        pilaster.data.materials.append(mat_wood)
        pilaster.parent = root

    # 4 Inner Horizontal Shelves
    for i in range(4):
        sz = 0.7 + i * 0.8
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        sh = bpy.context.active_object
        sh.name = f"ShelfBoard_{i}"
        sh.scale = (2.95, 0.54, 0.06)
        sh.location = (0.0, 0.0, sz)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        sh.data.materials.append(mat_wood)
        sh.parent = root

        # Populate each shelf with detailed books
        random.seed(42 + i)
        bx = -1.35
        book_idx = 0
        while bx < 1.30:
            bw = random.uniform(0.06, 0.12)
            bh = random.uniform(0.35, 0.55)
            bd = random.uniform(0.32, 0.42)
            
            # Slight random tilt for realism
            tilt = random.choice([0, 0, 0, random.uniform(-0.15, 0.15)])
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            book = bpy.context.active_object
            book.name = f"Book_{i}_{book_idx}"
            book.scale = (bw, bd, bh)
            book.rotation_euler = (0, tilt, 0)
            book.location = (bx + bw / 2, 0.02, sz + 0.03 + bh / 2)
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
            mod = book.modifiers.new(name="Bevel", type='BEVEL')
            mod.width = 0.005
            mod.segments = 2
            bpy.ops.object.modifier_apply(modifier="Bevel")
            
            mat = random.choice(book_mats)
            book.data.materials.append(mat)
            book.parent = root

            bx += bw + random.uniform(0.01, 0.03)
            book_idx += 1

    # Export to GLB
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_apply=False
    )
    print(f"Exported Bookshelf to {output_path}")

if __name__ == "__main__":
    out_desk = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\study_desk.glb")
    out_shelf = os.path.abspath(r"c:\Codex_Work_2026\whimsy-forest-escape\assets\models\grand_bookshelf.glb")
    create_study_desk(out_desk)
    create_bookshelf(out_shelf)
