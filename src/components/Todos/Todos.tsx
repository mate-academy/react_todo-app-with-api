import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAppContext } from '../../context/useAppContext';
import { TodoItem } from '../TodoItem/TodoItem';

export const Todos = () => {
  const {
    state: {
      filteredTodos,
      tempTodo,
    },
    actions: {
      deleteTodo,
      updateTodo,
    },
  } = useAppContext();

  const [parent] = useAutoAnimate<HTMLElement>({
    duration: 150,
    easing: 'ease-out',
  });

  return (
    <section
      ref={parent}
      className="todoapp__main"
      data-cy="TodoList"
    >
      {filteredTodos && filteredTodos.map((todo) => (
        <TodoItem
          onRemove={() => deleteTodo(todo.id)}
          onStatusChange={() => updateTodo({
            id: todo.id,
            completed: !todo.completed,
          })}
          onEditing={(value) => {
            if (value === todo.title) {
              return;
            }

            if (!value || !value.trim()) {
              deleteTodo(todo.id);

              return;
            }

            updateTodo({
              id: todo.id,
              title: value,
            });
          }}
          todo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
