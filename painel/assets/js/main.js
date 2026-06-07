/**
 * Main
 */

'use strict';

let menu, animate;
var numPage = 25;
var numStart = 1;

(function () {

    // Initialize menu
    //-----------------

    let layoutMenuEl = document.querySelectorAll('#layout-menu');
    layoutMenuEl.forEach(function (element) {
        menu = new Menu(element, {
            orientation: 'vertical',
            closeChildren: false
        });
        // Change parameter to true if you want scroll animation
        window.Helpers.scrollToActive((animate = false));
        window.Helpers.mainMenu = menu;
    });

    // Initialize menu togglers and bind click on each
    let menuToggler = document.querySelectorAll('.layout-menu-toggle');
    menuToggler.forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            window.Helpers.toggleCollapsed();
        });
    });

    // Display menu toggle (layout-menu-toggle) on hover with delay
    let delay = function (elem, callback) {
        let timeout = null;
        elem.onmouseenter = function () {
            // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
            if (!Helpers.isSmallScreen()) {
                timeout = setTimeout(callback, 300);
            } else {
                timeout = setTimeout(callback, 0);
            }
        };

        elem.onmouseleave = function () {
            // Clear any timers set to timeout
            document.querySelector('.layout-menu-toggle').classList.remove('d-block');
            clearTimeout(timeout);
        };
    };
    if (document.getElementById('layout-menu')) {
        delay(document.getElementById('layout-menu'), function () {
            // not for small screen
            if (!Helpers.isSmallScreen()) {
                document.querySelector('.layout-menu-toggle').classList.add('d-block');
            }
        });
    }

    // Display in main menu when menu scrolls
    let menuInnerContainer = document.getElementsByClassName('menu-inner'),
        menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
    if (menuInnerContainer.length > 0 && menuInnerShadow) {
        menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
            if (this.querySelector('.ps__thumb-y').offsetTop) {
                menuInnerShadow.style.display = 'block';
            } else {
                menuInnerShadow.style.display = 'none';
            }
        });
    }

    // Init helpers & misc
    // --------------------

    // Init BS Tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Accordion active class
    const accordionActiveFunction = function (e) {
        if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
            e.target.closest('.accordion-item').classList.add('active');
        } else {
            e.target.closest('.accordion-item').classList.remove('active');
        }
    };

    const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
    const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
        accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
        accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
    });

    // Auto update layout based on screen size
    window.Helpers.setAutoUpdate(true);

    // Toggle Password Visibility
    window.Helpers.initPasswordToggle();

    // Speech To Text
    window.Helpers.initSpeechToText();

    // Manage menu expanded/collapsed with templateCustomizer & local storage
    //------------------------------------------------------------------

    // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
    if (window.Helpers.isSmallScreen()) {
        return;
    }

    // If current layout is vertical and current window screen is > small

    // Auto update menu collapsed/expanded based on the themeConfig
    window.Helpers.setCollapsed(true, false);

    $(".alert").delay(8000).slideUp(4000, function () {
        $(this).alert('close');
    });

})();


