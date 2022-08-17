
$(document).ready(function()
{
    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const INTERNAL_ERROR = "Un error inesperado ha ocurrido.";
    const EMPTY_DESCRIPTION = "El campo 'Peso Produccion' no puede ser vacío.";
    const BANNER_INVALID_DATA = "Solo se aceptan valores entre 0 y 99999.";
    const SUCCESSFULL_WEIGHT_INPUT = "Peso añadida con éxito a la lista!";

    var listaPesos = [];
    $("#hora").val(getTime());
    
    $("#guardar-peso").on("click", function(e)
    {
        hideBanner();
        $("#hora").val(getTime());
        
        var hora = $("#hora").val();
        var peso = $("#pesoProduccion").val();

        if (peso == "")
            return displayBanner(BANNER_ERROR, EMPTY_DESCRIPTION);
        
        if (!validarPeso(peso))
            return displayBanner(BANNER_ERROR, BANNER_INVALID_DATA);
        
        listaPesos.push({peso:peso, hora:hora});
        $("#listaPesos").append(crearEntradaLista(peso, hora));
        displayBanner(BANNER_SUCCESS, SUCCESSFULL_WEIGHT_INPUT);

        $("#pesoProduccion").val("");
    });

    $("#cerrar-formulario").on("click", function(e)
    {
        window.location.replace("http://localhost/frontend/src/terminar-proceso/index.html?" + 
            "&tipo=" + "peso" +
            "&jefe=" + findParameter("jefe") + 
            "&linea=" + findParameter("linea") +
            "&producto=" + findParameter("producto") +
            "&fecha=" + findParameter("fecha") +
            "&hora=" + findParameter("hora") +
            "&fecha=" + findParameter("fecha") +
            "&horaInicio=" + findParameter("hora") +
            "&pesoBobina=" + findParameter("pesoBobina") +
            "&pesoTotalBobina=" + findParameter("pesoTotalBobina") +
            "&pesoCubeta=" + findParameter("pesoCubeta") +
            "&pesoBobinaCubeta=" + findParameter("pesoBobinaCubeta") +
            "&pesoUnitarioObjetivo=" + findParameter("pesoUnitarioObjetivo") +
            "&numeroUnidades=" + findParameter("numeroUnidades") +
            "&numeroCubetas=" + findParameter("numeroCubetas") +
            "&margenSobrepeso=" + findParameter("margenSobrepeso") +
            "&margenSubpeso=" + findParameter("margenSubpeso") +
            "&tolerancia1=" + findParameter("tolerancia1") +
            "&tolerancia2=" + findParameter("tolerancia2") +
            "&tolerancia3=" + findParameter("tolerancia3") +
            "&tolerancia4=" + findParameter("tolerancia4") +
            "&tolerancia5=" + findParameter("tolerancia5") +
            "&tolerancia6=" + findParameter("tolerancia6") +
            "&tolerancia7=" + findParameter("tolerancia7") + 
            "&lista=" + JSON.stringify(listaPesos));
    });

    $("#cancelar-formulario").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src");
    });

    function crearEntradaLista(peso, hora)
    {
        return ((listaPesos.length > 1) ?  '<hr />' : '') +
               '<div class="mt-2">' +
               '    <h5>Peso: ' + peso + '</h5>'  +
               '    <h6>Hora: ' + hora + '</h6>'  +
               '</div>';
    }

    function validarPeso(peso)
    {
        return new RegExp("^0*[0-9]{1,5}([.,][0-9]{0,3})?$").test(peso);
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

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();
        
        xmlHttp.open("GET", url, false);
        xmlHttp.send();

        return JSON.parse(xmlHttp.responseText);
    }

    function getTime()
    {
        return httpGetRequest("http://localhost/backend/src/Server.php?request=getTime")["data"];
    }
});
