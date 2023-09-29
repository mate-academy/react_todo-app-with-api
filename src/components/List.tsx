import React from 'react';
import { Todo } from '../types/Todo';
import { Main } from './Main';

type Props = {
  filterTodos: Todo[];
  onTodoDelete?: (todoId: number) => void;
  onTodoRename?: (todo: Todo, newTitle: string) => void;
  isProcessing: number[];
  tempTodo: Todo | null;
  onToggleTodo?: (todo: Todo) => void;
};

export const List: React.FC<Props> = ({
  filterTodos,
  onTodoDelete = () => {},
  onTodoRename = () => {},
  isProcessing,
  tempTodo,
  onToggleTodo = () => {},
}) => {
  return (
    <section className="todoapp__main">
      {filterTodos.map(todo => (
        <Main
          todo={todo}
          key={todo.id}
          tempTodo={isProcessing ? null : tempTodo}
          onTodoDelete={onTodoDelete}
          onTodoRename={(newTitle) => onTodoRename(todo, newTitle)}
          isProcessing={isProcessing}
          onTodoToggle={async () => onToggleTodo(todo)}
        />
      ))}

      {tempTodo && !isProcessing && (
        <Main
          todo={tempTodo}
          tempTodo={null}
          isProcessing={isProcessing}
          onTodoToggle={async () => onToggleTodo(todo)}
        />
      )}
    </section>
  );
};
