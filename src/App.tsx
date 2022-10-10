import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter';
import { TodoField } from './components/TodoField';
import { TodoList } from './components/TodoList';
import { ErrorMessage, ErrorTypes } from './components/LoadingErrorMessage';

import {
  getTodos,
  deleteTodo,
  postTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoName, setNewTodoName] = useState('');
  const [filter, setFilter] = useState(FilterBy.All);
  const [errorType, setErrorType] = useState<ErrorTypes>(ErrorTypes.None);
  const [closingError, setClosingError] = useState(false);
  const [isAdding, setIsLoading] = useState(false);
  const [completedTodos, setCompletedTodos] = useState<number[]>([]);
  const [activeTodoId, setActiveTodoId] = useState([0]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  async function createPost(title: string) {
    if (user) {
      return postTodo(user.id, {
        userId: user.id,
        title,
        completed: false,
      });
    }

    return 0;
  }

  async function deletePost(id: number) {
    try {
      const deleted = await deleteTodo(id);

      return deleted;
    } catch (error) {
      setErrorType(ErrorTypes.DeletingOneError);
    }

    return 0;
  }

  async function updatePost(todoId: number, done: boolean, title: string) {
    try {
      const updated = updateTodo(todoId, {
        completed: done,
        title,
      });

      return await updated;
    } catch (error) {
      setErrorType(ErrorTypes.UpdatingOneError);
    }

    return 0;
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
        setCompletedTodos(loadedTodos.filter(({ completed }) => completed)
          .map(({ id }) => id));
      } catch (error) {
        setErrorType(ErrorTypes.LoadingAllError);
      }
    };

    loadTodos();
  }, [activeTodoId, deletingId]);

  const handleAdd = async (newTodoName: string) => {
    setIsLoading(true);

    try {
      const newTodo = await createPost(newTodoName);

      setTodos((prevTodos: any) => {
        return [
          ...prevTodos,
          newTodo,
        ];
      });

      setNewTodoName('');
    } catch (error) {
      setErrorType(ErrorTypes.AddingTodoError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setActiveTodoId(idActive => [...idActive, id]);

      const deleted = await deletePost(id);

      return deleted;
    } catch (error) {
      setErrorType(ErrorTypes.DeletingOneError);
    } finally {
      setTimeout(() => setActiveTodoId(
        idActive => idActive.filter(idI => idI !== id),
      ), 200);
    }

    return 0;
  };

  const handleUpdate = async (todoId: number, done: boolean, title: string) => {
    try {
      setActiveTodoId(idActive => [...idActive, todoId]);

      const updated = await updatePost(todoId, done, title);

      return updated;
    } finally {
      setActiveTodoId(idActive => idActive.filter(idI => idI !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            newTodoField={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={handleAdd}
            isAdding={isAdding}
            setErrorType={setErrorType}
            setErrorClosing={setClosingError}
            onUpdate={handleUpdate}
            setUpdatingId={setUpdatingId}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={todos}
              filterType={filter}
              isAdding={isAdding}
              todoName={todoName}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              setClosingError={setClosingError}
              activeTodoId={activeTodoId}
              updatingTodoId={updatingId}
              setDeletingId={setDeletingId}
              deletingId={deletingId}
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                completed={completedTodos}
                setCompleted={setCompletedTodos}
                onDelete={handleDelete}
                setErrorClosing={setClosingError}
                setDelitingId={setDeletingId}
              />
            </footer>
          </>
        )}
      </div>

      {errorType !== ErrorTypes.None && (
        <ErrorMessage
          setErrorType={setErrorType}
          error={closingError}
          closeError={setClosingError}
          errorType={errorType}
        />
      )}
    </div>
  );
};
