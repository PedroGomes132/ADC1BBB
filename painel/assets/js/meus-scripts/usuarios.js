"use strict";
$(function () {

    dataTableView(urlServer + "/usuarios/lista", numStart, numPage, "Usuario")

}), function () {

    const t = document.getElementById("formUsuario");
    var load = $(".ajax_load");
    const VCPF = "([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})";

    t && FormValidation.formValidation(t, {
        fields: {
            nome: { validators: { notEmpty: { message: "Insira o seu primeiro nome" } } },
            sobrenome: { validators: { notEmpty: { message: "Insira o seu segundo nome" } } },
            genero: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
            cpf: {
                validators: {
                    notEmpty: { message: "Informe o seu CPF" },
                    regexp: {
                        regexp: VCPF,
                        message: "O CPF digitado não é valido!"
                    }
                }
            },
            data_nascimento: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
            email: {
                validators: {
                    notEmpty: { message: "insira o seu email" },
                    emailAddress: { message: "O valor não é um endereço de e-mail válido" }
                }
            },
            telefone: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
            cep: { validators: { notEmpty: { message: "Este campo é obrigatorio!" } } },
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
        // Send data to back-end

        let data = $("#formUsuario").serialize();
        const urlParams = new URLSearchParams(data);

        FormValidation.utils.fetch(urlServer + "/usuarios/usuario", {
            method: 'POST',
            params: paramsToObject(urlParams.entries())
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

        })
            .catch((error) => {
                $(".ajax_load").fadeOut(200);
                console.error('Error:', error);
            });
    });
    
}();

//função ajax para deleta um registro

// update 09-02-2023
