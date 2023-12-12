import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { useAppState } from '../AppState/AppState';
import { deleteTodo, upDateTodo } from '../../api/todos';
import { handleErrorMessage } from '../function/handleErrorMessage';

export const TodoList: React.FC = () => {
  const {
    setTodos,
    todosFilter,
    tempTodo,
    loading,
    setTodosFilter,
    setLoading,
    setErrorNotification,
    deleteLoadingMap,
    setDeleteLoadingMap,
  } = useAppState();

  const handleDeleteClick = async (id: number) => {
    if (!todosFilter) {
      setErrorNotification('Unable to delete a todo');

      return;
    }

    setDeleteLoadingMap(
      (prevLoadingMap) => ({ ...prevLoadingMap, [id]: true }),
    );

    try {
      await deleteTodo(id);

      const remainder = todosFilter.filter((e) => e.id !== id);

      setTodosFilter(remainder);
      setTodos(remainder);
    } catch (error: any) {
      error.message = 'Unable to delete a todo';
      handleErrorMessage(error as Error, setErrorNotification);
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);

      return;
    } finally {
      setDeleteLoadingMap(
        (prevLoadingMap) => ({ ...prevLoadingMap, [id]: false }),
      );
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDeleteLoadingMap(
      (prevLoadingMap) => {
        return ({ ...prevLoadingMap, [id]: true });
      },
    );

    try {
      if (!todosFilter) {
        setErrorNotification('Unable to update a todo');

        return;
      }

      const updatedTodos: Todo[] = await Promise.all(
        todosFilter.map(async (todo: Todo) => {
          if (todo.id === id) {
            const updatedTodo = { ...todo, completed: !todo.completed };

            await upDateTodo(id, updatedTodo.completed);

            return updatedTodo;
          }

          return todo;
        }),
      );

      setTodosFilter([...updatedTodos]);
      setTodos([...updatedTodos]);
    } catch (error: any) {
      error.message = 'Unable to update a todo';
      handleErrorMessage(
        error as Error, setErrorNotification,
      );
      const errorNotificationTimeout = setTimeout(() => {
        setErrorNotification(null);
      }, 3000);

      clearTimeout(errorNotificationTimeout);
    } finally {
      setDeleteLoadingMap(
        (prevLoadingMap) => {
          return ({ ...prevLoadingMap, [id]: false });
        },
      );
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFilter && todosFilter.map(
        (todo: Todo) => {
          const { id } = todo;

          if (id) {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                loading={deleteLoadingMap[id] || false}
                onDeleteClick={() => handleDeleteClick(id)}
                onUpdateCompleted={
                  (e: React.MouseEvent) => handleStatusToggle(id, e)
                }
              />
            );
          }

          return null;
        },
      )}
      {tempTodo && (
        <>
          <TodoItem key={tempTodo.id} todo={tempTodo} loading={loading} />
        </>
      )}
    </section>
  );
};
