/* eslint-disable */
import { Todo } from "../types/Todo";
import classNames from "classnames";
import { deleteTodo, getTodos } from "../api/todos";
import { ACTIONS } from "../utils/enums";
import { StateContext } from "./TodoContext";
import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { updateTodo } from '../api/todos';


type Props = {
  todo: Todo,
}
export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { state, dispatch } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);
  const editingTodo: React.RefObject<HTMLInputElement> = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingtoDoData, setEditingToDoData] = useState(todo.title);

  function refreshLIst() {
    getTodos(11384)
      .then(res => {
        dispatch({ type: ACTIONS.SET_LIST, payload: res })
        setIsLoading(false);
      })
  }

  function deleteItem(id: number) {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => {
        refreshLIst();
      })
      .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to delete a todo' }))
  }

  useEffect(() => {
    if (editingTodo.current) {
      editingTodo.current.focus();
    }
  });

  function handleDoubleClickEdit(e: React.MouseEvent) {
    e.preventDefault();
    setIsEditing(true);
    setEditingToDoData(todo.title);
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
        refreshLIst();
      })
      .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to toggle a todo' }))
  }

  function handleChanges() {
    console.log(editingtoDoData, 'data');

    if (editingtoDoData === '') {
      deleteItem(todo.id);
    }
    else {
      setIsLoading(true);
      updateTodo({
        id: todo.id,
        completed: todo.completed,
        userId: todo.userId,
        title: editingtoDoData,
      })
        .then(() => refreshLIst())
        .catch(() => dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to update a todo' }))
      setIsEditing(false);
    }
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.code === 'Enter' && e.target.value === '') {
      deleteItem(todo.id);
      setIsEditing(false);
    } else if (e.nativeEvent.code === 'Enter') {
      handleChanges();
    }

  }
  return (
    <div className={classNames('todo', {
      'completed': todo.completed,
      editing: isEditing,
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
      { (state.isLoading && todo.completed) && (
        <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      )}
      { (state.toggleAll === 'completed' && todo.completed) && (
        <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      )}
      { (state.toggleAll === 'active' && !todo.completed) && (
        <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      )}
      {isEditing ? (
        <form>
          <input
            ref={editingTodo}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingtoDoData}
            onChange={(e) => setEditingToDoData(e.target.value)}
            onBlur={handleChanges}
            onKeyDown={handleEnter}
          />
        </form>
      ) : (
        <span
          className="todo__title"
          onDoubleClick={(e) => handleDoubleClickEdit(e)}
        >
          {todo.title}
        </span>
      )}


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


