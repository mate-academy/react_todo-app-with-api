import { useContext } from 'react';
import { FooterContext } from '../../../context/FooterContext';

// interface Props {
//   count: number;
// }

export const TodoCount: React.FC = () => {
  const { notCompletedTodoCount } = useContext(FooterContext);

  return (
    <span className="todo-count">
      {`${notCompletedTodoCount} items left`}
    </span>
  );
};
