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
function h(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, C = 65536, w = 1 << 19, T = 1 << 20, ee = 1 << 25, te = 65536, ne = 1 << 21, re = 1 << 22, E = 1 << 23, D = Symbol("$state"), O = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function fe() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
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
var Te = {}, k = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml";
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
var A = !1;
function je(e) {
	A = e;
}
var j;
function Me(e) {
	if (e === null) throw Oe(), Te;
	return j = e;
}
function Ne() {
	return Me(/* @__PURE__ */ pn(j));
}
function M(e) {
	if (A) {
		if (/* @__PURE__ */ pn(j) !== null) throw Oe(), Te;
		j = e;
	}
}
function Pe(e = 1) {
	if (A) {
		for (var t = e, n = j; t--;) n = /* @__PURE__ */ pn(n);
		j = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = j;;) {
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
function Ie(e) {
	if (!e || e.nodeType !== 8) throw Oe(), Te;
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
var N = null;
function He(e) {
	N = e;
}
function Ue(e, t = !1, n) {
	N = {
		p: N,
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
	var t = N, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Tn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, N = t.p, e ?? {};
}
function Ge() {
	return !Be || N !== null && N.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], p(e);
}
function Je(e) {
	if (Ke.length === 0 && !jt) {
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
	if (t === null) return H.f |= E, e;
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
var Qe = ~(_ | v | g);
function $e(e, t) {
	e.f = e.f & Qe | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? $e(e, g) : $e(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= te, tt(t.deps));
}
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), tt(e.deps), $e(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var rt = !1;
function it(e) {
	var t = rt;
	try {
		return rt = !1, [e(), rt];
	} finally {
		rt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function at(e) {
	A && /* @__PURE__ */ fn(e) !== null && hn(e);
}
var ot = !1;
function st() {
	ot || (ot = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ct(e) {
	var t = H, n = U;
	Xn(null), Zn(null);
	try {
		return e();
	} finally {
		Xn(t), Zn(n);
	}
}
function lt(e, t, n, r = n) {
	e.addEventListener(t, () => ct(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), st();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ut(e) {
	let t = 0, n = Jt(0), r;
	return () => {
		Sn() && (W(n), jn(() => (t === 0 && (r = G(() => e(() => $t(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, $t(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var dt = C | w;
function ft(e, t, n, r) {
	new pt(e, t, n, r);
}
var pt = class {
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
	#h = ut(() => (this.#m = Jt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = U;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Mn(() => {
			if (A) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, dt), A && (this.#e = j);
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
		Je(r), t && (this.#s = Nn(() => {
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
			t = !0, n && we(), this.#s !== null && Bn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Nn(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = dn();
			e.append(t), this.#a = this.#S(() => Nn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(F));
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
			} else this.#x(F);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		nt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = U, n = H, r = N;
		Zn(this.#i), Xn(this.#i), He(this.#i.ctx);
		try {
			return Lt.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Zn(t), Xn(n), He(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Zt(this.#m, this.#l);
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
		this.#a &&= (Ln(this.#a), null), this.#o &&= (Ln(this.#o), null), this.#s &&= (Ln(this.#s), null), A && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Nn(() => {
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
function mt(e, t, n, r) {
	let i = Ge() ? vt : P;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = ht(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Ze(e, s);
			}
			gt();
		}
	}
	var d = _t();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ bt(e))).then(u).catch((e) => Ze(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), gt();
	}) : f();
}
function ht() {
	var e = U, t = H, n = N, r = F;
	return function(i = !0) {
		Zn(e), Xn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function gt(e = !0) {
	Zn(null), Xn(null), He(null), e && F?.deactivate();
}
function _t() {
	var e = U, t = e.b, n = F, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function vt(e) {
	var t = 2 | _;
	return U !== null && (U.f |= w), {
		ctx: N,
		deps: null,
		effects: null,
		equals: Le,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: k,
		wv: 0,
		parent: U,
		ac: null
	};
}
var yt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function bt(e, t, n) {
	let r = U;
	r === null && me();
	var i = void 0, a = Jt(k), o = !H, s = /* @__PURE__ */ new Set();
	return An(() => {
		var t = U, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
			}).finally(gt);
		} catch (e) {
			n.reject(e), gt();
		}
		var c = F;
		if (o) {
			if (t.f & 32768) var l = _t();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(yt);
			else for (let e of s.values()) e.reject(yt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== yt && (c.activate(), t ? (a.f |= E, Zt(a, t)) : (a.f & 8388608 && (a.f ^= E), Zt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Cn(() => {
		for (let e of s) e.reject(yt);
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
function xt(e) {
	let t = /* @__PURE__ */ vt(e);
	return $n(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e) {
	let t = /* @__PURE__ */ vt(e);
	return t.equals = ze, t;
}
function St(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Ln(t[n]);
	}
}
function Ct(e) {
	var t, n = U, r = e.parent;
	if (!qn && r !== null && e.v !== k && r.f & 24576) return De(), e.v;
	Zn(r);
	try {
		e.f &= ~te, St(e), t = dr(e);
	} finally {
		Zn(n);
	}
	return t;
}
function wt(e) {
	var t = Ct(e);
	if (!e.equals(t) && (e.wv = cr(), (!F?.is_fork || e.deps === null) && (F === null ? e.v = t : (F.capture(e, t, !0), Ot?.capture(e, t, !0)), e.deps === null))) {
		$e(e, g);
		return;
	}
	qn || (kt === null ? et(e) : (Sn() || F?.is_fork) && kt.set(e, t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ct(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), pr(t, 0), Fn(t));
}
function Et(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && mr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Dt = null, F = null, Ot = null, kt = null, At = null, jt = !1, Mt = !1, Nt = null, Pt = null, Ft = 0, It = 1, Lt = class e {
	id = It++;
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
		Dt === null ? Dt = this : (Dt.#n = this, this.#t = Dt), Dt = this;
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
			for (var r of n.d) $e(r, _), t(r);
			for (r of n.m) $e(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ft++ > 1e3 && (this.#x(), zt());
		for (let e of this.#u) this.#d.delete(e), $e(e, _), this.schedule(e);
		for (let e of this.#d) $e(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Nt = [], r = [], i = Pt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Wt(e), this.#h() || this.discard(), t;
		}
		if (F = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Nt = null, Pt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ut(e, t);
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
		this.#r.clear(), Ot = this, Vt(r), Vt(n), Ot = null, this.#s?.resolve();
		var s = F;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : lr(r) && (i & 16 && this.#d.add(r), mr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), $e(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), F = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== k && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), kt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		F = this;
	}
	deactivate() {
		F = null, kt = null;
	}
	flush() {
		try {
			Mt = !0, F = this, this.#g();
		} finally {
			Ft = 0, At = null, Nt = null, Pt = null, Mt = !1, F = null, kt = null, Kt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(yt);
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
			!Mt && !jt && Je(() => {
				t.#e || t.flush();
			});
		}
		return F;
	}
	apply() {
		kt = null;
	}
	schedule(e) {
		if (At = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Nt !== null && t === U && (H === null || !(H.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= g;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Dt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Rt(e) {
	var t = jt;
	jt = !0;
	try {
		var n;
		for (e && (F !== null && !F.is_fork && F.flush(), n = e());;) {
			if (Ye(), F === null) return n;
			F.flush();
		}
	} finally {
		jt = t;
	}
}
function zt() {
	try {
		ye();
	} catch (e) {
		Ze(e, At);
	}
}
var Bt = null;
function Vt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && lr(r) && (Bt = /* @__PURE__ */ new Set(), mr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), Bt?.size > 0)) {
				Kt.clear();
				for (let e of Bt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Bt.has(n) && (Bt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || mr(n);
					}
				}
				Bt.clear();
			}
		}
		Bt = null;
	}
}
function Ht(e) {
	F.schedule(e);
}
function Ut(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), $e(e, g);
		for (var n = e.first; n !== null;) Ut(n, t), n = n.next;
	}
}
function Wt(e) {
	$e(e, g);
	for (var t = e.first; t !== null;) Wt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Gt = /* @__PURE__ */ new Set(), Kt = /* @__PURE__ */ new Map(), qt = !1;
function Jt(e, t) {
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
function Yt(e, t) {
	let n = Jt(e, t);
	return $n(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function I(e, t = !1, n = !0) {
	let r = Jt(e);
	return t || (r.equals = ze), Be && n && N !== null && N.l !== null && (N.l.s ??= []).push(r), r;
}
function Xt(e, t) {
	return L(e, G(() => W(e))), t;
}
function L(e, t, n = !1) {
	return H !== null && (!Yn || H.f & 131072) && Ge() && H.f & 4325394 && (Qn === null || !Qn.has(e)) && Ce(), Zt(e, n ? tn(t) : t, Pt);
}
function Zt(e, t, n = null) {
	if (!e.equals(t)) {
		Kt.set(e, qn ? t : e.v);
		var r = Lt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Ct(t), kt === null && et(t);
		}
		e.wv = cr(), en(e, _, n), Ge() && U !== null && U.f & 1024 && !(U.f & 96) && (nr === null ? rr([e]) : nr.push(e)), !r.is_fork && Gt.size > 0 && !qt && Qt();
	}
	return t;
}
function Qt() {
	qt = !1;
	for (let e of Gt) {
		e.f & 1024 && $e(e, v);
		let t;
		try {
			t = lr(e);
		} catch {
			t = !0;
		}
		t && mr(e);
	}
	Gt.clear();
}
function $t(e) {
	L(e, e.v + 1);
}
function en(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & _) === 0;
			if (l && $e(s, t), c & 131072) Gt.add(s);
			else if (c & 2) {
				var u = s;
				kt?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= te), en(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && Bt !== null && Bt.add(d), n === null ? Ht(d) : n.push(d);
			}
		}
	}
}
function tn(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Yt(0), u = null, d = or, f = (e) => {
		if (or === d) return e();
		var t = H, n = or;
		Xn(null), sr(d);
		var r = e();
		return Xn(t), sr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Yt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Yt(n.value, u);
				return r.set(t, e), e;
			}) : L(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Yt(k, u));
					r.set(t, e), $t(o);
				}
			} else L(n, k), $t(o);
			return !0;
		},
		get(e, n, i) {
			if (n === D) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Yt(tn(s ? e[n] : k), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === k ? void 0 : c;
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
				if (a !== void 0 && o !== k) return {
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
			var n = r.get(t), i = n !== void 0 && n.v !== k || Reflect.has(e, t);
			return (n !== void 0 || U !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Yt(i ? tn(e[t]) : k, u)), r.set(t, n)), W(n) === k) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Yt(k, u)), r.set(d + "", p)) : L(p, k);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Yt(void 0, u)), L(c, tn(n)), r.set(t, c));
			else {
				l = c.v !== k;
				var m = f(() => tn(n));
				L(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && L(g, _ + 1);
				}
				$t(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== k;
			});
			for (var [n, i] of r) i.v !== k && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Se();
		}
	});
}
function nn(e) {
	try {
		if (typeof e == "object" && e && D in e) return e[D];
	} catch {}
	return e;
}
function rn(e, t) {
	return Object.is(nn(e), nn(t));
}
var an, on, sn, cn, ln;
function un() {
	if (an === void 0) {
		an = window, on = document, sn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		cn = a(t, "firstChild").get, ln = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
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
function R(e, t) {
	if (!A) return /* @__PURE__ */ fn(e);
	var n = /* @__PURE__ */ fn(j);
	if (n === null) n = j.appendChild(dn());
	else if (t && n.nodeType !== 3) {
		var r = dn();
		return n?.before(r), Me(r), r;
	}
	return t && vn(n), Me(n), n;
}
function mn(e, t = !1) {
	if (!A) {
		var n = /* @__PURE__ */ fn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ pn(n) : n;
	}
	if (t) {
		if (j?.nodeType !== 3) {
			var r = dn();
			return j?.before(r), Me(r), r;
		}
		vn(j);
	}
	return j;
}
function z(e, t = 1, n = !1) {
	let r = A ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ pn(r);
	if (!A) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = dn();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		vn(r);
	}
	return Me(r), r;
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
	U === null && (H === null && ve(e), _e()), qn && ge(e);
}
function bn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function xn(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: N,
		deps: null,
		nodes: null,
		f: e | _ | 512,
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
	if (e & 4) Nt === null ? Lt.ensure().schedule(r) : Nt.push(r);
	else if (t !== null) {
		try {
			mr(r);
		} catch (e) {
			throw Ln(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && bn(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Sn() {
	return H !== null && !Yn;
}
function Cn(e) {
	let t = xn(8, null);
	return $e(t, g), t.teardown = e, t;
}
function wn(e) {
	yn("$effect");
	var t = U.f;
	if (!H && t & 32 && N !== null && !N.i) {
		var n = N;
		(n.e ??= []).push(e);
	} else return Tn(e);
}
function Tn(e) {
	return xn(4 | T, e);
}
function En(e) {
	return yn("$effect.pre"), xn(8 | T, e);
}
function Dn(e) {
	Lt.ensure();
	let t = xn(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			Ln(t), n(void 0);
		}) : (Ln(t), n(void 0));
	});
}
function On(e) {
	return xn(4, e);
}
function B(e, t) {
	var n = N, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = jn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = U;
			try {
				Zn(n.parent), G(t);
			} finally {
				Zn(n);
			}
		}
	});
}
function kn() {
	var e = N;
	jn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && $e(n, v), lr(n) && mr(n), t.ran = !1;
		}
	});
}
function An(e) {
	return xn(re | w, e);
}
function jn(e, t = 0) {
	return xn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	mt(r, t, n, (t) => {
		xn(8, () => {
			e(...t.map(W));
		});
	});
}
function Mn(e, t = 0) {
	return xn(16 | t, e);
}
function Nn(e) {
	return xn(32 | w, e);
}
function Pn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = qn, n = H;
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
		e !== null && ct(() => {
			e.abort(ue);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, Fn(e, t && !n), pr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Pn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && zn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ pn(e);
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
		e.f ^= y;
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
		e.f ^= y, e.f & 1024 || ($e(e, _), Lt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ pn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Gn = null, Kn = !1, qn = !1;
function Jn(e) {
	qn = e;
}
var H = null, Yn = !1;
function Xn(e) {
	H = e;
}
var U = null;
function Zn(e) {
	U = e;
}
var Qn = null;
function $n(e) {
	H !== null && (Qn ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~te), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (lr(a) && wt(a), a.wv > e.wv) return !0;
		}
		t & 512 && kt === null && $e(e, g);
	}
	return !1;
}
function ur(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Qn !== null && Qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ur(a, t, !1) : t === a && (n ? $e(a, _) : a.f & 1024 && $e(a, v), Ht(a));
	}
}
function dr(e) {
	var t = er, n = tr, r = nr, i = H, a = Qn, o = N, s = Yn, c = or, l = e.f;
	er = null, tr = 0, nr = null, H = l & 96 ? null : e, Qn = null, He(e.ctx), Yn = !1, or = ++ar, e.ac !== null && (ct(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= ne;
		var u = e.fn, d = u();
		e.f |= x;
		var f = e.deps, p = F?.is_fork;
		if (er !== null) {
			var m;
			if (p || pr(e, tr), f !== null && tr > 0) for (f.length = tr + er.length, m = 0; m < er.length; m++) f[tr + m] = er[m];
			else e.deps = f = er;
			if (Sn() && e.f & 512) for (m = tr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && tr < f.length && (pr(e, tr), f.length = tr);
		if (Ge() && nr !== null && !Yn && f !== null && !(e.f & 6146)) for (m = 0; m < nr.length; m++) ur(nr[m], e);
		if (i !== null && i !== e) {
			if (ar++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ar;
			if (t !== null) for (let e of t) e.rv = ar;
			nr !== null && (r === null ? r = nr : r.push(...nr));
		}
		return e.f & 8388608 && (e.f ^= E), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= ne, er = t, tr = n, nr = r, H = i, Qn = a, He(o), Yn = s, or = c;
	}
}
function fr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (er === null || !n.call(er, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~te), s.v !== k && et(s), s.ac !== null && ct(() => {
			s.ac.abort(ue), s.ac = null, $e(s, _);
		}), Tt(s), pr(s, 0);
	}
}
function pr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) fr(e, n[r]);
}
function mr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		$e(e, g);
		var n = U, r = Kn;
		U = e, Kn = !(t & 96);
		try {
			t & 16777232 ? In(e) : Fn(e), Pn(e);
			var i = dr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ir;
		} finally {
			Kn = r, U = n;
		}
	}
}
async function hr() {
	await Promise.resolve(), Rt();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), H !== null && !Yn && !(U !== null && U.f & 16384) && (Qn === null || !Qn.has(e))) {
		var r = H.deps;
		if (H.f & 2097152) e.rv < ar && (e.rv = ar, er === null && r !== null && r[tr] === e ? tr++ : er === null ? er = [e] : er.push(e));
		else {
			H.deps ??= [], n.call(H.deps, e) || H.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [H] : n.call(i, H) || i.push(H);
		}
	}
	if (qn && Kt.has(e)) return Kt.get(e);
	if (t) {
		var a = e;
		if (qn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || _r(a)) && (o = Ct(a)), Kt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Yn && H !== null && (Kn || !!(H.f & 512)), c = (a.f & x) === 0;
		lr(a) && (s && (a.f |= 512), wt(a)), s && !c && (Et(a), gr(a));
	}
	if (kt?.has(e)) return kt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function gr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Et(t), gr(t));
}
function _r(e) {
	if (e.v === k) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Kt.has(t) || t.f & 2 && _r(t)) return !0;
	return !1;
}
function G(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) vr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && vr(n);
		}
	}
}
function vr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			vr(e[n], t);
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
var yr = ["touchstart", "touchmove"];
function br(e) {
	return yr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var xr = Symbol("events"), Sr = /* @__PURE__ */ new Set(), Cr = /* @__PURE__ */ new Set();
function wr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Or.call(t, e), !e.cancelBubble) return ct(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Tr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = wr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Cn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[xr] ??= {})[e] = n;
}
function Er(e) {
	for (var t = 0; t < e.length; t++) Sr.add(e[t]);
	for (var n of Cr) n(e);
}
var Dr = null;
function Or(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Dr = e;
	var s = 0, c = Dr === e && e[xr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[xr] = t;
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
		Xn(null), Zn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[xr]?.[r];
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
			e[xr] = t, delete e.currentTarget, Xn(d), Zn(f);
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
	var t = _n("template");
	return t.innerHTML = Ar(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mr(e, t) {
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
		if (A) return Mr(j, null), j;
		i === void 0 && (i = jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ fn(i)));
		var t = r || sn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ fn(t), s = t.lastChild;
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
			var e = /* @__PURE__ */ fn(jr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ fn(e);) o.appendChild(/* @__PURE__ */ fn(e));
			else o = /* @__PURE__ */ fn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ fn(t), r = t.lastChild;
			Mr(n, r);
		} else Mr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Pr(e, t) {
	return /* @__PURE__ */ Nr(e, t, "svg");
}
function Fr() {
	if (A) return Mr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = dn();
	return e.append(t, n), Mr(t, n), e;
}
function Y(e, t) {
	if (A) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = j), Ne();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Ir(e, t) {
	return Rr(e, t);
}
var Lr = /* @__PURE__ */ new Map();
function Rr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	un();
	var l = void 0, u = Dn(() => {
		var s = n ?? t.appendChild(dn());
		ft(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = N;
			if (o && (n.c = o), a && (i.$$events = a), A && Mr(t, null), l = e(t, i) || {}, A && (U.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw Oe(), Te;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = br(r);
					for (let e of [t, document]) {
						var a = Lr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Lr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Or, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(Sr)), Cr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Lr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Or), r.delete(e), r.size === 0 && Lr.delete(n)) : r.set(e, i);
			}
			Cr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return zr.set(l, u), l;
}
var zr = /* @__PURE__ */ new WeakMap(), Br = class {
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
						Wn(r, t), t.append(dn()), this.#n.set(e, {
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
		var n = F, r = gn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = dn();
			i.append(a), this.#n.set(e, {
				effect: Nn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Nn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else A && (this.anchor = j), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	A && (r = j, Ne());
	var i = new Br(e), a = n ? C : 0;
	function o(e, t) {
		if (A) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, je(!1), i.ensure(e, t), je(!0);
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
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Vr(e, t) {
	return t;
}
function Hr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Bn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Ur(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			hn(d), d.append(u), e.items.clear();
		}
		Ur(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Ur(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, Wn(a, document.createDocumentFragment())) : Ln(t[i], n);
	}
}
var Wr;
function Gr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = A ? Me(/* @__PURE__ */ fn(u)) : u.appendChild(dn());
	}
	A && Ne();
	var d = null, f = /* @__PURE__ */ P(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, qr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Yr(d, null, c)) : Hn(d) : Bn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Mn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			A && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = F, v = gn(), y = 0; y < e; y += 1) {
				A && j.nodeType === 8 && j.data === "]" && (c = j, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Zt(S.v, b), S.i && Zt(S.i, y), v && u.unskip_effect(S.e)) : (S = Jr(l, h ? c : Wr ??= dn(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = Nn(() => s(c)) : (d = Nn(() => s(Wr ??= dn())), d.f |= ee)), e > r.size && he("", "", ""), A && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
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
	h = !1, A && (c = j);
}
function Kr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function qr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Kr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Hn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Yr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Xr(e, d, _), Xr(e, _, y), Yr(_, y, n), d = _, p = [], m = [], l = Kr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Yr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Xr(e, S.prev, C.next), Xr(e, d, S), Xr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Yr(_, l, n), Xr(e, _.prev, _.next), Xr(e, _, d === null ? e.effect.first : d.next), Xr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Kr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Kr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Ur(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Kr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Hr(e, w, te);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Jr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Jt(n) : /* @__PURE__ */ I(n, !1, !1) : null, l = o & 2 ? Jt(i) : null;
	return {
		v: c,
		i: l,
		e: Nn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Yr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ pn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Xr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function Zr(e, t, n, r, i) {
	A && Ne();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Qr(e, t, n) {
	On(() => {
		var r = G(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			jn(() => {
				var e = n();
				K(e), i && Re(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function $r(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = $r(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function ei() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = $r(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function ti(e) {
	return typeof e == "object" ? ei(e) : e ?? "";
}
var ni = [..." 	\n\r\f\xA0\v﻿"];
function ri(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || ni.includes(r[o - 1])) && (s === r.length || ni.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function ii(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ai(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function oi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ai)), i && c.push(...Object.keys(i).map(ai));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ai(e.substring(l, u).trim());
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
		return r && (n += ii(r)), i && (n += ii(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function si(e, t, n, r, i, a) {
	var o = e[oe];
	if (A || o !== n || o === void 0) {
		var s = ri(n, r, a);
		(!A || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ci(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function li(e, t, n, r) {
	var i = e[se];
	if (A || i !== t) {
		var a = oi(t, r);
		(!A || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[se] = t;
	} else r && (Array.isArray(r) ? (ci(e, n?.[0], r[0]), ci(e, n?.[1], r[1], "important")) : ci(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function ui(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(pi(i));
		return;
	}
	for (i of t.options) if (rn(pi(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function di(e) {
	var t = new MutationObserver(() => {
		"__value" in e && ui(e, e.__value);
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
function fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	lt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), pi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && pi(o);
		}
		n(a), e.__value = a, F !== null && r.add(F);
	}), On(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = F;
			if (r.has(o)) return;
		}
		if (ui(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = pi(s), n(a));
		}
		e.__value = a, i = !1;
	}), di(e);
}
function pi(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var mi = Symbol("is custom element"), hi = Symbol("is html"), gi = de ? "link" : "LINK", _i = de ? "progress" : "PROGRESS";
function vi(e) {
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
		e[le] = n, Je(n), st();
	}
}
function yi(e, t) {
	var n = xi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === _i) && (e.value = t ?? "");
}
function bi(e, t) {
	var n = xi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = xi(e);
	A && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === gi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ci(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function xi(e) {
	return e[ae] ??= {
		[mi]: e.nodeName.includes("-"),
		[hi]: e.namespaceURI === Ee
	};
}
var Si = /* @__PURE__ */ new Map();
function Ci(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Si.get(t);
	if (n) return n;
	Si.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function wi(e, t, n) {
	var r = a(e, t);
	r && r.set && (e[t] = n, Cn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ti(e, t) {
	return e === t || e?.[D] === t;
}
function Ei(e = {}, t, n, r) {
	var i = N.r, a = U;
	return On(() => {
		var o, s;
		return jn(() => {
			o = s, s = r?.() || [], G(() => {
				Ti(n(...s), e) || (t(e, ...s), o && Ti(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ti(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function Di(e = !1) {
	let t = N, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ vt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && En(() => {
		Oi(t, r), p(n.b);
	}), wn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && wn(() => {
		Oi(t, r), p(n.a);
	});
}
function Oi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ vt(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = D in e || O in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = it(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
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
	var v = !1, y = (n & 1 ? vt : P)(() => (v = !1, g()));
	o && W(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? tn(e) : e;
			return L(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return qn && v || b.f & 16384 ? y.v : W(y);
	});
}
function ki(e) {
	N === null && pe("onMount"), Be && N.l !== null ? ji(N).m.push(e) : wn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function Ai(e) {
	N === null && pe("onDestroy"), ki(() => () => G(e));
}
function ji(e) {
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
//#region viewer/assets/icon-choice.js
function Mi(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function Ni(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var Pi = /* @__PURE__ */ J("<button type=\"button\" tabindex=\"-1\"><!></button>"), Fi = /* @__PURE__ */ J("<div role=\"group\"></div>"), Ii = /* @__PURE__ */ J("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Li(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I(), h = /* @__PURE__ */ I(!1), g = /* @__PURE__ */ I(!1), _ = /* @__PURE__ */ I(!1), v = /* @__PURE__ */ I(null), y = /* @__PURE__ */ I(0), b = /* @__PURE__ */ I(0), x = /* @__PURE__ */ I(!1), S = /* @__PURE__ */ I(null), C = 0;
	function w(e = !1) {
		clearTimeout(W(m)), C++, W(S) !== null && W(f)?.hasPointerCapture(W(S)) && W(f).releasePointerCapture(W(S)), L(S, null), L(h, !1), L(g, !1), L(v, null), L(x, !1), e && W(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function ee(e = !1) {
		if (!W(r).length) return;
		L(h, !0), L(x, !1);
		let t = ++C;
		if (await hr(), !W(h) || t !== C || !W(p)) return;
		let n = W(f).getBoundingClientRect(), i = W(p).getBoundingClientRect(), o = [...W(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (L(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), L(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (L(y, n.right + 4), W(y) + i.width > window.innerWidth - 4 && L(y, n.left - i.width - 4), L(b, n.top + (n.height - i.height) / 2)) : (L(y, n.left + (n.width - i.width) / 2), L(b, n.bottom + 4), W(b) + i.height > window.innerHeight - 4 && L(b, n.top - i.height - 4)), L(y, Math.max(4, Math.min(W(y), window.innerWidth - i.width - 4))), L(b, Math.max(4, Math.min(W(b), window.innerHeight - i.height - 4))), L(x, !0), await hr(), e && W(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && W(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ne(e) {
		if (clearTimeout(W(m)), W(S) !== null) {
			if (W(g)) {
				let t = te(e);
				L(_, !0), t === null ? w(!0) : T(W(r).find((e) => String(e.id) === t).id);
			} else {
				let t = W(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (L(_, !0), w(!0));
			}
			L(S, null);
		}
	}
	function re(e) {
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
			ee(!0);
			return;
		}
		let n = [...W(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function E() {
		W(S) !== null && L(_, !0), w(W(d)?.contains(document.activeElement));
	}
	Ai(() => clearTimeout(W(m))), B(() => (K(i()), K(a())), () => {
		L(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (K(i()), K(a()), K(l())), () => {
		L(r, Ni(i(), a(), l()));
	}), kn(), Di();
	var D = Ii();
	Tr("pointerdown", an, (e) => {
		W(d)?.contains(e.target) || w();
	}), Tr("resize", an, E), Tr("blur", an, E), Tr("scroll", on, (e) => {
		W(p)?.contains(e.target) || E();
	}, !0);
	var O = R(D);
	let ie;
	Zr(R(O), t, "icon", { get item() {
		return W(n);
	} }, null), M(O), Ei(O, (e) => L(f, e), () => W(f));
	var ae = z(O, 2), oe = (e) => {
		var n = Fi();
		let i, s;
		Gr(n, 5, () => W(r), (e) => e.id, (e, n) => {
			var r = Pi();
			let i;
			Zr(R(r), t, "icon", { get item() {
				return W(n);
			} }, null), M(r), V((e) => {
				i = si(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (W(n), G(() => W(n).id))), Q(r, "aria-label", (W(n), G(() => W(n).label))), Q(r, "title", (W(n), G(() => W(n).label))), Q(r, "aria-pressed", (W(n), K(a()), G(() => W(n).kind === "action" ? void 0 : W(n).id === a())));
			}, [() => ({ "icon-choice-hover": W(v) === String(W(n).id) })]), q("keydown", r, re), q("click", r, () => T(W(n).id)), Y(e, r);
		}), M(n), Ei(n, (e) => L(p, e), () => W(p)), V(() => {
			i = si(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = li(n, "", s, {
				left: `${W(y)}px`,
				top: `${W(b)}px`,
				visibility: W(x) ? "visible" : "hidden"
			});
		}), Y(e, n);
	};
	Z(ae, (e) => {
		W(h) && e(oe);
	}), M(D), Ei(D, (e) => L(d, e), () => W(d)), V(() => {
		Q(D, "aria-label", o()), Q(O, "aria-label", (K(o()), W(n), G(() => `${o()}：${W(n)?.label ?? ""}`))), Q(O, "aria-expanded", s() === "cycle" ? void 0 : W(h)), Q(O, "title", (K(o()), W(n), K(s()), G(() => `${o()}：${W(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), O.disabled = !W(n), ie = li(O, "", ie, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), q("focusout", D, (e) => {
		W(d).contains(e.relatedTarget) || w();
	}), q("keydown", O, re), q("pointerdown", O, (e) => {
		e.button === 0 && (L(_, !1), !(s() === "cycle" || W(h)) && (L(S, e.pointerId), W(f).setPointerCapture(W(S)), clearTimeout(W(m)), L(m, setTimeout(() => {
			L(g, !0), ee();
		}, 300))));
	}), q("pointermove", O, (e) => {
		W(g) && L(v, te(e));
	}), q("pointerup", O, ne), Tr("pointercancel", O, E), q("click", O, () => {
		if (W(_)) {
			L(_, !1);
			return;
		}
		if (W(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") ee(!0);
		else {
			let e = Mi(i(), a());
			e !== void 0 && u()(e);
		}
	}), Y(e, D), We();
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
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var Ri = /* @__PURE__ */ Pr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), zi = /* @__PURE__ */ Pr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), Bi = /* @__PURE__ */ Pr("<path d=\"M3 3l18 18\"></path>"), Vi = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function Hi(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = Vi(), a = R(i), o = (e) => {
		Y(e, Ri());
	}, s = (e) => {
		var t = zi();
		Pe(), Y(e, t);
	};
	Z(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		Y(e, Bi());
	};
	Z(c, (e) => {
		r() && e(l);
	}), M(i), Y(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var Ui = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function Wi(e, t) {
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
	Li(e, {
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
			var r = Fr(), i = mn(r), a = (e) => {
				Y(e, Ui());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "closed"))), r = /* @__PURE__ */ P(() => (K(W(n)), G(() => W(n)?.id === "disabled")));
					Hi(e, {
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
function Gi(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function Ki(e, t, n) {
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
function qi(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Ji(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function Yi(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function Xi(e, t, n, r = [], i = null) {
	let a = n === "free" ? Zi(e, t) : n === "reverse" ? [...e].reverse() : e, o = new Map(e.map((e) => [e.id, e])), s = new Set(r), c = r.length ? [...s].filter((e) => o.has(e)).map((e) => o.get(e)).concat(a.filter((e) => !s.has(e.id))) : a;
	return i === null || !o.has(i) ? c : [o.get(i), ...c.filter((e) => e.id !== i)];
}
function Zi(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function Qi(e, t, n, r, i, a) {
	let o = qi(t, e), s = new Set(n), c = Ji(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var $i = /* @__PURE__ */ Pr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), ea = /* @__PURE__ */ Pr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), ta = /* @__PURE__ */ Pr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), na = /* @__PURE__ */ J("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), ra = /* @__PURE__ */ J("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), ia = /* @__PURE__ */ J("<p class=\"card-list-hidden\"><button type=\"button\" class=\"card-list-hidden-link\"> </button></p>"), aa = /* @__PURE__ */ J("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div> <!>", 1);
function oa(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null), f = $(t, "onSelectionChange", 8, null), p = $(t, "nextId", 8, null), m = $(t, "hiddenCount", 8, 0), h = $(t, "onShowHidden", 8, null);
	function g(e = o()) {
		return Xi(e, W(E), W(x), l() ? W(_) : [], p()).map((e) => e.id);
	}
	let _ = /* @__PURE__ */ I([]), v = null, y = $(t, "expanded", 8, !0), b = $(t, "onToggleAll", 8, () => {}), x = /* @__PURE__ */ I("forward"), S = [
		"forward",
		"reverse",
		"free"
	], C = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, w = /* @__PURE__ */ I("disabled"), T = /* @__PURE__ */ I([]);
	function ee() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: W(w),
				hiddenIds: W(T)
			}));
		} catch {}
	}
	function te(e) {
		let t = Ki(W(w), W(T), e);
		L(w, t.mode), L(T, t.hiddenIds), ge(), ee();
	}
	function ne(e, t) {
		L(T, t ? W(T).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...W(T), e])]), ge(), ee();
	}
	function re(e) {
		W(w) === "closed" && L(w, "enabled"), ne(e, !0);
	}
	let E = /* @__PURE__ */ I(null), D = /* @__PURE__ */ I(null);
	ki(() => {
		if (!f()) return;
		let e = (e) => {
			let t = e.target?.closest?.(".arrangeable-card");
			(!t || !W(oe)?.contains(t)) && L(D, null);
		}, t = () => {
			L(D, null);
		}, n = (e) => {
			e.key === "Escape" && !e.isComposing && _e();
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("focusin", e, !0), document.addEventListener("keydown", n, !0), window.addEventListener("blur", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("focusin", e, !0), document.removeEventListener("keydown", n, !0), window.removeEventListener("blur", t);
		};
	});
	let O = /* @__PURE__ */ I(null), ie = /* @__PURE__ */ I(null), ae = /* @__PURE__ */ I(null), oe = /* @__PURE__ */ I(), se = /* @__PURE__ */ I("");
	function ce(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (v !== i) {
			if (v = i, !n.includes(e)) {
				L(se, `找不到卡片 ID：${e}`);
				return;
			}
			L(_, Yi(W(_), e)), re(e), le();
		}
	}
	function le() {
		if (!c()) {
			L(se, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(W(_))), L(se, "已記住本機釘選");
		} catch {
			L(se, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function ue(e) {
		ge(), L(_, W(_).includes(e) ? W(_).filter((t) => t !== e) : Yi(W(_), e)), le();
	}
	function de(e) {
		if (v = null, L(_, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			L(_, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (L(w, "disabled"), L(T, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			L(w, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), L(T, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (L(D, null), L(O, null), L(ie, null), L(ae, null), !e) {
			L(E, null), L(x, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			L(E, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			L(x, S.includes(n) ? n : W(E) ? "free" : "forward");
		} catch {
			L(E, null), L(x, "forward");
		}
	}
	function fe(e) {
		if (L(E, e), !c()) {
			L(se, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), L(se, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			L(se, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function pe(e) {
		if (ge(), L(x, e), L(se, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, W(x));
		} catch {
			L(se, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function me(e, t, n) {
		W(x) === "free" && (l() && (W(_).includes(e) || W(_).includes(t)) || e !== t && (fe(Qi(s(), W(E), W(r).map((e) => e.id), e, t, n)), f()?.(null), L(D, e), f()?.(W(D)), await hr(), [...W(oe).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function he(e, t) {
		let n = W(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = W(r)[n + t];
		i && me(e, i.id, t > 0);
	}
	function ge() {
		L(O, null), L(ie, null), L(ae, null);
	}
	function _e() {
		let e = document.activeElement;
		W(oe)?.contains(e) && e.blur?.(), L(D, null), ge();
	}
	function ve(e, t) {
		if (l() && W(_).includes(e.id) || W(ie) === null || W(ie) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		L(ae, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => W(w), () => {
		L(n, W(w) === "enabled");
	}), B(() => (K(o()), W(E), W(x), K(l()), W(_), K(p()), K(d())), () => {
		L(i, Zi(Xi(o(), W(E), W(x), l() ? W(_) : [], p()), d()));
	}), B(() => (W(i), W(w), W(T), K(l()), W(_)), () => {
		L(r, W(i).filter((e) => Gi(e.id, W(w), W(T)) && !(l() && W(_).includes(e.id))));
	}), B(() => (K(f()), W(D)), () => {
		f()?.(W(D));
	}), B(() => K(c()), () => {
		de(c());
	}), B(() => (W(i), W(w), W(T)), () => {
		L(a, W(i).find((e) => Gi(e.id, W(w), W(T)))?.id ?? null);
	}), B(() => (K(u()), K(c()), K(s()), K(l())), () => {
		ce(u(), c(), s(), l());
	}), kn();
	var ye = {
		orderedIds: g,
		revealCard: re
	};
	Di();
	var be = aa(), xe = mn(be), Se = R(xe);
	Zr(z(R(Se), 2), t, "filters", {}, null), M(Se);
	var Ce = z(Se, 2), we = R(Ce), Te = R(we), k = R(Te);
	M(Te), M(we);
	var Ee = z(we, 2);
	{
		let e = /* @__PURE__ */ P(() => G(() => S.map((e) => ({
			id: e,
			label: C[e]
		}))));
		Li(Ee, {
			get items() {
				return W(e);
			},
			get value() {
				return W(x);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: pe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ P(() => t.item);
				var r = ta(), i = R(r), a = (e) => {
					Y(e, $i());
				}, o = (e) => {
					var t = ea(), r = mn(t), i = z(r);
					V(() => {
						Q(r, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (K(W(n)), G(() => W(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), Y(e, t);
				};
				Z(i, (e) => {
					K(W(n)), G(() => W(n).id === "free") ? e(a) : e(o, -1);
				}), M(r), Y(e, r);
			} }
		});
	}
	var De = z(Ee, 2);
	Wi(De, {
		get mode() {
			return W(w);
		},
		onChoose: te
	});
	var Oe = z(De, 2), ke = R(Oe, !0);
	M(Oe), Zr(z(Oe, 2), t, "tools", {}, null), M(Ce), M(xe);
	var Ae = z(xe, 2);
	Gr(Ae, 5, () => W(i), (e) => e.id, (e, r) => {
		var i = ra();
		let o;
		var s = R(i), c = (e) => {
			var t = na();
			let n;
			var i = R(t), a = R(i);
			M(i), M(t), V((e, r, i, o, s) => {
				n = si(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({
					"is-pinned": W(_).includes(W(r).id),
					"is-next": p() !== null && W(r).id === p()
				}),
				() => (W(_), W(r), G(() => W(_).includes(W(r).id) ? `取消釘選：${W(r).title}` : `釘選置頂：${W(r).title}`)),
				() => (W(_), W(r), G(() => W(_).includes(W(r).id))),
				() => (W(_), W(r), G(() => W(_).includes(W(r).id) ? "取消釘選" : "釘選置頂")),
				() => (W(_), W(r), K(p()), G(() => W(_).includes(W(r).id) || p() !== null && W(r).id === p() ? "currentColor" : "none"))
			]), q("click", t, () => ue(W(r).id)), Y(e, t);
		};
		Z(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(T), W(r), G(() => !W(T).includes(W(r).id))));
			Zr(u, t, "default", {
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
				onVisibleChange: (e) => ne(W(r).id, e)
			}, null);
		}
		M(i), V((e) => {
			Q(i, "hidden", e), o = si(i, 1, "arrangeable-card", null, o, {
				"card-selected": W(D) === W(r).id,
				"card-drop-before": W(ae)?.id === W(r).id && !W(ae).after,
				"card-drop-after": W(ae)?.id === W(r).id && W(ae).after
			}), Q(i, "aria-label", (W(r), W(D), G(() => `${W(r).title}${W(D) === W(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (W(r), G(() => W(r).id))), Q(i, "draggable", (W(x), W(O), W(r), G(() => W(x) === "free" && W(O) === W(r).id)));
		}, [() => (K(Gi), W(r), W(w), W(T), G(() => !Gi(W(r).id, W(w), W(T))))]), q("pointerdown", i, (e) => {
			L(O, null), e.button === 0 && (L(D, W(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (W(x) !== "free" || e.pointerType !== "mouse" || l() && W(_).includes(W(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || L(O, W(r).id)));
		}), q("focusin", i, () => {
			L(D, W(r).id);
		}), q("input", i, () => {
			L(D, W(r).id);
		}), q("pointerup", i, () => {
			L(O, null);
		}), q("keydown", i, (e) => {
			if (e.key === "Escape" && !e.isComposing) {
				_e();
				return;
			}
			e.target === e.currentTarget && ((e.key === "Enter" || e.key === " ") && (e.preventDefault(), L(D, W(r).id)), W(x) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), he(W(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Tr("dragstart", i, (e) => {
			W(x) === "free" && W(O) === W(r).id && e.target === e.currentTarget && (L(ie, W(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(W(r).id)));
		}), Tr("dragend", i, ge), Tr("dragover", i, (e) => ve(W(r), e)), Tr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(ae, null);
		}), Tr("drop", i, (e) => {
			W(ie) !== null && W(ae)?.id === W(r).id && (e.preventDefault(), me(W(ie), W(r).id, W(ae).after), ge());
		}), Y(e, i);
	}), M(Ae), Ei(Ae, (e) => L(oe, e), () => W(oe));
	var A = z(Ae, 2), je = (e) => {
		var t = ia(), n = R(t), r = R(n);
		M(n), M(t), V(() => X(r, `…顯示隱藏項目(${m() ?? ""})`)), q("click", n, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	return Z(A, (e) => {
		m() > 0 && h() && e(je);
	}), V(() => {
		Q(we, "aria-label", y() ? "全部收合" : "全部展開"), Q(we, "title", y() ? "全部收合" : "全部展開"), Q(k, "d", y() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), X(ke, W(se));
	}), q("click", we, () => b()(!y())), Y(e, be), wi(t, "orderedIds", g), wi(t, "revealCard", re), We(ye);
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
//#region viewer/assets/focus-shield.js
function sa({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, now: n = () => Date.now(), activationWindowMs: r = 100, storage: i, key: a = `taskprogress.mouse-activation.v2:${e.location?.pathname ?? ""}` } = {}) {
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
function ca(e, t) {
	Ue(t, !1), ki(() => sa()), Di(), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var la = /* @__PURE__ */ J("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ua(e, t) {
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
	Di();
	var _ = Fr(), v = mn(_), y = (e) => {
		var n = la(), l = R(n), d = R(l), f = R(d), _ = R(f, !0);
		M(f);
		var v = z(f, 2), y = R(v, !0);
		M(v), M(d);
		var b = z(d, 2);
		M(l), Zr(z(l, 2), t, "default", { close: h }, null), M(n), Ei(n, (e) => L(u, e), () => W(u)), Qr(n, (e) => p?.(e)), V(() => {
			si(n, 1, ti(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), X(_, a()), Q(v, "id", s()), X(y, o()), Q(b, "aria-label", c());
		}), Tr("close", n, m), q("click", n, g), q("click", b, h), Y(e, n);
	};
	Z(v, (e) => {
		n() && e(y);
	}), Y(e, _), We();
}
Er(["click"]);
//#endregion
//#region viewer/assets/inline-links.js
function da(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function fa(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = da(t.slice(r.lastIndex, e - 1));
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
function pa(e, t, { emphasis: n = !1 } = {}) {
	let r = e.createElement("a");
	return r.className = n ? "inline-link inline-link--emphasis" : "inline-link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text, r;
}
function ma(e, t, n = {}) {
	let r = e.ownerDocument;
	e.replaceChildren(...fa(t).map((e) => e.href ? pa(r, e, n) : r.createTextNode(e.text)));
}
function ha(e, t = {}) {
	let n = null;
	function r(t = {}) {
		let r = String(t.text ?? ""), i = t.emphasis === !0;
		n && n.text === r && n.emphasis === i || (n = {
			text: r,
			emphasis: i
		}, ma(e, r, { emphasis: i }));
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
var ga = /* @__PURE__ */ J("<span></span>");
function _a(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "emphasis", 8, !1);
	var i = ga();
	Qr(i, (e, t) => ha?.(e, t), () => ({
		text: n(),
		emphasis: r()
	})), Y(e, i);
}
//#endregion
//#region viewer/assets/item-reference.js
async function va(e, t = globalThis.document) {
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
//#region experiments/editor-svelte-spike/src/CopyIdButton.svelte
var ya = /* @__PURE__ */ J("<button type=\"button\"> </button>");
function ba(e, t) {
	Ue(t, !1);
	let n = $(t, "id", 8), r = $(t, "label", 8), i = /* @__PURE__ */ I(""), a;
	async function o(e) {
		e.stopPropagation(), clearTimeout(a);
		let t = await va(n());
		L(i, t ? "已複製" : "無法複製"), a = setTimeout(() => {
			L(i, "");
		}, 1500);
	}
	Di();
	var s = ya();
	let c;
	var l = R(s, !0);
	M(s), V(() => {
		c = si(s, 1, "task-id-copy", null, c, {
			"is-done": W(i),
			"is-copied": W(i) === "已複製"
		}), Q(s, "aria-label", W(i) || `複製「${r()}」的卡片 ID`), Q(s, "title", W(i) || n()), X(l, W(i) === "已複製" ? "✓" : W(i) ? "✕" : "⧉");
	}), q("click", s, o), Y(e, s), We();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HistoryTools.svelte
var xa = /* @__PURE__ */ J("<li class=\"history-cursor svelte-zh2lyg\" aria-current=\"step\">目前位置：保留紀錄的起點</li>"), Sa = /* @__PURE__ */ J("<li class=\"history-cursor svelte-zh2lyg\" aria-current=\"step\">目前位置</li>"), Ca = /* @__PURE__ */ J("<li><span class=\"svelte-zh2lyg\"> </span><small class=\"svelte-zh2lyg\"> </small></li> <!>", 1), wa = /* @__PURE__ */ J("<ol class=\"history-entries svelte-zh2lyg\" aria-label=\"操作紀錄\"><!> <!></ol>"), Ta = /* @__PURE__ */ J("<p class=\"history-note svelte-zh2lyg\">尚無操作紀錄。</p>"), Ea = /* @__PURE__ */ J("<p class=\"svelte-zh2lyg\">清除全部復原與重做紀錄？目前內容與已保存資料會保留，清除後無法復原這些紀錄。</p> <div class=\"history-actions svelte-zh2lyg\"><button type=\"button\" class=\"svelte-zh2lyg\">確認清除歷史</button> <button type=\"button\" class=\"svelte-zh2lyg\">取消</button></div>", 1), Da = /* @__PURE__ */ J("<button type=\"button\" class=\"svelte-zh2lyg\">清除歷史…</button>"), Oa = /* @__PURE__ */ J("<div class=\"history-panel svelte-zh2lyg\"><p class=\"history-note svelte-zh2lyg\">紀錄只保留在目前頁面，重新整理或離開後會清除。復原與重做仍依編輯器的保存方式處理。</p> <div class=\"history-actions svelte-zh2lyg\" role=\"group\" aria-label=\"逐步操作歷史\"><button type=\"button\" class=\"svelte-zh2lyg\">復原一步</button> <button type=\"button\" class=\"svelte-zh2lyg\">重做一步</button></div> <p class=\"history-position svelte-zh2lyg\" role=\"status\"> </p> <!> <div class=\"history-clear svelte-zh2lyg\"><!></div></div>"), ka = /* @__PURE__ */ J("<div class=\"history-capsule svelte-zh2lyg\" role=\"group\" aria-label=\"編輯歷史\"><button type=\"button\" class=\"svelte-zh2lyg\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"svelte-zh2lyg\"><path d=\"M9 4 4 9l5 5M4 9h9a7 7 0 0 1 0 14\" transform=\"translate(0 -2)\"></path></svg></button> <button type=\"button\" class=\"svelte-zh2lyg\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"svelte-zh2lyg\"><path d=\"m15 4 5 5-5 5m5-5h-9a7 7 0 0 0 0 14\" transform=\"translate(0 -2)\"></path></svg></button> <button type=\"button\" aria-label=\"開啟歷史面板\" title=\"歷史面板\" aria-haspopup=\"dialog\" class=\"svelte-zh2lyg\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"svelte-zh2lyg\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\"></rect><path d=\"M8 3v18m4-12h5m-5 4h5m-5 4h3\"></path></svg></button></div> <!>", 1);
function Aa(e, t) {
	Ue(t, !1);
	let n = $(t, "id", 8, "history-tools"), r = $(t, "history", 24, () => ({
		entries: [],
		undoDepth: 0,
		redoDepth: 0,
		canUndo: !1,
		canRedo: !1,
		canClear: !1
	})), i = $(t, "disabled", 8, !1), a = $(t, "onUndo", 8, () => {}), o = $(t, "onRedo", 8, () => {}), s = $(t, "onClear", 8, () => {}), c = $(t, "onOpenChange", 8, () => {}), l = /* @__PURE__ */ I(!1), u = /* @__PURE__ */ I(!1);
	function d(e) {
		L(l, e), L(u, !1), c()(e);
	}
	function f() {
		i() || !r().canClear || (s()(), L(u, !1));
	}
	Di();
	var p = ka(), m = mn(p), h = R(m), g = z(h, 2), _ = z(g, 2);
	M(m);
	var v = z(m, 2);
	{
		let e = /* @__PURE__ */ P(() => `${n()}-dialog`), t = /* @__PURE__ */ P(() => `${n()}-title`);
		ua(v, {
			get open() {
				return W(l);
			},
			get id() {
				return W(e);
			},
			title: "編輯歷史",
			get titleId() {
				return W(t);
			},
			onClose: () => d(!1),
			children: (e, t) => {
				var n = Oa(), s = z(R(n), 2), c = R(s), l = z(c, 2);
				M(s);
				var d = z(s, 2), p = R(d);
				M(d);
				var m = z(d, 2), h = (e) => {
					var t = wa(), n = R(t), i = (e) => {
						Y(e, xa());
					};
					Z(n, (e) => {
						K(r()), G(() => r().undoDepth === 0) && e(i);
					}), Gr(z(n, 2), 1, () => (K(r()), G(() => r().entries)), (e) => e.id, (e, t) => {
						var n = Ca(), i = mn(n);
						let a;
						var o = R(i), s = R(o, !0);
						M(o);
						var c = z(o), l = R(c, !0);
						M(c), M(i);
						var u = z(i, 2), d = (e) => {
							Y(e, Sa());
						};
						Z(u, (e) => {
							W(t), K(r()), G(() => W(t).applied && W(t).id === r().entries[r().undoDepth - 1]?.id) && e(d);
						}), V(() => {
							a = si(i, 1, "svelte-zh2lyg", null, a, { "history-redo": !W(t).applied }), X(s, (W(t), G(() => W(t).label))), X(l, (W(t), G(() => W(t).applied ? "已套用" : "可重做")));
						}), Y(e, n);
					}), M(t), Y(e, t);
				}, g = (e) => {
					Y(e, Ta());
				};
				Z(m, (e) => {
					K(r()), G(() => r().entries.length) ? e(h) : e(g, -1);
				});
				var _ = z(m, 2), v = R(_), y = (e) => {
					var t = Ea(), n = z(mn(t), 2), a = R(n), o = z(a, 2);
					M(n), V(() => a.disabled = (K(i()), K(r()), G(() => i() || !r().canClear))), q("click", a, f), q("click", o, () => {
						L(u, !1);
					}), Y(e, t);
				}, b = (e) => {
					var t = Da();
					V(() => t.disabled = (K(i()), K(r()), G(() => i() || !r().canClear))), q("click", t, () => {
						L(u, !0);
					}), Y(e, t);
				};
				Z(v, (e) => {
					W(u) ? e(y) : e(b, -1);
				}), M(_), M(n), V(() => {
					c.disabled = (K(i()), K(r()), G(() => i() || !r().canUndo)), l.disabled = (K(i()), K(r()), G(() => i() || !r().canRedo)), X(p, `目前位置：${K(r()), G(() => r().undoDepth) ?? ""}／${K(r()), G(() => r().entries.length) ?? ""}；可重做 ${K(r()), G(() => r().redoDepth) ?? ""} 步`);
				}), q("click", c, function(...e) {
					a()?.apply(this, e);
				}), q("click", l, function(...e) {
					o()?.apply(this, e);
				}), Y(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	V(() => {
		Q(h, "aria-label", (K(r()), G(() => `復原（${r().undoDepth}）`))), Q(h, "title", (K(r()), G(() => `復原（${r().undoDepth}）`))), h.disabled = (K(i()), K(r()), G(() => i() || !r().canUndo)), Q(g, "aria-label", (K(r()), G(() => `重做（${r().redoDepth}）`))), Q(g, "title", (K(r()), G(() => `重做（${r().redoDepth}）`))), g.disabled = (K(i()), K(r()), G(() => i() || !r().canRedo)), Q(_, "aria-expanded", W(l)), Q(_, "aria-controls", `${n()}-dialog`), _.disabled = i();
	}), q("click", h, function(...e) {
		a()?.apply(this, e);
	}), q("click", g, function(...e) {
		o()?.apply(this, e);
	}), q("click", _, () => d(!0)), Y(e, p), We();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var ja = /* @__PURE__ */ J("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), Ma = /* @__PURE__ */ J("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function Na(e, t) {
	Ue(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	Di();
	var l = Ma(), u = mn(l);
	let d;
	var f = R(u), p = R(f), m = R(p, !0);
	M(p), M(f);
	var h = z(f, 2), g = (e) => {
		var t = ja(), n = R(t);
		{
			let e = /* @__PURE__ */ P(() => !r());
			Hi(n, { get closed() {
				return W(e);
			} });
		}
		M(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), q("click", t, () => i()(!r())), Y(e, t);
	};
	Z(h, (e) => {
		n() && e(g);
	}), Zr(z(h, 2), t, "header", {}, null), M(u);
	var _ = z(u, 2);
	Zr(R(_), t, "default", {}, null), M(_), V(() => {
		d = si(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), X(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), q("click", f, () => c()(!a())), Y(e, l), We();
}
Er(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Pa = /* @__PURE__ */ J("<span></span>"), Fa = /* @__PURE__ */ J("<span class=\"time-chevron\">›</span>"), Ia = /* @__PURE__ */ J("<button type=\"button\"><span> </span> <!> <!></button>"), La = /* @__PURE__ */ J("<div role=\"toolbar\"></div>");
function Ra(e, t) {
	Ue(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ I(null), c = /* @__PURE__ */ I(null), l = !1, u = null, d = /* @__PURE__ */ I(null), f = /* @__PURE__ */ I();
	async function p() {
		let e = W(d);
		L(d, null), await hr(), [...W(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function re(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	B(() => (K(n()), W(d)), () => {
		n() && W(d) && p();
	}), kn(), Di();
	var E = La();
	Gr(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ P(() => (W(t), G(() => W(t).sortable !== !1)));
		var r = Ia(), i = R(r), a = R(i, !0);
		M(i);
		var o = z(i, 2), l = (e) => {
			var n = Pa();
			V(() => si(n, 1, (W(t), G(() => `time-risk-dot ${W(t).dotClass ?? ""}`)))), Y(e, n);
		};
		Z(o, (e) => {
			W(t), G(() => W(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			Y(e, Fa());
		};
		Z(u, (e) => {
			W(t), G(() => W(t).showChevron) && e(d);
		}), M(r), V((e) => {
			si(r, 1, e), Q(r, "data-capsule-id", (W(t), G(() => W(t).id))), Q(r, "data-reorder-capsule", W(n) ? "true" : null), Q(r, "aria-pressed", (W(t), G(() => W(t).pressed ?? null))), Q(r, "aria-label", (W(t), G(() => W(t).ariaLabel ?? W(t).label))), Q(r, "aria-keyshortcuts", W(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (W(t), G(() => W(t).title ?? null))), r.disabled = (W(t), G(() => W(t).disabled ?? !1)), Q(r, "draggable", W(n)), X(a, (W(t), G(() => W(t).label)));
		}, [() => (W(t), K(W(n)), W(s), W(c), G(() => `capsule-button ${W(t).className ?? ""} ${W(n) ? "capsule-sortable" : ""} ${W(s) === W(t).id ? "capsule-dragging" : ""} ${h(W(t).id, W(c))}`))]), q("click", r, (e) => b(W(t), e)), q("keydown", r, function(...e) {
			(W(n) ? (e) => x(W(t), e) : null)?.apply(this, e);
		}), Tr("dragstart", r, function(...e) {
			(W(n) ? (e) => S(W(t), e) : null)?.apply(this, e);
		}), Tr("dragover", r, function(...e) {
			(W(n) ? (e) => C(W(t), e) : null)?.apply(this, e);
		}), Tr("dragleave", r, function(...e) {
			(W(n) ? (e) => w(W(t), e) : null)?.apply(this, e);
		}), Tr("drop", r, function(...e) {
			(W(n) ? (e) => T(W(t), e) : null)?.apply(this, e);
		}), Tr("dragend", r, function(...e) {
			(W(n) ? ee : null)?.apply(this, e);
		}), q("pointerdown", r, function(...e) {
			(W(n) ? (e) => te(W(t), e) : null)?.apply(this, e);
		}), q("pointermove", r, function(...e) {
			(W(n) ? (e) => ne(W(t), e) : null)?.apply(this, e);
		}), q("pointerup", r, function(...e) {
			(W(n) ? re : null)?.apply(this, e);
		}), Tr("pointercancel", r, function(...e) {
			(W(n) ? re : null)?.apply(this, e);
		}), Y(e, r);
	}), M(E), Ei(E, (e) => L(f, e), () => W(f)), V(() => {
		si(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), Y(e, E), We();
}
Er([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region viewer/assets/filter-selection.js
var za = "__default__";
function Ba(e) {
	return [...new Set(e)];
}
function Va(e = []) {
	let t = Ba(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function Ha(e, t, n, r = t) {
	let i = Va(t), a = Object.freeze({
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
function Ua(e, t, n) {
	if (e) try {
		(n ?? globalThis.sessionStorage).setItem(e, JSON.stringify([...t.selected]));
	} catch {}
}
function Wa(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function Ga(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function Ka(e) {
	let t = Wa(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function qa(e, t) {
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
			id: za,
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
		L(i, s().length > 0 ? s() : [za, ...o().map((e) => e.id)]);
	}), B(() => (W(i), W(n), W(r), K(c()), K(p())), () => {
		L(a, W(i).map((e) => e === "__default__" ? W(n) : W(r).get(e)).filter(Boolean).map((e) => e === W(n) ? e : v(e, c(), p())));
	}), kn(), Di();
	{
		let t = /* @__PURE__ */ P(() => `filter-strip ${f()}`);
		Ra(e, {
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
//#region viewer/assets/completed-stacking.js
function Ja(e) {
	let t = typeof e == "string" ? Date.parse(e) : NaN;
	return Number.isNaN(t) ? null : t;
}
function Ya(e) {
	let t = (e ?? []).map((e, t) => ({
		decision: e,
		index: t
	})), n = t.filter(({ decision: e }) => e?.status !== "decided"), r = t.filter(({ decision: e }) => e?.status === "decided").sort((e, t) => (Ja(t.decision.answer?.confirmed_at) ?? -1) - (Ja(e.decision.answer?.confirmed_at) ?? -1) || e.index - t.index);
	return [...n, ...r].map(({ decision: e }) => e);
}
//#endregion
//#region viewer/assets/theme-model.js
var Xa = "task-progress.theme.v1", Za = [
	"system",
	"light",
	"dark",
	"custom"
], Qa = [
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
], $a = Object.freeze({
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
}), eo = Object.freeze({
	version: 1,
	mode: "system"
}), to = /^#[0-9a-f]{6}$/i;
function no(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ro(e) {
	return typeof e == "string" && to.test(e);
}
function io(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = $a[n], i = { base: n };
	for (let e of Qa) {
		let n = t[e.key];
		i[e.key] = ro(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function ao(e) {
	if (!no(e) || e.version !== 1 || !Za.includes(e.mode)) return { ...eo };
	let t = {
		version: 1,
		mode: e.mode
	};
	return no(e.custom) ? t.custom = io(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = io()), t;
}
function oo(e) {
	try {
		let t = e?.getItem(Xa);
		return t ? ao(JSON.parse(t)) : { ...eo };
	} catch {
		return { ...eo };
	}
}
function so(e, t) {
	let n = ao(t);
	try {
		e?.setItem(Xa, JSON.stringify(n));
	} catch {}
	return n;
}
function co(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function lo(e, t) {
	let n = ao(t);
	e.dataset.theme = n.mode;
	for (let t of Qa) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? io();
		e.dataset.themeBase = t.base;
		for (let n of Qa) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function uo(e, t, n = "light") {
	let r = ao(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = io(n)), ao(i);
}
function fo(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function po(e, t) {
	if (!ro(e) || !ro(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => fo(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function mo(e) {
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
	].filter(([, e, t]) => po(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var ho = /* @__PURE__ */ J("<option> </option>"), go = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), _o = /* @__PURE__ */ J("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), vo = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function yo(e, t) {
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ I(!1), p = /* @__PURE__ */ I([]), m = /* @__PURE__ */ I(a()), h = /* @__PURE__ */ I(o()?.base ?? s()), g = /* @__PURE__ */ I(v(io(W(h)))), _ = /* @__PURE__ */ I({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Qa.map((t) => [t.key, e[t.key]]));
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
		y(o() ? io(o().base, o()) : io(s())), L(f, !0);
	}
	function S() {
		L(f, !1);
	}
	function C(e) {
		y(io(e.currentTarget.value));
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
	function ee() {
		L(m, a()), S();
	}
	function te() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(io(W(h), W(_))), S();
	}
	B(() => K(a()), () => {
		L(m, a());
	}), B(() => (W(h), W(_)), () => {
		L(n, io(W(h), W(_)));
	}), B(() => W(n), () => {
		L(r, mo(W(n)));
	}), B(() => W(r), () => {
		L(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), kn(), Di();
	var ne = vo(), re = mn(ne), E = z(R(re), 2);
	Gr(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = ho(), r = R(n, !0);
		M(n);
		var i = {};
		V(() => {
			X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), Y(e, n);
	}), M(E), M(re), ua(z(re, 2), {
		get open() {
			return W(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: ee,
		children: (e, t) => {
			var a = _o(), o = z(mn(a), 2), s = z(R(o), 2), c = R(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", M(s);
			var u;
			di(s), M(o);
			var d = z(o, 2);
			Gr(d, 7, () => Qa, (e) => e.key, (e, t, r) => {
				var i = go(), a = R(i), o = R(a, !0);
				M(a);
				var s = z(a, 2), c = R(s);
				vi(c);
				var l = z(c, 2);
				vi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ei(l, (e, t) => Xt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), M(s), M(i), V(() => {
					X(o, (W(t), G(() => W(t).label))), Q(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), yi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Q(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), yi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
				}), q("input", c, (e) => w(W(t), W(r), e)), q("input", l, (e) => T(W(t), e)), Y(e, i);
			}), M(d);
			var f = z(d, 2);
			let m;
			var _ = R(f, !0);
			M(f);
			var v = z(f, 2), b = R(v), x = z(b, 4), S = z(x, 2);
			M(v), V(() => {
				u !== (u = W(h)) && (s.value = (s.__value = W(h)) ?? "", ui(s, W(h))), m = si(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": W(r).length > 0 }), X(_, W(i));
			}), q("change", s, C), q("click", b, () => y(io(W(h)))), q("click", x, ee), q("click", S, te), Y(e, a);
		},
		$$slots: { default: !0 }
	}), q("change", E, b), fi(E, () => W(m), (e) => L(m, e)), Y(e, ne), We();
}
Er([
	"change",
	"input",
	"click"
]);
//#endregion
//#region viewer/assets/theme-control.js
function bo({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = oo(t);
	e && lo(e, r);
	function i(n) {
		return r = so(t, n), e && lo(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return co(n);
		},
		setMode(e) {
			return i(uo(r, e, co(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: io(e?.base, e ?? {})
			});
		}
	};
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
var { createEditorTransaction: xo } = globalThis.TaskProgressEditorTransactionRuntime, So = (e) => structuredClone(e), Co = (e) => e && typeof e == "object" ? Array.isArray(e) ? e.map(Co) : Object.fromEntries(Object.keys(e).sort().map((t) => [t, Co(e[t])])) : e, wo = (e, t) => JSON.stringify(Co(e)) === JSON.stringify(Co(t));
function To(e) {
	let t = So(e), n = Object.create(null), r = null, i = null, a = !1, o = (e) => t.document.decisions.find((t) => t.id === e), s = (e) => ({
		choice: e.answer?.kind === "other" ? "__other" : e.answer?.option_id ?? "",
		other: e.answer?.kind === "other" ? e.answer.text : ""
	}), c = () => Object.fromEntries(t.document.decisions.map((e) => [e.id, {
		choice: n[e.id]?.choice ?? (e.answer?.kind === "other" ? "__other" : e.answer?.option_id ?? ""),
		other: n[e.id]?.other ?? (e.answer?.kind === "other" ? e.answer.text : "")
	}])), l = xo(c());
	function u(e) {
		let t = n[e], i = o(e);
		t && i && !t.conflict && r?.decision_id !== e && wo({
			choice: t.choice,
			other: t.other
		}, s(i)) && delete n[e];
	}
	let d = () => !!r || a || Object.values(n).some((e) => e.conflict);
	function f(e) {
		if (d()) return [];
		let t = c();
		if (!l[e]()) return [];
		let r = [];
		for (let [e, i] of Object.entries(l.draft)) wo(t[e], i) || (n[e] = {
			base: So(o(e)),
			...So(i),
			cleared: !i.choice,
			conflict: !1
		}, wo(i, s(o(e))) && delete n[e], r.push(e));
		return r;
	}
	let p = (e) => {
		if (e.type === "clear_all") return "清除全部答案";
		let t = o(e.id)?.question ?? e.id;
		return e.type === "other" ? `${t}：編輯其他文字` : e.choice ? `${t}：選擇「${e.choice === "__other" ? "其他" : o(e.id)?.options.find((t) => t.id === e.choice)?.label ?? e.choice}」` : `${t}：取消選取`;
	};
	function m() {
		return {
			history: {
				...l.history,
				entries: l.historyEntries.map((e) => ({
					id: e.id,
					label: p(e.command),
					applied: e.applied
				})),
				canClear: !d() && (l.history.canUndo || l.history.canRedo),
				canUndo: !d() && l.history.canUndo,
				canRedo: !d() && l.history.canRedo
			},
			snapshot: So(t),
			drafts: So(n),
			pending: So(r),
			busy: a,
			dirty: Object.keys(n).length > 0
		};
	}
	function h(e, r = !1) {
		let i = !wo(t.document, e.document);
		for (let [t, r] of Object.entries(n)) {
			let n = e.document.decisions.find((e) => e.id === t);
			r.conflict = !n || !wo(r.base, n);
		}
		t = So(e), i && !r && l.commit(c());
	}
	return {
		view: m,
		updateSources(e) {
			t.sources = So(e);
		},
		undo: () => f("undo"),
		redo: () => f("redo"),
		clearHistory() {
			return !d() && (l.clearHistory(), !0);
		},
		canConfirm(e) {
			let t = n[e], i = o(e);
			return !r && !a && !!i && !!t && !t.conflict && (t.choice === "__other" ? i.allow_other && !!t.other.trim() : i.options.some((e) => e.id === t.choice));
		},
		saveOperation(e) {
			let t = n[e];
			if (r || a || !t || t.conflict || !o(e)) return null;
			if (this.canConfirm(e)) {
				let n = o(e).answer;
				return (t.choice === "__other" ? n?.kind === "other" && n.text === t.other : n?.kind === "option" && n.option_id === t.choice) ? null : "confirm";
			}
			return o(e).answer && t.cleared && !t.choice || o(e).answer && o(e).allow_other && t.choice === "__other" && !t.other.trim() ? "reopen" : null;
		},
		edit(e, t) {
			if (r && !a || r?.operation === "clear_all" || !o(e)) return;
			let i = o(e).answer;
			n[e] ??= {
				base: So(o(e)),
				choice: i?.kind === "other" ? "__other" : i?.option_id ?? "",
				other: i?.kind === "other" ? i.text : "",
				conflict: !1
			}, Object.assign(n[e], { cleared: !1 }, t), n[e].cleared && !n[e].other && !i && r?.decision_id !== e && delete n[e], u(e), l.apply({
				type: Object.hasOwn(t, "choice") ? "select" : "other",
				id: e,
				...Object.hasOwn(t, "choice") ? { choice: t.choice } : {}
			}, () => c(), Object.hasOwn(t, "choice") ? "" : `other:${e}`);
		},
		select(e, t) {
			if (r && !a || r?.operation === "clear_all" || !o(e) || n[e]?.conflict) return;
			let i = o(e).answer, s = (n[e]?.choice ?? (i?.kind === "other" ? "__other" : i?.option_id ?? "")) === t ? "" : t;
			return this.edit(e, s ? { choice: s } : {
				choice: "",
				cleared: !0
			}), s;
		},
		discard(e) {
			r?.decision_id !== e && (delete n[e], l.commit(c()));
		},
		rebase(e) {
			let t = o(e), r = n[e];
			!r || !t || (r.choice && (r.choice !== "__other" && !t.options.some((e) => e.id === r.choice) || r.choice === "__other" && !t.allow_other) && (r.choice = "", r.cleared = !1), r.base = So(t), r.conflict = !1, r.cleared && !r.other && !t.answer && delete n[e], l.commit(c()));
		},
		merge: h,
		beginClearAll() {
			if (r || a) throw Error("請先查核上一筆請求的結果。");
			return r = {
				operation: "clear_all",
				expected_revision: t.revision,
				request_id: crypto.randomUUID(),
				payload: {}
			}, i = null, a = !0, So(r);
		},
		begin(e, s = "confirm") {
			if (r || a) throw Error("請先查核上一筆請求的結果。");
			let c = o(e), l = n[e], u = {};
			if (s === "confirm") {
				if (!l || l.conflict || !l.choice) throw Error("請選擇答案並處理衝突。");
				if (l.choice === "__other") {
					if (!l.other.trim()) throw Error("請輸入其他方案。");
					u = {
						kind: "other",
						text: l.other
					};
				} else u = {
					kind: "option",
					option_id: l.choice
				};
			}
			return r = {
				operation: s,
				decision_id: e,
				expected_revision: t.revision,
				expected_version: c.version,
				request_id: crypto.randomUUID(),
				payload: u
			}, i = l ? So(l) : null, a = !0, So(r);
		},
		retry() {
			if (!r || a) throw Error("沒有待查核請求。");
			return a = !0, So(r);
		},
		failed() {
			a = !1;
		},
		complete(e) {
			if (a = !1, !e.ok) {
				r = null, i = null;
				return;
			}
			let s = So(t.document);
			for (let e of s.decisions) (r?.operation === "clear_all" || e.id === r?.decision_id) && (e.answer = r?.operation === "confirm" ? So(r.payload) : null, e.status = e.answer ? "decided" : "pending");
			let d = (e) => e.decisions.map(({ last_request: e, answer: t, ...n }) => ({
				...n,
				answer: t ? Object.fromEntries(Object.entries(t).filter(([e]) => e !== "confirmed_at")) : null
			})), f = wo(d(s), d(e.document));
			if (r?.operation === "clear_all") {
				n = Object.create(null), r = null, i = null, h(e, !0), f && l.apply({ type: "clear_all" }, () => c()), l.commit(c(), { keepHistory: f });
				return;
			}
			let p = r?.decision_id, m = n[p], g = m && i && (m.choice !== i.choice || m.other !== i.other), _ = m && (g || m.choice !== "__other" && m.other || r?.operation === "reopen" && (!m.cleared || m.other)) ? So(m) : null;
			if (r && delete n[r.decision_id], r = null, i = null, h(e, !0), _) {
				let e = o(p), t = (e) => {
					if (!e) return null;
					let { answer: t, status: n, last_request: r, ...i } = e;
					return i;
				};
				_.conflict = !e || !wo(t(_.base), t(e)) || !wo(d({ decisions: [s.decisions.find((e) => e.id === p)] }), d({ decisions: [e] })), _.conflict || (_.base = So(e)), _.cleared && !_.other && !_.conflict && !e.answer || (n[p] = _);
			}
			u(p), l.commit(c(), { keepHistory: f });
		}
	};
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function Eo(e, t) {
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
function Do(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/DecisionApp.svelte
var Oo = /* @__PURE__ */ J("<p class=\"document-owner\"><a><span class=\"owner-arrow\" aria-hidden=\"true\">←</span><span class=\"owner-name\"> </span></a></p>"), ko = /* @__PURE__ */ J("<p role=\"status\"> </p>"), Ao = /* @__PURE__ */ J("<article class=\"checklist-item\"><a> </a> <p> </p></article>"), jo = /* @__PURE__ */ J("<p>尚未建立決策文件。</p>"), Mo = /* @__PURE__ */ J("<p> </p> <!> <!>", 1), No = /* @__PURE__ */ J("<button class=\"svelte-17meywc\"> </button>"), Po = /* @__PURE__ */ J("<p>目前沒有符合條件的決策項目。</p>"), Fo = /* @__PURE__ */ J("<button type=\"button\" class=\"source-link svelte-17meywc\"> </button>"), Io = /* @__PURE__ */ J("<button type=\"button\" class=\"source-link svelte-17meywc\">重新檢查來源</button>"), Lo = /* @__PURE__ */ J("<span> </span><small class=\"svelte-17meywc\"> </small> <!>", 1), Ro = /* @__PURE__ */ J("<div class=\"decision-source svelte-17meywc\"><!></div>"), zo = /* @__PURE__ */ J("<p class=\"decision-text svelte-17meywc\"><!></p>"), Bo = /* @__PURE__ */ J("<p> <!></p>"), Vo = /* @__PURE__ */ J("<div class=\"decision-description svelte-17meywc\"><!> <!></div>"), Ho = /* @__PURE__ */ J("<small class=\"svelte-17meywc\"><!></small>"), Uo = /* @__PURE__ */ J("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/> <span class=\"svelte-17meywc\"> <!></span></label>"), Wo = /* @__PURE__ */ J("<label class=\"decision-option svelte-17meywc\"><input type=\"radio\" class=\"svelte-17meywc\"/><span class=\"svelte-17meywc\">其他</span></label> <div class=\"decision-other svelte-17meywc\"><label>其他方案與理由</label><textarea class=\"svelte-17meywc\"></textarea></div>", 1), Go = /* @__PURE__ */ J("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">已核對最新題目，套用選擇</button>", 1), Ko = /* @__PURE__ */ J("<button class=\"svelte-17meywc\">重試保存</button>"), qo = /* @__PURE__ */ J("<div class=\"decision-content svelte-17meywc\"><!> <!> <fieldset class=\"svelte-17meywc\"><legend class=\"decision-visually-hidden svelte-17meywc\"> </legend> <!> <!></fieldset> <!> <div class=\"decision-actions svelte-17meywc\"><!></div></div>"), Jo = /* @__PURE__ */ J("<header slot=\"header\" class=\"checklist-item-header svelte-17meywc\"><!><h2 tabindex=\"-1\" class=\"svelte-17meywc\"> </h2><span class=\"checklist-status\"> </span></header>"), Yo = /* @__PURE__ */ J("<article><!></article>"), Xo = /* @__PURE__ */ J("<p role=\"alert\"> </p> <button class=\"svelte-17meywc\">關閉已移除題目提示</button>", 1), Zo = /* @__PURE__ */ J("<div class=\"decision-overview svelte-17meywc\"><p class=\"svelte-17meywc\"> </p> <p class=\"svelte-17meywc\">選項可隨時修改；選取「其他」後，文字更動會自動保存，空白則為待決策。未選取時可點擊文字欄編輯本頁草稿。保存失敗會保留修改供重試。</p></div> <div class=\"decision-controls svelte-17meywc\"><!> <button class=\"svelte-17meywc\">下一項待決策</button> <button class=\"svelte-17meywc\">清除全部答案</button></div> <!> <!> <!> <!>", 1), Qo = /* @__PURE__ */ J("<p class=\"decision-text svelte-17meywc\"> </p>"), $o = /* @__PURE__ */ J("<span> </span>"), es = /* @__PURE__ */ J("<pre class=\"source-content svelte-17meywc\" aria-label=\"來源文件內容\"></pre>"), ts = /* @__PURE__ */ J("<!> <!> <!>", 1), ns = /* @__PURE__ */ J("<p> </p> <p>清除成功後可在本頁按「復原」還原；重新整理或離開頁面後，歷史不會保留。</p> <form class=\"theme-dialog-actions\"><button type=\"button\" class=\"secondary-button svelte-17meywc\">取消</button> <button type=\"submit\" class=\"primary-button svelte-17meywc\">確認清除全部</button></form>", 1), rs = /* @__PURE__ */ J("<!> <main class=\"checklist-shell decisions-shell svelte-17meywc\"><header class=\"checklist-header\"><div><h1>決策項目</h1> <!></div> <!></header> <!> <!></main> <!> <!>", 1);
function is(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ I(), r = /* @__PURE__ */ I(), i = /* @__PURE__ */ I(), a = /* @__PURE__ */ I(), o = /* @__PURE__ */ I(), s = $(t, "transport", 8), c = $(t, "onPersistenceChange", 8, () => {}), l = $(t, "bindRefresh", 8, () => {}), u = /* @__PURE__ */ I(null), d = /* @__PURE__ */ I(), f = /* @__PURE__ */ I(), p = /* @__PURE__ */ I(), m = /* @__PURE__ */ I("載入中…"), g = /* @__PURE__ */ I(!0), _ = /* @__PURE__ */ I({}), v = /* @__PURE__ */ I(), y = /* @__PURE__ */ I(Ha(null, ["pending", "decided"], void 0, ["pending"])), b = null;
	function x(e) {
		L(y, e), Ua(b, W(y));
	}
	let S = /* @__PURE__ */ I(), C = /* @__PURE__ */ I(), w = /* @__PURE__ */ I(/* @__PURE__ */ new Set()), T = /* @__PURE__ */ I(!1), ee = /* @__PURE__ */ I(!1), te = /* @__PURE__ */ I(!1), ne = /* @__PURE__ */ I(!1), re = /* @__PURE__ */ I(null), E = /* @__PURE__ */ I(""), D = 0, O = /* @__PURE__ */ I({});
	function ie() {
		L(ne, !1), D++;
	}
	async function ae(e) {
		let t = ++D;
		L(ne, !0), L(re, null), L(E, "載入來源…");
		try {
			let n = await s().request({
				operation: "source",
				decision_id: e
			});
			if (t !== D) return;
			if (!n.ok) throw Error(n.error?.message ?? "無法讀取來源");
			L(re, n.source), L(O, {
				...W(O),
				[e]: {
					...n.source,
					revision: W(f).snapshot.revision,
					content: void 0
				}
			}), L(E, n.source.status === "available" ? "" : n.source.message), await hr(), document.getElementById(`source-line-${n.source.line}`)?.scrollIntoView({ block: "center" });
		} catch (e) {
			t === D && L(E, `無法讀取來源：${e.message}`);
		}
	}
	let oe = /* @__PURE__ */ I(null), se = /* @__PURE__ */ new Set(), ce = /* @__PURE__ */ I(null), le = /* @__PURE__ */ I(null), ue = /* @__PURE__ */ I();
	function de() {
		L(ce, null), L(le, null);
	}
	function pe(e) {
		let t = e.target?.closest?.(".arrangeable-card");
		if (!t || !W(ue)?.contains(t)) {
			de();
			return;
		}
		let n = t.dataset.cardId;
		if (W(ce) === n) return;
		L(ce, n);
		let r = W(i).filter((e) => W(y).selected.has(e.status) || e.id === n);
		L(le, W(v)?.orderedIds(r) ?? r.map((e) => e.id));
	}
	function me() {
		L(C, {
			mode: W(S).mode,
			custom: W(S).custom,
			systemScheme: W(S).systemScheme
		});
	}
	let he = () => {
		L(f, W(d).view());
	}, ge = (e, t) => {
		W(d).edit(e, t), he();
	}, _e = (e) => {
		if (se.add(e), L(w, new Set([...W(w)].filter((t) => t !== e))), W(T)) return;
		let t = W(d).saveOperation(e);
		if (t) return k(e, t);
	};
	function ve(e, t) {
		let n = W(d).select(e, t);
		return he(), _e(e), n;
	}
	function ye(e, t) {
		let n = W(f).drafts[e];
		ge(e, {
			other: t,
			cleared: n?.cleared ?? !1
		}), W(f).drafts[e]?.choice === "__other" && _e(e);
	}
	async function be(e) {
		if (W(T) || W(ee) || W(ne)) return;
		let t = W(d)[e]();
		he();
		for (let e of t) se.add(e), W(w).delete(e);
		L(w, new Set(W(w)));
		let n = [...se].find((e) => !W(w).has(e) && W(d).saveOperation(e));
		n && await k(n, W(d).saveOperation(n));
	}
	function xe() {
		L(oe, null);
	}
	function Se(e, t) {
		L(_, {
			...W(_),
			[e]: t
		}), Do(W(o), W(g), W(_));
	}
	function Ce(e) {
		L(g, e), L(_, {}), Do(W(o), W(g), W(_));
	}
	async function we() {
		try {
			let e = await s().load();
			if (!e.ok) throw Error(e.error.message);
			if (s().loadOwnerReport?.().then((e) => {
				L(u, e);
			}).catch(() => {}), e.files) {
				L(p, e), L(m, "");
				return;
			}
			L(d, To(e)), he(), b = `taskprogress.filters.decisions.v1:${e.document_key}`, L(y, Ha(b, ["pending", "decided"], void 0, ["pending"]));
			let t = Eo(`taskprogress.decisions:${e.document_key}`);
			L(g, t.expanded), L(_, t.overrides), L(m, "");
		} catch (e) {
			L(m, e.message);
		}
	}
	async function Te() {
		if (!(W(a) || W(f)?.busy || W(ee) || W(ne) || W(te) || W(T))) {
			L(T, !0);
			try {
				let e = await s().load();
				if (!e.ok) throw Error(e.error?.message ?? "無法載入決策文件");
				if (e.files) {
					L(p, e);
					return;
				}
				if (!W(d)) {
					L(d, To(e)), he();
					return;
				}
				e.revision === W(f)?.snapshot?.revision ? wo(e.sources, W(f)?.snapshot?.sources) || (typeof W(d).updateSources == "function" ? W(d).updateSources(e.sources) : W(d).merge(e), L(O, {}), he()) : (W(d).merge(e), L(O, {}), he());
			} catch (e) {
				console.warn("Decision foreground refresh failed:", e);
			} finally {
				L(T, !1);
			}
		}
	}
	ki(() => {
		L(S, bo()), me(), we();
		let e = (e) => {
			W(a) && (e.preventDefault(), e.returnValue = "");
		};
		return window.addEventListener("beforeunload", e), document.addEventListener("pointerdown", pe, !0), document.addEventListener("focusin", pe, !0), window.addEventListener("blur", de), window.addEventListener("blur", xe), () => {
			window.removeEventListener("beforeunload", e), document.removeEventListener("pointerdown", pe, !0), document.removeEventListener("focusin", pe, !0), window.removeEventListener("blur", de), window.removeEventListener("blur", xe), W(S)?.destroy?.();
		};
	});
	async function k(e, t = "confirm", n = !1) {
		try {
			let r = n ? W(d).retry() : t === "clear_all" ? W(d).beginClearAll() : W(d).begin(e, t);
			n || se.delete(r.decision_id), he(), L(m, "保存中…");
			let i;
			try {
				i = await s().request(r);
			} catch (e) {
				W(d).failed(), he(), L(m, `尚未收到操作結果：${e.message}。請查詢／重送同一筆操作；這不會復原舊答案。`);
				return;
			}
			if (W(d).complete(i), he(), L(m, i.ok ? i.status === "already_applied" ? "原操作已完成；以下顯示目前最新狀態。" : r.operation === "clear_all" ? "已清除全部答案與理由，以下顯示最新狀態。" : "已保存；以下顯示最新狀態。" : i.error.message), !i.ok) {
				se.delete(r.decision_id), L(w, /* @__PURE__ */ new Set([...W(w), r.decision_id])), L(T, !0);
				try {
					let e = await s().load();
					e.ok && (W(d).merge(e), he());
				} catch (e) {
					L(m, e.message);
				} finally {
					L(T, !1);
				}
			}
			if (r.operation === "clear_all") {
				i.ok && (se.clear(), L(w, /* @__PURE__ */ new Set()), de());
				return;
			}
			let a = [...se].find((e) => !W(w).has(e) && W(d).saveOperation(e));
			a && await k(a, W(d).saveOperation(a));
		} catch (e) {
			L(m, e.message);
		}
	}
	async function Ee() {
		let e = W(i).find((e) => e.status === "pending");
		e && (W(y).selected.has("pending") || x(Ga(W(y), "pending")), Se(e.id, !0), await hr(), W(v)?.revealCard(e.id), await hr(), document.getElementById(`decision-${e.id}`)?.focus());
	}
	B(() => W(f), () => {
		L(i, W(f)?.snapshot.document.decisions ?? []);
	}), B(() => (W(f), W(T), W(i)), () => {
		L(n, !!W(f) && !W(f).pending && !W(f).busy && !W(T) && (W(i).some((e) => e.answer) || W(f).dirty));
	}), B(() => (W(i), W(le), W(y)), () => {
		L(r, Ya(W(i).filter((e) => W(le) ? W(le).includes(e.id) : W(y).selected.has(e.status))));
	}), B(() => W(f), () => {
		L(a, !!W(f)?.dirty || !!W(f)?.pending);
	}), B(() => (K(c()), W(a), W(f), W(ee), W(ne), W(te), W(T)), () => {
		c()({
			dirty: W(a),
			saving: !!W(f)?.busy,
			pending: !!W(f)?.pending || W(ee) || W(ne) || W(te) || W(T)
		});
	}), B(() => W(f), () => {
		L(o, W(f) ? `taskprogress.decisions:${W(f).snapshot.document_key}` : null);
	}), B(() => K(l()), () => {
		l()(Te);
	}), kn(), Di();
	var De = rs(), Oe = mn(De);
	ca(Oe, {});
	var ke = z(Oe, 2), Ae = R(ke), A = R(Ae), je = z(R(A), 2), j = (e) => {
		var t = Oo(), n = R(t), r = z(R(n)), i = R(r, !0);
		M(r), M(n), M(t), V(() => {
			Q(n, "href", (W(u), G(() => W(u).href))), Q(n, "aria-label", (W(u), G(() => `返回 ${W(u).title}`))), X(i, (W(u), G(() => W(u).title)));
		}), Y(e, t);
	};
	Z(je, (e) => {
		W(u) && e(j);
	}), M(A);
	var Me = z(A, 2), Ne = (e) => {
		yo(e, {
			get mode() {
				return W(C), G(() => W(C).mode);
			},
			get custom() {
				return W(C), G(() => W(C).custom);
			},
			get systemScheme() {
				return W(C), G(() => W(C).systemScheme);
			},
			onModeChange: (e) => {
				W(S).setMode(e), me();
			},
			onApplyCustom: (e) => {
				W(S).applyCustom(e), me();
			}
		});
	};
	Z(Me, (e) => {
		W(C) && e(Ne);
	}), M(Ae);
	var Fe = z(Ae, 2), Ie = (e) => {
		var t = ko(), n = R(t, !0);
		M(t), V(() => X(n, W(m))), Y(e, t);
	};
	Z(Fe, (e) => {
		W(m) && e(Ie);
	});
	var Le = z(Fe, 2), Re = (e) => {
		var t = Mo(), n = mn(t), r = R(n);
		M(n);
		var i = z(n, 2);
		Gr(i, 1, () => (W(p), G(() => W(p).files)), Vr, (e, t) => {
			var n = Ao(), r = R(n), i = R(r, !0);
			M(r);
			var a = z(r, 2), o = R(a, !0);
			M(a), M(n), V((e) => {
				Q(r, "href", e), X(i, (W(t), G(() => W(t).task_id))), X(o, (W(t), G(() => W(t).error ?? `待決策 ${W(t).pending}／全部 ${W(t).total}`)));
			}, [() => (W(p), W(t), G(() => `?scope=${encodeURIComponent(W(p).scope_id)}&task=${encodeURIComponent(W(t).task_id)}`))]), Y(e, n);
		});
		var a = z(i, 2), o = (e) => {
			Y(e, jo());
		};
		Z(a, (e) => {
			W(p), G(() => !W(p).files.length) && e(o);
		}), V(() => X(r, `待決策 ${W(p), G(() => W(p).pending) ?? ""}${W(p), G(() => W(p).incomplete ? "（統計不完整）" : "") ?? ""}`)), Y(e, t);
	}, ze = (e) => {
		var t = Zo(), a = mn(t), s = R(a), c = R(s);
		M(s), Pe(2), M(a);
		var l = z(a, 2), u = R(l);
		{
			let e = /* @__PURE__ */ P(() => W(T) || W(ee) || W(ne));
			Aa(u, {
				id: "decision-history",
				get history() {
					return W(f), G(() => W(f).history);
				},
				get disabled() {
					return W(e);
				},
				onUndo: () => be("undo"),
				onRedo: () => be("redo"),
				onClear: () => {
					W(d).clearHistory(), he();
				},
				onOpenChange: (e) => {
					L(te, e);
				}
			});
		}
		var p = z(u, 2), m = z(p, 2);
		M(l);
		var b = z(l, 2), S = (e) => {
			var t = No(), n = R(t, !0);
			M(t), V(() => X(n, (W(f), G(() => W(f).pending.operation === "clear_all" ? "查詢／重送清除操作" : "查詢／重送保存操作")))), q("click", t, () => k(null, null, !0)), Y(e, t);
		};
		Z(b, (e) => {
			W(f), G(() => W(f).pending && !W(f).busy) && e(S);
		});
		var C = z(b, 2), re = (e) => {
			Y(e, Po());
		};
		Z(C, (e) => {
			W(r), G(() => !W(r).length) && e(re);
		});
		var E = z(C, 2);
		{
			let e = /* @__PURE__ */ P(() => (W(r), G(() => W(r).map((e) => ({
				...e,
				title: e.question
			}))))), t = /* @__PURE__ */ P(() => (W(i), G(() => W(i).map((e) => e.id)))), n = /* @__PURE__ */ P(() => (W(i), W(r), G(() => W(i).length - W(r).length)));
			Ei(oa(E, {
				get items() {
					return W(e);
				},
				get allIds() {
					return W(t);
				},
				get storageKey() {
					return W(o);
				},
				get heldOrder() {
					return W(le);
				},
				onSelectionChange: (e) => {
					e === null && de();
				},
				get hiddenCount() {
					return W(n);
				},
				onShowHidden: () => x(Va(["pending", "decided"])),
				get expanded() {
					return W(g);
				},
				onToggleAll: Ce,
				children: fe,
				$$slots: {
					default: (e, t) => {
						let n = /* @__PURE__ */ P(() => t.item), r = /* @__PURE__ */ P(() => t.visibilityEnabled), i = /* @__PURE__ */ P(() => t.visible), a = /* @__PURE__ */ P(() => t.onVisibleChange), o = /* @__PURE__ */ P(() => (W(f), K(W(n)), G(() => Object.hasOwn(W(f).drafts, W(n).id) ? W(f).drafts[W(n).id] : null))), s = /* @__PURE__ */ P(() => (K(W(o)), K(W(n)), G(() => W(o) ? W(o).choice : W(n).answer?.kind === "other" ? "__other" : W(n).answer?.option_id ?? "")));
						var c = Yo();
						let l;
						var u = R(c);
						{
							let e = /* @__PURE__ */ P(() => (W(_), K(W(n)), W(g), G(() => W(_)[W(n).id] ?? W(g)))), t = /* @__PURE__ */ P(() => (K(W(n)), G(() => `body-${W(n).id}`)));
							Na(u, {
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
								onToggle: (e) => Se(W(n).id, e),
								get contentId() {
									return W(t);
								},
								get label() {
									return K(W(n)), G(() => W(n).question);
								},
								children: (e, t) => {
									var r = qo(), i = R(r), a = (e) => {
										let t = /* @__PURE__ */ P(() => (W(O), K(W(n)), G(() => W(O)[W(n).id]))), r = /* @__PURE__ */ P(() => (K(W(t)), K(W(n)), W(f), G(() => W(t)?.reference === W(n).source_ref && W(t)?.revision === W(f).snapshot.revision ? W(t) : W(f).snapshot.sources?.[W(n).id])));
										var i = Ro(), a = R(i), o = (e) => {
											var t = Fo(), r = R(t);
											M(t), V(() => X(r, `來源：${K(W(n)), G(() => W(n).source_ref) ?? ""}`)), q("click", t, () => ae(W(n).id)), Y(e, t);
										}, s = (e) => {
											var t = Lo(), i = mn(t), a = R(i, !0);
											M(i);
											var o = z(i), s = R(o, !0);
											M(o);
											var c = z(o, 2), l = (e) => {
												var t = Io();
												q("click", t, () => ae(W(n).id)), Y(e, t);
											};
											Z(c, (e) => {
												W(r) && e(l);
											}), V(() => {
												X(a, (K(W(r)), G(() => W(r)?.message ?? "來源尚未檢查，請更新並重啟服務"))), X(s, (K(W(n)), G(() => W(n).source_ref)));
											}), Y(e, t);
										};
										Z(a, (e) => {
											K(W(r)), G(() => W(r)?.status === "available") ? e(o) : e(s, -1);
										}), M(i), Y(e, i);
									};
									Z(i, (e) => {
										K(W(n)), G(() => W(n).source_ref) && e(a);
									});
									var c = z(i, 2), l = (e) => {
										var t = Vo(), r = R(t), i = (e) => {
											var t = zo();
											_a(R(t), { get text() {
												return K(W(n)), G(() => W(n).context);
											} }), M(t), Y(e, t);
										};
										Z(r, (e) => {
											K(W(n)), G(() => W(n).context) && e(i);
										});
										var a = z(r, 2), o = (e) => {
											var t = Bo(), r = R(t);
											_a(z(r), { get text() {
												return K(W(n)), G(() => W(n).recommendation.reason);
											} }), M(t), V((e) => X(r, `建議：${e ?? ""} — `), [() => (K(W(n)), G(() => W(n).options.find((e) => e.id === W(n).recommendation.option_id)?.label))]), Y(e, t);
										};
										Z(a, (e) => {
											K(W(n)), G(() => W(n).recommendation) && e(o);
										}), M(t), Y(e, t);
									};
									Z(c, (e) => {
										K(W(n)), G(() => W(n).context || W(n).recommendation) && e(l);
									});
									var u = z(c, 2), p = R(u), m = R(p, !0);
									M(p);
									var h = z(p, 2);
									Gr(h, 1, () => (K(W(n)), G(() => W(n).options)), Vr, (e, t, r) => {
										var i = Uo(), a = R(i);
										vi(a);
										var o = z(a, 2), c = R(o), l = z(c), u = (e) => {
											var n = Ho();
											_a(R(n), { get text() {
												return W(t), G(() => W(t).description);
											} }), M(n), Y(e, n);
										};
										Z(l, (e) => {
											W(t), G(() => W(t).description) && e(u);
										}), M(o), M(i), V((e) => {
											Q(a, "name", (K(W(n)), G(() => `answer-${W(n).id}`))), bi(a, (K(W(s)), W(t), G(() => W(s) === W(t).id))), X(c, `${e ?? ""}　${W(t), G(() => W(t).label) ?? ""}${W(t), K(W(n)), G(() => W(t).id === W(n).recommendation?.option_id ? "（建議）" : "") ?? ""} `);
										}, [() => G(() => String.fromCharCode(65 + r))]), q("click", a, (e) => {
											e.currentTarget.checked = ve(W(n).id, W(t).id) === W(t).id;
										}), Y(e, i);
									});
									var g = z(h, 2), _ = (e) => {
										var t = Wo(), r = mn(t), i = R(r);
										vi(i), Pe(), M(r);
										var a = z(r, 2), c = R(a), l = z(c);
										at(l), M(a), V(() => {
											Q(i, "name", (K(W(n)), G(() => `answer-${W(n).id}`))), bi(i, W(s) === "__other"), Q(c, "for", (K(W(n)), G(() => `other-${W(n).id}`))), Q(l, "id", (K(W(n)), G(() => `other-${W(n).id}`))), l.readOnly = (K(W(s)), W(oe), K(W(n)), G(() => W(s) !== "__other" && W(oe) !== W(n).id)), yi(l, (K(W(o)), K(W(n)), G(() => W(o) ? W(o).other : W(n).answer?.kind === "other" ? W(n).answer.text : "")));
										}), q("click", i, async (e) => {
											let t = ve(W(n).id, "__other");
											e.currentTarget.checked = t === "__other", await hr(), t === "__other" && W(ce) === W(n).id && document.getElementById(`other-${W(n).id}`)?.focus();
										}), Tr("focus", l, () => {
											L(oe, W(n).id);
										}), q("click", l, () => {
											L(oe, W(n).id);
										}), Tr("blur", l, xe), q("input", l, (e) => ye(W(n).id, e.currentTarget.value)), Y(e, t);
									};
									Z(g, (e) => {
										K(W(n)), G(() => W(n).allow_other) && e(_);
									}), M(u);
									var v = z(u, 2), y = (e) => {
										var t = Go(), r = mn(t), i = R(r);
										M(r);
										var a = z(r, 2);
										V(() => {
											X(i, `此題已變更，原草稿保留：${K(W(o)), G(() => W(o).choice) ?? ""} ${K(W(o)), G(() => W(o).other) ?? ""}`), a.disabled = (W(T), W(f), G(() => W(T) || !!W(f).pending));
										}), q("click", a, () => {
											W(d).rebase(W(n).id), he(), _e(W(n).id);
										}), Y(e, t);
									};
									Z(v, (e) => {
										K(W(o)), G(() => W(o)?.conflict) && e(y);
									});
									var b = z(v, 2), x = R(b), S = (e) => {
										var t = Ko();
										V(() => t.disabled = W(T)), q("click", t, () => _e(W(n).id)), Y(e, t);
									}, C = /* @__PURE__ */ xt(() => (W(w), K(W(n)), K(W(o)), W(f), G(() => W(w).has(W(n).id) && W(o) && !W(o).conflict && !W(f).pending)));
									Z(x, (e) => {
										W(C) && e(S);
									}), M(b), M(r), V(() => {
										u.disabled = (W(T), W(f), K(W(o)), G(() => W(T) || W(f).pending?.operation === "clear_all" || !!W(f).pending && !W(f).busy || W(o)?.conflict)), X(m, (K(W(n)), G(() => W(n).question)));
									}), Y(e, r);
								},
								$$slots: {
									default: !0,
									header: (e, t) => {
										var r = Jo(), i = R(r);
										ba(i, {
											get id() {
												return K(W(n)), G(() => W(n).id);
											},
											get label() {
												return K(W(n)), G(() => W(n).question);
											}
										});
										var a = z(i), o = R(a, !0);
										M(a);
										var s = z(a), c = R(s, !0);
										M(s), M(r), V(() => {
											Q(a, "id", (K(W(n)), G(() => `decision-${W(n).id}`))), X(o, (K(W(n)), G(() => W(n).question))), X(c, (K(W(n)), G(() => W(n).status === "pending" ? "待決策" : "已決策")));
										}), Y(e, r);
									}
								}
							});
						}
						M(c), V(() => l = si(c, 1, "checklist-item decision-card svelte-17meywc", null, l, { "decision-has-visibility": W(r) })), Y(e, c);
					},
					filters: (e, t) => {
						{
							let t = /* @__PURE__ */ P(() => [
								za,
								"pending",
								"decided"
							]), n = /* @__PURE__ */ P(() => (K(Wa), W(y), G(() => Wa(W(y)))));
							qa(e, {
								categories: [{
									id: "pending",
									label: "待決策"
								}, {
									id: "decided",
									label: "已決策"
								}],
								get order() {
									return W(t);
								},
								get selected() {
									return W(y), G(() => W(y).selected);
								},
								get defaultLit() {
									return W(n);
								},
								defaultLabel: "全部",
								onSelect: (e) => x(Ga(W(y), e)),
								onSelectDefault: () => x(Ka(W(y)))
							});
						}
					}
				},
				$$legacy: !0
			}), (e) => L(v, e), () => W(v));
		}
		Gr(z(E, 2), 1, () => (W(f), W(i), G(() => Object.entries(W(f).drafts).filter(([e]) => !W(i).some((t) => t.id === e)))), Vr, (e, t) => {
			var n = /* @__PURE__ */ xt(() => h(W(t), 2));
			let r = () => W(n)[0], i = () => W(n)[1];
			var a = Xo(), o = mn(a), s = R(o);
			M(o);
			var c = z(o, 2);
			V(() => X(s, `已移除題目 ${r() ?? ""} 的原草稿：${i(), G(() => i().choice) ?? ""} ${i(), G(() => i().other) ?? ""}`)), q("click", c, () => {
				W(d).discard(r()), he();
			}), Y(e, a);
		}), V((e, t) => {
			X(c, `待決策 ${e ?? ""}／全部 ${W(i), G(() => W(i).length) ?? ""}`), p.disabled = t, m.disabled = !W(n);
		}, [() => (W(i), G(() => W(i).filter((e) => e.status === "pending").length)), () => (W(i), G(() => !W(i).some((e) => e.status === "pending")))]), q("click", p, Ee), q("click", m, () => {
			W(n) && L(ee, !0);
		}), Y(e, t);
	};
	Z(Le, (e) => {
		W(p) ? e(Re) : W(f) && e(ze, 1);
	}), M(ke), Ei(ke, (e) => L(ue, e), () => W(ue));
	var Be = z(ke, 2);
	ua(Be, {
		get open() {
			return W(ne);
		},
		title: "決策來源",
		titleId: "decision-source-title",
		onClose: ie,
		children: (e, t) => {
			var n = ts(), r = mn(n), i = (e) => {
				var t = Qo(), n = R(t, !0);
				M(t), V(() => X(n, (W(re), G(() => W(re).reference)))), Y(e, t);
			};
			Z(r, (e) => {
				W(re) && e(i);
			});
			var a = z(r, 2), o = (e) => {
				var t = ko(), n = R(t, !0);
				M(t), V(() => X(n, W(E))), Y(e, t);
			};
			Z(a, (e) => {
				W(E) && e(o);
			});
			var s = z(a, 2), c = (e) => {
				var t = es();
				Gr(t, 5, () => (W(re), G(() => W(re).content.replace(/\r\n/g, "\n").split("\n"))), Vr, (e, t, n) => {
					var r = $o();
					Q(r, "id", `source-line-${n + 1}`);
					let i;
					var a = R(r);
					M(r), V(() => {
						i = si(r, 1, "svelte-17meywc", null, i, { "source-target": n + 1 === W(re).line }), X(a, `${(W(t) || " ") ?? ""}
`);
					}), Y(e, r);
				}), M(t), Y(e, t);
			};
			Z(s, (e) => {
				W(re), G(() => W(re)?.status === "available") && e(c);
			}), Y(e, n);
		},
		$$slots: { default: !0 }
	}), ua(z(Be, 2), {
		get open() {
			return W(ee);
		},
		title: "清除全部決策答案？",
		titleId: "decision-clear-title",
		kicker: "決策項目",
		onClose: () => {
			L(ee, !1);
		},
		children: fe,
		$$slots: { default: (e, t) => {
			let r = /* @__PURE__ */ P(() => t.close);
			var a = ns(), o = mn(a), s = R(o);
			M(o);
			var c = z(o, 4), l = R(c), u = z(l, 2);
			M(c), V(() => {
				X(s, `將清除目前文件「${W(f), G(() => W(f)?.snapshot.document.task_id) ?? ""}」全部 ${W(i), G(() => W(i).length) ?? ""} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。`), u.disabled = !W(n);
			}), Tr("submit", c, (e) => {
				e.preventDefault(), W(n) && (W(r)(), k(null, "clear_all"));
			}), q("click", l, function(...e) {
				W(r)?.apply(this, e);
			}), Y(e, a);
		} }
	}), Y(e, De), We();
}
Er(["click", "input"]), (function(e) {
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
})(globalThis), Object.freeze([
	"created",
	"started",
	"updated",
	"done",
	"takeover",
	"released",
	"disputed"
]), Object.freeze(["1.0", "1.1"]), Object.freeze(["standard", "report_pointer"]), Object.freeze({
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
var as = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(as.levels.map((e) => [e.value, e]))), as.fallbackValue;
var os = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
function ss(e, t = "auto") {
	if (typeof e != "string" || e.length > 100 || !os.test(e)) throw Error("scope 無效。");
	if (![
		"auto",
		"none",
		"explicit"
	].includes(t)) throw Error("Developer 顯示模式無效。");
	let n = new URLSearchParams({ scope: e });
	return t === "none" && n.set("dev", "none"), t === "explicit" && n.set("dev", `../reports/${e}/report.dev.json`), `?${n}`;
}
function cs(e) {
	if (typeof e != "string" || e.length > 100 || !os.test(e)) throw Error("scope 必須是小寫英數字組成的穩定 ID，可使用點、底線或連字號。");
	return `../reports/${e}/report.json`;
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
//#region viewer/assets/owner-report.js
async function ls(e, t = globalThis.fetch) {
	try {
		let n = await t(cs(e), {
			cache: "no-store",
			signal: AbortSignal.timeout(5e3)
		});
		if (!n.ok) return null;
		let r = await n.json();
		return r?.scope_id !== e || typeof r.title != "string" || !r.title.trim() || !Array.isArray(r.tasks) ? null : {
			title: r.title,
			href: `/${ss(e)}`
		};
	} catch {
		return null;
	}
}
//#endregion
//#region viewer/assets/decision-transport.js
var us = (e) => /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(e ?? "") && e.length <= 100;
function ds(e, t) {
	if (!us(e) || t && !us(t)) throw Error("無效的 scope 或 task。");
	let n = `/__taskprogress/v1/decisions/${encodeURIComponent(e)}`;
	async function r(e, t) {
		let n = await fetch(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-TaskProgress-Editor": "1"
			},
			body: JSON.stringify(t)
		});
		if (!n.ok) {
			let e = await n.text(), r;
			try {
				r = JSON.parse(e);
			} catch {}
			if (n.status >= 400 && n.status < 500 && [
				"browser_origin_forbidden",
				"unsupported_media_type",
				"request_too_large",
				"invalid_operation",
				"task_not_found",
				"task_mismatch"
			].includes(r?.code) && r.type === `https://task-progress.local/problems/${r.code}`) return {
				ok: !1,
				request_id: t.request_id,
				error: {
					code: r.code,
					message: r.code === "invalid_operation" ? "服務版本不支援此操作，請更新並重啟 TaskProgress 服務後再試。此次請求未修改資料。" : `操作被拒絕，未修改資料：${r.title ?? r.code}`
				}
			};
			throw Error(`決策服務錯誤 ${n.status}：${e}`);
		}
		return n.json();
	}
	return {
		loadOwnerReport: () => ls(e),
		load: () => t ? r(`${n}/${encodeURIComponent(t)}`, { operation: "load" }) : r(n, {}),
		request: (e) => r(`${n}/${encodeURIComponent(t)}`, e)
	};
}
function fs(e) {
	let t = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let n = t.get(e.data.request_id);
		n && (clearTimeout(n.timer), t.delete(e.data.request_id), n.resolve(e.data));
	});
	function n(n) {
		let r = {
			...n,
			request_id: n.request_id ?? crypto.randomUUID()
		};
		return new Promise((n, i) => {
			let a = setTimeout(() => {
				t.delete(r.request_id), i(/* @__PURE__ */ Error("回應逾時，結果未確認。"));
			}, 3e4);
			t.set(r.request_id, {
				resolve: n,
				timer: a
			}), e.postMessage(r);
		});
	}
	return {
		load: () => n({ operation: "load" }),
		request: n
	};
}
//#endregion
//#region viewer/assets/foreground-refresh.js
function ps(e, t) {
	if (!e || typeof e.addEventListener != "function" || typeof e.removeEventListener != "function") throw TypeError(`${t} 必須支援事件監聽。`);
	return e;
}
function ms({ windowTarget: e = globalThis.window, documentTarget: t = globalThis.document, canRefresh: n = () => !0, reload: r = () => e.location.reload(), schedule: i = (e) => globalThis.queueMicrotask(e) } = {}) {
	if (ps(e, "windowTarget"), ps(t, "documentTarget"), typeof n != "function") throw TypeError("canRefresh 必須是函式。");
	if (typeof r != "function") throw TypeError("reload 必須是函式。");
	if (typeof i != "function") throw TypeError("schedule 必須是函式。");
	let a = !1, o = !1, s = !1, c = !1;
	function l() {
		c || (a = !0);
	}
	function u() {
		if (o = !1, c || s || !a || (a = !1, n() !== !0)) return;
		s = !0;
		let e;
		try {
			e = r();
		} catch {
			s = !1;
			return;
		}
		if (e && typeof e.then == "function") return e.catch(() => {}).finally(() => {
			s = !1;
		});
		s = !1;
	}
	function d() {
		c || s || o || !a || (o = !0, i(u));
	}
	function f() {
		t.visibilityState === "hidden" ? l() : t.visibilityState === "visible" && d();
	}
	return e.addEventListener("blur", l), e.addEventListener("focus", d), t.addEventListener("visibilitychange", f), function() {
		c || (c = !0, a = !1, e.removeEventListener("blur", l), e.removeEventListener("focus", d), t.removeEventListener("visibilitychange", f));
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/decisions-main.js
var hs = null, gs, _s;
try {
	let e = new URLSearchParams(location.search);
	_s = window.chrome?.webview ? fs(window.chrome.webview) : ds(e.get("scope"), e.get("task"));
} catch (e) {
	_s = { load: () => Promise.reject(e) };
}
window.chrome?.webview || ms({
	canRefresh: () => !gs?.dirty && !gs?.saving && !gs?.pending,
	reload: async () => {
		hs && await hs();
	}
}), Ir(is, {
	target: document.querySelector("#app"),
	props: {
		transport: _s,
		bindRefresh: (e) => {
			hs = e;
		},
		onPersistenceChange: (e) => gs = e
	}
});
//#endregion
