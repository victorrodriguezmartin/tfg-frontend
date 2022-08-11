
$(document).ready(function()
{
    rellenarCampos();

    $("#volver").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src/listado-proceso/index.html?" +
            "&tipoBusqueda=peso" +
            "&terminoBusqueda=" + findParameter("terminoBusqueda"));
    });

    function rellenarCampos()
    {
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
});
