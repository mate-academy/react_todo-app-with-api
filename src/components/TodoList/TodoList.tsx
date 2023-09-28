import { useState } from 'react';

import { getFilteredTodos } from '../../utils/utils';
import { TodoItem } from '../TodoItem';
import { useTodo } from '../../context/TodoContext';
import { useFilter } from '../../context/FilterContext';
import { useTodoTemp } from '../../context/TodoTempContext';
import { deleteTodo } from '../../api/todos';
import { useError } from '../../context/ErrorContext';
import { TodoEditItem } from '../TodoEditItem';
import { Todo } from '../../types/Todo';

type Props = {
  isActive: boolean;
  onHandleActive?: (value: boolean) => void;
  isToggleActive: number[];
};

export const TodoList: React.FC<Props> = ({
  isActive, isToggleActive,
}) => {
  const { todos, setTodos } = useTodo();
  const { selectedFilter } = useFilter();
  const { todoTemp } = useTodoTemp();
  const { setErrorMessage } = useError();

  const filteredTodos = getFilteredTodos(todos, selectedFilter);

  const [isLoading, setIsLoading] = useState(false);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [isDeleteActive, setIsDeleteActive] = useState(false);

  const handleDeleteTodo = (todo: Todo) => {
    setIsLoading(true);
    setIsDeleteActive(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(({ id }) => id !== todo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setIsDeleteActive(false);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        editedId === todo.id ? (
          <TodoEditItem
            key={todo.id}
            todo={todo}
            onEditedId={() => setEditedId(null)}
            onDelete={handleDeleteTodo}
            isLoading={isLoading}
            onLoad={setIsLoading}
          />
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDeleteTodo}
            onEditedId={setEditedId}
            isDeleteActive={isDeleteActive}
            onDeleteActive={setIsDeleteActive}
            isToggleActive={isToggleActive}
            isLoading={isLoading}
          />
        )
      ))}

      {todoTemp && (
        <TodoItem isLoading={isActive} todo={todoTemp} />
      )}
    </section>
  );
};
