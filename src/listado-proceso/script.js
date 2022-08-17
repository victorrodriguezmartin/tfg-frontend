
$(document).ready(function()
{
    const GET_PROCESO_PESO = "http://localhost/backend/src/Server.php?request=getProcesosPeso";
    const GET_PROCESO_INCIDENCIAS = "http://localhost/backend/src/Server.php?request=getProcesosIncidencia";

    if (findParameter("tipoBusqueda") === "peso")
    {
        $('option[value=incidencia]').prop('selected', false);
        $('option[value=peso]').prop('selected', true);

        buscarPesos(findParameter("terminoBusqueda"));
    }
    else
    {
        $('option[value=incidencia]').prop('selected', true);
        $('option[value=peso]').prop('selected', false);

        buscarIncidencias(findParameter("terminoBusqueda"));
    }

    $("#buscar").on("click", function(e)
    {
        $("#list").empty();

        var terminoBusqueda = $("#termino-busqueda").val();

        if ($("#tipo-busqueda").val() === "incidencias")
            buscarIncidencias(terminoBusqueda);
        else 
            buscarPesos(terminoBusqueda);
    });

    $("#volver").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src");
    });

    function buscarIncidencias(terminoBusqueda)
    {
        var datos = httpGetRequest(GET_PROCESO_INCIDENCIAS + 
            (!terminoBusqueda ? "" : "ById&id=" + terminoBusqueda))["data"];
        
        var procesos = agruparIncidenciasPorId(datos);
        crearHTMLProcesoIncidencia(procesos, datos);
    }

    function buscarPesos(terminoBusqueda)
    {
        var datos = httpGetRequest(GET_PROCESO_PESO + 
            (!terminoBusqueda ? "" : "ById&id=" + terminoBusqueda))["data"];

        crearHTMLProcesoPeso(datos);
    }

    function crearHTMLProceso(datos, tipo)
    {
        var eficiencia = calcularEficiencia(datos["kilos_reales"], datos["kilos_teoricos"]);

        return $("<div id='entrada-" + datos["id"] + "' class='entrada-lista text-left mt-3'>" +
                 "    <div class='row'>" +
                 "        <div class='col'>"+
                 "            <span class='h5'>ID: " + datos["id"] + "</span>" +
                 "        </div>" +
                 "        <div class='col'>" +
                 "            <p>Hora Inicio: " + datos["hora_inicio"] + "</p>" +
                 "            <p>Hora Fin: " + datos["hora_fin"] + "</p>" +
                 "        </div>" + 
                 "        <div class='col'>" +
                 "            <p>Jefe: " + datos["jefe"] + "</p>" +
                 "            <p>Linea: " + datos["linea"] + "</p>" +
                 "            <p>Producto: " + datos["producto"] + "</p>" +
                 "        </div>" + 
                 "        <div class='col'>" +
                 "            <p>Kilos Reales: " + datos["kilos_reales"] + "</p>" +
                 "            <p>Kilos Teoricos: " + datos["kilos_teoricos"] + "</p>" +
                 "            <p>Eficiencia: " + eficiencia + "</p>" +
                 "        </div>" +
                 "        <div class='col-2 align-self-center'>" +
                 "            <button class='btn btn-primary'>Más Información</button>" +
                 "        </div>" +
                 "    </div>" +
                 "</div><hr />");
    }

    function crearHTMLProcesoIncidencia(procesos, incidencias)
    {
        const iterator = procesos.keys();

        procesos.forEach(() => {
            var id = iterator.next().value;
            var datos = getDatosProceso(id, incidencias);
            $("#list").append(crearHTMLProceso(datos, "incidencia"));
            
            $("#entrada-" + datos["id"] + " button").on("click", function(e)
            {
                e.preventDefault();
                window.location.replace("http://localhost/frontend/src/detalles-incidencia/index.html?" + 
                    "&terminoBusqueda=" + $("#termino-busqueda").val() + 
                    "&incidencias=" + JSON.stringify(filtrarIncidencias(id, incidencias)));
            });
        });
    }

    function filtrarIncidencias(filtro, incidencias)
    {
        var result = [];

        incidencias.forEach(element => {
            if (filtro === element.id_personalizado)
                result.push(element);
        });

        return result;
    }

    function crearHTMLProcesoPeso(datos)
    {
        datos.forEach(element => {
            var id = element.id_personalizado;
            var datos = getDatosProceso(id, [ element ]);
            $("#list").append(crearHTMLProceso(datos, "peso"));

            $("#entrada-" + datos["id"] + " button").on("click", function(e)
            {
                e.preventDefault();
                window.location.replace("http://localhost/frontend/src/detalles-peso/index.html?&" +
                    "&terminoBusqueda=" + $("#termino-busqueda").val() + 
                    "&datos=" + JSON.stringify(datos) + 
                    "&datosPeso=" + JSON.stringify(element));
            });
        });
    }

    function getDatosProceso(id, datos)
    {
        var proceso;

        datos.forEach(element => {
            if (element.id_personalizado === id)
            {
                return proceso = {
                    "id" : id,
                    "id_proceso_peso" : element.id_proceso_peso,
                    "hora_inicio" : element.hora_inicio,
                    "hora_fin" : element.hora_fin,
                    "jefe" : element.jefe,
                    "linea" : element.linea,
                    "producto" : element.producto,
                    "kilos_reales" : element.kilos_reales,
                    "kilos_teoricos" : element.kilos_teoricos
                };
            }
        });

        return proceso;
    }

    function agruparIncidenciasPorId(datos)
    {
        var result = new Map();

        datos.forEach(element => {
            var nuevo = {
                descripcion: element.descripcion,
                horaParada: element.horaParada,
                horaReinicio: element.horaParada
            };

            if (!result.has(element.id_personalizado))
                result.set(element.id_personalizado, []);

            result.get(element.id_personalizado).push(nuevo);
        });

        return result;
    }

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        
        return JSON.parse(xmlHttp.responseText);
    }

    function calcularEficiencia(kilosReales, kilosTeoricos)
    {
        return (kilosReales / kilosTeoricos).toFixed(4);
    }

    function findParameter(name)
    {
        var paramList = window.location.search.substring(1).split("&");

        for (var param in paramList)
        {
            var current = paramList[param].split("=");

            if (current[0] == name)
                return current[1];
        }
    }
});