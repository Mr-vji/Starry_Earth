import { create } from "zustand";

const useStore = create((set) => ({
   PHI: 1.54,
   THETA: -1.34,
   phi3: 0.2,

   setPHI: (value) => set({ PHI: value }),
   setTHETA: (value) => set({ THETA: value }),
   setPhi3: (value) => set({ phi3: value }),
}));

export default useStore;
