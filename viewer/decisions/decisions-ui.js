import { bindButton as e, bindLongPress as t, bindReorder as n, registerUi as r } from "../assets/web/ui/index.js";
import { applyTheme as i, loadThemePreference as a, preferenceWithMode as o, saveThemePreference as s } from "../assets/web/theme/index.js";
import "../assets/expandable-text.js";
import { inlineLinks as c } from "../assets/inline-links.js";
import { displayCards as l, moveVisibleCard as u, promotePin as d, removeNewlyCompletedPins as f, visibleRootCards as p } from "../assets/card-order.js";
import { loadDisclosure as m, saveDisclosure as h } from "../assets/card-disclosure-state.js";
import { DEFAULT_CAPSULE_ID as g, createFilterSelection as _, isDefaultLit as v, loadFilterSelection as ee, saveFilterSelection as y, toggleDefault as b, toggleTag as x } from "../assets/filter-selection.js";
import { createLinkSelection as te, documentLinkTarget as ne, readLinkSelection as re } from "../assets/link-selection.js";
import { createDecisionSession as ie, same as ae } from "../assets/decision-session.js";
import { createDocumentTransport as oe } from "../assets/document-transport.js";
import { stackDecisions as se } from "../assets/completed-stacking.js";
import { installForegroundRefresh as ce } from "../assets/foreground-refresh.js";
import { installFocusShield as le } from "../assets/focus-shield.js";
//#region viewer/assets/theme-model.js
var ue = "task-progress.theme.v1";
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
var de = Object.freeze({ defaultMode: "system" });
//#endregion
//#region ui/web-workflow/bootstrap.mjs
function fe(t = null) {
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
async function pe(e) {
	r(), document.documentElement.dataset.taskprogressUi = "web-ui-workflow";
	let t = de, n = globalThis.taskprogressThemeBoot, c = n?.preference ?? a(() => localStorage, "task-progress.theme.v1", t);
	n?.controller.dispose(), delete globalThis.taskprogressThemeBoot;
	let l = document.createElement("ui-theme-control"), u = matchMedia("(prefers-color-scheme: dark)"), d, f = () => {
		l.preference = c, l.systemScheme = u.matches ? "dark" : "light", document.documentElement.dataset.theme = c.mode, c.mode === "custom" ? document.documentElement.dataset.themeBase = c.custom.base : delete document.documentElement.dataset.themeBase;
	}, p = () => {
		d || (c = a(() => localStorage, ue, t), d = i(document.documentElement, c, t), u.addEventListener("change", f), f());
	}, m = (e) => (c = s(() => localStorage, ue, e, t), d?.update(c), f(), c);
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
			return m(o(c, e, this.systemScheme, t));
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
			t.className = "replica-title-row", e.before(t), t.append(fe(), e);
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
var S = globalThis, me = S.ShadowRoot && (S.ShadyCSS === void 0 || S.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, he = Symbol(), ge = /* @__PURE__ */ new WeakMap(), _e = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== he) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (me && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = ge.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ge.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, ve = (e) => new _e(typeof e == "string" ? e : e + "", void 0, he), ye = (e, t) => {
	if (me) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = S.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, be = me ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return ve(t);
})(e) : e, { is: xe, defineProperty: Se, getOwnPropertyDescriptor: Ce, getOwnPropertyNames: we, getOwnPropertySymbols: Te, getPrototypeOf: Ee } = Object, C = globalThis, De = C.trustedTypes, Oe = De ? De.emptyScript : "", ke = C.reactiveElementPolyfillSupport, w = (e, t) => e, Ae = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Oe : null;
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
}, je = (e, t) => !xe(e, t), Me = {
	attribute: !0,
	type: String,
	converter: Ae,
	reflect: !1,
	useDefault: !1,
	hasChanged: je
};
Symbol.metadata ??= Symbol("metadata"), C.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var T = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = Me) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Se(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Ce(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? Me;
	}
	static _$Ei() {
		if (this.hasOwnProperty(w("elementProperties"))) return;
		let e = Ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(w("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) {
			let e = this.properties, t = [...we(e), ...Te(e)];
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
			for (let e of n) t.unshift(be(e));
		} else e !== void 0 && t.push(be(e));
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
		return ye(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? Ae : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Ae : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? je)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[w("elementProperties")] = /* @__PURE__ */ new Map(), T[w("finalized")] = /* @__PURE__ */ new Map(), ke?.({ ReactiveElement: T }), (C.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var Ne = globalThis, Pe = (e) => e, E = Ne.trustedTypes, Fe = E ? E.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ie = "$lit$", D = `lit$${Math.random().toFixed(9).slice(2)}$`, O = "?" + D, Le = `<${O}>`, k = document, A = () => k.createComment(""), j = (e) => e === null || typeof e != "object" && typeof e != "function", Re = Array.isArray, ze = (e) => Re(e) || typeof e?.[Symbol.iterator] == "function", Be = "[ 	\n\f\r]", M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ve = /-->/g, He = />/g, N = RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Ue = /'/g, We = /"/g, Ge = /^(?:script|style|textarea|title)$/i, Ke = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), P = Ke(1), F = Ke(2), I = Symbol.for("lit-noChange"), L = Symbol.for("lit-nothing"), qe = /* @__PURE__ */ new WeakMap(), R = k.createTreeWalker(k, 129);
function Je(e, t) {
	if (!Re(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Fe === void 0 ? t : Fe.createHTML(t);
}
var Ye = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === M ? c[1] === "!--" ? o = Ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = N) : (Ge.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = N) : o = He : o === N ? c[0] === ">" ? (o = i ?? M, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? N : c[3] === "\"" ? We : Ue) : o === We || o === Ue ? o = N : o === Ve || o === He ? o = M : (o = N, i = void 0);
		let d = o === N && e[t + 1].startsWith("/>") ? " " : "";
		a += o === M ? n + Le : l >= 0 ? (r.push(s), n.slice(0, l) + Ie + n.slice(l) + D + d) : n + D + (l === -2 ? t : d);
	}
	return [Je(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Xe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ye(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Ie)) {
					let t = u[o++], n = i.getAttribute(e).split(D), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Qe : r[1] === "?" ? $e : r[1] === "@" ? et : V
					}), i.removeAttribute(e);
				} else e.startsWith(D) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ge.test(i.tagName)) {
					let e = i.textContent.split(D), t = e.length - 1;
					if (t > 0) {
						i.textContent = E ? E.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], A()), R.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], A());
					}
				}
			} else if (i.nodeType === 8) if (i.data === O) c.push({
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
		let n = k.createElement("template");
		return n.innerHTML = e, n;
	}
};
function z(e, t, n = e, r) {
	if (t === I) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = j(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = z(e, i._$AS(e, t.values), i, r)), t;
}
var Ze = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? k).importNode(t, !0);
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new B(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new tt(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = k, r;
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
		this.type = 2, this._$AH = L, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = z(this, e, t), j(e) ? e === L || e == null || e === "" ? (this._$AH !== L && this._$AR(), this._$AH = L) : e !== this._$AH && e !== I && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ze(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== L && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Xe.createElement(Je(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ze(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = qe.get(e.strings);
		return t === void 0 && qe.set(e.strings, t = new Xe(e)), t;
	}
	k(t) {
		Re(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(A()), this.O(A()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = Pe(e).nextSibling;
			Pe(e).remove(), e = t;
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
		this.type = 1, this._$AH = L, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = L;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = z(this, e, t, 0), a = !j(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = z(this, r[n + o], t, o), s === I && (s = this._$AH[o]), a ||= !j(s) || s !== this._$AH[o], s === L ? e = L : e !== L && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === L ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Qe = class extends V {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === L ? void 0 : e;
	}
}, $e = class extends V {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== L);
	}
}, et = class extends V {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = z(this, e, t, 0) ?? L) === I) return;
		let n = this._$AH, r = e === L && n !== L || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== L && (n === L || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, tt = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		z(this, e);
	}
}, nt = {
	M: Ie,
	P: D,
	A: O,
	C: 1,
	L: Ye,
	R: Ze,
	D: ze,
	V: z,
	I: B,
	H: V,
	N: $e,
	U: et,
	B: Qe,
	F: tt
}, rt = Ne.litHtmlPolyfillSupport;
rt?.(Xe, B), (Ne.litHtmlVersions ??= []).push("3.3.3");
var it = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new B(t.insertBefore(A(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, at = globalThis, H = class extends T {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = it(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return I;
	}
};
H._$litElement$ = !0, H.finalized = !0, at.litElementHydrateSupport?.({ LitElement: H });
var ot = at.litElementPolyfillSupport;
ot?.({ LitElement: H }), (at.litElementVersions ??= []).push("4.2.2");
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
}, { I: st } = nt, ct = (e) => e, lt = (e) => e.strings === void 0, ut = () => document.createComment(""), K = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new st(r.insertBefore(ut(), i), r.insertBefore(ut(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = ct(e).nextSibling;
				ct(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, q = (e, t, n = e) => (e._$AI(t, n), e), dt = {}, ft = (e, t = dt) => e._$AH = t, pt = (e) => e._$AH, mt = (e) => {
	e._$AR(), e._$AA.remove();
}, ht = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, gt = W(class extends G {
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
		let i = pt(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = q(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = q(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = q(i[d], a[m]), K(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = q(i[f], a[p]), K(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = ht(o, p, m), u = ht(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = K(e, i[d]);
				q(t, a[p]), c[p] = t;
			} else c[p] = q(n, a[p]), K(e, i[d], n), i[t] = null;
			p++;
		} else mt(i[f]), f--;
		else mt(i[d]), d++;
		for (; p <= m;) {
			let t = K(e, c[m + 1]);
			q(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && mt(e);
		}
		return this.ut = o, ft(e, c), I;
	}
}), _t = {}, vt = W(class extends G {
	constructor() {
		super(...arguments), this.ot = _t;
	}
	render(e, t) {
		return t();
	}
	update(e, [t, n]) {
		if (Array.isArray(t)) {
			if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((e, t) => e === this.ot[t])) return I;
		} else if (this.ot === t) return I;
		return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, n);
	}
}), J = W(class extends G {
	constructor(e) {
		if (super(e), e.type !== U.PROPERTY && e.type !== U.ATTRIBUTE && e.type !== U.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!lt(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === I || t === L) return t;
		let n = e.element, r = e.name;
		if (e.type === U.PROPERTY) {
			if (t === n[r]) return I;
		} else if (e.type === U.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return I;
		} else if (e.type === U.ATTRIBUTE && n.getAttribute(r) === t + "") return I;
		return ft(e), t;
	}
}), Y = (e, t) => {
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
}, yt = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), St(t);
	}
};
function bt(e) {
	this._$AN === void 0 ? this._$AM = e : (X(this), this._$AM = e, yt(this));
}
function xt(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) Y(r[e], !1), X(r[e]);
	else r != null && (Y(r, !1), X(r));
	else Y(this, e);
}
var St = (e) => {
	e.type == U.CHILD && (e._$AP ??= xt, e._$AQ ??= bt);
}, Ct = class extends G {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), yt(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Y(this, e), X(this));
	}
	setValue(e) {
		if (lt(this._$Ct)) this._$Ct._$AI(e, this);
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
function wt(e = queueMicrotask) {
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
function Tt(e, t = (e) => e.enabled !== !1) {
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
var Et = wt(), Z = W(class extends Ct {
	render() {
		return L;
	}
	update(e, [t, n]) {
		return this.node = e.element, this.factory !== t && (this.clear(), this.factory = t), this.value = n, this.schedule(), L;
	}
	schedule() {
		Et.add(this);
	}
	flush() {
		!this.isConnected || !this.node.isConnected || (this.binding ? this.binding.update?.(this.value) : this.binding = this.factory(this.node, this.value));
	}
	clear() {
		Et.delete(this), this.binding?.destroy?.(), this.binding?.dispose?.(), this.binding = null;
	}
	disconnected() {
		this.clear();
	}
	reconnected() {
		this.factory && this.schedule();
	}
}), Dt = (e) => {
	let t = String(e ?? "");
	return t.includes("[") ? P`<span ${Z(c, { text: t })}></span>` : t;
}, Q = (e = !1, t = !1) => F`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e ? F`<path d="M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3" />` : F`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />`}${t ? F`<path d="M3 3l18 18" />` : L}</svg>`, Ot = (e) => F`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${e === "free" ? F`<path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />` : F`<path d=${e === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d=${e === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />`}</svg>`, kt = (e) => P`<small class="card-id">(${e})</small>`, At = (e, t, n = e) => P`<ui-copy-id class="task-title-copy" .value=${String(e)} .label=${t}>${t}${kt(n)}</ui-copy-id>`, jt = class {
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
		this.disposed || (e || (this.contentVersion = (this.contentVersion ?? 0) + 1), it(this.renderer(this.props, this), this.target));
	}
	refresh = () => this.draw();
	on(e, t, n, r = {}) {
		e.addEventListener(t, n, {
			...r,
			signal: this.abort.signal
		});
	}
	destroy() {
		this.disposed || (this.disposed = !0, this.abort.abort(), this.cleanups.forEach((e) => typeof e == "function" ? e() : e?.dispose?.()), it(L, this.target));
	}
}, Mt = Tt((e, r) => {
	let i = r, a = !1, o = new AbortController(), s = /* @__PURE__ */ new Map(), c = () => {
		let t = i.previewClasses ?? {};
		for (let n of /* @__PURE__ */ new Set([...s.keys(), ...e.children])) {
			let r = /* @__PURE__ */ new Set();
			if (n.parentElement === e) {
				let e = t[n.getAttribute("data-reorder-over")];
				e && r.add(e), t.dragging && n.hasAttribute("data-reorder-dragging") && r.add(t.dragging);
			}
			let i = s.get(n) ?? /* @__PURE__ */ new Set();
			for (let e of i) r.has(e) || n.classList.remove(e);
			for (let e of r) n.classList.contains(e) || n.classList.add(e);
			r.size ? s.set(n, r) : s.delete(n);
		}
	}, l = new e.ownerDocument.defaultView.MutationObserver((t) => {
		t.some((t) => t.type === "childList" ? t.target === e : t.target.parentElement === e) && c();
	});
	r.previewClasses && (c(), l.observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["data-reorder-over", "data-reorder-dragging"]
	}));
	let u, d, f, p, m = () => {
		u &&= (u.removeAttribute("data-reorder-handle"), u.draggable = !1, null), d = null;
	}, h = (t) => {
		if (f?.cancel(), m(), !i.surface) return;
		let n = [...e.children].find((e) => e.contains(t.target));
		if (!n || n.dataset.reorderSortable === "false") return;
		let r = t.type === "keydown" && t.target === n && t.altKey && ["ArrowUp", "ArrowDown"].includes(t.key), a = i.surface === "item" ? "a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg" : "button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg", o = t.type === "pointerdown" && t.button === 0 && t.pointerType === "mouse" && !t.target.closest(a), s = i.surface === !0 && t.type === "pointerdown" && t.button === 0 && t.isPrimary && ["touch", "pen"].includes(t.pointerType) && !t.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], li, svg");
		(r || o || s) && (u = n, n.setAttribute("data-reorder-handle", ""), n.draggable = !0, s && (d = t.pointerId));
	};
	return e.addEventListener("pointerdown", h, {
		capture: !0,
		signal: o.signal
	}), e.addEventListener("keydown", h, {
		capture: !0,
		signal: o.signal
	}), e.ownerDocument.addEventListener("pointerup", m, { signal: o.signal }), e.ownerDocument.addEventListener("dragend", m, { signal: o.signal }), f = r.surface === !0 ? t(e, {
		capture: !1,
		onStart: (e) => {
			e.pointerId !== d && f.cancel();
		},
		onTrigger: () => {},
		onCancel: () => {
			d != null && (p?.cancel(), m());
		}
	}) : null, e.addEventListener("touchmove", (e) => {
		d != null && f?.isHolding && e.preventDefault();
	}, {
		passive: !1,
		signal: o.signal
	}), e.addEventListener("contextmenu", (e) => {
		d != null && f?.isHolding && (e.preventDefault(), e.stopImmediatePropagation());
	}, {
		capture: !0,
		signal: o.signal
	}), p = n(e, (t) => {
		let n = i.onMove(t);
		i.focusAfterMove && Promise.resolve(n).then(() => queueMicrotask(() => {
			a || !e.isConnected || [...e.children].find((e) => e.dataset.reorderId === t.id)?.focus();
		}));
	}, { axis: r.axis ?? "horizontal" }), {
		update: (e) => {
			let t = i.previewClasses ?? {}, n = e.previewClasses ?? {};
			i = e, (s.size || [
				"before",
				"after",
				"dragging"
			].some((e) => t[e] !== n[e])) && c();
		},
		destroy() {
			a = !0, f?.dispose(), m(), o.abort(), p.dispose(), l.disconnect();
			for (let [e, t] of s) for (let n of t) e.classList.remove(n);
			s.clear();
		}
	};
});
function Nt(e = [], t = {}) {
	return P`<div class="horizontal-capsule-strip ${t.className ?? ""}" role="toolbar" aria-label=${t.ariaLabel ?? "模組"}
    ${Z(Mt, {
		axis: "horizontal",
		focusAfterMove: !0,
		previewClasses: {
			before: "capsule-drop-before",
			after: "capsule-drop-after",
			dragging: "capsule-dragging"
		},
		onMove: (e) => t.onReorder?.(e.id, e.targetId, e.placement === "after")
	})}>
    ${gt(e, (e) => e.id, (e) => P`<button type="button" data-capsule-id=${e.id} data-reorder-capsule=${String(e.sortable !== !1)} data-reorder-id=${e.id} data-reorder-handle data-reorder-sortable=${String(e.sortable !== !1)}
      class="capsule-button ${e.className ?? ""} ${e.sortable === !1 ? "" : "capsule-sortable"}" aria-pressed=${e.pressed ?? L}
      aria-label=${e.ariaLabel ?? e.label} aria-keyshortcuts=${e.sortable === !1 ? L : "Alt+ArrowLeft Alt+ArrowRight"} title=${e.title ?? L} ?disabled=${e.disabled} draggable=${e.sortable !== !1}
      @click=${() => t.onActivate?.(e.id)}><span>${e.label}</span>${e.showDot ? P`<span class="time-risk-dot ${e.dotClass ?? ""}"></span>` : L}${e.showChevron ? P`<span class="time-chevron">›</span>` : L}</button>`)}
  </div>`;
}
function Pt(e = {}) {
	let t = new Map((e.categories ?? []).map((e) => [e.id, e])), n = e.order?.length ? e.order : [g, ...t.keys()], r = n.find((e) => !t.has(e)), i = e.defaultLabel ?? "預設";
	return Nt(n.map((n) => n === r ? {
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
var Ft = Object.freeze({
	icon: !0,
	label: !1,
	appearance: "ghost"
});
function It(e, t, n, r, i, a, o = "both") {
	return P`<ui-option-picker class="icon-choice" aria-label=${i} .label=${i} .options=${n}
    .value=${r} .interaction=${o} .delay=${300} orientation="vertical"
    .triggerDisplay=${Ft} .optionDisplay=${Ft}
    @choice-request=${(e) => a(e.detail.id)}></ui-option-picker>`;
}
function Lt({ id: e, label: t, expanded: n = !0, toggle: r, visibilityEnabled: i = !1, visible: a = !0, onVisibleChange: o }, s, c) {
	return P`<div class="card-disclosure-heading ${n ? "" : "card-disclosure-collapsed"}">${r ? P`<button type="button" class="card-disclosure-toggle" aria-expanded=${n} aria-controls=${e} aria-label="${n ? "收合" : "展開"} ${t}" @click=${() => r(!n)}><span aria-hidden="true">${n ? "▼" : "▶"}</span></button>` : L}
  ${i ? P`<button type="button" class="card-visibility-toggle card-toolbar-icon" aria-pressed=${a} aria-label="${a ? "隱藏" : "顯示"} ${t}" @click=${() => o(!a)}>${Q(!a)}</button>` : L}${s}</div><div id=${e} class="card-disclosure-body" ?hidden=${!n}>${c}</div>`;
}
var Rt = class {
	constructor(e) {
		this.view = e, this.order = [], this.pins = [], this.mode = "forward", this.visibility = "disabled", this.hidden = [], this.selected = null, this.expanded = !0, this.overrides = {}, this.key = null, this.linkSelection = te(re(location.search));
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
		return l(e, this.order, this.mode, this.props?.pinEnabled ? this.pins : [], this.props?.nextId, this.props?.completedIds).map((e) => e.id);
	}
	expand(e, t) {
		this.overrides[e] = t, h(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	all(e) {
		this.expanded = e, this.overrides = {}, h(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	persist(e = !1) {
		try {
			this.key && (localStorage.setItem(`${this.key}:pins`, JSON.stringify(this.pins)), localStorage.setItem(`${this.key}:mode`, this.mode), sessionStorage.setItem(`${this.key}:visibility`, JSON.stringify({
				mode: this.visibility,
				hiddenIds: this.hidden
			})));
		} catch {}
		this.view.draw({ reuseCardContent: e });
	}
	render(e, t, n = L, r = L) {
		this.props = e;
		let i = e.storageKey ?? null;
		if (this.key !== i && (this.key = i, this.lastPin = null, this.order = [], this.pins = [], this.completionStates = {}, this.mode = "forward", this.hidden = [], this.visibility = "disabled", this.selected = null, this.showAllCards = !1, i)) try {
			let e = JSON.parse(localStorage.getItem(`${i}:pins`)), t = JSON.parse(sessionStorage.getItem(`${i}:visibility`)), n = localStorage.getItem(`${i}:mode`);
			this.pins = Array.isArray(e) ? [...new Set(e.filter((e) => typeof e == "string" || typeof e == "number"))] : [];
			let r = JSON.parse(localStorage.getItem(`${i}:completion`));
			this.completionStates = r && !Array.isArray(r) && typeof r == "object" ? Object.fromEntries(Object.entries(r).filter(([, e]) => typeof e == "boolean")) : {}, this.mode = [
				"forward",
				"reverse",
				"free"
			].includes(n) ? n : "forward", this.visibility = [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled", this.hidden = Array.isArray(t?.hiddenIds) ? t.hiddenIds : [];
		} catch {}
		let a = e.disclosureKey ?? `taskprogress.disclosure:${i ?? location.href}`;
		if (this.disclosureKey !== a) {
			this.disclosureKey = a;
			let e = m(a);
			this.expanded = e.expanded, this.overrides = e.overrides;
		}
		if (e.pinEnabled && e.completionStates) {
			let t = Object.fromEntries(Object.entries(e.completionStates).flatMap(([e, t]) => {
				let n = typeof t == "boolean" ? t : this.completionStates?.[e];
				return typeof n == "boolean" ? [[e, n]] : [];
			})), n = f(this.pins, this.completionStates, t), r = n.length !== this.pins.length, a = JSON.stringify(t), o = JSON.stringify(this.completionStates);
			if (this.pins = n, this.completionStates = t, i) try {
				r && localStorage.setItem(`${i}:pins`, JSON.stringify(n)), a !== o && localStorage.setItem(`${i}:completion`, a);
			} catch {}
		}
		if (e.requestedPin && e.completionStates !== null && e.completionStates?.[e.requestedPin] !== null && this.lastPin !== e.requestedPin && (e.allIds ?? e.items.map((e) => e.id)).includes(e.requestedPin)) {
			this.pins = d(this.pins, e.requestedPin), this.overrides[e.requestedPin] = !0, this.hidden = this.hidden.filter((t) => t !== e.requestedPin), this.visibility === "closed" && (this.visibility = "enabled"), this.lastPin = e.requestedPin;
			try {
				i && localStorage.setItem(`${i}:pins`, JSON.stringify(this.pins));
			} catch {}
		}
		let o = e.referenceParents?.size && !this.showAllCards && !e.searching, s = (t) => p(t, e.referenceParents, this.pins, e.nextId, e.requestedPin), c = o ? s(e.items) : e.items, h = o ? new Set(s((e.allIds ?? []).map((e) => ({ id: e }))).map((e) => e.id)) : null, g = typeof e.hiddenCount == "function" ? e.hiddenCount(h) : e.hiddenCount, _ = l(c, e.heldOrder ?? this.order, e.heldOrder ? "free" : this.mode, e.pinEnabled ? this.pins : [], e.nextId, e.completedIds), v = this.linkSelection.claim(_.map((e) => e.id));
		v && (this.selected = v.id, this.hidden = this.hidden.filter((e) => e !== v.id), this.visibility === "closed" && (this.visibility = "enabled"), queueMicrotask(() => {
			if (this.view.disposed || this.selected !== v.id) return;
			e.onSelectionChange?.(v.id), this.view.draw();
			let t = [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(v.id));
			t?.focus({ preventScroll: !0 }), t?.scrollIntoView({ block: "center" });
		}));
		let ee = this.linkSelection.selectionChanged(this.selected), y = (e) => this.visibility !== "closed" && (this.visibility !== "enabled" || !this.hidden.includes(e.id)), b = this.mode === "forward" && typeof e.onSourceReorder == "function", x = (t) => !this.moving && y(t) && t.id !== e.nextId && !(e.pinEnabled && this.pins.includes(t.id)) && (this.mode === "free" || b && Object.hasOwn(e.reorderGroups ?? {}, t.id)), te = async (t) => {
			let n = _.find((e) => e.id === t.id), r = _.find((e) => e.id === t.targetId);
			if (!(!n || !r || !x(n) || !x(r))) {
				if (b) {
					if (e.reorderGroups[t.id] !== e.reorderGroups[t.targetId]) return;
					let n = _.filter((n) => x(n) && e.reorderGroups[n.id] === e.reorderGroups[t.id]).map((e) => e.id);
					this.moving = !0, this.view.draw();
					try {
						if (await e.onSourceReorder({
							taskId: t.id,
							position: { [t.placement === "after" ? "after" : "before"]: t.targetId },
							visibleIds: n
						}) === !1) return;
					} finally {
						this.moving = !1, this.view.draw();
					}
				} else this.order = u(e.allIds ?? _.map((e) => e.id), this.order, _.filter(x).map((e) => e.id), t.id, t.targetId, t.placement === "after");
				e.onSelectionChange?.(null), this.selected = t.id, e.onSelectionChange?.(t.id), this.persist(), queueMicrotask(() => {
					this.view.disposed || [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(t.id))?.focus();
				});
			}
		}, ne = _.find(y)?.id;
		return P`<div class="card-list-controls"><div class="card-list-heading"><p class="section-kicker">工作項目</p>${n}</div><div class="card-list-tools">
      ${e.referenceParents?.size ? P`<button type="button" class="secondary-button" aria-pressed=${!!this.showAllCards} @click=${() => {
			this.showAllCards = !this.showAllCards, this.view.draw();
		}}>顯示全部卡片</button>` : L}
      <button type="button" class="card-toolbar-icon" aria-label=${this.expanded ? "全部收合" : "全部展開"} @click=${() => this.all(!this.expanded)}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d=${this.expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      ${It(this.view, "order", [
			"forward",
			"reverse",
			"free"
		].map((e) => ({
			id: e,
			label: {
				forward: "順排",
				reverse: "逆排",
				free: "不排（暫時換位）"
			}[e],
			icon: Ot(e)
		})), this.mode, "排序", (e) => {
			this.mode = e, this.persist(!0);
		})}
      ${It(this.view, "visibility", [
			{
				id: "enabled",
				label: "啟用",
				icon: Q()
			},
			{
				id: "closed",
				label: "全體關閉",
				icon: Q(!0)
			},
			{
				id: "disabled",
				label: "禁用",
				icon: Q(!1, !0)
			},
			{
				id: "reset",
				label: "重置",
				kind: "action",
				icon: P`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>`
			}
		], this.visibility, "可見性", (e) => {
			e === "reset" ? (this.hidden = [], this.visibility = "enabled") : this.visibility = e, this.persist();
		}, "picker")}${r}
    </div></div><div class="arrangeable-cards" ${Z(Mt, {
			axis: "vertical",
			surface: !0,
			previewClasses: {
				before: "card-drop-before",
				after: "card-drop-after"
			},
			onMove: te
		})}>
    ${gt(_, (e) => e.id, (n, r) => P`<div class="arrangeable-card ${this.selected === n.id ? "card-selected" : ""}" role="group" tabindex="0" data-render-window data-card-id=${n.id} data-reorder-id=${n.id} data-reorder-sortable=${String(x(n))} data-reorder-group=${b ? e.reorderGroups?.[n.id] ?? L : L}
      aria-label=${`${n.title ?? n.question ?? ""}${this.selected === n.id ? "，已選取" : ""}`} aria-keyshortcuts=${x(n) ? "Alt+ArrowUp Alt+ArrowDown" : L} data-link-tone=${this.selected === n.id ? ee ?? L : L} ?hidden=${!y(n)}
      @pointerdown=${(e) => {
			e.button === 0 && this.select(n.id);
		}} @focusin=${() => this.select(n.id)} @keydown=${(e) => {
			e.target === e.currentTarget && ["Enter", " "].includes(e.key) && (e.preventDefault(), this.select(n.id));
		}}>
      ${e.pinEnabled ? P`<button type="button" class="card-pin ${this.pins.includes(n.id) ? "is-pinned" : ""} ${n.id === e.nextId ? "is-next" : ""}" aria-label="${this.pins.includes(n.id) ? "取消釘選" : "釘選置頂"}：${n.title}" aria-pressed=${this.pins.includes(n.id)} @click=${() => {
			this.pins = this.pins.includes(n.id) ? this.pins.filter((e) => e !== n.id) : d(this.pins, n.id), this.persist();
		}}><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill=${this.pins.includes(n.id) ? "currentColor" : "none"} stroke="currentColor" stroke-width="1.6" /></svg></button>` : L}
      ${vt([
			this.view.contentVersion,
			n,
			n.id === ne,
			this.isExpanded(n.id),
			this.visibility,
			this.hidden.includes(n.id)
		], () => t(n, {
			lead: n.id === ne,
			expanded: this.isExpanded(n.id),
			toggle: (e) => this.expand(n.id, e),
			visibilityEnabled: this.visibility === "enabled",
			visible: !this.hidden.includes(n.id),
			onVisibleChange: (e) => {
				this.hidden = e ? this.hidden.filter((e) => e !== n.id) : [...this.hidden, n.id], this.persist();
			}
		}))}
    </div>`)}</div>${g > 0 ? P`<p class="card-list-hidden"><button type="button" class="card-list-hidden-link" @click=${e.onShowHidden}>…顯示隱藏項目(${g})</button></p>` : L}`;
	}
}, zt = (e, t) => {
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
}, Bt = (e, t) => (r(), P`<ui-dialog id=${e.id ?? L} class=${e.className ?? ""} .heading=${e.title ?? ""} .kicker=${e.kicker ?? ""} .closeLabel=${e.closeLabel ?? ""} .dismissDisabled=${!!e.busy} .dismissOnBackdrop=${e.dismissOnBackdrop ?? !0} ${Z(zt, e)}>${e.open ? t : L}</ui-dialog>`), Vt = (e) => {
	let t = globalThis.taskprogressTheme.control;
	return e.append(t), { destroy() {
		t.parentNode === e && t.remove();
	} };
}, Ht = () => P`<span class="replica-theme" ${Z(Vt, null)}></span>`, Ut = (e, t) => {
	let n = fe(t);
	return e.append(n), {
		update(e) {
			if (t.href === e.href && t.title === e.title) return;
			t = e;
			let r = fe(e);
			n.replaceWith(r), n = r;
		},
		destroy: () => n.remove()
	};
}, Wt = (e) => !e || globalThis.chrome?.webview ? L : P`<span class="replica-back" ${Z(Ut, e)}></span>`, Gt = (e, t) => {
	let n = t;
	return {
		update: (e) => {
			n = e;
		},
		destroy: () => n.onOpenChange?.(!1)
	};
};
function Kt(e) {
	return r(), P`<ui-edit-history .history=${e.history} .disabled=${!!e.disabled} .targetId=${e.targetId ?? e.id ?? ""}
    .retentionLabel=${"紀錄只保留在目前頁面，重新整理或離開後會清除。復原與重做仍依編輯器的保存方式處理。"}
    @history-request=${(t) => {
		e.disabled || (t.detail.action === "undo" && e.history.canUndo ? e.onUndo?.() : t.detail.action === "redo" && e.history.canRedo ? e.onRedo?.() : t.detail.action === "clearHistory" && e.history.canClear && e.onClear?.());
	}} @history-open-change=${(t) => e.onOpenChange?.(t.detail.open)}
    ${Z(Gt, e)}></ui-edit-history>`;
}
//#endregion
//#region ui/web-workflow/decisions.mjs
var qt = await pe("decisions"), Jt = new URLSearchParams(location.search), Yt;
try {
	Yt = oe("decisions", { params: Jt });
} catch (e) {
	Yt = { load: () => Promise.reject(e) };
}
var $ = new class extends jt {
	constructor(e, t = {}) {
		super(e, {}, (e, t) => t.template()), this.transport = t.transport ?? Yt, this.editable = t.editable ?? qt.editable, this.loadGeneration = 0, this.cards = new Rt(this), this.message = "載入中…", this.queued = /* @__PURE__ */ new Set(), this.failed = /* @__PURE__ */ new Set(), this.sourceOverrides = {}, this.sourceRequest = 0, this.selection = ee(null, ["pending", "decided"], void 0, ["pending"]), this.linkRequest = re(location.search), this.linked = this.linkRequest?.id ?? null, this.cleanups.push(le()), this.cleanups.push(ce({
			canRefresh: () => this.canRefresh(),
			reload: () => this.refreshSource()
		})), this.on(window, "beforeunload", (e) => {
			(this.data?.dirty || this.data?.pending) && (e.preventDefault(), e.returnValue = "");
		});
	}
	sync() {
		this.disposed || (this.data = this.session.view(), this.draw());
	}
	decisions() {
		return this.data?.snapshot.document.decisions ?? [];
	}
	select(e) {
		this.selection = e, y(this.filterKey, e), this.draw();
	}
	selectCard(e) {
		if (e === null) {
			this.held = null, this.linkedSelected && (this.linked = null);
			return;
		}
		this.linkedSelected = !0, this.held = this.cards.orderedIds(this.decisions().filter((t) => this.selection.selected.has(t.status) || t.id === e));
	}
	canRefresh() {
		return !this.disposed && !this.data?.dirty && !this.data?.pending && !this.data?.busy && !this.clearOpen && !this.sourceOpen && !this.historyOpen && !this.refreshing;
	}
	async load() {
		if (this.disposed) return;
		let e = ++this.loadGeneration, t = () => !this.disposed && e === this.loadGeneration;
		try {
			let e = await this.transport.load();
			if (!t()) return;
			if (!e.ok) throw Error(e.error?.message ?? "無法載入決策");
			if (Promise.resolve().then(() => this.transport.loadOwnerReport?.()).then((e) => {
				t() && (this.owner = e, this.draw());
			}).catch(() => {}), e.files) {
				this.summary = e, this.message = "", this.draw();
				return;
			}
			this.session = ie(e), this.data = this.session.view(), this.filterKey = `taskprogress.filters.decisions.v1:${e.document_key}`, this.selection = ee(this.filterKey, ["pending", "decided"], void 0, ["pending"]), this.linked = ne(this.linkRequest, this.decisions().map((e) => e.id)), this.message = "", this.draw();
		} catch (e) {
			t() && (this.message = e.message, this.draw());
		}
	}
	async refreshSource() {
		if (!this.canRefresh()) return;
		this.refreshing = !0;
		let e = this.session;
		try {
			let t = await this.transport.load();
			if (this.disposed || this.session !== e) return;
			if (!t.ok) throw Error(t.error?.message ?? "無法載入決策文件");
			t.files ? this.summary = t : this.session ? (t.revision !== this.data.snapshot.revision || !ae(t.sources, this.data.snapshot.sources)) && (this.session.merge(t), this.sourceOverrides = {}, this.sync()) : (this.session = ie(t), this.sync());
		} catch (e) {
			this.disposed || console.warn("Decision foreground refresh failed:", e);
		} finally {
			this.disposed || (this.refreshing = !1, this.draw());
		}
	}
	choose(e, t) {
		if (!(this.disposed || !this.session)) {
			if (!this.editable) {
				this.message = "此入口目前為唯讀，無法保存答案。", this.draw();
				return;
			}
			this.session.select(e, t), this.sync(), this.confirm(e);
		}
	}
	confirm(e) {
		if (this.disposed || !this.session || (this.queued.add(e), this.failed.delete(e), this.refreshing)) return;
		let t = this.session.saveOperation(e);
		if (t) return this.send(e, t);
	}
	changeOther(e, t) {
		this.disposed || !this.session || (this.session.edit(e, {
			other: t,
			cleared: this.data.drafts[e]?.cleared ?? !1
		}), this.sync(), this.data.drafts[e]?.choice === "__other" && this.confirm(e));
	}
	async send(e, t = "confirm", n = !1) {
		if (this.disposed || !this.session) return;
		let r = this.session, i = () => !this.disposed && this.session === r;
		try {
			let r = n ? this.session.retry() : t === "clear_all" ? this.session.beginClearAll() : this.session.begin(e, t);
			n || this.queued.delete(r.decision_id), this.sync(), this.message = "保存中…", this.draw();
			let a;
			try {
				if (a = await this.transport.request(r), !i()) return;
			} catch (e) {
				if (!i()) return;
				this.session.failed(), this.sync(), this.message = `尚未收到操作結果：${e.message}。請查詢／重送同一筆操作；這不會復原舊答案。`, this.draw();
				return;
			}
			if (this.session.complete(a), this.sync(), this.message = a.ok ? a.status === "already_applied" ? "原操作已完成；以下顯示目前最新狀態。" : r.operation === "clear_all" ? "已清除全部答案與理由，以下顯示最新狀態。" : "已保存；以下顯示最新狀態。" : a.error.message, !a.ok) {
				this.queued.delete(r.decision_id), this.failed.add(r.decision_id), this.refreshing = !0;
				try {
					let e = await this.transport.load();
					if (!i()) return;
					e.ok && (this.session.merge(e), this.sync());
				} catch (e) {
					i() && (this.message = e.message);
				} finally {
					i() && (this.refreshing = !1);
				}
			}
			if (r.operation === "clear_all") {
				a.ok && (this.queued.clear(), this.failed.clear(), this.cards.select(null)), this.draw();
				return;
			}
			let o = [...this.queued].find((e) => !this.failed.has(e) && this.session.saveOperation(e));
			o && await this.send(o, this.session.saveOperation(o));
		} catch (e) {
			i() && (this.message = e.message);
		}
		this.draw();
	}
	async traverse(e) {
		if (this.refreshing || this.clearOpen || this.sourceOpen) return;
		let t = this.session[e]();
		this.sync();
		for (let e of t) this.queued.add(e), this.failed.delete(e);
		let n = [...this.queued].find((e) => !this.failed.has(e) && this.session.saveOperation(e));
		n && await this.send(n, this.session.saveOperation(n));
	}
	async openSource(e) {
		if (this.disposed || !this.session) return;
		let t = ++this.sourceRequest;
		this.sourceOpen = !0, this.sourcePreview = null, this.sourceMessage = "載入來源…", this.draw();
		try {
			let n = await this.transport.request({
				operation: "source",
				decision_id: e
			});
			if (this.disposed || t !== this.sourceRequest) return;
			if (!n.ok) throw Error(n.error?.message ?? "無法讀取來源");
			this.sourcePreview = n.source, this.sourceOverrides[e] = {
				...n.source,
				revision: this.data.snapshot.revision,
				content: void 0
			}, this.sourceMessage = n.source.status === "available" ? "" : n.source.message;
		} catch (e) {
			!this.disposed && t === this.sourceRequest && (this.sourceMessage = `無法讀取來源：${e.message}`);
		}
		this.draw();
	}
	visible() {
		return se(this.decisions().filter((e) => this.held ? this.held.includes(e.id) : String(e.id) === this.linked || this.selection.selected.has(e.status)));
	}
	canClear() {
		return !this.disposed && this.editable && this.data && !this.data.pending && !this.data.busy && !this.refreshing && (this.decisions().some((e) => e.answer) || this.data.dirty);
	}
	card(e, t) {
		let n = this.data, r = Object.hasOwn(n.drafts, e.id) ? n.drafts[e.id] : null, i = r ? r.choice : e.answer?.kind === "other" ? "__other" : e.answer?.option_id ?? "", a = !this.editable || this.refreshing || n.pending?.operation === "clear_all" || !!n.pending && !n.busy || r?.conflict, o = this.sourceOverrides[e.id] ?? n.snapshot.sources?.[e.id];
		return P`<article class="checklist-item decision-card ${t.visibilityEnabled ? "decision-has-visibility" : ""}">${Lt({
			...t,
			id: `body-${e.id}`,
			label: e.question
		}, P`<header class="checklist-item-header"><h2 id="decision-${e.id}" tabindex="-1">${At(e.id, e.question)}</h2><span class="checklist-status">${e.status === "pending" ? "待決策" : "已決策"}</span></header>`, P`<div class="decision-content">${e.source_ref ? P`<div class="decision-source">${o?.status === "available" ? P`<button data-decision-control type="button" class="source-link" @click=${() => this.openSource(e.id)}>來源：${e.source_ref}</button>` : P`<span>${o?.message ?? "來源尚未檢查，請更新並重啟服務"}</span><small>${e.source_ref}</small>${o ? P`<button data-decision-control type="button" class="source-link" @click=${() => this.openSource(e.id)}>重新檢查來源</button>` : L}`}</div>` : L}
      ${e.context || e.recommendation ? P`<div class="decision-description">${e.context ? P`<p class="decision-text">${Dt(e.context)}</p>` : L}${e.recommendation ? P`<p>建議：${e.options.find((t) => t.id === e.recommendation.option_id)?.label} — ${Dt(e.recommendation.reason)}</p>` : L}</div>` : L}
      <fieldset ?disabled=${a}><legend class="decision-visually-hidden">${e.question}</legend>${gt(e.options, (e) => e.id, (t, n) => P`<label class="decision-option"><input type="radio" name="answer-${e.id}" .checked=${J(i === t.id)} @click=${() => this.choose(e.id, t.id)}><span>${String.fromCharCode(65 + n)}　${t.label}${t.id === e.recommendation?.option_id ? "（建議）" : ""}${t.description ? P` <small>${Dt(t.description)}</small>` : L}</span></label>`)}
      ${e.allow_other ? P`<label class="decision-option"><input type="radio" name="answer-${e.id}" .checked=${J(i === "__other")} @click=${() => {
			this.choose(e.id, "__other"), queueMicrotask(() => document.getElementById(`other-${e.id}`)?.focus());
		}}><span>其他</span></label><div class="decision-other"><label for="other-${e.id}">其他方案與理由</label><textarea id="other-${e.id}" ?readonly=${i !== "__other" && this.editingOther !== e.id} @focus=${() => {
			this.editingOther = e.id, this.draw();
		}} @blur=${() => {
			this.editingOther = null, this.draw();
		}} .value=${J(r ? r.other : e.answer?.kind === "other" ? e.answer.text : "")} @input=${(t) => this.changeOther(e.id, t.currentTarget.value)}></textarea></div>` : L}</fieldset>
      ${r?.conflict ? P`<p role="alert">此題已變更，原草稿保留：${r.choice} ${r.other}</p><button data-decision-control ?disabled=${this.refreshing || !!n.pending} @click=${() => {
			this.session.rebase(e.id), this.sync(), this.confirm(e.id);
		}}>已核對最新題目，套用選擇</button>` : L}
      <div class="decision-actions">${this.failed.has(e.id) && r && !r.conflict && !n.pending ? P`<button data-decision-control ?disabled=${this.refreshing} @click=${() => this.confirm(e.id)}>重試保存</button>` : L}</div></div>`)}</article>`;
	}
	template() {
		let e = this.data, t = this.decisions(), n = this.visible();
		return P`<main class="checklist-shell decisions-shell"><header class="checklist-header"><div><div class="replica-title-row">${Wt(this.owner)}<h1>決策項目</h1></div></div>${Ht()}</header>
      ${this.message ? P`<p role="status">${this.message}</p>` : L}
      ${this.summary ? P`<p>待決策 ${this.summary.pending}${this.summary.incomplete ? "（統計不完整）" : ""}</p>${this.summary.files.map((e) => P`<article class="checklist-item"><a href="?scope=${this.summary.scope_id}&task=${e.task_id}">${e.task_id}</a><p>${e.error ?? `待決策 ${e.pending}／全部 ${e.total}`}</p></article>`)}${this.summary.files.length ? L : P`<p>尚未建立決策文件。</p>`}` : e ? P`
      <div class="decision-overview"><p>待決策 ${t.filter((e) => e.status === "pending").length}／全部 ${t.length}</p><p>選項可隨時修改；選取「其他」後，文字更動會自動保存，空白則為待決策。未選取時可點擊文字欄編輯本頁草稿。保存失敗會保留修改供重試。</p></div>
      <div class="decision-controls">${Kt({
			id: "decision-history",
			targetId: e.snapshot.document_key,
			history: e.history,
			disabled: !this.editable || this.refreshing || this.clearOpen || this.sourceOpen,
			onUndo: () => this.traverse("undo"),
			onRedo: () => this.traverse("redo"),
			onClear: () => {
				this.session.clearHistory(), this.sync();
			},
			onOpenChange: (e) => {
				this.historyOpen = e;
			}
		}, this)}
      <button data-decision-control type="button" ?disabled=${!t.some((e) => e.status === "pending")} @click=${() => {
			let e = t.find((e) => e.status === "pending");
			this.selection.selected.has("pending") || this.select(x(this.selection, "pending")), this.cards.expand(e.id, !0), queueMicrotask(() => document.getElementById(`decision-${e.id}`)?.focus());
		}}>下一項待決策</button><button data-decision-control type="button" ?disabled=${!this.canClear()} @click=${() => {
			this.clearOpen = !0, this.draw();
		}}>清除全部答案</button></div>
      ${e.pending && !e.busy ? P`<button data-decision-control type="button" @click=${() => this.send(null, null, !0)}>${e.pending.operation === "clear_all" ? "查詢／重送清除操作" : "查詢／重送保存操作"}</button>` : L}${n.length ? L : P`<p>目前沒有符合條件的決策項目。</p>`}
      ${this.cards.render({
			items: n,
			allIds: t.map((e) => e.id),
			storageKey: `taskprogress.decisions:${e.snapshot.document_key}`,
			disclosureKey: `taskprogress.decisions:${e.snapshot.document_key}`,
			heldOrder: this.held,
			onSelectionChange: (e) => this.selectCard(e),
			hiddenCount: t.length - n.length,
			onShowHidden: () => this.select(_(["pending", "decided"]))
		}, (e, t) => this.card(e, t), Pt({
			categories: [{
				id: "pending",
				label: "待決策"
			}, {
				id: "decided",
				label: "已決策"
			}],
			order: [
				g,
				"pending",
				"decided"
			],
			selected: this.selection.selected,
			defaultLit: v(this.selection),
			defaultLabel: "全部",
			onSelect: (e) => this.select(x(this.selection, e)),
			onSelectDefault: () => this.select(b(this.selection))
		}))}
      ${Object.entries(e.drafts).filter(([e]) => !t.some((t) => t.id === e)).map(([e, t]) => P`<p role="alert">已移除題目 ${e} 的原草稿：${t.choice} ${t.other}</p><button data-decision-control @click=${() => {
			this.session.discard(e), this.sync();
		}}>關閉已移除題目提示</button>`)}` : L}</main>
      ${Bt({
			open: !!this.sourceOpen,
			title: "決策來源",
			onClose: () => {
				this.sourceOpen = !1, this.sourceRequest++, this.draw();
			}
		}, P`${this.sourcePreview ? P`<p class="decision-text">${this.sourcePreview.reference}</p>` : L}${this.sourceMessage ? P`<p role="status">${this.sourceMessage}</p>` : L}${this.sourcePreview?.status === "available" ? P`<pre class="source-content" aria-label="來源文件內容">${this.sourcePreview.content.replace(/\r\n/g, "\n").split("\n").map((e, t) => P`<span id="source-line-${t + 1}" class=${t + 1 === this.sourcePreview.line ? "source-target" : ""}>${e || " "}${"\n"}</span>`)}</pre>` : L}`)}
      ${Bt({
			open: !!this.clearOpen,
			title: "清除全部決策答案？",
			onClose: () => {
				this.clearOpen = !1, this.draw();
			}
		}, P`<p>將清除目前文件「${e?.snapshot.document.task_id}」全部 ${t.length} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。</p><p>清除成功後可在本頁按「復原」還原；重新整理或離開頁面後，歷史不會保留。</p><div class="theme-dialog-actions"><button data-decision-control type="button" class="secondary-button" @click=${() => {
			this.clearOpen = !1, this.draw();
		}}>取消</button><button data-decision-control type="button" class="primary-button" ?disabled=${!this.canClear()} @click=${() => {
			this.clearOpen = !1, this.send(null, "clear_all");
		}}>確認清除全部</button></div>`)}`;
	}
}(document.querySelector("#app"));
$.draw(), await $.load(), globalThis.taskprogressWebUi = {
	kind: "decisions",
	app: $,
	editable: qt.editable
}, addEventListener("pagehide", (e) => {
	e.persisted || $.destroy();
});
//#endregion
