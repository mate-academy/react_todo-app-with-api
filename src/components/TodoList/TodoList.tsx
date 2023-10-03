import React, { useContext } from 'react';
import { TodoElement } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../utils/TodoContext';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
}) => {
  const { tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoElement
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo !== null && (
        <TodoElement
          todo={tempTodo}
        />
      )}
    </section>
  );
};
