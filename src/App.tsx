import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { ErrorMessage, ErrorType }
  from './components/ErrorMessage/ErrorMessage';
import { TodoField } from './components/TodoField/TodoField';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [errorClose, setErrorClosing] = useState(false);
  const [todoName, setNewTodoName] = useState('');
  const [isAdding, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeTodoId, setActiveTodoId] = useState([0]);
  const [updatungId, setUpdatungId] = useState<number | null>(null);
  const [deletingId, setDelitingId] = useState<number | null>(null);

  async function updatePost(todoId: number, done: boolean, title: string) {
    try {
      const updated = updateTodo(todoId, {
        completed: done,
        title,
      });

      return await updated;
    } catch (error) {
      setErrorType(ErrorType.UpdatingOne);
    }

    return 0;
  }

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
      setErrorType(ErrorType.DeletingOne);
    }

    return 0;
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
        setCompleted(loadedTodos.filter((todo) => todo.completed === true)
          .map((todo) => todo.id));
      } catch (error) {
        setErrorType(ErrorType.LoadingAll);
      }
    };

    loadTodos();
  }, [activeTodoId, deletingId]);

  const handleAdd = async (newTodoName: string) => {
    setIsLoading(true);

    try {
      const newTodo = await createPost(newTodoName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTodos((prevTodos: any) => {
        return [
          ...prevTodos,
          newTodo,
        ];
      });

      setNewTodoName('');
    } catch (error) {
      setErrorType(ErrorType.AddingOne);
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
      setErrorType(ErrorType.DeletingOne);
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
      {user && (
        <>
          <h2 className="title todoapp__user-title">
            {`Hey, ${user.name}!`}
          </h2>
          <h2 className="subtitle todoapp__user-title">
            What are your plans for today?
          </h2>
        </>
      )}

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            newToField={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={handleAdd}
            isAdding={isAdding}
            setErrorType={setErrorType}
            setErrorClosing={setErrorClosing}
            onUpdate={handleUpdate}
            setUpdatungId={setUpdatungId}
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
              setErrorClosing={setErrorClosing}
              activeTodoId={activeTodoId}
              updatungId={updatungId}
              setDelitingId={setDelitingId}
              deletingId={deletingId}
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                completed={completed}
                setCompleted={setCompleted}
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                onDelete={handleDelete}
                setErrorClosing={setErrorClosing}
                setDelitingId={setDelitingId}
              />
            </footer>
          </>

        )}

      </div>

      {errorType !== ErrorType.None && (
        <ErrorMessage
          setErrorType={setErrorType}
          errorType={errorType}
          error={errorClose}
          closeError={setErrorClosing}
        />
      )}
    </div>
  );
};
