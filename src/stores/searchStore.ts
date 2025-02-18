import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchState {
    searchText: string;
    setSearchText: (str: string) => void;
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            searchText: "",
            setSearchText: (str) => set({ searchText: str }),
        }),
        {
            name: "search-storage",
        },
    ),
);
