import React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchInitialLists, deleteToDoAsync, updateToDoTickBoxAsync, updateToDoUpdateClickAsync, updateToDoSaveClickAsync, updateToDoInputChangeAsync } from '../features/toDo/toDoSlice'

function ToDos() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInitialLists());
    }, []);

    let todos = useSelector(state => state.toDo.toDoListsObject);

    return (
        <>
            <ol className='lists' >
                {Object.entries(todos).map(([id, task]) => {
                    return (
                        <li key={id} className='toDoList' id={`todo-${id}`}>
                            <div className='div1'>
                                <label htmlFor={`box-${id}`}></label>
                                <input type="checkbox" name='toDoListItemCheckbox' className='itemCheckbox' id={`boxCounter-${id}`} checked={task.tickBoxStatus} onChange={() => dispatch(updateToDoTickBoxAsync(id))} />

                                <label htmlFor={`targetToDo-${id}`}></label>
                                <input type="text" name='targetOfToDo' className='listItemContent' id={`targetToDo-${id}`} value={task.isEditable ? task.toDoInputCreated : task.listContent} onChange={(e) => dispatch(updateToDoInputChangeAsync({ id, newToDoInputCreated: e.target.value }))} readOnly={!task.isEditable} />
                            </div>


                            <div className='div2'>
                                <button className='updateBtn' type='button' id={`updateBtn-${id}`} onClick={task.isEditable ? () => dispatch(updateToDoSaveClickAsync({ id, newToDoInputCreated: task.toDoInputCreated })) : () => dispatch(updateToDoUpdateClickAsync(id))} >
                                    <i className={`fa-solid ${task.isEditable ? "fa-floppy-disk" : "fa-pen"}`}></i>
                                    {/* {task.isEditable ? " Save" : " Update"}  */}
                                </button>

                                <button className='deleteBtn' type='button' id={`deleteBtn-${id}`} onClick={() => dispatch(deleteToDoAsync(id))} >
                                    <i className='fa-solid fa-trash'></i>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </>
    )
}

export default ToDos