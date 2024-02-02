import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

interface Props {
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  tempTodo,
}) => {
  const { filteredTodos } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        {filteredTodos.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
        {tempTodo && (
          <TempTodo />
        )}

      </ul>
    </section>
  );
};
