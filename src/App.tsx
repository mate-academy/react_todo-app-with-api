/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodos,
  toggleTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';
import { FieldForSorting, Todo } from './types/Todo';
import { AddTodoForm } from './components/AddTodoForm';
import { ToggleAllButton } from './components/ToggleAllButton';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [fieldForSorting, setFieldForSorting]
    = useState<FieldForSorting>(FieldForSorting.All);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [changingTodosId, setChangingTodosId] = useState<number[]>([0]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: user?.id || 0,
    title: '',
    completed: false,
  });

  const getTodosFromAPI = useCallback(async () => {
    setIsError(false);
    if (user) {
      try {
        const todosFromAPI = await getTodos(user.id);

        setTodos(todosFromAPI);
      } catch {
        setIsError(true);
        setError('No ToDo loaded');
      }

      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromAPI();
  }, []);

  const closeError = useCallback(() => {
    setIsError(false);
  }, []);

  const selectFieldForSorting = useCallback((fieldForSort: FieldForSorting) => {
    setFieldForSorting(fieldForSort);
  }, [fieldForSorting]);

  const counterActiveTodos = useMemo(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    return todos.length - completedTodos.length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (fieldForSorting) {
        case FieldForSorting.Active:
          return !todo.completed;

        case FieldForSorting.Completed:
          return todo.completed;

        case FieldForSorting.All:
        default:
          return true;
      }
    });
  }, [todos, fieldForSorting]);

  const hasTodos = todos.length > 0;

  const handleAddTodo = async (title: string) => {
    if (user) {
      try {
        if (title.length > 0) {
          setTempTodo((prevTemp) => ({ ...prevTemp, title }));
          setIsAdding(true);
          await Promise.all([
            await addTodo(user.id, title)]);
          await getTodosFromAPI();
          setIsAdding(false);
        } else {
          setIsError(true);
          setError('Title can`t be empty');
        }
      } catch {
        setIsError(true);
        setError('Unable to add a todo');
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };

  const deleteOneTodo = useCallback(async (todoId: number) => {
    try {
      setChangingTodosId(prevDeleteTodos => [...prevDeleteTodos, todoId]);
      await deleteTodo(todoId);
    } catch {
      setIsError(true);
      setError('Unable to delete a todo');
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    await deleteOneTodo(todoId);
    setChangingTodosId([0]);
    await getTodosFromAPI();
  }, []);

  const completedTodosId = useMemo(() => {
    return todos
      .filter(todo => todo.completed)
      .map(todo => (todo.completed ? todo.id : 0));
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    if (completedTodosId.length > 0) {
      try {
        await Promise.all(completedTodosId.map(id => deleteOneTodo(id)));
      } catch {
        setIsError(true);
        setError('Unable to delete all completed todos');
      } finally {
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  }, [completedTodosId]);

  const handleDeleteCompletedTodos = useCallback(async () => {
    await deleteCompletedTodos();
    setChangingTodosId([0]);
    await getTodosFromAPI();
  }, [completedTodosId]);

  const toggleOneTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    try {
      setChangingTodosId(prevToggledTodos => [...prevToggledTodos, todoId]);
      await toggleTodo(todoId, completed);
    } catch {
      setIsError(true);
      setError('Unable to update a todo');
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, [todos]);

  const handleToggleTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    await toggleOneTodo(todoId, completed);
    setChangingTodosId([0]);
    await getTodosFromAPI();
  }, [todos]);

  const toggleAllTodos = useCallback(async () => {
    try {
      if (counterActiveTodos > 0
        && fieldForSorting !== FieldForSorting.Completed) {
        const filteredTodosForToggle = filteredTodos
          .filter(todo => !todo.completed);

        await Promise.all(filteredTodosForToggle.map(async todo => {
          await toggleOneTodo(todo.id, todo.completed);
        }));
      }

      if (counterActiveTodos > 0
        && fieldForSorting === FieldForSorting.Completed) {
        await Promise.all(filteredTodos.map(async todo => {
          await toggleOneTodo(todo.id, todo.completed);
        }));
      }

      if (counterActiveTodos === 0) {
        await Promise.all(filteredTodos.map(async todo => {
          await toggleOneTodo(todo.id, todo.completed);
        }));
      }
    } catch {
      setIsError(true);
      setError('Unable to toggle all todos');
    } finally {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, [filteredTodos]);

  const handleToggleAllTodos = useCallback(async () => {
    await toggleAllTodos();
    setChangingTodosId([0]);
    await getTodosFromAPI();
  }, [filteredTodos]);

  const editOneTodo = async (
    todoId:number,
    newTitle: string,
  ) => {
    if (user) {
      try {
        const newTodoTitle = newTitle.trim();

        if (newTodoTitle.length > 0) {
          setChangingTodosId(prevEditedTodos => [...prevEditedTodos, todoId]);
          await Promise.all([
            await editTodo(todoId, newTodoTitle)]);
          await getTodosFromAPI();
        } else {
          setChangingTodosId(prevDeleteTodos => [...prevDeleteTodos, todoId]);
          handleDeleteTodo(todoId);
        }
      } catch {
        setIsError(true);
        setError('Unable to edit a todo');
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };

  const handleEditTodo = async (
    todoId:number,
    newTitle: string,
  ) => {
    await editOneTodo(todoId, newTitle);
    setChangingTodosId([0]);
    await getTodosFromAPI();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAllButton
            handleToggleAllTodos={handleToggleAllTodos}
            counterActiveTodos={counterActiveTodos}
          />

          <AddTodoForm
            handleAddTodo={handleAddTodo}
            newTodoField={newTodoField}
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
          newTodoField={newTodoField}
        />

        {hasTodos && (
          <Footer
            fieldForSorting={fieldForSorting}
            selectFieldForSorting={selectFieldForSorting}
            counterActiveTodos={counterActiveTodos}
            deleteCompletedTodos={handleDeleteCompletedTodos}
            length={completedTodosId.length}
          />
        )}
      </div>

      <Error
        isError={isError}
        closeError={closeError}
        error={error}
      />
    </div>
  );
};
