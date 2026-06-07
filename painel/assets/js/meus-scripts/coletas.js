"use strict";
$(function () {

    dataTableView(urlServer + "/coletas/listar", numStart, numPage, "Coletas")
    //dataTableView(urlServer + "/faturas/lista", numStart, numPage, "Fatura");

    InicializarCamposForm();

    jQuery('#cmbCamposDisponiveis').multiSelect({
        keepOrder: true,
        showFinishButtonAlways: true,
        selectableHeader: "<input type='text' class='form-control mb-3' autocomplete='off' placeholder='Procurar Cliente'>",
        selectionHeader: "<input type='text' class='form-control mb-3' autocomplete='off' placeholder='Procurar Cliente'>",
        selectableFooter: `<button class='mt-3 btn btn-label-primary' id='select-all'>
                <span class='tf-icons bx bx-select-multiple me-1'></span> Selecionar Todos
            </button>`,
        selectionFooter: `<button class='mt-3 btn btn-label-danger' id='deselect-all'>
                <span class='tf-icons bx bx-window-close solid me-1'></span> Desmarcar Todos
            </button>`,
        cssClass: "col-xl-6 mt-1",
        afterInit: function (ms) {
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString).on('keydown', function (e) {
                if (e.which === 40) {
                    that.$selectableUl.focus();
                    return false;
                }
            });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString).on('keydown', function (e) {
                if (e.which == 40) {
                    that.$selectionUl.focus();
                    return false;
                }
            });
        },
        afterSelect: function (e) {
            this.qs1.cache();
            this.qs2.cache();
            TmpCamposOcultos.push(e[0]);
        },
        afterDeselect: function (e) {
            this.qs1.cache();
            this.qs2.cache();
            var tmparr = [];
            for (var i = 0; i < TmpCamposOcultos.length; i++) {
                if (TmpCamposOcultos[i] !== e[0]) {
                    tmparr.push(TmpCamposOcultos[i]);
                }
            }
            TmpCamposOcultos = tmparr;
        }
    });

    jQuery('#select-all').click(function () {
        $('#cmbCamposDisponiveis').multiSelect('deselect_all');
        $('#cmbCamposDisponiveis').multiSelect('select_all');
        TmpCamposOcultos = ["StsSel", "IdxUni", "StsReg"];
        jQuery('#cmbCamposDisponiveis option:selected').each(function () {
            TmpCamposOcultos.push($(this).val());
        });
        return false;
    });

    //se clicar em limpar ----------------------------------------------------------------------------------------------
    jQuery('#deselect-all').click(function () {
        $('#cmbCamposDisponiveis').multiSelect('deselect_all');
        TmpCamposOcultos = [];
        return false;
    });

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

    t && FormValidation.formValidation(t, {
        fields: {
            agente: { validators: { notEmpty: { message: "Informe o nome do agente" } } },
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger,
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: "",
                rowSelector: function (e, t) {
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

        let data = $("#atribuitForm").serialize();
        const urlParams = new URLSearchParams(data);

        const allRules = Object.assign({}, paramsToObject(urlParams.entries()), { clients: TmpCamposOcultos });
        FormValidation.utils.fetch(urlServer + "/coletas/action", {
            method: 'POST',
            params: allRules,
        })
            .then((data) => {

                $(".ajax_load").fadeOut(200);
                if (data.type) {
                    swalView("top-start", data.type, `${data.message} <br> ${data?.error}`, 10000);
                    if (data.reload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 5000)
                    }
                }

            })
            .catch((error) => {
                $(".ajax_load").fadeOut(200);
                console.error('Error:', error);
            });
    });
}();

function InicializarCamposForm() {
    window.TmpCamposOcultos = [];
}

