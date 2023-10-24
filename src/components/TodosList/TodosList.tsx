import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../TodosContext';

type Props = {
  todos: Todo[],
  isDeleting: boolean,
  ToggleComplete: number[],
};

export const TodosList: React.FC<Props> = ({
  todos,
  isDeleting,
  ToggleComplete,
}) => {
  const { tempTodo } = useContext(TodosContext);

  const isProcessed = tempTodo !== null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isProcessed={(todo.completed && isDeleting)
              || (ToggleComplete[0] === -1)
              || (ToggleComplete.includes(todo.id))}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isProcessed={isProcessed}
            />
          </CSSTransition>
        )}

      </TransitionGroup>

    </section>
  );
};
