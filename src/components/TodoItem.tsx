import React,
{
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import * as todosServices from '../api/todos';
import { TodosContext } from '../TodoContext/TodoContext';
import { Todo } from '../types/Todo';

interface TodoItems {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItems> = ({ todo }) => {
  const {
    setCompleted,
    deleteTodo,
    updateTodosId,
    todos,
    setUpdateTodosId,
    setTodos,
    setErrorMessage,
  } = useContext(TodosContext);

  const [isEdeting, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [isEdeting, editingTitle]);

  function saveEditingTitle() {
    setUpdateTodosId((prevTodos) => [...prevTodos, todo.id]);

    if (editingTitle.trim()) {
      const chosenTodo = todos.find(
        todoFind => todoFind.id === todo.id,
      ) as Todo;

      const { completed, id } = chosenTodo;

      todosServices.editTodo({
        title: editingTitle.trim(),
        completed,
        id,
      })
        .then(() => {
          setTodos(currentTodos => currentTodos.map(todoSet => (
            todoSet.id === id
              ? { ...todoSet, title: editingTitle.trim() }
              : todoSet)));
          setIsEditing(false);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setEditingTitle(todo.title);
        })
        .finally(() => {
          setUpdateTodosId([]);
        });
    }
  }

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(todo.title);
    }
  };

  const handleOnSubmit = (event: (FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement, Element>)) => {
    event.preventDefault();
    if (editingTitle.trim() === todo.title.trim()) {
      setIsEditing(false);

      return;
    }

    if (editingTitle.trim()) {
      saveEditingTitle();

      return;
    }

    if (!editingTitle.trim()) {
      deleteTodo(todo.id)
        .then(() => setIsEditing(false))
        .catch(() => {
          setEditingTitle(todo.title);
        });
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => setCompleted(todo)}
        />
      </label>

      {isEdeting ? (
        <form onSubmit={handleOnSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.currentTarget.value)}
            onBlur={handleOnSubmit}
            ref={titleFocus}
            onKeyUp={(event) => handleOnKeyUp(event)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => {
              setIsEditing(true);
            }}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': updateTodosId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
