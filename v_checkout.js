var enPhone = true
    , enCPF = true
    , enCPFCheckout = true
    , enCEP = true
    , blockPhone = false
    , blockCEP = false
    , blockCPF = false
    , blockEndereco = false
    , blockNumero = false
    , blockComplemento = false
    , blockBairro = false
    , digitais = false
    , tirarAcentos = false
    , plus55 = false
    , lembraCEP = true;

var listaOK = new Array
    , listaValidar = new Array
    , ajaxcallback = function () { };

var script = document.createElement("script");
script.setAttribute("src", "https://unpkg.com/imask"),
    document.body.appendChild(script);

var script3 = document.createElement("script");
script3.setAttribute("src", "https://code.jquery.com/jquery-3.4.1.min.js"),
    document.body.appendChild(script3);


var script3 = document.createElement("script");
script3.setAttribute("src", "https://cdn.jsdelivr.net/npm/jquery-validation@1.19.1/dist/jquery.validate.min.js"),
    document.body.appendChild(script3);


function initMask(e, t, n, i) {
    var r = document.getElementById(e);
    if (!r || "undefined" == typeof IMask)
        return listaOK[e] = !0,
            setTimeout(function () {
                initMask(e, t, n, i)
            }, 1e3);
    listaOK[e] = !1,
        listaValidar[e] = n,
        r.removeAttribute("data-phone-formatter");
    r.parentNode;
    var o = document.querySelector('button[data-trekkie-id="continue_to_shipping_method_button"]') || document.querySelector('button[data-trekkie-id="continue_to_payment_method_button"]') || document.querySelector('button[data-trekkie-id="complete_order_button"]') || document.querySelector('button[trekkie_id="continue_to_payment_method_button"]') || document.querySelector('button[trekkie_id="complete_order_button"]') || document.querySelector('button[trekkie_id="continue_to_shipping_method_button"]');
    function a(n) {
        "function" == typeof i && i(n),
            r.disabled ? listaOK[e] = !0 : !new RegExp("[\\(\\)0-9\\s/.+-]{" + t.length + "}").test(n) || void 0 !== i && !i(n) || r.erro ? (listaOK[e] = !1,
                setInputError(r)) : (listaOK[e] = !0,
                    setInputSuccess(r),
                    ajaxcallback = function () {
                        a(n)
                    }
                );
        var s = !0;
        for (var l in listaOK)
            0 == listaOK[l] && listaValidar[l] && (s = !1);
        return s ? o.removeAttribute("disabled") : o.setAttribute("disabled", "disabled"),
            !0
    }
    o && (o.form.onsubmit = function () {
        if (tirarAcentos) {
            var e = ["checkout_billing_address_first_name", "checkout_billing_address_last_name", "checkout_billing_address_city", "checkout_billing_address_address1", "checkout_billing_address_address2", "checkout_shipping_address_first_name", "checkout_shipping_address_last_name", "checkout_shipping_address_city", "checkout_shipping_address_address1", "checkout_shipping_address_address2"];
            for (var t in e) {
                (n = document.getElementById(e[t])) && (n.value = removerAcentos(n.value))
            }
        }
        if (enCPF)
            for (var t in e = ["checkout_shipping_address_company", "checkout_billing_address_company"]) {
                var n;
                (n = document.getElementById(e[t])) && (n.value = n.value.replace(/[.-]/g, ""))
            }
    }
    ),
        r.addEventListener("keyup", function (e) {
            8 !== e.keyCode && 46 !== e.keyCode || a(r.masked.value)
        }),
        r.masked = new IMask(r, {
            mask: t,
            validate: a
        })
}


function validarCPF(e) {
    var t, n, i;
    if ("" == (e = e.replace(/[^\d]+/g, "")) || 11 != e.length || "00000000000" == e || "11111111111" == e || "22222222222" == e || "33333333333" == e || "44444444444" == e || "55555555555" == e || "66666666666" == e || "77777777777" == e || "88888888888" == e || "99999999999" == e)
        return !1;
    for (t = i = 0; 9 > t; t++)
        i += parseInt(e.charAt(t)) * (10 - t);
    if (10 != (n = 11 - i % 11) && 11 != n || (n = 0),
        n != parseInt(e.charAt(9)))
        return !1;
    for (t = i = 0; 10 > t; t++)
        i += parseInt(e.charAt(t)) * (11 - t);
    return 10 != (n = 11 - i % 11) && 11 != n || (n = 0),
        n == parseInt(e.charAt(10))
}

