/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoRow } from './components/TodoRow';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { getFilteredTodo } from './utils/getFilteredTodo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<TodoStatus>(TodoStatus.All);
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    setLoading(true);

    todoService
      .getTodos()
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activeTodosCount = todos.filter(({ completed }) => !completed).length;
  const isAnyTodoCompleted = todos.some(({ completed }) => completed);

  const updateTodoInArray = (prevState: Todo[], updatedTodo: Todo) => (
    prevState.map((currentTodo: Todo) => (
      currentTodo.id !== updatedTodo.id
        ? currentTodo
        : updatedTodo
    ))
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
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
        ...todo,
        title: newTodoTitle,
      })
      .then(updatedTodo => {
        setTodos(prevState => updateTodoInArray(prevState, updatedTodo));
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
        setTodos(prevState => updateTodoInArray(prevState, updatedTodo));
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
          {loading ? (
            <div>Loading...</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoRow
                todo={todo}
                key={todo.id}
                onTodoDelete={() => handleDeleteTodo(todo.id)}
                onTodoRename={(todoTitle) => handleRenameTodo(todo, todoTitle)}
                isProcessing={processingTodoIds.includes(todo.id)}
                toggleTodo={() => handleToggleTodo(todo)}
                onTodoRenameError={setErrorMessage}
              />
            ))
          )}

          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        {!!todos.length && (
          <TodoFooter
            todoStatus={selectedStatus}
            onStatusSelect={handleSelectedStatus}
            activeTodos={activeTodosCount}
            onClearCompleted={handleClearCompletedTodos}
            isAnyTodoCompleted={isAnyTodoCompleted}
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
