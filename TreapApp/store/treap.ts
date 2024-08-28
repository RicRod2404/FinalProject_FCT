import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { LatLng } from "react-native-maps";
import { calculateCarbonFootprint } from "../utils/mapFunctions";

export interface Treap {
  userLocation: LatLng | undefined;
  showDirections: boolean;
  treapActive: boolean;
  pointList: any[];
  transportationIdx: number;
}
const initialState: Treap = {
  userLocation: null,
  showDirections: false,
  treapActive: false,
  pointList: [
    {
      latitude: -1,
      longitude: -1,
      transport: "DRIVING",
      duration: 0,
      distance: 0,
      leafPoints: 0,
      carbonFootprint: 170,
      passed: true,
      locationName: "",
    }, // origin
    {
      latitude: -1,
      longitude: -1,
      transport: "",
      duration: 0,
      distance: 0,
      leafPoints: 0,
      carbonFootprint: 0,
      passed: false,
      locationName: "",
    }, // destination
  ],
  transportationIdx: 0,
};

export const treapSlice = createSlice({
  name: "treap",
  initialState: initialState,
  reducers: {
    setUserLocation: (state: any, action: PayloadAction<LatLng>) => {
      state.userLocation = action.payload;
    },
    setLocationAtIndex: (
      state: any,
      action: PayloadAction<{ index: number; location: LatLng }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);

      //Update origin to userlocation
      if (state.userLocation && action.payload.index !== 0) {
        state.pointList = state.pointList.map((point, index) => {
          if (index === 0) {
            return {
              ...point,
              latitude: state.userLocation.latitude,
              longitude: state.userLocation.longitude,
            };
          }
          return point; // Retorna o ponto sem modificações para todos os outros índices
        });
      }

      // Use map to create a new array with the updated location
      state.pointList = state.pointList.map((item, idx) => {
        if (idx === action.payload.index) {
          return {
            ...item,
            latitude: action.payload.location.latitude,
            longitude: action.payload.location.longitude,
          };
        }
        return item;
      });
    },
    setDestinationAtEnd: (state, action: PayloadAction<LatLng>) => {
      // Ensure pointList is initialized as an array
      if (!Array.isArray(state.pointList)) {
        state.pointList = [];
      }

      // Add the destination to the end of the pointList
      if (state.pointList.length > 1) {
        state.pointList[state.pointList.length - 1] = {
          ...state.pointList[state.pointList.length - 1],
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        };
      } else {
        state.pointList.push({
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        });
      }
    },
    setTransportAtIndex: (
      state,
      action: PayloadAction<{ index: number; transport: string }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);

      //Update origin to userlocation
      if (state.userLocation && action.payload.index === 0) {
        state.pointList = state.pointList.map((point, index) => {
          if (index === 0) {
            return {
              ...point,
              latitude: state.userLocation.latitude,
              longitude: state.userLocation.longitude,
            };
          }
          return point; // Retorna o ponto sem modificações para todos os outros índices
        });
      }

      // Use map to create a new array with the updated transport
      updatePointProperty(
        state,
        action.payload.index,
        "transport",
        action.payload.transport
      );
    },
    setCarbonFootPrintAtIndex: (
      state,
      action: PayloadAction<{ index: number; carbonFootprint: number }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);

      // Use map to create a new array with the updated carbonFootprint
      updatePointProperty(
        state,
        action.payload.index,
        "carbonFootprint",
        action.payload.carbonFootprint
      );
    },
    setDistanceAtIndex: (
      state,
      action: PayloadAction<{ index: number; distance: number }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);
      // Use map to create a new array with the updated distance
      updatePointProperty(
        state,
        action.payload.index,
        "distance",
        action.payload.distance
      );
    },
    setDurationAtIndex: (
      state,
      action: PayloadAction<{ index: number; duration: number }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);

      // Use map to create a new array with the updated duration
      updatePointProperty(
        state,
        action.payload.index,
        "duration",
        action.payload.duration
      );
    },
    setLeafPointsAtIndex: (
      state,
      action: PayloadAction<{ index: number; leafPoints: number }>
    ) => {
      // Ensure pointList is initialized as an array
      ensurePointListArray(state);
      // Use map to create a new array with the updated leafPoints
      updatePointProperty(
        state,
        action.payload.index,
        "leafPoints",
        action.payload.leafPoints
      );
    },
    setShowDirections: (state, action: PayloadAction<boolean>) => {
      state.showDirections = action.payload;
    },
    setPointList: (state, action: PayloadAction<any>) => {
      state.pointList = action.payload;
    },
    setDefiningTransportation: (state, action: PayloadAction<number>) => {
      state.transportationIdx = action.payload;
    },
    setTreapActive: (state, action: PayloadAction<boolean>) => {
      state.treapActive = action.payload;
      //Update origin to userlocation
      if (state.userLocation) {
        state.pointList = state.pointList.map((point, index) => {
          if (index === 0) {
            return {
              ...point,
              latitude: state.userLocation.latitude,
              longitude: state.userLocation.longitude,
            };
          }
          return point; // Retorna o ponto sem modificações para todos os outros índices
        });
      }
    },
    setLocationNameAtIndex: (
      state,
      action: PayloadAction<{ index: number; locationName: string }>
    ) => {
      // Ensure pointList is initialized as an array
      if (!Array.isArray(state.pointList)) {
        state.pointList = [];
      }

      // Use map to create a new array with the updated locationName
      updatePointProperty(
        state,
        action.payload.index,
        "locationName",
        action.payload.locationName
      );
    },
    setPassedAtIndex: (
      state,
      action: PayloadAction<{ index: number; passed: boolean }>
    ) => {
      // Ensure pointList is initialized as an array
      if (!Array.isArray(state.pointList)) {
        state.pointList = [];
      }
      // Use map to create a new array with the updated passed
      updatePointProperty(
        state,
        action.payload.index,
        "passed",
        action.payload.passed
      );
    },
    resetTreap: (state) => {
      //Reset everything except the user location
      state.showDirections = false;
      state.treapActive = false;
      state.pointList = [
        {
          latitude: -1,
          longitude: -1,
          transport: "DRIVING",
          duration: 0,
          distance: 0,
          leafPoints: 0,
          carbonFootprint: 0,
          passed: true,
        }, // origin
        {
          latitude: -1,
          longitude: -1,
          transport: "",
          duration: 0,
          distance: 0,
          leafPoints: 0,
          carbonFootprint: 0,
          passed: false,
        }, // destination
      ];
    },
  },
});

