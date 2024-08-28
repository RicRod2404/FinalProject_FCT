import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CustomMarker } from "./CustomMarker";
import {
  canTraceDirections,
  getLastPointCoordinates,
  locationIsValid,
  traceRouteOnReady,
} from "../../utils/mapFunctions";
import { CustomMapViewDirections } from "./CustomMapViewDirections";
import { useDispatch, useSelector } from "react-redux";
import { treapSelector } from "../../store/treap";

const MapContent = () => {
  const { pointList } = useSelector(treapSelector);
  const dispatch = useDispatch();
  return (
    <>
      {pointList &&
        locationIsValid(getLastPointCoordinates(pointList)) &&
        pointList.map((point, index) => (
          <React.Fragment key={index}>
            {index === pointList.length - 1 && locationIsValid(point) ? (
              <CustomMarker point={point} type="destination" />
            ) : (
              locationIsValid(point) &&
              index !== 0 && <CustomMarker point={point} type="checkpoint" />
            )}
            {canTraceDirections(pointList, point, index) && (
              <CustomMapViewDirections
                origin={pointList[index]}
                destination={pointList[index + 1]}
                transport={point.transport}
                onReady={(args) =>
                  traceRouteOnReady(
                    args,
                    dispatch,
                    point.carbonFootprint,
                    index
                  )
                }
              />
            )}
          </React.Fragment>
        ))}
    </>
  );
};

export default MapContent;

const styles = StyleSheet.create({});
