/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { useError } from './utils/useError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fieldForSorting, setFieldForSorting]
    = useState<FieldForSorting>(FieldForSorting.All);
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
    if (user) {
      try {
        const todosFromAPI = await getTodos(user.id);

        setTodos(todosFromAPI);
      } catch {
        addError('No ToDo loaded');
      }
    }
  }, []);

  useEffect(() => {
    getTodosFromAPI();
  }, []);

  const closeError = useCallback(() => {
    clearError();
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
    if (!user) {
      return;
    }

    if (title.length === 0) {
      addError('Title can`t be empty');

      return;
    }

    try {
      setTempTodo((prevTemp) => ({ ...prevTemp, title }));
      setIsAdding(true);
      await Promise.all([
        await addTodo(user.id, title)]);
      await getTodosFromAPI();
      setIsAdding(false);
    } catch {
      addError('Unable to add a todo');
    }
  };

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
        setChangingTodosId([0]);
        await getTodosFromAPI();
      } catch {
        addError('Unable to delete all completed todos');
      }
    }
  }, [completedTodosId]);

  const toggleOneTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    try {
      setChangingTodosId(prevToggledTodos => [...prevToggledTodos, todoId]);
      await toggleTodo(todoId, completed);
    } catch {
      addError('Unable to update a todo');
    }
  }, [todos]);

  const handleToggleTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    await toggleOneTodo(todoId, completed);
    setChangingTodosId([0]);
    await getTodosFromAPI();
  }, [todos]);

  const handleToggleAllTodos = useCallback(async () => {
    try {
      if (counterActiveTodos > 0
        && fieldForSorting !== FieldForSorting.Completed) {
        const filteredTodosForToggle = filteredTodos
          .filter(todo => !todo.completed);

        await Promise.all(filteredTodosForToggle.map(async todo => {
          await toggleOneTodo(todo.id, todo.completed);
        }));
      } else {
        await Promise.all(filteredTodos.map(async todo => {
          await toggleOneTodo(todo.id, todo.completed);
        }));
      }
    } catch {
      addError('Unable to toggle all todos');
    }

    await getTodosFromAPI();
    setChangingTodosId([0]);
  }, [filteredTodos]);

  const handleEditTodo = async (
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
        addError('Unable to edit a todo');
      }

      setChangingTodosId([0]);
    }
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
            fieldForSorting={fieldForSorting}
            selectFieldForSorting={selectFieldForSorting}
            counterActiveTodos={counterActiveTodos}
            deleteCompletedTodos={deleteCompletedTodos}
            length={completedTodosId.length}
          />
        )}
      </div>

      <Error
        isError={isError}
        closeError={closeError}
        error={errorMessage}
      />
    </div>
  );
};
