import { apiRest } from "@/lib/api";
import { Button, Typography } from "@material-ui/core";
import { FC, Fragment } from "react";
import { useQuery } from "react-query";
import RoomIcon from "@material-ui/icons/Room";
import InterventionsTable from "../../Interventions/InterventionsTable";

const Summary: FC<{
  id: number;
  showMore: () => void;
}> = ({ id, showMore }) => {
  const { data: tree } = useQuery(
    `tree_${id}`,
    async () => {
      console.log(id);
      const data = await apiRest.trees.get(id);
      console.log(data);
      return data;
    },
    {
      enabled: Boolean(id),
    }
  );
  const { data: interventions } = useQuery(
    `tree_${id}_interventions_summary`,
    async () => {
      const data = await apiRest.trees.getInterventions(id);
      return data.slice(0, 5);
    },
    {
      enabled: Boolean(id),
    }
  );
  return (
    <Fragment>
      <Typography color="textPrimary" component="h3">
        {tree?.family}
      </Typography>
      <Typography color="textPrimary" component="b">
        <RoomIcon />
        {tree?.address}
      </Typography>
      {interventions && <InterventionsTable interventions={interventions} />}
      <Button variant="contained" onClick={showMore}>
        Plus de détails
      </Button>
    </Fragment>
  );
};

export default Summary;
