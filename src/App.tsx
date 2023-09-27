import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import { Todo } from './types/Todo';
import { StatusState } from './types/StatusState';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import {
  UNABLE_ADD_TODO,
  UNABLE_DELETE_TODO,
  UNLOADED_TODO,
} from './utils/constans';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusTodo, setStatusTodo] = useState(StatusState.All);

  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleChangeFilter = (newElement: StatusState) => {
    setStatusTodo(newElement);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(UNLOADED_TODO);
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

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService.addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos:Todo[]) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(UNABLE_ADD_TODO);
        throw new Error(UNABLE_ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);
    todoService.deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage(UNABLE_DELETE_TODO);
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const CompletedTodosCount = todos.filter(({ completed }) => completed).length;

  const filteredTodos = todos.filter(todo => {
    switch (statusTodo) {
      case StatusState.Active:
        return !todo.completed;
      case StatusState.Completed:
        return todo.completed;
      case StatusState.All:
      default:
        return todo;
    }
  });

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);
    todoService
      .updateTodo({
        ...todo,
        title: newTodoTitle,
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
      })
      .finally(() => {
        setProcessingTodoIds(prevTodoIds => prevTodoIds
          .filter(id => id !== todo.id));
      });
  };

  const handleToogleTodo = (todo: Todo) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);
    todoService
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
        setErrorMessage('Unable to toogle a todo');
      })
      .finally(() => {
        setProcessingTodoIds(prevTodoIds => prevTodoIds
          .filter(id => id !== todo.id));
      });
  };

  const handleClearComletedTodo = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleToogleAllTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (isAllCompleted) {
      todos.forEach(handleToogleTodo);
    } else {
      activeTodos.forEach(handleToogleTodo);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onTodoAdd={handleAddTodo}
          onTodoAddError={setErrorMessage}
          isAllCompleted={isAllCompleted}
          onToogleAll={handleToogleAllTodos}
          setErrorMessage={setErrorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              isProcessing={processingTodoIds.includes(todo.id)}
              onTodoUpdate={(todoTitle) => handleUpdateTodo(todo, todoTitle)}
              onTodoToogle={() => handleToogleTodo(todo)}
              key={todo.id}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        { !!todos.length && (
          <TodoFooter
            todos={todos}
            CompletedTodosCount={CompletedTodosCount}
            statusTodo={statusTodo}
            handleClearComletedTodo={handleClearComletedTodo}
            handleChangeFilter={handleChangeFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseMessage={setErrorMessage}
      />
    </div>
  );
};
