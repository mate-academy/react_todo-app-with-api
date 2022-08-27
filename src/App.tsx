/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { DispatchContext } from './components/StateContext';
import { TodoList } from './components/TodoList';
import { Maybe } from './types/Maybe';
import { Todo, UpdateTodoframent } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const user = useContext(AuthContext) as User;

  const [todos, setTodos] = useState<Maybe<Todo[]>>(null);

  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    getTodos(user.id)
      .then(loadedTodos => setTodos(loadedTodos));
  }, []);

  const onDelete = useCallback((todoId: number) => {
    setTodos((prev) => {
      if (prev) {
        return prev.filter((todo) => todo.id !== todoId);
      }

      return prev;
    });
  }, []);

  const onAdd = useCallback((newTodo: Todo) => {
    setTodos((prev) => {
      if (prev) {
        return [...prev, newTodo];
      }

      return prev;
    });
  }, []);

  const onUpdate = useCallback((todoId: number, data: UpdateTodoframent) => {
    setTodos((prev) => {
      if (prev) {
        return prev.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              ...data,
            };
          }

          return todo;
        });
      }

      return prev;
    });
  }, []);

  const toggleCompletedAll = useCallback((isAllCompleted: boolean) => {
    todos?.forEach(todo => {
      const data = { completed: isAllCompleted };

      dispatch({ type: 'startSave', peyload: '' });

      updateTodo(todo.id, data)
        .then(res => {
          if (res) {
            onUpdate(todo.id, data);
          }
        })
        .finally(() => dispatch({ type: 'finishSave', peyload: '' }));
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={onAdd} toggleCompletedAll={toggleCompletedAll} />

        <TodoList
          todos={todos}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};
