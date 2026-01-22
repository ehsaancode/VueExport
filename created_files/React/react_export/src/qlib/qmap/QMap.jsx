import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// ✅ Load Google Maps Script with key passed as argument
const loadGoogleMapsScript = (mapKey, callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=initMap`;
  script.async = true;
  script.onerror = () => {
    console.error("Google Maps script failed to load.");
  };
  window.initMap = callback;
  document.head.appendChild(script);
};

// ✅ Convex Hull helper function
function convexHull(points) {
  points.sort((a, b) => a.lng - b.lng || a.lat - b.lat);
  const cross = (o, a, b) =>
    (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);

  const lower = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

// ✅ Main Component
const QMap = ({
  mapKey='AIzaSyAilt_8cTAaLj51xHphaKPx_27jrrcrTAw',
  width = "100%",
  height = "400px",
  markers = [],
  centerMarkers = [],
  zoomControlsEnabled,
  enableFullScreen,
  boundaryEnabled,
  isPolygonEnable,
  isCircleRadiusEnable,
  zoom ,
  pathType = "roadmap",
  radiusColor = "#FF0000",
  polygonColor = "#FF0000",
  tailwaindClasses = "",
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return;

      const rawMarkers = markers || [];
      const centers = centerMarkers || [];
      const center = centers[0] || rawMarkers[0];
      if (!center) return;

      const allowedMapTypes = ["satellite", "hybrid", "terrain", "roadmap"];
      const rawMapType = pathType.toLowerCase();
      const mapTypeId = allowedMapTypes.includes(rawMapType) ? rawMapType : "roadmap";

      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: parseFloat(center.latitude),
          lng: parseFloat(center.longitude),
        },
        zoom: parseInt(zoom, 10),
        scrollwheel: zoomControlsEnabled,
        gestureHandling: zoomControlsEnabled ? "auto" : "none",
        mapTypeId,
        disableDefaultUI: false,
        zoomControl: zoomControlsEnabled,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: enableFullScreen,
      });

      const bounds = new window.google.maps.LatLngBounds();
      const rawCoords = rawMarkers.map((marker) => ({
        lat: parseFloat(marker.latitude),
        lng: parseFloat(marker.longitude),
      }));

      const polygonCoords = convexHull(rawCoords);

      rawMarkers.forEach((marker) => {
        const position = {
          lat: parseFloat(marker.latitude),
          lng: parseFloat(marker.longitude),
        };

        const markerInstance = new window.google.maps.Marker({
          position,
          map,
          title: `${marker.name}\n${marker.tooltip}`,
          icon: undefined,
        });

        if (isCircleRadiusEnable) {
          new window.google.maps.Circle({
            map,
            center: position,
            radius: 1000,
            strokeColor: radiusColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: radiusColor,
            fillOpacity: 0.2,
          });
        }

        const infoContent = `
          <div style="font-family: Arial; padding: 12px; max-width: 300px; border-radius: 12px;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${marker.name}</div>
            <div style="font-size: 14px; font-weight: bold; color: #333;">${marker.tooltip}</div>
            <div style="font-size: 13px; color: #555; margin-top: 6px;">${marker.tooltip}</div>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        markerInstance.addListener("click", () => {
          infoWindow.open(map, markerInstance);
        });

        if (boundaryEnabled) {
          bounds.extend(position);
        }
      });

      if (isPolygonEnable && polygonCoords.length > 2) {
        const polygon = new window.google.maps.Polygon({
          paths: polygonCoords,
          strokeColor: polygonColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: polygonColor,
          fillOpacity: 0.2,
        });
        polygon.setMap(map);
      }

      if (boundaryEnabled && rawMarkers.length > 0) {
        map.fitBounds(bounds);
      }
    };

    // ✅ Pass the key here!
    loadGoogleMapsScript(mapKey, initMap);
  }, [
    mapKey,
    markers,
    centerMarkers,
    zoom,
    pathType,
    boundaryEnabled,
    isPolygonEnable,
    isCircleRadiusEnable,
    radiusColor,
    polygonColor,
  ]);

  return <div ref={mapRef} className={tailwaindClasses}></div>;
};

// ✅ PropTypes
QMap.propTypes = {
  mapKey: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  markers: PropTypes.arrayOf(PropTypes.object),
  centerMarkers: PropTypes.arrayOf(PropTypes.object),
  zoomControlsEnabled: PropTypes.bool,
  enableFullScreen: PropTypes.bool,
  boundaryEnabled: PropTypes.bool,
  isPolygonEnable: PropTypes.bool,
  isCircleRadiusEnable: PropTypes.bool,
  zoom: PropTypes.number,
  pathType: PropTypes.string,
  radiusColor: PropTypes.string,
  polygonColor: PropTypes.string,
  tailwaindClasses: PropTypes.string,
};

export default QMap;
QMap.displayName = "QMap";





// import React, { useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import { Loader } from "@googlemaps/js-api-loader";

// const loader = new Loader({
//   apiKey: "AIzaSyAilt_8cTAaLj51xHphaKPx_27jrrcrTAw", // ✅ Replace with your secure key in prod
//   version: "weekly",
//   libraries: ["marker"],
// });

// const convexHull = (points) => {
//   points.sort((a, b) => a.lng - b.lng || a.lat - b.lat);
//   const cross = (o, a, b) =>
//     (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);

