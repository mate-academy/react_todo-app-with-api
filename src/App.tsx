import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { StatusFilter } from './types/StatusFilter';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import * as todoService from './api/todos';
import { getFilterTodos } from './utils/getFilterTodos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

const USER_ID = 11465;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [todoError, setTodoError] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([0]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);

    todoService.getTodos(USER_ID)
      .then(todoFromServer => {
        setTodos(todoFromServer);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(error);
        setTodoError(ErrorType.GetData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!todoError) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setTodoError(null);
    }, 3000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [todoError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilterTodos(todos, status);
  const countActiveTodos = todos
    .filter(todo => todo.completed === false)
    .length;
  const countCompletedTodos = todos
    .filter(todo => todo.completed)
    .length;

  const handleStatusChange = (filteredKey: StatusFilter) => {
    setStatus(filteredKey);
  };

  const showError = (error: ErrorType) => {
    setTodoError(error);
  };

  const handleSubmit = (newTitle: string) => {
    if (!newTitle.trim()) {
      showError(ErrorType.Title);

      return;
    }

    const newTodo = {
      title: newTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    const temp: Todo = Object.assign(newTodo, { id: 0 });

    setTempTodo(temp);
    todoService.addTodo(newTodo)
      .then((createdTodo) => {
        setTodos((prevState) => [...prevState, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        showError(ErrorType.Add);
      })
      .finally(() => {
        setIsRequesting(false);
        setTempTodo(null);
      });

    setIsRequesting(true);
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds(prevState => [...prevState, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos((prevState) => {
          return prevState.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        return setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todoId));
      });
  };

  const handleStatusUpdate = (todo: Todo) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);
    todoService.updateTodo({
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    })
      .then(updatedTodo => setTodos(prevState => {
        return prevState.map(currentTodo => {
          return currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo;
        });
      }))
      .catch(() => {
        showError(ErrorType.Update);
      })
      .finally(() => {
        setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todo.id));
      });
  };

  const handleTitleUpdate = (todo: Todo, updatedTitle: string) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    return todoService.updateTodo({
      id: todo.id,
      title: updatedTitle,
      userId: USER_ID,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => {
          return prevState.map(currentTodo => {
            return currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo;
          });
        });
      })
      .catch((error) => {
        showError(ErrorType.Update);
        throw error;
      })
      .finally(() => {
        return setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todo.id));
      });
  };

  const handleClearCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleToggleTodo = () => {
    if (countCompletedTodos !== todos.length) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(handleStatusUpdate);
    } else {
      todos.forEach(handleStatusUpdate);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          newTodoTitle={newTodoTitle}
          isRequesting={isRequesting}
          countActiveTodos={countActiveTodos}
          addNewTodo={handleSubmit}
          handleToggleTodo={handleToggleTodo}
          setNewTodoTitle={setNewTodoTitle}
        />

        {!isLoading && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleStatusUpdate={handleStatusUpdate}
              handleTitleUpdate={handleTitleUpdate}
              processingTodoIds={processingTodoIds}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                handleDeleteTodo={handleDeleteTodo}
                handleStatusUpdate={handleStatusUpdate}
                handleTitleUpdate={handleTitleUpdate}
                isProcessing={processingTodoIds.includes(tempTodo.id)}
              />
            )}
            {!!todos.length && (
              <TodoFilter
                status={status}
                handleStatusChange={handleStatusChange}
                countActiveTodos={countActiveTodos}
                countCompletedTodos={countCompletedTodos}
                handleClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification todoError={todoError} setTodoError={setTodoError} />
    </div>
  );
};
