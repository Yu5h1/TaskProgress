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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, ee = 65536, E = 1 << 21, te = 1 << 22, ne = 1 << 23, D = Symbol("$state"), re = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
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
	return Me(/* @__PURE__ */ un(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ un(A) !== null) throw Oe(), Te;
		A = e;
	}
}
function Pe(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ un(n);
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
		var i = /* @__PURE__ */ un(n);
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
		for (var r of n) Sn(r);
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
	if (t === null) return H.f |= ne, e;
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
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ee, et(t.deps));
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
	k && /* @__PURE__ */ ln(e) !== null && fn(e);
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
	qn(null), Jn(null);
	try {
		return e();
	} finally {
		qn(t), Jn(n);
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
		yn() && (W(n), On(() => (t === 0 && (r = G(() => e(() => Zt(n)))), t += 1, () => {
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
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = kn(() => {
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
			this.#a = An(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Je(r), t && (this.#s = An(() => {
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
			t = !0, n && we(), this.#s !== null && Ln(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = An(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = cn();
			e.append(t), this.#a = this.#S(() => An(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Ln(this.#o, () => {
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
				Vn(this.#a, e);
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
		Jn(this.#i), qn(this.#i), He(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Jn(t), qn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Ln(this.#o, () => {
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
		this.#a &&= (Pn(this.#a), null), this.#o &&= (Pn(this.#o), null), this.#s &&= (Pn(this.#s), null), k && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return An(() => {
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
		Jn(e), qn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Jn(null), qn(null), He(null), e && F?.deactivate();
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
	return Dn(() => {
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
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= ne, Yt(a, t)) : (a.f & 8388608 && (a.f ^= ne), Yt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), bn(() => {
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
		for (var n = 0; n < t.length; n += 1) Pn(t[n]);
	}
}
function xt(e) {
	var t, n = U, r = e.parent;
	if (!Wn && r !== null && e.v !== O && r.f & 24576) return De(), e.v;
	Jn(r);
	try {
		e.f &= ~ee, bt(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = ar(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		N(e, h);
		return;
	}
	Wn || (Dt === null ? $e(e) : (yn() || F?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ur(t, 0), Mn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
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
				a ? r.f ^= h : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), dr(r));
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
			if (!(r.f & 24576) && or(r) && (Rt = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && In(r), Rt?.size > 0)) {
				Wt.clear();
				for (let e of Rt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Rt.has(n) && (Rt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
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
	return Xn(n), n;
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
	return H !== null && (!Kn || H.f & 131072) && Ge() && H.f & 4325394 && (Yn === null || !Yn.has(e)) && Ce(), Yt(e, n ? $t(t) : t, Mt);
}
function Yt(e, t, n = null) {
	if (!e.equals(t)) {
		Wt.set(e, Wn ? t : e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && $e(t);
		}
		e.wv = ar(), Qt(e, g, n), Ge() && U !== null && U.f & 1024 && !(U.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Xt();
	}
	return t;
}
function Xt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && N(e, _);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && dr(e);
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
				Dt?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= ee), Qt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Rt !== null && Rt.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function $t(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ qt(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = H, n = rr;
		qn(null), ir(d);
		var r = e();
		return qn(t), ir(n), r;
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
			if (n === D) return t;
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
			if (t === D) return !0;
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
		if (typeof e == "object" && e && D in e) return e[D];
	} catch {}
	return e;
}
function tn(e, t) {
	return Object.is(en(e), en(t));
}
var nn, rn, an, on;
function sn() {
	if (nn === void 0) {
		nn = window, rn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		an = a(t, "firstChild").get, on = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
	}
}
function cn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
function R(e, t) {
	if (!k) return /* @__PURE__ */ ln(e);
	var n = /* @__PURE__ */ ln(A);
	if (n === null) n = A.appendChild(cn());
	else if (t && n.nodeType !== 3) {
		var r = cn();
		return n?.before(r), Me(r), r;
	}
	return t && hn(n), Me(n), n;
}
function dn(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ ln(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ un(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = cn();
			return A?.before(r), Me(r), r;
		}
		hn(A);
	}
	return A;
}
function z(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ un(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = cn();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		hn(r);
	}
	return Me(r), r;
}
function fn(e) {
	e.textContent = "";
}
function pn() {
	return !1;
}
function mn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function hn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function gn(e) {
	U === null && (H === null && ve(e), _e()), Wn && ge(e);
}
function _n(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function vn(e, t) {
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
			dr(r);
		} catch (e) {
			throw Pn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && _n(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function yn() {
	return H !== null && !Kn;
}
function bn(e) {
	let t = vn(8, null);
	return N(t, h), t.teardown = e, t;
}
function xn(e) {
	gn("$effect");
	var t = U.f;
	if (!H && t & 32 && M !== null && !M.i) {
		var n = M;
		(n.e ??= []).push(e);
	} else return Sn(e);
}
function Sn(e) {
	return vn(4 | w, e);
}
function Cn(e) {
	return gn("$effect.pre"), vn(8 | w, e);
}
function wn(e) {
	Ft.ensure();
	let t = vn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ln(t, () => {
			Pn(t), n(void 0);
		}) : (Pn(t), n(void 0));
	});
}
function Tn(e) {
	return vn(4, e);
}
function B(e, t) {
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
				Jn(n.parent), G(t);
			} finally {
				Jn(n);
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
			n.f & 1024 && n.deps !== null && N(n, _), or(n) && dr(n), t.ran = !1;
		}
	});
}
function Dn(e) {
	return vn(te | C, e);
}
function On(e, t = 0) {
	return vn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		vn(8, () => {
			e(...t.map(W));
		});
	});
}
function kn(e, t = 0) {
	return vn(16 | t, e);
}
function An(e) {
	return vn(32 | C, e);
}
function jn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Wn, n = H;
		Gn(!0), qn(null);
		try {
			t.call(null);
		} finally {
			Gn(e), qn(n);
		}
	}
}
function Mn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Pn(n, t), n = r;
	}
}
function Nn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Pn(t), t = n;
	}
}
function Pn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Fn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Mn(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	jn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && In(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Fn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ un(e);
		e.remove(), e = n;
	}
}
function In(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ln(e, t, n = !0) {
	var r = [];
	Rn(e, r, !0);
	var i = () => {
		n && Pn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Rn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Rn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function zn(e) {
	Bn(e, !0);
}
function Bn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (N(e, g), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Bn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Vn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ un(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Hn = null, Un = !1, Wn = !1;
function Gn(e) {
	Wn = e;
}
var H = null, Kn = !1;
function qn(e) {
	H = e;
}
var U = null;
function Jn(e) {
	U = e;
}
var Yn = null;
function Xn(e) {
	H !== null && (Yn ??= /* @__PURE__ */ new Set()).add(e);
}
var Zn = null, Qn = 0, $n = null;
function er(e) {
	$n = e;
}
var tr = 1, nr = 0, rr = nr;
function ir(e) {
	rr = e;
}
function ar() {
	return ++tr;
}
function or(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ee), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && N(e, h);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? N(a, g) : a.f & 1024 && N(a, _), Bt(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = H, a = Yn, o = M, s = Kn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, H = l & 96 ? null : e, Yn = null, He(e.ctx), Kn = !1, rr = ++nr, e.ac !== null && (st(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = F?.is_fork;
		if (Zn !== null) {
			var m;
			if (p || ur(e, Qn), f !== null && Qn > 0) for (f.length = Qn + Zn.length, m = 0; m < Zn.length; m++) f[Qn + m] = Zn[m];
			else e.deps = f = Zn;
			if (yn() && e.f & 512) for (m = Qn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Qn < f.length && (ur(e, Qn), f.length = Qn);
		if (Ge() && $n !== null && !Kn && f !== null && !(e.f & 6146)) for (m = 0; m < $n.length; m++) sr($n[m], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= E, Zn = t, Qn = n, $n = r, H = i, Yn = a, He(o), Kn = s, rr = c;
	}
}
function lr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Zn === null || !n.call(Zn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~ee), s.v !== O && $e(s), s.ac !== null && st(() => {
			s.ac.abort(ue), s.ac = null, N(s, g);
		}), Ct(s), ur(s, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, h);
		var n = U, r = Un;
		U = e, Un = !(t & 96);
		try {
			t & 16777232 ? Nn(e) : Mn(e), jn(e);
			var i = cr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tr;
		} finally {
			Un = r, U = n;
		}
	}
}
async function fr() {
	await Promise.resolve(), It();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Hn?.add(e), H !== null && !Kn && !(U !== null && U.f & 16384) && (Yn === null || !Yn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < nr && (e.rv = nr, Zn === null && r !== null && r[Qn] === e ? Qn++ : Zn === null ? Zn = [e] : Zn.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Wn && Wt.has(e)) return Wt.get(e);
	if (t) {
		var a = e;
		if (Wn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || mr(a)) && (o = xt(a)), Wt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Kn && H !== null && (Un || !!(H.f & 512)), c = (a.f & b) === 0;
		or(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), pr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), pr(t));
}
function mr(e) {
	if (e.v === O) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function G(e) {
	var t = Kn;
	try {
		return Kn = !0, e();
	} finally {
		Kn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) hr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && hr(n);
		}
	}
}
function hr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			hr(e[n], t);
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
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var vr = Symbol("events"), yr = /* @__PURE__ */ new Set(), br = /* @__PURE__ */ new Set();
function xr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Tr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Sr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = xr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && bn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[vr] ??= {})[e] = n;
}
function Cr(e) {
	for (var t = 0; t < e.length; t++) yr.add(e[t]);
	for (var n of br) n(e);
}
var wr = null;
function Tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	wr = e;
	var s = 0, c = wr === e && e[vr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[vr] = t;
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
		qn(null), Jn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[vr]?.[r];
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
			e[vr] = t, delete e.currentTarget, qn(d), Jn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Er = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Dr(e) {
	return Er?.createHTML(e) ?? e;
}
function Or(e) {
	var t = mn("template");
	return t.innerHTML = Dr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function kr(e, t) {
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
		if (k) return kr(A, null), A;
		i === void 0 && (i = Or(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ln(i)));
		var t = r || rn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ln(t), s = t.lastChild;
			kr(o, s);
		} else kr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ar(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (k) return kr(A, null), A;
		if (!o) {
			var e = /* @__PURE__ */ ln(Or(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ ln(e);) o.appendChild(/* @__PURE__ */ ln(e));
			else o = /* @__PURE__ */ ln(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ ln(t), r = t.lastChild;
			kr(n, r);
		} else kr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function jr(e, t) {
	return /* @__PURE__ */ Ar(e, t, "svg");
}
function Mr() {
	if (k) return kr(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = cn();
	return e.append(t, n), kr(t, n), e;
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
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	sn();
	var l = void 0, u = wn(() => {
		var s = n ?? t.appendChild(cn());
		dt(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = M;
			if (o && (n.c = o), a && (i.$$events = a), k && kr(t, null), l = e(t, i) || {}, k && (U.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw Oe(), Te;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = _r(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(yr)), br.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Tr), r.delete(e), r.size === 0 && Pr.delete(n)) : r.set(e, i);
			}
			br.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, u), l;
}
var Ir = /* @__PURE__ */ new WeakMap(), Lr = class {
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
			if (n) zn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (zn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Pn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Vn(r, t), t.append(cn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Pn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ln(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Pn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = F, r = pn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = cn();
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
	k && (r = A, Ne());
	var i = new Lr(e), a = n ? S : 0;
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
	kn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Rr(e, t) {
	return t;
}
function zr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Ln(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Br(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			fn(d), d.append(u), e.items.clear();
		}
		Br(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Br(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Vn(a, document.createDocumentFragment())) : Pn(t[i], n);
	}
}
var Vr;
function Hr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = k ? Me(/* @__PURE__ */ ln(u)) : u.appendChild(cn());
	}
	k && Ne();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Wr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Kr(d, null, c)) : zn(d) : Ln(d, () => {
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
			k && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = pn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (c = A, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && u.unskip_effect(S.e)) : (S = Gr(l, h ? c : Vr ??= cn(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = An(() => s(c)) : (d = An(() => s(Vr ??= cn())), d.f |= T)), e > r.size && he("", "", ""), k && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
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
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Ur(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (zn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Kr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), qr(e, d, _), qr(e, _, y), Kr(_, y, n), d = _, p = [], m = [], l = Ur(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Kr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					qr(e, S.prev, C.next), qr(e, d, S), qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Kr(_, l, n), qr(e, _.prev, _.next), qr(e, _, d === null ? e.effect.first : d.next), qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Ur(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Ur(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Br(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Ur(l.next);
		var ee = w.length;
		if (ee > 0) {
			var E = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			zr(e, w, E);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: An(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ un(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function Jr(e, t, n, r, i) {
	k && Ne();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Yr(e, t, n) {
	Tn(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			On(() => {
				var e = n();
				K(e), i && Re(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Xr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Xr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Zr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Xr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Qr(e) {
	return typeof e == "object" ? Zr(e) : e ?? "";
}
var $r = [..." 	\n\r\f\xA0\v﻿"];
function ei(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || $r.includes(r[o - 1])) && (s === r.length || $r.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ti(e, t, n, r, i, a) {
	var o = e[oe];
	if (k || o !== n || o === void 0) {
		var s = ei(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ni(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(ai(i));
		return;
	}
	for (i of t.options) if (tn(ai(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function ri(e) {
	var t = new MutationObserver(() => {
		"__value" in e && ni(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), bn(() => {
		t.disconnect();
	});
}
function ii(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ai);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ai(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), Tn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
			if (r.has(o)) return;
		}
		if (ni(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ai(s), n(a));
		}
		e.__value = a, i = !1;
	}), ri(e);
}
function ai(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var oi = Symbol("is custom element"), si = Symbol("is html"), ci = de ? "link" : "LINK", li = de ? "progress" : "PROGRESS";
function ui(e) {
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
function di(e, t) {
	var n = fi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === li) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = fi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ci) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && mi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function fi(e) {
	return e[ae] ??= {
		[oi]: e.nodeName.includes("-"),
		[si]: e.namespaceURI === Ee
	};
}
var pi = /* @__PURE__ */ new Map();
function mi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = pi.get(t);
	if (n) return n;
	pi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function hi(e, t) {
	return e === t || e?.[D] === t;
}
function gi(e = {}, t, n, r) {
	var i = M.r, a = U;
	return Tn(() => {
		var o, s;
		return On(() => {
			o = s, s = r?.() || [], G(() => {
				hi(n(...s), e) || (t(e, ...s), o && hi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && hi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function _i(e = !1) {
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
	n.b.length && Cn(() => {
		vi(t, r), p(n.b);
	}), xn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && xn(() => {
		vi(t, r), p(n.a);
	});
}
function vi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = D in e || re in e;
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
		return Wn && v || b.f & 16384 ? y.v : W(y);
	});
}
function yi(e) {
	M === null && pe("onMount"), Be && M.l !== null ? bi(M).m.push(e) : xn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function bi(e) {
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
function xi(e, t) {
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
function Si(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region viewer/assets/editor-transaction.js
function Ci(e) {
	return structuredClone(e);
}
function wi(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
	let r = Ci(e), i = Ci(r), a = Ci(i), o = t(a), s = [], c = [], l = Number.isInteger(n) && n > 0 ? n : 100, u = (e) => JSON.stringify(e);
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
		let r = Ci(a), i = t(Ci(a), e);
		if (u(r) === u(i)) return !1;
		a = i;
		let o = s.at(-1);
		return n && o?.mergeKey === n ? (o.after = Ci(a), o.command = Ci(e), u(o.before) === u(o.after) && s.pop()) : (s.push({
			before: r,
			after: Ci(a),
			command: Ci(e),
			mergeKey: n
		}), s.length > l && s.shift()), c.length = 0, f(), !0;
	}
	function m() {
		let e = s.pop();
		return e ? (c.push(e), a = Ci(e.before), f(), !0) : !1;
	}
	function h() {
		let e = c.pop();
		return e ? (s.push(e), a = Ci(e.after), f(), !0) : !1;
	}
	function g(e, t = !1) {
		r = Ci(e), i = Ci(r), a = Ci(i), t || (s.length = 0, c.length = 0), f();
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
//#region viewer/assets/filter-selection.js
var Ti = "__default__";
function Ei(e) {
	return [...new Set(e)];
}
function Di(e = []) {
	let t = Ei(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Oi(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function ki(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Ai(e) {
	let t = Oi(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
function ji(e = []) {
	let t = e.indexOf(Ti);
	return t === -1 ? [...e] : e.slice(0, t);
}
//#endregion
//#region viewer/assets/capsule-order.js
function Mi(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Ni(e, t, n) {
	if (!e) return Mi(null, n);
	try {
		return Mi(JSON.parse(e.getItem(t) ?? "null"), n);
	} catch {
		return Mi(null, n);
	}
}
function Pi(e, t, n) {
	if (!e) return !1;
	try {
		return e.setItem(t, JSON.stringify(n)), !0;
	} catch {
		return !1;
	}
}
function Fi(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/status-order.js
function Ii(e, t, n = (e) => e.status) {
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
function Li(e, t, n = (e) => e.status, r = (e) => e) {
	if (t.length === 0) return [...e];
	let i = [], a = [];
	for (let r of e) (t.includes(n(r)) ? i : a).push(r);
	return [...Ii(r(i), t, n), ...a];
}
//#endregion
//#region viewer/assets/checklist-editor.js
function Ri(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function zi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function Bi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = zi(e);
	}), t;
}
function Vi(e, t) {
	return (e.dependsOn ?? []).some((e) => zi(t.get(e) ?? { checks: [] }) !== "passed");
}
function Hi(e) {
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
		a[zi(e)] += 1;
		let t = Vi(e, n);
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
var Ui = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function Wi(e, t) {
	let { item: n, check: r } = Ri(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? Ui[r.status] ?? "pending" : t.status;
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
	return n.status = zi(n), e;
}
function Gi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status, e.persistedObserved = e.observed ?? null;
	})), t;
}
var Ki = Object.freeze({ status: Object.freeze([
	"pending",
	"passed",
	"failed"
]) });
function qi(e, t) {
	let n = new Set(t ?? []);
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => n.has(e.status))
		})).filter((e) => e.checks.length > 0)
	};
}
function Ji(e, t = []) {
	let n = ji(t).filter((e) => Ki.status.includes(e));
	return n.length === 0 ? e : {
		...e,
		items: Li(e.items, n, zi)
	};
}
function Yi(e) {
	let t = e.items.flatMap((e) => e.checks);
	return Ki.status.map((e) => ({
		id: e,
		count: t.filter((t) => t.status === e).length
	}));
}
function Xi(e, t = {}) {
	let n = e.revision, r = wi(Gi(e), {
		derive: Bi,
		historyLimit: t.historyLimit
	});
	function i() {
		let e = structuredClone(r.derived);
		return Object.freeze({
			document: e,
			summary: Hi(e),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, Wi, t), i();
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
			return n = e.revision, r.commit(Gi(e), { keepHistory: !0 }), i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var Zi = "task-progress.cautious-mode.v1", Qi = "自動儲存模式。", $i = "謹慎模式：修改後需按儲存。", ea = "有尚未儲存的變更。", ta = "即將自動儲存…", na = "正在寫入…", ra = "已儲存。", ia = "已放棄尚未儲存的變更。", aa = "沒有需要儲存的變更。", oa = "儲存失敗。", sa = "已取消儲存；草稿仍保留。", ca = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function la(e = globalThis.localStorage) {
	try {
		return e?.getItem(Zi) === "true";
	} catch {
		return !1;
	}
}
function ua(e, t) {
	let n = t === !0;
	try {
		e?.setItem(Zi, n ? "true" : "false");
	} catch {}
	return n;
}
function da({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, confirmSave: a = null, timers: o = globalThis, onChange: s = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let c = la(n), l = "idle", u = c ? $i : Qi, d = !1, f = null, p = Promise.resolve(), m = 0, h = () => e.snapshot();
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
			n && (v("idle", aa), _());
			return;
		}
		let r = e.prepareSave(), i = Array.isArray(r.errors) ? r.errors : [];
		if (i.length) {
			v("incomplete", i[0].message), _();
			return;
		}
		let { errors: o, ...s } = r;
		if (typeof a == "function" && await a(s, { manual: n }) === !1) {
			v("cancelled", sa), _();
			return;
		}
		d = !1, v("saving", na), _();
		try {
			let n = await t(s);
			e.commit(n), v("saved", ra);
		} catch (e) {
			d = !0, v(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? oa);
		}
		_();
	}
	function x(e = !1) {
		return y(), m += 1, p = p.then(() => b(e)).catch((e) => {
			d = !0, v("error", e?.message ?? oa), _();
		}).finally(() => {
			--m, _();
		}), p;
	}
	async function S() {
		for (let e = 0; e < 8; e += 1) if (f !== null && x(), await p, f === null && m === 0) return;
	}
	function C(e) {
		return c ? (d || v("draft", ea), null) : d ? null : e ? (y(), v("pending", ta), f = o.setTimeout(() => {
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
			if (h().dirty) return v("mode_blocked", ca), _(), g();
			c = !1;
		}
		return ua(n, c), d || v("idle", c ? $i : Qi), _(), g();
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
			return y(), e.discard(), d = !1, v("idle", ia), _(), g();
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
var fa = "task-progress.checklist-filter-order.v1";
function pa({ supportedIds: e, storage: t = globalThis.localStorage ?? null } = {}) {
	let n = Ni(t, fa, e);
	return {
		get order() {
			return n;
		},
		move(e, r, i = !1) {
			let a = Fi(n, e, r, i);
			return a.join("\0") === n.join("\0") ? n : (n = a, Pi(t, fa, n), n);
		}
	};
}
//#endregion
//#region viewer/assets/theme-model.js
var ma = "task-progress.theme.v1", ha = [
	"system",
	"light",
	"dark",
	"custom"
], ga = [
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
], _a = Object.freeze({
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
}), va = Object.freeze({
	version: 1,
	mode: "system"
}), ya = /^#[0-9a-f]{6}$/i;
function ba(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function xa(e) {
	return typeof e == "string" && ya.test(e);
}
function Sa(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = _a[n], i = { base: n };
	for (let e of ga) {
		let n = t[e.key];
		i[e.key] = xa(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Ca(e) {
	if (!ba(e) || e.version !== 1 || !ha.includes(e.mode)) return { ...va };
	let t = {
		version: 1,
		mode: e.mode
	};
	return ba(e.custom) ? t.custom = Sa(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Sa()), t;
}
function wa(e) {
	try {
		let t = e?.getItem(ma);
		return t ? Ca(JSON.parse(t)) : { ...va };
	} catch {
		return { ...va };
	}
}
function Ta(e, t) {
	let n = Ca(t);
	try {
		e?.setItem(ma, JSON.stringify(n));
	} catch {}
	return n;
}
function Ea(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Da(e, t) {
	let n = Ca(t);
	e.dataset.theme = n.mode;
	for (let t of ga) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Sa();
		e.dataset.themeBase = t.base;
		for (let n of ga) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Oa(e, t, n = "light") {
	let r = Ca(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Sa(n)), Ca(i);
}
function ka(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Aa(e, t) {
	if (!xa(e) || !xa(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => ka(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function ja(e) {
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
	].filter(([, e, t]) => Aa(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function Ma({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = wa(t);
	e && Da(e, r);
	function i(n) {
		return r = Ta(t, n), e && Da(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ea(n);
		},
		setMode(e) {
			return i(Oa(r, e, Ea(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Sa(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var Na = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function Pa(e, t) {
	Ue(t, !1);
	let n = $(t, "expanded", 8, !0), r = $(t, "contentId", 8), i = $(t, "label", 8, "卡片"), a = $(t, "onToggle", 8, () => {});
	_i();
	var o = Na(), s = dn(o);
	let c;
	var l = R(s), u = R(l), d = R(u, !0);
	j(u), j(l), Jr(z(l, 2), t, "header", {}, null), j(s);
	var f = z(s, 2);
	Jr(R(f), t, "default", {}, null), j(f), V(() => {
		c = ti(s, 1, "card-disclosure-heading", null, c, { "card-disclosure-collapsed": !n() }), Q(l, "aria-expanded", n()), Q(l, "aria-controls", r()), Q(l, "aria-label", `${n() ? "收合" : "展開"} ${i()}`), Q(l, "title", n() ? "收合" : "展開"), X(d, n() ? "▼" : "▶"), Q(f, "id", r()), Q(f, "hidden", !n());
	}), q("click", l, () => a()(!n())), Y(e, o), We();
}
Cr(["click"]);
//#endregion
//#region viewer/assets/card-order.js
function Fa(e, t, n) {
	return n === "free" ? Ia(e, t) : n === "reverse" ? [...e].reverse() : e;
}
function Ia(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function La(e, t, n, r, i, a) {
	let o = Mi(t, e), s = new Set(n), c = Fi(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var Ra = /* @__PURE__ */ jr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), za = /* @__PURE__ */ jr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), Ba = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!></div>"), Va = /* @__PURE__ */ J("<div class=\"card-list-tools\"><p class=\"section-kicker\">工作項目</p> <button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg></button> <span role=\"status\"> </span></div> <div class=\"arrangeable-cards\"></div>", 1);
function Ha(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = $(t, "items", 24, () => []), i = $(t, "allIds", 24, () => []), a = $(t, "storageKey", 8), o = $(t, "expanded", 8, !0), s = $(t, "onToggleAll", 8, () => {}), c = /* @__PURE__ */ I("forward"), l = [
		"forward",
		"reverse",
		"free"
	], u = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I(null), p = /* @__PURE__ */ I(null), m = /* @__PURE__ */ I(null), h = /* @__PURE__ */ I(null), g = /* @__PURE__ */ I(), _ = /* @__PURE__ */ I("");
	function v(e) {
		if (L(f, null), L(p, null), L(m, null), L(h, null), !e) {
			L(d, null), L(c, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			L(d, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			L(c, l.includes(n) ? n : W(d) ? "free" : "forward");
		} catch {
			L(d, null), L(c, "forward");
		}
	}
	function y(e) {
		if (L(d, e), !a()) {
			L(_, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(a(), JSON.stringify(e)) : localStorage.removeItem(a()), L(_, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			L(_, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function b() {
		if (C(), L(c, l[(l.indexOf(W(c)) + 1) % l.length]), L(_, ""), a()) try {
			localStorage.setItem(`${a()}:mode`, W(c));
		} catch {
			L(_, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function x(e, t, r) {
		W(c) === "free" && e !== t && (y(La(i(), W(d), W(n).map((e) => e.id), e, t, r)), L(f, e), await fr(), [...W(g).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus());
	}
	function S(e, t) {
		let r = W(n).findIndex((t) => t.id === e), i = W(n)[r + t];
		i && x(e, i.id, t > 0);
	}
	function C() {
		L(p, null), L(m, null), L(h, null);
	}
	function w(e, t) {
		if (W(m) === null || W(m) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		L(h, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => K(a()), () => {
		v(a());
	}), B(() => (K(r()), W(d), W(c)), () => {
		L(n, Fa(r(), W(d), W(c)));
	}), En(), _i();
	var T = Va(), ee = dn(T), E = z(R(ee), 2), te = R(E), ne = R(te);
	j(te), j(E);
	var D = z(E, 2), re = R(D), ie = R(re), ae = (e) => {
		Y(e, Ra());
	}, oe = (e) => {
		var t = za(), n = dn(t), r = z(n);
		V(() => {
			Q(n, "d", W(c) === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"), Q(r, "d", W(c) === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10");
		}), Y(e, t);
	};
	Z(ie, (e) => {
		W(c) === "free" ? e(ae) : e(oe, -1);
	}), j(re), j(D);
	var se = z(D, 2), ce = R(se, !0);
	j(se), j(ee);
	var le = z(ee, 2);
	Hr(le, 5, () => W(n), (e) => e.id, (e, n) => {
		var r = Ba();
		let i;
		Jr(R(r), t, "default", { get item() {
			return W(n);
		} }, null), j(r), V(() => {
			i = ti(r, 1, "arrangeable-card", null, i, {
				"card-selected": W(f) === W(n).id,
				"card-drop-before": W(h)?.id === W(n).id && !W(h).after,
				"card-drop-after": W(h)?.id === W(n).id && W(h).after
			}), Q(r, "aria-label", (W(n), W(f), G(() => `${W(n).title}${W(f) === W(n).id ? "，已選取" : ""}`))), Q(r, "data-card-id", (W(n), G(() => W(n).id))), Q(r, "draggable", (W(c), W(p), W(n), G(() => W(c) === "free" && W(p) === W(n).id)));
		}), q("pointerdown", r, (e) => {
			L(p, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (L(f, W(n).id), W(c) === "free" && e.pointerType === "mouse" && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || L(p, W(n).id))));
		}), q("pointerup", r, () => {
			L(p, null);
		}), q("keydown", r, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), L(f, W(n).id)) : e.key === "Escape" && L(f, null), W(c) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), S(W(n).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Sr("dragstart", r, (e) => {
			W(c) === "free" && W(p) === W(n).id && e.target === e.currentTarget && (L(m, W(n).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(n).id)));
		}), Sr("dragend", r, C), Sr("dragover", r, (e) => w(W(n), e)), Sr("dragleave", r, (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(h, null);
		}), Sr("drop", r, (e) => {
			W(m) !== null && W(h)?.id === W(n).id && (e.preventDefault(), x(W(m), W(n).id, W(h).after), C());
		}), Y(e, r);
	}), j(le), gi(le, (e) => L(g, e), () => W(g)), V((e) => {
		Q(E, "aria-label", o() ? "全部收合" : "全部展開"), Q(E, "title", o() ? "全部收合" : "全部展開"), Q(ne, "d", o() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Q(D, "aria-label", e), Q(D, "title", (W(c), G(() => `${u[W(c)]}；點擊切換排序`))), X(ce, W(_));
	}, [() => (W(c), G(() => `排序：${u[W(c)]}；切換為${u[l[(l.indexOf(W(c)) + 1) % l.length]]}`))]), q("click", E, () => s()(!o())), q("click", D, b), Y(e, T), We();
}
Cr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var Ua = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function Wa(e, t) {
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
	_i();
	var _ = Mr(), v = dn(_), y = (e) => {
		var n = Ua(), l = R(n), d = R(l), f = R(d), _ = R(f, !0);
		j(f);
		var v = z(f, 2), y = R(v, !0);
		j(v), j(d);
		var b = z(d, 2);
		j(l), Jr(z(l, 2), t, "default", {}, null), j(n), gi(n, (e) => L(u, e), () => W(u)), Yr(n, (e) => p?.(e)), V(() => {
			ti(n, 1, Qr(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), Sr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), We();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Ga = /* @__PURE__ */ J("<span></span>"), Ka = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), qa = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), Ja = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function Ya(e, t) {
	Ue(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await fr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	B(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), En(), _i();
	var D = Ja();
	Hr(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = qa(), i = R(r), a = R(i, !0);
		j(i);
		var o = z(i, 2), l = (e) => {
			var n = Ga();
			V(() => ti(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			Y(e, Ka());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), j(r), V((e) => {
			ti(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), Sr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), Sr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), Sr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), Sr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), Sr("dragend", r, function(...e) {
			(W(n) ? ee : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => E(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), Sr("pointercancel", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), Y(e, r);
	}), j(D), gi(D, (e) => L(f, e), () => W(f)), V(() => {
		ti(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), Y(e, D), We();
}
Cr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Xa(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e) => {
		let t = p() && e.sortable !== !1;
		return {
			id: e.id,
			label: _(e),
			className: `filter-button${t ? " status-sortable" : ""}`,
			sortable: t,
			pressed: c().has(e.id),
			title: e.title ?? null,
			ariaLabel: e.ariaLabel ?? _(e)
		};
	};
	function y(e) {
		e === "__default__" ? h()() : m()(e);
	}
	B(() => (K(u()), K(p()), K(l())), () => {
		L(n, {
			id: Ti,
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
		L(i, s().length > 0 ? s() : [Ti, ...o().map((e) => e.id)]);
	}), B(() => (W(i), W(n), W(r)), () => {
		L(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e)));
	}), En(), _i(), Ya(e, {
		get items() {
			return W(a);
		},
		get className() {
			return f();
		},
		get ariaLabel() {
			return d();
		},
		onActivate: y,
		get onReorder() {
			return g();
		}
	}), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var Za = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Qa = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function $a(e, t) {
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
	}), En();
	var d = Mr(), f = dn(d), p = (e) => {
		var t = Za(), r = R(t), o = R(r, !0);
		j(r), j(t), V(() => {
			ti(t, 1, `marker-box marker-${a()} marker-box-button`), Q(t, "aria-label", `${W(i)}，點擊切換下一個結果`), X(o, W(n));
		}), q("click", t, function(...e) {
			c()?.apply(this, e);
		}), Y(e, t);
	}, m = (e) => {
		var t = Qa(), r = R(t), o = R(r, !0);
		j(r), j(t), V(() => {
			ti(t, 1, `marker-box marker-${a()}`), Q(t, "aria-label", W(i)), X(o, W(n));
		}), Y(e, t);
	};
	Z(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), Y(e, d), We();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var eo = /* @__PURE__ */ J("<i></i>"), to = /* @__PURE__ */ J("<div role=\"img\"></div>"), no = /* @__PURE__ */ J("<progress max=\"100\"></progress>");
function ro(e, t) {
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
	}), En(), _i();
	var f = Mr(), p = dn(f), m = (e) => {
		var t = to();
		Hr(t, 5, () => W(r), Rr, (e, t) => {
			var n = eo();
			V((e) => ti(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), Y(e, n);
		}), j(t), V(() => {
			ti(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), Y(e, t);
	}, h = (e) => {
		var t = no();
		V(() => {
			ti(t, 1, `progress-meter ${c()}`), di(t, W(n)), Q(t, "aria-label", s());
		}), Y(e, t);
	};
	Z(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), Y(e, f), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var io = /* @__PURE__ */ J("<div><b> </b> <span> </span></div>"), ao = /* @__PURE__ */ J("<div class=\"progress-stats\"></div>"), oo = /* @__PURE__ */ J("<span class=\"progress-note\"> </span>"), so = /* @__PURE__ */ J("<p class=\"progress-caption\"><span> </span> <!></p>"), co = /* @__PURE__ */ J("<section class=\"progress-summary\"><!> <!> <!></section>");
function lo(e, t) {
	Ue(t, !1);
	let n = $(t, "stats", 24, () => []), r = $(t, "bar", 8, null), i = $(t, "caption", 8, ""), a = $(t, "note", 8, ""), o = $(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	_i();
	var l = co(), u = R(l), d = (e) => {
		var t = ao();
		Hr(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = io(), r = R(n), i = R(r, !0);
			j(r);
			var a = z(r, 2), o = R(a, !0);
			j(a), j(n), V((e) => {
				ti(n, 1, e), X(i, (W(t), G(() => W(t).value))), X(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${c(W(t).tone)}`))]), Y(e, n);
		}), j(t), Y(e, t);
	};
	Z(u, (e) => {
		K(n()), G(() => n().length) && e(d);
	});
	var f = z(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (K(r()), G(() => r().cells ?? []))), n = /* @__PURE__ */ P(() => (K(r()), G(() => r().ratio ?? 0))), a = /* @__PURE__ */ P(() => i() || o());
			ro(e, {
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
		var t = so(), n = R(t), r = R(n, !0);
		j(n);
		var o = z(n, 2), s = (e) => {
			var t = oo(), n = R(t, !0);
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
var uo = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), fo = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), po = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function mo(e, t) {
	Ue(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	_i();
	var y = po(), b = dn(y), x = R(b, !0);
	j(b);
	var S = z(b, 2), C = R(S), w = R(C, !0);
	j(C);
	var T = z(C, 2), ee = R(T, !0);
	j(T), j(S);
	var E = z(S, 2), te = (e) => {
		var t = uo(), a = R(t, !0);
		j(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Z(E, (e) => {
		r() && e(te);
	});
	var ne = z(E, 2), D = (e) => {
		var t = fo(), n = dn(t), r = R(n, !0);
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
	Z(ne, (e) => {
		n() && e(D);
	}), V(() => {
		X(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), X(ee, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", T, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), We();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var ho = /* @__PURE__ */ J("<option> </option>"), go = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), _o = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), vo = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function yo(e, t) {
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(Sa(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(ga.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Sa(o().base, o()) : Sa(s())), L(f, !0);
	}
	function S() {
		L(f, !1);
	}
	function C(e) {
		y(Sa(e.currentTarget.value));
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
	function E() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Sa(W(h), W(_))), S();
	}
	B(() => K(a()), () => {
		L(m, a());
	}), B(() => (W(h), W(_)), () => {
		L(n, Sa(W(h), W(_)));
	}), B(() => W(n), () => {
		L(r, ja(W(n)));
	}), B(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), En(), _i();
	var te = vo(), ne = dn(te), D = z(R(ne), 2);
	Hr(D, 5, () => u, (e) => e.value, (e, t) => {
		var n = ho(), r = R(n, !0);
		j(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), j(D), j(ne), Wa(z(ne, 2), {
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
			var a = _o(), o = z(dn(a), 2), s = z(R(o), 2), c = R(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", j(s);
			var u;
			ri(s), j(o);
			var d = z(o, 2);
			Hr(d, 7, () => ga, (e) => e.key, (e, t, r) => {
				var i = go(), a = R(i), o = R(a, !0);
				j(a);
				var s = z(a, 2), c = R(s);
				ui(c);
				var l = z(c, 2);
				ui(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), gi(l, (e, t) => Jt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), j(s), j(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), di(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), di(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
			}), j(d);
			var f = z(d, 2);
			let m;
			var _ = R(f, !0);
			j(f);
			var v = z(f, 2), b = R(v), x = z(b, 4), S = z(x, 2);
			j(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", ni(s, W(h))), m = ti(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(Sa(W(h)))), q("click", x, ee), q("click", S, E), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", D, b), ii(D, () => W(m), (e) => L(m, e)), Y(e, te), We();
}
Cr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var bo = /* @__PURE__ */ J("<details class=\"checklist-round\"><summary>本輪依據</summary><p> </p></details>"), xo = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), So = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), Co = /* @__PURE__ */ J("<a class=\"checklist-next-step\"><span> </span> <strong> </strong></a>"), wo = /* @__PURE__ */ J("<span>請先儲存或捨棄變更，再清空。</span>"), To = /* @__PURE__ */ J("<div class=\"checklist-reset-actions\"><button type=\"button\" class=\"secondary-button\">清空人工結果</button> <!></div>"), Eo = /* @__PURE__ */ J("<p class=\"checklist-chips\"><span class=\"checklist-chip\"> </span></p>"), Do = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), Oo = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), ko = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), Ao = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), jo = /* @__PURE__ */ J("<section tabindex=\"-1\"><div class=\"checklist-check-heading\"><!> <strong> </strong> <span> </span></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), Mo = /* @__PURE__ */ J("<div class=\"checklist-checks\"><p class=\"checklist-outcome\"> </p> <!> <!></div>"), No = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header\"><!> <div><h2> </h2></div> <span class=\"checklist-status\"> </span></header>"), Po = /* @__PURE__ */ J("<article><!></article>"), Fo = /* @__PURE__ */ J("<!> <!> <!> <div class=\"checklist-toolbar\"><!></div> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"><!></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), Io = /* @__PURE__ */ J("<p> </p> <p>此操作無法復原；如需回復，請使用 Git 歷史。</p> <form method=\"dialog\" class=\"theme-dialog-actions\"><button type=\"submit\" class=\"secondary-button\">取消</button> <button type=\"submit\" class=\"primary-button\">確認清空</button></form>", 1), Lo = /* @__PURE__ */ J("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><h1> </h1> <!></div> <!></header> <!></main> <!>", 1);
function Ro(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "transport", 8, null), o = $(t, "onPersistenceChange", 8, () => {}), s = null, c = /* @__PURE__ */ I(null), l = /* @__PURE__ */ I(!0), u = /* @__PURE__ */ I(""), d = /* @__PURE__ */ I("正在載入 Checklist…"), f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I(!1), m = /* @__PURE__ */ I([]);
	function h(e) {
		s = da({
			session: Xi(e),
			save: a().save,
			debounceCommand: (e) => e.type === "set-observed",
			onChange: (e) => {
				L(c, e), L(d, e.message);
			}
		}), L(c, s.snapshot()), L(d, W(c).message);
	}
	function g() {
		W(r) && (L(m, W(n).map((e) => ({ ...e }))), L(f, !0));
	}
	async function _() {
		if (!W(r) || W(p)) return;
		L(p, !0);
		let e = W(c).cautious;
		L(d, "正在清空人工結果…");
		try {
			h(await a().reset({ targets: W(m) })), L(c, await s.setCautious(e)), L(d, "人工結果已清空；Agent 結果保留。");
		} catch (e) {
			L(d, e instanceof Error ? e.message : "清空失敗，請重新載入確認結果。");
		} finally {
			L(p, !1);
		}
	}
	let v = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, y = [
		"pending",
		"passed",
		"failed"
	], b = /* @__PURE__ */ I(Di(y)), x = pa({ supportedIds: [Ti, ...y] }), S = /* @__PURE__ */ I(x.order);
	function C(e) {
		L(b, ki(W(b), e));
	}
	function w() {
		L(b, Ai(W(b)));
	}
	function T(e, t, n) {
		L(S, [...x.move(e, t, n)]);
	}
	function ee(e, t) {
		let n = new Map(Yi(e).map((e) => [e.id, e.count]));
		return t.filter((e) => y.includes(e)).map((e) => ({
			id: e,
			label: v[e] ?? e,
			count: n.get(e) ?? 0,
			title: "拖曳可調整順序；排在「預設」左邊的標籤會分組到最前面"
		}));
	}
	let E = /* @__PURE__ */ I(!0), te = /* @__PURE__ */ I({});
	function ne(e) {
		let t = xi(e);
		L(E, t.expanded), L(te, t.overrides);
	}
	function D(e, t) {
		L(te, {
			...W(te),
			[e]: t
		}), Si(W(i), W(E), W(te));
	}
	function re(e) {
		L(E, e), L(te, {}), Si(W(i), W(E), W(te));
	}
	async function ie(e) {
		e.preventDefault();
		let t = W(c).summary.nextStep;
		if (!t) return;
		D(t.workItemId, !0), L(b, Di(y)), await fr();
		let n = document.getElementById(`check-${t.workItemId}-${t.checkIndex}`);
		n?.focus({ preventScroll: !0 }), n?.scrollIntoView({ block: "start" });
	}
	let ae = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), oe = (e) => e === "saving" ? "saving" : ae.has(e) ? "error" : "clean", se = /* @__PURE__ */ I(null), ce = /* @__PURE__ */ I({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function le() {
		L(ce, {
			mode: W(se).mode,
			custom: W(se).custom,
			systemScheme: W(se).systemScheme
		});
	}
	yi(async () => {
		L(se, Ma()), le();
		try {
			if (!a()) throw Error("Checklist 介面需要由 host 提供 transport。");
			h(await a().load());
		} catch (e) {
			L(u, e instanceof Error ? e.message : "Checklist 載入失敗。"), L(d, W(u));
		} finally {
			L(l, !1);
		}
	});
	function ue(e) {
		if (!W(p)) try {
			s.dispatch(e), L(c, s.snapshot()), L(d, W(c).message);
		} catch (e) {
			L(d, e.message);
		}
	}
	function de(e, t) {
		ue({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function pe() {
		W(p) || (s.undo(), L(c, s.snapshot()));
	}
	function me() {
		W(p) || (s.redo(), L(c, s.snapshot()));
	}
	function he() {
		W(p) || L(c, s.discard());
	}
	async function ge() {
		W(p) || (await s.save(), L(c, s.snapshot()));
	}
	async function _e(e) {
		W(p) || L(c, await s.setCautious(e));
	}
	B(() => W(c), () => {
		L(n, W(c)?.document.items.flatMap((e) => e.checks.filter((e) => e.isManual).map((t) => ({
			workItemId: e.id,
			checkIndex: t.index
		}))) ?? []);
	}), B(() => (W(c), W(p), W(n)), () => {
		L(r, !!W(c) && !W(c).dirty && !W(c).saving && !W(c).pending && !W(c).blocked && !W(p) && W(n).length > 0);
	}), B(() => (K(o()), W(c), W(f), W(p)), () => {
		o()(W(c) ? {
			...W(c),
			pending: W(c).pending || W(f) || W(p)
		} : W(c));
	}), B(() => W(c), () => {
		L(i, W(c)?.document ? `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${W(c).document.fileName}:${W(c).document.roundIdentity}` : null);
	}), B(() => W(i), () => {
		W(i) && ne(W(i));
	}), En(), _i();
	var ve = Lo(), ye = dn(ve), be = R(ye), xe = R(be), Se = R(xe), Ce = R(Se, !0);
	j(Se);
	var we = z(Se, 2), Te = (e) => {
		var t = bo(), n = z(R(t)), r = R(n, !0);
		j(n), j(t), V(() => X(r, (W(c), G(() => W(c).document.roundIdentity)))), Y(e, t);
	};
	Z(we, (e) => {
		W(c) && e(Te);
	}), j(xe);
	var O = z(xe, 2), Ee = (e) => {
		yo(e, {
			get mode() {
				return W(ce), G(() => W(ce).mode);
			},
			get custom() {
				return W(ce), G(() => W(ce).custom);
			},
			get systemScheme() {
				return W(ce), G(() => W(ce).systemScheme);
			},
			onModeChange: (e) => {
				W(se).setMode(e), le();
			},
			onApplyCustom: (e) => {
				W(se).applyCustom(e), le();
			}
		});
	};
	Z(O, (e) => {
		W(se) && e(Ee);
	}), j(be);
	var De = z(be, 2), Oe = (e) => {
		var t = xo(), n = R(t, !0);
		j(t), V(() => X(n, W(d))), Y(e, t);
	}, ke = (e) => {
		var t = So(), n = R(t, !0);
		j(t), V(() => X(n, W(u))), Y(e, t);
	}, Ae = (e) => {
		var t = Fo(), n = dn(t);
		{
			let e = /* @__PURE__ */ P(() => (W(c), G(() => ({
				form: "segmented",
				cells: W(c).summary.cells
			})))), t = /* @__PURE__ */ P(() => (W(c), G(() => `${W(c).summary.checks.passed} / ${W(c).summary.checks.total} checks 通過`))), r = /* @__PURE__ */ P(() => (W(c), G(() => W(c).summary.checks.failed > 0 ? `${W(c).summary.checks.failed} 個失敗` : "")));
			lo(n, {
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
			var t = Co(), n = R(t), r = R(n);
			j(n);
			var i = z(n, 2), a = R(i, !0);
			j(i), j(t), V(() => {
				Q(t, "href", (W(c), G(() => `#check-${W(c).summary.nextStep.workItemId}-${W(c).summary.nextStep.checkIndex}`))), Q(t, "title", (W(c), G(() => W(c).summary.nextStep.title))), X(r, `${W(c), G(() => W(c).summary.nextStep.isManual ? "需人工驗證" : "下一步 · Agent") ?? ""}：`), X(a, (W(c), G(() => W(c).summary.nextStep.title)));
			}), q("click", t, ie), Y(e, t);
		};
		Z(i, (e) => {
			W(c), G(() => W(c).summary.nextStep) && e(o);
		});
		var s = z(i, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(c), W(S), G(() => ee(W(c).document, W(S))))), t = /* @__PURE__ */ P(() => (K(Oi), W(b), G(() => Oi(W(b)))));
			Xa(s, {
				get categories() {
					return W(e);
				},
				get order() {
					return W(S);
				},
				get selected() {
					return W(b), G(() => W(b).selected);
				},
				get defaultLit() {
					return W(t);
				},
				className: "status-filter-strip status-summary-filters",
				ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
				reorderable: !0,
				onSelect: C,
				onSelectDefault: w,
				onReorder: T
			});
		}
		var l = z(s, 2), u = R(l), f = (e) => {
			var t = To(), n = R(t), i = z(n, 2), a = (e) => {
				Y(e, wo());
			};
			Z(i, (e) => {
				W(c), G(() => W(c).dirty || W(c).pending || W(c).saving) && e(a);
			}), j(t), V(() => n.disabled = !W(r)), q("click", n, g), Y(e, t);
		};
		Z(u, (e) => {
			K(a()), G(() => typeof a()?.reset == "function") && e(f);
		}), j(l);
		var m = z(l, 2), h = R(m);
		{
			let e = /* @__PURE__ */ P(() => (K(qi), K(Ji), W(c), W(S), W(b), G(() => qi(Ji(W(c).document, W(S)), W(b).selected).items))), t = /* @__PURE__ */ P(() => (K(Ji), W(c), W(S), G(() => Ji(W(c).document, W(S)).items.map((e) => e.id)))), n = /* @__PURE__ */ P(() => (W(c), G(() => new URLSearchParams(location.search).has("scope") ? `taskprogress.cards.checklist.v1:${location.pathname}:${new URLSearchParams(location.search).get("scope")}:${new URLSearchParams(location.search).get("task")}:${W(c).document.roundIdentity}` : null)));
			Ha(h, {
				get expanded() {
					return W(E);
				},
				onToggleAll: re,
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
				$$slots: { default: (e, t) => {
					let n = /* @__PURE__ */ P(() => t.item), r = /* @__PURE__ */ P(() => (W(c), K(W(n)), G(() => W(c).document.items.find((e) => e.id === W(n).id))));
					var i = Po(), a = R(i);
					{
						let e = /* @__PURE__ */ P(() => (W(te), K(W(n)), W(E), G(() => W(te)[W(n).id] ?? W(E)))), t = /* @__PURE__ */ P(() => (K(W(n)), G(() => `checklist-body-${W(n).id}`)));
						Pa(a, {
							get expanded() {
								return W(e);
							},
							onToggle: (e) => D(W(n).id, e),
							get contentId() {
								return W(t);
							},
							get label() {
								return K(W(n)), G(() => W(n).title);
							},
							children: (e, t) => {
								var r = Mo(), i = R(r), a = R(i, !0);
								j(i);
								var o = z(i, 2), s = (e) => {
									var t = Eo(), r = R(t), i = R(r);
									j(r), j(t), V((e) => X(i, `Depends on ${e ?? ""}`), [() => (K(W(n)), G(() => W(n).dependsOn.join(", ")))]), Y(e, t);
								};
								Z(o, (e) => {
									K(W(n)), G(() => W(n).dependsOn.length) && e(s);
								}), Hr(z(o, 2), 1, () => (K(W(n)), G(() => W(n).checks)), (e) => e.index, (e, t) => {
									var r = jo(), i = R(r), a = R(i);
									{
										let e = /* @__PURE__ */ P(() => (W(t), W(p), G(() => W(t).isManual && !W(p))));
										$a(a, {
											get status() {
												return W(t), G(() => W(t).status);
											},
											get interactive() {
												return W(e);
											},
											get label() {
												return W(t), G(() => W(t).title);
											},
											onCycle: () => de(W(n).id, W(t))
										});
									}
									var o = z(a, 2), s = R(o, !0);
									j(o);
									var c = z(o, 2), l = R(c, !0);
									j(c), j(i);
									var u = z(i, 2), d = R(u), f = z(R(d)), m = R(f, !0);
									j(f), j(d);
									var h = z(d, 2), g = z(R(h)), _ = R(g, !0);
									j(g), j(h);
									var v = z(h, 2), y = (e) => {
										var n = Do(), r = z(R(n)), i = R(r, !0);
										j(r), j(n), V(() => X(i, (W(t), G(() => W(t).reason)))), Y(e, n);
									};
									Z(v, (e) => {
										W(t), G(() => W(t).reason) && e(y);
									});
									var b = z(v, 2), x = (e) => {
										var n = Oo(), r = z(R(n)), i = R(r, !0);
										j(r), j(n), V(() => X(i, (W(t), G(() => W(t).observed)))), Y(e, n);
									};
									Z(b, (e) => {
										W(t), G(() => W(t).observed && !(W(t).isManual && W(t).status === "failed")) && e(x);
									});
									var S = z(b, 2), C = (e) => {
										var n = ko(), r = z(R(n)), i = R(r, !0);
										j(r), j(n), V(() => X(i, (W(t), G(() => W(t).resolved)))), Y(e, n);
									};
									Z(S, (e) => {
										W(t), G(() => W(t).resolved) && e(C);
									}), j(u);
									var w = z(u, 2), T = (e) => {
										var r = Ao(), i = z(R(r), 2);
										it(i), j(r), V(() => {
											i.disabled = W(p), di(i, (W(t), G(() => W(t).observed ?? "")));
										}), q("input", i, (e) => ue({
											type: "set-observed",
											workItemId: W(n).id,
											checkIndex: W(t).index,
											value: e.currentTarget.value
										})), Y(e, r);
									};
									Z(w, (e) => {
										W(t), G(() => W(t).isManual && W(t).status === "failed") && e(T);
									}), j(r), V(() => {
										Q(r, "id", (K(W(n)), W(t), G(() => `check-${W(n).id}-${W(t).index}`))), ti(r, 1, (W(t), G(() => `checklist-check checklist-${W(t).status}${W(t).isManual ? " checklist-manual" : ""}`))), X(s, (W(t), G(() => W(t).title))), ti(c, 1, (W(t), G(() => `checklist-owner${W(t).isManual ? " checklist-owner-manual" : ""}`))), X(l, (W(t), G(() => W(t).isManual ? "manual" : "Agent"))), X(m, (W(t), G(() => W(t).action))), X(_, (W(t), G(() => W(t).expect)));
									}), Y(e, r);
								}), j(r), V(() => X(a, (K(W(n)), G(() => W(n).outcome)))), Y(e, r);
							},
							$$slots: {
								default: !0,
								header: (e, t) => {
									var i = No(), a = R(i);
									{
										let e = /* @__PURE__ */ P(() => (K(W(n)), G(() => `工作項目 ${W(n).id}`)));
										$a(a, {
											get status() {
												return K(W(n)), G(() => W(n).status);
											},
											get label() {
												return W(e);
											}
										});
									}
									var o = z(a, 2), s = R(o), c = R(s);
									j(s), j(o);
									var l = z(o, 2), u = R(l);
									j(l), j(i), V((e, t) => {
										X(c, `${K(W(n)), G(() => W(n).id) ?? ""}. ${K(W(n)), G(() => W(n).title) ?? ""}`), Q(l, "aria-label", e), X(u, `${t ?? ""}/${K(W(r)), G(() => W(r).checks.length) ?? ""}`);
									}, [() => (K(W(r)), G(() => `通過 ${W(r).checks.filter((e) => e.status === "passed").length}，共 ${W(r).checks.length}`)), () => (K(W(r)), G(() => W(r).checks.filter((e) => e.status === "passed").length))]), Y(e, i);
								}
							}
						});
					}
					j(i), V(() => ti(i, 1, (K(W(n)), G(() => `checklist-item checklist-${W(n).status}`)))), Y(e, i);
				} }
			});
		}
		j(m);
		var _ = z(m, 2), v = R(_);
		{
			let e = /* @__PURE__ */ P(() => (W(c), W(p), G(() => W(c).saving || W(p))));
			mo(v, {
				get cautious() {
					return W(c), G(() => W(c).cautious);
				},
				onToggleCautious: _e,
				get dirty() {
					return W(c), G(() => W(c).dirty);
				},
				get saving() {
					return W(e);
				},
				get canUndo() {
					return W(c), G(() => W(c).history.canUndo);
				},
				get canRedo() {
					return W(c), G(() => W(c).history.canRedo);
				},
				get message() {
					return W(d);
				},
				onSave: ge,
				onUndo: pe,
				onRedo: me,
				onDiscard: he
			});
		}
		j(_), V((e) => {
			Q(_, "data-state", e), Q(_, "aria-busy", (W(c), W(p), G(() => W(c).saving || W(p))));
		}, [() => (W(c), G(() => oe(W(c).status)))]), Y(e, t);
	};
	Z(De, (e) => {
		W(l) ? e(Oe) : W(c) ? e(Ae, -1) : e(ke, 1);
	}), j(ye), Wa(z(ye, 2), {
		get open() {
			return W(f);
		},
		title: "清空人工結果？",
		titleId: "checklist-reset-title",
		kicker: "Checklist",
		onClose: () => {
			L(f, !1);
		},
		children: (e, t) => {
			var n = Io(), r = dn(n), i = R(r);
			j(r);
			var a = z(r, 4), o = z(R(a), 2);
			j(a), V(() => {
				X(i, `將 ${W(m), G(() => W(m).length) ?? ""} 個人工檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。Agent 結果不受影響。`), o.disabled = W(p);
			}), q("click", o, _), Y(e, n);
		},
		$$slots: { default: !0 }
	}), V(() => X(Ce, (W(c), G(() => W(c)?.document.fileName ?? "TaskProgress Checklist")))), Y(e, ve), We();
}
Cr(["click", "input"]);
//#endregion
//#region viewer/assets/checklist-http-transport.js
var zo = 1, Bo = /* @__PURE__ */ new Set([
	"load",
	"save",
	"reset"
]);
function Vo({ scope: e, task: t, fetchImpl: n = globalThis.fetch, apiRoot: r = "/__taskprogress/v1" } = {}) {
	if (typeof e != "string" || !e) throw TypeError("Checklist HTTP transport 需要 scope。");
	if (typeof t != "string" || !t) throw TypeError("Checklist HTTP transport 需要 task。");
	if (typeof n != "function") throw TypeError("Checklist HTTP transport 需要 fetch。");
	let i = 0;
	async function a(a, o) {
		if (!Bo.has(a)) throw Error(`不支援的 Checklist request：${a}`);
		let s = {
			version: zo,
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
		load: () => a("load"),
		save: (e) => a("save", e),
		reset: (e = {}) => a("reset", e)
	});
}
//#endregion
//#region viewer/assets/foreground-refresh.js
function Ho(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function Uo({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (Ho(e, "windowTarget"), Ho(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
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
//#region experiments/editor-svelte-spike/src/checklist-browser-main.js
function Wo() {
	try {
		let e = new URLSearchParams(location.search);
		return Vo({
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
var Go = null;
Uo({ canRefresh: () => !Go?.dirty && !Go?.saving && !Go?.pending }), Nr(Ro, {
	target: document.querySelector("#app"),
	props: {
		transport: Wo(),
		onPersistenceChange: (e) => {
			Go = e;
		}
	}
});
//#endregion
