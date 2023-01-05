import { FC } from 'react';

interface Props {
  title: string
}

export const TodoTitle: FC<Props> = ({ title }) => (
  <span
    data-cy="TodoTitle"
    className="todo__title"
  >
    {title}
  </span>
);
