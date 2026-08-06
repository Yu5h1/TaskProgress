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
var b = 1024, x = 2048, S = 4096, C = 8192, w = 16384, T = 32768, ee = 1 << 25, te = 65536, ne = 1 << 19, re = 1 << 20, ie = 1 << 25, ae = 65536, oe = 1 << 21, se = 1 << 22, ce = 1 << 23, le = Symbol("$state"), ue = Symbol("legacy props"), de = Symbol(""), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), ge = Symbol("form reset"), _e = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ve = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var E = !1;
function Pe(e) {
	E = e;
}
var D;
function O(e) {
	if (e === null) throw je(), t;
	return D = e;
}
function Fe() {
	return O(/* @__PURE__ */ pn(D));
}
function k(e) {
	if (E) {
		if (/* @__PURE__ */ pn(D) !== null) throw je(), t;
		D = e;
	}
}
function Ie(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ pn(n);
		D = n;
	}
}
function Le(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ pn(n);
		e && n.remove(), n = i;
	}
}
function Re(e) {
	if (!e || e.nodeType !== 8) throw je(), t;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function ze(e) {
	return e === this.v;
}
function Be(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ve(e) {
	return !Be(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var He = !1;
function Ue() {
	He = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var A = null;
function We(e) {
	A = e;
}
function Ge(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: He && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ke(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) wn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, e ?? {};
}
function qe() {
	return !He || A !== null && A.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], v(e);
}
function Xe(e) {
	if (Je.length === 0 && !Mt) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
function Qe(e) {
	var t = V;
	if (t === null) return B.f |= ce, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	$e(e, t);
}
function $e(e, t) {
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
var et = ~(x | S | b);
function j(e, t) {
	e.f = e.f & et | t;
}
function tt(e) {
	e.f & 512 || e.deps === null ? j(e, b) : j(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function nt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ae, nt(t.deps));
}
function rt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), nt(e.deps), j(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var it = !1;
function at(e) {
	var t = it;
	try {
		return it = !1, [e(), it];
	} finally {
		it = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function ot(e) {
	E && /* @__PURE__ */ fn(e) !== null && mn(e);
}
var st = !1;
function ct() {
	st || (st = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ge]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function lt(e) {
	var t = B, n = V;
	Yn(null), Xn(null);
	try {
		return e();
	} finally {
		Yn(t), Xn(n);
	}
}
function ut(e, t, n, r = n) {
	e.addEventListener(t, () => lt(n));
	let i = e[ge];
	e[ge] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ct();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function dt(e) {
	let t = 0, n = Yt(0), r;
	return () => {
		xn() && (H(n), An(() => (t === 0 && (r = U(() => e(() => en(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, en(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ft = te | ne;
function pt(e, t, n, r) {
	new mt(e, t, n, r);
}
var mt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
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
	#h = dt(() => (this.#m = Yt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (E) {
				let e = this.#t;
				Fe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ft), E && (this.#e = D);
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
		Xe(r), t && (this.#s = Mn(() => {
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
			t = !0, n && ke(), this.#s !== null && zn(this.#s, () => {
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
					$e(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = dn();
			e.append(t), this.#a = this.#S(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, zn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
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
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		rt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = A;
		Xn(this.#i), Yn(this.#i), We(this.#i.ctx);
		try {
			return Rt.ensure(), e();
		} catch (e) {
			return Qe(e), null;
		} finally {
			Xn(t), Yn(n), We(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Qt(this.#m, this.#l);
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
		this.#a &&= (In(this.#a), null), this.#o &&= (In(this.#o), null), this.#s &&= (In(this.#s), null), E && (O(this.#t), Ie(), O(Le()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Mn(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return $e(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				$e(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => $e(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ht(e, t, n, r) {
	let i = qe() ? yt : St;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = gt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				$e(e, s);
			}
			_t();
		}
	}
	var d = vt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ xt(e))).then(u).catch((e) => $e(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), _t();
	}) : f();
}
function gt() {
	var e = V, t = B, n = A, r = M;
	return function(i = !0) {
		Xn(e), Yn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function _t(e = !0) {
	Xn(null), Yn(null), We(null), e && M?.deactivate();
}
function vt() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	var t = 2 | x;
	return V !== null && (V.f |= ne), {
		ctx: A,
		deps: null,
		effects: null,
		equals: ze,
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
var bt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function xt(e, t, r) {
	let i = V;
	i === null && ye();
	var a = void 0, o = Yt(n), s = !B, c = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== _e && n.reject(e);
			}).finally(_t);
		} catch (e) {
			n.reject(e), _t();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = vt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(bt);
			else for (let e of c.values()) e.reject(bt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== bt && (r.activate(), t ? (o.f |= ce, Qt(o, t)) : (o.f & 8388608 && (o.f ^= ce), Qt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Sn(() => {
		for (let e of c) e.reject(bt);
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
function St(e) {
	let t = /* @__PURE__ */ yt(e);
	return t.equals = Ve, t;
}
function Ct(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) In(t[n]);
	}
}
function wt(e) {
	var t, r = V, i = e.parent;
	if (!Kn && i !== null && e.v !== n && i.f & 24576) return Ae(), e.v;
	Xn(i);
	try {
		e.f &= ~ae, Ct(e), t = ur(e);
	} finally {
		Xn(r);
	}
	return t;
}
function Tt(e) {
	var t = wt(e);
	if (!e.equals(t) && (e.wv = sr(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), kt?.capture(e, t, !0)), e.deps === null))) {
		j(e, b);
		return;
	}
	Kn || (At === null ? tt(e) : (xn() || M?.is_fork) && At.set(e, t));
}
function Et(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && lt(() => {
		t.ac.abort(_e), t.ac = null;
	}), t.fn !== null && (t.teardown = g), fr(t, 0), Pn(t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ot = null, M = null, kt = null, At = null, jt = null, Mt = !1, Nt = !1, Pt = null, Ft = null, It = 0, Lt = 1, Rt = class e {
	id = Lt++;
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
		Ot === null ? Ot = this : (Ot.#n = this, this.#t = Ot), Ot = this;
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
			for (var r of n.d) j(r, x), t(r);
			for (r of n.m) j(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, It++ > 1e3 && (this.#x(), Bt());
		for (let e of this.#u) this.#d.delete(e), j(e, x), this.schedule(e);
		for (let e of this.#d) j(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Pt = [], r = [], i = Ft = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Gt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Pt = null, Ft = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Wt(e, t);
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
		this.#r.clear(), kt = this, Ht(r), Ht(n), kt = null, this.#s?.resolve();
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
				a ? r.f ^= b : i & 4 ? t.push(r) : cr(r) && (i & 16 && this.#d.add(r), pr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) rt(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), At?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, At = null;
	}
	flush() {
		try {
			Nt = !0, M = this, this.#g();
		} finally {
			It = 0, jt = null, Pt = null, Ft = null, Nt = !1, M = null, At = null, qt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(bt);
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
		this.#m || (this.#m = !0, Xe(() => {
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
			!Nt && !Mt && Xe(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		At = null;
	}
	schedule(e) {
		if (jt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Pt !== null && t === V && (B === null || !(B.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Ot = e : t.#t = e, this.linked = !1;
		}
	}
};
function zt(e) {
	var t = Mt;
	Mt = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (Ze(), M === null) return n;
			M.flush();
		}
	} finally {
		Mt = t;
	}
}
function Bt() {
	try {
		we();
	} catch (e) {
		$e(e, jt);
	}
}
var Vt = null;
function Ht(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && cr(r) && (Vt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r), Vt?.size > 0)) {
				qt.clear();
				for (let e of Vt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Vt.has(n) && (Vt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				Vt.clear();
			}
		}
		Vt = null;
	}
}
function Ut(e) {
	M.schedule(e);
}
function Wt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, b);
		for (var n = e.first; n !== null;) Wt(n, t), n = n.next;
	}
}
function Gt(e) {
	j(e, b);
	for (var t = e.first; t !== null;) Gt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Kt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Map(), Jt = !1;
function Yt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ze,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Xt(e, t) {
	let n = Yt(e, t);
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Yt(e);
	return t || (r.equals = Ve), He && n && A !== null && A.l !== null && (A.l.s ??= []).push(r), r;
}
function Zt(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!Jn || B.f & 131072) && qe() && B.f & 4325394 && (Zn === null || !Zn.has(e)) && Oe(), Qt(e, n ? nn(t) : t, Ft);
}
function Qt(e, t, n = null) {
	if (!e.equals(t)) {
		qt.set(e, Kn ? t : e.v);
		var r = Rt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && wt(t), At === null && tt(t);
		}
		e.wv = sr(), tn(e, x, n), qe() && V !== null && V.f & 1024 && !(V.f & 96) && (tr === null ? nr([e]) : tr.push(e)), !r.is_fork && Kt.size > 0 && !Jt && $t();
	}
	return t;
}
function $t() {
	Jt = !1;
	for (let e of Kt) {
		e.f & 1024 && j(e, S);
		let t;
		try {
			t = cr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Kt.clear();
}
function en(e) {
	P(e, e.v + 1);
}
function tn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && j(s, t), c & 131072) Kt.add(s);
			else if (c & 2) {
				var u = s;
				At?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= ae), tn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Vt !== null && Vt.add(d), n === null ? Ut(d) : n.push(d);
			}
		}
	}
}
function nn(e) {
	if (typeof e != "object" || !e || le in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Xt(0), s = null, c = ar, l = (e) => {
		if (ar === c) return e();
		var t = B, n = ar;
		Yn(null), or(c);
		var r = e();
		return Yn(t), or(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Xt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ee();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Xt(n.value, s);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Xt(n, s));
					r.set(t, e), en(o);
				}
			} else P(i, n), en(o);
			return !0;
		},
		get(t, i, a) {
			if (i === le) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Xt(nn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			if (t === le) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Xt(a ? nn(e[t]) : n, s)), r.set(t, i)), H(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Xt(n, s)), r.set(p + "", m)) : P(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Xt(void 0, s)), P(d, nn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => nn(a));
				P(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				en(o);
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
function rn(e) {
	try {
		if (typeof e == "object" && e && le in e) return e[le];
	} catch {}
	return e;
}
function an(e, t) {
	return Object.is(rn(e), rn(t));
}
var on, sn, cn, ln;
function un() {
	if (on === void 0) {
		on = window, sn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		cn = u(t, "firstChild").get, ln = u(t, "nextSibling").get, h(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), h(n) && (n[he] = void 0);
	}
}
function dn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function fn(e) {
	return cn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return ln.call(e);
}
function F(e, t) {
	if (!E) return /* @__PURE__ */ fn(e);
	var n = /* @__PURE__ */ fn(D);
	if (n === null) n = D.appendChild(dn());
	else if (t && n.nodeType !== 3) {
		var r = dn();
		return n?.before(r), O(r), r;
	}
	return t && _n(n), O(n), n;
}
function I(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ fn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ pn(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = dn();
			return D?.before(r), O(r), r;
		}
		_n(D);
	}
	return D;
}
function L(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ pn(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = dn();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		_n(r);
	}
	return O(r), r;
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
	V === null && (B === null && Ce(e), Se()), Kn && xe(e);
}
function yn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function bn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: A,
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
	if (e & 4) Pt === null ? Rt.ensure().schedule(r) : Pt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw In(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= te));
	}
	if (i !== null && (i.parent = n, n !== null && yn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function xn() {
	return B !== null && !Jn;
}
function Sn(e) {
	let t = bn(8, null);
	return j(t, b), t.teardown = e, t;
}
function Cn(e) {
	vn("$effect");
	var t = V.f;
	if (!B && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return wn(e);
}
function wn(e) {
	return bn(4 | re, e);
}
function Tn(e) {
	return vn("$effect.pre"), bn(8 | re, e);
}
function En(e) {
	Rt.ensure();
	let t = bn(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? zn(t, () => {
			In(t), n(void 0);
		}) : (In(t), n(void 0));
	});
}
function Dn(e) {
	return bn(4, e);
}
function R(e, t) {
	var n = A, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = An(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Xn(n.parent), U(t);
			} finally {
				Xn(n);
			}
		}
	});
}
function On() {
	var e = A;
	An(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && j(n, S), cr(n) && pr(n), t.ran = !1;
		}
	});
}
function kn(e) {
	return bn(se | ne, e);
}
function An(e, t = 0) {
	return bn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	ht(r, t, n, (t) => {
		bn(8, () => {
			e(...t.map(H));
		});
	});
}
function jn(e, t = 0) {
	return bn(16 | t, e);
}
function Mn(e) {
	return bn(32 | ne, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Kn, n = B;
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
		e !== null && lt(() => {
			e.abort(_e);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, Pn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= ee, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && Rn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ln(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ pn(e);
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
		e.f ^= C;
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
		e.f ^= C, e.f & 1024 || (j(e, x), Rt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ pn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Wn = null, Gn = !1, Kn = !1;
function qn(e) {
	Kn = e;
}
var B = null, Jn = !1;
function Yn(e) {
	B = e;
}
var V = null;
function Xn(e) {
	V = e;
}
var Zn = null;
function Qn(e) {
	B !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~ae), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cr(a) && Tt(a), a.wv > e.wv) return !0;
		}
		t & 512 && At === null && j(e, b);
	}
	return !1;
}
function lr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? lr(a, t, !1) : t === a && (n ? j(a, x) : a.f & 1024 && j(a, S), Ut(a));
	}
}
function ur(e) {
	var t = $n, n = er, r = tr, i = B, a = Zn, o = A, s = Jn, c = ar, l = e.f;
	$n = null, er = 0, tr = null, B = l & 96 ? null : e, Zn = null, We(e.ctx), Jn = !1, ar = ++ir, e.ac !== null && (lt(() => {
		e.ac.abort(_e);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= T;
		var f = e.deps, p = M?.is_fork;
		if ($n !== null) {
			var m;
			if (p || fr(e, er), f !== null && er > 0) for (f.length = er + $n.length, m = 0; m < $n.length; m++) f[er + m] = $n[m];
			else e.deps = f = $n;
			if (xn() && e.f & 512) for (m = er; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && er < f.length && (fr(e, er), f.length = er);
		if (qe() && tr !== null && !Jn && f !== null && !(e.f & 6146)) for (m = 0; m < tr.length; m++) lr(tr[m], e);
		if (i !== null && i !== e) {
			if (ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ir;
			if (t !== null) for (let e of t) e.rv = ir;
			tr !== null && (r === null ? r = tr : r.push(...tr));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (e) {
		return Qe(e);
	} finally {
		e.f ^= oe, $n = t, er = n, tr = r, B = i, Zn = a, We(o), Jn = s, ar = c;
	}
}
function dr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && ($n === null || !s.call($n, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~ae), c.v !== n && tt(c), c.ac !== null && lt(() => {
			c.ac.abort(_e), c.ac = null, j(c, x);
		}), Et(c), fr(c, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, b);
		var n = V, r = Gn;
		V = e, Gn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = ur(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = rr;
		} finally {
			Gn = r, V = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), zt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Wn?.add(e), B !== null && !Jn && !(V !== null && V.f & 16384) && (Zn === null || !Zn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < ir && (e.rv = ir, $n === null && n !== null && n[er] === e ? er++ : $n === null ? $n = [e] : $n.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Kn && qt.has(e)) return qt.get(e);
	if (t) {
		var i = e;
		if (Kn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || gr(i)) && (a = wt(i)), qt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Jn && B !== null && (Gn || !!(B.f & 512)), c = (i.f & T) === 0;
		cr(i) && (o && (i.f |= 512), Tt(i)), o && !c && (Dt(i), hr(i));
	}
	if (At?.has(e)) return At.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Dt(t), hr(t));
}
function gr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (qt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function U(e) {
	var t = Jn;
	try {
		return Jn = !0, e();
	} finally {
		Jn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (le in e) _r(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && le in n && _r(n);
		}
	}
}
function _r(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			_r(e[n], t);
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
var vr = Symbol("events"), yr = /* @__PURE__ */ new Set(), br = /* @__PURE__ */ new Set();
function xr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Tr.call(t, e), !e.cancelBubble) return lt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Sr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = xr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Sn(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[vr] ??= {})[e] = n;
}
function Cr(e) {
	for (var t = 0; t < e.length; t++) yr.add(e[t]);
	for (var n of br) n(e);
}
var wr = null;
function Tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	wr = e;
	var o = 0, s = wr === e && e[vr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[vr] = t;
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
		Yn(null), Xn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[vr]?.[r];
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
			e[vr] = t, delete e.currentTarget, Yn(d), Xn(f);
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
	var t = gn("template");
	return t.innerHTML = Dr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function kr(e, t) {
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
		if (E) return kr(D, null), D;
		i === void 0 && (i = Or(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ fn(i)));
		var t = r || sn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ fn(t), s = t.lastChild;
			kr(o, s);
		} else kr(t, t);
		return t;
	};
}
function Ar() {
	if (E) return kr(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = dn();
	return e.append(t, n), kr(t, n), e;
}
function q(e, t) {
	if (E) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), Fe();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var jr = ["touchstart", "touchmove"];
function Mr(e) {
	return jr.includes(e);
}
var Nr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Pr(e) {
	return Nr.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	un();
	var u = void 0, d = En(() => {
		var s = r ?? n.appendChild(dn());
		pt(s, { pending: () => {} }, (n) => {
			Ge({});
			var r = A;
			if (o && (r.c = o), a && (i.$$events = a), E && kr(n, null), u = e(n, i) || {}, E && (V.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw je(), t;
			Ke();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Mr(r);
					for (let e of [n, document]) {
						var a = Ir.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ir.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(yr)), br.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Ir.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Tr), t.delete(e), t.size === 0 && Ir.delete(r)) : t.set(e, i);
			}
			br.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Rr.set(u, d), u;
}
var Rr = /* @__PURE__ */ new WeakMap();
function zr(e, t) {
	let n = Rr.get(e);
	return n ? (Rr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Br = class {
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
						Un(r, t), t.append(dn()), this.#n.set(e, {
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
		var n = M, r = hn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = dn();
			i.append(a), this.#n.set(e, {
				effect: Mn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Mn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Y(e, t, n = !1) {
	var r;
	E && (r = D, Fe());
	var i = new Br(e), a = n ? te : 0;
	function o(e, t) {
		if (E) {
			var n = Re(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Le();
				O(a), i.anchor = a, Pe(!1), i.ensure(e, t), Pe(!0);
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
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		zn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Ur(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			mn(d), d.append(u), e.items.clear();
		}
		Ur(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Ur(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, Un(a, document.createDocumentFragment())) : In(t[i], n);
	}
}
var Wr;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = E ? O(/* @__PURE__ */ fn(u)) : u.appendChild(dn());
	}
	E && Fe();
	var d = null, f = /* @__PURE__ */ St(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Kr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, Jr(d, null, s)) : Vn(d) : zn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			E && Re(s) === "[!" != (e === 0) && (s = Le(), O(s), Pe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = hn(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (s = D, a = !0, Pe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && Qt(S.v, b), S.i && Qt(S.i, y), v && u.unskip_effect(S.e)) : (S = qr(l, h ? s : Wr ??= dn(), b, x, y, i, t, n), h || (S.e.f |= ie), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Mn(() => o(s)) : (d = Mn(() => o(Wr ??= dn())), d.f |= ie)), e > c.size && be("", "", ""), E && e > 0 && O(Le()), !h) if (m.set(u, c), v) {
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
	h = !1, E && (s = D);
}
function Gr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Kr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = Gr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Vn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ie, _ === l) Jr(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (Ur(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Gr(l.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Hr(e, w, ee);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Yt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Yt(i) : null;
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
		var o = /* @__PURE__ */ pn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Yr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function Xr(e, t, n, r, a, o) {
	let s = E;
	E && Fe();
	var c = null;
	E && D.nodeType === 1 && (c = D, Fe());
	var l = E ? D : e, u = new Br(l, !1);
	jn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = E ? c : gn(e, o), kr(c, c), r) {
					var n = null;
					E && Pr(e) && c.append(n = document.createComment(""));
					var i = E ? /* @__PURE__ */ fn(c) : c.appendChild(dn());
					E && (i === null ? Pe(!1) : O(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			E && O(t);
		}), () => {};
	}, te), Sn(() => {}), s && (Pe(!0), O(l));
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Zr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Zr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Qr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Zr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function $r(e) {
	return typeof e == "object" ? Qr(e) : e ?? "";
}
var ei = [..." 	\n\r\f\xA0\v﻿"];
function ti(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ei.includes(r[o - 1])) && (s === r.length || ei.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[pe];
	if (E || o !== n || o === void 0) {
		var s = ti(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[pe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ni(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Me();
		for (var r of e.options) r.selected = t.includes(ai(r));
		return;
	}
	for (r of e.options) if (an(ai(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
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
	}), Sn(() => {
		t.disconnect();
	});
}
function ii(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ut(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ai);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ai(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), Dn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
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
var oi = Symbol("is custom element"), si = Symbol("is html"), ci = ve ? "link" : "LINK", li = ve ? "progress" : "PROGRESS";
function ui(e) {
	if (E) {
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
		e[ge] = n, Xe(n), ct();
	}
}
function di(e, t) {
	var n = fi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === li) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = fi(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ci) || i[t] !== (i[t] = n) && (t === "loading" && (e[de] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && mi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function fi(e) {
	return e[fe] ??= {
		[oi]: e.nodeName.includes("-"),
		[si]: e.namespaceURI === r
	};
}
var pi = /* @__PURE__ */ new Map();
function mi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = pi.get(t);
	if (n) return n;
	pi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function hi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ut(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = _i(e) ? vi(a) : a, n(a), M !== null && r.add(M), await mr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || U(t) == null && e.value) && (n(_i(e) ? vi(e.value) : e.value), M !== null && r.add(M)), An(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		_i(e) && n === vi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function gi(e, t, n = t) {
	ut(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (E && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), An(() => {
		e.checked = !!t();
	});
}
function _i(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function vi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function yi(e, t) {
	return e === t || e?.[le] === t;
}
function bi(e = {}, t, n, r) {
	var i = A.r, a = V;
	return Dn(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], U(() => {
				yi(n(...s), e) || (t(e, ...s), o && yi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && yi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function xi(e = !1) {
	let t = A, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ yt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && Tn(() => {
		Si(t, r), v(n.b);
	}), Cn(() => {
		let e = U(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Cn(() => {
		Si(t, r), v(n.a);
	});
}
function Si(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !He || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ yt(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = le in e || ue in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = at(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Te(t), f(m)));
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
	var v = !1, y = (n & 1 ? yt : St)(() => (v = !1, g()));
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? nn(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Kn && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ue();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ci = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), wi = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Ti = /* @__PURE__ */ K("<option> </option>"), Ei = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), Di = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Oi = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), ki = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function Ai(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 2), te = /* @__PURE__ */ N();
	async function ne() {
		await mr(), H(te)?.focus?.();
	}
	function re(e) {
		e.preventDefault(), C()({
			title: H(w),
			summary: H(T),
			priority: u().normalize(H(ee), u().creationDefaultValue)
		});
	}
	function ie(e) {
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
	}), On(), xi();
	var ae = Ar(), oe = I(ae), se = (e) => {
		var t = Ci();
		z(() => {
			Z(t, 1, $r(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, ce = (e) => {
		var t = ki(), r = F(t);
		ui(r), bi(r, (e) => P(te, e), () => H(te));
		var c = L(r, 2), l = (e) => {
			var t = wi();
			ot(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), hi(t, () => H(T), (e) => P(T, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Ti(), r = F(n, !0);
			k(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), k(d);
		var f = L(d, 2), p = (e) => {
			var t = Ei(), n = F(t, !0);
			k(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = Di(), n = I(t), r = F(n, !0);
			k(n);
			var i = L(n, 2), a = F(i), o = F(a, !0);
			k(a);
			var c = L(a, 2), l = F(c, !0);
			k(c), k(i), z(() => {
				Q(n, "hidden", !b()), J(r, b()), J(o, y()), J(l, H(s));
			}), G("click", a, function(...e) {
				S()?.apply(this, e);
			}), q(e, t);
		}, x = (e) => {
			var t = Oi(), n = I(t), r = F(n, !0);
			k(n);
			var i = L(n, 2), a = F(i, !0);
			k(i);
			var o = L(i, 2), c = F(o, !0);
			k(o), z(() => {
				J(r, y()), J(a, H(s)), Q(o, "hidden", !b()), J(c, b());
			}), G("click", n, function(...e) {
				S()?.apply(this, e);
			}), q(e, t);
		};
		Y(g, (e) => {
			H(n) ? e(v) : e(x, -1);
		}), k(t), z(() => {
			Z(t, 1, $r(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), Sr("submit", t, re), G("keydown", t, ie), hi(r, () => H(w), (e) => P(w, e)), ii(d, () => H(ee), (e) => P(ee, e)), q(e, t);
	};
	Y(oe, (e) => {
		l() ? e(ce, -1) : e(se);
	}), q(e, ae), Ke();
}
Cr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var ji = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function Mi(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Ar();
	X(I(i), 1, n, Vr, (e, t) => {
		let n = /* @__PURE__ */ St(() => (H(t), U(() => H(t).level ?? "error")));
		var i = ji(), a = F(i), o = F(a, !0);
		k(a);
		var s = L(a, 2), c = F(s, !0);
		k(s), k(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Ni = /* @__PURE__ */ K("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function Pi(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), On(), xi();
	var d = Ni(), f = F(d, !0);
	k(d), z(() => {
		Q(d, "aria-pressed", H(n)), Q(d, "aria-label", `目前為${H(r)}；按下切換到${H(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(f, H(r));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), Ke();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Fi = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <progress class=\"project-progress-meter\" id=\"project-progress-meter\" max=\"100\"></progress>", 1);
function Ii(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "timeProgressPercent", 8, null);
	R(() => (W(o()), W(r()), W(i()), W(a())), () => {
		P(n, o() === null ? `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位` : `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；時間已使用 ${o()}%`);
	}), On();
	var s = Fi(), c = I(s), l = F(c), u = F(l);
	k(l), k(c);
	var d = L(c, 2);
	z(() => {
		J(u, `整體約 ${r() ?? ""}%`), di(d, r()), Q(d, "aria-label", H(n));
	}), q(e, s), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Li = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), Ri = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function zi(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Ar();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = Ri(), i = F(n), a = F(i, !0);
		k(i);
		var o = L(i, 2), s = (e) => {
			var n = Li(), i = F(n, !0);
			k(n), z(() => {
				Q(n, "href", (H(t), U(() => H(t).baseOnlyHref))), J(i, r());
			}), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).baseOnlyHref) && e(s);
		}), k(n), z(() => {
			Q(i, "href", (H(t), U(() => H(t).href))), J(a, (H(t), U(() => H(t).id)));
		}), q(e, n);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Bi = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1);
function Vi(e, t) {
	let n = $(t, "dirty", 8, !1), r = $(t, "saving", 8, !1), i = $(t, "canUndo", 8, !1), a = $(t, "canRedo", 8, !1), o = $(t, "message", 8, ""), s = $(t, "buttonLabel", 8, "儲存"), c = $(t, "savingLabel", 8, "正在儲存…"), l = $(t, "undoLabel", 8, "復原"), u = $(t, "redoLabel", 8, "重做"), d = $(t, "onSave", 8, () => {}), f = $(t, "onUndo", 8, () => {}), p = $(t, "onRedo", 8, () => {});
	var m = Bi(), h = I(m), g = F(h, !0);
	k(h);
	var _ = L(h, 2), v = F(_), y = F(v, !0);
	k(v);
	var b = L(v, 2), x = F(b, !0);
	k(b), k(_);
	var S = L(_, 2), C = F(S, !0);
	k(S), z(() => {
		J(g, o()), Q(v, "aria-label", `${l()}上一個修改`), v.disabled = !i() || r(), J(y, l()), Q(b, "aria-label", `${u()}下一個修改`), b.disabled = !a() || r(), J(x, u()), S.disabled = !n() || r(), J(C, r() ? c() : s());
	}), G("click", v, function(...e) {
		f()?.apply(this, e);
	}), G("click", b, function(...e) {
		p()?.apply(this, e);
	}), G("click", S, function(...e) {
		d()?.apply(this, e);
	}), q(e, m);
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusFilters.svelte
var Hi = /* @__PURE__ */ K("<button type=\"button\"> </button>");
function Ui(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = $(t, "activeFilter", 8, "all"), o = $(t, "statusLabels", 24, () => ({})), s = $(t, "onFilterChange", 8, () => {}), c = $(t, "onReorder", 8, () => {}), l = /* @__PURE__ */ N(null), u = /* @__PURE__ */ N(null), d = !1, f = null, p = /* @__PURE__ */ N(null), m = /* @__PURE__ */ N();
	async function h() {
		let e = H(p);
		P(p, null), await mr(), H(m)?.parentElement?.querySelector(`[data-filter="${e}"]`)?.focus();
	}
	function g() {
		P(l, null), P(u, null);
	}
	function _(e, t) {
		return t?.status === e ? t.placeAfter ? "status-drop-after" : "status-drop-before" : "";
	}
	function v(e, t) {
		let n = e.getBoundingClientRect();
		return t >= n.left + n.width / 2;
	}
	function y(e, t, n, r = null) {
		P(p, r), c()(e, t, n);
	}
	function b(e, t) {
		let r = H(n).filter((e) => e !== "all"), i = r.indexOf(e), a = i + t;
		i < 0 || a < 0 || a >= r.length || y(e, r[a], t > 0, e);
	}
	function x(e, t) {
		if (d) {
			t.preventDefault(), d = !1;
			return;
		}
		s()(e);
	}
	function S(e, t) {
		!t.altKey || !["ArrowLeft", "ArrowRight"].includes(t.key) || (t.preventDefault(), b(e, t.key === "ArrowLeft" ? -1 : 1));
	}
	function C(e, t) {
		P(l, e), d = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e);
	}
	function w(e, t) {
		!H(l) || e === H(l) || (t.preventDefault(), t.dataTransfer.dropEffect = "move", P(u, {
			status: e,
			placeAfter: v(t.currentTarget, t.clientX)
		}));
	}
	function T(e, t) {
		t.currentTarget.contains(t.relatedTarget) || H(u)?.status === e && P(u, null);
	}
	function ee(e, t) {
		if (!H(l)) return;
		t.preventDefault();
		let n = H(l), r = v(t.currentTarget, t.clientX);
		g(), y(n, e, r);
	}
	function te() {
		g(), setTimeout(() => {
			d = !1;
		}, 0);
	}
	function ne(e, t) {
		t.pointerType !== "mouse" && t.button === 0 && (f = {
			pointerId: t.pointerId,
			status: e,
			startX: t.clientX,
			startY: t.clientY,
			active: !1,
			targetStatus: null,
			placeAfter: !1
		}, t.currentTarget.setPointerCapture?.(t.pointerId));
	}
	function re(e, t) {
		if (!f || f.pointerId !== t.pointerId) return;
		let n = t.clientX - f.startX, r = t.clientY - f.startY;
		if (!f.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			f.active = !0, d = !0, P(l, e);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.(".filter-button.status-sortable") ?? null, a = i?.dataset.filter ?? null;
		if (!a || a === e) {
			f.targetStatus = null, P(u, null);
			return;
		}
		f.targetStatus = a, f.placeAfter = v(i, t.clientX), P(u, {
			status: a,
			placeAfter: f.placeAfter
		});
	}
	function ie(e) {
		if (!f || f.pointerId !== e.pointerId) return;
		let t = f;
		f = null, e.currentTarget.releasePointerCapture?.(e.pointerId), g(), t.active && t.targetStatus && y(t.status, t.targetStatus, t.placeAfter), setTimeout(() => {
			d = !1;
		}, 0);
	}
	R(() => (W(i()), W(r())), () => {
		P(n, ["all", ...i()].filter((e) => e === "all" || (r()[e] ?? 0) > 0));
	}), R(() => (W(i()), H(p)), () => {
		i() && H(p) && h();
	}), On(), xi();
	var ae = Ar();
	X(I(ae), 1, () => H(n), (e) => e, (e, t) => {
		let i = /* @__PURE__ */ St(() => (H(t), W(o()), U(() => H(t) === "all" ? "全部" : o()[H(t)] ?? H(t)))), s = /* @__PURE__ */ St(() => (W(r()), H(t), U(() => r()[H(t)] ?? 0))), c = /* @__PURE__ */ St(() => H(t) !== "all");
		var d = Hi(), f = F(d);
		k(d), bi(d, (e) => P(m, e), () => H(m)), z((e, n) => {
			Z(d, 1, `filter-button ${H(c) ? "status-sortable" : ""} ${H(l) === H(t) ? "status-dragging" : ""} ${e ?? ""}`), Q(d, "data-filter", H(t)), Q(d, "aria-pressed", H(t) === a()), Q(d, "draggable", H(c)), Q(d, "title", H(c) ? H(t) === "planned" ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序" : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動" : null), Q(d, "aria-keyshortcuts", H(c) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(d, "aria-label", n), J(f, `${H(i) ?? ""} ${H(s) ?? ""}`);
		}, [() => (H(t), H(u), U(() => _(H(t), H(u)))), () => (W(H(c)), W(H(i)), W(H(s)), H(n), H(t), U(() => H(c) ? `${H(i)} ${H(s)}，排序第 ${H(n).indexOf(H(t))}；可拖曳調整` : null))]), G("click", d, (e) => x(H(t), e)), G("keydown", d, function(...e) {
			(H(c) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), Sr("dragstart", d, function(...e) {
			(H(c) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), Sr("dragover", d, function(...e) {
			(H(c) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), Sr("dragleave", d, function(...e) {
			(H(c) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), Sr("drop", d, function(...e) {
			(H(c) ? (e) => ee(H(t), e) : null)?.apply(this, e);
		}), Sr("dragend", d, function(...e) {
			(H(c) ? te : null)?.apply(this, e);
		}), G("pointerdown", d, function(...e) {
			(H(c) ? (e) => ne(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", d, function(...e) {
			(H(c) ? (e) => re(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", d, function(...e) {
			(H(c) ? ie : null)?.apply(this, e);
		}), Sr("pointercancel", d, function(...e) {
			(H(c) ? ie : null)?.apply(this, e);
		}), q(e, d);
	}), q(e, ae), Ke();
}
Cr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var Wi = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function Gi(e, t) {
	Ge(t, !1);
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
	}), On(), xi();
	var o = Ar();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = Wi(), r = F(n), i = F(r, !0);
		k(r);
		var a = L(r, 2), o = F(a, !0);
		k(a), k(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var Ki = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), qi = /* @__PURE__ */ K("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), Ji = /* @__PURE__ */ K("<li> </li>"), Yi = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), Xi = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), Zi = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), Qi = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), $i = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), ea = /* @__PURE__ */ K("<p> </p>"), ta = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), na = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), ra = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), ia = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), aa = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), oa = /* @__PURE__ */ K("<!> <!>", 1);
function sa(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "developer", 8, null);
	R(() => W(o()), () => {
		P(n, o()?.next_steps ?? []);
	}), R(() => (W(o()), H(n)), () => {
		P(r, o()?.next_step ?? H(n)[0] ?? "尚未指定下一步");
	}), R(() => (W(o()), H(n)), () => {
		P(i, o()?.next_step ? H(n) : H(n).slice(1));
	}), R(() => (H(i), W(o())), () => {
		P(a, !!(H(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), On(), xi();
	var s = Ar(), c = I(s), l = (e) => {
		var t = Ar();
		Xr(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = oa(), s = I(n);
			Xr(s, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = qi(), i = L(I(n), 2), o = F(i, !0);
				k(i);
				var s = L(i, 2), c = (e) => {
					q(e, Ki());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), z(() => J(o, H(r))), q(t, n);
			});
			var c = L(s, 2), l = (e) => {
				var t = aa(), n = L(F(t), 2), r = (e) => {
					var t = Yi(), n = L(F(t), 2);
					X(n, 5, () => H(i), Vr, (e, t) => {
						var n = Ji(), r = F(n, !0);
						k(n), z(() => J(r, H(t))), q(e, n);
					}), k(n), k(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), s = (e) => {
					var t = Xi(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().blockers)), Vr, (e, t) => {
						var n = Ji(), r = F(n, !0);
						k(n), z(() => J(r, H(t))), q(e, n);
					}), k(n), k(t), q(e, t);
				};
				Y(a, (e) => {
					W(o()), U(() => o().blockers?.length) && e(s);
				});
				var c = L(a, 2), l = (e) => {
					var t = $i(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().decisions)), Vr, (e, t) => {
						var n = Qi(), r = F(n), i = F(r, !0);
						k(r);
						var a = L(r, 2), o = (e) => {
							var n = Zi(), r = F(n, !0);
							k(n), z(() => J(r, (H(t), U(() => H(t).reference)))), q(e, n);
						};
						Y(a, (e) => {
							H(t), U(() => H(t).reference) && e(o);
						}), k(n), z(() => J(i, (H(t), U(() => H(t).summary)))), q(e, n);
					}), k(n), k(t), q(e, t);
				};
				Y(c, (e) => {
					W(o()), U(() => o().decisions?.length) && e(l);
				});
				var u = L(c, 2), d = (e) => {
					var t = na(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().routes)), Vr, (e, t) => {
						var n = ta(), r = F(n), i = F(r), a = F(i, !0);
						k(i);
						var o = L(i, 2), s = F(o, !0);
						k(o), k(r);
						var c = L(r, 2), l = (e) => {
							var n = ea(), r = F(n, !0);
							k(n), z(() => J(r, (H(t), U(() => H(t).reason)))), q(e, n);
						};
						Y(c, (e) => {
							H(t), U(() => H(t).reason) && e(l);
						}), k(n), z(() => {
							J(a, (H(t), U(() => H(t).title))), Z(o, 1, (H(t), U(() => `route-state route-${H(t).state}`))), J(s, (H(t), U(() => H(t).state)));
						}), q(e, n);
					}), k(n), k(t), q(e, t);
				};
				Y(u, (e) => {
					W(o()), U(() => o().routes?.length) && e(d);
				});
				var f = L(u, 2), p = (e) => {
					var t = ia(), n = L(F(t), 2), r = F(n);
					k(n);
					var i = L(n, 2), a = (e) => {
						var t = ea(), n = F(t);
						k(t), z(() => J(n, `Worktree: ${W(o()), U(() => o().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(o()), U(() => o().claim.worktree) && e(a);
					});
					var s = L(i, 2), c = (e) => {
						var t = ra();
						X(t, 5, () => (W(o()), U(() => o().claim.source_paths)), Vr, (e, t) => {
							var n = Zi(), r = F(n, !0);
							k(n), z(() => J(r, H(t))), q(e, n);
						}), k(t), q(e, t);
					};
					Y(s, (e) => {
						W(o()), U(() => o().claim.source_paths?.length) && e(c);
					}), k(t), z(() => J(r, `Agent: ${W(o()), U(() => o().claim.agent) ?? ""}`)), q(e, t);
				};
				Y(f, (e) => {
					W(o()), U(() => o().claim) && e(p);
				}), k(t), q(e, t);
			};
			Y(c, (e) => {
				H(a) && e(l);
			}), q(t, n);
		}), q(e, t);
	};
	Y(c, (e) => {
		o() && e(l);
	}), q(e, s), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var ca = /* @__PURE__ */ K("<option> </option>"), la = /* @__PURE__ */ K("<button class=\"time-item-button\" type=\"button\"> </button>"), ua = /* @__PURE__ */ K("<span class=\"time-item-button\"> </span>"), da = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), fa = /* @__PURE__ */ K("<details class=\"spike-estimate-editor\"><summary><span>人工工時與依據</span> <small> </small></summary> <div class=\"spike-estimate-fields\"><label><span>工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <button type=\"button\">套用工時草稿</button> <!></div></details>"), pa = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button> <!>", 1), ma = /* @__PURE__ */ K("<span> </span>"), ha = /* @__PURE__ */ K("<span class=\"spike-item-title\"> </span> <!> <!>", 1), ga = /* @__PURE__ */ K("<li><!></li>");
function _a(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "onTimeClick", 8, null), h = /* @__PURE__ */ N(f() ? String(f().likely_minutes / 60) : d() ? String(d().likely_minutes / 60) : ""), g = /* @__PURE__ */ N(f()?.human_note ?? ""), _ = /* @__PURE__ */ N(!!f()?.human_confirmed), v = /* @__PURE__ */ N("");
	function y() {
		let e = Number(H(h));
		if (!Number.isFinite(e) || e <= 0) {
			P(v, "工時必須大於 0。");
			return;
		}
		let t = p()?.({
			taskId: a(),
			itemId: s().id,
			likelyMinutes: Math.round(e * 60),
			humanNote: H(g),
			humanConfirmed: H(_)
		});
		P(v, t?.error ?? "");
	}
	R(() => (W(l()), W(s())), () => {
		P(n, l().metadata(s().priority));
	}), R(() => (W(l()), W(s())), () => {
		P(r, l().format(s().priority));
	}), R(() => W(d()), () => {
		P(i, d() ? d().label ?? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), On(), xi();
	var b = ga();
	let x;
	var S = F(b), C = (e) => {
		var t = pa(), n = I(t);
		ui(n);
		var r = L(n, 2);
		X(r, 5, () => (W(l()), U(() => l().levels)), (e) => e.value, (e, t) => {
			var n = ca(), r = F(n, !0);
			k(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(l()), H(t), U(() => l().format(H(t).value)))]), q(e, n);
		}), k(r);
		var c;
		ri(r);
		var f = L(r, 2), b = (e) => {
			var t = la(), n = F(t, !0);
			k(t), z(() => {
				Q(t, "aria-label", (W(s()), H(i), U(() => `${s().title}，${H(i)}，查看估算依據`))), J(n, H(i));
			}), G("click", t, () => m()(s().id, s().title)), q(e, t);
		}, x = (e) => {
			var t = ua(), n = F(t, !0);
			k(t), z(() => {
				Q(t, "title", (W(d()), U(() => `目前分析：${d().likely_minutes} 分鐘`))), J(n, H(i));
			}), q(e, t);
		};
		Y(f, (e) => {
			d() && m() ? e(b) : d() && e(x, 1);
		});
		var S = L(f, 2), C = L(S, 2), w = (e) => {
			var t = fa(), n = F(t), r = L(F(n), 2), i = F(r, !0);
			k(r), k(n);
			var a = L(n, 2), o = F(a), c = L(F(o), 2);
			ui(c), k(o);
			var l = L(o, 2), u = L(F(l), 2);
			ui(u), k(l);
			var d = L(l, 2), f = F(d);
			ui(f), Ie(2), k(d);
			var p = L(d, 4), m = L(p, 2), b = (e) => {
				var t = da(), n = F(t, !0);
				k(t), z(() => J(n, H(v))), q(e, t);
			};
			Y(m, (e) => {
				H(v) && e(b);
			}), k(a), k(t), z(() => {
				J(i, H(_) ? "已確認" : "未確認"), Q(c, "aria-label", (W(s()), U(() => `「${s().title}」人工工時（hr）`))), Q(u, "aria-label", (W(s()), U(() => `「${s().title}」人工依據`))), Q(f, "aria-label", (W(s()), U(() => `確認「${s().title}」的人工估算`))), Q(p, "aria-label", (W(s()), U(() => `套用「${s().title}」人工估算草稿`)));
			}), hi(c, () => H(h), (e) => P(h, e)), hi(u, () => H(g), (e) => P(g, e)), gi(f, () => H(_), (e) => P(_, e)), G("click", p, y), q(e, t);
		};
		Y(C, (e) => {
			p() && e(w);
		}), z(() => {
			Q(n, "aria-label", (W(s()), U(() => `編輯子項目：${s().title}`))), di(n, (W(s()), U(() => s().title))), Q(r, "aria-label", (W(s()), U(() => `設定「${s().title}」的優先級`))), c !== (c = (W(s()), U(() => s().priority))) && (r.value = (r.__value = (W(s()), U(() => s().priority))) ?? "", ni(r, (W(s()), U(() => s().priority)))), Q(S, "aria-label", (W(s()), U(() => `刪除子項目：${s().title}`)));
		}), G("input", n, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "title",
			value: e.currentTarget.value
		})), G("change", r, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "priority",
			value: Number(e.currentTarget.value)
		})), G("click", S, () => u()({
			type: "delete-item",
			taskId: a(),
			field: o(),
			itemId: s().id
		})), q(e, t);
	}, w = (e) => {
		var t = ha(), a = I(t), o = F(a, !0);
		k(a);
		var c = L(a, 2), u = (e) => {
			var t = ma(), i = F(t, !0);
			k(t), z(() => {
				Z(t, 1, (H(n), U(() => `priority-badge priority-${H(n).tone}`))), J(i, H(r));
			}), q(e, t);
		};
		Y(c, (e) => {
			H(n), W(l()), U(() => H(n) && (!H(n).hidden || !l().labelsValid)) && e(u);
		});
		var f = L(c, 2), p = (e) => {
			var t = la(), n = F(t, !0);
			k(t), z(() => {
				Q(t, "aria-label", (W(s()), H(i), U(() => `${s().title}，${H(i)}，查看估算依據`))), J(n, H(i));
			}), G("click", t, () => m()(s().id, s().title)), q(e, t);
		}, h = (e) => {
			var t = ua(), n = F(t, !0);
			k(t), z(() => {
				Q(t, "title", (W(d()), U(() => `目前分析：${d().likely_minutes} 分鐘`))), J(n, H(i));
			}), q(e, t);
		};
		Y(f, (e) => {
			d() && m() ? e(p) : d() && e(h, 1);
		}), z(() => J(o, (W(s()), U(() => s().title)))), q(e, t);
	};
	Y(S, (e) => {
		c() ? e(C) : e(w, -1);
	}), k(b), z(() => x = Z(b, 1, "editor-item-row", null, x, {
		"editable-work-item": c(),
		"has-estimate-editor": c() && p()
	})), q(e, b), Ke();
}
Cr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var va = /* @__PURE__ */ K("<option> </option>"), ya = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), ba = /* @__PURE__ */ K("<span> </span>"), xa = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Sa = /* @__PURE__ */ K("<h3> </h3>"), Ca = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), wa = /* @__PURE__ */ K("<p class=\"task-summary\"> </p>"), Ta = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Ea = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Da = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Oa = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), ka = /* @__PURE__ */ K("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function Aa(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let f = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), p = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), m = $(t, "onManualEstimate", 8, null), h = $(t, "onTimeClick", 8, null), g = $(t, "statusOrder", 24, () => ["done", "planned"]), _ = $(t, "taskDuration", 8, null), v = [
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
	], y = /* @__PURE__ */ N(!1), b = /* @__PURE__ */ N(""), x = /* @__PURE__ */ N(l().creationDefaultValue), S = /* @__PURE__ */ N("");
	function C() {
		P(y, !1), P(b, ""), P(x, l().creationDefaultValue), P(S, "");
	}
	function w() {
		let e = d()(H(b), Number(H(x)));
		P(S, e.error), H(S) || C();
	}
	R(() => W(o()), () => {
		P(n, [{
			status: "done",
			title: "已完成",
			className: "completed-work",
			field: "completed_items",
			items: o().completed_items ?? []
		}, {
			status: "planned",
			title: "待處理",
			className: "pending-work",
			field: "pending_items",
			items: o().pending_items ?? []
		}]);
	}), R(() => (H(n), W(g())), () => {
		P(r, [...H(n)].sort((e, t) => {
			let n = g().indexOf(e.status), r = g().indexOf(t.status);
			return (n < 0 ? g().length : n) - (r < 0 ? g().length : r);
		}));
	}), R(() => (W(l()), W(o())), () => {
		P(i, l().metadata(o().priority));
	}), R(() => W(o()), () => {
		P(a, v.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), R(() => (W(c()), H(y)), () => {
		!c() && H(y) && C();
	}), On(), xi();
	var T = ka(), ee = F(T), te = F(ee), ne = F(te), re = F(ne), ie = F(re, !0);
	k(re);
	var ae = L(re, 2), oe = (e) => {
		var t = ya(), n = I(t);
		X(n, 5, () => v, (e) => e.value, (e, t) => {
			var n = va(), r = F(n, !0);
			k(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), k(n);
		var r;
		ri(n);
		var i = L(n, 2);
		X(i, 5, () => (W(l()), U(() => l().levels)), (e) => e.value, (e, t) => {
			var n = va(), r = F(n, !0);
			k(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(l()), H(t), U(() => l().format(H(t).value)))]), q(e, n);
		}), k(i);
		var a;
		ri(i), z(() => {
			Q(n, "aria-label", (W(o()), U(() => `${o().title} 狀態`))), r !== (r = (W(o()), U(() => o().status))) && (n.value = (n.__value = (W(o()), U(() => o().status))) ?? "", ni(n, (W(o()), U(() => o().status)))), Q(i, "aria-label", (W(o()), U(() => `${o().title} 優先級`))), a !== (a = (W(o()), U(() => o().priority))) && (i.value = (i.__value = (W(o()), U(() => o().priority))) ?? "", ni(i, (W(o()), U(() => o().priority))));
		}), G("change", n, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: e.currentTarget.value
		})), G("change", i, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(e.currentTarget.value)
		})), q(e, t);
	}, se = (e) => {
		var t = ba(), n = F(t, !0);
		k(t), z((e, r, a) => {
			Z(t, 1, (H(i), U(() => `task-priority-badge priority-badge priority-${H(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), J(n, a);
		}, [
			() => (W(l()), W(o()), U(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (W(l()), W(o()), U(() => `優先級：${l().format(o().priority)}`)),
			() => (W(l()), W(o()), U(() => l().format(o().priority)))
		]), q(e, t);
	};
	Y(ae, (e) => {
		c() ? e(oe) : (H(i), W(l()), U(() => H(i) && (!H(i).hidden || !l().labelsValid)) && e(se, 1));
	}), k(ne);
	var ce = L(ne, 2), le = F(ce), ue = (e) => {
		var t = xa();
		ui(t), z(() => {
			Q(t, "id", (W(o()), U(() => `task-${o().id}-title`))), di(t, (W(o()), U(() => o().title)));
		}), G("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, de = (e) => {
		var t = Sa(), n = F(t, !0);
		k(t), z(() => {
			Q(t, "id", (W(o()), U(() => `task-${o().id}-title`))), J(n, (W(o()), U(() => o().title)));
		}), q(e, t);
	};
	Y(le, (e) => {
		c() ? e(ue) : e(de, -1);
	});
	var fe = L(le, 2), pe = F(fe, !0);
	k(fe), k(ce), k(te);
	var me = L(te, 2), he = F(me), ge = F(he);
	k(he);
	var _e = L(he, 2), ve = F(_e, !0);
	k(_e), k(me), k(ee);
	var ye = L(ee, 2), be = (e) => {
		var t = Ca();
		ot(t), z(() => di(t, (W(o()), U(() => o().summary)))), G("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), q(e, t);
	}, xe = (e) => {
		var t = wa(), n = F(t, !0);
		k(t), z(() => J(n, (W(o()), U(() => o().summary)))), q(e, t);
	};
	Y(ye, (e) => {
		c() ? e(be) : e(xe, -1);
	});
	var Se = L(ye, 2);
	{
		let e = /* @__PURE__ */ St(() => (W(o()), U(() => o().developer ?? null)));
		sa(Se, { get developer() {
			return H(e);
		} });
	}
	var Ce = L(Se, 2), we = F(Ce);
	X(we, 1, () => H(r), (e) => e.status, (e, t) => {
		var n = Ar(), r = I(n), i = (e) => {
			var n = Ta(), r = F(n), i = F(r, !0);
			k(r);
			var a = L(r, 2);
			X(a, 5, () => (H(t), U(() => H(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ St(() => (W(f()), H(n), U(() => f().get(H(n).id) ?? null))), i = /* @__PURE__ */ St(() => (W(p()), H(n), U(() => p().get(H(n).id) ?? null)));
					_a(e, {
						get taskId() {
							return W(o()), U(() => o().id);
						},
						get field() {
							return H(t), U(() => H(t).field);
						},
						get item() {
							return H(n);
						},
						get editing() {
							return c();
						},
						get policy() {
							return l();
						},
						get onCommand() {
							return u();
						},
						get timeItem() {
							return H(r);
						},
						get activeEstimate() {
							return H(i);
						},
						get onManualEstimate() {
							return m();
						},
						get onTimeClick() {
							return h();
						}
					});
				}
			}), k(a), k(n), z(() => {
				Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title)));
			}), q(e, n);
		};
		Y(r, (e) => {
			H(t), W(c()), U(() => H(t).items.length || c()) && e(i);
		}), q(e, n);
	});
	var Te = L(we, 2), Ee = F(Te), De = (e) => {
		var t = Oa(), n = F(t), r = (e) => {
			var t = Ea(), n = F(t);
			ui(n);
			var r = L(n, 2);
			X(r, 5, () => (W(l()), U(() => l().levels)), (e) => e.value, (e, t) => {
				var n = va(), r = F(n, !0);
				k(n);
				var i = {};
				z((e) => {
					J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
				}, [() => (W(l()), H(t), U(() => l().format(H(t).value)))]), q(e, n);
			}), k(r);
			var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
			k(o), k(t), z(() => {
				Q(o, "hidden", !H(S)), J(s, H(S));
			}), G("keydown", n, (e) => {
				e.key === "Enter" && w(), e.key === "Escape" && C();
			}), hi(n, () => H(b), (e) => P(b, e)), ii(r, () => H(x), (e) => P(x, e)), G("click", i, w), G("click", a, C), q(e, t);
		}, i = (e) => {
			var t = Da();
			z(() => Q(t, "aria-label", (W(o()), U(() => `在「${o().title}」新增子項目`)))), G("click", t, () => {
				P(y, !0);
			}), q(e, t);
		};
		Y(n, (e) => {
			H(y) ? e(r) : e(i, -1);
		}), k(t), q(e, t);
	};
	Y(Ee, (e) => {
		c() && e(De);
	}), k(Te), k(Ce), k(T), z(() => {
		Z(T, 1, (H(a), U(() => `task-card editor-task-card status-${H(a).tone}`))), Q(T, "aria-labelledby", (W(o()), U(() => `task-${o().id}-title`))), Z(re, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(ie, (H(a), U(() => H(a).label))), Q(fe, "hidden", !_()), J(pe, _() ? `約需 ${_()}` : ""), Q(he, "aria-label", (W(s()), U(() => `子項目完成 ${s().completed}，共 ${s().total}`))), J(ge, `${W(s()), U(() => s().completed) ?? ""} / ${W(s()), U(() => s().total) ?? ""}`), J(ve, (W(o()), U(() => o().id)));
	}), q(e, T), Ke();
}
Cr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var ja = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>");
function Ma(e, t) {
	Ge(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), d = $(t, "onManualEstimate", 8, null), f = $(t, "onTimeClick", 8, null), p = $(t, "durations", 24, () => ({})), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	xi();
	var g = Ar(), _ = I(g), v = (e) => {
		var t = Ar();
		X(I(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ St(() => (W(c()), H(t), U(() => c().get(H(t).id) ?? null))), h = /* @__PURE__ */ St(() => (W(p()), H(t), U(() => p()[H(t).id] ?? null)));
				Aa(e, {
					get task() {
						return H(t);
					},
					get progress() {
						return W(r()), H(t), U(() => r()[H(t).id]);
					},
					get editing() {
						return i();
					},
					get policy() {
						return a();
					},
					get onCommand() {
						return o();
					},
					onAddItem: (e, n) => s()(H(t).id, e, n),
					get timeTask() {
						return H(n);
					},
					get timeItems() {
						return l();
					},
					get activeEstimates() {
						return u();
					},
					get onManualEstimate() {
						return d();
					},
					get onTimeClick() {
						return f();
					},
					get statusOrder() {
						return m();
					},
					get taskDuration() {
						return H(h);
					}
				});
			}
		}), q(e, t);
	}, y = (e) => {
		var t = ja(), n = F(t, !0);
		k(t), z(() => J(n, h())), q(e, t);
	};
	Y(_, (e) => {
		W(n()), U(() => n().length) ? e(v) : e(y, -1);
	}), q(e, g), Ke();
}
//#endregion
//#region viewer/assets/theme-model.js
var Na = [
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
], Pa = Object.freeze({
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
var Fa = /^#[0-9a-f]{6}$/i;
function Ia(e) {
	return typeof e == "string" && Fa.test(e);
}
function La(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Pa[n], i = { base: n };
	for (let e of Na) {
		let n = t[e.key];
		i[e.key] = Ia(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Ra(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function za(e, t) {
	if (!Ia(e) || !Ia(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ra(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Ba(e) {
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
	].filter(([, e, t]) => za(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Va = /* @__PURE__ */ K("<option> </option>"), Ha = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Ua = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function Wa(e, t) {
	Ge(t, !1);
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(La(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(Na.map((t) => [t.key, e[t.key]]));
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
		y(o() ? La(o().base, o()) : La(s())), typeof H(f).showModal == "function" ? H(f).showModal() : H(f).setAttribute("open", "");
	}
	function S() {
		H(f).open && H(f).close();
	}
	function C(e) {
		y(La(e.currentTarget.value));
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
	function te(e) {
		e.preventDefault(), ee();
	}
	function ne() {
		let e = H(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(La(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, La(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, Ba(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), On(), xi();
	var re = Ua(), ie = I(re), ae = L(F(ie), 2);
	X(ae, 5, () => u, (e) => e.value, (e, t) => {
		var n = Va(), r = F(n, !0);
		k(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), k(ae), k(ie);
	var oe = L(ie, 2), se = F(oe), ce = L(F(se), 2);
	k(se);
	var le = L(se, 4), ue = L(F(le), 2), de = F(ue);
	de.value = de.__value = "light";
	var fe = L(de);
	fe.value = fe.__value = "dark", k(ue);
	var pe;
	ri(ue), k(le);
	var me = L(le, 2);
	X(me, 7, () => Na, (e) => e.key, (e, t, r) => {
		var i = Ha(), a = F(i), o = F(a, !0);
		k(a);
		var s = L(a, 2), c = F(s);
		ui(c);
		var l = L(c, 2);
		ui(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), bi(l, (e, t) => Zt(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), k(s), k(i), z(() => {
			J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), di(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), di(l, (H(g), H(t), U(() => H(g)[H(t).key])));
		}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => T(H(t), e)), q(e, i);
	}), k(me);
	var he = L(me, 2);
	let ge;
	var _e = F(he, !0);
	k(he);
	var ve = L(he, 2), ye = F(ve), be = L(ye, 4), xe = L(be, 2);
	k(ve), k(oe), bi(oe, (e) => P(f, e), () => H(f)), z(() => {
		pe !== (pe = H(h)) && (ue.value = (ue.__value = H(h)) ?? "", ni(ue, H(h))), ge = Z(he, 1, "theme-dialog-status", null, ge, { "theme-status-warning": H(r).length > 0 }), J(_e, H(i));
	}), G("change", ae, b), ii(ae, () => H(m), (e) => P(m, e)), Sr("cancel", oe, te), G("click", ce, ee), G("change", ue, C), G("click", ye, () => y(La(H(h)))), G("click", be, ee), G("click", xe, ne), q(e, re), Ke();
}
Cr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Ga = {
	"task-list": Ma,
	"status-overview": Gi,
	"status-filters": Ui,
	"project-progress": Ii,
	"mode-toggle": Pi,
	"save-bar": Vi,
	"add-control": Ai,
	diagnostics: Mi,
	"scope-directory": zi,
	"theme-control": Wa
}, Ka = {
	id: "svelte",
	regions: Object.keys(Ga),
	mount(e, t, n) {
		let r = nn({ ...n });
		return {
			component: Fr(Ga[e], {
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
		zr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(Ka);
//#endregion