document.addEventListener("DOMContentLoaded", function (e) {



    /* $('[data-action]').click(function (event) {
        event.preventDefault();
        let form = $(this);

        let load = $(".ajax_load");
        let data = form.data();

        $.ajax({
            url: data.url,
            type: "POST",
            data: data,
            dataType: "json",
            beforeSend: function () {
                $(".ajax_load")
                    .fadeIn(200)
                    .css("display", "flex")
                    .find(".ajax_load_box_title")
                    .text("Aguarde, enviando dados para o servido de processamento...");
            },
            success: function (response) {

                Swal.fire({
                    position: "top-end",
                    icon: response.type,
                    text: response.message,
                    timer: 1500,
                    customClass: { confirmButton: "btn btn-primary" }
                });

                //reload
                if (response.reload) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }

                load.fadeOut(200);
            },
            complete: function () {
                if (form.data("reset") === true) {
                    form.trigger("reset");
                }
            },
            error: function (e) {
                console.log(e);
                Swal.fire({
                    position: "top-end",
                    icon: 'error',
                    title: 'Desculpe mas não foi possível processar a requisição. Favor tente novamente!',
                    timer: 1500,
                    customClass: { confirmButton: "btn btn-primary" }
                });
                load.fadeOut(200);
            }
        });
    }); */

    $("form:not('.ajax_off')").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var load = $(".ajax_load");

        var data = form.data();

        form.ajaxSubmit({
            url: form.attr("action"),
            type: "POST",
            dataType: "json",
            beforeSend: function () {
                $(".ajax_load")
                    .fadeIn(200)
                    .css("display", "flex")
                    .find(".ajax_load_box_title")
                    .text("Aguarde, enviando dados para o servido de processamento...");
            },
            success: function (response) {

                if (response.redirect) {
                    setTimeout(function () {
                        window.location.href = response.redirect;
                    }, 1500)
                } else {
                    load.fadeOut(200);
                }

                if (response.view_pdf) {
                    let pdfWindow = window.open("")
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(response.view_pdf) + "'></iframe>")
                }

                Swal.fire({
                    icon: response.type,
                    text: response.message,
                    timer: 1500,
                    customClass: { confirmButton: "btn btn-primary" }
                });

                //reload
                if (response.reload) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }

                if (response.tableHtml) {
                    $('#table-result').html(response.tableHtml);
                }

                load.fadeOut(200);
            },
            complete: function () {
                if (form.data("reset") === true) {
                    form.trigger("reset");
                }
            },
            error: function (e) {
                $('#table-result').html("");
                load.fadeOut(200);
                Swal.fire({
                    icon: 'error',
                    text: e.responseJSON.message,
                    customClass: { confirmButton: "btn btn-primary" }
                });


            }
        });
    });

    const x = document.querySelector("#ajax-action");
    $("[data-type-action]").click(function (e) {
        e.preventDefault();

        const data = $(this).data();
        const typeAction = (data.typeAction == 'ativo' ? '<b>ativa</b>' : '<b>bloquear</b>');
        const url = data.urlAction;

        Swal.fire({
            title: "Tem certeza?",
            html: "Você deseja realmente " + typeAction + ' este lote!',
            icon: "warning",
            showCancelButton: !0,
            confirmButtonText: "Sim, " + typeAction + "!",
            customClass: {
                confirmButton: "btn btn-primary me-3",
                cancelButton: "btn btn-label-secondary"
            },
            buttonsStyling: !1,
        }).then(function (t) {
            console.log(t);
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: "json",
                beforeSend: function () {
                    $(".ajax_load")
                        .fadeIn(200)
                        .css("display", "flex")
                        .find(".ajax_load_box_title")
                        .text('Aguarde, processando dados...');
                },
                success: function (response) {

                    Swal.fire({
                        position: "top-end",
                        icon: response.type,
                        text: response.message,
                        timer: 1500,
                        customClass: { confirmButton: "btn btn-primary" }
                    });

                    //reload
                    if (response.reload) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500)
                    }

                    load.fadeOut(200);
                },
                error: function () {
                    toast('error', 'Ops, algo de errado aconteceu ao execulta dados.');
                    load.fadeOut();
                }
            });
            return false;

            // t.value ?
            //     Swal.fire({ icon: "success", title: "Deleted!", text: "Your file has been deleted.", customClass: { confirmButton: "btn btn-success" } }) :
            //     t.dismiss === Swal.DismissReason.cancel && Swal.fire({ title: "Cancelled", text: "Your imaginary file is safe :)", icon: "error", customClass: { confirmButton: "btn btn-success" } });
        });
    });

    if (document.querySelector('#cep')) {
        const cep = document.querySelector('#cep');
        cep.addEventListener("blur", (e) => {
            let cepValue = cep.value.replace(/\D/g, "");
            if (cepValue) {
                const validacep = /^[0-9]{8}$/;
                if (validacep.test(cepValue)) {
                    fetch(`https://viacep.com.br/ws/${cepValue}/json/`, { method: 'GET', mode: 'cors', cache: 'default' })
                        .then(response => response.json())
                        .then(data => showDataCep(data));
                } else {
                    swalView('top-end', 'error', `O Cep ${cepValue} informado não é valido!`);
                    cep.value = '';
                }
            }
        });
        new Cleave(cep, {
            blocks: [5, 3],
            delimiters: ['-']
        });
    }

    const showDataCep = (data) => {
        for (const item in data) {
            if (document.querySelector('#' + item)) {
                document.querySelector('#' + item).value = data[item];
                document.getElementById('numero').focus();
            }
        }
    };


    const telefone = document.querySelector('#telefone');
    telefone && new Cleave(telefone, {
        blocks: [0, 2, 0, 5, 4],
        delimiters: ['(', ')', ' ', '-'],
        numbericOnly: true
    });

    $('#documento').inputmask({
        mask: ["999.999.999-99", "99.999.999/9999-99"]
    });

    $('[data-typeahead]').keyup(function (event) {
        const data = event.target.dataset;
        $('[data-typeahead]').on("keydown", function (event) {
            if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            source: function (request, response) {
                $.getJSON(urlServer + data.urlAction, {
                    term: extractLast(request.term)
                }, response);
            },
            minLength: 0,
            search: function () {
                var term = extractLast(this.value);
                if (term.length < 1) {
                    return false;
                }
            },
            focus: function (event, ui) {
                return false;
            },
            response: function (event, ui) {
            },
            select: function (event, ui) {
                var terms = split(this.value);
                terms.pop();
                terms.push(ui.item.value);
                $("input[name=" + $(this).data("id") + "]").val(ui.item.id);
            }
        });
    });

    $('[data-price]').maskMoney();


    $('#filter-search').click(function (event) {
        event.preventDefault();

        var load = $(".ajax_load");
        let form = $("#formsearch");

        form.ajaxSubmit({
            type: "POST",
            url: event.target.dataset.urlAction,
            dataType: 'JSON',
            beforeSend: function () {
                $(".ajax_load")
                    .fadeIn(200)
                    .css("display", "flex")
                    .find(".ajax_load_box_title")
                    .text("Aguarde, Carregando dados de Usuarios...");
            },
            success: function (data) {
                $('#table-result').html(data.tableHtml);
                $("#filter").modal('hide')

                form.trigger("reset");
                load.fadeOut(200);
            },
            error: function (e) {
                load.fadeOut(200);
            }
        });
    })
});

