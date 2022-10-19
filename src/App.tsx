import classnames from 'classnames';
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const userId = user ? user?.id : 0;

  if (error) {
    setTimeout(() => setError(''), 3000);
  }

  const loadTodos = async () => {
    try {
      const response = await getTodos(userId);

      setTodos(response);
    } catch {
      setError('Cannot load todos');
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const handleAddTodo = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsAdding(true);
    if (!title.trim()) {
      setError('Title cannot be empty');
      setIsAdding(false);

      return;
    }

    if (!user) {
      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId,
      completed: false,
    };

    setLoadingTodoIds(prevIds => [...prevIds, 0]);
    setTodos(prevTodos => [...prevTodos, newTodo]);

    try {
      setTitle('');
      await addTodo(newTodo);
      loadTodos();
    } catch {
      setError('Cannot add todo');
    } finally {
      setLoadingTodoIds(prevTodoIds => prevTodoIds.filter(id => id !== 0));
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      loadTodos();
    } catch {
      setError('Cannot delete todo');
    } finally {
      setLoadingTodoIds(prevTodoIds => prevTodoIds.filter(id => id !== todoId));
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setLoadingTodoIds(prevIds => [...prevIds, todo.id]);
    try {
      const response: any
        = await toggleTodo(todo.id, { completed: !todo.completed });

      setTodos(prevTodos => prevTodos.map(prevTodo => {
        if (prevTodo.id === response.id) {
          return { ...prevTodo, completed: response.completed };
        }

        return prevTodo;
      }));
    } catch {
      setError('Cannot toggle todo status');
    } finally {
      setLoadingTodoIds(
        prevTodoIds => prevTodoIds.filter(id => id !== todo.id),
      );
    }
  };

  const handleToggleAllTodos = () => {
    const toggleAllStatus = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      const updatedTodo = { ...todo, completed: toggleAllStatus };

      handleToggleTodo(updatedTodo);
    });
  };

  const handleUpdateTodo = async (
    todoId: number,
    newTodoTitle: string,
  ) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
    try {
      await updateTodo(todoId, newTodoTitle);

      setTodos(prevTodos => prevTodos.map(
        prevTodo => {
          if (prevTodo.id === todoId) {
            return { ...prevTodo, title: newTodoTitle };
          }

          return prevTodo;
        },
      ));
    } catch {
      setError('Unable to rename a todo');
    } finally {
      setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="ToggleAll"
            data-cy="ToggleAllButton"
            type="button"
            className={
              classnames(
                'todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) },
              )
            }
            onClick={() => handleToggleAllTodos()}
          />

          <form onSubmit={event => handleAddTodo(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          loadingTodoIds={loadingTodoIds}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        {Boolean(todos.length) && (
          <Footer
            todos={todos}
            filter={filterType}
            onFilterChange={setFilterType}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        closeError={setError}
      />
    </div>
  );
};
