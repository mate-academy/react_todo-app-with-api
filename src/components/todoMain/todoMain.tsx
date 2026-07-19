/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/todoItem';

interface Props {
  visibleTodos: Todo[];
  processingIds: number[];
  deleteTodo: (id: number) => void;
  // Змінюємо тут, щоб приймати і id, і data
  onUpdate: (id: number, data: Partial<Todo>) => void;
}

export const TodoMain: React.FC<Props> = ({
  visibleTodos,
  processingIds,
  deleteTodo,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id || todo.title}
          todo={todo}
          // isProcessed тепер чітко відповідає boolean
          isProcessed={todo.id === 0 || processingIds.includes(todo.id)}
          // Передача onDelete (помилки лінтера не буде, бо ми додали це в інтерфейс)
          onDelete={() => deleteTodo(todo.id)}
          onUpdate={data => onUpdate(todo.id, data)}
        />
      ))}
    </section>
  );
};
