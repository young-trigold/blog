import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  state?: string;
  title: string;
}

export interface MessagesState {
  value: Message[];
}

const initialState: MessagesState = {
  value: [] as Message[],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state: MessagesState, action: PayloadAction<Message>) => {
      state.value.push(action.payload);
    },
    clearMessage: (state: MessagesState) => {
      // eslint-disable-next-line no-param-reassign
      state.value = [];
    },
  },
});

export const { addMessage, clearMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
