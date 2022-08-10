
$(document).ready(function()
{
    poblarValoresPorDefecto();

    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const BANNER_INVALID_DATA = "Solo se aceptan valores entre 0 y 9999.";
    const BANNER_DUPLICATE_ID_INPUT = "El valor introducido en ID ya está en uso.";
    
    var BANNER_INVALID_DATA_NAME = "none";
    
    $("#guardar-peso").on("click", function(e)
    {
        hideBanner();

        if (!validarDatos())
        {
            return displayBanner(BANNER_ERROR, BANNER_INVALID_DATA +
                " [" + BANNER_INVALID_DATA_NAME + "]");
        }
        
        window.location.replace("http://localhost/frontend/src/terminar-proceso/index.html?" + 
            "&tipo=" + "peso" +
            "&jefe=" + findParameter("jefe") + 
            "&linea=" + findParameter("linea") +
            "&producto=" + findParameter("producto") +
            "&fecha=" + findParameter("fecha") +
            "&hora=" + findParameter("hora") +
            "&fecha=" + findParameter("fecha") +
            "&horaInicio=" + findParameter("hora") +
            "&pesoProduccion=" + $("#pesoProduccion").val() +
            "&pesoBobina=" + $("#pesoBobina").val() +
            "&pesoTotalBobina=" + $("#pesoTotalBobina").val() +
            "&pesoCubeta=" + $("#pesoCubeta").val() +
            "&pesoBobinaCubeta=" + $("#pesoBobinaCubeta").val() +
            "&pesoUnitarioObjetivo=" + $("#pesoUnitarioObjetivo").val() +
            "&numeroUnidades=" + $("#numeroUnidades").val() +
            "&numeroCubetas=" + $("#numeroCubetas").val() +
            "&margenSobrepeso=" + $("#margenSobrepeso").val() +
            "&margenSubpeso=" + $("#margenSubpeso").val() +
            "&tolerancia1=" + $("#tolerancia-1").val() +
            "&tolerancia2=" + $("#tolerancia-2").val() +
            "&tolerancia3=" + $("#tolerancia-3").val() +
            "&tolerancia4=" + $("#tolerancia-4").val() +
            "&tolerancia5=" + $("#tolerancia-5").val() +
            "&tolerancia6=" + $("#tolerancia-6").val() +
            "&tolerancia7=" + $("#tolerancia-7").val());
    });

    $("#reestablecer-valores").on("click", function(e)
    {
        $("#pesoProduccion").val("");
        poblarValoresPorDefecto();
    });

    $("#cancelar-formulario").on("click", function(e)
    {
        e.preventDefault();

        window.location.replace("http://localhost/frontend/src");
    });

    function validarDatos()
    {
        BANNER_INVALID_DATA_NAME = "none";

        var enteros = [
            $("#numeroUnidades"),
            $("#numeroCubetas"),
        ];

        var reales = [
            $("#pesoProduccion"),
            $("#pesoBobina"),
            $("#pesoTotalBobina"),
            $("#pesoCubeta"),
            $("#pesoBobinaCubeta"),
            $("#pesoUnitarioObjetivo"),
            $("#margenSobrepeso"),
            $("#margenSubpeso"),
            $("#tolerancia-1"),
            $("#tolerancia-2"),
            $("#tolerancia-3"),
            $("#tolerancia-4"),
            $("#tolerancia-5"),
            $("#tolerancia-6"),
            $("#tolerancia-7")
        ];
        
        enteros.forEach(element =>
        {
            if (!validarEntero(element.val()))
            {
                BANNER_INVALID_DATA_NAME = $("label[for='" + element.attr('id') + "']").html();
                return false;
            }
        })

        if (BANNER_INVALID_DATA_NAME !== "none") return false;

        reales.forEach(element => 
        {
            if (!validarReal(element.val()))
            {
                BANNER_INVALID_DATA_NAME = $("label[for='" + element.attr('id') + "']").html();
                return false;
            }
        })

        if (BANNER_INVALID_DATA_NAME !== "none") return false;

        return true;
    }

    function validarEntero(entero)
    { 
        return new RegExp("^0*[0-9]{1,4}$").test(entero);
    }

    function validarReal(real)
    {
        return new RegExp("^0*[0-9]{1,4}([.,][0-9]{0,3})?$").test(real);
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

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();
        
        xmlHttp.open("GET", url, false);
        xmlHttp.send();

        return JSON.parse(xmlHttp.responseText);
    }

    function poblarValoresPorDefecto()
    {
        $("#pesoProduccion").val("");
        $("#numeroUnidades").val("5");
        $("#pesoBobina").val("0.75");
        $("#pesoTotalBobina").val("3.75");
        $("#pesoCubeta").val("21.05");
        $("#pesoBobinaCubeta").val("2.7");
        $("#numeroCubetas").val("2");

        $("#pesoUnitarioObjetivo").val("36");
        $("#margenSobrepeso").val("4.0");
        $("#margenSubpeso").val("4.5");

        $("#tolerancia-1").val("9");
        $("#tolerancia-2").val("4.5");
        $("#tolerancia-3").val("4.5");
        $("#tolerancia-4").val("9");
        $("#tolerancia-5").val("3");
        $("#tolerancia-6").val("15");
        $("#tolerancia-7").val("1.5");

        $("#hora").val(getTime());
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

    function getTime()
    {
        return httpGetRequest("http://localhost/backend/src/Server.php?request=getTime")["data"];
    }
});
