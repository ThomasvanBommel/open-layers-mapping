let map;
let map_coord;
let cur_coord;

/** On document load */
window.onload = () => {

    // Create map
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 4
        })
    });

    // Set map event listeners
    map.on("moveend", mapUpdate);
    map.on("pointermove", updateCursorCoords);
    
    // Get map_coord element from the DOM
    map_coord = document.querySelector("#map_coords");
    map_coord.lat  = map_coord.querySelector(".lat");
    map_coord.long = map_coord.querySelector(".long");

    // Get cur_coord element from DOM
    cur_coord = document.querySelector("#cur_coords");
    cur_coord.lat  = cur_coord.querySelector(".lat");
    cur_coord.long = cur_coord.querySelector(".long");

    // Call move cursor coords on movemouse event
    map.getTargetElement().addEventListener("mousemove", moveCursorCoords);

    // Set map to users location if the choose to
    navigator.geolocation.getCurrentPosition(changeMapLocation, geolocateError);
}

/** Update map_coord element */
function mapUpdate(){
    
    // Return error if element doesn't exist
    if(!map || !map_coord) return console.error("Element missing");

    // Get the center coordnates of the map
    let center = ol.proj.toLonLat(map.getView().getCenter());

    // Set element values
    map_coord.lat.innerText  = center[0];
    map_coord.long.innerText = center[1];
}

/** Move cursor coordinate element */
function moveCursorCoords(cursor){
    
    // Return error if element doesn't exist
    if(!map || !cur_coord) return console.error("Element missing");

    // Move element
    cur_coord.style.left = cursor.clientX + "px";
    cur_coord.style.top  = cursor.clientY + "px";
}

/** Move the cursor coordinate element */
function updateCursorCoords(cursor){
    
    // Return error if element doesn't exist
    if(!cur_coord) return console.error("Element missing");

    // Get long / lat from cursor coordinate
    let position = ol.proj.toLonLat(cursor.coordinate);

    // Set element values
    cur_coord.lat.innerText  = position[0];
    cur_coord.long.innerText = position[1];
}

/** Change the maps location */
function changeMapLocation(position, zoom=10){
    // Return error if element doesn't exist
    if(!map) return console.error("Element missing");

    console.log(position);

    // Get map view + create coordinate from position
    let view = map.getView();
    let coordinate = ol.proj.fromLonLat([
        position.coords.longitude,
        position.coords.latitude
    ]);

    // Set map center to the coordinate
    view.setCenter(coordinate);
    view.setZoom(zoom);
}

/** Error geolocating the user (they probably declined) */
function geolocateError(){
    // COGS coordinates
    let COGS_coord = [44.88502667909841, -65.16840650198439];

    // Change the map location
    changeMapLocation({
        coords: {
            longitude: COGS_coord[1],
            latitude:  COGS_coord[0]
        }
    }, 17);

    // Alert user (no pausing)
    setTimeout(() => alert("Unable to get your location\n\nStarting position set to COGS, NS"), 1000);
}