import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  deleteTodos, getTodos, patchTodos, postTodos,
} from './api/todos';
// eslint-disable-next-line max-len
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Filter } from './types/Filters';
import { useError } from './components/controllers/useError';
import { filteredTodosByComplited, getComplitedTodoIds } from './utils/helpers';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [complitedFiler, setComplitedFilter] = useState(Filter.All);
  const [showError, closeErrorMessage, errorMessage] = useError();
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodosIds, setDeletingTodosIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const deleteTodoById = (todoId: number) => {
    deleteTodos(todoId);
    setTodos(todosItems => todosItems.filter((todo) => todo.id !== todoId));
  };

  const onDeleteTodo = useCallback(async (id: number) => {
    try {
      setDeletingTodosIds(prev => [...prev, id]);

      await deleteTodoById(id);

      setTodos(prev => prev.filter((todo) => todo.id !== id));
    } catch {
      showError('Unable to delete todo');
    } finally {
      setDeletingTodosIds(prev => prev.filter((todoId) => todoId !== id));
    }
  }, []);

  const deleteAllCompletetById = useCallback(async () => {
    const complitedTodoIds = getComplitedTodoIds(todos);

    complitedTodoIds.forEach((id) => onDeleteTodo(id));
  }, [todos]);

  const uncomplitedTodosCount = useMemo(() => {
    const uncomplitedTodos = todos.filter((todo) => !todo.completed);

    return uncomplitedTodos.length;
  }, [todos]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showError('Failed to load todos');
        });
    }
  }, []);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempTodo({
        ...fieldsForCreate,
        id: 0,
      });

      const newTodo = await postTodos(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showError('Unable to add a todo');

      throw Error('Error while adding todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [showError]);

  const visibleTodos = useMemo(() => {
    const filteredTodos = filteredTodosByComplited(todos, complitedFiler);

    return filteredTodos;
  }, [todos, complitedFiler]);

  const updateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(prevIds => {
      if (!prevIds.includes(todoId)) {
        return [...prevIds, todoId];
      }

      return prevIds;
    });

    try {
      const updatedTodo = await patchTodos(todoId, updateData);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds(prevTodos => prevTodos
        .filter(prevTodoId => prevTodoId !== todoId));
    }
  }, []);

  const complitedTodos = todos.filter((todo) => todo.completed);

  const shouldRenderActiveToggle = todos.length === complitedTodos.length;

  const handleToggleTodosStatus = useCallback(() => {
    const wantedTodoStatus = shouldRenderActiveToggle;

    Promise.all(todos.map(
      async (todo) => {
        if (todo.completed !== wantedTodoStatus) {
          await updateTodo(todo.id, { completed: wantedTodoStatus });
        }
      },
    ));
  }, [
    shouldRenderActiveToggle,
    todos,
  ]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
          shouldRenderActiveToggle={shouldRenderActiveToggle}
          clearAllButton={handleToggleTodosStatus}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              tempTodo={tempTodo}
              deletingTodoIds={deletingTodosIds}
              updatingTodoIds={updatingTodoIds}
              updateTodo={updateTodo}
            />

            <Footer
              uncomplitedTodosCount={uncomplitedTodosCount}
              complitedFilter={complitedFiler}
              setComplitedFilter={setComplitedFilter}
              deleteAllCompletetById={deleteAllCompletetById}
            />
          </>
        )}

      </div>
      {errorMessage && (
        <ErrorMessage message={errorMessage} closeButton={closeErrorMessage} />
      )}
    </div>
  );
};
