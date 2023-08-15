/* eslint-disable */
import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  alpha,
  Box,
  Card,
  CardContent, CardHeader, Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useClient } from "../../context/client-context";
import { DataGridList } from "../Points/DataGridList";
import { CopyButton } from "../Common/CopyButton";
import { Dot } from "../Common/Dot";
import CollectionClusterInfo from "./CollectionClusterInfo";

export const CollectionInfo = ({ collectionName }) => {
  const theme = useTheme();
  const { client: qdrantClient } = useClient();
  const [collection, setCollection] = React.useState({});
  const [clusterInfo, setClusterInfo] = React.useState(null);

  useEffect(() => {
    // loading state (global context?)
    qdrantClient.getCollection(collectionName).then((res) => {
      setCollection(() => {
        return { ...res };
      });
    }).catch((err) => {
      console.log(err);
      // snackbar error
    });

    // todo: show in UI
    qdrantClient.api("cluster").
      collectionClusterInfo({ collection_name: collectionName }).
      then((res) => {
        setClusterInfo(() => {
          return { ...res.data };
        });
      }).catch((err) => {
      console.log(err);
    });
  }, [collectionName]);

  return (
    <Box pt={2}>
      <Card variant="dual">
        <CardHeader
          title={"Collection Info"}
          sx={{
            flexGrow: 1,
            background: alpha(theme.palette.primary.main, 0.05),
          }}
          action={
            <CopyButton text={JSON.stringify(collection)}/>
          }
        />
        <CardContent>
          <DataGridList
            data={collection}
            specialCases={{
              "status":
                <Typography variant="subtitle1" color="text.secondary">
                  {collection.status} <Dot color={collection.status}/>
                </Typography>,
            }}
          />
        </CardContent>
      </Card>

      {clusterInfo && <CollectionClusterInfo sx={{mt: 5}} collectionCluster={clusterInfo} />}
    </Box>
  );
};

CollectionInfo.displayName = "CollectionInfo";

CollectionInfo.propTypes = {
  collectionName: PropTypes.string.isRequired,
};

export default memo(CollectionInfo);