import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { TodoList } from '../TodoList';
import { apiClient } from '../../api/todos';
import { useTodosContext } from '../store';
import { ErrorOption } from '../../enum/ErrorOption';
import { TodoFooter } from '../TodoFooter';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { ErrorNotification } from '../ErrorNotification';

const USER_ID = 12027;

export const TodoApp: React.FC = () => {
  const {
    todos,
    addTodo,
    setError,
    recieveTodos,
    resetHasError,
    toggleAllTodoCondition,
  } = useTodosContext();

  const [inputValue, setInputValue] = useState('');
  const [isPostRequest, setIsPostRequest] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    resetHasError();

    apiClient.getTodos(USER_ID)
      .then(todosFromServer => {
        recieveTodos(todosFromServer);
      })
      .catch(() => setError(ErrorOption.RecivingError));
  }, [resetHasError, recieveTodos, setError]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setError(ErrorOption.TitleError);

      return;
    }

    setIsPostRequest(true);

    const newTodo = {
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    apiClient.postTodo(newTodo)
      .then(newTodoFromServer => {
        addTodo(newTodoFromServer);
        setInputValue('');

        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setError(ErrorOption.AddTodoError);
      })
      .finally(() => {
        setIsPostRequest(false);
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="toggleAll"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={toggleAllTodoCondition}
          />

          <form onSubmit={onSubmitForm}>
            <input
              data-cy="NewTodoField"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isPostRequest}
            />
          </form>
        </header>

        <TodoList />

        {!!tempTodo && (
          <TodoItem todo={tempTodo} />
        )}

        {todos.length > 0 && (
          <TodoFooter
            handlerErrors={
              (errMessage: ErrorOption) => setError(errMessage)
            }
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
