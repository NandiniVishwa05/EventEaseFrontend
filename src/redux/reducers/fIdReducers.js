import { createSlice } from "@reduxjs/toolkit";

export const fIdReducers = createSlice({
    name: 'fid',
    initialState: {
        fid: 0
    },
    reducers: {
        setFid: (state, action) => {
            state.fid = action.payload;
        }
    }
})

export const { setFid } = fIdReducers.actions;
export default fIdReducers.reducer