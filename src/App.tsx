/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, FC, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodos, delateTodos, patchTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFiler } from './components/TodoFilter/TodoFilter';
import { Filters } from './types/Filters';
import { Header } from './components/Header/Header';
import { ErrorMesages } from './components/ErrorMesages/ErrorMesagws';
import { ErrorValues } from './types/errorValues';
import { getCompletedTodos } from './servisec/getCompletedTodos';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState(Filters.All);
  const [loading, setLoading] = useState<number[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showNewError = (error: string) => {
    setLoadError(error);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todo = await getTodos();

        setTodos(todo);
      } catch (error) {
        showNewError(ErrorValues.Load);
      }
    };

    loadTodos();
  }, []);

  const creatTodo = async ({ userId, completed, title }: Todo) => {
    try {
      setTempTodo({ userId, completed, title, id: 0 });
      const nuwTodo = await addTodos({ userId, completed, title });

      setTodos(curenTodos => [...curenTodos, nuwTodo]);
    } catch (error) {
      showNewError(ErrorValues.Add);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const deletedTodo = async (todosId: number[]) => {
    try {
      setLoadError('');
      setLoading(todosId);

      for (const id of todosId) {
        await delateTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      showNewError(ErrorValues.Delete);
      throw error;
    } finally {
      setLoading(null);
    }
  };

  const clearCmplitedTodos = async () => {
    const filterTodos = getCompletedTodos(todos);

    try {
      const delateCalback = async (todo: Todo) => {
        try {
          await deletedTodo([todo.id]);

          return { id: todo.id, status: 'resolved' };
        } catch {
          showNewError(ErrorValues.Delete);

          return { id: todo.id, status: 'rejected' };
        }
      };

      const rest = await Promise.allSettled(filterTodos.map(delateCalback));

      const resolvedId = rest.reduce(
        (acc, item) => {
          if (item.status === 'rejected') {
            return acc;
          }

          if (item.value.status === 'resolved') {
            return { ...acc, [item.value.id]: item.value.id };
          }

          return acc;
        },
        {} as Record<number, number>,
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => {
          if (resolvedId[todo.id] && todo.completed) {
            return false;
          }

          return true;
        }),
      );
    } catch {
      showNewError(ErrorValues.ClearComplited);
    }
  };

  const hendleEdit = async (id: number, data: Partial<Todo>) => {
    try {
      setLoading([id]);
      const editTodo = await patchTodos(id, data);

      setTodos(currToto =>
        currToto.map(todo => {
          if (todo.id === id) {
            return editTodo;
          }

          return todo;
        }),
      );
    } catch {
      showNewError(ErrorValues.Update);
    } finally {
      setLoading(null);
    }
  };

  const handleEditMultiple = async () => {
    const isCompleted = todos.every(item => item.completed);
    const todoToggle = todos.filter(todo => todo.completed === isCompleted);
    const todoIds = todoToggle.map(todo => todo.id);

    setLoading(todoIds);

    const updatePromises = todoToggle.map(todo =>
      patchTodos(todo.id, { ...todo, completed: !isCompleted }),
    );

    try {
      await Promise.all(updatePromises);

      setTodos(prevTodos =>
        prevTodos.map(prevTodo => ({
          ...prevTodo,
          completed:
            prevTodo.completed === isCompleted
              ? !isCompleted
              : prevTodo.completed,
        })),
      );
    } catch (error) {
      showNewError(ErrorValues.Update);
    } finally {
      setLoading(null);
    }
  };

  const preparedTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          creatTodo={creatTodo}
          loading={loading}
          setLoading={setLoading}
          showNewError={showNewError}
          todos={todos}
          handleEditMultiple={handleEditMultiple}
        />

        <TodoList
          loading={loading}
          todos={preparedTodos}
          onDelete={deletedTodo}
          tempTodo={tempTodo}
          onEdit={hendleEdit}
        />

        {todos.length > 0 && (
          <TodoFiler
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            onClear={clearCmplitedTodos}
          />
        )}
      </div>
      <ErrorMesages loadError={loadError} setLoadError={setLoadError} />
    </div>
  );
};
