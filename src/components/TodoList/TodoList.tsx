import { useContext, useState } from 'react';

import { getFilteredTodos } from '../../utils/utils';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../context/TodoContext';
import { FilterContext } from '../../context/FilterContext';
import { TodoTempContext } from '../../context/TodoTempContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../../context/ErrorContext';
import { TodoEditItem } from '../TodoEditItem';
import { TodoTempItem } from '../TodoTempItem';
import { Todo } from '../../types/Todo';

type Props = {
  isActive: boolean;
  onHandleActive?: (value: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  isActive,
}) => {
  const { todos, setTodos } = useContext(TodoContext);
  const { selectedFilter } = useContext(FilterContext);
  const { todoTemp } = useContext(TodoTempContext);
  const { setErrorMessage } = useContext(ErrorContext);

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
            onLoad={(value) => setIsLoading(value)}
          />
        ) : (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDeleteTodo}
            onEditedId={setEditedId}
            isDeleteActive={isDeleteActive}
            onDeleteActive={(value) => setIsDeleteActive(value)}
          />
        )
      ))}

      {todoTemp && (
        <TodoTempItem isActive={isActive} />
      )}
    </section>
  );
};
