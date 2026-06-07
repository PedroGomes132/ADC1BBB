"use strict";
$(function () {
    let t, a, n;

    const l = {
        ativo: {title: "Ativo", class: "bg-label-success"},
        inativo: {title: "Inativo", class: "bg-label-secondary"}
    };

    const role = {
        1: {title: "sim", class: "bg-label-success"},
        2: {title: "não", class: "bg-label-danger"}
    }

    const buttonEditar = `<button type="button" class="btn btn-icon btn-info">
                                <span class="tf-icons bx bx-message-square-edit"></span>
                            </button>`;

    const buttonRemover = `<button type="button" href="#" class="btn btn-icon btn-danger">
                                    <span class="tf-icons bx bx-trash"></span>
                               </button>`;

    const r = "app-user-view-account.html";

    $('#list-telas').DataTable({
        processing: true,
        ajax: {
            url: urlServer + "/configuracao/telas/lista"
        },
        columns: [
            {data: "id"},
            {data: "descricao"},
            {data: "status"},
            {data: "c"},
            {data: "w"},
            {data: "r"},
            {data: "action"}
        ],
        columnDefs: [
            {
                targets: 1,
                responsivePriority: 4,
                render: function (e, t, a, n) {

                    var s = a.descricao,
                        o = a.criado_em,
                        l = a.avatar == null ? "" : a.avatar;

                    return '<div class="d-flex justify-content-start align-items-center user-name">' +
                        '<div class="avatar-wrapper">' +
                        '<div class="avatar avatar-sm me-3">' + (l ? '<img src="' + assetsPath + "img/avatars/" + l + '" alt="Avatar" class="rounded-circle">' : '<span class="avatar-initial rounded-circle bg-label-' + ["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())] + '">' + (l = (((l = (s = (`${a.descricao}`)).match(/\b\w/g) || []).shift() || "") + (l.pop() || "")).toUpperCase()) + "</span>") + '</div></div><div class="d-flex flex-column"><a href="' + r + '" class="text-body text-truncate"><span class="fw-semibold">' + s + '</span></a><small class="text-muted">' + o + "</small></div></div>"
                }
            },
            {
                targets: 2,
                render: function (e, t, a, n) {
                    a = a.status;
                    return '<span class="badge ' + l[a].class + '">' + l[a].title + '</span>'
                }
            },
            {
                targets: 3,
                render: function (e, t, a, n) {
                    a = a.c;
                    return '<span class="badge ' + role[a].class + '">' + role[a].title + '</span>'
                }
            },{
                targets: 4,
                render: function (e, t, a, n) {
                    a = a.w;
                    return '<span class="badge ' + role[a].class + '">' + role[a].title + '</span>'
                }
            },{
                targets: 5,
                render: function (e, t, a, n) {
                    a = a.r;
                    return '<span class="badge ' + role[a].class + '">' + role[a].title + '</span>'
                }
            },
            {
                targets: -1,
                title: "Actions",
                searchable: !1,
                orderable: !1,
                render: function (e, t, a, n) {
                    return '<div class="text-nowrap">' + buttonEditar + ' ' + buttonRemover + '</div>'
                }
            }
        ],
        language: {sLengthMenu: "_MENU_", search: "", searchPlaceholder: "Busca Usuario.."},
    })
}), function() {
    const t = document.getElementById("addRoleForm");
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
    }).on('core.form.valid', function () {
        // Send data to back-end
        FormValidation.utils.fetch(urlServer + "/configuracao/telas/adicionar", {
            method: 'POST',
            params: {
                descricao: t.querySelector('[name="descricao"]').value,
                c: t.querySelector('[name="c"]').value,
                r: t.querySelector('[name="r"]').value,
                w: t.querySelector('[name="w"]').value,
                mostrar_para_todos: t.querySelector('[name="mostrar_para_todos"]').value,
                action: t.querySelector('[name="action"]').value,
            }
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
