import { createSlice } from '@reduxjs/toolkit';

interface ModalContainerState {
  visible: boolean;
}

const initialState: ModalContainerState = {
  visible: false,
};

const modalSlice = createSlice({
  name: 'modalContainer',
  initialState,
  reducers: {
    setModalContainerVisible: (state, action)=> {
      state.visible = action.payload;
    },
  },
});

export const { setModalContainerVisible } = modalSlice.actions;
export default modalSlice.reducer;
