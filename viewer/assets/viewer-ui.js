import { bindButton as e, bindLongPress as t, bindReorder as n, registerUi as r } from "./web/ui/index.js";
import { applyTheme as i, loadThemePreference as a, preferenceWithMode as o, saveThemePreference as s } from "./web/theme/index.js";
import { registerUiAdapter as c } from "./ui-host.js";
import { ITEM_STATUS_META as l, STATUS_META as u, cardReferenceAncestors as d, stableSortTaskItemsByPriority as f } from "./report-model.js";
import { parseReference as p } from "./task-search.js";
import { liftNextItem as m } from "./next-marker.js";
import { itemReference as h } from "./item-reference.js";
import { formatActivity as g } from "./item-activity.js";
import { isRetiredStatus as _, statusLinks as ee, statusTooltip as te } from "./item-state.js";
import { taskItemStack as ne } from "./item-stack.js";
import { checklistReturnHref as re, createLinkSelection as ie, linkSelectionHref as ae, readLinkSelection as v } from "./link-selection.js";
import { expandableText as y } from "./expandable-text.js";
import "./inline-links.js";
import { displayCards as b, moveVisibleCard as oe, promotePin as se, removeNewlyCompletedPins as ce, visibleRootCards as le } from "./card-order.js";
import { loadDisclosure as ue, saveDisclosure as de } from "./card-disclosure-state.js";
import { DEFAULT_CAPSULE_ID as fe } from "./filter-selection.js";
//#region viewer/assets/theme-model.js
var pe = "task-progress.theme.v1";
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
var me = Object.freeze({ defaultMode: "system" });
//#endregion
//#region ui/web-workflow/bootstrap.mjs
function he(t = null) {
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
async function ge(e) {
	r(), document.documentElement.dataset.taskprogressUi = "web-ui-workflow";
	let t = me, n = globalThis.taskprogressThemeBoot, c = n?.preference ?? a(() => localStorage, "task-progress.theme.v1", t);
	n?.controller.dispose(), delete globalThis.taskprogressThemeBoot;
	let l = document.createElement("ui-theme-control"), u = matchMedia("(prefers-color-scheme: dark)"), d, f = () => {
		l.preference = c, l.systemScheme = u.matches ? "dark" : "light", document.documentElement.dataset.theme = c.mode, c.mode === "custom" ? document.documentElement.dataset.themeBase = c.custom.base : delete document.documentElement.dataset.themeBase;
	}, p = () => {
		d || (c = a(() => localStorage, pe, t), d = i(document.documentElement, c, t), u.addEventListener("change", f), f());
	}, m = (e) => (c = s(() => localStorage, pe, e, t), d?.update(c), f(), c);
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
			t.className = "replica-title-row", e.before(t), t.append(he(), e);
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
var x = globalThis, _e = x.ShadowRoot && (x.ShadyCSS === void 0 || x.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), ye = /* @__PURE__ */ new WeakMap(), be = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (_e && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = ye.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ye.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, xe = (e) => new be(typeof e == "string" ? e : e + "", void 0, ve), Se = (e, t) => {
	if (_e) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = x.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, Ce = _e ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return xe(t);
})(e) : e, { is: we, defineProperty: Te, getOwnPropertyDescriptor: Ee, getOwnPropertyNames: De, getOwnPropertySymbols: Oe, getPrototypeOf: ke } = Object, S = globalThis, Ae = S.trustedTypes, je = Ae ? Ae.emptyScript : "", Me = S.reactiveElementPolyfillSupport, C = (e, t) => e, Ne = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? je : null;
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
}, Pe = (e, t) => !we(e, t), Fe = {
	attribute: !0,
	type: String,
	converter: Ne,
	reflect: !1,
	useDefault: !1,
	hasChanged: Pe
};
Symbol.metadata ??= Symbol("metadata"), S.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var w = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = Fe) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Te(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Ee(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? Fe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(C("elementProperties"))) return;
		let e = ke(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(C("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
			let e = this.properties, t = [...De(e), ...Oe(e)];
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
			for (let e of n) t.unshift(Ce(e));
		} else e !== void 0 && t.push(Ce(e));
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
		return Se(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? Ne : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Ne : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Pe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), Me?.({ ReactiveElement: w }), (S.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var Ie = globalThis, Le = (e) => e, T = Ie.trustedTypes, Re = T ? T.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ze = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, Be = "?" + E, Ve = `<${Be}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", He = Array.isArray, Ue = (e) => He(e) || typeof e?.[Symbol.iterator] == "function", We = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ge = /-->/g, Ke = />/g, j = RegExp(`>|${We}(?:([^\\s"'>=/]+)(${We}*=${We}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), qe = /'/g, Je = /"/g, Ye = /^(?:script|style|textarea|title)$/i, Xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), M = Xe(1), N = Xe(2), P = Symbol.for("lit-noChange"), F = Symbol.for("lit-nothing"), Ze = /* @__PURE__ */ new WeakMap(), I = D.createTreeWalker(D, 129);
function Qe(e, t) {
	if (!He(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Re === void 0 ? t : Re.createHTML(t);
}
var $e = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = Ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = j) : (Ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = j) : o = Ke : o === j ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? j : c[3] === "\"" ? Je : qe) : o === Je || o === qe ? o = j : o === Ge || o === Ke ? o = A : (o = j, i = void 0);
		let d = o === j && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + Ve : l >= 0 ? (r.push(s), n.slice(0, l) + ze + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [Qe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, et = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = $e(t, n);
		if (this.el = e.createElement(l, r), I.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = I.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ze)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? rt : r[1] === "?" ? it : r[1] === "@" ? at : R
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ye.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = T ? T.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), I.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) if (i.data === Be) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += E.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = D.createElement("template");
		return n.innerHTML = e, n;
	}
};
function L(e, t, n = e, r) {
	if (t === P) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = L(e, i._$AS(e, t.values), i, r)), t;
}
var tt = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		I.currentNode = r;
		let i = I.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new nt(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ot(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = I.nextNode(), a++);
		}
		return I.currentNode = D, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, nt = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = L(this, e, t), k(e) ? e === F || e == null || e === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : e !== this._$AH && e !== P && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== F && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = et.createElement(Qe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new tt(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Ze.get(e.strings);
		return t === void 0 && Ze.set(e.strings, t = new et(e)), t;
	}
	k(t) {
		He(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = Le(e).nextSibling;
			Le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, R = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = F, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = F;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = L(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== P, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = L(this, r[n + o], t, o), s === P && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === F ? e = F : e !== F && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, rt = class extends R {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === F ? void 0 : e;
	}
}, it = class extends R {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== F);
	}
}, at = class extends R {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = L(this, e, t, 0) ?? F) === P) return;
		let n = this._$AH, r = e === F && n !== F || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== F && (n === F || r);
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
		L(this, e);
	}
}, st = {
	M: ze,
	P: E,
	A: Be,
	C: 1,
	L: $e,
	R: tt,
	D: Ue,
	V: L,
	I: nt,
	H: R,
	N: it,
	U: at,
	B: rt,
	F: ot
}, ct = Ie.litHtmlPolyfillSupport;
ct?.(et, nt), (Ie.litHtmlVersions ??= []).push("3.3.3");
var lt = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new nt(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ut = globalThis, z = class extends w {
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
		return P;
	}
};
z._$litElement$ = !0, z.finalized = !0, ut.litElementHydrateSupport?.({ LitElement: z });
var dt = ut.litElementPolyfillSupport;
dt?.({ LitElement: z }), (ut.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/lit-html/directive.js
var B = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ft = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), pt = class {
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
}, { I: mt } = st, ht = (e) => e, gt = (e) => e.strings === void 0, _t = () => document.createComment(""), V = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new mt(r.insertBefore(_t(), i), r.insertBefore(_t(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = ht(e).nextSibling;
				ht(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, H = (e, t, n = e) => (e._$AI(t, n), e), vt = {}, yt = (e, t = vt) => e._$AH = t, bt = (e) => e._$AH, xt = (e) => {
	e._$AR(), e._$AA.remove();
}, St = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, U = ft(class extends pt {
	constructor(e) {
		if (super(e), e.type !== B.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = bt(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = H(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = H(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = H(i[d], a[m]), V(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = H(i[f], a[p]), V(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = St(o, p, m), u = St(s, d, f)), l.has(s[d])) if (l.has(s[f])) {
			let t = u.get(o[p]), n = t === void 0 ? null : i[t];
			if (n === null) {
				let t = V(e, i[d]);
				H(t, a[p]), c[p] = t;
			} else c[p] = H(n, a[p]), V(e, i[d], n), i[t] = null;
			p++;
		} else xt(i[f]), f--;
		else xt(i[d]), d++;
		for (; p <= m;) {
			let t = V(e, c[m + 1]);
			H(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && xt(e);
		}
		return this.ut = o, yt(e, c), P;
	}
}), Ct = {}, wt = ft(class extends pt {
	constructor() {
		super(...arguments), this.ot = Ct;
	}
	render(e, t) {
		return t();
	}
	update(e, [t, n]) {
		if (Array.isArray(t)) {
			if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((e, t) => e === this.ot[t])) return P;
		} else if (this.ot === t) return P;
		return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, n);
	}
}), W = ft(class extends pt {
	constructor(e) {
		if (super(e), e.type !== B.PROPERTY && e.type !== B.ATTRIBUTE && e.type !== B.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
		if (!gt(e)) throw Error("`live` bindings can only contain a single expression");
	}
	render(e) {
		return e;
	}
	update(e, [t]) {
		if (t === P || t === F) return t;
		let n = e.element, r = e.name;
		if (e.type === B.PROPERTY) {
			if (t === n[r]) return P;
		} else if (e.type === B.BOOLEAN_ATTRIBUTE) {
			if (!!t === n.hasAttribute(r)) return P;
		} else if (e.type === B.ATTRIBUTE && n.getAttribute(r) === t + "") return P;
		return yt(e), t;
	}
}), G = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), G(e, t);
	return !0;
}, K = (e) => {
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
	this._$AN === void 0 ? this._$AM = e : (K(this), this._$AM = e, Tt(this));
}
function Dt(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) if (t) if (Array.isArray(r)) for (let e = n; e < r.length; e++) G(r[e], !1), K(r[e]);
	else r != null && (G(r, !1), K(r));
	else G(this, e);
}
var Ot = (e) => {
	e.type == B.CHILD && (e._$AP ??= Dt, e._$AQ ??= Et);
}, kt = class extends pt {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Tt(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (G(this, e), K(this));
	}
	setValue(e) {
		if (gt(this._$Ct)) this._$Ct._$AI(e, this);
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
var Mt = At(), q = ft(class extends kt {
	render() {
		return F;
	}
	update(e, [t, n]) {
		return this.node = e.element, this.factory !== t && (this.clear(), this.factory = t), this.value = n, this.schedule(), F;
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
}), Nt = (e, t = {}) => M`<div ${q(y, {
	text: e ?? "",
	...t
})}></div>`, J = (e = !1, t = !1) => N`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${e ? N`<path d="M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3" />` : N`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />`}${t ? N`<path d="M3 3l18 18" />` : F}</svg>`, Pt = (e) => N`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${e === "free" ? N`<path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />` : N`<path d=${e === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d=${e === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />`}</svg>`, Ft = (e) => M`<small class="card-id">(${e})</small>`, It = (e, t, n = e) => M`<ui-copy-id class="task-title-copy" .value=${String(e)} .label=${t}>${t}${Ft(n)}</ui-copy-id>`, Lt = ({ cells: e = [], form: t = "segmented", ratio: n = 0, label: r = "", extraClass: i = "" } = {}) => t === "segmented" ? M`<div class="progress-bar progress-bar-segmented ${i}" role="img" aria-label=${r}>${e.map((e) => M`<i class="progress-cell progress-tone-${e}"></i>`)}</div>` : M`<progress class="progress-meter ${i}" max="100" .value=${Math.max(0, Math.min(100, n * 100))} aria-label=${r}></progress>`, Rt = class {
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
		this.disposed || (this.disposed = !0, this.abort.abort(), this.cleanups.forEach((e) => typeof e == "function" ? e() : e?.dispose?.()), lt(F, this.target));
	}
}, zt = jt((e, r) => {
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
function Bt(e = [], t = {}) {
	return M`<div class="horizontal-capsule-strip ${t.className ?? ""}" role="toolbar" aria-label=${t.ariaLabel ?? "模組"}
    ${q(zt, {
		axis: "horizontal",
		focusAfterMove: !0,
		previewClasses: {
			before: "capsule-drop-before",
			after: "capsule-drop-after",
			dragging: "capsule-dragging"
		},
		onMove: (e) => t.onReorder?.(e.id, e.targetId, e.placement === "after")
	})}>
    ${U(e, (e) => e.id, (e) => M`<button type="button" data-capsule-id=${e.id} data-reorder-capsule=${String(e.sortable !== !1)} data-reorder-id=${e.id} data-reorder-handle data-reorder-sortable=${String(e.sortable !== !1)}
      class="capsule-button ${e.className ?? ""} ${e.sortable === !1 ? "" : "capsule-sortable"}" aria-pressed=${e.pressed ?? F}
      aria-label=${e.ariaLabel ?? e.label} aria-keyshortcuts=${e.sortable === !1 ? F : "Alt+ArrowLeft Alt+ArrowRight"} title=${e.title ?? F} ?disabled=${e.disabled} draggable=${e.sortable !== !1}
      @click=${() => t.onActivate?.(e.id)}><span>${e.label}</span>${e.showDot ? M`<span class="time-risk-dot ${e.dotClass ?? ""}"></span>` : F}${e.showChevron ? M`<span class="time-chevron">›</span>` : F}</button>`)}
  </div>`;
}
function Vt(e = {}) {
	let t = new Map((e.categories ?? []).map((e) => [e.id, e])), n = e.order?.length ? e.order : [fe, ...t.keys()], r = n.find((e) => !t.has(e)), i = e.defaultLabel ?? "預設";
	return Bt(n.map((n) => n === r ? {
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
var Ht = (e = {}) => {
	let t = new Map((e.moduleOrder ?? []).map((e, t) => [e, t])), n = e.moduleOrder?.length ?? 0, r = [...e.capsules ?? []].sort((e, r) => (t.get(e.id) ?? n) - (t.get(r.id) ?? n));
	return r.length ? Bt(r, {
		...e,
		ariaLabel: e.ariaLabel ?? "子項目模組",
		className: e.className ?? "item-module-strip",
		onActivate: e.onActivate
	}) : F;
}, Ut = Object.freeze({
	icon: !0,
	label: !1,
	appearance: "ghost"
});
function Wt(e, t, n, r, i, a, o = "both") {
	return M`<ui-option-picker class="icon-choice" aria-label=${i} .label=${i} .options=${n}
    .value=${r} .interaction=${o} .delay=${300} orientation="vertical"
    .triggerDisplay=${Ut} .optionDisplay=${Ut}
    @choice-request=${(e) => a(e.detail.id)}></ui-option-picker>`;
}
function Gt({ id: e, label: t, expanded: n = !0, toggle: r, visibilityEnabled: i = !1, visible: a = !0, onVisibleChange: o }, s, c) {
	return M`<div class="card-disclosure-heading ${n ? "" : "card-disclosure-collapsed"}"><button type="button" class="card-disclosure-toggle" aria-expanded=${n} aria-controls=${e} aria-label="${n ? "收合" : "展開"} ${t}" @click=${() => r(!n)}><span aria-hidden="true">${n ? "▼" : "▶"}</span></button>
  ${i ? M`<button type="button" class="card-visibility-toggle card-toolbar-icon" aria-pressed=${a} aria-label="${a ? "隱藏" : "顯示"} ${t}" @click=${() => o(!a)}>${J(!a)}</button>` : F}${s}</div><div id=${e} class="card-disclosure-body" ?hidden=${!n}>${c}</div>`;
}
var Kt = class {
	constructor(e) {
		this.view = e, this.order = [], this.pins = [], this.mode = "forward", this.visibility = "disabled", this.hidden = [], this.selected = null, this.expanded = !0, this.overrides = {}, this.key = null, this.linkSelection = ie(v(location.search));
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
		return b(e, this.order, this.mode, this.props?.pinEnabled ? this.pins : [], this.props?.nextId, this.props?.completedIds).map((e) => e.id);
	}
	expand(e, t) {
		this.overrides[e] = t, de(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
	}
	all(e) {
		this.expanded = e, this.overrides = {}, de(this.disclosureKey, this.expanded, this.overrides), this.view.draw();
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
	render(e, t, n = F, r = F) {
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
			let e = ue(a);
			this.expanded = e.expanded, this.overrides = e.overrides;
		}
		if (e.pinEnabled && e.completionStates) {
			let t = Object.fromEntries(Object.entries(e.completionStates).flatMap(([e, t]) => {
				let n = typeof t == "boolean" ? t : this.completionStates?.[e];
				return typeof n == "boolean" ? [[e, n]] : [];
			})), n = ce(this.pins, this.completionStates, t), r = n.length !== this.pins.length, a = JSON.stringify(t), o = JSON.stringify(this.completionStates);
			if (this.pins = n, this.completionStates = t, i) try {
				r && localStorage.setItem(`${i}:pins`, JSON.stringify(n)), a !== o && localStorage.setItem(`${i}:completion`, a);
			} catch {}
		}
		if (e.requestedPin && e.completionStates !== null && e.completionStates?.[e.requestedPin] !== null && this.lastPin !== e.requestedPin && (e.allIds ?? e.items.map((e) => e.id)).includes(e.requestedPin)) {
			this.pins = se(this.pins, e.requestedPin), this.overrides[e.requestedPin] = !0, this.hidden = this.hidden.filter((t) => t !== e.requestedPin), this.visibility === "closed" && (this.visibility = "enabled"), this.lastPin = e.requestedPin;
			try {
				i && localStorage.setItem(`${i}:pins`, JSON.stringify(this.pins));
			} catch {}
		}
		let o = e.referenceParents?.size && !this.showAllCards && !e.searching, s = (t) => le(t, e.referenceParents, this.pins, e.nextId, e.requestedPin), c = o ? s(e.items) : e.items, l = o ? new Set(s((e.allIds ?? []).map((e) => ({ id: e }))).map((e) => e.id)) : null, u = typeof e.hiddenCount == "function" ? e.hiddenCount(l) : e.hiddenCount, d = b(c, e.heldOrder ?? this.order, e.heldOrder ? "free" : this.mode, e.pinEnabled ? this.pins : [], e.nextId, e.completedIds), f = this.linkSelection.claim(d.map((e) => e.id));
		f && (this.selected = f.id, this.hidden = this.hidden.filter((e) => e !== f.id), this.visibility === "closed" && (this.visibility = "enabled"), queueMicrotask(() => {
			if (this.view.disposed || this.selected !== f.id) return;
			e.onSelectionChange?.(f.id), this.view.draw();
			let t = [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(f.id));
			t?.focus({ preventScroll: !0 }), t?.scrollIntoView({ block: "center" });
		}));
		let p = this.linkSelection.selectionChanged(this.selected), m = (e) => this.visibility !== "closed" && (this.visibility !== "enabled" || !this.hidden.includes(e.id)), h = this.mode === "forward" && typeof e.onSourceReorder == "function", g = (t) => !this.moving && m(t) && t.id !== e.nextId && !(e.pinEnabled && this.pins.includes(t.id)) && (this.mode === "free" || h && Object.hasOwn(e.reorderGroups ?? {}, t.id)), _ = async (t) => {
			let n = d.find((e) => e.id === t.id), r = d.find((e) => e.id === t.targetId);
			if (!(!n || !r || !g(n) || !g(r))) {
				if (h) {
					if (e.reorderGroups[t.id] !== e.reorderGroups[t.targetId]) return;
					let n = d.filter((n) => g(n) && e.reorderGroups[n.id] === e.reorderGroups[t.id]).map((e) => e.id);
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
				} else this.order = oe(e.allIds ?? d.map((e) => e.id), this.order, d.filter(g).map((e) => e.id), t.id, t.targetId, t.placement === "after");
				e.onSelectionChange?.(null), this.selected = t.id, e.onSelectionChange?.(t.id), this.persist(), queueMicrotask(() => {
					this.view.disposed || [...this.view.target.querySelectorAll("[data-card-id]")].find((e) => e.dataset.cardId === String(t.id))?.focus();
				});
			}
		}, ee = d.find(m)?.id;
		return M`<div class="card-list-controls"><div class="card-list-heading"><p class="section-kicker">工作項目</p>${n}</div><div class="card-list-tools">
      ${e.referenceParents?.size ? M`<button type="button" class="secondary-button" aria-pressed=${!!this.showAllCards} @click=${() => {
			this.showAllCards = !this.showAllCards, this.view.draw();
		}}>顯示全部卡片</button>` : F}
      <button type="button" class="card-toolbar-icon" aria-label=${this.expanded ? "全部收合" : "全部展開"} @click=${() => this.all(!this.expanded)}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d=${this.expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      ${Wt(this.view, "order", [
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
			icon: Pt(e)
		})), this.mode, "排序", (e) => {
			this.mode = e, this.persist(!0);
		})}
      ${Wt(this.view, "visibility", [
			{
				id: "enabled",
				label: "啟用",
				icon: J()
			},
			{
				id: "closed",
				label: "全體關閉",
				icon: J(!0)
			},
			{
				id: "disabled",
				label: "禁用",
				icon: J(!1, !0)
			},
			{
				id: "reset",
				label: "重置",
				kind: "action",
				icon: M`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>`
			}
		], this.visibility, "可見性", (e) => {
			e === "reset" ? (this.hidden = [], this.visibility = "enabled") : this.visibility = e, this.persist();
		}, "picker")}${r}
    </div></div><div class="arrangeable-cards" ${q(zt, {
			axis: "vertical",
			surface: !0,
			previewClasses: {
				before: "card-drop-before",
				after: "card-drop-after"
			},
			onMove: _
		})}>
    ${U(d, (e) => e.id, (n, r) => M`<div class="arrangeable-card ${this.selected === n.id ? "card-selected" : ""}" role="group" tabindex="0" data-render-window data-card-id=${n.id} data-reorder-id=${n.id} data-reorder-sortable=${String(g(n))} data-reorder-group=${h ? e.reorderGroups?.[n.id] ?? F : F}
      aria-label=${`${n.title ?? n.question ?? ""}${this.selected === n.id ? "，已選取" : ""}`} aria-keyshortcuts=${g(n) ? "Alt+ArrowUp Alt+ArrowDown" : F} data-link-tone=${this.selected === n.id ? p ?? F : F} ?hidden=${!m(n)}
      @pointerdown=${(e) => {
			e.button === 0 && this.select(n.id);
		}} @focusin=${() => this.select(n.id)} @keydown=${(e) => {
			e.target === e.currentTarget && ["Enter", " "].includes(e.key) && (e.preventDefault(), this.select(n.id));
		}}>
      ${e.pinEnabled ? M`<button type="button" class="card-pin ${this.pins.includes(n.id) ? "is-pinned" : ""} ${n.id === e.nextId ? "is-next" : ""}" aria-label="${this.pins.includes(n.id) ? "取消釘選" : "釘選置頂"}：${n.title}" aria-pressed=${this.pins.includes(n.id)} @click=${() => {
			this.pins = this.pins.includes(n.id) ? this.pins.filter((e) => e !== n.id) : se(this.pins, n.id), this.persist();
		}}><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill=${this.pins.includes(n.id) ? "currentColor" : "none"} stroke="currentColor" stroke-width="1.6" /></svg></button>` : F}
      ${wt([
			this.view.contentVersion,
			n,
			n.id === ee,
			this.isExpanded(n.id),
			this.visibility,
			this.hidden.includes(n.id)
		], () => t(n, {
			lead: n.id === ee,
			expanded: this.isExpanded(n.id),
			toggle: (e) => this.expand(n.id, e),
			visibilityEnabled: this.visibility === "enabled",
			visible: !this.hidden.includes(n.id),
			onVisibleChange: (e) => {
				this.hidden = e ? this.hidden.filter((e) => e !== n.id) : [...this.hidden, n.id], this.persist();
			}
		}))}
    </div>`)}</div>${u > 0 ? M`<p class="card-list-hidden"><button type="button" class="card-list-hidden-link" @click=${e.onShowHidden}>…顯示隱藏項目(${u})</button></p>` : F}`;
	}
};
function qt(e) {
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
	return M`<span class="edit-save-status" id="edit-save-status" role="status">${e.message ?? ""}</span><ui-edit-history .history=${t} .panelAvailable=${!1} .disabled=${!!e.saving}
    @history-request=${(t) => {
		e.saving || (t.detail.action === "undo" && e.canUndo ? e.onUndo?.() : t.detail.action === "redo" && e.canRedo && e.onRedo?.());
	}}></ui-edit-history>
  ${e.onToggleCautious ? M`<button type="button" class="secondary-button edit-mode-button" aria-pressed=${!!e.cautious} ?disabled=${e.saving} @click=${() => e.onToggleCautious(!e.cautious)}>謹慎模式</button>` : F}
  ${e.cautious ? M`<button type="button" class="secondary-button edit-discard-button" ?disabled=${e.saving} @click=${e.onDiscard}>放棄</button><button type="button" class="primary-button edit-save-button" ?disabled=${!e.dirty || e.saving} @click=${e.onSave}>${e.saving ? "正在儲存…" : "儲存"}</button>` : F}`;
}
var Jt = (e, t) => {
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
}, Y = (e, t) => (r(), M`<ui-dialog id=${e.id ?? F} class=${e.className ?? ""} .heading=${e.title ?? ""} .kicker=${e.kicker ?? ""} .closeLabel=${e.closeLabel ?? ""} .dismissDisabled=${!!e.busy} .dismissOnBackdrop=${e.dismissOnBackdrop ?? !0} ${q(Jt, e)}>${e.open ? t : F}</ui-dialog>`), Yt = jt((e, n) => {
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
}, (e) => !!e.enabled), Xt = (e) => {
	let t = globalThis.taskprogressTheme.control;
	return e.append(t), { destroy() {
		t.parentNode === e && t.remove();
	} };
}, Zt = () => M`<span class="replica-theme" ${q(Xt, null)}></span>`;
//#endregion
//#region ui/web-workflow/time-settings-offset.mjs
function Qt() {
	let e = -(/* @__PURE__ */ new Date()).getTimezoneOffset(), t = e >= 0 ? "+" : "-", n = Math.abs(e);
	return `${t}${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
function $t(e, t) {
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
		return Qt();
	}
}
//#endregion
//#region ui/web-workflow/time-settings.mjs
function en(e) {
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
function tn(e, t) {
	let n = e.initialDelivery.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
	return {
		deliveryAt: e.delivery ? `${e.delivery}:00${n ?? $t(e.delivery, t.timezone)}` : "",
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
var nn = [
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"日"
];
function rn(e, t) {
	let n = t.state.settings ??= en(e.config), r = () => {
		n.error = "", e.onPendingChange(!0), t.draw();
	}, i = (e, t) => {
		n[e] = t, r();
	}, a = (e, t) => M`<label><span>${t}</span><input type="number" min="0" max="24" step="0.5" .value=${W(String(n[e] ?? ""))} @input=${(t) => i(e, t.currentTarget.value === "" ? void 0 : t.currentTarget.valueAsNumber)}></label>`, o = 24 - Number(n.sleep) - Number(n.life) - Number(n.other);
	return M`<section class="spike-time-editor" aria-labelledby="time-settings-title"><div class="spike-time-editor-heading"><p class="spike-editor-kicker">時間設定</p><h2 id="time-settings-title">工作容量與交付日</h2><p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p><p class="spike-timezone">時區：${e.config.timezone}</p></div>
    <div class="spike-time-settings-fields"><section class="spike-delivery-settings" aria-labelledby="delivery-settings-title"><h3 id="delivery-settings-title">交付日</h3><div class="spike-delivery-controls"><label><span>排他截止時間</span><input type="datetime-local" .value=${W(n.delivery)} @input=${(e) => i("delivery", e.currentTarget.value)}></label><label class="spike-delivery-reason"><span>修改原因（不填敏感原文）</span><input maxlength="500" .value=${W(n.reason)} @input=${(e) => i("reason", e.currentTarget.value)} placeholder="例如：配合里程碑調整"></label><button class="spike-subtle-button" type="button" @click=${() => i("delivery", "")}>設為未指定</button></div></section>
    <section class="spike-capacity-settings" aria-labelledby="capacity-settings-title"><div class="spike-setting-heading"><h3 id="capacity-settings-title">每日分配</h3><strong class=${o > 0 ? "" : "invalid"}>工作 ${Number.isFinite(o) ? o : "—"} hr</strong></div><div class="spike-allocation-fields">${a("sleep", "睡眠（hr）")}${a("life", "生活（hr）")}${a("other", "其他不可工作（hr）")}</div><fieldset class="spike-weekdays"><legend>工作日</legend>${nn.map((e, t) => M`<label><input type="checkbox" .checked=${n.weekdays.includes(t + 1)} @change=${(e) => {
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
    ${n.exceptions.length ? M`<div class="spike-exception-list">${U(n.exceptions, (e) => e.key, (e) => M`<div class="spike-exception-row"><label><span>日期</span><input type="date" .value=${W(e.date)} @input=${(t) => {
		e.date = t.currentTarget.value, r();
	}}></label><label><span>可工作（hr）</span><input type="number" min="0" max="24" step="0.5" .value=${W(String(e.availableHours ?? ""))} @input=${(t) => {
		e.availableHours = t.currentTarget.value, r();
	}}></label><label><span>請假／例外說明</span><input maxlength="500" .value=${W(e.publicLabel)} placeholder="例如：不可工作" @input=${(t) => {
		e.publicLabel = t.currentTarget.value, r();
	}}></label><button class="spike-delete-exception" type="button" @click=${() => {
		n.exceptions = n.exceptions.filter((t) => t.key !== e.key), r();
	}}>刪除</button></div>`)}</div>` : M`<p class="spike-empty-setting">目前沒有休假或容量例外。</p>`}</section>
    <div class="spike-time-settings-actions"><button type="button" @click=${async () => {
		let r = e.onApply(tn(n, e.config));
		n.error = r?.error ?? "", t.draw(), !n.error && (e.onPendingChange(!1), await e.onPreview());
	}}>重新計算預覽</button>${n.error ? M`<p class="spike-field-error" role="alert">${n.error}</p>` : F}</div></div></section>`;
}
//#endregion
//#region ui/web-workflow/assessment.mjs
var X = (e = []) => M`<div class="assessment-metric-grid">${e.map((e) => M`<div class="assessment-metric"><span>${e.label}</span><strong>${e.tone ? M`<span class="assessment-tone-dot assessment-tone-${e.tone}" aria-hidden="true"></span>` : F}${e.value}</strong></div>`)}</div>`, Z = (e, t, n) => M`<section class="assessment-note"><h3>${n ? M`<span class="assessment-tone-dot assessment-tone-${n}" aria-hidden="true"></span>` : F}${e}</h3>${t}</section>`, an = (e) => (e ?? []).map((e) => M`<span class="assessment-source-badge source-${e.kind}">${e.label}</span>`), on = (e, t, n) => M`<section class="assessment-readout"><span class="assessment-readout-label">${e}</span><span class="assessment-readout-badges">${n}</span><strong class="assessment-readout-value">${t}</strong></section>`, sn = (e) => M`<div class="time-source-list">${(e ?? []).map((e) => M`<div class="time-source-row"><div><strong>${e.label}</strong><p>${e.note}</p></div><span>${e.value}</span></div>`)}</div>`, cn = (e) => M`<section class="time-composition"><h3>估算組成</h3>${sn(e)}</section>`, Q = (e, t = "") => M`<div class="time-evaluation-node ${t}"><span>${e.label}</span><strong>${e.value}</strong><small>${e.note}</small></div>`, ln = (e, t) => M`<section class="time-tab-panel time-flow-panel" id="time-flow-panel" role="tabpanel" aria-labelledby="time-flow-tab" ?hidden=${!t}><p class="time-flow-intro">${e.intro}</p><div class="time-flow-lanes">
  <section class="time-flow-lane" aria-label="工程估算路徑">${Q(e.engineeringLane.source)}<span class="time-flow-arrow">→</span>${Q(e.engineeringLane.result, "time-evaluation-result")}</section>
  <section class="time-flow-lane" aria-label="工作容量路徑">${Q(e.capacityLane.source)}<span class="time-flow-arrow">→</span>${Q(e.capacityLane.result, "time-evaluation-result")}</section></div>
  <div class="time-flow-merge"><span class="time-flow-arrow">↓</span>${Q(e.merge, e.merge.className)}</div><div class="time-flow-lane time-flow-risk">${Q(e.risk.trend)}<span class="time-flow-arrow">→</span>${Q(e.risk.result, e.risk.result.className)}</div><p class="time-flow-note">${e.note}</p></section>`, un = (e, t) => M`<section class="time-tab-panel" id="time-engineering-panel" role="tabpanel" aria-labelledby="time-engineering-tab" ?hidden=${!t}>${X(e.metrics)}${Z("風險評估公式", M`<p>${e.explanation.text}</p><code class="time-formula">${e.explanation.formula}</code>`, e.explanation.className)}${Z("執行校準", M`<p>${e.calibrationText}</p>`)}${cn(e.composition)}</section>`, dn = (e, t) => M`<section class="time-tab-panel" id="time-capacity-panel" role="tabpanel" aria-labelledby="time-capacity-tab" ?hidden=${!t}><div class="time-capacity-toolbar"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div>${X(e.metrics)}${Z("每日容量公式", M`<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p><code class="time-formula">${e.formulaCode}</code>`)}<section class="time-composition"><h3>${e.exceptionsHeading}</h3>${e.exceptions ? sn(e.exceptions) : M`<div class="time-source-list"><p class="time-empty-note">目前沒有休假或其他容量例外。</p></div>`}</section></section>`, fn = (e) => M`<section class="time-tab-panel time-estimate-only-panel"><p class="time-flow-intro">${e.intro}</p>${X(e.metrics)}${Z("執行校準", M`<p>${e.calibrationText}</p>`)}${cn(e.composition)}</section>`;
function pn(e, t) {
	let n = e.item, r = e.activeEstimate, i = `${n.itemId}:${r?.estimate_id ?? "analysis"}`;
	t.state.manualKey !== i && (t.state.manualKey = i, t.state.manual = {
		hours: r?.likely_minutes ? String(r.likely_minutes / 60) : n.unset ? "" : String(n.likelyMinutes / 60),
		note: r?.human_note ?? "",
		confirmed: !!(r?.human_confirmed ?? n.humanConfirmed),
		error: ""
	});
	let a = t.state.manual, o = e.title;
	return M`<form class="spike-estimate-form" @submit=${(r) => {
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
    <section class="spike-estimate-row"><div class="spike-estimate-badges"><span>預估工時</span>${an(n.sourceBadges)}</div><label class="spike-estimate-hours"><span>人工工時（hr）</span><input type="number" min="0.02" step="0.25" aria-label="「${o}」人工工時（hr）" .value=${W(String(a.hours ?? ""))} @input=${(e) => {
		a.hours = e.currentTarget.value === "" ? void 0 : e.currentTarget.valueAsNumber;
	}}></label></section>
    <div class="time-item-rationale">${Z("估算依據", M`<label class="spike-estimate-note"><span>人工依據</span><input maxlength="1000" aria-label="「${o}」人工依據" .value=${W(a.note)} @input=${(e) => {
		a.note = e.currentTarget.value;
	}} placeholder="例如：已拆解三個步驟"></label>`)}</div>
    <label class="spike-estimate-confirmation"><input type="checkbox" aria-label="確認「${o}」的人工估算" .checked=${a.confirmed} @change=${(e) => {
		a.confirmed = e.currentTarget.checked;
	}}><span>人工確認此工時</span></label><p class="spike-estimate-contract">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p><div class="spike-estimate-actions"><button type="submit" aria-label="套用「${o}」人工估算草稿">套用工時草稿</button></div>${a.error ? M`<p class="spike-field-error" role="alert">${a.error}</p>` : F}</form>`;
}
function mn(e, t) {
	if (!e.open) return delete t.state.manualKey, delete t.state.settings, Y({
		...e,
		id: "time-dialog",
		className: "replica-time-dialog"
	}, F);
	(e.kind !== "item" || !e.editing) && delete t.state.manualKey, (e.kind !== "project" || !e.editing || !e.timeSettings?.hasConfig) && delete t.state.settings;
	let n = e.item, r = e.project, i = e.kind === "item" && n ? M`<div><div class="time-detail-toolbar"><span class=${n.confidenceClass}>${n.confidenceLabel}</span><button class="time-small-button" type="button" @click=${e.onToggleDetails}>${n.toggleLabel}</button></div>
    ${e.editing && e.onManualEstimate ? pn(e, t) : M`${on("預估工時", n.likelyHoursLabel, an(n.sourceBadges))}<div class="time-item-rationale">${Z("估算依據", M`<p>${n.rationale}</p>`)}</div>`}
    <section class="time-item-technical" ?hidden=${!n.detailsExpanded}>${X(n.technical.metrics)}${n.technical.analysisMethod ? M`<div class="time-source-row"><div><strong>${n.technical.analysisMethod.name}</strong><p>${n.technical.analysisMethod.note}</p></div><span>${n.technical.analysisMethod.version}</span></div>` : F}${n.technical.formula ? Z("固定公式", M`<code class="time-formula">${n.technical.formula}</code>`) : F}${n.technical.reference ? M`<code class="time-reference">${n.technical.reference}</code>` : F}</section></div>` : e.kind === "project" && r ? M`<div><div class="time-detail-toolbar"><span class="time-report-caption">${r.captionLabel}</span><button class="time-small-button" type="button" aria-expanded=${r.detailsExpanded} @click=${e.onToggleDetails}>${r.toggleLabel}</button></div>
    <section class="time-report-overview"><div class="time-report-grid">${r.overview.map((e) => M`<div class="time-report-field"><span>${e.label}</span><strong>${e.urgencyClassName ? M`<span class="time-risk-dot ${e.urgencyClassName}" aria-hidden="true"></span>` : F}${e.value}</strong></div>`)}</div><p class="time-report-updated">${r.updatedLabel}</p></section>
    <section class="time-project-details" ?hidden=${!r.detailsExpanded}>${e.editing && e.timeSettings ? e.timeSettings.hasConfig ? M`${rn(e.timeSettings, t)}${e.deliveryPreview ? bn(e.deliveryPreview) : F}` : M`<section class="time-missing-config" aria-labelledby="time-missing-config-title"><h3 id="time-missing-config-title">尚未建立工作容量設定</h3><p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p><button type="button" @click=${e.timeSettings.onInitializeConfig}>建立 8/8/8 預設設定</button></section>` : r.hasDeadline ? M`<div class="time-tab-list" role="tablist" aria-label="進度報告詳細資訊">${U(r.tabs, (e) => e.name, (n, i) => M`<button class="time-tab" id="time-${n.name}-tab" type="button" role="tab" aria-controls="time-${n.name}-panel" aria-selected=${r.activeTab === n.name} tabindex=${r.activeTab === n.name ? 0 : -1} @click=${() => e.onSetTab(n.name)} @keydown=${(n) => {
		if (!["ArrowLeft", "ArrowRight"].includes(n.key)) return;
		n.preventDefault();
		let a = r.tabs[(i + (n.key === "ArrowRight" ? 1 : -1) + r.tabs.length) % r.tabs.length];
		e.onSetTab(a.name), queueMicrotask(() => t.target.querySelector(`#time-${a.name}-tab`)?.focus());
	}}>${n.label}</button>`)}</div>${ln(r.flow, r.activeTab === "flow")}${un(r.engineering, r.activeTab === "engineering")}${dn(r.capacity, r.activeTab === "capacity")}` : fn(r.estimateOnly)}</section></div>` : F;
	return Y({
		...e,
		id: "time-dialog",
		className: "replica-time-dialog",
		closeLabel: `關閉${e.kicker}`
	}, M`<div class="time-dialog-content">${i}</div>`);
}
function hn(e) {
	let t = e.item, n = e.total;
	return Y({
		...e,
		id: "cost-dialog",
		className: "replica-cost-dialog",
		closeLabel: `關閉${e.kicker}`
	}, M`<div class="cost-dialog-content">${e.kind === "item" && t ? M`
    ${on("估算成本", t.exact, an(t.contributors))}${X([
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
    ${t.humanConfirmed ? F : Z("尚未由人確認", M`<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>`)}` : n ? M`${on("估算總額", n.exact, M`<span class="cost-coverage cost-coverage-${n.coverage}">${n.coverageLabel}</span>`)}${X([{
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
      ${n.coverage === "full" ? F : Z("為什麼沒有資源判斷", M`<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，因此在涵蓋率完整之前不宣稱預算充足與否。</p>`)}` : F}</div>`);
}
var gn = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 }), _n = (e) => e == null ? "—" : `${gn.format(e / 60)} hr`, vn = (e) => e == null ? "無法比較" : `${e > 0 ? "+" : ""}${gn.format(e / 60)} hr`;
function yn(e) {
	if (!e?.present) return "未指定";
	let t = new Date(e.value);
	return Number.isNaN(t.getTime()) ? e.value : new Intl.DateTimeFormat("zh-TW", {
		dateStyle: "medium",
		timeStyle: "short",
		hour12: !1
	}).format(t);
}
function bn(e, t = "交付日草稿預覽") {
	return M`<section class="spike-risk-preview" aria-labelledby="delivery-risk-preview-title"><div class="spike-risk-preview-heading"><div><p class="spike-editor-kicker">尚未寫入</p><h3 id="delivery-risk-preview-title">${t}</h3></div><span class="spike-preview-badge">預覽</span></div>
    ${e.deliveryChanged ? M`<dl class="spike-delivery-diff"><div><dt>原交付日</dt><dd>${yn(e.before)}</dd></div><div><dt>草稿交付日</dt><dd>${yn(e.after)}</dd></div></dl>` : e.capacityChanged ? M`<p class="spike-capacity-preview-note">交付日未變更；以下比較只反映工作容量草稿。</p>` : F}
    <div class="spike-risk-comparison"><article><span>目前分析</span><strong>${e.current.label}</strong><small>剩餘容量 ${_n(e.current.remainingCapacityMinutes)}</small></article><span class="spike-risk-arrow" aria-hidden="true">→</span><article class="risk-${e.next.urgency ?? "none"}"><span>草稿分析</span><strong>${e.next.label}</strong><small>剩餘容量 ${_n(e.next.remainingCapacityMinutes)}</small></article></div>
    <dl class="spike-risk-deltas"><div><dt>容量變化</dt><dd>${vn(e.capacityDelta)}</dd></div><div><dt>餘裕／缺口變化</dt><dd>${vn(e.balanceDelta)}</dd></div></dl>${e.reason ? M`<p class="spike-preview-reason"><strong>修改原因：</strong>${e.reason}</p>` : F}</section>`;
}
var xn = (e) => Y({
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
}, M`<div class="spike-confirm-copy"><p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div>${bn(e.preview, "儲存影響確認")}<div class="spike-confirm-actions"><button data-return-button type="button" ?disabled=${e.busy} @click=${e.onBack}>返回修改</button><button class="spike-save-button" type="button" ?disabled=${e.busy} @click=${e.onConfirm}>${e.busy ? "正在儲存…" : "確認儲存"}</button></div>`);
//#endregion
//#region ui/web-workflow/viewer.mjs
r();
var Sn = Object.entries(u).map(([e, t]) => ({
	value: e,
	...t
})), Cn = Object.entries(l).map(([e, t]) => ({
	value: e,
	...t
})), $ = (e) => u[e] ?? {
	label: e,
	tone: "muted"
}, wn = (e, t, n, r, i = "") => M`<select class=${i} aria-label=${n} .value=${W(String(t))} @change=${(e) => r(e.currentTarget.value)}>${e.map((e) => M`<option .value=${String(e.value)} ?selected=${String(e.value) === String(t)}>${e.label}</option>`)}</select>`, Tn = (e, t, n, r) => wn(e.levels.map((t) => ({
	value: t.value,
	label: e.format(t.value)
})), e.normalize(t, e.fallbackValue), n, (e) => r(Number(e)), "inline-priority-select");
function En(e, t, n, r, i, a) {
	if (!globalThis.TaskProgressItemStatusPolicy.retired.includes(a)) return e.onCommand({
		type: "set-item-status",
		taskId: n.id,
		field: r,
		itemId: i.id,
		status: a
	});
	let o = i.retirement?.replaced_by;
	t.state.retirement = {
		taskId: n.id,
		field: r,
		itemId: i.id,
		title: i.title,
		status: a,
		kind: o?.document ? "document" : "item",
		target: o?.document ?? (o ? [
			o.scope_id,
			o.task_id,
			o.item_id
		].join(" › ") : ""),
		reason: i.retirement?.reason ?? "",
		error: ""
	}, t.draw();
}
function Dn(e, t) {
	let n = t.state.retirement, r = () => {
		t.state.retirement = null, t.draw();
	};
	!e.editing && n && (t.state.retirement = null);
	let i = e.editing ? n : null;
	return Y({
		id: "item-retirement-dialog",
		className: "item-retirement-dialog",
		open: !!i,
		title: i ? l[i.status].label : "",
		onClose: r
	}, i ? M`
    <form class="retirement-form" @submit=${(n) => {
		n.preventDefault();
		try {
			let t;
			if (i.status === "discontinued") t = { reason: i.reason };
			else if (i.kind === "document") t = { replaced_by: { document: i.target } };
			else {
				let e = p(i.target);
				t = { replaced_by: e ? {
					scope_id: e.scopeId,
					task_id: e.taskId,
					item_id: e.itemId
				} : null };
			}
			i.status === "obsolete" && i.reason.trim() && (t.reason = i.reason);
			let n = globalThis.TaskProgressItemStatusPolicy.prepare(i.status, t);
			e.onCommand({
				type: "set-item-status",
				taskId: i.taskId,
				field: i.field,
				itemId: i.itemId,
				...n
			}), r();
		} catch (e) {
			i.error = e.message, t.draw();
		}
	}}>
      <p>${i.title}</p>
      ${i.status === "discontinued" ? M`<label>棄案理由<textarea name="reason" required maxlength="300" rows="3" .value=${W(i.reason)} @input=${(e) => {
		i.reason = e.currentTarget.value;
	}}></textarea></label>` : M`<label>取代對象種類${wn([{
		value: "item",
		label: "子項目"
	}, {
		value: "document",
		label: "設計文件"
	}], i.kind, "取代對象種類", (e) => {
		i.kind = e, i.target = "", t.draw();
	})}</label>
        <label>${i.kind === "item" ? "取代項目參照" : "取代文件路徑"}<input name="replacement" required maxlength="300" .value=${W(i.target)} placeholder=${i.kind === "item" ? "scope › card › item" : "Documentation/Plan.md#section"} @input=${(e) => {
		i.target = e.currentTarget.value;
	}}></label>
        <label>補充理由（選填）<textarea name="reason" maxlength="300" rows="2" .value=${W(i.reason)} @input=${(e) => {
		i.reason = e.currentTarget.value;
	}}></textarea></label>`}
      <p class="spike-field-error" role="alert">${i.error}</p>
      <div class="retirement-actions"><button type="button" class="secondary-button" @click=${r}>取消</button><button type="submit" class="primary-button">套用</button></div>
    </form>` : F);
}
function On(e, t, n) {
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
			if (!a || !o || _(a.status) || _(o.status) || a.legacy || o.legacy || e.policy.normalize(a.priority, e.policy.fallbackValue) !== e.policy.normalize(o.priority, e.policy.fallbackValue)) return;
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
var kn = (e) => [...e.searchParams].filter(([e]) => e !== "pin" && e !== "link-tone").sort().map((e) => e.join("=")).join("&");
function An(e, t) {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return !1;
	let n = e.target.closest("a[href]");
	if (!n || n.hasAttribute("download") || n.target && n.target !== "_self") return !1;
	let r = new URL(n.href, location.href), i = new URL(location.href);
	if (r.origin !== i.origin || r.pathname !== i.pathname || !r.hash.startsWith("#item-")) return !1;
	let a = new URL(location.href);
	if (a.hash = e.currentTarget.id, sessionStorage.setItem("taskprogress-item-arrival", JSON.stringify({
		destination: r.href,
		source: a.href
	})), kn(r) !== kn(i)) return !1;
	let o = [...t.target.querySelectorAll("[data-item-row]")].find((e) => `#${e.id}` === r.hash && e.getClientRects().length);
	return !o || o.closest("[data-card-id]") !== e.currentTarget.closest("[data-card-id]") ? !1 : (e.preventDefault(), history.pushState(null, "", r.href), jn(t, !0), t.lastItemHash = null, t.itemTargetPulse = (t.itemTargetPulse ?? 0) + 1, t.refresh(), !0);
}
function jn(e, t = !1) {
	let n = location.hash.startsWith("#item-") ? location.hash : null;
	e.activeItemHash = n && (t || history.state?.itemTargetShown !== n) ? n : null;
	let r;
	try {
		r = JSON.parse(sessionStorage.getItem("taskprogress-item-arrival"));
	} catch {
		r = null;
	}
	let i = r?.destination === location.href ? r : null;
	e.activeCardArrival = i?.cardId ?? null, e.itemReturnUrl = e.activeItemHash || e.activeCardArrival ? i?.source ?? null : null, sessionStorage.removeItem("taskprogress-item-arrival"), e.activeItemHash && history.replaceState({
		...history.state,
		itemTargetShown: n
	}, "");
}
function Mn(e) {
	if (!e.itemReturnUrl) return;
	let t = new URL(e.itemReturnUrl), n = new URL(location.href);
	if (e.activeCardArrival || t.origin !== n.origin || t.pathname !== n.pathname || kn(t) !== kn(n)) {
		location.assign(t.href);
		return;
	}
	history.pushState(null, "", t.href), jn(e, !0), e.lastItemHash = null, e.itemTargetPulse = (e.itemTargetPulse ?? 0) + 1, e.refresh();
}
function Nn(e, t, n) {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
	let r = new URL(location.href), i = new URL(e.currentTarget.href).searchParams.get("scope");
	i && r.searchParams.set("scope", i), r.searchParams.set("pin", t.id), r.hash = `#item-${t.id}--${n.id}`, sessionStorage.setItem("taskprogress-item-arrival", JSON.stringify({
		destination: e.currentTarget.href,
		source: r.href,
		cardId: n.task_id
	}));
}
function Pn(e, t, n, r) {
	let i = n.cardReferences ?? [];
	if (!e.editing && !i.length) return F;
	let a = e.cardReferenceTargets ?? [], o = d(e.cardReferenceParents, n.id), s = a.filter((e) => !o.has(e.id) && e.kind !== "report_pointer" && e.status !== "archive"), c = (e) => s.filter((t) => t.id === e || !i.some((e) => e.task_id === t.id)), l = c();
	if (!i.length && !l.length) return F;
	let u = (e, t) => r("card_refs", n.card_refs.flatMap((n) => n.id === e ? t ? [{
		...n,
		task_id: t
	}] : [] : [n])), f = n.referenceProgress;
	return M`<section class="detail-section report-card-references">
    <h4 class="detail-heading">參照卡片${f && e.progress[n.id]?.total ? ` · ${f.completed} / ${f.total} 張完成` : ""}</h4>
    ${i.length ? M`<ul class="detail-list">${U(i, (e) => e.id, (r) => {
		let i = $(r.status), a = new URL(location.href);
		a.searchParams.set("scope", e.scopeId), a.searchParams.set("pin", r.task_id), a.hash = "";
		let o = `item-${n.id}--${r.id}`;
		return M`<li id=${o} data-item-row class="report-reference-row" ?data-item-target=${t.activeItemHash === `#${o}`}>
        ${e.editing ? M`<select aria-label=${`編輯「${r.title}」的參照`} .value=${W(r.task_id)} @change=${(e) => u(r.id, e.currentTarget.value)}>
          ${r.error ? M`<option value=${r.task_id}>${r.title}（${r.error}）</option>` : F}
          ${c(r.task_id).map((e) => M`<option value=${e.id}>${e.title}</option>`)}</select>
          <button type="button" class="inline-delete-button" @click=${() => u(r.id, null)}>移除參照</button>` : r.error ? M`<span>${r.title} · ${r.error}</span>` : M`<a href=${a.href} @click=${(e) => Nn(e, n, r)}>${r.title} ⮩</a>
          <span class="report-reference-meta"><span class="status-badge status-${i.tone}">${i.label}</span>
            <span>${r.progress.completed} / ${r.progress.total}</span></span>`}
      </li>`;
	})}</ul>` : F}
    ${e.editing && l.length ? M`<select aria-label="新增卡片參照" .value=${W("")} @change=${(t) => {
		let r = t.currentTarget.value;
		r && e.onAddCardReference(n.id, r);
	}}><option value="">新增卡片參照</option>${l.map((e) => M`<option value=${e.id}>${e.title}</option>`)}</select>` : F}
  </section>`;
}
function Fn(e, t, n, r, i, a) {
	let o = e.editing, s = i.status ?? (r === "completed_items" ? "done" : "planned"), c = i.derivedState && i.derivedState !== "done" ? {
		label: i.derivedStateLabel,
		tone: i.derivedStateTone
	} : l[s] ?? $(s), u = e.policy.metadata(i.priority), d = o ? null : h({
		scopeId: e.scopeId,
		taskId: n.id,
		item: i
	}), f = d && t.state.selection?.keys.has(d), p = i.id === e.nextItemId, m = () => e.onSetNext?.({
		taskId: n.id,
		itemId: i.id,
		clear: p
	}), ne = (t, a) => e.onCommand({
		type: t,
		taskId: n.id,
		field: r,
		itemId: i.id,
		...a
	}), ie = o ? [] : ee(i).map((e) => ({
		...e,
		href: e.href ? re(ae(e.href, c.tone), n.id, i.id) : null
	})), v = ie.filter((e) => e.href), y = `${n.id}/${i.id}`;
	v.length || (t.state[`wait:${y}`] = !1);
	let b = (o || e.reorderable) && r === "pending_items" && !_(s) && i.id && !i.legacy, oe = f ? t.state.selection.keys.size : 1, se = M`<div class="item-row-text">${p ? M`<span class="item-next-capsule">Next</span>` : F}${f ? M`<span class="item-row-selected-label">已選取</span>` : F}
      ${i.sourceRef ? i.sourceRef.available ? M`<a class="document-source-link" href=${re(ae(i.sourceRef.href, c.tone), n.id, i.id)} title=${i.sourceRef.title}><span class="source-icon" aria-hidden="true">${i.sourceRef.kind === "decision" ? "⚖" : i.sourceRef.manual ? "📋" : "🤖"}</span><span class="source-label">${i.sourceRef.label}</span></a>` : M`<span class="document-source-link source-unavailable" title=${i.sourceRef.error ?? "來源無法讀取"}>⚠️ 來源不可用</span>` : F}
      ${Nt(i.displayTitle ?? i.title, {
		lines: 1,
		expanded: a,
		linkTone: c.tone
	})}</div>`;
	return M`<li id=${!o && d ? `item-${n.id}--${i.id}` : F} ?data-item-target=${!!d && t.activeItemHash === `#item-${n.id}--${i.id}`} data-item-pulse=${d && t.activeItemHash === `#item-${n.id}--${i.id}` ? (t.itemTargetPulse ?? 0) % 2 : F} class="editor-item-row ${o ? "editable-work-item" : b ? "item-row-reorderable" : ""} ${f ? "is-selected" : ""} ${p ? "is-next" : ""}" data-select-key=${d && e.selection ? d : F}
    data-item-row=${y} data-reorder-id=${i.id} data-reorder-sortable=${String(!!b)} data-reorder-group=${String(e.policy.normalize(i.priority, e.policy.fallbackValue))}
    tabindex=${d && e.selection ? 0 : F} title=${o ? F : g(i.activity)}
    ${q(Yt, {
		enabled: !!(e.onSetNext && d && !o),
		onTrigger: m
	})}
    @click=${(n) => {
		!An(n, t) && d && e.selection?.rowClick(d, n);
	}} @focus=${() => d && e.selection?.rowFocus(d)}
    @keydown=${(t) => {
		if (!o && t.shiftKey && t.key === "Enter" && e.onSetNext && d && t.target === t.currentTarget) {
			t.preventDefault(), m();
			return;
		}
		d && e.selection?.rowKeydown(d, t);
	}}>
    ${!o && t.itemReturnUrl && t.activeItemHash === `#item-${n.id}--${i.id}` ? M`<span class="item-return-anchor"><button type="button" class="item-return" aria-label="返回來源項目" title="返回來源項目" @pointerdown=${(e) => e.stopPropagation()} @click=${(e) => {
		e.stopPropagation(), Mn(t);
	}}>⮪</button></span>` : F}
    ${o && b ? M`<button type="button" class="item-row-grip" data-item-ref=${y} data-reorder-handle draggable="true" aria-label="移動「${i.title}」（Alt+↑／↓，限同優先級）">⠿</button>` : M`<span class="item-row-marker item-row-marker-${s}" aria-hidden="true">${s === "done" ? "✓" : "○"}</span>`}
    ${o || s !== "done" && !_(s) && u && (!u.hidden || !e.policy.labelsValid) ? M`<span class="item-row-priority">${o ? Tn(e.policy, i.priority, `設定「${i.title}」的優先級`, (e) => ne("set-item-field", {
		property: "priority",
		value: e
	})) : M`<span class="priority-badge priority-${u.tone}">${e.policy.format(i.priority)}</span>`}</span>` : F}
    <div class="item-row-description" data-reorder-content>${o ? M`<input class="inline-edit-input" aria-label="編輯子項目：${i.title}" title=${i.title} maxlength="500" .value=${W(i.title)} @input=${(e) => ne("set-item-field", {
		property: "title",
		value: e.currentTarget.value
	})}>` : d ? M`<ui-copy-id class="item-row-copy" .value=${d} .label=${oe > 1 ? `已選取的 ${oe} 項參照` : i.title} .prepare=${(t) => {
		let n = e.selection?.references(t) ?? [t];
		return {
			text: n.join("\n"),
			successMessage: n.length > 1 ? `複製 ${n.length} 項` : void 0
		};
	}}>${se}</ui-copy-id>` : se}</div>
    <span class="item-row-utility-panel"><span class="item-row-modules">${Ht({
		capsules: e.itemCapsules?.get(i.id) ?? [],
		moduleOrder: e.moduleOrder,
		onReorder: e.onModuleReorder,
		onActivate: (t) => e.onModuleActivate?.(t, {
			taskId: n.id,
			itemId: i.id,
			itemTitle: i.title
		})
	})}</span>
    <span class="item-row-status">${o ? M`${wn(Cn, s, `設定「${i.title}」的狀態`, (a) => En(e, t, n, r, i, a), `inline-status-select status-${c.tone}`)}${globalThis.TaskProgressItemStatusPolicy.retired.includes(s) ? M`<button type="button" class="retirement-edit-button" title="編輯退場資訊" aria-label="編輯「${i.title}」的退場資訊" @click=${() => En(e, t, n, r, i, s)}>✎</button>` : F}` : ie.length === 1 && v.length === 1 ? M`<a class="item-status-capsule status-${c.tone} is-link" href=${v[0].href} title=${te(i) ?? v[0].label}>${c.label}</a>` : v.length ? M`<span class="wait-menu" @focusout=${(e) => {
		e.currentTarget.contains(e.relatedTarget) || (t.state[`wait:${y}`] = !1, t.draw());
	}} @keydown=${(e) => {
		e.key === "Escape" && (t.state[`wait:${y}`] = !1, t.draw());
	}}><button type="button" class="item-status-capsule status-${c.tone} is-link" aria-haspopup="true" aria-expanded=${!!t.state[`wait:${y}`]} @click=${(e) => {
		e.stopPropagation(), t.state[`wait:${y}`] = !t.state[`wait:${y}`], t.draw();
	}}>${c.label}</button>${t.state[`wait:${y}`] ? M`<ul class="wait-menu-list">${ie.map((e) => M`<li>${e.href ? M`<a href=${e.href} @click=${(e) => e.stopPropagation()}>${e.label}</a>` : M`<span>${e.label}（無法讀取）</span>`}</li>`)}</ul>` : F}</span>` : M`<span class="item-status-capsule status-${c.tone}" title=${te(i) ?? F}>${c.label}</span>`}</span>
    ${o ? M`<span class="item-row-action"><button class="inline-delete-button" type="button" aria-label="刪除子項目：${i.title}" @click=${() => ne("delete-item", {})}>刪除</button></span>` : F}</span>
  </li>`;
}
function In(e, t, n) {
	let r = typeof e?.document == "string" ? e.document : "", i = r.indexOf("#");
	if (i <= 0 || i === r.length - 1) return F;
	let a = r.slice(0, i), o = r.slice(i + 1), s = M`<span class="task-goal-path">${a}</span><span class="task-goal-separator" aria-hidden="true"> › </span><span class="task-goal-section">${o}</span>`, c = t ? `/document/?${new URLSearchParams({
		scope: t,
		path: a,
		card: n
	})}#${encodeURIComponent(o)}` : null;
	return M`<p class="task-goal" title=${r}><span class="task-goal-label">目標：</span>${c ? M`<a class="task-goal-link" href=${c}>${s}</a>` : s}</p>`;
}
function Ln(e) {
	if (!e) return F;
	let t = e.next_step ?? e.next_steps?.[0];
	return !t && !e.next_steps?.length && !e.blockers?.length && !e.decisions?.length && !e.routes?.length && !e.claim ? F : M`<details class="developer-details"><summary class="developer-summary">${t ? M`<span class="developer-next-label">後續：</span><span class="developer-next-action">${t}</span>` : F}<span class="developer-expand-hint">展開作法與方向</span></summary><div class="developer-body"><h4 class="developer-body-title">作法與方向</h4>
    ${[["後續", e.next_step ? e.next_steps : e.next_steps?.slice(1)], ["Blockers", e.blockers]].map(([e, t]) => t?.length ? M`<section class="detail-section"><h4 class="detail-heading">${e}</h4><ul class="detail-list">${t.map((e) => M`<li>${e}</li>`)}</ul></section>` : F)}
    ${e.decisions?.map((e) => M`<article class="decision-item"><p>${e.summary}</p><code>${e.reference ?? ""}</code></article>`)}
    ${e.routes?.map((e) => M`<article class="route-item"><div class="route-heading"><strong>${e.title}</strong><span class="route-state route-${e.state}">${e.state}</span></div><p>${e.reason ?? ""}</p></article>`)}
    ${e.claim ? M`<section class="detail-section claim-section"><h4>Claim</h4><p>Agent: ${e.claim.agent}</p><p>${e.claim.worktree ?? ""}</p>${e.claim.source_paths?.map((e) => M`<code class="reference">${e}</code>`)}</section>` : F}
  </div></details>`;
}
function Rn(e, t, n, r) {
	e = {
		...e,
		nextItemId: n.id === e.nextTaskId ? e.nextItemId : null
	};
	let i = $(n.status), a = e.policy.metadata(n.priority), o = e.progress[n.id], s = n.referenceProgress && o.total === 0, c = s ? n.referenceProgress : o, l = s ? "引用卡片" : "子項目", u = !e.editing && t.activeCardArrival === n.id, d = (t, r) => e.onCommand({
		type: "set-task-field",
		taskId: n.id,
		field: t,
		value: r
	}), p = ne(n), h = globalThis.location?.hash;
	h && t.closedTargetHash !== h && p.closed.some(({ item: e }) => h === `#item-${n.id}--${e.id}`) && (t.state[`completed:${n.id}`] = !0, t.closedTargetHash = h);
	let g = [{
		status: "planned",
		title: "待處理",
		className: "pending-work",
		field: "pending_items",
		items: m(f(p.pending), e.nextItemId).map((e) => ({
			item: e,
			field: "pending_items"
		}))
	}, {
		status: "done",
		title: p.closed.some((e) => _(e.item.status)) ? "已結束" : "已完成",
		className: "completed-work",
		field: "completed_items",
		items: p.closed
	}];
	return M`<article class="task-card editor-task-card priority-${a?.tone ?? "unspecified"}" aria-labelledby="task-${n.id}-title">${Gt({
		...r,
		id: `task-body-${n.id}`,
		label: n.title
	}, M`<header class="task-header ${u ? "report-card-arrival" : ""}">${u && t.itemReturnUrl ? M`<button type="button" class="report-card-return" aria-label="返回來源子項" title="返回來源子項" @pointerdown=${(e) => e.stopPropagation()} @click=${(e) => {
		e.stopPropagation(), Mn(t);
	}}>⮪</button>` : F}<div class="task-title-group">${e.editing ? M`<div class="time-task-status-line">${Tn(e.policy, n.priority, `${n.title} 優先級`, (e) => d("priority", e))}</div>` : F}
    <div class="time-task-title-line">${e.editing ? M`<input id="task-${n.id}-title" class="task-title-input" aria-label="任務名稱" maxlength="160" .value=${W(n.title)} @input=${(e) => d("title", e.currentTarget.value)}>${Ft(n.id)}` : M`<h3 id="task-${n.id}-title">${It([e.scopeId, n.id].filter(Boolean).join(" › "), n.title, n.id)}</h3>`}</div>
    ${e.moduleTotals?.[n.id]?.length ? M`<div class="task-module-totals">${e.moduleTotals[n.id].map((e) => M`<span class="task-module-total task-module-total-${e.id}">${e.label}</span>`)}</div>` : F}</div>
    <div class="task-header-meta"><strong class="task-fraction" aria-label="${l}完成 ${c.completed}，共 ${c.total}">${c.completed} / ${c.total}</strong>${e.editing && !s ? wn(Sn, n.status, `${n.title} 狀態`, (e) => d("status", e), "inline-status-select") : M`<span class="status-badge status-${i.tone}">${i.label}</span>`}<code class="task-id">${n.id}</code></div></header>`, M`${e.editing ? M`<textarea class="task-summary-input" aria-label="任務描述" maxlength="1000" rows="3" .value=${W(n.summary ?? "")} @input=${(e) => d("summary", e.currentTarget.value)}></textarea>` : M`<div class="task-summary">${Nt(n.summary, {
		lines: 2,
		emphasis: !0
	})}</div>`}${In(n.goal_ref, e.scopeId, n.id)}${Ln(n.developer)}
      <div class="work-columns">${Pn(e, t, n, d)}${g.map((i) => i.items.length || e.editing ? M`<section class="detail-section ${i.className}"><h4 class="detail-heading">${i.title}</h4><ul class="detail-list" id="task-${n.id}-${i.field}" ${q(zt, On(e, t, n))}>${U(i.status === "done" && !e.editing && !t.state[`completed:${n.id}`] ? i.items.slice(0, 1) : i.items, (e) => e.item.id, ({ item: a, field: o }, s) => Fn(e, t, n, o, a, r.lead && i.status !== "done" && s === 0 || a.id === e.nextItemId))}</ul>
      ${i.status === "done" && !e.editing && i.items.length > 1 ? M`<button type="button" class="completed-more" aria-expanded=${!!t.state[`completed:${n.id}`]} aria-controls="task-${n.id}-${i.field}" @click=${() => {
		t.state[`completed:${n.id}`] = !t.state[`completed:${n.id}`], t.draw();
	}}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d=${t.state[`completed:${n.id}`] ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>${t.state[`completed:${n.id}`] ? "收合" : `顯示更多（${i.items.length - 1}項）`}</button>` : F}</section>` : F)}
      <section class="task-adder-section">${e.editing ? M`<div class="spike-add-shell">${t.state[`add:${n.id}`] ? M`<form class="spike-add-form" @submit=${(r) => {
		r.preventDefault();
		let i = new FormData(r.currentTarget), a = e.onAddItem(n.id, i.get("title"), Number(i.get("priority")));
		t.state[`error:${n.id}`] = a?.error, a?.error || (t.state[`add:${n.id}`] = !1), t.draw();
	}}><input name="title" aria-label="新增子項目描述" placeholder="新增待處理項目" maxlength="500"><select name="priority" aria-label="新增子項目優先級">${e.policy.levels.map((t) => M`<option value=${t.value} ?selected=${t.value === e.policy.creationDefaultValue}>${e.policy.format(t.value)}</option>`)}</select><button type="submit">新增</button><button type="button" @click=${() => {
		t.state[`add:${n.id}`] = !1, t.draw();
	}}>取消</button><p class="spike-field-error" role="alert">${t.state[`error:${n.id}`] ?? ""}</p></form>` : M`<button class="spike-add-button" type="button" aria-label="在「${n.title}」新增子項目" @click=${() => {
		t.state[`add:${n.id}`] = !0, t.draw();
	}}>＋</button>`}</div>` : F}</section></div>`)}
  </article>`;
}
var zn = {
	"task-list": (e, t) => {
		if (t.cards || (t.cards = new Kt(t), jn(t), t.on(window, "hashchange", () => {
			jn(t), t.lastItemHash = null, t.refresh();
		}), t.on(window, "popstate", () => {
			t.activeItemHash = null, t.activeCardArrival = null, t.itemReturnUrl = null, t.refresh();
		})), t.activeItemHash && t.lastItemHash !== t.activeItemHash) {
			let e = t.activeItemHash;
			queueMicrotask(() => queueMicrotask(() => {
				if (t.disposed || location.hash !== e) return;
				let n = [...t.target.querySelectorAll("[data-item-row]")].find((t) => `#${t.id}` === e && t.getClientRects().length);
				n && (t.lastItemHash = e, n.scrollIntoView({
					block: "center",
					behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
				}));
			}));
		}
		return t.selectionSource !== e.selection && (t.unsubscribe?.(), t.selectionSource = e.selection, t.unsubscribe = e.selection?.subscribe((e) => {
			t.state.selection = e, queueMicrotask(t.refresh);
		}), t.cleanups.push(() => t.unsubscribe?.())), M`${t.cards.render({
			items: e.tasks,
			allIds: e.allIds,
			storageKey: e.cardStorageKey,
			pinEnabled: !0,
			completionStates: e.completionStates,
			completedIds: e.completedIds,
			requestedPin: e.requestedPin,
			nextId: e.nextTaskId,
			onSourceReorder: e.onCardReorder,
			reorderGroups: e.cardReorderGroups,
			hiddenCount: e.hiddenCount,
			onShowHidden: e.onShowHidden,
			referenceParents: e.referenceParents,
			searching: !!e.searchQuery?.trim()
		}, (n, r) => n.kind === "report_pointer" ? Bn(e, n, r) : Rn(e, t, n, r), e.filters ? Vt(e.filters) : F, M`${e.onSearch ? M`<ui-search-field class="task-search" label="搜尋任務卡名稱、摘要與子項" placeholder="搜尋名稱、摘要、子項"
        .query=${e.searchQuery ?? ""} @query-change=${(t) => e.onSearch(t.detail.query)}></ui-search-field>` : F}`)}${e.tasks.length ? F : M`<p class="empty-state">${e.emptyLabel}</p>`}${Dn(e, t)}`;
	},
	"report-summary": (e) => e.editable ? M`<textarea class="report-summary-input" aria-label=${e.label ?? "報告摘要"} maxlength="1000" rows="2" placeholder=${e.placeholder ?? ""} .value=${W(e.value ?? "")} @input=${(t) => e.onCommit(t.currentTarget.value)}></textarea>` : M`<p class="hero-summary">${e.text}</p>`,
	"project-progress": (e) => M`<div class="project-progress-label"><strong id="project-progress-value">整體約 ${e.percentage}%</strong></div>${Lt({
		...e,
		form: "segmented",
		label: `整體進度 ${e.percentage}%，已完成 ${e.completed}，共 ${e.total}`,
		extraClass: "project-progress-meter"
	})}`,
	"status-filters": Vt,
	"status-overview": (e) => (e.statusOrder ?? []).filter((e) => e !== "planned" && u[e]).map((t) => M`<article class="overview-card overview-${$(t).tone}" data-status=${t}><span class="overview-value">${e.counts[t] ?? 0}</span><span class="overview-label">${t === "in_progress" ? "目前進行" : $(t).label}</span></article>`),
	"mode-toggle": (e) => M`<button class="view-mode-toggle editor-mode-dock ${e.mode === "edit" ? "is-editing" : ""}" type="button" ?disabled=${e.disabled || !e.available} ?hidden=${e.hideWhenUnavailable && !e.available} title=${e.available ? "" : e.unavailableTitle} aria-label="切換到${e.mode === "edit" ? "預覽" : "編輯"}模式" @click=${() => e.onToggle(e.mode === "edit" ? "preview" : "edit")}>${e.mode === "edit" ? "預覽" : "編輯"}模式</button>`,
	"save-bar": qt,
	"add-control": (e, t) => e.expanded ? M`<form class=${e.kind === "task" ? "task-add-form" : "inline-add-form"} @keydown=${(t) => {
		t.key === "Escape" && (t.preventDefault(), e.onCancel());
	}} @submit=${(t) => {
		t.preventDefault();
		let n = new FormData(t.currentTarget);
		e.onSubmit({
			title: n.get("title"),
			summary: n.get("summary") ?? "",
			priority: Number(n.get("priority"))
		});
	}}><input name="title" class="inline-edit-input" maxlength="160" aria-label=${e.titleAriaLabel || "新任務名稱"} placeholder=${e.titlePlaceholder || "任務名稱"}>${e.kind === "task" ? M`<textarea name="summary" class="task-summary-input" rows="2" maxlength="1000" aria-label=${e.summaryAriaLabel || "新任務描述"} placeholder=${e.summaryPlaceholder || "任務描述（必填）"}></textarea>` : F}<select class="inline-priority-select" name="priority" aria-label="新任務優先級">${e.policy.levels.map((t) => M`<option value=${t.value} ?selected=${t.value === e.policy.creationDefaultValue}>${e.policy.format(t.value)}</option>`)}</select><span class="task-add-contract">${e.contractText ?? ""}</span><span class="inline-add-error" role="alert" ?hidden=${!e.errorMessage}>${e.errorMessage}</span><div class="inline-add-actions"><button type="button" class="secondary-button inline-add-cancel" @click=${e.onCancel}>${e.cancelLabel || "取消"}</button><button type="submit" class="secondary-button">${e.submitLabel || "加入任務"}</button></div></form>` : M`<button class=${e.kind === "task" ? "task-add-trigger" : "inline-add-trigger"} type="button" aria-label=${e.triggerAriaLabel || "增加工作項目"} @click=${e.onOpen}>＋</button>`,
	diagnostics: (e) => (e.diagnostics ?? []).map((e) => M`<div class="diagnostic diagnostic-${e.level ?? "error"}"><strong>${e.level === "warning" ? "注意" : "無法載入部分資料"}</strong><p>${e.message}</p></div>`),
	"scope-directory": (e) => e.scopes.map((t) => M`<article class="scope-entry"><a class="scope-link" href=${t.href}>${t.id}</a>${t.baseOnlyHref ? M`<a class="scope-developer-link" href=${t.baseOnlyHref}>${e.baseOnlyLabel ?? "基本報告"}</a>` : F}</article>`),
	"theme-control": Zt,
	"project-module-strip": Ht,
	"time-summary-button": (e) => M`<button class=${e.className ?? "time-summary-button"} type="button" ?hidden=${e.hidden} ?disabled=${e.disabled} aria-label=${e.ariaLabel ?? ""} @click=${e.onClick}><span>${e.label}</span>${e.showDot ? M`<span class="time-risk-dot"></span>` : F}${e.showChevron ? M`<span class="time-chevron">›</span>` : F}</button>`,
	"delivery-save-confirmation": xn,
	"time-dialog": mn,
	"cost-dialog": hn
};
function Bn(e, t, n) {
	let r = e.pointerCards?.[t.id] ?? { status: "loading" }, i = r.status === "ready" ? r.card : null, a = (e) => e ? u[e] ?? {
		label: e,
		tone: "muted"
	} : {
		label: "指路",
		tone: "muted"
	};
	return M`<article class="task-card pointer-card ${i ? `status-${a(i.status).tone}` : ""}" aria-labelledby=${`task-${t.id}-title`}>${Gt({
		...n,
		id: `task-body-${t.id}`,
		label: t.title
	}, M`<header class="task-header"><div class="task-title-group"><div class="time-task-title-line"><h3 id=${`task-${t.id}-title`}>${r.openHref ? M`<a class="pointer-card-title-link" href=${r.openHref}>${t.title}</a>` : t.title}${Ft(t.id)}</h3></div>${r.openHref ? M`<a class="pointer-card-badge" href=${r.openHref}>開啟專案報告 →</a>` : F}</div><div class="task-header-meta">${i ? M`<strong class="task-fraction">${i.progress.completed} / ${i.progress.total}</strong><span class="status-badge status-${a(i.status).tone}">${a(i.status).label}</span>` : F}${r.status === "error" ? M`<span class="pointer-card-error" role="alert">${r.message}</span>` : r.status === "loading" ? M`<span role="status">讀取目標報告中…</span>` : F}</div></header>`, i ? M`<div class="task-summary">${Nt(i.summary, { emphasis: !0 })}</div><p class="pointer-card-progress" aria-label=${`子任務完成 ${i.progress.completed}，共 ${i.progress.total}`}>${i.progress.completed} / ${i.progress.total}（${i.progress.percentage}%）</p><ul class="pointer-card-rows">${i.rows.map((e) => M`<li class="pointer-card-row"><span class="pointer-card-row-title">${e.title}</span><span class="status-badge status-${a(e.status).tone}">${a(e.status).label}</span></li>`)}</ul>` : F)}</article>`;
}
var Vn = {
	id: "yu5h1-web-ui-workflow",
	regions: Object.keys(zn),
	mount(e, t, n) {
		let r = new Rt(t, n, zn[e]);
		return r.draw(), r;
	},
	update(e, t) {
		return e.update(t);
	},
	destroy(e) {
		e.destroy();
	}
};
c(Vn), await ge("viewer"), await import("./app.js");
//#endregion
