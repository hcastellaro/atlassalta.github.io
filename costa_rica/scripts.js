$(document).ready(function() {

    function getQueryVariableGET(variable) {

        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    };

    var lang = getQueryVariableGET('lang');

    var country = getQueryVariableGET('country');

    var escenario = 'icr';
    var titulo_escenario = 'Índice Combinado de Ruralidad';
    var titulo_indicador = '';

    var capa_actual = 'geonode:distritos_fida_cr';

    var listado_de_capas_externas = [
        ['Cantones', 'cantones'],
        ['Distritos', 'distritos'],
    ];

    var listado_de_indicadores = [
        ['Índice de Desarrollo Social al 2013', 'ids2013', 'normal'],
        ['Índice de Desarrollo Social al 2017', 'ids2017', 'normal'],
        ['Índice de Desarrollo Humano al 2011', 'idh2011', 'indicadores_exclusivo_cantones'],
        ['Índice de Desarrollo Humano al 2018', 'idh2018', 'indicadores_exclusivo_cantones'],
        ['Índice de Competencia Cantonal al 2011', 'icc2011', 'indicadores_exclusivo_cantones'],
        ['Índice de Competencia Cantonal al 2018', 'icc2018', 'indicadores_exclusivo_cantones'],
        ['Índice de Socioeconómico Integrado del 2011 y 2013', 'isi2011_13', 'indicadores_exclusivo_cantones'],
        ['Índice de Socioeconómico Integrado del 2017 y 2018', 'isi2017_20', 'indicadores_exclusivo_cantones'],
    ];

    var extent_wms = {
        "type": "FeatureCollection",
        "name": "limite_costa_rica",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-85.606080179561957, 11.225848517279482],
                        [-85.781581230165827, 10.999159660249488],
                        [-85.971707368320011, 10.874846416071749],
                        [-85.688955675680447, 10.733470569751967],
                        [-85.81083140526647, 10.538469402414337],
                        [-85.90345695975185, 10.338593205893266],
                        [-85.671893073538413, 9.870590404282954],
                        [-85.342828603656173, 9.790152422756181],
                        [-85.106389688259299, 9.512275759300058],
                        [-84.75051255786812, 9.882777977241556],
                        [-84.682262149299945, 9.570776109501347],
                        [-84.397072942068661, 9.448900379915329],
                        [-84.138696395346301, 9.322149621145869],
                        [-83.685318681286319, 9.058898045240067],
                        [-83.673131108327709, 8.759083750458462],
                        [-83.79988186709717, 8.586020214446314],
                        [-83.614630758126424, 8.420269222209329],
                        [-83.122252810598908, 8.264268288339224],
                        [-82.820001001225592, 8.001016712433424],
                        [-82.751750592657416, 8.620145418730399],
                        [-82.74200053429054, 8.800521498517707],
                        [-82.698125271639569, 9.039397928506304],
                        [-82.863876263876548, 9.175898745642645],
                        [-82.82487603040903, 9.453775409098768],
                        [-82.488499016751618, 9.541525934400701],
                        [-82.576249542053546, 9.712151955821128],
                        [-83.029627256113528, 10.072904115395742],
                        [-83.658506020777395, 10.994284631066044],
                        [-83.902257479949427, 10.77003328862777],
                        [-84.375135310743175, 11.047909952083893],
                        [-84.711512324400587, 11.125910419018945],
                        [-84.882138345821019, 10.994284631066044],
                        [-85.606080179561957, 11.225848517279482]
                    ]
                ]
            }
        }]
    };


    if (lang == 'es') {
        $(".es").css("display", "block");
        if (country == 'pan') {
            $(".es_pan").css("display", "block");
        } else if (country == 'slv') {
            $(".es_slv").css("display", "block");
        } else if (country == 'cri') {
            $(".es_cri").css("display", "block");
        }
    } else if (lang == 'en') {
        $(".en").css("display", "block");
        if (country == 'pan') {
            $(".en_pan").css("display", "block");
        } else if (country == 'slv') {
            $(".en_slv").css("display", "block");
        } else if (country == 'cri') {
            $(".en_cri").css("display", "block");
        }
    }

    language = function language() {
        if (lang == 'es') {
            $(".es").css("display", "block");
            if (country == 'pan') {
                $(".es_pan").css("display", "block");
            } else if (country == 'slv') {
                $(".es_slv").css("display", "block");
            } else if (country == 'cri') {
                $(".es_cri").css("display", "block");
            }
        } else if (lang == 'en') {
            $(".en").css("display", "block");
            if (country == 'pan') {
                $(".en_pan").css("display", "block");
            } else if (country == 'slv') {
                $(".en_slv").css("display", "block");
            } else if (country == 'cri') {
                $(".en_cri").css("display", "block");
            }
        }
    };

    language();



    var capas_array = [];
    var capas_array_after = [];
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFmZmFlbGxhYW5pbGlvIiwiYSI6ImNrZWlubncydjEwOGgyd21udHdmOWJ4M24ifQ.E2q7D7b-Je_x7VRjbqjAAA';
    var beforeMap = new mapboxgl.Map({
        container: 'before',
        style: {
            'version': 8,
            'sources': {
                'raster-tiles': {
                    'type': 'raster',
                    'tiles': [
                        //'./tiles/{z}/{x}/{y}.png'
                        //'https://cepalstat-prod.cepal.org/geo/covid/tiles/{z}/{x}/{y}.png'
                        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                        //'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'
                    ],
                    'tileSize': 256,
                    'attribution': 'ECLAC - CEPAL 2021. v 0.1'
                }
            },
            'sprite': 'mapbox://sprites/mapbox/dark-v10',
            'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf', //ENABLES THE USE OF LABEL
            'layers': [{
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 12
            }]
        },
        //'mapbox://styles/mapbox/light-v10',
        //bounds: new mapboxgl.LngLatBounds([-100, -58], [-50, 35])
        center: [-84.614, 9.882],
        zoom: 7
    });

    var afterMap = new mapboxgl.Map({
        container: 'after',
        style: {
            'version': 8,
            'sources': {
                'raster-tiles': {
                    'type': 'raster',
                    'tiles': [
                        //'./tiles/{z}/{x}/{y}.png'
                        //'https://cepalstat-prod.cepal.org/geo/tiles/tiles01/{z}/{x}/{y}.png'
                        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                        //'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'
                    ],
                    'tileSize': 256,
                    'attribution': 'ECLAC - CEPAL 2021. v 0.1'
                }
            },
            'sprite': 'mapbox://sprites/mapbox/dark-v10',
            'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf', //ENABLES THE USE OF LABEL
            'layers': [{
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 12
            }]
        },
        //'mapbox://styles/mapbox/light-v10',
        //bounds: new mapboxgl.LngLatBounds([-100, -58], [-50, 35])
        center: [-84.614, 9.882],
        zoom: 7
    });


    var container = '#comparison-container';


    var map = new mapboxgl.Compare(beforeMap, afterMap, container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
    });



    $(".mapboxgl-compare").show();

    map.setSlider($("#comparison-container").width() * 0.5);
    // map.setSlider($("#comparison-container").width());

    beforeMap.on('load', function() {


        getfeatureinfo = function getfeatureinfo(x) {
            beforeMap.on('mouseenter', x, function(e) {
                beforeMap.getCanvas().style.cursor = 'pointer';
            });

            beforeMap.on('mouseleave', x, function(e) {
                beforeMap.getCanvas().style.cursor = '';
            });

            beforeMap.on('click', x, function(e) {

                var r = 6378137 * Math.PI * 2;
                var x = (e.lngLat.lng / 360) * r;
                var sin = Math.sin(e.lngLat.lat * Math.PI / 180);
                var y = 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI * r;
                var bbox = (x - 50) + ',' + (y - 50) + ',' + (x + 50) + ',' + (y + 50);

                var capa_consulta = capa_actual;

                var url = 'https://geoportal.cepal.org/geoserver/ows?' +
                    'SERVICE=WMS&' +
                    'VERSION=1.3.0&' +
                    'REQUEST=GetFeatureInfo&' +
                    'BBOX=' + bbox + '&' +
                    'CRS=EPSG:3857&' +
                    'WIDTH=256&' +
                    'HEIGHT=256&' +
                    'LAYERS=' + capa_consulta + '&' +
                    'STYLES=&' +
                    'FORMAT=image/png&' +
                    'QUERY_LAYERS=' + capa_consulta + '&' +
                    'INFO_FORMAT=application/json&' +
                    'I=128&' +
                    'J=128';
                let inner_popup = '';
                var cargar_popup = function cargar_popup() {
                    return new Promise(function(resolve, reject) {
                        resolve($.getJSON(url, function(data) {

                            if (typeof(data.features[0]) == 'undefined') {} else {
                                var datos = data.features[0].properties;
                                if (capa_actual == 'geonode:cantones_fida_cr') {
                                    inner_popup = inner_popup +
                                        '<b>Nombre: </b>'  +  datos.NCANTON +  '<br>'  +
                                        '<b>Índice Combinado de Ruralidad: </b>'  +  datos.gr_cant +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2013: </b>'  +  datos.IDS2013 +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2017: </b>'  +  datos.IDS2017 +  '<br>'  +
                                        '<b>Índice de Desarrollo Humano al 2011: </b>'  +  datos.IDH2011 +  '<br>'  +
                                        '<b>Índice de Desarrollo Humano al 2018: </b>'  +  datos.IDH2018 +  '<br>'  +
                                        '<b>Índice de Competencia Cantonal al 2011: </b>'  +  datos.ICC2011 +  '<br>'  +
                                        '<b>Índice de Competencia Cantonal al 2018: </b>'  +  datos.ICC2018 +  '<br>'  +
                                        '<b>Índice de Socioeconómico Integrado del 2011 y 2013.: </b>'  +  datos.ISI2011_13 +  '<br>'  +
                                        '<b>Índice de Socioeconómico Integrado del 2017 y 2018: </b>'  +  datos.ISI2017_20 +  '<br>';

                                    //'<b>Entidad Federativa: </b>' + datos.nom_ent + '<br><b>Índice de Accesibilidad Rural: </b>' + datos.ind_acc.toFixed(2) + '<br><b>Índice Relativo de Ruralidad: </b>' + datos.RRIAlt.toFixed(2);
                                } else if (capa_actual == 'geonode:distritos_fida_cr') {
                                    inner_popup = inner_popup +
                                        '<b>Nombre: </b>'  +  datos.N_DISTRITO +  '<br>'  +
                                        '<b>Cantón: </b>'  +  datos.N_CANTON +  '<br>'  +
                                        '<b>Índice Combinado de Ruralidad: </b>'  +  datos.cat_gr_dis +  '<br>'  +
                                        '<b>Índice Tridimensional de Ruralidad: </b>'  +  datos.itr +  '<br>'  +
                                        '<b>Índice Funcional de Ruralidad: </b>'  +  datos.ifr +  '<br>'  +
                                        '<b>Índice Multivariado de Ruralidad: </b>'  +  datos.imr +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2013: </b>'  +  datos.IDS2013 +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2017: </b>'  +  datos.IDS2017 +  '<br>';

                                    //'<b>Municipio: </b>' + datos.nom_mun + '<br><b>Entidad Federativa: </b>' + datos.nom_ent + '<br><b>Índice de Accesibilidad Rural: </b>' + datos.ind_acc.toFixed(2) + '<br><b>Índice Relativo de Ruralidad: </b>' + datos.RRIAlt.toFixed(2);
                                }
                                console.log(datos);
                            }
                        }))
                    })
                }

                cargar_popup().then(function(data) {
                    if (inner_popup.length == 0) {} else {
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(inner_popup)
                            .addTo(beforeMap);
                    }

                })
            });
        }

        carga_inicial = function carga_inicial() {

            var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&styles=geonode:distritos_fida_cr_icr';
            console.log(url_tile);
            beforeMap.addSource('capa_inicial', {
                'type': 'raster',
                'tiles': [
                    url_tile
                ],
                'tileSize': 256
            });

            var content_layer = {
                'id': 'capa_inicial',
                type: "raster",
                'source': 'capa_inicial',
                'layout': {
                    visibility: 'visible',
                },
                paint: {
                    'raster-opacity': 1
                }
            };
            beforeMap.addLayer(content_layer);

            $("#leyenda_izquierda").append('<h6>Índice Combinado de Ruralidad</h6>');
            var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER=geonode:distritos_fida_cr&STYLE=geonode:distritos_fida_cr_icr&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'
            $("#leyenda_izquierda").append(fila_leyenda);


            ///CAPA GETFEATUREINFO

            beforeMap.addSource('extent_wms', {
                type: 'geojson',
                data: extent_wms
            });

            var content_layer_after = {
                'id': 'extent_wms',
                type: "fill",
                'source': 'extent_wms',
                'layout': {
                    'visibility': 'visible'
                },
                // "filter": ['==', 'category', 0],
                paint: {
                    'fill-color': 'red',
                    'fill-opacity': 0
                }
            };

            beforeMap.addLayer(content_layer_after);

            getfeatureinfo('extent_wms');
        };

        ///CAPA GETFEATUREINFO

        carga_inicial_capas_externas = function carga_inicial_capas_externas() {

            $.each(listado_de_capas_externas, function(i, capa_externa) {

                var x = capa_externa[1];
                if (x == 'cantones') {
                    var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:cantones_fida_cr&styles=distritos_fida_cr_limites';
                } else if (x == 'distritos') {
                    var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&styles=distritos_fida_cr_limites';
                } else {
                    var url_tile = 'https://geoespacial.kan.com.ar/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:mex_' + x;
                }

                console.log(url_tile);
                beforeMap.addSource('capa_' + x + '_externa', {
                    'type': 'raster',
                    'tiles': [
                        url_tile
                    ],
                    'tileSize': 256
                });

                var content_layer = {
                    'id': 'capa_' + x + '_externa',
                    type: "raster",
                    'source': 'capa_' + x + '_externa',
                    'layout': {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': 1
                    }
                };
                beforeMap.addLayer(content_layer);
                beforeMap.on('click', 'capa_' + x, function(e) {
                    let inner_popup = 'CONTENIDO DEL POPUP';
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(inner_popup)
                        .addTo(beforeMap);
                });
            });
        };

        carga_inicial();
        carga_inicial_capas_externas();


        console.log("cargó el mapa");
        cargar_capa_before = function cargar_capa_before(x) {

            if (capas_array.length > 0) {
                $.each(capas_array, function(i, capa) {
                    beforeMap.removeLayer(capa);
                    beforeMap.removeSource(capa);
                });
                capas_array = [];
            }

            beforeMap.setLayoutProperty('capa_inicial', 'visibility', 'none');
            //$("#leyenda_derecha").hide();
            //$(".mapboxgl-compare").hide();
            //map.setSlider($("#comparison-container").width());

            if (x == 'Tipología de Clústeres Rural-Urbano') {
                var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:localidades_fida_mx&STYLES=localidades_fida_mx%20Localidades_geojson';
            } else {
                var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:' + x + '_fida_cr&STYLES=geonode:' + x + '_fida_cr_' + escenario;
            }

            console.log(url_tile);
            beforeMap.addSource('capa_' + x, {
                'type': 'raster',
                'tiles': [
                    url_tile
                ],
                'tileSize': 256
            });


            var content_layer = {
                'id': 'capa_' + x,
                type: "raster",
                'source': 'capa_' + x,
                'layout': {
                    visibility: 'visible',
                },
                paint: {
                    'raster-opacity': 1
                }
            };
            beforeMap.addLayer(content_layer, 'capa_cantones_externa');
            beforeMap.on('click', 'capa_' + x, function(e) {
                let inner_popup = 'CONTENIDO DEL POPUP';
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(inner_popup)
                    .addTo(beforeMap);
            });

            getfeatureinfo('capa_' + x);
            // } else {
            //     var visibility = map.getLayoutProperty('capa_' + x, 'visibility');
            //     if (typeof(visibility) == 'undefined') {

            //     } else if (visibility == 'none') {
            //         map.setLayoutProperty('capa_' + x, 'visibility', 'visible');
            //         $("#leyenda_" + x).show();
            //     } else if (visibility == 'visible') {
            //         map.setLayoutProperty('capa_' + x, 'visibility', 'none');
            //         $("#leyenda_" + x).hide();
            //     }
            // }
            // layers_array.unshift(x);
            // leyenda();
            $("#leyenda_izquierda").empty();

            if (x == 'Tipología de Clústeres Rural-Urbano') {
                var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&layer=geonode:localidades_fida_mx&STYLE=localidades_fida_mx%20Localidades_geojson&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'
            } else {
                var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER=geonode:' + x + '_fida_cr&STYLE=geonode:' + x + '_fida_cr_' + escenario + '&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'
            }

            $("#leyenda_izquierda").append('<h6>' + titulo_escenario + '</h6>');
            $("#leyenda_izquierda").append(fila_leyenda);
            $("#leyenda_izquierda").show();
            capas_array.push('capa_' + x);
        };




        var capas_externas_array = [];
        //var capas_externas_array_after = [];
        cargar_capa_externa = function cargar_capa_externa(x) {
            console.log("respuesta si capa existe: " + capas_externas_array.indexOf(x));
            if (capas_externas_array.indexOf(x) == -1) {
                console.log("CAPA EXTERNA NO EXISTENTE");
                $('#check_' + x + '_off').hide();
                $('#check_' + x + '_on').show();
                capas_externas_array.push(x);
                beforeMap.setLayoutProperty('capa_' + x + '_externa', 'visibility', 'visible');
                afterMap.setLayoutProperty('capa_' + x + '_externa', 'visibility', 'visible');
            } else {
                $('#check_' + x + '_off').show();
                $('#check_' + x + '_on').hide();
                capas_externas_array.splice(capas_externas_array.indexOf(x), 1);
                beforeMap.setLayoutProperty('capa_' + x + '_externa', 'visibility', 'none');
                afterMap.setLayoutProperty('capa_' + x + '_externa', 'visibility', 'none');
                // var visibility = beforeMap.getLayoutProperty('capa_' + x, 'visibility');
                // if (typeof(visibility) == 'undefined') {

                // } else if (visibility == 'none') {
                //     beforeMap.setLayoutProperty('capa_' + x, 'visibility', 'visible');

                // } else if (visibility == 'visible') {
                //     beforeMap.setLayoutProperty('capa_' + x, 'visibility', 'none');

                // }
            }
        };

    });

    afterMap.on('load', function() {

        getfeatureinfoafter = function getfeatureinfoafter(x) {
            afterMap.on('mouseenter', x, function(e) {
                afterMap.getCanvas().style.cursor = 'pointer';
            });

            afterMap.on('mouseleave', x, function(e) {
                afterMap.getCanvas().style.cursor = '';
            });

            afterMap.on('click', x, function(e) {

                var r = 6378137 * Math.PI * 2;
                var x = (e.lngLat.lng / 360) * r;
                var sin = Math.sin(e.lngLat.lat * Math.PI / 180);
                var y = 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI * r;
                var bbox = (x - 50) + ',' + (y - 50) + ',' + (x + 50) + ',' + (y + 50);

                var capa_consulta = capa_actual;

                var url = 'https://geoportal.cepal.org/geoserver/ows?' +
                    'SERVICE=WMS&' +
                    'VERSION=1.3.0&' +
                    'REQUEST=GetFeatureInfo&' +
                    'BBOX=' + bbox + '&' +
                    'CRS=EPSG:3857&' +
                    'WIDTH=256&' +
                    'HEIGHT=256&' +
                    'LAYERS=' + capa_consulta + '&' +
                    'STYLES=&' +
                    'FORMAT=image/png&' +
                    'QUERY_LAYERS=' + capa_consulta + '&' +
                    'INFO_FORMAT=application/json&' +
                    'I=128&' +
                    'J=128';
                let inner_popup = '';
                var cargar_popup = function cargar_popup() {
                    return new Promise(function(resolve, reject) {
                        resolve($.getJSON(url, function(data) {

                            if (typeof(data.features[0]) == 'undefined') {} else {
                                var datos = data.features[0].properties;
                                if (capa_actual == 'geonode:cantones_fida_cr') {
                                    inner_popup = inner_popup +
                                        '<b>Nombre: </b>'  +  datos.NCANTON +  '<br>'  +
                                        '<b>Índice Combinado de Ruralidad: </b>'  +  datos.gr_cant +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2013: </b>'  +  datos.IDS2013 +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2017: </b>'  +  datos.IDS2017 +  '<br>'  +
                                        '<b>Índice de Desarrollo Humano al 2011: </b>'  +  datos.IDH2011 +  '<br>'  +
                                        '<b>Índice de Desarrollo Humano al 2018: </b>'  +  datos.IDH2018 +  '<br>'  +
                                        '<b>Índice de Competencia Cantonal al 2011: </b>'  +  datos.ICC2011 +  '<br>'  +
                                        '<b>Índice de Competencia Cantonal al 2018: </b>'  +  datos.ICC2018 +  '<br>'  +
                                        '<b>Índice de Socioeconómico Integrado del 2011 y 2013.: </b>'  +  datos.ISI2011_13 +  '<br>'  +
                                        '<b>Índice de Socioeconómico Integrado del 2017 y 2018: </b>'  +  datos.ISI2017_20 +  '<br>';

                                    //'<b>Entidad Federativa: </b>' + datos.nom_ent + '<br><b>Índice de Accesibilidad Rural: </b>' + datos.ind_acc.toFixed(2) + '<br><b>Índice Relativo de Ruralidad: </b>' + datos.RRIAlt.toFixed(2);
                                } else if (capa_actual == 'geonode:distritos_fida_cr') {
                                    inner_popup = inner_popup +
                                        '<b>Nombre: </b>'  +  datos.N_DISTRITO +  '<br>'  +
                                        '<b>Cantón: </b>'  +  datos.N_CANTON +  '<br>'  +
                                        '<b>Índice Combinado de Ruralidad: </b>'  +  datos.cat_gr_dis +  '<br>'  +
                                        '<b>Índice Tridimensional de Ruralidad: </b>'  +  datos.itr +  '<br>'  +
                                        '<b>Índice Funcional de Ruralidad: </b>'  +  datos.ifr +  '<br>'  +
                                        '<b>Índice Multivariado de Ruralidad: </b>'  +  datos.imr +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2013: </b>'  +  datos.IDS2013 +  '<br>'  +
                                        '<b>Índice de Desarrollo Social al 2017: </b>'  +  datos.IDS2017 +  '<br>';

                                    //'<b>Municipio: </b>' + datos.nom_mun + '<br><b>Entidad Federativa: </b>' + datos.nom_ent + '<br><b>Índice de Accesibilidad Rural: </b>' + datos.ind_acc.toFixed(2) + '<br><b>Índice Relativo de Ruralidad: </b>' + datos.RRIAlt.toFixed(2);
                                }
                                console.log(datos);
                            }
                        }))
                    })
                }

                cargar_popup().then(function(data) {
                    if (inner_popup.length == 0) {} else {
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(inner_popup)
                            .addTo(afterMap);
                    }

                })
            });
        }

        carga_inicial_after = function carga_inicial_after() {

            var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&STYLES=distritos_fida_cr';
            console.log(url_tile);
            afterMap.addSource('capa_inicial', {
                'type': 'raster',
                'tiles': [
                    url_tile
                ],
                'tileSize': 256
            });

            var content_layer = {
                'id': 'capa_inicial',
                type: "raster",
                'source': 'capa_inicial',
                'layout': {
                    visibility: 'visible',
                },
                paint: {
                    'raster-opacity': 1
                }
            };
            afterMap.addLayer(content_layer);

            $("#leyenda_derecha").append('<h6>División distrital</h6>');




            var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER=geonode:distritos_fida_cr&STYLE=distritos_fida_cr&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">';
            //$("#leyenda_derecha").append(fila_leyenda);

            ///CAPA GETFEATUREINFO

            afterMap.addSource('extent_wms', {
                type: 'geojson',
                data: extent_wms
            });

            var content_layer_after = {
                'id': 'extent_wms',
                type: "fill",
                'source': 'extent_wms',
                'layout': {
                    'visibility': 'visible'
                },
                // "filter": ['==', 'category', 0],
                paint: {
                    'fill-color': 'red',
                    'fill-opacity': 0
                }
            };

            afterMap.addLayer(content_layer_after);

            getfeatureinfoafter('extent_wms');

            ///CAPA GETFEATUREINFO
        }

        carga_inicial_after();

        carga_inicial_capas_externas_after = function carga_inicial_capas_externas_after() {

            $.each(listado_de_capas_externas, function(i, capa_externa) {

                var x = capa_externa[1];
                if (x == 'distritos') {
                    var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&styles=distritos_fida_cr_limites';
                } else if (x == 'cantones') {
                    var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:cantones_fida_cr&styles=distritos_fida_cr_limites';
                } else {
                    var url_tile = 'https://geoespacial.kan.com.ar/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:pan_' + x;
                }

                console.log(url_tile);
                afterMap.addSource('capa_' + x + '_externa', {
                    'type': 'raster',
                    'tiles': [
                        url_tile
                    ],
                    'tileSize': 256
                });

                var content_layer = {
                    'id': 'capa_' + x + '_externa',
                    type: "raster",
                    'source': 'capa_' + x + '_externa',
                    'layout': {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': 1
                    }
                };
                afterMap.addLayer(content_layer);
                afterMap.on('click', 'capa_' + x, function(e) {
                    let inner_popup = 'CONTENIDO DEL POPUP';
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(inner_popup)
                        .addTo(afterMap);
                });
            });
        };

        carga_inicial_capas_externas_after();

        cargar_capa_after = function cargar_capa_after(x) {

            if (capas_array_after.length > 0) {
                $.each(capas_array_after, function(i, capa) {
                    afterMap.removeLayer(capa);
                    afterMap.removeSource(capa);
                });
                capas_array_after = [];
            }

            afterMap.setLayoutProperty('capa_inicial', 'visibility', 'none');

            if (x == 'distritos') {
                console.log("ELIGIO distritos");
                var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&STYLES=distritos_fida_cr';
            } else {
                var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=geonode:distritos_fida_cr&STYLES=distritos_fida_cr';
            }

            console.log(url_tile);
            afterMap.addSource('capa_' + x, {
                'type': 'raster',
                'tiles': [
                    url_tile
                ],
                'tileSize': 256
            });


            var content_layer = {
                'id': 'capa_' + x,
                type: "raster",
                'source': 'capa_' + x,
                'layout': {
                    visibility: 'visible',
                },
                paint: {
                    'raster-opacity': 1
                }
            };
            afterMap.addLayer(content_layer, 'capa_cantones_externa');

            afterMap.on('click', 'capa_' + x, function(e) {
                let inner_popup = 'CONTENIDO DEL POPUP';
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(inner_popup)
                    .addTo(afterMap);
            });

            getfeatureinfo('capa_' + x);
            // } else {
            //     var visibility = map.getLayoutProperty('capa_' + x, 'visibility');
            //     if (typeof(visibility) == 'undefined') {

            //     } else if (visibility == 'none') {
            //         map.setLayoutProperty('capa_' + x, 'visibility', 'visible');
            //         $("#leyenda_" + x).show();
            //     } else if (visibility == 'visible') {
            //         map.setLayoutProperty('capa_' + x, 'visibility', 'none');
            //         $("#leyenda_" + x).hide();
            //     }
            // }
            // layers_array.unshift(x);
            // leyenda();
            $("#leyenda_derecha").empty();

            if (x == 'Tipología de Clústeres Rural-Urbano') {
                //var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&layer=geonode:localidades_fida_mx&STYLE=localidades_fida_mx%20Localidades_geojson&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'
                var fila_leyenda = '<div class="row" style="font-size:small;color:black;"><div class="col-2"><span style="background-color: #88130d;border-radius: 10%;display: inline-block;height: 12px;width: 12px;z-index: 1;"></span></div><div class="col-9">Espacios urbanos (2500 o más habitantes)</div></div>' +
                    '<div class="row" style="font-size:small;color:black;padding-top:10px;"><div class="col-2"><span style="background-color: #699a63;border-radius: 10%;display: inline-block;height: 12px;width: 12px;z-index: 1;"></span></div><div class="col-9">Espacios rurales (menos de 2500 habitantes)</div></div>';
                //$("#leyenda_derecha").append('<h6>' + titulo_escenario + '</h6>');
            } else {
                var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&LAYER=geonode:' + x + '_fida_cr&STYLE=geonode:' + x + '_fida_cr&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'

                if (x == 'distritos') {
                    $("#leyenda_derecha").append('<h6>División distrital</h6>');
                } else if (x == 'cantones') {
                    $("#leyenda_derecha").append('<h6>División distrital</h6>');
                }
            }


            //$("#leyenda_derecha").append(fila_leyenda);
            $("#leyenda_derecha").show();
            //capas_array_after.push('capa_' + x);

        };

        cargar_capa_indicadores_after = function cargar_capa_indicadores_after(x, y) {

            console.log('capas_array_after: ' + capas_array_after)
            console.log('LARGO DE ARRAY: ' + capas_array_after.length);

            if (capas_array_after.length > 0) {
                $.each(capas_array_after, function(i, capa) {
                    console.log('BORRAR: ' + capa)
                    afterMap.removeLayer(capa);
                    afterMap.removeSource(capa);
                });
                capas_array_after = [];
            }

            afterMap.setLayoutProperty('capa_inicial', 'visibility', 'none');
            //$("#leyenda_derecha").hide();
            //$(".mapboxgl-compare").hide();
            //map.setSlider($("#comparison-container").width());

            var territorio = capa_actual;
            var tema = x;
            var url_tile = 'https://geoportal.cepal.org/geoserver/ows?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=' + territorio + '&STYLES=' + territorio + '_' + tema;

            console.log(url_tile);
            afterMap.addSource('capa_' + x + '_indicador' + territorio, {
                'type': 'raster',
                'tiles': [
                    url_tile
                ],
                'tileSize': 256
            });


            var content_layer = {
                'id': 'capa_' + x + '_indicador' + territorio,
                type: "raster",
                'source': 'capa_' + x + '_indicador' + territorio,
                'layout': {
                    visibility: 'visible',
                },
                paint: {
                    'raster-opacity': 1
                }
            };
            afterMap.addLayer(content_layer, 'capa_cantones_externa');
            afterMap.on('click', 'capa_' + x + '_indicador' + territorio, function(e) {
                let inner_popup = 'CONTENIDO DEL POPUP';
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(inner_popup)
                    .addTo(afterMap);
            });

            getfeatureinfo('capa_' + x + '_indicador' + territorio);

            $("#leyenda_derecha").empty();

            var fila_leyenda = '<img src="https://geoportal.cepal.org/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image/png&WIDTH=20&HEIGHT=20&layer=' + territorio + '&STYLE=' + territorio + '_' + tema + '&legend_options=fontAntiAliasing:true;fontSize:12;forceLabels:on">'
            console.log("dentro de la capa " + y)

            $("#leyenda_derecha").append('<h6>' + y + '</h6>');
            $("#leyenda_derecha").append(fila_leyenda);
            $("#leyenda_derecha").show();
            $("#indicadores").hide();

            capas_array_after.push('capa_' + x + '_indicador' + territorio);

        };

    });

    var pais_seleccionado = 'cri';

    var escenarios = [
        ['cri', 1, 'Índice Combinado de Ruralidad', 'icr'],
        ['cri', 1, 'Índice Tridimensional de Ruralidad', 'itr'],
        ['cri', 2, 'Índice Funcional de Ruralidad', 'ifr'],
        ['cri', 3, 'Índice Multivariado de Ruralidad', 'imr'],
        //['mex', 4, 'Análisis de componentes principales aplicado a polígonos de Thiessen, componente principal 2', ''],
        // ['mex', 4, 'Porcentaje de población de 6 a 11 años que no asiste a la escuela', ''],
        // ['mex', 5, 'Porcentaje de población de 18 años y más con educación pos-básica o mas ', ''],
        // ['mex', 6, 'Porcentaje Viviendas particulares habitadas que no disponen de luz eléctrica', ''],
        // ['mex', 7, 'Porcentaje de las viviendas particulares habitadas que no disponen de agua entubada en el ámbito de la vivienda', 'Es decir que no disponen de agua entubada adentro de la vivienda o en el terreno de la vivienda.'],
        // ['mex', 8, 'Porcentajes de las viviendas particulares habitadas que disponen de automóvil o camioneta', ''],

    ]

    listar_escenarios = function listar_escenarios(x) {
        $("#lista_escenarios").empty();
        console.log("activa listar_escenarios " + x)
        $("#selector_escenarios").show();
        $("#div_escenario").hide();
        $("#selector_territorial").hide();
        $("#panel_descarga").hide();
        $("#selector_territorial_thiessen").hide();

        if (lang == 'es') {
            $("#escenarios_es").show();
        } else {
            $("#escenarios_en").show();
        }


        $.each(escenarios, function(i, escenarios) {
            var pais = escenarios[0];
            var nombre_es = escenarios[2];
            var escenario_seleccionado = escenarios[3];
            if (pais == pais_seleccionado) {
                var fila_escenario = '<div class="col-12 fila-escenario" onclick="seleccionar_escenario(\'' + nombre_es + '\',\'' + escenario_seleccionado + '\')"><li>' + nombre_es + '</li></div>';
                $("#lista_escenarios").append(fila_escenario);
            }
        })

    }

    seleccionar_escenario = function seleccionar_escenario(x, y) {
        console.log("activa seleccionar_escenario " + x)
        $("#div_escenario").show();
        if (x != 'Índice Combinado de Ruralidad') {
            $("#territorio_cantones").hide();
            $(".indicadores_exclusivo_cantones").show();
            $("#selector_territorial").show();
        } else {
            $("#selector_territorial").show();
            $("#territorio_cantones").show();
        }

        $("#selector_escenarios").hide();

        escenario = y;
        titulo_escenario = x;
        $("#panel_descarga").show();
        if (x == 'Tipología de Clústeres Rural-Urbano') {
            cargar_capa(x);
            capa_actual = 'geonode:localidades_fida_cr';
            $("#titulo_escenario").html(x);
            $("#panel_descarga").html('<span class="download_button" onclick="metodologia (\'' + titulo_escenario + '\')">Metodología del escenario</span><br><a href="./descargas/poligonos_thiessen_mx_nueva_ruralidad.zip"><span class="download_button">Descargar datos</span></a>')
        } else {
            cargar_capa('distritos');
            capa_actual = 'geonode:distritos_fida_cr'
            $(".tarjeta_territorial").removeClass('territorio_seleccionado');
            $("#territorio_distritos").addClass('territorio_seleccionado');
            $("#titulo_escenario").html(x + '<br>por distrito');
            $("#panel_descarga").html('<span class="download_button" onclick="metodologia (\'' + titulo_escenario + '\')">Metodología del escenario</span><br><a href="./descargas/distritos_pa_nueva_ruralidad.zip"><span class="download_button">Descargar datos</span></a>')
        }

    }

    elegir_territorio = function elegir_territorio(x) {

        $(".tarjeta_territorial").removeClass('territorio_seleccionado');
        $("#territorio_" + x).addClass('territorio_seleccionado');

        cargar_capa(x);
        if (x == 'distritos') {
            capa_actual = 'geonode:distritos_fida_cr';
            $(".indicadoes_exclusivo_cantones").hide();
            $("#titulo_escenario").html(titulo_escenario + '<br>por distrito');
            $("#panel_descarga").html('<span class="download_button" onclick="metodologia (\'' + titulo_escenario + '\')">Metodología del escenario</span><br><a href="./descargas/distritos_cr_nueva_ruralidad.zip"><span class="download_button">Descargar datos</span></a>')
        } else if (x == 'cantones') {
            capa_actual = 'geonode:cantones_fida_cr';
            $(".indicadoes_exclusivo_cantones").show();
            $("#titulo_escenario").html(titulo_escenario + '<br>por cantón');
            $("#panel_descarga").html('<span class="download_button" onclick="metodologia (\'' + titulo_escenario + '\')">Metodología del escenario</span><br><a href="./descargas/cantones_cr_nueva_ruralidad.zip"><span class="download_button">Descargar datos</span></a>')
        }
    }

    panel_capas_externas = function panel_capas_externas() {
        $("#capas_externas").toggle();
        $("#indicadores").hide();
    }

    panel_indicadores = function panel_indicadores() {
        $("#indicadores").toggle();
        $("#capas_externas").hide();
    }

    abrir_tabla = function abrir_tabla() {
        $("#tabla").toggle()
            //listar_capas();
        traer = function traer() {
            var url_data = "https://geoportal.cepal.org/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=" + capa_actual + "&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326";
            $.getJSON(url_data, function(data) {
                $.each(data.features, function(i, feature) {
                    var municipio = feature.properties.nom_mun;
                    var depualc = feature.properties.mun;
                    var fila = '<tr><td>' + i + '</td><td>' + municipio + '</td><td>' + depualc + '</td></tr>';
                    $("#body_tabla").append(fila)
                });
            });
        };
        traer();
    }

    descarga = function descarga(x) {
        alert("descarga" + x);
    }



    listar_capas = function listar_capas(x) {
        $.each(listado_de_capas_externas, function(i, capa_externa) {
            console.log(capa_externa[0] + ' , ' + capa_externa[1])

            var fila_capa = '<div class="col-12 fila-capa" style="font-size:small;" onclick="cargar_capa_externa(\'' + capa_externa[1] + '\')"><i id="check_' + capa_externa[1] + '_off" class="far fa-square" style="margin-right:5px;"></i><i id="check_' + capa_externa[1] + '_on" class="far fa-check-square" style="margin-right:5px;display:none;"></i>' + capa_externa[0] + '</div>';
            $("#capas_externas").append(fila_capa);
        })
    }
    listar_capas();

    listar_indicadores = function listar_indicadores(x) {
        $.each(listado_de_indicadores, function(i, indicador) {
            console.log(indicador[0] + ' , ' + indicador[1])

            var fila_capa = '<div class="row fila-capa ' + indicador[2] + '" style="margin-top:10px;" onclick="cargar_indicador(\'' + indicador[1] + '\',\'' + indicador[0] + '\')"><div class="col-1" style="font-size:small;" ><i id="check_' + indicador[1] + '_off" class="far fa-circle" style="margin-right:5px;"></i><i id="check_' + indicador[1] + '_on" class="fas fa-circle" style="margin-right:5px;display:none;"></i></div><div class="col-10">' + indicador[0] + '</div></div>';
            $("#indicadores").append(fila_capa);
        })
    }

    listar_indicadores();

    inicio = function inicio() {
        console.log("inicio");
        map.setSlider($("#comparison-container").width() * 0.5);
        $(".mapboxgl-compare").show();
        $("#leyenda_derecha").show();
    }

    cargar_capa = function cargar_capa(x) {
        //cargar_capa_before(x);
        //if (x == 'Tipología de Clústeres Rural-Urbano') {
        cargar_capa_before(x);
        //cargar_capa_after(x);
    }

    cargar_indicador = function cargar_indicador(x, y) {
        console.log("seleccion indicador" + y)
        cargar_capa_indicadores_after(x, y)
    }

    metodologia = function metodologia(x) {
        $("#metodologia").modal();
        console.log('clic en metodologia');
        if (x == 'Índice Tridimensional de Ruralidad') {
            $("#metodologia_contenido").html('<h6>Índice Tridimensional de Ruralidad (ITR)</h6>El Índice Tridimensional de Ruralidad subraya la relevancia de la relación con la naturaleza y de los modos y medios de vida asociados con la base de recursos naturales de los territorios en la comprensión, definición y medición de la ruralidad. Combina tres facetas relevantes de ésta, asociadas respectivamente a las dimensiones poblacional, económica y ambiental. Este índice se construye incorporando las siguientes variables:' +
                '<ul><li>Densidad demográfica</li><li>Población ocupada en actividades directa o indirectamente relacionadas con la base de recursos naturales a la escala territorial correspondiente</li><li>Bosque natural remanente o regenerado como proporción del área de la entidad territorial correspondiente</li></ul>');
        } else if (x == 'Índice Funcional de Ruralidad') {
            $("#metodologia_contenido").html('<h6>Índice Funcional de Ruralidad (IFR)</h6>El Índice Funcional de Ruralidad se fundamenta en la frecuencia e intensidad de los flujos e interacciones socioeconómicas y las relaciones funcionales asociadas a ellas al interior de unidades territoriales a distintas escalas: municipal, intercantonal, y en regiones mayores. Ello se complementa con las variables de luminosidad nocturna y diurna teledetectadas, a fin de valorar su utilidad para identificar y delimitar territorios rurales y rural-urbanos, así como pequeñas, medianas o grandes ciudades y aglomeraciones metropolitanas, y explorar sus interrelaciones funcionales. Se construye con el siguiente par de variables:' +
                '<ul><li>Porcentaje de la población ocupada que se desplaza a otro cantón por motivos laborales</li><li>Porcentaje de uso de suelo urbano</li><li>Porcentaje de área cubierta con polígonos de mancha urbana</li></ul>');
        } else if (x == 'Índice Multivariado de Ruralidad') {
            $("#metodologia_contenido").html('<h6>Índice Multivariado de Ruralidad (IMR)</h6>El Índice Multivariado de Ruralidad aborda la ruralidad desde la perspectiva del acceso diferencial a determinados servicios para el mejoramiento de la calidad de la vida y a ciertos recursos, especialmente naturales, para el desarrollo sustentable de los territorios. El acceso a servicios básicos como la educación o la salud, el agua potable o la energía eléctrica, está relacionado con el ejercicio efectivo de la población de determinados derechos, y ambos están condicionados ya sea por las distancias, tiempos y costos de desplazamiento hasta colegios u hospitales, o por las redes de distribución institucional del agua o de la electricidad. Por su parte, la conservación del acervo local de recursos naturales mediante Áreas Protegidas y Corredores Biológicos, entre otras modalidades, es indicativa tanto de la protección de una flora y fauna biodiversa como de un recurso actual o potencial para estrategias, procesos e iniciativas de desarrollo en los territorios. Este índice se construye con las siguientes variables:' +
                '<ul><li>Modalidad de educación rural</li><li>Proximidad de clínicas y hospitales</li><li>Provisión institucional de agua potabilizada</li><li>Provisión institucional de energía eléctrica</li><li>Conectividad a internet</li><li>Cobertura por Áreas de Conservación y Corredores Biológicos</li></ul>');
        } else if (x == 'Índice Combinado de Ruralidad') {
            $("#metodologia_contenido").html('<h6>Índice Combinado de Ruralidad (ICR)</h6>El Índice Combinado de Ruralidad de cada distrito se calcula como un promedio simple de los tres índices de ruralidad propuestos (Índices Tridimensional, Funcional y Multivariado de Ruralidad). Se conforman 6 categorías de ruralidad que definen el gradiente de ruralidad distrital.' +
                '<ul><li>Índice Tridimensional de Ruralidad (ITR)</li><li>Índice Funcional de Ruralidad (IFR)</li><li>Índice Funcional de Ruralidad (IFR)</li></ul>');
        }
    }
});