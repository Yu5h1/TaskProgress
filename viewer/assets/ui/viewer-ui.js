import { registerUiAdapter as e } from "../ui-host.js";
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
var b = 1024, x = 2048, S = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, se = 1 << 25, ce = 65536, le = 1 << 21, ue = 1 << 22, de = 1 << 23, fe = Symbol("$state"), pe = Symbol("legacy props"), me = Symbol(""), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), ye = Symbol("form reset"), be = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), xe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Se() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ce(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function we(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Te() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ee(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function De() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Oe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ke() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function je() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Me() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ne() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Pe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Fe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ie() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function Le(e) {
	C = e;
}
var w;
function T(e) {
	if (e === null) throw Pe(), t;
	return w = e;
}
function Re() {
	return T(/* @__PURE__ */ mn(w));
}
function E(e) {
	if (C) {
		if (/* @__PURE__ */ mn(w) !== null) throw Pe(), t;
		w = e;
	}
}
function ze(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ mn(n);
		w = n;
	}
}
function Be(e = !0) {
	for (var t = 0, n = w;;) {
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
function Ve(e) {
	if (!e || e.nodeType !== 8) throw Pe(), t;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function He(e) {
	return e === this.v;
}
function Ue(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function We(e) {
	return !Ue(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Ge = !1;
function Ke() {
	Ge = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var D = null;
function qe(e) {
	D = e;
}
function Je(e, t = !1, n) {
	D = {
		p: D,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: B,
		l: Ge && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ye(e) {
	var t = D, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, D = t.p, e ?? {};
}
function Xe() {
	return !Ge || D !== null && D.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ze = [];
function Qe() {
	var e = Ze;
	Ze = [], v(e);
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
	var t = B;
	if (t === null) return R.f |= de, e;
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
var rt = ~(x | S | b);
function O(e, t) {
	e.f = e.f & rt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? O(e, b) : O(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ce, at(t.deps));
}
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), at(e.deps), O(e, b);
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
	C && /* @__PURE__ */ pn(e) !== null && gn(e);
}
var ut = !1;
function dt() {
	ut || (ut = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ye]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ft(e) {
	var t = R, n = B;
	z(null), Xn(null);
	try {
		return e();
	} finally {
		z(t), Xn(n);
	}
}
function pt(e, t, n, r = n) {
	e.addEventListener(t, () => ft(n));
	let i = e[ye];
	e[ye] = i ? () => {
		i(), r(!0);
	} : () => r(!0), dt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function mt(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		Cn() && (U(n), Mn(() => (t === 0 && (r = W(() => e(() => nn(n)))), t += 1, () => {
			$e(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ht = ie | ae;
function gt(e, t, n, r) {
	new _t(e, t, n, r);
}
var _t = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = C ? w : null;
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
	#h = mt(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = B;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = B.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Nn(() => {
			if (C) {
				let e = this.#t;
				Re();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ht), C && (this.#e = w);
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
		$e(r), t && (this.#s = Pn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ie();
				return;
			}
			t = !0, n && Me(), this.#s !== null && Bn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Pn(() => e(this.#e)), $e(() => {
			var e = this.#c = document.createDocumentFragment(), t = M();
			e.append(t), this.#a = this.#S(() => Pn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(k));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Pn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Wn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Pn(() => t(this.#e));
			} else this.#x(k);
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
		var t = B, n = R, r = D;
		Xn(this.#i), z(this.#i), qe(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} catch (e) {
			return tt(e), null;
		} finally {
			Xn(t), z(n), qe(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $e(() => {
			this.#d = !1, this.#m && en(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		k?.is_fork ? (this.#a && k.skip_effect(this.#a), this.#o && k.skip_effect(this.#o), this.#s && k.skip_effect(this.#s), k.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (L(this.#a), null), this.#o &&= (L(this.#o), null), this.#s &&= (L(this.#s), null), C && (T(this.#t), ze(), T(Be()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Pn(() => {
						var r = B;
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
function vt(e, t, n, r) {
	let i = Xe() ? St : Tt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = B, c = yt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				nt(e, s);
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
		Promise.all(n.map((e) => /* @__PURE__ */ wt(e))).then(u).catch((e) => nt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), bt();
	}) : f();
}
function yt() {
	var e = B, t = R, n = D, r = k;
	return function(i = !0) {
		Xn(e), z(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function bt(e = !0) {
	Xn(null), z(null), qe(null), e && k?.deactivate();
}
function xt() {
	var e = B, t = e.b, n = k, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	var t = 2 | x;
	return B !== null && (B.f |= ae), {
		ctx: D,
		deps: null,
		effects: null,
		equals: He,
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
var Ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function wt(e, t, r) {
	let i = B;
	i === null && Se();
	var a = void 0, o = Qt(n), s = !R, c = /* @__PURE__ */ new Set();
	return jn(() => {
		var t = B, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== be && n.reject(e);
			}).finally(bt);
		} catch (e) {
			n.reject(e), bt();
		}
		var r = k;
		if (s) {
			if (t.f & 32768) var l = xt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Ct);
			else for (let e of c.values()) e.reject(Ct);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ct && (r.activate(), t ? (o.f |= de, en(o, t)) : (o.f & 8388608 && (o.f ^= de), en(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), wn(() => {
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
function Tt(e) {
	let t = /* @__PURE__ */ St(e);
	return t.equals = We, t;
}
function Et(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) L(t[n]);
	}
}
function Dt(e) {
	var t, r = B, i = e.parent;
	if (!qn && i !== null && e.v !== n && i.f & 24576) return Ne(), e.v;
	Xn(i);
	try {
		e.f &= ~ce, Et(e), t = cr(e);
	} finally {
		Xn(r);
	}
	return t;
}
function Ot(e) {
	var t = Dt(e);
	if (!e.equals(t) && (e.wv = ar(), (!k?.is_fork || e.deps === null) && (k === null ? e.v = t : (k.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null))) {
		O(e, b);
		return;
	}
	qn || (Nt === null ? it(e) : (Cn() || k?.is_fork) && Nt.set(e, t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ft(() => {
		t.ac.abort(be), t.ac = null;
	}), t.fn !== null && (t.teardown = g), ur(t, 0), In(t));
}
function At(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var jt = null, k = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
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
			for (var r of n.d) O(r, x), t(r);
			for (r of n.m) O(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, zt++ > 1e3 && (this.#x(), Ut());
		for (let e of this.#u) this.#d.delete(e), O(e, x), this.schedule(e);
		for (let e of this.#d) O(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Lt = [], r = [], i = Rt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Jt(e), this.#h() || this.discard(), t;
		}
		if (k = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) qt(e, t);
			i.length > 0 && k.#g();
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
		var s = k;
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), O(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), k = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Nt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		k = this;
	}
	deactivate() {
		k = null, Nt = null;
	}
	flush() {
		try {
			It = !0, k = this, this.#g();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, k = null, Nt = null, Xt.clear();
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
		return (this.#s ??= y()).promise;
	}
	static ensure() {
		if (k === null) {
			let t = k = new e();
			!It && !Ft && $e(() => {
				t.#e || t.flush();
			});
		}
		return k;
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
			if (Lt !== null && t === B && (R === null || !(R.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? jt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft;
	Ft = !0;
	try {
		var n;
		for (e && (k !== null && !k.is_fork && k.flush(), n = e());;) {
			if (et(), k === null) return n;
			k.flush();
		}
	} finally {
		Ft = t;
	}
}
function Ut() {
	try {
		De();
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
			if (!(r.f & 24576) && or(r) && (Wt = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), Wt?.size > 0)) {
				Xt.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	k.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), O(e, b);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	O(e, b);
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
		equals: He,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t) {
	let n = Qt(e, t);
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = We), Ge && n && D !== null && D.l !== null && (D.l.s ??= []).push(r), r;
}
function j(e, t, n = !1) {
	return R !== null && (!Yn || R.f & 131072) && Xe() && R.f & 4325394 && (Zn === null || !Zn.has(e)) && je(), en(e, n ? an(t) : t, Rt);
}
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Xt.set(e, qn ? t : e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Dt(t), Nt === null && it(t);
		}
		e.wv = ar(), rn(e, x, n), Xe() && B !== null && B.f & 1024 && !(B.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && Yt.size > 0 && !Zt && tn();
	}
	return t;
}
function tn() {
	Zt = !1;
	for (let e of Yt) {
		e.f & 1024 && O(e, S);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && dr(e);
	}
	Yt.clear();
}
function nn(e) {
	j(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Xe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === B)) {
			var l = (c & x) === 0;
			if (l && O(s, t), c & 131072) Yt.add(s);
			else if (c & 2) {
				var u = s;
				Nt?.delete(u), c & 65536 || (c & 512 && (B === null || !(B.f & 2097152)) && (s.f |= ce), rn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
			}
		}
	}
}
function an(e) {
	if (typeof e != "object" || !e || fe in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ $t(0), s = null, c = rr, l = (e) => {
		if (rr === c) return e();
		var t = R, n = rr;
		z(null), ir(c);
		var r = e();
		return z(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ $t(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && ke();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ $t(n.value, s);
				return r.set(t, e), e;
			}) : j(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ $t(n, s));
					r.set(t, e), nn(o);
				}
			} else j(i, n), nn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === fe) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ $t(an(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			if (t === fe) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || B !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ $t(a ? an(e[t]) : n, s)), r.set(t, i)), U(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ $t(n, s)), r.set(p + "", m)) : j(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ $t(void 0, s)), j(d, an(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => an(a));
				j(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && j(_, v + 1);
				}
				nn(o);
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
			Ae();
		}
	});
}
function on(e) {
	try {
		if (typeof e == "object" && e && fe in e) return e[fe];
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
		un = u(t, "firstChild").get, dn = u(t, "nextSibling").get, h(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), h(n) && (n[ve] = void 0);
	}
}
function M(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return un.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function mn(e) {
	return dn.call(e);
}
function N(e, t) {
	if (!C) return /* @__PURE__ */ pn(e);
	var n = /* @__PURE__ */ pn(w);
	if (n === null) n = w.appendChild(M());
	else if (t && n.nodeType !== 3) {
		var r = M();
		return n?.before(r), T(r), r;
	}
	return t && yn(n), T(n), n;
}
function hn(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ pn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ mn(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = M();
			return w?.before(r), T(r), r;
		}
		yn(w);
	}
	return w;
}
function P(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ mn(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = M();
			return r === null ? i?.after(a) : r.before(a), T(a), a;
		}
		yn(r);
	}
	return T(r), r;
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
	B === null && (R === null && Ee(e), Te()), qn && we(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = B;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: D,
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
	k?.register_created_effect(r);
	var i = r;
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			dr(r);
		} catch (e) {
			throw L(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), R !== null && R.f & 2 && !(e & 64))) {
		var a = R;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return R !== null && !Yn;
}
function wn(e) {
	let t = Sn(8, null);
	return O(t, b), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = B.f;
	if (!R && t & 32 && D !== null && !D.i) {
		var n = D;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | oe, e);
}
function Dn(e) {
	return bn("$effect.pre"), Sn(8 | oe, e);
}
function On(e) {
	Vt.ensure();
	let t = Sn(64 | ae, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			L(t), n(void 0);
		}) : (L(t), n(void 0));
	});
}
function kn(e) {
	return Sn(4, e);
}
function F(e, t) {
	var n = D, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Mn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = B;
			try {
				Xn(n.parent), W(t);
			} finally {
				Xn(n);
			}
		}
	});
}
function An() {
	var e = D;
	Mn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && O(n, S), or(n) && dr(n), t.ran = !1;
		}
	});
}
function jn(e) {
	return Sn(ue | ae, e);
}
function Mn(e, t = 0) {
	return Sn(8 | t, e);
}
function I(e, t = [], n = [], r = []) {
	vt(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(U));
		});
	});
}
function Nn(e, t = 0) {
	return Sn(16 | t, e);
}
function Pn(e) {
	return Sn(32 | ae, e);
}
function Fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = qn, n = R;
		Jn(!0), z(null);
		try {
			t.call(null);
		} finally {
			Jn(e), z(n);
		}
	}
}
function In(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ft(() => {
			e.abort(be);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : L(n, t), n = r;
	}
}
function Ln(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || L(t), t = n;
	}
}
function L(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= re, In(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Fn(e), e.f ^= re, e.f |= te;
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
		n && L(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Vn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
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
		e.f ^= ee, e.f & 1024 || (O(e, x), Vt.ensure().schedule(e));
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
var R = null, Yn = !1;
function z(e) {
	R = e;
}
var B = null;
function Xn(e) {
	B = e;
}
var Zn = null;
function Qn(e) {
	R !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
}
var V = null, H = 0, $n = null;
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
	if (t & 2 && (e.f &= ~ce), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && Ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && O(e, b);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? O(a, x) : a.f & 1024 && O(a, S), Kt(a));
	}
}
function cr(e) {
	var t = V, n = H, r = $n, i = R, a = Zn, o = D, s = Yn, c = rr, l = e.f;
	V = null, H = 0, $n = null, R = l & 96 ? null : e, Zn = null, qe(e.ctx), Yn = !1, rr = ++nr, e.ac !== null && (ft(() => {
		e.ac.abort(be);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = e.deps, p = k?.is_fork;
		if (V !== null) {
			var m;
			if (p || ur(e, H), f !== null && H > 0) for (f.length = H + V.length, m = 0; m < V.length; m++) f[H + m] = V[m];
			else e.deps = f = V;
			if (Cn() && e.f & 512) for (m = H; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && H < f.length && (ur(e, H), f.length = H);
		if (Xe() && $n !== null && !Yn && f !== null && !(e.f & 6146)) for (m = 0; m < $n.length; m++) sr($n[m], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= de), d;
	} catch (e) {
		return tt(e);
	} finally {
		e.f ^= le, V = t, H = n, $n = r, R = i, Zn = a, qe(o), Yn = s, rr = c;
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
	if (r === null && t.f & 2 && (V === null || !s.call(V, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~ce), c.v !== n && it(c), c.ac !== null && ft(() => {
			c.ac.abort(be), c.ac = null, O(c, x);
		}), kt(c), ur(c, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		O(e, b);
		var n = B, r = Kn;
		B = e, Kn = !(t & 96);
		try {
			t & 16777232 ? Ln(e) : In(e), Fn(e);
			var i = cr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tr;
		} finally {
			Kn = r, B = n;
		}
	}
}
async function fr() {
	await Promise.resolve(), Ht();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), R !== null && !Yn && !(B !== null && B.f & 16384) && (Zn === null || !Zn.has(e))) {
		var n = R.deps;
		if (R.f & 2097152) e.rv < nr && (e.rv = nr, V === null && n !== null && n[H] === e ? H++ : V === null ? V = [e] : V.push(e));
		else {
			R.deps ??= [], s.call(R.deps, e) || R.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [R] : s.call(r, R) || r.push(R);
		}
	}
	if (qn && Xt.has(e)) return Xt.get(e);
	if (t) {
		var i = e;
		if (qn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || mr(i)) && (a = Dt(i)), Xt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Yn && R !== null && (Kn || !!(R.f & 512)), c = (i.f & ne) === 0;
		or(i) && (o && (i.f |= 512), Ot(i)), o && !c && (At(i), pr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (At(t), pr(t));
}
function mr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function W(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (fe in e) hr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && fe in n && hr(n);
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
function K(e, t, n) {
	(t[gr] ??= {})[e] = n;
}
function yr(e) {
	for (var t = 0; t < e.length; t++) _r.add(e[t]);
	for (var n of vr) n(e);
}
var br = null;
function xr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	br = e;
	var o = 0, s = br === e && e[gr];
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
		var d = R, f = B;
		z(null), Xn(null);
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
			e[gr] = t, delete e.currentTarget, z(d), Xn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Sr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Cr(e) {
	return Sr?.createHTML(e) ?? e;
}
function wr(e) {
	var t = vn("template");
	return t.innerHTML = Cr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Tr(e, t) {
	var n = B;
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
		if (C) return Tr(w, null), w;
		i === void 0 && (i = wr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ pn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ pn(t), s = t.lastChild;
			Tr(o, s);
		} else Tr(t, t);
		return t;
	};
}
function Er() {
	if (C) return Tr(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = M();
	return e.append(t, n), Tr(t, n), e;
}
function J(e, t) {
	if (C) {
		var n = B;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Re();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Dr = ["touchstart", "touchmove"];
function Or(e) {
	return Dr.includes(e);
}
var kr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Ar(e) {
	return kr.includes(e);
}
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function jr(e, t) {
	return Nr(e, t);
}
var Mr = /* @__PURE__ */ new Map();
function Nr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	fn();
	var u = void 0, d = On(() => {
		var s = r ?? n.appendChild(M());
		gt(s, { pending: () => {} }, (n) => {
			Je({});
			var r = D;
			if (o && (r.c = o), a && (i.$$events = a), C && Tr(n, null), u = e(n, i) || {}, C && (B.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw Pe(), t;
			Ye();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Or(r);
					for (let e of [n, document]) {
						var a = Mr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Mr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, xr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(_r)), vr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Mr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, xr), t.delete(e), t.size === 0 && Mr.delete(r)) : t.set(e, i);
			}
			vr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Pr.set(u, d), u;
}
var Pr = /* @__PURE__ */ new WeakMap();
function Fr(e, t) {
	let n = Pr.get(e);
	return n ? (Pr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Ir = class {
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
				r && (L(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Wn(r, t), t.append(M()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else L(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Bn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (L(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = k, r = _n();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = M();
			i.append(a), this.#n.set(e, {
				effect: Pn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Pn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else C && (this.anchor = w), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function X(e, t, n = !1) {
	var r;
	C && (r = w, Re());
	var i = new Ir(e), a = n ? ie : 0;
	function o(e, t) {
		if (C) {
			var n = Ve(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Be();
				T(a), i.anchor = a, Le(!1), i.ensure(e, t), Le(!0);
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
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Lr(e, t) {
	return t;
}
function Rr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Bn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					zr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		zr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function zr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= se, Wn(a, document.createDocumentFragment())) : L(t[i], n);
	}
}
var Br;
function Z(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = C ? T(/* @__PURE__ */ pn(u)) : u.appendChild(M());
	}
	C && Re();
	var d = null, f = /* @__PURE__ */ Tt(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Hr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= se, Wr(d, null, s)) : Hn(d) : Bn(d, () => {
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
			C && Ve(s) === "[!" != (e === 0) && (s = Be(), T(s), Le(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = k, v = _n(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (s = w, a = !0, Le(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && u.unskip_effect(S.e)) : (S = Ur(l, h ? s : Br ??= M(), b, x, y, i, t, n), h || (S.e.f |= se), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Pn(() => o(s)) : (d = Pn(() => o(Br ??= M())), d.f |= se)), e > c.size && Ce("", "", ""), C && e > 0 && T(Be()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Le(!0), U(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (s = w);
}
function Vr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Hr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = Vr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Hn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= se, _ === l) Wr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Gr(e, d, _), Gr(e, _, y), Wr(_, y, n), d = _, p = [], m = [], l = Vr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], ee = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Wr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Gr(e, S.prev, ee.next), Gr(e, d, S), Gr(e, ee, b), l = b, d = ee, --v, p = [], m = [];
				} else u.delete(_), Wr(_, l, n), Gr(e, _.prev, _.next), Gr(e, _, d === null ? e.effect.first : d.next), Gr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Vr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Vr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (zr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var te = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || te.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && te.push(l), l = Vr(l.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Rr(e, te, re);
		}
	}
	a && $e(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ur(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ A(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
	return {
		v: c,
		i: l,
		e: Pn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Wr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ mn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Gr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function Kr(e, t, n, r, a, o) {
	let s = C;
	C && Re();
	var c = null;
	C && w.nodeType === 1 && (c = w, Re());
	var l = C ? w : e, u = new Ir(l, !1);
	Nn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = C ? c : vn(e, o), Tr(c, c), r) {
					var n = null;
					C && Ar(e) && c.append(n = document.createComment(""));
					var i = C ? /* @__PURE__ */ pn(c) : c.appendChild(M());
					C && (i === null ? Le(!1) : T(i)), r(c, i), n?.remove();
				}
				B.nodes.end = c, t.before(c);
			}
			C && T(t);
		}), () => {};
	}, ie), wn(() => {}), s && (Le(!0), T(l));
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var qr = [..." 	\n\r\f\xA0\v﻿"];
function Jr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || qr.includes(r[o - 1])) && (s === r.length || qr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Yr(e, t, n, r, i, a) {
	var o = e[ge];
	if (C || o !== n || o === void 0) {
		var s = Jr(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ge] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Xr(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Fe();
		for (var r of e.options) r.selected = t.includes($r(r));
		return;
	}
	for (r of e.options) if (sn($r(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Zr(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Xr(e, e.__value);
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
function Qr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	pt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), $r);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && $r(o);
		}
		n(a), e.__value = a, k !== null && r.add(k);
	}), kn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = k;
			if (r.has(o)) return;
		}
		if (Xr(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = $r(s), n(a));
		}
		e.__value = a, i = !1;
	}), Zr(e);
}
function $r(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ei = Symbol("is custom element"), ti = Symbol("is html"), ni = xe ? "link" : "LINK", ri = xe ? "progress" : "PROGRESS";
function ii(e) {
	if (C) {
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
		e[ye] = n, $e(n), dt();
	}
}
function ai(e, t) {
	var n = oi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ri) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = oi(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ni) || i[t] !== (i[t] = n) && (t === "loading" && (e[me] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ci(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function oi(e) {
	return e[he] ??= {
		[ei]: e.nodeName.includes("-"),
		[ti]: e.namespaceURI === r
	};
}
var si = /* @__PURE__ */ new Map();
function ci(e) {
	var t = e.getAttribute("is") || e.nodeName, n = si.get(t);
	if (n) return n;
	si.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function li(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	pt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = di(e) ? fi(a) : a, n(a), k !== null && r.add(k), await fr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (C && e.defaultValue !== e.value || W(t) == null && e.value) && (n(di(e) ? fi(e.value) : e.value), k !== null && r.add(k)), Mn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = k;
			if (r.has(i)) return;
		}
		di(e) && n === fi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function ui(e, t, n = t) {
	pt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (C && e.defaultChecked !== e.checked || W(t) == null) && n(e.checked), Mn(() => {
		e.checked = !!t();
	});
}
function di(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function fi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function pi(e = !1) {
	let t = D, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ St(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Dn(() => {
		mi(t, r), v(n.b);
	}), Tn(() => {
		let e = W(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Tn(() => {
		mi(t, r), v(n.a);
	});
}
function mi(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Ge || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ St(r), U(l)) : (c && (c = !1, s = o ? W(r) : r), s);
	let f;
	if (a) {
		var p = fe in e || pe in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ct(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Oe(t), f(m)));
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
	var v = !1, y = (n & 1 ? St : Tt)(() => (v = !1, g()));
	a && U(y);
	var b = B;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? an(e) : e;
			return j(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return qn && v || b.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ke();
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var hi = /* @__PURE__ */ q("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <progress class=\"project-progress-meter\" id=\"project-progress-meter\" max=\"100\"></progress>", 1);
function gi(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ A(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "timeProgressPercent", 8, null);
	F(() => (G(o()), G(r()), G(i()), G(a())), () => {
		j(n, o() === null ? `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位` : `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；時間已使用 ${o()}%`);
	}), An();
	var s = hi(), c = hn(s), l = N(c), u = N(l);
	E(l), E(c);
	var d = P(c, 2);
	I(() => {
		Y(u, `整體約 ${r() ?? ""}%`), ai(d, r()), Q(d, "aria-label", U(n));
	}), J(e, s), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var _i = /* @__PURE__ */ q("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function vi(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ A(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = {
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
	F(() => (G(i()), G(r())), () => {
		j(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), An(), pi();
	var o = Er();
	Z(hn(o), 1, () => U(n), (e) => e.status, (e, t) => {
		var n = _i(), r = N(n), i = N(r, !0);
		E(r);
		var a = P(r, 2), o = N(a, !0);
		E(a), E(n), I(() => {
			Yr(n, 1, (U(t), W(() => `overview-card overview-${U(t).tone}`))), Q(n, "data-status", (U(t), W(() => U(t).status))), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), J(e, o), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var yi = /* @__PURE__ */ q("<span class=\"developer-expand-hint\">展開作法與方向</span>"), bi = /* @__PURE__ */ q("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), xi = /* @__PURE__ */ q("<li> </li>"), Si = /* @__PURE__ */ q("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), Ci = /* @__PURE__ */ q("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), wi = /* @__PURE__ */ q("<code class=\"reference\"> </code>"), Ti = /* @__PURE__ */ q("<article class=\"decision-item\"><p> </p> <!></article>"), Ei = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Di = /* @__PURE__ */ q("<p> </p>"), Oi = /* @__PURE__ */ q("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), ki = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Ai = /* @__PURE__ */ q("<div class=\"path-list\"></div>"), ji = /* @__PURE__ */ q("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Mi = /* @__PURE__ */ q("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), Ni = /* @__PURE__ */ q("<!> <!>", 1);
function Pi(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ A(), r = /* @__PURE__ */ A(), i = /* @__PURE__ */ A(), a = /* @__PURE__ */ A(), o = $(t, "developer", 8, null);
	F(() => G(o()), () => {
		j(n, o()?.next_steps ?? []);
	}), F(() => (G(o()), U(n)), () => {
		j(r, o()?.next_step ?? U(n)[0] ?? "尚未指定下一步");
	}), F(() => (G(o()), U(n)), () => {
		j(i, o()?.next_step ? U(n) : U(n).slice(1));
	}), F(() => (U(i), G(o())), () => {
		j(a, !!(U(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), An(), pi();
	var s = Er(), c = hn(s), l = (e) => {
		var t = Er();
		Kr(hn(t), () => U(a) ? "details" : "section", !1, (e, t) => {
			Yr(e, 0, "developer-details");
			var n = Ni(), s = hn(n);
			Kr(s, () => U(a) ? "summary" : "div", !1, (e, t) => {
				Yr(e, 0, "developer-summary");
				var n = bi(), i = P(hn(n), 2), o = N(i, !0);
				E(i);
				var s = P(i, 2), c = (e) => {
					J(e, yi());
				};
				X(s, (e) => {
					U(a) && e(c);
				}), I(() => Y(o, U(r))), J(t, n);
			});
			var c = P(s, 2), l = (e) => {
				var t = Mi(), n = P(N(t), 2), r = (e) => {
					var t = Si(), n = P(N(t), 2);
					Z(n, 5, () => U(i), Lr, (e, t) => {
						var n = xi(), r = N(n, !0);
						E(n), I(() => Y(r, U(t))), J(e, n);
					}), E(n), E(t), J(e, t);
				};
				X(n, (e) => {
					U(i), W(() => U(i).length) && e(r);
				});
				var a = P(n, 2), s = (e) => {
					var t = Ci(), n = P(N(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().blockers)), Lr, (e, t) => {
						var n = xi(), r = N(n, !0);
						E(n), I(() => Y(r, U(t))), J(e, n);
					}), E(n), E(t), J(e, t);
				};
				X(a, (e) => {
					G(o()), W(() => o().blockers?.length) && e(s);
				});
				var c = P(a, 2), l = (e) => {
					var t = Ei(), n = P(N(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().decisions)), Lr, (e, t) => {
						var n = Ti(), r = N(n), i = N(r, !0);
						E(r);
						var a = P(r, 2), o = (e) => {
							var n = wi(), r = N(n, !0);
							E(n), I(() => Y(r, (U(t), W(() => U(t).reference)))), J(e, n);
						};
						X(a, (e) => {
							U(t), W(() => U(t).reference) && e(o);
						}), E(n), I(() => Y(i, (U(t), W(() => U(t).summary)))), J(e, n);
					}), E(n), E(t), J(e, t);
				};
				X(c, (e) => {
					G(o()), W(() => o().decisions?.length) && e(l);
				});
				var u = P(c, 2), d = (e) => {
					var t = ki(), n = P(N(t), 2);
					Z(n, 5, () => (G(o()), W(() => o().routes)), Lr, (e, t) => {
						var n = Oi(), r = N(n), i = N(r), a = N(i, !0);
						E(i);
						var o = P(i, 2), s = N(o, !0);
						E(o), E(r);
						var c = P(r, 2), l = (e) => {
							var n = Di(), r = N(n, !0);
							E(n), I(() => Y(r, (U(t), W(() => U(t).reason)))), J(e, n);
						};
						X(c, (e) => {
							U(t), W(() => U(t).reason) && e(l);
						}), E(n), I(() => {
							Y(a, (U(t), W(() => U(t).title))), Yr(o, 1, (U(t), W(() => `route-state route-${U(t).state}`))), Y(s, (U(t), W(() => U(t).state)));
						}), J(e, n);
					}), E(n), E(t), J(e, t);
				};
				X(u, (e) => {
					G(o()), W(() => o().routes?.length) && e(d);
				});
				var f = P(u, 2), p = (e) => {
					var t = ji(), n = P(N(t), 2), r = N(n);
					E(n);
					var i = P(n, 2), a = (e) => {
						var t = Di(), n = N(t);
						E(t), I(() => Y(n, `Worktree: ${G(o()), W(() => o().claim.worktree) ?? ""}`)), J(e, t);
					};
					X(i, (e) => {
						G(o()), W(() => o().claim.worktree) && e(a);
					});
					var s = P(i, 2), c = (e) => {
						var t = Ai();
						Z(t, 5, () => (G(o()), W(() => o().claim.source_paths)), Lr, (e, t) => {
							var n = wi(), r = N(n, !0);
							E(n), I(() => Y(r, U(t))), J(e, n);
						}), E(t), J(e, t);
					};
					X(s, (e) => {
						G(o()), W(() => o().claim.source_paths?.length) && e(c);
					}), E(t), I(() => Y(r, `Agent: ${G(o()), W(() => o().claim.agent) ?? ""}`)), J(e, t);
				};
				X(f, (e) => {
					G(o()), W(() => o().claim) && e(p);
				}), E(t), J(e, t);
			};
			X(c, (e) => {
				U(a) && e(l);
			}), J(t, n);
		}), J(e, t);
	};
	X(c, (e) => {
		o() && e(l);
	}), J(e, s), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Fi = /* @__PURE__ */ q("<option> </option>"), Ii = /* @__PURE__ */ q("<button class=\"time-item-button\" type=\"button\"> </button>"), Li = /* @__PURE__ */ q("<span class=\"time-item-button\"> </span>"), Ri = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), zi = /* @__PURE__ */ q("<details class=\"spike-estimate-editor\"><summary><span>人工工時與依據</span> <small> </small></summary> <div class=\"spike-estimate-fields\"><label><span>工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <button type=\"button\">套用工時草稿</button> <!></div></details>"), Bi = /* @__PURE__ */ q("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button> <!>", 1), Vi = /* @__PURE__ */ q("<span> </span>"), Hi = /* @__PURE__ */ q("<span class=\"spike-item-title\"> </span> <!> <!>", 1), Ui = /* @__PURE__ */ q("<li><!></li>");
function Wi(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ A(), r = /* @__PURE__ */ A(), i = /* @__PURE__ */ A(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "onTimeClick", 8, null), h = /* @__PURE__ */ A(f() ? String(f().likely_minutes / 60) : d() ? String(d().likely_minutes / 60) : ""), g = /* @__PURE__ */ A(f()?.human_note ?? ""), _ = /* @__PURE__ */ A(!!f()?.human_confirmed), v = /* @__PURE__ */ A("");
	function y() {
		let e = Number(U(h));
		if (!Number.isFinite(e) || e <= 0) {
			j(v, "工時必須大於 0。");
			return;
		}
		let t = p()?.({
			taskId: a(),
			itemId: s().id,
			likelyMinutes: Math.round(e * 60),
			humanNote: U(g),
			humanConfirmed: U(_)
		});
		j(v, t?.error ?? "");
	}
	F(() => (G(l()), G(s())), () => {
		j(n, l().metadata(s().priority));
	}), F(() => (G(l()), G(s())), () => {
		j(r, l().format(s().priority));
	}), F(() => G(d()), () => {
		j(i, d() ? d().label ?? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), An(), pi();
	var b = Ui();
	let x;
	var S = N(b), ee = (e) => {
		var t = Bi(), n = hn(t);
		ii(n);
		var r = P(n, 2);
		Z(r, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Fi(), r = N(n, !0);
			E(n);
			var i = {};
			I((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
		}), E(r);
		var c;
		Zr(r);
		var f = P(r, 2), b = (e) => {
			var t = Ii(), n = N(t, !0);
			E(t), I(() => {
				Q(t, "aria-label", (G(s()), U(i), W(() => `${s().title}，${U(i)}，查看估算依據`))), Y(n, U(i));
			}), K("click", t, () => m()(s().id, s().title)), J(e, t);
		}, x = (e) => {
			var t = Li(), n = N(t, !0);
			E(t), I(() => {
				Q(t, "title", (G(d()), W(() => `目前分析：${d().likely_minutes} 分鐘`))), Y(n, U(i));
			}), J(e, t);
		};
		X(f, (e) => {
			d() && m() ? e(b) : d() && e(x, 1);
		});
		var S = P(f, 2), ee = P(S, 2), te = (e) => {
			var t = zi(), n = N(t), r = P(N(n), 2), i = N(r, !0);
			E(r), E(n);
			var a = P(n, 2), o = N(a), c = P(N(o), 2);
			ii(c), E(o);
			var l = P(o, 2), u = P(N(l), 2);
			ii(u), E(l);
			var d = P(l, 2), f = N(d);
			ii(f), ze(2), E(d);
			var p = P(d, 4), m = P(p, 2), b = (e) => {
				var t = Ri(), n = N(t, !0);
				E(t), I(() => Y(n, U(v))), J(e, t);
			};
			X(m, (e) => {
				U(v) && e(b);
			}), E(a), E(t), I(() => {
				Y(i, U(_) ? "已確認" : "未確認"), Q(c, "aria-label", (G(s()), W(() => `「${s().title}」人工工時（hr）`))), Q(u, "aria-label", (G(s()), W(() => `「${s().title}」人工依據`))), Q(f, "aria-label", (G(s()), W(() => `確認「${s().title}」的人工估算`))), Q(p, "aria-label", (G(s()), W(() => `套用「${s().title}」人工估算草稿`)));
			}), li(c, () => U(h), (e) => j(h, e)), li(u, () => U(g), (e) => j(g, e)), ui(f, () => U(_), (e) => j(_, e)), K("click", p, y), J(e, t);
		};
		X(ee, (e) => {
			p() && e(te);
		}), I(() => {
			Q(n, "aria-label", (G(s()), W(() => `編輯子項目：${s().title}`))), ai(n, (G(s()), W(() => s().title))), Q(r, "aria-label", (G(s()), W(() => `設定「${s().title}」的優先級`))), c !== (c = (G(s()), W(() => s().priority))) && (r.value = (r.__value = (G(s()), W(() => s().priority))) ?? "", Xr(r, (G(s()), W(() => s().priority)))), Q(S, "aria-label", (G(s()), W(() => `刪除子項目：${s().title}`)));
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
	}, te = (e) => {
		var t = Hi(), a = hn(t), o = N(a, !0);
		E(a);
		var c = P(a, 2), u = (e) => {
			var t = Vi(), i = N(t, !0);
			E(t), I(() => {
				Yr(t, 1, (U(n), W(() => `priority-badge priority-${U(n).tone}`))), Y(i, U(r));
			}), J(e, t);
		};
		X(c, (e) => {
			U(n), G(l()), W(() => U(n) && (!U(n).hidden || !l().labelsValid)) && e(u);
		});
		var f = P(c, 2), p = (e) => {
			var t = Ii(), n = N(t, !0);
			E(t), I(() => {
				Q(t, "aria-label", (G(s()), U(i), W(() => `${s().title}，${U(i)}，查看估算依據`))), Y(n, U(i));
			}), K("click", t, () => m()(s().id, s().title)), J(e, t);
		}, h = (e) => {
			var t = Li(), n = N(t, !0);
			E(t), I(() => {
				Q(t, "title", (G(d()), W(() => `目前分析：${d().likely_minutes} 分鐘`))), Y(n, U(i));
			}), J(e, t);
		};
		X(f, (e) => {
			d() && m() ? e(p) : d() && e(h, 1);
		}), I(() => Y(o, (G(s()), W(() => s().title)))), J(e, t);
	};
	X(S, (e) => {
		c() ? e(ee) : e(te, -1);
	}), E(b), I(() => x = Yr(b, 1, "editor-item-row", null, x, {
		"editable-work-item": c(),
		"has-estimate-editor": c() && p()
	})), J(e, b), Ye();
}
yr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Gi = /* @__PURE__ */ q("<option> </option>"), Ki = /* @__PURE__ */ q("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), qi = /* @__PURE__ */ q("<span> </span>"), Ji = /* @__PURE__ */ q("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Yi = /* @__PURE__ */ q("<h3> </h3>"), Xi = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Zi = /* @__PURE__ */ q("<p class=\"task-summary\"> </p>"), Qi = /* @__PURE__ */ q("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), $i = /* @__PURE__ */ q("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), ea = /* @__PURE__ */ q("<button class=\"spike-add-button\" type=\"button\">＋</button>"), ta = /* @__PURE__ */ q("<div class=\"spike-add-shell\"><!></div>"), na = /* @__PURE__ */ q("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function ra(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ A(), r = /* @__PURE__ */ A(), i = /* @__PURE__ */ A(), a = /* @__PURE__ */ A(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
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
	], y = /* @__PURE__ */ A(!1), b = /* @__PURE__ */ A(""), x = /* @__PURE__ */ A(l().creationDefaultValue), S = /* @__PURE__ */ A("");
	function ee() {
		j(y, !1), j(b, ""), j(x, l().creationDefaultValue), j(S, "");
	}
	function te() {
		let e = d()(U(b), Number(U(x)));
		j(S, e.error), U(S) || ee();
	}
	F(() => G(o()), () => {
		j(n, [{
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
	}), F(() => (U(n), G(g())), () => {
		j(r, [...U(n)].sort((e, t) => {
			let n = g().indexOf(e.status), r = g().indexOf(t.status);
			return (n < 0 ? g().length : n) - (r < 0 ? g().length : r);
		}));
	}), F(() => (G(l()), G(o())), () => {
		j(i, l().metadata(o().priority));
	}), F(() => G(o()), () => {
		j(a, v.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), F(() => (G(c()), U(y)), () => {
		!c() && U(y) && ee();
	}), An(), pi();
	var ne = na(), re = N(ne), ie = N(re), ae = N(ie), oe = N(ae), se = N(oe, !0);
	E(oe);
	var ce = P(oe, 2), le = (e) => {
		var t = Ki(), n = hn(t);
		Z(n, 5, () => v, (e) => e.value, (e, t) => {
			var n = Gi(), r = N(n, !0);
			E(n);
			var i = {};
			I(() => {
				Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}), J(e, n);
		}), E(n);
		var r;
		Zr(n);
		var i = P(n, 2);
		Z(i, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Gi(), r = N(n, !0);
			E(n);
			var i = {};
			I((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
		}), E(i);
		var a;
		Zr(i), I(() => {
			Q(n, "aria-label", (G(o()), W(() => `${o().title} 狀態`))), r !== (r = (G(o()), W(() => o().status))) && (n.value = (n.__value = (G(o()), W(() => o().status))) ?? "", Xr(n, (G(o()), W(() => o().status)))), Q(i, "aria-label", (G(o()), W(() => `${o().title} 優先級`))), a !== (a = (G(o()), W(() => o().priority))) && (i.value = (i.__value = (G(o()), W(() => o().priority))) ?? "", Xr(i, (G(o()), W(() => o().priority))));
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
	}, ue = (e) => {
		var t = qi(), n = N(t, !0);
		E(t), I((e, r, a) => {
			Yr(t, 1, (U(i), W(() => `task-priority-badge priority-badge priority-${U(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), Y(n, a);
		}, [
			() => (G(l()), G(o()), W(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (G(l()), G(o()), W(() => `優先級：${l().format(o().priority)}`)),
			() => (G(l()), G(o()), W(() => l().format(o().priority)))
		]), J(e, t);
	};
	X(ce, (e) => {
		c() ? e(le) : (U(i), G(l()), W(() => U(i) && (!U(i).hidden || !l().labelsValid)) && e(ue, 1));
	}), E(ae);
	var de = P(ae, 2), fe = N(de), pe = (e) => {
		var t = Ji();
		ii(t), I(() => {
			Q(t, "id", (G(o()), W(() => `task-${o().id}-title`))), ai(t, (G(o()), W(() => o().title)));
		}), K("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), J(e, t);
	}, me = (e) => {
		var t = Yi(), n = N(t, !0);
		E(t), I(() => {
			Q(t, "id", (G(o()), W(() => `task-${o().id}-title`))), Y(n, (G(o()), W(() => o().title)));
		}), J(e, t);
	};
	X(fe, (e) => {
		c() ? e(pe) : e(me, -1);
	});
	var he = P(fe, 2), ge = N(he, !0);
	E(he), E(de), E(ie);
	var _e = P(ie, 2), ve = N(_e), ye = N(ve);
	E(ve);
	var be = P(ve, 2), xe = N(be, !0);
	E(be), E(_e), E(re);
	var Se = P(re, 2), Ce = (e) => {
		var t = Xi();
		lt(t), I(() => ai(t, (G(o()), W(() => o().summary)))), K("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), J(e, t);
	}, we = (e) => {
		var t = Zi(), n = N(t, !0);
		E(t), I(() => Y(n, (G(o()), W(() => o().summary)))), J(e, t);
	};
	X(Se, (e) => {
		c() ? e(Ce) : e(we, -1);
	});
	var Te = P(Se, 2);
	{
		let e = /* @__PURE__ */ Tt(() => (G(o()), W(() => o().developer ?? null)));
		Pi(Te, { get developer() {
			return U(e);
		} });
	}
	var Ee = P(Te, 2), De = N(Ee);
	Z(De, 1, () => U(r), (e) => e.status, (e, t) => {
		var n = Er(), r = hn(n), i = (e) => {
			var n = Qi(), r = N(n), i = N(r, !0);
			E(r);
			var a = P(r, 2);
			Z(a, 5, () => (U(t), W(() => U(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ Tt(() => (G(f()), U(n), W(() => f().get(U(n).id) ?? null))), i = /* @__PURE__ */ Tt(() => (G(p()), U(n), W(() => p().get(U(n).id) ?? null)));
					Wi(e, {
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
			}), E(a), E(n), I(() => {
				Yr(n, 1, (U(t), W(() => `detail-section ${U(t).className}`))), Y(i, (U(t), W(() => U(t).title)));
			}), J(e, n);
		};
		X(r, (e) => {
			U(t), G(c()), W(() => U(t).items.length || c()) && e(i);
		}), J(e, n);
	});
	var Oe = P(De, 2), ke = N(Oe), Ae = (e) => {
		var t = ta(), n = N(t), r = (e) => {
			var t = $i(), n = N(t);
			ii(n);
			var r = P(n, 2);
			Z(r, 5, () => (G(l()), W(() => l().levels)), (e) => e.value, (e, t) => {
				var n = Gi(), r = N(n, !0);
				E(n);
				var i = {};
				I((e) => {
					Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
				}, [() => (G(l()), U(t), W(() => l().format(U(t).value)))]), J(e, n);
			}), E(r);
			var i = P(r, 2), a = P(i, 2), o = P(a, 2), s = N(o, !0);
			E(o), E(t), I(() => {
				Q(o, "hidden", !U(S)), Y(s, U(S));
			}), K("keydown", n, (e) => {
				e.key === "Enter" && te(), e.key === "Escape" && ee();
			}), li(n, () => U(b), (e) => j(b, e)), Qr(r, () => U(x), (e) => j(x, e)), K("click", i, te), K("click", a, ee), J(e, t);
		}, i = (e) => {
			var t = ea();
			I(() => Q(t, "aria-label", (G(o()), W(() => `在「${o().title}」新增子項目`)))), K("click", t, () => {
				j(y, !0);
			}), J(e, t);
		};
		X(n, (e) => {
			U(y) ? e(r) : e(i, -1);
		}), E(t), J(e, t);
	};
	X(ke, (e) => {
		c() && e(Ae);
	}), E(Oe), E(Ee), E(ne), I(() => {
		Yr(ne, 1, (U(a), W(() => `task-card editor-task-card status-${U(a).tone}`))), Q(ne, "aria-labelledby", (G(o()), W(() => `task-${o().id}-title`))), Yr(oe, 1, (U(a), W(() => `status-badge status-${U(a).tone}`))), Y(se, (U(a), W(() => U(a).label))), Q(he, "hidden", !_()), Y(ge, _() ? `約需 ${_()}` : ""), Q(ve, "aria-label", (G(s()), W(() => `子項目完成 ${s().completed}，共 ${s().total}`))), Y(ye, `${G(s()), W(() => s().completed) ?? ""} / ${G(s()), W(() => s().total) ?? ""}`), Y(xe, (G(o()), W(() => o().id)));
	}), J(e, ne), Ye();
}
yr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var ia = /* @__PURE__ */ q("<p class=\"empty-state\"> </p>");
function aa(e, t) {
	Je(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), d = $(t, "onManualEstimate", 8, null), f = $(t, "onTimeClick", 8, null), p = $(t, "durations", 24, () => ({})), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	pi();
	var g = Er(), _ = hn(g), v = (e) => {
		var t = Er();
		Z(hn(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ Tt(() => (G(c()), U(t), W(() => c().get(U(t).id) ?? null))), h = /* @__PURE__ */ Tt(() => (G(p()), U(t), W(() => p()[U(t).id] ?? null)));
				ra(e, {
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
		var t = ia(), n = N(t, !0);
		E(t), I(() => Y(n, h())), J(e, t);
	};
	X(_, (e) => {
		G(n()), W(() => n().length) ? e(v) : e(y, -1);
	}), J(e, g), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var oa = {
	"task-list": aa,
	"status-overview": vi,
	"project-progress": gi
}, sa = {
	id: "svelte",
	regions: Object.keys(oa),
	mount(e, t, n) {
		let r = an({ ...n });
		return {
			component: jr(oa[e], {
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
		Fr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(sa);
//#endregion
