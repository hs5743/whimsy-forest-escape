const test = require('node:test');
const assert = require('node:assert/strict');
const THREE = require('../three.min.js');

global.THREE = THREE;
const manager = require('../model-asset-manager.js');

function namedGroup(name) {
  const group = new THREE.Group();
  group.name = name;
  return group;
}

function model(children = []) {
  const scene = new THREE.Group();
  children.forEach(child => scene.add(child));
  return { scene };
}

function mesh(name) {
  const object = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshStandardMaterial());
  object.name = name;
  return object;
}

test('study room PBR props keep their authored room anchors and replace fallback geometry', () => {
  const drawer = namedGroup('DrawerMesh');
  const doorLeft = namedGroup('DoorLeft');
  const doorRight = namedGroup('DoorRight');
  doorLeft.position.set(-0.8, 1.6, 0);
  doorRight.position.set(0.8, 1.6, 0);

  const sources = new Map([
    ['grimoire', model([namedGroup('BookCoverHinge'), mesh('KeyMesh')])],
    ['cat_mimic', model([namedGroup('MimicLid')])],
    ['candlestick', model([mesh('CandleFlame')])],
    ['alchemy_table', model([mesh('FlaskLiquid'), mesh('StarStone')])],
    ['study_desk', model([drawer])],
    ['study_exit_door', model([doorLeft, doorRight, mesh('SocketStar'), mesh('SocketFlower')])]
  ]);
  manager.models = sources;
  manager.cloneModel = key => sources.get(key)?.scene.clone(true) ?? null;

  const activeZoneGroup = new THREE.Group();
  const candleGroup = new THREE.Group();
  const alchemyGroup = new THREE.Group();
  const deskGroup = new THREE.Group();
  const doorGroup = new THREE.Group();
  const candleTableMesh = mesh('ProceduralCandleTable');
  activeZoneGroup.add(candleGroup, alchemyGroup, deskGroup, doorGroup, candleTableMesh);
  const world = {
    activeZoneGroup,
    candleGroup,
    candleTableMesh,
    candleLight: new THREE.PointLight(),
    alchemyGroup,
    deskGroup,
    doorGroup,
    bookGroup: new THREE.Group(),
    mimicGroup: new THREE.Group(),
    interactables: [],
    gameState: {
      candleLit: false, bookOpened: false, hasKey: false, drawerOpened: true,
      hasBluePotion: false, alchemyMixed: false, hasStarStone: false,
      doorStonePlaced: false, doorOpened: true, mimicFed: false
    }
  };

  manager.upgradeStudyRoom(world);

  assert.deepEqual([candleGroup.position.x, candleGroup.position.y, candleGroup.position.z], [-3.2, 0, -3.5]);
  assert.equal(world.candleTableMesh, null);
  assert.equal(candleTableMesh.parent, null);
  assert.deepEqual([alchemyGroup.position.x, alchemyGroup.position.y, alchemyGroup.position.z], [-4.5, 0, 0]);
  assert.equal(deskGroup.children[0].position.z, -3.8);
  assert.deepEqual(world.drawerTravel, { closedZ: 0, openZ: 0.5 });

  const upgradedDrawer = deskGroup.getObjectByName('DrawerMesh');
  assert.ok(upgradedDrawer);
  assert.equal(upgradedDrawer.position.z, 0.5);
  assert.ok(world.interactables.includes(upgradedDrawer));
  assert.equal(doorGroup.children[0].position.z, 5.8);
  assert.equal(doorGroup.getObjectByName('DoorLeft').position.x, -1.7);
  assert.equal(doorGroup.getObjectByName('DoorRight').position.x, 1.7);
});
