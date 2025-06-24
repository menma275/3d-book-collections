import { atom } from 'jotai';
import type { Collection, MergedBookInfo } from '../types/types';

export const collectionAtom = atom<Collection[]>([]);
export const bookAtom = atom<MergedBookInfo[]>([]);
export const selectedBookAtom = atom<string | null>(null);
