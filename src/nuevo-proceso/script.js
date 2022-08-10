
$(document).ready(function()
{
    const BANNER_ERROR = "alert-danger";
    const BANNER_SUCCESS = "alert-success";

    const INVALID_INPUT = "Todos los campos tienen que tener un valor!";

    $("#fecha").val(getDate());
    $("#hora").val(getTime());

    $("select").on("click", function(e)
    {
        var id = $(this).attr("id");

        if (isSelectEmpty($(this)))
            hideBanner();

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

        if (id == "select-producto")
        {
            var values = httpGetRequest(getRequestURL("getProductos"));
            populateSelect($(this), values, "codigo");
        }

    });

    $("#proceso-incidencia").on("click", function (e)
    {
        if (!validateInput())
            return displayBanner(BANNER_ERROR, INVALID_INPUT);

        var selectJefeEquipo = $("#select-jefe option:selected").text().trim();
        var selectLinea = $("#select-linea option:selected").text().trim();
        var selectProducto = $("#select-producto option:selected").text().trim();

        window.location.replace("http://localhost/frontend/src/proceso-incidencia/index.html?" + 
            "&jefe=" + selectJefeEquipo.replace(" ", "_") + 
            "&linea=" + selectLinea.replace(" ", "_") +
            "&producto=" + selectProducto.replace(" ", "_") +
            "&fecha=" + $("#fecha").val().replace(" ", "_") +
            "&hora=" + $("#hora").val().replace(" ", "_"));
    });

    $("#proceso-peso").on("click", function (e)
    {
        if (!validateInput())
            return displayBanner(BANNER_ERROR, INVALID_INPUT);
        
        var selectJefeEquipo = $("#select-jefe option:selected").text().trim();
        var selectLinea = $("#select-linea option:selected").text().trim();
        var selectProducto = $("#select-producto option:selected").text().trim();

        window.location.replace("http://localhost/frontend/src/proceso-peso/index.html?" + 
            "&jefe=" + selectJefeEquipo.replace(" ", "_") + 
            "&linea=" + selectLinea.replace(" ", "_") +
            "&producto=" + selectProducto.replace(" ", "_") +
            "&fecha=" + $("#fecha").val().replace(" ", "_") +
            "&hora=" + $("#hora").val().replace(" ", "_"));
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
        return (!isSelectEmpty($("#select-jefe")) &&
                !isSelectEmpty($("#select-linea")) &&
                !isSelectEmpty($("#select-producto")));
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
        return !select.val();
    }

    function getRequestURL(request)
    {
        return "http://localhost/backend/src/Server.php?request=" + request;
    }

    function getDate()
    {
        return httpGetRequest("http://localhost/backend/src/Server.php?request=getDate")["data"];
    }

    function getTime()
    {
        return httpGetRequest("http://localhost/backend/src/Server.php?request=getTime")["data"];
    }
});
