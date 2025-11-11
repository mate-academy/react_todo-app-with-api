import { Todo } from '../types/Todo';
import { TodoComp } from './TodoComp';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  isEditing: Todo['id'] | null;
  onDeleteTodo: (id: Todo['id']) => Promise<void>;
  loadingTodoIds: number[];
  onChangeTodoStatus: (id: Todo['id'], completed: boolean) => Promise<void>;
  onSetIsEditing: (todo: Todo | null) => void;
  query: string;
  onSetQuery: (value: string) => void;
  onUpdateTodo: (id: Todo['id'], query: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  isEditing,
  onDeleteTodo,
  loadingTodoIds,
  onChangeTodoStatus,
  onSetIsEditing,
  query,
  onSetQuery,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoComp
        key={todo.id}
        todo={todo}
        isEditing={isEditing === todo.id}
        isLoading={isLoading || loadingTodoIds.includes(todo.id)}
        onDeleteTodo={() => onDeleteTodo(todo.id)}
        onChangeTodoStatus={onChangeTodoStatus}
        onSetIsEditing={onSetIsEditing}
        query={query}
        onSetQuery={onSetQuery}
        onUpdateTodo={onUpdateTodo}
      />
    ))}
  </section>
);
