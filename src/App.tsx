import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error as ErrorComponent } from './components/Error';
import { FieldForFiltering, Todo } from './types/Todo';
import { AddTodoForm } from './components/AddTodoForm';
import { ToggleAllButton } from './components/ToggleAllButton';
import { useError } from './utils/useError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fieldForFiltering, setFieldForFiltering]
    = useState<FieldForFiltering>(FieldForFiltering.All);
  const [isAdding, setIsAdding] = useState(false);
  const [changingTodosId, setChangingTodosId] = useState<number[]>([0]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });
  const {
    isError,
    addError,
    clearError,
    errorMessage,
  } = useError();

  const getTodosFromAPI = useCallback(async () => {
    clearError();
    if (!user) {
      return;
    }

    try {
      const todosFromAPI = await getTodos(user.id);

      setTodos(todosFromAPI);
      setChangingTodosId([0]);
    } catch {
      addError('ToDos can\'t be loaded');
    }
  }, []);

  useEffect(() => {
    getTodosFromAPI();
  }, []);

  const closeError = useCallback(() => {
    clearError();
  }, []);

  const selectFieldForFiltering = useCallback((
    fieldForFilter: FieldForFiltering,
  ) => {
    setFieldForFiltering(fieldForFilter);
  }, [fieldForFiltering]);

  const counterActiveTodos = useMemo(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    return todos.length - completedTodos.length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (fieldForFiltering) {
        case FieldForFiltering.Active:
          return !todo.completed;

        case FieldForFiltering.Completed:
          return todo.completed;

        case FieldForFiltering.All:
        default:
          return true;
      }
    });
  }, [todos, fieldForFiltering]);

  const hasTodos = todos.length > 0;

  const handleAddTodo = useCallback(async (title: string) => {
    if (!user) {
      return;
    }

    if (title.length === 0) {
      addError('Title can\'t be empty');

      return;
    }

    try {
      setTempTodo((prevTemp) => ({ ...prevTemp, title }));
      setIsAdding(true);
      await addTodo(user.id, { title, completed: false });
      await getTodosFromAPI();
    } catch {
      addError('Unable to add a todo');
      throw new Error('Unable to add a todo');
    } finally {
      setIsAdding(false);
    }
  }, []);

  const deleteOneTodo = useCallback(async (todoId: number) => {
    try {
      setChangingTodosId(prevDeleteTodos => [...prevDeleteTodos, todoId]);
      await deleteTodo(todoId);
    } catch {
      addError('Unable to delete a todo');
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    await deleteOneTodo(todoId);
    await getTodosFromAPI();
  }, []);

  const completedTodosId = useMemo(() => {
    return todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    if (completedTodosId.length !== 0) {
      try {
        await Promise.all(completedTodosId.map(id => deleteOneTodo(id)));
      } catch {
        addError('Unable to delete all completed todos');
      } finally {
        await getTodosFromAPI();
      }
    }
  }, [completedTodosId]);

  const toggleOneTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    try {
      setChangingTodosId(prevToggledTodos => [...prevToggledTodos, todoId]);
      await updateTodo(todoId, { completed: !completed });
    } catch {
      addError('Unable to update a todo');
    }
  }, [todos]);

  const handleToggleTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    await toggleOneTodo(todoId, completed);
    await getTodosFromAPI();
  }, [todos]);

  const handleToggleAllTodos = useCallback(async () => {
    try {
      if (counterActiveTodos > 0
        && fieldForFiltering !== FieldForFiltering.Completed) {
        const filteredTodosForToggle = filteredTodos
          .filter(todo => !todo.completed);

        await Promise.all(filteredTodosForToggle
          .map(todo => toggleOneTodo(todo.id, todo.completed)));

        return;
      }

      await Promise.all(filteredTodos
        .map(todo => toggleOneTodo(todo.id, todo.completed)));
    } catch {
      addError('Unable to toggle all todos');
    } finally {
      await getTodosFromAPI();
    }
  }, [filteredTodos]);

  const handleEditTodo = async (
    todoId:number,
    newTitle: string,
  ) => {
    if (!user) {
      return;
    }

    try {
      const newTodoTitle = newTitle.trim();

      if (newTodoTitle.length > 0) {
        setChangingTodosId(prevEditedTodos => [...prevEditedTodos, todoId]);
        await updateTodo(todoId, { title: newTodoTitle });
        await getTodosFromAPI();

        return;
      }

      setChangingTodosId(prevDeleteTodos => [...prevDeleteTodos, todoId]);
      handleDeleteTodo(todoId);
    } catch {
      addError('Unable to edit a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <ToggleAllButton
              handleToggleAllTodos={handleToggleAllTodos}
              counterActiveTodos={counterActiveTodos}
            />
          )}

          <AddTodoForm
            handleAddTodo={handleAddTodo}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          isAdding={isAdding}
          tempTodo={tempTodo}
          changingTodosId={changingTodosId}
          handleToggleTodo={handleToggleTodo}
          handleEditTodo={handleEditTodo}
        />

        {hasTodos && (
          <Footer
            fieldForFiltering={fieldForFiltering}
            selectFieldForFiltering={selectFieldForFiltering}
            counterActiveTodos={counterActiveTodos}
            deleteCompletedTodos={deleteCompletedTodos}
            length={completedTodosId.length}
          />
        )}
      </div>

      <ErrorComponent
        isError={isError}
        closeError={closeError}
        error={errorMessage}
      />
    </div>
  );
};
