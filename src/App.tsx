import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoRow } from './components/TodoRow';
import { TodoHeader } from './components/TodoHeader';
import { Status } from './types/Status';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';
import { getFilteredTodos } from './utils/functions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filterTodosIds = (newId: number) => {
    setProcessingTodoIds(prevTodoIds => prevTodoIds
      .filter(id => id !== newId));
  };

  const setNewIds = (newId: number) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, newId]);
  };

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService
      .addTodos(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setNewIds(todoId);

    todoService
      .deleteTodos(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        filterTodosIds(todoId);
      });
  };

  const currentOrUpdeted = (current: Todo, updated: Todo) => {
    return current.id !== updated.id ? current : updated;
  };

  const handleRenameTodo = (todo: Todo, newTodoTitle: string) => {
    setNewIds(todo.id);

    todoService
      .updateTodo({
        ...todo,
        title: newTodoTitle,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => {
          return currentOrUpdeted(currentTodo, updatedTodo);
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        filterTodosIds(todo.id);
      });
  };

  const handleChangeStatusTodo = (todo: Todo) => {
    setNewIds(todo.id);

    todoService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => {
          return currentOrUpdeted(currentTodo, updatedTodo);
        }));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        filterTodosIds(todo.id);
      });
  };

  const handleClearCompletedTodos = () => {
    const filteredTodos = todos
      .filter(todo => todo.completed);

    Promise.all(filteredTodos.map(todo => {
      return handleDeleteTodo(todo.id);
    }));
  };

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  const handleFilterStatus = (todosFilter: Status) => (
    setStatus(todosFilter));

  const allTodosCount = todos.length;
  const completedTodosCount = todos.filter(({ completed }) => completed).length;
  const isAllTodosCompleted = allTodosCount === completedTodosCount;

  const handleChangeStatusTodos = () => {
    let filteredTodos = todos;

    if (isAllTodosCompleted) {
      filteredTodos = todos.filter(({ completed }) => !completed);
    }

    Promise.all(filteredTodos.map(todo => {
      return handleChangeStatusTodo(todo);
    }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleAddTodo}
          onTodoAddError={setErrorMessage}
          isAllTodosCompleted={isAllTodosCompleted}
          onTodosChangeStatus={handleChangeStatusTodos}
          todos={visibleTodos}
          isTodosHere={Boolean(allTodosCount)}
          setErrorMessage={setErrorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            return (
              <TodoRow
                todo={todo}
                key={todo.id}
                onTodoDelete={() => handleDeleteTodo(todo.id)}
                onTodoRename={(todoTitle) => handleRenameTodo(todo, todoTitle)}
                onTodoChangeStatus={() => handleChangeStatusTodo(todo)}
                isProcessing={processingTodoIds.includes(todo.id)}
              />
            );
          })}

          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>
        {Boolean(todos.length) && (
          <TodoFooter
            todos={todos}
            completedTodosCount={completedTodosCount}
            status={status}
            handleClearCompletedTodos={handleClearCompletedTodos}
            handleFilterStatus={handleFilterStatus}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
