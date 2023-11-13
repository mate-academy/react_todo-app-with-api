import { FC, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../context/TodoError';
import { waitToClose } from '../../utils/hideErrorWithDelay';
import { LoaddingProvider } from '../../context/Loading';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type TTodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  hasDeleteTodoErrorTimerId: { current: number };
  hasUpdateTodoErrorTimerId: { current: number }
  deletedTodoIds: number[];
  inputFieldRef: { current: HTMLInputElement | null };
  setDeletedTodoIds: (callblack: (prev: number[]) => number[]) => void;
  setTodos: (callblack: (prev: Todo[]) => Todo[]) => void;
};

export const TodoList: FC<TTodoListProps> = ({
  todos,
  setTodos,
  hasDeleteTodoErrorTimerId,
  hasUpdateTodoErrorTimerId,
  tempTodo,
  setDeletedTodoIds,
  deletedTodoIds,
  inputFieldRef,
}) => {
  const { setErrorMessage } = useContext(ErrorMessage);
  const { setIsLoading } = useContext(LoaddingProvider);

  const handleDeleteBtn = (todoId: number) => {
    (async () => {
      try {
        setDeletedTodoIds(prevTodos => [...prevTodos, todoId]);

        await deleteTodo(todoId);

        setTodos(prev => prev.filter(todo => todo.id !== todoId));

        if (inputFieldRef.current) {
          inputFieldRef.current.focus();
        }
      } catch (deleteError) {
        // eslint-disable-next-line no-console
        console.warn(deleteError);
        setDeletedTodoIds(() => []);
        setErrorMessage('Unable to delete a todo');
        // eslint-disable-next-line no-param-reassign
        hasDeleteTodoErrorTimerId.current = waitToClose(3000, setErrorMessage);
      }
    }
    )();
  };

  const handleCheckButton = (todoToCheck: Todo) => {
    setIsLoading(true);

    (async () => {
      setDeletedTodoIds(prevTodos => [...prevTodos, todoToCheck.id]);

      try {
        await updateTodo(todoToCheck.id, {
          ...todoToCheck,
          completed: !todoToCheck.completed,
        });

        setTodos(prevTodos => prevTodos.map(prevTodo => (
          prevTodo.id === todoToCheck.id ? (
            {
              ...prevTodo,
              completed: !todoToCheck.completed,
            }
          ) : (
            prevTodo
          ))));

        setDeletedTodoIds(() => []);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('Unable to update a todo');

        setDeletedTodoIds(() => []);
        setIsLoading(false);

        // eslint-disable-next-line no-param-reassign
        hasUpdateTodoErrorTimerId.current = waitToClose(3000, setErrorMessage);
      }
    })();
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          inputFieldRef={inputFieldRef}
          deletedTodoIds={deletedTodoIds}
          handleCheckButton={handleCheckButton}
          handleDeleteBtn={handleDeleteBtn}
          setDeletedTodoIds={setDeletedTodoIds}
          hasUpdateTodoErrorTimerId={hasUpdateTodoErrorTimerId}
        />
      ))}

      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
