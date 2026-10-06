//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible, d = () => {};
function f(e) {
	return e();
}
function p(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function m() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function h(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, C = 65536, w = 1 << 19, T = 1 << 20, E = 1 << 25, D = 65536, ee = 1 << 21, O = 1 << 22, k = 1 << 23, A = Symbol("$state"), j = Symbol("legacy props"), te = Symbol(""), ne = Symbol("attributes"), re = Symbol("class"), ie = Symbol("style"), ae = Symbol("text"), oe = Symbol("form reset"), se = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ce = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function le() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function ue(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function de() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function fe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function pe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function me() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function he(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ge() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function _e(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ve() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ye() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function be() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function xe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var Se = {}, Ce = Symbol("uninitialized"), we = "http://www.w3.org/1999/xhtml";
function Te() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ee(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function De() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Oe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var M = !1;
function ke(e) {
	M = e;
}
var N;
function Ae(e) {
	if (e === null) throw Ee(), Se;
	return N = e;
}
function je() {
	return Ae(/* @__PURE__ */ dn(N));
}
function P(e) {
	if (M) {
		if (/* @__PURE__ */ dn(N) !== null) throw Ee(), Se;
		N = e;
	}
}
function Me(e = 1) {
	if (M) {
		for (var t = e, n = N; t--;) n = /* @__PURE__ */ dn(n);
		N = n;
	}
}
function Ne(e = !0) {
	for (var t = 0, n = N;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ dn(n);
		e && n.remove(), n = i;
	}
}
function Pe(e) {
	if (!e || e.nodeType !== 8) throw Ee(), Se;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Fe(e) {
	return e === this.v;
}
function Ie(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Le(e) {
	return !Ie(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Re = !1;
function ze() {
	Re = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var F = null;
function Be(e) {
	F = e;
}
function Ve(e, t = !1, n) {
	F = {
		p: F,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: Re && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function He(e) {
	var t = F, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Cn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, F = t.p, e ?? {};
}
function Ue() {
	return !Re || F !== null && F.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var We = [];
function Ge() {
	var e = We;
	We = [], p(e);
}
function Ke(e) {
	if (We.length === 0 && !kt) {
		var t = We;
		queueMicrotask(() => {
			t === We && Ge();
		});
	}
	We.push(e);
}
function qe() {
	for (; We.length > 0;) Ge();
}
function Je(e) {
	var t = W;
	if (t === null) return U.f |= k, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Ye(e, t);
}
function Ye(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var Xe = ~(_ | v | g);
function Ze(e, t) {
	e.f = e.f & Xe | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? Ze(e, g) : Ze(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= D, $e(t.deps));
}
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), $e(e.deps), Ze(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var tt = !1;
function nt(e) {
	var t = tt;
	try {
		return tt = !1, [e(), tt];
	} finally {
		tt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function rt(e) {
	M && /* @__PURE__ */ un(e) !== null && pn(e);
}
var it = !1;
function at() {
	it || (it = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[oe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = U, n = W;
	Yn(null), Xn(null);
	try {
		return e();
	} finally {
		Yn(t), Xn(n);
	}
}
function st(e, t, n, r = n) {
	e.addEventListener(t, () => ot(n));
	let i = e[oe];
	e[oe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), at();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ct(e) {
	let t = 0, n = Kt(0), r;
	return () => {
		bn() && (G(n), An(() => (t === 0 && (r = K(() => e(() => Zt(n)))), t += 1, () => {
			Ke(() => {
				--t, t === 0 && (r?.(), r = void 0, Zt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var lt = C | w;
function ut(e, t, n, r) {
	new dt(e, t, n, r);
}
var dt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = M ? N : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = ct(() => (this.#m = Kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (M) {
				let e = this.#t;
				je();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, lt), M && (this.#e = N);
	}
	#g() {
		try {
			this.#a = Mn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ke(r), t && (this.#s = Mn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Oe();
				return;
			}
			t = !0, n && xe(), this.#s !== null && zn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					Ye(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), Ke(() => {
			var e = this.#c = document.createDocumentFragment(), t = ln();
			e.append(t), this.#a = this.#S(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, zn(this.#o, () => {
				this.#o = null;
			}), this.#x(L));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Mn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Un(this.#a, e);
				let t = this.#n.pending;
				this.#o = Mn(() => t(this.#e));
			} else this.#x(L);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = U, r = F;
		Xn(this.#i), Yn(this.#i), Be(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} catch (e) {
			return Je(e), null;
		} finally {
			Xn(t), Yn(n), Be(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && zn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ke(() => {
			this.#d = !1, this.#m && Yt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), G(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		L?.is_fork ? (this.#a && L.skip_effect(this.#a), this.#o && L.skip_effect(this.#o), this.#s && L.skip_effect(this.#s), L.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (In(this.#a), null), this.#o &&= (In(this.#o), null), this.#s &&= (In(this.#s), null), M && (Ae(this.#t), Me(), Ae(Ne()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Mn(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Ye(e, this.#i.parent), null;
				}
			}));
		};
		Ke(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Ye(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Ye(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ft(e, t, n, r) {
	let i = Ue() ? gt : I;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = pt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Ye(e, s);
			}
			mt();
		}
	}
	var d = ht();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ vt(e))).then(u).catch((e) => Ye(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mt();
	}) : f();
}
function pt() {
	var e = W, t = U, n = F, r = L;
	return function(i = !0) {
		Xn(e), Yn(t), Be(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mt(e = !0) {
	Xn(null), Yn(null), Be(null), e && L?.deactivate();
}
function ht() {
	var e = W, t = e.b, n = L, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gt(e) {
	var t = 2 | _;
	return W !== null && (W.f |= w), {
		ctx: F,
		deps: null,
		effects: null,
		equals: Fe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: Ce,
		wv: 0,
		parent: W,
		ac: null
	};
}
var _t = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vt(e, t, n) {
	let r = W;
	r === null && de();
	var i = void 0, a = Kt(Ce), o = !U, s = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = W, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== se && n.reject(e);
			}).finally(mt);
		} catch (e) {
			n.reject(e), mt();
		}
		var c = L;
		if (o) {
			if (t.f & 32768) var l = ht();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_t);
			else for (let e of s.values()) e.reject(_t);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _t && (c.activate(), t ? (a.f |= k, Yt(a, t)) : (a.f & 8388608 && (a.f ^= k), Yt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), xn(() => {
		for (let e of s) e.reject(_t);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	let t = /* @__PURE__ */ gt(e);
	return Qn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e) {
	let t = /* @__PURE__ */ gt(e);
	return t.equals = Le, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) In(t[n]);
	}
}
function xt(e) {
	var t, n = W, r = e.parent;
	if (!Kn && r !== null && e.v !== Ce && r.f & 24576) return Te(), e.v;
	Xn(r);
	try {
		e.f &= ~D, bt(e), t = ur(e);
	} finally {
		Xn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = sr(), (!L?.is_fork || e.deps === null) && (L === null ? e.v = t : (L.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		Ze(e, g);
		return;
	}
	Kn || (Dt === null ? Qe(e) : (bn() || L?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(se), t.ac = null;
	}), t.fn !== null && (t.teardown = d), fr(t, 0), Pn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, L = null, Et = null, Dt = null, Ot = null, kt = !1, At = !1, jt = null, Mt = null, Nt = 0, Pt = 1, Ft = class e {
	id = Pt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Tt === null ? Tt = this : (Tt.#n = this, this.#t = Tt), Tt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) Ze(r, _), t(r);
			for (r of n.m) Ze(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Nt++ > 1e3 && (this.#x(), Lt());
		for (let e of this.#u) this.#d.delete(e), Ze(e, _), this.schedule(e);
		for (let e of this.#d) Ze(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = jt = [], r = [], i = Mt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ht(e), this.#h() || this.discard(), t;
		}
		if (L = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (jt = null, Mt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Vt(e, t);
			i.length > 0 && L.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Et = this, zt(r), zt(n), Et = null, this.#s?.resolve();
		var s = L;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : cr(r) && (i & 16 && this.#d.add(r), pr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), Ze(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), L = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== Ce && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Dt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		L = this;
	}
	deactivate() {
		L = null, Dt = null;
	}
	flush() {
		try {
			At = !0, L = this, this.#g();
		} finally {
			Nt = 0, Ot = null, jt = null, Mt = null, At = !1, L = null, Dt = null, Wt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(_t);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, Ke(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= m()).promise;
	}
	static ensure() {
		if (L === null) {
			let t = L = new e();
			!At && !kt && Ke(() => {
				t.#e || t.flush();
			});
		}
		return L;
	}
	apply() {
		Dt = null;
	}
	schedule(e) {
		if (Ot = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (jt !== null && t === W && (U === null || !(U.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= g;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Tt = e : t.#t = e, this.linked = !1;
		}
	}
};
function It(e) {
	var t = kt;
	kt = !0;
	try {
		var n;
		for (e && (L !== null && !L.is_fork && L.flush(), n = e());;) {
			if (qe(), L === null) return n;
			L.flush();
		}
	} finally {
		kt = t;
	}
}
function Lt() {
	try {
		ge();
	} catch (e) {
		Ye(e, Ot);
	}
}
var Rt = null;
function zt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && cr(r) && (Rt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r), Rt?.size > 0)) {
				Wt.clear();
				for (let e of Rt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Rt.has(n) && (Rt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				Rt.clear();
			}
		}
		Rt = null;
	}
}
function Bt(e) {
	L.schedule(e);
}
function Vt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), Ze(e, g);
		for (var n = e.first; n !== null;) Vt(n, t), n = n.next;
	}
}
function Ht(e) {
	Ze(e, g);
	for (var t = e.first; t !== null;) Ht(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ut = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Map(), Gt = !1;
function Kt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Fe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function qt(e, t) {
	let n = Kt(e, t);
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function R(e, t = !1, n = !0) {
	let r = Kt(e);
	return t || (r.equals = Le), Re && n && F !== null && F.l !== null && (F.l.s ??= []).push(r), r;
}
function Jt(e, t) {
	return z(e, K(() => G(e))), t;
}
function z(e, t, n = !1) {
	return U !== null && (!Jn || U.f & 131072) && Ue() && U.f & 4325394 && (Zn === null || !Zn.has(e)) && be(), Yt(e, n ? $t(t) : t, Mt);
}
function Yt(e, t, n = null) {
	if (!e.equals(t)) {
		Wt.set(e, Kn ? t : e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && Qe(t);
		}
		e.wv = sr(), Qt(e, _, n), Ue() && W !== null && W.f & 1024 && !(W.f & 96) && (tr === null ? nr([e]) : tr.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Xt();
	}
	return t;
}
function Xt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && Ze(e, v);
		let t;
		try {
			t = cr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Ut.clear();
}
function Zt(e) {
	z(e, e.v + 1);
}
function Qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ue(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === W)) {
			var l = (c & _) === 0;
			if (l && Ze(s, t), c & 131072) Ut.add(s);
			else if (c & 2) {
				var u = s;
				Dt?.delete(u), c & 65536 || (c & 512 && (W === null || !(W.f & 2097152)) && (s.f |= D), Qt(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && Rt !== null && Rt.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function $t(t) {
	if (typeof t != "object" || !t || A in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ qt(0), u = null, d = ar, f = (e) => {
		if (ar === d) return e();
		var t = U, n = ar;
		Yn(null), or(d);
		var r = e();
		return Yn(t), or(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ qt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ve();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ qt(n.value, u);
				return r.set(t, e), e;
			}) : z(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ qt(Ce, u));
					r.set(t, e), Zt(o);
				}
			} else z(n, Ce), Zt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === A) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ qt($t(s ? e[n] : Ce), u)), r.set(n, o)), o !== void 0) {
				var c = G(o);
				return c === Ce ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = G(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== Ce) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === A) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== Ce || Reflect.has(e, t);
			return (n !== void 0 || W !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ qt(i ? $t(e[t]) : Ce, u)), r.set(t, n)), G(n) === Ce) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ qt(Ce, u)), r.set(d + "", p)) : z(p, Ce);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ qt(void 0, u)), z(c, $t(n)), r.set(t, c));
			else {
				l = c.v !== Ce;
				var m = f(() => $t(n));
				z(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && z(g, _ + 1);
				}
				Zt(o);
			}
			return !0;
		},
		ownKeys(e) {
			G(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== Ce;
			});
			for (var [n, i] of r) i.v !== Ce && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			ye();
		}
	});
}
function en(e) {
	try {
		if (typeof e == "object" && e && A in e) return e[A];
	} catch {}
	return e;
}
function tn(e, t) {
	return Object.is(en(e), en(t));
}
var nn, rn, an, on, sn;
function cn() {
	if (nn === void 0) {
		nn = window, rn = document, an = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		on = a(t, "firstChild").get, sn = a(t, "nextSibling").get, u(e) && (e[re] = void 0, e[ne] = null, e[ie] = void 0, e.__e = void 0), u(n) && (n[ae] = void 0);
	}
}
function ln(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function dn(e) {
	return sn.call(e);
}
function B(e, t) {
	if (!M) return /* @__PURE__ */ un(e);
	var n = /* @__PURE__ */ un(N);
	if (n === null) n = N.appendChild(ln());
	else if (t && n.nodeType !== 3) {
		var r = ln();
		return n?.before(r), Ae(r), r;
	}
	return t && gn(n), Ae(n), n;
}
function fn(e, t = !1) {
	if (!M) {
		var n = /* @__PURE__ */ un(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ dn(n) : n;
	}
	if (t) {
		if (N?.nodeType !== 3) {
			var r = ln();
			return N?.before(r), Ae(r), r;
		}
		gn(N);
	}
	return N;
}
function V(e, t = 1, n = !1) {
	let r = M ? N : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ dn(r);
	if (!M) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = ln();
			return r === null ? i?.after(a) : r.before(a), Ae(a), a;
		}
		gn(r);
	}
	return Ae(r), r;
}
function pn(e) {
	e.textContent = "";
}
function mn() {
	return !1;
}
function hn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function gn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function _n(e) {
	W === null && (U === null && he(e), me()), Kn && pe(e);
}
function vn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function yn(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: F,
		deps: null,
		nodes: null,
		f: e | _ | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	L?.register_created_effect(r);
	var i = r;
	if (e & 4) jt === null ? Ft.ensure().schedule(r) : jt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw In(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && vn(i, n), U !== null && U.f & 2 && !(e & 64))) {
		var a = U;
		(a.effects ??= []).push(i);
	}
	return r;
}
function bn() {
	return U !== null && !Jn;
}
function xn(e) {
	let t = yn(8, null);
	return Ze(t, g), t.teardown = e, t;
}
function Sn(e) {
	_n("$effect");
	var t = W.f;
	if (!U && t & 32 && F !== null && !F.i) {
		var n = F;
		(n.e ??= []).push(e);
	} else return Cn(e);
}
function Cn(e) {
	return yn(4 | T, e);
}
function wn(e) {
	return _n("$effect.pre"), yn(8 | T, e);
}
function Tn(e) {
	Ft.ensure();
	let t = yn(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? zn(t, () => {
			In(t), n(void 0);
		}) : (In(t), n(void 0));
	});
}
function En(e) {
	return yn(4, e);
}
function Dn(e, t) {
	var n = F, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = An(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = W;
			try {
				Xn(n.parent), K(t);
			} finally {
				Xn(n);
			}
		}
	});
}
function On() {
	var e = F;
	An(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && Ze(n, v), cr(n) && pr(n), t.ran = !1;
		}
	});
}
function kn(e) {
	return yn(O | w, e);
}
function An(e, t = 0) {
	return yn(8 | t, e);
}
function H(e, t = [], n = [], r = []) {
	ft(r, t, n, (t) => {
		yn(8, () => {
			e(...t.map(G));
		});
	});
}
function jn(e, t = 0) {
	return yn(16 | t, e);
}
function Mn(e) {
	return yn(32 | w, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Kn, n = U;
		qn(!0), Yn(null);
		try {
			t.call(null);
		} finally {
			qn(e), Yn(n);
		}
	}
}
function Pn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : In(n, t), n = r;
	}
}
function Fn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || In(t), t = n;
	}
}
function In(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), n = !0), e.f |= S, Pn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && Rn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ln(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ dn(e);
		e.remove(), e = n;
	}
}
function Rn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function zn(e, t, n = !0) {
	var r = [];
	Bn(e, r, !0);
	var i = () => {
		n && In(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Bn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Bn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Vn(e) {
	Hn(e, !0);
}
function Hn(e, t) {
	if (e.f & 8192) {
		e.f ^= y, e.f & 1024 || (Ze(e, _), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Hn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Un(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ dn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Wn = null, Gn = !1, Kn = !1;
function qn(e) {
	Kn = e;
}
var U = null, Jn = !1;
function Yn(e) {
	U = e;
}
var W = null;
function Xn(e) {
	W = e;
}
var Zn = null;
function Qn(e) {
	U !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
}
var $n = null, er = 0, tr = null;
function nr(e) {
	tr = e;
}
var rr = 1, ir = 0, ar = ir;
function or(e) {
	ar = e;
}
function sr() {
	return ++rr;
}
function cr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~D), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cr(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && Ze(e, g);
	}
	return !1;
}
function lr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? lr(a, t, !1) : t === a && (n ? Ze(a, _) : a.f & 1024 && Ze(a, v), Bt(a));
	}
}
function ur(e) {
	var t = $n, n = er, r = tr, i = U, a = Zn, o = F, s = Jn, c = ar, l = e.f;
	$n = null, er = 0, tr = null, U = l & 96 ? null : e, Zn = null, Be(e.ctx), Jn = !1, ar = ++ir, e.ac !== null && (ot(() => {
		e.ac.abort(se);
	}), e.ac = null);
	try {
		e.f |= ee;
		var u = e.fn, d = u();
		e.f |= x;
		var f = e.deps, p = L?.is_fork;
		if ($n !== null) {
			var m;
			if (p || fr(e, er), f !== null && er > 0) for (f.length = er + $n.length, m = 0; m < $n.length; m++) f[er + m] = $n[m];
			else e.deps = f = $n;
			if (bn() && e.f & 512) for (m = er; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && er < f.length && (fr(e, er), f.length = er);
		if (Ue() && tr !== null && !Jn && f !== null && !(e.f & 6146)) for (m = 0; m < tr.length; m++) lr(tr[m], e);
		if (i !== null && i !== e) {
			if (ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ir;
			if (t !== null) for (let e of t) e.rv = ir;
			tr !== null && (r === null ? r = tr : r.push(...tr));
		}
		return e.f & 8388608 && (e.f ^= k), d;
	} catch (e) {
		return Je(e);
	} finally {
		e.f ^= ee, $n = t, er = n, tr = r, U = i, Zn = a, Be(o), Jn = s, ar = c;
	}
}
function dr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && ($n === null || !n.call($n, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~D), s.v !== Ce && Qe(s), s.ac !== null && ot(() => {
			s.ac.abort(se), s.ac = null, Ze(s, _);
		}), Ct(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		Ze(e, g);
		var n = W, r = Gn;
		W = e, Gn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = ur(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = rr;
		} finally {
			Gn = r, W = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), It();
}
function G(e) {
	var t = !!(e.f & 2);
	if (Wn?.add(e), U !== null && !Jn && !(W !== null && W.f & 16384) && (Zn === null || !Zn.has(e))) {
		var r = U.deps;
		if (U.f & 2097152) e.rv < ir && (e.rv = ir, $n === null && r !== null && r[er] === e ? er++ : $n === null ? $n = [e] : $n.push(e));
		else {
			U.deps ??= [], n.call(U.deps, e) || U.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [U] : n.call(i, U) || i.push(U);
		}
	}
	if (Kn && Wt.has(e)) return Wt.get(e);
	if (t) {
		var a = e;
		if (Kn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || gr(a)) && (o = xt(a)), Wt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Jn && U !== null && (Gn || !!(U.f & 512)), c = (a.f & x) === 0;
		cr(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), hr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), hr(t));
}
function gr(e) {
	if (e.v === Ce) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function K(e) {
	var t = Jn;
	try {
		return Jn = !0, e();
	} finally {
		Jn = t;
	}
}
function q(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (A in e) _r(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && A in n && _r(n);
		}
	}
}
function _r(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			_r(e[n], t);
		} catch {}
		let n = l(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = o(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var vr = ["touchstart", "touchmove"];
function yr(e) {
	return vr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ke(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && xn(() => {
		t.removeEventListener(e, o, a);
	});
}
function J(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Er = null;
function Dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Er = e;
	var s = 0, c = Er === e && e[br];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[br] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = U, f = W;
		Yn(null), Xn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[br]?.[r];
					h != null && (!o.disabled || e.target === o) && h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[br] = t, delete e.currentTarget, Yn(d), Xn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Or = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function kr(e) {
	return Or?.createHTML(e) ?? e;
}
function Ar(e) {
	var t = hn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Y(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (M) return jr(N, null), N;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ un(i)));
		var t = r || an ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ un(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Mr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (M) return jr(N, null), N;
		if (!o) {
			var e = /* @__PURE__ */ un(Ar(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ un(e);) o.appendChild(/* @__PURE__ */ un(e));
			else o = /* @__PURE__ */ un(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ un(t), r = t.lastChild;
			jr(n, r);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t) {
	return /* @__PURE__ */ Mr(e, t, "svg");
}
function Pr() {
	if (M) return jr(N, null), N;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = ln();
	return e.append(t, n), jr(t, n), e;
}
function X(e, t) {
	if (M) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = N), je();
		return;
	}
	e !== null && e.before(t);
}
function Z(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ae] ??= e.nodeValue) && (e[ae] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	cn();
	var l = void 0, u = Tn(() => {
		var s = n ?? t.appendChild(ln());
		ut(s, { pending: () => {} }, (t) => {
			Ve({});
			var n = F;
			if (o && (n.c = o), a && (i.$$events = a), M && jr(t, null), l = e(t, i) || {}, M && (W.nodes.end = N, N === null || N.nodeType !== 8 || N.data !== "]")) throw Ee(), Se;
			He();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = yr(r);
					for (let e of [t, document]) {
						var a = Ir.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ir.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(xr)), Sr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ir.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Dr), r.delete(e), r.size === 0 && Ir.delete(n)) : r.set(e, i);
			}
			Sr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Rr.set(l, u), l;
}
var Rr = /* @__PURE__ */ new WeakMap(), zr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Vn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Vn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (In(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Un(r, t), t.append(ln()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else In(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), zn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (In(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = L, r = mn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = ln();
			i.append(a), this.#n.set(e, {
				effect: Mn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Mn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else M && (this.anchor = N), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Br(e, t, n = !1) {
	var r;
	M && (r = N, je());
	var i = new zr(e), a = n ? C : 0;
	function o(e, t) {
		if (M) {
			var n = Pe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ne();
				Ae(a), i.anchor = a, ke(!1), i.ensure(e, t), ke(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	jn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Vr(e, t) {
	return t;
}
function Hr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		zn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Ur(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			pn(d), d.append(u), e.items.clear();
		}
		Ur(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Ur(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= E, Un(a, document.createDocumentFragment())) : In(t[i], n);
	}
}
var Wr;
function Gr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = M ? Ae(/* @__PURE__ */ un(u)) : u.appendChild(ln());
	}
	M && je();
	var d = null, f = /* @__PURE__ */ I(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, qr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= E, Yr(d, null, c)) : Vn(d) : zn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = G(f);
			var e = p.length;
			let t = !1;
			M && Pe(c) === "[!" != (e === 0) && (c = Ne(), Ae(c), ke(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = L, v = mn(), y = 0; y < e; y += 1) {
				M && N.nodeType === 8 && N.data === "]" && (c = N, t = !0, ke(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && u.unskip_effect(S.e)) : (S = Jr(l, h ? c : Wr ??= ln(), b, x, y, o, n, i), h || (S.e.f |= E), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Mn(() => s(c)) : (d = Mn(() => s(Wr ??= ln())), d.f |= E)), e > r.size && fe("", "", ""), M && e > 0 && Ae(Ne()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && ke(!0), G(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, M && (c = N);
}
function Kr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function qr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Kr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Vn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= E, _ === l) Yr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Xr(e, d, _), Xr(e, _, y), Yr(_, y, n), d = _, p = [], m = [], l = Kr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Yr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Xr(e, S.prev, C.next), Xr(e, d, S), Xr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Yr(_, l, n), Xr(e, _.prev, _.next), Xr(e, _, d === null ? e.effect.first : d.next), Xr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Kr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Kr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Ur(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Kr(l.next);
		var T = w.length;
		if (T > 0) {
			var D = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Hr(e, w, D);
		}
	}
	o && Ke(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Jr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ R(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: Mn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Yr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ dn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Xr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function Zr(e, t, n, r, i) {
	M && je();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Qr(e, t, n) {
	En(() => {
		var r = K(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			An(() => {
				var e = n();
				q(e), i && Ie(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function $r(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = $r(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function ei() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = $r(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ti(e) {
	return typeof e == "object" ? ei(e) : e ?? "";
}
var ni = [..." 	\n\r\f\xA0\v﻿"];
function ri(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ni.includes(r[o - 1])) && (s === r.length || ni.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ii(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ai(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function oi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ai)), i && c.push(...Object.keys(i).map(ai));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ai(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += ii(r)), i && (n += ii(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function si(e, t, n, r, i, a) {
	var o = e[re];
	if (M || o !== n || o === void 0) {
		var s = ri(n, r, a);
		(!M || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[re] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ci(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function li(e, t, n, r) {
	var i = e[ie];
	if (M || i !== t) {
		var a = oi(t, r);
		(!M || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ie] = t;
	} else r && (Array.isArray(r) ? (ci(e, n?.[0], r[0]), ci(e, n?.[1], r[1], "important")) : ci(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ui(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return De();
		for (var i of t.options) i.selected = n.includes(pi(i));
		return;
	}
	for (i of t.options) if (tn(pi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function di(e) {
	var t = new MutationObserver(() => {
		"__value" in e && ui(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), xn(() => {
		t.disconnect();
	});
}
function fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	st(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), pi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && pi(o);
		}
		n(a), e.__value = a, L !== null && r.add(L);
	}), En(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = L;
			if (r.has(o)) return;
		}
		if (ui(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = pi(s), n(a));
		}
		e.__value = a, i = !1;
	}), di(e);
}
function pi(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var mi = Symbol("is custom element"), hi = Symbol("is html"), gi = ce ? "link" : "LINK", _i = ce ? "progress" : "PROGRESS";
function vi(e) {
	if (M) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Q(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Q(e, "checked", null), e.checked = r;
				}
			}
		};
		e[oe] = n, Ke(n), at();
	}
}
function yi(e, t) {
	var n = xi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === _i) && (e.value = t ?? "");
}
function bi(e, t) {
	var n = xi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = xi(e);
	M && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === gi) || i[t] !== (i[t] = n) && (t === "loading" && (e[te] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ci(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function xi(e) {
	return e[ne] ??= {
		[mi]: e.nodeName.includes("-"),
		[hi]: e.namespaceURI === we
	};
}
var Si = /* @__PURE__ */ new Map();
function Ci(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Si.get(t);
	if (n) return n;
	Si.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function wi(e, t, n) {
	var r = a(e, t);
	r && r.set && (e[t] = n, xn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ti(e, t) {
	return e === t || e?.[A] === t;
}
function Ei(e = {}, t, n, r) {
	var i = F.r, a = W;
	return En(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], K(() => {
				Ti(n(...s), e) || (t(e, ...s), o && Ti(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ti(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Di(e = !1) {
	let t = F, n = t.l.u;
	if (!n) return;
	let r = () => q(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ gt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => G(i);
	}
	n.b.length && wn(() => {
		Oi(t, r), p(n.b);
	}), Sn(() => {
		let e = K(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Sn(() => {
		Oi(t, r), p(n.a);
	});
}
function Oi(e, t) {
	if (e.l.s) for (let t of e.l.s) G(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Re || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ gt(r), G(u)) : (l && (l = !1, c = s ? K(r) : r), c);
	let f;
	if (o) {
		var p = A in e || j in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = nt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && _e(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (c = void 0), n === void 0 ? c : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? gt : I)(() => (v = !1, g()));
	o && G(y);
	var b = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? G(y) : i && o ? $t(e) : e;
			return z(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Kn && v || b.f & 16384 ? y.v : G(y);
	});
}
function ki(e) {
	F === null && ue("onMount"), Re && F.l !== null ? ji(F).m.push(e) : Sn(() => {
		let t = K(e);
		if (typeof t == "function") return t;
	});
}
function Ai(e) {
	F === null && ue("onDestroy"), ki(() => () => K(e));
}
function ji(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
(() => {
	let e = /* @__PURE__ */ new Set([
		"system",
		"light",
		"dark",
		"custom"
	]), t = {
		pageBackground: "--color-page-bg",
		panelBackground: "--color-panel-bg",
		heading: "--color-heading",
		panelHeading: "--color-panel-heading",
		itemText: "--color-item-text",
		secondaryText: "--color-secondary-text",
		border: "--color-border",
		accent: "--color-accent"
	}, n = document.documentElement, r = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e);
	try {
		let i = JSON.parse(localStorage.getItem("task-progress.theme.v1"));
		if (i?.version !== 1 || !e.has(i.mode) || (n.dataset.theme = i.mode, i.mode !== "custom" || !i.custom)) return;
		n.dataset.themeBase = i.custom.base === "dark" ? "dark" : "light", Object.entries(t).forEach(([e, t]) => {
			r(i.custom[e]) && n.style.setProperty(t, i.custom[e]);
		});
	} catch {}
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), ze();
//#endregion
//#region viewer/assets/icon-choice.js
function Mi(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function Ni(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var Pi = /* @__PURE__ */ Y("<button type=\"button\" tabindex=\"-1\"><!></button>"), Fi = /* @__PURE__ */ Y("<div role=\"group\"></div>"), Ii = /* @__PURE__ */ Y("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Li(e, t) {
	Ve(t, !1);
	let n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ R(), f = /* @__PURE__ */ R(), p = /* @__PURE__ */ R(), m = /* @__PURE__ */ R(), h = /* @__PURE__ */ R(!1), g = /* @__PURE__ */ R(!1), _ = /* @__PURE__ */ R(!1), v = /* @__PURE__ */ R(null), y = /* @__PURE__ */ R(0), b = /* @__PURE__ */ R(0), x = /* @__PURE__ */ R(!1), S = /* @__PURE__ */ R(null), C = 0;
	function w(e = !1) {
		clearTimeout(G(m)), C++, G(S) !== null && G(f)?.hasPointerCapture(G(S)) && G(f).releasePointerCapture(G(S)), z(S, null), z(h, !1), z(g, !1), z(v, null), z(x, !1), e && G(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function E(e = !1) {
		if (!G(r).length) return;
		z(h, !0), z(x, !1);
		let t = ++C;
		if (await mr(), !G(h) || t !== C || !G(p)) return;
		let n = G(f).getBoundingClientRect(), i = G(p).getBoundingClientRect(), o = [...G(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (z(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), z(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (z(y, n.right + 4), G(y) + i.width > window.innerWidth - 4 && z(y, n.left - i.width - 4), z(b, n.top + (n.height - i.height) / 2)) : (z(y, n.left + (n.width - i.width) / 2), z(b, n.bottom + 4), G(b) + i.height > window.innerHeight - 4 && z(b, n.top - i.height - 4)), z(y, Math.max(4, Math.min(G(y), window.innerWidth - i.width - 4))), z(b, Math.max(4, Math.min(G(b), window.innerHeight - i.height - 4))), z(x, !0), await mr(), e && G(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function D(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && G(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ee(e) {
		if (clearTimeout(G(m)), G(S) !== null) {
			if (G(g)) {
				let t = D(e);
				z(_, !0), t === null ? w(!0) : T(G(r).find((e) => String(e.id) === t).id);
			} else {
				let t = G(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (z(_, !0), w(!0));
			}
			z(S, null);
		}
	}
	function O(e) {
		if (["Enter", " "].includes(e.key) && G(S) === null && z(_, !1), e.key === "Tab" && G(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(G(h) || G(S) !== null) && (e.preventDefault(), z(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !G(h)) {
			E(!0);
			return;
		}
		let n = [...G(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function k() {
		G(S) !== null && z(_, !0), w(G(d)?.contains(document.activeElement));
	}
	Ai(() => clearTimeout(G(m))), Dn(() => (q(i()), q(a())), () => {
		z(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), Dn(() => (q(i()), q(a()), q(l())), () => {
		z(r, Ni(i(), a(), l()));
	}), On(), Di();
	var A = Ii();
	wr("pointerdown", nn, (e) => {
		G(d)?.contains(e.target) || w();
	}), wr("resize", nn, k), wr("blur", nn, k), wr("scroll", rn, (e) => {
		G(p)?.contains(e.target) || k();
	}, !0);
	var j = B(A);
	let te;
	Zr(B(j), t, "icon", { get item() {
		return G(n);
	} }, null), P(j), Ei(j, (e) => z(f, e), () => G(f));
	var ne = V(j, 2), re = (e) => {
		var n = Fi();
		let i, s;
		Gr(n, 5, () => G(r), (e) => e.id, (e, n) => {
			var r = Pi();
			let i;
			Zr(B(r), t, "icon", { get item() {
				return G(n);
			} }, null), P(r), H((e) => {
				i = si(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (G(n), K(() => G(n).id))), Q(r, "aria-label", (G(n), K(() => G(n).label))), Q(r, "title", (G(n), K(() => G(n).label))), Q(r, "aria-pressed", (G(n), q(a()), K(() => G(n).kind === "action" ? void 0 : G(n).id === a())));
			}, [() => ({ "icon-choice-hover": G(v) === String(G(n).id) })]), J("keydown", r, O), J("click", r, () => T(G(n).id)), X(e, r);
		}), P(n), Ei(n, (e) => z(p, e), () => G(p)), H(() => {
			i = si(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = li(n, "", s, {
				left: `${G(y)}px`,
				top: `${G(b)}px`,
				visibility: G(x) ? "visible" : "hidden"
			});
		}), X(e, n);
	};
	Br(ne, (e) => {
		G(h) && e(re);
	}), P(A), Ei(A, (e) => z(d, e), () => G(d)), H(() => {
		Q(A, "aria-label", o()), Q(j, "aria-label", (q(o()), G(n), K(() => `${o()}：${G(n)?.label ?? ""}`))), Q(j, "aria-expanded", s() === "cycle" ? void 0 : G(h)), Q(j, "title", (q(o()), G(n), q(s()), K(() => `${o()}：${G(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), j.disabled = !G(n), te = li(j, "", te, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), J("focusout", A, (e) => {
		G(d).contains(e.relatedTarget) || w();
	}), J("keydown", j, O), J("pointerdown", j, (e) => {
		e.button === 0 && (z(_, !1), !(s() === "cycle" || G(h)) && (z(S, e.pointerId), G(f).setPointerCapture(G(S)), clearTimeout(G(m)), z(m, setTimeout(() => {
			z(g, !0), E();
		}, 300))));
	}), J("pointermove", j, (e) => {
		G(g) && z(v, D(e));
	}), J("pointerup", j, ee), wr("pointercancel", j, k), J("click", j, () => {
		if (G(_)) {
			z(_, !1);
			return;
		}
		if (G(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") E(!0);
		else {
			let e = Mi(i(), a());
			e !== void 0 && u()(e);
		}
	}), X(e, A), He();
}
Tr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var Ri = /* @__PURE__ */ Nr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), zi = /* @__PURE__ */ Nr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), Bi = /* @__PURE__ */ Nr("<path d=\"M3 3l18 18\"></path>"), Vi = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function Hi(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = Vi(), a = B(i), o = (e) => {
		X(e, Ri());
	}, s = (e) => {
		var t = zi();
		Me(), X(e, t);
	};
	Br(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = V(a), l = (e) => {
		X(e, Bi());
	};
	Br(c, (e) => {
		r() && e(l);
	}), P(i), X(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var Ui = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function Wi(e, t) {
	let n = $(t, "mode", 8, "disabled"), r = $(t, "onChoose", 8, () => {}), i = [
		{
			id: "enabled",
			label: "啟用"
		},
		{
			id: "closed",
			label: "全體關閉"
		},
		{
			id: "disabled",
			label: "禁用"
		},
		{
			id: "reset",
			label: "重置",
			kind: "action"
		}
	];
	Li(e, {
		get items() {
			return i;
		},
		get value() {
			return n();
		},
		label: "可見性",
		orientation: "vertical",
		get onChoose() {
			return r();
		},
		$$slots: { icon: (e, t) => {
			let n = /* @__PURE__ */ I(() => t.item);
			var r = Pr(), i = fn(r), a = (e) => {
				X(e, Ui());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ I(() => (q(G(n)), K(() => G(n)?.id === "closed"))), r = /* @__PURE__ */ I(() => (q(G(n)), K(() => G(n)?.id === "disabled")));
					Hi(e, {
						get closed() {
							return G(t);
						},
						get disabled() {
							return G(r);
						}
					});
				}
			};
			Br(i, (e) => {
				q(G(n)), K(() => G(n)?.id === "reset") ? e(a) : e(o, -1);
			}), X(e, r);
		} }
	});
}
//#endregion
//#region viewer/assets/card-visibility.js
function Gi(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function Ki(e, t, n) {
	return n === "reset" ? {
		mode: "enabled",
		hiddenIds: []
	} : {
		mode: [
			"enabled",
			"closed",
			"disabled"
		].includes(n) ? n : e,
		hiddenIds: t
	};
}
//#endregion
//#region viewer/assets/capsule-order.js
function qi(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Ji(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function Yi(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function Xi(e, t, n, r = []) {
	let i = n === "free" ? Zi(e, t) : n === "reverse" ? [...e].reverse() : e;
	if (!r.length) return i;
	let a = new Map(e.map((e) => [e.id, e])), o = new Set(r);
	return [...o].filter((e) => a.has(e)).map((e) => a.get(e)).concat(i.filter((e) => !o.has(e.id)));
}
function Zi(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function Qi(e, t, n, r, i, a) {
	let o = qi(t, e), s = new Set(n), c = Ji(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var $i = /* @__PURE__ */ Nr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), ea = /* @__PURE__ */ Nr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), ta = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), na = /* @__PURE__ */ Y("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), ra = /* @__PURE__ */ Y("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), ia = /* @__PURE__ */ Y("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function aa(e, t) {
	Ve(t, !1);
	let n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = /* @__PURE__ */ R(), a = $(t, "items", 24, () => []), o = $(t, "allIds", 24, () => []), s = $(t, "storageKey", 8), c = $(t, "pinEnabled", 8, !1), l = $(t, "requestedPin", 8, null), u = $(t, "heldOrder", 8, null);
	function d(e = a()) {
		return Xi(e, G(T), G(g), c() ? G(f) : []).map((e) => e.id);
	}
	let f = /* @__PURE__ */ R([]), p = null, m = $(t, "expanded", 8, !0), h = $(t, "onToggleAll", 8, () => {}), g = /* @__PURE__ */ R("forward"), _ = [
		"forward",
		"reverse",
		"free"
	], v = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, y = /* @__PURE__ */ R("disabled"), b = /* @__PURE__ */ R([]);
	function x() {
		if (s()) try {
			sessionStorage.setItem(`${s()}:visibility`, JSON.stringify({
				mode: G(y),
				hiddenIds: G(b)
			}));
		} catch {}
	}
	function S(e) {
		let t = Ki(G(y), G(b), e);
		z(y, t.mode), z(b, t.hiddenIds), ce(), x();
	}
	function C(e, t) {
		z(b, t ? G(b).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...G(b), e])]), ce(), x();
	}
	function w(e) {
		G(y) === "closed" && z(y, "enabled"), C(e, !0);
	}
	let T = /* @__PURE__ */ R(null), E = /* @__PURE__ */ R(null), D = /* @__PURE__ */ R(null), ee = /* @__PURE__ */ R(null), O = /* @__PURE__ */ R(null), k = /* @__PURE__ */ R(), A = /* @__PURE__ */ R("");
	function j(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (p !== i) {
			if (p = i, !n.includes(e)) {
				z(A, `找不到卡片 ID：${e}`);
				return;
			}
			z(f, Yi(G(f), e)), w(e), te();
		}
	}
	function te() {
		if (!s()) {
			z(A, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${s()}:pins`, JSON.stringify(G(f))), z(A, "已記住本機釘選");
		} catch {
			z(A, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function ne(e) {
		ce(), z(f, G(f).includes(e) ? G(f).filter((t) => t !== e) : Yi(G(f), e)), te();
	}
	function re(e) {
		if (p = null, z(f, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			z(f, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (z(y, "disabled"), z(b, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			z(y, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), z(b, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (z(E, null), z(D, null), z(ee, null), z(O, null), !e) {
			z(T, null), z(g, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			z(T, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			z(g, _.includes(n) ? n : G(T) ? "free" : "forward");
		} catch {
			z(T, null), z(g, "forward");
		}
	}
	function ie(e) {
		if (z(T, e), !s()) {
			z(A, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(s(), JSON.stringify(e)) : localStorage.removeItem(s()), z(A, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			z(A, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function ae(e) {
		if (ce(), z(g, e), z(A, ""), s()) try {
			localStorage.setItem(`${s()}:mode`, G(g));
		} catch {
			z(A, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function oe(e, t, n) {
		G(g) === "free" && (c() && (G(f).includes(e) || G(f).includes(t)) || e !== t && (ie(Qi(o(), G(T), G(r).map((e) => e.id), e, t, n)), z(E, e), await mr(), [...G(k).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function se(e, t) {
		let n = G(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = G(r)[n + t];
		i && oe(e, i.id, t > 0);
	}
	function ce() {
		z(D, null), z(ee, null), z(O, null);
	}
	function le(e, t) {
		if (c() && G(f).includes(e.id) || G(ee) === null || G(ee) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		z(O, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	Dn(() => G(y), () => {
		z(n, G(y) === "enabled");
	}), Dn(() => (q(a()), G(T), G(g), q(c()), G(f), q(u())), () => {
		z(i, Zi(Xi(a(), G(T), G(g), c() ? G(f) : []), u()));
	}), Dn(() => (G(i), G(y), G(b), q(c()), G(f)), () => {
		z(r, G(i).filter((e) => Gi(e.id, G(y), G(b)) && !(c() && G(f).includes(e.id))));
	}), Dn(() => q(s()), () => {
		re(s());
	}), Dn(() => (q(l()), q(s()), q(o()), q(c())), () => {
		j(l(), s(), o(), c());
	}), On();
	var ue = {
		orderedIds: d,
		revealCard: w
	};
	Di();
	var de = ia(), fe = fn(de), pe = B(fe);
	Zr(V(B(pe), 2), t, "filters", {}, null), P(pe);
	var me = V(pe, 2), he = B(me), ge = B(he), _e = B(ge);
	P(ge), P(he);
	var ve = V(he, 2);
	{
		let e = /* @__PURE__ */ I(() => K(() => _.map((e) => ({
			id: e,
			label: v[e]
		}))));
		Li(ve, {
			get items() {
				return G(e);
			},
			get value() {
				return G(g);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: ae,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ I(() => t.item);
				var r = ta(), i = B(r), a = (e) => {
					X(e, $i());
				}, o = (e) => {
					var t = ea(), r = fn(t), i = V(r);
					H(() => {
						Q(r, "d", (q(G(n)), K(() => G(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (q(G(n)), K(() => G(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), X(e, t);
				};
				Br(i, (e) => {
					q(G(n)), K(() => G(n).id === "free") ? e(a) : e(o, -1);
				}), P(r), X(e, r);
			} }
		});
	}
	var ye = V(ve, 2);
	Wi(ye, {
		get mode() {
			return G(y);
		},
		onChoose: S
	});
	var be = V(ye, 2), xe = B(be, !0);
	P(be), P(me), P(fe);
	var Se = V(fe, 2);
	return Gr(Se, 5, () => G(i), (e) => e.id, (e, r) => {
		var i = ra();
		let a;
		var o = B(i), s = (e) => {
			var t = na();
			let n;
			var i = B(t), a = B(i);
			P(i), P(t), H((e, r, i, o, s) => {
				n = si(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({ "is-pinned": G(f).includes(G(r).id) }),
				() => (G(f), G(r), K(() => G(f).includes(G(r).id) ? `取消釘選：${G(r).title}` : `釘選置頂：${G(r).title}`)),
				() => (G(f), G(r), K(() => G(f).includes(G(r).id))),
				() => (G(f), G(r), K(() => G(f).includes(G(r).id) ? "取消釘選" : "釘選置頂")),
				() => (G(f), G(r), K(() => G(f).includes(G(r).id) ? "currentColor" : "none"))
			]), J("click", t, () => ne(G(r).id)), X(e, t);
		};
		Br(o, (e) => {
			c() && e(s);
		});
		var l = V(o, 2);
		{
			let e = /* @__PURE__ */ I(() => (G(b), G(r), K(() => !G(b).includes(G(r).id))));
			Zr(l, t, "default", {
				get item() {
					return G(r);
				},
				get visibilityEnabled() {
					return G(n);
				},
				get visible() {
					return G(e);
				},
				onVisibleChange: (e) => C(G(r).id, e)
			}, null);
		}
		P(i), H((e) => {
			Q(i, "hidden", e), a = si(i, 1, "arrangeable-card", null, a, {
				"card-selected": G(E) === G(r).id,
				"card-drop-before": G(O)?.id === G(r).id && !G(O).after,
				"card-drop-after": G(O)?.id === G(r).id && G(O).after
			}), Q(i, "aria-label", (G(r), G(E), K(() => `${G(r).title}${G(E) === G(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (G(r), K(() => G(r).id))), Q(i, "draggable", (G(g), G(D), G(r), K(() => G(g) === "free" && G(D) === G(r).id)));
		}, [() => (q(Gi), G(r), G(y), G(b), K(() => !Gi(G(r).id, G(y), G(b))))]), J("pointerdown", i, (e) => {
			z(D, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (z(E, G(r).id), !(G(g) !== "free" || e.pointerType !== "mouse" || c() && G(f).includes(G(r).id)) && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || z(D, G(r).id))));
		}), J("pointerup", i, () => {
			z(D, null);
		}), J("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), z(E, G(r).id)) : e.key === "Escape" && z(E, null), G(g) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), se(G(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), wr("dragstart", i, (e) => {
			G(g) === "free" && G(D) === G(r).id && e.target === e.currentTarget && (z(ee, G(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(G(r).id)));
		}), wr("dragend", i, ce), wr("dragover", i, (e) => le(G(r), e)), wr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || z(O, null);
		}), wr("drop", i, (e) => {
			G(ee) !== null && G(O)?.id === G(r).id && (e.preventDefault(), oe(G(ee), G(r).id, G(O).after), ce());
		}), X(e, i);
	}), P(Se), Ei(Se, (e) => z(k, e), () => G(k)), H(() => {
		Q(he, "aria-label", m() ? "全部收合" : "全部展開"), Q(he, "title", m() ? "全部收合" : "全部展開"), Q(_e, "d", m() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Z(xe, G(A));
	}), J("click", he, () => h()(!m())), X(e, de), wi(t, "orderedIds", d), wi(t, "revealCard", w), He(ue);
}
Tr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region viewer/assets/focus-shield.js
function oa({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, now: n = () => Date.now(), activationWindowMs: r = 100, storage: i, key: a = `taskprogress.mouse-activation.v2:${e.location?.pathname ?? ""}` } = {}) {
	let o = () => t.visibilityState !== "hidden" && t.hasFocus(), s = !o(), c = -Infinity, l = !1, u = !1;
	try {
		let e = Number((i ?? globalThis.sessionStorage).getItem(a));
		o() && e > n() && e <= n() + r && (c = e - r);
	} catch {}
	let d = () => {
		c = -Infinity;
		try {
			(i ?? globalThis.sessionStorage).removeItem(a);
		} catch {}
	}, f = () => {
		s = !0, d(), l = !1, u = !1;
	}, p = () => {
		if (!(!o() || !s)) {
			s = !1, c = n();
			try {
				(i ?? globalThis.sessionStorage).setItem(a, String(c + r));
			} catch {}
		}
	}, m = () => {
		t.visibilityState === "hidden" ? f() : p();
	}, h = (e) => {
		e.preventDefault(), e.stopImmediatePropagation();
	}, g = () => {
		d();
	};
	function _(e) {
		if (e.type === "pointerdown" && (u = e.pointerType && e.pointerType !== "mouse"), u || e.pointerType && e.pointerType !== "mouse") {
			(e.type === "click" || e.type === "pointercancel") && (u = !1);
			return;
		}
		if (e.type === "click" && e.detail === 0) return;
		let t = e.type === "pointerdown" || e.type === "mousedown", i = s || !o() || n() - c < r;
		t && (e.type === "pointerdown" || !l) && (l = i), !t && i && [
			"mouseup",
			"click",
			"auxclick"
		].includes(e.type) && (l = !0), l && (h(e), (e.type === "click" || e.type === "auxclick" || e.type === "pointercancel") && (l = !1, d()));
	}
	let v = [
		"pointerdown",
		"pointerup",
		"pointercancel",
		"mousedown",
		"mouseup",
		"click",
		"auxclick"
	];
	e.addEventListener("blur", f), e.addEventListener("focus", p), e.addEventListener("keydown", g, { capture: !0 }), t.addEventListener("visibilitychange", m);
	for (let t of v) e.addEventListener(t, _, { capture: !0 });
	return () => {
		e.removeEventListener("blur", f), e.removeEventListener("focus", p), e.removeEventListener("keydown", g, { capture: !0 }), t.removeEventListener("visibilitychange", m);
		for (let t of v) e.removeEventListener(t, _, { capture: !0 });
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/FocusShield.svelte
function sa(e, t) {
	Ve(t, !1), ki(() => oa()), Di(), He();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var ca = /* @__PURE__ */ Y("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function la(e, t) {
	Ve(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ R(), d = null, f = !1;
	function p(e) {
		d = e.ownerDocument.activeElement, f = !1, e.showModal();
	}
	function m() {
		if (f) return;
		f = !0;
		let e = d;
		d = null, l()(), queueMicrotask(() => {
			e?.isConnected && e.focus();
		});
	}
	function h() {
		G(u)?.close(), m();
	}
	function g(e) {
		e.target === e.currentTarget && h();
	}
	Di();
	var _ = Pr(), v = fn(_), y = (e) => {
		var n = ca(), l = B(n), d = B(l), f = B(d), _ = B(f, !0);
		P(f);
		var v = V(f, 2), y = B(v, !0);
		P(v), P(d);
		var b = V(d, 2);
		P(l), Zr(V(l, 2), t, "default", { close: h }, null), P(n), Ei(n, (e) => z(u, e), () => G(u)), Qr(n, (e) => p?.(e)), H(() => {
			si(n, 1, ti(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), Z(_, a()), Q(v, "id", s()), Z(y, o()), Q(b, "aria-label", c());
		}), wr("close", n, m), J("click", n, g), J("click", b, h), X(e, n);
	};
	Br(v, (e) => {
		n() && e(y);
	}), X(e, _), He();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var ua = /* @__PURE__ */ Y("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), da = /* @__PURE__ */ Y("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function fa(e, t) {
	Ve(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Di();
	var l = da(), u = fn(l);
	let d;
	var f = B(u), p = B(f), m = B(p, !0);
	P(p), P(f);
	var h = V(f, 2), g = (e) => {
		var t = ua(), n = B(t);
		{
			let e = /* @__PURE__ */ I(() => !r());
			Hi(n, { get closed() {
				return G(e);
			} });
		}
		P(t), H(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), J("click", t, () => i()(!r())), X(e, t);
	};
	Br(h, (e) => {
		n() && e(g);
	}), Zr(V(h, 2), t, "header", {}, null), P(u);
	var _ = V(u, 2);
	Zr(B(_), t, "default", {}, null), P(_), H(() => {
		d = si(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), Z(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), J("click", f, () => c()(!a())), X(e, l), He();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var pa = /* @__PURE__ */ Y("<span></span>"), ma = /* @__PURE__ */ Y("<span class=\"time-chevron\">›</span>"), ha = /* @__PURE__ */ Y("<button type=\"button\"><span> </span> <!> <!></button>"), ga = /* @__PURE__ */ Y("<div role=\"toolbar\"></div>");
function _a(e, t) {
	Ve(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ R(null), c = /* @__PURE__ */ R(null), l = !1, u = null, d = /* @__PURE__ */ R(null), f = /* @__PURE__ */ R();
	async function p() {
		let e = G(d);
		z(d, null), await mr(), [...G(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		z(s, null), z(c, null);
	}
	function h(e, t) {
		return t?.id === e ? t.placeAfter ? "capsule-drop-after" : "capsule-drop-before" : "";
	}
	function g(e, t) {
		let n = e.getBoundingClientRect();
		return t >= n.left + n.width / 2;
	}
	function _() {
		return n().filter((e) => e.sortable !== !1);
	}
	function v(e, t, n, r = e) {
		z(d, r), o()(e, t, n);
	}
	function y(e, t) {
		let n = _(), r = n.findIndex((t) => t.id === e), i = n[r + t];
		r < 0 || !i || v(e, i.id, t > 0);
	}
	function b(e, t) {
		if (l) {
			t.preventDefault(), l = !1;
			return;
		}
		a()(e.id);
	}
	function x(e, t) {
		!t.altKey || !["ArrowLeft", "ArrowRight"].includes(t.key) || (t.preventDefault(), y(e.id, t.key === "ArrowLeft" ? -1 : 1));
	}
	function S(e, t) {
		z(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!G(s) || e.id === G(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", z(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || G(c)?.id === e.id && z(c, null);
	}
	function T(e, t) {
		if (!G(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = G(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function E() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function D(e, t) {
		e.sortable !== !1 && t.pointerType !== "mouse" && t.button === 0 && (u = {
			pointerId: t.pointerId,
			id: e.id,
			startX: t.clientX,
			startY: t.clientY,
			active: !1,
			targetId: null,
			placeAfter: !1
		}, t.currentTarget.setPointerCapture?.(t.pointerId));
	}
	function ee(e, t) {
		if (!u || u.pointerId !== t.pointerId) return;
		let n = t.clientX - u.startX, r = t.clientY - u.startY;
		if (!u.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			u.active = !0, l = !0, z(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, z(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), z(c, {
			id: a,
			placeAfter: u.placeAfter
		});
	}
	function O(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	Dn(() => (q(n()), G(d)), () => {
		n() && G(d) && p();
	}), On(), Di();
	var k = ga();
	Gr(k, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ I(() => (G(t), K(() => G(t).sortable !== !1)));
		var r = ha(), i = B(r), a = B(i, !0);
		P(i);
		var o = V(i, 2), l = (e) => {
			var n = pa();
			H(() => si(n, 1, (G(t), K(() => `time-risk-dot ${G(t).dotClass ?? ""}`)))), X(e, n);
		};
		Br(o, (e) => {
			G(t), K(() => G(t).showDot) && e(l);
		});
		var u = V(o, 2), d = (e) => {
			X(e, ma());
		};
		Br(u, (e) => {
			G(t), K(() => G(t).showChevron) && e(d);
		}), P(r), H((e) => {
			si(r, 1, e), Q(r, "data-capsule-id", (G(t), K(() => G(t).id))), Q(r, "data-reorder-capsule", G(n) ? "true" : null), Q(r, "aria-pressed", (G(t), K(() => G(t).pressed ?? null))), Q(r, "aria-label", (G(t), K(() => G(t).ariaLabel ?? G(t).label))), Q(r, "aria-keyshortcuts", G(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (G(t), K(() => G(t).title ?? null))), r.disabled = (G(t), K(() => G(t).disabled ?? !1)), Q(r, "draggable", G(n)), Z(a, (G(t), K(() => G(t).label)));
		}, [() => (G(t), q(G(n)), G(s), G(c), K(() => `capsule-button ${G(t).className ?? ""} ${G(n) ? "capsule-sortable" : ""} ${G(s) === G(t).id ? "capsule-dragging" : ""} ${h(G(t).id, G(c))}`))]), J("click", r, (e) => b(G(t), e)), J("keydown", r, function(...e) {
			(G(n) ? (e) => x(G(t), e) : null)?.apply(this, e);
		}), wr("dragstart", r, function(...e) {
			(G(n) ? (e) => S(G(t), e) : null)?.apply(this, e);
		}), wr("dragover", r, function(...e) {
			(G(n) ? (e) => C(G(t), e) : null)?.apply(this, e);
		}), wr("dragleave", r, function(...e) {
			(G(n) ? (e) => w(G(t), e) : null)?.apply(this, e);
		}), wr("drop", r, function(...e) {
			(G(n) ? (e) => T(G(t), e) : null)?.apply(this, e);
		}), wr("dragend", r, function(...e) {
			(G(n) ? E : null)?.apply(this, e);
		}), J("pointerdown", r, function(...e) {
			(G(n) ? (e) => D(G(t), e) : null)?.apply(this, e);
		}), J("pointermove", r, function(...e) {
			(G(n) ? (e) => ee(G(t), e) : null)?.apply(this, e);
		}), J("pointerup", r, function(...e) {
			(G(n) ? O : null)?.apply(this, e);
		}), wr("pointercancel", r, function(...e) {
			(G(n) ? O : null)?.apply(this, e);
		}), X(e, r);
	}), P(k), Ei(k, (e) => z(f, e), () => G(f)), H(() => {
		si(k, 1, `horizontal-capsule-strip ${r()}`), Q(k, "aria-label", i());
	}), X(e, k), He();
}
Tr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region viewer/assets/filter-selection.js
var va = "__default__";
function ya(e) {
	return [...new Set(e)];
}
function ba(e = []) {
	let t = ya(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function xa(e, t, n) {
	let r = ba(t);
	if (!e) return r;
	try {
		let t = JSON.parse((n ?? globalThis.sessionStorage).getItem(e));
		return !Array.isArray(t) || !t.every((e) => typeof e == "string") ? r : Object.freeze({
			tags: r.tags,
			selected: new Set(t.filter((e) => r.tags.includes(e)))
		});
	} catch {
		return r;
	}
}
function Sa(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function Ca(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function wa(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Ta(e) {
	let t = Ca(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Ea(e, t) {
	Ve(t, !1);
	let n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = /* @__PURE__ */ R(), a = /* @__PURE__ */ R(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
		let r = n && e.sortable !== !1;
		return {
			id: e.id,
			label: _(e),
			className: `filter-button${r ? " status-sortable" : ""}`,
			sortable: r,
			pressed: t.has(e.id),
			title: e.title ?? null,
			ariaLabel: e.ariaLabel ?? _(e)
		};
	};
	function y(e) {
		e === "__default__" ? h()() : m()(e);
	}
	Dn(() => (q(u()), q(p()), q(l())), () => {
		z(n, {
			id: va,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), Dn(() => q(o()), () => {
		z(r, new Map(o().map((e) => [e.id, e])));
	}), Dn(() => (q(s()), q(o())), () => {
		z(i, s().length > 0 ? s() : [va, ...o().map((e) => e.id)]);
	}), Dn(() => (G(i), G(n), G(r), q(c()), q(p())), () => {
		z(a, G(i).map((e) => e === "__default__" ? G(n) : G(r).get(e)).filter(Boolean).map((e) => e === G(n) ? e : v(e, c(), p())));
	}), On(), Di();
	{
		let t = /* @__PURE__ */ I(() => `filter-strip ${f()}`);
		_a(e, {
			get items() {
				return G(a);
			},
			get className() {
				return G(t);
			},
			get ariaLabel() {
				return d();
			},
			onActivate: y,
			get onReorder() {
				return g();
			}
		});
	}
	He();
}
//#endregion
//#region viewer/assets/theme-model.js
var Da = "task-progress.theme.v1", Oa = [
	"system",
	"light",
	"dark",
	"custom"
], ka = [
	{
		key: "pageBackground",
		cssVariable: "--color-page-bg",
		label: "頁面背景"
	},
	{
		key: "panelBackground",
		cssVariable: "--color-panel-bg",
		label: "面板背景"
	},
	{
		key: "heading",
		cssVariable: "--color-heading",
		label: "大標題"
	},
	{
		key: "panelHeading",
		cssVariable: "--color-panel-heading",
		label: "面板標題"
	},
	{
		key: "itemText",
		cssVariable: "--color-item-text",
		label: "項目文字"
	},
	{
		key: "secondaryText",
		cssVariable: "--color-secondary-text",
		label: "次要文字"
	},
	{
		key: "border",
		cssVariable: "--color-border",
		label: "邊框與分隔線"
	},
	{
		key: "accent",
		cssVariable: "--color-accent",
		label: "強調色"
	}
], Aa = Object.freeze({
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
}), ja = Object.freeze({
	version: 1,
	mode: "system"
}), Ma = /^#[0-9a-f]{6}$/i;
function Na(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Pa(e) {
	return typeof e == "string" && Ma.test(e);
}
function Fa(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Aa[n], i = { base: n };
	for (let e of ka) {
		let n = t[e.key];
		i[e.key] = Pa(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Ia(e) {
	if (!Na(e) || e.version !== 1 || !Oa.includes(e.mode)) return { ...ja };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Na(e.custom) ? t.custom = Fa(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Fa()), t;
}
function La(e) {
	try {
		let t = e?.getItem(Da);
		return t ? Ia(JSON.parse(t)) : { ...ja };
	} catch {
		return { ...ja };
	}
}
function Ra(e, t) {
	let n = Ia(t);
	try {
		e?.setItem(Da, JSON.stringify(n));
	} catch {}
	return n;
}
function za(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Ba(e, t) {
	let n = Ia(t);
	e.dataset.theme = n.mode;
	for (let t of ka) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Fa();
		e.dataset.themeBase = t.base;
		for (let n of ka) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Va(e, t, n = "light") {
	let r = Ia(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Fa(n)), Ia(i);
}
function Ha(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Ua(e, t) {
	if (!Pa(e) || !Pa(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ha(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Wa(e) {
	return [
		[
			"大標題",
			e.heading,
			e.pageBackground
		],
		[
			"面板標題",
			e.panelHeading,
			e.panelBackground
		],
		[
			"項目文字",
			e.itemText,
			e.panelBackground
		],
		[
			"次要文字",
			e.secondaryText,
			e.panelBackground
		]
	].filter(([, e, t]) => Ua(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Ga = /* @__PURE__ */ Y("<option> </option>"), Ka = /* @__PURE__ */ Y("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), qa = /* @__PURE__ */ Y("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), Ja = /* @__PURE__ */ Y("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Ya(e, t) {
	Ve(t, !1);
	let n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = /* @__PURE__ */ R(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
		{
			value: "system",
			label: "系統選擇"
		},
		{
			value: "light",
			label: "亮色"
		},
		{
			value: "dark",
			label: "暗色"
		},
		{
			value: "custom",
			label: "自訂…"
		}
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ R(!1), p = /* @__PURE__ */ R([]), m = /* @__PURE__ */ R(a()), h = /* @__PURE__ */ R(o()?.base ?? s()), g = /* @__PURE__ */ R(v(Fa(G(h)))), _ = /* @__PURE__ */ R({ ...G(g) });
	function v(e) {
		return Object.fromEntries(ka.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		z(h, e.base), z(g, v(e)), z(_, { ...G(g) });
		for (let e of G(p)) e?.setCustomValidity("");
	}
	function b(e) {
		let t = e.currentTarget.value;
		if (t === "custom") {
			x();
			return;
		}
		c()(t);
	}
	function x() {
		y(o() ? Fa(o().base, o()) : Fa(s())), z(f, !0);
	}
	function S() {
		z(f, !1);
	}
	function C(e) {
		y(Fa(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		z(g, {
			...G(g),
			[e.key]: r
		}), z(_, {
			...G(_),
			[e.key]: r
		}), G(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), z(g, {
			...G(g),
			[e.key]: n.value
		}), r && z(_, {
			...G(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function E() {
		z(m, a()), S();
	}
	function D() {
		let e = G(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Fa(G(h), G(_))), S();
	}
	Dn(() => q(a()), () => {
		z(m, a());
	}), Dn(() => (G(h), G(_)), () => {
		z(n, Fa(G(h), G(_)));
	}), Dn(() => G(n), () => {
		z(r, Wa(G(n)));
	}), Dn(() => G(r), () => {
		z(i, G(r).length ? `注意：${G(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), On(), Di();
	var ee = Ja(), O = fn(ee), k = V(B(O), 2);
	Gr(k, 5, () => u, (e) => e.value, (e, t) => {
		var n = Ga(), r = B(n, !0);
		P(n);
		var i = {};
		H(() => {
			Z(r, (G(t), K(() => G(t).label))), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
		}), X(e, n);
	}), P(k), P(O), la(V(O, 2), {
		get open() {
			return G(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: E,
		children: (e, t) => {
			var a = qa(), o = V(fn(a), 2), s = V(B(o), 2), c = B(s);
			c.value = c.__value = "light";
			var l = V(c);
			l.value = l.__value = "dark", P(s);
			var u;
			di(s), P(o);
			var d = V(o, 2);
			Gr(d, 7, () => ka, (e) => e.key, (e, t, r) => {
				var i = Ka(), a = B(i), o = B(a, !0);
				P(a);
				var s = V(a, 2), c = B(s);
				vi(c);
				var l = V(c, 2);
				vi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ei(l, (e, t) => Jt(p, G(p)[t] = e), (e) => G(p)?.[e], () => [G(r)]), P(s), P(i), H(() => {
					Z(o, (G(t), K(() => G(t).label))), Q(c, "aria-label", (G(t), K(() => `${G(t).label}選色器`))), yi(c, (G(n), G(t), K(() => G(n)[G(t).key]))), Q(l, "aria-label", (G(t), K(() => `${G(t).label}十六進位色碼`))), yi(l, (G(g), G(t), K(() => G(g)[G(t).key])));
				}), J("input", c, (e) => w(G(t), G(r), e)), J("input", l, (e) => T(G(t), e)), X(e, i);
			}), P(d);
			var f = V(d, 2);
			let m;
			var _ = B(f, !0);
			P(f);
			var v = V(f, 2), b = B(v), x = V(b, 4), S = V(x, 2);
			P(v), H(() => {
				u !== (u = G(h)) && (s.value = (s.__value = G(h)) ?? "", ui(s, G(h))), m = si(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": G(r).length > 0 }), Z(_, G(i));
			}), J("change", s, C), J("click", b, () => y(Fa(G(h)))), J("click", x, E), J("click", S, D), X(e, a);
		},
		$$slots: { default: !0 }
	}), J("change", k, b), fi(k, () => G(m), (e) => z(m, e)), X(e, ee), He();
}
Tr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region viewer/assets/theme-control.js
function Xa({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = La(t);
	e && Ba(e, r);
	function i(n) {
		return r = Ra(t, n), e && Ba(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return za(n);
		},
		setMode(e) {
			return i(Va(r, e, za(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Fa(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region viewer/assets/decision-session.js
var Za = (e) => structuredClone(e), Qa = (e) => e && typeof e == "object" ? Array.isArray(e) ? e.map(Qa) : Object.fromEntries(Object.keys(e).sort().map((t) => [t, Qa(e[t])])) : e, $a = (e, t) => JSON.stringify(Qa(e)) === JSON.stringify(Qa(t));
function eo(e) {
	let t = Za(e), n = Object.create(null), r = null, i = null, a = !1, o = (e) => t.document.decisions.find((t) => t.id === e);
	function s() {
		return {
			snapshot: Za(t),
			drafts: Za(n),
			pending: Za(r),
			busy: a,
			dirty: Object.keys(n).length > 0
		};
	}
	function c(e) {
		for (let [t, r] of Object.entries(n)) {
			let n = e.document.decisions.find((e) => e.id === t);
			r.conflict = !n || !$a(r.base, n);
		}
		t = Za(e);
	}
	return {
		view: s,
		canConfirm(e) {
			let t = n[e], i = o(e);
			return !r && !a && !!i && !!t && !t.conflict && (t.choice === "__other" ? i.allow_other && !!t.other.trim() : i.options.some((e) => e.id === t.choice));
		},
		saveOperation(e) {
			let t = n[e];
			return r || a || !t || t.conflict || !o(e) ? null : this.canConfirm(e) ? "confirm" : o(e).answer && t.cleared && !t.choice || o(e).answer && o(e).allow_other && t.choice === "__other" && !t.other.trim() ? "reopen" : null;
		},
		edit(e, t) {
			if (r && !a || r?.operation === "clear_all" || !o(e)) return;
			let i = o(e).answer;
			n[e] ??= {
				base: Za(o(e)),
				choice: i?.kind === "other" ? "__other" : i?.option_id ?? "",
				other: i?.kind === "other" ? i.text : "",
				conflict: !1
			}, Object.assign(n[e], { cleared: !1 }, t), n[e].cleared && !n[e].other && !i && r?.decision_id !== e && delete n[e];
		},
		select(e, t) {
			if (r && !a || r?.operation === "clear_all" || !o(e) || n[e]?.conflict) return;
			let i = o(e).answer, s = (n[e]?.choice ?? (i?.kind === "other" ? "__other" : i?.option_id ?? "")) === t ? "" : t;
			return this.edit(e, s ? { choice: s } : {
				choice: "",
				cleared: !0
			}), s;
		},
		discard(e) {
			r?.decision_id !== e && delete n[e];
		},
		rebase(e) {
			let t = o(e), r = n[e];
			!r || !t || (r.choice && (r.choice !== "__other" && !t.options.some((e) => e.id === r.choice) || r.choice === "__other" && !t.allow_other) && (r.choice = "", r.cleared = !1), r.base = Za(t), r.conflict = !1, r.cleared && !r.other && !t.answer && delete n[e]);
		},
		merge: c,
		beginClearAll() {
			if (r || a) throw Error("請先查核上一筆請求的結果。");
			return r = {
				operation: "clear_all",
				expected_revision: t.revision,
				request_id: crypto.randomUUID(),
				payload: {}
			}, i = null, a = !0, Za(r);
		},
		begin(e, s = "confirm") {
			if (r || a) throw Error("請先查核上一筆請求的結果。");
			let c = o(e), l = n[e], u = {};
			if (s === "confirm") {
				if (!l || l.conflict || !l.choice) throw Error("請選擇答案並處理衝突。");
				if (l.choice === "__other") {
					if (!l.other.trim()) throw Error("請輸入其他方案。");
					u = {
						kind: "other",
						text: l.other
					};
				} else u = {
					kind: "option",
					option_id: l.choice
				};
			}
			return r = {
				operation: s,
				decision_id: e,
				expected_revision: t.revision,
				expected_version: c.version,
				request_id: crypto.randomUUID(),
				payload: u
			}, i = l ? Za(l) : null, a = !0, Za(r);
		},
		retry() {
			if (!r || a) throw Error("沒有待查核請求。");
			return a = !0, Za(r);
		},
		failed() {
			a = !1;
		},
		complete(e) {
			if (a = !1, !e.ok) {
				r = null, i = null;
				return;
			}
			if (r?.operation === "clear_all") {
				n = Object.create(null), r = null, i = null, c(e);
				return;
			}
			let t = r?.decision_id, s = n[t], l = s && i && (s.choice !== i.choice || s.other !== i.other), u = s && (l || r?.operation === "reopen" && (!s.cleared || s.other)) ? Za(s) : null;
			if (r && delete n[r.decision_id], r = null, i = null, c(e), u) {
				let e = o(t), r = (e) => {
					if (!e) return null;
					let { answer: t, status: n, last_request: r, ...i } = e;
					return i;
				};
				u.conflict = !e || !$a(r(u.base), r(e)), u.conflict || (u.base = Za(e)), u.cleared && !u.other && !u.conflict && !e.answer || (n[t] = u);
			}
		}
	};
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function to(e, t) {
	try {
		let n = JSON.parse((t ?? globalThis.sessionStorage).getItem(e));
		if (typeof n?.expanded != "boolean") return {
			expanded: !0,
			overrides: {}
		};
		let r = Object.fromEntries(Object.entries(n.overrides ?? {}).filter(([, e]) => typeof e == "boolean"));
		return {
			expanded: n.expanded,
			overrides: r
		};
	} catch {
		return {
			expanded: !0,
			overrides: {}
		};
	}
}
function no(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/DecisionApp.svelte
var ro = /* @__PURE__ */ Y("<p role=\"status\"> </p>"), io = /* @__PURE__ */ Y("<article class=\"checklist-item\"><a> </a> <p> </p></article>"), ao = /* @__PURE__ */ Y("<p>尚未建立決策文件。</p>"), oo = /* @__PURE__ */ Y("<p> </p> <!> <!>", 1), so = /* @__PURE__ */ Y("<button class=\"svelte-17meywc\"> </button>"), co = /* @__PURE__ */ Y("<p>目前沒有符合條件的決策項目。</p>"), lo = /* @__PURE__ */ Y("<p class=\"decision-text svelte-17meywc\"> </p>"), uo = /* @__PURE__ */ Y("<p> </p>"), fo = /* @__PURE__ */ Y("<div class=\"decision-description svelte-17meywc\"><!> <!></div>"), po = /* @__PURE__ */ Y("<small class=\"svelte-17meywc\"> </small>"), mo = /* @__PURE__ */ Y("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/> <span class=\"svelte-17meywc\"> <!></span></label>"), ho = /* @__PURE__ */ Y("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/><span class=\"svelte-17meywc\">其他</span></label> <div class=\"decision-other svelte-17meywc\"><label>其他方案與理由</label><textarea class=\"svelte-17meywc\"></textarea></div>", 1), go = /* @__PURE__ */ Y("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">已核對最新題目，套用選擇</button>", 1), _o = /* @__PURE__ */ Y("<button class=\"svelte-17meywc\">重試保存</button>"), vo = /* @__PURE__ */ Y("<div class=\"decision-content svelte-17meywc\"><!> <fieldset class=\"svelte-17meywc\"><legend class=\"decision-visually-hidden svelte-17meywc\"> </legend> <!> <!></fieldset> <!> <div class=\"decision-actions svelte-17meywc\"><!></div></div>"), yo = /* @__PURE__ */ Y("<header slot=\"header\" class=\"checklist-item-header svelte-17meywc\"><h2 tabindex=\"-1\" class=\"svelte-17meywc\"> </h2><span class=\"checklist-status\"> </span></header>"), bo = /* @__PURE__ */ Y("<article><!></article>"), xo = /* @__PURE__ */ Y("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">關閉已移除題目提示</button>", 1), So = /* @__PURE__ */ Y("<div class=\"decision-overview svelte-17meywc\"><p class=\"svelte-17meywc\"> </p> <p class=\"svelte-17meywc\">選項可隨時修改；「其他」文字一更動就自動保存，空白則為待決策。保存失敗會保留修改供重試。</p></div> <div class=\"decision-controls svelte-17meywc\"><button class=\"svelte-17meywc\">下一項待決策</button> <button class=\"svelte-17meywc\">清除全部答案</button></div> <!> <!> <!> <!>", 1), Co = /* @__PURE__ */ Y("<p> </p> <p>此操作無法復原。</p> <form class=\"theme-dialog-actions\"><button type=\"button\" class=\"secondary-button svelte-17meywc\">取消</button> <button type=\"submit\" class=\"primary-button svelte-17meywc\">確認清除全部</button></form>", 1), wo = /* @__PURE__ */ Y("<!> <main class=\"checklist-shell decisions-shell svelte-17meywc\"><header class=\"checklist-header\"><h1>決策項目</h1> <!></header> <!> <!></main> <!>", 1);
function To(e, t) {
	Ve(t, !1);
	let n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = /* @__PURE__ */ R(), a = /* @__PURE__ */ R(), o = /* @__PURE__ */ R(), s = $(t, "transport", 8), c = $(t, "onPersistenceChange", 8, () => {}), l = /* @__PURE__ */ R(), u = /* @__PURE__ */ R(), d = /* @__PURE__ */ R(), f = /* @__PURE__ */ R("載入中…"), p = /* @__PURE__ */ R(!0), m = /* @__PURE__ */ R({}), g = /* @__PURE__ */ R(), _ = /* @__PURE__ */ R(ba(["pending", "decided"])), v = null;
	function y(e) {
		z(_, e), Sa(v, G(_));
	}
	let b = /* @__PURE__ */ R(), x = /* @__PURE__ */ R(), S = /* @__PURE__ */ R(/* @__PURE__ */ new Set()), C = /* @__PURE__ */ R(!1), w = /* @__PURE__ */ R(!1), T = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ R(null), D = /* @__PURE__ */ R(null), ee = /* @__PURE__ */ R();
	function O() {
		z(E, null), z(D, null);
	}
	function k(e) {
		let t = e.target?.closest?.(".arrangeable-card");
		if (!t || !G(ee)?.contains(t)) {
			O();
			return;
		}
		let n = t.dataset.cardId;
		if (G(E) === n) return;
		z(E, n);
		let r = G(i).filter((e) => G(_).selected.has(e.status) || e.id === n);
		z(D, G(g)?.orderedIds(r) ?? r.map((e) => e.id));
	}
	function A() {
		z(x, {
			mode: G(b).mode,
			custom: G(b).custom,
			systemScheme: G(b).systemScheme
		});
	}
	let j = () => {
		z(u, G(l).view());
	}, te = (e, t) => {
		G(l).edit(e, t), j();
	}, ne = (e) => {
		if (T.add(e), z(S, new Set([...G(S)].filter((t) => t !== e))), G(C)) return;
		let t = G(l).saveOperation(e);
		if (t) return ce(e, t);
	};
	function re(e, t) {
		let n = G(l).select(e, t);
		return j(), ne(e), n;
	}
	function ie(e, t) {
		te(e, {
			choice: "__other",
			other: t
		}), ne(e);
	}
	function ae(e, t) {
		z(m, {
			...G(m),
			[e]: t
		}), no(G(o), G(p), G(m));
	}
	function oe(e) {
		z(p, e), z(m, {}), no(G(o), G(p), G(m));
	}
	async function se() {
		try {
			let e = await s().load();
			if (!e.ok) throw Error(e.error.message);
			if (e.files) {
				z(d, e), z(f, "");
				return;
			}
			z(l, eo(e)), j(), v = `taskprogress.filters.decisions.v1:${e.document_key}`, z(_, xa(v, ["pending", "decided"]));
			let t = to(`taskprogress.decisions:${e.document_key}`);
			z(p, t.expanded), z(m, t.overrides), z(f, "");
		} catch (e) {
			z(f, e.message);
		}
	}
	ki(() => {
		z(b, Xa()), A(), se();
		let e = (e) => {
			G(a) && (e.preventDefault(), e.returnValue = "");
		};
		return window.addEventListener("beforeunload", e), document.addEventListener("pointerdown", k, !0), document.addEventListener("focusin", k, !0), window.addEventListener("blur", O), () => {
			window.removeEventListener("beforeunload", e), document.removeEventListener("pointerdown", k, !0), document.removeEventListener("focusin", k, !0), window.removeEventListener("blur", O), G(b)?.destroy?.();
		};
	});
	async function ce(e, t = "confirm", n = !1) {
		try {
			let r = n ? G(l).retry() : t === "clear_all" ? G(l).beginClearAll() : G(l).begin(e, t);
			n || T.delete(r.decision_id), j(), z(f, "保存中…");
			let i;
			try {
				i = await s().request(r);
			} catch (e) {
				G(l).failed(), j(), z(f, `尚未收到操作結果：${e.message}。請查詢／重送同一筆操作；這不會復原舊答案。`);
				return;
			}
			if (G(l).complete(i), j(), z(f, i.ok ? i.status === "already_applied" ? "原操作已完成；以下顯示目前最新狀態。" : r.operation === "clear_all" ? "已清除全部答案與理由，以下顯示最新狀態。" : "已保存；以下顯示最新狀態。" : i.error.message), !i.ok) {
				T.delete(r.decision_id), z(S, /* @__PURE__ */ new Set([...G(S), r.decision_id])), z(C, !0);
				try {
					let e = await s().load();
					e.ok && (G(l).merge(e), j());
				} catch (e) {
					z(f, e.message);
				} finally {
					z(C, !1);
				}
			}
			if (r.operation === "clear_all") {
				i.ok && (T.clear(), z(S, /* @__PURE__ */ new Set()), O());
				return;
			}
			let a = [...T].find((e) => !G(S).has(e) && G(l).saveOperation(e));
			a && await ce(a, G(l).saveOperation(a));
		} catch (e) {
			z(f, e.message);
		}
	}
	async function ue() {
		let e = G(i).find((e) => e.status === "pending");
		e && (G(_).selected.has("pending") || y(wa(G(_), "pending")), ae(e.id, !0), await mr(), G(g)?.revealCard(e.id), await mr(), document.getElementById(`decision-${e.id}`)?.focus());
	}
	Dn(() => G(u), () => {
		z(i, G(u)?.snapshot.document.decisions ?? []);
	}), Dn(() => (G(u), G(C), G(i)), () => {
		z(n, !!G(u) && !G(u).pending && !G(u).busy && !G(C) && (G(i).some((e) => e.answer) || G(u).dirty));
	}), Dn(() => (G(i), G(D), G(_)), () => {
		z(r, G(i).filter((e) => G(D) ? G(D).includes(e.id) : G(_).selected.has(e.status)));
	}), Dn(() => G(u), () => {
		z(a, !!G(u)?.dirty || !!G(u)?.pending);
	}), Dn(() => (q(c()), G(a), G(u), G(w), G(C)), () => {
		c()({
			dirty: G(a),
			saving: !!G(u)?.busy,
			pending: !!G(u)?.pending || G(w) || G(C)
		});
	}), Dn(() => G(u), () => {
		z(o, G(u) ? `taskprogress.decisions:${G(u).snapshot.document_key}` : null);
	}), On(), Di();
	var de = wo(), fe = fn(de);
	sa(fe, {});
	var pe = V(fe, 2), me = B(pe), he = V(B(me), 2), ge = (e) => {
		Ya(e, {
			get mode() {
				return G(x), K(() => G(x).mode);
			},
			get custom() {
				return G(x), K(() => G(x).custom);
			},
			get systemScheme() {
				return G(x), K(() => G(x).systemScheme);
			},
			onModeChange: (e) => {
				G(b).setMode(e), A();
			},
			onApplyCustom: (e) => {
				G(b).applyCustom(e), A();
			}
		});
	};
	Br(he, (e) => {
		G(x) && e(ge);
	}), P(me);
	var _e = V(me, 2), ve = (e) => {
		var t = ro(), n = B(t, !0);
		P(t), H(() => Z(n, G(f))), X(e, t);
	};
	Br(_e, (e) => {
		G(f) && e(ve);
	});
	var ye = V(_e, 2), be = (e) => {
		var t = oo(), n = fn(t), r = B(n);
		P(n);
		var i = V(n, 2);
		Gr(i, 1, () => (G(d), K(() => G(d).files)), Vr, (e, t) => {
			var n = io(), r = B(n), i = B(r, !0);
			P(r);
			var a = V(r, 2), o = B(a, !0);
			P(a), P(n), H((e) => {
				Q(r, "href", e), Z(i, (G(t), K(() => G(t).task_id))), Z(o, (G(t), K(() => G(t).error ?? `待決策 ${G(t).pending}／全部 ${G(t).total}`)));
			}, [() => (G(d), G(t), K(() => `?scope=${encodeURIComponent(G(d).scope_id)}&task=${encodeURIComponent(G(t).task_id)}`))]), X(e, n);
		});
		var a = V(i, 2), o = (e) => {
			X(e, ao());
		};
		Br(a, (e) => {
			G(d), K(() => !G(d).files.length) && e(o);
		}), H(() => Z(r, `待決策 ${G(d), K(() => G(d).pending) ?? ""}${G(d), K(() => G(d).incomplete ? "（統計不完整）" : "") ?? ""}`)), X(e, t);
	}, xe = (e) => {
		var t = So(), a = fn(t), s = B(a), c = B(s);
		P(s), Me(2), P(a);
		var d = V(a, 2), f = B(d), v = V(f, 2);
		P(d);
		var b = V(d, 2), x = (e) => {
			var t = so(), n = B(t, !0);
			P(t), H(() => Z(n, (G(u), K(() => G(u).pending.operation === "clear_all" ? "查詢／重送清除操作" : "查詢／重送保存操作")))), J("click", t, () => ce(null, null, !0)), X(e, t);
		};
		Br(b, (e) => {
			G(u), K(() => G(u).pending && !G(u).busy) && e(x);
		});
		var T = V(b, 2), ee = (e) => {
			X(e, co());
		};
		Br(T, (e) => {
			G(r), K(() => !G(r).length) && e(ee);
		});
		var O = V(T, 2);
		{
			let e = /* @__PURE__ */ I(() => (G(r), K(() => G(r).map((e) => ({
				...e,
				title: e.question
			}))))), t = /* @__PURE__ */ I(() => (G(i), K(() => G(i).map((e) => e.id))));
			Ei(aa(O, {
				get items() {
					return G(e);
				},
				get allIds() {
					return G(t);
				},
				get storageKey() {
					return G(o);
				},
				get heldOrder() {
					return G(D);
				},
				get expanded() {
					return G(p);
				},
				onToggleAll: oe,
				children: le,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ I(() => t.item), r = /* @__PURE__ */ I(() => t.visibilityEnabled), i = /* @__PURE__ */ I(() => t.visible), a = /* @__PURE__ */ I(() => t.onVisibleChange), o = /* @__PURE__ */ I(() => (G(u), q(G(n)), K(() => Object.hasOwn(G(u).drafts, G(n).id) ? G(u).drafts[G(n).id] : null))), s = /* @__PURE__ */ I(() => (q(G(o)), q(G(n)), K(() => G(o) ? G(o).choice : G(n).answer?.kind === "other" ? "__other" : G(n).answer?.option_id ?? "")));
						var c = bo();
						let d;
						var f = B(c);
						{
							let e = /* @__PURE__ */ I(() => (G(m), q(G(n)), G(p), K(() => G(m)[G(n).id] ?? G(p)))), t = /* @__PURE__ */ I(() => (q(G(n)), K(() => `body-${G(n).id}`)));
							fa(f, {
								get visibilityEnabled() {
									return G(r);
								},
								get visible() {
									return G(i);
								},
								get onVisibleChange() {
									return G(a);
								},
								get expanded() {
									return G(e);
								},
								onToggle: (e) => ae(G(n).id, e),
								get contentId() {
									return G(t);
								},
								get label() {
									return q(G(n)), K(() => G(n).question);
								},
								children: (e, t) => {
									var r = vo(), i = B(r), a = (e) => {
										var t = fo(), r = B(t), i = (e) => {
											var t = lo(), r = B(t, !0);
											P(t), H(() => Z(r, (q(G(n)), K(() => G(n).context)))), X(e, t);
										};
										Br(r, (e) => {
											q(G(n)), K(() => G(n).context) && e(i);
										});
										var a = V(r, 2), o = (e) => {
											var t = uo(), r = B(t);
											P(t), H((e) => Z(r, `建議：${e ?? ""} — ${q(G(n)), K(() => G(n).recommendation.reason) ?? ""}`), [() => (q(G(n)), K(() => G(n).options.find((e) => e.id === G(n).recommendation.option_id)?.label))]), X(e, t);
										};
										Br(a, (e) => {
											q(G(n)), K(() => G(n).recommendation) && e(o);
										}), P(t), X(e, t);
									};
									Br(i, (e) => {
										q(G(n)), K(() => G(n).context || G(n).recommendation) && e(a);
									});
									var c = V(i, 2), d = B(c), f = B(d, !0);
									P(d);
									var p = V(d, 2);
									Gr(p, 1, () => (q(G(n)), K(() => G(n).options)), Vr, (e, t, r) => {
										var i = mo(), a = B(i);
										vi(a);
										var o = V(a, 2), c = B(o), l = V(c), u = (e) => {
											var n = po(), r = B(n, !0);
											P(n), H(() => Z(r, (G(t), K(() => G(t).description)))), X(e, n);
										};
										Br(l, (e) => {
											G(t), K(() => G(t).description) && e(u);
										}), P(o), P(i), H((e) => {
											Q(a, "name", (q(G(n)), K(() => `answer-${G(n).id}`))), bi(a, (q(G(s)), G(t), K(() => G(s) === G(t).id))), Z(c, `${e ?? ""}　${G(t), K(() => G(t).label) ?? ""}${G(t), q(G(n)), K(() => G(t).id === G(n).recommendation?.option_id ? "（建議）" : "") ?? ""} `);
										}, [() => K(() => String.fromCharCode(65 + r))]), J("click", a, (e) => {
											e.currentTarget.checked = re(G(n).id, G(t).id) === G(t).id;
										}), X(e, i);
									});
									var m = V(p, 2), h = (e) => {
										var t = ho(), r = fn(t), i = B(r);
										vi(i), Me(), P(r);
										var a = V(r, 2), c = B(a), l = V(c);
										rt(l), P(a), H(() => {
											Q(i, "name", (q(G(n)), K(() => `answer-${G(n).id}`))), bi(i, G(s) === "__other"), Q(c, "for", (q(G(n)), K(() => `other-${G(n).id}`))), Q(l, "id", (q(G(n)), K(() => `other-${G(n).id}`))), yi(l, (q(G(o)), q(G(n)), K(() => G(o) ? G(o).other : G(n).answer?.kind === "other" ? G(n).answer.text : "")));
										}), J("click", i, async (e) => {
											let t = re(G(n).id, "__other");
											e.currentTarget.checked = t === "__other", await mr(), t === "__other" && G(E) === G(n).id && document.getElementById(`other-${G(n).id}`)?.focus();
										}), J("input", l, (e) => ie(G(n).id, e.currentTarget.value)), X(e, t);
									};
									Br(m, (e) => {
										q(G(n)), K(() => G(n).allow_other) && e(h);
									}), P(c);
									var g = V(c, 2), _ = (e) => {
										var t = go(), r = fn(t), i = B(r);
										P(r);
										var a = V(r, 2);
										H(() => {
											Z(i, `此題已變更，原草稿保留：${q(G(o)), K(() => G(o).choice) ?? ""} ${q(G(o)), K(() => G(o).other) ?? ""}`), a.disabled = (G(C), G(u), K(() => G(C) || !!G(u).pending));
										}), J("click", a, () => {
											G(l).rebase(G(n).id), j(), ne(G(n).id);
										}), X(e, t);
									};
									Br(g, (e) => {
										q(G(o)), K(() => G(o)?.conflict) && e(_);
									});
									var v = V(g, 2), y = B(v), b = (e) => {
										var t = _o();
										H(() => t.disabled = G(C)), J("click", t, () => ne(G(n).id)), X(e, t);
									}, x = /* @__PURE__ */ yt(() => (G(S), q(G(n)), q(G(o)), G(u), K(() => G(S).has(G(n).id) && G(o) && !G(o).conflict && !G(u).pending)));
									Br(y, (e) => {
										G(x) && e(b);
									}), P(v), P(r), H(() => {
										c.disabled = (G(C), G(u), q(G(o)), K(() => G(C) || G(u).pending?.operation === "clear_all" || !!G(u).pending && !G(u).busy || G(o)?.conflict)), Z(f, (q(G(n)), K(() => G(n).question)));
									}), X(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = yo(), i = B(r), a = B(i, !0);
										P(i);
										var o = V(i), s = B(o, !0);
										P(o), P(r), H(() => {
											Q(i, "id", (q(G(n)), K(() => `decision-${G(n).id}`))), Z(a, (q(G(n)), K(() => G(n).question))), Z(s, (q(G(n)), K(() => G(n).status === "pending" ? "待決策" : "已決策")));
										}), X(e, r);
									}
								}
							});
						}
						P(c), H(() => d = si(c, 1, "checklist-item decision-card svelte-17meywc", null, d, { "decision-has-visibility": G(r) })), X(e, c);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ I(() => [
								va,
								"pending",
								"decided"
							]), n = /* @__PURE__ */ I(() => (q(Ca), G(_), K(() => Ca(G(_)))));
							Ea(e, {
								categories: [{
									id: "pending",
									label: "待決策"
								}, {
									id: "decided",
									label: "已決策"
								}],
								get order() {
									return G(t);
								},
								get selected() {
									return G(_), K(() => G(_).selected);
								},
								get defaultLit() {
									return G(n);
								},
								defaultLabel: "全部",
								onSelect: (e) => y(wa(G(_), e)),
								onSelectDefault: () => y(Ta(G(_)))
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => z(g, e), () => G(g));
		}
		Gr(V(O, 2), 1, () => (G(u), G(i), K(() => Object.entries(G(u).drafts).filter(([e]) => !G(i).some((t) => t.id === e)))), Vr, (e, t) => {
			var n = /* @__PURE__ */ yt(() => h(G(t), 2));
			let r = () => G(n)[0], i = () => G(n)[1];
			var a = xo(), o = fn(a), s = B(o);
			P(o);
			var c = V(o, 2);
			H(() => Z(s, `已移除題目 ${r() ?? ""} 的原草稿：${i(), K(() => i().choice) ?? ""} ${i(), K(() => i().other) ?? ""}`)), J("click", c, () => {
				G(l).discard(r()), j();
			}), X(e, a);
		}), H((e, t) => {
			Z(c, `待決策 ${e ?? ""}／全部 ${G(i), K(() => G(i).length) ?? ""}`), f.disabled = t, v.disabled = !G(n);
		}, [() => (G(i), K(() => G(i).filter((e) => e.status === "pending").length)), () => (G(i), K(() => !G(i).some((e) => e.status === "pending")))]), J("click", f, ue), J("click", v, () => {
			G(n) && z(w, !0);
		}), X(e, t);
	};
	Br(ye, (e) => {
		G(d) ? e(be) : G(u) && e(xe, 1);
	}), P(pe), Ei(pe, (e) => z(ee, e), () => G(ee)), la(V(pe, 2), {
		get open() {
			return G(w);
		},
		title: "清除全部決策答案？",
		titleId: "decision-clear-title",
		kicker: "決策項目",
		onClose: () => {
			z(w, !1);
		},
		children: le,
		$$slots: { default: (e, t) => {
			let r = /* @__PURE__ */ I(() => t.close);
			var a = Co(), o = fn(a), s = B(o);
			P(o);
			var c = V(o, 4), l = B(c), d = V(l, 2);
			P(c), H(() => {
				Z(s, `將清除目前文件「${G(u), K(() => G(u)?.snapshot.document.task_id) ?? ""}」全部 ${G(i), K(() => G(i).length) ?? ""} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。`), d.disabled = !G(n);
			}), wr("submit", c, (e) => {
				e.preventDefault(), G(n) && (G(r)(), ce(null, "clear_all"));
			}), J("click", l, function(...e) {
				G(r)?.apply(this, e);
			}), X(e, a);
		} }
	}), X(e, de), He();
}
Tr(["click", "input"]);
//#endregion
//#region viewer/assets/decision-transport.js
var Eo = (e) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(e ?? "") && e.length <= 100;
function Do(e, t) {
	if (!Eo(e) || t && !Eo(t)) throw Error("無效的 scope 或 task。");
	let n = `/__taskprogress/v1/decisions/${encodeURIComponent(e)}`;
	async function r(e, t) {
		let n = await fetch(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-TaskProgress-Editor": "1"
			},
			body: JSON.stringify(t)
		});
		if (!n.ok) {
			let e = await n.text(), r;
			try {
				r = JSON.parse(e);
			} catch {}
			if (n.status >= 400 && n.status < 500 && [
				"browser_origin_forbidden",
				"unsupported_media_type",
				"request_too_large",
				"invalid_operation",
				"task_not_found",
				"task_mismatch"
			].includes(r?.code) && r.type === `https://task-progress.local/problems/${r.code}`) return {
				ok: !1,
				request_id: t.request_id,
				error: {
					code: r.code,
					message: r.code === "invalid_operation" ? "服務版本不支援此操作，請更新並重啟 TaskProgress 服務後再試。此次請求未修改資料。" : `操作被拒絕，未修改資料：${r.title ?? r.code}`
				}
			};
			throw Error(`決策服務錯誤 ${n.status}：${e}`);
		}
		return n.json();
	}
	return {
		load: () => t ? r(`${n}/${encodeURIComponent(t)}`, { operation: "load" }) : r(n, {}),
		request: (e) => r(`${n}/${encodeURIComponent(t)}`, e)
	};
}
function Oo(e) {
	let t = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let n = t.get(e.data.request_id);
		n && (clearTimeout(n.timer), t.delete(e.data.request_id), n.resolve(e.data));
	});
	function n(n) {
		let r = {
			...n,
			request_id: n.request_id ?? crypto.randomUUID()
		};
		return new Promise((n, i) => {
			let a = setTimeout(() => {
				t.delete(r.request_id), i(/* @__PURE__ */ Error("回應逾時，結果未確認。"));
			}, 3e4);
			t.set(r.request_id, {
				resolve: n,
				timer: a
			}), e.postMessage(r);
		});
	}
	return {
		load: () => n({ operation: "load" }),
		request: n
	};
}
//#endregion
//#region viewer/assets/foreground-refresh.js
function ko(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function Ao({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (ko(e, "windowTarget"), ko(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
	if (typeof r != "function") throw TypeError("reload 必須是函式。");
	if (typeof i != "function") throw TypeError("schedule 必須是函式。");
	let a = !1, o = !1, s = !1, c = !1;
	function l() {
		c || s || (a = !0);
	}
	function u() {
		o = !1, !(c || s || !a) && (a = !1, n() === !0 && (s = !0, r()));
	}
	function d() {
		c || s || o || !a || (o = !0, i(u));
	}
	function f() {
		t.visibilityState === "hidden" ? l() : t.visibilityState === "visible" && d();
	}
	return e.addEventListener("blur", l), e.addEventListener("focus", d), t.addEventListener("visibilitychange", f), function() {
		c || (c = !0, a = !1, e.removeEventListener("blur", l), e.removeEventListener("focus", d), t.removeEventListener("visibilitychange", f));
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/decisions-main.js
var jo, Mo;
try {
	let e = new URLSearchParams(location.search);
	Mo = window.chrome?.webview ? Oo(window.chrome.webview) : Do(e.get("scope"), e.get("task"));
} catch (e) {
	Mo = { load: () => Promise.reject(e) };
}
window.chrome?.webview || Ao({ canRefresh: () => !jo?.dirty && !jo?.saving && !jo?.pending }), Fr(To, {
	target: document.querySelector("#app"),
	props: {
		transport: Mo,
		onPersistenceChange: (e) => jo = e
	}
});
//#endregion
