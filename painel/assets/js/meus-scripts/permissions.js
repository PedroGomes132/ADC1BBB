"use strict";
$(function () {
    let t, a, n;

    const l = {
        ativo: {title: "Ativo", class: "bg-label-success"},
        inativo: {title: "Inativo", class: "bg-label-secondary"}
    };

    const r = "app-user-view-account.html";

    $('#list-permissoes').DataTable({
        processing: true,
        ajax: {
            url: urlServer + "/configuracao/permissoes/lista"
        },
        columns: [
            {data: "id"},
            {data: "descricao"},
            {data: "status"},
            {data: "action"}
        ],
        columnDefs: [
            {
                targets: 1,
                responsivePriority: 4,
                render: function (e, t, a, n) {

                    let s = a.descricao;
                    let o = a.criado_em;
                    let avatar = "";

                    let color_random = ["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())];
                    let avatar_word = (avatar = (((avatar = (s = (`${a.descricao}`)).match(/\b\w/g) || []).shift() || "") + (avatar.pop() || "")).toUpperCase())
                    let avatar_img =  `<span class="avatar-initial rounded-circle bg-label-${color_random}">${avatar_word}</span>`;

                    let html = `
                        <div class="d-flex justify-content-start align-items-center user-name">
                            <div class="avatar-wrapper">
                                <div class="avatar avatar-sm me-3">
                                    ${avatar_img}
                                </div>
                            </div>
                            <div class="d-flex flex-column">
                                <a href="${urlServer}/configuracao/permissoes/editar/${a.id}" class="text-body text-truncate"><span class="fw-semibold">${s}</span></a>
                                <small class="text-muted">${o}</small>
                            </div>
                        </div>`

                    return html;
                }
            },
            {
                targets: 2,
                render: function (e, t, a, n) {
                    a = a.status;
                    return `<span class="badge ${l[a].class}">${l[a].title}</span>`;
                }
            },
            {
                targets: -1,
                title: "Actions",
                searchable: !1,
                orderable: !1,
                render: function (e, t, a, n) {
                    let buttonEditar = `<a href="${urlServer}/configuracao/permissoes/editar/${a.id}" type="button" class="btn btn-icon btn-info">
                                            <span class="tf-icons bx bx-message-square-edit"></span>
                                        </a>`;

                    let buttonRemover = `<button onclick="remove(this)" data-id="${a.id}" data-action="deleta" data-url-action="${urlServer}/configuracao/permissoes/deletar" type="button" href="#" class="btn btn-icon btn-danger">
                                            <span class="tf-icons bx bx-trash"></span>
                                         </button>`;


                    return '<div class="text-nowrap">' + buttonEditar + ' ' + buttonRemover + '</div>'
                }
            }
        ],
        language: {sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Busca Permissão.."},
    })
}), function () {

    const t = document.querySelector("form");

    FormValidation.formValidation(t, {
        fields: {
            descricao: {
                validators: {
                    notEmpty: {message: "Informe o nome da tela para criar as permissões"}
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger,
            bootstrap5: new FormValidation.plugins.Bootstrap5({eleValidClass: "", rowSelector: ".col-12"}),
            submitButton: new FormValidation.plugins.SubmitButton,
            autoFocus: new FormValidation.plugins.AutoFocus
        }
    }).on('core.form.valid', function (e) {
        // Send data to back-end

        let data = $("#addRoleForm").serialize();
        const urlParams = new URLSearchParams(data);
        FormValidation.utils.fetch(urlServer + "/configuracao/permissoes/action", {
            method: 'POST',
            params: paramsToObject(urlParams.entries()),
        }).then((response) => {
            if (response.type) {
                swalView("top-start", response.type, response.message);

                if (response.reload) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500)
                }

            }

        });
    });

    const s = document.querySelector("#selectAll"), o = document.querySelectorAll('[type="checkbox"]');

    s.addEventListener("change", t => {
        o.forEach(e => {
            e.checked = t.target.checked
        })
    })
}();

function remove(e){
    console.log(e)
}
