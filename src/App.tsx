import { useEffect, useMemo, useState } from 'react';

import { ErrorMessage, Status, Todo } from './types';
import * as todoService from './api';
import {
  Header,
  ToggleAllButton,
  NewTodo,
  TodoList,
  TodoItem,
  Footer,
  TodoCounter,
  TodoFilter,
  ClearCompletedButton,
  ErrorNotification,
} from './components';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterValue, setFilterValue] = useState(Status.All);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const clearErrorMessage = () => {
    setErrorMessage(ErrorMessage.None);
  };

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      clearErrorMessage();
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  const handleAddTodo = (title: string) => {
    clearErrorMessage();
    setTempTodo({
      id: 0,
      userId: 0,
      title,
      completed: false,
    });

    return todoService.createTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);

        throw new Error(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    clearErrorMessage();
    setProcessingIds(currentIds => [...currentIds, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(({ id }) => id !== todoId);
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setProcessingIds(currentIds => {
          return currentIds.filter(id => id !== todoId);
        });
      });
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(({ id }) => handleDeleteTodo(id));
  };

  const handleToggleTodo = (todo: Todo) => {
    clearErrorMessage();
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    todoService.toggleTodo(todo.id, todo.completed)
      .then((updatedTodo) => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => (
            updatedTodo.id === currentTodo.id
              ? updatedTodo
              : currentTodo
          ));
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setProcessingIds(currentIds => {
          return currentIds.filter(id => id !== todo.id);
        });
      });
  };

  const handleToggleAllTodos = () => {
    const hasActive = todos.some(({ completed }) => !completed);

    todos.forEach(todo => {
      if (hasActive && todo.completed) {
        return;
      }

      handleToggleTodo(todo);
    });
  };

  const handleUpdateTodo = (todo: Todo, title: string) => {
    clearErrorMessage();
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    if (!title) {
      return todoService.deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(({ id }) => id !== todo.id);
          });
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.DeleteTodo);

          throw new Error(ErrorMessage.DeleteTodo);
        })
        .finally(() => {
          setProcessingIds(currentIds => {
            return currentIds.filter(id => id !== todo.id);
          });
        });
    }

    return todoService.updateTodo(todo.id, title)
      .then((updatedTodo) => {
        setTodos(currentTodos => {
          return currentTodos.map(currentTodo => (
            updatedTodo.id === currentTodo.id
              ? updatedTodo
              : currentTodo
          ));
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);

        throw new Error(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setProcessingIds(currentIds => {
          return currentIds.filter(id => id !== todo.id);
        });
      });
  };

  const hasTodos = todos.length > 0 || tempTodo;
  const hasCompletedTodos = todos.some(({ completed }) => completed);
  const isAllCompleted = todos.every(({ completed }) => completed);
  const activeTodosCount = todos.filter(({ completed }) => !completed).length;
  const totalTodoCount = todos.length;

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filterValue) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      case Status.All:
      default:
        return true;
    }
  }), [todos, filterValue]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header>
          {hasTodos && (
            <ToggleAllButton
              active={isAllCompleted}
              onToggleAll={handleToggleAllTodos}
            />
          )}

          <NewTodo
            refocus={totalTodoCount}
            onAdd={handleAddTodo}
            onError={setErrorMessage}
          />
        </Header>

        {hasTodos && (
          <>
            <TodoList>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  onToggle={handleToggleTodo}
                  onUpdate={handleUpdateTodo}
                  processing={processingIds.includes(todo.id)}
                />
              ))}

              {tempTodo && (
                <TodoItem todo={tempTodo} processing />
              )}
            </TodoList>

            <Footer>
              <TodoCounter value={activeTodosCount} />

              <TodoFilter
                value={filterValue}
                onValueChange={setFilterValue}
              />

              <ClearCompletedButton
                active={hasCompletedTodos}
                onClear={handleClearCompletedTodos}
              />
            </Footer>
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onHide={clearErrorMessage}
      />
    </div>
  );
};
