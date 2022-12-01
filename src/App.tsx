import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  getTodos,
  addTodo,
  handleDeleteTodo,
  toggleTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filter } from './types/Filter';
import './App.scss';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoStatus, setTodoStatus]
    = useState<Filter>(Filter.All);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [todoTemplate, setTodoTemplate] = useState({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Error!');

      setTimeout(() => {
        setHasError(false);
        setErrorMessage('');
      }, 3000);
    }
  };

  const addNewTodo = useCallback(async (todoTitle: string) => {
    try {
      setIsAdding(true);

      if (user) {
        setTodoTemplate(current => ({
          ...current,
          title: todoTitle,
          userId: user.id,
        }));

        const newTodo = await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(currentTodos => [...currentTodos, newTodo]);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      setSelectedIds(current => [...current, id]);
      await handleDeleteTodo(id);
      await getTodosFromServer();
      setSelectedIds([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const removeAllCompleted = async () => {
    try {
      setSelectedIds(todos
        .filter(todo => todo.completed)
        .map(todo => todo.id));

      await Promise.all(todos.map(post => {
        return post.completed ? deleteTodo(post.id) : null;
      }));

      setSelectedIds([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete todos');
    }
  };

  const editTodo = useCallback(async (todoId: number, data: Partial<Todo>) => {
    try {
      setSelectedIds(currentId => [...currentId, todoId]);

      await toggleTodo(todoId, data);
      await getTodosFromServer();

      setSelectedIds([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    }
  }, []);

  const toggleAll = async () => {
    try {
      const idsToComplete = todos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      setSelectedIds(idsToComplete);

      if (idsToComplete.length === 0) {
        setSelectedIds(todos.map(todo => todo.id));

        await Promise.all(todos
          .map(todo => editTodo(todo.id, { completed: false })));
      } else {
        await Promise.all(todos.map(todo => {
          return !todo.completed
            ? editTodo(todo.id, { completed: true }) : null;
        }));
      }

      setSelectedIds([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const visibleTodos = todos.filter(todo => {
    switch (todoStatus) {
      case Filter.Completed:
        return todo.completed;
      case Filter.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const handleErrorClose = useCallback(() => setHasError(false), []);
  const handleStatusSelect = useCallback((status: Filter) => {
    setTodoStatus(status);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <NewTodoField
          newTodoField={newTodoField}
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          todos={todos}
          toggleAll={toggleAll}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              todoTemplate={todoTemplate}
              isAdding={isAdding}
              handleDeleteTodo={deleteTodo}
              selectedIds={selectedIds}
              editTodo={editTodo}
            />
            <TodoFilter
              todos={todos}
              filter={todoStatus}
              handleStatusSelect={handleStatusSelect}
              removeCompleted={removeAllCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification
        hasError={hasError}
        setHasError={setHasError}
        handleErrorClose={handleErrorClose}
        errorMessage={errorMessage}
      />
    </div>
  );
};
