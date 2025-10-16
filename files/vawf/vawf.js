// Import core Three.js library
// import * as THREE from "three";
// ✅ Use Three.js module from CDN
import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
// ✅ Use OrbitControls from CDN
import { OrbitControls } from "https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js";
// ✅ Use CSS2DRenderer from CDN
import { CSS2DRenderer } from "https://unpkg.com/three@0.170.0/examples/jsm/renderers/CSS2DRenderer.js";
// ✅ Use FontLoader from CDN
import { FontLoader } from "https://unpkg.com/three@0.170.0/examples/jsm/loaders/FontLoader.js";
// ✅ Use TextGeometry from CDN
import { TextGeometry } from "https://unpkg.com/three@0.170.0/examples/jsm/geometries/TextGeometry.js";
// Custom utility for drawing GeoJSON data on a sphere
import { drawThreeGeo } from "./src/threeGeoJSON.js";
// // Import orbit controls for camera interaction
// import { OrbitControls } from 'jsm/controls/OrbitControls.js';
// import { CSS2DRenderer} from 'jsm/renderers/CSS2DRenderer.js';

// import { FontLoader } from 'jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'jsm/geometries/TextGeometry.js';

// ---------- Clean custom GUI (pure JS) ----------
function createVAWFGui(opts = {}) {
  const onOverlayChange = opts.onOverlayChange || (v => console.log('overlay:', v));
  const onLayerToggle = opts.onLayerToggle || function (layer, enabled) {
    console.log(layer, enabled);
  };

  // Panel
  const panel = document.createElement('div');
  panel.id = 'vawf-gui';
  Object.assign(panel.style, {
    position: 'fixed',
    top: '12px',
    right: '12px',
    width: '300px',
    background: 'rgba(10,10,10,0.85)',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: '13px',
    zIndex: '9999',
    boxSizing: 'border-box',
    boxShadow: '0 6px 18px rgba(0,0,0,0.45)'
  });

  // Header row: title on left, minimize button on right (button always anchored right)
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  });

  const title = document.createElement('div');
  title.innerHTML = `VAW`;
  title.style.fontSize = '25px';
  title.style.lineHeight = '1';

  const btnMin = document.createElement('button');
  btnMin.type = 'button';
  btnMin.innerText = '×';
  Object.assign(btnMin.style, {
    background: 'transparent',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: '1',
    padding: '4px 8px'
  });

  header.appendChild(title);
  header.appendChild(btnMin);
  panel.appendChild(header);

  // Content container (hidden when minimized)
  const content = document.createElement('div');
  Object.assign(content.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end', // right-align children
    gap: '8px'
  });

  // Description lines (two)
  const desc1 = document.createElement('div');
  desc1.innerHTML = 'Data Source: <a href="https://www.ecmwf.int/en/forecasts/datasets/set-ix"> Artificial Intelligence Forecasting System (AIFS) data from ECMWF </a>';
  desc1.style.fontSize = '12px';
  desc1.style.textAlign = 'right';
  const desc2 = document.createElement('div');
  fetch('./outputs/storm_properties.json')
  .then(response => response.json())
  .then(jsonData => {
    desc2.innerText = `Date: ${jsonData.metadata.date}`;
  });
  desc2.style.fontSize = '11px';
  desc2.style.textAlign = 'right';

  content.appendChild(desc1);
  content.appendChild(desc2);

  // Overlay row (label + select) - same row, right-aligned
  const overlayRow = document.createElement('div');
  Object.assign(overlayRow.style, {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: '8px'
  });
  
  const overlayLabel = document.createElement('label');
  overlayLabel.innerText = 'Overlay:';
  overlayLabel.style.fontSize = '12px';
  overlayLabel.style.marginRight = '6px';
  const overlaySelect = document.createElement('select');
  ['10m Wind', 'Precipitation', 'Upper Level Winds', 'Total Column Water'].forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.text = opt;
    overlaySelect.appendChild(o);
  });
  Object.assign(overlaySelect.style, {
    padding: '6px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff'
  });
  overlaySelect.value = opts.initialOverlay || '10m Wind';
  overlaySelect.addEventListener('change', () => onOverlayChange(overlaySelect.value));

  overlayRow.appendChild(overlayLabel);
  overlayRow.appendChild(overlaySelect);
  content.appendChild(overlayRow);

  // ----------- New: Visualization toggle button + dropdown -----------
  const vizContainer = document.createElement('div');
  vizContainer.style.position = 'relative';
  vizContainer.style.display = 'flex';
  vizContainer.style.flexDirection = 'column';
  vizContainer.style.alignItems = 'flex-end';
  vizContainer.style.width = '100%';

  const vizBtn = document.createElement('button');
  vizBtn.innerText = 'Add Features ▾';
  Object.assign(vizBtn.style, {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    cursor: 'pointer'
  });

  const dropdown = document.createElement('div');
  Object.assign(dropdown.style, {
    display: 'none',
    flexDirection: 'column',
    position: 'absolute',
    right: '0px',
    top: '100%',
    background: 'rgba(20,20,20,0.95)',
    padding: '6px',
    borderRadius: '4px',
    gap: '4px',
    zIndex: '9999'
  });

  ['Storms'].forEach(layer => {
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.id = `chk-${layer}`;
    const lbl = document.createElement('label');
    lbl.innerText = layer;
    lbl.htmlFor = `chk-${layer}`;
    lbl.style.color = '#fff';
    lbl.style.marginLeft = '4px';
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.appendChild(chk);
    row.appendChild(lbl);
    chk.addEventListener('change', () => onLayerToggle(layer, chk.checked));
    dropdown.appendChild(row);
  });

  vizBtn.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  vizContainer.appendChild(vizBtn);
  vizContainer.appendChild(dropdown);
  content.appendChild(vizContainer);
  // Add content to panel
  panel.appendChild(content);

  // Floating small expand button
  const expandBtn = document.createElement('button');
  expandBtn.type = 'button';
  expandBtn.innerText = '∘'; // open symbol
  Object.assign(expandBtn.style, {
    position: 'fixed',
    top: '12px',
    right: '12px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10,10,10,0.85)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    zIndex: '10000',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
    fontSize: '16px'
  });
  document.body.appendChild(expandBtn);

  // Minimize/expand behavior
  let minimized = false;
  function minimize() { minimized = true; panel.style.display = 'none'; expandBtn.style.display = 'flex'; }
  function expand() { minimized = false; panel.style.display = 'block'; expandBtn.style.display = 'none'; }
  btnMin.addEventListener('click', minimize);
  expandBtn.addEventListener('click', expand);

  document.body.appendChild(panel);

  return {
    panel,
    expandBtn,
    minimize,
    expand,
    overlaySelect,
    setOverlay(v){ overlaySelect.value = v; },
    onLayerToggle
  };
}

