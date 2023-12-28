import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getFilteredTodos, getHash } from '../../../libs/helpers';
import { StateContext } from '../../../libs/state';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../../libs/types';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useContext(StateContext);

  const [filteredTodos, setFilterdTodos] = useState<Todo[]>([]);

  const updateFilteredTodos = useCallback((updatedTodos: Todo[]) => {
    const filterHash = getHash();
    const filtered = getFilteredTodos(updatedTodos, filterHash);

    setFilterdTodos(filtered);
  }, []);

  useEffect(() => {
    updateFilteredTodos(todos);
  }, [todos, updateFilteredTodos]);

  useEffect(() => {
    const handleHashChange = () => {
      updateFilteredTodos(todos);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [todos, updateFilteredTodos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(item => (
          <CSSTransition
            key={item.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              item={item}
            />
          </CSSTransition>
        ))}
        {!!tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem item={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
