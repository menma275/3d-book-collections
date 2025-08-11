import { useEffect, useState } from "react";
import { getBookInfos } from "../utils/book";
import type { BookInfo, AdditionalBookInfo, MergedBookInfo } from "../types/types";

const CACHE_KEY = "books";
const CACHE_DURATION = 60 * 60 * 1000;

const shinsho = [
  { "isbn": "9784121027566", "size": 3 },
  { "isbn": "9784022952387", "size": 3 },
  { "isbn": "9784480684523", "size": 3 },
  { "isbn": "9784140887004", "size": 3 },
  { "isbn": "9784065308899", "size": 3 },
  { "isbn": "9784087212747", "size": 3 },
  { "isbn": "9784065321294", "size": 3 },
  { "isbn": "9784480075284", "size": 3 },
  { "isbn": "9784004319559", "size": 3 },
  { "isbn": "9784065336915", "size": 3 },
  { "isbn": "9784004319948", "size": 3 },
  { "isbn": "9784106109911", "size": 3 },
  { "isbn": "9784480075789", "size": 3 },
  { "isbn": "9784121027689", "size": 3 },
  { "isbn": "9784121027429", "size": 3 },
  { "isbn": "9784121027733", "size": 3 },
  { "isbn": "9784140886908", "size": 3 },
  { "isbn": "9784309631677", "size": 3 },
  { "isbn": "9784334046477", "size": 3 },
  { "isbn": "9784480075840", "size": 3 }
];

const stundentPick = [
  { "isbn": "9784309413181", "size": 2 },
  { "isbn": "9784065184479", "size": 2 },
  { "isbn": "9784041060575", "size": 2 },
  { "isbn": "9784120057090", "size": 2 },
  { "isbn": "9784101092058", "size": 2 },
  { "isbn": "9784098607785", "size": 8 },
  { "isbn": "9784488420147", "size": 2 },
  { "isbn": "9784041092453", "size": 2 },
  { "isbn": "9784103522348", "size": 2 },
  { "isbn": "9784163915098", "size": 2 },
  { "isbn": "9784575590043", "size": 2 },
  { "isbn": "9784813716112", "size": 2 },
  { "isbn": "9784091237545", "size": 8 },
  { "isbn": "9784048926669", "size": 2 },
  { "isbn": "9784043878017", "size": 2 },
  { "isbn": "9784101098104", "size": 2 },
  { "isbn": "9784150119553", "size": 2 },
  { "isbn": "9784062769211", "size": 2 },
  { "isbn": "9784062153065", "size": 2 },
  { "isbn": "9784101001579", "size": 2 },
  { "isbn": "9784102018040", "size": 2 },
  { "isbn": "9784101005010", "size": 2 },
  { "isbn": "9784097263722", "size": 7 },
  { "isbn": "9784591097663", "size": 7 },
  { "isbn": "9784265062591", "size": 7 },
  { "isbn": "9784774611600", "size": 8 },
  { "isbn": "9784772100311", "size": 2 },
  { "isbn": "9784838729470", "size": 2 },
  { "isbn": "9784041055069", "size": 2 },
  { "isbn": "9784102122044", "size": 2 },
  { "isbn": "9784101269313", "size": 2 },
  { "isbn": "9784041067505", "size": 2 },
  { "isbn": "9784864726115", "size": 3 },
  { "isbn": "9784591160022", "size": 2 },
  { "isbn": "9784864106269", "size": 2 },
  { "isbn": "9784575522099", "size": 2 },
  { "isbn": "9784061473928", "size": 2 },
  { "isbn": "9784062120630", "size": 2 },
  { "isbn": "9784044292010", "size": 2 },
  { "isbn": "9784061484467", "size": 2 },
  { "isbn": "9784061485136", "size": 2 },
  { "isbn": "9784591113073", "size": 2 },
  { "isbn": "9784494004676", "size": 2 },
  { "isbn": "9784046313430", "size": 2 },
  { "isbn": "9784566024113", "size": 7 },
  { "isbn": "9784001145014", "size": 2 },
  { "isbn": "9784797329834", "size": 2 },
  { "isbn": "9784065122105", "size": 2 },
  { "isbn": "9784048737432", "size": 2 },
  { "isbn": "9784094071993", "size": 2 },
  { "isbn": "9784620108193", "size": 7 },
  { "isbn": "9784103549512", "size": 2 },
  { "isbn": "9784591153093", "size": 2 },
  { "isbn": "9784041160084", "size": 2 },
  { "isbn": "9784041026229", "size": 2 },
  { "isbn": "9784333019120", "size": 7 },
  { "isbn": "9784434108716", "size": 2 },
  { "isbn": "9784799322703", "size": 2 },
  { "isbn": "9781368022286", "size": 2 },
  { "isbn": "9784562056286", "size": 2 },
  { "isbn": "9784152092854", "size": 2 }
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

  // 2. コレクションからデータ抽出
  const [bookInfos, setBookInfos] = useState<BookInfo[]>([]);
  useEffect(() => {
    if (useCache) return;
    const infos = stundentPick;
    setBookInfos(infos);
  }, [useCache]);

  // 3. 楽天APIから追加情報取得
  const [additionalBookInfos, setAdditionalBookInfos] = useState<AdditionalBookInfo[]>([]);
  useEffect(() => {
    if (useCache) return;
    if (bookInfos.length === 0) return;
    const isbns = bookInfos.map((book) => book.isbn);
    getBookInfos(isbns).then(setAdditionalBookInfos);
  }, [bookInfos, useCache]);

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
