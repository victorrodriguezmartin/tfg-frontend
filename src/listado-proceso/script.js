
$(document).ready(function()
{
    $("#buscar").on("click", function (e)
    {
        e.preventDefault();

        console.log($("#termino-busqueda").val());
    });

    $("#volver").on("click", function (e)
    {
        e.preventDefault();
        window.location.replace("http://localhost/frontend/src/index.html");
    });
});
