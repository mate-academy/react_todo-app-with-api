import React from 'react';

import { TodoItem } from '../TodoItem/TodoItem';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTodoDeleting: boolean;
  selectedTodoId: number[];
  isTodoUpdating: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  onUpdateTodo: (todoId: number, newData: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    isTodoDeleting,
    selectedTodoId,
    isTodoUpdating,
    newTodoField,
    onUpdateTodo,
    onDeleteTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isTodoDeleting={isTodoDeleting}
          selectedTodoId={selectedTodoId}
          isTodoUpdating={isTodoUpdating}
          newTodoField={newTodoField}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          temporary
        />
      )}
    </section>
  );
};
