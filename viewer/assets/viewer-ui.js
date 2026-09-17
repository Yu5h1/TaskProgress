import { registerUiAdapter as e } from "./ui-host.js";
//#region node_modules/svelte/src/constants.js
var t = {}, n = Symbol("uninitialized"), r = "http://www.w3.org/1999/xhtml", i = "http://www.w3.org/2000/svg", a = Array.isArray, o = Array.prototype.indexOf, s = Array.prototype.includes, c = Array.from, l = Object.defineProperty, u = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyDescriptors, f = Object.prototype, p = Array.prototype, m = Object.getPrototypeOf, h = Object.isExtensible, g = () => {};
function _(e) {
	return e();
}
function v(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function y() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var b = 1024, x = 2048, S = 4096, C = 8192, w = 16384, T = 32768, ee = 1 << 25, E = 65536, te = 1 << 19, ne = 1 << 20, D = 1 << 25, re = 65536, ie = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function _e() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function ve(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function ye() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function be(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function xe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Se() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ce(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function we() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Te(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ee() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function De() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ae() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function je(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Me() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ne() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var O = !1;
function Pe(e) {
	O = e;
}
var k;
function Fe(e) {
	if (e === null) throw je(), t;
	return k = e;
}
function Ie() {
	return Fe(/* @__PURE__ */ hn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ hn(k) !== null) throw je(), t;
		k = e;
	}
}
function Le(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ hn(n);
		k = n;
	}
}
function Re(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ hn(n);
		e && n.remove(), n = i;
	}
}
function ze(e) {
	if (!e || e.nodeType !== 8) throw je(), t;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Be(e) {
	return e === this.v;
}
function Ve(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function He(e) {
	return !Ve(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Ue = !1;
function We() {
	Ue = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var j = null;
function Ge(e) {
	j = e;
}
function Ke(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: Ue && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function qe(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function Je() {
	return !Ue || j !== null && j.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], v(e);
}
function Ze(e) {
	if (Ye.length === 0 && !Pt) {
		var t = Ye;
		queueMicrotask(() => {
			t === Ye && Xe();
		});
	}
	Ye.push(e);
}
function Qe() {
	for (; Ye.length > 0;) Xe();
}
function $e(e) {
	var t = V;
	if (t === null) return B.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	et(e, t);
}
function et(e, t) {
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
var tt = ~(x | S | b);
function nt(e, t) {
	e.f = e.f & tt | t;
}
function rt(e) {
	e.f & 512 || e.deps === null ? nt(e, b) : nt(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function it(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= re, it(t.deps));
}
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), it(e.deps), nt(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ot = !1;
function st(e) {
	var t = ot;
	try {
		return ot = !1, [e(), ot];
	} finally {
		ot = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function ct(e) {
	O && /* @__PURE__ */ mn(e) !== null && gn(e);
}
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = B, n = V;
	Zn(null), Qn(null);
	try {
		return e();
	} finally {
		Zn(t), Qn(n);
	}
}
function ft(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function pt(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Cn() && (H(n), Mn(() => (t === 0 && (r = U(() => e(() => nn(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var mt = E | te;
function ht(e, t, n, r) {
	new gt(e, t, n, r);
}
var gt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = O ? k : null;
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
	#h = pt(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Nn(() => {
			if (O) {
				let e = this.#t;
				Ie();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, mt), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = Pn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = Pn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ne();
				return;
			}
			t = !0, n && ke(), this.#s !== null && Vn(this.#s, () => {
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
					et(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Pn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = pn();
			e.append(t), this.#a = this.#S(() => Pn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Vn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Pn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Gn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Pn(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		at(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = j;
		Qn(this.#i), Zn(this.#i), Ge(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} catch (e) {
			return $e(e), null;
		} finally {
			Qn(t), Zn(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Vn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && en(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), H(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Rn(this.#a), null), this.#o &&= (Rn(this.#o), null), this.#s &&= (Rn(this.#s), null), O && (Fe(this.#t), Le(), Fe(Re()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Pn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return et(e, this.#i.parent), null;
				}
			}));
		};
		Ze(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				et(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => et(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function _t(e, t, n, r) {
	let i = Je() ? xt : wt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				et(e, s);
			}
			yt();
		}
	}
	var d = bt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Ct(e))).then(u).catch((e) => et(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), yt();
	}) : f();
}
function vt() {
	var e = V, t = B, n = j, r = M;
	return function(i = !0) {
		Qn(e), Zn(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	Qn(null), Zn(null), Ge(null), e && M?.deactivate();
}
function bt() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var t = 2 | x;
	return V !== null && (V.f |= te), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Be,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: n,
		wv: 0,
		parent: V,
		ac: null
	};
}
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, t, r) {
	let i = V;
	i === null && ye();
	var a = void 0, o = Zt(n), s = !B, c = /* @__PURE__ */ new Set();
	return jn(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= oe, en(o, t)) : (o.f & 8388608 && (o.f ^= oe), en(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), wn(() => {
		for (let e of c) e.reject(St);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function wt(e) {
	let t = /* @__PURE__ */ xt(e);
	return t.equals = He, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Rn(t[n]);
	}
}
function Et(e) {
	var t, r = V, i = e.parent;
	if (!Jn && i !== null && e.v !== n && i.f & 24576) return Ae(), e.v;
	Qn(i);
	try {
		e.f &= ~re, Tt(e), t = fr(e);
	} finally {
		Qn(r);
	}
	return t;
}
function Dt(e) {
	var t = Et(e);
	if (!e.equals(t) && (e.wv = lr(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null))) {
		nt(e, b);
		return;
	}
	Jn || (Mt === null ? rt(e) : (Cn() || M?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = g), mr(t, 0), In(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && hr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, M = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
	id = zt++;
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
		At === null ? At = this : (At.#n = this, this.#t = At), At = this;
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
			for (var r of n.d) nt(r, x), t(r);
			for (r of n.m) nt(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Rt++ > 1e3 && (this.#x(), Ht());
		for (let e of this.#u) this.#d.delete(e), nt(e, x), this.schedule(e);
		for (let e of this.#d) nt(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = It = [], r = [], i = Lt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw qt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (It = null, Lt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Kt(e, t);
			i.length > 0 && M.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), jt = this, Wt(r), Wt(n), jt = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= b;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= b : i & 4 ? t.push(r) : ur(r) && (i & 16 && this.#d.add(r), hr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), nt(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Mt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, M = this, this.#g();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, M = null, Mt = null, Yt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(St);
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
		this.#m || (this.#m = !0, Ze(() => {
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
		return (this.#s ??= y()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!Ft && !Pt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		Mt = null;
	}
	schedule(e) {
		if (Nt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (It !== null && t === V && (B === null || !(B.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= b;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? At = e : t.#t = e, this.linked = !1;
		}
	}
};
function Vt(e) {
	var t = Pt;
	Pt = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (Qe(), M === null) return n;
			M.flush();
		}
	} finally {
		Pt = t;
	}
}
function Ht() {
	try {
		we();
	} catch (e) {
		et(e, Nt);
	}
}
var Ut = null;
function Wt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ur(r) && (Ut = /* @__PURE__ */ new Set(), hr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Bn(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || hr(n);
					}
				}
				Ut.clear();
			}
		}
		Ut = null;
	}
}
function Gt(e) {
	M.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), nt(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	nt(e, b);
	for (var t = e.first; t !== null;) qt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Jt = /* @__PURE__ */ new Set(), Yt = /* @__PURE__ */ new Map(), Xt = !1;
function Zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Be,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e, t) {
	let n = Zt(e, t);
	return er(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = He), Ue && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function $t(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!Xn || B.f & 131072) && Je() && B.f & 4325394 && ($n === null || !$n.has(e)) && Oe(), en(e, n ? an(t) : t, Lt);
}
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Yt.set(e, Jn ? t : e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && rt(t);
		}
		e.wv = lr(), rn(e, x, n), Je() && V !== null && V.f & 1024 && !(V.f & 96) && (rr === null ? ir([e]) : rr.push(e)), !r.is_fork && Jt.size > 0 && !Xt && tn();
	}
	return t;
}
function tn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && nt(e, S);
		let t;
		try {
			t = ur(e);
		} catch {
			t = !0;
		}
		t && hr(e);
	}
	Jt.clear();
}
function nn(e) {
	P(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && nt(s, t), c & 131072) Jt.add(s);
			else if (c & 2) {
				var u = s;
				Mt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= re), rn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Ut !== null && Ut.add(d), n === null ? Gt(d) : n.push(d);
			}
		}
	}
}
function an(e) {
	if (typeof e != "object" || !e || se in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Qt(0), s = null, c = sr, l = (e) => {
		if (sr === c) return e();
		var t = B, n = sr;
		Zn(null), cr(c);
		var r = e();
		return Zn(t), cr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Qt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ee();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Qt(n.value, s);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Qt(n, s));
					r.set(t, e), nn(o);
				}
			} else P(i, n), nn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === se) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Qt(an(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = H(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			var i = Reflect.getOwnPropertyDescriptor(e, t);
			if (i && "value" in i) {
				var a = r.get(t);
				a && (i.value = H(a));
			} else if (i === void 0) {
				var o = r.get(t), s = o?.v;
				if (o !== void 0 && s !== n) return {
					enumerable: !0,
					configurable: !0,
					value: s,
					writable: !0
				};
			}
			return i;
		},
		has(e, t) {
			if (t === se) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Qt(a ? an(e[t]) : n, s)), r.set(t, i)), H(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Qt(n, s)), r.set(p + "", m)) : P(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Qt(void 0, s)), P(d, an(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => an(a));
				P(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				nn(o);
			}
			return !0;
		},
		ownKeys(e) {
			H(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== n;
			});
			for (var [i, a] of r) a.v !== n && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			De();
		}
	});
}
function on(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
	} catch {}
	return e;
}
function sn(e, t) {
	return Object.is(on(e), on(t));
}
var cn, ln, un, dn;
function fn() {
	if (cn === void 0) {
		cn = window, ln = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		un = u(t, "firstChild").get, dn = u(t, "nextSibling").get, h(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), h(n) && (n[pe] = void 0);
	}
}
function pn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function mn(e) {
	return un.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function hn(e) {
	return dn.call(e);
}
function F(e, t) {
	if (!O) return /* @__PURE__ */ mn(e);
	var n = /* @__PURE__ */ mn(k);
	if (n === null) n = k.appendChild(pn());
	else if (t && n.nodeType !== 3) {
		var r = pn();
		return n?.before(r), Fe(r), r;
	}
	return t && yn(n), Fe(n), n;
}
function I(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ mn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = pn();
			return k?.before(r), Fe(r), r;
		}
		yn(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ hn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = pn();
			return r === null ? i?.after(a) : r.before(a), Fe(a), a;
		}
		yn(r);
	}
	return Fe(r), r;
}
function gn(e) {
	e.textContent = "";
}
function _n() {
	return !1;
}
function vn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function yn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function bn(e) {
	V === null && (B === null && Ce(e), Se()), Jn && xe(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: j,
		deps: null,
		nodes: null,
		f: e | x | 512,
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
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			hr(r);
		} catch (e) {
			throw Rn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= E));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return B !== null && !Xn;
}
function wn(e) {
	let t = Sn(8, null);
	return nt(t, b), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | ne, e);
}
function Dn(e) {
	return bn("$effect.pre"), Sn(8 | ne, e);
}
function On(e) {
	Bt.ensure();
	let t = Sn(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Vn(t, () => {
			Rn(t), n(void 0);
		}) : (Rn(t), n(void 0));
	});
}
function kn(e) {
	return Sn(4, e);
}
function R(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Mn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Qn(n.parent), U(t);
			} finally {
				Qn(n);
			}
		}
	});
}
function An() {
	var e = j;
	Mn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && nt(n, S), ur(n) && hr(n), t.ran = !1;
		}
	});
}
function jn(e) {
	return Sn(ae | te, e);
}
function Mn(e, t = 0) {
	return Sn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(H));
		});
	});
}
function Nn(e, t = 0) {
	return Sn(16 | t, e);
}
function Pn(e) {
	return Sn(32 | te, e);
}
function Fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Jn, n = B;
		Yn(!0), Zn(null);
		try {
			t.call(null);
		} finally {
			Yn(e), Zn(n);
		}
	}
}
function In(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dt(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Rn(n, t), n = r;
	}
}
function Ln(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Rn(t), t = n;
	}
}
function Rn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (zn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, In(e, t && !n), mr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Fn(e), e.f ^= ee, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && Bn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function zn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ hn(e);
		e.remove(), e = n;
	}
}
function Bn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Vn(e, t, n = !0) {
	var r = [];
	Hn(e, r, !0);
	var i = () => {
		n && Rn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Hn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Hn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Un(e) {
	Wn(e, !0);
}
function Wn(e, t) {
	if (e.f & 8192) {
		e.f ^= C, e.f & 1024 || (nt(e, x), Bt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Wn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Gn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ hn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Kn = null, qn = !1, Jn = !1;
function Yn(e) {
	Jn = e;
}
var B = null, Xn = !1;
function Zn(e) {
	B = e;
}
var V = null;
function Qn(e) {
	V = e;
}
var $n = null;
function er(e) {
	B !== null && ($n ??= /* @__PURE__ */ new Set()).add(e);
}
var tr = null, nr = 0, rr = null;
function ir(e) {
	rr = e;
}
var ar = 1, or = 0, sr = or;
function cr(e) {
	sr = e;
}
function lr() {
	return ++ar;
}
function ur(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ur(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && nt(e, b);
	}
	return !1;
}
function dr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !($n !== null && $n.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? dr(a, t, !1) : t === a && (n ? nt(a, x) : a.f & 1024 && nt(a, S), Gt(a));
	}
}
function fr(e) {
	var t = tr, n = nr, r = rr, i = B, a = $n, o = j, s = Xn, c = sr, l = e.f;
	tr = null, nr = 0, rr = null, B = l & 96 ? null : e, $n = null, Ge(e.ctx), Xn = !1, sr = ++or, e.ac !== null && (dt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= T;
		var f = e.deps, p = M?.is_fork;
		if (tr !== null) {
			var m;
			if (p || mr(e, nr), f !== null && nr > 0) for (f.length = nr + tr.length, m = 0; m < tr.length; m++) f[nr + m] = tr[m];
			else e.deps = f = tr;
			if (Cn() && e.f & 512) for (m = nr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && nr < f.length && (mr(e, nr), f.length = nr);
		if (Je() && rr !== null && !Xn && f !== null && !(e.f & 6146)) for (m = 0; m < rr.length; m++) dr(rr[m], e);
		if (i !== null && i !== e) {
			if (or++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = or;
			if (t !== null) for (let e of t) e.rv = or;
			rr !== null && (r === null ? r = rr : r.push(...rr));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (e) {
		return $e(e);
	} finally {
		e.f ^= ie, tr = t, nr = n, rr = r, B = i, $n = a, Ge(o), Xn = s, sr = c;
	}
}
function pr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (tr === null || !s.call(tr, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~re), c.v !== n && rt(c), c.ac !== null && dt(() => {
			c.ac.abort(he), c.ac = null, nt(c, x);
		}), Ot(c), mr(c, 0);
	}
}
function mr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) pr(e, n[r]);
}
function hr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		nt(e, b);
		var n = V, r = qn;
		V = e, qn = !(t & 96);
		try {
			t & 16777232 ? Ln(e) : In(e), Fn(e);
			var i = fr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ar;
		} finally {
			qn = r, V = n;
		}
	}
}
async function gr() {
	await Promise.resolve(), Vt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Kn?.add(e), B !== null && !Xn && !(V !== null && V.f & 16384) && ($n === null || !$n.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < or && (e.rv = or, tr === null && n !== null && n[nr] === e ? nr++ : tr === null ? tr = [e] : tr.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Jn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Jn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || vr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Xn && B !== null && (qn || !!(B.f & 512)), c = (i.f & T) === 0;
		ur(i) && (o && (i.f |= 512), Dt(i)), o && !c && (kt(i), _r(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function _r(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (kt(t), _r(t));
}
function vr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && vr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Xn;
	try {
		return Xn = !0, e();
	} finally {
		Xn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) yr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && yr(n);
		}
	}
}
function yr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			yr(e[n], t);
		} catch {}
		let n = m(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = d(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return dt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ze(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && wn(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Er = null;
function Dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Er = e;
	var o = 0, s = Er === e && e[br];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[br] = t;
			return;
		}
		var u = i.indexOf(t);
		if (u === -1) return;
		c <= u && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		l(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var d = B, f = V;
		Zn(null), Qn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[br]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[br] = t, delete e.currentTarget, Zn(d), Qn(f);
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
	var t = vn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function K(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (O) return jr(k, null), k;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ mn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ mn(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Mr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return jr(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ mn(Ar(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ mn(e);) o.appendChild(/* @__PURE__ */ mn(e));
			else o = /* @__PURE__ */ mn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ mn(t), r = t.lastChild;
			jr(n, r);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t) {
	return /* @__PURE__ */ Mr(e, t, "svg");
}
function Pr(e = "") {
	if (!O) {
		var t = pn(e + "");
		return jr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? yn(n) : (n.before(n = pn()), Fe(n)), jr(n, n), n;
}
function Fr() {
	if (O) return jr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = pn();
	return e.append(t, n), jr(t, n), e;
}
function q(e, t) {
	if (O) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Ie();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Ir = ["touchstart", "touchmove"];
function Lr(e) {
	return Ir.includes(e);
}
var Rr = [
	"textarea",
	"script",
	"style",
	"title"
];
function zr(e) {
	return Rr.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Br(e, t) {
	return Hr(e, t);
}
var Vr = /* @__PURE__ */ new Map();
function Hr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	fn();
	var u = void 0, d = On(() => {
		var s = r ?? n.appendChild(pn());
		ht(s, { pending: () => {} }, (n) => {
			Ke({});
			var r = j;
			if (o && (r.c = o), a && (i.$$events = a), O && jr(n, null), u = e(n, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw je(), t;
			qe();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Lr(r);
					for (let e of [n, document]) {
						var a = Vr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Vr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(xr)), Sr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Vr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Dr), t.delete(e), t.size === 0 && Vr.delete(r)) : t.set(e, i);
			}
			Sr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Ur.set(u, d), u;
}
var Ur = /* @__PURE__ */ new WeakMap();
function Wr(e, t) {
	let n = Ur.get(e);
	return n ? (Ur.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Gr = class {
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
			if (n) Un(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Un(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Rn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Gn(r, t), t.append(pn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Rn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Vn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Rn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = _n();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = pn();
			i.append(a), this.#n.set(e, {
				effect: Pn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Pn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
function Kr(e) {
	j === null && ve("onMount"), Ue && j.l !== null ? qr(j).m.push(e) : Tn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function qr(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Y(e, t, n = !1) {
	var r;
	O && (r = k, Ie());
	var i = new Gr(e), a = n ? E : 0;
	function o(e, t) {
		if (O) {
			var n = ze(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Re();
				Fe(a), i.anchor = a, Pe(!1), i.ensure(e, t), Pe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Nn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Jr = Symbol("NaN");
function Yr(e, t, n) {
	O && Ie();
	var r = new Gr(e), i = !Je();
	Nn(() => {
		var e = t();
		e !== e && (e = Jr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Xr(e, t) {
	return t;
}
function Zr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Vn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Qr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			gn(d), d.append(u), e.items.clear();
		}
		Qr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Qr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= D, Gn(a, document.createDocumentFragment())) : Rn(t[i], n);
	}
}
var $r;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = O ? Fe(/* @__PURE__ */ mn(u)) : u.appendChild(pn());
	}
	O && Ie();
	var d = null, f = /* @__PURE__ */ wt(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, ti(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= D, ri(d, null, s)) : Un(d) : Vn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Nn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			O && ze(s) === "[!" != (e === 0) && (s = Re(), Fe(s), Pe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = _n(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (s = k, a = !0, Pe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && u.unskip_effect(S.e)) : (S = ni(l, h ? s : $r ??= pn(), b, x, y, i, t, n), h || (S.e.f |= D), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Pn(() => o(s)) : (d = Pn(() => o($r ??= pn())), d.f |= D)), e > c.size && be("", "", ""), O && e > 0 && Fe(Re()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Pe(!0), H(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, O && (s = k);
}
function ei(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function ti(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ei(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Un(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= D, _ === l) ri(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ii(e, d, _), ii(e, _, y), ri(_, y, n), d = _, p = [], m = [], l = ei(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) ri(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					ii(e, S.prev, C.next), ii(e, d, S), ii(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), ri(_, l, n), ii(e, _.prev, _.next), ii(e, _, d === null ? e.effect.first : d.next), ii(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = ei(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = ei(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Qr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ei(l.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Zr(e, w, ee);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ni(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Pn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ri(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ hn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ii(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function ai(e, t, n, r, i) {
	O && Ie();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function oi(e, t, n, r, a, o) {
	let s = O;
	O && Ie();
	var c = null;
	O && k.nodeType === 1 && (c = k, Ie());
	var l = O ? k : e, u = new Gr(l, !1);
	Nn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = O ? c : vn(e, o), jr(c, c), r) {
					var n = null;
					O && zr(e) && c.append(n = document.createComment(""));
					var i = O ? /* @__PURE__ */ mn(c) : c.appendChild(pn());
					O && (i === null ? Pe(!1) : Fe(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			O && Fe(t);
		}), () => {};
	}, E), wn(() => {}), s && (Pe(!0), Fe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function si(e, t, n) {
	kn(() => {
		var r = U(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Mn(() => {
				var e = n();
				W(e), i && Ve(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ci(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ci(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function li() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ci(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ui(e) {
	return typeof e == "object" ? li(e) : e ?? "";
}
var di = [..." 	\n\r\f\xA0\v﻿"];
function fi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || di.includes(r[o - 1])) && (s === r.length || di.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[de];
	if (O || o !== n || o === void 0) {
		var s = fi(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function pi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Me();
		for (var r of e.options) r.selected = t.includes(gi(r));
		return;
	}
	for (r of e.options) if (sn(gi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function mi(e) {
	var t = new MutationObserver(() => {
		"__value" in e && pi(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), wn(() => {
		t.disconnect();
	});
}
function hi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ft(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), gi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && gi(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), kn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if (pi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = gi(s), n(a));
		}
		e.__value = a, i = !1;
	}), mi(e);
}
function gi(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var _i = Symbol("is custom element"), vi = Symbol("is html"), yi = ge ? "link" : "LINK", bi = ge ? "progress" : "PROGRESS";
function xi(e) {
	if (O) {
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
		e[me] = n, Ze(n), ut();
	}
}
function Si(e, t) {
	var n = wi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === bi) && (e.value = t ?? "");
}
function Ci(e, t) {
	var n = wi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = wi(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === yi) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ei(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function wi(e) {
	return e[ue] ??= {
		[_i]: e.nodeName.includes("-"),
		[vi]: e.namespaceURI === r
	};
}
var Ti = /* @__PURE__ */ new Map();
function Ei(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ti.get(t);
	if (n) return n;
	Ti.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ft(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = ki(e) ? Ai(a) : a, n(a), M !== null && r.add(M), await gr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(ki(e) ? Ai(e.value) : e.value), M !== null && r.add(M)), Mn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		ki(e) && n === Ai(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Oi(e, t, n = t) {
	ft(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Mn(() => {
		e.checked = !!t();
	});
}
function ki(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ai(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ji(e, t) {
	return e === t || e?.[se] === t;
}
function Mi(e = {}, t, n, r) {
	var i = j.r, a = V;
	return kn(() => {
		var o, s;
		return Mn(() => {
			o = s, s = r?.() || [], U(() => {
				ji(n(...s), e) || (t(e, ...s), o && ji(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ji(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ni(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ xt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && Dn(() => {
		Pi(t, r), v(n.b);
	}), Tn(() => {
		let e = U(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Tn(() => {
		Pi(t, r), v(n.a);
	});
}
function Pi(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Ue || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ xt(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = se in e || ce in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = st(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Te(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? xt : wt)(() => (v = !1, g()));
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? an(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Jn && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), We();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Fi = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), Ii = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Li = /* @__PURE__ */ K("<option> </option>"), Ri = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), zi = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Bi = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Vi = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function Hi(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 4), E = /* @__PURE__ */ N();
	async function te() {
		await gr(), H(E)?.focus?.();
	}
	function ne(e) {
		e.preventDefault(), C()({
			title: H(w),
			summary: H(T),
			priority: u().normalize(H(ee), u().creationDefaultValue)
		});
	}
	function D(e) {
		e.key === "Escape" && (e.preventDefault(), S()());
	}
	R(() => W(c()), () => {
		P(n, c() === "task");
	}), R(() => (W(d()), H(n)), () => {
		P(r, d() || (H(n) ? "增加工作項目" : "增加待處理子任務"));
	}), R(() => (W(f()), H(n)), () => {
		P(i, f() || (H(n) ? "任務名稱" : "子任務描述"));
	}), R(() => (W(p()), H(n)), () => {
		P(a, p() || (H(n) ? "新任務名稱" : "新子任務描述"));
	}), R(() => (W(g()), H(n)), () => {
		P(o, g() || (H(n) ? "新任務優先級" : "新子任務優先級"));
	}), R(() => (W(v()), H(n)), () => {
		P(s, v() || (H(n) ? "加入任務" : "新增"));
	}), R(() => W(l()), () => {
		l() && te();
	}), An(), Ni();
	var re = Fr(), ie = I(re), ae = (e) => {
		var t = Fi();
		z(() => {
			Z(t, 1, ui(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, oe = (e) => {
		var t = Vi(), r = F(t);
		xi(r), Mi(r, (e) => P(E, e), () => H(E));
		var c = L(r, 2), l = (e) => {
			var t = Ii();
			ct(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Di(t, () => H(T), (e) => P(T, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Li(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), A(d);
		var f = L(d, 2), p = (e) => {
			var t = Ri(), n = F(t, !0);
			A(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = zi(), n = I(t), r = F(n, !0);
			A(n);
			var i = L(n, 2), a = F(i), o = F(a, !0);
			A(a);
			var c = L(a, 2), l = F(c, !0);
			A(c), A(i), z(() => {
				Q(n, "hidden", !b()), J(r, b()), J(o, y()), J(l, H(s));
			}), G("click", a, function(...e) {
				S()?.apply(this, e);
			}), q(e, t);
		}, x = (e) => {
			var t = Bi(), n = I(t), r = F(n, !0);
			A(n);
			var i = L(n, 2), a = F(i, !0);
			A(i);
			var o = L(i, 2), c = F(o, !0);
			A(o), z(() => {
				J(r, y()), J(a, H(s)), Q(o, "hidden", !b()), J(c, b());
			}), G("click", n, function(...e) {
				S()?.apply(this, e);
			}), q(e, t);
		};
		Y(g, (e) => {
			H(n) ? e(v) : e(x, -1);
		}), A(t), z(() => {
			Z(t, 1, ui(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), wr("submit", t, ne), G("keydown", t, D), Di(r, () => H(w), (e) => P(w, e)), hi(d, () => H(ee), (e) => P(ee, e)), q(e, t);
	};
	Y(ie, (e) => {
		l() ? e(oe, -1) : e(ae);
	}), q(e, re), qe();
}
Tr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var Ui = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Wi = /* @__PURE__ */ K("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), Gi = /* @__PURE__ */ K("<div class=\"assessment-metric-grid\"></div>");
function Ki(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = Gi();
	X(r, 5, n, (e) => e.label, (e, t) => {
		var n = Wi(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a), s = (e) => {
			var n = Ui();
			z(() => Z(n, 1, `assessment-tone-dot assessment-tone-${H(t), U(() => H(t).tone) ?? ""}`)), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).tone) && e(s);
		});
		var c = L(o);
		A(a), A(n), z(() => {
			J(i, (H(t), U(() => H(t).label))), J(c, ` ${H(t), U(() => H(t).value) ?? ""}`);
		}), q(e, n);
	}), A(r), q(e, r);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentNote.svelte
var qi = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Ji = /* @__PURE__ */ K("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function Yi(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = Ji(), a = F(i), o = F(a), s = (e) => {
		var t = qi();
		z(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), q(e, t);
	};
	Y(o, (e) => {
		r() && e(s);
	});
	var c = L(o);
	A(a), ai(L(a, 2), t, "default", {}, null), A(i), z(() => J(c, ` ${n() ?? ""}`)), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var Xi = /* @__PURE__ */ K("<span class=\"assessment-readout-summary\"> </span>"), Zi = /* @__PURE__ */ K("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function Qi(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = Zi(), o = F(a), s = F(o, !0);
	A(o);
	var c = L(o, 2);
	ai(F(c), t, "badges", {}, null), A(c);
	var l = L(c, 2), u = (e) => {
		var t = Xi(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "title", i()), J(n, i());
		}), q(e, t);
	};
	Y(l, (e) => {
		i() && e(u);
	});
	var d = L(l, 2), f = F(d, !0);
	A(d), A(a), z(() => {
		J(s, n()), J(f, r());
	}), q(e, a);
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var $i = /* @__PURE__ */ K("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ea(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ N(), d = null, f = !1;
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
		H(u)?.close(), m();
	}
	function g(e) {
		e.target === e.currentTarget && h();
	}
	Ni();
	var _ = Fr(), v = I(_), y = (e) => {
		var n = $i(), l = F(n), d = F(l), f = F(d), _ = F(f, !0);
		A(f);
		var v = L(f, 2), y = F(v, !0);
		A(v), A(d);
		var b = L(d, 2);
		A(l), ai(L(l, 2), t, "default", {}, null), A(n), Mi(n, (e) => P(u, e), () => H(u)), si(n, (e) => p?.(e)), z(() => {
			Z(n, 1, ui(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), J(_, a()), Q(v, "id", s()), J(y, o()), Q(b, "aria-label", c());
		}), wr("close", n, m), G("click", n, g), G("click", b, h), q(e, n);
	};
	Y(v, (e) => {
		n() && e(y);
	}), q(e, _), qe();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var ta = /* @__PURE__ */ K("<span> </span>"), na = /* @__PURE__ */ K("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ra = /* @__PURE__ */ K("<!> <!> <!>", 1), ia = /* @__PURE__ */ K("<span slot=\"badges\"> </span>"), aa = /* @__PURE__ */ K("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), oa = /* @__PURE__ */ K("<div class=\"cost-dialog-content\"><!></div>");
function sa(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	Ni();
	{
		let t = /* @__PURE__ */ wt(() => `關閉${i()}`);
		ea(e, {
			get open() {
				return n();
			},
			get kicker() {
				return i();
			},
			get title() {
				return a();
			},
			id: "cost-dialog",
			dialogClass: "cost-dialog",
			titleId: "cost-dialog-title",
			get closeLabel() {
				return H(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = oa(), i = F(n), a = (e) => {
					var t = ra(), n = I(t);
					Qi(n, {
						label: "估算成本",
						get value() {
							return W(s()), U(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Fr();
							X(I(n), 1, () => (W(s()), U(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = ta(), r = F(n, !0);
								A(n), z(() => {
									Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
								}), q(e, n);
							}), q(e, n);
						} }
					});
					var r = L(n, 2);
					{
						let e = /* @__PURE__ */ wt(() => (W(s()), U(() => [
							...s().confidenceLabel ? [{
								label: "信心",
								value: s().confidenceLabel
							}] : [],
							{
								label: "人工確認",
								value: s().humanConfirmed ? "已確認" : "未確認"
							},
							{
								label: "狀態",
								value: s().done ? "已完成" : "未完成"
							}
						])));
						Ki(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						Yi(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								q(e, na());
							},
							$$slots: { default: !0 }
						});
					};
					Y(i, (e) => {
						W(s()), U(() => !s().humanConfirmed) && e(a);
					}), q(e, t);
				}, c = (e) => {
					var t = ra(), n = I(t);
					Qi(n, {
						label: "估算總額",
						get value() {
							return W(o()), U(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ia(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, `cost-coverage cost-coverage-${W(o()), U(() => o().coverage) ?? ""}`), J(r, (W(o()), U(() => o().coverageLabel)));
							}), q(e, n);
						} }
					});
					var r = L(n, 2);
					{
						let e = /* @__PURE__ */ wt(() => (W(o()), U(() => [{
							label: "未完成成本",
							value: o().remaining
						}, ...o().available ? [{
							label: "可用資源",
							value: o().available
						}, {
							label: "餘額",
							value: o().balance,
							tone: o().tone
						}] : []])));
						Ki(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						Yi(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								q(e, aa());
							},
							$$slots: { default: !0 }
						});
					};
					Y(i, (e) => {
						W(o()), U(() => o().coverage !== "full") && e(a);
					}), q(e, t);
				};
				Y(i, (e) => {
					r() === "item" && s() ? e(a) : o() && e(c, 1);
				}), A(n), q(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var ca = /* @__PURE__ */ K("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), la = /* @__PURE__ */ K("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), ua = /* @__PURE__ */ K("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), da = /* @__PURE__ */ K("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function fa(e, t) {
	Ke(t, !1);
	let n = $(t, "preview", 8), r = $(t, "heading", 8, "交付日草稿預覽"), i = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 });
	function a(e) {
		if (!e?.present) return "未指定";
		let t = new Date(e.value);
		return Number.isNaN(t.getTime()) ? e.value : new Intl.DateTimeFormat("zh-TW", {
			dateStyle: "medium",
			timeStyle: "short",
			hour12: !1
		}).format(t);
	}
	function o(e) {
		return e == null ? "—" : `${i.format(e / 60)} hr`;
	}
	function s(e) {
		return e == null ? "無法比較" : `${e > 0 ? "+" : ""}${i.format(e / 60)} hr`;
	}
	Ni();
	var c = da(), l = F(c), u = F(l), d = L(F(u), 2), f = F(d, !0);
	A(d), A(u), Le(2), A(l);
	var p = L(l, 2), m = (e) => {
		var t = ca(), r = F(t), i = L(F(r), 2), o = F(i, !0);
		A(i), A(r);
		var s = L(r, 2), c = L(F(s), 2), l = F(c, !0);
		A(c), A(s), A(t), z((e, t) => {
			J(o, e), J(l, t);
		}, [() => (W(n()), U(() => a(n().before))), () => (W(n()), U(() => a(n().after)))]), q(e, t);
	}, h = (e) => {
		q(e, la());
	};
	Y(p, (e) => {
		W(n()), U(() => n().deliveryChanged) ? e(m) : (W(n()), U(() => n().capacityChanged) && e(h, 1));
	});
	var g = L(p, 2), _ = F(g), v = L(F(_), 2), y = F(v, !0);
	A(v);
	var b = L(v, 2), x = F(b);
	A(b), A(_);
	var S = L(_, 4), C = L(F(S), 2), w = F(C, !0);
	A(C);
	var T = L(C, 2), ee = F(T);
	A(T), A(S), A(g);
	var E = L(g, 2), te = F(E), ne = L(F(te)), D = F(ne, !0);
	A(ne), A(te);
	var re = L(te, 2), ie = L(F(re)), ae = F(ie, !0);
	A(ie), A(re), A(E);
	var oe = L(E, 2), se = (e) => {
		var t = ua(), r = L(F(t), 1, !0);
		A(t), z(() => J(r, (W(n()), U(() => n().reason)))), q(e, t);
	};
	Y(oe, (e) => {
		W(n()), U(() => n().reason) && e(se);
	}), A(c), z((e, t, i, a) => {
		J(f, r()), J(y, (W(n()), U(() => n().current.label))), J(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (W(n()), U(() => `risk-${n().next.urgency ?? "none"}`))), J(w, (W(n()), U(() => n().next.label))), J(ee, `剩餘容量 ${t ?? ""}`), J(D, i), J(ae, a);
	}, [
		() => (W(n()), U(() => o(n().current.remainingCapacityMinutes))),
		() => (W(n()), U(() => o(n().next.remainingCapacityMinutes))),
		() => (W(n()), U(() => s(n().capacityDelta))),
		() => (W(n()), U(() => s(n().balanceDelta)))
	]), q(e, c), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var pa = /* @__PURE__ */ K("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function ma(e, t) {
	Ke(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N();
	Kr(() => {
		H(o).showModal(), H(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Ni();
	var u = pa(), d = L(F(u), 2);
	fa(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = L(d, 2), p = F(f);
	Mi(p, (e) => P(s, e), () => H(s));
	var m = L(p, 2), h = F(m, !0);
	A(m), A(f), A(u), Mi(u, (e) => P(o, e), () => H(o)), z(() => {
		p.disabled = r(), m.disabled = r(), J(h, r() ? "正在儲存…" : "確認儲存");
	}), wr("cancel", u, c), G("keydown", u, l), G("click", p, function(...e) {
		i()?.apply(this, e);
	}), G("click", m, function(...e) {
		a()?.apply(this, e);
	}), q(e, u), qe();
}
Tr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var ha = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function ga(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Fr();
	X(I(i), 1, n, Xr, (e, t) => {
		let n = /* @__PURE__ */ wt(() => (H(t), U(() => H(t).level ?? "error")));
		var i = ha(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s, !0);
		A(s), A(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var _a = /* @__PURE__ */ K("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function va(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), An(), Ni();
	var d = _a(), f = F(d, !0);
	A(d), z(() => {
		Q(d, "aria-pressed", H(n)), Q(d, "aria-label", `目前為${H(r)}；按下切換到${H(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(f, H(r));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), qe();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var ya = /* @__PURE__ */ K("<span></span>"), ba = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), xa = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>"), Sa = /* @__PURE__ */ K("<div role=\"toolbar\"></div>");
function Ca(e, t) {
	Ke(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = !1, u = null, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N();
	async function p() {
		let e = H(d);
		P(d, null), await gr(), [...H(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		P(s, null), P(c, null);
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
		P(d, r), o()(e, t, n);
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
		P(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!H(s) || e.id === H(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", P(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || H(c)?.id === e.id && P(c, null);
	}
	function T(e, t) {
		if (!H(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = H(s), r = g(t.currentTarget, t.clientX);
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
			u.active = !0, l = !0, P(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, P(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), P(c, {
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
	R(() => (W(n()), H(d)), () => {
		n() && H(d) && p();
	}), An(), Ni();
	var D = Sa();
	X(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ wt(() => (H(t), U(() => H(t).sortable !== !1)));
		var r = xa(), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i, 2), l = (e) => {
			var n = ya();
			z(() => Z(n, 1, (H(t), U(() => `time-risk-dot ${H(t).dotClass ?? ""}`)))), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).showDot) && e(l);
		});
		var u = L(o, 2), d = (e) => {
			q(e, ba());
		};
		Y(u, (e) => {
			H(t), U(() => H(t).showChevron) && e(d);
		}), A(r), z((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (H(t), U(() => H(t).id))), Q(r, "data-reorder-capsule", H(n) ? "true" : null), Q(r, "aria-pressed", (H(t), U(() => H(t).pressed ?? null))), Q(r, "aria-label", (H(t), U(() => H(t).ariaLabel ?? H(t).label))), Q(r, "aria-keyshortcuts", H(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (H(t), U(() => H(t).title ?? null))), r.disabled = (H(t), U(() => H(t).disabled ?? !1)), Q(r, "draggable", H(n)), J(a, (H(t), U(() => H(t).label)));
		}, [() => (H(t), W(H(n)), H(s), H(c), U(() => `capsule-button ${H(t).className ?? ""} ${H(n) ? "capsule-sortable" : ""} ${H(s) === H(t).id ? "capsule-dragging" : ""} ${h(H(t).id, H(c))}`))]), G("click", r, (e) => b(H(t), e)), G("keydown", r, function(...e) {
			(H(n) ? (e) => x(H(t), e) : null)?.apply(this, e);
		}), wr("dragstart", r, function(...e) {
			(H(n) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), wr("dragover", r, function(...e) {
			(H(n) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), wr("dragleave", r, function(...e) {
			(H(n) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), wr("drop", r, function(...e) {
			(H(n) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), wr("dragend", r, function(...e) {
			(H(n) ? ee : null)?.apply(this, e);
		}), G("pointerdown", r, function(...e) {
			(H(n) ? (e) => E(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", r, function(...e) {
			(H(n) ? (e) => te(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", r, function(...e) {
			(H(n) ? ne : null)?.apply(this, e);
		}), wr("pointercancel", r, function(...e) {
			(H(n) ? ne : null)?.apply(this, e);
		}), q(e, r);
	}), A(D), Mi(D, (e) => P(f, e), () => H(f)), z(() => {
		Z(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), q(e, D), qe();
}
Tr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function wa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	R(() => W(a()), () => {
		P(n, new Map(a().map((e, t) => [e, t])));
	}), R(() => (W(i()), H(n), W(a())), () => {
		P(r, [...i()].sort((e, t) => (H(n).get(e.id) ?? a().length) - (H(n).get(t.id) ?? a().length)));
	}), An(), Ni();
	var u = Fr(), d = I(u), f = (e) => {
		Ca(e, {
			get items() {
				return H(r);
			},
			get className() {
				return o();
			},
			get ariaLabel() {
				return s();
			},
			get onActivate() {
				return c();
			},
			get onReorder() {
				return l();
			}
		});
	};
	Y(d, (e) => {
		H(r), U(() => H(r).length) && e(f);
	}), q(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Ta = /* @__PURE__ */ K("<i></i>"), Ea = /* @__PURE__ */ K("<div role=\"img\"></div>"), Da = /* @__PURE__ */ K("<progress max=\"100\"></progress>");
function Oa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending",
		"active"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	R(() => W(o()), () => {
		P(n, d(o()));
	}), R(() => W(a()), () => {
		P(r, Array.isArray(a()) ? a() : []);
	}), An(), Ni();
	var f = Fr(), p = I(f), m = (e) => {
		var t = Ea();
		X(t, 5, () => H(r), Xr, (e, t) => {
			var n = Ta();
			z((e) => Z(n, 1, e), [() => (H(t), U(() => `progress-cell${u(H(t))}`))]), q(e, n);
		}), A(t), z(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), q(e, t);
	}, h = (e) => {
		var t = Da();
		z(() => {
			Z(t, 1, `progress-meter ${c()}`), Si(t, H(n)), Q(t, "aria-label", s());
		}), q(e, t);
	};
	Y(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), q(e, f), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var ka = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Aa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	R(() => (W(r()), W(i()), W(a()), W(o())), () => {
		P(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), An(), Ni();
	var s = ka(), c = I(s), l = F(c), u = F(l);
	A(l), A(c);
	var d = L(c, 2);
	{
		let e = /* @__PURE__ */ wt(() => r() / 100);
		Oa(d, {
			form: "segmented",
			get cells() {
				return o();
			},
			get ratio() {
				return H(e);
			},
			get label() {
				return H(n);
			},
			extraClass: "project-progress-meter"
		});
	}
	z(() => J(u, `整體約 ${r() ?? ""}%`)), q(e, s), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var ja = /* @__PURE__ */ K("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ma = /* @__PURE__ */ K("<p class=\"hero-summary\"> </p>");
function Na(e, t) {
	Ke(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	Ni();
	var c = Fr(), l = I(c), u = (e) => {
		var t = ja();
		ct(t), z(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Si(t, i());
		}), G("input", t, (e) => s()(e.currentTarget.value)), q(e, t);
	}, d = (e) => {
		var t = Ma(), r = F(t, !0);
		A(t), z(() => J(r, n())), q(e, t);
	};
	Y(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), q(e, c), qe();
}
Tr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Pa = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), Fa = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function Ia(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Fr();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = Fa(), i = F(n), a = F(i, !0);
		A(i);
		var o = L(i, 2), s = (e) => {
			var n = Pa(), i = F(n, !0);
			A(n), z(() => {
				Q(n, "href", (H(t), U(() => H(t).baseOnlyHref))), J(i, r());
			}), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).baseOnlyHref) && e(s);
		}), A(n), z(() => {
			Q(i, "href", (H(t), U(() => H(t).href))), J(a, (H(t), U(() => H(t).id)));
		}), q(e, n);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var La = /* @__PURE__ */ K("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ra = /* @__PURE__ */ K("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), za = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Ba(e, t) {
	Ke(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Ni();
	var y = za(), b = I(y), x = F(b, !0);
	A(b);
	var S = L(b, 2), C = F(S), w = F(C, !0);
	A(C);
	var T = L(C, 2), ee = F(T, !0);
	A(T), A(S);
	var E = L(S, 2), te = (e) => {
		var t = La(), a = F(t, !0);
		A(t), z(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), J(a, i());
		}), G("click", t, () => r()(!n())), q(e, t);
	};
	Y(E, (e) => {
		r() && e(te);
	});
	var ne = L(E, 2), D = (e) => {
		var t = Ra(), n = I(t), r = F(n, !0);
		A(n);
		var i = L(n, 2), s = F(i, !0);
		A(i), z(() => {
			n.disabled = o(), J(r, m()), i.disabled = !a() || o(), J(s, o() ? d() : u());
		}), G("click", n, function(...e) {
			v()?.apply(this, e);
		}), G("click", i, function(...e) {
			h()?.apply(this, e);
		}), q(e, t);
	};
	Y(ne, (e) => {
		n() && e(D);
	}), z(() => {
		J(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), J(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), J(ee, p());
	}), G("click", C, function(...e) {
		g()?.apply(this, e);
	}), G("click", T, function(...e) {
		_()?.apply(this, e);
	}), q(e, y), qe();
}
Tr(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var Va = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Ha(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e) => {
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
	R(() => (W(u()), W(p()), W(l())), () => {
		P(n, {
			id: Va,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), R(() => W(o()), () => {
		P(r, new Map(o().map((e) => [e.id, e])));
	}), R(() => (W(s()), W(o())), () => {
		P(i, s().length > 0 ? s() : [Va, ...o().map((e) => e.id)]);
	}), R(() => (H(i), H(n), H(r)), () => {
		P(a, H(i).map((e) => e === "__default__" ? H(n) : H(r).get(e)).filter(Boolean).map((e) => e === H(n) ? e : v(e)));
	}), An(), Ni(), Ca(e, {
		get items() {
			return H(a);
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
	}), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var Ua = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function Wa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = {
		in_progress: {
			label: "目前進行",
			tone: "active"
		},
		done: {
			label: "已完成",
			tone: "success"
		},
		blocked: {
			label: "受阻",
			tone: "danger"
		},
		archive: {
			label: "已封存",
			tone: "muted"
		}
	};
	R(() => (W(i()), W(r())), () => {
		P(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), An(), Ni();
	var o = Fr();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = Ua(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a, !0);
		A(a), A(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), qe();
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function Ga(e, t) {
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
function Ka(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var qa = /* @__PURE__ */ K("<div class=\"card-disclosure-heading\"><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function Ja(e, t) {
	Ke(t, !1);
	let n = $(t, "expanded", 8, !0), r = $(t, "contentId", 8), i = $(t, "label", 8, "卡片"), a = $(t, "onToggle", 8, () => {});
	Ni();
	var o = qa(), s = I(o), c = F(s), l = F(c), u = F(l, !0);
	A(l), A(c), ai(L(c, 2), t, "header", {}, null), A(s);
	var d = L(s, 2);
	ai(F(d), t, "default", {}, null), A(d), z(() => {
		Q(c, "aria-expanded", n()), Q(c, "aria-controls", r()), Q(c, "aria-label", `${n() ? "收合" : "展開"} ${i()}`), Q(c, "title", n() ? "收合" : "展開"), J(u, n() ? "▼" : "▶"), Q(d, "id", r()), Q(d, "hidden", !n());
	}), G("click", c, () => a()(!n())), q(e, o), qe();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var Ya = /* @__PURE__ */ K("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span>", 1), Xa = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), Za = /* @__PURE__ */ K("<!> <!>", 1), Qa = /* @__PURE__ */ K("<li> </li>"), $a = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), eo = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), to = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), no = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), ro = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), io = /* @__PURE__ */ K("<p> </p>"), ao = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), oo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), so = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), co = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), lo = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function uo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = $(t, "developer", 8, null);
	R(() => W(s()), () => {
		P(n, s()?.next_steps ?? []);
	}), R(() => (W(s()), H(n)), () => {
		P(r, s()?.next_step ?? H(n)[0] ?? null);
	}), R(() => (W(s()), H(n)), () => {
		P(i, s()?.next_step ? H(n) : H(n).slice(1));
	}), R(() => (H(i), W(s())), () => {
		P(a, !!(H(i).length || s()?.blockers?.length || s()?.decisions?.length || s()?.routes?.length || s()?.claim));
	}), R(() => (H(r), H(a)), () => {
		P(o, !!H(r) || H(a));
	}), An(), Ni();
	var c = Fr(), l = I(c), u = (e) => {
		var t = Fr();
		oi(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = Za(), o = I(n);
			oi(o, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = Za(), i = I(n), o = (e) => {
					var t = Ya(), n = L(I(t), 2), i = F(n, !0);
					A(n), z(() => J(i, H(r))), q(e, t);
				};
				Y(i, (e) => {
					H(r) && e(o);
				});
				var s = L(i, 2), c = (e) => {
					q(e, Xa());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), q(t, n);
			});
			var c = L(o, 2), l = (e) => {
				var t = lo(), n = L(F(t), 2), r = (e) => {
					var t = $a(), n = L(F(t), 2);
					X(n, 5, () => H(i), Xr, (e, t) => {
						var n = Qa(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), o = (e) => {
					var t = eo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().blockers)), Xr, (e, t) => {
						var n = Qa(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(a, (e) => {
					W(s()), U(() => s().blockers?.length) && e(o);
				});
				var c = L(a, 2), l = (e) => {
					var t = ro(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().decisions)), Xr, (e, t) => {
						var n = no(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = (e) => {
							var n = to(), r = F(n, !0);
							A(n), z(() => J(r, (H(t), U(() => H(t).reference)))), q(e, n);
						};
						Y(a, (e) => {
							H(t), U(() => H(t).reference) && e(o);
						}), A(n), z(() => J(i, (H(t), U(() => H(t).summary)))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(c, (e) => {
					W(s()), U(() => s().decisions?.length) && e(l);
				});
				var u = L(c, 2), d = (e) => {
					var t = oo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().routes)), Xr, (e, t) => {
						var n = ao(), r = F(n), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r);
						var c = L(r, 2), l = (e) => {
							var n = io(), r = F(n, !0);
							A(n), z(() => J(r, (H(t), U(() => H(t).reason)))), q(e, n);
						};
						Y(c, (e) => {
							H(t), U(() => H(t).reason) && e(l);
						}), A(n), z(() => {
							J(a, (H(t), U(() => H(t).title))), Z(o, 1, (H(t), U(() => `route-state route-${H(t).state}`))), J(s, (H(t), U(() => H(t).state)));
						}), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(u, (e) => {
					W(s()), U(() => s().routes?.length) && e(d);
				});
				var f = L(u, 2), p = (e) => {
					var t = co(), n = L(F(t), 2), r = F(n);
					A(n);
					var i = L(n, 2), a = (e) => {
						var t = io(), n = F(t);
						A(t), z(() => J(n, `Worktree: ${W(s()), U(() => s().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(s()), U(() => s().claim.worktree) && e(a);
					});
					var o = L(i, 2), c = (e) => {
						var t = so();
						X(t, 5, () => (W(s()), U(() => s().claim.source_paths)), Xr, (e, t) => {
							var n = to(), r = F(n, !0);
							A(n), z(() => J(r, H(t))), q(e, n);
						}), A(t), q(e, t);
					};
					Y(o, (e) => {
						W(s()), U(() => s().claim.source_paths?.length) && e(c);
					}), A(t), z(() => J(r, `Agent: ${W(s()), U(() => s().claim.agent) ?? ""}`)), q(e, t);
				};
				Y(f, (e) => {
					W(s()), U(() => s().claim) && e(p);
				}), A(t), q(e, t);
			};
			Y(c, (e) => {
				H(a) && e(l);
			}), q(t, n);
		}), q(e, t);
	};
	Y(l, (e) => {
		s() && H(o) && e(u);
	}), q(e, c), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var fo = /* @__PURE__ */ K("<option> </option>"), po = /* @__PURE__ */ K("<select class=\"inline-priority-select\"></select>"), mo = /* @__PURE__ */ K("<span> </span>"), ho = /* @__PURE__ */ K("<span class=\"item-row-priority\"><!></span>"), go = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), _o = /* @__PURE__ */ K("<span class=\"spike-item-title\"> </span>"), vo = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select>"), yo = /* @__PURE__ */ K("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), bo = /* @__PURE__ */ K("<li><span aria-hidden=\"true\"> </span> <!> <span class=\"item-row-description\"><!></span> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function xo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = $(t, "taskId", 8), c = $(t, "field", 8), l = $(t, "item", 8), u = $(t, "editing", 8), d = $(t, "policy", 8), f = $(t, "onCommand", 8), p = $(t, "moduleCapsules", 24, () => []), m = $(t, "onModuleActivate", 8, () => {}), h = $(t, "moduleOrder", 24, () => ["time"]), g = $(t, "onModuleReorder", 8, () => {}), _ = /* @__PURE__ */ N(d().normalize(l().priority, d().fallbackValue)), v = $(t, "statuses", 24, () => []), y = /* @__PURE__ */ N(l().status ?? (c() === "completed_items" ? "done" : "planned"));
	function b(e) {
		e !== H(i) && f()({
			type: "set-item-status",
			taskId: s(),
			field: c(),
			itemId: l().id,
			status: e
		});
	}
	function x(e) {
		m()(e, {
			taskId: s(),
			itemId: l().id,
			itemTitle: l().title
		});
	}
	R(() => (W(d()), W(l())), () => {
		P(n, d().metadata(l().priority));
	}), R(() => (W(d()), W(l())), () => {
		P(r, d().format(l().priority));
	}), R(() => (W(d()), W(l())), () => {
		P(_, d().normalize(l().priority, d().fallbackValue));
	}), R(() => (W(l()), W(c())), () => {
		P(i, l().status ?? (c() === "completed_items" ? "done" : "planned"));
	}), R(() => H(i), () => {
		P(y, H(i));
	}), R(() => (W(v()), H(i)), () => {
		P(a, v().find((e) => e.value === H(i)) ?? {
			label: H(i),
			tone: "muted"
		});
	}), R(() => H(a), () => {
		P(o, H(a).label);
	}), An(), Ni();
	var S = bo();
	let C;
	var w = F(S), T = F(w, !0);
	A(w);
	var ee = L(w, 2), E = (e) => {
		var t = ho(), i = F(t), a = (e) => {
			var t = po();
			X(t, 5, () => (W(d()), U(() => d().levels)), (e) => e.value, (e, t) => {
				var n = fo(), r = F(n, !0);
				A(n);
				var i = {};
				z((e) => {
					J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
				}, [() => (W(d()), H(t), U(() => d().format(H(t).value)))]), q(e, n);
			}), A(t), z(() => Q(t, "aria-label", (W(l()), U(() => `設定「${l().title}」的優先級`)))), G("change", t, () => f()({
				type: "set-item-field",
				taskId: s(),
				field: c(),
				itemId: l().id,
				property: "priority",
				value: Number(H(_))
			})), hi(t, () => H(_), (e) => P(_, e)), q(e, t);
		}, o = (e) => {
			var t = mo(), i = F(t, !0);
			A(t), z(() => {
				Z(t, 1, (H(n), U(() => `priority-badge priority-${H(n).tone}`))), J(i, H(r));
			}), q(e, t);
		};
		Y(i, (e) => {
			u() ? e(a) : e(o, -1);
		}), A(t), q(e, t);
	};
	Y(ee, (e) => {
		W(u()), H(i), H(n), W(d()), U(() => u() || H(i) !== "done" && H(n) && (!H(n).hidden || !d().labelsValid)) && e(E);
	});
	var te = L(ee, 2), ne = F(te), D = (e) => {
		var t = go();
		xi(t), z(() => {
			Q(t, "aria-label", (W(l()), U(() => `編輯子項目：${l().title}`))), Q(t, "title", (W(l()), U(() => l().title))), Si(t, (W(l()), U(() => l().title)));
		}), G("input", t, (e) => f()({
			type: "set-item-field",
			taskId: s(),
			field: c(),
			itemId: l().id,
			property: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, re = (e) => {
		var t = _o(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "title", (W(l()), U(() => l().title))), J(n, (W(l()), U(() => l().title)));
		}), q(e, t);
	};
	Y(ne, (e) => {
		u() ? e(D) : e(re, -1);
	}), A(te);
	var ie = L(te, 2), ae = F(ie);
	wa(F(ae), {
		get capsules() {
			return p();
		},
		get moduleOrder() {
			return h();
		},
		onActivate: x,
		get onReorder() {
			return g();
		}
	}), A(ae);
	var oe = L(ae, 2), se = F(oe), ce = (e) => {
		var t = vo();
		X(t, 5, v, (e) => e.value, (e, t) => {
			var n = fo(), r = F(n, !0);
			A(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), A(t), z(() => Q(t, "aria-label", (W(l()), U(() => `設定「${l().title}」的狀態`)))), G("change", t, () => b(H(y))), hi(t, () => H(y), (e) => P(y, e)), q(e, t);
	}, le = (e) => {
		var t = mo(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, (H(a), U(() => `item-status-capsule status-${H(a).tone}`))), J(n, H(o));
		}), q(e, t);
	};
	Y(se, (e) => {
		u() ? e(ce) : e(le, -1);
	}), A(oe);
	var ue = L(oe, 2), de = (e) => {
		var t = yo(), n = F(t);
		A(t), z(() => Q(n, "aria-label", (W(l()), U(() => `刪除子項目：${l().title}`)))), G("click", n, () => f()({
			type: "delete-item",
			taskId: s(),
			field: c(),
			itemId: l().id
		})), q(e, t);
	};
	Y(ue, (e) => {
		u() && e(de);
	}), A(ie), A(S), z(() => {
		C = Z(S, 1, "editor-item-row", null, C, { "editable-work-item": u() }), Z(w, 1, `item-row-marker item-row-marker-${H(i)}`), J(T, H(i) === "done" ? "✓" : "○");
	}), q(e, S), qe();
}
Tr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var So = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Co = /* @__PURE__ */ K("<p class=\"task-summary\"> </p>"), wo = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), To = /* @__PURE__ */ K("<option> </option>"), Eo = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Do = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Oo = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), ko = /* @__PURE__ */ K("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), Ao = /* @__PURE__ */ K("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), jo = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Mo = /* @__PURE__ */ K("<h3> </h3>"), No = /* @__PURE__ */ K("<span> </span>"), Po = /* @__PURE__ */ K("<div class=\"task-module-totals\"></div>"), Fo = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!> <span> </span></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header>"), Io = /* @__PURE__ */ K("<article><!></article>");
function Lo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "expanded", 8, !0), s = $(t, "onToggle", 8, () => {}), c = $(t, "task", 8), l = $(t, "progress", 8), u = $(t, "editing", 8), d = $(t, "policy", 8), f = $(t, "onCommand", 8), p = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let m = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), h = $(t, "onModuleActivate", 8, () => {}), g = $(t, "moduleOrder", 24, () => ["time"]), _ = $(t, "onModuleReorder", 8, () => {}), v = $(t, "statusOrder", 24, () => ["done", "planned"]), y = $(t, "moduleTotals", 24, () => []), b = [
		{
			value: "planned",
			label: "待處理",
			tone: "neutral"
		},
		{
			value: "in_progress",
			label: "進行中",
			tone: "active"
		},
		{
			value: "blocked",
			label: "受阻",
			tone: "danger"
		},
		{
			value: "done",
			label: "已完成",
			tone: "success"
		},
		{
			value: "archive",
			label: "已封存",
			tone: "muted"
		}
	], x = /* @__PURE__ */ N(!1), S = /* @__PURE__ */ N(""), C = /* @__PURE__ */ N(d().creationDefaultValue), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(c().status), ee = /* @__PURE__ */ N(d().normalize(c().priority, d().fallbackValue));
	function E() {
		P(x, !1), P(S, ""), P(C, d().creationDefaultValue), P(w, "");
	}
	function te() {
		let e = p()(H(S), Number(H(C)));
		P(w, e.error), H(w) || E();
	}
	R(() => W(c()), () => {
		P(n, [{
			status: "done",
			title: "已完成",
			className: "completed-work",
			field: "completed_items",
			items: c().completed_items ?? []
		}, {
			status: "planned",
			title: "待處理",
			className: "pending-work",
			field: "pending_items",
			items: c().pending_items ?? []
		}]);
	}), R(() => (H(n), W(v())), () => {
		P(r, [...H(n)].sort((e, t) => {
			let n = v().indexOf(e.status), r = v().indexOf(t.status);
			return (n < 0 ? v().length : n) - (r < 0 ? v().length : r);
		}));
	}), R(() => (W(d()), W(c())), () => {
		P(i, d().metadata(c().priority));
	}), R(() => W(c()), () => {
		P(T, c().status);
	}), R(() => (W(d()), W(c())), () => {
		P(ee, d().normalize(c().priority, d().fallbackValue));
	}), R(() => W(c()), () => {
		P(a, b.find((e) => e.value === c().status) ?? {
			label: c().status,
			tone: "muted"
		});
	}), R(() => (W(u()), H(x)), () => {
		!u() && H(x) && E();
	}), An(), Ni();
	var ne = Io(), D = F(ne);
	{
		let e = /* @__PURE__ */ wt(() => (W(c()), U(() => `task-body-${c().id}`)));
		Ja(D, {
			get expanded() {
				return o();
			},
			get onToggle() {
				return s();
			},
			get contentId() {
				return H(e);
			},
			get label() {
				return W(c()), U(() => c().title);
			},
			children: (e, t) => {
				var n = ko(), i = I(n), a = (e) => {
					var t = So();
					ct(t), z(() => Si(t, (W(c()), U(() => c().summary)))), G("input", t, (e) => f()({
						type: "set-task-field",
						taskId: c().id,
						field: "summary",
						value: e.currentTarget.value
					})), q(e, t);
				}, o = (e) => {
					var t = Co(), n = F(t, !0);
					A(t), z(() => J(n, (W(c()), U(() => c().summary)))), q(e, t);
				};
				Y(i, (e) => {
					u() ? e(a) : e(o, -1);
				});
				var s = L(i, 2);
				{
					let e = /* @__PURE__ */ wt(() => (W(c()), U(() => c().developer ?? null)));
					uo(s, { get developer() {
						return H(e);
					} });
				}
				var l = L(s, 2), p = F(l);
				X(p, 1, () => H(r), (e) => e.status, (e, t) => {
					var n = Fr(), r = I(n), i = (e) => {
						var n = wo(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2);
						X(a, 5, () => (H(t), U(() => H(t).items)), (e) => e.id, (e, n) => {
							{
								let r = /* @__PURE__ */ wt(() => (W(m()), H(n), U(() => m().get(H(n).id) ?? [])));
								xo(e, {
									get taskId() {
										return W(c()), U(() => c().id);
									},
									get field() {
										return H(t), U(() => H(t).field);
									},
									get item() {
										return H(n);
									},
									get editing() {
										return u();
									},
									get policy() {
										return d();
									},
									get onCommand() {
										return f();
									},
									get moduleCapsules() {
										return H(r);
									},
									get statuses() {
										return b;
									},
									get onModuleActivate() {
										return h();
									},
									get moduleOrder() {
										return g();
									},
									get onModuleReorder() {
										return _();
									}
								});
							}
						}), A(a), A(n), z(() => {
							Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title)));
						}), q(e, n);
					};
					Y(r, (e) => {
						H(t), W(u()), U(() => H(t).items.length || u()) && e(i);
					}), q(e, n);
				});
				var v = L(p, 2), y = F(v), T = (e) => {
					var t = Oo(), n = F(t), r = (e) => {
						var t = Eo(), n = F(t);
						xi(n);
						var r = L(n, 2);
						X(r, 5, () => (W(d()), U(() => d().levels)), (e) => e.value, (e, t) => {
							var n = To(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(d()), H(t), U(() => d().format(H(t).value)))]), q(e, n);
						}), A(r);
						var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
						A(o), A(t), z(() => {
							Q(o, "hidden", !H(w)), J(s, H(w));
						}), G("keydown", n, (e) => {
							e.key === "Enter" && te(), e.key === "Escape" && E();
						}), Di(n, () => H(S), (e) => P(S, e)), hi(r, () => H(C), (e) => P(C, e)), G("click", i, te), G("click", a, E), q(e, t);
					}, i = (e) => {
						var t = Do();
						z(() => Q(t, "aria-label", (W(c()), U(() => `在「${c().title}」新增子項目`)))), G("click", t, () => {
							P(x, !0);
						}), q(e, t);
					};
					Y(n, (e) => {
						H(x) ? e(r) : e(i, -1);
					}), A(t), q(e, t);
				};
				Y(y, (e) => {
					u() && e(T);
				}), A(v), A(l), q(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = Fo(), r = F(n), i = F(r), o = (e) => {
						var t = Ao(), n = F(t);
						X(n, 5, () => b, (e) => e.value, (e, t) => {
							var n = To(), r = F(n, !0);
							A(n);
							var i = {};
							z(() => {
								J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}), q(e, n);
						}), A(n);
						var r = L(n, 2);
						X(r, 5, () => (W(d()), U(() => d().levels)), (e) => e.value, (e, t) => {
							var n = To(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(d()), H(t), U(() => d().format(H(t).value)))]), q(e, n);
						}), A(r), A(t), z(() => {
							Q(n, "aria-label", (W(c()), U(() => `${c().title} 狀態`))), Q(r, "aria-label", (W(c()), U(() => `${c().title} 優先級`)));
						}), G("change", n, () => f()({
							type: "set-task-field",
							taskId: c().id,
							field: "status",
							value: H(T)
						})), hi(n, () => H(T), (e) => P(T, e)), G("change", r, () => f()({
							type: "set-task-field",
							taskId: c().id,
							field: "priority",
							value: Number(H(ee))
						})), hi(r, () => H(ee), (e) => P(ee, e)), q(e, t);
					};
					Y(i, (e) => {
						u() && e(o);
					});
					var s = L(i, 2), p = F(s), m = (e) => {
						var t = jo();
						xi(t), z(() => {
							Q(t, "id", (W(c()), U(() => `task-${c().id}-title`))), Si(t, (W(c()), U(() => c().title)));
						}), G("input", t, (e) => f()({
							type: "set-task-field",
							taskId: c().id,
							field: "title",
							value: e.currentTarget.value
						})), q(e, t);
					}, h = (e) => {
						var t = Mo(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "id", (W(c()), U(() => `task-${c().id}-title`))), J(n, (W(c()), U(() => c().title)));
						}), q(e, t);
					};
					Y(p, (e) => {
						u() ? e(m) : e(h, -1);
					});
					var g = L(p, 2), _ = F(g, !0);
					A(g), A(s);
					var v = L(s, 2), x = (e) => {
						var t = Po();
						X(t, 5, y, (e) => e.id, (e, t) => {
							var n = No(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, (H(t), U(() => `task-module-total task-module-total-${H(t).id}`))), J(r, (H(t), U(() => H(t).label)));
							}), q(e, n);
						}), A(t), q(e, t);
					};
					Y(v, (e) => {
						W(y()), U(() => y().length) && e(x);
					}), A(r);
					var S = L(r, 2), C = F(S), w = F(C);
					A(C);
					var E = L(C, 2), te = F(E, !0);
					A(E), A(S), A(n), z(() => {
						Z(g, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(_, (H(a), U(() => H(a).label))), Q(C, "aria-label", (W(l()), U(() => `子項目完成 ${l().completed}，共 ${l().total}`))), J(w, `${W(l()), U(() => l().completed) ?? ""} / ${W(l()), U(() => l().total) ?? ""}`), J(te, (W(c()), U(() => c().id)));
					}), q(e, n);
				}
			}
		});
	}
	A(ne), z(() => {
		Z(ne, 1, (H(i), U(() => `task-card editor-task-card priority-${H(i)?.tone ?? "unspecified"}`))), Q(ne, "aria-labelledby", (W(c()), U(() => `task-${c().id}-title`)));
	}), q(e, ne), qe();
}
Tr([
	"input",
	"keydown",
	"click",
	"change"
]);
//#endregion
//#region viewer/assets/capsule-order.js
function Ro(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function zo(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function Bo(e, t, n) {
	return n === "free" ? Vo(e, t) : n === "reverse" ? [...e].reverse() : e;
}
function Vo(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function Ho(e, t, n, r, i, a) {
	let o = Ro(t, e), s = new Set(n), c = zo(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var Uo = /* @__PURE__ */ Nr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), Wo = /* @__PURE__ */ Nr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), Go = /* @__PURE__ */ K("<div role=\"group\" tabindex=\"0\"><!></div>"), Ko = /* @__PURE__ */ K("<div class=\"card-list-tools\"><p class=\"section-kicker\">工作項目</p> <button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg></button> <!> <span role=\"status\"> </span></div> <div class=\"arrangeable-cards\"></div>", 1);
function qo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "items", 24, () => []), i = $(t, "allIds", 24, () => []), a = $(t, "storageKey", 8), o = $(t, "expanded", 8, !0), s = $(t, "onToggleAll", 8, () => {}), c = /* @__PURE__ */ N("forward"), l = [
		"forward",
		"reverse",
		"free"
	], u = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N(null), p = /* @__PURE__ */ N(null), m = /* @__PURE__ */ N(null), h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(), _ = /* @__PURE__ */ N("");
	function v(e) {
		if (P(f, null), P(p, null), P(m, null), P(h, null), !e) {
			P(d, null), P(c, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			P(d, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			P(c, l.includes(n) ? n : H(d) ? "free" : "forward");
		} catch {
			P(d, null), P(c, "forward");
		}
	}
	function y(e) {
		if (P(d, e), !a()) {
			P(_, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(a(), JSON.stringify(e)) : localStorage.removeItem(a()), P(_, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			P(_, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function b() {
		if (C(), P(c, l[(l.indexOf(H(c)) + 1) % l.length]), P(_, ""), a()) try {
			localStorage.setItem(`${a()}:mode`, H(c));
		} catch {
			P(_, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function x(e, t, r) {
		H(c) === "free" && e !== t && (y(Ho(i(), H(d), H(n).map((e) => e.id), e, t, r)), P(f, e), await gr(), [...H(g).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus());
	}
	function S(e, t) {
		let r = H(n).findIndex((t) => t.id === e), i = H(n)[r + t];
		i && x(e, i.id, t > 0);
	}
	function C() {
		P(p, null), P(m, null), P(h, null);
	}
	function w(e, t) {
		if (H(m) === null || H(m) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		P(h, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	R(() => W(a()), () => {
		v(a());
	}), R(() => (W(r()), H(d), H(c)), () => {
		P(n, Bo(r(), H(d), H(c)));
	}), An(), Ni();
	var T = Ko(), ee = I(T), E = L(F(ee), 2), te = F(E), ne = F(te);
	A(te), A(E);
	var D = L(E, 2), re = F(D), ie = F(re), ae = (e) => {
		q(e, Uo());
	}, oe = (e) => {
		var t = Wo(), n = I(t), r = L(n);
		z(() => {
			Q(n, "d", H(c) === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"), Q(r, "d", H(c) === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10");
		}), q(e, t);
	};
	Y(ie, (e) => {
		H(c) === "free" ? e(ae) : e(oe, -1);
	}), A(re), A(D);
	var se = L(D, 2);
	ai(se, t, "filters", {}, null);
	var ce = L(se, 2), le = F(ce, !0);
	A(ce), A(ee);
	var ue = L(ee, 2);
	X(ue, 5, () => H(n), (e) => e.id, (e, n) => {
		var r = Go();
		let i;
		ai(F(r), t, "default", { get item() {
			return H(n);
		} }, null), A(r), z(() => {
			i = Z(r, 1, "arrangeable-card", null, i, {
				"card-selected": H(f) === H(n).id,
				"card-drop-before": H(h)?.id === H(n).id && !H(h).after,
				"card-drop-after": H(h)?.id === H(n).id && H(h).after
			}), Q(r, "aria-label", (H(n), H(f), U(() => `${H(n).title}${H(f) === H(n).id ? "，已選取" : ""}`))), Q(r, "data-card-id", (H(n), U(() => H(n).id))), Q(r, "draggable", (H(c), H(p), H(n), U(() => H(c) === "free" && H(p) === H(n).id)));
		}), G("pointerdown", r, (e) => {
			P(p, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (P(f, H(n).id), H(c) === "free" && e.pointerType === "mouse" && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || P(p, H(n).id))));
		}), G("pointerup", r, () => {
			P(p, null);
		}), G("keydown", r, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), P(f, H(n).id)) : e.key === "Escape" && P(f, null), H(c) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), S(H(n).id, e.key === "ArrowUp" ? -1 : 1)));
		}), wr("dragstart", r, (e) => {
			H(c) === "free" && H(p) === H(n).id && e.target === e.currentTarget && (P(m, H(n).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(H(n).id)));
		}), wr("dragend", r, C), wr("dragover", r, (e) => w(H(n), e)), wr("dragleave", r, (e) => {
			e.currentTarget.contains(e.relatedTarget) || P(h, null);
		}), wr("drop", r, (e) => {
			H(m) !== null && H(h)?.id === H(n).id && (e.preventDefault(), x(H(m), H(n).id, H(h).after), C());
		}), q(e, r);
	}), A(ue), Mi(ue, (e) => P(g, e), () => H(g)), z((e) => {
		Q(E, "aria-label", o() ? "全部收合" : "全部展開"), Q(E, "title", o() ? "全部收合" : "全部展開"), Q(ne, "d", o() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Q(D, "aria-label", e), Q(D, "title", (H(c), U(() => `${u[H(c)]}；點擊切換排序`))), J(le, H(_));
	}, [() => (H(c), U(() => `排序：${u[H(c)]}；切換為${u[l[(l.indexOf(H(c)) + 1) % l.length]]}`))]), G("click", E, () => s()(!o())), G("click", D, b), q(e, T), qe();
}
Tr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var Jo = /* @__PURE__ */ K("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), Yo = /* @__PURE__ */ K("<p class=\"task-summary\"> </p> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), Xo = /* @__PURE__ */ K("<a class=\"pointer-card-title-link\"> </a>"), Zo = /* @__PURE__ */ K("<span> </span>"), Qo = /* @__PURE__ */ K("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), $o = /* @__PURE__ */ K("<strong class=\"task-fraction\"> </strong>"), es = /* @__PURE__ */ K("<span role=\"status\">讀取目標報告中…</span>"), ts = /* @__PURE__ */ K("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), ns = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3> <!></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!></div></header>"), rs = /* @__PURE__ */ K("<article><!></article>");
function is(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "expanded", 8, !0), a = $(t, "onToggle", 8, () => {}), o = $(t, "task", 8), s = $(t, "state", 24, () => ({ status: "loading" })), c = {
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
	};
	function l(e) {
		return e ? c[e] ?? {
			label: e,
			tone: "muted"
		} : {
			label: "指路",
			tone: "muted"
		};
	}
	R(() => W(s()), () => {
		P(n, s().status === "ready" ? s().card : null);
	}), R(() => H(n), () => {
		P(r, H(n) ? c[H(n).status] ?? {
			label: H(n).status,
			tone: "muted"
		} : null);
	}), An(), Ni();
	var u = rs(), d = F(u);
	{
		let e = /* @__PURE__ */ wt(() => (W(o()), U(() => `task-body-${o().id}`)));
		Ja(d, {
			get expanded() {
				return i();
			},
			get onToggle() {
				return a();
			},
			get contentId() {
				return H(e);
			},
			get label() {
				return W(o()), U(() => o().title);
			},
			children: (e, t) => {
				var r = Fr(), i = I(r), a = (e) => {
					var t = Yo(), r = I(t), i = F(r, !0);
					A(r);
					var a = L(r, 2), o = F(a);
					A(a);
					var s = L(a, 2);
					X(s, 5, () => (H(n), U(() => H(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ wt(() => (H(t), U(() => l(H(t).status))));
						var r = Jo(), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r), z(() => {
							J(a, (H(t), U(() => H(t).title))), Z(o, 1, (W(H(n)), U(() => `status-badge status-${H(n).tone}`))), J(s, (W(H(n)), U(() => H(n).label)));
						}), q(e, r);
					}), A(s), z(() => {
						J(i, (H(n), U(() => H(n).summary))), Q(a, "aria-label", (H(n), U(() => `子任務完成 ${H(n).progress.completed}，共 ${H(n).progress.total}`))), J(o, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}（${H(n), U(() => H(n).progress.percentage) ?? ""}%）`);
					}), q(e, t);
				};
				Y(i, (e) => {
					H(n) && e(a);
				}), q(e, r);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var i = ns(), a = F(i), c = F(a), l = F(c), u = F(l), d = (e) => {
						var t = Xo(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "href", (W(s()), U(() => s().openHref))), J(n, (W(o()), U(() => o().title)));
						}), q(e, t);
					}, f = (e) => {
						var t = Pr();
						z(() => J(t, (W(o()), U(() => o().title)))), q(e, t);
					};
					Y(u, (e) => {
						W(s()), U(() => s().openHref) ? e(d) : e(f, -1);
					}), A(l);
					var p = L(l, 2), m = (e) => {
						var t = Zo(), n = F(t, !0);
						A(t), z(() => {
							Z(t, 1, (H(r), U(() => `status-badge status-${H(r).tone}`))), J(n, (H(r), U(() => H(r).label)));
						}), q(e, t);
					};
					Y(p, (e) => {
						H(r) && e(m);
					}), A(c);
					var h = L(c, 2), g = (e) => {
						var t = Qo();
						z(() => Q(t, "href", (W(s()), U(() => s().openHref)))), q(e, t);
					};
					Y(h, (e) => {
						W(s()), U(() => s().openHref) && e(g);
					}), A(a);
					var _ = L(a, 2), v = F(_), y = (e) => {
						var t = $o(), r = F(t);
						A(t), z(() => J(r, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}`)), q(e, t);
					};
					Y(v, (e) => {
						H(n) && e(y);
					});
					var b = L(v, 2), x = (e) => {
						q(e, es());
					};
					Y(b, (e) => {
						W(s()), U(() => s().status === "loading") && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = ts(), n = F(t, !0);
						A(t), z(() => J(n, (W(s()), U(() => s().message)))), q(e, t);
					};
					Y(S, (e) => {
						W(s()), U(() => s().status === "error") && e(C);
					}), A(_), A(i), z(() => Q(l, "id", (W(o()), U(() => `task-${o().id}-title`)))), q(e, i);
				}
			}
		});
	}
	A(u), z(() => {
		Z(u, 1, (H(r), U(() => `task-card pointer-card ${H(r) ? `status-${H(r).tone}` : ""}`))), Q(u, "aria-labelledby", (W(o()), U(() => `task-${o().id}-title`)));
	}), q(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var as = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>"), os = /* @__PURE__ */ K("<!> <!>", 1);
function ss(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "tasks", 24, () => []), i = $(t, "allIds", 24, () => []), a = $(t, "cardStorageKey", 8, null), o = $(t, "progress", 24, () => ({})), s = $(t, "editing", 8, !1), c = $(t, "policy", 8), l = $(t, "onCommand", 8, () => {}), u = $(t, "onAddItem", 8, () => {}), d = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), f = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), p = $(t, "onModuleActivate", 8, () => {}), m = $(t, "moduleOrder", 24, () => ["time"]), h = $(t, "onModuleReorder", 8, () => {}), g = $(t, "moduleTotals", 24, () => ({})), _ = $(t, "statusOrder", 24, () => ["done", "planned"]), v = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), y = $(t, "pointerCards", 24, () => ({})), b = /* @__PURE__ */ N(!0), x = /* @__PURE__ */ N({});
	function S(e) {
		let t = Ga(e);
		P(b, t.expanded), P(x, t.overrides);
	}
	function C(e, t) {
		P(x, {
			...H(x),
			[e]: t
		}), Ka(H(n), H(b), H(x));
	}
	function w(e) {
		P(b, e), P(x, {}), Ka(H(n), H(b), H(x));
	}
	R(() => W(a()), () => {
		P(n, `taskprogress.disclosure:${a() ?? location.href}`);
	}), R(() => H(n), () => {
		S(H(n));
	}), An(), Ni();
	var T = os(), ee = I(T);
	qo(ee, {
		get expanded() {
			return H(b);
		},
		onToggleAll: w,
		get items() {
			return r();
		},
		get allIds() {
			return i();
		},
		get storageKey() {
			return a();
		},
		children: _e,
		$$slots: { default: (e, t) => {
			let n = /* @__PURE__ */ wt(() => t.item);
			var r = Fr(), i = I(r), a = (e) => {
				{
					let t = /* @__PURE__ */ wt(() => (H(x), W(H(n)), H(b), U(() => H(x)[H(n).id] ?? H(b)))), r = /* @__PURE__ */ wt(() => (W(y()), W(H(n)), U(() => y()[H(n).id] ?? { status: "loading" })));
					is(e, {
						get expanded() {
							return H(t);
						},
						onToggle: (e) => C(H(n).id, e),
						get task() {
							return H(n);
						},
						get state() {
							return H(r);
						}
					});
				}
			}, v = (e) => {
				{
					let t = /* @__PURE__ */ wt(() => (H(x), W(H(n)), H(b), U(() => H(x)[H(n).id] ?? H(b)))), r = /* @__PURE__ */ wt(() => (W(d()), W(H(n)), U(() => d().get(H(n).id) ?? null))), i = /* @__PURE__ */ wt(() => (W(g()), W(H(n)), U(() => g()[H(n).id] ?? [])));
					Lo(e, {
						get expanded() {
							return H(t);
						},
						onToggle: (e) => C(H(n).id, e),
						get task() {
							return H(n);
						},
						get progress() {
							return W(o()), W(H(n)), U(() => o()[H(n).id]);
						},
						get editing() {
							return s();
						},
						get policy() {
							return c();
						},
						get onCommand() {
							return l();
						},
						onAddItem: (e, t) => u()(H(n).id, e, t),
						get timeTask() {
							return H(r);
						},
						get itemCapsules() {
							return f();
						},
						get onModuleActivate() {
							return p();
						},
						get moduleOrder() {
							return m();
						},
						get onModuleReorder() {
							return h();
						},
						get statusOrder() {
							return _();
						},
						get moduleTotals() {
							return H(i);
						}
					});
				}
			};
			Y(i, (e) => {
				W(H(n)), U(() => H(n).kind === "report_pointer") ? e(a) : e(v, -1);
			}), q(e, r);
		} }
	});
	var E = L(ee, 2), te = (e) => {
		var t = as(), n = F(t, !0);
		A(t), z(() => J(n, v())), q(e, t);
	};
	Y(E, (e) => {
		W(r()), U(() => !r().length) && e(te);
	}), q(e, T), qe();
}
//#endregion
//#region viewer/assets/theme-model.js
var cs = [
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
], ls = Object.freeze({
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
});
Object.freeze({
	version: 1,
	mode: "system"
});
var us = /^#[0-9a-f]{6}$/i;
function ds(e) {
	return typeof e == "string" && us.test(e);
}
function fs(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = ls[n], i = { base: n };
	for (let e of cs) {
		let n = t[e.key];
		i[e.key] = ds(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function ps(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function ms(e, t) {
	if (!ds(e) || !ds(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => ps(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function hs(e) {
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
	].filter(([, e, t]) => ms(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var gs = /* @__PURE__ */ K("<option> </option>"), _s = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), vs = /* @__PURE__ */ K("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), ys = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function bs(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(!1), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(fs(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(cs.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		P(h, e.base), P(g, v(e)), P(_, { ...H(g) });
		for (let e of H(p)) e?.setCustomValidity("");
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
		y(o() ? fs(o().base, o()) : fs(s())), P(f, !0);
	}
	function S() {
		P(f, !1);
	}
	function C(e) {
		y(fs(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		P(g, {
			...H(g),
			[e.key]: r
		}), P(_, {
			...H(_),
			[e.key]: r
		}), H(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), P(g, {
			...H(g),
			[e.key]: n.value
		}), r && P(_, {
			...H(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function ee() {
		P(m, a()), S();
	}
	function E() {
		let e = H(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(fs(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, fs(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, hs(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), An(), Ni();
	var te = ys(), ne = I(te), D = L(F(ne), 2);
	X(D, 5, () => u, (e) => e.value, (e, t) => {
		var n = gs(), r = F(n, !0);
		A(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), A(D), A(ne), ea(L(ne, 2), {
		get open() {
			return H(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: ee,
		children: (e, t) => {
			var a = vs(), o = L(I(a), 2), s = L(F(o), 2), c = F(s);
			c.value = c.__value = "light";
			var l = L(c);
			l.value = l.__value = "dark", A(s);
			var u;
			mi(s), A(o);
			var d = L(o, 2);
			X(d, 7, () => cs, (e) => e.key, (e, t, r) => {
				var i = _s(), a = F(i), o = F(a, !0);
				A(a);
				var s = L(a, 2), c = F(s);
				xi(c);
				var l = L(c, 2);
				xi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Mi(l, (e, t) => $t(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), A(s), A(i), z(() => {
					J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), Si(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), Si(l, (H(g), H(t), U(() => H(g)[H(t).key])));
				}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => T(H(t), e)), q(e, i);
			}), A(d);
			var f = L(d, 2);
			let m;
			var _ = F(f, !0);
			A(f);
			var v = L(f, 2), b = F(v), x = L(b, 4), S = L(x, 2);
			A(v), z(() => {
				u !== (u = H(h)) && (s.value = (s.__value = H(h)) ?? "", pi(s, H(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": H(r).length > 0 }), J(_, H(i));
			}), G("change", s, C), G("click", b, () => y(fs(H(h)))), G("click", x, ee), G("click", S, E), q(e, a);
		},
		$$slots: { default: !0 }
	}), G("change", D, b), hi(D, () => H(m), (e) => P(m, e)), q(e, te), qe();
}
Tr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var xs = /* @__PURE__ */ K("<span> </span>"), Ss = /* @__PURE__ */ K("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), Cs = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), ws = /* @__PURE__ */ K("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function Ts(e, t) {
	Ke(t, !1);
	let n = $(t, "item", 8), r = $(t, "activeEstimate", 8, null), i = $(t, "onApply", 8, () => ({ error: "" })), a = /* @__PURE__ */ N(r()?.likely_minutes ? String(r().likely_minutes / 60) : n().unset ? "" : String(n().likelyMinutes / 60)), o = /* @__PURE__ */ N(r()?.human_note ?? ""), s = /* @__PURE__ */ N(!!(r()?.human_confirmed ?? n().humanConfirmed)), c = /* @__PURE__ */ N("");
	function l() {
		let e = Number(H(a));
		if (!Number.isFinite(e) || e <= 0) {
			P(c, "工時必須大於 0。");
			return;
		}
		let t = i()({
			taskId: n().taskId,
			itemId: n().itemId,
			likelyMinutes: Math.round(e * 60),
			humanNote: H(o),
			humanConfirmed: H(s)
		});
		P(c, t?.error ?? "");
	}
	Ni();
	var u = ws(), d = F(u), f = F(d);
	X(L(F(f), 2), 1, () => (W(n()), U(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = xs(), r = F(n, !0);
		A(n), z(() => {
			Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), A(f);
	var p = L(f, 2), m = L(F(p), 2);
	xi(m), A(p), A(d);
	var h = L(d, 2);
	Yi(F(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = Ss(), i = L(F(r), 2);
			xi(i), A(r), z(() => Q(i, "aria-label", (W(n()), U(() => `「${n().title}」人工依據`)))), Di(i, () => H(o), (e) => P(o, e)), q(e, r);
		},
		$$slots: { default: !0 }
	}), A(h);
	var g = L(h, 2), _ = F(g);
	xi(_), Le(2), A(g);
	var v = L(g, 4), y = F(v);
	A(v);
	var b = L(v, 2), x = (e) => {
		var t = Cs(), n = F(t, !0);
		A(t), z(() => J(n, H(c))), q(e, t);
	};
	Y(b, (e) => {
		H(c) && e(x);
	}), A(u), z(() => {
		Q(m, "aria-label", (W(n()), U(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (W(n()), U(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (W(n()), U(() => `套用「${n().title}」人工估算草稿`)));
	}), wr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Di(m, () => H(a), (e) => P(a, e)), Oi(_, () => H(s), (e) => P(s, e)), q(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var Es = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> <span> </span></label>"), Ds = /* @__PURE__ */ K("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), Os = /* @__PURE__ */ K("<div class=\"spike-exception-list\"></div>"), ks = /* @__PURE__ */ K("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), As = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), js = /* @__PURE__ */ K("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function Ms(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "config", 8), i = $(t, "onApply", 8), a = $(t, "onPreview", 8), o = $(t, "onPendingChange", 8, () => {}), s = [
		{
			value: 1,
			label: "一"
		},
		{
			value: 2,
			label: "二"
		},
		{
			value: 3,
			label: "三"
		},
		{
			value: 4,
			label: "四"
		},
		{
			value: 5,
			label: "五"
		},
		{
			value: 6,
			label: "六"
		},
		{
			value: 7,
			label: "日"
		}
	], c = r().standard_allocation, l = r()?.project?.delivery_at ?? "", u = /* @__PURE__ */ N(l.slice(0, 16)), d = /* @__PURE__ */ N(""), f = /* @__PURE__ */ N(String(c.sleep_minutes_per_day / 60)), p = /* @__PURE__ */ N(String(c.life_minutes_per_day / 60)), m = /* @__PURE__ */ N(String(c.other_unavailable_minutes_per_day / 60)), h = /* @__PURE__ */ N([...c.working_weekdays]), g = 1, _ = /* @__PURE__ */ N((r().project?.capacity_exceptions ?? []).map((e) => ({
		key: g++,
		date: e.date,
		availableHours: String(e.available_minutes / 60),
		reason: e.reason ?? "",
		publicLabel: e.public_label ?? ""
	}))), v = /* @__PURE__ */ N("");
	function y() {
		let e = -(/* @__PURE__ */ new Date()).getTimezoneOffset(), t = e >= 0 ? "+" : "-", n = Math.abs(e);
		return `${t}${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
	}
	function b(e, t) {
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
			return y();
		}
	}
	function x() {
		P(v, ""), o()(!0);
	}
	function S(e, t) {
		P(h, t ? [.../* @__PURE__ */ new Set([...H(h), e])].sort((e, t) => e - t) : H(h).filter((t) => t !== e)), x();
	}
	function C(e, t, n) {
		P(_, H(_).map((r) => r.key === e ? {
			...r,
			[t]: n
		} : r)), x();
	}
	function w() {
		P(_, [...H(_), {
			key: g++,
			date: "",
			availableHours: "0",
			reason: "",
			publicLabel: ""
		}]), x();
	}
	function T(e) {
		P(_, H(_).filter((t) => t.key !== e)), x();
	}
	function ee() {
		if (!H(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${H(u)}:00${e ?? b(H(u), r().timezone)}`;
	}
	function E() {
		let e = i()({
			deliveryAt: ee(),
			deliveryReason: H(d),
			capacity: {
				sleepMinutes: Math.round(Number(H(f)) * 60),
				lifeMinutes: Math.round(Number(H(p)) * 60),
				otherUnavailableMinutes: Math.round(Number(H(m)) * 60),
				workingWeekdays: H(h),
				capacityExceptions: H(_).map((e) => ({
					date: e.date,
					availableMinutes: Math.round(Number(e.availableHours) * 60),
					reason: e.reason,
					publicLabel: e.publicLabel
				}))
			}
		});
		return P(v, e.error), e;
	}
	async function te() {
		E().error || (o()(!1), await a()());
	}
	R(() => (H(f), H(p), H(m)), () => {
		P(n, 24 - Number(H(f)) - Number(H(p)) - Number(H(m)));
	}), An(), Ni();
	var ne = js(), D = F(ne), re = L(F(D), 6), ie = F(re);
	A(re), A(D);
	var ae = L(D, 2), oe = F(ae), se = L(F(oe), 2), ce = F(se), le = L(F(ce));
	xi(le), A(ce);
	var ue = L(ce, 2), de = L(F(ue));
	xi(de), A(ue);
	var fe = L(ue, 2);
	A(se), A(oe);
	var pe = L(oe, 2), me = F(pe), he = L(F(me), 2);
	let ge;
	var _e = F(he);
	A(he), A(me);
	var ve = L(me, 2), ye = F(ve), be = L(F(ye));
	xi(be), A(ye);
	var xe = L(ye, 2), Se = L(F(xe));
	xi(Se), A(xe);
	var Ce = L(xe, 2), we = L(F(Ce));
	xi(we), A(Ce), A(ve);
	var Te = L(ve, 2);
	X(L(F(Te), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = Es(), r = F(n);
		xi(r);
		var i = L(r, 2), a = F(i);
		A(i), A(n), z((e) => {
			Ci(r, e), J(a, `週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(h), H(t), U(() => H(h).includes(H(t).value)))]), G("change", r, (e) => S(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(Te), A(pe);
	var Ee = L(pe, 2), De = F(Ee), Oe = L(F(De), 2);
	A(De);
	var ke = L(De, 2), Ae = (e) => {
		var t = Os();
		X(t, 5, () => H(_), (e) => e.key, (e, t) => {
			var n = Ds(), r = F(n), i = L(F(r));
			xi(i), A(r);
			var a = L(r, 2), o = L(F(a));
			xi(o), A(a);
			var s = L(a, 2), c = L(F(s));
			xi(c), A(s);
			var l = L(s, 2);
			A(n), z(() => {
				Si(i, (H(t), U(() => H(t).date))), Si(o, (H(t), U(() => H(t).availableHours))), Si(c, (H(t), U(() => H(t).publicLabel)));
			}), G("input", i, (e) => C(H(t).key, "date", e.currentTarget.value)), G("input", o, (e) => C(H(t).key, "availableHours", e.currentTarget.value)), G("input", c, (e) => C(H(t).key, "publicLabel", e.currentTarget.value)), G("click", l, () => T(H(t).key)), q(e, n);
		}), A(t), q(e, t);
	}, je = (e) => {
		q(e, ks());
	};
	Y(ke, (e) => {
		H(_), U(() => H(_).length) ? e(Ae) : e(je, -1);
	}), A(Ee);
	var Me = L(Ee, 2), Ne = F(Me), O = L(Ne, 2), Pe = (e) => {
		var t = As(), n = F(t, !0);
		A(t), z(() => J(n, H(v))), q(e, t);
	};
	Y(O, (e) => {
		H(v) && e(Pe);
	}), A(Me), A(ae), A(ne), z((e) => {
		J(ie, `時區：${W(r()), U(() => r().timezone) ?? ""}`), ge = Z(he, 1, "", null, ge, { invalid: !(H(n) > 0) }), J(_e, `工作 ${e ?? ""} hr`);
	}, [() => (H(n), U(() => Number.isFinite(H(n)) ? H(n) : "—"))]), G("input", le, x), Di(le, () => H(u), (e) => P(u, e)), G("input", de, x), Di(de, () => H(d), (e) => P(d, e)), G("click", fe, () => {
		P(u, ""), x();
	}), G("input", be, x), Di(be, () => H(f), (e) => P(f, e)), G("input", Se, x), Di(Se, () => H(p), (e) => P(p, e)), G("input", we, x), Di(we, () => H(m), (e) => P(m, e)), G("click", Oe, w), G("click", Ne, te), q(e, ne), qe();
}
Tr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var Ns = (e, t = g, n = g) => {
	var r = Bs(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o, !0);
	A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c), A(r), z((e) => {
		Z(r, 1, e), J(a, (t(), U(() => t().label))), J(s, (t(), U(() => t().value))), J(l, (t(), U(() => t().note)));
	}, [() => ui((n(), U(() => `time-evaluation-node ${n()}`.trim())))]), q(e, r);
}, Ps = (e, t = g) => {
	var n = Hs();
	X(n, 5, t, Xr, (e, t) => {
		var n = Vs(), r = F(n), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i), s = F(o, !0);
		A(o), A(r);
		var c = L(r, 2), l = F(c, !0);
		A(c), A(n), z(() => {
			J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, Fs = (e, t = g) => {
	var n = Us();
	Ps(L(F(n), 2), t), A(n), q(e, n);
}, Is = (e, t = g, n = g) => {
	var r = Ws(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o), c = F(s);
	Ns(c, () => (t(), U(() => t().engineeringLane.source)), () => ""), Ns(L(c, 4), () => (t(), U(() => t().engineeringLane.result)), () => "time-evaluation-result"), A(s);
	var l = L(s, 2), u = F(l);
	Ns(u, () => (t(), U(() => t().capacityLane.source)), () => ""), Ns(L(u, 4), () => (t(), U(() => t().capacityLane.result)), () => "time-evaluation-result"), A(l), A(o);
	var d = L(o, 2);
	Ns(L(F(d), 2), () => (t(), U(() => t().merge)), () => (t(), U(() => t().merge.className))), A(d);
	var f = L(d, 2), p = F(f);
	Ns(p, () => (t(), U(() => t().risk.trend)), () => ""), Ns(L(p, 4), () => (t(), U(() => t().risk.result)), () => (t(), U(() => t().risk.result.className))), A(f);
	var m = L(f, 2), h = F(m, !0);
	A(m), A(r), z(() => {
		Q(r, "hidden", !n()), J(a, (t(), U(() => t().intro))), J(h, (t(), U(() => t().note)));
	}), q(e, r);
}, Ls = (e, t = g, n = g) => {
	var r = qs(), i = F(r);
	Ki(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	Yi(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), U(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = Gs(), i = I(r), a = F(i, !0);
			A(i);
			var o = L(i, 2), s = F(o, !0);
			A(o), z(() => {
				J(a, (t(), U(() => t().explanation.text))), J(s, (t(), U(() => t().explanation.formula)));
			}), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2);
	Yi(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = Ks(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), Fs(L(o, 2), () => (t(), U(() => t().composition))), A(r), z(() => Q(r, "hidden", !n())), q(e, r);
}, Rs = (e, t = g, n = g) => {
	var r = Xs(), i = L(F(r), 2);
	Ki(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	Yi(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = Js(), i = L(I(r), 2), a = F(i, !0);
			A(i), z(() => J(a, (t(), U(() => t().formulaCode)))), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2), s = F(o), c = F(s, !0);
	A(s);
	var l = L(s, 2), u = F(l), d = (e) => {
		var n = Fr();
		X(I(n), 1, () => (t(), U(() => t().exceptions)), Xr, (e, t) => {
			var n = Vs(), r = F(n), i = F(r), a = F(i, !0);
			A(i);
			var o = L(i), s = F(o, !0);
			A(o), A(r);
			var c = L(r, 2), l = F(c, !0);
			A(c), A(n), z(() => {
				J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
			}), q(e, n);
		}), q(e, n);
	}, f = (e) => {
		q(e, Ys());
	};
	Y(u, (e) => {
		t(), U(() => t().exceptions) ? e(d) : e(f, -1);
	}), A(l), A(o), A(r), z(() => {
		Q(r, "hidden", !n()), J(c, (t(), U(() => t().exceptionsHeading)));
	}), q(e, r);
}, zs = (e, t = g) => {
	var n = Zs(), r = F(n), i = F(r, !0);
	A(r);
	var a = L(r, 2);
	Ki(a, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var o = L(a, 2);
	Yi(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = Ks(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), Fs(L(o, 2), () => (t(), U(() => t().composition))), A(n), z(() => J(i, (t(), U(() => t().intro)))), q(e, n);
}, Bs = /* @__PURE__ */ K("<div><span> </span> <strong> </strong> <small> </small></div>"), Vs = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), Hs = /* @__PURE__ */ K("<div class=\"time-source-list\"></div>"), Us = /* @__PURE__ */ K("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), Ws = /* @__PURE__ */ K("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), Gs = /* @__PURE__ */ K("<p> </p> <code class=\"time-formula\"> </code>", 1), Ks = /* @__PURE__ */ K("<p> </p>"), qs = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), Js = /* @__PURE__ */ K("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), Ys = /* @__PURE__ */ K("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), Xs = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), Zs = /* @__PURE__ */ K("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), Qs = /* @__PURE__ */ K("<span> </span>"), $s = /* @__PURE__ */ K("<!> <div class=\"time-item-rationale\"><!></div>", 1), ec = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), tc = /* @__PURE__ */ K("<code class=\"time-formula\"> </code>"), nc = /* @__PURE__ */ K("<code class=\"time-reference\"> </code>"), rc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), ic = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), ac = /* @__PURE__ */ K("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), oc = /* @__PURE__ */ K("<!> <!>", 1), sc = /* @__PURE__ */ K("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), cc = /* @__PURE__ */ K("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), lc = /* @__PURE__ */ K("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), uc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), dc = /* @__PURE__ */ K("<div class=\"time-dialog-content\"><!></div>");
function fc(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ N([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await gr(), H(g)[r]?.focus();
	}
	Ni();
	{
		let t = /* @__PURE__ */ wt(() => `關閉${i()}`);
		ea(e, {
			get open() {
				return n();
			},
			get kicker() {
				return i();
			},
			get title() {
				return a();
			},
			id: "time-dialog",
			dialogClass: "time-dialog",
			titleId: "time-dialog-title",
			get closeLabel() {
				return H(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = dc(), i = F(n), c = (e) => {
					var t = rc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var o = L(r, 2), c = F(o, !0);
					A(o), A(n);
					var u = L(n, 2), m = (e) => {
						var t = Fr();
						Yr(I(t), () => (W(s()), W(f()), U(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ wt(() => (W(s()), W(a()), U(() => ({
									...s(),
									title: a()
								}))));
								Ts(e, {
									get item() {
										return H(t);
									},
									get activeEstimate() {
										return f();
									},
									get onApply() {
										return p();
									}
								});
							}
						}), q(e, t);
					}, h = (e) => {
						var t = $s(), n = I(t);
						Qi(n, {
							label: "預估工時",
							get value() {
								return W(s()), U(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Fr();
								X(I(n), 1, () => (W(s()), U(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = Qs(), r = F(n, !0);
									A(n), z(() => {
										Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
									}), q(e, n);
								}), q(e, n);
							} }
						});
						var r = L(n, 2);
						Yi(F(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = Ks(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().rationale)))), q(e, n);
							},
							$$slots: { default: !0 }
						}), A(r), q(e, t);
					};
					Y(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = L(u, 2), _ = F(g);
					Ki(_, { get metrics() {
						return W(s()), U(() => s().technical.metrics);
					} });
					var v = L(_, 2), y = (e) => {
						var t = ec(), n = F(t), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = F(a, !0);
						A(a), A(n);
						var c = L(n, 2), l = F(c, !0);
						A(c), A(t), z(() => {
							J(i, (W(s()), U(() => s().technical.analysisMethod.name))), J(o, (W(s()), U(() => s().technical.analysisMethod.note))), J(l, (W(s()), U(() => s().technical.analysisMethod.version)));
						}), q(e, t);
					};
					Y(v, (e) => {
						W(s()), U(() => s().technical.analysisMethod) && e(y);
					});
					var b = L(v, 2), x = (e) => {
						Yi(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = tc(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().technical.formula)))), q(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					Y(b, (e) => {
						W(s()), U(() => s().technical.formula) && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = nc(), n = F(t, !0);
						A(t), z(() => J(n, (W(s()), U(() => s().technical.reference)))), q(e, t);
					};
					Y(S, (e) => {
						W(s()), U(() => s().technical.reference) && e(C);
					}), A(g), A(t), z(() => {
						Z(r, 1, ui((W(s()), U(() => s().confidenceClass)))), J(i, (W(s()), U(() => s().confidenceLabel))), J(c, (W(s()), U(() => s().toggleLabel))), Q(g, "hidden", (W(s()), U(() => !s().detailsExpanded)));
					}), G("click", o, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, v = (e) => {
					var t = uc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var a = L(r, 2), s = F(a, !0);
					A(a), A(n);
					var c = L(n, 2), f = F(c);
					X(f, 5, () => (W(o()), U(() => o().overview)), Xr, (e, t) => {
						var n = ac(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = F(a), s = (e) => {
							var n = ic();
							z(() => Z(n, 1, `time-risk-dot ${H(t), U(() => H(t).urgencyClassName) ?? ""}`)), q(e, n);
						};
						Y(o, (e) => {
							H(t), U(() => H(t).urgencyClassName) && e(s);
						});
						var c = L(o);
						A(a), A(n), z(() => {
							J(i, (H(t), U(() => H(t).label))), J(c, ` ${H(t), U(() => H(t).value) ?? ""}`);
						}), q(e, n);
					}), A(f);
					var p = L(f, 2), v = F(p, !0);
					A(p), A(c);
					var y = L(c, 2), b = F(y), x = (e) => {
						var t = Fr(), n = I(t), r = (e) => {
							var t = oc(), n = I(t);
							Ms(n, {
								get config() {
									return W(m()), U(() => m().config);
								},
								get onApply() {
									return W(m()), U(() => m().onApply);
								},
								get onPreview() {
									return W(m()), U(() => m().onPreview);
								},
								get onPendingChange() {
									return W(m()), U(() => m().onPendingChange);
								}
							});
							var r = L(n, 2), i = (e) => {
								fa(e, { get preview() {
									return h();
								} });
							};
							Y(r, (e) => {
								h() && e(i);
							}), q(e, t);
						}, i = (e) => {
							var t = sc(), n = L(F(t), 4);
							A(t), G("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), q(e, t);
						};
						Y(n, (e) => {
							W(m()), U(() => m().hasConfig) ? e(r) : e(i, -1);
						}), q(e, t);
					}, S = (e) => {
						var t = lc(), n = I(t);
						X(n, 7, () => (W(o()), U(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = cc(), i = F(r, !0);
							A(r), Mi(r, (e, t) => $t(g, H(g)[t] = e), (e) => H(g)?.[e], () => [H(n)]), z(() => {
								Q(r, "id", (H(t), U(() => `time-${H(t).name}-tab`))), Q(r, "aria-controls", (H(t), U(() => `time-${H(t).name}-panel`))), Q(r, "aria-selected", (W(o()), H(t), U(() => o().activeTab === H(t).name))), Q(r, "tabindex", (W(o()), H(t), U(() => o().activeTab === H(t).name ? 0 : -1))), J(i, (H(t), U(() => H(t).label)));
							}), G("click", r, () => u()(H(t).name)), G("keydown", r, (e) => _(e, H(n), o().tabs)), q(e, r);
						}), A(n);
						var r = L(n, 2);
						Is(r, () => (W(o()), U(() => o().flow)), () => (W(o()), U(() => o().activeTab === "flow")));
						var i = L(r, 2);
						Ls(i, () => (W(o()), U(() => o().engineering)), () => (W(o()), U(() => o().activeTab === "engineering"))), Rs(L(i, 2), () => (W(o()), U(() => o().capacity)), () => (W(o()), U(() => o().activeTab === "capacity"))), q(e, t);
					}, C = (e) => {
						zs(e, () => (W(o()), U(() => o().estimateOnly)));
					};
					Y(b, (e) => {
						d() && m() ? e(x) : (W(o()), U(() => o().hasDeadline) ? e(S, 1) : e(C, -1));
					}), A(y), A(t), z(() => {
						J(i, (W(o()), U(() => o().captionLabel))), Q(a, "aria-expanded", (W(o()), U(() => o().detailsExpanded))), J(s, (W(o()), U(() => o().toggleLabel))), J(v, (W(o()), U(() => o().updatedLabel))), Q(y, "hidden", (W(o()), U(() => !o().detailsExpanded)));
					}), G("click", a, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				};
				Y(i, (e) => {
					r() === "item" && s() ? e(c) : r() === "project" && o() && e(v, 1);
				}), A(n), q(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	qe();
}
Tr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var pc = /* @__PURE__ */ K("<span class=\"time-risk-dot\"></span>"), mc = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), hc = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>");
function gc(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = hc(), d = F(u), f = F(d, !0);
	A(d);
	var p = L(d, 2), m = (e) => {
		q(e, pc());
	};
	Y(p, (e) => {
		s() && e(m);
	});
	var h = L(p, 2), g = (e) => {
		q(e, mc());
	};
	Y(h, (e) => {
		c() && e(g);
	}), A(u), z(() => {
		Z(u, 1, ui(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), J(f, o());
	}), G("click", u, function(...e) {
		l()?.apply(this, e);
	}), q(e, u);
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var _c = {
	"task-list": ss,
	"status-overview": Wa,
	"status-filters": Ha,
	"project-progress": Aa,
	"report-summary": Na,
	"mode-toggle": va,
	"save-bar": Ba,
	"add-control": Hi,
	diagnostics: ga,
	"scope-directory": Ia,
	"theme-control": bs,
	"project-module-strip": wa,
	"time-summary-button": gc,
	"time-dialog": fc,
	"cost-dialog": sa,
	"delivery-save-confirmation": ma
}, vc = {
	id: "svelte",
	regions: Object.keys(_c),
	mount(e, t, n) {
		let r = an({ ...n });
		return {
			component: Br(_c[e], {
				target: t,
				props: r
			}),
			state: r
		};
	},
	update(e, t) {
		return Object.assign(e.state, t), e;
	},
	destroy(e) {
		Wr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(vc);
//#endregion
