
$(document).ready(function()
{
    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const INVALID_INPUT_MESSAGE = "Todos los campos tienen que tener un valor!";

    $("#fecha").val(getDate());
    $("#hora").val(getTime());

    $("select").on("click", function(e)
    {
        var id = $(this).attr("id");

        if (id == "select-jefe")
        {
            var values = httpGetRequest(getRequestURL("getJefes"));
            populateSelect($(this), values, "nombre");
        }

        if (id == "select-linea")
        {
            var values = httpGetRequest(getRequestURL("getLineas"));
            populateSelect($(this), values, "codigo");
        }

    });

    $("#proceso-incidencia").on("click", function (e)
    {
        if (!validateInput())
            return displayBanner(BANNER_ERROR, INVALID_INPUT_MESSAGE);
    });

    $("#proceso-peso").on("click", function (e)
    {
        if (!validateInput())
            return displayBanner(BANNER_ERROR, INVALID_INPUT_MESSAGE);
    });

    $("#cancelar-proceso").on("click", function (e)
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

    function validateInput()
    {
        return false;
    }

    function populateSelect(select, values, key)
    {
        if (!isSelectEmpty(select))
            return;
        
        if (values.code !== 200)
            return displayBanner(BANNER_ERROR, values.msg);

        select.find(".select-placeholder").remove();

        values.data.forEach((value, index) =>
            select.append("<option>" + value[key] + "</option>"));
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

    function isSelectEmpty(select)
    {
        return select.find(".select-placeholder").length !== 0;
    }

    function getRequestURL(request)
    {
        return "http://localhost/backend/Server.php?request=" + request;
    }

    function getDate()
    {
        return httpGetRequest("http://localhost/backend/Server.php?request=getDate")["data"];
    }

    function getTime()
    {
        return httpGetRequest("http://localhost/backend/Server.php?request=getTime")["data"];
    }
});

// $("select").on("click", function(e)
// {
//     var selectId = $(this).attr("id");
//     var field = "";
//     var url = "http://localhost/backend/Server.php?request=";
//     var id = "";
    
//     if (isSelectEmpty(selectId))
//         removeBanner();

//     if (selectId == "select-jefe")
//     {
//         url += "selectJefe";
//         id="id_empleado";
//         field = "nombre";
//     };

//     if (selectId == "select-linea")
//     {
//         url += "selectLinea";
//         id="id_linea";
//         field = "codigo";
//     };

//     if (selectId == "select-producto")
//     {
//         url += "selectProducto";
//         id="id_producto";
//         field = "nombre";
//     };

//     selectOpen(selectId, url, id, field);
// });
