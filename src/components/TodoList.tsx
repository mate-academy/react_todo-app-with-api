/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../types/Todo';
import { getFilteredTodos } from '../utils/filterTodosByType';
import { FilterType } from '../types/FilterType';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  typeFilter: FilterType;
  handleDeleteTodo: (todoId: number) => void;
  isLoading: boolean;
  tempTodo: Todo | null;
  idsProcessing: number | null;
  onEdit: (
    id: number,
    data: Partial<Todo>,
  ) => Promise<void | { error: boolean } | undefined>;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  typeFilter,
  handleDeleteTodo,
  isLoading,
  tempTodo,
  idsProcessing,
  onEdit,
  loadingIds,
}) => {
  const filteredTodos = getFilteredTodos(todos, typeFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          idsProcessing={idsProcessing}
          onEdit={onEdit}
          loadingIds={loadingIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={isLoading}
          handleDeleteTodo={handleDeleteTodo}
          onEdit={onEdit}
          loadingIds={loadingIds}
        />
      )}
    </section>
  );
};
