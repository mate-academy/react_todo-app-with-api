import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/filterType';
import { AuthContext } from '../Auth/AuthContext';
import { User } from '../../types/User';
import { Errors } from '../../types/Errors';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext, TodosContextType } from '../Context/TodosContext';

interface TodoListProps {
  title: string;
  filterBy: FilterType,
  selectedTodosId: number[];
  isAdding: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  loadingTodosFromServer: () => Promise<void>;
}

export const TodoList: FunctionComponent<TodoListProps> = ({
  title,
  filterBy,
  selectedTodosId,
  isAdding,
  setErrorMessage,
  setSelectedTodosId,
  loadingTodosFromServer,
}) => {
  const user = useContext<User | null>(AuthContext);
  const { todos } = useContext(TodosContext) as TodosContextType;

  const filteredTodos = useMemo((): Todo[] => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterBy]);

  const removeTodoHandler = useCallback(async (todoId: number) => {
    setErrorMessage(Errors.None);
    setSelectedTodosId(prevId => [...prevId, todoId]);
    try {
      await deleteTodo(todoId);
      await loadingTodosFromServer();
    } catch {
      setErrorMessage(Errors.Deleting);
    } finally {
      setSelectedTodosId([]);
    }
  }, []);

  const renameTodoHandler = useCallback(async (
    todo: Todo, newTitle: string,
  ) => {
    const { title: currentTitle, id } = todo;

    if (!newTitle) {
      await removeTodoHandler(id);

      return;
    }

    if (newTitle !== currentTitle) {
      setErrorMessage(Errors.None);
      setSelectedTodosId(prevIds => [...prevIds, id]);

      try {
        await updateTodo(id, { title: newTitle });

        await loadingTodosFromServer();
      } catch {
        setErrorMessage(Errors.Updating);
      } finally {
        setSelectedTodosId([]);
      }
    }
  }, []);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setSelectedTodosId={setSelectedTodosId}
          setErrorMessage={setErrorMessage}
          removeTodoHandler={removeTodoHandler}
          renameTodoHandler={renameTodoHandler}
          onLoading={selectedTodosId.includes(todo.id)}
        />
      ))}

      {(user && isAdding) && (
        <TodoItem
          todo={{
            id: 0,
            userId: user.id,
            title,
            completed: false,
          }}
          setSelectedTodosId={setSelectedTodosId}
          setErrorMessage={setErrorMessage}
          removeTodoHandler={removeTodoHandler}
          renameTodoHandler={renameTodoHandler}
          onLoading
        />
      )}
    </section>
  );
};
