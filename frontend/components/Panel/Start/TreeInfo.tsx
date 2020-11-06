import React, { useEffect, useState } from "react";
import { makeStyles, Grid, Table, TableCell, TableBody, TableRow, TableContainer, Paper } from "@material-ui/core";
import Wikipedia from "@/components/Panel/Start/Wikipedia";

export interface ETKPanelStartTreeInfoProps {
  tree: any;
  coordinates: [number, number]
}

const defaultProps: ETKPanelStartTreeInfoProps = {
  tree: {},
  coordinates: [0, 0]
};

const useStyles = makeStyles(() => ({
  root: {
    width: "25rem",
    height: "100%",
  },
}));

interface Tree {
  gender: string;
}

const ETKPanelStartTreeInfo: React.FC<ETKPanelStartTreeInfoProps> = (props) => {
  const classes = useStyles();
  const [properties, setProperties] = useState({} as any);

  useEffect(() => {
    if (props.tree.properties) {
      try {
        let newProperties = JSON.parse(props.tree.properties)

        setProperties({ id: props.tree.id, lng: props.coordinates[0], lat: props.coordinates[1], ...newProperties })
      } catch (e) { }
    } else if (props.tree.other_tags) {
      try {
        let newProperties = JSON.parse(`{${props.tree.other_tags.replaceAll("=>", ":")}}`)

        setProperties({ osm_id: props.tree.osm_id, lng: props.coordinates[0], lat: props.coordinates[1], ...newProperties })
      } catch (e) { }
    } else {
      setProperties(props.tree)
    }
  }, [props.tree])

  return <Grid container className={classes.root} direction="column" spacing={2}>
    <Grid item>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {Object.keys(properties).map((key) => (
              <TableRow key={`psti-${key}`}>
                <TableCell>{key}</TableCell>
                <TableCell align="right">{properties[key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    <Grid item>
      <Wikipedia genre={properties.gender} />
    </Grid>
  </Grid>;
};

ETKPanelStartTreeInfo.defaultProps = defaultProps;

export default ETKPanelStartTreeInfo;
