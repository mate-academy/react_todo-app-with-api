/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string>(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoIds, setLoadedTodoIds] = useState<number[]>([]);

  const shouldFocusCreationForm = useRef(false);

  const handleError = (message: Errors) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const withLoading = async (
    todoId: number,
    asyncCallback: () => Promise<void>,
    errorText: Errors,
    options: { focusAfter?: boolean } = {},
  ) => {
    setLoadedTodoIds(current => [...current, todoId]);

    try {
      await asyncCallback();
    } catch (error) {
      handleError(errorText);
      throw error;
    } finally {
      setLoadedTodoIds(current => current.filter(id => id !== todoId));
      if (options.focusAfter) {
        shouldFocusCreationForm.current = true;
      }
    }
  };

  const updateTodoFields = async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    await updateTodo(todoId, fieldsToUpdate);
    setTodos(current =>
      current.map(todo =>
        todo.id === todoId ? { ...todo, ...fieldsToUpdate } : todo,
      ),
    );
  };

  const removeTodoById = async (todoId: number) => {
    await deleteTodo(todoId);
    setTodos(current => current.filter(todo => todo.id !== todoId));
  };

  const handleCreateTodo = async (title: string) => {
    if (!title.trim()) {
      handleError(Errors.EMPTY);
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

    try {
      const todo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, todo]);
      setNewTodoTitle('');
    } catch {
      handleError(Errors.ADD);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
      shouldFocusCreationForm.current = true;
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    return withLoading(todoId, () => removeTodoById(todoId), Errors.DELETE, {
      focusAfter: true,
    });
  };

  const handleToggleTodo = (todoId: number, completed: boolean) => {
    return withLoading(
      todoId,
      () => updateTodoFields(todoId, { completed }),
      Errors.UPDATE,
    );
  };

  const handleUpdateTodoTitle = (
    todoId: number,
    title: string,
  ): Promise<void> => {
    if (title.length === 0) {
      return handleDeleteTodo(todoId);
    }

    return withLoading(
      todoId,
      () => updateTodoFields(todoId, { title }),
      Errors.UPDATE,
    );
  };

  const filteredTodos = useMemo(
    () => filter(todos, filterBy),
    [todos, filterBy],
  );

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        handleError(Errors.LOAD);
      });
  }, []);

  useEffect(() => {
    shouldFocusCreationForm.current = false;
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
