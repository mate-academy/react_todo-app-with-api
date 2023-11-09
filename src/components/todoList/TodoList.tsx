import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';

type Props = {
  tempTodo: any,
  onDelete: (val: number) => void,
  onUpdate: (val: Todo) => Promise<Todo>,
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
  onDelete,
  onUpdate,
}) => {
  const { visibleTodos, isSubmitting } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {isSubmitting && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
