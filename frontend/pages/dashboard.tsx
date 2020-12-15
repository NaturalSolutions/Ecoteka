import React, { useRef } from "react";
import {
  Box,
  Container,
  Grid,
  GridSpacing,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Nature as TreeIcon, Euro as EuroIcon } from "@material-ui/icons";
import { GiFruitTree, GiLogging, GiPlantRoots } from "react-icons/gi";
import { IconContext } from "react-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import Widget from "@/components/Dashboard/Widget";
import { Trail as SpringTail } from "react-spring/renderprops.cjs";
import SimpleMetric from "@/components/DataViz/SimpleMetric";
import StackedBars from "@/components/DataViz/StackedBars";
import { treeInterventions } from "@/lib/mock";
import AppLayoutGeneral from "@/components/appLayout/General";

export interface ETKDashboardProps {}

const defaultProps: ETKDashboardProps = {};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  dashboardTitle: {
    color: theme.palette.text.primary,
  },
}));

interface WidgetProps {
  name: string;
  component: React.ReactNode;
  size?: WidgetSizeProps;
}
interface WidgetSizeProps {
  xs?: GridSpacing;
  sm?: GridSpacing;
  md?: GridSpacing;
  lg?: GridSpacing;
  xl?: GridSpacing;
}

const ETKDashboard: React.FC<ETKDashboardProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const router = useRouter();
  const widgetsData = {
    widget1: {
      title: "Arbres total",
      metric: "66 789",
    },
    widget2: {
      title: "Arbres plantés en 2020",
      metric: "500",
    },
    widget3: {
      title: "Arbres abattus en 2020",
      metric: "56",
    },
    widget4: {
      title: "Coût total des interventions en 2020",
      metric: "15 850",
    },
  };
  const widgets: WidgetProps[] = [
    {
      name: "a.widget.1",
      component: (
        <SimpleMetric
          caption={widgetsData.widget1.title}
          metric={widgetsData.widget1.metric}
          icon={
            <IconContext.Provider value={{ size: "3rem" }}>
              <GiFruitTree />
            </IconContext.Provider>
          }
        />
      ),
    },
    {
      name: "a.widget.2",
      component: (
        <SimpleMetric
          caption={widgetsData.widget2.title}
          metric={widgetsData.widget2.metric}
          icon={
            <IconContext.Provider value={{ size: "3rem" }}>
              <GiPlantRoots />
            </IconContext.Provider>
          }
        />
      ),
    },
    {
      name: "a.widget.3",
      component: (
        <SimpleMetric
          caption={widgetsData.widget3.title}
          metric={widgetsData.widget3.metric}
          icon={
            <IconContext.Provider value={{ size: "3rem" }}>
              <GiLogging />
            </IconContext.Provider>
          }
        />
      ),
    },
    {
      name: "a.widget.4",
      size: {
        xs: 4,
      },
      component: (
        <SimpleMetric
          caption={widgetsData.widget4.title}
          metric={widgetsData.widget4.metric}
          icon={<EuroIcon style={{ fontSize: "3rem" }} />}
        />
      ),
    },
    {
      name: "Coût total par type d'interventions planifiées en 2020",
      size: {
        xs: 8,
      },
      component: (
        <StackedBars
          width={750}
          height={350}
          data={treeInterventions}
          xScaleKey="date"
          colorScheme={["#a53b67", "#fbb13c", "#218380", "#2871d1"]}
          yScaleUnit="interventions"
        />
      ),
    },
  ];

  return (
    <AppLayoutGeneral>
      <Container>
        <Box py={4}>
          <Typography
            className={classes.dashboardTitle}
            variant="h6"
            component="h1"
          >
            {t("Dashboard.title")} 2020 {t("Dashboard.for")}{" "}
            {user?.currentOrganization?.name}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <SpringTail
            items={widgets}
            keys={(widget) => widget.name}
            from={{ opacity: 0, transform: "translate3d(-40px,-10px,0)" }}
            to={{
              opacity: 1,
              transform: "translate3d(0px,0px,0)",
              delay: 2000,
              duration: 600,
            }}
          >
            {(widget) => (props) => (
              <Widget
                gridProps={{
                  item: true,
                  xs: widget.size?.xs ? widget.size?.xs : 4,
                }}
                paperProps={{
                  elevation: 2,
                }}
                springProps={props}
                component={widget.component}
              >
                {widget.name}
              </Widget>
            )}
          </SpringTail>
        </Grid>
      </Container>
    </AppLayoutGeneral>
  );
};

ETKDashboard.defaultProps = defaultProps;

export default ETKDashboard;
