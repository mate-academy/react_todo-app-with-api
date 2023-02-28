import React from 'react';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';
import { TodoItem } from '../Todoitem';

interface Props {
  visibleTodos: Todo[]
  tempTodo: null | TempTodo
  onButtonRemove: (id: number) => void
  loadingTodoIds: number[]
  ToggleStatusCompleted: (id: number, status: boolean) => void
  updateTitle: (id: number, newTitle: string) => void
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    visibleTodos,
    tempTodo,
    onButtonRemove,
    loadingTodoIds,
    ToggleStatusCompleted,
    updateTitle,
  }) => {
    return (
      <section className="todoapp__main">
        {visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onButtonRemove={onButtonRemove}
            loadingTodoIds={loadingTodoIds}
            ToggleStatusCompleted={ToggleStatusCompleted}
            updateTitle={updateTitle}
          />
        ))}

        {tempTodo && (
          <>
            <TodoItem
              key={tempTodo?.id}
              todo={tempTodo}
              onButtonRemove={onButtonRemove}
              loadingTodoIds={loadingTodoIds}
              ToggleStatusCompleted={ToggleStatusCompleted}
              updateTitle={updateTitle}
            />
          </>
        )}
      </section>
    );
  },
);
