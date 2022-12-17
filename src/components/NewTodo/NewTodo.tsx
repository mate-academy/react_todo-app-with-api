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
  getTodos,
  updateTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';
import { ErrorStatus } from '../../types/errorStatus';

interface Props {
  newTodoField: React.LegacyRef<HTMLInputElement> | undefined,
  activeTodos: Todo[] | null,
  allTodos: Todo[] | null,
  currentInput: string,
  setCurrentInput: Dispatch<SetStateAction<string>>,
  setErrorWithTimer: (message: string) => void,
  isLoading: string,
  setIsLoading: Dispatch<SetStateAction<string>>,
  setAllTodos: Dispatch<SetStateAction<Todo[] | null>>,
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
    setIsLoading,
    setAllTodos,
  } = props;

  const user = useContext(AuthContext);

  const newTodo = {
    title: currentInput,
    userId: user?.id,
    completed: false,
  };

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
        const newTodos: Todo[] = await getTodos(user.id);

        setAllTodos(newTodos);
      }
    }
  }, [allTodos, activeTodos]);

  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput === '') {
      setErrorWithTimer(ErrorStatus.EmptyTitle);
    }

    if (user && currentInput.length > 0) {
      setIsLoading('Adding');
      addTodo(user.id, newTodo)
        .then(() => getTodos(user.id))
        .then(userTodos => {
          setAllTodos(userTodos);
          setIsLoading('');
          setCurrentInput('');
        })
        .catch(() => {
          setIsLoading('');
          setErrorWithTimer(ErrorStatus.AddError);
        });
    }
  }, [user, currentInput]);

  return (
    <header className="todoapp__header">
      {(allTodos?.length !== 0) && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            { 'todoapp__toggle-all': true },
            { active: !areAllCompleted },
          )}
          onClick={handleOnClickToggleAll}
        />
      ) }
      <form
        onSubmit={(e) => handleAddTodo(e)}
      >
        <input
          disabled={isLoading.length > 0}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={currentInput}
          onChange={(event) => {
            setCurrentInput(event.target.value);
          }}

        />
      </form>
    </header>
  );
};
