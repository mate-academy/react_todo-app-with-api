import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  onChangeCompleted: (todoId: number, completed: boolean) => void;
  onUpdateTitle: (todoId: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  onChangeCompleted,
  onUpdateTitle,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
        onChangeCompleted={onChangeCompleted}
        onUpdateTitle={onUpdateTitle}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        key={tempTodo.id}
        deleteTodo={deleteTodo}
        onChangeCompleted={onChangeCompleted}
        onUpdateTitle={onUpdateTitle}
      />
    )}
  </section>
);
