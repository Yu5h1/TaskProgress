import { bindButton as e, registerUi as t } from "../assets/web/ui/index.js";
import { applyTheme as n, loadThemePreference as r, preferenceWithMode as i, saveThemePreference as a } from "../assets/web/theme/index.js";
import "../assets/expandable-text.js";
import "../assets/inline-links.js";
import "../assets/card-order.js";
import "../assets/card-disclosure-state.js";
import "../assets/filter-selection.js";
import "../assets/link-selection.js";
//#region node_modules/lit-html/lit-html.js
var o = globalThis, s = (e) => e, c = o.trustedTypes, l = c ? c.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, u = "$lit$", d = `lit$${Math.random().toFixed(9).slice(2)}$`, f = "?" + d, p = `<${f}>`, m = document, h = () => m.createComment(""), g = (e) => e === null || typeof e != "object" && typeof e != "function", _ = Array.isArray, ee = (e) => _(e) || typeof e?.[Symbol.iterator] == "function", v = "[ 	\n\f\r]", y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ne = />/g, b = RegExp(`>|${v}(?:([^\\s"'>=/]+)(${v}*=${v}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), x = /'/g, re = /"/g, ie = /^(?:script|style|textarea|title)$/i, S = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), C = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), T = /* @__PURE__ */ new WeakMap(), E = m.createTreeWalker(m, 129);
function D(e, t) {
	if (!_(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return l === void 0 ? t : l.createHTML(t);
}
var O = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = y;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, f = 0;
		for (; f < n.length && (o.lastIndex = f, c = o.exec(n), c !== null);) f = o.lastIndex, o === y ? c[1] === "!--" ? o = te : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = b) : (ie.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = b) : o = ne : o === b ? c[0] === ">" ? (o = i ?? y, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? b : c[3] === "\"" ? re : x) : o === re || o === x ? o = b : o === te || o === ne ? o = y : (o = b, i = void 0);
		let m = o === b && e[t + 1].startsWith("/>") ? " " : "";
		a += o === y ? n + p : l >= 0 ? (r.push(s), n.slice(0, l) + u + n.slice(l) + d + m) : n + d + (l === -2 ? t : m);
	}
	return [D(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, k = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, l = this.parts, [p, m] = O(t, n);
		if (this.el = e.createElement(p, r), E.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = E.nextNode()) !== null && l.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(u)) {
					let t = m[o++], n = i.getAttribute(e).split(d), r = /([.?@])?(.*)/.exec(t);
					l.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? oe : r[1] === "?" ? se : r[1] === "@" ? ce : M
					}), i.removeAttribute(e);
				} else e.startsWith(d) && (l.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ie.test(i.tagName)) {
					let e = i.textContent.split(d), t = e.length - 1;
					if (t > 0) {
						i.textContent = c ? c.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], h()), E.nextNode(), l.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], h());
					}
				}
			} else if (i.nodeType === 8) if (i.data === f) l.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(d, e + 1)) !== -1;) l.push({
					type: 7,
					index: a
				}), e += d.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = m.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === C) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = g(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var ae = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? m).importNode(t, !0);
		E.currentNode = r;
		let i = E.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new j(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new le(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = E.nextNode(), a++);
		}
		return E.currentNode = m, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, j = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = A(this, e, t), g(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== C && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ee(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== w && g(this._$AH) ? this._$AA.nextSibling.data = e : this.T(m.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = k.createElement(D(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ae(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = T.get(e.strings);
		return t === void 0 && T.set(e.strings, t = new k(e)), t;
	}
	k(t) {
		_(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(h()), this.O(h()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = s(e).nextSibling;
			s(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, M = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = w, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = w;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !g(e) || e !== this._$AH && e !== C, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === C && (s = this._$AH[o]), a ||= !g(s) || s !== this._$AH[o], s === w ? e = w : e !== w && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, oe = class extends M {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === w ? void 0 : e;
	}
}, se = class extends M {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== w);
	}
}, ce = class extends M {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? w) === C) return;
		let n = this._$AH, r = e === w && n !== w || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== w && (n === w || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, le = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, ue = {
	M: u,
	P: d,
	A: f,
	C: 1,
	L: O,
	R: ae,
	D: ee,
	V: A,
	I: j,
	H: M,
	N: se,
	U: ce,
	B: oe,
	F: le
}, de = o.litHtmlPolyfillSupport;
de?.(k, j), (o.litHtmlVersions ??= []).push("3.3.3");
var N = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new j(t.insertBefore(h(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, P = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, F = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), I = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, L = class extends I {
	constructor(e) {
		if (super(e), this.it = w, e.type !== P.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(e) {
		if (e === w || e == null) return this._t = void 0, this.it = e;
		if (e === C) return e;
		if (typeof e != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
		if (e === this.it) return this._t;
		this.it = e;
		let t = [e];
		return t.raw = t, this._t = {
			_$litType$: this.constructor.resultType,
			strings: t,
			values: []
		};
	}
};
L.directiveName = "unsafeHTML", L.resultType = 1;
var fe = F(L), R = "task-progress.theme.v1";
Object.freeze({
	light: Object.freeze({
		pageBackground: "#f5f3ec",
		panelBackground: "#fffdf8",
		heading: "#17211d",
		panelHeading: "#17211d",
		itemText: "#27342e",
		secondaryText: "#4f5e57",
		border: "#dcd9cf",
		accent: "#1f684f"
	}),
	dark: Object.freeze({
		pageBackground: "#171a21",
		panelBackground: "#202530",
		heading: "#eef2f7",
		panelHeading: "#dfe6ef",
		itemText: "#cbd4df",
		secondaryText: "#9da9b8",
		border: "#343c49",
		accent: "#7f9fd1"
	})
}), Object.freeze({
	version: 1,
	mode: "system"
});
//#endregion
//#region ui/web-workflow/theme-options.mjs
var pe = Object.freeze({ defaultMode: "system" });
//#endregion
//#region ui/web-workflow/bootstrap.mjs
function z(t = null) {
	let n = document.createElement("a");
	n.className = "demo-back-link", n.href = t?.href ?? "/", n.setAttribute("aria-label", t ? `回到 ${t.title}` : "回到 Scopes 入口"), n.title = t ? `回到 ${t.title}` : "回到 Scopes 入口";
	let r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	for (let [e, t] of Object.entries({
		viewBox: "0 0 24 24",
		width: "32",
		height: "32",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "4",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true"
	})) r.setAttribute(e, t);
	let i = document.createElementNS("http://www.w3.org/2000/svg", "path");
	return i.setAttribute("d", "M19 12H5m6-6-6 6 6 6"), r.append(i), n.append(r), e(n, {
		appearance: "ghost",
		icon: !0,
		label: !1,
		size: 40,
		iconElement: r
	}), n.style.setProperty("--button-foreground", "var(--blue)"), n;
}
async function me(e) {
	t(), document.documentElement.dataset.taskprogressUi = "web-ui-workflow";
	let o = pe, s = globalThis.taskprogressThemeBoot, c = s?.preference ?? r(() => localStorage, "task-progress.theme.v1", o);
	s?.controller.dispose(), delete globalThis.taskprogressThemeBoot;
	let l = document.createElement("ui-theme-control"), u = matchMedia("(prefers-color-scheme: dark)"), d, f = () => {
		l.preference = c, l.systemScheme = u.matches ? "dark" : "light", document.documentElement.dataset.theme = c.mode, c.mode === "custom" ? document.documentElement.dataset.themeBase = c.custom.base : delete document.documentElement.dataset.themeBase;
	}, p = () => {
		d || (c = r(() => localStorage, R, o), d = n(document.documentElement, c, o), u.addEventListener("change", f), f());
	}, m = (e) => (c = a(() => localStorage, R, e, o), d?.update(c), f(), c);
	if (p(), l.addEventListener("theme-change", (e) => m(e.detail.preference)), globalThis.taskprogressTheme = {
		control: l,
		get mode() {
			return c.mode;
		},
		get custom() {
			return c.custom ?? null;
		},
		get systemScheme() {
			return u.matches ? "dark" : "light";
		},
		setMode(e) {
			return m(i(c, e, this.systemScheme, o));
		},
		applyCustom(e) {
			return m({
				...c,
				mode: "custom",
				custom: e
			});
		},
		destroy() {}
	}, addEventListener("pagehide", () => {
		d?.dispose(), d = void 0, u.removeEventListener("change", f);
	}), addEventListener("pageshow", p), e === "viewer") {
		let e = document.querySelector("#report-title");
		if (e) {
			let t = document.createElement("div");
			t.className = "replica-title-row", e.before(t), t.append(z(), e);
		}
	}
	let h = new URLSearchParams(location.search).get("scope"), g = e !== "viewer" && typeof globalThis.chrome?.webview?.postMessage == "function", _ = g;
	if (!g && h) try {
		let e = await fetch("/__taskprogress/v1/capabilities/" + encodeURIComponent(h));
		_ = e.ok && (await e.json()).editable;
	} catch {}
	return {
		editable: _,
		desktop: g
	};
}
//#endregion
//#region node_modules/@lit/reactive-element/css-tag.js
var B = globalThis, V = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, H = Symbol(), he = /* @__PURE__ */ new WeakMap(), ge = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== H) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (V && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = he.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && he.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, _e = (e) => new ge(typeof e == "string" ? e : e + "", void 0, H), ve = (e, t) => {
	if (V) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = B.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, ye = V ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return _e(t);
})(e) : e, { is: be, defineProperty: xe, getOwnPropertyDescriptor: Se, getOwnPropertyNames: Ce, getOwnPropertySymbols: we, getPrototypeOf: Te } = Object, U = globalThis, Ee = U.trustedTypes, De = Ee ? Ee.emptyScript : "", Oe = U.reactiveElementPolyfillSupport, W = (e, t) => e, G = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? De : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ke = (e, t) => !be(e, t), Ae = {
	attribute: !0,
	type: String,
	converter: G,
	reflect: !1,
	useDefault: !1,
	hasChanged: ke
};
Symbol.metadata ??= Symbol("metadata"), U.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var K = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = Ae) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && xe(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Se(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? Ae;
	}
	static _$Ei() {
		if (this.hasOwnProperty(W("elementProperties"))) return;
		let e = Te(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(W("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
			let e = this.properties, t = [...Ce(e), ...we(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(ye(e));
		} else e !== void 0 && t.push(ye(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return ve(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? G : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? G : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ke)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
K.elementStyles = [], K.shadowRootOptions = { mode: "open" }, K[W("elementProperties")] = /* @__PURE__ */ new Map(), K[W("finalized")] = /* @__PURE__ */ new Map(), Oe?.({ ReactiveElement: K }), (U.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-element/lit-element.js
var q = globalThis, J = class extends K {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = N(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return C;
	}
};
J._$litElement$ = !0, J.finalized = !0, q.litElementHydrateSupport?.({ LitElement: J });
var je = q.litElementPolyfillSupport;
je?.({ LitElement: J }), (q.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: Me } = ue, Ne = (e) => e.strings === void 0, Y = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Y(e, t);
	return !0;
}, X = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, Pe = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), Le(t);
	}
};
function Fe(e) {
	this._$AN === void 0 ? this._$AM = e : (X(this), this._$AM = e, Pe(this));
}
function Ie(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) Y(r[e], !1), X(r[e]);
	else r != null && (Y(r, !1), X(r));
	else Y(this, e);
}
var Le = (e) => {
	e.type == P.CHILD && (e._$AP ??= Ie, e._$AQ ??= Fe);
}, Re = class extends I {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Pe(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Y(this, e), X(this));
	}
	setValue(e) {
		if (Ne(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
//#endregion
//#region ui/web-workflow/action-queue.mjs
function ze(e = queueMicrotask) {
	let t = /* @__PURE__ */ new Set(), n = !1, r = () => {
		n = !1;
		let r = [...t];
		for (let n of r) if (t.delete(n)) try {
			n.flush();
		} catch (t) {
			e(() => {
				throw t;
			});
		}
	};
	return {
		add(i) {
			t.add(i), n || (n = !0, e(r));
		},
		delete(e) {
			t.delete(e);
		}
	};
}
//#endregion
//#region ui/web-workflow/common.mjs
var Z = ze(), Be = F(class extends Re {
	render() {
		return w;
	}
	update(e, [t, n]) {
		return this.node = e.element, this.factory !== t && (this.clear(), this.factory = t), this.value = n, this.schedule(), w;
	}
	schedule() {
		Z.add(this);
	}
	flush() {
		!this.isConnected || !this.node.isConnected || (this.binding ? this.binding.update?.(this.value) : this.binding = this.factory(this.node, this.value));
	}
	clear() {
		Z.delete(this), this.binding?.destroy?.(), this.binding?.dispose?.(), this.binding = null;
	}
	disconnected() {
		this.clear();
	}
	reconnected() {
		this.factory && this.schedule();
	}
}), Ve = class {
	constructor(e, t = {}, n) {
		this.target = e, this.props = { ...t }, this.state = {}, this.renderer = n, this.abort = new AbortController(), this.cleanups = [], this.disposed = !1;
		let r = /* @__PURE__ */ new Set();
		this.timers = {
			setTimeout: (e, t) => {
				if (this.disposed) return null;
				let n = setTimeout(() => {
					r.delete(n), this.disposed || e();
				}, t);
				return r.add(n), n;
			},
			clearTimeout: (e) => {
				clearTimeout(e), r.delete(e);
			}
		}, this.cleanups.push(() => {
			for (let e of r) clearTimeout(e);
			r.clear();
		});
	}
	update(e) {
		return Object.assign(this.props, e), this.draw(), this;
	}
	draw({ reuseCardContent: e = !1 } = {}) {
		this.disposed || (e || (this.contentVersion = (this.contentVersion ?? 0) + 1), N(this.renderer(this.props, this), this.target));
	}
	refresh = () => this.draw();
	on(e, t, n, r = {}) {
		e.addEventListener(t, n, {
			...r,
			signal: this.abort.signal
		});
	}
	destroy() {
		this.disposed || (this.disposed = !0, this.abort.abort(), this.cleanups.forEach((e) => typeof e == "function" ? e() : e?.dispose?.()), N(w, this.target));
	}
};
Object.freeze({
	icon: !0,
	label: !1,
	appearance: "ghost"
});
var He = (e) => {
	let t = globalThis.taskprogressTheme.control;
	return e.append(t), { destroy() {
		t.parentNode === e && t.remove();
	} };
}, Ue = () => S`<span class="replica-theme" ${Be(He, null)}></span>`, We = (e, t) => {
	let n = z(t);
	return e.append(n), {
		update(e) {
			if (t.href === e.href && t.title === e.title) return;
			t = e;
			let r = z(e);
			n.replaceWith(r), n = r;
		},
		destroy: () => n.remove()
	};
}, Ge = (e) => !e || globalThis.chrome?.webview ? w : S`<span class="replica-back" ${Be(We, e)}></span>`;
await me("document"), history.scrollRestoration = "manual";
var Q = new URLSearchParams(location.search), $ = new class extends Ve {
	constructor(e) {
		super(e, {}, (e, t) => t.template()), this.scope = Q.get("scope") ?? "", this.path = Q.get("path") ?? "", this.card = Q.get("card"), this.message = "載入中…", this.on(window, "hashchange", () => this.reveal());
	}
	owner() {
		if (!this.scope) return null;
		let e = new URLSearchParams({ scope: this.scope });
		return this.card && e.set("pin", this.card), {
			href: `/?${e}`,
			title: `${this.scope} Report`
		};
	}
	async load() {
		if (!this.scope || !this.path) {
			this.failure = "連結缺少 scope 或 path。", this.draw();
			return;
		}
		try {
			let e = await fetch(`/__taskprogress/v1/documents/${encodeURIComponent(this.scope)}?${new URLSearchParams({ path: this.path })}`, {
				headers: { Accept: "application/json" },
				cache: "no-store"
			}), t = await e.json().catch(() => null);
			if (!e.ok) throw Error(t?.detail ? `${t.title}：${t.detail}` : t?.title ?? `HTTP ${e.status}`);
			this.document = t, document.title = `${t.title} — TaskProgress`;
		} catch (e) {
			this.failure = `文件無法開啟。${e instanceof Error ? e.message : ""}`;
		}
		this.draw(), this.reveal(), document.readyState !== "complete" && this.on(window, "load", () => this.reveal(), { once: !0 });
	}
	reveal() {
		let e = decodeURIComponent(location.hash.slice(1));
		e && this.target.querySelector(`[id="${CSS.escape(e)}"]`)?.scrollIntoView({ block: "start" });
	}
	template() {
		let e = this.document;
		return S`<main class="document-page"><header class="checklist-header"><div><div class="replica-title-row">${Ge(this.owner())}<h1>${e?.title ?? "TaskProgress 文件"}</h1></div><p class="document-path"><code>${this.scope}</code> › ${this.path}</p></div>${Ue()}</header>
      ${e ? S`<article class="document-body">${fe(e.html)}</article>` : S`<p class=${this.failure ? "checklist-notice checklist-error" : "checklist-notice"} role=${this.failure ? "alert" : "status"}>${this.failure ?? this.message}</p>`}</main>`;
	}
}(document.querySelector("#app"));
$.draw(), await $.load(), globalThis.taskprogressWebUi = {
	kind: "document",
	app: $
}, addEventListener("pagehide", (e) => {
	e.persisted || $.destroy();
});
//#endregion
