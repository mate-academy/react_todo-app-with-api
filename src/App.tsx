import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { SelectFilter } from './utils/SelectFilter';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/ErrorMessages';
import * as ApiServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoRow } from './components/TodoRow';
import FilterBar from './components/FilterBar';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState(SelectFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const isEveryCompleted = useMemo(() => todos.every(todo => todo.completed), [todos]);

  const isAnyCompleted = useMemo(() => todos.some(todo => todo.completed), [todos]);

  const activeTodosCounter = useMemo(() => {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    return activeTodos;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterOption) {
        case SelectFilter.Active:
          return !todo.completed;
        case SelectFilter.Completed:
          return todo.completed;
        case SelectFilter.All:
        default:
          return true;
      }
    });
  }, [todos, filterOption]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    ApiServices.getTodos()
      .then(setTodos)
      .catch((error: Error) => {
        setErrorMessage(ErrorMessage.UnableLoad);
        console.log(error.message);
      });
  }, []);

  const handleTodoAdd = (newTodoTitle: string) => {
    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      return;
    }

    setTempTodo({
      id: 0,
      title: newTodoTitle,
      userId: 0,
      completed: false,
    });

    ApiServices.addTodo(newTodoTitle.trim())
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableAdd);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleTodoDelete = (todoId: number) => {
    setProcessingTodoIds(prevState => [...prevState, todoId]);

    ApiServices.deleteTodo(todoId)
      .then(() => {
        setErrorMessage('');
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setProcessingTodoIds(prevState => prevState.filter(id => id !== todoId));
      });
  };

  const handleTodoRename = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    ApiServices.updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState =>
          prevState.map(currentTodo =>
            currentTodo.id !== updatedTodo.id ? currentTodo : updatedTodo
          )
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevState => prevState.filter(id => id !== todo.id));
      });
  };

  const handleTodoToggle = (todo: Todo) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    ApiServices.updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState =>
          prevState.map(currentTodo =>
            currentTodo.id !== updatedTodo.id ? currentTodo : updatedTodo
          )
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UnableUpdate);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(prevState => prevState.filter(id => id !== todo.id));
      });
  };

  const handleClearCompletedTodos = () => {
    const todosToDelete = todos.filter(todo => todo.completed);
    todosToDelete.forEach(todo => handleTodoDelete(todo.id));
  };

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isEveryCompleted,
    }));
    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleTodoAdd}
          isToggleActive={isEveryCompleted}
          isAnyTodos={Boolean(todos.length)}
          onToggleAllClick={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleTodoDelete(todo.id)}
              onTodoRename={todoTitle => handleTodoRename(todo, todoTitle)}
              onTodoToggle={() => handleTodoToggle(todo)}
              isProcessing={processingTodoIds.includes(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoRow todo={tempTodo} isProcessing />
          )}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCounter} items left`}
            </span>

            <FilterBar filterOption={filterOption} onFilterChange={setFilterOption} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompletedTodos}
              disabled={!isAnyCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
