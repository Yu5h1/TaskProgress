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
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, C = 65536, w = 1 << 19, T = 1 << 20, ee = 1 << 25, E = 65536, te = 1 << 21, D = 1 << 22, O = 1 << 23, k = Symbol("$state"), A = Symbol("legacy props"), ne = Symbol(""), re = Symbol("attributes"), ie = Symbol("class"), ae = Symbol("style"), oe = Symbol("text"), se = Symbol("form reset"), ce = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), le = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function ue() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function de(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function fe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function pe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function me(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function he() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ge(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function _e() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ve(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ye() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function be() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function xe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Se() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var Ce = {}, we = Symbol("uninitialized"), Te = "http://www.w3.org/1999/xhtml";
function Ee() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function De(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Oe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ke() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var j = !1;
function Ae(e) {
	j = e;
}
var M;
function je(e) {
	if (e === null) throw De(), Ce;
	return M = e;
}
function Me() {
	return je(/* @__PURE__ */ fn(M));
}
function N(e) {
	if (j) {
		if (/* @__PURE__ */ fn(M) !== null) throw De(), Ce;
		M = e;
	}
}
function Ne(e = 1) {
	if (j) {
		for (var t = e, n = M; t--;) n = /* @__PURE__ */ fn(n);
		M = n;
	}
}
function Pe(e = !0) {
	for (var t = 0, n = M;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ fn(n);
		e && n.remove(), n = i;
	}
}
function Fe(e) {
	if (!e || e.nodeType !== 8) throw De(), Ce;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ie(e) {
	return e === this.v;
}
function Le(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Re(e) {
	return !Le(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var ze = !1;
function Be() {
	ze = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var P = null;
function Ve(e) {
	P = e;
}
function He(e, t = !1, n) {
	P = {
		p: P,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: ze && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ue(e) {
	var t = P, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) wn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, P = t.p, e ?? {};
}
function We() {
	return !ze || P !== null && P.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ge = [];
function Ke() {
	var e = Ge;
	Ge = [], p(e);
}
function qe(e) {
	if (Ge.length === 0 && !At) {
		var t = Ge;
		queueMicrotask(() => {
			t === Ge && Ke();
		});
	}
	Ge.push(e);
}
function Je() {
	for (; Ge.length > 0;) Ke();
}
function Ye(e) {
	var t = U;
	if (t === null) return H.f |= O, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Xe(e, t);
}
function Xe(e, t) {
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
var Ze = ~(_ | v | g);
function Qe(e, t) {
	e.f = e.f & Ze | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? Qe(e, g) : Qe(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= E, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), Qe(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var nt = !1;
function rt(e) {
	var t = nt;
	try {
		return nt = !1, [e(), nt];
	} finally {
		nt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function it(e) {
	j && /* @__PURE__ */ dn(e) !== null && mn(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[se]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = H, n = U;
	Xn(null), Zn(null);
	try {
		return e();
	} finally {
		Xn(t), Zn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[se];
	e[se] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = qt(0), r;
	return () => {
		xn() && (W(n), jn(() => (t === 0 && (r = G(() => e(() => Qt(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ut = C | w;
function dt(e, t, n, r) {
	new ft(e, t, n, r);
}
var ft = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = j ? M : null;
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
	#h = lt(() => (this.#m = qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Mn(() => {
			if (j) {
				let e = this.#t;
				Me();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), j && (this.#e = M);
	}
	#g() {
		try {
			this.#a = Nn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		qe(r), t && (this.#s = Nn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				ke();
				return;
			}
			t = !0, n && Se(), this.#s !== null && Bn(this.#s, () => {
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
					Xe(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Nn(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = un();
			e.append(t), this.#a = this.#S(() => Nn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(I));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Nn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Wn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Nn(() => t(this.#e));
			} else this.#x(I);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = U, n = H, r = P;
		Zn(this.#i), Xn(this.#i), Ve(this.#i.ctx);
		try {
			return It.ensure(), e();
		} catch (e) {
			return Ye(e), null;
		} finally {
			Zn(t), Xn(n), Ve(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Bn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && Xt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), W(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		I?.is_fork ? (this.#a && I.skip_effect(this.#a), this.#o && I.skip_effect(this.#o), this.#s && I.skip_effect(this.#s), I.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Ln(this.#a), null), this.#o &&= (Ln(this.#o), null), this.#s &&= (Ln(this.#s), null), j && (je(this.#t), Ne(), je(Pe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Nn(() => {
						var r = U;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Xe(e, this.#i.parent), null;
				}
			}));
		};
		qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Xe(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Xe(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function pt(e, t, n, r) {
	let i = We() ? _t : F;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = mt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Xe(e, s);
			}
			ht();
		}
	}
	var d = gt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ yt(e))).then(u).catch((e) => Xe(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ht();
	}) : f();
}
function mt() {
	var e = U, t = H, n = P, r = I;
	return function(i = !0) {
		Zn(e), Xn(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Zn(null), Xn(null), Ve(null), e && I?.deactivate();
}
function gt() {
	var e = U, t = e.b, n = I, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | _;
	return U !== null && (U.f |= w), {
		ctx: P,
		deps: null,
		effects: null,
		equals: Ie,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: we,
		wv: 0,
		parent: U,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = U;
	r === null && fe();
	var i = void 0, a = qt(we), o = !H, s = /* @__PURE__ */ new Set();
	return An(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ce && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = I;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= O, Xt(a, t)) : (a.f & 8388608 && (a.f ^= O), Xt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Sn(() => {
		for (let e of s) e.reject(vt);
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
function bt(e) {
	let t = /* @__PURE__ */ _t(e);
	return $n(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function F(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = Re, t;
}
function xt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Ln(t[n]);
	}
}
function St(e) {
	var t, n = U, r = e.parent;
	if (!qn && r !== null && e.v !== we && r.f & 24576) return Ee(), e.v;
	Zn(r);
	try {
		e.f &= ~E, xt(e), t = dr(e);
	} finally {
		Zn(n);
	}
	return t;
}
function Ct(e) {
	var t = St(e);
	if (!e.equals(t) && (e.wv = cr(), (!I?.is_fork || e.deps === null) && (I === null ? e.v = t : (I.capture(e, t, !0), Dt?.capture(e, t, !0)), e.deps === null))) {
		Qe(e, g);
		return;
	}
	qn || (Ot === null ? $e(e) : (xn() || I?.is_fork) && Ot.set(e, t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ce), t.ac = null;
	}), t.fn !== null && (t.teardown = d), pr(t, 0), Fn(t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && mr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Et = null, I = null, Dt = null, Ot = null, kt = null, At = !1, jt = !1, Mt = null, Nt = null, Pt = 0, Ft = 1, It = class e {
	id = Ft++;
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
		Et === null ? Et = this : (Et.#n = this, this.#t = Et), Et = this;
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
			for (var r of n.d) Qe(r, _), t(r);
			for (r of n.m) Qe(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Pt++ > 1e3 && (this.#x(), Rt());
		for (let e of this.#u) this.#d.delete(e), Qe(e, _), this.schedule(e);
		for (let e of this.#d) Qe(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Mt = [], r = [], i = Nt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ut(e), this.#h() || this.discard(), t;
		}
		if (I = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Mt = null, Nt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ht(e, t);
			i.length > 0 && I.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Dt = this, Bt(r), Bt(n), Dt = null, this.#s?.resolve();
		var s = I;
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
				a ? r.f ^= g : i & 4 ? t.push(r) : lr(r) && (i & 16 && this.#d.add(r), mr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), Qe(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), I = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== we && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ot?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		I = this;
	}
	deactivate() {
		I = null, Ot = null;
	}
	flush() {
		try {
			jt = !0, I = this, this.#g();
		} finally {
			Pt = 0, kt = null, Mt = null, Nt = null, jt = !1, I = null, Ot = null, Gt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(vt);
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
		this.#m || (this.#m = !0, qe(() => {
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
		if (I === null) {
			let t = I = new e();
			!jt && !At && qe(() => {
				t.#e || t.flush();
			});
		}
		return I;
	}
	apply() {
		Ot = null;
	}
	schedule(e) {
		if (kt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Mt !== null && t === U && (H === null || !(H.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Et = e : t.#t = e, this.linked = !1;
		}
	}
};
function Lt(e) {
	var t = At;
	At = !0;
	try {
		var n;
		for (e && (I !== null && !I.is_fork && I.flush(), n = e());;) {
			if (Je(), I === null) return n;
			I.flush();
		}
	} finally {
		At = t;
	}
}
function Rt() {
	try {
		_e();
	} catch (e) {
		Xe(e, kt);
	}
}
var zt = null;
function Bt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && lr(r) && (zt = /* @__PURE__ */ new Set(), mr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), zt?.size > 0)) {
				Gt.clear();
				for (let e of zt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) zt.has(n) && (zt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || mr(n);
					}
				}
				zt.clear();
			}
		}
		zt = null;
	}
}
function Vt(e) {
	I.schedule(e);
}
function Ht(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), Qe(e, g);
		for (var n = e.first; n !== null;) Ht(n, t), n = n.next;
	}
}
function Ut(e) {
	Qe(e, g);
	for (var t = e.first; t !== null;) Ut(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Wt = /* @__PURE__ */ new Set(), Gt = /* @__PURE__ */ new Map(), Kt = !1;
function qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ie,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Jt(e, t) {
	let n = qt(e, t);
	return $n(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function L(e, t = !1, n = !0) {
	let r = qt(e);
	return t || (r.equals = Re), ze && n && P !== null && P.l !== null && (P.l.s ??= []).push(r), r;
}
function Yt(e, t) {
	return R(e, G(() => W(e))), t;
}
function R(e, t, n = !1) {
	return H !== null && (!Yn || H.f & 131072) && We() && H.f & 4325394 && (Qn === null || !Qn.has(e)) && xe(), Xt(e, n ? en(t) : t, Nt);
}
function Xt(e, t, n = null) {
	if (!e.equals(t)) {
		Gt.set(e, qn ? t : e.v);
		var r = It.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && St(t), Ot === null && $e(t);
		}
		e.wv = cr(), $t(e, _, n), We() && U !== null && U.f & 1024 && !(U.f & 96) && (nr === null ? rr([e]) : nr.push(e)), !r.is_fork && Wt.size > 0 && !Kt && Zt();
	}
	return t;
}
function Zt() {
	Kt = !1;
	for (let e of Wt) {
		e.f & 1024 && Qe(e, v);
		let t;
		try {
			t = lr(e);
		} catch {
			t = !0;
		}
		t && mr(e);
	}
	Wt.clear();
}
function Qt(e) {
	R(e, e.v + 1);
}
function $t(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = We(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & _) === 0;
			if (l && Qe(s, t), c & 131072) Wt.add(s);
			else if (c & 2) {
				var u = s;
				Ot?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= E), $t(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && zt !== null && zt.add(d), n === null ? Vt(d) : n.push(d);
			}
		}
	}
}
function en(t) {
	if (typeof t != "object" || !t || k in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Jt(0), u = null, d = or, f = (e) => {
		if (or === d) return e();
		var t = H, n = or;
		Xn(null), sr(d);
		var r = e();
		return Xn(t), sr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Jt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ye();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Jt(n.value, u);
				return r.set(t, e), e;
			}) : R(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Jt(we, u));
					r.set(t, e), Qt(o);
				}
			} else R(n, we), Qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === k) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Jt(en(s ? e[n] : we), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === we ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = W(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== we) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === k) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== we || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Jt(i ? en(e[t]) : we, u)), r.set(t, n)), W(n) === we) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Jt(we, u)), r.set(d + "", p)) : R(p, we);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Jt(void 0, u)), R(c, en(n)), r.set(t, c));
			else {
				l = c.v !== we;
				var m = f(() => en(n));
				R(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && R(g, _ + 1);
				}
				Qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== we;
			});
			for (var [n, i] of r) i.v !== we && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			be();
		}
	});
}
function tn(e) {
	try {
		if (typeof e == "object" && e && k in e) return e[k];
	} catch {}
	return e;
}
function nn(e, t) {
	return Object.is(tn(e), tn(t));
}
var rn, an, on, sn, cn;
function ln() {
	if (rn === void 0) {
		rn = window, an = document, on = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		sn = a(t, "firstChild").get, cn = a(t, "nextSibling").get, u(e) && (e[ie] = void 0, e[re] = null, e[ae] = void 0, e.__e = void 0), u(n) && (n[oe] = void 0);
	}
}
function un(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function dn(e) {
	return sn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function fn(e) {
	return cn.call(e);
}
function z(e, t) {
	if (!j) return /* @__PURE__ */ dn(e);
	var n = /* @__PURE__ */ dn(M);
	if (n === null) n = M.appendChild(un());
	else if (t && n.nodeType !== 3) {
		var r = un();
		return n?.before(r), je(r), r;
	}
	return t && _n(n), je(n), n;
}
function pn(e, t = !1) {
	if (!j) {
		var n = /* @__PURE__ */ dn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ fn(n) : n;
	}
	if (t) {
		if (M?.nodeType !== 3) {
			var r = un();
			return M?.before(r), je(r), r;
		}
		_n(M);
	}
	return M;
}
function B(e, t = 1, n = !1) {
	let r = j ? M : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ fn(r);
	if (!j) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = un();
			return r === null ? i?.after(a) : r.before(a), je(a), a;
		}
		_n(r);
	}
	return je(r), r;
}
function mn(e) {
	e.textContent = "";
}
function hn() {
	return !1;
}
function gn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function _n(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function vn(e) {
	U === null && (H === null && ge(e), he()), qn && me(e);
}
function yn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function bn(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: P,
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
	I?.register_created_effect(r);
	var i = r;
	if (e & 4) Mt === null ? It.ensure().schedule(r) : Mt.push(r);
	else if (t !== null) {
		try {
			mr(r);
		} catch (e) {
			throw Ln(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && yn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function xn() {
	return H !== null && !Yn;
}
function Sn(e) {
	let t = bn(8, null);
	return Qe(t, g), t.teardown = e, t;
}
function Cn(e) {
	vn("$effect");
	var t = U.f;
	if (!H && t & 32 && P !== null && !P.i) {
		var n = P;
		(n.e ??= []).push(e);
	} else return wn(e);
}
function wn(e) {
	return bn(4 | T, e);
}
function Tn(e) {
	return vn("$effect.pre"), bn(8 | T, e);
}
function En(e) {
	It.ensure();
	let t = bn(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			Ln(t), n(void 0);
		}) : (Ln(t), n(void 0));
	});
}
function Dn(e) {
	return bn(4, e);
}
function On(e, t) {
	var n = P, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = jn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				Zn(n.parent), G(t);
			} finally {
				Zn(n);
			}
		}
	});
}
function kn() {
	var e = P;
	jn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && Qe(n, v), lr(n) && mr(n), t.ran = !1;
		}
	});
}
function An(e) {
	return bn(D | w, e);
}
function jn(e, t = 0) {
	return bn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		bn(8, () => {
			e(...t.map(W));
		});
	});
}
function Mn(e, t = 0) {
	return bn(16 | t, e);
}
function Nn(e) {
	return bn(32 | w, e);
}
function Pn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = qn, n = H;
		Jn(!0), Xn(null);
		try {
			t.call(null);
		} finally {
			Jn(e), Xn(n);
		}
	}
}
function Fn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ce);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Ln(n, t), n = r;
	}
}
function In(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Ln(t), t = n;
	}
}
function Ln(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, Fn(e, t && !n), pr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Pn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && zn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ fn(e);
		e.remove(), e = n;
	}
}
function zn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Bn(e, t, n = !0) {
	var r = [];
	Vn(e, r, !0);
	var i = () => {
		n && Ln(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Vn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Vn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Hn(e) {
	Un(e, !0);
}
function Un(e, t) {
	if (e.f & 8192) {
		e.f ^= y, e.f & 1024 || (Qe(e, _), It.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Un(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Wn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ fn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Gn = null, Kn = !1, qn = !1;
function Jn(e) {
	qn = e;
}
var H = null, Yn = !1;
function Xn(e) {
	H = e;
}
var U = null;
function Zn(e) {
	U = e;
}
var Qn = null;
function $n(e) {
	H !== null && (Qn ??= /* @__PURE__ */ new Set()).add(e);
}
var er = null, tr = 0, nr = null;
function rr(e) {
	nr = e;
}
var ir = 1, ar = 0, or = ar;
function sr(e) {
	or = e;
}
function cr() {
	return ++ir;
}
function lr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (lr(a) && Ct(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ot === null && Qe(e, g);
	}
	return !1;
}
function ur(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Qn !== null && Qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ur(a, t, !1) : t === a && (n ? Qe(a, _) : a.f & 1024 && Qe(a, v), Vt(a));
	}
}
function dr(e) {
	var t = er, n = tr, r = nr, i = H, a = Qn, o = P, s = Yn, c = or, l = e.f;
	er = null, tr = 0, nr = null, H = l & 96 ? null : e, Qn = null, Ve(e.ctx), Yn = !1, or = ++ar, e.ac !== null && (st(() => {
		e.ac.abort(ce);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= x;
		var f = e.deps, p = I?.is_fork;
		if (er !== null) {
			var m;
			if (p || pr(e, tr), f !== null && tr > 0) for (f.length = tr + er.length, m = 0; m < er.length; m++) f[tr + m] = er[m];
			else e.deps = f = er;
			if (xn() && e.f & 512) for (m = tr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && tr < f.length && (pr(e, tr), f.length = tr);
		if (We() && nr !== null && !Yn && f !== null && !(e.f & 6146)) for (m = 0; m < nr.length; m++) ur(nr[m], e);
		if (i !== null && i !== e) {
			if (ar++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ar;
			if (t !== null) for (let e of t) e.rv = ar;
			nr !== null && (r === null ? r = nr : r.push(...nr));
		}
		return e.f & 8388608 && (e.f ^= O), d;
	} catch (e) {
		return Ye(e);
	} finally {
		e.f ^= te, er = t, tr = n, nr = r, H = i, Qn = a, Ve(o), Yn = s, or = c;
	}
}
function fr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (er === null || !n.call(er, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== we && $e(s), s.ac !== null && st(() => {
			s.ac.abort(ce), s.ac = null, Qe(s, _);
		}), wt(s), pr(s, 0);
	}
}
function pr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) fr(e, n[r]);
}
function mr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		Qe(e, g);
		var n = U, r = Kn;
		U = e, Kn = !(t & 96);
		try {
			t & 16777232 ? In(e) : Fn(e), Pn(e);
			var i = dr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ir;
		} finally {
			Kn = r, U = n;
		}
	}
}
async function hr() {
	await Promise.resolve(), Lt();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), H !== null && !Yn && !(U !== null && U.f & 16384) && (Qn === null || !Qn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < ar && (e.rv = ar, er === null && r !== null && r[tr] === e ? tr++ : er === null ? er = [e] : er.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (qn && Gt.has(e)) return Gt.get(e);
	if (t) {
		var a = e;
		if (qn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || _r(a)) && (o = St(a)), Gt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Yn && H !== null && (Kn || !!(H.f & 512)), c = (a.f & x) === 0;
		lr(a) && (s && (a.f |= 512), Ct(a)), s && !c && (Tt(a), gr(a));
	}
	if (Ot?.has(e)) return Ot.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function gr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tt(t), gr(t));
}
function _r(e) {
	if (e.v === we) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Gt.has(t) || t.f & 2 && _r(t)) return !0;
	return !1;
}
function G(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (k in e) vr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && k in n && vr(n);
		}
	}
}
function vr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			vr(e[n], t);
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
var yr = ["touchstart", "touchmove"];
function br(e) {
	return yr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var xr = Symbol("events"), Sr = /* @__PURE__ */ new Set(), Cr = /* @__PURE__ */ new Set();
function wr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Or.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Tr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = wr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Sn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[xr] ??= {})[e] = n;
}
function Er(e) {
	for (var t = 0; t < e.length; t++) Sr.add(e[t]);
	for (var n of Cr) n(e);
}
var Dr = null;
function Or(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Dr = e;
	var s = 0, c = Dr === e && e[xr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[xr] = t;
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
		var d = H, f = U;
		Xn(null), Zn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[xr]?.[r];
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
			e[xr] = t, delete e.currentTarget, Xn(d), Zn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var kr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Ar(e) {
	return kr?.createHTML(e) ?? e;
}
function jr(e) {
	var t = gn("template");
	return t.innerHTML = Ar(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mr(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function J(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (j) return Mr(M, null), M;
		i === void 0 && (i = jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ dn(i)));
		var t = r || on ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ dn(t), s = t.lastChild;
			Mr(o, s);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (j) return Mr(M, null), M;
		if (!o) {
			var e = /* @__PURE__ */ dn(jr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ dn(e);) o.appendChild(/* @__PURE__ */ dn(e));
			else o = /* @__PURE__ */ dn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ dn(t), r = t.lastChild;
			Mr(n, r);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Pr(e, t) {
	return /* @__PURE__ */ Nr(e, t, "svg");
}
function Fr() {
	if (j) return Mr(M, null), M;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = un();
	return e.append(t, n), Mr(t, n), e;
}
function Y(e, t) {
	if (j) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = M), Me();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[oe] ??= e.nodeValue) && (e[oe] = n, e.nodeValue = `${n}`);
}
function Ir(e, t) {
	return Rr(e, t);
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	ln();
	var l = void 0, u = En(() => {
		var s = n ?? t.appendChild(un());
		dt(s, { pending: () => {} }, (t) => {
			He({});
			var n = P;
			if (o && (n.c = o), a && (i.$$events = a), j && Mr(t, null), l = e(t, i) || {}, j && (U.nodes.end = M, M === null || M.nodeType !== 8 || M.data !== "]")) throw De(), Ce;
			Ue();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = br(r);
					for (let e of [t, document]) {
						var a = Lr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Lr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Or, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(Sr)), Cr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Lr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Or), r.delete(e), r.size === 0 && Lr.delete(n)) : r.set(e, i);
			}
			Cr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return zr.set(l, u), l;
}
var zr = /* @__PURE__ */ new WeakMap(), Br = class {
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
			if (n) Hn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Hn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Ln(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Wn(r, t), t.append(un()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Ln(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Bn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Ln(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = I, r = hn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = un();
			i.append(a), this.#n.set(e, {
				effect: Nn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Nn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else j && (this.anchor = M), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	j && (r = M, Me());
	var i = new Br(e), a = n ? C : 0;
	function o(e, t) {
		if (j) {
			var n = Fe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Pe();
				je(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Mn(() => {
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
		Bn(n, () => {
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
			mn(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= ee, Wn(a, document.createDocumentFragment())) : Ln(t[i], n);
	}
}
var Wr;
function Gr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = j ? je(/* @__PURE__ */ dn(u)) : u.appendChild(un());
	}
	j && Me();
	var d = null, f = /* @__PURE__ */ F(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, qr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Yr(d, null, c)) : Hn(d) : Bn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Mn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			j && Fe(c) === "[!" != (e === 0) && (c = Pe(), je(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = I, v = hn(), y = 0; y < e; y += 1) {
				j && M.nodeType === 8 && M.data === "]" && (c = M, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Xt(S.v, b), S.i && Xt(S.i, y), v && u.unskip_effect(S.e)) : (S = Jr(l, h ? c : Wr ??= un(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Nn(() => s(c)) : (d = Nn(() => s(Wr ??= un())), d.f |= ee)), e > r.size && pe("", "", ""), j && e > 0 && je(Pe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && Ae(!0), W(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, j && (c = M);
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
		if (_.f & 8192 && (Hn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Yr(_, null, n);
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
			var E = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Hr(e, w, E);
		}
	}
	o && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Jr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? qt(n) : /* @__PURE__ */ L(n, !1, !1) : null, l = o & 2 ? qt(i) : null;
	return {
		v: c,
		i: l,
		e: Nn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Yr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ fn(r);
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
	j && Me();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Qr(e, t, n) {
	Dn(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			jn(() => {
				var e = n();
				K(e), i && Le(a, e) && (a = e, r.update(e));
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
	var o = e[ie];
	if (j || o !== n || o === void 0) {
		var s = ri(n, r, a);
		(!j || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ie] = n;
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
	var i = e[ae];
	if (j || i !== t) {
		var a = oi(t, r);
		(!j || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ae] = t;
	} else r && (Array.isArray(r) ? (ci(e, n?.[0], r[0]), ci(e, n?.[1], r[1], "important")) : ci(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ui(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Oe();
		for (var i of t.options) i.selected = n.includes(pi(i));
		return;
	}
	for (i of t.options) if (nn(pi(i), n)) {
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
	}), Sn(() => {
		t.disconnect();
	});
}
function fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), pi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && pi(o);
		}
		n(a), e.__value = a, I !== null && r.add(I);
	}), Dn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = I;
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
var mi = Symbol("is custom element"), hi = Symbol("is html"), gi = le ? "link" : "LINK", _i = le ? "progress" : "PROGRESS";
function vi(e) {
	if (j) {
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
		e[se] = n, qe(n), ot();
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
	j && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === gi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ne] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ci(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function xi(e) {
	return e[re] ??= {
		[mi]: e.nodeName.includes("-"),
		[hi]: e.namespaceURI === Te
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
	r && r.set && (e[t] = n, Sn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ti(e, t) {
	return e === t || e?.[k] === t;
}
function Ei(e = {}, t, n, r) {
	var i = P.r, a = U;
	return Dn(() => {
		var o, s;
		return jn(() => {
			o = s, s = r?.() || [], G(() => {
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
	let t = P, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ _t(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && Tn(() => {
		Oi(t, r), p(n.b);
	}), Cn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Cn(() => {
		Oi(t, r), p(n.a);
	});
}
function Oi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !ze || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = k in e || A in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ve(t), f(m)));
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
	var v = !1, y = (n & 1 ? _t : F)(() => (v = !1, g()));
	o && W(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? en(e) : e;
			return R(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return qn && v || b.f & 16384 ? y.v : W(y);
	});
}
function ki(e) {
	P === null && de("onMount"), ze && P.l !== null ? ji(P).m.push(e) : Cn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function Ai(e) {
	P === null && de("onDestroy"), ki(() => () => G(e));
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
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Be();
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
var Pi = /* @__PURE__ */ J("<button type=\"button\" tabindex=\"-1\"><!></button>"), Fi = /* @__PURE__ */ J("<div role=\"group\"></div>"), Ii = /* @__PURE__ */ J("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Li(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ L(), f = /* @__PURE__ */ L(), p = /* @__PURE__ */ L(), m = /* @__PURE__ */ L(), h = /* @__PURE__ */ L(!1), g = /* @__PURE__ */ L(!1), _ = /* @__PURE__ */ L(!1), v = /* @__PURE__ */ L(null), y = /* @__PURE__ */ L(0), b = /* @__PURE__ */ L(0), x = /* @__PURE__ */ L(!1), S = /* @__PURE__ */ L(null), C = 0;
	function w(e = !1) {
		clearTimeout(W(m)), C++, W(S) !== null && W(f)?.hasPointerCapture(W(S)) && W(f).releasePointerCapture(W(S)), R(S, null), R(h, !1), R(g, !1), R(v, null), R(x, !1), e && W(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function ee(e = !1) {
		if (!W(r).length) return;
		R(h, !0), R(x, !1);
		let t = ++C;
		if (await hr(), !W(h) || t !== C || !W(p)) return;
		let n = W(f).getBoundingClientRect(), i = W(p).getBoundingClientRect(), o = [...W(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (R(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), R(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (R(y, n.right + 4), W(y) + i.width > window.innerWidth - 4 && R(y, n.left - i.width - 4), R(b, n.top + (n.height - i.height) / 2)) : (R(y, n.left + (n.width - i.width) / 2), R(b, n.bottom + 4), W(b) + i.height > window.innerHeight - 4 && R(b, n.top - i.height - 4)), R(y, Math.max(4, Math.min(W(y), window.innerWidth - i.width - 4))), R(b, Math.max(4, Math.min(W(b), window.innerHeight - i.height - 4))), R(x, !0), await hr(), e && W(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function E(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && W(p)?.contains(t) ? t.dataset.choice : null;
	}
	function te(e) {
		if (clearTimeout(W(m)), W(S) !== null) {
			if (W(g)) {
				let t = E(e);
				R(_, !0), t === null ? w(!0) : T(W(r).find((e) => String(e.id) === t).id);
			} else {
				let t = W(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (R(_, !0), w(!0));
			}
			R(S, null);
		}
	}
	function D(e) {
		if (["Enter", " "].includes(e.key) && W(S) === null && R(_, !1), e.key === "Tab" && W(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(W(h) || W(S) !== null) && (e.preventDefault(), R(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !W(h)) {
			ee(!0);
			return;
		}
		let n = [...W(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function O() {
		W(S) !== null && R(_, !0), w(W(d)?.contains(document.activeElement));
	}
	Ai(() => clearTimeout(W(m))), On(() => (K(i()), K(a())), () => {
		R(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), On(() => (K(i()), K(a()), K(l())), () => {
		R(r, Ni(i(), a(), l()));
	}), kn(), Di();
	var k = Ii();
	Tr("pointerdown", rn, (e) => {
		W(d)?.contains(e.target) || w();
	}), Tr("resize", rn, O), Tr("blur", rn, O), Tr("scroll", an, (e) => {
		W(p)?.contains(e.target) || O();
	}, !0);
	var A = z(k);
	let ne;
	Zr(z(A), t, "icon", { get item() {
		return W(n);
	} }, null), N(A), Ei(A, (e) => R(f, e), () => W(f));
	var re = B(A, 2), ie = (e) => {
		var n = Fi();
		let i, s;
		Gr(n, 5, () => W(r), (e) => e.id, (e, n) => {
			var r = Pi();
			let i;
			Zr(z(r), t, "icon", { get item() {
				return W(n);
			} }, null), N(r), V((e) => {
				i = si(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (W(n), G(() => W(n).id))), Q(r, "aria-label", (W(n), G(() => W(n).label))), Q(r, "title", (W(n), G(() => W(n).label))), Q(r, "aria-pressed", (W(n), K(a()), G(() => W(n).kind === "action" ? void 0 : W(n).id === a())));
			}, [() => ({ "icon-choice-hover": W(v) === String(W(n).id) })]), q("keydown", r, D), q("click", r, () => T(W(n).id)), Y(e, r);
		}), N(n), Ei(n, (e) => R(p, e), () => W(p)), V(() => {
			i = si(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = li(n, "", s, {
				left: `${W(y)}px`,
				top: `${W(b)}px`,
				visibility: W(x) ? "visible" : "hidden"
			});
		}), Y(e, n);
	};
	Z(re, (e) => {
		W(h) && e(ie);
	}), N(k), Ei(k, (e) => R(d, e), () => W(d)), V(() => {
		Q(k, "aria-label", o()), Q(A, "aria-label", (K(o()), W(n), G(() => `${o()}：${W(n)?.label ?? ""}`))), Q(A, "aria-expanded", s() === "cycle" ? void 0 : W(h)), Q(A, "title", (K(o()), W(n), K(s()), G(() => `${o()}：${W(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), A.disabled = !W(n), ne = li(A, "", ne, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), q("focusout", k, (e) => {
		W(d).contains(e.relatedTarget) || w();
	}), q("keydown", A, D), q("pointerdown", A, (e) => {
		e.button === 0 && (R(_, !1), !(s() === "cycle" || W(h)) && (R(S, e.pointerId), W(f).setPointerCapture(W(S)), clearTimeout(W(m)), R(m, setTimeout(() => {
			R(g, !0), ee();
		}, 300))));
	}), q("pointermove", A, (e) => {
		W(g) && R(v, E(e));
	}), q("pointerup", A, te), Tr("pointercancel", A, O), q("click", A, () => {
		if (W(_)) {
			R(_, !1);
			return;
		}
		if (W(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") ee(!0);
		else {
			let e = Mi(i(), a());
			e !== void 0 && u()(e);
		}
	}), Y(e, k), Ue();
}
Er([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var Ri = /* @__PURE__ */ Pr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), zi = /* @__PURE__ */ Pr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), Bi = /* @__PURE__ */ Pr("<path d=\"M3 3l18 18\"></path>"), Vi = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function Hi(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = Vi(), a = z(i), o = (e) => {
		Y(e, Ri());
	}, s = (e) => {
		var t = zi();
		Ne(), Y(e, t);
	};
	Z(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = B(a), l = (e) => {
		Y(e, Bi());
	};
	Z(c, (e) => {
		r() && e(l);
	}), N(i), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var Ui = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
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
			let n = /* @__PURE__ */ F(() => t.item);
			var r = Fr(), i = pn(r), a = (e) => {
				Y(e, Ui());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ F(() => (K(W(n)), G(() => W(n)?.id === "closed"))), r = /* @__PURE__ */ F(() => (K(W(n)), G(() => W(n)?.id === "disabled")));
					Hi(e, {
						get closed() {
							return W(t);
						},
						get disabled() {
							return W(r);
						}
					});
				}
			};
			Z(i, (e) => {
				K(W(n)), G(() => W(n)?.id === "reset") ? e(a) : e(o, -1);
			}), Y(e, r);
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
var $i = /* @__PURE__ */ Pr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), ea = /* @__PURE__ */ Pr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), ta = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), na = /* @__PURE__ */ J("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), ra = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), ia = /* @__PURE__ */ J("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function aa(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), i = /* @__PURE__ */ L(), a = $(t, "items", 24, () => []), o = $(t, "allIds", 24, () => []), s = $(t, "storageKey", 8), c = $(t, "pinEnabled", 8, !1), l = $(t, "requestedPin", 8, null), u = $(t, "heldOrder", 8, null);
	function d(e = a()) {
		return Xi(e, W(T), W(g), c() ? W(f) : []).map((e) => e.id);
	}
	let f = /* @__PURE__ */ L([]), p = null, m = $(t, "expanded", 8, !0), h = $(t, "onToggleAll", 8, () => {}), g = /* @__PURE__ */ L("forward"), _ = [
		"forward",
		"reverse",
		"free"
	], v = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, y = /* @__PURE__ */ L("disabled"), b = /* @__PURE__ */ L([]);
	function x() {
		if (s()) try {
			sessionStorage.setItem(`${s()}:visibility`, JSON.stringify({
				mode: W(y),
				hiddenIds: W(b)
			}));
		} catch {}
	}
	function S(e) {
		let t = Ki(W(y), W(b), e);
		R(y, t.mode), R(b, t.hiddenIds), le(), x();
	}
	function C(e, t) {
		R(b, t ? W(b).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...W(b), e])]), le(), x();
	}
	function w(e) {
		W(y) === "closed" && R(y, "enabled"), C(e, !0);
	}
	let T = /* @__PURE__ */ L(null), ee = /* @__PURE__ */ L(null), E = /* @__PURE__ */ L(null), te = /* @__PURE__ */ L(null), D = /* @__PURE__ */ L(null), O = /* @__PURE__ */ L(), k = /* @__PURE__ */ L("");
	function A(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (p !== i) {
			if (p = i, !n.includes(e)) {
				R(k, `找不到卡片 ID：${e}`);
				return;
			}
			R(f, Yi(W(f), e)), w(e), ne();
		}
	}
	function ne() {
		if (!s()) {
			R(k, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${s()}:pins`, JSON.stringify(W(f))), R(k, "已記住本機釘選");
		} catch {
			R(k, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function re(e) {
		le(), R(f, W(f).includes(e) ? W(f).filter((t) => t !== e) : Yi(W(f), e)), ne();
	}
	function ie(e) {
		if (p = null, R(f, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			R(f, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (R(y, "disabled"), R(b, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			R(y, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), R(b, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (R(ee, null), R(E, null), R(te, null), R(D, null), !e) {
			R(T, null), R(g, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			R(T, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			R(g, _.includes(n) ? n : W(T) ? "free" : "forward");
		} catch {
			R(T, null), R(g, "forward");
		}
	}
	function ae(e) {
		if (R(T, e), !s()) {
			R(k, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(s(), JSON.stringify(e)) : localStorage.removeItem(s()), R(k, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			R(k, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function oe(e) {
		if (le(), R(g, e), R(k, ""), s()) try {
			localStorage.setItem(`${s()}:mode`, W(g));
		} catch {
			R(k, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function se(e, t, n) {
		W(g) === "free" && (c() && (W(f).includes(e) || W(f).includes(t)) || e !== t && (ae(Qi(o(), W(T), W(r).map((e) => e.id), e, t, n)), R(ee, e), await hr(), [...W(O).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function ce(e, t) {
		let n = W(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = W(r)[n + t];
		i && se(e, i.id, t > 0);
	}
	function le() {
		R(E, null), R(te, null), R(D, null);
	}
	function ue(e, t) {
		if (c() && W(f).includes(e.id) || W(te) === null || W(te) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		R(D, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	On(() => W(y), () => {
		R(n, W(y) === "enabled");
	}), On(() => (K(a()), W(T), W(g), K(c()), W(f), K(u())), () => {
		R(i, Zi(Xi(a(), W(T), W(g), c() ? W(f) : []), u()));
	}), On(() => (W(i), W(y), W(b), K(c()), W(f)), () => {
		R(r, W(i).filter((e) => Gi(e.id, W(y), W(b)) && !(c() && W(f).includes(e.id))));
	}), On(() => K(s()), () => {
		ie(s());
	}), On(() => (K(l()), K(s()), K(o()), K(c())), () => {
		A(l(), s(), o(), c());
	}), kn();
	var de = {
		orderedIds: d,
		revealCard: w
	};
	Di();
	var fe = ia(), pe = pn(fe), me = z(pe);
	Zr(B(z(me), 2), t, "filters", {}, null), N(me);
	var he = B(me, 2), ge = z(he), _e = z(ge), ve = z(_e);
	N(_e), N(ge);
	var ye = B(ge, 2);
	{
		let e = /* @__PURE__ */ F(() => G(() => _.map((e) => ({
			id: e,
			label: v[e]
		}))));
		Li(ye, {
			get items() {
				return W(e);
			},
			get value() {
				return W(g);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: oe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ F(() => t.item);
				var r = ta(), i = z(r), a = (e) => {
					Y(e, $i());
				}, o = (e) => {
					var t = ea(), r = pn(t), i = B(r);
					V(() => {
						Q(r, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), Y(e, t);
				};
				Z(i, (e) => {
					K(W(n)), G(() => W(n).id === "free") ? e(a) : e(o, -1);
				}), N(r), Y(e, r);
			} }
		});
	}
	var be = B(ye, 2);
	Wi(be, {
		get mode() {
			return W(y);
		},
		onChoose: S
	});
	var xe = B(be, 2), Se = z(xe, !0);
	N(xe), N(he), N(pe);
	var Ce = B(pe, 2);
	return Gr(Ce, 5, () => W(i), (e) => e.id, (e, r) => {
		var i = ra();
		let a;
		var o = z(i), s = (e) => {
			var t = na();
			let n;
			var i = z(t), a = z(i);
			N(i), N(t), V((e, r, i, o, s) => {
				n = si(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({ "is-pinned": W(f).includes(W(r).id) }),
				() => (W(f), W(r), G(() => W(f).includes(W(r).id) ? `取消釘選：${W(r).title}` : `釘選置頂：${W(r).title}`)),
				() => (W(f), W(r), G(() => W(f).includes(W(r).id))),
				() => (W(f), W(r), G(() => W(f).includes(W(r).id) ? "取消釘選" : "釘選置頂")),
				() => (W(f), W(r), G(() => W(f).includes(W(r).id) ? "currentColor" : "none"))
			]), q("click", t, () => re(W(r).id)), Y(e, t);
		};
		Z(o, (e) => {
			c() && e(s);
		});
		var l = B(o, 2);
		{
			let e = /* @__PURE__ */ F(() => (W(b), W(r), G(() => !W(b).includes(W(r).id))));
			Zr(l, t, "default", {
				get item() {
					return W(r);
				},
				get visibilityEnabled() {
					return W(n);
				},
				get visible() {
					return W(e);
				},
				onVisibleChange: (e) => C(W(r).id, e)
			}, null);
		}
		N(i), V((e) => {
			Q(i, "hidden", e), a = si(i, 1, "arrangeable-card", null, a, {
				"card-selected": W(ee) === W(r).id,
				"card-drop-before": W(D)?.id === W(r).id && !W(D).after,
				"card-drop-after": W(D)?.id === W(r).id && W(D).after
			}), Q(i, "aria-label", (W(r), W(ee), G(() => `${W(r).title}${W(ee) === W(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (W(r), G(() => W(r).id))), Q(i, "draggable", (W(g), W(E), W(r), G(() => W(g) === "free" && W(E) === W(r).id)));
		}, [() => (K(Gi), W(r), W(y), W(b), G(() => !Gi(W(r).id, W(y), W(b))))]), q("pointerdown", i, (e) => {
			R(E, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (R(ee, W(r).id), !(W(g) !== "free" || e.pointerType !== "mouse" || c() && W(f).includes(W(r).id)) && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || R(E, W(r).id))));
		}), q("pointerup", i, () => {
			R(E, null);
		}), q("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), R(ee, W(r).id)) : e.key === "Escape" && R(ee, null), W(g) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), ce(W(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Tr("dragstart", i, (e) => {
			W(g) === "free" && W(E) === W(r).id && e.target === e.currentTarget && (R(te, W(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(r).id)));
		}), Tr("dragend", i, le), Tr("dragover", i, (e) => ue(W(r), e)), Tr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(D, null);
		}), Tr("drop", i, (e) => {
			W(te) !== null && W(D)?.id === W(r).id && (e.preventDefault(), se(W(te), W(r).id, W(D).after), le());
		}), Y(e, i);
	}), N(Ce), Ei(Ce, (e) => R(O, e), () => W(O)), V(() => {
		Q(ge, "aria-label", m() ? "全部收合" : "全部展開"), Q(ge, "title", m() ? "全部收合" : "全部展開"), Q(ve, "d", m() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), X(Se, W(k));
	}), q("click", ge, () => h()(!m())), Y(e, fe), wi(t, "orderedIds", d), wi(t, "revealCard", w), Ue(de);
}
Er([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region viewer/assets/focus-shield.js
function oa({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, storage: n, key: r = `taskprogress.focus-shield.v1:${e.location.pathname}`, onChange: i = () => {} } = {}) {
	let a = () => t.visibilityState !== "hidden" && t.hasFocus(), o = !a();
	try {
		o ||= (n ?? globalThis.sessionStorage).getItem(r) === "blocked";
	} catch {}
	let s = null, c = () => {
		try {
			let e = n ?? globalThis.sessionStorage;
			o ? e.setItem(r, "blocked") : e.removeItem(r);
		} catch {}
		i(o);
	}, l = () => {
		o = !0, s = null, c();
	}, u = () => {
		t.visibilityState === "hidden" && l();
	}, d = (e) => {
		e.preventDefault(), e.stopImmediatePropagation();
	};
	function f(e) {
		o && (d(e), a() && (e.type === "keydown" && !e.repeat && ["Enter", " "].includes(e.key) && (s = e.key), (e.type === "click" && e.button === 0 || e.type === "keyup" && s === e.key) && (s = null, o = !1, c())));
	}
	let p = [
		"pointerdown",
		"pointerup",
		"mousedown",
		"mouseup",
		"click",
		"dblclick",
		"keydown",
		"keyup",
		"beforeinput",
		"input",
		"change",
		"submit"
	];
	e.addEventListener("blur", l), t.addEventListener("visibilitychange", u);
	for (let t of p) e.addEventListener(t, f, !0);
	return c(), () => {
		e.removeEventListener("blur", l), t.removeEventListener("visibilitychange", u);
		for (let t of p) e.removeEventListener(t, f, !0);
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/FocusShield.svelte
var sa = /* @__PURE__ */ J("<dialog class=\"focus-shield svelte-1yt051k\" aria-label=\"操作已暫停\"><button type=\"button\" class=\"svelte-1yt051k\">操作已暫停<br/><small class=\"svelte-1yt051k\">點一下或按 Enter／空白鍵恢復操作</small></button></dialog>");
function ca(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(!1);
	ki(() => oa({ onChange: (e) => R(n, e) }));
	function r(e) {
		e.showModal();
	}
	Di();
	var i = Fr(), a = pn(i), o = (e) => {
		var t = sa();
		Qr(t, (e) => r?.(e)), Tr("cancel", t, (e) => e.preventDefault()), Y(e, t);
	};
	Z(a, (e) => {
		W(n) && e(o);
	}), Y(e, i), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var la = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ua(e, t) {
	He(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ L(), d = null, f = !1;
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
		W(u)?.close(), m();
	}
	function g(e) {
		e.target === e.currentTarget && h();
	}
	Di();
	var _ = Fr(), v = pn(_), y = (e) => {
		var n = la(), l = z(n), d = z(l), f = z(d), _ = z(f, !0);
		N(f);
		var v = B(f, 2), y = z(v, !0);
		N(v), N(d);
		var b = B(d, 2);
		N(l), Zr(B(l, 2), t, "default", { close: h }, null), N(n), Ei(n, (e) => R(u, e), () => W(u)), Qr(n, (e) => p?.(e)), V(() => {
			si(n, 1, ti(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), Tr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), Ue();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var da = /* @__PURE__ */ J("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), fa = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function pa(e, t) {
	He(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Di();
	var l = fa(), u = pn(l);
	let d;
	var f = z(u), p = z(f), m = z(p, !0);
	N(p), N(f);
	var h = B(f, 2), g = (e) => {
		var t = da(), n = z(t);
		{
			let e = /* @__PURE__ */ F(() => !r());
			Hi(n, { get closed() {
				return W(e);
			} });
		}
		N(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), q("click", t, () => i()(!r())), Y(e, t);
	};
	Z(h, (e) => {
		n() && e(g);
	}), Zr(B(h, 2), t, "header", {}, null), N(u);
	var _ = B(u, 2);
	Zr(z(_), t, "default", {}, null), N(_), V(() => {
		d = si(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), X(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), q("click", f, () => c()(!a())), Y(e, l), Ue();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var ma = /* @__PURE__ */ J("<span></span>"), ha = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), ga = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), _a = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function va(e, t) {
	He(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ L(null), c = /* @__PURE__ */ L(null), l = !1, u = null, d = /* @__PURE__ */ L(null), f = /* @__PURE__ */ L();
	async function p() {
		let e = W(d);
		R(d, null), await hr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		R(s, null), R(c, null);
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
		R(d, r), o()(e, t, n);
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
		R(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!W(s) || e.id === W(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", R(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || W(c)?.id === e.id && R(c, null);
	}
	function T(e, t) {
		if (!W(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = W(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function ee() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function E(e, t) {
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
	function te(e, t) {
		if (!u || u.pointerId !== t.pointerId) return;
		let n = t.clientX - u.startX, r = t.clientY - u.startY;
		if (!u.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			u.active = !0, l = !0, R(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, R(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), R(c, {
			id: a,
			placeAfter: u.placeAfter
		});
	}
	function D(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	On(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), kn(), Di();
	var O = _a();
	Gr(O, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ F(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = ga(), i = z(r), a = z(i, !0);
		N(i);
		var o = B(i, 2), l = (e) => {
			var n = ma();
			V(() => si(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = B(o, 2), d = (e) => {
			Y(e, ha());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), N(r), V((e) => {
			si(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), Tr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), Tr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), Tr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), Tr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), Tr("dragend", r, function(...e) {
			(W(n) ? ee : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => E(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? D : null)?.apply(this, e);
		}), Tr("pointercancel", r, function(...e) {
			(W(n) ? D : null)?.apply(this, e);
		}), Y(e, r);
	}), N(O), Ei(O, (e) => R(f, e), () => W(f)), V(() => {
		si(O, 1, `horizontal-capsule-strip ${r()}`), Q(O, "aria-label", i());
	}), Y(e, O), Ue();
}
Er([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region viewer/assets/filter-selection.js
var ya = "__default__";
function ba(e) {
	return [...new Set(e)];
}
function xa(e = []) {
	let t = ba(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Sa(e, t, n) {
	let r = xa(t);
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
function Ca(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function wa(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function Ta(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Ea(e) {
	let t = wa(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Da(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), i = /* @__PURE__ */ L(), a = /* @__PURE__ */ L(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	On(() => (K(u()), K(p()), K(l())), () => {
		R(n, {
			id: ya,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), On(() => K(o()), () => {
		R(r, new Map(o().map((e) => [e.id, e])));
	}), On(() => (K(s()), K(o())), () => {
		R(i, s().length > 0 ? s() : [ya, ...o().map((e) => e.id)]);
	}), On(() => (W(i), W(n), W(r), K(c()), K(p())), () => {
		R(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e, c(), p())));
	}), kn(), Di();
	{
		let t = /* @__PURE__ */ F(() => `filter-strip ${f()}`);
		va(e, {
			get items() {
				return W(a);
			},
			get className() {
				return W(t);
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
	Ue();
}
//#endregion
//#region viewer/assets/theme-model.js
var Oa = "task-progress.theme.v1", ka = [
	"system",
	"light",
	"dark",
	"custom"
], Aa = [
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
], ja = Object.freeze({
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
}), Ma = Object.freeze({
	version: 1,
	mode: "system"
}), Na = /^#[0-9a-f]{6}$/i;
function Pa(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Fa(e) {
	return typeof e == "string" && Na.test(e);
}
function Ia(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = ja[n], i = { base: n };
	for (let e of Aa) {
		let n = t[e.key];
		i[e.key] = Fa(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function La(e) {
	if (!Pa(e) || e.version !== 1 || !ka.includes(e.mode)) return { ...Ma };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Pa(e.custom) ? t.custom = Ia(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Ia()), t;
}
function Ra(e) {
	try {
		let t = e?.getItem(Oa);
		return t ? La(JSON.parse(t)) : { ...Ma };
	} catch {
		return { ...Ma };
	}
}
function za(e, t) {
	let n = La(t);
	try {
		e?.setItem(Oa, JSON.stringify(n));
	} catch {}
	return n;
}
function Ba(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Va(e, t) {
	let n = La(t);
	e.dataset.theme = n.mode;
	for (let t of Aa) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Ia();
		e.dataset.themeBase = t.base;
		for (let n of Aa) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Ha(e, t, n = "light") {
	let r = La(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Ia(n)), La(i);
}
function Ua(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Wa(e, t) {
	if (!Fa(e) || !Fa(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ua(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Ga(e) {
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
	].filter(([, e, t]) => Wa(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Ka = /* @__PURE__ */ J("<option> </option>"), qa = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Ja = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), Ya = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Xa(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), i = /* @__PURE__ */ L(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ L(!1), p = /* @__PURE__ */ L([]), m = /* @__PURE__ */ L(a()), h = /* @__PURE__ */ L(o()?.base ?? s()), g = /* @__PURE__ */ L(v(Ia(W(h)))), _ = /* @__PURE__ */ L({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Aa.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		R(h, e.base), R(g, v(e)), R(_, { ...W(g) });
		for (let e of W(p)) e?.setCustomValidity("");
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
		y(o() ? Ia(o().base, o()) : Ia(s())), R(f, !0);
	}
	function S() {
		R(f, !1);
	}
	function C(e) {
		y(Ia(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		R(g, {
			...W(g),
			[e.key]: r
		}), R(_, {
			...W(_),
			[e.key]: r
		}), W(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), R(g, {
			...W(g),
			[e.key]: n.value
		}), r && R(_, {
			...W(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function ee() {
		R(m, a()), S();
	}
	function E() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ia(W(h), W(_))), S();
	}
	On(() => K(a()), () => {
		R(m, a());
	}), On(() => (W(h), W(_)), () => {
		R(n, Ia(W(h), W(_)));
	}), On(() => W(n), () => {
		R(r, Ga(W(n)));
	}), On(() => W(r), () => {
		R(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), kn(), Di();
	var te = Ya(), D = pn(te), O = B(z(D), 2);
	Gr(O, 5, () => u, (e) => e.value, (e, t) => {
		var n = Ka(), r = z(n, !0);
		N(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), N(O), N(D), ua(B(D, 2), {
		get open() {
			return W(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: ee,
		children: (e, t) => {
			var a = Ja(), o = B(pn(a), 2), s = B(z(o), 2), c = z(s);
			c.value = c.__value = "light";
			var l = B(c);
			l.value = l.__value = "dark", N(s);
			var u;
			di(s), N(o);
			var d = B(o, 2);
			Gr(d, 7, () => Aa, (e) => e.key, (e, t, r) => {
				var i = qa(), a = z(i), o = z(a, !0);
				N(a);
				var s = B(a, 2), c = z(s);
				vi(c);
				var l = B(c, 2);
				vi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ei(l, (e, t) => Yt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), N(s), N(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), yi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), yi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
			}), N(d);
			var f = B(d, 2);
			let m;
			var _ = z(f, !0);
			N(f);
			var v = B(f, 2), b = z(v), x = B(b, 4), S = B(x, 2);
			N(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", ui(s, W(h))), m = si(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(Ia(W(h)))), q("click", x, ee), q("click", S, E), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", O, b), fi(O, () => W(m), (e) => R(m, e)), Y(e, te), Ue();
}
Er([
	"change",
	"input",
	"click"
]);
//#endregion
//#region viewer/assets/theme-control.js
function Za({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Ra(t);
	e && Va(e, r);
	function i(n) {
		return r = za(t, n), e && Va(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ba(n);
		},
		setMode(e) {
			return i(Ha(r, e, Ba(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Ia(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region viewer/assets/decision-session.js
var Qa = (e) => structuredClone(e), $a = (e) => e && typeof e == "object" ? Array.isArray(e) ? e.map($a) : Object.fromEntries(Object.keys(e).sort().map((t) => [t, $a(e[t])])) : e, eo = (e, t) => JSON.stringify($a(e)) === JSON.stringify($a(t));
function to(e) {
	let t = Qa(e), n = Object.create(null), r = null, i = null, a = !1, o = (e) => t.document.decisions.find((t) => t.id === e);
	function s() {
		return {
			snapshot: Qa(t),
			drafts: Qa(n),
			pending: Qa(r),
			busy: a,
			dirty: Object.keys(n).length > 0
		};
	}
	function c(e) {
		for (let [t, r] of Object.entries(n)) {
			let n = e.document.decisions.find((e) => e.id === t);
			r.conflict = !n || !eo(r.base, n);
		}
		t = Qa(e);
	}
	return {
		view: s,
		canConfirm(e) {
			let t = n[e], i = o(e);
			return !r && !a && !!i && !!t && !t.conflict && (t.choice === "__other" ? i.allow_other && !!t.other.trim() : i.options.some((e) => e.id === t.choice));
		},
		saveOperation(e) {
			let t = n[e];
			return r || a || !t || t.conflict || !o(e) ? null : this.canConfirm(e) ? "confirm" : o(e).answer && o(e).allow_other && t.choice === "__other" && !t.other.trim() ? "reopen" : null;
		},
		edit(e, t) {
			if (r && !a || r?.operation === "clear_all" || !o(e)) return;
			let i = o(e).answer;
			n[e] ??= {
				base: Qa(o(e)),
				choice: i?.kind === "other" ? "__other" : i?.option_id ?? "",
				other: i?.kind === "other" ? i.text : "",
				conflict: !1
			}, Object.assign(n[e], t);
		},
		discard(e) {
			r?.decision_id !== e && delete n[e];
		},
		rebase(e) {
			let t = o(e), r = n[e];
			!r || !t || (r.choice !== "__other" && !t.options.some((e) => e.id === r.choice) && (r.choice = ""), r.choice === "__other" && !t.allow_other && (r.choice = ""), r.base = Qa(t), r.conflict = !1);
		},
		merge: c,
		beginClearAll() {
			if (r || a) throw Error("請先查核上一筆請求的結果。");
			return r = {
				operation: "clear_all",
				expected_revision: t.revision,
				request_id: crypto.randomUUID(),
				payload: {}
			}, i = null, a = !0, Qa(r);
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
			}, i = l ? Qa(l) : null, a = !0, Qa(r);
		},
		retry() {
			if (!r || a) throw Error("沒有待查核請求。");
			return a = !0, Qa(r);
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
			let t = r?.decision_id, s = n[t], l = s && i && (s.choice !== i.choice || s.other !== i.other), u = s && (l || r?.operation === "reopen") ? Qa(s) : null;
			if (r && delete n[r.decision_id], r = null, i = null, c(e), u) {
				let e = o(t), r = (e) => {
					if (!e) return null;
					let { answer: t, status: n, last_request: r, ...i } = e;
					return i;
				};
				u.conflict = !e || !eo(r(u.base), r(e)), u.conflict || (u.base = Qa(e)), n[t] = u;
			}
		}
	};
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function no(e, t) {
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
function ro(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/DecisionApp.svelte
var io = /* @__PURE__ */ J("<p role=\"status\"> </p>"), ao = /* @__PURE__ */ J("<article class=\"checklist-item\"><a> </a> <p> </p></article>"), oo = /* @__PURE__ */ J("<p>尚未建立決策文件。</p>"), so = /* @__PURE__ */ J("<p> </p> <!> <!>", 1), co = /* @__PURE__ */ J("<button class=\"svelte-17meywc\"> </button>"), lo = /* @__PURE__ */ J("<p>目前沒有符合條件的決策項目。</p>"), uo = /* @__PURE__ */ J("<p class=\"decision-text svelte-17meywc\"> </p>"), fo = /* @__PURE__ */ J("<p> </p>"), po = /* @__PURE__ */ J("<div class=\"decision-description svelte-17meywc\"><!> <!></div>"), mo = /* @__PURE__ */ J("<small class=\"svelte-17meywc\"> </small>"), ho = /* @__PURE__ */ J("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/> <span class=\"svelte-17meywc\"> <!></span></label>"), go = /* @__PURE__ */ J("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/><span class=\"svelte-17meywc\">其他</span></label> <div class=\"decision-other svelte-17meywc\"><label>其他方案與理由</label><textarea class=\"svelte-17meywc\"></textarea></div>", 1), _o = /* @__PURE__ */ J("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">已核對最新題目，套用選擇</button>", 1), vo = /* @__PURE__ */ J("<button class=\"svelte-17meywc\">重試保存</button>"), yo = /* @__PURE__ */ J("<div class=\"decision-content svelte-17meywc\"><!> <fieldset class=\"svelte-17meywc\"><legend class=\"decision-visually-hidden svelte-17meywc\"> </legend> <!> <!></fieldset> <!> <div class=\"decision-actions svelte-17meywc\"><!></div></div>"), bo = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header svelte-17meywc\"><h2 tabindex=\"-1\" class=\"svelte-17meywc\"> </h2><span class=\"checklist-status\"> </span></header>"), xo = /* @__PURE__ */ J("<article><!></article>"), So = /* @__PURE__ */ J("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">關閉已移除題目提示</button>", 1), Co = /* @__PURE__ */ J("<div class=\"decision-overview svelte-17meywc\"><p class=\"svelte-17meywc\"> </p> <p class=\"svelte-17meywc\">選項可隨時修改；「其他」文字一更動就自動保存，空白則為待決策。保存失敗會保留修改供重試。</p></div> <div class=\"decision-controls svelte-17meywc\"><button class=\"svelte-17meywc\">下一項待決策</button> <button class=\"svelte-17meywc\">清除全部答案</button></div> <!> <!> <!> <!>", 1), wo = /* @__PURE__ */ J("<p> </p> <p>此操作無法復原。</p> <form class=\"theme-dialog-actions\"><button type=\"button\" class=\"secondary-button svelte-17meywc\">取消</button> <button type=\"submit\" class=\"primary-button svelte-17meywc\">確認清除全部</button></form>", 1), To = /* @__PURE__ */ J("<!> <main class=\"checklist-shell decisions-shell svelte-17meywc\"><header class=\"checklist-header\"><h1>決策項目</h1> <!></header> <!> <!></main> <!>", 1);
function Eo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ L(), r = /* @__PURE__ */ L(), i = /* @__PURE__ */ L(), a = /* @__PURE__ */ L(), o = /* @__PURE__ */ L(), s = $(t, "transport", 8), c = $(t, "onPersistenceChange", 8, () => {}), l = /* @__PURE__ */ L(), u = /* @__PURE__ */ L(), d = /* @__PURE__ */ L(), f = /* @__PURE__ */ L("載入中…"), p = /* @__PURE__ */ L(!0), m = /* @__PURE__ */ L({}), g = /* @__PURE__ */ L(), _ = /* @__PURE__ */ L(xa(["pending", "decided"])), v = null;
	function y(e) {
		R(_, e), Ca(v, W(_));
	}
	let b = /* @__PURE__ */ L(), x = /* @__PURE__ */ L(), S = /* @__PURE__ */ L(/* @__PURE__ */ new Set()), C = /* @__PURE__ */ L(!1), w = /* @__PURE__ */ L(!1), T = /* @__PURE__ */ new Set(), ee = /* @__PURE__ */ L(null), E = /* @__PURE__ */ L(null), te = /* @__PURE__ */ L();
	function D() {
		R(ee, null), R(E, null);
	}
	function O(e) {
		let t = e.target?.closest?.(".arrangeable-card");
		if (!t || !W(te)?.contains(t)) {
			D();
			return;
		}
		let n = t.dataset.cardId;
		if (W(ee) === n) return;
		R(ee, n);
		let r = W(i).filter((e) => W(_).selected.has(e.status) || e.id === n);
		R(E, W(g)?.orderedIds(r) ?? r.map((e) => e.id));
	}
	function k() {
		R(x, {
			mode: W(b).mode,
			custom: W(b).custom,
			systemScheme: W(b).systemScheme
		});
	}
	let A = () => {
		R(u, W(l).view());
	}, ne = (e, t) => {
		W(l).edit(e, t), A();
	}, re = (e) => {
		if (T.add(e), R(S, new Set([...W(S)].filter((t) => t !== e))), W(C)) return;
		let t = W(l).saveOperation(e);
		if (t) return le(e, t);
	};
	function ie(e, t) {
		if (!(W(u).pending && !W(u).busy)) return ne(e, { choice: t }), re(e);
	}
	function ae(e, t) {
		ne(e, {
			choice: "__other",
			other: t
		}), re(e);
	}
	function oe(e, t) {
		R(m, {
			...W(m),
			[e]: t
		}), ro(W(o), W(p), W(m));
	}
	function se(e) {
		R(p, e), R(m, {}), ro(W(o), W(p), W(m));
	}
	async function ce() {
		try {
			let e = await s().load();
			if (!e.ok) throw Error(e.error.message);
			if (e.files) {
				R(d, e), R(f, "");
				return;
			}
			R(l, to(e)), A(), v = `taskprogress.filters.decisions.v1:${e.document_key}`, R(_, Sa(v, ["pending", "decided"]));
			let t = no(`taskprogress.decisions:${e.document_key}`);
			R(p, t.expanded), R(m, t.overrides), R(f, "");
		} catch (e) {
			R(f, e.message);
		}
	}
	ki(() => {
		R(b, Za()), k(), ce();
		let e = (e) => {
			W(a) && (e.preventDefault(), e.returnValue = "");
		};
		return window.addEventListener("beforeunload", e), document.addEventListener("pointerdown", O, !0), document.addEventListener("focusin", O, !0), window.addEventListener("blur", D), () => {
			window.removeEventListener("beforeunload", e), document.removeEventListener("pointerdown", O, !0), document.removeEventListener("focusin", O, !0), window.removeEventListener("blur", D), W(b)?.destroy?.();
		};
	});
	async function le(e, t = "confirm", n = !1) {
		try {
			let r = n ? W(l).retry() : t === "clear_all" ? W(l).beginClearAll() : W(l).begin(e, t);
			n || T.delete(r.decision_id), A(), R(f, "保存中…");
			let i;
			try {
				i = await s().request(r);
			} catch (e) {
				W(l).failed(), A(), R(f, `尚未收到操作結果：${e.message}。請查詢／重送同一筆操作；這不會復原舊答案。`);
				return;
			}
			if (W(l).complete(i), A(), R(f, i.ok ? i.status === "already_applied" ? "原操作已完成；以下顯示目前最新狀態。" : r.operation === "clear_all" ? "已清除全部答案與理由，以下顯示最新狀態。" : "已保存；以下顯示最新狀態。" : i.error.message), !i.ok) {
				T.delete(r.decision_id), R(S, /* @__PURE__ */ new Set([...W(S), r.decision_id])), R(C, !0);
				try {
					let e = await s().load();
					e.ok && (W(l).merge(e), A());
				} catch (e) {
					R(f, e.message);
				} finally {
					R(C, !1);
				}
			}
			if (r.operation === "clear_all") {
				i.ok && (T.clear(), R(S, /* @__PURE__ */ new Set()), D());
				return;
			}
			let a = [...T].find((e) => !W(S).has(e) && W(l).saveOperation(e));
			a && await le(a, W(l).saveOperation(a));
		} catch (e) {
			R(f, e.message);
		}
	}
	async function de() {
		let e = W(i).find((e) => e.status === "pending");
		e && (W(_).selected.has("pending") || y(Ta(W(_), "pending")), oe(e.id, !0), await hr(), W(g)?.revealCard(e.id), await hr(), document.getElementById(`decision-${e.id}`)?.focus());
	}
	On(() => W(u), () => {
		R(i, W(u)?.snapshot.document.decisions ?? []);
	}), On(() => (W(u), W(C), W(i)), () => {
		R(n, !!W(u) && !W(u).pending && !W(u).busy && !W(C) && (W(i).some((e) => e.answer) || W(u).dirty));
	}), On(() => (W(i), W(E), W(_)), () => {
		R(r, W(i).filter((e) => W(E) ? W(E).includes(e.id) : W(_).selected.has(e.status)));
	}), On(() => W(u), () => {
		R(a, !!W(u)?.dirty || !!W(u)?.pending);
	}), On(() => (K(c()), W(a), W(u), W(w), W(C)), () => {
		c()({
			dirty: W(a),
			saving: !!W(u)?.busy,
			pending: !!W(u)?.pending || W(w) || W(C)
		});
	}), On(() => W(u), () => {
		R(o, W(u) ? `taskprogress.decisions:${W(u).snapshot.document_key}` : null);
	}), kn(), Di();
	var fe = To(), pe = pn(fe);
	ca(pe, {});
	var me = B(pe, 2), he = z(me), ge = B(z(he), 2), _e = (e) => {
		Xa(e, {
			get mode() {
				return W(x), G(() => W(x).mode);
			},
			get custom() {
				return W(x), G(() => W(x).custom);
			},
			get systemScheme() {
				return W(x), G(() => W(x).systemScheme);
			},
			onModeChange: (e) => {
				W(b).setMode(e), k();
			},
			onApplyCustom: (e) => {
				W(b).applyCustom(e), k();
			}
		});
	};
	Z(ge, (e) => {
		W(x) && e(_e);
	}), N(he);
	var ve = B(he, 2), ye = (e) => {
		var t = io(), n = z(t, !0);
		N(t), V(() => X(n, W(f))), Y(e, t);
	};
	Z(ve, (e) => {
		W(f) && e(ye);
	});
	var be = B(ve, 2), xe = (e) => {
		var t = so(), n = pn(t), r = z(n);
		N(n);
		var i = B(n, 2);
		Gr(i, 1, () => (W(d), G(() => W(d).files)), Vr, (e, t) => {
			var n = ao(), r = z(n), i = z(r, !0);
			N(r);
			var a = B(r, 2), o = z(a, !0);
			N(a), N(n), V((e) => {
				Q(r, "href", e), X(i, (W(t), G(() => W(t).task_id))), X(o, (W(t), G(() => W(t).error ?? `待決策 ${W(t).pending}／全部 ${W(t).total}`)));
			}, [() => (W(d), W(t), G(() => `?scope=${encodeURIComponent(W(d).scope_id)}&task=${encodeURIComponent(W(t).task_id)}`))]), Y(e, n);
		});
		var a = B(i, 2), o = (e) => {
			Y(e, oo());
		};
		Z(a, (e) => {
			W(d), G(() => !W(d).files.length) && e(o);
		}), V(() => X(r, `待決策 ${W(d), G(() => W(d).pending) ?? ""}${W(d), G(() => W(d).incomplete ? "（統計不完整）" : "") ?? ""}`)), Y(e, t);
	}, Se = (e) => {
		var t = Co(), a = pn(t), s = z(a), c = z(s);
		N(s), Ne(2), N(a);
		var d = B(a, 2), f = z(d), v = B(f, 2);
		N(d);
		var b = B(d, 2), x = (e) => {
			var t = co(), n = z(t, !0);
			N(t), V(() => X(n, (W(u), G(() => W(u).pending.operation === "clear_all" ? "查詢／重送清除操作" : "查詢／重送保存操作")))), q("click", t, () => le(null, null, !0)), Y(e, t);
		};
		Z(b, (e) => {
			W(u), G(() => W(u).pending && !W(u).busy) && e(x);
		});
		var T = B(b, 2), te = (e) => {
			Y(e, lo());
		};
		Z(T, (e) => {
			W(r), G(() => !W(r).length) && e(te);
		});
		var D = B(T, 2);
		{
			let e = /* @__PURE__ */ F(() => (W(r), G(() => W(r).map((e) => ({
				...e,
				title: e.question
			}))))), t = /* @__PURE__ */ F(() => (W(i), G(() => W(i).map((e) => e.id))));
			Ei(aa(D, {
				get items() {
					return W(e);
				},
				get allIds() {
					return W(t);
				},
				get storageKey() {
					return W(o);
				},
				get heldOrder() {
					return W(E);
				},
				get expanded() {
					return W(p);
				},
				onToggleAll: se,
				children: ue,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ F(() => t.item), r = /* @__PURE__ */ F(() => t.visibilityEnabled), i = /* @__PURE__ */ F(() => t.visible), a = /* @__PURE__ */ F(() => t.onVisibleChange), o = /* @__PURE__ */ F(() => (W(u), K(W(n)), G(() => Object.hasOwn(W(u).drafts, W(n).id) ? W(u).drafts[W(n).id] : null))), s = /* @__PURE__ */ F(() => (K(W(o)), K(W(n)), G(() => W(o) ? W(o).choice : W(n).answer?.kind === "other" ? "__other" : W(n).answer?.option_id ?? "")));
						var c = xo();
						let d;
						var f = z(c);
						{
							let e = /* @__PURE__ */ F(() => (W(m), K(W(n)), W(p), G(() => W(m)[W(n).id] ?? W(p)))), t = /* @__PURE__ */ F(() => (K(W(n)), G(() => `body-${W(n).id}`)));
							pa(f, {
								get visibilityEnabled() {
									return W(r);
								},
								get visible() {
									return W(i);
								},
								get onVisibleChange() {
									return W(a);
								},
								get expanded() {
									return W(e);
								},
								onToggle: (e) => oe(W(n).id, e),
								get contentId() {
									return W(t);
								},
								get label() {
									return K(W(n)), G(() => W(n).question);
								},
								children: (e, t) => {
									var r = yo(), i = z(r), a = (e) => {
										var t = po(), r = z(t), i = (e) => {
											var t = uo(), r = z(t, !0);
											N(t), V(() => X(r, (K(W(n)), G(() => W(n).context)))), Y(e, t);
										};
										Z(r, (e) => {
											K(W(n)), G(() => W(n).context) && e(i);
										});
										var a = B(r, 2), o = (e) => {
											var t = fo(), r = z(t);
											N(t), V((e) => X(r, `建議：${e ?? ""} — ${K(W(n)), G(() => W(n).recommendation.reason) ?? ""}`), [() => (K(W(n)), G(() => W(n).options.find((e) => e.id === W(n).recommendation.option_id)?.label))]), Y(e, t);
										};
										Z(a, (e) => {
											K(W(n)), G(() => W(n).recommendation) && e(o);
										}), N(t), Y(e, t);
									};
									Z(i, (e) => {
										K(W(n)), G(() => W(n).context || W(n).recommendation) && e(a);
									});
									var c = B(i, 2), d = z(c), f = z(d, !0);
									N(d);
									var p = B(d, 2);
									Gr(p, 1, () => (K(W(n)), G(() => W(n).options)), Vr, (e, t, r) => {
										var i = ho(), a = z(i);
										vi(a);
										var o = B(a, 2), c = z(o), l = B(c), u = (e) => {
											var n = mo(), r = z(n, !0);
											N(n), V(() => X(r, (W(t), G(() => W(t).description)))), Y(e, n);
										};
										Z(l, (e) => {
											W(t), G(() => W(t).description) && e(u);
										}), N(o), N(i), V((e) => {
											Q(a, "name", (K(W(n)), G(() => `answer-${W(n).id}`))), bi(a, (K(W(s)), W(t), G(() => W(s) === W(t).id))), X(c, `${e ?? ""}　${W(t), G(() => W(t).label) ?? ""}${W(t), K(W(n)), G(() => W(t).id === W(n).recommendation?.option_id ? "（建議）" : "") ?? ""} `);
										}, [() => G(() => String.fromCharCode(65 + r))]), q("change", a, () => ie(W(n).id, W(t).id)), Y(e, i);
									});
									var m = B(p, 2), h = (e) => {
										var t = go(), r = pn(t), i = z(r);
										vi(i), Ne(), N(r);
										var a = B(r, 2), c = z(a), l = B(c);
										it(l), N(a), V(() => {
											Q(i, "name", (K(W(n)), G(() => `answer-${W(n).id}`))), bi(i, W(s) === "__other"), Q(c, "for", (K(W(n)), G(() => `other-${W(n).id}`))), Q(l, "id", (K(W(n)), G(() => `other-${W(n).id}`))), yi(l, (K(W(o)), K(W(n)), G(() => W(o) ? W(o).other : W(n).answer?.kind === "other" ? W(n).answer.text : "")));
										}), q("change", i, async () => {
											ie(W(n).id, "__other"), await hr(), W(ee) === W(n).id && document.getElementById(`other-${W(n).id}`)?.focus();
										}), q("input", l, (e) => ae(W(n).id, e.currentTarget.value)), Y(e, t);
									};
									Z(m, (e) => {
										K(W(n)), G(() => W(n).allow_other) && e(h);
									}), N(c);
									var g = B(c, 2), _ = (e) => {
										var t = _o(), r = pn(t), i = z(r);
										N(r);
										var a = B(r, 2);
										V(() => {
											X(i, `此題已變更，原草稿保留：${K(W(o)), G(() => W(o).choice) ?? ""} ${K(W(o)), G(() => W(o).other) ?? ""}`), a.disabled = (W(C), W(u), G(() => W(C) || !!W(u).pending));
										}), q("click", a, () => {
											W(l).rebase(W(n).id), A(), re(W(n).id);
										}), Y(e, t);
									};
									Z(g, (e) => {
										K(W(o)), G(() => W(o)?.conflict) && e(_);
									});
									var v = B(g, 2), y = z(v), b = (e) => {
										var t = vo();
										V(() => t.disabled = W(C)), q("click", t, () => re(W(n).id)), Y(e, t);
									}, x = /* @__PURE__ */ bt(() => (W(S), K(W(n)), K(W(o)), W(u), G(() => W(S).has(W(n).id) && W(o) && !W(o).conflict && !W(u).pending)));
									Z(y, (e) => {
										W(x) && e(b);
									}), N(v), N(r), V(() => {
										c.disabled = (W(C), W(u), K(W(o)), G(() => W(C) || W(u).pending?.operation === "clear_all" || !!W(u).pending && !W(u).busy || W(o)?.conflict)), X(f, (K(W(n)), G(() => W(n).question)));
									}), Y(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = bo(), i = z(r), a = z(i, !0);
										N(i);
										var o = B(i), s = z(o, !0);
										N(o), N(r), V(() => {
											Q(i, "id", (K(W(n)), G(() => `decision-${W(n).id}`))), X(a, (K(W(n)), G(() => W(n).question))), X(s, (K(W(n)), G(() => W(n).status === "pending" ? "待決策" : "已決策")));
										}), Y(e, r);
									}
								}
							});
						}
						N(c), V(() => d = si(c, 1, "checklist-item decision-card svelte-17meywc", null, d, { "decision-has-visibility": W(r) })), Y(e, c);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ F(() => [
								ya,
								"pending",
								"decided"
							]), n = /* @__PURE__ */ F(() => (K(wa), W(_), G(() => wa(W(_)))));
							Da(e, {
								categories: [{
									id: "pending",
									label: "待決策"
								}, {
									id: "decided",
									label: "已決策"
								}],
								get order() {
									return W(t);
								},
								get selected() {
									return W(_), G(() => W(_).selected);
								},
								get defaultLit() {
									return W(n);
								},
								defaultLabel: "全部",
								onSelect: (e) => y(Ta(W(_), e)),
								onSelectDefault: () => y(Ea(W(_)))
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => R(g, e), () => W(g));
		}
		Gr(B(D, 2), 1, () => (W(u), W(i), G(() => Object.entries(W(u).drafts).filter(([e]) => !W(i).some((t) => t.id === e)))), Vr, (e, t) => {
			var n = /* @__PURE__ */ bt(() => h(W(t), 2));
			let r = () => W(n)[0], i = () => W(n)[1];
			var a = So(), o = pn(a), s = z(o);
			N(o);
			var c = B(o, 2);
			V(() => X(s, `已移除題目 ${r() ?? ""} 的原草稿：${i(), G(() => i().choice) ?? ""} ${i(), G(() => i().other) ?? ""}`)), q("click", c, () => {
				W(l).discard(r()), A();
			}), Y(e, a);
		}), V((e, t) => {
			X(c, `待決策 ${e ?? ""}／全部 ${W(i), G(() => W(i).length) ?? ""}`), f.disabled = t, v.disabled = !W(n);
		}, [() => (W(i), G(() => W(i).filter((e) => e.status === "pending").length)), () => (W(i), G(() => !W(i).some((e) => e.status === "pending")))]), q("click", f, de), q("click", v, () => {
			W(n) && R(w, !0);
		}), Y(e, t);
	};
	Z(be, (e) => {
		W(d) ? e(xe) : W(u) && e(Se, 1);
	}), N(me), Ei(me, (e) => R(te, e), () => W(te)), ua(B(me, 2), {
		get open() {
			return W(w);
		},
		title: "清除全部決策答案？",
		titleId: "decision-clear-title",
		kicker: "決策項目",
		onClose: () => {
			R(w, !1);
		},
		children: ue,
		$$slots: { default: (e, t) => {
			let r = /* @__PURE__ */ F(() => t.close);
			var a = wo(), o = pn(a), s = z(o);
			N(o);
			var c = B(o, 4), l = z(c), d = B(l, 2);
			N(c), V(() => {
				X(s, `將清除目前文件「${W(u), G(() => W(u)?.snapshot.document.task_id) ?? ""}」全部 ${W(i), G(() => W(i).length) ?? ""} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。`), d.disabled = !W(n);
			}), Tr("submit", c, (e) => {
				e.preventDefault(), W(n) && (W(r)(), le(null, "clear_all"));
			}), q("click", l, function(...e) {
				W(r)?.apply(this, e);
			}), Y(e, a);
		} }
	}), Y(e, fe), Ue();
}
Er([
	"click",
	"change",
	"input"
]);
//#endregion
//#region viewer/assets/decision-transport.js
var Do = (e) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(e ?? "") && e.length <= 100;
function Oo(e, t) {
	if (!Do(e) || t && !Do(t)) throw Error("無效的 scope 或 task。");
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
function ko(e) {
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
function Ao(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function jo({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (Ao(e, "windowTarget"), Ao(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
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
var Mo, No;
try {
	let e = new URLSearchParams(location.search);
	No = window.chrome?.webview ? ko(window.chrome.webview) : Oo(e.get("scope"), e.get("task"));
} catch (e) {
	No = { load: () => Promise.reject(e) };
}
window.chrome?.webview || jo({ canRefresh: () => !Mo?.dirty && !Mo?.saving && !Mo?.pending }), Ir(Eo, {
	target: document.querySelector("#app"),
	props: {
		transport: No,
		onPersistenceChange: (e) => Mo = e
	}
});
//#endregion
