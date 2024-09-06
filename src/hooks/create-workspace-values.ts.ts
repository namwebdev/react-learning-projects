import { create } from "zustand";

type Step = 1 | 2;

type CreateWorkSpaceValues = {
  name: string;
  imageUrl: string;
  updateImageUrl: (url: string) => void;
  updateValues: (values: Partial<CreateWorkSpaceValues>) => void;
  currStep: Step;
  setCurrStep: (step: Step) => void;
  reset: () => void;
};

export const useCreateWorkspaceValues = create<CreateWorkSpaceValues>(
  (set) => ({
    name: "",
    imageUrl: "",
    updateImageUrl: (url) => set({ imageUrl: url }),
    updateValues: (values) => set(values),
    currStep: 1,
    setCurrStep: (step) => set({ currStep: step }),
    reset: () => set({ name: "", imageUrl: "", currStep: 1 }),
  })
);
