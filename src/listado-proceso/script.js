
$(document).ready(function()
{
    const GET_PROCESO_PESO = "http://localhost/backend/src/Server.php?request=getProcesosPeso"
    const GET_PROCESO_INCIDENCIAS = "http://localhost/backend/src/Server.php?request=getProcesosIncidencia"

    $("#buscar").on("click", function(e)
    {
        if ($("#tipo-busqueda").val() === "busqueda-incidencias")
        {
            var datos = httpGetRequest(GET_PROCESO_INCIDENCIAS)["data"]
            var incidencias = agruparIncidenciasPorId(datos);
            var html = crearHTMLProcesoIncidencia(datos, incidencias);
        }

        if ($("#tipo-busqueda").val() === "busqueda-peso")
        {
            var datos = httpGetRequest(GET_PROCESO_PESO);
            var html = crearHTMLProcesoPeso(datos);
        }
    });

    $("#volver").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src");
    });

    function agruparIncidenciasPorId(datos)
    {
        var result = new Map();

        datos.forEach(element => {
            if (element.descripcion == null) return;

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

    function crearHTMLProcesoIncidencia(datos, incidencias)
    {
        console.log("INCIDENCIAS");

        console.log(datos);
        console.log(incidencias);
    }

    function crearHTMLProcesoPeso(datos)
    {
        console.log("PESOS");
        console.log(datos);
    }

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        
        return JSON.parse(xmlHttp.responseText);
    }
});