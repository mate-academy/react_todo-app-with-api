import { FC, memo, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { TodoComponent } from './Todo';

export const TodoList: FC = memo(
  () => {
    const {
      visibleTodos,
      temporaryTodo,
    } = useContext(GlobalContext);

    return (
      <section className="todoapp__main" data-cy="TodoList">
        {
          visibleTodos
            .map((todo) => (
              <TodoComponent
                key={todo.id}
                todo={todo}
              />
            ))
        }

        {
          temporaryTodo && (
            <TodoComponent
              todo={temporaryTodo}
            />
          )
        }
      </section>
    );
  },
);
