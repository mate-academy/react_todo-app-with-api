import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { useTodoContext } from './GlobalProvider';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useTodoContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return <TodoItem todo={todo} key={todo.id} />;
      })}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
