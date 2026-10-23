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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, ee = 65536, te = 1 << 21, ne = 1 << 22, E = 1 << 23, D = Symbol("$state"), re = Symbol("legacy props"), O = Symbol(""), ie = Symbol("attributes"), ae = Symbol("class"), oe = Symbol("style"), se = Symbol("text"), ce = Symbol("form reset"), le = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ue = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function de() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function fe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function me(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function he(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ge() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function _e(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ye(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function be() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function xe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Se() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ce() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var we = {}, k = Symbol("uninitialized"), Te = "http://www.w3.org/1999/xhtml";
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
var A = !1;
function Ae(e) {
	A = e;
}
var j;
function je(e) {
	if (e === null) throw De(), we;
	return j = e;
}
function Me() {
	return je(/* @__PURE__ */ fn(j));
}
function M(e) {
	if (A) {
		if (/* @__PURE__ */ fn(j) !== null) throw De(), we;
		j = e;
	}
}
function Ne(e = 1) {
	if (A) {
		for (var t = e, n = j; t--;) n = /* @__PURE__ */ fn(n);
		j = n;
	}
}
function Pe(e = !0) {
	for (var t = 0, n = j;;) {
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
	if (!e || e.nodeType !== 8) throw De(), we;
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
var N = null;
function Ve(e) {
	N = e;
}
function He(e, t = !1, n) {
	N = {
		p: N,
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
	var t = N, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) wn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, N = t.p, e ?? {};
}
function We() {
	return !ze || N !== null && N.l === null;
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
	if (t === null) return H.f |= E, e;
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
var Ze = ~(g | _ | h);
function Qe(e, t) {
	e.f = e.f & Ze | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? Qe(e, h) : Qe(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ee, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), Qe(e, h);
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
	A && /* @__PURE__ */ dn(e) !== null && mn(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ce]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = H, n = U;
	Yn(null), Xn(null);
	try {
		return e();
	} finally {
		Yn(t), Xn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[ce];
	e[ce] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = qt(0), r;
	return () => {
		xn() && (W(n), An(() => (t === 0 && (r = G(() => e(() => Qt(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ut = S | C;
function dt(e, t, n, r) {
	new ft(e, t, n, r);
}
var ft = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = A ? j : null;
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
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (A) {
				let e = this.#t;
				Me();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), A && (this.#e = j);
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
		qe(r), t && (this.#s = Mn(() => {
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
			t = !0, n && Ce(), this.#s !== null && zn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = un();
			e.append(t), this.#a = this.#S(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, zn(this.#o, () => {
				this.#o = null;
			}), this.#x(F));
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
			} else this.#x(F);
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
		var t = U, n = H, r = N;
		Xn(this.#i), Yn(this.#i), Ve(this.#i.ctx);
		try {
			return It.ensure(), e();
		} catch (e) {
			return Ye(e), null;
		} finally {
			Xn(t), Yn(n), Ve(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && Xt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), W(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		F?.is_fork ? (this.#a && F.skip_effect(this.#a), this.#o && F.skip_effect(this.#o), this.#s && F.skip_effect(this.#s), F.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (In(this.#a), null), this.#o &&= (In(this.#o), null), this.#s &&= (In(this.#s), null), A && (je(this.#t), Ne(), je(Pe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Mn(() => {
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
	let i = We() ? _t : P;
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
	var e = U, t = H, n = N, r = F;
	return function(i = !0) {
		Xn(e), Yn(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Xn(null), Yn(null), Ve(null), e && F?.deactivate();
}
function gt() {
	var e = U, t = e.b, n = F, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | g;
	return U !== null && (U.f |= C), {
		ctx: N,
		deps: null,
		effects: null,
		equals: Ie,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: k,
		wv: 0,
		parent: U,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = U;
	r === null && pe();
	var i = void 0, a = qt(k), o = !H, s = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== le && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = F;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= E, Xt(a, t)) : (a.f & 8388608 && (a.f ^= E), Xt(a, e)), c.deactivate());
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
	return Qn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = Re, t;
}
function xt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) In(t[n]);
	}
}
function St(e) {
	var t, n = U, r = e.parent;
	if (!Kn && r !== null && e.v !== k && r.f & 24576) return Ee(), e.v;
	Xn(r);
	try {
		e.f &= ~ee, xt(e), t = ur(e);
	} finally {
		Xn(n);
	}
	return t;
}
function Ct(e) {
	var t = St(e);
	if (!e.equals(t) && (e.wv = sr(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Dt?.capture(e, t, !0)), e.deps === null))) {
		Qe(e, h);
		return;
	}
	Kn || (Ot === null ? $e(e) : (xn() || F?.is_fork) && Ot.set(e, t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(le), t.ac = null;
	}), t.fn !== null && (t.teardown = d), fr(t, 0), Pn(t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Et = null, F = null, Dt = null, Ot = null, kt = null, At = !1, jt = !1, Mt = null, Nt = null, Pt = 0, Ft = 1, It = class e {
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
			for (var r of n.d) Qe(r, g), t(r);
			for (r of n.m) Qe(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Pt++ > 1e3 && (this.#x(), Rt());
		for (let e of this.#u) this.#d.delete(e), Qe(e, g), this.schedule(e);
		for (let e of this.#d) Qe(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Mt = [], r = [], i = Nt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ut(e), this.#h() || this.discard(), t;
		}
		if (F = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Mt = null, Nt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ht(e, t);
			i.length > 0 && F.#g();
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
		var s = F;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : cr(r) && (i & 16 && this.#d.add(r), pr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), Qe(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), F = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== k && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ot?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, Ot = null;
	}
	flush() {
		try {
			jt = !0, F = this, this.#g();
		} finally {
			Pt = 0, kt = null, Mt = null, Nt = null, jt = !1, F = null, Ot = null, Gt.clear();
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
		if (F === null) {
			let t = F = new e();
			!jt && !At && qe(() => {
				t.#e || t.flush();
			});
		}
		return F;
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
				t.f ^= h;
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
		for (e && (F !== null && !F.is_fork && F.flush(), n = e());;) {
			if (Je(), F === null) return n;
			F.flush();
		}
	} finally {
		At = t;
	}
}
function Rt() {
	try {
		ve();
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
			if (!(r.f & 24576) && cr(r) && (zt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r), zt?.size > 0)) {
				Gt.clear();
				for (let e of zt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) zt.has(n) && (zt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				zt.clear();
			}
		}
		zt = null;
	}
}
function Vt(e) {
	F.schedule(e);
}
function Ht(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), Qe(e, h);
		for (var n = e.first; n !== null;) Ht(n, t), n = n.next;
	}
}
function Ut(e) {
	Qe(e, h);
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
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = qt(e);
	return t || (r.equals = Re), ze && n && N !== null && N.l !== null && (N.l.s ??= []).push(r), r;
}
function Yt(e, t) {
	return L(e, G(() => W(e))), t;
}
function L(e, t, n = !1) {
	return H !== null && (!Jn || H.f & 131072) && We() && H.f & 4325394 && (Zn === null || !Zn.has(e)) && Se(), Xt(e, n ? en(t) : t, Nt);
}
function Xt(e, t, n = null) {
	if (!e.equals(t)) {
		Gt.set(e, Kn ? t : e.v);
		var r = It.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && St(t), Ot === null && $e(t);
		}
		e.wv = sr(), $t(e, g, n), We() && U !== null && U.f & 1024 && !(U.f & 96) && (tr === null ? nr([e]) : tr.push(e)), !r.is_fork && Wt.size > 0 && !Kt && Zt();
	}
	return t;
}
function Zt() {
	Kt = !1;
	for (let e of Wt) {
		e.f & 1024 && Qe(e, _);
		let t;
		try {
			t = cr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Wt.clear();
}
function Qt(e) {
	L(e, e.v + 1);
}
function $t(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = We(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & g) === 0;
			if (l && Qe(s, t), c & 131072) Wt.add(s);
			else if (c & 2) {
				var u = s;
				Ot?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= ee), $t(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && zt !== null && zt.add(d), n === null ? Vt(d) : n.push(d);
			}
		}
	}
}
function en(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Jt(0), u = null, d = ar, f = (e) => {
		if (ar === d) return e();
		var t = H, n = ar;
		Yn(null), or(d);
		var r = e();
		return Yn(t), or(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Jt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Jt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Jt(k, u));
					r.set(t, e), Qt(o);
				}
			} else L(n, k), Qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === D) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Jt(en(s ? e[n] : k), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === k ? void 0 : c;
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
				if (a !== void 0 && o !== k) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === D) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== k || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Jt(i ? en(e[t]) : k, u)), r.set(t, n)), W(n) === k) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Jt(k, u)), r.set(d + "", p)) : L(p, k);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Jt(void 0, u)), L(c, en(n)), r.set(t, c));
			else {
				l = c.v !== k;
				var m = f(() => en(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				Qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== k;
			});
			for (var [n, i] of r) i.v !== k && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			xe();
		}
	});
}
function tn(e) {
	try {
		if (typeof e == "object" && e && D in e) return e[D];
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
		sn = a(t, "firstChild").get, cn = a(t, "nextSibling").get, u(e) && (e[ae] = void 0, e[ie] = null, e[oe] = void 0, e.__e = void 0), u(n) && (n[se] = void 0);
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
function R(e, t) {
	if (!A) return /* @__PURE__ */ dn(e);
	var n = /* @__PURE__ */ dn(j);
	if (n === null) n = j.appendChild(un());
	else if (t && n.nodeType !== 3) {
		var r = un();
		return n?.before(r), je(r), r;
	}
	return t && _n(n), je(n), n;
}
function pn(e, t = !1) {
	if (!A) {
		var n = /* @__PURE__ */ dn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ fn(n) : n;
	}
	if (t) {
		if (j?.nodeType !== 3) {
			var r = un();
			return j?.before(r), je(r), r;
		}
		_n(j);
	}
	return j;
}
function z(e, t = 1, n = !1) {
	let r = A ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ fn(r);
	if (!A) return r;
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
	U === null && (H === null && _e(e), ge()), Kn && he(e);
}
function yn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function bn(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: N,
		deps: null,
		nodes: null,
		f: e | g | 512,
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
	F?.register_created_effect(r);
	var i = r;
	if (e & 4) Mt === null ? It.ensure().schedule(r) : Mt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw In(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && yn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function xn() {
	return H !== null && !Jn;
}
function Sn(e) {
	let t = bn(8, null);
	return Qe(t, h), t.teardown = e, t;
}
function Cn(e) {
	vn("$effect");
	var t = U.f;
	if (!H && t & 32 && N !== null && !N.i) {
		var n = N;
		(n.e ??= []).push(e);
	} else return wn(e);
}
function wn(e) {
	return bn(4 | w, e);
}
function Tn(e) {
	return vn("$effect.pre"), bn(8 | w, e);
}
function En(e) {
	It.ensure();
	let t = bn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? zn(t, () => {
			In(t), n(void 0);
		}) : (In(t), n(void 0));
	});
}
function Dn(e) {
	return bn(4, e);
}
function B(e, t) {
	var n = N, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = An(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				Xn(n.parent), G(t);
			} finally {
				Xn(n);
			}
		}
	});
}
function On() {
	var e = N;
	An(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && Qe(n, _), cr(n) && pr(n), t.ran = !1;
		}
	});
}
function kn(e) {
	return bn(ne | C, e);
}
function An(e, t = 0) {
	return bn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		bn(8, () => {
			e(...t.map(W));
		});
	});
}
function jn(e, t = 0) {
	return bn(16 | t, e);
}
function Mn(e) {
	return bn(32 | C, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Kn, n = H;
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
		e !== null && st(() => {
			e.abort(le);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Pn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Rn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ln(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ fn(e);
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
		e.f ^= v;
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
		e.f ^= v, e.f & 1024 || (Qe(e, g), It.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ fn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Wn = null, Gn = !1, Kn = !1;
function qn(e) {
	Kn = e;
}
var H = null, Jn = !1;
function Yn(e) {
	H = e;
}
var U = null;
function Xn(e) {
	U = e;
}
var Zn = null;
function Qn(e) {
	H !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~ee), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cr(a) && Ct(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ot === null && Qe(e, h);
	}
	return !1;
}
function lr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? lr(a, t, !1) : t === a && (n ? Qe(a, g) : a.f & 1024 && Qe(a, _), Vt(a));
	}
}
function ur(e) {
	var t = $n, n = er, r = tr, i = H, a = Zn, o = N, s = Jn, c = ar, l = e.f;
	$n = null, er = 0, tr = null, H = l & 96 ? null : e, Zn = null, Ve(e.ctx), Jn = !1, ar = ++ir, e.ac !== null && (st(() => {
		e.ac.abort(le);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = F?.is_fork;
		if ($n !== null) {
			var m;
			if (p || fr(e, er), f !== null && er > 0) for (f.length = er + $n.length, m = 0; m < $n.length; m++) f[er + m] = $n[m];
			else e.deps = f = $n;
			if (xn() && e.f & 512) for (m = er; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && er < f.length && (fr(e, er), f.length = er);
		if (We() && tr !== null && !Jn && f !== null && !(e.f & 6146)) for (m = 0; m < tr.length; m++) lr(tr[m], e);
		if (i !== null && i !== e) {
			if (ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ir;
			if (t !== null) for (let e of t) e.rv = ir;
			tr !== null && (r === null ? r = tr : r.push(...tr));
		}
		return e.f & 8388608 && (e.f ^= E), d;
	} catch (e) {
		return Ye(e);
	} finally {
		e.f ^= te, $n = t, er = n, tr = r, H = i, Zn = a, Ve(o), Jn = s, ar = c;
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
		s.f & 512 && (s.f ^= 512, s.f &= ~ee), s.v !== k && $e(s), s.ac !== null && st(() => {
			s.ac.abort(le), s.ac = null, Qe(s, g);
		}), wt(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		Qe(e, h);
		var n = U, r = Gn;
		U = e, Gn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = ur(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = rr;
		} finally {
			Gn = r, U = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), Lt();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Wn?.add(e), H !== null && !Jn && !(U !== null && U.f & 16384) && (Zn === null || !Zn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < ir && (e.rv = ir, $n === null && r !== null && r[er] === e ? er++ : $n === null ? $n = [e] : $n.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Kn && Gt.has(e)) return Gt.get(e);
	if (t) {
		var a = e;
		if (Kn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || gr(a)) && (o = St(a)), Gt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Jn && H !== null && (Gn || !!(H.f & 512)), c = (a.f & b) === 0;
		cr(a) && (s && (a.f |= 512), Ct(a)), s && !c && (Tt(a), hr(a));
	}
	if (Ot?.has(e)) return Ot.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tt(t), hr(t));
}
function gr(e) {
	if (e.v === k) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Gt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function G(e) {
	var t = Jn;
	try {
		return Jn = !0, e();
	} finally {
		Jn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) _r(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && _r(n);
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
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Sn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
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
		var d = H, f = U;
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
	var t = gn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
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
		if (A) return jr(j, null), j;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ dn(i)));
		var t = r || on ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ dn(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Mr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (A) return jr(j, null), j;
		if (!o) {
			var e = /* @__PURE__ */ dn(Ar(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ dn(e);) o.appendChild(/* @__PURE__ */ dn(e));
			else o = /* @__PURE__ */ dn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ dn(t), r = t.lastChild;
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
	if (A) return jr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = un();
	return e.append(t, n), jr(t, n), e;
}
function Y(e, t) {
	if (A) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = j), Me();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[se] ??= e.nodeValue) && (e[se] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	ln();
	var l = void 0, u = En(() => {
		var s = n ?? t.appendChild(un());
		dt(s, { pending: () => {} }, (t) => {
			He({});
			var n = N;
			if (o && (n.c = o), a && (i.$$events = a), A && jr(t, null), l = e(t, i) || {}, A && (U.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw De(), we;
			Ue();
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
						Un(r, t), t.append(un()), this.#n.set(e, {
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
		var n = F, r = hn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = un();
			i.append(a), this.#n.set(e, {
				effect: Mn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Mn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else A && (this.anchor = j), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	A && (r = j, Me());
	var i = new zr(e), a = n ? S : 0;
	function o(e, t) {
		if (A) {
			var n = Fe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Pe();
				je(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
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
function Br(e, t) {
	return t;
}
function Vr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		zn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Hr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
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
		Hr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Hr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Un(a, document.createDocumentFragment())) : In(t[i], n);
	}
}
var Ur;
function Wr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = A ? je(/* @__PURE__ */ dn(u)) : u.appendChild(un());
	}
	A && Me();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Kr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Jr(d, null, c)) : Vn(d) : zn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			A && Fe(c) === "[!" != (e === 0) && (c = Pe(), je(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = hn(), y = 0; y < e; y += 1) {
				A && j.nodeType === 8 && j.data === "]" && (c = j, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Xt(S.v, b), S.i && Xt(S.i, y), v && u.unskip_effect(S.e)) : (S = qr(l, h ? c : Ur ??= un(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Mn(() => s(c)) : (d = Mn(() => s(Ur ??= un())), d.f |= T)), e > r.size && me("", "", ""), A && e > 0 && je(Pe()), !h) if (m.set(u, r), v) {
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
	h = !1, A && (c = j);
}
function Gr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Kr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Gr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Vn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Jr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Yr(e, d, _), Yr(e, _, y), Jr(_, y, n), d = _, p = [], m = [], l = Gr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Jr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Yr(e, S.prev, C.next), Yr(e, d, S), Yr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Jr(_, l, n), Yr(e, _.prev, _.next), Yr(e, _, d === null ? e.effect.first : d.next), Yr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Gr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Gr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Hr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Gr(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			Vr(e, w, te);
		}
	}
	o && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? qt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? qt(i) : null;
	return {
		v: c,
		i: l,
		e: Mn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Jr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ fn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Yr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function Xr(e, t, n, r, i) {
	A && Me();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Zr(e, t, n) {
	Dn(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			An(() => {
				var e = n();
				K(e), i && Le(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Qr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Qr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function $r() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Qr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ei(e) {
	return typeof e == "object" ? $r(e) : e ?? "";
}
var ti = [..." 	\n\r\f\xA0\v﻿"];
function ni(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ti.includes(r[o - 1])) && (s === r.length || ti.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ri(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ii(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ai(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ii)), i && c.push(...Object.keys(i).map(ii));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ii(e.substring(l, u).trim());
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
		return r && (n += ri(r)), i && (n += ri(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function oi(e, t, n, r, i, a) {
	var o = e[ae];
	if (A || o !== n || o === void 0) {
		var s = ni(n, r, a);
		(!A || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ae] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function si(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ci(e, t, n, r) {
	var i = e[oe];
	if (A || i !== t) {
		var a = ai(t, r);
		(!A || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[oe] = t;
	} else r && (Array.isArray(r) ? (si(e, n?.[0], r[0]), si(e, n?.[1], r[1], "important")) : si(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Oe();
		for (var i of t.options) i.selected = n.includes(fi(i));
		return;
	}
	for (i of t.options) if (nn(fi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function ui(e) {
	var t = new MutationObserver(() => {
		"__value" in e && li(e, e.__value);
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
function di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), fi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && fi(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), Dn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
			if (r.has(o)) return;
		}
		if (li(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = fi(s), n(a));
		}
		e.__value = a, i = !1;
	}), ui(e);
}
function fi(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = ue ? "link" : "LINK", gi = ue ? "progress" : "PROGRESS";
function _i(e) {
	if (A) {
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
		e[ce] = n, qe(n), ot();
	}
}
function vi(e, t) {
	var n = yi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === gi) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = yi(e);
	A && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[O] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[ie] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === Te
	};
}
var bi = /* @__PURE__ */ new Map();
function xi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = bi.get(t);
	if (n) return n;
	bi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Si(e, t, n = t) {
	ct(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (A && e.defaultChecked !== e.checked || G(t) == null) && n(e.checked), An(() => {
		e.checked = !!t();
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function Ci(e, t, n) {
	var r = a(e, t);
	r && r.set && (e[t] = n, Sn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function wi(e, t) {
	return e === t || e?.[D] === t;
}
function Ti(e = {}, t, n, r) {
	var i = N.r, a = U;
	return Dn(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], G(() => {
				wi(n(...s), e) || (t(e, ...s), o && wi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && wi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ei(e = !1) {
	let t = N, n = t.l.u;
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
		Di(t, r), p(n.b);
	}), Cn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Cn(() => {
		Di(t, r), p(n.a);
	});
}
function Di(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !ze || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = D in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ye(t), f(m)));
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
	var v = !1, y = (n & 1 ? _t : P)(() => (v = !1, g()));
	o && W(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? en(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Kn && v || b.f & 16384 ? y.v : W(y);
	});
}
function Oi(e) {
	N === null && fe("onMount"), ze && N.l !== null ? Ai(N).m.push(e) : Cn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function ki(e) {
	N === null && fe("onDestroy"), Oi(() => () => G(e));
}
function Ai(e) {
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
//#region viewer/assets/card-disclosure-state.js
function ji(e, t) {
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
function Mi(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region viewer/assets/editor-transaction-runtime.js
(function(e) {
	let t = (e) => structuredClone(e), n = (e) => JSON.stringify(e);
	function r(e, { derive: r = () => ({}), normalize: i = (e) => e, historyLimit: a = 100 } = {}) {
		let o, s, c, l, u = [], d = [], f = Number.isInteger(a) && a > 0 ? a : 100, p = !1, m = 1;
		function h() {
			u.length = 0, d.length = 0, p = !1;
		}
		function g() {
			return Object.freeze({
				canUndo: u.length > 0,
				canRedo: d.length > 0,
				undoDepth: u.length,
				redoDepth: d.length,
				undoCommandType: u.at(-1)?.command.type ?? null,
				redoCommandType: d.at(-1)?.command.type ?? null
			});
		}
		function _(e, i, a = "") {
			if (!e || typeof e != "object" || typeof i != "function") throw TypeError("Editor transaction 需要 command 與 reducer。");
			let o = t(c), h = t(i(t(c), e));
			if (n(o) === n(h)) return !1;
			let g = r(h, s), _ = {
				before: o,
				after: t(h),
				command: t(e),
				mergeKey: a
			}, v = u.at(-1);
			return _.id = p && a && v?.mergeKey === a ? v.id : m++, p && a && v?.mergeKey === a ? (_.before = v.before, u.pop(), n(_.before) !== n(_.after) && u.push(_)) : (u.push(_), u.length > f && u.shift()), d.length = 0, p = !0, c = h, l = g, !0;
		}
		function v(e, n, i) {
			let a = e.at(-1);
			if (!a) return !1;
			let o = t(a[i]), u = r(o, s);
			return e.pop(), n.push(a), c = o, l = u, p = !1, !0;
		}
		function y(e, n = !1) {
			let a = t(e), u = t(i(t(a))), d = t(u), f = r(u, d);
			o = a, s = d, c = u, l = f, n || h(), p = !1;
		}
		return y(e), Object.freeze({
			get draft() {
				return c;
			},
			get derived() {
				return l;
			},
			get dirty() {
				return n(c) !== n(s);
			},
			get history() {
				return g();
			},
			get historyEntries() {
				return [...u.map((e) => ({
					id: e.id,
					command: t(e.command),
					applied: !0
				})), ...[...d].reverse().map((e) => ({
					id: e.id,
					command: t(e.command),
					applied: !1
				}))];
			},
			clearHistory: h,
			apply: _,
			undo() {
				return v(u, d, "before");
			},
			redo() {
				return v(d, u, "after");
			},
			discard() {
				y(o);
			},
			commit(e, { keepHistory: t = !1 } = {}) {
				y(e, t);
			}
		});
	}
	e.TaskProgressEditorTransactionRuntime = Object.freeze({ createEditorTransaction: r });
})(globalThis);
//#endregion
//#region viewer/assets/editor-transaction.js
var { createEditorTransaction: Ni } = globalThis.TaskProgressEditorTransactionRuntime, Pi = "__default__";
function Fi(e) {
	return [...new Set(e)];
}
function Ii(e = []) {
	let t = Fi(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Li(e, t, n, r = t) {
	let i = Ii(t), a = Object.freeze({
		tags: i.tags,
		selected: new Set(r.filter((e) => i.tags.includes(e)))
	});
	if (!e) return a;
	try {
		let t = JSON.parse((n ?? globalThis.sessionStorage).getItem(e));
		return !Array.isArray(t) || !t.every((e) => typeof e == "string") ? a : Object.freeze({
			tags: a.tags,
			selected: new Set(t.filter((e) => a.tags.includes(e)))
		});
	} catch {
		return a;
	}
}
function Ri(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function zi(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function Bi(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Vi(e) {
	let t = zi(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
function Hi(e = []) {
	let t = e.indexOf(Pi);
	return t === -1 ? [...e] : e.slice(0, t);
}
//#endregion
//#region viewer/assets/capsule-order.js
function Ui(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Wi(e, t, n) {
	if (!e) return Ui(null, n);
	try {
		return Ui(JSON.parse(e.getItem(t) ?? "null"), n);
	} catch {
		return Ui(null, n);
	}
}
function Gi(e, t, n) {
	if (!e) return !1;
	try {
		return e.setItem(t, JSON.stringify(n)), !0;
	} catch {
		return !1;
	}
}
function Ki(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/status-order.js
function qi(e, t, n = (e) => e.status) {
	let r = new Map(t.map((e, t) => [e, t]));
	return [...e].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, i) => (r.get(n(e.item)) ?? t.length) - (r.get(n(i.item)) ?? t.length) || e.index - i.index).map(({ item: e }) => e);
}
Object.freeze({
	planned: "pending_items",
	done: "completed_items"
});
function Ji(e, t, n = (e) => e.status, r = (e) => e) {
	if (t.length === 0) return r([...e]);
	let i = [], a = [];
	for (let r of e) (t.includes(n(r)) ? i : a).push(r);
	return [...qi(r(i), t, n), ...r(a)];
}
//#endregion
//#region viewer/assets/checklist-editor.js
function Yi(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function Xi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function Zi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = Xi(e), e.progress = {
			passed: e.checks.filter((e) => e.status === "passed").length,
			total: e.checks.length
		};
	}), t;
}
function Qi(e, t) {
	return (e.dependsOn ?? []).some((e) => Xi(t.get(e) ?? { checks: [] }) !== "passed");
}
function $i(e) {
	let t = e?.items ?? [], n = new Map(t.map((e) => [e.id, e])), r = [], i = {
		total: 0,
		passed: 0,
		failed: 0,
		pending: 0
	}, a = {
		total: t.length,
		passed: 0,
		failed: 0,
		pending: 0
	}, o = null, s = null;
	return t.forEach((e) => {
		a[Xi(e)] += 1;
		let t = Qi(e, n);
		e.checks.forEach((n) => {
			i.total += 1, i[n.status] = (i[n.status] ?? 0) + 1, r.push(n.status);
			let a = {
				workItemId: e.id,
				checkIndex: n.index,
				itemTitle: e.title,
				title: n.title,
				action: n.action,
				expect: n.expect,
				isManual: n.isManual,
				isAcceptance: !!n.isAcceptance
			};
			n.status === "failed" && !o && (o = a), n.status === "pending" && !t && !s && (s = a);
		});
	}), Object.freeze({
		items: Object.freeze(a),
		checks: Object.freeze(i),
		cells: Object.freeze(r),
		nextStep: o ?? s ?? null
	});
}
var ea = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
}, ta = Object.freeze(["implementation", "condition"]);
function na(e) {
	return !!(e?.isManual || e?.isAcceptance);
}
function ra(e, t) {
	let n = (e?.items ?? []).flatMap((e) => e.checks ?? []), r = n.filter((e) => !na(e)).every((e) => e.status === "passed"), i = n.filter((e) => e.isAcceptance).every((e) => e.status === "passed" && (e.validity ?? "valid") === "valid");
	return t?.isAcceptance && !r || t?.isManual && !r ? "等執行者的檢查全部完成" : t?.isManual && !i ? "等他驗全部通過" : null;
}
function ia(e, t) {
	let { item: n, check: r } = Yi(e, t.workItemId, t.checkIndex);
	if (!na(r)) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let n = t.type === "cycle-result" ? ea[r.status] ?? "pending" : t.status;
		if (![
			"pending",
			"passed",
			"failed"
		].includes(n)) throw Error("不支援的檢查狀態。");
		let i = n === "pending" ? null : ra(e, r);
		if (i) throw Error(`「${r.title}」還不能記錄：${i}。`);
		r.status = n, n === "failed" ? r.isAcceptance && (r.rejectReason = r.rejectReason ?? "implementation") : (r.observed = null, r.resolved = null, r.rejectReason = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else if (t.type === "set-reason") {
		if (!r.isAcceptance || r.status !== "failed") throw Error("只有不通過的 [acceptance] 可以選擇原因。");
		if (!ta.includes(t.value)) throw Error("原因只能是實作不符或條件不符。");
		r.rejectReason = t.value;
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = Xi(n), e;
}
function aa(e) {
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter(na)
		})).filter((e) => e.checks.length > 0)
	};
}
function oa(e) {
	let t = Zi(e);
	return delete t.revision, t;
}
var sa = Object.freeze({ status: Object.freeze([
	"pending",
	"passed",
	"failed"
]) });
function ca(e, t) {
	let n = new Set(t ?? []);
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => n.has(e.status))
		})).filter((e) => e.checks.length > 0)
	};
}
function la(e, t = []) {
	let n = Hi(t).filter((e) => sa.status.includes(e));
	return n.length === 0 ? e : {
		...e,
		items: Ji(e.items, n, Xi)
	};
}
function ua(e) {
	let t = e.items.flatMap((e) => e.checks);
	return sa.status.map((e) => ({
		id: e,
		count: t.filter((t) => t.status === e).length
	}));
}
function da(e) {
	let t = structuredClone(e);
	return t.items?.forEach((e) => e.checks?.forEach((e) => {
		e.status = e.effectiveStatus ?? e.status;
	})), t;
}
function fa(e, t = {}) {
	let n = da(e), r = structuredClone(n), i = Ni(n, {
		normalize: oa,
		derive: Zi,
		historyLimit: t.historyLimit
	});
	function a() {
		let e = structuredClone(i.derived);
		return e.revision = r.revision, Object.freeze({
			document: e,
			summary: $i(e),
			dirty: i.dirty,
			history: i.history
		});
	}
	function o(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return i.apply(e, ia, t), a();
	}
	function s() {
		let e = [], t = [];
		return i.derived.items.forEach((n) => n.checks.forEach((i) => {
			if (!na(i)) return;
			let a = String(i.observed ?? "").trim(), o = Yi(r, n.id, i.index).check, s = String(o.observed ?? "").trim();
			if (i.status === o.status && a === s && (i.rejectReason ?? null) === (o.rejectReason ?? null)) return;
			if (i.status === "failed" && !a) {
				t.push({
					code: "observed_required",
					workItemId: n.id,
					checkIndex: i.index,
					message: `「${i.title}」失敗時必須填寫 Observed。`
				});
				return;
			}
			let c = {
				workItemId: n.id,
				checkIndex: i.index,
				status: i.status,
				observed: i.status === "failed" ? a : null
			};
			i.isAcceptance && i.status === "failed" && (c.reason = i.rejectReason ?? "implementation"), e.push(c);
		})), i.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的實機檢查結果。"
		}), Object.freeze({
			revision: r.revision,
			results: e,
			errors: t
		});
	}
	return Object.freeze({
		snapshot: a,
		dispatch: o,
		prepareSave: s,
		undo() {
			return i.undo(), a();
		},
		redo() {
			return i.redo(), a();
		},
		discard() {
			return i.discard(), a();
		},
		commit(e) {
			let t = da(e);
			return i.commit(t, { keepHistory: !0 }), r = t, a();
		}
	});
}
//#endregion
//#region viewer/assets/completed-stacking.js
function pa(e) {
	let t = typeof e == "string" ? Date.parse(e) : NaN;
	return Number.isNaN(t) ? null : t;
}
function ma(e) {
	if (typeof e?.status == "string") return e.status === "passed";
	let t = e?.checks ?? [];
	return t.length > 0 && t.every((e) => e?.status === "passed");
}
function ha(e) {
	return (e?.checks ?? []).reduce((e, t) => {
		if (t?.status !== "passed" || (t.validity ?? "valid") !== "valid") return e;
		let n = pa(t.recordedAt);
		return n !== null && (e === null || n > e) ? n : e;
	}, null);
}
function ga(e, { asWritten: t = !0 } = {}) {
	let n = (e ?? []).map((e, t) => ({
		item: e,
		index: t
	})), r = [...n.filter(({ item: e }) => ma(e))].sort((e, t) => {
		let n = ha(e.item), r = ha(t.item);
		return n !== null && r !== null ? r - n || e.index - t.index : n === null ? r === null ? e.index - t.index : 1 : -1;
	});
	if (t) return [...n.filter(({ item: e }) => !ma(e)), ...r].map(({ item: e }) => e);
	let i = 0;
	return n.map((e) => ma(e.item) ? r[i++].item : e.item);
}
//#endregion
//#region viewer/assets/persistence-mode.js
var _a = "task-progress.cautious-mode.v1", va = "自動儲存模式。", ya = "謹慎模式：修改後需按儲存。", ba = "有尚未儲存的變更。", xa = "即將自動儲存…", Sa = "正在寫入…", Ca = "已儲存。", wa = "已放棄尚未儲存的變更。", Ta = "沒有需要儲存的變更。", Ea = "儲存失敗。", Da = "已取消儲存；草稿仍保留。", Oa = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function ka(e = globalThis.localStorage) {
	try {
		return e?.getItem(_a) === "true";
	} catch {
		return !1;
	}
}
function Aa(e, t) {
	let n = t === !0;
	try {
		e?.setItem(_a, n ? "true" : "false");
	} catch {}
	return n;
}
function ja({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, confirmSave: a = null, timers: o = globalThis, onChange: s = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let c = ka(n), l = "idle", u = c ? ya : va, d = !1, f = null, p = Promise.resolve(), m = 0, h = () => e.snapshot();
	function g() {
		let e = h();
		return Object.freeze({
			...e,
			mode: c ? "cautious" : "auto",
			cautious: c,
			status: l,
			message: u,
			blocked: d,
			saving: l === "saving",
			pending: f !== null || m > 0
		});
	}
	function _() {
		s(g());
	}
	function v(e, t) {
		l = e, u = t;
	}
	function y() {
		f !== null && (o.clearTimeout(f), f = null);
	}
	async function b(n) {
		if (d && !n) return;
		if (!h().dirty) {
			n && (v("idle", Ta), _());
			return;
		}
		let r = e.prepareSave(), i = Array.isArray(r.errors) ? r.errors : [];
		if (i.length) {
			v("incomplete", i[0].message), _();
			return;
		}
		let { errors: o, ...s } = r;
		if (typeof a == "function" && await a(s, { manual: n }) === !1) {
			v("cancelled", Da), _();
			return;
		}
		d = !1, v("saving", Sa), _();
		try {
			let n = await t(s);
			e.commit(n), v("saved", Ca);
		} catch (e) {
			d = !0, v(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Ea);
		}
		_();
	}
	function x(e = !1) {
		return y(), m += 1, p = p.then(() => b(e)).catch((e) => {
			d = !0, v("error", e?.message ?? Ea), _();
		}).finally(() => {
			--m, _();
		}), p;
	}
	async function S() {
		for (let e = 0; e < 8; e += 1) if (f !== null && x(), await p, f === null && m === 0) return;
	}
	function C(e) {
		return c ? (d || v("draft", ba), null) : d ? null : e ? (y(), v("pending", xa), f = o.setTimeout(() => {
			f = null, x();
		}, r), null) : x();
	}
	function w(e) {
		let t = C(e);
		return _(), t;
	}
	async function T(e) {
		let t = e === !0;
		if (t === c) return g();
		if (t) await S(), c = !0;
		else {
			if (h().dirty) return v("mode_blocked", Oa), _(), g();
			c = !1;
		}
		return Aa(n, c), d || v("idle", c ? ya : va), _(), g();
	}
	return Object.freeze({
		snapshot: g,
		dispatch(t) {
			return e.dispatch(t) === !1 ? (_(), null) : w(i(t) === !0);
		},
		changed(e = {}) {
			return w(i(e) === !0);
		},
		undo() {
			return e.undo(), w(!1);
		},
		redo() {
			return e.redo(), w(!1);
		},
		discard() {
			return y(), e.discard(), d = !1, v("idle", wa), _(), g();
		},
		save() {
			return x(!0);
		},
		flush: S,
		setCautious: T
	});
}
//#endregion
//#region viewer/assets/checklist-filter-order.js
var Ma = "task-progress.checklist-filter-order.v1";
function Na({ supportedIds: e, storage: t = globalThis.localStorage ?? null } = {}) {
	let n = Wi(t, Ma, e);
	return {
		get order() {
			return n;
		},
		move(e, r, i = !1) {
			let a = Ki(n, e, r, i);
			return a.join("\0") === n.join("\0") ? n : (n = a, Gi(t, Ma, n), n);
		}
	};
}
//#endregion
//#region viewer/assets/theme-model.js
var Pa = "task-progress.theme.v1", Fa = [
	"system",
	"light",
	"dark",
	"custom"
], Ia = [
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
], La = Object.freeze({
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
}), Ra = Object.freeze({
	version: 1,
	mode: "system"
}), za = /^#[0-9a-f]{6}$/i;
function Ba(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Va(e) {
	return typeof e == "string" && za.test(e);
}
function Ha(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = La[n], i = { base: n };
	for (let e of Ia) {
		let n = t[e.key];
		i[e.key] = Va(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Ua(e) {
	if (!Ba(e) || e.version !== 1 || !Fa.includes(e.mode)) return { ...Ra };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Ba(e.custom) ? t.custom = Ha(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Ha()), t;
}
function Wa(e) {
	try {
		let t = e?.getItem(Pa);
		return t ? Ua(JSON.parse(t)) : { ...Ra };
	} catch {
		return { ...Ra };
	}
}
function Ga(e, t) {
	let n = Ua(t);
	try {
		e?.setItem(Pa, JSON.stringify(n));
	} catch {}
	return n;
}
function Ka(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function qa(e, t) {
	let n = Ua(t);
	e.dataset.theme = n.mode;
	for (let t of Ia) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Ha();
		e.dataset.themeBase = t.base;
		for (let n of Ia) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Ja(e, t, n = "light") {
	let r = Ua(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Ha(n)), Ua(i);
}
function Ya(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Xa(e, t) {
	if (!Va(e) || !Va(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ya(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Za(e) {
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
	].filter(([, e, t]) => Xa(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function Qa({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Wa(t);
	e && qa(e, r);
	function i(n) {
		return r = Ga(t, n), e && qa(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ka(n);
		},
		setMode(e) {
			return i(Ja(r, e, Ka(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Ha(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var $a = /* @__PURE__ */ Nr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), eo = /* @__PURE__ */ Nr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), to = /* @__PURE__ */ Nr("<path d=\"M3 3l18 18\"></path>"), no = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function ro(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = no(), a = R(i), o = (e) => {
		Y(e, $a());
	}, s = (e) => {
		var t = eo();
		Ne(), Y(e, t);
	};
	Z(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		Y(e, to());
	};
	Z(c, (e) => {
		r() && e(l);
	}), M(i), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var io = /* @__PURE__ */ J("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), ao = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function oo(e, t) {
	He(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Ei();
	var l = ao(), u = pn(l);
	let d;
	var f = R(u), p = R(f), m = R(p, !0);
	M(p), M(f);
	var h = z(f, 2), g = (e) => {
		var t = io(), n = R(t);
		{
			let e = /* @__PURE__ */ P(() => !r());
			ro(n, { get closed() {
				return W(e);
			} });
		}
		M(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), q("click", t, () => i()(!r())), Y(e, t);
	};
	Z(h, (e) => {
		n() && e(g);
	}), Xr(z(h, 2), t, "header", {}, null), M(u);
	var _ = z(u, 2);
	Xr(R(_), t, "default", {}, null), M(_), V(() => {
		d = oi(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), X(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), q("click", f, () => c()(!a())), Y(e, l), Ue();
}
Tr(["click"]);
//#endregion
//#region viewer/assets/icon-choice.js
function so(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function co(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var lo = /* @__PURE__ */ J("<button type=\"button\" tabindex=\"-1\"><!></button>"), uo = /* @__PURE__ */ J("<div role=\"group\"></div>"), fo = /* @__PURE__ */ J("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function po(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1), _ = /* @__PURE__ */ I(!1), v = /* @__PURE__ */ I(null), y = /* @__PURE__ */ I(0), b = /* @__PURE__ */ I(0), x = /* @__PURE__ */ I(!1), S = /* @__PURE__ */ I(null), C = 0;
	function w(e = !1) {
		clearTimeout(W(m)), C++, W(S) !== null && W(f)?.hasPointerCapture(W(S)) && W(f).releasePointerCapture(W(S)), L(S, null), L(h, !1), L(g, !1), L(v, null), L(x, !1), e && W(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function ee(e = !1) {
		if (!W(r).length) return;
		L(h, !0), L(x, !1);
		let t = ++C;
		if (await mr(), !W(h) || t !== C || !W(p)) return;
		let n = W(f).getBoundingClientRect(), i = W(p).getBoundingClientRect(), o = [...W(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (L(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), L(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (L(y, n.right + 4), W(y) + i.width > window.innerWidth - 4 && L(y, n.left - i.width - 4), L(b, n.top + (n.height - i.height) / 2)) : (L(y, n.left + (n.width - i.width) / 2), L(b, n.bottom + 4), W(b) + i.height > window.innerHeight - 4 && L(b, n.top - i.height - 4)), L(y, Math.max(4, Math.min(W(y), window.innerWidth - i.width - 4))), L(b, Math.max(4, Math.min(W(b), window.innerHeight - i.height - 4))), L(x, !0), await mr(), e && W(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && W(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ne(e) {
		if (clearTimeout(W(m)), W(S) !== null) {
			if (W(g)) {
				let t = te(e);
				L(_, !0), t === null ? w(!0) : T(W(r).find((e) => String(e.id) === t).id);
			} else {
				let t = W(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (L(_, !0), w(!0));
			}
			L(S, null);
		}
	}
	function E(e) {
		if (["Enter", " "].includes(e.key) && W(S) === null && L(_, !1), e.key === "Tab" && W(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(W(h) || W(S) !== null) && (e.preventDefault(), L(_, !0), w(!0));
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
	function D() {
		W(S) !== null && L(_, !0), w(W(d)?.contains(document.activeElement));
	}
	ki(() => clearTimeout(W(m))), B(() => (K(i()), K(a())), () => {
		L(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (K(i()), K(a()), K(l())), () => {
		L(r, co(i(), a(), l()));
	}), On(), Ei();
	var re = fo();
	wr("pointerdown", rn, (e) => {
		W(d)?.contains(e.target) || w();
	}), wr("resize", rn, D), wr("blur", rn, D), wr("scroll", an, (e) => {
		W(p)?.contains(e.target) || D();
	}, !0);
	var O = R(re);
	let ie;
	Xr(R(O), t, "icon", { get item() {
		return W(n);
	} }, null), M(O), Ti(O, (e) => L(f, e), () => W(f));
	var ae = z(O, 2), oe = (e) => {
		var n = uo();
		let i, s;
		Wr(n, 5, () => W(r), (e) => e.id, (e, n) => {
			var r = lo();
			let i;
			Xr(R(r), t, "icon", { get item() {
				return W(n);
			} }, null), M(r), V((e) => {
				i = oi(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (W(n), G(() => W(n).id))), Q(r, "aria-label", (W(n), G(() => W(n).label))), Q(r, "title", (W(n), G(() => W(n).label))), Q(r, "aria-pressed", (W(n), K(a()), G(() => W(n).kind === "action" ? void 0 : W(n).id === a())));
			}, [() => ({ "icon-choice-hover": W(v) === String(W(n).id) })]), q("keydown", r, E), q("click", r, () => T(W(n).id)), Y(e, r);
		}), M(n), Ti(n, (e) => L(p, e), () => W(p)), V(() => {
			i = oi(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = ci(n, "", s, {
				left: `${W(y)}px`,
				top: `${W(b)}px`,
				visibility: W(x) ? "visible" : "hidden"
			});
		}), Y(e, n);
	};
	Z(ae, (e) => {
		W(h) && e(oe);
	}), M(re), Ti(re, (e) => L(d, e), () => W(d)), V(() => {
		Q(re, "aria-label", o()), Q(O, "aria-label", (K(o()), W(n), G(() => `${o()}：${W(n)?.label ?? ""}`))), Q(O, "aria-expanded", s() === "cycle" ? void 0 : W(h)), Q(O, "title", (K(o()), W(n), K(s()), G(() => `${o()}：${W(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), O.disabled = !W(n), ie = ci(O, "", ie, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), q("focusout", re, (e) => {
		W(d).contains(e.relatedTarget) || w();
	}), q("keydown", O, E), q("pointerdown", O, (e) => {
		e.button === 0 && (L(_, !1), !(s() === "cycle" || W(h)) && (L(S, e.pointerId), W(f).setPointerCapture(W(S)), clearTimeout(W(m)), L(m, setTimeout(() => {
			L(g, !0), ee();
		}, 300))));
	}), q("pointermove", O, (e) => {
		W(g) && L(v, te(e));
	}), q("pointerup", O, ne), wr("pointercancel", O, D), q("click", O, () => {
		if (W(_)) {
			L(_, !1);
			return;
		}
		if (W(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") ee(!0);
		else {
			let e = so(i(), a());
			e !== void 0 && u()(e);
		}
	}), Y(e, re), Ue();
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
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var mo = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function ho(e, t) {
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
	po(e, {
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
			let n = /* @__PURE__ */ P(() => t.item);
			var r = Pr(), i = pn(r), a = (e) => {
				Y(e, mo());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "closed"))), r = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "disabled")));
					ro(e, {
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
function go(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function _o(e, t, n) {
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
//#region viewer/assets/card-order.js
function vo(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function yo(e, t, n, r = [], i = null) {
	let a = n === "free" ? bo(e, t) : n === "reverse" ? [...e].reverse() : e, o = new Map(e.map((e) => [e.id, e])), s = new Set(r), c = r.length ? [...s].filter((e) => o.has(e)).map((e) => o.get(e)).concat(a.filter((e) => !s.has(e.id))) : a;
	return i === null || !o.has(i) ? c : [o.get(i), ...c.filter((e) => e.id !== i)];
}
function bo(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function xo(e, t, n, r, i, a) {
	let o = Ui(t, e), s = new Set(n), c = Ki(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var So = /* @__PURE__ */ Nr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), Co = /* @__PURE__ */ Nr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), wo = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), To = /* @__PURE__ */ J("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), Eo = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), Do = /* @__PURE__ */ J("<p class=\"card-list-hidden\"><button type=\"button\" class=\"card-list-hidden-link\"> </button></p>"), Oo = /* @__PURE__ */ J("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div> <!>", 1);
function ko(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null), f = $(t, "nextId", 8, null), p = $(t, "hiddenCount", 8, 0), m = $(t, "onShowHidden", 8, null);
	function h(e = o()) {
		return yo(e, W(E), W(b), l() ? W(g) : [], f()).map((e) => e.id);
	}
	let g = /* @__PURE__ */ I([]), _ = null, v = $(t, "expanded", 8, !0), y = $(t, "onToggleAll", 8, () => {}), b = /* @__PURE__ */ I("forward"), x = [
		"forward",
		"reverse",
		"free"
	], S = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, C = /* @__PURE__ */ I("disabled"), w = /* @__PURE__ */ I([]);
	function T() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: W(C),
				hiddenIds: W(w)
			}));
		} catch {}
	}
	function ee(e) {
		let t = _o(W(C), W(w), e);
		L(C, t.mode), L(w, t.hiddenIds), he(), T();
	}
	function te(e, t) {
		L(w, t ? W(w).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...W(w), e])]), he(), T();
	}
	function ne(e) {
		W(C) === "closed" && L(C, "enabled"), te(e, !0);
	}
	let E = /* @__PURE__ */ I(null), D = /* @__PURE__ */ I(null), re = /* @__PURE__ */ I(null), O = /* @__PURE__ */ I(null), ie = /* @__PURE__ */ I(null), ae = /* @__PURE__ */ I(), oe = /* @__PURE__ */ I("");
	function se(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (_ !== i) {
			if (_ = i, !n.includes(e)) {
				L(oe, `找不到卡片 ID：${e}`);
				return;
			}
			L(g, vo(W(g), e)), ne(e), ce();
		}
	}
	function ce() {
		if (!c()) {
			L(oe, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(W(g))), L(oe, "已記住本機釘選");
		} catch {
			L(oe, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function le(e) {
		he(), L(g, W(g).includes(e) ? W(g).filter((t) => t !== e) : vo(W(g), e)), ce();
	}
	function ue(e) {
		if (_ = null, L(g, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			L(g, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (L(C, "disabled"), L(w, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			L(C, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), L(w, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (L(D, null), L(re, null), L(O, null), L(ie, null), !e) {
			L(E, null), L(b, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			L(E, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			L(b, x.includes(n) ? n : W(E) ? "free" : "forward");
		} catch {
			L(E, null), L(b, "forward");
		}
	}
	function de(e) {
		if (L(E, e), !c()) {
			L(oe, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), L(oe, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			L(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function fe(e) {
		if (he(), L(b, e), L(oe, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, W(b));
		} catch {
			L(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function pe(e, t, n) {
		W(b) === "free" && (l() && (W(g).includes(e) || W(g).includes(t)) || e !== t && (de(xo(s(), W(E), W(r).map((e) => e.id), e, t, n)), L(D, e), await mr(), [...W(ae).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function me(e, t) {
		let n = W(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = W(r)[n + t];
		i && pe(e, i.id, t > 0);
	}
	function he() {
		L(re, null), L(O, null), L(ie, null);
	}
	function ge(e, t) {
		if (l() && W(g).includes(e.id) || W(O) === null || W(O) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		L(ie, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => W(C), () => {
		L(n, W(C) === "enabled");
	}), B(() => (K(o()), W(E), W(b), K(l()), W(g), K(f()), K(d())), () => {
		L(i, bo(yo(o(), W(E), W(b), l() ? W(g) : [], f()), d()));
	}), B(() => (W(i), W(C), W(w), K(l()), W(g)), () => {
		L(r, W(i).filter((e) => go(e.id, W(C), W(w)) && !(l() && W(g).includes(e.id))));
	}), B(() => K(c()), () => {
		ue(c());
	}), B(() => (W(i), W(C), W(w)), () => {
		L(a, W(i).find((e) => go(e.id, W(C), W(w)))?.id ?? null);
	}), B(() => (K(u()), K(c()), K(s()), K(l())), () => {
		se(u(), c(), s(), l());
	}), On();
	var _e = {
		orderedIds: h,
		revealCard: ne
	};
	Ei();
	var ve = Oo(), ye = pn(ve), be = R(ye);
	Xr(z(R(be), 2), t, "filters", {}, null), M(be);
	var xe = z(be, 2), Se = R(xe), Ce = R(Se), we = R(Ce);
	M(Ce), M(Se);
	var k = z(Se, 2);
	{
		let e = /* @__PURE__ */ P(() => G(() => x.map((e) => ({
			id: e,
			label: S[e]
		}))));
		po(k, {
			get items() {
				return W(e);
			},
			get value() {
				return W(b);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: fe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ P(() => t.item);
				var r = wo(), i = R(r), a = (e) => {
					Y(e, So());
				}, o = (e) => {
					var t = Co(), r = pn(t), i = z(r);
					V(() => {
						Q(r, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), Y(e, t);
				};
				Z(i, (e) => {
					K(W(n)), G(() => W(n).id === "free") ? e(a) : e(o, -1);
				}), M(r), Y(e, r);
			} }
		});
	}
	var Te = z(k, 2);
	ho(Te, {
		get mode() {
			return W(C);
		},
		onChoose: ee
	});
	var Ee = z(Te, 2), De = R(Ee, !0);
	M(Ee), Xr(z(Ee, 2), t, "tools", {}, null), M(xe), M(ye);
	var Oe = z(ye, 2);
	Wr(Oe, 5, () => W(i), (e) => e.id, (e, r) => {
		var i = Eo();
		let o;
		var s = R(i), c = (e) => {
			var t = To();
			let n;
			var i = R(t), a = R(i);
			M(i), M(t), V((e, r, i, o, s) => {
				n = oi(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({
					"is-pinned": W(g).includes(W(r).id),
					"is-next": f() !== null && W(r).id === f()
				}),
				() => (W(g), W(r), G(() => W(g).includes(W(r).id) ? `取消釘選：${W(r).title}` : `釘選置頂：${W(r).title}`)),
				() => (W(g), W(r), G(() => W(g).includes(W(r).id))),
				() => (W(g), W(r), G(() => W(g).includes(W(r).id) ? "取消釘選" : "釘選置頂")),
				() => (W(g), W(r), K(f()), G(() => W(g).includes(W(r).id) || f() !== null && W(r).id === f() ? "currentColor" : "none"))
			]), q("click", t, () => le(W(r).id)), Y(e, t);
		};
		Z(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(w), W(r), G(() => !W(w).includes(W(r).id))));
			Xr(u, t, "default", {
				get item() {
					return W(r);
				},
				get lead() {
					return W(r), W(a), G(() => W(r).id === W(a));
				},
				get visibilityEnabled() {
					return W(n);
				},
				get visible() {
					return W(e);
				},
				onVisibleChange: (e) => te(W(r).id, e)
			}, null);
		}
		M(i), V((e) => {
			Q(i, "hidden", e), o = oi(i, 1, "arrangeable-card", null, o, {
				"card-selected": W(D) === W(r).id,
				"card-drop-before": W(ie)?.id === W(r).id && !W(ie).after,
				"card-drop-after": W(ie)?.id === W(r).id && W(ie).after
			}), Q(i, "aria-label", (W(r), W(D), G(() => `${W(r).title}${W(D) === W(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (W(r), G(() => W(r).id))), Q(i, "draggable", (W(b), W(re), W(r), G(() => W(b) === "free" && W(re) === W(r).id)));
		}, [() => (K(go), W(r), W(C), W(w), G(() => !go(W(r).id, W(C), W(w))))]), q("pointerdown", i, (e) => {
			L(re, null), e.button === 0 && (L(D, W(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (W(b) !== "free" || e.pointerType !== "mouse" || l() && W(g).includes(W(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || L(re, W(r).id)));
		}), q("focusin", i, () => {
			L(D, W(r).id);
		}), q("input", i, () => {
			L(D, W(r).id);
		}), q("pointerup", i, () => {
			L(re, null);
		}), q("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), L(D, W(r).id)) : e.key === "Escape" && L(D, null), W(b) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), me(W(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), wr("dragstart", i, (e) => {
			W(b) === "free" && W(re) === W(r).id && e.target === e.currentTarget && (L(O, W(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(r).id)));
		}), wr("dragend", i, he), wr("dragover", i, (e) => ge(W(r), e)), wr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(ie, null);
		}), wr("drop", i, (e) => {
			W(O) !== null && W(ie)?.id === W(r).id && (e.preventDefault(), pe(W(O), W(r).id, W(ie).after), he());
		}), Y(e, i);
	}), M(Oe), Ti(Oe, (e) => L(ae, e), () => W(ae));
	var ke = z(Oe, 2), A = (e) => {
		var t = Do(), n = R(t), r = R(n);
		M(n), M(t), V(() => X(r, `…顯示隱藏項目(${p() ?? ""})`)), q("click", n, function(...e) {
			m()?.apply(this, e);
		}), Y(e, t);
	};
	return Z(ke, (e) => {
		p() > 0 && m() && e(A);
	}), V(() => {
		Q(Se, "aria-label", v() ? "全部收合" : "全部展開"), Q(Se, "title", v() ? "全部收合" : "全部展開"), Q(we, "d", v() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), X(De, W(oe));
	}), q("click", Se, () => y()(!v())), Y(e, ve), Ci(t, "orderedIds", h), Ci(t, "revealCard", ne), Ue(_e);
}
Tr([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region viewer/assets/focus-shield.js
function Ao({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, now: n = () => Date.now(), activationWindowMs: r = 100, storage: i, key: a = `taskprogress.mouse-activation.v2:${e.location?.pathname ?? ""}` } = {}) {
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
function jo(e, t) {
	He(t, !1), Oi(() => Ao()), Ei(), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var Mo = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function No(e, t) {
	He(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ I(), d = null, f = !1;
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
	Ei();
	var _ = Pr(), v = pn(_), y = (e) => {
		var n = Mo(), l = R(n), d = R(l), f = R(d), _ = R(f, !0);
		M(f);
		var v = z(f, 2), y = R(v, !0);
		M(v), M(d);
		var b = z(d, 2);
		M(l), Xr(z(l, 2), t, "default", { close: h }, null), M(n), Ti(n, (e) => L(u, e), () => W(u)), Zr(n, (e) => p?.(e)), V(() => {
			oi(n, 1, ei(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), wr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), Ue();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Po = /* @__PURE__ */ J("<span></span>"), Fo = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), Io = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), Lo = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function Ro(e, t) {
	He(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await mr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		L(s, null), L(c, null);
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
		L(d, r), o()(e, t, n);
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
		L(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!W(s) || e.id === W(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", L(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || W(c)?.id === e.id && L(c, null);
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
	function te(e, t) {
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
	function ne(e, t) {
		if (!u || u.pointerId !== t.pointerId) return;
		let n = t.clientX - u.startX, r = t.clientY - u.startY;
		if (!u.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			u.active = !0, l = !0, L(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, L(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), L(c, {
			id: a,
			placeAfter: u.placeAfter
		});
	}
	function E(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	B(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), On(), Ei();
	var D = Lo();
	Wr(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = Io(), i = R(r), a = R(i, !0);
		M(i);
		var o = z(i, 2), l = (e) => {
			var n = Po();
			V(() => oi(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			Y(e, Fo());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), M(r), V((e) => {
			oi(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), wr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), wr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), wr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), wr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), wr("dragend", r, function(...e) {
			(W(n) ? ee : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => ne(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? E : null)?.apply(this, e);
		}), wr("pointercancel", r, function(...e) {
			(W(n) ? E : null)?.apply(this, e);
		}), Y(e, r);
	}), M(D), Ti(D, (e) => L(f, e), () => W(f)), V(() => {
		oi(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), Y(e, D), Ue();
}
Tr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function zo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	B(() => (K(u()), K(p()), K(l())), () => {
		L(n, {
			id: Pi,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), B(() => K(o()), () => {
		L(r, new Map(o().map((e) => [e.id, e])));
	}), B(() => (K(s()), K(o())), () => {
		L(i, s().length > 0 ? s() : [Pi, ...o().map((e) => e.id)]);
	}), B(() => (W(i), W(n), W(r), K(c()), K(p())), () => {
		L(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e, c(), p())));
	}), On(), Ei();
	{
		let t = /* @__PURE__ */ P(() => `filter-strip ${f()}`);
		Ro(e, {
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
//#region viewer/assets/inline-links.js
function Bo(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function Vo(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = Bo(t.slice(r.lastIndex, e - 1));
		if (!s) {
			r.lastIndex = e;
			continue;
		}
		a.index > i && n.push({ text: t.slice(i, a.index) }), n.push({
			text: a[1],
			href: s
		}), i = e, r.lastIndex = e;
	}
	return i < t.length && n.push({ text: t.slice(i) }), n;
}
function Ho(e, t, { emphasis: n = !1 } = {}) {
	let r = e.createElement("a");
	return r.className = n ? "inline-link inline-link--emphasis" : "inline-link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text, r;
}
function Uo(e, t, n = {}) {
	let r = e.ownerDocument;
	e.replaceChildren(...Vo(t).map((e) => e.href ? Ho(r, e, n) : r.createTextNode(e.text)));
}
function Wo(e, t = {}) {
	let n = null;
	function r(t = {}) {
		let r = String(t.text ?? ""), i = t.emphasis === !0;
		n && n.text === r && n.emphasis === i || (n = {
			text: r,
			emphasis: i
		}, Uo(e, r, { emphasis: i }));
	}
	return r(t), {
		update: r,
		destroy() {
			e.replaceChildren();
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/InlineLinks.svelte
var Go = /* @__PURE__ */ J("<span></span>");
function Ko(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "emphasis", 8, !1);
	var i = Go();
	Zr(i, (e, t) => Wo?.(e, t), () => ({
		text: n(),
		emphasis: r()
	})), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var qo = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Jo = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function Yo(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "status", 8, "pending"), s = $(t, "interactive", 8, !1), c = $(t, "stale", 8, !1), l = $(t, "label", 8, ""), u = $(t, "onCycle", 8, () => {}), d = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, f = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	B(() => K(o()), () => {
		L(n, d[o()] ?? "?");
	}), B(() => (K(c()), K(o())), () => {
		L(r, c() && o() === "pending" ? "需重驗" : f[o()] ?? o());
	}), B(() => (K(c()), K(o())), () => {
		L(i, c() && o() === "pending" ? " marker-stale" : "");
	}), B(() => (K(l()), W(r)), () => {
		L(a, l() ? `${l()}：${W(r)}` : W(r));
	}), On();
	var p = Pr(), m = pn(p), h = (e) => {
		var t = qo(), r = R(t), s = R(r, !0);
		M(r), M(t), V(() => {
			oi(t, 1, `marker-box marker-${o()}${W(i)} marker-box-button`), Q(t, "aria-label", `${W(a)}，點擊切換下一個結果`), X(s, W(n));
		}), q("click", t, function(...e) {
			u()?.apply(this, e);
		}), Y(e, t);
	}, g = (e) => {
		var t = Jo(), r = R(t), s = R(r, !0);
		M(r), M(t), V(() => {
			oi(t, 1, `marker-box marker-${o()}${W(i)}`), Q(t, "aria-label", W(a)), X(s, W(n));
		}), Y(e, t);
	};
	Z(m, (e) => {
		s() ? e(h) : e(g, -1);
	}), Y(e, p), Ue();
}
Tr(["click"]);
//#endregion
//#region viewer/assets/item-reference.js
async function Xo(e, t = globalThis.document) {
	try {
		return await t.defaultView.navigator.clipboard.writeText(e), !0;
	} catch {
		let n = t.createElement("textarea");
		n.value = e, n.setAttribute("readonly", ""), n.style.position = "fixed", n.style.opacity = "0";
		let r = t.activeElement;
		t.body.append(n), n.select();
		let i = t.execCommand("copy");
		return n.remove(), r?.focus?.(), i;
	}
}
//#endregion
//#region experiments/editor-svelte-spike/src/CopyIdButton.svelte
var Zo = /* @__PURE__ */ J("<button type=\"button\"> </button>");
function Qo(e, t) {
	He(t, !1);
	let n = $(t, "id", 8), r = $(t, "label", 8), i = /* @__PURE__ */ I(""), a;
	async function o(e) {
		e.stopPropagation(), clearTimeout(a);
		let t = await Xo(n());
		L(i, t ? "已複製" : "無法複製"), a = setTimeout(() => {
			L(i, "");
		}, 1500);
	}
	Ei();
	var s = Zo();
	let c;
	var l = R(s, !0);
	M(s), V(() => {
		c = oi(s, 1, "task-id-copy", null, c, {
			"is-done": W(i),
			"is-copied": W(i) === "已複製"
		}), Q(s, "aria-label", W(i) || `複製「${r()}」的卡片 ID`), Q(s, "title", W(i) || n()), X(l, W(i) === "已複製" ? "✓" : W(i) ? "✕" : "⧉");
	}), q("click", s, o), Y(e, s), Ue();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var $o = /* @__PURE__ */ J("<i></i>"), es = /* @__PURE__ */ J("<div role=\"img\"></div>"), ts = /* @__PURE__ */ J("<progress max=\"100\"></progress>");
function ns(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending",
		"active"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	B(() => K(o()), () => {
		L(n, d(o()));
	}), B(() => K(a()), () => {
		L(r, Array.isArray(a()) ? a() : []);
	}), On(), Ei();
	var f = Pr(), p = pn(f), m = (e) => {
		var t = es();
		Wr(t, 5, () => W(r), Br, (e, t) => {
			var n = $o();
			V((e) => oi(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), Y(e, n);
		}), M(t), V(() => {
			oi(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), Y(e, t);
	}, h = (e) => {
		var t = ts();
		V(() => {
			oi(t, 1, `progress-meter ${c()}`), vi(t, W(n)), Q(t, "aria-label", s());
		}), Y(e, t);
	};
	Z(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), Y(e, f), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var rs = /* @__PURE__ */ J("<div><b> </b> <span> </span></div>"), is = /* @__PURE__ */ J("<div class=\"progress-stats\"></div>"), as = /* @__PURE__ */ J("<span class=\"progress-note\"> </span>"), os = /* @__PURE__ */ J("<p class=\"progress-caption\"><span> </span> <!></p>"), ss = /* @__PURE__ */ J("<section class=\"progress-summary\"><!> <!> <!></section>");
function cs(e, t) {
	He(t, !1);
	let n = $(t, "stats", 24, () => []), r = $(t, "bar", 8, null), i = $(t, "caption", 8, ""), a = $(t, "note", 8, ""), o = $(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	Ei();
	var l = ss(), u = R(l), d = (e) => {
		var t = is();
		Wr(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = rs(), r = R(n), i = R(r, !0);
			M(r);
			var a = z(r, 2), o = R(a, !0);
			M(a), M(n), V((e) => {
				oi(n, 1, e), X(i, (W(t), G(() => W(t).value))), X(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${c(W(t).tone)}`))]), Y(e, n);
		}), M(t), Y(e, t);
	};
	Z(u, (e) => {
		K(n()), G(() => n().length) && e(d);
	});
	var f = z(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (K(r()), G(() => r().cells ?? []))), n = /* @__PURE__ */ P(() => (K(r()), G(() => r().ratio ?? 0))), a = /* @__PURE__ */ P(() => i() || o());
			ns(e, {
				get form() {
					return K(r()), G(() => r().form);
				},
				get cells() {
					return W(t);
				},
				get ratio() {
					return W(n);
				},
				get label() {
					return W(a);
				}
			});
		}
	};
	Z(f, (e) => {
		r() && e(p);
	});
	var m = z(f, 2), h = (e) => {
		var t = os(), n = R(t), r = R(n, !0);
		M(n);
		var o = z(n, 2), s = (e) => {
			var t = as(), n = R(t, !0);
			M(t), V(() => X(n, a())), Y(e, t);
		};
		Z(o, (e) => {
			a() && e(s);
		}), M(t), V(() => X(r, i())), Y(e, t);
	};
	Z(m, (e) => {
		(i() || a()) && e(h);
	}), M(l), V(() => Q(l, "aria-label", o())), Y(e, l), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var ls = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), us = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), ds = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function fs(e, t) {
	He(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Ei();
	var y = ds(), b = pn(y), x = R(b, !0);
	M(b);
	var S = z(b, 2), C = R(S), w = R(C, !0);
	M(C);
	var T = z(C, 2), ee = R(T, !0);
	M(T), M(S);
	var te = z(S, 2), ne = (e) => {
		var t = ls(), a = R(t, !0);
		M(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Z(te, (e) => {
		r() && e(ne);
	});
	var E = z(te, 2), D = (e) => {
		var t = us(), n = pn(t), r = R(n, !0);
		M(n);
		var i = z(n, 2), s = R(i, !0);
		M(i), V(() => {
			n.disabled = o(), X(r, m()), i.disabled = !a() || o(), X(s, o() ? d() : u());
		}), q("click", n, function(...e) {
			v()?.apply(this, e);
		}), q("click", i, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	Z(E, (e) => {
		n() && e(D);
	}), V(() => {
		X(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), X(ee, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", T, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), Ue();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var ps = /* @__PURE__ */ J("<option> </option>"), ms = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), hs = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), gs = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function _s(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(Ha(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Ia.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		L(h, e.base), L(g, v(e)), L(_, { ...W(g) });
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
		y(o() ? Ha(o().base, o()) : Ha(s())), L(f, !0);
	}
	function S() {
		L(f, !1);
	}
	function C(e) {
		y(Ha(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		L(g, {
			...W(g),
			[e.key]: r
		}), L(_, {
			...W(_),
			[e.key]: r
		}), W(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), L(g, {
			...W(g),
			[e.key]: n.value
		}), r && L(_, {
			...W(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function ee() {
		L(m, a()), S();
	}
	function te() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ha(W(h), W(_))), S();
	}
	B(() => K(a()), () => {
		L(m, a());
	}), B(() => (W(h), W(_)), () => {
		L(n, Ha(W(h), W(_)));
	}), B(() => W(n), () => {
		L(r, Za(W(n)));
	}), B(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), On(), Ei();
	var ne = gs(), E = pn(ne), D = z(R(E), 2);
	Wr(D, 5, () => u, (e) => e.value, (e, t) => {
		var n = ps(), r = R(n, !0);
		M(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), M(D), M(E), No(z(E, 2), {
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
			var a = hs(), o = z(pn(a), 2), s = z(R(o), 2), c = R(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", M(s);
			var u;
			ui(s), M(o);
			var d = z(o, 2);
			Wr(d, 7, () => Ia, (e) => e.key, (e, t, r) => {
				var i = ms(), a = R(i), o = R(a, !0);
				M(a);
				var s = z(a, 2), c = R(s);
				_i(c);
				var l = z(c, 2);
				_i(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ti(l, (e, t) => Yt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), M(s), M(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), vi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), vi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
			}), M(d);
			var f = z(d, 2);
			let m;
			var _ = R(f, !0);
			M(f);
			var v = z(f, 2), b = R(v), x = z(b, 4), S = z(x, 2);
			M(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", li(s, W(h))), m = oi(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(Ha(W(h)))), q("click", x, ee), q("click", S, te), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", D, b), di(D, () => W(m), (e) => L(m, e)), Y(e, ne), Ue();
}
Tr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var vs = /* @__PURE__ */ J("<p class=\"document-owner\"><a><span class=\"owner-arrow\" aria-hidden=\"true\">←</span><span class=\"owner-name\"> </span></a></p>"), ys = /* @__PURE__ */ J("<details class=\"checklist-round\"><summary>本輪依據</summary><p> </p></details>"), bs = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), xs = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), Ss = /* @__PURE__ */ J("<p class=\"checklist-chips\"><span class=\"checklist-chip\"> </span></p>"), Cs = /* @__PURE__ */ J("<p class=\"checklist-lock\"> </p>"), ws = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), Ts = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), Es = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), Ds = /* @__PURE__ */ J("<div><dt>狀態</dt><dd class=\"checklist-void\"> </dd></div>"), Os = /* @__PURE__ */ J("<div><dt>記錄</dt><dd> </dd></div>"), ks = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>不通過的原因</span> <select><option>實作不符</option><option>條件不符</option></select></label>"), As = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), js = /* @__PURE__ */ J("<section tabindex=\"-1\"><div class=\"checklist-check-heading\"><!> <strong> </strong> <span> </span></div> <!> <dl><div><dt>Action</dt><dd><!></dd></div> <div><dt>Expect</dt><dd><!></dd></div> <!> <!> <!> <!></dl> <!> <!></section>"), Ms = /* @__PURE__ */ J("<div class=\"checklist-checks\"><p class=\"checklist-outcome\"><!></p> <!> <!></div>"), Ns = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header\"><!> <!> <div><h2> </h2></div> <span class=\"checklist-status\"> </span></header>"), Ps = /* @__PURE__ */ J("<article><!></article>"), Fs = /* @__PURE__ */ J("<button type=\"button\" class=\"secondary-button checklist-reset-button\">清空結果</button>"), Is = /* @__PURE__ */ J("<!> <label class=\"checklist-operable-toggle\"><input type=\"checkbox\"/> <span>只顯示我能操作的檢查</span></label> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"><!></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!> <!></footer>", 1), Ls = /* @__PURE__ */ J("<p> </p> <p>此操作無法復原；如需回復，請使用 Git 歷史。</p> <form method=\"dialog\" class=\"theme-dialog-actions\"><button type=\"submit\" class=\"secondary-button\">取消</button> <button type=\"submit\" class=\"primary-button\">確認清空</button></form>", 1), Rs = /* @__PURE__ */ J("<!> <main class=\"checklist-page\"><header class=\"checklist-header\"><div><h1> </h1> <!> <!></div> <!></header> <!></main> <!>", 1);
function zs(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "transport", 8, null), s = $(t, "onPersistenceChange", 8, () => {}), c = $(t, "bindRefresh", 8, () => {}), l = null, u = /* @__PURE__ */ I(null), d = /* @__PURE__ */ I(!0), f = /* @__PURE__ */ I(""), p = /* @__PURE__ */ I(null), m = /* @__PURE__ */ I("正在載入 Checklist…"), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1), _ = /* @__PURE__ */ I([]);
	function v(e) {
		l = ja({
			session: fa(e),
			save: o().save,
			debounceCommand: (e) => e.type === "set-observed",
			onChange: (e) => {
				L(u, e), L(m, e.message);
			}
		}), L(u, l.snapshot()), L(m, W(u).message);
	}
	async function y() {
		if (!o() || !W(u) || W(u).dirty || W(u).saving || W(u).pending || W(h) || W(g)) return;
		let e = l, t = W(u)?.document?.revision;
		try {
			let n = await o().load();
			if (!n || !n.revision || !l || l !== e || !W(u) || W(u).document?.revision !== t || W(u).dirty || W(u).saving || W(u).pending || W(h) || W(g) || n.revision === t) return;
			let r = W(u).cautious;
			v(n), r && l && await l.setCautious(!0);
		} catch (e) {
			console.warn("Checklist foreground refresh failed:", e);
		}
	}
	function b() {
		W(r) && (L(_, W(n).map((e) => ({ ...e }))), L(h, !0));
	}
	async function x() {
		if (!W(r) || W(g)) return;
		L(g, !0);
		let e = W(u).cautious;
		L(m, "正在清空實機結果…");
		try {
			v(await o().reset({ targets: W(_) })), L(u, await l.setCautious(e)), L(m, "實機結果已清空；其他檢查結果保留。");
		} catch (e) {
			L(m, e instanceof Error ? e.message : "清空失敗，請重新載入確認結果。");
		} finally {
			L(g, !1);
		}
	}
	let S = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, C = [
		"pending",
		"passed",
		"failed"
	], w = /* @__PURE__ */ I(Ii(C)), T = /* @__PURE__ */ I(null), ee = Na({ supportedIds: [Pi, ...C] }), te = /* @__PURE__ */ I(ee.order);
	function ne(e) {
		L(w, Bi(W(w), e)), Ri(W(T), W(w));
	}
	function E() {
		L(w, Vi(W(w))), Ri(W(T), W(w));
	}
	function D(e, t, n) {
		L(te, [...ee.move(e, t, n)]);
	}
	function re(e, t) {
		let n = new Map(ua(e).map((e) => [e.id, e.count]));
		return t.filter((e) => C.includes(e)).map((e) => ({
			id: e,
			label: S[e] ?? e,
			count: n.get(e) ?? 0,
			title: "拖曳可調整順序；排在「預設」左邊的標籤會分組到最前面"
		}));
	}
	let O = /* @__PURE__ */ I(), ie = /* @__PURE__ */ I(!0), ae = /* @__PURE__ */ I({});
	function oe(e) {
		let t = ji(e);
		L(ie, t.expanded), L(ae, t.overrides);
	}
	function se(e, t) {
		L(ae, {
			...W(ae),
			[e]: t
		}), Mi(W(i), W(ie), W(ae));
	}
	function ce(e) {
		L(ie, e), L(ae, {}), Mi(W(i), W(ie), W(ae));
	}
	function le() {
		L(w, Ii(C)), Ri(W(T), W(w)), L(_e, !1);
	}
	let ue = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), fe = (e) => e === "saving" ? "saving" : ue.has(e) ? "error" : "clean", pe = /* @__PURE__ */ I(null), me = /* @__PURE__ */ I({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function he() {
		L(me, {
			mode: W(pe).mode,
			custom: W(pe).custom,
			systemScheme: W(pe).systemScheme
		});
	}
	Oi(async () => {
		L(pe, Qa()), he();
		try {
			if (!o()) throw Error("Checklist 介面需要由 host 提供 transport。");
			v(await o().load()), o().loadOwnerReport?.().then((e) => {
				L(p, e);
			}).catch(() => {});
		} catch (e) {
			L(f, e instanceof Error ? e.message : "Checklist 載入失敗。"), L(m, W(f));
		} finally {
			L(d, !1);
		}
	});
	function ge(e) {
		if (!W(g)) try {
			l.dispatch(e), L(u, l.snapshot()), L(m, W(u).message);
		} catch (e) {
			L(m, e.message);
		}
	}
	let _e = /* @__PURE__ */ I(!1), ve = {
		manual: "實機",
		acceptance: "他驗"
	}, ye = {
		no_recorder: "需重驗：沒有記錄者",
		fingerprint: "需重驗：內容已變更",
		released: "需重驗：之後重新執行過"
	};
	function be(e) {
		let t = la(e, W(te)), n = Hi(W(te)).filter((e) => C.includes(e)).length === 0, r = {
			...t,
			items: ga(t.items, { asWritten: n })
		};
		return W(_e) ? aa(r) : r;
	}
	function xe(e, t) {
		t.isAcceptance && t.recorder && t.recorder !== "user" && !window.confirm("確認修改 agent 紀錄嗎？") || ge({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function Se() {
		W(g) || (l.undo(), L(u, l.snapshot()));
	}
	function Ce() {
		W(g) || (l.redo(), L(u, l.snapshot()));
	}
	function we() {
		W(g) || L(u, l.discard());
	}
	async function k() {
		W(g) || (await l.save(), L(u, l.snapshot()));
	}
	async function Te(e) {
		W(g) || L(u, await l.setCautious(e));
	}
	B(() => W(u), () => {
		L(n, W(u)?.document.items.flatMap((e) => e.checks.filter((e) => e.isManual).map((t) => ({
			workItemId: e.id,
			checkIndex: t.index
		}))) ?? []);
	}), B(() => (W(u), W(g), W(n)), () => {
		L(r, !!W(u) && !W(u).dirty && !W(u).saving && !W(u).pending && !W(u).blocked && !W(g) && W(n).length > 0);
	}), B(() => (K(s()), W(u), W(h), W(g)), () => {
		s()(W(u) ? {
			...W(u),
			pending: W(u).pending || W(h) || W(g)
		} : W(u));
	}), B(() => K(c()), () => {
		c()(y);
	}), B(() => W(u), () => {
		L(i, W(u)?.document ? `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${W(u).document.fileName}:${W(u).document.roundIdentity}` : null);
	}), B(() => (W(i), W(T), Li), () => {
		W(i) && W(T) !== `${W(i)}:filters` && (L(T, `${W(i)}:filters`), L(w, Li(W(T), C)));
	}), B(() => W(i), () => {
		W(i) && oe(W(i));
	}), B(() => (W(u), W(w)), () => {
		L(a, W(u) ? ca(be(W(u).document), W(w).selected).items : []);
	}), On(), Ei();
	var Ee = Rs(), De = pn(Ee);
	jo(De, {});
	var Oe = z(De, 2), ke = R(Oe), A = R(ke), Ae = R(A), j = R(Ae, !0);
	M(Ae);
	var je = z(Ae, 2), Me = (e) => {
		var t = vs(), n = R(t), r = z(R(n)), i = R(r, !0);
		M(r), M(n), M(t), V(() => {
			Q(n, "href", (W(p), G(() => W(p).href))), Q(n, "aria-label", (W(p), G(() => `返回 ${W(p).title}`))), X(i, (W(p), G(() => W(p).title)));
		}), Y(e, t);
	};
	Z(je, (e) => {
		W(p) && e(Me);
	});
	var Pe = z(je, 2), Fe = (e) => {
		var t = ys(), n = z(R(t)), r = R(n, !0);
		M(n), M(t), V(() => X(r, (W(u), G(() => W(u).document.roundIdentity)))), Y(e, t);
	};
	Z(Pe, (e) => {
		W(u) && e(Fe);
	}), M(A);
	var Ie = z(A, 2), Le = (e) => {
		_s(e, {
			get mode() {
				return W(me), G(() => W(me).mode);
			},
			get custom() {
				return W(me), G(() => W(me).custom);
			},
			get systemScheme() {
				return W(me), G(() => W(me).systemScheme);
			},
			onModeChange: (e) => {
				W(pe).setMode(e), he();
			},
			onApplyCustom: (e) => {
				W(pe).applyCustom(e), he();
			}
		});
	};
	Z(Ie, (e) => {
		W(pe) && e(Le);
	}), M(ke);
	var Re = z(ke, 2), ze = (e) => {
		var t = bs(), n = R(t, !0);
		M(t), V(() => X(n, W(m))), Y(e, t);
	}, Be = (e) => {
		var t = xs(), n = R(t, !0);
		M(t), V(() => X(n, W(f))), Y(e, t);
	}, N = (e) => {
		var t = Is(), n = pn(t);
		{
			let e = /* @__PURE__ */ P(() => (W(u), G(() => ({
				form: "segmented",
				cells: W(u).summary.cells
			})))), t = /* @__PURE__ */ P(() => (W(u), G(() => `${W(u).summary.checks.passed} / ${W(u).summary.checks.total} checks 通過`))), r = /* @__PURE__ */ P(() => (W(u), G(() => W(u).summary.checks.failed > 0 ? `${W(u).summary.checks.failed} 個失敗` : "")));
			cs(n, {
				get bar() {
					return W(e);
				},
				get caption() {
					return W(t);
				},
				get note() {
					return W(r);
				}
			});
		}
		var i = z(n, 2), s = R(i);
		_i(s), Ne(2), M(i);
		var c = z(i, 2), l = R(c);
		{
			let e = /* @__PURE__ */ P(() => (W(u), W(a), G(() => W(u).document.items.length - W(a).length))), t = /* @__PURE__ */ P(() => (K(la), W(u), W(te), G(() => la(W(u).document, W(te)).items.map((e) => e.id)))), n = /* @__PURE__ */ P(() => (W(u), G(() => new URLSearchParams(location.search).has("scope") ? `taskprogress.cards.checklist.v1:${location.pathname}:${new URLSearchParams(location.search).get("scope")}:${new URLSearchParams(location.search).get("task")}:${W(u).document.roundIdentity}` : null)));
			Ti(ko(l, {
				get expanded() {
					return W(ie);
				},
				onToggleAll: ce,
				get items() {
					return W(a);
				},
				get hiddenCount() {
					return W(e);
				},
				onShowHidden: le,
				get allIds() {
					return W(t);
				},
				get storageKey() {
					return W(n);
				},
				children: de,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ P(() => t.item), r = /* @__PURE__ */ P(() => t.visibilityEnabled), i = /* @__PURE__ */ P(() => t.visible), a = /* @__PURE__ */ P(() => t.onVisibleChange), o = /* @__PURE__ */ P(() => (W(u), K(W(n)), G(() => W(u).document.items.find((e) => e.id === W(n).id))));
						var s = Ps(), c = R(s);
						{
							let e = /* @__PURE__ */ P(() => (W(ae), K(W(n)), W(ie), G(() => W(ae)[W(n).id] ?? W(ie)))), t = /* @__PURE__ */ P(() => (K(W(n)), G(() => `checklist-body-${W(n).id}`)));
							oo(c, {
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
								onToggle: (e) => se(W(n).id, e),
								get contentId() {
									return W(t);
								},
								get label() {
									return K(W(n)), G(() => W(n).title);
								},
								children: (e, t) => {
									var r = Ms(), i = R(r);
									Ko(R(i), { get text() {
										return K(W(n)), G(() => W(n).outcome);
									} }), M(i);
									var a = z(i, 2), o = (e) => {
										var t = Ss(), r = R(t), i = R(r);
										M(r), M(t), V((e) => X(i, `Depends on ${e ?? ""}`), [() => (K(W(n)), G(() => W(n).dependsOn.join(", ")))]), Y(e, t);
									};
									Z(a, (e) => {
										K(W(n)), G(() => W(n).dependsOn.length) && e(o);
									}), Wr(z(a, 2), 1, () => (K(W(n)), G(() => W(n).checks)), (e) => e.index, (e, t) => {
										let r = /* @__PURE__ */ P(() => (W(t), G(() => W(t).isAcceptance ? "acceptance" : W(t).isManual ? "manual" : null))), i = /* @__PURE__ */ P(() => (K(na), W(t), K(ra), W(u), G(() => na(W(t)) ? ra(W(u).document, W(t)) : null)));
										var a = js(), o = R(a), s = R(o);
										{
											let e = /* @__PURE__ */ P(() => (W(t), G(() => !!(W(t).validity && W(t).validity !== "valid")))), r = /* @__PURE__ */ P(() => (K(na), W(t), W(g), K(W(i)), G(() => na(W(t)) && !W(g) && (!W(i) || W(t).status !== "pending"))));
											Yo(s, {
												get status() {
													return W(t), G(() => W(t).status);
												},
												get stale() {
													return W(e);
												},
												get interactive() {
													return W(r);
												},
												get label() {
													return W(t), G(() => W(t).title);
												},
												onCycle: () => xe(W(n).id, W(t))
											});
										}
										var c = z(s, 2), l = R(c, !0);
										M(c);
										var d = z(c, 2), f = R(d, !0);
										M(d), M(o);
										var p = z(o, 2), m = (e) => {
											var t = Cs(), n = R(t, !0);
											M(t), V(() => X(n, W(i))), Y(e, t);
										};
										Z(p, (e) => {
											K(W(i)), W(t), G(() => W(i) && W(t).status === "pending") && e(m);
										});
										var h = z(p, 2), _ = R(h), v = z(R(_));
										Ko(R(v), { get text() {
											return W(t), G(() => W(t).action);
										} }), M(v), M(_);
										var y = z(_, 2), b = z(R(y));
										Ko(R(b), { get text() {
											return W(t), G(() => W(t).expect);
										} }), M(b), M(y);
										var x = z(y, 2), S = (e) => {
											var n = ws(), r = z(R(n)), i = R(r, !0);
											M(r), M(n), V(() => X(i, (W(t), G(() => W(t).reason)))), Y(e, n);
										};
										Z(x, (e) => {
											W(t), G(() => W(t).reason) && e(S);
										});
										var C = z(x, 2), w = (e) => {
											var n = Ts(), r = z(R(n)), i = R(r, !0);
											M(r), M(n), V(() => X(i, (W(t), G(() => W(t).observed)))), Y(e, n);
										}, T = /* @__PURE__ */ bt(() => (W(t), K(na), G(() => W(t).observed && !(na(W(t)) && W(t).status === "failed"))));
										Z(C, (e) => {
											W(T) && e(w);
										});
										var ee = z(C, 2), te = (e) => {
											var n = Es(), r = z(R(n)), i = R(r, !0);
											M(r), M(n), V(() => X(i, (W(t), G(() => W(t).resolved)))), Y(e, n);
										};
										Z(ee, (e) => {
											W(t), G(() => W(t).resolved) && e(te);
										});
										var ne = z(ee, 2), E = (e) => {
											var n = Ds(), r = z(R(n)), i = R(r, !0);
											M(r), M(n), V(() => X(i, (W(t), G(() => ye[W(t).validity])))), Y(e, n);
										}, D = (e) => {
											var n = Os(), r = z(R(n)), i = R(r, !0);
											M(r), M(n), V(() => X(i, (W(t), G(() => W(t).recorder === "user" ? "使用者" : W(t).recorder)))), Y(e, n);
										};
										Z(ne, (e) => {
											W(t), G(() => W(t).validity && W(t).validity !== "valid") ? e(E) : (W(t), G(() => W(t).recorder) && e(D, 1));
										}), M(h);
										var re = z(h, 2), O = (e) => {
											var r = ks(), i = z(R(r), 2), a = R(i);
											a.value = a.__value = "implementation";
											var o = z(a);
											o.value = o.__value = "condition", M(i);
											var s;
											ui(i), M(r), V(() => {
												i.disabled = W(g), s !== (s = (W(t), G(() => W(t).rejectReason ?? "implementation"))) && (i.value = (i.__value = (W(t), G(() => W(t).rejectReason ?? "implementation"))) ?? "", li(i, (W(t), G(() => W(t).rejectReason ?? "implementation"))));
											}), q("change", i, (e) => ge({
												type: "set-reason",
												workItemId: W(n).id,
												checkIndex: W(t).index,
												value: e.currentTarget.value
											})), Y(e, r);
										};
										Z(re, (e) => {
											W(t), G(() => W(t).isAcceptance && W(t).status === "failed") && e(O);
										});
										var ie = z(re, 2), ae = (e) => {
											var r = As(), i = z(R(r), 2);
											it(i), M(r), V(() => {
												i.disabled = W(g), vi(i, (W(t), G(() => W(t).observed ?? "")));
											}), q("input", i, (e) => ge({
												type: "set-observed",
												workItemId: W(n).id,
												checkIndex: W(t).index,
												value: e.currentTarget.value
											})), Y(e, r);
										}, oe = /* @__PURE__ */ bt(() => (K(na), W(t), G(() => na(W(t)) && W(t).status === "failed")));
										Z(ie, (e) => {
											W(oe) && e(ae);
										}), M(a), V(() => {
											Q(a, "id", (K(W(n)), W(t), G(() => `check-${W(n).id}-${W(t).index}`))), oi(a, 1, (W(t), K(W(r)), G(() => `checklist-check checklist-${W(t).status}${W(r) ? ` checklist-${W(r)}` : ""}`))), X(l, (W(t), G(() => W(t).title))), oi(d, 1, `checklist-owner${W(r) ? ` checklist-owner-${W(r)}` : ""}`), X(f, (K(W(r)), G(() => ve[W(r)] ?? "Agent")));
										}), Y(e, a);
									}), M(r), Y(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = Ns(), i = R(r);
										{
											let e = /* @__PURE__ */ P(() => (K(W(n)), G(() => `工作項目 ${W(n).id}`)));
											Yo(i, {
												get status() {
													return K(W(n)), G(() => W(n).status);
												},
												get label() {
													return W(e);
												}
											});
										}
										var a = z(i, 2);
										Qo(a, {
											get id() {
												return K(W(n)), G(() => W(n).id);
											},
											get label() {
												return K(W(n)), G(() => W(n).title);
											}
										});
										var s = z(a, 2), c = R(s), l = R(c);
										M(c), M(s);
										var u = z(s, 2), d = R(u);
										M(u), M(r), V(() => {
											X(l, `${K(W(n)), G(() => W(n).id) ?? ""}. ${K(W(n)), G(() => W(n).title) ?? ""}`), Q(u, "aria-label", (K(W(o)), G(() => `通過 ${W(o).progress.passed}，共 ${W(o).progress.total}`))), X(d, `${K(W(o)), G(() => W(o).progress.passed) ?? ""}/${K(W(o)), G(() => W(o).progress.total) ?? ""}`);
										}), Y(e, r);
									}
								}
							});
						}
						M(s), V(() => oi(s, 1, (K(W(n)), G(() => `checklist-item checklist-${W(n).status}`)))), Y(e, s);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ P(() => (W(u), W(te), G(() => re(W(u).document, W(te))))), n = /* @__PURE__ */ P(() => (K(zi), W(w), G(() => zi(W(w)))));
							zo(e, {
								get categories() {
									return W(t);
								},
								get order() {
									return W(te);
								},
								get selected() {
									return W(w), G(() => W(w).selected);
								},
								get defaultLit() {
									return W(n);
								},
								className: "status-filter-strip status-summary-filters",
								ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
								reorderable: !0,
								onSelect: ne,
								onSelectDefault: E,
								onReorder: D
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => L(O, e), () => W(O));
		}
		M(c);
		var d = z(c, 2), f = R(d);
		{
			let e = /* @__PURE__ */ P(() => (W(u), W(g), G(() => W(u).saving || W(g))));
			fs(f, {
				get cautious() {
					return W(u), G(() => W(u).cautious);
				},
				onToggleCautious: Te,
				get dirty() {
					return W(u), G(() => W(u).dirty);
				},
				get saving() {
					return W(e);
				},
				get canUndo() {
					return W(u), G(() => W(u).history.canUndo);
				},
				get canRedo() {
					return W(u), G(() => W(u).history.canRedo);
				},
				get message() {
					return W(m);
				},
				onSave: k,
				onUndo: Se,
				onRedo: Ce,
				onDiscard: we
			});
		}
		var p = z(f, 2), h = (e) => {
			var t = Fs();
			V(() => {
				t.disabled = !W(r), Q(t, "title", (W(u), G(() => W(u).dirty || W(u).pending || W(u).saving ? "請先儲存或捨棄變更，再清空。" : "將實機檢查重設為未執行；Agent 檢查結果保留")));
			}), q("click", t, b), Y(e, t);
		};
		Z(p, (e) => {
			K(o()), G(() => typeof o()?.reset == "function") && e(h);
		}), M(d), V((e) => {
			Q(d, "data-state", e), Q(d, "aria-busy", (W(u), W(g), G(() => W(u).saving || W(g))));
		}, [() => (W(u), G(() => fe(W(u).status)))]), Si(s, () => W(_e), (e) => L(_e, e)), Y(e, t);
	};
	Z(Re, (e) => {
		W(d) ? e(ze) : W(u) ? e(N, -1) : e(Be, 1);
	}), M(Oe), No(z(Oe, 2), {
		get open() {
			return W(h);
		},
		title: "清空結果？",
		titleId: "checklist-reset-title",
		kicker: "Checklist",
		onClose: () => {
			L(h, !1);
		},
		children: (e, t) => {
			var n = Ls(), r = pn(n), i = R(r);
			M(r);
			var a = z(r, 4), o = z(R(a), 2);
			M(a), V(() => {
				X(i, `將 ${W(_), G(() => W(_).length) ?? ""} 個實機檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。其他檢查結果不受影響。`), o.disabled = W(g);
			}), q("click", o, x), Y(e, n);
		},
		$$slots: { default: !0 }
	}), V(() => X(j, (W(u), G(() => W(u)?.document.fileName ?? "TaskProgress Checklist")))), Y(e, Ee), Ue();
}
Tr([
	"change",
	"input",
	"click"
]), (function(e) {
	let t = [
		{
			value: 0,
			label: "立即",
			tone: "urgent"
		},
		{
			value: 1,
			label: "優先",
			tone: "important"
		},
		{
			value: 2,
			label: "一般",
			tone: "normal"
		},
		{
			value: 3,
			label: "次要",
			tone: "secondary"
		},
		{
			value: 4,
			label: "未指定",
			tone: "unspecified",
			hidden: !0
		}
	];
	function n(e) {
		let t = /* @__PURE__ */ new Map(), r = Array.isArray(e) && e.length === 5;
		(Array.isArray(e) ? e : []).forEach((e) => {
			let n = e?.value;
			if (!Number.isInteger(n) || n < 0 || n > 4 || t.has(n)) {
				r = !1;
				return;
			}
			t.set(n, e);
		});
		let i = /* @__PURE__ */ new Set(), a = Object.freeze(Array.from({ length: 5 }, (e, n) => {
			let a = 0 + n, o = t.get(a), s = typeof o?.label == "string" ? o.label.trim() : "";
			return s || (r = !1), i.has(s) && (r = !1), s && i.add(s), Object.freeze({
				value: a,
				label: s,
				tone: typeof o?.tone == "string" && o.tone.trim() ? o.tone.trim() : "normal",
				hidden: o?.hidden === !0
			});
		})), o = Object.freeze(Object.fromEntries(a.map((e) => [e.value, e])));
		function s(e, t = 4) {
			let n = typeof e == "string" && e.trim() !== "" ? Number(e) : e;
			return Number.isInteger(n) && n >= 0 && n <= 4 ? n : t;
		}
		function c(e, t = 4) {
			return o[s(e, t)] ?? null;
		}
		function l(e, t = 4) {
			let n = c(e, t);
			return n ? r ? n.label : `P${n.value}` : "";
		}
		return Object.freeze({
			levels: a,
			minimum: 0,
			maximum: 4,
			fallbackValue: 4,
			creationDefaultValue: 4,
			labelsValid: r,
			normalize: s,
			metadata: c,
			format: l,
			create: n
		});
	}
	e.TaskProgressPriorityPolicy = n(t);
})(globalThis), Object.freeze([
	"created",
	"started",
	"updated",
	"done",
	"takeover",
	"released",
	"disputed"
]), Object.freeze(["1.0", "1.1"]), Object.freeze(["standard", "report_pointer"]), Object.freeze({
	planned: {
		label: "待處理",
		tone: "neutral"
	},
	in_progress: {
		label: "進行中",
		tone: "active"
	},
	blocked: {
		label: "受阻",
		tone: "danger"
	},
	done: {
		label: "已完成",
		tone: "success"
	},
	archive: {
		label: "已封存",
		tone: "muted"
	}
});
var Bs = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(Bs.levels.map((e) => [e.value, e]))), Bs.fallbackValue;
var Vs = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
function Hs(e, t = "auto") {
	if (typeof e != "string" || e.length > 100 || !Vs.test(e)) throw Error("scope 無效。");
	if (![
		"auto",
		"none",
		"explicit"
	].includes(t)) throw Error("Developer 顯示模式無效。");
	let n = new URLSearchParams({ scope: e });
	return t === "none" && n.set("dev", "none"), t === "explicit" && n.set("dev", `../reports/${e}/report.dev.json`), `?${n}`;
}
function Us(e) {
	if (typeof e != "string" || e.length > 100 || !Vs.test(e)) throw Error("scope 必須是小寫英數字組成的穩定 ID，可使用點、底線或連字號。");
	return `../reports/${e}/report.json`;
}
Object.freeze([
	"status",
	"summary",
	"completed_items",
	"pending_items",
	"progress",
	"priority"
]);
//#endregion
//#region viewer/assets/owner-report.js
async function Ws(e, t = globalThis.fetch) {
	try {
		let n = await t(Us(e), {
			cache: "no-store",
			signal: AbortSignal.timeout(5e3)
		});
		if (!n.ok) return null;
		let r = await n.json();
		return r?.scope_id !== e || typeof r.title != "string" || !r.title.trim() || !Array.isArray(r.tasks) ? null : {
			title: r.title,
			href: `/${Hs(e)}`
		};
	} catch {
		return null;
	}
}
//#endregion
//#region viewer/assets/checklist-http-transport.js
var Gs = 1, Ks = /* @__PURE__ */ new Set([
	"load",
	"save",
	"reset"
]);
function qs({ scope: e, task: t, fetchImpl: n = globalThis.fetch, apiRoot: r = "/__taskprogress/v1" } = {}) {
	if (typeof e != "string" || !e) throw TypeError("Checklist HTTP transport 需要 scope。");
	if (typeof t != "string" || !t) throw TypeError("Checklist HTTP transport 需要 task。");
	if (typeof n != "function") throw TypeError("Checklist HTTP transport 需要 fetch。");
	let i = 0;
	async function a(a, o) {
		if (!Ks.has(a)) throw Error(`不支援的 Checklist request：${a}`);
		let s = {
			version: Gs,
			id: `checklist-${Date.now()}-${++i}`,
			type: a
		};
		o !== void 0 && (s.payload = o);
		let c;
		try {
			c = await n(`${r}/checklists/${encodeURIComponent(e)}/${encodeURIComponent(t)}`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-TaskProgress-Editor": "1"
				},
				body: JSON.stringify(s)
			});
		} catch (e) {
			throw Error(`Checklist request 無法送出：${e.message}`, { cause: e });
		}
		if (!c.ok) {
			let e = `HTTP ${c.status}`;
			try {
				let t = await c.json();
				e = t.detail ?? t.title ?? e;
			} catch {}
			throw Error(`Checklist request 失敗：${e}`);
		}
		let l = await c.json();
		if (l.type === "result") return l.payload;
		let u = Error(l.error?.message ?? "Checklist bridge request failed.");
		throw u.code = l.error?.code ?? "bridge_error", u;
	}
	return Object.freeze({
		loadOwnerReport: () => Ws(e, n),
		load: () => a("load"),
		save: (e) => a("save", e),
		reset: (e = {}) => a("reset", e)
	});
}
//#endregion
//#region viewer/assets/foreground-refresh.js
function Js(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function Ys({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (Js(e, "windowTarget"), Js(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
	if (typeof r != "function") throw TypeError("reload 必須是函式。");
	if (typeof i != "function") throw TypeError("schedule 必須是函式。");
	let a = !1, o = !1, s = !1, c = !1;
	function l() {
		c || (a = !0);
	}
	function u() {
		if (o = !1, c || s || !a || (a = !1, n() !== !0)) return;
		s = !0;
		let e;
		try {
			e = r();
		} catch {
			s = !1;
			return;
		}
		if (e && typeof e.then == "function") return e.catch(() => {}).finally(() => {
			s = !1;
		});
		s = !1;
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
//#region experiments/editor-svelte-spike/src/checklist-browser-main.js
function Xs() {
	try {
		let e = new URLSearchParams(location.search);
		return qs({
			scope: e.get("scope"),
			task: e.get("task")
		});
	} catch (e) {
		let t = () => Promise.reject(e);
		return {
			load: t,
			save: t
		};
	}
}
var Zs = null, Qs = null;
Ys({
	canRefresh: () => !Qs?.dirty && !Qs?.saving && !Qs?.pending,
	reload: async () => {
		Zs && await Zs();
	}
}), Fr(zs, {
	target: document.querySelector("#app"),
	props: {
		transport: Xs(),
		bindRefresh: (e) => {
			Zs = e;
		},
		onPersistenceChange: (e) => {
			Qs = e;
		}
	}
});
//#endregion
