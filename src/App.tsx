import React, { useEffect, useRef, useState } from 'react';
import './styles/todoapp.scss';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { Todo } from './types/Todo';
import { ErrorState } from './types/ErrorState';
import { Filter } from './enums/Filter';
import { ErrorMessages } from './enums/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userInput, setUserInput] = useState('');
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [errorState, setErrorState] = useState<ErrorState>({
    message: ErrorMessages.NoError,
    isVisible: false,
  });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[] | null>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getPreparedTodos = (type: Filter): Todo[] => {
    let preparedTodos = [...todos];

    if (type) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (type) {
          case Filter.Active:
            return !todo.completed;
          case Filter.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
    }

    return preparedTodos;
  };

  useEffect(() => {
    const loadTodos = async () => {
      setErrorState({
        message: ErrorMessages.NoError,
        isVisible: false,
      });

      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorState({
          message: ErrorMessages.LoadTodo,
          isVisible: true,
        });
      }
    };

    loadTodos();
  }, []);

  const preparedTodos = getPreparedTodos(filterType);

  const hasTodos = todos.length > 0;

  const countActiveTodos = () => {
    let count = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        count++;
      }
    });

    return count;
  };

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleDelete = async (todoId: number) => {
    await deleteTodo(todoId);

    setTodos(currentTodos => {
      return currentTodos.filter(currentTodo => currentTodo.id !== todoId);
    });
  };

  const handleToggle = async (todoId: number, completed: boolean) => {
    await updateTodoStatus(todoId, completed);

    setTodos(currentTodos => {
      return currentTodos.map(currentTodo =>
        currentTodo.id === todoId ? { ...currentTodo, completed } : currentTodo,
      );
    });
  };

  const handleToggleAll = async () => {
    const newCompleted = !todos.every(todo => todo.completed);

    await Promise.allSettled(
      todos
        .filter(todo => todo.completed !== newCompleted)
        .map(todo => handleToggle(todo.id, newCompleted)),
    );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const todosToRemoveIds = completedTodos.map(todo => todo.id);
    const todosToRemove = completedTodos.map(todo => deleteTodo(todo.id));

    setTodosToDelete(todosToRemoveIds);

    try {
      const deletionResult = await Promise.allSettled(todosToRemove);

      let hasError = false;

      const successfulIds = deletionResult
        .map((deletion, index) => {
          if (deletion.status === 'fulfilled') {
            return completedTodos[index].id;
          } else {
            hasError = true;

            return false;
          }
        })
        .filter(success => success !== false);

      setTodos(currentTodos =>
        currentTodos.filter(currentTodo => {
          return !successfulIds.includes(currentTodo.id);
        }),
      );

      if (hasError) {
        setErrorState({
          message: ErrorMessages.DeleteTodo,
          isVisible: true,
        });
      }
    } finally {
      setTodosToDelete(null);
    }
  };

  const handleTitleUpdate = async (todoId: number, title: string) => {
    await updateTodoTitle(todoId, title);

    setTodos(currentTodos => {
      return currentTodos.map(currentTodo =>
        currentTodo.id === todoId ? { ...currentTodo, title } : currentTodo,
      );
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          userInput={userInput}
          onFieldChange={setUserInput}
          onError={setErrorState}
          onCreateTodo={setTempTodo}
          onCreateTodoSuccess={setTodos}
          onToggleAll={handleToggleAll}
          newTodoField={newTodoField}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          onTodoDelete={handleDelete}
          onTodoToggle={handleToggle}
          onTodoTitleUpdate={handleTitleUpdate}
          onError={setErrorState}
          todosToDelete={todosToDelete}
          newTodoField={newTodoField}
        />

        {hasTodos && (
          <TodoFooter
            activeTodos={countActiveTodos()}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            hasCompletedTodos={hasCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <TodoErrorNotification errorState={errorState} onHide={setErrorState} />
    </div>
  );
};
