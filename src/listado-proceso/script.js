
$(document).ready(function()
{
    const GET_ALL_PROCESOS = "http://localhost/backend/src/Server.php?request=getAllProcesos";
    const GET_PROCESO_BY_ID = "http://localhost/backend/src/Server.php?request=getProcesoById&id=";
    const GET_INCIDENCIAS_BY_ID = "http://localhost/backend/src/Server.php?request=getIncidencia&id=";

    var values = "";

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
        
        if (resultadoValido(values)) crearEntradasLista(values);
        else displayDisclaimer();
    });

    $("#descarga").on("click", function (e)
    {
        console.log(JSON.stringify(values.data));
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

    function crearEntradasLista(values)
    {
        values.data.forEach(element => {
            var entradaLista = crearHTMLProceso(element["id_personalizado"],
                                                element["hora_inicio"],
                                                element["hora_fin"],
                                                element["jefe"],
                                                element["linea"], element["producto"],
                                                element["kilos_reales"], 
                                                element["kilos_teoricos"]);

            var incidencias = httpGetRequest(GET_INCIDENCIAS_BY_ID + element["id_proceso"]);
            
            if (resultadoValido(incidencias))
            {
                var indice = 0;
                var listaIncidencia = $("<div class='lista-proceso'>" +
                                      "    <div class='row'>" +
                                      "        <span class='h5'>Incidencias Proceso Produccion</span>" +
                                      "    </div>" +
                                      "</div>");

                incidencias.data.forEach(incidencia => {
                    var entradaIncidencia = crearHTMLIncidenciaProceso(++indice,
                        incidencia["descripcion"],
                        incidencia["hora_parada"],
                        incidencia["hora_reinicio"]);

                    listaIncidencia.append(entradaIncidencia);
                });

                entradaLista.append(listaIncidencia);
            }
            
            entradaLista.append("<hr />");

            $("#list").append(entradaLista);
        });
    }

    function crearHTMLProceso(id, horaInicio, horaFin, jefe, linea, producto,
                              kilosReales, kilosTeoricos, eficiencia)
    {
        return $("<div class='entrada-lista text-left my-3 mb-4'>" +
                 "    <div class='info-proceso'>" +
                 "        <div class='row'>" +
                 "            <div class='col'>"+
                 "                <span class='h5'>ID: " + id + "</span>" +
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
                 "                <p>Eficiencia: " + calcularEficiencia(kilosReales, kilosTeoricos) + "</p>" +
                 "            <div>" +
                 "        </div>" +
                 "    </div>" +
                 "</div>");
    }

    function crearHTMLIncidenciaProceso(index, descripcion,
                                        horaParada, horaReinicio)
    {
        return $("<div class='entrada-lista-proceso'>" +
                 "    <div class='row'>" +
                 "        <span class='col-1'></span>" +
                 "        <div class='col-2'>" +
                 "            <span>" + index + "</span>" +
                 "        </div>" +
                 "        <div class='col-9'>" +
                 "            <p>Descripcion: " + descripcion + " </p>" +
                 "        </div>" +
                 "    </div>" +
                 "    <div class='row'>" +
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
                 "</div>");
    }

    function displayDisclaimer()
    {
        var disclaimerCss = "d-flex align-items-center justify-content-center";

        $("#list").append($("<div id='disclaimer' class='" + disclaimerCss + "'>" +
                            "   <h5>No se ha encontrado ningúna entrada con ese término</h5>" +
                            "</div>"));
    }

    function resultadoValido(resultado)
    {
        return (resultado["code"] == 200) && (resultado["data"].length > 0);
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
