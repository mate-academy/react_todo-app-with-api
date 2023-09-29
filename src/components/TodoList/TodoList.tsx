import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext';

export const TodoList = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodosContext);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </section>

      {tempTodo && (
        <TodoItem
          key={tempTodo?.id}
          todo={tempTodo}
        />
      )}
    </>
  );
};