export const treapSelector = createSelector(
  (state: RootState) => state,
  (state) => state.treap
);

export const selectTotalLeafPoints = createSelector(
  (state) => state.treap.pointList,
  (pointList) =>
    pointList.reduce((total: number, point: any) => total + point.leafPoints, 0)
);
export const selectTotalDistance = createSelector(
  (state) => state.treap.pointList,
  (pointList) =>
    pointList.reduce((total: number, point: any) => total + point.distance, 0)
);
export const selectTotalDuration = createSelector(
  (state) => state.treap.pointList,
  (pointList) =>
    pointList.reduce((total: number, point: any) => total + point.duration, 0)
);
export const selectTotalCarbonFootprint = createSelector(
  (state) => state.treap.pointList,
  (pointList) =>
    pointList.reduce(
      (total: number, point: any) =>
        total + point.distance * point.carbonFootprint,
      0
    )
);
// take pointList and return a simpler list with points with latitude, longitude and transport
export const selectSimplePointList = createSelector(
  (state) => state.treap.pointList,
  (pointList) =>
    pointList.map((point: any) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      transport: point.transport,
    }))
);

export const {
  setUserLocation,
  setLocationAtIndex,
  setTransportAtIndex,
  setCarbonFootPrintAtIndex,
  setDestinationAtEnd,
  setDistanceAtIndex,
  setDurationAtIndex,
  setLeafPointsAtIndex,
  setShowDirections,
  setPointList,
  setDefiningTransportation,
  setTreapActive,
  setLocationNameAtIndex,
  setPassedAtIndex,
  resetTreap,
} = treapSlice.actions;

// Funções utilitárias
function ensurePointListArray(state) {
  if (!Array.isArray(state.pointList)) {
    state.pointList = [];
  }
}

function updatePointListByIndex(
  state: any,
  index: number,
  updates: Partial<any>
) {
  state.pointList = state.pointList.map((item, idx) => {
    if (idx === index) {
      return { ...item, ...updates };
    }
    return item;
  });
}

function updatePointProperty(
  state: any,
  index: number,
  property: string,
  value: any
) {
  updatePointListByIndex(state, index, { [property]: value });
}
