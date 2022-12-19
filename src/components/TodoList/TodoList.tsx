import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (deletingTodoId: number) => void,
  isAdding: boolean,
  onTodoSelect: (todo: Todo) => void,
  onChangeTitle: (todo: Todo, newTitle: string) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isAdding,
  onTodoSelect,
  onChangeTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onTodoSelect={onTodoSelect}
          onChangeTitle={onChangeTitle}
        />
      ))}

      {isAdding && (
        <TodoItem
          todo={{
            id: 0,
            title: 'Updating data...',
            completed: false,
            userId: user?.id,
          }}
          onChangeTitle={onChangeTitle}
          onTodoSelect={onTodoSelect}
          onDelete={onDelete}
          isAdding={isAdding}
        />
      )}
    </section>
  );
};
