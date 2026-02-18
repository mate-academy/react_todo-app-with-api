import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessage } from '../../types/ErrorMessages';
import { useState } from 'react';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  processingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  focusInput?: () => void;
};

export const TodosList = ({
  todos,
  filteredTodos,
  tempTodo,
  setProcessingIds,
  processingIds,
  setTodos,
  setErrorMessage,
  focusInput,
}: TodosListProps) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const onStartEditing = (id: number) => {
    setEditingTodoId(id);
  };

  const onCancelEditing = () => {
    setEditingTodoId(null);
  };

  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              setProcessingIds={setProcessingIds}
              processingIds={processingIds}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              focusInput={focusInput}
              isEditing={editingTodoId === todo.id}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              processingIds={processingIds}
              setProcessingIds={setProcessingIds}
            />
          )}
        </section>
      )}
    </>
  );
};
