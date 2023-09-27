/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoRow } from './Components/TodoRow';
import { TodoHeader } from './Components/TodoHeader';
import { TodoFooter } from './Components/TodoFooter';
import { getFilteredTodo } from './utils/GetFilteredTodo';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodosCount, setActiveTodosCount] = useState<number>(0);
  const [isAnyTodoCompleted, setIsAnyTodoCompleted] = useState(false);
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<TodoStatus>(TodoStatus.All);
  const [inputFocus, setInputFocus] = useState(false);

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
    setActiveTodosCount(todos.filter(todo => todo.completed !== true).length);
    setIsAnyTodoCompleted(todos.some(todo => todo.completed === true));
  }, [todos]);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodo(todos, selectedStatus);
  }, [selectedStatus, todos]);

  const handleSelectedStatus = (filterLink: TodoStatus) => {
    setSelectedStatus(filterLink);
  };

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService
      .addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setInputFocus(true);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds((prevtodoIds) => [...prevtodoIds, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleRenameTodo = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds((prevtodoIds) => [...prevtodoIds, todo.id]);

    return todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      }).finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setProcessingTodoIds((prevtodoIds) => [...prevtodoIds, todo.id]);

    return todoService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      }).finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todo.id),
        );
      });
  };

  const handleClearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const isAllCompleted = todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleToggleAllTodo = () => {
    if (isAllCompleted) {
      todos.forEach(handleToggleTodo);
    } else {
      activeTodos.forEach(handleToggleTodo);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onTodoAdd={handleAddTodo}
          onTodoAddError={setErrorMessage}
          isAllCompleted={isAllCompleted}
          toggleAll={handleToggleAllTodo}
          todosLength={todos.length}
          inputFocus={inputFocus}
        />
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoRow
              todo={todo}
              key={todo.id}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              onTodoRename={(todoTitle) => handleRenameTodo(todo, todoTitle)}
              isProcessing={processingTodoIds.includes(todo.id)}
              toggleTodo={() => handleToggleTodo(todo)}
              onTodoRenameError={setErrorMessage}
            />
          ))}

          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {(todos.length !== 0) && (
          <TodoFooter
            todoStatus={selectedStatus}
            onStatusSelect={handleSelectedStatus}
            activeTodos={activeTodosCount}
            onClearCompleted={handleClearCompletedTodos}
            isAnyTodoCompleted={isAnyTodoCompleted}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
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
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage('');
          }}
        />
        {errorMessage}
      </div>
    </div>
  );
};
