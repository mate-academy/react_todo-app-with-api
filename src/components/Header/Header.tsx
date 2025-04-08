import React, { useEffect, useRef, useState } from 'react';
import { changeTodoParams } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ERROR } from '../../types/enums';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setErrorMessage: (value: ERROR | string) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  loadingIdsState: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number | null) => void;
  };
  addItem: (inpunElement: HTMLInputElement) => Promise<void>;
};

export const Header: React.FC<Props> = React.memo(
  ({ setErrorMessage, setTodos, addItem, loadingIdsState, todos }) => {
    const [isLoading, setIsLoading] = useState(false);
    const completed = !todos.every(item => item.completed === true);
    const inputField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputField.current?.focus();
    }, [todos.length, isLoading]);

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      if (inputField.current) {
        try {
          await addItem(inputField.current);
          inputField.current.value = '';
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    };

    const completeAll = () => {
      const status = completed;
      const notInStatus = todos.filter(item => item.completed !== status);

      notInStatus.forEach(async item => {
        loadingIdsState.adIdToLoadingList(item.id);
        try {
          await changeTodoParams(item.id, { completed: status });
          setTodos(prev =>
            prev.map(todo =>
              todo.completed !== status ? { ...todo, completed: status } : todo,
            ),
          );
        } catch (error) {
          setErrorMessage(ERROR.update);
          throw new Error(ERROR.update);
        } finally {
          loadingIdsState.removeIdFromLoadingList(item.id);
        }
      });
    };

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: !completed })}
            data-cy="ToggleAllButton"
            onClick={() => completeAll()}
          />
        )}

        <form onSubmit={onFormSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={inputField}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
