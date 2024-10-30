import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';

const NanosuitModel = () => {
    useEffect(() => {
        // Crear la escena y la cámara
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 10, 30);

        // Crear el renderizador
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Ajustar el renderizador al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

        // Añadir una luz ambiental básica
        const ambientLight = new THREE.AmbientLight(0x404040); // Luz suave
        scene.add(ambientLight);

        // Añadir una luz puntual dinámica
        const pointLight = new THREE.PointLight(0x00ffcc, 1, 100);
        pointLight.position.set(5, 10, 5);
        scene.add(pointLight);

        // Añadir una luz direccional suave
        const directionalLight = new THREE.DirectionalLight(0x00ffcc, 0.5);
        directionalLight.position.set(-5, 10, -5);
        scene.add(directionalLight);

        let model: THREE.Object3D | null = null;

        // Cargar el modelo 3D
        const loader = new GLTFLoader();
        loader.load('/src/assets/3D model/Nanosuit.gltf', (gltf) => {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.position.set(0, -18.5, 0);
            gltf.scene.rotation.y = Math.PI;

            // Aplicar efecto de holograma
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0.4; // Ligera transparencia
                    child.material.color.set(0x00ffcc); // Color azul verdoso
                    child.material.emissive.set(0x00ffcc); // Color emitido
                    child.material.wireframe = true; // Activar modo de malla
                }
            });
            model = gltf.scene;
            scene.add(gltf.scene);
        });

        // Añadir controles de órbita
        const controls = new OrbitControls(camera, renderer.domElement);

        // Animación de renderizado
        const animate = () => {
            requestAnimationFrame(animate);
            // Crear efecto de pulso en la opacidad
            if (model) {
                model.traverse((child: unknown) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        const material = mesh.material;
        
                        if (Array.isArray(material)) {
                            // Si es un array, aplica el efecto a cada material en el array
                            material.forEach((mat) => {
                                mat.transparent = true;
                                mat.opacity = 0.3 + Math.abs(Math.sin(Date.now() * 0.005)) * 0.3;
                            });
                        } else {
                            // Si no es un array, aplica el efecto directamente
                            material.transparent = true;
                            material.opacity = 0.3 + Math.abs(Math.sin(Date.now() * 0.005)) * 0.3;
                        }
                    }
                });
            }
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Limpiar el renderizador al desmontar
        return () => {
            window.removeEventListener('resize', () => {}); // Eliminar el evento
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return null;
};

export default NanosuitModel;
