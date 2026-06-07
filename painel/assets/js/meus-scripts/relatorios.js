"use strict";
document.addEventListener("DOMContentLoaded", function (e) {
    const frc = document.getElementById("formRelatorioCliente");
    const fra = document.getElementById("formRelatorioAgente");

    const fecharFatura = document.querySelector("[data-fatura]");
    fecharFatura && fecharFatura.addEventListener("click", (event) => {

        $(".ajax_load")
            .fadeIn(200)
            .css("display", "flex")
            .find(".ajax_load_box_title")
            .text("Aguarde, enviando dados para o servido de processamento...");

        FormValidation.utils.fetch(urlServer + "/relatorios/geral/faturar", {
            method: 'POST',
            params: $('[data-fatura]')[0].dataset,
        }).then((data) => {

            $(".ajax_load").fadeOut(200);
            if (data.type) {
                swalView("top-start", data.type, data.message);

                if (data.redirect) {
                    setTimeout(function () {
                        location.href = data.redirect;
                    }, 300)
                }
            }

        }).catch((error) => {
            $(".ajax_load").fadeOut(200);
            console.error('Error:', error);
        });

        setTimeout(() => {
            $(".ajax_load").fadeOut(200);
        }, 500)
    });
});


function faturamento(event) {
    var form = $("#faturamento");
    var i = [].slice.call(document.querySelectorAll("#list-item-input"));
    if (i.length > 0) {
        $('#btn-action').removeAttr('disabled');
        let t = 0;

        var data = [];

        i && i.forEach((e) => {
            if (e.checked) {
                t++;
                data.push(e.dataset);
            }
        });

        if (t > 0) {
            $.ajax({
                url: form.attr("action") + "/" + $("#vencimento").val(),
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                traditional: true,
                timeout: 10000,
                beforeSend: function () {
                    $(".ajax_load")
                        .fadeIn(200)
                        .css("display", "flex")
                        .find(".ajax_load_box_title")
                        .text("Aguarde, enviando dados para o servido de processamento...");
                },
                error: (xhr, textStatus, e) => {
                    $(".ajax_load").fadeOut(200);
                    Swal.fire({
                        icon: textStatus,
                        text: xhr.responseJSON.message,
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                },
                success: (response) => {
                    $(".ajax_load").fadeOut(200);
                    $('#table-result').html("");
                    if (response.redirect) {
                        window.location.href = response.redirect;
                    }
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Selecione um objeto para criar a fatura.',
                customClass: { confirmButton: "btn btn-primary" }
            });
        }
    } else {
        $('#btn-action').attr('disabled', 'disabled');
    }
}
