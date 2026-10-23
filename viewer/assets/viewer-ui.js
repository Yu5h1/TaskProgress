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
var x = 1024, S = 2048, C = 4096, w = 8192, ee = 16384, T = 32768, te = 1 << 25, ne = 65536, re = 1 << 19, E = 1 << 20, ie = 1 << 25, D = 65536, O = 1 << 21, ae = 1 << 22, oe = 1 << 23, se = Symbol("$state"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/shared/errors.js
function _e() {
	throw Error("https://svelte.dev/e/invalid_default_snippet");
}
function ve(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function ye() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function be(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function xe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Se() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ce(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function we() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Te(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ee() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function De() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ae() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function je(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Me() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ne() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function Pe(e) {
	k = e;
}
var A;
function Fe(e) {
	if (e === null) throw je(), t;
	return A = e;
}
function Ie() {
	return Fe(/* @__PURE__ */ xn(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ xn(A) !== null) throw je(), t;
		A = e;
	}
}
function Le(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ xn(n);
		A = n;
	}
}
function Re(e = !0) {
	for (var t = 0, n = A;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ xn(n);
		e && n.remove(), n = i;
	}
}
function ze(e) {
	if (!e || e.nodeType !== 8) throw je(), t;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Be(e) {
	return e === this.v;
}
function Ve(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function He(e) {
	return !Ve(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Ue = !1;
function We() {
	Ue = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ge = null;
function Ke(e) {
	Ge = e;
}
function qe(e, t = !1, n) {
	Ge = {
		p: Ge,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: Ue && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Je(e) {
	var t = Ge, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Mn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ge = t.p, e ?? {};
}
function Ye() {
	return !Ue || Ge !== null && Ge.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Xe = [];
function Ze() {
	var e = Xe;
	Xe = [], y(e);
}
function Qe(e) {
	if (Xe.length === 0 && !zt) {
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
	var t = H;
	if (t === null) return V.f |= oe, e;
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
var nt = ~(S | C | x);
function rt(e, t) {
	e.f = e.f & nt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? rt(e, x) : rt(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= D, at(t.deps));
}
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), at(e.deps), rt(e, x);
}
//#endregion
//#region node_modules/svelte/src/store/utils.js
function st(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), _;
	let r = W(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/svelte/src/store/shared/index.js
function ct(e) {
	let t;
	return st(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var lt = !1, ut = Symbol("unmounted");
function dt(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ P(void 0),
		unsubscribe: _
	};
	if (r.store !== e && !(ut in n)) if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = _;
	else {
		var i = !0;
		r.unsubscribe = st(e, (e) => {
			i ? r.source.v = e : F(r.source, e);
		}), i = !1;
	}
	return e && ut in n ? ct(e) : U(r.source);
}
function ft() {
	let e = {};
	function t() {
		An(() => {
			for (var t in e) e[t].unsubscribe();
			l(e, ut, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function pt(e) {
	var t = lt;
	try {
		return lt = !1, [e(), lt];
	} finally {
		lt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function mt(e) {
	k && /* @__PURE__ */ bn(e) !== null && Sn(e);
}
var ht = !1;
function gt() {
	ht || (ht = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function _t(e) {
	var t = V, n = H;
	rr(null), ir(null);
	try {
		return e();
	} finally {
		rr(t), ir(n);
	}
}
function vt(e, t, n, r = n) {
	e.addEventListener(t, () => _t(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), gt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function yt(e) {
	let t = 0, n = nn(0), r;
	return () => {
		kn() && (U(n), Rn(() => (t === 0 && (r = W(() => e(() => cn(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, cn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var bt = ne | re;
function xt(e, t, n, r) {
	new St(e, t, n, r);
}
var St = class {
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
	#h = yt(() => (this.#m = nn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = zn(() => {
			if (k) {
				let e = this.#t;
				Ie();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, bt), k && (this.#e = A);
	}
	#g() {
		try {
			this.#a = Bn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Qe(r), t && (this.#s = Bn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ne();
				return;
			}
			t = !0, n && ke(), this.#s !== null && qn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Bn(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = yn();
			e.append(t), this.#a = this.#S(() => Bn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, qn(this.#o, () => {
				this.#o = null;
			}), this.#x(N));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Bn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Zn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Bn(() => t(this.#e));
			} else this.#x(N);
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
		var t = H, n = V, r = Ge;
		ir(this.#i), rr(this.#i), Ke(this.#i.ctx);
		try {
			return Gt.ensure(), e();
		} catch (e) {
			return et(e), null;
		} finally {
			ir(t), rr(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && qn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && on(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), U(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		N?.is_fork ? (this.#a && N.skip_effect(this.#a), this.#o && N.skip_effect(this.#o), this.#s && N.skip_effect(this.#s), N.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Wn(this.#a), null), this.#o &&= (Wn(this.#o), null), this.#s &&= (Wn(this.#s), null), k && (Fe(this.#t), Le(), Fe(Re()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Bn(() => {
						var r = H;
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
function Ct(e, t, n, r) {
	let i = Ye() ? Dt : M;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = wt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				tt(e, s);
			}
			Tt();
		}
	}
	var d = Et();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ kt(e))).then(u).catch((e) => tt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), Tt();
	}) : f();
}
function wt() {
	var e = H, t = V, n = Ge, r = N;
	return function(i = !0) {
		ir(e), rr(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Tt(e = !0) {
	ir(null), rr(null), Ke(null), e && N?.deactivate();
}
function Et() {
	var e = H, t = e.b, n = N, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Dt(e) {
	var t = 2 | S;
	return H !== null && (H.f |= re), {
		ctx: Ge,
		deps: null,
		effects: null,
		equals: Be,
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
var Ot = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function kt(e, t, r) {
	let i = H;
	i === null && ye();
	var a = void 0, o = nn(n), s = !V, c = /* @__PURE__ */ new Set();
	return Ln(() => {
		var t = H, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(Tt);
		} catch (e) {
			n.reject(e), Tt();
		}
		var r = N;
		if (s) {
			if (t.f & 32768) var l = Et();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Ot);
			else for (let e of c.values()) e.reject(Ot);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ot && (r.activate(), t ? (o.f |= oe, on(o, t)) : (o.f & 8388608 && (o.f ^= oe), on(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), An(() => {
		for (let e of c) e.reject(Ot);
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
function M(e) {
	let t = /* @__PURE__ */ Dt(e);
	return t.equals = He, t;
}
function At(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Wn(t[n]);
	}
}
function jt(e) {
	var t, r = H, i = e.parent;
	if (!er && i !== null && e.v !== n && i.f & 24576) return Ae(), e.v;
	ir(i);
	try {
		e.f &= ~D, At(e), t = vr(e);
	} finally {
		ir(r);
	}
	return t;
}
function Mt(e) {
	var t = jt(e);
	if (!e.equals(t) && (e.wv = hr(), (!N?.is_fork || e.deps === null) && (N === null ? e.v = t : (N.capture(e, t, !0), It?.capture(e, t, !0)), e.deps === null))) {
		rt(e, x);
		return;
	}
	er || (Lt === null ? it(e) : (kn() || N?.is_fork) && Lt.set(e, t));
}
function Nt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && _t(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = _), br(t, 0), Hn(t));
}
function Pt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && xr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ft = null, N = null, It = null, Lt = null, Rt = null, zt = !1, Bt = !1, Vt = null, Ht = null, Ut = 0, Wt = 1, Gt = class e {
	id = Wt++;
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
		Ft === null ? Ft = this : (Ft.#n = this, this.#t = Ft), Ft = this;
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
			for (var r of n.d) rt(r, S), t(r);
			for (r of n.m) rt(r, C), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ut++ > 1e3 && (this.#x(), qt());
		for (let e of this.#u) this.#d.delete(e), rt(e, S), this.schedule(e);
		for (let e of this.#d) rt(e, C), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Vt = [], r = [], i = Ht = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Qt(e), this.#h() || this.discard(), t;
		}
		if (N = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Vt = null, Ht = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Zt(e, t);
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
		this.#r.clear(), It = this, Yt(r), Yt(n), It = null, this.#s?.resolve();
		var s = N;
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
				a ? r.f ^= x : i & 4 ? t.push(r) : gr(r) && (i & 16 && this.#d.add(r), xr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), rt(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), N = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Lt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		N = this;
	}
	deactivate() {
		N = null, Lt = null;
	}
	flush() {
		try {
			Bt = !0, N = this, this.#g();
		} finally {
			Ut = 0, Rt = null, Vt = null, Ht = null, Bt = !1, N = null, Lt = null, en.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ot);
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
		return (this.#s ??= b()).promise;
	}
	static ensure() {
		if (N === null) {
			let t = N = new e();
			!Bt && !zt && Qe(() => {
				t.#e || t.flush();
			});
		}
		return N;
	}
	apply() {
		Lt = null;
	}
	schedule(e) {
		if (Rt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Vt !== null && t === H && (V === null || !(V.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Ft = e : t.#t = e, this.linked = !1;
		}
	}
};
function Kt(e) {
	var t = zt;
	zt = !0;
	try {
		var n;
		for (e && (N !== null && !N.is_fork && N.flush(), n = e());;) {
			if ($e(), N === null) return n;
			N.flush();
		}
	} finally {
		zt = t;
	}
}
function qt() {
	try {
		we();
	} catch (e) {
		tt(e, Rt);
	}
}
var Jt = null;
function Yt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && gr(r) && (Jt = /* @__PURE__ */ new Set(), xr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Kn(r), Jt?.size > 0)) {
				en.clear();
				for (let e of Jt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Jt.has(n) && (Jt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || xr(n);
					}
				}
				Jt.clear();
			}
		}
		Jt = null;
	}
}
function Xt(e) {
	N.schedule(e);
}
function Zt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), rt(e, x);
		for (var n = e.first; n !== null;) Zt(n, t), n = n.next;
	}
}
function Qt(e) {
	rt(e, x);
	for (var t = e.first; t !== null;) Qt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var $t = /* @__PURE__ */ new Set(), en = /* @__PURE__ */ new Map(), tn = !1;
function nn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Be,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function rn(e, t) {
	let n = nn(e, t);
	return or(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t = !1, n = !0) {
	let r = nn(e);
	return t || (r.equals = He), Ue && n && Ge !== null && Ge.l !== null && (Ge.l.s ??= []).push(r), r;
}
function an(e, t) {
	return F(e, W(() => U(e))), t;
}
function F(e, t, n = !1) {
	return V !== null && (!nr || V.f & 131072) && Ye() && V.f & 4325394 && (ar === null || !ar.has(e)) && Oe(), on(e, n ? un(t) : t, Ht);
}
function on(e, t, n = null) {
	if (!e.equals(t)) {
		en.set(e, er ? t : e.v);
		var r = Gt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && jt(t), Lt === null && it(t);
		}
		e.wv = hr(), ln(e, S, n), Ye() && H !== null && H.f & 1024 && !(H.f & 96) && (lr === null ? ur([e]) : lr.push(e)), !r.is_fork && $t.size > 0 && !tn && sn();
	}
	return t;
}
function sn() {
	tn = !1;
	for (let e of $t) {
		e.f & 1024 && rt(e, C);
		let t;
		try {
			t = gr(e);
		} catch {
			t = !0;
		}
		t && xr(e);
	}
	$t.clear();
}
function cn(e) {
	F(e, e.v + 1);
}
function ln(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & S) === 0;
			if (l && rt(s, t), c & 131072) $t.add(s);
			else if (c & 2) {
				var u = s;
				Lt?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= D), ln(u, C, n));
			} else if (l) {
				var d = s;
				c & 16 && Jt !== null && Jt.add(d), n === null ? Xt(d) : n.push(d);
			}
		}
	}
}
function un(e) {
	if (typeof e != "object" || !e || se in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ rn(0), s = null, c = pr, l = (e) => {
		if (pr === c) return e();
		var t = V, n = pr;
		rr(null), mr(c);
		var r = e();
		return rr(t), mr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ rn(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ee();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ rn(n.value, s);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ rn(n, s));
					r.set(t, e), cn(o);
				}
			} else F(i, n), cn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === se) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ rn(un(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			if (t === se) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || H !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ rn(a ? un(e[t]) : n, s)), r.set(t, i)), U(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ rn(n, s)), r.set(p + "", m)) : F(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ rn(void 0, s)), F(d, un(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => un(a));
				F(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && F(_, v + 1);
				}
				cn(o);
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
			De();
		}
	});
}
function dn(e) {
	try {
		if (typeof e == "object" && e && se in e) return e[se];
	} catch {}
	return e;
}
function fn(e, t) {
	return Object.is(dn(e), dn(t));
}
var pn, mn, hn, gn, _n;
function vn() {
	if (pn === void 0) {
		pn = window, mn = document, hn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		gn = u(t, "firstChild").get, _n = u(t, "nextSibling").get, h(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), h(n) && (n[pe] = void 0);
	}
}
function yn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function bn(e) {
	return gn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function xn(e) {
	return _n.call(e);
}
function I(e, t) {
	if (!k) return /* @__PURE__ */ bn(e);
	var n = /* @__PURE__ */ bn(A);
	if (n === null) n = A.appendChild(yn());
	else if (t && n.nodeType !== 3) {
		var r = yn();
		return n?.before(r), Fe(r), r;
	}
	return t && Tn(n), Fe(n), n;
}
function L(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ bn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ xn(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = yn();
			return A?.before(r), Fe(r), r;
		}
		Tn(A);
	}
	return A;
}
function R(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ xn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = yn();
			return r === null ? i?.after(a) : r.before(a), Fe(a), a;
		}
		Tn(r);
	}
	return Fe(r), r;
}
function Sn(e) {
	e.textContent = "";
}
function Cn() {
	return !1;
}
function wn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Tn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function En(e) {
	H === null && (V === null && Ce(e), Se()), er && xe(e);
}
function Dn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function On(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= w);
	var r = {
		ctx: Ge,
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
	N?.register_created_effect(r);
	var i = r;
	if (e & 4) Vt === null ? Gt.ensure().schedule(r) : Vt.push(r);
	else if (t !== null) {
		try {
			xr(r);
		} catch (e) {
			throw Wn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ne));
	}
	if (i !== null && (i.parent = n, n !== null && Dn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function kn() {
	return V !== null && !nr;
}
function An(e) {
	let t = On(8, null);
	return rt(t, x), t.teardown = e, t;
}
function jn(e) {
	En("$effect");
	var t = H.f;
	if (!V && t & 32 && Ge !== null && !Ge.i) {
		var n = Ge;
		(n.e ??= []).push(e);
	} else return Mn(e);
}
function Mn(e) {
	return On(4 | E, e);
}
function Nn(e) {
	return En("$effect.pre"), On(8 | E, e);
}
function Pn(e) {
	Gt.ensure();
	let t = On(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? qn(t, () => {
			Wn(t), n(void 0);
		}) : (Wn(t), n(void 0));
	});
}
function Fn(e) {
	return On(4, e);
}
function z(e, t) {
	var n = Ge, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Rn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = H;
			try {
				ir(n.parent), W(t);
			} finally {
				ir(n);
			}
		}
	});
}
function In() {
	var e = Ge;
	Rn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && rt(n, C), gr(n) && xr(n), t.ran = !1;
		}
	});
}
function Ln(e) {
	return On(ae | re, e);
}
function Rn(e, t = 0) {
	return On(8 | t, e);
}
function B(e, t = [], n = [], r = []) {
	Ct(r, t, n, (t) => {
		On(8, () => {
			e(...t.map(U));
		});
	});
}
function zn(e, t = 0) {
	return On(16 | t, e);
}
function Bn(e) {
	return On(32 | re, e);
}
function Vn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = er, n = V;
		tr(!0), rr(null);
		try {
			t.call(null);
		} finally {
			tr(e), rr(n);
		}
	}
}
function Hn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && _t(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Wn(n, t), n = r;
	}
}
function Un(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Wn(t), t = n;
	}
}
function Wn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Gn(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Hn(e, t && !n), br(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Vn(e), e.f ^= te, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && Kn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Gn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ xn(e);
		e.remove(), e = n;
	}
}
function Kn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function qn(e, t, n = !0) {
	var r = [];
	Jn(e, r, !0);
	var i = () => {
		n && Wn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Jn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= w;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Jn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Yn(e) {
	Xn(e, !0);
}
function Xn(e, t) {
	if (e.f & 8192) {
		e.f ^= w, e.f & 1024 || (rt(e, S), Gt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Xn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Zn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ xn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Qn = null, $n = !1, er = !1;
function tr(e) {
	er = e;
}
var V = null, nr = !1;
function rr(e) {
	V = e;
}
var H = null;
function ir(e) {
	H = e;
}
var ar = null;
function or(e) {
	V !== null && (ar ??= /* @__PURE__ */ new Set()).add(e);
}
var sr = null, cr = 0, lr = null;
function ur(e) {
	lr = e;
}
var dr = 1, fr = 0, pr = fr;
function mr(e) {
	pr = e;
}
function hr() {
	return ++dr;
}
function gr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~D), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (gr(a) && Mt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Lt === null && rt(e, x);
	}
	return !1;
}
function _r(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(ar !== null && ar.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? _r(a, t, !1) : t === a && (n ? rt(a, S) : a.f & 1024 && rt(a, C), Xt(a));
	}
}
function vr(e) {
	var t = sr, n = cr, r = lr, i = V, a = ar, o = Ge, s = nr, c = pr, l = e.f;
	sr = null, cr = 0, lr = null, V = l & 96 ? null : e, ar = null, Ke(e.ctx), nr = !1, pr = ++fr, e.ac !== null && (_t(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= O;
		var u = e.fn, d = u();
		e.f |= T;
		var f = e.deps, p = N?.is_fork;
		if (sr !== null) {
			var m;
			if (p || br(e, cr), f !== null && cr > 0) for (f.length = cr + sr.length, m = 0; m < sr.length; m++) f[cr + m] = sr[m];
			else e.deps = f = sr;
			if (kn() && e.f & 512) for (m = cr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && cr < f.length && (br(e, cr), f.length = cr);
		if (Ye() && lr !== null && !nr && f !== null && !(e.f & 6146)) for (m = 0; m < lr.length; m++) _r(lr[m], e);
		if (i !== null && i !== e) {
			if (fr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = fr;
			if (t !== null) for (let e of t) e.rv = fr;
			lr !== null && (r === null ? r = lr : r.push(...lr));
		}
		return e.f & 8388608 && (e.f ^= oe), d;
	} catch (e) {
		return et(e);
	} finally {
		e.f ^= O, sr = t, cr = n, lr = r, V = i, ar = a, Ke(o), nr = s, pr = c;
	}
}
function yr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (sr === null || !s.call(sr, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~D), c.v !== n && it(c), c.ac !== null && _t(() => {
			c.ac.abort(he), c.ac = null, rt(c, S);
		}), Nt(c), br(c, 0);
	}
}
function br(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) yr(e, n[r]);
}
function xr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		rt(e, x);
		var n = H, r = $n;
		H = e, $n = !(t & 96);
		try {
			t & 16777232 ? Un(e) : Hn(e), Vn(e);
			var i = vr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = dr;
		} finally {
			$n = r, H = n;
		}
	}
}
async function Sr() {
	await Promise.resolve(), Kt();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Qn?.add(e), V !== null && !nr && !(H !== null && H.f & 16384) && (ar === null || !ar.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < fr && (e.rv = fr, sr === null && n !== null && n[cr] === e ? cr++ : sr === null ? sr = [e] : sr.push(e));
		else {
			V.deps ??= [], s.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : s.call(r, V) || r.push(V);
		}
	}
	if (er && en.has(e)) return en.get(e);
	if (t) {
		var i = e;
		if (er) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || wr(i)) && (a = jt(i)), en.set(i, a), a;
		}
		var o = !(i.f & 512) && !nr && V !== null && ($n || !!(V.f & 512)), c = (i.f & T) === 0;
		gr(i) && (o && (i.f |= 512), Mt(i)), o && !c && (Pt(i), Cr(i));
	}
	if (Lt?.has(e)) return Lt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Pt(t), Cr(t));
}
function wr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (en.has(t) || t.f & 2 && wr(t)) return !0;
	return !1;
}
function W(e) {
	var t = nr;
	try {
		return nr = !0, e();
	} finally {
		nr = t;
	}
}
function G(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (se in e) Tr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && se in n && Tr(n);
		}
	}
}
function Tr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Tr(e[n], t);
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
var Er = Symbol("events"), Dr = /* @__PURE__ */ new Set(), Or = /* @__PURE__ */ new Set();
function kr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Nr.call(t, e), !e.cancelBubble) return _t(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Ar(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = kr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && An(() => {
		t.removeEventListener(e, o, a);
	});
}
function K(e, t, n) {
	(t[Er] ??= {})[e] = n;
}
function jr(e) {
	for (var t = 0; t < e.length; t++) Dr.add(e[t]);
	for (var n of Or) n(e);
}
var Mr = null;
function Nr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Mr = e;
	var o = 0, s = Mr === e && e[Er];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Er] = t;
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
		var d = V, f = H;
		rr(null), ir(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Er]?.[r];
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
			e[Er] = t, delete e.currentTarget, rr(d), ir(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Pr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Fr(e) {
	return Pr?.createHTML(e) ?? e;
}
function Ir(e) {
	var t = wn("template");
	return t.innerHTML = Fr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Lr(e, t) {
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
		if (k) return Lr(A, null), A;
		i === void 0 && (i = Ir(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ bn(i)));
		var t = r || hn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ bn(t), s = t.lastChild;
			Lr(o, s);
		} else Lr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Rr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (k) return Lr(A, null), A;
		if (!o) {
			var e = /* @__PURE__ */ bn(Ir(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ bn(e);) o.appendChild(/* @__PURE__ */ bn(e));
			else o = /* @__PURE__ */ bn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ bn(t), r = t.lastChild;
			Lr(n, r);
		} else Lr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function zr(e, t) {
	return /* @__PURE__ */ Rr(e, t, "svg");
}
function Br(e = "") {
	if (!k) {
		var t = yn(e + "");
		return Lr(t, t), t;
	}
	var n = A;
	return n.nodeType === 3 ? Tn(n) : (n.before(n = yn()), Fe(n)), Lr(n, n), n;
}
function Vr() {
	if (k) return Lr(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = yn();
	return e.append(t, n), Lr(t, n), e;
}
function J(e, t) {
	if (k) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = A), Ie();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Hr = ["touchstart", "touchmove"];
function Ur(e) {
	return Hr.includes(e);
}
var Wr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Gr(e) {
	return Wr.includes(e);
}
function Y(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Kr(e, t) {
	return Jr(e, t);
}
var qr = /* @__PURE__ */ new Map();
function Jr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	vn();
	var u = void 0, d = Pn(() => {
		var s = r ?? n.appendChild(yn());
		xt(s, { pending: () => {} }, (n) => {
			qe({});
			var r = Ge;
			if (o && (r.c = o), a && (i.$$events = a), k && Lr(n, null), u = e(n, i) || {}, k && (H.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw je(), t;
			Je();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Ur(r);
					for (let e of [n, document]) {
						var a = qr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), qr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Nr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(Dr)), Or.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = qr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Nr), t.delete(e), t.size === 0 && qr.delete(r)) : t.set(e, i);
			}
			Or.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Yr.set(u, d), u;
}
var Yr = /* @__PURE__ */ new WeakMap();
function Xr(e, t) {
	let n = Yr.get(e);
	return n ? (Yr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Zr = class {
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
			if (n) Yn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Yn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Wn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Zn(r, t), t.append(yn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Wn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), qn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Wn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = N, r = Cn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = yn();
			i.append(a), this.#n.set(e, {
				effect: Bn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Bn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = A), this.#a(n);
	}
};
function Qr(e) {
	Ge === null && ve("onMount"), Ue && Ge.l !== null ? ei(Ge).m.push(e) : jn(() => {
		let t = W(e);
		if (typeof t == "function") return t;
	});
}
function $r(e) {
	Ge === null && ve("onDestroy"), Qr(() => () => W(e));
}
function ei(e) {
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
	k && (r = A, Ie());
	var i = new Zr(e), a = n ? ne : 0;
	function o(e, t) {
		if (k) {
			var n = ze(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Re();
				Fe(a), i.anchor = a, Pe(!1), i.ensure(e, t), Pe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	zn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var ti = Symbol("NaN");
function ni(e, t, n) {
	k && Ie();
	var r = new Zr(e), i = !Ye();
	zn(() => {
		var e = t();
		e !== e && (e = ti), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function ri(e, t) {
	return t;
}
function ii(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		qn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					ai(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			Sn(d), d.append(u), e.items.clear();
		}
		ai(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function ai(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, Zn(a, document.createDocumentFragment())) : Wn(t[i], n);
	}
}
var oi;
function si(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = k ? Fe(/* @__PURE__ */ bn(u)) : u.appendChild(yn());
	}
	k && Ie();
	var d = null, f = /* @__PURE__ */ M(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, li(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, di(d, null, s)) : Yn(d) : qn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: zn(() => {
			p = U(f);
			var e = p.length;
			let a = !1;
			k && ze(s) === "[!" != (e === 0) && (s = Re(), Fe(s), Pe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = N, v = Cn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (s = A, a = !0, Pe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && on(S.v, b), S.i && on(S.i, y), v && u.unskip_effect(S.e)) : (S = ui(l, h ? s : oi ??= yn(), b, x, y, i, t, n), h || (S.e.f |= ie), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Bn(() => o(s)) : (d = Bn(() => o(oi ??= yn())), d.f |= ie)), e > c.size && be("", "", ""), k && e > 0 && Fe(Re()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Pe(!0), U(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, k && (s = A);
}
function ci(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function li(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ci(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Yn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ie, _ === l) di(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), fi(e, d, _), fi(e, _, y), di(_, y, n), d = _, p = [], m = [], l = ci(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) di(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					fi(e, S.prev, C.next), fi(e, d, S), fi(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), di(_, l, n), fi(e, _.prev, _.next), fi(e, _, d === null ? e.effect.first : d.next), fi(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = ci(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = ci(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (ai(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ci(l.next);
		var ee = w.length;
		if (ee > 0) {
			var T = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			ii(e, w, T);
		}
	}
	a && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ui(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? nn(n) : /* @__PURE__ */ P(n, !1, !1) : null, l = o & 2 ? nn(i) : null;
	return {
		v: c,
		i: l,
		e: Bn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function di(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ xn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function fi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
function pi(e, t, n, r, i) {
	k && Ie();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function mi(e, t, n, r, a, o) {
	let s = k;
	k && Ie();
	var c = null;
	k && A.nodeType === 1 && (c = A, Ie());
	var l = k ? A : e, u = new Zr(l, !1);
	zn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = k ? c : wn(e, o), Lr(c, c), r) {
					var n = null;
					k && Gr(e) && c.append(n = document.createComment(""));
					var i = k ? /* @__PURE__ */ bn(c) : c.appendChild(yn());
					k && (i === null ? Pe(!1) : Fe(i)), r(c, i), n?.remove();
				}
				H.nodes.end = c, t.before(c);
			}
			k && Fe(t);
		}), () => {};
	}, ne), An(() => {}), s && (Pe(!0), Fe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function hi(e, t, n) {
	Fn(() => {
		var r = W(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Rn(() => {
				var e = n();
				G(e), i && Ve(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function gi(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") if (Array.isArray(e)) {
		var i = e.length;
		for (t = 0; t < i; t++) e[t] && (n = gi(e[t])) && (r && (r += " "), r += n);
	} else for (n in e) e[n] && (r && (r += " "), r += n);
	return r;
}
function _i() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = gi(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function vi(e) {
	return typeof e == "object" ? _i(e) : e ?? "";
}
var yi = [..." 	\n\r\f\xA0\v﻿"];
function bi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || yi.includes(r[o - 1])) && (s === r.length || yi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function xi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Si(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Ci(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Si)), i && c.push(...Object.keys(i).map(Si));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Si(e.substring(l, u).trim());
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
		return r && (n += xi(r)), i && (n += xi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Z(e, t, n, r, i, a) {
	var o = e[de];
	if (k || o !== n || o === void 0) {
		var s = bi(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function wi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Ti(e, t, n, r) {
	var i = e[fe];
	if (k || i !== t) {
		var a = Ci(t, r);
		(!k || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[fe] = t;
	} else r && (Array.isArray(r) ? (wi(e, n?.[0], r[0]), wi(e, n?.[1], r[1], "important")) : wi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Ei(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Me();
		for (var r of e.options) r.selected = t.includes(ki(r));
		return;
	}
	for (r of e.options) if (fn(ki(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function Di(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Ei(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), An(() => {
		t.disconnect();
	});
}
function Oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	vt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ki);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ki(o);
		}
		n(a), e.__value = a, N !== null && r.add(N);
	}), Fn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = N;
			if (r.has(o)) return;
		}
		if (Ei(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ki(s), n(a));
		}
		e.__value = a, i = !1;
	}), Di(e);
}
function ki(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Ai = Symbol("is custom element"), ji = Symbol("is html"), Mi = ge ? "link" : "LINK", Ni = ge ? "progress" : "PROGRESS";
function Pi(e) {
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
		e[me] = n, Qe(n), gt();
	}
}
function Fi(e, t) {
	var n = Li(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Ni) && (e.value = t ?? "");
}
function Ii(e, t) {
	var n = Li(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Q(e, t, n, r) {
	var i = Li(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && zi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Li(e) {
	return e[ue] ??= {
		[Ai]: e.nodeName.includes("-"),
		[ji]: e.namespaceURI === r
	};
}
var Ri = /* @__PURE__ */ new Map();
function zi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ri.get(t);
	if (n) return n;
	Ri.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = d(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = m(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Bi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	vt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Hi(e) ? Ui(a) : a, n(a), N !== null && r.add(N), await Sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (k && e.defaultValue !== e.value || W(t) == null && e.value) && (n(Hi(e) ? Ui(e.value) : e.value), N !== null && r.add(N)), Rn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = N;
			if (r.has(i)) return;
		}
		Hi(e) && n === Ui(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Vi(e, t, n = t) {
	vt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (k && e.defaultChecked !== e.checked || W(t) == null) && n(e.checked), Rn(() => {
		e.checked = !!t();
	});
}
function Hi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ui(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/props.js
function Wi(e, t, n) {
	var r = u(e, t);
	r && r.set && (e[t] = n, An(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Gi(e, t) {
	return e === t || e?.[se] === t;
}
function Ki(e = {}, t, n, r) {
	var i = Ge.r, a = H;
	return Fn(() => {
		var o, s;
		return Rn(() => {
			o = s, s = r?.() || [], W(() => {
				Gi(n(...s), e) || (t(e, ...s), o && Gi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Gi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function qi(e = !1) {
	let t = Ge, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Dt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Nn(() => {
		Ji(t, r), y(n.b);
	}), jn(() => {
		let e = W(() => n.m.map(v));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && jn(() => {
		Ji(t, r), y(n.a);
	});
}
function Ji(e, t) {
	if (e.l.s) for (let t of e.l.s) U(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
var Yi = {
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
		if (t === se || t === ce) return !1;
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
function Xi(...e) {
	return new Proxy({ props: e }, Yi);
}
function $(e, t, n, r) {
	var i = !Ue || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ Dt(r), U(l)) : (c && (c = !1, s = o ? W(r) : r), s);
	let f;
	if (a) {
		var p = se in e || ce in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = pt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Te(t), f(m)));
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
	var v = !1, y = (n & 1 ? Dt : M)(() => (v = !1, g()));
	a && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? un(e) : e;
			return F(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return er && v || b.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), We();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Zi = /* @__PURE__ */ q("<button type=\"button\">＋</button>"), Qi = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), $i = /* @__PURE__ */ q("<option> </option>"), ea = /* @__PURE__ */ q("<span class=\"task-add-contract\"> </span>"), ta = /* @__PURE__ */ q("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), na = /* @__PURE__ */ q("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), ra = /* @__PURE__ */ q("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function ia(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ P(""), ee = /* @__PURE__ */ P(""), T = /* @__PURE__ */ P(u()?.creationDefaultValue ?? 4), te = /* @__PURE__ */ P();
	async function ne() {
		await Sr(), U(te)?.focus?.();
	}
	function re(e) {
		e.preventDefault(), C()({
			title: U(w),
			summary: U(ee),
			priority: u().normalize(U(T), u().creationDefaultValue)
		});
	}
	function E(e) {
		e.key === "Escape" && (e.preventDefault(), S()());
	}
	z(() => G(c()), () => {
		F(n, c() === "task");
	}), z(() => (G(d()), U(n)), () => {
		F(r, d() || (U(n) ? "增加工作項目" : "增加待處理子任務"));
	}), z(() => (G(f()), U(n)), () => {
		F(i, f() || (U(n) ? "任務名稱" : "子任務描述"));
	}), z(() => (G(p()), U(n)), () => {
		F(a, p() || (U(n) ? "新任務名稱" : "新子任務描述"));
	}), z(() => (G(g()), U(n)), () => {
		F(o, g() || (U(n) ? "新任務優先級" : "新子任務優先級"));
	}), z(() => (G(v()), U(n)), () => {
		F(s, v() || (U(n) ? "加入任務" : "新增"));
	}), z(() => G(l()), () => {
		l() && ne();
	}), In(), qi();
	var ie = Vr(), D = L(ie), O = (e) => {
		var t = Zi();
		B(() => {
			Z(t, 1, vi(U(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", U(r));
		}), K("click", t, function(...e) {
			x()?.apply(this, e);
		}), J(e, t);
	}, ae = (e) => {
		var t = ra(), r = I(t);
		Pi(r), Ki(r, (e) => F(te, e), () => U(te));
		var c = R(r, 2), l = (e) => {
			var t = Qi();
			mt(t), B(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Bi(t, () => U(ee), (e) => F(ee, e)), J(e, t);
		};
		X(c, (e) => {
			U(n) && e(l);
		});
		var d = R(c, 2);
		si(d, 5, () => (G(u()), W(() => u().levels)), (e) => e.value, (e, t) => {
			var n = $i(), r = I(n, !0);
			j(n);
			var i = {};
			B((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(u()), U(t), W(() => u().format(U(t).value)))]), J(e, n);
		}), j(d);
		var f = R(d, 2), p = (e) => {
			var t = ea(), n = I(t, !0);
			j(t), B(() => Y(n, _())), J(e, t);
		};
		X(f, (e) => {
			U(n) && _() && e(p);
		});
		var g = R(f, 2), v = (e) => {
			var t = ta(), n = L(t), r = I(n, !0);
			j(n);
			var i = R(n, 2), a = I(i), o = I(a, !0);
			j(a);
			var c = R(a, 2), l = I(c, !0);
			j(c), j(i), B(() => {
				Q(n, "hidden", !b()), Y(r, b()), Y(o, y()), Y(l, U(s));
			}), K("click", a, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		}, x = (e) => {
			var t = na(), n = L(t), r = I(n, !0);
			j(n);
			var i = R(n, 2), a = I(i, !0);
			j(i);
			var o = R(i, 2), c = I(o, !0);
			j(o), B(() => {
				Y(r, y()), Y(a, U(s)), Q(o, "hidden", !b()), Y(c, b());
			}), K("click", n, function(...e) {
				S()?.apply(this, e);
			}), J(e, t);
		};
		X(g, (e) => {
			U(n) ? e(v) : e(x, -1);
		}), j(t), B(() => {
			Z(t, 1, vi(U(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", U(n) ? 160 : 300), Q(r, "placeholder", U(i)), Q(r, "aria-label", U(a)), Q(d, "aria-label", U(o));
		}), Ar("submit", t, re), K("keydown", t, E), Bi(r, () => U(w), (e) => F(w, e)), Oi(d, () => U(T), (e) => F(T, e)), J(e, t);
	};
	X(D, (e) => {
		l() ? e(ae, -1) : e(O);
	}), J(e, ie), Je();
}
jr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var aa = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), oa = /* @__PURE__ */ q("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), sa = /* @__PURE__ */ q("<div class=\"assessment-metric-grid\"></div>");
function ca(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = sa();
	si(r, 5, n, (e) => e.label, (e, t) => {
		var n = oa(), r = I(n), i = I(r, !0);
		j(r);
		var a = R(r, 2), o = I(a), s = (e) => {
			var n = aa();
			B(() => Z(n, 1, `assessment-tone-dot assessment-tone-${U(t), W(() => U(t).tone) ?? ""}`)), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).tone) && e(s);
		});
		var c = R(o);
		j(a), j(n), B(() => {
			Y(i, (U(t), W(() => U(t).label))), Y(c, ` ${U(t), W(() => U(t).value) ?? ""}`);
		}), J(e, n);
	}), j(r), J(e, r);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentNote.svelte
var la = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), ua = /* @__PURE__ */ q("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function da(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = ua(), a = I(i), o = I(a), s = (e) => {
		var t = la();
		B(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), J(e, t);
	};
	X(o, (e) => {
		r() && e(s);
	});
	var c = R(o);
	j(a), pi(R(a, 2), t, "default", {}, null), j(i), B(() => Y(c, ` ${n() ?? ""}`)), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var fa = /* @__PURE__ */ q("<span class=\"assessment-readout-summary\"> </span>"), pa = /* @__PURE__ */ q("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function ma(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = pa(), o = I(a), s = I(o, !0);
	j(o);
	var c = R(o, 2);
	pi(I(c), t, "badges", {}, null), j(c);
	var l = R(c, 2), u = (e) => {
		var t = fa(), n = I(t, !0);
		j(t), B(() => {
			Q(t, "title", i()), Y(n, i());
		}), J(e, t);
	};
	X(l, (e) => {
		i() && e(u);
	});
	var d = R(l, 2), f = I(d, !0);
	j(d), j(a), B(() => {
		Y(s, n()), Y(f, r());
	}), J(e, a);
}
//#endregion
//#region experiments/editor-svelte-spike/src/DialogShell.svelte
var ha = /* @__PURE__ */ q("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ga(e, t) {
	qe(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "id", 8, null), i = $(t, "dialogClass", 8, ""), a = $(t, "kicker", 8, ""), o = $(t, "title", 8, ""), s = $(t, "titleId", 8), c = $(t, "closeLabel", 8, "關閉"), l = $(t, "onClose", 8, () => {}), u = /* @__PURE__ */ P(), d = null, f = !1;
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
	qi();
	var _ = Vr(), v = L(_), y = (e) => {
		var n = ha(), l = I(n), d = I(l), f = I(d), _ = I(f, !0);
		j(f);
		var v = R(f, 2), y = I(v, !0);
		j(v), j(d);
		var b = R(d, 2);
		j(l), pi(R(l, 2), t, "default", { close: h }, null), j(n), Ki(n, (e) => F(u, e), () => U(u)), hi(n, (e) => p?.(e)), B(() => {
			Z(n, 1, vi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), Y(_, a()), Q(v, "id", s()), Y(y, o()), Q(b, "aria-label", c());
		}), Ar("close", n, m), K("click", n, g), K("click", b, h), J(e, n);
	};
	X(v, (e) => {
		n() && e(y);
	}), J(e, _), Je();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var _a = /* @__PURE__ */ q("<span> </span>"), va = /* @__PURE__ */ q("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ya = /* @__PURE__ */ q("<!> <!> <!>", 1), ba = /* @__PURE__ */ q("<span slot=\"badges\"> </span>"), xa = /* @__PURE__ */ q("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), Sa = /* @__PURE__ */ q("<div class=\"cost-dialog-content\"><!></div>");
function Ca(e, t) {
	qe(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	qi();
	{
		let t = /* @__PURE__ */ M(() => `關閉${i()}`);
		ga(e, {
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
				var n = Sa(), i = I(n), a = (e) => {
					var t = ya(), n = L(t);
					ma(n, {
						label: "估算成本",
						get value() {
							return G(s()), W(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Vr();
							si(L(n), 1, () => (G(s()), W(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = _a(), r = I(n, !0);
								j(n), B(() => {
									Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
								}), J(e, n);
							}), J(e, n);
						} }
					});
					var r = R(n, 2);
					{
						let e = /* @__PURE__ */ M(() => (G(s()), W(() => [
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
						ca(r, { get metrics() {
							return U(e);
						} });
					}
					var i = R(r, 2), a = (e) => {
						da(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								J(e, va());
							},
							$$slots: { default: !0 }
						});
					};
					X(i, (e) => {
						G(s()), W(() => !s().humanConfirmed) && e(a);
					}), J(e, t);
				}, c = (e) => {
					var t = ya(), n = L(t);
					ma(n, {
						label: "估算總額",
						get value() {
							return G(o()), W(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ba(), r = I(n, !0);
							j(n), B(() => {
								Z(n, 1, `cost-coverage cost-coverage-${G(o()), W(() => o().coverage) ?? ""}`), Y(r, (G(o()), W(() => o().coverageLabel)));
							}), J(e, n);
						} }
					});
					var r = R(n, 2);
					{
						let e = /* @__PURE__ */ M(() => (G(o()), W(() => [{
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
						ca(r, { get metrics() {
							return U(e);
						} });
					}
					var i = R(r, 2), a = (e) => {
						da(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								J(e, xa());
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
				}), j(n), J(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var wa = /* @__PURE__ */ q("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), Ta = /* @__PURE__ */ q("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), Ea = /* @__PURE__ */ q("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Da = /* @__PURE__ */ q("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Oa(e, t) {
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
	qi();
	var c = Da(), l = I(c), u = I(l), d = R(I(u), 2), f = I(d, !0);
	j(d), j(u), Le(2), j(l);
	var p = R(l, 2), m = (e) => {
		var t = wa(), r = I(t), i = R(I(r), 2), o = I(i, !0);
		j(i), j(r);
		var s = R(r, 2), c = R(I(s), 2), l = I(c, !0);
		j(c), j(s), j(t), B((e, t) => {
			Y(o, e), Y(l, t);
		}, [() => (G(n()), W(() => a(n().before))), () => (G(n()), W(() => a(n().after)))]), J(e, t);
	}, h = (e) => {
		J(e, Ta());
	};
	X(p, (e) => {
		G(n()), W(() => n().deliveryChanged) ? e(m) : (G(n()), W(() => n().capacityChanged) && e(h, 1));
	});
	var g = R(p, 2), _ = I(g), v = R(I(_), 2), y = I(v, !0);
	j(v);
	var b = R(v, 2), x = I(b);
	j(b), j(_);
	var S = R(_, 4), C = R(I(S), 2), w = I(C, !0);
	j(C);
	var ee = R(C, 2), T = I(ee);
	j(ee), j(S), j(g);
	var te = R(g, 2), ne = I(te), re = R(I(ne)), E = I(re, !0);
	j(re), j(ne);
	var ie = R(ne, 2), D = R(I(ie)), O = I(D, !0);
	j(D), j(ie), j(te);
	var ae = R(te, 2), oe = (e) => {
		var t = Ea(), r = R(I(t), 1, !0);
		j(t), B(() => Y(r, (G(n()), W(() => n().reason)))), J(e, t);
	};
	X(ae, (e) => {
		G(n()), W(() => n().reason) && e(oe);
	}), j(c), B((e, t, i, a) => {
		Y(f, r()), Y(y, (G(n()), W(() => n().current.label))), Y(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (G(n()), W(() => `risk-${n().next.urgency ?? "none"}`))), Y(w, (G(n()), W(() => n().next.label))), Y(T, `剩餘容量 ${t ?? ""}`), Y(E, i), Y(O, a);
	}, [
		() => (G(n()), W(() => o(n().current.remainingCapacityMinutes))),
		() => (G(n()), W(() => o(n().next.remainingCapacityMinutes))),
		() => (G(n()), W(() => s(n().capacityDelta))),
		() => (G(n()), W(() => s(n().balanceDelta)))
	]), J(e, c), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var ka = /* @__PURE__ */ q("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Aa(e, t) {
	qe(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P();
	Qr(() => {
		U(o).showModal(), U(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	qi();
	var u = ka(), d = R(I(u), 2);
	Oa(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = R(d, 2), p = I(f);
	Ki(p, (e) => F(s, e), () => U(s));
	var m = R(p, 2), h = I(m, !0);
	j(m), j(f), j(u), Ki(u, (e) => F(o, e), () => U(o)), B(() => {
		p.disabled = r(), m.disabled = r(), Y(h, r() ? "正在儲存…" : "確認儲存");
	}), Ar("cancel", u, c), K("keydown", u, l), K("click", p, function(...e) {
		i()?.apply(this, e);
	}), K("click", m, function(...e) {
		a()?.apply(this, e);
	}), J(e, u), Je();
}
jr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var ja = /* @__PURE__ */ q("<div><strong> </strong> <p> </p></div>");
function Ma(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Vr();
	si(L(i), 1, n, ri, (e, t) => {
		let n = /* @__PURE__ */ M(() => (U(t), W(() => U(t).level ?? "error")));
		var i = ja(), a = I(i), o = I(a, !0);
		j(a);
		var s = R(a, 2), c = I(s, !0);
		j(s), j(i), B(() => {
			Z(i, 1, `diagnostic diagnostic-${U(n)}`), Y(o, (G(U(n)), W(() => r[U(n)] ?? r.error))), Y(c, (U(t), W(() => U(t).message)));
		}), J(e, i);
	}), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Na = /* @__PURE__ */ q("<button type=\"button\"> </button>");
function Pa(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	z(() => G(a()), () => {
		F(n, a() === "edit");
	}), z(() => U(n), () => {
		F(r, U(n) ? "編輯模式" : "預覽模式");
	}), z(() => U(n), () => {
		F(i, U(n) ? "預覽模式" : "編輯模式");
	}), In(), qi();
	var d = Na();
	let f;
	var p = I(d, !0);
	j(d), B(() => {
		f = Z(d, 1, "view-mode-toggle editor-mode-dock", null, f, { "is-editing": U(n) }), Q(d, "aria-label", `切換到${U(i)}（目前為${U(r)}）`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), Y(p, U(i));
	}), K("click", d, () => u()(U(n) ? "preview" : "edit")), J(e, d), Je();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Fa = /* @__PURE__ */ q("<span></span>"), Ia = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), La = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>"), Ra = /* @__PURE__ */ q("<div role=\"toolbar\"></div>");
function za(e, t) {
	qe(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ P(null), c = /* @__PURE__ */ P(null), l = !1, u = null, d = /* @__PURE__ */ P(null), f = /* @__PURE__ */ P();
	async function p() {
		let e = U(d);
		F(d, null), await Sr(), [...U(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
	}
	function m() {
		F(s, null), F(c, null);
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
		F(d, r), o()(e, t, n);
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
		F(s, e.id), l = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
	}
	function C(e, t) {
		!U(s) || e.id === U(s) || e.sortable === !1 || (t.preventDefault(), t.dataTransfer.dropEffect = "move", F(c, {
			id: e.id,
			placeAfter: g(t.currentTarget, t.clientX)
		}));
	}
	function w(e, t) {
		t.currentTarget.contains(t.relatedTarget) || U(c)?.id === e.id && F(c, null);
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
			u.active = !0, l = !0, F(s, e.id);
		}
		t.preventDefault();
		let i = document.elementFromPoint(t.clientX, t.clientY)?.closest?.("[data-reorder-capsule='true']") ?? null, a = i?.dataset.capsuleId ?? null;
		if (!a || a === e.id) {
			u.targetId = null, F(c, null);
			return;
		}
		u.targetId = a, u.placeAfter = g(i, t.clientX), F(c, {
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
	z(() => (G(n()), U(d)), () => {
		n() && U(d) && p();
	}), In(), qi();
	var E = Ra();
	si(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ M(() => (U(t), W(() => U(t).sortable !== !1)));
		var r = La(), i = I(r), a = I(i, !0);
		j(i);
		var o = R(i, 2), l = (e) => {
			var n = Fa();
			B(() => Z(n, 1, (U(t), W(() => `time-risk-dot ${U(t).dotClass ?? ""}`)))), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).showDot) && e(l);
		});
		var u = R(o, 2), d = (e) => {
			J(e, Ia());
		};
		X(u, (e) => {
			U(t), W(() => U(t).showChevron) && e(d);
		}), j(r), B((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (U(t), W(() => U(t).id))), Q(r, "data-reorder-capsule", U(n) ? "true" : null), Q(r, "aria-pressed", (U(t), W(() => U(t).pressed ?? null))), Q(r, "aria-label", (U(t), W(() => U(t).ariaLabel ?? U(t).label))), Q(r, "aria-keyshortcuts", U(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (U(t), W(() => U(t).title ?? null))), r.disabled = (U(t), W(() => U(t).disabled ?? !1)), Q(r, "draggable", U(n)), Y(a, (U(t), W(() => U(t).label)));
		}, [() => (U(t), G(U(n)), U(s), U(c), W(() => `capsule-button ${U(t).className ?? ""} ${U(n) ? "capsule-sortable" : ""} ${U(s) === U(t).id ? "capsule-dragging" : ""} ${h(U(t).id, U(c))}`))]), K("click", r, (e) => b(U(t), e)), K("keydown", r, function(...e) {
			(U(n) ? (e) => x(U(t), e) : null)?.apply(this, e);
		}), Ar("dragstart", r, function(...e) {
			(U(n) ? (e) => S(U(t), e) : null)?.apply(this, e);
		}), Ar("dragover", r, function(...e) {
			(U(n) ? (e) => C(U(t), e) : null)?.apply(this, e);
		}), Ar("dragleave", r, function(...e) {
			(U(n) ? (e) => w(U(t), e) : null)?.apply(this, e);
		}), Ar("drop", r, function(...e) {
			(U(n) ? (e) => ee(U(t), e) : null)?.apply(this, e);
		}), Ar("dragend", r, function(...e) {
			(U(n) ? T : null)?.apply(this, e);
		}), K("pointerdown", r, function(...e) {
			(U(n) ? (e) => te(U(t), e) : null)?.apply(this, e);
		}), K("pointermove", r, function(...e) {
			(U(n) ? (e) => ne(U(t), e) : null)?.apply(this, e);
		}), K("pointerup", r, function(...e) {
			(U(n) ? re : null)?.apply(this, e);
		}), Ar("pointercancel", r, function(...e) {
			(U(n) ? re : null)?.apply(this, e);
		}), J(e, r);
	}), j(E), Ki(E, (e) => F(f, e), () => U(f)), B(() => {
		Z(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), J(e, E), Je();
}
jr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function Ba(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	z(() => G(a()), () => {
		F(n, new Map(a().map((e, t) => [e, t])));
	}), z(() => (G(i()), U(n), G(a())), () => {
		F(r, [...i()].sort((e, t) => (U(n).get(e.id) ?? a().length) - (U(n).get(t.id) ?? a().length)));
	}), In(), qi();
	var u = Vr(), d = L(u), f = (e) => {
		za(e, {
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
	}), J(e, u), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Va = /* @__PURE__ */ q("<i></i>"), Ha = /* @__PURE__ */ q("<div role=\"img\"></div>"), Ua = /* @__PURE__ */ q("<progress max=\"100\"></progress>");
function Wa(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = $(t, "form", 8, "continuous"), a = $(t, "cells", 24, () => []), o = $(t, "ratio", 8, 0), s = $(t, "label", 8, ""), c = $(t, "extraClass", 8, ""), l = /* @__PURE__ */ new Set([
		"passed",
		"failed",
		"pending",
		"active"
	]), u = (e) => l.has(e) ? ` progress-tone-${e}` : "";
	function d(e) {
		let t = Number(e);
		return Number.isFinite(t) ? Math.min(100, Math.max(0, Math.round(t * 1e3) / 10)) : 0;
	}
	z(() => G(o()), () => {
		F(n, d(o()));
	}), z(() => G(a()), () => {
		F(r, Array.isArray(a()) ? a() : []);
	}), In(), qi();
	var f = Vr(), p = L(f), m = (e) => {
		var t = Ha();
		si(t, 5, () => U(r), ri, (e, t) => {
			var n = Va();
			B((e) => Z(n, 1, e), [() => (U(t), W(() => `progress-cell${u(U(t))}`))]), J(e, n);
		}), j(t), B(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), J(e, t);
	}, h = (e) => {
		var t = Ua();
		B(() => {
			Z(t, 1, `progress-meter ${c()}`), Fi(t, U(n)), Q(t, "aria-label", s());
		}), J(e, t);
	};
	X(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), J(e, f), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Ga = /* @__PURE__ */ q("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Ka(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	z(() => (G(r()), G(i()), G(a()), G(o())), () => {
		F(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), In(), qi();
	var s = Ga(), c = L(s), l = I(c), u = I(l);
	j(l), j(c);
	var d = R(c, 2);
	{
		let e = /* @__PURE__ */ M(() => r() / 100);
		Wa(d, {
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
	B(() => Y(u, `整體約 ${r() ?? ""}%`)), J(e, s), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/NextStepCard.svelte
var qa = /* @__PURE__ */ q("<p class=\"next-step-heading\"> </p>"), Ja = /* @__PURE__ */ q("<h3 class=\"next-step-title\"> </h3>"), Ya = /* @__PURE__ */ q("<div><dt> </dt><dd> </dd></div>"), Xa = /* @__PURE__ */ q("<dl class=\"next-step-fields\"><!> <!></dl>"), Za = /* @__PURE__ */ q("<pre class=\"next-step-command\"> </pre>"), Qa = /* @__PURE__ */ q("<section class=\"next-step-card\"><!> <!> <!> <!></section>");
function $a(e, t) {
	let n = $(t, "heading", 8, ""), r = $(t, "title", 8, ""), i = $(t, "action", 8, ""), a = $(t, "expect", 8, ""), o = $(t, "command", 8, ""), s = $(t, "actionLabel", 8, "要做什麼"), c = $(t, "expectLabel", 8, "怎樣算通過");
	var l = Qa(), u = I(l), d = (e) => {
		var t = qa(), r = I(t, !0);
		j(t), B(() => Y(r, n())), J(e, t);
	};
	X(u, (e) => {
		n() && e(d);
	});
	var f = R(u, 2), p = (e) => {
		var t = Ja(), n = I(t, !0);
		j(t), B(() => Y(n, r())), J(e, t);
	};
	X(f, (e) => {
		r() && e(p);
	});
	var m = R(f, 2), h = (e) => {
		var t = Xa(), n = I(t), r = (e) => {
			var t = Ya(), n = I(t), r = I(n, !0);
			j(n);
			var a = R(n), o = I(a, !0);
			j(a), j(t), B(() => {
				Y(r, s()), Y(o, i());
			}), J(e, t);
		};
		X(n, (e) => {
			i() && e(r);
		});
		var o = R(n, 2), l = (e) => {
			var t = Ya(), n = I(t), r = I(n, !0);
			j(n);
			var i = R(n), o = I(i, !0);
			j(i), j(t), B(() => {
				Y(r, c()), Y(o, a());
			}), J(e, t);
		};
		X(o, (e) => {
			a() && e(l);
		}), j(t), J(e, t);
	};
	X(m, (e) => {
		(i() || a()) && e(h);
	});
	var g = R(m, 2), _ = (e) => {
		var t = Za(), n = I(t, !0);
		j(t), B(() => Y(n, o())), J(e, t);
	};
	X(g, (e) => {
		o() && e(_);
	}), j(l), B(() => Q(l, "aria-label", n() || r())), J(e, l);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportNextStep.svelte
var eo = /* @__PURE__ */ q("<a class=\"report-next-step\"><!></a>");
function to(e, t) {
	qe(t, !1);
	let n = $(t, "next", 8, null);
	qi();
	var r = Vr(), i = L(r), a = (e) => {
		var t = eo(), r = I(t);
		{
			let e = /* @__PURE__ */ M(() => (G(n()), W(() => n().stateLabel ?? "")));
			$a(r, {
				heading: "Next",
				get title() {
					return G(n()), W(() => n().title);
				},
				get action() {
					return G(n()), W(() => n().cardTitle);
				},
				actionLabel: "卡片",
				get expect() {
					return U(e);
				},
				expectLabel: "狀態"
			});
		}
		j(t), B(() => {
			Q(t, "href", (G(n()), W(() => n().href))), Q(t, "title", (G(n()), W(() => `開啟卡片：${n().cardTitle}`)));
		}), J(e, t);
	};
	X(i, (e) => {
		n() && e(a);
	}), J(e, r), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var no = /* @__PURE__ */ q("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), ro = /* @__PURE__ */ q("<p class=\"hero-summary\"> </p>");
function io(e, t) {
	qe(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	qi();
	var c = Vr(), l = L(c), u = (e) => {
		var t = no();
		mt(t), B(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Fi(t, i());
		}), K("input", t, (e) => s()(e.currentTarget.value)), J(e, t);
	}, d = (e) => {
		var t = ro(), r = I(t, !0);
		j(t), B(() => Y(r, n())), J(e, t);
	};
	X(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), J(e, c), Je();
}
jr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var ao = /* @__PURE__ */ q("<a class=\"scope-developer-link\"> </a>"), oo = /* @__PURE__ */ q("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function so(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Vr();
	si(L(i), 1, n, (e) => e.id, (e, t) => {
		var n = oo(), i = I(n), a = I(i, !0);
		j(i);
		var o = R(i, 2), s = (e) => {
			var n = ao(), i = I(n, !0);
			j(n), B(() => {
				Q(n, "href", (U(t), W(() => U(t).baseOnlyHref))), Y(i, r());
			}), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).baseOnlyHref) && e(s);
		}), j(n), B(() => {
			Q(i, "href", (U(t), W(() => U(t).href))), Y(a, (U(t), W(() => U(t).id)));
		}), J(e, n);
	}), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var co = /* @__PURE__ */ q("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), lo = /* @__PURE__ */ q("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), uo = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function fo(e, t) {
	qe(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	qi();
	var y = uo(), b = L(y), x = I(b, !0);
	j(b);
	var S = R(b, 2), C = I(S), w = I(C, !0);
	j(C);
	var ee = R(C, 2), T = I(ee, !0);
	j(ee), j(S);
	var te = R(S, 2), ne = (e) => {
		var t = co(), a = I(t, !0);
		j(t), B(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), Y(a, i());
		}), K("click", t, () => r()(!n())), J(e, t);
	};
	X(te, (e) => {
		r() && e(ne);
	});
	var re = R(te, 2), E = (e) => {
		var t = lo(), n = L(t), r = I(n, !0);
		j(n);
		var i = R(n, 2), s = I(i, !0);
		j(i), B(() => {
			n.disabled = o(), Y(r, m()), i.disabled = !a() || o(), Y(s, o() ? d() : u());
		}), K("click", n, function(...e) {
			v()?.apply(this, e);
		}), K("click", i, function(...e) {
			h()?.apply(this, e);
		}), J(e, t);
	};
	X(re, (e) => {
		n() && e(E);
	}), B(() => {
		Y(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), Y(w, f()), Q(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), Y(T, p());
	}), K("click", C, function(...e) {
		g()?.apply(this, e);
	}), K("click", ee, function(...e) {
		_()?.apply(this, e);
	}), J(e, y), Je();
}
jr(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var po = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function mo(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ P(), o = $(t, "categories", 24, () => []), s = $(t, "order", 24, () => []), c = $(t, "selected", 24, () => /* @__PURE__ */ new Set()), l = $(t, "defaultLit", 8, !1), u = $(t, "defaultLabel", 8, "預設"), d = $(t, "ariaLabel", 8, "篩選"), f = $(t, "className", 8, ""), p = $(t, "reorderable", 8, !1), m = $(t, "onSelect", 8, () => {}), h = $(t, "onSelectDefault", 8, () => {}), g = $(t, "onReorder", 8, () => {}), _ = (e) => e.count === void 0 || e.count === null ? e.label : `${e.label} ${e.count}`, v = (e, t, n) => {
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
	z(() => (G(u()), G(p()), G(l())), () => {
		F(n, {
			id: po,
			label: u(),
			className: `filter-button filter-default${p() ? " status-sortable" : ""}`,
			sortable: p(),
			pressed: l(),
			title: p() ? "顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序" : "顯示全部",
			ariaLabel: l() ? `${u()}，已全選` : `${u()}，選取全部`
		});
	}), z(() => G(o()), () => {
		F(r, new Map(o().map((e) => [e.id, e])));
	}), z(() => (G(s()), G(o())), () => {
		F(i, s().length > 0 ? s() : [po, ...o().map((e) => e.id)]);
	}), z(() => (U(i), U(n), U(r), G(c()), G(p())), () => {
		F(a, U(i).map((e) => e === "__default__" ? U(n) : U(r).get(e)).filter(Boolean).map((e) => e === U(n) ? e : v(e, c(), p())));
	}), In(), qi();
	{
		let t = /* @__PURE__ */ M(() => `filter-strip ${f()}`);
		za(e, {
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
	Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var ho = /* @__PURE__ */ q("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function go(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = $(t, "counts", 24, () => ({})), i = $(t, "statusOrder", 24, () => []), a = {
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
	z(() => (G(i()), G(r())), () => {
		F(n, i().filter((e) => a[e]).map((e) => ({
			status: e,
			value: r()[e] ?? 0,
			...a[e]
		})));
	}), In(), qi();
	var o = Vr();
	si(L(o), 1, () => U(n), (e) => e.status, (e, t) => {
		var n = ho(), r = I(n), i = I(r, !0);
		j(r);
		var a = R(r, 2), o = I(a, !0);
		j(a), j(n), B(() => {
			Z(n, 1, (U(t), W(() => `overview-card overview-${U(t).tone}`))), Q(n, "data-status", (U(t), W(() => U(t).status))), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), J(e, o), Je();
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function _o(e, t) {
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
function vo(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var yo = /* @__PURE__ */ zr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), bo = /* @__PURE__ */ zr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), xo = /* @__PURE__ */ zr("<path d=\"M3 3l18 18\"></path>"), So = /* @__PURE__ */ zr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function Co(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = So(), a = I(i), o = (e) => {
		J(e, yo());
	}, s = (e) => {
		var t = bo();
		Le(), J(e, t);
	};
	X(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = R(a), l = (e) => {
		J(e, xo());
	};
	X(c, (e) => {
		r() && e(l);
	}), j(i), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var wo = /* @__PURE__ */ q("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), To = /* @__PURE__ */ q("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function Eo(e, t) {
	qe(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	qi();
	var l = To(), u = L(l);
	let d;
	var f = I(u), p = I(f), m = I(p, !0);
	j(p), j(f);
	var h = R(f, 2), g = (e) => {
		var t = wo(), n = I(t);
		{
			let e = /* @__PURE__ */ M(() => !r());
			Co(n, { get closed() {
				return U(e);
			} });
		}
		j(t), B(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), K("click", t, () => i()(!r())), J(e, t);
	};
	X(h, (e) => {
		n() && e(g);
	}), pi(R(h, 2), t, "header", {}, null), j(u);
	var _ = R(u, 2);
	pi(I(_), t, "default", {}, null), j(_), B(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), Y(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), K("click", f, () => c()(!a())), J(e, l), Je();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var Do = /* @__PURE__ */ q("<span class=\"developer-next-label\">後續：</span> <span class=\"developer-next-action\"> </span>", 1), Oo = /* @__PURE__ */ q("<span class=\"developer-expand-hint\">展開作法與方向</span>"), ko = /* @__PURE__ */ q("<!> <!>", 1), Ao = /* @__PURE__ */ q("<li> </li>"), jo = /* @__PURE__ */ q("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續</h4> <ul class=\"detail-list\"></ul></section>"), Mo = /* @__PURE__ */ q("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), No = /* @__PURE__ */ q("<code class=\"reference\"> </code>"), Po = /* @__PURE__ */ q("<article class=\"decision-item\"><p> </p> <!></article>"), Fo = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Io = /* @__PURE__ */ q("<p> </p>"), Lo = /* @__PURE__ */ q("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), Ro = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), zo = /* @__PURE__ */ q("<div class=\"path-list\"></div>"), Bo = /* @__PURE__ */ q("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Vo = /* @__PURE__ */ q("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function Ho(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = $(t, "developer", 8, null);
	z(() => G(s()), () => {
		F(n, s()?.next_steps ?? []);
	}), z(() => (G(s()), U(n)), () => {
		F(r, s()?.next_step ?? U(n)[0] ?? null);
	}), z(() => (G(s()), U(n)), () => {
		F(i, s()?.next_step ? U(n) : U(n).slice(1));
	}), z(() => (U(i), G(s())), () => {
		F(a, !!(U(i).length || s()?.blockers?.length || s()?.decisions?.length || s()?.routes?.length || s()?.claim));
	}), z(() => (U(r), U(a)), () => {
		F(o, !!U(r) || U(a));
	}), In(), qi();
	var c = Vr(), l = L(c), u = (e) => {
		var t = Vr();
		mi(L(t), () => U(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = ko(), o = L(n);
			mi(o, () => U(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = ko(), i = L(n), o = (e) => {
					var t = Do(), n = R(L(t), 2), i = I(n, !0);
					j(n), B(() => Y(i, U(r))), J(e, t);
				};
				X(i, (e) => {
					U(r) && e(o);
				});
				var s = R(i, 2), c = (e) => {
					J(e, Oo());
				};
				X(s, (e) => {
					U(a) && e(c);
				}), J(t, n);
			});
			var c = R(o, 2), l = (e) => {
				var t = Vo(), n = R(I(t), 2), r = (e) => {
					var t = jo(), n = R(I(t), 2);
					si(n, 5, () => U(i), ri, (e, t) => {
						var n = Ao(), r = I(n, !0);
						j(n), B(() => Y(r, U(t))), J(e, n);
					}), j(n), j(t), J(e, t);
				};
				X(n, (e) => {
					U(i), W(() => U(i).length) && e(r);
				});
				var a = R(n, 2), o = (e) => {
					var t = Mo(), n = R(I(t), 2);
					si(n, 5, () => (G(s()), W(() => s().blockers)), ri, (e, t) => {
						var n = Ao(), r = I(n, !0);
						j(n), B(() => Y(r, U(t))), J(e, n);
					}), j(n), j(t), J(e, t);
				};
				X(a, (e) => {
					G(s()), W(() => s().blockers?.length) && e(o);
				});
				var c = R(a, 2), l = (e) => {
					var t = Fo(), n = R(I(t), 2);
					si(n, 5, () => (G(s()), W(() => s().decisions)), ri, (e, t) => {
						var n = Po(), r = I(n), i = I(r, !0);
						j(r);
						var a = R(r, 2), o = (e) => {
							var n = No(), r = I(n, !0);
							j(n), B(() => Y(r, (U(t), W(() => U(t).reference)))), J(e, n);
						};
						X(a, (e) => {
							U(t), W(() => U(t).reference) && e(o);
						}), j(n), B(() => Y(i, (U(t), W(() => U(t).summary)))), J(e, n);
					}), j(n), j(t), J(e, t);
				};
				X(c, (e) => {
					G(s()), W(() => s().decisions?.length) && e(l);
				});
				var u = R(c, 2), d = (e) => {
					var t = Ro(), n = R(I(t), 2);
					si(n, 5, () => (G(s()), W(() => s().routes)), ri, (e, t) => {
						var n = Lo(), r = I(n), i = I(r), a = I(i, !0);
						j(i);
						var o = R(i, 2), s = I(o, !0);
						j(o), j(r);
						var c = R(r, 2), l = (e) => {
							var n = Io(), r = I(n, !0);
							j(n), B(() => Y(r, (U(t), W(() => U(t).reason)))), J(e, n);
						};
						X(c, (e) => {
							U(t), W(() => U(t).reason) && e(l);
						}), j(n), B(() => {
							Y(a, (U(t), W(() => U(t).title))), Z(o, 1, (U(t), W(() => `route-state route-${U(t).state}`))), Y(s, (U(t), W(() => U(t).state)));
						}), J(e, n);
					}), j(n), j(t), J(e, t);
				};
				X(u, (e) => {
					G(s()), W(() => s().routes?.length) && e(d);
				});
				var f = R(u, 2), p = (e) => {
					var t = Bo(), n = R(I(t), 2), r = I(n);
					j(n);
					var i = R(n, 2), a = (e) => {
						var t = Io(), n = I(t);
						j(t), B(() => Y(n, `Worktree: ${G(s()), W(() => s().claim.worktree) ?? ""}`)), J(e, t);
					};
					X(i, (e) => {
						G(s()), W(() => s().claim.worktree) && e(a);
					});
					var o = R(i, 2), c = (e) => {
						var t = zo();
						si(t, 5, () => (G(s()), W(() => s().claim.source_paths)), ri, (e, t) => {
							var n = No(), r = I(n, !0);
							j(n), B(() => Y(r, U(t))), J(e, n);
						}), j(t), J(e, t);
					};
					X(o, (e) => {
						G(s()), W(() => s().claim.source_paths?.length) && e(c);
					}), j(t), B(() => Y(r, `Agent: ${G(s()), W(() => s().claim.agent) ?? ""}`)), J(e, t);
				};
				X(f, (e) => {
					G(s()), W(() => s().claim) && e(p);
				}), j(t), J(e, t);
			};
			X(c, (e) => {
				U(a) && e(l);
			}), J(t, n);
		}), J(e, t);
	};
	X(l, (e) => {
		s() && U(o) && e(u);
	}), J(e, c), Je();
}
//#endregion
//#region viewer/assets/inline-links.js
function Uo(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function Wo(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = Uo(t.slice(r.lastIndex, e - 1));
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
function Go(e, t, { emphasis: n = !1 } = {}) {
	let r = e.createElement("a");
	return r.className = n ? "inline-link inline-link--emphasis" : "inline-link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text, r;
}
function Ko(e) {
	let t = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
	return Wo(e).map((e) => ({
		...e,
		units: e.href ? [e.text] : t ? Array.from(t.segment(e.text), (e) => e.segment) : Array.from(e.text)
	}));
}
//#endregion
//#region viewer/assets/expandable-text.js
function qo(e, t = {}) {
	let n = e.ownerDocument, r = n.defaultView, i = n.createElement("div"), a = n.createElement("span"), o = n.createElement("button"), s = n.createElement("span"), c = n.createElement("span");
	c.className = "expandable-text__label", o.append(s, c), i.className = "expandable-text__content", o.className = "expandable-text__toggle", o.type = "button", e.classList.add("expandable-text"), i.append(a, o), e.append(i);
	let l = n.createElement("div"), u = n.createElement("span"), d = n.createElement("button");
	l.className = "expandable-text__content expandable-text__measure", l.setAttribute("aria-hidden", "true"), l.inert = !0, d.className = "expandable-text__toggle", l.append(u, d), e.append(l);
	let f, p = !1, m = 0, h = !1, g = [], _ = [], v = [], y = 0;
	function b(e) {
		return e.replaceChildren(), g.map((t) => {
			let r = t.href ? Go(n, t, { emphasis: f.emphasis }) : n.createElement("span");
			return e.append(r), r;
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
		let t = String(e.text ?? ""), n = Number.isInteger(e.lines) && e.lines > 0 ? e.lines : 2, r = e.emphasis === !0, i = !f || f.text !== t || f.emphasis !== r, o = e.expanded === !0;
		i || f.lines !== n ? p = o : o && !f.open && (p = !0), f = {
			text: t,
			lines: n,
			open: o,
			emphasis: r,
			moreLabel: e.moreLabel ?? "…更多",
			lessLabel: e.lessLabel ?? "收合"
		}, i && (g = Ko(t), y = g.reduce((e, t) => e + t.units.length, 0), _ = b(a), v = b(u), x(_, y)), S(), w();
	}
	function T() {
		p = !p, S(), w();
	}
	o.hidden = !0, o.addEventListener("click", T);
	let te = new r.ResizeObserver(w);
	return te.observe(i), n.fonts?.addEventListener("loadingdone", w), ee(t), {
		update: ee,
		destroy() {
			h = !0, r.cancelAnimationFrame(m), te.disconnect(), n.fonts?.removeEventListener("loadingdone", w), o.removeEventListener("click", T), i.remove(), l.remove(), e.classList.remove("expandable-text");
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/ExpandableText.svelte
var Jo = /* @__PURE__ */ q("<div></div>");
function Yo(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "lines", 8, 2), i = $(t, "moreLabel", 8, "…更多"), a = $(t, "lessLabel", 8, "收合"), o = $(t, "expanded", 8, !1), s = $(t, "emphasis", 8, !1);
	var c = Jo();
	hi(c, (e, t) => qo?.(e, t), () => ({
		text: n(),
		lines: r(),
		moreLabel: i(),
		lessLabel: a(),
		expanded: o(),
		emphasis: s()
	})), J(e, c);
}
//#endregion
//#region viewer/assets/item-reference.js
function Xo({ scopeId: e, taskId: t, item: n }) {
	return !e || !t || !n?.id || n.legacy ? null : `${e} › ${t} › ${n.id}`;
}
async function Zo(e, t = globalThis.document) {
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
Object.freeze([
	"created",
	"started",
	"updated",
	"done",
	"takeover",
	"released",
	"disputed"
]);
var Qo = {
	created: "建立",
	started: "開始",
	updated: "修改",
	done: "完成",
	takeover: "接手",
	released: "釋放",
	disputed: "爭議"
};
function $o(e, t) {
	let n = Math.floor((t - Date.parse(e)) / 6e4);
	if (!Number.isFinite(n)) return "";
	if (n < 1) return "剛剛";
	if (n < 60) return `${n} 分鐘前`;
	let r = Math.floor(n / 60);
	return r < 24 ? `${r} 小時前` : `${Math.floor(r / 24)} 天前`;
}
function es(e, t = Date.now()) {
	return !Array.isArray(e) || !e.length ? "" : e.map((e) => {
		let n = e.session ? `${e.actor} (${e.session})` : e.actor, r = $o(e.at, t), i = e.note ? `：${e.note}` : "";
		return `${Qo[e.event] ?? e.event}：${n}${r ? ` · ${r}` : ""}${i}`;
	}).join("\n");
}
var ts = (e, t) => e > 0 && t > 0 ? e / t : 1;
function ns(e, t) {
	let n = t.delay ?? 400, r = t.tolerance ?? 6, i = e.ownerDocument, a = i.defaultView, o = new AbortController(), s, c, l = !1, u, d = !1, f = (e, t, n, r = !1) => e.addEventListener(t, n, {
		signal: o.signal,
		capture: r
	}), p = () => {
		let n = s?.event.pointerId;
		s = void 0, l = !1, clearTimeout(c), c = void 0, t.capture !== !1 && n !== void 0 && e.hasPointerCapture?.(n) && e.releasePointerCapture(n);
	}, m = () => {
		let e = !!s;
		s && (u = s.event.pointerId), p(), e && t.onCancel?.();
	}, h = (t) => {
		let n = e.getBoundingClientRect();
		return t.clientX < n.left || t.clientX > n.right || t.clientY < n.top || t.clientY > n.bottom;
	};
	return f(e, "pointerdown", (r) => {
		if (d || s || !r.isPrimary || r.button !== 0 || e.matches(":disabled") || t.accept && !t.accept(r)) return;
		let i = e.getBoundingClientRect();
		if (u = void 0, s = {
			event: r,
			sx: ts(i.width, e.offsetWidth),
			sy: ts(i.height, e.offsetHeight)
		}, t.capture !== !1) try {
			e.setPointerCapture(r.pointerId);
		} catch {}
		t.onStart?.(r), c = setTimeout(() => {
			if (c = void 0, s?.event !== r || d || !e.isConnected || e.matches(":disabled")) {
				p();
				return;
			}
			l = !0, u = r.pointerId, t.onTrigger(r);
		}, n);
	}), f(i, "pointerdown", (e) => {
		s && e.pointerId !== s.event.pointerId && m();
	}), f(i, "pointermove", (e) => {
		if (!s || e.pointerId !== s.event.pointerId) return;
		if (l) {
			t.onMove?.(e);
			return;
		}
		let n = (e.clientX - s.event.clientX) / s.sx, i = (e.clientY - s.event.clientY) / s.sy;
		Math.hypot(n, i) > r && m();
	}), f(i, "pointerup", (e) => {
		e.pointerId === s?.event.pointerId && (l ? (p(), t.onEnd?.(e)) : h(e) ? m() : p());
	}), f(i, "pointercancel", (e) => {
		e.pointerId === s?.event.pointerId && m();
	}), f(e, "lostpointercapture", (e) => {
		e.pointerId === s?.event.pointerId && m();
	}), f(e, "click", (e) => {
		u !== void 0 && e.detail !== 0 && ("pointerId" in e && e.pointerId !== u || (u = void 0, e.preventDefault(), e.stopImmediatePropagation()));
	}, !0), f(e, "contextmenu", (e) => {
		l ? e.preventDefault() : m();
	}), f(i, "keydown", (e) => {
		e.key === "Escape" && m();
	}, !0), a && (f(a, "blur", m), f(a, "resize", m)), f(i, "scroll", m, !0), f(i, "visibilitychange", () => {
		i.hidden && m();
	}), {
		get isHolding() {
			return l;
		},
		cancel: p,
		dispose() {
			if (!d) {
				d = !0;
				try {
					m();
				} finally {
					o.abort();
				}
			}
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var rs = /* @__PURE__ */ q("<button type=\"button\" class=\"item-row-grip\" draggable=\"true\" title=\"拖曳換位（限同優先級）\">⠿</button>"), is = /* @__PURE__ */ q("<span aria-hidden=\"true\"> </span>"), as = /* @__PURE__ */ q("<option> </option>"), os = /* @__PURE__ */ q("<select class=\"inline-priority-select\"></select>"), ss = /* @__PURE__ */ q("<span> </span>"), cs = /* @__PURE__ */ q("<span class=\"item-row-priority\"><!></span>"), ls = /* @__PURE__ */ q("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), us = /* @__PURE__ */ q("<span class=\"item-next-capsule\" title=\"Next：這個 scope 現在該做的一件事；長按取消\">Next</span>"), ds = /* @__PURE__ */ q("<span class=\"item-row-selected-label\">已選取</span>"), fs = /* @__PURE__ */ q("<a class=\"document-source-link\"><span class=\"source-icon\" aria-hidden=\"true\"> </span> <span class=\"source-label\"> </span></a>"), ps = /* @__PURE__ */ q("<span class=\"document-source-link source-unavailable\"><span class=\"source-icon\" aria-hidden=\"true\">⚠️</span> <span class=\"source-label\">來源不可用</span></span>"), ms = /* @__PURE__ */ q("<div class=\"item-row-text\"><!> <!> <!> <!></div>"), hs = /* @__PURE__ */ q("<button type=\"button\"> </button>"), gs = /* @__PURE__ */ q("<select class=\"inline-status-select\"></select>"), _s = /* @__PURE__ */ q("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), vs = /* @__PURE__ */ q("<li><!> <!> <div class=\"item-row-description\"><!></div> <!> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function ys(e, t) {
	qe(t, !1);
	let n = () => dt(ne(), "$selection", r), [r, i] = ft(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ P(), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P(), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P(), h = $(t, "taskId", 8), g = $(t, "field", 8), _ = $(t, "item", 8), v = $(t, "editing", 8), y = $(t, "policy", 8), b = $(t, "onCommand", 8), x = $(t, "moduleCapsules", 24, () => []), S = $(t, "onModuleActivate", 8, () => {}), C = $(t, "moduleOrder", 24, () => ["time"]), w = $(t, "onModuleReorder", 8, () => {}), ee = $(t, "leadItem", 8, !1), T = $(t, "reorder", 8, null), te = $(t, "scopeId", 8, null), ne = $(t, "selection", 8, null), re = $(t, "isNext", 8, !1), E = $(t, "onSetNext", 8, null);
	function ie() {
		E()?.({
			taskId: h(),
			itemId: _().id,
			clear: re()
		});
	}
	function D(e, t) {
		let n = null, r = (t) => {
			n?.dispose(), n = t ? ns(e, {
				capture: !1,
				accept: (e) => !e.target.closest("a, button, input, select, textarea, label, [contenteditable]"),
				onTrigger: ie
			}) : null;
		};
		return r(t), {
			update: r,
			destroy: () => n?.dispose()
		};
	}
	function O() {
		v() || F(o, es(_().activity));
	}
	let ae = /* @__PURE__ */ P(""), oe;
	async function se() {
		clearTimeout(oe);
		let e = ne() ? await ne().copyReferences(U(a)) : await Zo(U(a));
		F(ae, e ? "已複製" : "無法複製"), oe = setTimeout(() => {
			F(ae, "");
		}, 1500);
	}
	let ce = /* @__PURE__ */ P(y().normalize(_().priority, y().fallbackValue)), le = $(t, "statuses", 24, () => []), ue = /* @__PURE__ */ P(_().status ?? (g() === "completed_items" ? "done" : "planned"));
	function de(e) {
		e !== U(f) && b()({
			type: "set-item-status",
			taskId: h(),
			field: g(),
			itemId: _().id,
			status: e
		});
	}
	function fe(e) {
		S()(e, {
			taskId: h(),
			itemId: _().id,
			itemTitle: _().title
		});
	}
	z(() => (G(v()), G(te()), G(h()), G(_())), () => {
		F(a, v() ? null : Xo({
			scopeId: te(),
			taskId: h(),
			item: _()
		}));
	}), z(() => (G(v()), G(_())), () => {
		F(o, v() ? "" : es(_().activity));
	}), z(() => (U(a), G(ne())), () => {
		F(s, !!(U(a) && ne()));
	}), z(() => (U(s), n(), U(a)), () => {
		F(c, U(s) && !!n()?.keys.has(U(a)));
	}), z(() => (U(c), n()), () => {
		F(l, U(c) ? n().keys.size : 1);
	}), z(() => (G(y()), G(_())), () => {
		F(u, y().metadata(_().priority));
	}), z(() => (G(y()), G(_())), () => {
		F(d, y().format(_().priority));
	}), z(() => (G(y()), G(_())), () => {
		F(ce, y().normalize(_().priority, y().fallbackValue));
	}), z(() => (G(_()), G(g())), () => {
		F(f, _().status ?? (g() === "completed_items" ? "done" : "planned"));
	}), z(() => U(f), () => {
		F(ue, U(f));
	}), z(() => (G(_()), G(le()), U(f)), () => {
		F(p, _().derivedState && _().derivedState !== "done" ? {
			label: _().derivedStateLabel,
			tone: _().derivedStateTone
		} : le().find((e) => e.value === U(f)) ?? {
			label: U(f),
			tone: "muted"
		});
	}), z(() => U(p), () => {
		F(m, U(p).label);
	}), In(), qi();
	var pe = vs();
	let me;
	var he = I(pe), ge = (e) => {
		var t = rs();
		B(() => {
			Q(t, "data-item-ref", (G(h()), G(_()), W(() => `${h()}/${_().id}`))), Q(t, "aria-label", (G(_()), W(() => `移動「${_().title}」（Alt+↑／↓，限同優先級）`)));
		}), Ar("dragstart", t, function(...e) {
			T().start?.apply(this, e);
		}), Ar("dragend", t, function(...e) {
			T().end?.apply(this, e);
		}), K("keydown", t, function(...e) {
			T().keydown?.apply(this, e);
		}), J(e, t);
	}, _e = (e) => {
		var t = is(), n = I(t, !0);
		j(t), B(() => {
			Z(t, 1, `item-row-marker item-row-marker-${U(f)}`), Y(n, U(f) === "done" ? "✓" : "○");
		}), J(e, t);
	};
	X(he, (e) => {
		T() && v() ? e(ge) : e(_e, -1);
	});
	var ve = R(he, 2), ye = (e) => {
		var t = cs(), n = I(t), r = (e) => {
			var t = os();
			si(t, 5, () => (G(y()), W(() => y().levels)), (e) => e.value, (e, t) => {
				var n = as(), r = I(n, !0);
				j(n);
				var i = {};
				B((e) => {
					Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
				}, [() => (G(y()), U(t), W(() => y().format(U(t).value)))]), J(e, n);
			}), j(t), B(() => Q(t, "aria-label", (G(_()), W(() => `設定「${_().title}」的優先級`)))), K("change", t, () => b()({
				type: "set-item-field",
				taskId: h(),
				field: g(),
				itemId: _().id,
				property: "priority",
				value: Number(U(ce))
			})), Oi(t, () => U(ce), (e) => F(ce, e)), J(e, t);
		}, i = (e) => {
			var t = ss(), n = I(t, !0);
			j(t), B(() => {
				Z(t, 1, (U(u), W(() => `priority-badge priority-${U(u).tone}`))), Y(n, U(d));
			}), J(e, t);
		};
		X(n, (e) => {
			v() ? e(r) : e(i, -1);
		}), j(t), J(e, t);
	};
	X(ve, (e) => {
		G(v()), U(f), U(u), G(y()), W(() => v() || U(f) !== "done" && U(u) && (!U(u).hidden || !y().labelsValid)) && e(ye);
	});
	var be = R(ve, 2), xe = I(be), Se = (e) => {
		var t = ls();
		Pi(t), B(() => {
			Q(t, "aria-label", (G(_()), W(() => `編輯子項目：${_().title}`))), Q(t, "title", (G(_()), W(() => _().title))), Fi(t, (G(_()), W(() => _().title)));
		}), K("input", t, (e) => b()({
			type: "set-item-field",
			taskId: h(),
			field: g(),
			itemId: _().id,
			property: "title",
			value: e.currentTarget.value
		})), J(e, t);
	}, Ce = (e) => {
		var t = ms(), n = I(t), r = (e) => {
			J(e, us());
		};
		X(n, (e) => {
			re() && e(r);
		});
		var i = R(n, 2), a = (e) => {
			J(e, ds());
		};
		X(i, (e) => {
			U(c) && e(a);
		});
		var o = R(i, 2), s = (e) => {
			var t = Vr(), n = L(t), r = (e) => {
				var t = fs(), n = I(t), r = I(n, !0);
				j(n);
				var i = R(n, 2), a = I(i, !0);
				j(i), j(t), B(() => {
					Q(t, "href", (G(_()), W(() => _().sourceRef.href))), Q(t, "title", (G(_()), W(() => _().sourceRef.title))), Y(r, (G(_()), W(() => _().sourceRef.kind === "decision" ? "⚖" : _().sourceRef.manual ? "📋" : "🤖"))), Y(a, (G(_()), W(() => _().sourceRef.label)));
				}), J(e, t);
			}, i = (e) => {
				var t = ps();
				B(() => Q(t, "title", (G(_()), W(() => _().sourceRef.error ?? "來源無法讀取")))), J(e, t);
			};
			X(n, (e) => {
				G(_()), W(() => _().sourceRef.available) ? e(r) : e(i, -1);
			}), J(e, t);
		};
		X(o, (e) => {
			G(_()), W(() => _().sourceRef) && e(s);
		});
		var l = R(o, 2);
		{
			let e = /* @__PURE__ */ M(() => (G(_()), W(() => _().displayTitle ?? _().title)));
			Yo(l, {
				get text() {
					return U(e);
				},
				lines: 1,
				get expanded() {
					return ee();
				}
			});
		}
		j(t), J(e, t);
	};
	X(xe, (e) => {
		v() ? e(Se) : e(Ce, -1);
	}), j(be);
	var we = R(be, 2), Te = (e) => {
		var t = hs();
		let n;
		var r = I(t, !0);
		j(t), B(() => {
			n = Z(t, 1, "item-row-copy", null, n, {
				"is-done": U(ae),
				"is-copied": U(ae) === "已複製"
			}), Q(t, "data-item-ref", (G(h()), G(_()), W(() => `${h()}/${_().id}`))), Q(t, "tabindex", U(s) ? -1 : void 0), Q(t, "aria-label", (U(ae), U(l), G(_()), W(() => U(ae) || (U(l) > 1 ? `複製已選取的 ${U(l)} 項參照` : `複製「${_().title}」的參照`)))), Q(t, "title", U(ae) || (U(l) > 1 ? `複製已選取的 ${U(l)} 項參照` : U(a))), Y(r, U(ae) === "已複製" ? "✓" : U(ae) ? "✕" : "⧉");
		}), K("click", t, se), J(e, t);
	};
	X(we, (e) => {
		U(a) && e(Te);
	});
	var Ee = R(we, 2), De = I(Ee);
	Ba(I(De), {
		get capsules() {
			return x();
		},
		get moduleOrder() {
			return C();
		},
		onActivate: fe,
		get onReorder() {
			return w();
		}
	}), j(De);
	var Oe = R(De, 2), ke = I(Oe), Ae = (e) => {
		var t = gs();
		si(t, 5, le, (e) => e.value, (e, t) => {
			var n = as(), r = I(n, !0);
			j(n);
			var i = {};
			B(() => {
				Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}), J(e, n);
		}), j(t), B(() => Q(t, "aria-label", (G(_()), W(() => `設定「${_().title}」的狀態`)))), K("change", t, () => de(U(ue))), Oi(t, () => U(ue), (e) => F(ue, e)), J(e, t);
	}, je = (e) => {
		var t = ss(), n = I(t, !0);
		j(t), B(() => {
			Z(t, 1, (U(p), W(() => `item-status-capsule status-${U(p).tone}`))), Y(n, U(m));
		}), J(e, t);
	};
	X(ke, (e) => {
		v() ? e(Ae) : e(je, -1);
	}), j(Oe);
	var Me = R(Oe, 2), Ne = (e) => {
		var t = _s(), n = I(t);
		j(t), B(() => Q(n, "aria-label", (G(_()), W(() => `刪除子項目：${_().title}`)))), K("click", n, () => b()({
			type: "delete-item",
			taskId: h(),
			field: g(),
			itemId: _().id
		})), J(e, t);
	};
	X(Me, (e) => {
		v() && e(Ne);
	}), j(Ee), j(pe), hi(pe, (e, t) => D?.(e, t), () => !!(E() && U(a) && !v())), B(() => {
		me = Z(pe, 1, "editor-item-row", null, me, {
			"editable-work-item": v(),
			"item-drop-before": v() && T()?.side === "before",
			"item-drop-after": v() && T()?.side === "after",
			"item-gap-before": !v() && T()?.side === "before",
			"item-gap-after": !v() && T()?.side === "after",
			"item-row-reorderable": !v() && !!T(),
			"item-row-dragging": !!T()?.dragging,
			"is-selected": U(c),
			"is-next": re()
		}), Q(pe, "data-select-key", U(s) ? U(a) : void 0), Q(pe, "tabindex", U(s) ? 0 : void 0), Q(pe, "draggable", (G(v()), G(T()), W(() => !v() && T()?.armed ? "true" : void 0))), Q(pe, "title", U(o) || void 0);
	}), K("click", pe, function(...e) {
		(U(s) ? (e) => ne().rowClick(U(a), e) : void 0)?.apply(this, e);
	}), Ar("focus", pe, function(...e) {
		(U(s) ? () => ne().rowFocus(U(a)) : void 0)?.apply(this, e);
	}), Ar("pointerenter", pe, O), K("pointerdown", pe, function(...e) {
		(v() ? void 0 : T()?.arm)?.apply(this, e);
	}), K("pointerup", pe, function(...e) {
		(v() ? void 0 : T()?.disarm)?.apply(this, e);
	}), Ar("dragstart", pe, function(...e) {
		(v() ? void 0 : T()?.start)?.apply(this, e);
	}), Ar("dragend", pe, function(...e) {
		(v() ? void 0 : T()?.end)?.apply(this, e);
	}), K("keydown", pe, function(...e) {
		(v() ? void 0 : (e) => {
			if (e.shiftKey && e.key === "Enter" && E() && U(a) && e.target === e.currentTarget) {
				e.preventDefault(), ie();
				return;
			}
			T()?.keydown?.(e), !e.defaultPrevented && U(s) && ne().rowKeydown(U(a), e);
		})?.apply(this, e);
	}), Ar("dragover", pe, function(...e) {
		(T()?.over)?.apply(this, e);
	}), Ar("dragleave", pe, function(...e) {
		(T()?.leave)?.apply(this, e);
	}), Ar("drop", pe, function(...e) {
		(T()?.drop)?.apply(this, e);
	}), J(e, pe), Je(), i();
}
jr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown",
	"change",
	"input"
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
var bs = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(bs.levels.map((e) => [e.value, e])));
var xs = bs.fallbackValue;
function Ss(e) {
	return bs.normalize(e, xs);
}
function Cs(e) {
	return Ss(typeof e == "object" && e && !Array.isArray(e) ? e.priority : void 0);
}
function ws(e) {
	return [...e ?? []].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, t) => Cs(e.item) - Cs(t.item) || e.index - t.index).map(({ item: e }) => e);
}
Object.freeze([
	"status",
	"summary",
	"completed_items",
	"pending_items",
	"progress",
	"priority"
]), Object.freeze(["done", "waiting"]);
function Ts(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Es(e, t) {
	if (!t) return e;
	let n = (e ?? []).findIndex((e) => Ts(e) && e.id === t);
	return n <= 0 ? e : [
		e[n],
		...e.slice(0, n),
		...e.slice(n + 1)
	];
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Ds = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Os = /* @__PURE__ */ q("<div class=\"task-summary\"><!></div>"), ks = /* @__PURE__ */ q("<button type=\"button\" class=\"completed-more\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> </button>"), As = /* @__PURE__ */ q("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul> <!></section>"), js = /* @__PURE__ */ q("<option> </option>"), Ms = /* @__PURE__ */ q("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Ns = /* @__PURE__ */ q("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Ps = /* @__PURE__ */ q("<div class=\"spike-add-shell\"><!></div>"), Fs = /* @__PURE__ */ q("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), Is = /* @__PURE__ */ q("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), Ls = /* @__PURE__ */ q("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Rs = /* @__PURE__ */ q("<button type=\"button\"> </button> <h3> </h3>", 1), zs = /* @__PURE__ */ q("<span> </span>"), Bs = /* @__PURE__ */ q("<div class=\"task-module-totals\"></div>"), Vs = /* @__PURE__ */ q("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), Hs = /* @__PURE__ */ q("<article><!></article>");
function Us(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ P(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "progress", 8), p = $(t, "editing", 8), m = $(t, "policy", 8), h = $(t, "onCommand", 8), g = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let _ = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), v = $(t, "onModuleActivate", 8, () => {}), y = $(t, "moduleOrder", 24, () => ["time"]), b = $(t, "onModuleReorder", 8, () => {}), x = $(t, "statusOrder", 24, () => ["done", "planned"]), S = $(t, "moduleTotals", 24, () => []), C = $(t, "lead", 8, !1), w = $(t, "scopeId", 8, null), ee = $(t, "reorderable", 8, !1), T = $(t, "onReorder", 8, () => {}), te = $(t, "selection", 8, null), ne = $(t, "nextItemId", 8, null), re = $(t, "onSetNext", 8, null), E = /* @__PURE__ */ P(""), ie;
	async function D() {
		clearTimeout(ie);
		let e = await Zo(d().id);
		F(E, e ? "已複製" : "無法複製"), ie = setTimeout(() => {
			F(E, "");
		}, 1500);
	}
	let O = /* @__PURE__ */ P(!1), ae = [
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
	], oe = /* @__PURE__ */ P(!1), se = /* @__PURE__ */ P(""), ce = /* @__PURE__ */ P(m().creationDefaultValue), le = /* @__PURE__ */ P(""), ue = /* @__PURE__ */ P(d().status), de = /* @__PURE__ */ P(m().normalize(d().priority, m().fallbackValue));
	function fe() {
		F(oe, !1), F(se, ""), F(ce, m().creationDefaultValue), F(le, "");
	}
	let pe = /* @__PURE__ */ P(null), me = /* @__PURE__ */ P(null), he = /* @__PURE__ */ P(null);
	function ge() {
		F(pe, null), F(me, null), F(he, null);
	}
	function _e(e, t) {
		return m().normalize(e.priority, m().fallbackValue) === m().normalize(t.priority, m().fallbackValue);
	}
	function ve(e, t, n) {
		let r = (d().pending_items ?? []).map((e) => e?.id), i = r.filter((t) => t !== e);
		if (i.splice(i.indexOf(t) + +!!n, 0, e), i.every((e, t) => e === r[t])) return;
		let a = n ? { after: t } : { before: t };
		return p() ? h()({
			type: "reorder-item",
			taskId: d().id,
			itemId: e,
			position: a
		}) : T()({
			taskId: d().id,
			itemId: e,
			position: a
		});
	}
	function ye(e, t, n, r, i) {
		let a = t.find((e) => e.id === n);
		return {
			side: r?.id === e.id ? r.after ? "after" : "before" : null,
			armed: i === e.id,
			dragging: n === e.id,
			arm(t) {
				p() || t.button !== 0 || t.pointerType !== "mouse" || t.target.closest("a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg") || F(he, e.id);
			},
			disarm() {
				U(he) === e.id && U(pe) !== e.id && F(he, null);
			},
			start(t) {
				t.stopPropagation(), F(pe, e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			end: ge,
			over(t) {
				if (!a || a.id === e.id || !_e(a, e)) return;
				t.preventDefault(), t.stopPropagation(), t.dataTransfer.dropEffect = "move";
				let n = (t.currentTarget.querySelector(".item-row-description") ?? t.currentTarget).getBoundingClientRect();
				F(me, {
					id: e.id,
					after: t.clientY >= n.top + n.height / 2
				});
			},
			leave(t) {
				!t.currentTarget.contains(t.relatedTarget) && U(me)?.id === e.id && F(me, null);
			},
			drop(t) {
				!a || U(me)?.id !== e.id || (t.preventDefault(), t.stopPropagation(), ve(a.id, e.id, U(me).after), ge());
			},
			keydown(n) {
				if (!n.altKey || !["ArrowUp", "ArrowDown"].includes(n.key)) return;
				n.preventDefault(), n.stopPropagation();
				let r = t.filter((t) => t.id && _e(t, e)), i = r[r.findIndex((t) => t.id === e.id) + (n.key === "ArrowUp" ? -1 : 1)];
				if (!i) return;
				let a = CSS.escape(`${d().id}/${e.id}`);
				Promise.resolve(ve(e.id, i.id, n.key === "ArrowDown")).then(() => Sr()).then(() => document.querySelector(`[data-item-ref="${a}"]`)?.focus());
			}
		};
	}
	function be() {
		let e = g()(U(se), Number(U(ce)));
		F(le, e.error), U(le) || fe();
	}
	z(() => (G(d()), G(ne())), () => {
		F(n, [{
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
			items: Es(ws(d().pending_items), ne())
		}]);
	}), z(() => (U(n), G(x())), () => {
		F(r, [...U(n)].sort((e, t) => {
			let n = x().indexOf(e.status), r = x().indexOf(t.status);
			return (n < 0 ? x().length : n) - (r < 0 ? x().length : r);
		}));
	}), z(() => (G(m()), G(d())), () => {
		F(i, m().metadata(d().priority));
	}), z(() => G(d()), () => {
		F(ue, d().status);
	}), z(() => (G(m()), G(d())), () => {
		F(de, m().normalize(d().priority, m().fallbackValue));
	}), z(() => G(d()), () => {
		F(a, ae.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), z(() => (G(p()), U(oe)), () => {
		!p() && U(oe) && fe();
	}), z(() => G(p()), () => {
		p(), ge();
	}), In(), qi();
	var xe = Hs(), Se = I(xe);
	{
		let e = /* @__PURE__ */ M(() => (G(d()), W(() => `task-body-${d().id}`)));
		Eo(Se, {
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
				var n = Fs(), i = L(n), a = (e) => {
					var t = Ds();
					mt(t), B(() => Fi(t, (G(d()), W(() => d().summary)))), K("input", t, (e) => h()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), J(e, t);
				}, o = (e) => {
					var t = Os();
					Yo(I(t), {
						get text() {
							return G(d()), W(() => d().summary);
						},
						lines: 2,
						emphasis: !0
					}), j(t), J(e, t);
				};
				X(i, (e) => {
					p() ? e(a) : e(o, -1);
				});
				var s = R(i, 2);
				{
					let e = /* @__PURE__ */ M(() => (G(d()), W(() => d().developer ?? null)));
					Ho(s, { get developer() {
						return U(e);
					} });
				}
				var c = R(s, 2), l = I(c);
				si(l, 1, () => U(r), (e) => e.status, (e, t) => {
					var n = Vr(), r = L(n), i = (e) => {
						var n = As(), r = I(n), i = I(r, !0);
						j(r);
						var a = R(r, 2);
						si(a, 7, () => (U(t), U(O), W(() => U(t).status === "done" && !U(O) ? U(t).items.slice(0, 1) : U(t).items)), (e) => e.id, (e, n, r) => {
							{
								let i = /* @__PURE__ */ M(() => (G(_()), U(n), W(() => _().get(U(n).id) ?? []))), a = /* @__PURE__ */ M(() => (G(C()), U(t), G(U(r)), U(n), G(ne()), W(() => C() && U(t).status === "planned" && U(r) === 0 || U(n).id === ne()))), o = /* @__PURE__ */ M(() => (U(n), G(ne()), W(() => U(n).id === ne()))), s = /* @__PURE__ */ M(() => (G(p()), U(t), U(n), G(re()), W(() => !p() && U(t).status === "planned" && U(n).id && !U(n).legacy ? re() : null))), c = /* @__PURE__ */ M(() => p() ? null : te()), l = /* @__PURE__ */ M(() => (G(p()), G(ee()), U(t), U(n), U(pe), U(me), U(he), W(() => (p() || ee()) && U(t).status === "planned" && U(n).id && !U(n).legacy ? ye(U(n), U(t).items, U(pe), U(me), U(he)) : null)));
								ys(e, {
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
										return ae;
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
									get isNext() {
										return U(o);
									},
									get onSetNext() {
										return U(s);
									},
									get scopeId() {
										return w();
									},
									get selection() {
										return U(c);
									},
									get reorder() {
										return U(l);
									}
								});
							}
						}), j(a);
						var o = R(a, 2), s = (e) => {
							var n = ks(), r = I(n), i = I(r);
							j(r);
							var a = R(r);
							j(n), B(() => {
								Q(n, "aria-expanded", U(O)), Q(n, "aria-controls", (G(d()), U(t), W(() => `task-${d().id}-${U(t).field}`))), Q(i, "d", U(O) ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"), Y(a, ` ${U(O), U(t), W(() => U(O) ? "收合" : `顯示更多（${U(t).items.length - 1}項）`) ?? ""}`);
							}), K("click", n, () => F(O, !U(O))), J(e, n);
						};
						X(o, (e) => {
							U(t), W(() => U(t).status === "done" && U(t).items.length > 1) && e(s);
						}), j(n), B(() => {
							Z(n, 1, (U(t), W(() => `detail-section ${U(t).className}`))), Y(i, (U(t), W(() => U(t).title))), Q(a, "id", (G(d()), U(t), W(() => `task-${d().id}-${U(t).field}`)));
						}), J(e, n);
					};
					X(r, (e) => {
						U(t), G(p()), W(() => U(t).items.length || p()) && e(i);
					}), J(e, n);
				});
				var u = R(l, 2), f = I(u), g = (e) => {
					var t = Ps(), n = I(t), r = (e) => {
						var t = Ms(), n = I(t);
						Pi(n);
						var r = R(n, 2);
						si(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = js(), r = I(n, !0);
							j(n);
							var i = {};
							B((e) => {
								Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}, [() => (G(m()), U(t), W(() => m().format(U(t).value)))]), J(e, n);
						}), j(r);
						var i = R(r, 2), a = R(i, 2), o = R(a, 2), s = I(o, !0);
						j(o), j(t), B(() => {
							Q(o, "hidden", !U(le)), Y(s, U(le));
						}), K("keydown", n, (e) => {
							e.key === "Enter" && be(), e.key === "Escape" && fe();
						}), Bi(n, () => U(se), (e) => F(se, e)), Oi(r, () => U(ce), (e) => F(ce, e)), K("click", i, be), K("click", a, fe), J(e, t);
					}, i = (e) => {
						var t = Ns();
						B(() => Q(t, "aria-label", (G(d()), W(() => `在「${d().title}」新增子項目`)))), K("click", t, () => {
							F(oe, !0);
						}), J(e, t);
					};
					X(n, (e) => {
						U(oe) ? e(r) : e(i, -1);
					}), j(t), J(e, t);
				};
				X(f, (e) => {
					p() && e(g);
				}), j(u), j(c), J(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = Vs(), r = I(n), i = I(r), o = (e) => {
						var t = Is(), n = I(t);
						si(n, 5, () => ae, (e) => e.value, (e, t) => {
							var n = js(), r = I(n, !0);
							j(n);
							var i = {};
							B(() => {
								Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}), J(e, n);
						}), j(n);
						var r = R(n, 2);
						si(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = js(), r = I(n, !0);
							j(n);
							var i = {};
							B((e) => {
								Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}, [() => (G(m()), U(t), W(() => m().format(U(t).value)))]), J(e, n);
						}), j(r), j(t), B(() => {
							Q(n, "aria-label", (G(d()), W(() => `${d().title} 狀態`))), Q(r, "aria-label", (G(d()), W(() => `${d().title} 優先級`)));
						}), K("change", n, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "status",
							value: U(ue)
						})), Oi(n, () => U(ue), (e) => F(ue, e)), K("change", r, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(U(de))
						})), Oi(r, () => U(de), (e) => F(de, e)), J(e, t);
					};
					X(i, (e) => {
						p() && e(o);
					});
					var s = R(i, 2), c = I(s), l = (e) => {
						var t = Ls();
						Pi(t), B(() => {
							Q(t, "id", (G(d()), W(() => `task-${d().id}-title`))), Fi(t, (G(d()), W(() => d().title)));
						}), K("input", t, (e) => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), J(e, t);
					}, u = (e) => {
						var t = Rs(), n = L(t);
						let r;
						var i = I(n, !0);
						j(n);
						var a = R(n, 2), o = I(a, !0);
						j(a), B(() => {
							r = Z(n, 1, "task-id-copy", null, r, {
								"is-done": U(E),
								"is-copied": U(E) === "已複製"
							}), Q(n, "aria-label", (U(E), G(d()), W(() => U(E) || `複製「${d().title}」的卡片 ID`))), Q(n, "title", (U(E), G(d()), W(() => U(E) || d().id))), Y(i, U(E) === "已複製" ? "✓" : U(E) ? "✕" : "⧉"), Q(a, "id", (G(d()), W(() => `task-${d().id}-title`))), Y(o, (G(d()), W(() => d().title)));
						}), K("click", n, D), J(e, t);
					};
					X(c, (e) => {
						p() ? e(l) : e(u, -1);
					}), j(s);
					var g = R(s, 2), _ = (e) => {
						var t = Bs();
						si(t, 5, S, (e) => e.id, (e, t) => {
							var n = zs(), r = I(n, !0);
							j(n), B(() => {
								Z(n, 1, (U(t), W(() => `task-module-total task-module-total-${U(t).id}`))), Y(r, (U(t), W(() => U(t).label)));
							}), J(e, n);
						}), j(t), J(e, t);
					};
					X(g, (e) => {
						G(S()), W(() => S().length) && e(_);
					}), j(r);
					var v = R(r, 2), y = I(v), b = I(y);
					j(y);
					var x = R(y, 2), C = I(x, !0);
					j(x);
					var w = R(x, 2), ee = I(w, !0);
					j(w), j(v), j(n), B(() => {
						Q(y, "aria-label", (G(f()), W(() => `子項目完成 ${f().completed}，共 ${f().total}`))), Y(b, `${G(f()), W(() => f().completed) ?? ""} / ${G(f()), W(() => f().total) ?? ""}`), Z(x, 1, (U(a), W(() => `status-badge status-${U(a).tone}`))), Y(C, (U(a), W(() => U(a).label))), Y(ee, (G(d()), W(() => d().id)));
					}), J(e, n);
				}
			}
		});
	}
	j(xe), B(() => {
		Z(xe, 1, (U(i), W(() => `task-card editor-task-card priority-${U(i)?.tone ?? "unspecified"}`))), Q(xe, "aria-labelledby", (G(d()), W(() => `task-${d().id}-title`)));
	}), J(e, xe), Je();
}
jr([
	"input",
	"click",
	"keydown",
	"change"
]);
//#endregion
//#region viewer/assets/icon-choice.js
function Ws(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function Gs(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var Ks = /* @__PURE__ */ q("<button type=\"button\" tabindex=\"-1\"><!></button>"), qs = /* @__PURE__ */ q("<div role=\"group\"></div>"), Js = /* @__PURE__ */ q("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Ys(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P(), h = /* @__PURE__ */ P(!1), g = /* @__PURE__ */ P(!1), _ = /* @__PURE__ */ P(!1), v = /* @__PURE__ */ P(null), y = /* @__PURE__ */ P(0), b = /* @__PURE__ */ P(0), x = /* @__PURE__ */ P(!1), S = /* @__PURE__ */ P(null), C = 0;
	function w(e = !1) {
		clearTimeout(U(m)), C++, U(S) !== null && U(f)?.hasPointerCapture(U(S)) && U(f).releasePointerCapture(U(S)), F(S, null), F(h, !1), F(g, !1), F(v, null), F(x, !1), e && U(f)?.focus();
	}
	function ee(e) {
		w(!0), u()(e);
	}
	async function T(e = !1) {
		if (!U(r).length) return;
		F(h, !0), F(x, !1);
		let t = ++C;
		if (await Sr(), !U(h) || t !== C || !U(p)) return;
		let n = U(f).getBoundingClientRect(), i = U(p).getBoundingClientRect(), o = [...U(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (F(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), F(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (F(y, n.right + 4), U(y) + i.width > window.innerWidth - 4 && F(y, n.left - i.width - 4), F(b, n.top + (n.height - i.height) / 2)) : (F(y, n.left + (n.width - i.width) / 2), F(b, n.bottom + 4), U(b) + i.height > window.innerHeight - 4 && F(b, n.top - i.height - 4)), F(y, Math.max(4, Math.min(U(y), window.innerWidth - i.width - 4))), F(b, Math.max(4, Math.min(U(b), window.innerHeight - i.height - 4))), F(x, !0), await Sr(), e && U(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && U(p)?.contains(t) ? t.dataset.choice : null;
	}
	function ne(e) {
		if (clearTimeout(U(m)), U(S) !== null) {
			if (U(g)) {
				let t = te(e);
				F(_, !0), t === null ? w(!0) : ee(U(r).find((e) => String(e.id) === t).id);
			} else {
				let t = U(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (F(_, !0), w(!0));
			}
			F(S, null);
		}
	}
	function re(e) {
		if (["Enter", " "].includes(e.key) && U(S) === null && F(_, !1), e.key === "Tab" && U(h)) {
			w(!0);
			return;
		}
		if (e.key === "Escape") {
			(U(h) || U(S) !== null) && (e.preventDefault(), F(_, !0), w(!0));
			return;
		}
		let t = c() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
		if (s() === "cycle" || ![
			...t,
			"Home",
			"End"
		].includes(e.key)) return;
		if (e.preventDefault(), !U(h)) {
			T(!0);
			return;
		}
		let n = [...U(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function E() {
		U(S) !== null && F(_, !0), w(U(d)?.contains(document.activeElement));
	}
	$r(() => clearTimeout(U(m))), z(() => (G(i()), G(a())), () => {
		F(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), z(() => (G(i()), G(a()), G(l())), () => {
		F(r, Gs(i(), a(), l()));
	}), In(), qi();
	var ie = Js();
	Ar("pointerdown", pn, (e) => {
		U(d)?.contains(e.target) || w();
	}), Ar("resize", pn, E), Ar("blur", pn, E), Ar("scroll", mn, (e) => {
		U(p)?.contains(e.target) || E();
	}, !0);
	var D = I(ie);
	let O;
	pi(I(D), t, "icon", { get item() {
		return U(n);
	} }, null), j(D), Ki(D, (e) => F(f, e), () => U(f));
	var ae = R(D, 2), oe = (e) => {
		var n = qs();
		let i, s;
		si(n, 5, () => U(r), (e) => e.id, (e, n) => {
			var r = Ks();
			let i;
			pi(I(r), t, "icon", { get item() {
				return U(n);
			} }, null), j(r), B((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (U(n), W(() => U(n).id))), Q(r, "aria-label", (U(n), W(() => U(n).label))), Q(r, "title", (U(n), W(() => U(n).label))), Q(r, "aria-pressed", (U(n), G(a()), W(() => U(n).kind === "action" ? void 0 : U(n).id === a())));
			}, [() => ({ "icon-choice-hover": U(v) === String(U(n).id) })]), K("keydown", r, re), K("click", r, () => ee(U(n).id)), J(e, r);
		}), j(n), Ki(n, (e) => F(p, e), () => U(p)), B(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = Ti(n, "", s, {
				left: `${U(y)}px`,
				top: `${U(b)}px`,
				visibility: U(x) ? "visible" : "hidden"
			});
		}), J(e, n);
	};
	X(ae, (e) => {
		U(h) && e(oe);
	}), j(ie), Ki(ie, (e) => F(d, e), () => U(d)), B(() => {
		Q(ie, "aria-label", o()), Q(D, "aria-label", (G(o()), U(n), W(() => `${o()}：${U(n)?.label ?? ""}`))), Q(D, "aria-expanded", s() === "cycle" ? void 0 : U(h)), Q(D, "title", (G(o()), U(n), G(s()), W(() => `${o()}：${U(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), D.disabled = !U(n), O = Ti(D, "", O, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), K("focusout", ie, (e) => {
		U(d).contains(e.relatedTarget) || w();
	}), K("keydown", D, re), K("pointerdown", D, (e) => {
		e.button === 0 && (F(_, !1), !(s() === "cycle" || U(h)) && (F(S, e.pointerId), U(f).setPointerCapture(U(S)), clearTimeout(U(m)), F(m, setTimeout(() => {
			F(g, !0), T();
		}, 300))));
	}), K("pointermove", D, (e) => {
		U(g) && F(v, te(e));
	}), K("pointerup", D, ne), Ar("pointercancel", D, E), K("click", D, () => {
		if (U(_)) {
			F(_, !1);
			return;
		}
		if (U(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") T(!0);
		else {
			let e = Ws(i(), a());
			e !== void 0 && u()(e);
		}
	}), J(e, ie), Je();
}
jr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var Xs = /* @__PURE__ */ zr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function Zs(e, t) {
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
	Ys(e, {
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
			let n = /* @__PURE__ */ M(() => t.item);
			var r = Vr(), i = L(r), a = (e) => {
				J(e, Xs());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ M(() => (G(U(n)), W(() => U(n)?.id === "closed"))), r = /* @__PURE__ */ M(() => (G(U(n)), W(() => U(n)?.id === "disabled")));
					Co(e, {
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
function Qs(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function $s(e, t, n) {
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
function ec(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function tc(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function nc(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function rc(e, t, n, r = []) {
	let i = n === "free" ? ic(e, t) : n === "reverse" ? [...e].reverse() : e;
	if (!r.length) return i;
	let a = new Map(e.map((e) => [e.id, e])), o = new Set(r);
	return [...o].filter((e) => a.has(e)).map((e) => a.get(e)).concat(i.filter((e) => !o.has(e.id)));
}
function ic(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function ac(e, t, n, r, i, a) {
	let o = ec(t, e), s = new Set(n), c = tc(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var oc = /* @__PURE__ */ zr("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), sc = /* @__PURE__ */ zr("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), cc = /* @__PURE__ */ zr("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), lc = /* @__PURE__ */ q("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), uc = /* @__PURE__ */ q("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), dc = /* @__PURE__ */ q("<p class=\"card-list-hidden\"><button type=\"button\" class=\"card-list-hidden-link\"> </button></p>"), fc = /* @__PURE__ */ q("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div> <!>", 1);
function pc(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ P(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null), f = $(t, "nextId", 8, null), p = $(t, "hiddenCount", 8, 0), m = $(t, "onShowHidden", 8, null);
	function h(e = o()) {
		return rc(e, U(re), U(b), l() ? U(g) : []).map((e) => e.id);
	}
	let g = /* @__PURE__ */ P([]), _ = null, v = $(t, "expanded", 8, !0), y = $(t, "onToggleAll", 8, () => {}), b = /* @__PURE__ */ P("forward"), x = [
		"forward",
		"reverse",
		"free"
	], S = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, C = /* @__PURE__ */ P("disabled"), w = /* @__PURE__ */ P([]);
	function ee() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: U(C),
				hiddenIds: U(w)
			}));
		} catch {}
	}
	function T(e) {
		let t = $s(U(C), U(w), e);
		F(C, t.mode), F(w, t.hiddenIds), he(), ee();
	}
	function te(e, t) {
		F(w, t ? U(w).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...U(w), e])]), he(), ee();
	}
	function ne(e) {
		U(C) === "closed" && F(C, "enabled"), te(e, !0);
	}
	let re = /* @__PURE__ */ P(null), E = /* @__PURE__ */ P(null), ie = /* @__PURE__ */ P(null), D = /* @__PURE__ */ P(null), O = /* @__PURE__ */ P(null), ae = /* @__PURE__ */ P(), oe = /* @__PURE__ */ P("");
	function se(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (_ !== i) {
			if (_ = i, !n.includes(e)) {
				F(oe, `找不到卡片 ID：${e}`);
				return;
			}
			F(g, nc(U(g), e)), ne(e), ce();
		}
	}
	function ce() {
		if (!c()) {
			F(oe, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(U(g))), F(oe, "已記住本機釘選");
		} catch {
			F(oe, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function le(e) {
		he(), F(g, U(g).includes(e) ? U(g).filter((t) => t !== e) : nc(U(g), e)), ce();
	}
	function ue(e) {
		if (_ = null, F(g, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			F(g, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (F(C, "disabled"), F(w, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			F(C, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), F(w, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (F(E, null), F(ie, null), F(D, null), F(O, null), !e) {
			F(re, null), F(b, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			F(re, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			F(b, x.includes(n) ? n : U(re) ? "free" : "forward");
		} catch {
			F(re, null), F(b, "forward");
		}
	}
	function de(e) {
		if (F(re, e), !c()) {
			F(oe, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), F(oe, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			F(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function fe(e) {
		if (he(), F(b, e), F(oe, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, U(b));
		} catch {
			F(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function pe(e, t, n) {
		U(b) === "free" && (l() && (U(g).includes(e) || U(g).includes(t)) || e !== t && (de(ac(s(), U(re), U(r).map((e) => e.id), e, t, n)), F(E, e), await Sr(), [...U(ae).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function me(e, t) {
		let n = U(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = U(r)[n + t];
		i && pe(e, i.id, t > 0);
	}
	function he() {
		F(ie, null), F(D, null), F(O, null);
	}
	function ge(e, t) {
		if (l() && U(g).includes(e.id) || U(D) === null || U(D) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		F(O, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	z(() => U(C), () => {
		F(n, U(C) === "enabled");
	}), z(() => (G(o()), U(re), U(b), G(l()), U(g), G(d())), () => {
		F(i, ic(rc(o(), U(re), U(b), l() ? U(g) : []), d()));
	}), z(() => (U(i), U(C), U(w), G(l()), U(g)), () => {
		F(r, U(i).filter((e) => Qs(e.id, U(C), U(w)) && !(l() && U(g).includes(e.id))));
	}), z(() => G(c()), () => {
		ue(c());
	}), z(() => (U(i), U(C), U(w)), () => {
		F(a, U(i).find((e) => Qs(e.id, U(C), U(w)))?.id ?? null);
	}), z(() => (G(u()), G(c()), G(s()), G(l())), () => {
		se(u(), c(), s(), l());
	}), In();
	var _e = {
		orderedIds: h,
		revealCard: ne
	};
	qi();
	var ve = fc(), ye = L(ve), be = I(ye);
	pi(R(I(be), 2), t, "filters", {}, null), j(be);
	var xe = R(be, 2), Se = I(xe), Ce = I(Se), we = I(Ce);
	j(Ce), j(Se);
	var Te = R(Se, 2);
	{
		let e = /* @__PURE__ */ M(() => W(() => x.map((e) => ({
			id: e,
			label: S[e]
		}))));
		Ys(Te, {
			get items() {
				return U(e);
			},
			get value() {
				return U(b);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: fe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ M(() => t.item);
				var r = cc(), i = I(r), a = (e) => {
					J(e, oc());
				}, o = (e) => {
					var t = sc(), r = L(t), i = R(r);
					B(() => {
						Q(r, "d", (G(U(n)), W(() => U(n).id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"))), Q(i, "d", (G(U(n)), W(() => U(n).id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10")));
					}), J(e, t);
				};
				X(i, (e) => {
					G(U(n)), W(() => U(n).id === "free") ? e(a) : e(o, -1);
				}), j(r), J(e, r);
			} }
		});
	}
	var Ee = R(Te, 2);
	Zs(Ee, {
		get mode() {
			return U(C);
		},
		onChoose: T
	});
	var De = R(Ee, 2), Oe = I(De, !0);
	j(De), pi(R(De, 2), t, "tools", {}, null), j(xe), j(ye);
	var ke = R(ye, 2);
	si(ke, 5, () => U(i), (e) => e.id, (e, r) => {
		var i = uc();
		let o;
		var s = I(i), c = (e) => {
			var t = lc();
			let n;
			var i = I(t), a = I(i);
			j(i), j(t), B((e, r, i, o, s) => {
				n = Z(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({
					"is-pinned": U(g).includes(U(r).id),
					"is-next": f() !== null && U(r).id === f()
				}),
				() => (U(g), U(r), W(() => U(g).includes(U(r).id) ? `取消釘選：${U(r).title}` : `釘選置頂：${U(r).title}`)),
				() => (U(g), U(r), W(() => U(g).includes(U(r).id))),
				() => (U(g), U(r), W(() => U(g).includes(U(r).id) ? "取消釘選" : "釘選置頂")),
				() => (U(g), U(r), G(f()), W(() => U(g).includes(U(r).id) || f() !== null && U(r).id === f() ? "currentColor" : "none"))
			]), K("click", t, () => le(U(r).id)), J(e, t);
		};
		X(s, (e) => {
			l() && e(c);
		});
		var u = R(s, 2);
		{
			let e = /* @__PURE__ */ M(() => (U(w), U(r), W(() => !U(w).includes(U(r).id))));
			pi(u, t, "default", {
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
				onVisibleChange: (e) => te(U(r).id, e)
			}, null);
		}
		j(i), B((e) => {
			Q(i, "hidden", e), o = Z(i, 1, "arrangeable-card", null, o, {
				"card-selected": U(E) === U(r).id,
				"card-drop-before": U(O)?.id === U(r).id && !U(O).after,
				"card-drop-after": U(O)?.id === U(r).id && U(O).after
			}), Q(i, "aria-label", (U(r), U(E), W(() => `${U(r).title}${U(E) === U(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (U(r), W(() => U(r).id))), Q(i, "draggable", (U(b), U(ie), U(r), W(() => U(b) === "free" && U(ie) === U(r).id)));
		}, [() => (G(Qs), U(r), U(C), U(w), W(() => !Qs(U(r).id, U(C), U(w))))]), K("pointerdown", i, (e) => {
			F(ie, null), e.button === 0 && (F(E, U(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (U(b) !== "free" || e.pointerType !== "mouse" || l() && U(g).includes(U(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || F(ie, U(r).id)));
		}), K("focusin", i, () => {
			F(E, U(r).id);
		}), K("input", i, () => {
			F(E, U(r).id);
		}), K("pointerup", i, () => {
			F(ie, null);
		}), K("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), F(E, U(r).id)) : e.key === "Escape" && F(E, null), U(b) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), me(U(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Ar("dragstart", i, (e) => {
			U(b) === "free" && U(ie) === U(r).id && e.target === e.currentTarget && (F(D, U(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(U(r).id)));
		}), Ar("dragend", i, he), Ar("dragover", i, (e) => ge(U(r), e)), Ar("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || F(O, null);
		}), Ar("drop", i, (e) => {
			U(D) !== null && U(O)?.id === U(r).id && (e.preventDefault(), pe(U(D), U(r).id, U(O).after), he());
		}), J(e, i);
	}), j(ke), Ki(ke, (e) => F(ae, e), () => U(ae));
	var Ae = R(ke, 2), je = (e) => {
		var t = dc(), n = I(t), r = I(n);
		j(n), j(t), B(() => Y(r, `…顯示隱藏項目(${p() ?? ""})`)), K("click", n, function(...e) {
			m()?.apply(this, e);
		}), J(e, t);
	};
	return X(Ae, (e) => {
		p() > 0 && m() && e(je);
	}), B(() => {
		Q(Se, "aria-label", v() ? "全部收合" : "全部展開"), Q(Se, "title", v() ? "全部收合" : "全部展開"), Q(we, "d", v() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Y(Oe, U(oe));
	}), K("click", Se, () => y()(!v())), J(e, ve), Wi(t, "orderedIds", h), Wi(t, "revealCard", ne), Je(_e);
}
jr([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var mc = /* @__PURE__ */ q("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), hc = /* @__PURE__ */ q("<div class=\"task-summary\"><!></div> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), gc = /* @__PURE__ */ q("<a class=\"pointer-card-title-link\"> </a>"), _c = /* @__PURE__ */ q("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), vc = /* @__PURE__ */ q("<strong class=\"task-fraction\"> </strong>"), yc = /* @__PURE__ */ q("<span> </span>"), bc = /* @__PURE__ */ q("<span role=\"status\">讀取目標報告中…</span>"), xc = /* @__PURE__ */ q("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), Sc = /* @__PURE__ */ q("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!> <!></div></header>"), Cc = /* @__PURE__ */ q("<article><!></article>");
function wc(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = $(t, "visibilityEnabled", 8, !1), a = $(t, "visible", 8, !0), o = $(t, "onVisibleChange", 8, () => {}), s = $(t, "expanded", 8, !0), c = $(t, "onToggle", 8, () => {}), l = $(t, "task", 8), u = $(t, "state", 24, () => ({ status: "loading" })), d = {
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
	z(() => G(u()), () => {
		F(n, u().status === "ready" ? u().card : null);
	}), z(() => U(n), () => {
		F(r, U(n) ? d[U(n).status] ?? {
			label: U(n).status,
			tone: "muted"
		} : null);
	}), In(), qi();
	var p = Cc(), m = I(p);
	{
		let e = /* @__PURE__ */ M(() => (G(l()), W(() => `task-body-${l().id}`)));
		Eo(m, {
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
				var r = Vr(), i = L(r), a = (e) => {
					var t = hc(), r = L(t);
					Yo(I(r), {
						get text() {
							return U(n), W(() => U(n).summary);
						},
						emphasis: !0
					}), j(r);
					var i = R(r, 2), a = I(i);
					j(i);
					var o = R(i, 2);
					si(o, 5, () => (U(n), W(() => U(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ M(() => (U(t), W(() => f(U(t).status))));
						var r = mc(), i = I(r), a = I(i, !0);
						j(i);
						var o = R(i, 2), s = I(o, !0);
						j(o), j(r), B(() => {
							Y(a, (U(t), W(() => U(t).title))), Z(o, 1, (G(U(n)), W(() => `status-badge status-${U(n).tone}`))), Y(s, (G(U(n)), W(() => U(n).label)));
						}), J(e, r);
					}), j(o), B(() => {
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
					var i = Sc(), a = I(i), o = I(a), s = I(o), c = I(s), d = (e) => {
						var t = gc(), n = I(t, !0);
						j(t), B(() => {
							Q(t, "href", (G(u()), W(() => u().openHref))), Y(n, (G(l()), W(() => l().title)));
						}), J(e, t);
					}, f = (e) => {
						var t = Br();
						B(() => Y(t, (G(l()), W(() => l().title)))), J(e, t);
					};
					X(c, (e) => {
						G(u()), W(() => u().openHref) ? e(d) : e(f, -1);
					}), j(s), j(o);
					var p = R(o, 2), m = (e) => {
						var t = _c();
						B(() => Q(t, "href", (G(u()), W(() => u().openHref)))), J(e, t);
					};
					X(p, (e) => {
						G(u()), W(() => u().openHref) && e(m);
					}), j(a);
					var h = R(a, 2), g = I(h), _ = (e) => {
						var t = vc(), r = I(t);
						j(t), B(() => Y(r, `${U(n), W(() => U(n).progress.completed) ?? ""} / ${U(n), W(() => U(n).progress.total) ?? ""}`)), J(e, t);
					};
					X(g, (e) => {
						U(n) && e(_);
					});
					var v = R(g, 2), y = (e) => {
						var t = yc(), n = I(t, !0);
						j(t), B(() => {
							Z(t, 1, (U(r), W(() => `status-badge status-${U(r).tone}`))), Y(n, (U(r), W(() => U(r).label)));
						}), J(e, t);
					};
					X(v, (e) => {
						U(r) && e(y);
					});
					var b = R(v, 2), x = (e) => {
						J(e, bc());
					};
					X(b, (e) => {
						G(u()), W(() => u().status === "loading") && e(x);
					});
					var S = R(b, 2), C = (e) => {
						var t = xc(), n = I(t, !0);
						j(t), B(() => Y(n, (G(u()), W(() => u().message)))), J(e, t);
					};
					X(S, (e) => {
						G(u()), W(() => u().status === "error") && e(C);
					}), j(h), j(i), B(() => Q(s, "id", (G(l()), W(() => `task-${l().id}-title`)))), J(e, i);
				}
			}
		});
	}
	j(p), B(() => {
		Z(p, 1, (U(r), W(() => `task-card pointer-card ${U(r) ? `status-${U(r).tone}` : ""}`))), Q(p, "aria-labelledby", (G(l()), W(() => `task-${l().id}-title`)));
	}), J(e, p), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var Tc = /* @__PURE__ */ q("<span class=\"task-search\"><input type=\"search\" aria-label=\"搜尋任務卡名稱、摘要與子項\" placeholder=\"搜尋名稱、摘要、子項\"/> <svg class=\"task-search-icon\" viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><circle cx=\"7\" cy=\"7\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"></circle><path d=\"M10.4 10.4 14 14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg></span>"), Ec = /* @__PURE__ */ q("<p class=\"empty-state\"> </p>"), Dc = /* @__PURE__ */ q("<!> <!>", 1);
function Oc(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = $(t, "filters", 8, null), i = $(t, "tasks", 24, () => []), a = $(t, "allIds", 24, () => []), o = $(t, "cardStorageKey", 8, null), s = $(t, "requestedPin", 8, null), c = $(t, "scopeId", 8, null), l = $(t, "searchQuery", 8, ""), u = $(t, "onSearch", 8, null), d = $(t, "reorderable", 8, !1), f = $(t, "onReorder", 8, () => {}), p = $(t, "selection", 8, null), m = $(t, "progress", 24, () => ({})), h = $(t, "editing", 8, !1), g = $(t, "policy", 8), _ = $(t, "onCommand", 8, () => {}), v = $(t, "onAddItem", 8, () => {}), y = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), b = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), x = $(t, "onModuleActivate", 8, () => {}), S = $(t, "moduleOrder", 24, () => ["time"]), C = $(t, "onModuleReorder", 8, () => {}), w = $(t, "moduleTotals", 24, () => ({})), ee = $(t, "statusOrder", 24, () => ["done", "planned"]), T = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), te = $(t, "pointerCards", 24, () => ({})), ne = $(t, "nextTaskId", 8, null), re = $(t, "nextItemId", 8, null), E = $(t, "onSetNext", 8, null), ie = $(t, "hiddenCount", 8, 0), D = $(t, "onShowHidden", 8, null), O = /* @__PURE__ */ P(!0), ae = /* @__PURE__ */ P({}), oe = null;
	function se(e, t) {
		!e || oe === JSON.stringify([t, e]) || (oe = JSON.stringify([t, e]), F(ae, {
			...U(ae),
			[e]: !0
		}));
	}
	function ce(e) {
		oe = null;
		let t = _o(e);
		F(O, t.expanded), F(ae, t.overrides);
	}
	function le(e, t) {
		F(ae, {
			...U(ae),
			[e]: t
		}), vo(U(n), U(O), U(ae));
	}
	function ue(e) {
		F(O, e), F(ae, {}), vo(U(n), U(O), U(ae));
	}
	z(() => G(o()), () => {
		F(n, `taskprogress.disclosure:${o() ?? location.href}`);
	}), z(() => U(n), () => {
		ce(U(n));
	}), z(() => (G(s()), U(n)), () => {
		se(s(), U(n));
	}), In(), qi();
	var de = Dc(), fe = L(de);
	pc(fe, {
		pinEnabled: !0,
		get requestedPin() {
			return s();
		},
		get nextId() {
			return ne();
		},
		get hiddenCount() {
			return ie();
		},
		get onShowHidden() {
			return D();
		},
		get expanded() {
			return U(O);
		},
		onToggleAll: ue,
		get items() {
			return i();
		},
		get allIds() {
			return a();
		},
		get storageKey() {
			return o();
		},
		children: _e,
		$$slots: {
			default: (e, t) => {
				let n = /* @__PURE__ */ M(() => t.item), r = /* @__PURE__ */ M(() => t.lead), i = /* @__PURE__ */ M(() => t.visibilityEnabled), a = /* @__PURE__ */ M(() => t.visible), o = /* @__PURE__ */ M(() => t.onVisibleChange);
				var s = Vr(), l = L(s), u = (e) => {
					{
						let t = /* @__PURE__ */ M(() => (U(ae), G(U(n)), U(O), W(() => U(ae)[U(n).id] ?? U(O)))), r = /* @__PURE__ */ M(() => (G(te()), G(U(n)), W(() => te()[U(n).id] ?? { status: "loading" })));
						wc(e, {
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
							onToggle: (e) => le(U(n).id, e),
							get task() {
								return U(n);
							},
							get state() {
								return U(r);
							}
						});
					}
				}, T = (e) => {
					{
						let t = /* @__PURE__ */ M(() => (U(ae), G(U(n)), U(O), W(() => U(ae)[U(n).id] ?? U(O)))), s = /* @__PURE__ */ M(() => (G(y()), G(U(n)), W(() => y().get(U(n).id) ?? null))), l = /* @__PURE__ */ M(() => (G(w()), G(U(n)), W(() => w()[U(n).id] ?? [])));
						Us(e, {
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
							onToggle: (e) => le(U(n).id, e),
							get task() {
								return U(n);
							},
							get progress() {
								return G(m()), G(U(n)), W(() => m()[U(n).id]);
							},
							get editing() {
								return h();
							},
							get policy() {
								return g();
							},
							get onCommand() {
								return _();
							},
							onAddItem: (e, t) => v()(U(n).id, e, t),
							get timeTask() {
								return U(s);
							},
							get itemCapsules() {
								return b();
							},
							get onModuleActivate() {
								return x();
							},
							get moduleOrder() {
								return S();
							},
							get onModuleReorder() {
								return C();
							},
							get statusOrder() {
								return ee();
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
							},
							get selection() {
								return p();
							},
							get nextItemId() {
								return re();
							},
							get onSetNext() {
								return E();
							}
						});
					}
				};
				X(l, (e) => {
					G(U(n)), W(() => U(n).kind === "report_pointer") ? e(u) : e(T, -1);
				}), J(e, s);
			},
			filters: (e, t) => {
				var n = Vr(), i = L(n), a = (e) => {
					mo(e, Xi(r));
				};
				X(i, (e) => {
					r() && e(a);
				}), J(e, n);
			},
			tools: (e, t) => {
				var n = Vr(), r = L(n), i = (e) => {
					var t = Tc(), n = I(t);
					Pi(n), Le(2), j(t), B(() => Fi(n, l())), K("input", n, (e) => u()(e.currentTarget.value)), J(e, t);
				};
				X(r, (e) => {
					u() && e(i);
				}), J(e, n);
			}
		}
	});
	var pe = R(fe, 2), me = (e) => {
		var t = Ec(), n = I(t, !0);
		j(t), B(() => Y(n, T())), J(e, t);
	};
	X(pe, (e) => {
		G(i()), W(() => !i().length) && e(me);
	}), J(e, de), Je();
}
jr(["input"]);
//#endregion
//#region viewer/assets/theme-model.js
var kc = [
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
], Ac = Object.freeze({
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
var jc = /^#[0-9a-f]{6}$/i;
function Mc(e) {
	return typeof e == "string" && jc.test(e);
}
function Nc(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Ac[n], i = { base: n };
	for (let e of kc) {
		let n = t[e.key];
		i[e.key] = Mc(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Pc(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Fc(e, t) {
	if (!Mc(e) || !Mc(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Pc(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Ic(e) {
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
	].filter(([, e, t]) => Fc(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Lc = /* @__PURE__ */ q("<option> </option>"), Rc = /* @__PURE__ */ q("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), zc = /* @__PURE__ */ q("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), Bc = /* @__PURE__ */ q("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Vc(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ P(), a = $(t, "mode", 8, "system"), o = $(t, "custom", 8, null), s = $(t, "systemScheme", 8, "light"), c = $(t, "onModeChange", 8, () => {}), l = $(t, "onApplyCustom", 8, () => {}), u = [
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ P(!1), p = /* @__PURE__ */ P([]), m = /* @__PURE__ */ P(a()), h = /* @__PURE__ */ P(o()?.base ?? s()), g = /* @__PURE__ */ P(v(Nc(U(h)))), _ = /* @__PURE__ */ P({ ...U(g) });
	function v(e) {
		return Object.fromEntries(kc.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		F(h, e.base), F(g, v(e)), F(_, { ...U(g) });
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
		y(o() ? Nc(o().base, o()) : Nc(s())), F(f, !0);
	}
	function S() {
		F(f, !1);
	}
	function C(e) {
		y(Nc(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		F(g, {
			...U(g),
			[e.key]: r
		}), F(_, {
			...U(_),
			[e.key]: r
		}), U(p)[t]?.setCustomValidity("");
	}
	function ee(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), F(g, {
			...U(g),
			[e.key]: n.value
		}), r && F(_, {
			...U(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function T() {
		F(m, a()), S();
	}
	function te() {
		let e = U(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Nc(U(h), U(_))), S();
	}
	z(() => G(a()), () => {
		F(m, a());
	}), z(() => (U(h), U(_)), () => {
		F(n, Nc(U(h), U(_)));
	}), z(() => U(n), () => {
		F(r, Ic(U(n)));
	}), z(() => U(r), () => {
		F(i, U(r).length ? `注意：${U(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), In(), qi();
	var ne = Bc(), re = L(ne), E = R(I(re), 2);
	si(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = Lc(), r = I(n, !0);
		j(n);
		var i = {};
		B(() => {
			Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
		}), J(e, n);
	}), j(E), j(re), ga(R(re, 2), {
		get open() {
			return U(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: T,
		children: (e, t) => {
			var a = zc(), o = R(L(a), 2), s = R(I(o), 2), c = I(s);
			c.value = c.__value = "light";
			var l = R(c);
			l.value = l.__value = "dark", j(s);
			var u;
			Di(s), j(o);
			var d = R(o, 2);
			si(d, 7, () => kc, (e) => e.key, (e, t, r) => {
				var i = Rc(), a = I(i), o = I(a, !0);
				j(a);
				var s = R(a, 2), c = I(s);
				Pi(c);
				var l = R(c, 2);
				Pi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ki(l, (e, t) => an(p, U(p)[t] = e), (e) => U(p)?.[e], () => [U(r)]), j(s), j(i), B(() => {
					Y(o, (U(t), W(() => U(t).label))), Q(c, "aria-label", (U(t), W(() => `${U(t).label}選色器`))), Fi(c, (U(n), U(t), W(() => U(n)[U(t).key]))), Q(l, "aria-label", (U(t), W(() => `${U(t).label}十六進位色碼`))), Fi(l, (U(g), U(t), W(() => U(g)[U(t).key])));
				}), K("input", c, (e) => w(U(t), U(r), e)), K("input", l, (e) => ee(U(t), e)), J(e, i);
			}), j(d);
			var f = R(d, 2);
			let m;
			var _ = I(f, !0);
			j(f);
			var v = R(f, 2), b = I(v), x = R(b, 4), S = R(x, 2);
			j(v), B(() => {
				u !== (u = U(h)) && (s.value = (s.__value = U(h)) ?? "", Ei(s, U(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": U(r).length > 0 }), Y(_, U(i));
			}), K("change", s, C), K("click", b, () => y(Nc(U(h)))), K("click", x, T), K("click", S, te), J(e, a);
		},
		$$slots: { default: !0 }
	}), K("change", E, b), Oi(E, () => U(m), (e) => F(m, e)), J(e, ne), Je();
}
jr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var Hc = /* @__PURE__ */ q("<span> </span>"), Uc = /* @__PURE__ */ q("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), Wc = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Gc = /* @__PURE__ */ q("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function Kc(e, t) {
	qe(t, !1);
	let n = $(t, "item", 8), r = $(t, "activeEstimate", 8, null), i = $(t, "onApply", 8, () => ({ error: "" })), a = /* @__PURE__ */ P(r()?.likely_minutes ? String(r().likely_minutes / 60) : n().unset ? "" : String(n().likelyMinutes / 60)), o = /* @__PURE__ */ P(r()?.human_note ?? ""), s = /* @__PURE__ */ P(!!(r()?.human_confirmed ?? n().humanConfirmed)), c = /* @__PURE__ */ P("");
	function l() {
		let e = Number(U(a));
		if (!Number.isFinite(e) || e <= 0) {
			F(c, "工時必須大於 0。");
			return;
		}
		let t = i()({
			taskId: n().taskId,
			itemId: n().itemId,
			likelyMinutes: Math.round(e * 60),
			humanNote: U(o),
			humanConfirmed: U(s)
		});
		F(c, t?.error ?? "");
	}
	qi();
	var u = Gc(), d = I(u), f = I(d);
	si(R(I(f), 2), 1, () => (G(n()), W(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = Hc(), r = I(n, !0);
		j(n), B(() => {
			Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), j(f);
	var p = R(f, 2), m = R(I(p), 2);
	Pi(m), j(p), j(d);
	var h = R(d, 2);
	da(I(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = Uc(), i = R(I(r), 2);
			Pi(i), j(r), B(() => Q(i, "aria-label", (G(n()), W(() => `「${n().title}」人工依據`)))), Bi(i, () => U(o), (e) => F(o, e)), J(e, r);
		},
		$$slots: { default: !0 }
	}), j(h);
	var g = R(h, 2), _ = I(g);
	Pi(_), Le(2), j(g);
	var v = R(g, 4), y = I(v);
	j(v);
	var b = R(v, 2), x = (e) => {
		var t = Wc(), n = I(t, !0);
		j(t), B(() => Y(n, U(c))), J(e, t);
	};
	X(b, (e) => {
		U(c) && e(x);
	}), j(u), B(() => {
		Q(m, "aria-label", (G(n()), W(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (G(n()), W(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (G(n()), W(() => `套用「${n().title}」人工估算草稿`)));
	}), Ar("submit", u, (e) => {
		e.preventDefault(), l();
	}), Bi(m, () => U(a), (e) => F(a, e)), Vi(_, () => U(s), (e) => F(s, e)), J(e, u), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var qc = /* @__PURE__ */ q("<label><input type=\"checkbox\"/> <span> </span></label>"), Jc = /* @__PURE__ */ q("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), Yc = /* @__PURE__ */ q("<div class=\"spike-exception-list\"></div>"), Xc = /* @__PURE__ */ q("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), Zc = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Qc = /* @__PURE__ */ q("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function $c(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ P(), r = $(t, "config", 8), i = $(t, "onApply", 8), a = $(t, "onPreview", 8), o = $(t, "onPendingChange", 8, () => {}), s = [
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
	], c = r().standard_allocation, l = r()?.project?.delivery_at ?? "", u = /* @__PURE__ */ P(l.slice(0, 16)), d = /* @__PURE__ */ P(""), f = /* @__PURE__ */ P(String(c.sleep_minutes_per_day / 60)), p = /* @__PURE__ */ P(String(c.life_minutes_per_day / 60)), m = /* @__PURE__ */ P(String(c.other_unavailable_minutes_per_day / 60)), h = /* @__PURE__ */ P([...c.working_weekdays]), g = 1, _ = /* @__PURE__ */ P((r().project?.capacity_exceptions ?? []).map((e) => ({
		key: g++,
		date: e.date,
		availableHours: String(e.available_minutes / 60),
		reason: e.reason ?? "",
		publicLabel: e.public_label ?? ""
	}))), v = /* @__PURE__ */ P("");
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
		F(v, ""), o()(!0);
	}
	function S(e, t) {
		F(h, t ? [.../* @__PURE__ */ new Set([...U(h), e])].sort((e, t) => e - t) : U(h).filter((t) => t !== e)), x();
	}
	function C(e, t, n) {
		F(_, U(_).map((r) => r.key === e ? {
			...r,
			[t]: n
		} : r)), x();
	}
	function w() {
		F(_, [...U(_), {
			key: g++,
			date: "",
			availableHours: "0",
			reason: "",
			publicLabel: ""
		}]), x();
	}
	function ee(e) {
		F(_, U(_).filter((t) => t.key !== e)), x();
	}
	function T() {
		if (!U(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${U(u)}:00${e ?? b(U(u), r().timezone)}`;
	}
	function te() {
		let e = i()({
			deliveryAt: T(),
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
		return F(v, e.error), e;
	}
	async function ne() {
		te().error || (o()(!1), await a()());
	}
	z(() => (U(f), U(p), U(m)), () => {
		F(n, 24 - Number(U(f)) - Number(U(p)) - Number(U(m)));
	}), In(), qi();
	var re = Qc(), E = I(re), ie = R(I(E), 6), D = I(ie);
	j(ie), j(E);
	var O = R(E, 2), ae = I(O), oe = R(I(ae), 2), se = I(oe), ce = R(I(se));
	Pi(ce), j(se);
	var le = R(se, 2), ue = R(I(le));
	Pi(ue), j(le);
	var de = R(le, 2);
	j(oe), j(ae);
	var fe = R(ae, 2), pe = I(fe), me = R(I(pe), 2);
	let he;
	var ge = I(me);
	j(me), j(pe);
	var _e = R(pe, 2), ve = I(_e), ye = R(I(ve));
	Pi(ye), j(ve);
	var be = R(ve, 2), xe = R(I(be));
	Pi(xe), j(be);
	var Se = R(be, 2), Ce = R(I(Se));
	Pi(Ce), j(Se), j(_e);
	var we = R(_e, 2);
	si(R(I(we), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = qc(), r = I(n);
		Pi(r);
		var i = R(r, 2), a = I(i);
		j(i), j(n), B((e) => {
			Ii(r, e), Y(a, `週${U(t), W(() => U(t).label) ?? ""}`);
		}, [() => (U(h), U(t), W(() => U(h).includes(U(t).value)))]), K("change", r, (e) => S(U(t).value, e.currentTarget.checked)), J(e, n);
	}), j(we), j(fe);
	var Te = R(fe, 2), Ee = I(Te), De = R(I(Ee), 2);
	j(Ee);
	var Oe = R(Ee, 2), ke = (e) => {
		var t = Yc();
		si(t, 5, () => U(_), (e) => e.key, (e, t) => {
			var n = Jc(), r = I(n), i = R(I(r));
			Pi(i), j(r);
			var a = R(r, 2), o = R(I(a));
			Pi(o), j(a);
			var s = R(a, 2), c = R(I(s));
			Pi(c), j(s);
			var l = R(s, 2);
			j(n), B(() => {
				Fi(i, (U(t), W(() => U(t).date))), Fi(o, (U(t), W(() => U(t).availableHours))), Fi(c, (U(t), W(() => U(t).publicLabel)));
			}), K("input", i, (e) => C(U(t).key, "date", e.currentTarget.value)), K("input", o, (e) => C(U(t).key, "availableHours", e.currentTarget.value)), K("input", c, (e) => C(U(t).key, "publicLabel", e.currentTarget.value)), K("click", l, () => ee(U(t).key)), J(e, n);
		}), j(t), J(e, t);
	}, Ae = (e) => {
		J(e, Xc());
	};
	X(Oe, (e) => {
		U(_), W(() => U(_).length) ? e(ke) : e(Ae, -1);
	}), j(Te);
	var je = R(Te, 2), Me = I(je), Ne = R(Me, 2), k = (e) => {
		var t = Zc(), n = I(t, !0);
		j(t), B(() => Y(n, U(v))), J(e, t);
	};
	X(Ne, (e) => {
		U(v) && e(k);
	}), j(je), j(O), j(re), B((e) => {
		Y(D, `時區：${G(r()), W(() => r().timezone) ?? ""}`), he = Z(me, 1, "", null, he, { invalid: !(U(n) > 0) }), Y(ge, `工作 ${e ?? ""} hr`);
	}, [() => (U(n), W(() => Number.isFinite(U(n)) ? U(n) : "—"))]), K("input", ce, x), Bi(ce, () => U(u), (e) => F(u, e)), K("input", ue, x), Bi(ue, () => U(d), (e) => F(d, e)), K("click", de, () => {
		F(u, ""), x();
	}), K("input", ye, x), Bi(ye, () => U(f), (e) => F(f, e)), K("input", xe, x), Bi(xe, () => U(p), (e) => F(p, e)), K("input", Ce, x), Bi(Ce, () => U(m), (e) => F(m, e)), K("click", De, w), K("click", Me, ne), J(e, re), Je();
}
jr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var el = (e, t = _, n = _) => {
	var r = sl(), i = I(r), a = I(i, !0);
	j(i);
	var o = R(i, 2), s = I(o, !0);
	j(o);
	var c = R(o, 2), l = I(c, !0);
	j(c), j(r), B((e) => {
		Z(r, 1, e), Y(a, (t(), W(() => t().label))), Y(s, (t(), W(() => t().value))), Y(l, (t(), W(() => t().note)));
	}, [() => vi((n(), W(() => `time-evaluation-node ${n()}`.trim())))]), J(e, r);
}, tl = (e, t = _) => {
	var n = ll();
	si(n, 5, t, ri, (e, t) => {
		var n = cl(), r = I(n), i = I(r), a = I(i, !0);
		j(i);
		var o = R(i), s = I(o, !0);
		j(o), j(r);
		var c = R(r, 2), l = I(c, !0);
		j(c), j(n), B(() => {
			Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
		}), J(e, n);
	}), j(n), J(e, n);
}, nl = (e, t = _) => {
	var n = ul();
	tl(R(I(n), 2), t), j(n), J(e, n);
}, rl = (e, t = _, n = _) => {
	var r = dl(), i = I(r), a = I(i, !0);
	j(i);
	var o = R(i, 2), s = I(o), c = I(s);
	el(c, () => (t(), W(() => t().engineeringLane.source)), () => ""), el(R(c, 4), () => (t(), W(() => t().engineeringLane.result)), () => "time-evaluation-result"), j(s);
	var l = R(s, 2), u = I(l);
	el(u, () => (t(), W(() => t().capacityLane.source)), () => ""), el(R(u, 4), () => (t(), W(() => t().capacityLane.result)), () => "time-evaluation-result"), j(l), j(o);
	var d = R(o, 2);
	el(R(I(d), 2), () => (t(), W(() => t().merge)), () => (t(), W(() => t().merge.className))), j(d);
	var f = R(d, 2), p = I(f);
	el(p, () => (t(), W(() => t().risk.trend)), () => ""), el(R(p, 4), () => (t(), W(() => t().risk.result)), () => (t(), W(() => t().risk.result.className))), j(f);
	var m = R(f, 2), h = I(m, !0);
	j(m), j(r), B(() => {
		Q(r, "hidden", !n()), Y(a, (t(), W(() => t().intro))), Y(h, (t(), W(() => t().note)));
	}), J(e, r);
}, il = (e, t = _, n = _) => {
	var r = ml(), i = I(r);
	ca(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = R(i, 2);
	da(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), W(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = fl(), i = L(r), a = I(i, !0);
			j(i);
			var o = R(i, 2), s = I(o, !0);
			j(o), B(() => {
				Y(a, (t(), W(() => t().explanation.text))), Y(s, (t(), W(() => t().explanation.formula)));
			}), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = R(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = pl(), i = I(r, !0);
			j(r), B(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), nl(R(o, 2), () => (t(), W(() => t().composition))), j(r), B(() => Q(r, "hidden", !n())), J(e, r);
}, al = (e, t = _, n = _) => {
	var r = _l(), i = R(I(r), 2);
	ca(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = R(i, 2);
	da(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = hl(), i = R(L(r), 2), a = I(i, !0);
			j(i), B(() => Y(a, (t(), W(() => t().formulaCode)))), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = R(a, 2), s = I(o), c = I(s, !0);
	j(s);
	var l = R(s, 2), u = I(l), d = (e) => {
		var n = Vr();
		si(L(n), 1, () => (t(), W(() => t().exceptions)), ri, (e, t) => {
			var n = cl(), r = I(n), i = I(r), a = I(i, !0);
			j(i);
			var o = R(i), s = I(o, !0);
			j(o), j(r);
			var c = R(r, 2), l = I(c, !0);
			j(c), j(n), B(() => {
				Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
			}), J(e, n);
		}), J(e, n);
	}, f = (e) => {
		J(e, gl());
	};
	X(u, (e) => {
		t(), W(() => t().exceptions) ? e(d) : e(f, -1);
	}), j(l), j(o), j(r), B(() => {
		Q(r, "hidden", !n()), Y(c, (t(), W(() => t().exceptionsHeading)));
	}), J(e, r);
}, ol = (e, t = _) => {
	var n = vl(), r = I(n), i = I(r, !0);
	j(r);
	var a = R(r, 2);
	ca(a, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var o = R(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = pl(), i = I(r, !0);
			j(r), B(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), nl(R(o, 2), () => (t(), W(() => t().composition))), j(n), B(() => Y(i, (t(), W(() => t().intro)))), J(e, n);
}, sl = /* @__PURE__ */ q("<div><span> </span> <strong> </strong> <small> </small></div>"), cl = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), ll = /* @__PURE__ */ q("<div class=\"time-source-list\"></div>"), ul = /* @__PURE__ */ q("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), dl = /* @__PURE__ */ q("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), fl = /* @__PURE__ */ q("<p> </p> <code class=\"time-formula\"> </code>", 1), pl = /* @__PURE__ */ q("<p> </p>"), ml = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), hl = /* @__PURE__ */ q("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), gl = /* @__PURE__ */ q("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), _l = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), vl = /* @__PURE__ */ q("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), yl = /* @__PURE__ */ q("<span> </span>"), bl = /* @__PURE__ */ q("<!> <div class=\"time-item-rationale\"><!></div>", 1), xl = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Sl = /* @__PURE__ */ q("<code class=\"time-formula\"> </code>"), Cl = /* @__PURE__ */ q("<code class=\"time-reference\"> </code>"), wl = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), Tl = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), El = /* @__PURE__ */ q("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), Dl = /* @__PURE__ */ q("<!> <!>", 1), Ol = /* @__PURE__ */ q("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), kl = /* @__PURE__ */ q("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Al = /* @__PURE__ */ q("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), jl = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), Ml = /* @__PURE__ */ q("<div class=\"time-dialog-content\"><!></div>");
function Nl(e, t) {
	qe(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ P([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await Sr(), U(g)[r]?.focus();
	}
	qi();
	{
		let t = /* @__PURE__ */ M(() => `關閉${i()}`);
		ga(e, {
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
				var n = Ml(), i = I(n), c = (e) => {
					var t = wl(), n = I(t), r = I(n), i = I(r, !0);
					j(r);
					var o = R(r, 2), c = I(o, !0);
					j(o), j(n);
					var u = R(n, 2), m = (e) => {
						var t = Vr();
						ni(L(t), () => (G(s()), G(f()), W(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ M(() => (G(s()), G(a()), W(() => ({
									...s(),
									title: a()
								}))));
								Kc(e, {
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
						var t = bl(), n = L(t);
						ma(n, {
							label: "預估工時",
							get value() {
								return G(s()), W(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Vr();
								si(L(n), 1, () => (G(s()), W(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = yl(), r = I(n, !0);
									j(n), B(() => {
										Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
									}), J(e, n);
								}), J(e, n);
							} }
						});
						var r = R(n, 2);
						da(I(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = pl(), r = I(n, !0);
								j(n), B(() => Y(r, (G(s()), W(() => s().rationale)))), J(e, n);
							},
							$$slots: { default: !0 }
						}), j(r), J(e, t);
					};
					X(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = R(u, 2), _ = I(g);
					ca(_, { get metrics() {
						return G(s()), W(() => s().technical.metrics);
					} });
					var v = R(_, 2), y = (e) => {
						var t = xl(), n = I(t), r = I(n), i = I(r, !0);
						j(r);
						var a = R(r, 2), o = I(a, !0);
						j(a), j(n);
						var c = R(n, 2), l = I(c, !0);
						j(c), j(t), B(() => {
							Y(i, (G(s()), W(() => s().technical.analysisMethod.name))), Y(o, (G(s()), W(() => s().technical.analysisMethod.note))), Y(l, (G(s()), W(() => s().technical.analysisMethod.version)));
						}), J(e, t);
					};
					X(v, (e) => {
						G(s()), W(() => s().technical.analysisMethod) && e(y);
					});
					var b = R(v, 2), x = (e) => {
						da(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = Sl(), r = I(n, !0);
								j(n), B(() => Y(r, (G(s()), W(() => s().technical.formula)))), J(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					X(b, (e) => {
						G(s()), W(() => s().technical.formula) && e(x);
					});
					var S = R(b, 2), C = (e) => {
						var t = Cl(), n = I(t, !0);
						j(t), B(() => Y(n, (G(s()), W(() => s().technical.reference)))), J(e, t);
					};
					X(S, (e) => {
						G(s()), W(() => s().technical.reference) && e(C);
					}), j(g), j(t), B(() => {
						Z(r, 1, vi((G(s()), W(() => s().confidenceClass)))), Y(i, (G(s()), W(() => s().confidenceLabel))), Y(c, (G(s()), W(() => s().toggleLabel))), Q(g, "hidden", (G(s()), W(() => !s().detailsExpanded)));
					}), K("click", o, function(...e) {
						l()?.apply(this, e);
					}), J(e, t);
				}, v = (e) => {
					var t = jl(), n = I(t), r = I(n), i = I(r, !0);
					j(r);
					var a = R(r, 2), s = I(a, !0);
					j(a), j(n);
					var c = R(n, 2), f = I(c);
					si(f, 5, () => (G(o()), W(() => o().overview)), ri, (e, t) => {
						var n = El(), r = I(n), i = I(r, !0);
						j(r);
						var a = R(r, 2), o = I(a), s = (e) => {
							var n = Tl();
							B(() => Z(n, 1, `time-risk-dot ${U(t), W(() => U(t).urgencyClassName) ?? ""}`)), J(e, n);
						};
						X(o, (e) => {
							U(t), W(() => U(t).urgencyClassName) && e(s);
						});
						var c = R(o);
						j(a), j(n), B(() => {
							Y(i, (U(t), W(() => U(t).label))), Y(c, ` ${U(t), W(() => U(t).value) ?? ""}`);
						}), J(e, n);
					}), j(f);
					var p = R(f, 2), v = I(p, !0);
					j(p), j(c);
					var y = R(c, 2), b = I(y), x = (e) => {
						var t = Vr(), n = L(t), r = (e) => {
							var t = Dl(), n = L(t);
							$c(n, {
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
							var r = R(n, 2), i = (e) => {
								Oa(e, { get preview() {
									return h();
								} });
							};
							X(r, (e) => {
								h() && e(i);
							}), J(e, t);
						}, i = (e) => {
							var t = Ol(), n = R(I(t), 4);
							j(t), K("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), J(e, t);
						};
						X(n, (e) => {
							G(m()), W(() => m().hasConfig) ? e(r) : e(i, -1);
						}), J(e, t);
					}, S = (e) => {
						var t = Al(), n = L(t);
						si(n, 7, () => (G(o()), W(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = kl(), i = I(r, !0);
							j(r), Ki(r, (e, t) => an(g, U(g)[t] = e), (e) => U(g)?.[e], () => [U(n)]), B(() => {
								Q(r, "id", (U(t), W(() => `time-${U(t).name}-tab`))), Q(r, "aria-controls", (U(t), W(() => `time-${U(t).name}-panel`))), Q(r, "aria-selected", (G(o()), U(t), W(() => o().activeTab === U(t).name))), Q(r, "tabindex", (G(o()), U(t), W(() => o().activeTab === U(t).name ? 0 : -1))), Y(i, (U(t), W(() => U(t).label)));
							}), K("click", r, () => u()(U(t).name)), K("keydown", r, (e) => _(e, U(n), o().tabs)), J(e, r);
						}), j(n);
						var r = R(n, 2);
						rl(r, () => (G(o()), W(() => o().flow)), () => (G(o()), W(() => o().activeTab === "flow")));
						var i = R(r, 2);
						il(i, () => (G(o()), W(() => o().engineering)), () => (G(o()), W(() => o().activeTab === "engineering"))), al(R(i, 2), () => (G(o()), W(() => o().capacity)), () => (G(o()), W(() => o().activeTab === "capacity"))), J(e, t);
					}, C = (e) => {
						ol(e, () => (G(o()), W(() => o().estimateOnly)));
					};
					X(b, (e) => {
						d() && m() ? e(x) : (G(o()), W(() => o().hasDeadline) ? e(S, 1) : e(C, -1));
					}), j(y), j(t), B(() => {
						Y(i, (G(o()), W(() => o().captionLabel))), Q(a, "aria-expanded", (G(o()), W(() => o().detailsExpanded))), Y(s, (G(o()), W(() => o().toggleLabel))), Y(v, (G(o()), W(() => o().updatedLabel))), Q(y, "hidden", (G(o()), W(() => !o().detailsExpanded)));
					}), K("click", a, function(...e) {
						l()?.apply(this, e);
					}), J(e, t);
				};
				X(i, (e) => {
					r() === "item" && s() ? e(c) : r() === "project" && o() && e(v, 1);
				}), j(n), J(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	Je();
}
jr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Pl = /* @__PURE__ */ q("<span class=\"time-risk-dot\"></span>"), Fl = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), Il = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>");
function Ll(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = Il(), d = I(u), f = I(d, !0);
	j(d);
	var p = R(d, 2), m = (e) => {
		J(e, Pl());
	};
	X(p, (e) => {
		s() && e(m);
	});
	var h = R(p, 2), g = (e) => {
		J(e, Fl());
	};
	X(h, (e) => {
		c() && e(g);
	}), j(u), B(() => {
		Z(u, 1, vi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), Y(f, o());
	}), K("click", u, function(...e) {
		l()?.apply(this, e);
	}), J(e, u);
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Rl = {
	"task-list": Oc,
	"status-overview": go,
	"status-filters": mo,
	"project-progress": Ka,
	"report-summary": io,
	"next-step": to,
	"mode-toggle": Pa,
	"save-bar": fo,
	"add-control": ia,
	diagnostics: Ma,
	"scope-directory": so,
	"theme-control": Vc,
	"project-module-strip": Ba,
	"time-summary-button": Ll,
	"time-dialog": Nl,
	"cost-dialog": Ca,
	"delivery-save-confirmation": Aa
}, zl = {
	id: "svelte",
	regions: Object.keys(Rl),
	mount(e, t, n) {
		let r = un({ ...n });
		return {
			component: Kr(Rl[e], {
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
		Xr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(zl);
//#endregion
