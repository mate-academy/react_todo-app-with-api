import { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  query: string;
  onRemoveTodo: (todoId: number) => void;
  isLoadingList: number[];
  onUpdateStatus: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  query,
  onRemoveTodo,
  isLoadingList,
  onUpdateStatus,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onRemoveTodo={onRemoveTodo}
              isProcessing={isLoadingList.includes(todo.id)}
              onUpdateStatus={onUpdateStatus}
            />
          </CSSTransition>

        ))}

        {isAdding
      && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={{
              id: 0,
              title: query,
              completed: false,
              userId: user?.id || 0,
            }}
            onRemoveTodo={onRemoveTodo}
            onUpdateStatus={onUpdateStatus}
            isProcessing
          />
        </CSSTransition>

      )}
      </TransitionGroup>
    </section>
  );
};
