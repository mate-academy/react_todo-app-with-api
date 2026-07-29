import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ErrorState } from '../../types/ErrorState';
import { useEffect } from 'react';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoToggle: (todoId: number, completed: boolean) => Promise<void>;
  onTodoTitleUpdate: (todoId: number, title: string) => Promise<void>;
  onError: (error: ErrorState) => void;
  todosToDelete: number[] | null;
  newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoList = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
  onTodoTitleUpdate,
  onError,
  todosToDelete,
  newTodoField,
}: Props) => {
  useEffect(() => {
    newTodoField.current?.focus();
  }, [todos.length, newTodoField]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todoId={todo.id}
          title={todo.title}
          completed={todo.completed}
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
          onTodoTitleUpdate={onTodoTitleUpdate}
          onError={onError}
          todosToDelete={todosToDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todoId={tempTodo.id}
          title={tempTodo.title}
          completed={tempTodo.completed}
          onTodoDelete={onTodoDelete}
          onTodoToggle={onTodoToggle}
          onTodoTitleUpdate={onTodoTitleUpdate}
          onError={onError}
          todosToDelete={todosToDelete}
          tempTodo
        />
      )}
    </section>
  );
};
