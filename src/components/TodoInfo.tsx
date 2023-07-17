import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { updateTodo, deleteTodos } from '../api/todos';
import { showError } from '../helpers/helpers';
import { Todo } from '../types/Types';

interface Props {
  setError: React.Dispatch<React.SetStateAction<string>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  loader: number[],
  setLoader:React.Dispatch<React.SetStateAction<number[]>>
  todo: Todo,
}

export const TodoInfo:React.FC<Props> = ({
  setError,
  setTodos,
  loader,
  setLoader,
  todo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  const handleChangeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleTodoRemoveButtonClick = (id: number) => {
    setLoader(prevState => [...prevState, id]);
    deleteTodos(id)
      .then(() => {
        setTodos(prevState => (
          prevState.filter(prevTodo => prevTodo.id !== id)
        ));
      })
      .catch((err) => showError(`Unable to delete a todo: ${err.message}`, setError));
  };

  const handleStatusClick = (todoId : number, todoStatus: boolean) => {
    setLoader(prevState => [...prevState, todoId]);
    updateTodo(todoId, { completed: !todoStatus })
      .then((updatedTodo) => {
        setTodos(prevState => (
          prevState.map(prevTodo => {
            return (prevTodo.id === todoId) ? updatedTodo : prevTodo;
          })
        ));

        setLoader(prevState => prevState.filter(id => id !== todoId));
      })
      .catch((err) => showError(`Unable to delete a todo :${err.message}`, setError));
  };

  const handleBlurTodoEditing = () => {
    setIsEditing(false);

    switch (searchQuery) {
      case '':
        handleTodoRemoveButtonClick(todo.id);
        break;

      case todo.title:
        return;

      default:
        setLoader(prevState => [...prevState, todo.id]);
        updateTodo(todo.id, { title: searchQuery })
          .then((updatedTodo) => {
            setTodos(prevState => (
              prevState.map(prevTodo => {
                return (prevTodo.id === todo.id) ? updatedTodo : prevTodo;
              })
            ));

            setLoader(prevState => prevState.filter(id => id !== todo.id));
          })
          .catch((err) => showError(`Unable to update a todo :${err.message}`, setError));
    }
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleBlurTodoEditing();
  };

  const handleKeyUp = (
    event :React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(true);
      setSearchQuery(todo.title);
    }
  };

  const modalIsActive = loader.includes(todo.id);

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => handleStatusClick(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={searchQuery}
            onChange={handleChangeSearchQuery}
            onBlur={handleBlurTodoEditing}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleTodoRemoveButtonClick(todo.id)}
            onDoubleClick={() => setIsEditing(true)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': modalIsActive,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
