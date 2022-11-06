import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  getTodos, patchTodo, postTodo, removeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoAddForm } from './components/TodoAddForm';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { FilterValues } from './types/FilterValues';
import { Todo } from './types/Todo';
import { loading } from './utils/fetchClient';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorNotification, setErrorNotification]
    = useState<Errors | null>(null);
  const [selectedFilter, setSelectedFilter]
    = useState<FilterValues>(FilterValues.All);
  const [isAdding, setIsAdding] = useState(true);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [isToggleActive, setIsToggleActive] = useState(false);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const getVisibleTodos = () => {
    return [...todos].filter((todo) => {
      switch (selectedFilter) {
        case FilterValues.Completed:
          return todo.completed;
        case FilterValues.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  };

  const visibleTodos = useMemo(
    getVisibleTodos,
    [selectedFilter, todos],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    (async () => {
      if (user) {
        setErrorNotification(null);
        const loadedTodos = await getTodos(user.id);

        setTodos(loadedTodos);
        setIsAdding(false);
      }
    })();
  }, []);

  useEffect(() => {
    setIsToggleActive(completedTodos.length === todos.length);
  }, [completedTodos]);

  const addTodo = useCallback(async () => {
    try {
      if (user) {
        const newTodo = await postTodo(user.id, newTodoTitle);

        setCurrentTodos(prevArray => [...prevArray, newTodo]);
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      }
    } catch {
      setErrorNotification(Errors.onAddError);
    } finally {
      loading(() => setCurrentTodos([]));
    }

    setNewTodoTitle('');
  }, [newTodoTitle]);

  const deleteTodo = useCallback(async (todo: Todo) => {
    try {
      if (user) {
        setCurrentTodos((prevTodos) => [...prevTodos, todo]);
        await removeTodo(todo);
        setTodos((prevTodos) => {
          return prevTodos.filter(item => item !== todo);
        });
      }
    } catch {
      setErrorNotification(Errors.onDeleteError);
    } finally {
      loading(() => setCurrentTodos([]));
    }
  }, [todos]);

  const updateTodo = useCallback(async (todo: Todo) => {
    try {
      if (user) {
        const updated = await patchTodo(todo.id, todo.title, todo.completed);

        setCurrentTodos((prevTodos) => [...prevTodos, updated]);
        setTodos((prevTodos) => prevTodos.map(
          (item) => (item.id === todo.id ? updated : item),
        ));
      }
    } catch {
      setErrorNotification(Errors.onUpdateError);
    } finally {
      loading(() => setCurrentTodos([]));
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    await Promise.all(completedTodos.map(todo => deleteTodo(todo)));

    setTodos((prevTodos) => {
      return prevTodos.filter((item) => !item.completed);
    });
  }, [todos]);

  const toggleAll = useCallback(async () => {
    setIsToggleActive(prev => !prev);

    await Promise.all(todos
      .map(todo => updateTodo({ ...todo, completed: !isToggleActive })));
  }, [todos, isToggleActive]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAddForm
          isAdding={isAdding}
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          onTitleAdd={(title: string) => setNewTodoTitle(title)}
          onAdd={addTodo}
          changeErrors={setErrorNotification}
          isToggleActive={isToggleActive}
          toggleAll={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              currentTodos={currentTodos}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              newTodoField={newTodoField}
            />

            <TodoFilter
              completed={completedTodos.length}
              active={activeTodos.length}
              selectedFilter={selectedFilter}
              onSelection={(filter:FilterValues) => setSelectedFilter(filter)}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        errorNotification={errorNotification}
        changeErrors={setErrorNotification}
      />
    </div>
  );
};
