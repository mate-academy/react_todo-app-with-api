import React from 'react';

import { TempTodo } from '../TempTodo/TempTodo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
  onToggleTodo: (todoId: number, isCompleted: boolean) => void;
  selectedTodoId: number[];
  isAdding: boolean;
  onChangeTodoTitle: (todoId: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTitle,
  onDeleteTodo,
  deletedTodoIds,
  onToggleTodo,
  selectedTodoId,
  isAdding,
  onChangeTodoTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        deletedTodoIds={deletedTodoIds}
        onToggleTodo={onToggleTodo}
        onChangeTodoTitle={onChangeTodoTitle}
        selectedTodoId={selectedTodoId}
      />
    ))}

    {isAdding && <TempTodo todoTitle={todoTitle} />}
  </section>
);
