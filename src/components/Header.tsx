import cn from 'classnames';
import {
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import {
  addTodos,
  updateTodos,
} from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: Todo | null) => void,
  setErrorMessage: (value: Errors) => void,
  setLoadingIds: (value: number[] | null) => void,
  inputTitleRef: React.MutableRefObject<HTMLInputElement | null>,
}
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setErrorMessage,
  setLoadingIds,
  inputTitleRef,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputTitleRef?.current) {
      inputTitleRef?.current.focus();
    }
  }, [inputTitleRef, tempTodo]);

  const trimedTitle = title.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!trimedTitle) {
      setErrorMessage(Errors.EmptyTitle);
      setTimeout(() => {
        setErrorMessage(Errors.EmptyTitle);
      }, 1000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 11901,
      title: trimedTitle,
      completed: false,
    });

    addTodos({
      userId: 11901,
      title: trimedTitle,
      completed: false,
    }).then((todo) => {
      setTodos([...todos, todo]);
      setTitle('');
    })
      .catch(() => {
        setErrorMessage(Errors.UnableAdd);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const allComplited = todos.every(todo => todo.completed);

  const handleToggle = () => {
    if (!allComplited) {
      const unCompleted = todos.filter(todo => !todo.completed);

      setLoadingIds(unCompleted.map(todo => todo.id));

      todos.forEach(todo => {
        updateTodos(todo.id, {
          userId: 11901,
          title: todo.title,
          completed: true,
        })
          .then(() => setTodos(todos.map(tds => (
            { ...tds, completed: true }
          ))))
          .catch(() => setErrorMessage(Errors.UnableUpdate))
          .finally(() => setLoadingIds(null));
      });
    } else {
      const completed = todos.filter(todo => todo.completed);

      setLoadingIds(completed.map(todo => todo.id));
      todos.forEach(todo => {
        updateTodos(todo.id, {
          userId: 11901,
          title: todo.title,
          completed: false,
        })
          .then(() => setTodos(todos.map(tds => (
            { ...tds, completed: false }
          ))))
          .catch(() => setErrorMessage(Errors.UnableUpdate))
          .finally(() => setLoadingIds(null));
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allComplited })}
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
          onClick={handleToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={tempTodo !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputTitleRef}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
