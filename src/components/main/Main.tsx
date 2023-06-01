import { useState, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';
import { TempTodo } from '../todoItem/TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loadingID: number[];
  onUpdate: (
    id: number,
    complitedCurrVal: boolean,
  ) => void;
  editTodo: (
    newTitle: string,
    id: number,
    setEditInput: (input: string) => void,
    title: string,
  ) => void;
}
export const Main: React.FC<Props> = memo(({
  todos,
  tempTodo,
  onDelete,
  loadingID,
  onUpdate,
  editTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleSetEditingTodoId = (id: number | null) => {
    setEditingTodoId(id);
  };

  return (
    <section className="todoapp__main">
      {todos && todos.map(({
        title,
        id,
        completed,
      }) => (
        <TodoItem
          loadingID={loadingID}
          key={id}
          title={title}
          id={id}
          completed={completed}
          onDelete={onDelete}
          onIsComplitedUpdate={onUpdate}
          setEditingTodoId={handleSetEditingTodoId}
          editingTodoId={editingTodoId}
          editTodo={editTodo}
        />
      ))}
      {tempTodo && (
        <TempTodo tempTodo={tempTodo} />
      )}
    </section>
  );
});
