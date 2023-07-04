import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UpdateTodo, deleteTodos } from '../api/todos';
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
  const [onEdit, setOnEdit] = useState<null | number>(null);
  const [searchQuery, setSearchQuery] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [onEdit]);

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
    UpdateTodo(todoId, { completed: !todoStatus })
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
    setOnEdit(null);

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
        UpdateTodo(todo.id, { title: searchQuery })
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
      setOnEdit(null);
      setSearchQuery(todo.title);
    }
  };

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => statusClickHandler(todo.id, todo.completed)}
        />
      </label>

      {onEdit === todo.id ? (
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
            onDoubleClick={() => setOnEdit(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => clickHandler(todo.id)}
            onDoubleClick={() => setOnEdit(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': loader.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