function setInputError(e) {
    var t = e.parentNode.classList;
    t.contains("success") && t.remove("success"),
        t.add("error")
}
function setInputSuccess(e) {
    var t = e.parentNode.classList;
    t.contains("error") && t.remove("error"),
        t.add("success")
}
function clearInputStatus(e) {
    var t = e.parentNode.classList;
    t.contains("error") && t.remove("error"),
        t.contains("success") && t.remove("success")
}

function removerAcentos(e) {
    var t = String(e)
        , n = {
            a: /[\xE0-\xE6]/g,
            A: /[\xC0-\xC6]/g,
            e: /[\xE8-\xEB]/g,
            E: /[\xC8-\xCB]/g,
            i: /[\xEC-\xEF]/g,
            I: /[\xCC-\xCF]/g,
            o: /[\xF2-\xF6]/g,
            O: /[\xD2-\xD6]/g,
            u: /[\xF9-\xFC]/g,
            U: /[\xD9-\xDC]/g,
            c: /\xE7/g,
            C: /\xC7/g,
            n: /\xF1/g,
            N: /\xD1/g
        };
    for (var i in n) {
        var r = n[i];
        t = t.replace(r, i)
    }
    return t
}

function getCep(e, t, n, i, y) {
    var r = document.createElement("span");
    r.classList.add("loading"),
        e.insertAdjacentElement("afterend", r),
        jQuery.ajax({
            type: "GET",
            url: "https://viacep.com.br/ws/" + e.value + "/json",
            dataType: "json",
            success: function (o) {
                r.remove(),
                    1 == o.erro ? (setInputError(e),
                        e.erro = !0,
                        ajaxcallback()) : (e.erro = !1,
                            setInputSuccess(e),
                            ajaxcallback(),
                            n.value = o.localidade,
                            i.value = o.uf,
                            t.value = o.logradouro,
                            "" != o.bairro && (y.value = o.bairro))
            },
            error: function () {
                e.erro = !0,
                    setInputError(e),
                    r.remove()
            }
        })
}
function getdesconto() {
    var e = "";
    try {
        e = document.querySelector(".order-summary__section--discount .tags-list").outerText
    } catch (t) {
        e = null
    }
    return e
}
function getpais() {
    var e = "";
    try {
        e = fieldCountry.value
    } catch (t) {
        e = null
    }
    return e
}

function verificar() {
    var e = getdesconto()
        , t = getpais();
    e == desconto && t == pais || (clearInterval(contador),
        setTimeout(function () {
            (document.querySelector(".section--shipping-address") || digitais && document.querySelector(".section--billing-address")) && construirPGshipping(),
                desconto = getdesconto(),
                pais = getpais(),
                contador = setInterval(verificar, 1e3)
        }, 100))
}

