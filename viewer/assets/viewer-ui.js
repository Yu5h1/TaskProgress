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
var b = 1024, x = 2048, S = 4096, C = 8192, w = 16384, T = 32768, ee = 1 << 25, te = 65536, ne = 1 << 19, re = 1 << 20, E = 1 << 25, ie = 65536, D = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
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
	return Fe(/* @__PURE__ */ gn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ gn(k) !== null) throw je(), t;
		k = e;
	}
}
function Le(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ gn(n);
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
		var i = /* @__PURE__ */ gn(n);
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
var Ge = null;
function Ke(e) {
	Ge = e;
}
function qe(e, t = !1, n) {
	Ge = {
		p: Ge,
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
function Je(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Dn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ge = t.p, e ?? {};
}
function Ye() {
	return !Ue || Ge !== null && Ge.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Xe = [];
function Ze() {
	var e = Xe;
	Xe = [], v(e);
}
function Qe(e) {
	if (Xe.length === 0 && !Pt) {
		var t = Xe;
		queueMicrotask(() => {
			t === Xe && Ze();
		});
	}
	Xe.push(e);
}
function $e() {
	for (; Xe.length > 0;) Ze();
}
function et(e) {
	var t = V;
	if (t === null) return B.f |= oe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	tt(e, t);
}
function tt(e, t) {
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
var nt = ~(x | S | b);
function rt(e, t) {
	e.f = e.f & nt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? rt(e, b) : rt(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ie, at(t.deps));
}
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), at(e.deps), rt(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var st = !1;
function ct(e) {
	var t = st;
	try {
		return st = !1, [e(), st];
	} finally {
		st = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function lt(e) {
	O && /* @__PURE__ */ hn(e) !== null && _n(e);
}
var ut = !1;
function dt() {
	ut || (ut = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ft(e) {
	var t = B, n = V;
	Qn(null), $n(null);
	try {
		return e();
	} finally {
		Qn(t), $n(n);
	}
}
function pt(e, t, n, r = n) {
	e.addEventListener(t, () => ft(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), dt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function mt(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		wn() && (H(n), Nn(() => (t === 0 && (r = U(() => e(() => nn(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ht = te | ne;
function gt(e, t, n, r) {
	new _t(e, t, n, r);
}
var _t = class {
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
	#h = mt(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Pn(() => {
			if (O) {
				let e = this.#t;
				Ie();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ht), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = Fn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Qe(r), t && (this.#s = Fn(() => {
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
			t = !0, n && ke(), this.#s !== null && Hn(this.#s, () => {
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
					tt(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Fn(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = mn();
			e.append(t), this.#a = this.#S(() => Fn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Hn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Fn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Kn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Fn(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ot(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = Ge;
		$n(this.#i), Qn(this.#i), Ke(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} catch (e) {
			return et(e), null;
		} finally {
			$n(t), Qn(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Hn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
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
		this.#a &&= (zn(this.#a), null), this.#o &&= (zn(this.#o), null), this.#s &&= (zn(this.#s), null), O && (Fe(this.#t), Le(), Fe(Re()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Fn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return tt(e, this.#i.parent), null;
				}
			}));
		};
		Qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				tt(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => tt(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function vt(e, t, n, r) {
	let i = Ye() ? St : j;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = yt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				tt(e, s);
			}
			bt();
		}
	}
	var d = xt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ wt(e))).then(u).catch((e) => tt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), bt();
	}) : f();
}
function yt() {
	var e = V, t = B, n = Ge, r = M;
	return function(i = !0) {
		$n(e), Qn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function bt(e = !0) {
	$n(null), Qn(null), Ke(null), e && M?.deactivate();
}
function xt() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	var t = 2 | x;
	return V !== null && (V.f |= ne), {
		ctx: Ge,
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
var Ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function wt(e, t, r) {
	let i = V;
	i === null && ye();
	var a = void 0, o = Zt(n), s = !B, c = /* @__PURE__ */ new Set();
	return Mn(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(bt);
		} catch (e) {
			n.reject(e), bt();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = xt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Ct);
			else for (let e of c.values()) e.reject(Ct);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ct && (r.activate(), t ? (o.f |= oe, en(o, t)) : (o.f & 8388608 && (o.f ^= oe), en(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Tn(() => {
		for (let e of c) e.reject(Ct);
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
function j(e) {
	let t = /* @__PURE__ */ St(e);
	return t.equals = He, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) zn(t[n]);
	}
}
function Et(e) {
	var t, r = V, i = e.parent;
	if (!Yn && i !== null && e.v !== n && i.f & 24576) return Ae(), e.v;
	$n(i);
	try {
		e.f &= ~ie, Tt(e), t = pr(e);
	} finally {
		$n(r);
	}
	return t;
}
function Dt(e) {
	var t = Et(e);
	if (!e.equals(t) && (e.wv = ur(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null))) {
		rt(e, b);
		return;
	}
	Yn || (Mt === null ? it(e) : (wn() || M?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ft(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = g), hr(t, 0), Ln(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && gr(t);
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
			for (var r of n.d) rt(r, x), t(r);
			for (r of n.m) rt(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Rt++ > 1e3 && (this.#x(), Ht());
		for (let e of this.#u) this.#d.delete(e), rt(e, x), this.schedule(e);
		for (let e of this.#d) rt(e, S), this.schedule(e);
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
				a ? r.f ^= b : i & 4 ? t.push(r) : dr(r) && (i & 16 && this.#d.add(r), gr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), rt(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
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
		for (let e of this.async_deriveds.values()) e.reject(Ct);
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
		this.#m || (this.#m = !0, Qe(() => {
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
			!Ft && !Pt && Qe(() => {
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
			if ($e(), M === null) return n;
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
		tt(e, Nt);
	}
}
var Ut = null;
function Wt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && dr(r) && (Ut = /* @__PURE__ */ new Set(), gr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Vn(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || gr(n);
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
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), rt(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	rt(e, b);
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
	return tr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = He), Ue && n && Ge !== null && Ge.l !== null && (Ge.l.s ??= []).push(r), r;
}
function $t(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!Zn || B.f & 131072) && Ye() && B.f & 4325394 && (er === null || !er.has(e)) && Oe(), en(e, n ? an(t) : t, Lt);
}
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Yt.set(e, Yn ? t : e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && it(t);
		}
		e.wv = ur(), rn(e, x, n), Ye() && V !== null && V.f & 1024 && !(V.f & 96) && (ir === null ? ar([e]) : ir.push(e)), !r.is_fork && Jt.size > 0 && !Xt && tn();
	}
	return t;
}
function tn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && rt(e, S);
		let t;
		try {
			t = dr(e);
		} catch {
			t = !0;
		}
		t && gr(e);
	}
	Jt.clear();
}
function nn(e) {
	P(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && rt(s, t), c & 131072) Jt.add(s);
			else if (c & 2) {
				var u = s;
				Mt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= ie), rn(u, S, n));
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
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Qt(0), s = null, c = cr, l = (e) => {
		if (cr === c) return e();
		var t = B, n = cr;
		Qn(null), lr(c);
		var r = e();
		return Qn(t), lr(n), r;
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
var cn, ln, un, dn, fn;
function pn() {
	if (cn === void 0) {
		cn = window, ln = document, un = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		dn = u(t, "firstChild").get, fn = u(t, "nextSibling").get, h(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), h(n) && (n[pe] = void 0);
	}
}
function mn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function hn(e) {
	return dn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function gn(e) {
	return fn.call(e);
}
function F(e, t) {
	if (!O) return /* @__PURE__ */ hn(e);
	var n = /* @__PURE__ */ hn(k);
	if (n === null) n = k.appendChild(mn());
	else if (t && n.nodeType !== 3) {
		var r = mn();
		return n?.before(r), Fe(r), r;
	}
	return t && bn(n), Fe(n), n;
}
function I(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ hn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ gn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = mn();
			return k?.before(r), Fe(r), r;
		}
		bn(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ gn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = mn();
			return r === null ? i?.after(a) : r.before(a), Fe(a), a;
		}
		bn(r);
	}
	return Fe(r), r;
}
function _n(e) {
	e.textContent = "";
}
function vn() {
	return !1;
}
function yn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function bn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function xn(e) {
	V === null && (B === null && Ce(e), Se()), Yn && xe(e);
}
function Sn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Cn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: Ge,
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
			gr(r);
		} catch (e) {
			throw zn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && Sn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function wn() {
	return B !== null && !Zn;
}
function Tn(e) {
	let t = Cn(8, null);
	return rt(t, b), t.teardown = e, t;
}
function En(e) {
	xn("$effect");
	var t = V.f;
	if (!B && t & 32 && Ge !== null && !Ge.i) {
		var n = Ge;
		(n.e ??= []).push(e);
	} else return Dn(e);
}
function Dn(e) {
	return Cn(4 | re, e);
}
function On(e) {
	return xn("$effect.pre"), Cn(8 | re, e);
}
function kn(e) {
	Bt.ensure();
	let t = Cn(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Hn(t, () => {
			zn(t), n(void 0);
		}) : (zn(t), n(void 0));
	});
}
function An(e) {
	return Cn(4, e);
}
function R(e, t) {
	var n = Ge, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Nn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				$n(n.parent), U(t);
			} finally {
				$n(n);
			}
		}
	});
}
function jn() {
	var e = Ge;
	Nn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && rt(n, S), dr(n) && gr(n), t.ran = !1;
		}
	});
}
function Mn(e) {
	return Cn(ae | ne, e);
}
function Nn(e, t = 0) {
	return Cn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	vt(r, t, n, (t) => {
		Cn(8, () => {
			e(...t.map(H));
		});
	});
}
function Pn(e, t = 0) {
	return Cn(16 | t, e);
}
function Fn(e) {
	return Cn(32 | ne, e);
}
function In(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Yn, n = B;
		Xn(!0), Qn(null);
		try {
			t.call(null);
		} finally {
			Xn(e), Qn(n);
		}
	}
}
function Ln(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ft(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : zn(n, t), n = r;
	}
}
function Rn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || zn(t), t = n;
	}
}
function zn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Bn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, Ln(e, t && !n), hr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	In(e), e.f ^= ee, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && Vn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Bn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ gn(e);
		e.remove(), e = n;
	}
}
function Vn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Hn(e, t, n = !0) {
	var r = [];
	Un(e, r, !0);
	var i = () => {
		n && zn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Un(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Un(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Wn(e) {
	Gn(e, !0);
}
function Gn(e, t) {
	if (e.f & 8192) {
		e.f ^= C, e.f & 1024 || (rt(e, x), Bt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Gn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Kn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ gn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var qn = null, Jn = !1, Yn = !1;
function Xn(e) {
	Yn = e;
}
var B = null, Zn = !1;
function Qn(e) {
	B = e;
}
var V = null;
function $n(e) {
	V = e;
}
var er = null;
function tr(e) {
	B !== null && (er ??= /* @__PURE__ */ new Set()).add(e);
}
var nr = null, rr = 0, ir = null;
function ar(e) {
	ir = e;
}
var or = 1, sr = 0, cr = sr;
function lr(e) {
	cr = e;
}
function ur() {
	return ++or;
}
function dr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ie), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (dr(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && rt(e, b);
	}
	return !1;
}
function fr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(er !== null && er.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? fr(a, t, !1) : t === a && (n ? rt(a, x) : a.f & 1024 && rt(a, S), Gt(a));
	}
}
function pr(e) {
	var t = nr, n = rr, r = ir, i = B, a = er, o = Ge, s = Zn, c = cr, l = e.f;
	nr = null, rr = 0, ir = null, B = l & 96 ? null : e, er = null, Ke(e.ctx), Zn = !1, cr = ++sr, e.ac !== null && (ft(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= D;
		var u = e.fn, d = u();
		e.f |= T;
		var f = e.deps, p = M?.is_fork;
		if (nr !== null) {
			var m;
			if (p || hr(e, rr), f !== null && rr > 0) for (f.length = rr + nr.length, m = 0; m < nr.length; m++) f[rr + m] = nr[m];
			else e.deps = f = nr;
			if (wn() && e.f & 512) for (m = rr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && rr < f.length && (hr(e, rr), f.length = rr);
		if (Ye() && ir !== null && !Zn && f !== null && !(e.f & 6146)) for (m = 0; m < ir.length; m++) fr(ir[m], e);
		if (i !== null && i !== e) {
			if (sr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = sr;
			if (t !== null) for (let e of t) e.rv = sr;
			ir !== null && (r === null ? r = ir : r.push(...ir));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (e) {
		return et(e);
	} finally {
		e.f ^= D, nr = t, rr = n, ir = r, B = i, er = a, Ke(o), Zn = s, cr = c;
	}
}
function mr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (nr === null || !s.call(nr, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~ie), c.v !== n && it(c), c.ac !== null && ft(() => {
			c.ac.abort(he), c.ac = null, rt(c, x);
		}), Ot(c), hr(c, 0);
	}
}
function hr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) mr(e, n[r]);
}
function gr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		rt(e, b);
		var n = V, r = Jn;
		V = e, Jn = !(t & 96);
		try {
			t & 16777232 ? Rn(e) : Ln(e), In(e);
			var i = pr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = or;
		} finally {
			Jn = r, V = n;
		}
	}
}
async function _r() {
	await Promise.resolve(), Vt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (qn?.add(e), B !== null && !Zn && !(V !== null && V.f & 16384) && (er === null || !er.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < sr && (e.rv = sr, nr === null && n !== null && n[rr] === e ? rr++ : nr === null ? nr = [e] : nr.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Yn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Yn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || yr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Zn && B !== null && (Jn || !!(B.f & 512)), c = (i.f & T) === 0;
		dr(i) && (o && (i.f |= 512), Dt(i)), o && !c && (kt(i), vr(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function vr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (kt(t), vr(t));
}
function yr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && yr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Zn;
	try {
		return Zn = !0, e();
	} finally {
		Zn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) br(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && br(n);
		}
	}
}
function br(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			br(e[n], t);
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
var xr = Symbol("events"), Sr = /* @__PURE__ */ new Set(), Cr = /* @__PURE__ */ new Set();
function wr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Or.call(t, e), !e.cancelBubble) return ft(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Tr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = wr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Tn(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[xr] ??= {})[e] = n;
}
function Er(e) {
	for (var t = 0; t < e.length; t++) Sr.add(e[t]);
	for (var n of Cr) n(e);
}
var Dr = null;
function Or(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Dr = e;
	var o = 0, s = Dr === e && e[xr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[xr] = t;
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
		Qn(null), $n(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[xr]?.[r];
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
			e[xr] = t, delete e.currentTarget, Qn(d), $n(f);
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
	var t = yn("template");
	return t.innerHTML = Ar(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mr(e, t) {
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
		if (O) return Mr(k, null), k;
		i === void 0 && (i = jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ hn(i)));
		var t = r || un ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ hn(t), s = t.lastChild;
			Mr(o, s);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return Mr(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ hn(jr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ hn(e);) o.appendChild(/* @__PURE__ */ hn(e));
			else o = /* @__PURE__ */ hn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ hn(t), r = t.lastChild;
			Mr(n, r);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Pr(e, t) {
	return /* @__PURE__ */ Nr(e, t, "svg");
}
function Fr(e = "") {
	if (!O) {
		var t = mn(e + "");
		return Mr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? bn(n) : (n.before(n = mn()), Fe(n)), Mr(n, n), n;
}
function Ir() {
	if (O) return Mr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = mn();
	return e.append(t, n), Mr(t, n), e;
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
var Lr = ["touchstart", "touchmove"];
function Rr(e) {
	return Lr.includes(e);
}
var zr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Br(e) {
	return zr.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Vr(e, t) {
	return Ur(e, t);
}
var Hr = /* @__PURE__ */ new Map();
function Ur(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	pn();
	var u = void 0, d = kn(() => {
		var s = r ?? n.appendChild(mn());
		gt(s, { pending: () => {} }, (n) => {
			qe({});
			var r = Ge;
			if (o && (r.c = o), a && (i.$$events = a), O && Mr(n, null), u = e(n, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw je(), t;
			Je();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Rr(r);
					for (let e of [n, document]) {
						var a = Hr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Hr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Or, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(Sr)), Cr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Hr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Or), t.delete(e), t.size === 0 && Hr.delete(r)) : t.set(e, i);
			}
			Cr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Wr.set(u, d), u;
}
var Wr = /* @__PURE__ */ new WeakMap();
function Gr(e, t) {
	let n = Wr.get(e);
	return n ? (Wr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Kr = class {
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
			if (n) Wn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Wn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (zn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Kn(r, t), t.append(mn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else zn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Hn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (zn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = vn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = mn();
			i.append(a), this.#n.set(e, {
				effect: Fn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Fn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
function qr(e) {
	Ge === null && ve("onMount"), Ue && Ge.l !== null ? Yr(Ge).m.push(e) : En(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Jr(e) {
	Ge === null && ve("onDestroy"), qr(() => () => U(e));
}
function Yr(e) {
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
	var i = new Kr(e), a = n ? te : 0;
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
	Pn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Xr = Symbol("NaN");
function Zr(e, t, n) {
	O && Ie();
	var r = new Kr(e), i = !Ye();
	Pn(() => {
		var e = t();
		e !== e && (e = Xr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Qr(e, t) {
	return t;
}
function $r(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Hn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					ei(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			_n(d), d.append(u), e.items.clear();
		}
		ei(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function ei(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= E, Kn(a, document.createDocumentFragment())) : zn(t[i], n);
	}
}
var ti;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = O ? Fe(/* @__PURE__ */ hn(u)) : u.appendChild(mn());
	}
	O && Ie();
	var d = null, f = /* @__PURE__ */ j(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, ri(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= E, ai(d, null, s)) : Wn(d) : Hn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Pn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			O && ze(s) === "[!" != (e === 0) && (s = Re(), Fe(s), Pe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = vn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (s = k, a = !0, Pe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && u.unskip_effect(S.e)) : (S = ii(l, h ? s : ti ??= mn(), b, x, y, i, t, n), h || (S.e.f |= E), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Fn(() => o(s)) : (d = Fn(() => o(ti ??= mn())), d.f |= E)), e > c.size && be("", "", ""), O && e > 0 && Fe(Re()), !h) if (m.set(u, c), v) {
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
function ni(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function ri(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ni(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Wn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= E, _ === l) ai(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), oi(e, d, _), oi(e, _, y), ai(_, y, n), d = _, p = [], m = [], l = ni(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) ai(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					oi(e, S.prev, C.next), oi(e, d, S), oi(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), ai(_, l, n), oi(e, _.prev, _.next), oi(e, _, d === null ? e.effect.first : d.next), oi(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = ni(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = ni(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (ei(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ni(l.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			$r(e, w, ee);
		}
	}
	a && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ii(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Fn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ai(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ gn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function oi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function si(e, t, n, r, i) {
	O && Ie();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function ci(e, t, n, r, a, o) {
	let s = O;
	O && Ie();
	var c = null;
	O && k.nodeType === 1 && (c = k, Ie());
	var l = O ? k : e, u = new Kr(l, !1);
	Pn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = O ? c : yn(e, o), Mr(c, c), r) {
					var n = null;
					O && Br(e) && c.append(n = document.createComment(""));
					var i = O ? /* @__PURE__ */ hn(c) : c.appendChild(mn());
					O && (i === null ? Pe(!1) : Fe(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			O && Fe(t);
		}), () => {};
	}, te), Tn(() => {}), s && (Pe(!0), Fe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function li(e, t, n) {
	An(() => {
		var r = U(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Nn(() => {
				var e = n();
				W(e), i && Ve(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ui(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ui(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function di() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ui(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function fi(e) {
	return typeof e == "object" ? di(e) : e ?? "";
}
var pi = [..." 	\n\r\f\xA0\v﻿"];
function mi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || pi.includes(r[o - 1])) && (s === r.length || pi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function hi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function gi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function _i(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(gi)), i && c.push(...Object.keys(i).map(gi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = gi(e.substring(l, u).trim());
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
		return r && (n += hi(r)), i && (n += hi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[de];
	if (O || o !== n || o === void 0) {
		var s = mi(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function vi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function yi(e, t, n, r) {
	var i = e[fe];
	if (O || i !== t) {
		var a = _i(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[fe] = t;
	} else r && (Array.isArray(r) ? (vi(e, n?.[0], r[0]), vi(e, n?.[1], r[1], "important")) : vi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function bi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Me();
		for (var r of e.options) r.selected = t.includes(Ci(r));
		return;
	}
	for (r of e.options) if (sn(Ci(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function xi(e) {
	var t = new MutationObserver(() => {
		"__value" in e && bi(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), Tn(() => {
		t.disconnect();
	});
}
function Si(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	pt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ci);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Ci(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), An(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if (bi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Ci(s), n(a));
		}
		e.__value = a, i = !1;
	}), xi(e);
}
function Ci(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var wi = Symbol("is custom element"), Ti = Symbol("is html"), Ei = ge ? "link" : "LINK", Di = ge ? "progress" : "PROGRESS";
function Oi(e) {
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
		e[me] = n, Qe(n), dt();
	}
}
function ki(e, t) {
	var n = ji(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Di) && (e.value = t ?? "");
}
function Ai(e, t) {
	var n = ji(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = ji(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Ei) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ni(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ji(e) {
	return e[ue] ??= {
		[wi]: e.nodeName.includes("-"),
		[Ti]: e.namespaceURI === r
	};
}
var Mi = /* @__PURE__ */ new Map();
function Ni(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Mi.get(t);
	if (n) return n;
	Mi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Pi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	pt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ii(e) ? Li(a) : a, n(a), M !== null && r.add(M), await _r(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(Ii(e) ? Li(e.value) : e.value), M !== null && r.add(M)), Nn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		Ii(e) && n === Li(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Fi(e, t, n = t) {
	pt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Nn(() => {
		e.checked = !!t();
	});
}
function Ii(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Li(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function Ri(e, t, n) {
	var r = u(e, t);
	r && r.set && (e[t] = n, Tn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function zi(e, t) {
	return e === t || e?.[se] === t;
}
function Bi(e = {}, t, n, r) {
	var i = Ge.r, a = V;
	return An(() => {
		var o, s;
		return Nn(() => {
			o = s, s = r?.() || [], U(() => {
				zi(n(...s), e) || (t(e, ...s), o && zi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && zi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Vi(e = !1) {
	let t = Ge, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ St(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && On(() => {
		Hi(t, r), v(n.b);
	}), En(() => {
		let e = U(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && En(() => {
		Hi(t, r), v(n.a);
	});
}
function Hi(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Ue || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ St(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = se in e || ce in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ct(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Te(t), f(m)));
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
	var v = !1, y = (n & 1 ? St : j)(() => (v = !1, g()));
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? an(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Yn && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), We();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ui = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), Wi = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Gi = /* @__PURE__ */ K("<option> </option>"), Ki = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), qi = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Ji = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Yi = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function Xi(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 4), te = /* @__PURE__ */ N();
	async function ne() {
		await _r(), H(te)?.focus?.();
	}
	function re(e) {
		e.preventDefault(), C()({
			title: H(w),
			summary: H(T),
			priority: u().normalize(H(ee), u().creationDefaultValue)
		});
	}
	function E(e) {
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
		l() && ne();
	}), jn(), Vi();
	var ie = Ir(), D = I(ie), ae = (e) => {
		var t = Ui();
		z(() => {
			Z(t, 1, fi(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, oe = (e) => {
		var t = Yi(), r = F(t);
		Oi(r), Bi(r, (e) => P(te, e), () => H(te));
		var c = L(r, 2), l = (e) => {
			var t = Wi();
			lt(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Pi(t, () => H(T), (e) => P(T, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Gi(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), A(d);
		var f = L(d, 2), p = (e) => {
			var t = Ki(), n = F(t, !0);
			A(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = qi(), n = I(t), r = F(n, !0);
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
			var t = Ji(), n = I(t), r = F(n, !0);
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
			Z(t, 1, fi(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), Tr("submit", t, re), G("keydown", t, E), Pi(r, () => H(w), (e) => P(w, e)), Si(d, () => H(ee), (e) => P(ee, e)), q(e, t);
	};
	Y(D, (e) => {
		l() ? e(oe, -1) : e(ae);
	}), q(e, ie), Je();
}
Er(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var Zi = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Qi = /* @__PURE__ */ K("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), $i = /* @__PURE__ */ K("<div class=\"assessment-metric-grid\"></div>");
function ea(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = $i();
	X(r, 5, n, (e) => e.label, (e, t) => {
		var n = Qi(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a), s = (e) => {
			var n = Zi();
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
var ta = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), na = /* @__PURE__ */ K("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function ra(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = na(), a = F(i), o = F(a), s = (e) => {
		var t = ta();
		z(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), q(e, t);
	};
	Y(o, (e) => {
		r() && e(s);
	});
	var c = L(o);
	A(a), si(L(a, 2), t, "default", {}, null), A(i), z(() => J(c, ` ${n() ?? ""}`)), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var ia = /* @__PURE__ */ K("<span class=\"assessment-readout-summary\"> </span>"), aa = /* @__PURE__ */ K("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function oa(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = aa(), o = F(a), s = F(o, !0);
	A(o);
	var c = L(o, 2);
	si(F(c), t, "badges", {}, null), A(c);
	var l = L(c, 2), u = (e) => {
		var t = ia(), n = F(t, !0);
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
var sa = /* @__PURE__ */ K("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ca(e, t) {
	qe(t, !1);
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
	Vi();
	var _ = Ir(), v = I(_), y = (e) => {
		var n = sa(), l = F(n), d = F(l), f = F(d), _ = F(f, !0);
		A(f);
		var v = L(f, 2), y = F(v, !0);
		A(v), A(d);
		var b = L(d, 2);
		A(l), si(L(l, 2), t, "default", {}, null), A(n), Bi(n, (e) => P(u, e), () => H(u)), li(n, (e) => p?.(e)), z(() => {
			Z(n, 1, fi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), J(_, a()), Q(v, "id", s()), J(y, o()), Q(b, "aria-label", c());
		}), Tr("close", n, m), G("click", n, g), G("click", b, h), q(e, n);
	};
	Y(v, (e) => {
		n() && e(y);
	}), q(e, _), Je();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var la = /* @__PURE__ */ K("<span> </span>"), ua = /* @__PURE__ */ K("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), da = /* @__PURE__ */ K("<!> <!> <!>", 1), fa = /* @__PURE__ */ K("<span slot=\"badges\"> </span>"), pa = /* @__PURE__ */ K("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), ma = /* @__PURE__ */ K("<div class=\"cost-dialog-content\"><!></div>");
function ha(e, t) {
	qe(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	Vi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
		ca(e, {
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
				var n = ma(), i = F(n), a = (e) => {
					var t = da(), n = I(t);
					oa(n, {
						label: "估算成本",
						get value() {
							return W(s()), U(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Ir();
							X(I(n), 1, () => (W(s()), U(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = la(), r = F(n, !0);
								A(n), z(() => {
									Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
								}), q(e, n);
							}), q(e, n);
						} }
					});
					var r = L(n, 2);
					{
						let e = /* @__PURE__ */ j(() => (W(s()), U(() => [
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
						ea(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						ra(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								q(e, ua());
							},
							$$slots: { default: !0 }
						});
					};
					Y(i, (e) => {
						W(s()), U(() => !s().humanConfirmed) && e(a);
					}), q(e, t);
				}, c = (e) => {
					var t = da(), n = I(t);
					oa(n, {
						label: "估算總額",
						get value() {
							return W(o()), U(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = fa(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, `cost-coverage cost-coverage-${W(o()), U(() => o().coverage) ?? ""}`), J(r, (W(o()), U(() => o().coverageLabel)));
							}), q(e, n);
						} }
					});
					var r = L(n, 2);
					{
						let e = /* @__PURE__ */ j(() => (W(o()), U(() => [{
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
						ea(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						ra(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								q(e, pa());
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
	Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var ga = /* @__PURE__ */ K("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), _a = /* @__PURE__ */ K("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), va = /* @__PURE__ */ K("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), ya = /* @__PURE__ */ K("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function ba(e, t) {
	qe(t, !1);
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
	Vi();
	var c = ya(), l = F(c), u = F(l), d = L(F(u), 2), f = F(d, !0);
	A(d), A(u), Le(2), A(l);
	var p = L(l, 2), m = (e) => {
		var t = ga(), r = F(t), i = L(F(r), 2), o = F(i, !0);
		A(i), A(r);
		var s = L(r, 2), c = L(F(s), 2), l = F(c, !0);
		A(c), A(s), A(t), z((e, t) => {
			J(o, e), J(l, t);
		}, [() => (W(n()), U(() => a(n().before))), () => (W(n()), U(() => a(n().after)))]), q(e, t);
	}, h = (e) => {
		q(e, _a());
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
	var te = L(g, 2), ne = F(te), re = L(F(ne)), E = F(re, !0);
	A(re), A(ne);
	var ie = L(ne, 2), D = L(F(ie)), ae = F(D, !0);
	A(D), A(ie), A(te);
	var oe = L(te, 2), se = (e) => {
		var t = va(), r = L(F(t), 1, !0);
		A(t), z(() => J(r, (W(n()), U(() => n().reason)))), q(e, t);
	};
	Y(oe, (e) => {
		W(n()), U(() => n().reason) && e(se);
	}), A(c), z((e, t, i, a) => {
		J(f, r()), J(y, (W(n()), U(() => n().current.label))), J(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (W(n()), U(() => `risk-${n().next.urgency ?? "none"}`))), J(w, (W(n()), U(() => n().next.label))), J(ee, `剩餘容量 ${t ?? ""}`), J(E, i), J(ae, a);
	}, [
		() => (W(n()), U(() => o(n().current.remainingCapacityMinutes))),
		() => (W(n()), U(() => o(n().next.remainingCapacityMinutes))),
		() => (W(n()), U(() => s(n().capacityDelta))),
		() => (W(n()), U(() => s(n().balanceDelta)))
	]), q(e, c), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var xa = /* @__PURE__ */ K("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Sa(e, t) {
	qe(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N();
	qr(() => {
		H(o).showModal(), H(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Vi();
	var u = xa(), d = L(F(u), 2);
	ba(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = L(d, 2), p = F(f);
	Bi(p, (e) => P(s, e), () => H(s));
	var m = L(p, 2), h = F(m, !0);
	A(m), A(f), A(u), Bi(u, (e) => P(o, e), () => H(o)), z(() => {
		p.disabled = r(), m.disabled = r(), J(h, r() ? "正在儲存…" : "確認儲存");
	}), Tr("cancel", u, c), G("keydown", u, l), G("click", p, function(...e) {
		i()?.apply(this, e);
	}), G("click", m, function(...e) {
		a()?.apply(this, e);
	}), q(e, u), Je();
}
Er(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var Ca = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function wa(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Ir();
	X(I(i), 1, n, Qr, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).level ?? "error")));
		var i = Ca(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s, !0);
		A(s), A(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Ta = /* @__PURE__ */ K("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function Ea(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), jn(), Vi();
	var d = Ta(), f = F(d, !0);
	A(d), z(() => {
		Q(d, "aria-pressed", H(n)), Q(d, "aria-label", `目前為${H(r)}；按下切換到${H(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(f, H(r));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), Je();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Da = /* @__PURE__ */ K("<span></span>"), Oa = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), ka = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>"), Aa = /* @__PURE__ */ K("<div role=\"toolbar\"></div>");
function ja(e, t) {
	qe(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = !1, u = null, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N();
	async function p() {
		let e = H(d);
		P(d, null), await _r(), [...H(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function re(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	R(() => (W(n()), H(d)), () => {
		n() && H(d) && p();
	}), jn(), Vi();
	var E = Aa();
	X(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).sortable !== !1)));
		var r = ka(), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i, 2), l = (e) => {
			var n = Da();
			z(() => Z(n, 1, (H(t), U(() => `time-risk-dot ${H(t).dotClass ?? ""}`)))), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).showDot) && e(l);
		});
		var u = L(o, 2), d = (e) => {
			q(e, Oa());
		};
		Y(u, (e) => {
			H(t), U(() => H(t).showChevron) && e(d);
		}), A(r), z((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (H(t), U(() => H(t).id))), Q(r, "data-reorder-capsule", H(n) ? "true" : null), Q(r, "aria-pressed", (H(t), U(() => H(t).pressed ?? null))), Q(r, "aria-label", (H(t), U(() => H(t).ariaLabel ?? H(t).label))), Q(r, "aria-keyshortcuts", H(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (H(t), U(() => H(t).title ?? null))), r.disabled = (H(t), U(() => H(t).disabled ?? !1)), Q(r, "draggable", H(n)), J(a, (H(t), U(() => H(t).label)));
		}, [() => (H(t), W(H(n)), H(s), H(c), U(() => `capsule-button ${H(t).className ?? ""} ${H(n) ? "capsule-sortable" : ""} ${H(s) === H(t).id ? "capsule-dragging" : ""} ${h(H(t).id, H(c))}`))]), G("click", r, (e) => b(H(t), e)), G("keydown", r, function(...e) {
			(H(n) ? (e) => x(H(t), e) : null)?.apply(this, e);
		}), Tr("dragstart", r, function(...e) {
			(H(n) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), Tr("dragover", r, function(...e) {
			(H(n) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), Tr("dragleave", r, function(...e) {
			(H(n) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), Tr("drop", r, function(...e) {
			(H(n) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), Tr("dragend", r, function(...e) {
			(H(n) ? ee : null)?.apply(this, e);
		}), G("pointerdown", r, function(...e) {
			(H(n) ? (e) => te(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", r, function(...e) {
			(H(n) ? (e) => ne(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), Tr("pointercancel", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), q(e, r);
	}), A(E), Bi(E, (e) => P(f, e), () => H(f)), z(() => {
		Z(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), q(e, E), Je();
}
Er([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function Ma(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	R(() => W(a()), () => {
		P(n, new Map(a().map((e, t) => [e, t])));
	}), R(() => (W(i()), H(n), W(a())), () => {
		P(r, [...i()].sort((e, t) => (H(n).get(e.id) ?? a().length) - (H(n).get(t.id) ?? a().length)));
	}), jn(), Vi();
	var u = Ir(), d = I(u), f = (e) => {
		ja(e, {
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
	}), q(e, u), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Na = /* @__PURE__ */ K("<i></i>"), Pa = /* @__PURE__ */ K("<div role=\"img\"></div>"), Fa = /* @__PURE__ */ K("<progress max=\"100\"></progress>");
function Ia(e, t) {
	qe(t, !1);
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
	}), jn(), Vi();
	var f = Ir(), p = I(f), m = (e) => {
		var t = Pa();
		X(t, 5, () => H(r), Qr, (e, t) => {
			var n = Na();
			z((e) => Z(n, 1, e), [() => (H(t), U(() => `progress-cell${u(H(t))}`))]), q(e, n);
		}), A(t), z(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), q(e, t);
	}, h = (e) => {
		var t = Fa();
		z(() => {
			Z(t, 1, `progress-meter ${c()}`), ki(t, H(n)), Q(t, "aria-label", s());
		}), q(e, t);
	};
	Y(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), q(e, f), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var La = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Ra(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	R(() => (W(r()), W(i()), W(a()), W(o())), () => {
		P(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), jn(), Vi();
	var s = La(), c = I(s), l = F(c), u = F(l);
	A(l), A(c);
	var d = L(c, 2);
	{
		let e = /* @__PURE__ */ j(() => r() / 100);
		Ia(d, {
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
	z(() => J(u, `整體約 ${r() ?? ""}%`)), q(e, s), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var za = /* @__PURE__ */ K("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ba = /* @__PURE__ */ K("<p class=\"hero-summary\"> </p>");
function Va(e, t) {
	qe(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	Vi();
	var c = Ir(), l = I(c), u = (e) => {
		var t = za();
		lt(t), z(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), ki(t, i());
		}), G("input", t, (e) => s()(e.currentTarget.value)), q(e, t);
	}, d = (e) => {
		var t = Ba(), r = F(t, !0);
		A(t), z(() => J(r, n())), q(e, t);
	};
	Y(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), q(e, c), Je();
}
Er(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Ha = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), Ua = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function Wa(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Ir();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = Ua(), i = F(n), a = F(i, !0);
		A(i);
		var o = L(i, 2), s = (e) => {
			var n = Ha(), i = F(n, !0);
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
var Ga = /* @__PURE__ */ K("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ka = /* @__PURE__ */ K("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), qa = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Ja(e, t) {
	qe(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Vi();
	var y = qa(), b = I(y), x = F(b, !0);
	A(b);
	var S = L(b, 2), C = F(S), w = F(C, !0);
	A(C);
	var T = L(C, 2), ee = F(T, !0);
	A(T), A(S);
	var te = L(S, 2), ne = (e) => {
		var t = Ga(), a = F(t, !0);
		A(t), z(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), J(a, i());
		}), G("click", t, () => r()(!n())), q(e, t);
	};
	Y(te, (e) => {
		r() && e(ne);
	});
	var re = L(te, 2), E = (e) => {
		var t = Ka(), n = I(t), r = F(n, !0);
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
	Y(re, (e) => {
		n() && e(E);
	}), z(() => {
		J(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), J(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), J(ee, p());
	}), G("click", C, function(...e) {
		g()?.apply(this, e);
	}), G("click", T, function(...e) {
		_()?.apply(this, e);
	}), q(e, y), Je();
}
Er(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var Ya = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Xa(e, t) {
	qe(t, !1);
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
			id: Ya,
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
		P(i, s().length > 0 ? s() : [Ya, ...o().map((e) => e.id)]);
	}), R(() => (H(i), H(n), H(r)), () => {
		P(a, H(i).map((e) => e === "__default__" ? H(n) : H(r).get(e)).filter(Boolean).map((e) => e === H(n) ? e : v(e)));
	}), jn(), Vi(), ja(e, {
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
	}), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var Za = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function Qa(e, t) {
	qe(t, !1);
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
	}), jn(), Vi();
	var o = Ir();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = Za(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a, !0);
		A(a), A(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), Je();
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function $a(e, t) {
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
function eo(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var to = /* @__PURE__ */ Pr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), no = /* @__PURE__ */ Pr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), ro = /* @__PURE__ */ Pr("<path d=\"M3 3l18 18\"></path>"), io = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function ao(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = io(), a = F(i), o = (e) => {
		q(e, to());
	}, s = (e) => {
		var t = no();
		Le(), q(e, t);
	};
	Y(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = L(a), l = (e) => {
		q(e, ro());
	};
	Y(c, (e) => {
		r() && e(l);
	}), A(i), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var oo = /* @__PURE__ */ K("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), so = /* @__PURE__ */ K("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function co(e, t) {
	qe(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Vi();
	var l = so(), u = I(l);
	let d;
	var f = F(u), p = F(f), m = F(p, !0);
	A(p), A(f);
	var h = L(f, 2), g = (e) => {
		var t = oo(), n = F(t);
		{
			let e = /* @__PURE__ */ j(() => !r());
			ao(n, { get closed() {
				return H(e);
			} });
		}
		A(t), z(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), G("click", t, () => i()(!r())), q(e, t);
	};
	Y(h, (e) => {
		n() && e(g);
	}), si(L(h, 2), t, "header", {}, null), A(u);
	var _ = L(u, 2);
	si(F(_), t, "default", {}, null), A(_), z(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), J(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), G("click", f, () => c()(!a())), q(e, l), Je();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var lo = /* @__PURE__ */ K("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span>", 1), uo = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), fo = /* @__PURE__ */ K("<!> <!>", 1), po = /* @__PURE__ */ K("<li> </li>"), mo = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), ho = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), go = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), _o = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), vo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), yo = /* @__PURE__ */ K("<p> </p>"), bo = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), xo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), So = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), Co = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), wo = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function To(e, t) {
	qe(t, !1);
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
	}), jn(), Vi();
	var c = Ir(), l = I(c), u = (e) => {
		var t = Ir();
		ci(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = fo(), o = I(n);
			ci(o, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = fo(), i = I(n), o = (e) => {
					var t = lo(), n = L(I(t), 2), i = F(n, !0);
					A(n), z(() => J(i, H(r))), q(e, t);
				};
				Y(i, (e) => {
					H(r) && e(o);
				});
				var s = L(i, 2), c = (e) => {
					q(e, uo());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), q(t, n);
			});
			var c = L(o, 2), l = (e) => {
				var t = wo(), n = L(F(t), 2), r = (e) => {
					var t = mo(), n = L(F(t), 2);
					X(n, 5, () => H(i), Qr, (e, t) => {
						var n = po(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), o = (e) => {
					var t = ho(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().blockers)), Qr, (e, t) => {
						var n = po(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(a, (e) => {
					W(s()), U(() => s().blockers?.length) && e(o);
				});
				var c = L(a, 2), l = (e) => {
					var t = vo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().decisions)), Qr, (e, t) => {
						var n = _o(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = (e) => {
							var n = go(), r = F(n, !0);
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
					var t = xo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().routes)), Qr, (e, t) => {
						var n = bo(), r = F(n), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r);
						var c = L(r, 2), l = (e) => {
							var n = yo(), r = F(n, !0);
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
					var t = Co(), n = L(F(t), 2), r = F(n);
					A(n);
					var i = L(n, 2), a = (e) => {
						var t = yo(), n = F(t);
						A(t), z(() => J(n, `Worktree: ${W(s()), U(() => s().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(s()), U(() => s().claim.worktree) && e(a);
					});
					var o = L(i, 2), c = (e) => {
						var t = So();
						X(t, 5, () => (W(s()), U(() => s().claim.source_paths)), Qr, (e, t) => {
							var n = go(), r = F(n, !0);
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
	}), q(e, c), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Eo = /* @__PURE__ */ K("<option> </option>"), Do = /* @__PURE__ */ K("<select class=\"inline-priority-select\"></select>"), Oo = /* @__PURE__ */ K("<span> </span>"), ko = /* @__PURE__ */ K("<span class=\"item-row-priority\"><!></span>"), Ao = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), jo = /* @__PURE__ */ K("<span class=\"spike-item-title\"> </span>"), Mo = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select>"), No = /* @__PURE__ */ K("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), Po = /* @__PURE__ */ K("<li><span aria-hidden=\"true\"> </span> <!> <span class=\"item-row-description\"><!></span> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function Fo(e, t) {
	qe(t, !1);
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
	}), jn(), Vi();
	var S = Po();
	let C;
	var w = F(S), T = F(w, !0);
	A(w);
	var ee = L(w, 2), te = (e) => {
		var t = ko(), i = F(t), a = (e) => {
			var t = Do();
			X(t, 5, () => (W(d()), U(() => d().levels)), (e) => e.value, (e, t) => {
				var n = Eo(), r = F(n, !0);
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
			})), Si(t, () => H(_), (e) => P(_, e)), q(e, t);
		}, o = (e) => {
			var t = Oo(), i = F(t, !0);
			A(t), z(() => {
				Z(t, 1, (H(n), U(() => `priority-badge priority-${H(n).tone}`))), J(i, H(r));
			}), q(e, t);
		};
		Y(i, (e) => {
			u() ? e(a) : e(o, -1);
		}), A(t), q(e, t);
	};
	Y(ee, (e) => {
		W(u()), H(i), H(n), W(d()), U(() => u() || H(i) !== "done" && H(n) && (!H(n).hidden || !d().labelsValid)) && e(te);
	});
	var ne = L(ee, 2), re = F(ne), E = (e) => {
		var t = Ao();
		Oi(t), z(() => {
			Q(t, "aria-label", (W(l()), U(() => `編輯子項目：${l().title}`))), Q(t, "title", (W(l()), U(() => l().title))), ki(t, (W(l()), U(() => l().title)));
		}), G("input", t, (e) => f()({
			type: "set-item-field",
			taskId: s(),
			field: c(),
			itemId: l().id,
			property: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, ie = (e) => {
		var t = jo(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "title", (W(l()), U(() => l().title))), J(n, (W(l()), U(() => l().title)));
		}), q(e, t);
	};
	Y(re, (e) => {
		u() ? e(E) : e(ie, -1);
	}), A(ne);
	var D = L(ne, 2), ae = F(D);
	Ma(F(ae), {
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
		var t = Mo();
		X(t, 5, v, (e) => e.value, (e, t) => {
			var n = Eo(), r = F(n, !0);
			A(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), A(t), z(() => Q(t, "aria-label", (W(l()), U(() => `設定「${l().title}」的狀態`)))), G("change", t, () => b(H(y))), Si(t, () => H(y), (e) => P(y, e)), q(e, t);
	}, le = (e) => {
		var t = Oo(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, (H(a), U(() => `item-status-capsule status-${H(a).tone}`))), J(n, H(o));
		}), q(e, t);
	};
	Y(se, (e) => {
		u() ? e(ce) : e(le, -1);
	}), A(oe);
	var ue = L(oe, 2), de = (e) => {
		var t = No(), n = F(t);
		A(t), z(() => Q(n, "aria-label", (W(l()), U(() => `刪除子項目：${l().title}`)))), G("click", n, () => f()({
			type: "delete-item",
			taskId: s(),
			field: c(),
			itemId: l().id
		})), q(e, t);
	};
	Y(ue, (e) => {
		u() && e(de);
	}), A(D), A(S), z(() => {
		C = Z(S, 1, "editor-item-row", null, C, { "editable-work-item": u() }), Z(w, 1, `item-row-marker item-row-marker-${H(i)}`), J(T, H(i) === "done" ? "✓" : "○");
	}), q(e, S), Je();
}
Er([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Io = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Lo = /* @__PURE__ */ K("<p class=\"task-summary\"> </p>"), Ro = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), zo = /* @__PURE__ */ K("<option> </option>"), Bo = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Vo = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Ho = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), Uo = /* @__PURE__ */ K("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), Wo = /* @__PURE__ */ K("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), Go = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Ko = /* @__PURE__ */ K("<h3> </h3>"), qo = /* @__PURE__ */ K("<span> </span>"), Jo = /* @__PURE__ */ K("<div class=\"task-module-totals\"></div>"), Yo = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), Xo = /* @__PURE__ */ K("<article><!></article>");
function Zo(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "progress", 8), p = $(t, "editing", 8), m = $(t, "policy", 8), h = $(t, "onCommand", 8), g = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let _ = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), v = $(t, "onModuleActivate", 8, () => {}), y = $(t, "moduleOrder", 24, () => ["time"]), b = $(t, "onModuleReorder", 8, () => {}), x = $(t, "statusOrder", 24, () => ["done", "planned"]), S = $(t, "moduleTotals", 24, () => []), C = [
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
	], w = /* @__PURE__ */ N(!1), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(m().creationDefaultValue), te = /* @__PURE__ */ N(""), ne = /* @__PURE__ */ N(d().status), re = /* @__PURE__ */ N(m().normalize(d().priority, m().fallbackValue));
	function E() {
		P(w, !1), P(T, ""), P(ee, m().creationDefaultValue), P(te, "");
	}
	function ie() {
		let e = g()(H(T), Number(H(ee)));
		P(te, e.error), H(te) || E();
	}
	R(() => W(d()), () => {
		P(n, [{
			status: "done",
			title: "已完成",
			className: "completed-work",
			field: "completed_items",
			items: d().completed_items ?? []
		}, {
			status: "planned",
			title: "待處理",
			className: "pending-work",
			field: "pending_items",
			items: d().pending_items ?? []
		}]);
	}), R(() => (H(n), W(x())), () => {
		P(r, [...H(n)].sort((e, t) => {
			let n = x().indexOf(e.status), r = x().indexOf(t.status);
			return (n < 0 ? x().length : n) - (r < 0 ? x().length : r);
		}));
	}), R(() => (W(m()), W(d())), () => {
		P(i, m().metadata(d().priority));
	}), R(() => W(d()), () => {
		P(ne, d().status);
	}), R(() => (W(m()), W(d())), () => {
		P(re, m().normalize(d().priority, m().fallbackValue));
	}), R(() => W(d()), () => {
		P(a, C.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), R(() => (W(p()), H(w)), () => {
		!p() && H(w) && E();
	}), jn(), Vi();
	var D = Xo(), ae = F(D);
	{
		let e = /* @__PURE__ */ j(() => (W(d()), U(() => `task-body-${d().id}`)));
		co(ae, {
			get visibilityEnabled() {
				return o();
			},
			get visible() {
				return s();
			},
			get onVisibleChange() {
				return c();
			},
			get expanded() {
				return l();
			},
			get onToggle() {
				return u();
			},
			get contentId() {
				return H(e);
			},
			get label() {
				return W(d()), U(() => d().title);
			},
			children: (e, t) => {
				var n = Uo(), i = I(n), a = (e) => {
					var t = Io();
					lt(t), z(() => ki(t, (W(d()), U(() => d().summary)))), G("input", t, (e) => h()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), q(e, t);
				}, o = (e) => {
					var t = Lo(), n = F(t, !0);
					A(t), z(() => J(n, (W(d()), U(() => d().summary)))), q(e, t);
				};
				Y(i, (e) => {
					p() ? e(a) : e(o, -1);
				});
				var s = L(i, 2);
				{
					let e = /* @__PURE__ */ j(() => (W(d()), U(() => d().developer ?? null)));
					To(s, { get developer() {
						return H(e);
					} });
				}
				var c = L(s, 2), l = F(c);
				X(l, 1, () => H(r), (e) => e.status, (e, t) => {
					var n = Ir(), r = I(n), i = (e) => {
						var n = Ro(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2);
						X(a, 5, () => (H(t), U(() => H(t).items)), (e) => e.id, (e, n) => {
							{
								let r = /* @__PURE__ */ j(() => (W(_()), H(n), U(() => _().get(H(n).id) ?? [])));
								Fo(e, {
									get taskId() {
										return W(d()), U(() => d().id);
									},
									get field() {
										return H(t), U(() => H(t).field);
									},
									get item() {
										return H(n);
									},
									get editing() {
										return p();
									},
									get policy() {
										return m();
									},
									get onCommand() {
										return h();
									},
									get moduleCapsules() {
										return H(r);
									},
									get statuses() {
										return C;
									},
									get onModuleActivate() {
										return v();
									},
									get moduleOrder() {
										return y();
									},
									get onModuleReorder() {
										return b();
									}
								});
							}
						}), A(a), A(n), z(() => {
							Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title)));
						}), q(e, n);
					};
					Y(r, (e) => {
						H(t), W(p()), U(() => H(t).items.length || p()) && e(i);
					}), q(e, n);
				});
				var u = L(l, 2), f = F(u), g = (e) => {
					var t = Ho(), n = F(t), r = (e) => {
						var t = Bo(), n = F(t);
						Oi(n);
						var r = L(n, 2);
						X(r, 5, () => (W(m()), U(() => m().levels)), (e) => e.value, (e, t) => {
							var n = zo(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(m()), H(t), U(() => m().format(H(t).value)))]), q(e, n);
						}), A(r);
						var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
						A(o), A(t), z(() => {
							Q(o, "hidden", !H(te)), J(s, H(te));
						}), G("keydown", n, (e) => {
							e.key === "Enter" && ie(), e.key === "Escape" && E();
						}), Pi(n, () => H(T), (e) => P(T, e)), Si(r, () => H(ee), (e) => P(ee, e)), G("click", i, ie), G("click", a, E), q(e, t);
					}, i = (e) => {
						var t = Vo();
						z(() => Q(t, "aria-label", (W(d()), U(() => `在「${d().title}」新增子項目`)))), G("click", t, () => {
							P(w, !0);
						}), q(e, t);
					};
					Y(n, (e) => {
						H(w) ? e(r) : e(i, -1);
					}), A(t), q(e, t);
				};
				Y(f, (e) => {
					p() && e(g);
				}), A(u), A(c), q(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = Yo(), r = F(n), i = F(r), o = (e) => {
						var t = Wo(), n = F(t);
						X(n, 5, () => C, (e) => e.value, (e, t) => {
							var n = zo(), r = F(n, !0);
							A(n);
							var i = {};
							z(() => {
								J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}), q(e, n);
						}), A(n);
						var r = L(n, 2);
						X(r, 5, () => (W(m()), U(() => m().levels)), (e) => e.value, (e, t) => {
							var n = zo(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(m()), H(t), U(() => m().format(H(t).value)))]), q(e, n);
						}), A(r), A(t), z(() => {
							Q(n, "aria-label", (W(d()), U(() => `${d().title} 狀態`))), Q(r, "aria-label", (W(d()), U(() => `${d().title} 優先級`)));
						}), G("change", n, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "status",
							value: H(ne)
						})), Si(n, () => H(ne), (e) => P(ne, e)), G("change", r, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(H(re))
						})), Si(r, () => H(re), (e) => P(re, e)), q(e, t);
					};
					Y(i, (e) => {
						p() && e(o);
					});
					var s = L(i, 2), c = F(s), l = (e) => {
						var t = Go();
						Oi(t), z(() => {
							Q(t, "id", (W(d()), U(() => `task-${d().id}-title`))), ki(t, (W(d()), U(() => d().title)));
						}), G("input", t, (e) => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), q(e, t);
					}, u = (e) => {
						var t = Ko(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "id", (W(d()), U(() => `task-${d().id}-title`))), J(n, (W(d()), U(() => d().title)));
						}), q(e, t);
					};
					Y(c, (e) => {
						p() ? e(l) : e(u, -1);
					}), A(s);
					var g = L(s, 2), _ = (e) => {
						var t = Jo();
						X(t, 5, S, (e) => e.id, (e, t) => {
							var n = qo(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, (H(t), U(() => `task-module-total task-module-total-${H(t).id}`))), J(r, (H(t), U(() => H(t).label)));
							}), q(e, n);
						}), A(t), q(e, t);
					};
					Y(g, (e) => {
						W(S()), U(() => S().length) && e(_);
					}), A(r);
					var v = L(r, 2), y = F(v), b = F(y);
					A(y);
					var x = L(y, 2), w = F(x, !0);
					A(x);
					var T = L(x, 2), ee = F(T, !0);
					A(T), A(v), A(n), z(() => {
						Q(y, "aria-label", (W(f()), U(() => `子項目完成 ${f().completed}，共 ${f().total}`))), J(b, `${W(f()), U(() => f().completed) ?? ""} / ${W(f()), U(() => f().total) ?? ""}`), Z(x, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(w, (H(a), U(() => H(a).label))), J(ee, (W(d()), U(() => d().id)));
					}), q(e, n);
				}
			}
		});
	}
	A(D), z(() => {
		Z(D, 1, (H(i), U(() => `task-card editor-task-card priority-${H(i)?.tone ?? "unspecified"}`))), Q(D, "aria-labelledby", (W(d()), U(() => `task-${d().id}-title`)));
	}), q(e, D), Je();
}
Er([
	"input",
	"keydown",
	"click",
	"change"
]);
//#endregion
//#region viewer/assets/icon-choice.js
function Qo(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function $o(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var es = /* @__PURE__ */ K("<button type=\"button\" tabindex=\"-1\"><!></button>"), ts = /* @__PURE__ */ K("<div role=\"group\"></div>"), ns = /* @__PURE__ */ K("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function rs(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(), m = /* @__PURE__ */ N(), h = /* @__PURE__ */ N(!1), g = /* @__PURE__ */ N(!1), _ = /* @__PURE__ */ N(!1), v = /* @__PURE__ */ N(null), y = /* @__PURE__ */ N(0), b = /* @__PURE__ */ N(0), x = /* @__PURE__ */ N(!1), S = /* @__PURE__ */ N(null), C = 0;
	function w(e = !1) {
		clearTimeout(H(m)), C++, H(S) !== null && H(f)?.hasPointerCapture(H(S)) && H(f).releasePointerCapture(H(S)), P(S, null), P(h, !1), P(g, !1), P(v, null), P(x, !1), e && H(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function ee(e = !1) {
		if (!H(r).length) return;
		P(h, !0), P(x, !1);
		let t = ++C;
		if (await _r(), !H(h) || t !== C || !H(p)) return;
		let n = H(f).getBoundingClientRect(), i = H(p).getBoundingClientRect(), o = [...H(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (P(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), P(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (P(y, n.right + 4), H(y) + i.width > window.innerWidth - 4 && P(y, n.left - i.width - 4), P(b, n.top + (n.height - i.height) / 2)) : (P(y, n.left + (n.width - i.width) / 2), P(b, n.bottom + 4), H(b) + i.height > window.innerHeight - 4 && P(b, n.top - i.height - 4)), P(y, Math.max(4, Math.min(H(y), window.innerWidth - i.width - 4))), P(b, Math.max(4, Math.min(H(b), window.innerHeight - i.height - 4))), P(x, !0), await _r(), e && H(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && H(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ne(e) {
		if (clearTimeout(H(m)), H(S) !== null) {
			if (H(g)) {
				let t = te(e);
				P(_, !0), t === null ? w(!0) : T(H(r).find((e) => String(e.id) === t).id);
			} else {
				let t = H(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (P(_, !0), w(!0));
			}
			P(S, null);
		}
	}
	function re(e) {
		if (["Enter", " "].includes(e.key) && H(S) === null && P(_, !1), e.key === "Tab" && H(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(H(h) || H(S) !== null) && (e.preventDefault(), P(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !H(h)) {
			ee(!0);
			return;
		}
		let n = [...H(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function E() {
		H(S) !== null && P(_, !0), w(H(d)?.contains(document.activeElement));
	}
	Jr(() => clearTimeout(H(m))), R(() => (W(i()), W(a())), () => {
		P(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), R(() => (W(i()), W(a()), W(l())), () => {
		P(r, $o(i(), a(), l()));
	}), jn(), Vi();
	var ie = ns();
	Tr("pointerdown", cn, (e) => {
		H(d)?.contains(e.target) || w();
	}), Tr("resize", cn, E), Tr("blur", cn, E), Tr("scroll", ln, (e) => {
		H(p)?.contains(e.target) || E();
	}, !0);
	var D = F(ie);
	let ae;
	si(F(D), t, "icon", { get item() {
		return H(n);
	} }, null), A(D), Bi(D, (e) => P(f, e), () => H(f));
	var oe = L(D, 2), se = (e) => {
		var n = ts();
		let i, s;
		X(n, 5, () => H(r), (e) => e.id, (e, n) => {
			var r = es();
			let i;
			si(F(r), t, "icon", { get item() {
				return H(n);
			} }, null), A(r), z((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (H(n), U(() => H(n).id))), Q(r, "aria-label", (H(n), U(() => H(n).label))), Q(r, "title", (H(n), U(() => H(n).label))), Q(r, "aria-pressed", (H(n), W(a()), U(() => H(n).kind === "action" ? void 0 : H(n).id === a())));
			}, [() => ({ "icon-choice-hover": H(v) === String(H(n).id) })]), G("keydown", r, re), G("click", r, () => T(H(n).id)), q(e, r);
		}), A(n), Bi(n, (e) => P(p, e), () => H(p)), z(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = yi(n, "", s, {
				left: `${H(y)}px`,
				top: `${H(b)}px`,
				visibility: H(x) ? "visible" : "hidden"
			});
		}), q(e, n);
	};
	Y(oe, (e) => {
		H(h) && e(se);
	}), A(ie), Bi(ie, (e) => P(d, e), () => H(d)), z(() => {
		Q(ie, "aria-label", o()), Q(D, "aria-label", (W(o()), H(n), U(() => `${o()}：${H(n)?.label ?? ""}`))), Q(D, "aria-expanded", s() === "cycle" ? void 0 : H(h)), Q(D, "title", (W(o()), H(n), W(s()), U(() => `${o()}：${H(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), D.disabled = !H(n), ae = yi(D, "", ae, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), G("focusout", ie, (e) => {
		H(d).contains(e.relatedTarget) || w();
	}), G("keydown", D, re), G("pointerdown", D, (e) => {
		e.button === 0 && (P(_, !1), !(s() === "cycle" || H(h)) && (P(S, e.pointerId), H(f).setPointerCapture(H(S)), clearTimeout(H(m)), P(m, setTimeout(() => {
			P(g, !0), ee();
		}, 300))));
	}), G("pointermove", D, (e) => {
		H(g) && P(v, te(e));
	}), G("pointerup", D, ne), Tr("pointercancel", D, E), G("click", D, () => {
		if (H(_)) {
			P(_, !1);
			return;
		}
		if (H(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") ee(!0);
		else {
			let e = Qo(i(), a());
			e !== void 0 && u()(e);
		}
	}), q(e, ie), Je();
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
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var is = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function as(e, t) {
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
	rs(e, {
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
			let n = /* @__PURE__ */ j(() => t.item);
			var r = Ir(), i = I(r), a = (e) => {
				q(e, is());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "closed"))), r = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "disabled")));
					ao(e, {
						get closed() {
							return H(t);
						},
						get disabled() {
							return H(r);
						}
					});
				}
			};
			Y(i, (e) => {
				W(H(n)), U(() => H(n)?.id === "reset") ? e(a) : e(o, -1);
			}), q(e, r);
		} }
	});
}
//#endregion
//#region viewer/assets/card-visibility.js
function os(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function ss(e, t, n) {
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
function cs(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function ls(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function us(e, t, n) {
	return n === "free" ? ds(e, t) : n === "reverse" ? [...e].reverse() : e;
}
function ds(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function fs(e, t, n, r, i, a) {
	let o = cs(t, e), s = new Set(n), c = ls(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var ps = /* @__PURE__ */ Pr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), ms = /* @__PURE__ */ Pr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), hs = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), gs = /* @__PURE__ */ K("<div role=\"group\" tabindex=\"0\"><!></div>"), _s = /* @__PURE__ */ K("<div class=\"card-list-tools\"><p class=\"section-kicker\">工作項目</p> <button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span></div> <div class=\"arrangeable-cards\"></div>", 1);
function vs(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "items", 24, () => []), o = $(t, "allIds", 24, () => []), s = $(t, "storageKey", 8), c = $(t, "expanded", 8, !0), l = $(t, "onToggleAll", 8, () => {}), u = /* @__PURE__ */ N("forward"), d = [
		"forward",
		"reverse",
		"free"
	], f = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, p = /* @__PURE__ */ N("disabled"), m = /* @__PURE__ */ N([]);
	function h() {
		if (s()) try {
			sessionStorage.setItem(`${s()}:visibility`, JSON.stringify({
				mode: H(p),
				hiddenIds: H(m)
			}));
		} catch {}
	}
	function g(e) {
		let t = ss(H(p), H(m), e);
		P(p, t.mode), P(m, t.hiddenIds), ie(), h();
	}
	function _(e, t) {
		P(m, t ? H(m).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...H(m), e])]), ie(), h();
	}
	function v(e) {
		H(p) === "closed" && P(p, "enabled"), _(e, !0);
	}
	let y = /* @__PURE__ */ N(null), b = /* @__PURE__ */ N(null), x = /* @__PURE__ */ N(null), S = /* @__PURE__ */ N(null), C = /* @__PURE__ */ N(null), w = /* @__PURE__ */ N(), T = /* @__PURE__ */ N("");
	function ee(e) {
		if (P(p, "disabled"), P(m, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			P(p, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), P(m, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (P(b, null), P(x, null), P(S, null), P(C, null), !e) {
			P(y, null), P(u, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			P(y, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			P(u, d.includes(n) ? n : H(y) ? "free" : "forward");
		} catch {
			P(y, null), P(u, "forward");
		}
	}
	function te(e) {
		if (P(y, e), !s()) {
			P(T, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(s(), JSON.stringify(e)) : localStorage.removeItem(s()), P(T, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			P(T, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function ne(e) {
		if (ie(), P(u, e), P(T, ""), s()) try {
			localStorage.setItem(`${s()}:mode`, H(u));
		} catch {
			P(T, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function re(e, t, n) {
		H(u) === "free" && e !== t && (te(fs(o(), H(y), H(r).map((e) => e.id), e, t, n)), P(b, e), await _r(), [...H(w).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus());
	}
	function E(e, t) {
		let n = H(r).findIndex((t) => t.id === e), i = H(r)[n + t];
		i && re(e, i.id, t > 0);
	}
	function ie() {
		P(x, null), P(S, null), P(C, null);
	}
	function D(e, t) {
		if (H(S) === null || H(S) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		P(C, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	R(() => H(p), () => {
		P(n, H(p) === "enabled");
	}), R(() => (W(a()), H(y), H(u)), () => {
		P(i, us(a(), H(y), H(u)));
	}), R(() => (H(i), H(p), H(m)), () => {
		P(r, H(i).filter((e) => os(e.id, H(p), H(m))));
	}), R(() => W(s()), () => {
		ee(s());
	}), jn();
	var ae = { revealCard: v };
	Vi();
	var oe = _s(), se = I(oe), ce = L(F(se), 2), le = F(ce), ue = F(le);
	A(le), A(ce);
	var de = L(ce, 2);
	{
		let e = /* @__PURE__ */ j(() => U(() => d.map((e) => ({
			id: e,
			label: f[e]
		}))));
		rs(de, {
			get items() {
				return H(e);
			},
			get value() {
				return H(u);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: ne,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ j(() => t.item);
				var r = hs(), i = F(r), a = (e) => {
					q(e, ps());
				}, o = (e) => {
					var t = ms(), r = I(t), i = L(r);
					z(() => {
						Q(r, "d", (W(H(n)), U(() => H(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (W(H(n)), U(() => H(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), q(e, t);
				};
				Y(i, (e) => {
					W(H(n)), U(() => H(n).id === "free") ? e(a) : e(o, -1);
				}), A(r), q(e, r);
			} }
		});
	}
	var fe = L(de, 2);
	as(fe, {
		get mode() {
			return H(p);
		},
		onChoose: g
	});
	var pe = L(fe, 2), me = F(pe, !0);
	A(pe), A(se);
	var he = L(se, 2);
	return X(he, 5, () => H(i), (e) => e.id, (e, r) => {
		var i = gs();
		let a;
		var o = F(i);
		{
			let e = /* @__PURE__ */ j(() => (H(m), H(r), U(() => !H(m).includes(H(r).id))));
			si(o, t, "default", {
				get item() {
					return H(r);
				},
				get visibilityEnabled() {
					return H(n);
				},
				get visible() {
					return H(e);
				},
				onVisibleChange: (e) => _(H(r).id, e)
			}, null);
		}
		A(i), z((e) => {
			Q(i, "hidden", e), a = Z(i, 1, "arrangeable-card", null, a, {
				"card-selected": H(b) === H(r).id,
				"card-drop-before": H(C)?.id === H(r).id && !H(C).after,
				"card-drop-after": H(C)?.id === H(r).id && H(C).after
			}), Q(i, "aria-label", (H(r), H(b), U(() => `${H(r).title}${H(b) === H(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (H(r), U(() => H(r).id))), Q(i, "draggable", (H(u), H(x), H(r), U(() => H(u) === "free" && H(x) === H(r).id)));
		}, [() => (W(os), H(r), H(p), H(m), U(() => !os(H(r).id, H(p), H(m))))]), G("pointerdown", i, (e) => {
			P(x, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (P(b, H(r).id), H(u) === "free" && e.pointerType === "mouse" && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || P(x, H(r).id))));
		}), G("pointerup", i, () => {
			P(x, null);
		}), G("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), P(b, H(r).id)) : e.key === "Escape" && P(b, null), H(u) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), E(H(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Tr("dragstart", i, (e) => {
			H(u) === "free" && H(x) === H(r).id && e.target === e.currentTarget && (P(S, H(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(H(r).id)));
		}), Tr("dragend", i, ie), Tr("dragover", i, (e) => D(H(r), e)), Tr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || P(C, null);
		}), Tr("drop", i, (e) => {
			H(S) !== null && H(C)?.id === H(r).id && (e.preventDefault(), re(H(S), H(r).id, H(C).after), ie());
		}), q(e, i);
	}), A(he), Bi(he, (e) => P(w, e), () => H(w)), z(() => {
		Q(ce, "aria-label", c() ? "全部收合" : "全部展開"), Q(ce, "title", c() ? "全部收合" : "全部展開"), Q(ue, "d", c() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), J(me, H(T));
	}), G("click", ce, () => l()(!c())), q(e, oe), Ri(t, "revealCard", v), Je(ae);
}
Er([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var ys = /* @__PURE__ */ K("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), bs = /* @__PURE__ */ K("<p class=\"task-summary\"> </p> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), xs = /* @__PURE__ */ K("<a class=\"pointer-card-title-link\"> </a>"), Ss = /* @__PURE__ */ K("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), Cs = /* @__PURE__ */ K("<strong class=\"task-fraction\"> </strong>"), ws = /* @__PURE__ */ K("<span> </span>"), Ts = /* @__PURE__ */ K("<span role=\"status\">讀取目標報告中…</span>"), Es = /* @__PURE__ */ K("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), Ds = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!> <!></div></header>"), Os = /* @__PURE__ */ K("<article><!></article>");
function ks(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "visibilityEnabled", 8, !1), a = $(t, "visible", 8, !0), o = $(t, "onVisibleChange", 8, () => {}), s = $(t, "expanded", 8, !0), c = $(t, "onToggle", 8, () => {}), l = $(t, "task", 8), u = $(t, "state", 24, () => ({ status: "loading" })), d = {
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
	function f(e) {
		return e ? d[e] ?? {
			label: e,
			tone: "muted"
		} : {
			label: "指路",
			tone: "muted"
		};
	}
	R(() => W(u()), () => {
		P(n, u().status === "ready" ? u().card : null);
	}), R(() => H(n), () => {
		P(r, H(n) ? d[H(n).status] ?? {
			label: H(n).status,
			tone: "muted"
		} : null);
	}), jn(), Vi();
	var p = Os(), m = F(p);
	{
		let e = /* @__PURE__ */ j(() => (W(l()), U(() => `task-body-${l().id}`)));
		co(m, {
			get visibilityEnabled() {
				return i();
			},
			get visible() {
				return a();
			},
			get onVisibleChange() {
				return o();
			},
			get expanded() {
				return s();
			},
			get onToggle() {
				return c();
			},
			get contentId() {
				return H(e);
			},
			get label() {
				return W(l()), U(() => l().title);
			},
			children: (e, t) => {
				var r = Ir(), i = I(r), a = (e) => {
					var t = bs(), r = I(t), i = F(r, !0);
					A(r);
					var a = L(r, 2), o = F(a);
					A(a);
					var s = L(a, 2);
					X(s, 5, () => (H(n), U(() => H(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ j(() => (H(t), U(() => f(H(t).status))));
						var r = ys(), i = F(r), a = F(i, !0);
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
					var i = Ds(), a = F(i), o = F(a), s = F(o), c = F(s), d = (e) => {
						var t = xs(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "href", (W(u()), U(() => u().openHref))), J(n, (W(l()), U(() => l().title)));
						}), q(e, t);
					}, f = (e) => {
						var t = Fr();
						z(() => J(t, (W(l()), U(() => l().title)))), q(e, t);
					};
					Y(c, (e) => {
						W(u()), U(() => u().openHref) ? e(d) : e(f, -1);
					}), A(s), A(o);
					var p = L(o, 2), m = (e) => {
						var t = Ss();
						z(() => Q(t, "href", (W(u()), U(() => u().openHref)))), q(e, t);
					};
					Y(p, (e) => {
						W(u()), U(() => u().openHref) && e(m);
					}), A(a);
					var h = L(a, 2), g = F(h), _ = (e) => {
						var t = Cs(), r = F(t);
						A(t), z(() => J(r, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}`)), q(e, t);
					};
					Y(g, (e) => {
						H(n) && e(_);
					});
					var v = L(g, 2), y = (e) => {
						var t = ws(), n = F(t, !0);
						A(t), z(() => {
							Z(t, 1, (H(r), U(() => `status-badge status-${H(r).tone}`))), J(n, (H(r), U(() => H(r).label)));
						}), q(e, t);
					};
					Y(v, (e) => {
						H(r) && e(y);
					});
					var b = L(v, 2), x = (e) => {
						q(e, Ts());
					};
					Y(b, (e) => {
						W(u()), U(() => u().status === "loading") && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = Es(), n = F(t, !0);
						A(t), z(() => J(n, (W(u()), U(() => u().message)))), q(e, t);
					};
					Y(S, (e) => {
						W(u()), U(() => u().status === "error") && e(C);
					}), A(h), A(i), z(() => Q(s, "id", (W(l()), U(() => `task-${l().id}-title`)))), q(e, i);
				}
			}
		});
	}
	A(p), z(() => {
		Z(p, 1, (H(r), U(() => `task-card pointer-card ${H(r) ? `status-${H(r).tone}` : ""}`))), Q(p, "aria-labelledby", (W(l()), U(() => `task-${l().id}-title`)));
	}), q(e, p), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var As = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>"), js = /* @__PURE__ */ K("<!> <!>", 1);
function Ms(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "tasks", 24, () => []), i = $(t, "allIds", 24, () => []), a = $(t, "cardStorageKey", 8, null), o = $(t, "progress", 24, () => ({})), s = $(t, "editing", 8, !1), c = $(t, "policy", 8), l = $(t, "onCommand", 8, () => {}), u = $(t, "onAddItem", 8, () => {}), d = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), f = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), p = $(t, "onModuleActivate", 8, () => {}), m = $(t, "moduleOrder", 24, () => ["time"]), h = $(t, "onModuleReorder", 8, () => {}), g = $(t, "moduleTotals", 24, () => ({})), _ = $(t, "statusOrder", 24, () => ["done", "planned"]), v = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), y = $(t, "pointerCards", 24, () => ({})), b = /* @__PURE__ */ N(!0), x = /* @__PURE__ */ N({});
	function S(e) {
		let t = $a(e);
		P(b, t.expanded), P(x, t.overrides);
	}
	function C(e, t) {
		P(x, {
			...H(x),
			[e]: t
		}), eo(H(n), H(b), H(x));
	}
	function w(e) {
		P(b, e), P(x, {}), eo(H(n), H(b), H(x));
	}
	R(() => W(a()), () => {
		P(n, `taskprogress.disclosure:${a() ?? location.href}`);
	}), R(() => H(n), () => {
		S(H(n));
	}), jn(), Vi();
	var T = js(), ee = I(T);
	vs(ee, {
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
			let n = /* @__PURE__ */ j(() => t.item), r = /* @__PURE__ */ j(() => t.visibilityEnabled), i = /* @__PURE__ */ j(() => t.visible), a = /* @__PURE__ */ j(() => t.onVisibleChange);
			var v = Ir(), S = I(v), w = (e) => {
				{
					let t = /* @__PURE__ */ j(() => (H(x), W(H(n)), H(b), U(() => H(x)[H(n).id] ?? H(b)))), o = /* @__PURE__ */ j(() => (W(y()), W(H(n)), U(() => y()[H(n).id] ?? { status: "loading" })));
					ks(e, {
						get visibilityEnabled() {
							return H(r);
						},
						get visible() {
							return H(i);
						},
						get onVisibleChange() {
							return H(a);
						},
						get expanded() {
							return H(t);
						},
						onToggle: (e) => C(H(n).id, e),
						get task() {
							return H(n);
						},
						get state() {
							return H(o);
						}
					});
				}
			}, T = (e) => {
				{
					let t = /* @__PURE__ */ j(() => (H(x), W(H(n)), H(b), U(() => H(x)[H(n).id] ?? H(b)))), v = /* @__PURE__ */ j(() => (W(d()), W(H(n)), U(() => d().get(H(n).id) ?? null))), y = /* @__PURE__ */ j(() => (W(g()), W(H(n)), U(() => g()[H(n).id] ?? [])));
					Zo(e, {
						get visibilityEnabled() {
							return H(r);
						},
						get visible() {
							return H(i);
						},
						get onVisibleChange() {
							return H(a);
						},
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
							return H(v);
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
							return H(y);
						}
					});
				}
			};
			Y(S, (e) => {
				W(H(n)), U(() => H(n).kind === "report_pointer") ? e(w) : e(T, -1);
			}), q(e, v);
		} }
	});
	var te = L(ee, 2), ne = (e) => {
		var t = As(), n = F(t, !0);
		A(t), z(() => J(n, v())), q(e, t);
	};
	Y(te, (e) => {
		W(r()), U(() => !r().length) && e(ne);
	}), q(e, T), Je();
}
//#endregion
//#region viewer/assets/theme-model.js
var Ns = [
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
], Ps = Object.freeze({
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
var Fs = /^#[0-9a-f]{6}$/i;
function Is(e) {
	return typeof e == "string" && Fs.test(e);
}
function Ls(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Ps[n], i = { base: n };
	for (let e of Ns) {
		let n = t[e.key];
		i[e.key] = Is(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Rs(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function zs(e, t) {
	if (!Is(e) || !Is(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Rs(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Bs(e) {
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
	].filter(([, e, t]) => zs(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Vs = /* @__PURE__ */ K("<option> </option>"), Hs = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Us = /* @__PURE__ */ K("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), Ws = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Gs(e, t) {
	qe(t, !1);
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(!1), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(Ls(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(Ns.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Ls(o().base, o()) : Ls(s())), P(f, !0);
	}
	function S() {
		P(f, !1);
	}
	function C(e) {
		y(Ls(e.currentTarget.value));
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
	function te() {
		let e = H(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ls(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, Ls(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, Bs(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), jn(), Vi();
	var ne = Ws(), re = I(ne), E = L(F(re), 2);
	X(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = Vs(), r = F(n, !0);
		A(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), A(E), A(re), ca(L(re, 2), {
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
			var a = Us(), o = L(I(a), 2), s = L(F(o), 2), c = F(s);
			c.value = c.__value = "light";
			var l = L(c);
			l.value = l.__value = "dark", A(s);
			var u;
			xi(s), A(o);
			var d = L(o, 2);
			X(d, 7, () => Ns, (e) => e.key, (e, t, r) => {
				var i = Hs(), a = F(i), o = F(a, !0);
				A(a);
				var s = L(a, 2), c = F(s);
				Oi(c);
				var l = L(c, 2);
				Oi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Bi(l, (e, t) => $t(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), A(s), A(i), z(() => {
					J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), ki(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), ki(l, (H(g), H(t), U(() => H(g)[H(t).key])));
				}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => T(H(t), e)), q(e, i);
			}), A(d);
			var f = L(d, 2);
			let m;
			var _ = F(f, !0);
			A(f);
			var v = L(f, 2), b = F(v), x = L(b, 4), S = L(x, 2);
			A(v), z(() => {
				u !== (u = H(h)) && (s.value = (s.__value = H(h)) ?? "", bi(s, H(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": H(r).length > 0 }), J(_, H(i));
			}), G("change", s, C), G("click", b, () => y(Ls(H(h)))), G("click", x, ee), G("click", S, te), q(e, a);
		},
		$$slots: { default: !0 }
	}), G("change", E, b), Si(E, () => H(m), (e) => P(m, e)), q(e, ne), Je();
}
Er([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var Ks = /* @__PURE__ */ K("<span> </span>"), qs = /* @__PURE__ */ K("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), Js = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Ys = /* @__PURE__ */ K("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function Xs(e, t) {
	qe(t, !1);
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
	Vi();
	var u = Ys(), d = F(u), f = F(d);
	X(L(F(f), 2), 1, () => (W(n()), U(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = Ks(), r = F(n, !0);
		A(n), z(() => {
			Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), A(f);
	var p = L(f, 2), m = L(F(p), 2);
	Oi(m), A(p), A(d);
	var h = L(d, 2);
	ra(F(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = qs(), i = L(F(r), 2);
			Oi(i), A(r), z(() => Q(i, "aria-label", (W(n()), U(() => `「${n().title}」人工依據`)))), Pi(i, () => H(o), (e) => P(o, e)), q(e, r);
		},
		$$slots: { default: !0 }
	}), A(h);
	var g = L(h, 2), _ = F(g);
	Oi(_), Le(2), A(g);
	var v = L(g, 4), y = F(v);
	A(v);
	var b = L(v, 2), x = (e) => {
		var t = Js(), n = F(t, !0);
		A(t), z(() => J(n, H(c))), q(e, t);
	};
	Y(b, (e) => {
		H(c) && e(x);
	}), A(u), z(() => {
		Q(m, "aria-label", (W(n()), U(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (W(n()), U(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (W(n()), U(() => `套用「${n().title}」人工估算草稿`)));
	}), Tr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Pi(m, () => H(a), (e) => P(a, e)), Fi(_, () => H(s), (e) => P(s, e)), q(e, u), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var Zs = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> <span> </span></label>"), Qs = /* @__PURE__ */ K("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), $s = /* @__PURE__ */ K("<div class=\"spike-exception-list\"></div>"), ec = /* @__PURE__ */ K("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), tc = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), nc = /* @__PURE__ */ K("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function rc(e, t) {
	qe(t, !1);
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
	function te() {
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
	async function ne() {
		te().error || (o()(!1), await a()());
	}
	R(() => (H(f), H(p), H(m)), () => {
		P(n, 24 - Number(H(f)) - Number(H(p)) - Number(H(m)));
	}), jn(), Vi();
	var re = nc(), E = F(re), ie = L(F(E), 6), D = F(ie);
	A(ie), A(E);
	var ae = L(E, 2), oe = F(ae), se = L(F(oe), 2), ce = F(se), le = L(F(ce));
	Oi(le), A(ce);
	var ue = L(ce, 2), de = L(F(ue));
	Oi(de), A(ue);
	var fe = L(ue, 2);
	A(se), A(oe);
	var pe = L(oe, 2), me = F(pe), he = L(F(me), 2);
	let ge;
	var _e = F(he);
	A(he), A(me);
	var ve = L(me, 2), ye = F(ve), be = L(F(ye));
	Oi(be), A(ye);
	var xe = L(ye, 2), Se = L(F(xe));
	Oi(Se), A(xe);
	var Ce = L(xe, 2), we = L(F(Ce));
	Oi(we), A(Ce), A(ve);
	var Te = L(ve, 2);
	X(L(F(Te), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = Zs(), r = F(n);
		Oi(r);
		var i = L(r, 2), a = F(i);
		A(i), A(n), z((e) => {
			Ai(r, e), J(a, `週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(h), H(t), U(() => H(h).includes(H(t).value)))]), G("change", r, (e) => S(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(Te), A(pe);
	var Ee = L(pe, 2), De = F(Ee), Oe = L(F(De), 2);
	A(De);
	var ke = L(De, 2), Ae = (e) => {
		var t = $s();
		X(t, 5, () => H(_), (e) => e.key, (e, t) => {
			var n = Qs(), r = F(n), i = L(F(r));
			Oi(i), A(r);
			var a = L(r, 2), o = L(F(a));
			Oi(o), A(a);
			var s = L(a, 2), c = L(F(s));
			Oi(c), A(s);
			var l = L(s, 2);
			A(n), z(() => {
				ki(i, (H(t), U(() => H(t).date))), ki(o, (H(t), U(() => H(t).availableHours))), ki(c, (H(t), U(() => H(t).publicLabel)));
			}), G("input", i, (e) => C(H(t).key, "date", e.currentTarget.value)), G("input", o, (e) => C(H(t).key, "availableHours", e.currentTarget.value)), G("input", c, (e) => C(H(t).key, "publicLabel", e.currentTarget.value)), G("click", l, () => T(H(t).key)), q(e, n);
		}), A(t), q(e, t);
	}, je = (e) => {
		q(e, ec());
	};
	Y(ke, (e) => {
		H(_), U(() => H(_).length) ? e(Ae) : e(je, -1);
	}), A(Ee);
	var Me = L(Ee, 2), Ne = F(Me), O = L(Ne, 2), Pe = (e) => {
		var t = tc(), n = F(t, !0);
		A(t), z(() => J(n, H(v))), q(e, t);
	};
	Y(O, (e) => {
		H(v) && e(Pe);
	}), A(Me), A(ae), A(re), z((e) => {
		J(D, `時區：${W(r()), U(() => r().timezone) ?? ""}`), ge = Z(he, 1, "", null, ge, { invalid: !(H(n) > 0) }), J(_e, `工作 ${e ?? ""} hr`);
	}, [() => (H(n), U(() => Number.isFinite(H(n)) ? H(n) : "—"))]), G("input", le, x), Pi(le, () => H(u), (e) => P(u, e)), G("input", de, x), Pi(de, () => H(d), (e) => P(d, e)), G("click", fe, () => {
		P(u, ""), x();
	}), G("input", be, x), Pi(be, () => H(f), (e) => P(f, e)), G("input", Se, x), Pi(Se, () => H(p), (e) => P(p, e)), G("input", we, x), Pi(we, () => H(m), (e) => P(m, e)), G("click", Oe, w), G("click", Ne, ne), q(e, re), Je();
}
Er([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var ic = (e, t = g, n = g) => {
	var r = dc(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o, !0);
	A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c), A(r), z((e) => {
		Z(r, 1, e), J(a, (t(), U(() => t().label))), J(s, (t(), U(() => t().value))), J(l, (t(), U(() => t().note)));
	}, [() => fi((n(), U(() => `time-evaluation-node ${n()}`.trim())))]), q(e, r);
}, ac = (e, t = g) => {
	var n = pc();
	X(n, 5, t, Qr, (e, t) => {
		var n = fc(), r = F(n), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i), s = F(o, !0);
		A(o), A(r);
		var c = L(r, 2), l = F(c, !0);
		A(c), A(n), z(() => {
			J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, oc = (e, t = g) => {
	var n = mc();
	ac(L(F(n), 2), t), A(n), q(e, n);
}, sc = (e, t = g, n = g) => {
	var r = hc(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o), c = F(s);
	ic(c, () => (t(), U(() => t().engineeringLane.source)), () => ""), ic(L(c, 4), () => (t(), U(() => t().engineeringLane.result)), () => "time-evaluation-result"), A(s);
	var l = L(s, 2), u = F(l);
	ic(u, () => (t(), U(() => t().capacityLane.source)), () => ""), ic(L(u, 4), () => (t(), U(() => t().capacityLane.result)), () => "time-evaluation-result"), A(l), A(o);
	var d = L(o, 2);
	ic(L(F(d), 2), () => (t(), U(() => t().merge)), () => (t(), U(() => t().merge.className))), A(d);
	var f = L(d, 2), p = F(f);
	ic(p, () => (t(), U(() => t().risk.trend)), () => ""), ic(L(p, 4), () => (t(), U(() => t().risk.result)), () => (t(), U(() => t().risk.result.className))), A(f);
	var m = L(f, 2), h = F(m, !0);
	A(m), A(r), z(() => {
		Q(r, "hidden", !n()), J(a, (t(), U(() => t().intro))), J(h, (t(), U(() => t().note)));
	}), q(e, r);
}, cc = (e, t = g, n = g) => {
	var r = vc(), i = F(r);
	ea(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	ra(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), U(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = gc(), i = I(r), a = F(i, !0);
			A(i);
			var o = L(i, 2), s = F(o, !0);
			A(o), z(() => {
				J(a, (t(), U(() => t().explanation.text))), J(s, (t(), U(() => t().explanation.formula)));
			}), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2);
	ra(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = _c(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), oc(L(o, 2), () => (t(), U(() => t().composition))), A(r), z(() => Q(r, "hidden", !n())), q(e, r);
}, lc = (e, t = g, n = g) => {
	var r = xc(), i = L(F(r), 2);
	ea(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	ra(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = yc(), i = L(I(r), 2), a = F(i, !0);
			A(i), z(() => J(a, (t(), U(() => t().formulaCode)))), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2), s = F(o), c = F(s, !0);
	A(s);
	var l = L(s, 2), u = F(l), d = (e) => {
		var n = Ir();
		X(I(n), 1, () => (t(), U(() => t().exceptions)), Qr, (e, t) => {
			var n = fc(), r = F(n), i = F(r), a = F(i, !0);
			A(i);
			var o = L(i), s = F(o, !0);
			A(o), A(r);
			var c = L(r, 2), l = F(c, !0);
			A(c), A(n), z(() => {
				J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
			}), q(e, n);
		}), q(e, n);
	}, f = (e) => {
		q(e, bc());
	};
	Y(u, (e) => {
		t(), U(() => t().exceptions) ? e(d) : e(f, -1);
	}), A(l), A(o), A(r), z(() => {
		Q(r, "hidden", !n()), J(c, (t(), U(() => t().exceptionsHeading)));
	}), q(e, r);
}, uc = (e, t = g) => {
	var n = Sc(), r = F(n), i = F(r, !0);
	A(r);
	var a = L(r, 2);
	ea(a, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var o = L(a, 2);
	ra(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = _c(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), oc(L(o, 2), () => (t(), U(() => t().composition))), A(n), z(() => J(i, (t(), U(() => t().intro)))), q(e, n);
}, dc = /* @__PURE__ */ K("<div><span> </span> <strong> </strong> <small> </small></div>"), fc = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), pc = /* @__PURE__ */ K("<div class=\"time-source-list\"></div>"), mc = /* @__PURE__ */ K("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), hc = /* @__PURE__ */ K("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), gc = /* @__PURE__ */ K("<p> </p> <code class=\"time-formula\"> </code>", 1), _c = /* @__PURE__ */ K("<p> </p>"), vc = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), yc = /* @__PURE__ */ K("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), bc = /* @__PURE__ */ K("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), xc = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), Sc = /* @__PURE__ */ K("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), Cc = /* @__PURE__ */ K("<span> </span>"), wc = /* @__PURE__ */ K("<!> <div class=\"time-item-rationale\"><!></div>", 1), Tc = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Ec = /* @__PURE__ */ K("<code class=\"time-formula\"> </code>"), Dc = /* @__PURE__ */ K("<code class=\"time-reference\"> </code>"), Oc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), kc = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Ac = /* @__PURE__ */ K("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), jc = /* @__PURE__ */ K("<!> <!>", 1), Mc = /* @__PURE__ */ K("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), Nc = /* @__PURE__ */ K("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Pc = /* @__PURE__ */ K("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), Fc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), Ic = /* @__PURE__ */ K("<div class=\"time-dialog-content\"><!></div>");
function Lc(e, t) {
	qe(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ N([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await _r(), H(g)[r]?.focus();
	}
	Vi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
		ca(e, {
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
				var n = Ic(), i = F(n), c = (e) => {
					var t = Oc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var o = L(r, 2), c = F(o, !0);
					A(o), A(n);
					var u = L(n, 2), m = (e) => {
						var t = Ir();
						Zr(I(t), () => (W(s()), W(f()), U(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ j(() => (W(s()), W(a()), U(() => ({
									...s(),
									title: a()
								}))));
								Xs(e, {
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
						var t = wc(), n = I(t);
						oa(n, {
							label: "預估工時",
							get value() {
								return W(s()), U(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Ir();
								X(I(n), 1, () => (W(s()), U(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = Cc(), r = F(n, !0);
									A(n), z(() => {
										Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
									}), q(e, n);
								}), q(e, n);
							} }
						});
						var r = L(n, 2);
						ra(F(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = _c(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().rationale)))), q(e, n);
							},
							$$slots: { default: !0 }
						}), A(r), q(e, t);
					};
					Y(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = L(u, 2), _ = F(g);
					ea(_, { get metrics() {
						return W(s()), U(() => s().technical.metrics);
					} });
					var v = L(_, 2), y = (e) => {
						var t = Tc(), n = F(t), r = F(n), i = F(r, !0);
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
						ra(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = Ec(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().technical.formula)))), q(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					Y(b, (e) => {
						W(s()), U(() => s().technical.formula) && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = Dc(), n = F(t, !0);
						A(t), z(() => J(n, (W(s()), U(() => s().technical.reference)))), q(e, t);
					};
					Y(S, (e) => {
						W(s()), U(() => s().technical.reference) && e(C);
					}), A(g), A(t), z(() => {
						Z(r, 1, fi((W(s()), U(() => s().confidenceClass)))), J(i, (W(s()), U(() => s().confidenceLabel))), J(c, (W(s()), U(() => s().toggleLabel))), Q(g, "hidden", (W(s()), U(() => !s().detailsExpanded)));
					}), G("click", o, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, v = (e) => {
					var t = Fc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var a = L(r, 2), s = F(a, !0);
					A(a), A(n);
					var c = L(n, 2), f = F(c);
					X(f, 5, () => (W(o()), U(() => o().overview)), Qr, (e, t) => {
						var n = Ac(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = F(a), s = (e) => {
							var n = kc();
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
						var t = Ir(), n = I(t), r = (e) => {
							var t = jc(), n = I(t);
							rc(n, {
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
								ba(e, { get preview() {
									return h();
								} });
							};
							Y(r, (e) => {
								h() && e(i);
							}), q(e, t);
						}, i = (e) => {
							var t = Mc(), n = L(F(t), 4);
							A(t), G("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), q(e, t);
						};
						Y(n, (e) => {
							W(m()), U(() => m().hasConfig) ? e(r) : e(i, -1);
						}), q(e, t);
					}, S = (e) => {
						var t = Pc(), n = I(t);
						X(n, 7, () => (W(o()), U(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = Nc(), i = F(r, !0);
							A(r), Bi(r, (e, t) => $t(g, H(g)[t] = e), (e) => H(g)?.[e], () => [H(n)]), z(() => {
								Q(r, "id", (H(t), U(() => `time-${H(t).name}-tab`))), Q(r, "aria-controls", (H(t), U(() => `time-${H(t).name}-panel`))), Q(r, "aria-selected", (W(o()), H(t), U(() => o().activeTab === H(t).name))), Q(r, "tabindex", (W(o()), H(t), U(() => o().activeTab === H(t).name ? 0 : -1))), J(i, (H(t), U(() => H(t).label)));
							}), G("click", r, () => u()(H(t).name)), G("keydown", r, (e) => _(e, H(n), o().tabs)), q(e, r);
						}), A(n);
						var r = L(n, 2);
						sc(r, () => (W(o()), U(() => o().flow)), () => (W(o()), U(() => o().activeTab === "flow")));
						var i = L(r, 2);
						cc(i, () => (W(o()), U(() => o().engineering)), () => (W(o()), U(() => o().activeTab === "engineering"))), lc(L(i, 2), () => (W(o()), U(() => o().capacity)), () => (W(o()), U(() => o().activeTab === "capacity"))), q(e, t);
					}, C = (e) => {
						uc(e, () => (W(o()), U(() => o().estimateOnly)));
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
	Je();
}
Er(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Rc = /* @__PURE__ */ K("<span class=\"time-risk-dot\"></span>"), zc = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), Bc = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>");
function Vc(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = Bc(), d = F(u), f = F(d, !0);
	A(d);
	var p = L(d, 2), m = (e) => {
		q(e, Rc());
	};
	Y(p, (e) => {
		s() && e(m);
	});
	var h = L(p, 2), g = (e) => {
		q(e, zc());
	};
	Y(h, (e) => {
		c() && e(g);
	}), A(u), z(() => {
		Z(u, 1, fi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), J(f, o());
	}), G("click", u, function(...e) {
		l()?.apply(this, e);
	}), q(e, u);
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Hc = {
	"task-list": Ms,
	"status-overview": Qa,
	"status-filters": Xa,
	"project-progress": Ra,
	"report-summary": Va,
	"mode-toggle": Ea,
	"save-bar": Ja,
	"add-control": Xi,
	diagnostics: wa,
	"scope-directory": Wa,
	"theme-control": Gs,
	"project-module-strip": Ma,
	"time-summary-button": Vc,
	"time-dialog": Lc,
	"cost-dialog": ha,
	"delivery-save-confirmation": Sa
}, Uc = {
	id: "svelte",
	regions: Object.keys(Hc),
	mount(e, t, n) {
		let r = an({ ...n });
		return {
			component: Vr(Hc[e], {
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
		Gr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(Uc);
//#endregion
