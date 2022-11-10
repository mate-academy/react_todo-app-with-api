/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import {
  addTodoAPI,
  deleteTodoAPI,
  getCompletedTodosAPI,
  getTodosAPI,
  changeTodoAPI,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { TodosFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoStatus } from './types/TodoStatus';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasError, setHasError] = useState<Error>({
    message: '',
    status: false,
  });
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.All);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const showError = useCallback((message: string) => {
    setHasError({ status: true, message });

    setTimeout(() => {
      setHasError({ status: false, message: '' });
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodosAPI(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      showError('Unable to load todos');
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    let todosCopy = [...todos];

    if (todoStatus !== TodoStatus.All) {
      todosCopy = todosCopy.filter(todo => {
        switch (todoStatus) {
          case TodoStatus.Active:
            return !todo.completed;

          case TodoStatus.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setVisibleTodos(todosCopy);
  }, [todoStatus, todos]);

  const handleErrorClose = useCallback(
    () => setHasError({ status: false, message: '' }), [],
  );

  const addNewTodo = useCallback(async (title: string) => {
    try {
      if (user) {
        const tempData: Todo = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };

        setIsAdding(true);
        setTempTodo(tempData);
        setActiveTodoIds([0]);

        await addTodoAPI(tempData);
        await loadTodos();

        setTempTodo(null);
        setIsAdding(false);
        setActiveTodoIds([]);
      }
    } catch (err) {
      showError('Unable to add a todo');
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      setActiveTodoIds(currentIds => [...currentIds, id]);

      await deleteTodoAPI(id);
      await loadTodos();

      setActiveTodoIds(currentTodoIds => (
        currentTodoIds.filter(todoId => id !== todoId)
      ));
    } catch (err) {
      showError('Unable to delete a todo');
    }
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    try {
      if (user) {
        const completedTodos = await getCompletedTodosAPI(user.id);

        setActiveTodoIds(completedTodos.map(todo => todo.id));

        await Promise.all(completedTodos.map(async ({ id }) => {
          await deleteTodoAPI(id);
        }));

        await loadTodos();
        setActiveTodoIds([]);
      }
    } catch (err) {
      showError('Unable to delete completed todos');
    }
  }, [todos]);

  const toggleTodo = useCallback(async (id: number) => {
    try {
      const activeTodo = todos.find(todo => todo.id === id) || null;
      const newData = {
        completed: !activeTodo?.completed,
      };

      setIsAdding(true);
      setActiveTodoIds(currentIds => [...currentIds, id]);

      await changeTodoAPI(id, newData);
      await loadTodos();

      setActiveTodoIds(currentTodoIds => (
        currentTodoIds.filter(todoId => id !== todoId)
      ));
      setIsAdding(false);
    } catch (err) {
      showError('Unable to toggle todo');
      setActiveTodoIds([]);
      setIsAdding(false);
    }
  }, [todos]);

  const toggleAllTodos = useCallback(async () => {
    try {
      const isAllTodosCompleted = todos.every(todo => todo.completed);

      await Promise.all(todos.map(async (todo) => {
        if (isAllTodosCompleted || !todo.completed) {
          setActiveTodoIds(currentIds => [...currentIds, todo.id]);

          await changeTodoAPI(todo.id, { completed: !todo.completed });
        }
      }));

      await loadTodos();
      setActiveTodoIds([]);
    } catch (err) {
      showError('Unable to toggle todos');
      setActiveTodoIds([]);
    }
  }, [todos]);

  const handleStatusSelect = useCallback((status: TodoStatus) => {
    setTodoStatus(status);
  }, []);

  const handleEditTitle = async (id: number, newTitle: string) => {
    try {
      const trimmedNewTitle = newTitle.trim();
      const currentTodo = todos.find(todo => todo.id === id);

      setActiveTodoIds(currentIds => [...currentIds, id]);

      if (!trimmedNewTitle) {
        await deleteTodoAPI(id);
      } else if (currentTodo?.title !== trimmedNewTitle) {
        await changeTodoAPI(id, { title: trimmedNewTitle });
      }

      await loadTodos();
      setActiveTodoIds([]);
    } catch (err) {
      showError('Unable to edit a todo');
      setActiveTodoIds([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          addNewTodo={addNewTodo}
          isAdding={isAdding}
          showError={showError}
          onToggleAll={toggleAllTodos}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isAdding={isAdding}
              onDelete={deleteTodo}
              activeTodoIds={activeTodoIds}
              onToggle={toggleTodo}
              onEdit={handleEditTitle}
            />

            <TodosFilter
              todos={todos}
              todoStatus={todoStatus}
              handleStatusSelect={handleStatusSelect}
              onDelete={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};