//   const lower = [];
//   for (const p of points) {
//     while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
//       lower.pop();
//     lower.push(p);
//   }

//   const upper = [];
//   for (let i = points.length - 1; i >= 0; i--) {
//     const p = points[i];
//     while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
//       upper.pop();
//     upper.push(p);
//   }

//   upper.pop();
//   lower.pop();
//   return lower.concat(upper);
// };

// const Map = ({
//   width = "100%",
//   height = "400px",
//   markers = [],
//   centerMarkers = [],
//   zoomControlsEnabled = true,
//   enableFullScreen = true,
//   boundaryEnabled = false,
//   isPolygonEnable = false,
//   isCircleRadiusEnable = false,
//   zoom = 12,
//   pathType = "roadmap",
//   radiusColor = "#FF0000",
//   polygonColor = "#FF0000",
//   tailwaindClasses = "",
// }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     loader.load().then(() => {
//       const { google } = window;
//       const rawMarkers = markers || [];
//       const centers = centerMarkers || [];
//       const center = centers[0] || rawMarkers[0];

//       if (!center) return;

//       const allowedMapTypes = ["satellite", "hybrid", "terrain", "roadmap"];
//       const mapTypeId = allowedMapTypes.includes(pathType.toLowerCase())
//         ? pathType.toLowerCase()
//         : "roadmap";

//       const map = new google.maps.Map(mapRef.current, {
//         center: {
//           lat: parseFloat(center.latitude),
//           lng: parseFloat(center.longitude),
//         },
//         zoom: parseInt(zoom, 10),
//         scrollwheel: zoomControlsEnabled,
//         gestureHandling: zoomControlsEnabled ? "auto" : "none",
//         mapTypeId,
//         disableDefaultUI: false,
//         zoomControl: zoomControlsEnabled,
//         mapTypeControl: false,
//         streetViewControl: false,
//         fullscreenControl: enableFullScreen,

//         // ✅ REQUIRED for AdvancedMarkerElement
//         mapId: "deb4a3c243252ebff9c564f8",
//       });

//       const bounds = new google.maps.LatLngBounds();
//       const rawCoords = rawMarkers.map((marker) => ({
//         lat: parseFloat(marker.latitude),
//         lng: parseFloat(marker.longitude),
//       }));

//       const polygonCoords = convexHull(rawCoords);

//       rawMarkers.forEach((marker) => {
//         const position = {
//           lat: parseFloat(marker.latitude),
//           lng: parseFloat(marker.longitude),
//         };

//         const markerInstance = new google.maps.marker.AdvancedMarkerElement({
//           map,
//           position,
//           title: marker.name ?? "",
//         });

//         const infoContent = `
//           <div style="font-family: Arial; padding: 12px; max-width: 300px; border-radius: 12px;">
//             <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${marker.name ?? ""}</div>
//             <div style="font-size: 14px; font-weight: bold; color: #333;">${marker.tooltip ?? ""}</div>
//           </div>
//         `;
//         const infoWindow = new google.maps.InfoWindow({ content: infoContent });

//         markerInstance.addListener("click", () => {
//           infoWindow.open(map, markerInstance);
//         });

//         if (isCircleRadiusEnable) {
//           new google.maps.Circle({
//             map,
//             center: position,
//             radius: 1000,
//             strokeColor: radiusColor,
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: radiusColor,
//             fillOpacity: 0.2,
//           });
//         }

//         if (boundaryEnabled) {
//           bounds.extend(position);
//         }
//       });

//       if (isPolygonEnable && polygonCoords.length > 2) {
//         const polygon = new google.maps.Polygon({
//           paths: polygonCoords,
//           strokeColor: polygonColor,
//           strokeOpacity: 0.8,
//           strokeWeight: 2,
//           fillColor: polygonColor,
//           fillOpacity: 0.2,
//         });
//         polygon.setMap(map);
//       }

//       if (boundaryEnabled && rawMarkers.length > 0) {
//         map.fitBounds(bounds);
//       }
//     });
//   }, [
//     markers,
//     centerMarkers,
//     zoom,
//     pathType,
//     boundaryEnabled,
//     isPolygonEnable,
//     isCircleRadiusEnable,
//     radiusColor,
//     polygonColor,
//     zoomControlsEnabled,
//     enableFullScreen,
//   ]);

//   return (
//     <div
//       ref={mapRef}
//       className={tailwaindClasses}
//       style={{
//         width: enableFullScreen ? "100%" : width,
//         height: enableFullScreen ? "100%" : height,
//       }}
//     />
//   );
// };

// Map.propTypes = {
//   width: PropTypes.string,
//   height: PropTypes.string,
//   markers: PropTypes.arrayOf(PropTypes.object),
//   centerMarkers: PropTypes.arrayOf(PropTypes.object),
//   zoomControlsEnabled: PropTypes.bool,
//   enableFullScreen: PropTypes.bool,
//   boundaryEnabled: PropTypes.bool,
//   isPolygonEnable: PropTypes.bool,
//   isCircleRadiusEnable: PropTypes.bool,
//   zoom: PropTypes.number,
//   pathType: PropTypes.string,
//   radiusColor: PropTypes.string,
//   polygonColor: PropTypes.string,
//   tailwaindClasses: PropTypes.string,
// };

// export default Map;
// Map.displayName = "Map";
