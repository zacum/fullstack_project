import React from 'react';
import { Box, FormHelperText, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Help } from '@mui/icons-material';

const TooltipTitle = ({ title, tooltip }) => {
  return (
    <Box display="flex" alignItems="center">
      <FormHelperText sx={{ mr: 0.5 }}>{title}</FormHelperText>
      <StyledTooltip placement="top" title={tooltip}>
        <Help fontSize="inherit" color="primary" />
      </StyledTooltip>
    </Box>
  );
};

const StyledTooltip = withStyles(() => ({
  whiteSpace: 'pre-line',
  textAlign: 'left',
}))(Tooltip);

export default TooltipTitle;