/* ROTA PRE DEFINIDA */
function predefinidos(id) {

    $(".ajax_load")
        .fadeIn(200)
        .css("display", "flex")
        .find(".ajax_load_box_title")
        .text("Aguarde, enviando dados para o servido de processamento...");

    function setAgenteModal(data) {
        const linha = document.createElement('tr');
        const nomeAgente = document.createElement('td');
        const inputCheckBox = document.createElement('td');
        const botoes = document.createElement('td');
        const buttonExcluir = document.createElement('button');
        const spanMain = document.createElement('span');
        const spanBotaoIcon = document.createElement('span');
        const inputCheckbox = document.createElement('input');

        nomeAgente.textContent = data.nome;
        inputCheckbox.value = data.id;

        spanMain.classList.add("text-nowrapd-flex");
        spanMain.classList.add("justify-content-between");
        spanMain.classList.add("align-items-center");
        spanMain.classList.add("float-end");

        //botão
        buttonExcluir.setAttribute('type', 'button');
        buttonExcluir.classList.add("btn");
        buttonExcluir.classList.add("btn-sm");
        buttonExcluir.classList.add("btn-icon");
        buttonExcluir.classList.add("btn-danger");
        //icon botao span
        spanBotaoIcon.classList.add("tf-icons");
        spanBotaoIcon.classList.add("bx");
        spanBotaoIcon.classList.add("bx-trash");

        buttonExcluir.append(spanBotaoIcon);
        spanMain.append(buttonExcluir);

        inputCheckbox.classList.add('form-check-input');
        inputCheckbox.setAttribute('type', 'checkbox');
        inputCheckbox.setAttribute('name', 'clientes');
        inputCheckbox.setAttribute('id', 'defaultCheck2');
        inputCheckBox.append(inputCheckbox);

        botoes.append(spanMain);

        linha.classList.add("clientes-row");
        linha.append(inputCheckBox, nomeAgente, botoes);
        document.querySelector(".clientes-row-rota-predefinida table tbody").append(linha);

        const s = document.querySelector("#selectAll"), o = document.querySelectorAll('[type="checkbox"]');
        if (s) {
            s.addEventListener("change", t => {
                o.forEach(e => {
                    e.checked = t.target.checked
                })
            });
        }
    }

    function setModal() {
        const modal = document.querySelector("body");
        modal?.insertAdjacentHTML('afterbegin', `
            <div class="modal fade" id="largeModal" tabindex="-1" aria-hidden="true">
                <form class="modal-dialog modal-lg" action="#" role="document" id="rpre">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel3">Rota Pre-Definido</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body clientes-row-rota-predefinida">
                            <div class="table-responsive text-nowrap">
                                <table class="table">
                                    <thead class="table-light">
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="selectAll"/>
                                            </div>
                                        </td>
                                        <th>Cliente</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    </thead>
                                    <tbody class="table-border-bottom-0"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="submit" class="btn btn-primary">Atribuir</button>
                        </div>
                    </div>
                </form>
            </div>  
        `);

        const t = document.getElementById("rpre");
        FormValidation.formValidation(t, {
            fields: {
                agente: { validators: { notEmpty: { message: "Informe o nome do agente" } } },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger,
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: "",
                    rowSelector: function (e, t) {
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

            let data = $("#atribuitForm").serialize();
            const urlParams = new URLSearchParams(data);

            const clientes = document.querySelectorAll("[name='clientes']:checked");
            const clienteValues = [];

            for (let i = 0; i < clientes.length; i++) {
                clienteValues.push(clientes[i].value);
            }

            const allRules = Object.assign({}, paramsToObject(urlParams.entries()), { clients: clienteValues });
            FormValidation.utils.fetch(urlServer + "/coletas/action", {
                method: 'POST',
                params: allRules,
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
    }

    fetch(assetsPath + "json/coletas-predefinido.json", { method: 'GET' }).then(response => response.json()).then((data) => {

        setModal();
        $(".ajax_load").fadeOut(200);

        if (data.type) {
            swalView("top-start", data.type, data.message);
        }

        const d = document.querySelector("#predefinidos");

        const djson = data.coletas;
        for (let i = 0; i < djson.length; i++) {
            if (djson[i].agente.toString() === id) {
                d.innerHTML = `<div class='row d-flex justify-content-between align-items-center'>
                    <div class='form-text col-md-6'>Esse agente tem uma rota ja definida anteriormente.... </div>
                    <div class='col-md-6' ><a href="#" class='btn btn-label-primary float-end' data-bs-toggle='modal' data-bs-target='#largeModal'>Abrir Rota</a></div>
                </div>`

                djson[i].clientes.forEach(cliente => setAgenteModal(cliente))
            }
        }
    }).catch((error) => {
        $(".ajax_load").fadeOut(200);
        console.error('Error:', error);
    });

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

function remove(e) {
    console.log(e)
}

function listaClienteColetaFixa(event) {
    var idAgente = event.dataset.idAgente;
    var nomeAgente = event.dataset.nomeAgente;
    dataTableView(urlServer + "/coletas/listar/cliente-coleta-fixas/" + idAgente, numStart, numPage, "cliente-coleta-fixas", "table-result-fixa-clientes");

    $('.modal-title').text(`${nomeAgente} - Lista de Clientes`);
    $("#modal-cliente-coleta-fixas").modal("show");
}

function baixaColeta(event) {
    var idColeta = event.dataset.idColeta;
    dataTableView(
        urlServer + "coletas/modal/baixa/" + idColeta,
        numStart,
        numPage,
        "cliente-coleta-fixas",
        "view-result",
        "modal-baixa-coleta"
    );
}

/* update 2023-01-27 */
