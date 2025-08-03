import { useEffect, useState } from "react";
import { getBookInfos } from "../utils/book";
import type { BookInfo, AdditionalBookInfo, MergedBookInfo } from "../types/types";

const CACHE_KEY = "books";
const CACHE_DURATION = 60 * 60 * 1000;

const shinsho = [
  {
    "isbn": "9784121027566",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784022952387",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784480684523",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784140887004",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784065308899",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784087212747",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784065321294",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784480075284",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784004319559",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784065336915",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784004319948",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784106109911",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784480075789",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784121027689",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784121027429",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784121027733",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784140886908",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784309631677",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784334046477",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  },
  {
    "isbn": "9784480075840",
    "size": {
      "width": 220,
      "height": 440,
      "depth": 30
    }
  }
]

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
    const infos = shinsho;
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
