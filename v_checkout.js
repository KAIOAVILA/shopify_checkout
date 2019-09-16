var URL = 'https://app.supercheckout.com.br',
    shop = 'chasebrasil.myshopify.com',
    MPpk = '';
var enPhone = true,
    enCPF = true,
    enCPFCheckout = true,
    enCEP = true,
    blockPhone = false,
    blockCEP = true,
    blockCPF = false,
    blockEndereco = false,
    blockNumero = false,
    blockComplemento = false,
    blockBairro = false,
    digitais = false,
    tirarAcentos = false,
    plus55 = false,
    lembraCEP = true;
var script = document.createElement("script");
script.setAttribute("src", "https://unpkg.com/imask"), document.body.appendChild(script);
var style = document.createElement("style");
style.textContent = ".hideM {display: none;}", document.body.appendChild(style);
var listaOK = new Array,
    listaValidar = new Array,
    ajaxcallback = function() {};

function initMask(e, t, n, i) {
    var r = document.getElementById(e);
    if (!r || "undefined" == typeof IMask) return listaOK[e] = !0, setTimeout(function() {
        initMask(e, t, n, i)
    }, 1e3);
    listaOK[e] = !1, listaValidar[e] = n, r.removeAttribute("data-phone-formatter");
    r.parentNode;
    var o = document.querySelector('button[data-trekkie-id="continue_to_shipping_method_button"]') || document.querySelector('button[data-trekkie-id="continue_to_payment_method_button"]') || document.querySelector('button[data-trekkie-id="complete_order_button"]') || document.querySelector('button[trekkie_id="continue_to_payment_method_button"]') || document.querySelector('button[trekkie_id="complete_order_button"]') || document.querySelector('button[trekkie_id="continue_to_shipping_method_button"]');

    function a(n) {
        "function" == typeof i && i(n), r.disabled ? listaOK[e] = !0 : !new RegExp("[\\(\\)0-9\\s/.+-]{" + t.length + "}").test(n) || void 0 !== i && !i(n) || r.erro ? (listaOK[e] = !1, setInputError(r)) : (listaOK[e] = !0, setInputSuccess(r), ajaxcallback = function() {
            a(n)
        });
        var s = !0;
        for (var l in listaOK) 0 == listaOK[l] && listaValidar[l] && (s = !1);
        return s ? o.removeAttribute("disabled") : o.setAttribute("disabled", "disabled"), !0
    }
    o && (o.form.onsubmit = function() {
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
    }), r.addEventListener("keyup", function(e) {
        8 !== e.keyCode && 46 !== e.keyCode || a(r.masked.value)
    }), r.masked = new IMask(r, {
        mask: t,
        validate: a
    })
}

function validarCPF(e) {
    var t, n, i;
    if ("" == (e = e.replace(/[^\d]+/g, "")) || 11 != e.length || "00000000000" == e || "11111111111" == e || "22222222222" == e || "33333333333" == e || "44444444444" == e || "55555555555" == e || "66666666666" == e || "77777777777" == e || "88888888888" == e || "99999999999" == e) return !1;
    for (t = i = 0; 9 > t; t++) i += parseInt(e.charAt(t)) * (10 - t);
    if (10 != (n = 11 - i % 11) && 11 != n || (n = 0), n != parseInt(e.charAt(9))) return !1;
    for (t = i = 0; 10 > t; t++) i += parseInt(e.charAt(t)) * (11 - t);
    return 10 != (n = 11 - i % 11) && 11 != n || (n = 0), n == parseInt(e.charAt(10))
}

function setInputError(e) {
    var t = e.parentNode.classList;
    t.contains("success") && t.remove("success"), t.add("error")
}

function setInputSuccess(e) {
    var t = e.parentNode.classList;
    t.contains("error") && t.remove("error"), t.add("success")
}

function clearInputStatus(e) {
    var t = e.parentNode.classList;
    t.contains("error") && t.remove("error"), t.contains("success") && t.remove("success")
}

function addEvent(e, t, n) {
    e.addEventListener ? e.addEventListener(t, n) : e.attachEvent("on" + t, function() {
        n.call(e)
    })
}

