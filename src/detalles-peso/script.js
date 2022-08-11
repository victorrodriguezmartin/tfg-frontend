
$(document).ready(function()
{
    const GET_PESOS_UNITARIOS = "http://localhost/backend/src/Server.php?request=getProcesosPesoUnitarioById&id="

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
        var datos = JSON.parse(decodeURIComponent(findParameter("datos")));
        var datosPeso = JSON.parse(decodeURIComponent(findParameter("datosPeso")));

        $("#idPersonalizado").append(datos.id);
        $("#jefe").append(datos.jefe.replaceAll("_", " "));
        $("#linea").append(datos.linea.replaceAll("_", " "));
        $("#producto").append(datos.producto.replaceAll("_", " "));
        $("#fecha").append(getDate(datos.hora_inicio.replaceAll("_", " ")));
        $("#horaInicio").append(getTime(datos.hora_inicio.replaceAll("_", " ")));
        $("#horaFin").append(getTime(datos.hora_fin.replaceAll("_", " ")));

        var pesos = httpGetRequest(GET_PESOS_UNITARIOS + "1")["data"];

        console.log(datosPeso);

        pesos.forEach((element, index) => {

            var pesoUnidad = calcularPesoUnidad(element["peso"], element["numero_unidades"]);
            var pesoObjetivo = datosPeso["peso_objetivo"];
            var margenSubpeso = datosPeso["margen_subpeso"];
            var margenSobrepeso = datosPeso["margen_sobrepeso"];

            var veredicto = cumpleRequisitos(margenSubpeso, margenSobrepeso);
            var estiloVeredicto = veredicto ? "table-success" : "table-danger";

            $("#lista").append($("<tr>" +
              "    <th scope='row'>" + (index + 1) + "</th>" +
              "    <td>" + pesoUnidad + "</td>" +
              "    <td>" + element["peso"] + "</td>" +
              "    <td>" + pesoObjetivo + "</td>" +
              "    <td>" + margenSubpeso + "%</td>" +
              "    <td>" + margenSobrepeso + "%</td>" +
              "    <td class='" + estiloVeredicto + "'>" + (veredicto ? "" : "No ") + " Cumple" + "</td>" +
              "</tr>"));
        });
    }

    function calcularPesoUnidad(pesoUnidad, numeroUnidades)
    {
        return 1230;
    }

    function cumpleRequisitos(pesoObjetivo, pesoUnidad, margenSubpeso, margenSobrepeso)
    {
        var subpeso = pesoUnidad < (pesoObjetivo - (pesoObjetivo * margenSubpeso));
        var sobrepeso = pesoUnidad > (pesoObjetivo + (pesoObjetivo * margenSobrepeso));

        return !subpeso && !subpeso;
    }

    function getDate(datetime)
    {
        return datetime.split(" ")[0];
    }

    function getTime(datetime)
    {
        return datetime.split(" ")[1];
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
});

