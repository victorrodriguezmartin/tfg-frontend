
$(document).ready(function()
{
    const GET_PESOS_UNITARIOS = "http://localhost/backend/src/Server.php?request=getProcesosPesoUnitarioById&id="

    var datos = JSON.parse(decodeURIComponent(findParameter("datos")));
    var datosPeso = JSON.parse(decodeURIComponent(findParameter("datosPeso")));
    var pesos = httpGetRequest(GET_PESOS_UNITARIOS + datos["id_proceso_peso"])["data"];

    rellenarCampos();
    rellenarGrafica();

    $("#btn-lista").on("click", function(e) 
    {
        toggle();

        $("#lista-container").css("display", "block");
        $("#grafica-container").css("display", "none");
    });

    $("#btn-grafica").on("click", function(e) 
    {
        toggle();

        $("#lista-container").css("display", "none");
        $("#grafica-container").css("display", "block");
    });

    $("#volver").on("click", function(e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src/listado-proceso/index.html?" +
            "&tipoBusqueda=peso" +
            "&terminoBusqueda=" + findParameter("terminoBusqueda"));
    });

    function rellenarCampos()
    {
        $("#idPersonalizado").append(datos.id);
        $("#jefe").append(datos.jefe.replaceAll("_", " "));
        $("#linea").append(datos.linea.replaceAll("_", " "));
        $("#producto").append(datos.producto.replaceAll("_", " "));
        $("#fecha").append(getDate(datos.hora_inicio.replaceAll("_", " ")));
        $("#horaInicio").append(getTime(datos.hora_inicio.replaceAll("_", " ")));
        $("#horaFin").append(getTime(datos.hora_fin.replaceAll("_", " ")));

        pesos.forEach((element, index) => {

            // var pesoUnidad = calcularPesoUnidad(element["peso"], element["numero_unidades"]);
            var pesoUnidad = calcularPesoUnidad(element["peso"], datosPeso);
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

    function rellenarGrafica()
    {
        var valores = [[], []];

        pesos.forEach((element, index) =>
        {
            valores[0][index] = element["peso"];
            valores[1][index] = getTime(element["hora"]);
        });

        const ctx = document.getElementById('grafica').getContext('2d');

        new Chart(ctx,
        {
            type: "bar",
            data:
            {
                labels: valores[1],
                datasets:
                [{
                    label: "Peso en Kgs",
                    backgroundColor: [ "red", "green" ],
                    data: valores[0]
                }]
            },
            options:
            {
                plugins:
                {
                    legend:
                    {
                        display: false
                    }
                }
            }
        });
    }

    // Peso unidad = [(peso medido/ nº cubetas) - peso cubeta - peso bobina cubeta - peso total bobinas ]/nº unidades
    function calcularPesoUnidad(pesoMedio, medidas)
    {
        return ((pesoMedio / medidas["numero_cubetas"]) - medidas["peso_cubetas"] - medidas["peso_bobina_cubetas"] - medidas["peso_total_bobina"]) / medidas["numero_unidades"];
    }

    function cumpleRequisitos(pesoObjetivo, pesoUnidad, margenSubpeso, margenSobrepeso)
    {
        var subpeso = pesoUnidad < (pesoObjetivo - (pesoObjetivo * margenSubpeso));
        var sobrepeso = pesoUnidad > (pesoObjetivo + (pesoObjetivo * margenSobrepeso));

        console.log(subpeso);

        return subpeso || sobrepeso;
    }

    function toggle()
    {
        $("#btn-lista").toggleClass("active");
        $("#btn-grafica").toggleClass("active");
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
    }

    function httpGetRequest(url)
    {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        
        return JSON.parse(xmlHttp.responseText);
    }
});

