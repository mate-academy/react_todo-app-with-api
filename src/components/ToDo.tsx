/* eslint-disable */
import { Todo } from "../types/Todo";
import classNames from "classnames";
import { deleteTodo, getTodos } from "../api/todos";
import { ACTIONS } from "../utils/enums";
import { StateContext } from "./TodoContext";
import {
  useContext,
  useState
} from "react";
import { updateTodo } from '../api/todos';


type Props = {
  todo: Todo,
}
export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { dispatch } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);

  function deleteItem(id: number) {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => {
        getTodos(11384)
          .then(res => {
            dispatch({ type: ACTIONS.SET_LIST, payload: res })
            setIsLoading(false);
          })
      })
      .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to delete a todo' }))
  }

  function handleDoubleClickEdit(e: React.MouseEvent) {
    e.preventDefault();
    // setIsEditing(true);
    // setEditingToDoData(toDo.title);
  }
  console.log(handleDoubleClickEdit);


  function handleClick() {
    setIsLoading(true);
    updateTodo({
      id: todo.id,
      completed: !todo.completed,
      title: todo.title,
      userId: todo.userId,
    })
      .then(() => {
        getTodos(11384)
          .then(res => {
            dispatch({ type: ACTIONS.SET_LIST, payload: res })
            setIsLoading(false);
          })
      })
      .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to toggle a todo' }))
  }
  console.log(isLoading);

  return (
    <div className={classNames('todo', {
      'completed': todo.completed
    })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleClick}
        />
      </label>

      {isLoading && (

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
       <span
          className="todo__title"
          onDoubleClick={(e) => handleDoubleClickEdit(e)}
        >
          {todo.title}
        </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteItem(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  )
}


