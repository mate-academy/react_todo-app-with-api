import { FC } from 'react';
// Mui
import { Typography } from '@mui/material';

type Props = {
  children: string;
};

const Title:FC<Props> = ({
  // Props
  children,
}) => {
  return (
    <Typography sx={{
      color: 'rgba(0,0,0,0.87)',
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: '-0.35px',
      mr: '16px',
    }}
    >
      {children}
    </Typography>
  );
};

export default Title;
