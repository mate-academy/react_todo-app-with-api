import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState, FormEvent,
} from 'react';
import { AuthContext } from './components/Auth';
import { ErrorNotification } from './components/Error';
import { TodoList } from './components/TodoList';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoCount } from './components/TodoCount';
import { TodoFilter } from './components/Filter';
import { FilterBy } from './types/FilterType';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    newTodoField.current?.focus();
  }, [isAdding]);

  useEffect(() => {
    getTodos(user?.id || 0)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load data'));
  }, [user]);

  const visibleTodo = useMemo(() => {
    return todos.filter((todo) => {
      switch (sortBy) {
        case FilterBy.All:
          return todo;

        case FilterBy.Active:
          return !todo.completed;

        case FilterBy.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, sortBy]);

  const activeTodo = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodo = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setErrorMessage('');

    setNewTodoTitle(value);
  };

  const handleAddNewTodo = useCallback(async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setIsAdding(true);
    setSelectedTodos([0]);
    try {
      const newTodo = await addTodo(newTodoTitle, user?.id || 0);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
      setSelectedTodos([]);
    } catch {
      setErrorMessage('Unable to add a todo');
    }

    setIsAdding(false);
  }, [newTodoTitle]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setSelectedTodos([todoId]);
    try {
      await deleteTodo(todoId);

      setTodos([...visibleTodo].filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setSelectedTodos([]);
  }, [todos]);

  const deleteCompletedTodo = useCallback(async () => {
    setSelectedTodos(completedTodo.map((todo) => (todo.id)));
    try {
      await Promise.all(completedTodo.map((todo) => deleteTodo(todo.id)));

      setTodos([...todos].filter(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete a todos');
    }
  }, [completedTodo]);

  const handleUpdateTodo = async (todo: Todo) => {
    const { id, completed } = todo;

    setIsLoading(true);
    setSelectedTodos([todo.id]);
    try {
      await updateTodo(id, { completed: !completed });
      const currentTodo = todo;

      currentTodo.completed = !currentTodo.completed;

      setSelectedTodos([]);
      setTodos([...todos]);
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  };

  const handleCheckAllTodo = useCallback(async () => {
    todos.forEach(async (todo) => {
      setSelectedTodos(prevIds => [...prevIds, todo.id]);
      try {
        await updateTodo(todo.id,
          { completed: completedTodo.length !== todos.length });
        const currentTodo = todo;

        currentTodo.completed = completedTodo.length !== todos.length;
        setTodos([...todos]);
        setSelectedTodos([]);
      } catch {
        setErrorMessage('Unable to update todos');
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="Toggle All Todo"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleCheckAllTodo}
          />

          <form onSubmit={handleAddNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleInput}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodo}
          onDelete={handleDeleteTodo}
          isAdding={isAdding}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
          handleUpdateTodo={handleUpdateTodo}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          selectedTodos={selectedTodos}
          setSelectedTodos={setSelectedTodos}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <TodoCount activeTodo={activeTodo} />
          <TodoFilter
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearAllCompleted={deleteCompletedTodo}
            completedTodo={completedTodo}
          />
        </footer>

      </div>
      {errorMessage
        && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

    </div>
  );
};
