export type Collection = {
  id: number;
  title: string;
  content: string;
  isbns: string;
  thumbnail: string;
  user: string;
  group: number;
  date: string;
  color: string;
  colorreason: string;
  season: string;
  tags: string;
  pages: string;
  period: string;
  size: string;
  stage: string;
  category: string;
  binding: string;
};

export type BookFetch = {
  keyword: string;
  format: string;
  applicationId: string;
  formatVersion: string;
  outOfStockFlag: string;
  orFlag: string;
}

export type BookInfo = {
  isbn: string;
  size?: number;
  category?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  tags?: string;
};

export type AdditionalBookInfo = BookInfo & {
  affiliateUrl: string;
  artistName: string;
  author: string;
  availability: string;
  booksGenreId: string;
  chirayomiUrl: string;
  discountPrice: number;
  discountRate: number;
  hardware: string;
  isbn: string;
  itemCaption: string;
  itemPrice: number;
  itemUrl: string;
  jan: string;
  label: string;
  largeImageUrl: string;
  limitedFlag: number;
  listPrice: number;
  mediumImageUrl: string;
  os: string;
  postageFlag: number;
  publisherName: string;
  reviewAverage: string;
  reviewCount: number;
  salesDate: string;
  smallImageUrl: string;
  title: string;
};

export type MergedBookInfo = BookInfo & Partial<AdditionalBookInfo>;
