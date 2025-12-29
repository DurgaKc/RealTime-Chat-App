import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name:'user',
  initialState: {user: null, allUsers:[] },
  reducers:{
    setUser: (state, action) => { state.user = action.payload; },
    setAllUsers: (state, action) => { state.allUsers = action.payload; },
  }
});

export const { setUser, setAllUsers } = usersSlice.actions;
export default usersSlice.reducer;