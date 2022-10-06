/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/Filter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';

const getTodoById = (todos: Todo[], todoId: number) => {
  return todos.find(({ id }) => id === todoId) || null;
};

const filterTodosByStatus = (todos: Todo[], filterStatus: FilterStatus) => {
  switch (filterStatus) {
    case 'all': return todos;
    case 'active': return todos.filter(({ completed }) => !completed);
    case 'completed': return todos.filter(({ completed }) => completed);
    default: throw new Error('Error: Filter todos');
  }
};

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number[]>([0]);
  const [error, setError] = useState('');

  const activeTodosCount = useMemo(
    () => filterTodosByStatus(todos, 'active').length,
    [todos],
  );

  function stopIsProcessingById(todoId: number) {
    setIsProcessing(prevIsProcessing => (
      prevIsProcessing.filter(id => id !== todoId)
    ));
  }

  function deleteTodoById(todoId: number) {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== todoId)
    ));
  }

  const showErrorMessage = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(''), 3000);
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => (
    setNewTodoTitle(event.target.value)
  );

  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!newTodoTitle.replace(/\s/g, '')) {
      showErrorMessage('Title can\'t be empty');
      setNewTodoTitle('');

      return;
    }

    if (user) {
      setIsAdding(true);
      const newTodoData = {
        id: 0,
        userId: user.id,
        title: newTodoTitle,
        completed: false,
      };

      setTodos(prevTodos => [...prevTodos, newTodoData]);
      try {
        const newTodo = await postTodo(newTodoData);

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      } catch {
        showErrorMessage('Unable to add a todo');
      } finally {
        deleteTodoById(0);
        setIsAdding(false);
      }
    }
  };

  const handleChangeTodo = async (todoId: number, newTitle?: string) => {
    setError('');
    setIsProcessing(prevIds => [...prevIds, todoId]);
    try {
      const targetTodo = getTodoById(todos, todoId);

      if (targetTodo) {
        await patchTodo(
          todoId,
          newTitle
            ? { title: newTitle }
            : { completed: !targetTodo.completed },
        );
        setTodos(prevTodos => {
          if (newTitle) {
            targetTodo.title = newTitle;

            return [...prevTodos];
          }

          targetTodo.completed = !targetTodo.completed;

          return [...prevTodos];
        });
      }
    } catch {
      showErrorMessage('Unable to update a todo');
    } finally {
      stopIsProcessingById(todoId);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setError('');
    setIsProcessing(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);
      deleteTodoById(todoId);
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      stopIsProcessingById(todoId);
    }
  };

  const handleToggleAll = () => {
    todos.forEach(todo => {
      if (activeTodosCount === 0 || !todo.completed) {
        handleChangeTodo(todo.id);
      }
    });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  useEffect(() => {
    const loadTodos = async () => {
      if (user) {
        try {
          const todosFromServer = await getTodos(user.id);

          setTodos(todosFromServer);
        } catch {
          showErrorMessage('Unable to load a todos');
        }
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    setVisibleTodos(filterTodosByStatus(todos, filterStatus));
  }, [todos, filterStatus, error]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: activeTodosCount === 0 },
              )}
              onClick={handleToggleAll}
            />
          )}

          <form
            onSubmit={handleAddNewTodo}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleNewTodoTitle}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            isProcessing={isProcessing}
            onStatusChange={handleChangeTodo}
            onTitleChange={handleChangeTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodosCount} items left`}
            </span>

            <Filter filterStatus={filterStatus} onFilter={setFilterStatus} />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
              disabled={todos.length - activeTodosCount === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessage error={error} onCloseError={handleCloseError} />
    </div>
  );
};
