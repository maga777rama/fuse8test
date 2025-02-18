import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PaginationState {
    page: number;
    setPage: (page: number) => void;
}

export const usePaginationStore = create<PaginationState>()(
    persist(
        (set) => ({
            page: 1,
            setPage: (newPage: number) => set({ page: newPage }),
        }),
        {
            name: "pagination-storage",
        },
    ),
);
