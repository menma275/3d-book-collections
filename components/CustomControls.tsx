import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtom } from "jotai";
import { isLargeSpaceAtom } from "../state/atom";

export default function CustomControls(): React.ReactElement {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const [isLargeSpace] = useAtom(isLargeSpaceAtom);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const deltaY = event.deltaY * 0.01;
      const offset = new THREE.Vector3();
      if (controls.current) {
        offset.copy(camera.position).sub(controls.current.target);
        camera.position.z += deltaY;
        controls.current.target.z += deltaY;
      }
    };

    gl.domElement.addEventListener("wheel", handleWheel);
    return () => gl.domElement.removeEventListener("wheel", handleWheel);
  }, [gl, camera]);

  useEffect(() => {
    if (controls.current) {
      camera.position.set(5, 5, 5);
      controls.current.target.set(controls.current.target.x, controls.current.target.y, 0);
    }
  }, [isLargeSpace, camera]);

  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      enableRotate={false}
    />
  );
}
