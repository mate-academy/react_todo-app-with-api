import { FC } from 'react';
import { Todo } from '../../types/types';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  activeIds: number[];
  handleRemoveTodo: (id: number) => void;
  handleCheckboxClick: (todo: Todo) => void;
};

export const TodoList: FC<Props> = ({
  visibleTodos,
  tempTodo,
  activeIds,
  handleRemoveTodo,
  handleCheckboxClick,
}) => (
  <section className="todoapp__main">
    {visibleTodos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        activeIds={activeIds}
        handleRemoveTodo={handleRemoveTodo}
        handleCheckboxClick={handleCheckboxClick}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={activeIds[0]}
        activeIds={activeIds}
        handleRemoveTodo={handleRemoveTodo}
        handleCheckboxClick={handleCheckboxClick}
      />
    )}
  </section>
);
