import { create } from 'zustand'

interface ConfirmDialogConfig {
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

interface ConfirmDialogState {
    isOpen: boolean;
    config: ConfirmDialogConfig | null;
    openDialog: (config: ConfirmDialogConfig) => void;
    closeDialog: () => void;
}

export const useConfirmDialogStore = create<ConfirmDialogState>((set) => ({
    isOpen: false,
    config: null,
    openDialog: (config: ConfirmDialogConfig) => set({ isOpen: true, config }),
    closeDialog: () => set({ isOpen: false, config: null }),
}))