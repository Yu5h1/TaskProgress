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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, T = 65536, te = 1 << 21, ne = 1 << 22, re = 1 << 23, E = Symbol("$state"), ie = Symbol("legacy props"), D = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function fe() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function pe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function me() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function he(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ge(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function _e() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function ve(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ye() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function be(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function xe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Se() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ce() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function we() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var Te = {}, O = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml";
function De() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Oe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ke() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ae() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function je(e) {
	k = e;
}
var A;
function Me(e) {
	if (e === null) throw Oe(), Te;
	return A = e;
}
function Ne() {
	return Me(/* @__PURE__ */ dn(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ dn(A) !== null) throw Oe(), Te;
		A = e;
	}
}
function Pe(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ dn(n);
		A = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = A;;) {
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
function Ie(e) {
	if (!e || e.nodeType !== 8) throw Oe(), Te;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Le(e) {
	return e === this.v;
}
function Re(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ze(e) {
	return !Re(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Be = !1;
function Ve() {
	Be = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var M = null;
function He(e) {
	M = e;
}
function Ue(e, t = !1, n) {
	M = {
		p: M,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: Be && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function We(e) {
	var t = M, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Cn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, M = t.p, e ?? {};
}
function Ge() {
	return !Be || M !== null && M.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], p(e);
}
function Je(e) {
	if (Ke.length === 0 && !kt) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
function Ye() {
	for (; Ke.length > 0;) qe();
}
function Xe(e) {
	var t = U;
	if (t === null) return H.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Ze(e, t);
}
function Ze(e, t) {
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
var Qe = ~(g | _ | h);
function N(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? N(e, h) : N(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= T, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), N(e, h);
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
	k && /* @__PURE__ */ un(e) !== null && pn(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = H, n = U;
	Jn(null), Yn(null);
	try {
		return e();
	} finally {
		Jn(t), Yn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = Kt(0), r;
	return () => {
		bn() && (W(n), kn(() => (t === 0 && (r = G(() => e(() => Zt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Zt(n));
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
	#h = lt(() => (this.#m = Kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = An(() => {
			if (k) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), k && (this.#e = A);
	}
	#g() {
		try {
			this.#a = jn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Je(r), t && (this.#s = jn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ae();
				return;
			}
			t = !0, n && we(), this.#s !== null && Rn(this.#s, () => {
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
					Ze(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = jn(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = ln();
			e.append(t), this.#a = this.#S(() => jn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Rn(this.#o, () => {
				this.#o = null;
			}), this.#x(F));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = jn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Hn(this.#a, e);
				let t = this.#n.pending;
				this.#o = jn(() => t(this.#e));
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
		var t = U, n = H, r = M;
		Yn(this.#i), Jn(this.#i), He(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Yn(t), Jn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Rn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Yt(this.#m, this.#l);
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
		this.#a &&= (Fn(this.#a), null), this.#o &&= (Fn(this.#o), null), this.#s &&= (Fn(this.#s), null), k && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return jn(() => {
						var r = U;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Ze(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Ze(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Ze(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function pt(e, t, n, r) {
	let i = Ge() ? _t : P;
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
				Ze(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ yt(e))).then(u).catch((e) => Ze(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ht();
	}) : f();
}
function mt() {
	var e = U, t = H, n = M, r = F;
	return function(i = !0) {
		Yn(e), Jn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Yn(null), Jn(null), He(null), e && F?.deactivate();
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
		ctx: M,
		deps: null,
		effects: null,
		equals: Le,
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
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = U;
	r === null && me();
	var i = void 0, a = Kt(O), o = !H, s = /* @__PURE__ */ new Set();
	return On(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
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
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= re, Yt(a, t)) : (a.f & 8388608 && (a.f ^= re), Yt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), xn(() => {
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
function P(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = ze, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Fn(t[n]);
	}
}
function xt(e) {
	var t, n = U, r = e.parent;
	if (!Gn && r !== null && e.v !== O && r.f & 24576) return De(), e.v;
	Yn(r);
	try {
		e.f &= ~T, bt(e), t = lr(e);
	} finally {
		Yn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = or(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		N(e, h);
		return;
	}
	Gn || (Dt === null ? $e(e) : (bn() || F?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), dr(t, 0), Nn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && fr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, F = null, Et = null, Dt = null, Ot = null, kt = !1, At = !1, jt = null, Mt = null, Nt = 0, Pt = 1, Ft = class e {
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
			for (var r of n.d) N(r, g), t(r);
			for (r of n.m) N(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Nt++ > 1e3 && (this.#x(), Lt());
		for (let e of this.#u) this.#d.delete(e), N(e, g), this.schedule(e);
		for (let e of this.#d) N(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = jt = [], r = [], i = Mt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ht(e), this.#h() || this.discard(), t;
		}
		if (F = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (jt = null, Mt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Vt(e, t);
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
		this.#r.clear(), Et = this, zt(r), zt(n), Et = null, this.#s?.resolve();
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
				a ? r.f ^= h : i & 4 ? t.push(r) : sr(r) && (i & 16 && this.#d.add(r), fr(r));
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
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== O && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Dt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, Dt = null;
	}
	flush() {
		try {
			At = !0, F = this, this.#g();
		} finally {
			Nt = 0, Ot = null, jt = null, Mt = null, At = !1, F = null, Dt = null, Wt.clear();
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
		this.#m || (this.#m = !0, Je(() => {
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
			!At && !kt && Je(() => {
				t.#e || t.flush();
			});
		}
		return F;
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
			if (jt !== null && t === U && (H === null || !(H.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Tt = e : t.#t = e, this.linked = !1;
		}
	}
};
function It(e) {
	var t = kt;
	kt = !0;
	try {
		var n;
		for (e && (F !== null && !F.is_fork && F.flush(), n = e());;) {
			if (Ye(), F === null) return n;
			F.flush();
		}
	} finally {
		kt = t;
	}
}
function Lt() {
	try {
		ye();
	} catch (e) {
		Ze(e, Ot);
	}
}
var Rt = null;
function zt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && sr(r) && (Rt = /* @__PURE__ */ new Set(), fr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Ln(r), Rt?.size > 0)) {
				Wt.clear();
				for (let e of Rt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Rt.has(n) && (Rt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || fr(n);
					}
				}
				Rt.clear();
			}
		}
		Rt = null;
	}
}
function Bt(e) {
	F.schedule(e);
}
function Vt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, h);
		for (var n = e.first; n !== null;) Vt(n, t), n = n.next;
	}
}
function Ht(e) {
	N(e, h);
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
		equals: Le,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function qt(e, t) {
	let n = Kt(e, t);
	return Zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = Kt(e);
	return t || (r.equals = ze), Be && n && M !== null && M.l !== null && (M.l.s ??= []).push(r), r;
}
function Jt(e, t) {
	return L(e, G(() => W(e))), t;
}
function L(e, t, n = !1) {
	return H !== null && (!qn || H.f & 131072) && Ge() && H.f & 4325394 && (Xn === null || !Xn.has(e)) && Ce(), Yt(e, n ? $t(t) : t, Mt);
}
function Yt(e, t, n = null) {
	if (!e.equals(t)) {
		Wt.set(e, Gn ? t : e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && $e(t);
		}
		e.wv = or(), Qt(e, g, n), Ge() && U !== null && U.f & 1024 && !(U.f & 96) && (er === null ? tr([e]) : er.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Xt();
	}
	return t;
}
function Xt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && N(e, _);
		let t;
		try {
			t = sr(e);
		} catch {
			t = !0;
		}
		t && fr(e);
	}
	Ut.clear();
}
function Zt(e) {
	L(e, e.v + 1);
}
function Qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & g) === 0;
			if (l && N(s, t), c & 131072) Ut.add(s);
			else if (c & 2) {
				var u = s;
				Dt?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= T), Qt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Rt !== null && Rt.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function $t(t) {
	if (typeof t != "object" || !t || E in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ qt(0), u = null, d = ir, f = (e) => {
		if (ir === d) return e();
		var t = H, n = ir;
		Jn(null), ar(d);
		var r = e();
		return Jn(t), ar(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ qt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ qt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ qt(O, u));
					r.set(t, e), Zt(o);
				}
			} else L(n, O), Zt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === E) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ qt($t(s ? e[n] : O), u)), r.set(n, o)), o !== void 0) {
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
			if (t === E) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== O || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ qt(i ? $t(e[t]) : O, u)), r.set(t, n)), W(n) === O) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ qt(O, u)), r.set(d + "", p)) : L(p, O);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ qt(void 0, u)), L(c, $t(n)), r.set(t, c));
			else {
				l = c.v !== O;
				var m = f(() => $t(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				Zt(o);
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
			Se();
		}
	});
}
function en(e) {
	try {
		if (typeof e == "object" && e && E in e) return e[E];
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
		on = a(t, "firstChild").get, sn = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
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
function R(e, t) {
	if (!k) return /* @__PURE__ */ un(e);
	var n = /* @__PURE__ */ un(A);
	if (n === null) n = A.appendChild(ln());
	else if (t && n.nodeType !== 3) {
		var r = ln();
		return n?.before(r), Me(r), r;
	}
	return t && gn(n), Me(n), n;
}
function fn(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ un(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ dn(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = ln();
			return A?.before(r), Me(r), r;
		}
		gn(A);
	}
	return A;
}
function z(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ dn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = ln();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		gn(r);
	}
	return Me(r), r;
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
	U === null && (H === null && ve(e), _e()), Gn && ge(e);
}
function vn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function yn(e, t) {
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
	if (e & 4) jt === null ? Ft.ensure().schedule(r) : jt.push(r);
	else if (t !== null) {
		try {
			fr(r);
		} catch (e) {
			throw Fn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && vn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function bn() {
	return H !== null && !qn;
}
function xn(e) {
	let t = yn(8, null);
	return N(t, h), t.teardown = e, t;
}
function Sn(e) {
	_n("$effect");
	var t = U.f;
	if (!H && t & 32 && M !== null && !M.i) {
		var n = M;
		(n.e ??= []).push(e);
	} else return Cn(e);
}
function Cn(e) {
	return yn(4 | w, e);
}
function wn(e) {
	return _n("$effect.pre"), yn(8 | w, e);
}
function Tn(e) {
	Ft.ensure();
	let t = yn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Rn(t, () => {
			Fn(t), n(void 0);
		}) : (Fn(t), n(void 0));
	});
}
function En(e) {
	return yn(4, e);
}
function B(e, t) {
	var n = M, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = kn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				Yn(n.parent), G(t);
			} finally {
				Yn(n);
			}
		}
	});
}
function Dn() {
	var e = M;
	kn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && N(n, _), sr(n) && fr(n), t.ran = !1;
		}
	});
}
function On(e) {
	return yn(ne | C, e);
}
function kn(e, t = 0) {
	return yn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		yn(8, () => {
			e(...t.map(W));
		});
	});
}
function An(e, t = 0) {
	return yn(16 | t, e);
}
function jn(e) {
	return yn(32 | C, e);
}
function Mn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Gn, n = H;
		Kn(!0), Jn(null);
		try {
			t.call(null);
		} finally {
			Kn(e), Jn(n);
		}
	}
}
function Nn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Fn(n, t), n = r;
	}
}
function Pn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Fn(t), t = n;
	}
}
function Fn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (In(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Nn(e, t && !n), dr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Mn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Ln(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function In(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ dn(e);
		e.remove(), e = n;
	}
}
function Ln(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Rn(e, t, n = !0) {
	var r = [];
	zn(e, r, !0);
	var i = () => {
		n && Fn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function zn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				zn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Bn(e) {
	Vn(e, !0);
}
function Vn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (N(e, g), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Vn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Hn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ dn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Un = null, Wn = !1, Gn = !1;
function Kn(e) {
	Gn = e;
}
var H = null, qn = !1;
function Jn(e) {
	H = e;
}
var U = null;
function Yn(e) {
	U = e;
}
var Xn = null;
function Zn(e) {
	H !== null && (Xn ??= /* @__PURE__ */ new Set()).add(e);
}
var Qn = null, $n = 0, er = null;
function tr(e) {
	er = e;
}
var nr = 1, rr = 0, ir = rr;
function ar(e) {
	ir = e;
}
function or() {
	return ++nr;
}
function sr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (sr(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && N(e, h);
	}
	return !1;
}
function cr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Xn !== null && Xn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? cr(a, t, !1) : t === a && (n ? N(a, g) : a.f & 1024 && N(a, _), Bt(a));
	}
}
function lr(e) {
	var t = Qn, n = $n, r = er, i = H, a = Xn, o = M, s = qn, c = ir, l = e.f;
	Qn = null, $n = 0, er = null, H = l & 96 ? null : e, Xn = null, He(e.ctx), qn = !1, ir = ++rr, e.ac !== null && (st(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = F?.is_fork;
		if (Qn !== null) {
			var m;
			if (p || dr(e, $n), f !== null && $n > 0) for (f.length = $n + Qn.length, m = 0; m < Qn.length; m++) f[$n + m] = Qn[m];
			else e.deps = f = Qn;
			if (bn() && e.f & 512) for (m = $n; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && $n < f.length && (dr(e, $n), f.length = $n);
		if (Ge() && er !== null && !qn && f !== null && !(e.f & 6146)) for (m = 0; m < er.length; m++) cr(er[m], e);
		if (i !== null && i !== e) {
			if (rr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = rr;
			if (t !== null) for (let e of t) e.rv = rr;
			er !== null && (r === null ? r = er : r.push(...er));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= te, Qn = t, $n = n, er = r, H = i, Xn = a, He(o), qn = s, ir = c;
	}
}
function ur(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Qn === null || !n.call(Qn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== O && $e(s), s.ac !== null && st(() => {
			s.ac.abort(ue), s.ac = null, N(s, g);
		}), Ct(s), dr(s, 0);
	}
}
function dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ur(e, n[r]);
}
function fr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, h);
		var n = U, r = Wn;
		U = e, Wn = !(t & 96);
		try {
			t & 16777232 ? Pn(e) : Nn(e), Mn(e);
			var i = lr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = nr;
		} finally {
			Wn = r, U = n;
		}
	}
}
async function pr() {
	await Promise.resolve(), It();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Un?.add(e), H !== null && !qn && !(U !== null && U.f & 16384) && (Xn === null || !Xn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < rr && (e.rv = rr, Qn === null && r !== null && r[$n] === e ? $n++ : Qn === null ? Qn = [e] : Qn.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Gn && Wt.has(e)) return Wt.get(e);
	if (t) {
		var a = e;
		if (Gn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || hr(a)) && (o = xt(a)), Wt.set(a, o), o;
		}
		var s = !(a.f & 512) && !qn && H !== null && (Wn || !!(H.f & 512)), c = (a.f & b) === 0;
		sr(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), mr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), mr(t));
}
function hr(e) {
	if (e.v === O) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && hr(t)) return !0;
	return !1;
}
function G(e) {
	var t = qn;
	try {
		return qn = !0, e();
	} finally {
		qn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (E in e) gr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && E in n && gr(n);
		}
	}
}
function gr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			gr(e[n], t);
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
var _r = ["touchstart", "touchmove"];
function vr(e) {
	return _r.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var yr = Symbol("events"), br = /* @__PURE__ */ new Set(), xr = /* @__PURE__ */ new Set();
function Sr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Er.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Cr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Sr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && xn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[yr] ??= {})[e] = n;
}
function wr(e) {
	for (var t = 0; t < e.length; t++) br.add(e[t]);
	for (var n of xr) n(e);
}
var Tr = null;
function Er(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Tr = e;
	var s = 0, c = Tr === e && e[yr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[yr] = t;
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
		Jn(null), Yn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[yr]?.[r];
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
			e[yr] = t, delete e.currentTarget, Jn(d), Yn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Dr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Or(e) {
	return Dr?.createHTML(e) ?? e;
}
function kr(e) {
	var t = hn("template");
	return t.innerHTML = Or(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Ar(e, t) {
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
		if (k) return Ar(A, null), A;
		i === void 0 && (i = kr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ un(i)));
		var t = r || an ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ un(t), s = t.lastChild;
			Ar(o, s);
		} else Ar(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function jr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (k) return Ar(A, null), A;
		if (!o) {
			var e = /* @__PURE__ */ un(kr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ un(e);) o.appendChild(/* @__PURE__ */ un(e));
			else o = /* @__PURE__ */ un(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ un(t), r = t.lastChild;
			Ar(n, r);
		} else Ar(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Mr(e, t) {
	return /* @__PURE__ */ jr(e, t, "svg");
}
function Nr(e = "") {
	if (!k) {
		var t = ln(e + "");
		return Ar(t, t), t;
	}
	var n = A;
	return n.nodeType === 3 ? gn(n) : (n.before(n = ln()), Me(n)), Ar(n, n), n;
}
function Pr() {
	if (k) return Ar(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = ln();
	return e.append(t, n), Ar(t, n), e;
}
function Y(e, t) {
	if (k) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = A), Ne();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	cn();
	var l = void 0, u = Tn(() => {
		var s = n ?? t.appendChild(ln());
		dt(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = M;
			if (o && (n.c = o), a && (i.$$events = a), k && Ar(t, null), l = e(t, i) || {}, k && (U.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw Oe(), Te;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = vr(r);
					for (let e of [t, document]) {
						var a = Ir.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ir.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Er, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(br)), xr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ir.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Er), r.delete(e), r.size === 0 && Ir.delete(n)) : r.set(e, i);
			}
			xr.delete(d), s !== n && s.parentNode?.removeChild(s);
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
			if (n) Bn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Bn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Fn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Hn(r, t), t.append(ln()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Fn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Rn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Fn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = F, r = mn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = ln();
			i.append(a), this.#n.set(e, {
				effect: jn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, jn(() => t(this.anchor)));
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
	k && (r = A, Ne());
	var i = new zr(e), a = n ? S : 0;
	function o(e, t) {
		if (k) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, je(!1), i.ensure(e, t), je(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	An(() => {
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
		Rn(n, () => {
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
			pn(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= ee, Hn(a, document.createDocumentFragment())) : Fn(t[i], n);
	}
}
var Ur;
function Wr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = k ? Me(/* @__PURE__ */ un(u)) : u.appendChild(ln());
	}
	k && Ne();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Kr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Jr(d, null, c)) : Bn(d) : Rn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: An(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			k && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = mn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (c = A, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && u.unskip_effect(S.e)) : (S = qr(l, h ? c : Ur ??= ln(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = jn(() => s(c)) : (d = jn(() => s(Ur ??= ln())), d.f |= ee)), e > r.size && he("", "", ""), k && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && je(!0), W(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, k && (c = A);
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
		if (_.f & 8192 && (Bn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Jr(_, null, n);
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
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Vr(e, w, te);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: jn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Jr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ dn(r);
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
	k && Ne();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Zr(e, t, n) {
	En(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			kn(() => {
				var e = n();
				K(e), i && Re(a, e) && (a = e, r.update(e));
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
	var o = e[oe];
	if (k || o !== n || o === void 0) {
		var s = ni(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
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
	var i = e[se];
	if (k || i !== t) {
		var a = ai(t, r);
		(!k || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[se] = t;
	} else r && (Array.isArray(r) ? (si(e, n?.[0], r[0]), si(e, n?.[1], r[1], "important")) : si(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(fi(i));
		return;
	}
	for (i of t.options) if (tn(fi(i), n)) {
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
	}), xn(() => {
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
	}), En(() => {
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
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = de ? "link" : "LINK", gi = de ? "progress" : "PROGRESS";
function _i(e) {
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
		e[le] = n, Je(n), ot();
	}
}
function vi(e, t) {
	var n = yi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === gi) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = yi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[D] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[ae] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === Ee
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
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function Si(e, t, n) {
	var r = a(e, t);
	r && r.set && (e[t] = n, xn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ci(e, t) {
	return e === t || e?.[E] === t;
}
function wi(e = {}, t, n, r) {
	var i = M.r, a = U;
	return En(() => {
		var o, s;
		return kn(() => {
			o = s, s = r?.() || [], G(() => {
				Ci(n(...s), e) || (t(e, ...s), o && Ci(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ci(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ti(e = !1) {
	let t = M, n = t.l.u;
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
	n.b.length && wn(() => {
		Ei(t, r), p(n.b);
	}), Sn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Sn(() => {
		Ei(t, r), p(n.a);
	});
}
function Ei(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = E in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
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
			let n = t ? W(y) : i && o ? $t(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Gn && v || b.f & 16384 ? y.v : W(y);
	});
}
function Di(e) {
	M === null && pe("onMount"), Be && M.l !== null ? ki(M).m.push(e) : Sn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function Oi(e) {
	M === null && pe("onDestroy"), Di(() => () => G(e));
}
function ki(e) {
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
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ve();
//#endregion
//#region viewer/assets/card-disclosure-state.js
function Ai(e, t) {
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
function ji(e, t, n, r) {
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
var { createEditorTransaction: Mi } = globalThis.TaskProgressEditorTransactionRuntime, Ni = "__default__";
function Pi(e) {
	return [...new Set(e)];
}
function Fi(e = []) {
	let t = Pi(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Ii(e, t, n, r = t) {
	let i = Fi(t), a = Object.freeze({
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
function Li(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function Ri(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function zi(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Bi(e) {
	let t = Ri(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
function Vi(e = []) {
	let t = e.indexOf(Ni);
	return t === -1 ? [...e] : e.slice(0, t);
}
//#endregion
//#region viewer/assets/capsule-order.js
function Hi(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Ui(e, t, n) {
	if (!e) return Hi(null, n);
	try {
		return Hi(JSON.parse(e.getItem(t) ?? "null"), n);
	} catch {
		return Hi(null, n);
	}
}
function Wi(e, t, n) {
	if (!e) return !1;
	try {
		return e.setItem(t, JSON.stringify(n)), !0;
	} catch {
		return !1;
	}
}
function Gi(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/status-order.js
function Ki(e, t, n = (e) => e.status) {
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
function qi(e, t, n = (e) => e.status, r = (e) => e) {
	if (t.length === 0) return r([...e]);
	let i = [], a = [];
	for (let r of e) (t.includes(n(r)) ? i : a).push(r);
	return [...Ki(r(i), t, n), ...r(a)];
}
//#endregion
//#region viewer/assets/checklist-editor.js
function Ji(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function Yi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function Xi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = Yi(e), e.progress = {
			passed: e.checks.filter((e) => e.status === "passed").length,
			total: e.checks.length
		};
	}), t;
}
function Zi(e, t) {
	return (e.dependsOn ?? []).some((e) => Yi(t.get(e) ?? { checks: [] }) !== "passed");
}
function Qi(e) {
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
		a[Yi(e)] += 1;
		let t = Zi(e, n);
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
var $i = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function ea(e, t) {
	let { item: n, check: r } = Ji(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? $i[r.status] ?? "pending" : t.status;
		if (![
			"pending",
			"passed",
			"failed"
		].includes(e)) throw Error("不支援的實機檢查狀態。");
		r.status = e, e !== "failed" && (r.observed = null, r.resolved = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = Yi(n), e;
}
function ta(e) {
	let t = Xi(e);
	return delete t.revision, t;
}
var na = Object.freeze({ status: Object.freeze([
	"pending",
	"passed",
	"failed"
]) });
function ra(e, t) {
	let n = new Set(t ?? []);
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => n.has(e.status))
		})).filter((e) => e.checks.length > 0)
	};
}
function ia(e, t = []) {
	let n = Vi(t).filter((e) => na.status.includes(e));
	return n.length === 0 ? e : {
		...e,
		items: qi(e.items, n, Yi)
	};
}
function aa(e) {
	let t = e.items.flatMap((e) => e.checks);
	return na.status.map((e) => ({
		id: e,
		count: t.filter((t) => t.status === e).length
	}));
}
function oa(e, t = {}) {
	let n = structuredClone(e), r = Mi(e, {
		normalize: ta,
		derive: Xi,
		historyLimit: t.historyLimit
	});
	function i() {
		let e = structuredClone(r.derived);
		return e.revision = n.revision, Object.freeze({
			document: e,
			summary: Qi(e),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, ea, t), i();
	}
	function o() {
		let e = [], t = [];
		return r.derived.items.forEach((r) => r.checks.forEach((i) => {
			if (!i.isManual) return;
			let a = String(i.observed ?? "").trim(), o = Ji(n, r.id, i.index).check, s = String(o.observed ?? "").trim();
			if (i.status !== o.status || a !== s) {
				if (i.status === "failed" && !a) {
					t.push({
						code: "observed_required",
						workItemId: r.id,
						checkIndex: i.index,
						message: `「${i.title}」失敗時必須填寫 Observed。`
					});
					return;
				}
				e.push({
					workItemId: r.id,
					checkIndex: i.index,
					status: i.status,
					observed: i.status === "failed" ? a : null
				});
			}
		})), r.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的實機檢查結果。"
		}), Object.freeze({
			revision: n.revision,
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
			let t = structuredClone(e);
			return r.commit(t, { keepHistory: !0 }), n = t, i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var sa = "task-progress.cautious-mode.v1", ca = "自動儲存模式。", la = "謹慎模式：修改後需按儲存。", ua = "有尚未儲存的變更。", da = "即將自動儲存…", fa = "正在寫入…", pa = "已儲存。", ma = "已放棄尚未儲存的變更。", ha = "沒有需要儲存的變更。", ga = "儲存失敗。", _a = "已取消儲存；草稿仍保留。", va = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function ya(e = globalThis.localStorage) {
	try {
		return e?.getItem(sa) === "true";
	} catch {
		return !1;
	}
}
function ba(e, t) {
	let n = t === !0;
	try {
		e?.setItem(sa, n ? "true" : "false");
	} catch {}
	return n;
}
function xa({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, confirmSave: a = null, timers: o = globalThis, onChange: s = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let c = ya(n), l = "idle", u = c ? la : ca, d = !1, f = null, p = Promise.resolve(), m = 0, h = () => e.snapshot();
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
			n && (v("idle", ha), _());
			return;
		}
		let r = e.prepareSave(), i = Array.isArray(r.errors) ? r.errors : [];
		if (i.length) {
			v("incomplete", i[0].message), _();
			return;
		}
		let { errors: o, ...s } = r;
		if (typeof a == "function" && await a(s, { manual: n }) === !1) {
			v("cancelled", _a), _();
			return;
		}
		d = !1, v("saving", fa), _();
		try {
			let n = await t(s);
			e.commit(n), v("saved", pa);
		} catch (e) {
			d = !0, v(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? ga);
		}
		_();
	}
	function x(e = !1) {
		return y(), m += 1, p = p.then(() => b(e)).catch((e) => {
			d = !0, v("error", e?.message ?? ga), _();
		}).finally(() => {
			--m, _();
		}), p;
	}
	async function S() {
		for (let e = 0; e < 8; e += 1) if (f !== null && x(), await p, f === null && m === 0) return;
	}
	function C(e) {
		return c ? (d || v("draft", ua), null) : d ? null : e ? (y(), v("pending", da), f = o.setTimeout(() => {
			f = null, x();
		}, r), null) : x();
	}
	function w(e) {
		let t = C(e);
		return _(), t;
	}
	async function ee(e) {
		let t = e === !0;
		if (t === c) return g();
		if (t) await S(), c = !0;
		else {
			if (h().dirty) return v("mode_blocked", va), _(), g();
			c = !1;
		}
		return ba(n, c), d || v("idle", c ? la : ca), _(), g();
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
			return y(), e.discard(), d = !1, v("idle", ma), _(), g();
		},
		save() {
			return x(!0);
		},
		flush: S,
		setCautious: ee
	});
}
//#endregion
//#region viewer/assets/checklist-filter-order.js
var Sa = "task-progress.checklist-filter-order.v1";
function Ca({ supportedIds: e, storage: t = globalThis.localStorage ?? null } = {}) {
	let n = Ui(t, Sa, e);
	return {
		get order() {
			return n;
		},
		move(e, r, i = !1) {
			let a = Gi(n, e, r, i);
			return a.join("\0") === n.join("\0") ? n : (n = a, Wi(t, Sa, n), n);
		}
	};
}
//#endregion
//#region viewer/assets/theme-model.js
var wa = "task-progress.theme.v1", Ta = [
	"system",
	"light",
	"dark",
	"custom"
], Ea = [
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
], Da = Object.freeze({
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
}), Oa = Object.freeze({
	version: 1,
	mode: "system"
}), ka = /^#[0-9a-f]{6}$/i;
function Aa(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ja(e) {
	return typeof e == "string" && ka.test(e);
}
function Ma(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Da[n], i = { base: n };
	for (let e of Ea) {
		let n = t[e.key];
		i[e.key] = ja(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Na(e) {
	if (!Aa(e) || e.version !== 1 || !Ta.includes(e.mode)) return { ...Oa };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Aa(e.custom) ? t.custom = Ma(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Ma()), t;
}
function Pa(e) {
	try {
		let t = e?.getItem(wa);
		return t ? Na(JSON.parse(t)) : { ...Oa };
	} catch {
		return { ...Oa };
	}
}
function Fa(e, t) {
	let n = Na(t);
	try {
		e?.setItem(wa, JSON.stringify(n));
	} catch {}
	return n;
}
function Ia(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function La(e, t) {
	let n = Na(t);
	e.dataset.theme = n.mode;
	for (let t of Ea) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Ma();
		e.dataset.themeBase = t.base;
		for (let n of Ea) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Ra(e, t, n = "light") {
	let r = Na(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Ma(n)), Na(i);
}
function za(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Ba(e, t) {
	if (!ja(e) || !ja(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => za(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Va(e) {
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
	].filter(([, e, t]) => Ba(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function Ha({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Pa(t);
	e && La(e, r);
	function i(n) {
		return r = Fa(t, n), e && La(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ia(n);
		},
		setMode(e) {
			return i(Ra(r, e, Ia(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Ma(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var Ua = /* @__PURE__ */ Mr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), Wa = /* @__PURE__ */ Mr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), Ga = /* @__PURE__ */ Mr("<path d=\"M3 3l18 18\"></path>"), Ka = /* @__PURE__ */ Mr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function qa(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = Ka(), a = R(i), o = (e) => {
		Y(e, Ua());
	}, s = (e) => {
		var t = Wa();
		Pe(), Y(e, t);
	};
	Z(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		Y(e, Ga());
	};
	Z(c, (e) => {
		r() && e(l);
	}), j(i), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var Ja = /* @__PURE__ */ J("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), Ya = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function Xa(e, t) {
	Ue(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Ti();
	var l = Ya(), u = fn(l);
	let d;
	var f = R(u), p = R(f), m = R(p, !0);
	j(p), j(f);
	var h = z(f, 2), g = (e) => {
		var t = Ja(), n = R(t);
		{
			let e = /* @__PURE__ */ P(() => !r());
			qa(n, { get closed() {
				return W(e);
			} });
		}
		j(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), q("click", t, () => i()(!r())), Y(e, t);
	};
	Z(h, (e) => {
		n() && e(g);
	}), Xr(z(h, 2), t, "header", {}, null), j(u);
	var _ = z(u, 2);
	Xr(R(_), t, "default", {}, null), j(_), V(() => {
		d = oi(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), X(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), q("click", f, () => c()(!a())), Y(e, l), We();
}
wr(["click"]);
//#endregion
//#region viewer/assets/icon-choice.js
function Za(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function Qa(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var $a = /* @__PURE__ */ J("<button type=\"button\" tabindex=\"-1\"><!></button>"), eo = /* @__PURE__ */ J("<div role=\"group\"></div>"), to = /* @__PURE__ */ J("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function no(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1), _ = /* @__PURE__ */ I(!1), v = /* @__PURE__ */ I(null), y = /* @__PURE__ */ I(0), b = /* @__PURE__ */ I(0), x = /* @__PURE__ */ I(!1), S = /* @__PURE__ */ I(null), C = 0;
	function w(e = !1) {
		clearTimeout(W(m)), C++, W(S) !== null && W(f)?.hasPointerCapture(W(S)) && W(f).releasePointerCapture(W(S)), L(S, null), L(h, !1), L(g, !1), L(v, null), L(x, !1), e && W(f)?.focus();
	}
	function ee(e) {
		w(!0), u()(e);
	}
	async function T(e = !1) {
		if (!W(r).length) return;
		L(h, !0), L(x, !1);
		let t = ++C;
		if (await pr(), !W(h) || t !== C || !W(p)) return;
		let n = W(f).getBoundingClientRect(), i = W(p).getBoundingClientRect(), o = [...W(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (L(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), L(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (L(y, n.right + 4), W(y) + i.width > window.innerWidth - 4 && L(y, n.left - i.width - 4), L(b, n.top + (n.height - i.height) / 2)) : (L(y, n.left + (n.width - i.width) / 2), L(b, n.bottom + 4), W(b) + i.height > window.innerHeight - 4 && L(b, n.top - i.height - 4)), L(y, Math.max(4, Math.min(W(y), window.innerWidth - i.width - 4))), L(b, Math.max(4, Math.min(W(b), window.innerHeight - i.height - 4))), L(x, !0), await pr(), e && W(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && W(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ne(e) {
		if (clearTimeout(W(m)), W(S) !== null) {
			if (W(g)) {
				let t = te(e);
				L(_, !0), t === null ? w(!0) : ee(W(r).find((e) => String(e.id) === t).id);
			} else {
				let t = W(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (L(_, !0), w(!0));
			}
			L(S, null);
		}
	}
	function re(e) {
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
			T(!0);
			return;
		}
		let n = [...W(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function E() {
		W(S) !== null && L(_, !0), w(W(d)?.contains(document.activeElement));
	}
	Oi(() => clearTimeout(W(m))), B(() => (K(i()), K(a())), () => {
		L(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (K(i()), K(a()), K(l())), () => {
		L(r, Qa(i(), a(), l()));
	}), Dn(), Ti();
	var ie = to();
	Cr("pointerdown", nn, (e) => {
		W(d)?.contains(e.target) || w();
	}), Cr("resize", nn, E), Cr("blur", nn, E), Cr("scroll", rn, (e) => {
		W(p)?.contains(e.target) || E();
	}, !0);
	var D = R(ie);
	let ae;
	Xr(R(D), t, "icon", { get item() {
		return W(n);
	} }, null), j(D), wi(D, (e) => L(f, e), () => W(f));
	var oe = z(D, 2), se = (e) => {
		var n = eo();
		let i, s;
		Wr(n, 5, () => W(r), (e) => e.id, (e, n) => {
			var r = $a();
			let i;
			Xr(R(r), t, "icon", { get item() {
				return W(n);
			} }, null), j(r), V((e) => {
				i = oi(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (W(n), G(() => W(n).id))), Q(r, "aria-label", (W(n), G(() => W(n).label))), Q(r, "title", (W(n), G(() => W(n).label))), Q(r, "aria-pressed", (W(n), K(a()), G(() => W(n).kind === "action" ? void 0 : W(n).id === a())));
			}, [() => ({ "icon-choice-hover": W(v) === String(W(n).id) })]), q("keydown", r, re), q("click", r, () => ee(W(n).id)), Y(e, r);
		}), j(n), wi(n, (e) => L(p, e), () => W(p)), V(() => {
			i = oi(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = ci(n, "", s, {
				left: `${W(y)}px`,
				top: `${W(b)}px`,
				visibility: W(x) ? "visible" : "hidden"
			});
		}), Y(e, n);
	};
	Z(oe, (e) => {
		W(h) && e(se);
	}), j(ie), wi(ie, (e) => L(d, e), () => W(d)), V(() => {
		Q(ie, "aria-label", o()), Q(D, "aria-label", (K(o()), W(n), G(() => `${o()}：${W(n)?.label ?? ""}`))), Q(D, "aria-expanded", s() === "cycle" ? void 0 : W(h)), Q(D, "title", (K(o()), W(n), K(s()), G(() => `${o()}：${W(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), D.disabled = !W(n), ae = ci(D, "", ae, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), q("focusout", ie, (e) => {
		W(d).contains(e.relatedTarget) || w();
	}), q("keydown", D, re), q("pointerdown", D, (e) => {
		e.button === 0 && (L(_, !1), !(s() === "cycle" || W(h)) && (L(S, e.pointerId), W(f).setPointerCapture(W(S)), clearTimeout(W(m)), L(m, setTimeout(() => {
			L(g, !0), T();
		}, 300))));
	}), q("pointermove", D, (e) => {
		W(g) && L(v, te(e));
	}), q("pointerup", D, ne), Cr("pointercancel", D, E), q("click", D, () => {
		if (W(_)) {
			L(_, !1);
			return;
		}
		if (W(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") T(!0);
		else {
			let e = Za(i(), a());
			e !== void 0 && u()(e);
		}
	}), Y(e, ie), We();
}
wr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var ro = /* @__PURE__ */ Mr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function io(e, t) {
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
	no(e, {
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
			var r = Pr(), i = fn(r), a = (e) => {
				Y(e, ro());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "closed"))), r = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "disabled")));
					qa(e, {
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
function ao(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function oo(e, t, n) {
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
function so(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function co(e, t, n, r = []) {
	let i = n === "free" ? lo(e, t) : n === "reverse" ? [...e].reverse() : e;
	if (!r.length) return i;
	let a = new Map(e.map((e) => [e.id, e])), o = new Set(r);
	return [...o].filter((e) => a.has(e)).map((e) => a.get(e)).concat(i.filter((e) => !o.has(e.id)));
}
function lo(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function uo(e, t, n, r, i, a) {
	let o = Hi(t, e), s = new Set(n), c = Gi(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var fo = /* @__PURE__ */ Mr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), po = /* @__PURE__ */ Mr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), mo = /* @__PURE__ */ Mr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), ho = /* @__PURE__ */ J("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), go = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), _o = /* @__PURE__ */ J("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function vo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null);
	function f(e = o()) {
		return co(e, W(T), W(_), l() ? W(p) : []).map((e) => e.id);
	}
	let p = /* @__PURE__ */ I([]), m = null, h = $(t, "expanded", 8, !0), g = $(t, "onToggleAll", 8, () => {}), _ = /* @__PURE__ */ I("forward"), v = [
		"forward",
		"reverse",
		"free"
	], y = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, b = /* @__PURE__ */ I("disabled"), x = /* @__PURE__ */ I([]);
	function S() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: W(b),
				hiddenIds: W(x)
			}));
		} catch {}
	}
	function C(e) {
		let t = oo(W(b), W(x), e);
		L(b, t.mode), L(x, t.hiddenIds), pe(), S();
	}
	function w(e, t) {
		L(x, t ? W(x).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...W(x), e])]), pe(), S();
	}
	function ee(e) {
		W(b) === "closed" && L(b, "enabled"), w(e, !0);
	}
	let T = /* @__PURE__ */ I(null), te = /* @__PURE__ */ I(null), ne = /* @__PURE__ */ I(null), re = /* @__PURE__ */ I(null), E = /* @__PURE__ */ I(null), ie = /* @__PURE__ */ I(), D = /* @__PURE__ */ I("");
	function ae(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (m !== i) {
			if (m = i, !n.includes(e)) {
				L(D, `找不到卡片 ID：${e}`);
				return;
			}
			L(p, so(W(p), e)), ee(e), oe();
		}
	}
	function oe() {
		if (!c()) {
			L(D, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(W(p))), L(D, "已記住本機釘選");
		} catch {
			L(D, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function se(e) {
		pe(), L(p, W(p).includes(e) ? W(p).filter((t) => t !== e) : so(W(p), e)), oe();
	}
	function ce(e) {
		if (m = null, L(p, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			L(p, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (L(b, "disabled"), L(x, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			L(b, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), L(x, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (L(te, null), L(ne, null), L(re, null), L(E, null), !e) {
			L(T, null), L(_, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			L(T, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			L(_, v.includes(n) ? n : W(T) ? "free" : "forward");
		} catch {
			L(T, null), L(_, "forward");
		}
	}
	function le(e) {
		if (L(T, e), !c()) {
			L(D, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), L(D, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			L(D, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function ue(e) {
		if (pe(), L(_, e), L(D, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, W(_));
		} catch {
			L(D, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function de(e, t, n) {
		W(_) === "free" && (l() && (W(p).includes(e) || W(p).includes(t)) || e !== t && (le(uo(s(), W(T), W(r).map((e) => e.id), e, t, n)), L(te, e), await pr(), [...W(ie).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function fe(e, t) {
		let n = W(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = W(r)[n + t];
		i && de(e, i.id, t > 0);
	}
	function pe() {
		L(ne, null), L(re, null), L(E, null);
	}
	function me(e, t) {
		if (l() && W(p).includes(e.id) || W(re) === null || W(re) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		L(E, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => W(b), () => {
		L(n, W(b) === "enabled");
	}), B(() => (K(o()), W(T), W(_), K(l()), W(p), K(d())), () => {
		L(i, lo(co(o(), W(T), W(_), l() ? W(p) : []), d()));
	}), B(() => (W(i), W(b), W(x), K(l()), W(p)), () => {
		L(r, W(i).filter((e) => ao(e.id, W(b), W(x)) && !(l() && W(p).includes(e.id))));
	}), B(() => K(c()), () => {
		ce(c());
	}), B(() => (W(i), W(b), W(x)), () => {
		L(a, W(i).find((e) => ao(e.id, W(b), W(x)))?.id ?? null);
	}), B(() => (K(u()), K(c()), K(s()), K(l())), () => {
		ae(u(), c(), s(), l());
	}), Dn();
	var he = {
		orderedIds: f,
		revealCard: ee
	};
	Ti();
	var ge = _o(), _e = fn(ge), ve = R(_e);
	Xr(z(R(ve), 2), t, "filters", {}, null), j(ve);
	var ye = z(ve, 2), be = R(ye), xe = R(be), Se = R(xe);
	j(xe), j(be);
	var Ce = z(be, 2);
	{
		let e = /* @__PURE__ */ P(() => G(() => v.map((e) => ({
			id: e,
			label: y[e]
		}))));
		no(Ce, {
			get items() {
				return W(e);
			},
			get value() {
				return W(_);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: ue,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ P(() => t.item);
				var r = mo(), i = R(r), a = (e) => {
					Y(e, fo());
				}, o = (e) => {
					var t = po(), r = fn(t), i = z(r);
					V(() => {
						Q(r, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), Y(e, t);
				};
				Z(i, (e) => {
					K(W(n)), G(() => W(n).id === "free") ? e(a) : e(o, -1);
				}), j(r), Y(e, r);
			} }
		});
	}
	var we = z(Ce, 2);
	io(we, {
		get mode() {
			return W(b);
		},
		onChoose: C
	});
	var Te = z(we, 2), O = R(Te, !0);
	j(Te), Xr(z(Te, 2), t, "tools", {}, null), j(ye), j(_e);
	var Ee = z(_e, 2);
	return Wr(Ee, 5, () => W(i), (e) => e.id, (e, r) => {
		var i = go();
		let o;
		var s = R(i), c = (e) => {
			var t = ho();
			let n;
			var i = R(t), a = R(i);
			j(i), j(t), V((e, r, i, o, s) => {
				n = oi(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({ "is-pinned": W(p).includes(W(r).id) }),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? `取消釘選：${W(r).title}` : `釘選置頂：${W(r).title}`)),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id))),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? "取消釘選" : "釘選置頂")),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? "currentColor" : "none"))
			]), q("click", t, () => se(W(r).id)), Y(e, t);
		};
		Z(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(x), W(r), G(() => !W(x).includes(W(r).id))));
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
				onVisibleChange: (e) => w(W(r).id, e)
			}, null);
		}
		j(i), V((e) => {
			Q(i, "hidden", e), o = oi(i, 1, "arrangeable-card", null, o, {
				"card-selected": W(te) === W(r).id,
				"card-drop-before": W(E)?.id === W(r).id && !W(E).after,
				"card-drop-after": W(E)?.id === W(r).id && W(E).after
			}), Q(i, "aria-label", (W(r), W(te), G(() => `${W(r).title}${W(te) === W(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (W(r), G(() => W(r).id))), Q(i, "draggable", (W(_), W(ne), W(r), G(() => W(_) === "free" && W(ne) === W(r).id)));
		}, [() => (K(ao), W(r), W(b), W(x), G(() => !ao(W(r).id, W(b), W(x))))]), q("pointerdown", i, (e) => {
			L(ne, null), e.button === 0 && (L(te, W(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (W(_) !== "free" || e.pointerType !== "mouse" || l() && W(p).includes(W(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || L(ne, W(r).id)));
		}), q("focusin", i, () => {
			L(te, W(r).id);
		}), q("input", i, () => {
			L(te, W(r).id);
		}), q("pointerup", i, () => {
			L(ne, null);
		}), q("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), L(te, W(r).id)) : e.key === "Escape" && L(te, null), W(_) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), fe(W(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Cr("dragstart", i, (e) => {
			W(_) === "free" && W(ne) === W(r).id && e.target === e.currentTarget && (L(re, W(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(r).id)));
		}), Cr("dragend", i, pe), Cr("dragover", i, (e) => me(W(r), e)), Cr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(E, null);
		}), Cr("drop", i, (e) => {
			W(re) !== null && W(E)?.id === W(r).id && (e.preventDefault(), de(W(re), W(r).id, W(E).after), pe());
		}), Y(e, i);
	}), j(Ee), wi(Ee, (e) => L(ie, e), () => W(ie)), V(() => {
		Q(be, "aria-label", h() ? "全部收合" : "全部展開"), Q(be, "title", h() ? "全部收合" : "全部展開"), Q(Se, "d", h() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), X(O, W(D));
	}), q("click", be, () => g()(!h())), Y(e, ge), Si(t, "orderedIds", f), Si(t, "revealCard", ee), We(he);
}
wr([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region viewer/assets/focus-shield.js
function yo({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, now: n = () => Date.now(), activationWindowMs: r = 100, storage: i, key: a = `taskprogress.mouse-activation.v2:${e.location?.pathname ?? ""}` } = {}) {
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
function bo(e, t) {
	Ue(t, !1), Di(() => yo()), Ti(), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var xo = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function So(e, t) {
	Ue(t, !1);
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
	Ti();
	var _ = Pr(), v = fn(_), y = (e) => {
		var n = xo(), l = R(n), d = R(l), f = R(d), _ = R(f, !0);
		j(f);
		var v = z(f, 2), y = R(v, !0);
		j(v), j(d);
		var b = z(d, 2);
		j(l), Xr(z(l, 2), t, "default", { close: h }, null), j(n), wi(n, (e) => L(u, e), () => W(u)), Zr(n, (e) => p?.(e)), V(() => {
			oi(n, 1, ei(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), Cr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), We();
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Co = /* @__PURE__ */ J("<span></span>"), wo = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), To = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), Eo = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function Do(e, t) {
	Ue(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await pr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function ee(e, t) {
		if (!W(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = W(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function T() {
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
	function re(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	B(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), Dn(), Ti();
	var E = Eo();
	Wr(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = To(), i = R(r), a = R(i, !0);
		j(i);
		var o = z(i, 2), l = (e) => {
			var n = Co();
			V(() => oi(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			Y(e, wo());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), j(r), V((e) => {
			oi(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), Cr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), Cr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), Cr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), Cr("drop", r, function(...e) {
			(W(n) ? (e) => ee(W(t), e) : null)?.apply(this, e);
		}), Cr("dragend", r, function(...e) {
			(W(n) ? T : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => ne(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? re : null)?.apply(this, e);
		}), Cr("pointercancel", r, function(...e) {
			(W(n) ? re : null)?.apply(this, e);
		}), Y(e, r);
	}), j(E), wi(E, (e) => L(f, e), () => W(f)), V(() => {
		oi(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), Y(e, E), We();
}
wr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Oo(e, t) {
	Ue(t, !1);
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
			id: Ni,
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
		L(i, s().length > 0 ? s() : [Ni, ...o().map((e) => e.id)]);
	}), B(() => (W(i), W(n), W(r), K(c()), K(p())), () => {
		L(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e, c(), p())));
	}), Dn(), Ti();
	{
		let t = /* @__PURE__ */ P(() => `filter-strip ${f()}`);
		Do(e, {
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
	We();
}
//#endregion
//#region viewer/assets/inline-links.js
function ko(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function Ao(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = ko(t.slice(r.lastIndex, e - 1));
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
//#endregion
//#region experiments/editor-svelte-spike/src/InlineLinks.svelte
var jo = /* @__PURE__ */ J("<a class=\"inline-link\" rel=\"noopener noreferrer\"> </a>");
function Mo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = $(t, "text", 8, "");
	B(() => K(r()), () => {
		L(n, Ao(r()));
	}), Dn(), Ti();
	var i = Pr();
	Wr(fn(i), 1, () => W(n), Br, (e, t) => {
		var n = Pr(), r = fn(n), i = (e) => {
			var n = jo(), r = R(n, !0);
			j(n), V(() => {
				Q(n, "href", (W(t), G(() => W(t).href))), X(r, (W(t), G(() => W(t).text)));
			}), Y(e, n);
		}, a = (e) => {
			var n = Nr();
			V(() => X(n, (W(t), G(() => W(t).text)))), Y(e, n);
		};
		Z(r, (e) => {
			W(t), G(() => W(t).href) ? e(i) : e(a, -1);
		}), Y(e, n);
	}), Y(e, i), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var No = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Po = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function Fo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "status", 8, "pending"), o = $(t, "interactive", 8, !1), s = $(t, "label", 8, ""), c = $(t, "onCycle", 8, () => {}), l = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	B(() => K(a()), () => {
		L(n, l[a()] ?? "?");
	}), B(() => K(a()), () => {
		L(r, u[a()] ?? a());
	}), B(() => (K(s()), W(r)), () => {
		L(i, s() ? `${s()}：${W(r)}` : W(r));
	}), Dn();
	var d = Pr(), f = fn(d), p = (e) => {
		var t = No(), r = R(t), o = R(r, !0);
		j(r), j(t), V(() => {
			oi(t, 1, `marker-box marker-${a()} marker-box-button`), Q(t, "aria-label", `${W(i)}，點擊切換下一個結果`), X(o, W(n));
		}), q("click", t, function(...e) {
			c()?.apply(this, e);
		}), Y(e, t);
	}, m = (e) => {
		var t = Po(), r = R(t), o = R(r, !0);
		j(r), j(t), V(() => {
			oi(t, 1, `marker-box marker-${a()}`), Q(t, "aria-label", W(i)), X(o, W(n));
		}), Y(e, t);
	};
	Z(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), Y(e, d), We();
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Io = /* @__PURE__ */ J("<i></i>"), Lo = /* @__PURE__ */ J("<div role=\"img\"></div>"), Ro = /* @__PURE__ */ J("<progress max=\"100\"></progress>");
function zo(e, t) {
	Ue(t, !1);
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
	}), Dn(), Ti();
	var f = Pr(), p = fn(f), m = (e) => {
		var t = Lo();
		Wr(t, 5, () => W(r), Br, (e, t) => {
			var n = Io();
			V((e) => oi(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), Y(e, n);
		}), j(t), V(() => {
			oi(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), Y(e, t);
	}, h = (e) => {
		var t = Ro();
		V(() => {
			oi(t, 1, `progress-meter ${c()}`), vi(t, W(n)), Q(t, "aria-label", s());
		}), Y(e, t);
	};
	Z(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), Y(e, f), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var Bo = /* @__PURE__ */ J("<div><b> </b> <span> </span></div>"), Vo = /* @__PURE__ */ J("<div class=\"progress-stats\"></div>"), Ho = /* @__PURE__ */ J("<span class=\"progress-note\"> </span>"), Uo = /* @__PURE__ */ J("<p class=\"progress-caption\"><span> </span> <!></p>"), Wo = /* @__PURE__ */ J("<section class=\"progress-summary\"><!> <!> <!></section>");
function Go(e, t) {
	Ue(t, !1);
	let n = $(t, "stats", 24, () => []), r = $(t, "bar", 8, null), i = $(t, "caption", 8, ""), a = $(t, "note", 8, ""), o = $(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	Ti();
	var l = Wo(), u = R(l), d = (e) => {
		var t = Vo();
		Wr(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = Bo(), r = R(n), i = R(r, !0);
			j(r);
			var a = z(r, 2), o = R(a, !0);
			j(a), j(n), V((e) => {
				oi(n, 1, e), X(i, (W(t), G(() => W(t).value))), X(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${c(W(t).tone)}`))]), Y(e, n);
		}), j(t), Y(e, t);
	};
	Z(u, (e) => {
		K(n()), G(() => n().length) && e(d);
	});
	var f = z(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (K(r()), G(() => r().cells ?? []))), n = /* @__PURE__ */ P(() => (K(r()), G(() => r().ratio ?? 0))), a = /* @__PURE__ */ P(() => i() || o());
			zo(e, {
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
		var t = Uo(), n = R(t), r = R(n, !0);
		j(n);
		var o = z(n, 2), s = (e) => {
			var t = Ho(), n = R(t, !0);
			j(t), V(() => X(n, a())), Y(e, t);
		};
		Z(o, (e) => {
			a() && e(s);
		}), j(t), V(() => X(r, i())), Y(e, t);
	};
	Z(m, (e) => {
		(i() || a()) && e(h);
	}), j(l), V(() => Q(l, "aria-label", o())), Y(e, l), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Ko = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), qo = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Jo = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Yo(e, t) {
	Ue(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Ti();
	var y = Jo(), b = fn(y), x = R(b, !0);
	j(b);
	var S = z(b, 2), C = R(S), w = R(C, !0);
	j(C);
	var ee = z(C, 2), T = R(ee, !0);
	j(ee), j(S);
	var te = z(S, 2), ne = (e) => {
		var t = Ko(), a = R(t, !0);
		j(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Z(te, (e) => {
		r() && e(ne);
	});
	var re = z(te, 2), E = (e) => {
		var t = qo(), n = fn(t), r = R(n, !0);
		j(n);
		var i = z(n, 2), s = R(i, !0);
		j(i), V(() => {
			n.disabled = o(), X(r, m()), i.disabled = !a() || o(), X(s, o() ? d() : u());
		}), q("click", n, function(...e) {
			v()?.apply(this, e);
		}), q("click", i, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	Z(re, (e) => {
		n() && e(E);
	}), V(() => {
		X(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Q(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), X(T, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", ee, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), We();
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Xo = /* @__PURE__ */ J("<option> </option>"), Zo = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Qo = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), $o = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function es(e, t) {
	Ue(t, !1);
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(Ma(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Ea.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Ma(o().base, o()) : Ma(s())), L(f, !0);
	}
	function S() {
		L(f, !1);
	}
	function C(e) {
		y(Ma(e.currentTarget.value));
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
	function ee(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), L(g, {
			...W(g),
			[e.key]: n.value
		}), r && L(_, {
			...W(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function T() {
		L(m, a()), S();
	}
	function te() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ma(W(h), W(_))), S();
	}
	B(() => K(a()), () => {
		L(m, a());
	}), B(() => (W(h), W(_)), () => {
		L(n, Ma(W(h), W(_)));
	}), B(() => W(n), () => {
		L(r, Va(W(n)));
	}), B(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Dn(), Ti();
	var ne = $o(), re = fn(ne), E = z(R(re), 2);
	Wr(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = Xo(), r = R(n, !0);
		j(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), j(E), j(re), So(z(re, 2), {
		get open() {
			return W(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: T,
		children: (e, t) => {
			var a = Qo(), o = z(fn(a), 2), s = z(R(o), 2), c = R(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", j(s);
			var u;
			ui(s), j(o);
			var d = z(o, 2);
			Wr(d, 7, () => Ea, (e) => e.key, (e, t, r) => {
				var i = Zo(), a = R(i), o = R(a, !0);
				j(a);
				var s = z(a, 2), c = R(s);
				_i(c);
				var l = z(c, 2);
				_i(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), wi(l, (e, t) => Jt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), j(s), j(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), vi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), vi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => ee(W(t), e)), Y(e, i);
			}), j(d);
			var f = z(d, 2);
			let m;
			var _ = R(f, !0);
			j(f);
			var v = z(f, 2), b = R(v), x = z(b, 4), S = z(x, 2);
			j(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", li(s, W(h))), m = oi(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(Ma(W(h)))), q("click", x, T), q("click", S, te), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", E, b), di(E, () => W(m), (e) => L(m, e)), Y(e, ne), We();
}
wr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var ts = /* @__PURE__ */ J("<p class=\"document-owner\">擁有者：<a> </a></p>"), ns = /* @__PURE__ */ J("<details class=\"checklist-round\"><summary>本輪依據</summary><p> </p></details>"), rs = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), is = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), as = /* @__PURE__ */ J("<a class=\"checklist-next-step\"><span> </span> <strong> </strong></a>"), os = /* @__PURE__ */ J("<p class=\"checklist-chips\"><span class=\"checklist-chip\"> </span></p>"), ss = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), cs = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), ls = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), us = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), ds = /* @__PURE__ */ J("<section tabindex=\"-1\"><div class=\"checklist-check-heading\"><!> <strong> </strong> <span> </span></div> <dl><div><dt>Action</dt><dd><!></dd></div> <div><dt>Expect</dt><dd><!></dd></div> <!> <!> <!></dl> <!></section>"), fs = /* @__PURE__ */ J("<div class=\"checklist-checks\"><p class=\"checklist-outcome\"><!></p> <!> <!></div>"), ps = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header\"><!> <div><h2> </h2></div> <span class=\"checklist-status\"> </span></header>"), ms = /* @__PURE__ */ J("<article><!></article>"), hs = /* @__PURE__ */ J("<button type=\"button\" class=\"secondary-button checklist-reset-button\">清空結果</button>"), gs = /* @__PURE__ */ J("<!> <!> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"><!></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!> <!></footer>", 1), _s = /* @__PURE__ */ J("<p> </p> <p>此操作無法復原；如需回復，請使用 Git 歷史。</p> <form method=\"dialog\" class=\"theme-dialog-actions\"><button type=\"submit\" class=\"secondary-button\">取消</button> <button type=\"submit\" class=\"primary-button\">確認清空</button></form>", 1), vs = /* @__PURE__ */ J("<!> <main class=\"checklist-page\"><header class=\"checklist-header\"><div><h1> </h1> <!> <!></div> <!></header> <!></main> <!>", 1);
function ys(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "transport", 8, null), o = $(t, "onPersistenceChange", 8, () => {}), s = $(t, "bindRefresh", 8, () => {}), c = null, l = /* @__PURE__ */ I(null), u = /* @__PURE__ */ I(!0), d = /* @__PURE__ */ I(""), f = /* @__PURE__ */ I(null), p = /* @__PURE__ */ I("正在載入 Checklist…"), m = /* @__PURE__ */ I(!1), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I([]);
	function _(e) {
		c = xa({
			session: oa(e),
			save: a().save,
			debounceCommand: (e) => e.type === "set-observed",
			onChange: (e) => {
				L(l, e), L(p, e.message);
			}
		}), L(l, c.snapshot()), L(p, W(l).message);
	}
	async function v() {
		if (!a() || !W(l) || W(l).dirty || W(l).saving || W(l).pending || W(m) || W(h)) return;
		let e = c, t = W(l)?.document?.revision;
		try {
			let n = await a().load();
			if (!n || !n.revision || !c || c !== e || !W(l) || W(l).document?.revision !== t || W(l).dirty || W(l).saving || W(l).pending || W(m) || W(h) || n.revision === t) return;
			let r = W(l).cautious;
			_(n), r && c && await c.setCautious(!0);
		} catch (e) {
			console.warn("Checklist foreground refresh failed:", e);
		}
	}
	function y() {
		W(r) && (L(g, W(n).map((e) => ({ ...e }))), L(m, !0));
	}
	async function b() {
		if (!W(r) || W(h)) return;
		L(h, !0);
		let e = W(l).cautious;
		L(p, "正在清空實機結果…");
		try {
			_(await a().reset({ targets: W(g) })), L(l, await c.setCautious(e)), L(p, "實機結果已清空；其他檢查結果保留。");
		} catch (e) {
			L(p, e instanceof Error ? e.message : "清空失敗，請重新載入確認結果。");
		} finally {
			L(h, !1);
		}
	}
	let x = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, S = [
		"pending",
		"passed",
		"failed"
	], C = /* @__PURE__ */ I(Fi(S)), w = /* @__PURE__ */ I(null), ee = Ca({ supportedIds: [Ni, ...S] }), T = /* @__PURE__ */ I(ee.order);
	function te(e) {
		L(C, zi(W(C), e)), Li(W(w), W(C));
	}
	function ne() {
		L(C, Bi(W(C))), Li(W(w), W(C));
	}
	function re(e, t, n) {
		L(T, [...ee.move(e, t, n)]);
	}
	function E(e, t) {
		let n = new Map(aa(e).map((e) => [e.id, e.count]));
		return t.filter((e) => S.includes(e)).map((e) => ({
			id: e,
			label: x[e] ?? e,
			count: n.get(e) ?? 0,
			title: "拖曳可調整順序；排在「預設」左邊的標籤會分組到最前面"
		}));
	}
	let ie = /* @__PURE__ */ I(), D = /* @__PURE__ */ I(!0), ae = /* @__PURE__ */ I({});
	function oe(e) {
		let t = Ai(e);
		L(D, t.expanded), L(ae, t.overrides);
	}
	function se(e, t) {
		L(ae, {
			...W(ae),
			[e]: t
		}), ji(W(i), W(D), W(ae));
	}
	function ce(e) {
		L(D, e), L(ae, {}), ji(W(i), W(D), W(ae));
	}
	async function le(e) {
		e.preventDefault();
		let t = W(l).summary.nextStep;
		if (!t) return;
		W(ie)?.revealCard(t.workItemId), se(t.workItemId, !0), L(C, Fi(S)), Li(W(w), W(C)), await pr();
		let n = document.getElementById(`check-${t.workItemId}-${t.checkIndex}`);
		n?.focus({ preventScroll: !0 }), n?.scrollIntoView({ block: "start" });
	}
	let ue = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), de = (e) => e === "saving" ? "saving" : ue.has(e) ? "error" : "clean", pe = /* @__PURE__ */ I(null), me = /* @__PURE__ */ I({
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
	Di(async () => {
		L(pe, Ha()), he();
		try {
			if (!a()) throw Error("Checklist 介面需要由 host 提供 transport。");
			_(await a().load()), a().loadOwnerReport?.().then((e) => {
				L(f, e);
			}).catch(() => {});
		} catch (e) {
			L(d, e instanceof Error ? e.message : "Checklist 載入失敗。"), L(p, W(d));
		} finally {
			L(u, !1);
		}
	});
	function ge(e) {
		if (!W(h)) try {
			c.dispatch(e), L(l, c.snapshot()), L(p, W(l).message);
		} catch (e) {
			L(p, e.message);
		}
	}
	function _e(e, t) {
		ge({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function ve() {
		W(h) || (c.undo(), L(l, c.snapshot()));
	}
	function ye() {
		W(h) || (c.redo(), L(l, c.snapshot()));
	}
	function be() {
		W(h) || L(l, c.discard());
	}
	async function xe() {
		W(h) || (await c.save(), L(l, c.snapshot()));
	}
	async function Se(e) {
		W(h) || L(l, await c.setCautious(e));
	}
	B(() => W(l), () => {
		L(n, W(l)?.document.items.flatMap((e) => e.checks.filter((e) => e.isManual).map((t) => ({
			workItemId: e.id,
			checkIndex: t.index
		}))) ?? []);
	}), B(() => (W(l), W(h), W(n)), () => {
		L(r, !!W(l) && !W(l).dirty && !W(l).saving && !W(l).pending && !W(l).blocked && !W(h) && W(n).length > 0);
	}), B(() => (K(o()), W(l), W(m), W(h)), () => {
		o()(W(l) ? {
			...W(l),
			pending: W(l).pending || W(m) || W(h)
		} : W(l));
	}), B(() => K(s()), () => {
		s()(v);
	}), B(() => W(l), () => {
		L(i, W(l)?.document ? `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${W(l).document.fileName}:${W(l).document.roundIdentity}` : null);
	}), B(() => (W(i), W(w), Ii), () => {
		W(i) && W(w) !== `${W(i)}:filters` && (L(w, `${W(i)}:filters`), L(C, Ii(W(w), S)));
	}), B(() => W(i), () => {
		W(i) && oe(W(i));
	}), Dn(), Ti();
	var Ce = vs(), we = fn(Ce);
	bo(we, {});
	var Te = z(we, 2), O = R(Te), Ee = R(O), De = R(Ee), Oe = R(De, !0);
	j(De);
	var ke = z(De, 2), Ae = (e) => {
		var t = ts(), n = z(R(t)), r = R(n, !0);
		j(n), j(t), V(() => {
			Q(n, "href", (W(f), G(() => W(f).href))), X(r, (W(f), G(() => W(f).title)));
		}), Y(e, t);
	};
	Z(ke, (e) => {
		W(f) && e(Ae);
	});
	var k = z(ke, 2), je = (e) => {
		var t = ns(), n = z(R(t)), r = R(n, !0);
		j(n), j(t), V(() => X(r, (W(l), G(() => W(l).document.roundIdentity)))), Y(e, t);
	};
	Z(k, (e) => {
		W(l) && e(je);
	}), j(Ee);
	var A = z(Ee, 2), Me = (e) => {
		es(e, {
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
	Z(A, (e) => {
		W(pe) && e(Me);
	}), j(O);
	var Ne = z(O, 2), Pe = (e) => {
		var t = rs(), n = R(t, !0);
		j(t), V(() => X(n, W(p))), Y(e, t);
	}, Fe = (e) => {
		var t = is(), n = R(t, !0);
		j(t), V(() => X(n, W(d))), Y(e, t);
	}, Ie = (e) => {
		var t = gs(), n = fn(t);
		{
			let e = /* @__PURE__ */ P(() => (W(l), G(() => ({
				form: "segmented",
				cells: W(l).summary.cells
			})))), t = /* @__PURE__ */ P(() => (W(l), G(() => `${W(l).summary.checks.passed} / ${W(l).summary.checks.total} checks 通過`))), r = /* @__PURE__ */ P(() => (W(l), G(() => W(l).summary.checks.failed > 0 ? `${W(l).summary.checks.failed} 個失敗` : "")));
			Go(n, {
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
		var i = z(n, 2), o = (e) => {
			var t = as(), n = R(t), r = R(n);
			j(n);
			var i = z(n, 2), a = R(i, !0);
			j(i), j(t), V(() => {
				Q(t, "href", (W(l), G(() => `#check-${W(l).summary.nextStep.workItemId}-${W(l).summary.nextStep.checkIndex}`))), Q(t, "title", (W(l), G(() => W(l).summary.nextStep.title))), X(r, `${W(l), G(() => W(l).summary.nextStep.isManual ? "需實機驗證" : "下一步 · Agent") ?? ""}：`), X(a, (W(l), G(() => W(l).summary.nextStep.title)));
			}), q("click", t, le), Y(e, t);
		};
		Z(i, (e) => {
			W(l), G(() => W(l).summary.nextStep) && e(o);
		});
		var s = z(i, 2), c = R(s);
		{
			let e = /* @__PURE__ */ P(() => (K(ra), K(ia), W(l), W(T), W(C), G(() => ra(ia(W(l).document, W(T)), W(C).selected).items))), t = /* @__PURE__ */ P(() => (K(ia), W(l), W(T), G(() => ia(W(l).document, W(T)).items.map((e) => e.id)))), n = /* @__PURE__ */ P(() => (W(l), G(() => new URLSearchParams(location.search).has("scope") ? `taskprogress.cards.checklist.v1:${location.pathname}:${new URLSearchParams(location.search).get("scope")}:${new URLSearchParams(location.search).get("task")}:${W(l).document.roundIdentity}` : null)));
			wi(vo(c, {
				get expanded() {
					return W(D);
				},
				onToggleAll: ce,
				get items() {
					return W(e);
				},
				get allIds() {
					return W(t);
				},
				get storageKey() {
					return W(n);
				},
				children: fe,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ P(() => t.item), r = /* @__PURE__ */ P(() => t.visibilityEnabled), i = /* @__PURE__ */ P(() => t.visible), a = /* @__PURE__ */ P(() => t.onVisibleChange), o = /* @__PURE__ */ P(() => (W(l), K(W(n)), G(() => W(l).document.items.find((e) => e.id === W(n).id))));
						var s = ms(), c = R(s);
						{
							let e = /* @__PURE__ */ P(() => (W(ae), K(W(n)), W(D), G(() => W(ae)[W(n).id] ?? W(D)))), t = /* @__PURE__ */ P(() => (K(W(n)), G(() => `checklist-body-${W(n).id}`)));
							Xa(c, {
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
									var r = fs(), i = R(r);
									Mo(R(i), { get text() {
										return K(W(n)), G(() => W(n).outcome);
									} }), j(i);
									var a = z(i, 2), o = (e) => {
										var t = os(), r = R(t), i = R(r);
										j(r), j(t), V((e) => X(i, `Depends on ${e ?? ""}`), [() => (K(W(n)), G(() => W(n).dependsOn.join(", ")))]), Y(e, t);
									};
									Z(a, (e) => {
										K(W(n)), G(() => W(n).dependsOn.length) && e(o);
									}), Wr(z(a, 2), 1, () => (K(W(n)), G(() => W(n).checks)), (e) => e.index, (e, t) => {
										var r = ds(), i = R(r), a = R(i);
										{
											let e = /* @__PURE__ */ P(() => (W(t), W(h), G(() => W(t).isManual && !W(h))));
											Fo(a, {
												get status() {
													return W(t), G(() => W(t).status);
												},
												get interactive() {
													return W(e);
												},
												get label() {
													return W(t), G(() => W(t).title);
												},
												onCycle: () => _e(W(n).id, W(t))
											});
										}
										var o = z(a, 2), s = R(o, !0);
										j(o);
										var c = z(o, 2), l = R(c, !0);
										j(c), j(i);
										var u = z(i, 2), d = R(u), f = z(R(d));
										Mo(R(f), { get text() {
											return W(t), G(() => W(t).action);
										} }), j(f), j(d);
										var p = z(d, 2), m = z(R(p));
										Mo(R(m), { get text() {
											return W(t), G(() => W(t).expect);
										} }), j(m), j(p);
										var g = z(p, 2), _ = (e) => {
											var n = ss(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).reason)))), Y(e, n);
										};
										Z(g, (e) => {
											W(t), G(() => W(t).reason) && e(_);
										});
										var v = z(g, 2), y = (e) => {
											var n = cs(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).observed)))), Y(e, n);
										};
										Z(v, (e) => {
											W(t), G(() => W(t).observed && !(W(t).isManual && W(t).status === "failed")) && e(y);
										});
										var b = z(v, 2), x = (e) => {
											var n = ls(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).resolved)))), Y(e, n);
										};
										Z(b, (e) => {
											W(t), G(() => W(t).resolved) && e(x);
										}), j(u);
										var S = z(u, 2), C = (e) => {
											var r = us(), i = z(R(r), 2);
											it(i), j(r), V(() => {
												i.disabled = W(h), vi(i, (W(t), G(() => W(t).observed ?? "")));
											}), q("input", i, (e) => ge({
												type: "set-observed",
												workItemId: W(n).id,
												checkIndex: W(t).index,
												value: e.currentTarget.value
											})), Y(e, r);
										};
										Z(S, (e) => {
											W(t), G(() => W(t).isManual && W(t).status === "failed") && e(C);
										}), j(r), V(() => {
											Q(r, "id", (K(W(n)), W(t), G(() => `check-${W(n).id}-${W(t).index}`))), oi(r, 1, (W(t), G(() => `checklist-check checklist-${W(t).status}${W(t).isManual ? " checklist-manual" : ""}`))), X(s, (W(t), G(() => W(t).title))), oi(c, 1, (W(t), G(() => `checklist-owner${W(t).isManual ? " checklist-owner-manual" : ""}`))), X(l, (W(t), G(() => W(t).isManual ? "實機" : "Agent")));
										}), Y(e, r);
									}), j(r), Y(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = ps(), i = R(r);
										{
											let e = /* @__PURE__ */ P(() => (K(W(n)), G(() => `工作項目 ${W(n).id}`)));
											Fo(i, {
												get status() {
													return K(W(n)), G(() => W(n).status);
												},
												get label() {
													return W(e);
												}
											});
										}
										var a = z(i, 2), s = R(a), c = R(s);
										j(s), j(a);
										var l = z(a, 2), u = R(l);
										j(l), j(r), V(() => {
											X(c, `${K(W(n)), G(() => W(n).id) ?? ""}. ${K(W(n)), G(() => W(n).title) ?? ""}`), Q(l, "aria-label", (K(W(o)), G(() => `通過 ${W(o).progress.passed}，共 ${W(o).progress.total}`))), X(u, `${K(W(o)), G(() => W(o).progress.passed) ?? ""}/${K(W(o)), G(() => W(o).progress.total) ?? ""}`);
										}), Y(e, r);
									}
								}
							});
						}
						j(s), V(() => oi(s, 1, (K(W(n)), G(() => `checklist-item checklist-${W(n).status}`)))), Y(e, s);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ P(() => (W(l), W(T), G(() => E(W(l).document, W(T))))), n = /* @__PURE__ */ P(() => (K(Ri), W(C), G(() => Ri(W(C)))));
							Oo(e, {
								get categories() {
									return W(t);
								},
								get order() {
									return W(T);
								},
								get selected() {
									return W(C), G(() => W(C).selected);
								},
								get defaultLit() {
									return W(n);
								},
								className: "status-filter-strip status-summary-filters",
								ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
								reorderable: !0,
								onSelect: te,
								onSelectDefault: ne,
								onReorder: re
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => L(ie, e), () => W(ie));
		}
		j(s);
		var u = z(s, 2), d = R(u);
		{
			let e = /* @__PURE__ */ P(() => (W(l), W(h), G(() => W(l).saving || W(h))));
			Yo(d, {
				get cautious() {
					return W(l), G(() => W(l).cautious);
				},
				onToggleCautious: Se,
				get dirty() {
					return W(l), G(() => W(l).dirty);
				},
				get saving() {
					return W(e);
				},
				get canUndo() {
					return W(l), G(() => W(l).history.canUndo);
				},
				get canRedo() {
					return W(l), G(() => W(l).history.canRedo);
				},
				get message() {
					return W(p);
				},
				onSave: xe,
				onUndo: ve,
				onRedo: ye,
				onDiscard: be
			});
		}
		var f = z(d, 2), m = (e) => {
			var t = hs();
			V(() => {
				t.disabled = !W(r), Q(t, "title", (W(l), G(() => W(l).dirty || W(l).pending || W(l).saving ? "請先儲存或捨棄變更，再清空。" : "將實機檢查重設為未執行；Agent 檢查結果保留")));
			}), q("click", t, y), Y(e, t);
		};
		Z(f, (e) => {
			K(a()), G(() => typeof a()?.reset == "function") && e(m);
		}), j(u), V((e) => {
			Q(u, "data-state", e), Q(u, "aria-busy", (W(l), W(h), G(() => W(l).saving || W(h))));
		}, [() => (W(l), G(() => de(W(l).status)))]), Y(e, t);
	};
	Z(Ne, (e) => {
		W(u) ? e(Pe) : W(l) ? e(Ie, -1) : e(Fe, 1);
	}), j(Te), So(z(Te, 2), {
		get open() {
			return W(m);
		},
		title: "清空結果？",
		titleId: "checklist-reset-title",
		kicker: "Checklist",
		onClose: () => {
			L(m, !1);
		},
		children: (e, t) => {
			var n = _s(), r = fn(n), i = R(r);
			j(r);
			var a = z(r, 4), o = z(R(a), 2);
			j(a), V(() => {
				X(i, `將 ${W(g), G(() => W(g).length) ?? ""} 個實機檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。其他檢查結果不受影響。`), o.disabled = W(h);
			}), q("click", o, b), Y(e, n);
		},
		$$slots: { default: !0 }
	}), V(() => X(Oe, (W(l), G(() => W(l)?.document.fileName ?? "TaskProgress Checklist")))), Y(e, Ce), We();
}
wr(["click", "input"]), (function(e) {
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
})(globalThis), Object.freeze(["1.0", "1.1"]), Object.freeze(["standard", "report_pointer"]), Object.freeze({
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
var bs = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(bs.levels.map((e) => [e.value, e]))), bs.fallbackValue;
var xs = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
function Ss(e, t = "auto") {
	if (typeof e != "string" || e.length > 100 || !xs.test(e)) throw Error("scope 無效。");
	if (![
		"auto",
		"none",
		"explicit"
	].includes(t)) throw Error("Developer 顯示模式無效。");
	let n = new URLSearchParams({ scope: e });
	return t === "none" && n.set("dev", "none"), t === "explicit" && n.set("dev", `../reports/${e}/report.dev.json`), `?${n}`;
}
function Cs(e) {
	if (typeof e != "string" || e.length > 100 || !xs.test(e)) throw Error("scope 必須是小寫英數字組成的穩定 ID，可使用點、底線或連字號。");
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
async function ws(e, t = globalThis.fetch) {
	try {
		let n = await t(Cs(e), {
			cache: "no-store",
			signal: AbortSignal.timeout(5e3)
		});
		if (!n.ok) return null;
		let r = await n.json();
		return r?.scope_id !== e || typeof r.title != "string" || !r.title.trim() || !Array.isArray(r.tasks) ? null : {
			title: r.title,
			href: `/${Ss(e)}`
		};
	} catch {
		return null;
	}
}
//#endregion
//#region viewer/assets/checklist-http-transport.js
var Ts = 1, Es = /* @__PURE__ */ new Set([
	"load",
	"save",
	"reset"
]);
function Ds({ scope: e, task: t, fetchImpl: n = globalThis.fetch, apiRoot: r = "/__taskprogress/v1" } = {}) {
	if (typeof e != "string" || !e) throw TypeError("Checklist HTTP transport 需要 scope。");
	if (typeof t != "string" || !t) throw TypeError("Checklist HTTP transport 需要 task。");
	if (typeof n != "function") throw TypeError("Checklist HTTP transport 需要 fetch。");
	let i = 0;
	async function a(a, o) {
		if (!Es.has(a)) throw Error(`不支援的 Checklist request：${a}`);
		let s = {
			version: Ts,
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
		loadOwnerReport: () => ws(e, n),
		load: () => a("load"),
		save: (e) => a("save", e),
		reset: (e = {}) => a("reset", e)
	});
}
//#endregion
//#region viewer/assets/foreground-refresh.js
function Os(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function ks({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (Os(e, "windowTarget"), Os(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
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
function As() {
	try {
		let e = new URLSearchParams(location.search);
		return Ds({
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
var js = null, Ms = null;
ks({
	canRefresh: () => !Ms?.dirty && !Ms?.saving && !Ms?.pending,
	reload: async () => {
		js && await js();
	}
}), Fr(ys, {
	target: document.querySelector("#app"),
	props: {
		transport: As(),
		bindRefresh: (e) => {
			js = e;
		},
		onPersistenceChange: (e) => {
			Ms = e;
		}
	}
});
//#endregion
