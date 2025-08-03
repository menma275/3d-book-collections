import { useEffect, useState } from "react";
import { getBookInfos } from "../utils/book";
import { staticData } from "../utils/staticData";
import type { BookInfo, AdditionalBookInfo, MergedBookInfo } from "../types/types";

const CACHE_KEY = "books";
const CACHE_DURATION = 60 * 60 * 1000;

const useStaticBooks = () => {
  const [books, setBooks] = useState<MergedBookInfo[] | null>(null);

  const [useCache, setUseCache] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { books: cachedBooks, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setBooks(cachedBooks);
          setUseCache(true);
        }
      } catch (e) {
        console.error("Failed to parse cached books:", e);
      }
    }
  }, [setBooks]);

  const [bookInfos, setBookInfos] = useState<BookInfo[]>([]);
  useEffect(() => {
    if (useCache) return;
    const infos = staticData();
    setBookInfos(infos);
  }, [useCache]);

  const [additionalBookInfos, setAdditionalBookInfos] = useState<AdditionalBookInfo[]>([]);
  useEffect(() => {
    if (useCache) return;
    if (bookInfos.length === 0) return;
    const isbns = bookInfos.map((book) => book.isbn);
    getBookInfos(isbns).then(setAdditionalBookInfos);
  }, [bookInfos, useCache]);

  // 4. データのマージ
  useEffect(() => {
    if (useCache) return;
    if (bookInfos.length === 0 || additionalBookInfos.length === 0) return;
    const merged = bookInfos.map((book) => {
      const additional = additionalBookInfos.find((a) => a.isbn === book.isbn);
      return {
        ...book,
        ...additional,
      };
    });
    const data = merged.length > 0 ? merged : additionalBookInfos;
    setBooks(data);
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ books: data, timestamp: Date.now() })
    );
  }, [setBooks, bookInfos, additionalBookInfos, useCache]);

  return { books };
};

export default useStaticBooks;
