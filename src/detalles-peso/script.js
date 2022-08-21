
$(document).ready(function()
{
    const GET_PESOS_UNITARIOS = "http://localhost/backend/src/Server.php?request=getProcesosPesoUnitarioById&id="
    const GET_TOLERANCIAS_BY_ID = "http://localhost/backend/src/Server.php?request=getToleranciasById&id="

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
            var pesoUnidad = calcularPesoUnidad(element["peso"], datosPeso);
            var pesoObjetivo = datosPeso["peso_objetivo"];
            var margenSubpeso = datosPeso["margen_subpeso"];
            var margenSobrepeso = datosPeso["margen_sobrepeso"];
            var tolerancia = getTolerancia(pesoObjetivo);

            // 0 => Rojo, 1 => Amarillo, 2 => Verde
            var color = calcularCumplimientoRequisitos(pesoUnidad, pesoObjetivo, margenSubpeso, margenSobrepeso, tolerancia);

            $("#lista").append($("<tr>" +
              "    <th scope='row'>" + (index + 1) + "</th>" +
              "    <td>" + pesoUnidad + "</td>" +
              "    <td>" + pesoObjetivo + "</td>" +
              "    <td>" + margenSubpeso + "%</td>" +
              "    <td>" + margenSobrepeso + "%</td>" +
              "    <td>" + tolerancia + "%</td>" +
              "    <td class='" + applyColor(color) +"'>" + ((color != 0) ? "" : "No ") + " Cumple" + "</td>" +
              "</tr>"));
        });
    }

    function rellenarGrafica()
    {
        var valores = [[], [], []];

        pesos.forEach((element, index) =>
        {
            valores[0][index] = calcularPesoUnidad(element["peso"]);
            valores[1][index] = getTime(element["hora"]),
            valores[2][index] = calcularCumplimientoRequisitos(valores[0][index]);
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
                    backgroundColor: function (valor) {
                        var color = valores[2][valor.index];
                        if (color == 0) return "red";
                        if (color == 1) return "yellow";
                        return "green";
                    },
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
                },
                scales:
                {
                    y: { min: getMinValue(valores[0]) }
                }
            }
        });
    }

    // Peso unidad = [(peso medido/ nº cubetas) - peso cubeta - peso bobina cubeta - peso total bobinas ]/nº unidades
    function calcularPesoUnidad(pesoMedio)
    {
        return ((pesoMedio / datosPeso["numero_cubetas"]) - datosPeso["peso_cubetas"] - datosPeso["peso_bobina_cubetas"] - datosPeso["peso_total_bobina"]) / datosPeso["numero_unidades"];
    }

    function calcularCumplimientoRequisitos(pesoUnidad)
    {
        var pesoObjetivo = datosPeso["peso_objetivo"];
        var margenSubpeso = datosPeso["margen_subpeso"];
        var margenSobrepeso = datosPeso["margen_sobrepeso"];
        var tolerancia = getTolerancia(pesoObjetivo);

        var rangoMenor = pesoObjetivo - (pesoObjetivo * margenSubpeso / 100);
        var rangoMayor = pesoObjetivo + (pesoObjetivo * margenSobrepeso / 100);
        var rangoLegal = pesoObjetivo + (pesoObjetivo * tolerancia / 100);

        if ((pesoUnidad < rangoMenor) || (pesoUnidad > rangoLegal))
            return 0;

        if ((pesoUnidad >= pesoObjetivo) && (pesoUnidad <= rangoMayor))
            return 2;
        
        return 1;
    }

    function applyColor(color)
    {
        if (color == 0) return "table-danger";
        if (color == 1) return "table-warning";

        return "table-success";
    }

    function getTolerancia(pesoObjetivo)
    {
        var tolerancias = httpGetRequest(GET_TOLERANCIAS_BY_ID + datosPeso["id_tolerancias"])["data"][0];

        if (pesoObjetivo <= 50) return tolerancias["tolerancia_1"];
        if (pesoObjetivo <= 100) return tolerancias["tolerancia_2"];
        if (pesoObjetivo <= 200) return tolerancias["tolerancia_3"];
        if (pesoObjetivo <= 300) return tolerancias["tolerancia_4"];
        if (pesoObjetivo <= 500) return tolerancias["tolerancia_5"];
        if (pesoObjetivo <= 1000) return tolerancias["tolerancia_6"];
        if (pesoObjetivo <= 10000) return tolerancias["tolerancia_7"];
    }

    function toggle()
    {
        $("#btn-lista").toggleClass("active");
        $("#btn-grafica").toggleClass("active");
    }

    function getMinValue(valores)
    {
        var min = 9999999999999999;
        var threshold = 0.05;

        valores.forEach(element =>
        {
            if (element < min) min = element;
        });

        return min - (min * threshold);
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

