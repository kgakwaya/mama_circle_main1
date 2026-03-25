import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchRooms = createAsyncThunk('chat/fetchRooms', async (_, thunkAPI) => {
  try {
    const res = await api.get('/chat/rooms');
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message);
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (roomId: string, thunkAPI) => {
  try {
    const res = await api.get(`/chat/rooms/${roomId}/messages`);
    return { roomId, messages: res.data };
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message);
  }
});

export const fetchPsychologists = createAsyncThunk('chat/fetchPsychologists', async (_, thunkAPI) => {
  try {
    const res = await api.get('/chat/psychologists');
    return res.data;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message);
  }
});

export const openDirectRoom = createAsyncThunk('chat/openDirectRoom', async (userId: string, thunkAPI) => {
  try {
    const res = await api.post(`/chat/direct/${userId}`);
    return res.data.roomId as string;
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message);
  }
});

interface Message {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  senderId: string | null;
  senderNickname: string;
  senderRole: string;
}

interface ChatState {
  rooms: any[];
  messages: Record<string, Message[]>;
  psychologists: any[];
  loading: boolean;
  activeRoomId: string | null;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    rooms: [],
    messages: {},
    psychologists: [],
    loading: false,
    activeRoomId: null,
  } as ChatState,
  reducers: {
    setActiveRoom: (state, action) => {
      state.activeRoomId = action.payload;
    },
    appendMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      // avoid duplicates
      if (!state.messages[roomId].find((m) => m.id === message.id)) {
        state.messages[roomId].push(message);
      }
    },
    updateRoomLastMessage: (state, action) => {
      const { roomId, content } = action.payload;
      const room = state.rooms.find((r: any) => r.id === roomId);
      if (room) {
        (room as any).last_message = content;
        (room as any).last_message_at = new Date().toISOString();
      }
    },
    addRoom: (state, action) => {
      if (!state.rooms.find((r: any) => r.id === action.payload.id)) {
        state.rooms.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.roomId] = action.payload.messages;
      })
      .addCase(fetchPsychologists.fulfilled, (state, action) => {
        state.psychologists = action.payload;
      })
      .addCase(openDirectRoom.fulfilled, (state, action) => {
        state.activeRoomId = action.payload;
      });
  },
});

export const { setActiveRoom, appendMessage, updateRoomLastMessage, addRoom } = chatSlice.actions;
export default chatSlice.reducer;
