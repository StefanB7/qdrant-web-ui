import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  CardHeader,
  Snackbar,
  Alert, LinearProgress, Box,
} from "@mui/material";
import { alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CopyAll from "@mui/icons-material/CopyAll";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { JsonViewer } from "@textea/json-viewer";
import PointImage from "./PointImage";
import Vectors from "./PointVectors";
import { PayloadEditor } from "./PayloadEditor";

const PointCard = (props) => {
  const theme = useTheme();
  const { setRecommendationIds } = props;
  const [point, setPoint] = React.useState(props.point);
  const [openPayloadEditor, setOpenPayloadEditor] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function resDataView(data) {
    const Payload = Object.keys(data.payload).map((key) => {
      return (
        <div key={key}>
          <Grid container spacing={2}>
            <Grid item xs={2} my={1}>
              <Typography
                variant="subtitle1"
                display={"inline"}
                fontWeight={600}
              >
                {key}
              </Typography>
            </Grid>

            <Grid item xs={10} my={1}>
              {typeof data.payload[key] === "object" ? (
                <Typography variant="subtitle1">
                  {" "}
                  <JsonViewer
                    theme={theme.palette.mode}
                    value={data.payload[key]}
                    displayDataTypes={false}
                    defaultInspectDepth={0}
                    rootName={false}
                  />{" "}
                </Typography>
              ) : (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  display={"inline"}
                >
                  {"\t"} {data.payload[key].toString()}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Divider/>
        </div>
      );
    });

    return <>{Payload}</>;
  }

  const onPayloadEdit = (payload) => {
    setPoint({ ...point, payload: structuredClone(payload) });
  };

  return (
    <>
      <Card
        variant="dual"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}>
        {loading && <Box sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
        }}>
          <LinearProgress/>
        </Box>}
        <CardHeader
          title={"Point " + point.id}
          action={
            <>
              {Object.keys(point.payload).length === 0 &&
              <Tooltip title="Add Payload" placement="left">
                <IconButton
                  aria-label="add payload"
                  onClick={() => setOpenPayloadEditor(true)}>
                  <Edit />
                </IconButton>
              </Tooltip>}

              <Tooltip title="Copy Point" placement="left">
                <IconButton
                  aria-label="copy point"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(point));
                    setOpenSnackbar(true);
                  }}>
                  <CopyAll/>
                </IconButton>
              </Tooltip>
            </>
          }
        />
        {Object.keys(point.payload).length > 0 &&
          <>
            <CardHeader
              subheader={"Payload:"}
              sx={{
                flexGrow: 1,
                background: alpha(theme.palette.primary.main, 0.05),
              }}
              action={
                <>
                  <Tooltip title="Edit Payload" placement="left">
                    <IconButton
                      aria-label="edit point payload"
                      onClick={() => setOpenPayloadEditor(true)}>
                      <Edit/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Payload" placement="left">
                    <IconButton
                      aria-label="copy point payload"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(point.payload));
                        setOpenSnackbar(true);
                      }}>
                      <CopyAll/>
                    </IconButton>
                  </Tooltip>
                </>
              }
            />
            <CardContent>
              <Grid container display={"flex"}>
                <Grid item xs my={1}>
                  {resDataView(point)}
                </Grid>
                {point.payload.images &&
                  <Grid item xs={3} display="grid" justifyContent={"center"}>
                    <PointImage data={point.payload} sx={{ ml: 2 }}/>
                  </Grid>
                }
              </Grid>
            </CardContent>
          </>
        }
        <CardHeader
          subheader={"Vectors:"}
          sx={{
            flexGrow: 1,
            background: alpha(theme.palette.primary.main, 0.05),
          }}
        />
        <CardContent>
          {point?.vector &&
            <Vectors
              point={point}
              setRecommendationIds={setRecommendationIds}
              onCopy={() => setOpenSnackbar(true)}
            />
          }
        </CardContent>
      </Card>
      <PayloadEditor
        collectionName={props.collectionName}
        point={point}
        open={openPayloadEditor}
        onClose={() => {
          setOpenPayloadEditor(false);
        }}
        onSave={onPayloadEdit}
        setLoading={setLoading}
      />
      <Snackbar
        open={openSnackbar}
        severity="success"
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          JSON copied to clipboard.
        </Alert>
      </Snackbar>
    </>
  );
};

PointCard.propTypes = {
  point: PropTypes.object.isRequired,
  setRecommendationIds: PropTypes.func.isRequired,
};

export default PointCard;