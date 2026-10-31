/* Abhishek Kumar World — 3D drivable portfolio
   Built with Three.js r128 (rendering) and Cannon.js 0.6.2 (physics).
   Edit the ZONES array below to change the content of each zone. */
(function(){
  // ================= Content =================
  var ZONES = [
    { id:'about', name:'About', color:'#4C7DFF', x:-26, z:-18, icon:'person', html:
      '<p class="eyebrow">About</p><h2>Hi, I’m Abhishek!</h2>' +
      '<p>I’m a Quality Engineer with 5+ years in test automation, API validation and Agile quality assurance, specialising in Tricentis Tosca. My job is to make sure defects get caught in the pipeline, not in production.</p>' +
      '<dl><div><dt>Currently</dt><dd>Optum · UnitedHealth Group</dd></div><div><dt>Based in</dt><dd>India</dd></div><div><dt>Education</dt><dd>B.Tech CSE, Galgotias University, 2021</dd></div><div><dt>Domains</dt><dd>Healthcare &amp; insurance</dd></div></dl>' },
    { id:'experience', name:'Experience', color:'#F28C28', x:26, z:-18, icon:'case', html:
      '<p class="eyebrow">Experience</p><h2>Two teams, five years</h2>' +
      '<div class="role"><h3>Quality Engineer</h3><p class="meta">Optum Global Solutions · UnitedHealth Group · Nov 2025 – present</p><ul>' +
      '<li>Caught and escalated a critical production-impacting defect, earning the Bravo! Diamond Award.</li>' +
      '<li>Added 130+ automated end-to-end healthcare test cases to the regression suite.</li>' +
      '<li>Execute 200+ regression test cases daily and publish suite-health reports.</li>' +
      '<li>Build Recovery and Cleanup Scenarios that keep unattended runs stable.</li></ul></div>' +
      '<div class="role"><h3>Senior Software Engineer</h3><p class="meta">Expleo Group · Pune · Sep 2021 – Nov 2025</p><ul>' +
      '<li>Designed 300+ Tosca test cases for Allianz insurance web and desktop applications.</li>' +
      '<li>Cut regression cycle time by 40% with modular test cases run in parallel on Tosca DEX.</li>' +
      '<li>Reduced maintenance effort by 50% with reusable XScan module standards.</li>' +
      '<li>Automated 120 of 300+ manual REST and SOAP API tests with Tosca API Scan.</li>' +
      '<li>Mentored junior teammates and led retrospectives that improved QA practices.</li></ul></div>' },
    { id:'skills', name:'Skills', color:'#1FB59A', x:-28, z:14, icon:'gear', html:
      '<p class="eyebrow">Skills</p><h2>What I work with</h2><p>Strike! Those pins behind you are fair game.</p>' +
      '<p class="group-label">Automation</p><div class="chips"><span class="chip">Tricentis Tosca</span><span class="chip">XScan</span><span class="chip">TCD</span><span class="chip">DEX</span><span class="chip">TQL</span><span class="chip">Reusable TestStep Blocks</span></div>' +
      '<p class="group-label">API &amp; data</p><div class="chips"><span class="chip">REST</span><span class="chip">SOAP</span><span class="chip">Tosca API Scan</span><span class="chip">Postman</span><span class="chip">SoapUI</span><span class="chip">MySQL</span></div>' +
      '<p class="group-label">Testing</p><div class="chips"><span class="chip">Functional</span><span class="chip">Regression</span><span class="chip">Smoke</span><span class="chip">API</span><span class="chip">UI</span><span class="chip">Database</span></div>' +
      '<p class="group-label">Tools &amp; process</p><div class="chips"><span class="chip">JIRA</span><span class="chip">Confluence</span><span class="chip">ALM</span><span class="chip">Rally</span><span class="chip">CI/CD</span><span class="chip">Scrum</span><span class="chip">Kanban</span></div>' },
    { id:'certs', name:'Certifications', color:'#E8A80C', x:0, z:26, icon:'gem', html:
      '<p class="eyebrow">Certifications</p><h2>Twelve and counting</h2><p>The crate tower behind this zone holds ten of them. Knock it down.</p>' +
      '<p class="group-label">Tricentis Academy</p><div class="chips"><span class="chip">AS1</span><span class="chip">AS2</span><span class="chip">TDS1</span><span class="chip">TDS2</span><span class="chip">AE1</span><span class="chip">API Deep Dive</span><span class="chip">TQL</span></div>' +
      '<div class="list-rows"><div><span>Certified Tester – Foundation Level</span><span>ISTQB</span></div><div><span>Generative AI · AI Dojo, Mar 2026</span><span>Optum.ai</span></div><div><span>ABS (L1), SQL, Agile with Atlassian Jira</span><span>Allianz</span></div></div>' },
    { id:'awards', name:'Awards', color:'#B45CE6', x:28, z:14, icon:'star', html:
      '<p class="eyebrow">Awards</p><h2>Recognition</h2>' +
      '<div class="role"><h3>Bravo! Diamond Award</h3><p class="meta">UnitedHealth Group · Jun 2026</p><p>Identified and escalated a critical production-impacting defect as part of the Tosca Automation team.</p></div>' +
      '<div class="role"><h3>Bold Mind Award</h3><p class="meta">Expleo Group · Dec 2024</p><p>For innovative Tosca solutions and test strategy improvements.</p></div>' +
      '<div class="role"><h3>Applause Award</h3><p class="meta">Expleo Group · Apr 2024</p><p>For reducing regression cycle time through automation optimization.</p></div>' +
      '<div class="role"><h3>WoW Award</h3><p class="meta">Expleo Group · Sep 2023</p><p>For contributions to enterprise automation delivery.</p></div>' },
    { id:'contact', name:'Contact', color:'#2FA84F', x:0, z:-38, icon:'mail', html:
      '<p class="eyebrow">Contact</p><h2>Let’s talk</h2><p>Open to conversations about test automation and Tosca.</p>' +
      '<dl><div><dt>Email</dt><dd><a href="mailto:rajputabhishek677@gmail.com">rajputabhishek677@gmail.com</a></dd></div><div><dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/abhishek-kumar2301" target="_blank" rel="noopener">abhishek-kumar2301</a></dd></div><div><dt>GitHub</dt><dd><a href="https://github.com/Abhi23raj472" target="_blank" rel="noopener">Abhi23raj472</a></dd></div><div><dt>Résumé</dt><dd><a href="Abhishek_Kumar_Resume.pdf" target="_blank" rel="noopener">Download PDF</a></dd></div></dl>' }
  ];
  var CRATES = ['AS1','AS2','TDS1','TDS2','AE1','API','TQL','ISTQB','GenAI','SQL'];

  var $ = function(id){ return document.getElementById(id); };
  var panel = $('panel'), hint = $('hint'), canvas = $('scene');
  var paused = true, ready = false;

  $('dots').innerHTML = ZONES.map(function(z){ return '<i data-z="' + z.id + '"></i>'; }).join('');
  var visited = {};
  function markVisited(zn){
    if (visited[zn.id]) return; visited[zn.id] = true;
    var dot = document.querySelector('#dots i[data-z="' + zn.id + '"]');
    if (dot) { dot.classList.add('on'); dot.style.background = zn.color; }
    $('visitedCount').textContent = Object.keys(visited).length;
  }

  $('classicBody').innerHTML = ZONES.map(function(z){ return '<section>' + z.html + '</section>'; }).join('');
  function startWorld(){ if (!ready) return; $('introOverlay').hidden = true; paused = false; canvas.focus({ preventScroll: true }); }
  function openClassic(){ $('introOverlay').hidden = true; $('classicOverlay').hidden = false; $('classicClose').focus(); paused = true; }
  function closeClassic(){ $('classicOverlay').hidden = true; if (ready) { paused = false; canvas.focus({ preventScroll: true }); } }
  $('classicBtn').addEventListener('click', openClassic);
  $('introClassicBtn').addEventListener('click', openClassic);
  $('classicClose').addEventListener('click', closeClassic);
  $('startBtn').addEventListener('click', startWorld);

  function noWorld(){ openClassic(); $('classicClose').hidden = true; }
  if (typeof THREE === 'undefined' || typeof CANNON === 'undefined') { noWorld(); return; }
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { noWorld(); return; }

  var isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var lowPower = isTouch || Math.min(window.innerWidth, window.innerHeight) < 600;
  if (isTouch) $('touchTip').hidden = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  (function(){
    var c = document.createElement('canvas'); c.width = 4; c.height = 256;
    var g = c.getContext('2d'), grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#6EC1F0'); grd.addColorStop(0.6, '#A9DDF2'); grd.addColorStop(1, '#FCE9D2');
    g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; scene.background = t;
  })();
  scene.fog = new THREE.Fog(0xCFE8EE, 60, 130);
  var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);

  // ================= Lights =================
  scene.add(new THREE.HemisphereLight(0xcfeaff, 0x8fcf9f, 0.85));
  var sun = new THREE.DirectionalLight(0xfff2dc, 1.25);
  sun.castShadow = true; sun.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  var sc = sun.shadow.camera; sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 120;
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
  scene.add(sun); scene.add(sun.target);

  // ================= Physics world =================
  var world = new CANNON.World();
  world.gravity.set(0, -13, 0);
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.defaultContactMaterial.friction = 0.35;
  world.defaultContactMaterial.restitution = 0.15;
  var groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(new CANNON.Plane());
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);

  var dynamics = []; // {mesh, body, home:{p,q}}
  function addDynamic(mesh, body){
    world.addBody(body); scene.add(mesh);
    var rec = { mesh: mesh, body: body, hp: body.position.clone(), hq: body.quaternion.clone() };
    dynamics.push(rec); return rec;
  }
  function staticBox(x, y, z, hx, hy, hz, rotY){
    var b = new CANNON.Body({ mass: 0 }); b.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
    b.position.set(x, y, z); if (rotY) b.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotY); world.addBody(b); return b;
  }
  function staticCyl(x, z, r, h){
    var b = new CANNON.Body({ mass: 0 }); var s = new CANNON.Cylinder(r, r, h, 10);
    var q = new CANNON.Quaternion(); q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    b.addShape(s, new CANNON.Vec3(0, 0, 0), q); b.position.set(x, h / 2, z); world.addBody(b); return b;
  }

  // ================= Helpers =================
  function std(color, opts){ var o = opts || {}; return new THREE.MeshStandardMaterial({ color: color, roughness: o.r !== undefined ? o.r : 0.7, metalness: o.m || 0, flatShading: !!o.flat }); }
  function shadow(m, cast, recv){ m.castShadow = cast !== false; m.receiveShadow = recv !== false; return m; }
  function roundedBox(w, h, d, r){
    var s = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    s.moveTo(x, y - r); s.lineTo(x + W, y - r); s.quadraticCurveTo(x + W + r, y - r, x + W + r, y);
    s.lineTo(x + W + r, y + H); s.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r);
    s.lineTo(x, y + H + r); s.quadraticCurveTo(x - r, y + H + r, x - r, y + H);
    s.lineTo(x - r, y); s.quadraticCurveTo(x - r, y - r, x, y - r);
    var bev = Math.min(r, d / 4);
    var g = new THREE.ExtrudeGeometry(s, { depth: d - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9, bevelSegments: 4, curveSegments: 8 });
    g.translate(0, 0, -(d - bev * 2) / 2); g.computeVertexNormals(); return g;
  }
  function canvasTex(w, h, draw){
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
  }
  function groundDecal(text, font, color, w, h, cw, ch, x, z){
    var t = canvasTex(cw, ch, function(g, W, H){ g.font = font; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2); });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, roughness: 1 }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.04, z); m.receiveShadow = true; scene.add(m); return m;
  }
  function rng(seed){ return function(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  var rand = rng(11);

  // ================= Ground, paths =================
  var grassTex = canvasTex(256, 256, function(g){
    g.fillStyle = '#9BD58A'; g.fillRect(0, 0, 256, 256);
    var cols = ['#A6DC93', '#8FCB7E', '#B1E29C', '#93D082'];
    for (var i = 0; i < 1800; i++) { g.fillStyle = cols[i % 4]; g.globalAlpha = 0.5; g.fillRect(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 3, 2 + Math.random() * 3); }
  });
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; grassTex.repeat.set(30, 30);
  var ground = new THREE.Mesh(new THREE.CircleGeometry(160, 80), new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  var pathMat = new THREE.MeshStandardMaterial({ color: 0xF3DDB0, roughness: 1 });
  var stoneGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.12, 6), stoneMat = new THREE.MeshStandardMaterial({ color: 0xE6CC98, roughness: 1 });
  function path(x1, z1, x2, z2, w){
    var len = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(x2 - x1, z2 - z1);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), pathMat);
    m.rotation.order = 'YXZ'; m.rotation.set(-Math.PI / 2, ang, 0); m.position.set((x1 + x2) / 2, 0.02, (z1 + z2) / 2); m.receiveShadow = true; scene.add(m);
    for (var d = 0; d < len; d += 3) { // stepping stones edge
      var t = d / len, px = x1 + (x2 - x1) * t, pz = z1 + (z2 - z1) * t, nx = Math.cos(ang), nz = -Math.sin(ang);
      [1, -1].forEach(function(s){ var st = new THREE.Mesh(stoneGeo, stoneMat); st.position.set(px + nx * (w / 2 + 0.25) * s, 0.06, pz + nz * (w / 2 + 0.25) * s); st.receiveShadow = true; scene.add(st); });
    }
  }
  var plaza = new THREE.Mesh(new THREE.CircleGeometry(9, 48), pathMat); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.021; plaza.receiveShadow = true; scene.add(plaza);

  // ================= Trees, bushes, flowers, rocks =================
  var trunkGeo = new THREE.CylinderGeometry(0.22, 0.32, 1.6, 7), trunkMat = std(0x9A6B4F, { flat: true });
  var blobGeo = new THREE.IcosahedronGeometry(1, 1);
  var leafCols = [0x4FB86A, 0x63C46E, 0x3FA65E, 0x7ACC5A, 0xF6A6C1, 0xF9C85A];
  var leafMats = leafCols.map(function(c){ return std(c, { flat: true, r: 0.8 }); });
  var obstaclesXZ = [];
  function tree(x, z, s){
    var g = new THREE.Group(), mat = leafMats[rand() < 0.15 ? 4 + Math.floor(rand() * 2) : Math.floor(rand() * 4)];
    var t = shadow(new THREE.Mesh(trunkGeo, trunkMat)); t.position.y = 0.8; g.add(t);
    var blobs = [[0, 2.2, 0, 1.25], [0.6, 2.7, 0.2, 0.85], [-0.5, 2.8, -0.2, 0.8], [0.1, 3.3, 0, 0.7]];
    blobs.forEach(function(b){ var m = shadow(new THREE.Mesh(blobGeo, mat)); m.position.set(b[0], b[1], b[2]); m.scale.setScalar(b[3]); m.rotation.set(rand(), rand(), rand()); g.add(m); });
    g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = rand() * 6; scene.add(g);
    staticCyl(x, z, 0.35 * s, 3); obstaclesXZ.push([x, z]);
  }
  function bush(x, z, s){
    var mat = leafMats[Math.floor(rand() * 4)];
    for (var i = 0; i < 3; i++) { var m = shadow(new THREE.Mesh(blobGeo, mat)); m.position.set(x + (rand() - 0.5) * s, 0.45 * s, z + (rand() - 0.5) * s); m.scale.setScalar(0.55 * s + rand() * 0.2); scene.add(m); }
  }
  var flowerCols = [0xFF6B8B, 0xFFD23F, 0xFFFFFF, 0xB98CFF];
  var flowerGeo = new THREE.SphereGeometry(0.14, 6, 4), stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 4), stemMat = std(0x3E9A4E);
  function flowers(x, z){
    for (var i = 0; i < 6; i++) {
      var fx = x + (rand() - 0.5) * 2.2, fz = z + (rand() - 0.5) * 2.2;
      var st = new THREE.Mesh(stemGeo, stemMat); st.position.set(fx, 0.17, fz); scene.add(st);
      var f = new THREE.Mesh(flowerGeo, std(flowerCols[Math.floor(rand() * 4)])); f.position.set(fx, 0.38, fz); scene.add(f);
    }
  }
  var rockGeo = new THREE.DodecahedronGeometry(0.8, 0), rockMat = std(0xB8BFC9, { flat: true });
  function rock(x, z, s){ var m = shadow(new THREE.Mesh(rockGeo, rockMat)); m.position.set(x, 0.3 * s, z); m.scale.set(s, s * 0.7, s); m.rotation.set(rand(), rand() * 6, rand()); scene.add(m); staticCyl(x, z, 0.7 * s, 1); obstaclesXZ.push([x, z]); }

  // ================= Clouds =================
  var clouds = [];
  var cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
  function cloud(x, z, s){
    var g = new THREE.Group();
    for (var i = 0; i < 5; i++) { var m = new THREE.Mesh(blobGeo, cloudMat); m.position.set((i - 2) * 1.3 * s, (rand() - 0.3) * 0.6 * s, (rand() - 0.5) * 1.2 * s); m.scale.setScalar((1 + rand() * 0.8) * s); m.castShadow = true; g.add(m); }
    g.position.set(x, 26 + rand() * 6, z); scene.add(g); clouds.push(g);
  }

  // ================= Zones and props =================
  var icons = [];
  function makeIcon(type, col){
    var mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.1, emissive: col, emissiveIntensity: 0.15 });
    var g = new THREE.Group(), m;
    if (type === 'person') { m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), mat); m.position.y = 0.75; g.add(m); m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.68, 0.85, 24), mat); m.position.y = -0.1; g.add(m); }
    else if (type === 'case') { g.add(new THREE.Mesh(roundedBox(1.5, 1, 0.5, 0.12), mat)); m = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 10, 24, Math.PI), mat); m.position.y = 0.5; g.add(m); }
    else if (type === 'gear') { g.add(new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.2, 12, 32), mat)); for (var i = 0; i < 8; i++) { var t = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.32), mat); var a = i / 8 * Math.PI * 2; t.position.set(Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0); t.rotation.z = a; g.add(t); } }
    else if (type === 'gem') { m = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), mat); m.scale.y = 1.25; g.add(m); }
    else if (type === 'star') { var sh = new THREE.Shape(); for (var k = 0; k < 10; k++) { var r = k % 2 ? 0.38 : 0.9, an = k / 10 * Math.PI * 2 + Math.PI / 2; if (k) sh.lineTo(Math.cos(an) * r, Math.sin(an) * r); else sh.moveTo(Math.cos(an) * r, Math.sin(an) * r); } m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2 }), mat); m.position.z = -0.15; g.add(m); }
    else if (type === 'mail') { g.add(new THREE.Mesh(roundedBox(1.5, 1, 0.22, 0.08), mat)); var lm = std(0xffffff); var l1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.04), lm); l1.position.set(-0.36, 0.2, 0.13); l1.rotation.z = -0.6; g.add(l1); var l2 = l1.clone(); l2.position.x = 0.36; l2.rotation.z = 0.6; g.add(l2); }
    g.traverse(function(o){ if (o.isMesh) o.castShadow = true; });
    return g;
  }
  function signpost(x, z, text, color){
    var post = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 8), std(0x9A6B4F))); post.position.set(x, 1.3, z); scene.add(post);
    var tex = canvasTex(512, 128, function(g, W, H){ g.fillStyle = '#FFFDF6'; g.fillRect(0, 0, W, H); g.fillStyle = color; g.fillRect(0, 0, 22, H); g.font = "64px 'Lilita One', 'Arial Rounded MT Bold', sans-serif"; g.fillStyle = '#1F2333'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2 + 10, H / 2 + 4); });
    var side = std(0xE9D9B8);
    var board = shadow(new THREE.Mesh(new THREE.BoxGeometry(4, 1, 0.14), [side, side, side, side, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), side]));
    board.position.set(x, 2.5, z + 0.08); scene.add(board);
    staticCyl(x, z, 0.15, 2.6);
  }
  function windowsTex(cols, rows, base){
    return canvasTex(256, 512, function(g, W, H){
      g.fillStyle = base; g.fillRect(0, 0, W, H);
      var cw = W / cols, rh = H / rows;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { g.fillStyle = (r * 7 + c * 3) % 5 === 0 ? '#FFE8A3' : '#9CC9E8'; g.fillRect(c * cw + cw * 0.18, r * rh + rh * 0.2, cw * 0.64, rh * 0.55); }
    });
  }
  function building(x, z, w, h, d, base, roof, label){
    var tex = windowsTex(Math.max(2, Math.round(w * 1.2)), Math.max(2, Math.round(h * 1.1)), base);
    var mats = [new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), std(roof), std(roof), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })];
    var m = shadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats)); m.position.set(x, h / 2, z); scene.add(m);
    var rim = shadow(new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.3, d + 0.3), std(roof))); rim.position.set(x, h + 0.15, z); scene.add(rim);
    if (label) {
      var lt = canvasTex(512, 128, function(g, W, H){ g.fillStyle = '#1F2333'; g.fillRect(0, 0, W, H); g.font = "70px 'Lilita One', 'Arial Rounded MT Bold', sans-serif"; g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, W / 2, H / 2 + 4); });
      var sign = shadow(new THREE.Mesh(new THREE.BoxGeometry(Math.min(w, 4.2), 0.9, 0.12), [std(0x1F2333), std(0x1F2333), std(0x1F2333), std(0x1F2333), new THREE.MeshStandardMaterial({ map: lt }), std(0x1F2333)]));
      sign.position.set(x, h + 0.9, z + d / 2 - 0.2); scene.add(sign);
    }
    staticBox(x, h / 2, z, w / 2, h / 2, d / 2); obstaclesXZ.push([x, z]);
  }
  function house(x, z){
    var body = shadow(new THREE.Mesh(new THREE.BoxGeometry(4, 2.6, 3.4), std(0xFFF4E2))); body.position.set(x, 1.3, z); scene.add(body);
    var roof = shadow(new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.9, 4), std(0xE5484D, { flat: true }))); roof.position.set(x, 3.55, z); roof.rotation.y = Math.PI / 4; scene.add(roof);
    var door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.08), std(0x4C7DFF)); door.position.set(x, 0.75, z + 1.72); scene.add(door);
    [-1.25, 1.25].forEach(function(dx){ var w = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.08), std(0x9CC9E8, { r: 0.2 })); w.position.set(x + dx, 1.6, z + 1.72); scene.add(w); });
    var chim = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), std(0xC9B8A0))); chim.position.set(x + 1, 4, z - 0.5); scene.add(chim);
    staticBox(x, 1.3, z, 2, 1.3, 1.7); obstaclesXZ.push([x, z]);
  }
  function mailbox(x, z){
    var post = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.3, 8), std(0x9A6B4F))); post.position.set(x, 0.65, z); scene.add(post);
    var box = shadow(new THREE.Mesh(roundedBox(0.8, 0.7, 1.3, 0.3), std(0x2FA84F))); box.position.set(x, 1.55, z); scene.add(box);
    var flag = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.3), std(0xE5484D))); flag.position.set(x + 0.45, 1.85, z - 0.2); scene.add(flag);
    staticCyl(x, z, 0.45, 2);
  }
  function podium(x, z){
    var mats = [std(0xD9DEE8), std(0xFFD23F), std(0xE9A46A)];
    [[-1.6, 1.2, 2], [0, 1.9, 1], [1.6, 0.8, 3]].forEach(function(p, i){
      var m = shadow(new THREE.Mesh(new THREE.BoxGeometry(1.6, p[1], 1.6), mats[i === 1 ? 1 : i === 0 ? 0 : 2])); m.position.set(x + p[0], p[1] / 2, z); scene.add(m);
      staticBox(x + p[0], p[1] / 2, z, 0.8, p[1] / 2, 0.8);
    });
    var gold = new THREE.MeshStandardMaterial({ color: 0xFFC83A, metalness: 0.8, roughness: 0.25 });
    var stem = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.25, 0.7, 16), gold)); stem.position.set(x, 2.25, z); scene.add(stem);
    var cup = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.25, 0.9, 32), gold)); cup.position.set(x, 3.05, z); scene.add(cup);
    trophyCup = cup; obstaclesXZ.push([x, z]);
  }
  var trophyCup;

  function buildZones(){
    ZONES.forEach(function(zn){
      var col = new THREE.Color(zn.color);
      path(0, 0, zn.x * (1 - 5.6 / Math.hypot(zn.x, zn.z)), zn.z * (1 - 5.6 / Math.hypot(zn.x, zn.z)), 3.6);
      var pad = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.2, 0.12, 48), new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 }));
      pad.position.set(zn.x, 0.06, zn.z); pad.receiveShadow = true; scene.add(pad);
      var ring = new THREE.Mesh(new THREE.RingGeometry(4.2, 4.5, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(zn.x, 0.13, zn.z); scene.add(ring);
      var ic = makeIcon(zn.icon, col); ic.position.set(zn.x, 3.2, zn.z); scene.add(ic); icons.push({ g: ic, base: 3.2, zn: zn });
      signpost(zn.x + 6.6, zn.z - 2.6, zn.name, zn.color);
      zn.pad = pad; zn.ring = ring;
    });
    // themed props
    house(-26, -27.5);
    building(22, -28, 5, 7, 4.5, '#F28C28', 0x8A4B12, 'OPTUM');
    building(30, -28, 5, 5, 4.5, '#5B8DEF', 0x23417F, 'EXPLEO');
    mailbox(-3.2, -45);
    podium(28, 23.5);
  }

  // ================= Voxel letters (each a physics body) =================
  function mergeBoxes(cells, S){
    var base = new THREE.BoxGeometry(S * 0.97, S * 0.97, S * 0.97);
    var bp = base.attributes.position.array, bn = base.attributes.normal.array, bi = base.index.array;
    var pos = new Float32Array(cells.length * bp.length), nor = new Float32Array(cells.length * bn.length), idx = new Uint32Array(cells.length * bi.length);
    var vc = bp.length / 3;
    cells.forEach(function(c, k){
      for (var i = 0; i < bp.length; i += 3) { pos[k * bp.length + i] = bp[i] + c[0]; pos[k * bp.length + i + 1] = bp[i + 1] + c[1]; pos[k * bp.length + i + 2] = bp[i + 2] + c[2]; }
      nor.set(bn, k * bn.length);
      for (var j = 0; j < bi.length; j++) idx[k * bi.length + j] = bi[j] + k * vc;
    });
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    return g;
  }
  function buildLetters(){
    var word = 'ABHISHEK KUMAR', S = 0.12, LAYERS = 4, cursor = 0, letters = [];
    var mc = document.createElement('canvas'), mg = mc.getContext('2d');
    var font = "30px 'Lilita One', 'Arial Rounded MT Bold', sans-serif"; mg.font = font;
    var totalW = mg.measureText(word).width + (word.length - 1) * 2;
    var x0 = -totalW * S / 2;
    for (var i = 0; i < word.length; i++) {
      var ch = word[i]; mg.font = font; var cw = mg.measureText(ch).width;
      if (ch === ' ') { cursor += cw + 2; continue; }
      var c = document.createElement('canvas'), W = Math.ceil(cw) + 4, H = 34; c.width = W; c.height = H;
      var g = c.getContext('2d'); g.font = font; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.fillText(ch, 2, 28);
      var data = g.getImageData(0, 0, W, H).data, cells = [], minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 110) {
        for (var l = 0; l < LAYERS; l++) cells.push([x * S, (H - y) * S, -l * S]);
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      if (!cells.length) { cursor += cw + 2; continue; }
      var cx = (minX + maxX) / 2 * S, cy = ((H - maxY) + (H - minY)) / 2 * S, cz = -(LAYERS - 1) * S / 2;
      cells.forEach(function(p){ p[0] -= cx; p[1] -= cy; p[2] -= cz; });
      var hx = (maxX - minX + 1) * S / 2, hy = (maxY - minY + 1) * S / 2, hz = LAYERS * S / 2;
      var kumar = i > 8;
      var mesh = shadow(new THREE.Mesh(mergeBoxes(cells, S), std(kumar ? 0xE5484D : 0xFFF8EC, { r: 0.5 })));
      var body = new CANNON.Body({ mass: 2.2 });
      body.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
      body.position.set(x0 + cursor * S + cx, hy + 0.01, -7);
      body.sleepSpeedLimit = 0.25; body.sleepTimeLimit = 0.6; body.linearDamping = 0.05; body.angularDamping = 0.1;
      body.allowSleep = true; body.sleep();
      addDynamic(mesh, body); letters.push(body);
      cursor += cw + 2;
    }
    groundDecal('QUALITY ENGINEER  ·  TRICENTIS TOSCA  ·  5+ YEARS', "700 46px 'DM Sans', sans-serif", '#4C5370', 22, 1.4, 1600, 100, 0, -3.2);
  }

  // ================= Crate tower, bowling, ramps =================
  function buildCrates(){
    var cols = ['#FFC93C', '#FFB72B', '#FFD766', '#FFC93C', '#FFB72B', '#FFD766', '#FFC93C', '#7FE0C3', '#7FA6FF', '#FFB0C4'];
    var size = 1.5, order = [[0, 0], [1, 0], [2, 0], [3, 0], [0.5, 1], [1.5, 1], [2.5, 1], [1, 2], [2, 2], [1.5, 3]];
    CRATES.forEach(function(code, i){
      var tex = canvasTex(256, 256, function(g, W, H){
        g.fillStyle = cols[i]; g.fillRect(0, 0, W, H);
        g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 14; g.strokeRect(10, 10, W - 20, H - 20);
        g.font = (code.length > 4 ? "76px" : "96px") + " 'Lilita One', 'Arial Rounded MT Bold', sans-serif"; g.fillStyle = '#2A2414'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(code, W / 2, H / 2 + 6);
      });
      var mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 })));
      var body = new CANNON.Body({ mass: 1.4 }); body.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)));
      body.position.set((order[i][0] - 1.5) * (size + 0.02), size / 2 + order[i][1] * size + 0.01, 35);
      body.allowSleep = true; body.sleepSpeedLimit = 0.2; body.sleep();
      addDynamic(mesh, body);
    });
  }
  function buildBowling(){
    var lane = new THREE.Mesh(new THREE.PlaneGeometry(5, 9), std(0xE8C38A, { r: 0.4 }));
    lane.rotation.x = -Math.PI / 2; lane.position.set(-28, 0.03, 25); lane.receiveShadow = true; scene.add(lane);
    var prof = [[0, 0], [0.18, 0], [0.25, 0.25], [0.24, 0.45], [0.14, 0.7], [0.11, 0.82], [0.15, 0.98], [0.12, 1.1], [0, 1.16]].map(function(p){ return new THREE.Vector2(p[0], p[1]); });
    var pinGeo = new THREE.LatheGeometry(prof, 16); pinGeo.translate(0, -0.58, 0);
    var pinMat = std(0xFFFFFF, { r: 0.3 });
    var stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.07, 16), std(0xE5484D)); stripe.position.y = 0.26;
    var k = 0;
    for (var row = 0; row < 4; row++) for (var c = 0; c <= row; c++) {
      var x = -28 + (c - row / 2) * 0.75, z = 23.5 + row * 0.7;
      var mesh = shadow(new THREE.Mesh(pinGeo, pinMat)); mesh.add(stripe.clone());
      var body = new CANNON.Body({ mass: 0.35 });
      var cyl = new CANNON.Cylinder(0.2, 0.2, 1.16, 8), q = new CANNON.Quaternion(); q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      body.addShape(cyl, new CANNON.Vec3(0, 0, 0), q);
      body.position.set(x, 0.59, z); body.allowSleep = true; body.sleepSpeedLimit = 0.2; body.angularDamping = 0.2; body.sleep();
      addDynamic(mesh, body); k++;
    }
    var ballMesh = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), new THREE.MeshStandardMaterial({ color: 0x3A4BD9, roughness: 0.15, metalness: 0.2 })));
    var ball = new CANNON.Body({ mass: 3 }); ball.addShape(new CANNON.Sphere(0.55)); ball.position.set(-28, 0.56, 19.6); ball.linearDamping = 0.15; ball.angularDamping = 0.15;
    addDynamic(ballMesh, ball);
  }
  function ramp(x, z, dir){ // dir: -1 rises toward -z, +1 rises toward +z
    var a = 0.27, hx = 2.4, hy = 0.18, hz = 3.2;
    var tex = canvasTex(128, 256, function(g, W, H){ g.fillStyle = '#FFFDF6'; g.fillRect(0, 0, W, H); g.fillStyle = '#E5484D'; for (var i = -1; i < 6; i++) { g.beginPath(); g.moveTo(0, i * 48 + 40); g.lineTo(W / 2, i * 48); g.lineTo(W, i * 48 + 40); g.lineTo(W, i * 48 + 62); g.lineTo(W / 2, i * 48 + 22); g.lineTo(0, i * 48 + 62); g.closePath(); g.fill(); } });
    if (dir > 0) { tex.center.set(0.5, 0.5); tex.rotation = Math.PI; }
    var side = std(0xD9DEE8);
    var mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(hx * 2, hy * 2, hz * 2), [side, side, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }), side, side, side]));
    var body = new CANNON.Body({ mass: 0 }); body.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
    var ang = dir < 0 ? a : -a;
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), ang);
    body.position.set(x, hz * Math.sin(a) - hy * Math.cos(a) + 0.02, z);
    world.addBody(body);
    mesh.position.copy(body.position); mesh.quaternion.copy(body.quaternion); scene.add(mesh);
  }

  // ================= Boundary =================
  function boundary(){
    var R = 66, n = 48, postGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.2, 6), postMat = std(0xC98B5E), railMat = std(0xE2B286);
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, x = Math.cos(a) * R, z = Math.sin(a) * R;
      var p = shadow(new THREE.Mesh(postGeo, postMat)); p.position.set(x, 0.6, z); scene.add(p);
      var a2 = (i + 0.5) / n * Math.PI * 2, segLen = 2 * Math.PI * R / n;
      var rail = shadow(new THREE.Mesh(new THREE.BoxGeometry(segLen, 0.14, 0.1), railMat)); rail.position.set(Math.cos(a2) * R, 0.85, Math.sin(a2) * R); rail.rotation.y = -a2 + Math.PI / 2; scene.add(rail);
      var w = staticBox(Math.cos(a2) * (R + 0.5), 1.5, Math.sin(a2) * (R + 0.5), segLen / 2 + 0.3, 1.5, 0.5, -a2 + Math.PI / 2);
    }
  }

  function nearPath(x, z){
    for (var i = 0; i < ZONES.length; i++) {
      var zn = ZONES[i], L = Math.hypot(zn.x, zn.z), ux = zn.x / L, uz = zn.z / L, pr = x * ux + z * uz;
      if (pr > 0 && pr < L) { if (Math.hypot(x - ux * pr, z - uz * pr) < 4.2) return true; }
    }
    return false;
  }
  function clearOf(x, z){
    if (Math.hypot(x, z) < 12) return false;
    if (Math.abs(x) < 16 && z > -12 && z < -1) return false;
    for (var i = 0; i < ZONES.length; i++) if (Math.hypot(x - ZONES[i].x, z - ZONES[i].z) < 13) return false;
    if (Math.abs(x) < 8 && z > 10 && z < 42) return false;
    if (Math.abs(x) < 8 && z < -14 && z > -50) return false;
    if (Math.hypot(x + 28, z - 23) < 7) return false;
    if (Math.hypot(Math.abs(x) - 17, z - 3) < 6) return false;
    return !nearPath(x, z);
  }
  function scatter(){
    var placed = 0, tries = 0, pts = [];
    while (placed < (lowPower ? 60 : 95) && tries < 6000) {
      tries++;
      var a = rand() * Math.PI * 2, d = 12 + Math.pow(rand(), 0.75) * 52, x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (!clearOf(x, z)) continue;
      var ok = true; for (var i = 0; i < pts.length; i++) if (Math.hypot(x - pts[i][0], z - pts[i][1]) < 3.2) { ok = false; break; }
      if (!ok) continue;
      pts.push([x, z]);
      var r = rand();
      if (r < 0.55) tree(x, z, 0.8 + rand() * 0.6); else if (r < 0.75) bush(x, z, 1 + rand() * 0.6); else if (r < 0.88) rock(x, z, 0.6 + rand() * 0.8); else flowers(x, z);
      placed++;
    }
    for (var k = 0; k < (lowPower ? 12 : 26); k++) { var aa = rand() * Math.PI * 2, dd = 72 + rand() * 45; tree(Math.cos(aa) * dd, Math.sin(aa) * dd, 1.2 + rand() * 1); }
    for (var c = 0; c < (lowPower ? 6 : 9); c++) cloud((rand() - 0.5) * 120, (rand() - 0.5) * 120, 1.4 + rand());
  }

  // ================= Car (physics vehicle) =================
  var chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.35, 1.9)), new CANNON.Vec3(0, 0.25, 0));
  chassisBody.angularDamping = 0.5;
  chassisBody.allowSleep = false; // a sleeping chassis ignores engine force
  var vehicle = new CANNON.RaycastVehicle({ chassisBody: chassisBody, indexRightAxis: 0, indexUpAxis: 1, indexForwardAxis: 2 });
  var wopt = { radius: 0.48, directionLocal: new CANNON.Vec3(0, -1, 0), suspensionStiffness: 32, suspensionRestLength: 0.35, frictionSlip: 3.4, dampingRelaxation: 2.3, dampingCompression: 4.4, maxSuspensionForce: 100000, rollInfluence: 0.02, axleLocal: new CANNON.Vec3(-1, 0, 0), chassisConnectionPointLocal: new CANNON.Vec3(), maxSuspensionTravel: 0.3, customSlidingRotationalSpeed: -30, useCustomSlidingRotationalSpeed: true };
  [[-1, 1.3], [1, 1.3], [-1, -1.3], [1, -1.3]].forEach(function(p){ wopt.chassisConnectionPointLocal.set(p[0], 0, p[1]); vehicle.addWheel(wopt); });
  vehicle.addToWorld(world);
  function placeCar(x, z, heading){
    chassisBody.position.set(x, 1.4, z);
    chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), heading);
    chassisBody.velocity.set(0, 0, 0); chassisBody.angularVelocity.set(0, 0, 0);
    chassisBody.wakeUp();
  }
  placeCar(0, 4, Math.PI);

  var carGroup = new THREE.Group();
  (function buildCarModel(){
    var red = new THREE.MeshStandardMaterial({ color: 0xE5484D, roughness: 0.3, metalness: 0.15 });
    var cream = std(0xFFF8EC, { r: 0.5 }), dark = std(0x2B2F3E, { r: 0.6 }), glassM = new THREE.MeshStandardMaterial({ color: 0x8EC5E8, roughness: 0.1, metalness: 0.3 });
    function add(g, mat, x, y, z){ var m = shadow(new THREE.Mesh(g, mat)); m.position.set(x, y, z); carGroup.add(m); return m; }
    add(roundedBox(2.1, 0.72, 3.9, 0.3), red, 0, 0.28, 0);
    add(roundedBox(1.95, 0.22, 3.95, 0.1), dark, 0, -0.08, 0);
    add(roundedBox(1.7, 0.75, 1.9, 0.28), cream, 0, 0.92, -0.35);
    add(new THREE.BoxGeometry(1.55, 0.42, 0.06), glassM, 0, 0.98, 0.62).rotation.x = -0.12;
    add(new THREE.BoxGeometry(1.5, 0.4, 0.06), glassM, 0, 0.98, -1.31);
    [-0.86, 0.86].forEach(function(x){ add(new THREE.BoxGeometry(0.06, 0.4, 1.4), glassM, x, 0.98, -0.35); });
    add(roundedBox(2.2, 0.28, 0.35, 0.1), cream, 0, -0.02, 2.0);
    add(roundedBox(2.2, 0.28, 0.35, 0.1), cream, 0, -0.02, -2.0);
    var lampM = new THREE.MeshStandardMaterial({ color: 0xFFF3B0, emissive: 0xFFE680, emissiveIntensity: 0.6 }), tailM = new THREE.MeshStandardMaterial({ color: 0xFF5A5A, emissive: 0xFF2A2A, emissiveIntensity: 0.5 });
    [-0.65, 0.65].forEach(function(x){ add(new THREE.SphereGeometry(0.17, 16, 10), lampM, x, 0.38, 1.94); add(new THREE.BoxGeometry(0.42, 0.16, 0.06), tailM, x, 0.38, -1.96); });
    var stripe = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
    add(new THREE.BoxGeometry(0.34, 0.02, 2.1), stripe, 0, 0.65, 0.95);
    var ant = add(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 6), dark, 0.6, 1.75, -0.9); ant.rotation.x = -0.15;
    add(new THREE.SphereGeometry(0.14, 12, 8), std(0xFFD23F), 0.6, 2.3, -0.98);
    var plate = canvasTex(256, 64, function(g, W, H){ g.fillStyle = '#FFD23F'; g.fillRect(0, 0, W, H); g.font = "40px 'Lilita One', sans-serif"; g.fillStyle = '#1F2333'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('QA · 5YRS', W / 2, H / 2 + 2); });
    add(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshStandardMaterial({ map: plate }), 0, 0.02, -2.19).rotation.y = Math.PI;
  })();
  scene.add(carGroup);
  var wheelMeshes = [];
  (function(){
    var tg = new THREE.CylinderGeometry(0.48, 0.48, 0.42, 24); tg.rotateZ(Math.PI / 2);
    var hg = new THREE.CylinderGeometry(0.24, 0.24, 0.44, 16); hg.rotateZ(Math.PI / 2);
    var tm = std(0x2B2F3E, { r: 0.9 }), hm = std(0xFFF8EC, { r: 0.4 });
    for (var i = 0; i < 4; i++) { var w = new THREE.Group(); w.add(shadow(new THREE.Mesh(tg, tm))); w.add(new THREE.Mesh(hg, hm)); scene.add(w); wheelMeshes.push(w); }
  })();

  // Dust
  var dust = [], dustGeo = new THREE.IcosahedronGeometry(0.22, 0);
  for (var di = 0; di < 80; di++) { var dm = new THREE.Mesh(dustGeo, new THREE.MeshStandardMaterial({ color: 0xF1E3C6, transparent: true, opacity: 0, depthWrite: false, flatShading: true })); dm.visible = false; scene.add(dm); dust.push({ m: dm, life: 0, vx: 0, vy: 0, vz: 0 }); }
  var dustIdx = 0;
  function emitDust(x, z, s){ var d = dust[dustIdx++ % dust.length]; d.m.visible = true; d.life = 1; d.m.position.set(x, 0.2, z); d.m.scale.setScalar(0.6 + s * 0.03); d.vx = (Math.random() - 0.5); d.vz = (Math.random() - 0.5); d.vy = 0.8 + Math.random() * 0.6; }

  // ================= Input =================
  var keys = { up: false, down: false, left: false, right: false, brake: false };
  var keymap = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'brake' };
  var drove = false;
  function flipBack(){ var p = chassisBody.position, f = chassisBody.quaternion.vmult(new CANNON.Vec3(0, 0, 1)); placeCar(p.x, p.z, Math.atan2(f.x, f.z)); }
  window.addEventListener('keydown', function(e){
    if (!$('classicOverlay').hidden) { if (e.key === 'Escape') closeClassic(); return; }
    if (e.code === 'KeyR' && !paused) { flipBack(); return; }
    var k = keymap[e.code]; if (!k) return;
    if (e.target && e.target.closest && e.target.closest('.panel, .classic, button, a')) { if (e.target !== canvas) return; }
    e.preventDefault(); keys[k] = true;
    if (!$('introOverlay').hidden) startWorld();
  });
  window.addEventListener('keyup', function(e){ var k = keymap[e.code]; if (k) keys[k] = false; });
  window.addEventListener('blur', function(){ for (var k in keys) keys[k] = false; });
  // Joystick (analog steer + throttle)
  var joy = { x: 0, y: 0, id: null };
  var joyEl = $('joy'), knob = $('knob');
  function joyMove(e){
    var r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, max = r.width * 0.36;
    var dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    var nx = dx / max, ny = dy / max, dz = 0.12;
    joy.x = Math.abs(nx) < dz ? 0 : nx; joy.y = Math.abs(ny) < 0.3 ? 0 : ny;
  }
  function joyEnd(e){ if (e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.y = 0; knob.style.transform = ''; }
  joyEl.addEventListener('pointerdown', function(e){ e.preventDefault(); joy.id = e.pointerId; try { joyEl.setPointerCapture(e.pointerId); } catch (err) {} joyMove(e); if (!$('introOverlay').hidden) startWorld(); });
  joyEl.addEventListener('pointermove', function(e){ if (e.pointerId === joy.id) joyMove(e); });
  joyEl.addEventListener('pointerup', joyEnd); joyEl.addEventListener('pointercancel', joyEnd);
  joyEl.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  $('flipBtn').addEventListener('pointerdown', function(e){ e.preventDefault(); if (ready) { flipBack(); if (!$('introOverlay').hidden) startWorld(); } });
  Array.prototype.forEach.call(document.querySelectorAll('.ctl[data-key]'), function(b){
    var k = b.getAttribute('data-key');
    var on = function(e){ e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (err) {} keys[k] = true; b.classList.add('on'); if (!$('introOverlay').hidden) startWorld(); };
    var off = function(){ keys[k] = false; b.classList.remove('on'); };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
    b.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  });
  function resetWorld(){
    dynamics.forEach(function(d){ d.body.position.copy(d.hp); d.body.quaternion.copy(d.hq); d.body.velocity.set(0, 0, 0); d.body.angularVelocity.set(0, 0, 0); if (d.body.mass) d.body.sleep(); });
    placeCar(0, 4, Math.PI);
  }
  $('resetBtn').addEventListener('click', function(){ resetWorld(); canvas.focus({ preventScroll: true }); });

  // ================= Minimap =================
  var mm = $('minimap'), mg = mm.getContext('2d'), WORLD = 68;
  function toMap(x, z){ return [(x / WORLD) * 132 + 150, (z / WORLD) * 132 + 150]; }
  var carPos = { x: 0, z: 4, h: Math.PI };
  function drawMap(){
    mg.clearRect(0, 0, 300, 300);
    mg.beginPath(); mg.arc(150, 150, 146, 0, Math.PI * 2); mg.fillStyle = 'rgba(155,213,138,0.95)'; mg.fill();
    mg.lineWidth = 6; mg.strokeStyle = '#FFFFFF'; mg.stroke();
    mg.lineWidth = 9; mg.strokeStyle = '#F3DDB0'; mg.lineCap = 'round';
    ZONES.forEach(function(zn){ var p = toMap(zn.x, zn.z); mg.beginPath(); mg.moveTo(150, 150); mg.lineTo(p[0], p[1]); mg.stroke(); });
    ZONES.forEach(function(zn){
      var p = toMap(zn.x, zn.z);
      mg.beginPath(); mg.arc(p[0], p[1], zn === activeZone ? 19 : 15, 0, Math.PI * 2); mg.fillStyle = zn.color; mg.fill();
      mg.lineWidth = 3; mg.strokeStyle = '#FFFFFF'; mg.stroke();
      if (visited[zn.id]) { mg.strokeStyle = '#FFFFFF'; mg.lineWidth = 4; mg.beginPath(); mg.moveTo(p[0] - 6, p[1]); mg.lineTo(p[0] - 1.5, p[1] + 5); mg.lineTo(p[0] + 6.5, p[1] - 5); mg.stroke(); }
    });
    var c = toMap(carPos.x, carPos.z);
    mg.save(); mg.translate(c[0], c[1]); mg.rotate(Math.PI - carPos.h);
    mg.beginPath(); mg.moveTo(0, -15); mg.lineTo(11, 11); mg.lineTo(0, 5); mg.lineTo(-11, 11); mg.closePath(); mg.fillStyle = '#E5484D'; mg.fill(); mg.lineWidth = 3; mg.strokeStyle = '#fff'; mg.stroke(); mg.restore();
  }
  mm.addEventListener('click', function(e){
    if (!ready) return;
    var r = mm.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 300, py = (e.clientY - r.top) / r.height * 300;
    var best = null, bd = 1e9;
    ZONES.forEach(function(zn){ var p = toMap(zn.x, zn.z), d = Math.hypot(p[0] - px, p[1] - py); if (d < bd) { bd = d; best = zn; } });
    if (best && bd < 40) { placeCar(best.x, best.z + 1.5, Math.PI); startWorld(); }
  });

  // ================= Zone panel =================
  var activeZone = null, dismissed = null;
  panel.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('.panel-close')) { panel.classList.remove('open'); dismissed = activeZone; canvas.focus({ preventScroll: true }); } });
  function setZone(zn){
    if (zn === activeZone) return;
    activeZone = zn; if (!zn) dismissed = null;
    if (zn && zn !== dismissed) {
      markVisited(zn);
      panel.style.setProperty('--zone', zn.color);
      var n = Object.keys(visited).length;
      panel.innerHTML = '<div class="panel-bar"></div><button class="panel-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button><div class="panel-inner">' + zn.html + '</div><p class="panel-foot">' + (n < 6 ? n + ' of 6 explored · ' + (6 - n) + ' to go' : 'All 6 zones explored. Thanks for driving by!') + '</p>';
      panel.classList.add('open'); panel.scrollTop = 0;
    } else panel.classList.remove('open');
  }

  // ================= Resize =================
  function resize(){
    var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = camera.aspect < 1 ? 50 : (w < 900 ? 46 : 40); camera.updateProjectionMatrix();
    camScale = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.75 : 1;
  }
  var camScale = 1, camZoom = 1;
  function setZoom(z){ camZoom = Math.max(0.6, Math.min(1.9, z)); }
  canvas.addEventListener('wheel', function(e){ e.preventDefault(); setZoom(camZoom * (e.deltaY > 0 ? 1.08 : 1 / 1.08)); }, { passive: false });
  var pinch = {}, pinchStart = 0, zoomStart = 1;
  canvas.addEventListener('pointerdown', function(e){ pinch[e.pointerId] = [e.clientX, e.clientY]; var ids = Object.keys(pinch); if (ids.length === 2) { var a = pinch[ids[0]], b = pinch[ids[1]]; pinchStart = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomStart = camZoom; } });
  canvas.addEventListener('pointermove', function(e){ if (!pinch[e.pointerId]) return; pinch[e.pointerId] = [e.clientX, e.clientY]; var ids = Object.keys(pinch); if (ids.length === 2 && pinchStart > 0) { var a = pinch[ids[0]], b = pinch[ids[1]]; setZoom(zoomStart * pinchStart / Math.max(20, Math.hypot(a[0] - b[0], a[1] - b[1]))); } });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev){ canvas.addEventListener(ev, function(e){ delete pinch[e.pointerId]; if (Object.keys(pinch).length < 2) pinchStart = 0; }); });
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', function(){ setTimeout(resize, 250); });

  // ================= Loop =================
  var clock = new THREE.Clock(), camPos = new THREE.Vector3(0, 24, 30), camLook = new THREE.Vector3(0, 0, 0), t = 0, steer = 0, flipTimer = 0;
  var fwdV = new CANNON.Vec3(), upV = new CANNON.Vec3();
  function drive(dt){
    var q = chassisBody.quaternion;
    q.vmult(new CANNON.Vec3(0, 0, 1), fwdV); q.vmult(new CANNON.Vec3(0, 1, 0), upV);
    var v = chassisBody.velocity, fs = v.x * fwdV.x + v.y * fwdV.y + v.z * fwdV.z;
    var clamp1 = function(v){ return Math.max(-1, Math.min(1, v)); };
    var throttle = clamp1((keys.up ? 1 : 0) - (keys.down ? 1 : 0) - joy.y * 1.4), steerIn = clamp1((keys.left ? 1 : 0) - (keys.right ? 1 : 0) - joy.x);
    if ((throttle || steerIn) && !drove) { drove = true; hint.style.opacity = '0'; }
    var force = 0, brake = 0;
    if (throttle > 0.05) force = fs < 17 ? -720 * Math.min(1, throttle) : 0;
    else if (throttle < -0.05) { if (fs > 1.5) brake = 9 * Math.min(1, -throttle); else force = fs > -7 ? 420 : 0; }
    else brake = 0.6;
    if (keys.brake) { brake = 14; force = 0; }
    vehicle.applyEngineForce(force, 2); vehicle.applyEngineForce(force, 3);
    for (var i = 0; i < 4; i++) vehicle.setBrake(brake, i);
    var maxSteer = 0.55 - Math.min(0.28, Math.abs(fs) * 0.012);
    steer += (steerIn * maxSteer - steer) * Math.min(1, dt * 8);
    vehicle.setSteeringValue(steer, 0); vehicle.setSteeringValue(steer, 1);
    if (upV.y < 0.35) { flipTimer += dt; if (flipTimer > 1.4) { flipBack(); flipTimer = 0; } } else flipTimer = 0;
    var p = chassisBody.position;
    if (p.y < -5) placeCar(0, 4, Math.PI);
    if (Math.abs(fs) > 7 && Math.random() < 0.6) {
      var wi = vehicle.wheelInfos[2 + (Math.random() < 0.5 ? 0 : 1)];
      if (wi.isInContact) emitDust(wi.worldTransform.position.x, wi.worldTransform.position.z, Math.abs(fs));
    }
    return fs;
  }

  function frame(){
    var dt = Math.min(clock.getDelta(), 0.05); t += dt;
    var fs = 0;
    if (!paused) { fs = drive(dt); world.step(1 / 60, dt, 3); }

    // sync
    carGroup.position.copy(chassisBody.position); carGroup.quaternion.copy(chassisBody.quaternion);
    for (var i = 0; i < 4; i++) { vehicle.updateWheelTransform(i); var tr = vehicle.wheelInfos[i].worldTransform; wheelMeshes[i].position.copy(tr.position); wheelMeshes[i].quaternion.copy(tr.quaternion); }
    for (var d = 0; d < dynamics.length; d++) { var r = dynamics[d]; r.mesh.position.copy(r.body.position); r.mesh.quaternion.copy(r.body.quaternion); }

    var f = chassisBody.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
    carPos.x = chassisBody.position.x; carPos.z = chassisBody.position.z; carPos.h = Math.atan2(f.x, f.z);

    dust.forEach(function(p){ if (p.life <= 0) return; p.life -= dt * 1.3; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; p.m.scale.multiplyScalar(1 + dt * 1.1); p.m.material.opacity = Math.max(0, p.life) * 0.7; if (p.life <= 0) p.m.visible = false; });
    icons.forEach(function(ic, k){ var on = ic.zn === activeZone; ic.g.rotation.y += dt * (on ? 2.4 : 0.9); ic.g.position.y = ic.base + Math.sin(t * 2 + k) * 0.25 + (on ? 0.6 : 0); });
    ZONES.forEach(function(zn, k){ var s = zn === activeZone ? 1.06 + Math.sin(t * 6) * 0.02 : 1; zn.ring.scale.set(s, s, 1); });
    clouds.forEach(function(c, k){ c.position.x += dt * (0.6 + (k % 3) * 0.2); if (c.position.x > 80) c.position.x = -80; });
    if (trophyCup) trophyCup.rotation.y += dt;

    var near = null;
    for (var z = 0; z < ZONES.length; z++) if (Math.hypot(carPos.x - ZONES[z].x, carPos.z - ZONES[z].z) < 5) { near = ZONES[z]; break; }
    if (!paused) setZone(near);

    var spd = Math.abs(fs), lead = Math.max(-4, Math.min(6, fs * 0.25));
    var desired = new THREE.Vector3(carPos.x + f.x * lead * 0.3, (20 + spd * 0.3) * camScale * camZoom, carPos.z + (21 + spd * 0.25) * camScale * camZoom + f.z * lead * 0.3);
    camPos.lerp(desired, Math.min(1, dt * 3));
    camLook.lerp(new THREE.Vector3(carPos.x + f.x * lead, 0.5, carPos.z - 2 + f.z * lead), Math.min(1, dt * 4));
    camera.position.copy(camPos); camera.lookAt(camLook);
    sun.position.set(carPos.x + 18, 40, carPos.z + 22); sun.target.position.set(carPos.x, 0, carPos.z);

    renderer.render(scene, camera);
    drawMap();
    if (document.hidden) { clock.getDelta(); document.addEventListener('visibilitychange', function wake(){ if (!document.hidden) { document.removeEventListener('visibilitychange', wake); clock.getDelta(); requestAnimationFrame(frame); } }); return; }
    requestAnimationFrame(frame);
  }

  function boot(){
    buildZones(); buildLetters(); buildCrates(); buildBowling();
    ramp(0, -22, -1); ramp(0, 15, 1); ramp(-17, 3, -1); ramp(17, 3, -1);
    boundary(); scatter();
    resize(); ready = true;
    var sb = $('startBtn'); sb.disabled = false; sb.textContent = 'Start driving';
    requestAnimationFrame(frame);
  }
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("30px 'Lilita One'"), document.fonts.load("700 46px 'DM Sans'")]) : Promise.resolve();
  resize(); drawMap();
  Promise.race([fontsReady, new Promise(function(r){ setTimeout(r, 2500); })]).then(boot, boot);
})();
