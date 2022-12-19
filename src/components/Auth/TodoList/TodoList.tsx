import { useContext } from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem';
import { AuthContext } from '../AuthContext';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  onUpdate: (todo: Todo) => void,
  isProcessed: number[],
  isAdding: boolean,
  title: string,
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    onDelete,
    onUpdate,
    isProcessed,
    isAdding,
    title,
  } = props;
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading={isProcessed.includes(todo.id)}
          title={title}
        />
      ))}

      {isAdding && user && (
        <TodoItem
          todo={{
            id: 0,
            title,
            completed: false,
            userId: user?.id,
          }}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isLoading
          title={title}
        />
      )}
    </section>
  );
};
