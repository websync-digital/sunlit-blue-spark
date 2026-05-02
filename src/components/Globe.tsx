import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 1.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Globe
    const radius = 0.54;
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    
    // Texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 5,
    });

    const globe = new THREE.Mesh(geometry, material);
    globe.rotation.x = 0.4;
    scene.add(globe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.0);
    pointLight2.position.set(-5, -3, 2);
    scene.add(pointLight2);

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.03, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // --- Trade Arcs ---
    const latLongToVector3 = (lat: number, lon: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const createArc = (start: THREE.Vector3, end: THREE.Vector3, isPrimary: boolean = false) => {
      const distance = start.distanceTo(end);
      const mid = start.clone().lerp(end, 0.5);
      mid.normalize().multiplyScalar(radius * (1 + distance * 0.5));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const arcMaterial = new THREE.LineBasicMaterial({ 
        color: isPrimary ? 0x60a5fa : 0x93c5fd, 
        transparent: true, 
        opacity: isPrimary ? 0.6 : 0.3, 
      });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globe.add(arcLine);

      const dotGeometry = new THREE.SphereGeometry(isPrimary ? 0.007 : 0.005, 8, 8);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      globe.add(dot);

      return { curve, dot, speed: (isPrimary ? 0.004 : 0.002) + Math.random() * 0.005, progress: Math.random() };
    };

    const nigeria = { lat: 9.0765, lon: 7.3986 };
    const arcs: any[] = [];
    
    // 1. Keep 50 Nigeria-centric lines (Primary)
    const targets = [
      { name: 'Americas', latMin: -40, latMax: 60, lonMin: -120, lonMax: -40 },
      { name: 'EuropeAsia', latMin: 20, latMax: 70, lonMin: 40, lonMax: 140 },
      { name: 'Oceania', latMin: -45, latMax: -10, lonMin: 110, lonMax: 160 },
      { name: 'SouthAmerica', latMin: -55, latMax: 10, lonMin: -80, lonMax: -35 }
    ];

    const startVec = latLongToVector3(nigeria.lat, nigeria.lon, radius);
    for (let i = 0; i < 50; i++) {
      const targetRegion = targets[Math.floor(Math.random() * targets.length)];
      const randomLat = Math.random() * (targetRegion.latMax - targetRegion.latMin) + targetRegion.latMin;
      const randomLon = Math.random() * (targetRegion.lonMax - targetRegion.lonMin) + targetRegion.lonMin;
      const endVec = latLongToVector3(randomLat, randomLon, radius);
      arcs.push(createArc(startVec, endVec, true));
    }

    // 2. Add 100 Random Global lines (Secondary)
    for (let i = 0; i < 100; i++) {
      const lat1 = (Math.random() - 0.5) * 160;
      const lon1 = (Math.random() - 0.5) * 360;
      const lat2 = (Math.random() - 0.5) * 160;
      const lon2 = (Math.random() - 0.5) * 360;
      
      const sVec = latLongToVector3(lat1, lon1, radius);
      const eVec = latLongToVector3(lat2, lon2, radius);
      
      // Ensure the line is long enough to look like a global trade route
      if (sVec.distanceTo(eVec) > 0.3) {
        arcs.push(createArc(sVec, eVec, false));
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.01;

      arcs.forEach(arc => {
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;
        const pos = arc.curve.getPointAt(arc.progress);
        arc.dot.position.copy(pos);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[270px] md:h-[360px] lg:h-[450px]" />;
};

export default Globe;
