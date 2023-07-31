import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  preparedTodos: Todo[],
  tempTodo: Todo | null,
  deleteCurrentTodo: (todoId: number) => Promise<void>,
  onChangeIds: number[] | null,
  setOnChangeIds: React.Dispatch<React.SetStateAction<number[] | null>>,
  updateCurrentTodo: (todo: Todo, title: string) => Promise<void>,
};

export const TodoList: React.FC<Props> = memo(({
  preparedTodos,
  tempTodo,
  deleteCurrentTodo,
  onChangeIds,
  setOnChangeIds,
  updateCurrentTodo,
}) => {
  const handleClickRemove = (todoId: number) => {
    setOnChangeIds([todoId]);

    deleteCurrentTodo(todoId)
      .finally(() => setOnChangeIds(null));
  };

  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
        <TodoItem
          todo={todo}
          onChangeIds={onChangeIds}
          setOnChangeIds={setOnChangeIds}
          handleRemove={handleClickRemove}
          updateCurrentTodo={updateCurrentTodo}
          key={todo.id}
        />
      ))}

      {!!tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
});
