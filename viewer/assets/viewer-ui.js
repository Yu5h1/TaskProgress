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
var x = 1024, S = 2048, C = 4096, w = 8192, ee = 16384, te = 32768, T = 1 << 25, E = 65536, D = 1 << 19, O = 1 << 20, ne = 1 << 25, k = 65536, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("legacy props"), ce = Symbol(""), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = Symbol("form reset"), me = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), he = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function ge() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
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
var A = !1;
function Ne(e) {
	A = e;
}
var j;
function Pe(e) {
	if (e === null) throw Ae(), t;
	return j = e;
}
function Fe() {
	return Pe(/* @__PURE__ */ hn(j));
}
function M(e) {
	if (A) {
		if (/* @__PURE__ */ hn(j) !== null) throw Ae(), t;
		j = e;
	}
}
function Ie(e = 1) {
	if (A) {
		for (var t = e, n = j; t--;) n = /* @__PURE__ */ hn(n);
		j = n;
	}
}
function Le(e = !0) {
	for (var t = 0, n = j;;) {
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
var We = null;
function Ge(e) {
	We = e;
}
function Ke(e, t = !1, n) {
	We = {
		p: We,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: He && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function qe(e) {
	var t = We, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, We = t.p, e ?? {};
}
function Je() {
	return !He || We !== null && We.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ye = [];
function Xe() {
	var e = Ye;
	Ye = [], y(e);
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
	var t = H;
	if (t === null) return Xn.f |= ae, e;
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
var tt = ~(S | C | x);
function nt(e, t) {
	e.f = e.f & tt | t;
}
function rt(e) {
	e.f & 512 || e.deps === null ? nt(e, x) : nt(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function it(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= k, it(t.deps));
}
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), it(e.deps), nt(e, x);
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
	A && /* @__PURE__ */ mn(e) !== null && gn(e);
}
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[pe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = Xn, n = H;
	Qn(null), $n(null);
	try {
		return e();
	} finally {
		Qn(t), $n(n);
	}
}
function ft(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[pe];
	e[pe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function pt(e) {
	let t = 0, n = Xt(0), r;
	return () => {
		Cn() && (U(n), Mn(() => (t === 0 && (r = W(() => e(() => tn(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, tn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var mt = E | D;
function ht(e, t, n, r) {
	new gt(e, t, n, r);
}
var gt = class {
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
	#h = pt(() => (this.#m = Xt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Nn(() => {
			if (A) {
				let e = this.#t;
				Fe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, mt), A && (this.#e = j);
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
				Me();
				return;
			}
			t = !0, n && Oe(), this.#s !== null && Vn(this.#s, () => {
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
			}), this.#x(P));
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
			} else this.#x(P);
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
		var t = H, n = Xn, r = We;
		$n(this.#i), Qn(this.#i), Ge(this.#i.ctx);
		try {
			return zt.ensure(), e();
		} catch (e) {
			return $e(e), null;
		} finally {
			$n(t), Qn(n), Ge(r);
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
			this.#d = !1, this.#m && $t(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Rn(this.#a), null), this.#o &&= (Rn(this.#o), null), this.#s &&= (Rn(this.#s), null), A && (Pe(this.#t), Ie(), Pe(Le()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Pn(() => {
						var r = H;
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
	let i = Je() ? xt : N;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = H, t = Xn, n = We, r = P;
	return function(i = !0) {
		$n(e), Qn(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	$n(null), Qn(null), Ge(null), e && P?.deactivate();
}
function bt() {
	var e = H, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var t = 2 | S;
	return H !== null && (H.f |= D), {
		ctx: We,
		deps: null,
		effects: null,
		equals: ze,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: n,
		wv: 0,
		parent: H,
		ac: null
	};
}
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, t, r) {
	let i = H;
	i === null && ve();
	var a = void 0, o = Xt(n), s = !Xn, c = /* @__PURE__ */ new Set();
	return jn(() => {
		var t = H, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== me && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = P;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= ae, $t(o, t)) : (o.f & 8388608 && (o.f ^= ae), $t(o, e)), r.deactivate());
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
function N(e) {
	let t = /* @__PURE__ */ xt(e);
	return t.equals = Ve, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Rn(t[n]);
	}
}
function Tt(e) {
	var t, r = H, i = e.parent;
	if (!Jn && i !== null && e.v !== n && i.f & 24576) return ke(), e.v;
	$n(i);
	try {
		e.f &= ~k, wt(e), t = pr(e);
	} finally {
		$n(r);
	}
	return t;
}
function Et(e) {
	var t = Tt(e);
	if (!e.equals(t) && (e.wv = ur(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		nt(e, x);
		return;
	}
	Jn || (jt === null ? rt(e) : (Cn() || P?.is_fork) && jt.set(e, t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = _), hr(t, 0), In(t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && gr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var kt = null, P = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, Rt = 1, zt = class e {
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
			for (var r of n.d) nt(r, S), t(r);
			for (r of n.m) nt(r, C), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Lt++ > 1e3 && (this.#x(), Vt());
		for (let e of this.#u) this.#d.delete(e), nt(e, S), this.schedule(e);
		for (let e of this.#d) nt(e, C), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ft = [], r = [], i = It = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Kt(e), this.#h() || this.discard(), t;
		}
		if (P = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ft = null, It = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Gt(e, t);
			i.length > 0 && P.#g();
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
		var s = P;
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
				a ? r.f ^= x : i & 4 ? t.push(r) : dr(r) && (i & 16 && this.#d.add(r), gr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), nt(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), P = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), jt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, jt = null;
	}
	flush() {
		try {
			Pt = !0, P = this, this.#g();
		} finally {
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, P = null, jt = null, Jt.clear();
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
		return (this.#s ??= b()).promise;
	}
	static ensure() {
		if (P === null) {
			let t = P = new e();
			!Pt && !Nt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return P;
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
			if (Ft !== null && t === H && (Xn === null || !(Xn.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? kt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Bt(e) {
	var t = Nt;
	Nt = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (Qe(), P === null) return n;
			P.flush();
		}
	} finally {
		Nt = t;
	}
}
function Vt() {
	try {
		Ce();
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
			if (!(r.f & 24576) && dr(r) && (Ht = /* @__PURE__ */ new Set(), gr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Bn(r), Ht?.size > 0)) {
				Jt.clear();
				for (let e of Ht) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ht.has(n) && (Ht.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || gr(n);
					}
				}
				Ht.clear();
			}
		}
		Ht = null;
	}
}
function Wt(e) {
	P.schedule(e);
}
function Gt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), nt(e, x);
		for (var n = e.first; n !== null;) Gt(n, t), n = n.next;
	}
}
function Kt(e) {
	nt(e, x);
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
	return tr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t = !1, n = !0) {
	let r = Xt(e);
	return t || (r.equals = Ve), He && n && We !== null && We.l !== null && (We.l.s ??= []).push(r), r;
}
function Qt(e, t) {
	return I(e, W(() => U(e))), t;
}
function I(e, t, n = !1) {
	return Xn !== null && (!Zn || Xn.f & 131072) && Je() && Xn.f & 4325394 && (er === null || !er.has(e)) && De(), $t(e, n ? rn(t) : t, It);
}
function $t(e, t, n = null) {
	if (!e.equals(t)) {
		Jt.set(e, Jn ? t : e.v);
		var r = zt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Tt(t), jt === null && rt(t);
		}
		e.wv = ur(), nn(e, S, n), Je() && H !== null && H.f & 1024 && !(H.f & 96) && (ir === null ? ar([e]) : ir.push(e)), !r.is_fork && qt.size > 0 && !Yt && en();
	}
	return t;
}
function en() {
	Yt = !1;
	for (let e of qt) {
		e.f & 1024 && nt(e, C);
		let t;
		try {
			t = dr(e);
		} catch {
			t = !0;
		}
		t && gr(e);
	}
	qt.clear();
}
function tn(e) {
	I(e, e.v + 1);
}
function nn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & S) === 0;
			if (l && nt(s, t), c & 131072) qt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= k), nn(u, C, n));
			} else if (l) {
				var d = s;
				c & 16 && Ht !== null && Ht.add(d), n === null ? Wt(d) : n.push(d);
			}
		}
	}
}
function rn(e) {
	if (typeof e != "object" || !e || oe in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Zt(0), s = null, c = cr, l = (e) => {
		if (cr === c) return e();
		var t = Xn, n = cr;
		Qn(null), lr(c);
		var r = e();
		return Qn(t), lr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Zt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Te();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Zt(n.value, s);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Zt(n, s));
					r.set(t, e), tn(o);
				}
			} else I(i, n), tn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === oe) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Zt(rn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			if (t === oe) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || H !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Zt(a ? rn(e[t]) : n, s)), r.set(t, i)), U(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Zt(n, s)), r.set(p + "", m)) : I(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Zt(void 0, s)), I(d, rn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => rn(a));
				I(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && I(_, v + 1);
				}
				tn(o);
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
			Ee();
		}
	});
}
function an(e) {
	try {
		if (typeof e == "object" && e && oe in e) return e[oe];
	} catch {}
	return e;
}
function on(e, t) {
	return Object.is(an(e), an(t));
}
var sn, cn, ln, un, dn;
function fn() {
	if (sn === void 0) {
		sn = window, cn = document, ln = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		un = u(t, "firstChild").get, dn = u(t, "nextSibling").get, h(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), h(n) && (n[fe] = void 0);
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
function L(e, t) {
	if (!A) return /* @__PURE__ */ mn(e);
	var n = /* @__PURE__ */ mn(j);
	if (n === null) n = j.appendChild(pn());
	else if (t && n.nodeType !== 3) {
		var r = pn();
		return n?.before(r), Pe(r), r;
	}
	return t && yn(n), Pe(n), n;
}
function R(e, t = !1) {
	if (!A) {
		var n = /* @__PURE__ */ mn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hn(n) : n;
	}
	if (t) {
		if (j?.nodeType !== 3) {
			var r = pn();
			return j?.before(r), Pe(r), r;
		}
		yn(j);
	}
	return j;
}
function z(e, t = 1, n = !1) {
	let r = A ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ hn(r);
	if (!A) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = pn();
			return r === null ? i?.after(a) : r.before(a), Pe(a), a;
		}
		yn(r);
	}
	return Pe(r), r;
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
	H === null && (Xn === null && Se(e), xe()), Jn && be(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= w);
	var r = {
		ctx: We,
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
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) Ft === null ? zt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			gr(r);
		} catch (e) {
			throw Rn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= E));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), Xn !== null && Xn.f & 2 && !(e & 64))) {
		var a = Xn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return Xn !== null && !Zn;
}
function wn(e) {
	let t = Sn(8, null);
	return nt(t, x), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = H.f;
	if (!Xn && t & 32 && We !== null && !We.i) {
		var n = We;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | O, e);
}
function Dn(e) {
	return bn("$effect.pre"), Sn(8 | O, e);
}
function On(e) {
	zt.ensure();
	let t = Sn(64 | D, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Vn(t, () => {
			Rn(t), n(void 0);
		}) : (Rn(t), n(void 0));
	});
}
function kn(e) {
	return Sn(4, e);
}
function B(e, t) {
	var n = We, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Mn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = H;
			try {
				$n(n.parent), W(t);
			} finally {
				$n(n);
			}
		}
	});
}
function An() {
	var e = We;
	Mn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && nt(n, C), dr(n) && gr(n), t.ran = !1;
		}
	});
}
function jn(e) {
	return Sn(ie | D, e);
}
function Mn(e, t = 0) {
	return Sn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(U));
		});
	});
}
function Nn(e, t = 0) {
	return Sn(16 | t, e);
}
function Pn(e) {
	return Sn(32 | D, e);
}
function Fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Jn, n = Xn;
		Yn(!0), Qn(null);
		try {
			t.call(null);
		} finally {
			Yn(e), Qn(n);
		}
	}
}
function In(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dt(() => {
			e.abort(me);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (zn(e.nodes.start, e.nodes.end), n = !0), e.f |= T, In(e, t && !n), hr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Fn(e), e.f ^= T, e.f |= ee;
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
		e.f ^= w;
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
		e.f ^= w, e.f & 1024 || (nt(e, S), zt.ensure().schedule(e));
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
var Xn = null, Zn = !1;
function Qn(e) {
	Xn = e;
}
var H = null;
function $n(e) {
	H = e;
}
var er = null;
function tr(e) {
	Xn !== null && (er ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~k), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (dr(a) && Et(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && nt(e, x);
	}
	return !1;
}
function fr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(er !== null && er.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? fr(a, t, !1) : t === a && (n ? nt(a, S) : a.f & 1024 && nt(a, C), Wt(a));
	}
}
function pr(e) {
	var t = nr, n = rr, r = ir, i = Xn, a = er, o = We, s = Zn, c = cr, l = e.f;
	nr = null, rr = 0, ir = null, Xn = l & 96 ? null : e, er = null, Ge(e.ctx), Zn = !1, cr = ++sr, e.ac !== null && (dt(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= te;
		var f = e.deps, p = P?.is_fork;
		if (nr !== null) {
			var m;
			if (p || hr(e, rr), f !== null && rr > 0) for (f.length = rr + nr.length, m = 0; m < nr.length; m++) f[rr + m] = nr[m];
			else e.deps = f = nr;
			if (Cn() && e.f & 512) for (m = rr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && rr < f.length && (hr(e, rr), f.length = rr);
		if (Je() && ir !== null && !Zn && f !== null && !(e.f & 6146)) for (m = 0; m < ir.length; m++) fr(ir[m], e);
		if (i !== null && i !== e) {
			if (sr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = sr;
			if (t !== null) for (let e of t) e.rv = sr;
			ir !== null && (r === null ? r = ir : r.push(...ir));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (e) {
		return $e(e);
	} finally {
		e.f ^= re, nr = t, rr = n, ir = r, Xn = i, er = a, Ge(o), Zn = s, cr = c;
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
		c.f & 512 && (c.f ^= 512, c.f &= ~k), c.v !== n && rt(c), c.ac !== null && dt(() => {
			c.ac.abort(me), c.ac = null, nt(c, S);
		}), Dt(c), hr(c, 0);
	}
}
function hr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) mr(e, n[r]);
}
function gr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		nt(e, x);
		var n = H, r = qn;
		H = e, qn = !(t & 96);
		try {
			t & 16777232 ? Ln(e) : In(e), Fn(e);
			var i = pr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = or;
		} finally {
			qn = r, H = n;
		}
	}
}
async function _r() {
	await Promise.resolve(), Bt();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Kn?.add(e), Xn !== null && !Zn && !(H !== null && H.f & 16384) && (er === null || !er.has(e))) {
		var n = Xn.deps;
		if (Xn.f & 2097152) e.rv < sr && (e.rv = sr, nr === null && n !== null && n[rr] === e ? rr++ : nr === null ? nr = [e] : nr.push(e));
		else {
			Xn.deps ??= [], s.call(Xn.deps, e) || Xn.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [Xn] : s.call(r, Xn) || r.push(Xn);
		}
	}
	if (Jn && Jt.has(e)) return Jt.get(e);
	if (t) {
		var i = e;
		if (Jn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || yr(i)) && (a = Tt(i)), Jt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Zn && Xn !== null && (qn || !!(Xn.f & 512)), c = (i.f & te) === 0;
		dr(i) && (o && (i.f |= 512), Et(i)), o && !c && (Ot(i), vr(i));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function vr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ot(t), vr(t));
}
function yr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Jt.has(t) || t.f & 2 && yr(t)) return !0;
	return !1;
}
function W(e) {
	var t = Zn;
	try {
		return Zn = !0, e();
	} finally {
		Zn = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) br(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && br(n);
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
		if (r.capture || Or.call(t, e), !e.cancelBubble) return dt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ze(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Tr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = wr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && wn(() => {
		t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
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
		var d = Xn, f = H;
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
	var t = vn("template");
	return t.innerHTML = Ar(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mr(e, t) {
	var n = H;
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
		if (A) return Mr(j, null), j;
		i === void 0 && (i = jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ mn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ mn(t), s = t.lastChild;
			Mr(o, s);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (A) return Mr(j, null), j;
		if (!o) {
			var e = /* @__PURE__ */ mn(jr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ mn(e);) o.appendChild(/* @__PURE__ */ mn(e));
			else o = /* @__PURE__ */ mn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ mn(t), r = t.lastChild;
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
	if (!A) {
		var t = pn(e + "");
		return Mr(t, t), t;
	}
	var n = j;
	return n.nodeType === 3 ? yn(n) : (n.before(n = pn()), Pe(n)), Mr(n, n), n;
}
function Ir() {
	if (A) return Mr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = pn();
	return e.append(t, n), Mr(t, n), e;
}
function J(e, t) {
	if (A) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = j), Fe();
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
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function Vr(e, t) {
	return Ur(e, t);
}
var Hr = /* @__PURE__ */ new Map();
function Ur(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	fn();
	var u = void 0, d = On(() => {
		var s = r ?? n.appendChild(pn());
		ht(s, { pending: () => {} }, (n) => {
			Ke({});
			var r = We;
			if (o && (r.c = o), a && (i.$$events = a), A && Mr(n, null), u = e(n, i) || {}, A && (H.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw Ae(), t;
			qe();
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
		var n = P, r = _n();
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
		} else A && (this.anchor = j), this.#a(n);
	}
};
function qr(e) {
	We === null && _e("onMount"), He && We.l !== null ? Yr(We).m.push(e) : Tn(() => {
		let t = W(e);
		if (typeof t == "function") return t;
	});
}
function Jr(e) {
	We === null && _e("onDestroy"), qr(() => () => W(e));
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
function X(e, t, n = !1) {
	var r;
	A && (r = j, Fe());
	var i = new Kr(e), a = n ? E : 0;
	function o(e, t) {
		if (A) {
			var n = Re(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Le();
				Pe(a), i.anchor = a, Ne(!1), i.ensure(e, t), Ne(!0);
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
var Xr = Symbol("NaN");
function Zr(e, t, n) {
	A && Fe();
	var r = new Kr(e), i = !Je();
	Nn(() => {
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
		Vn(n, () => {
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
			gn(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= ne, Gn(a, document.createDocumentFragment())) : Rn(t[i], n);
	}
}
var ti;
function ni(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = A ? Pe(/* @__PURE__ */ mn(u)) : u.appendChild(pn());
	}
	A && Fe();
	var d = null, f = /* @__PURE__ */ N(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, ii(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, oi(d, null, s)) : Un(d) : Vn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Nn(() => {
			p = U(f);
			var e = p.length;
			let a = !1;
			A && Re(s) === "[!" != (e === 0) && (s = Le(), Pe(s), Ne(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = P, v = _n(), y = 0; y < e; y += 1) {
				A && j.nodeType === 8 && j.data === "]" && (s = j, a = !0, Ne(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && $t(S.v, b), S.i && $t(S.i, y), v && u.unskip_effect(S.e)) : (S = ai(l, h ? s : ti ??= pn(), b, x, y, i, t, n), h || (S.e.f |= ne), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Pn(() => o(s)) : (d = Pn(() => o(ti ??= pn())), d.f |= ne)), e > c.size && ye("", "", ""), A && e > 0 && Pe(Le()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Ne(!0), U(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, A && (s = j);
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
		if (_.f & 8192 && (Un(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ne, _ === l) oi(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (ei(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ri(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			$r(e, w, te);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ai(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Xt(n) : /* @__PURE__ */ F(n, !1, !1) : null, l = o & 2 ? Xt(i) : null;
	return {
		v: c,
		i: l,
		e: Pn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function oi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ hn(r);
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
	A && Fe();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function li(e, t, n, r, a, o) {
	let s = A;
	A && Fe();
	var c = null;
	A && j.nodeType === 1 && (c = j, Fe());
	var l = A ? j : e, u = new Kr(l, !1);
	Nn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = A ? c : vn(e, o), Mr(c, c), r) {
					var n = null;
					A && Br(e) && c.append(n = document.createComment(""));
					var i = A ? /* @__PURE__ */ mn(c) : c.appendChild(pn());
					A && (i === null ? Ne(!1) : Pe(i)), r(c, i), n?.remove();
				}
				H.nodes.end = c, t.before(c);
			}
			A && Pe(t);
		}), () => {};
	}, E), wn(() => {}), s && (Ne(!0), Pe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ui(e, t, n) {
	kn(() => {
		var r = W(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Mn(() => {
				var e = n();
				G(e), i && Be(a, e) && (a = e, r.update(e));
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
	var o = e[ue];
	if (A || o !== n || o === void 0) {
		var s = hi(n, r, a);
		(!A || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ue] = n;
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
	var i = e[de];
	if (A || i !== t) {
		var a = vi(t, r);
		(!A || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[de] = t;
	} else r && (Array.isArray(r) ? (yi(e, n?.[0], r[0]), yi(e, n?.[1], r[1], "important")) : yi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function xi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return je();
		for (var r of e.options) r.selected = t.includes(wi(r));
		return;
	}
	for (r of e.options) if (on(wi(r), t)) {
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
	}), wn(() => {
		t.disconnect();
	});
}
function Ci(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ft(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), wi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && wi(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), kn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
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
var Ti = Symbol("is custom element"), Ei = Symbol("is html"), Di = he ? "link" : "LINK", Oi = he ? "progress" : "PROGRESS";
function ki(e) {
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
		e[pe] = n, Ze(n), ut();
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
	A && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Di) || i[t] !== (i[t] = n) && (t === "loading" && (e[ce] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Pi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Mi(e) {
	return e[le] ??= {
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
	ft(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Li(e) ? Ri(a) : a, n(a), P !== null && r.add(P), await _r(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (A && e.defaultValue !== e.value || W(t) == null && e.value) && (n(Li(e) ? Ri(e.value) : e.value), P !== null && r.add(P)), Mn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = P;
			if (r.has(i)) return;
		}
		Li(e) && n === Ri(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Ii(e, t, n = t) {
	ft(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (A && e.defaultChecked !== e.checked || W(t) == null) && n(e.checked), Mn(() => {
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
	r && r.set && (e[t] = n, wn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Bi(e, t) {
	return e === t || e?.[oe] === t;
}
function Vi(e = {}, t, n, r) {
	var i = We.r, a = H;
	return kn(() => {
		var o, s;
		return Mn(() => {
			o = s, s = r?.() || [], W(() => {
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
	let t = We, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ xt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Dn(() => {
		Ui(t, r), y(n.b);
	}), Tn(() => {
		let e = W(() => n.m.map(v));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Tn(() => {
		Ui(t, r), y(n.a);
	});
}
function Ui(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
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
		if (t === oe || t === se) return !1;
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
	var i = !He || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ xt(r), U(l)) : (c && (c = !1, s = o ? W(r) : r), s);
	let f;
	if (a) {
		var p = oe in e || se in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = st(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && we(t), f(m)));
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
	var v = !1, y = (n & 1 ? xt : N)(() => (v = !1, g()));
	a && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? rn(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Jn && v || b.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ue();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ki = /* @__PURE__ */ q("<button type=\"button\">＋</button>"), qi = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Ji = /* @__PURE__ */ q("<option> </option>"), Yi = /* @__PURE__ */ q("<span class=\"task-add-contract\"> </span>"), Xi = /* @__PURE__ */ q("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Zi = /* @__PURE__ */ q("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Qi = /* @__PURE__ */ q("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function $i(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ F(""), ee = /* @__PURE__ */ F(""), te = /* @__PURE__ */ F(u()?.creationDefaultValue ?? 4), T = /* @__PURE__ */ F();
	async function E() {
		await _r(), U(T)?.focus?.();
	}
	function D(e) {
		e.preventDefault(), C()({
			title: U(w),
			summary: U(ee),
			priority: u().normalize(U(te), u().creationDefaultValue)
		});
	}
	function O(e) {
		e.key === "Escape" && (e.preventDefault(), S()());
	}
	B(() => G(c()), () => {
		I(n, c() === "task");
	}), B(() => (G(d()), U(n)), () => {
		I(r, d() || (U(n) ? "增加工作項目" : "增加待處理子任務"));
	}), B(() => (G(f()), U(n)), () => {
		I(i, f() || (U(n) ? "任務名稱" : "子任務描述"));
	}), B(() => (G(p()), U(n)), () => {
		I(a, p() || (U(n) ? "新任務名稱" : "新子任務描述"));
	}), B(() => (G(g()), U(n)), () => {
		I(o, g() || (U(n) ? "新任務優先級" : "新子任務優先級"));
	}), B(() => (G(v()), U(n)), () => {
		I(s, v() || (U(n) ? "加入任務" : "新增"));
	}), B(() => G(l()), () => {
		l() && E();
	}), An(), Hi();
	var ne = Ir(), k = R(ne), re = (e) => {
		var t = Ki();
		V(() => {
			Z(t, 1, pi(U(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", U(r));
		}), K("click", t, function(...e) {
			x()?.apply(this, e);
		}), J(e, t);
	}, ie = (e) => {
		var t = Qi(), r = L(t);
		ki(r), Vi(r, (e) => I(T, e), () => U(T));
		var c = z(r, 2), l = (e) => {
			var t = qi();
			ct(t), V(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Fi(t, () => U(ee), (e) => I(ee, e)), J(e, t);
		};
		X(c, (e) => {
			U(n) && e(l);
		});
		var d = z(c, 2);
		ni(d, 5, () => (G(u()), W(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Ji(), r = L(n, !0);
			M(n);
			var i = {};
			V((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(u()), U(t), W(() => u().format(U(t).value)))]), J(e, n);
		}), M(d);
		var f = z(d, 2), p = (e) => {
			var t = Yi(), n = L(t, !0);
			M(t), V(() => Y(n, _())), J(e, t);
		};
		X(f, (e) => {
			U(n) && _() && e(p);
		});
		var g = z(f, 2), v = (e) => {
			var t = Xi(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2), a = L(i), o = L(a, !0);
			M(a);
			var c = z(a, 2), l = L(c, !0);
			M(c), M(i), V(() => {
				Q(n, "hidden", !b()), Y(r, b()), Y(o, y()), Y(l, U(s));
			}), K("click", a, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		}, x = (e) => {
			var t = Zi(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2), a = L(i, !0);
			M(i);
			var o = z(i, 2), c = L(o, !0);
			M(o), V(() => {
				Y(r, y()), Y(a, U(s)), Q(o, "hidden", !b()), Y(c, b());
			}), K("click", n, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		};
		X(g, (e) => {
			U(n) ? e(v) : e(x, -1);
		}), M(t), V(() => {
			Z(t, 1, pi(U(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", U(n) ? 160 : 300), Q(r, "placeholder", U(i)), Q(r, "aria-label", U(a)), Q(d, "aria-label", U(o));
		}), Tr("submit", t, D), K("keydown", t, O), Fi(r, () => U(w), (e) => I(w, e)), Ci(d, () => U(te), (e) => I(te, e)), J(e, t);
	};
	X(k, (e) => {
		l() ? e(ie, -1) : e(re);
	}), J(e, ne), qe();
}
Er(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var ea = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), ta = /* @__PURE__ */ q("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), na = /* @__PURE__ */ q("<div class=\"assessment-metric-grid\"></div>");
function ra(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = na();
	ni(r, 5, n, (e) => e.label, (e, t) => {
		var n = ta(), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2), o = L(a), s = (e) => {
			var n = ea();
			V(() => Z(n, 1, `assessment-tone-dot assessment-tone-${U(t), W(() => U(t).tone) ?? ""}`)), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).tone) && e(s);
		});
		var c = z(o);
		M(a), M(n), V(() => {
			Y(i, (U(t), W(() => U(t).label))), Y(c, ` ${U(t), W(() => U(t).value) ?? ""}`);
		}), J(e, n);
	}), M(r), J(e, r);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentNote.svelte
var ia = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), aa = /* @__PURE__ */ q("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function oa(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = aa(), a = L(i), o = L(a), s = (e) => {
		var t = ia();
		V(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), J(e, t);
	};
	X(o, (e) => {
		r() && e(s);
	});
	var c = z(o);
	M(a), ci(z(a, 2), t, "default", {}, null), M(i), V(() => Y(c, ` ${n() ?? ""}`)), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var sa = /* @__PURE__ */ q("<span class=\"assessment-readout-summary\"> </span>"), ca = /* @__PURE__ */ q("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function la(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = ca(), o = L(a), s = L(o, !0);
	M(o);
	var c = z(o, 2);
	ci(L(c), t, "badges", {}, null), M(c);
	var l = z(c, 2), u = (e) => {
		var t = sa(), n = L(t, !0);
		M(t), V(() => {
			Q(t, "title", i()), Y(n, i());
		}), J(e, t);
	};
	X(l, (e) => {
		i() && e(u);
	});
	var d = z(l, 2), f = L(d, !0);
	M(d), M(a), V(() => {
		Y(s, n()), Y(f, r());
	}), J(e, a);
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var ua = /* @__PURE__ */ q("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function da(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ F(), d = null, f = !1;
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
		U(u)?.close(), m();
	}
	function g(e) {
		e.target === e.currentTarget && h();
	}
	Hi();
	var _ = Ir(), v = R(_), y = (e) => {
		var n = ua(), l = L(n), d = L(l), f = L(d), _ = L(f, !0);
		M(f);
		var v = z(f, 2), y = L(v, !0);
		M(v), M(d);
		var b = z(d, 2);
		M(l), ci(z(l, 2), t, "default", { close: h }, null), M(n), Vi(n, (e) => I(u, e), () => U(u)), ui(n, (e) => p?.(e)), V(() => {
			Z(n, 1, pi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), Y(_, a()), Q(v, "id", s()), Y(y, o()), Q(b, "aria-label", c());
		}), Tr("close", n, m), K("click", n, g), K("click", b, h), J(e, n);
	};
	X(v, (e) => {
		n() && e(y);
	}), J(e, _), qe();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var fa = /* @__PURE__ */ q("<span> </span>"), pa = /* @__PURE__ */ q("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ma = /* @__PURE__ */ q("<!> <!> <!>", 1), ha = /* @__PURE__ */ q("<span slot=\"badges\"> </span>"), ga = /* @__PURE__ */ q("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), _a = /* @__PURE__ */ q("<div class=\"cost-dialog-content\"><!></div>");
function va(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	Hi();
	{
		let t = /* @__PURE__ */ N(() => `關閉${i()}`);
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
				return U(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = _a(), i = L(n), a = (e) => {
					var t = ma(), n = R(t);
					la(n, {
						label: "估算成本",
						get value() {
							return G(s()), W(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Ir();
							ni(R(n), 1, () => (G(s()), W(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = fa(), r = L(n, !0);
								M(n), V(() => {
									Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
								}), J(e, n);
							}), J(e, n);
						} }
					});
					var r = z(n, 2);
					{
						let e = /* @__PURE__ */ N(() => (G(s()), W(() => [
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
							return U(e);
						} });
					}
					var i = z(r, 2), a = (e) => {
						oa(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								J(e, pa());
							},
							$$slots: { default: !0 }
						});
					};
					X(i, (e) => {
						G(s()), W(() => !s().humanConfirmed) && e(a);
					}), J(e, t);
				}, c = (e) => {
					var t = ma(), n = R(t);
					la(n, {
						label: "估算總額",
						get value() {
							return G(o()), W(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ha(), r = L(n, !0);
							M(n), V(() => {
								Z(n, 1, `cost-coverage cost-coverage-${G(o()), W(() => o().coverage) ?? ""}`), Y(r, (G(o()), W(() => o().coverageLabel)));
							}), J(e, n);
						} }
					});
					var r = z(n, 2);
					{
						let e = /* @__PURE__ */ N(() => (G(o()), W(() => [{
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
							return U(e);
						} });
					}
					var i = z(r, 2), a = (e) => {
						oa(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								J(e, ga());
							},
							$$slots: { default: !0 }
						});
					};
					X(i, (e) => {
						G(o()), W(() => o().coverage !== "full") && e(a);
					}), J(e, t);
				};
				X(i, (e) => {
					r() === "item" && s() ? e(a) : o() && e(c, 1);
				}), M(n), J(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var ya = /* @__PURE__ */ q("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), ba = /* @__PURE__ */ q("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), xa = /* @__PURE__ */ q("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Sa = /* @__PURE__ */ q("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Ca(e, t) {
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
	Hi();
	var c = Sa(), l = L(c), u = L(l), d = z(L(u), 2), f = L(d, !0);
	M(d), M(u), Ie(2), M(l);
	var p = z(l, 2), m = (e) => {
		var t = ya(), r = L(t), i = z(L(r), 2), o = L(i, !0);
		M(i), M(r);
		var s = z(r, 2), c = z(L(s), 2), l = L(c, !0);
		M(c), M(s), M(t), V((e, t) => {
			Y(o, e), Y(l, t);
		}, [() => (G(n()), W(() => a(n().before))), () => (G(n()), W(() => a(n().after)))]), J(e, t);
	}, h = (e) => {
		J(e, ba());
	};
	X(p, (e) => {
		G(n()), W(() => n().deliveryChanged) ? e(m) : (G(n()), W(() => n().capacityChanged) && e(h, 1));
	});
	var g = z(p, 2), _ = L(g), v = z(L(_), 2), y = L(v, !0);
	M(v);
	var b = z(v, 2), x = L(b);
	M(b), M(_);
	var S = z(_, 4), C = z(L(S), 2), w = L(C, !0);
	M(C);
	var ee = z(C, 2), te = L(ee);
	M(ee), M(S), M(g);
	var T = z(g, 2), E = L(T), D = z(L(E)), O = L(D, !0);
	M(D), M(E);
	var ne = z(E, 2), k = z(L(ne)), re = L(k, !0);
	M(k), M(ne), M(T);
	var ie = z(T, 2), ae = (e) => {
		var t = xa(), r = z(L(t), 1, !0);
		M(t), V(() => Y(r, (G(n()), W(() => n().reason)))), J(e, t);
	};
	X(ie, (e) => {
		G(n()), W(() => n().reason) && e(ae);
	}), M(c), V((e, t, i, a) => {
		Y(f, r()), Y(y, (G(n()), W(() => n().current.label))), Y(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (G(n()), W(() => `risk-${n().next.urgency ?? "none"}`))), Y(w, (G(n()), W(() => n().next.label))), Y(te, `剩餘容量 ${t ?? ""}`), Y(O, i), Y(re, a);
	}, [
		() => (G(n()), W(() => o(n().current.remainingCapacityMinutes))),
		() => (G(n()), W(() => o(n().next.remainingCapacityMinutes))),
		() => (G(n()), W(() => s(n().capacityDelta))),
		() => (G(n()), W(() => s(n().balanceDelta)))
	]), J(e, c), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var wa = /* @__PURE__ */ q("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Ta(e, t) {
	Ke(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F();
	qr(() => {
		U(o).showModal(), U(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Hi();
	var u = wa(), d = z(L(u), 2);
	Ca(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = z(d, 2), p = L(f);
	Vi(p, (e) => I(s, e), () => U(s));
	var m = z(p, 2), h = L(m, !0);
	M(m), M(f), M(u), Vi(u, (e) => I(o, e), () => U(o)), V(() => {
		p.disabled = r(), m.disabled = r(), Y(h, r() ? "正在儲存…" : "確認儲存");
	}), Tr("cancel", u, c), K("keydown", u, l), K("click", p, function(...e) {
		i()?.apply(this, e);
	}), K("click", m, function(...e) {
		a()?.apply(this, e);
	}), J(e, u), qe();
}
Er(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var Ea = /* @__PURE__ */ q("<div><strong> </strong> <p> </p></div>");
function Da(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Ir();
	ni(R(i), 1, n, Qr, (e, t) => {
		let n = /* @__PURE__ */ N(() => (U(t), W(() => U(t).level ?? "error")));
		var i = Ea(), a = L(i), o = L(a, !0);
		M(a);
		var s = z(a, 2), c = L(s, !0);
		M(s), M(i), V(() => {
			Z(i, 1, `diagnostic diagnostic-${U(n)}`), Y(o, (G(U(n)), W(() => r[U(n)] ?? r.error))), Y(c, (U(t), W(() => U(t).message)));
		}), J(e, i);
	}), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Oa = /* @__PURE__ */ q("<button type=\"button\"> </button>");
function ka(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	B(() => G(a()), () => {
		I(n, a() === "edit");
	}), B(() => U(n), () => {
		I(r, U(n) ? "編輯模式" : "預覽模式");
	}), B(() => U(n), () => {
		I(i, U(n) ? "預覽模式" : "編輯模式");
	}), An(), Hi();
	var d = Oa();
	let f;
	var p = L(d, !0);
	M(d), V(() => {
		f = Z(d, 1, "view-mode-toggle editor-mode-dock", null, f, { "is-editing": U(n) }), Q(d, "aria-label", `切換到${U(i)}（目前為${U(r)}）`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), Y(p, U(i));
	}), K("click", d, () => u()(U(n) ? "preview" : "edit")), J(e, d), qe();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Aa = /* @__PURE__ */ q("<span></span>"), ja = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), Ma = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>"), Na = /* @__PURE__ */ q("<div role=\"toolbar\"></div>");
function Pa(e, t) {
	Ke(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = !1, u = null, d = /* @__PURE__ */ F(null), f = /* @__PURE__ */ F();
	async function p() {
		let e = U(d);
		I(d, null), await _r(), [...U(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		I(s, null), I(c, null);
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
		I(d, r), o()(e, t, n);
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
		I(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!U(s) || e.id === U(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", I(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || U(c)?.id === e.id && I(c, null);
	}
	function ee(e, t) {
		if (!U(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = U(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function te() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function T(e, t) {
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
	function E(e, t) {
		if (!u || u.pointerId !== t.pointerId) return;
		let n = t.clientX - u.startX, r = t.clientY - u.startY;
		if (!u.active) {
			if (Math.hypot(n, r) < 8 || Math.abs(r) > Math.abs(n)) return;
			u.active = !0, l = !0, I(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, I(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), I(c, {
			id: a,
			placeAfter: u.placeAfter
		});
	}
	function D(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	B(() => (G(n()), U(d)), () => {
		n() && U(d) && p();
	}), An(), Hi();
	var O = Na();
	ni(O, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ N(() => (U(t), W(() => U(t).sortable !== !1)));
		var r = Ma(), i = L(r), a = L(i, !0);
		M(i);
		var o = z(i, 2), l = (e) => {
			var n = Aa();
			V(() => Z(n, 1, (U(t), W(() => `time-risk-dot ${U(t).dotClass ?? ""}`)))), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			J(e, ja());
		};
		X(u, (e) => {
			U(t), W(() => U(t).showChevron) && e(d);
		}), M(r), V((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (U(t), W(() => U(t).id))), Q(r, "data-reorder-capsule", U(n) ? "true" : null), Q(r, "aria-pressed", (U(t), W(() => U(t).pressed ?? null))), Q(r, "aria-label", (U(t), W(() => U(t).ariaLabel ?? U(t).label))), Q(r, "aria-keyshortcuts", U(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (U(t), W(() => U(t).title ?? null))), r.disabled = (U(t), W(() => U(t).disabled ?? !1)), Q(r, "draggable", U(n)), Y(a, (U(t), W(() => U(t).label)));
		}, [() => (U(t), G(U(n)), U(s), U(c), W(() => `capsule-button ${U(t).className ?? ""} ${U(n) ? "capsule-sortable" : ""} ${U(s) === U(t).id ? "capsule-dragging" : ""} ${h(U(t).id, U(c))}`))]), K("click", r, (e) => b(U(t), e)), K("keydown", r, function(...e) {
			(U(n) ? (e) => x(U(t), e) : null)?.apply(this, e);
		}), Tr("dragstart", r, function(...e) {
			(U(n) ? (e) => S(U(t), e) : null)?.apply(this, e);
		}), Tr("dragover", r, function(...e) {
			(U(n) ? (e) => C(U(t), e) : null)?.apply(this, e);
		}), Tr("dragleave", r, function(...e) {
			(U(n) ? (e) => w(U(t), e) : null)?.apply(this, e);
		}), Tr("drop", r, function(...e) {
			(U(n) ? (e) => ee(U(t), e) : null)?.apply(this, e);
		}), Tr("dragend", r, function(...e) {
			(U(n) ? te : null)?.apply(this, e);
		}), K("pointerdown", r, function(...e) {
			(U(n) ? (e) => T(U(t), e) : null)?.apply(this, e);
		}), K("pointermove", r, function(...e) {
			(U(n) ? (e) => E(U(t), e) : null)?.apply(this, e);
		}), K("pointerup", r, function(...e) {
			(U(n) ? D : null)?.apply(this, e);
		}), Tr("pointercancel", r, function(...e) {
			(U(n) ? D : null)?.apply(this, e);
		}), J(e, r);
	}), M(O), Vi(O, (e) => I(f, e), () => U(f)), V(() => {
		Z(O, 1, `horizontal-capsule-strip ${r()}`), Q(O, "aria-label", i());
	}), J(e, O), qe();
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
function Fa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	B(() => G(a()), () => {
		I(n, new Map(a().map((e, t) => [e, t])));
	}), B(() => (G(i()), U(n), G(a())), () => {
		I(r, [...i()].sort((e, t) => (U(n).get(e.id) ?? a().length) - (U(n).get(t.id) ?? a().length)));
	}), An(), Hi();
	var u = Ir(), d = R(u), f = (e) => {
		Pa(e, {
			get items() {
				return U(r);
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
	X(d, (e) => {
		U(r), W(() => U(r).length) && e(f);
	}), J(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Ia = /* @__PURE__ */ q("<i></i>"), La = /* @__PURE__ */ q("<div role=\"img\"></div>"), Ra = /* @__PURE__ */ q("<progress max=\"100\"></progress>");
function za(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending",
		"active"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	B(() => G(o()), () => {
		I(n, d(o()));
	}), B(() => G(a()), () => {
		I(r, Array.isArray(a()) ? a() : []);
	}), An(), Hi();
	var f = Ir(), p = R(f), m = (e) => {
		var t = La();
		ni(t, 5, () => U(r), Qr, (e, t) => {
			var n = Ia();
			V((e) => Z(n, 1, e), [() => (U(t), W(() => `progress-cell${u(U(t))}`))]), J(e, n);
		}), M(t), V(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), J(e, t);
	}, h = (e) => {
		var t = Ra();
		V(() => {
			Z(t, 1, `progress-meter ${c()}`), Ai(t, U(n)), Q(t, "aria-label", s());
		}), J(e, t);
	};
	X(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), J(e, f), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Ba = /* @__PURE__ */ q("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Va(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	B(() => (G(r()), G(i()), G(a()), G(o())), () => {
		I(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), An(), Hi();
	var s = Ba(), c = R(s), l = L(c), u = L(l);
	M(l), M(c);
	var d = z(c, 2);
	{
		let e = /* @__PURE__ */ N(() => r() / 100);
		za(d, {
			form: "segmented",
			get cells() {
				return o();
			},
			get ratio() {
				return U(e);
			},
			get label() {
				return U(n);
			},
			extraClass: "project-progress-meter"
		});
	}
	V(() => Y(u, `整體約 ${r() ?? ""}%`)), J(e, s), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var Ha = /* @__PURE__ */ q("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ua = /* @__PURE__ */ q("<p class=\"hero-summary\"> </p>");
function Wa(e, t) {
	Ke(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	Hi();
	var c = Ir(), l = R(c), u = (e) => {
		var t = Ha();
		ct(t), V(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Ai(t, i());
		}), K("input", t, (e) => s()(e.currentTarget.value)), J(e, t);
	}, d = (e) => {
		var t = Ua(), r = L(t, !0);
		M(t), V(() => Y(r, n())), J(e, t);
	};
	X(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), J(e, c), qe();
}
Er(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Ga = /* @__PURE__ */ q("<a class=\"scope-developer-link\"> </a>"), Ka = /* @__PURE__ */ q("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function qa(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Ir();
	ni(R(i), 1, n, (e) => e.id, (e, t) => {
		var n = Ka(), i = L(n), a = L(i, !0);
		M(i);
		var o = z(i, 2), s = (e) => {
			var n = Ga(), i = L(n, !0);
			M(n), V(() => {
				Q(n, "href", (U(t), W(() => U(t).baseOnlyHref))), Y(i, r());
			}), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).baseOnlyHref) && e(s);
		}), M(n), V(() => {
			Q(i, "href", (U(t), W(() => U(t).href))), Y(a, (U(t), W(() => U(t).id)));
		}), J(e, n);
	}), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Ja = /* @__PURE__ */ q("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ya = /* @__PURE__ */ q("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Xa = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Za(e, t) {
	Ke(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Hi();
	var y = Xa(), b = R(y), x = L(b, !0);
	M(b);
	var S = z(b, 2), C = L(S), w = L(C, !0);
	M(C);
	var ee = z(C, 2), te = L(ee, !0);
	M(ee), M(S);
	var T = z(S, 2), E = (e) => {
		var t = Ja(), a = L(t, !0);
		M(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), Y(a, i());
		}), K("click", t, () => r()(!n())), J(e, t);
	};
	X(T, (e) => {
		r() && e(E);
	});
	var D = z(T, 2), O = (e) => {
		var t = Ya(), n = R(t), r = L(n, !0);
		M(n);
		var i = z(n, 2), s = L(i, !0);
		M(i), V(() => {
			n.disabled = o(), Y(r, m()), i.disabled = !a() || o(), Y(s, o() ? d() : u());
		}), K("click", n, function(...e) {
			v()?.apply(this, e);
		}), K("click", i, function(...e) {
			h()?.apply(this, e);
		}), J(e, t);
	};
	X(D, (e) => {
		n() && e(O);
	}), V(() => {
		Y(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), Y(w, f()), Q(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), Y(te, p());
	}), K("click", C, function(...e) {
		g()?.apply(this, e);
	}), K("click", ee, function(...e) {
		_()?.apply(this, e);
	}), J(e, y), qe();
}
Er(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var Qa = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function $a(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	B(() => (G(u()), G(p()), G(l())), () => {
		I(n, {
			id: Qa,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), B(() => G(o()), () => {
		I(r, new Map(o().map((e) => [e.id, e])));
	}), B(() => (G(s()), G(o())), () => {
		I(i, s().length > 0 ? s() : [Qa, ...o().map((e) => e.id)]);
	}), B(() => (U(i), U(n), U(r), G(c()), G(p())), () => {
		I(a, U(i).map((e) => e === "__default__" ? U(n) : U(r).get(e)).filter(Boolean).map((e) => e === U(n) ? e : v(e, c(), p())));
	}), An(), Hi();
	{
		let t = /* @__PURE__ */ N(() => `filter-strip ${f()}`);
		Pa(e, {
			get items() {
				return U(a);
			},
			get className() {
				return U(t);
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
	qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var eo = /* @__PURE__ */ q("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function to(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = {
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
	B(() => (G(i()), G(r())), () => {
		I(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), An(), Hi();
	var o = Ir();
	ni(R(o), 1, () => U(n), (e) => e.status, (e, t) => {
		var n = eo(), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2), o = L(a, !0);
		M(a), M(n), V(() => {
			Z(n, 1, (U(t), W(() => `overview-card overview-${U(t).tone}`))), Q(n, "data-status", (U(t), W(() => U(t).status))), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), J(e, o), qe();
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
var io = /* @__PURE__ */ Pr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), ao = /* @__PURE__ */ Pr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), oo = /* @__PURE__ */ Pr("<path d=\"M3 3l18 18\"></path>"), so = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function co(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = so(), a = L(i), o = (e) => {
		J(e, io());
	}, s = (e) => {
		var t = ao();
		Ie(), J(e, t);
	};
	X(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		J(e, oo());
	};
	X(c, (e) => {
		r() && e(l);
	}), M(i), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var lo = /* @__PURE__ */ q("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), uo = /* @__PURE__ */ q("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function fo(e, t) {
	Ke(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Hi();
	var l = uo(), u = R(l);
	let d;
	var f = L(u), p = L(f), m = L(p, !0);
	M(p), M(f);
	var h = z(f, 2), g = (e) => {
		var t = lo(), n = L(t);
		{
			let e = /* @__PURE__ */ N(() => !r());
			co(n, { get closed() {
				return U(e);
			} });
		}
		M(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), K("click", t, () => i()(!r())), J(e, t);
	};
	X(h, (e) => {
		n() && e(g);
	}), ci(z(h, 2), t, "header", {}, null), M(u);
	var _ = z(u, 2);
	ci(L(_), t, "default", {}, null), M(_), V(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), Y(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), K("click", f, () => c()(!a())), J(e, l), qe();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var po = /* @__PURE__ */ q("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span>", 1), mo = /* @__PURE__ */ q("<span class=\"developer-expand-hint\">展開作法與方向</span>"), ho = /* @__PURE__ */ q("<!> <!>", 1), go = /* @__PURE__ */ q("<li> </li>"), _o = /* @__PURE__ */ q("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), vo = /* @__PURE__ */ q("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), yo = /* @__PURE__ */ q("<code class=\"reference\"> </code>"), bo = /* @__PURE__ */ q("<article class=\"decision-item\"><p> </p> <!></article>"), xo = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), So = /* @__PURE__ */ q("<p> </p>"), Co = /* @__PURE__ */ q("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), wo = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), To = /* @__PURE__ */ q("<div class=\"path-list\"></div>"), Eo = /* @__PURE__ */ q("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Do = /* @__PURE__ */ q("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function Oo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = /* @__PURE__ */ F(), s = $(t, "developer", 8, null);
	B(() => G(s()), () => {
		I(n, s()?.next_steps ?? []);
	}), B(() => (G(s()), U(n)), () => {
		I(r, s()?.next_step ?? U(n)[0] ?? null);
	}), B(() => (G(s()), U(n)), () => {
		I(i, s()?.next_step ? U(n) : U(n).slice(1));
	}), B(() => (U(i), G(s())), () => {
		I(a, !!(U(i).length || s()?.blockers?.length || s()?.decisions?.length || s()?.routes?.length || s()?.claim));
	}), B(() => (U(r), U(a)), () => {
		I(o, !!U(r) || U(a));
	}), An(), Hi();
	var c = Ir(), l = R(c), u = (e) => {
		var t = Ir();
		li(R(t), () => U(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = ho(), o = R(n);
			li(o, () => U(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = ho(), i = R(n), o = (e) => {
					var t = po(), n = z(R(t), 2), i = L(n, !0);
					M(n), V(() => Y(i, U(r))), J(e, t);
				};
				X(i, (e) => {
					U(r) && e(o);
				});
				var s = z(i, 2), c = (e) => {
					J(e, mo());
				};
				X(s, (e) => {
					U(a) && e(c);
				}), J(t, n);
			});
			var c = z(o, 2), l = (e) => {
				var t = Do(), n = z(L(t), 2), r = (e) => {
					var t = _o(), n = z(L(t), 2);
					ni(n, 5, () => U(i), Qr, (e, t) => {
						var n = go(), r = L(n, !0);
						M(n), V(() => Y(r, U(t))), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(n, (e) => {
					U(i), W(() => U(i).length) && e(r);
				});
				var a = z(n, 2), o = (e) => {
					var t = vo(), n = z(L(t), 2);
					ni(n, 5, () => (G(s()), W(() => s().blockers)), Qr, (e, t) => {
						var n = go(), r = L(n, !0);
						M(n), V(() => Y(r, U(t))), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(a, (e) => {
					G(s()), W(() => s().blockers?.length) && e(o);
				});
				var c = z(a, 2), l = (e) => {
					var t = xo(), n = z(L(t), 2);
					ni(n, 5, () => (G(s()), W(() => s().decisions)), Qr, (e, t) => {
						var n = bo(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = (e) => {
							var n = yo(), r = L(n, !0);
							M(n), V(() => Y(r, (U(t), W(() => U(t).reference)))), J(e, n);
						};
						X(a, (e) => {
							U(t), W(() => U(t).reference) && e(o);
						}), M(n), V(() => Y(i, (U(t), W(() => U(t).summary)))), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(c, (e) => {
					G(s()), W(() => s().decisions?.length) && e(l);
				});
				var u = z(c, 2), d = (e) => {
					var t = wo(), n = z(L(t), 2);
					ni(n, 5, () => (G(s()), W(() => s().routes)), Qr, (e, t) => {
						var n = Co(), r = L(n), i = L(r), a = L(i, !0);
						M(i);
						var o = z(i, 2), s = L(o, !0);
						M(o), M(r);
						var c = z(r, 2), l = (e) => {
							var n = So(), r = L(n, !0);
							M(n), V(() => Y(r, (U(t), W(() => U(t).reason)))), J(e, n);
						};
						X(c, (e) => {
							U(t), W(() => U(t).reason) && e(l);
						}), M(n), V(() => {
							Y(a, (U(t), W(() => U(t).title))), Z(o, 1, (U(t), W(() => `route-state route-${U(t).state}`))), Y(s, (U(t), W(() => U(t).state)));
						}), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(u, (e) => {
					G(s()), W(() => s().routes?.length) && e(d);
				});
				var f = z(u, 2), p = (e) => {
					var t = Eo(), n = z(L(t), 2), r = L(n);
					M(n);
					var i = z(n, 2), a = (e) => {
						var t = So(), n = L(t);
						M(t), V(() => Y(n, `Worktree: ${G(s()), W(() => s().claim.worktree) ?? ""}`)), J(e, t);
					};
					X(i, (e) => {
						G(s()), W(() => s().claim.worktree) && e(a);
					});
					var o = z(i, 2), c = (e) => {
						var t = To();
						ni(t, 5, () => (G(s()), W(() => s().claim.source_paths)), Qr, (e, t) => {
							var n = yo(), r = L(n, !0);
							M(n), V(() => Y(r, U(t))), J(e, n);
						}), M(t), J(e, t);
					};
					X(o, (e) => {
						G(s()), W(() => s().claim.source_paths?.length) && e(c);
					}), M(t), V(() => Y(r, `Agent: ${G(s()), W(() => s().claim.agent) ?? ""}`)), J(e, t);
				};
				X(f, (e) => {
					G(s()), W(() => s().claim) && e(p);
				}), M(t), J(e, t);
			};
			X(c, (e) => {
				U(a) && e(l);
			}), J(t, n);
		}), J(e, t);
	};
	X(l, (e) => {
		s() && U(o) && e(u);
	}), J(e, c), qe();
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
function jo(e) {
	let t = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
	return Ao(e).map((e) => ({
		...e,
		units: e.href ? [e.text] : t ? Array.from(t.segment(e.text), (e) => e.segment) : Array.from(e.text)
	}));
}
//#endregion
//#region viewer/assets/expandable-text.js
function Mo(e, t = {}) {
	let n = e.ownerDocument, r = n.defaultView, i = n.createElement("div"), a = n.createElement("span"), o = n.createElement("button"), s = n.createElement("span"), c = n.createElement("span");
	c.className = "expandable-text__label", o.append(s, c), i.className = "expandable-text__content", o.className = "expandable-text__toggle", o.type = "button", e.classList.add("expandable-text"), i.append(a, o), e.append(i);
	let l = n.createElement("div"), u = n.createElement("span"), d = n.createElement("button");
	l.className = "expandable-text__content expandable-text__measure", l.setAttribute("aria-hidden", "true"), l.inert = !0, d.className = "expandable-text__toggle", l.append(u, d), e.append(l);
	let f, p = !1, m = 0, h = !1, g = [], _ = [], v = [], y = 0;
	function b(e) {
		return e.replaceChildren(), g.map((t) => {
			let r = n.createElement(t.href ? "a" : "span");
			return t.href && (r.className = "expandable-text__link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text), e.append(r), r;
		});
	}
	function x(e, t) {
		g.forEach((n, r) => {
			let i = Math.max(0, Math.min(t, n.units.length));
			t -= i, n.href ? e[r].hidden = !i : e[r].textContent = n.units.slice(0, i).join("");
		});
	}
	function S() {
		let e = String(p ? f.lessLabel : f.moreLabel), t = p ? "" : e.match(/^(?:…|\.{3})/)?.[0] ?? "";
		s.textContent = t, c.textContent = e.slice(t.length), o.setAttribute("aria-expanded", String(p)), d.textContent = e;
	}
	function C() {
		if (m = 0, !i.getClientRects().length || !i.clientWidth) return;
		let e = parseFloat(r.getComputedStyle(i).lineHeight) * f.lines + 1;
		l.style.width = `${i.clientWidth}px`, x(v, y), d.hidden = !0;
		let t = l.scrollHeight > e;
		if (d.hidden = !t, o.hidden = !t, t && _.some((e, t) => g[t].href && e === n.activeElement) && (p = !0, S()), !t && p && (p = !1, S()), t && !p) {
			let t = 0, n = y;
			for (; t < n;) {
				let r = Math.ceil((t + n) / 2);
				x(v, r), l.scrollHeight <= e ? t = r : n = r - 1;
			}
			x(_, t);
		} else x(_, y);
	}
	function w() {
		!h && !m && (m = r.requestAnimationFrame(C));
	}
	function ee(e = {}) {
		let t = String(e.text ?? ""), n = Number.isInteger(e.lines) && e.lines > 0 ? e.lines : 2, r = !f || f.text !== t, i = e.expanded === !0;
		r || f.lines !== n ? p = i : i && !f.open && (p = !0), f = {
			text: t,
			lines: n,
			open: i,
			moreLabel: e.moreLabel ?? "…更多",
			lessLabel: e.lessLabel ?? "收合"
		}, r && (g = jo(t), y = g.reduce((e, t) => e + t.units.length, 0), _ = b(a), v = b(u), x(_, y)), S(), w();
	}
	function te() {
		p = !p, S(), w();
	}
	o.hidden = !0, o.addEventListener("click", te);
	let T = new r.ResizeObserver(w);
	return T.observe(i), n.fonts?.addEventListener("loadingdone", w), ee(t), {
		update: ee,
		destroy() {
			h = !0, r.cancelAnimationFrame(m), T.disconnect(), n.fonts?.removeEventListener("loadingdone", w), o.removeEventListener("click", te), i.remove(), l.remove(), e.classList.remove("expandable-text");
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/ExpandableText.svelte
var No = /* @__PURE__ */ q("<div></div>");
function Po(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "lines", 8, 2), i = $(t, "moreLabel", 8, "…更多"), a = $(t, "lessLabel", 8, "收合"), o = $(t, "expanded", 8, !1);
	var s = No();
	ui(s, (e, t) => Mo?.(e, t), () => ({
		text: n(),
		lines: r(),
		moreLabel: i(),
		lessLabel: a(),
		expanded: o()
	})), J(e, s);
}
//#endregion
//#region viewer/assets/item-reference.js
function Fo({ scopeId: e, taskId: t, item: n, titleLength: r = 24 }) {
	if (!e || !t || !n?.id || n.legacy) return null;
	let i = Ao(n.title).map((e) => e.text).join("").replace(/\s+/gu, " ").trim(), a = Array.from(i), o = a.length > r ? `${a.slice(0, r).join("")}…` : i;
	return `${e} › ${t} › ${n.id}${o ? `「${o}」` : ""}`;
}
async function Io(e, t = globalThis.document) {
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
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Lo = /* @__PURE__ */ q("<button type=\"button\" class=\"item-row-grip\" draggable=\"true\" title=\"拖曳換位（限同優先級）\">⠿</button>"), Ro = /* @__PURE__ */ q("<span aria-hidden=\"true\"> </span>"), zo = /* @__PURE__ */ q("<option> </option>"), Bo = /* @__PURE__ */ q("<select class=\"inline-priority-select\"></select>"), Vo = /* @__PURE__ */ q("<span> </span>"), Ho = /* @__PURE__ */ q("<span class=\"item-row-priority\"><!></span>"), Uo = /* @__PURE__ */ q("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), Wo = /* @__PURE__ */ q("<a class=\"document-source-link\"><span class=\"source-icon\" aria-hidden=\"true\"> </span> <span class=\"source-label\"> </span></a>"), Go = /* @__PURE__ */ q("<span class=\"document-source-link source-unavailable\"><span class=\"source-icon\" aria-hidden=\"true\">⚠️</span> <span class=\"source-label\">來源不可用</span></span>"), Ko = /* @__PURE__ */ q("<div class=\"item-row-text\"><!> <!></div>"), qo = /* @__PURE__ */ q("<button type=\"button\"> </button>"), Jo = /* @__PURE__ */ q("<select class=\"inline-status-select\"></select>"), Yo = /* @__PURE__ */ q("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), Xo = /* @__PURE__ */ q("<li><!> <!> <div class=\"item-row-description\"><!></div> <!> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function Zo(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F(), c = $(t, "taskId", 8), l = $(t, "field", 8), u = $(t, "item", 8), d = $(t, "editing", 8), f = $(t, "policy", 8), p = $(t, "onCommand", 8), m = $(t, "moduleCapsules", 24, () => []), h = $(t, "onModuleActivate", 8, () => {}), g = $(t, "moduleOrder", 24, () => ["time"]), _ = $(t, "onModuleReorder", 8, () => {}), v = $(t, "leadItem", 8, !1), y = $(t, "reorder", 8, null), b = $(t, "scopeId", 8, null), x = /* @__PURE__ */ F(""), S;
	async function C() {
		clearTimeout(S), I(x, await Io(U(n)) ? "已複製" : "無法複製"), S = setTimeout(() => {
			I(x, "");
		}, 1500);
	}
	let w = /* @__PURE__ */ F(f().normalize(u().priority, f().fallbackValue)), ee = $(t, "statuses", 24, () => []), te = /* @__PURE__ */ F(u().status ?? (l() === "completed_items" ? "done" : "planned"));
	function T(e) {
		e !== U(a) && p()({
			type: "set-item-status",
			taskId: c(),
			field: l(),
			itemId: u().id,
			status: e
		});
	}
	function E(e) {
		h()(e, {
			taskId: c(),
			itemId: u().id,
			itemTitle: u().title
		});
	}
	B(() => (G(d()), G(b()), G(c()), G(u())), () => {
		I(n, d() ? null : Fo({
			scopeId: b(),
			taskId: c(),
			item: u()
		}));
	}), B(() => (G(f()), G(u())), () => {
		I(r, f().metadata(u().priority));
	}), B(() => (G(f()), G(u())), () => {
		I(i, f().format(u().priority));
	}), B(() => (G(f()), G(u())), () => {
		I(w, f().normalize(u().priority, f().fallbackValue));
	}), B(() => (G(u()), G(l())), () => {
		I(a, u().status ?? (l() === "completed_items" ? "done" : "planned"));
	}), B(() => U(a), () => {
		I(te, U(a));
	}), B(() => (G(ee()), U(a)), () => {
		I(o, ee().find((e) => e.value === U(a)) ?? {
			label: U(a),
			tone: "muted"
		});
	}), B(() => U(o), () => {
		I(s, U(o).label);
	}), An(), Hi();
	var D = Xo();
	let O;
	var ne = L(D), k = (e) => {
		var t = Lo();
		V(() => {
			Q(t, "data-item-ref", (G(c()), G(u()), W(() => `${c()}/${u().id}`))), Q(t, "aria-label", (G(u()), W(() => `移動「${u().title}」（Alt+↑／↓，限同優先級）`)));
		}), Tr("dragstart", t, function(...e) {
			y().start?.apply(this, e);
		}), Tr("dragend", t, function(...e) {
			y().end?.apply(this, e);
		}), K("keydown", t, function(...e) {
			y().keydown?.apply(this, e);
		}), J(e, t);
	}, re = (e) => {
		var t = Ro(), n = L(t, !0);
		M(t), V(() => {
			Z(t, 1, `item-row-marker item-row-marker-${U(a)}`), Y(n, U(a) === "done" ? "✓" : "○");
		}), J(e, t);
	};
	X(ne, (e) => {
		y() && d() ? e(k) : e(re, -1);
	});
	var ie = z(ne, 2), ae = (e) => {
		var t = Ho(), n = L(t), a = (e) => {
			var t = Bo();
			ni(t, 5, () => (G(f()), W(() => f().levels)), (e) => e.value, (e, t) => {
				var n = zo(), r = L(n, !0);
				M(n);
				var i = {};
				V((e) => {
					Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
				}, [() => (G(f()), U(t), W(() => f().format(U(t).value)))]), J(e, n);
			}), M(t), V(() => Q(t, "aria-label", (G(u()), W(() => `設定「${u().title}」的優先級`)))), K("change", t, () => p()({
				type: "set-item-field",
				taskId: c(),
				field: l(),
				itemId: u().id,
				property: "priority",
				value: Number(U(w))
			})), Ci(t, () => U(w), (e) => I(w, e)), J(e, t);
		}, o = (e) => {
			var t = Vo(), n = L(t, !0);
			M(t), V(() => {
				Z(t, 1, (U(r), W(() => `priority-badge priority-${U(r).tone}`))), Y(n, U(i));
			}), J(e, t);
		};
		X(n, (e) => {
			d() ? e(a) : e(o, -1);
		}), M(t), J(e, t);
	};
	X(ie, (e) => {
		G(d()), U(a), U(r), G(f()), W(() => d() || U(a) !== "done" && U(r) && (!U(r).hidden || !f().labelsValid)) && e(ae);
	});
	var oe = z(ie, 2), se = L(oe), ce = (e) => {
		var t = Uo();
		ki(t), V(() => {
			Q(t, "aria-label", (G(u()), W(() => `編輯子項目：${u().title}`))), Q(t, "title", (G(u()), W(() => u().title))), Ai(t, (G(u()), W(() => u().title)));
		}), K("input", t, (e) => p()({
			type: "set-item-field",
			taskId: c(),
			field: l(),
			itemId: u().id,
			property: "title",
			value: e.currentTarget.value
		})), J(e, t);
	}, le = (e) => {
		var t = Ko(), n = L(t), r = (e) => {
			var t = Ir(), n = R(t), r = (e) => {
				var t = Wo(), n = L(t), r = L(n, !0);
				M(n);
				var i = z(n, 2), a = L(i, !0);
				M(i), M(t), V(() => {
					Q(t, "href", (G(u()), W(() => u().sourceRef.href))), Q(t, "title", (G(u()), W(() => `開啟 ${u().sourceRef.kind}: ${u().sourceRef.task}`))), Y(r, (G(u()), W(() => u().sourceRef.kind === "checklist" ? "📋" : "⚖"))), Y(a, (G(u()), W(() => u().sourceRef.label)));
				}), J(e, t);
			}, i = (e) => {
				var t = Go();
				V(() => Q(t, "title", (G(u()), W(() => u().sourceRef.error ?? "來源無法讀取")))), J(e, t);
			};
			X(n, (e) => {
				G(u()), W(() => u().sourceRef.available) ? e(r) : e(i, -1);
			}), J(e, t);
		};
		X(n, (e) => {
			G(u()), W(() => u().sourceRef) && e(r);
		}), Po(z(n, 2), {
			get text() {
				return G(u()), W(() => u().title);
			},
			lines: 1,
			get expanded() {
				return v();
			}
		}), M(t), J(e, t);
	};
	X(se, (e) => {
		d() ? e(ce) : e(le, -1);
	}), M(oe);
	var ue = z(oe, 2), de = (e) => {
		var t = qo();
		let r;
		var i = L(t, !0);
		M(t), V(() => {
			r = Z(t, 1, "item-row-copy", null, r, {
				"is-done": U(x),
				"is-copied": U(x) === "已複製"
			}), Q(t, "data-item-ref", (G(c()), G(u()), W(() => `${c()}/${u().id}`))), Q(t, "aria-label", (U(x), G(u()), W(() => U(x) || `複製「${u().title}」的參照`))), Q(t, "title", U(x) || U(n)), Y(i, U(x) === "已複製" ? "✓" : U(x) ? "✕" : "⧉");
		}), K("click", t, C), J(e, t);
	};
	X(ue, (e) => {
		U(n) && e(de);
	});
	var fe = z(ue, 2), pe = L(fe);
	Fa(L(pe), {
		get capsules() {
			return m();
		},
		get moduleOrder() {
			return g();
		},
		onActivate: E,
		get onReorder() {
			return _();
		}
	}), M(pe);
	var me = z(pe, 2), he = L(me), ge = (e) => {
		var t = Jo();
		ni(t, 5, ee, (e) => e.value, (e, t) => {
			var n = zo(), r = L(n, !0);
			M(n);
			var i = {};
			V(() => {
				Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}), J(e, n);
		}), M(t), V(() => Q(t, "aria-label", (G(u()), W(() => `設定「${u().title}」的狀態`)))), K("change", t, () => T(U(te))), Ci(t, () => U(te), (e) => I(te, e)), J(e, t);
	}, _e = (e) => {
		var t = Vo(), n = L(t, !0);
		M(t), V(() => {
			Z(t, 1, (U(o), W(() => `item-status-capsule status-${U(o).tone}`))), Y(n, U(s));
		}), J(e, t);
	};
	X(he, (e) => {
		d() ? e(ge) : e(_e, -1);
	}), M(me);
	var ve = z(me, 2), ye = (e) => {
		var t = Yo(), n = L(t);
		M(t), V(() => Q(n, "aria-label", (G(u()), W(() => `刪除子項目：${u().title}`)))), K("click", n, () => p()({
			type: "delete-item",
			taskId: c(),
			field: l(),
			itemId: u().id
		})), J(e, t);
	};
	X(ve, (e) => {
		d() && e(ye);
	}), M(fe), M(D), V(() => {
		O = Z(D, 1, "editor-item-row", null, O, {
			"editable-work-item": d(),
			"item-drop-before": d() && y()?.side === "before",
			"item-drop-after": d() && y()?.side === "after",
			"item-gap-before": !d() && y()?.side === "before",
			"item-gap-after": !d() && y()?.side === "after",
			"item-row-reorderable": !d() && !!y(),
			"item-row-dragging": !!y()?.dragging
		}), Q(D, "draggable", (G(d()), G(y()), W(() => !d() && y()?.armed ? "true" : void 0)));
	}), K("pointerdown", D, function(...e) {
		(d() ? void 0 : y()?.arm)?.apply(this, e);
	}), K("pointerup", D, function(...e) {
		(d() ? void 0 : y()?.disarm)?.apply(this, e);
	}), Tr("dragstart", D, function(...e) {
		(d() ? void 0 : y()?.start)?.apply(this, e);
	}), Tr("dragend", D, function(...e) {
		(d() ? void 0 : y()?.end)?.apply(this, e);
	}), K("keydown", D, function(...e) {
		(d() ? void 0 : y()?.keydown)?.apply(this, e);
	}), Tr("dragover", D, function(...e) {
		(y()?.over)?.apply(this, e);
	}), Tr("dragleave", D, function(...e) {
		(y()?.leave)?.apply(this, e);
	}), Tr("drop", D, function(...e) {
		(y()?.drop)?.apply(this, e);
	}), J(e, D), qe();
}
Er([
	"pointerdown",
	"pointerup",
	"keydown",
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
var Qo = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(Qo.levels.map((e) => [e.value, e])));
var $o = Qo.fallbackValue;
function es(e) {
	return Qo.normalize(e, $o);
}
function ts(e) {
	return es(typeof e == "object" && e && !Array.isArray(e) ? e.priority : void 0);
}
function ns(e) {
	return [...e ?? []].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, t) => ts(e.item) - ts(t.item) || e.index - t.index).map(({ item: e }) => e);
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
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var rs = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), is = /* @__PURE__ */ q("<div class=\"task-summary\"><!></div>"), as = /* @__PURE__ */ q("<button type=\"button\" class=\"completed-more\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> </button>"), os = /* @__PURE__ */ q("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul> <!></section>"), ss = /* @__PURE__ */ q("<option> </option>"), cs = /* @__PURE__ */ q("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), ls = /* @__PURE__ */ q("<button class=\"spike-add-button\" type=\"button\">＋</button>"), us = /* @__PURE__ */ q("<div class=\"spike-add-shell\"><!></div>"), ds = /* @__PURE__ */ q("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), fs = /* @__PURE__ */ q("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), ps = /* @__PURE__ */ q("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), ms = /* @__PURE__ */ q("<h3> </h3>"), hs = /* @__PURE__ */ q("<span> </span>"), gs = /* @__PURE__ */ q("<div class=\"task-module-totals\"></div>"), _s = /* @__PURE__ */ q("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), vs = /* @__PURE__ */ q("<article><!></article>");
function ys(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "progress", 8), p = $(t, "editing", 8), m = $(t, "policy", 8), h = $(t, "onCommand", 8), g = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let _ = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), v = $(t, "onModuleActivate", 8, () => {}), y = $(t, "moduleOrder", 24, () => ["time"]), b = $(t, "onModuleReorder", 8, () => {}), x = $(t, "statusOrder", 24, () => ["done", "planned"]), S = $(t, "moduleTotals", 24, () => []), C = $(t, "lead", 8, !1), w = $(t, "scopeId", 8, null), ee = $(t, "reorderable", 8, !1), te = $(t, "onReorder", 8, () => {}), T = /* @__PURE__ */ F(!1), E = [
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
	], D = /* @__PURE__ */ F(!1), O = /* @__PURE__ */ F(""), ne = /* @__PURE__ */ F(m().creationDefaultValue), k = /* @__PURE__ */ F(""), re = /* @__PURE__ */ F(d().status), ie = /* @__PURE__ */ F(m().normalize(d().priority, m().fallbackValue));
	function ae() {
		I(D, !1), I(O, ""), I(ne, m().creationDefaultValue), I(k, "");
	}
	let oe = /* @__PURE__ */ F(null), se = /* @__PURE__ */ F(null), ce = /* @__PURE__ */ F(null);
	function le() {
		I(oe, null), I(se, null), I(ce, null);
	}
	function ue(e, t) {
		return m().normalize(e.priority, m().fallbackValue) === m().normalize(t.priority, m().fallbackValue);
	}
	function de(e, t, n) {
		let r = (d().pending_items ?? []).map((e) => e?.id), i = r.filter((t) => t !== e);
		if (i.splice(i.indexOf(t) + +!!n, 0, e), i.every((e, t) => e === r[t])) return;
		let a = n ? { after: t } : { before: t };
		return p() ? h()({
			type: "reorder-item",
			taskId: d().id,
			itemId: e,
			position: a
		}) : te()({
			taskId: d().id,
			itemId: e,
			position: a
		});
	}
	function fe(e, t, n, r, i) {
		let a = t.find((e) => e.id === n);
		return {
			side: r?.id === e.id ? r.after ? "after" : "before" : null,
			armed: i === e.id,
			dragging: n === e.id,
			arm(t) {
				p() || t.button !== 0 || t.pointerType !== "mouse" || t.target.closest("a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg") || I(ce, e.id);
			},
			disarm() {
				U(ce) === e.id && U(oe) !== e.id && I(ce, null);
			},
			start(t) {
				t.stopPropagation(), I(oe, e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			end: le,
			over(t) {
				if (!a || a.id === e.id || !ue(a, e)) return;
				t.preventDefault(), t.stopPropagation(), t.dataTransfer.dropEffect = "move";
				let n = (t.currentTarget.querySelector(".item-row-description") ?? t.currentTarget).getBoundingClientRect();
				I(se, {
					id: e.id,
					after: t.clientY >= n.top + n.height / 2
				});
			},
			leave(t) {
				!t.currentTarget.contains(t.relatedTarget) && U(se)?.id === e.id && I(se, null);
			},
			drop(t) {
				!a || U(se)?.id !== e.id || (t.preventDefault(), t.stopPropagation(), de(a.id, e.id, U(se).after), le());
			},
			keydown(n) {
				if (!n.altKey || !["ArrowUp", "ArrowDown"].includes(n.key)) return;
				n.preventDefault(), n.stopPropagation();
				let r = t.filter((t) => t.id && ue(t, e)), i = r[r.findIndex((t) => t.id === e.id) + (n.key === "ArrowUp" ? -1 : 1)];
				if (!i) return;
				let a = CSS.escape(`${d().id}/${e.id}`);
				Promise.resolve(de(e.id, i.id, n.key === "ArrowDown")).then(() => _r()).then(() => document.querySelector(`[data-item-ref="${a}"]`)?.focus());
			}
		};
	}
	function pe() {
		let e = g()(U(O), Number(U(ne)));
		I(k, e.error), U(k) || ae();
	}
	B(() => (G(d()), ns), () => {
		I(n, [{
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
			items: ns(d().pending_items)
		}]);
	}), B(() => (U(n), G(x())), () => {
		I(r, [...U(n)].sort((e, t) => {
			let n = x().indexOf(e.status), r = x().indexOf(t.status);
			return (n < 0 ? x().length : n) - (r < 0 ? x().length : r);
		}));
	}), B(() => (G(m()), G(d())), () => {
		I(i, m().metadata(d().priority));
	}), B(() => G(d()), () => {
		I(re, d().status);
	}), B(() => (G(m()), G(d())), () => {
		I(ie, m().normalize(d().priority, m().fallbackValue));
	}), B(() => G(d()), () => {
		I(a, E.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), B(() => (G(p()), U(D)), () => {
		!p() && U(D) && ae();
	}), B(() => G(p()), () => {
		p(), le();
	}), An(), Hi();
	var me = vs(), he = L(me);
	{
		let e = /* @__PURE__ */ N(() => (G(d()), W(() => `task-body-${d().id}`)));
		fo(he, {
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
				return U(e);
			},
			get label() {
				return G(d()), W(() => d().title);
			},
			children: (e, t) => {
				var n = ds(), i = R(n), a = (e) => {
					var t = rs();
					ct(t), V(() => Ai(t, (G(d()), W(() => d().summary)))), K("input", t, (e) => h()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), J(e, t);
				}, o = (e) => {
					var t = is();
					Po(L(t), {
						get text() {
							return G(d()), W(() => d().summary);
						},
						lines: 2
					}), M(t), J(e, t);
				};
				X(i, (e) => {
					p() ? e(a) : e(o, -1);
				});
				var s = z(i, 2);
				{
					let e = /* @__PURE__ */ N(() => (G(d()), W(() => d().developer ?? null)));
					Oo(s, { get developer() {
						return U(e);
					} });
				}
				var c = z(s, 2), l = L(c);
				ni(l, 1, () => U(r), (e) => e.status, (e, t) => {
					var n = Ir(), r = R(n), i = (e) => {
						var n = os(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2);
						ni(a, 7, () => (U(t), U(T), W(() => U(t).status === "done" && !U(T) ? U(t).items.slice(0, 1) : U(t).items)), (e) => e.id, (e, n, r) => {
							{
								let i = /* @__PURE__ */ N(() => (G(_()), U(n), W(() => _().get(U(n).id) ?? []))), a = /* @__PURE__ */ N(() => (G(C()), U(t), G(U(r)), W(() => C() && U(t).status === "planned" && U(r) === 0))), o = /* @__PURE__ */ N(() => (G(p()), G(ee()), U(t), U(n), U(oe), U(se), U(ce), W(() => (p() || ee()) && U(t).status === "planned" && U(n).id && !U(n).legacy ? fe(U(n), U(t).items, U(oe), U(se), U(ce)) : null)));
								Zo(e, {
									get taskId() {
										return G(d()), W(() => d().id);
									},
									get field() {
										return U(t), W(() => U(t).field);
									},
									get item() {
										return U(n);
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
										return U(i);
									},
									get statuses() {
										return E;
									},
									get onModuleActivate() {
										return v();
									},
									get moduleOrder() {
										return y();
									},
									get onModuleReorder() {
										return b();
									},
									get leadItem() {
										return U(a);
									},
									get scopeId() {
										return w();
									},
									get reorder() {
										return U(o);
									}
								});
							}
						}), M(a);
						var o = z(a, 2), s = (e) => {
							var n = as(), r = L(n), i = L(r);
							M(r);
							var a = z(r);
							M(n), V(() => {
								Q(n, "aria-expanded", U(T)), Q(n, "aria-controls", (G(d()), U(t), W(() => `task-${d().id}-${U(t).field}`))), Q(i, "d", U(T) ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"), Y(a, ` ${U(T), U(t), W(() => U(T) ? "收合" : `顯示更多（${U(t).items.length - 1}項）`) ?? ""}`);
							}), K("click", n, () => I(T, !U(T))), J(e, n);
						};
						X(o, (e) => {
							U(t), W(() => U(t).status === "done" && U(t).items.length > 1) && e(s);
						}), M(n), V(() => {
							Z(n, 1, (U(t), W(() => `detail-section ${U(t).className}`))), Y(i, (U(t), W(() => U(t).title))), Q(a, "id", (G(d()), U(t), W(() => `task-${d().id}-${U(t).field}`)));
						}), J(e, n);
					};
					X(r, (e) => {
						U(t), G(p()), W(() => U(t).items.length || p()) && e(i);
					}), J(e, n);
				});
				var u = z(l, 2), f = L(u), g = (e) => {
					var t = us(), n = L(t), r = (e) => {
						var t = cs(), n = L(t);
						ki(n);
						var r = z(n, 2);
						ni(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = ss(), r = L(n, !0);
							M(n);
							var i = {};
							V((e) => {
								Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}, [() => (G(m()), U(t), W(() => m().format(U(t).value)))]), J(e, n);
						}), M(r);
						var i = z(r, 2), a = z(i, 2), o = z(a, 2), s = L(o, !0);
						M(o), M(t), V(() => {
							Q(o, "hidden", !U(k)), Y(s, U(k));
						}), K("keydown", n, (e) => {
							e.key === "Enter" && pe(), e.key === "Escape" && ae();
						}), Fi(n, () => U(O), (e) => I(O, e)), Ci(r, () => U(ne), (e) => I(ne, e)), K("click", i, pe), K("click", a, ae), J(e, t);
					}, i = (e) => {
						var t = ls();
						V(() => Q(t, "aria-label", (G(d()), W(() => `在「${d().title}」新增子項目`)))), K("click", t, () => {
							I(D, !0);
						}), J(e, t);
					};
					X(n, (e) => {
						U(D) ? e(r) : e(i, -1);
					}), M(t), J(e, t);
				};
				X(f, (e) => {
					p() && e(g);
				}), M(u), M(c), J(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = _s(), r = L(n), i = L(r), o = (e) => {
						var t = fs(), n = L(t);
						ni(n, 5, () => E, (e) => e.value, (e, t) => {
							var n = ss(), r = L(n, !0);
							M(n);
							var i = {};
							V(() => {
								Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}), J(e, n);
						}), M(n);
						var r = z(n, 2);
						ni(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = ss(), r = L(n, !0);
							M(n);
							var i = {};
							V((e) => {
								Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}, [() => (G(m()), U(t), W(() => m().format(U(t).value)))]), J(e, n);
						}), M(r), M(t), V(() => {
							Q(n, "aria-label", (G(d()), W(() => `${d().title} 狀態`))), Q(r, "aria-label", (G(d()), W(() => `${d().title} 優先級`)));
						}), K("change", n, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "status",
							value: U(re)
						})), Ci(n, () => U(re), (e) => I(re, e)), K("change", r, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(U(ie))
						})), Ci(r, () => U(ie), (e) => I(ie, e)), J(e, t);
					};
					X(i, (e) => {
						p() && e(o);
					});
					var s = z(i, 2), c = L(s), l = (e) => {
						var t = ps();
						ki(t), V(() => {
							Q(t, "id", (G(d()), W(() => `task-${d().id}-title`))), Ai(t, (G(d()), W(() => d().title)));
						}), K("input", t, (e) => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), J(e, t);
					}, u = (e) => {
						var t = ms(), n = L(t, !0);
						M(t), V(() => {
							Q(t, "id", (G(d()), W(() => `task-${d().id}-title`))), Y(n, (G(d()), W(() => d().title)));
						}), J(e, t);
					};
					X(c, (e) => {
						p() ? e(l) : e(u, -1);
					}), M(s);
					var g = z(s, 2), _ = (e) => {
						var t = gs();
						ni(t, 5, S, (e) => e.id, (e, t) => {
							var n = hs(), r = L(n, !0);
							M(n), V(() => {
								Z(n, 1, (U(t), W(() => `task-module-total task-module-total-${U(t).id}`))), Y(r, (U(t), W(() => U(t).label)));
							}), J(e, n);
						}), M(t), J(e, t);
					};
					X(g, (e) => {
						G(S()), W(() => S().length) && e(_);
					}), M(r);
					var v = z(r, 2), y = L(v), b = L(y);
					M(y);
					var x = z(y, 2), C = L(x, !0);
					M(x);
					var w = z(x, 2), ee = L(w, !0);
					M(w), M(v), M(n), V(() => {
						Q(y, "aria-label", (G(f()), W(() => `子項目完成 ${f().completed}，共 ${f().total}`))), Y(b, `${G(f()), W(() => f().completed) ?? ""} / ${G(f()), W(() => f().total) ?? ""}`), Z(x, 1, (U(a), W(() => `status-badge status-${U(a).tone}`))), Y(C, (U(a), W(() => U(a).label))), Y(ee, (G(d()), W(() => d().id)));
					}), J(e, n);
				}
			}
		});
	}
	M(me), V(() => {
		Z(me, 1, (U(i), W(() => `task-card editor-task-card priority-${U(i)?.tone ?? "unspecified"}`))), Q(me, "aria-labelledby", (G(d()), W(() => `task-${d().id}-title`)));
	}), J(e, me), qe();
}
Er([
	"input",
	"click",
	"keydown",
	"change"
]);
//#endregion
//#region viewer/assets/icon-choice.js
function bs(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function xs(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var Ss = /* @__PURE__ */ q("<button type=\"button\" tabindex=\"-1\"><!></button>"), Cs = /* @__PURE__ */ q("<div role=\"group\"></div>"), ws = /* @__PURE__ */ q("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Ts(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ F(), f = /* @__PURE__ */ F(), p = /* @__PURE__ */ F(), m = /* @__PURE__ */ F(), h = /* @__PURE__ */ F(!1), g = /* @__PURE__ */ F(!1), _ = /* @__PURE__ */ F(!1), v = /* @__PURE__ */ F(null), y = /* @__PURE__ */ F(0), b = /* @__PURE__ */ F(0), x = /* @__PURE__ */ F(!1), S = /* @__PURE__ */ F(null), C = 0;
	function w(e = !1) {
		clearTimeout(U(m)), C++, U(S) !== null && U(f)?.hasPointerCapture(U(S)) && U(f).releasePointerCapture(U(S)), I(S, null), I(h, !1), I(g, !1), I(v, null), I(x, !1), e && U(f)?.focus();
	}
	function ee(e) {
		w(!0), u()(e);
	}
	async function te(e = !1) {
		if (!U(r).length) return;
		I(h, !0), I(x, !1);
		let t = ++C;
		if (await _r(), !U(h) || t !== C || !U(p)) return;
		let n = U(f).getBoundingClientRect(), i = U(p).getBoundingClientRect(), o = [...U(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (I(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), I(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (I(y, n.right + 4), U(y) + i.width > window.innerWidth - 4 && I(y, n.left - i.width - 4), I(b, n.top + (n.height - i.height) / 2)) : (I(y, n.left + (n.width - i.width) / 2), I(b, n.bottom + 4), U(b) + i.height > window.innerHeight - 4 && I(b, n.top - i.height - 4)), I(y, Math.max(4, Math.min(U(y), window.innerWidth - i.width - 4))), I(b, Math.max(4, Math.min(U(b), window.innerHeight - i.height - 4))), I(x, !0), await _r(), e && U(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function T(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && U(p)?.contains(t) ? t.dataset.choice : null;
	}
	function E(e) {
		if (clearTimeout(U(m)), U(S) !== null) {
			if (U(g)) {
				let t = T(e);
				I(_, !0), t === null ? w(!0) : ee(U(r).find((e) => String(e.id) === t).id);
			} else {
				let t = U(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (I(_, !0), w(!0));
			}
			I(S, null);
		}
	}
	function D(e) {
		if (["Enter", " "].includes(e.key) && U(S) === null && I(_, !1), e.key === "Tab" && U(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(U(h) || U(S) !== null) && (e.preventDefault(), I(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !U(h)) {
			te(!0);
			return;
		}
		let n = [...U(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function O() {
		U(S) !== null && I(_, !0), w(U(d)?.contains(document.activeElement));
	}
	Jr(() => clearTimeout(U(m))), B(() => (G(i()), G(a())), () => {
		I(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (G(i()), G(a()), G(l())), () => {
		I(r, xs(i(), a(), l()));
	}), An(), Hi();
	var ne = ws();
	Tr("pointerdown", sn, (e) => {
		U(d)?.contains(e.target) || w();
	}), Tr("resize", sn, O), Tr("blur", sn, O), Tr("scroll", cn, (e) => {
		U(p)?.contains(e.target) || O();
	}, !0);
	var k = L(ne);
	let re;
	ci(L(k), t, "icon", { get item() {
		return U(n);
	} }, null), M(k), Vi(k, (e) => I(f, e), () => U(f));
	var ie = z(k, 2), ae = (e) => {
		var n = Cs();
		let i, s;
		ni(n, 5, () => U(r), (e) => e.id, (e, n) => {
			var r = Ss();
			let i;
			ci(L(r), t, "icon", { get item() {
				return U(n);
			} }, null), M(r), V((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (U(n), W(() => U(n).id))), Q(r, "aria-label", (U(n), W(() => U(n).label))), Q(r, "title", (U(n), W(() => U(n).label))), Q(r, "aria-pressed", (U(n), G(a()), W(() => U(n).kind === "action" ? void 0 : U(n).id === a())));
			}, [() => ({ "icon-choice-hover": U(v) === String(U(n).id) })]), K("keydown", r, D), K("click", r, () => ee(U(n).id)), J(e, r);
		}), M(n), Vi(n, (e) => I(p, e), () => U(p)), V(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = bi(n, "", s, {
				left: `${U(y)}px`,
				top: `${U(b)}px`,
				visibility: U(x) ? "visible" : "hidden"
			});
		}), J(e, n);
	};
	X(ie, (e) => {
		U(h) && e(ae);
	}), M(ne), Vi(ne, (e) => I(d, e), () => U(d)), V(() => {
		Q(ne, "aria-label", o()), Q(k, "aria-label", (G(o()), U(n), W(() => `${o()}：${U(n)?.label ?? ""}`))), Q(k, "aria-expanded", s() === "cycle" ? void 0 : U(h)), Q(k, "title", (G(o()), U(n), G(s()), W(() => `${o()}：${U(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), k.disabled = !U(n), re = bi(k, "", re, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), K("focusout", ne, (e) => {
		U(d).contains(e.relatedTarget) || w();
	}), K("keydown", k, D), K("pointerdown", k, (e) => {
		e.button === 0 && (I(_, !1), !(s() === "cycle" || U(h)) && (I(S, e.pointerId), U(f).setPointerCapture(U(S)), clearTimeout(U(m)), I(m, setTimeout(() => {
			I(g, !0), te();
		}, 300))));
	}), K("pointermove", k, (e) => {
		U(g) && I(v, T(e));
	}), K("pointerup", k, E), Tr("pointercancel", k, O), K("click", k, () => {
		if (U(_)) {
			I(_, !1);
			return;
		}
		if (U(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") te(!0);
		else {
			let e = bs(i(), a());
			e !== void 0 && u()(e);
		}
	}), J(e, ne), qe();
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
var Es = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function Ds(e, t) {
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
	Ts(e, {
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
			let n = /* @__PURE__ */ N(() => t.item);
			var r = Ir(), i = R(r), a = (e) => {
				J(e, Es());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ N(() => (G(U(n)), W(() => U(n)?.id === "closed"))), r = /* @__PURE__ */ N(() => (G(U(n)), W(() => U(n)?.id === "disabled")));
					co(e, {
						get closed() {
							return U(t);
						},
						get disabled() {
							return U(r);
						}
					});
				}
			};
			X(i, (e) => {
				G(U(n)), W(() => U(n)?.id === "reset") ? e(a) : e(o, -1);
			}), J(e, r);
		} }
	});
}
//#endregion
//#region viewer/assets/card-visibility.js
function Os(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function ks(e, t, n) {
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
function As(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function js(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function Ms(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function Ns(e, t, n, r = []) {
	let i = n === "free" ? Ps(e, t) : n === "reverse" ? [...e].reverse() : e;
	if (!r.length) return i;
	let a = new Map(e.map((e) => [e.id, e])), o = new Set(r);
	return [...o].filter((e) => a.has(e)).map((e) => a.get(e)).concat(i.filter((e) => !o.has(e.id)));
}
function Ps(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function Fs(e, t, n, r, i, a) {
	let o = As(t, e), s = new Set(n), c = js(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var Is = /* @__PURE__ */ Pr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), Ls = /* @__PURE__ */ Pr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), Rs = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), zs = /* @__PURE__ */ q("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), Bs = /* @__PURE__ */ q("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), Vs = /* @__PURE__ */ q("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function Hs(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null);
	function f(e = o()) {
		return Ns(e, U(te), U(_), l() ? U(p) : []).map((e) => e.id);
	}
	let p = /* @__PURE__ */ F([]), m = null, h = $(t, "expanded", 8, !0), g = $(t, "onToggleAll", 8, () => {}), _ = /* @__PURE__ */ F("forward"), v = [
		"forward",
		"reverse",
		"free"
	], y = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, b = /* @__PURE__ */ F("disabled"), x = /* @__PURE__ */ F([]);
	function S() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: U(b),
				hiddenIds: U(x)
			}));
		} catch {}
	}
	function C(e) {
		let t = ks(U(b), U(x), e);
		I(b, t.mode), I(x, t.hiddenIds), de(), S();
	}
	function w(e, t) {
		I(x, t ? U(x).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...U(x), e])]), de(), S();
	}
	function ee(e) {
		U(b) === "closed" && I(b, "enabled"), w(e, !0);
	}
	let te = /* @__PURE__ */ F(null), T = /* @__PURE__ */ F(null), E = /* @__PURE__ */ F(null), D = /* @__PURE__ */ F(null), O = /* @__PURE__ */ F(null), ne = /* @__PURE__ */ F(), k = /* @__PURE__ */ F("");
	function re(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (m !== i) {
			if (m = i, !n.includes(e)) {
				I(k, `找不到卡片 ID：${e}`);
				return;
			}
			I(p, Ms(U(p), e)), ee(e), ie();
		}
	}
	function ie() {
		if (!c()) {
			I(k, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(U(p))), I(k, "已記住本機釘選");
		} catch {
			I(k, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function ae(e) {
		de(), I(p, U(p).includes(e) ? U(p).filter((t) => t !== e) : Ms(U(p), e)), ie();
	}
	function oe(e) {
		if (m = null, I(p, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			I(p, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (I(b, "disabled"), I(x, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			I(b, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), I(x, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (I(T, null), I(E, null), I(D, null), I(O, null), !e) {
			I(te, null), I(_, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			I(te, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			I(_, v.includes(n) ? n : U(te) ? "free" : "forward");
		} catch {
			I(te, null), I(_, "forward");
		}
	}
	function se(e) {
		if (I(te, e), !c()) {
			I(k, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), I(k, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			I(k, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function ce(e) {
		if (de(), I(_, e), I(k, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, U(_));
		} catch {
			I(k, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function le(e, t, n) {
		U(_) === "free" && (l() && (U(p).includes(e) || U(p).includes(t)) || e !== t && (se(Fs(s(), U(te), U(r).map((e) => e.id), e, t, n)), I(T, e), await _r(), [...U(ne).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function ue(e, t) {
		let n = U(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = U(r)[n + t];
		i && le(e, i.id, t > 0);
	}
	function de() {
		I(E, null), I(D, null), I(O, null);
	}
	function fe(e, t) {
		if (l() && U(p).includes(e.id) || U(D) === null || U(D) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		I(O, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => U(b), () => {
		I(n, U(b) === "enabled");
	}), B(() => (G(o()), U(te), U(_), G(l()), U(p), G(d())), () => {
		I(i, Ps(Ns(o(), U(te), U(_), l() ? U(p) : []), d()));
	}), B(() => (U(i), U(b), U(x), G(l()), U(p)), () => {
		I(r, U(i).filter((e) => Os(e.id, U(b), U(x)) && !(l() && U(p).includes(e.id))));
	}), B(() => G(c()), () => {
		oe(c());
	}), B(() => (U(i), U(b), U(x)), () => {
		I(a, U(i).find((e) => Os(e.id, U(b), U(x)))?.id ?? null);
	}), B(() => (G(u()), G(c()), G(s()), G(l())), () => {
		re(u(), c(), s(), l());
	}), An();
	var pe = {
		orderedIds: f,
		revealCard: ee
	};
	Hi();
	var me = Vs(), he = R(me), ge = L(he);
	ci(z(L(ge), 2), t, "filters", {}, null), M(ge);
	var _e = z(ge, 2), ve = L(_e), ye = L(ve), be = L(ye);
	M(ye), M(ve);
	var xe = z(ve, 2);
	{
		let e = /* @__PURE__ */ N(() => W(() => v.map((e) => ({
			id: e,
			label: y[e]
		}))));
		Ts(xe, {
			get items() {
				return U(e);
			},
			get value() {
				return U(_);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: ce,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ N(() => t.item);
				var r = Rs(), i = L(r), a = (e) => {
					J(e, Is());
				}, o = (e) => {
					var t = Ls(), r = R(t), i = z(r);
					V(() => {
						Q(r, "d", (G(U(n)), W(() => U(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (G(U(n)), W(() => U(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), J(e, t);
				};
				X(i, (e) => {
					G(U(n)), W(() => U(n).id === "free") ? e(a) : e(o, -1);
				}), M(r), J(e, r);
			} }
		});
	}
	var Se = z(xe, 2);
	Ds(Se, {
		get mode() {
			return U(b);
		},
		onChoose: C
	});
	var Ce = z(Se, 2), we = L(Ce, !0);
	M(Ce), ci(z(Ce, 2), t, "tools", {}, null), M(_e), M(he);
	var Te = z(he, 2);
	return ni(Te, 5, () => U(i), (e) => e.id, (e, r) => {
		var i = Bs();
		let o;
		var s = L(i), c = (e) => {
			var t = zs();
			let n;
			var i = L(t), a = L(i);
			M(i), M(t), V((e, r, i, o, s) => {
				n = Z(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({ "is-pinned": U(p).includes(U(r).id) }),
				() => (U(p), U(r), W(() => U(p).includes(U(r).id) ? `取消釘選：${U(r).title}` : `釘選置頂：${U(r).title}`)),
				() => (U(p), U(r), W(() => U(p).includes(U(r).id))),
				() => (U(p), U(r), W(() => U(p).includes(U(r).id) ? "取消釘選" : "釘選置頂")),
				() => (U(p), U(r), W(() => U(p).includes(U(r).id) ? "currentColor" : "none"))
			]), K("click", t, () => ae(U(r).id)), J(e, t);
		};
		X(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ N(() => (U(x), U(r), W(() => !U(x).includes(U(r).id))));
			ci(u, t, "default", {
				get item() {
					return U(r);
				},
				get lead() {
					return U(r), U(a), W(() => U(r).id === U(a));
				},
				get visibilityEnabled() {
					return U(n);
				},
				get visible() {
					return U(e);
				},
				onVisibleChange: (e) => w(U(r).id, e)
			}, null);
		}
		M(i), V((e) => {
			Q(i, "hidden", e), o = Z(i, 1, "arrangeable-card", null, o, {
				"card-selected": U(T) === U(r).id,
				"card-drop-before": U(O)?.id === U(r).id && !U(O).after,
				"card-drop-after": U(O)?.id === U(r).id && U(O).after
			}), Q(i, "aria-label", (U(r), U(T), W(() => `${U(r).title}${U(T) === U(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (U(r), W(() => U(r).id))), Q(i, "draggable", (U(_), U(E), U(r), W(() => U(_) === "free" && U(E) === U(r).id)));
		}, [() => (G(Os), U(r), U(b), U(x), W(() => !Os(U(r).id, U(b), U(x))))]), K("pointerdown", i, (e) => {
			I(E, null), e.button === 0 && (I(T, U(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (U(_) !== "free" || e.pointerType !== "mouse" || l() && U(p).includes(U(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || I(E, U(r).id)));
		}), K("focusin", i, () => {
			I(T, U(r).id);
		}), K("input", i, () => {
			I(T, U(r).id);
		}), K("pointerup", i, () => {
			I(E, null);
		}), K("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), I(T, U(r).id)) : e.key === "Escape" && I(T, null), U(_) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), ue(U(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Tr("dragstart", i, (e) => {
			U(_) === "free" && U(E) === U(r).id && e.target === e.currentTarget && (I(D, U(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(U(r).id)));
		}), Tr("dragend", i, de), Tr("dragover", i, (e) => fe(U(r), e)), Tr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || I(O, null);
		}), Tr("drop", i, (e) => {
			U(D) !== null && U(O)?.id === U(r).id && (e.preventDefault(), le(U(D), U(r).id, U(O).after), de());
		}), J(e, i);
	}), M(Te), Vi(Te, (e) => I(ne, e), () => U(ne)), V(() => {
		Q(ve, "aria-label", h() ? "全部收合" : "全部展開"), Q(ve, "title", h() ? "全部收合" : "全部展開"), Q(be, "d", h() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Y(we, U(k));
	}), K("click", ve, () => g()(!h())), J(e, me), zi(t, "orderedIds", f), zi(t, "revealCard", ee), qe(pe);
}
Er([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var Us = /* @__PURE__ */ q("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), Ws = /* @__PURE__ */ q("<div class=\"task-summary\"><!></div> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), Gs = /* @__PURE__ */ q("<a class=\"pointer-card-title-link\"> </a>"), Ks = /* @__PURE__ */ q("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), qs = /* @__PURE__ */ q("<strong class=\"task-fraction\"> </strong>"), Js = /* @__PURE__ */ q("<span> </span>"), Ys = /* @__PURE__ */ q("<span role=\"status\">讀取目標報告中…</span>"), Xs = /* @__PURE__ */ q("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), Zs = /* @__PURE__ */ q("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!> <!></div></header>"), Qs = /* @__PURE__ */ q("<article><!></article>");
function $s(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "visibilityEnabled", 8, !1), a = $(t, "visible", 8, !0), o = $(t, "onVisibleChange", 8, () => {}), s = $(t, "expanded", 8, !0), c = $(t, "onToggle", 8, () => {}), l = $(t, "task", 8), u = $(t, "state", 24, () => ({ status: "loading" })), d = {
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
	B(() => G(u()), () => {
		I(n, u().status === "ready" ? u().card : null);
	}), B(() => U(n), () => {
		I(r, U(n) ? d[U(n).status] ?? {
			label: U(n).status,
			tone: "muted"
		} : null);
	}), An(), Hi();
	var p = Qs(), m = L(p);
	{
		let e = /* @__PURE__ */ N(() => (G(l()), W(() => `task-body-${l().id}`)));
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
				return U(e);
			},
			get label() {
				return G(l()), W(() => l().title);
			},
			children: (e, t) => {
				var r = Ir(), i = R(r), a = (e) => {
					var t = Ws(), r = R(t);
					Po(L(r), { get text() {
						return U(n), W(() => U(n).summary);
					} }), M(r);
					var i = z(r, 2), a = L(i);
					M(i);
					var o = z(i, 2);
					ni(o, 5, () => (U(n), W(() => U(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ N(() => (U(t), W(() => f(U(t).status))));
						var r = Us(), i = L(r), a = L(i, !0);
						M(i);
						var o = z(i, 2), s = L(o, !0);
						M(o), M(r), V(() => {
							Y(a, (U(t), W(() => U(t).title))), Z(o, 1, (G(U(n)), W(() => `status-badge status-${U(n).tone}`))), Y(s, (G(U(n)), W(() => U(n).label)));
						}), J(e, r);
					}), M(o), V(() => {
						Q(i, "aria-label", (U(n), W(() => `子任務完成 ${U(n).progress.completed}，共 ${U(n).progress.total}`))), Y(a, `${U(n), W(() => U(n).progress.completed) ?? ""} / ${U(n), W(() => U(n).progress.total) ?? ""}（${U(n), W(() => U(n).progress.percentage) ?? ""}%）`);
					}), J(e, t);
				};
				X(i, (e) => {
					U(n) && e(a);
				}), J(e, r);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var i = Zs(), a = L(i), o = L(a), s = L(o), c = L(s), d = (e) => {
						var t = Gs(), n = L(t, !0);
						M(t), V(() => {
							Q(t, "href", (G(u()), W(() => u().openHref))), Y(n, (G(l()), W(() => l().title)));
						}), J(e, t);
					}, f = (e) => {
						var t = Fr();
						V(() => Y(t, (G(l()), W(() => l().title)))), J(e, t);
					};
					X(c, (e) => {
						G(u()), W(() => u().openHref) ? e(d) : e(f, -1);
					}), M(s), M(o);
					var p = z(o, 2), m = (e) => {
						var t = Ks();
						V(() => Q(t, "href", (G(u()), W(() => u().openHref)))), J(e, t);
					};
					X(p, (e) => {
						G(u()), W(() => u().openHref) && e(m);
					}), M(a);
					var h = z(a, 2), g = L(h), _ = (e) => {
						var t = qs(), r = L(t);
						M(t), V(() => Y(r, `${U(n), W(() => U(n).progress.completed) ?? ""} / ${U(n), W(() => U(n).progress.total) ?? ""}`)), J(e, t);
					};
					X(g, (e) => {
						U(n) && e(_);
					});
					var v = z(g, 2), y = (e) => {
						var t = Js(), n = L(t, !0);
						M(t), V(() => {
							Z(t, 1, (U(r), W(() => `status-badge status-${U(r).tone}`))), Y(n, (U(r), W(() => U(r).label)));
						}), J(e, t);
					};
					X(v, (e) => {
						U(r) && e(y);
					});
					var b = z(v, 2), x = (e) => {
						J(e, Ys());
					};
					X(b, (e) => {
						G(u()), W(() => u().status === "loading") && e(x);
					});
					var S = z(b, 2), C = (e) => {
						var t = Xs(), n = L(t, !0);
						M(t), V(() => Y(n, (G(u()), W(() => u().message)))), J(e, t);
					};
					X(S, (e) => {
						G(u()), W(() => u().status === "error") && e(C);
					}), M(h), M(i), V(() => Q(s, "id", (G(l()), W(() => `task-${l().id}-title`)))), J(e, i);
				}
			}
		});
	}
	M(p), V(() => {
		Z(p, 1, (U(r), W(() => `task-card pointer-card ${U(r) ? `status-${U(r).tone}` : ""}`))), Q(p, "aria-labelledby", (G(l()), W(() => `task-${l().id}-title`)));
	}), J(e, p), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var ec = /* @__PURE__ */ q("<span class=\"task-search\"><input type=\"search\" aria-label=\"搜尋任務卡名稱、摘要與子項\" placeholder=\"搜尋名稱、摘要、子項\"/> <svg class=\"task-search-icon\" viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><circle cx=\"7\" cy=\"7\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"></circle><path d=\"M10.4 10.4 14 14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg></span>"), tc = /* @__PURE__ */ q("<p class=\"empty-state\"> </p>"), nc = /* @__PURE__ */ q("<!> <!>", 1);
function rc(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "filters", 8, null), i = $(t, "tasks", 24, () => []), a = $(t, "allIds", 24, () => []), o = $(t, "cardStorageKey", 8, null), s = $(t, "requestedPin", 8, null), c = $(t, "scopeId", 8, null), l = $(t, "searchQuery", 8, ""), u = $(t, "onSearch", 8, null), d = $(t, "reorderable", 8, !1), f = $(t, "onReorder", 8, () => {}), p = $(t, "progress", 24, () => ({})), m = $(t, "editing", 8, !1), h = $(t, "policy", 8), g = $(t, "onCommand", 8, () => {}), _ = $(t, "onAddItem", 8, () => {}), v = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), y = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), b = $(t, "onModuleActivate", 8, () => {}), x = $(t, "moduleOrder", 24, () => ["time"]), S = $(t, "onModuleReorder", 8, () => {}), C = $(t, "moduleTotals", 24, () => ({})), w = $(t, "statusOrder", 24, () => ["done", "planned"]), ee = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), te = $(t, "pointerCards", 24, () => ({})), T = /* @__PURE__ */ F(!0), E = /* @__PURE__ */ F({}), D = null;
	function O(e, t) {
		!e || D === JSON.stringify([t, e]) || (D = JSON.stringify([t, e]), I(E, {
			...U(E),
			[e]: !0
		}));
	}
	function ne(e) {
		D = null;
		let t = no(e);
		I(T, t.expanded), I(E, t.overrides);
	}
	function k(e, t) {
		I(E, {
			...U(E),
			[e]: t
		}), ro(U(n), U(T), U(E));
	}
	function re(e) {
		I(T, e), I(E, {}), ro(U(n), U(T), U(E));
	}
	B(() => G(o()), () => {
		I(n, `taskprogress.disclosure:${o() ?? location.href}`);
	}), B(() => U(n), () => {
		ne(U(n));
	}), B(() => (G(s()), U(n)), () => {
		O(s(), U(n));
	}), An(), Hi();
	var ie = nc(), ae = R(ie);
	Hs(ae, {
		pinEnabled: !0,
		get requestedPin() {
			return s();
		},
		get expanded() {
			return U(T);
		},
		onToggleAll: re,
		get items() {
			return i();
		},
		get allIds() {
			return a();
		},
		get storageKey() {
			return o();
		},
		children: ge,
		$$slots: {
			default: (e, t) => {
				let n = /* @__PURE__ */ N(() => t.item), r = /* @__PURE__ */ N(() => t.lead), i = /* @__PURE__ */ N(() => t.visibilityEnabled), a = /* @__PURE__ */ N(() => t.visible), o = /* @__PURE__ */ N(() => t.onVisibleChange);
				var s = Ir(), l = R(s), u = (e) => {
					{
						let t = /* @__PURE__ */ N(() => (U(E), G(U(n)), U(T), W(() => U(E)[U(n).id] ?? U(T)))), r = /* @__PURE__ */ N(() => (G(te()), G(U(n)), W(() => te()[U(n).id] ?? { status: "loading" })));
						$s(e, {
							get visibilityEnabled() {
								return U(i);
							},
							get visible() {
								return U(a);
							},
							get onVisibleChange() {
								return U(o);
							},
							get expanded() {
								return U(t);
							},
							onToggle: (e) => k(U(n).id, e),
							get task() {
								return U(n);
							},
							get state() {
								return U(r);
							}
						});
					}
				}, ee = (e) => {
					{
						let t = /* @__PURE__ */ N(() => (U(E), G(U(n)), U(T), W(() => U(E)[U(n).id] ?? U(T)))), s = /* @__PURE__ */ N(() => (G(v()), G(U(n)), W(() => v().get(U(n).id) ?? null))), l = /* @__PURE__ */ N(() => (G(C()), G(U(n)), W(() => C()[U(n).id] ?? [])));
						ys(e, {
							get visibilityEnabled() {
								return U(i);
							},
							get visible() {
								return U(a);
							},
							get onVisibleChange() {
								return U(o);
							},
							get expanded() {
								return U(t);
							},
							onToggle: (e) => k(U(n).id, e),
							get task() {
								return U(n);
							},
							get progress() {
								return G(p()), G(U(n)), W(() => p()[U(n).id]);
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
							onAddItem: (e, t) => _()(U(n).id, e, t),
							get timeTask() {
								return U(s);
							},
							get itemCapsules() {
								return y();
							},
							get onModuleActivate() {
								return b();
							},
							get moduleOrder() {
								return x();
							},
							get onModuleReorder() {
								return S();
							},
							get statusOrder() {
								return w();
							},
							get moduleTotals() {
								return U(l);
							},
							get lead() {
								return U(r);
							},
							get scopeId() {
								return c();
							},
							get reorderable() {
								return d();
							},
							get onReorder() {
								return f();
							}
						});
					}
				};
				X(l, (e) => {
					G(U(n)), W(() => U(n).kind === "report_pointer") ? e(u) : e(ee, -1);
				}), J(e, s);
			},
			filters: (e, t) => {
				var n = Ir(), i = R(n), a = (e) => {
					$a(e, Gi(r));
				};
				X(i, (e) => {
					r() && e(a);
				}), J(e, n);
			},
			tools: (e, t) => {
				var n = Ir(), r = R(n), i = (e) => {
					var t = ec(), n = L(t);
					ki(n), Ie(2), M(t), V(() => Ai(n, l())), K("input", n, (e) => u()(e.currentTarget.value)), J(e, t);
				};
				X(r, (e) => {
					u() && e(i);
				}), J(e, n);
			}
		}
	});
	var oe = z(ae, 2), se = (e) => {
		var t = tc(), n = L(t, !0);
		M(t), V(() => Y(n, ee())), J(e, t);
	};
	X(oe, (e) => {
		G(i()), W(() => !i().length) && e(se);
	}), J(e, ie), qe();
}
Er(["input"]);
//#endregion
//#region viewer/assets/theme-model.js
var ic = [
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
], ac = Object.freeze({
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
var oc = /^#[0-9a-f]{6}$/i;
function sc(e) {
	return typeof e == "string" && oc.test(e);
}
function cc(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = ac[n], i = { base: n };
	for (let e of ic) {
		let n = t[e.key];
		i[e.key] = sc(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function lc(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function uc(e, t) {
	if (!sc(e) || !sc(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => lc(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function dc(e) {
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
	].filter(([, e, t]) => uc(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var fc = /* @__PURE__ */ q("<option> </option>"), pc = /* @__PURE__ */ q("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), mc = /* @__PURE__ */ q("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), hc = /* @__PURE__ */ q("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function gc(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ F(!1), p = /* @__PURE__ */ F([]), m = /* @__PURE__ */ F(a()), h = /* @__PURE__ */ F(o()?.base ?? s()), g = /* @__PURE__ */ F(v(cc(U(h)))), _ = /* @__PURE__ */ F({ ...U(g) });
	function v(e) {
		return Object.fromEntries(ic.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		I(h, e.base), I(g, v(e)), I(_, { ...U(g) });
		for (let e of U(p)) e?.setCustomValidity("");
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
		y(o() ? cc(o().base, o()) : cc(s())), I(f, !0);
	}
	function S() {
		I(f, !1);
	}
	function C(e) {
		y(cc(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		I(g, {
			...U(g),
			[e.key]: r
		}), I(_, {
			...U(_),
			[e.key]: r
		}), U(p)[t]?.setCustomValidity("");
	}
	function ee(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), I(g, {
			...U(g),
			[e.key]: n.value
		}), r && I(_, {
			...U(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function te() {
		I(m, a()), S();
	}
	function T() {
		let e = U(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(cc(U(h), U(_))), S();
	}
	B(() => G(a()), () => {
		I(m, a());
	}), B(() => (U(h), U(_)), () => {
		I(n, cc(U(h), U(_)));
	}), B(() => U(n), () => {
		I(r, dc(U(n)));
	}), B(() => U(r), () => {
		I(i, U(r).length ? `注意：${U(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), An(), Hi();
	var E = hc(), D = R(E), O = z(L(D), 2);
	ni(O, 5, () => u, (e) => e.value, (e, t) => {
		var n = fc(), r = L(n, !0);
		M(n);
		var i = {};
		V(() => {
			Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
		}), J(e, n);
	}), M(O), M(D), da(z(D, 2), {
		get open() {
			return U(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: te,
		children: (e, t) => {
			var a = mc(), o = z(R(a), 2), s = z(L(o), 2), c = L(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", M(s);
			var u;
			Si(s), M(o);
			var d = z(o, 2);
			ni(d, 7, () => ic, (e) => e.key, (e, t, r) => {
				var i = pc(), a = L(i), o = L(a, !0);
				M(a);
				var s = z(a, 2), c = L(s);
				ki(c);
				var l = z(c, 2);
				ki(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Vi(l, (e, t) => Qt(p, U(p)[t] = e), (e) => U(p)?.[e], () => [U(r)]), M(s), M(i), V(() => {
					Y(o, (U(t), W(() => U(t).label))), Q(c, "aria-label", (U(t), W(() => `${U(t).label}選色器`))), Ai(c, (U(n), U(t), W(() => U(n)[U(t).key]))), Q(l, "aria-label", (U(t), W(() => `${U(t).label}十六進位色碼`))), Ai(l, (U(g), U(t), W(() => U(g)[U(t).key])));
				}), K("input", c, (e) => w(U(t), U(r), e)), K("input", l, (e) => ee(U(t), e)), J(e, i);
			}), M(d);
			var f = z(d, 2);
			let m;
			var _ = L(f, !0);
			M(f);
			var v = z(f, 2), b = L(v), x = z(b, 4), S = z(x, 2);
			M(v), V(() => {
				u !== (u = U(h)) && (s.value = (s.__value = U(h)) ?? "", xi(s, U(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": U(r).length > 0 }), Y(_, U(i));
			}), K("change", s, C), K("click", b, () => y(cc(U(h)))), K("click", x, te), K("click", S, T), J(e, a);
		},
		$$slots: { default: !0 }
	}), K("change", O, b), Ci(O, () => U(m), (e) => I(m, e)), J(e, E), qe();
}
Er([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var _c = /* @__PURE__ */ q("<span> </span>"), vc = /* @__PURE__ */ q("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), yc = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), bc = /* @__PURE__ */ q("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function xc(e, t) {
	Ke(t, !1);
	let n = $(t, "item", 8), r = $(t, "activeEstimate", 8, null), i = $(t, "onApply", 8, () => ({ error: "" })), a = /* @__PURE__ */ F(r()?.likely_minutes ? String(r().likely_minutes / 60) : n().unset ? "" : String(n().likelyMinutes / 60)), o = /* @__PURE__ */ F(r()?.human_note ?? ""), s = /* @__PURE__ */ F(!!(r()?.human_confirmed ?? n().humanConfirmed)), c = /* @__PURE__ */ F("");
	function l() {
		let e = Number(U(a));
		if (!Number.isFinite(e) || e <= 0) {
			I(c, "工時必須大於 0。");
			return;
		}
		let t = i()({
			taskId: n().taskId,
			itemId: n().itemId,
			likelyMinutes: Math.round(e * 60),
			humanNote: U(o),
			humanConfirmed: U(s)
		});
		I(c, t?.error ?? "");
	}
	Hi();
	var u = bc(), d = L(u), f = L(d);
	ni(z(L(f), 2), 1, () => (G(n()), W(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = _c(), r = L(n, !0);
		M(n), V(() => {
			Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), M(f);
	var p = z(f, 2), m = z(L(p), 2);
	ki(m), M(p), M(d);
	var h = z(d, 2);
	oa(L(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = vc(), i = z(L(r), 2);
			ki(i), M(r), V(() => Q(i, "aria-label", (G(n()), W(() => `「${n().title}」人工依據`)))), Fi(i, () => U(o), (e) => I(o, e)), J(e, r);
		},
		$$slots: { default: !0 }
	}), M(h);
	var g = z(h, 2), _ = L(g);
	ki(_), Ie(2), M(g);
	var v = z(g, 4), y = L(v);
	M(v);
	var b = z(v, 2), x = (e) => {
		var t = yc(), n = L(t, !0);
		M(t), V(() => Y(n, U(c))), J(e, t);
	};
	X(b, (e) => {
		U(c) && e(x);
	}), M(u), V(() => {
		Q(m, "aria-label", (G(n()), W(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (G(n()), W(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (G(n()), W(() => `套用「${n().title}」人工估算草稿`)));
	}), Tr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Fi(m, () => U(a), (e) => I(a, e)), Ii(_, () => U(s), (e) => I(s, e)), J(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var Sc = /* @__PURE__ */ q("<label><input type=\"checkbox\"/> <span> </span></label>"), Cc = /* @__PURE__ */ q("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), wc = /* @__PURE__ */ q("<div class=\"spike-exception-list\"></div>"), Tc = /* @__PURE__ */ q("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), Ec = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Dc = /* @__PURE__ */ q("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function Oc(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "config", 8), i = $(t, "onApply", 8), a = $(t, "onPreview", 8), o = $(t, "onPendingChange", 8, () => {}), s = [
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
	], c = r().standard_allocation, l = r()?.project?.delivery_at ?? "", u = /* @__PURE__ */ F(l.slice(0, 16)), d = /* @__PURE__ */ F(""), f = /* @__PURE__ */ F(String(c.sleep_minutes_per_day / 60)), p = /* @__PURE__ */ F(String(c.life_minutes_per_day / 60)), m = /* @__PURE__ */ F(String(c.other_unavailable_minutes_per_day / 60)), h = /* @__PURE__ */ F([...c.working_weekdays]), g = 1, _ = /* @__PURE__ */ F((r().project?.capacity_exceptions ?? []).map((e) => ({
		key: g++,
		date: e.date,
		availableHours: String(e.available_minutes / 60),
		reason: e.reason ?? "",
		publicLabel: e.public_label ?? ""
	}))), v = /* @__PURE__ */ F("");
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
		I(v, ""), o()(!0);
	}
	function S(e, t) {
		I(h, t ? [.../* @__PURE__ */ new Set([...U(h), e])].sort((e, t) => e - t) : U(h).filter((t) => t !== e)), x();
	}
	function C(e, t, n) {
		I(_, U(_).map((r) => r.key === e ? {
			...r,
			[t]: n
		} : r)), x();
	}
	function w() {
		I(_, [...U(_), {
			key: g++,
			date: "",
			availableHours: "0",
			reason: "",
			publicLabel: ""
		}]), x();
	}
	function ee(e) {
		I(_, U(_).filter((t) => t.key !== e)), x();
	}
	function te() {
		if (!U(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${U(u)}:00${e ?? b(U(u), r().timezone)}`;
	}
	function T() {
		let e = i()({
			deliveryAt: te(),
			deliveryReason: U(d),
			capacity: {
				sleepMinutes: Math.round(Number(U(f)) * 60),
				lifeMinutes: Math.round(Number(U(p)) * 60),
				otherUnavailableMinutes: Math.round(Number(U(m)) * 60),
				workingWeekdays: U(h),
				capacityExceptions: U(_).map((e) => ({
					date: e.date,
					availableMinutes: Math.round(Number(e.availableHours) * 60),
					reason: e.reason,
					publicLabel: e.publicLabel
				}))
			}
		});
		return I(v, e.error), e;
	}
	async function E() {
		T().error || (o()(!1), await a()());
	}
	B(() => (U(f), U(p), U(m)), () => {
		I(n, 24 - Number(U(f)) - Number(U(p)) - Number(U(m)));
	}), An(), Hi();
	var D = Dc(), O = L(D), ne = z(L(O), 6), k = L(ne);
	M(ne), M(O);
	var re = z(O, 2), ie = L(re), ae = z(L(ie), 2), oe = L(ae), se = z(L(oe));
	ki(se), M(oe);
	var ce = z(oe, 2), le = z(L(ce));
	ki(le), M(ce);
	var ue = z(ce, 2);
	M(ae), M(ie);
	var de = z(ie, 2), fe = L(de), pe = z(L(fe), 2);
	let me;
	var he = L(pe);
	M(pe), M(fe);
	var ge = z(fe, 2), _e = L(ge), ve = z(L(_e));
	ki(ve), M(_e);
	var ye = z(_e, 2), be = z(L(ye));
	ki(be), M(ye);
	var xe = z(ye, 2), Se = z(L(xe));
	ki(Se), M(xe), M(ge);
	var Ce = z(ge, 2);
	ni(z(L(Ce), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = Sc(), r = L(n);
		ki(r);
		var i = z(r, 2), a = L(i);
		M(i), M(n), V((e) => {
			ji(r, e), Y(a, `週${U(t), W(() => U(t).label) ?? ""}`);
		}, [() => (U(h), U(t), W(() => U(h).includes(U(t).value)))]), K("change", r, (e) => S(U(t).value, e.currentTarget.checked)), J(e, n);
	}), M(Ce), M(de);
	var we = z(de, 2), Te = L(we), Ee = z(L(Te), 2);
	M(Te);
	var De = z(Te, 2), Oe = (e) => {
		var t = wc();
		ni(t, 5, () => U(_), (e) => e.key, (e, t) => {
			var n = Cc(), r = L(n), i = z(L(r));
			ki(i), M(r);
			var a = z(r, 2), o = z(L(a));
			ki(o), M(a);
			var s = z(a, 2), c = z(L(s));
			ki(c), M(s);
			var l = z(s, 2);
			M(n), V(() => {
				Ai(i, (U(t), W(() => U(t).date))), Ai(o, (U(t), W(() => U(t).availableHours))), Ai(c, (U(t), W(() => U(t).publicLabel)));
			}), K("input", i, (e) => C(U(t).key, "date", e.currentTarget.value)), K("input", o, (e) => C(U(t).key, "availableHours", e.currentTarget.value)), K("input", c, (e) => C(U(t).key, "publicLabel", e.currentTarget.value)), K("click", l, () => ee(U(t).key)), J(e, n);
		}), M(t), J(e, t);
	}, ke = (e) => {
		J(e, Tc());
	};
	X(De, (e) => {
		U(_), W(() => U(_).length) ? e(Oe) : e(ke, -1);
	}), M(we);
	var Ae = z(we, 2), je = L(Ae), Me = z(je, 2), A = (e) => {
		var t = Ec(), n = L(t, !0);
		M(t), V(() => Y(n, U(v))), J(e, t);
	};
	X(Me, (e) => {
		U(v) && e(A);
	}), M(Ae), M(re), M(D), V((e) => {
		Y(k, `時區：${G(r()), W(() => r().timezone) ?? ""}`), me = Z(pe, 1, "", null, me, { invalid: !(U(n) > 0) }), Y(he, `工作 ${e ?? ""} hr`);
	}, [() => (U(n), W(() => Number.isFinite(U(n)) ? U(n) : "—"))]), K("input", se, x), Fi(se, () => U(u), (e) => I(u, e)), K("input", le, x), Fi(le, () => U(d), (e) => I(d, e)), K("click", ue, () => {
		I(u, ""), x();
	}), K("input", ve, x), Fi(ve, () => U(f), (e) => I(f, e)), K("input", be, x), Fi(be, () => U(p), (e) => I(p, e)), K("input", Se, x), Fi(Se, () => U(m), (e) => I(m, e)), K("click", Ee, w), K("click", je, E), J(e, D), qe();
}
Er([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var kc = (e, t = _, n = _) => {
	var r = Ic(), i = L(r), a = L(i, !0);
	M(i);
	var o = z(i, 2), s = L(o, !0);
	M(o);
	var c = z(o, 2), l = L(c, !0);
	M(c), M(r), V((e) => {
		Z(r, 1, e), Y(a, (t(), W(() => t().label))), Y(s, (t(), W(() => t().value))), Y(l, (t(), W(() => t().note)));
	}, [() => pi((n(), W(() => `time-evaluation-node ${n()}`.trim())))]), J(e, r);
}, Ac = (e, t = _) => {
	var n = Rc();
	ni(n, 5, t, Qr, (e, t) => {
		var n = Lc(), r = L(n), i = L(r), a = L(i, !0);
		M(i);
		var o = z(i), s = L(o, !0);
		M(o), M(r);
		var c = z(r, 2), l = L(c, !0);
		M(c), M(n), V(() => {
			Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
		}), J(e, n);
	}), M(n), J(e, n);
}, jc = (e, t = _) => {
	var n = zc();
	Ac(z(L(n), 2), t), M(n), J(e, n);
}, Mc = (e, t = _, n = _) => {
	var r = Bc(), i = L(r), a = L(i, !0);
	M(i);
	var o = z(i, 2), s = L(o), c = L(s);
	kc(c, () => (t(), W(() => t().engineeringLane.source)), () => ""), kc(z(c, 4), () => (t(), W(() => t().engineeringLane.result)), () => "time-evaluation-result"), M(s);
	var l = z(s, 2), u = L(l);
	kc(u, () => (t(), W(() => t().capacityLane.source)), () => ""), kc(z(u, 4), () => (t(), W(() => t().capacityLane.result)), () => "time-evaluation-result"), M(l), M(o);
	var d = z(o, 2);
	kc(z(L(d), 2), () => (t(), W(() => t().merge)), () => (t(), W(() => t().merge.className))), M(d);
	var f = z(d, 2), p = L(f);
	kc(p, () => (t(), W(() => t().risk.trend)), () => ""), kc(z(p, 4), () => (t(), W(() => t().risk.result)), () => (t(), W(() => t().risk.result.className))), M(f);
	var m = z(f, 2), h = L(m, !0);
	M(m), M(r), V(() => {
		Q(r, "hidden", !n()), Y(a, (t(), W(() => t().intro))), Y(h, (t(), W(() => t().note)));
	}), J(e, r);
}, Nc = (e, t = _, n = _) => {
	var r = Uc(), i = L(r);
	ra(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = z(i, 2);
	oa(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), W(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = Vc(), i = R(r), a = L(i, !0);
			M(i);
			var o = z(i, 2), s = L(o, !0);
			M(o), V(() => {
				Y(a, (t(), W(() => t().explanation.text))), Y(s, (t(), W(() => t().explanation.formula)));
			}), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = z(a, 2);
	oa(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = Hc(), i = L(r, !0);
			M(r), V(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), jc(z(o, 2), () => (t(), W(() => t().composition))), M(r), V(() => Q(r, "hidden", !n())), J(e, r);
}, Pc = (e, t = _, n = _) => {
	var r = Kc(), i = z(L(r), 2);
	ra(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = z(i, 2);
	oa(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = Wc(), i = z(R(r), 2), a = L(i, !0);
			M(i), V(() => Y(a, (t(), W(() => t().formulaCode)))), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = z(a, 2), s = L(o), c = L(s, !0);
	M(s);
	var l = z(s, 2), u = L(l), d = (e) => {
		var n = Ir();
		ni(R(n), 1, () => (t(), W(() => t().exceptions)), Qr, (e, t) => {
			var n = Lc(), r = L(n), i = L(r), a = L(i, !0);
			M(i);
			var o = z(i), s = L(o, !0);
			M(o), M(r);
			var c = z(r, 2), l = L(c, !0);
			M(c), M(n), V(() => {
				Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
			}), J(e, n);
		}), J(e, n);
	}, f = (e) => {
		J(e, Gc());
	};
	X(u, (e) => {
		t(), W(() => t().exceptions) ? e(d) : e(f, -1);
	}), M(l), M(o), M(r), V(() => {
		Q(r, "hidden", !n()), Y(c, (t(), W(() => t().exceptionsHeading)));
	}), J(e, r);
}, Fc = (e, t = _) => {
	var n = qc(), r = L(n), i = L(r, !0);
	M(r);
	var a = z(r, 2);
	ra(a, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var o = z(a, 2);
	oa(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = Hc(), i = L(r, !0);
			M(r), V(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), jc(z(o, 2), () => (t(), W(() => t().composition))), M(n), V(() => Y(i, (t(), W(() => t().intro)))), J(e, n);
}, Ic = /* @__PURE__ */ q("<div><span> </span> <strong> </strong> <small> </small></div>"), Lc = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), Rc = /* @__PURE__ */ q("<div class=\"time-source-list\"></div>"), zc = /* @__PURE__ */ q("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), Bc = /* @__PURE__ */ q("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), Vc = /* @__PURE__ */ q("<p> </p> <code class=\"time-formula\"> </code>", 1), Hc = /* @__PURE__ */ q("<p> </p>"), Uc = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), Wc = /* @__PURE__ */ q("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), Gc = /* @__PURE__ */ q("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), Kc = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), qc = /* @__PURE__ */ q("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), Jc = /* @__PURE__ */ q("<span> </span>"), Yc = /* @__PURE__ */ q("<!> <div class=\"time-item-rationale\"><!></div>", 1), Xc = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Zc = /* @__PURE__ */ q("<code class=\"time-formula\"> </code>"), Qc = /* @__PURE__ */ q("<code class=\"time-reference\"> </code>"), $c = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), el = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), tl = /* @__PURE__ */ q("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), nl = /* @__PURE__ */ q("<!> <!>", 1), rl = /* @__PURE__ */ q("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), il = /* @__PURE__ */ q("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), al = /* @__PURE__ */ q("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), ol = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), sl = /* @__PURE__ */ q("<div class=\"time-dialog-content\"><!></div>");
function cl(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ F([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await _r(), U(g)[r]?.focus();
	}
	Hi();
	{
		let t = /* @__PURE__ */ N(() => `關閉${i()}`);
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
				return U(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = sl(), i = L(n), c = (e) => {
					var t = $c(), n = L(t), r = L(n), i = L(r, !0);
					M(r);
					var o = z(r, 2), c = L(o, !0);
					M(o), M(n);
					var u = z(n, 2), m = (e) => {
						var t = Ir();
						Zr(R(t), () => (G(s()), G(f()), W(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ N(() => (G(s()), G(a()), W(() => ({
									...s(),
									title: a()
								}))));
								xc(e, {
									get item() {
										return U(t);
									},
									get activeEstimate() {
										return f();
									},
									get onApply() {
										return p();
									}
								});
							}
						}), J(e, t);
					}, h = (e) => {
						var t = Yc(), n = R(t);
						la(n, {
							label: "預估工時",
							get value() {
								return G(s()), W(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Ir();
								ni(R(n), 1, () => (G(s()), W(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = Jc(), r = L(n, !0);
									M(n), V(() => {
										Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
									}), J(e, n);
								}), J(e, n);
							} }
						});
						var r = z(n, 2);
						oa(L(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = Hc(), r = L(n, !0);
								M(n), V(() => Y(r, (G(s()), W(() => s().rationale)))), J(e, n);
							},
							$$slots: { default: !0 }
						}), M(r), J(e, t);
					};
					X(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = z(u, 2), _ = L(g);
					ra(_, { get metrics() {
						return G(s()), W(() => s().technical.metrics);
					} });
					var v = z(_, 2), y = (e) => {
						var t = Xc(), n = L(t), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = L(a, !0);
						M(a), M(n);
						var c = z(n, 2), l = L(c, !0);
						M(c), M(t), V(() => {
							Y(i, (G(s()), W(() => s().technical.analysisMethod.name))), Y(o, (G(s()), W(() => s().technical.analysisMethod.note))), Y(l, (G(s()), W(() => s().technical.analysisMethod.version)));
						}), J(e, t);
					};
					X(v, (e) => {
						G(s()), W(() => s().technical.analysisMethod) && e(y);
					});
					var b = z(v, 2), x = (e) => {
						oa(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = Zc(), r = L(n, !0);
								M(n), V(() => Y(r, (G(s()), W(() => s().technical.formula)))), J(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					X(b, (e) => {
						G(s()), W(() => s().technical.formula) && e(x);
					});
					var S = z(b, 2), C = (e) => {
						var t = Qc(), n = L(t, !0);
						M(t), V(() => Y(n, (G(s()), W(() => s().technical.reference)))), J(e, t);
					};
					X(S, (e) => {
						G(s()), W(() => s().technical.reference) && e(C);
					}), M(g), M(t), V(() => {
						Z(r, 1, pi((G(s()), W(() => s().confidenceClass)))), Y(i, (G(s()), W(() => s().confidenceLabel))), Y(c, (G(s()), W(() => s().toggleLabel))), Q(g, "hidden", (G(s()), W(() => !s().detailsExpanded)));
					}), K("click", o, function(...e) {
						l()?.apply(this, e);
					}), J(e, t);
				}, v = (e) => {
					var t = ol(), n = L(t), r = L(n), i = L(r, !0);
					M(r);
					var a = z(r, 2), s = L(a, !0);
					M(a), M(n);
					var c = z(n, 2), f = L(c);
					ni(f, 5, () => (G(o()), W(() => o().overview)), Qr, (e, t) => {
						var n = tl(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = L(a), s = (e) => {
							var n = el();
							V(() => Z(n, 1, `time-risk-dot ${U(t), W(() => U(t).urgencyClassName) ?? ""}`)), J(e, n);
						};
						X(o, (e) => {
							U(t), W(() => U(t).urgencyClassName) && e(s);
						});
						var c = z(o);
						M(a), M(n), V(() => {
							Y(i, (U(t), W(() => U(t).label))), Y(c, ` ${U(t), W(() => U(t).value) ?? ""}`);
						}), J(e, n);
					}), M(f);
					var p = z(f, 2), v = L(p, !0);
					M(p), M(c);
					var y = z(c, 2), b = L(y), x = (e) => {
						var t = Ir(), n = R(t), r = (e) => {
							var t = nl(), n = R(t);
							Oc(n, {
								get config() {
									return G(m()), W(() => m().config);
								},
								get onApply() {
									return G(m()), W(() => m().onApply);
								},
								get onPreview() {
									return G(m()), W(() => m().onPreview);
								},
								get onPendingChange() {
									return G(m()), W(() => m().onPendingChange);
								}
							});
							var r = z(n, 2), i = (e) => {
								Ca(e, { get preview() {
									return h();
								} });
							};
							X(r, (e) => {
								h() && e(i);
							}), J(e, t);
						}, i = (e) => {
							var t = rl(), n = z(L(t), 4);
							M(t), K("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), J(e, t);
						};
						X(n, (e) => {
							G(m()), W(() => m().hasConfig) ? e(r) : e(i, -1);
						}), J(e, t);
					}, S = (e) => {
						var t = al(), n = R(t);
						ni(n, 7, () => (G(o()), W(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = il(), i = L(r, !0);
							M(r), Vi(r, (e, t) => Qt(g, U(g)[t] = e), (e) => U(g)?.[e], () => [U(n)]), V(() => {
								Q(r, "id", (U(t), W(() => `time-${U(t).name}-tab`))), Q(r, "aria-controls", (U(t), W(() => `time-${U(t).name}-panel`))), Q(r, "aria-selected", (G(o()), U(t), W(() => o().activeTab === U(t).name))), Q(r, "tabindex", (G(o()), U(t), W(() => o().activeTab === U(t).name ? 0 : -1))), Y(i, (U(t), W(() => U(t).label)));
							}), K("click", r, () => u()(U(t).name)), K("keydown", r, (e) => _(e, U(n), o().tabs)), J(e, r);
						}), M(n);
						var r = z(n, 2);
						Mc(r, () => (G(o()), W(() => o().flow)), () => (G(o()), W(() => o().activeTab === "flow")));
						var i = z(r, 2);
						Nc(i, () => (G(o()), W(() => o().engineering)), () => (G(o()), W(() => o().activeTab === "engineering"))), Pc(z(i, 2), () => (G(o()), W(() => o().capacity)), () => (G(o()), W(() => o().activeTab === "capacity"))), J(e, t);
					}, C = (e) => {
						Fc(e, () => (G(o()), W(() => o().estimateOnly)));
					};
					X(b, (e) => {
						d() && m() ? e(x) : (G(o()), W(() => o().hasDeadline) ? e(S, 1) : e(C, -1));
					}), M(y), M(t), V(() => {
						Y(i, (G(o()), W(() => o().captionLabel))), Q(a, "aria-expanded", (G(o()), W(() => o().detailsExpanded))), Y(s, (G(o()), W(() => o().toggleLabel))), Y(v, (G(o()), W(() => o().updatedLabel))), Q(y, "hidden", (G(o()), W(() => !o().detailsExpanded)));
					}), K("click", a, function(...e) {
						l()?.apply(this, e);
					}), J(e, t);
				};
				X(i, (e) => {
					r() === "item" && s() ? e(c) : r() === "project" && o() && e(v, 1);
				}), M(n), J(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	qe();
}
Er(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var ll = /* @__PURE__ */ q("<span class=\"time-risk-dot\"></span>"), ul = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), dl = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>");
function fl(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = dl(), d = L(u), f = L(d, !0);
	M(d);
	var p = z(d, 2), m = (e) => {
		J(e, ll());
	};
	X(p, (e) => {
		s() && e(m);
	});
	var h = z(p, 2), g = (e) => {
		J(e, ul());
	};
	X(h, (e) => {
		c() && e(g);
	}), M(u), V(() => {
		Z(u, 1, pi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), Y(f, o());
	}), K("click", u, function(...e) {
		l()?.apply(this, e);
	}), J(e, u);
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var pl = {
	"task-list": rc,
	"status-overview": to,
	"status-filters": $a,
	"project-progress": Va,
	"report-summary": Wa,
	"mode-toggle": ka,
	"save-bar": Za,
	"add-control": $i,
	diagnostics: Da,
	"scope-directory": qa,
	"theme-control": gc,
	"project-module-strip": Fa,
	"time-summary-button": fl,
	"time-dialog": cl,
	"cost-dialog": va,
	"delivery-save-confirmation": Ta
}, ml = {
	id: "svelte",
	regions: Object.keys(pl),
	mount(e, t, n) {
		let r = rn({ ...n });
		return {
			component: Vr(pl[e], {
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
e(ml);
//#endregion
