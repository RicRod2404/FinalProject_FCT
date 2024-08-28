import {
  setDistanceAtIndex,
  setDurationAtIndex,
  setLeafPointsAtIndex,
} from "../store/treap";
import { API_MAPS_KEY } from "@env";
import { convertSecondsToMinutes } from "./helperFunction";
export async function moveTo(mapRef, position, isMapReady) {
  if (mapRef?.current && isMapReady) {
    try {
      const camera = await mapRef.current.getCamera();
      if (camera) {
        camera.center = position;
        mapRef?.current?.animateCamera(camera, { duration: 1000 });
      }
    } catch (error) {
      console.error("Failed to get camera: ", error);
    }
  }
}

export async function followUser(mapRef, userLocation) {
  if (mapRef?.current) {
    try {
      const camera = await mapRef.current.getCamera();
      if (camera) {
        camera.center = userLocation;
        camera.zoom = 18;
        mapRef?.current?.animateCamera(camera, { duration: 1000 });
      }
    } catch (error) {
      console.error("Failed to get camera: ", error);
    }
  }
}

export async function isCameraCenteredAtPosition(mapRef, targetPosition) {
  if (!mapRef || !targetPosition) {
    console.error("Map reference or target position is not valid.");
    return false;
  }
  if (!mapRef?.current) {
    console.error("Map reference is not valid.");
    return false;
  }

  try {
    const camera = await mapRef?.current?.getCamera();
    if (!camera) {
      console.error("Failed to get camera.");
      return false;
    }

    // Definindo uma margem de erro para a comparação de latitude e longitude
    const marginOfError = 0.0001;
    const isLatitudeCentered =
      Math.abs(camera.center.latitude - targetPosition.latitude) <
      marginOfError;
    const isLongitudeCentered =
      Math.abs(camera.center.longitude - targetPosition.longitude) <
      marginOfError;

    return isLatitudeCentered && isLongitudeCentered;
  } catch (error) {
    console.error("Error checking camera position: ", error);
    return false;
  }
}
export function traceRouteOnReady(args, dispatch, carbonFootprint, index) {
  if (args) {
    const { distance, duration } = args;

    const leafPoints = calculateLeafPoints(distance, carbonFootprint);

    dispatch(setDistanceAtIndex({ index, distance }));
    dispatch(setDurationAtIndex({ index, duration }));
    dispatch(setLeafPointsAtIndex({ index, leafPoints: leafPoints }));
  }
}

export function calculateLeafPoints(distance, carbonFootprint) {
  const leafPoints =
    distance !== 0
      ? Math.floor((69 * distance) / (carbonFootprint !== 0 ? 69 : 1))
      : 0;
  return leafPoints;
}

export function calculateCarbonFootprint(distance, carbonFootprint) {
  return distance * carbonFootprint;
}

//This functions adjusts the zoom of the map to fit the origin and the furthest point
// so the full treap can be seen
export function handleTraceRoute(mapRef, origin, furthestPoint) {
  if (mapRef && origin && furthestPoint) {
    traceRoute(mapRef, origin, furthestPoint);
  }
}
export function traceRoute(mapRef, origin, destination) {
  if (mapRef.current && origin && destination) {
    mapRef.current.fitToCoordinates([origin, destination], {
      edgePadding: { top: 300, right: 110, bottom: 300, left: 110 },
    });
  }
}

//Checks if the location is valid
//When a treap is created the points are initialized with latitude and longitude -1
//When a stop is added the latitude and longitude are  are initialized with latitude and longitude -1
export function locationIsValid(location) {
  if (!location) return false;
  const { latitude, longitude } = location;
  return latitude !== -1 && longitude !== -1;
}

//Check if the directions can be traced between one point and the next
export function canTraceDirections(pointList, point, index) {
  if (locationIsValid(point) && locationIsValid(pointList[index + 1])) {
    return true;
  }
  return false;
}
//Calculates the distance between two points using its latitude and longitude
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raio médio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180; // Convertendo graus para radianos
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distância em metros
  return d;
}

//Finds the furthest point from the origin
export function findFurthestPoint(pointList) {
  if (!Array.isArray(pointList) || pointList.length < 2) {
    throw new Error("pointList must be an array with at least two points");
  }

  const firstPoint = pointList[0];
  let furthestPoint = null;
  let maxDistance = 0;
  let distance = null;
  for (let i = 1; i < pointList.length; i++) {
    const currentPoint = pointList[i];
    if (locationIsValid(currentPoint) && locationIsValid(firstPoint)) {
      distance = calculateDistance(
        firstPoint.latitude,
        firstPoint.longitude,
        currentPoint.latitude,
        currentPoint.longitude
      );
    }
    if (distance && distance > maxDistance) {
      maxDistance = distance;
      furthestPoint = currentPoint;
    }
  }
  if (furthestPoint) {
    return {
      latitude: furthestPoint.latitude,
      longitude: furthestPoint.longitude,
    };
  }
  return null;
}

export function getLastPointCoordinates(pointList) {
  const lastIndex = pointList.length - 1;
  const last = pointList[lastIndex];
  return { latitude: last.latitude, longitude: last.longitude };
}

export function completedTreap(pointList) {
  const filteredList = pointList.filter((point) => point.passed);
  return filteredList.length === pointList.length;
}

export function hasNotReachedAnyCheckpointOrDestination(pointList) {
  const filteredList = pointList.filter((point) => point.passed);
  return filteredList.length === 1;
}

export function hasReachedSomeCheckpoint(pointList) {
  const filteredList = pointList.filter((point) => point.passed);
  return filteredList.length > 1;
}

export function wentStraightToDestination(pointList) {
  const filteredList = pointList.filter((point) => point.passed);
  return filteredList.length === 2 && pointList[pointList.length - 1].passed;
}

export async function fetchStats(
  origin,
  destination,
  transport,
  carbonFootprint
) {
  const apiKey =
    API_MAPS_KEY ||
    process.env.API_MAPS_KEY ||
    Constants.manifest.extra.API_MAPS_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude
    },${origin.longitude}&destination=${destination.latitude},${destination.longitude
    }&mode=${transport.toLowerCase()}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const responseJson = await response.json();
    const newDistance = responseJson.routes[0]?.legs[0].distance.value / 1000;
    const newDuration = convertSecondsToMinutes(
      responseJson.routes[0]?.legs[0].duration.value
    );
    return {
      newDistance: newDistance,
      newDuration: newDuration,
      newCarbonFootprint: calculateCarbonFootprint(
        newDistance,
        carbonFootprint
      ),
      newLeafPoints: calculateLeafPoints(newDistance, carbonFootprint),
    };
  } catch (error) {
    console.error("Failed to fetch distance: ", error);
  }
}
