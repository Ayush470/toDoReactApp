import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteToDo, updateToDoTickBox, updateToDoUpdateClick, updateToDoSaveClick, updateToDoInputChange } from '../features/toDo/toDoSlice'

function ToDos() {
    let todos = useSelector(state => state.toDoListsObject);
    const dispatch = useDispatch();

    return (
        <>
            <ol>
                {Object.entries(todos).map(([id, task]) => {
                    return (
                        <li key={id} className='toDoList' id={`todo-${id}`}>
                            <label htmlFor={`box-${id}`}></label>
                            <input type="checkbox" name='toDoListItemCheckbox' className='itemCheckbox' id={`boxCounter-${id}`} checked={task.tickBoxStatus} onChange={() => dispatch(updateToDoTickBox(id))} />

                            <label htmlFor={`targetToDo-${id}`}></label>
                            <input type="text" name='targetOfToDo' className='listItemContent' id={`targetToDo-${id}`} value={task.isEditable ? task.toDoInputCreated : task.listContent} onChange={(e) => dispatch(updateToDoInputChange({id, newToDoInputCreated: e.target.value}))} readOnly={!task.isEditable} />

                            <button className='updateBtn' type='button' id={`updateBtn-${id}`} onClick={task.isEditable ? () => dispatch(updateToDoSaveClick({id, newToDoInputCreated: task.toDoInputCreated})) : () => dispatch(updateToDoUpdateClick(id))} >
                                <i className={`fa-solid ${task.isEditable ? "fa-floppy-disk" : "fa-pen"}`}></i>
                                {task.isEditable ? " Save" : " Update"}
                            </button>

                            <button className='deleteBtn' type='button' id={`deleteBtn-${id}`} onClick={() => dispatch(deleteToDo(id))} >
                                <i className='fa-solid fa-trash'></i>Delete
                            </button>
                        </li>
                    );
                })}
            </ol>
        </>
    )
}

export default ToDos