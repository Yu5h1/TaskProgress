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
function _e(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function ve() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function ye(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function be(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function xe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Se(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ce() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function we(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Te() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ee() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function De() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Oe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function ke() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ae(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function je() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Me() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var O = !1;
function Ne(e) {
	O = e;
}
var k;
function Pe(e) {
	if (e === null) throw Ae(), t;
	return k = e;
}
function Fe() {
	return Pe(/* @__PURE__ */ mn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ mn(k) !== null) throw Ae(), t;
		k = e;
	}
}
function Ie(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ mn(n);
		k = n;
	}
}
function Le(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ mn(n);
		e && n.remove(), n = i;
	}
}
function Re(e) {
	if (!e || e.nodeType !== 8) throw Ae(), t;
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
var j = null;
function We(e) {
	j = e;
}
function Ge(e, t = !1, n) {
	j = {
		p: j,
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
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Tn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function qe() {
	return !He || j !== null && j.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], v(e);
}
function Xe(e) {
	if (Je.length === 0 && !Nt) {
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
	if (t === null) return B.f |= oe, e;
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
function tt(e, t) {
	e.f = e.f & et | t;
}
function nt(e) {
	e.f & 512 || e.deps === null ? tt(e, b) : tt(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function rt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= re, rt(t.deps));
}
function it(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e.deps), tt(e, b);
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
	O && /* @__PURE__ */ pn(e) !== null && hn(e);
}
var ct = !1;
function lt() {
	ct || (ct = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ut(e) {
	var t = B, n = V;
	Xn(null), Zn(null);
	try {
		return e();
	} finally {
		Xn(t), Zn(n);
	}
}
function dt(e, t, n, r = n) {
	e.addEventListener(t, () => ut(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), lt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ft(e) {
	let t = 0, n = Xt(0), r;
	return () => {
		Sn() && (H(n), jn(() => (t === 0 && (r = U(() => e(() => tn(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, tn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var pt = E | te;
function mt(e, t, n, r) {
	new ht(e, t, n, r);
}
var ht = class {
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
	#h = ft(() => (this.#m = Xt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Mn(() => {
			if (O) {
				let e = this.#t;
				Fe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, pt), O && (this.#e = k);
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
		Xe(r), t && (this.#s = Nn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Me();
				return;
			}
			t = !0, n && Oe(), this.#s !== null && Bn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Nn(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = fn();
			e.append(t), this.#a = this.#S(() => Nn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
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
			} else this.#x(M);
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
		var t = V, n = B, r = j;
		Zn(this.#i), Xn(this.#i), We(this.#i.ctx);
		try {
			return zt.ensure(), e();
		} catch (e) {
			return Qe(e), null;
		} finally {
			Zn(t), Xn(n), We(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && $t(this.#m, this.#l);
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
		this.#a &&= (Ln(this.#a), null), this.#o &&= (Ln(this.#o), null), this.#s &&= (Ln(this.#s), null), O && (Pe(this.#t), Ie(), Pe(Le()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Nn(() => {
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
function gt(e, t, n, r) {
	let i = qe() ? bt : Ct;
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
				$e(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ St(e))).then(u).catch((e) => $e(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), vt();
	}) : f();
}
function _t() {
	var e = V, t = B, n = j, r = M;
	return function(i = !0) {
		Zn(e), Xn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	Zn(null), Xn(null), We(null), e && M?.deactivate();
}
function yt() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	var t = 2 | x;
	return V !== null && (V.f |= te), {
		ctx: j,
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
var xt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function St(e, t, r) {
	let i = V;
	i === null && ve();
	var a = void 0, o = Xt(n), s = !B, c = /* @__PURE__ */ new Set();
	return An(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = yt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(xt);
			else for (let e of c.values()) e.reject(xt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== xt && (r.activate(), t ? (o.f |= oe, $t(o, t)) : (o.f & 8388608 && (o.f ^= oe), $t(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Cn(() => {
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
	return t.equals = Ve, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Ln(t[n]);
	}
}
function Tt(e) {
	var t, r = V, i = e.parent;
	if (!qn && i !== null && e.v !== n && i.f & 24576) return ke(), e.v;
	Zn(i);
	try {
		e.f &= ~re, wt(e), t = dr(e);
	} finally {
		Zn(r);
	}
	return t;
}
function Et(e) {
	var t = Tt(e);
	if (!e.equals(t) && (e.wv = cr(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		tt(e, b);
		return;
	}
	qn || (jt === null ? nt(e) : (Sn() || M?.is_fork) && jt.set(e, t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ut(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = g), pr(t, 0), Fn(t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && mr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var kt = null, M = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, Rt = 1, zt = class e {
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
			for (var r of n.d) tt(r, x), t(r);
			for (r of n.m) tt(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Lt++ > 1e3 && (this.#x(), Vt());
		for (let e of this.#u) this.#d.delete(e), tt(e, x), this.schedule(e);
		for (let e of this.#d) tt(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ft = [], r = [], i = It = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Kt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ft = null, It = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Gt(e, t);
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
		this.#r.clear(), At = this, Ut(r), Ut(n), At = null, this.#s?.resolve();
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
				a ? r.f ^= b : i & 4 ? t.push(r) : lr(r) && (i & 16 && this.#d.add(r), mr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), tt(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) it(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), jt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, jt = null;
	}
	flush() {
		try {
			Pt = !0, M = this, this.#g();
		} finally {
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, M = null, jt = null, Jt.clear();
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
			!Pt && !Nt && Xe(() => {
				t.#e || t.flush();
			});
		}
		return M;
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
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (Ze(), M === null) return n;
			M.flush();
		}
	} finally {
		Nt = t;
	}
}
function Vt() {
	try {
		Ce();
	} catch (e) {
		$e(e, Mt);
	}
}
var Ht = null;
function Ut(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && lr(r) && (Ht = /* @__PURE__ */ new Set(), mr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), Ht?.size > 0)) {
				Jt.clear();
				for (let e of Ht) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ht.has(n) && (Ht.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || mr(n);
					}
				}
				Ht.clear();
			}
		}
		Ht = null;
	}
}
function Wt(e) {
	M.schedule(e);
}
function Gt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), tt(e, b);
		for (var n = e.first; n !== null;) Gt(n, t), n = n.next;
	}
}
function Kt(e) {
	tt(e, b);
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
		equals: ze,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Zt(e, t) {
	let n = Xt(e, t);
	return $n(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Xt(e);
	return t || (r.equals = Ve), He && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function Qt(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!Yn || B.f & 131072) && qe() && B.f & 4325394 && (Qn === null || !Qn.has(e)) && De(), $t(e, n ? rn(t) : t, It);
}
function $t(e, t, n = null) {
	if (!e.equals(t)) {
		Jt.set(e, qn ? t : e.v);
		var r = zt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Tt(t), jt === null && nt(t);
		}
		e.wv = cr(), nn(e, x, n), qe() && V !== null && V.f & 1024 && !(V.f & 96) && (nr === null ? rr([e]) : nr.push(e)), !r.is_fork && qt.size > 0 && !Yt && en();
	}
	return t;
}
function en() {
	Yt = !1;
	for (let e of qt) {
		e.f & 1024 && tt(e, S);
		let t;
		try {
			t = lr(e);
		} catch {
			t = !0;
		}
		t && mr(e);
	}
	qt.clear();
}
function tn(e) {
	P(e, e.v + 1);
}
function nn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && tt(s, t), c & 131072) qt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= re), nn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Ht !== null && Ht.add(d), n === null ? Wt(d) : n.push(d);
			}
		}
	}
}
function rn(e) {
	if (typeof e != "object" || !e || se in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Zt(0), s = null, c = or, l = (e) => {
		if (or === c) return e();
		var t = B, n = or;
		Xn(null), sr(c);
		var r = e();
		return Xn(t), sr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Zt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Te();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Zt(n.value, s);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Zt(n, s));
					r.set(t, e), tn(o);
				}
			} else P(i, n), tn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === se) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Zt(rn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Zt(a ? rn(e[t]) : n, s)), r.set(t, i)), H(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Zt(n, s)), r.set(p + "", m)) : P(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Zt(void 0, s)), P(d, rn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => rn(a));
				P(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				tn(o);
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
			Ee();
		}
	});
}
function an(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
	} catch {}
	return e;
}
function on(e, t) {
	return Object.is(an(e), an(t));
}
var sn, cn, ln, un;
function dn() {
	if (sn === void 0) {
		sn = window, cn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		ln = u(t, "firstChild").get, un = u(t, "nextSibling").get, h(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), h(n) && (n[pe] = void 0);
	}
}
function fn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return ln.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function mn(e) {
	return un.call(e);
}
function F(e, t) {
	if (!O) return /* @__PURE__ */ pn(e);
	var n = /* @__PURE__ */ pn(k);
	if (n === null) n = k.appendChild(fn());
	else if (t && n.nodeType !== 3) {
		var r = fn();
		return n?.before(r), Pe(r), r;
	}
	return t && vn(n), Pe(n), n;
}
function I(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ pn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ mn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = fn();
			return k?.before(r), Pe(r), r;
		}
		vn(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ mn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = fn();
			return r === null ? i?.after(a) : r.before(a), Pe(a), a;
		}
		vn(r);
	}
	return Pe(r), r;
}
function hn(e) {
	e.textContent = "";
}
function gn() {
	return !1;
}
function _n(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function vn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function yn(e) {
	V === null && (B === null && Se(e), xe()), qn && be(e);
}
function bn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function xn(e, t) {
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
	if (e & 4) Ft === null ? zt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			mr(r);
		} catch (e) {
			throw Ln(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= E));
	}
	if (i !== null && (i.parent = n, n !== null && bn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Sn() {
	return B !== null && !Yn;
}
function Cn(e) {
	let t = xn(8, null);
	return tt(t, b), t.teardown = e, t;
}
function wn(e) {
	yn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return Tn(e);
}
function Tn(e) {
	return xn(4 | ne, e);
}
function En(e) {
	return yn("$effect.pre"), xn(8 | ne, e);
}
function Dn(e) {
	zt.ensure();
	let t = xn(64 | te, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			Ln(t), n(void 0);
		}) : (Ln(t), n(void 0));
	});
}
function On(e) {
	return xn(4, e);
}
function R(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = jn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Zn(n.parent), U(t);
			} finally {
				Zn(n);
			}
		}
	});
}
function kn() {
	var e = j;
	jn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && tt(n, S), lr(n) && mr(n), t.ran = !1;
		}
	});
}
function An(e) {
	return xn(ae | te, e);
}
function jn(e, t = 0) {
	return xn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		xn(8, () => {
			e(...t.map(H));
		});
	});
}
function Mn(e, t = 0) {
	return xn(16 | t, e);
}
function Nn(e) {
	return xn(32 | te, e);
}
function Pn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = qn, n = B;
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
		e !== null && ut(() => {
			e.abort(he);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= ee, Fn(e, t && !n), pr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Pn(e), e.f ^= ee, e.f |= w;
	var i = e.parent;
	i !== null && i.first !== null && zn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ mn(e);
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
		e.f ^= C;
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
		e.f ^= C, e.f & 1024 || (tt(e, x), zt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ mn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Gn = null, Kn = !1, qn = !1;
function Jn(e) {
	qn = e;
}
var B = null, Yn = !1;
function Xn(e) {
	B = e;
}
var V = null;
function Zn(e) {
	V = e;
}
var Qn = null;
function $n(e) {
	B !== null && (Qn ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~re), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (lr(a) && Et(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && tt(e, b);
	}
	return !1;
}
function ur(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Qn !== null && Qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ur(a, t, !1) : t === a && (n ? tt(a, x) : a.f & 1024 && tt(a, S), Wt(a));
	}
}
function dr(e) {
	var t = er, n = tr, r = nr, i = B, a = Qn, o = j, s = Yn, c = or, l = e.f;
	er = null, tr = 0, nr = null, B = l & 96 ? null : e, Qn = null, We(e.ctx), Yn = !1, or = ++ar, e.ac !== null && (ut(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= ie;
		var u = e.fn, d = u();
		e.f |= T;
		var f = e.deps, p = M?.is_fork;
		if (er !== null) {
			var m;
			if (p || pr(e, tr), f !== null && tr > 0) for (f.length = tr + er.length, m = 0; m < er.length; m++) f[tr + m] = er[m];
			else e.deps = f = er;
			if (Sn() && e.f & 512) for (m = tr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && tr < f.length && (pr(e, tr), f.length = tr);
		if (qe() && nr !== null && !Yn && f !== null && !(e.f & 6146)) for (m = 0; m < nr.length; m++) ur(nr[m], e);
		if (i !== null && i !== e) {
			if (ar++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ar;
			if (t !== null) for (let e of t) e.rv = ar;
			nr !== null && (r === null ? r = nr : r.push(...nr));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (e) {
		return Qe(e);
	} finally {
		e.f ^= ie, er = t, tr = n, nr = r, B = i, Qn = a, We(o), Yn = s, or = c;
	}
}
function fr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (er === null || !s.call(er, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~re), c.v !== n && nt(c), c.ac !== null && ut(() => {
			c.ac.abort(he), c.ac = null, tt(c, x);
		}), Dt(c), pr(c, 0);
	}
}
function pr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) fr(e, n[r]);
}
function mr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		tt(e, b);
		var n = V, r = Kn;
		V = e, Kn = !(t & 96);
		try {
			t & 16777232 ? In(e) : Fn(e), Pn(e);
			var i = dr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ir;
		} finally {
			Kn = r, V = n;
		}
	}
}
async function hr() {
	await Promise.resolve(), Bt();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), B !== null && !Yn && !(V !== null && V.f & 16384) && (Qn === null || !Qn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < ar && (e.rv = ar, er === null && n !== null && n[tr] === e ? tr++ : er === null ? er = [e] : er.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (qn && Jt.has(e)) return Jt.get(e);
	if (t) {
		var i = e;
		if (qn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || _r(i)) && (a = Tt(i)), Jt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Yn && B !== null && (Kn || !!(B.f & 512)), c = (i.f & T) === 0;
		lr(i) && (o && (i.f |= 512), Et(i)), o && !c && (Ot(i), gr(i));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function gr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ot(t), gr(t));
}
function _r(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Jt.has(t) || t.f & 2 && _r(t)) return !0;
	return !1;
}
function U(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) vr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && vr(n);
		}
	}
}
function vr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			vr(e[n], t);
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
var yr = Symbol("events"), br = /* @__PURE__ */ new Set(), xr = /* @__PURE__ */ new Set();
function Sr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Er.call(t, e), !e.cancelBubble) return ut(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Cr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Sr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Cn(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[yr] ??= {})[e] = n;
}
function wr(e) {
	for (var t = 0; t < e.length; t++) br.add(e[t]);
	for (var n of xr) n(e);
}
var Tr = null;
function Er(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Tr = e;
	var o = 0, s = Tr === e && e[yr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[yr] = t;
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
		Xn(null), Zn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[yr]?.[r];
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
			e[yr] = t, delete e.currentTarget, Xn(d), Zn(f);
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
	var t = _n("template");
	return t.innerHTML = Or(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Ar(e, t) {
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
		if (O) return Ar(k, null), k;
		i === void 0 && (i = kr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ pn(i)));
		var t = r || cn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ pn(t), s = t.lastChild;
			Ar(o, s);
		} else Ar(t, t);
		return t;
	};
}
function jr() {
	if (O) return Ar(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = fn();
	return e.append(t, n), Ar(t, n), e;
}
function q(e, t) {
	if (O) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Fe();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Mr = ["touchstart", "touchmove"];
function Nr(e) {
	return Mr.includes(e);
}
var Pr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Fr(e) {
	return Pr.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Ir(e, t) {
	return Rr(e, t);
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	dn();
	var u = void 0, d = Dn(() => {
		var s = r ?? n.appendChild(fn());
		mt(s, { pending: () => {} }, (n) => {
			Ge({});
			var r = j;
			if (o && (r.c = o), a && (i.$$events = a), O && Ar(n, null), u = e(n, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Ae(), t;
			Ke();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Nr(r);
					for (let e of [n, document]) {
						var a = Lr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Lr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Er, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(br)), xr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Lr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Er), t.delete(e), t.size === 0 && Lr.delete(r)) : t.set(e, i);
			}
			xr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return zr.set(u, d), u;
}
var zr = /* @__PURE__ */ new WeakMap();
function Br(e, t) {
	let n = zr.get(e);
	return n ? (zr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Vr = class {
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
						Wn(r, t), t.append(fn()), this.#n.set(e, {
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
		var n = M, r = gn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = fn();
			i.append(a), this.#n.set(e, {
				effect: Nn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Nn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
function Hr(e) {
	j === null && _e("onMount"), He && j.l !== null ? Ur(j).m.push(e) : wn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Ur(e) {
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
	O && (r = k, Fe());
	var i = new Vr(e), a = n ? E : 0;
	function o(e, t) {
		if (O) {
			var n = Re(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Le();
				Pe(a), i.anchor = a, Ne(!1), i.ensure(e, t), Ne(!0);
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
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Wr = Symbol("NaN");
function Gr(e, t, n) {
	O && Fe();
	var r = new Vr(e), i = !qe();
	Mn(() => {
		var e = t();
		e !== e && (e = Wr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Kr(e, t) {
	return t;
}
function qr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Bn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Jr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			hn(d), d.append(u), e.items.clear();
		}
		Jr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Jr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= D, Wn(a, document.createDocumentFragment())) : Ln(t[i], n);
	}
}
var Yr;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = O ? Pe(/* @__PURE__ */ pn(u)) : u.appendChild(fn());
	}
	O && Fe();
	var d = null, f = /* @__PURE__ */ Ct(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Zr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= D, $r(d, null, s)) : Hn(d) : Bn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Mn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			O && Re(s) === "[!" != (e === 0) && (s = Le(), Pe(s), Ne(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = gn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (s = k, a = !0, Ne(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && $t(S.v, b), S.i && $t(S.i, y), v && u.unskip_effect(S.e)) : (S = Qr(l, h ? s : Yr ??= fn(), b, x, y, i, t, n), h || (S.e.f |= D), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Nn(() => o(s)) : (d = Nn(() => o(Yr ??= fn())), d.f |= D)), e > c.size && ye("", "", ""), O && e > 0 && Pe(Le()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Ne(!0), H(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, O && (s = k);
}
function Xr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Zr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = Xr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Hn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= D, _ === l) $r(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ei(e, d, _), ei(e, _, y), $r(_, y, n), d = _, p = [], m = [], l = Xr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) $r(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					ei(e, S.prev, C.next), ei(e, d, S), ei(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), $r(_, l, n), ei(e, _.prev, _.next), ei(e, _, d === null ? e.effect.first : d.next), ei(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Xr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Xr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Jr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Xr(l.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			qr(e, w, ee);
		}
	}
	a && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Xt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Xt(i) : null;
	return {
		v: c,
		i: l,
		e: Nn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function $r(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ mn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ei(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function ti(e, t, n, r, a, o) {
	let s = O;
	O && Fe();
	var c = null;
	O && k.nodeType === 1 && (c = k, Fe());
	var l = O ? k : e, u = new Vr(l, !1);
	Mn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = O ? c : _n(e, o), Ar(c, c), r) {
					var n = null;
					O && Fr(e) && c.append(n = document.createComment(""));
					var i = O ? /* @__PURE__ */ pn(c) : c.appendChild(fn());
					O && (i === null ? Ne(!1) : Pe(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			O && Pe(t);
		}), () => {};
	}, E), Cn(() => {}), s && (Ne(!0), Pe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ni(e, t, n) {
	On(() => {
		var r = U(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			jn(() => {
				var e = n();
				W(e), i && Be(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ri(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ri(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function ii() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ri(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ai(e) {
	return typeof e == "object" ? ii(e) : e ?? "";
}
var oi = [..." 	\n\r\f\xA0\v﻿"];
function si(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || oi.includes(r[o - 1])) && (s === r.length || oi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[de];
	if (O || o !== n || o === void 0) {
		var s = si(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ci(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return je();
		for (var r of e.options) r.selected = t.includes(di(r));
		return;
	}
	for (r of e.options) if (on(di(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function li(e) {
	var t = new MutationObserver(() => {
		"__value" in e && ci(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), Cn(() => {
		t.disconnect();
	});
}
function ui(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	dt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), di);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && di(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), On(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if (ci(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = di(s), n(a));
		}
		e.__value = a, i = !1;
	}), li(e);
}
function di(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var fi = Symbol("is custom element"), pi = Symbol("is html"), mi = ge ? "link" : "LINK", hi = ge ? "progress" : "PROGRESS";
function gi(e) {
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
		e[me] = n, Xe(n), lt();
	}
}
function _i(e, t) {
	var n = yi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === hi) && (e.value = t ?? "");
}
function vi(e, t) {
	var n = yi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = yi(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[ue] ??= {
		[fi]: e.nodeName.includes("-"),
		[pi]: e.namespaceURI === r
	};
}
var bi = /* @__PURE__ */ new Map();
function xi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = bi.get(t);
	if (n) return n;
	bi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Si(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	dt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = wi(e) ? Ti(a) : a, n(a), M !== null && r.add(M), await hr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(wi(e) ? Ti(e.value) : e.value), M !== null && r.add(M)), jn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		wi(e) && n === Ti(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Ci(e, t, n = t) {
	dt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), jn(() => {
		e.checked = !!t();
	});
}
function wi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ti(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ei(e, t) {
	return e === t || e?.[se] === t;
}
function Di(e = {}, t, n, r) {
	var i = j.r, a = V;
	return On(() => {
		var o, s;
		return jn(() => {
			o = s, s = r?.() || [], U(() => {
				Ei(n(...s), e) || (t(e, ...s), o && Ei(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ei(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Oi(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ bt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && En(() => {
		ki(t, r), v(n.b);
	}), wn(() => {
		let e = U(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && wn(() => {
		ki(t, r), v(n.a);
	});
}
function ki(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !He || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ bt(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = se in e || ce in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ot(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && we(t), f(m)));
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
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? rn(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return qn && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ue();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ai = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), ji = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Mi = /* @__PURE__ */ K("<option> </option>"), Ni = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), Pi = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Fi = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Ii = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function Li(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 4), E = /* @__PURE__ */ N();
	async function te() {
		await hr(), H(E)?.focus?.();
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
	}), kn(), Oi();
	var re = jr(), ie = I(re), ae = (e) => {
		var t = Ai();
		z(() => {
			Z(t, 1, ai(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, oe = (e) => {
		var t = Ii(), r = F(t);
		gi(r), Di(r, (e) => P(E, e), () => H(E));
		var c = L(r, 2), l = (e) => {
			var t = ji();
			st(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Si(t, () => H(T), (e) => P(T, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Mi(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), A(d);
		var f = L(d, 2), p = (e) => {
			var t = Ni(), n = F(t, !0);
			A(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = Pi(), n = I(t), r = F(n, !0);
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
			var t = Fi(), n = I(t), r = F(n, !0);
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
			Z(t, 1, ai(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), Cr("submit", t, ne), G("keydown", t, D), Si(r, () => H(w), (e) => P(w, e)), ui(d, () => H(ee), (e) => P(ee, e)), q(e, t);
	};
	Y(ie, (e) => {
		l() ? e(oe, -1) : e(ae);
	}), q(e, re), Ke();
}
wr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var Ri = /* @__PURE__ */ K("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), zi = /* @__PURE__ */ K("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), Bi = /* @__PURE__ */ K("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Vi = /* @__PURE__ */ K("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Hi(e, t) {
	Ge(t, !1);
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
	Oi();
	var c = Vi(), l = F(c), u = F(l), d = L(F(u), 2), f = F(d, !0);
	A(d), A(u), Ie(2), A(l);
	var p = L(l, 2), m = (e) => {
		var t = Ri(), r = F(t), i = L(F(r), 2), o = F(i, !0);
		A(i), A(r);
		var s = L(r, 2), c = L(F(s), 2), l = F(c, !0);
		A(c), A(s), A(t), z((e, t) => {
			J(o, e), J(l, t);
		}, [() => (W(n()), U(() => a(n().before))), () => (W(n()), U(() => a(n().after)))]), q(e, t);
	}, h = (e) => {
		q(e, zi());
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
		var t = Bi(), r = L(F(t), 1, !0);
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
	]), q(e, c), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var Ui = /* @__PURE__ */ K("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Wi(e, t) {
	Ge(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N();
	Hr(() => {
		H(o).showModal(), H(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Oi();
	var u = Ui(), d = L(F(u), 2);
	Hi(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = L(d, 2), p = F(f);
	Di(p, (e) => P(s, e), () => H(s));
	var m = L(p, 2), h = F(m, !0);
	A(m), A(f), A(u), Di(u, (e) => P(o, e), () => H(o)), z(() => {
		p.disabled = r(), m.disabled = r(), J(h, r() ? "正在儲存…" : "確認儲存");
	}), Cr("cancel", u, c), G("keydown", u, l), G("click", p, function(...e) {
		i()?.apply(this, e);
	}), G("click", m, function(...e) {
		a()?.apply(this, e);
	}), q(e, u), Ke();
}
wr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var Gi = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function Ki(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = jr();
	X(I(i), 1, n, Kr, (e, t) => {
		let n = /* @__PURE__ */ Ct(() => (H(t), U(() => H(t).level ?? "error")));
		var i = Gi(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s, !0);
		A(s), A(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var qi = /* @__PURE__ */ K("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function Ji(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), kn(), Oi();
	var d = qi(), f = F(d, !0);
	A(d), z(() => {
		Q(d, "aria-pressed", H(n)), Q(d, "aria-label", `目前為${H(r)}；按下切換到${H(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(f, H(r));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), Ke();
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Yi = /* @__PURE__ */ K("<i></i>"), Xi = /* @__PURE__ */ K("<div role=\"img\"></div>"), Zi = /* @__PURE__ */ K("<progress max=\"100\"></progress>");
function Qi(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	R(() => W(o()), () => {
		P(n, d(o()));
	}), R(() => W(a()), () => {
		P(r, Array.isArray(a()) ? a() : []);
	}), kn(), Oi();
	var f = jr(), p = I(f), m = (e) => {
		var t = Xi();
		X(t, 5, () => H(r), Kr, (e, t) => {
			var n = Yi();
			z((e) => Z(n, 1, e), [() => (H(t), U(() => `progress-cell${u(H(t))}`))]), q(e, n);
		}), A(t), z(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), q(e, t);
	}, h = (e) => {
		var t = Zi();
		z(() => {
			Z(t, 1, `progress-meter ${c()}`), _i(t, H(n)), Q(t, "aria-label", s());
		}), q(e, t);
	};
	Y(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), q(e, f), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var $i = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function ea(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "timeProgressPercent", 8, null);
	R(() => (W(o()), W(r()), W(i()), W(a())), () => {
		P(n, o() === null ? `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位` : `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；時間已使用 ${o()}%`);
	}), kn();
	var s = $i(), c = I(s), l = F(c), u = F(l);
	A(l), A(c);
	var d = L(c, 2);
	{
		let e = /* @__PURE__ */ Ct(() => r() / 100);
		Qi(d, {
			form: "continuous",
			get ratio() {
				return H(e);
			},
			get label() {
				return H(n);
			},
			extraClass: "project-progress-meter"
		});
	}
	z(() => J(u, `整體約 ${r() ?? ""}%`)), q(e, s), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var ta = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), na = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function ra(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = jr();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = na(), i = F(n), a = F(i, !0);
		A(i);
		var o = L(i, 2), s = (e) => {
			var n = ta(), i = F(n, !0);
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
var ia = /* @__PURE__ */ K("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), aa = /* @__PURE__ */ K("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), oa = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function sa(e, t) {
	Ge(t, !1);
	let n = $(t, "cautious", 8, !0), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Oi();
	var y = oa(), b = I(y), x = F(b, !0);
	A(b);
	var S = L(b, 2), C = F(S), w = F(C, !0);
	A(C);
	var T = L(C, 2), ee = F(T, !0);
	A(T), A(S);
	var E = L(S, 2), te = (e) => {
		var t = ia(), a = F(t, !0);
		A(t), z(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), J(a, i());
		}), G("click", t, () => r()(!n())), q(e, t);
	};
	Y(E, (e) => {
		r() && e(te);
	});
	var ne = L(E, 2), D = (e) => {
		var t = aa(), n = I(t), r = F(n, !0);
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
	}), q(e, y), Ke();
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var ca = /* @__PURE__ */ K("<button type=\"button\"> </button>"), la = /* @__PURE__ */ K("<div role=\"toolbar\"></div>");
function ua(e, t) {
	Ge(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = !1, u = null, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N();
	async function p() {
		let e = H(d);
		P(d, null), await hr(), [...H(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	}), kn(), Oi();
	var D = la();
	X(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ Ct(() => (H(t), U(() => H(t).sortable !== !1)));
		var r = ca(), i = F(r, !0);
		A(r), z((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (H(t), U(() => H(t).id))), Q(r, "data-reorder-capsule", H(n) ? "true" : null), Q(r, "aria-pressed", (H(t), U(() => H(t).pressed ?? null))), Q(r, "aria-label", (H(t), U(() => H(t).ariaLabel ?? H(t).label))), Q(r, "aria-keyshortcuts", H(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (H(t), U(() => H(t).title ?? null))), Q(r, "draggable", H(n)), J(i, (H(t), U(() => H(t).label)));
		}, [() => (H(t), W(H(n)), H(s), H(c), U(() => `capsule-button ${H(t).className ?? ""} ${H(n) ? "capsule-sortable" : ""} ${H(s) === H(t).id ? "capsule-dragging" : ""} ${h(H(t).id, H(c))}`))]), G("click", r, (e) => b(H(t), e)), G("keydown", r, function(...e) {
			(H(n) ? (e) => x(H(t), e) : null)?.apply(this, e);
		}), Cr("dragstart", r, function(...e) {
			(H(n) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), Cr("dragover", r, function(...e) {
			(H(n) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), Cr("dragleave", r, function(...e) {
			(H(n) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), Cr("drop", r, function(...e) {
			(H(n) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), Cr("dragend", r, function(...e) {
			(H(n) ? ee : null)?.apply(this, e);
		}), G("pointerdown", r, function(...e) {
			(H(n) ? (e) => E(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", r, function(...e) {
			(H(n) ? (e) => te(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", r, function(...e) {
			(H(n) ? ne : null)?.apply(this, e);
		}), Cr("pointercancel", r, function(...e) {
			(H(n) ? ne : null)?.apply(this, e);
		}), q(e, r);
	}), A(D), Di(D, (e) => P(f, e), () => H(f)), z(() => {
		Z(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), q(e, D), Ke();
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
function da(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "categories", 24, () => []), i = $(t, "activeId", 8, null), a = $(t, "ariaLabel", 8, "篩選"), o = $(t, "className", 8, ""), s = $(t, "reorderable", 8, !1), c = $(t, "onSelect", 8, () => {}), l = $(t, "onReorder", 8, () => {}), u = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`;
	R(() => (W(r()), W(s()), W(i())), () => {
		P(n, r().map((e) => {
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
	}), kn(), Oi(), ua(e, {
		get items() {
			return H(n);
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
	}), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusFilters.svelte
function fa(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "counts", 24, () => ({})), a = $(t, "statusOrder", 24, () => []), o = $(t, "activeFilter", 8, "all"), s = $(t, "statusLabels", 24, () => ({})), c = $(t, "onFilterChange", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	R(() => (W(a()), W(i())), () => {
		P(n, ["all", ...a()].filter((e) => e === "all" || (i()[e] ?? 0) > 0));
	}), R(() => (H(n), W(s()), W(i())), () => {
		P(r, H(n).map((e, t) => {
			let n = e === "all" ? "全部" : s()[e] ?? e, r = i()[e] ?? 0, a = e !== "all";
			return {
				id: e,
				label: n,
				count: r,
				sortable: a,
				title: a ? e === "planned" ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序" : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動" : null,
				ariaLabel: a ? `${n} ${r}，排序第 ${t}；可拖曳調整` : `${n} ${r}`
			};
		}));
	}), kn(), Oi(), da(e, {
		get categories() {
			return H(r);
		},
		get activeId() {
			return o();
		},
		className: "status-filter-strip",
		ariaLabel: "工作狀態篩選與排序",
		reorderable: !0,
		get onSelect() {
			return c();
		},
		get onReorder() {
			return l();
		}
	}), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var pa = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function ma(e, t) {
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
	}), kn(), Oi();
	var o = jr();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = pa(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a, !0);
		A(a), A(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var ha = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), ga = /* @__PURE__ */ K("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), _a = /* @__PURE__ */ K("<li> </li>"), va = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), ya = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), ba = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), xa = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), Sa = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Ca = /* @__PURE__ */ K("<p> </p>"), wa = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), Ta = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Ea = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), Da = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Oa = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), ka = /* @__PURE__ */ K("<!> <!>", 1);
function Aa(e, t) {
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
	}), kn(), Oi();
	var s = jr(), c = I(s), l = (e) => {
		var t = jr();
		ti(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = ka(), s = I(n);
			ti(s, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = ga(), i = L(I(n), 2), o = F(i, !0);
				A(i);
				var s = L(i, 2), c = (e) => {
					q(e, ha());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), z(() => J(o, H(r))), q(t, n);
			});
			var c = L(s, 2), l = (e) => {
				var t = Oa(), n = L(F(t), 2), r = (e) => {
					var t = va(), n = L(F(t), 2);
					X(n, 5, () => H(i), Kr, (e, t) => {
						var n = _a(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), s = (e) => {
					var t = ya(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().blockers)), Kr, (e, t) => {
						var n = _a(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(a, (e) => {
					W(o()), U(() => o().blockers?.length) && e(s);
				});
				var c = L(a, 2), l = (e) => {
					var t = Sa(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().decisions)), Kr, (e, t) => {
						var n = xa(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = (e) => {
							var n = ba(), r = F(n, !0);
							A(n), z(() => J(r, (H(t), U(() => H(t).reference)))), q(e, n);
						};
						Y(a, (e) => {
							H(t), U(() => H(t).reference) && e(o);
						}), A(n), z(() => J(i, (H(t), U(() => H(t).summary)))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(c, (e) => {
					W(o()), U(() => o().decisions?.length) && e(l);
				});
				var u = L(c, 2), d = (e) => {
					var t = Ta(), n = L(F(t), 2);
					X(n, 5, () => (W(o()), U(() => o().routes)), Kr, (e, t) => {
						var n = wa(), r = F(n), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r);
						var c = L(r, 2), l = (e) => {
							var n = Ca(), r = F(n, !0);
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
					W(o()), U(() => o().routes?.length) && e(d);
				});
				var f = L(u, 2), p = (e) => {
					var t = Da(), n = L(F(t), 2), r = F(n);
					A(n);
					var i = L(n, 2), a = (e) => {
						var t = Ca(), n = F(t);
						A(t), z(() => J(n, `Worktree: ${W(o()), U(() => o().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(o()), U(() => o().claim.worktree) && e(a);
					});
					var s = L(i, 2), c = (e) => {
						var t = Ea();
						X(t, 5, () => (W(o()), U(() => o().claim.source_paths)), Kr, (e, t) => {
							var n = ba(), r = F(n, !0);
							A(n), z(() => J(r, H(t))), q(e, n);
						}), A(t), q(e, t);
					};
					Y(s, (e) => {
						W(o()), U(() => o().claim.source_paths?.length) && e(c);
					}), A(t), z(() => J(r, `Agent: ${W(o()), U(() => o().claim.agent) ?? ""}`)), q(e, t);
				};
				Y(f, (e) => {
					W(o()), U(() => o().claim) && e(p);
				}), A(t), q(e, t);
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
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function ja(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "onActivate", 8, () => {}), s = $(t, "onReorder", 8, () => {});
	R(() => W(a()), () => {
		P(n, new Map(a().map((e, t) => [e, t])));
	}), R(() => (W(i()), H(n), W(a())), () => {
		P(r, [...i()].sort((e, t) => (H(n).get(e.id) ?? a().length) - (H(n).get(t.id) ?? a().length)));
	}), kn(), Oi();
	var c = jr(), l = I(c), u = (e) => {
		ua(e, {
			get items() {
				return H(r);
			},
			className: "item-module-strip",
			ariaLabel: "子項目模組",
			get onActivate() {
				return o();
			},
			get onReorder() {
				return s();
			}
		});
	};
	Y(l, (e) => {
		H(r), U(() => H(r).length) && e(u);
	}), q(e, c), Ke();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Ma = /* @__PURE__ */ K("<option> </option>"), Na = /* @__PURE__ */ K("<select class=\"inline-priority-select\"></select>"), Pa = /* @__PURE__ */ K("<span> </span>"), Fa = /* @__PURE__ */ K("<span class=\"item-row-priority\"><!></span>"), Ia = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), La = /* @__PURE__ */ K("<span class=\"spike-item-title\"> </span>"), Ra = /* @__PURE__ */ K("<select class=\"inline-status-select\"><option>待處理</option><option>已完成</option></select>"), za = /* @__PURE__ */ K("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), Ba = /* @__PURE__ */ K("<li><span aria-hidden=\"true\"> </span> <!> <span class=\"item-row-description\"><!></span> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function Va(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "taskId", 8), l = $(t, "field", 8), u = $(t, "item", 8), d = $(t, "editing", 8), f = $(t, "policy", 8), p = $(t, "onCommand", 8), m = $(t, "timeItem", 8, null), h = $(t, "onTimeClick", 8, null), g = $(t, "moduleOrder", 24, () => ["time"]), _ = $(t, "onModuleReorder", 8, () => {}), v = /* @__PURE__ */ N(f().normalize(u().priority, f().fallbackValue)), y = /* @__PURE__ */ N(l() === "completed_items" ? "completed" : "pending");
	function b(e) {
		let t = e === "completed" ? "completed_items" : "pending_items";
		t !== l() && p()({
			type: "move-item",
			taskId: c(),
			itemId: u().id,
			fromField: l(),
			toField: t
		});
	}
	function x(e) {
		e === "time" && h() && h()(u().id, u().title, c());
	}
	R(() => (W(f()), W(u())), () => {
		P(n, f().metadata(u().priority));
	}), R(() => (W(f()), W(u())), () => {
		P(r, f().format(u().priority));
	}), R(() => (W(f()), W(u())), () => {
		P(v, f().normalize(u().priority, f().fallbackValue));
	}), R(() => W(m()), () => {
		P(i, m() ? m().label ?? `${Number(m().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), R(() => W(l()), () => {
		P(a, l() === "completed_items" ? "completed" : "pending");
	}), R(() => H(a), () => {
		P(y, H(a));
	}), R(() => H(a), () => {
		P(o, H(a) === "completed" ? "已完成" : "待處理");
	}), R(() => (W(m()), H(i), W(h()), W(u())), () => {
		P(s, m() ? [{
			id: "time",
			label: H(i),
			className: "time-item-button",
			sortable: !0,
			ariaLabel: h() ? `${u().title}，${H(i)}，查看估算依據` : `${u().title}，目前分析 ${H(i)}`,
			title: `目前分析：${m().likely_minutes} 分鐘；可拖曳調整模組順序`
		}] : []);
	}), kn(), Oi();
	var S = Ba();
	let C;
	var w = F(S), T = F(w, !0);
	A(w);
	var ee = L(w, 2), E = (e) => {
		var t = Fa(), i = F(t), a = (e) => {
			var t = Na();
			X(t, 5, () => (W(f()), U(() => f().levels)), (e) => e.value, (e, t) => {
				var n = Ma(), r = F(n, !0);
				A(n);
				var i = {};
				z((e) => {
					J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
				}, [() => (W(f()), H(t), U(() => f().format(H(t).value)))]), q(e, n);
			}), A(t), z(() => Q(t, "aria-label", (W(u()), U(() => `設定「${u().title}」的優先級`)))), G("change", t, () => p()({
				type: "set-item-field",
				taskId: c(),
				field: l(),
				itemId: u().id,
				property: "priority",
				value: Number(H(v))
			})), ui(t, () => H(v), (e) => P(v, e)), q(e, t);
		}, o = (e) => {
			var t = Pa(), i = F(t, !0);
			A(t), z(() => {
				Z(t, 1, (H(n), U(() => `priority-badge priority-${H(n).tone}`))), J(i, H(r));
			}), q(e, t);
		};
		Y(i, (e) => {
			d() ? e(a) : e(o, -1);
		}), A(t), q(e, t);
	};
	Y(ee, (e) => {
		W(d()), H(n), W(f()), U(() => d() || H(n) && (!H(n).hidden || !f().labelsValid)) && e(E);
	});
	var te = L(ee, 2), ne = F(te), D = (e) => {
		var t = Ia();
		gi(t), z(() => {
			Q(t, "aria-label", (W(u()), U(() => `編輯子項目：${u().title}`))), Q(t, "title", (W(u()), U(() => u().title))), _i(t, (W(u()), U(() => u().title)));
		}), G("input", t, (e) => p()({
			type: "set-item-field",
			taskId: c(),
			field: l(),
			itemId: u().id,
			property: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, re = (e) => {
		var t = La(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "title", (W(u()), U(() => u().title))), J(n, (W(u()), U(() => u().title)));
		}), q(e, t);
	};
	Y(ne, (e) => {
		d() ? e(D) : e(re, -1);
	}), A(te);
	var ie = L(te, 2), ae = F(ie);
	ja(F(ae), {
		get capsules() {
			return H(s);
		},
		get moduleOrder() {
			return g();
		},
		onActivate: x,
		get onReorder() {
			return _();
		}
	}), A(ae);
	var oe = L(ae, 2), se = F(oe), ce = (e) => {
		var t = Ra(), n = F(t);
		n.value = n.__value = "pending";
		var r = L(n);
		r.value = r.__value = "completed", A(t), z(() => Q(t, "aria-label", (W(u()), U(() => `設定「${u().title}」的狀態`)))), G("change", t, () => b(H(y))), ui(t, () => H(y), (e) => P(y, e)), q(e, t);
	}, le = (e) => {
		var t = Pa(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, `item-status-capsule item-status-${H(a)}`), J(n, H(o));
		}), q(e, t);
	};
	Y(se, (e) => {
		d() ? e(ce) : e(le, -1);
	}), A(oe);
	var ue = L(oe, 2), de = (e) => {
		var t = za(), n = F(t);
		A(t), z(() => Q(n, "aria-label", (W(u()), U(() => `刪除子項目：${u().title}`)))), G("click", n, () => p()({
			type: "delete-item",
			taskId: c(),
			field: l(),
			itemId: u().id
		})), q(e, t);
	};
	Y(ue, (e) => {
		d() && e(de);
	}), A(ie), A(S), z(() => {
		C = Z(S, 1, "editor-item-row", null, C, { "editable-work-item": d() }), Z(w, 1, `item-row-marker item-row-marker-${H(a)}`), J(T, H(a) === "completed" ? "✓" : "○");
	}), q(e, S), Ke();
}
wr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Ha = /* @__PURE__ */ K("<option> </option>"), Ua = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), Wa = /* @__PURE__ */ K("<span> </span>"), Ga = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Ka = /* @__PURE__ */ K("<h3> </h3>"), qa = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Ja = /* @__PURE__ */ K("<p class=\"task-summary\"> </p>"), Ya = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Xa = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Za = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Qa = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), $a = /* @__PURE__ */ K("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function eo(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let f = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), p = $(t, "onTimeClick", 8, null), m = $(t, "moduleOrder", 24, () => ["time"]), h = $(t, "onModuleReorder", 8, () => {}), g = $(t, "statusOrder", 24, () => ["done", "planned"]), _ = $(t, "taskDuration", 8, null), v = [
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
	], y = /* @__PURE__ */ N(!1), b = /* @__PURE__ */ N(""), x = /* @__PURE__ */ N(l().creationDefaultValue), S = /* @__PURE__ */ N(""), C = /* @__PURE__ */ N(o().status), w = /* @__PURE__ */ N(l().normalize(o().priority, l().fallbackValue));
	function T() {
		P(y, !1), P(b, ""), P(x, l().creationDefaultValue), P(S, "");
	}
	function ee() {
		let e = d()(H(b), Number(H(x)));
		P(S, e.error), H(S) || T();
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
		P(C, o().status);
	}), R(() => (W(l()), W(o())), () => {
		P(w, l().normalize(o().priority, l().fallbackValue));
	}), R(() => W(o()), () => {
		P(a, v.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), R(() => (W(c()), H(y)), () => {
		!c() && H(y) && T();
	}), kn(), Oi();
	var E = $a(), te = F(E), ne = F(te), D = F(ne), re = F(D), ie = F(re, !0);
	A(re);
	var ae = L(re, 2), oe = (e) => {
		var t = Ua(), n = I(t);
		X(n, 5, () => v, (e) => e.value, (e, t) => {
			var n = Ha(), r = F(n, !0);
			A(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), A(n);
		var r = L(n, 2);
		X(r, 5, () => (W(l()), U(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Ha(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(l()), H(t), U(() => l().format(H(t).value)))]), q(e, n);
		}), A(r), z(() => {
			Q(n, "aria-label", (W(o()), U(() => `${o().title} 狀態`))), Q(r, "aria-label", (W(o()), U(() => `${o().title} 優先級`)));
		}), G("change", n, () => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: H(C)
		})), ui(n, () => H(C), (e) => P(C, e)), G("change", r, () => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(H(w))
		})), ui(r, () => H(w), (e) => P(w, e)), q(e, t);
	}, se = (e) => {
		var t = Wa(), n = F(t, !0);
		A(t), z((e, r, a) => {
			Z(t, 1, (H(i), U(() => `task-priority-badge priority-badge priority-${H(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), J(n, a);
		}, [
			() => (W(l()), W(o()), U(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (W(l()), W(o()), U(() => `優先級：${l().format(o().priority)}`)),
			() => (W(l()), W(o()), U(() => l().format(o().priority)))
		]), q(e, t);
	};
	Y(ae, (e) => {
		c() ? e(oe) : (H(i), W(l()), U(() => H(i) && (!H(i).hidden || !l().labelsValid)) && e(se, 1));
	}), A(D);
	var ce = L(D, 2), le = F(ce), ue = (e) => {
		var t = Ga();
		gi(t), z(() => {
			Q(t, "id", (W(o()), U(() => `task-${o().id}-title`))), _i(t, (W(o()), U(() => o().title)));
		}), G("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, de = (e) => {
		var t = Ka(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "id", (W(o()), U(() => `task-${o().id}-title`))), J(n, (W(o()), U(() => o().title)));
		}), q(e, t);
	};
	Y(le, (e) => {
		c() ? e(ue) : e(de, -1);
	});
	var fe = L(le, 2), pe = F(fe, !0);
	A(fe), A(ce), A(ne);
	var me = L(ne, 2), he = F(me), ge = F(he);
	A(he);
	var _e = L(he, 2), ve = F(_e, !0);
	A(_e), A(me), A(te);
	var ye = L(te, 2), be = (e) => {
		var t = qa();
		st(t), z(() => _i(t, (W(o()), U(() => o().summary)))), G("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), q(e, t);
	}, xe = (e) => {
		var t = Ja(), n = F(t, !0);
		A(t), z(() => J(n, (W(o()), U(() => o().summary)))), q(e, t);
	};
	Y(ye, (e) => {
		c() ? e(be) : e(xe, -1);
	});
	var Se = L(ye, 2);
	{
		let e = /* @__PURE__ */ Ct(() => (W(o()), U(() => o().developer ?? null)));
		Aa(Se, { get developer() {
			return H(e);
		} });
	}
	var Ce = L(Se, 2), we = F(Ce);
	X(we, 1, () => H(r), (e) => e.status, (e, t) => {
		var n = jr(), r = I(n), i = (e) => {
			var n = Ya(), r = F(n), i = F(r, !0);
			A(r);
			var a = L(r, 2);
			X(a, 5, () => (H(t), U(() => H(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ Ct(() => (W(f()), H(n), U(() => f().get(H(n).id) ?? null)));
					Va(e, {
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
						get onTimeClick() {
							return p();
						},
						get moduleOrder() {
							return m();
						},
						get onModuleReorder() {
							return h();
						}
					});
				}
			}), A(a), A(n), z(() => {
				Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title)));
			}), q(e, n);
		};
		Y(r, (e) => {
			H(t), W(c()), U(() => H(t).items.length || c()) && e(i);
		}), q(e, n);
	});
	var Te = L(we, 2), Ee = F(Te), De = (e) => {
		var t = Qa(), n = F(t), r = (e) => {
			var t = Xa(), n = F(t);
			gi(n);
			var r = L(n, 2);
			X(r, 5, () => (W(l()), U(() => l().levels)), (e) => e.value, (e, t) => {
				var n = Ha(), r = F(n, !0);
				A(n);
				var i = {};
				z((e) => {
					J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
				}, [() => (W(l()), H(t), U(() => l().format(H(t).value)))]), q(e, n);
			}), A(r);
			var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
			A(o), A(t), z(() => {
				Q(o, "hidden", !H(S)), J(s, H(S));
			}), G("keydown", n, (e) => {
				e.key === "Enter" && ee(), e.key === "Escape" && T();
			}), Si(n, () => H(b), (e) => P(b, e)), ui(r, () => H(x), (e) => P(x, e)), G("click", i, ee), G("click", a, T), q(e, t);
		}, i = (e) => {
			var t = Za();
			z(() => Q(t, "aria-label", (W(o()), U(() => `在「${o().title}」新增子項目`)))), G("click", t, () => {
				P(y, !0);
			}), q(e, t);
		};
		Y(n, (e) => {
			H(y) ? e(r) : e(i, -1);
		}), A(t), q(e, t);
	};
	Y(Ee, (e) => {
		c() && e(De);
	}), A(Te), A(Ce), A(E), z(() => {
		Z(E, 1, (H(a), U(() => `task-card editor-task-card status-${H(a).tone}`))), Q(E, "aria-labelledby", (W(o()), U(() => `task-${o().id}-title`))), Z(re, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(ie, (H(a), U(() => H(a).label))), Q(fe, "hidden", !_()), J(pe, _() ? `約需 ${_()}` : ""), Q(he, "aria-label", (W(s()), U(() => `子項目完成 ${s().completed}，共 ${s().total}`))), J(ge, `${W(s()), U(() => s().completed) ?? ""} / ${W(s()), U(() => s().total) ?? ""}`), J(ve, (W(o()), U(() => o().id)));
	}), q(e, E), Ke();
}
wr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var to = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>");
function no(e, t) {
	Ge(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "onTimeClick", 8, null), d = $(t, "moduleOrder", 24, () => ["time"]), f = $(t, "onModuleReorder", 8, () => {}), p = $(t, "durations", 24, () => ({})), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	Oi();
	var g = jr(), _ = I(g), v = (e) => {
		var t = jr();
		X(I(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ Ct(() => (W(c()), H(t), U(() => c().get(H(t).id) ?? null))), h = /* @__PURE__ */ Ct(() => (W(p()), H(t), U(() => p()[H(t).id] ?? null)));
				eo(e, {
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
					get onTimeClick() {
						return u();
					},
					get moduleOrder() {
						return d();
					},
					get onModuleReorder() {
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
		var t = to(), n = F(t, !0);
		A(t), z(() => J(n, h())), q(e, t);
	};
	Y(_, (e) => {
		W(n()), U(() => n().length) ? e(v) : e(y, -1);
	}), q(e, g), Ke();
}
//#endregion
//#region viewer/assets/theme-model.js
var ro = [
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
], io = Object.freeze({
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
var ao = /^#[0-9a-f]{6}$/i;
function oo(e) {
	return typeof e == "string" && ao.test(e);
}
function so(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = io[n], i = { base: n };
	for (let e of ro) {
		let n = t[e.key];
		i[e.key] = oo(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function co(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function lo(e, t) {
	if (!oo(e) || !oo(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => co(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function uo(e) {
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
	].filter(([, e, t]) => lo(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var fo = /* @__PURE__ */ K("<option> </option>"), po = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), mo = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function ho(e, t) {
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(so(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(ro.map((t) => [t.key, e[t.key]]));
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
		y(o() ? so(o().base, o()) : so(s())), typeof H(f).showModal == "function" ? H(f).showModal() : H(f).setAttribute("open", "");
	}
	function S() {
		H(f).open && H(f).close();
	}
	function C(e) {
		y(so(e.currentTarget.value));
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
	function E(e) {
		e.preventDefault(), ee();
	}
	function te() {
		let e = H(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(so(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, so(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, uo(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), kn(), Oi();
	var ne = mo(), D = I(ne), re = L(F(D), 2);
	X(re, 5, () => u, (e) => e.value, (e, t) => {
		var n = fo(), r = F(n, !0);
		A(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), A(re), A(D);
	var ie = L(D, 2), ae = F(ie), oe = L(F(ae), 2);
	A(ae);
	var se = L(ae, 4), ce = L(F(se), 2), le = F(ce);
	le.value = le.__value = "light";
	var ue = L(le);
	ue.value = ue.__value = "dark", A(ce);
	var de;
	li(ce), A(se);
	var fe = L(se, 2);
	X(fe, 7, () => ro, (e) => e.key, (e, t, r) => {
		var i = po(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s);
		gi(c);
		var l = L(c, 2);
		gi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Di(l, (e, t) => Qt(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), A(s), A(i), z(() => {
			J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), _i(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), _i(l, (H(g), H(t), U(() => H(g)[H(t).key])));
		}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => T(H(t), e)), q(e, i);
	}), A(fe);
	var pe = L(fe, 2);
	let me;
	var he = F(pe, !0);
	A(pe);
	var ge = L(pe, 2), _e = F(ge), ve = L(_e, 4), ye = L(ve, 2);
	A(ge), A(ie), Di(ie, (e) => P(f, e), () => H(f)), z(() => {
		de !== (de = H(h)) && (ce.value = (ce.__value = H(h)) ?? "", ci(ce, H(h))), me = Z(pe, 1, "theme-dialog-status", null, me, { "theme-status-warning": H(r).length > 0 }), J(he, H(i));
	}), G("change", re, b), ui(re, () => H(m), (e) => P(m, e)), Cr("cancel", ie, E), G("click", oe, ee), G("change", ce, C), G("click", _e, () => y(so(H(h)))), G("click", ve, ee), G("click", ye, te), q(e, ne), Ke();
}
wr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var go = /* @__PURE__ */ K("<span> </span>"), _o = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), vo = /* @__PURE__ */ K("<form class=\"spike-estimate-form\"><section class=\"time-estimate-readout\"><div class=\"time-estimate-meta\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <section class=\"time-explanation-card time-item-rationale\"><h3>估算依據</h3> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label></section> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function yo(e, t) {
	Ge(t, !1);
	let n = $(t, "item", 8), r = $(t, "activeEstimate", 8, null), i = $(t, "onApply", 8, () => ({ error: "" })), a = /* @__PURE__ */ N(String((r()?.likely_minutes ?? n().likelyMinutes) / 60)), o = /* @__PURE__ */ N(r()?.human_note ?? ""), s = /* @__PURE__ */ N(!!(r()?.human_confirmed ?? n().humanConfirmed)), c = /* @__PURE__ */ N("");
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
	Oi();
	var u = vo(), d = F(u), f = F(d);
	X(L(F(f), 2), 1, () => (W(n()), U(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = go(), r = F(n, !0);
		A(n), z(() => {
			Z(n, 1, `time-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), A(f);
	var p = L(f, 2), m = L(F(p), 2);
	gi(m), A(p), A(d);
	var h = L(d, 2), g = L(F(h), 2), _ = L(F(g), 2);
	gi(_), A(g), A(h);
	var v = L(h, 2), y = F(v);
	gi(y), Ie(2), A(v);
	var b = L(v, 4), x = F(b);
	A(b);
	var S = L(b, 2), C = (e) => {
		var t = _o(), n = F(t, !0);
		A(t), z(() => J(n, H(c))), q(e, t);
	};
	Y(S, (e) => {
		H(c) && e(C);
	}), A(u), z(() => {
		Q(m, "aria-label", (W(n()), U(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (W(n()), U(() => `「${n().title}」人工依據`))), Q(y, "aria-label", (W(n()), U(() => `確認「${n().title}」的人工估算`))), Q(x, "aria-label", (W(n()), U(() => `套用「${n().title}」人工估算草稿`)));
	}), Cr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Si(m, () => H(a), (e) => P(a, e)), Si(_, () => H(o), (e) => P(o, e)), Ci(y, () => H(s), (e) => P(s, e)), q(e, u), Ke();
}
Object.freeze({
	on_track: {
		label: "交付可行",
		lamp: "綠色燈號",
		className: "on-track"
	},
	at_risk: {
		label: "交付有風險",
		lamp: "黃色燈號",
		className: "at-risk"
	},
	critical: {
		label: "交付不可行",
		lamp: "紅色燈號",
		className: "critical"
	},
	complete: {
		label: "已完成",
		lamp: "完成燈號",
		className: "on-track"
	}
});
var bo = /* @__PURE__ */ new Map([
	[1, "一"],
	[2, "二"],
	[3, "三"],
	[4, "四"],
	[5, "五"],
	[6, "六"],
	[7, "日"]
]);
Object.freeze({
	human_estimate: "人工估算",
	human_parameter: "人工參數",
	ai_analysis: "AI 分析",
	historical_evidence: "歷史資料",
	system_default: "預設",
	deterministic_formula: "固定公式"
}), Object.freeze({
	low: "低信心",
	medium: "中等信心",
	high: "高信心"
});
var xo = Object.freeze([...bo.entries()].map(([e, t]) => Object.freeze({
	value: e,
	label: t
}))), So = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> </label>"), Co = /* @__PURE__ */ K("<form class=\"time-capacity-editor\"><div class=\"time-editor-heading\"><h3>設定</h3> <span>重新計算只更新預覽；全域儲存才提交本機設定</span></div> <div class=\"time-editor-fields\"><label class=\"time-editor-field\"><span>每日睡眠</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label> <label class=\"time-editor-field\"><span>每日生活時間</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label> <label class=\"time-editor-field\"><span>其他固定不可工作</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label></div> <p class=\"time-capacity-derived\"> </p> <fieldset class=\"time-weekdays\"><legend>工作日</legend> <!></fieldset> <label class=\"time-exceptions-editor\"><span>休假與例外</span> <textarea rows=\"4\" placeholder=\"2026-07-29 | 0 | 休假\"></textarea> <small>每行：日期 | 當日可工作 hr | 公開標籤</small></label> <p class=\"time-editor-error\"> </p> <div class=\"time-editor-actions\"><button class=\"primary-button\" type=\"submit\">重新計算</button></div></form>");
function wo(e, t) {
	Ge(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "editor", 8), a = $(t, "onSubmit", 8, () => {}), o = /* @__PURE__ */ N(String(i().sleepHours)), s = /* @__PURE__ */ N(String(i().lifeHours)), c = /* @__PURE__ */ N(String(i().otherHours)), l = /* @__PURE__ */ N([...i().workingWeekdays]), u = /* @__PURE__ */ N(i().exceptionsText);
	function d(e, t) {
		P(l, t ? [...H(l), e] : H(l).filter((t) => t !== e));
	}
	function f(e) {
		e.preventDefault(), a()({
			sleepHours: H(o),
			lifeHours: H(s),
			otherHours: H(c),
			workingWeekdays: H(l),
			exceptionsText: H(u)
		});
	}
	R(() => (H(o), H(s), H(c)), () => {
		P(n, 24 - Number(H(o)) - Number(H(s)) - Number(H(c)));
	}), R(() => H(n), () => {
		P(r, H(n) > 0 ? `每日工作容量：${Math.round(H(n) * 10) / 10} hr` : "每日工作容量必須大於 0 hr");
	}), kn(), Oi();
	var p = Co(), m = L(F(p), 2), h = F(m), g = L(F(h), 2), _ = F(g);
	gi(_), Ie(2), A(g), A(h);
	var v = L(h, 2), y = L(F(v), 2), b = F(y);
	gi(b), Ie(2), A(y), A(v);
	var x = L(v, 2), S = L(F(x), 2), C = F(S);
	gi(C), Ie(2), A(S), A(x), A(m);
	var w = L(m, 2), T = F(w, !0);
	A(w);
	var ee = L(w, 2);
	X(L(F(ee), 2), 1, () => xo, (e) => e.value, (e, t) => {
		var n = So(), r = F(n);
		gi(r);
		var i = L(r);
		A(n), z((e) => {
			vi(r, e), J(i, ` 週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(l), H(t), U(() => H(l).includes(H(t).value)))]), G("change", r, (e) => d(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(ee);
	var E = L(ee, 2), te = L(F(E), 2);
	st(te), Ie(2), A(E);
	var ne = L(E, 2), D = F(ne, !0);
	A(ne), Ie(2), A(p), z(() => {
		J(T, H(r)), Q(ne, "hidden", (W(i()), U(() => !i().error))), J(D, (W(i()), U(() => i().error)));
	}), Cr("submit", p, f), Si(_, () => H(o), (e) => P(o, e)), Si(b, () => H(s), (e) => P(s, e)), Si(C, () => H(c), (e) => P(c, e)), Si(te, () => H(u), (e) => P(u, e)), q(e, p), Ke();
}
wr(["change"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var To = (e, t = g, n = g) => {
	var r = Mo(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o, !0);
	A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c), A(r), z((e) => {
		Z(r, 1, e), J(a, (t(), U(() => t().label))), J(s, (t(), U(() => t().value))), J(l, (t(), U(() => t().note)));
	}, [() => ai((n(), U(() => `time-evaluation-node ${n()}`.trim())))]), q(e, r);
}, Eo = (e, t = g) => {
	var n = Po();
	X(n, 5, t, Kr, (e, t) => {
		var n = No(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r), o = F(a, !0);
		A(a), A(n), z(() => {
			J(i, (H(t), U(() => H(t).label))), J(o, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, Do = (e, t = g) => {
	var n = Io();
	X(n, 5, t, Kr, (e, t) => {
		var n = Fo(), r = F(n), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i), s = F(o, !0);
		A(o), A(r);
		var c = L(r, 2), l = F(c, !0);
		A(c), A(n), z(() => {
			J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, Oo = (e, t = g) => {
	var n = Lo();
	Do(L(F(n), 2), t), A(n), q(e, n);
}, ko = (e, t = g, n = g) => {
	var r = Ro(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o), c = F(s);
	To(c, () => (t(), U(() => t().engineeringLane.source)), () => ""), To(L(c, 4), () => (t(), U(() => t().engineeringLane.result)), () => "time-evaluation-result"), A(s);
	var l = L(s, 2), u = F(l);
	To(u, () => (t(), U(() => t().capacityLane.source)), () => ""), To(L(u, 4), () => (t(), U(() => t().capacityLane.result)), () => "time-evaluation-result"), A(l), A(o);
	var d = L(o, 2);
	To(L(F(d), 2), () => (t(), U(() => t().merge)), () => (t(), U(() => t().merge.className))), A(d);
	var f = L(d, 2), p = F(f);
	To(p, () => (t(), U(() => t().risk.trend)), () => ""), To(L(p, 4), () => (t(), U(() => t().risk.result)), () => (t(), U(() => t().risk.result.className))), A(f);
	var m = L(f, 2), h = F(m, !0);
	A(m), A(r), z(() => {
		Q(r, "hidden", !n()), J(a, (t(), U(() => t().intro))), J(h, (t(), U(() => t().note)));
	}), q(e, r);
}, Ao = (e, t = g, n = g) => {
	var r = zo(), i = F(r);
	Eo(i, () => (t(), U(() => t().metrics)));
	var a = L(i, 2), o = F(a), s = F(o);
	Ie(), A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c);
	var u = L(c, 2), d = F(u, !0);
	A(u), A(a);
	var f = L(a, 2), p = L(F(f), 2), m = F(p, !0);
	A(p), A(f), Oo(L(f, 2), () => (t(), U(() => t().composition))), A(r), z(() => {
		Q(r, "hidden", !n()), Z(s, 1, `time-risk-dot ${t(), U(() => t().explanation.className) ?? ""}`), J(l, (t(), U(() => t().explanation.text))), J(d, (t(), U(() => t().explanation.formula))), J(m, (t(), U(() => t().calibrationText)));
	}), q(e, r);
}, jo = (e, t = g) => {
	var n = Ho(), r = F(n), i = F(r, !0);
	A(r);
	var a = L(r, 2);
	Eo(a, () => (t(), U(() => t().metrics)));
	var o = L(a, 2), s = L(F(o), 2), c = F(s, !0);
	A(s), A(o), Oo(L(o, 2), () => (t(), U(() => t().composition))), A(n), z(() => {
		J(i, (t(), U(() => t().intro))), J(c, (t(), U(() => t().calibrationText)));
	}), q(e, n);
}, Mo = /* @__PURE__ */ K("<div><span> </span> <strong> </strong> <small> </small></div>"), No = /* @__PURE__ */ K("<div class=\"time-metric\"><span> </span><strong> </strong></div>"), Po = /* @__PURE__ */ K("<div class=\"time-metric-grid\"></div>"), Fo = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), Io = /* @__PURE__ */ K("<div class=\"time-source-list\"></div>"), Lo = /* @__PURE__ */ K("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), Ro = /* @__PURE__ */ K("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), zo = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <section class=\"time-explanation-card\"><h3 class=\"time-formula-heading\"><span aria-hidden=\"true\"></span> 風險評估公式</h3> <p> </p> <code class=\"time-formula\"> </code></section> <section class=\"time-explanation-card\"><h3>執行校準</h3> <p> </p></section> <!></section>"), Bo = /* @__PURE__ */ K("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), Vo = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><!> <div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <section class=\"time-explanation-card\"><h3>每日容量公式</h3> <p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code></section> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), Ho = /* @__PURE__ */ K("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <section class=\"time-explanation-card\"><h3>執行校準</h3> <p> </p></section> <!></section>"), Uo = /* @__PURE__ */ K("<span> </span>"), Wo = /* @__PURE__ */ K("<section class=\"time-estimate-readout\"><div class=\"time-estimate-meta\"><span>預估工時</span> <!></div> <strong> </strong></section> <section class=\"time-explanation-card time-item-rationale\"><h3>估算依據</h3> <p> </p></section>", 1), Go = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Ko = /* @__PURE__ */ K("<section class=\"time-explanation-card\"><h3>固定公式</h3> <code class=\"time-formula\"> </code></section>"), qo = /* @__PURE__ */ K("<code class=\"time-reference\"> </code>"), Jo = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), Yo = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Xo = /* @__PURE__ */ K("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), Zo = /* @__PURE__ */ K("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Qo = /* @__PURE__ */ K("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), $o = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), es = /* @__PURE__ */ K("<dialog class=\"theme-dialog time-dialog\" id=\"time-dialog\" aria-labelledby=\"time-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2 id=\"time-dialog-title\"> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <div class=\"time-dialog-content\"><!></div></dialog>");
function ts(e, t) {
	Ge(t, !1);
	let n = (e, t = g, n = g) => {
		var r = Vo(), i = F(r), a = (e) => {
			var n = jr();
			Gr(I(n), () => (t(), U(() => t().editor.revision)), (e) => {
				wo(e, {
					get editor() {
						return t(), U(() => t().editor);
					},
					get onSubmit() {
						return f();
					}
				});
			}), q(e, n);
		};
		Y(i, (e) => {
			t(), U(() => t().editorOpen) && e(a);
		});
		var o = L(i, 4);
		Eo(o, () => (t(), U(() => t().metrics)));
		var s = L(o, 2), c = L(F(s), 4), l = F(c, !0);
		A(c), A(s);
		var u = L(s, 2), d = F(u), p = F(d, !0);
		A(d);
		var m = L(d, 2), h = F(m), _ = (e) => {
			var n = jr();
			X(I(n), 1, () => (t(), U(() => t().exceptions)), Kr, (e, t) => {
				var n = Fo(), r = F(n), i = F(r), a = F(i, !0);
				A(i);
				var o = L(i), s = F(o, !0);
				A(o), A(r);
				var c = L(r, 2), l = F(c, !0);
				A(c), A(n), z(() => {
					J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
				}), q(e, n);
			}), q(e, n);
		}, v = (e) => {
			q(e, Bo());
		};
		Y(h, (e) => {
			t(), U(() => t().exceptions) ? e(_) : e(v, -1);
		}), A(m), A(u), A(r), z(() => {
			Q(r, "hidden", !n()), J(l, (t(), U(() => t().formulaCode))), J(p, (t(), U(() => t().exceptionsHeading)));
		}), q(e, r);
	}, r = $(t, "open", 8, !1), i = $(t, "kind", 8, null), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "project", 8, null), c = $(t, "item", 8, null), l = $(t, "onClose", 8, () => {}), u = $(t, "onToggleDetails", 8, () => {}), d = $(t, "onSetTab", 8, (e) => {}), f = $(t, "onSubmitCapacity", 8, (e) => {}), p = $(t, "editing", 8, !1), m = $(t, "activeEstimate", 8, null), h = $(t, "onManualEstimate", 8, null), _ = /* @__PURE__ */ N(), v = /* @__PURE__ */ N([]), y = null, b = !1;
	function x(e) {
		y = e.ownerDocument.activeElement, b = !1, e.showModal();
	}
	function S() {
		if (b) return;
		b = !0;
		let e = y;
		y = null, l()(), queueMicrotask(() => {
			e?.isConnected && e.focus();
		});
	}
	function C() {
		H(_)?.close(), S();
	}
	function w(e) {
		e.target === e.currentTarget && C();
	}
	async function T(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		d()(n[r].name), await hr(), H(v)[r]?.focus();
	}
	Oi();
	var ee = jr(), E = I(ee), te = (e) => {
		var t = es(), r = F(t), l = F(r), f = F(l), g = F(f, !0);
		A(f);
		var y = L(f, 2), b = F(y, !0);
		A(y), A(l);
		var ee = L(l, 2);
		A(r);
		var E = L(r, 2), te = F(E), ne = (e) => {
			var t = Jo(), n = F(t), r = F(n), i = F(r, !0);
			A(r);
			var a = L(r, 2), s = F(a, !0);
			A(a), A(n);
			var l = L(n, 2), d = (e) => {
				var t = jr();
				Gr(I(t), () => (W(c()), W(m()), U(() => `${c().itemId}:${m()?.estimate_id ?? "analysis"}`)), (e) => {
					{
						let t = /* @__PURE__ */ Ct(() => (W(c()), W(o()), U(() => ({
							...c(),
							title: o()
						}))));
						yo(e, {
							get item() {
								return H(t);
							},
							get activeEstimate() {
								return m();
							},
							get onApply() {
								return h();
							}
						});
					}
				}), q(e, t);
			}, f = (e) => {
				var t = Wo(), n = I(t), r = F(n);
				X(L(F(r), 2), 1, () => (W(c()), U(() => c().sourceBadges)), (e) => e.kind, (e, t) => {
					var n = Uo(), r = F(n, !0);
					A(n), z(() => {
						Z(n, 1, `time-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
					}), q(e, n);
				}), A(r);
				var i = L(r, 2), a = F(i, !0);
				A(i), A(n);
				var o = L(n, 2), s = L(F(o), 2), l = F(s, !0);
				A(s), A(o), z(() => {
					J(a, (W(c()), U(() => c().likelyHoursLabel))), J(l, (W(c()), U(() => c().rationale)));
				}), q(e, t);
			};
			Y(l, (e) => {
				p() && h() ? e(d) : e(f, -1);
			});
			var g = L(l, 2), _ = F(g);
			Eo(_, () => (W(c()), U(() => c().technical.metrics)));
			var v = L(_, 2), y = (e) => {
				var t = Go(), n = F(t), r = F(n), i = F(r, !0);
				A(r);
				var a = L(r, 2), o = F(a, !0);
				A(a), A(n);
				var s = L(n, 2), l = F(s, !0);
				A(s), A(t), z(() => {
					J(i, (W(c()), U(() => c().technical.analysisMethod.name))), J(o, (W(c()), U(() => c().technical.analysisMethod.note))), J(l, (W(c()), U(() => c().technical.analysisMethod.version)));
				}), q(e, t);
			};
			Y(v, (e) => {
				W(c()), U(() => c().technical.analysisMethod) && e(y);
			});
			var b = L(v, 2), x = (e) => {
				var t = Ko(), n = L(F(t), 2), r = F(n, !0);
				A(n), A(t), z(() => J(r, (W(c()), U(() => c().technical.formula)))), q(e, t);
			};
			Y(b, (e) => {
				W(c()), U(() => c().technical.formula) && e(x);
			});
			var S = L(b, 2), C = (e) => {
				var t = qo(), n = F(t, !0);
				A(t), z(() => J(n, (W(c()), U(() => c().technical.reference)))), q(e, t);
			};
			Y(S, (e) => {
				W(c()), U(() => c().technical.reference) && e(C);
			}), A(g), A(t), z(() => {
				Z(r, 1, ai((W(c()), U(() => c().confidenceClass)))), J(i, (W(c()), U(() => c().confidenceLabel))), J(s, (W(c()), U(() => c().toggleLabel))), Q(g, "hidden", (W(c()), U(() => !c().detailsExpanded)));
			}), G("click", a, function(...e) {
				u()?.apply(this, e);
			}), q(e, t);
		}, D = (e) => {
			var t = $o(), r = F(t), i = F(r), a = F(i, !0);
			A(i);
			var o = L(i, 2), c = F(o, !0);
			A(o), A(r);
			var l = L(r, 2), f = F(l);
			X(f, 5, () => (W(s()), U(() => s().overview)), Kr, (e, t) => {
				var n = Xo(), r = F(n), i = F(r, !0);
				A(r);
				var a = L(r, 2), o = F(a), s = (e) => {
					var n = Yo();
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
			var p = L(f, 2), m = F(p, !0);
			A(p), A(l);
			var h = L(l, 2), g = F(h), _ = (e) => {
				var t = Qo(), r = I(t);
				X(r, 7, () => (W(s()), U(() => s().tabs)), (e) => e.name, (e, t, n) => {
					var r = Zo(), i = F(r, !0);
					A(r), Di(r, (e, t) => Qt(v, H(v)[t] = e), (e) => H(v)?.[e], () => [H(n)]), z(() => {
						Q(r, "id", (H(t), U(() => `time-${H(t).name}-tab`))), Q(r, "aria-controls", (H(t), U(() => `time-${H(t).name}-panel`))), Q(r, "aria-selected", (W(s()), H(t), U(() => s().activeTab === H(t).name))), Q(r, "tabindex", (W(s()), H(t), U(() => s().activeTab === H(t).name ? 0 : -1))), J(i, (H(t), U(() => H(t).label)));
					}), G("click", r, () => d()(H(t).name)), G("keydown", r, (e) => T(e, H(n), s().tabs)), q(e, r);
				}), A(r);
				var i = L(r, 2);
				ko(i, () => (W(s()), U(() => s().flow)), () => (W(s()), U(() => s().activeTab === "flow")));
				var a = L(i, 2);
				Ao(a, () => (W(s()), U(() => s().engineering)), () => (W(s()), U(() => s().activeTab === "engineering")));
				var o = L(a, 2);
				n(o, () => (W(s()), U(() => s().capacity)), () => (W(s()), U(() => s().activeTab === "capacity"))), q(e, t);
			}, y = (e) => {
				jo(e, () => (W(s()), U(() => s().estimateOnly)));
			};
			Y(g, (e) => {
				W(s()), U(() => s().hasDeadline) ? e(_) : e(y, -1);
			}), A(h), A(t), z(() => {
				J(a, (W(s()), U(() => s().captionLabel))), Q(o, "aria-expanded", (W(s()), U(() => s().detailsExpanded))), J(c, (W(s()), U(() => s().toggleLabel))), J(m, (W(s()), U(() => s().updatedLabel))), Q(h, "hidden", (W(s()), U(() => !s().detailsExpanded)));
			}), G("click", o, function(...e) {
				u()?.apply(this, e);
			}), q(e, t);
		};
		Y(te, (e) => {
			i() === "item" && c() ? e(ne) : i() === "project" && s() && e(D, 1);
		}), A(E), A(t), Di(t, (e) => P(_, e), () => H(_)), ni(t, (e) => x?.(e)), z(() => {
			J(g, a()), J(b, o()), Q(ee, "aria-label", `關閉${a()}`);
		}), Cr("close", t, S), G("click", t, w), G("click", ee, C), q(e, t);
	};
	Y(E, (e) => {
		r() && e(te);
	}), q(e, ee), Ke();
}
wr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var ns = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> <span> </span></label>"), rs = /* @__PURE__ */ K("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), is = /* @__PURE__ */ K("<div class=\"spike-exception-list\"></div>"), as = /* @__PURE__ */ K("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), os = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), ss = /* @__PURE__ */ K("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function cs(e, t) {
	Ge(t, !1);
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
	}), kn(), Oi();
	var ne = ss(), D = F(ne), re = L(F(D), 6), ie = F(re);
	A(re), A(D);
	var ae = L(D, 2), oe = F(ae), se = L(F(oe), 2), ce = F(se), le = L(F(ce));
	gi(le), A(ce);
	var ue = L(ce, 2), de = L(F(ue));
	gi(de), A(ue);
	var fe = L(ue, 2);
	A(se), A(oe);
	var pe = L(oe, 2), me = F(pe), he = L(F(me), 2);
	let ge;
	var _e = F(he);
	A(he), A(me);
	var ve = L(me, 2), ye = F(ve), be = L(F(ye));
	gi(be), A(ye);
	var xe = L(ye, 2), Se = L(F(xe));
	gi(Se), A(xe);
	var Ce = L(xe, 2), we = L(F(Ce));
	gi(we), A(Ce), A(ve);
	var Te = L(ve, 2);
	X(L(F(Te), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = ns(), r = F(n);
		gi(r);
		var i = L(r, 2), a = F(i);
		A(i), A(n), z((e) => {
			vi(r, e), J(a, `週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(h), H(t), U(() => H(h).includes(H(t).value)))]), G("change", r, (e) => S(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(Te), A(pe);
	var Ee = L(pe, 2), De = F(Ee), Oe = L(F(De), 2);
	A(De);
	var ke = L(De, 2), Ae = (e) => {
		var t = is();
		X(t, 5, () => H(_), (e) => e.key, (e, t) => {
			var n = rs(), r = F(n), i = L(F(r));
			gi(i), A(r);
			var a = L(r, 2), o = L(F(a));
			gi(o), A(a);
			var s = L(a, 2), c = L(F(s));
			gi(c), A(s);
			var l = L(s, 2);
			A(n), z(() => {
				_i(i, (H(t), U(() => H(t).date))), _i(o, (H(t), U(() => H(t).availableHours))), _i(c, (H(t), U(() => H(t).publicLabel)));
			}), G("input", i, (e) => C(H(t).key, "date", e.currentTarget.value)), G("input", o, (e) => C(H(t).key, "availableHours", e.currentTarget.value)), G("input", c, (e) => C(H(t).key, "publicLabel", e.currentTarget.value)), G("click", l, () => T(H(t).key)), q(e, n);
		}), A(t), q(e, t);
	}, je = (e) => {
		q(e, as());
	};
	Y(ke, (e) => {
		H(_), U(() => H(_).length) ? e(Ae) : e(je, -1);
	}), A(Ee);
	var Me = L(Ee, 2), O = F(Me), Ne = L(O, 2), k = (e) => {
		var t = os(), n = F(t, !0);
		A(t), z(() => J(n, H(v))), q(e, t);
	};
	Y(Ne, (e) => {
		H(v) && e(k);
	}), A(Me), A(ae), A(ne), z((e) => {
		J(ie, `時區：${W(r()), U(() => r().timezone) ?? ""}`), ge = Z(he, 1, "", null, ge, { invalid: !(H(n) > 0) }), J(_e, `工作 ${e ?? ""} hr`);
	}, [() => (H(n), U(() => Number.isFinite(H(n)) ? H(n) : "—"))]), G("input", le, x), Si(le, () => H(u), (e) => P(u, e)), G("input", de, x), Si(de, () => H(d), (e) => P(d, e)), G("click", fe, () => {
		P(u, ""), x();
	}), G("input", be, x), Si(be, () => H(f), (e) => P(f, e)), G("input", Se, x), Si(Se, () => H(p), (e) => P(p, e)), G("input", we, x), Si(we, () => H(m), (e) => P(m, e)), G("click", Oe, w), G("click", O, te), q(e, ne), Ke();
}
wr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var ls = /* @__PURE__ */ K("<span class=\"time-risk-dot\"></span>"), us = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), ds = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>");
function fs(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = ds(), d = F(u), f = F(d, !0);
	A(d);
	var p = L(d, 2), m = (e) => {
		q(e, ls());
	};
	Y(p, (e) => {
		s() && e(m);
	});
	var h = L(p, 2), g = (e) => {
		q(e, us());
	};
	Y(h, (e) => {
		c() && e(g);
	}), A(u), z(() => {
		Z(u, 1, ai(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), J(f, o());
	}), G("click", u, function(...e) {
		l()?.apply(this, e);
	}), q(e, u);
}
wr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var ps = {
	"task-list": no,
	"status-overview": ma,
	"status-filters": fa,
	"project-progress": ea,
	"mode-toggle": Ji,
	"save-bar": sa,
	"add-control": Li,
	diagnostics: Ki,
	"scope-directory": ra,
	"theme-control": ho,
	"time-summary-button": fs,
	"time-dialog": ts,
	"time-settings": cs,
	"delivery-risk-preview": Hi,
	"delivery-save-confirmation": Wi
}, ms = {
	id: "svelte",
	regions: Object.keys(ps),
	mount(e, t, n) {
		let r = rn({ ...n });
		return {
			component: Ir(ps[e], {
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
		Br(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(ms);
//#endregion
