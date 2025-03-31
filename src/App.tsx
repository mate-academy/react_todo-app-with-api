/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import {
  addTodo,
  getTodos,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer';
import { ErrorModal } from './components/ErrorModal';
import { FilterBy } from './types/FilterBy';

const filter = (todos: Todo[], filterBy: FilterBy) => {
  switch (filterBy) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    case FilterBy.All:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoIds, setLoadedTodoIds] = useState<number[]>([]);

  const shouldFocusCreationForm = useRef(false);

  useEffect(() => {
    shouldFocusCreationForm.current = false;
  }, []);

  const handleCreateTodo = (title: string) => {
    if (!title.trim()) {
      setErrorMessage(Errors.EMPTY);

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    return addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADD);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        shouldFocusCreationForm.current = true;
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadedTodoIds(currentIds => [...currentIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.DELETE);
        throw error;
      })
      .finally(() => {
        setLoadedTodoIds(currentIds => currentIds.filter(id => id !== todoId));
        shouldFocusCreationForm.current = true;
      });
  };

  const handleToggleTodo = (todoId: number, completed: boolean) => {
    setLoadedTodoIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, { completed })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.UPDATE);
      })
      .finally(() => {
        setLoadedTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodoTitle = (
    todoId: number,
    title: string,
  ): Promise<void> => {
    if (title.length === 0) {
      return handleDeleteTodo(todoId);
    }

    setLoadedTodoIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, { title })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === todoId ? { ...todo, title } : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.UPDATE);
        throw error;
      })
      .finally(() => {
        setLoadedTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const filteredTodos = filter(todos, filterBy);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          createTodo={handleCreateTodo}
          isLoading={isLoading}
          handleToggleTodo={handleToggleTodo}
          shouldFocusCreationForm={shouldFocusCreationForm.current}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          loadedTodoIds={loadedTodoIds}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorModal
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(Errors.DEFAULT)}
      />
    </div>
  );
};
