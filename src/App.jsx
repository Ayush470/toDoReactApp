import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [toDoInput, setToDoInput] = useState("");
  const [listsObject, setListsObject] = useState({});

  useEffect(() => {
    const listsString = localStorage.getItem("lists");
    if (listsString) {
      const parsedLists = JSON.parse(listsString);

      const updatedLists = Object.fromEntries(
        Object.entries(parsedLists).map(([key, value]) => [
          key,
          { ...value, isEditing: false, toDoInputCreated: value.listContent }
        ])
      );
      setListsObject(updatedLists);
      localStorage.setItem("lists", JSON.stringify(updatedLists));
      if (Object.keys(updatedLists).length === 0) {
        localStorage.setItem("toDoCounter", 0);
      }
    } else {
      localStorage.setItem("toDoCounter", 0);
    }
  }, []);

  const createNewTask = (id, newValue) => {
    if(newValue != ""){
      const updatedLists = {
        ...listsObject,
        [id]: { listContent: newValue, tickBoxStatus: false, toDoInputCreated: newValue, isEditing: false }
      }
      setListsObject(updatedLists);
      localStorage.setItem("lists", JSON.stringify(updatedLists));
      setToDoInput("");
      localStorage.toDoCounter++;
    } else {
      alert("Input field is empty!");
    }
  }

  const handleUpdateClick = (id) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], isEditing: true },
    };
    setListsObject(updatedLists);
    localStorage.setItem("lists", JSON.stringify(updatedLists));
  };

  const handleSaveClick = (id, value) => {
    if (value.trim() !== "") {
      const updatedLists = {
        ...listsObject,
        [id]: { ...listsObject[id], isEditing: false, listContent: value },
      };
      setListsObject(updatedLists);
      localStorage.setItem("lists", JSON.stringify(updatedLists));
    } else {
      alert("Type something to save.");
    }
  };

  const tickBoxControl = (id) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], tickBoxStatus: !listsObject[id].tickBoxStatus },
    };
    setListsObject(updatedLists);
    localStorage.setItem("lists", JSON.stringify(updatedLists));
  }

  const deleteListItem = (id) => {
    const updatedLists = { ...listsObject };
    delete updatedLists[id];  

    setListsObject(updatedLists);
    localStorage.setItem("lists", JSON.stringify(updatedLists));
  }

  const handleInputChange = (id, value) => {
    const updatedLists = {
      ...listsObject,
      [id]: { ...listsObject[id], toDoInputCreated: value },
    };
    setListsObject(updatedLists);
    localStorage.setItem("lists", JSON.stringify(updatedLists));
  }

  return (
    <>
      <form>
        <label htmlFor="task">Enter Task: </label>
        <input type="text" id="task" name="toDo" value={toDoInput} onChange={e => setToDoInput(e.target.value)} />
        <button type="button" id="add" onClick={() => createNewTask(localStorage.toDoCounter, toDoInput)}>+</button>
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
