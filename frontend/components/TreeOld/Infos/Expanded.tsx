import React, { createRef } from "react";
import {
  Button,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import TreeAccordion, {
  TTreeAccordion,
} from "@/components/TreeOld/TreeAccordion";
import { TIntervention } from "@/components/Interventions/Schema";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { Tree } from "@/index";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useTranslation } from "react-i18next";

export interface ETKTreeInfosExpandedProps {
  open: boolean;
  tree?: Tree;
  interventions?: TIntervention[];
  onChange?: (newTree: Tree) => void;
  onClose?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {
  open: false,
};

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = (props) => {
  const [scroll, setScroll] = React.useState("paper");
  const treeAccordionRef = createRef<TTreeAccordion>();
  const { user, organization } = useAppContext();
  const { t } = useTranslation("common");

  const { apiETK } = useApi().api;

  const handlerOnSave = async () => {
    try {
      const properties = treeAccordionRef.current.getValues();

      const {
        status,
        data,
      } = await apiETK.put(
        `/organization/${organization.id}/trees/${props.tree.id}`,
        { properties }
      );

      if (status === 200) {
        const newTree = data as Tree;

        if (props.onChange) {
          props.onChange(newTree);
        }
      }
    } catch (error) {}
  };

  return (
    <Dialog maxWidth="xl" open={props.open} fullWidth>
      <DialogContent dividers={scroll === "paper"}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper>
              <TreeAccordion ref={treeAccordionRef} tree={props.tree} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <InterventionsTable
                interventions={props.interventions}
                tree={props.tree}
                onNewIntervention={props.onClose}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlerOnSave()}
            >
              {t("buttons.save")}
            </Button>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button onClick={props.onClose}>{t("buttons.cancel")}</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;