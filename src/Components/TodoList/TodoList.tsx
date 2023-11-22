import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../GlobalStateProvier';

export const TodoList: React.FC = () => {
  const {
    visibleTodos,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isTemp={false}
        />
      ))}
    </section>
  );
};
