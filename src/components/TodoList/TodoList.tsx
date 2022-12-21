import React, { useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';

import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  status: string,
  newTodoTitle: string,
  isAdding: boolean,
  onDelete: (todoId: number) => void,
  onToggle: (todo: Todo) => Promise<void>,
  onUpdate: (todo: Todo, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  status,
  newTodoTitle,
  isAdding,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const user = useContext(AuthContext);

  const tempTodo = {
    id: 0,
    title: newTodoTitle,
    userId: user?.id || 0,
    completed: false,
  };

  const getFilteredTodos = useCallback((): Todo[] => {
    return todos.filter(todo => {
      switch (status) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        case 'all':
        default:
          return todos;
      }
    });
  }, [todos, status]);

  const filteredTodos = useMemo(
    getFilteredTodos,
    [todos, status],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onToggle={onToggle}
          />
        );
      })}

      {isAdding && (
        <TodoItem
          todo={tempTodo}
          isAdding={isAdding}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggle={onToggle}
        />
      )}
    </section>
  );
};
