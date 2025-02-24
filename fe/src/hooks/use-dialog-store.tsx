import { IFile } from '@/lib/database/schema/file.model'
import { create } from 'zustand'


interface DialogState {
    selectedFile: IFile | null

    isRenameDialogOpen: boolean
    openRenameDialog: (file: IFile) => void
    closeRenameDialog: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
    selectedFile: null,
    isRenameDialogOpen: false,
    openRenameDialog: (file) => set({ isRenameDialogOpen: true, selectedFile: file }),
    closeRenameDialog: () => set({ isRenameDialogOpen: false, selectedFile: null }),
}))