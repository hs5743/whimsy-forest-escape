const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const V = require('../gept-kids-vocabulary.js');

function getZones() {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(require.resolve('../spatial-zone-manager.js'), 'utf8') + ';window.Manager=SpatialZoneManager;', context);
  context.window.Manager.prototype.initTextures = () => {};
  return Object.values(new context.window.Manager({}).zones);
}

test('level vocabulary follows the supplied GEPT PDF or is explicitly marked as an extension', () => {
  assert.equal(V.sourceSha256, 'cd07356a9a30e157a04eb1fae4a35d95900433a004164425177d13ccd9b28c37');
  assert.equal(V.entries.SHIP.pages[0], 12);
  assert.equal(V.entries.COAT.pages[0], 1);
  assert.equal(V.entries.CLOUDY.pages[0], 13);

  const zones = getZones();
  assert.ok(Array.from(zones.find(zone => zone.id === 'zone8').words).includes('COAT'));
  assert.deepEqual(V.schoolCore, Array.from(zones.find(zone => zone.id === 'zone12').words));
  const unclassified = zones.flatMap(zone => zone.words.map(word => ({ zone: zone.id, word })))
    .filter(({ word }) => !V.entries[word] && !V.extensionWords[word]);
  assert.deepEqual(unclassified, []);

  for (const word of ['CLOUD', 'THINK', 'ISLAND', 'GLOVES', 'BOOTS', 'SANDALS']) {
    assert.ok(V.extensionWords[word], `${word} must remain labelled as an extension`);
    assert.equal(V.entries[word], undefined, `${word} must not be presented as a GEPT list entry`);
  }
});