// Get window dimensions
const w = window.innerWidth;
const h = window.innerHeight;
// const allLabelsArray = [];

// Create the scene and add fog for depth effect
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);

// Setup camera with perspective projection
const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100);
camera.position.z = 5;

// Setup WebGL renderer with antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(w, h);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Enable orbit controls for interactive rotation/zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // adds smooth movement
// ✅ Prevent zooming inside Earth
controls.minDistance = 3.1;   // slightly bigger than Earth radius (2)
controls.maxDistance = 10;    // optional: prevent zooming out too far


// Create a base sphere geometry (used as Earth’s globe)
const geometry = new THREE.SphereGeometry(2,32,32);

// Fetch GeoJSON dataset for landmasses
// Dataset source: Natural Earth → https://github.com/martynafford/natural-earth-geojson
fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_coastline.json")
// fetch("https://github.com/martynafford/natural-earth-geojson/blob/master/50m/physical/ne_50m_coastline.json")
  .then(response => response.json())
  .then(data => {
    const coastlines = drawThreeGeo({
      json: data,
      radius: 2.005,
      materialOptions: {
        linewidth: 2,
        color: new THREE.Color(0xFFFFFF), // white coastlines
      },
    });
    scene.add(coastlines);
  })
  .catch(err => console.error("Failed to load coastlines:", err));

// ✅ Countries (admin 0 boundaries)
fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_0_countries.json")
  .then(response => response.json())
  .then(data => {
    const countries = drawThreeGeo({
      json: data,
      radius: 2.005,
      materialOptions: {
        linewidth: 1,
        color: 0xFFFFFF,   // green for country borders
      },
    });
    scene.add(countries);
  })
  .catch(err => console.error("Failed to load country boundaries:", err));

