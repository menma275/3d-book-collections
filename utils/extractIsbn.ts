import type { Collection, BookInfo } from "../types/types";

export function extractIsbn(collections: Collection[]): BookInfo[] {
  const isbns: string[] = [];
  const categories: string[] = [];
  const sizes: string[] = [];
  const tags: string[] = [];

  isbns.push(
    ...collections.flatMap((collection: Collection) => {
      return collection.isbns.split(",").map((isbn) => isbn.trim());
    })
  );

  categories.push(
    ...collections.flatMap((collection: Collection): string[] => {
      return collection.category.split(",").map((category) => category.trim());
    })
  );

  sizes.push(
    ...collections.flatMap((collection: Collection): string[] => {
      return collection.size.split(",").map((size) => size.trim());
    })
  );

  tags.push(
    ...collections.flatMap((collection: Collection): string[] => {
      return collection.tags.split(",").map((tag) => tag.trim());
    })
  );

  const bookInfos: BookInfo[] = [];
  isbns.map((isbn, index) => {
    const parts = sizes[index]?.split("*").map(s => Number(s.trim()));

    const bookInfo = {
      isbn: isbn,
      category: categories[index] || "",
      size: {
        width: parts?.[2] || NaN,
        height: parts?.[0] || NaN,
        depth: parts?.[1] || NaN,
      },
      tags: tags[index] || "",
    };
    bookInfos.push(bookInfo);
  });

  const seen = new Set<string>();
  return bookInfos.filter((bookInfo: BookInfo) => {
    if (bookInfo.isbn.length !== 13) return false;
    if (seen.has(bookInfo.isbn)) return false;
    seen.add(bookInfo.isbn);
    return true;
  });
}
