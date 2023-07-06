import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { updateTodo, deleteTodos } from '../api/todos';
import { showError } from '../helpers/helpers';
import { Todo } from '../types/Todo';

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

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clickHandler = (id: number) => {
    setLoader(prevState => [...prevState, id]);
    deleteTodos(id)
      .then(() => {
        setTodos(prevState => (
          prevState.filter(prevTodo => prevTodo.id !== id)
        ));
      })
      .catch(() => showError('Unable to delete a todo', setError));
  };

  const statusClickHandler = (todoId : number, todoStatus: boolean) => {
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
      .catch(() => showError('Unable to delete a todo', setError));
  };

  const blurHandler = () => {
    setIsEditing(false);

    switch (searchQuery) {
      case '':
        setLoader(prevState => [...prevState, todo.id]);
        deleteTodos(todo.id)
          .then(() => {
            setTodos(prevState => (
              prevState.filter(prevTodo => prevTodo.id !== todo.id)
            ));
          })
          .catch(() => showError('Unable to delete a todo', setError));
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
          .catch(() => showError('Unable to update a todo', setError));
    }
  };

  const submitHandler = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    blurHandler();
  };

  const keyUpHandler = (
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
          onClick={() => statusClickHandler(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={submitHandler}
        >
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={searchQuery}
            onChange={changeHandler}
            onBlur={blurHandler}
            onKeyUp={keyUpHandler}
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
            onClick={() => clickHandler(todo.id)}
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
