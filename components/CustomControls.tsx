import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function CustomControls(): React.ReactElement {
  const { camera, gl } = useThree();
  const controls = useRef<THREE.OrbitControls>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const deltaY = event.deltaY * 0.01;
      // if (camera.position.z + deltaY < 20 && camera.position.z + deltaY > -10) {
      const offset = new THREE.Vector3();
      offset.copy(camera.position).sub(controls.current.target);
      camera.position.z += deltaY;
      controls.current.target.z += deltaY;
      // }
    };

    gl.domElement.addEventListener("wheel", handleWheel);
    return () => gl.domElement.removeEventListener("wheel", handleWheel);
  }, [gl, camera]);

  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
    />
  );
}
