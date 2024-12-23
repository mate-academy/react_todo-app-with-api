import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  handleDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  handleUpdateTodo: (todoToUpdate: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    handleDeleteTodo,
    loadingTodoIds,
    tempTodo,
    handleUpdateTodo,
  } = props;

  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          handleUpdateTodo={handleUpdateTodo}
          isInEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading
          handleUpdateTodo={handleUpdateTodo}
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};
