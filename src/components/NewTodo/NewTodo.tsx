/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import {
  useMemo,
  useContext,
  SetStateAction,
  Dispatch,
} from 'react';
import { addTodo, getTodos } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';
import { ErrorStatus } from '../../types/errorStatus';

interface Props {
  newTodoField: React.LegacyRef<HTMLInputElement> | undefined,
  activeTodos: Todo[] | null,
  allTodos: Todo[] | null,
  setVisibleTodos: Dispatch<SetStateAction<Todo[] | null>>,
  currentInput: string,
  setCurrentInput: Dispatch<SetStateAction<string>>,
  setErrorWithTimer: (message: string) => void,
  isLoading: string,
  setIsLoading: Dispatch<SetStateAction<string>>,
}

export const NewTodo: React.FC<Props> = (props) => {
  const {
    newTodoField,
    activeTodos,
    allTodos,

    setVisibleTodos,
    currentInput,
    setCurrentInput,
    setErrorWithTimer,
    isLoading,
    setIsLoading,
  } = props;

  const user = useContext(AuthContext);

  const newTodo = {
    title: currentInput,
    userId: user?.id,
    completed: false,
  };

  const areAllCompleted = useMemo(() => activeTodos?.length, [activeTodos]);

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
        />
      ) }
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading('Adding');
          if (currentInput === '') {
            setErrorWithTimer(ErrorStatus.EmptyTitle);
          }

          if (user && currentInput.length > 0) {
            addTodo(user.id, newTodo)
              .then(() => getTodos(user.id))
              .then(userTodos => {
                setVisibleTodos(userTodos);
                setIsLoading('');
                setCurrentInput('');
              })
              .catch(() => {
                setErrorWithTimer(ErrorStatus.AddError);
                setIsLoading('');
              });
          }
        }}
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
