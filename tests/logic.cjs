// Uji logika aplikasi; bukan pengganti pengujian browser, GPU atau kamera.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
class Element {
  constructor(tag = 'div') {
    this.tag = tag; this.children = []; this.attributes = {}; this.listeners = {};
    this.components = {}; this.dataset = {}; this.value = '';
    this.object3D = { rotation: { x: 0, y: 0, z: 0, set(x,y,z) { Object.assign(this,{x,y,z}); } } };
  }
  setAttribute(k,v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  hasAttribute(k) { return k in this.attributes; }
  appendChild(child) { this.children.push(child); }
  removeChild(child) { this.children.splice(this.children.indexOf(child),1); }
  get firstChild() { return this.children[0]; }
  addEventListener(k,fn) { (this.listeners[k] ||= []).push(fn); }
  emit(k,event = {}) { for (const fn of this.listeners[k] || []) fn(event); }
}
const ids = Object.fromEntries(['status-aplikasi','marker-hiro','status-marker','tekstur-bumi',
  'pilih-planet','informasi-planet','tombol-jeda','kecepatan','tata-surya'].map(id => [id,new Element()]));
const document = new Element();
document.createElement = tag => new Element(tag);
document.getElementById = id => ids[id];
document.querySelectorAll = () => [ids['tekstur-bumi']];
const window = new Element();
const AFRAME = { systems: { arjs: {} }, registerComponent(name,definition) { this.definition = definition; } };
window.AFRAME = AFRAME;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../script.js'),'utf8'), {
  window, document, AFRAME, THREE: { MathUtils: { degToRad: x => x * Math.PI / 180 } }
});
const component = { el: ids['tata-surya'] };
AFRAME.definition.init.call(component);
component.el.components['tata-surya'] = component;
document.emit('DOMContentLoaded');
assert.equal(component.planet.length,8);
const earth = component.planet.find(p => p.nama === 'Bumi');
assert.equal(earth.bola.getAttribute('material').src,'#tekstur-bumi');
assert.equal(earth.bola.getAttribute('material').color,'#ffffff');
function select(name) { ids['pilih-planet'].value = name; ids['pilih-planet'].emit('change'); }
for (const planet of component.planet) {
  const material = planet.bola.getAttribute('material');
  assert.equal(material.color,planet.data.tekstur ? '#ffffff' : planet.data.warna);
  assert.equal(material.src || '',planet.data.tekstur ? `#tekstur-${planet.nama.toLowerCase()}` : '');
}
for (let i = 0; i < 20; i++) {
  for (const name of [...component.planet.map(p => p.nama),'']) {
    select(name);
    assert.equal(component.planetDetail.children.length,name ? 1 : 0);
    assert.equal(component.planetDetail.getAttribute('visible'),Boolean(name));
    if (name) {
      const planet = component.planet.find(p => p.nama === name);
      const sphere = component.planetDetail.firstChild;
      assert.equal(sphere.getAttribute('material').color,planet.data.tekstur ? '#ffffff' : planet.data.warna);
      assert.equal(sphere.getAttribute('material').src,planet.data.tekstur ? `#tekstur-${name.toLowerCase()}` : '');
      assert.ok(Math.abs(Number(sphere.getAttribute('scale').split(' ')[0]) * planet.data.radius - 1.1) < 1e-10);
    }
    for (const child of component.el.children) {
      if (child !== component.planetDetail && !child.hasAttribute('light')) assert.equal(child.getAttribute('visible'),!name);
    }
    if (name === 'Bumi') {
      const sphere = component.planetDetail.firstChild;
      assert.equal(sphere.getAttribute('material').src,'#tekstur-bumi');
      assert.equal(sphere.getAttribute('material').color,'#ffffff');
      assert.equal(sphere.children.length,0);
      assert.equal(sphere.getAttribute('scale'),'6.875 6.875 6.875');
    }
    if (name === 'Saturnus') assert.equal(component.planetDetail.firstChild.children.filter(c => c.tag === 'a-ring').length,1);
  }
}
const tick = () => AFRAME.definition.tick.call(component,0,100);
const snapshot = () => [component.planetDetail.object3D.rotation.y,...component.planet.flatMap(p => [p.bola.object3D.rotation.y,p.pusatOrbit.object3D.rotation.y])];
for (const mode of ['', ...component.planet.map(p => p.nama)]) {
  select(mode);
  ids['tombol-jeda'].emit('click');
  const stopped = snapshot(); tick(); assert.deepEqual(snapshot(),stopped);
  for (const speed of [0.5,1,2,4]) {
    ids.kecepatan.value = String(speed); ids.kecepatan.emit('change');
    tick(); assert.deepEqual(snapshot(),stopped);
  }
  select('Saturnus'); assert.equal(component.dijeda,true);
  select(mode);
  ids['tombol-jeda'].emit('click');
  for (const speed of [0.5,1,2,4]) {
    ids.kecepatan.value = String(speed); ids.kecepatan.emit('change');
    const before = snapshot(); tick(); const after = snapshot();
    assert.ok(Math.abs(after[0]-before[0]-0.08*speed) < 1e-10);
    assert.ok(Math.abs(after[1]-before[1]-0.08*speed) < 1e-10);
    assert.ok(Math.abs(after[2]-before[2]-component.planet[0].kecepatanOrbit*0.1*speed) < 1e-10);
  }
}
ids['marker-hiro'].emit('markerFound'); assert.equal(ids['status-marker'].dataset.found,'true');
ids['marker-hiro'].emit('markerLost'); assert.equal(ids['status-marker'].dataset.found,'false');
window.emit('camera-error'); assert.match(ids['status-aplikasi'].textContent,/Kamera gagal/);
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for (const [,asset] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^https?:/.test(asset)) continue;
  const url = new URL(asset,'https://example.github.io/Augmented_Reality_UTSnicole/');
  assert.ok(url.pathname.startsWith('/Augmented_Reality_UTSnicole/'));
  assert.ok(fs.existsSync(path.join(__dirname,'..',asset)),`Aset hilang: ${asset}`);
}
console.log('PASS: 180 pergantian pilihan, material seluruh planet pada kedua mode, cincin, skala, visibilitas, jeda, kecepatan, status. DOM/A-Frame tiruan; render dan kamera belum diuji.');
