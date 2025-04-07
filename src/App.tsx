/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef, useState } from 'react';

import './styles/todoapp.scss';

import { Todo } from './types/Todo';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { FilterType } from './types/FilterType';
import { todosService, USER_ID } from './api/todos';

import { TodoItem } from './components/TodoItem';
import { ErrorMessages } from './types/ErrorMessages';
import classNames from 'classnames';
import { TodoInput } from './components/TodoInput/TodoInput';

export const App = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const currentInputElementRef = useRef<HTMLInputElement | null>(null);
  const [currentFilter, setCurrentFilter] = useState(FilterType.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToLoading, setTodosToLoading] = useState<Todo[]>([]);

  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);

  const getFilteredTodos = () => {
    switch (currentFilter) {
      case FilterType.Active:
        return todoList.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  };

  const getActiveTodoCount = () => {
    return todoList.filter(todo => !todo.completed).length;
  };

  const hasComplitedTodos = () => {
    if (todoList.length === 0) {
      return true;
    }

    return todoList.some(todo => todo.completed);
  };

  const handleSetInputElement = (newInputElement: HTMLInputElement | null) => {
    currentInputElementRef.current = newInputElement;
  };

  const callFocus = () => {
    const element = currentInputElementRef.current;

    if (element) {
      setTimeout(() => {
        element.focus();
      }, 0);
    }
  };

  const processSuccessfulTodos = async (
    todos: Todo[],
    serviceCall: (t: Todo) => Promise<unknown>,
    message: ErrorMessages,
  ) => {
    const results = await Promise.allSettled(
      todos.map(todoToRemove => {
        return serviceCall(todoToRemove);
      }),
    );

    const failedTodos = results
      .map((result, i) => (result.status === 'rejected' ? todos[i] : null))
      .filter(Boolean);

    if (failedTodos.length) {
      setErrorMessage(message);
    }

    return todos.filter(todo => !failedTodos.includes(todo));
  };

  const onAddTodo = async (title: string) => {
    const newTodo: Todo = {
      id: 0,
      title: title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo });

    try {
      const requestResult = await todosService.add(newTodo);

      setTempTodo(null);
      setTodoList(current => [...current, requestResult]);

      return requestResult;
    } catch {
      setErrorMessage(ErrorMessages.addError);
      setTempTodo(null);

      return null;
    } finally {
      callFocus();
    }
  };

  const onRemoveTodo = async (todoToRemove: Todo) => {
    setTodosToLoading(prev => [...prev, todoToRemove]);

    try {
      await todosService.remove(todoToRemove);
      setTodoList(prev => prev.filter(todo => todo.id !== todoToRemove.id));
    } catch {
      setErrorMessage(ErrorMessages.deleteError);
    } finally {
      callFocus();
    }
  };

  const removeAllComplited = async () => {
    const todosToRemove = todoList.filter(todo => todo.completed);

    setTodosToLoading(todosToRemove);
    const successTodosRequest = await processSuccessfulTodos(
      todosToRemove,
      todosService.remove,
      ErrorMessages.deleteError,
    );

    setTodosToLoading([]);
    setTodoList(prev =>
      prev.filter(todo => !successTodosRequest.includes(todo)),
    );
    callFocus();
  };

  const onUpdateTodo = async (newTodo: Todo) => {
    setTodosToLoading(prev => [...prev, newTodo]);
    try {
      const updatedTodo = await todosService.update(newTodo);

      setTodoList(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessages.updateError);
      throw new Error();
    } finally {
      setTodosToLoading([]);
    }
  };

  const isToggleAll = () => {
    return todoList.every(todo => todo.completed);
  };

  const onToggleAll = async () => {
    const shouldComplete = todoList.some(todo => !todo.completed);

    const todosToUpdate = todoList
      .filter(todo => (shouldComplete ? !todo.completed : todo.completed))
      .map(todo => ({
        ...todo,
        completed: shouldComplete,
      }));

    setTodosToLoading(todosToUpdate);
    const successTodosRequest = await processSuccessfulTodos(
      todosToUpdate,
      todosService.update,
      ErrorMessages.updateError,
    );

    setTodosToLoading([]);
    setTodoList(prev =>
      prev.map(todo => {
        const updated = successTodosRequest.find(item => item.id === todo.id);

        return updated || todo;
      }),
    );
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await todosService.getAll();

        setTodoList(todos);
      } catch {
        setErrorMessage(ErrorMessages.getError);
      }
    };

    fetchTodos();
    callFocus();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todoList.length !== 0 && (
            <button
              onClick={() => onToggleAll()}
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isToggleAll(),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <TodoInput
            onAddTodo={onAddTodo}
            setErrorMessage={(message: ErrorMessages) =>
              setErrorMessage(message)
            }
            setCurrentInputElement={handleSetInputElement}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todoList={getFilteredTodos()}
            onRemoveTodo={onRemoveTodo}
            onUpdateTodo={onUpdateTodo}
            todosToLoading={todosToLoading}
          />
          {tempTodo && (
            <TodoItem key={tempTodo.id} todo={tempTodo} isLoading={true} />
          )}
        </section>

        {todoList.length !== 0 && (
          <>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {getActiveTodoCount() + ' items left'}
              </span>
              <TodoFilter
                selectedFilter={currentFilter}
                onFilterChange={newFilter => setCurrentFilter(newFilter)}
              />
              <button
                onClick={() => removeAllComplited()}
                type="button"
                className="todoapp__clear-completed"
                disabled={!hasComplitedTodos()}
                data-cy="ClearCompletedButton"
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        removeError={() => setErrorMessage(null)}
      />
    </div>
  );
};
