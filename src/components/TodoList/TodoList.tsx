import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { FilterType } from '../../types/FilterEnum';
import { filteredTodoList } from '../../utils/helpers';

type Props = {
  todos: Todo[];
  filter: FilterType;
  loadingIds: number[];
  onDeleteTodo: (id: number) => void
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
  temporaryTodo: Todo | undefined;
};

export const ToodoList: React.FC<Props> = ({
  todos,
  filter,
  loadingIds,
  onDeleteTodo,
  onUpdateTodo,
  temporaryTodo,
}) => {
  const filteredTodos = filteredTodoList(todos, filter);

  return (
    <>
      <section>
        {filteredTodos.map((todo: Todo) => {
          const isLoading = loadingIds.some(id => id === todo.id);

          return (
            <TodoInfo
              isLoading={isLoading}
              key={todo.id}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
              todo={todo}
            />
          );
        })}
      </section>

      {temporaryTodo && (
        <TodoInfo
          isLoading
          onUpdate={() => {}}
          todo={temporaryTodo}
          key={temporaryTodo.id}
          onDelete={() => {}}
        />
      )}
    </>
  );
};
