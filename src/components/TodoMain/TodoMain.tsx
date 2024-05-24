/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext } from 'react';
import { AppContext, applyFilter } from '../../context/AppContext';
import { Todo } from '../Todo/Todo';

export const TodoMain: React.FC = () => {
  const { state } = useContext(AppContext);
  const { tempTodo, todos } = state;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {applyFilter(todos, state.filter).map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}
      {tempTodo && <Todo todo={tempTodo} key={tempTodo.id} isTemporary />}
    </section>
  );
};

TodoMain.displayName = 'TodoMain';
