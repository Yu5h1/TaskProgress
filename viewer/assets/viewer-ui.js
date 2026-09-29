import { registerUiAdapter as e } from "./ui-host.js";
//#region node_modules/svelte/src/constants.js
var t = {}, n = Symbol("uninitialized"), r = "http://www.w3.org/1999/xhtml", i = "http://www.w3.org/2000/svg", a = Array.isArray, o = Array.prototype.indexOf, s = Array.prototype.includes, c = Array.from, l = Object.defineProperty, u = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyDescriptors, f = Object.prototype, p = Array.prototype, m = Object.getPrototypeOf, h = Object.isExtensible;
function g(e) {
	return typeof e == "function";
}
var _ = () => {};
function v(e) {
	return e();
}
function y(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function b() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var x = 1024, S = 2048, C = 4096, w = 8192, T = 16384, ee = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, E = 1 << 20, ie = 1 << 25, D = 65536, ae = 1 << 21, oe = 1 << 22, se = 1 << 23, ce = Symbol("$state"), le = Symbol("legacy props"), ue = Symbol(""), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), _e = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function ve() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function ye(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
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
var O = !1;
function Fe(e) {
	O = e;
}
var k;
function Ie(e) {
	if (e === null) throw Me(), t;
	return k = e;
}
function Le() {
	return Ie(/* @__PURE__ */ _n(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ _n(k) !== null) throw Me(), t;
		k = e;
	}
}
function Re(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ _n(n);
		k = n;
	}
}
function ze(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ _n(n);
		e && n.remove(), n = i;
	}
}
function Be(e) {
	if (!e || e.nodeType !== 8) throw Me(), t;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ve(e) {
	return e === this.v;
}
function He(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ue(e) {
	return !He(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var We = !1;
function Ge() {
	We = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ke = null;
function qe(e) {
	Ke = e;
}
function Je(e, t = !1, n) {
	Ke = {
		p: Ke,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: V,
		l: We && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ye(e) {
	var t = Ke, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) On(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ke = t.p, e ?? {};
}
function Xe() {
	return !We || Ke !== null && Ke.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ze = [];
function Qe() {
	var e = Ze;
	Ze = [], y(e);
}
function $e(e) {
	if (Ze.length === 0 && !Ft) {
		var t = Ze;
		queueMicrotask(() => {
			t === Ze && Qe();
		});
	}
	Ze.push(e);
}
function et() {
	for (; Ze.length > 0;) Qe();
}
function tt(e) {
	var t = V;
	if (t === null) return B.f |= se, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	nt(e, t);
}
function nt(e, t) {
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
var rt = ~(S | C | x);
function it(e, t) {
	e.f = e.f & rt | t;
}
function at(e) {
	e.f & 512 || e.deps === null ? it(e, x) : it(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function ot(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= D, ot(t.deps));
}
function st(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ot(e.deps), it(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ct = !1;
function lt(e) {
	var t = ct;
	try {
		return ct = !1, [e(), ct];
	} finally {
		ct = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function ut(e) {
	O && /* @__PURE__ */ gn(e) !== null && vn(e);
}
var dt = !1;
function ft() {
	dt || (dt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[he]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function pt(e) {
	var t = B, n = V;
	$n(null), er(null);
	try {
		return e();
	} finally {
		$n(t), er(n);
	}
}
function mt(e, t, n, r = n) {
	e.addEventListener(t, () => pt(n));
	let i = e[he];
	e[he] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ft();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ht(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		Tn() && (H(n), Pn(() => (t === 0 && (r = U(() => e(() => rn(n)))), t += 1, () => {
			$e(() => {
				--t, t === 0 && (r?.(), r = void 0, rn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var gt = ne | re;
function _t(e, t, n, r) {
	new vt(e, t, n, r);
}
var vt = class {
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
	#h = ht(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Fn(() => {
			if (O) {
				let e = this.#t;
				Le();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, gt), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = In(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		$e(r), t && (this.#s = In(() => {
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
			t = !0, n && Ae(), this.#s !== null && Un(this.#s, () => {
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
					nt(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = In(() => e(this.#e)), $e(() => {
			var e = this.#c = document.createDocumentFragment(), t = hn();
			e.append(t), this.#a = this.#S(() => In(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Un(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = In(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				qn(this.#a, e);
				let t = this.#n.pending;
				this.#o = In(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		st(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = Ke;
		er(this.#i), $n(this.#i), qe(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} catch (e) {
			return tt(e), null;
		} finally {
			er(t), $n(n), qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Un(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $e(() => {
			this.#d = !1, this.#m && tn(this.#m, this.#l);
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
		this.#a &&= (Bn(this.#a), null), this.#o &&= (Bn(this.#o), null), this.#s &&= (Bn(this.#s), null), O && (Ie(this.#t), Re(), Ie(ze()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return In(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return nt(e, this.#i.parent), null;
				}
			}));
		};
		$e(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				nt(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => nt(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function yt(e, t, n, r) {
	let i = Xe() ? Ct : j;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = bt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				nt(e, s);
			}
			xt();
		}
	}
	var d = St();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Tt(e))).then(u).catch((e) => nt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), xt();
	}) : f();
}
function bt() {
	var e = V, t = B, n = Ke, r = M;
	return function(i = !0) {
		er(e), $n(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function xt(e = !0) {
	er(null), $n(null), qe(null), e && M?.deactivate();
}
function St() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ct(e) {
	var t = 2 | S;
	return V !== null && (V.f |= re), {
		ctx: Ke,
		deps: null,
		effects: null,
		equals: Ve,
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
var wt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Tt(e, t, r) {
	let i = V;
	i === null && be();
	var a = void 0, o = Qt(n), s = !B, c = /* @__PURE__ */ new Set();
	return Nn(() => {
		var t = V, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(xt);
		} catch (e) {
			n.reject(e), xt();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = St();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(wt);
			else for (let e of c.values()) e.reject(wt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== wt && (r.activate(), t ? (o.f |= se, tn(o, t)) : (o.f & 8388608 && (o.f ^= se), tn(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), En(() => {
		for (let e of c) e.reject(wt);
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
	let t = /* @__PURE__ */ Ct(e);
	return t.equals = Ue, t;
}
function Et(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Bn(t[n]);
	}
}
function Dt(e) {
	var t, r = V, i = e.parent;
	if (!Xn && i !== null && e.v !== n && i.f & 24576) return je(), e.v;
	er(i);
	try {
		e.f &= ~D, Et(e), t = mr(e);
	} finally {
		er(r);
	}
	return t;
}
function Ot(e) {
	var t = Dt(e);
	if (!e.equals(t) && (e.wv = dr(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null))) {
		it(e, x);
		return;
	}
	Xn || (Nt === null ? at(e) : (Tn() || M?.is_fork) && Nt.set(e, t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && pt(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = _), gr(t, 0), Rn(t));
}
function At(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && _r(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var jt = null, M = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
	id = Bt++;
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
		jt === null ? jt = this : (jt.#n = this, this.#t = jt), jt = this;
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
			for (var r of n.d) it(r, S), t(r);
			for (r of n.m) it(r, C), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, zt++ > 1e3 && (this.#x(), Ut());
		for (let e of this.#u) this.#d.delete(e), it(e, S), this.schedule(e);
		for (let e of this.#d) it(e, C), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Lt = [], r = [], i = Rt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Jt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) qt(e, t);
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
		this.#r.clear(), Mt = this, Gt(r), Gt(n), Mt = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : fr(r) && (i & 16 && this.#d.add(r), _r(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), it(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) st(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Nt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, Nt = null;
	}
	flush() {
		try {
			It = !0, M = this, this.#g();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, M = null, Nt = null, Xt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(wt);
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
		this.#m || (this.#m = !0, $e(() => {
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
		return (this.#s ??= b()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!It && !Ft && $e(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		Nt = null;
	}
	schedule(e) {
		if (Pt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Lt !== null && t === V && (B === null || !(B.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= x;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? jt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft;
	Ft = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (et(), M === null) return n;
			M.flush();
		}
	} finally {
		Ft = t;
	}
}
function Ut() {
	try {
		Te();
	} catch (e) {
		nt(e, Pt);
	}
}
var Wt = null;
function Gt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && fr(r) && (Wt = /* @__PURE__ */ new Set(), _r(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Hn(r), Wt?.size > 0)) {
				Xt.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || _r(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	M.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), it(e, x);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	it(e, x);
	for (var t = e.first; t !== null;) Jt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Yt = /* @__PURE__ */ new Set(), Xt = /* @__PURE__ */ new Map(), Zt = !1;
function Qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ve,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t) {
	let n = Qt(e, t);
	return nr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = Ue), We && n && Ke !== null && Ke.l !== null && (Ke.l.s ??= []).push(r), r;
}
function en(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!Qn || B.f & 131072) && Xe() && B.f & 4325394 && (tr === null || !tr.has(e)) && ke(), tn(e, n ? on(t) : t, Rt);
}
function tn(e, t, n = null) {
	if (!e.equals(t)) {
		Xt.set(e, Xn ? t : e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Dt(t), Nt === null && at(t);
		}
		e.wv = dr(), an(e, S, n), Xe() && V !== null && V.f & 1024 && !(V.f & 96) && (ar === null ? or([e]) : ar.push(e)), !r.is_fork && Yt.size > 0 && !Zt && nn();
	}
	return t;
}
function nn() {
	Zt = !1;
	for (let e of Yt) {
		e.f & 1024 && it(e, C);
		let t;
		try {
			t = fr(e);
		} catch {
			t = !0;
		}
		t && _r(e);
	}
	Yt.clear();
}
function rn(e) {
	P(e, e.v + 1);
}
function an(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Xe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & S) === 0;
			if (l && it(s, t), c & 131072) Yt.add(s);
			else if (c & 2) {
				var u = s;
				Nt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= D), an(u, C, n));
			} else if (l) {
				var d = s;
				c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
			}
		}
	}
}
function on(e) {
	if (typeof e != "object" || !e || ce in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ $t(0), s = null, c = lr, l = (e) => {
		if (lr === c) return e();
		var t = B, n = lr;
		$n(null), ur(c);
		var r = e();
		return $n(t), ur(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ $t(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && De();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ $t(n.value, s);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ $t(n, s));
					r.set(t, e), rn(o);
				}
			} else P(i, n), rn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === ce) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ $t(on(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			if (t === ce) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ $t(a ? on(e[t]) : n, s)), r.set(t, i)), H(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ $t(n, s)), r.set(p + "", m)) : P(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ $t(void 0, s)), P(d, on(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => on(a));
				P(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				rn(o);
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
			Oe();
		}
	});
}
function sn(e) {
	try {
		if (typeof e == "object" && e && ce in e) return e[ce];
	} catch {}
	return e;
}
function cn(e, t) {
	return Object.is(sn(e), sn(t));
}
var ln, un, dn, fn, pn;
function mn() {
	if (ln === void 0) {
		ln = window, un = document, dn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		fn = u(t, "firstChild").get, pn = u(t, "nextSibling").get, h(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), h(n) && (n[me] = void 0);
	}
}
function hn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function gn(e) {
	return fn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function _n(e) {
	return pn.call(e);
}
function F(e, t) {
	if (!O) return /* @__PURE__ */ gn(e);
	var n = /* @__PURE__ */ gn(k);
	if (n === null) n = k.appendChild(hn());
	else if (t && n.nodeType !== 3) {
		var r = hn();
		return n?.before(r), Ie(r), r;
	}
	return t && xn(n), Ie(n), n;
}
function I(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ _n(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = hn();
			return k?.before(r), Ie(r), r;
		}
		xn(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ _n(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = hn();
			return r === null ? i?.after(a) : r.before(a), Ie(a), a;
		}
		xn(r);
	}
	return Ie(r), r;
}
function vn(e) {
	e.textContent = "";
}
function yn() {
	return !1;
}
function bn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function xn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function Sn(e) {
	V === null && (B === null && we(e), Ce()), Xn && Se(e);
}
function Cn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function wn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= w);
	var r = {
		ctx: Ke,
		deps: null,
		nodes: null,
		f: e | S | 512,
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
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			_r(r);
		} catch (e) {
			throw Bn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && Cn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Tn() {
	return B !== null && !Qn;
}
function En(e) {
	let t = wn(8, null);
	return it(t, x), t.teardown = e, t;
}
function Dn(e) {
	Sn("$effect");
	var t = V.f;
	if (!B && t & 32 && Ke !== null && !Ke.i) {
		var n = Ke;
		(n.e ??= []).push(e);
	} else return On(e);
}
function On(e) {
	return wn(4 | E, e);
}
function kn(e) {
	return Sn("$effect.pre"), wn(8 | E, e);
}
function An(e) {
	Vt.ensure();
	let t = wn(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Un(t, () => {
			Bn(t), n(void 0);
		}) : (Bn(t), n(void 0));
	});
}
function jn(e) {
	return wn(4, e);
}
function R(e, t) {
	var n = Ke, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Pn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				er(n.parent), U(t);
			} finally {
				er(n);
			}
		}
	});
}
function Mn() {
	var e = Ke;
	Pn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && it(n, C), fr(n) && _r(n), t.ran = !1;
		}
	});
}
function Nn(e) {
	return wn(oe | re, e);
}
function Pn(e, t = 0) {
	return wn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	yt(r, t, n, (t) => {
		wn(8, () => {
			e(...t.map(H));
		});
	});
}
function Fn(e, t = 0) {
	return wn(16 | t, e);
}
function In(e) {
	return wn(32 | re, e);
}
function Ln(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Xn, n = B;
		Zn(!0), $n(null);
		try {
			t.call(null);
		} finally {
			Zn(e), $n(n);
		}
	}
}
function Rn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && pt(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Bn(n, t), n = r;
	}
}
function zn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Bn(t), t = n;
	}
}
function Bn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Vn(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Rn(e, t && !n), gr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Ln(e), e.f ^= te, e.f |= T;
	var i = e.parent;
	i !== null && i.first !== null && Hn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Vn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ _n(e);
		e.remove(), e = n;
	}
}
function Hn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Un(e, t, n = !0) {
	var r = [];
	Wn(e, r, !0);
	var i = () => {
		n && Bn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Wn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= w;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Wn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Gn(e) {
	Kn(e, !0);
}
function Kn(e, t) {
	if (e.f & 8192) {
		e.f ^= w, e.f & 1024 || (it(e, S), Vt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Kn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function qn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ _n(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Jn = null, Yn = !1, Xn = !1;
function Zn(e) {
	Xn = e;
}
var B = null, Qn = !1;
function $n(e) {
	B = e;
}
var V = null;
function er(e) {
	V = e;
}
var tr = null;
function nr(e) {
	B !== null && (tr ??= /* @__PURE__ */ new Set()).add(e);
}
var rr = null, ir = 0, ar = null;
function or(e) {
	ar = e;
}
var sr = 1, cr = 0, lr = cr;
function ur(e) {
	lr = e;
}
function dr() {
	return ++sr;
}
function fr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~D), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (fr(a) && Ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && it(e, x);
	}
	return !1;
}
function pr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(tr !== null && tr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? pr(a, t, !1) : t === a && (n ? it(a, S) : a.f & 1024 && it(a, C), Kt(a));
	}
}
function mr(e) {
	var t = rr, n = ir, r = ar, i = B, a = tr, o = Ke, s = Qn, c = lr, l = e.f;
	rr = null, ir = 0, ar = null, B = l & 96 ? null : e, tr = null, qe(e.ctx), Qn = !1, lr = ++cr, e.ac !== null && (pt(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ae;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = e.deps, p = M?.is_fork;
		if (rr !== null) {
			var m;
			if (p || gr(e, ir), f !== null && ir > 0) for (f.length = ir + rr.length, m = 0; m < rr.length; m++) f[ir + m] = rr[m];
			else e.deps = f = rr;
			if (Tn() && e.f & 512) for (m = ir; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && ir < f.length && (gr(e, ir), f.length = ir);
		if (Xe() && ar !== null && !Qn && f !== null && !(e.f & 6146)) for (m = 0; m < ar.length; m++) pr(ar[m], e);
		if (i !== null && i !== e) {
			if (cr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = cr;
			if (t !== null) for (let e of t) e.rv = cr;
			ar !== null && (r === null ? r = ar : r.push(...ar));
		}
		return e.f & 8388608 && (e.f ^= se), d;
	} catch (e) {
		return tt(e);
	} finally {
		e.f ^= ae, rr = t, ir = n, ar = r, B = i, tr = a, qe(o), Qn = s, lr = c;
	}
}
function hr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (rr === null || !s.call(rr, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~D), c.v !== n && at(c), c.ac !== null && pt(() => {
			c.ac.abort(ge), c.ac = null, it(c, S);
		}), kt(c), gr(c, 0);
	}
}
function gr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) hr(e, n[r]);
}
function _r(e) {
	var t = e.f;
	if (!(t & 16384)) {
		it(e, x);
		var n = V, r = Yn;
		V = e, Yn = !(t & 96);
		try {
			t & 16777232 ? zn(e) : Rn(e), Ln(e);
			var i = mr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = sr;
		} finally {
			Yn = r, V = n;
		}
	}
}
async function vr() {
	await Promise.resolve(), Ht();
}
function H(e) {
	var t = !!(e.f & 2);
	if (Jn?.add(e), B !== null && !Qn && !(V !== null && V.f & 16384) && (tr === null || !tr.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < cr && (e.rv = cr, rr === null && n !== null && n[ir] === e ? ir++ : rr === null ? rr = [e] : rr.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Xn && Xt.has(e)) return Xt.get(e);
	if (t) {
		var i = e;
		if (Xn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || br(i)) && (a = Dt(i)), Xt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Qn && B !== null && (Yn || !!(B.f & 512)), c = (i.f & ee) === 0;
		fr(i) && (o && (i.f |= 512), Ot(i)), o && !c && (At(i), yr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function yr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (At(t), yr(t));
}
function br(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xt.has(t) || t.f & 2 && br(t)) return !0;
	return !1;
}
function U(e) {
	var t = Qn;
	try {
		return Qn = !0, e();
	} finally {
		Qn = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ce in e) xr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ce in n && xr(n);
		}
	}
}
function xr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			xr(e[n], t);
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
var Sr = Symbol("events"), Cr = /* @__PURE__ */ new Set(), wr = /* @__PURE__ */ new Set();
function Tr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || kr.call(t, e), !e.cancelBubble) return pt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? $e(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Er(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Tr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && En(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[Sr] ??= {})[e] = n;
}
function Dr(e) {
	for (var t = 0; t < e.length; t++) Cr.add(e[t]);
	for (var n of wr) n(e);
}
var Or = null;
function kr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Or = e;
	var o = 0, s = Or === e && e[Sr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Sr] = t;
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
		$n(null), er(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Sr]?.[r];
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
			e[Sr] = t, delete e.currentTarget, $n(d), er(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Ar = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function jr(e) {
	return Ar?.createHTML(e) ?? e;
}
function Mr(e) {
	var t = bn("template");
	return t.innerHTML = jr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Nr(e, t) {
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
		if (O) return Nr(k, null), k;
		i === void 0 && (i = Mr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ gn(i)));
		var t = r || dn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ gn(t), s = t.lastChild;
			Nr(o, s);
		} else Nr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Pr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return Nr(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ gn(Mr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ gn(e);) o.appendChild(/* @__PURE__ */ gn(e));
			else o = /* @__PURE__ */ gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ gn(t), r = t.lastChild;
			Nr(n, r);
		} else Nr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Fr(e, t) {
	return /* @__PURE__ */ Pr(e, t, "svg");
}
function Ir(e = "") {
	if (!O) {
		var t = hn(e + "");
		return Nr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? xn(n) : (n.before(n = hn()), Ie(n)), Nr(n, n), n;
}
function Lr() {
	if (O) return Nr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = hn();
	return e.append(t, n), Nr(t, n), e;
}
function q(e, t) {
	if (O) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Le();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Rr = ["touchstart", "touchmove"];
function zr(e) {
	return Rr.includes(e);
}
var Br = [
	"textarea",
	"script",
	"style",
	"title"
];
function Vr(e) {
	return Br.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function Hr(e, t) {
	return Wr(e, t);
}
var Ur = /* @__PURE__ */ new Map();
function Wr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	mn();
	var u = void 0, d = An(() => {
		var s = r ?? n.appendChild(hn());
		_t(s, { pending: () => {} }, (n) => {
			Je({});
			var r = Ke;
			if (o && (r.c = o), a && (i.$$events = a), O && Nr(n, null), u = e(n, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Me(), t;
			Ye();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = zr(r);
					for (let e of [n, document]) {
						var a = Ur.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ur.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, kr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(Cr)), wr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Ur.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, kr), t.delete(e), t.size === 0 && Ur.delete(r)) : t.set(e, i);
			}
			wr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Gr.set(u, d), u;
}
var Gr = /* @__PURE__ */ new WeakMap();
function Kr(e, t) {
	let n = Gr.get(e);
	return n ? (Gr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var qr = class {
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
			if (n) Gn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Gn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Bn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						qn(r, t), t.append(hn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Bn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Un(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Bn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = yn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = hn();
			i.append(a), this.#n.set(e, {
				effect: In(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, In(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
function Jr(e) {
	Ke === null && ye("onMount"), We && Ke.l !== null ? Xr(Ke).m.push(e) : Dn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function Yr(e) {
	Ke === null && ye("onDestroy"), Jr(() => () => U(e));
}
function Xr(e) {
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
	O && (r = k, Le());
	var i = new qr(e), a = n ? ne : 0;
	function o(e, t) {
		if (O) {
			var n = Be(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ze();
				Ie(a), i.anchor = a, Fe(!1), i.ensure(e, t), Fe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Fn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Zr = Symbol("NaN");
function Qr(e, t, n) {
	O && Le();
	var r = new qr(e), i = !Xe();
	Fn(() => {
		var e = t();
		e !== e && (e = Zr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function $r(e, t) {
	return t;
}
function ei(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Un(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					ti(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			vn(d), d.append(u), e.items.clear();
		}
		ti(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function ti(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, qn(a, document.createDocumentFragment())) : Bn(t[i], n);
	}
}
var ni;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = O ? Ie(/* @__PURE__ */ gn(u)) : u.appendChild(hn());
	}
	O && Le();
	var d = null, f = /* @__PURE__ */ j(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, ii(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, oi(d, null, s)) : Gn(d) : Un(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Fn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			O && Be(s) === "[!" != (e === 0) && (s = ze(), Ie(s), Fe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = yn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (s = k, a = !0, Fe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && tn(S.v, b), S.i && tn(S.i, y), v && u.unskip_effect(S.e)) : (S = ai(l, h ? s : ni ??= hn(), b, x, y, i, t, n), h || (S.e.f |= ie), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = In(() => o(s)) : (d = In(() => o(ni ??= hn())), d.f |= ie)), e > c.size && xe("", "", ""), O && e > 0 && Ie(ze()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Fe(!0), H(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, O && (s = k);
}
function ri(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function ii(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ri(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Gn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ie, _ === l) oi(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), si(e, d, _), si(e, _, y), oi(_, y, n), d = _, p = [], m = [], l = ri(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) oi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					si(e, S.prev, C.next), si(e, d, S), si(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), oi(_, l, n), si(e, _.prev, _.next), si(e, _, d === null ? e.effect.first : d.next), si(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = ri(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = ri(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (ti(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ri(l.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			ei(e, w, ee);
		}
	}
	a && $e(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ai(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
	return {
		v: c,
		i: l,
		e: In(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function oi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ _n(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function si(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function ci(e, t, n, r, i) {
	O && Le();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function li(e, t, n, r, a, o) {
	let s = O;
	O && Le();
	var c = null;
	O && k.nodeType === 1 && (c = k, Le());
	var l = O ? k : e, u = new qr(l, !1);
	Fn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = O ? c : bn(e, o), Nr(c, c), r) {
					var n = null;
					O && Vr(e) && c.append(n = document.createComment(""));
					var i = O ? /* @__PURE__ */ gn(c) : c.appendChild(hn());
					O && (i === null ? Fe(!1) : Ie(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			O && Ie(t);
		}), () => {};
	}, ne), En(() => {}), s && (Fe(!0), Ie(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ui(e, t, n) {
	jn(() => {
		var r = U(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Pn(() => {
				var e = n();
				W(e), i && He(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function di(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = di(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function fi() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = di(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function pi(e) {
	return typeof e == "object" ? fi(e) : e ?? "";
}
var mi = [..." 	\n\r\f\xA0\v﻿"];
function hi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || mi.includes(r[o - 1])) && (s === r.length || mi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function gi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function _i(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function vi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(_i)), i && c.push(...Object.keys(i).map(_i));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = _i(e.substring(l, u).trim());
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
		return r && (n += gi(r)), i && (n += gi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[fe];
	if (O || o !== n || o === void 0) {
		var s = hi(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function yi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function bi(e, t, n, r) {
	var i = e[pe];
	if (O || i !== t) {
		var a = vi(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (yi(e, n?.[0], r[0]), yi(e, n?.[1], r[1], "important")) : yi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function xi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Ne();
		for (var r of e.options) r.selected = t.includes(wi(r));
		return;
	}
	for (r of e.options) if (cn(wi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Si(e) {
	var t = new MutationObserver(() => {
		"__value" in e && xi(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), En(() => {
		t.disconnect();
	});
}
function Ci(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	mt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), wi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && wi(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), jn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if (xi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = wi(s), n(a));
		}
		e.__value = a, i = !1;
	}), Si(e);
}
function wi(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ti = Symbol("is custom element"), Ei = Symbol("is html"), Di = _e ? "link" : "LINK", Oi = _e ? "progress" : "PROGRESS";
function ki(e) {
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
		e[he] = n, $e(n), ft();
	}
}
function Ai(e, t) {
	var n = Mi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Oi) && (e.value = t ?? "");
}
function ji(e, t) {
	var n = Mi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = Mi(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Di) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Pi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Mi(e) {
	return e[de] ??= {
		[Ti]: e.nodeName.includes("-"),
		[Ei]: e.namespaceURI === r
	};
}
var Ni = /* @__PURE__ */ new Map();
function Pi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ni.get(t);
	if (n) return n;
	Ni.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	mt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Li(e) ? Ri(a) : a, n(a), M !== null && r.add(M), await vr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(Li(e) ? Ri(e.value) : e.value), M !== null && r.add(M)), Pn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		Li(e) && n === Ri(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Ii(e, t, n = t) {
	mt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), Pn(() => {
		e.checked = !!t();
	});
}
function Li(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ri(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function zi(e, t, n) {
	var r = u(e, t);
	r && r.set && (e[t] = n, En(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Bi(e, t) {
	return e === t || e?.[ce] === t;
}
function Vi(e = {}, t, n, r) {
	var i = Ke.r, a = V;
	return jn(() => {
		var o, s;
		return Pn(() => {
			o = s, s = r?.() || [], U(() => {
				Bi(n(...s), e) || (t(e, ...s), o && Bi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Bi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Hi(e = !1) {
	let t = Ke, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Ct(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && kn(() => {
		Ui(t, r), y(n.b);
	}), Dn(() => {
		let e = U(() => n.m.map(v));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Dn(() => {
		Ui(t, r), y(n.a);
	});
}
function Ui(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
var Wi = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (g(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			g(i) && (i = i());
			let a = u(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (g(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = u(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === ce || t === le) return !1;
		for (let n of e.props) if (g(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (g(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function Gi(...e) {
	return new Proxy({ props: e }, Wi);
}
function $(e, t, n, r) {
	var i = !We || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ Ct(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = ce in e || le in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = lt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ee(t), f(m)));
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
	var v = !1, y = (n & 1 ? Ct : j)(() => (v = !1, g()));
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? on(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Xn && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ge();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ki = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), qi = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Ji = /* @__PURE__ */ K("<option> </option>"), Yi = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), Xi = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Zi = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Qi = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function $i(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 4), te = /* @__PURE__ */ N();
	async function ne() {
		await vr(), H(te)?.focus?.();
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
	}), Mn(), Hi();
	var ie = Lr(), D = I(ie), ae = (e) => {
		var t = Ki();
		z(() => {
			Z(t, 1, pi(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, oe = (e) => {
		var t = Qi(), r = F(t);
		ki(r), Vi(r, (e) => P(te, e), () => H(te));
		var c = L(r, 2), l = (e) => {
			var t = qi();
			ut(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Fi(t, () => H(T), (e) => P(T, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Ji(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), A(d);
		var f = L(d, 2), p = (e) => {
			var t = Yi(), n = F(t, !0);
			A(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = Xi(), n = I(t), r = F(n, !0);
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
			var t = Zi(), n = I(t), r = F(n, !0);
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
			Z(t, 1, pi(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), Er("submit", t, re), G("keydown", t, E), Fi(r, () => H(w), (e) => P(w, e)), Ci(d, () => H(ee), (e) => P(ee, e)), q(e, t);
	};
	Y(D, (e) => {
		l() ? e(oe, -1) : e(ae);
	}), q(e, ie), Ye();
}
Dr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var ea = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), ta = /* @__PURE__ */ K("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), na = /* @__PURE__ */ K("<div class=\"assessment-metric-grid\"></div>");
function ra(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = na();
	X(r, 5, n, (e) => e.label, (e, t) => {
		var n = ta(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a), s = (e) => {
			var n = ea();
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
var ia = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), aa = /* @__PURE__ */ K("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function oa(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = aa(), a = F(i), o = F(a), s = (e) => {
		var t = ia();
		z(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), q(e, t);
	};
	Y(o, (e) => {
		r() && e(s);
	});
	var c = L(o);
	A(a), ci(L(a, 2), t, "default", {}, null), A(i), z(() => J(c, ` ${n() ?? ""}`)), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var sa = /* @__PURE__ */ K("<span class=\"assessment-readout-summary\"> </span>"), ca = /* @__PURE__ */ K("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function la(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = ca(), o = F(a), s = F(o, !0);
	A(o);
	var c = L(o, 2);
	ci(F(c), t, "badges", {}, null), A(c);
	var l = L(c, 2), u = (e) => {
		var t = sa(), n = F(t, !0);
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
var ua = /* @__PURE__ */ K("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function da(e, t) {
	Je(t, !1);
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
	Hi();
	var _ = Lr(), v = I(_), y = (e) => {
		var n = ua(), l = F(n), d = F(l), f = F(d), _ = F(f, !0);
		A(f);
		var v = L(f, 2), y = F(v, !0);
		A(v), A(d);
		var b = L(d, 2);
		A(l), ci(L(l, 2), t, "default", {}, null), A(n), Vi(n, (e) => P(u, e), () => H(u)), ui(n, (e) => p?.(e)), z(() => {
			Z(n, 1, pi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), J(_, a()), Q(v, "id", s()), J(y, o()), Q(b, "aria-label", c());
		}), Er("close", n, m), G("click", n, g), G("click", b, h), q(e, n);
	};
	Y(v, (e) => {
		n() && e(y);
	}), q(e, _), Ye();
}
Dr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var fa = /* @__PURE__ */ K("<span> </span>"), pa = /* @__PURE__ */ K("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ma = /* @__PURE__ */ K("<!> <!> <!>", 1), ha = /* @__PURE__ */ K("<span slot=\"badges\"> </span>"), ga = /* @__PURE__ */ K("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), _a = /* @__PURE__ */ K("<div class=\"cost-dialog-content\"><!></div>");
function va(e, t) {
	Je(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	Hi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
		da(e, {
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
				var n = _a(), i = F(n), a = (e) => {
					var t = ma(), n = I(t);
					la(n, {
						label: "估算成本",
						get value() {
							return W(s()), U(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Lr();
							X(I(n), 1, () => (W(s()), U(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = fa(), r = F(n, !0);
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
						ra(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						oa(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								q(e, pa());
							},
							$$slots: { default: !0 }
						});
					};
					Y(i, (e) => {
						W(s()), U(() => !s().humanConfirmed) && e(a);
					}), q(e, t);
				}, c = (e) => {
					var t = ma(), n = I(t);
					la(n, {
						label: "估算總額",
						get value() {
							return W(o()), U(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ha(), r = F(n, !0);
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
						ra(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						oa(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								q(e, ga());
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
	Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var ya = /* @__PURE__ */ K("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), ba = /* @__PURE__ */ K("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), xa = /* @__PURE__ */ K("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Sa = /* @__PURE__ */ K("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Ca(e, t) {
	Je(t, !1);
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
	Hi();
	var c = Sa(), l = F(c), u = F(l), d = L(F(u), 2), f = F(d, !0);
	A(d), A(u), Re(2), A(l);
	var p = L(l, 2), m = (e) => {
		var t = ya(), r = F(t), i = L(F(r), 2), o = F(i, !0);
		A(i), A(r);
		var s = L(r, 2), c = L(F(s), 2), l = F(c, !0);
		A(c), A(s), A(t), z((e, t) => {
			J(o, e), J(l, t);
		}, [() => (W(n()), U(() => a(n().before))), () => (W(n()), U(() => a(n().after)))]), q(e, t);
	}, h = (e) => {
		q(e, ba());
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
		var t = xa(), r = L(F(t), 1, !0);
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
	]), q(e, c), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var wa = /* @__PURE__ */ K("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Ta(e, t) {
	Je(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N();
	Jr(() => {
		H(o).showModal(), H(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Hi();
	var u = wa(), d = L(F(u), 2);
	Ca(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = L(d, 2), p = F(f);
	Vi(p, (e) => P(s, e), () => H(s));
	var m = L(p, 2), h = F(m, !0);
	A(m), A(f), A(u), Vi(u, (e) => P(o, e), () => H(o)), z(() => {
		p.disabled = r(), m.disabled = r(), J(h, r() ? "正在儲存…" : "確認儲存");
	}), Er("cancel", u, c), G("keydown", u, l), G("click", p, function(...e) {
		i()?.apply(this, e);
	}), G("click", m, function(...e) {
		a()?.apply(this, e);
	}), q(e, u), Ye();
}
Dr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var Ea = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function Da(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Lr();
	X(I(i), 1, n, $r, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).level ?? "error")));
		var i = Ea(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s, !0);
		A(s), A(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Oa = /* @__PURE__ */ K("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function ka(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), Mn(), Hi();
	var d = Oa(), f = F(d, !0);
	A(d), z(() => {
		Q(d, "aria-pressed", H(n)), Q(d, "aria-label", `目前為${H(r)}；按下切換到${H(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(f, H(r));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), Ye();
}
Dr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Aa = /* @__PURE__ */ K("<span></span>"), ja = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), Ma = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>"), Na = /* @__PURE__ */ K("<div role=\"toolbar\"></div>");
function Pa(e, t) {
	Je(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = !1, u = null, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N();
	async function p() {
		let e = H(d);
		P(d, null), await vr(), [...H(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	}), Mn(), Hi();
	var E = Na();
	X(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).sortable !== !1)));
		var r = Ma(), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i, 2), l = (e) => {
			var n = Aa();
			z(() => Z(n, 1, (H(t), U(() => `time-risk-dot ${H(t).dotClass ?? ""}`)))), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).showDot) && e(l);
		});
		var u = L(o, 2), d = (e) => {
			q(e, ja());
		};
		Y(u, (e) => {
			H(t), U(() => H(t).showChevron) && e(d);
		}), A(r), z((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (H(t), U(() => H(t).id))), Q(r, "data-reorder-capsule", H(n) ? "true" : null), Q(r, "aria-pressed", (H(t), U(() => H(t).pressed ?? null))), Q(r, "aria-label", (H(t), U(() => H(t).ariaLabel ?? H(t).label))), Q(r, "aria-keyshortcuts", H(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (H(t), U(() => H(t).title ?? null))), r.disabled = (H(t), U(() => H(t).disabled ?? !1)), Q(r, "draggable", H(n)), J(a, (H(t), U(() => H(t).label)));
		}, [() => (H(t), W(H(n)), H(s), H(c), U(() => `capsule-button ${H(t).className ?? ""} ${H(n) ? "capsule-sortable" : ""} ${H(s) === H(t).id ? "capsule-dragging" : ""} ${h(H(t).id, H(c))}`))]), G("click", r, (e) => b(H(t), e)), G("keydown", r, function(...e) {
			(H(n) ? (e) => x(H(t), e) : null)?.apply(this, e);
		}), Er("dragstart", r, function(...e) {
			(H(n) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), Er("dragover", r, function(...e) {
			(H(n) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), Er("dragleave", r, function(...e) {
			(H(n) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), Er("drop", r, function(...e) {
			(H(n) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), Er("dragend", r, function(...e) {
			(H(n) ? ee : null)?.apply(this, e);
		}), G("pointerdown", r, function(...e) {
			(H(n) ? (e) => te(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", r, function(...e) {
			(H(n) ? (e) => ne(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), Er("pointercancel", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), q(e, r);
	}), A(E), Vi(E, (e) => P(f, e), () => H(f)), z(() => {
		Z(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), q(e, E), Ye();
}
Dr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function Fa(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	R(() => W(a()), () => {
		P(n, new Map(a().map((e, t) => [e, t])));
	}), R(() => (W(i()), H(n), W(a())), () => {
		P(r, [...i()].sort((e, t) => (H(n).get(e.id) ?? a().length) - (H(n).get(t.id) ?? a().length)));
	}), Mn(), Hi();
	var u = Lr(), d = I(u), f = (e) => {
		Pa(e, {
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
	}), q(e, u), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Ia = /* @__PURE__ */ K("<i></i>"), La = /* @__PURE__ */ K("<div role=\"img\"></div>"), Ra = /* @__PURE__ */ K("<progress max=\"100\"></progress>");
function za(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var f = Lr(), p = I(f), m = (e) => {
		var t = La();
		X(t, 5, () => H(r), $r, (e, t) => {
			var n = Ia();
			z((e) => Z(n, 1, e), [() => (H(t), U(() => `progress-cell${u(H(t))}`))]), q(e, n);
		}), A(t), z(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), q(e, t);
	}, h = (e) => {
		var t = Ra();
		z(() => {
			Z(t, 1, `progress-meter ${c()}`), Ai(t, H(n)), Q(t, "aria-label", s());
		}), q(e, t);
	};
	Y(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), q(e, f), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Ba = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Va(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	R(() => (W(r()), W(i()), W(a()), W(o())), () => {
		P(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), Mn(), Hi();
	var s = Ba(), c = I(s), l = F(c), u = F(l);
	A(l), A(c);
	var d = L(c, 2);
	{
		let e = /* @__PURE__ */ j(() => r() / 100);
		za(d, {
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
	z(() => J(u, `整體約 ${r() ?? ""}%`)), q(e, s), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var Ha = /* @__PURE__ */ K("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ua = /* @__PURE__ */ K("<p class=\"hero-summary\"> </p>");
function Wa(e, t) {
	Je(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	Hi();
	var c = Lr(), l = I(c), u = (e) => {
		var t = Ha();
		ut(t), z(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Ai(t, i());
		}), G("input", t, (e) => s()(e.currentTarget.value)), q(e, t);
	}, d = (e) => {
		var t = Ua(), r = F(t, !0);
		A(t), z(() => J(r, n())), q(e, t);
	};
	Y(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), q(e, c), Ye();
}
Dr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Ga = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), Ka = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function qa(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Lr();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = Ka(), i = F(n), a = F(i, !0);
		A(i);
		var o = L(i, 2), s = (e) => {
			var n = Ga(), i = F(n, !0);
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
var Ja = /* @__PURE__ */ K("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ya = /* @__PURE__ */ K("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Xa = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Za(e, t) {
	Je(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Hi();
	var y = Xa(), b = I(y), x = F(b, !0);
	A(b);
	var S = L(b, 2), C = F(S), w = F(C, !0);
	A(C);
	var T = L(C, 2), ee = F(T, !0);
	A(T), A(S);
	var te = L(S, 2), ne = (e) => {
		var t = Ja(), a = F(t, !0);
		A(t), z(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), J(a, i());
		}), G("click", t, () => r()(!n())), q(e, t);
	};
	Y(te, (e) => {
		r() && e(ne);
	});
	var re = L(te, 2), E = (e) => {
		var t = Ya(), n = I(t), r = F(n, !0);
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
	}), q(e, y), Ye();
}
Dr(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var Qa = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function $a(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	R(() => (W(u()), W(p()), W(l())), () => {
		P(n, {
			id: Qa,
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
		P(i, s().length > 0 ? s() : [Qa, ...o().map((e) => e.id)]);
	}), R(() => (H(i), H(n), H(r), W(c()), W(p())), () => {
		P(a, H(i).map((e) => e === "__default__" ? H(n) : H(r).get(e)).filter(Boolean).map((e) => e === H(n) ? e : v(e, c(), p())));
	}), Mn(), Hi();
	{
		let t = /* @__PURE__ */ j(() => `filter-strip ${f()}`);
		Pa(e, {
			get items() {
				return H(a);
			},
			get className() {
				return H(t);
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
	Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var eo = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function to(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var o = Lr();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = eo(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a, !0);
		A(a), A(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), Ye();
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
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var io = /* @__PURE__ */ Fr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), ao = /* @__PURE__ */ Fr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), oo = /* @__PURE__ */ Fr("<path d=\"M3 3l18 18\"></path>"), so = /* @__PURE__ */ Fr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function co(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = so(), a = F(i), o = (e) => {
		q(e, io());
	}, s = (e) => {
		var t = ao();
		Re(), q(e, t);
	};
	Y(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = L(a), l = (e) => {
		q(e, oo());
	};
	Y(c, (e) => {
		r() && e(l);
	}), A(i), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var lo = /* @__PURE__ */ K("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), uo = /* @__PURE__ */ K("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function fo(e, t) {
	Je(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Hi();
	var l = uo(), u = I(l);
	let d;
	var f = F(u), p = F(f), m = F(p, !0);
	A(p), A(f);
	var h = L(f, 2), g = (e) => {
		var t = lo(), n = F(t);
		{
			let e = /* @__PURE__ */ j(() => !r());
			co(n, { get closed() {
				return H(e);
			} });
		}
		A(t), z(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), G("click", t, () => i()(!r())), q(e, t);
	};
	Y(h, (e) => {
		n() && e(g);
	}), ci(L(h, 2), t, "header", {}, null), A(u);
	var _ = L(u, 2);
	ci(F(_), t, "default", {}, null), A(_), z(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), J(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), G("click", f, () => c()(!a())), q(e, l), Ye();
}
Dr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var po = /* @__PURE__ */ K("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span>", 1), mo = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), ho = /* @__PURE__ */ K("<!> <!>", 1), go = /* @__PURE__ */ K("<li> </li>"), _o = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), vo = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), yo = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), bo = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), xo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), So = /* @__PURE__ */ K("<p> </p>"), Co = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), wo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), To = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), Eo = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Do = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function Oo(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var c = Lr(), l = I(c), u = (e) => {
		var t = Lr();
		li(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = ho(), o = I(n);
			li(o, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = ho(), i = I(n), o = (e) => {
					var t = po(), n = L(I(t), 2), i = F(n, !0);
					A(n), z(() => J(i, H(r))), q(e, t);
				};
				Y(i, (e) => {
					H(r) && e(o);
				});
				var s = L(i, 2), c = (e) => {
					q(e, mo());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), q(t, n);
			});
			var c = L(o, 2), l = (e) => {
				var t = Do(), n = L(F(t), 2), r = (e) => {
					var t = _o(), n = L(F(t), 2);
					X(n, 5, () => H(i), $r, (e, t) => {
						var n = go(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), o = (e) => {
					var t = vo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().blockers)), $r, (e, t) => {
						var n = go(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(a, (e) => {
					W(s()), U(() => s().blockers?.length) && e(o);
				});
				var c = L(a, 2), l = (e) => {
					var t = xo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().decisions)), $r, (e, t) => {
						var n = bo(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = (e) => {
							var n = yo(), r = F(n, !0);
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
					var t = wo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().routes)), $r, (e, t) => {
						var n = Co(), r = F(n), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r);
						var c = L(r, 2), l = (e) => {
							var n = So(), r = F(n, !0);
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
					var t = Eo(), n = L(F(t), 2), r = F(n);
					A(n);
					var i = L(n, 2), a = (e) => {
						var t = So(), n = F(t);
						A(t), z(() => J(n, `Worktree: ${W(s()), U(() => s().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(s()), U(() => s().claim.worktree) && e(a);
					});
					var o = L(i, 2), c = (e) => {
						var t = To();
						X(t, 5, () => (W(s()), U(() => s().claim.source_paths)), $r, (e, t) => {
							var n = yo(), r = F(n, !0);
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
	}), q(e, c), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var ko = /* @__PURE__ */ K("<option> </option>"), Ao = /* @__PURE__ */ K("<select class=\"inline-priority-select\"></select>"), jo = /* @__PURE__ */ K("<span> </span>"), Mo = /* @__PURE__ */ K("<span class=\"item-row-priority\"><!></span>"), No = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), Po = /* @__PURE__ */ K("<span class=\"spike-item-title\"> </span>"), Fo = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select>"), Io = /* @__PURE__ */ K("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), Lo = /* @__PURE__ */ K("<li><span aria-hidden=\"true\"> </span> <!> <span class=\"item-row-description\"><!></span> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function Ro(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var S = Lo();
	let C;
	var w = F(S), T = F(w, !0);
	A(w);
	var ee = L(w, 2), te = (e) => {
		var t = Mo(), i = F(t), a = (e) => {
			var t = Ao();
			X(t, 5, () => (W(d()), U(() => d().levels)), (e) => e.value, (e, t) => {
				var n = ko(), r = F(n, !0);
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
			})), Ci(t, () => H(_), (e) => P(_, e)), q(e, t);
		}, o = (e) => {
			var t = jo(), i = F(t, !0);
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
		var t = No();
		ki(t), z(() => {
			Q(t, "aria-label", (W(l()), U(() => `編輯子項目：${l().title}`))), Q(t, "title", (W(l()), U(() => l().title))), Ai(t, (W(l()), U(() => l().title)));
		}), G("input", t, (e) => f()({
			type: "set-item-field",
			taskId: s(),
			field: c(),
			itemId: l().id,
			property: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, ie = (e) => {
		var t = Po(), n = F(t, !0);
		A(t), z(() => {
			Q(t, "title", (W(l()), U(() => l().title))), J(n, (W(l()), U(() => l().title)));
		}), q(e, t);
	};
	Y(re, (e) => {
		u() ? e(E) : e(ie, -1);
	}), A(ne);
	var D = L(ne, 2), ae = F(D);
	Fa(F(ae), {
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
		var t = Fo();
		X(t, 5, v, (e) => e.value, (e, t) => {
			var n = ko(), r = F(n, !0);
			A(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), A(t), z(() => Q(t, "aria-label", (W(l()), U(() => `設定「${l().title}」的狀態`)))), G("change", t, () => b(H(y))), Ci(t, () => H(y), (e) => P(y, e)), q(e, t);
	}, le = (e) => {
		var t = jo(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, (H(a), U(() => `item-status-capsule status-${H(a).tone}`))), J(n, H(o));
		}), q(e, t);
	};
	Y(se, (e) => {
		u() ? e(ce) : e(le, -1);
	}), A(oe);
	var ue = L(oe, 2), de = (e) => {
		var t = Io(), n = F(t);
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
	}), q(e, S), Ye();
}
Dr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var zo = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Bo = /* @__PURE__ */ K("<p class=\"task-summary\"> </p>"), Vo = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Ho = /* @__PURE__ */ K("<option> </option>"), Uo = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Wo = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Go = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), Ko = /* @__PURE__ */ K("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), qo = /* @__PURE__ */ K("<a> </a>"), Jo = /* @__PURE__ */ K("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), Yo = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Xo = /* @__PURE__ */ K("<h3> </h3>"), Zo = /* @__PURE__ */ K("<span> </span>"), Qo = /* @__PURE__ */ K("<div class=\"task-module-totals\"></div>"), $o = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><!> <div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), es = /* @__PURE__ */ K("<article><!></article>");
function ts(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "decisionCard", 8, null), p = $(t, "progress", 8), m = $(t, "editing", 8), h = $(t, "policy", 8), g = $(t, "onCommand", 8), _ = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let v = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), y = $(t, "onModuleActivate", 8, () => {}), b = $(t, "moduleOrder", 24, () => ["time"]), x = $(t, "onModuleReorder", 8, () => {}), S = $(t, "statusOrder", 24, () => ["done", "planned"]), C = $(t, "moduleTotals", 24, () => []), w = [
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
	], T = /* @__PURE__ */ N(!1), ee = /* @__PURE__ */ N(""), te = /* @__PURE__ */ N(h().creationDefaultValue), ne = /* @__PURE__ */ N(""), re = /* @__PURE__ */ N(d().status), E = /* @__PURE__ */ N(h().normalize(d().priority, h().fallbackValue));
	function ie() {
		P(T, !1), P(ee, ""), P(te, h().creationDefaultValue), P(ne, "");
	}
	function D() {
		let e = _()(H(ee), Number(H(te)));
		P(ne, e.error), H(ne) || ie();
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
	}), R(() => (H(n), W(S())), () => {
		P(r, [...H(n)].sort((e, t) => {
			let n = S().indexOf(e.status), r = S().indexOf(t.status);
			return (n < 0 ? S().length : n) - (r < 0 ? S().length : r);
		}));
	}), R(() => (W(h()), W(d())), () => {
		P(i, h().metadata(d().priority));
	}), R(() => W(d()), () => {
		P(re, d().status);
	}), R(() => (W(h()), W(d())), () => {
		P(E, h().normalize(d().priority, h().fallbackValue));
	}), R(() => W(d()), () => {
		P(a, w.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), R(() => (W(m()), H(T)), () => {
		!m() && H(T) && ie();
	}), Mn(), Hi();
	var ae = es(), oe = F(ae);
	{
		let e = /* @__PURE__ */ j(() => (W(d()), U(() => `task-body-${d().id}`)));
		fo(oe, {
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
				var n = Ko(), i = I(n), a = (e) => {
					var t = zo();
					ut(t), z(() => Ai(t, (W(d()), U(() => d().summary)))), G("input", t, (e) => g()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), q(e, t);
				}, o = (e) => {
					var t = Bo(), n = F(t, !0);
					A(t), z(() => J(n, (W(d()), U(() => d().summary)))), q(e, t);
				};
				Y(i, (e) => {
					m() ? e(a) : e(o, -1);
				});
				var s = L(i, 2);
				{
					let e = /* @__PURE__ */ j(() => (W(d()), U(() => d().developer ?? null)));
					Oo(s, { get developer() {
						return H(e);
					} });
				}
				var c = L(s, 2), l = F(c);
				X(l, 1, () => H(r), (e) => e.status, (e, t) => {
					var n = Lr(), r = I(n), i = (e) => {
						var n = Vo(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2);
						X(a, 5, () => (H(t), U(() => H(t).items)), (e) => e.id, (e, n) => {
							{
								let r = /* @__PURE__ */ j(() => (W(v()), H(n), U(() => v().get(H(n).id) ?? [])));
								Ro(e, {
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
										return m();
									},
									get policy() {
										return h();
									},
									get onCommand() {
										return g();
									},
									get moduleCapsules() {
										return H(r);
									},
									get statuses() {
										return w;
									},
									get onModuleActivate() {
										return y();
									},
									get moduleOrder() {
										return b();
									},
									get onModuleReorder() {
										return x();
									}
								});
							}
						}), A(a), A(n), z(() => {
							Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title)));
						}), q(e, n);
					};
					Y(r, (e) => {
						H(t), W(m()), U(() => H(t).items.length || m()) && e(i);
					}), q(e, n);
				});
				var u = L(l, 2), f = F(u), p = (e) => {
					var t = Go(), n = F(t), r = (e) => {
						var t = Uo(), n = F(t);
						ki(n);
						var r = L(n, 2);
						X(r, 5, () => (W(h()), U(() => h().levels)), (e) => e.value, (e, t) => {
							var n = Ho(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(h()), H(t), U(() => h().format(H(t).value)))]), q(e, n);
						}), A(r);
						var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
						A(o), A(t), z(() => {
							Q(o, "hidden", !H(ne)), J(s, H(ne));
						}), G("keydown", n, (e) => {
							e.key === "Enter" && D(), e.key === "Escape" && ie();
						}), Fi(n, () => H(ee), (e) => P(ee, e)), Ci(r, () => H(te), (e) => P(te, e)), G("click", i, D), G("click", a, ie), q(e, t);
					}, i = (e) => {
						var t = Wo();
						z(() => Q(t, "aria-label", (W(d()), U(() => `在「${d().title}」新增子項目`)))), G("click", t, () => {
							P(T, !0);
						}), q(e, t);
					};
					Y(n, (e) => {
						H(T) ? e(r) : e(i, -1);
					}), A(t), q(e, t);
				};
				Y(f, (e) => {
					m() && e(p);
				}), A(u), A(c), q(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = $o(), r = F(n), i = (e) => {
						var t = qo(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "href", (W(f()), U(() => f().href))), Q(t, "title", (W(f()), U(() => f().error ?? "開啟決策項目"))), J(n, (W(f()), U(() => f().label)));
						}), q(e, t);
					};
					Y(r, (e) => {
						f() && e(i);
					});
					var o = L(r, 2), s = F(o), c = (e) => {
						var t = Jo(), n = F(t);
						X(n, 5, () => w, (e) => e.value, (e, t) => {
							var n = Ho(), r = F(n, !0);
							A(n);
							var i = {};
							z(() => {
								J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}), q(e, n);
						}), A(n);
						var r = L(n, 2);
						X(r, 5, () => (W(h()), U(() => h().levels)), (e) => e.value, (e, t) => {
							var n = Ho(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(h()), H(t), U(() => h().format(H(t).value)))]), q(e, n);
						}), A(r), A(t), z(() => {
							Q(n, "aria-label", (W(d()), U(() => `${d().title} 狀態`))), Q(r, "aria-label", (W(d()), U(() => `${d().title} 優先級`)));
						}), G("change", n, () => g()({
							type: "set-task-field",
							taskId: d().id,
							field: "status",
							value: H(re)
						})), Ci(n, () => H(re), (e) => P(re, e)), G("change", r, () => g()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(H(E))
						})), Ci(r, () => H(E), (e) => P(E, e)), q(e, t);
					};
					Y(s, (e) => {
						m() && e(c);
					});
					var l = L(s, 2), u = F(l), _ = (e) => {
						var t = Yo();
						ki(t), z(() => {
							Q(t, "id", (W(d()), U(() => `task-${d().id}-title`))), Ai(t, (W(d()), U(() => d().title)));
						}), G("input", t, (e) => g()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), q(e, t);
					}, v = (e) => {
						var t = Xo(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "id", (W(d()), U(() => `task-${d().id}-title`))), J(n, (W(d()), U(() => d().title)));
						}), q(e, t);
					};
					Y(u, (e) => {
						m() ? e(_) : e(v, -1);
					}), A(l);
					var y = L(l, 2), b = (e) => {
						var t = Qo();
						X(t, 5, C, (e) => e.id, (e, t) => {
							var n = Zo(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, (H(t), U(() => `task-module-total task-module-total-${H(t).id}`))), J(r, (H(t), U(() => H(t).label)));
							}), q(e, n);
						}), A(t), q(e, t);
					};
					Y(y, (e) => {
						W(C()), U(() => C().length) && e(b);
					}), A(o);
					var x = L(o, 2), S = F(x), T = F(S);
					A(S);
					var ee = L(S, 2), te = F(ee, !0);
					A(ee);
					var ne = L(ee, 2), ie = F(ne, !0);
					A(ne), A(x), A(n), z(() => {
						Q(S, "aria-label", (W(p()), U(() => `子項目完成 ${p().completed}，共 ${p().total}`))), J(T, `${W(p()), U(() => p().completed) ?? ""} / ${W(p()), U(() => p().total) ?? ""}`), Z(ee, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(te, (H(a), U(() => H(a).label))), J(ie, (W(d()), U(() => d().id)));
					}), q(e, n);
				}
			}
		});
	}
	A(ae), z(() => {
		Z(ae, 1, (H(i), U(() => `task-card editor-task-card priority-${H(i)?.tone ?? "unspecified"}`))), Q(ae, "aria-labelledby", (W(d()), U(() => `task-${d().id}-title`)));
	}), q(e, ae), Ye();
}
Dr([
	"input",
	"keydown",
	"click",
	"change"
]);
//#endregion
//#region viewer/assets/icon-choice.js
function ns(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function rs(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var is = /* @__PURE__ */ K("<button type=\"button\" tabindex=\"-1\"><!></button>"), as = /* @__PURE__ */ K("<div role=\"group\"></div>"), os = /* @__PURE__ */ K("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function ss(e, t) {
	Je(t, !1);
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
		if (await vr(), !H(h) || t !== C || !H(p)) return;
		let n = H(f).getBoundingClientRect(), i = H(p).getBoundingClientRect(), o = [...H(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (P(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), P(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (P(y, n.right + 4), H(y) + i.width > window.innerWidth - 4 && P(y, n.left - i.width - 4), P(b, n.top + (n.height - i.height) / 2)) : (P(y, n.left + (n.width - i.width) / 2), P(b, n.bottom + 4), H(b) + i.height > window.innerHeight - 4 && P(b, n.top - i.height - 4)), P(y, Math.max(4, Math.min(H(y), window.innerWidth - i.width - 4))), P(b, Math.max(4, Math.min(H(b), window.innerHeight - i.height - 4))), P(x, !0), await vr(), e && H(h) && t === C && s.focus({ preventScroll: !0 });
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
	Yr(() => clearTimeout(H(m))), R(() => (W(i()), W(a())), () => {
		P(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), R(() => (W(i()), W(a()), W(l())), () => {
		P(r, rs(i(), a(), l()));
	}), Mn(), Hi();
	var ie = os();
	Er("pointerdown", ln, (e) => {
		H(d)?.contains(e.target) || w();
	}), Er("resize", ln, E), Er("blur", ln, E), Er("scroll", un, (e) => {
		H(p)?.contains(e.target) || E();
	}, !0);
	var D = F(ie);
	let ae;
	ci(F(D), t, "icon", { get item() {
		return H(n);
	} }, null), A(D), Vi(D, (e) => P(f, e), () => H(f));
	var oe = L(D, 2), se = (e) => {
		var n = as();
		let i, s;
		X(n, 5, () => H(r), (e) => e.id, (e, n) => {
			var r = is();
			let i;
			ci(F(r), t, "icon", { get item() {
				return H(n);
			} }, null), A(r), z((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (H(n), U(() => H(n).id))), Q(r, "aria-label", (H(n), U(() => H(n).label))), Q(r, "title", (H(n), U(() => H(n).label))), Q(r, "aria-pressed", (H(n), W(a()), U(() => H(n).kind === "action" ? void 0 : H(n).id === a())));
			}, [() => ({ "icon-choice-hover": H(v) === String(H(n).id) })]), G("keydown", r, re), G("click", r, () => T(H(n).id)), q(e, r);
		}), A(n), Vi(n, (e) => P(p, e), () => H(p)), z(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = bi(n, "", s, {
				left: `${H(y)}px`,
				top: `${H(b)}px`,
				visibility: H(x) ? "visible" : "hidden"
			});
		}), q(e, n);
	};
	Y(oe, (e) => {
		H(h) && e(se);
	}), A(ie), Vi(ie, (e) => P(d, e), () => H(d)), z(() => {
		Q(ie, "aria-label", o()), Q(D, "aria-label", (W(o()), H(n), U(() => `${o()}：${H(n)?.label ?? ""}`))), Q(D, "aria-expanded", s() === "cycle" ? void 0 : H(h)), Q(D, "title", (W(o()), H(n), W(s()), U(() => `${o()}：${H(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), D.disabled = !H(n), ae = bi(D, "", ae, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), G("focusout", ie, (e) => {
		H(d).contains(e.relatedTarget) || w();
	}), G("keydown", D, re), G("pointerdown", D, (e) => {
		e.button === 0 && (P(_, !1), !(s() === "cycle" || H(h)) && (P(S, e.pointerId), H(f).setPointerCapture(H(S)), clearTimeout(H(m)), P(m, setTimeout(() => {
			P(g, !0), ee();
		}, 300))));
	}), G("pointermove", D, (e) => {
		H(g) && P(v, te(e));
	}), G("pointerup", D, ne), Er("pointercancel", D, E), G("click", D, () => {
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
			let e = ns(i(), a());
			e !== void 0 && u()(e);
		}
	}), q(e, ie), Ye();
}
Dr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var cs = /* @__PURE__ */ Fr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function ls(e, t) {
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
	ss(e, {
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
			var r = Lr(), i = I(r), a = (e) => {
				q(e, cs());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "closed"))), r = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "disabled")));
					co(e, {
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
function us(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function ds(e, t, n) {
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
function fs(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function ps(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function ms(e, t, n) {
	return n === "free" ? hs(e, t) : n === "reverse" ? [...e].reverse() : e;
}
function hs(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function gs(e, t, n, r, i, a) {
	let o = fs(t, e), s = new Set(n), c = ps(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var _s = /* @__PURE__ */ Fr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), vs = /* @__PURE__ */ Fr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), ys = /* @__PURE__ */ Fr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), bs = /* @__PURE__ */ K("<div role=\"group\" tabindex=\"0\"><!></div>"), xs = /* @__PURE__ */ K("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function Ss(e, t) {
	Je(t, !1);
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
		let t = ds(H(p), H(m), e);
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
		H(u) === "free" && e !== t && (te(gs(o(), H(y), H(r).map((e) => e.id), e, t, n)), P(b, e), await vr(), [...H(w).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus());
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
		P(i, ms(a(), H(y), H(u)));
	}), R(() => (H(i), H(p), H(m)), () => {
		P(r, H(i).filter((e) => us(e.id, H(p), H(m))));
	}), R(() => W(s()), () => {
		ee(s());
	}), Mn();
	var ae = { revealCard: v };
	Hi();
	var oe = xs(), se = I(oe), ce = F(se);
	ci(L(F(ce), 2), t, "filters", {}, null), A(ce);
	var le = L(ce, 2), ue = F(le), de = F(ue), fe = F(de);
	A(de), A(ue);
	var pe = L(ue, 2);
	{
		let e = /* @__PURE__ */ j(() => U(() => d.map((e) => ({
			id: e,
			label: f[e]
		}))));
		ss(pe, {
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
				var r = ys(), i = F(r), a = (e) => {
					q(e, _s());
				}, o = (e) => {
					var t = vs(), r = I(t), i = L(r);
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
	var me = L(pe, 2);
	ls(me, {
		get mode() {
			return H(p);
		},
		onChoose: g
	});
	var he = L(me, 2), ge = F(he, !0);
	A(he), A(le), A(se);
	var _e = L(se, 2);
	return X(_e, 5, () => H(i), (e) => e.id, (e, r) => {
		var i = bs();
		let a;
		var o = F(i);
		{
			let e = /* @__PURE__ */ j(() => (H(m), H(r), U(() => !H(m).includes(H(r).id))));
			ci(o, t, "default", {
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
		}, [() => (W(us), H(r), H(p), H(m), U(() => !us(H(r).id, H(p), H(m))))]), G("pointerdown", i, (e) => {
			P(x, null), e.button === 0 && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") || (P(b, H(r).id), H(u) === "free" && e.pointerType === "mouse" && (e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || P(x, H(r).id))));
		}), G("pointerup", i, () => {
			P(x, null);
		}), G("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), P(b, H(r).id)) : e.key === "Escape" && P(b, null), H(u) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), E(H(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Er("dragstart", i, (e) => {
			H(u) === "free" && H(x) === H(r).id && e.target === e.currentTarget && (P(S, H(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(H(r).id)));
		}), Er("dragend", i, ie), Er("dragover", i, (e) => D(H(r), e)), Er("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || P(C, null);
		}), Er("drop", i, (e) => {
			H(S) !== null && H(C)?.id === H(r).id && (e.preventDefault(), re(H(S), H(r).id, H(C).after), ie());
		}), q(e, i);
	}), A(_e), Vi(_e, (e) => P(w, e), () => H(w)), z(() => {
		Q(ue, "aria-label", c() ? "全部收合" : "全部展開"), Q(ue, "title", c() ? "全部收合" : "全部展開"), Q(fe, "d", c() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), J(ge, H(T));
	}), G("click", ue, () => l()(!c())), q(e, oe), zi(t, "revealCard", v), Ye(ae);
}
Dr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var Cs = /* @__PURE__ */ K("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), ws = /* @__PURE__ */ K("<p class=\"task-summary\"> </p> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), Ts = /* @__PURE__ */ K("<a class=\"pointer-card-title-link\"> </a>"), Es = /* @__PURE__ */ K("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), Ds = /* @__PURE__ */ K("<strong class=\"task-fraction\"> </strong>"), Os = /* @__PURE__ */ K("<span> </span>"), ks = /* @__PURE__ */ K("<span role=\"status\">讀取目標報告中…</span>"), As = /* @__PURE__ */ K("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), js = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!> <!></div></header>"), Ms = /* @__PURE__ */ K("<article><!></article>");
function Ns(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var p = Ms(), m = F(p);
	{
		let e = /* @__PURE__ */ j(() => (W(l()), U(() => `task-body-${l().id}`)));
		fo(m, {
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
				var r = Lr(), i = I(r), a = (e) => {
					var t = ws(), r = I(t), i = F(r, !0);
					A(r);
					var a = L(r, 2), o = F(a);
					A(a);
					var s = L(a, 2);
					X(s, 5, () => (H(n), U(() => H(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ j(() => (H(t), U(() => f(H(t).status))));
						var r = Cs(), i = F(r), a = F(i, !0);
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
					var i = js(), a = F(i), o = F(a), s = F(o), c = F(s), d = (e) => {
						var t = Ts(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "href", (W(u()), U(() => u().openHref))), J(n, (W(l()), U(() => l().title)));
						}), q(e, t);
					}, f = (e) => {
						var t = Ir();
						z(() => J(t, (W(l()), U(() => l().title)))), q(e, t);
					};
					Y(c, (e) => {
						W(u()), U(() => u().openHref) ? e(d) : e(f, -1);
					}), A(s), A(o);
					var p = L(o, 2), m = (e) => {
						var t = Es();
						z(() => Q(t, "href", (W(u()), U(() => u().openHref)))), q(e, t);
					};
					Y(p, (e) => {
						W(u()), U(() => u().openHref) && e(m);
					}), A(a);
					var h = L(a, 2), g = F(h), _ = (e) => {
						var t = Ds(), r = F(t);
						A(t), z(() => J(r, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}`)), q(e, t);
					};
					Y(g, (e) => {
						H(n) && e(_);
					});
					var v = L(g, 2), y = (e) => {
						var t = Os(), n = F(t, !0);
						A(t), z(() => {
							Z(t, 1, (H(r), U(() => `status-badge status-${H(r).tone}`))), J(n, (H(r), U(() => H(r).label)));
						}), q(e, t);
					};
					Y(v, (e) => {
						H(r) && e(y);
					});
					var b = L(v, 2), x = (e) => {
						q(e, ks());
					};
					Y(b, (e) => {
						W(u()), U(() => u().status === "loading") && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = As(), n = F(t, !0);
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
	}), q(e, p), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var Ps = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>"), Fs = /* @__PURE__ */ K("<!> <!>", 1);
function Is(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "filters", 8, null), i = $(t, "tasks", 24, () => []), a = $(t, "allIds", 24, () => []), o = $(t, "cardStorageKey", 8, null), s = $(t, "progress", 24, () => ({})), c = $(t, "editing", 8, !1), l = $(t, "policy", 8), u = $(t, "onCommand", 8, () => {}), d = $(t, "onAddItem", 8, () => {}), f = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), p = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), m = $(t, "onModuleActivate", 8, () => {}), h = $(t, "moduleOrder", 24, () => ["time"]), g = $(t, "onModuleReorder", 8, () => {}), _ = $(t, "moduleTotals", 24, () => ({})), v = $(t, "statusOrder", 24, () => ["done", "planned"]), y = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), b = $(t, "pointerCards", 24, () => ({})), x = $(t, "decisionCards", 24, () => ({})), S = /* @__PURE__ */ N(!0), C = /* @__PURE__ */ N({});
	function w(e) {
		let t = no(e);
		P(S, t.expanded), P(C, t.overrides);
	}
	function T(e, t) {
		P(C, {
			...H(C),
			[e]: t
		}), ro(H(n), H(S), H(C));
	}
	function ee(e) {
		P(S, e), P(C, {}), ro(H(n), H(S), H(C));
	}
	R(() => W(o()), () => {
		P(n, `taskprogress.disclosure:${o() ?? location.href}`);
	}), R(() => H(n), () => {
		w(H(n));
	}), Mn(), Hi();
	var te = Fs(), ne = I(te);
	Ss(ne, {
		get expanded() {
			return H(S);
		},
		onToggleAll: ee,
		get items() {
			return i();
		},
		get allIds() {
			return a();
		},
		get storageKey() {
			return o();
		},
		children: ve,
		$$slots: {
			default: (e, t) => {
				let n = /* @__PURE__ */ j(() => t.item), r = /* @__PURE__ */ j(() => t.visibilityEnabled), i = /* @__PURE__ */ j(() => t.visible), a = /* @__PURE__ */ j(() => t.onVisibleChange);
				var o = Lr(), y = I(o), w = (e) => {
					{
						let t = /* @__PURE__ */ j(() => (H(C), W(H(n)), H(S), U(() => H(C)[H(n).id] ?? H(S)))), o = /* @__PURE__ */ j(() => (W(b()), W(H(n)), U(() => b()[H(n).id] ?? { status: "loading" })));
						Ns(e, {
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
							onToggle: (e) => T(H(n).id, e),
							get task() {
								return H(n);
							},
							get state() {
								return H(o);
							}
						});
					}
				}, ee = (e) => {
					{
						let t = /* @__PURE__ */ j(() => (W(x()), W(H(n)), U(() => x()[H(n).id] ?? null))), o = /* @__PURE__ */ j(() => (H(C), W(H(n)), H(S), U(() => H(C)[H(n).id] ?? H(S)))), y = /* @__PURE__ */ j(() => (W(f()), W(H(n)), U(() => f().get(H(n).id) ?? null))), b = /* @__PURE__ */ j(() => (W(_()), W(H(n)), U(() => _()[H(n).id] ?? [])));
						ts(e, {
							get visibilityEnabled() {
								return H(r);
							},
							get visible() {
								return H(i);
							},
							get onVisibleChange() {
								return H(a);
							},
							get decisionCard() {
								return H(t);
							},
							get expanded() {
								return H(o);
							},
							onToggle: (e) => T(H(n).id, e),
							get task() {
								return H(n);
							},
							get progress() {
								return W(s()), W(H(n)), U(() => s()[H(n).id]);
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
							onAddItem: (e, t) => d()(H(n).id, e, t),
							get timeTask() {
								return H(y);
							},
							get itemCapsules() {
								return p();
							},
							get onModuleActivate() {
								return m();
							},
							get moduleOrder() {
								return h();
							},
							get onModuleReorder() {
								return g();
							},
							get statusOrder() {
								return v();
							},
							get moduleTotals() {
								return H(b);
							}
						});
					}
				};
				Y(y, (e) => {
					W(H(n)), U(() => H(n).kind === "report_pointer") ? e(w) : e(ee, -1);
				}), q(e, o);
			},
			filters: (e, t) => {
				var n = Lr(), i = I(n), a = (e) => {
					$a(e, Gi(r));
				};
				Y(i, (e) => {
					r() && e(a);
				}), q(e, n);
			}
		}
	});
	var re = L(ne, 2), E = (e) => {
		var t = Ps(), n = F(t, !0);
		A(t), z(() => J(n, y())), q(e, t);
	};
	Y(re, (e) => {
		W(i()), U(() => !i().length) && e(E);
	}), q(e, te), Ye();
}
//#endregion
//#region viewer/assets/theme-model.js
var Ls = [
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
], Rs = Object.freeze({
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
var zs = /^#[0-9a-f]{6}$/i;
function Bs(e) {
	return typeof e == "string" && zs.test(e);
}
function Vs(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Rs[n], i = { base: n };
	for (let e of Ls) {
		let n = t[e.key];
		i[e.key] = Bs(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Hs(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Us(e, t) {
	if (!Bs(e) || !Bs(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Hs(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Ws(e) {
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
	].filter(([, e, t]) => Us(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Gs = /* @__PURE__ */ K("<option> </option>"), Ks = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), qs = /* @__PURE__ */ K("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), Js = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Ys(e, t) {
	Je(t, !1);
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(!1), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(Vs(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(Ls.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Vs(o().base, o()) : Vs(s())), P(f, !0);
	}
	function S() {
		P(f, !1);
	}
	function C(e) {
		y(Vs(e.currentTarget.value));
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
		l()(Vs(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, Vs(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, Ws(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Mn(), Hi();
	var ne = Js(), re = I(ne), E = L(F(re), 2);
	X(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = Gs(), r = F(n, !0);
		A(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), A(E), A(re), da(L(re, 2), {
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
			var a = qs(), o = L(I(a), 2), s = L(F(o), 2), c = F(s);
			c.value = c.__value = "light";
			var l = L(c);
			l.value = l.__value = "dark", A(s);
			var u;
			Si(s), A(o);
			var d = L(o, 2);
			X(d, 7, () => Ls, (e) => e.key, (e, t, r) => {
				var i = Ks(), a = F(i), o = F(a, !0);
				A(a);
				var s = L(a, 2), c = F(s);
				ki(c);
				var l = L(c, 2);
				ki(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Vi(l, (e, t) => en(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), A(s), A(i), z(() => {
					J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), Ai(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), Ai(l, (H(g), H(t), U(() => H(g)[H(t).key])));
				}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => T(H(t), e)), q(e, i);
			}), A(d);
			var f = L(d, 2);
			let m;
			var _ = F(f, !0);
			A(f);
			var v = L(f, 2), b = F(v), x = L(b, 4), S = L(x, 2);
			A(v), z(() => {
				u !== (u = H(h)) && (s.value = (s.__value = H(h)) ?? "", xi(s, H(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": H(r).length > 0 }), J(_, H(i));
			}), G("change", s, C), G("click", b, () => y(Vs(H(h)))), G("click", x, ee), G("click", S, te), q(e, a);
		},
		$$slots: { default: !0 }
	}), G("change", E, b), Ci(E, () => H(m), (e) => P(m, e)), q(e, ne), Ye();
}
Dr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var Xs = /* @__PURE__ */ K("<span> </span>"), Zs = /* @__PURE__ */ K("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), Qs = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), $s = /* @__PURE__ */ K("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function ec(e, t) {
	Je(t, !1);
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
	Hi();
	var u = $s(), d = F(u), f = F(d);
	X(L(F(f), 2), 1, () => (W(n()), U(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = Xs(), r = F(n, !0);
		A(n), z(() => {
			Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), A(f);
	var p = L(f, 2), m = L(F(p), 2);
	ki(m), A(p), A(d);
	var h = L(d, 2);
	oa(F(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = Zs(), i = L(F(r), 2);
			ki(i), A(r), z(() => Q(i, "aria-label", (W(n()), U(() => `「${n().title}」人工依據`)))), Fi(i, () => H(o), (e) => P(o, e)), q(e, r);
		},
		$$slots: { default: !0 }
	}), A(h);
	var g = L(h, 2), _ = F(g);
	ki(_), Re(2), A(g);
	var v = L(g, 4), y = F(v);
	A(v);
	var b = L(v, 2), x = (e) => {
		var t = Qs(), n = F(t, !0);
		A(t), z(() => J(n, H(c))), q(e, t);
	};
	Y(b, (e) => {
		H(c) && e(x);
	}), A(u), z(() => {
		Q(m, "aria-label", (W(n()), U(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (W(n()), U(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (W(n()), U(() => `套用「${n().title}」人工估算草稿`)));
	}), Er("submit", u, (e) => {
		e.preventDefault(), l();
	}), Fi(m, () => H(a), (e) => P(a, e)), Ii(_, () => H(s), (e) => P(s, e)), q(e, u), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var tc = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> <span> </span></label>"), nc = /* @__PURE__ */ K("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), rc = /* @__PURE__ */ K("<div class=\"spike-exception-list\"></div>"), ic = /* @__PURE__ */ K("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), ac = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), oc = /* @__PURE__ */ K("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function sc(e, t) {
	Je(t, !1);
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
	}), Mn(), Hi();
	var re = oc(), E = F(re), ie = L(F(E), 6), D = F(ie);
	A(ie), A(E);
	var ae = L(E, 2), oe = F(ae), se = L(F(oe), 2), ce = F(se), le = L(F(ce));
	ki(le), A(ce);
	var ue = L(ce, 2), de = L(F(ue));
	ki(de), A(ue);
	var fe = L(ue, 2);
	A(se), A(oe);
	var pe = L(oe, 2), me = F(pe), he = L(F(me), 2);
	let ge;
	var _e = F(he);
	A(he), A(me);
	var ve = L(me, 2), ye = F(ve), be = L(F(ye));
	ki(be), A(ye);
	var xe = L(ye, 2), Se = L(F(xe));
	ki(Se), A(xe);
	var Ce = L(xe, 2), we = L(F(Ce));
	ki(we), A(Ce), A(ve);
	var Te = L(ve, 2);
	X(L(F(Te), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = tc(), r = F(n);
		ki(r);
		var i = L(r, 2), a = F(i);
		A(i), A(n), z((e) => {
			ji(r, e), J(a, `週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(h), H(t), U(() => H(h).includes(H(t).value)))]), G("change", r, (e) => S(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(Te), A(pe);
	var Ee = L(pe, 2), De = F(Ee), Oe = L(F(De), 2);
	A(De);
	var ke = L(De, 2), Ae = (e) => {
		var t = rc();
		X(t, 5, () => H(_), (e) => e.key, (e, t) => {
			var n = nc(), r = F(n), i = L(F(r));
			ki(i), A(r);
			var a = L(r, 2), o = L(F(a));
			ki(o), A(a);
			var s = L(a, 2), c = L(F(s));
			ki(c), A(s);
			var l = L(s, 2);
			A(n), z(() => {
				Ai(i, (H(t), U(() => H(t).date))), Ai(o, (H(t), U(() => H(t).availableHours))), Ai(c, (H(t), U(() => H(t).publicLabel)));
			}), G("input", i, (e) => C(H(t).key, "date", e.currentTarget.value)), G("input", o, (e) => C(H(t).key, "availableHours", e.currentTarget.value)), G("input", c, (e) => C(H(t).key, "publicLabel", e.currentTarget.value)), G("click", l, () => T(H(t).key)), q(e, n);
		}), A(t), q(e, t);
	}, je = (e) => {
		q(e, ic());
	};
	Y(ke, (e) => {
		H(_), U(() => H(_).length) ? e(Ae) : e(je, -1);
	}), A(Ee);
	var Me = L(Ee, 2), Ne = F(Me), Pe = L(Ne, 2), O = (e) => {
		var t = ac(), n = F(t, !0);
		A(t), z(() => J(n, H(v))), q(e, t);
	};
	Y(Pe, (e) => {
		H(v) && e(O);
	}), A(Me), A(ae), A(re), z((e) => {
		J(D, `時區：${W(r()), U(() => r().timezone) ?? ""}`), ge = Z(he, 1, "", null, ge, { invalid: !(H(n) > 0) }), J(_e, `工作 ${e ?? ""} hr`);
	}, [() => (H(n), U(() => Number.isFinite(H(n)) ? H(n) : "—"))]), G("input", le, x), Fi(le, () => H(u), (e) => P(u, e)), G("input", de, x), Fi(de, () => H(d), (e) => P(d, e)), G("click", fe, () => {
		P(u, ""), x();
	}), G("input", be, x), Fi(be, () => H(f), (e) => P(f, e)), G("input", Se, x), Fi(Se, () => H(p), (e) => P(p, e)), G("input", we, x), Fi(we, () => H(m), (e) => P(m, e)), G("click", Oe, w), G("click", Ne, ne), q(e, re), Ye();
}
Dr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var cc = (e, t = _, n = _) => {
	var r = hc(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o, !0);
	A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c), A(r), z((e) => {
		Z(r, 1, e), J(a, (t(), U(() => t().label))), J(s, (t(), U(() => t().value))), J(l, (t(), U(() => t().note)));
	}, [() => pi((n(), U(() => `time-evaluation-node ${n()}`.trim())))]), q(e, r);
}, lc = (e, t = _) => {
	var n = _c();
	X(n, 5, t, $r, (e, t) => {
		var n = gc(), r = F(n), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i), s = F(o, !0);
		A(o), A(r);
		var c = L(r, 2), l = F(c, !0);
		A(c), A(n), z(() => {
			J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, uc = (e, t = _) => {
	var n = vc();
	lc(L(F(n), 2), t), A(n), q(e, n);
}, dc = (e, t = _, n = _) => {
	var r = yc(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o), c = F(s);
	cc(c, () => (t(), U(() => t().engineeringLane.source)), () => ""), cc(L(c, 4), () => (t(), U(() => t().engineeringLane.result)), () => "time-evaluation-result"), A(s);
	var l = L(s, 2), u = F(l);
	cc(u, () => (t(), U(() => t().capacityLane.source)), () => ""), cc(L(u, 4), () => (t(), U(() => t().capacityLane.result)), () => "time-evaluation-result"), A(l), A(o);
	var d = L(o, 2);
	cc(L(F(d), 2), () => (t(), U(() => t().merge)), () => (t(), U(() => t().merge.className))), A(d);
	var f = L(d, 2), p = F(f);
	cc(p, () => (t(), U(() => t().risk.trend)), () => ""), cc(L(p, 4), () => (t(), U(() => t().risk.result)), () => (t(), U(() => t().risk.result.className))), A(f);
	var m = L(f, 2), h = F(m, !0);
	A(m), A(r), z(() => {
		Q(r, "hidden", !n()), J(a, (t(), U(() => t().intro))), J(h, (t(), U(() => t().note)));
	}), q(e, r);
}, fc = (e, t = _, n = _) => {
	var r = Sc(), i = F(r);
	ra(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	oa(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), U(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = bc(), i = I(r), a = F(i, !0);
			A(i);
			var o = L(i, 2), s = F(o, !0);
			A(o), z(() => {
				J(a, (t(), U(() => t().explanation.text))), J(s, (t(), U(() => t().explanation.formula)));
			}), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2);
	oa(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = xc(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), uc(L(o, 2), () => (t(), U(() => t().composition))), A(r), z(() => Q(r, "hidden", !n())), q(e, r);
}, pc = (e, t = _, n = _) => {
	var r = Tc(), i = L(F(r), 2);
	ra(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	oa(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = Cc(), i = L(I(r), 2), a = F(i, !0);
			A(i), z(() => J(a, (t(), U(() => t().formulaCode)))), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2), s = F(o), c = F(s, !0);
	A(s);
	var l = L(s, 2), u = F(l), d = (e) => {
		var n = Lr();
		X(I(n), 1, () => (t(), U(() => t().exceptions)), $r, (e, t) => {
			var n = gc(), r = F(n), i = F(r), a = F(i, !0);
			A(i);
			var o = L(i), s = F(o, !0);
			A(o), A(r);
			var c = L(r, 2), l = F(c, !0);
			A(c), A(n), z(() => {
				J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
			}), q(e, n);
		}), q(e, n);
	}, f = (e) => {
		q(e, wc());
	};
	Y(u, (e) => {
		t(), U(() => t().exceptions) ? e(d) : e(f, -1);
	}), A(l), A(o), A(r), z(() => {
		Q(r, "hidden", !n()), J(c, (t(), U(() => t().exceptionsHeading)));
	}), q(e, r);
}, mc = (e, t = _) => {
	var n = Ec(), r = F(n), i = F(r, !0);
	A(r);
	var a = L(r, 2);
	ra(a, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var o = L(a, 2);
	oa(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = xc(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), uc(L(o, 2), () => (t(), U(() => t().composition))), A(n), z(() => J(i, (t(), U(() => t().intro)))), q(e, n);
}, hc = /* @__PURE__ */ K("<div><span> </span> <strong> </strong> <small> </small></div>"), gc = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), _c = /* @__PURE__ */ K("<div class=\"time-source-list\"></div>"), vc = /* @__PURE__ */ K("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), yc = /* @__PURE__ */ K("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), bc = /* @__PURE__ */ K("<p> </p> <code class=\"time-formula\"> </code>", 1), xc = /* @__PURE__ */ K("<p> </p>"), Sc = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), Cc = /* @__PURE__ */ K("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), wc = /* @__PURE__ */ K("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), Tc = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), Ec = /* @__PURE__ */ K("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), Dc = /* @__PURE__ */ K("<span> </span>"), Oc = /* @__PURE__ */ K("<!> <div class=\"time-item-rationale\"><!></div>", 1), kc = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Ac = /* @__PURE__ */ K("<code class=\"time-formula\"> </code>"), jc = /* @__PURE__ */ K("<code class=\"time-reference\"> </code>"), Mc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), Nc = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Pc = /* @__PURE__ */ K("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), Fc = /* @__PURE__ */ K("<!> <!>", 1), Ic = /* @__PURE__ */ K("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), Lc = /* @__PURE__ */ K("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Rc = /* @__PURE__ */ K("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), zc = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), Bc = /* @__PURE__ */ K("<div class=\"time-dialog-content\"><!></div>");
function Vc(e, t) {
	Je(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ N([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await vr(), H(g)[r]?.focus();
	}
	Hi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
		da(e, {
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
				var n = Bc(), i = F(n), c = (e) => {
					var t = Mc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var o = L(r, 2), c = F(o, !0);
					A(o), A(n);
					var u = L(n, 2), m = (e) => {
						var t = Lr();
						Qr(I(t), () => (W(s()), W(f()), U(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ j(() => (W(s()), W(a()), U(() => ({
									...s(),
									title: a()
								}))));
								ec(e, {
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
						var t = Oc(), n = I(t);
						la(n, {
							label: "預估工時",
							get value() {
								return W(s()), U(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Lr();
								X(I(n), 1, () => (W(s()), U(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = Dc(), r = F(n, !0);
									A(n), z(() => {
										Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
									}), q(e, n);
								}), q(e, n);
							} }
						});
						var r = L(n, 2);
						oa(F(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = xc(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().rationale)))), q(e, n);
							},
							$$slots: { default: !0 }
						}), A(r), q(e, t);
					};
					Y(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = L(u, 2), _ = F(g);
					ra(_, { get metrics() {
						return W(s()), U(() => s().technical.metrics);
					} });
					var v = L(_, 2), y = (e) => {
						var t = kc(), n = F(t), r = F(n), i = F(r, !0);
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
						oa(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = Ac(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().technical.formula)))), q(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					Y(b, (e) => {
						W(s()), U(() => s().technical.formula) && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = jc(), n = F(t, !0);
						A(t), z(() => J(n, (W(s()), U(() => s().technical.reference)))), q(e, t);
					};
					Y(S, (e) => {
						W(s()), U(() => s().technical.reference) && e(C);
					}), A(g), A(t), z(() => {
						Z(r, 1, pi((W(s()), U(() => s().confidenceClass)))), J(i, (W(s()), U(() => s().confidenceLabel))), J(c, (W(s()), U(() => s().toggleLabel))), Q(g, "hidden", (W(s()), U(() => !s().detailsExpanded)));
					}), G("click", o, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, v = (e) => {
					var t = zc(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var a = L(r, 2), s = F(a, !0);
					A(a), A(n);
					var c = L(n, 2), f = F(c);
					X(f, 5, () => (W(o()), U(() => o().overview)), $r, (e, t) => {
						var n = Pc(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = F(a), s = (e) => {
							var n = Nc();
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
						var t = Lr(), n = I(t), r = (e) => {
							var t = Fc(), n = I(t);
							sc(n, {
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
								Ca(e, { get preview() {
									return h();
								} });
							};
							Y(r, (e) => {
								h() && e(i);
							}), q(e, t);
						}, i = (e) => {
							var t = Ic(), n = L(F(t), 4);
							A(t), G("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), q(e, t);
						};
						Y(n, (e) => {
							W(m()), U(() => m().hasConfig) ? e(r) : e(i, -1);
						}), q(e, t);
					}, S = (e) => {
						var t = Rc(), n = I(t);
						X(n, 7, () => (W(o()), U(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = Lc(), i = F(r, !0);
							A(r), Vi(r, (e, t) => en(g, H(g)[t] = e), (e) => H(g)?.[e], () => [H(n)]), z(() => {
								Q(r, "id", (H(t), U(() => `time-${H(t).name}-tab`))), Q(r, "aria-controls", (H(t), U(() => `time-${H(t).name}-panel`))), Q(r, "aria-selected", (W(o()), H(t), U(() => o().activeTab === H(t).name))), Q(r, "tabindex", (W(o()), H(t), U(() => o().activeTab === H(t).name ? 0 : -1))), J(i, (H(t), U(() => H(t).label)));
							}), G("click", r, () => u()(H(t).name)), G("keydown", r, (e) => _(e, H(n), o().tabs)), q(e, r);
						}), A(n);
						var r = L(n, 2);
						dc(r, () => (W(o()), U(() => o().flow)), () => (W(o()), U(() => o().activeTab === "flow")));
						var i = L(r, 2);
						fc(i, () => (W(o()), U(() => o().engineering)), () => (W(o()), U(() => o().activeTab === "engineering"))), pc(L(i, 2), () => (W(o()), U(() => o().capacity)), () => (W(o()), U(() => o().activeTab === "capacity"))), q(e, t);
					}, C = (e) => {
						mc(e, () => (W(o()), U(() => o().estimateOnly)));
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
	Ye();
}
Dr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Hc = /* @__PURE__ */ K("<span class=\"time-risk-dot\"></span>"), Uc = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), Wc = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>");
function Gc(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = Wc(), d = F(u), f = F(d, !0);
	A(d);
	var p = L(d, 2), m = (e) => {
		q(e, Hc());
	};
	Y(p, (e) => {
		s() && e(m);
	});
	var h = L(p, 2), g = (e) => {
		q(e, Uc());
	};
	Y(h, (e) => {
		c() && e(g);
	}), A(u), z(() => {
		Z(u, 1, pi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), J(f, o());
	}), G("click", u, function(...e) {
		l()?.apply(this, e);
	}), q(e, u);
}
Dr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Kc = {
	"task-list": Is,
	"status-overview": to,
	"status-filters": $a,
	"project-progress": Va,
	"report-summary": Wa,
	"mode-toggle": ka,
	"save-bar": Za,
	"add-control": $i,
	diagnostics: Da,
	"scope-directory": qa,
	"theme-control": Ys,
	"project-module-strip": Fa,
	"time-summary-button": Gc,
	"time-dialog": Vc,
	"cost-dialog": va,
	"delivery-save-confirmation": Ta
}, qc = {
	id: "svelte",
	regions: Object.keys(Kc),
	mount(e, t, n) {
		let r = on({ ...n });
		return {
			component: Hr(Kc[e], {
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
		Kr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(qc);
//#endregion
