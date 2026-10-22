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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 65536, ee = 1 << 21, te = 1 << 22, ne = 1 << 23, D = Symbol("$state"), re = Symbol("legacy props"), O = Symbol(""), ie = Symbol("attributes"), ae = Symbol("class"), oe = Symbol("style"), se = Symbol("text"), ce = Symbol("form reset"), le = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ue = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function de() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function fe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function me(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function he(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ge() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function _e(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ve() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ye(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function be() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function xe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Se() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ce() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var we = {}, Te = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml";
function De() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Oe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function ke() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ae() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function je(e) {
	k = e;
}
var A;
function Me(e) {
	if (e === null) throw Oe(), we;
	return A = e;
}
function Ne() {
	return Me(/* @__PURE__ */ fn(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ fn(A) !== null) throw Oe(), we;
		A = e;
	}
}
function Pe(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ fn(n);
		A = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = A;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ fn(n);
		e && n.remove(), n = i;
	}
}
function Ie(e) {
	if (!e || e.nodeType !== 8) throw Oe(), we;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Le(e) {
	return e === this.v;
}
function Re(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ze(e) {
	return !Re(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Be = !1;
function Ve() {
	Be = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var M = null;
function He(e) {
	M = e;
}
function Ue(e, t = !1, n) {
	M = {
		p: M,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: Be && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function We(e) {
	var t = M, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) wn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, M = t.p, e ?? {};
}
function Ge() {
	return !Be || M !== null && M.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], p(e);
}
function Je(e) {
	if (Ke.length === 0 && !At) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
function Ye() {
	for (; Ke.length > 0;) qe();
}
function Xe(e) {
	var t = U;
	if (t === null) return H.f |= ne, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Ze(e, t);
}
function Ze(e, t) {
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
var Qe = ~(g | _ | h);
function N(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? N(e, h) : N(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= E, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), N(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var nt = !1;
function rt(e) {
	var t = nt;
	try {
		return nt = !1, [e(), nt];
	} finally {
		nt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function it(e) {
	k && /* @__PURE__ */ dn(e) !== null && mn(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ce]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = H, n = U;
	Yn(null), Xn(null);
	try {
		return e();
	} finally {
		Yn(t), Xn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[ce];
	e[ce] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = qt(0), r;
	return () => {
		xn() && (W(n), An(() => (t === 0 && (r = G(() => e(() => Qt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ut = S | C;
function dt(e, t, n, r) {
	new ft(e, t, n, r);
}
var ft = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = k ? A : null;
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
	#h = lt(() => (this.#m = qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (k) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), k && (this.#e = A);
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
		Je(r), t && (this.#s = Mn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ae();
				return;
			}
			t = !0, n && Ce(), this.#s !== null && zn(this.#s, () => {
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
					Ze(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Mn(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = un();
			e.append(t), this.#a = this.#S(() => Mn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, zn(this.#o, () => {
				this.#o = null;
			}), this.#x(F));
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
			} else this.#x(F);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		tt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = U, n = H, r = M;
		Xn(this.#i), Yn(this.#i), He(this.#i.ctx);
		try {
			return It.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Xn(t), Yn(n), He(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Xt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), W(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		F?.is_fork ? (this.#a && F.skip_effect(this.#a), this.#o && F.skip_effect(this.#o), this.#s && F.skip_effect(this.#s), F.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (In(this.#a), null), this.#o &&= (In(this.#o), null), this.#s &&= (In(this.#s), null), k && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Mn(() => {
						var r = U;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Ze(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Ze(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Ze(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function pt(e, t, n, r) {
	let i = Ge() ? _t : P;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = mt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Ze(e, s);
			}
			ht();
		}
	}
	var d = gt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ yt(e))).then(u).catch((e) => Ze(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ht();
	}) : f();
}
function mt() {
	var e = U, t = H, n = M, r = F;
	return function(i = !0) {
		Xn(e), Yn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Xn(null), Yn(null), He(null), e && F?.deactivate();
}
function gt() {
	var e = U, t = e.b, n = F, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | g;
	return U !== null && (U.f |= C), {
		ctx: M,
		deps: null,
		effects: null,
		equals: Le,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: Te,
		wv: 0,
		parent: U,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = U;
	r === null && pe();
	var i = void 0, a = qt(Te), o = !H, s = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== le && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = F;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= ne, Xt(a, t)) : (a.f & 8388608 && (a.f ^= ne), Xt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Sn(() => {
		for (let e of s) e.reject(vt);
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
function bt(e) {
	let t = /* @__PURE__ */ _t(e);
	return Qn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = ze, t;
}
function xt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) In(t[n]);
	}
}
function St(e) {
	var t, n = U, r = e.parent;
	if (!Kn && r !== null && e.v !== Te && r.f & 24576) return De(), e.v;
	Xn(r);
	try {
		e.f &= ~E, xt(e), t = ur(e);
	} finally {
		Xn(n);
	}
	return t;
}
function Ct(e) {
	var t = St(e);
	if (!e.equals(t) && (e.wv = sr(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Dt?.capture(e, t, !0)), e.deps === null))) {
		N(e, h);
		return;
	}
	Kn || (Ot === null ? $e(e) : (xn() || F?.is_fork) && Ot.set(e, t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(le), t.ac = null;
	}), t.fn !== null && (t.teardown = d), fr(t, 0), Pn(t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Et = null, F = null, Dt = null, Ot = null, kt = null, At = !1, jt = !1, Mt = null, Nt = null, Pt = 0, Ft = 1, It = class e {
	id = Ft++;
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
		Et === null ? Et = this : (Et.#n = this, this.#t = Et), Et = this;
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
			for (var r of n.d) N(r, g), t(r);
			for (r of n.m) N(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Pt++ > 1e3 && (this.#x(), Rt());
		for (let e of this.#u) this.#d.delete(e), N(e, g), this.schedule(e);
		for (let e of this.#d) N(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Mt = [], r = [], i = Nt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ut(e), this.#h() || this.discard(), t;
		}
		if (F = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Mt = null, Nt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ht(e, t);
			i.length > 0 && F.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Dt = this, Bt(r), Bt(n), Dt = null, this.#s?.resolve();
		var s = F;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : cr(r) && (i & 16 && this.#d.add(r), pr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), N(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), F = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== Te && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Ot?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, Ot = null;
	}
	flush() {
		try {
			jt = !0, F = this, this.#g();
		} finally {
			Pt = 0, kt = null, Mt = null, Nt = null, jt = !1, F = null, Ot = null, Gt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(vt);
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
		this.#m || (this.#m = !0, Je(() => {
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
		if (F === null) {
			let t = F = new e();
			!jt && !At && Je(() => {
				t.#e || t.flush();
			});
		}
		return F;
	}
	apply() {
		Ot = null;
	}
	schedule(e) {
		if (kt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Mt !== null && t === U && (H === null || !(H.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Et = e : t.#t = e, this.linked = !1;
		}
	}
};
function Lt(e) {
	var t = At;
	At = !0;
	try {
		var n;
		for (e && (F !== null && !F.is_fork && F.flush(), n = e());;) {
			if (Ye(), F === null) return n;
			F.flush();
		}
	} finally {
		At = t;
	}
}
function Rt() {
	try {
		ve();
	} catch (e) {
		Ze(e, kt);
	}
}
var zt = null;
function Bt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && cr(r) && (zt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Rn(r), zt?.size > 0)) {
				Gt.clear();
				for (let e of zt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) zt.has(n) && (zt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
					}
				}
				zt.clear();
			}
		}
		zt = null;
	}
}
function Vt(e) {
	F.schedule(e);
}
function Ht(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, h);
		for (var n = e.first; n !== null;) Ht(n, t), n = n.next;
	}
}
function Ut(e) {
	N(e, h);
	for (var t = e.first; t !== null;) Ut(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Wt = /* @__PURE__ */ new Set(), Gt = /* @__PURE__ */ new Map(), Kt = !1;
function qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Le,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Jt(e, t) {
	let n = qt(e, t);
	return Qn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = qt(e);
	return t || (r.equals = ze), Be && n && M !== null && M.l !== null && (M.l.s ??= []).push(r), r;
}
function Yt(e, t) {
	return L(e, G(() => W(e))), t;
}
function L(e, t, n = !1) {
	return H !== null && (!Jn || H.f & 131072) && Ge() && H.f & 4325394 && (Zn === null || !Zn.has(e)) && Se(), Xt(e, n ? en(t) : t, Nt);
}
function Xt(e, t, n = null) {
	if (!e.equals(t)) {
		Gt.set(e, Kn ? t : e.v);
		var r = It.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && St(t), Ot === null && $e(t);
		}
		e.wv = sr(), $t(e, g, n), Ge() && U !== null && U.f & 1024 && !(U.f & 96) && (tr === null ? nr([e]) : tr.push(e)), !r.is_fork && Wt.size > 0 && !Kt && Zt();
	}
	return t;
}
function Zt() {
	Kt = !1;
	for (let e of Wt) {
		e.f & 1024 && N(e, _);
		let t;
		try {
			t = cr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Wt.clear();
}
function Qt(e) {
	L(e, e.v + 1);
}
function $t(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & g) === 0;
			if (l && N(s, t), c & 131072) Wt.add(s);
			else if (c & 2) {
				var u = s;
				Ot?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= E), $t(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && zt !== null && zt.add(d), n === null ? Vt(d) : n.push(d);
			}
		}
	}
}
function en(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Jt(0), u = null, d = ar, f = (e) => {
		if (ar === d) return e();
		var t = H, n = ar;
		Yn(null), or(d);
		var r = e();
		return Yn(t), or(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Jt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Jt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Jt(Te, u));
					r.set(t, e), Qt(o);
				}
			} else L(n, Te), Qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === D) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Jt(en(s ? e[n] : Te), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === Te ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = W(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== Te) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === D) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== Te || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Jt(i ? en(e[t]) : Te, u)), r.set(t, n)), W(n) === Te) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Jt(Te, u)), r.set(d + "", p)) : L(p, Te);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Jt(void 0, u)), L(c, en(n)), r.set(t, c));
			else {
				l = c.v !== Te;
				var m = f(() => en(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				Qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== Te;
			});
			for (var [n, i] of r) i.v !== Te && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			xe();
		}
	});
}
function tn(e) {
	try {
		if (typeof e == "object" && e && D in e) return e[D];
	} catch {}
	return e;
}
function nn(e, t) {
	return Object.is(tn(e), tn(t));
}
var rn, an, on, sn, cn;
function ln() {
	if (rn === void 0) {
		rn = window, an = document, on = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		sn = a(t, "firstChild").get, cn = a(t, "nextSibling").get, u(e) && (e[ae] = void 0, e[ie] = null, e[oe] = void 0, e.__e = void 0), u(n) && (n[se] = void 0);
	}
}
function un(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function dn(e) {
	return sn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function fn(e) {
	return cn.call(e);
}
function R(e, t) {
	if (!k) return /* @__PURE__ */ dn(e);
	var n = /* @__PURE__ */ dn(A);
	if (n === null) n = A.appendChild(un());
	else if (t && n.nodeType !== 3) {
		var r = un();
		return n?.before(r), Me(r), r;
	}
	return t && _n(n), Me(n), n;
}
function pn(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ dn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ fn(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = un();
			return A?.before(r), Me(r), r;
		}
		_n(A);
	}
	return A;
}
function z(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ fn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = un();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		_n(r);
	}
	return Me(r), r;
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
	U === null && (H === null && _e(e), ge()), Kn && he(e);
}
function yn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function bn(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: M,
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
	F?.register_created_effect(r);
	var i = r;
	if (e & 4) Mt === null ? It.ensure().schedule(r) : Mt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw In(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && yn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function xn() {
	return H !== null && !Jn;
}
function Sn(e) {
	let t = bn(8, null);
	return N(t, h), t.teardown = e, t;
}
function Cn(e) {
	vn("$effect");
	var t = U.f;
	if (!H && t & 32 && M !== null && !M.i) {
		var n = M;
		(n.e ??= []).push(e);
	} else return wn(e);
}
function wn(e) {
	return bn(4 | w, e);
}
function Tn(e) {
	return vn("$effect.pre"), bn(8 | w, e);
}
function En(e) {
	It.ensure();
	let t = bn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? zn(t, () => {
			In(t), n(void 0);
		}) : (In(t), n(void 0));
	});
}
function Dn(e) {
	return bn(4, e);
}
function B(e, t) {
	var n = M, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = An(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				Xn(n.parent), G(t);
			} finally {
				Xn(n);
			}
		}
	});
}
function On() {
	var e = M;
	An(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && N(n, _), cr(n) && pr(n), t.ran = !1;
		}
	});
}
function kn(e) {
	return bn(te | C, e);
}
function An(e, t = 0) {
	return bn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		bn(8, () => {
			e(...t.map(W));
		});
	});
}
function jn(e, t = 0) {
	return bn(16 | t, e);
}
function Mn(e) {
	return bn(32 | C, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Kn, n = H;
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
		e !== null && st(() => {
			e.abort(le);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Ln(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Pn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Rn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Ln(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ fn(e);
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
		e.f ^= v;
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
		e.f ^= v, e.f & 1024 || (N(e, g), It.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ fn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Wn = null, Gn = !1, Kn = !1;
function qn(e) {
	Kn = e;
}
var H = null, Jn = !1;
function Yn(e) {
	H = e;
}
var U = null;
function Xn(e) {
	U = e;
}
var Zn = null;
function Qn(e) {
	H !== null && (Zn ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (cr(a) && Ct(a), a.wv > e.wv) return !0;
		}
		t & 512 && Ot === null && N(e, h);
	}
	return !1;
}
function lr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Zn !== null && Zn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? lr(a, t, !1) : t === a && (n ? N(a, g) : a.f & 1024 && N(a, _), Vt(a));
	}
}
function ur(e) {
	var t = $n, n = er, r = tr, i = H, a = Zn, o = M, s = Jn, c = ar, l = e.f;
	$n = null, er = 0, tr = null, H = l & 96 ? null : e, Zn = null, He(e.ctx), Jn = !1, ar = ++ir, e.ac !== null && (st(() => {
		e.ac.abort(le);
	}), e.ac = null);
	try {
		e.f |= ee;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = F?.is_fork;
		if ($n !== null) {
			var m;
			if (p || fr(e, er), f !== null && er > 0) for (f.length = er + $n.length, m = 0; m < $n.length; m++) f[er + m] = $n[m];
			else e.deps = f = $n;
			if (xn() && e.f & 512) for (m = er; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && er < f.length && (fr(e, er), f.length = er);
		if (Ge() && tr !== null && !Jn && f !== null && !(e.f & 6146)) for (m = 0; m < tr.length; m++) lr(tr[m], e);
		if (i !== null && i !== e) {
			if (ir++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ir;
			if (t !== null) for (let e of t) e.rv = ir;
			tr !== null && (r === null ? r = tr : r.push(...tr));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= ee, $n = t, er = n, tr = r, H = i, Zn = a, He(o), Jn = s, ar = c;
	}
}
function dr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && ($n === null || !n.call($n, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== Te && $e(s), s.ac !== null && st(() => {
			s.ac.abort(le), s.ac = null, N(s, g);
		}), wt(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, h);
		var n = U, r = Gn;
		U = e, Gn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = ur(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = rr;
		} finally {
			Gn = r, U = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), Lt();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Wn?.add(e), H !== null && !Jn && !(U !== null && U.f & 16384) && (Zn === null || !Zn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < ir && (e.rv = ir, $n === null && r !== null && r[er] === e ? er++ : $n === null ? $n = [e] : $n.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (Kn && Gt.has(e)) return Gt.get(e);
	if (t) {
		var a = e;
		if (Kn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || gr(a)) && (o = St(a)), Gt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Jn && H !== null && (Gn || !!(H.f & 512)), c = (a.f & b) === 0;
		cr(a) && (s && (a.f |= 512), Ct(a)), s && !c && (Tt(a), hr(a));
	}
	if (Ot?.has(e)) return Ot.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tt(t), hr(t));
}
function gr(e) {
	if (e.v === Te) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Gt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function G(e) {
	var t = Jn;
	try {
		return Jn = !0, e();
	} finally {
		Jn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) _r(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && _r(n);
		}
	}
}
function _r(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			_r(e[n], t);
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
var vr = ["touchstart", "touchmove"];
function yr(e) {
	return vr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Dr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Sn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Er = null;
function Dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Er = e;
	var s = 0, c = Er === e && e[br];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[br] = t;
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
		var d = H, f = U;
		Yn(null), Xn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[br]?.[r];
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
			e[br] = t, delete e.currentTarget, Yn(d), Xn(f);
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
	var t = gn("template");
	return t.innerHTML = kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function jr(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function J(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (k) return jr(A, null), A;
		i === void 0 && (i = Ar(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ dn(i)));
		var t = r || on ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ dn(t), s = t.lastChild;
			jr(o, s);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Mr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (k) return jr(A, null), A;
		if (!o) {
			var e = /* @__PURE__ */ dn(Ar(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ dn(e);) o.appendChild(/* @__PURE__ */ dn(e));
			else o = /* @__PURE__ */ dn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ dn(t), r = t.lastChild;
			jr(n, r);
		} else jr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Nr(e, t) {
	return /* @__PURE__ */ Mr(e, t, "svg");
}
function Pr() {
	if (k) return jr(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = un();
	return e.append(t, n), jr(t, n), e;
}
function Y(e, t) {
	if (k) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = A), Ne();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[se] ??= e.nodeValue) && (e[se] = n, e.nodeValue = `${n}`);
}
function Fr(e, t) {
	return Lr(e, t);
}
var Ir = /* @__PURE__ */ new Map();
function Lr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	ln();
	var l = void 0, u = En(() => {
		var s = n ?? t.appendChild(un());
		dt(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = M;
			if (o && (n.c = o), a && (i.$$events = a), k && jr(t, null), l = e(t, i) || {}, k && (U.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw Oe(), we;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = yr(r);
					for (let e of [t, document]) {
						var a = Ir.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Ir.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(xr)), Sr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Ir.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Dr), r.delete(e), r.size === 0 && Ir.delete(n)) : r.set(e, i);
			}
			Sr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Rr.set(l, u), l;
}
var Rr = /* @__PURE__ */ new WeakMap(), zr = class {
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
						Un(r, t), t.append(un()), this.#n.set(e, {
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
		var n = F, r = hn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = un();
			i.append(a), this.#n.set(e, {
				effect: Mn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Mn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = A), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	k && (r = A, Ne());
	var i = new zr(e), a = n ? S : 0;
	function o(e, t) {
		if (k) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, je(!1), i.ensure(e, t), je(!0);
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
function Br(e, t) {
	return t;
}
function Vr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		zn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Hr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			mn(d), d.append(u), e.items.clear();
		}
		Hr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Hr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Un(a, document.createDocumentFragment())) : In(t[i], n);
	}
}
var Ur;
function Wr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = k ? Me(/* @__PURE__ */ dn(u)) : u.appendChild(un());
	}
	k && Ne();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Kr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Jr(d, null, c)) : Vn(d) : zn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			k && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = hn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (c = A, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Xt(S.v, b), S.i && Xt(S.i, y), v && u.unskip_effect(S.e)) : (S = qr(l, h ? c : Ur ??= un(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Mn(() => s(c)) : (d = Mn(() => s(Ur ??= un())), d.f |= T)), e > r.size && me("", "", ""), k && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && je(!0), W(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, k && (c = A);
}
function Gr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Kr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Gr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Vn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Jr(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (Hr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Gr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Vr(e, w, ee);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? qt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? qt(i) : null;
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
		var o = /* @__PURE__ */ fn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Yr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function Xr(e, t, n, r, i) {
	k && Ne();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Zr(e, t, n) {
	Dn(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			An(() => {
				var e = n();
				K(e), i && Re(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function Qr(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = Qr(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function $r() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Qr(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ei(e) {
	return typeof e == "object" ? $r(e) : e ?? "";
}
var ti = [..." 	\n\r\f\xA0\v﻿"];
function ni(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ti.includes(r[o - 1])) && (s === r.length || ti.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ri(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ii(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function ai(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ii)), i && c.push(...Object.keys(i).map(ii));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ii(e.substring(l, u).trim());
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
		return r && (n += ri(r)), i && (n += ri(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function oi(e, t, n, r, i, a) {
	var o = e[ae];
	if (k || o !== n || o === void 0) {
		var s = ni(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ae] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function si(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ci(e, t, n, r) {
	var i = e[oe];
	if (k || i !== t) {
		var a = ai(t, r);
		(!k || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[oe] = t;
	} else r && (Array.isArray(r) ? (si(e, n?.[0], r[0]), si(e, n?.[1], r[1], "important")) : si(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function li(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(fi(i));
		return;
	}
	for (i of t.options) if (nn(fi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
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
	}), Sn(() => {
		t.disconnect();
	});
}
function di(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), fi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && fi(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), Dn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
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
var pi = Symbol("is custom element"), mi = Symbol("is html"), hi = ue ? "link" : "LINK", gi = ue ? "progress" : "PROGRESS";
function _i(e) {
	if (k) {
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
		e[ce] = n, Je(n), ot();
	}
}
function vi(e, t) {
	var n = yi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === gi) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = yi(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === hi) || i[t] !== (i[t] = n) && (t === "loading" && (e[O] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && xi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
	return e[ie] ??= {
		[pi]: e.nodeName.includes("-"),
		[mi]: e.namespaceURI === Ee
	};
}
var bi = /* @__PURE__ */ new Map();
function xi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = bi.get(t);
	if (n) return n;
	bi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Si(e, t, n = t) {
	ct(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (k && e.defaultChecked !== e.checked || G(t) == null) && n(e.checked), An(() => {
		e.checked = !!t();
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function Ci(e, t, n) {
	var r = a(e, t);
	r && r.set && (e[t] = n, Sn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function wi(e, t) {
	return e === t || e?.[D] === t;
}
function Ti(e = {}, t, n, r) {
	var i = M.r, a = U;
	return Dn(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], G(() => {
				wi(n(...s), e) || (t(e, ...s), o && wi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && wi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Ei(e = !1) {
	let t = M, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ _t(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && Tn(() => {
		Di(t, r), p(n.b);
	}), Cn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Cn(() => {
		Di(t, r), p(n.a);
	});
}
function Di(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = D in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ye(t), f(m)));
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
	var v = !1, y = (n & 1 ? _t : P)(() => (v = !1, g()));
	o && W(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? en(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Kn && v || b.f & 16384 ? y.v : W(y);
	});
}
function Oi(e) {
	M === null && fe("onMount"), Be && M.l !== null ? Ai(M).m.push(e) : Cn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function ki(e) {
	M === null && fe("onDestroy"), Oi(() => () => G(e));
}
function Ai(e) {
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
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ve();
//#endregion
//#region viewer/assets/card-disclosure-state.js
function ji(e, t) {
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
function Mi(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region viewer/assets/editor-transaction-runtime.js
(function(e) {
	let t = (e) => structuredClone(e), n = (e) => JSON.stringify(e);
	function r(e, { derive: r = () => ({}), normalize: i = (e) => e, historyLimit: a = 100 } = {}) {
		let o, s, c, l, u = [], d = [], f = Number.isInteger(a) && a > 0 ? a : 100, p = !1, m = 1;
		function h() {
			u.length = 0, d.length = 0, p = !1;
		}
		function g() {
			return Object.freeze({
				canUndo: u.length > 0,
				canRedo: d.length > 0,
				undoDepth: u.length,
				redoDepth: d.length,
				undoCommandType: u.at(-1)?.command.type ?? null,
				redoCommandType: d.at(-1)?.command.type ?? null
			});
		}
		function _(e, i, a = "") {
			if (!e || typeof e != "object" || typeof i != "function") throw TypeError("Editor transaction 需要 command 與 reducer。");
			let o = t(c), h = t(i(t(c), e));
			if (n(o) === n(h)) return !1;
			let g = r(h, s), _ = {
				before: o,
				after: t(h),
				command: t(e),
				mergeKey: a
			}, v = u.at(-1);
			return _.id = p && a && v?.mergeKey === a ? v.id : m++, p && a && v?.mergeKey === a ? (_.before = v.before, u.pop(), n(_.before) !== n(_.after) && u.push(_)) : (u.push(_), u.length > f && u.shift()), d.length = 0, p = !0, c = h, l = g, !0;
		}
		function v(e, n, i) {
			let a = e.at(-1);
			if (!a) return !1;
			let o = t(a[i]), u = r(o, s);
			return e.pop(), n.push(a), c = o, l = u, p = !1, !0;
		}
		function y(e, n = !1) {
			let a = t(e), u = t(i(t(a))), d = t(u), f = r(u, d);
			o = a, s = d, c = u, l = f, n || h(), p = !1;
		}
		return y(e), Object.freeze({
			get draft() {
				return c;
			},
			get derived() {
				return l;
			},
			get dirty() {
				return n(c) !== n(s);
			},
			get history() {
				return g();
			},
			get historyEntries() {
				return [...u.map((e) => ({
					id: e.id,
					command: t(e.command),
					applied: !0
				})), ...[...d].reverse().map((e) => ({
					id: e.id,
					command: t(e.command),
					applied: !1
				}))];
			},
			clearHistory: h,
			apply: _,
			undo() {
				return v(u, d, "before");
			},
			redo() {
				return v(d, u, "after");
			},
			discard() {
				y(o);
			},
			commit(e, { keepHistory: t = !1 } = {}) {
				y(e, t);
			}
		});
	}
	e.TaskProgressEditorTransactionRuntime = Object.freeze({ createEditorTransaction: r });
})(globalThis);
//#endregion
//#region viewer/assets/editor-transaction.js
var { createEditorTransaction: Ni } = globalThis.TaskProgressEditorTransactionRuntime, Pi = "__default__";
function Fi(e) {
	return [...new Set(e)];
}
function Ii(e = []) {
	let t = Fi(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Li(e, t, n, r = t) {
	let i = Ii(t), a = Object.freeze({
		tags: i.tags,
		selected: new Set(r.filter((e) => i.tags.includes(e)))
	});
	if (!e) return a;
	try {
		let t = JSON.parse((n ?? globalThis.sessionStorage).getItem(e));
		return !Array.isArray(t) || !t.every((e) => typeof e == "string") ? a : Object.freeze({
			tags: a.tags,
			selected: new Set(t.filter((e) => a.tags.includes(e)))
		});
	} catch {
		return a;
	}
}
function Ri(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function zi(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function Bi(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Vi(e) {
	let t = zi(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
function Hi(e = []) {
	let t = e.indexOf(Pi);
	return t === -1 ? [...e] : e.slice(0, t);
}
//#endregion
//#region viewer/assets/capsule-order.js
function Ui(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Wi(e, t, n) {
	if (!e) return Ui(null, n);
	try {
		return Ui(JSON.parse(e.getItem(t) ?? "null"), n);
	} catch {
		return Ui(null, n);
	}
}
function Gi(e, t, n) {
	if (!e) return !1;
	try {
		return e.setItem(t, JSON.stringify(n)), !0;
	} catch {
		return !1;
	}
}
function Ki(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/status-order.js
function qi(e, t, n = (e) => e.status) {
	let r = new Map(t.map((e, t) => [e, t]));
	return [...e].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, i) => (r.get(n(e.item)) ?? t.length) - (r.get(n(i.item)) ?? t.length) || e.index - i.index).map(({ item: e }) => e);
}
Object.freeze({
	planned: "pending_items",
	done: "completed_items"
});
function Ji(e, t, n = (e) => e.status, r = (e) => e) {
	if (t.length === 0) return r([...e]);
	let i = [], a = [];
	for (let r of e) (t.includes(n(r)) ? i : a).push(r);
	return [...qi(r(i), t, n), ...r(a)];
}
//#endregion
//#region viewer/assets/checklist-editor.js
function Yi(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function Xi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function Zi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = Xi(e), e.progress = {
			passed: e.checks.filter((e) => e.status === "passed").length,
			total: e.checks.length
		};
	}), t;
}
function Qi(e, t) {
	return (e.dependsOn ?? []).some((e) => Xi(t.get(e) ?? { checks: [] }) !== "passed");
}
function $i(e) {
	let t = e?.items ?? [], n = new Map(t.map((e) => [e.id, e])), r = [], i = {
		total: 0,
		passed: 0,
		failed: 0,
		pending: 0
	}, a = {
		total: t.length,
		passed: 0,
		failed: 0,
		pending: 0
	}, o = null, s = null;
	return t.forEach((e) => {
		a[Xi(e)] += 1;
		let t = Qi(e, n);
		e.checks.forEach((n) => {
			i.total += 1, i[n.status] = (i[n.status] ?? 0) + 1, r.push(n.status);
			let a = {
				workItemId: e.id,
				checkIndex: n.index,
				itemTitle: e.title,
				title: n.title,
				action: n.action,
				expect: n.expect,
				isManual: n.isManual,
				isAcceptance: !!n.isAcceptance
			};
			n.status === "failed" && !o && (o = a), n.status === "pending" && !t && !s && (s = a);
		});
	}), Object.freeze({
		items: Object.freeze(a),
		checks: Object.freeze(i),
		cells: Object.freeze(r),
		nextStep: o ?? s ?? null
	});
}
var ea = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
}, ta = Object.freeze(["implementation", "condition"]);
function na(e) {
	return !!(e?.isManual || e?.isAcceptance);
}
function ra(e, t) {
	let n = (e?.items ?? []).flatMap((e) => e.checks ?? []), r = n.filter((e) => !na(e)).every((e) => e.status === "passed"), i = n.filter((e) => e.isAcceptance).every((e) => e.status === "passed" && (e.validity ?? "valid") === "valid");
	return t?.isAcceptance && !r || t?.isManual && !r ? "等執行者的檢查全部完成" : t?.isManual && !i ? "等他驗全部通過" : null;
}
function ia(e, t) {
	let { item: n, check: r } = Yi(e, t.workItemId, t.checkIndex);
	if (!na(r)) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let n = t.type === "cycle-result" ? ea[r.status] ?? "pending" : t.status;
		if (![
			"pending",
			"passed",
			"failed"
		].includes(n)) throw Error("不支援的檢查狀態。");
		let i = n === "pending" ? null : ra(e, r);
		if (i) throw Error(`「${r.title}」還不能記錄：${i}。`);
		r.status = n, n === "failed" ? r.isAcceptance && (r.rejectReason = r.rejectReason ?? "implementation") : (r.observed = null, r.resolved = null, r.rejectReason = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else if (t.type === "set-reason") {
		if (!r.isAcceptance || r.status !== "failed") throw Error("只有不通過的 [acceptance] 可以選擇原因。");
		if (!ta.includes(t.value)) throw Error("原因只能是實作不符或條件不符。");
		r.rejectReason = t.value;
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = Xi(n), e;
}
function aa(e) {
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter(na)
		})).filter((e) => e.checks.length > 0)
	};
}
function oa(e) {
	let t = Zi(e);
	return delete t.revision, t;
}
var sa = Object.freeze({ status: Object.freeze([
	"pending",
	"passed",
	"failed"
]) });
function ca(e, t) {
	let n = new Set(t ?? []);
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => n.has(e.status))
		})).filter((e) => e.checks.length > 0)
	};
}
function la(e, t = []) {
	let n = Hi(t).filter((e) => sa.status.includes(e));
	return n.length === 0 ? e : {
		...e,
		items: Ji(e.items, n, Xi)
	};
}
function ua(e) {
	let t = e.items.flatMap((e) => e.checks);
	return sa.status.map((e) => ({
		id: e,
		count: t.filter((t) => t.status === e).length
	}));
}
function da(e) {
	let t = structuredClone(e);
	return t.items?.forEach((e) => e.checks?.forEach((e) => {
		e.status = e.effectiveStatus ?? e.status;
	})), t;
}
function fa(e, t = {}) {
	let n = da(e), r = structuredClone(n), i = Ni(n, {
		normalize: oa,
		derive: Zi,
		historyLimit: t.historyLimit
	});
	function a() {
		let e = structuredClone(i.derived);
		return e.revision = r.revision, Object.freeze({
			document: e,
			summary: $i(e),
			dirty: i.dirty,
			history: i.history
		});
	}
	function o(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return i.apply(e, ia, t), a();
	}
	function s() {
		let e = [], t = [];
		return i.derived.items.forEach((n) => n.checks.forEach((i) => {
			if (!na(i)) return;
			let a = String(i.observed ?? "").trim(), o = Yi(r, n.id, i.index).check, s = String(o.observed ?? "").trim();
			if (i.status === o.status && a === s && (i.rejectReason ?? null) === (o.rejectReason ?? null)) return;
			if (i.status === "failed" && !a) {
				t.push({
					code: "observed_required",
					workItemId: n.id,
					checkIndex: i.index,
					message: `「${i.title}」失敗時必須填寫 Observed。`
				});
				return;
			}
			let c = {
				workItemId: n.id,
				checkIndex: i.index,
				status: i.status,
				observed: i.status === "failed" ? a : null
			};
			i.isAcceptance && i.status === "failed" && (c.reason = i.rejectReason ?? "implementation"), e.push(c);
		})), i.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的實機檢查結果。"
		}), Object.freeze({
			revision: r.revision,
			results: e,
			errors: t
		});
	}
	return Object.freeze({
		snapshot: a,
		dispatch: o,
		prepareSave: s,
		undo() {
			return i.undo(), a();
		},
		redo() {
			return i.redo(), a();
		},
		discard() {
			return i.discard(), a();
		},
		commit(e) {
			let t = da(e);
			return i.commit(t, { keepHistory: !0 }), r = t, a();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var pa = "task-progress.cautious-mode.v1", ma = "自動儲存模式。", ha = "謹慎模式：修改後需按儲存。", ga = "有尚未儲存的變更。", _a = "即將自動儲存…", va = "正在寫入…", ya = "已儲存。", ba = "已放棄尚未儲存的變更。", xa = "沒有需要儲存的變更。", Sa = "儲存失敗。", Ca = "已取消儲存；草稿仍保留。", wa = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function Ta(e = globalThis.localStorage) {
	try {
		return e?.getItem(pa) === "true";
	} catch {
		return !1;
	}
}
function Ea(e, t) {
	let n = t === !0;
	try {
		e?.setItem(pa, n ? "true" : "false");
	} catch {}
	return n;
}
function Da({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, confirmSave: a = null, timers: o = globalThis, onChange: s = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let c = Ta(n), l = "idle", u = c ? ha : ma, d = !1, f = null, p = Promise.resolve(), m = 0, h = () => e.snapshot();
	function g() {
		let e = h();
		return Object.freeze({
			...e,
			mode: c ? "cautious" : "auto",
			cautious: c,
			status: l,
			message: u,
			blocked: d,
			saving: l === "saving",
			pending: f !== null || m > 0
		});
	}
	function _() {
		s(g());
	}
	function v(e, t) {
		l = e, u = t;
	}
	function y() {
		f !== null && (o.clearTimeout(f), f = null);
	}
	async function b(n) {
		if (d && !n) return;
		if (!h().dirty) {
			n && (v("idle", xa), _());
			return;
		}
		let r = e.prepareSave(), i = Array.isArray(r.errors) ? r.errors : [];
		if (i.length) {
			v("incomplete", i[0].message), _();
			return;
		}
		let { errors: o, ...s } = r;
		if (typeof a == "function" && await a(s, { manual: n }) === !1) {
			v("cancelled", Ca), _();
			return;
		}
		d = !1, v("saving", va), _();
		try {
			let n = await t(s);
			e.commit(n), v("saved", ya);
		} catch (e) {
			d = !0, v(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Sa);
		}
		_();
	}
	function x(e = !1) {
		return y(), m += 1, p = p.then(() => b(e)).catch((e) => {
			d = !0, v("error", e?.message ?? Sa), _();
		}).finally(() => {
			--m, _();
		}), p;
	}
	async function S() {
		for (let e = 0; e < 8; e += 1) if (f !== null && x(), await p, f === null && m === 0) return;
	}
	function C(e) {
		return c ? (d || v("draft", ga), null) : d ? null : e ? (y(), v("pending", _a), f = o.setTimeout(() => {
			f = null, x();
		}, r), null) : x();
	}
	function w(e) {
		let t = C(e);
		return _(), t;
	}
	async function T(e) {
		let t = e === !0;
		if (t === c) return g();
		if (t) await S(), c = !0;
		else {
			if (h().dirty) return v("mode_blocked", wa), _(), g();
			c = !1;
		}
		return Ea(n, c), d || v("idle", c ? ha : ma), _(), g();
	}
	return Object.freeze({
		snapshot: g,
		dispatch(t) {
			return e.dispatch(t) === !1 ? (_(), null) : w(i(t) === !0);
		},
		changed(e = {}) {
			return w(i(e) === !0);
		},
		undo() {
			return e.undo(), w(!1);
		},
		redo() {
			return e.redo(), w(!1);
		},
		discard() {
			return y(), e.discard(), d = !1, v("idle", ba), _(), g();
		},
		save() {
			return x(!0);
		},
		flush: S,
		setCautious: T
	});
}
//#endregion
//#region viewer/assets/checklist-filter-order.js
var Oa = "task-progress.checklist-filter-order.v1";
function ka({ supportedIds: e, storage: t = globalThis.localStorage ?? null } = {}) {
	let n = Wi(t, Oa, e);
	return {
		get order() {
			return n;
		},
		move(e, r, i = !1) {
			let a = Ki(n, e, r, i);
			return a.join("\0") === n.join("\0") ? n : (n = a, Gi(t, Oa, n), n);
		}
	};
}
//#endregion
//#region viewer/assets/theme-model.js
var Aa = "task-progress.theme.v1", ja = [
	"system",
	"light",
	"dark",
	"custom"
], Ma = [
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
], Na = Object.freeze({
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
}), Pa = Object.freeze({
	version: 1,
	mode: "system"
}), Fa = /^#[0-9a-f]{6}$/i;
function Ia(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function La(e) {
	return typeof e == "string" && Fa.test(e);
}
function Ra(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Na[n], i = { base: n };
	for (let e of Ma) {
		let n = t[e.key];
		i[e.key] = La(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function za(e) {
	if (!Ia(e) || e.version !== 1 || !ja.includes(e.mode)) return { ...Pa };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Ia(e.custom) ? t.custom = Ra(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Ra()), t;
}
function Ba(e) {
	try {
		let t = e?.getItem(Aa);
		return t ? za(JSON.parse(t)) : { ...Pa };
	} catch {
		return { ...Pa };
	}
}
function Va(e, t) {
	let n = za(t);
	try {
		e?.setItem(Aa, JSON.stringify(n));
	} catch {}
	return n;
}
function Ha(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Ua(e, t) {
	let n = za(t);
	e.dataset.theme = n.mode;
	for (let t of Ma) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Ra();
		e.dataset.themeBase = t.base;
		for (let n of Ma) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Wa(e, t, n = "light") {
	let r = za(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Ra(n)), za(i);
}
function Ga(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Ka(e, t) {
	if (!La(e) || !La(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ga(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function qa(e) {
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
	].filter(([, e, t]) => Ka(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function Ja({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Ba(t);
	e && Ua(e, r);
	function i(n) {
		return r = Va(t, n), e && Ua(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ha(n);
		},
		setMode(e) {
			return i(Wa(r, e, Ha(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Ra(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var Ya = /* @__PURE__ */ Nr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), Xa = /* @__PURE__ */ Nr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), Za = /* @__PURE__ */ Nr("<path d=\"M3 3l18 18\"></path>"), Qa = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function $a(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = Qa(), a = R(i), o = (e) => {
		Y(e, Ya());
	}, s = (e) => {
		var t = Xa();
		Pe(), Y(e, t);
	};
	Z(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		Y(e, Za());
	};
	Z(c, (e) => {
		r() && e(l);
	}), j(i), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var eo = /* @__PURE__ */ J("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), to = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function no(e, t) {
	Ue(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Ei();
	var l = to(), u = pn(l);
	let d;
	var f = R(u), p = R(f), m = R(p, !0);
	j(p), j(f);
	var h = z(f, 2), g = (e) => {
		var t = eo(), n = R(t);
		{
			let e = /* @__PURE__ */ P(() => !r());
			$a(n, { get closed() {
				return W(e);
			} });
		}
		j(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), q("click", t, () => i()(!r())), Y(e, t);
	};
	Z(h, (e) => {
		n() && e(g);
	}), Xr(z(h, 2), t, "header", {}, null), j(u);
	var _ = z(u, 2);
	Xr(R(_), t, "default", {}, null), j(_), V(() => {
		d = oi(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), X(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), q("click", f, () => c()(!a())), Y(e, l), We();
}
Tr(["click"]);
//#endregion
//#region viewer/assets/icon-choice.js
function ro(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function io(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var ao = /* @__PURE__ */ J("<button type=\"button\" tabindex=\"-1\"><!></button>"), oo = /* @__PURE__ */ J("<div role=\"group\"></div>"), so = /* @__PURE__ */ J("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function co(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1), _ = /* @__PURE__ */ I(!1), v = /* @__PURE__ */ I(null), y = /* @__PURE__ */ I(0), b = /* @__PURE__ */ I(0), x = /* @__PURE__ */ I(!1), S = /* @__PURE__ */ I(null), C = 0;
	function w(e = !1) {
		clearTimeout(W(m)), C++, W(S) !== null && W(f)?.hasPointerCapture(W(S)) && W(f).releasePointerCapture(W(S)), L(S, null), L(h, !1), L(g, !1), L(v, null), L(x, !1), e && W(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function E(e = !1) {
		if (!W(r).length) return;
		L(h, !0), L(x, !1);
		let t = ++C;
		if (await mr(), !W(h) || t !== C || !W(p)) return;
		let n = W(f).getBoundingClientRect(), i = W(p).getBoundingClientRect(), o = [...W(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (L(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), L(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (L(y, n.right + 4), W(y) + i.width > window.innerWidth - 4 && L(y, n.left - i.width - 4), L(b, n.top + (n.height - i.height) / 2)) : (L(y, n.left + (n.width - i.width) / 2), L(b, n.bottom + 4), W(b) + i.height > window.innerHeight - 4 && L(b, n.top - i.height - 4)), L(y, Math.max(4, Math.min(W(y), window.innerWidth - i.width - 4))), L(b, Math.max(4, Math.min(W(b), window.innerHeight - i.height - 4))), L(x, !0), await mr(), e && W(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function ee(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && W(p)?.contains(t) ? t.dataset.choice : null;
	}
	function te(e) {
		if (clearTimeout(W(m)), W(S) !== null) {
			if (W(g)) {
				let t = ee(e);
				L(_, !0), t === null ? w(!0) : T(W(r).find((e) => String(e.id) === t).id);
			} else {
				let t = W(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (L(_, !0), w(!0));
			}
			L(S, null);
		}
	}
	function ne(e) {
		if (["Enter", " "].includes(e.key) && W(S) === null && L(_, !1), e.key === "Tab" && W(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(W(h) || W(S) !== null) && (e.preventDefault(), L(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !W(h)) {
			E(!0);
			return;
		}
		let n = [...W(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function D() {
		W(S) !== null && L(_, !0), w(W(d)?.contains(document.activeElement));
	}
	ki(() => clearTimeout(W(m))), B(() => (K(i()), K(a())), () => {
		L(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (K(i()), K(a()), K(l())), () => {
		L(r, io(i(), a(), l()));
	}), On(), Ei();
	var re = so();
	wr("pointerdown", rn, (e) => {
		W(d)?.contains(e.target) || w();
	}), wr("resize", rn, D), wr("blur", rn, D), wr("scroll", an, (e) => {
		W(p)?.contains(e.target) || D();
	}, !0);
	var O = R(re);
	let ie;
	Xr(R(O), t, "icon", { get item() {
		return W(n);
	} }, null), j(O), Ti(O, (e) => L(f, e), () => W(f));
	var ae = z(O, 2), oe = (e) => {
		var n = oo();
		let i, s;
		Wr(n, 5, () => W(r), (e) => e.id, (e, n) => {
			var r = ao();
			let i;
			Xr(R(r), t, "icon", { get item() {
				return W(n);
			} }, null), j(r), V((e) => {
				i = oi(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (W(n), G(() => W(n).id))), Q(r, "aria-label", (W(n), G(() => W(n).label))), Q(r, "title", (W(n), G(() => W(n).label))), Q(r, "aria-pressed", (W(n), K(a()), G(() => W(n).kind === "action" ? void 0 : W(n).id === a())));
			}, [() => ({ "icon-choice-hover": W(v) === String(W(n).id) })]), q("keydown", r, ne), q("click", r, () => T(W(n).id)), Y(e, r);
		}), j(n), Ti(n, (e) => L(p, e), () => W(p)), V(() => {
			i = oi(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = ci(n, "", s, {
				left: `${W(y)}px`,
				top: `${W(b)}px`,
				visibility: W(x) ? "visible" : "hidden"
			});
		}), Y(e, n);
	};
	Z(ae, (e) => {
		W(h) && e(oe);
	}), j(re), Ti(re, (e) => L(d, e), () => W(d)), V(() => {
		Q(re, "aria-label", o()), Q(O, "aria-label", (K(o()), W(n), G(() => `${o()}：${W(n)?.label ?? ""}`))), Q(O, "aria-expanded", s() === "cycle" ? void 0 : W(h)), Q(O, "title", (K(o()), W(n), K(s()), G(() => `${o()}：${W(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), O.disabled = !W(n), ie = ci(O, "", ie, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), q("focusout", re, (e) => {
		W(d).contains(e.relatedTarget) || w();
	}), q("keydown", O, ne), q("pointerdown", O, (e) => {
		e.button === 0 && (L(_, !1), !(s() === "cycle" || W(h)) && (L(S, e.pointerId), W(f).setPointerCapture(W(S)), clearTimeout(W(m)), L(m, setTimeout(() => {
			L(g, !0), E();
		}, 300))));
	}), q("pointermove", O, (e) => {
		W(g) && L(v, ee(e));
	}), q("pointerup", O, te), wr("pointercancel", O, D), q("click", O, () => {
		if (W(_)) {
			L(_, !1);
			return;
		}
		if (W(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") E(!0);
		else {
			let e = ro(i(), a());
			e !== void 0 && u()(e);
		}
	}), Y(e, re), We();
}
Tr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var lo = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function uo(e, t) {
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
	co(e, {
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
			let n = /* @__PURE__ */ P(() => t.item);
			var r = Pr(), i = pn(r), a = (e) => {
				Y(e, lo());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "closed"))), r = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "disabled")));
					$a(e, {
						get closed() {
							return W(t);
						},
						get disabled() {
							return W(r);
						}
					});
				}
			};
			Z(i, (e) => {
				K(W(n)), G(() => W(n)?.id === "reset") ? e(a) : e(o, -1);
			}), Y(e, r);
		} }
	});
}
//#endregion
//#region viewer/assets/card-visibility.js
function fo(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function po(e, t, n) {
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
//#region viewer/assets/card-order.js
function mo(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function ho(e, t, n, r = []) {
	let i = n === "free" ? go(e, t) : n === "reverse" ? [...e].reverse() : e;
	if (!r.length) return i;
	let a = new Map(e.map((e) => [e.id, e])), o = new Set(r);
	return [...o].filter((e) => a.has(e)).map((e) => a.get(e)).concat(i.filter((e) => !o.has(e.id)));
}
function go(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function _o(e, t, n, r, i, a) {
	let o = Ui(t, e), s = new Set(n), c = Ki(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var vo = /* @__PURE__ */ Nr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), yo = /* @__PURE__ */ Nr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), bo = /* @__PURE__ */ Nr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), xo = /* @__PURE__ */ J("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), So = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), Co = /* @__PURE__ */ J("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div>", 1);
function wo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null);
	function f(e = o()) {
		return ho(e, W(E), W(_), l() ? W(p) : []).map((e) => e.id);
	}
	let p = /* @__PURE__ */ I([]), m = null, h = $(t, "expanded", 8, !0), g = $(t, "onToggleAll", 8, () => {}), _ = /* @__PURE__ */ I("forward"), v = [
		"forward",
		"reverse",
		"free"
	], y = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, b = /* @__PURE__ */ I("disabled"), x = /* @__PURE__ */ I([]);
	function S() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: W(b),
				hiddenIds: W(x)
			}));
		} catch {}
	}
	function C(e) {
		let t = po(W(b), W(x), e);
		L(b, t.mode), L(x, t.hiddenIds), fe(), S();
	}
	function w(e, t) {
		L(x, t ? W(x).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...W(x), e])]), fe(), S();
	}
	function T(e) {
		W(b) === "closed" && L(b, "enabled"), w(e, !0);
	}
	let E = /* @__PURE__ */ I(null), ee = /* @__PURE__ */ I(null), te = /* @__PURE__ */ I(null), ne = /* @__PURE__ */ I(null), D = /* @__PURE__ */ I(null), re = /* @__PURE__ */ I(), O = /* @__PURE__ */ I("");
	function ie(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (m !== i) {
			if (m = i, !n.includes(e)) {
				L(O, `找不到卡片 ID：${e}`);
				return;
			}
			L(p, mo(W(p), e)), T(e), ae();
		}
	}
	function ae() {
		if (!c()) {
			L(O, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(W(p))), L(O, "已記住本機釘選");
		} catch {
			L(O, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function oe(e) {
		fe(), L(p, W(p).includes(e) ? W(p).filter((t) => t !== e) : mo(W(p), e)), ae();
	}
	function se(e) {
		if (m = null, L(p, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			L(p, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (L(b, "disabled"), L(x, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			L(b, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), L(x, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (L(ee, null), L(te, null), L(ne, null), L(D, null), !e) {
			L(E, null), L(_, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			L(E, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			L(_, v.includes(n) ? n : W(E) ? "free" : "forward");
		} catch {
			L(E, null), L(_, "forward");
		}
	}
	function ce(e) {
		if (L(E, e), !c()) {
			L(O, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), L(O, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			L(O, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function le(e) {
		if (fe(), L(_, e), L(O, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, W(_));
		} catch {
			L(O, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function ue(e, t, n) {
		W(_) === "free" && (l() && (W(p).includes(e) || W(p).includes(t)) || e !== t && (ce(_o(s(), W(E), W(r).map((e) => e.id), e, t, n)), L(ee, e), await mr(), [...W(re).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function de(e, t) {
		let n = W(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = W(r)[n + t];
		i && ue(e, i.id, t > 0);
	}
	function fe() {
		L(te, null), L(ne, null), L(D, null);
	}
	function pe(e, t) {
		if (l() && W(p).includes(e.id) || W(ne) === null || W(ne) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		L(D, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => W(b), () => {
		L(n, W(b) === "enabled");
	}), B(() => (K(o()), W(E), W(_), K(l()), W(p), K(d())), () => {
		L(i, go(ho(o(), W(E), W(_), l() ? W(p) : []), d()));
	}), B(() => (W(i), W(b), W(x), K(l()), W(p)), () => {
		L(r, W(i).filter((e) => fo(e.id, W(b), W(x)) && !(l() && W(p).includes(e.id))));
	}), B(() => K(c()), () => {
		se(c());
	}), B(() => (W(i), W(b), W(x)), () => {
		L(a, W(i).find((e) => fo(e.id, W(b), W(x)))?.id ?? null);
	}), B(() => (K(u()), K(c()), K(s()), K(l())), () => {
		ie(u(), c(), s(), l());
	}), On();
	var me = {
		orderedIds: f,
		revealCard: T
	};
	Ei();
	var he = Co(), ge = pn(he), _e = R(ge);
	Xr(z(R(_e), 2), t, "filters", {}, null), j(_e);
	var ve = z(_e, 2), ye = R(ve), be = R(ye), xe = R(be);
	j(be), j(ye);
	var Se = z(ye, 2);
	{
		let e = /* @__PURE__ */ P(() => G(() => v.map((e) => ({
			id: e,
			label: y[e]
		}))));
		co(Se, {
			get items() {
				return W(e);
			},
			get value() {
				return W(_);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: le,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ P(() => t.item);
				var r = bo(), i = R(r), a = (e) => {
					Y(e, vo());
				}, o = (e) => {
					var t = yo(), r = pn(t), i = z(r);
					V(() => {
						Q(r, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), Y(e, t);
				};
				Z(i, (e) => {
					K(W(n)), G(() => W(n).id === "free") ? e(a) : e(o, -1);
				}), j(r), Y(e, r);
			} }
		});
	}
	var Ce = z(Se, 2);
	uo(Ce, {
		get mode() {
			return W(b);
		},
		onChoose: C
	});
	var we = z(Ce, 2), Te = R(we, !0);
	j(we), Xr(z(we, 2), t, "tools", {}, null), j(ve), j(ge);
	var Ee = z(ge, 2);
	return Wr(Ee, 5, () => W(i), (e) => e.id, (e, r) => {
		var i = So();
		let o;
		var s = R(i), c = (e) => {
			var t = xo();
			let n;
			var i = R(t), a = R(i);
			j(i), j(t), V((e, r, i, o, s) => {
				n = oi(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({ "is-pinned": W(p).includes(W(r).id) }),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? `取消釘選：${W(r).title}` : `釘選置頂：${W(r).title}`)),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id))),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? "取消釘選" : "釘選置頂")),
				() => (W(p), W(r), G(() => W(p).includes(W(r).id) ? "currentColor" : "none"))
			]), q("click", t, () => oe(W(r).id)), Y(e, t);
		};
		Z(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(x), W(r), G(() => !W(x).includes(W(r).id))));
			Xr(u, t, "default", {
				get item() {
					return W(r);
				},
				get lead() {
					return W(r), W(a), G(() => W(r).id === W(a));
				},
				get visibilityEnabled() {
					return W(n);
				},
				get visible() {
					return W(e);
				},
				onVisibleChange: (e) => w(W(r).id, e)
			}, null);
		}
		j(i), V((e) => {
			Q(i, "hidden", e), o = oi(i, 1, "arrangeable-card", null, o, {
				"card-selected": W(ee) === W(r).id,
				"card-drop-before": W(D)?.id === W(r).id && !W(D).after,
				"card-drop-after": W(D)?.id === W(r).id && W(D).after
			}), Q(i, "aria-label", (W(r), W(ee), G(() => `${W(r).title}${W(ee) === W(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (W(r), G(() => W(r).id))), Q(i, "draggable", (W(_), W(te), W(r), G(() => W(_) === "free" && W(te) === W(r).id)));
		}, [() => (K(fo), W(r), W(b), W(x), G(() => !fo(W(r).id, W(b), W(x))))]), q("pointerdown", i, (e) => {
			L(te, null), e.button === 0 && (L(ee, W(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (W(_) !== "free" || e.pointerType !== "mouse" || l() && W(p).includes(W(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || L(te, W(r).id)));
		}), q("focusin", i, () => {
			L(ee, W(r).id);
		}), q("input", i, () => {
			L(ee, W(r).id);
		}), q("pointerup", i, () => {
			L(te, null);
		}), q("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), L(ee, W(r).id)) : e.key === "Escape" && L(ee, null), W(_) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), de(W(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), wr("dragstart", i, (e) => {
			W(_) === "free" && W(te) === W(r).id && e.target === e.currentTarget && (L(ne, W(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(r).id)));
		}), wr("dragend", i, fe), wr("dragover", i, (e) => pe(W(r), e)), wr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(D, null);
		}), wr("drop", i, (e) => {
			W(ne) !== null && W(D)?.id === W(r).id && (e.preventDefault(), ue(W(ne), W(r).id, W(D).after), fe());
		}), Y(e, i);
	}), j(Ee), Ti(Ee, (e) => L(re, e), () => W(re)), V(() => {
		Q(ye, "aria-label", h() ? "全部收合" : "全部展開"), Q(ye, "title", h() ? "全部收合" : "全部展開"), Q(xe, "d", h() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), X(Te, W(O));
	}), q("click", ye, () => g()(!h())), Y(e, he), Ci(t, "orderedIds", f), Ci(t, "revealCard", T), We(me);
}
Tr([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region viewer/assets/focus-shield.js
function To({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, now: n = () => Date.now(), activationWindowMs: r = 100, storage: i, key: a = `taskprogress.mouse-activation.v2:${e.location?.pathname ?? ""}` } = {}) {
	let o = () => t.visibilityState !== "hidden" && t.hasFocus(), s = !o(), c = -Infinity, l = !1, u = !1;
	try {
		let e = Number((i ?? globalThis.sessionStorage).getItem(a));
		o() && e > n() && e <= n() + r && (c = e - r);
	} catch {}
	let d = () => {
		c = -Infinity;
		try {
			(i ?? globalThis.sessionStorage).removeItem(a);
		} catch {}
	}, f = () => {
		s = !0, d(), l = !1, u = !1;
	}, p = () => {
		if (!(!o() || !s)) {
			s = !1, c = n();
			try {
				(i ?? globalThis.sessionStorage).setItem(a, String(c + r));
			} catch {}
		}
	}, m = () => {
		t.visibilityState === "hidden" ? f() : p();
	}, h = (e) => {
		e.preventDefault(), e.stopImmediatePropagation();
	}, g = () => {
		d();
	};
	function _(e) {
		if (e.type === "pointerdown" && (u = e.pointerType && e.pointerType !== "mouse"), u || e.pointerType && e.pointerType !== "mouse") {
			(e.type === "click" || e.type === "pointercancel") && (u = !1);
			return;
		}
		if (e.type === "click" && e.detail === 0) return;
		let t = e.type === "pointerdown" || e.type === "mousedown", i = s || !o() || n() - c < r;
		t && (e.type === "pointerdown" || !l) && (l = i), !t && i && [
			"mouseup",
			"click",
			"auxclick"
		].includes(e.type) && (l = !0), l && (h(e), (e.type === "click" || e.type === "auxclick" || e.type === "pointercancel") && (l = !1, d()));
	}
	let v = [
		"pointerdown",
		"pointerup",
		"pointercancel",
		"mousedown",
		"mouseup",
		"click",
		"auxclick"
	];
	e.addEventListener("blur", f), e.addEventListener("focus", p), e.addEventListener("keydown", g, { capture: !0 }), t.addEventListener("visibilitychange", m);
	for (let t of v) e.addEventListener(t, _, { capture: !0 });
	return () => {
		e.removeEventListener("blur", f), e.removeEventListener("focus", p), e.removeEventListener("keydown", g, { capture: !0 }), t.removeEventListener("visibilitychange", m);
		for (let t of v) e.removeEventListener(t, _, { capture: !0 });
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/FocusShield.svelte
function Eo(e, t) {
	Ue(t, !1), Oi(() => To()), Ei(), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var Do = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function Oo(e, t) {
	Ue(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ I(), d = null, f = !1;
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
		W(u)?.close(), m();
	}
	function g(e) {
		e.target === e.currentTarget && h();
	}
	Ei();
	var _ = Pr(), v = pn(_), y = (e) => {
		var n = Do(), l = R(n), d = R(l), f = R(d), _ = R(f, !0);
		j(f);
		var v = z(f, 2), y = R(v, !0);
		j(v), j(d);
		var b = z(d, 2);
		j(l), Xr(z(l, 2), t, "default", { close: h }, null), j(n), Ti(n, (e) => L(u, e), () => W(u)), Zr(n, (e) => p?.(e)), V(() => {
			oi(n, 1, ei(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), wr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), We();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var ko = /* @__PURE__ */ J("<span></span>"), Ao = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), jo = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), Mo = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function No(e, t) {
	Ue(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await mr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		L(s, null), L(c, null);
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
		L(d, r), o()(e, t, n);
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
		L(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!W(s) || e.id === W(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", L(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || W(c)?.id === e.id && L(c, null);
	}
	function T(e, t) {
		if (!W(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = W(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function E() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function ee(e, t) {
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
			u.active = !0, l = !0, L(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, L(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), L(c, {
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
	B(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), On(), Ei();
	var D = Mo();
	Wr(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = jo(), i = R(r), a = R(i, !0);
		j(i);
		var o = z(i, 2), l = (e) => {
			var n = ko();
			V(() => oi(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			Y(e, Ao());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), j(r), V((e) => {
			oi(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), wr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), wr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), wr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), wr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), wr("dragend", r, function(...e) {
			(W(n) ? E : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => ee(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), wr("pointercancel", r, function(...e) {
			(W(n) ? ne : null)?.apply(this, e);
		}), Y(e, r);
	}), j(D), Ti(D, (e) => L(f, e), () => W(f)), V(() => {
		oi(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), Y(e, D), We();
}
Tr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Po(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	B(() => (K(u()), K(p()), K(l())), () => {
		L(n, {
			id: Pi,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), B(() => K(o()), () => {
		L(r, new Map(o().map((e) => [e.id, e])));
	}), B(() => (K(s()), K(o())), () => {
		L(i, s().length > 0 ? s() : [Pi, ...o().map((e) => e.id)]);
	}), B(() => (W(i), W(n), W(r), K(c()), K(p())), () => {
		L(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e, c(), p())));
	}), On(), Ei();
	{
		let t = /* @__PURE__ */ P(() => `filter-strip ${f()}`);
		No(e, {
			get items() {
				return W(a);
			},
			get className() {
				return W(t);
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
	We();
}
//#endregion
//#region viewer/assets/inline-links.js
function Fo(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function Io(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = Fo(t.slice(r.lastIndex, e - 1));
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
function Lo(e, t, { emphasis: n = !1 } = {}) {
	let r = e.createElement("a");
	return r.className = n ? "inline-link inline-link--emphasis" : "inline-link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text, r;
}
function Ro(e, t, n = {}) {
	let r = e.ownerDocument;
	e.replaceChildren(...Io(t).map((e) => e.href ? Lo(r, e, n) : r.createTextNode(e.text)));
}
function zo(e, t = {}) {
	let n = null;
	function r(t = {}) {
		let r = String(t.text ?? ""), i = t.emphasis === !0;
		n && n.text === r && n.emphasis === i || (n = {
			text: r,
			emphasis: i
		}, Ro(e, r, { emphasis: i }));
	}
	return r(t), {
		update: r,
		destroy() {
			e.replaceChildren();
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/InlineLinks.svelte
var Bo = /* @__PURE__ */ J("<span></span>");
function Vo(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "emphasis", 8, !1);
	var i = Bo();
	Zr(i, (e, t) => zo?.(e, t), () => ({
		text: n(),
		emphasis: r()
	})), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var Ho = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Uo = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function Wo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "status", 8, "pending"), s = $(t, "interactive", 8, !1), c = $(t, "stale", 8, !1), l = $(t, "label", 8, ""), u = $(t, "onCycle", 8, () => {}), d = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, f = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	B(() => K(o()), () => {
		L(n, d[o()] ?? "?");
	}), B(() => (K(c()), K(o())), () => {
		L(r, c() && o() === "pending" ? "需重驗" : f[o()] ?? o());
	}), B(() => (K(c()), K(o())), () => {
		L(i, c() && o() === "pending" ? " marker-stale" : "");
	}), B(() => (K(l()), W(r)), () => {
		L(a, l() ? `${l()}：${W(r)}` : W(r));
	}), On();
	var p = Pr(), m = pn(p), h = (e) => {
		var t = Ho(), r = R(t), s = R(r, !0);
		j(r), j(t), V(() => {
			oi(t, 1, `marker-box marker-${o()}${W(i)} marker-box-button`), Q(t, "aria-label", `${W(a)}，點擊切換下一個結果`), X(s, W(n));
		}), q("click", t, function(...e) {
			u()?.apply(this, e);
		}), Y(e, t);
	}, g = (e) => {
		var t = Uo(), r = R(t), s = R(r, !0);
		j(r), j(t), V(() => {
			oi(t, 1, `marker-box marker-${o()}${W(i)}`), Q(t, "aria-label", W(a)), X(s, W(n));
		}), Y(e, t);
	};
	Z(m, (e) => {
		s() ? e(h) : e(g, -1);
	}), Y(e, p), We();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Go = /* @__PURE__ */ J("<i></i>"), Ko = /* @__PURE__ */ J("<div role=\"img\"></div>"), qo = /* @__PURE__ */ J("<progress max=\"100\"></progress>");
function Jo(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending",
		"active"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	B(() => K(o()), () => {
		L(n, d(o()));
	}), B(() => K(a()), () => {
		L(r, Array.isArray(a()) ? a() : []);
	}), On(), Ei();
	var f = Pr(), p = pn(f), m = (e) => {
		var t = Ko();
		Wr(t, 5, () => W(r), Br, (e, t) => {
			var n = Go();
			V((e) => oi(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), Y(e, n);
		}), j(t), V(() => {
			oi(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), Y(e, t);
	}, h = (e) => {
		var t = qo();
		V(() => {
			oi(t, 1, `progress-meter ${c()}`), vi(t, W(n)), Q(t, "aria-label", s());
		}), Y(e, t);
	};
	Z(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), Y(e, f), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var Yo = /* @__PURE__ */ J("<div><b> </b> <span> </span></div>"), Xo = /* @__PURE__ */ J("<div class=\"progress-stats\"></div>"), Zo = /* @__PURE__ */ J("<span class=\"progress-note\"> </span>"), Qo = /* @__PURE__ */ J("<p class=\"progress-caption\"><span> </span> <!></p>"), $o = /* @__PURE__ */ J("<section class=\"progress-summary\"><!> <!> <!></section>");
function es(e, t) {
	Ue(t, !1);
	let n = $(t, "stats", 24, () => []), r = $(t, "bar", 8, null), i = $(t, "caption", 8, ""), a = $(t, "note", 8, ""), o = $(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	Ei();
	var l = $o(), u = R(l), d = (e) => {
		var t = Xo();
		Wr(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = Yo(), r = R(n), i = R(r, !0);
			j(r);
			var a = z(r, 2), o = R(a, !0);
			j(a), j(n), V((e) => {
				oi(n, 1, e), X(i, (W(t), G(() => W(t).value))), X(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${c(W(t).tone)}`))]), Y(e, n);
		}), j(t), Y(e, t);
	};
	Z(u, (e) => {
		K(n()), G(() => n().length) && e(d);
	});
	var f = z(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ P(() => (K(r()), G(() => r().cells ?? []))), n = /* @__PURE__ */ P(() => (K(r()), G(() => r().ratio ?? 0))), a = /* @__PURE__ */ P(() => i() || o());
			Jo(e, {
				get form() {
					return K(r()), G(() => r().form);
				},
				get cells() {
					return W(t);
				},
				get ratio() {
					return W(n);
				},
				get label() {
					return W(a);
				}
			});
		}
	};
	Z(f, (e) => {
		r() && e(p);
	});
	var m = z(f, 2), h = (e) => {
		var t = Qo(), n = R(t), r = R(n, !0);
		j(n);
		var o = z(n, 2), s = (e) => {
			var t = Zo(), n = R(t, !0);
			j(t), V(() => X(n, a())), Y(e, t);
		};
		Z(o, (e) => {
			a() && e(s);
		}), j(t), V(() => X(r, i())), Y(e, t);
	};
	Z(m, (e) => {
		(i() || a()) && e(h);
	}), j(l), V(() => Q(l, "aria-label", o())), Y(e, l), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var ts = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), ns = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), rs = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function is(e, t) {
	Ue(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	Ei();
	var y = rs(), b = pn(y), x = R(b, !0);
	j(b);
	var S = z(b, 2), C = R(S), w = R(C, !0);
	j(C);
	var T = z(C, 2), E = R(T, !0);
	j(T), j(S);
	var ee = z(S, 2), te = (e) => {
		var t = ts(), a = R(t, !0);
		j(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Z(ee, (e) => {
		r() && e(te);
	});
	var ne = z(ee, 2), D = (e) => {
		var t = ns(), n = pn(t), r = R(n, !0);
		j(n);
		var i = z(n, 2), s = R(i, !0);
		j(i), V(() => {
			n.disabled = o(), X(r, m()), i.disabled = !a() || o(), X(s, o() ? d() : u());
		}), q("click", n, function(...e) {
			v()?.apply(this, e);
		}), q("click", i, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	Z(ne, (e) => {
		n() && e(D);
	}), V(() => {
		X(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), X(E, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", T, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), We();
}
Tr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var as = /* @__PURE__ */ J("<option> </option>"), os = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), ss = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), cs = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function ls(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(Ra(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Ma.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		L(h, e.base), L(g, v(e)), L(_, { ...W(g) });
		for (let e of W(p)) e?.setCustomValidity("");
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
		y(o() ? Ra(o().base, o()) : Ra(s())), L(f, !0);
	}
	function S() {
		L(f, !1);
	}
	function C(e) {
		y(Ra(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		L(g, {
			...W(g),
			[e.key]: r
		}), L(_, {
			...W(_),
			[e.key]: r
		}), W(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), L(g, {
			...W(g),
			[e.key]: n.value
		}), r && L(_, {
			...W(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function E() {
		L(m, a()), S();
	}
	function ee() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ra(W(h), W(_))), S();
	}
	B(() => K(a()), () => {
		L(m, a());
	}), B(() => (W(h), W(_)), () => {
		L(n, Ra(W(h), W(_)));
	}), B(() => W(n), () => {
		L(r, qa(W(n)));
	}), B(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), On(), Ei();
	var te = cs(), ne = pn(te), D = z(R(ne), 2);
	Wr(D, 5, () => u, (e) => e.value, (e, t) => {
		var n = as(), r = R(n, !0);
		j(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), j(D), j(ne), Oo(z(ne, 2), {
		get open() {
			return W(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: E,
		children: (e, t) => {
			var a = ss(), o = z(pn(a), 2), s = z(R(o), 2), c = R(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", j(s);
			var u;
			ui(s), j(o);
			var d = z(o, 2);
			Wr(d, 7, () => Ma, (e) => e.key, (e, t, r) => {
				var i = os(), a = R(i), o = R(a, !0);
				j(a);
				var s = z(a, 2), c = R(s);
				_i(c);
				var l = z(c, 2);
				_i(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ti(l, (e, t) => Yt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), j(s), j(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), vi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), vi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
			}), j(d);
			var f = z(d, 2);
			let m;
			var _ = R(f, !0);
			j(f);
			var v = z(f, 2), b = R(v), x = z(b, 4), S = z(x, 2);
			j(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", li(s, W(h))), m = oi(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(Ra(W(h)))), q("click", x, E), q("click", S, ee), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", D, b), di(D, () => W(m), (e) => L(m, e)), Y(e, te), We();
}
Tr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var us = /* @__PURE__ */ J("<p class=\"document-owner\">擁有者：<a> </a></p>"), ds = /* @__PURE__ */ J("<details class=\"checklist-round\"><summary>本輪依據</summary><p> </p></details>"), fs = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), ps = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), ms = /* @__PURE__ */ J("<a class=\"checklist-next-step\"><span> </span> <strong> </strong></a>"), hs = /* @__PURE__ */ J("<p class=\"checklist-chips\"><span class=\"checklist-chip\"> </span></p>"), gs = /* @__PURE__ */ J("<p class=\"checklist-lock\"> </p>"), _s = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), vs = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), ys = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), bs = /* @__PURE__ */ J("<div><dt>狀態</dt><dd class=\"checklist-void\"> </dd></div>"), xs = /* @__PURE__ */ J("<div><dt>記錄</dt><dd> </dd></div>"), Ss = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>不通過的原因</span> <select><option>實作不符</option><option>條件不符</option></select></label>"), Cs = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), ws = /* @__PURE__ */ J("<section tabindex=\"-1\"><div class=\"checklist-check-heading\"><!> <strong> </strong> <span> </span></div> <!> <dl><div><dt>Action</dt><dd><!></dd></div> <div><dt>Expect</dt><dd><!></dd></div> <!> <!> <!> <!></dl> <!> <!></section>"), Ts = /* @__PURE__ */ J("<div class=\"checklist-checks\"><p class=\"checklist-outcome\"><!></p> <!> <!></div>"), Es = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header\"><!> <div><h2> </h2></div> <span class=\"checklist-status\"> </span></header>"), Ds = /* @__PURE__ */ J("<article><!></article>"), Os = /* @__PURE__ */ J("<button type=\"button\" class=\"secondary-button checklist-reset-button\">清空結果</button>"), ks = /* @__PURE__ */ J("<!> <!> <label class=\"checklist-operable-toggle\"><input type=\"checkbox\"/> <span>只顯示我能操作的檢查</span></label> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"><!></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!> <!></footer>", 1), As = /* @__PURE__ */ J("<p> </p> <p>此操作無法復原；如需回復，請使用 Git 歷史。</p> <form method=\"dialog\" class=\"theme-dialog-actions\"><button type=\"submit\" class=\"secondary-button\">取消</button> <button type=\"submit\" class=\"primary-button\">確認清空</button></form>", 1), js = /* @__PURE__ */ J("<!> <main class=\"checklist-page\"><header class=\"checklist-header\"><div><h1> </h1> <!> <!></div> <!></header> <!></main> <!>", 1);
function Ms(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = $(t, "transport", 8, null), o = $(t, "onPersistenceChange", 8, () => {}), s = $(t, "bindRefresh", 8, () => {}), c = null, l = /* @__PURE__ */ I(null), u = /* @__PURE__ */ I(!0), d = /* @__PURE__ */ I(""), f = /* @__PURE__ */ I(null), p = /* @__PURE__ */ I("正在載入 Checklist…"), m = /* @__PURE__ */ I(!1), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I([]);
	function _(e) {
		c = Da({
			session: fa(e),
			save: a().save,
			debounceCommand: (e) => e.type === "set-observed",
			onChange: (e) => {
				L(l, e), L(p, e.message);
			}
		}), L(l, c.snapshot()), L(p, W(l).message);
	}
	async function v() {
		if (!a() || !W(l) || W(l).dirty || W(l).saving || W(l).pending || W(m) || W(h)) return;
		let e = c, t = W(l)?.document?.revision;
		try {
			let n = await a().load();
			if (!n || !n.revision || !c || c !== e || !W(l) || W(l).document?.revision !== t || W(l).dirty || W(l).saving || W(l).pending || W(m) || W(h) || n.revision === t) return;
			let r = W(l).cautious;
			_(n), r && c && await c.setCautious(!0);
		} catch (e) {
			console.warn("Checklist foreground refresh failed:", e);
		}
	}
	function y() {
		W(r) && (L(g, W(n).map((e) => ({ ...e }))), L(m, !0));
	}
	async function b() {
		if (!W(r) || W(h)) return;
		L(h, !0);
		let e = W(l).cautious;
		L(p, "正在清空實機結果…");
		try {
			_(await a().reset({ targets: W(g) })), L(l, await c.setCautious(e)), L(p, "實機結果已清空；其他檢查結果保留。");
		} catch (e) {
			L(p, e instanceof Error ? e.message : "清空失敗，請重新載入確認結果。");
		} finally {
			L(h, !1);
		}
	}
	let x = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, S = [
		"pending",
		"passed",
		"failed"
	], C = /* @__PURE__ */ I(Ii(S)), w = /* @__PURE__ */ I(null), T = ka({ supportedIds: [Pi, ...S] }), E = /* @__PURE__ */ I(T.order);
	function ee(e) {
		L(C, Bi(W(C), e)), Ri(W(w), W(C));
	}
	function te() {
		L(C, Vi(W(C))), Ri(W(w), W(C));
	}
	function ne(e, t, n) {
		L(E, [...T.move(e, t, n)]);
	}
	function D(e, t) {
		let n = new Map(ua(e).map((e) => [e.id, e.count]));
		return t.filter((e) => S.includes(e)).map((e) => ({
			id: e,
			label: x[e] ?? e,
			count: n.get(e) ?? 0,
			title: "拖曳可調整順序；排在「預設」左邊的標籤會分組到最前面"
		}));
	}
	let re = /* @__PURE__ */ I(), O = /* @__PURE__ */ I(!0), ie = /* @__PURE__ */ I({});
	function ae(e) {
		let t = ji(e);
		L(O, t.expanded), L(ie, t.overrides);
	}
	function oe(e, t) {
		L(ie, {
			...W(ie),
			[e]: t
		}), Mi(W(i), W(O), W(ie));
	}
	function se(e) {
		L(O, e), L(ie, {}), Mi(W(i), W(O), W(ie));
	}
	async function ce(e) {
		e.preventDefault();
		let t = W(l).summary.nextStep;
		if (!t) return;
		W(re)?.revealCard(t.workItemId), oe(t.workItemId, !0), L(C, Ii(S)), Ri(W(w), W(C)), await mr();
		let n = document.getElementById(`check-${t.workItemId}-${t.checkIndex}`);
		n?.focus({ preventScroll: !0 }), n?.scrollIntoView({ block: "start" });
	}
	let le = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), ue = (e) => e === "saving" ? "saving" : le.has(e) ? "error" : "clean", fe = /* @__PURE__ */ I(null), pe = /* @__PURE__ */ I({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function me() {
		L(pe, {
			mode: W(fe).mode,
			custom: W(fe).custom,
			systemScheme: W(fe).systemScheme
		});
	}
	Oi(async () => {
		L(fe, Ja()), me();
		try {
			if (!a()) throw Error("Checklist 介面需要由 host 提供 transport。");
			_(await a().load()), a().loadOwnerReport?.().then((e) => {
				L(f, e);
			}).catch(() => {});
		} catch (e) {
			L(d, e instanceof Error ? e.message : "Checklist 載入失敗。"), L(p, W(d));
		} finally {
			L(u, !1);
		}
	});
	function he(e) {
		if (!W(h)) try {
			c.dispatch(e), L(l, c.snapshot()), L(p, W(l).message);
		} catch (e) {
			L(p, e.message);
		}
	}
	let ge = /* @__PURE__ */ I(!1), _e = {
		manual: "實機",
		acceptance: "他驗"
	}, ve = {
		no_recorder: "需重驗：沒有記錄者",
		fingerprint: "需重驗：內容已變更",
		released: "需重驗：之後重新執行過"
	};
	function ye(e) {
		let t = la(e, W(E));
		return W(ge) ? aa(t) : t;
	}
	function be(e, t) {
		t.isAcceptance && t.recorder && t.recorder !== "user" && !window.confirm("確認修改 agent 紀錄嗎？") || he({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function xe() {
		W(h) || (c.undo(), L(l, c.snapshot()));
	}
	function Se() {
		W(h) || (c.redo(), L(l, c.snapshot()));
	}
	function Ce() {
		W(h) || L(l, c.discard());
	}
	async function we() {
		W(h) || (await c.save(), L(l, c.snapshot()));
	}
	async function Te(e) {
		W(h) || L(l, await c.setCautious(e));
	}
	B(() => W(l), () => {
		L(n, W(l)?.document.items.flatMap((e) => e.checks.filter((e) => e.isManual).map((t) => ({
			workItemId: e.id,
			checkIndex: t.index
		}))) ?? []);
	}), B(() => (W(l), W(h), W(n)), () => {
		L(r, !!W(l) && !W(l).dirty && !W(l).saving && !W(l).pending && !W(l).blocked && !W(h) && W(n).length > 0);
	}), B(() => (K(o()), W(l), W(m), W(h)), () => {
		o()(W(l) ? {
			...W(l),
			pending: W(l).pending || W(m) || W(h)
		} : W(l));
	}), B(() => K(s()), () => {
		s()(v);
	}), B(() => W(l), () => {
		L(i, W(l)?.document ? `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${W(l).document.fileName}:${W(l).document.roundIdentity}` : null);
	}), B(() => (W(i), W(w), Li), () => {
		W(i) && W(w) !== `${W(i)}:filters` && (L(w, `${W(i)}:filters`), L(C, Li(W(w), S)));
	}), B(() => W(i), () => {
		W(i) && ae(W(i));
	}), On(), Ei();
	var Ee = js(), De = pn(Ee);
	Eo(De, {});
	var Oe = z(De, 2), ke = R(Oe), Ae = R(ke), k = R(Ae), je = R(k, !0);
	j(k);
	var A = z(k, 2), Me = (e) => {
		var t = us(), n = z(R(t)), r = R(n, !0);
		j(n), j(t), V(() => {
			Q(n, "href", (W(f), G(() => W(f).href))), X(r, (W(f), G(() => W(f).title)));
		}), Y(e, t);
	};
	Z(A, (e) => {
		W(f) && e(Me);
	});
	var Ne = z(A, 2), Fe = (e) => {
		var t = ds(), n = z(R(t)), r = R(n, !0);
		j(n), j(t), V(() => X(r, (W(l), G(() => W(l).document.roundIdentity)))), Y(e, t);
	};
	Z(Ne, (e) => {
		W(l) && e(Fe);
	}), j(Ae);
	var Ie = z(Ae, 2), Le = (e) => {
		ls(e, {
			get mode() {
				return W(pe), G(() => W(pe).mode);
			},
			get custom() {
				return W(pe), G(() => W(pe).custom);
			},
			get systemScheme() {
				return W(pe), G(() => W(pe).systemScheme);
			},
			onModeChange: (e) => {
				W(fe).setMode(e), me();
			},
			onApplyCustom: (e) => {
				W(fe).applyCustom(e), me();
			}
		});
	};
	Z(Ie, (e) => {
		W(fe) && e(Le);
	}), j(ke);
	var Re = z(ke, 2), ze = (e) => {
		var t = fs(), n = R(t, !0);
		j(t), V(() => X(n, W(p))), Y(e, t);
	}, Be = (e) => {
		var t = ps(), n = R(t, !0);
		j(t), V(() => X(n, W(d))), Y(e, t);
	}, Ve = (e) => {
		var t = ks(), n = pn(t);
		{
			let e = /* @__PURE__ */ P(() => (W(l), G(() => ({
				form: "segmented",
				cells: W(l).summary.cells
			})))), t = /* @__PURE__ */ P(() => (W(l), G(() => `${W(l).summary.checks.passed} / ${W(l).summary.checks.total} checks 通過`))), r = /* @__PURE__ */ P(() => (W(l), G(() => W(l).summary.checks.failed > 0 ? `${W(l).summary.checks.failed} 個失敗` : "")));
			es(n, {
				get bar() {
					return W(e);
				},
				get caption() {
					return W(t);
				},
				get note() {
					return W(r);
				}
			});
		}
		var i = z(n, 2), o = (e) => {
			var t = ms(), n = R(t), r = R(n);
			j(n);
			var i = z(n, 2), a = R(i, !0);
			j(i), j(t), V(() => {
				Q(t, "href", (W(l), G(() => `#check-${W(l).summary.nextStep.workItemId}-${W(l).summary.nextStep.checkIndex}`))), Q(t, "title", (W(l), G(() => W(l).summary.nextStep.title))), X(r, `${W(l), G(() => W(l).summary.nextStep.isManual ? "需實機驗證" : W(l).summary.nextStep.isAcceptance ? "下一步 · 他驗" : "下一步 · Agent") ?? ""}：`), X(a, (W(l), G(() => W(l).summary.nextStep.title)));
			}), q("click", t, ce), Y(e, t);
		};
		Z(i, (e) => {
			W(l), G(() => W(l).summary.nextStep) && e(o);
		});
		var s = z(i, 2), c = R(s);
		_i(c), Pe(2), j(s);
		var u = z(s, 2), d = R(u);
		{
			let e = /* @__PURE__ */ P(() => (K(ca), W(l), W(C), G(() => ca(ye(W(l).document), W(C).selected).items))), t = /* @__PURE__ */ P(() => (K(la), W(l), W(E), G(() => la(W(l).document, W(E)).items.map((e) => e.id)))), n = /* @__PURE__ */ P(() => (W(l), G(() => new URLSearchParams(location.search).has("scope") ? `taskprogress.cards.checklist.v1:${location.pathname}:${new URLSearchParams(location.search).get("scope")}:${new URLSearchParams(location.search).get("task")}:${W(l).document.roundIdentity}` : null)));
			Ti(wo(d, {
				get expanded() {
					return W(O);
				},
				onToggleAll: se,
				get items() {
					return W(e);
				},
				get allIds() {
					return W(t);
				},
				get storageKey() {
					return W(n);
				},
				children: de,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ P(() => t.item), r = /* @__PURE__ */ P(() => t.visibilityEnabled), i = /* @__PURE__ */ P(() => t.visible), a = /* @__PURE__ */ P(() => t.onVisibleChange), o = /* @__PURE__ */ P(() => (W(l), K(W(n)), G(() => W(l).document.items.find((e) => e.id === W(n).id))));
						var s = Ds(), c = R(s);
						{
							let e = /* @__PURE__ */ P(() => (W(ie), K(W(n)), W(O), G(() => W(ie)[W(n).id] ?? W(O)))), t = /* @__PURE__ */ P(() => (K(W(n)), G(() => `checklist-body-${W(n).id}`)));
							no(c, {
								get visibilityEnabled() {
									return W(r);
								},
								get visible() {
									return W(i);
								},
								get onVisibleChange() {
									return W(a);
								},
								get expanded() {
									return W(e);
								},
								onToggle: (e) => oe(W(n).id, e),
								get contentId() {
									return W(t);
								},
								get label() {
									return K(W(n)), G(() => W(n).title);
								},
								children: (e, t) => {
									var r = Ts(), i = R(r);
									Vo(R(i), { get text() {
										return K(W(n)), G(() => W(n).outcome);
									} }), j(i);
									var a = z(i, 2), o = (e) => {
										var t = hs(), r = R(t), i = R(r);
										j(r), j(t), V((e) => X(i, `Depends on ${e ?? ""}`), [() => (K(W(n)), G(() => W(n).dependsOn.join(", ")))]), Y(e, t);
									};
									Z(a, (e) => {
										K(W(n)), G(() => W(n).dependsOn.length) && e(o);
									}), Wr(z(a, 2), 1, () => (K(W(n)), G(() => W(n).checks)), (e) => e.index, (e, t) => {
										let r = /* @__PURE__ */ P(() => (W(t), G(() => W(t).isAcceptance ? "acceptance" : W(t).isManual ? "manual" : null))), i = /* @__PURE__ */ P(() => (K(na), W(t), K(ra), W(l), G(() => na(W(t)) ? ra(W(l).document, W(t)) : null)));
										var a = ws(), o = R(a), s = R(o);
										{
											let e = /* @__PURE__ */ P(() => (W(t), G(() => !!(W(t).validity && W(t).validity !== "valid")))), r = /* @__PURE__ */ P(() => (K(na), W(t), W(h), K(W(i)), G(() => na(W(t)) && !W(h) && (!W(i) || W(t).status !== "pending"))));
											Wo(s, {
												get status() {
													return W(t), G(() => W(t).status);
												},
												get stale() {
													return W(e);
												},
												get interactive() {
													return W(r);
												},
												get label() {
													return W(t), G(() => W(t).title);
												},
												onCycle: () => be(W(n).id, W(t))
											});
										}
										var c = z(s, 2), u = R(c, !0);
										j(c);
										var d = z(c, 2), f = R(d, !0);
										j(d), j(o);
										var p = z(o, 2), m = (e) => {
											var t = gs(), n = R(t, !0);
											j(t), V(() => X(n, W(i))), Y(e, t);
										};
										Z(p, (e) => {
											K(W(i)), W(t), G(() => W(i) && W(t).status === "pending") && e(m);
										});
										var g = z(p, 2), _ = R(g), v = z(R(_));
										Vo(R(v), { get text() {
											return W(t), G(() => W(t).action);
										} }), j(v), j(_);
										var y = z(_, 2), b = z(R(y));
										Vo(R(b), { get text() {
											return W(t), G(() => W(t).expect);
										} }), j(b), j(y);
										var x = z(y, 2), S = (e) => {
											var n = _s(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).reason)))), Y(e, n);
										};
										Z(x, (e) => {
											W(t), G(() => W(t).reason) && e(S);
										});
										var C = z(x, 2), w = (e) => {
											var n = vs(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).observed)))), Y(e, n);
										}, T = /* @__PURE__ */ bt(() => (W(t), K(na), G(() => W(t).observed && !(na(W(t)) && W(t).status === "failed"))));
										Z(C, (e) => {
											W(T) && e(w);
										});
										var E = z(C, 2), ee = (e) => {
											var n = ys(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).resolved)))), Y(e, n);
										};
										Z(E, (e) => {
											W(t), G(() => W(t).resolved) && e(ee);
										});
										var te = z(E, 2), ne = (e) => {
											var n = bs(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => ve[W(t).validity])))), Y(e, n);
										}, D = (e) => {
											var n = xs(), r = z(R(n)), i = R(r, !0);
											j(r), j(n), V(() => X(i, (W(t), G(() => W(t).recorder === "user" ? "使用者" : W(t).recorder)))), Y(e, n);
										};
										Z(te, (e) => {
											W(t), G(() => W(t).validity && W(t).validity !== "valid") ? e(ne) : (W(t), G(() => W(t).recorder) && e(D, 1));
										}), j(g);
										var re = z(g, 2), O = (e) => {
											var r = Ss(), i = z(R(r), 2), a = R(i);
											a.value = a.__value = "implementation";
											var o = z(a);
											o.value = o.__value = "condition", j(i);
											var s;
											ui(i), j(r), V(() => {
												i.disabled = W(h), s !== (s = (W(t), G(() => W(t).rejectReason ?? "implementation"))) && (i.value = (i.__value = (W(t), G(() => W(t).rejectReason ?? "implementation"))) ?? "", li(i, (W(t), G(() => W(t).rejectReason ?? "implementation"))));
											}), q("change", i, (e) => he({
												type: "set-reason",
												workItemId: W(n).id,
												checkIndex: W(t).index,
												value: e.currentTarget.value
											})), Y(e, r);
										};
										Z(re, (e) => {
											W(t), G(() => W(t).isAcceptance && W(t).status === "failed") && e(O);
										});
										var ie = z(re, 2), ae = (e) => {
											var r = Cs(), i = z(R(r), 2);
											it(i), j(r), V(() => {
												i.disabled = W(h), vi(i, (W(t), G(() => W(t).observed ?? "")));
											}), q("input", i, (e) => he({
												type: "set-observed",
												workItemId: W(n).id,
												checkIndex: W(t).index,
												value: e.currentTarget.value
											})), Y(e, r);
										}, oe = /* @__PURE__ */ bt(() => (K(na), W(t), G(() => na(W(t)) && W(t).status === "failed")));
										Z(ie, (e) => {
											W(oe) && e(ae);
										}), j(a), V(() => {
											Q(a, "id", (K(W(n)), W(t), G(() => `check-${W(n).id}-${W(t).index}`))), oi(a, 1, (W(t), K(W(r)), G(() => `checklist-check checklist-${W(t).status}${W(r) ? ` checklist-${W(r)}` : ""}`))), X(u, (W(t), G(() => W(t).title))), oi(d, 1, `checklist-owner${W(r) ? ` checklist-owner-${W(r)}` : ""}`), X(f, (K(W(r)), G(() => _e[W(r)] ?? "Agent")));
										}), Y(e, a);
									}), j(r), Y(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = Es(), i = R(r);
										{
											let e = /* @__PURE__ */ P(() => (K(W(n)), G(() => `工作項目 ${W(n).id}`)));
											Wo(i, {
												get status() {
													return K(W(n)), G(() => W(n).status);
												},
												get label() {
													return W(e);
												}
											});
										}
										var a = z(i, 2), s = R(a), c = R(s);
										j(s), j(a);
										var l = z(a, 2), u = R(l);
										j(l), j(r), V(() => {
											X(c, `${K(W(n)), G(() => W(n).id) ?? ""}. ${K(W(n)), G(() => W(n).title) ?? ""}`), Q(l, "aria-label", (K(W(o)), G(() => `通過 ${W(o).progress.passed}，共 ${W(o).progress.total}`))), X(u, `${K(W(o)), G(() => W(o).progress.passed) ?? ""}/${K(W(o)), G(() => W(o).progress.total) ?? ""}`);
										}), Y(e, r);
									}
								}
							});
						}
						j(s), V(() => oi(s, 1, (K(W(n)), G(() => `checklist-item checklist-${W(n).status}`)))), Y(e, s);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ P(() => (W(l), W(E), G(() => D(W(l).document, W(E))))), n = /* @__PURE__ */ P(() => (K(zi), W(C), G(() => zi(W(C)))));
							Po(e, {
								get categories() {
									return W(t);
								},
								get order() {
									return W(E);
								},
								get selected() {
									return W(C), G(() => W(C).selected);
								},
								get defaultLit() {
									return W(n);
								},
								className: "status-filter-strip status-summary-filters",
								ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
								reorderable: !0,
								onSelect: ee,
								onSelectDefault: te,
								onReorder: ne
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => L(re, e), () => W(re));
		}
		j(u);
		var f = z(u, 2), m = R(f);
		{
			let e = /* @__PURE__ */ P(() => (W(l), W(h), G(() => W(l).saving || W(h))));
			is(m, {
				get cautious() {
					return W(l), G(() => W(l).cautious);
				},
				onToggleCautious: Te,
				get dirty() {
					return W(l), G(() => W(l).dirty);
				},
				get saving() {
					return W(e);
				},
				get canUndo() {
					return W(l), G(() => W(l).history.canUndo);
				},
				get canRedo() {
					return W(l), G(() => W(l).history.canRedo);
				},
				get message() {
					return W(p);
				},
				onSave: we,
				onUndo: xe,
				onRedo: Se,
				onDiscard: Ce
			});
		}
		var g = z(m, 2), _ = (e) => {
			var t = Os();
			V(() => {
				t.disabled = !W(r), Q(t, "title", (W(l), G(() => W(l).dirty || W(l).pending || W(l).saving ? "請先儲存或捨棄變更，再清空。" : "將實機檢查重設為未執行；Agent 檢查結果保留")));
			}), q("click", t, y), Y(e, t);
		};
		Z(g, (e) => {
			K(a()), G(() => typeof a()?.reset == "function") && e(_);
		}), j(f), V((e) => {
			Q(f, "data-state", e), Q(f, "aria-busy", (W(l), W(h), G(() => W(l).saving || W(h))));
		}, [() => (W(l), G(() => ue(W(l).status)))]), Si(c, () => W(ge), (e) => L(ge, e)), Y(e, t);
	};
	Z(Re, (e) => {
		W(u) ? e(ze) : W(l) ? e(Ve, -1) : e(Be, 1);
	}), j(Oe), Oo(z(Oe, 2), {
		get open() {
			return W(m);
		},
		title: "清空結果？",
		titleId: "checklist-reset-title",
		kicker: "Checklist",
		onClose: () => {
			L(m, !1);
		},
		children: (e, t) => {
			var n = As(), r = pn(n), i = R(r);
			j(r);
			var a = z(r, 4), o = z(R(a), 2);
			j(a), V(() => {
				X(i, `將 ${W(g), G(() => W(g).length) ?? ""} 個實機檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。其他檢查結果不受影響。`), o.disabled = W(h);
			}), q("click", o, b), Y(e, n);
		},
		$$slots: { default: !0 }
	}), V(() => X(je, (W(l), G(() => W(l)?.document.fileName ?? "TaskProgress Checklist")))), Y(e, Ee), We();
}
Tr([
	"click",
	"change",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var Ns = 1, Ps = /* @__PURE__ */ new Set([
	"load",
	"save",
	"reset"
]);
function Fs(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== Ns || typeof t.id != "string") return;
		let r = n.get(t.id);
		if (!r) return;
		if (n.delete(t.id), t.type === "result") {
			r.resolve(t.payload);
			return;
		}
		let i = Error(t.error?.message ?? "Checklist bridge request failed.");
		i.code = t.error?.code ?? "bridge_error", r.reject(i);
	});
	function r(r, i) {
		if (!Ps.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: Ns,
				id: a,
				type: r
			};
			i !== void 0 && (s.payload = i), e.postMessage(s);
		});
	}
	return Object.freeze({
		load: () => r("load"),
		save: (e) => r("save", e),
		reset: (e = {}) => r("reset", e)
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-main.js
function Is() {
	try {
		return Fs();
	} catch (e) {
		let t = () => Promise.reject(e);
		return {
			load: t,
			save: t
		};
	}
}
Fr(Ms, {
	target: document.querySelector("#app"),
	props: { transport: Is() }
});
//#endregion