function removerAcentos(e) {
    var t = String(e),
        n = {
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

function getCep(e, t, n, i) {
    var r = document.createElement("span");
    r.classList.add("loading"), e.insertAdjacentElement("afterend", r), jQuery.ajax({
        type: "GET",
        url: "https://viacep.com.br/ws/" + e.value + "/json",
        dataType: "json",
        success: function(o) {
            r.remove(), 1 == o.erro ? (setInputError(e), e.erro = !0, ajaxcallback()) : (e.erro = !1, setInputSuccess(e), ajaxcallback(), n.value = o.localidade, i.value = o.uf, t.value = o.logradouro, "" != o.bairro && (t.value += " - Bairro: " + o.bairro))
        },
        error: function() {
            e.erro = !0, setInputError(e), r.remove()
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
    var e = getdesconto(),
        t = getpais();
    e == desconto && t == pais || (clearInterval(contador), setTimeout(function() {
        (document.querySelector(".section--shipping-address") || digitais && document.querySelector(".section--billing-address")) && construirPGshipping(), desconto = getdesconto(), pais = getpais(), contador = setInterval(verificar, 1e3)
    }, 100))
}

function construirPGshipping() {
    if (novoElemento.classList = "", novoElemento.innerHTML = "", "Brazil" != (fieldCountry = document.querySelector("#checkout_shipping_address_country") || (digitais ? document.querySelector("#checkout_billing_address_country") : null)).value) {
        var e = ["checkout_shipping_address_phone", "checkout_shipping_address_company", "checkout_shipping_address_zip", "checkout_billing_address_phone", "checkout_billing_address_company", "checkout_billing_address_zip", "titular_doc"];
        for (var t in e) try {
            var n = document.getElementById(e[t]);
            n.masked.destroy(), clearInputStatus(n)
        } catch (e) {
            console.log(e)
        }
    } else {
        var i;
        i = plus55 ? "+55 (00) 00000-0000" : "(00) 00000-0000", enPhone && (initMask("checkout_shipping_address_phone", i, blockPhone), digitais && initMask("checkout_billing_address_phone", i, blockPhone)), enCPF && (initMask("checkout_shipping_address_company", "000.000.000-00", blockCPF, validarCPF), digitais && initMask("checkout_billing_address_company", "000.000.000-00", blockCPF, validarCPF)), enCEP && (initMask("checkout_shipping_address_zip", "00000-000", blockCEP), digitais && initMask("checkout_billing_address_zip", "00000-000", blockCEP)), novoElemento.classList.add("field", "field--half", "find-zip-container"), novoElemento.innerHTML = '<div class="field__input-wrapper">' + (lembraCEP ? '<a href="http://www.buscacep.correios.com.br/sistemas/buscacep/" target="_blank" class="checkout-zip-link" style="display: inline-block;padding: 15px 0;color:#000;text-decoration: underline;">Não lembra seu CEP?</a>' : "") + "</div>";
        var r = document.querySelector('[data-address-field="country"]'),
            o = document.querySelector('[data-address-field="province"]'),
            a = document.querySelector('[data-address-field="zip"]'),
            s = document.querySelector('[data-address-field="address1"]'),
            l = document.querySelector("#checkout_shipping_address_address1") || (digitais ? document.querySelector("#checkout_billing_address_address1") : null),
            u = document.querySelector("#checkout_shipping_address_zip") || (digitais ? document.querySelector("#checkout_billing_address_zip") : null),
            c = document.querySelector("#checkout_shipping_address_city") || (digitais ? document.querySelector("#checkout_billing_address_city") : null),
            d = document.querySelector("#checkout_shipping_address_province") || (digitais ? document.querySelector("#checkout_billing_address_province") : null);
        s.insertAdjacentElement("beforebegin", a), s.insertAdjacentElement("beforebegin", novoElemento), a.classList.add("field--half"), r.classList.add("field--half"), o.classList.add("field--half"), u.addEventListener("input", function(e) {
            0 == e.target.value.length ? (clearInputStatus(e.target), e.target.erro = !1) : 9 == e.target.value.length && getCep(e.target, l, c, d)
        }, !1), u.addEventListener("blur", function(e) {
            e.target.value.length < 9 && setInputError(e.target)
        }, !1)
    }
}! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    var n = [],
        i = n.slice,
        r = n.concat,
        o = n.push,
        a = n.indexOf,
        s = {},
        l = s.toString,
        u = s.hasOwnProperty,
        c = {},
        d = "1.11.1",
        f = function(e, t) {
            return new f.fn.init(e, t)
        },
        p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        h = /^-ms-/,
        m = /-([\da-z])/gi,
        g = function(e, t) {
            return t.toUpperCase()
        };

    function v(e) {
        var t = e.length,
            n = f.type(e);
        return "function" !== n && !f.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }
    f.fn = f.prototype = {
        jquery: d,
        constructor: f,
        selector: "",
        length: 0,
        toArray: function() {
            return i.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : i.call(this)
        },
        pushStack: function(e) {
            var t = f.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return f.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(f.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(i.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: o,
        sort: n.sort,
        splice: n.splice
    }, f.extend = f.fn.extend = function() {
        var e, t, n, i, r, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || f.isFunction(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
            if (null != (r = arguments[s]))
                for (i in r) e = a[i], a !== (n = r[i]) && (u && n && (f.isPlainObject(n) || (t = f.isArray(n))) ? (t ? (t = !1, o = e && f.isArray(e) ? e : []) : o = e && f.isPlainObject(e) ? e : {}, a[i] = f.extend(u, o, n)) : void 0 !== n && (a[i] = n));
        return a
    }, f.extend({
        expando: "jQuery" + (d + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === f.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === f.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !f.isArray(e) && e - parseFloat(e) >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== f.type(e) || e.nodeType || f.isWindow(e)) return !1;
            try {
                if (e.constructor && !u.call(e, "constructor") && !u.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (e) {
                return !1
            }
            if (c.ownLast)
                for (t in e) return u.call(e, t);
            for (t in e);
            return void 0 === t || u.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? s[l.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && f.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(h, "ms-").replace(m, g)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var i = 0,
                r = e.length,
                o = v(e);
            if (n) {
                if (o)
                    for (; i < r && !1 !== t.apply(e[i], n); i++);
                else
                    for (i in e)
                        if (!1 === t.apply(e[i], n)) break
            } else if (o)
                for (; i < r && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break; return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(p, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (v(Object(e)) ? f.merge(n, "string" == typeof e ? [e] : e) : o.call(n, e)), n
        },
        inArray: function(e, t, n) {
            var i;
            if (t) {
                if (a) return a.call(t, e, n);
                for (i = t.length, n = n ? n < 0 ? Math.max(0, i + n) : n : 0; n < i; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, r = e.length; i < n;) e[r++] = t[i++];
            if (n != n)
                for (; void 0 !== t[i];) e[r++] = t[i++];
            return e.length = r, e
        },
        grep: function(e, t, n) {
            for (var i = [], r = 0, o = e.length, a = !n; r < o; r++) !t(e[r], r) !== a && i.push(e[r]);
            return i
        },
        map: function(e, t, n) {
            var i, o = 0,
                a = e.length,
                s = [];
            if (v(e))
                for (; o < a; o++) null != (i = t(e[o], o, n)) && s.push(i);
            else
                for (o in e) null != (i = t(e[o], o, n)) && s.push(i);
            return r.apply([], s)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, o;
            if ("string" == typeof t && (o = e[t], t = e, e = o), f.isFunction(e)) return n = i.call(arguments, 2), (r = function() {
                return e.apply(t || this, n.concat(i.call(arguments)))
            }).guid = e.guid = e.guid || f.guid++, r
        },
        now: function() {
            return +new Date
        },
        support: c
    }), f.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        s["[object " + t + "]"] = t.toLowerCase()
    });
    var y = function(e) {
        var t, n, i, r, o, a, s, l, u, c, d, f, p, h, m, g, v, y, b, x = "sizzle" + -new Date,
            w = e.document,
            C = 0,
            k = 0,
            _ = oe(),
            T = oe(),
            E = oe(),
            N = function(e, t) {
                return e === t && (d = !0), 0
            },
            S = "undefined",
            A = 1 << 31,
            L = {}.hasOwnProperty,
            j = [],
            q = j.pop,
            D = j.push,
            M = j.push,
            H = j.slice,
            F = j.indexOf || function(e) {
                for (var t = 0, n = this.length; t < n; t++)
                    if (this[t] === e) return t;
                return -1
            },
            P = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            R = "[\\x20\\t\\r\\n\\f]",
            O = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            B = O.replace("w", "w#"),
            z = "\\[" + R + "*(" + O + ")(?:" + R + "*([*^$|!~]?=)" + R + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + B + "))|)" + R + "*\\]",
            I = ":(" + O + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + z + ")*)|.*)\\)|)",
            W = new RegExp("^" + R + "+|((?:^|[^\\\\])(?:\\\\.)*)" + R + "+$", "g"),
            $ = new RegExp("^" + R + "*," + R + "*"),
            X = new RegExp("^" + R + "*([>+~]|" + R + ")" + R + "*"),
            V = new RegExp("=" + R + "*([^\\]'\"]*?)" + R + "*\\]", "g"),
            U = new RegExp(I),
            K = new RegExp("^" + B + "$"),
            G = {
                ID: new RegExp("^#(" + O + ")"),
                CLASS: new RegExp("^\\.(" + O + ")"),
                TAG: new RegExp("^(" + O.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + z),
                PSEUDO: new RegExp("^" + I),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + R + "*(even|odd|(([+-]|)(\\d*)n|)" + R + "*(?:([+-]|)" + R + "*(\\d+)|))" + R + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + P + ")$", "i"),
                needsContext: new RegExp("^" + R + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + R + "*((?:-\\d)?\\d*)" + R + "*\\)|)(?=[^-]|$)", "i")
            },
            Q = /^(?:input|select|textarea|button)$/i,
            Y = /^h\d$/i,
            J = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ee = /[+~]/,
            te = /'|\\/g,
            ne = new RegExp("\\\\([\\da-f]{1,6}" + R + "?|(" + R + ")|.)", "ig"),
            ie = function(e, t, n) {
                var i = "0x" + t - 65536;
                return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            };
        try {
            M.apply(j = H.call(w.childNodes), w.childNodes), j[w.childNodes.length].nodeType
        } catch (e) {
            M = {
                apply: j.length ? function(e, t) {
                    D.apply(e, H.call(t))
                } : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++];);
                    e.length = n - 1
                }
            }
        }

        function re(e, t, i, r) {
            var o, s, u, c, d, h, v, y, C, k;
            if ((t ? t.ownerDocument || t : w) !== p && f(t), i = i || [], !e || "string" != typeof e) return i;
            if (1 !== (c = (t = t || p).nodeType) && 9 !== c) return [];
            if (m && !r) {
                if (o = Z.exec(e))
                    if (u = o[1]) {
                        if (9 === c) {
                            if (!(s = t.getElementById(u)) || !s.parentNode) return i;
                            if (s.id === u) return i.push(s), i
                        } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(u)) && b(t, s) && s.id === u) return i.push(s), i
                    } else {
                        if (o[2]) return M.apply(i, t.getElementsByTagName(e)), i;
                        if ((u = o[3]) && n.getElementsByClassName && t.getElementsByClassName) return M.apply(i, t.getElementsByClassName(u)), i
                    }
                if (n.qsa && (!g || !g.test(e))) {
                    if (y = v = x, C = t, k = 9 === c && e, 1 === c && "object" !== t.nodeName.toLowerCase()) {
                        for (h = a(e), (v = t.getAttribute("id")) ? y = v.replace(te, "\\$&") : t.setAttribute("id", y), y = "[id='" + y + "'] ", d = h.length; d--;) h[d] = y + me(h[d]);
                        C = ee.test(e) && pe(t.parentNode) || t, k = h.join(",")
                    }
                    if (k) try {
                        return M.apply(i, C.querySelectorAll(k)), i
                    } catch (e) {} finally {
                        v || t.removeAttribute("id")
                    }
                }
            }
            return l(e.replace(W, "$1"), t, i, r)
        }

        function oe() {
            var e = [];
            return function t(n, r) {
                return e.push(n + " ") > i.cacheLength && delete t[e.shift()], t[n + " "] = r
            }
        }

        function ae(e) {
            return e[x] = !0, e
        }

        function se(e) {
            var t = p.createElement("div");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function le(e, t) {
            for (var n = e.split("|"), r = e.length; r--;) i.attrHandle[n[r]] = t
        }

        function ue(e, t) {
            var n = t && e,
                i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || A) - (~e.sourceIndex || A);
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function ce(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }

        function de(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function fe(e) {
            return ae(function(t) {
                return t = +t, ae(function(n, i) {
                    for (var r, o = e([], n.length, t), a = o.length; a--;) n[r = o[a]] && (n[r] = !(i[r] = n[r]))
                })
            })
        }

        function pe(e) {
            return e && typeof e.getElementsByTagName !== S && e
        }
        for (t in n = re.support = {}, o = re.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            }, f = re.setDocument = function(e) {
                var t, r = e ? e.ownerDocument || e : w,
                    a = r.defaultView;
                return r !== p && 9 === r.nodeType && r.documentElement ? (p = r, h = r.documentElement, m = !o(r), a && a !== a.top && (a.addEventListener ? a.addEventListener("unload", function() {
                    f()
                }, !1) : a.attachEvent && a.attachEvent("onunload", function() {
                    f()
                })), n.attributes = se(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), n.getElementsByTagName = se(function(e) {
                    return e.appendChild(r.createComment("")), !e.getElementsByTagName("*").length
                }), n.getElementsByClassName = J.test(r.getElementsByClassName) && se(function(e) {
                    return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                }), n.getById = se(function(e) {
                    return h.appendChild(e).id = x, !r.getElementsByName || !r.getElementsByName(x).length
                }), n.getById ? (i.find.ID = function(e, t) {
                    if (typeof t.getElementById !== S && m) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, i.filter.ID = function(e) {
                    var t = e.replace(ne, ie);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete i.find.ID, i.filter.ID = function(e) {
                    var t = e.replace(ne, ie);
                    return function(e) {
                        var n = typeof e.getAttributeNode !== S && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }), i.find.TAG = n.getElementsByTagName ? function(e, t) {
                    if (typeof t.getElementsByTagName !== S) return t.getElementsByTagName(e)
                } : function(e, t) {
                    var n, i = [],
                        r = 0,
                        o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return o
                }, i.find.CLASS = n.getElementsByClassName && function(e, t) {
                    if (typeof t.getElementsByClassName !== S && m) return t.getElementsByClassName(e)
                }, v = [], g = [], (n.qsa = J.test(r.querySelectorAll)) && (se(function(e) {
                    e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && g.push("[*^$]=" + R + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || g.push("\\[" + R + "*(?:value|" + P + ")"), e.querySelectorAll(":checked").length || g.push(":checked")
                }), se(function(e) {
                    var t = r.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && g.push("name" + R + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g.push(",.*:")
                })), (n.matchesSelector = J.test(y = h.matches || h.webkitMatchesSelector || h.mozMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) && se(function(e) {
                    n.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), v.push("!=", I)
                }), g = g.length && new RegExp(g.join("|")), v = v.length && new RegExp(v.join("|")), t = J.test(h.compareDocumentPosition), b = t || J.test(h.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, N = t ? function(e, t) {
                    if (e === t) return d = !0, 0;
                    var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return i || (1 & (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !n.sortDetached && t.compareDocumentPosition(e) === i ? e === r || e.ownerDocument === w && b(w, e) ? -1 : t === r || t.ownerDocument === w && b(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return d = !0, 0;
                    var n, i = 0,
                        o = e.parentNode,
                        a = t.parentNode,
                        s = [e],
                        l = [t];
                    if (!o || !a) return e === r ? -1 : t === r ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0;
                    if (o === a) return ue(e, t);
                    for (n = e; n = n.parentNode;) s.unshift(n);
                    for (n = t; n = n.parentNode;) l.unshift(n);
                    for (; s[i] === l[i];) i++;
                    return i ? ue(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0
                }, r) : p
            }, re.matches = function(e, t) {
                return re(e, null, null, t)
            }, re.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== p && f(e), t = t.replace(V, "='$1']"), n.matchesSelector && m && (!v || !v.test(t)) && (!g || !g.test(t))) try {
                    var i = y.call(e, t);
                    if (i || n.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (e) {}
                return re(t, p, null, [e]).length > 0
            }, re.contains = function(e, t) {
                return (e.ownerDocument || e) !== p && f(e), b(e, t)
            }, re.attr = function(e, t) {
                (e.ownerDocument || e) !== p && f(e);
                var r = i.attrHandle[t.toLowerCase()],
                    o = r && L.call(i.attrHandle, t.toLowerCase()) ? r(e, t, !m) : void 0;
                return void 0 !== o ? o : n.attributes || !m ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null
            }, re.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, re.uniqueSort = function(e) {
                var t, i = [],
                    r = 0,
                    o = 0;
                if (d = !n.detectDuplicates, c = !n.sortStable && e.slice(0), e.sort(N), d) {
                    for (; t = e[o++];) t === e[o] && (r = i.push(o));
                    for (; r--;) e.splice(i[r], 1)
                }
                return c = null, e
            }, r = re.getText = function(e) {
                var t, n = "",
                    i = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += r(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[i++];) n += r(t);
                return n
            }, (i = re.selectors = {
                cacheLength: 50,
                createPseudo: ae,
                match: G,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(ne, ie), e[3] = (e[3] || e[4] || e[5] || "").replace(ne, ie), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || re.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && re.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && U.test(n) && (t = a(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(ne, ie).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = _[e + " "];
                        return t || (t = new RegExp("(^|" + R + ")" + e + "(" + R + "|$)")) && _(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== S && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, t, n) {
                        return function(i) {
                            var r = re.attr(i, e);
                            return null == r ? "!=" === t : !t || (r += "", "=" === t ? r === n : "!=" === t ? r !== n : "^=" === t ? n && 0 === r.indexOf(n) : "*=" === t ? n && r.indexOf(n) > -1 : "$=" === t ? n && r.slice(-n.length) === n : "~=" === t ? (" " + r + " ").indexOf(n) > -1 : "|=" === t && (r === n || r.slice(0, n.length + 1) === n + "-"))
                        }
                    },
                    CHILD: function(e, t, n, i, r) {
                        var o = "nth" !== e.slice(0, 3),
                            a = "last" !== e.slice(-4),
                            s = "of-type" === t;
                        return 1 === i && 0 === r ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, l) {
                            var u, c, d, f, p, h, m = o !== a ? "nextSibling" : "previousSibling",
                                g = t.parentNode,
                                v = s && t.nodeName.toLowerCase(),
                                y = !l && !s;
                            if (g) {
                                if (o) {
                                    for (; m;) {
                                        for (d = t; d = d[m];)
                                            if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                        h = m = "only" === e && !h && "nextSibling"
                                    }
                                    return !0
                                }
                                if (h = [a ? g.firstChild : g.lastChild], a && y) {
                                    for (p = (u = (c = g[x] || (g[x] = {}))[e] || [])[0] === C && u[1], f = u[0] === C && u[2], d = p && g.childNodes[p]; d = ++p && d && d[m] || (f = p = 0) || h.pop();)
                                        if (1 === d.nodeType && ++f && d === t) {
                                            c[e] = [C, p, f];
                                            break
                                        }
                                } else if (y && (u = (t[x] || (t[x] = {}))[e]) && u[0] === C) f = u[1];
                                else
                                    for (;
                                        (d = ++p && d && d[m] || (f = p = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++f || (y && ((d[x] || (d[x] = {}))[e] = [C, f]), d !== t)););
                                return (f -= r) === i || f % i == 0 && f / i >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, t) {
                        var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || re.error("unsupported pseudo: " + e);
                        return r[x] ? r(t) : r.length > 1 ? (n = [e, e, "", t], i.setFilters.hasOwnProperty(e.toLowerCase()) ? ae(function(e, n) {
                            for (var i, o = r(e, t), a = o.length; a--;) e[i = F.call(e, o[a])] = !(n[i] = o[a])
                        }) : function(e) {
                            return r(e, 0, n)
                        }) : r
                    }
                },
                pseudos: {
                    not: ae(function(e) {
                        var t = [],
                            n = [],
                            i = s(e.replace(W, "$1"));
                        return i[x] ? ae(function(e, t, n, r) {
                            for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                        }) : function(e, r, o) {
                            return t[0] = e, i(t, null, o, n), !n.pop()
                        }
                    }),
                    has: ae(function(e) {
                        return function(t) {
                            return re(e, t).length > 0
                        }
                    }),
                    contains: ae(function(e) {
                        return function(t) {
                            return (t.textContent || t.innerText || r(t)).indexOf(e) > -1
                        }
                    }),
                    lang: ae(function(e) {
                        return K.test(e || "") || re.error("unsupported lang: " + e), e = e.replace(ne, ie).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = m ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === h
                    },
                    focus: function(e) {
                        return e === p.activeElement && (!p.hasFocus || p.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return !1 === e.disabled
                    },
                    disabled: function(e) {
                        return !0 === e.disabled
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !i.pseudos.empty(e)
                    },
                    header: function(e) {
                        return Y.test(e.nodeName)
                    },
                    input: function(e) {
                        return Q.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: fe(function() {
                        return [0]
                    }),
                    last: fe(function(e, t) {
                        return [t - 1]
                    }),
                    eq: fe(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: fe(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: fe(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: fe(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; --i >= 0;) e.push(i);
                        return e
                    }),
                    gt: fe(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = i.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) i.pseudos[t] = ce(t);
        for (t in {
                submit: !0,
                reset: !0
            }) i.pseudos[t] = de(t);

        function he() {}

        function me(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
            return i
        }

        function ge(e, t, n) {
            var i = t.dir,
                r = n && "parentNode" === i,
                o = k++;
            return t.first ? function(t, n, o) {
                for (; t = t[i];)
                    if (1 === t.nodeType || r) return e(t, n, o)
            } : function(t, n, a) {
                var s, l, u = [C, o];
                if (a) {
                    for (; t = t[i];)
                        if ((1 === t.nodeType || r) && e(t, n, a)) return !0
                } else
                    for (; t = t[i];)
                        if (1 === t.nodeType || r) {
                            if ((s = (l = t[x] || (t[x] = {}))[i]) && s[0] === C && s[1] === o) return u[2] = s[2];
                            if (l[i] = u, u[2] = e(t, n, a)) return !0
                        }
            }
        }

        function ve(e) {
            return e.length > 1 ? function(t, n, i) {
                for (var r = e.length; r--;)
                    if (!e[r](t, n, i)) return !1;
                return !0
            } : e[0]
        }

        function ye(e, t, n, i, r) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)(o = e[s]) && (n && !n(o, i, r) || (a.push(o), u && t.push(s)));
            return a
        }

        function be(e, t, n, i, r, o) {
            return i && !i[x] && (i = be(i)), r && !r[x] && (r = be(r, o)), ae(function(o, a, s, l) {
                var u, c, d, f = [],
                    p = [],
                    h = a.length,
                    m = o || function(e, t, n) {
                        for (var i = 0, r = t.length; i < r; i++) re(e, t[i], n);
                        return n
                    }(t || "*", s.nodeType ? [s] : s, []),
                    g = !e || !o && t ? m : ye(m, f, e, s, l),
                    v = n ? r || (o ? e : h || i) ? [] : a : g;
                if (n && n(g, v, s, l), i)
                    for (u = ye(v, p), i(u, [], s, l), c = u.length; c--;)(d = u[c]) && (v[p[c]] = !(g[p[c]] = d));
                if (o) {
                    if (r || e) {
                        if (r) {
                            for (u = [], c = v.length; c--;)(d = v[c]) && u.push(g[c] = d);
                            r(null, v = [], u, l)
                        }
                        for (c = v.length; c--;)(d = v[c]) && (u = r ? F.call(o, d) : f[c]) > -1 && (o[u] = !(a[u] = d))
                    }
                } else v = ye(v === a ? v.splice(h, v.length) : v), r ? r(null, a, v, l) : M.apply(a, v)
            })
        }

        function xe(e) {
            for (var t, n, r, o = e.length, a = i.relative[e[0].type], s = a || i.relative[" "], l = a ? 1 : 0, c = ge(function(e) {
                    return e === t
                }, s, !0), d = ge(function(e) {
                    return F.call(t, e) > -1
                }, s, !0), f = [function(e, n, i) {
                    return !a && (i || n !== u) || ((t = n).nodeType ? c(e, n, i) : d(e, n, i))
                }]; l < o; l++)
                if (n = i.relative[e[l].type]) f = [ge(ve(f), n)];
                else {
                    if ((n = i.filter[e[l].type].apply(null, e[l].matches))[x]) {
                        for (r = ++l; r < o && !i.relative[e[r].type]; r++);
                        return be(l > 1 && ve(f), l > 1 && me(e.slice(0, l - 1).concat({
                            value: " " === e[l - 2].type ? "*" : ""
                        })).replace(W, "$1"), n, l < r && xe(e.slice(l, r)), r < o && xe(e = e.slice(r)), r < o && me(e))
                    }
                    f.push(n)
                }
            return ve(f)
        }
        return he.prototype = i.filters = i.pseudos, i.setFilters = new he, a = re.tokenize = function(e, t) {
            var n, r, o, a, s, l, u, c = T[e + " "];
            if (c) return t ? 0 : c.slice(0);
            for (s = e, l = [], u = i.preFilter; s;) {
                for (a in n && !(r = $.exec(s)) || (r && (s = s.slice(r[0].length) || s), l.push(o = [])), n = !1, (r = X.exec(s)) && (n = r.shift(), o.push({
                        value: n,
                        type: r[0].replace(W, " ")
                    }), s = s.slice(n.length)), i.filter) !(r = G[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), o.push({
                    value: n,
                    type: a,
                    matches: r
                }), s = s.slice(n.length));
                if (!n) break
            }
            return t ? s.length : s ? re.error(e) : T(e, l).slice(0)
        }, s = re.compile = function(e, t) {
            var n, r, o, s, l, c, d = [],
                f = [],
                h = E[e + " "];
            if (!h) {
                for (t || (t = a(e)), n = t.length; n--;)(h = xe(t[n]))[x] ? d.push(h) : f.push(h);
                (h = E(e, (r = f, s = (o = d).length > 0, l = r.length > 0, c = function(e, t, n, a, c) {
                    var d, f, h, m = 0,
                        g = "0",
                        v = e && [],
                        y = [],
                        b = u,
                        x = e || l && i.find.TAG("*", c),
                        w = C += null == b ? 1 : Math.random() || .1,
                        k = x.length;
                    for (c && (u = t !== p && t); g !== k && null != (d = x[g]); g++) {
                        if (l && d) {
                            for (f = 0; h = r[f++];)
                                if (h(d, t, n)) {
                                    a.push(d);
                                    break
                                }
                            c && (C = w)
                        }
                        s && ((d = !h && d) && m--, e && v.push(d))
                    }
                    if (m += g, s && g !== m) {
                        for (f = 0; h = o[f++];) h(v, y, t, n);
                        if (e) {
                            if (m > 0)
                                for (; g--;) v[g] || y[g] || (y[g] = q.call(a));
                            y = ye(y)
                        }
                        M.apply(a, y), c && !e && y.length > 0 && m + o.length > 1 && re.uniqueSort(a)
                    }
                    return c && (C = w, u = b), v
                }, s ? ae(c) : c))).selector = e
            }
            return h
        }, l = re.select = function(e, t, r, o) {
            var l, u, c, d, f, p = "function" == typeof e && e,
                h = !o && a(e = p.selector || e);
            if (r = r || [], 1 === h.length) {
                if ((u = h[0] = h[0].slice(0)).length > 2 && "ID" === (c = u[0]).type && n.getById && 9 === t.nodeType && m && i.relative[u[1].type]) {
                    if (!(t = (i.find.ID(c.matches[0].replace(ne, ie), t) || [])[0])) return r;
                    p && (t = t.parentNode), e = e.slice(u.shift().value.length)
                }
                for (l = G.needsContext.test(e) ? 0 : u.length; l-- && (c = u[l], !i.relative[d = c.type]);)
                    if ((f = i.find[d]) && (o = f(c.matches[0].replace(ne, ie), ee.test(u[0].type) && pe(t.parentNode) || t))) {
                        if (u.splice(l, 1), !(e = o.length && me(u))) return M.apply(r, o), r;
                        break
                    }
            }
            return (p || s(e, h))(o, t, !m, r, ee.test(e) && pe(t.parentNode) || t), r
        }, n.sortStable = x.split("").sort(N).join("") === x, n.detectDuplicates = !!d, f(), n.sortDetached = se(function(e) {
            return 1 & e.compareDocumentPosition(p.createElement("div"))
        }), se(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || le("type|href|height|width", function(e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), n.attributes && se(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || le("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), se(function(e) {
            return null == e.getAttribute("disabled")
        }) || le(P, function(e, t, n) {
            var i;
            if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }), re
    }(e);
    f.find = y, f.expr = y.selectors, f.expr[":"] = f.expr.pseudos, f.unique = y.uniqueSort, f.text = y.getText, f.isXMLDoc = y.isXML, f.contains = y.contains;
    var b = f.expr.match.needsContext,
        x = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        w = /^.[^:#\[\.,]*$/;

    function C(e, t, n) {
        if (f.isFunction(t)) return f.grep(e, function(e, i) {
            return !!t.call(e, i, e) !== n
        });
        if (t.nodeType) return f.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (w.test(t)) return f.filter(t, e, n);
            t = f.filter(t, e)
        }
        return f.grep(e, function(e) {
            return f.inArray(e, t) >= 0 !== n
        })
    }
    f.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? f.find.matchesSelector(i, e) ? [i] : [] : f.find.matches(e, f.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, f.fn.extend({
        find: function(e) {
            var t, n = [],
                i = this,
                r = i.length;
            if ("string" != typeof e) return this.pushStack(f(e).filter(function() {
                for (t = 0; t < r; t++)
                    if (f.contains(i[t], this)) return !0
            }));
            for (t = 0; t < r; t++) f.find(e, i[t], n);
            return (n = this.pushStack(r > 1 ? f.unique(n) : n)).selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(C(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(C(this, e || [], !0))
        },
        is: function(e) {
            return !!C(this, "string" == typeof e && b.test(e) ? f(e) : e || [], !1).length
        }
    });
    var k, _ = e.document,
        T = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (f.fn.init = function(e, t) {
        var n, i;
        if (!e) return this;
        if ("string" == typeof e) {
            if (!(n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : T.exec(e)) || !n[1] && t) return !t || t.jquery ? (t || k).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof f ? t[0] : t, f.merge(this, f.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : _, !0)), x.test(n[1]) && f.isPlainObject(t))
                    for (n in t) f.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            if ((i = _.getElementById(n[2])) && i.parentNode) {
                if (i.id !== n[2]) return k.find(e);
                this.length = 1, this[0] = i
            }
            return this.context = _, this.selector = e, this
        }
        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : f.isFunction(e) ? void 0 !== k.ready ? k.ready(e) : e(f) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), f.makeArray(e, this))
    }).prototype = f.fn, k = f(_);
    var E = /^(?:parents|prev(?:Until|All))/,
        N = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };

    function S(e, t) {
        do {
            e = e[t]
        } while (e && 1 !== e.nodeType);
        return e
    }
    f.extend({
        dir: function(e, t, n) {
            for (var i = [], r = e[t]; r && 9 !== r.nodeType && (void 0 === n || 1 !== r.nodeType || !f(r).is(n));) 1 === r.nodeType && i.push(r), r = r[t];
            return i
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), f.fn.extend({
        has: function(e) {
            var t, n = f(e, this),
                i = n.length;
            return this.filter(function() {
                for (t = 0; t < i; t++)
                    if (f.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, i = 0, r = this.length, o = [], a = b.test(e) || "string" != typeof e ? f(e, t || this.context) : 0; i < r; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && f.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? f.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? f.inArray(this[0], f(e)) : f.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(f.unique(f.merge(this.get(), f(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), f.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return f.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return f.dir(e, "parentNode", n)
        },
        next: function(e) {
            return S(e, "nextSibling")
        },
        prev: function(e) {
            return S(e, "previousSibling")
        },
        nextAll: function(e) {
            return f.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return f.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return f.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return f.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return f.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return f.sibling(e.firstChild)
        },
        contents: function(e) {
            return f.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : f.merge([], e.childNodes)
        }
    }, function(e, t) {
        f.fn[e] = function(n, i) {
            var r = f.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = f.filter(i, r)), this.length > 1 && (N[e] || (r = f.unique(r)), E.test(e) && (r = r.reverse())), this.pushStack(r)
        }
    });
    var A, L = /\S+/g,
        j = {};

    function q() {
        _.addEventListener ? (_.removeEventListener("DOMContentLoaded", D, !1), e.removeEventListener("load", D, !1)) : (_.detachEvent("onreadystatechange", D), e.detachEvent("onload", D))
    }

    function D() {
        (_.addEventListener || "load" === event.type || "complete" === _.readyState) && (q(), f.ready())
    }
    f.Callbacks = function(e) {
        var t, n, i, r, o, a, s, l, u = [],
            c = !(e = "string" == typeof e ? j[e] || (n = j[t = e] = {}, f.each(t.match(L) || [], function(e, t) {
                n[t] = !0
            }), n) : f.extend({}, e)).once && [],
            d = function(t) {
                for (r = e.memory && t, o = !0, s = l || 0, l = 0, a = u.length, i = !0; u && s < a; s++)
                    if (!1 === u[s].apply(t[0], t[1]) && e.stopOnFalse) {
                        r = !1;
                        break
                    }
                i = !1, u && (c ? c.length && d(c.shift()) : r ? u = [] : p.disable())
            },
            p = {
                add: function() {
                    if (u) {
                        var t = u.length;
                        ! function t(n) {
                            f.each(n, function(n, i) {
                                var r = f.type(i);
                                "function" === r ? e.unique && p.has(i) || u.push(i) : i && i.length && "string" !== r && t(i)
                            })
                        }(arguments), i ? a = u.length : r && (l = t, d(r))
                    }
                    return this
                },
                remove: function() {
                    return u && f.each(arguments, function(e, t) {
                        for (var n;
                            (n = f.inArray(t, u, n)) > -1;) u.splice(n, 1), i && (n <= a && a--, n <= s && s--)
                    }), this
                },
                has: function(e) {
                    return e ? f.inArray(e, u) > -1 : !(!u || !u.length)
                },
                empty: function() {
                    return u = [], a = 0, this
                },
                disable: function() {
                    return u = c = r = void 0, this
                },
                disabled: function() {
                    return !u
                },
                lock: function() {
                    return c = void 0, r || p.disable(), this
                },
                locked: function() {
                    return !c
                },
                fireWith: function(e, t) {
                    return !u || o && !c || (t = [e, (t = t || []).slice ? t.slice() : t], i ? c.push(t) : d(t)), this
                },
                fire: function() {
                    return p.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!o
                }
            };
        return p
    }, f.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", f.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", f.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", f.Callbacks("memory")]
                ],
                n = "pending",
                i = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return f.Deferred(function(n) {
                            f.each(t, function(t, o) {
                                var a = f.isFunction(e[t]) && e[t];
                                r[o[1]](function() {
                                    var e = a && a.apply(this, arguments);
                                    e && f.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === i ? n.promise() : this, a ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? f.extend(e, i) : i
                    }
                },
                r = {};
            return i.pipe = i.then, f.each(t, function(e, o) {
                var a = o[2],
                    s = o[3];
                i[o[1]] = a.add, s && a.add(function() {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function() {
                    return r[o[0] + "With"](this === r ? i : this, arguments), this
                }, r[o[0] + "With"] = a.fireWith
            }), i.promise(r), e && e.call(r, r), r
        },
        when: function(e) {
            var t, n, r, o = 0,
                a = i.call(arguments),
                s = a.length,
                l = 1 !== s || e && f.isFunction(e.promise) ? s : 0,
                u = 1 === l ? e : f.Deferred(),
                c = function(e, n, r) {
                    return function(o) {
                        n[e] = this, r[e] = arguments.length > 1 ? i.call(arguments) : o, r === t ? u.notifyWith(n, r) : --l || u.resolveWith(n, r)
                    }
                };
            if (s > 1)
                for (t = new Array(s), n = new Array(s), r = new Array(s); o < s; o++) a[o] && f.isFunction(a[o].promise) ? a[o].promise().done(c(o, r, a)).fail(u.reject).progress(c(o, n, t)) : --l;
            return l || u.resolveWith(r, a), u.promise()
        }
    }), f.fn.ready = function(e) {
        return f.ready.promise().done(e), this
    }, f.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? f.readyWait++ : f.ready(!0)
        },
        ready: function(e) {
            if (!0 === e ? !--f.readyWait : !f.isReady) {
                if (!_.body) return setTimeout(f.ready);
                f.isReady = !0, !0 !== e && --f.readyWait > 0 || (A.resolveWith(_, [f]), f.fn.triggerHandler && (f(_).triggerHandler("ready"), f(_).off("ready")))
            }
        }
    }), f.ready.promise = function(t) {
        if (!A)
            if (A = f.Deferred(), "complete" === _.readyState) setTimeout(f.ready);
            else if (_.addEventListener) _.addEventListener("DOMContentLoaded", D, !1), e.addEventListener("load", D, !1);
        else {
            _.attachEvent("onreadystatechange", D), e.attachEvent("onload", D);
            var n = !1;
            try {
                n = null == e.frameElement && _.documentElement
            } catch (e) {}
            n && n.doScroll && function e() {
                if (!f.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (t) {
                        return setTimeout(e, 50)
                    }
                    q(), f.ready()
                }
            }()
        }
        return A.promise(t)
    };
    var M, H = "undefined";
    for (M in f(c)) break;
    c.ownLast = "0" !== M, c.inlineBlockNeedsLayout = !1, f(function() {
            var e, t, n, i;
            (n = _.getElementsByTagName("body")[0]) && n.style && (t = _.createElement("div"), (i = _.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== H && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", c.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(i))
        }),
        function() {
            var e = _.createElement("div");
            if (null == c.deleteExpando) {
                c.deleteExpando = !0;
                try {
                    delete e.test
                } catch (e) {
                    c.deleteExpando = !1
                }
            }
            e = null
        }(), f.acceptData = function(e) {
            var t = f.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return (1 === n || 9 === n) && (!t || !0 !== t && e.getAttribute("classid") === t)
        };
    var F = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        P = /([A-Z])/g;

    function R(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var i = "data-" + t.replace(P, "-$1").toLowerCase();
            if ("string" == typeof(n = e.getAttribute(i))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : F.test(n) ? f.parseJSON(n) : n)
                } catch (e) {}
                f.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function O(e) {
        var t;
        for (t in e)
            if (("data" !== t || !f.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function B(e, t, i, r) {
        if (f.acceptData(e)) {
            var o, a, s = f.expando,
                l = e.nodeType,
                u = l ? f.cache : e,
                c = l ? e[s] : e[s] && s;
            if (c && u[c] && (r || u[c].data) || void 0 !== i || "string" != typeof t) return c || (c = l ? e[s] = n.pop() || f.guid++ : s), u[c] || (u[c] = l ? {} : {
                toJSON: f.noop
            }), "object" != typeof t && "function" != typeof t || (r ? u[c] = f.extend(u[c], t) : u[c].data = f.extend(u[c].data, t)), a = u[c], r || (a.data || (a.data = {}), a = a.data), void 0 !== i && (a[f.camelCase(t)] = i), "string" == typeof t ? null == (o = a[t]) && (o = a[f.camelCase(t)]) : o = a, o
        }
    }

    function z(e, t, n) {
        if (f.acceptData(e)) {
            var i, r, o = e.nodeType,
                a = o ? f.cache : e,
                s = o ? e[f.expando] : f.expando;
            if (a[s]) {
                if (t && (i = n ? a[s] : a[s].data)) {
                    r = (t = f.isArray(t) ? t.concat(f.map(t, f.camelCase)) : t in i ? [t] : (t = f.camelCase(t)) in i ? [t] : t.split(" ")).length;
                    for (; r--;) delete i[t[r]];
                    if (n ? !O(i) : !f.isEmptyObject(i)) return
                }(n || (delete a[s].data, O(a[s]))) && (o ? f.cleanData([e], !0) : c.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }
    f.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return !!(e = e.nodeType ? f.cache[e[f.expando]] : e[f.expando]) && !O(e)
        },
        data: function(e, t, n) {
            return B(e, t, n)
        },
        removeData: function(e, t) {
            return z(e, t)
        },
        _data: function(e, t, n) {
            return B(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return z(e, t, !0)
        }
    }), f.fn.extend({
        data: function(e, t) {
            var n, i, r, o = this[0],
                a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (r = f.data(o), 1 === o.nodeType && !f._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--;) a[n] && 0 === (i = a[n].name).indexOf("data-") && R(o, i = f.camelCase(i.slice(5)), r[i]);
                    f._data(o, "parsedAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function() {
                f.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                f.data(this, e, t)
            }) : o ? R(o, e, f.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                f.removeData(this, e)
            })
        }
    }), f.extend({
        queue: function(e, t, n) {
            var i;
            if (e) return t = (t || "fx") + "queue", i = f._data(e, t), n && (!i || f.isArray(n) ? i = f._data(e, t, f.makeArray(n)) : i.push(n)), i || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = f.queue(e, t),
                i = n.length,
                r = n.shift(),
                o = f._queueHooks(e, t);
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, function() {
                f.dequeue(e, t)
            }, o)), !i && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return f._data(e, n) || f._data(e, n, {
                empty: f.Callbacks("once memory").add(function() {
                    f._removeData(e, t + "queue"), f._removeData(e, n)
                })
            })
        }
    }), f.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? f.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = f.queue(this, e, t);
                f._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && f.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                f.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1,
                r = f.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --i || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = f._data(o[a], e + "queueHooks")) && n.empty && (i++, n.empty.add(s));
            return s(), r.promise(t)
        }
    });
    var I = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        W = ["Top", "Right", "Bottom", "Left"],
        $ = function(e, t) {
            return e = t || e, "none" === f.css(e, "display") || !f.contains(e.ownerDocument, e)
        },
        X = f.access = function(e, t, n, i, r, o, a) {
            var s = 0,
                l = e.length,
                u = null == n;
            if ("object" === f.type(n))
                for (s in r = !0, n) f.access(e, t, s, n[s], !0, o, a);
            else if (void 0 !== i && (r = !0, f.isFunction(i) || (a = !0), u && (a ? (t.call(e, i), t = null) : (u = t, t = function(e, t, n) {
                    return u.call(f(e), n)
                })), t))
                for (; s < l; s++) t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)));
            return r ? e : u ? t.call(e) : l ? t(e[0], n) : o
        },
        V = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = _.createElement("input"),
            t = _.createElement("div"),
            n = _.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c.leadingWhitespace = 3 === t.firstChild.nodeType, c.tbody = !t.getElementsByTagName("tbody").length, c.htmlSerialize = !!t.getElementsByTagName("link").length, c.html5Clone = "<:nav></:nav>" !== _.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), c.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", c.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", c.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, c.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
                c.noCloneEvent = !1
            }), t.cloneNode(!0).click()), null == c.deleteExpando) {
            c.deleteExpando = !0;
            try {
                delete t.test
            } catch (e) {
                c.deleteExpando = !1
            }
        }
    }(),
    function() {
        var t, n, i = _.createElement("div");
        for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            }) n = "on" + t, (c[t + "Bubbles"] = n in e) || (i.setAttribute(n, "t"), c[t + "Bubbles"] = !1 === i.attributes[n].expando);
        i = null
    }();
    var U = /^(?:input|select|textarea)$/i,
        K = /^key/,
        G = /^(?:mouse|pointer|contextmenu)|click/,
        Q = /^(?:focusinfocus|focusoutblur)$/,
        Y = /^([^.]*)(?:\.(.+)|)$/;

    function J() {
        return !0
    }

    function Z() {
        return !1
    }

    function ee() {
        try {
            return _.activeElement
        } catch (e) {}
    }

    function te(e) {
        var t = ne.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }
    f.event = {
        global: {},
        add: function(e, t, n, i, r) {
            var o, a, s, l, u, c, d, p, h, m, g, v = f._data(e);
            if (v) {
                for (n.handler && (n = (l = n).handler, r = l.selector), n.guid || (n.guid = f.guid++), (a = v.events) || (a = v.events = {}), (c = v.handle) || ((c = v.handle = function(e) {
                        return typeof f === H || e && f.event.triggered === e.type ? void 0 : f.event.dispatch.apply(c.elem, arguments)
                    }).elem = e), s = (t = (t || "").match(L) || [""]).length; s--;) h = g = (o = Y.exec(t[s]) || [])[1], m = (o[2] || "").split(".").sort(), h && (u = f.event.special[h] || {}, h = (r ? u.delegateType : u.bindType) || h, u = f.event.special[h] || {}, d = f.extend({
                    type: h,
                    origType: g,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && f.expr.match.needsContext.test(r),
                    namespace: m.join(".")
                }, l), (p = a[h]) || ((p = a[h] = []).delegateCount = 0, u.setup && !1 !== u.setup.call(e, i, m, c) || (e.addEventListener ? e.addEventListener(h, c, !1) : e.attachEvent && e.attachEvent("on" + h, c))), u.add && (u.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), r ? p.splice(p.delegateCount++, 0, d) : p.push(d), f.event.global[h] = !0);
                e = null
            }
        },
        remove: function(e, t, n, i, r) {
            var o, a, s, l, u, c, d, p, h, m, g, v = f.hasData(e) && f._data(e);
            if (v && (c = v.events)) {
                for (u = (t = (t || "").match(L) || [""]).length; u--;)
                    if (h = g = (s = Y.exec(t[u]) || [])[1], m = (s[2] || "").split(".").sort(), h) {
                        for (d = f.event.special[h] || {}, p = c[h = (i ? d.delegateType : d.bindType) || h] || [], s = s[2] && new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = p.length; o--;) a = p[o], !r && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (p.splice(o, 1), a.selector && p.delegateCount--, d.remove && d.remove.call(e, a));
                        l && !p.length && (d.teardown && !1 !== d.teardown.call(e, m, v.handle) || f.removeEvent(e, h, v.handle), delete c[h])
                    } else
                        for (h in c) f.event.remove(e, h + t[u], n, i, !0);
                f.isEmptyObject(c) && (delete v.handle, f._removeData(e, "events"))
            }
        },
        trigger: function(t, n, i, r) {
            var o, a, s, l, c, d, p, h = [i || _],
                m = u.call(t, "type") ? t.type : t,
                g = u.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = d = i = i || _, 3 !== i.nodeType && 8 !== i.nodeType && !Q.test(m + f.event.triggered) && (m.indexOf(".") >= 0 && (m = (g = m.split(".")).shift(), g.sort()), a = m.indexOf(":") < 0 && "on" + m, (t = t[f.expando] ? t : new f.Event(m, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = g.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : f.makeArray(n, [t]), c = f.event.special[m] || {}, r || !c.trigger || !1 !== c.trigger.apply(i, n))) {
                if (!r && !c.noBubble && !f.isWindow(i)) {
                    for (l = c.delegateType || m, Q.test(l + m) || (s = s.parentNode); s; s = s.parentNode) h.push(s), d = s;
                    d === (i.ownerDocument || _) && h.push(d.defaultView || d.parentWindow || e)
                }
                for (p = 0;
                    (s = h[p++]) && !t.isPropagationStopped();) t.type = p > 1 ? l : c.bindType || m, (o = (f._data(s, "events") || {})[t.type] && f._data(s, "handle")) && o.apply(s, n), (o = a && s[a]) && o.apply && f.acceptData(s) && (t.result = o.apply(s, n), !1 === t.result && t.preventDefault());
                if (t.type = m, !r && !t.isDefaultPrevented() && (!c._default || !1 === c._default.apply(h.pop(), n)) && f.acceptData(i) && a && i[m] && !f.isWindow(i)) {
                    (d = i[a]) && (i[a] = null), f.event.triggered = m;
                    try {
                        i[m]()
                    } catch (e) {}
                    f.event.triggered = void 0, d && (i[a] = d)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = f.event.fix(e);
            var t, n, r, o, a, s, l = i.call(arguments),
                u = (f._data(this, "events") || {})[e.type] || [],
                c = f.event.special[e.type] || {};
            if (l[0] = e, e.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, e)) {
                for (s = f.event.handlers.call(this, e, u), t = 0;
                    (o = s[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem, a = 0;
                        (r = o.handlers[a++]) && !e.isImmediatePropagationStopped();) e.namespace_re && !e.namespace_re.test(r.namespace) || (e.handleObj = r, e.data = r.data, void 0 !== (n = ((f.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) && !1 === (e.result = n) && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, i, r, o, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (r = [], o = 0; o < s; o++) void 0 === r[n = (i = t[o]).selector + " "] && (r[n] = i.needsContext ? f(n, this).index(l) >= 0 : f.find(n, this, null, [l]).length), r[n] && r.push(i);
                        r.length && a.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function(e) {
            if (e[f.expando]) return e;
            var t, n, i, r = e.type,
                o = e,
                a = this.fixHooks[r];
            for (a || (this.fixHooks[r] = a = G.test(r) ? this.mouseHooks : K.test(r) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new f.Event(o), t = i.length; t--;) e[n = i[t]] = o[n];
            return e.target || (e.target = o.srcElement || _), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, i, r, o = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (r = (i = e.target.ownerDocument || _).documentElement, n = i.body, e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== ee() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === ee() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (f.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1
                },
                _default: function(e) {
                    return f.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, i) {
            var r = f.extend(new f.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? f.event.trigger(r, null, t) : f.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
        }
    }, f.removeEvent = _.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var i = "on" + t;
        e.detachEvent && (typeof e[i] === H && (e[i] = null), e.detachEvent(i, n))
    }, f.Event = function(e, t) {
        if (!(this instanceof f.Event)) return new f.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? J : Z) : this.type = e, t && f.extend(this, t), this.timeStamp = e && e.timeStamp || f.now(), this[f.expando] = !0
    }, f.Event.prototype = {
        isDefaultPrevented: Z,
        isPropagationStopped: Z,
        isImmediatePropagationStopped: Z,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = J, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = J, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = J, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, f.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        f.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = e.relatedTarget,
                    r = e.handleObj;
                return i && (i === this || f.contains(this, i)) || (e.type = r.origType, n = r.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), c.submitBubbles || (f.event.special.submit = {
        setup: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = f.nodeName(t, "input") || f.nodeName(t, "button") ? t.form : void 0;
                n && !f._data(n, "submitBubbles") && (f.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), f._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && f.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            if (f.nodeName(this, "form")) return !1;
            f.event.remove(this, "._submit")
        }
    }), c.changeBubbles || (f.event.special.change = {
        setup: function() {
            if (U.test(this.nodeName)) return "checkbox" !== this.type && "radio" !== this.type || (f.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), f.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), f.event.simulate("change", this, e, !0)
            })), !1;
            f.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                U.test(t.nodeName) && !f._data(t, "changeBubbles") && (f.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || f.event.simulate("change", this.parentNode, e, !0)
                }), f._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type) return e.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            return f.event.remove(this, "._change"), !U.test(this.nodeName)
        }
    }), c.focusinBubbles || f.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            f.event.simulate(t, e.target, f.event.fix(e), !0)
        };
        f.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this,
                    r = f._data(i, t);
                r || i.addEventListener(e, n, !0), f._data(i, t, (r || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this,
                    r = f._data(i, t) - 1;
                r ? f._data(i, t, r) : (i.removeEventListener(e, n, !0), f._removeData(i, t))
            }
        }
    }), f.fn.extend({
        on: function(e, t, n, i, r) {
            var o, a;
            if ("object" == typeof e) {
                for (o in "string" != typeof t && (n = n || t, t = void 0), e) this.on(o, t, n, e[o], r);
                return this
            }
            if (null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), !1 === i) i = Z;
            else if (!i) return this;
            return 1 === r && (a = i, (i = function(e) {
                return f().off(e), a.apply(this, arguments)
            }).guid = a.guid || (a.guid = f.guid++)), this.each(function() {
                f.event.add(this, e, i, n, t)
            })
        },
        one: function(e, t, n, i) {
            return this.on(e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, f(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Z), this.each(function() {
                f.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                f.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) return f.event.trigger(e, t, n, !0)
        }
    });
    var ne = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        ie = / jQuery\d+="(?:null|\d+)"/g,
        re = new RegExp("<(?:" + ne + ")[\\s/>]", "i"),
        oe = /^\s+/,
        ae = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        se = /<([\w:]+)/,
        le = /<tbody/i,
        ue = /<|&#?\w+;/,
        ce = /<(?:script|style|link)/i,
        de = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fe = /^$|\/(?:java|ecma)script/i,
        pe = /^true\/(.*)/,
        he = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        me = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: c.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        ge = te(_).appendChild(_.createElement("div"));

    function ve(e, t) {
        var n, i, r = 0,
            o = typeof e.getElementsByTagName !== H ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== H ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (i = n[r]); r++) !t || f.nodeName(i, t) ? o.push(i) : f.merge(o, ve(i, t));
        return void 0 === t || t && f.nodeName(e, t) ? f.merge([e], o) : o
    }

    function ye(e) {
        V.test(e.type) && (e.defaultChecked = e.checked)
    }

    function be(e, t) {
        return f.nodeName(e, "table") && f.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function xe(e) {
        return e.type = (null !== f.find.attr(e, "type")) + "/" + e.type, e
    }

    function we(e) {
        var t = pe.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function Ce(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++) f._data(n, "globalEval", !t || f._data(t[i], "globalEval"))
    }

    function ke(e, t) {
        if (1 === t.nodeType && f.hasData(e)) {
            var n, i, r, o = f._data(e),
                a = f._data(t, o),
                s = o.events;
            if (s)
                for (n in delete a.handle, a.events = {}, s)
                    for (i = 0, r = s[n].length; i < r; i++) f.event.add(t, n, s[n][i]);
            a.data && (a.data = f.extend({}, a.data))
        }
    }

    function _e(e, t) {
        var n, i, r;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !c.noCloneEvent && t[f.expando]) {
                for (i in (r = f._data(t)).events) f.removeEvent(t, i, r.handle);
                t.removeAttribute(f.expando)
            }
            "script" === n && t.text !== e.text ? (xe(t).text = e.text, we(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), c.html5Clone && e.innerHTML && !f.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && V.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }
    }
    me.optgroup = me.option, me.tbody = me.tfoot = me.colgroup = me.caption = me.thead, me.th = me.td, f.extend({
        clone: function(e, t, n) {
            var i, r, o, a, s, l = f.contains(e.ownerDocument, e);
            if (c.html5Clone || f.isXMLDoc(e) || !re.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (ge.innerHTML = e.outerHTML, ge.removeChild(o = ge.firstChild)), !(c.noCloneEvent && c.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || f.isXMLDoc(e)))
                for (i = ve(o), s = ve(e), a = 0; null != (r = s[a]); ++a) i[a] && _e(r, i[a]);
            if (t)
                if (n)
                    for (s = s || ve(e), i = i || ve(o), a = 0; null != (r = s[a]); a++) ke(r, i[a]);
                else ke(e, o);
            return (i = ve(o, "script")).length > 0 && Ce(i, !l && ve(e, "script")), i = s = r = null, o
        },
        buildFragment: function(e, t, n, i) {
            for (var r, o, a, s, l, u, d, p = e.length, h = te(t), m = [], g = 0; g < p; g++)
                if ((o = e[g]) || 0 === o)
                    if ("object" === f.type(o)) f.merge(m, o.nodeType ? [o] : o);
                    else if (ue.test(o)) {
                for (s = s || h.appendChild(t.createElement("div")), l = (se.exec(o) || ["", ""])[1].toLowerCase(), d = me[l] || me._default, s.innerHTML = d[1] + o.replace(ae, "<$1></$2>") + d[2], r = d[0]; r--;) s = s.lastChild;
                if (!c.leadingWhitespace && oe.test(o) && m.push(t.createTextNode(oe.exec(o)[0])), !c.tbody)
                    for (r = (o = "table" !== l || le.test(o) ? "<table>" !== d[1] || le.test(o) ? 0 : s : s.firstChild) && o.childNodes.length; r--;) f.nodeName(u = o.childNodes[r], "tbody") && !u.childNodes.length && o.removeChild(u);
                for (f.merge(m, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                s = h.lastChild
            } else m.push(t.createTextNode(o));
            for (s && h.removeChild(s), c.appendChecked || f.grep(ve(m, "input"), ye), g = 0; o = m[g++];)
                if ((!i || -1 === f.inArray(o, i)) && (a = f.contains(o.ownerDocument, o), s = ve(h.appendChild(o), "script"), a && Ce(s), n))
                    for (r = 0; o = s[r++];) fe.test(o.type || "") && n.push(o);
            return s = null, h
        },
        cleanData: function(e, t) {
            for (var i, r, o, a, s = 0, l = f.expando, u = f.cache, d = c.deleteExpando, p = f.event.special; null != (i = e[s]); s++)
                if ((t || f.acceptData(i)) && (a = (o = i[l]) && u[o])) {
                    if (a.events)
                        for (r in a.events) p[r] ? f.event.remove(i, r) : f.removeEvent(i, r, a.handle);
                    u[o] && (delete u[o], d ? delete i[l] : typeof i.removeAttribute !== H ? i.removeAttribute(l) : i[l] = null, n.push(o))
                }
        }
    }), f.fn.extend({
        text: function(e) {
            return X(this, function(e) {
                return void 0 === e ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || _).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || be(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = be(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, i = e ? f.filter(e, this) : this, r = 0; null != (n = i[r]); r++) t || 1 !== n.nodeType || f.cleanData(ve(n)), n.parentNode && (t && f.contains(n.ownerDocument, n) && Ce(ve(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && f.cleanData(ve(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && f.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return f.clone(this, e, t)
            })
        },
        html: function(e) {
            return X(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(ie, "") : void 0;
                if ("string" == typeof e && !ce.test(e) && (c.htmlSerialize || !re.test(e)) && (c.leadingWhitespace || !oe.test(e)) && !me[(se.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(ae, "<$1></$2>");
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (f.cleanData(ve(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, f.cleanData(ve(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = r.apply([], e);
            var n, i, o, a, s, l, u = 0,
                d = this.length,
                p = this,
                h = d - 1,
                m = e[0],
                g = f.isFunction(m);
            if (g || d > 1 && "string" == typeof m && !c.checkClone && de.test(m)) return this.each(function(n) {
                var i = p.eq(n);
                g && (e[0] = m.call(this, n, i.html())), i.domManip(e, t)
            });
            if (d && (n = (l = f.buildFragment(e, this[0].ownerDocument, !1, this)).firstChild, 1 === l.childNodes.length && (l = n), n)) {
                for (o = (a = f.map(ve(l, "script"), xe)).length; u < d; u++) i = l, u !== h && (i = f.clone(i, !0, !0), o && f.merge(a, ve(i, "script"))), t.call(this[u], i, u);
                if (o)
                    for (s = a[a.length - 1].ownerDocument, f.map(a, we), u = 0; u < o; u++) i = a[u], fe.test(i.type || "") && !f._data(i, "globalEval") && f.contains(s, i) && (i.src ? f._evalUrl && f._evalUrl(i.src) : f.globalEval((i.text || i.textContent || i.innerHTML || "").replace(he, "")));
                l = n = null
            }
            return this
        }
    }), f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        f.fn[e] = function(e) {
            for (var n, i = 0, r = [], a = f(e), s = a.length - 1; i <= s; i++) n = i === s ? this : this.clone(!0), f(a[i])[t](n), o.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var Te, Ee, Ne = {};

    function Se(t, n) {
        var i, r = f(n.createElement(t)).appendTo(n.body),
            o = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(r[0])) ? i.display : f.css(r[0], "display");
        return r.detach(), o
    }

    function Ae(e) {
        var t = _,
            n = Ne[e];
        return n || ("none" !== (n = Se(e, t)) && n || ((t = ((Te = (Te || f("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow || Te[0].contentDocument).document).write(), t.close(), n = Se(e, t), Te.detach()), Ne[e] = n), n
    }
    c.shrinkWrapBlocks = function() {
        return null != Ee ? Ee : (Ee = !1, (t = _.getElementsByTagName("body")[0]) && t.style ? (e = _.createElement("div"), (n = _.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", t.appendChild(n).appendChild(e), typeof e.style.zoom !== H && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(_.createElement("div")).style.width = "5px", Ee = 3 !== e.offsetWidth), t.removeChild(n), Ee) : void 0);
        var e, t, n
    };
    var Le, je, qe = /^margin/,
        De = new RegExp("^(" + I + ")(?!px)[a-z%]+$", "i"),
        Me = /^(top|right|bottom|left)$/;

    function He(e, t) {
        return {
            get: function() {
                var n = e();
                if (null != n) {
                    if (!n) return (this.get = t).apply(this, arguments);
                    delete this.get
                }
            }
        }
    }
    e.getComputedStyle ? (Le = function(e) {
            return e.ownerDocument.defaultView.getComputedStyle(e, null)
        }, je = function(e, t, n) {
            var i, r, o, a, s = e.style;
            return a = (n = n || Le(e)) ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== a || f.contains(e.ownerDocument, e) || (a = f.style(e, t)), De.test(a) && qe.test(t) && (i = s.width, r = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = i, s.minWidth = r, s.maxWidth = o)), void 0 === a ? a : a + ""
        }) : _.documentElement.currentStyle && (Le = function(e) {
            return e.currentStyle
        }, je = function(e, t, n) {
            var i, r, o, a, s = e.style;
            return null == (a = (n = n || Le(e)) ? n[t] : void 0) && s && s[t] && (a = s[t]), De.test(a) && !Me.test(t) && (i = s.left, (o = (r = e.runtimeStyle) && r.left) && (r.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = i, o && (r.left = o)), void 0 === a ? a : a + "" || "auto"
        }),
        function() {
            var t, n, i, r, o, a, s;

            function l() {
                var t, n, i, l;
                (n = _.getElementsByTagName("body")[0]) && n.style && (t = _.createElement("div"), (i = _.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", r = o = !1, s = !0, e.getComputedStyle && (r = "1%" !== (e.getComputedStyle(t, null) || {}).top, o = "4px" === (e.getComputedStyle(t, null) || {
                    width: "4px"
                }).width, (l = t.appendChild(_.createElement("div"))).style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", l.style.marginRight = l.style.width = "0", t.style.width = "1px", s = !parseFloat((e.getComputedStyle(l, null) || {}).marginRight)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (l = t.getElementsByTagName("td"))[0].style.cssText = "margin:0;border:0;padding:0;display:none", (a = 0 === l[0].offsetHeight) && (l[0].style.display = "", l[1].style.display = "none", a = 0 === l[0].offsetHeight), n.removeChild(i))
            }(t = _.createElement("div")).innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", (n = (i = t.getElementsByTagName("a")[0]) && i.style) && (n.cssText = "float:left;opacity:.5", c.opacity = "0.5" === n.opacity, c.cssFloat = !!n.cssFloat, t.style.backgroundClip = "content-box", t.cloneNode(!0).style.backgroundClip = "", c.clearCloneStyle = "content-box" === t.style.backgroundClip, c.boxSizing = "" === n.boxSizing || "" === n.MozBoxSizing || "" === n.WebkitBoxSizing, f.extend(c, {
                reliableHiddenOffsets: function() {
                    return null == a && l(), a
                },
                boxSizingReliable: function() {
                    return null == o && l(), o
                },
                pixelPosition: function() {
                    return null == r && l(), r
                },
                reliableMarginRight: function() {
                    return null == s && l(), s
                }
            }))
        }(), f.swap = function(e, t, n, i) {
            var r, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            for (o in r = n.apply(e, i || []), t) e.style[o] = a[o];
            return r
        };
    var Fe = /alpha\([^)]*\)/i,
        Pe = /opacity\s*=\s*([^)]*)/,
        Re = /^(none|table(?!-c[ea]).+)/,
        Oe = new RegExp("^(" + I + ")(.*)$", "i"),
        Be = new RegExp("^([+-])=(" + I + ")", "i"),
        ze = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Ie = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        We = ["Webkit", "O", "Moz", "ms"];

    function $e(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, r = We.length; r--;)
            if ((t = We[r] + n) in e) return t;
        return i
    }

    function Xe(e, t) {
        for (var n, i, r, o = [], a = 0, s = e.length; a < s; a++)(i = e[a]).style && (o[a] = f._data(i, "olddisplay"), n = i.style.display, t ? (o[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && $(i) && (o[a] = f._data(i, "olddisplay", Ae(i.nodeName)))) : (r = $(i), (n && "none" !== n || !r) && f._data(i, "olddisplay", r ? n : f.css(i, "display"))));
        for (a = 0; a < s; a++)(i = e[a]).style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? o[a] || "" : "none"));
        return e
    }

    function Ve(e, t, n) {
        var i = Oe.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }

    function Ue(e, t, n, i, r) {
        for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; o < 4; o += 2) "margin" === n && (a += f.css(e, n + W[o], !0, r)), i ? ("content" === n && (a -= f.css(e, "padding" + W[o], !0, r)), "margin" !== n && (a -= f.css(e, "border" + W[o] + "Width", !0, r))) : (a += f.css(e, "padding" + W[o], !0, r), "padding" !== n && (a += f.css(e, "border" + W[o] + "Width", !0, r)));
        return a
    }

    function Ke(e, t, n) {
        var i = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = Le(e),
            a = c.boxSizing && "border-box" === f.css(e, "boxSizing", !1, o);
        if (r <= 0 || null == r) {
            if (((r = je(e, t, o)) < 0 || null == r) && (r = e.style[t]), De.test(r)) return r;
            i = a && (c.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + Ue(e, t, n || (a ? "border" : "content"), i, o) + "px"
    }

    function Ge(e, t, n, i, r) {
        return new Ge.prototype.init(e, t, n, i, r)
    }
    f.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = je(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: c.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, a, s = f.camelCase(t),
                    l = e.style;
                if (t = f.cssProps[s] || (f.cssProps[s] = $e(l, s)), a = f.cssHooks[t] || f.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (r = a.get(e, !1, i)) ? r : l[t];
                if ("string" == (o = typeof n) && (r = Be.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(f.css(e, t)), o = "number"), null != n && n == n && ("number" !== o || f.cssNumber[s] || (n += "px"), c.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && void 0 === (n = a.set(e, n, i))))) try {
                    l[t] = n
                } catch (e) {}
            }
        },
        css: function(e, t, n, i) {
            var r, o, a, s = f.camelCase(t);
            return t = f.cssProps[s] || (f.cssProps[s] = $e(e.style, s)), (a = f.cssHooks[t] || f.cssHooks[s]) && "get" in a && (o = a.get(e, !0, n)), void 0 === o && (o = je(e, t, i)), "normal" === o && t in Ie && (o = Ie[t]), "" === n || n ? (r = parseFloat(o), !0 === n || f.isNumeric(r) ? r || 0 : o) : o
        }
    }), f.each(["height", "width"], function(e, t) {
        f.cssHooks[t] = {
            get: function(e, n, i) {
                if (n) return Re.test(f.css(e, "display")) && 0 === e.offsetWidth ? f.swap(e, ze, function() {
                    return Ke(e, t, i)
                }) : Ke(e, t, i)
            },
            set: function(e, n, i) {
                var r = i && Le(e);
                return Ve(0, n, i ? Ue(e, t, i, c.boxSizing && "border-box" === f.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }), c.opacity || (f.cssHooks.opacity = {
        get: function(e, t) {
            return Pe.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                i = e.currentStyle,
                r = f.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = i && i.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === f.trim(o.replace(Fe, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = Fe.test(o) ? o.replace(Fe, r) : o + " " + r)
        }
    }), f.cssHooks.marginRight = He(c.reliableMarginRight, function(e, t) {
        if (t) return f.swap(e, {
            display: "inline-block"
        }, je, [e, "marginRight"])
    }), f.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        f.cssHooks[e + t] = {
            expand: function(n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + W[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        }, qe.test(e) || (f.cssHooks[e + t].set = Ve)
    }), f.fn.extend({
        css: function(e, t) {
            return X(this, function(e, t, n) {
                var i, r, o = {},
                    a = 0;
                if (f.isArray(t)) {
                    for (i = Le(e), r = t.length; a < r; a++) o[t[a]] = f.css(e, t[a], !1, i);
                    return o
                }
                return void 0 !== n ? f.style(e, t, n) : f.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return Xe(this, !0)
        },
        hide: function() {
            return Xe(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                $(this) ? f(this).show() : f(this).hide()
            })
        }
    }), f.Tween = Ge, Ge.prototype = {
        constructor: Ge,
        init: function(e, t, n, i, r, o) {
            this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (f.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = Ge.propHooks[this.prop];
            return e && e.get ? e.get(this) : Ge.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = Ge.propHooks[this.prop];
            return this.options.duration ? this.pos = t = f.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Ge.propHooks._default.set(this), this
        }
    }, Ge.prototype.init.prototype = Ge.prototype, Ge.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = f.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0 : e.elem[e.prop]
            },
            set: function(e) {
                f.fx.step[e.prop] ? f.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[f.cssProps[e.prop]] || f.cssHooks[e.prop]) ? f.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, Ge.propHooks.scrollTop = Ge.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, f.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, f.fx = Ge.prototype.init, f.fx.step = {};
    var Qe, Ye, Je, Ze, et, tt, nt, it = /^(?:toggle|show|hide)$/,
        rt = new RegExp("^(?:([+-])=|)(" + I + ")([a-z%]*)$", "i"),
        ot = /queueHooks$/,
        at = [function(e, t, n) {
            var i, r, o, a, s, l, u, d = this,
                p = {},
                h = e.style,
                m = e.nodeType && $(e),
                g = f._data(e, "fxshow");
            for (i in n.queue || (null == (s = f._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || l()
                }), s.unqueued++, d.always(function() {
                    d.always(function() {
                        s.unqueued--, f.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY], "inline" === ("none" === (u = f.css(e, "display")) ? f._data(e, "olddisplay") || Ae(e.nodeName) : u) && "none" === f.css(e, "float") && (c.inlineBlockNeedsLayout && "inline" !== Ae(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")), n.overflow && (h.overflow = "hidden", c.shrinkWrapBlocks() || d.always(function() {
                    h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                })), t)
                if (r = t[i], it.exec(r)) {
                    if (delete t[i], o = o || "toggle" === r, r === (m ? "hide" : "show")) {
                        if ("show" !== r || !g || void 0 === g[i]) continue;
                        m = !0
                    }
                    p[i] = g && g[i] || f.style(e, i)
                } else u = void 0;
            if (f.isEmptyObject(p)) "inline" === ("none" === u ? Ae(e.nodeName) : u) && (h.display = u);
            else
                for (i in g ? "hidden" in g && (m = g.hidden) : g = f._data(e, "fxshow", {}), o && (g.hidden = !m), m ? f(e).show() : d.done(function() {
                        f(e).hide()
                    }), d.done(function() {
                        var t;
                        for (t in f._removeData(e, "fxshow"), p) f.style(e, t, p[t])
                    }), p) a = ct(m ? g[i] : 0, i, d), i in g || (g[i] = a.start, m && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
        }],
        st = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    i = n.cur(),
                    r = rt.exec(t),
                    o = r && r[3] || (f.cssNumber[e] ? "" : "px"),
                    a = (f.cssNumber[e] || "px" !== o && +i) && rt.exec(f.css(n.elem, e)),
                    s = 1,
                    l = 20;
                if (a && a[3] !== o) {
                    o = o || a[3], r = r || [], a = +i || 1;
                    do {
                        a /= s = s || ".5", f.style(n.elem, e, a + o)
                    } while (s !== (s = n.cur() / i) && 1 !== s && --l)
                }
                return r && (a = n.start = +a || +i || 0, n.unit = o, n.end = r[1] ? a + (r[1] + 1) * r[2] : +r[2]), n
            }]
        };

    function lt() {
        return setTimeout(function() {
            Qe = void 0
        }), Qe = f.now()
    }

    function ut(e, t) {
        var n, i = {
                height: e
            },
            r = 0;
        for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = W[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function ct(e, t, n) {
        for (var i, r = (st[t] || []).concat(st["*"]), o = 0, a = r.length; o < a; o++)
            if (i = r[o].call(n, t, e)) return i
    }

    function dt(e, t, n) {
        var i, r, o = 0,
            a = at.length,
            s = f.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (r) return !1;
                for (var t = Qe || lt(), n = Math.max(0, u.startTime + u.duration - t), i = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(i);
                return s.notifyWith(e, [u, i, n]), i < 1 && a ? n : (s.resolveWith(e, [u]), !1)
            },
            u = s.promise({
                elem: e,
                props: f.extend({}, t),
                opts: f.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Qe || lt(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var i = f.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(i), i
                },
                stop: function(t) {
                    var n = 0,
                        i = t ? u.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; n < i; n++) u.tweens[n].run(1);
                    return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (function(e, t) {
                var n, i, r, o, a;
                for (n in e)
                    if (r = t[i = f.camelCase(n)], o = e[n], f.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (a = f.cssHooks[i]) && "expand" in a)
                        for (n in o = a.expand(o), delete e[i], o) n in e || (e[n] = o[n], t[n] = r);
                    else t[i] = r
            }(c, u.opts.specialEasing); o < a; o++)
            if (i = at[o].call(u, e, c, u.opts)) return i;
        return f.map(c, ct, u), f.isFunction(u.opts.start) && u.opts.start.call(e, u), f.fx.timer(f.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }
    f.Animation = f.extend(dt, {
        tweener: function(e, t) {
            f.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            for (var n, i = 0, r = e.length; i < r; i++) n = e[i], st[n] = st[n] || [], st[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? at.unshift(e) : at.push(e)
        }
    }), f.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? f.extend({}, e) : {
            complete: n || !n && t || f.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !f.isFunction(t) && t
        };
        return i.duration = f.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in f.fx.speeds ? f.fx.speeds[i.duration] : f.fx.speeds._default, null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
            f.isFunction(i.old) && i.old.call(this), i.queue && f.dequeue(this, i.queue)
        }, i
    }, f.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter($).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(e, t, n, i) {
            var r = f.isEmptyObject(e),
                o = f.speed(t, n, i),
                a = function() {
                    var t = dt(this, f.extend({}, e), o);
                    (r || f._data(this, "finish")) && t.stop(!0)
                };
            return a.finish = a, r || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(e, t, n) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    r = null != e && e + "queueHooks",
                    o = f.timers,
                    a = f._data(this);
                if (r) a[r] && a[r].stop && i(a[r]);
                else
                    for (r in a) a[r] && a[r].stop && ot.test(r) && i(a[r]);
                for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                !t && n || f.dequeue(this, e)
            })
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"), this.each(function() {
                var t, n = f._data(this),
                    i = n[e + "queue"],
                    r = n[e + "queueHooks"],
                    o = f.timers,
                    a = i ? i.length : 0;
                for (n.finish = !0, f.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; t < a; t++) i[t] && i[t].finish && i[t].finish.call(this);
                delete n.finish
            })
        }
    }), f.each(["toggle", "show", "hide"], function(e, t) {
        var n = f.fn[t];
        f.fn[t] = function(e, i, r) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ut(t, !0), e, i, r)
        }
    }), f.each({
        slideDown: ut("show"),
        slideUp: ut("hide"),
        slideToggle: ut("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        f.fn[e] = function(e, n, i) {
            return this.animate(t, e, n, i)
        }
    }), f.timers = [], f.fx.tick = function() {
        var e, t = f.timers,
            n = 0;
        for (Qe = f.now(); n < t.length; n++)(e = t[n])() || t[n] !== e || t.splice(n--, 1);
        t.length || f.fx.stop(), Qe = void 0
    }, f.fx.timer = function(e) {
        f.timers.push(e), e() ? f.fx.start() : f.timers.pop()
    }, f.fx.interval = 13, f.fx.start = function() {
        Ye || (Ye = setInterval(f.fx.tick, f.fx.interval))
    }, f.fx.stop = function() {
        clearInterval(Ye), Ye = null
    }, f.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, f.fn.delay = function(e, t) {
        return e = f.fx && f.fx.speeds[e] || e, t = t || "fx", this.queue(t, function(t, n) {
            var i = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(i)
            }
        })
    }, (Ze = _.createElement("div")).setAttribute("className", "t"), Ze.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", tt = Ze.getElementsByTagName("a")[0], nt = (et = _.createElement("select")).appendChild(_.createElement("option")), Je = Ze.getElementsByTagName("input")[0], tt.style.cssText = "top:1px", c.getSetAttribute = "t" !== Ze.className, c.style = /top/.test(tt.getAttribute("style")), c.hrefNormalized = "/a" === tt.getAttribute("href"), c.checkOn = !!Je.value, c.optSelected = nt.selected, c.enctype = !!_.createElement("form").enctype, et.disabled = !0, c.optDisabled = !nt.disabled, (Je = _.createElement("input")).setAttribute("value", ""), c.input = "" === Je.getAttribute("value"), Je.value = "t", Je.setAttribute("type", "radio"), c.radioValue = "t" === Je.value;
    var ft = /\r/g;
    f.fn.extend({
        val: function(e) {
            var t, n, i, r = this[0];
            return arguments.length ? (i = f.isFunction(e), this.each(function(n) {
                var r;
                1 === this.nodeType && (null == (r = i ? e.call(this, n, f(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : f.isArray(r) && (r = f.map(r, function(e) {
                    return null == e ? "" : e + ""
                })), (t = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
            })) : r ? (t = f.valHooks[r.type] || f.valHooks[r.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : "string" == typeof(n = r.value) ? n.replace(ft, "") : null == n ? "" : n : void 0
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = f.find.attr(e, "value");
                    return null != t ? t : f.trim(f.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || r < 0, a = o ? null : [], s = o ? r + 1 : i.length, l = r < 0 ? s : o ? r : 0; l < s; l++)
                        if (((n = i[l]).selected || l === r) && (c.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !f.nodeName(n.parentNode, "optgroup"))) {
                            if (t = f(n).val(), o) return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var n, i, r = e.options, o = f.makeArray(t), a = r.length; a--;)
                        if (i = r[a], f.inArray(f.valHooks.option.get(i), o) >= 0) try {
                            i.selected = n = !0
                        } catch (e) {
                            i.scrollHeight
                        } else i.selected = !1;
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = {
            set: function(e, t) {
                if (f.isArray(t)) return e.checked = f.inArray(f(e).val(), t) >= 0
            }
        }, c.checkOn || (f.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var pt, ht, mt = f.expr.attrHandle,
        gt = /^(?:checked|selected)$/i,
        vt = c.getSetAttribute,
        yt = c.input;
    f.fn.extend({
        attr: function(e, t) {
            return X(this, f.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                f.removeAttr(this, e)
            })
        }
    }), f.extend({
        attr: function(e, t, n) {
            var i, r, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === H ? f.prop(e, t, n) : (1 === o && f.isXMLDoc(e) || (t = t.toLowerCase(), i = f.attrHooks[t] || (f.expr.match.bool.test(t) ? ht : pt)), void 0 === n ? i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = f.find.attr(e, t)) ? void 0 : r : null !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : void f.removeAttr(e, t))
        },
        removeAttr: function(e, t) {
            var n, i, r = 0,
                o = t && t.match(L);
            if (o && 1 === e.nodeType)
                for (; n = o[r++];) i = f.propFix[n] || n, f.expr.match.bool.test(n) ? yt && vt || !gt.test(n) ? e[i] = !1 : e[f.camelCase("default-" + n)] = e[i] = !1 : f.attr(e, n, ""), e.removeAttribute(vt ? n : i)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!c.radioValue && "radio" === t && f.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), ht = {
        set: function(e, t, n) {
            return !1 === t ? f.removeAttr(e, n) : yt && vt || !gt.test(n) ? e.setAttribute(!vt && f.propFix[n] || n, n) : e[f.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, f.each(f.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = mt[t] || f.find.attr;
        mt[t] = yt && vt || !gt.test(t) ? function(e, t, i) {
            var r, o;
            return i || (o = mt[t], mt[t] = r, r = null != n(e, t, i) ? t.toLowerCase() : null, mt[t] = o), r
        } : function(e, t, n) {
            if (!n) return e[f.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), yt && vt || (f.attrHooks.value = {
        set: function(e, t, n) {
            if (!f.nodeName(e, "input")) return pt && pt.set(e, t, n);
            e.defaultValue = t
        }
    }), vt || (pt = {
        set: function(e, t, n) {
            var i = e.getAttributeNode(n);
            if (i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)), i.value = t += "", "value" === n || t === e.getAttribute(n)) return t
        }
    }, mt.id = mt.name = mt.coords = function(e, t, n) {
        var i;
        if (!n) return (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
    }, f.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            if (n && n.specified) return n.value
        },
        set: pt.set
    }, f.attrHooks.contenteditable = {
        set: function(e, t, n) {
            pt.set(e, "" !== t && t, n)
        }
    }, f.each(["width", "height"], function(e, t) {
        f.attrHooks[t] = {
            set: function(e, n) {
                if ("" === n) return e.setAttribute(t, "auto"), n
            }
        }
    })), c.style || (f.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var bt = /^(?:input|select|textarea|button|object)$/i,
        xt = /^(?:a|area)$/i;
    f.fn.extend({
        prop: function(e, t) {
            return X(this, f.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = f.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (e) {}
            })
        }
    }), f.extend({
        propFix: {
            for: "htmlFor",
            class: "className"
        },
        prop: function(e, t, n) {
            var i, r, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o) return (1 !== o || !f.isXMLDoc(e)) && (t = f.propFix[t] || t, r = f.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = f.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : bt.test(e.nodeName) || xt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), c.hrefNormalized || f.each(["href", "src"], function(e, t) {
        f.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), c.optSelected || (f.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), f.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        f.propFix[this.toLowerCase()] = this
    }), c.enctype || (f.propFix.enctype = "encoding");
    var wt = /[\t\r\n\f]/g;
    f.fn.extend({
        addClass: function(e) {
            var t, n, i, r, o, a, s = 0,
                l = this.length,
                u = "string" == typeof e && e;
            if (f.isFunction(e)) return this.each(function(t) {
                f(this).addClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(L) || []; s < l; s++)
                    if (i = 1 === (n = this[s]).nodeType && (n.className ? (" " + n.className + " ").replace(wt, " ") : " ")) {
                        for (o = 0; r = t[o++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                        a = f.trim(i), n.className !== a && (n.className = a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, i, r, o, a, s = 0,
                l = this.length,
                u = 0 === arguments.length || "string" == typeof e && e;
            if (f.isFunction(e)) return this.each(function(t) {
                f(this).removeClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(L) || []; s < l; s++)
                    if (i = 1 === (n = this[s]).nodeType && (n.className ? (" " + n.className + " ").replace(wt, " ") : "")) {
                        for (o = 0; r = t[o++];)
                            for (; i.indexOf(" " + r + " ") >= 0;) i = i.replace(" " + r + " ", " ");
                        a = e ? f.trim(i) : "", n.className !== a && (n.className = a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : f.isFunction(e) ? this.each(function(n) {
                f(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function() {
                if ("string" === n)
                    for (var t, i = 0, r = f(this), o = e.match(L) || []; t = o[i++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else n !== H && "boolean" !== n || (this.className && f._data(this, "__className__", this.className), this.className = this.className || !1 === e ? "" : f._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, i = this.length; n < i; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(wt, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        f.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), f.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var Ct = f.now(),
        kt = /\?/,
        _t = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    f.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, i = null,
            r = f.trim(t + "");
        return r && !f.trim(r.replace(_t, function(e, t, r, o) {
            return n && t && (i = 0), 0 === i ? e : (n = r || t, i += !o - !r, "")
        })) ? Function("return " + r)() : f.error("Invalid JSON: " + t)
    }, f.parseXML = function(t) {
        var n;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? n = (new DOMParser).parseFromString(t, "text/xml") : ((n = new ActiveXObject("Microsoft.XMLDOM")).async = "false", n.loadXML(t))
        } catch (e) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || f.error("Invalid XML: " + t), n
    };
    var Tt, Et, Nt = /#.*$/,
        St = /([?&])_=[^&]*/,
        At = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Lt = /^(?:GET|HEAD)$/,
        jt = /^\/\//,
        qt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Dt = {},
        Mt = {},
        Ht = "*/".concat("*");
    try {
        Et = location.href
    } catch (e) {
        (Et = _.createElement("a")).href = "", Et = Et.href
    }

    function Ft(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, r = 0,
                o = t.toLowerCase().match(L) || [];
            if (f.isFunction(n))
                for (; i = o[r++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }

    function Pt(e, t, n, i) {
        var r = {},
            o = e === Mt;

        function a(s) {
            var l;
            return r[s] = !0, f.each(e[s] || [], function(e, s) {
                var u = s(t, n, i);
                return "string" != typeof u || o || r[u] ? o ? !(l = u) : void 0 : (t.dataTypes.unshift(u), a(u), !1)
            }), l
        }
        return a(t.dataTypes[0]) || !r["*"] && a("*")
    }

    function Rt(e, t) {
        var n, i, r = f.ajaxSettings.flatOptions || {};
        for (i in t) void 0 !== t[i] && ((r[i] ? e : n || (n = {}))[i] = t[i]);
        return n && f.extend(!0, e, n), e
    }
    Tt = qt.exec(Et.toLowerCase()) || [], f.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Et,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Ht,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Rt(Rt(e, f.ajaxSettings), t) : Rt(f.ajaxSettings, e)
        },
        ajaxPrefilter: Ft(Dt),
        ajaxTransport: Ft(Mt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var n, i, r, o, a, s, l, u, c = f.ajaxSetup({}, t),
                d = c.context || c,
                p = c.context && (d.nodeType || d.jquery) ? f(d) : f.event,
                h = f.Deferred(),
                m = f.Callbacks("once memory"),
                g = c.statusCode || {},
                v = {},
                y = {},
                b = 0,
                x = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === b) {
                            if (!u)
                                for (u = {}; t = At.exec(o);) u[t[1].toLowerCase()] = t[2];
                            t = u[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === b ? o : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return b || (e = y[n] = y[n] || e, v[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return b || (c.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (b < 2)
                                for (t in e) g[t] = [g[t], e[t]];
                            else w.always(e[w.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || x;
                        return l && l.abort(t), C(0, t), this
                    }
                };
            if (h.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, c.url = ((e || c.url || Et) + "").replace(Nt, "").replace(jt, Tt[1] + "//"), c.type = t.method || t.type || c.method || c.type, c.dataTypes = f.trim(c.dataType || "*").toLowerCase().match(L) || [""], null == c.crossDomain && (n = qt.exec(c.url.toLowerCase()), c.crossDomain = !(!n || n[1] === Tt[1] && n[2] === Tt[2] && (n[3] || ("http:" === n[1] ? "80" : "443")) === (Tt[3] || ("http:" === Tt[1] ? "80" : "443")))), c.data && c.processData && "string" != typeof c.data && (c.data = f.param(c.data, c.traditional)), Pt(Dt, c, t, w), 2 === b) return w;
            for (i in (s = c.global) && 0 == f.active++ && f.event.trigger("ajaxStart"), c.type = c.type.toUpperCase(), c.hasContent = !Lt.test(c.type), r = c.url, c.hasContent || (c.data && (r = c.url += (kt.test(r) ? "&" : "?") + c.data, delete c.data), !1 === c.cache && (c.url = St.test(r) ? r.replace(St, "$1_=" + Ct++) : r + (kt.test(r) ? "&" : "?") + "_=" + Ct++)), c.ifModified && (f.lastModified[r] && w.setRequestHeader("If-Modified-Since", f.lastModified[r]), f.etag[r] && w.setRequestHeader("If-None-Match", f.etag[r])), (c.data && c.hasContent && !1 !== c.contentType || t.contentType) && w.setRequestHeader("Content-Type", c.contentType), w.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + ("*" !== c.dataTypes[0] ? ", " + Ht + "; q=0.01" : "") : c.accepts["*"]), c.headers) w.setRequestHeader(i, c.headers[i]);
            if (c.beforeSend && (!1 === c.beforeSend.call(d, w, c) || 2 === b)) return w.abort();
            for (i in x = "abort", {
                    success: 1,
                    error: 1,
                    complete: 1
                }) w[i](c[i]);
            if (l = Pt(Mt, c, t, w)) {
                w.readyState = 1, s && p.trigger("ajaxSend", [w, c]), c.async && c.timeout > 0 && (a = setTimeout(function() {
                    w.abort("timeout")
                }, c.timeout));
                try {
                    b = 1, l.send(v, C)
                } catch (e) {
                    if (!(b < 2)) throw e;
                    C(-1, e)
                }
            } else C(-1, "No Transport");

            function C(e, t, n, i) {
                var u, v, y, x, C, k = t;
                2 !== b && (b = 2, a && clearTimeout(a), l = void 0, o = i || "", w.readyState = e > 0 ? 4 : 0, u = e >= 200 && e < 300 || 304 === e, n && (x = function(e, t, n) {
                    for (var i, r, o, a, s = e.contents, l = e.dataTypes;
                        "*" === l[0];) l.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (a in s)
                            if (s[a] && s[a].test(r)) {
                                l.unshift(a);
                                break
                            }
                    if (l[0] in n) o = l[0];
                    else {
                        for (a in n) {
                            if (!l[0] || e.converters[a + " " + l[0]]) {
                                o = a;
                                break
                            }
                            i || (i = a)
                        }
                        o = o || i
                    }
                    if (o) return o !== l[0] && l.unshift(o), n[o]
                }(c, w, n)), x = function(e, t, n, i) {
                    var r, o, a, s, l, u = {},
                        c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
                    for (o = c.shift(); o;)
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                            if ("*" === o) o = l;
                            else if ("*" !== l && l !== o) {
                        if (!(a = u[l + " " + o] || u["* " + o]))
                            for (r in u)
                                if ((s = r.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                    !0 === a ? a = u[r] : !0 !== u[r] && (o = s[0], c.unshift(s[1]));
                                    break
                                }
                        if (!0 !== a)
                            if (a && e.throws) t = a(t);
                            else try {
                                t = a(t)
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: a ? e : "No conversion from " + l + " to " + o
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(c, x, w, u), u ? (c.ifModified && ((C = w.getResponseHeader("Last-Modified")) && (f.lastModified[r] = C), (C = w.getResponseHeader("etag")) && (f.etag[r] = C)), 204 === e || "HEAD" === c.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = x.state, v = x.data, u = !(y = x.error))) : (y = k, !e && k || (k = "error", e < 0 && (e = 0))), w.status = e, w.statusText = (t || k) + "", u ? h.resolveWith(d, [v, k, w]) : h.rejectWith(d, [w, k, y]), w.statusCode(g), g = void 0, s && p.trigger(u ? "ajaxSuccess" : "ajaxError", [w, c, u ? v : y]), m.fireWith(d, [w, k]), s && (p.trigger("ajaxComplete", [w, c]), --f.active || f.event.trigger("ajaxStop")))
            }
            return w
        },
        getJSON: function(e, t, n) {
            return f.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return f.get(e, void 0, t, "script")
        }
    }), f.each(["get", "post"], function(e, t) {
        f[t] = function(e, n, i, r) {
            return f.isFunction(n) && (r = r || i, i = n, n = void 0), f.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            })
        }
    }), f.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        f.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), f._evalUrl = function(e) {
        return f.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        })
    }, f.fn.extend({
        wrapAll: function(e) {
            if (f.isFunction(e)) return this.each(function(t) {
                f(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = f(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return f.isFunction(e) ? this.each(function(t) {
                f(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = f(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = f.isFunction(e);
            return this.each(function(n) {
                f(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        }
    }), f.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !c.reliableHiddenOffsets() && "none" === (e.style && e.style.display || f.css(e, "display"))
    }, f.expr.filters.visible = function(e) {
        return !f.expr.filters.hidden(e)
    };
    var Ot = /%20/g,
        Bt = /\[\]$/,
        zt = /\r?\n/g,
        It = /^(?:submit|button|image|reset|file)$/i,
        Wt = /^(?:input|select|textarea|keygen)/i;

    function $t(e, t, n, i) {
        var r;
        if (f.isArray(t)) f.each(t, function(t, r) {
            n || Bt.test(e) ? i(e, r) : $t(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i)
        });
        else if (n || "object" !== f.type(t)) i(e, t);
        else
            for (r in t) $t(e + "[" + r + "]", t[r], n, i)
    }
    f.param = function(e, t) {
        var n, i = [],
            r = function(e, t) {
                t = f.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = f.ajaxSettings && f.ajaxSettings.traditional), f.isArray(e) || e.jquery && !f.isPlainObject(e)) f.each(e, function() {
            r(this.name, this.value)
        });
        else
            for (n in e) $t(n, e[n], t, r);
        return i.join("&").replace(Ot, "+")
    }, f.fn.extend({
        serialize: function() {
            return f.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = f.prop(this, "elements");
                return e ? f.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !f(this).is(":disabled") && Wt.test(this.nodeName) && !It.test(e) && (this.checked || !V.test(e))
            }).map(function(e, t) {
                var n = f(this).val();
                return null == n ? null : f.isArray(n) ? f.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(zt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(zt, "\r\n")
                }
            }).get()
        }
    }), f.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Kt() || function() {
            try {
                return new e.ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
        }()
    } : Kt;
    var Xt = 0,
        Vt = {},
        Ut = f.ajaxSettings.xhr();

    function Kt() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }
    e.ActiveXObject && f(e).on("unload", function() {
        for (var e in Vt) Vt[e](void 0, !0)
    }), c.cors = !!Ut && "withCredentials" in Ut, (Ut = c.ajax = !!Ut) && f.ajaxTransport(function(e) {
        var t;
        if (!e.crossDomain || c.cors) return {
            send: function(n, i) {
                var r, o = e.xhr(),
                    a = ++Xt;
                if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                    for (r in e.xhrFields) o[r] = e.xhrFields[r];
                for (r in e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest"), n) void 0 !== n[r] && o.setRequestHeader(r, n[r] + "");
                o.send(e.hasContent && e.data || null), t = function(n, r) {
                    var s, l, u;
                    if (t && (r || 4 === o.readyState))
                        if (delete Vt[a], t = void 0, o.onreadystatechange = f.noop, r) 4 !== o.readyState && o.abort();
                        else {
                            u = {}, s = o.status, "string" == typeof o.responseText && (u.text = o.responseText);
                            try {
                                l = o.statusText
                            } catch (e) {
                                l = ""
                            }
                            s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = u.text ? 200 : 404
                        }
                    u && i(s, l, u, o.getAllResponseHeaders())
                }, e.async ? 4 === o.readyState ? setTimeout(t) : o.onreadystatechange = Vt[a] = t : t()
            },
            abort: function() {
                t && t(void 0, !0)
            }
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return f.globalEval(e), e
            }
        }
    }), f.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), f.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = _.head || f("head")[0] || _.documentElement;
            return {
                send: function(i, r) {
                    (t = _.createElement("script")).async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || r(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var Gt = [],
        Qt = /(=)\?(?=&|$)|\?\?/;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Gt.pop() || f.expando + "_" + Ct++;
            return this[e] = !0, e
        }
    }), f.ajaxPrefilter("json jsonp", function(t, n, i) {
        var r, o, a, s = !1 !== t.jsonp && (Qt.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Qt.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = f.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(Qt, "$1" + r) : !1 !== t.jsonp && (t.url += (kt.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function() {
            return a || f.error(r + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function() {
            a = arguments
        }, i.always(function() {
            e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, Gt.push(r)), a && f.isFunction(o) && o(a[0]), a = o = void 0
        }), "script"
    }), f.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || _;
        var i = x.exec(e),
            r = !n && [];
        return i ? [t.createElement(i[1])] : (i = f.buildFragment([e], t, r), r && r.length && f(r).remove(), f.merge([], i.childNodes))
    };
    var Yt = f.fn.load;
    f.fn.load = function(e, t, n) {
        if ("string" != typeof e && Yt) return Yt.apply(this, arguments);
        var i, r, o, a = this,
            s = e.indexOf(" ");
        return s >= 0 && (i = f.trim(e.slice(s, e.length)), e = e.slice(0, s)), f.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && f.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments, a.html(i ? f("<div>").append(f.parseHTML(e)).find(i) : e)
        }).complete(n && function(e, t) {
            a.each(n, r || [e.responseText, t, e])
        }), this
    }, f.expr.filters.animated = function(e) {
        return f.grep(f.timers, function(t) {
            return e === t.elem
        }).length
    };
    var Jt = e.document.documentElement;

    function Zt(e) {
        return f.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    f.offset = {
        setOffset: function(e, t, n) {
            var i, r, o, a, s, l, u = f.css(e, "position"),
                c = f(e),
                d = {};
            "static" === u && (e.style.position = "relative"), s = c.offset(), o = f.css(e, "top"), l = f.css(e, "left"), ("absolute" === u || "fixed" === u) && f.inArray("auto", [o, l]) > -1 ? (a = (i = c.position()).top, r = i.left) : (a = parseFloat(o) || 0, r = parseFloat(l) || 0), f.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + r), "using" in t ? t.using.call(e, d) : c.css(d)
        }
    }, f.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                f.offset.setOffset(this, e, t)
            });
            var t, n, i = {
                    top: 0,
                    left: 0
                },
                r = this[0],
                o = r && r.ownerDocument;
            return o ? (t = o.documentElement, f.contains(t, r) ? (typeof r.getBoundingClientRect !== H && (i = r.getBoundingClientRect()), n = Zt(o), {
                top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : i) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    i = this[0];
                return "fixed" === f.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), f.nodeName(e[0], "html") || (n = e.offset()), n.top += f.css(e[0], "borderTopWidth", !0), n.left += f.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - f.css(i, "marginTop", !0),
                    left: t.left - n.left - f.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || Jt; e && !f.nodeName(e, "html") && "static" === f.css(e, "position");) e = e.offsetParent;
                return e || Jt
            })
        }
    }), f.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        f.fn[e] = function(i) {
            return X(this, function(e, i, r) {
                var o = Zt(e);
                if (void 0 === r) return o ? t in o ? o[t] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(n ? f(o).scrollLeft() : r, n ? r : f(o).scrollTop()) : e[i] = r
            }, e, i, arguments.length, null)
        }
    }), f.each(["top", "left"], function(e, t) {
        f.cssHooks[t] = He(c.pixelPosition, function(e, n) {
            if (n) return n = je(e, t), De.test(n) ? f(e).position()[t] + "px" : n
        })
    }), f.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        f.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            f.fn[i] = function(i, r) {
                var o = arguments.length && (n || "boolean" != typeof i),
                    a = n || (!0 === i || !0 === r ? "margin" : "border");
                return X(this, function(t, n, i) {
                    var r;
                    return f.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === i ? f.css(t, n, a) : f.style(t, n, i, a)
                }, t, o ? i : void 0, o, null)
            }
        })
    }), f.fn.size = function() {
        return this.length
    }, f.fn.andSelf = f.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return f
    });
    var en = e.jQuery,
        tn = e.$;
    return f.noConflict = function(t) {
        return e.$ === f && (e.$ = tn), t && e.jQuery === f && (e.jQuery = en), f
    }, typeof t === H && (e.jQuery = e.$ = f), f
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    e.extend(e.fn, {
        validate: function(t) {
            if (this.length) {
                var n = e.data(this[0], "validator");
                return n || (this.attr("novalidate", "novalidate"), n = new e.validator(t, this[0]), e.data(this[0], "validator", n), n.settings.onsubmit && (this.on("click.validate", ":submit", function(t) {
                    n.submitButton = t.currentTarget, e(this).hasClass("cancel") && (n.cancelSubmit = !0), void 0 !== e(this).attr("formnovalidate") && (n.cancelSubmit = !0)
                }), this.on("submit.validate", function(t) {
                    function i() {
                        var i, r;
                        return n.submitButton && (n.settings.submitHandler || n.formSubmitted) && (i = e("<input type='hidden'/>").attr("name", n.submitButton.name).val(e(n.submitButton).val()).appendTo(n.currentForm)), !n.settings.submitHandler || (r = n.settings.submitHandler.call(n, n.currentForm, t), i && i.remove(), void 0 !== r && r)
                    }
                    return n.settings.debug && t.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, i()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0, !1) : i() : (n.focusInvalid(), !1)
                })), n)
            }
            t && t.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
        },
        valid: function() {
            var t, n, i;
            return e(this[0]).is("form") ? t = this.validate().form() : (i = [], t = !0, n = e(this[0].form).validate(), this.each(function() {
                (t = n.element(this) && t) || (i = i.concat(n.errorList))
            }), n.errorList = i), t
        },
        rules: function(t, n) {
            var i, r, o, a, s, l, u = this[0];
            if (null != u && (!u.form && u.hasAttribute("contenteditable") && (u.form = this.closest("form")[0], u.name = this.attr("name")), null != u.form)) {
                if (t) switch (i = e.data(u.form, "validator").settings, r = i.rules, o = e.validator.staticRules(u), t) {
                    case "add":
                        e.extend(o, e.validator.normalizeRule(n)), delete o.messages, r[u.name] = o, n.messages && (i.messages[u.name] = e.extend(i.messages[u.name], n.messages));
                        break;
                    case "remove":
                        return n ? (l = {}, e.each(n.split(/\s/), function(e, t) {
                            l[t] = o[t], delete o[t]
                        }), l) : (delete r[u.name], o)
                }
                return (a = e.validator.normalizeRules(e.extend({}, e.validator.classRules(u), e.validator.attributeRules(u), e.validator.dataRules(u), e.validator.staticRules(u)), u)).required && (s = a.required, delete a.required, a = e.extend({
                    required: s
                }, a)), a.remote && (s = a.remote, delete a.remote, a = e.extend(a, {
                    remote: s
                })), a
            }
        }
    }), e.extend(e.expr.pseudos || e.expr[":"], {
        blank: function(t) {
            return !e.trim("" + e(t).val())
        },
        filled: function(t) {
            var n = e(t).val();
            return null !== n && !!e.trim("" + n)
        },
        unchecked: function(t) {
            return !e(t).prop("checked")
        }
    }), e.validator = function(t, n) {
        this.settings = e.extend(!0, {}, e.validator.defaults, t), this.currentForm = n, this.init()
    }, e.validator.format = function(t, n) {
        return 1 === arguments.length ? function() {
            var n = e.makeArray(arguments);
            return n.unshift(t), e.validator.format.apply(this, n)
        } : void 0 === n ? t : (arguments.length > 2 && n.constructor !== Array && (n = e.makeArray(arguments).slice(1)), n.constructor !== Array && (n = [n]), e.each(n, function(e, n) {
            t = t.replace(new RegExp("\\{" + e + "\\}", "g"), function() {
                return n
            })
        }), t)
    }, e.extend(e.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: e([]),
            errorLabelContainer: e([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(e) {
                this.lastActive = e, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(e)))
            },
            onfocusout: function(e) {
                this.checkable(e) || !(e.name in this.submitted) && this.optional(e) || this.element(e)
            },
            onkeyup: function(t, n) {
                9 === n.which && "" === this.elementValue(t) || -1 !== e.inArray(n.keyCode, [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225]) || (t.name in this.submitted || t.name in this.invalid) && this.element(t)
            },
            onclick: function(e) {
                e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
            },
            highlight: function(t, n, i) {
                "radio" === t.type ? this.findByName(t.name).addClass(n).removeClass(i) : e(t).addClass(n).removeClass(i)
            },
            unhighlight: function(t, n, i) {
                "radio" === t.type ? this.findByName(t.name).removeClass(n).addClass(i) : e(t).removeClass(n).addClass(i)
            }
        },
        setDefaults: function(t) {
            e.extend(e.validator.defaults, t)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: e.validator.format("Please enter no more than {0} characters."),
            minlength: e.validator.format("Please enter at least {0} characters."),
            rangelength: e.validator.format("Please enter a value between {0} and {1} characters long."),
            range: e.validator.format("Please enter a value between {0} and {1}."),
            max: e.validator.format("Please enter a value less than or equal to {0}."),
            min: e.validator.format("Please enter a value greater than or equal to {0}."),
            step: e.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function t(t) {
                    !this.form && this.hasAttribute("contenteditable") && (this.form = e(this).closest("form")[0], this.name = e(this).attr("name"));
                    var n = e.data(this.form, "validator"),
                        i = "on" + t.type.replace(/^validate/, ""),
                        r = n.settings;
                    r[i] && !e(this).is(r.ignore) && r[i].call(n, this, t)
                }
                this.labelContainer = e(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || e(this.currentForm), this.containers = e(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                var n, i = this.groups = {};
                e.each(this.settings.groups, function(t, n) {
                    "string" == typeof n && (n = n.split(/\s/)), e.each(n, function(e, n) {
                        i[n] = t
                    })
                }), n = this.settings.rules, e.each(n, function(t, i) {
                    n[t] = e.validator.normalizeRule(i)
                }), e(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", t).on("click.validate", "select, option, [type='radio'], [type='checkbox']", t), this.settings.invalidHandler && e(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler)
            },
            form: function() {
                return this.checkForm(), e.extend(this.submitted, this.errorMap), this.invalid = e.extend({}, this.errorMap), this.valid() || e(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++) this.check(t[e]);
                return this.valid()
            },
            element: function(t) {
                var n, i, r = this.clean(t),
                    o = this.validationTargetFor(r),
                    a = this,
                    s = !0;
                return void 0 === o ? delete this.invalid[r.name] : (this.prepareElement(o), this.currentElements = e(o), (i = this.groups[o.name]) && e.each(this.groups, function(e, t) {
                    t === i && e !== o.name && ((r = a.validationTargetFor(a.clean(a.findByName(e)))) && r.name in a.invalid && (a.currentElements.push(r), s = a.check(r) && s))
                }), n = !1 !== this.check(o), s = s && n, this.invalid[o.name] = !n, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), e(t).attr("aria-invalid", !n)), s
            },
            showErrors: function(t) {
                if (t) {
                    var n = this;
                    e.extend(this.errorMap, t), this.errorList = e.map(this.errorMap, function(e, t) {
                        return {
                            message: e,
                            element: n.findByName(t)[0]
                        }
                    }), this.successList = e.grep(this.successList, function(e) {
                        return !(e.name in t)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                e.fn.resetForm && e(this.currentForm).resetForm(), this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
                var t = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(t)
            },
            resetElements: function(e) {
                var t;
                if (this.settings.unhighlight)
                    for (t = 0; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""), this.findByName(e[t].name).removeClass(this.settings.validClass);
                else e.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(e) {
                var t, n = 0;
                for (t in e) void 0 !== e[t] && null !== e[t] && !1 !== e[t] && n++;
                return n
            },
            hideErrors: function() {
                this.hideThese(this.toHide)
            },
            hideThese: function(e) {
                e.not(this.containers).text(""), this.addWrapper(e).hide()
            },
            valid: function() {
                return 0 === this.size()
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) try {
                    e(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch (e) {}
            },
            findLastActive: function() {
                var t = this.lastActive;
                return t && 1 === e.grep(this.errorList, function(e) {
                    return e.element.name === t.name
                }).length && t
            },
            elements: function() {
                var t = this,
                    n = {};
                return e(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function() {
                    var i = this.name || e(this).attr("name");
                    return !i && t.settings.debug && window.console && console.error("%o has no name assigned", this), this.hasAttribute("contenteditable") && (this.form = e(this).closest("form")[0], this.name = i), !(i in n || !t.objectLength(e(this).rules()) || (n[i] = !0, 0))
                })
            },
            clean: function(t) {
                return e(t)[0]
            },
            errors: function() {
                var t = this.settings.errorClass.split(" ").join(".");
                return e(this.settings.errorElement + "." + t, this.errorContext)
            },
            resetInternals: function() {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = e([]), this.toHide = e([])
            },
            reset: function() {
                this.resetInternals(), this.currentElements = e([])
            },
            prepareForm: function() {
                this.reset(), this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(e) {
                this.reset(), this.toHide = this.errorsFor(e)
            },
            elementValue: function(t) {
                var n, i, r = e(t),
                    o = t.type;
                return "radio" === o || "checkbox" === o ? this.findByName(t.name).filter(":checked").val() : "number" === o && void 0 !== t.validity ? t.validity.badInput ? "NaN" : r.val() : (n = t.hasAttribute("contenteditable") ? r.text() : r.val(), "file" === o ? "C:\\fakepath\\" === n.substr(0, 12) ? n.substr(12) : (i = n.lastIndexOf("/")) >= 0 ? n.substr(i + 1) : (i = n.lastIndexOf("\\")) >= 0 ? n.substr(i + 1) : n : "string" == typeof n ? n.replace(/\r/g, "") : n)
            },
            check: function(t) {
                t = this.validationTargetFor(this.clean(t));
                var n, i, r, o, a = e(t).rules(),
                    s = e.map(a, function(e, t) {
                        return t
                    }).length,
                    l = !1,
                    u = this.elementValue(t);
                if ("function" == typeof a.normalizer ? o = a.normalizer : "function" == typeof this.settings.normalizer && (o = this.settings.normalizer), o) {
                    if ("string" != typeof(u = o.call(t, u))) throw new TypeError("The normalizer should return a string value.");
                    delete a.normalizer
                }
                for (i in a) {
                    r = {
                        method: i,
                        parameters: a[i]
                    };
                    try {
                        if ("dependency-mismatch" === (n = e.validator.methods[i].call(this, u, t, r.parameters)) && 1 === s) {
                            l = !0;
                            continue
                        }
                        if (l = !1, "pending" === n) return void(this.toHide = this.toHide.not(this.errorsFor(t)));
                        if (!n) return this.formatAndAdd(t, r), !1
                    } catch (e) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + r.method + "' method.", e), e instanceof TypeError && (e.message += ".  Exception occurred when checking element " + t.id + ", check the '" + r.method + "' method."), e
                    }
                }
                if (!l) return this.objectLength(a) && this.successList.push(t), !0
            },
            customDataMessage: function(t, n) {
                return e(t).data("msg" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()) || e(t).data("msg")
            },
            customMessage: function(e, t) {
                var n = this.settings.messages[e];
                return n && (n.constructor === String ? n : n[t])
            },
            findDefined: function() {
                for (var e = 0; e < arguments.length; e++)
                    if (void 0 !== arguments[e]) return arguments[e]
            },
            defaultMessage: function(t, n) {
                "string" == typeof n && (n = {
                    method: n
                });
                var i = this.findDefined(this.customMessage(t.name, n.method), this.customDataMessage(t, n.method), !this.settings.ignoreTitle && t.title || void 0, e.validator.messages[n.method], "<strong>Warning: No message defined for " + t.name + "</strong>"),
                    r = /\$?\{(\d+)\}/g;
                return "function" == typeof i ? i = i.call(this, n.parameters, t) : r.test(i) && (i = e.validator.format(i.replace(r, "{$1}"), n.parameters)), i
            },
            formatAndAdd: function(e, t) {
                var n = this.defaultMessage(e, t);
                this.errorList.push({
                    message: n,
                    element: e,
                    method: t.method
                }), this.errorMap[e.name] = n, this.submitted[e.name] = n
            },
            addWrapper: function(e) {
                return this.settings.wrapper && (e = e.add(e.parent(this.settings.wrapper))), e
            },
            defaultShowErrors: function() {
                var e, t, n;
                for (e = 0; this.errorList[e]; e++) n = this.errorList[e], this.settings.highlight && this.settings.highlight.call(this, n.element, this.settings.errorClass, this.settings.validClass), this.showLabel(n.element, n.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                    for (e = 0; this.successList[e]; e++) this.showLabel(this.successList[e]);
                if (this.settings.unhighlight)
                    for (e = 0, t = this.validElements(); t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return e(this.errorList).map(function() {
                    return this.element
                })
            },
            showLabel: function(t, n) {
                var i, r, o, a, s = this.errorsFor(t),
                    l = this.idOrName(t),
                    u = e(t).attr("aria-describedby");
                s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html(n)) : (i = s = e("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass).html(n || ""), this.settings.wrapper && (i = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(i) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, i, e(t)) : i.insertAfter(t), s.is("label") ? s.attr("for", l) : 0 === s.parents("label[for='" + this.escapeCssMeta(l) + "']").length && (o = s.attr("id"), u ? u.match(new RegExp("\\b" + this.escapeCssMeta(o) + "\\b")) || (u += " " + o) : u = o, e(t).attr("aria-describedby", u), (r = this.groups[t.name]) && (a = this, e.each(a.groups, function(t, n) {
                    n === r && e("[name='" + a.escapeCssMeta(t) + "']", a.currentForm).attr("aria-describedby", s.attr("id"))
                })))), !n && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, t)), this.toShow = this.toShow.add(s)
            },
            errorsFor: function(t) {
                var n = this.escapeCssMeta(this.idOrName(t)),
                    i = e(t).attr("aria-describedby"),
                    r = "label[for='" + n + "'], label[for='" + n + "'] *";
                return i && (r = r + ", #" + this.escapeCssMeta(i).replace(/\s+/g, ", #")), this.errors().filter(r)
            },
            escapeCssMeta: function(e) {
                return e.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function(e) {
                return this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
            },
            validationTargetFor: function(t) {
                return this.checkable(t) && (t = this.findByName(t.name)), e(t).not(this.settings.ignore)[0]
            },
            checkable: function(e) {
                return /radio|checkbox/i.test(e.type)
            },
            findByName: function(t) {
                return e(this.currentForm).find("[name='" + this.escapeCssMeta(t) + "']")
            },
            getLength: function(t, n) {
                switch (n.nodeName.toLowerCase()) {
                    case "select":
                        return e("option:selected", n).length;
                    case "input":
                        if (this.checkable(n)) return this.findByName(n.name).filter(":checked").length
                }
                return t.length
            },
            depend: function(e, t) {
                return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t)
            },
            dependTypes: {
                boolean: function(e) {
                    return e
                },
                string: function(t, n) {
                    return !!e(t, n.form).length
                },
                function: function(e, t) {
                    return e(t)
                }
            },
            optional: function(t) {
                var n = this.elementValue(t);
                return !e.validator.methods.required.call(this, n, t) && "dependency-mismatch"
            },
            startRequest: function(t) {
                this.pending[t.name] || (this.pendingRequest++, e(t).addClass(this.settings.pendingClass), this.pending[t.name] = !0)
            },
            stopRequest: function(t, n) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[t.name], e(t).removeClass(this.settings.pendingClass), n && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (e(this.currentForm).submit(), this.submitButton && e("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove(), this.formSubmitted = !1) : !n && 0 === this.pendingRequest && this.formSubmitted && (e(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            },
            previousValue: function(t, n) {
                return n = "string" == typeof n && n || "remote", e.data(t, "previousValue") || e.data(t, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(t, {
                        method: n
                    })
                })
            },
            destroy: function() {
                this.resetForm(), e(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(t, n) {
            t.constructor === String ? this.classRuleSettings[t] = n : e.extend(this.classRuleSettings, t)
        },
        classRules: function(t) {
            var n = {},
                i = e(t).attr("class");
            return i && e.each(i.split(" "), function() {
                this in e.validator.classRuleSettings && e.extend(n, e.validator.classRuleSettings[this])
            }), n
        },
        normalizeAttributeRule: function(e, t, n, i) {
            /min|max|step/.test(n) && (null === t || /number|range|text/.test(t)) && (i = Number(i), isNaN(i) && (i = void 0)), i || 0 === i ? e[n] = i : t === n && "range" !== t && (e[n] = !0)
        },
        attributeRules: function(t) {
            var n, i, r = {},
                o = e(t),
                a = t.getAttribute("type");
            for (n in e.validator.methods) "required" === n ? ("" === (i = t.getAttribute(n)) && (i = !0), i = !!i) : i = o.attr(n), this.normalizeAttributeRule(r, a, n, i);
            return r.maxlength && /-1|2147483647|524288/.test(r.maxlength) && delete r.maxlength, r
        },
        dataRules: function(t) {
            var n, i, r = {},
                o = e(t),
                a = t.getAttribute("type");
            for (n in e.validator.methods) i = o.data("rule" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()), this.normalizeAttributeRule(r, a, n, i);
            return r
        },
        staticRules: function(t) {
            var n = {},
                i = e.data(t.form, "validator");
            return i.settings.rules && (n = e.validator.normalizeRule(i.settings.rules[t.name]) || {}), n
        },
        normalizeRules: function(t, n) {
            return e.each(t, function(i, r) {
                if (!1 !== r) {
                    if (r.param || r.depends) {
                        var o = !0;
                        switch (typeof r.depends) {
                            case "string":
                                o = !!e(r.depends, n.form).length;
                                break;
                            case "function":
                                o = r.depends.call(n, n)
                        }
                        o ? t[i] = void 0 === r.param || r.param : (e.data(n.form, "validator").resetElements(e(n)), delete t[i])
                    }
                } else delete t[i]
            }), e.each(t, function(i, r) {
                t[i] = e.isFunction(r) && "normalizer" !== i ? r(n) : r
            }), e.each(["minlength", "maxlength"], function() {
                t[this] && (t[this] = Number(t[this]))
            }), e.each(["rangelength", "range"], function() {
                var n;
                t[this] && (e.isArray(t[this]) ? t[this] = [Number(t[this][0]), Number(t[this][1])] : "string" == typeof t[this] && (n = t[this].replace(/[\[\]]/g, "").split(/[\s,]+/), t[this] = [Number(n[0]), Number(n[1])]))
            }), e.validator.autoCreateRanges && (null != t.min && null != t.max && (t.range = [t.min, t.max], delete t.min, delete t.max), null != t.minlength && null != t.maxlength && (t.rangelength = [t.minlength, t.maxlength], delete t.minlength, delete t.maxlength)), t
        },
        normalizeRule: function(t) {
            if ("string" == typeof t) {
                var n = {};
                e.each(t.split(/\s/), function() {
                    n[this] = !0
                }), t = n
            }
            return t
        },
        addMethod: function(t, n, i) {
            e.validator.methods[t] = n, e.validator.messages[t] = void 0 !== i ? i : e.validator.messages[t], n.length < 3 && e.validator.addClassRules(t, e.validator.normalizeRule(t))
        },
        methods: {
            required: function(t, n, i) {
                if (!this.depend(i, n)) return "dependency-mismatch";
                if ("select" === n.nodeName.toLowerCase()) {
                    var r = e(n).val();
                    return r && r.length > 0
                }
                return this.checkable(n) ? this.getLength(t, n) > 0 : t.length > 0
            },
            email: function(e, t) {
                return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)
            },
            url: function(e, t) {
                return this.optional(t) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(e)
            },
            date: function(e, t) {
                return this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString())
            },
            dateISO: function(e, t) {
                return this.optional(t) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e)
            },
            number: function(e, t) {
                return this.optional(t) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
            },
            digits: function(e, t) {
                return this.optional(t) || /^\d+$/.test(e)
            },
            minlength: function(t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r >= i
            },
            maxlength: function(t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r <= i
            },
            rangelength: function(t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r >= i[0] && r <= i[1]
            },
            min: function(e, t, n) {
                return this.optional(t) || e >= n
            },
            max: function(e, t, n) {
                return this.optional(t) || e <= n
            },
            range: function(e, t, n) {
                return this.optional(t) || e >= n[0] && e <= n[1]
            },
            step: function(t, n, i) {
                var r, o = e(n).attr("type"),
                    a = "Step attribute on input type " + o + " is not supported.",
                    s = new RegExp("\\b" + o + "\\b"),
                    l = function(e) {
                        var t = ("" + e).match(/(?:\.(\d+))?$/);
                        return t && t[1] ? t[1].length : 0
                    },
                    u = function(e) {
                        return Math.round(e * Math.pow(10, r))
                    },
                    c = !0;
                if (o && !s.test(["text", "number", "range"].join())) throw new Error(a);
                return r = l(i), (l(t) > r || u(t) % u(i) != 0) && (c = !1), this.optional(n) || c
            },
            equalTo: function(t, n, i) {
                var r = e(i);
                return this.settings.onfocusout && r.not(".validate-equalTo-blur").length && r.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function() {
                    e(n).valid()
                }), t === r.val()
            },
            remote: function(t, n, i, r) {
                if (this.optional(n)) return "dependency-mismatch";
                r = "string" == typeof r && r || "remote";
                var o, a, s, l = this.previousValue(n, r);
                return this.settings.messages[n.name] || (this.settings.messages[n.name] = {}), l.originalMessage = l.originalMessage || this.settings.messages[n.name][r], this.settings.messages[n.name][r] = l.message, i = "string" == typeof i && {
                    url: i
                } || i, s = e.param(e.extend({
                    data: t
                }, i.data)), l.old === s ? l.valid : (l.old = s, o = this, this.startRequest(n), (a = {})[n.name] = t, e.ajax(e.extend(!0, {
                    mode: "abort",
                    port: "validate" + n.name,
                    dataType: "json",
                    data: a,
                    context: o.currentForm,
                    success: function(e) {
                        var i, a, s, u = !0 === e || "true" === e;
                        o.settings.messages[n.name][r] = l.originalMessage, u ? (s = o.formSubmitted, o.resetInternals(), o.toHide = o.errorsFor(n), o.formSubmitted = s, o.successList.push(n), o.invalid[n.name] = !1, o.showErrors()) : (i = {}, a = e || o.defaultMessage(n, {
                            method: r,
                            parameters: t
                        }), i[n.name] = l.message = a, o.invalid[n.name] = !0, o.showErrors(i)), l.valid = u, o.stopRequest(n, u)
                    }
                }, i)), "pending")
            }
        }
    });
    var t, n = {};
    return e.ajaxPrefilter ? e.ajaxPrefilter(function(e, t, i) {
        var r = e.port;
        "abort" === e.mode && (n[r] && n[r].abort(), n[r] = i)
    }) : (t = e.ajax, e.ajax = function(i) {
        var r = ("mode" in i ? i : e.ajaxSettings).mode,
            o = ("port" in i ? i : e.ajaxSettings).port;
        return "abort" === r ? (n[o] && n[o].abort(), n[o] = t.apply(this, arguments), n[o]) : t.apply(this, arguments)
    }), e
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery", "./jquery.validate.min"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    return function() {
        function t(e) {
            return e.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/[.(),;:!?%#$'\"_+=\/\-â€œâ€â€™]*/g, "")
        }
        e.validator.addMethod("maxWords", function(e, n, i) {
            return this.optional(n) || t(e).match(/\b\w+\b/g).length <= i
        }, e.validator.format("Please enter {0} words or less.")), e.validator.addMethod("minWords", function(e, n, i) {
            return this.optional(n) || t(e).match(/\b\w+\b/g).length >= i
        }, e.validator.format("Please enter at least {0} words.")), e.validator.addMethod("rangeWords", function(e, n, i) {
            var r = t(e),
                o = /\b\w+\b/g;
            return this.optional(n) || r.match(o).length >= i[0] && r.match(o).length <= i[1]
        }, e.validator.format("Please enter between {0} and {1} words."))
    }(), e.validator.addMethod("creditcard", function(e, t) {
        if (this.optional(t)) return "dependency-mismatch";
        if (/[^0-9 \-]+/.test(e)) return !1;
        var n, i, r = 0,
            o = 0,
            a = !1;
        if ((e = e.replace(/\D/g, "")).length < 13 || e.length > 19) return !1;
        for (n = e.length - 1; n >= 0; n--) i = e.charAt(n), o = parseInt(i, 10), a && (o *= 2) > 9 && (o -= 9), r += o, a = !a;
        return r % 10 == 0
    }, "Please enter a valid credit card number."), e.validator.addMethod("creditcardtypes", function(e, t, n) {
        if (/[^0-9\-]+/.test(e)) return !1;
        e = e.replace(/\D/g, "");
        var i = 0;
        return n.mastercard && (i |= 1), n.visa && (i |= 2), n.amex && (i |= 4), n.dinersclub && (i |= 8), n.enroute && (i |= 16), n.discover && (i |= 32), n.jcb && (i |= 64), n.unknown && (i |= 128), n.all && (i = 255), 1 & i && /^(5[12345])/.test(e) ? 16 === e.length : 2 & i && /^(4)/.test(e) ? 16 === e.length : 4 & i && /^(3[47])/.test(e) ? 15 === e.length : 8 & i && /^(3(0[012345]|[68]))/.test(e) ? 14 === e.length : 16 & i && /^(2(014|149))/.test(e) ? 15 === e.length : 32 & i && /^(6011)/.test(e) ? 16 === e.length : 64 & i && /^(3)/.test(e) ? 16 === e.length : 64 & i && /^(2131|1800)/.test(e) ? 15 === e.length : !!(128 & i)
    }, "Please enter a valid credit card number."), e
}), jQuery.validator.addMethod("cpf", function(e, t) {
    return validarCPF(e)
}, "Informe um CPF válido.");
var btnTexto, btnAlvo, btnSuperCheckout, tipoPagina = "",
    boxCartao = document.createElement("div");
boxCartao.classList.add("main-mercadopago"), boxCartao.innerHTML = '<div id="retorno"></div><div class="main-info-cards"><form id="form1"><input type="hidden" name="titular_doc_tipo" data-checkout="docType" value="CPF"/><input type="hidden" data-checkout="siteId" value="MLB"/><input type="hidden" name="paymentMethod" value="creditcard"><input type="hidden" name="id" value="1"><input type="hidden" name="shop" id="shop" value=""><input type="hidden" name="tokenShopify" id="tokenShopify" value=""><div id="shopify-transparente-mercado-pago"><h2 class="section__title">Cartão de Crédito</h2><div class="section__content"><div class="field field--required"><div class="field__input-wrapper"><label class="field__label field__label--visible">Número do Cartão</label><div class="main-number-card"><input type="text" class="field__input" placeholder="Número do Cartão" name="cartao_numero" id="cartao_numero" data-checkout="cardNumber" autocomplete="off" maxlength="19"></div></div></div><div class="field field--optional"><div class="field__input-wrapper"><label class="field__label field__label--visible">Nome do Titular</label><input type="text" class="field__input" placeholder="Nome do Titular" id="titular_nome" name="creditCardCardName" data-checkout="cardholderName" autocomplete="off"></div></div><div class="field field--required field--half"><div class="field__input-wrapper"><label class="field__label field__label--visible">MM/AA</label><input type="text" class="field__input" placeholder="MM/AA" name="exp-date" id="cartao_mes_ano" data-checkout="cardExpirationMonth" maxlength="5"></div></div><input type="hidden" class="field__input field__input_mes" name="cartao_mes" id="cartao_mes" data-checkout="cardExpirationMonth" maxlength="2"><input type="hidden" class="field__input field__input_ano" name="cartao_ano" id="cartao_ano" data-checkout="cardExpirationYear" maxlength="2"><div class="field field--required field--half"><div class="field__input-wrapper"><label class="field__label field__label--visible">CVV</label><input type="text" class="field__input" placeholder="CVV" name="cartao_codigo" id="cartao_codigo" data-checkout="securityCode" autocomplete="off" maxlength="4"><svg style="height:20px;width:50px;" id="icon-cvv" viewBox="0 0 60 38" width="100%" height="100%"><path style="fill:#d8d8d8;" d="M 0 0 0 38 60 38 60 0 0 0 Z m 4 4 52 0 0 6 -52 0 0 -6 z m 0 12 52 0 0 18 -52 0 0 -18 z m 3 5 0 1 23 0 0 -1 -23 0 z m 34 0 0 1 10 0 0 -1 -10 0 z"></path><path style="fill:#ee183b;" d="m 36 15 0 14 21 0 0 -14 L 36 15 Z m 2 2 17 0 0 10 L 38 27 38 17 Z"></path></svg></div></div></div><h2 class="section__title info-add">Informações Adicionais</h2><div class="section__content"><div class="field field--optional field--half"><div class="field__input-wrapper"><label class="field__label field__label--visible">CPF do Titular</label><input type="text" class="field__input" placeholder="CPF do Titular" id="titular_doc" name="titular_doc" data-checkout="docNumber" maxlength="14"></div></div><div class="field field--required field--half"><div class="field__input-wrapper field__input-wrapper--select"><label class="field__label field__label--visible" style="transform:none;opacity:1;margin:5px 0 !important;">Parcelas</label><select class="field__input field__input--select fieldParcelas" id="parcelamento" name="parcelas_quantidade" aria-required="true" data-checkout="installments" ><option value="1">Preencha o Número do Cartão</option></select></div></div></div></div></form></div>';
var link2 = document.createElement("link"),
    link3 = document.createElement("link");
link2.rel = "stylesheet", link3.rel = "stylesheet", link2.href = "https://use.fontawesome.com/releases/v5.6.3/css/all.css", link3.href = "https://kaioavila.github.io/shopify_checkout/cep.css";
var shop = Shopify.Checkout.apiHost;
document.getElementsByTagName("head")[0].appendChild(link2), document.getElementsByTagName("head")[0].appendChild(link3);
var fieldCountry, desconto = getdesconto(),
    pais = getpais(),
    contador = setInterval(verificar, 1e3),
    novoElemento = document.createElement("div");
(document.querySelector(".section--shipping-address") || digitais && document.querySelector(".section--billing-address")) && construirPGshipping();