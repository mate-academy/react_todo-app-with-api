import { FC } from 'react';
import { Todo, UpdateTodoFragment } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onChange: (todoId: number, status: UpdateTodoFragment) => void;
  onDelete: (todoId: number) => void;
}

export const TodoList: FC<Props> = (props) => {
  const { todos, onChange, onDelete } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            onChange={onChange}
            onDelete={onDelete}
            key={todo.id}
          />
        );
      })}

    </section>
  );
};
