import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createNewToDoAsync} from '../features/toDo/toDoSlice' 

function AddToDo(){
    const [toDoInput, setToDoInput] = useState("");
    const dispatch = useDispatch();

    function createNewToDoHandler(newToDoValue) {
      if(newToDoValue !== ""){
        dispatch(createNewToDoAsync(newToDoValue));
        setToDoInput("");
      } else {
        alert("Input field is empty!")
      }
    }

    return (
      <form id="toDoForm">
        <label htmlFor="task"></label>
        <input type="text" id="task" name="toDo" value={toDoInput} onChange={e => setToDoInput(e.target.value)} placeholder="Enter Todo"/>
        <button type="button" id="addToDoButton" onClick={() => createNewToDoHandler(toDoInput)}>Add Todo</button>
      </form>
    )
}

export default AddToDo