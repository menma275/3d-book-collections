import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useAtom } from "jotai";
import { bookAtom, selectedBookAtom } from "../state/atom";
import type { BookInfo, MergedBookInfo } from "../types/types";
import CustomControls from "./CustomControls";

function Book({
  book,
  position,
  isLargeSpace
}: {
  book: MergedBookInfo;
  position: [number, number, number];
  isLargeSpace: boolean
}): React.ReactElement {

  // Front Cover Texture
  const frontProxyURL = `/api/proxy?url=${encodeURIComponent(book?.largeImageUrl || "")}`;
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [frontError, setFrontError] = useState<boolean>(false);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      frontProxyURL,
      (texture) => {
        setFrontTexture(texture);
        setFrontError(false);
      },
      undefined,
      (error) => {
        console.error("Error loading front texture:", error);
        setFrontError(true);
      }
    );
  }, [frontProxyURL]);

  // Spine Texture
  const spineURL = `https://image.opencover.jp/v1/cover/spine/${book.isbn}.webp`;
  const spineProxyURL = `/api/proxy?url=${encodeURIComponent(spineURL)}`;
  const [spineTexture, setSpineTexture] = useState<THREE.Texture | null>(null);
  const [spineError, setSpineError] = useState<boolean>(false);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(
      spineProxyURL,
      (texture) => {
        setSpineTexture(texture);
        setSpineError(false);
      },
      undefined,
      (error) => {
        console.error("Error loading spine texture:", error);
        setSpineError(true);
      }
    );
  }, [spineProxyURL]);

  // Handel Hovered Book
  const [selectedBook, setSelectedBook] = useAtom(selectedBookAtom);
  const handlePointerEnter = () => {
    setSelectedBook(book.isbn);
  }
  const handlePointerLeave = () => {
    setSelectedBook(null);
  }

  const material = [
    new THREE.MeshBasicMaterial({
      map: spineError ? null : spineTexture,
      color: "white",
    }),
    new THREE.MeshBasicMaterial({ color: "#ffeecc" }),
    new THREE.MeshBasicMaterial({ color: "#ffeecc" }),
    new THREE.MeshBasicMaterial({ color: "#ffeecc" }),
    new THREE.MeshBasicMaterial({
      map: frontError ? null : frontTexture,
      color: "white",
    }),
    new THREE.MeshBasicMaterial({ color: "white" }),
  ];

  // Handle Book Size
  const useDefault = !book.size || [book.size.width, book.size.height, book.size.depth].some((val) => val == null || isNaN(val));
  const width = useDefault ? 0.75 : book.size.width! / 100;
  const height = useDefault ? 1 : book.size.height! / 100;
  const depth = useDefault ? 0.1 : book.size.depth! / 100;

  // Handle Position
  const ref = useRef<THREE.Mesh>(null);
  const defaultPosition = [position[0] - width / 2, position[1] + height / 2, position[2]];

  useFrame(() => {
    if (!ref.current) return;
    let y = defaultPosition[1];
    let z = defaultPosition[2];
    if (selectedBook === book.isbn) y += height / 2 + 0.1;
    if (isLargeSpace) z *= 3;

    const target = new THREE.Vector3(defaultPosition[0], y, z);
    ref.current.position.lerp(target, 0.25);
  })

  return (
    <mesh
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      material={material}
      position={[position[0] + width / 2, position[1] + height / 2, position[2]]}
    >
      <boxGeometry args={[width, height, depth]} />
    </mesh>
  );
}

export default function MainCanvas({ isLargeSpace }: { isLargeSpace: boolean }): React.ReactElement {
  const [books] = useAtom(bookAtom);
  return (
    <Canvas>
      <color attach="background" args={["#eee"]} />
      <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={120} />
      {(books) &&
        books.map((book: BookInfo, index: number) => (
          <Book
            book={book}
            position={[2, 0, (books.length * 0.5) / 2 - index * 0.5]}
            key={index}
            isLargeSpace={isLargeSpace}
          />
        )
        )}
      <gridHelper args={[100, 800, "#ddd", "#ddd"]} position={[0, 0, 0]} />
      <CustomControls />
    </Canvas>
  )
}
