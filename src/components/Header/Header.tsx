import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { USER_ID, addTodo, toggleTodo } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (error: string) => void;
  handleAddTodoToState: (todo: Todo) => void;
  todosToBeDeleted: number[];
  areAllTodosCompleted: boolean;
  notCompletedTodos: Todo[];
};

export const Header: React.FC<Props> = ({
  setTodos,
  todos,
  setTempTodo,
  setErrorMessage,
  handleAddTodoToState,
  todosToBeDeleted,
  areAllTodosCompleted,
  notCompletedTodos,
}) => {
  const [title, setTitle] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputField = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    try {
      const tempTodo = {
        id: 0,
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      setTempTodo(tempTodo);
      setInputDisabled(true);

      const result = await addTodo(newTodo);

      handleAddTodoToState(result);

      setTitle('');
    } catch (error) {
      setErrorMessage(Errors.CantAdd);
    } finally {
      setTempTodo(null);
      setInputDisabled(false);
      setTimeout(() => {
        if (inputField.current) {
          inputField.current.focus();
        }
      }, 0);
    }
  };

  function handleToggleAllClick() {
    if (!areAllTodosCompleted) {
      Promise.allSettled(
        notCompletedTodos.map(todo => toggleTodo({ completed: true }, todo.id)),
      ).then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: true,
          })),
        );
      });
    } else {
      Promise.allSettled(
        todos.map(todo => toggleTodo({ completed: false }, todo.id)),
      ).then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: false,
          })),
        );
      });
    }
  }

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todosToBeDeleted, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          disabled={inputDisabled}
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
