import { FC, useContext } from 'react';
import { FilterTodo } from '../FilterTodo';
import { TodosContext } from '../TodosContext/TodosContext';
import { deleteTodos } from '../../api/todos';
import { Todo, ErrorMessage } from '../../types';

interface Props {
  activeTodosCount: number
  completedTodos: Todo[]
}

export const TodoFooter: FC<Props> = ({
  activeTodosCount,
  completedTodos,
}) => {
  const {
    todos,
    setTodos,
    setError,
    setIsTodoDeleting,
  } = useContext(TodosContext);
  const activeItems = activeTodosCount > 0 && activeTodosCount < 2;

  const handleDeleteCompletedTodos = (completedTodosIds: number[]) => {
    setIsTodoDeleting(completedTodosIds);

    Promise.all(completedTodosIds.map(id => deleteTodos(id)))
      .then(() => {
        setTodos((prevTodos: Todo[]) => (
          prevTodos.filter((prevTodo: Todo) => (
            !completedTodosIds.includes(prevTodo.id)
          ))
        ));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setIsTodoDeleting([]);
      });
  };

  const handleClear = () => {
    const idsOfCompletedTodos
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    handleDeleteCompletedTodos(idsOfCompletedTodos);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeItems
          ? `${activeTodosCount} item left`
          : `${activeTodosCount} items left`}
      </span>

      <FilterTodo />

      <button
        style={{
          visibility: completedTodos.length
            ? 'visible'
            : 'hidden',
        }}
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
