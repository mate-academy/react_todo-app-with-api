import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterOptions } from '../../types/FilterOptions';
import { getFilteredTodos } from '../../utils/getFilteredTodos';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  filterOption: FilterOptions;
  loadingTodoIds: number[];
  editedTodoId: number | null;
  onTodoDelete: (id: number) => void;
  onTodoUpdate: (id: number, updatedTodo: Partial<Todo>) => void;
  onEditTodo: (id: number | null) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  filterOption,
  loadingTodoIds,
  editedTodoId,
  onTodoDelete,
  onTodoUpdate,
  onEditTodo,
}) => {
  const filteredTodos = getFilteredTodos(todos, filterOption);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          onTodoDelete={onTodoDelete}
          isEdited={editedTodoId === todo.id}
          onEditTodo={onEditTodo}
          onTodoUpdate={onTodoUpdate}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={true}
          isEdited={false}
        />
      )}
    </section>
  );
};
