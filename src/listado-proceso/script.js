
$(document).ready(function()
{
    const GET_INCIDENCIAS = "http://localhost/backend/src/Server.php?request=getIncidencia";
    const GET_ALL_PROCESOS = "http://localhost/backend/src/Server.php?request=getAllProcesos";
    const GET_PROCESO_BY_ID = "http://localhost/backend/src/Server.php?request=getProcesoById&id=";

    var values = httpGetRequest(GET_ALL_PROCESOS);
    if (values) $("#list").append(crearEntradaLista(values));

    $("#buscar").on("click", function (e)
    {
        vaciarLista();

        var opcionSeleccionada = $("#tipo-busqueda").val();

        if (!$("#termino-busqueda").val())
            values = httpGetRequest(GET_ALL_PROCESOS);
        else
        {
            if (opcionSeleccionada == "busqueda-id-personalizado")
                values = httpGetRequest(GET_PROCESO_BY_ID + $("#termino-busqueda").val());
        }
        
        if ((values["code"] == 200) && (values["data"].length > 0))
            $("#list").append(crearEntradaLista(values));
        else
            displayDisclaimer();
    });

    $("#volver").on("click", function (e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src/index.html");
    });

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        
        return JSON.parse(xmlHttp.responseText);
    }

    function crearEntradaLista(values)
    {
        var result = "";

        for (var data in values.data)
        {
            var idPersonalizado = values.data[data]["id_personalizado"];
            var horaInicio = values.data[data]["hora_inicio"];
            var horaFin = values.data[data]["hora_fin"];
            var jefe = values.data[data]["jefe"];
            var linea = values.data[data]["linea"];
            var producto = values.data[data]["producto"];
            var kilosReales = values.data[data]["kilos_reales"];
            var kilosTeoricos = values.data[data]["kilos_teoricos"];
            var eficiencia = calcularEficiencia(kilosReales, kilosTeoricos);

            result += "<div class='entrada-lista text-left my-3 mb-4'>" +
                      "    <div class='info-proceso'>" +
                      "        <div class='row'>" +
                      "            <div class='col'>"+
                      "                <span class='h5'>ID: " + idPersonalizado + "</span>" +
                      "            </div>" +
                      "            <div class='col'>" +
                      "                <p>Hora Inicio: " + horaInicio + "</p>" +
                      "                <p>Hora Fin: " + horaFin + "</p>" +
                      "            </div>" + 
                      "            <div class='col'>" +
                      "                <p>Jefe: " + jefe + "</p>" +
                      "                <p>Linea: " + linea + "</p>" +
                      "                <p>Producto: " + producto + "</p>" +
                      "            </div>" + 
                      "            <div class='col'>" +
                      "                <p>Kilos Reales: " + kilosReales + "</p>" +
                      "                <p>Kilos Teoricos: " + kilosTeoricos + "</p>" +
                      "                <p>Eficiencia: " + eficiencia + "</p>" +
                      "            <div>" +
                      "        </div>" +
                      "    </div>";

            result += crearEntradaListaIncidencia(values.data[data]);
            result += "</div><hr />";
        }

        return result;
    }

    function crearEntradaListaIncidencia(values)
    {
        var incidencias =
            httpGetRequest(GET_INCIDENCIAS + "&id_proceso=" + values["id_proceso"]);

        var index = 0;
        var result = "";

        if (incidencias.data.length > 0)
        {
            result += "<div class='lista-proceso'>" +
                      "    <div class='row'>" +
                      "        <span class='h5'>Incidencias Proceso Produccion</span>" +
                      "    </div>";

            incidencias.data.forEach(element => {

                var horaParada = element["hora_parada"];
                var horaReinicio = element["hora_reinicio"];

                result += "<div class='entrada-lista-proceso'>" +
                        "    <div class='row my-3'>" +
                        "        <span class='col-1'></span>" +
                        "        <div class='col-2'>" +
                        "            <span>" + (++index) + "</span>" +
                        "        </div>" +
                        "        <div class='col-9'>" +
                        "            <p>Descripcion: " + element["descripcion"] + " </p>" +
                        "        </div>" +
                        "    </div>" +
                        "    <div class='row my-3'>" +
                        "        <span class='col-3'></span>" +
                        "        <div class='col-3'>" +
                        "            <p>Hora Parada: " + horaParada + "</p>" +
                        "        </div>" +
                        "        <div class='col-3'>" +
                        "            <p>Hora Reinicio: " + horaReinicio + "</p>" +
                        "        </div>" +
                        "        <div class='col-3'>" +
                        "            <p>Minutos Perdidos: " +
                                         calcularMinutosPerdidos(horaParada, horaReinicio) +
                        "            </p>" +
                        "        </div>" +
                        "    </div>" +
                        "</div>";
            });
        }
        
        return result + "</div>";
    }

    function displayDisclaimer()
    {
        var disclaimerCss = "d-flex align-items-center justify-content-center";

        $("#list").append(
            $("<div id='disclaimer' class='" + disclaimerCss + "'>" +
                "<h5>No se ha encontrado ningúna entrada con ese término</h5>" +
            "</div>"));
    }

    function vaciarLista()
    {
        $("#list").empty();
    }

    function calcularMinutosPerdidos(horaParada, horaReinicio)
    {
        horaParada = new Date(horaParada);
        horaReinicio = new Date(horaReinicio);
        
        return Math.abs(parseInt((horaParada.getTime() - horaReinicio.getTime()) / 60000));
    }

    function calcularEficiencia(kilosReales, kilosTeoricos)
    {
        return kilosReales / kilosTeoricos;
    }
});
