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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 65536, ee = 1 << 21, te = 1 << 22, ne = 1 << 23, D = Symbol("$state"), re = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var we = {}, O = Symbol("uninitialized"), Te = "http://www.w3.org/1999/xhtml";
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
var k = !1;
function Ae(e) {
	k = e;
}
var A;
function je(e) {
	if (e === null) throw De(), we;
	return A = e;
}
function Me() {
	return je(/* @__PURE__ */ ln(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ ln(A) !== null) throw De(), we;
		A = e;
	}
}
function Ne(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ ln(n);
		A = n;
	}
}
function Pe(e = !0) {
	for (var t = 0, n = A;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ ln(n);
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
var M = null;
function Ve(e) {
	M = e;
}
function He(e, t = !1, n) {
	M = {
		p: M,
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
	var t = M, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) xn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, M = t.p, e ?? {};
}
function We() {
	return !ze || M !== null && M.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ge = [];
function Ke() {
	var e = Ge;
	Ge = [], p(e);
}
function qe(e) {
	if (Ge.length === 0 && !Ot) {
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
	if (t === null) return H.f |= ne, e;
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
function N(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? N(e, h) : N(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= E, $e(t.deps));
}
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), $e(e.deps), N(e, h);
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
	k && /* @__PURE__ */ cn(e) !== null && dn(e);
}
var it = !1;
function at() {
	it || (it = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = H, n = U;
	Kn(null), qn(null);
	try {
		return e();
	} finally {
		Kn(t), qn(n);
	}
}
function st(e, t, n, r = n) {
	e.addEventListener(t, () => ot(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), at();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ct(e) {
	let t = 0, n = Gt(0), r;
	return () => {
		vn() && (W(n), On(() => (t === 0 && (r = G(() => e(() => Xt(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Xt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var lt = S | C;
function ut(e, t, n, r) {
	new dt(e, t, n, r);
}
var dt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = k ? A : null;
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
	#h = ct(() => (this.#m = Gt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = kn(() => {
			if (k) {
				let e = this.#t;
				Me();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, lt), k && (this.#e = A);
	}
	#g() {
		try {
			this.#a = An(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		qe(r), t && (this.#s = An(() => {
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
			t = !0, n && Ce(), this.#s !== null && In(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = An(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = sn();
			e.append(t), this.#a = this.#S(() => An(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, In(this.#o, () => {
				this.#o = null;
			}), this.#x(F));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = An(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Bn(this.#a, e);
				let t = this.#n.pending;
				this.#o = An(() => t(this.#e));
			} else this.#x(F);
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
		var t = U, n = H, r = M;
		qn(this.#i), Kn(this.#i), Ve(this.#i.ctx);
		try {
			return Pt.ensure(), e();
		} catch (e) {
			return Ye(e), null;
		} finally {
			qn(t), Kn(n), Ve(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && In(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && Jt(this.#m, this.#l);
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
		this.#a &&= (V(this.#a), null), this.#o &&= (V(this.#o), null), this.#s &&= (V(this.#s), null), k && (je(this.#t), Ne(), je(Pe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return An(() => {
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
function ft(e, t, n, r) {
	let i = We() ? gt : P;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = pt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Xe(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ vt(e))).then(u).catch((e) => Xe(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mt();
	}) : f();
}
function pt() {
	var e = U, t = H, n = M, r = F;
	return function(i = !0) {
		qn(e), Kn(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mt(e = !0) {
	qn(null), Kn(null), Ve(null), e && F?.deactivate();
}
function ht() {
	var e = U, t = e.b, n = F, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gt(e) {
	var t = 2 | g;
	return U !== null && (U.f |= C), {
		ctx: M,
		deps: null,
		effects: null,
		equals: Ie,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: O,
		wv: 0,
		parent: U,
		ac: null
	};
}
var _t = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vt(e, t, n) {
	let r = U;
	r === null && pe();
	var i = void 0, a = Gt(O), o = !H, s = /* @__PURE__ */ new Set();
	return Dn(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
			}).finally(mt);
		} catch (e) {
			n.reject(e), mt();
		}
		var c = F;
		if (o) {
			if (t.f & 32768) var l = ht();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_t);
			else for (let e of s.values()) e.reject(_t);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _t && (c.activate(), t ? (a.f |= ne, Jt(a, t)) : (a.f & 8388608 && (a.f ^= ne), Jt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), yn(() => {
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
function P(e) {
	let t = /* @__PURE__ */ gt(e);
	return t.equals = Re, t;
}
function yt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) V(t[n]);
	}
}
function bt(e) {
	var t, n = U, r = e.parent;
	if (!Un && r !== null && e.v !== O && r.f & 24576) return Ee(), e.v;
	qn(r);
	try {
		e.f &= ~E, yt(e), t = sr(e);
	} finally {
		qn(n);
	}
	return t;
}
function xt(e) {
	var t = bt(e);
	if (!e.equals(t) && (e.wv = ir(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Tt?.capture(e, t, !0)), e.deps === null))) {
		N(e, h);
		return;
	}
	Un || (Et === null ? Qe(e) : (vn() || F?.is_fork) && Et.set(e, t));
}
function St(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), lr(t, 0), Mn(t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && ur(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var wt = null, F = null, Tt = null, Et = null, Dt = null, Ot = !1, kt = !1, At = null, jt = null, Mt = 0, Nt = 1, Pt = class e {
	id = Nt++;
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
		wt === null ? wt = this : (wt.#n = this, this.#t = wt), wt = this;
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
			for (var r of n.d) N(r, g), t(r);
			for (r of n.m) N(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Mt++ > 1e3 && (this.#x(), It());
		for (let e of this.#u) this.#d.delete(e), N(e, g), this.schedule(e);
		for (let e of this.#d) N(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = At = [], r = [], i = jt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Vt(e), this.#h() || this.discard(), t;
		}
		if (F = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (At = null, jt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Bt(e, t);
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
		this.#r.clear(), Tt = this, Rt(r), Rt(n), Tt = null, this.#s?.resolve();
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
				a ? r.f ^= h : i & 4 ? t.push(r) : ar(r) && (i & 16 && this.#d.add(r), ur(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), N(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), F = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== O && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Et?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, Et = null;
	}
	flush() {
		try {
			kt = !0, F = this, this.#g();
		} finally {
			Mt = 0, Dt = null, At = null, jt = null, kt = !1, F = null, Et = null, Ut.clear();
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
			!kt && !Ot && qe(() => {
				t.#e || t.flush();
			});
		}
		return F;
	}
	apply() {
		Et = null;
	}
	schedule(e) {
		if (Dt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (At !== null && t === U && (H === null || !(H.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? wt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ft(e) {
	var t = Ot;
	Ot = !0;
	try {
		var n;
		for (e && (F !== null && !F.is_fork && F.flush(), n = e());;) {
			if (Je(), F === null) return n;
			F.flush();
		}
	} finally {
		Ot = t;
	}
}
function It() {
	try {
		ve();
	} catch (e) {
		Xe(e, Dt);
	}
}
var Lt = null;
function Rt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ar(r) && (Lt = /* @__PURE__ */ new Set(), ur(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fn(r), Lt?.size > 0)) {
				Ut.clear();
				for (let e of Lt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Lt.has(n) && (Lt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || ur(n);
					}
				}
				Lt.clear();
			}
		}
		Lt = null;
	}
}
function zt(e) {
	F.schedule(e);
}
function Bt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, h);
		for (var n = e.first; n !== null;) Bt(n, t), n = n.next;
	}
}
function Vt(e) {
	N(e, h);
	for (var t = e.first; t !== null;) Vt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ht = /* @__PURE__ */ new Set(), Ut = /* @__PURE__ */ new Map(), Wt = !1;
function Gt(e, t) {
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
function Kt(e, t) {
	let n = Gt(e, t);
	return Yn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = Gt(e);
	return t || (r.equals = Re), ze && n && M !== null && M.l !== null && (M.l.s ??= []).push(r), r;
}
function qt(e, t) {
	return L(e, G(() => W(e))), t;
}
function L(e, t, n = !1) {
	return H !== null && (!Gn || H.f & 131072) && We() && H.f & 4325394 && (Jn === null || !Jn.has(e)) && Se(), Jt(e, n ? Qt(t) : t, jt);
}
function Jt(e, t, n = null) {
	if (!e.equals(t)) {
		Ut.set(e, Un ? t : e.v);
		var r = Pt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && bt(t), Et === null && Qe(t);
		}
		e.wv = ir(), Zt(e, g, n), We() && U !== null && U.f & 1024 && !(U.f & 96) && (Qn === null ? $n([e]) : Qn.push(e)), !r.is_fork && Ht.size > 0 && !Wt && Yt();
	}
	return t;
}
function Yt() {
	Wt = !1;
	for (let e of Ht) {
		e.f & 1024 && N(e, _);
		let t;
		try {
			t = ar(e);
		} catch {
			t = !0;
		}
		t && ur(e);
	}
	Ht.clear();
}
function Xt(e) {
	L(e, e.v + 1);
}
function Zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = We(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & g) === 0;
			if (l && N(s, t), c & 131072) Ht.add(s);
			else if (c & 2) {
				var u = s;
				Et?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= E), Zt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Lt !== null && Lt.add(d), n === null ? zt(d) : n.push(d);
			}
		}
	}
}
function Qt(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Kt(0), u = null, d = nr, f = (e) => {
		if (nr === d) return e();
		var t = H, n = nr;
		Kn(null), rr(d);
		var r = e();
		return Kn(t), rr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Kt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Kt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Kt(O, u));
					r.set(t, e), Xt(o);
				}
			} else L(n, O), Xt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === D) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Kt(Qt(s ? e[n] : O), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === O ? void 0 : c;
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
				if (a !== void 0 && o !== O) return {
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
			var n = r.get(t), i = n !== void 0 && n.v !== O || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Kt(i ? Qt(e[t]) : O, u)), r.set(t, n)), W(n) === O) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Kt(O, u)), r.set(d + "", p)) : L(p, O);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Kt(void 0, u)), L(c, Qt(n)), r.set(t, c));
			else {
				l = c.v !== O;
				var m = f(() => Qt(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				Xt(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== O;
			});
			for (var [n, i] of r) i.v !== O && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			xe();
		}
	});
}
function $t(e) {
	try {
		if (typeof e == "object" && e && D in e) return e[D];
	} catch {}
	return e;
}
function en(e, t) {
	return Object.is($t(e), $t(t));
}
var tn, nn, rn, an;
function on() {
	if (tn === void 0) {
		tn = window, nn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		rn = a(t, "firstChild").get, an = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
	}
}
function sn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
function R(e, t) {
	if (!k) return /* @__PURE__ */ cn(e);
	var n = /* @__PURE__ */ cn(A);
	if (n === null) n = A.appendChild(sn());
	else if (t && n.nodeType !== 3) {
		var r = sn();
		return n?.before(r), je(r), r;
	}
	return t && mn(n), je(n), n;
}
function un(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ cn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ln(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = sn();
			return A?.before(r), je(r), r;
		}
		mn(A);
	}
	return A;
}
function z(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ ln(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = sn();
			return r === null ? i?.after(a) : r.before(a), je(a), a;
		}
		mn(r);
	}
	return je(r), r;
}
function dn(e) {
	e.textContent = "";
}
function fn() {
	return !1;
}
function pn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function mn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function hn(e) {
	U === null && (H === null && _e(e), ge()), Un && he(e);
}
function gn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function _n(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: M,
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
	if (e & 4) At === null ? Pt.ensure().schedule(r) : At.push(r);
	else if (t !== null) {
		try {
			ur(r);
		} catch (e) {
			throw V(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && gn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function vn() {
	return H !== null && !Gn;
}
function yn(e) {
	let t = _n(8, null);
	return N(t, h), t.teardown = e, t;
}
function bn(e) {
	hn("$effect");
	var t = U.f;
	if (!H && t & 32 && M !== null && !M.i) {
		var n = M;
		(n.e ??= []).push(e);
	} else return xn(e);
}
function xn(e) {
	return _n(4 | w, e);
}
function Sn(e) {
	return hn("$effect.pre"), _n(8 | w, e);
}
function Cn(e) {
	Pt.ensure();
	let t = _n(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? In(t, () => {
			V(t), n(void 0);
		}) : (V(t), n(void 0));
	});
}
function wn(e) {
	return _n(4, e);
}
function Tn(e, t) {
	var n = M, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = On(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				qn(n.parent), G(t);
			} finally {
				qn(n);
			}
		}
	});
}
function En() {
	var e = M;
	On(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && N(n, _), ar(n) && ur(n), t.ran = !1;
		}
	});
}
function Dn(e) {
	return _n(te | C, e);
}
function On(e, t = 0) {
	return _n(8 | t, e);
}
function B(e, t = [], n = [], r = []) {
	ft(r, t, n, (t) => {
		_n(8, () => {
			e(...t.map(W));
		});
	});
}
function kn(e, t = 0) {
	return _n(16 | t, e);
}
function An(e) {
	return _n(32 | C, e);
}
function jn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Un, n = H;
		Wn(!0), Kn(null);
		try {
			t.call(null);
		} finally {
			Wn(e), Kn(n);
		}
	}
}
function Mn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : V(n, t), n = r;
	}
}
function Nn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || V(t), t = n;
	}
}
function V(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Pn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Mn(e, t && !n), lr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	jn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Fn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ln(e);
		e.remove(), e = n;
	}
}
function Fn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function In(e, t, n = !0) {
	var r = [];
	Ln(e, r, !0);
	var i = () => {
		n && V(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ln(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Ln(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Rn(e) {
	zn(e, !0);
}
function zn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (N(e, g), Pt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ln(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Vn = null, Hn = !1, Un = !1;
function Wn(e) {
	Un = e;
}
var H = null, Gn = !1;
function Kn(e) {
	H = e;
}
var U = null;
function qn(e) {
	U = e;
}
var Jn = null;
function Yn(e) {
	H !== null && (Jn ??= /* @__PURE__ */ new Set()).add(e);
}
var Xn = null, Zn = 0, Qn = null;
function $n(e) {
	Qn = e;
}
var er = 1, tr = 0, nr = tr;
function rr(e) {
	nr = e;
}
function ir() {
	return ++er;
}
function ar(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ar(a) && xt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Et === null && N(e, h);
	}
	return !1;
}
function or(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Jn !== null && Jn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? or(a, t, !1) : t === a && (n ? N(a, g) : a.f & 1024 && N(a, _), zt(a));
	}
}
function sr(e) {
	var t = Xn, n = Zn, r = Qn, i = H, a = Jn, o = M, s = Gn, c = nr, l = e.f;
	Xn = null, Zn = 0, Qn = null, H = l & 96 ? null : e, Jn = null, Ve(e.ctx), Gn = !1, nr = ++tr, e.ac !== null && (ot(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= ee;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = F?.is_fork;
		if (Xn !== null) {
			var m;
			if (p || lr(e, Zn), f !== null && Zn > 0) for (f.length = Zn + Xn.length, m = 0; m < Xn.length; m++) f[Zn + m] = Xn[m];
			else e.deps = f = Xn;
			if (vn() && e.f & 512) for (m = Zn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Zn < f.length && (lr(e, Zn), f.length = Zn);
		if (We() && Qn !== null && !Gn && f !== null && !(e.f & 6146)) for (m = 0; m < Qn.length; m++) or(Qn[m], e);
		if (i !== null && i !== e) {
			if (tr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = tr;
			if (t !== null) for (let e of t) e.rv = tr;
			Qn !== null && (r === null ? r = Qn : r.push(...Qn));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (e) {
		return Ye(e);
	} finally {
		e.f ^= ee, Xn = t, Zn = n, Qn = r, H = i, Jn = a, Ve(o), Gn = s, nr = c;
	}
}
function cr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Xn === null || !n.call(Xn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== O && Qe(s), s.ac !== null && ot(() => {
			s.ac.abort(ue), s.ac = null, N(s, g);
		}), St(s), lr(s, 0);
	}
}
function lr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) cr(e, n[r]);
}
function ur(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, h);
		var n = U, r = Hn;
		U = e, Hn = !(t & 96);
		try {
			t & 16777232 ? Nn(e) : Mn(e), jn(e);
			var i = sr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = er;
		} finally {
			Hn = r, U = n;
		}
	}
}
async function dr() {
	await Promise.resolve(), Ft();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Vn?.add(e), H !== null && !Gn && !(U !== null && U.f & 16384) && (Jn === null || !Jn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < tr && (e.rv = tr, Xn === null && r !== null && r[Zn] === e ? Zn++ : Xn === null ? Xn = [e] : Xn.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Un && Ut.has(e)) return Ut.get(e);
	if (t) {
		var a = e;
		if (Un) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || pr(a)) && (o = bt(a)), Ut.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && H !== null && (Hn || !!(H.f & 512)), c = (a.f & b) === 0;
		ar(a) && (s && (a.f |= 512), xt(a)), s && !c && (Ct(a), fr(a));
	}
	if (Et?.has(e)) return Et.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function fr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ct(t), fr(t));
}
function pr(e) {
	if (e.v === O) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Ut.has(t) || t.f & 2 && pr(t)) return !0;
	return !1;
}
function G(e) {
	var t = Gn;
	try {
		return Gn = !0, e();
	} finally {
		Gn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) mr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && mr(n);
		}
	}
}
function mr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			mr(e[n], t);
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
var hr = ["touchstart", "touchmove"];
function gr(e) {
	return hr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var _r = Symbol("events"), vr = /* @__PURE__ */ new Set(), yr = /* @__PURE__ */ new Set();
function br(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || wr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function xr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = br(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && yn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[_r] ??= {})[e] = n;
}
function Sr(e) {
	for (var t = 0; t < e.length; t++) vr.add(e[t]);
	for (var n of yr) n(e);
}
var Cr = null;
function wr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Cr = e;
	var s = 0, c = Cr === e && e[_r];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[_r] = t;
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
		Kn(null), qn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[_r]?.[r];
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
			e[_r] = t, delete e.currentTarget, Kn(d), qn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Tr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Er(e) {
	return Tr?.createHTML(e) ?? e;
}
function Dr(e) {
	var t = pn("template");
	return t.innerHTML = Er(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Or(e, t) {
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
		if (k) return Or(A, null), A;
		i === void 0 && (i = Dr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ cn(i)));
		var t = r || nn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ cn(t), s = t.lastChild;
			Or(o, s);
		} else Or(t, t);
		return t;
	};
}
function kr() {
	if (k) return Or(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = sn();
	return e.append(t, n), Or(t, n), e;
}
function Y(e, t) {
	if (k) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = A), Me();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Ar(e, t) {
	return Mr(e, t);
}
var jr = /* @__PURE__ */ new Map();
function Mr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	on();
	var l = void 0, u = Cn(() => {
		var s = n ?? t.appendChild(sn());
		ut(s, { pending: () => {} }, (t) => {
			He({});
			var n = M;
			if (o && (n.c = o), a && (i.$$events = a), k && Or(t, null), l = e(t, i) || {}, k && (U.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw De(), we;
			Ue();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = gr(r);
					for (let e of [t, document]) {
						var a = jr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), jr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, wr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(vr)), yr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = jr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, wr), r.delete(e), r.size === 0 && jr.delete(n)) : r.set(e, i);
			}
			yr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Nr.set(l, u), l;
}
var Nr = /* @__PURE__ */ new WeakMap(), Pr = class {
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
			if (n) Rn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Rn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (V(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Bn(r, t), t.append(sn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else V(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), In(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (V(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = F, r = fn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = sn();
			i.append(a), this.#n.set(e, {
				effect: An(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, An(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = A), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	k && (r = A, Me());
	var i = new Pr(e), a = n ? S : 0;
	function o(e, t) {
		if (k) {
			var n = Fe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Pe();
				je(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	kn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Fr(e, t) {
	return t;
}
function Ir(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		In(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Lr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			dn(d), d.append(u), e.items.clear();
		}
		Lr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Lr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Bn(a, document.createDocumentFragment())) : V(t[i], n);
	}
}
var Rr;
function zr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = k ? je(/* @__PURE__ */ cn(u)) : u.appendChild(sn());
	}
	k && Me();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Vr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Ur(d, null, c)) : Rn(d) : In(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: kn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			k && Fe(c) === "[!" != (e === 0) && (c = Pe(), je(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = fn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (c = A, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Jt(S.v, b), S.i && Jt(S.i, y), v && u.unskip_effect(S.e)) : (S = Hr(l, h ? c : Rr ??= sn(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = An(() => s(c)) : (d = An(() => s(Rr ??= sn())), d.f |= T)), e > r.size && me("", "", ""), k && e > 0 && je(Pe()), !h) if (m.set(u, r), v) {
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
	h = !1, k && (c = A);
}
function Br(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Vr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Br(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Rn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Ur(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Wr(e, d, _), Wr(e, _, y), Ur(_, y, n), d = _, p = [], m = [], l = Br(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ur(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Wr(e, S.prev, C.next), Wr(e, d, S), Wr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Ur(_, l, n), Wr(e, _.prev, _.next), Wr(e, _, d === null ? e.effect.first : d.next), Wr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Br(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Br(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Lr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Br(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Ir(e, w, ee);
		}
	}
	o && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Hr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Gt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? Gt(i) : null;
	return {
		v: c,
		i: l,
		e: An(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ur(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ ln(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Wr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Gr = [..." 	\n\r\f\xA0\v﻿"];
function Kr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Gr.includes(r[o - 1])) && (s === r.length || Gr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function qr(e, t, n, r, i, a) {
	var o = e[oe];
	if (k || o !== n || o === void 0) {
		var s = Kr(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Jr(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Oe();
		for (var i of t.options) i.selected = n.includes(Zr(i));
		return;
	}
	for (i of t.options) if (en(Zr(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function Yr(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Jr(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), yn(() => {
		t.disconnect();
	});
}
function Xr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	st(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Zr);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Zr(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), wn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
			if (r.has(o)) return;
		}
		if (Jr(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Zr(s), n(a));
		}
		e.__value = a, i = !1;
	}), Yr(e);
}
function Zr(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Qr = Symbol("is custom element"), $r = Symbol("is html"), ei = de ? "link" : "LINK", ti = de ? "progress" : "PROGRESS";
function ni(e) {
	if (k) {
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
		e[le] = n, qe(n), at();
	}
}
function ri(e, t) {
	var n = ii(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ti) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = ii(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ei) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ii(e) {
	return e[ae] ??= {
		[Qr]: e.nodeName.includes("-"),
		[$r]: e.namespaceURI === Te
	};
}
var ai = /* @__PURE__ */ new Map();
function oi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ai.get(t);
	if (n) return n;
	ai.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function si(e, t) {
	return e === t || e?.[D] === t;
}
function ci(e = {}, t, n, r) {
	var i = M.r, a = U;
	return wn(() => {
		var o, s;
		return On(() => {
			o = s, s = r?.() || [], G(() => {
				si(n(...s), e) || (t(e, ...s), o && si(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && si(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function li(e = !1) {
	let t = M, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ gt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && Sn(() => {
		ui(t, r), p(n.b);
	}), bn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && bn(() => {
		ui(t, r), p(n.a);
	});
}
function ui(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !ze || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ gt(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = D in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = nt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ye(t), f(m)));
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
	var v = !1, y = (n & 1 ? gt : P)(() => (v = !1, g()));
	o && W(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? Qt(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Un && v || b.f & 16384 ? y.v : W(y);
	});
}
function di(e) {
	M === null && fe("onMount"), ze && M.l !== null ? fi(M).m.push(e) : bn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function fi(e) {
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
//#region viewer/assets/editor-transaction.js
function pi(e) {
	return structuredClone(e);
}
function mi(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
	let r = pi(e), i = pi(r), a = pi(i), o = t(a), s = [], c = [], l = Number.isInteger(n) && n > 0 ? n : 100, u = (e) => JSON.stringify(e);
	function d() {
		return Object.freeze({
			canUndo: s.length > 0,
			canRedo: c.length > 0,
			undoDepth: s.length,
			redoDepth: c.length
		});
	}
	function f() {
		o = t(a);
	}
	function p(e, t, n = "") {
		if (!e || typeof e != "object" || typeof t != "function") throw TypeError("Editor transaction 需要 command 與 reducer。");
		let r = pi(a), i = t(pi(a), e);
		if (u(r) === u(i)) return !1;
		a = i;
		let o = s.at(-1);
		return n && o?.mergeKey === n ? (o.after = pi(a), o.command = pi(e), u(o.before) === u(o.after) && s.pop()) : (s.push({
			before: r,
			after: pi(a),
			command: pi(e),
			mergeKey: n
		}), s.length > l && s.shift()), c.length = 0, f(), !0;
	}
	function m() {
		let e = s.pop();
		return e ? (c.push(e), a = pi(e.before), f(), !0) : !1;
	}
	function h() {
		let e = c.pop();
		return e ? (s.push(e), a = pi(e.after), f(), !0) : !1;
	}
	function g(e, t = !1) {
		r = pi(e), i = pi(r), a = pi(i), t || (s.length = 0, c.length = 0), f();
	}
	return Object.freeze({
		get draft() {
			return a;
		},
		get derived() {
			return o;
		},
		get dirty() {
			return u(a) !== u(i);
		},
		get history() {
			return d();
		},
		apply: p,
		undo: m,
		redo: h,
		discard() {
			g(r);
		},
		commit(e, { keepHistory: t = !1 } = {}) {
			g(e, t);
		}
	});
}
//#endregion
//#region viewer/assets/checklist-editor.js
function hi(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function gi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function _i(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = gi(e);
	}), t;
}
function vi(e, t) {
	return (e.dependsOn ?? []).some((e) => gi(t.get(e) ?? { checks: [] }) !== "passed");
}
function yi(e) {
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
		a[gi(e)] += 1;
		let t = vi(e, n);
		e.checks.forEach((n) => {
			i.total += 1, i[n.status] = (i[n.status] ?? 0) + 1, r.push(n.status);
			let a = {
				workItemId: e.id,
				checkIndex: n.index,
				itemTitle: e.title,
				title: n.title,
				action: n.action,
				expect: n.expect,
				isManual: n.isManual
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
var bi = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function xi(e, t) {
	let { item: n, check: r } = hi(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? bi[r.status] ?? "pending" : t.status;
		if (![
			"pending",
			"passed",
			"failed"
		].includes(e)) throw Error("不支援的 manual check 狀態。");
		r.status = e, e !== "failed" && (r.observed = null, r.resolved = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = gi(n), e;
}
function Si(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status, e.persistedObserved = e.observed ?? null;
	})), t;
}
var Ci = Object.freeze({
	status: Object.freeze([
		"pending",
		"passed",
		"failed"
	]),
	owner: Object.freeze(["manual", "agent"])
});
function wi(e, t) {
	return !(t.status && e.status !== t.status || t.owner === "manual" && !e.isManual || t.owner === "agent" && e.isManual);
}
function Ti(e, t = {}) {
	let n = Ci.status.includes(t.status) ? t.status : null, r = Ci.owner.includes(t.owner) ? t.owner : null;
	if (!n && !r) return e;
	let i = {
		status: n,
		owner: r
	};
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => wi(e, i))
		})).filter((e) => e.checks.length > 0)
	};
}
function Ei(e, t = {}) {
	let n = e.items.flatMap((e) => e.checks), r = (e) => n.filter(e).length;
	return {
		status: Ci.status.map((e) => ({
			id: e,
			count: r((t) => t.status === e),
			selected: t.status === e
		})),
		owner: Ci.owner.map((e) => ({
			id: e,
			count: r((t) => e === "manual" ? t.isManual : !t.isManual),
			selected: t.owner === e
		}))
	};
}
function Di(e, t = {}) {
	let n = e.revision, r = mi(Si(e), {
		derive: _i,
		historyLimit: t.historyLimit
	});
	function i() {
		let e = structuredClone(r.derived);
		return Object.freeze({
			document: e,
			summary: yi(e),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, xi, t), i();
	}
	function o() {
		let e = [], t = [];
		return r.derived.items.forEach((n) => n.checks.forEach((r) => {
			if (!r.isManual) return;
			let i = String(r.observed ?? "").trim(), a = String(r.persistedObserved ?? "").trim();
			if (r.status !== r.persistedStatus || i !== a) {
				if (r.status === "failed" && !i) {
					t.push({
						code: "observed_required",
						workItemId: n.id,
						checkIndex: r.index,
						message: `「${r.title}」失敗時必須填寫 Observed。`
					});
					return;
				}
				e.push({
					workItemId: n.id,
					checkIndex: r.index,
					status: r.status,
					observed: r.status === "failed" ? i : null
				});
			}
		})), r.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的 manual check 結果。"
		}), Object.freeze({
			revision: n,
			results: e,
			errors: t
		});
	}
	return Object.freeze({
		snapshot: i,
		dispatch: a,
		prepareSave: o,
		undo() {
			return r.undo(), i();
		},
		redo() {
			return r.redo(), i();
		},
		discard() {
			return r.discard(), i();
		},
		commit(e) {
			return n = e.revision, r.commit(Si(e), { keepHistory: !0 }), i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var Oi = "task-progress.cautious-mode.v1", ki = "自動儲存模式。", Ai = "謹慎模式：修改後需按儲存。", ji = "有尚未儲存的變更。", Mi = "即將自動儲存…", Ni = "正在寫入…", Pi = "已儲存。", Fi = "已放棄尚未儲存的變更。", Ii = "沒有需要儲存的變更。", Li = "儲存失敗。", Ri = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function zi(e = globalThis.localStorage) {
	try {
		return e?.getItem(Oi) === "true";
	} catch {
		return !1;
	}
}
function Bi(e, t) {
	let n = t === !0;
	try {
		e?.setItem(Oi, n ? "true" : "false");
	} catch {}
	return n;
}
function Vi({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, timers: a = globalThis, onChange: o = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let s = zi(n), c = "idle", l = s ? Ai : ki, u = !1, d = null, f = Promise.resolve(), p = 0, m = () => e.snapshot();
	function h() {
		let e = m();
		return Object.freeze({
			...e,
			mode: s ? "cautious" : "auto",
			cautious: s,
			status: c,
			message: l,
			blocked: u,
			saving: c === "saving",
			pending: d !== null || p > 0
		});
	}
	function g() {
		o(h());
	}
	function _(e, t) {
		c = e, l = t;
	}
	function v() {
		d !== null && (a.clearTimeout(d), d = null);
	}
	async function y(n) {
		if (u && !n) return;
		if (!m().dirty) {
			n && (_("idle", Ii), g());
			return;
		}
		let r = e.prepareSave();
		if (r.errors.length) {
			_("incomplete", r.errors[0].message), g();
			return;
		}
		u = !1, _("saving", Ni), g();
		try {
			let n = await t({
				revision: r.revision,
				results: r.results
			});
			e.commit(n), _("saved", Pi);
		} catch (e) {
			u = !0, _(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Li);
		}
		g();
	}
	function b(e = !1) {
		return v(), p += 1, f = f.then(() => y(e)).catch((e) => {
			u = !0, _("error", e?.message ?? Li), g();
		}).finally(() => {
			--p;
		}), f;
	}
	async function x() {
		for (let e = 0; e < 8; e += 1) if (d !== null && b(), await f, d === null && p === 0) return;
	}
	function S(e) {
		return s ? (u || _("draft", ji), null) : u ? null : e ? (v(), _("pending", Mi), d = a.setTimeout(() => {
			d = null, b();
		}, r), null) : b();
	}
	function C(e) {
		let t = S(e);
		return g(), t;
	}
	async function w(e) {
		let t = e === !0;
		if (t === s) return h();
		if (t) await x(), s = !0;
		else {
			if (m().dirty) return _("mode_blocked", Ri), g(), h();
			s = !1;
		}
		return Bi(n, s), u || _("idle", s ? Ai : ki), g(), h();
	}
	return Object.freeze({
		snapshot: h,
		dispatch(t) {
			return e.dispatch(t), C(i(t) === !0);
		},
		undo() {
			return e.undo(), C(!1);
		},
		redo() {
			return e.redo(), C(!1);
		},
		discard() {
			return v(), e.discard(), u = !1, _("idle", Fi), g(), h();
		},
		save() {
			return b(!0);
		},
		flush: x,
		setCautious: w
	});
}
//#endregion
//#region viewer/assets/theme-model.js
var Hi = "task-progress.theme.v1", Ui = [
	"system",
	"light",
	"dark",
	"custom"
], Wi = [
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
], Gi = Object.freeze({
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
}), Ki = Object.freeze({
	version: 1,
	mode: "system"
}), qi = /^#[0-9a-f]{6}$/i;
function Ji(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Yi(e) {
	return typeof e == "string" && qi.test(e);
}
function Xi(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Gi[n], i = { base: n };
	for (let e of Wi) {
		let n = t[e.key];
		i[e.key] = Yi(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Zi(e) {
	if (!Ji(e) || e.version !== 1 || !Ui.includes(e.mode)) return { ...Ki };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Ji(e.custom) ? t.custom = Xi(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Xi()), t;
}
function Qi(e) {
	try {
		let t = e?.getItem(Hi);
		return t ? Zi(JSON.parse(t)) : { ...Ki };
	} catch {
		return { ...Ki };
	}
}
function $i(e, t) {
	let n = Zi(t);
	try {
		e?.setItem(Hi, JSON.stringify(n));
	} catch {}
	return n;
}
function ea(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function ta(e, t) {
	let n = Zi(t);
	e.dataset.theme = n.mode;
	for (let t of Wi) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Xi();
		e.dataset.themeBase = t.base;
		for (let n of Wi) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function na(e, t, n = "light") {
	let r = Zi(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Xi(n)), Zi(i);
}
function ra(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function ia(e, t) {
	if (!Yi(e) || !Yi(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => ra(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function aa(e) {
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
	].filter(([, e, t]) => ia(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function oa({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Qi(t);
	e && ta(e, r);
	function i(n) {
		return r = $i(t, n), e && ta(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return ea(n);
		},
		setMode(e) {
			return i(na(r, e, ea(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Xi(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var sa = /* @__PURE__ */ J("<button type=\"button\"> </button>"), ca = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function la(e, t) {
	He(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await dr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function E() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function ee(e, t) {
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
	function ne(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	Tn(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), En(), li();
	var D = ca();
	zr(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = sa(), i = R(r, !0);
		j(r), B((e) => {
			qr(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), Q(r, "draggable", W(n)), X(i, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), xr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), xr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), xr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), xr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), xr("dragend", r, function(...e) {
			(W(n) ? E : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => ee(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), xr("pointercancel", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), Y(e, r);
	}), j(D), ci(D, (e) => L(f, e), () => W(f)), B(() => {
		qr(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), Y(e, D), Ue();
}
Sr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function ua(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = $(t, "categories", 24, () => []), i = $(t, "activeId", 8, null), a = $(t, "ariaLabel", 8, "篩選"), o = $(t, "className", 8, ""), s = $(t, "reorderable", 8, !1), c = $(t, "onSelect", 8, () => {}), l = $(t, "onReorder", 8, () => {}), u = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`;
	Tn(() => (K(r()), K(s()), K(i())), () => {
		L(n, r().map((e) => {
			let t = s() && e.sortable === !0;
			return {
				id: e.id,
				label: u(e),
				className: `filter-button${t ? " status-sortable" : ""}`,
				sortable: t,
				pressed: e.id === i(),
				title: e.title ?? null,
				ariaLabel: e.ariaLabel ?? u(e)
			};
		}));
	}), En(), li(), la(e, {
		get items() {
			return W(n);
		},
		get className() {
			return o();
		},
		get ariaLabel() {
			return a();
		},
		get onActivate() {
			return c();
		},
		get onReorder() {
			return l();
		}
	}), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var da = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), fa = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function pa(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "status", 8, "pending"), o = $(t, "interactive", 8, !1), s = $(t, "label", 8, ""), c = $(t, "onCycle", 8, () => {}), l = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	Tn(() => K(a()), () => {
		L(n, l[a()] ?? "?");
	}), Tn(() => K(a()), () => {
		L(r, u[a()] ?? a());
	}), Tn(() => (K(s()), W(r)), () => {
		L(i, s() ? `${s()}：${W(r)}` : W(r));
	}), En();
	var d = kr(), f = un(d), p = (e) => {
		var t = da(), r = R(t), o = R(r, !0);
		j(r), j(t), B(() => {
			qr(t, 1, `marker-box marker-${a()} marker-box-button`), Q(t, "aria-label", `${W(i)}，點擊切換下一個結果`), X(o, W(n));
		}), q("click", t, function(...e) {
			c()?.apply(this, e);
		}), Y(e, t);
	}, m = (e) => {
		var t = fa(), r = R(t), o = R(r, !0);
		j(r), j(t), B(() => {
			qr(t, 1, `marker-box marker-${a()}`), Q(t, "aria-label", W(i)), X(o, W(n));
		}), Y(e, t);
	};
	Z(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), Y(e, d), Ue();
}
Sr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/NextStepCard.svelte
var ma = /* @__PURE__ */ J("<p class=\"next-step-heading\"> </p>"), ha = /* @__PURE__ */ J("<h3 class=\"next-step-title\"> </h3>"), ga = /* @__PURE__ */ J("<div><dt> </dt><dd> </dd></div>"), _a = /* @__PURE__ */ J("<dl class=\"next-step-fields\"><!> <!></dl>"), va = /* @__PURE__ */ J("<pre class=\"next-step-command\"> </pre>"), ya = /* @__PURE__ */ J("<section class=\"next-step-card\"><!> <!> <!> <!></section>");
function ba(e, t) {
	let n = $(t, "heading", 8, ""), r = $(t, "title", 8, ""), i = $(t, "action", 8, ""), a = $(t, "expect", 8, ""), o = $(t, "command", 8, ""), s = $(t, "actionLabel", 8, "要做什麼"), c = $(t, "expectLabel", 8, "怎樣算通過");
	var l = ya(), u = R(l), d = (e) => {
		var t = ma(), r = R(t, !0);
		j(t), B(() => X(r, n())), Y(e, t);
	};
	Z(u, (e) => {
		n() && e(d);
	});
	var f = z(u, 2), p = (e) => {
		var t = ha(), n = R(t, !0);
		j(t), B(() => X(n, r())), Y(e, t);
	};
	Z(f, (e) => {
		r() && e(p);
	});
	var m = z(f, 2), h = (e) => {
		var t = _a(), n = R(t), r = (e) => {
			var t = ga(), n = R(t), r = R(n, !0);
			j(n);
			var a = z(n), o = R(a, !0);
			j(a), j(t), B(() => {
				X(r, s()), X(o, i());
			}), Y(e, t);
		};
		Z(n, (e) => {
			i() && e(r);
		});
		var o = z(n, 2), l = (e) => {
			var t = ga(), n = R(t), r = R(n, !0);
			j(n);
			var i = z(n), o = R(i, !0);
			j(i), j(t), B(() => {
				X(r, c()), X(o, a());
			}), Y(e, t);
		};
		Z(o, (e) => {
			a() && e(l);
		}), j(t), Y(e, t);
	};
	Z(m, (e) => {
		(i() || a()) && e(h);
	});
	var g = z(m, 2), _ = (e) => {
		var t = va(), n = R(t, !0);
		j(t), B(() => X(n, o())), Y(e, t);
	};
	Z(g, (e) => {
		o() && e(_);
	}), j(l), B(() => Q(l, "aria-label", n() || r())), Y(e, l);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var xa = /* @__PURE__ */ J("<i></i>"), Sa = /* @__PURE__ */ J("<div role=\"img\"></div>"), Ca = /* @__PURE__ */ J("<progress max=\"100\"></progress>");
function wa(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	Tn(() => K(o()), () => {
		L(n, d(o()));
	}), Tn(() => K(a()), () => {
		L(r, Array.isArray(a()) ? a() : []);
	}), En(), li();
	var f = kr(), p = un(f), m = (e) => {
		var t = Sa();
		zr(t, 5, () => W(r), Fr, (e, t) => {
			var n = xa();
			B((e) => qr(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), Y(e, n);
		}), j(t), B(() => {
			qr(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), Y(e, t);
	}, h = (e) => {
		var t = Ca();
		B(() => {
			qr(t, 1, `progress-meter ${c()}`), ri(t, W(n)), Q(t, "aria-label", s());
		}), Y(e, t);
	};
	Z(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), Y(e, f), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var Ta = /* @__PURE__ */ J("<div><b> </b> <span> </span></div>"), Ea = /* @__PURE__ */ J("<div class=\"progress-stats\"></div>"), Da = /* @__PURE__ */ J("<span class=\"progress-note\"> </span>"), Oa = /* @__PURE__ */ J("<p class=\"progress-caption\"><span> </span> <!></p>"), ka = /* @__PURE__ */ J("<section class=\"progress-summary\"><!> <!> <!></section>");
function Aa(e, t) {
	He(t, !1);
	let n = $(t, "stats", 24, () => []), r = $(t, "bar", 8, null), i = $(t, "caption", 8, ""), a = $(t, "note", 8, ""), o = $(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	li();
	var l = ka(), u = R(l), d = (e) => {
		var t = Ea();
		zr(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = Ta(), r = R(n), i = R(r, !0);
			j(r);
			var a = z(r, 2), o = R(a, !0);
			j(a), j(n), B((e) => {
				qr(n, 1, e), X(i, (W(t), G(() => W(t).value))), X(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${c(W(t).tone)}`))]), Y(e, n);
		}), j(t), Y(e, t);
	};
	Z(u, (e) => {
		K(n()), G(() => n().length) && e(d);
	});
	var f = z(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (K(r()), G(() => r().cells ?? []))), n = /* @__PURE__ */ P(() => (K(r()), G(() => r().ratio ?? 0))), a = /* @__PURE__ */ P(() => i() || o());
			wa(e, {
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
		var t = Oa(), n = R(t), r = R(n, !0);
		j(n);
		var o = z(n, 2), s = (e) => {
			var t = Da(), n = R(t, !0);
			j(t), B(() => X(n, a())), Y(e, t);
		};
		Z(o, (e) => {
			a() && e(s);
		}), j(t), B(() => X(r, i())), Y(e, t);
	};
	Z(m, (e) => {
		(i() || a()) && e(h);
	}), j(l), B(() => Q(l, "aria-label", o())), Y(e, l), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var ja = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ma = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Na = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Pa(e, t) {
	He(t, !1);
	let n = $(t, "cautious", 8, !0), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	li();
	var y = Na(), b = un(y), x = R(b, !0);
	j(b);
	var S = z(b, 2), C = R(S), w = R(C, !0);
	j(C);
	var T = z(C, 2), E = R(T, !0);
	j(T), j(S);
	var ee = z(S, 2), te = (e) => {
		var t = ja(), a = R(t, !0);
		j(t), B(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Z(ee, (e) => {
		r() && e(te);
	});
	var ne = z(ee, 2), D = (e) => {
		var t = Ma(), n = un(t), r = R(n, !0);
		j(n);
		var i = z(n, 2), s = R(i, !0);
		j(i), B(() => {
			n.disabled = o(), X(r, m()), i.disabled = !a() || o(), X(s, o() ? d() : u());
		}), q("click", n, function(...e) {
			v()?.apply(this, e);
		}), q("click", i, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	Z(ne, (e) => {
		n() && e(D);
	}), B(() => {
		X(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), X(E, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", T, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), Ue();
}
Sr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Fa = /* @__PURE__ */ J("<option> </option>"), Ia = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), La = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function Ra(e, t) {
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(Xi(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Wi.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Xi(o().base, o()) : Xi(s())), typeof W(f).showModal == "function" ? W(f).showModal() : W(f).setAttribute("open", "");
	}
	function S() {
		W(f).open && W(f).close();
	}
	function C(e) {
		y(Xi(e.currentTarget.value));
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
	function E() {
		L(m, a()), S();
	}
	function ee(e) {
		e.preventDefault(), E();
	}
	function te() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Xi(W(h), W(_))), S();
	}
	Tn(() => K(a()), () => {
		L(m, a());
	}), Tn(() => (W(h), W(_)), () => {
		L(n, Xi(W(h), W(_)));
	}), Tn(() => W(n), () => {
		L(r, aa(W(n)));
	}), Tn(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), En(), li();
	var ne = La(), D = un(ne), re = z(R(D), 2);
	zr(re, 5, () => u, (e) => e.value, (e, t) => {
		var n = Fa(), r = R(n, !0);
		j(n);
		var i = {};
		B(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), j(re), j(D);
	var ie = z(D, 2), ae = R(ie), oe = z(R(ae), 2);
	j(ae);
	var se = z(ae, 4), ce = z(R(se), 2), le = R(ce);
	le.value = le.__value = "light";
	var ue = z(le);
	ue.value = ue.__value = "dark", j(ce);
	var de;
	Yr(ce), j(se);
	var fe = z(se, 2);
	zr(fe, 7, () => Wi, (e) => e.key, (e, t, r) => {
		var i = Ia(), a = R(i), o = R(a, !0);
		j(a);
		var s = z(a, 2), c = R(s);
		ni(c);
		var l = z(c, 2);
		ni(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), ci(l, (e, t) => qt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), j(s), j(i), B(() => {
			X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), ri(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), ri(l, (W(g), W(t), G(() => W(g)[W(t).key])));
		}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
	}), j(fe);
	var pe = z(fe, 2);
	let me;
	var he = R(pe, !0);
	j(pe);
	var ge = z(pe, 2), _e = R(ge), ve = z(_e, 4), ye = z(ve, 2);
	j(ge), j(ie), ci(ie, (e) => L(f, e), () => W(f)), B(() => {
		de !== (de = W(h)) && (ce.value = (ce.__value = W(h)) ?? "", Jr(ce, W(h))), me = qr(pe, 1, "theme-dialog-status", null, me, { "theme-status-warning": W(r).length > 0 }), X(he, W(i));
	}), q("change", re, b), Xr(re, () => W(m), (e) => L(m, e)), xr("cancel", ie, ee), q("click", oe, E), q("change", ce, C), q("click", _e, () => y(Xi(W(h)))), q("click", ve, E), q("click", ye, te), Y(e, ne), Ue();
}
Sr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var za = /* @__PURE__ */ J("<p class=\"checklist-round\"> </p>"), Ba = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), Va = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), Ha = /* @__PURE__ */ J("<div class=\"checklist-filters\"><!> <!></div>"), Ua = /* @__PURE__ */ J("<small> </small>"), Wa = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), Ga = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), Ka = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), qa = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), Ja = /* @__PURE__ */ J("<section><div class=\"checklist-check-heading\"><!> <strong> </strong> <span class=\"checklist-owner\"> </span></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), Ya = /* @__PURE__ */ J("<article><header class=\"checklist-item-header\"><!> <div><h2> </h2> <p> </p> <!></div> <span class=\"checklist-status\"> </span></header> <div class=\"checklist-checks\"></div></article>"), Xa = /* @__PURE__ */ J("<!> <!> <!> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), Za = /* @__PURE__ */ J("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><p class=\"section-kicker\">Implementation Checklist</p> <h1> </h1> <!></div> <!></header> <!></main>");
function Qa(e, t) {
	He(t, !1);
	let n = $(t, "transport", 8, null), r = null, i = /* @__PURE__ */ I(null), a = /* @__PURE__ */ I(!0), o = /* @__PURE__ */ I(""), s = /* @__PURE__ */ I("正在載入 Checklist…"), c = (e) => ({
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	})[e] ?? e, l = /* @__PURE__ */ I({
		status: null,
		owner: null
	}), u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, d = {
		manual: "需人工驗證",
		agent: "Agent"
	};
	function f(e, t) {
		L(l, {
			...W(l),
			[e]: W(l)[e] === t ? null : t
		});
	}
	function p(e, t, n) {
		return n[e].map((e) => ({
			id: e.id,
			label: t[e.id] ?? e.id,
			count: e.count
		}));
	}
	function m(e) {
		let t = [
			{
				key: "total",
				label: "工作項目",
				value: e.items.total
			},
			{
				key: "passed",
				label: "已完成",
				value: e.items.passed,
				tone: "passed"
			},
			{
				key: "pending",
				label: "待處理",
				value: e.items.pending,
				tone: "pending"
			}
		];
		return e.items.failed > 0 && t.push({
			key: "failed",
			label: "失敗",
			value: e.items.failed,
			tone: "failed"
		}), t;
	}
	let h = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), g = (e) => e === "saving" ? "saving" : h.has(e) ? "error" : "clean", _ = /* @__PURE__ */ I(null), v = /* @__PURE__ */ I({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function y() {
		L(v, {
			mode: W(_).mode,
			custom: W(_).custom,
			systemScheme: W(_).systemScheme
		});
	}
	di(async () => {
		L(_, oa()), y();
		try {
			if (!n()) throw Error("Checklist 介面需要由 host 提供 transport。");
			r = Vi({
				session: Di(await n().load()),
				save: n().save,
				debounceCommand: (e) => e.type === "set-observed",
				onChange: (e) => {
					L(i, e), L(s, e.message);
				}
			}), L(i, r.snapshot()), L(s, W(i).message);
		} catch (e) {
			L(o, e instanceof Error ? e.message : "Checklist 載入失敗。"), L(s, W(o));
		} finally {
			L(a, !1);
		}
	});
	function b(e) {
		try {
			r.dispatch(e), L(i, r.snapshot()), L(s, W(i).message);
		} catch (e) {
			L(s, e.message);
		}
	}
	function x(e, t) {
		b({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function S() {
		r.undo(), L(i, r.snapshot());
	}
	function C() {
		r.redo(), L(i, r.snapshot());
	}
	function w() {
		L(i, r.discard());
	}
	async function T() {
		await r.save(), L(i, r.snapshot());
	}
	async function E(e) {
		L(i, await r.setCautious(e));
	}
	li();
	var ee = Za(), te = R(ee), ne = R(te), D = z(R(ne), 2), re = R(D, !0);
	j(D);
	var ie = z(D, 2), ae = (e) => {
		var t = za(), n = R(t, !0);
		j(t), B(() => X(n, (W(i), G(() => W(i).document.roundIdentity)))), Y(e, t);
	};
	Z(ie, (e) => {
		W(i) && e(ae);
	}), j(ne);
	var oe = z(ne, 2), se = (e) => {
		Ra(e, {
			get mode() {
				return W(v), G(() => W(v).mode);
			},
			get custom() {
				return W(v), G(() => W(v).custom);
			},
			get systemScheme() {
				return W(v), G(() => W(v).systemScheme);
			},
			onModeChange: (e) => {
				W(_).setMode(e), y();
			},
			onApplyCustom: (e) => {
				W(_).applyCustom(e), y();
			}
		});
	};
	Z(oe, (e) => {
		W(_) && e(se);
	}), j(te);
	var ce = z(te, 2), le = (e) => {
		var t = Ba(), n = R(t, !0);
		j(t), B(() => X(n, W(s))), Y(e, t);
	}, ue = (e) => {
		var t = Va(), n = R(t, !0);
		j(t), B(() => X(n, W(o))), Y(e, t);
	}, de = (e) => {
		var t = Xa(), n = un(t);
		{
			let e = /* @__PURE__ */ P(() => (W(i), G(() => m(W(i).summary)))), t = /* @__PURE__ */ P(() => (W(i), G(() => ({
				form: "segmented",
				cells: W(i).summary.cells
			})))), r = /* @__PURE__ */ P(() => (W(i), G(() => `${W(i).summary.checks.passed} / ${W(i).summary.checks.total} checks 通過`))), a = /* @__PURE__ */ P(() => (W(i), G(() => W(i).summary.checks.failed > 0 ? `${W(i).summary.checks.failed} 個失敗` : "")));
			Aa(n, {
				get stats() {
					return W(e);
				},
				get bar() {
					return W(t);
				},
				get caption() {
					return W(r);
				},
				get note() {
					return W(a);
				}
			});
		}
		var r = z(n, 2), a = (e) => {
			{
				let t = /* @__PURE__ */ P(() => (W(i), G(() => W(i).summary.nextStep.isManual ? "下一步 · 需人工驗證" : "下一步 · Agent"))), n = /* @__PURE__ */ P(() => (W(i), G(() => `${W(i).summary.nextStep.workItemId}. ${W(i).summary.nextStep.itemTitle} — ${W(i).summary.nextStep.title}`)));
				ba(e, {
					get heading() {
						return W(t);
					},
					get title() {
						return W(n);
					},
					get action() {
						return W(i), G(() => W(i).summary.nextStep.action);
					},
					get expect() {
						return W(i), G(() => W(i).summary.nextStep.expect);
					}
				});
			}
		};
		Z(r, (e) => {
			W(i), G(() => W(i).summary.nextStep) && e(a);
		});
		var o = z(r, 2), h = (e) => {
			let t = /* @__PURE__ */ P(() => (K(Ei), W(i), W(l), G(() => Ei(W(i).document, W(l)))));
			var n = Ha(), r = R(n);
			{
				let e = /* @__PURE__ */ P(() => (K(W(t)), G(() => p("status", u, W(t)))));
				ua(r, {
					get categories() {
						return W(e);
					},
					get activeId() {
						return W(l), G(() => W(l).status);
					},
					className: "status-filter-strip",
					ariaLabel: "依 check 狀態篩選",
					onSelect: (e) => f("status", e)
				});
			}
			var a = z(r, 2);
			{
				let e = /* @__PURE__ */ P(() => (K(W(t)), G(() => p("owner", d, W(t)))));
				ua(a, {
					get categories() {
						return W(e);
					},
					get activeId() {
						return W(l), G(() => W(l).owner);
					},
					className: "status-filter-strip",
					ariaLabel: "依負責對象篩選",
					onSelect: (e) => f("owner", e)
				});
			}
			j(n), Y(e, n);
		};
		Z(o, (e) => {
			W(i) && e(h);
		});
		var _ = z(o, 2);
		zr(_, 5, () => (K(Ti), W(i), W(l), G(() => Ti(W(i).document, W(l)).items)), (e) => e.id, (e, t) => {
			var n = Ya(), r = R(n), i = R(r);
			{
				let e = /* @__PURE__ */ P(() => (W(t), G(() => `工作項目 ${W(t).id}`)));
				pa(i, {
					get status() {
						return W(t), G(() => W(t).status);
					},
					get label() {
						return W(e);
					}
				});
			}
			var a = z(i, 2), o = R(a), s = R(o);
			j(o);
			var l = z(o, 2), u = R(l, !0);
			j(l);
			var d = z(l, 2), f = (e) => {
				var n = Ua(), r = R(n);
				j(n), B((e) => X(r, `Depends on: ${e ?? ""}`), [() => (W(t), G(() => W(t).dependsOn.join(", ")))]), Y(e, n);
			};
			Z(d, (e) => {
				W(t), G(() => W(t).dependsOn.length) && e(f);
			}), j(a);
			var p = z(a, 2), m = R(p, !0);
			j(p), j(r);
			var h = z(r, 2);
			zr(h, 5, () => (W(t), G(() => W(t).checks)), (e) => e.index, (e, n) => {
				var r = Ja(), i = R(r), a = R(i);
				pa(a, {
					get status() {
						return W(n), G(() => W(n).status);
					},
					get interactive() {
						return W(n), G(() => W(n).isManual);
					},
					get label() {
						return W(n), G(() => W(n).title);
					},
					onCycle: () => x(W(t).id, W(n))
				});
				var o = z(a, 2), s = R(o, !0);
				j(o);
				var c = z(o, 2), l = R(c, !0);
				j(c), j(i);
				var u = z(i, 2), d = R(u), f = z(R(d)), p = R(f, !0);
				j(f), j(d);
				var m = z(d, 2), h = z(R(m)), g = R(h, !0);
				j(h), j(m);
				var _ = z(m, 2), v = (e) => {
					var t = Wa(), r = z(R(t)), i = R(r, !0);
					j(r), j(t), B(() => X(i, (W(n), G(() => W(n).reason)))), Y(e, t);
				};
				Z(_, (e) => {
					W(n), G(() => W(n).reason) && e(v);
				});
				var y = z(_, 2), S = (e) => {
					var t = Ga(), r = z(R(t)), i = R(r, !0);
					j(r), j(t), B(() => X(i, (W(n), G(() => W(n).observed)))), Y(e, t);
				};
				Z(y, (e) => {
					W(n), G(() => W(n).observed && !(W(n).isManual && W(n).status === "failed")) && e(S);
				});
				var C = z(y, 2), w = (e) => {
					var t = Ka(), r = z(R(t)), i = R(r, !0);
					j(r), j(t), B(() => X(i, (W(n), G(() => W(n).resolved)))), Y(e, t);
				};
				Z(C, (e) => {
					W(n), G(() => W(n).resolved) && e(w);
				}), j(u);
				var T = z(u, 2), E = (e) => {
					var r = qa(), i = z(R(r), 2);
					rt(i), j(r), B(() => ri(i, (W(n), G(() => W(n).observed ?? "")))), q("input", i, (e) => b({
						type: "set-observed",
						workItemId: W(t).id,
						checkIndex: W(n).index,
						value: e.currentTarget.value
					})), Y(e, r);
				};
				Z(T, (e) => {
					W(n), G(() => W(n).isManual && W(n).status === "failed") && e(E);
				}), j(r), B(() => {
					qr(r, 1, (W(n), G(() => `checklist-check checklist-${W(n).status}`))), X(s, (W(n), G(() => W(n).title))), X(l, (W(n), G(() => W(n).isManual ? "需人工驗證" : "Agent"))), X(p, (W(n), G(() => W(n).action))), X(g, (W(n), G(() => W(n).expect)));
				}), Y(e, r);
			}), j(h), j(n), B((e) => {
				qr(n, 1, (W(t), G(() => `checklist-item checklist-${W(t).status}`))), X(s, `${W(t), G(() => W(t).id) ?? ""}. ${W(t), G(() => W(t).title) ?? ""}`), X(u, (W(t), G(() => W(t).outcome))), X(m, e);
			}, [() => (W(t), G(() => c(W(t).status)))]), Y(e, n);
		}), j(_);
		var v = z(_, 2);
		Pa(R(v), {
			get cautious() {
				return W(i), G(() => W(i).cautious);
			},
			onToggleCautious: E,
			get dirty() {
				return W(i), G(() => W(i).dirty);
			},
			get saving() {
				return W(i), G(() => W(i).saving);
			},
			get canUndo() {
				return W(i), G(() => W(i).history.canUndo);
			},
			get canRedo() {
				return W(i), G(() => W(i).history.canRedo);
			},
			get message() {
				return W(s);
			},
			onSave: T,
			onUndo: S,
			onRedo: C,
			onDiscard: w
		}), j(v), B((e) => {
			Q(v, "data-state", e), Q(v, "aria-busy", (W(i), G(() => W(i).saving)));
		}, [() => (W(i), G(() => g(W(i).status)))]), Y(e, t);
	};
	Z(ce, (e) => {
		W(a) ? e(le) : W(i) ? e(de, -1) : e(ue, 1);
	}), j(ee), B(() => X(re, (W(i), G(() => W(i)?.document.fileName ?? "TaskProgress Checklist")))), Y(e, ee), Ue();
}
Sr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var $a = 1, eo = /* @__PURE__ */ new Set(["load", "save"]);
function to(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== $a || typeof t.id != "string") return;
		let r = n.get(t.id);
		if (!r) return;
		if (n.delete(t.id), t.type === "result") {
			r.resolve(t.payload);
			return;
		}
		let i = Error(t.error?.message ?? "Checklist bridge request failed.");
		i.code = t.error?.code ?? "bridge_error", r.reject(i);
	});
	function r(r, i) {
		if (!eo.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: $a,
				id: a,
				type: r
			};
			i !== void 0 && (s.payload = i), e.postMessage(s);
		});
	}
	return Object.freeze({
		load: () => r("load"),
		save: (e) => r("save", e)
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-main.js
function no() {
	try {
		return to();
	} catch (e) {
		let t = () => Promise.reject(e);
		return {
			load: t,
			save: t
		};
	}
}
Ar(Qa, {
	target: document.querySelector("#app"),
	props: { transport: no() }
});
//#endregion
