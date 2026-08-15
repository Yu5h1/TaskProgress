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
	return Me(/* @__PURE__ */ ln(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ ln(k) !== null) throw Oe(), Te;
		k = e;
	}
}
function Pe(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ ln(n);
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
		var i = /* @__PURE__ */ ln(n);
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
		r: V,
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
		for (var r of n) xn(r);
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
function Ye(e) {
	var t = V;
	if (t === null) return B.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Xe(e, t);
}
function Xe(e, t) {
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
var Ze = ~(g | _ | h);
function M(e, t) {
	e.f = e.f & Ze | t;
}
function Qe(e) {
	e.f & 512 || e.deps === null ? M(e, h) : M(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function $e(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= T, $e(t.deps));
}
function et(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), $e(e.deps), M(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var tt = !1;
function nt(e) {
	var t = tt;
	try {
		return tt = !1, [e(), tt];
	} finally {
		tt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function rt(e) {
	O && /* @__PURE__ */ cn(e) !== null && dn(e);
}
var it = !1;
function at() {
	it || (it = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ue]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ot(e) {
	var t = B, n = V;
	Kn(null), qn(null);
	try {
		return e();
	} finally {
		Kn(t), qn(n);
	}
}
function st(e, t, n, r = n) {
	e.addEventListener(t, () => ot(n));
	let i = e[ue];
	e[ue] = i ? () => {
		i(), r(!0);
	} : () => r(!0), at();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ct(e) {
	let t = 0, n = Gt(0), r;
	return () => {
		vn() && (W(n), On(() => (t === 0 && (r = G(() => e(() => Xt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Xt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var lt = S | C;
function ut(e, t, n, r) {
	new dt(e, t, n, r);
}
var dt = class {
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
	#h = ct(() => (this.#m = Gt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = kn(() => {
			if (O) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, lt), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = An(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Je(r), t && (this.#s = An(() => {
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
			t = !0, n && we(), this.#s !== null && In(this.#s, () => {
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
					Xe(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = An(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = sn();
			e.append(t), this.#a = this.#S(() => An(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, In(this.#o, () => {
				this.#o = null;
			}), this.#x(N));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = An(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Bn(this.#a, e);
				let t = this.#n.pending;
				this.#o = An(() => t(this.#e));
			} else this.#x(N);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		et(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = V, n = B, r = j;
		qn(this.#i), Kn(this.#i), He(this.#i.ctx);
		try {
			return Ft.ensure(), e();
		} catch (e) {
			return Ye(e), null;
		} finally {
			qn(t), Kn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && In(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Jt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), W(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), O && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return An(() => {
						var r = V;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Xe(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Xe(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Xe(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ft(e, t, n, r) {
	let i = Ge() ? gt : yt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = pt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Xe(e, s);
			}
			mt();
		}
	}
	var d = ht();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ vt(e))).then(u).catch((e) => Xe(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), mt();
	}) : f();
}
function pt() {
	var e = V, t = B, n = j, r = N;
	return function(i = !0) {
		qn(e), Kn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function mt(e = !0) {
	qn(null), Kn(null), He(null), e && N?.deactivate();
}
function ht() {
	var e = V, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function gt(e) {
	var t = 2 | g;
	return V !== null && (V.f |= C), {
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
		parent: V,
		ac: null
	};
}
var _t = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function vt(e, t, n) {
	let r = V;
	r === null && me();
	var i = void 0, a = Gt(D), o = !B, s = /* @__PURE__ */ new Set();
	return Dn(() => {
		var t = V, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(mt);
		} catch (e) {
			n.reject(e), mt();
		}
		var c = N;
		if (o) {
			if (t.f & 32768) var l = ht();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(_t);
			else for (let e of s.values()) e.reject(_t);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== _t && (c.activate(), t ? (a.f |= re, Jt(a, t)) : (a.f & 8388608 && (a.f ^= re), Jt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), yn(() => {
		for (let e of s) e.reject(_t);
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
function yt(e) {
	let t = /* @__PURE__ */ gt(e);
	return t.equals = ze, t;
}
function bt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function xt(e) {
	var t, n = V, r = e.parent;
	if (!Un && r !== null && e.v !== D && r.f & 24576) return De(), e.v;
	qn(r);
	try {
		e.f &= ~T, bt(e), t = ar(e);
	} finally {
		qn(n);
	}
	return t;
}
function St(e) {
	var t = xt(e);
	if (!e.equals(t) && (e.wv = nr(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), Et?.capture(e, t, !0)), e.deps === null))) {
		M(e, h);
		return;
	}
	Un || (Dt === null ? Qe(e) : (vn() || N?.is_fork) && Dt.set(e, t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ot(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), sr(t, 0), Mn(t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && cr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Tt = null, N = null, Et = null, Dt = null, Ot = null, kt = !1, At = !1, jt = null, Mt = null, Nt = 0, Pt = 1, Ft = class e {
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
		this.#e = !0, Nt++ > 1e3 && (this.#x(), It());
		for (let e of this.#u) this.#d.delete(e), M(e, g), this.schedule(e);
		for (let e of this.#d) M(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = jt = [], r = [], i = Mt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Vt(e), this.#h() || this.discard(), t;
		}
		if (N = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (jt = null, Mt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Bt(e, t);
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
		this.#r.clear(), Et = this, Rt(r), Rt(n), Et = null, this.#s?.resolve();
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
				a ? r.f ^= h : i & 4 ? t.push(r) : rr(r) && (i & 16 && this.#d.add(r), cr(r));
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
		for (var t = 0; t < e.length; t += 1) et(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== D && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Dt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, Dt = null;
	}
	flush() {
		try {
			At = !0, N = this, this.#g();
		} finally {
			Nt = 0, Ot = null, jt = null, Mt = null, At = !1, N = null, Dt = null, Ut.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(_t);
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
		if (N === null) {
			let t = N = new e();
			!At && Je(() => {
				t.#e || t.flush();
			});
		}
		return N;
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
			if (jt !== null && t === V && (B === null || !(B.f & 2))) return;
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
function It() {
	try {
		ye();
	} catch (e) {
		Xe(e, Ot);
	}
}
var Lt = null;
function Rt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && rr(r) && (Lt = /* @__PURE__ */ new Set(), cr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fn(r), Lt?.size > 0)) {
				Ut.clear();
				for (let e of Lt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Lt.has(n) && (Lt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || cr(n);
					}
				}
				Lt.clear();
			}
		}
		Lt = null;
	}
}
function zt(e) {
	N.schedule(e);
}
function Bt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, h);
		for (var n = e.first; n !== null;) Bt(n, t), n = n.next;
	}
}
function Vt(e) {
	M(e, h);
	for (var t = e.first; t !== null;) Vt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Ht = /* @__PURE__ */ new Set(), Ut = /* @__PURE__ */ new Map(), Wt = !1;
function Gt(e, t) {
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
function Kt(e, t) {
	let n = Gt(e, t);
	return Yn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = Gt(e);
	return t || (r.equals = ze), Be && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function qt(e, t) {
	return F(e, G(() => W(e))), t;
}
function F(e, t, n = !1) {
	return B !== null && (!Gn || B.f & 131072) && Ge() && B.f & 4325394 && (Jn === null || !Jn.has(e)) && Ce(), Jt(e, n ? Qt(t) : t, Mt);
}
function Jt(e, t, n = null) {
	if (!e.equals(t)) {
		Ut.set(e, Un ? t : e.v);
		var r = Ft.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && xt(t), Dt === null && Qe(t);
		}
		e.wv = nr(), Zt(e, g, n), Ge() && V !== null && V.f & 1024 && !(V.f & 96) && (Xn === null ? Zn([e]) : Xn.push(e)), !r.is_fork && Ht.size > 0 && !Wt && Yt();
	}
	return t;
}
function Yt() {
	Wt = !1;
	for (let e of Ht) {
		e.f & 1024 && M(e, _);
		let t;
		try {
			t = rr(e);
		} catch {
			t = !0;
		}
		t && cr(e);
	}
	Ht.clear();
}
function Xt(e) {
	F(e, e.v + 1);
}
function Zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & g) === 0;
			if (l && M(s, t), c & 131072) Ht.add(s);
			else if (c & 2) {
				var u = s;
				Dt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= T), Zt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Lt !== null && Lt.add(d), n === null ? zt(d) : n.push(d);
			}
		}
	}
}
function Qt(t) {
	if (typeof t != "object" || !t || E in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Kt(0), u = null, d = er, f = (e) => {
		if (er === d) return e();
		var t = B, n = er;
		Kn(null), tr(d);
		var r = e();
		return Kn(t), tr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Kt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && xe();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Kt(n.value, u);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Kt(D, u));
					r.set(t, e), Xt(o);
				}
			} else F(n, D), Xt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === E) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Kt(Qt(s ? e[n] : D), u)), r.set(n, o)), o !== void 0) {
				var c = W(o);
				return c === D ? void 0 : c;
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
			return (n !== void 0 || V !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Kt(i ? Qt(e[t]) : D, u)), r.set(t, n)), W(n) === D) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Kt(D, u)), r.set(d + "", p)) : F(p, D);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Kt(void 0, u)), F(c, Qt(n)), r.set(t, c));
			else {
				l = c.v !== D;
				var m = f(() => Qt(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				Xt(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
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
function $t(e) {
	try {
		if (typeof e == "object" && e && E in e) return e[E];
	} catch {}
	return e;
}
function en(e, t) {
	return Object.is($t(e), $t(t));
}
var tn, nn, rn, an;
function on() {
	if (tn === void 0) {
		tn = window, nn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		rn = a(t, "firstChild").get, an = a(t, "nextSibling").get, u(e) && (e[se] = void 0, e[oe] = null, e[ce] = void 0, e.__e = void 0), u(n) && (n[le] = void 0);
	}
}
function sn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
function I(e, t) {
	if (!O) return /* @__PURE__ */ cn(e);
	var n = /* @__PURE__ */ cn(k);
	if (n === null) n = k.appendChild(sn());
	else if (t && n.nodeType !== 3) {
		var r = sn();
		return n?.before(r), Me(r), r;
	}
	return t && mn(n), Me(n), n;
}
function un(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ cn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ln(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = sn();
			return k?.before(r), Me(r), r;
		}
		mn(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ ln(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = sn();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		mn(r);
	}
	return Me(r), r;
}
function dn(e) {
	e.textContent = "";
}
function fn() {
	return !1;
}
function pn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function mn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function hn(e) {
	V === null && (B === null && ve(e), _e()), Un && ge(e);
}
function gn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function _n(e, t) {
	var n = V;
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
	if (e & 4) jt === null ? Ft.ensure().schedule(r) : jt.push(r);
	else if (t !== null) {
		try {
			cr(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && gn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function vn() {
	return B !== null && !Gn;
}
function yn(e) {
	let t = _n(8, null);
	return M(t, h), t.teardown = e, t;
}
function bn(e) {
	hn("$effect");
	var t = V.f;
	if (!B && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return xn(e);
}
function xn(e) {
	return _n(4 | w, e);
}
function Sn(e) {
	return hn("$effect.pre"), _n(8 | w, e);
}
function Cn(e) {
	Ft.ensure();
	let t = _n(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? In(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function wn(e) {
	return _n(4, e);
}
function Tn(e, t) {
	var n = j, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = On(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				qn(n.parent), G(t);
			} finally {
				qn(n);
			}
		}
	});
}
function En() {
	var e = j;
	On(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && M(n, _), rr(n) && cr(n), t.ran = !1;
		}
	});
}
function Dn(e) {
	return _n(ne | C, e);
}
function On(e, t = 0) {
	return _n(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	ft(r, t, n, (t) => {
		_n(8, () => {
			e(...t.map(W));
		});
	});
}
function kn(e, t = 0) {
	return _n(16 | t, e);
}
function An(e) {
	return _n(32 | C, e);
}
function jn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Un, n = B;
		Wn(!0), Kn(null);
		try {
			t.call(null);
		} finally {
			Wn(e), Kn(n);
		}
	}
}
function Mn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ot(() => {
			e.abort(de);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function Nn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Pn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, Mn(e, t && !n), sr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	jn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Fn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ln(e);
		e.remove(), e = n;
	}
}
function Fn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function In(e, t, n = !0) {
	var r = [];
	Ln(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ln(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Ln(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Rn(e) {
	zn(e, !0);
}
function zn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (M(e, g), Ft.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ln(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Vn = null, Hn = !1, Un = !1;
function Wn(e) {
	Un = e;
}
var B = null, Gn = !1;
function Kn(e) {
	B = e;
}
var V = null;
function qn(e) {
	V = e;
}
var Jn = null;
function Yn(e) {
	B !== null && (Jn ??= /* @__PURE__ */ new Set()).add(e);
}
var H = null, U = 0, Xn = null;
function Zn(e) {
	Xn = e;
}
var Qn = 1, $n = 0, er = $n;
function tr(e) {
	er = e;
}
function nr() {
	return ++Qn;
}
function rr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~T), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (rr(a) && St(a), a.wv > e.wv) return !0;
		}
		t & 512 && Dt === null && M(e, h);
	}
	return !1;
}
function ir(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Jn !== null && Jn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ir(a, t, !1) : t === a && (n ? M(a, g) : a.f & 1024 && M(a, _), zt(a));
	}
}
function ar(e) {
	var t = H, n = U, r = Xn, i = B, a = Jn, o = j, s = Gn, c = er, l = e.f;
	H = null, U = 0, Xn = null, B = l & 96 ? null : e, Jn = null, He(e.ctx), Gn = !1, er = ++$n, e.ac !== null && (ot(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= te;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = N?.is_fork;
		if (H !== null) {
			var m;
			if (p || sr(e, U), f !== null && U > 0) for (f.length = U + H.length, m = 0; m < H.length; m++) f[U + m] = H[m];
			else e.deps = f = H;
			if (vn() && e.f & 512) for (m = U; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && U < f.length && (sr(e, U), f.length = U);
		if (Ge() && Xn !== null && !Gn && f !== null && !(e.f & 6146)) for (m = 0; m < Xn.length; m++) ir(Xn[m], e);
		if (i !== null && i !== e) {
			if ($n++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = $n;
			if (t !== null) for (let e of t) e.rv = $n;
			Xn !== null && (r === null ? r = Xn : r.push(...Xn));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (e) {
		return Ye(e);
	} finally {
		e.f ^= te, H = t, U = n, Xn = r, B = i, Jn = a, He(o), Gn = s, er = c;
	}
}
function or(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (H === null || !n.call(H, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~T), s.v !== D && Qe(s), s.ac !== null && ot(() => {
			s.ac.abort(de), s.ac = null, M(s, g);
		}), Ct(s), sr(s, 0);
	}
}
function sr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) or(e, n[r]);
}
function cr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		M(e, h);
		var n = V, r = Hn;
		V = e, Hn = !(t & 96);
		try {
			t & 16777232 ? Nn(e) : Mn(e), jn(e);
			var i = ar(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Qn;
		} finally {
			Hn = r, V = n;
		}
	}
}
function W(e) {
	var t = !!(e.f & 2);
	if (Vn?.add(e), B !== null && !Gn && !(V !== null && V.f & 16384) && (Jn === null || !Jn.has(e))) {
		var r = B.deps;
		if (B.f & 2097152) e.rv < $n && (e.rv = $n, H === null && r !== null && r[U] === e ? U++ : H === null ? H = [e] : H.push(e));
		else {
			B.deps ??= [], n.call(B.deps, e) || B.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [B] : n.call(i, B) || i.push(B);
		}
	}
	if (Un && Ut.has(e)) return Ut.get(e);
	if (t) {
		var a = e;
		if (Un) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || ur(a)) && (o = xt(a)), Ut.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && B !== null && (Hn || !!(B.f & 512)), c = (a.f & b) === 0;
		rr(a) && (s && (a.f |= 512), St(a)), s && !c && (wt(a), lr(a));
	}
	if (Dt?.has(e)) return Dt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function lr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (wt(t), lr(t));
}
function ur(e) {
	if (e.v === D) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Ut.has(t) || t.f & 2 && ur(t)) return !0;
	return !1;
}
function G(e) {
	var t = Gn;
	try {
		return Gn = !0, e();
	} finally {
		Gn = t;
	}
}
function dr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (E in e) fr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && E in n && fr(n);
		}
	}
}
function fr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			fr(e[n], t);
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
var pr = ["touchstart", "touchmove"];
function mr(e) {
	return pr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var hr = Symbol("events"), gr = /* @__PURE__ */ new Set(), _r = /* @__PURE__ */ new Set();
function vr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Sr.call(t, e), !e.cancelBubble) return ot(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function yr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = vr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && yn(() => {
		t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
	(t[hr] ??= {})[e] = n;
}
function br(e) {
	for (var t = 0; t < e.length; t++) gr.add(e[t]);
	for (var n of _r) n(e);
}
var xr = null;
function Sr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	xr = e;
	var s = 0, c = xr === e && e[hr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[hr] = t;
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
		var d = B, f = V;
		Kn(null), qn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[hr]?.[r];
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
			e[hr] = t, delete e.currentTarget, Kn(d), qn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Cr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function wr(e) {
	return Cr?.createHTML(e) ?? e;
}
function Tr(e) {
	var t = pn("template");
	return t.innerHTML = wr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Er(e, t) {
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
		if (O) return Er(k, null), k;
		i === void 0 && (i = Tr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ cn(i)));
		var t = r || nn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ cn(t), s = t.lastChild;
			Er(o, s);
		} else Er(t, t);
		return t;
	};
}
function Dr() {
	if (O) return Er(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = sn();
	return e.append(t, n), Er(t, n), e;
}
function J(e, t) {
	if (O) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Ne();
		return;
	}
	e !== null && e.before(t);
}
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[le] ??= e.nodeValue) && (e[le] = n, e.nodeValue = `${n}`);
}
function Or(e, t) {
	return Ar(e, t);
}
var kr = /* @__PURE__ */ new Map();
function Ar(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	on();
	var l = void 0, u = Cn(() => {
		var s = n ?? t.appendChild(sn());
		ut(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = j;
			if (o && (n.c = o), a && (i.$$events = a), O && Er(t, null), l = e(t, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Oe(), Te;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = mr(r);
					for (let e of [t, document]) {
						var a = kr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), kr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Sr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(gr)), _r.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = kr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Sr), r.delete(e), r.size === 0 && kr.delete(n)) : r.set(e, i);
			}
			_r.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return jr.set(l, u), l;
}
var jr = /* @__PURE__ */ new WeakMap(), Mr = class {
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
			if (n) Rn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Rn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Bn(r, t), t.append(sn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), In(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = fn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = sn();
			i.append(a), this.#n.set(e, {
				effect: An(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, An(() => t(this.anchor)));
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
	var i = new Mr(e), a = n ? S : 0;
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
	kn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Nr(e, t) {
	return t;
}
function Pr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		In(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Fr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			dn(d), d.append(u), e.items.clear();
		}
		Fr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Fr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, Bn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var Ir;
function Lr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = O ? Me(/* @__PURE__ */ cn(u)) : u.appendChild(sn());
	}
	O && Ne();
	var d = null, f = /* @__PURE__ */ yt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, zr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, Vr(d, null, c)) : Rn(d) : In(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: kn(() => {
			p = W(f);
			var e = p.length;
			let t = !1;
			O && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), je(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = N, v = fn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (c = k, t = !0, je(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Jt(S.v, b), S.i && Jt(S.i, y), v && u.unskip_effect(S.e)) : (S = Br(l, h ? c : Ir ??= sn(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = An(() => s(c)) : (d = An(() => s(Ir ??= sn())), d.f |= ee)), e > r.size && he("", "", ""), O && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
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
	h = !1, O && (c = k);
}
function Rr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function zr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Rr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Rn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ee, _ === l) Vr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Hr(e, d, _), Hr(e, _, y), Vr(_, y, n), d = _, p = [], m = [], l = Rr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Vr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Hr(e, S.prev, C.next), Hr(e, d, S), Hr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Vr(_, l, n), Hr(e, _.prev, _.next), Hr(e, _, d === null ? e.effect.first : d.next), Hr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Rr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Rr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Fr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Rr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Pr(e, w, te);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Br(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Gt(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? Gt(i) : null;
	return {
		v: c,
		i: l,
		e: An(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Vr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ ln(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Hr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Ur = [..." 	\n\r\f\xA0\v﻿"];
function Wr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ur.includes(r[o - 1])) && (s === r.length || Ur.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Gr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Kr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function qr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Kr)), i && c.push(...Object.keys(i).map(Kr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Kr(e.substring(l, u).trim());
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
		return r && (n += Gr(r)), i && (n += Gr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Jr(e, t, n, r, i, a) {
	var o = e[se];
	if (O || o !== n || o === void 0) {
		var s = Wr(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Yr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Xr(e, t, n, r) {
	var i = e[ce];
	if (O || i !== t) {
		var a = qr(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ce] = t;
	} else r && (Array.isArray(r) ? (Yr(e, n?.[0], r[0]), Yr(e, n?.[1], r[1], "important")) : Yr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Zr(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return ke();
		for (var i of t.options) i.selected = n.includes(ei(i));
		return;
	}
	for (i of t.options) if (en(ei(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function Qr(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Zr(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), yn(() => {
		t.disconnect();
	});
}
function $r(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	st(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ei);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ei(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), wn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (Zr(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ei(s), n(a));
		}
		e.__value = a, i = !1;
	}), Qr(e);
}
function ei(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ti = Symbol("is custom element"), ni = Symbol("is html"), ri = fe ? "link" : "LINK", ii = fe ? "progress" : "PROGRESS";
function ai(e) {
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
		e[ue] = n, Je(n), at();
	}
}
function oi(e, t) {
	var n = si(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ii) && (e.value = t ?? "");
}
function Z(e, t, n, r) {
	var i = si(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ri) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && li(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function si(e) {
	return e[oe] ??= {
		[ti]: e.nodeName.includes("-"),
		[ni]: e.namespaceURI === Ee
	};
}
var ci = /* @__PURE__ */ new Map();
function li(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ci.get(t);
	if (n) return n;
	ci.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ui(e, t) {
	return e === t || e?.[E] === t;
}
function di(e = {}, t, n, r) {
	var i = j.r, a = V;
	return wn(() => {
		var o, s;
		return On(() => {
			o = s, s = r?.() || [], G(() => {
				ui(n(...s), e) || (t(e, ...s), o && ui(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ui(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function fi(e = !1) {
	let t = j, n = t.l.u;
	if (!n) return;
	let r = () => dr(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ gt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && Sn(() => {
		pi(t, r), p(n.b);
	}), bn(() => {
		let e = G(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && bn(() => {
		pi(t, r), p(n.a);
	});
}
function pi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Q(e, t, n, r) {
	var i = !Be || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ gt(r), W(u)) : (l && (l = !1, c = s ? G(r) : r), c);
	let f;
	if (o) {
		var p = E in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = nt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && be(t), f(m)));
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
	var v = !1, y = (n & 1 ? gt : yt)(() => (v = !1, g()));
	o && W(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && o ? Qt(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Un && v || b.f & 16384 ? y.v : W(y);
	});
}
function mi(e) {
	j === null && pe("onMount"), Be && j.l !== null ? hi(j).m.push(e) : bn(() => {
		let t = G(e);
		if (typeof t == "function") return t;
	});
}
function hi(e) {
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
function gi(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
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
//#region viewer/assets/checklist-editor.js
function _i(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function vi(e) {
	return e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.length > 0 && e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
}
function yi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = vi(e);
	}), t;
}
function bi(e, t) {
	return (e.dependsOn ?? []).some((e) => vi(t.get(e) ?? { checks: [] }) !== "passed");
}
function xi(e) {
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
		a[vi(e)] += 1;
		let t = bi(e, n);
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
var Si = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function Ci(e, t) {
	let { item: n, check: r } = _i(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? Si[r.status] ?? "pending" : t.status;
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
	return n.status = vi(n), e;
}
function wi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status, e.persistedObserved = e.observed ?? null;
	})), t;
}
function Ti(e, t = {}) {
	let n = e.revision, r = gi(wi(e), {
		derive: yi,
		historyLimit: t.historyLimit
	});
	function i() {
		let e = structuredClone(r.derived);
		return Object.freeze({
			document: e,
			summary: xi(e),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, Ci, t), i();
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
			return n = e.revision, r.commit(wi(e), { keepHistory: !0 }), i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var Ei = "task-progress.cautious-mode.v1", Di = "自動儲存模式。", Oi = "謹慎模式：修改後需按儲存。", ki = "有尚未儲存的變更。", Ai = "即將自動儲存…", ji = "正在寫入…", Mi = "已儲存。", Ni = "已放棄尚未儲存的變更。", Pi = "沒有需要儲存的變更。", Fi = "儲存失敗。", Ii = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function Li(e = globalThis.localStorage) {
	try {
		return e?.getItem(Ei) === "true";
	} catch {
		return !1;
	}
}
function Ri(e, t) {
	let n = t === !0;
	try {
		e?.setItem(Ei, n ? "true" : "false");
	} catch {}
	return n;
}
function zi({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, timers: a = globalThis, onChange: o = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let s = Li(n), c = "idle", l = s ? Oi : Di, u = !1, d = null, f = Promise.resolve(), p = 0, m = () => e.snapshot();
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
			n && (_("idle", Pi), g());
			return;
		}
		let r = e.prepareSave();
		if (r.errors.length) {
			_("incomplete", r.errors[0].message), g();
			return;
		}
		u = !1, _("saving", ji), g();
		try {
			let n = await t({
				revision: r.revision,
				results: r.results
			});
			e.commit(n), _("saved", Mi);
		} catch (e) {
			u = !0, _(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Fi);
		}
		g();
	}
	function b(e = !1) {
		return v(), p += 1, f = f.then(() => y(e)).catch((e) => {
			u = !0, _("error", e?.message ?? Fi), g();
		}).finally(() => {
			--p;
		}), f;
	}
	async function x() {
		for (let e = 0; e < 8; e += 1) if (d !== null && b(), await f, d === null && p === 0) return;
	}
	function S(e) {
		return s ? (u || _("draft", ki), null) : u ? null : e ? (v(), _("pending", Ai), d = a.setTimeout(() => {
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
			if (m().dirty) return _("mode_blocked", Ii), g(), h();
			s = !1;
		}
		return Ri(n, s), u || _("idle", s ? Oi : Di), g(), h();
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
			return v(), e.discard(), u = !1, _("idle", Ni), g(), h();
		},
		save() {
			return b(!0);
		},
		flush: x,
		setCautious: w
	});
}
//#endregion
//#region viewer/assets/theme-model.js
var Bi = "task-progress.theme.v1", Vi = [
	"system",
	"light",
	"dark",
	"custom"
], Hi = [
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
], Ui = Object.freeze({
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
}), Wi = Object.freeze({
	version: 1,
	mode: "system"
}), Gi = /^#[0-9a-f]{6}$/i;
function Ki(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function qi(e) {
	return typeof e == "string" && Gi.test(e);
}
function Ji(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Ui[n], i = { base: n };
	for (let e of Hi) {
		let n = t[e.key];
		i[e.key] = qi(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Yi(e) {
	if (!Ki(e) || e.version !== 1 || !Vi.includes(e.mode)) return { ...Wi };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Ki(e.custom) ? t.custom = Ji(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = Ji()), t;
}
function Xi(e) {
	try {
		let t = e?.getItem(Bi);
		return t ? Yi(JSON.parse(t)) : { ...Wi };
	} catch {
		return { ...Wi };
	}
}
function Zi(e, t) {
	let n = Yi(t);
	try {
		e?.setItem(Bi, JSON.stringify(n));
	} catch {}
	return n;
}
function Qi(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function $i(e, t) {
	let n = Yi(t);
	e.dataset.theme = n.mode;
	for (let t of Hi) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? Ji();
		e.dataset.themeBase = t.base;
		for (let n of Hi) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function ea(e, t, n = "light") {
	let r = Yi(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = Ji(n)), Yi(i);
}
function ta(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function na(e, t) {
	if (!qi(e) || !qi(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => ta(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function ra(e) {
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
	].filter(([, e, t]) => na(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function ia({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Xi(t);
	e && $i(e, r);
	function i(n) {
		return r = Zi(t, n), e && $i(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Qi(n);
		},
		setMode(e) {
			return i(ea(r, e, Qi(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: Ji(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var aa = /* @__PURE__ */ q("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), oa = /* @__PURE__ */ q("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function sa(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Q(t, "status", 8, "pending"), o = Q(t, "interactive", 8, !1), s = Q(t, "label", 8, ""), c = Q(t, "onCycle", 8, () => {}), l = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	Tn(() => dr(a()), () => {
		F(n, l[a()] ?? "?");
	}), Tn(() => dr(a()), () => {
		F(r, u[a()] ?? a());
	}), Tn(() => (dr(s()), W(r)), () => {
		F(i, s() ? `${s()}：${W(r)}` : W(r));
	}), En();
	var d = Dr(), f = un(d), p = (e) => {
		var t = aa(), r = I(t), o = I(r, !0);
		A(r), A(t), R(() => {
			Jr(t, 1, `marker-box marker-${a()} marker-box-button`), Z(t, "aria-label", `${W(i)}，點擊切換下一個結果`), Y(o, W(n));
		}), K("click", t, function(...e) {
			c()?.apply(this, e);
		}), J(e, t);
	}, m = (e) => {
		var t = oa(), r = I(t), o = I(r, !0);
		A(r), A(t), R(() => {
			Jr(t, 1, `marker-box marker-${a()}`), Z(t, "aria-label", W(i)), Y(o, W(n));
		}), J(e, t);
	};
	X(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), J(e, d), We();
}
br(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/NextStepCard.svelte
var ca = /* @__PURE__ */ q("<p class=\"next-step-heading\"> </p>"), la = /* @__PURE__ */ q("<h3 class=\"next-step-title\"> </h3>"), ua = /* @__PURE__ */ q("<div><dt> </dt><dd> </dd></div>"), da = /* @__PURE__ */ q("<dl class=\"next-step-fields\"><!> <!></dl>"), fa = /* @__PURE__ */ q("<pre class=\"next-step-command\"> </pre>"), pa = /* @__PURE__ */ q("<section class=\"next-step-card\"><!> <!> <!> <!></section>");
function ma(e, t) {
	let n = Q(t, "heading", 8, ""), r = Q(t, "title", 8, ""), i = Q(t, "action", 8, ""), a = Q(t, "expect", 8, ""), o = Q(t, "command", 8, ""), s = Q(t, "actionLabel", 8, "要做什麼"), c = Q(t, "expectLabel", 8, "怎樣算通過");
	var l = pa(), u = I(l), d = (e) => {
		var t = ca(), r = I(t, !0);
		A(t), R(() => Y(r, n())), J(e, t);
	};
	X(u, (e) => {
		n() && e(d);
	});
	var f = L(u, 2), p = (e) => {
		var t = la(), n = I(t, !0);
		A(t), R(() => Y(n, r())), J(e, t);
	};
	X(f, (e) => {
		r() && e(p);
	});
	var m = L(f, 2), h = (e) => {
		var t = da(), n = I(t), r = (e) => {
			var t = ua(), n = I(t), r = I(n, !0);
			A(n);
			var a = L(n), o = I(a, !0);
			A(a), A(t), R(() => {
				Y(r, s()), Y(o, i());
			}), J(e, t);
		};
		X(n, (e) => {
			i() && e(r);
		});
		var o = L(n, 2), l = (e) => {
			var t = ua(), n = I(t), r = I(n, !0);
			A(n);
			var i = L(n), o = I(i, !0);
			A(i), A(t), R(() => {
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
	var g = L(m, 2), _ = (e) => {
		var t = fa(), n = I(t, !0);
		A(t), R(() => Y(n, o())), J(e, t);
	};
	X(g, (e) => {
		o() && e(_);
	}), A(l), R(() => Z(l, "aria-label", n() || r())), J(e, l);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressSummary.svelte
var ha = /* @__PURE__ */ q("<div><b> </b> <span> </span></div>"), ga = /* @__PURE__ */ q("<div class=\"progress-stats\"></div>"), _a = /* @__PURE__ */ q("<i></i>"), va = /* @__PURE__ */ q("<div class=\"progress-bar progress-bar-segmented\" role=\"img\"></div>"), ya = /* @__PURE__ */ q("<div class=\"progress-bar progress-bar-continuous\" role=\"img\"><i class=\"progress-fill\"></i></div>"), ba = /* @__PURE__ */ q("<span class=\"progress-note\"> </span>"), xa = /* @__PURE__ */ q("<p class=\"progress-caption\"><span> </span> <!></p>"), Sa = /* @__PURE__ */ q("<section class=\"progress-summary\"><!> <!> <!></section>");
function Ca(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = Q(t, "stats", 24, () => []), a = Q(t, "bar", 8, null), o = Q(t, "caption", 8, ""), s = Q(t, "note", 8, ""), c = Q(t, "label", 8, "進度摘要"), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	Tn(() => dr(a()), () => {
		F(n, a()?.form === "segmented" && Array.isArray(a().cells) ? a().cells : []);
	}), Tn(() => dr(a()), () => {
		F(r, a()?.form === "continuous" ? d(a().ratio) : 0);
	}), En(), fi();
	var f = Sa(), p = I(f), m = (e) => {
		var t = ga();
		Lr(t, 5, i, (e) => e.key ?? e.label, (e, t) => {
			var n = ha(), r = I(n), i = I(r, !0);
			A(r);
			var a = L(r, 2), o = I(a, !0);
			A(a), A(n), R((e) => {
				Jr(n, 1, e), Y(i, (W(t), G(() => W(t).value))), Y(o, (W(t), G(() => W(t).label)));
			}, [() => (W(t), G(() => `progress-stat${u(W(t).tone)}`))]), J(e, n);
		}), A(t), J(e, t);
	};
	X(p, (e) => {
		dr(i()), G(() => i().length) && e(m);
	});
	var h = L(p, 2), g = (e) => {
		var t = va();
		Lr(t, 5, () => W(n), Nr, (e, t) => {
			var n = _a();
			R((e) => Jr(n, 1, e), [() => (W(t), G(() => `progress-cell${u(W(t))}`))]), J(e, n);
		}), A(t), R(() => Z(t, "aria-label", o() || c())), J(e, t);
	}, _ = (e) => {
		var t = ya(), n = I(t);
		A(t), R(() => {
			Z(t, "aria-label", o() || c()), Xr(n, `width: ${W(r)}%`);
		}), J(e, t);
	};
	X(h, (e) => {
		dr(a()), G(() => a()?.form === "segmented") ? e(g) : (dr(a()), G(() => a()?.form === "continuous") && e(_, 1));
	});
	var v = L(h, 2), y = (e) => {
		var t = xa(), n = I(t), r = I(n, !0);
		A(n);
		var i = L(n, 2), a = (e) => {
			var t = ba(), n = I(t, !0);
			A(t), R(() => Y(n, s())), J(e, t);
		};
		X(i, (e) => {
			s() && e(a);
		}), A(t), R(() => Y(r, o())), J(e, t);
	};
	X(v, (e) => {
		(o() || s()) && e(y);
	}), A(f), R(() => Z(f, "aria-label", c())), J(e, f), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var wa = /* @__PURE__ */ q("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), Ta = /* @__PURE__ */ q("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), Ea = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function Da(e, t) {
	Ue(t, !1);
	let n = Q(t, "cautious", 8, !0), r = Q(t, "onToggleCautious", 8, null), i = Q(t, "cautiousLabel", 8, "謹慎模式"), a = Q(t, "dirty", 8, !1), o = Q(t, "saving", 8, !1), s = Q(t, "canUndo", 8, !1), c = Q(t, "canRedo", 8, !1), l = Q(t, "message", 8, ""), u = Q(t, "buttonLabel", 8, "儲存"), d = Q(t, "savingLabel", 8, "正在儲存…"), f = Q(t, "undoLabel", 8, "復原"), p = Q(t, "redoLabel", 8, "重做"), m = Q(t, "discardLabel", 8, "放棄"), h = Q(t, "onSave", 8, () => {}), g = Q(t, "onUndo", 8, () => {}), _ = Q(t, "onRedo", 8, () => {}), v = Q(t, "onDiscard", 8, () => {});
	fi();
	var y = Ea(), b = un(y), x = I(b, !0);
	A(b);
	var S = L(b, 2), C = I(S), w = I(C, !0);
	A(C);
	var ee = L(C, 2), T = I(ee, !0);
	A(ee), A(S);
	var te = L(S, 2), ne = (e) => {
		var t = wa(), a = I(t, !0);
		A(t), R(() => {
			Z(t, "aria-pressed", n()), Z(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), Y(a, i());
		}), K("click", t, () => r()(!n())), J(e, t);
	};
	X(te, (e) => {
		r() && e(ne);
	});
	var re = L(te, 2), E = (e) => {
		var t = Ta(), n = un(t), r = I(n, !0);
		A(n);
		var i = L(n, 2), s = I(i, !0);
		A(i), R(() => {
			n.disabled = o(), Y(r, m()), i.disabled = !a() || o(), Y(s, o() ? d() : u());
		}), K("click", n, function(...e) {
			v()?.apply(this, e);
		}), K("click", i, function(...e) {
			h()?.apply(this, e);
		}), J(e, t);
	};
	X(re, (e) => {
		n() && e(E);
	}), R(() => {
		Y(x, l()), Z(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), Y(w, f()), Z(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), Y(T, p());
	}), K("click", C, function(...e) {
		g()?.apply(this, e);
	}), K("click", ee, function(...e) {
		_()?.apply(this, e);
	}), J(e, y), We();
}
br(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Oa = /* @__PURE__ */ q("<option> </option>"), ka = /* @__PURE__ */ q("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Aa = /* @__PURE__ */ q("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function ja(e, t) {
	Ue(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = Q(t, "mode", 8, "system"), o = Q(t, "custom", 8, null), s = Q(t, "systemScheme", 8, "light"), c = Q(t, "onModeChange", 8, () => {}), l = Q(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P([]), m = /* @__PURE__ */ P(a()), h = /* @__PURE__ */ P(o()?.base ?? s()), g = /* @__PURE__ */ P(v(Ji(W(h)))), _ = /* @__PURE__ */ P({ ...W(g) });
	function v(e) {
		return Object.fromEntries(Hi.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		F(h, e.base), F(g, v(e)), F(_, { ...W(g) });
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
		y(o() ? Ji(o().base, o()) : Ji(s())), typeof W(f).showModal == "function" ? W(f).showModal() : W(f).setAttribute("open", "");
	}
	function S() {
		W(f).open && W(f).close();
	}
	function C(e) {
		y(Ji(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		F(g, {
			...W(g),
			[e.key]: r
		}), F(_, {
			...W(_),
			[e.key]: r
		}), W(p)[t]?.setCustomValidity("");
	}
	function ee(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), F(g, {
			...W(g),
			[e.key]: n.value
		}), r && F(_, {
			...W(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function T() {
		F(m, a()), S();
	}
	function te(e) {
		e.preventDefault(), T();
	}
	function ne() {
		let e = W(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Ji(W(h), W(_))), S();
	}
	Tn(() => dr(a()), () => {
		F(m, a());
	}), Tn(() => (W(h), W(_)), () => {
		F(n, Ji(W(h), W(_)));
	}), Tn(() => W(n), () => {
		F(r, ra(W(n)));
	}), Tn(() => W(r), () => {
		F(i, W(r).length ? `注意：${W(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), En(), fi();
	var re = Aa(), E = un(re), ie = L(I(E), 2);
	Lr(ie, 5, () => u, (e) => e.value, (e, t) => {
		var n = Oa(), r = I(n, !0);
		A(n);
		var i = {};
		R(() => {
			Y(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
		}), J(e, n);
	}), A(ie), A(E);
	var ae = L(E, 2), oe = I(ae), se = L(I(oe), 2);
	A(oe);
	var ce = L(oe, 4), le = L(I(ce), 2), ue = I(le);
	ue.value = ue.__value = "light";
	var de = L(ue);
	de.value = de.__value = "dark", A(le);
	var fe;
	Qr(le), A(ce);
	var pe = L(ce, 2);
	Lr(pe, 7, () => Hi, (e) => e.key, (e, t, r) => {
		var i = ka(), a = I(i), o = I(a, !0);
		A(a);
		var s = L(a, 2), c = I(s);
		ai(c);
		var l = L(c, 2);
		ai(l), Z(l, "pattern", "#[0-9a-fA-F]{6}"), di(l, (e, t) => qt(p, W(p)[t] = e), (e) => W(p)?.[e], () => [W(r)]), A(s), A(i), R(() => {
			Y(o, (W(t), G(() => W(t).label))), Z(c, "aria-label", (W(t), G(() => `${W(t).label}選色器`))), oi(c, (W(n), W(t), G(() => W(n)[W(t).key]))), Z(l, "aria-label", (W(t), G(() => `${W(t).label}十六進位色碼`))), oi(l, (W(g), W(t), G(() => W(g)[W(t).key])));
		}), K("input", c, (e) => w(W(t), W(r), e)), K("input", l, (e) => ee(W(t), e)), J(e, i);
	}), A(pe);
	var me = L(pe, 2);
	let he;
	var ge = I(me, !0);
	A(me);
	var _e = L(me, 2), ve = I(_e), ye = L(ve, 4), be = L(ye, 2);
	A(_e), A(ae), di(ae, (e) => F(f, e), () => W(f)), R(() => {
		fe !== (fe = W(h)) && (le.value = (le.__value = W(h)) ?? "", Zr(le, W(h))), he = Jr(me, 1, "theme-dialog-status", null, he, { "theme-status-warning": W(r).length > 0 }), Y(ge, W(i));
	}), K("change", ie, b), $r(ie, () => W(m), (e) => F(m, e)), yr("cancel", ae, te), K("click", se, T), K("change", le, C), K("click", ve, () => y(Ji(W(h)))), K("click", ye, T), K("click", be, ne), J(e, re), We();
}
br([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var Ma = 1, Na = /* @__PURE__ */ new Set(["load", "save"]);
function Pa(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== Ma || typeof t.id != "string") return;
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
		if (!Na.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: Ma,
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
var Fa = /* @__PURE__ */ q("<p class=\"checklist-round\"> </p>"), Ia = /* @__PURE__ */ q("<p class=\"checklist-notice\" role=\"status\"> </p>"), La = /* @__PURE__ */ q("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), Ra = /* @__PURE__ */ q("<small> </small>"), za = /* @__PURE__ */ q("<div><dt>Reason</dt><dd> </dd></div>"), Ba = /* @__PURE__ */ q("<div><dt>Observed</dt><dd> </dd></div>"), Va = /* @__PURE__ */ q("<div><dt>Resolved</dt><dd> </dd></div>"), Ha = /* @__PURE__ */ q("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), Ua = /* @__PURE__ */ q("<section><div class=\"checklist-check-heading\"><!> <strong> </strong> <span class=\"checklist-owner\"> </span></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), Wa = /* @__PURE__ */ q("<article><header class=\"checklist-item-header\"><!> <div><h2> </h2> <p> </p> <!></div> <span class=\"checklist-status\"> </span></header> <div class=\"checklist-checks\"></div></article>"), Ga = /* @__PURE__ */ q("<!> <!> <section class=\"checklist-items\" aria-label=\"Implementation checklist items\"></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), Ka = /* @__PURE__ */ q("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><p class=\"section-kicker\">Implementation Checklist</p> <h1> </h1> <!></div> <!></header> <!></main>");
function qa(e, t) {
	Ue(t, !1);
	let n = null, r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P(!0), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("正在載入 Checklist…"), s = (e) => ({
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	})[e] ?? e;
	function c(e) {
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
	let l = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), u = (e) => e === "saving" ? "saving" : l.has(e) ? "error" : "clean", d = /* @__PURE__ */ P(null), f = /* @__PURE__ */ P({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function p() {
		F(f, {
			mode: W(d).mode,
			custom: W(d).custom,
			systemScheme: W(d).systemScheme
		});
	}
	mi(async () => {
		F(d, ia()), p();
		try {
			let e = Pa();
			n = zi({
				session: Ti(await e.load()),
				save: e.save,
				debounceCommand: (e) => e.type === "set-observed",
				onChange: (e) => {
					F(r, e), F(o, e.message);
				}
			}), F(r, n.snapshot()), F(o, W(r).message);
		} catch (e) {
			F(a, e instanceof Error ? e.message : "Checklist 載入失敗。"), F(o, W(a));
		} finally {
			F(i, !1);
		}
	});
	function m(e) {
		try {
			n.dispatch(e), F(r, n.snapshot()), F(o, W(r).message);
		} catch (e) {
			F(o, e.message);
		}
	}
	function h(e, t) {
		m({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function g() {
		n.undo(), F(r, n.snapshot());
	}
	function _() {
		n.redo(), F(r, n.snapshot());
	}
	function v() {
		F(r, n.discard());
	}
	async function y() {
		await n.save(), F(r, n.snapshot());
	}
	async function b(e) {
		F(r, await n.setCautious(e));
	}
	fi();
	var x = Ka(), S = I(x), C = I(S), w = L(I(C), 2), ee = I(w, !0);
	A(w);
	var T = L(w, 2), te = (e) => {
		var t = Fa(), n = I(t, !0);
		A(t), R(() => Y(n, W(r).document.roundIdentity)), J(e, t);
	};
	X(T, (e) => {
		W(r) && e(te);
	}), A(C);
	var ne = L(C, 2), re = (e) => {
		ja(e, {
			get mode() {
				return W(f).mode;
			},
			get custom() {
				return W(f).custom;
			},
			get systemScheme() {
				return W(f).systemScheme;
			},
			onModeChange: (e) => {
				W(d).setMode(e), p();
			},
			onApplyCustom: (e) => {
				W(d).applyCustom(e), p();
			}
		});
	};
	X(ne, (e) => {
		W(d) && e(re);
	}), A(S);
	var E = L(S, 2), ie = (e) => {
		var t = Ia(), n = I(t, !0);
		A(t), R(() => Y(n, W(o))), J(e, t);
	}, ae = (e) => {
		var t = La(), n = I(t, !0);
		A(t), R(() => Y(n, W(a))), J(e, t);
	}, oe = (e) => {
		var t = Ga(), n = un(t);
		{
			let e = /* @__PURE__ */ yt(() => c(W(r).summary)), t = /* @__PURE__ */ yt(() => ({
				form: "segmented",
				cells: W(r).summary.cells
			})), i = /* @__PURE__ */ yt(() => `${W(r).summary.checks.passed} / ${W(r).summary.checks.total} checks 通過`), a = /* @__PURE__ */ yt(() => W(r).summary.checks.failed > 0 ? `${W(r).summary.checks.failed} 個失敗` : "");
			Ca(n, {
				get stats() {
					return W(e);
				},
				get bar() {
					return W(t);
				},
				get caption() {
					return W(i);
				},
				get note() {
					return W(a);
				}
			});
		}
		var i = L(n, 2), a = (e) => {
			{
				let t = /* @__PURE__ */ yt(() => W(r).summary.nextStep.isManual ? "下一步 · 需人工驗證" : "下一步 · Agent"), n = /* @__PURE__ */ yt(() => `${W(r).summary.nextStep.workItemId}. ${W(r).summary.nextStep.itemTitle} — ${W(r).summary.nextStep.title}`);
				ma(e, {
					get heading() {
						return W(t);
					},
					get title() {
						return W(n);
					},
					get action() {
						return W(r).summary.nextStep.action;
					},
					get expect() {
						return W(r).summary.nextStep.expect;
					}
				});
			}
		};
		X(i, (e) => {
			W(r).summary.nextStep && e(a);
		});
		var l = L(i, 2);
		Lr(l, 5, () => W(r).document.items, (e) => e.id, (e, t) => {
			var n = Wa(), r = I(n), i = I(r);
			{
				let e = /* @__PURE__ */ yt(() => `工作項目 ${W(t).id}`);
				sa(i, {
					get status() {
						return W(t).status;
					},
					get label() {
						return W(e);
					}
				});
			}
			var a = L(i, 2), o = I(a), c = I(o);
			A(o);
			var l = L(o, 2), u = I(l, !0);
			A(l);
			var d = L(l, 2), f = (e) => {
				var n = Ra(), r = I(n);
				A(n), R((e) => Y(r, `Depends on: ${e ?? ""}`), [() => W(t).dependsOn.join(", ")]), J(e, n);
			};
			X(d, (e) => {
				W(t).dependsOn.length && e(f);
			}), A(a);
			var p = L(a, 2), g = I(p, !0);
			A(p), A(r);
			var _ = L(r, 2);
			Lr(_, 5, () => W(t).checks, (e) => e.index, (e, n) => {
				var r = Ua(), i = I(r), a = I(i);
				sa(a, {
					get status() {
						return W(n).status;
					},
					get interactive() {
						return W(n).isManual;
					},
					get label() {
						return W(n).title;
					},
					onCycle: () => h(W(t).id, W(n))
				});
				var o = L(a, 2), s = I(o, !0);
				A(o);
				var c = L(o, 2), l = I(c, !0);
				A(c), A(i);
				var u = L(i, 2), d = I(u), f = L(I(d)), p = I(f, !0);
				A(f), A(d);
				var g = L(d, 2), _ = L(I(g)), v = I(_, !0);
				A(_), A(g);
				var y = L(g, 2), b = (e) => {
					var t = za(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Y(i, W(n).reason)), J(e, t);
				};
				X(y, (e) => {
					W(n).reason && e(b);
				});
				var x = L(y, 2), S = (e) => {
					var t = Ba(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Y(i, W(n).observed)), J(e, t);
				};
				X(x, (e) => {
					W(n).observed && !(W(n).isManual && W(n).status === "failed") && e(S);
				});
				var C = L(x, 2), w = (e) => {
					var t = Va(), r = L(I(t)), i = I(r, !0);
					A(r), A(t), R(() => Y(i, W(n).resolved)), J(e, t);
				};
				X(C, (e) => {
					W(n).resolved && e(w);
				}), A(u);
				var ee = L(u, 2), T = (e) => {
					var r = Ha(), i = L(I(r), 2);
					rt(i), A(r), R(() => oi(i, W(n).observed ?? "")), K("input", i, (e) => m({
						type: "set-observed",
						workItemId: W(t).id,
						checkIndex: W(n).index,
						value: e.currentTarget.value
					})), J(e, r);
				};
				X(ee, (e) => {
					W(n).isManual && W(n).status === "failed" && e(T);
				}), A(r), R(() => {
					Jr(r, 1, `checklist-check checklist-${W(n).status}`), Y(s, W(n).title), Y(l, W(n).isManual ? "需人工驗證" : "Agent"), Y(p, W(n).action), Y(v, W(n).expect);
				}), J(e, r);
			}), A(_), A(n), R((e) => {
				Jr(n, 1, `checklist-item checklist-${W(t).status}`), Y(c, `${W(t).id ?? ""}. ${W(t).title ?? ""}`), Y(u, W(t).outcome), Y(g, e);
			}, [() => s(W(t).status)]), J(e, n);
		}), A(l);
		var d = L(l, 2);
		Da(I(d), {
			get cautious() {
				return W(r).cautious;
			},
			onToggleCautious: b,
			get dirty() {
				return W(r).dirty;
			},
			get saving() {
				return W(r).saving;
			},
			get canUndo() {
				return W(r).history.canUndo;
			},
			get canRedo() {
				return W(r).history.canRedo;
			},
			get message() {
				return W(o);
			},
			onSave: y,
			onUndo: g,
			onRedo: _,
			onDiscard: v
		}), A(d), R((e) => {
			Z(d, "data-state", e), Z(d, "aria-busy", W(r).saving);
		}, [() => u(W(r).status)]), J(e, t);
	};
	X(E, (e) => {
		W(i) ? e(ie) : W(r) ? e(oe, -1) : e(ae, 1);
	}), A(x), R(() => Y(ee, W(r)?.document.fileName ?? "TaskProgress Checklist")), J(e, x), We();
}
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-main.js
br(["input"]), Or(qa, { target: document.querySelector("#app") });
//#endregion
