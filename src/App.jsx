import AddToDo from './component/AddToDo'
import ToDos from './component/ToDos'
import "./App.css"

function App() {

  return (
    <>
      <AddToDo />
      <div id='todosHeading'>Todos</div>
      <ToDos />
    </>
  )
}

export default App
