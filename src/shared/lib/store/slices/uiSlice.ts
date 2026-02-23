import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  editingItem: any | null;
}

interface UIState {
  sidebar: boolean;
  modals: {
    toolForm: ModalState;
    marketplaceForm: ModalState;
    faqForm: ModalState;
    experienceForm: ModalState;
    projectForm: ModalState;
    // New persistent UI modules for advanced purchases
    purchaseDialog: ModalState;
    orderSuccessDialog: ModalState;
  };
}

const initialModalState: ModalState = {
  isOpen: false,
  editingItem: null,
};

const initialState: UIState = {
  sidebar: false,
  modals: {
    toolForm: { ...initialModalState },
    marketplaceForm: { ...initialModalState },
    faqForm: { ...initialModalState },
    experienceForm: { ...initialModalState },
    projectForm: { ...initialModalState },
    purchaseDialog: { ...initialModalState },
    orderSuccessDialog: { ...initialModalState },
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (
      state: UIState, 
      action: PayloadAction<{ modalName: keyof UIState['modals']; editingItem?: any }>
    ) => {
      const { modalName, editingItem } = action.payload;
      state.modals[modalName].isOpen = true;
      state.modals[modalName].editingItem = editingItem || null;
    },
    closeModal: (state: UIState, action: PayloadAction<keyof UIState['modals']>) => {
      const modalName = action.payload;
      state.modals[modalName].isOpen = false;
      state.modals[modalName].editingItem = null;
    },
    toggleSidebar: (state: UIState) => {
      state.sidebar = !state.sidebar;
    },
    setSidebar: (state: UIState, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload;
    },
  },
});

export const { openModal, closeModal, toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
