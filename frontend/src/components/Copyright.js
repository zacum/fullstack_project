import { Typography, Link } from '@mui/material';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" target={'_blank'} href="https://gunthy.org/">
        Gunthy
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
