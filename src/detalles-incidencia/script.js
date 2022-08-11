
$(document).ready(function()
{
    rellenarCampos();

    $("#volver").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src/listado-proceso/index.html?" +
            "&tipoBusqueda=incidencias" +
            "&terminoBusqueda=" + findParameter("terminoBusqueda"));
    });

    function rellenarCampos()
    {
        var incidencias = JSON.parse(decodeURIComponent(findParameter("incidencias")));

        $("#idPersonalizado").append(incidencias[0].id_personalizado);
        $("#jefe").append(incidencias[0].jefe.replaceAll("_", " "));
        $("#linea").append(incidencias[0].linea.replaceAll("_", " "));
        $("#producto").append(incidencias[0].producto.replaceAll("_", " "));
        $("#fecha").append(getDate(incidencias[0].hora_inicio.replaceAll("_", " ")));
        $("#horaInicio").append(getTime(incidencias[0].hora_inicio.replaceAll("_", " ")));
        $("#horaFin").append(getTime(incidencias[0].hora_fin.replaceAll("_", " ")));

        incidencias.forEach((element, index) =>
        {
            if (!element.descripcion)
                return;

            $("#lista").append($("<tr>" +
              "    <th scope='row'>" + (index + 1) + "</th>" +
              "    <td>" + element.descripcion.replaceAll("_", " ") + "</td>" +
              "    <td>" + getTime(element.horaParada.replaceAll("_", " ")) + "</td>" +
              "    <td>" + getTime(element.horaReinicio.replaceAll("_", " ")) + "</td>" +
              "    <td>" + calcularMinutosPerdidos(element.horaParada, element.horaReinicio) + "</td>" +
              "</tr>"));
        });
    }

    function calcularMinutosPerdidos(horaParada, horaReinicio)
    {
        horaParada = new Date(horaParada.replaceAll("_", " "));
        horaReinicio = new Date(horaReinicio.replaceAll("_", " "));
        
        return Math.abs(parseInt((horaParada.getTime() - horaReinicio.getTime()) / 60000));
    }

    function getDate(datetime)
    {
        return datetime.split(" ")[0];
    }

    function getTime(datetime)
    {
        return datetime.split(" ")[1];
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

        return null;
    }
});