
$(document).ready(function()
{
    // TODO: REMOVE BEFORE UPLOADING! (FROM HERE)
    var TEST_TEXT_VALUE_1 = "TEST";
    $("#descripcionIncidencia").val(TEST_TEXT_VALUE_1);
    var TEST_INT_VALUE_1 = "15:30";
    $("#horaParada").val(TEST_INT_VALUE_1);
    var TEST_INT_VALUE_2 = "16:00";
    $("#horaReinicio").val(TEST_INT_VALUE_2);
    // TODO: REMOVE BEFORE UPLOADING! (TO HERE)

    var listaIncidencias = [];

    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const INTERNAL_ERROR = "Un error inesperado ha ocurrido.";
    const SUCCESSFULL_INCIDENCE_CREATION = "Incidencia añadida con éxito a la lista!";
    const EMPTY_DESCRIPTION = "El campo 'Descripción Incidencia' no puede ser vacío.";
    const INVALID_TIME_FORMAT = "El único formato horario aceptado es HH:mm (24 horas).";
    const INVALID_TIME_DIFFERENCE = "La hora de reinicio tiene que ser mayor que la hora de parada.";

    $("#guardar-incidencia").on("click", function(e)
    {
        hideBanner();

        var hParada = $("#horaParada").val().padStart(2, '0');
        var hReinicio = $("#horaReinicio").val().padStart(2, '0');

        if ($("#descripcionIncidencia").val() == "")
            return displayBanner(BANNER_ERROR, EMPTY_DESCRIPTION);
        if (!validarHora(hParada) || !validarHora(hReinicio))
            return displayBanner(BANNER_ERROR, INVALID_TIME_FORMAT);
        if (!validarDiferenciaHoraria(hParada, hReinicio))
            return displayBanner(BANNER_ERROR, INVALID_TIME_DIFFERENCE);

        var incidencia = {
            descripcion: $("#descripcionIncidencia").val(),
            horaParada: hParada,
            horaReinicio: hReinicio,
            minutosPerdidos: calcularMinutosPerdidos(hParada, hReinicio)
        }
    
        listaIncidencias.push(incidencia);
        $("#listaIncidencias").append(crearEntradaLista(incidencia));
        displayBanner(BANNER_SUCCESS, SUCCESSFULL_INCIDENCE_CREATION);

        // TODO: REMOVE BEFORE UPLOADING! (FROM HERE)
        $("#incidenciaText").val(TEST_TEXT_VALUE_1);
        $("#horaParada").val(TEST_INT_VALUE_1);
        $("#horaReinicio").val(TEST_INT_VALUE_2);
        // TODO: REMOVE BEFORE UPLOADING! (TO HERE)
    });

    $("#cerrar-formulario").on("click", function(e)
    {
        var lista = "";
        
        for (var i in listaIncidencias)
        {
            lista += "&incidencia_" + i + "={";
            lista += "descripcion:" + listaIncidencias[i].descripcion.replaceAll(" ", "_") + ",";
            lista += "horaParada:" + listaIncidencias[i].horaParada.replace(":", "_") + ",";
            lista += "horaReinicio:" + listaIncidencias[i].horaReinicio.replace(":", "_") + ",";
            lista += "minutosPerdidos:" + listaIncidencias[i].minutosPerdidos;
            lista += "}";
        }

        window.location.replace("http://localhost/frontend/src/terminar-proceso/index.html?" + 
            "&jefe=" + findParameter("jefe") + 
            "&linea=" + findParameter("linea") +
            "&producto=" + findParameter("producto") +
            "&fecha=" + findParameter("fecha") +
            "&hora=" + findParameter("hora") +
            "&lista=" + lista);
    });

    $("#cancelar-formulario").on("click", function(e)
    {
        window.location.replace("http://localhost/frontend/src");
    });

    function findParameter(name)
    {
        var paramList = window.location.search.substring(1).split("&");

        for (var param in paramList)
        {
            var current = paramList[param].split("=");

            if (current[0] == name)
                return current[1];
        }

        displayBanner(BANNER_ERROR, INTERNAL_ERROR);
    }

    function crearEntradaLista(incidencia)
    {
        return ((listaIncidencias.length > 1) ?  '<hr />' : '') +
               '<div class="mt-2">' +
               '    <h5>Incidencia: ' + incidencia.descripcion + '</h5>'  +
               '    <span>Hora Parada: ' + incidencia.horaParada + ' - Hora Reinicio: ' + incidencia.horaReinicio + '</span>'  +
               '    <br />' +
               '    <span>Minutos Perdidos: ' + incidencia.minutosPerdidos + '</span>'  +
               '</div>';
    }

    function validarHora(hora)
    {
        return new RegExp("^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$").test(hora);
    }

    function validarDiferenciaHoraria(hParada, hReinicio)
    {
        var splitParada = hParada.split(":");
        var splitReinicio = hReinicio.split(":");

        if (parseInt(splitParada[0]) > parseInt(splitReinicio[0]))
            return false;
        
        if (parseInt(splitParada[0]) == parseInt(splitReinicio[0]))
            return (parseInt(splitParada[1]) < parseInt(splitReinicio[1]));

        return true;
    }

    function calcularMinutosPerdidos(horaParada, horaReinicio)
    {
        var paradaMinutos = (parseInt(horaParada.split(":")[0]) * 60) +
                            parseInt(horaParada.split(":")[1]);
        var reinicioMinutos = (parseInt(horaReinicio.split(":")[0] * 60)) +
                            parseInt(horaReinicio.split(":")[1]);

        return reinicioMinutos - paradaMinutos;
    }

    function displayBanner(type, message)
    {
        var banner = $("#banner");

        banner.removeClass("invisible " + BANNER_ERROR + " " + BANNER_SUCCESS);
        banner.addClass(type);
        banner.html("<span>" +  (type == BANNER_ERROR ? "ERROR! " : "") + message + "</span>");
    }

    function hideBanner()
    {
        var banner = $("#banner");

        if (banner.length == 0)
            return;

        banner.removeClass(BANNER_ERROR + " " + BANNER_SUCCESS);
        banner.addClass("invisible");
        banner.html("<span>Placeholder</span>");
    }
});
