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
var b = 1024, x = 2048, S = 4096, C = 8192, w = 16384, ee = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, ie = 1 << 20, ae = 1 << 25, oe = 65536, se = 1 << 21, ce = 1 << 22, le = 1 << 23, ue = Symbol("$state"), de = Symbol("legacy props"), fe = Symbol(""), pe = Symbol("attributes"), me = Symbol("class"), he = Symbol("style"), ge = Symbol("text"), _e = Symbol("form reset"), ve = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ye = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function be() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function xe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Se(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ce() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function we(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Te() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ee(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function De() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ke() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ae() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function je() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Me(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ne() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Pe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var T = !1;
function Fe(e) {
	T = e;
}
var E;
function D(e) {
	if (e === null) throw Me(), t;
	return E = e;
}
function Ie() {
	return D(/* @__PURE__ */ pn(E));
}
function O(e) {
	if (T) {
		if (/* @__PURE__ */ pn(E) !== null) throw Me(), t;
		E = e;
	}
}
function Le(e = 1) {
	if (T) {
		for (var t = e, n = E; t--;) n = /* @__PURE__ */ pn(n);
		E = n;
	}
}
function Re(e = !0) {
	for (var t = 0, n = E;;) {
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
function ze(e) {
	if (!e || e.nodeType !== 8) throw Me(), t;
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
var k = null;
function Ge(e) {
	k = e;
}
function Ke(e, t = !1, n) {
	k = {
		p: k,
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
	var t = k, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) wn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, e ?? {};
}
function Je() {
	return !Ue || k !== null && k.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], v(e);
}
function Ze(e) {
	if (Ye.length === 0 && !Nt) {
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
	if (t === null) return B.f |= le, e;
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
function A(e, t) {
	e.f = e.f & tt | t;
}
function nt(e) {
	e.f & 512 || e.deps === null ? A(e, b) : A(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function rt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= oe, rt(t.deps));
}
function it(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e.deps), A(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var at = !1;
function ot(e) {
	var t = at;
	try {
		return at = !1, [e(), at];
	} finally {
		at = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function st(e) {
	T && /* @__PURE__ */ fn(e) !== null && mn(e);
}
var ct = !1;
function lt() {
	ct || (ct = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[_e]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ut(e) {
	var t = B, n = V;
	Jn(null), Yn(null);
	try {
		return e();
	} finally {
		Jn(t), Yn(n);
	}
}
function dt(e, t, n, r = n) {
	e.addEventListener(t, () => ut(n));
	let i = e[_e];
	e[_e] = i ? () => {
		i(), r(!0);
	} : () => r(!0), lt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ft(e) {
	let t = 0, n = Xt(0), r;
	return () => {
		xn() && (U(n), An(() => (t === 0 && (r = W(() => e(() => en(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, en(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var pt = ne | re;
function mt(e, t, n, r) {
	new ht(e, t, n, r);
}
var ht = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = T ? E : null;
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
	#h = ft(() => (this.#m = Xt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (T) {
				let e = this.#t;
				Ie();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, pt), T && (this.#e = E);
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
		Ze(r), t && (this.#s = Mn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Pe();
				return;
			}
			t = !0, n && Ae(), this.#s !== null && Rn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = dn();
			e.append(t), this.#a = this.#S(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Rn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Mn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Hn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Mn(() => t(this.#e));
			} else this.#x(j);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		it(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = k;
		Yn(this.#i), Jn(this.#i), Ge(this.#i.ctx);
		try {
			return zt.ensure(), e();
		} catch (e) {
			return $e(e), null;
		} finally {
			Yn(t), Jn(n), Ge(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && Qt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), T && (D(this.#t), Le(), D(Re()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Mn(() => {
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
function gt(e, t, n, r) {
	let i = Je() ? bt : Ct;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = _t(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				et(e, s);
			}
			vt();
		}
	}
	var d = yt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ St(e))).then(u).catch((e) => et(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), vt();
	}) : f();
}
function _t() {
	var e = V, t = B, n = k, r = j;
	return function(i = !0) {
		Yn(e), Jn(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	Yn(null), Jn(null), Ge(null), e && j?.deactivate();
}
function yt() {
	var e = V, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	var t = 2 | x;
	return V !== null && (V.f |= re), {
		ctx: k,
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
var xt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function St(e, t, r) {
	let i = V;
	i === null && be();
	var a = void 0, o = Xt(n), s = !B, c = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ve && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = yt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(xt);
			else for (let e of c.values()) e.reject(xt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== xt && (r.activate(), t ? (o.f |= le, Qt(o, t)) : (o.f & 8388608 && (o.f ^= le), Qt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Sn(() => {
		for (let e of c) e.reject(xt);
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
function Ct(e) {
	let t = /* @__PURE__ */ bt(e);
	return t.equals = He, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function Tt(e) {
	var t, r = V, i = e.parent;
	if (!Gn && i !== null && e.v !== n && i.f & 24576) return je(), e.v;
	Yn(i);
	try {
		e.f &= ~oe, wt(e), t = cr(e);
	} finally {
		Yn(r);
	}
	return t;
}
function Et(e) {
	var t = Tt(e);
	if (!e.equals(t) && (e.wv = ar(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		A(e, b);
		return;
	}
	Gn || (jt === null ? nt(e) : (xn() || j?.is_fork) && jt.set(e, t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ut(() => {
		t.ac.abort(ve), t.ac = null;
	}), t.fn !== null && (t.teardown = g), ur(t, 0), Pn(t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var kt = null, j = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, Rt = 1, zt = class e {
	id = Rt++;
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
		kt === null ? kt = this : (kt.#n = this, this.#t = kt), kt = this;
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
			for (var r of n.d) A(r, x), t(r);
			for (r of n.m) A(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Lt++ > 1e3 && (this.#x(), Vt());
		for (let e of this.#u) this.#d.delete(e), A(e, x), this.schedule(e);
		for (let e of this.#d) A(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ft = [], r = [], i = It = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Kt(e), this.#h() || this.discard(), t;
		}
		if (j = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ft = null, It = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Gt(e, t);
			i.length > 0 && j.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), At = this, Ut(r), Ut(n), At = null, this.#s?.resolve();
		var s = j;
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
				a ? r.f ^= b : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), dr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), A(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), j = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) it(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), jt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, jt = null;
	}
	flush() {
		try {
			Pt = !0, j = this, this.#g();
		} finally {
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, j = null, jt = null, Jt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(xt);
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
		if (j === null) {
			let t = j = new e();
			!Pt && !Nt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return j;
	}
	apply() {
		jt = null;
	}
	schedule(e) {
		if (Mt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ft !== null && t === V && (B === null || !(B.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? kt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Bt(e) {
	var t = Nt;
	Nt = !0;
	try {
		var n;
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if (Qe(), j === null) return n;
			j.flush();
		}
	} finally {
		Nt = t;
	}
}
function Vt() {
	try {
		Te();
	} catch (e) {
		et(e, Mt);
	}
}
var Ht = null;
function Ut(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (Ht = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Ln(r), Ht?.size > 0)) {
				Jt.clear();
				for (let e of Ht) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ht.has(n) && (Ht.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
					}
				}
				Ht.clear();
			}
		}
		Ht = null;
	}
}
function Wt(e) {
	j.schedule(e);
}
function Gt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, b);
		for (var n = e.first; n !== null;) Gt(n, t), n = n.next;
	}
}
function Kt(e) {
	A(e, b);
	for (var t = e.first; t !== null;) Kt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var qt = /* @__PURE__ */ new Set(), Jt = /* @__PURE__ */ new Map(), Yt = !1;
function Xt(e, t) {
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
function Zt(e, t) {
	let n = Xt(e, t);
	return Zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t = !1, n = !0) {
	let r = Xt(e);
	return t || (r.equals = He), Ue && n && k !== null && k.l !== null && (k.l.s ??= []).push(r), r;
}
function N(e, t, n = !1) {
	return B !== null && (!qn || B.f & 131072) && Je() && B.f & 4325394 && (Xn === null || !Xn.has(e)) && ke(), Qt(e, n ? nn(t) : t, It);
}
function Qt(e, t, n = null) {
	if (!e.equals(t)) {
		Jt.set(e, Gn ? t : e.v);
		var r = zt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Tt(t), jt === null && nt(t);
		}
		e.wv = ar(), tn(e, x, n), Je() && V !== null && V.f & 1024 && !(V.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && qt.size > 0 && !Yt && $t();
	}
	return t;
}
function $t() {
	Yt = !1;
	for (let e of qt) {
		e.f & 1024 && A(e, S);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && dr(e);
	}
	qt.clear();
}
function en(e) {
	N(e, e.v + 1);
}
function tn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && A(s, t), c & 131072) qt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= oe), tn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Ht !== null && Ht.add(d), n === null ? Wt(d) : n.push(d);
			}
		}
	}
}
function nn(e) {
	if (typeof e != "object" || !e || ue in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Zt(0), s = null, c = rr, l = (e) => {
		if (rr === c) return e();
		var t = B, n = rr;
		Jn(null), ir(c);
		var r = e();
		return Jn(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Zt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && De();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Zt(n.value, s);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Zt(n, s));
					r.set(t, e), en(o);
				}
			} else N(i, n), en(o);
			return !0;
		},
		get(t, i, a) {
			if (i === ue) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Zt(nn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = U(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			var i = Reflect.getOwnPropertyDescriptor(e, t);
			if (i && "value" in i) {
				var a = r.get(t);
				a && (i.value = U(a));
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
			if (t === ue) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Zt(a ? nn(e[t]) : n, s)), r.set(t, i)), U(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Zt(n, s)), r.set(p + "", m)) : N(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Zt(void 0, s)), N(d, nn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => nn(a));
				N(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				en(o);
			}
			return !0;
		},
		ownKeys(e) {
			U(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== n;
			});
			for (var [i, a] of r) a.v !== n && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Oe();
		}
	});
}
function rn(e) {
	try {
		if (typeof e == "object" && e && ue in e) return e[ue];
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
		cn = u(t, "firstChild").get, ln = u(t, "nextSibling").get, h(e) && (e[me] = void 0, e[pe] = null, e[he] = void 0, e.__e = void 0), h(n) && (n[ge] = void 0);
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
function P(e, t) {
	if (!T) return /* @__PURE__ */ fn(e);
	var n = /* @__PURE__ */ fn(E);
	if (n === null) n = E.appendChild(dn());
	else if (t && n.nodeType !== 3) {
		var r = dn();
		return n?.before(r), D(r), r;
	}
	return t && _n(n), D(n), n;
}
function F(e, t = !1) {
	if (!T) {
		var n = /* @__PURE__ */ fn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ pn(n) : n;
	}
	if (t) {
		if (E?.nodeType !== 3) {
			var r = dn();
			return E?.before(r), D(r), r;
		}
		_n(E);
	}
	return E;
}
function I(e, t = 1, n = !1) {
	let r = T ? E : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ pn(r);
	if (!T) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = dn();
			return r === null ? i?.after(a) : r.before(a), D(a), a;
		}
		_n(r);
	}
	return D(r), r;
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
	V === null && (B === null && we(e), Ce()), Gn && Se(e);
}
function yn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function bn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: k,
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
	j?.register_created_effect(r);
	var i = r;
	if (e & 4) Ft === null ? zt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			dr(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && yn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function xn() {
	return B !== null && !qn;
}
function Sn(e) {
	let t = bn(8, null);
	return A(t, b), t.teardown = e, t;
}
function Cn(e) {
	vn("$effect");
	var t = V.f;
	if (!B && t & 32 && k !== null && !k.i) {
		var n = k;
		(n.e ??= []).push(e);
	} else return wn(e);
}
function wn(e) {
	return bn(4 | ie, e);
}
function Tn(e) {
	return vn("$effect.pre"), bn(8 | ie, e);
}
function En(e) {
	zt.ensure();
	let t = bn(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Rn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function Dn(e) {
	return bn(4, e);
}
function L(e, t) {
	var n = k, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = An(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Yn(n.parent), W(t);
			} finally {
				Yn(n);
			}
		}
	});
}
function On() {
	var e = k;
	An(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && A(n, S), or(n) && dr(n), t.ran = !1;
		}
	});
}
function kn(e) {
	return bn(ce | re, e);
}
function An(e, t = 0) {
	return bn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		bn(8, () => {
			e(...t.map(U));
		});
	});
}
function jn(e, t = 0) {
	return bn(16 | t, e);
}
function Mn(e) {
	return bn(32 | re, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Gn, n = B;
		Kn(!0), Jn(null);
		try {
			t.call(null);
		} finally {
			Kn(e), Jn(n);
		}
	}
}
function Pn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ut(() => {
			e.abort(ve);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function Fn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (In(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Pn(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= te, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && Ln(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function In(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ pn(e);
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
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function zn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
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
		e.f ^= C, e.f & 1024 || (A(e, x), zt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ pn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Un = null, Wn = !1, Gn = !1;
function Kn(e) {
	Gn = e;
}
var B = null, qn = !1;
function Jn(e) {
	B = e;
}
var V = null;
function Yn(e) {
	V = e;
}
var Xn = null;
function Zn(e) {
	B !== null && (Xn ??= /* @__PURE__ */ new Set()).add(e);
}
var H = null, Qn = 0, $n = null;
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
	if (t & 2 && (e.f &= ~oe), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && Et(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && A(e, b);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Xn !== null && Xn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? A(a, x) : a.f & 1024 && A(a, S), Wt(a));
	}
}
function cr(e) {
	var t = H, n = Qn, r = $n, i = B, a = Xn, o = k, s = qn, c = rr, l = e.f;
	H = null, Qn = 0, $n = null, B = l & 96 ? null : e, Xn = null, Ge(e.ctx), qn = !1, rr = ++nr, e.ac !== null && (ut(() => {
		e.ac.abort(ve);
	}), e.ac = null);
	try {
		e.f |= se;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = e.deps, p = j?.is_fork;
		if (H !== null) {
			var m;
			if (p || ur(e, Qn), f !== null && Qn > 0) for (f.length = Qn + H.length, m = 0; m < H.length; m++) f[Qn + m] = H[m];
			else e.deps = f = H;
			if (xn() && e.f & 512) for (m = Qn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Qn < f.length && (ur(e, Qn), f.length = Qn);
		if (Je() && $n !== null && !qn && f !== null && !(e.f & 6146)) for (m = 0; m < $n.length; m++) sr($n[m], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= le), d;
	} catch (e) {
		return $e(e);
	} finally {
		e.f ^= se, H = t, Qn = n, $n = r, B = i, Xn = a, Ge(o), qn = s, rr = c;
	}
}
function lr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (H === null || !s.call(H, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~oe), c.v !== n && nt(c), c.ac !== null && ut(() => {
			c.ac.abort(ve), c.ac = null, A(c, x);
		}), Dt(c), ur(c, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		A(e, b);
		var n = V, r = Wn;
		V = e, Wn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = cr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tr;
		} finally {
			Wn = r, V = n;
		}
	}
}
async function fr() {
	await Promise.resolve(), Bt();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Un?.add(e), B !== null && !qn && !(V !== null && V.f & 16384) && (Xn === null || !Xn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < nr && (e.rv = nr, H === null && n !== null && n[Qn] === e ? Qn++ : H === null ? H = [e] : H.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Gn && Jt.has(e)) return Jt.get(e);
	if (t) {
		var i = e;
		if (Gn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || mr(i)) && (a = Tt(i)), Jt.set(i, a), a;
		}
		var o = !(i.f & 512) && !qn && B !== null && (Wn || !!(B.f & 512)), c = (i.f & ee) === 0;
		or(i) && (o && (i.f |= 512), Et(i)), o && !c && (Ot(i), pr(i));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ot(t), pr(t));
}
function mr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Jt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function W(e) {
	var t = qn;
	try {
		return qn = !0, e();
	} finally {
		qn = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ue in e) hr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ue in n && hr(n);
		}
	}
}
function hr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			hr(e[n], t);
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
var gr = Symbol("events"), _r = /* @__PURE__ */ new Set(), vr = /* @__PURE__ */ new Set();
function yr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Cr.call(t, e), !e.cancelBubble) return ut(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ze(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function br(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = yr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Sn(() => {
		t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
	(t[gr] ??= {})[e] = n;
}
function xr(e) {
	for (var t = 0; t < e.length; t++) _r.add(e[t]);
	for (var n of vr) n(e);
}
var Sr = null;
function Cr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Sr = e;
	var o = 0, s = Sr === e && e[gr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[gr] = t;
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
		Jn(null), Yn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[gr]?.[r];
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
			e[gr] = t, delete e.currentTarget, Jn(d), Yn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var wr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Tr(e) {
	return wr?.createHTML(e) ?? e;
}
function Er(e) {
	var t = gn("template");
	return t.innerHTML = Tr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Dr(e, t) {
	var n = V;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function q(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (T) return Dr(E, null), E;
		i === void 0 && (i = Er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ fn(i)));
		var t = r || sn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ fn(t), s = t.lastChild;
			Dr(o, s);
		} else Dr(t, t);
		return t;
	};
}
function Or() {
	if (T) return Dr(E, null), E;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = dn();
	return e.append(t, n), Dr(t, n), e;
}
function J(e, t) {
	if (T) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = E), Ie();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var kr = ["touchstart", "touchmove"];
function Ar(e) {
	return kr.includes(e);
}
var jr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Mr(e) {
	return jr.includes(e);
}
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ge] ??= e.nodeValue) && (e[ge] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	un();
	var u = void 0, d = En(() => {
		var s = r ?? n.appendChild(dn());
		mt(s, { pending: () => {} }, (n) => {
			Ke({});
			var r = k;
			if (o && (r.c = o), a && (i.$$events = a), T && Dr(n, null), u = e(n, i) || {}, T && (V.nodes.end = E, E === null || E.nodeType !== 8 || E.data !== "]")) throw Me(), t;
			qe();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Ar(r);
					for (let e of [n, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(_r)), vr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Pr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Cr), t.delete(e), t.size === 0 && Pr.delete(r)) : t.set(e, i);
			}
			vr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(u, d), u;
}
var Ir = /* @__PURE__ */ new WeakMap();
function Lr(e, t) {
	let n = Ir.get(e);
	return n ? (Ir.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Rr = class {
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
				r && (z(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Hn(r, t), t.append(dn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Rn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = j, r = hn();
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
		} else T && (this.anchor = E), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function X(e, t, n = !1) {
	var r;
	T && (r = E, Ie());
	var i = new Rr(e), a = n ? ne : 0;
	function o(e, t) {
		if (T) {
			var n = ze(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Re();
				D(a), i.anchor = a, Fe(!1), i.ensure(e, t), Fe(!0);
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
function zr(e, t) {
	return t;
}
function Br(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Rn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Vr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		Vr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ae, Hn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var Hr;
function Z(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = T ? D(/* @__PURE__ */ fn(u)) : u.appendChild(dn());
	}
	T && Ie();
	var d = null, f = /* @__PURE__ */ Ct(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Wr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ae, Kr(d, null, s)) : Bn(d) : Rn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = U(f);
			var e = p.length;
			let a = !1;
			T && ze(s) === "[!" != (e === 0) && (s = Re(), D(s), Fe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = j, v = hn(), y = 0; y < e; y += 1) {
				T && E.nodeType === 8 && E.data === "]" && (s = E, a = !0, Fe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && Qt(S.v, b), S.i && Qt(S.i, y), v && u.unskip_effect(S.e)) : (S = Gr(l, h ? s : Hr ??= dn(), b, x, y, i, t, n), h || (S.e.f |= ae), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Mn(() => o(s)) : (d = Mn(() => o(Hr ??= dn())), d.f |= ae)), e > c.size && xe("", "", ""), T && e > 0 && D(Re()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Fe(!0), U(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, T && (s = E);
}
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = Ur(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Bn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ae, _ === l) Kr(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (Vr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Ur(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			Br(e, w, te);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Xt(n) : /* @__PURE__ */ M(n, !1, !1) : null, l = o & 2 ? Xt(i) : null;
	return {
		v: c,
		i: l,
		e: Mn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ pn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function Jr(e, t, n, r, a, o) {
	let s = T;
	T && Ie();
	var c = null;
	T && E.nodeType === 1 && (c = E, Ie());
	var l = T ? E : e, u = new Rr(l, !1);
	jn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = T ? c : gn(e, o), Dr(c, c), r) {
					var n = null;
					T && Mr(e) && c.append(n = document.createComment(""));
					var i = T ? /* @__PURE__ */ fn(c) : c.appendChild(dn());
					T && (i === null ? Fe(!1) : D(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			T && D(t);
		}), () => {};
	}, ne), Sn(() => {}), s && (Fe(!0), D(l));
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Yr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Yr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function Xr() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Yr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Zr(e) {
	return typeof e == "object" ? Xr(e) : e ?? "";
}
var Qr = [..." 	\n\r\f\xA0\v﻿"];
function $r(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Qr.includes(r[o - 1])) && (s === r.length || Qr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function ei(e, t, n, r, i, a) {
	var o = e[me];
	if (T || o !== n || o === void 0) {
		var s = $r(n, r, a);
		(!T || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[me] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ti(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Ne();
		for (var r of e.options) r.selected = t.includes(ii(r));
		return;
	}
	for (r of e.options) if (an(ii(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ni(e) {
	var t = new MutationObserver(() => {
		"__value" in e && ti(e, e.__value);
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
function ri(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	dt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ii);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ii(o);
		}
		n(a), e.__value = a, j !== null && r.add(j);
	}), Dn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = j;
			if (r.has(o)) return;
		}
		if (ti(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ii(s), n(a));
		}
		e.__value = a, i = !1;
	}), ni(e);
}
function ii(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ai = Symbol("is custom element"), oi = Symbol("is html"), si = ye ? "link" : "LINK", ci = ye ? "progress" : "PROGRESS";
function li(e) {
	if (T) {
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
		e[_e] = n, Ze(n), lt();
	}
}
function ui(e, t) {
	var n = di(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ci) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = di(e);
	T && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === si) || i[t] !== (i[t] = n) && (t === "loading" && (e[fe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && pi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function di(e) {
	return e[pe] ??= {
		[ai]: e.nodeName.includes("-"),
		[oi]: e.namespaceURI === r
	};
}
var fi = /* @__PURE__ */ new Map();
function pi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = fi.get(t);
	if (n) return n;
	fi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function mi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	dt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = gi(e) ? _i(a) : a, n(a), j !== null && r.add(j), await fr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (T && e.defaultValue !== e.value || W(t) == null && e.value) && (n(gi(e) ? _i(e.value) : e.value), j !== null && r.add(j)), An(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = j;
			if (r.has(i)) return;
		}
		gi(e) && n === _i(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function hi(e, t, n = t) {
	dt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (T && e.defaultChecked !== e.checked || W(t) == null) && n(e.checked), An(() => {
		e.checked = !!t();
	});
}
function gi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function _i(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function vi(e, t) {
	return e === t || e?.[ue] === t;
}
function yi(e = {}, t, n, r) {
	var i = k.r, a = V;
	return Dn(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], W(() => {
				vi(n(...s), e) || (t(e, ...s), o && vi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && vi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function bi(e = !1) {
	let t = k, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ bt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Tn(() => {
		xi(t, r), v(n.b);
	}), Cn(() => {
		let e = W(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Cn(() => {
		xi(t, r), v(n.a);
	});
}
function xi(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Ue || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ bt(r), U(l)) : (c && (c = !1, s = o ? W(r) : r), s);
	let f;
	if (a) {
		var p = ue in e || de in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ot(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ee(t), f(m)));
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
	var v = !1, y = (n & 1 ? bt : Ct)(() => (v = !1, g()));
	a && U(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? nn(e) : e;
			return N(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Gn && v || b.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), We();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Si = /* @__PURE__ */ q("<button type=\"button\">＋</button>"), Ci = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), wi = /* @__PURE__ */ q("<option> </option>"), Ti = /* @__PURE__ */ q("<span class=\"task-add-contract\"> </span>"), Ei = /* @__PURE__ */ q("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Di = /* @__PURE__ */ q("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Oi = /* @__PURE__ */ q("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function ki(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = /* @__PURE__ */ M(), s = /* @__PURE__ */ M(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ M(""), ee = /* @__PURE__ */ M(""), te = /* @__PURE__ */ M(u()?.creationDefaultValue ?? 2), ne = /* @__PURE__ */ M();
	async function re() {
		await fr(), U(ne)?.focus?.();
	}
	function ie(e) {
		e.preventDefault(), C()({
			title: U(w),
			summary: U(ee),
			priority: u().normalize(U(te), u().creationDefaultValue)
		});
	}
	function ae(e) {
		e.key === "Escape" && (e.preventDefault(), S()());
	}
	L(() => G(c()), () => {
		N(n, c() === "task");
	}), L(() => (G(d()), U(n)), () => {
		N(r, d() || (U(n) ? "增加工作項目" : "增加待處理子任務"));
	}), L(() => (G(f()), U(n)), () => {
		N(i, f() || (U(n) ? "任務名稱" : "子任務描述"));
	}), L(() => (G(p()), U(n)), () => {
		N(a, p() || (U(n) ? "新任務名稱" : "新子任務描述"));
	}), L(() => (G(g()), U(n)), () => {
		N(o, g() || (U(n) ? "新任務優先級" : "新子任務優先級"));
	}), L(() => (G(v()), U(n)), () => {
		N(s, v() || (U(n) ? "加入任務" : "新增"));
	}), L(() => G(l()), () => {
		l() && re();
	}), On(), bi();
	var oe = Or(), se = F(oe), ce = (e) => {
		var t = Si();
		R(() => {
			ei(t, 1, Zr(U(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", U(r));
		}), K("click", t, function(...e) {
			x()?.apply(this, e);
		}), J(e, t);
	}, le = (e) => {
		var t = Oi(), r = P(t);
		li(r), yi(r, (e) => N(ne, e), () => U(ne));
		var c = I(r, 2), l = (e) => {
			var t = Ci();
			st(t), R(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), mi(t, () => U(ee), (e) => N(ee, e)), J(e, t);
		};
		X(c, (e) => {
			U(n) && e(l);
		});
		var d = I(c, 2);
		Z(d, 5, () => (G(u()), W(() => u().levels)), (e) => e.value, (e, t) => {
			var n = wi(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(u()), U(t), W(() => u().format(U(t).value)))]), J(e, n);
		}), O(d);
		var f = I(d, 2), p = (e) => {
			var t = Ti(), n = P(t, !0);
			O(t), R(() => Y(n, _())), J(e, t);
		};
		X(f, (e) => {
			U(n) && _() && e(p);
		});
		var g = I(f, 2), v = (e) => {
			var t = Ei(), n = F(t), r = P(n, !0);
			O(n);
			var i = I(n, 2), a = P(i), o = P(a, !0);
			O(a);
			var c = I(a, 2), l = P(c, !0);
			O(c), O(i), R(() => {
				Q(n, "hidden", !b()), Y(r, b()), Y(o, y()), Y(l, U(s));
			}), K("click", a, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		}, x = (e) => {
			var t = Di(), n = F(t), r = P(n, !0);
			O(n);
			var i = I(n, 2), a = P(i, !0);
			O(i);
			var o = I(i, 2), c = P(o, !0);
			O(o), R(() => {
				Y(r, y()), Y(a, U(s)), Q(o, "hidden", !b()), Y(c, b());
			}), K("click", n, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		};
		X(g, (e) => {
			U(n) ? e(v) : e(x, -1);
		}), O(t), R(() => {
			ei(t, 1, Zr(U(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", U(n) ? 160 : 300), Q(r, "placeholder", U(i)), Q(r, "aria-label", U(a)), Q(d, "aria-label", U(o));
		}), br("submit", t, ie), K("keydown", t, ae), mi(r, () => U(w), (e) => N(w, e)), ri(d, () => U(te), (e) => N(te, e)), J(e, t);
	};
	X(se, (e) => {
		l() ? e(le, -1) : e(ce);
	}), J(e, oe), qe();
}
xr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Ai = /* @__PURE__ */ q("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function ji(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	L(() => G(a()), () => {
		N(n, a() === "edit");
	}), L(() => U(n), () => {
		N(r, U(n) ? "編輯模式" : "預覽模式");
	}), L(() => U(n), () => {
		N(i, U(n) ? "預覽模式" : "編輯模式");
	}), On(), bi();
	var d = Ai(), f = P(d, !0);
	O(d), R(() => {
		Q(d, "aria-pressed", U(n)), Q(d, "aria-label", `目前為${U(r)}；按下切換到${U(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), Y(f, U(r));
	}), K("click", d, () => u()(U(n) ? "preview" : "edit")), J(e, d), qe();
}
xr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Mi = /* @__PURE__ */ q("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <progress class=\"project-progress-meter\" id=\"project-progress-meter\" max=\"100\"></progress>", 1);
function Ni(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "timeProgressPercent", 8, null);
	L(() => (G(o()), G(r()), G(i()), G(a())), () => {
		N(n, o() === null ? `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位` : `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；時間已使用 ${o()}%`);
	}), On();
	var s = Mi(), c = F(s), l = P(c), u = P(l);
	O(l), O(c);
	var d = I(c, 2);
	R(() => {
		Y(u, `整體約 ${r() ?? ""}%`), ui(d, r()), Q(d, "aria-label", U(n));
	}), J(e, s), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Pi = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1);
function Fi(e, t) {
	let n = $(t, "dirty", 8, !1), r = $(t, "saving", 8, !1), i = $(t, "canUndo", 8, !1), a = $(t, "canRedo", 8, !1), o = $(t, "message", 8, ""), s = $(t, "buttonLabel", 8, "儲存"), c = $(t, "savingLabel", 8, "正在儲存…"), l = $(t, "undoLabel", 8, "復原"), u = $(t, "redoLabel", 8, "重做"), d = $(t, "onSave", 8, () => {}), f = $(t, "onUndo", 8, () => {}), p = $(t, "onRedo", 8, () => {});
	var m = Pi(), h = F(m), g = P(h, !0);
	O(h);
	var _ = I(h, 2), v = P(_), y = P(v, !0);
	O(v);
	var b = I(v, 2), x = P(b, !0);
	O(b), O(_);
	var S = I(_, 2), C = P(S, !0);
	O(S), R(() => {
		Y(g, o()), Q(v, "aria-label", `${l()}上一個修改`), v.disabled = !i() || r(), Y(y, l()), Q(b, "aria-label", `${u()}下一個修改`), b.disabled = !a() || r(), Y(x, u()), S.disabled = !n() || r(), Y(C, r() ? c() : s());
	}), K("click", v, function(...e) {
		f()?.apply(this, e);
	}), K("click", b, function(...e) {
		p()?.apply(this, e);
	}), K("click", S, function(...e) {
		d()?.apply(this, e);
	}), J(e, m);
}
xr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusFilters.svelte
var Ii = /* @__PURE__ */ q("<button type=\"button\"> </button>");
function Li(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = $(t, "activeFilter", 8, "all"), o = $(t, "statusLabels", 24, () => ({})), s = $(t, "onFilterChange", 8, () => {}), c = $(t, "onReorder", 8, () => {}), l = /* @__PURE__ */ M(null), u = /* @__PURE__ */ M(null), d = !1, f = null, p = /* @__PURE__ */ M(null), m = /* @__PURE__ */ M();
	async function h() {
		let e = U(p);
		N(p, null), await fr(), U(m)?.parentElement?.querySelector(`[data-filter="${e}"]`)?.focus();
	}
	function g() {
		N(l, null), N(u, null);
	}
	function _(e, t) {
		return t?.status === e ? t.placeAfter ? "status-drop-after" : "status-drop-before" : "";
	}
	function v(e, t) {
		let n = e.getBoundingClientRect();
		return t >= n.left + n.width / 2;
	}
	function y(e, t, n, r = null) {
		N(p, r), c()(e, t, n);
	}
	function b(e, t) {
		let r = U(n).filter((e) => e !== "all"), i = r.indexOf(e), a = i + t;
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
		N(l, e), d = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e);
	}
	function w(e, t) {
		!U(l) || e === U(l) || (t.preventDefault(), t.dataTransfer.dropEffect = "move", N(u, {
			status: e,
			placeAfter: v(t.currentTarget, t.clientX)
		}));
	}
	function ee(e, t) {
		t.currentTarget.contains(t.relatedTarget) || U(u)?.status === e && N(u, null);
	}
	function te(e, t) {
		if (!U(l)) return;
		t.preventDefault();
		let n = U(l), r = v(t.currentTarget, t.clientX);
		g(), y(n, e, r);
	}
	function ne() {
		g(), setTimeout(() => {
			d = !1;
		}, 0);
	}
	function re(e, t) {
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
	function ie(e, t) {
		if (!f || f.pointerId !== t.pointerId) return;
		let n = t.clientX - f.startX, r = t.clientY - f.startY;
		if (!f.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			f.active = !0, d = !0, N(l, e);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.(".filter-button.status-sortable") ?? null, a = i?.dataset.filter ?? null;
		if (!a || a === e) {
			f.targetStatus = null, N(u, null);
			return;
		}
		f.targetStatus = a, f.placeAfter = v(i, t.clientX), N(u, {
			status: a,
			placeAfter: f.placeAfter
		});
	}
	function ae(e) {
		if (!f || f.pointerId !== e.pointerId) return;
		let t = f;
		f = null, e.currentTarget.releasePointerCapture?.(e.pointerId), g(), t.active && t.targetStatus && y(t.status, t.targetStatus, t.placeAfter), setTimeout(() => {
			d = !1;
		}, 0);
	}
	L(() => (G(i()), G(r())), () => {
		N(n, ["all", ...i()].filter((e) => e === "all" || (r()[e] ?? 0) > 0));
	}), L(() => (G(i()), U(p)), () => {
		i() && U(p) && h();
	}), On(), bi();
	var oe = Or();
	Z(F(oe), 1, () => U(n), (e) => e, (e, t) => {
		let i = /* @__PURE__ */ Ct(() => (U(t), G(o()), W(() => U(t) === "all" ? "全部" : o()[U(t)] ?? U(t)))), s = /* @__PURE__ */ Ct(() => (G(r()), U(t), W(() => r()[U(t)] ?? 0))), c = /* @__PURE__ */ Ct(() => U(t) !== "all");
		var d = Ii(), f = P(d);
		O(d), yi(d, (e) => N(m, e), () => U(m)), R((e, n) => {
			ei(d, 1, `filter-button ${U(c) ? "status-sortable" : ""} ${U(l) === U(t) ? "status-dragging" : ""} ${e ?? ""}`), Q(d, "data-filter", U(t)), Q(d, "aria-pressed", U(t) === a()), Q(d, "draggable", U(c)), Q(d, "title", U(c) ? U(t) === "planned" ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序" : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動" : null), Q(d, "aria-keyshortcuts", U(c) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(d, "aria-label", n), Y(f, `${U(i) ?? ""} ${U(s) ?? ""}`);
		}, [() => (U(t), U(u), W(() => _(U(t), U(u)))), () => (G(U(c)), G(U(i)), G(U(s)), U(n), U(t), W(() => U(c) ? `${U(i)} ${U(s)}，排序第 ${U(n).indexOf(U(t))}；可拖曳調整` : null))]), K("click", d, (e) => x(U(t), e)), K("keydown", d, function(...e) {
			(U(c) ? (e) => S(U(t), e) : null)?.apply(this, e);
		}), br("dragstart", d, function(...e) {
			(U(c) ? (e) => C(U(t), e) : null)?.apply(this, e);
		}), br("dragover", d, function(...e) {
			(U(c) ? (e) => w(U(t), e) : null)?.apply(this, e);
		}), br("dragleave", d, function(...e) {
			(U(c) ? (e) => ee(U(t), e) : null)?.apply(this, e);
		}), br("drop", d, function(...e) {
			(U(c) ? (e) => te(U(t), e) : null)?.apply(this, e);
		}), br("dragend", d, function(...e) {
			(U(c) ? ne : null)?.apply(this, e);
		}), K("pointerdown", d, function(...e) {
			(U(c) ? (e) => re(U(t), e) : null)?.apply(this, e);
		}), K("pointermove", d, function(...e) {
			(U(c) ? (e) => ie(U(t), e) : null)?.apply(this, e);
		}), K("pointerup", d, function(...e) {
			(U(c) ? ae : null)?.apply(this, e);
		}), br("pointercancel", d, function(...e) {
			(U(c) ? ae : null)?.apply(this, e);
		}), J(e, d);
	}), J(e, oe), qe();
}
xr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var Ri = /* @__PURE__ */ q("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function zi(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = {
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
	L(() => (G(i()), G(r())), () => {
		N(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), On(), bi();
	var o = Or();
	Z(F(o), 1, () => U(n), (e) => e.status, (e, t) => {
		var n = Ri(), r = P(n), i = P(r, !0);
		O(r);
		var a = I(r, 2), o = P(a, !0);
		O(a), O(n), R(() => {
			ei(n, 1, (U(t), W(() => `overview-card overview-${U(t).tone}`))), Q(n, "data-status", (U(t), W(() => U(t).status))), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), J(e, o), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var Bi = /* @__PURE__ */ q("<span class=\"developer-expand-hint\">展開作法與方向</span>"), Vi = /* @__PURE__ */ q("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), Hi = /* @__PURE__ */ q("<li> </li>"), Ui = /* @__PURE__ */ q("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), Wi = /* @__PURE__ */ q("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), Gi = /* @__PURE__ */ q("<code class=\"reference\"> </code>"), Ki = /* @__PURE__ */ q("<article class=\"decision-item\"><p> </p> <!></article>"), qi = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Ji = /* @__PURE__ */ q("<p> </p>"), Yi = /* @__PURE__ */ q("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), Xi = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Zi = /* @__PURE__ */ q("<div class=\"path-list\"></div>"), Qi = /* @__PURE__ */ q("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), $i = /* @__PURE__ */ q("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), ea = /* @__PURE__ */ q("<!> <!>", 1);
function ta(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = $(t, "developer", 8, null);
	L(() => G(o()), () => {
		N(n, o()?.next_steps ?? []);
	}), L(() => (G(o()), U(n)), () => {
		N(r, o()?.next_step ?? U(n)[0] ?? "尚未指定下一步");
	}), L(() => (G(o()), U(n)), () => {
		N(i, o()?.next_step ? U(n) : U(n).slice(1));
	}), L(() => (U(i), G(o())), () => {
		N(a, !!(U(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), On(), bi();
	var s = Or(), c = F(s), l = (e) => {
		var t = Or();
		Jr(F(t), () => U(a) ? "details" : "section", !1, (e, t) => {
			ei(e, 0, "developer-details");
			var n = ea(), s = F(n);
			Jr(s, () => U(a) ? "summary" : "div", !1, (e, t) => {
				ei(e, 0, "developer-summary");
				var n = Vi(), i = I(F(n), 2), o = P(i, !0);
				O(i);
				var s = I(i, 2), c = (e) => {
					J(e, Bi());
				};
				X(s, (e) => {
					U(a) && e(c);
				}), R(() => Y(o, U(r))), J(t, n);
			});
			var c = I(s, 2), l = (e) => {
				var t = $i(), n = I(P(t), 2), r = (e) => {
					var t = Ui(), n = I(P(t), 2);
					Z(n, 5, () => U(i), zr, (e, t) => {
						var n = Hi(), r = P(n, !0);
						O(n), R(() => Y(r, U(t))), J(e, n);
					}), O(n), O(t), J(e, t);
				};
				X(n, (e) => {
					U(i), W(() => U(i).length) && e(r);
				});
				var a = I(n, 2), s = (e) => {
					var t = Wi(), n = I(P(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().blockers)), zr, (e, t) => {
						var n = Hi(), r = P(n, !0);
						O(n), R(() => Y(r, U(t))), J(e, n);
					}), O(n), O(t), J(e, t);
				};
				X(a, (e) => {
					G(o()), W(() => o().blockers?.length) && e(s);
				});
				var c = I(a, 2), l = (e) => {
					var t = qi(), n = I(P(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().decisions)), zr, (e, t) => {
						var n = Ki(), r = P(n), i = P(r, !0);
						O(r);
						var a = I(r, 2), o = (e) => {
							var n = Gi(), r = P(n, !0);
							O(n), R(() => Y(r, (U(t), W(() => U(t).reference)))), J(e, n);
						};
						X(a, (e) => {
							U(t), W(() => U(t).reference) && e(o);
						}), O(n), R(() => Y(i, (U(t), W(() => U(t).summary)))), J(e, n);
					}), O(n), O(t), J(e, t);
				};
				X(c, (e) => {
					G(o()), W(() => o().decisions?.length) && e(l);
				});
				var u = I(c, 2), d = (e) => {
					var t = Xi(), n = I(P(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().routes)), zr, (e, t) => {
						var n = Yi(), r = P(n), i = P(r), a = P(i, !0);
						O(i);
						var o = I(i, 2), s = P(o, !0);
						O(o), O(r);
						var c = I(r, 2), l = (e) => {
							var n = Ji(), r = P(n, !0);
							O(n), R(() => Y(r, (U(t), W(() => U(t).reason)))), J(e, n);
						};
						X(c, (e) => {
							U(t), W(() => U(t).reason) && e(l);
						}), O(n), R(() => {
							Y(a, (U(t), W(() => U(t).title))), ei(o, 1, (U(t), W(() => `route-state route-${U(t).state}`))), Y(s, (U(t), W(() => U(t).state)));
						}), J(e, n);
					}), O(n), O(t), J(e, t);
				};
				X(u, (e) => {
					G(o()), W(() => o().routes?.length) && e(d);
				});
				var f = I(u, 2), p = (e) => {
					var t = Qi(), n = I(P(t), 2), r = P(n);
					O(n);
					var i = I(n, 2), a = (e) => {
						var t = Ji(), n = P(t);
						O(t), R(() => Y(n, `Worktree: ${G(o()), W(() => o().claim.worktree) ?? ""}`)), J(e, t);
					};
					X(i, (e) => {
						G(o()), W(() => o().claim.worktree) && e(a);
					});
					var s = I(i, 2), c = (e) => {
						var t = Zi();
						Z(t, 5, () => (G(o()), W(() => o().claim.source_paths)), zr, (e, t) => {
							var n = Gi(), r = P(n, !0);
							O(n), R(() => Y(r, U(t))), J(e, n);
						}), O(t), J(e, t);
					};
					X(s, (e) => {
						G(o()), W(() => o().claim.source_paths?.length) && e(c);
					}), O(t), R(() => Y(r, `Agent: ${G(o()), W(() => o().claim.agent) ?? ""}`)), J(e, t);
				};
				X(f, (e) => {
					G(o()), W(() => o().claim) && e(p);
				}), O(t), J(e, t);
			};
			X(c, (e) => {
				U(a) && e(l);
			}), J(t, n);
		}), J(e, t);
	};
	X(c, (e) => {
		o() && e(l);
	}), J(e, s), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var na = /* @__PURE__ */ q("<option> </option>"), ra = /* @__PURE__ */ q("<button class=\"time-item-button\" type=\"button\"> </button>"), ia = /* @__PURE__ */ q("<span class=\"time-item-button\"> </span>"), aa = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), oa = /* @__PURE__ */ q("<details class=\"spike-estimate-editor\"><summary><span>人工工時與依據</span> <small> </small></summary> <div class=\"spike-estimate-fields\"><label><span>工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <button type=\"button\">套用工時草稿</button> <!></div></details>"), sa = /* @__PURE__ */ q("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button> <!>", 1), ca = /* @__PURE__ */ q("<span> </span>"), la = /* @__PURE__ */ q("<span class=\"spike-item-title\"> </span> <!> <!>", 1), ua = /* @__PURE__ */ q("<li><!></li>");
function da(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "onTimeClick", 8, null), h = /* @__PURE__ */ M(f() ? String(f().likely_minutes / 60) : d() ? String(d().likely_minutes / 60) : ""), g = /* @__PURE__ */ M(f()?.human_note ?? ""), _ = /* @__PURE__ */ M(!!f()?.human_confirmed), v = /* @__PURE__ */ M("");
	function y() {
		let e = Number(U(h));
		if (!Number.isFinite(e) || e <= 0) {
			N(v, "工時必須大於 0。");
			return;
		}
		let t = p()?.({
			taskId: a(),
			itemId: s().id,
			likelyMinutes: Math.round(e * 60),
			humanNote: U(g),
			humanConfirmed: U(_)
		});
		N(v, t?.error ?? "");
	}
	L(() => (G(l()), G(s())), () => {
		N(n, l().metadata(s().priority));
	}), L(() => (G(l()), G(s())), () => {
		N(r, l().format(s().priority));
	}), L(() => G(d()), () => {
		N(i, d() ? d().label ?? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), On(), bi();
	var b = ua();
	let x;
	var S = P(b), C = (e) => {
		var t = sa(), n = F(t);
		li(n);
		var r = I(n, 2);
		Z(r, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
			var n = na(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
		}), O(r);
		var c;
		ni(r);
		var f = I(r, 2), b = (e) => {
			var t = ra(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "aria-label", (G(s()), U(i), W(() => `${s().title}，${U(i)}，查看估算依據`))), Y(n, U(i));
			}), K("click", t, () => m()(s().id, s().title)), J(e, t);
		}, x = (e) => {
			var t = ia(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "title", (G(d()), W(() => `目前分析：${d().likely_minutes} 分鐘`))), Y(n, U(i));
			}), J(e, t);
		};
		X(f, (e) => {
			d() && m() ? e(b) : d() && e(x, 1);
		});
		var S = I(f, 2), C = I(S, 2), w = (e) => {
			var t = oa(), n = P(t), r = I(P(n), 2), i = P(r, !0);
			O(r), O(n);
			var a = I(n, 2), o = P(a), c = I(P(o), 2);
			li(c), O(o);
			var l = I(o, 2), u = I(P(l), 2);
			li(u), O(l);
			var d = I(l, 2), f = P(d);
			li(f), Le(2), O(d);
			var p = I(d, 4), m = I(p, 2), b = (e) => {
				var t = aa(), n = P(t, !0);
				O(t), R(() => Y(n, U(v))), J(e, t);
			};
			X(m, (e) => {
				U(v) && e(b);
			}), O(a), O(t), R(() => {
				Y(i, U(_) ? "已確認" : "未確認"), Q(c, "aria-label", (G(s()), W(() => `「${s().title}」人工工時（hr）`))), Q(u, "aria-label", (G(s()), W(() => `「${s().title}」人工依據`))), Q(f, "aria-label", (G(s()), W(() => `確認「${s().title}」的人工估算`))), Q(p, "aria-label", (G(s()), W(() => `套用「${s().title}」人工估算草稿`)));
			}), mi(c, () => U(h), (e) => N(h, e)), mi(u, () => U(g), (e) => N(g, e)), hi(f, () => U(_), (e) => N(_, e)), K("click", p, y), J(e, t);
		};
		X(C, (e) => {
			p() && e(w);
		}), R(() => {
			Q(n, "aria-label", (G(s()), W(() => `編輯子項目：${s().title}`))), ui(n, (G(s()), W(() => s().title))), Q(r, "aria-label", (G(s()), W(() => `設定「${s().title}」的優先級`))), c !== (c = (G(s()), W(() => s().priority))) && (r.value = (r.__value = (G(s()), W(() => s().priority))) ?? "", ti(r, (G(s()), W(() => s().priority)))), Q(S, "aria-label", (G(s()), W(() => `刪除子項目：${s().title}`)));
		}), K("input", n, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "title",
			value: e.currentTarget.value
		})), K("change", r, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "priority",
			value: Number(e.currentTarget.value)
		})), K("click", S, () => u()({
			type: "delete-item",
			taskId: a(),
			field: o(),
			itemId: s().id
		})), J(e, t);
	}, w = (e) => {
		var t = la(), a = F(t), o = P(a, !0);
		O(a);
		var c = I(a, 2), u = (e) => {
			var t = ca(), i = P(t, !0);
			O(t), R(() => {
				ei(t, 1, (U(n), W(() => `priority-badge priority-${U(n).tone}`))), Y(i, U(r));
			}), J(e, t);
		};
		X(c, (e) => {
			U(n), G(l()), W(() => U(n) && (!U(n).hidden || !l().labelsValid)) && e(u);
		});
		var f = I(c, 2), p = (e) => {
			var t = ra(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "aria-label", (G(s()), U(i), W(() => `${s().title}，${U(i)}，查看估算依據`))), Y(n, U(i));
			}), K("click", t, () => m()(s().id, s().title)), J(e, t);
		}, h = (e) => {
			var t = ia(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "title", (G(d()), W(() => `目前分析：${d().likely_minutes} 分鐘`))), Y(n, U(i));
			}), J(e, t);
		};
		X(f, (e) => {
			d() && m() ? e(p) : d() && e(h, 1);
		}), R(() => Y(o, (G(s()), W(() => s().title)))), J(e, t);
	};
	X(S, (e) => {
		c() ? e(C) : e(w, -1);
	}), O(b), R(() => x = ei(b, 1, "editor-item-row", null, x, {
		"editable-work-item": c(),
		"has-estimate-editor": c() && p()
	})), J(e, b), qe();
}
xr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var fa = /* @__PURE__ */ q("<option> </option>"), pa = /* @__PURE__ */ q("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), ma = /* @__PURE__ */ q("<span> </span>"), ha = /* @__PURE__ */ q("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), ga = /* @__PURE__ */ q("<h3> </h3>"), _a = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), va = /* @__PURE__ */ q("<p class=\"task-summary\"> </p>"), ya = /* @__PURE__ */ q("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), ba = /* @__PURE__ */ q("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), xa = /* @__PURE__ */ q("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Sa = /* @__PURE__ */ q("<div class=\"spike-add-shell\"><!></div>"), Ca = /* @__PURE__ */ q("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function wa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
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
	], y = /* @__PURE__ */ M(!1), b = /* @__PURE__ */ M(""), x = /* @__PURE__ */ M(l().creationDefaultValue), S = /* @__PURE__ */ M("");
	function C() {
		N(y, !1), N(b, ""), N(x, l().creationDefaultValue), N(S, "");
	}
	function w() {
		let e = d()(U(b), Number(U(x)));
		N(S, e.error), U(S) || C();
	}
	L(() => G(o()), () => {
		N(n, [{
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
	}), L(() => (U(n), G(g())), () => {
		N(r, [...U(n)].sort((e, t) => {
			let n = g().indexOf(e.status), r = g().indexOf(t.status);
			return (n < 0 ? g().length : n) - (r < 0 ? g().length : r);
		}));
	}), L(() => (G(l()), G(o())), () => {
		N(i, l().metadata(o().priority));
	}), L(() => G(o()), () => {
		N(a, v.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), L(() => (G(c()), U(y)), () => {
		!c() && U(y) && C();
	}), On(), bi();
	var ee = Ca(), te = P(ee), ne = P(te), re = P(ne), ie = P(re), ae = P(ie, !0);
	O(ie);
	var oe = I(ie, 2), se = (e) => {
		var t = pa(), n = F(t);
		Z(n, 5, () => v, (e) => e.value, (e, t) => {
			var n = fa(), r = P(n, !0);
			O(n);
			var i = {};
			R(() => {
				Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}), J(e, n);
		}), O(n);
		var r;
		ni(n);
		var i = I(n, 2);
		Z(i, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
			var n = fa(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
		}), O(i);
		var a;
		ni(i), R(() => {
			Q(n, "aria-label", (G(o()), W(() => `${o().title} 狀態`))), r !== (r = (G(o()), W(() => o().status))) && (n.value = (n.__value = (G(o()), W(() => o().status))) ?? "", ti(n, (G(o()), W(() => o().status)))), Q(i, "aria-label", (G(o()), W(() => `${o().title} 優先級`))), a !== (a = (G(o()), W(() => o().priority))) && (i.value = (i.__value = (G(o()), W(() => o().priority))) ?? "", ti(i, (G(o()), W(() => o().priority))));
		}), K("change", n, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: e.currentTarget.value
		})), K("change", i, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(e.currentTarget.value)
		})), J(e, t);
	}, ce = (e) => {
		var t = ma(), n = P(t, !0);
		O(t), R((e, r, a) => {
			ei(t, 1, (U(i), W(() => `task-priority-badge priority-badge priority-${U(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), Y(n, a);
		}, [
			() => (G(l()), G(o()), W(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (G(l()), G(o()), W(() => `優先級：${l().format(o().priority)}`)),
			() => (G(l()), G(o()), W(() => l().format(o().priority)))
		]), J(e, t);
	};
	X(oe, (e) => {
		c() ? e(se) : (U(i), G(l()), W(() => U(i) && (!U(i).hidden || !l().labelsValid)) && e(ce, 1));
	}), O(re);
	var le = I(re, 2), ue = P(le), de = (e) => {
		var t = ha();
		li(t), R(() => {
			Q(t, "id", (G(o()), W(() => `task-${o().id}-title`))), ui(t, (G(o()), W(() => o().title)));
		}), K("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), J(e, t);
	}, fe = (e) => {
		var t = ga(), n = P(t, !0);
		O(t), R(() => {
			Q(t, "id", (G(o()), W(() => `task-${o().id}-title`))), Y(n, (G(o()), W(() => o().title)));
		}), J(e, t);
	};
	X(ue, (e) => {
		c() ? e(de) : e(fe, -1);
	});
	var pe = I(ue, 2), me = P(pe, !0);
	O(pe), O(le), O(ne);
	var he = I(ne, 2), ge = P(he), _e = P(ge);
	O(ge);
	var ve = I(ge, 2), ye = P(ve, !0);
	O(ve), O(he), O(te);
	var be = I(te, 2), xe = (e) => {
		var t = _a();
		st(t), R(() => ui(t, (G(o()), W(() => o().summary)))), K("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), J(e, t);
	}, Se = (e) => {
		var t = va(), n = P(t, !0);
		O(t), R(() => Y(n, (G(o()), W(() => o().summary)))), J(e, t);
	};
	X(be, (e) => {
		c() ? e(xe) : e(Se, -1);
	});
	var Ce = I(be, 2);
	{
		let e = /* @__PURE__ */ Ct(() => (G(o()), W(() => o().developer ?? null)));
		ta(Ce, { get developer() {
			return U(e);
		} });
	}
	var we = I(Ce, 2), Te = P(we);
	Z(Te, 1, () => U(r), (e) => e.status, (e, t) => {
		var n = Or(), r = F(n), i = (e) => {
			var n = ya(), r = P(n), i = P(r, !0);
			O(r);
			var a = I(r, 2);
			Z(a, 5, () => (U(t), W(() => U(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ Ct(() => (G(f()), U(n), W(() => f().get(U(n).id) ?? null))), i = /* @__PURE__ */ Ct(() => (G(p()), U(n), W(() => p().get(U(n).id) ?? null)));
					da(e, {
						get taskId() {
							return G(o()), W(() => o().id);
						},
						get field() {
							return U(t), W(() => U(t).field);
						},
						get item() {
							return U(n);
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
							return U(r);
						},
						get activeEstimate() {
							return U(i);
						},
						get onManualEstimate() {
							return m();
						},
						get onTimeClick() {
							return h();
						}
					});
				}
			}), O(a), O(n), R(() => {
				ei(n, 1, (U(t), W(() => `detail-section ${U(t).className}`))), Y(i, (U(t), W(() => U(t).title)));
			}), J(e, n);
		};
		X(r, (e) => {
			U(t), G(c()), W(() => U(t).items.length || c()) && e(i);
		}), J(e, n);
	});
	var Ee = I(Te, 2), De = P(Ee), Oe = (e) => {
		var t = Sa(), n = P(t), r = (e) => {
			var t = ba(), n = P(t);
			li(n);
			var r = I(n, 2);
			Z(r, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
				var n = fa(), r = P(n, !0);
				O(n);
				var i = {};
				R((e) => {
					Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
				}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
			}), O(r);
			var i = I(r, 2), a = I(i, 2), o = I(a, 2), s = P(o, !0);
			O(o), O(t), R(() => {
				Q(o, "hidden", !U(S)), Y(s, U(S));
			}), K("keydown", n, (e) => {
				e.key === "Enter" && w(), e.key === "Escape" && C();
			}), mi(n, () => U(b), (e) => N(b, e)), ri(r, () => U(x), (e) => N(x, e)), K("click", i, w), K("click", a, C), J(e, t);
		}, i = (e) => {
			var t = xa();
			R(() => Q(t, "aria-label", (G(o()), W(() => `在「${o().title}」新增子項目`)))), K("click", t, () => {
				N(y, !0);
			}), J(e, t);
		};
		X(n, (e) => {
			U(y) ? e(r) : e(i, -1);
		}), O(t), J(e, t);
	};
	X(De, (e) => {
		c() && e(Oe);
	}), O(Ee), O(we), O(ee), R(() => {
		ei(ee, 1, (U(a), W(() => `task-card editor-task-card status-${U(a).tone}`))), Q(ee, "aria-labelledby", (G(o()), W(() => `task-${o().id}-title`))), ei(ie, 1, (U(a), W(() => `status-badge status-${U(a).tone}`))), Y(ae, (U(a), W(() => U(a).label))), Q(pe, "hidden", !_()), Y(me, _() ? `約需 ${_()}` : ""), Q(ge, "aria-label", (G(s()), W(() => `子項目完成 ${s().completed}，共 ${s().total}`))), Y(_e, `${G(s()), W(() => s().completed) ?? ""} / ${G(s()), W(() => s().total) ?? ""}`), Y(ye, (G(o()), W(() => o().id)));
	}), J(e, ee), qe();
}
xr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var Ta = /* @__PURE__ */ q("<p class=\"empty-state\"> </p>");
function Ea(e, t) {
	Ke(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), d = $(t, "onManualEstimate", 8, null), f = $(t, "onTimeClick", 8, null), p = $(t, "durations", 24, () => ({})), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	bi();
	var g = Or(), _ = F(g), v = (e) => {
		var t = Or();
		Z(F(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ Ct(() => (G(c()), U(t), W(() => c().get(U(t).id) ?? null))), h = /* @__PURE__ */ Ct(() => (G(p()), U(t), W(() => p()[U(t).id] ?? null)));
				wa(e, {
					get task() {
						return U(t);
					},
					get progress() {
						return G(r()), U(t), W(() => r()[U(t).id]);
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
					onAddItem: (e, n) => s()(U(t).id, e, n),
					get timeTask() {
						return U(n);
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
						return U(h);
					}
				});
			}
		}), J(e, t);
	}, y = (e) => {
		var t = Ta(), n = P(t, !0);
		O(t), R(() => Y(n, h())), J(e, t);
	};
	X(_, (e) => {
		G(n()), W(() => n().length) ? e(v) : e(y, -1);
	}), J(e, g), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Da = {
	"task-list": Ea,
	"status-overview": zi,
	"status-filters": Li,
	"project-progress": Ni,
	"mode-toggle": ji,
	"save-bar": Fi,
	"add-control": ki
}, Oa = {
	id: "svelte",
	regions: Object.keys(Da),
	mount(e, t, n) {
		let r = nn({ ...n });
		return {
			component: Nr(Da[e], {
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
		Lr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(Oa);
//#endregion
