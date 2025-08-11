import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useAtom } from "jotai";
import { selectedBookAtom } from "../state/atom";
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
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [frontWidth, setFrontWidth] = useState<number>(0);
  const [forntHeight, setForntHeight] = useState<number>(0);
  const [spineWidth, setSpineWidth] = useState<number>(0);
  const [spineHeight, setSpineHeight] = useState<number>(0);

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
        setFrontWidth(texture.image.width);
        setForntHeight(texture.image.height);
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
        setSpineWidth(texture.image.width);
        setSpineHeight(texture.image.height);
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

  // Handle Hovered Book
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

  useEffect(() => {
    setWidth(spineHeight / forntHeight * frontWidth / 500);
    setHeight(spineHeight / 500);
    setDepth(spineWidth / 500);
  }, [spineHeight, forntHeight, frontWidth, spineWidth]);

  // switch (book.size) {
  //   case 1: // 単行本
  //     width = 1.28;
  //     height = 1.82;
  //     depth = 0.25; // 約20–30mm
  //     break;
  //   case 2: // 文庫
  //     width = 1.05;
  //     height = 1.48;
  //     depth = 0.20; // 約15–25mm
  //     break;
  //   case 3: // 新書
  //     width = 1.07;
  //     height = 1.73;
  //     depth = 0.15; // 約20–25mm
  //     break;
  //   case 4: // 全集・双書
  //     width = 1.28;
  //     height = 1.88;
  //     depth = 0.35; // 約30mm以上
  //     break;
  //   case 5: // 事・辞典
  //     width = 1.82;
  //     height = 2.57;
  //     depth = 0.35; // 約25–40mm
  //     break;
  //   case 6: // 図鑑
  //     width = 1.82;
  //     height = 2.57;
  //     depth = 0.35; // 約25–40mm
  //     break;
  //   case 7: // 絵本
  //     width = 2.10;
  //     height = 2.97;
  //     depth = 0.12; // 約10–15mm
  //     break;
  //   case 8: // コミック
  //     width = 1.28;
  //     height = 1.82;
  //     depth = 0.22; // 約20–25mm
  //     break;
  //   default: // その他
  //     width = 1.05;
  //     height = 1.48;
  //     depth = 0.20; // 約15–25mm
  //     break;
  // }

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

export default function MainCanvas({ books, isLargeSpace }: { books: MergedBookInfo[] | null, isLargeSpace: boolean }): React.ReactElement {
  return (
    <Canvas>
      <color attach="background" args={["#eee"]} />
      <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={120} />
      {books &&
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
