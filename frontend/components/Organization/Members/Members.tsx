import { FC, Fragment, useState, useRef, useEffect } from "react";
import { IOrganization } from "@/index.d";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Toolbar, useMediaQuery } from "@material-ui/core";
import { Block as BlockIcon, Add as AddIcon } from "@material-ui/icons";
import { useAppLayout } from "@/components/AppLayout/Base";
import { composeInitialProps, useTranslation } from "react-i18next";
import { apiRest } from "@/lib/api";
import useAPI from "@/lib/useApi";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AddMembers, {
  AddMembersActions,
} from "@/components/Organization/Members/AddMembers";
import MembersTable from "@/components/Organization/Members/MembersTable";
import { IMember } from "@/index";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  toolbar: {
    flexDirection: "row",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
interface MembersProps {
  organization: IOrganization;
  value: string | string[];
  index: string;
}

const Members: FC<MembersProps> = ({ organization }) => {
  const classes = useStyles();
  const { theme } = useThemeContext();
  const { dialog, snackbar } = useAppLayout();
  const { api } = useAPI();
  const { apiETK } = api;
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["components", "common"]);
  const formAddMembersRef = useRef<AddMembersActions>();
  const [disableActions, setDisableActions] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [data, setData] = useState([]);

  const getData = async (organizationId: number) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/members`
      );
      if (status === 200) {
        setData(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setDisableActions(Boolean(selectedMembers.length == 0));
  }, [selectedMembers]);

  useEffect(() => {
    getData(organization.id);
  }, [organization]);

  const onDetachMembers = () => {
    selectedMembers.map(async (id) => {
      try {
        await apiRest.organization.detachMember(organization.id, id);
        await getData(organization.id);
      } catch (e) {
        snackbar.current.open({
          message: `Une erreur est survenue... votre action n'a pas pu être traitée.`,
          severity: "error",
        });
      }
    });
    dialog.current.close();
  };

  const onSelected = (selection) => {
    setSelectedMembers(selection);
  };

  const onMemberUpdate = (updatedMember: IMember) => {
    setData(
      data.map((member, i) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const closeAddMembersDialog = (refetchOrganizationData: boolean) => {
    if (refetchOrganizationData) {
      getData(organization.id);
    }
    console.log("close dialog");
    dialog.current.close();
  };

  function addMember() {
    dialog.current.open({
      title: t("components:Organization.Members.dialog.title"),
      content: (
        <AddMembers
          ref={formAddMembersRef}
          organizationId={organization.id}
          closeAddMembersDialog={closeAddMembersDialog}
        />
      ),
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  function detachMembers() {
    const dialogActions = [
      {
        label: t("components:Organization.Members.cancel"),
      },
      {
        label: t("components:Organization.Members.confirmDetach"),
        variant: "contained",
        color: "primary",
        noClose: true,
        onClick: onDetachMembers,
      },
    ];

    dialog.current.open({
      title: t("components:Organization.Members.dialogDdetachMembersTitle"),
      content: <div>Action irréversible!</div>,
      actions: dialogActions,
      dialogProps: {
        maxWidth: "sm",
        fullWidth: true,
        fullScreen: matches,
        disableBackdropClick: true,
      },
    });
  }

  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.root} />
        <Button
          variant="contained"
          size="small"
          disabled={disableActions}
          color="secondary"
          className={classes.button}
          startIcon={<BlockIcon />}
          onClick={detachMembers}
        >
          {t("components:Organization.Members.detachMembers")}
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={addMember}
        >
          {t("components:Organization.Members.addMembers")}
        </Button>
      </Toolbar>
      {data && (
        <MembersTable
          organizationId={organization.id}
          rows={data}
          onSelected={onSelected}
          onDetachMembers={detachMembers}
          onMemberUpdate={onMemberUpdate}
        />
      )}
    </Fragment>
  );
};

export default Members;