function construirPGshipping() {
    if (novoElemento.classList = "",
        novoElemento.innerHTML = "",
        "Brazil" != (fieldCountry = document.querySelector("#checkout_shipping_address_country") || (digitais ? document.querySelector("#checkout_billing_address_country") : null)).value) {
        var e = ["checkout_shipping_address_phone", "checkout_shipping_address_company", "checkout_shipping_address_zip", "checkout_billing_address_phone", "checkout_billing_address_company", "checkout_billing_address_zip", "titular_doc"];
        for (var t in e)
            try {
                var n = document.getElementById(e[t]);
                n.masked.destroy(),
                    clearInputStatus(n)
            } catch (e) {
                console.log(e)
            }
    } else {
        var i;
        i = plus55 ? "+55 (00) 00000-0000" : "(00) 00000-0000",
            enPhone && (initMask("checkout_shipping_address_phone", i, blockPhone),
                digitais && initMask("checkout_billing_address_phone", i, blockPhone)),
            enCPF && (initMask("checkout_shipping_address_company", "000.000.000-00", blockCPF, validarCPF),
                digitais && initMask("checkout_billing_address_company", "000.000.000-00", blockCPF, validarCPF)),
            enCEP && (initMask("checkout_shipping_address_zip", "00000-000", blockCEP),
                digitais && initMask("checkout_billing_address_zip", "00000-000", blockCEP)),
            novoElemento.classList.add("field", "field--half", "find-zip-container"),
            novoElemento.innerHTML = '<div class="field__input-wrapper">' + (lembraCEP ? '<a href="http://www.buscacep.correios.com.br/sistemas/buscacep/" target="_blank" class="checkout-zip-link" style="display: inline-block;padding: 15px 0;color:#000;text-decoration: underline;">Não lembra seu CEP?</a>' : "") + "</div>";
        var r = document.querySelector('[data-address-field="country"]')
            , o = document.querySelector('[data-address-field="province"]')
            , a = document.querySelector('[data-address-field="zip"]')
            , s = document.querySelector('[data-address-field="address1"]')
            , l = document.querySelector("#checkout_shipping_address_address1") || (digitais ? document.querySelector("#checkout_billing_address_address1") : null)
            , u = document.querySelector("#checkout_shipping_address_zip") || (digitais ? document.querySelector("#checkout_billing_address_zip") : null)
            , c = document.querySelector("#checkout_shipping_address_city") || (digitais ? document.querySelector("#checkout_billing_address_city") : null)
            , y = document.querySelector("#checkout_shipping_neighborhood") || (digitais ? document.querySelector("#checkout_shipping_neighborhood") : null)
            , d = document.querySelector("#checkout_shipping_address_province") || (digitais ? document.querySelector("#checkout_billing_address_province") : null);
        s.insertAdjacentElement("beforebegin", a),
            s.insertAdjacentElement("beforebegin", novoElemento),
            a.classList.add("field--half"),
            r.classList.add("field--half"),
            o.classList.add("field--half"),
            u.addEventListener("input", function (e) {
                0 == e.target.value.length ? (clearInputStatus(e.target),
                    e.target.erro = !1) : 9 == e.target.value.length && getCep(e.target, l, c, d, y)
            }, !1),
            u.addEventListener("blur", function (e) {
                e.target.value.length < 9 && setInputError(e.target)
            }, !1)
    }
}

document.addEventListener('readystatechange', function() {
    var mainBairro = jQuery('<div data-address-field="neighborhood" class="field field--half field--required"></div>')
    var wrapperBairro = jQuery('<div class="field__input-wrapper"></div>')
    var labelBairro = jQuery('<label class="field__label field__label--visible" for="checkout_shipping_neighborhood">Bairro</label>')
    var inputBairro = jQuery('<input placeholder="Bairro" autocomplete="neighborhood" data-backup="checkout_shipping_neighborhood" class="field__input" aria-required="true" size="50" type="text" value="" name="checkout[shipping_address][checkout_shipping_neighborhood]" id="checkout_shipping_neighborhood" maxlength="50">')
    jQuery(wrapperBairro).append(labelBairro)
    jQuery(wrapperBairro).append(inputBairro)
    jQuery(mainBairro).append(wrapperBairro)
    jQuery('[data-address-field="address1"]').after(mainBairro)
    var validateBairro = jQuery('<p class="field__message field__message--error" id="error-for-bairro">Por favor, insira um bairro válido</p>')
    jQuery(mainBairro).after(validateBairro)



    var mainNumber = jQuery('<div data-address-field="number" class="field field--required field--half"></div>')
    var wrapperNumber = jQuery('<div class="field__input-wrapper" style="display:inline-block;float:right;"></div>')
    var labelNumber = jQuery('<label class="field__label field__label--visible" for="address_number">nº</label>')
    var inputNumber = jQuery('<input placeholder="nº" autocorrect="off" data-google-autocomplete="true" data-google-autocomplete-title="Sugestões" class="field__input" aria-required="true" size="6" type="text" id="address_number" maxlength="8">')
    jQuery(wrapperNumber).append(labelNumber)
    jQuery(wrapperNumber).append(inputNumber)
    jQuery(mainNumber).append(wrapperNumber)
    jQuery(validateBairro).after(mainNumber)

})





var link2 = document.createElement("link")
    , link3 = document.createElement("link");
link2.rel = "stylesheet",
    link3.rel = "stylesheet",
    link2.href = "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
    link3.href = "https://kaioavila.github.io/shopify_checkout/cep.css";
document.getElementsByTagName("head")[0].appendChild(link2),
    document.getElementsByTagName("head")[0].appendChild(link3);

var fieldCountry, desconto = getdesconto(), pais = getpais(), contador = setInterval(verificar, 1e3), novoElemento = document.createElement("div");
(document.querySelector(".section--shipping-address") || digitais && document.querySelector(".section--billing-address")) && construirPGshipping();