/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import * as todoService from './api/todos';
import { USER_ID } from './api/Personal_Id';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [visible, setVisible] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const completedTodosCount = todos.reduce((acc, todo) => {
    return todo.completed ? acc + 1 : acc;
  }, 0);

  const hasCompleted = todos.every(todo => todo.completed);

  const activeTodosCount = todos.length - completedTodosCount;

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      case Status.All:
      default:
        return true;
    }
  });

  const resetAddTodoState = () => {
    setTempoTodo(null);
    setTitle('');
    setDisableInput(false);
  };

  const createTempTodo = () => ({
    id: 0,
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });

  const handleSubmit = (todoTitle: string) => {
    const trimmedTitle = todoTitle.trim();
    const tempTodo = createTempTodo();

    setTempoTodo(tempTodo);

    setDisableInput(true);

    if (!trimmedTitle) {
      setErrorMessage("Title can't be empty");

      return;
    }

    setTimeout(() => {
      todoService
        .addTodos(tempTodo)
        .then((newTodo) => setTodos([...todos, newTodo]))
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => resetAddTodoState());
    }, 500);
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId([todoId]);

    todoService.deletePost(todoId)
      .then(() => setTodos([
        ...todos.filter(todo => todo.id !== todoId),
      ]))
      .catch(() => setErrorMessage('Unable to delete the todo'));
  };

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoadingTodoId(completedTodoIds);

    Promise.all(
      completedTodos.map(todo => (
        todoService.deletePost(todo.id)
      )),
    )
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
      })
      .finally(() => setLoadingTodoId([]));
  }, [todos]);

  const toggleTodoStatus = async (todoId: number, completed: boolean) => {
    try {
      setLoadingTodoId([todoId]);
      await todoService.updatePostStatus(todoId, completed);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? { ...todo, completed } : todo),
      ));
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoId([]);
    }
  };

  const handleToggleTodosAll = async (completed: boolean) => {
    const todosIds = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    try {
      setLoadingTodoId(todosIds);

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed,
      }));

      setTodos(updatedTodos);

      await Promise.all(
        todos.map(todo => todoService.updatePostStatus(todo.id, completed)),
      );
    } catch {
      setErrorMessage('Unable to update a todos');
    } finally {
      setLoadingTodoId([]);
    }
  };

  const handleEditTodo = async (todoId: number, newTitle: string) => {
    if (!newTitle) {
      setErrorMessage('Title can`t be empty');

      return;
    }

    try {
      setLoadingTodoId([todoId]);
      const updatedTodo = await todoService.updateTodoTitle(todoId, newTitle);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? updatedTodo : todo),
      ));
    } catch {
      setErrorMessage('Title can`t be empty');
    } finally {
      setLoadingTodoId([]);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load a todo'));

    setTimeout(() => {
      setVisible(true); // Set to true to trigger the transition
    }, 1000);
  }, []);

  if (!USER_ID) {
    return (
      <UserWarning />
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div
        className={classNames('todoapp__content', {
          visible,
        })}
      >
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${hasCompleted ? 'active' : ''} `}
              onClick={() => handleToggleTodosAll(!hasCompleted)}
            />
          )}

          <form onSubmit={(e) => {
            handleSubmit(title);
            e.preventDefault();
          }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={disableInput}
            />
          </form>
        </header>

        {(todos.length > 0 || tempoTodo) && (
          <div
            className={classNames('todo-list', {
              visible,
            })}
          >

            <TodoList
              todos={visibleTodos}
              deleteTodo={deleteTodo}
              tempoTodo={tempoTodo}
              uptadeTodoStatus={toggleTodoStatus}
              loadingTodoId={loadingTodoId}
              onChangeTodoTitle={handleEditTodo}
            />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodosCount} items left`}
              </span>

              <nav className="filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: status === Status.All,
                  })}
                  onClick={() => setStatus(Status.All)}

                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: status === Status.Active,
                  })}
                  onClick={() => setStatus(Status.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: status === Status.Completed,
                  })}
                  onClick={() => setStatus(Status.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className={classNames('todoapp__clear-completed', {
                  'todoapp__clear-completed--hidden': completedTodosCount === 0,
                })}
                onClick={handleClearCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </div>
        )}
      </div>

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
