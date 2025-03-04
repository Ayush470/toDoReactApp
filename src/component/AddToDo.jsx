import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createNewToDo} from '../features/toDo/toDoSlice' 

function AddToDo(){
    const [toDoInput, setToDoInput] = useState("");
    const dispatch = useDispatch();

    function createNewToDoHandler(value) {
      if(value !== ""){
        dispatch(createNewToDo(value));
        setToDoInput("");
      } else {
        alert("Input field is empty!")
      }
    }

    return (
      <form>
        <label htmlFor="task">Enter Task: </label>
        <input type="text" id="task" name="toDo" value={toDoInput} onChange={e => setToDoInput(e.target.value)} />
        <button type="button" id="add" onClick={() => createNewToDoHandler(toDoInput)}>+</button>
      </form>
    )
}

export default AddToDo