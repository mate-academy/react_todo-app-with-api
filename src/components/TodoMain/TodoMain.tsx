import React from 'react';
import { Todo } from '../../types/Todo';
import { Task } from '../Task/Task';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  deleteTodo: (id: string) => Promise<void>
  spinnerForAll:boolean
  updateTodo: (id: number, checkStatus: Partial<Todo>)
  => Promise<void>
};

const TodoMain: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  spinnerForAll,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((task) => (
        <Task
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          key={task.id}
          loading={spinnerForAll}
          todo={task}
        />
      ))}

      {tempTodo && <Task todo={tempTodo} loading />}
    </section>
  );
});

export { TodoMain };
