/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { addTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import { Loader } from './components/Loader';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const [userId, setUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = useCallback(
    (er: string) => {
      setErrorMessage(er);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      setUserId(user.id);

      setIsLoading(true);
      setErrorMessage('');

      getTodos(user.id)
        .then(setTodos)
        .catch(handleError)
        .finally(() => {
          setIsLoading(false);
          setIsUpdateNeeded(false);
        });
    }
  }, [user, isUpdateNeeded]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle) {
      handleError('Title can\'t be empty');

      return;
    }

    addTodo({
      title: newTodoTitle,
      userId,
      completed: false,
    }).then(() => setIsUpdateNeeded(true))
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => setNewTodoTitle(''));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && <Loader />}

      {todos.length > 0 && (
        <div className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />

            <form onSubmit={(event) => handleAddTodo(event)}>
              <input
                data-cy="NewTodoField"
                type="text"
                ref={newTodoField}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(event) => setNewTodoTitle(event.target.value)}
              />
            </form>
          </header>

          <section className="todoapp__main" data-cy="TodoList">
            {todos.map(todo => (
              <TodoItem
                todo={todo}
                key={todo.id}
                handleError={handleError}
                handleUpdate={setIsUpdateNeeded}
              />
            ))}

            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue="JS"
                />
              </form>

              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </section>

          <TodoFooter todos={todos} />
        </div>
      )}

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
