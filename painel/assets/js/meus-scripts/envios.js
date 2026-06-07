"use strict";
$(function () {

    dataTableView(urlServer + "/envios/lista", numStart, numPage, "Cliente")


}), function () {

    const t = document.getElementById("form-criar-etiqueta");
    const load = $(".ajax_load");
    try {
        t && FormValidation.formValidation(t, {
            fields: {
                nomeDestinatario: { validators: { notEmpty: { message: "Informe o nome do destinatario" } } },
                cep: { validators: { notEmpty: { message: "Campo obrigatório" } } },
                rua: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
                numero: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
                bairro: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
                cidade: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
                uf: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger,
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: "", rowSelector: function (e, t) {
                        return ".mb-3"
                    }
                }),
                submitButton: new FormValidation.plugins.SubmitButton,
                autoFocus: new FormValidation.plugins.AutoFocus
            }
        }).on('core.form.valid', function () {

            $(".ajax_load")
                .fadeIn(200)
                .css("display", "flex")
                .find(".ajax_load_box_title")
                .text("Aguarde, enviando dados para o servido de processamento...");

            let data = $("#form-criar-etiqueta").serialize();
            const urlParams = new URLSearchParams(data);

            FormValidation.utils.fetch(urlServer + "/envios/envio", {
                method: 'POST',
                params: paramsToObject(urlParams.entries()),
            }).then((data) => {

                $(".ajax_load").fadeOut(200);
                if (data.type) {
                    swalView("top-start", data.type, data.message);

                    if (data.reload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }
                }

            }).catch((error) => {
                $(".ajax_load").fadeOut(200);
                console.error('Error:', error);
            });
        });
    } catch (error) {
        console.log(error);
    }

}();

function imprimirVarios(event) {

    var i = [].slice.call(document.querySelectorAll(".envio-list-item-input"));

    if (i.length > 0) {
        $('#printer').removeAttr('disabled');
        let t = 0;
        i && i.forEach((e) => {

            i.forEach((e) => {
                e.checked && t++;
            });
        });

        if (t > 0) {
            $("#envio-etiqueta").submit();
        }
    } else {
        $('#printer').attr('disabled', 'disabled');
    }
}

function isChecked(event) {
    var i = [].slice.call(document.querySelectorAll(".envio-list-item-input"));
    if (i.length > 0) {
        i && i.forEach((e) => {
            let t = 0;

            i.forEach((e) => {
                e.checked && t++;
            })

            if (t > 0) {
                $('#printer').removeAttr('disabled');
            } else {
                $('#printer').attr('disabled', 'disabled');
            }
        });
    }
}

function openModal(event) {
    var envio = event.dataset.idEnvio;
    dataTableView(urlServer + "/envios/rastreios/" + envio, numStart, numPage, "cliente-coleta-fixas", "table-result-rastreios");

    $('.modal-title').text(`Eventos do pacote`);
    $("#timeline-rastreios").modal("show");
}
// update 09-02-2023
