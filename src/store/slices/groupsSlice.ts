import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async (_, thunkAPI) => {
    try {
        const response = await api.get('/groups');
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const joinGroup = createAsyncThunk('groups/joinGroup', async (groupId: string, thunkAPI) => {
    try {
        await api.post(`/groups/${groupId}/join`);
        return groupId; // Return ID to update state
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        groupsList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groupsList = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as any;
            })
            .addCase(joinGroup.fulfilled, (state, action) => {
                const group: any = state.groupsList.find((g: any) => g._id === action.payload);
                if (group) {
                    // Just a primitive update for now, we don't have the user ID to push into members array easily here
                    // Re-fetching or real-time passing would be better.
                }
            });
    },
});

export default groupsSlice.reducer;
