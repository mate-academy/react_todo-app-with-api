import { useContext, useMemo } from 'react';
import { TodosContext } from './TodosContext';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodosList: React.FC = () => {
  const { todos, status, tempTodo } = useContext(TodosContext);

  const filteredTodo = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
