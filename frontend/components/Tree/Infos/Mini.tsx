import React, { useState, useEffect } from "react";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";

export interface ETKTreeInfosMiniProps {
  data?: number;
  showMore?: () => void;
}

const defaultProps: ETKTreeInfosMiniProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosMini: React.FC<ETKTreeInfosMiniProps> = ({
  data,
  showMore,
}) => {
  const classes = useStyles();
  const [displayData, setDisplayData] = useState(data);

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  return (
    <Box>
      <Typography>Mini</Typography>
      <Box>{displayData}</Box>
      <Button onClick={showMore}>Dis moi tout...</Button>
    </Box>
  );
};

ETKTreeInfosMini.defaultProps = defaultProps;

export default ETKTreeInfosMini;
