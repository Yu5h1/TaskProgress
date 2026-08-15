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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, T = 65536, te = 1 << 21, ne = 1 << 22, re = 1 << 23, ie = Symbol("$state"), ae = Symbol("legacy props"), oe = Symbol(""), se = Symbol("attributes"), ce = Symbol("class"), le = Symbol("style"), ue = Symbol("text"), de = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), fe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var Te = {}, E = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml";
function De() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Oe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ke() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var D = !1;
function Ae(e) {
	D = e;
}
var O;
function k(e) {
	if (e === null) throw Oe(), Te;
	return O = e;
}
function je() {
	return k(/* @__PURE__ */ en(O));
}
function A(e) {
	if (D) {
		if (/* @__PURE__ */ en(O) !== null) throw Oe(), Te;
		O = e;
	}
}
function Me(e = 1) {
	if (D) {
		for (var t = e, n = O; t--;) n = /* @__PURE__ */ en(n);
		O = n;
	}
}
function Ne(e = !0) {
	for (var t = 0, n = O;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ en(n);
		e && n.remove(), n = i;
	}
}
function Pe(e) {
	if (!e || e.nodeType !== 8) throw Oe(), Te;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Fe(e) {
	return e === this.v;
}
function Ie(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Le(e) {
	return !Ie(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Re = !1;
function ze() {
	Re = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var j = null;
function Be(e) {
	j = e;
}
function Ve(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: W,
		l: Re && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function He(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) pn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function Ue() {
	return !Re || j !== null && j.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var We = [];
function Ge() {
	var e = We;
	We = [], p(e);
}
function Ke(e) {
	if (We.length === 0 && !wt) {
		var t = We;
		queueMicrotask(() => {
			t === We && Ge();
		});
	}
	We.push(e);
}
function qe(e) {
	var t = W;
	if (t === null) return V.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Je(e, t);
}
function Je(e, t) {
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
var Ye = ~(g | _ | h);
function M(e, t) {
	e.f = e.f & Ye | t;
}
function Xe(e) {
	e.f & 512 || e.deps === null ? M(e, h) : M(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Ze(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= T, Ze(t.deps));
}
function Qe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Ze(e.deps), M(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var $e = !1;
function et(e) {
	var t = $e;
	try {
		return $e = !1, [e(), $e];
	} finally {
		$e = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function tt(e) {
	D && /* @__PURE__ */ $t(e) !== null && nn(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function nt(e) {
	var t = V, n = W;
	U(null), Nn(null);
	try {
		return e();
	} finally {
		U(t), Nn(n);
	}
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function rt(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		un() && (J(n), _n(() => (t === 0 && (r = Xn(() => e(() => Gt(n)))), t += 1, () => {
			Ke(() => {
				--t, t === 0 && (r?.(), r = void 0, Gt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var it = S | C;
function at(e, t, n, r) {
	new ot(e, t, n, r);
}
var ot = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = D ? O : null;
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
	#h = rt(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = W;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = vn(() => {
			if (D) {
				let e = this.#t;
				je();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, it), D && (this.#e = O);
	}
	#g() {
		try {
			this.#a = z(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ke(r), t && (this.#s = z(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				ke();
				return;
			}
			t = !0, n && we(), this.#s !== null && wn(this.#s, () => {
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
					Je(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = z(() => e(this.#e)), Ke(() => {
			var e = this.#c = document.createDocumentFragment(), t = F();
			e.append(t), this.#a = this.#S(() => z(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, wn(this.#o, () => {
				this.#o = null;
			}), this.#x(N));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = z(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				On(this.#a, e);
				let t = this.#n.pending;
				this.#o = z(() => t(this.#e));
			} else this.#x(N);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		Qe(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = W, n = V, r = j;
		Nn(this.#i), U(this.#i), Be(this.#i.ctx);
		try {
			return At.ensure(), e();
		} catch (e) {
			return qe(e), null;
		} finally {
			Nn(t), U(n), Be(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && wn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ke(() => {
			this.#d = !1, this.#m && Ut(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), J(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), D && (k(this.#t), Me(), k(Ne()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return z(() => {
						var r = W;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Je(e, this.#i.parent), null;
				}
			}));
		};
		Ke(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Je(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Je(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function st(e, t, n, r) {
	let i = Ue() ? dt : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = W, c = ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Je(e, s);
			}
			lt();
		}
	}
	var d = ut();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ pt(e))).then(u).catch((e) => Je(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), lt();
	}) : f();
}
function ct() {
	var e = W, t = V, n = j, r = N;
	return function(i = !0) {
		Nn(e), U(t), Be(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function lt(e = !0) {
	Nn(null), U(null), Be(null), e && N?.deactivate();
}
function ut() {
	var e = W, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function dt(e) {
	var t = 2 | g;
	return W !== null && (W.f |= C), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Fe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: E,
		wv: 0,
		parent: W,
		ac: null
	};
}
var ft = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function pt(e, t, n) {
	let r = W;
	r === null && me();
	var i = void 0, a = Bt(E), o = !V, s = /* @__PURE__ */ new Set();
	return gn(() => {
		var t = W, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(lt);
		} catch (e) {
			n.reject(e), lt();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = ut();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(ft);
			else for (let e of s.values()) e.reject(ft);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== ft && (c.activate(), t ? (a.f |= re, Ut(a, t)) : (a.f & 8388608 && (a.f ^= re), Ut(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), dn(() => {
		for (let e of s) e.reject(ft);
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
function mt(e) {
	let t = /* @__PURE__ */ dt(e);
	return t.equals = Le, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function gt(e) {
	var t, n = W, r = e.parent;
	if (!jn && r !== null && e.v !== E && r.f & 24576) return De(), e.v;
	Nn(r);
	try {
		e.f &= ~T, ht(e), t = Wn(e);
	} finally {
		Nn(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	if (!e.equals(t) && (e.wv = Vn(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null))) {
		M(e, h);
		return;
	}
	jn || (St === null ? Xe(e) : (un() || N?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && nt(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), Kn(t, 0), bn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && qn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, N = null, xt = null, St = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
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
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
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
			for (var r of n.d) M(r, g), t(r);
			for (r of n.m) M(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ot++ > 1e3 && (this.#x(), jt());
		for (let e of this.#u) this.#d.delete(e), M(e, g), this.schedule(e);
		for (let e of this.#d) M(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Et = [], r = [], i = Dt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw It(e), this.#h() || this.discard(), t;
		}
		if (N = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ft(e, t);
			i.length > 0 && N.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), xt = this, Nt(r), Nt(n), xt = null, this.#s?.resolve();
		var s = N;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : Hn(r) && (i & 16 && this.#d.add(r), qn(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), M(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), N = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) Qe(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== E && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, St = null;
	}
	flush() {
		try {
			Tt = !0, N = this, this.#g();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, N = null, St = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ft);
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
		this.#m || (this.#m = !0, Ke(() => {
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
		if (N === null) {
			let t = N = new e();
			!Tt && Ke(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		St = null;
	}
	schedule(e) {
		if (Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Et !== null && t === W && (V === null || !(V.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt() {
	try {
		ye();
	} catch (e) {
		Je(e, Ct);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Hn(r) && (Mt = /* @__PURE__ */ new Set(), qn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Cn(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || qn(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	N.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, h);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	M(e, h);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Fe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t) {
	let n = Bt(e, t);
	return Fn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Ht(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Le), Re && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function P(e, t, n = !1) {
	return V !== null && (!H || V.f & 131072) && Ue() && V.f & 4325394 && (Pn === null || !Pn.has(e)) && Ce(), Ut(e, n ? qt(t) : t, Dt);
}
function Ut(e, t, n = null) {
	if (!e.equals(t)) {
		Rt.set(e, jn ? t : e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && Xe(t);
		}
		e.wv = Vn(), Kt(e, g, n), Ue() && W !== null && W.f & 1024 && !(W.f & 96) && (q === null ? In([e]) : q.push(e)), !r.is_fork && Lt.size > 0 && !zt && Wt();
	}
	return t;
}
function Wt() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = Hn(e);
		} catch {
			t = !0;
		}
		t && qn(e);
	}
	Lt.clear();
}
function Gt(e) {
	P(e, e.v + 1);
}
function Kt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ue(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === W)) {
			var l = (c & g) === 0;
			if (l && M(s, t), c & 131072) Lt.add(s);
			else if (c & 2) {
				var u = s;
				St?.delete(u), c & 65536 || (c & 512 && (W === null || !(W.f & 2097152)) && (s.f |= T), Kt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
			}
		}
	}
}
function qt(t) {
	if (typeof t != "object" || !t || ie in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Vt(0), u = null, d = zn, f = (e) => {
		if (zn === d) return e();
		var t = V, n = zn;
		U(null), Bn(d);
		var r = e();
		return U(t), Bn(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Vt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Vt(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Vt(E, u));
					r.set(t, e), Gt(o);
				}
			} else P(n, E), Gt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ie) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Vt(qt(s ? e[n] : E), u)), r.set(n, o)), o !== void 0) {
				var c = J(o);
				return c === E ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = J(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== E) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ie) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== E || Reflect.has(e, t);
			return (n !== void 0 || W !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Vt(i ? qt(e[t]) : E, u)), r.set(t, n)), J(n) === E) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Vt(E, u)), r.set(d + "", p)) : P(p, E);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Vt(void 0, u)), P(c, qt(n)), r.set(t, c));
			else {
				l = c.v !== E;
				var m = f(() => qt(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Gt(o);
			}
			return !0;
		},
		ownKeys(e) {
			J(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== E;
			});
			for (var [n, i] of r) i.v !== E && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Se();
		}
	});
}
var Jt, Yt, Xt, Zt;
function Qt() {
	if (Jt === void 0) {
		Jt = window, Yt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Xt = a(t, "firstChild").get, Zt = a(t, "nextSibling").get, u(e) && (e[ce] = void 0, e[se] = null, e[le] = void 0, e.__e = void 0), u(n) && (n[ue] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Xt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function en(e) {
	return Zt.call(e);
}
function I(e, t) {
	if (!D) return /* @__PURE__ */ $t(e);
	var n = /* @__PURE__ */ $t(O);
	if (n === null) n = O.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), k(r), r;
	}
	return t && on(n), k(n), n;
}
function tn(e, t = !1) {
	if (!D) {
		var n = /* @__PURE__ */ $t(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ en(n) : n;
	}
	if (t) {
		if (O?.nodeType !== 3) {
			var r = F();
			return O?.before(r), k(r), r;
		}
		on(O);
	}
	return O;
}
function L(e, t = 1, n = !1) {
	let r = D ? O : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ en(r);
	if (!D) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), k(a), a;
		}
		on(r);
	}
	return k(r), r;
}
function nn(e) {
	e.textContent = "";
}
function rn() {
	return !1;
}
function an(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function on(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function sn(e) {
	W === null && (V === null && ve(e), _e()), jn && ge(e);
}
function cn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function ln(e, t) {
	var n = W;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: j,
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
	N?.register_created_effect(r);
	var i = r;
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			qn(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && cn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function un() {
	return V !== null && !H;
}
function dn(e) {
	let t = ln(8, null);
	return M(t, h), t.teardown = e, t;
}
function fn(e) {
	sn("$effect");
	var t = W.f;
	if (!V && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return pn(e);
}
function pn(e) {
	return ln(4 | w, e);
}
function mn(e) {
	return sn("$effect.pre"), ln(8 | w, e);
}
function hn(e) {
	At.ensure();
	let t = ln(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? wn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function gn(e) {
	return ln(ne | C, e);
}
function _n(e, t = 0) {
	return ln(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	st(r, t, n, (t) => {
		ln(8, () => {
			e(...t.map(J));
		});
	});
}
function vn(e, t = 0) {
	return ln(16 | t, e);
}
function z(e) {
	return ln(32 | C, e);
}
function yn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = jn, n = V;
		Mn(!0), U(null);
		try {
			t.call(null);
		} finally {
			Mn(e), U(n);
		}
	}
}
function bn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && nt(() => {
			e.abort(de);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function xn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Sn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, bn(e, t && !n), Kn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	yn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Cn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Sn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ en(e);
		e.remove(), e = n;
	}
}
function Cn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function wn(e, t, n = !0) {
	var r = [];
	Tn(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Tn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Tn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function En(e) {
	Dn(e, !0);
}
function Dn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Dn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function On(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ en(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var kn = null, An = !1, jn = !1;
function Mn(e) {
	jn = e;
}
var V = null, H = !1;
function U(e) {
	V = e;
}
var W = null;
function Nn(e) {
	W = e;
}
var Pn = null;
function Fn(e) {
	V !== null && (Pn ??= /* @__PURE__ */ new Set()).add(e);
}
var G = null, K = 0, q = null;
function In(e) {
	q = e;
}
var Ln = 1, Rn = 0, zn = Rn;
function Bn(e) {
	zn = e;
}
function Vn() {
	return ++Ln;
}
function Hn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Hn(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && M(e, h);
	}
	return !1;
}
function Un(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Pn !== null && Pn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Un(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Pt(a));
	}
}
function Wn(e) {
	var t = G, n = K, r = q, i = V, a = Pn, o = j, s = H, c = zn, l = e.f;
	G = null, K = 0, q = null, V = l & 96 ? null : e, Pn = null, Be(e.ctx), H = !1, zn = ++Rn, e.ac !== null && (nt(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = N?.is_fork;
		if (G !== null) {
			var m;
			if (p || Kn(e, K), f !== null && K > 0) for (f.length = K + G.length, m = 0; m < G.length; m++) f[K + m] = G[m];
			else e.deps = f = G;
			if (un() && e.f & 512) for (m = K; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && K < f.length && (Kn(e, K), f.length = K);
		if (Ue() && q !== null && !H && f !== null && !(e.f & 6146)) for (m = 0; m < q.length; m++) Un(q[m], e);
		if (i !== null && i !== e) {
			if (Rn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Rn;
			if (t !== null) for (let e of t) e.rv = Rn;
			q !== null && (r === null ? r = q : r.push(...q));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (e) {
		return qe(e);
	} finally {
		e.f ^= te, G = t, K = n, q = r, V = i, Pn = a, Be(o), H = s, zn = c;
	}
}
function Gn(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (G === null || !n.call(G, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== E && Xe(s), s.ac !== null && nt(() => {
			s.ac.abort(de), s.ac = null, M(s, g);
		}), vt(s), Kn(s, 0);
	}
}
function Kn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Gn(e, n[r]);
}
function qn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = W, r = An;
		W = e, An = !(t & 96);
		try {
			t & 16777232 ? xn(e) : bn(e), yn(e);
			var i = Wn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Ln;
		} finally {
			An = r, W = n;
		}
	}
}
function J(e) {
	var t = !!(e.f & 2);
	if (kn?.add(e), V !== null && !H && !(W !== null && W.f & 16384) && (Pn === null || !Pn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < Rn && (e.rv = Rn, G === null && r !== null && r[K] === e ? K++ : G === null ? G = [e] : G.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (jn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var a = e;
		if (jn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || Yn(a)) && (o = gt(a)), Rt.set(a, o), o;
		}
		var s = !(a.f & 512) && !H && V !== null && (An || !!(V.f & 512)), c = (a.f & b) === 0;
		Hn(a) && (s && (a.f |= 512), _t(a)), s && !c && (yt(a), Jn(a));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Jn(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (yt(t), Jn(t));
}
function Yn(e) {
	if (e.v === E) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && Yn(t)) return !0;
	return !1;
}
function Xn(e) {
	var t = H;
	try {
		return H = !0, e();
	} finally {
		H = t;
	}
}
function Zn(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ie in e) Qn(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ie in n && Qn(n);
		}
	}
}
function Qn(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Qn(e[n], t);
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
var $n = ["touchstart", "touchmove"];
function er(e) {
	return $n.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var tr = Symbol("events"), nr = /* @__PURE__ */ new Set(), rr = /* @__PURE__ */ new Set();
function ir(e, t, n) {
	(t[tr] ??= {})[e] = n;
}
function ar(e) {
	for (var t = 0; t < e.length; t++) nr.add(e[t]);
	for (var n of rr) n(e);
}
var or = null;
function sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	or = e;
	var s = 0, c = or === e && e[tr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[tr] = t;
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
		var d = V, f = W;
		U(null), Nn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[tr]?.[r];
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
			e[tr] = t, delete e.currentTarget, U(d), Nn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var cr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function lr(e) {
	return cr?.createHTML(e) ?? e;
}
function ur(e) {
	var t = an("template");
	return t.innerHTML = lr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function dr(e, t) {
	var n = W;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Y(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (D) return dr(O, null), O;
		i === void 0 && (i = ur(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ $t(i)));
		var t = r || Yt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ $t(t), s = t.lastChild;
			dr(o, s);
		} else dr(t, t);
		return t;
	};
}
function X(e, t) {
	if (D) {
		var n = W;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = O), je();
		return;
	}
	e !== null && e.before(t);
}
function Z(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ue] ??= e.nodeValue) && (e[ue] = n, e.nodeValue = `${n}`);
}
function fr(e, t) {
	return mr(e, t);
}
var pr = /* @__PURE__ */ new Map();
function mr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	Qt();
	var l = void 0, u = hn(() => {
		var s = n ?? t.appendChild(F());
		at(s, { pending: () => {} }, (t) => {
			Ve({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), D && dr(t, null), l = e(t, i) || {}, D && (W.nodes.end = O, O === null || O.nodeType !== 8 || O.data !== "]")) throw Oe(), Te;
			He();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = er(r);
					for (let e of [t, document]) {
						var a = pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(nr)), rr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, sr), r.delete(e), r.size === 0 && pr.delete(n)) : r.set(e, i);
			}
			rr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return hr.set(l, u), l;
}
var hr = /* @__PURE__ */ new WeakMap(), gr = class {
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
			if (n) En(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (En(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (B(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						On(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), wn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = rn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = F();
			i.append(a), this.#n.set(e, {
				effect: z(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, z(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else D && (this.anchor = O), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function _r(e, t, n = !1) {
	var r;
	D && (r = O, je());
	var i = new gr(e), a = n ? S : 0;
	function o(e, t) {
		if (D) {
			var n = Pe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ne();
				k(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function vr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		wn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					yr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			nn(d), d.append(u), e.items.clear();
		}
		yr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function yr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, On(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var br;
function xr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = D ? k(/* @__PURE__ */ $t(u)) : u.appendChild(F());
	}
	D && je();
	var d = null, f = /* @__PURE__ */ mt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Cr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Tr(d, null, c)) : En(d) : wn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: vn(() => {
			p = J(f);
			var e = p.length;
			let t = !1;
			D && Pe(c) === "[!" != (e === 0) && (c = Ne(), k(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = N, v = rn(), y = 0; y < e; y += 1) {
				D && O.nodeType === 8 && O.data === "]" && (c = O, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Ut(S.v, b), S.i && Ut(S.i, y), v && u.unskip_effect(S.e)) : (S = wr(l, h ? c : br ??= F(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = z(() => s(c)) : (d = z(() => s(br ??= F())), d.f |= ee)), e > r.size && he("", "", ""), D && e > 0 && k(Ne()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && Ae(!0), J(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, D && (c = O);
}
function Sr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Cr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Sr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (En(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Tr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Er(e, d, _), Er(e, _, y), Tr(_, y, n), d = _, p = [], m = [], l = Sr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Tr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Er(e, S.prev, C.next), Er(e, d, S), Er(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Tr(_, l, n), Er(e, _.prev, _.next), Er(e, _, d === null ? e.effect.first : d.next), Er(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Sr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Sr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (yr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Sr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			vr(e, w, te);
		}
	}
	o && Ke(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function wr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Ht(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: z(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Tr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ en(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Er(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Dr = [..." 	\n\r\f\xA0\v﻿"];
function Or(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Dr.includes(r[o - 1])) && (s === r.length || Dr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function kr(e, t, n, r, i, a) {
	var o = e[ce];
	if (D || o !== n || o === void 0) {
		var s = Or(n, r, a);
		(!D || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ce] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ar = Symbol("is custom element"), jr = Symbol("is html"), Mr = fe ? "link" : "LINK", Nr = fe ? "progress" : "PROGRESS";
function Pr(e, t) {
	var n = Ir(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Nr) && (e.value = t ?? "");
}
function Fr(e, t, n, r) {
	var i = Ir(e);
	D && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Mr) || i[t] !== (i[t] = n) && (t === "loading" && (e[oe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Rr(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ir(e) {
	return e[se] ??= {
		[Ar]: e.nodeName.includes("-"),
		[jr]: e.namespaceURI === Ee
	};
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Lr.get(t);
	if (n) return n;
	Lr.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function zr(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => Zn(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ dt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => J(i);
	}
	n.b.length && mn(() => {
		Br(t, r), p(n.b);
	}), fn(() => {
		let e = Xn(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && fn(() => {
		Br(t, r), p(n.a);
	});
}
function Br(e, t) {
	if (e.l.s) for (let t of e.l.s) J(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Q(e, t, n, r) {
	var i = !Re || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ dt(r), J(u)) : (l && (l = !1, c = s ? Xn(r) : r), c);
	let f;
	if (o) {
		var p = ie in e || ae in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = et(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
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
	var v = !1, y = (n & 1 ? dt : mt)(() => (v = !1, g()));
	o && J(y);
	var b = W;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? J(y) : i && o ? qt(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return jn && v || b.f & 16384 ? y.v : J(y);
	});
}
function Vr(e) {
	j === null && pe("onMount"), Re && j.l !== null ? Hr(j).m.push(e) : fn(() => {
		let t = Xn(e);
		if (typeof t == "function") return t;
	});
}
function Hr(e) {
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
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), ze();
//#endregion
//#region viewer/assets/editor-transaction.js
function $(e) {
	return structuredClone(e);
}
function Ur(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
	let r = $(e), i = $(r), a = $(i), o = t(a), s = [], c = [], l = Number.isInteger(n) && n > 0 ? n : 100, u = (e) => JSON.stringify(e);
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
		let r = $(a), i = t($(a), e);
		if (u(r) === u(i)) return !1;
		a = i;
		let o = s.at(-1);
		return n && o?.mergeKey === n ? (o.after = $(a), o.command = $(e), u(o.before) === u(o.after) && s.pop()) : (s.push({
			before: r,
			after: $(a),
			command: $(e),
			mergeKey: n
		}), s.length > l && s.shift()), c.length = 0, f(), !0;
	}
	function m() {
		let e = s.pop();
		return e ? (c.push(e), a = $(e.before), f(), !0) : !1;
	}
	function h() {
		let e = c.pop();
		return e ? (s.push(e), a = $(e.after), f(), !0) : !1;
	}
	function g(e) {
		r = $(e), i = $(r), a = $(i), s.length = 0, c.length = 0, f();
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
		commit(e) {
			g(e);
		}
	});
}
//#endregion
//#region viewer/assets/checklist-editor.js
function Wr(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function Gr(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
	}), t;
}
function Kr(e, t) {
	let { item: n, check: r } = Wr(e, t.workItemId, t.checkIndex);
	if (!r.isManual || r.persistedStatus !== "pending") throw Error("只有尚未儲存的 manual check 可以修改。");
	if (t.type === "set-result") {
		if (![
			"pending",
			"passed",
			"failed"
		].includes(t.status)) throw Error("不支援的 manual check 狀態。");
		r.status = t.status, t.status !== "failed" && (r.observed = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = n.checks.some((e) => e.status === "failed") ? "failed" : n.checks.every((e) => e.status === "passed") ? "passed" : "pending", e;
}
function qr(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status;
	})), t;
}
function Jr(e, t = {}) {
	let n = Ur(qr(e), {
		derive: Gr,
		historyLimit: t.historyLimit
	});
	function r() {
		return Object.freeze({
			document: structuredClone(n.derived),
			dirty: n.dirty,
			history: n.history
		});
	}
	function i(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return n.apply(e, Kr, t), r();
	}
	function a() {
		let e = [], t = [];
		return n.derived.items.forEach((n) => n.checks.forEach((r) => {
			if (!r.isManual || r.persistedStatus !== "pending" || r.status === "pending") return;
			let i = String(r.observed ?? "").trim();
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
		})), n.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的 manual check 結果。"
		}), Object.freeze({
			revision: n.draft.revision,
			results: e,
			errors: t
		});
	}
	return Object.freeze({
		snapshot: r,
		dispatch: i,
		prepareSave: a,
		undo() {
			return n.undo(), r();
		},
		redo() {
			return n.redo(), r();
		},
		discard() {
			return n.discard(), r();
		},
		commit(e) {
			return n.commit(qr(e)), r();
		}
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Yr = /* @__PURE__ */ Y("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1);
function Xr(e, t) {
	let n = Q(t, "dirty", 8, !1), r = Q(t, "saving", 8, !1), i = Q(t, "canUndo", 8, !1), a = Q(t, "canRedo", 8, !1), o = Q(t, "message", 8, ""), s = Q(t, "buttonLabel", 8, "儲存"), c = Q(t, "savingLabel", 8, "正在儲存…"), l = Q(t, "undoLabel", 8, "復原"), u = Q(t, "redoLabel", 8, "重做"), d = Q(t, "discardLabel", 8, "放棄"), f = Q(t, "onSave", 8, () => {}), p = Q(t, "onUndo", 8, () => {}), m = Q(t, "onRedo", 8, () => {}), h = Q(t, "onDiscard", 8, () => {});
	var g = Yr(), _ = tn(g), v = I(_, !0);
	A(_);
	var y = L(_, 2), b = I(y), x = I(b, !0);
	A(b);
	var S = L(b, 2), C = I(S, !0);
	A(S), A(y);
	var w = L(y, 2), ee = I(w, !0);
	A(w);
	var T = L(w, 2), te = I(T, !0);
	A(T), R(() => {
		Z(v, o()), Fr(b, "aria-label", `${l()}上一個修改`), b.disabled = !i() || r(), Z(x, l()), Fr(S, "aria-label", `${u()}下一個修改`), S.disabled = !a() || r(), Z(C, u()), w.disabled = r(), Z(ee, d()), T.disabled = !n() || r(), Z(te, r() ? c() : s());
	}), ir("click", b, function(...e) {
		p()?.apply(this, e);
	}), ir("click", S, function(...e) {
		m()?.apply(this, e);
	}), ir("click", w, function(...e) {
		h()?.apply(this, e);
	}), ir("click", T, function(...e) {
		f()?.apply(this, e);
	}), X(e, g);
}
ar(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var Zr = 1, Qr = /* @__PURE__ */ new Set(["load", "save"]);
function $r(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== Zr || typeof t.id != "string") return;
		let r = n.get(t.id);
		r && (n.delete(t.id), t.type === "result" ? r.resolve(t.payload) : r.reject(Error(t.error?.message ?? "Checklist bridge request failed.")));
	});
	function r(r, i) {
		if (!Qr.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: Zr,
				id: a,
				type: r
			};
			i !== void 0 && (s.payload = i), e.postMessage(s);
		});
	}
	return Object.freeze({
		load: () => r("load"),
		save: (e) => r("save", e)
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var ei = /* @__PURE__ */ Y("<p class=\"checklist-round\"> </p>"), ti = /* @__PURE__ */ Y("<p class=\"checklist-notice\" role=\"status\"> </p>"), ni = /* @__PURE__ */ Y("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), ri = /* @__PURE__ */ Y("<small> </small>"), ii = /* @__PURE__ */ Y("<div class=\"checklist-result-controls\"><button type=\"button\">✓</button> <button type=\"button\">!</button></div>"), ai = /* @__PURE__ */ Y("<div><dt>Reason</dt><dd> </dd></div>"), oi = /* @__PURE__ */ Y("<div><dt>Observed</dt><dd> </dd></div>"), si = /* @__PURE__ */ Y("<div><dt>Resolved</dt><dd> </dd></div>"), ci = /* @__PURE__ */ Y("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), li = /* @__PURE__ */ Y("<section><div class=\"checklist-check-heading\"><span class=\"checklist-marker\" aria-hidden=\"true\"> </span> <strong> </strong> <span class=\"checklist-owner\"> </span> <!></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), ui = /* @__PURE__ */ Y("<article><header class=\"checklist-item-header\"><span class=\"checklist-marker\" aria-hidden=\"true\"> </span> <div><h2> </h2> <p> </p> <!></div> <span class=\"checklist-status\"> </span></header> <div class=\"checklist-checks\"></div></article>"), di = /* @__PURE__ */ Y("<section class=\"checklist-items\" aria-label=\"Implementation checklist items\"></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), fi = /* @__PURE__ */ Y("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><p class=\"section-kicker\">Implementation Checklist</p> <h1> </h1> <!></div></header> <!></main>");
function pi(e, t) {
	Ve(t, !1);
	let n = null, r = /* @__PURE__ */ Ht(null), i = /* @__PURE__ */ Ht(!0), a = /* @__PURE__ */ Ht(!1), o = /* @__PURE__ */ Ht("正在載入 Checklist…"), s = /* @__PURE__ */ Ht("clean"), c = (e) => ({
		pending: " ",
		passed: "✓",
		failed: "!"
	})[e] ?? "?", l = (e) => ({
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	})[e] ?? e, u;
	Vr(async () => {
		try {
			u = $r(), n = Jr(await u.load()), P(r, n.snapshot()), P(o, "已載入；只有未執行的人工 checks 可以修改。");
		} catch (e) {
			P(s, "error"), P(o, e instanceof Error ? e.message : "Checklist 載入失敗。");
		} finally {
			P(i, !1);
		}
	});
	function d(e) {
		try {
			P(r, n.dispatch(e)), P(s, "clean"), P(o, J(r).dirty ? "有尚未儲存的人工驗證結果。" : "尚未修改。");
		} catch (e) {
			P(s, "error"), P(o, e.message);
		}
	}
	function f(e, t, n) {
		d({
			type: "set-result",
			workItemId: e,
			checkIndex: t.index,
			status: t.status === n ? "pending" : n
		});
	}
	function p() {
		P(r, n.undo()), P(o, "已復原上一個變更。");
	}
	function m() {
		P(r, n.redo()), P(o, "已重做上一個變更。");
	}
	function h() {
		P(r, n.discard()), P(s, "clean"), P(o, "已放棄所有尚未儲存的變更。");
	}
	async function g() {
		let e = n.prepareSave();
		if (e.errors.length) {
			P(s, "error"), P(o, e.errors[0].message);
			return;
		}
		P(a, !0), P(s, "saving"), P(o, "正在驗證並寫入 Markdown…");
		try {
			let t = await u.save({
				revision: e.revision,
				results: e.results
			});
			P(r, n.commit(t)), P(s, "clean"), P(o, "已安全寫入 Checklist。");
		} catch (e) {
			P(s, "error"), P(o, e instanceof Error ? e.message : "Checklist 儲存失敗。");
		} finally {
			P(a, !1);
		}
	}
	zr();
	var _ = fi(), v = I(_), y = I(v), b = L(I(y), 2), x = I(b, !0);
	A(b);
	var S = L(b, 2), C = (e) => {
		var t = ei(), n = I(t, !0);
		A(t), R(() => Z(n, J(r).document.roundIdentity)), X(e, t);
	};
	_r(S, (e) => {
		J(r) && e(C);
	}), A(y), A(v);
	var w = L(v, 2), ee = (e) => {
		var t = ti(), n = I(t, !0);
		A(t), R(() => Z(n, J(o))), X(e, t);
	}, T = (e) => {
		var t = ni(), n = I(t, !0);
		A(t), R(() => Z(n, J(o))), X(e, t);
	}, te = (e) => {
		var t = di(), n = tn(t);
		xr(n, 5, () => J(r).document.items, (e) => e.id, (e, t) => {
			var n = ui(), r = I(n), i = I(r), a = I(i, !0);
			A(i);
			var o = L(i, 2), s = I(o), u = I(s);
			A(s);
			var p = L(s, 2), m = I(p, !0);
			A(p);
			var h = L(p, 2), g = (e) => {
				var n = ri(), r = I(n);
				A(n), R((e) => Z(r, `Depends on: ${e ?? ""}`), [() => J(t).dependsOn.join(", ")]), X(e, n);
			};
			_r(h, (e) => {
				J(t).dependsOn.length && e(g);
			}), A(o);
			var _ = L(o, 2), v = I(_, !0);
			A(_), A(r);
			var y = L(r, 2);
			xr(y, 5, () => J(t).checks, (e) => e.index, (e, n) => {
				var r = li(), i = I(r), a = I(i), o = I(a, !0);
				A(a);
				var s = L(a, 2), l = I(s, !0);
				A(s);
				var u = L(s, 2), p = I(u, !0);
				A(u);
				var m = L(u, 2), h = (e) => {
					var r = ii(), i = I(r);
					let a;
					var o = L(i, 2);
					let s;
					A(r), R(() => {
						Fr(r, "aria-label", `${J(n).title} 驗證結果`), Fr(i, "aria-pressed", J(n).status === "passed"), a = kr(i, 1, "", null, a, { active: J(n).status === "passed" }), s = kr(o, 1, "fail", null, s, { active: J(n).status === "failed" }), Fr(o, "aria-pressed", J(n).status === "failed");
					}), ir("click", i, () => f(J(t).id, J(n), "passed")), ir("click", o, () => f(J(t).id, J(n), "failed")), X(e, r);
				};
				_r(m, (e) => {
					J(n).isManual && J(n).persistedStatus === "pending" && e(h);
				}), A(i);
				var g = L(i, 2), _ = I(g), v = L(I(_)), y = I(v, !0);
				A(v), A(_);
				var b = L(_, 2), x = L(I(b)), S = I(x, !0);
				A(x), A(b);
				var C = L(b, 2), w = (e) => {
					var t = ai(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Z(i, J(n).reason)), X(e, t);
				};
				_r(C, (e) => {
					J(n).reason && e(w);
				});
				var ee = L(C, 2), T = (e) => {
					var t = oi(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Z(i, J(n).observed)), X(e, t);
				};
				_r(ee, (e) => {
					J(n).observed && J(n).persistedStatus !== "pending" && e(T);
				});
				var te = L(ee, 2), ne = (e) => {
					var t = si(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Z(i, J(n).resolved)), X(e, t);
				};
				_r(te, (e) => {
					J(n).resolved && e(ne);
				}), A(g);
				var re = L(g, 2), ie = (e) => {
					var r = ci(), i = L(I(r), 2);
					tt(i), A(r), R(() => Pr(i, J(n).observed ?? "")), ir("input", i, (e) => d({
						type: "set-observed",
						workItemId: J(t).id,
						checkIndex: J(n).index,
						value: e.currentTarget.value
					})), X(e, r);
				};
				_r(re, (e) => {
					J(n).isManual && J(n).persistedStatus === "pending" && J(n).status === "failed" && e(ie);
				}), A(r), R((e) => {
					kr(r, 1, `checklist-check checklist-${J(n).status}`), Z(o, e), Z(l, J(n).title), Z(p, J(n).isManual ? "需人工驗證" : "Agent"), Z(y, J(n).action), Z(S, J(n).expect);
				}, [() => c(J(n).status)]), X(e, r);
			}), A(y), A(n), R((e, r) => {
				kr(n, 1, `checklist-item checklist-${J(t).status}`), Z(a, e), Z(u, `${J(t).id ?? ""}. ${J(t).title ?? ""}`), Z(m, J(t).outcome), Z(v, r);
			}, [() => c(J(t).status), () => l(J(t).status)]), X(e, n);
		}), A(n);
		var i = L(n, 2);
		Xr(I(i), {
			get dirty() {
				return J(r).dirty;
			},
			get saving() {
				return J(a);
			},
			get canUndo() {
				return J(r).history.canUndo;
			},
			get canRedo() {
				return J(r).history.canRedo;
			},
			get message() {
				return J(o);
			},
			onSave: g,
			onUndo: p,
			onRedo: m,
			onDiscard: h
		}), A(i), R(() => {
			Fr(i, "data-state", J(s)), Fr(i, "aria-busy", J(a));
		}), X(e, t);
	};
	_r(w, (e) => {
		J(i) ? e(ee) : J(r) ? e(te, -1) : e(T, 1);
	}), A(_), R(() => Z(x, J(r)?.document.fileName ?? "TaskProgress Checklist")), X(e, _), He();
}
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-main.js
ar(["click", "input"]), fr(pi, { target: document.querySelector("#app") });
//#endregion
