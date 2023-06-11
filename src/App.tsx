import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  addNewTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { Todo as TodoType } from './types/Todo';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';

const USER_ID = 10542;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[] | []>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoText, setTodoText] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [editedTodoText, setEditedTodoText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadTodos = useCallback(async () => {
    try {
      setTodos(await getTodos(USER_ID));
    } catch (error) {
      setErrorMessage('Failed to load todos');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (editedTodoId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editedTodoId]);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const hasCompletedTodos = todos.filter(todo => todo.completed).length > 0;
  const hasActiveTodos = todos.filter(todo => !todo.completed).length > 0;

  const filterVisibleTodos
    = (filterList: FilterType, todoList: TodoType[]) => {
      const filteredTodos = todoList;

      return filteredTodos.filter(todo => {
        switch (filterList) {
          case FilterType.Completed:
            return todo.completed;
          case FilterType.Active:
            return !todo.completed;
          case FilterType.All:
          default:
            return todo;
        }
      });
    };

  const visibleTodos = useMemo(
    () => filterVisibleTodos(filter, todos),
    [todos, filterVisibleTodos],
  );

  const handleFilterChange = useCallback(
    (newFilter: FilterType) => setFilter(newFilter),
    [],
  );

  const handleCleanErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleTodoTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoText(event.target.value);
    }, [],
  );

  const handleNewTodoSubmit
  = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoText.trim() === '') {
      setErrorMessage('Title can\'t be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: todoText,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTempTodo(newTodo);

      const createdTodo = await addNewTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setTodoText('');
      setIsInputDisabled(false);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const foundTodo = todos
        .find(todo => todo.id === id);

      if (foundTodo) {
        setLoadingTodoIds(prevIds => [...prevIds, id]);
        const updatedTodo = { ...foundTodo, completed: !foundTodo.completed };

        await updateTodo(id, updatedTodo);

        setTodos(prevTodos => [...prevTodos
          .map(todo => (todo.id === id ? updatedTodo : todo))]);
      }
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleToggleAllTodos = async () => {
    const activeTodos = todos
      .filter(todo => !todo.completed)
      .map(todo => handleToggleTodo(todo.id));

    if (hasActiveTodos) {
      Promise.all(activeTodos);
    } else {
      Promise.all(todos.map(todo => handleToggleTodo(todo.id)));
    }
  };

  const handleRemoveTodo = useCallback(async (id: number) => {
    try {
      setLoadingTodoIds(prevIds => [...prevIds, id]);
      await removeTodo(id);

      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingTodoIds([]);
    }
  }, []);

  const handleRemoveCompleted = useCallback(() => {
    const completedTodosPromises = todos
      .filter(todo => todo.completed)
      .map(todo => handleRemoveTodo(todo.id));

    Promise.all(completedTodosPromises);
  }, [todos]);

  const handleEditTodo = (id: number) => {
    setEditedTodoId(id);
    const editedTodo = todos.find(todo => todo.id === id);

    if (editedTodo) {
      setEditedTodoText(editedTodo.title);
    }
  };

  const handleEditedTodoSubmit
  = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editedTodo = todos.find(todo => todo.id === editedTodoId);

    if (editedTodo) {
      if (editedTodo.title === editedTodoText) {
        setEditedTodoId(null);

        return;
      }

      if (editedTodoText === '') {
        handleRemoveTodo(editedTodo.id);
        setEditedTodoId(null);

        return;
      }

      if (editedTodo.title !== editedTodoText) {
        try {
          setLoadingTodoIds(prevIds => [...prevIds, editedTodo.id]);
          const updatedTodo = { ...editedTodo, title: editedTodoText };

          await updateTodo(editedTodo.id, updatedTodo);

          setTodos(prevTodos => [...prevTodos
            .map(todo => (todo.id === editedTodo.id ? updatedTodo : todo))]);
        } catch (error) {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        } finally {
          setLoadingTodoIds([]);
          setEditedTodoId(null);
        }
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          onTodoTextChange={handleTodoTextChange}
          todoText={todoText}
          hasTodos={todos.length}
          onNewTodoSubmit={handleNewTodoSubmit}
          isInputDisabled={isInputDisabled}
          onToggleAllTodos={handleToggleAllTodos}
        />
        <TodoList
          inputRef={inputRef}
          onToggleTodo={handleToggleTodo}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          onTodoRemove={handleRemoveTodo}
          isLoading={loadingTodoIds}
          onEditTodo={handleEditTodo}
          editedTodoId={editedTodoId}
          setEditedTodoText={setEditedTodoText}
          editedTodoText={editedTodoText}
          onEditedTodoSubmit={handleEditedTodoSubmit}
          setEditedTodoId={setEditedTodoId}
        />
        <Footer
          todos={todos}
          filter={filter}
          onFilterChange={handleFilterChange}
          hasCompletedTodos={hasCompletedTodos}
          todosLength={todos.length}
          onRemoveCompleted={handleRemoveCompleted}
        />
      </div>
      {errorMessage && (
        <Notification
          onCleanErrorMessage={handleCleanErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
