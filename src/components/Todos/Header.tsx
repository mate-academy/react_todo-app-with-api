import classNames from 'classnames';
import {
  Dispatch, FormEvent, SetStateAction, useEffect, useRef,
} from 'react';
import { createTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  userId: number;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setToggleAll: Dispatch<SetStateAction<boolean>>;
};

export const Header: React.FC<Props> = ({
  userId,
  todos,
  setTodos,
  setError,
  setErrorMessage,
  setLoader,
  title,
  setTitle,
  setToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSumbit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (title.length < 1) {
      setError(true);
      setErrorMessage("Title can't be empty");

      return;
    }

    createTodo(userId, normalizedTitle)
      .then(addedTodo => {
        setTodos([...todos, addedTodo]);
        setLoader(true);
        setTitle('');
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to add a todo');
      });

    setLoader(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const checkCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const toggleTodos = [...todos];

    setToggleAll(true);

    toggleTodos.map(todo => (
      updateTodo(todo.id, { completed: !todo.completed })
        .then(() => {
          setToggleAll(false);
        })
        .catch(() => {
          setError(true);
          setErrorMessage('Unable to update a todo');
        })));

    if (checkCompleted) {
      setTodos(toggleTodos.map(item => (
        { ...item, completed: !item.completed })));
    } else {
      setTodos(toggleTodos.map(item => (
        { ...item, completed: true })));
    }
  };

  return (
    <header className="todoapp__header">

      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: checkCompleted },
          )}
          aria-label="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSumbit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
