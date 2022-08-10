
$(document).ready(function()
{
    // TODO: REMOVE BEFORE UPLOADING! (FROM HERE)
    var TEST_TEXT_VALUE_1 = "Azul";
    $("#idPersonalizado").val(TEST_TEXT_VALUE_1);
    var TEST_INT_VALUE_1 = "3000";
    $("#kilosTeoricos").val(TEST_INT_VALUE_1);
    var TEST_INT_VALUE_2 = "2500";
    $("#kilosReales").val(TEST_INT_VALUE_2);
    // TODO: REMOVE BEFORE UPLOADING! (TO HERE)

    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const BANNER_INVALID_KILO_INPUT = "Introduce un valor de kilos entre 0 y 99999 kgs.";
    const BANNER_DUPLICATE_ID_INPUT = "El valor introducido en ID ya está en uso.";

    var listaIncidencias = [];
    poblarListaIncidencias();

    $("#finalizar-proceso").on("click", function(e)
    {
        hideBanner();

        if (!validarKilos($("#kilosTeoricos").val()) || !validarKilos($("#kilosReales").val()))
            return displayBanner(BANNER_ERROR, BANNER_INVALID_KILO_INPUT);

        $.ajax({
            url: 'http://localhost/backend/src/Server.php',
            data: {
                request: "addProcesoIncidencia",
                linea: findParameter("linea"),
                producto: findParameter("producto"),
                jefe: findParameter("jefe"),
                kilosTeoricos: $("#kilosTeoricos").val(),
                kilosReales: $("#kilosReales").val(),
                idPersonalizado: $("#idPersonalizado").val(),
                lista: listaIncidencias,
                fecha: findParameter("fecha"),
                horaInicio: findParameter("hora")
            },
            type: 'post',
            success: function(result)
            {
                result = JSON.parse(result);

                if (result.code == 200)
                    window.location.replace("http://localhost/frontend/src/");
                else if (result.data.includes("1062"))
                    displayBanner(BANNER_ERROR, BANNER_DUPLICATE_ID_INPUT);
                else
                    displayBanner(BANNER_ERROR, result.data);
            }
        });
    });

    $("#cancelar-proceso").on("click", function(e)
    {
        window.location.replace("http://localhost/frontend/src/");
    });

    function poblarListaIncidencias()
    {
        var index = 0;

        while ((entrada = findParameter("incidencia_" + index++)) != null)
        {
            var campos = entrada.split(",");

            var incidencia = {
                descripcion: campos[0].split(":")[1].replaceAll("_", " "),
                horaParada: campos[1].split(":")[1].replace("_", ":"),
                horaReinicio: campos[2].split(":")[1].replace("_", ":"),
                minutosPerdidos: campos[3].split(":")[1].slice(0, -1)
            }

            listaIncidencias.push(incidencia);
            $("#listaIncidencias").append(crearEntradaLista(incidencia));
        }
    }

    function crearEntradaLista(incidencia)
    {
        return ((listaIncidencias.length > 1) ?  '<hr />' : '') +
               '<div class="mt-2">' +
               '    <h5>Incidencia: ' + decodeURIComponent(incidencia.descripcion) + '</h5>'  +
               '    <span>Hora Parada: ' + incidencia.horaParada + ' - Hora Reinicio: ' + incidencia.horaReinicio + '</span>' +
               '    <br />' +
               '    <span>Minutos Perdidos: ' + incidencia.minutosPerdidos + '</span>' +
               '</div>';
    }
    
    function findParameter(name, throwError)
    {
        var paramList = window.location.search.substring(1).split("&");

        for (var param in paramList)
        {
            var current = paramList[param].split("=");

            if (current[0] == name)
                return current[1];
        }

        if (!throwError) return null;

        return addError("Parameter '" + name + "' is missing!");
    }

    function validarKilos(kilos)
    {
        return new RegExp("^0*[0-9]{0,4}([.,][0-9]{0,3})?$").test(kilos);
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
