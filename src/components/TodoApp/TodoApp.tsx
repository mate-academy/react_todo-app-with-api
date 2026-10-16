import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { Loader } from '../Loader';
import { useState } from 'react';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[] | null;
  setTodos: (todos: Todo[] | null) => void;
  setIsError: (bol: boolean) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
  isAdding: boolean;
  setIsAdding: (el: boolean) => void;
  statusFilter: string;
  isError: boolean;
  USER_ID: number;
  ErrorMessages: { None: string; Delete: string; Update: string };
  setErrorMessage: (msg: string) => void;
};

export const TodoApp: React.FC<Props> = ({
  todos,
  setTodos,
  setIsError,
  isLoading,
  setIsLoading,
  statusFilter,
  tempTodo,
  ErrorMessages,
  setErrorMessage,
}) => {
  const filteredTodos = todos?.filter(todo => {
    if (statusFilter === 'completed') {
      return todo.completed;
    }

    if (statusFilter === 'active') {
      return !todo.completed;
    }

    return true;
  });
  const [title, setTitle] = useState('');
  const [deletedId, setDeletedId] = useState<number | null>(0);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const removeTodo = async (id: number) => {
    setIsLoading(true);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(
        currentTodos => currentTodos?.filter(todo => todo.id !== id) || [],
      );
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateStatus = async (el: Todo) => {
    const revCompl = !el.completed;

    setIsLoading(true);

    try {
      await client.patch(`/todos/${el.id}`, { completed: revCompl });
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === el.id ? { ...todo, completed: revCompl } : todo,
        ),
      );
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const removeLoadingId = (id: number) => {
    setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id));
  };

  const handleToggleStatus = async (todoToUpdate: Todo) => {
    setLoadingTodoIds(current => [...current, todoToUpdate.id]);
    setIsError(false);

    try {
      const updatedTodo = await client.patch<Todo>(
        `/todos/${todoToUpdate.id}`,
        {
          completed: !todoToUpdate.completed,
        },
      );

      setTodos(prevTodos =>
        prevTodos
          ? prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t))
          : [],
      );
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Update);
      throw new Error();
    } finally {
      removeLoadingId(todoToUpdate.id);
    }
  };

  const handleUpdateTitle = async (todoToUpdate: Todo, newTitle: string) => {
    setIsError(false);

    try {
      const updatedTodo = await client.patch<Todo>(
        `/todos/${todoToUpdate.id}`,
        { title: newTitle },
      );

      setTodos(prevTodos =>
        prevTodos
          ? prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t))
          : [],
      );
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Update);
      throw error;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos &&
        filteredTodos.map(el => {
          return (
            <TodoItem
              todo={el}
              title={title}
              setTitle={setTitle}
              deletedId={deletedId}
              onUpdateStatus={onUpdateStatus}
              setDeletedId={setDeletedId}
              removeTodo={removeTodo}
              key={el.id}
              el={el}
              onToggleStatus={handleToggleStatus}
              loadingTodoIds={loadingTodoIds}
              setIsError={setIsError}
              setErrorMessage={setErrorMessage}
              onUpdateTitle={handleUpdateTitle}
            />
          );
        })}
      {tempTodo !== null ? (
        <div
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className={`todo__status ${tempTodo.completed ? 'completed' : ''}`}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>

          <Loader isLoading={isLoading} />
        </div>
      ) : (
        ''
      )}
    </section>
  );
};
