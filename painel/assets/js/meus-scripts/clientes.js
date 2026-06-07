"use strict";
$(function () {

    dataTableView(urlServer + "/clientes/lista", numStart, numPage, "Cliente")

}), function () {
    
    const t = document.getElementById("formCliente");
    const load = $(".ajax_load");
    const CPNJ_CPF = "([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})";

    t && FormValidation.formValidation(t, {
        fields: {
            razao_social: { validators: { notEmpty: { message: "Informe o nome do cliente" } } },
            /* cnpj_cpf: {
                validators: {
                    notEmpty: {message: "Informe o CPNJ ou CPF do cliente"},
                    regexp: {
                        regexp: CPNJ_CPF,
                        message: "O valor não é um endereço de e-mail válido"
                    }
                }
            }, */
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

        let data = $("#formCliente").serialize();
        const urlParams = new URLSearchParams(data);

        FormValidation.utils.fetch(urlServer + "/clientes/cliente", {
            method: 'POST',
            params: paramsToObject(urlParams.entries()),
        })
            .then((data) => {

                $(".ajax_load").fadeOut(200);
                if (data.type) {
                    swalView("top-start", data.type, data.message);

                    if (data.reload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }
                }

            })
            .catch((error) => {
                $(".ajax_load").fadeOut(200);
                console.error('Error:', error);
            });
    });


}();
// update 09-02-2023
