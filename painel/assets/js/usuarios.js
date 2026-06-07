"use strict";
$(function () {
    let t, a, n;

    const l = {
        ativo: {title: "Ativo", class: "bg-label-success"},
        inativo: {title: "Inativo", class: "bg-label-secondary"}
    };

    const buttonEditar = `<button type="button" class="btn btn-icon btn-info">
                                <span class="tf-icons bx bx-message-square-edit"></span>
                            </button>`;

    const buttonRemover = `<button type="button" href="#" class="btn btn-icon btn-danger">
                                    <span class="tf-icons bx bx-trash"></span>
                               </button>`;

    const r = "app-user-view-account.html";

    $('#list-usuario').DataTable({
        processing: true,
        ajax: {
            url: urlServer + "/app/usuarios/lista"
        },
        columns: [
            {data: "id"},
            {data: "nome"},
            {data: "status"},
            {data: "criado_em"},
            {data: "action"}
        ],
        columnDefs: [
            {
                targets: 1,
                responsivePriority: 4,
                render: function (e, t, a, n) {

                    var s = a.nome,
                        o = a.email,
                        l = a.avatar == null ? "" : a.avatar;
                    return '<div class="d-flex justify-content-start align-items-center user-name">' +
                        '<div class="avatar-wrapper">' +
                        '<div class="avatar avatar-sm me-3">' + (l ? '<img src="' + assetsPath + "img/avatars/" + l + '" alt="Avatar" class="rounded-circle">' : '<span class="avatar-initial rounded-circle bg-label-' + ["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())] + '">' + (l = (((l = (s = (`${a.nome} ${a.sobrenome}`)).match(/\b\w/g) || []).shift() || "") + (l.pop() || "")).toUpperCase()) + "</span>") + '</div></div><div class="d-flex flex-column"><a href="' + r + '" class="text-body text-truncate"><span class="fw-semibold">' + s + '</span></a><small class="text-muted">' + o + "</small></div></div>"
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
    }),
        $("#list-usuario tbody").on("click", ".delete-record", function () {
            $('#list-usuario').row($(this).parents("tr")).remove().draw()
        }), setTimeout(() => {
        $(".dataTables_filter .form-control").removeClass("form-control-sm"),
            $(".dataTables_length .form-select").removeClass("form-select-sm")
    }, 300);

}), function () {
    const t = document.getElementById("addNewUserForm");
    var load = $(".ajax_load");

    FormValidation.formValidation(t, {
        fields: {
            nome: {validators: {notEmpty: {message: "Insira o seu primeiro nome"}}},
            sobrenome: {validators: {notEmpty: {message: "Insira o seu segundo nome"}}},
            email: {
                validators: {
                    notEmpty: {message: "insira o seu email"},
                    emailAddress: {message: "O valor não é um endereço de e-mail válido"}
                }
            }
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
        FormValidation.utils.fetch(urlServer + "/app/usuarios/adicionar", {
            method: 'POST',
            params: {
                nome: t.querySelector('[name="nome"]').value,
                email: t.querySelector('[name="email"]').value,
                sobrenome: t.querySelector('[name="sobrenome"]').value,
                status: t.querySelector('[name="status"]').value,
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
}();