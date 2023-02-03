import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { FilterStatus } from './types/FilterStatus';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [isTodoAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [selectedTodosId, setSelectedTodosId] = useState<number []>([]);
  const [isTodoUpdating, setIsTodoUpdating] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    try {
      setErrorMessage('');
      const loadedTodos = await getTodos(user.id);

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage('Can not load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmitForm = useCallback((
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (!event) {
      return;
    }

    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can not be empty');
      setTitle('');

      return;
    }

    const addNewTodo = async () => {
      setIsAdding(true);

      if (user) {
        try {
          setTempTodo({
            id: 0,
            userId: user?.id,
            title: title.trim(),
            completed: false,
          });

          const addedTodo = await addTodo({
            userId: user?.id,
            title: title.trim(),
            completed: false,
          });

          setTitle('');

          setTodos(currentTodos => [
            ...currentTodos,
            addedTodo,
          ]);
        } catch (error) {
          setErrorMessage('Unable to add a todo');
        } finally {
          setIsAdding(false);
          setTempTodo(null);
        }
      }
    };

    addNewTodo();
  }, [title]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsTodoDeleting(true);
      setSelectedTodosId(todosIds => [
        ...todosIds,
        todoId,
      ]);

      setErrorMessage('');

      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      setSelectedTodosId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsTodoDeleting(false);
    }
  }, []);

  const removeCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const changeTodo = useCallback(async (
    todoId: number,
    dataToUpdate: Partial<Todo>,
  ) => {
    try {
      setIsTodoUpdating(true);
      setErrorMessage('');
      setSelectedTodosId(todosIds => [
        ...todosIds,
        todoId,
      ]);

      await updateTodo(
        todoId,
        dataToUpdate,
      );

      setTodos(currentTodos => currentTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          ...dataToUpdate,
        };
      }));

      setSelectedTodosId(todosIds => todosIds.filter(id => id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsTodoUpdating(false);
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const updateAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        changeTodo(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  const filteredTodos = useMemo(() => {
    if (filterStatus === FilterStatus.All) {
      return todos;
    }

    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          throw new Error('Invalid type');
      }
    });
  }, [todos, filterStatus]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        title={title}
        isTodoAdding={isTodoAdding}
        isAllTodosCompleted={isAllTodosCompleted}
        setTitle={setTitle}
        handleSubmitForm={handleSubmitForm}
        onUpdateAllTodos={updateAllTodos}
      />

      {(todos.length > 0 || tempTodo) && (
        <>
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            isTodoDeleting={isTodoDeleting}
            selectedTodosId={selectedTodosId}
            isTodoUpdating={isTodoUpdating}
            newTodoField={newTodoField}
            onUpdateTodo={changeTodo}
            removeTodo={removeTodo}
          />

          <Footer
            activeTodosAmount={activeTodosAmount}
            hasCompletedTodos={hasCompletedTodos}
            filterType={filterStatus}
            onChangeType={setFilterStatus}
            deleteCompletedTodos={removeCompletedTodos}
          />
        </>
      )}

      <ErrorNotification
        error={errorMessage}
        onNotificationClose={setErrorMessage}
      />
    </div>
  );
};
