import { FC, useMemo } from 'react';
import { Todo, FilterOption } from '../../types';
import { getFilteredTodos } from '../../utils';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  filterOption: FilterOption;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingTodoIds: number[];
  isNewTodoLoading: boolean;
  editingTodoId: number | null;
  onStartEditing: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onUpdateTitle: (todo: Todo, title: string) => void;
  setEditingTodoId: (id: number | null) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  filterOption,
  tempTodo,
  onDelete,
  loadingTodoIds,
  isNewTodoLoading,
  editingTodoId,
  onStartEditing,
  onToggleStatus,
  onUpdateTitle,
  setEditingTodoId,
}) => {
  const filtredTodos = useMemo(
    () => getFilteredTodos(todos, filterOption),
    [todos, filterOption],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!!todos.length &&
        filtredTodos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingTodoId === todo.id}
              isLoading={loadingTodoIds.includes(todo.id)}
              onDelete={onDelete}
              onStartEditing={onStartEditing}
              onToggleStatus={onToggleStatus}
              onUpdateTitle={onUpdateTitle}
              setEditingTodoId={setEditingTodoId}
            />
          );
        })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isEditing={false}
          isLoading={isNewTodoLoading}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
