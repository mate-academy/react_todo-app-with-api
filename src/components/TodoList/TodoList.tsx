import React from 'react';
import { TodoComponent } from '../TodoComponent/TodoComponent';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  selectedTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTitle: (data: Todo) => Promise<boolean | undefined>;
  handleUpdateCompleted: (data: Todo, bool?: boolean) => Promise<Todo>;
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    loading,
    inputRef,
    selectedTodo,
    deleteTodo,
    handleUpdateTitle,
    handleUpdateCompleted,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoComponent
            todo={todo}
            key={todo.id}
            loading={loading}
            inputRef={inputRef}
            deleteTodo={deleteTodo}
            selectedTodo={selectedTodo}
            handleUpdateTitle={handleUpdateTitle}
            handleUpdateCompleted={handleUpdateCompleted}
          />
        ))}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
