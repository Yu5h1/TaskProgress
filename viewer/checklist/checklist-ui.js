import { bindReorder as e, registerUi as t } from "../assets/web/ui/index.js";
import { applyTheme as n, loadThemePreference as r, preferenceWithMode as i, saveThemePreference as a } from "../assets/web/theme/index.js";
import "../assets/expandable-text.js";
import { inlineLinks as o } from "../assets/inline-links.js";
import { displayCards as s, moveVisibleCard as c, promotePin as l } from "../assets/card-order.js";
import { loadDisclosure as u, saveDisclosure as d } from "../assets/card-disclosure-state.js";
import { DEFAULT_CAPSULE_ID as f, createFilterSelection as p, groupingOrder as m, isDefaultLit as h, loadFilterSelection as g, saveFilterSelection as ee, toggleDefault as te, toggleTag as ne } from "../assets/filter-selection.js";
import { createLinkSelection as re, documentLinkTarget as ie, readLinkSelection as ae } from "../assets/link-selection.js";
import { copyText as oe } from "../assets/item-reference.js";
import { checklistFilterCategories as se, createChecklistEditorSession as ce, filterChecklistBySelection as le, filterOperableChecks as ue, isTagged as _, lockReason as de, orderChecklistItems as fe } from "../assets/checklist-editor.js";
import { stackChecklistItems as pe } from "../assets/completed-stacking.js";
import { createPersistenceController as me } from "../assets/persistence-mode.js";
import { createChecklistFilterOrder as he } from "../assets/checklist-filter-order.js";
import { createDocumentTransport as ge } from "../assets/document-transport.js";
import { installForegroundRefresh as _e } from "../assets/foreground-refresh.js";
import { installFocusShield as ve } from "../assets/focus-shield.js";
//#region viewer/assets/theme-model.js
var ye = "task-progress.theme.v1";
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
var be = Object.freeze({ defaultMode: "system" });
//#endregion
//#region ui/web-workflow/bootstrap.mjs
function v(e = null) {
	let t = document.createElement("a");
	t.className = "demo-back-link", t.href = e?.href ?? "/", t.setAttribute("aria-label", e ? `回到 ${e.title}` : "上一頁"), t.title = e ? `回到 ${e.title}` : "上一頁";
	let n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
	})) n.setAttribute(e, t);
	let r = document.createElementNS("http://www.w3.org/2000/svg", "path");
	return r.setAttribute("d", "M19 12H5m6-6-6 6 6 6"), n.append(r), t.append(n), e || t.addEventListener("click", (e) => {
		if (!(e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) try {
			document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1 && (e.preventDefault(), history.back());
		} catch {}
	}), t;
}
async function xe(e) {
	t(), document.documentElement.dataset.taskprogressUi = "web-ui-workflow";
	let o = be, s = globalThis.taskprogressThemeBoot, c = s?.preference ?? r(() => localStorage, "task-progress.theme.v1", o);
	s?.controller.dispose(), delete globalThis.taskprogressThemeBoot;
	let l = document.createElement("ui-theme-control"), u = matchMedia("(prefers-color-scheme: dark)"), d, f = () => {
		l.preference = c, l.systemScheme = u.matches ? "dark" : "light", document.documentElement.dataset.theme = c.mode, c.mode === "custom" ? document.documentElement.dataset.themeBase = c.custom.base : delete document.documentElement.dataset.themeBase;
	}, p = () => {
		d || (c = r(() => localStorage, ye, o), d = n(document.documentElement, c, o), u.addEventListener("change", f), f());
	}, m = (e) => (c = a(() => localStorage, ye, e, o), d?.update(c), f(), c);
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
			t.className = "replica-title-row", e.before(t), t.append(v(), e);
		}
	}
	let h = new URLSearchParams(location.search).get("scope"), g = e !== "viewer" && typeof globalThis.chrome?.webview?.postMessage == "function", ee = g;
	if (!g && h) try {
		let e = await fetch("/__taskprogress/v1/capabilities/" + encodeURIComponent(h));
		ee = e.ok && (await e.json()).editable;
	} catch {}
	return {
		editable: ee,
		desktop: g
	};
}
//#endregion
//#region node_modules/@lit/reactive-element/css-tag.js
var y = globalThis, Se = y.ShadowRoot && (y.ShadyCSS === void 0 || y.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ce = Symbol(), we = /* @__PURE__ */ new WeakMap(), Te = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== Ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (Se && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = we.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && we.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, Ee = (e) => new Te(typeof e == "string" ? e : e + "", void 0, Ce), De = (e, t) => {
	if (Se) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = y.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, Oe = Se ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return Ee(t);
})(e) : e, { is: ke, defineProperty: Ae, getOwnPropertyDescriptor: je, getOwnPropertyNames: Me, getOwnPropertySymbols: Ne, getPrototypeOf: Pe } = Object, b = globalThis, Fe = b.trustedTypes, Ie = Fe ? Fe.emptyScript : "", Le = b.reactiveElementPolyfillSupport, x = (e, t) => e, S = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Ie : null;
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
}, Re = (e, t) => !ke(e, t), ze = {
	attribute: !0,
	type: String,
	converter: S,
	reflect: !1,
	useDefault: !1,
	hasChanged: Re
};
Symbol.metadata ??= Symbol("metadata"), b.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var C = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ze) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Ae(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = je(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? ze;
	}
	static _$Ei() {
		if (this.hasOwnProperty(x("elementProperties"))) return;
		let e = Pe(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(x("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
			let e = this.properties, t = [...Me(e), ...Ne(e)];
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
			for (let e of n) t.unshift(Oe(e));
		} else e !== void 0 && t.push(Oe(e));
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
		return De(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? S : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? S : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Re)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[x("elementProperties")] = /* @__PURE__ */ new Map(), C[x("finalized")] = /* @__PURE__ */ new Map(), Le?.({ ReactiveElement: C }), (b.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var w = globalThis, Be = (e) => e, T = w.trustedTypes, Ve = T ? T.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, E = "$lit$", D = `lit$${Math.random().toFixed(9).slice(2)}$`, He = "?" + D, Ue = `<${He}>`, O = document, k = () => O.createComment(""), A = (e) => e === null || typeof e != "object" && typeof e != "function", We = Array.isArray, Ge = (e) => We(e) || typeof e?.[Symbol.iterator] == "function", Ke = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, qe = /-->/g, Je = />/g, M = RegExp(`>|${Ke}(?:([^\\s"'>=/]+)(${Ke}*=${Ke}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, Xe = /"/g, Ze = /^(?:script|style|textarea|title)$/i, Qe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), N = Qe(1), P = Qe(2), F = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), L = O.createTreeWalker(O, 129);
function et(e, t) {
	if (!We(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Ve === void 0 ? t : Ve.createHTML(t);
}
var tt = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = qe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (Ze.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = Je : o === M ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? Xe : Ye) : o === Xe || o === Ye ? o = M : o === qe || o === Je ? o = j : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + Ue : l >= 0 ? (r.push(s), n.slice(0, l) + E + n.slice(l) + D + d) : n + D + (l === -2 ? t : d);
	}
	return [et(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, R = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = tt(t, n);
		if (this.el = e.createElement(l, r), L.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = L.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(E)) {
					let t = u[o++], n = i.getAttribute(e).split(D), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? rt : r[1] === "?" ? it : r[1] === "@" ? at : V
					}), i.removeAttribute(e);
				} else e.startsWith(D) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ze.test(i.tagName)) {
					let e = i.textContent.split(D), t = e.length - 1;
					if (t > 0) {
						i.textContent = T ? T.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], k()), L.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], k());
					}
				}
			} else if (i.nodeType === 8) if (i.data === He) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(D, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += D.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = O.createElement("template");
		return n.innerHTML = e, n;
	}
};
function z(e, t, n = e, r) {
	if (t === F) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = A(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = z(e, i._$AS(e, t.values), i, r)), t;
}
var nt = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? O).importNode(t, !0);
		L.currentNode = r;
		let i = L.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new B(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ot(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = L.nextNode(), a++);
		}
		return L.currentNode = O, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, B = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = z(this, e, t), A(e) ? e === I || e == null || e === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : e !== this._$AH && e !== F && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== I && A(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = R.createElement(et(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new nt(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = $e.get(e.strings);
		return t === void 0 && $e.set(e.strings, t = new R(e)), t;
	}
	k(t) {
		We(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(k()), this.O(k()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = Be(e).nextSibling;
			Be(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, V = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = I, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = I;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = z(this, e, t, 0), a = !A(e) || e !== this._$AH && e !== F, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = z(this, r[n + o], t, o), s === F && (s = this._$AH[o]), a ||= !A(s) || s !== this._$AH[o], s === I ? e = I : e !== I && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, rt = class extends V {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === I ? void 0 : e;
	}
}, it = class extends V {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== I);
	}
}, at = class extends V {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = z(this, e, t, 0) ?? I) === F) return;
		let n = this._$AH, r = e === I && n !== I || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== I && (n === I || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ot = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		z(this, e);
	}
}, st = {
	M: E,
	P: D,
	A: He,
	C: 1,
	L: tt,
	R: nt,
	D: Ge,
	V: z,
	I: B,
	H: V,
	N: it,
	U: at,
	B: rt,
	F: ot
}, ct = w.litHtmlPolyfillSupport;
ct?.(R, B), (w.litHtmlVersions ??= []).push("3.3.3");
var lt = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new B(t.insertBefore(k(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ut = globalThis, H = class extends C {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = lt(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return F;
	}
};
H._$litElement$ = !0, H.finalized = !0, ut.litElementHydrateSupport?.({ LitElement: H });
var dt = ut.litElementPolyfillSupport;
dt?.({ LitElement: H }), (ut.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var U = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, W = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), G = class {
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
}, { I: ft } = st, pt = (e) => e, mt = (e) => e.strings === void 0, ht = () => document.createComment(""), K = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new ft(r.insertBefore(ht(), i), r.insertBefore(ht(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = pt(e).nextSibling;
				pt(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, q = (e, t, n = e) => (e._$AI(t, n), e), gt = {}, _t = (e, t = gt) => e._$AH = t, vt = (e) => e._$AH, yt = (e) => {
	e._$AR(), e._$AA.remove();
}, bt = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, xt = W(class extends G {
	constructor(e) {
		if (super(e), e.type !== U.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = vt(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = q(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = q(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = q(i[d], a[m]), K(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = q(i[f], a[p]), K(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = bt(o, p, m), u = bt(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = K(e, i[d]);
				q(t, a[p]), c[p] = t;
			} else c[p] = q(n, a[p]), K(e, i[d], n), i[t] = null;
			p++;
		} else yt(i[f]), f--;
		else yt(i[d]), d++;
		for (; p <= m;) {
			let t = K(e, c[m + 1]);
			q(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && yt(e);
		}
		return this.ut = o, _t(e, c), F;
	}
}), St = {}, Ct = W(class extends G {
	constructor() {
		super(...arguments), this.ot = St;
	}
	render(e, t) {
		return t();
	}
	update(e, [t, n]) {
		if (Array.isArray(t)) {
			if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((e, t) => e === this.ot[t])) return F;
		} else if (this.ot === t) return F;
		return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, n);
	}
}), wt = W(class extends G {
	constructor(e) {
		if (super(e), e.type !== U.PROPERTY && e.type !== U.ATTRIBUTE && e.type !== U.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!mt(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === F || t === I) return t;
		let n = e.element, r = e.name;
		if (e.type === U.PROPERTY) {
			if (t === n[r]) return F;
		} else if (e.type === U.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return F;
		} else if (e.type === U.ATTRIBUTE && n.getAttribute(r) === t + "") return F;
		return _t(e), t;
	}
}), J = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), J(e, t);
	return !0;
}, Y = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, Tt = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), Ot(t);
	}
};
function Et(e) {
	this._$AN === void 0 ? this._$AM = e : (Y(this), this._$AM = e, Tt(this));
}
function Dt(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) J(r[e], !1), Y(r[e]);
	else r != null && (J(r, !1), Y(r));
	else J(this, e);
}
var Ot = (e) => {
	e.type == U.CHILD && (e._$AP ??= Dt, e._$AQ ??= Et);
}, kt = class extends G {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Tt(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (J(this, e), Y(this));
	}
	setValue(e) {
		if (mt(this._$Ct)) this._$Ct._$AI(e, this);
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
function At(e = queueMicrotask) {
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
//#region ui/web-workflow/enabled-action.mjs
function jt(e, t = (e) => e.enabled !== !1) {
	return (n, r) => {
		let i, a = (r) => {
			t(r) ? i ? i.update?.(r) : i = e(n, r) : (i?.destroy(), i = void 0);
		};
		return a(r), {
			update: a,
			destroy() {
				i?.destroy(), i = void 0;
			}
		};
	};
}
//#endregion
//#region ui/web-workflow/common.mjs
var Mt = At(), X = W(class extends kt {
	render() {
		return I;
	}
	update(e, [t, n]) {
		return this.node = e.element, this.factory !== t && (this.clear(), this.factory = t), this.value = n, this.schedule(), I;
	}
	schedule() {
		Mt.add(this);
	}
	flush() {
		!this.isConnected || !this.node.isConnected || (this.binding ? this.binding.update?.(this.value) : this.binding = this.factory(this.node, this.value));
	}
	clear() {
		Mt.delete(this), this.binding?.destroy?.(), this.binding?.dispose?.(), this.binding = null;
	}
	disconnected() {
		this.clear();
	}
	reconnected() {
		this.factory && this.schedule();
	}
}), Nt = (e) => {
	let t = String(e ?? "");
	return t.includes("[") ? N`<span ${X(o, { text: t })}></span>` : t;
}, Z = (e = !1, t = !1) => P`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e ? P`<path d="M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3" />` : P`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />`}${t ? P`<path d="M3 3l18 18" />` : I}</svg>`, Pt = (e) => P`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${e === "free" ? P`<path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />` : P`<path d=${e === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d=${e === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />`}</svg>`, Ft = (e, t, n = null, r = !1) => {
	let i = `${t}：${r ? "需重驗" : {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}[e] ?? e}`, a = {
		pending: "",
		passed: "✓",
		failed: "!"
	}[e] ?? "?";
	return n ? N`<button type="button" class="marker-box marker-${e} ${r ? "marker-stale" : ""} marker-box-button" aria-label="${i}，點擊切換下一個結果" @click=${n}><span aria-hidden="true">${a}</span></button>` : N`<span class="marker-box marker-${e} ${r ? "marker-stale" : ""}" role="img" aria-label=${i}><span aria-hidden="true">${a}</span></span>`;
}, It = (e, t) => {
	let n = t, r, i = 0, a = async (t) => {
		t.stopPropagation(), clearTimeout(r);
		let a = ++i, o = !1;
		try {
			o = await (n.copy ? n.copy() : oe(String(n.id)));
		} catch {}
		!e.isConnected || a !== i || (e.textContent = o ? "✓" : "✕", e.classList.add("is-done"), e.classList.toggle("is-copied", o), n.feedbackTitle && (e.title = o ? "已複製" : "無法複製"), r = setTimeout(() => {
			e.isConnected && (e.textContent = "⧉", e.classList.remove("is-done", "is-copied"), n.feedbackTitle && (e.title = n.title));
		}, 1500));
	};
	return e.addEventListener("click", a), {
		update: (e) => {
			n = e;
		},
		destroy() {
			i++, clearTimeout(r), e.removeEventListener("click", a);
		}
	};
}, Lt = (e, t) => N`<button type="button" class="task-id-copy" title=${String(e)} aria-label="複製「${t}」的卡片 ID" ${X(It, { id: e })}>⧉</button>`, Rt = ({ cells: e = [], form: t = "segmented", ratio: n = 0, label: r = "", extraClass: i = "" } = {}) => t === "segmented" ? N`<div class="progress-bar progress-bar-segmented ${i}" role="img" aria-label=${r}>${e.map((e) => N`<i class="progress-cell progress-tone-${e}"></i>`)}</div>` : N`<progress class="progress-meter ${i}" max="100" .value=${Math.max(0, Math.min(100, n * 100))} aria-label=${r}></progress>`, zt = ({ bar: e, caption: t, note: n = "" }) => N`<section class="progress-summary" aria-label="進度摘要">${Rt({
	...e,
	label: t
})}<p class="progress-caption"><span>${t}</span>${n ? N`<span class="progress-note">${n}</span>` : I}</p></section>`, Bt = class {
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
		this.disposed || (e || (this.contentVersion = (this.contentVersion ?? 0) + 1), lt(this.renderer(this.props, this), this.target));
	}
	refresh = () => this.draw();
	on(e, t, n, r = {}) {
		e.addEventListener(t, n, {
			...r,
			signal: this.abort.signal
		});
	}
	destroy() {
		this.disposed || (this.disposed = !0, this.abort.abort(), this.cleanups.forEach((e) => typeof e == "function" ? e() : e?.dispose?.()), lt(I, this.target));
	}
}, Vt = jt((t, n) => {
	let r = n, i = !1, a = new AbortController(), o = /* @__PURE__ */ new Map(), s = () => {
		let e = r.previewClasses ?? {};
		for (let n of /* @__PURE__ */ new Set([...o.keys(), ...t.children])) {
			let r = /* @__PURE__ */ new Set();
			if (n.parentElement === t) {
				let t = e[n.getAttribute("data-reorder-over")];
				t && r.add(t), e.dragging && n.hasAttribute("data-reorder-dragging") && r.add(e.dragging);
			}
			let i = o.get(n) ?? /* @__PURE__ */ new Set();
			for (let e of i) r.has(e) || n.classList.remove(e);
			for (let e of r) n.classList.contains(e) || n.classList.add(e);
			r.size ? o.set(n, r) : o.delete(n);
		}
	}, c = new t.ownerDocument.defaultView.MutationObserver((e) => {
		e.some((e) => e.type === "childList" ? e.target === t : e.target.parentElement === t) && s();
	});
	n.previewClasses && (s(), c.observe(t, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["data-reorder-over", "data-reorder-dragging"]
	}));
	let l, u = () => {
		l &&= (l.removeAttribute("data-reorder-handle"), l.draggable = !1, null);
	}, d = (e) => {
		if (u(), !r.surface) return;
		let n = [...t.children].find((t) => t.contains(e.target));
		if (!n || n.dataset.reorderSortable === "false") return;
		let i = e.type === "keydown" && e.target === n && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key), a = r.surface === "item" ? "a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg" : "button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg", o = e.type === "pointerdown" && e.button === 0 && e.pointerType === "mouse" && !e.target.closest(a);
		(i || o) && (l = n, n.setAttribute("data-reorder-handle", ""), n.draggable = !0);
	};
	t.addEventListener("pointerdown", d, {
		capture: !0,
		signal: a.signal
	}), t.addEventListener("keydown", d, {
		capture: !0,
		signal: a.signal
	}), t.ownerDocument.addEventListener("pointerup", u, { signal: a.signal }), t.ownerDocument.addEventListener("dragend", u, { signal: a.signal });
	let f = e(t, (e) => {
		let n = r.onMove(e);
		r.focusAfterMove && Promise.resolve(n).then(() => queueMicrotask(() => {
			i || !t.isConnected || [...t.children].find((t) => t.dataset.reorderId === e.id)?.focus();
		}));
	}, { axis: n.axis ?? "horizontal" });
	return {
		update: (e) => {
			let t = r.previewClasses ?? {}, n = e.previewClasses ?? {};
			r = e, (o.size || [
				"before",
				"after",
				"dragging"
			].some((e) => t[e] !== n[e])) && s();
		},
		destroy() {
			i = !0, u(), a.abort(), f.dispose(), c.disconnect();
			for (let [e, t] of o) for (let n of t) e.classList.remove(n);
			o.clear();
		}
	};
});
function Ht(e = [], t = {}) {
	return N`<div class="horizontal-capsule-strip ${t.className ?? ""}" role="toolbar" aria-label=${t.ariaLabel ?? "模組"}
    ${X(Vt, {
		axis: "horizontal",
		focusAfterMove: !0,
		previewClasses: {
			before: "capsule-drop-before",
			after: "capsule-drop-after",
			dragging: "capsule-dragging"
		},
		onMove: (e) => t.onReorder?.(e.id, e.targetId, e.placement === "after")
	})}>
    ${xt(e, (e) => e.id, (e) => N`<button type="button" data-capsule-id=${e.id} data-reorder-capsule=${String(e.sortable !== !1)} data-reorder-id=${e.id} data-reorder-handle data-reorder-sortable=${String(e.sortable !== !1)}
      class="capsule-button ${e.className ?? ""} ${e.sortable === !1 ? "" : "capsule-sortable"}" aria-pressed=${e.pressed ?? I}
      aria-label=${e.ariaLabel ?? e.label} aria-keyshortcuts=${e.sortable === !1 ? I : "Alt+ArrowLeft Alt+ArrowRight"} title=${e.title ?? I} ?disabled=${e.disabled} draggable=${e.sortable !== !1}
      @click=${() => t.onActivate?.(e.id)}><span>${e.label}</span>${e.showDot ? N`<span class="time-risk-dot ${e.dotClass ?? ""}"></span>` : I}${e.showChevron ? N`<span class="time-chevron">›</span>` : I}</button>`)}
  </div>`;
}
function Ut(e = {}) {
	let t = new Map((e.categories ?? []).map((e) => [e.id, e])), n = e.order?.length ? e.order : [f, ...t.keys()], r = n.find((e) => !t.has(e)), i = e.defaultLabel ?? "預設";
	return Ht(n.map((n) => n === r ? {
		id: n,
		label: i,
		ariaLabel: `${i}，${e.defaultLit ? "已全選" : "選取全部"}`,
		title: e.reorderable ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
		pressed: !!e.defaultLit,
		className: `filter-button filter-default${e.reorderable ? " status-sortable" : ""}`,
		sortable: !!e.reorderable
	} : t.has(n) ? {
		...t.get(n),
		id: n,
		label: t.get(n).label + (t.get(n).count == null ? "" : ` ${t.get(n).count}`),
		pressed: e.selected?.has(n),
		className: `filter-button${e.reorderable && t.get(n).sortable !== !1 ? " status-sortable" : ""}`,
		sortable: !!e.reorderable && t.get(n).sortable !== !1
	} : null).filter(Boolean), {
		className: `filter-strip ${e.className ?? ""}`,
		ariaLabel: e.ariaLabel ?? "篩選",
		onReorder: e.onReorder,
		onActivate: (t) => t === r ? e.onSelectDefault?.() : e.onSelect?.(t)
	});
}
var Wt = Object.freeze({
	icon: !0,
	label: !1,
	appearance: "ghost"
});
function Gt(e, t, n, r, i, a, o = "both") {
	return N`<ui-option-picker class="icon-choice" aria-label=${i} .label=${i} .options=${n}
    .value=${r} .interaction=${o} .delay=${300} orientation="vertical"
    .triggerDisplay=${Wt} .optionDisplay=${Wt}
    @choice-request=${(e) => a(e.detail.id)}></ui-option-picker>`;
}
function Kt({ id: e, label: t, expanded: n = !0, toggle: r, visibilityEnabled: i = !1, visible: a = !0, onVisibleChange: o }, s, c) {
	return N`<div class="card-disclosure-heading ${n ? "" : "card-disclosure-collapsed"}"><button type="button" class="card-disclosure-toggle" aria-expanded=${n} aria-controls=${e} aria-label="${n ? "收合" : "展開"} ${t}" @click=${() => r(!n)}><span aria-hidden="true">${n ? "▼" : "▶"}</span></button>
  ${i ? N`<button type="button" class="card-visibility-toggle card-toolbar-icon" aria-pressed=${a} aria-label="${a ? "隱藏" : "顯示"} ${t}" @click=${() => o(!a)}>${Z(!a)}</button>` : I}${s}</div><div id=${e} class="card-disclosure-body" ?hidden=${!n}>${c}</div>`;
}
var qt = class {
	constructor(e) {
		this.view = e, this.order = [], this.pins = [], this.mode = "forward", this.visibility = "disabled", this.hidden = [], this.selected = null, this.expanded = !0, this.overrides = {}, this.key = null, this.linkSelection = re(ae(location.search));
		let t = (t) => {
			let n = t.target.closest(".arrangeable-card");
			(!n || !e.target.contains(n)) && this.select(null);
		};
		e.on(document, "pointerdown", t, { capture: !0 }), e.on(document, "focusin", t, { capture: !0 }), e.on(document, "keydown", (e) => {
			e.key === "Escape" && !e.isComposing && (this.select(null), document.activeElement?.closest(".arrangeable-card") && document.activeElement.blur());
		}, { capture: !0 }), e.on(window, "blur", () => this.select(null));
	}
	select(e) {
		this.selected !== e && (this.selected = e, this.props?.onSelectionChange?.(e), this.view.draw());
	}
	isExpanded(e) {
		return this.overrides[e] ?? this.expanded;
	}
	orderedIds(e = this.props?.items ?? []) {
		return s(e, this.order, this.mode, this.props?.pinEnabled ? this.pins : [], this.props?.nextId).map((e) => e.id);
	}
	expand(e, t) {
		this.overrides[e] = t, d(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	all(e) {
		this.expanded = e, this.overrides = {}, d(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	persist(e = !1) {
		try {
			this.key && (localStorage.setItem(this.key, JSON.stringify(this.order)), localStorage.setItem(`${this.key}:pins`, JSON.stringify(this.pins)), localStorage.setItem(`${this.key}:mode`, this.mode), sessionStorage.setItem(`${this.key}:visibility`, JSON.stringify({
				mode: this.visibility,
				hiddenIds: this.hidden
			})));
		} catch {}
		this.view.draw({ reuseCardContent: e });
	}
	render(e, t, n = I, r = I) {
		this.props = e;
		let i = e.storageKey ?? null;
		if (this.key !== i && (this.key = i, this.lastPin = null, this.order = [], this.pins = [], this.mode = "forward", this.hidden = [], this.visibility = "disabled", this.selected = null, i)) try {
			let e = JSON.parse(localStorage.getItem(i)), t = JSON.parse(localStorage.getItem(`${i}:pins`)), n = JSON.parse(sessionStorage.getItem(`${i}:visibility`)), r = localStorage.getItem(`${i}:mode`);
			this.order = Array.isArray(e) ? e : [], this.pins = Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : [], this.mode = [
				"forward",
				"reverse",
				"free"
			].includes(r) ? r : Array.isArray(e) ? "free" : "forward", this.visibility = [
				"enabled",
				"closed",
				"disabled"
			].includes(n?.mode) ? n.mode : n?.enabled === !0 ? "enabled" : "disabled", this.hidden = Array.isArray(n?.hiddenIds) ? n.hiddenIds : [];
		} catch {}
		let a = e.disclosureKey ?? `taskprogress.disclosure:${i ?? location.href}`;
		if (this.disclosureKey !== a) {
			this.disclosureKey = a;
			let e = u(a);
			this.expanded = e.expanded, this.overrides = e.overrides;
		}
		if (e.requestedPin && this.lastPin !== e.requestedPin && (e.allIds ?? e.items.map((e) => e.id)).includes(e.requestedPin)) {
			this.pins = l(this.pins, e.requestedPin), this.overrides[e.requestedPin] = !0, this.hidden = this.hidden.filter((t) => t !== e.requestedPin), this.visibility === "closed" && (this.visibility = "enabled"), this.lastPin = e.requestedPin;
			try {
				i && localStorage.setItem(`${i}:pins`, JSON.stringify(this.pins));
			} catch {}
		}
		let o = s(e.items, e.heldOrder ?? this.order, e.heldOrder ? "free" : this.mode, e.pinEnabled ? this.pins : [], e.nextId), d = this.linkSelection.claim(o.map((e) => e.id));
		d && (this.selected = d.id, this.hidden = this.hidden.filter((e) => e !== d.id), this.visibility === "closed" && (this.visibility = "enabled"), queueMicrotask(() => {
			if (this.view.disposed || this.selected !== d.id) return;
			e.onSelectionChange?.(d.id), this.view.draw();
			let t = [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(d.id));
			t?.focus({ preventScroll: !0 }), t?.scrollIntoView({ block: "center" });
		}));
		let f = this.linkSelection.selectionChanged(this.selected), p = (e) => this.visibility !== "closed" && (this.visibility !== "enabled" || !this.hidden.includes(e.id)), m = (t) => {
			this.mode !== "free" || e.pinEnabled && (this.pins.includes(t.id) || this.pins.includes(t.targetId)) || (this.order = c(e.allIds ?? o.map((e) => e.id), this.order, o.filter((t) => p(t) && !(e.pinEnabled && this.pins.includes(t.id))).map((e) => e.id), t.id, t.targetId, t.placement === "after"), e.onSelectionChange?.(null), this.selected = t.id, e.onSelectionChange?.(t.id), this.persist(), queueMicrotask(() => [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(t.id))?.focus()));
		}, h = o.find(p)?.id;
		return N`<div class="card-list-controls"><div class="card-list-heading"><p class="section-kicker">工作項目</p>${n}</div><div class="card-list-tools">
      <button type="button" class="card-toolbar-icon" aria-label=${this.expanded ? "全部收合" : "全部展開"} @click=${() => this.all(!this.expanded)}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d=${this.expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      ${Gt(this.view, "order", [
			"forward",
			"reverse",
			"free"
		].map((e) => ({
			id: e,
			label: {
				forward: "順排",
				reverse: "逆排",
				free: "自由排序（可拖曳）"
			}[e],
			icon: Pt(e)
		})), this.mode, "排序", (e) => {
			this.mode = e, this.persist(!0);
		})}
      ${Gt(this.view, "visibility", [
			{
				id: "enabled",
				label: "啟用",
				icon: Z()
			},
			{
				id: "closed",
				label: "全體關閉",
				icon: Z(!0)
			},
			{
				id: "disabled",
				label: "禁用",
				icon: Z(!1, !0)
			},
			{
				id: "reset",
				label: "重置",
				kind: "action",
				icon: N`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>`
			}
		], this.visibility, "可見性", (e) => {
			e === "reset" ? (this.hidden = [], this.visibility = "enabled") : this.visibility = e, this.persist();
		}, "picker")}${r}
    </div></div><div class="arrangeable-cards" ${X(Vt, {
			axis: "vertical",
			surface: !0,
			previewClasses: {
				before: "card-drop-before",
				after: "card-drop-after"
			},
			onMove: m
		})}>
    ${xt(o, (e) => e.id, (n, r) => N`<div class="arrangeable-card ${this.selected === n.id ? "card-selected" : ""}" role="group" tabindex="0" data-render-window data-card-id=${n.id} data-reorder-id=${n.id} data-reorder-sortable=${String(this.mode === "free" && !this.pins.includes(n.id))}
      aria-label=${`${n.title ?? n.question ?? ""}${this.selected === n.id ? "，已選取" : ""}`} data-link-tone=${this.selected === n.id ? f ?? I : I} ?hidden=${!p(n)}
      @pointerdown=${(e) => {
			e.button === 0 && this.select(n.id);
		}} @focusin=${() => this.select(n.id)} @keydown=${(e) => {
			e.target === e.currentTarget && ["Enter", " "].includes(e.key) && (e.preventDefault(), this.select(n.id));
		}}>
      ${e.pinEnabled ? N`<button type="button" class="card-pin ${this.pins.includes(n.id) ? "is-pinned" : ""} ${n.id === e.nextId ? "is-next" : ""}" aria-label="${this.pins.includes(n.id) ? "取消釘選" : "釘選置頂"}：${n.title}" aria-pressed=${this.pins.includes(n.id)} @click=${() => {
			this.pins = this.pins.includes(n.id) ? this.pins.filter((e) => e !== n.id) : l(this.pins, n.id), this.persist();
		}}><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill=${this.pins.includes(n.id) ? "currentColor" : "none"} stroke="currentColor" stroke-width="1.6" /></svg></button>` : I}
      ${Ct([
			this.view.contentVersion,
			n,
			n.id === h,
			this.isExpanded(n.id),
			this.visibility,
			this.hidden.includes(n.id)
		], () => t(n, {
			lead: n.id === h,
			expanded: this.isExpanded(n.id),
			toggle: (e) => this.expand(n.id, e),
			visibilityEnabled: this.visibility === "enabled",
			visible: !this.hidden.includes(n.id),
			onVisibleChange: (e) => {
				this.hidden = e ? this.hidden.filter((e) => e !== n.id) : [...this.hidden, n.id], this.persist();
			}
		}))}
      ${this.mode === "free" ? N`<button type="button" class="replica-card-grip" data-reorder-handle draggable="true" aria-label="移動 ${n.title ?? n.question}">⠿</button>` : I}
    </div>`)}</div>${e.hiddenCount > 0 ? N`<p class="card-list-hidden"><button type="button" class="card-list-hidden-link" @click=${e.onShowHidden}>…顯示隱藏項目(${e.hiddenCount})</button></p>` : I}`;
	}
};
function Jt(e) {
	t();
	let n = {
		canClear: !1,
		entries: [],
		undoDepth: 0,
		redoDepth: 0,
		...e.history,
		canUndo: !!e.canUndo,
		canRedo: !!e.canRedo
	};
	return N`<span class="edit-save-status" id="edit-save-status" role="status">${e.message ?? ""}</span><ui-edit-history .history=${n} .panelAvailable=${!1} .disabled=${!!e.saving}
    @history-request=${(t) => {
		e.saving || (t.detail.action === "undo" && e.canUndo ? e.onUndo?.() : t.detail.action === "redo" && e.canRedo && e.onRedo?.());
	}}></ui-edit-history>
  ${e.onToggleCautious ? N`<button type="button" class="secondary-button edit-mode-button" aria-pressed=${!!e.cautious} ?disabled=${e.saving} @click=${() => e.onToggleCautious(!e.cautious)}>謹慎模式</button>` : I}
  ${e.cautious ? N`<button type="button" class="secondary-button edit-discard-button" ?disabled=${e.saving} @click=${e.onDiscard}>放棄</button><button type="button" class="primary-button edit-save-button" ?disabled=${!e.dirty || e.saving} @click=${e.onSave}>${e.saving ? "正在儲存…" : "儲存"}</button>` : I}`;
}
var Yt = (e, t) => {
	let n = t, r = () => n.onClose?.();
	e.addEventListener("ui-close", r);
	let i = (t) => {
		n = t, n.open ? e.show(void 0, n.initialFocus ? e.querySelector(n.initialFocus) : void 0) : e.close();
	};
	return i(n), {
		update: i,
		destroy() {
			e.removeEventListener("ui-close", r), e.close();
		}
	};
}, Xt = (e, n) => (t(), N`<ui-dialog id=${e.id ?? I} class=${e.className ?? ""} .heading=${e.title ?? ""} .kicker=${e.kicker ?? ""} .closeLabel=${e.closeLabel ?? ""} .dismissDisabled=${!!e.busy} .dismissOnBackdrop=${e.dismissOnBackdrop ?? !0} ${X(Yt, e)}>${e.open ? n : I}</ui-dialog>`), Zt = (e) => {
	let t = globalThis.taskprogressTheme.control;
	return e.append(t), { destroy() {
		t.parentNode === e && t.remove();
	} };
}, Qt = () => N`<span class="replica-theme" ${X(Zt, null)}></span>`, $t = (e, t) => {
	let n = v(t);
	return e.append(n), {
		update(e) {
			if (t.href === e.href && t.title === e.title) return;
			t = e;
			let r = v(e);
			n.replaceWith(r), n = r;
		},
		destroy: () => n.remove()
	};
}, en = (e) => !e || globalThis.chrome?.webview ? I : N`<span class="replica-back" ${X($t, e)}></span>`, tn = await xe("checklist"), nn = new URLSearchParams(location.search), rn;
try {
	rn = ge("checklist", { params: nn });
} catch (e) {
	rn = { load: () => Promise.reject(e) };
}
var Q = [
	"pending",
	"passed",
	"failed"
], an = {
	pending: "未執行",
	passed: "通過",
	failed: "失敗"
}, on = {
	no_recorder: "需重驗：沒有記錄者",
	fingerprint: "需重驗：內容已變更",
	released: "需重驗：之後重新執行過"
}, $ = new class extends Bt {
	constructor(e, t = {}) {
		super(e, {}, (e, t) => t.template()), this.transport = t.transport ?? rn, this.editable = t.editable ?? tn.editable, this.params = t.params ?? nn, this.storage = t.storage, this.loadGeneration = 0, this.cards = new qt(this), this.message = "正在載入 Checklist…", this.loading = !0, this.operable = !1, this.selection = p(Q), this.orderController = he({ supportedIds: [f, ...Q] }), this.order = this.orderController.order, this.linkRequest = ae(location.search), this.linked = this.linkRequest?.id ?? null, this.held = null, this.activeCard = null, this.resetOpen = !1, this.resetBusy = !1, this.resetTargets = [], this.cleanups.push(ve()), this.cleanups.push(_e({
			canRefresh: () => this.canRefresh(),
			reload: () => this.refreshSource()
		})), this.on(window, "beforeunload", (e) => {
			(this.data?.dirty || this.data?.pending) && (e.preventDefault(), e.returnValue = "");
		});
	}
	canRefresh() {
		return !this.disposed && this.data && !this.data.dirty && !this.data.saving && !this.data.pending && !this.resetOpen && !this.resetBusy;
	}
	install(e) {
		if (this.disposed) return;
		let t, n = () => !this.disposed && this.persistence === t;
		t = me({
			session: ce(e),
			storage: this.storage,
			timers: this.timers,
			save: async (e) => {
				if (!n()) throw Error("Checklist view is no longer active");
				let t = await this.transport.save(e);
				if (!n()) throw Error("Checklist response belongs to an inactive view");
				return t;
			},
			debounceCommand: (e) => e.type === "set-observed",
			onChange: (e) => {
				n() && (this.data = e, this.message = e.message, this.draw());
			}
		}), this.persistence = t, this.data = this.persistence.snapshot(), this.message = this.data.message;
		let r = `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${e.fileName}:${e.roundIdentity}`;
		this.filterKey !== r + ":filters" && (this.filterKey = r + ":filters", this.selection = g(this.filterKey, Q)), this.resolvedLink ||= (this.linked = ie(this.linkRequest, e.items.map((e) => e.id)), !0);
	}
	async load() {
		if (this.disposed) return;
		let e = ++this.loadGeneration, t = () => !this.disposed && e === this.loadGeneration;
		try {
			let e = await this.transport.load();
			if (!t()) return;
			this.install(e), Promise.resolve().then(() => this.transport.loadOwnerReport?.()).then((e) => {
				t() && (this.owner = e, this.draw());
			}).catch(() => {});
		} catch (e) {
			if (!t()) return;
			this.failure = e.message;
		}
		t() && (this.loading = !1, this.draw());
	}
	async refreshSource() {
		if (!this.canRefresh()) return;
		let e = this.persistence, t = this.data.document.revision;
		try {
			let n = await this.transport.load();
			if (!this.canRefresh() || this.persistence !== e || this.data.document.revision !== t || n.revision === t) return;
			let r = this.data.cautious;
			this.install(n), r && await this.persistence.setCautious(!0), this.draw();
		} catch (e) {
			console.warn("Checklist foreground refresh failed:", e);
		}
	}
	apply(e) {
		if (!(this.disposed || !this.persistence || this.resetBusy)) {
			try {
				this.persistence.dispatch(e), this.data = this.persistence.snapshot(), this.message = this.data.message;
			} catch (e) {
				this.message = e.message;
			}
			this.draw();
		}
	}
	async setCautious(e) {
		let t = this.persistence;
		if (this.disposed || !t) return;
		let n = await t.setCautious(e);
		!this.disposed && this.persistence === t && (this.data = n, this.draw());
	}
	async save() {
		let e = this.persistence;
		this.disposed || !e || (await e.save(), !this.disposed && this.persistence === e && (this.data = e.snapshot(), this.draw()));
	}
	cycle(e, t) {
		if (!this.editable) {
			this.message = "此入口目前為唯讀，無法保存結果。", this.draw();
			return;
		}
		t.isAcceptance && t.recorder && t.recorder !== "user" && !confirm("確認修改 agent 紀錄嗎？") || this.apply({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	select(e) {
		this.selection = e, ee(this.filterKey, e), this.draw();
	}
	selectCard(e, t) {
		if (this.activeCard !== e) {
			if (this.activeCard !== null && (this.linked = null), this.activeCard = e, e === null) {
				this.held = null, this.heldOrder = null;
				return;
			}
			this.held = t, this.heldOrder = this.cards.orderedIds(t);
		}
	}
	visible() {
		if (!this.data) return [];
		let e = this.data.document;
		if (this.held) return this.held.flatMap((t) => {
			let n = e.items.find((e) => e.id === t.id);
			return n ? [{
				...n,
				checks: t.checks.flatMap((e) => n.checks.find((t) => t.index === e.index) ?? [])
			}] : [];
		});
		let t = fe(e, this.order), n = {
			...t,
			items: pe(t.items, { asWritten: m(this.order).filter((e) => Q.includes(e)).length === 0 })
		};
		return this.operable && (n = ue(n)), n.items.flatMap((e) => String(e.id) === this.linked ? [e] : le({ items: [e] }, this.selection.selected).items);
	}
	manualTargets() {
		return this.data?.document.items.flatMap((e) => e.checks.filter((e) => e.isManual).map((t) => ({
			workItemId: e.id,
			checkIndex: t.index
		}))) ?? [];
	}
	canReset() {
		let e = this.data;
		return !this.disposed && this.editable && e && !e.dirty && !e.saving && !e.pending && !e.blocked && !this.resetBusy && this.manualTargets().length > 0;
	}
	async reset() {
		if (!this.canReset()) return;
		this.resetBusy = !0;
		let e = this.data.cautious, t = this.persistence;
		try {
			let n = await this.transport.reset({ targets: this.resetTargets });
			if (this.disposed || this.persistence !== t || (this.install(n), await this.setCautious(e), this.disposed)) return;
			this.message = "實機結果已清空；其他檢查結果保留。", this.resetOpen = !1;
		} catch (e) {
			this.disposed || (this.message = e.message);
		} finally {
			this.disposed || (this.resetBusy = !1, this.draw());
		}
	}
	check(e, t) {
		let n = t.isAcceptance ? "acceptance" : t.isManual ? "manual" : null, r = _(t) ? de(this.data.document, t) : null, i = _(t) && !this.resetBusy && (!r || t.status !== "pending");
		return N`<section id="check-${e.id}-${t.index}" tabindex="-1" class="checklist-check checklist-${t.status} ${n ? `checklist-${n}` : ""}">
      <div class="checklist-check-heading">${Ft(t.status, t.title, i ? () => this.cycle(e.id, t) : null, !!t.validity && t.validity !== "valid")}<strong>${t.title}</strong><span class="checklist-owner ${n ? `checklist-owner-${n}` : ""}">${{
			manual: "實機",
			acceptance: "他驗"
		}[n] ?? "Agent"}</span></div>
      ${r && t.status === "pending" ? N`<p class="checklist-lock">${r}</p>` : I}<dl><div><dt>Action</dt><dd>${Nt(t.action)}</dd></div><div><dt>Expect</dt><dd>${Nt(t.expect)}</dd></div>
      ${t.reason ? N`<div><dt>Reason</dt><dd>${t.reason}</dd></div>` : I}
      ${t.observed && !(_(t) && t.status === "failed") ? N`<div><dt>Observed</dt><dd>${t.observed}</dd></div>` : I}
      ${t.resolved ? N`<div><dt>Resolved</dt><dd>${t.resolved}</dd></div>` : I}
      ${t.validity && t.validity !== "valid" ? N`<div><dt>狀態</dt><dd class="checklist-void">${on[t.validity]}</dd></div>` : t.recorder ? N`<div><dt>記錄</dt><dd>${t.recorder === "user" ? "使用者" : t.recorder}</dd></div>` : I}</dl>
      ${t.isAcceptance && t.status === "failed" ? N`<label class="checklist-observed"><span>不通過的原因</span><select ?disabled=${this.resetBusy || !this.editable} .value=${wt(t.rejectReason ?? "implementation")} @change=${(n) => this.apply({
			type: "set-reason",
			workItemId: e.id,
			checkIndex: t.index,
			value: n.currentTarget.value
		})}><option value="implementation">實作不符</option><option value="condition">條件不符</option></select></label>` : I}
      ${_(t) && t.status === "failed" ? N`<label class="checklist-observed"><span>Observed</span><textarea rows="3" ?disabled=${this.resetBusy || !this.editable} .value=${wt(t.observed ?? "")} @input=${(n) => this.apply({
			type: "set-observed",
			workItemId: e.id,
			checkIndex: t.index,
			value: n.currentTarget.value
		})} placeholder="記錄實際看到的結果"></textarea></label>` : I}
    </section>`;
	}
	template() {
		let e = this.data, t = this.visible();
		return N`<main class="checklist-page"><header class="checklist-header"><div><div class="replica-title-row">${en(this.owner)}<h1>${e?.document.fileName ?? "TaskProgress Checklist"}</h1></div>${e ? N`<details class="checklist-round"><summary>本輪依據</summary><p>${e.document.roundIdentity}</p></details>` : I}</div>${Qt()}</header>
      ${this.loading ? N`<p class="checklist-notice" role="status">${this.message}</p>` : e ? N`
      ${zt({
			bar: {
				form: "segmented",
				cells: e.summary.cells
			},
			caption: `${e.summary.checks.passed} / ${e.summary.checks.total} checks 通過`,
			note: e.summary.checks.failed > 0 ? `${e.summary.checks.failed} 個失敗` : ""
		})}
      <label class="checklist-operable-toggle"><input type="checkbox" .checked=${this.operable} @change=${(e) => {
			this.operable = e.currentTarget.checked, this.draw();
		}}><span>只顯示我能操作的檢查</span></label>
      <section class="checklist-items" aria-label="Implementation checklist items">${this.cards.render({
			items: t,
			allIds: fe(e.document, this.order).items.map((e) => e.id),
			storageKey: this.params.has("scope") ? `taskprogress.cards.checklist.v1:${location.pathname}:${this.params.get("scope")}:${this.params.get("task")}:${e.document.roundIdentity}` : null,
			disclosureKey: `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${e.document.fileName}:${e.document.roundIdentity}`,
			heldOrder: this.heldOrder,
			onSelectionChange: (e) => this.selectCard(e, t),
			hiddenCount: e.document.items.length - t.length,
			onShowHidden: () => {
				this.operable = !1, this.select(p(Q));
			}
		}, (t, n) => {
			let r = e.document.items.find((e) => e.id === t.id);
			return N`<article class="checklist-item checklist-${t.status}">${Kt({
				...n,
				id: `checklist-body-${t.id}`,
				label: t.title
			}, N`<header class="checklist-item-header">${Ft(t.status, `工作項目 ${t.id}`)}${Lt(t.id, t.title)}<div><h2>${t.id}. ${t.title}</h2></div><span class="checklist-status" aria-label="通過 ${r.progress.passed}，共 ${r.progress.total}">${r.progress.passed}/${r.progress.total}</span></header>`, N`<div class="checklist-checks"><p class="checklist-outcome">${Nt(t.outcome)}</p>${t.dependsOn.length ? N`<p class="checklist-chips"><span class="checklist-chip">Depends on ${t.dependsOn.join(", ")}</span></p>` : I}${xt(t.checks, (e) => e.index, (e) => this.check(t, e))}</div>`)}</article>`;
		}, Ut({
			categories: se(e.document).map((e) => ({
				...e,
				label: an[e.id]
			})),
			order: this.order,
			selected: this.selection.selected,
			defaultLit: h(this.selection),
			className: "status-filter-strip status-summary-filters",
			ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
			reorderable: !0,
			onSelect: (e) => this.select(ne(this.selection, e)),
			onSelectDefault: () => this.select(te(this.selection)),
			onReorder: (e, t, n) => {
				this.order = [...this.orderController.move(e, t, n)], this.draw();
			}
		}))}</section>
      <footer class="edit-save-bar" data-state=${[
			"incomplete",
			"conflict",
			"error",
			"mode_blocked"
		].includes(e.status) ? "error" : e.saving ? "saving" : "clean"} aria-live="polite" aria-busy=${e.saving || this.resetBusy}>
        ${Jt({
			...e,
			saving: e.saving || this.resetBusy,
			canUndo: e.history.canUndo,
			canRedo: e.history.canRedo,
			message: this.message,
			onToggleCautious: (e) => this.setCautious(e),
			onSave: () => this.save(),
			onUndo: () => {
				this.persistence.undo(), this.draw();
			},
			onRedo: () => {
				this.persistence.redo(), this.draw();
			},
			onDiscard: () => {
				this.data = this.persistence.discard(), this.draw();
			}
		})}
        <button type="button" class="secondary-button checklist-reset-button" ?disabled=${!this.canReset()} @click=${() => {
			this.resetTargets = this.manualTargets().map((e) => ({ ...e })), this.resetOpen = !0, this.draw();
		}}>清空結果</button></footer>` : N`<p class="checklist-notice checklist-error" role="alert">${this.failure}</p>`}</main>
      ${Xt({
			open: this.resetOpen,
			title: "清空結果？",
			onClose: () => {
				this.resetOpen = !1, this.draw();
			}
		}, N`<p>將 ${this.resetTargets.length} 個實機檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。其他檢查結果不受影響。</p><p>此操作無法復原；如需回復，請使用 Git 歷史。</p><div class="theme-dialog-actions"><button type="button" class="secondary-button" @click=${() => {
			this.resetOpen = !1, this.draw();
		}}>取消</button><button type="button" class="primary-button" ?disabled=${this.resetBusy} @click=${() => this.reset()}>確認清空</button></div>`)}`;
	}
}(document.querySelector("#app"));
$.draw(), await $.load(), globalThis.taskprogressWebUi = {
	kind: "checklist",
	app: $,
	editable: tn.editable
}, addEventListener("pagehide", (e) => {
	e.persisted || $.destroy();
});
//#endregion
