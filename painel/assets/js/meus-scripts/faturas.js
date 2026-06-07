"use strict";
$(function () {
    dataTableView(urlServer + "/faturas/lista", numStart, numPage, "Fatura");

    $('[data-typeahead]').keyup(function (event) {

        $('[data-typeahead]').on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            source: function (request, response) {
                $.getJSON(urlServer + '/autocomplete/agente', {
                    term: extractLast(request.term)
                }, response);
            },
            search: function () {
                var term = extractLast(this.value);
                if (term.length < 2) {
                    return false;
                }
            },
            focus: function (event, ui) {
                return false;
            },
            select: function (event, ui) {
                var terms = split(this.value);
                terms.pop();
                terms.push(ui.item.value);
                predefinidos(ui.item.id)
                $("input[name=" + $(this).data("id") + "]").val(ui.item.id);
            }
        });
    });

    $('[data-aplicar]').click(function (event) {
        event.preventDefault();
        let form = $("#aplicar-desconto");

        form.ajaxSubmit({
            type: "POST",
            url: form.attr("action"),
            dataType: 'JSON',
            beforeSend: function () {
                $(".ajax_load")
                    .fadeIn(200)
                    .css("display", "flex")
                    .find(".ajax_load_box_title")
                    .text("Aguarde, Carregando dados de Usuarios...");
            },
            success: function (data) {
                $(".ajax_load").fadeOut(200);

                if (data.type) {
                    swalView("top-start", data.type, data.message);

                    if (data.reload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }
                }
            },
            error: function (e) {
                $(".ajax_load").fadeOut(200);
                swalView("top-start", 'error', e.responseJSON.message);
            }
        });
    });

}), function () {
    const t = document.getElementById("atribuitForm");

}();

function InicializarCamposForm() {
    window.TmpCamposOcultos = [];
}

function enter(selector) {
    //console.log(selector.data())
    shortcut.add("Enter", function (e) {
        if (e.target.value !== undefined) {
            e.preventDefault();
            console.log(e.target.dataset, e.target.value)
        }
    });
}

function enviarEmail(event) {
    var form = $("#enviar-email");
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
                url: form.attr("action"),
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                traditional: true,
                timeout: 10000,
                async: true,
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

function atualizarProgressBar(porcentagem) {
    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.width = porcentagem + "%";
    progressBar.setAttribute("aria-valuenow", porcentagem);
    progressBar.innerText = porcentagem + "%";
}

function setEvent(urlEvent) {
    const eventSource = new EventSource(urlEvent);
    console.log(eventSource);

    eventSource.onmessage = function (event) {
        console.log(event);
        atualizarProgressBar(event.porcentagem)
    };
}

/* update 2023-01-27 */
