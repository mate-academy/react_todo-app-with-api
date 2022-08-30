// Mui
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Work Sans',
      'sans-serif',
      '-apple-system'
    ].join(',')
  },
  palette: {
    primary: {
      main: '#53B8E0',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          background: `linear-gradient(315deg, #3D98BF 0%, #53B8E0 100%)`,
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontSize: '14px',
          lineHeight: '24px',
          fontWeight: 600,
          textTransform: 'capitalize'
        },
        contained: {
          background: `linear-gradient(315deg, #3D98BF 0%, #53B8E0 100%)`,
          color: 'white',
          transition: 'initial',
          '&:hover': {
            background: '#53B8E0',
          }
        },
        outlined: {
          border: `1px solid #53B8E0`,
        }
      }
    },
    MuiIconButton: {
      variants: [
        {
          props: { color: 'primary' },
          style: {
            border: `1px solid #53B8E0`,
            padding: '7px',
            '&:disabled': {
              borderColor: 'rgba(0,0,0,0.12)'
            }
          }
        }
      ],
      styleOverrides: {
        root: {
          borderRadius: '4px'
        }
      }
    }
  },
});

export default theme;
