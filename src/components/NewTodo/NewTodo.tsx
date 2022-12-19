/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  useMemo,
  Dispatch,
  useContext,
  SetStateAction,
  useCallback,
} from 'react';

import {
  addTodo,
  updateTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';
import { ErrorStatus } from '../../types/errorStatus';
import { setIsLoadingContext } from '../Context/context';

interface Props {
  newTodoField: React.Ref<HTMLInputElement> | undefined,
  activeTodos: Todo[] | null,
  allTodos: Todo[] | null,
  currentInput: string,
  setCurrentInput: Dispatch<SetStateAction<string>>,
  setErrorWithTimer: (message: string) => void,
  isLoading: number[],
  loadUserTodos: () => void;
}

export const NewTodo: React.FC<Props> = (props) => {
  const {
    newTodoField,
    activeTodos,
    allTodos,
    currentInput,
    setCurrentInput,
    setErrorWithTimer,
    isLoading,
    loadUserTodos,
  } = props;

  const user = useContext(AuthContext);

  const newTodo = {
    title: currentInput,
    userId: user?.id,
    completed: false,
  };

  const setIsLoading = useContext(setIsLoadingContext);
  const areAllCompleted = useMemo(() => activeTodos?.length, [activeTodos]);

  const handleOnClickToggleAll = useCallback(async () => {
    const results = [];

    if (allTodos) {
      for (const todo of allTodos) {
        if (activeTodos
            && activeTodos.length !== allTodos.length
            && activeTodos.length > 0
        ) {
          results.push(updateTodo(todo.id, { completed: true }));
        } else if (activeTodos?.length === 0) {
          results.push(updateTodo(todo.id, { completed: false }));
        } else {
          results.push(updateTodo(todo.id, { completed: true }));
        }
      }

      if (user) {
        await Promise.all(results);
        await loadUserTodos();
      }
    }
  }, [allTodos, activeTodos]);

  const handleAddTodo = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() === '') {
      setErrorWithTimer(ErrorStatus.EmptyTitle);
    }

    if (user && currentInput.trim().length > 0) {
      setIsLoading([0]);
      await addTodo(newTodo)
        .catch(() => {
          setErrorWithTimer(ErrorStatus.AddError);
        });
      await loadUserTodos();
      setIsLoading([]);
      setCurrentInput('');
    }
  }, [user, currentInput]);

  return (
    <header className="todoapp__header">
      {allTodos?.length !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !areAllCompleted },
          )}
          onClick={handleOnClickToggleAll}
        />
      ) }
      <form onSubmit={(e) => handleAddTodo(e)}>
        <input
          disabled={isLoading.length > 0}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={currentInput}
          onChange={(event) => setCurrentInput(event.target.value)}
        />
      </form>
    </header>
  );
};
