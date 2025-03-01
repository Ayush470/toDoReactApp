// Commented for code review
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [toDoInput, setToDoInput] = useState("");
  const [listsObject, setListsObject] = useState({});

  const cacheName = "todo-cache-v1";

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

  useEffect(() => {
    const syncWithStorage = async () => {
      let cacheKeys = await getAllCacheKeys();

      for (let i = 0; i < cacheKeys.length; i++) {
        if (cacheKeys[i] !== "toDoCounter") {
          let currentListsObject = await getCache(cacheKeys[i]);
          console.log(currentListsObject);
          if (currentListsObject) {
            const updatedLists = Object.fromEntries(
              Object.entries(currentListsObject).map(([key, value]) => [
                key,
                { ...value, isEditing: false, toDoInputCreated: value.listContent }
              ])
            );
            setListsObject(updatedLists);
            await setCache("lists", updatedLists);
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

    syncWithStorage();
  }, []);

  const createNewTask = async (id, newValue) => {
    if (newValue != "") {
      const updatedLists = {
        ...listsObject,
        [id]: { listContent: newValue, tickBoxStatus: false, toDoInputCreated: newValue, isEditing: false }
      }
      console.log(updatedLists);
      setListsObject(updatedLists);
      await setCache("lists", updatedLists);
      setToDoInput("");
      let counter = await getCache("toDoCounter");
      counter = Number(counter) + 1;
      console.log(counter);
      await setCache("toDoCounter", counter);
    } else {
      alert("Input field is empty!");
    }
  }

  const handleUpdateClick = async (id) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], isEditing: true },
    };
    setListsObject(updatedLists);
    await setCache("lists", updatedLists);
  };

  const handleSaveClick = async (id, value) => {
    if (value.trim() !== "") {
      const updatedLists = {
        ...listsObject,
        [id]: { ...listsObject[id], isEditing: false, listContent: value },
      };
      setListsObject(updatedLists);
      await setCache("lists", updatedLists);
    } else {
      alert("Type something to save.");
    }
  };

  const tickBoxControl = async (id) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], tickBoxStatus: !listsObject[id].tickBoxStatus },
    };
    setListsObject(updatedLists);
    await setCache("lists", updatedLists);
  }

  const deleteListItem = async (id) => {
    const updatedLists = { ...listsObject };
    delete updatedLists[id];

    setListsObject(updatedLists);
    await setCache("lists", updatedLists);
  }

  const handleInputChange = async (id, value) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], toDoInputCreated: value },
    };
    setListsObject(updatedLists);
    await setCache("lists", updatedLists);
  }

  return (
    <>
      <form>
        <label htmlFor="task">Enter Task: </label>
        <input type="text" id="task" name="toDo" value={toDoInput} onChange={e => setToDoInput(e.target.value)} />
        <button type="button" id="add" onClick={async () => {
          const counter = await getCache("toDoCounter");
          await createNewTask(counter, toDoInput);
        }}>+</button>
      </form>

      <ol>
        {Object.entries(listsObject).map(([id, task]) => {
          return (
            <li key={id} className='toDoList' id={`todo-${id}`}>
              <label htmlFor={`box-${id}`}></label>
              <input type="checkbox" name='toDoListItemCheckbox' className='itemCheckbox' id={`boxCounter-${id}`} checked={task.tickBoxStatus} onChange={() => tickBoxControl(id)} />

              <label htmlFor={`targetToDo-${id}`}></label>
              <input type="text" name='targetOfToDo' className='listItemContent' id={`targetToDo-${id}`} value={task.isEditing ? task.toDoInputCreated : task.listContent} onChange={(e) => handleInputChange(id, e.target.value)} readOnly={!task.isEditing} />

              <button className='updateBtn' type='button' id={`updateBtn-${id}`} onClick={task.isEditing ? () => handleSaveClick(id, task.toDoInputCreated) : () => handleUpdateClick(id)} >
                <i className={`fa-solid ${task.isEditing ? "fa-floppy-disk" : "fa-pen"}`}></i>
                {task.isEditing ? " Save" : " Update"}
              </button>

              <button className='deleteBtn' type='button' id={`deleteBtn-${id}`} onClick={() => deleteListItem(id)} >
                <i className='fa-solid fa-trash'></i>Delete
              </button>
            </li>
          );
        })}
      </ol>
    </>
  )
}

export default App
