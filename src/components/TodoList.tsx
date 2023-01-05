import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './Todo';

interface Props {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  isLoading: number[],
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  tempTodo,
  isLoading,
  onDelete,
  onToggle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {
      visibleTodos
        .map((todo) => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))
    }

    {
      tempTodo && (
        <TodoComponent
          todo={tempTodo}
          isLoading={isLoading}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      )
    }
  </section>
);
