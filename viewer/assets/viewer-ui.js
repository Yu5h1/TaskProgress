import { bindButton as e, bindLongPress as t, bindReorder as n, registerUi as r } from "./web/ui/index.js";
import { applyTheme as i, loadThemePreference as a, preferenceWithMode as o, saveThemePreference as s } from "./web/theme/index.js";
import { registerUiAdapter as c } from "./ui-host.js";
import { STATUS_META as l, stableSortTaskItemsByPriority as u } from "./report-model.js";
import { liftNextItem as d } from "./next-marker.js";
import { copyText as f, itemReference as p } from "./item-reference.js";
import { formatActivity as m } from "./item-activity.js";
import { statusLinks as ee, statusTooltip as h } from "./item-state.js";
import { createLinkSelection as g, linkSelectionHref as te, readLinkSelection as ne } from "./link-selection.js";
import { expandableText as _ } from "./expandable-text.js";
import "./inline-links.js";
import { displayCards as v, moveVisibleCard as y, promotePin as b } from "./card-order.js";
import { loadDisclosure as x, saveDisclosure as S } from "./card-disclosure-state.js";
import { DEFAULT_CAPSULE_ID as re } from "./filter-selection.js";
//#region viewer/assets/theme-model.js
var ie = "task-progress.theme.v1";
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
var ae = Object.freeze({ defaultMode: "system" });
//#endregion
//#region ui/web-workflow/bootstrap.mjs
function oe(t = null) {
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
async function se(e) {
	r(), document.documentElement.dataset.taskprogressUi = "web-ui-workflow";
	let t = ae, n = globalThis.taskprogressThemeBoot, c = n?.preference ?? a(() => localStorage, "task-progress.theme.v1", t);
	n?.controller.dispose(), delete globalThis.taskprogressThemeBoot;
	let l = document.createElement("ui-theme-control"), u = matchMedia("(prefers-color-scheme: dark)"), d, f = () => {
		l.preference = c, l.systemScheme = u.matches ? "dark" : "light", document.documentElement.dataset.theme = c.mode, c.mode === "custom" ? document.documentElement.dataset.themeBase = c.custom.base : delete document.documentElement.dataset.themeBase;
	}, p = () => {
		d || (c = a(() => localStorage, ie, t), d = i(document.documentElement, c, t), u.addEventListener("change", f), f());
	}, m = (e) => (c = s(() => localStorage, ie, e, t), d?.update(c), f(), c);
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
			t.className = "replica-title-row", e.before(t), t.append(oe(), e);
		}
	}
	let ee = new URLSearchParams(location.search).get("scope"), h = e !== "viewer" && typeof globalThis.chrome?.webview?.postMessage == "function", g = h;
	if (!h && ee) try {
		let e = await fetch("/__taskprogress/v1/capabilities/" + encodeURIComponent(ee));
		g = e.ok && (await e.json()).editable;
	} catch {}
	return {
		editable: g,
		desktop: h
	};
}
//#endregion
//#region node_modules/@lit/reactive-element/css-tag.js
var C = globalThis, ce = C.ShadowRoot && (C.ShadyCSS === void 0 || C.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, le = Symbol(), ue = /* @__PURE__ */ new WeakMap(), de = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== le) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (ce && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = ue.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ue.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, fe = (e) => new de(typeof e == "string" ? e : e + "", void 0, le), pe = (e, t) => {
	if (ce) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = C.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, me = ce ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return fe(t);
})(e) : e, { is: he, defineProperty: ge, getOwnPropertyDescriptor: _e, getOwnPropertyNames: ve, getOwnPropertySymbols: ye, getPrototypeOf: be } = Object, xe = globalThis, Se = xe.trustedTypes, Ce = Se ? Se.emptyScript : "", we = xe.reactiveElementPolyfillSupport, w = (e, t) => e, Te = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Ce : null;
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
}, Ee = (e, t) => !he(e, t), De = {
	attribute: !0,
	type: String,
	converter: Te,
	reflect: !1,
	useDefault: !1,
	hasChanged: Ee
};
Symbol.metadata ??= Symbol("metadata"), xe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var T = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = De) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && ge(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = _e(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? De;
	}
	static _$Ei() {
		if (this.hasOwnProperty(w("elementProperties"))) return;
		let e = be(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(w("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) {
			let e = this.properties, t = [...ve(e), ...ye(e)];
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
			for (let e of n) t.unshift(me(e));
		} else e !== void 0 && t.push(me(e));
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
		return pe(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? Te : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Te : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Ee)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[w("elementProperties")] = /* @__PURE__ */ new Map(), T[w("finalized")] = /* @__PURE__ */ new Map(), we?.({ ReactiveElement: T }), (xe.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var Oe = globalThis, ke = (e) => e, E = Oe.trustedTypes, Ae = E ? E.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, je = "$lit$", D = `lit$${Math.random().toFixed(9).slice(2)}$`, Me = "?" + D, Ne = `<${Me}>`, O = document, k = () => O.createComment(""), A = (e) => e === null || typeof e != "object" && typeof e != "function", Pe = Array.isArray, Fe = (e) => Pe(e) || typeof e?.[Symbol.iterator] == "function", Ie = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Le = /-->/g, Re = />/g, M = RegExp(`>|${Ie}(?:([^\\s"'>=/]+)(${Ie}*=${Ie}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ze = /'/g, Be = /"/g, Ve = /^(?:script|style|textarea|title)$/i, He = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), N = He(1), P = He(2), F = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), Ue = /* @__PURE__ */ new WeakMap(), L = O.createTreeWalker(O, 129);
function We(e, t) {
	if (!Pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Ae === void 0 ? t : Ae.createHTML(t);
}
var Ge = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = Le : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (Ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = Re : o === M ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? Be : ze) : o === Be || o === ze ? o = M : o === Le || o === Re ? o = j : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + Ne : l >= 0 ? (r.push(s), n.slice(0, l) + je + n.slice(l) + D + d) : n + D + (l === -2 ? t : d);
	}
	return [We(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Ke = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ge(t, n);
		if (this.el = e.createElement(l, r), L.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = L.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(je)) {
					let t = u[o++], n = i.getAttribute(e).split(D), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Je : r[1] === "?" ? Ye : r[1] === "@" ? Xe : B
					}), i.removeAttribute(e);
				} else e.startsWith(D) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ve.test(i.tagName)) {
					let e = i.textContent.split(D), t = e.length - 1;
					if (t > 0) {
						i.textContent = E ? E.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], k()), L.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], k());
					}
				}
			} else if (i.nodeType === 8) if (i.data === Me) c.push({
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
function R(e, t, n = e, r) {
	if (t === F) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = A(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = R(e, i._$AS(e, t.values), i, r)), t;
}
var qe = class {
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
				s.type === 2 ? t = new z(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ze(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = L.nextNode(), a++);
		}
		return L.currentNode = O, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, z = class e {
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
		e = R(this, e, t), A(e) ? e === I || e == null || e === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : e !== this._$AH && e !== F && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Fe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
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
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ke.createElement(We(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new qe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ue.get(e.strings);
		return t === void 0 && Ue.set(e.strings, t = new Ke(e)), t;
	}
	k(t) {
		Pe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(k()), this.O(k()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ke(e).nextSibling;
			ke(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, B = class {
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
		if (i === void 0) e = R(this, e, t, 0), a = !A(e) || e !== this._$AH && e !== F, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = R(this, r[n + o], t, o), s === F && (s = this._$AH[o]), a ||= !A(s) || s !== this._$AH[o], s === I ? e = I : e !== I && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Je = class extends B {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === I ? void 0 : e;
	}
}, Ye = class extends B {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== I);
	}
}, Xe = class extends B {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = R(this, e, t, 0) ?? I) === F) return;
		let n = this._$AH, r = e === I && n !== I || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== I && (n === I || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ze = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		R(this, e);
	}
}, Qe = {
	M: je,
	P: D,
	A: Me,
	C: 1,
	L: Ge,
	R: qe,
	D: Fe,
	V: R,
	I: z,
	H: B,
	N: Ye,
	U: Xe,
	B: Je,
	F: Ze
}, $e = Oe.litHtmlPolyfillSupport;
$e?.(Ke, z), (Oe.litHtmlVersions ??= []).push("3.3.3");
var et = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new z(t.insertBefore(k(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, tt = globalThis, V = class extends T {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = et(t, this.renderRoot, this.renderOptions);
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
V._$litElement$ = !0, V.finalized = !0, tt.litElementHydrateSupport?.({ LitElement: V });
var nt = tt.litElementPolyfillSupport;
nt?.({ LitElement: V }), (tt.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var H = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, U = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), rt = class {
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
}, { I: it } = Qe, at = (e) => e, ot = (e) => e.strings === void 0, st = () => document.createComment(""), W = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new it(r.insertBefore(st(), i), r.insertBefore(st(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = at(e).nextSibling;
				at(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, G = (e, t, n = e) => (e._$AI(t, n), e), ct = {}, lt = (e, t = ct) => e._$AH = t, ut = (e) => e._$AH, dt = (e) => {
	e._$AR(), e._$AA.remove();
}, ft = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, K = U(class extends rt {
	constructor(e) {
		if (super(e), e.type !== H.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = ut(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = G(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = G(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = G(i[d], a[m]), W(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = G(i[f], a[p]), W(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = ft(o, p, m), u = ft(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = W(e, i[d]);
				G(t, a[p]), c[p] = t;
			} else c[p] = G(n, a[p]), W(e, i[d], n), i[t] = null;
			p++;
		} else dt(i[f]), f--;
		else dt(i[d]), d++;
		for (; p <= m;) {
			let t = W(e, c[m + 1]);
			G(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && dt(e);
		}
		return this.ut = o, lt(e, c), F;
	}
}), pt = {}, mt = U(class extends rt {
	constructor() {
		super(...arguments), this.ot = pt;
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
}), q = U(class extends rt {
	constructor(e) {
		if (super(e), e.type !== H.PROPERTY && e.type !== H.ATTRIBUTE && e.type !== H.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!ot(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === F || t === I) return t;
		let n = e.element, r = e.name;
		if (e.type === H.PROPERTY) {
			if (t === n[r]) return F;
		} else if (e.type === H.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return F;
		} else if (e.type === H.ATTRIBUTE && n.getAttribute(r) === t + "") return F;
		return lt(e), t;
	}
}), J = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), J(e, t);
	return !0;
}, ht = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, gt = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), yt(t);
	}
};
function _t(e) {
	this._$AN === void 0 ? this._$AM = e : (ht(this), this._$AM = e, gt(this));
}
function vt(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) J(r[e], !1), ht(r[e]);
	else r != null && (J(r, !1), ht(r));
	else J(this, e);
}
var yt = (e) => {
	e.type == H.CHILD && (e._$AP ??= vt, e._$AQ ??= _t);
}, bt = class extends rt {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), gt(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (J(this, e), ht(this));
	}
	setValue(e) {
		if (ot(this._$Ct)) this._$Ct._$AI(e, this);
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
function xt(e = queueMicrotask) {
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
function St(e, t = (e) => e.enabled !== !1) {
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
var Ct = xt(), Y = U(class extends bt {
	render() {
		return I;
	}
	update(e, [t, n]) {
		return this.node = e.element, this.factory !== t && (this.clear(), this.factory = t), this.value = n, this.schedule(), I;
	}
	schedule() {
		Ct.add(this);
	}
	flush() {
		!this.isConnected || !this.node.isConnected || (this.binding ? this.binding.update?.(this.value) : this.binding = this.factory(this.node, this.value));
	}
	clear() {
		Ct.delete(this), this.binding?.destroy?.(), this.binding?.dispose?.(), this.binding = null;
	}
	disconnected() {
		this.clear();
	}
	reconnected() {
		this.factory && this.schedule();
	}
}), wt = (e, t = {}) => N`<div ${Y(_, {
	text: e ?? "",
	...t
})}></div>`, Tt = (e = !1, t = !1) => P`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e ? P`<path d="M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3" />` : P`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />`}${t ? P`<path d="M3 3l18 18" />` : I}</svg>`, Et = (e) => P`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${e === "free" ? P`<path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />` : P`<path d=${e === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d=${e === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />`}</svg>`, Dt = (e, t) => {
	let n = t, r, i = 0, a = async (t) => {
		t.stopPropagation(), clearTimeout(r);
		let a = ++i, o = !1;
		try {
			o = await (n.copy ? n.copy() : f(String(n.id)));
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
}, Ot = (e, t) => N`<button type="button" class="task-id-copy" title=${String(e)} aria-label="複製「${t}」的卡片 ID" ${Y(Dt, { id: e })}>⧉</button>`, kt = ({ cells: e = [], form: t = "segmented", ratio: n = 0, label: r = "", extraClass: i = "" } = {}) => t === "segmented" ? N`<div class="progress-bar progress-bar-segmented ${i}" role="img" aria-label=${r}>${e.map((e) => N`<i class="progress-cell progress-tone-${e}"></i>`)}</div>` : N`<progress class="progress-meter ${i}" max="100" .value=${Math.max(0, Math.min(100, n * 100))} aria-label=${r}></progress>`, At = class {
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
		this.disposed || (e || (this.contentVersion = (this.contentVersion ?? 0) + 1), et(this.renderer(this.props, this), this.target));
	}
	refresh = () => this.draw();
	on(e, t, n, r = {}) {
		e.addEventListener(t, n, {
			...r,
			signal: this.abort.signal
		});
	}
	destroy() {
		this.disposed || (this.disposed = !0, this.abort.abort(), this.cleanups.forEach((e) => typeof e == "function" ? e() : e?.dispose?.()), et(I, this.target));
	}
}, jt = St((e, t) => {
	let r = t, i = !1, a = new AbortController(), o = /* @__PURE__ */ new Map(), s = () => {
		let t = r.previewClasses ?? {};
		for (let n of /* @__PURE__ */ new Set([...o.keys(), ...e.children])) {
			let r = /* @__PURE__ */ new Set();
			if (n.parentElement === e) {
				let e = t[n.getAttribute("data-reorder-over")];
				e && r.add(e), t.dragging && n.hasAttribute("data-reorder-dragging") && r.add(t.dragging);
			}
			let i = o.get(n) ?? /* @__PURE__ */ new Set();
			for (let e of i) r.has(e) || n.classList.remove(e);
			for (let e of r) n.classList.contains(e) || n.classList.add(e);
			r.size ? o.set(n, r) : o.delete(n);
		}
	}, c = new e.ownerDocument.defaultView.MutationObserver((t) => {
		t.some((t) => t.type === "childList" ? t.target === e : t.target.parentElement === e) && s();
	});
	t.previewClasses && (s(), c.observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["data-reorder-over", "data-reorder-dragging"]
	}));
	let l, u = () => {
		l &&= (l.removeAttribute("data-reorder-handle"), l.draggable = !1, null);
	}, d = (t) => {
		if (u(), !r.surface) return;
		let n = [...e.children].find((e) => e.contains(t.target));
		if (!n || n.dataset.reorderSortable === "false") return;
		let i = t.type === "keydown" && t.target === n && t.altKey && ["ArrowUp", "ArrowDown"].includes(t.key), a = r.surface === "item" ? "a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg" : "button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg", o = t.type === "pointerdown" && t.button === 0 && t.pointerType === "mouse" && !t.target.closest(a);
		(i || o) && (l = n, n.setAttribute("data-reorder-handle", ""), n.draggable = !0);
	};
	e.addEventListener("pointerdown", d, {
		capture: !0,
		signal: a.signal
	}), e.addEventListener("keydown", d, {
		capture: !0,
		signal: a.signal
	}), e.ownerDocument.addEventListener("pointerup", u, { signal: a.signal }), e.ownerDocument.addEventListener("dragend", u, { signal: a.signal });
	let f = n(e, (t) => {
		let n = r.onMove(t);
		r.focusAfterMove && Promise.resolve(n).then(() => queueMicrotask(() => {
			i || !e.isConnected || [...e.children].find((e) => e.dataset.reorderId === t.id)?.focus();
		}));
	}, { axis: t.axis ?? "horizontal" });
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
function Mt(e = [], t = {}) {
	return N`<div class="horizontal-capsule-strip ${t.className ?? ""}" role="toolbar" aria-label=${t.ariaLabel ?? "模組"}
    ${Y(jt, {
		axis: "horizontal",
		focusAfterMove: !0,
		previewClasses: {
			before: "capsule-drop-before",
			after: "capsule-drop-after",
			dragging: "capsule-dragging"
		},
		onMove: (e) => t.onReorder?.(e.id, e.targetId, e.placement === "after")
	})}>
    ${K(e, (e) => e.id, (e) => N`<button type="button" data-capsule-id=${e.id} data-reorder-capsule=${String(e.sortable !== !1)} data-reorder-id=${e.id} data-reorder-handle data-reorder-sortable=${String(e.sortable !== !1)}
      class="capsule-button ${e.className ?? ""} ${e.sortable === !1 ? "" : "capsule-sortable"}" aria-pressed=${e.pressed ?? I}
      aria-label=${e.ariaLabel ?? e.label} aria-keyshortcuts=${e.sortable === !1 ? I : "Alt+ArrowLeft Alt+ArrowRight"} title=${e.title ?? I} ?disabled=${e.disabled} draggable=${e.sortable !== !1}
      @click=${() => t.onActivate?.(e.id)}><span>${e.label}</span>${e.showDot ? N`<span class="time-risk-dot ${e.dotClass ?? ""}"></span>` : I}${e.showChevron ? N`<span class="time-chevron">›</span>` : I}</button>`)}
  </div>`;
}
function Nt(e = {}) {
	let t = new Map((e.categories ?? []).map((e) => [e.id, e])), n = e.order?.length ? e.order : [re, ...t.keys()], r = n.find((e) => !t.has(e)), i = e.defaultLabel ?? "預設";
	return Mt(n.map((n) => n === r ? {
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
var Pt = (e = {}) => {
	let t = new Map((e.moduleOrder ?? []).map((e, t) => [e, t])), n = e.moduleOrder?.length ?? 0, r = [...e.capsules ?? []].sort((e, r) => (t.get(e.id) ?? n) - (t.get(r.id) ?? n));
	return r.length ? Mt(r, {
		...e,
		ariaLabel: e.ariaLabel ?? "子項目模組",
		className: e.className ?? "item-module-strip",
		onActivate: e.onActivate
	}) : I;
}, Ft = Object.freeze({
	icon: !0,
	label: !1,
	appearance: "ghost"
});
function It(e, t, n, r, i, a, o = "both") {
	return N`<ui-option-picker class="icon-choice" aria-label=${i} .label=${i} .options=${n}
    .value=${r} .interaction=${o} .delay=${300} orientation="vertical"
    .triggerDisplay=${Ft} .optionDisplay=${Ft}
    @choice-request=${(e) => a(e.detail.id)}></ui-option-picker>`;
}
function Lt({ id: e, label: t, expanded: n = !0, toggle: r, visibilityEnabled: i = !1, visible: a = !0, onVisibleChange: o }, s, c) {
	return N`<div class="card-disclosure-heading ${n ? "" : "card-disclosure-collapsed"}"><button type="button" class="card-disclosure-toggle" aria-expanded=${n} aria-controls=${e} aria-label="${n ? "收合" : "展開"} ${t}" @click=${() => r(!n)}><span aria-hidden="true">${n ? "▼" : "▶"}</span></button>
  ${i ? N`<button type="button" class="card-visibility-toggle card-toolbar-icon" aria-pressed=${a} aria-label="${a ? "隱藏" : "顯示"} ${t}" @click=${() => o(!a)}>${Tt(!a)}</button>` : I}${s}</div><div id=${e} class="card-disclosure-body" ?hidden=${!n}>${c}</div>`;
}
var Rt = class {
	constructor(e) {
		this.view = e, this.order = [], this.pins = [], this.mode = "forward", this.visibility = "disabled", this.hidden = [], this.selected = null, this.expanded = !0, this.overrides = {}, this.key = null, this.linkSelection = g(ne(location.search));
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
		return v(e, this.order, this.mode, this.props?.pinEnabled ? this.pins : [], this.props?.nextId).map((e) => e.id);
	}
	expand(e, t) {
		this.overrides[e] = t, S(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	all(e) {
		this.expanded = e, this.overrides = {}, S(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
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
			let e = x(a);
			this.expanded = e.expanded, this.overrides = e.overrides;
		}
		if (e.requestedPin && this.lastPin !== e.requestedPin && (e.allIds ?? e.items.map((e) => e.id)).includes(e.requestedPin)) {
			this.pins = b(this.pins, e.requestedPin), this.overrides[e.requestedPin] = !0, this.hidden = this.hidden.filter((t) => t !== e.requestedPin), this.visibility === "closed" && (this.visibility = "enabled"), this.lastPin = e.requestedPin;
			try {
				i && localStorage.setItem(`${i}:pins`, JSON.stringify(this.pins));
			} catch {}
		}
		let o = v(e.items, e.heldOrder ?? this.order, e.heldOrder ? "free" : this.mode, e.pinEnabled ? this.pins : [], e.nextId), s = this.linkSelection.claim(o.map((e) => e.id));
		s && (this.selected = s.id, this.hidden = this.hidden.filter((e) => e !== s.id), this.visibility === "closed" && (this.visibility = "enabled"), queueMicrotask(() => {
			if (this.view.disposed || this.selected !== s.id) return;
			e.onSelectionChange?.(s.id), this.view.draw();
			let t = [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(s.id));
			t?.focus({ preventScroll: !0 }), t?.scrollIntoView({ block: "center" });
		}));
		let c = this.linkSelection.selectionChanged(this.selected), l = (e) => this.visibility !== "closed" && (this.visibility !== "enabled" || !this.hidden.includes(e.id)), u = (t) => {
			this.mode !== "free" || e.pinEnabled && (this.pins.includes(t.id) || this.pins.includes(t.targetId)) || (this.order = y(e.allIds ?? o.map((e) => e.id), this.order, o.filter((t) => l(t) && !(e.pinEnabled && this.pins.includes(t.id))).map((e) => e.id), t.id, t.targetId, t.placement === "after"), e.onSelectionChange?.(null), this.selected = t.id, e.onSelectionChange?.(t.id), this.persist(), queueMicrotask(() => [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(t.id))?.focus()));
		}, d = o.find(l)?.id;
		return N`<div class="card-list-controls"><div class="card-list-heading"><p class="section-kicker">工作項目</p>${n}</div><div class="card-list-tools">
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
				free: "自由排序（可拖曳）"
			}[e],
			icon: Et(e)
		})), this.mode, "排序", (e) => {
			this.mode = e, this.persist(!0);
		})}
      ${It(this.view, "visibility", [
			{
				id: "enabled",
				label: "啟用",
				icon: Tt()
			},
			{
				id: "closed",
				label: "全體關閉",
				icon: Tt(!0)
			},
			{
				id: "disabled",
				label: "禁用",
				icon: Tt(!1, !0)
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
    </div></div><div class="arrangeable-cards" ${Y(jt, {
			axis: "vertical",
			surface: !0,
			previewClasses: {
				before: "card-drop-before",
				after: "card-drop-after"
			},
			onMove: u
		})}>
    ${K(o, (e) => e.id, (n, r) => N`<div class="arrangeable-card ${this.selected === n.id ? "card-selected" : ""}" role="group" tabindex="0" data-render-window data-card-id=${n.id} data-reorder-id=${n.id} data-reorder-sortable=${String(this.mode === "free" && !this.pins.includes(n.id))}
      aria-label=${`${n.title ?? n.question ?? ""}${this.selected === n.id ? "，已選取" : ""}`} data-link-tone=${this.selected === n.id ? c ?? I : I} ?hidden=${!l(n)}
      @pointerdown=${(e) => {
			e.button === 0 && this.select(n.id);
		}} @focusin=${() => this.select(n.id)} @keydown=${(e) => {
			e.target === e.currentTarget && ["Enter", " "].includes(e.key) && (e.preventDefault(), this.select(n.id));
		}}>
      ${e.pinEnabled ? N`<button type="button" class="card-pin ${this.pins.includes(n.id) ? "is-pinned" : ""} ${n.id === e.nextId ? "is-next" : ""}" aria-label="${this.pins.includes(n.id) ? "取消釘選" : "釘選置頂"}：${n.title}" aria-pressed=${this.pins.includes(n.id)} @click=${() => {
			this.pins = this.pins.includes(n.id) ? this.pins.filter((e) => e !== n.id) : b(this.pins, n.id), this.persist();
		}}><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill=${this.pins.includes(n.id) ? "currentColor" : "none"} stroke="currentColor" stroke-width="1.6" /></svg></button>` : I}
      ${mt([
			this.view.contentVersion,
			n,
			n.id === d,
			this.isExpanded(n.id),
			this.visibility,
			this.hidden.includes(n.id)
		], () => t(n, {
			lead: n.id === d,
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
function zt(e) {
	r();
	let t = {
		canClear: !1,
		entries: [],
		undoDepth: 0,
		redoDepth: 0,
		...e.history,
		canUndo: !!e.canUndo,
		canRedo: !!e.canRedo
	};
	return N`<span class="edit-save-status" id="edit-save-status" role="status">${e.message ?? ""}</span><ui-edit-history .history=${t} .panelAvailable=${!1} .disabled=${!!e.saving}
    @history-request=${(t) => {
		e.saving || (t.detail.action === "undo" && e.canUndo ? e.onUndo?.() : t.detail.action === "redo" && e.canRedo && e.onRedo?.());
	}}></ui-edit-history>
  ${e.onToggleCautious ? N`<button type="button" class="secondary-button edit-mode-button" aria-pressed=${!!e.cautious} ?disabled=${e.saving} @click=${() => e.onToggleCautious(!e.cautious)}>謹慎模式</button>` : I}
  ${e.cautious ? N`<button type="button" class="secondary-button edit-discard-button" ?disabled=${e.saving} @click=${e.onDiscard}>放棄</button><button type="button" class="primary-button edit-save-button" ?disabled=${!e.dirty || e.saving} @click=${e.onSave}>${e.saving ? "正在儲存…" : "儲存"}</button>` : I}`;
}
var Bt = (e, t) => {
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
}, Vt = (e, t) => (r(), N`<ui-dialog id=${e.id ?? I} class=${e.className ?? ""} .heading=${e.title ?? ""} .kicker=${e.kicker ?? ""} .closeLabel=${e.closeLabel ?? ""} .dismissDisabled=${!!e.busy} .dismissOnBackdrop=${e.dismissOnBackdrop ?? !0} ${Y(Bt, e)}>${e.open ? t : I}</ui-dialog>`), Ht = St((e, n) => {
	let r = n, i = t(e, {
		capture: !1,
		accept: (e) => !!r.enabled && !e.target.closest("a,button,input,textarea,select,label,[contenteditable]"),
		onTrigger: () => r.onTrigger?.()
	});
	return {
		update: (e) => {
			r = e;
		},
		destroy: () => i.dispose()
	};
}, (e) => !!e.enabled), Ut = (e) => {
	let t = globalThis.taskprogressTheme.control;
	return e.append(t), { destroy() {
		t.parentNode === e && t.remove();
	} };
}, Wt = () => N`<span class="replica-theme" ${Y(Ut, null)}></span>`;
//#endregion
//#region ui/web-workflow/time-settings-offset.mjs
function Gt() {
	let e = -(/* @__PURE__ */ new Date()).getTimezoneOffset(), t = e >= 0 ? "+" : "-", n = Math.abs(e);
	return `${t}${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
function Kt(e, t) {
	try {
		let [n, r] = e.split("T"), [i, a, o] = n.split("-").map(Number), [s, c] = r.split(":").map(Number), l = Date.UTC(i, a - 1, o, s, c), u = new Intl.DateTimeFormat("en-CA", {
			timeZone: t,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		}), d = (e) => {
			let t = Object.fromEntries(u.formatToParts(new Date(e)).filter((e) => e.type !== "literal").map((e) => [e.type, Number(e.value)]));
			return Math.round((Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute) - e) / 6e4);
		}, f = d(l);
		f = d(l - f * 6e4);
		let p = f >= 0 ? "+" : "-", m = Math.abs(f);
		return `${p}${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
	} catch {
		return Gt();
	}
}
//#endregion
//#region ui/web-workflow/time-settings.mjs
function qt(e) {
	let t = e.standard_allocation;
	return {
		initialDelivery: e.project?.delivery_at ?? "",
		delivery: (e.project?.delivery_at ?? "").slice(0, 16),
		reason: "",
		sleep: String(t.sleep_minutes_per_day / 60),
		life: String(t.life_minutes_per_day / 60),
		other: String(t.other_unavailable_minutes_per_day / 60),
		weekdays: [...t.working_weekdays],
		nextKey: 1 + (e.project?.capacity_exceptions?.length ?? 0),
		exceptions: (e.project?.capacity_exceptions ?? []).map((e, t) => ({
			key: t + 1,
			date: e.date,
			availableHours: String(e.available_minutes / 60),
			reason: e.reason ?? "",
			publicLabel: e.public_label ?? ""
		})),
		error: ""
	};
}
function Jt(e, t) {
	let n = e.initialDelivery.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
	return {
		deliveryAt: e.delivery ? `${e.delivery}:00${n ?? Kt(e.delivery, t.timezone)}` : "",
		deliveryReason: e.reason,
		capacity: {
			sleepMinutes: Math.round(Number(e.sleep) * 60),
			lifeMinutes: Math.round(Number(e.life) * 60),
			otherUnavailableMinutes: Math.round(Number(e.other) * 60),
			workingWeekdays: e.weekdays,
			capacityExceptions: e.exceptions.map((e) => ({
				date: e.date,
				availableMinutes: Math.round(Number(e.availableHours) * 60),
				reason: e.reason,
				publicLabel: e.publicLabel
			}))
		}
	};
}
var Yt = [
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"日"
];
function Xt(e, t) {
	let n = t.state.settings ??= qt(e.config), r = () => {
		n.error = "", e.onPendingChange(!0), t.draw();
	}, i = (e, t) => {
		n[e] = t, r();
	}, a = (e, t) => N`<label><span>${t}</span><input type="number" min="0" max="24" step="0.5" .value=${q(String(n[e] ?? ""))} @input=${(t) => i(e, t.currentTarget.value === "" ? void 0 : t.currentTarget.valueAsNumber)}></label>`, o = 24 - Number(n.sleep) - Number(n.life) - Number(n.other);
	return N`<section class="spike-time-editor" aria-labelledby="time-settings-title"><div class="spike-time-editor-heading"><p class="spike-editor-kicker">時間設定</p><h2 id="time-settings-title">工作容量與交付日</h2><p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p><p class="spike-timezone">時區：${e.config.timezone}</p></div>
    <div class="spike-time-settings-fields"><section class="spike-delivery-settings" aria-labelledby="delivery-settings-title"><h3 id="delivery-settings-title">交付日</h3><div class="spike-delivery-controls"><label><span>排他截止時間</span><input type="datetime-local" .value=${q(n.delivery)} @input=${(e) => i("delivery", e.currentTarget.value)}></label><label class="spike-delivery-reason"><span>修改原因（不填敏感原文）</span><input maxlength="500" .value=${q(n.reason)} @input=${(e) => i("reason", e.currentTarget.value)} placeholder="例如：配合里程碑調整"></label><button class="spike-subtle-button" type="button" @click=${() => i("delivery", "")}>設為未指定</button></div></section>
    <section class="spike-capacity-settings" aria-labelledby="capacity-settings-title"><div class="spike-setting-heading"><h3 id="capacity-settings-title">每日分配</h3><strong class=${o > 0 ? "" : "invalid"}>工作 ${Number.isFinite(o) ? o : "—"} hr</strong></div><div class="spike-allocation-fields">${a("sleep", "睡眠（hr）")}${a("life", "生活（hr）")}${a("other", "其他不可工作（hr）")}</div><fieldset class="spike-weekdays"><legend>工作日</legend>${Yt.map((e, t) => N`<label><input type="checkbox" .checked=${n.weekdays.includes(t + 1)} @change=${(e) => {
		n.weekdays = e.currentTarget.checked ? [.../* @__PURE__ */ new Set([...n.weekdays, t + 1])].sort((e, t) => e - t) : n.weekdays.filter((e) => e !== t + 1), r();
	}}><span>週${e}</span></label>`)}</fieldset></section>
    <section class="spike-exception-settings" aria-labelledby="exception-settings-title"><div class="spike-setting-heading"><div><h3 id="exception-settings-title">休假與容量例外</h3><p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div><button class="spike-subtle-button" type="button" @click=${() => {
		n.exceptions.push({
			key: n.nextKey++,
			date: "",
			availableHours: "0",
			reason: "",
			publicLabel: ""
		}), r();
	}}>＋ 新增例外</button></div>
    ${n.exceptions.length ? N`<div class="spike-exception-list">${K(n.exceptions, (e) => e.key, (e) => N`<div class="spike-exception-row"><label><span>日期</span><input type="date" .value=${q(e.date)} @input=${(t) => {
		e.date = t.currentTarget.value, r();
	}}></label><label><span>可工作（hr）</span><input type="number" min="0" max="24" step="0.5" .value=${q(String(e.availableHours ?? ""))} @input=${(t) => {
		e.availableHours = t.currentTarget.value, r();
	}}></label><label><span>請假／例外說明</span><input maxlength="500" .value=${q(e.publicLabel)} placeholder="例如：不可工作" @input=${(t) => {
		e.publicLabel = t.currentTarget.value, r();
	}}></label><button class="spike-delete-exception" type="button" @click=${() => {
		n.exceptions = n.exceptions.filter((t) => t.key !== e.key), r();
	}}>刪除</button></div>`)}</div>` : N`<p class="spike-empty-setting">目前沒有休假或容量例外。</p>`}</section>
    <div class="spike-time-settings-actions"><button type="button" @click=${async () => {
		let r = e.onApply(Jt(n, e.config));
		n.error = r?.error ?? "", t.draw(), !n.error && (e.onPendingChange(!1), await e.onPreview());
	}}>重新計算預覽</button>${n.error ? N`<p class="spike-field-error" role="alert">${n.error}</p>` : I}</div></div></section>`;
}
//#endregion
//#region ui/web-workflow/assessment.mjs
var X = (e = []) => N`<div class="assessment-metric-grid">${e.map((e) => N`<div class="assessment-metric"><span>${e.label}</span><strong>${e.tone ? N`<span class="assessment-tone-dot assessment-tone-${e.tone}" aria-hidden="true"></span>` : I}${e.value}</strong></div>`)}</div>`, Z = (e, t, n) => N`<section class="assessment-note"><h3>${n ? N`<span class="assessment-tone-dot assessment-tone-${n}" aria-hidden="true"></span>` : I}${e}</h3>${t}</section>`, Zt = (e) => (e ?? []).map((e) => N`<span class="assessment-source-badge source-${e.kind}">${e.label}</span>`), Qt = (e, t, n) => N`<section class="assessment-readout"><span class="assessment-readout-label">${e}</span><span class="assessment-readout-badges">${n}</span><strong class="assessment-readout-value">${t}</strong></section>`, $t = (e) => N`<div class="time-source-list">${(e ?? []).map((e) => N`<div class="time-source-row"><div><strong>${e.label}</strong><p>${e.note}</p></div><span>${e.value}</span></div>`)}</div>`, en = (e) => N`<section class="time-composition"><h3>估算組成</h3>${$t(e)}</section>`, Q = (e, t = "") => N`<div class="time-evaluation-node ${t}"><span>${e.label}</span><strong>${e.value}</strong><small>${e.note}</small></div>`, tn = (e, t) => N`<section class="time-tab-panel time-flow-panel" id="time-flow-panel" role="tabpanel" aria-labelledby="time-flow-tab" ?hidden=${!t}><p class="time-flow-intro">${e.intro}</p><div class="time-flow-lanes">
  <section class="time-flow-lane" aria-label="工程估算路徑">${Q(e.engineeringLane.source)}<span class="time-flow-arrow">→</span>${Q(e.engineeringLane.result, "time-evaluation-result")}</section>
  <section class="time-flow-lane" aria-label="工作容量路徑">${Q(e.capacityLane.source)}<span class="time-flow-arrow">→</span>${Q(e.capacityLane.result, "time-evaluation-result")}</section></div>
  <div class="time-flow-merge"><span class="time-flow-arrow">↓</span>${Q(e.merge, e.merge.className)}</div><div class="time-flow-lane time-flow-risk">${Q(e.risk.trend)}<span class="time-flow-arrow">→</span>${Q(e.risk.result, e.risk.result.className)}</div><p class="time-flow-note">${e.note}</p></section>`, nn = (e, t) => N`<section class="time-tab-panel" id="time-engineering-panel" role="tabpanel" aria-labelledby="time-engineering-tab" ?hidden=${!t}>${X(e.metrics)}${Z("風險評估公式", N`<p>${e.explanation.text}</p><code class="time-formula">${e.explanation.formula}</code>`, e.explanation.className)}${Z("執行校準", N`<p>${e.calibrationText}</p>`)}${en(e.composition)}</section>`, rn = (e, t) => N`<section class="time-tab-panel" id="time-capacity-panel" role="tabpanel" aria-labelledby="time-capacity-tab" ?hidden=${!t}><div class="time-capacity-toolbar"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div>${X(e.metrics)}${Z("每日容量公式", N`<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p><code class="time-formula">${e.formulaCode}</code>`)}<section class="time-composition"><h3>${e.exceptionsHeading}</h3>${e.exceptions ? $t(e.exceptions) : N`<div class="time-source-list"><p class="time-empty-note">目前沒有休假或其他容量例外。</p></div>`}</section></section>`, an = (e) => N`<section class="time-tab-panel time-estimate-only-panel"><p class="time-flow-intro">${e.intro}</p>${X(e.metrics)}${Z("執行校準", N`<p>${e.calibrationText}</p>`)}${en(e.composition)}</section>`;
function on(e, t) {
	let n = e.item, r = e.activeEstimate, i = `${n.itemId}:${r?.estimate_id ?? "analysis"}`;
	t.state.manualKey !== i && (t.state.manualKey = i, t.state.manual = {
		hours: r?.likely_minutes ? String(r.likely_minutes / 60) : n.unset ? "" : String(n.likelyMinutes / 60),
		note: r?.human_note ?? "",
		confirmed: !!(r?.human_confirmed ?? n.humanConfirmed),
		error: ""
	});
	let a = t.state.manual, o = e.title;
	return N`<form class="spike-estimate-form" @submit=${(r) => {
		r.preventDefault();
		let i = Number(a.hours);
		!Number.isFinite(i) || i <= 0 ? a.error = "工時必須大於 0。" : a.error = e.onManualEstimate({
			taskId: n.taskId,
			itemId: n.itemId,
			likelyMinutes: Math.round(i * 60),
			humanNote: a.note,
			humanConfirmed: a.confirmed
		})?.error ?? "", t.draw();
	}}>
    <section class="spike-estimate-row"><div class="spike-estimate-badges"><span>預估工時</span>${Zt(n.sourceBadges)}</div><label class="spike-estimate-hours"><span>人工工時（hr）</span><input type="number" min="0.02" step="0.25" aria-label="「${o}」人工工時（hr）" .value=${q(String(a.hours ?? ""))} @input=${(e) => {
		a.hours = e.currentTarget.value === "" ? void 0 : e.currentTarget.valueAsNumber;
	}}></label></section>
    <div class="time-item-rationale">${Z("估算依據", N`<label class="spike-estimate-note"><span>人工依據</span><input maxlength="1000" aria-label="「${o}」人工依據" .value=${q(a.note)} @input=${(e) => {
		a.note = e.currentTarget.value;
	}} placeholder="例如：已拆解三個步驟"></label>`)}</div>
    <label class="spike-estimate-confirmation"><input type="checkbox" aria-label="確認「${o}」的人工估算" .checked=${a.confirmed} @change=${(e) => {
		a.confirmed = e.currentTarget.checked;
	}}><span>人工確認此工時</span></label><p class="spike-estimate-contract">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p><div class="spike-estimate-actions"><button type="submit" aria-label="套用「${o}」人工估算草稿">套用工時草稿</button></div>${a.error ? N`<p class="spike-field-error" role="alert">${a.error}</p>` : I}</form>`;
}
function sn(e, t) {
	if (!e.open) return delete t.state.manualKey, delete t.state.settings, Vt({
		...e,
		id: "time-dialog",
		className: "replica-time-dialog"
	}, I);
	(e.kind !== "item" || !e.editing) && delete t.state.manualKey, (e.kind !== "project" || !e.editing || !e.timeSettings?.hasConfig) && delete t.state.settings;
	let n = e.item, r = e.project, i = e.kind === "item" && n ? N`<div><div class="time-detail-toolbar"><span class=${n.confidenceClass}>${n.confidenceLabel}</span><button class="time-small-button" type="button" @click=${e.onToggleDetails}>${n.toggleLabel}</button></div>
    ${e.editing && e.onManualEstimate ? on(e, t) : N`${Qt("預估工時", n.likelyHoursLabel, Zt(n.sourceBadges))}<div class="time-item-rationale">${Z("估算依據", N`<p>${n.rationale}</p>`)}</div>`}
    <section class="time-item-technical" ?hidden=${!n.detailsExpanded}>${X(n.technical.metrics)}${n.technical.analysisMethod ? N`<div class="time-source-row"><div><strong>${n.technical.analysisMethod.name}</strong><p>${n.technical.analysisMethod.note}</p></div><span>${n.technical.analysisMethod.version}</span></div>` : I}${n.technical.formula ? Z("固定公式", N`<code class="time-formula">${n.technical.formula}</code>`) : I}${n.technical.reference ? N`<code class="time-reference">${n.technical.reference}</code>` : I}</section></div>` : e.kind === "project" && r ? N`<div><div class="time-detail-toolbar"><span class="time-report-caption">${r.captionLabel}</span><button class="time-small-button" type="button" aria-expanded=${r.detailsExpanded} @click=${e.onToggleDetails}>${r.toggleLabel}</button></div>
    <section class="time-report-overview"><div class="time-report-grid">${r.overview.map((e) => N`<div class="time-report-field"><span>${e.label}</span><strong>${e.urgencyClassName ? N`<span class="time-risk-dot ${e.urgencyClassName}" aria-hidden="true"></span>` : I}${e.value}</strong></div>`)}</div><p class="time-report-updated">${r.updatedLabel}</p></section>
    <section class="time-project-details" ?hidden=${!r.detailsExpanded}>${e.editing && e.timeSettings ? e.timeSettings.hasConfig ? N`${Xt(e.timeSettings, t)}${e.deliveryPreview ? pn(e.deliveryPreview) : I}` : N`<section class="time-missing-config" aria-labelledby="time-missing-config-title"><h3 id="time-missing-config-title">尚未建立工作容量設定</h3><p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p><button type="button" @click=${e.timeSettings.onInitializeConfig}>建立 8/8/8 預設設定</button></section>` : r.hasDeadline ? N`<div class="time-tab-list" role="tablist" aria-label="進度報告詳細資訊">${K(r.tabs, (e) => e.name, (n, i) => N`<button class="time-tab" id="time-${n.name}-tab" type="button" role="tab" aria-controls="time-${n.name}-panel" aria-selected=${r.activeTab === n.name} tabindex=${r.activeTab === n.name ? 0 : -1} @click=${() => e.onSetTab(n.name)} @keydown=${(n) => {
		if (!["ArrowLeft", "ArrowRight"].includes(n.key)) return;
		n.preventDefault();
		let a = r.tabs[(i + (n.key === "ArrowRight" ? 1 : -1) + r.tabs.length) % r.tabs.length];
		e.onSetTab(a.name), queueMicrotask(() => t.target.querySelector(`#time-${a.name}-tab`)?.focus());
	}}>${n.label}</button>`)}</div>${tn(r.flow, r.activeTab === "flow")}${nn(r.engineering, r.activeTab === "engineering")}${rn(r.capacity, r.activeTab === "capacity")}` : an(r.estimateOnly)}</section></div>` : I;
	return Vt({
		...e,
		id: "time-dialog",
		className: "replica-time-dialog",
		closeLabel: `關閉${e.kicker}`
	}, N`<div class="time-dialog-content">${i}</div>`);
}
function cn(e) {
	let t = e.item, n = e.total;
	return Vt({
		...e,
		id: "cost-dialog",
		className: "replica-cost-dialog",
		closeLabel: `關閉${e.kicker}`
	}, N`<div class="cost-dialog-content">${e.kind === "item" && t ? N`
    ${Qt("估算成本", t.exact, Zt(t.contributors))}${X([
		...t.confidenceLabel ? [{
			label: "信心",
			value: t.confidenceLabel
		}] : [],
		{
			label: "人工確認",
			value: t.humanConfirmed ? "已確認" : "未確認"
		},
		{
			label: "狀態",
			value: t.done ? "已完成" : "未完成"
		}
	])}
    ${t.humanConfirmed ? I : Z("尚未由人確認", N`<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>`)}` : n ? N`${Qt("估算總額", n.exact, N`<span class="cost-coverage cost-coverage-${n.coverage}">${n.coverageLabel}</span>`)}${X([{
		label: "未完成成本",
		value: n.remaining
	}, ...n.available ? [{
		label: "可用資源",
		value: n.available
	}, {
		label: "餘額",
		value: n.balance,
		tone: n.tone
	}] : []])}
      ${n.coverage === "full" ? I : Z("為什麼沒有資源判斷", N`<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，因此在涵蓋率完整之前不宣稱預算充足與否。</p>`)}` : I}</div>`);
}
var ln = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 }), un = (e) => e == null ? "—" : `${ln.format(e / 60)} hr`, dn = (e) => e == null ? "無法比較" : `${e > 0 ? "+" : ""}${ln.format(e / 60)} hr`;
function fn(e) {
	if (!e?.present) return "未指定";
	let t = new Date(e.value);
	return Number.isNaN(t.getTime()) ? e.value : new Intl.DateTimeFormat("zh-TW", {
		dateStyle: "medium",
		timeStyle: "short",
		hour12: !1
	}).format(t);
}
function pn(e, t = "交付日草稿預覽") {
	return N`<section class="spike-risk-preview" aria-labelledby="delivery-risk-preview-title"><div class="spike-risk-preview-heading"><div><p class="spike-editor-kicker">尚未寫入</p><h3 id="delivery-risk-preview-title">${t}</h3></div><span class="spike-preview-badge">預覽</span></div>
    ${e.deliveryChanged ? N`<dl class="spike-delivery-diff"><div><dt>原交付日</dt><dd>${fn(e.before)}</dd></div><div><dt>草稿交付日</dt><dd>${fn(e.after)}</dd></div></dl>` : e.capacityChanged ? N`<p class="spike-capacity-preview-note">交付日未變更；以下比較只反映工作容量草稿。</p>` : I}
    <div class="spike-risk-comparison"><article><span>目前分析</span><strong>${e.current.label}</strong><small>剩餘容量 ${un(e.current.remainingCapacityMinutes)}</small></article><span class="spike-risk-arrow" aria-hidden="true">→</span><article class="risk-${e.next.urgency ?? "none"}"><span>草稿分析</span><strong>${e.next.label}</strong><small>剩餘容量 ${un(e.next.remainingCapacityMinutes)}</small></article></div>
    <dl class="spike-risk-deltas"><div><dt>容量變化</dt><dd>${dn(e.capacityDelta)}</dd></div><div><dt>餘裕／缺口變化</dt><dd>${dn(e.balanceDelta)}</dd></div></dl>${e.reason ? N`<p class="spike-preview-reason"><strong>修改原因：</strong>${e.reason}</p>` : I}</section>`;
}
var mn = (e) => Vt({
	open: !0,
	title: "確認儲存交付日變更？",
	kicker: "敏感資料確認",
	className: "replica-delivery-confirmation",
	busy: e.busy,
	dismissOnBackdrop: !1,
	initialFocus: "[data-return-button]",
	onClose: () => {
		e.busy || e.onBack();
	}
}, N`<div class="spike-confirm-copy"><p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div>${pn(e.preview, "儲存影響確認")}<div class="spike-confirm-actions"><button data-return-button type="button" ?disabled=${e.busy} @click=${e.onBack}>返回修改</button><button class="spike-save-button" type="button" ?disabled=${e.busy} @click=${e.onConfirm}>${e.busy ? "正在儲存…" : "確認儲存"}</button></div>`);
//#endregion
//#region ui/web-workflow/viewer.mjs
r();
var hn = Object.entries(l).map(([e, t]) => ({
	value: e,
	...t
})), $ = (e) => l[e] ?? {
	label: e,
	tone: "muted"
}, gn = (e, t, n, r, i = "") => N`<select class=${i} aria-label=${n} .value=${q(String(t))} @change=${(e) => r(e.currentTarget.value)}>${e.map((e) => N`<option .value=${String(e.value)} ?selected=${String(e.value) === String(t)}>${e.label}</option>`)}</select>`, _n = (e, t, n, r) => gn(e.levels.map((t) => ({
	value: t.value,
	label: e.format(t.value)
})), e.normalize(t, e.fallbackValue), n, (e) => r(Number(e)), "inline-priority-select");
function vn(e, t, n) {
	return {
		enabled: !!(e.editing || e.reorderable),
		axis: "vertical",
		surface: !e.editing && "item",
		previewClasses: e.editing ? {
			before: "item-drop-before",
			after: "item-drop-after",
			dragging: "item-row-dragging"
		} : {
			before: "item-gap-before",
			after: "item-gap-after",
			dragging: "item-row-dragging"
		},
		onMove(r) {
			if (!(e.editing || e.reorderable)) return;
			let i = n.pending_items ?? [], a = i.find((e) => e.id === r.id), o = i.find((e) => e.id === r.targetId);
			if (!a || !o || a.legacy || o.legacy || e.policy.normalize(a.priority, e.policy.fallbackValue) !== e.policy.normalize(o.priority, e.policy.fallbackValue)) return;
			let s = i.map((e) => e.id), c = s.filter((e) => e !== a.id);
			if (c.splice(c.indexOf(o.id) + +(r.placement === "after"), 0, a.id), s.every((e, t) => e === c[t])) return;
			let l = {
				taskId: n.id,
				itemId: a.id,
				position: { [r.placement]: o.id }
			}, u = e.editing, d = u ? e.onCommand({
				type: "reorder-item",
				...l
			}) : e.onReorder?.(l);
			Promise.resolve(d).then(() => queueMicrotask(() => {
				if (t.disposed || t.props.editing !== u) return;
				let e = [...t.target.querySelectorAll("[data-item-row]")].find((e) => e.dataset.itemRow === `${n.id}/${a.id}`);
				(u ? e?.querySelector(".item-row-grip") : e)?.focus();
			}));
		}
	};
}
function yn(e, t, n, r, i, a) {
	let o = e.editing, s = i.status ?? (r === "completed_items" ? "done" : "planned"), c = i.derivedState && i.derivedState !== "done" ? {
		label: i.derivedStateLabel,
		tone: i.derivedStateTone
	} : $(s), l = e.policy.metadata(i.priority), u = o ? null : p({
		scopeId: e.scopeId,
		taskId: n.id,
		item: i
	}), d = u && t.state.selection?.keys.has(u), g = i.id === e.nextItemId, ne = () => e.onSetNext?.({
		taskId: n.id,
		itemId: i.id,
		clear: g
	}), _ = (t, a) => e.onCommand({
		type: t,
		taskId: n.id,
		field: r,
		itemId: i.id,
		...a
	}), v = o ? [] : ee(i).map((e) => ({
		...e,
		href: e.href ? te(e.href, c.tone) : null
	})), y = v.filter((e) => e.href), b = `${n.id}/${i.id}`;
	y.length || (t.state[`wait:${b}`] = !1);
	let x = (o || e.reorderable) && r === "pending_items" && i.id && !i.legacy, S = d ? t.state.selection.keys.size : 1, re = S > 1 ? `複製已選取的 ${S} 項參照` : u;
	return N`<li class="editor-item-row ${o ? "editable-work-item" : x ? "item-row-reorderable" : ""} ${d ? "is-selected" : ""} ${g ? "is-next" : ""}" data-select-key=${u && e.selection ? u : I}
    data-item-row=${b} data-reorder-id=${i.id} data-reorder-sortable=${String(!!x)} data-reorder-group=${String(e.policy.normalize(i.priority, e.policy.fallbackValue))}
    tabindex=${u && e.selection ? 0 : I} title=${o ? I : m(i.activity)}
    ${Y(Ht, {
		enabled: !!(e.onSetNext && u && !o),
		onTrigger: ne
	})}
    @click=${(t) => u && e.selection?.rowClick(u, t)} @focus=${() => u && e.selection?.rowFocus(u)}
    @keydown=${(t) => {
		if (!o && t.shiftKey && t.key === "Enter" && e.onSetNext && u && t.target === t.currentTarget) {
			t.preventDefault(), ne();
			return;
		}
		u && e.selection?.rowKeydown(u, t);
	}}>
    ${o && x ? N`<button type="button" class="item-row-grip" data-item-ref=${b} data-reorder-handle draggable="true" aria-label="移動「${i.title}」（Alt+↑／↓，限同優先級）">⠿</button>` : N`<span class="item-row-marker item-row-marker-${s}" aria-hidden="true">${s === "done" ? "✓" : "○"}</span>`}
    ${o || s !== "done" && l && (!l.hidden || !e.policy.labelsValid) ? N`<span class="item-row-priority">${o ? _n(e.policy, i.priority, `設定「${i.title}」的優先級`, (e) => _("set-item-field", {
		property: "priority",
		value: e
	})) : N`<span class="priority-badge priority-${l.tone}">${e.policy.format(i.priority)}</span>`}</span>` : I}
    <div class="item-row-description" data-reorder-content>${o ? N`<input class="inline-edit-input" aria-label="編輯子項目：${i.title}" title=${i.title} maxlength="500" .value=${q(i.title)} @input=${(e) => _("set-item-field", {
		property: "title",
		value: e.currentTarget.value
	})}>` : N`<div class="item-row-text">${g ? N`<span class="item-next-capsule">Next</span>` : I}${d ? N`<span class="item-row-selected-label">已選取</span>` : I}
      ${i.sourceRef ? i.sourceRef.available ? N`<a class="document-source-link" href=${te(i.sourceRef.href, c.tone)} title=${i.sourceRef.title}><span class="source-icon" aria-hidden="true">${i.sourceRef.kind === "decision" ? "⚖" : i.sourceRef.manual ? "📋" : "🤖"}</span><span class="source-label">${i.sourceRef.label}</span></a>` : N`<span class="document-source-link source-unavailable" title=${i.sourceRef.error ?? "來源無法讀取"}>⚠️ 來源不可用</span>` : I}
      ${wt(i.displayTitle ?? i.title, {
		lines: 1,
		expanded: a,
		linkTone: c.tone
	})}</div>`}</div>
    ${u ? N`<button type="button" class="item-row-copy" data-item-ref=${b} tabindex=${e.selection ? -1 : 0} aria-label=${S > 1 ? `複製已選取的 ${S} 項參照` : `複製「${i.title}」的參照`} title=${re} ${Y(Dt, {
		copy: () => e.selection ? e.selection.copyReferences(u) : f(u),
		feedbackTitle: !0,
		title: re
	})}>⧉</button>` : I}
    <span class="item-row-utility-panel"><span class="item-row-modules">${Pt({
		capsules: e.itemCapsules?.get(i.id) ?? [],
		moduleOrder: e.moduleOrder,
		onReorder: e.onModuleReorder,
		onActivate: (t) => e.onModuleActivate?.(t, {
			taskId: n.id,
			itemId: i.id,
			itemTitle: i.title
		})
	})}</span>
    <span class="item-row-status">${o ? gn(hn, s, `設定「${i.title}」的狀態`, (e) => _("set-item-status", { status: e }), "inline-status-select") : v.length === 1 && y.length === 1 ? N`<a class="item-status-capsule status-${c.tone} is-link" href=${y[0].href} title=${h(i) ?? y[0].label}>${c.label}</a>` : y.length ? N`<span class="wait-menu" @focusout=${(e) => {
		e.currentTarget.contains(e.relatedTarget) || (t.state[`wait:${b}`] = !1, t.draw());
	}} @keydown=${(e) => {
		e.key === "Escape" && (t.state[`wait:${b}`] = !1, t.draw());
	}}><button type="button" class="item-status-capsule status-${c.tone} is-link" aria-haspopup="true" aria-expanded=${!!t.state[`wait:${b}`]} @click=${(e) => {
		e.stopPropagation(), t.state[`wait:${b}`] = !t.state[`wait:${b}`], t.draw();
	}}>${c.label}</button>${t.state[`wait:${b}`] ? N`<ul class="wait-menu-list">${v.map((e) => N`<li>${e.href ? N`<a href=${e.href} @click=${(e) => e.stopPropagation()}>${e.label}</a>` : N`<span>${e.label}（無法讀取）</span>`}</li>`)}</ul>` : I}</span>` : N`<span class="item-status-capsule status-${c.tone}" title=${h(i) ?? I}>${c.label}</span>`}</span>
    ${o ? N`<span class="item-row-action"><button class="inline-delete-button" type="button" aria-label="刪除子項目：${i.title}" @click=${() => _("delete-item", {})}>刪除</button></span>` : I}</span>
  </li>`;
}
function bn(e) {
	if (!e) return I;
	let t = e.next_step ?? e.next_steps?.[0];
	return !t && !e.next_steps?.length && !e.blockers?.length && !e.decisions?.length && !e.routes?.length && !e.claim ? I : N`<details class="developer-details"><summary class="developer-summary">${t ? N`<span class="developer-next-label">後續：</span><span class="developer-next-action">${t}</span>` : I}<span class="developer-expand-hint">展開作法與方向</span></summary><div class="developer-body"><h4 class="developer-body-title">作法與方向</h4>
    ${[["後續", e.next_step ? e.next_steps : e.next_steps?.slice(1)], ["Blockers", e.blockers]].map(([e, t]) => t?.length ? N`<section class="detail-section"><h4 class="detail-heading">${e}</h4><ul class="detail-list">${t.map((e) => N`<li>${e}</li>`)}</ul></section>` : I)}
    ${e.decisions?.map((e) => N`<article class="decision-item"><p>${e.summary}</p><code>${e.reference ?? ""}</code></article>`)}
    ${e.routes?.map((e) => N`<article class="route-item"><div class="route-heading"><strong>${e.title}</strong><span class="route-state route-${e.state}">${e.state}</span></div><p>${e.reason ?? ""}</p></article>`)}
    ${e.claim ? N`<section class="detail-section claim-section"><h4>Claim</h4><p>Agent: ${e.claim.agent}</p><p>${e.claim.worktree ?? ""}</p>${e.claim.source_paths?.map((e) => N`<code class="reference">${e}</code>`)}</section>` : I}
  </div></details>`;
}
function xn(e, t, n, r) {
	let i = $(n.status), a = e.policy.metadata(n.priority), o = e.progress[n.id], s = (t, r) => e.onCommand({
		type: "set-task-field",
		taskId: n.id,
		field: t,
		value: r
	}), c = [{
		status: "done",
		title: "已完成",
		className: "completed-work",
		field: "completed_items",
		items: n.completed_items ?? []
	}, {
		status: "planned",
		title: "待處理",
		className: "pending-work",
		field: "pending_items",
		items: d(u(n.pending_items), e.nextItemId)
	}];
	return c.sort((t, n) => {
		let r = (t) => {
			let n = e.statusOrder?.indexOf(t) ?? -1;
			return n < 0 ? 99 : n;
		};
		return r(t.status) - r(n.status);
	}), N`<article class="task-card editor-task-card priority-${a?.tone ?? "unspecified"}" aria-labelledby="task-${n.id}-title">${Lt({
		...r,
		id: `task-body-${n.id}`,
		label: n.title
	}, N`<header class="task-header"><div class="task-title-group">${e.editing ? N`<div class="time-task-status-line">${gn(hn, n.status, `${n.title} 狀態`, (e) => s("status", e), "inline-status-select")}${_n(e.policy, n.priority, `${n.title} 優先級`, (e) => s("priority", e))}</div>` : I}
    <div class="time-task-title-line">${e.editing ? N`<input id="task-${n.id}-title" class="task-title-input" aria-label="任務名稱" maxlength="160" .value=${q(n.title)} @input=${(e) => s("title", e.currentTarget.value)}>` : N`${Ot(n.id, n.title)}<h3 id="task-${n.id}-title">${n.title}</h3>`}</div>
    ${e.moduleTotals?.[n.id]?.length ? N`<div class="task-module-totals">${e.moduleTotals[n.id].map((e) => N`<span class="task-module-total task-module-total-${e.id}">${e.label}</span>`)}</div>` : I}</div>
    <div class="task-header-meta"><strong class="task-fraction" aria-label="子項目完成 ${o.completed}，共 ${o.total}">${o.completed} / ${o.total}</strong><span class="status-badge status-${i.tone}">${i.label}</span><code class="task-id">${n.id}</code></div></header>`, N`${e.editing ? N`<textarea class="task-summary-input" aria-label="任務描述" maxlength="1000" rows="3" .value=${q(n.summary ?? "")} @input=${(e) => s("summary", e.currentTarget.value)}></textarea>` : N`<div class="task-summary">${wt(n.summary, {
		lines: 2,
		emphasis: !0
	})}</div>`}${bn(n.developer)}
      <div class="work-columns">${c.map((i) => i.items.length || e.editing ? N`<section class="detail-section ${i.className}"><h4 class="detail-heading">${i.title}</h4><ul class="detail-list" id="task-${n.id}-${i.field}" ${Y(jt, vn(e, t, n))}>${K(i.status === "done" && !t.state[`completed:${n.id}`] ? i.items.slice(0, 1) : i.items, (e) => e.id, (a, o) => yn(e, t, n, i.field, a, r.lead && i.status !== "done" && o === 0 || a.id === e.nextItemId))}</ul>
      ${i.status === "done" && i.items.length > 1 ? N`<button type="button" class="completed-more" aria-expanded=${!!t.state[`completed:${n.id}`]} aria-controls="task-${n.id}-${i.field}" @click=${() => {
		t.state[`completed:${n.id}`] = !t.state[`completed:${n.id}`], t.draw();
	}}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d=${t.state[`completed:${n.id}`] ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>${t.state[`completed:${n.id}`] ? "收合" : `顯示更多（${i.items.length - 1}項）`}</button>` : I}</section>` : I)}
      <section class="task-adder-section">${e.editing ? N`<div class="spike-add-shell">${t.state[`add:${n.id}`] ? N`<form class="spike-add-form" @submit=${(r) => {
		r.preventDefault();
		let i = new FormData(r.currentTarget), a = e.onAddItem(n.id, i.get("title"), Number(i.get("priority")));
		t.state[`error:${n.id}`] = a?.error, a?.error || (t.state[`add:${n.id}`] = !1), t.draw();
	}}><input name="title" aria-label="新增子項目描述" placeholder="新增待處理項目" maxlength="500"><select name="priority" aria-label="新增子項目優先級">${e.policy.levels.map((t) => N`<option value=${t.value} ?selected=${t.value === e.policy.creationDefaultValue}>${e.policy.format(t.value)}</option>`)}</select><button type="submit">新增</button><button type="button" @click=${() => {
		t.state[`add:${n.id}`] = !1, t.draw();
	}}>取消</button><p class="spike-field-error" role="alert">${t.state[`error:${n.id}`] ?? ""}</p></form>` : N`<button class="spike-add-button" type="button" aria-label="在「${n.title}」新增子項目" @click=${() => {
		t.state[`add:${n.id}`] = !0, t.draw();
	}}>＋</button>`}</div>` : I}</section></div>`)}
  </article>`;
}
var Sn = {
	"task-list": (e, t) => (t.cards ||= new Rt(t), t.selectionSource !== e.selection && (t.unsubscribe?.(), t.selectionSource = e.selection, t.unsubscribe = e.selection?.subscribe((e) => {
		t.state.selection = e, queueMicrotask(t.refresh);
	}), t.cleanups.push(() => t.unsubscribe?.())), N`${t.cards.render({
		items: e.tasks,
		allIds: e.allIds,
		storageKey: e.cardStorageKey,
		pinEnabled: !0,
		requestedPin: e.requestedPin,
		nextId: e.nextTaskId,
		hiddenCount: e.hiddenCount,
		onShowHidden: e.onShowHidden
	}, (n, r) => n.kind === "report_pointer" ? Cn(e, n, r) : xn(e, t, n, r), e.filters ? Nt(e.filters) : I, e.onSearch ? N`<ui-search-field class="task-search" label="搜尋任務卡名稱、摘要與子項" placeholder="搜尋名稱、摘要、子項"
        .query=${e.searchQuery ?? ""} @query-change=${(t) => e.onSearch(t.detail.query)}></ui-search-field>` : I)}${e.tasks.length ? I : N`<p class="empty-state">${e.emptyLabel}</p>`}`),
	"report-summary": (e) => e.editable ? N`<textarea class="report-summary-input" aria-label=${e.label ?? "報告摘要"} maxlength="1000" rows="2" placeholder=${e.placeholder ?? ""} .value=${q(e.value ?? "")} @input=${(t) => e.onCommit(t.currentTarget.value)}></textarea>` : N`<p class="hero-summary">${e.text}</p>`,
	"project-progress": (e) => N`<div class="project-progress-label"><strong id="project-progress-value">整體約 ${e.percentage}%</strong></div>${kt({
		...e,
		form: "segmented",
		label: `整體進度 ${e.percentage}%，已完成 ${e.completed}，共 ${e.total}`,
		extraClass: "project-progress-meter"
	})}`,
	"status-filters": Nt,
	"status-overview": (e) => (e.statusOrder ?? []).filter((e) => e !== "planned" && l[e]).map((t) => N`<article class="overview-card overview-${$(t).tone}" data-status=${t}><span class="overview-value">${e.counts[t] ?? 0}</span><span class="overview-label">${t === "in_progress" ? "目前進行" : $(t).label}</span></article>`),
	"mode-toggle": (e) => N`<button class="view-mode-toggle editor-mode-dock ${e.mode === "edit" ? "is-editing" : ""}" type="button" ?disabled=${e.disabled || !e.available} ?hidden=${e.hideWhenUnavailable && !e.available} title=${e.available ? "" : e.unavailableTitle} aria-label="切換到${e.mode === "edit" ? "預覽" : "編輯"}模式" @click=${() => e.onToggle(e.mode === "edit" ? "preview" : "edit")}>${e.mode === "edit" ? "預覽" : "編輯"}模式</button>`,
	"save-bar": zt,
	"add-control": (e, t) => e.expanded ? N`<form class=${e.kind === "task" ? "task-add-form" : "inline-add-form"} @keydown=${(t) => {
		t.key === "Escape" && (t.preventDefault(), e.onCancel());
	}} @submit=${(t) => {
		t.preventDefault();
		let n = new FormData(t.currentTarget);
		e.onSubmit({
			title: n.get("title"),
			summary: n.get("summary") ?? "",
			priority: Number(n.get("priority"))
		});
	}}><input name="title" class="inline-edit-input" maxlength="160" aria-label=${e.titleAriaLabel || "新任務名稱"} placeholder=${e.titlePlaceholder || "任務名稱"}>${e.kind === "task" ? N`<textarea name="summary" class="task-summary-input" rows="2" maxlength="1000" aria-label=${e.summaryAriaLabel || "新任務描述"} placeholder=${e.summaryPlaceholder || "任務描述（必填）"}></textarea>` : I}<select class="inline-priority-select" name="priority" aria-label="新任務優先級">${e.policy.levels.map((t) => N`<option value=${t.value} ?selected=${t.value === e.policy.creationDefaultValue}>${e.policy.format(t.value)}</option>`)}</select><span class="task-add-contract">${e.contractText ?? ""}</span><span class="inline-add-error" role="alert" ?hidden=${!e.errorMessage}>${e.errorMessage}</span><div class="inline-add-actions"><button type="button" class="secondary-button inline-add-cancel" @click=${e.onCancel}>${e.cancelLabel || "取消"}</button><button type="submit" class="secondary-button">${e.submitLabel || "加入任務"}</button></div></form>` : N`<button class=${e.kind === "task" ? "task-add-trigger" : "inline-add-trigger"} type="button" aria-label=${e.triggerAriaLabel || "增加工作項目"} @click=${e.onOpen}>＋</button>`,
	diagnostics: (e) => (e.diagnostics ?? []).map((e) => N`<div class="diagnostic diagnostic-${e.level ?? "error"}"><strong>${e.level === "warning" ? "注意" : "無法載入部分資料"}</strong><p>${e.message}</p></div>`),
	"scope-directory": (e) => e.scopes.map((t) => N`<article class="scope-entry"><a class="scope-link" href=${t.href}>${t.id}</a>${t.baseOnlyHref ? N`<a class="scope-developer-link" href=${t.baseOnlyHref}>${e.baseOnlyLabel ?? "基本報告"}</a>` : I}</article>`),
	"theme-control": Wt,
	"project-module-strip": Pt,
	"time-summary-button": (e) => N`<button class=${e.className ?? "time-summary-button"} type="button" ?hidden=${e.hidden} ?disabled=${e.disabled} aria-label=${e.ariaLabel ?? ""} @click=${e.onClick}><span>${e.label}</span>${e.showDot ? N`<span class="time-risk-dot"></span>` : I}${e.showChevron ? N`<span class="time-chevron">›</span>` : I}</button>`,
	"delivery-save-confirmation": mn,
	"time-dialog": sn,
	"cost-dialog": cn
};
function Cn(e, t, n) {
	let r = e.pointerCards?.[t.id] ?? { status: "loading" }, i = r.status === "ready" ? r.card : null, a = (e) => e ? l[e] ?? {
		label: e,
		tone: "muted"
	} : {
		label: "指路",
		tone: "muted"
	};
	return N`<article class="task-card pointer-card ${i ? `status-${a(i.status).tone}` : ""}" aria-labelledby=${`task-${t.id}-title`}>${Lt({
		...n,
		id: `task-body-${t.id}`,
		label: t.title
	}, N`<header class="task-header"><div class="task-title-group"><div class="time-task-title-line"><h3 id=${`task-${t.id}-title`}>${r.openHref ? N`<a class="pointer-card-title-link" href=${r.openHref}>${t.title}</a>` : t.title}</h3></div>${r.openHref ? N`<a class="pointer-card-badge" href=${r.openHref}>開啟專案報告 →</a>` : I}</div><div class="task-header-meta">${i ? N`<strong class="task-fraction">${i.progress.completed} / ${i.progress.total}</strong><span class="status-badge status-${a(i.status).tone}">${a(i.status).label}</span>` : I}${r.status === "error" ? N`<span class="pointer-card-error" role="alert">${r.message}</span>` : r.status === "loading" ? N`<span role="status">讀取目標報告中…</span>` : I}</div></header>`, i ? N`<div class="task-summary">${wt(i.summary, { emphasis: !0 })}</div><p class="pointer-card-progress" aria-label=${`子任務完成 ${i.progress.completed}，共 ${i.progress.total}`}>${i.progress.completed} / ${i.progress.total}（${i.progress.percentage}%）</p><ul class="pointer-card-rows">${i.rows.map((e) => N`<li class="pointer-card-row"><span class="pointer-card-row-title">${e.title}</span><span class="status-badge status-${a(e.status).tone}">${a(e.status).label}</span></li>`)}</ul>` : I)}</article>`;
}
var wn = {
	id: "yu5h1-web-ui-workflow",
	regions: Object.keys(Sn),
	mount(e, t, n) {
		let r = new At(t, n, Sn[e]);
		return r.draw(), r;
	},
	update(e, t) {
		return e.update(t);
	},
	destroy(e) {
		e.destroy();
	}
};
c(wn), await se("viewer"), await import("./app.js");
//#endregion
