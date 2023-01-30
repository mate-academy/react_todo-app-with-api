/* eslint-disable operator-linebreak */
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';
import { useTodoContext } from '../../store/todoContext';

export const TodoList = () => {
  const { todos, todoLength, tempTodo } = useTodoContext();

  if (todoLength === 0) {
    return null;
  }

  return (
    <>
      <section
        className="todoapp__main"
        data-cy="TodoList"
      >
        {todos.length > 0 &&
          todos.map(todo => (
            <TodoItem
              key={`todo__${todo.id}`}
              todo={todo}
            />
          ))}

        {tempTodo && <TodoItem todo={tempTodo} />}
      </section>
      <TodoFooter />
    </>
  );
};
