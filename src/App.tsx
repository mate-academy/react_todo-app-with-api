/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useCallback, useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { Footer } from './components/Footer';
import { TodoField } from './components/TodoField';

import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorTypes } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.all);
  const [isAdding, setIsAdding] = useState(false);
  const [todoToAdd, setTodoToAdd] = useState('');
  const [currTodo, setCurrTodo] = useState(0);
  const [isEditing, setisEditing] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.active:
        return !todo.completed;

      case FilterTypes.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const todoNumber = (items: Todo[]) => items.filter(todo => !todo.completed);
  const completedTodo = (items: Todo[]) => items.filter(todo => todo.completed);

  const notCompleted = useMemo(() => (
    todoNumber(todos)
  ), [todos, filterType]);

  const completed = useMemo(() => (
    completedTodo(todos)
  ), [todos, filterType]);

  const isActiveToggleAll = completedTodo.length === todos.length;

  const loadTodos = useCallback(
    async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
      } catch {
        setError(ErrorTypes.LOAD);
      }
    }, [],
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
  }, [error]);

  const updateTodoOnServer = async (
    idTodo: number, data: Partial<Todo>,
  ) => {
    try {
      if (user?.id) {
        await updateTodo(idTodo, data);
      }
    } catch {
      setError(ErrorTypes.UPDATE);
    } finally {
      loadTodos();
    }
  };

  const handleChangeToggleAll = () => {
    const todosToHandle = isActiveToggleAll
      ? [...completed]
      : [...notCompleted];

    todosToHandle.forEach(
      todo => updateTodoOnServer(
        todo.id, { completed: !isActiveToggleAll },
      ),
    );
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const addNewTodo = async () => {
    setIsAdding(true);

    if (!todoToAdd.length) {
      setError(ErrorTypes.LENGTH);
      setTimeout(() => setError(null), 3000);
      setTodoToAdd('');
      setIsAdding(false);

      return;
    }

    if (user) {
      try {
        const newAPITodo = await addTodo(todoToAdd, user.id);

        setTodos(currTodos => [...currTodos, newAPITodo]);
      } catch {
        setError(ErrorTypes.ADD);
      }
    }

    setTodoToAdd('');
    setIsAdding(false);
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    if (user) {
      try {
        await deleteTodo(todoId);
        setTodos(prev => (
          prev.filter(item => item.id !== todoId)
        ));
      } catch {
        setError(ErrorTypes.DELETE);
      }
    }
  }, [user]);

  const handleDeleteAllTodos = async () => {
    try {
      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
    } catch {
      setError(ErrorTypes.DELETEALL);
    }
  };

  const handleFilterType = useCallback((type: FilterTypes) => {
    setFilterType(type);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoField
          todos={todos}
          newTodo={newTodoField}
          isAdding={isAdding}
          addNewTodo={() => addNewTodo()}
          setTodo={setTodoToAdd}
          todoToAdd={todoToAdd}
          handleChangeToggleAll={handleChangeToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              isEditing={isEditing}
              setisEditing={setisEditing}
              updateTodoOnServer={updateTodoOnServer}
              currTodo={currTodo}
              setCurrTodo={setCurrTodo}
            />
            <Footer
              todos={todos}
              setFilterType={handleFilterType}
              deleteTodos={handleDeleteAllTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorMessage
          error={error}
          closeError={() => setError(null)}
        />
      )}
    </div>
  );
};
