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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, ee = 1 << 25, T = 65536, te = 1 << 21, ne = 1 << 22, re = 1 << 23, E = Symbol("$state"), ie = Symbol("legacy props"), ae = Symbol(""), oe = Symbol("attributes"), se = Symbol("class"), ce = Symbol("style"), le = Symbol("text"), ue = Symbol("form reset"), de = new class extends Error {
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
var Te = {}, D = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml";
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
var O = !1;
function je(e) {
	O = e;
}
var k;
function Me(e) {
	if (e === null) throw Oe(), Te;
	return k = e;
}
function Ne() {
	return Me(/* @__PURE__ */ un(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ un(k) !== null) throw Oe(), Te;
		k = e;
	}
}
function Pe(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ un(n);
		k = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ un(n);
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
var j = null;
function He(e) {
	j = e;
}
function Ue(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: Be && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function We(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Sn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function Ge() {
	return !Be || j !== null && j.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], p(e);
}
function Je(e) {
	if (Ke.length === 0 && !kt) {
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
	var t = H;
	if (t === null) return V.f |= re, e;
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
function M(e, t) {
	e.f = e.f & Qe | t;
}
function $e(e) {
	e.f & 512 || e.deps === null ? M(e, h) : M(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function et(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= T, et(t.deps));
}
function tt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), et(e.deps), M(e, h);
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
	O && /* @__PURE__ */ ln(e) !== null && fn(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ue]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = V, n = H;
	qn(null), Jn(null);
	try {
		return e();
	} finally {
		qn(t), Jn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[ue];
	e[ue] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = Kt(0), r;
	return () => {
		yn() && (U(n), kn(() => (t === 0 && (r = W(() => e(() => Zt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Zt(n));
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
	#h = lt(() => (this.#m = Kt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = An(() => {
			if (O) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = jn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Je(r), t && (this.#s = jn(() => {
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
			t = !0, n && we(), this.#s !== null && Ln(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = jn(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = cn();
			e.append(t), this.#a = this.#S(() => jn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Ln(this.#o, () => {
				this.#o = null;
			}), this.#x(P));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = jn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Vn(this.#a, e);
				let t = this.#n.pending;
				this.#o = jn(() => t(this.#e));
			} else this.#x(P);
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
		var t = H, n = V, r = j;
		Jn(this.#i), qn(this.#i), He(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Jn(t), qn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Ln(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Yt(this.#m, this.#l);
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
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), O && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return jn(() => {
						var r = H;
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
	let i = Ge() ? _t : N;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = mt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = H, t = V, n = j, r = P;
	return function(i = !0) {
		Jn(e), qn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Jn(null), qn(null), He(null), e && P?.deactivate();
}
function gt() {
	var e = H, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | g;
	return H !== null && (H.f |= C), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Le,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: D,
		wv: 0,
		parent: H,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = H;
	r === null && me();
	var i = void 0, a = Kt(D), o = !V, s = /* @__PURE__ */ new Set();
	return On(() => {
		var t = H, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = P;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= re, Yt(a, t)) : (a.f & 8388608 && (a.f ^= re), Yt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), bn(() => {
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
function N(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = ze, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function xt(e) {
	var t, n = H, r = e.parent;
	if (!Wn && r !== null && e.v !== D && r.f & 24576) return De(), e.v;
	Jn(r);
	try {
		e.f &= ~T, bt(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = ar(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		M(e, h);
		return;
	}
	Wn || (Dt === null ? $e(e) : (yn() || P?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ur(t, 0), Nn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, P = null, Et = null, Dt = null, Ot = null, kt = !1, At = !1, jt = null, Mt = null, Nt = 0, Pt = 1, Ft = class e {
	id = Pt++;
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
		Tt === null ? Tt = this : (Tt.#n = this, this.#t = Tt), Tt = this;
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
		this.#e = !0, Nt++ > 1e3 && (this.#x(), Lt());
		for (let e of this.#u) this.#d.delete(e), M(e, g), this.schedule(e);
		for (let e of this.#d) M(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = jt = [], r = [], i = Mt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Ht(e), this.#h() || this.discard(), t;
		}
		if (P = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (jt = null, Mt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Vt(e, t);
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
		this.#r.clear(), Et = this, zt(r), zt(n), Et = null, this.#s?.resolve();
		var s = P;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), dr(r));
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
		this.oncommit(() => e.discard()), e.#x(), P = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) tt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== D && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Dt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, Dt = null;
	}
	flush() {
		try {
			At = !0, P = this, this.#g();
		} finally {
			Nt = 0, Ot = null, jt = null, Mt = null, At = !1, P = null, Dt = null, Wt.clear();
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
		if (P === null) {
			let t = P = new e();
			!At && !kt && Je(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		Dt = null;
	}
	schedule(e) {
		if (Ot = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (jt !== null && t === H && (V === null || !(V.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Tt = e : t.#t = e, this.linked = !1;
		}
	}
};
function It(e) {
	var t = kt;
	kt = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (Ye(), P === null) return n;
			P.flush();
		}
	} finally {
		kt = t;
	}
}
function Lt() {
	try {
		ye();
	} catch (e) {
		Ze(e, Ot);
	}
}
var Rt = null;
function zt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (Rt = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && In(r), Rt?.size > 0)) {
				Wt.clear();
				for (let e of Rt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Rt.has(n) && (Rt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
					}
				}
				Rt.clear();
			}
		}
		Rt = null;
	}
}
function Bt(e) {
	P.schedule(e);
}
function Vt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, h);
		for (var n = e.first; n !== null;) Vt(n, t), n = n.next;
	}
}
function Ht(e) {
	M(e, h);
	for (var t = e.first; t !== null;) Ht(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ut = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Map(), Gt = !1;
function Kt(e, t) {
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
function qt(e, t) {
	let n = Kt(e, t);
	return Xn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t = !1, n = !0) {
	let r = Kt(e);
	return t || (r.equals = ze), Be && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function Jt(e, t) {
	return I(e, W(() => U(e))), t;
}
function I(e, t, n = !1) {
	return V !== null && (!Kn || V.f & 131072) && Ge() && V.f & 4325394 && (Yn === null || !Yn.has(e)) && Ce(), Yt(e, n ? $t(t) : t, Mt);
}
function Yt(e, t, n = null) {
	if (!e.equals(t)) {
		Wt.set(e, Wn ? t : e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && $e(t);
		}
		e.wv = ar(), Qt(e, g, n), Ge() && H !== null && H.f & 1024 && !(H.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && Ut.size > 0 && !Gt && Xt();
	}
	return t;
}
function Xt() {
	Gt = !1;
	for (let e of Ut) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && dr(e);
	}
	Ut.clear();
}
function Zt(e) {
	I(e, e.v + 1);
}
function Qt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & g) === 0;
			if (l && M(s, t), c & 131072) Ut.add(s);
			else if (c & 2) {
				var u = s;
				Dt?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= T), Qt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Rt !== null && Rt.add(d), n === null ? Bt(d) : n.push(d);
			}
		}
	}
}
function $t(t) {
	if (typeof t != "object" || !t || E in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ qt(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = V, n = rr;
		qn(null), ir(d);
		var r = e();
		return qn(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ qt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ qt(n.value, u);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ qt(D, u));
					r.set(t, e), Zt(o);
				}
			} else I(n, D), Zt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === E) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ qt($t(s ? e[n] : D), u)), r.set(n, o)), o !== void 0) {
				var c = U(o);
				return c === D ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = U(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== D) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === E) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== D || Reflect.has(e, t);
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ qt(i ? $t(e[t]) : D, u)), r.set(t, n)), U(n) === D) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ qt(D, u)), r.set(d + "", p)) : I(p, D);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ qt(void 0, u)), I(c, $t(n)), r.set(t, c));
			else {
				l = c.v !== D;
				var m = f(() => $t(n));
				I(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				Zt(o);
			}
			return !0;
		},
		ownKeys(e) {
			U(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== D;
			});
			for (var [n, i] of r) i.v !== D && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Se();
		}
	});
}
function en(e) {
	try {
		if (typeof e == "object" && e && E in e) return e[E];
	} catch {}
	return e;
}
function tn(e, t) {
	return Object.is(en(e), en(t));
}
var nn, rn, an, on;
function sn() {
	if (nn === void 0) {
		nn = window, rn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		an = a(t, "firstChild").get, on = a(t, "nextSibling").get, u(e) && (e[se] = void 0, e[oe] = null, e[ce] = void 0, e.__e = void 0), u(n) && (n[le] = void 0);
	}
}
function cn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
function L(e, t) {
	if (!O) return /* @__PURE__ */ ln(e);
	var n = /* @__PURE__ */ ln(k);
	if (n === null) n = k.appendChild(cn());
	else if (t && n.nodeType !== 3) {
		var r = cn();
		return n?.before(r), Me(r), r;
	}
	return t && hn(n), Me(n), n;
}
function dn(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ ln(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ un(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = cn();
			return k?.before(r), Me(r), r;
		}
		hn(k);
	}
	return k;
}
function R(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ un(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = cn();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		hn(r);
	}
	return Me(r), r;
}
function fn(e) {
	e.textContent = "";
}
function pn() {
	return !1;
}
function mn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function hn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function gn(e) {
	H === null && (V === null && ve(e), _e()), Wn && ge(e);
}
function _n(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function vn(e, t) {
	var n = H;
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
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) jt === null ? Ft.ensure().schedule(r) : jt.push(r);
	else if (t !== null) {
		try {
			dr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && _n(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function yn() {
	return V !== null && !Kn;
}
function bn(e) {
	let t = vn(8, null);
	return M(t, h), t.teardown = e, t;
}
function xn(e) {
	gn("$effect");
	var t = H.f;
	if (!V && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return Sn(e);
}
function Sn(e) {
	return vn(4 | w, e);
}
function Cn(e) {
	return gn("$effect.pre"), vn(8 | w, e);
}
function wn(e) {
	Ft.ensure();
	let t = vn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ln(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function Tn(e) {
	return vn(4, e);
}
function En(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = kn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = H;
			try {
				Jn(n.parent), W(t);
			} finally {
				Jn(n);
			}
		}
	});
}
function Dn() {
	var e = j;
	kn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && M(n, _), or(n) && dr(n), t.ran = !1;
		}
	});
}
function On(e) {
	return vn(ne | C, e);
}
function kn(e, t = 0) {
	return vn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		vn(8, () => {
			e(...t.map(U));
		});
	});
}
function An(e, t = 0) {
	return vn(16 | t, e);
}
function jn(e) {
	return vn(32 | C, e);
}
function Mn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Wn, n = V;
		Gn(!0), qn(null);
		try {
			t.call(null);
		} finally {
			Gn(e), qn(n);
		}
	}
}
function Nn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(de);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Pn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Fn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Nn(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Mn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && In(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Fn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ un(e);
		e.remove(), e = n;
	}
}
function In(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ln(e, t, n = !0) {
	var r = [];
	Rn(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Rn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Rn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function zn(e) {
	Bn(e, !0);
}
function Bn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Bn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Vn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ un(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Hn = null, Un = !1, Wn = !1;
function Gn(e) {
	Wn = e;
}
var V = null, Kn = !1;
function qn(e) {
	V = e;
}
var H = null;
function Jn(e) {
	H = e;
}
var Yn = null;
function Xn(e) {
	V !== null && (Yn ??= /* @__PURE__ */ new Set()).add(e);
}
var Zn = null, Qn = 0, $n = null;
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
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && M(e, h);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), Bt(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = V, a = Yn, o = j, s = Kn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, V = l & 96 ? null : e, Yn = null, He(e.ctx), Kn = !1, rr = ++nr, e.ac !== null && (st(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = P?.is_fork;
		if (Zn !== null) {
			var m;
			if (p || ur(e, Qn), f !== null && Qn > 0) for (f.length = Qn + Zn.length, m = 0; m < Zn.length; m++) f[Qn + m] = Zn[m];
			else e.deps = f = Zn;
			if (yn() && e.f & 512) for (m = Qn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Qn < f.length && (ur(e, Qn), f.length = Qn);
		if (Ge() && $n !== null && !Kn && f !== null && !(e.f & 6146)) for (m = 0; m < $n.length; m++) sr($n[m], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= te, Zn = t, Qn = n, $n = r, V = i, Yn = a, He(o), Kn = s, rr = c;
	}
}
function lr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Zn === null || !n.call(Zn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== D && $e(s), s.ac !== null && st(() => {
			s.ac.abort(de), s.ac = null, M(s, g);
		}), Ct(s), ur(s, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = H, r = Un;
		H = e, Un = !(t & 96);
		try {
			t & 16777232 ? Pn(e) : Nn(e), Mn(e);
			var i = cr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tr;
		} finally {
			Un = r, H = n;
		}
	}
}
async function fr() {
	await Promise.resolve(), It();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Hn?.add(e), V !== null && !Kn && !(H !== null && H.f & 16384) && (Yn === null || !Yn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < nr && (e.rv = nr, Zn === null && r !== null && r[Qn] === e ? Qn++ : Zn === null ? Zn = [e] : Zn.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (Wn && Wt.has(e)) return Wt.get(e);
	if (t) {
		var a = e;
		if (Wn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || mr(a)) && (o = xt(a)), Wt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Kn && V !== null && (Un || !!(V.f & 512)), c = (a.f & b) === 0;
		or(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), pr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), pr(t));
}
function mr(e) {
	if (e.v === D) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Wt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function W(e) {
	var t = Kn;
	try {
		return Kn = !0, e();
	} finally {
		Kn = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (E in e) hr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && E in n && hr(n);
		}
	}
}
function hr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			hr(e[n], t);
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
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var vr = Symbol("events"), yr = /* @__PURE__ */ new Set(), br = /* @__PURE__ */ new Set();
function xr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Tr.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Sr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = xr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && bn(() => {
		t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
	(t[vr] ??= {})[e] = n;
}
function Cr(e) {
	for (var t = 0; t < e.length; t++) yr.add(e[t]);
	for (var n of br) n(e);
}
var wr = null;
function Tr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	wr = e;
	var s = 0, c = wr === e && e[vr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[vr] = t;
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
		var d = V, f = H;
		qn(null), Jn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[vr]?.[r];
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
			e[vr] = t, delete e.currentTarget, qn(d), Jn(f);
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
	var t = mn("template");
	return t.innerHTML = Dr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function kr(e, t) {
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
		if (O) return kr(k, null), k;
		i === void 0 && (i = Or(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ln(i)));
		var t = r || rn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ln(t), s = t.lastChild;
			kr(o, s);
		} else kr(t, t);
		return t;
	};
}
function Ar() {
	if (O) return kr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = cn();
	return e.append(t, n), kr(t, n), e;
}
function J(e, t) {
	if (O) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Ne();
		return;
	}
	e !== null && e.before(t);
}
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[le] ??= e.nodeValue) && (e[le] = n, e.nodeValue = `${n}`);
}
function jr(e, t) {
	return Nr(e, t);
}
var Mr = /* @__PURE__ */ new Map();
function Nr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	sn();
	var l = void 0, u = wn(() => {
		var s = n ?? t.appendChild(cn());
		dt(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), O && kr(t, null), l = e(t, i) || {}, O && (H.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Oe(), Te;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = _r(r);
					for (let e of [t, document]) {
						var a = Mr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Mr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Tr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(yr)), br.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Mr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Tr), r.delete(e), r.size === 0 && Mr.delete(n)) : r.set(e, i);
			}
			br.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Pr.set(l, u), l;
}
var Pr = /* @__PURE__ */ new WeakMap(), Fr = class {
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
			if (n) zn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (zn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Vn(r, t), t.append(cn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Ln(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = P, r = pn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = cn();
			i.append(a), this.#n.set(e, {
				effect: jn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, jn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function X(e, t, n = !1) {
	var r;
	O && (r = k, Ne());
	var i = new Fr(e), a = n ? S : 0;
	function o(e, t) {
		if (O) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, je(!1), i.ensure(e, t), je(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	An(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Ir(e, t) {
	return t;
}
function Lr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Ln(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Rr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			fn(d), d.append(u), e.items.clear();
		}
		Rr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Rr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, Vn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var zr;
function Br(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = O ? Me(/* @__PURE__ */ ln(u)) : u.appendChild(cn());
	}
	O && Ne();
	var d = null, f = /* @__PURE__ */ N(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Hr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Wr(d, null, c)) : zn(d) : Ln(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: An(() => {
			p = U(f);
			var e = p.length;
			let t = !1;
			O && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = P, v = pn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (c = k, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Yt(S.v, b), S.i && Yt(S.i, y), v && u.unskip_effect(S.e)) : (S = Ur(l, h ? c : zr ??= cn(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = jn(() => s(c)) : (d = jn(() => s(zr ??= cn())), d.f |= ee)), e > r.size && he("", "", ""), O && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && je(!0), U(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, O && (c = k);
}
function Vr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Hr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Vr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (zn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Wr(_, null, n);
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
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Wr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Gr(e, S.prev, C.next), Gr(e, d, S), Gr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Wr(_, l, n), Gr(e, _.prev, _.next), Gr(e, _, d === null ? e.effect.first : d.next), Gr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Vr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Vr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Rr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Vr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Lr(e, w, te);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ur(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Kt(n) : /* @__PURE__ */ F(n, !1, !1) : null, l = o & 2 ? Kt(i) : null;
	return {
		v: c,
		i: l,
		e: jn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Wr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ un(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Gr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Kr = [..." 	\n\r\f\xA0\v﻿"];
function qr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Kr.includes(r[o - 1])) && (s === r.length || Kr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Jr(e, t, n, r, i, a) {
	var o = e[se];
	if (O || o !== n || o === void 0) {
		var s = qr(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Yr(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(Qr(i));
		return;
	}
	for (i of t.options) if (tn(Qr(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function Xr(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Yr(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), bn(() => {
		t.disconnect();
	});
}
function Zr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ct(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Qr);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Qr(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), Tn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
			if (r.has(o)) return;
		}
		if (Yr(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Qr(s), n(a));
		}
		e.__value = a, i = !1;
	}), Xr(e);
}
function Qr(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var $r = Symbol("is custom element"), ei = Symbol("is html"), ti = fe ? "link" : "LINK", ni = fe ? "progress" : "PROGRESS";
function ri(e) {
	if (O) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Z(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Z(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ue] = n, Je(n), ot();
	}
}
function ii(e, t) {
	var n = ai(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ni) && (e.value = t ?? "");
}
function Z(e, t, n, r) {
	var i = ai(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ti) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && si(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ai(e) {
	return e[oe] ??= {
		[$r]: e.nodeName.includes("-"),
		[ei]: e.namespaceURI === Ee
	};
}
var oi = /* @__PURE__ */ new Map();
function si(e) {
	var t = e.getAttribute("is") || e.nodeName, n = oi.get(t);
	if (n) return n;
	oi.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ci(e, t) {
	return e === t || e?.[E] === t;
}
function li(e = {}, t, n, r) {
	var i = j.r, a = H;
	return Tn(() => {
		var o, s;
		return kn(() => {
			o = s, s = r?.() || [], W(() => {
				ci(n(...s), e) || (t(e, ...s), o && ci(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ci(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function ui(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ _t(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Cn(() => {
		di(t, r), p(n.b);
	}), xn(() => {
		let e = W(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && xn(() => {
		di(t, r), p(n.a);
	});
}
function di(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Q(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), U(u)) : (l && (l = !1, c = s ? W(r) : r), c);
	let f;
	if (o) {
		var p = E in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = rt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
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
	var v = !1, y = (n & 1 ? _t : N)(() => (v = !1, g()));
	o && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && o ? $t(e) : e;
			return I(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Wn && v || b.f & 16384 ? y.v : U(y);
	});
}
function fi(e) {
	j === null && pe("onMount"), Be && j.l !== null ? pi(j).m.push(e) : xn(() => {
		let t = W(e);
		if (typeof t == "function") return t;
	});
}
function pi(e) {
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
//#region viewer/assets/editor-transaction.js
function $(e) {
	return structuredClone(e);
}
function mi(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
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
	function g(e, t = !1) {
		r = $(e), i = $(r), a = $(i), t || (s.length = 0, c.length = 0), f();
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
		commit(e, { keepHistory: t = !1 } = {}) {
			g(e, t);
		}
	});
}
//#endregion
//#region viewer/assets/filter-selection.js
var hi = "__default__";
function gi(e) {
	return [...new Set(e)];
}
function _i(e = []) {
	let t = gi(e);
	return Object.freeze({
		tags: t,
		selected: new Set(t)
	});
}
function vi(e) {
	return e.tags.length > 0 && e.tags.every((t) => e.selected.has(t));
}
function yi(e, t) {
	if (!e.tags.includes(t)) return e;
	let n = new Set(e.selected);
	return n.has(t) ? n.delete(t) : n.add(t), Object.freeze({
		tags: e.tags,
		selected: n
	});
}
function bi(e) {
	let t = vi(e) ? /* @__PURE__ */ new Set() : new Set(e.tags);
	return Object.freeze({
		tags: e.tags,
		selected: t
	});
}
//#endregion
//#region viewer/assets/capsule-order.js
function xi(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function Si(e, t, n) {
	if (!e) return xi(null, n);
	try {
		return xi(JSON.parse(e.getItem(t) ?? "null"), n);
	} catch {
		return xi(null, n);
	}
}
function Ci(e, t, n) {
	if (!e) return !1;
	try {
		return e.setItem(t, JSON.stringify(n)), !0;
	} catch {
		return !1;
	}
}
function wi(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/status-order.js
function Ti(e, t, n = (e) => e.status) {
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
//#endregion
//#region viewer/assets/checklist-editor.js
function Ei(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function Di(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function Oi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = Di(e);
	}), t;
}
function ki(e, t) {
	return (e.dependsOn ?? []).some((e) => Di(t.get(e) ?? { checks: [] }) !== "passed");
}
function Ai(e) {
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
		a[Di(e)] += 1;
		let t = ki(e, n);
		e.checks.forEach((n) => {
			i.total += 1, i[n.status] = (i[n.status] ?? 0) + 1, r.push(n.status);
			let a = {
				workItemId: e.id,
				checkIndex: n.index,
				itemTitle: e.title,
				title: n.title,
				action: n.action,
				expect: n.expect,
				isManual: n.isManual
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
var ji = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function Mi(e, t) {
	let { item: n, check: r } = Ei(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? ji[r.status] ?? "pending" : t.status;
		if (![
			"pending",
			"passed",
			"failed"
		].includes(e)) throw Error("不支援的 manual check 狀態。");
		r.status = e, e !== "failed" && (r.observed = null, r.resolved = null);
	} else if (t.type === "set-observed") {
		if (r.status !== "failed") throw Error("只有失敗草稿可以填寫 Observed。");
		r.observed = String(t.value ?? "");
	} else throw Error(`不支援的 Checklist command：${t.type}`);
	return n.status = Di(n), e;
}
function Ni(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status, e.persistedObserved = e.observed ?? null;
	})), t;
}
var Pi = Object.freeze({ status: Object.freeze([
	"pending",
	"passed",
	"failed"
]) });
function Fi(e, t) {
	let n = new Set(t ?? []);
	return {
		...e,
		items: e.items.map((e) => ({
			...e,
			checks: e.checks.filter((e) => n.has(e.status))
		})).filter((e) => e.checks.length > 0)
	};
}
function Ii(e, t = []) {
	if (t[0] === "__default__") return e;
	let n = t.filter((e) => Pi.status.includes(e));
	return n.length === 0 ? e : {
		...e,
		items: Ti(e.items, n, Di)
	};
}
function Li(e) {
	let t = e.items.flatMap((e) => e.checks);
	return Pi.status.map((e) => ({
		id: e,
		count: t.filter((t) => t.status === e).length
	}));
}
function Ri(e, t = {}) {
	let n = e.revision, r = mi(Ni(e), {
		derive: Oi,
		historyLimit: t.historyLimit
	});
	function i() {
		let e = structuredClone(r.derived);
		return Object.freeze({
			document: e,
			summary: Ai(e),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, Mi, t), i();
	}
	function o() {
		let e = [], t = [];
		return r.derived.items.forEach((n) => n.checks.forEach((r) => {
			if (!r.isManual) return;
			let i = String(r.observed ?? "").trim(), a = String(r.persistedObserved ?? "").trim();
			if (r.status !== r.persistedStatus || i !== a) {
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
			}
		})), r.dirty && e.length === 0 && t.length === 0 && t.push({
			code: "empty_change",
			message: "沒有可儲存的 manual check 結果。"
		}), Object.freeze({
			revision: n,
			results: e,
			errors: t
		});
	}
	return Object.freeze({
		snapshot: i,
		dispatch: a,
		prepareSave: o,
		undo() {
			return r.undo(), i();
		},
		redo() {
			return r.redo(), i();
		},
		discard() {
			return r.discard(), i();
		},
		commit(e) {
			return n = e.revision, r.commit(Ni(e), { keepHistory: !0 }), i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var zi = "task-progress.cautious-mode.v1", Bi = "自動儲存模式。", Vi = "謹慎模式：修改後需按儲存。", Hi = "有尚未儲存的變更。", Ui = "即將自動儲存…", Wi = "正在寫入…", Gi = "已儲存。", Ki = "已放棄尚未儲存的變更。", qi = "沒有需要儲存的變更。", Ji = "儲存失敗。", Yi = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function Xi(e = globalThis.localStorage) {
	try {
		return e?.getItem(zi) === "true";
	} catch {
		return !1;
	}
}
function Zi(e, t) {
	let n = t === !0;
	try {
		e?.setItem(zi, n ? "true" : "false");
	} catch {}
	return n;
}
function Qi({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, timers: a = globalThis, onChange: o = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let s = Xi(n), c = "idle", l = s ? Vi : Bi, u = !1, d = null, f = Promise.resolve(), p = 0, m = () => e.snapshot();
	function h() {
		let e = m();
		return Object.freeze({
			...e,
			mode: s ? "cautious" : "auto",
			cautious: s,
			status: c,
			message: l,
			blocked: u,
			saving: c === "saving",
			pending: d !== null || p > 0
		});
	}
	function g() {
		o(h());
	}
	function _(e, t) {
		c = e, l = t;
	}
	function v() {
		d !== null && (a.clearTimeout(d), d = null);
	}
	async function y(n) {
		if (u && !n) return;
		if (!m().dirty) {
			n && (_("idle", qi), g());
			return;
		}
		let r = e.prepareSave();
		if (r.errors.length) {
			_("incomplete", r.errors[0].message), g();
			return;
		}
		u = !1, _("saving", Wi), g();
		try {
			let n = await t({
				revision: r.revision,
				results: r.results
			});
			e.commit(n), _("saved", Gi);
		} catch (e) {
			u = !0, _(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Ji);
		}
		g();
	}
	function b(e = !1) {
		return v(), p += 1, f = f.then(() => y(e)).catch((e) => {
			u = !0, _("error", e?.message ?? Ji), g();
		}).finally(() => {
			--p;
		}), f;
	}
	async function x() {
		for (let e = 0; e < 8; e += 1) if (d !== null && b(), await f, d === null && p === 0) return;
	}
	function S(e) {
		return s ? (u || _("draft", Hi), null) : u ? null : e ? (v(), _("pending", Ui), d = a.setTimeout(() => {
			d = null, b();
		}, r), null) : b();
	}
	function C(e) {
		let t = S(e);
		return g(), t;
	}
	async function w(e) {
		let t = e === !0;
		if (t === s) return h();
		if (t) await x(), s = !0;
		else {
			if (m().dirty) return _("mode_blocked", Yi), g(), h();
			s = !1;
		}
		return Zi(n, s), u || _("idle", s ? Vi : Bi), g(), h();
	}
	return Object.freeze({
		snapshot: h,
		dispatch(t) {
			return e.dispatch(t), C(i(t) === !0);
		},
		undo() {
			return e.undo(), C(!1);
		},
		redo() {
			return e.redo(), C(!1);
		},
		discard() {
			return v(), e.discard(), u = !1, _("idle", Ki), g(), h();
		},
		save() {
			return b(!0);
		},
		flush: x,
		setCautious: w
	});
}
//#endregion
//#region viewer/assets/checklist-filter-order.js
var $i = "task-progress.checklist-filter-order.v1";
function ea({ supportedIds: e, storage: t = globalThis.localStorage ?? null } = {}) {
	let n = Si(t, $i, e);
	return {
		get order() {
			return n;
		},
		move(e, r, i = !1) {
			let a = wi(n, e, r, i);
			return a.join("\0") === n.join("\0") ? n : (n = a, Ci(t, $i, n), n);
		}
	};
}
//#endregion
//#region viewer/assets/theme-model.js
var ta = "task-progress.theme.v1", na = [
	"system",
	"light",
	"dark",
	"custom"
], ra = [
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
], ia = Object.freeze({
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
}), aa = Object.freeze({
	version: 1,
	mode: "system"
}), oa = /^#[0-9a-f]{6}$/i;
function sa(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ca(e) {
	return typeof e == "string" && oa.test(e);
}
function la(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = ia[n], i = { base: n };
	for (let e of ra) {
		let n = t[e.key];
		i[e.key] = ca(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function ua(e) {
	if (!sa(e) || e.version !== 1 || !na.includes(e.mode)) return { ...aa };
	let t = {
		version: 1,
		mode: e.mode
	};
	return sa(e.custom) ? t.custom = la(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = la()), t;
}
function da(e) {
	try {
		let t = e?.getItem(ta);
		return t ? ua(JSON.parse(t)) : { ...aa };
	} catch {
		return { ...aa };
	}
}
function fa(e, t) {
	let n = ua(t);
	try {
		e?.setItem(ta, JSON.stringify(n));
	} catch {}
	return n;
}
function pa(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function ma(e, t) {
	let n = ua(t);
	e.dataset.theme = n.mode;
	for (let t of ra) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? la();
		e.dataset.themeBase = t.base;
		for (let n of ra) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function ha(e, t, n = "light") {
	let r = ua(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = la(n)), ua(i);
}
function ga(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function _a(e, t) {
	if (!ca(e) || !ca(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => ga(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function va(e) {
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
	].filter(([, e, t]) => _a(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function ya({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = da(t);
	e && ma(e, r);
	function i(n) {
		return r = fa(t, n), e && ma(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return pa(n);
		},
		setMode(e) {
			return i(ha(r, e, pa(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: la(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var ba = /* @__PURE__ */ q("<button type=\"button\"> </button>"), xa = /* @__PURE__ */ q("<div role=\"toolbar\"></div>");
function Sa(e, t) {
	Ue(t, !1);
	let n = Q(t, "items", 24, () => []), r = Q(t, "className", 8, ""), i = Q(t, "ariaLabel", 8, "可排序膠囊列"), a = Q(t, "onActivate", 8, () => {}), o = Q(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = !1, u = null, d = /* @__PURE__ */ F(null), f = /* @__PURE__ */ F();
	async function p() {
		let e = U(d);
		I(d, null), await fr(), [...U(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function T() {
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
	function re(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	En(() => (G(n()), U(d)), () => {
		n() && U(d) && p();
	}), Dn(), ui();
	var E = xa();
	Br(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ N(() => (U(t), W(() => U(t).sortable !== !1)));
		var r = ba(), i = L(r, !0);
		A(r), z((e) => {
			Jr(r, 1, e), Z(r, "data-capsule-id", (U(t), W(() => U(t).id))), Z(r, "data-reorder-capsule", U(n) ? "true" : null), Z(r, "aria-pressed", (U(t), W(() => U(t).pressed ?? null))), Z(r, "aria-label", (U(t), W(() => U(t).ariaLabel ?? U(t).label))), Z(r, "aria-keyshortcuts", U(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Z(r, "title", (U(t), W(() => U(t).title ?? null))), Z(r, "draggable", U(n)), Y(i, (U(t), W(() => U(t).label)));
		}, [() => (U(t), G(U(n)), U(s), U(c), W(() => `capsule-button ${U(t).className ?? ""} ${U(n) ? "capsule-sortable" : ""} ${U(s) === U(t).id ? "capsule-dragging" : ""} ${h(U(t).id, U(c))}`))]), K("click", r, (e) => b(U(t), e)), K("keydown", r, function(...e) {
			(U(n) ? (e) => x(U(t), e) : null)?.apply(this, e);
		}), Sr("dragstart", r, function(...e) {
			(U(n) ? (e) => S(U(t), e) : null)?.apply(this, e);
		}), Sr("dragover", r, function(...e) {
			(U(n) ? (e) => C(U(t), e) : null)?.apply(this, e);
		}), Sr("dragleave", r, function(...e) {
			(U(n) ? (e) => w(U(t), e) : null)?.apply(this, e);
		}), Sr("drop", r, function(...e) {
			(U(n) ? (e) => ee(U(t), e) : null)?.apply(this, e);
		}), Sr("dragend", r, function(...e) {
			(U(n) ? T : null)?.apply(this, e);
		}), K("pointerdown", r, function(...e) {
			(U(n) ? (e) => te(U(t), e) : null)?.apply(this, e);
		}), K("pointermove", r, function(...e) {
			(U(n) ? (e) => ne(U(t), e) : null)?.apply(this, e);
		}), K("pointerup", r, function(...e) {
			(U(n) ? re : null)?.apply(this, e);
		}), Sr("pointercancel", r, function(...e) {
			(U(n) ? re : null)?.apply(this, e);
		}), J(e, r);
	}), A(E), li(E, (e) => I(f, e), () => U(f)), z(() => {
		Jr(E, 1, `horizontal-capsule-strip ${r()}`), Z(E, "aria-label", i());
	}), J(e, E), We();
}
Cr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function Ca(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ F(), r = Q(t, "categories", 24, () => []), i = Q(t, "selected", 24, () => /* @__PURE__ */ new Set()), a = Q(t, "defaultLit", 8, !1), o = Q(t, "defaultLabel", 8, "預設"), s = Q(t, "ariaLabel", 8, "篩選"), c = Q(t, "className", 8, ""), l = Q(t, "reorderable", 8, !1), u = Q(t, "onSelect", 8, () => {}), d = Q(t, "onSelectDefault", 8, () => {}), f = Q(t, "onReorder", 8, () => {}), p = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`;
	function m(e) {
		e === "__default__" ? d()() : u()(e);
	}
	En(() => (G(o()), G(l()), G(a()), G(r()), G(i())), () => {
		I(n, [{
			id: hi,
			label: o(),
			className: `filter-button filter-default${l() ? " status-sortable" : ""}`,
			sortable: l(),
			pressed: a(),
			title: l() ? "顯示全部；放在第一顆時依資料原本的順序排列，拖曳到後面則依膠囊順序分組" : "顯示全部",
			ariaLabel: a() ? `${o()}，已全選` : `${o()}，選取全部`
		}, ...r().map((e) => {
			let t = l() && e.sortable !== !1;
			return {
				id: e.id,
				label: p(e),
				className: `filter-button${t ? " status-sortable" : ""}`,
				sortable: t,
				pressed: i().has(e.id),
				title: e.title ?? null,
				ariaLabel: e.ariaLabel ?? p(e)
			};
		})]);
	}), Dn(), ui(), Sa(e, {
		get items() {
			return U(n);
		},
		get className() {
			return c();
		},
		get ariaLabel() {
			return s();
		},
		onActivate: m,
		get onReorder() {
			return f();
		}
	}), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var wa = /* @__PURE__ */ q("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Ta = /* @__PURE__ */ q("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function Ea(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = Q(t, "status", 8, "pending"), o = Q(t, "interactive", 8, !1), s = Q(t, "label", 8, ""), c = Q(t, "onCycle", 8, () => {}), l = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	En(() => G(a()), () => {
		I(n, l[a()] ?? "?");
	}), En(() => G(a()), () => {
		I(r, u[a()] ?? a());
	}), En(() => (G(s()), U(r)), () => {
		I(i, s() ? `${s()}：${U(r)}` : U(r));
	}), Dn();
	var d = Ar(), f = dn(d), p = (e) => {
		var t = wa(), r = L(t), o = L(r, !0);
		A(r), A(t), z(() => {
			Jr(t, 1, `marker-box marker-${a()} marker-box-button`), Z(t, "aria-label", `${U(i)}，點擊切換下一個結果`), Y(o, U(n));
		}), K("click", t, function(...e) {
			c()?.apply(this, e);
		}), J(e, t);
	}, m = (e) => {
		var t = Ta(), r = L(t), o = L(r, !0);
		A(r), A(t), z(() => {
			Jr(t, 1, `marker-box marker-${a()}`), Z(t, "aria-label", U(i)), Y(o, U(n));
		}), J(e, t);
	};
	X(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), J(e, d), We();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/NextStepCard.svelte
var Da = /* @__PURE__ */ q("<p class=\"next-step-heading\"> </p>"), Oa = /* @__PURE__ */ q("<h3 class=\"next-step-title\"> </h3>"), ka = /* @__PURE__ */ q("<div><dt> </dt><dd> </dd></div>"), Aa = /* @__PURE__ */ q("<dl class=\"next-step-fields\"><!> <!></dl>"), ja = /* @__PURE__ */ q("<pre class=\"next-step-command\"> </pre>"), Ma = /* @__PURE__ */ q("<section class=\"next-step-card\"><!> <!> <!> <!></section>");
function Na(e, t) {
	let n = Q(t, "heading", 8, ""), r = Q(t, "title", 8, ""), i = Q(t, "action", 8, ""), a = Q(t, "expect", 8, ""), o = Q(t, "command", 8, ""), s = Q(t, "actionLabel", 8, "要做什麼"), c = Q(t, "expectLabel", 8, "怎樣算通過");
	var l = Ma(), u = L(l), d = (e) => {
		var t = Da(), r = L(t, !0);
		A(t), z(() => Y(r, n())), J(e, t);
	};
	X(u, (e) => {
		n() && e(d);
	});
	var f = R(u, 2), p = (e) => {
		var t = Oa(), n = L(t, !0);
		A(t), z(() => Y(n, r())), J(e, t);
	};
	X(f, (e) => {
		r() && e(p);
	});
	var m = R(f, 2), h = (e) => {
		var t = Aa(), n = L(t), r = (e) => {
			var t = ka(), n = L(t), r = L(n, !0);
			A(n);
			var a = R(n), o = L(a, !0);
			A(a), A(t), z(() => {
				Y(r, s()), Y(o, i());
			}), J(e, t);
		};
		X(n, (e) => {
			i() && e(r);
		});
		var o = R(n, 2), l = (e) => {
			var t = ka(), n = L(t), r = L(n, !0);
			A(n);
			var i = R(n), o = L(i, !0);
			A(i), A(t), z(() => {
				Y(r, c()), Y(o, a());
			}), J(e, t);
		};
		X(o, (e) => {
			a() && e(l);
		}), A(t), J(e, t);
	};
	X(m, (e) => {
		(i() || a()) && e(h);
	});
	var g = R(m, 2), _ = (e) => {
		var t = ja(), n = L(t, !0);
		A(t), z(() => Y(n, o())), J(e, t);
	};
	X(g, (e) => {
		o() && e(_);
	}), A(l), z(() => Z(l, "aria-label", n() || r())), J(e, l);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Pa = /* @__PURE__ */ q("<i></i>"), Fa = /* @__PURE__ */ q("<div role=\"img\"></div>"), Ia = /* @__PURE__ */ q("<progress max=\"100\"></progress>");
function La(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = Q(t, "form", 8, "continuous"), a = Q(t, "cells", 24, () => []), o = Q(t, "ratio", 8, 0), s = Q(t, "label", 8, ""), c = Q(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	En(() => G(o()), () => {
		I(n, d(o()));
	}), En(() => G(a()), () => {
		I(r, Array.isArray(a()) ? a() : []);
	}), Dn(), ui();
	var f = Ar(), p = dn(f), m = (e) => {
		var t = Fa();
		Br(t, 5, () => U(r), Ir, (e, t) => {
			var n = Pa();
			z((e) => Jr(n, 1, e), [() => (U(t), W(() => `progress-cell${u(U(t))}`))]), J(e, n);
		}), A(t), z(() => {
			Jr(t, 1, `progress-bar progress-bar-segmented ${c()}`), Z(t, "aria-label", s());
		}), J(e, t);
	}, h = (e) => {
		var t = Ia();
		z(() => {
			Jr(t, 1, `progress-meter ${c()}`), ii(t, U(n)), Z(t, "aria-label", s());
		}), J(e, t);
	};
	X(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), J(e, f), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var Ra = /* @__PURE__ */ q("<div><b> </b> <span> </span></div>"), za = /* @__PURE__ */ q("<div class=\"progress-stats\"></div>"), Ba = /* @__PURE__ */ q("<span class=\"progress-note\"> </span>"), Va = /* @__PURE__ */ q("<p class=\"progress-caption\"><span> </span> <!></p>"), Ha = /* @__PURE__ */ q("<section class=\"progress-summary\"><!> <!> <!></section>");
function Ua(e, t) {
	Ue(t, !1);
	let n = Q(t, "stats", 24, () => []), r = Q(t, "bar", 8, null), i = Q(t, "caption", 8, ""), a = Q(t, "note", 8, ""), o = Q(t, "label", 8, "進度摘要"), s = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), c = (e) => s.has(e) ? ` progress-tone-${e}` : "";
	ui();
	var l = Ha(), u = L(l), d = (e) => {
		var t = za();
		Br(t, 5, n, (e) => e.key ?? e.label, (e, t) => {
			var n = Ra(), r = L(n), i = L(r, !0);
			A(r);
			var a = R(r, 2), o = L(a, !0);
			A(a), A(n), z((e) => {
				Jr(n, 1, e), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
			}, [() => (U(t), W(() => `progress-stat${c(U(t).tone)}`))]), J(e, n);
		}), A(t), J(e, t);
	};
	X(u, (e) => {
		G(n()), W(() => n().length) && e(d);
	});
	var f = R(u, 2), p = (e) => {
		{
			let t = /* @__PURE__ */ N(() => (G(r()), W(() => r().cells ?? []))), n = /* @__PURE__ */ N(() => (G(r()), W(() => r().ratio ?? 0))), a = /* @__PURE__ */ N(() => i() || o());
			La(e, {
				get form() {
					return G(r()), W(() => r().form);
				},
				get cells() {
					return U(t);
				},
				get ratio() {
					return U(n);
				},
				get label() {
					return U(a);
				}
			});
		}
	};
	X(f, (e) => {
		r() && e(p);
	});
	var m = R(f, 2), h = (e) => {
		var t = Va(), n = L(t), r = L(n, !0);
		A(n);
		var o = R(n, 2), s = (e) => {
			var t = Ba(), n = L(t, !0);
			A(t), z(() => Y(n, a())), J(e, t);
		};
		X(o, (e) => {
			a() && e(s);
		}), A(t), z(() => Y(r, i())), J(e, t);
	};
	X(m, (e) => {
		(i() || a()) && e(h);
	}), A(l), z(() => Z(l, "aria-label", o())), J(e, l), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var Wa = /* @__PURE__ */ q("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ga = /* @__PURE__ */ q("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Ka = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function qa(e, t) {
	Ue(t, !1);
	let n = Q(t, "cautious", 8, !0), r = Q(t, "onToggleCautious", 8, null), i = Q(t, "cautiousLabel", 8, "謹慎模式"), a = Q(t, "dirty", 8, !1), o = Q(t, "saving", 8, !1), s = Q(t, "canUndo", 8, !1), c = Q(t, "canRedo", 8, !1), l = Q(t, "message", 8, ""), u = Q(t, "buttonLabel", 8, "儲存"), d = Q(t, "savingLabel", 8, "正在儲存…"), f = Q(t, "undoLabel", 8, "復原"), p = Q(t, "redoLabel", 8, "重做"), m = Q(t, "discardLabel", 8, "放棄"), h = Q(t, "onSave", 8, () => {}), g = Q(t, "onUndo", 8, () => {}), _ = Q(t, "onRedo", 8, () => {}), v = Q(t, "onDiscard", 8, () => {});
	ui();
	var y = Ka(), b = dn(y), x = L(b, !0);
	A(b);
	var S = R(b, 2), C = L(S), w = L(C, !0);
	A(C);
	var ee = R(C, 2), T = L(ee, !0);
	A(ee), A(S);
	var te = R(S, 2), ne = (e) => {
		var t = Wa(), a = L(t, !0);
		A(t), z(() => {
			Z(t, "aria-pressed", n()), Z(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), Y(a, i());
		}), K("click", t, () => r()(!n())), J(e, t);
	};
	X(te, (e) => {
		r() && e(ne);
	});
	var re = R(te, 2), E = (e) => {
		var t = Ga(), n = dn(t), r = L(n, !0);
		A(n);
		var i = R(n, 2), s = L(i, !0);
		A(i), z(() => {
			n.disabled = o(), Y(r, m()), i.disabled = !a() || o(), Y(s, o() ? d() : u());
		}), K("click", n, function(...e) {
			v()?.apply(this, e);
		}), K("click", i, function(...e) {
			h()?.apply(this, e);
		}), J(e, t);
	};
	X(re, (e) => {
		n() && e(E);
	}), z(() => {
		Y(x, l()), Z(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), Y(w, f()), Z(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), Y(T, p());
	}), K("click", C, function(...e) {
		g()?.apply(this, e);
	}), K("click", ee, function(...e) {
		_()?.apply(this, e);
	}), J(e, y), We();
}
Cr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Ja = /* @__PURE__ */ q("<option> </option>"), Ya = /* @__PURE__ */ q("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Xa = /* @__PURE__ */ q("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function Za(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = Q(t, "mode", 8, "system"), o = Q(t, "custom", 8, null), s = Q(t, "systemScheme", 8, "light"), c = Q(t, "onModeChange", 8, () => {}), l = Q(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ F(), p = /* @__PURE__ */ F([]), m = /* @__PURE__ */ F(a()), h = /* @__PURE__ */ F(o()?.base ?? s()), g = /* @__PURE__ */ F(v(la(U(h)))), _ = /* @__PURE__ */ F({ ...U(g) });
	function v(e) {
		return Object.fromEntries(ra.map((t) => [t.key, e[t.key]]));
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
		y(o() ? la(o().base, o()) : la(s())), typeof U(f).showModal == "function" ? U(f).showModal() : U(f).setAttribute("open", "");
	}
	function S() {
		U(f).open && U(f).close();
	}
	function C(e) {
		y(la(e.currentTarget.value));
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
	function T() {
		I(m, a()), S();
	}
	function te(e) {
		e.preventDefault(), T();
	}
	function ne() {
		let e = U(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(la(U(h), U(_))), S();
	}
	En(() => G(a()), () => {
		I(m, a());
	}), En(() => (U(h), U(_)), () => {
		I(n, la(U(h), U(_)));
	}), En(() => U(n), () => {
		I(r, va(U(n)));
	}), En(() => U(r), () => {
		I(i, U(r).length ? `注意：${U(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Dn(), ui();
	var re = Xa(), E = dn(re), ie = R(L(E), 2);
	Br(ie, 5, () => u, (e) => e.value, (e, t) => {
		var n = Ja(), r = L(n, !0);
		A(n);
		var i = {};
		z(() => {
			Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
		}), J(e, n);
	}), A(ie), A(E);
	var ae = R(E, 2), oe = L(ae), se = R(L(oe), 2);
	A(oe);
	var ce = R(oe, 4), le = R(L(ce), 2), ue = L(le);
	ue.value = ue.__value = "light";
	var de = R(ue);
	de.value = de.__value = "dark", A(le);
	var fe;
	Xr(le), A(ce);
	var pe = R(ce, 2);
	Br(pe, 7, () => ra, (e) => e.key, (e, t, r) => {
		var i = Ya(), a = L(i), o = L(a, !0);
		A(a);
		var s = R(a, 2), c = L(s);
		ri(c);
		var l = R(c, 2);
		ri(l), Z(l, "pattern", "#[0-9a-fA-F]{6}"), li(l, (e, t) => Jt(p, U(p)[t] = e), (e) => U(p)?.[e], () => [U(r)]), A(s), A(i), z(() => {
			Y(o, (U(t), W(() => U(t).label))), Z(c, "aria-label", (U(t), W(() => `${U(t).label}選色器`))), ii(c, (U(n), U(t), W(() => U(n)[U(t).key]))), Z(l, "aria-label", (U(t), W(() => `${U(t).label}十六進位色碼`))), ii(l, (U(g), U(t), W(() => U(g)[U(t).key])));
		}), K("input", c, (e) => w(U(t), U(r), e)), K("input", l, (e) => ee(U(t), e)), J(e, i);
	}), A(pe);
	var me = R(pe, 2);
	let he;
	var ge = L(me, !0);
	A(me);
	var _e = R(me, 2), ve = L(_e), ye = R(ve, 4), be = R(ye, 2);
	A(_e), A(ae), li(ae, (e) => I(f, e), () => U(f)), z(() => {
		fe !== (fe = U(h)) && (le.value = (le.__value = U(h)) ?? "", Yr(le, U(h))), he = Jr(me, 1, "theme-dialog-status", null, he, { "theme-status-warning": U(r).length > 0 }), Y(ge, U(i));
	}), K("change", ie, b), Zr(ie, () => U(m), (e) => I(m, e)), Sr("cancel", ae, te), K("click", se, T), K("change", le, C), K("click", ve, () => y(la(U(h)))), K("click", ye, T), K("click", be, ne), J(e, re), We();
}
Cr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ChecklistApp.svelte
var Qa = /* @__PURE__ */ q("<p class=\"checklist-round\"> </p>"), $a = /* @__PURE__ */ q("<p class=\"checklist-notice\" role=\"status\"> </p>"), eo = /* @__PURE__ */ q("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), to = /* @__PURE__ */ q("<p class=\"checklist-chips\"><span class=\"checklist-chip\"> </span></p>"), no = /* @__PURE__ */ q("<div><dt>Reason</dt><dd> </dd></div>"), ro = /* @__PURE__ */ q("<div><dt>Observed</dt><dd> </dd></div>"), io = /* @__PURE__ */ q("<div><dt>Resolved</dt><dd> </dd></div>"), ao = /* @__PURE__ */ q("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), oo = /* @__PURE__ */ q("<section><div class=\"checklist-check-heading\"><!> <strong> </strong> <span> </span></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), so = /* @__PURE__ */ q("<article><header class=\"checklist-item-header\"><!> <div><h2> </h2> <p> </p> <!></div> <span class=\"checklist-status\"> </span></header> <div class=\"checklist-checks\"></div></article>"), co = /* @__PURE__ */ q("<!> <!> <!> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), lo = /* @__PURE__ */ q("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><p class=\"section-kicker\">Implementation Checklist</p> <h1> </h1> <!></div> <!></header> <!></main>");
function uo(e, t) {
	Ue(t, !1);
	let n = Q(t, "transport", 8, null), r = null, i = /* @__PURE__ */ F(null), a = /* @__PURE__ */ F(!0), o = /* @__PURE__ */ F(""), s = /* @__PURE__ */ F("正在載入 Checklist…"), c = (e) => ({
		pending: "待驗證",
		passed: "通過",
		failed: "失敗"
	})[e] ?? e, l = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	}, u = [
		"pending",
		"passed",
		"failed"
	], d = /* @__PURE__ */ F(_i(u)), f = ea({ supportedIds: [hi, ...u] }), p = /* @__PURE__ */ F(f.order);
	function m(e) {
		I(d, yi(U(d), e));
	}
	function h() {
		I(d, bi(U(d)));
	}
	function g(e, t, n) {
		I(p, [...f.move(e, t, n)]);
	}
	function _(e, t) {
		let n = new Map(Li(e).map((e) => [e.id, e.count]));
		return t.filter((e) => u.includes(e)).map((e) => ({
			id: e,
			label: l[e] ?? e,
			count: n.get(e) ?? 0,
			title: "拖曳可調整順序；「預設」在第一顆時依文件原本的順序"
		}));
	}
	function v(e) {
		let t = [
			{
				key: "total",
				label: "工作項目",
				value: e.items.total
			},
			{
				key: "passed",
				label: "已完成",
				value: e.items.passed,
				tone: "passed"
			},
			{
				key: "pending",
				label: "待處理",
				value: e.items.pending,
				tone: "pending"
			}
		];
		return e.items.failed > 0 && t.push({
			key: "failed",
			label: "失敗",
			value: e.items.failed,
			tone: "failed"
		}), t;
	}
	let y = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), b = (e) => e === "saving" ? "saving" : y.has(e) ? "error" : "clean", x = /* @__PURE__ */ F(null), S = /* @__PURE__ */ F({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function C() {
		I(S, {
			mode: U(x).mode,
			custom: U(x).custom,
			systemScheme: U(x).systemScheme
		});
	}
	fi(async () => {
		I(x, ya()), C();
		try {
			if (!n()) throw Error("Checklist 介面需要由 host 提供 transport。");
			r = Qi({
				session: Ri(await n().load()),
				save: n().save,
				debounceCommand: (e) => e.type === "set-observed",
				onChange: (e) => {
					I(i, e), I(s, e.message);
				}
			}), I(i, r.snapshot()), I(s, U(i).message);
		} catch (e) {
			I(o, e instanceof Error ? e.message : "Checklist 載入失敗。"), I(s, U(o));
		} finally {
			I(a, !1);
		}
	});
	function w(e) {
		try {
			r.dispatch(e), I(i, r.snapshot()), I(s, U(i).message);
		} catch (e) {
			I(s, e.message);
		}
	}
	function ee(e, t) {
		w({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function T() {
		r.undo(), I(i, r.snapshot());
	}
	function te() {
		r.redo(), I(i, r.snapshot());
	}
	function ne() {
		I(i, r.discard());
	}
	async function re() {
		await r.save(), I(i, r.snapshot());
	}
	async function E(e) {
		I(i, await r.setCautious(e));
	}
	ui();
	var ie = lo(), ae = L(ie), oe = L(ae), se = R(L(oe), 2), ce = L(se, !0);
	A(se);
	var le = R(se, 2), ue = (e) => {
		var t = Qa(), n = L(t, !0);
		A(t), z(() => Y(n, (U(i), W(() => U(i).document.roundIdentity)))), J(e, t);
	};
	X(le, (e) => {
		U(i) && e(ue);
	}), A(oe);
	var de = R(oe, 2), fe = (e) => {
		Za(e, {
			get mode() {
				return U(S), W(() => U(S).mode);
			},
			get custom() {
				return U(S), W(() => U(S).custom);
			},
			get systemScheme() {
				return U(S), W(() => U(S).systemScheme);
			},
			onModeChange: (e) => {
				U(x).setMode(e), C();
			},
			onApplyCustom: (e) => {
				U(x).applyCustom(e), C();
			}
		});
	};
	X(de, (e) => {
		U(x) && e(fe);
	}), A(ae);
	var pe = R(ae, 2), me = (e) => {
		var t = $a(), n = L(t, !0);
		A(t), z(() => Y(n, U(s))), J(e, t);
	}, he = (e) => {
		var t = eo(), n = L(t, !0);
		A(t), z(() => Y(n, U(o))), J(e, t);
	}, ge = (e) => {
		var t = co(), n = dn(t);
		{
			let e = /* @__PURE__ */ N(() => (U(i), W(() => v(U(i).summary)))), t = /* @__PURE__ */ N(() => (U(i), W(() => ({
				form: "segmented",
				cells: U(i).summary.cells
			})))), r = /* @__PURE__ */ N(() => (U(i), W(() => `${U(i).summary.checks.passed} / ${U(i).summary.checks.total} checks 通過`))), a = /* @__PURE__ */ N(() => (U(i), W(() => U(i).summary.checks.failed > 0 ? `${U(i).summary.checks.failed} 個失敗` : "")));
			Ua(n, {
				get stats() {
					return U(e);
				},
				get bar() {
					return U(t);
				},
				get caption() {
					return U(r);
				},
				get note() {
					return U(a);
				}
			});
		}
		var r = R(n, 2), a = (e) => {
			{
				let t = /* @__PURE__ */ N(() => (U(i), W(() => U(i).summary.nextStep.isManual ? "下一步 · 需人工驗證" : "下一步 · Agent"))), n = /* @__PURE__ */ N(() => (U(i), W(() => `${U(i).summary.nextStep.workItemId}. ${U(i).summary.nextStep.itemTitle} — ${U(i).summary.nextStep.title}`)));
				Na(e, {
					get heading() {
						return U(t);
					},
					get title() {
						return U(n);
					},
					get action() {
						return U(i), W(() => U(i).summary.nextStep.action);
					},
					get expect() {
						return U(i), W(() => U(i).summary.nextStep.expect);
					}
				});
			}
		};
		X(r, (e) => {
			U(i), W(() => U(i).summary.nextStep) && e(a);
		});
		var o = R(r, 2);
		{
			let e = /* @__PURE__ */ N(() => (U(i), U(p), W(() => _(U(i).document, U(p))))), t = /* @__PURE__ */ N(() => (G(vi), U(d), W(() => vi(U(d)))));
			Ca(o, {
				get categories() {
					return U(e);
				},
				get selected() {
					return U(d), W(() => U(d).selected);
				},
				get defaultLit() {
					return U(t);
				},
				className: "status-filter-strip",
				ariaLabel: "依 check 狀態篩選；可拖曳調整順序",
				reorderable: !0,
				onSelect: m,
				onSelectDefault: h,
				onReorder: g
			});
		}
		var l = R(o, 2);
		Br(l, 5, () => (G(Fi), G(Ii), U(i), U(p), U(d), W(() => Fi(Ii(U(i).document, U(p)), U(d).selected).items)), (e) => e.id, (e, t) => {
			var n = so(), r = L(n), i = L(r);
			{
				let e = /* @__PURE__ */ N(() => (U(t), W(() => `工作項目 ${U(t).id}`)));
				Ea(i, {
					get status() {
						return U(t), W(() => U(t).status);
					},
					get label() {
						return U(e);
					}
				});
			}
			var a = R(i, 2), o = L(a), s = L(o);
			A(o);
			var l = R(o, 2), u = L(l, !0);
			A(l);
			var d = R(l, 2), f = (e) => {
				var n = to(), r = L(n), i = L(r);
				A(r), A(n), z((e) => Y(i, `Depends on ${e ?? ""}`), [() => (U(t), W(() => U(t).dependsOn.join(", ")))]), J(e, n);
			};
			X(d, (e) => {
				U(t), W(() => U(t).dependsOn.length) && e(f);
			}), A(a);
			var p = R(a, 2), m = L(p, !0);
			A(p), A(r);
			var h = R(r, 2);
			Br(h, 5, () => (U(t), W(() => U(t).checks)), (e) => e.index, (e, n) => {
				var r = oo(), i = L(r), a = L(i);
				Ea(a, {
					get status() {
						return U(n), W(() => U(n).status);
					},
					get interactive() {
						return U(n), W(() => U(n).isManual);
					},
					get label() {
						return U(n), W(() => U(n).title);
					},
					onCycle: () => ee(U(t).id, U(n))
				});
				var o = R(a, 2), s = L(o, !0);
				A(o);
				var c = R(o, 2), l = L(c, !0);
				A(c), A(i);
				var u = R(i, 2), d = L(u), f = R(L(d)), p = L(f, !0);
				A(f), A(d);
				var m = R(d, 2), h = R(L(m)), g = L(h, !0);
				A(h), A(m);
				var _ = R(m, 2), v = (e) => {
					var t = no(), r = R(L(t)), i = L(r, !0);
					A(r), A(t), z(() => Y(i, (U(n), W(() => U(n).reason)))), J(e, t);
				};
				X(_, (e) => {
					U(n), W(() => U(n).reason) && e(v);
				});
				var y = R(_, 2), b = (e) => {
					var t = ro(), r = R(L(t)), i = L(r, !0);
					A(r), A(t), z(() => Y(i, (U(n), W(() => U(n).observed)))), J(e, t);
				};
				X(y, (e) => {
					U(n), W(() => U(n).observed && !(U(n).isManual && U(n).status === "failed")) && e(b);
				});
				var x = R(y, 2), S = (e) => {
					var t = io(), r = R(L(t)), i = L(r, !0);
					A(r), A(t), z(() => Y(i, (U(n), W(() => U(n).resolved)))), J(e, t);
				};
				X(x, (e) => {
					U(n), W(() => U(n).resolved) && e(S);
				}), A(u);
				var C = R(u, 2), T = (e) => {
					var r = ao(), i = R(L(r), 2);
					it(i), A(r), z(() => ii(i, (U(n), W(() => U(n).observed ?? "")))), K("input", i, (e) => w({
						type: "set-observed",
						workItemId: U(t).id,
						checkIndex: U(n).index,
						value: e.currentTarget.value
					})), J(e, r);
				};
				X(C, (e) => {
					U(n), W(() => U(n).isManual && U(n).status === "failed") && e(T);
				}), A(r), z(() => {
					Jr(r, 1, (U(n), W(() => `checklist-check checklist-${U(n).status}${U(n).isManual ? " checklist-manual" : ""}`))), Y(s, (U(n), W(() => U(n).title))), Jr(c, 1, (U(n), W(() => `checklist-owner${U(n).isManual ? " checklist-owner-manual" : ""}`))), Y(l, (U(n), W(() => U(n).isManual ? "manual" : "Agent"))), Y(p, (U(n), W(() => U(n).action))), Y(g, (U(n), W(() => U(n).expect)));
				}), J(e, r);
			}), A(h), A(n), z((e) => {
				Jr(n, 1, (U(t), W(() => `checklist-item checklist-${U(t).status}`))), Y(s, `${U(t), W(() => U(t).id) ?? ""}. ${U(t), W(() => U(t).title) ?? ""}`), Y(u, (U(t), W(() => U(t).outcome))), Y(m, e);
			}, [() => (U(t), W(() => c(U(t).status)))]), J(e, n);
		}), A(l);
		var u = R(l, 2);
		qa(L(u), {
			get cautious() {
				return U(i), W(() => U(i).cautious);
			},
			onToggleCautious: E,
			get dirty() {
				return U(i), W(() => U(i).dirty);
			},
			get saving() {
				return U(i), W(() => U(i).saving);
			},
			get canUndo() {
				return U(i), W(() => U(i).history.canUndo);
			},
			get canRedo() {
				return U(i), W(() => U(i).history.canRedo);
			},
			get message() {
				return U(s);
			},
			onSave: re,
			onUndo: T,
			onRedo: te,
			onDiscard: ne
		}), A(u), z((e) => {
			Z(u, "data-state", e), Z(u, "aria-busy", (U(i), W(() => U(i).saving)));
		}, [() => (U(i), W(() => b(U(i).status)))]), J(e, t);
	};
	X(pe, (e) => {
		U(a) ? e(me) : U(i) ? e(ge, -1) : e(he, 1);
	}), A(ie), z(() => Y(ce, (U(i), W(() => U(i)?.document.fileName ?? "TaskProgress Checklist")))), J(e, ie), We();
}
Cr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var fo = 1, po = /* @__PURE__ */ new Set(["load", "save"]);
function mo(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== fo || typeof t.id != "string") return;
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
		if (!po.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: fo,
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
//#region experiments/editor-svelte-spike/src/checklist-main.js
function ho() {
	try {
		return mo();
	} catch (e) {
		let t = () => Promise.reject(e);
		return {
			load: t,
			save: t
		};
	}
}
jr(uo, {
	target: document.querySelector("#app"),
	props: { transport: ho() }
});
//#endregion
