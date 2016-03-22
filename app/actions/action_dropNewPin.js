import { DROP_NEW_PIN } from '../constants/constants.js';
import { userData } from '../lib/db/db.js';
let currentId = 0;
function dropNewPin(pinInfo, currentId) {
  return {
    type: DROP_NEW_PIN,
    id: currentId,
    payload: pinInfo
  };
}
export default function getLocationToSave(location) {
  return (dispatch) => {
      var coords = {};
      if(!location) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
              coords.longitude = position.coords.longitude;
              coords.latitude = position.coords.latitude;
              coords.title = 'My Current Location';
              //this adds pin to db
              userData.push(coords);
              //this will add id prop w unique id generated by db to each added pin

              userData.on("value", function(snap) {
                //TODO: find more efficient way to find most recently added pin
                snap.forEach((child) => {
                  let key = child.key();
                  currentId = key;
                });
                dispatch(dropNewPin(coords, currentId));
              });

          },
          (error) => {
            console.error(error);
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
      } else {
        coords.longitude = location.longitude;
        coords.latitude = location.latitude;
        coords.title = 'New Pin Location';
        userData.push(coords);
              //this will add id prop w unique id generated by db to each added pin
        userData.on("value", function(snap) {
          snap.forEach((child) => {
            let key = child.key();
            currentId = key;
          });
          dispatch(dropNewPin(coords, currentId));
        });
      }
    };
}