// ✅ Disputed Areas
fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_0_boundary_lines_disputed_areas.json")
  .then(response => response.json())
  .then(data => {
    const disputed = drawThreeGeo({
      json: data,
      radius: 2.005,
      materialOptions: {
        dashed: true,
        dashSize: .01,
        gapSize: .01,
        color: 0xFFFFFF,
      },
    });
    scene.add(disputed);
  })
  .catch(err => console.error("Failed to load disputed areas:", err));

// ✅ Rivers (admin 0 boundaries)
fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_rivers_lake_centerlines_scale_rank.json")
  .then(response => response.json())
  .then(data => {
    const rivers = drawThreeGeo({
      json: data,
      radius: 2.005,
      materialOptions: {
        linewidth: .5,
        color: 0xC0C0C0,   
      },
    });
    scene.add(rivers);
  })
  .catch(err => console.error("Failed to load rivers and lakes:", err));

// ✅ Replace with full ambient light (uniform lighting everywhere)
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // color, intensity
scene.add(ambientLight);

// (Optional: Hemisphere light adds a bit of sky/ground gradient)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.96);
scene.add(hemiLight);

// ------------------- Create Colorbar -------------------
const colorbar = document.createElement('img');
colorbar.src = './outputs/colorbar_wind_10m.png';
colorbar.style.position = 'absolute';
colorbar.style.top = '50%';            // vertical center
colorbar.style.right = '20px';         // distance from right edge
colorbar.style.transform = 'translateY(-40%)'; // shift up by half height
colorbar.style.width = '100px';         // adjust width as needed
colorbar.style.zIndex = '10';          // ensure above canvas
document.body.appendChild(colorbar);

// Plot wind Data
const loader = new THREE.TextureLoader();
const wind10Tex  = loader.load("./outputs/windspeeds_10m.png");
const precipTex = loader.load("./outputs/precipitation.png");
const winduTex  = loader.load("./outputs/windspeeds_ul.png");
const tcwTex  = loader.load("./outputs/totcol_water.png");

// Define all overlay textures
const overlayTextures = {
  '10m Wind': wind10Tex,
  'Precipitation': precipTex,
  'Upper Level Winds': winduTex,
  'Total Column Water': tcwTex
};

// Define colorbars for each overlay
const colorbars = {
  '10m Wind': './outputs/colorbar_wind_10m.png',
  'Precipitation': './outputs/colorbar_precip.png',
  'Upper Level Winds': './outputs/colorbar_wind_ul.png',
  'Total Column Water': './outputs/colorbar_tcw.png'
};

// Overlay as a separate sphere just above the base globe
const overlayMaterial = new THREE.MeshBasicMaterial({
  map: wind10Tex,   // default
  transparent: true,
  opacity: 1.0
});

const overlayMesh = new THREE.Mesh(geometry.clone(), overlayMaterial);
overlayMesh.scale.set(1.001, 1.001, 1.001); // slightly bigger to avoid z-fighting
scene.add(overlayMesh);

const guiAPI = createVAWFGui({
  initialOverlay: '10m Wind',

  // --- Handle overlay selection ---
  onOverlayChange: (val) => {
    if (overlayTextures[val]) {
      overlayMaterial.map = overlayTextures[val];
      colorbar.src = colorbars[val];
      overlayMaterial.needsUpdate = true;
    } else {
      console.warn(`Overlay "${val}" not found.`);
    }
  },
  // --- Handle layer toggles ---
  onLayerToggle: (layer, enabled) => {
    switch (layer) {
      case 'Storms':
        enabled ? loadStorms() : removeStorms();
        break;
    }
  }
});

function latLonToCartesian(lat, lon, radius = 2.01) {
  const phi = (90 - lat) * Math.PI / 180;   // latitude → polar angle
  const theta = -lon * Math.PI / 180;        // longitude → azimuthal angle

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}

const popup = document.createElement("div");
popup.style.position = "absolute";
popup.style.background = "rgba(0,0,0,0.8)";
popup.style.color = "white";
popup.style.padding = "5px 10px";
popup.style.borderRadius = "4px";
popup.style.pointerEvents = "none";
popup.style.display = "none";
document.body.appendChild(popup);

const markerGroup = new THREE.Group();
scene.add(markerGroup);

let stormData = [];
let stormMarkers = [];

fetch('./outputs/storm_properties.json')
  .then(response => response.json())
  .then(jsonData => {
    stormData = jsonData.data;
    console.log("Storms loaded:", stormData.length);
  });


