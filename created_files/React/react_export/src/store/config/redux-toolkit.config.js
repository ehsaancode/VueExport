import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  // You can add any dynamic key here at runtime
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setValue(state, action) {
      state[action.payload.key] = action.payload.value;
    },
       
    setUpdater(state, action) {
      const prev = state[action.payload.key];
      state[action.payload.key] = action.payload.updater(prev);
    },

    // Custom reducer function (pass a function that takes state and returns new state)
    customReducer(state, action) {
      const newState = action.payload(state);
      Object.assign(state, newState);
    },

    //State remove function (pass state key name)
    removeKey(state, action) {
      delete state[action.payload.key];
    },
  },
});

const store = configureStore({
  reducer: stateSlice.reducer,
});


export const get = (key) => store.getState()[key];

export const set = (key, value) => {
  if (typeof value === "function") {
    store.dispatch(stateSlice.actions.setUpdater({ key, updater: value }));
  } else {
    store.dispatch(stateSlice.actions.setValue({ key, value }));
  }
};

export const remove = (key) => {
  store.dispatch(stateSlice.actions.removeKey({ key }));
};

export const customReduce = (fn) => {
  store.dispatch(stateSlice.actions.customReducer(fn));
};


export const subscribe = (listener) => store.subscribe(listener);
