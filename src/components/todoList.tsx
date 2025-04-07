import { TodoItem } from './todoItem';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  filteredTodo: Todo[];
  removeTodo: (id: number) => void;
  loadingTodo: number[];
  todosStatusChange: (todos: Todo) => void;
  editTodoId: number | null;
  setEditTodoId: (value: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  removeTodo,
  loadingTodo,
  todosStatusChange,
  editTodoId,
  setEditTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            removeTodo={removeTodo}
            todo={todo}
            loadingTodo={loadingTodo}
            todosStatusChange={todosStatusChange}
            editTodoId={editTodoId}
            setEditTodoId={setEditTodoId}
          />
        );
      })}
    </section>
  );
};

TodoList.displayName = 'TodoList';
