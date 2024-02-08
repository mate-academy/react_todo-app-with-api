import { useContext } from 'react';
import { TodosContext } from '../TodoContext/TodoContext';
import { TodoTitleField } from '../TodoTitleField';

export const TodoList:React.FC = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.length !== 0 && (
        filteredTodos.map((todo) => (
          <TodoTitleField
            todo={todo}
            key={todo.id}
          />
        ))
      )}
      {tempTodo
        && (
          <TodoTitleField
            todo={tempTodo}
          />
        )}
    </section>
  );
};
