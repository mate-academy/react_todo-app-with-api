import { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';
import { todosStatusMap } from '../utils/todosStatusMap';

export const TodosList: React.FC = () => {
  const { todos, status, tempTodo } = useContext(TodosContext);
  const filtered = useMemo(() => todosStatusMap(todos)[status](),
    [todos, status]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtered.map((todo: Todo) => (
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
