import { createSlice } from '@reduxjs/toolkit';

const listsString = localStorage.getItem("lists");
let updatedLists = {};
if (listsString) {
    const parsedLists = JSON.parse(listsString);

    updatedLists = Object.fromEntries(
        Object.entries(parsedLists).map(([key, value]) => [
            key,
            { ...value, isEditable: false, toDoInputCreated: value.listContent }
        ])
    );
    localStorage.setItem("lists", JSON.stringify(updatedLists));
    if (Object.keys(updatedLists).length === 0) {
        localStorage.setItem("toDoCounter", 0);
    }
} else {
    localStorage.setItem("toDoCounter", 0);
}

const initialState = {
    toDoListsObject: updatedLists
}

export const toDoSlice = createSlice({
    name: "toDo",
    initialState,
    reducers: {
        createNewToDo: (state, action) => {
            const newToDoValue = action.payload;
            const key = localStorage.getItem("toDoCounter");
            if (key) {
                state.toDoListsObject[key] = {
                    tickBoxStatus: false,
                    listContent: newToDoValue,
                    toDoInputCreated: newToDoValue,
                    isEditable: false,
                }
            }
            localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
            const newToDoCounter = Number(key) + 1;
            localStorage.setItem("toDoCounter", newToDoCounter);
        },

        deleteToDo: (state, action) => {
            const key = action.payload;
            if (state.toDoListsObject[key]) {
                delete state.toDoListsObject[key]; 
            }
            localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
        },

        updateToDoTickBox: (state, action) => {
            const listId = action.payload;
            state.toDoListsObject[listId].tickBoxStatus = !state.toDoListsObject[listId].tickBoxStatus;
            localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
        },

        updateToDoUpdateClick: (state, action) => {
            const listId = action.payload;
            console.log("updateToDoUpdateClick" + listId);
            state.toDoListsObject[listId].isEditable = true;
            localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
        },

        updateToDoSaveClick: (state, action) => {
            const {id, newToDoInputCreated} = action.payload;
            console.log("updateToDoSaveClick" + id);
            if(newToDoInputCreated.trim() !== ""){
                state.toDoListsObject[id].isEditable = false;
                state.toDoListsObject[id].listContent = newToDoInputCreated;
                localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
            } else {
                alert("Type something to Save!")
            }
        },

        updateToDoInputChange: (state, action) => {
            const {id, newToDoInputCreated} = action.payload;
            console.log("updateToDoInputChange" + id);
            state.toDoListsObject[id].toDoInputCreated = newToDoInputCreated;
            localStorage.setItem("lists", JSON.stringify(state.toDoListsObject));
        }
    }
})

export const {createNewToDo, deleteToDo, updateToDoTickBox, updateToDoUpdateClick, updateToDoSaveClick, updateToDoInputChange} = toDoSlice.actions

export default toDoSlice.reducer

