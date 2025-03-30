import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import classNames from 'classnames';

type Props = {
  setErrorMessage: (arg: string) => void;
  setAllTodos: (arg: Todo[]) => void;
  allTodos: Todo[];
  setLoadingTodo: (arg: boolean) => void;
  setLoadingTodoId: (arg: number) => void;
  setLoadingForToggleAll: (arg: number[]) => void;
};

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setAllTodos,
  allTodos,
  setLoadingTodo,
  setLoadingTodoId,
  setLoadingForToggleAll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    if (inputValue.trim().length === 0) {
      setErrorMessage(ErrorType.NoTitle);

      return;
    } else {
      const newTodo: Omit<Todo, 'id' | 'completed'> = {
        userId: USER_ID,
        title: inputValue.trim(),
      };
      const tempTodo: Todo = {
        id: Date.now(),
        userId: USER_ID,
        title: inputValue.trim(),
        completed: false,
      };

      setDisabled(true);
      setLoadingTodo(true);
      setLoadingTodoId(tempTodo.id);
      setAllTodos([...allTodos, tempTodo]);

      addTodo(newTodo)
        .then((newTodoFromServer: Todo) => {
          const todos = allTodos.slice(0, allTodos.length);

          setTimeout(() => {
            setAllTodos([...todos, newTodoFromServer]);
            setLoadingTodo(false);
            setLoadingTodoId(-1);
            setDisabled(false);
            setInputValue('');

            if (inputFocus.current) {
              inputFocus.current.focus();
            }
          }, 1000);
        })
        .catch(() => {
          setErrorMessage(ErrorType.AddTodo);
          setAllTodos(allTodos.slice(0, allTodos.length));
          setDisabled(false);
        });
    }
  };

  const handleToggleAll = async () => {
    setLoadingTodo(true);

    const allCompleted = allTodos.every(todo => todo.completed);
    const todosToUpdate = allTodos.filter(
      todo => todo.completed === allCompleted,
    );
    const todoIdsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingForToggleAll(todoIdsToUpdate);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !allCompleted }).then(() => ({
            ...todo,
            completed: !allCompleted,
          })),
        ),
      );

      setAllTodos(
        allTodos.map(todo =>
          todoIdsToUpdate.includes(todo.id)
            ? updatedTodos.find(updated => updated.id === todo.id) || todo
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to toggle all todos');
    } finally {
      setLoadingTodo(false);
      setLoadingForToggleAll([]);
    }
  };

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [allTodos]);

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
