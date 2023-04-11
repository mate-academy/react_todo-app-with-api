import { FC, useState } from 'react';

interface EditableSpanProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export const EditableSpan: FC<EditableSpanProps> = ({
  title,
  onTitleChange,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const handleEditChange = () => {
    setIsEdit(!isEdit);
  };

  const handleTitleChange = (newTitle: string) => {
    onTitleChange(newTitle);
  };

  return (
    <>
      {isEdit
        ? (
          <input
            className="todo__title-field"
            type="text"
            value={title}
            onBlur={handleEditChange}
            onChange={(event) => handleTitleChange(event.target.value)}
          />
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={handleEditChange}
          >
            {title}
          </span>
        )}
    </>
  );
};
