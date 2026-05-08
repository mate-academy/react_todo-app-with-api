import React, { useEffect, useState } from 'react';
import '../../../../shared/styles/index.scss';
import { Todo } from '../../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  updateTodoTitle: (todoId: number, todoTitle: string) => void;
  toggleTodoStatus: (todoId: number, todoCompleted: boolean) => void;
  updatingTodos: number[];
  tempTodo: Todo | null;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  deleteTodo,
  updateTodoTitle,
  toggleTodoStatus,
  updatingTodos,
  tempTodo,
  selectedTodo,
  setSelectedTodo,
}) => {
  const [updatingTodoTitle, setUpdatingTodoTitle] = useState<string>('');

  useEffect(() => {
    const handleEscapeKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedTodo(null);
      }
    };

    window.addEventListener('keyup', handleEscapeKeyUp);

    return () => window.removeEventListener('keyup', handleEscapeKeyUp);
  }, [setSelectedTodo]);

  const handleSubmitEditTodos = (todo: Todo) => {
    updateTodoTitle(todo.id, updatingTodoTitle);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodoStatus={toggleTodoStatus}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          updatingTodoTitle={updatingTodoTitle}
          setUpdatingTodoTitle={setUpdatingTodoTitle}
          deleteTodo={deleteTodo}
          handleSubmitEditTodos={handleSubmitEditTodos}
          updatingTodos={updatingTodos}
        />
      ))}
      <TempTodo tempTodo={tempTodo} />
    </section>
  );
};
