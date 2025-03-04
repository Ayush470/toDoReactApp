import {configureStore} from '@reduxjs/toolkit';
import toDoReducer from '../features/toDo/toDoSlice';

export const store = configureStore({
    reducer: toDoReducer
})