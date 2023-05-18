import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isDeleting: (id: number) => void;
  isChanging: (todo: Todo) => void;
  areAllCompleted: boolean;
  areAllToogling: boolean;
  areAllRemoving: boolean;
};

export const TodoList: FC<Props> = ({
  todos,
  isDeleting,
  isChanging,
  areAllCompleted,
  areAllToogling,
  areAllRemoving,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={isDeleting}
        isChanging={isChanging}
        areAllCompleted={areAllCompleted}
        areAllToogling={areAllToogling}
        areAllRemoving={areAllRemoving}
      />
    ))}
  </section>
);
