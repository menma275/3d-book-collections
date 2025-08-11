import type { BookFetch, AdditionalBookInfo } from '../types/types';

export async function getBookInfos(isbns: string[]): Promise<AdditionalBookInfo[]> {
  const appId = "1088692564014700161";
  const baseUrl = "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404";

  const chunks: string[][] = [];
  for (let i = 0; i < isbns.length; i += 9) {
    chunks.push(isbns.slice(i, i + 9));
  }

  const fetchIsbns = chunks.map(async (chunk, index) =>
    new Promise(resolve => setTimeout(resolve, index * 1000)).then(async () => {
      const params: BookFetch = {
        keyword: chunk.join(' '),
        format: 'json',
        applicationId: appId,
        formatVersion: "2",
        outOfStockFlag: "1",
        orFlag: "1"
      }
      const queryParams = new URLSearchParams(params);
      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch books for ISBNs: ${index}`);
      }

      const data = await response.json();
      console.log(`Fetched data for chunk ${index}:`, data);

      const items = data.Items as AdditionalBookInfo[];
      return items;
    })

  )
  const results = await Promise.all(fetchIsbns);

  console.log("Fetched book infos:", results);

  return results.flat();
}
