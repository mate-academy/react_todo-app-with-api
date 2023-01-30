import { FC } from 'react';

interface Props {
  title: string,
  showForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const TodoTitle: FC<Props> = ({ title, showForm }) => {
  const handleDoubleClick = () => {
    showForm(true);
  };

  return (
    (
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={handleDoubleClick}
      >
        {title}
      </span>
    )
  );
};
