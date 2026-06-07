"use strict";
const formAuthentication = document.querySelector("#formAuthentication");
document.addEventListener("DOMContentLoaded", function (e) {
    var t;
    formAuthentication &&
        FormValidation.formValidation(formAuthentication, {
            fields: {
                password: {
                    validators: {
                        notEmpty: { message: "Por favor, insira sua senha" },
                        stringLength: { min: 8, message: "A senha deve ter mais de 8 caracteres" }
                    }
                },
                "confirm-password": {
                    validators: {
                        notEmpty: { message: "Please confirm password" },
                        identical: {
                            compare: function () {
                                return formAuthentication.querySelector('[name="password"]').value;
                            },
                            message: "A senha e sua confirmação não são as mesmas",
                        },
                        stringLength: { min: 8, message: "A senha deve ter mais de 8 caracteres" },
                    },
                },
                terms: { validators: { notEmpty: { message: "Please agree terms & conditions" } } },
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
            },
            init: (e) => {
                e.on("plugins.message.placed", function (e) {
                    e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
                });
            },
        }).on('core.form.valid', function (e) {
            e.preventDefault();
            $(".ajax_load")
                .fadeIn(200)
                .css("display", "flex")
                .find(".ajax_load_box_title")
                .text("Aguarde, enviando dados para o servido de processamento...");

            let data = $("#formCliente").serialize();
            const urlParams = new URLSearchParams(data);

            FormValidation.utils.fetch(e.formValidation.form.action, {
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
});
