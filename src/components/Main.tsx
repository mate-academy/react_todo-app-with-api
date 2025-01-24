import { handleEdit, handleDelete } from '../functions';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoLoading } from './TodoLoading';

import { SetStateAction, useRef } from 'react';

interface MainProps {
  todos: Todo[];
  renderTodos: React.Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  newError: React.Dispatch<SetStateAction<string | null>>;
  setDeleting: React.Dispatch<React.SetStateAction<number[]>>;
  deleting: number[];
  handleFocus: () => void;
  editing: number | null;
  onEdit: React.Dispatch<SetStateAction<number | null>>;
}
export const Main: React.FC<MainProps> = ({
  todos,
  tempTodo,
  newError,
  renderTodos,
  setDeleting,
  deleting,
  handleFocus,
  editing,
  onEdit,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() =>
            handleDelete(todo, setDeleting, renderTodos, newError)
          }
          isDeleting={deleting.includes(todo.id)}
          handleFocus={handleFocus}
          onCheck={() =>
            handleEdit(
              todo,
              'completed',
              !todo.completed,
              setDeleting,
              renderTodos,
              newError,
            )
          }
          editing={editing}
          onEdit={onEdit}
          onInput={inputRef}
          onSubmit={(currentTodo: Todo) =>
            handleEdit(
              currentTodo,
              'title',
              currentTodo.title,
              setDeleting,
              renderTodos,
              newError,
              onEdit,
            )
          }
        />
      ))}
      {tempTodo && <TodoLoading title={tempTodo.title} />}
    </section>
  );
};
