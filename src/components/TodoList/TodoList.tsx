import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  visibleTodos: Todo[];
  handleToggleCompleted: (todoId: number, completed: boolean) => void;
  handleRemoveTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  handleChangeTitle: (todoId: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleToggleCompleted,
  handleRemoveTodo,
  tempTodo,
  isLoading,
  handleChangeTitle,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleRemoveTodo={handleRemoveTodo}
          handleToggleCompleted={handleToggleCompleted}
          handleChangeTitle={handleChangeTitle}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} isLoading={isLoading} />}
    </section>
  );
};
