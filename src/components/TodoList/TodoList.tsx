import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  todosWithLoader: Todo[],
  tempTodo: Todo | null,
  removeTodo: (todo: Todo) => void,
  changeStatus: (todoChangeStatus: Todo) => void,
  changeTitle: (todoChangeTitle: Todo, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  removeTodo,
  changeStatus,
  changeTitle,
  todosWithLoader,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        removeTodo={removeTodo}
        changeStatus={changeStatus}
        changeTitle={changeTitle}
        isProcessed={todosWithLoader.includes(todo)}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        removeTodo={removeTodo}
        changeStatus={changeStatus}
        changeTitle={changeTitle}
        isProcessed
      />
    )}
  </section>
));
