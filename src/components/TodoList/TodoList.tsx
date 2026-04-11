import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodos: number[];

  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;

  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessingTodos: React.Dispatch<React.SetStateAction<number[]>>;
  showError: (message: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingTodos,
  onDelete,
  onToggle,
  setTodos,
  setProcessingTodos,
  showError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => onToggle(todo)}
          processingTodos={processingTodos}
          setProcessingTodos={setProcessingTodos}
          setTodos={setTodos}
          showError={showError}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          processingTodos={[0]}
          setProcessingTodos={setProcessingTodos}
          setTodos={setTodos}
          showError={showError}
        />
      )}
    </section>
  );
};
