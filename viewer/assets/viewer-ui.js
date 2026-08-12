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
var b = 1024, x = 2048, S = 4096, C = 8192, ee = 16384, te = 32768, w = 1 << 25, T = 65536, ne = 1 << 19, re = 1 << 20, ie = 1 << 25, ae = 65536, oe = 1 << 21, se = 1 << 22, ce = 1 << 23, le = Symbol("$state"), ue = Symbol("legacy props"), de = Symbol(""), fe = Symbol("attributes"), pe = Symbol("class"), me = Symbol("style"), he = Symbol("text"), ge = Symbol("form reset"), _e = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ve = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var E = !1;
function Fe(e) {
	E = e;
}
var D;
function Ie(e) {
	if (e === null) throw Me(), t;
	return D = e;
}
function Le() {
	return Ie(/* @__PURE__ */ hn(D));
}
function O(e) {
	if (E) {
		if (/* @__PURE__ */ hn(D) !== null) throw Me(), t;
		D = e;
	}
}
function Re(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ hn(n);
		D = n;
	}
}
function ze(e = !0) {
	for (var t = 0, n = D;;) {
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
var k = null;
function Ke(e) {
	k = e;
}
function qe(e, t = !1, n) {
	k = {
		p: k,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: B,
		l: We && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Je(e) {
	var t = k, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, k = t.p, e ?? {};
}
function Ye() {
	return !We || k !== null && k.l === null;
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
	var t = B;
	if (t === null) return z.f |= ce, e;
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
function A(e, t) {
	e.f = e.f & nt | t;
}
function rt(e) {
	e.f & 512 || e.deps === null ? A(e, b) : A(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function it(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ae, it(t.deps));
}
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), it(e.deps), A(e, b);
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
	E && /* @__PURE__ */ mn(e) !== null && gn(e);
}
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ge]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = z, n = B;
	Zn(null), Qn(null);
	try {
		return e();
	} finally {
		Zn(t), Qn(n);
	}
}
function ft(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[ge];
	e[ge] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function pt(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Cn() && (V(n), Mn(() => (t === 0 && (r = H(() => e(() => nn(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var mt = T | ne;
function ht(e, t, n, r) {
	new gt(e, t, n, r);
}
var gt = class {
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
	#h = pt(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Nn(() => {
			if (E) {
				let e = this.#t;
				Le();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, mt), E && (this.#e = D);
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
		Qe(r), t && (this.#s = Pn(() => {
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
			t = !0, n && Ae(), this.#s !== null && Vn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Pn(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = pn();
			e.append(t), this.#a = this.#S(() => Pn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Vn(this.#o, () => {
				this.#o = null;
			}), this.#x(j));
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
			} else this.#x(j);
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
		var t = B, n = z, r = k;
		Qn(this.#i), Zn(this.#i), Ke(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} catch (e) {
			return et(e), null;
		} finally {
			Qn(t), Zn(n), Ke(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && en(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		j?.is_fork ? (this.#a && j.skip_effect(this.#a), this.#o && j.skip_effect(this.#o), this.#s && j.skip_effect(this.#s), j.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Rn(this.#a), null), this.#o &&= (Rn(this.#o), null), this.#s &&= (Rn(this.#s), null), E && (Ie(this.#t), Re(), Ie(ze()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Pn(() => {
						var r = B;
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
function _t(e, t, n, r) {
	let i = Ye() ? xt : wt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				tt(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ Ct(e))).then(u).catch((e) => tt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), yt();
	}) : f();
}
function vt() {
	var e = B, t = z, n = k, r = j;
	return function(i = !0) {
		Qn(e), Zn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	Qn(null), Zn(null), Ke(null), e && j?.deactivate();
}
function bt() {
	var e = B, t = e.b, n = j, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var t = 2 | x;
	return B !== null && (B.f |= ne), {
		ctx: k,
		deps: null,
		effects: null,
		equals: Ve,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: n,
		wv: 0,
		parent: B,
		ac: null
	};
}
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, t, r) {
	let i = B;
	i === null && be();
	var a = void 0, o = Zt(n), s = !z, c = /* @__PURE__ */ new Set();
	return jn(() => {
		var t = B, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== _e && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = j;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= ce, en(o, t)) : (o.f & 8388608 && (o.f ^= ce), en(o, e)), r.deactivate());
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
	return t.equals = Ue, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Rn(t[n]);
	}
}
function Et(e) {
	var t, r = B, i = e.parent;
	if (!Jn && i !== null && e.v !== n && i.f & 24576) return je(), e.v;
	Qn(i);
	try {
		e.f &= ~ae, Tt(e), t = fr(e);
	} finally {
		Qn(r);
	}
	return t;
}
function Dt(e) {
	var t = Et(e);
	if (!e.equals(t) && (e.wv = lr(), (!j?.is_fork || e.deps === null) && (j === null ? e.v = t : (j.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null))) {
		A(e, b);
		return;
	}
	Jn || (Mt === null ? rt(e) : (Cn() || j?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(_e), t.ac = null;
	}), t.fn !== null && (t.teardown = g), mr(t, 0), In(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && hr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, j = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
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
			for (var r of n.d) A(r, x), t(r);
			for (r of n.m) A(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Rt++ > 1e3 && (this.#x(), Ht());
		for (let e of this.#u) this.#d.delete(e), A(e, x), this.schedule(e);
		for (let e of this.#d) A(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = It = [], r = [], i = Lt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw qt(e), this.#h() || this.discard(), t;
		}
		if (j = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (It = null, Lt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Kt(e, t);
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
		this.#r.clear(), jt = this, Wt(r), Wt(n), jt = null, this.#s?.resolve();
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), A(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), j = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Mt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		j = this;
	}
	deactivate() {
		j = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, j = this, this.#g();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, j = null, Mt = null, Yt.clear();
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
		if (j === null) {
			let t = j = new e();
			!Ft && !Pt && Qe(() => {
				t.#e || t.flush();
			});
		}
		return j;
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
			if (It !== null && t === B && (z === null || !(z.f & 2))) return;
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
		for (e && (j !== null && !j.is_fork && j.flush(), n = e());;) {
			if ($e(), j === null) return n;
			j.flush();
		}
	} finally {
		Pt = t;
	}
}
function Ht() {
	try {
		Te();
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
	j.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), A(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	A(e, b);
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
		equals: Ve,
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
function M(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = Ue), We && n && k !== null && k.l !== null && (k.l.s ??= []).push(r), r;
}
function $t(e, t) {
	return N(e, H(() => V(e))), t;
}
function N(e, t, n = !1) {
	return z !== null && (!Xn || z.f & 131072) && Ye() && z.f & 4325394 && ($n === null || !$n.has(e)) && ke(), en(e, n ? an(t) : t, Lt);
}
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Yt.set(e, Jn ? t : e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && rt(t);
		}
		e.wv = lr(), rn(e, x, n), Ye() && B !== null && B.f & 1024 && !(B.f & 96) && (rr === null ? ir([e]) : rr.push(e)), !r.is_fork && Jt.size > 0 && !Xt && tn();
	}
	return t;
}
function tn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && A(e, S);
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
	N(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === B)) {
			var l = (c & x) === 0;
			if (l && A(s, t), c & 131072) Jt.add(s);
			else if (c & 2) {
				var u = s;
				Mt?.delete(u), c & 65536 || (c & 512 && (B === null || !(B.f & 2097152)) && (s.f |= ae), rn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Ut !== null && Ut.add(d), n === null ? Gt(d) : n.push(d);
			}
		}
	}
}
function an(e) {
	if (typeof e != "object" || !e || le in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Qt(0), s = null, c = sr, l = (e) => {
		if (sr === c) return e();
		var t = z, n = sr;
		Zn(null), cr(c);
		var r = e();
		return Zn(t), cr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Qt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && De();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Qt(n.value, s);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Qt(n, s));
					r.set(t, e), nn(o);
				}
			} else N(i, n), nn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === le) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Qt(an(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = V(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			var i = Reflect.getOwnPropertyDescriptor(e, t);
			if (i && "value" in i) {
				var a = r.get(t);
				a && (i.value = V(a));
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
			return (i !== void 0 || B !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Qt(a ? an(e[t]) : n, s)), r.set(t, i)), V(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Qt(n, s)), r.set(p + "", m)) : N(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Qt(void 0, s)), N(d, an(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => an(a));
				N(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && N(_, v + 1);
				}
				nn(o);
			}
			return !0;
		},
		ownKeys(e) {
			V(o);
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
function on(e) {
	try {
		if (typeof e == "object" && e && le in e) return e[le];
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
		un = u(t, "firstChild").get, dn = u(t, "nextSibling").get, h(e) && (e[pe] = void 0, e[fe] = null, e[me] = void 0, e.__e = void 0), h(n) && (n[he] = void 0);
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
function P(e, t) {
	if (!E) return /* @__PURE__ */ mn(e);
	var n = /* @__PURE__ */ mn(D);
	if (n === null) n = D.appendChild(pn());
	else if (t && n.nodeType !== 3) {
		var r = pn();
		return n?.before(r), Ie(r), r;
	}
	return t && yn(n), Ie(n), n;
}
function F(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ mn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ hn(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = pn();
			return D?.before(r), Ie(r), r;
		}
		yn(D);
	}
	return D;
}
function I(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ hn(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = pn();
			return r === null ? i?.after(a) : r.before(a), Ie(a), a;
		}
		yn(r);
	}
	return Ie(r), r;
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
	B === null && (z === null && we(e), Ce()), Jn && Se(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = B;
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
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			hr(r);
		} catch (e) {
			throw Rn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= T));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), z !== null && z.f & 2 && !(e & 64))) {
		var a = z;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return z !== null && !Xn;
}
function wn(e) {
	let t = Sn(8, null);
	return A(t, b), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = B.f;
	if (!z && t & 32 && k !== null && !k.i) {
		var n = k;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | re, e);
}
function Dn(e) {
	return bn("$effect.pre"), Sn(8 | re, e);
}
function On(e) {
	Bt.ensure();
	let t = Sn(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Vn(t, () => {
			Rn(t), n(void 0);
		}) : (Rn(t), n(void 0));
	});
}
function kn(e) {
	return Sn(4, e);
}
function L(e, t) {
	var n = k, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Mn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = B;
			try {
				Qn(n.parent), H(t);
			} finally {
				Qn(n);
			}
		}
	});
}
function An() {
	var e = k;
	Mn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && A(n, S), ur(n) && hr(n), t.ran = !1;
		}
	});
}
function jn(e) {
	return Sn(se | ne, e);
}
function Mn(e, t = 0) {
	return Sn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(V));
		});
	});
}
function Nn(e, t = 0) {
	return Sn(16 | t, e);
}
function Pn(e) {
	return Sn(32 | ne, e);
}
function Fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Jn, n = z;
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
			e.abort(_e);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (zn(e.nodes.start, e.nodes.end), n = !0), e.f |= w, In(e, t && !n), mr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Fn(e), e.f ^= w, e.f |= ee;
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
		e.f ^= C, e.f & 1024 || (A(e, x), Bt.ensure().schedule(e));
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
var z = null, Xn = !1;
function Zn(e) {
	z = e;
}
var B = null;
function Qn(e) {
	B = e;
}
var $n = null;
function er(e) {
	z !== null && ($n ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~ae), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ur(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && A(e, b);
	}
	return !1;
}
function dr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !($n !== null && $n.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? dr(a, t, !1) : t === a && (n ? A(a, x) : a.f & 1024 && A(a, S), Gt(a));
	}
}
function fr(e) {
	var t = tr, n = nr, r = rr, i = z, a = $n, o = k, s = Xn, c = sr, l = e.f;
	tr = null, nr = 0, rr = null, z = l & 96 ? null : e, $n = null, Ke(e.ctx), Xn = !1, sr = ++or, e.ac !== null && (dt(() => {
		e.ac.abort(_e);
	}), e.ac = null);
	try {
		e.f |= oe;
		var u = e.fn, d = u();
		e.f |= te;
		var f = e.deps, p = j?.is_fork;
		if (tr !== null) {
			var m;
			if (p || mr(e, nr), f !== null && nr > 0) for (f.length = nr + tr.length, m = 0; m < tr.length; m++) f[nr + m] = tr[m];
			else e.deps = f = tr;
			if (Cn() && e.f & 512) for (m = nr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && nr < f.length && (mr(e, nr), f.length = nr);
		if (Ye() && rr !== null && !Xn && f !== null && !(e.f & 6146)) for (m = 0; m < rr.length; m++) dr(rr[m], e);
		if (i !== null && i !== e) {
			if (or++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = or;
			if (t !== null) for (let e of t) e.rv = or;
			rr !== null && (r === null ? r = rr : r.push(...rr));
		}
		return e.f & 8388608 && (e.f ^= ce), d;
	} catch (e) {
		return et(e);
	} finally {
		e.f ^= oe, tr = t, nr = n, rr = r, z = i, $n = a, Ke(o), Xn = s, sr = c;
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
		c.f & 512 && (c.f ^= 512, c.f &= ~ae), c.v !== n && rt(c), c.ac !== null && dt(() => {
			c.ac.abort(_e), c.ac = null, A(c, x);
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
		A(e, b);
		var n = B, r = qn;
		B = e, qn = !(t & 96);
		try {
			t & 16777232 ? Ln(e) : In(e), Fn(e);
			var i = fr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ar;
		} finally {
			qn = r, B = n;
		}
	}
}
async function gr() {
	await Promise.resolve(), Vt();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Kn?.add(e), z !== null && !Xn && !(B !== null && B.f & 16384) && ($n === null || !$n.has(e))) {
		var n = z.deps;
		if (z.f & 2097152) e.rv < or && (e.rv = or, tr === null && n !== null && n[nr] === e ? nr++ : tr === null ? tr = [e] : tr.push(e));
		else {
			z.deps ??= [], s.call(z.deps, e) || z.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [z] : s.call(r, z) || r.push(z);
		}
	}
	if (Jn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Jn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || vr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Xn && z !== null && (qn || !!(z.f & 512)), c = (i.f & te) === 0;
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
function H(e) {
	var t = Xn;
	try {
		return Xn = !0, e();
	} finally {
		Xn = t;
	}
}
function U(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (le in e) yr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && le in n && yr(n);
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
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Qe(() => {
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
function W(e, t, n) {
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
		var d = z, f = B;
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
	var n = B;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function G(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return jr(D, null), D;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ mn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ mn(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
function Mr() {
	if (E) return jr(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = pn();
	return e.append(t, n), jr(t, n), e;
}
function K(e, t) {
	if (E) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), Le();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Nr = ["touchstart", "touchmove"];
function Pr(e) {
	return Nr.includes(e);
}
var Fr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Ir(e) {
	return Fr.includes(e);
}
function q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[he] ??= e.nodeValue) && (e[he] = n, e.nodeValue = `${n}`);
}
function Lr(e, t) {
	return zr(e, t);
}
var Rr = /* @__PURE__ */ new Map();
function zr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	fn();
	var u = void 0, d = On(() => {
		var s = r ?? n.appendChild(pn());
		ht(s, { pending: () => {} }, (n) => {
			qe({});
			var r = k;
			if (o && (r.c = o), a && (i.$$events = a), E && jr(n, null), u = e(n, i) || {}, E && (B.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw Me(), t;
			Je();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Pr(r);
					for (let e of [n, document]) {
						var a = Rr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Rr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(xr)), Sr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Rr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Dr), t.delete(e), t.size === 0 && Rr.delete(r)) : t.set(e, i);
			}
			Sr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Br.set(u, d), u;
}
var Br = /* @__PURE__ */ new WeakMap();
function Vr(e, t) {
	let n = Br.get(e);
	return n ? (Br.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Hr = class {
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
		var n = j, r = _n();
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
		} else E && (this.anchor = D), this.#a(n);
	}
};
function Ur(e) {
	k === null && ye("onMount"), We && k.l !== null ? Wr(k).m.push(e) : Tn(() => {
		let t = H(e);
		if (typeof t == "function") return t;
	});
}
function Wr(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function J(e, t, n = !1) {
	var r;
	E && (r = D, Le());
	var i = new Hr(e), a = n ? T : 0;
	function o(e, t) {
		if (E) {
			var n = Be(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ze();
				Ie(a), i.anchor = a, Fe(!1), i.ensure(e, t), Fe(!0);
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
var Gr = Symbol("NaN");
function Kr(e, t, n) {
	E && Le();
	var r = new Hr(e), i = !Ye();
	Nn(() => {
		var e = t();
		e !== e && (e = Gr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function qr(e, t) {
	return t;
}
function Jr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Vn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Yr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		Yr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Yr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, Gn(a, document.createDocumentFragment())) : Rn(t[i], n);
	}
}
var Xr;
function Y(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = E ? Ie(/* @__PURE__ */ mn(u)) : u.appendChild(pn());
	}
	E && Le();
	var d = null, f = /* @__PURE__ */ wt(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Qr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, ei(d, null, s)) : Un(d) : Vn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Nn(() => {
			p = V(f);
			var e = p.length;
			let a = !1;
			E && Be(s) === "[!" != (e === 0) && (s = ze(), Ie(s), Fe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = j, v = _n(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (s = D, a = !0, Fe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && u.unskip_effect(S.e)) : (S = $r(l, h ? s : Xr ??= pn(), b, x, y, i, t, n), h || (S.e.f |= ie), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Pn(() => o(s)) : (d = Pn(() => o(Xr ??= pn())), d.f |= ie)), e > c.size && xe("", "", ""), E && e > 0 && Ie(ze()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Fe(!0), V(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, E && (s = D);
}
function Zr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Qr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = Zr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Un(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ie, _ === l) ei(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ti(e, d, _), ti(e, _, y), ei(_, y, n), d = _, p = [], m = [], l = Zr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) ei(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					ti(e, S.prev, C.next), ti(e, d, S), ti(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), ei(_, l, n), ti(e, _.prev, _.next), ti(e, _, d === null ? e.effect.first : d.next), ti(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Zr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Zr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Yr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = Zr(l.next);
		var te = ee.length;
		if (te > 0) {
			var w = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.fix();
			}
			Jr(e, ee, w);
		}
	}
	a && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function $r(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ M(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Pn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ei(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ hn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ti(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function ni(e, t, n, r, a, o) {
	let s = E;
	E && Le();
	var c = null;
	E && D.nodeType === 1 && (c = D, Le());
	var l = E ? D : e, u = new Hr(l, !1);
	Nn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = E ? c : vn(e, o), jr(c, c), r) {
					var n = null;
					E && Ir(e) && c.append(n = document.createComment(""));
					var i = E ? /* @__PURE__ */ mn(c) : c.appendChild(pn());
					E && (i === null ? Fe(!1) : Ie(i)), r(c, i), n?.remove();
				}
				B.nodes.end = c, t.before(c);
			}
			E && Ie(t);
		}), () => {};
	}, T), wn(() => {}), s && (Fe(!0), Ie(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function ri(e, t, n) {
	kn(() => {
		var r = H(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Mn(() => {
				var e = n();
				U(e), i && He(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ii(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = ii(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function ai() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ii(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function oi(e) {
	return typeof e == "object" ? ai(e) : e ?? "";
}
var si = [..." 	\n\r\f\xA0\v﻿"];
function ci(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || si.includes(r[o - 1])) && (s === r.length || si.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function X(e, t, n, r, i, a) {
	var o = e[pe];
	if (E || o !== n || o === void 0) {
		var s = ci(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[pe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Ne();
		for (var r of e.options) r.selected = t.includes(fi(r));
		return;
	}
	for (r of e.options) if (sn(fi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
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
	}), wn(() => {
		t.disconnect();
	});
}
function di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ft(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), fi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && fi(o);
		}
		n(a), e.__value = a, j !== null && r.add(j);
	}), kn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = j;
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
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = ve ? "link" : "LINK", gi = ve ? "progress" : "PROGRESS";
function Z(e) {
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
		e[ge] = n, Qe(n), ut();
	}
}
function _i(e, t) {
	var n = yi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === gi) && (e.value = t ?? "");
}
function vi(e, t) {
	var n = yi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = yi(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[de] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[fe] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === r
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
	ft(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = wi(e) ? Ti(a) : a, n(a), j !== null && r.add(j), await gr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || H(t) == null && e.value) && (n(wi(e) ? Ti(e.value) : e.value), j !== null && r.add(j)), Mn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = j;
			if (r.has(i)) return;
		}
		wi(e) && n === Ti(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Ci(e, t, n = t) {
	ft(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (E && e.defaultChecked !== e.checked || H(t) == null) && n(e.checked), Mn(() => {
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
	return e === t || e?.[le] === t;
}
function Di(e = {}, t, n, r) {
	var i = k.r, a = B;
	return kn(() => {
		var o, s;
		return Mn(() => {
			o = s, s = r?.() || [], H(() => {
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
	let t = k, n = t.l.u;
	if (!n) return;
	let r = () => U(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ xt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => V(i);
	}
	n.b.length && Dn(() => {
		ki(t, r), v(n.b);
	}), Tn(() => {
		let e = H(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Tn(() => {
		ki(t, r), v(n.a);
	});
}
function ki(e, t) {
	if (e.l.s) for (let t of e.l.s) V(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !We || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ xt(r), V(l)) : (c && (c = !1, s = o ? H(r) : r), s);
	let f;
	if (a) {
		var p = le in e || ue in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = st(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ee(t), f(m)));
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
	a && V(y);
	var b = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? an(e) : e;
			return N(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Jn && v || b.f & 16384 ? y.v : V(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ge();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Ai = /* @__PURE__ */ G("<button type=\"button\">＋</button>"), ji = /* @__PURE__ */ G("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), Mi = /* @__PURE__ */ G("<option> </option>"), Ni = /* @__PURE__ */ G("<span class=\"task-add-contract\"> </span>"), Pi = /* @__PURE__ */ G("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), Fi = /* @__PURE__ */ G("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), Ii = /* @__PURE__ */ G("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function Li(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = /* @__PURE__ */ M(), s = /* @__PURE__ */ M(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), ee = /* @__PURE__ */ M(""), te = /* @__PURE__ */ M(""), w = /* @__PURE__ */ M(u()?.creationDefaultValue ?? 2), T = /* @__PURE__ */ M();
	async function ne() {
		await gr(), V(T)?.focus?.();
	}
	function re(e) {
		e.preventDefault(), C()({
			title: V(ee),
			summary: V(te),
			priority: u().normalize(V(w), u().creationDefaultValue)
		});
	}
	function ie(e) {
		e.key === "Escape" && (e.preventDefault(), S()());
	}
	L(() => U(c()), () => {
		N(n, c() === "task");
	}), L(() => (U(d()), V(n)), () => {
		N(r, d() || (V(n) ? "增加工作項目" : "增加待處理子任務"));
	}), L(() => (U(f()), V(n)), () => {
		N(i, f() || (V(n) ? "任務名稱" : "子任務描述"));
	}), L(() => (U(p()), V(n)), () => {
		N(a, p() || (V(n) ? "新任務名稱" : "新子任務描述"));
	}), L(() => (U(g()), V(n)), () => {
		N(o, g() || (V(n) ? "新任務優先級" : "新子任務優先級"));
	}), L(() => (U(v()), V(n)), () => {
		N(s, v() || (V(n) ? "加入任務" : "新增"));
	}), L(() => U(l()), () => {
		l() && ne();
	}), An(), Oi();
	var ae = Mr(), oe = F(ae), se = (e) => {
		var t = Ai();
		R(() => {
			X(t, 1, oi(V(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", V(r));
		}), W("click", t, function(...e) {
			x()?.apply(this, e);
		}), K(e, t);
	}, ce = (e) => {
		var t = Ii(), r = P(t);
		Z(r), Di(r, (e) => N(T, e), () => V(T));
		var c = I(r, 2), l = (e) => {
			var t = ji();
			ct(t), R(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Si(t, () => V(te), (e) => N(te, e)), K(e, t);
		};
		J(c, (e) => {
			V(n) && e(l);
		});
		var d = I(c, 2);
		Y(d, 5, () => (U(u()), H(() => u().levels)), (e) => e.value, (e, t) => {
			var n = Mi(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				q(r, e), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
			}, [() => (U(u()), V(t), H(() => u().format(V(t).value)))]), K(e, n);
		}), O(d);
		var f = I(d, 2), p = (e) => {
			var t = Ni(), n = P(t, !0);
			O(t), R(() => q(n, _())), K(e, t);
		};
		J(f, (e) => {
			V(n) && _() && e(p);
		});
		var g = I(f, 2), v = (e) => {
			var t = Pi(), n = F(t), r = P(n, !0);
			O(n);
			var i = I(n, 2), a = P(i), o = P(a, !0);
			O(a);
			var c = I(a, 2), l = P(c, !0);
			O(c), O(i), R(() => {
				Q(n, "hidden", !b()), q(r, b()), q(o, y()), q(l, V(s));
			}), W("click", a, function(...e) {
				S()?.apply(this, e);
			}), K(e, t);
		}, x = (e) => {
			var t = Fi(), n = F(t), r = P(n, !0);
			O(n);
			var i = I(n, 2), a = P(i, !0);
			O(i);
			var o = I(i, 2), c = P(o, !0);
			O(o), R(() => {
				q(r, y()), q(a, V(s)), Q(o, "hidden", !b()), q(c, b());
			}), W("click", n, function(...e) {
				S()?.apply(this, e);
			}), K(e, t);
		};
		J(g, (e) => {
			V(n) ? e(v) : e(x, -1);
		}), O(t), R(() => {
			X(t, 1, oi(V(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", V(n) ? 160 : 300), Q(r, "placeholder", V(i)), Q(r, "aria-label", V(a)), Q(d, "aria-label", V(o));
		}), wr("submit", t, re), W("keydown", t, ie), Si(r, () => V(ee), (e) => N(ee, e)), di(d, () => V(w), (e) => N(w, e)), K(e, t);
	};
	J(oe, (e) => {
		l() ? e(ce, -1) : e(se);
	}), K(e, ae), Je();
}
Tr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var Ri = /* @__PURE__ */ G("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), zi = /* @__PURE__ */ G("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), Bi = /* @__PURE__ */ G("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Vi = /* @__PURE__ */ G("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Hi(e, t) {
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
	Oi();
	var c = Vi(), l = P(c), u = P(l), d = I(P(u), 2), f = P(d, !0);
	O(d), O(u), Re(2), O(l);
	var p = I(l, 2), m = (e) => {
		var t = Ri(), r = P(t), i = I(P(r), 2), o = P(i, !0);
		O(i), O(r);
		var s = I(r, 2), c = I(P(s), 2), l = P(c, !0);
		O(c), O(s), O(t), R((e, t) => {
			q(o, e), q(l, t);
		}, [() => (U(n()), H(() => a(n().before))), () => (U(n()), H(() => a(n().after)))]), K(e, t);
	}, h = (e) => {
		K(e, zi());
	};
	J(p, (e) => {
		U(n()), H(() => n().deliveryChanged) ? e(m) : (U(n()), H(() => n().capacityChanged) && e(h, 1));
	});
	var g = I(p, 2), _ = P(g), v = I(P(_), 2), y = P(v, !0);
	O(v);
	var b = I(v, 2), x = P(b);
	O(b), O(_);
	var S = I(_, 4), C = I(P(S), 2), ee = P(C, !0);
	O(C);
	var te = I(C, 2), w = P(te);
	O(te), O(S), O(g);
	var T = I(g, 2), ne = P(T), re = I(P(ne)), ie = P(re, !0);
	O(re), O(ne);
	var ae = I(ne, 2), oe = I(P(ae)), se = P(oe, !0);
	O(oe), O(ae), O(T);
	var ce = I(T, 2), le = (e) => {
		var t = Bi(), r = I(P(t), 1, !0);
		O(t), R(() => q(r, (U(n()), H(() => n().reason)))), K(e, t);
	};
	J(ce, (e) => {
		U(n()), H(() => n().reason) && e(le);
	}), O(c), R((e, t, i, a) => {
		q(f, r()), q(y, (U(n()), H(() => n().current.label))), q(x, `剩餘容量 ${e ?? ""}`), X(S, 1, (U(n()), H(() => `risk-${n().next.urgency ?? "none"}`))), q(ee, (U(n()), H(() => n().next.label))), q(w, `剩餘容量 ${t ?? ""}`), q(ie, i), q(se, a);
	}, [
		() => (U(n()), H(() => o(n().current.remainingCapacityMinutes))),
		() => (U(n()), H(() => o(n().next.remainingCapacityMinutes))),
		() => (U(n()), H(() => s(n().capacityDelta))),
		() => (U(n()), H(() => s(n().balanceDelta)))
	]), K(e, c), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var Ui = /* @__PURE__ */ G("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Wi(e, t) {
	qe(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ M(), s = /* @__PURE__ */ M();
	Ur(() => {
		V(o).showModal(), V(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	Oi();
	var u = Ui(), d = I(P(u), 2);
	Hi(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = I(d, 2), p = P(f);
	Di(p, (e) => N(s, e), () => V(s));
	var m = I(p, 2), h = P(m, !0);
	O(m), O(f), O(u), Di(u, (e) => N(o, e), () => V(o)), R(() => {
		p.disabled = r(), m.disabled = r(), q(h, r() ? "正在儲存…" : "確認儲存");
	}), wr("cancel", u, c), W("keydown", u, l), W("click", p, function(...e) {
		i()?.apply(this, e);
	}), W("click", m, function(...e) {
		a()?.apply(this, e);
	}), K(e, u), Je();
}
Tr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var Gi = /* @__PURE__ */ G("<div><strong> </strong> <p> </p></div>");
function Ki(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Mr();
	Y(F(i), 1, n, qr, (e, t) => {
		let n = /* @__PURE__ */ wt(() => (V(t), H(() => V(t).level ?? "error")));
		var i = Gi(), a = P(i), o = P(a, !0);
		O(a);
		var s = I(a, 2), c = P(s, !0);
		O(s), O(i), R(() => {
			X(i, 1, `diagnostic diagnostic-${V(n)}`), q(o, (U(V(n)), H(() => r[V(n)] ?? r.error))), q(c, (V(t), H(() => V(t).message)));
		}), K(e, i);
	}), K(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var qi = /* @__PURE__ */ G("<button class=\"view-mode-toggle editor-mode-dock\" type=\"button\"> </button>");
function Ji(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	L(() => U(a()), () => {
		N(n, a() === "edit");
	}), L(() => V(n), () => {
		N(r, V(n) ? "編輯模式" : "預覽模式");
	}), L(() => V(n), () => {
		N(i, V(n) ? "預覽模式" : "編輯模式");
	}), An(), Oi();
	var d = qi(), f = P(d, !0);
	O(d), R(() => {
		Q(d, "aria-pressed", V(n)), Q(d, "aria-label", `目前為${V(r)}；按下切換到${V(i)}`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), q(f, V(r));
	}), W("click", d, () => u()(V(n) ? "preview" : "edit")), K(e, d), Je();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Yi = /* @__PURE__ */ G("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <progress class=\"project-progress-meter\" id=\"project-progress-meter\" max=\"100\"></progress>", 1);
function Xi(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "timeProgressPercent", 8, null);
	L(() => (U(o()), U(r()), U(i()), U(a())), () => {
		N(n, o() === null ? `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位` : `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；時間已使用 ${o()}%`);
	}), An();
	var s = Yi(), c = F(s), l = P(c), u = P(l);
	O(l), O(c);
	var d = I(c, 2);
	R(() => {
		q(u, `整體約 ${r() ?? ""}%`), _i(d, r()), Q(d, "aria-label", V(n));
	}), K(e, s), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Zi = /* @__PURE__ */ G("<a class=\"scope-developer-link\"> </a>"), Qi = /* @__PURE__ */ G("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function $i(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Mr();
	Y(F(i), 1, n, (e) => e.id, (e, t) => {
		var n = Qi(), i = P(n), a = P(i, !0);
		O(i);
		var o = I(i, 2), s = (e) => {
			var n = Zi(), i = P(n, !0);
			O(n), R(() => {
				Q(n, "href", (V(t), H(() => V(t).baseOnlyHref))), q(i, r());
			}), K(e, n);
		};
		J(o, (e) => {
			V(t), H(() => V(t).baseOnlyHref) && e(s);
		}), O(n), R(() => {
			Q(i, "href", (V(t), H(() => V(t).href))), q(a, (V(t), H(() => V(t).id)));
		}), K(e, n);
	}), K(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var ea = /* @__PURE__ */ G("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1);
function ta(e, t) {
	let n = $(t, "dirty", 8, !1), r = $(t, "saving", 8, !1), i = $(t, "canUndo", 8, !1), a = $(t, "canRedo", 8, !1), o = $(t, "message", 8, ""), s = $(t, "buttonLabel", 8, "儲存"), c = $(t, "savingLabel", 8, "正在儲存…"), l = $(t, "undoLabel", 8, "復原"), u = $(t, "redoLabel", 8, "重做"), d = $(t, "onSave", 8, () => {}), f = $(t, "onUndo", 8, () => {}), p = $(t, "onRedo", 8, () => {});
	var m = ea(), h = F(m), g = P(h, !0);
	O(h);
	var _ = I(h, 2), v = P(_), y = P(v, !0);
	O(v);
	var b = I(v, 2), x = P(b, !0);
	O(b), O(_);
	var S = I(_, 2), C = P(S, !0);
	O(S), R(() => {
		q(g, o()), Q(v, "aria-label", `${l()}上一個修改`), v.disabled = !i() || r(), q(y, l()), Q(b, "aria-label", `${u()}下一個修改`), b.disabled = !a() || r(), q(x, u()), S.disabled = !n() || r(), q(C, r() ? c() : s());
	}), W("click", v, function(...e) {
		f()?.apply(this, e);
	}), W("click", b, function(...e) {
		p()?.apply(this, e);
	}), W("click", S, function(...e) {
		d()?.apply(this, e);
	}), K(e, m);
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusFilters.svelte
var na = /* @__PURE__ */ G("<button type=\"button\"> </button>");
function ra(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = $(t, "activeFilter", 8, "all"), o = $(t, "statusLabels", 24, () => ({})), s = $(t, "onFilterChange", 8, () => {}), c = $(t, "onReorder", 8, () => {}), l = /* @__PURE__ */ M(null), u = /* @__PURE__ */ M(null), d = !1, f = null, p = /* @__PURE__ */ M(null), m = /* @__PURE__ */ M();
	async function h() {
		let e = V(p);
		N(p, null), await gr(), V(m)?.parentElement?.querySelector(`[data-filter="${e}"]`)?.focus();
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
		let r = V(n).filter((e) => e !== "all"), i = r.indexOf(e), a = i + t;
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
	function ee(e, t) {
		!V(l) || e === V(l) || (t.preventDefault(), t.dataTransfer.dropEffect = "move", N(u, {
			status: e,
			placeAfter: v(t.currentTarget, t.clientX)
		}));
	}
	function te(e, t) {
		t.currentTarget.contains(t.relatedTarget) || V(u)?.status === e && N(u, null);
	}
	function w(e, t) {
		if (!V(l)) return;
		t.preventDefault();
		let n = V(l), r = v(t.currentTarget, t.clientX);
		g(), y(n, e, r);
	}
	function T() {
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
	function ie(e) {
		if (!f || f.pointerId !== e.pointerId) return;
		let t = f;
		f = null, e.currentTarget.releasePointerCapture?.(e.pointerId), g(), t.active && t.targetStatus && y(t.status, t.targetStatus, t.placeAfter), setTimeout(() => {
			d = !1;
		}, 0);
	}
	L(() => (U(i()), U(r())), () => {
		N(n, ["all", ...i()].filter((e) => e === "all" || (r()[e] ?? 0) > 0));
	}), L(() => (U(i()), V(p)), () => {
		i() && V(p) && h();
	}), An(), Oi();
	var ae = Mr();
	Y(F(ae), 1, () => V(n), (e) => e, (e, t) => {
		let i = /* @__PURE__ */ wt(() => (V(t), U(o()), H(() => V(t) === "all" ? "全部" : o()[V(t)] ?? V(t)))), s = /* @__PURE__ */ wt(() => (U(r()), V(t), H(() => r()[V(t)] ?? 0))), c = /* @__PURE__ */ wt(() => V(t) !== "all");
		var d = na(), f = P(d);
		O(d), Di(d, (e) => N(m, e), () => V(m)), R((e, n) => {
			X(d, 1, `filter-button ${V(c) ? "status-sortable" : ""} ${V(l) === V(t) ? "status-dragging" : ""} ${e ?? ""}`), Q(d, "data-filter", V(t)), Q(d, "aria-pressed", V(t) === a()), Q(d, "draggable", V(c)), Q(d, "title", V(c) ? V(t) === "planned" ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序" : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動" : null), Q(d, "aria-keyshortcuts", V(c) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(d, "aria-label", n), q(f, `${V(i) ?? ""} ${V(s) ?? ""}`);
		}, [() => (V(t), V(u), H(() => _(V(t), V(u)))), () => (U(V(c)), U(V(i)), U(V(s)), V(n), V(t), H(() => V(c) ? `${V(i)} ${V(s)}，排序第 ${V(n).indexOf(V(t))}；可拖曳調整` : null))]), W("click", d, (e) => x(V(t), e)), W("keydown", d, function(...e) {
			(V(c) ? (e) => S(V(t), e) : null)?.apply(this, e);
		}), wr("dragstart", d, function(...e) {
			(V(c) ? (e) => C(V(t), e) : null)?.apply(this, e);
		}), wr("dragover", d, function(...e) {
			(V(c) ? (e) => ee(V(t), e) : null)?.apply(this, e);
		}), wr("dragleave", d, function(...e) {
			(V(c) ? (e) => te(V(t), e) : null)?.apply(this, e);
		}), wr("drop", d, function(...e) {
			(V(c) ? (e) => w(V(t), e) : null)?.apply(this, e);
		}), wr("dragend", d, function(...e) {
			(V(c) ? T : null)?.apply(this, e);
		}), W("pointerdown", d, function(...e) {
			(V(c) ? (e) => ne(V(t), e) : null)?.apply(this, e);
		}), W("pointermove", d, function(...e) {
			(V(c) ? (e) => re(V(t), e) : null)?.apply(this, e);
		}), W("pointerup", d, function(...e) {
			(V(c) ? ie : null)?.apply(this, e);
		}), wr("pointercancel", d, function(...e) {
			(V(c) ? ie : null)?.apply(this, e);
		}), K(e, d);
	}), K(e, ae), Je();
}
Tr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var ia = /* @__PURE__ */ G("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function aa(e, t) {
	qe(t, !1);
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
	L(() => (U(i()), U(r())), () => {
		N(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), An(), Oi();
	var o = Mr();
	Y(F(o), 1, () => V(n), (e) => e.status, (e, t) => {
		var n = ia(), r = P(n), i = P(r, !0);
		O(r);
		var a = I(r, 2), o = P(a, !0);
		O(a), O(n), R(() => {
			X(n, 1, (V(t), H(() => `overview-card overview-${V(t).tone}`))), Q(n, "data-status", (V(t), H(() => V(t).status))), q(i, (V(t), H(() => V(t).value))), q(o, (V(t), H(() => V(t).label)));
		}), K(e, n);
	}), K(e, o), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var oa = /* @__PURE__ */ G("<span class=\"developer-expand-hint\">展開作法與方向</span>"), sa = /* @__PURE__ */ G("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), ca = /* @__PURE__ */ G("<li> </li>"), la = /* @__PURE__ */ G("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), ua = /* @__PURE__ */ G("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), da = /* @__PURE__ */ G("<code class=\"reference\"> </code>"), fa = /* @__PURE__ */ G("<article class=\"decision-item\"><p> </p> <!></article>"), pa = /* @__PURE__ */ G("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), ma = /* @__PURE__ */ G("<p> </p>"), ha = /* @__PURE__ */ G("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), ga = /* @__PURE__ */ G("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), _a = /* @__PURE__ */ G("<div class=\"path-list\"></div>"), va = /* @__PURE__ */ G("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), ya = /* @__PURE__ */ G("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), ba = /* @__PURE__ */ G("<!> <!>", 1);
function xa(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = $(t, "developer", 8, null);
	L(() => U(o()), () => {
		N(n, o()?.next_steps ?? []);
	}), L(() => (U(o()), V(n)), () => {
		N(r, o()?.next_step ?? V(n)[0] ?? "尚未指定下一步");
	}), L(() => (U(o()), V(n)), () => {
		N(i, o()?.next_step ? V(n) : V(n).slice(1));
	}), L(() => (V(i), U(o())), () => {
		N(a, !!(V(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), An(), Oi();
	var s = Mr(), c = F(s), l = (e) => {
		var t = Mr();
		ni(F(t), () => V(a) ? "details" : "section", !1, (e, t) => {
			X(e, 0, "developer-details");
			var n = ba(), s = F(n);
			ni(s, () => V(a) ? "summary" : "div", !1, (e, t) => {
				X(e, 0, "developer-summary");
				var n = sa(), i = I(F(n), 2), o = P(i, !0);
				O(i);
				var s = I(i, 2), c = (e) => {
					K(e, oa());
				};
				J(s, (e) => {
					V(a) && e(c);
				}), R(() => q(o, V(r))), K(t, n);
			});
			var c = I(s, 2), l = (e) => {
				var t = ya(), n = I(P(t), 2), r = (e) => {
					var t = la(), n = I(P(t), 2);
					Y(n, 5, () => V(i), qr, (e, t) => {
						var n = ca(), r = P(n, !0);
						O(n), R(() => q(r, V(t))), K(e, n);
					}), O(n), O(t), K(e, t);
				};
				J(n, (e) => {
					V(i), H(() => V(i).length) && e(r);
				});
				var a = I(n, 2), s = (e) => {
					var t = ua(), n = I(P(t), 2);
					Y(n, 5, () => (U(o()), H(() => o().blockers)), qr, (e, t) => {
						var n = ca(), r = P(n, !0);
						O(n), R(() => q(r, V(t))), K(e, n);
					}), O(n), O(t), K(e, t);
				};
				J(a, (e) => {
					U(o()), H(() => o().blockers?.length) && e(s);
				});
				var c = I(a, 2), l = (e) => {
					var t = pa(), n = I(P(t), 2);
					Y(n, 5, () => (U(o()), H(() => o().decisions)), qr, (e, t) => {
						var n = fa(), r = P(n), i = P(r, !0);
						O(r);
						var a = I(r, 2), o = (e) => {
							var n = da(), r = P(n, !0);
							O(n), R(() => q(r, (V(t), H(() => V(t).reference)))), K(e, n);
						};
						J(a, (e) => {
							V(t), H(() => V(t).reference) && e(o);
						}), O(n), R(() => q(i, (V(t), H(() => V(t).summary)))), K(e, n);
					}), O(n), O(t), K(e, t);
				};
				J(c, (e) => {
					U(o()), H(() => o().decisions?.length) && e(l);
				});
				var u = I(c, 2), d = (e) => {
					var t = ga(), n = I(P(t), 2);
					Y(n, 5, () => (U(o()), H(() => o().routes)), qr, (e, t) => {
						var n = ha(), r = P(n), i = P(r), a = P(i, !0);
						O(i);
						var o = I(i, 2), s = P(o, !0);
						O(o), O(r);
						var c = I(r, 2), l = (e) => {
							var n = ma(), r = P(n, !0);
							O(n), R(() => q(r, (V(t), H(() => V(t).reason)))), K(e, n);
						};
						J(c, (e) => {
							V(t), H(() => V(t).reason) && e(l);
						}), O(n), R(() => {
							q(a, (V(t), H(() => V(t).title))), X(o, 1, (V(t), H(() => `route-state route-${V(t).state}`))), q(s, (V(t), H(() => V(t).state)));
						}), K(e, n);
					}), O(n), O(t), K(e, t);
				};
				J(u, (e) => {
					U(o()), H(() => o().routes?.length) && e(d);
				});
				var f = I(u, 2), p = (e) => {
					var t = va(), n = I(P(t), 2), r = P(n);
					O(n);
					var i = I(n, 2), a = (e) => {
						var t = ma(), n = P(t);
						O(t), R(() => q(n, `Worktree: ${U(o()), H(() => o().claim.worktree) ?? ""}`)), K(e, t);
					};
					J(i, (e) => {
						U(o()), H(() => o().claim.worktree) && e(a);
					});
					var s = I(i, 2), c = (e) => {
						var t = _a();
						Y(t, 5, () => (U(o()), H(() => o().claim.source_paths)), qr, (e, t) => {
							var n = da(), r = P(n, !0);
							O(n), R(() => q(r, V(t))), K(e, n);
						}), O(t), K(e, t);
					};
					J(s, (e) => {
						U(o()), H(() => o().claim.source_paths?.length) && e(c);
					}), O(t), R(() => q(r, `Agent: ${U(o()), H(() => o().claim.agent) ?? ""}`)), K(e, t);
				};
				J(f, (e) => {
					U(o()), H(() => o().claim) && e(p);
				}), O(t), K(e, t);
			};
			J(c, (e) => {
				V(a) && e(l);
			}), K(t, n);
		}), K(e, t);
	};
	J(c, (e) => {
		o() && e(l);
	}), K(e, s), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Sa = /* @__PURE__ */ G("<option> </option>"), Ca = /* @__PURE__ */ G("<button class=\"time-item-button\" type=\"button\"> </button>"), wa = /* @__PURE__ */ G("<span class=\"time-item-button\"> </span>"), Ta = /* @__PURE__ */ G("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button>", 1), Ea = /* @__PURE__ */ G("<span> </span>"), Da = /* @__PURE__ */ G("<span class=\"spike-item-title\"> </span> <!> <!>", 1), Oa = /* @__PURE__ */ G("<li><!></li>");
function ka(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "onTimeClick", 8, null);
	L(() => (U(l()), U(s())), () => {
		N(n, l().metadata(s().priority));
	}), L(() => (U(l()), U(s())), () => {
		N(r, l().format(s().priority));
	}), L(() => U(d()), () => {
		N(i, d() ? d().label ?? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), An(), Oi();
	var p = Oa();
	let m;
	var h = P(p), g = (e) => {
		var t = Ta(), n = F(t);
		Z(n);
		var r = I(n, 2);
		Y(r, 5, () => (U(l()), H(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Sa(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				q(r, e), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
			}, [() => (U(l()), V(t), H(() => l().format(V(t).value)))]), K(e, n);
		}), O(r);
		var c;
		ui(r);
		var p = I(r, 2), m = (e) => {
			var t = Ca(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "aria-label", (U(s()), V(i), H(() => `${s().title}，${V(i)}，查看估算依據`))), q(n, V(i));
			}), W("click", t, () => f()(s().id, s().title, a())), K(e, t);
		}, h = (e) => {
			var t = wa(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "title", (U(d()), H(() => `目前分析：${d().likely_minutes} 分鐘`))), q(n, V(i));
			}), K(e, t);
		};
		J(p, (e) => {
			d() && f() ? e(m) : d() && e(h, 1);
		});
		var g = I(p, 2);
		R(() => {
			Q(n, "aria-label", (U(s()), H(() => `編輯子項目：${s().title}`))), _i(n, (U(s()), H(() => s().title))), Q(r, "aria-label", (U(s()), H(() => `設定「${s().title}」的優先級`))), c !== (c = (U(s()), H(() => s().priority))) && (r.value = (r.__value = (U(s()), H(() => s().priority))) ?? "", li(r, (U(s()), H(() => s().priority)))), Q(g, "aria-label", (U(s()), H(() => `刪除子項目：${s().title}`)));
		}), W("input", n, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "title",
			value: e.currentTarget.value
		})), W("change", r, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "priority",
			value: Number(e.currentTarget.value)
		})), W("click", g, () => u()({
			type: "delete-item",
			taskId: a(),
			field: o(),
			itemId: s().id
		})), K(e, t);
	}, _ = (e) => {
		var t = Da(), o = F(t), c = P(o, !0);
		O(o);
		var u = I(o, 2), p = (e) => {
			var t = Ea(), i = P(t, !0);
			O(t), R(() => {
				X(t, 1, (V(n), H(() => `priority-badge priority-${V(n).tone}`))), q(i, V(r));
			}), K(e, t);
		};
		J(u, (e) => {
			V(n), U(l()), H(() => V(n) && (!V(n).hidden || !l().labelsValid)) && e(p);
		});
		var m = I(u, 2), h = (e) => {
			var t = Ca(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "aria-label", (U(s()), V(i), H(() => `${s().title}，${V(i)}，查看估算依據`))), q(n, V(i));
			}), W("click", t, () => f()(s().id, s().title, a())), K(e, t);
		}, g = (e) => {
			var t = wa(), n = P(t, !0);
			O(t), R(() => {
				Q(t, "title", (U(d()), H(() => `目前分析：${d().likely_minutes} 分鐘`))), q(n, V(i));
			}), K(e, t);
		};
		J(m, (e) => {
			d() && f() ? e(h) : d() && e(g, 1);
		}), R(() => q(c, (U(s()), H(() => s().title)))), K(e, t);
	};
	J(h, (e) => {
		c() ? e(g) : e(_, -1);
	}), O(p), R(() => m = X(p, 1, "editor-item-row", null, m, { "editable-work-item": c() })), K(e, p), Je();
}
Tr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Aa = /* @__PURE__ */ G("<option> </option>"), ja = /* @__PURE__ */ G("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), Ma = /* @__PURE__ */ G("<span> </span>"), Na = /* @__PURE__ */ G("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Pa = /* @__PURE__ */ G("<h3> </h3>"), Fa = /* @__PURE__ */ G("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Ia = /* @__PURE__ */ G("<p class=\"task-summary\"> </p>"), La = /* @__PURE__ */ G("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Ra = /* @__PURE__ */ G("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), za = /* @__PURE__ */ G("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Ba = /* @__PURE__ */ G("<div class=\"spike-add-shell\"><!></div>"), Va = /* @__PURE__ */ G("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function Ha(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = /* @__PURE__ */ M(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let f = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), p = $(t, "onTimeClick", 8, null), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "taskDuration", 8, null), g = [
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
	], _ = /* @__PURE__ */ M(!1), v = /* @__PURE__ */ M(""), y = /* @__PURE__ */ M(l().creationDefaultValue), b = /* @__PURE__ */ M("");
	function x() {
		N(_, !1), N(v, ""), N(y, l().creationDefaultValue), N(b, "");
	}
	function S() {
		let e = d()(V(v), Number(V(y)));
		N(b, e.error), V(b) || x();
	}
	L(() => U(o()), () => {
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
	}), L(() => (V(n), U(m())), () => {
		N(r, [...V(n)].sort((e, t) => {
			let n = m().indexOf(e.status), r = m().indexOf(t.status);
			return (n < 0 ? m().length : n) - (r < 0 ? m().length : r);
		}));
	}), L(() => (U(l()), U(o())), () => {
		N(i, l().metadata(o().priority));
	}), L(() => U(o()), () => {
		N(a, g.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), L(() => (U(c()), V(_)), () => {
		!c() && V(_) && x();
	}), An(), Oi();
	var C = Va(), ee = P(C), te = P(ee), w = P(te), T = P(w), ne = P(T, !0);
	O(T);
	var re = I(T, 2), ie = (e) => {
		var t = ja(), n = F(t);
		Y(n, 5, () => g, (e) => e.value, (e, t) => {
			var n = Aa(), r = P(n, !0);
			O(n);
			var i = {};
			R(() => {
				q(r, (V(t), H(() => V(t).label))), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
			}), K(e, n);
		}), O(n);
		var r;
		ui(n);
		var i = I(n, 2);
		Y(i, 5, () => (U(l()), H(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Aa(), r = P(n, !0);
			O(n);
			var i = {};
			R((e) => {
				q(r, e), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
			}, [() => (U(l()), V(t), H(() => l().format(V(t).value)))]), K(e, n);
		}), O(i);
		var a;
		ui(i), R(() => {
			Q(n, "aria-label", (U(o()), H(() => `${o().title} 狀態`))), r !== (r = (U(o()), H(() => o().status))) && (n.value = (n.__value = (U(o()), H(() => o().status))) ?? "", li(n, (U(o()), H(() => o().status)))), Q(i, "aria-label", (U(o()), H(() => `${o().title} 優先級`))), a !== (a = (U(o()), H(() => o().priority))) && (i.value = (i.__value = (U(o()), H(() => o().priority))) ?? "", li(i, (U(o()), H(() => o().priority))));
		}), W("change", n, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: e.currentTarget.value
		})), W("change", i, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(e.currentTarget.value)
		})), K(e, t);
	}, ae = (e) => {
		var t = Ma(), n = P(t, !0);
		O(t), R((e, r, a) => {
			X(t, 1, (V(i), H(() => `task-priority-badge priority-badge priority-${V(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), q(n, a);
		}, [
			() => (U(l()), U(o()), H(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (U(l()), U(o()), H(() => `優先級：${l().format(o().priority)}`)),
			() => (U(l()), U(o()), H(() => l().format(o().priority)))
		]), K(e, t);
	};
	J(re, (e) => {
		c() ? e(ie) : (V(i), U(l()), H(() => V(i) && (!V(i).hidden || !l().labelsValid)) && e(ae, 1));
	}), O(w);
	var oe = I(w, 2), se = P(oe), ce = (e) => {
		var t = Na();
		Z(t), R(() => {
			Q(t, "id", (U(o()), H(() => `task-${o().id}-title`))), _i(t, (U(o()), H(() => o().title)));
		}), W("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), K(e, t);
	}, le = (e) => {
		var t = Pa(), n = P(t, !0);
		O(t), R(() => {
			Q(t, "id", (U(o()), H(() => `task-${o().id}-title`))), q(n, (U(o()), H(() => o().title)));
		}), K(e, t);
	};
	J(se, (e) => {
		c() ? e(ce) : e(le, -1);
	});
	var ue = I(se, 2), de = P(ue, !0);
	O(ue), O(oe), O(te);
	var fe = I(te, 2), pe = P(fe), me = P(pe);
	O(pe);
	var he = I(pe, 2), ge = P(he, !0);
	O(he), O(fe), O(ee);
	var _e = I(ee, 2), ve = (e) => {
		var t = Fa();
		ct(t), R(() => _i(t, (U(o()), H(() => o().summary)))), W("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), K(e, t);
	}, ye = (e) => {
		var t = Ia(), n = P(t, !0);
		O(t), R(() => q(n, (U(o()), H(() => o().summary)))), K(e, t);
	};
	J(_e, (e) => {
		c() ? e(ve) : e(ye, -1);
	});
	var be = I(_e, 2);
	{
		let e = /* @__PURE__ */ wt(() => (U(o()), H(() => o().developer ?? null)));
		xa(be, { get developer() {
			return V(e);
		} });
	}
	var xe = I(be, 2), Se = P(xe);
	Y(Se, 1, () => V(r), (e) => e.status, (e, t) => {
		var n = Mr(), r = F(n), i = (e) => {
			var n = La(), r = P(n), i = P(r, !0);
			O(r);
			var a = I(r, 2);
			Y(a, 5, () => (V(t), H(() => V(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ wt(() => (U(f()), V(n), H(() => f().get(V(n).id) ?? null)));
					ka(e, {
						get taskId() {
							return U(o()), H(() => o().id);
						},
						get field() {
							return V(t), H(() => V(t).field);
						},
						get item() {
							return V(n);
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
							return V(r);
						},
						get onTimeClick() {
							return p();
						}
					});
				}
			}), O(a), O(n), R(() => {
				X(n, 1, (V(t), H(() => `detail-section ${V(t).className}`))), q(i, (V(t), H(() => V(t).title)));
			}), K(e, n);
		};
		J(r, (e) => {
			V(t), U(c()), H(() => V(t).items.length || c()) && e(i);
		}), K(e, n);
	});
	var Ce = I(Se, 2), we = P(Ce), Te = (e) => {
		var t = Ba(), n = P(t), r = (e) => {
			var t = Ra(), n = P(t);
			Z(n);
			var r = I(n, 2);
			Y(r, 5, () => (U(l()), H(() => l().levels)), (e) => e.value, (e, t) => {
				var n = Aa(), r = P(n, !0);
				O(n);
				var i = {};
				R((e) => {
					q(r, e), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
				}, [() => (U(l()), V(t), H(() => l().format(V(t).value)))]), K(e, n);
			}), O(r);
			var i = I(r, 2), a = I(i, 2), o = I(a, 2), s = P(o, !0);
			O(o), O(t), R(() => {
				Q(o, "hidden", !V(b)), q(s, V(b));
			}), W("keydown", n, (e) => {
				e.key === "Enter" && S(), e.key === "Escape" && x();
			}), Si(n, () => V(v), (e) => N(v, e)), di(r, () => V(y), (e) => N(y, e)), W("click", i, S), W("click", a, x), K(e, t);
		}, i = (e) => {
			var t = za();
			R(() => Q(t, "aria-label", (U(o()), H(() => `在「${o().title}」新增子項目`)))), W("click", t, () => {
				N(_, !0);
			}), K(e, t);
		};
		J(n, (e) => {
			V(_) ? e(r) : e(i, -1);
		}), O(t), K(e, t);
	};
	J(we, (e) => {
		c() && e(Te);
	}), O(Ce), O(xe), O(C), R(() => {
		X(C, 1, (V(a), H(() => `task-card editor-task-card status-${V(a).tone}`))), Q(C, "aria-labelledby", (U(o()), H(() => `task-${o().id}-title`))), X(T, 1, (V(a), H(() => `status-badge status-${V(a).tone}`))), q(ne, (V(a), H(() => V(a).label))), Q(ue, "hidden", !h()), q(de, h() ? `約需 ${h()}` : ""), Q(pe, "aria-label", (U(s()), H(() => `子項目完成 ${s().completed}，共 ${s().total}`))), q(me, `${U(s()), H(() => s().completed) ?? ""} / ${U(s()), H(() => s().total) ?? ""}`), q(ge, (U(o()), H(() => o().id)));
	}), K(e, C), Je();
}
Tr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var Ua = /* @__PURE__ */ G("<p class=\"empty-state\"> </p>");
function Wa(e, t) {
	qe(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "onTimeClick", 8, null), d = $(t, "durations", 24, () => ({})), f = $(t, "statusOrder", 24, () => ["done", "planned"]), p = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	Oi();
	var m = Mr(), h = F(m), g = (e) => {
		var t = Mr();
		Y(F(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ wt(() => (U(c()), V(t), H(() => c().get(V(t).id) ?? null))), p = /* @__PURE__ */ wt(() => (U(d()), V(t), H(() => d()[V(t).id] ?? null)));
				Ha(e, {
					get task() {
						return V(t);
					},
					get progress() {
						return U(r()), V(t), H(() => r()[V(t).id]);
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
					onAddItem: (e, n) => s()(V(t).id, e, n),
					get timeTask() {
						return V(n);
					},
					get timeItems() {
						return l();
					},
					get onTimeClick() {
						return u();
					},
					get statusOrder() {
						return f();
					},
					get taskDuration() {
						return V(p);
					}
				});
			}
		}), K(e, t);
	}, _ = (e) => {
		var t = Ua(), n = P(t, !0);
		O(t), R(() => q(n, p())), K(e, t);
	};
	J(h, (e) => {
		U(n()), H(() => n().length) ? e(g) : e(_, -1);
	}), K(e, m), Je();
}
//#endregion
//#region viewer/assets/theme-model.js
var Ga = [
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
], Ka = Object.freeze({
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
var qa = /^#[0-9a-f]{6}$/i;
function Ja(e) {
	return typeof e == "string" && qa.test(e);
}
function Ya(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Ka[n], i = { base: n };
	for (let e of Ga) {
		let n = t[e.key];
		i[e.key] = Ja(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Xa(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Za(e, t) {
	if (!Ja(e) || !Ja(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Xa(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Qa(e) {
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
	].filter(([, e, t]) => Za(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var $a = /* @__PURE__ */ G("<option> </option>"), eo = /* @__PURE__ */ G("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), to = /* @__PURE__ */ G("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function no(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ M(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ M(), p = /* @__PURE__ */ M([]), m = /* @__PURE__ */ M(a()), h = /* @__PURE__ */ M(o()?.base ?? s()), g = /* @__PURE__ */ M(v(Ya(V(h)))), _ = /* @__PURE__ */ M({ ...V(g) });
	function v(e) {
		return Object.fromEntries(Ga.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		N(h, e.base), N(g, v(e)), N(_, { ...V(g) });
		for (let e of V(p)) e?.setCustomValidity("");
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
		y(o() ? Ya(o().base, o()) : Ya(s())), typeof V(f).showModal == "function" ? V(f).showModal() : V(f).setAttribute("open", "");
	}
	function S() {
		V(f).open && V(f).close();
	}
	function C(e) {
		y(Ya(e.currentTarget.value));
	}
	function ee(e, t, n) {
		let r = n.currentTarget.value;
		N(g, {
			...V(g),
			[e.key]: r
		}), N(_, {
			...V(_),
			[e.key]: r
		}), V(p)[t]?.setCustomValidity("");
	}
	function te(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), N(g, {
			...V(g),
			[e.key]: n.value
		}), r && N(_, {
			...V(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function w() {
		N(m, a()), S();
	}
	function T(e) {
		e.preventDefault(), w();
	}
	function ne() {
		let e = V(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ya(V(h), V(_))), S();
	}
	L(() => U(a()), () => {
		N(m, a());
	}), L(() => (V(h), V(_)), () => {
		N(n, Ya(V(h), V(_)));
	}), L(() => V(n), () => {
		N(r, Qa(V(n)));
	}), L(() => V(r), () => {
		N(i, V(r).length ? `注意：${V(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), An(), Oi();
	var re = to(), ie = F(re), ae = I(P(ie), 2);
	Y(ae, 5, () => u, (e) => e.value, (e, t) => {
		var n = $a(), r = P(n, !0);
		O(n);
		var i = {};
		R(() => {
			q(r, (V(t), H(() => V(t).label))), i !== (i = (V(t), H(() => V(t).value))) && (n.value = (n.__value = (V(t), H(() => V(t).value))) ?? "");
		}), K(e, n);
	}), O(ae), O(ie);
	var oe = I(ie, 2), se = P(oe), ce = I(P(se), 2);
	O(se);
	var le = I(se, 4), ue = I(P(le), 2), de = P(ue);
	de.value = de.__value = "light";
	var fe = I(de);
	fe.value = fe.__value = "dark", O(ue);
	var pe;
	ui(ue), O(le);
	var me = I(le, 2);
	Y(me, 7, () => Ga, (e) => e.key, (e, t, r) => {
		var i = eo(), a = P(i), o = P(a, !0);
		O(a);
		var s = I(a, 2), c = P(s);
		Z(c);
		var l = I(c, 2);
		Z(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Di(l, (e, t) => $t(p, V(p)[t] = e), (e) => V(p)?.[e], () => [V(r)]), O(s), O(i), R(() => {
			q(o, (V(t), H(() => V(t).label))), Q(c, "aria-label", (V(t), H(() => `${V(t).label}選色器`))), _i(c, (V(n), V(t), H(() => V(n)[V(t).key]))), Q(l, "aria-label", (V(t), H(() => `${V(t).label}十六進位色碼`))), _i(l, (V(g), V(t), H(() => V(g)[V(t).key])));
		}), W("input", c, (e) => ee(V(t), V(r), e)), W("input", l, (e) => te(V(t), e)), K(e, i);
	}), O(me);
	var he = I(me, 2);
	let ge;
	var _e = P(he, !0);
	O(he);
	var ve = I(he, 2), ye = P(ve), be = I(ye, 4), xe = I(be, 2);
	O(ve), O(oe), Di(oe, (e) => N(f, e), () => V(f)), R(() => {
		pe !== (pe = V(h)) && (ue.value = (ue.__value = V(h)) ?? "", li(ue, V(h))), ge = X(he, 1, "theme-dialog-status", null, ge, { "theme-status-warning": V(r).length > 0 }), q(_e, V(i));
	}), W("change", ae, b), di(ae, () => V(m), (e) => N(m, e)), wr("cancel", oe, T), W("click", ce, w), W("change", ue, C), W("click", ye, () => y(Ya(V(h)))), W("click", be, w), W("click", xe, ne), K(e, re), Je();
}
Tr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var ro = /* @__PURE__ */ G("<span> </span>"), io = /* @__PURE__ */ G("<p class=\"spike-field-error\" role=\"alert\"> </p>"), ao = /* @__PURE__ */ G("<form class=\"spike-estimate-form\"><section class=\"time-estimate-readout\"><div class=\"time-estimate-meta\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <section class=\"time-explanation-card time-item-rationale\"><h3>估算依據</h3> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label></section> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function oo(e, t) {
	qe(t, !1);
	let n = $(t, "item", 8), r = $(t, "activeEstimate", 8, null), i = $(t, "onApply", 8, () => ({ error: "" })), a = /* @__PURE__ */ M(String((r()?.likely_minutes ?? n().likelyMinutes) / 60)), o = /* @__PURE__ */ M(r()?.human_note ?? ""), s = /* @__PURE__ */ M(!!(r()?.human_confirmed ?? n().humanConfirmed)), c = /* @__PURE__ */ M("");
	function l() {
		let e = Number(V(a));
		if (!Number.isFinite(e) || e <= 0) {
			N(c, "工時必須大於 0。");
			return;
		}
		let t = i()({
			taskId: n().taskId,
			itemId: n().itemId,
			likelyMinutes: Math.round(e * 60),
			humanNote: V(o),
			humanConfirmed: V(s)
		});
		N(c, t?.error ?? "");
	}
	Oi();
	var u = ao(), d = P(u), f = P(d);
	Y(I(P(f), 2), 1, () => (U(n()), H(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = ro(), r = P(n, !0);
		O(n), R(() => {
			X(n, 1, `time-source-badge source-${V(t), H(() => V(t).kind) ?? ""}`), q(r, (V(t), H(() => V(t).label)));
		}), K(e, n);
	}), O(f);
	var p = I(f, 2), m = I(P(p), 2);
	Z(m), O(p), O(d);
	var h = I(d, 2), g = I(P(h), 2), _ = I(P(g), 2);
	Z(_), O(g), O(h);
	var v = I(h, 2), y = P(v);
	Z(y), Re(2), O(v);
	var b = I(v, 4), x = P(b);
	O(b);
	var S = I(b, 2), C = (e) => {
		var t = io(), n = P(t, !0);
		O(t), R(() => q(n, V(c))), K(e, t);
	};
	J(S, (e) => {
		V(c) && e(C);
	}), O(u), R(() => {
		Q(m, "aria-label", (U(n()), H(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (U(n()), H(() => `「${n().title}」人工依據`))), Q(y, "aria-label", (U(n()), H(() => `確認「${n().title}」的人工估算`))), Q(x, "aria-label", (U(n()), H(() => `套用「${n().title}」人工估算草稿`)));
	}), wr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Si(m, () => V(a), (e) => N(a, e)), Si(_, () => V(o), (e) => N(o, e)), Ci(y, () => V(s), (e) => N(s, e)), K(e, u), Je();
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
var so = /* @__PURE__ */ new Map([
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
var co = Object.freeze([...so.entries()].map(([e, t]) => Object.freeze({
	value: e,
	label: t
}))), lo = /* @__PURE__ */ G("<label><input type=\"checkbox\"/> </label>"), uo = /* @__PURE__ */ G("<form class=\"time-capacity-editor\"><div class=\"time-editor-heading\"><h3>設定</h3> <span>重新計算只更新預覽；全域儲存才提交本機設定</span></div> <div class=\"time-editor-fields\"><label class=\"time-editor-field\"><span>每日睡眠</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label> <label class=\"time-editor-field\"><span>每日生活時間</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label> <label class=\"time-editor-field\"><span>其他固定不可工作</span> <span class=\"time-editor-control\"><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\" required=\"\"/> <span>hr</span></span></label></div> <p class=\"time-capacity-derived\"> </p> <fieldset class=\"time-weekdays\"><legend>工作日</legend> <!></fieldset> <label class=\"time-exceptions-editor\"><span>休假與例外</span> <textarea rows=\"4\" placeholder=\"2026-07-29 | 0 | 休假\"></textarea> <small>每行：日期 | 當日可工作 hr | 公開標籤</small></label> <p class=\"time-editor-error\"> </p> <div class=\"time-editor-actions\"><button class=\"primary-button\" type=\"submit\">重新計算</button></div></form>");
function fo(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = /* @__PURE__ */ M(), i = $(t, "editor", 8), a = $(t, "onSubmit", 8, () => {}), o = /* @__PURE__ */ M(String(i().sleepHours)), s = /* @__PURE__ */ M(String(i().lifeHours)), c = /* @__PURE__ */ M(String(i().otherHours)), l = /* @__PURE__ */ M([...i().workingWeekdays]), u = /* @__PURE__ */ M(i().exceptionsText);
	function d(e, t) {
		N(l, t ? [...V(l), e] : V(l).filter((t) => t !== e));
	}
	function f(e) {
		e.preventDefault(), a()({
			sleepHours: V(o),
			lifeHours: V(s),
			otherHours: V(c),
			workingWeekdays: V(l),
			exceptionsText: V(u)
		});
	}
	L(() => (V(o), V(s), V(c)), () => {
		N(n, 24 - Number(V(o)) - Number(V(s)) - Number(V(c)));
	}), L(() => V(n), () => {
		N(r, V(n) > 0 ? `每日工作容量：${Math.round(V(n) * 10) / 10} hr` : "每日工作容量必須大於 0 hr");
	}), An(), Oi();
	var p = uo(), m = I(P(p), 2), h = P(m), g = I(P(h), 2), _ = P(g);
	Z(_), Re(2), O(g), O(h);
	var v = I(h, 2), y = I(P(v), 2), b = P(y);
	Z(b), Re(2), O(y), O(v);
	var x = I(v, 2), S = I(P(x), 2), C = P(S);
	Z(C), Re(2), O(S), O(x), O(m);
	var ee = I(m, 2), te = P(ee, !0);
	O(ee);
	var w = I(ee, 2);
	Y(I(P(w), 2), 1, () => co, (e) => e.value, (e, t) => {
		var n = lo(), r = P(n);
		Z(r);
		var i = I(r);
		O(n), R((e) => {
			vi(r, e), q(i, ` 週${V(t), H(() => V(t).label) ?? ""}`);
		}, [() => (V(l), V(t), H(() => V(l).includes(V(t).value)))]), W("change", r, (e) => d(V(t).value, e.currentTarget.checked)), K(e, n);
	}), O(w);
	var T = I(w, 2), ne = I(P(T), 2);
	ct(ne), Re(2), O(T);
	var re = I(T, 2), ie = P(re, !0);
	O(re), Re(2), O(p), R(() => {
		q(te, V(r)), Q(re, "hidden", (U(i()), H(() => !i().error))), q(ie, (U(i()), H(() => i().error)));
	}), wr("submit", p, f), Si(_, () => V(o), (e) => N(o, e)), Si(b, () => V(s), (e) => N(s, e)), Si(C, () => V(c), (e) => N(c, e)), Si(ne, () => V(u), (e) => N(u, e)), K(e, p), Je();
}
Tr(["change"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var po = (e, t = g, n = g) => {
	var r = bo(), i = P(r), a = P(i, !0);
	O(i);
	var o = I(i, 2), s = P(o, !0);
	O(o);
	var c = I(o, 2), l = P(c, !0);
	O(c), O(r), R((e) => {
		X(r, 1, e), q(a, (t(), H(() => t().label))), q(s, (t(), H(() => t().value))), q(l, (t(), H(() => t().note)));
	}, [() => oi((n(), H(() => `time-evaluation-node ${n()}`.trim())))]), K(e, r);
}, mo = (e, t = g) => {
	var n = So();
	Y(n, 5, t, qr, (e, t) => {
		var n = xo(), r = P(n), i = P(r, !0);
		O(r);
		var a = I(r), o = P(a, !0);
		O(a), O(n), R(() => {
			q(i, (V(t), H(() => V(t).label))), q(o, (V(t), H(() => V(t).value)));
		}), K(e, n);
	}), O(n), K(e, n);
}, ho = (e, t = g) => {
	var n = wo();
	Y(n, 5, t, qr, (e, t) => {
		var n = Co(), r = P(n), i = P(r), a = P(i, !0);
		O(i);
		var o = I(i), s = P(o, !0);
		O(o), O(r);
		var c = I(r, 2), l = P(c, !0);
		O(c), O(n), R(() => {
			q(a, (V(t), H(() => V(t).label))), q(s, (V(t), H(() => V(t).note))), q(l, (V(t), H(() => V(t).value)));
		}), K(e, n);
	}), O(n), K(e, n);
}, go = (e, t = g) => {
	var n = To();
	ho(I(P(n), 2), t), O(n), K(e, n);
}, _o = (e, t = g, n = g) => {
	var r = Eo(), i = P(r), a = P(i, !0);
	O(i);
	var o = I(i, 2), s = P(o), c = P(s);
	po(c, () => (t(), H(() => t().engineeringLane.source)), () => ""), po(I(c, 4), () => (t(), H(() => t().engineeringLane.result)), () => "time-evaluation-result"), O(s);
	var l = I(s, 2), u = P(l);
	po(u, () => (t(), H(() => t().capacityLane.source)), () => ""), po(I(u, 4), () => (t(), H(() => t().capacityLane.result)), () => "time-evaluation-result"), O(l), O(o);
	var d = I(o, 2);
	po(I(P(d), 2), () => (t(), H(() => t().merge)), () => (t(), H(() => t().merge.className))), O(d);
	var f = I(d, 2), p = P(f);
	po(p, () => (t(), H(() => t().risk.trend)), () => ""), po(I(p, 4), () => (t(), H(() => t().risk.result)), () => (t(), H(() => t().risk.result.className))), O(f);
	var m = I(f, 2), h = P(m, !0);
	O(m), O(r), R(() => {
		Q(r, "hidden", !n()), q(a, (t(), H(() => t().intro))), q(h, (t(), H(() => t().note)));
	}), K(e, r);
}, vo = (e, t = g, n = g) => {
	var r = Do(), i = P(r);
	mo(i, () => (t(), H(() => t().metrics)));
	var a = I(i, 2), o = P(a), s = P(o);
	Re(), O(o);
	var c = I(o, 2), l = P(c, !0);
	O(c);
	var u = I(c, 2), d = P(u, !0);
	O(u), O(a);
	var f = I(a, 2), p = I(P(f), 2), m = P(p, !0);
	O(p), O(f), go(I(f, 2), () => (t(), H(() => t().composition))), O(r), R(() => {
		Q(r, "hidden", !n()), X(s, 1, `time-risk-dot ${t(), H(() => t().explanation.className) ?? ""}`), q(l, (t(), H(() => t().explanation.text))), q(d, (t(), H(() => t().explanation.formula))), q(m, (t(), H(() => t().calibrationText)));
	}), K(e, r);
}, yo = (e, t = g) => {
	var n = Ao(), r = P(n), i = P(r, !0);
	O(r);
	var a = I(r, 2);
	mo(a, () => (t(), H(() => t().metrics)));
	var o = I(a, 2), s = I(P(o), 2), c = P(s, !0);
	O(s), O(o), go(I(o, 2), () => (t(), H(() => t().composition))), O(n), R(() => {
		q(i, (t(), H(() => t().intro))), q(c, (t(), H(() => t().calibrationText)));
	}), K(e, n);
}, bo = /* @__PURE__ */ G("<div><span> </span> <strong> </strong> <small> </small></div>"), xo = /* @__PURE__ */ G("<div class=\"time-metric\"><span> </span><strong> </strong></div>"), So = /* @__PURE__ */ G("<div class=\"time-metric-grid\"></div>"), Co = /* @__PURE__ */ G("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), wo = /* @__PURE__ */ G("<div class=\"time-source-list\"></div>"), To = /* @__PURE__ */ G("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), Eo = /* @__PURE__ */ G("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), Do = /* @__PURE__ */ G("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <section class=\"time-explanation-card\"><h3 class=\"time-formula-heading\"><span aria-hidden=\"true\"></span> 風險評估公式</h3> <p> </p> <code class=\"time-formula\"> </code></section> <section class=\"time-explanation-card\"><h3>執行校準</h3> <p> </p></section> <!></section>"), Oo = /* @__PURE__ */ G("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), ko = /* @__PURE__ */ G("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><!> <div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <section class=\"time-explanation-card\"><h3>每日容量公式</h3> <p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code></section> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), Ao = /* @__PURE__ */ G("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <section class=\"time-explanation-card\"><h3>執行校準</h3> <p> </p></section> <!></section>"), jo = /* @__PURE__ */ G("<span> </span>"), Mo = /* @__PURE__ */ G("<section class=\"time-estimate-readout\"><div class=\"time-estimate-meta\"><span>預估工時</span> <!></div> <strong> </strong></section> <section class=\"time-explanation-card time-item-rationale\"><h3>估算依據</h3> <p> </p></section>", 1), No = /* @__PURE__ */ G("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Po = /* @__PURE__ */ G("<section class=\"time-explanation-card\"><h3>固定公式</h3> <code class=\"time-formula\"> </code></section>"), Fo = /* @__PURE__ */ G("<code class=\"time-reference\"> </code>"), Io = /* @__PURE__ */ G("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), Lo = /* @__PURE__ */ G("<span aria-hidden=\"true\"></span>"), Ro = /* @__PURE__ */ G("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), zo = /* @__PURE__ */ G("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Bo = /* @__PURE__ */ G("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), Vo = /* @__PURE__ */ G("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), Ho = /* @__PURE__ */ G("<dialog class=\"theme-dialog time-dialog\" id=\"time-dialog\" aria-labelledby=\"time-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2 id=\"time-dialog-title\"> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <div class=\"time-dialog-content\"><!></div></dialog>");
function Uo(e, t) {
	qe(t, !1);
	let n = (e, t = g, n = g) => {
		var r = ko(), i = P(r), a = (e) => {
			var n = Mr();
			Kr(F(n), () => (t(), H(() => t().editor.revision)), (e) => {
				fo(e, {
					get editor() {
						return t(), H(() => t().editor);
					},
					get onSubmit() {
						return f();
					}
				});
			}), K(e, n);
		};
		J(i, (e) => {
			t(), H(() => t().editorOpen) && e(a);
		});
		var o = I(i, 4);
		mo(o, () => (t(), H(() => t().metrics)));
		var s = I(o, 2), c = I(P(s), 4), l = P(c, !0);
		O(c), O(s);
		var u = I(s, 2), d = P(u), p = P(d, !0);
		O(d);
		var m = I(d, 2), h = P(m), _ = (e) => {
			var n = Mr();
			Y(F(n), 1, () => (t(), H(() => t().exceptions)), qr, (e, t) => {
				var n = Co(), r = P(n), i = P(r), a = P(i, !0);
				O(i);
				var o = I(i), s = P(o, !0);
				O(o), O(r);
				var c = I(r, 2), l = P(c, !0);
				O(c), O(n), R(() => {
					q(a, (V(t), H(() => V(t).label))), q(s, (V(t), H(() => V(t).note))), q(l, (V(t), H(() => V(t).value)));
				}), K(e, n);
			}), K(e, n);
		}, v = (e) => {
			K(e, Oo());
		};
		J(h, (e) => {
			t(), H(() => t().exceptions) ? e(_) : e(v, -1);
		}), O(m), O(u), O(r), R(() => {
			Q(r, "hidden", !n()), q(l, (t(), H(() => t().formulaCode))), q(p, (t(), H(() => t().exceptionsHeading)));
		}), K(e, r);
	}, r = $(t, "open", 8, !1), i = $(t, "kind", 8, null), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "project", 8, null), c = $(t, "item", 8, null), l = $(t, "onClose", 8, () => {}), u = $(t, "onToggleDetails", 8, () => {}), d = $(t, "onSetTab", 8, (e) => {}), f = $(t, "onSubmitCapacity", 8, (e) => {}), p = $(t, "editing", 8, !1), m = $(t, "activeEstimate", 8, null), h = $(t, "onManualEstimate", 8, null), _ = /* @__PURE__ */ M(), v = /* @__PURE__ */ M([]), y = null, b = !1;
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
		V(_)?.close(), S();
	}
	function ee(e) {
		e.target === e.currentTarget && C();
	}
	async function te(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		d()(n[r].name), await gr(), V(v)[r]?.focus();
	}
	Oi();
	var w = Mr(), T = F(w), ne = (e) => {
		var t = Ho(), r = P(t), l = P(r), f = P(l), g = P(f, !0);
		O(f);
		var y = I(f, 2), b = P(y, !0);
		O(y), O(l);
		var w = I(l, 2);
		O(r);
		var T = I(r, 2), ne = P(T), re = (e) => {
			var t = Io(), n = P(t), r = P(n), i = P(r, !0);
			O(r);
			var a = I(r, 2), s = P(a, !0);
			O(a), O(n);
			var l = I(n, 2), d = (e) => {
				var t = Mr();
				Kr(F(t), () => (U(c()), U(m()), H(() => `${c().itemId}:${m()?.estimate_id ?? "analysis"}`)), (e) => {
					{
						let t = /* @__PURE__ */ wt(() => (U(c()), U(o()), H(() => ({
							...c(),
							title: o()
						}))));
						oo(e, {
							get item() {
								return V(t);
							},
							get activeEstimate() {
								return m();
							},
							get onApply() {
								return h();
							}
						});
					}
				}), K(e, t);
			}, f = (e) => {
				var t = Mo(), n = F(t), r = P(n);
				Y(I(P(r), 2), 1, () => (U(c()), H(() => c().sourceBadges)), (e) => e.kind, (e, t) => {
					var n = jo(), r = P(n, !0);
					O(n), R(() => {
						X(n, 1, `time-source-badge source-${V(t), H(() => V(t).kind) ?? ""}`), q(r, (V(t), H(() => V(t).label)));
					}), K(e, n);
				}), O(r);
				var i = I(r, 2), a = P(i, !0);
				O(i), O(n);
				var o = I(n, 2), s = I(P(o), 2), l = P(s, !0);
				O(s), O(o), R(() => {
					q(a, (U(c()), H(() => c().likelyHoursLabel))), q(l, (U(c()), H(() => c().rationale)));
				}), K(e, t);
			};
			J(l, (e) => {
				p() && h() ? e(d) : e(f, -1);
			});
			var g = I(l, 2), _ = P(g);
			mo(_, () => (U(c()), H(() => c().technical.metrics)));
			var v = I(_, 2), y = (e) => {
				var t = No(), n = P(t), r = P(n), i = P(r, !0);
				O(r);
				var a = I(r, 2), o = P(a, !0);
				O(a), O(n);
				var s = I(n, 2), l = P(s, !0);
				O(s), O(t), R(() => {
					q(i, (U(c()), H(() => c().technical.analysisMethod.name))), q(o, (U(c()), H(() => c().technical.analysisMethod.note))), q(l, (U(c()), H(() => c().technical.analysisMethod.version)));
				}), K(e, t);
			};
			J(v, (e) => {
				U(c()), H(() => c().technical.analysisMethod) && e(y);
			});
			var b = I(v, 2), x = (e) => {
				var t = Po(), n = I(P(t), 2), r = P(n, !0);
				O(n), O(t), R(() => q(r, (U(c()), H(() => c().technical.formula)))), K(e, t);
			};
			J(b, (e) => {
				U(c()), H(() => c().technical.formula) && e(x);
			});
			var S = I(b, 2), C = (e) => {
				var t = Fo(), n = P(t, !0);
				O(t), R(() => q(n, (U(c()), H(() => c().technical.reference)))), K(e, t);
			};
			J(S, (e) => {
				U(c()), H(() => c().technical.reference) && e(C);
			}), O(g), O(t), R(() => {
				X(r, 1, oi((U(c()), H(() => c().confidenceClass)))), q(i, (U(c()), H(() => c().confidenceLabel))), q(s, (U(c()), H(() => c().toggleLabel))), Q(g, "hidden", (U(c()), H(() => !c().detailsExpanded)));
			}), W("click", a, function(...e) {
				u()?.apply(this, e);
			}), K(e, t);
		}, ie = (e) => {
			var t = Vo(), r = P(t), i = P(r), a = P(i, !0);
			O(i);
			var o = I(i, 2), c = P(o, !0);
			O(o), O(r);
			var l = I(r, 2), f = P(l);
			Y(f, 5, () => (U(s()), H(() => s().overview)), qr, (e, t) => {
				var n = Ro(), r = P(n), i = P(r, !0);
				O(r);
				var a = I(r, 2), o = P(a), s = (e) => {
					var n = Lo();
					R(() => X(n, 1, `time-risk-dot ${V(t), H(() => V(t).urgencyClassName) ?? ""}`)), K(e, n);
				};
				J(o, (e) => {
					V(t), H(() => V(t).urgencyClassName) && e(s);
				});
				var c = I(o);
				O(a), O(n), R(() => {
					q(i, (V(t), H(() => V(t).label))), q(c, ` ${V(t), H(() => V(t).value) ?? ""}`);
				}), K(e, n);
			}), O(f);
			var p = I(f, 2), m = P(p, !0);
			O(p), O(l);
			var h = I(l, 2), g = P(h), _ = (e) => {
				var t = Bo(), r = F(t);
				Y(r, 7, () => (U(s()), H(() => s().tabs)), (e) => e.name, (e, t, n) => {
					var r = zo(), i = P(r, !0);
					O(r), Di(r, (e, t) => $t(v, V(v)[t] = e), (e) => V(v)?.[e], () => [V(n)]), R(() => {
						Q(r, "id", (V(t), H(() => `time-${V(t).name}-tab`))), Q(r, "aria-controls", (V(t), H(() => `time-${V(t).name}-panel`))), Q(r, "aria-selected", (U(s()), V(t), H(() => s().activeTab === V(t).name))), Q(r, "tabindex", (U(s()), V(t), H(() => s().activeTab === V(t).name ? 0 : -1))), q(i, (V(t), H(() => V(t).label)));
					}), W("click", r, () => d()(V(t).name)), W("keydown", r, (e) => te(e, V(n), s().tabs)), K(e, r);
				}), O(r);
				var i = I(r, 2);
				_o(i, () => (U(s()), H(() => s().flow)), () => (U(s()), H(() => s().activeTab === "flow")));
				var a = I(i, 2);
				vo(a, () => (U(s()), H(() => s().engineering)), () => (U(s()), H(() => s().activeTab === "engineering")));
				var o = I(a, 2);
				n(o, () => (U(s()), H(() => s().capacity)), () => (U(s()), H(() => s().activeTab === "capacity"))), K(e, t);
			}, y = (e) => {
				yo(e, () => (U(s()), H(() => s().estimateOnly)));
			};
			J(g, (e) => {
				U(s()), H(() => s().hasDeadline) ? e(_) : e(y, -1);
			}), O(h), O(t), R(() => {
				q(a, (U(s()), H(() => s().captionLabel))), Q(o, "aria-expanded", (U(s()), H(() => s().detailsExpanded))), q(c, (U(s()), H(() => s().toggleLabel))), q(m, (U(s()), H(() => s().updatedLabel))), Q(h, "hidden", (U(s()), H(() => !s().detailsExpanded)));
			}), W("click", o, function(...e) {
				u()?.apply(this, e);
			}), K(e, t);
		};
		J(ne, (e) => {
			i() === "item" && c() ? e(re) : i() === "project" && s() && e(ie, 1);
		}), O(T), O(t), Di(t, (e) => N(_, e), () => V(_)), ri(t, (e) => x?.(e)), R(() => {
			q(g, a()), q(b, o()), Q(w, "aria-label", `關閉${a()}`);
		}), wr("close", t, S), W("click", t, ee), W("click", w, C), K(e, t);
	};
	J(T, (e) => {
		r() && e(ne);
	}), K(e, w), Je();
}
Tr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var Wo = /* @__PURE__ */ G("<label><input type=\"checkbox\"/> <span> </span></label>"), Go = /* @__PURE__ */ G("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), Ko = /* @__PURE__ */ G("<div class=\"spike-exception-list\"></div>"), qo = /* @__PURE__ */ G("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), Jo = /* @__PURE__ */ G("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Yo = /* @__PURE__ */ G("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function Xo(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ M(), r = $(t, "config", 8), i = $(t, "onApply", 8), a = $(t, "onPreview", 8), o = $(t, "onPendingChange", 8, () => {}), s = [
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
	], c = r().standard_allocation, l = r()?.project?.delivery_at ?? "", u = /* @__PURE__ */ M(l.slice(0, 16)), d = /* @__PURE__ */ M(""), f = /* @__PURE__ */ M(String(c.sleep_minutes_per_day / 60)), p = /* @__PURE__ */ M(String(c.life_minutes_per_day / 60)), m = /* @__PURE__ */ M(String(c.other_unavailable_minutes_per_day / 60)), h = /* @__PURE__ */ M([...c.working_weekdays]), g = 1, _ = /* @__PURE__ */ M((r().project?.capacity_exceptions ?? []).map((e) => ({
		key: g++,
		date: e.date,
		availableHours: String(e.available_minutes / 60),
		reason: e.reason ?? "",
		publicLabel: e.public_label ?? ""
	}))), v = /* @__PURE__ */ M("");
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
		N(v, ""), o()(!0);
	}
	function S(e, t) {
		N(h, t ? [.../* @__PURE__ */ new Set([...V(h), e])].sort((e, t) => e - t) : V(h).filter((t) => t !== e)), x();
	}
	function C(e, t, n) {
		N(_, V(_).map((r) => r.key === e ? {
			...r,
			[t]: n
		} : r)), x();
	}
	function ee() {
		N(_, [...V(_), {
			key: g++,
			date: "",
			availableHours: "0",
			reason: "",
			publicLabel: ""
		}]), x();
	}
	function te(e) {
		N(_, V(_).filter((t) => t.key !== e)), x();
	}
	function w() {
		if (!V(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${V(u)}:00${e ?? b(V(u), r().timezone)}`;
	}
	function T() {
		let e = i()({
			deliveryAt: w(),
			deliveryReason: V(d),
			capacity: {
				sleepMinutes: Math.round(Number(V(f)) * 60),
				lifeMinutes: Math.round(Number(V(p)) * 60),
				otherUnavailableMinutes: Math.round(Number(V(m)) * 60),
				workingWeekdays: V(h),
				capacityExceptions: V(_).map((e) => ({
					date: e.date,
					availableMinutes: Math.round(Number(e.availableHours) * 60),
					reason: e.reason,
					publicLabel: e.publicLabel
				}))
			}
		});
		return N(v, e.error), e;
	}
	async function ne() {
		T().error || (o()(!1), await a()());
	}
	L(() => (V(f), V(p), V(m)), () => {
		N(n, 24 - Number(V(f)) - Number(V(p)) - Number(V(m)));
	}), An(), Oi();
	var re = Yo(), ie = P(re), ae = I(P(ie), 6), oe = P(ae);
	O(ae), O(ie);
	var se = I(ie, 2), ce = P(se), le = I(P(ce), 2), ue = P(le), de = I(P(ue));
	Z(de), O(ue);
	var fe = I(ue, 2), pe = I(P(fe));
	Z(pe), O(fe);
	var me = I(fe, 2);
	O(le), O(ce);
	var he = I(ce, 2), ge = P(he), _e = I(P(ge), 2);
	let ve;
	var ye = P(_e);
	O(_e), O(ge);
	var be = I(ge, 2), xe = P(be), Se = I(P(xe));
	Z(Se), O(xe);
	var Ce = I(xe, 2), we = I(P(Ce));
	Z(we), O(Ce);
	var Te = I(Ce, 2), Ee = I(P(Te));
	Z(Ee), O(Te), O(be);
	var De = I(be, 2);
	Y(I(P(De), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = Wo(), r = P(n);
		Z(r);
		var i = I(r, 2), a = P(i);
		O(i), O(n), R((e) => {
			vi(r, e), q(a, `週${V(t), H(() => V(t).label) ?? ""}`);
		}, [() => (V(h), V(t), H(() => V(h).includes(V(t).value)))]), W("change", r, (e) => S(V(t).value, e.currentTarget.checked)), K(e, n);
	}), O(De), O(he);
	var Oe = I(he, 2), ke = P(Oe), Ae = I(P(ke), 2);
	O(ke);
	var je = I(ke, 2), Me = (e) => {
		var t = Ko();
		Y(t, 5, () => V(_), (e) => e.key, (e, t) => {
			var n = Go(), r = P(n), i = I(P(r));
			Z(i), O(r);
			var a = I(r, 2), o = I(P(a));
			Z(o), O(a);
			var s = I(a, 2), c = I(P(s));
			Z(c), O(s);
			var l = I(s, 2);
			O(n), R(() => {
				_i(i, (V(t), H(() => V(t).date))), _i(o, (V(t), H(() => V(t).availableHours))), _i(c, (V(t), H(() => V(t).publicLabel)));
			}), W("input", i, (e) => C(V(t).key, "date", e.currentTarget.value)), W("input", o, (e) => C(V(t).key, "availableHours", e.currentTarget.value)), W("input", c, (e) => C(V(t).key, "publicLabel", e.currentTarget.value)), W("click", l, () => te(V(t).key)), K(e, n);
		}), O(t), K(e, t);
	}, Ne = (e) => {
		K(e, qo());
	};
	J(je, (e) => {
		V(_), H(() => V(_).length) ? e(Me) : e(Ne, -1);
	}), O(Oe);
	var Pe = I(Oe, 2), E = P(Pe), Fe = I(E, 2), D = (e) => {
		var t = Jo(), n = P(t, !0);
		O(t), R(() => q(n, V(v))), K(e, t);
	};
	J(Fe, (e) => {
		V(v) && e(D);
	}), O(Pe), O(se), O(re), R((e) => {
		q(oe, `時區：${U(r()), H(() => r().timezone) ?? ""}`), ve = X(_e, 1, "", null, ve, { invalid: !(V(n) > 0) }), q(ye, `工作 ${e ?? ""} hr`);
	}, [() => (V(n), H(() => Number.isFinite(V(n)) ? V(n) : "—"))]), W("input", de, x), Si(de, () => V(u), (e) => N(u, e)), W("input", pe, x), Si(pe, () => V(d), (e) => N(d, e)), W("click", me, () => {
		N(u, ""), x();
	}), W("input", Se, x), Si(Se, () => V(f), (e) => N(f, e)), W("input", we, x), Si(we, () => V(p), (e) => N(p, e)), W("input", Ee, x), Si(Ee, () => V(m), (e) => N(m, e)), W("click", Ae, ee), W("click", E, ne), K(e, re), Je();
}
Tr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Zo = /* @__PURE__ */ G("<span class=\"time-risk-dot\"></span>"), Qo = /* @__PURE__ */ G("<span class=\"time-chevron\">›</span>"), $o = /* @__PURE__ */ G("<button type=\"button\"><span> </span> <!> <!></button>");
function es(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = $o(), d = P(u), f = P(d, !0);
	O(d);
	var p = I(d, 2), m = (e) => {
		K(e, Zo());
	};
	J(p, (e) => {
		s() && e(m);
	});
	var h = I(p, 2), g = (e) => {
		K(e, Qo());
	};
	J(h, (e) => {
		c() && e(g);
	}), O(u), R(() => {
		X(u, 1, oi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), q(f, o());
	}), W("click", u, function(...e) {
		l()?.apply(this, e);
	}), K(e, u);
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var ts = {
	"task-list": Wa,
	"status-overview": aa,
	"status-filters": ra,
	"project-progress": Xi,
	"mode-toggle": Ji,
	"save-bar": ta,
	"add-control": Li,
	diagnostics: Ki,
	"scope-directory": $i,
	"theme-control": no,
	"time-summary-button": es,
	"time-dialog": Uo,
	"time-settings": Xo,
	"delivery-risk-preview": Hi,
	"delivery-save-confirmation": Wi
}, ns = {
	id: "svelte",
	regions: Object.keys(ts),
	mount(e, t, n) {
		let r = an({ ...n });
		return {
			component: Lr(ts[e], {
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
		Vr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(ns);
//#endregion
