import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  threads: false,
  threadDetail: false,
  leaderboards: false,
  submit: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      Object.assign(state, { [key]: value });
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
