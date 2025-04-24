import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const cacheName = "todo-cache-v1";

const initialState = {
    toDoListsObject : {}
};

async function setCache(key, value) {
    const cache = await caches.open(cacheName);
    await cache.put(key, new Response(JSON.stringify(value), {
        headers: { "Content-Type": "application/json" }
    }));
}

async function getCache(key) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(key);
    return response ? await response.json() : null;
}

async function getAllCacheKeys() {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    return keys.map(request => request.url.split('/').pop());
}


const syncWithStorage = async () => {
    let cacheKeys = await getAllCacheKeys();

    for (let i = 0; i < cacheKeys.length; i++) {
        if (cacheKeys[i] !== "toDoCounter") {
            let currentListsObject = await getCache(cacheKeys[i]);
            if (currentListsObject) {
                let currentLists = Object.fromEntries(
                    Object.entries(currentListsObject).map(([key, value]) => [
                        key,
                        { ...value, isEditable: false, toDoInputCreated: value.listContent }
                    ])
                );
                await setCache("lists", currentLists);
            } else {
                await setCache("toDoCounter", 0);
            }
        }
    }

    let toDoCounter = await getCache("toDoCounter");
    if (toDoCounter === null) {
        await setCache("toDoCounter", 0);
    }
};

export const fetchInitialLists = createAsyncThunk(
    "toDo/fetchInitialLists",
    async () => {
        await syncWithStorage();
        return await getCache("lists") || {};
    }
);

export const createNewToDoAsync = createAsyncThunk(
    "toDo/createNewToDo",
    async (newToDoValue, { getState }) => {
        const counter = (await getCache("toDoCounter")) || 0;
        const newToDo = {
            tickBoxStatus: false,
            listContent: newToDoValue,
            toDoInputCreated: newToDoValue,
            isEditable: false,
        };

        const updatedLists = { ...getState().toDo.toDoListsObject, [counter]: newToDo };

        await setCache("lists", updatedLists);
        await setCache("toDoCounter", counter + 1);

        return { newToDo, counter };
    }
);

export const deleteToDoAsync = createAsyncThunk(
    "toDo/deleteToDo",
    async (key, { getState }) => {
        const updatedLists = { ...getState().toDo.toDoListsObject };
        delete updatedLists[key];

        await setCache("lists", updatedLists);
        return key;
    }
);

export const updateToDoTickBoxAsync = createAsyncThunk(
    "toDo/updateToDoTickBox",
    async (listId, { getState }) => {
        const state = getState().toDo;
        const updatedLists = {
            ...state.toDoListsObject,
            [listId]: {
                ...state.toDoListsObject[listId],
                tickBoxStatus: !state.toDoListsObject[listId].tickBoxStatus
            }
        };

        await setCache("lists", updatedLists);

        return { listId, tickBoxStatus: updatedLists[listId].tickBoxStatus };
    }
);

export const updateToDoUpdateClickAsync = createAsyncThunk(
    "toDo/updateToDoUpdateClick",
    async (listId, { getState }) => {
        const state = getState().toDo;
        const updatedLists = {
            ...state.toDoListsObject,
            [listId]: { ...state.toDoListsObject[listId], isEditable: true }
        };

        await setCache("lists", updatedLists);

        return { listId, isEditable: true };
    }
);

export const updateToDoSaveClickAsync = createAsyncThunk(
    "toDo/updateToDoSaveClick",
    async ({ id, newToDoInputCreated }, { getState, rejectWithValue }) => {
        if (newToDoInputCreated.trim() === "") {
            alert("Type something to Save!");
            return rejectWithValue("Empty input");
        }

        const state = getState().toDo;
        const updatedLists = {
            ...state.toDoListsObject,
            [id]: {
                ...state.toDoListsObject[id],
                listContent: newToDoInputCreated,
                isEditable: false
            }
        };

        await setCache("lists", updatedLists);

        return { id, newToDoInputCreated };
    }
);

export const updateToDoInputChangeAsync = createAsyncThunk(
    "toDo/updateToDoInputChange",
    async ({ id, newToDoInputCreated }, { getState }) => {
        const state = getState().toDo;
        const updatedLists = {
            ...state.toDoListsObject,
            [id]: { ...state.toDoListsObject[id], toDoInputCreated: newToDoInputCreated }
        };

        await setCache("lists", updatedLists);

        return { id, newToDoInputCreated };
    }
);

export const toDoSlice = createSlice({
    name: "toDo",
    initialState,
    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialLists.fulfilled, (state, action) => {
                state.toDoListsObject = action.payload;
            })
            .addCase(createNewToDoAsync.fulfilled, (state, action) => {
                const { newToDo, counter } = action.payload;
                state.toDoListsObject[counter] = newToDo;
            })
            .addCase(deleteToDoAsync.fulfilled, (state, action) => {
                delete state.toDoListsObject[action.payload];
            })
            .addCase(updateToDoTickBoxAsync.fulfilled, (state, action) => {
                state.toDoListsObject[action.payload.listId].tickBoxStatus = action.payload.tickBoxStatus;
            })
            .addCase(updateToDoUpdateClickAsync.fulfilled, (state, action) => {
                state.toDoListsObject[action.payload.listId].isEditable = action.payload.isEditable;
            })
            .addCase(updateToDoSaveClickAsync.fulfilled, (state, action) => {
                state.toDoListsObject[action.payload.id].listContent = action.payload.newToDoInputCreated;
                state.toDoListsObject[action.payload.id].isEditable = false;
            })
            .addCase(updateToDoSaveClickAsync.rejected, (state, action) => {
                console.error("Save failed:", action.payload);
            })
            .addCase(updateToDoInputChangeAsync.fulfilled, (state, action) => {
                state.toDoListsObject[action.payload.id].toDoInputCreated = action.payload.newToDoInputCreated;
            });
    }
})


export default toDoSlice.reducer

