import cn from 'classnames';
import {
  FormEvent, useEffect, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { addTodos, updateTodos } from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: Todo | null) => void,
  setErrorMessage: (value: Errors) => void,
  setLoadingItemsId: (value: number[] | null) => void,
  inputTitleRef: React.MutableRefObject<HTMLInputElement | null>,
}
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setErrorMessage,
  setLoadingItemsId,
  inputTitleRef,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputTitleRef?.current) {
      inputTitleRef?.current.focus();
    }
  }, [inputTitleRef, tempTodo]);

  const trimTitle = title.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!trimTitle) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 11914,
      title: trimTitle,
      completed: false,
    });

    addTodos({
      userId: 11914,
      title: trimTitle,
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

      setLoadingItemsId(unCompleted.map(todo => todo.id));

      todos.forEach(todo => {
        updateTodos(todo.id, {
          userId: 11914,
          title: todo.title,
          completed: true,
        })
          .then(() => setTodos(todos.map(t => (
            { ...t, completed: true }
          ))))
          .catch(() => setErrorMessage(Errors.UnableUpdate))
          .finally(() => setLoadingItemsId(null));
      });
    } else {
      const completed = todos.filter(todo => todo.completed);

      setLoadingItemsId(completed.map(todo => todo.id));
      todos.forEach(todo => {
        updateTodos(todo.id, {
          userId: 11914,
          title: todo.title,
          completed: false,
        })
          .then(() => setTodos(todos.map(t => (
            { ...t, completed: false }
          ))))
          .catch(() => setErrorMessage(Errors.UnableUpdate))
          .finally(() => setLoadingItemsId(null));
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allComplited })}
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
          onClick={handleToggle}
        />
      )}

      {/* Add a todo on form submit */}
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
