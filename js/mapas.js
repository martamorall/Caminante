var map;
var murallas = new Array();
var latitud = 41.67097948393865;
var longitud = -3.6769259916763985;
let newZoom = parseInt(zoom.value);
let contadorTiempo = 0;
let intervaloPosicion = null;

let colortrazado = "#52DD36";
colorTrazado.value = colortrazado;
//Obtiene la ubicación actual con la latitud y la longitud
navigator.geolocation.getCurrentPosition(pos => {
    latitud = pos.coords.latitude;
    longitud = pos.coords.longitude;

});

function inicio() {
    newZoom = parseInt(zoom.value);
    map = new google.maps.Map(
        document.getElementById('map_canvas'), {
        // En el mapa se visualiza el mapa correspondiente a esta latitud, longitud
        center: new google.maps.LatLng(latitud, longitud),//latitud,longitud),//
        // center: new google.maps.LatLng(41.6685198,-3.6886618),//latitud,longitud),//
        zoom: newZoom, // zoom del mapa
        draggableCursor: 'auto', // forma del cursor
        draggingCursor: 'crosshair',
        mapTypeId: google.maps.MapTypeId.SATELLITE // tipo de mama
    });

    //Añade un marcador al mapa
    google.maps.event.addListener(map, 'click', function (event) {

        datolatitud_longitud = event.latLng.toString();
        //Recoge la posición actual del marcador
        let posActual = datolatitud_longitud.split(",");

        latitud = posActual[0].substr(1, posActual[0].length);
        longitud = posActual[1].substr(1, posActual[0].length - 1);

        murallas.push(datolatitud_longitud);

        icono = {
            url: "./imagenes/curso.png", // url
            scaledSize: new google.maps.Size(newZoom, newZoom), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        marker = new google.maps.Marker({
            position: event.latLng,
            icon: icono,
            map: map,
            nombre: 'Pepino'
        });

        map.setCenter(event.latLng);

        leeDireccion(event.latLng);
    });

    // Intervalo que calcula la nueva posición a partir de 2min
    intervaloPosicion = setInterval(function () {
        navigator.geolocation.getCurrentPosition(pos => {
            latitud = pos.coords.latitude;
            longitud = pos.coords.longitude;

            let latlng = new google.maps.LatLng(latitud, longitud);
            crearMarcador(latlng);
        });
    }, 120000);

}

//Crea un nuevo marcador a partir del objeto latitud-longitud
function crearMarcador(latlng) {
    let latilongi = latlng;
    icono = {
        url: "./imagenes/curso.png", // url
        scaledSize: new google.maps.Size(newZoom, newZoom), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    marker = new google.maps.Marker({
        position: latilongi,
        icon: icono,
        map: map,
        nombre: 'Pepino'
    });

    map.setCenter(latlng);
    leeDireccion(latilongi);
}

/*Obtiene la longitud y la latitud correspondiente al clic y copia los datos en cajas de texto. 
Tambien obtiene la dirección del lugar donde hacemos clic*/
function leeDireccion(latlng) {
    //alert("leeDireccion  "+latlng )
    geocoder = new google.maps.Geocoder();
    if (latlng != null) {
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    MuestraDireccion(latlng, results[0].formatted_address)
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    }
}

//Muestra la dirección a partir del objeto latitud-longitud creando las opciones en el select listaCalles
function MuestraDireccion(latlng, direccion) {
    let listac = document.getElementById("listaCalles");
    let opcion = document.createElement("option")
    opcion.value = latlng;
    opcion.text = direccion;
    listac.appendChild(opcion);
    trazarCamino();
}

//Traza una línea entre dos marcadores existentes en el mapa
function trazarCamino() {
    var tipo_trazo;
    colortrazado = colorTrazado.value;
    let grosorTrazado = grosorLinea.value;
    cRecinto = ""
    var posiciones = "[";

    for (i = 0; i < listaCalles.options.length; i++) {
        posiciones = posiciones + "new google.maps.LatLng" + listaCalles[i].value + ",";
        cRecinto = cRecinto + listaCalles[i].value + ",";
    }
    posiciones = posiciones.substr(0, posiciones.length - 1);

    if (tipo_trazo == "recinto") {
        posiciones = posiciones + ",new google.maps.LatLng" + listaCalles[i].value + "]";
    }
    else { posiciones = posiciones + "]"; }

    if (listaCalles.options.length > 0) {
        var polygon = "new google.maps.Polyline({" +
            "path:" + posiciones + "," +
            "strokeColor:'" + colortrazado + "'," +
            "strokeOpacity: 2," +
            "strokeWeight:" + grosorTrazado + "," +
            "geodesic: true})";

        eval(polygon).setMap(map);
    }
    murallas = new Array();
}

inicio();
