import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import classnames from 'classnames';
import { Errors } from '../../types/Errors';
import { addTodo } from '../../api/todos';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';
import {
  useActiveTodos,
  useCompleteTodos,
  useOnFilteredStatusHandler,
} from '../../hooks/hooks';
import { TodosContext, TodosContextType } from '../Context/TodosContext';

interface HeaderProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  loadingTodosFromServer: () => Promise<void>;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
}
export const Header: FunctionComponent<HeaderProps> = ({
  title,
  setTitle,
  isAdding,
  setIsAdding,
  setErrorMessage,
  loadingTodosFromServer,
  setSelectedTodosId,
}) => {
  const user = useContext<User | null>(AuthContext);
  const { todos, setTodos } = useContext(TodosContext) as TodosContextType;

  const newTodoField = useRef<HTMLInputElement>(null);
  const activeTodos = useActiveTodos(todos);
  const completedTodos = useCompleteTodos(todos);
  const onFilterStatusHandler = useOnFilteredStatusHandler(
    setTodos, setErrorMessage, setSelectedTodosId,
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    [],
  );

  const onSubmitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(Errors.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadingTodosFromServer();
        } catch {
          setErrorMessage(Errors.Adding);
        } finally {
          setIsAdding(false);
        }
      } else {
        setErrorMessage(Errors.Title);
      }

      setTitle('');
    }, [title, user],
  );

  const todosToggle = completedTodos.length < todos.length
    ? activeTodos
    : todos;

  const toggleAllHandler = useCallback(
    async () => {
      await Promise.all(todosToggle.map(todo => (
        onFilterStatusHandler(todo)
      )));
    }, [todosToggle],
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggleButton"
          data-cy="ToggleAllButton"
          type="button"
          className={classnames('todoapp__toggle-all', {
            active: !activeTodos.length,
          })}
          onClick={toggleAllHandler}
        />
      )}

      <form onSubmit={onSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChangeHandler}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
