import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { selectedBookAtom } from "../state/atom";
import type { MergedBookInfo } from "../types/types";
import MainCanvas from "../components/Canvas";
import useManageBooks from "../utils/manageBooks";
import useStaticBooks from "../utils/staticBooks";

function App() {
  const [selectedBook] = useAtom(selectedBookAtom);
  const [selectedBookInfo, setSelectedBookInfo] = useState<MergedBookInfo | null>(null);

  const [isLargeSpace, setIsLargeSpace] = useState<boolean>(false);

  const { books } = useStaticBooks();
  // const { books } = useManageBooks();

  useEffect(() => {
    if (!books) return;
    const bookInfo = books.find((book) => book.isbn === selectedBook);
    setSelectedBookInfo(bookInfo || null);
  }, [books, selectedBook]);

  return (
    <div className="w-full h-dvh fixed">
      {selectedBookInfo && (
        <div className="pointer-events-none fixed z-10 top-0 left-0 p-12 w-fit max-w-sm h-fit max-h-dvh overflow-y-hidden text-neutral-700 text-sm flex gap-2 flex-col cursor-default
          ">
          <h1 className="font-bold">{selectedBookInfo.title}</h1>
          <p className="text-xs">{selectedBookInfo.author}</p>
          <p className="text-xs">{selectedBookInfo.itemCaption}</p>
        </div>
      )}
      <div className="fixed z-10 bottom-0 right-0 p-12 w-fit max-w-sm h-fit max-h-dvh overflow-y-hidden text-neutral-700 text-sm flex gap-2 flex-col cursor-default">
        <button className="text-xs font-bold px-3 py-1.5 bg-white rounded-full border border-white flex flex-row gap-2" onClick={() => setIsLargeSpace(!isLargeSpace)}>
          <span>Toggle Space</span>
          <span className={`${isLargeSpace ? "text-neutral-700" : "text-neutral-300"}`}>Large</span>
          <span className={`${isLargeSpace ? "text-neutral-300" : "text-neutral-700"}`}>Small</span>
        </button>
      </div>
      {books && books.length === 0 && (
        <h1 className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-neutral-900 text-lg font-bold">Loading...</h1>
      )}
      <MainCanvas books={books} isLargeSpace={isLargeSpace} />
    </div >
  );
}

export default App;
