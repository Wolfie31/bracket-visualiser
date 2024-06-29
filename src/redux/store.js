import { configureStore } from '@reduxjs/toolkit';

//import reducers here
import bracketReducer from './reducers/bracketReducer'

export const store = configureStore({
  reducer: {
     // We'll add reducers here 
    bracket: bracketReducer,
  },
});