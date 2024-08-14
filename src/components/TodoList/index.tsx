import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Todos } from '../Todos';

type Props = {
  todos: Todo[];
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
};

export const ToDoList: React.FC<Props> = ({
  todos,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onError,
  onIdTodo,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (updateTodo: Todo | null) => {
    setIsSubmitting(true);
    onError('');
    onLoading(true);
    if (updateTodo) {
      onIdTodo(updateTodo.id);

      if (!updateTodo.title.trim()) {
        try {
          await onDelete(updateTodo.id);
        } finally {
          setIsSubmitting(false);
          onIdTodo(0);
          onLoading(false);
        }
      } else {
        const todoActual = todos.find(item => item.id === updateTodo.id);

        if (todoActual && updateTodo.title === todoActual.title) {
          setIsSubmitting(false);
          onLoading(false);

          return;
        }

        try {
          await onUpdate({ ...updateTodo, title: updateTodo.title.trim() });
        } finally {
          setIsSubmitting(false);
          onIdTodo(0);
          onLoading(false);
        }
      }
    } else {
      onLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todos
          todos={todos}
          todo={todo}
          key={todo.id}
          idTodo={idTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onLoading={onLoading}
          onError={onError}
          onIdTodo={onIdTodo}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      ))}
    </section>
  );
};