function split(val) {
    return val.split(/;\s*/);
}

function extractLast(term) {
    return split(term).pop();
}

function swalView(position = "top-end", icon = "warning", text = "Ops, você fez algo de errado?!", timer = 2500, customClass = { confirmButton: "btn btn-primary" }) {

    const options = {
        position: position,
        icon: icon,
        html: text,
        timer: 1500,
        customClass: customClass
    }

    const alertHtml = document.querySelector("#alert-json");
    alertHtml.innerHTML = `
        <div class="alert alert-warning d-flex  alert-dismissible" role="alert">
            <span class="badge badge-center rounded-pill bg-${icon} border-label-${icon} p-3 me-2"><i class="bx bx-wallet fs-6"></i></span>
            <div class="d-flex flex-column ps-1">
                <h6 class="alert-heading d-flex align-items-center fw-bold mb-1">${icon.toString().toUpperCase()}</h6>
                <span>${text}</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    return Swal.fire(options)
}

function avatars(img, stringName) {
    let color_random = ["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())];
    let avatar_word = (img = (((img = (stringName = (`${stringName}`)).match(/\b\w/g) || []).shift() || "") + (img.pop() || "")).toUpperCase())
    let avatar_img = `<span class="avatar-initial rounded-circle bg-label-${color_random}">${avatar_word}</span>`;
}

function paramsToObject(entries) {
    const result = {}
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

function dataTableView(urlPagina, paginaInicial, quantidadePagina, fornecedor, tableId = "table-result", modal) {

    var data = {
        paginaInicial: paginaInicial,
        quantidadePagina: quantidadePagina,
        urlPagina: urlPagina,
    }

    var load = $(".ajax_load");
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: urlPagina,
            data: data,
            beforeSend: function () {
                $(".ajax_load")
                    .fadeIn(200)
                    .css("display", "flex")
                    .find(".ajax_load_box_title")
                    .text(`Aguarde, Solicitando lista de ${fornecedor}...`);
            },
            success: function (response) {
                $(`#${modal}`).modal("show");
                $('#' + tableId).html(response.tableHtml);
                load.fadeOut(200);
            },
            error: function (e) {
                swalView("top-start", e.responseJSON.type, `${e.responseJSON.message}`, 10000);
                load.fadeOut(200);
            }
        });
        return false;
    });
}

function excluir(event) {
    var load = $(".ajax_load");

    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não será capaz de reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, apague!',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: event.dataset.urlAction,
                data: event.dataset,
                dataType: 'JSON',
                beforeSend: function () {
                    $(".ajax_load")
                        .fadeIn(200)
                        .css("display", "flex")
                        .find(".ajax_load_box_title")
                        .text("Aguarde, Verificando dados de Usuarios...");
                },
                success: function (data) {
                    load.fadeOut(200);

                    if (data.type) {
                        Swal.fire('Deleted!', data.message, 'success');
                        if ($(".modal")) {
                            $(".modal").modal('hide');
                        }
                    }

                    document.getElementById(event.dataset.index).remove();

                    setTimeout(function (e) {
                        load.fadeOut(200);
                        window.location.href = window.location.href;
                    }, 2000);
                },
                error: function (e) {
                    load.fadeOut(200);
                    Swal.fire({
                        position: "top-end",
                        icon: 'error',
                        text: e.responseJSON.message,
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                }
            });

            return false;
        }
    });
}

//abrir um modal padrao do navegado
function abrirModal(URL, w = 600, h = 800) {
    window.open(URL, '_black', 'height=' + h + ', width=' + w + ', left=' + (window.innerWidth - w) / 2 + ', top=' + (window.innerHeight - h) / 2);
}

function isChecked(event) {
    var i = [].slice.call(document.querySelectorAll("#list-item-input"));
    if (i.length > 0) {
        i && i.forEach((e) => {
            let t = 0;

            i.forEach((e) => {
                e.checked && t++;
            })

            if (t > 0) {
                $('#btn-action').removeAttr('disabled');
            } else {
                $('#btn-action').attr('disabled', 'disabled');
            }
        });
    }
}

/* update 2023-01-27 */
