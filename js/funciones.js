let zoom = document.getElementById("zoomMapa");
let listacalles=document.getElementById("listaCalles");

//Cada vez que se hace zoom, escribe el valor en la interfaz y traza el camino
zoom.addEventListener("change", () => {
    inicio();
    document.getElementById("numZoom").value = zoom.value;
    trazarCamino();
}, false);

//Cada vez que se cambia el grosor, escribe el valor en la interfaz y traza el camino
grosorLinea.addEventListener("change", () => {
    inicio();
    numGrosor.value = grosorLinea.value;
    trazarCamino();
}, false);

//Cada vez que se cambia el ccolor, se traza el camino con el nuevo color
colorTrazado.addEventListener("change", () => {
    inicio();
    trazarCamino();
}, false);


//Cada vez que se selecciona una calle, se crea el marcador de "estás aquí"
listacalles.addEventListener("change", () =>{
    let datolatitud_longitud=listacalles.value.toString();
    let posActual = datolatitud_longitud.split(",");

    latitud = posActual[0].substr(1, posActual[0].length);
    longitud = posActual[1].substr(1, posActual[0].length - 1);

    let latlng=new google.maps.LatLng(latitud, longitud);
  
    marker.setMap(null);
    icono = {
        url: "./imagenes/estas-aqui (1).png", // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    marker = new google.maps.Marker({
        position: latlng,
        icon:icono,
        map: map,
        nombre: 'Estás aquí'
    });
    
}, false);
