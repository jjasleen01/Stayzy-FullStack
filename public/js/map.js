const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
 const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 10})
        .setHTML("<p>Exact Location will be provided after booking!</p>"))
        .addTo(map);