// Function to add a marker icon to the globe surface
function addMarkerIcon(lat, lon, windspeed, vorticity, radius = 2.05) {
  const { x, y, z } = latLonToCartesian(lat, lon, radius);

  const texture = new THREE.TextureLoader().load("./src/storm.svg");
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.PlaneGeometry(0.1, 0.1);
  const marker = new THREE.Mesh(geometry, material);

  marker.position.set(x, y, z);

  // Make the plane tangent to the sphere surface
  marker.lookAt(new THREE.Vector3(0, 0, 0));  // face the center
  // marker.rotateX(Math.PI); // optional: flip so texture is not mirrored

  // Store data for popup
  marker.userData = { windspeed, vorticity };
  markerGroup.add(marker);
  return marker; // <-- return so we can track it
}

function setupPopup(renderer, camera, markerGroup) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Raycast only against markers
    const intersects = raycaster.intersectObjects(markerGroup.children);

    if (intersects.length > 0) {
      const marker = intersects[0].object;
      if (marker.userData) {
        popup.style.display = "block";
        popup.innerHTML = `
        <strong>Max Winds</strong>: ${(marker.userData.windspeed* 3.6).toFixed(1)} km/hr <br/>
        <strong>Mean Vorticity</strong>: ${(marker.userData.vorticity* 1e5).toFixed(2)} × 10 <sup>-5</sup> s<sup>-1</sup>
        `;
        // First, reset transform
        popup.style.transform = "translate(-50%, -150%)";
        popup.style.left = event.clientX + "px";
        popup.style.top = event.clientY + "px";
      }
    } else {
      popup.style.display = "none";
    }
  });
}

// Call after creating markers
setupPopup(renderer, camera, markerGroup);

// points.forEach(p => {
//   addMarkerIcon(p.lat, p.lon, p.name, p.windspeed, p.vorticity, 2.01);
// });

// ---------- Load and Remove Storms ----------
async function loadStorms() {
  if (stormMarkers.length > 0) return; // prevent duplicates

  const response = await fetch('./outputs/storm_properties.json');
  const jsonData = await response.json();
  const storms = jsonData.data;

  storms.forEach(storm => {
    const marker = addMarkerIcon(
      storm['lat'],
      storm['lon'],
      storm['Max Winds'],
      storm['Mean Vorticity'],
      2.01
    );
    stormMarkers.push(marker);
    markerGroup.add(marker);
  });

  console.log(`${stormMarkers.length} storm markers added`);
}

function removeStorms() {
  // Remove all markers from the markerGroup
  stormMarkers.forEach(marker => markerGroup.remove(marker));

  // Clear array and re-render
  stormMarkers = [];
  console.log("Storm markers removed");
}

// ✅ Test addLabel with 3D text
function addLabel(lat, lon, text) {
  const radius = 2.01; // Earth radius + tiny offset
  const {x,y,z} = latLonToCartesian(lat,lon,radius)
  // const pos = new THREE.Vector3(x, y, z);

  const fontLoader = new FontLoader();
  fontLoader.load(
    'https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json',
    (font) => {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 0.05,
        height: 0.02,
        curveSegments: 1,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const textMesh = new THREE.Mesh(geometry, material);

      // ✅ Position at the surface
      textMesh.position.set(x, y, z);
      scene.add(textMesh);
    },
    undefined,
    (err) => console.error("❌ Font load failed:", err)
  );
}

// -------------------- Animate --------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
    // Keep plane markers constant size on screen and rotate
    markerGroup.children.forEach(marker => {
      // --- Keep size constant relative to zoom ---
      const distance = camera.position.distanceTo(marker.position);
      const scaleFactor = 0.5 * distance; // adjust as needed
      marker.scale.set(scaleFactor, scaleFactor, 2);
  
      // --- Rotation around local normal ---
      const normal = marker.position.clone().normalize(); // vector from origin to marker
      const lat = 90 - THREE.MathUtils.radToDeg(Math.acos(normal.y)); // latitude in degrees
  
      // Determine rotation direction
      const rotationSpeed = 0.01; // tweak for speed
      const angle = (lat >= 0 ? rotationSpeed : -rotationSpeed);
  
      // Rotate around normal vector
      marker.rotateOnWorldAxis(normal, angle);
    });
  
  renderer.render(scene, camera);
}
animate();

// -------------------- Window resize --------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// window.addEventListener("click", onClick);

