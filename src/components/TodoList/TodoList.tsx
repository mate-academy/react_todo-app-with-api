import React from 'react';

import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/FilterEnum';
import { getFilteredTodos } from '../../utils/getFilteredTodos';

interface Props {
  todos: Todo[];
  filter: Filter;
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, updates: Partial<Todo>) => void;
  loadingTodoIds: number[];
  renameTodo: (
    todoId: number,
    updateChanges: string,
    todoTitle: string,
  ) => void;
  editingTodo: Todo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  onDelete,
  toggleTodo,
  loadingTodoIds,
  renameTodo,
  editingTodo,
  setEditingTodo,
}) => {
  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          toggleTodo={toggleTodo}
          loadingTodoIds={loadingTodoIds}
          renameTodo={renameTodo}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
        />
      ))}
    </section>
  );
};
