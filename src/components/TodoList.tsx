import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type FilterProps = {
  filteredTodo: Todo[];
  deleteTodo: (todoId: number) => void;
  tempoTodo: Todo | null;
  todoDelete: number[];
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  toggleLoader: boolean;
};
export const TodoList: React.FC<FilterProps> = ({
  filteredTodo,
  deleteTodo,
  tempoTodo,
  todoDelete,
  updateTodo,
  toggleLoader,
}) => {
  const [isEditingTodoId, setIsEditingTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          isLoading={todoDelete.includes(todo.id)}
          updateTodo={updateTodo}
          toggleLoader={toggleLoader}
          isEditing={isEditingTodoId === todo.id}
          setIsEditingTodoId={setIsEditingTodoId}
        />
      ))}
      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          key={tempoTodo.id}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          isLoading={true}
          updateTodo={updateTodo}
          toggleLoader={toggleLoader}
          isEditing={isEditingTodoId === tempoTodo.id}
          setIsEditingTodoId={setIsEditingTodoId}
        />
      )}
    </section>
  );
};
