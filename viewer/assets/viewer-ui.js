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
var x = 1024, S = 2048, C = 4096, w = 8192, ee = 16384, te = 32768, ne = 1 << 25, T = 65536, re = 1 << 19, E = 1 << 20, ie = 1 << 25, D = 65536, ae = 1 << 21, oe = 1 << 22, se = 1 << 23, ce = Symbol("$state"), le = Symbol("legacy props"), ue = Symbol(""), de = Symbol("attributes"), fe = Symbol("class"), pe = Symbol("style"), me = Symbol("text"), he = Symbol("form reset"), ge = new class extends Error {
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
	return Ie(/* @__PURE__ */ Sn(k));
}
function A(e) {
	if (O) {
		if (/* @__PURE__ */ Sn(k) !== null) throw Me(), t;
		k = e;
	}
}
function Re(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ Sn(n);
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
		var i = /* @__PURE__ */ Sn(n);
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
		for (var r of n) Nn(r);
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
	if (Ze.length === 0 && !Bt) {
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
//#region node_modules/svelte/src/store/utils.js
function ct(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), _;
	let r = U(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/svelte/src/store/shared/index.js
function lt(e) {
	let t;
	return ct(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ut = !1, dt = Symbol("unmounted");
function ft(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ N(void 0),
		unsubscribe: _
	};
	if (r.store !== e && !(dt in n)) if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = _;
	else {
		var i = !0;
		r.unsubscribe = ct(e, (e) => {
			i ? r.source.v = e : P(r.source, e);
		}), i = !1;
	}
	return e && dt in n ? lt(e) : H(r.source);
}
function pt() {
	let e = {};
	function t() {
		jn(() => {
			for (var t in e) e[t].unsubscribe();
			l(e, dt, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function mt(e) {
	var t = ut;
	try {
		return ut = !1, [e(), ut];
	} finally {
		ut = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function ht(e) {
	O && /* @__PURE__ */ xn(e) !== null && Cn(e);
}
var gt = !1;
function _t() {
	gt || (gt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[he]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function vt(e) {
	var t = B, n = V;
	ir(null), ar(null);
	try {
		return e();
	} finally {
		ir(t), ar(n);
	}
}
function yt(e, t, n, r = n) {
	e.addEventListener(t, () => vt(n));
	let i = e[he];
	e[he] = i ? () => {
		i(), r(!0);
	} : () => r(!0), _t();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function bt(e) {
	let t = 0, n = rn(0), r;
	return () => {
		An() && (H(n), zn(() => (t === 0 && (r = U(() => e(() => ln(n)))), t += 1, () => {
			$e(() => {
				--t, t === 0 && (r?.(), r = void 0, ln(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var xt = T | re;
function St(e, t, n, r) {
	new Ct(e, t, n, r);
}
var Ct = class {
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
	#h = bt(() => (this.#m = rn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Bn(() => {
			if (O) {
				let e = this.#t;
				Le();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, xt), O && (this.#e = k);
	}
	#g() {
		try {
			this.#a = Vn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		$e(r), t && (this.#s = Vn(() => {
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
			t = !0, n && Ae(), this.#s !== null && Jn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Vn(() => e(this.#e)), $e(() => {
			var e = this.#c = document.createDocumentFragment(), t = bn();
			e.append(t), this.#a = this.#S(() => Vn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Jn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Vn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Qn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Vn(() => t(this.#e));
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
		ar(this.#i), ir(this.#i), qe(this.#i.ctx);
		try {
			return Kt.ensure(), e();
		} catch (e) {
			return tt(e), null;
		} finally {
			ar(t), ir(n), qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Jn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $e(() => {
			this.#d = !1, this.#m && sn(this.#m, this.#l);
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
		this.#a &&= (Gn(this.#a), null), this.#o &&= (Gn(this.#o), null), this.#s &&= (Gn(this.#s), null), O && (Ie(this.#t), Re(), Ie(ze()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Vn(() => {
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
function wt(e, t, n, r) {
	let i = Xe() ? Ot : j;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = V, c = Tt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				nt(e, s);
			}
			Et();
		}
	}
	var d = Dt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ At(e))).then(u).catch((e) => nt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), Et();
	}) : f();
}
function Tt() {
	var e = V, t = B, n = Ke, r = M;
	return function(i = !0) {
		ar(e), ir(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Et(e = !0) {
	ar(null), ir(null), qe(null), e && M?.deactivate();
}
function Dt() {
	var e = V, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ot(e) {
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
var kt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function At(e, t, r) {
	let i = V;
	i === null && be();
	var a = void 0, o = rn(n), s = !B, c = /* @__PURE__ */ new Set();
	return Rn(() => {
		var t = V, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ge && n.reject(e);
			}).finally(Et);
		} catch (e) {
			n.reject(e), Et();
		}
		var r = M;
		if (s) {
			if (t.f & 32768) var l = Dt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(kt);
			else for (let e of c.values()) e.reject(kt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== kt && (r.activate(), t ? (o.f |= se, sn(o, t)) : (o.f & 8388608 && (o.f ^= se), sn(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), jn(() => {
		for (let e of c) e.reject(kt);
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
	let t = /* @__PURE__ */ Ot(e);
	return t.equals = Ue, t;
}
function jt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Gn(t[n]);
	}
}
function Mt(e) {
	var t, r = V, i = e.parent;
	if (!tr && i !== null && e.v !== n && i.f & 24576) return je(), e.v;
	ar(i);
	try {
		e.f &= ~D, jt(e), t = yr(e);
	} finally {
		ar(r);
	}
	return t;
}
function Nt(e) {
	var t = Mt(e);
	if (!e.equals(t) && (e.wv = gr(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), Lt?.capture(e, t, !0)), e.deps === null))) {
		it(e, x);
		return;
	}
	tr || (Rt === null ? at(e) : (An() || M?.is_fork) && Rt.set(e, t));
}
function Pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && vt(() => {
		t.ac.abort(ge), t.ac = null;
	}), t.fn !== null && (t.teardown = _), xr(t, 0), Un(t));
}
function Ft(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Sr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var It = null, M = null, Lt = null, Rt = null, zt = null, Bt = !1, Vt = !1, Ht = null, Ut = null, Wt = 0, Gt = 1, Kt = class e {
	id = Gt++;
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
		It === null ? It = this : (It.#n = this, this.#t = It), It = this;
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
		this.#e = !0, Wt++ > 1e3 && (this.#x(), Jt());
		for (let e of this.#u) this.#d.delete(e), it(e, S), this.schedule(e);
		for (let e of this.#d) it(e, C), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ht = [], r = [], i = Ut = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw $t(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ht = null, Ut = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Qt(e, t);
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
		this.#r.clear(), Lt = this, Xt(r), Xt(n), Lt = null, this.#s?.resolve();
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
				a ? r.f ^= x : i & 4 ? t.push(r) : _r(r) && (i & 16 && this.#d.add(r), Sr(r));
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
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Rt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, Rt = null;
	}
	flush() {
		try {
			Vt = !0, M = this, this.#g();
		} finally {
			Wt = 0, zt = null, Ht = null, Ut = null, Vt = !1, M = null, Rt = null, tn.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(kt);
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
			!Vt && !Bt && $e(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		Rt = null;
	}
	schedule(e) {
		if (zt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ht !== null && t === V && (B === null || !(B.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? It = e : t.#t = e, this.linked = !1;
		}
	}
};
function qt(e) {
	var t = Bt;
	Bt = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (et(), M === null) return n;
			M.flush();
		}
	} finally {
		Bt = t;
	}
}
function Jt() {
	try {
		Te();
	} catch (e) {
		nt(e, zt);
	}
}
var Yt = null;
function Xt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && _r(r) && (Yt = /* @__PURE__ */ new Set(), Sr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && qn(r), Yt?.size > 0)) {
				tn.clear();
				for (let e of Yt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Yt.has(n) && (Yt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Sr(n);
					}
				}
				Yt.clear();
			}
		}
		Yt = null;
	}
}
function Zt(e) {
	M.schedule(e);
}
function Qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), it(e, x);
		for (var n = e.first; n !== null;) Qt(n, t), n = n.next;
	}
}
function $t(e) {
	it(e, x);
	for (var t = e.first; t !== null;) $t(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var en = /* @__PURE__ */ new Set(), tn = /* @__PURE__ */ new Map(), nn = !1;
function rn(e, t) {
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
function an(e, t) {
	let n = rn(e, t);
	return sr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = rn(e);
	return t || (r.equals = Ue), We && n && Ke !== null && Ke.l !== null && (Ke.l.s ??= []).push(r), r;
}
function on(e, t) {
	return P(e, U(() => H(e))), t;
}
function P(e, t, n = !1) {
	return B !== null && (!rr || B.f & 131072) && Xe() && B.f & 4325394 && (or === null || !or.has(e)) && ke(), sn(e, n ? dn(t) : t, Ut);
}
function sn(e, t, n = null) {
	if (!e.equals(t)) {
		tn.set(e, tr ? t : e.v);
		var r = Kt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Mt(t), Rt === null && at(t);
		}
		e.wv = gr(), un(e, S, n), Xe() && V !== null && V.f & 1024 && !(V.f & 96) && (ur === null ? dr([e]) : ur.push(e)), !r.is_fork && en.size > 0 && !nn && cn();
	}
	return t;
}
function cn() {
	nn = !1;
	for (let e of en) {
		e.f & 1024 && it(e, C);
		let t;
		try {
			t = _r(e);
		} catch {
			t = !0;
		}
		t && Sr(e);
	}
	en.clear();
}
function ln(e) {
	P(e, e.v + 1);
}
function un(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Xe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & S) === 0;
			if (l && it(s, t), c & 131072) en.add(s);
			else if (c & 2) {
				var u = s;
				Rt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= D), un(u, C, n));
			} else if (l) {
				var d = s;
				c & 16 && Yt !== null && Yt.add(d), n === null ? Zt(d) : n.push(d);
			}
		}
	}
}
function dn(e) {
	if (typeof e != "object" || !e || ce in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ an(0), s = null, c = mr, l = (e) => {
		if (mr === c) return e();
		var t = B, n = mr;
		ir(null), hr(c);
		var r = e();
		return ir(t), hr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ an(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && De();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ an(n.value, s);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ an(n, s));
					r.set(t, e), ln(o);
				}
			} else P(i, n), ln(o);
			return !0;
		},
		get(t, i, a) {
			if (i === ce) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ an(dn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ an(a ? dn(e[t]) : n, s)), r.set(t, i)), H(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ an(n, s)), r.set(p + "", m)) : P(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ an(void 0, s)), P(d, dn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => dn(a));
				P(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				ln(o);
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
function fn(e) {
	try {
		if (typeof e == "object" && e && ce in e) return e[ce];
	} catch {}
	return e;
}
function pn(e, t) {
	return Object.is(fn(e), fn(t));
}
var mn, hn, gn, _n, vn;
function yn() {
	if (mn === void 0) {
		mn = window, hn = document, gn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		_n = u(t, "firstChild").get, vn = u(t, "nextSibling").get, h(e) && (e[fe] = void 0, e[de] = null, e[pe] = void 0, e.__e = void 0), h(n) && (n[me] = void 0);
	}
}
function bn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function xn(e) {
	return _n.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Sn(e) {
	return vn.call(e);
}
function F(e, t) {
	if (!O) return /* @__PURE__ */ xn(e);
	var n = /* @__PURE__ */ xn(k);
	if (n === null) n = k.appendChild(bn());
	else if (t && n.nodeType !== 3) {
		var r = bn();
		return n?.before(r), Ie(r), r;
	}
	return t && En(n), Ie(n), n;
}
function I(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ xn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Sn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = bn();
			return k?.before(r), Ie(r), r;
		}
		En(k);
	}
	return k;
}
function L(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Sn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = bn();
			return r === null ? i?.after(a) : r.before(a), Ie(a), a;
		}
		En(r);
	}
	return Ie(r), r;
}
function Cn(e) {
	e.textContent = "";
}
function wn() {
	return !1;
}
function Tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function En(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function Dn(e) {
	V === null && (B === null && we(e), Ce()), tr && Se(e);
}
function On(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function kn(e, t) {
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
	if (e & 4) Ht === null ? Kt.ensure().schedule(r) : Ht.push(r);
	else if (t !== null) {
		try {
			Sr(r);
		} catch (e) {
			throw Gn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= T));
	}
	if (i !== null && (i.parent = n, n !== null && On(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function An() {
	return B !== null && !rr;
}
function jn(e) {
	let t = kn(8, null);
	return it(t, x), t.teardown = e, t;
}
function Mn(e) {
	Dn("$effect");
	var t = V.f;
	if (!B && t & 32 && Ke !== null && !Ke.i) {
		var n = Ke;
		(n.e ??= []).push(e);
	} else return Nn(e);
}
function Nn(e) {
	return kn(4 | E, e);
}
function Pn(e) {
	return Dn("$effect.pre"), kn(8 | E, e);
}
function Fn(e) {
	Kt.ensure();
	let t = kn(64 | re, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Jn(t, () => {
			Gn(t), n(void 0);
		}) : (Gn(t), n(void 0));
	});
}
function In(e) {
	return kn(4, e);
}
function R(e, t) {
	var n = Ke, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = zn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				ar(n.parent), U(t);
			} finally {
				ar(n);
			}
		}
	});
}
function Ln() {
	var e = Ke;
	zn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && it(n, C), _r(n) && Sr(n), t.ran = !1;
		}
	});
}
function Rn(e) {
	return kn(oe | re, e);
}
function zn(e, t = 0) {
	return kn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	wt(r, t, n, (t) => {
		kn(8, () => {
			e(...t.map(H));
		});
	});
}
function Bn(e, t = 0) {
	return kn(16 | t, e);
}
function Vn(e) {
	return kn(32 | re, e);
}
function Hn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = tr, n = B;
		nr(!0), ir(null);
		try {
			t.call(null);
		} finally {
			nr(e), ir(n);
		}
	}
}
function Un(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && vt(() => {
			e.abort(ge);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Gn(n, t), n = r;
	}
}
function Wn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Gn(t), t = n;
	}
}
function Gn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Kn(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, Un(e, t && !n), xr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Hn(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && qn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Kn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Sn(e);
		e.remove(), e = n;
	}
}
function qn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Jn(e, t, n = !0) {
	var r = [];
	Yn(e, r, !0);
	var i = () => {
		n && Gn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Yn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= w;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Yn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Xn(e) {
	Zn(e, !0);
}
function Zn(e, t) {
	if (e.f & 8192) {
		e.f ^= w, e.f & 1024 || (it(e, S), Kt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Qn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Sn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var $n = null, er = !1, tr = !1;
function nr(e) {
	tr = e;
}
var B = null, rr = !1;
function ir(e) {
	B = e;
}
var V = null;
function ar(e) {
	V = e;
}
var or = null;
function sr(e) {
	B !== null && (or ??= /* @__PURE__ */ new Set()).add(e);
}
var cr = null, lr = 0, ur = null;
function dr(e) {
	ur = e;
}
var fr = 1, pr = 0, mr = pr;
function hr(e) {
	mr = e;
}
function gr() {
	return ++fr;
}
function _r(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~D), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (_r(a) && Nt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Rt === null && it(e, x);
	}
	return !1;
}
function vr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(or !== null && or.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? vr(a, t, !1) : t === a && (n ? it(a, S) : a.f & 1024 && it(a, C), Zt(a));
	}
}
function yr(e) {
	var t = cr, n = lr, r = ur, i = B, a = or, o = Ke, s = rr, c = mr, l = e.f;
	cr = null, lr = 0, ur = null, B = l & 96 ? null : e, or = null, qe(e.ctx), rr = !1, mr = ++pr, e.ac !== null && (vt(() => {
		e.ac.abort(ge);
	}), e.ac = null);
	try {
		e.f |= ae;
		var u = e.fn, d = u();
		e.f |= te;
		var f = e.deps, p = M?.is_fork;
		if (cr !== null) {
			var m;
			if (p || xr(e, lr), f !== null && lr > 0) for (f.length = lr + cr.length, m = 0; m < cr.length; m++) f[lr + m] = cr[m];
			else e.deps = f = cr;
			if (An() && e.f & 512) for (m = lr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && lr < f.length && (xr(e, lr), f.length = lr);
		if (Xe() && ur !== null && !rr && f !== null && !(e.f & 6146)) for (m = 0; m < ur.length; m++) vr(ur[m], e);
		if (i !== null && i !== e) {
			if (pr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = pr;
			if (t !== null) for (let e of t) e.rv = pr;
			ur !== null && (r === null ? r = ur : r.push(...ur));
		}
		return e.f & 8388608 && (e.f ^= se), d;
	} catch (e) {
		return tt(e);
	} finally {
		e.f ^= ae, cr = t, lr = n, ur = r, B = i, or = a, qe(o), rr = s, mr = c;
	}
}
function br(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (cr === null || !s.call(cr, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~D), c.v !== n && at(c), c.ac !== null && vt(() => {
			c.ac.abort(ge), c.ac = null, it(c, S);
		}), Pt(c), xr(c, 0);
	}
}
function xr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) br(e, n[r]);
}
function Sr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		it(e, x);
		var n = V, r = er;
		V = e, er = !(t & 96);
		try {
			t & 16777232 ? Wn(e) : Un(e), Hn(e);
			var i = yr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = fr;
		} finally {
			er = r, V = n;
		}
	}
}
async function Cr() {
	await Promise.resolve(), qt();
}
function H(e) {
	var t = !!(e.f & 2);
	if ($n?.add(e), B !== null && !rr && !(V !== null && V.f & 16384) && (or === null || !or.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < pr && (e.rv = pr, cr === null && n !== null && n[lr] === e ? lr++ : cr === null ? cr = [e] : cr.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (tr && tn.has(e)) return tn.get(e);
	if (t) {
		var i = e;
		if (tr) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Tr(i)) && (a = Mt(i)), tn.set(i, a), a;
		}
		var o = !(i.f & 512) && !rr && B !== null && (er || !!(B.f & 512)), c = (i.f & te) === 0;
		_r(i) && (o && (i.f |= 512), Nt(i)), o && !c && (Ft(i), wr(i));
	}
	if (Rt?.has(e)) return Rt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function wr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ft(t), wr(t));
}
function Tr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (tn.has(t) || t.f & 2 && Tr(t)) return !0;
	return !1;
}
function U(e) {
	var t = rr;
	try {
		return rr = !0, e();
	} finally {
		rr = t;
	}
}
function W(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (ce in e) Er(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && ce in n && Er(n);
		}
	}
}
function Er(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Er(e[n], t);
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
var Dr = Symbol("events"), Or = /* @__PURE__ */ new Set(), kr = /* @__PURE__ */ new Set();
function Ar(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Pr.call(t, e), !e.cancelBubble) return vt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? $e(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function jr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Ar(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && jn(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[Dr] ??= {})[e] = n;
}
function Mr(e) {
	for (var t = 0; t < e.length; t++) Or.add(e[t]);
	for (var n of kr) n(e);
}
var Nr = null;
function Pr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Nr = e;
	var o = 0, s = Nr === e && e[Dr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Dr] = t;
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
		ir(null), ar(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Dr]?.[r];
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
			e[Dr] = t, delete e.currentTarget, ir(d), ar(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Fr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Ir(e) {
	return Fr?.createHTML(e) ?? e;
}
function Lr(e) {
	var t = Tn("template");
	return t.innerHTML = Ir(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Rr(e, t) {
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
		if (O) return Rr(k, null), k;
		i === void 0 && (i = Lr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ xn(i)));
		var t = r || gn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ xn(t), s = t.lastChild;
			Rr(o, s);
		} else Rr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function zr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return Rr(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ xn(Lr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ xn(e);) o.appendChild(/* @__PURE__ */ xn(e));
			else o = /* @__PURE__ */ xn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ xn(t), r = t.lastChild;
			Rr(n, r);
		} else Rr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Br(e, t) {
	return /* @__PURE__ */ zr(e, t, "svg");
}
function Vr(e = "") {
	if (!O) {
		var t = bn(e + "");
		return Rr(t, t), t;
	}
	var n = k;
	return n.nodeType === 3 ? En(n) : (n.before(n = bn()), Ie(n)), Rr(n, n), n;
}
function Hr() {
	if (O) return Rr(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = bn();
	return e.append(t, n), Rr(t, n), e;
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
var Ur = ["touchstart", "touchmove"];
function Wr(e) {
	return Ur.includes(e);
}
var Gr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Kr(e) {
	return Gr.includes(e);
}
function J(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[me] ??= e.nodeValue) && (e[me] = n, e.nodeValue = `${n}`);
}
function qr(e, t) {
	return Yr(e, t);
}
var Jr = /* @__PURE__ */ new Map();
function Yr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	yn();
	var u = void 0, d = Fn(() => {
		var s = r ?? n.appendChild(bn());
		St(s, { pending: () => {} }, (n) => {
			Je({});
			var r = Ke;
			if (o && (r.c = o), a && (i.$$events = a), O && Rr(n, null), u = e(n, i) || {}, O && (V.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Me(), t;
			Ye();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Wr(r);
					for (let e of [n, document]) {
						var a = Jr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Jr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Pr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(Or)), kr.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = Jr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, Pr), t.delete(e), t.size === 0 && Jr.delete(r)) : t.set(e, i);
			}
			kr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Xr.set(u, d), u;
}
var Xr = /* @__PURE__ */ new WeakMap();
function Zr(e, t) {
	let n = Xr.get(e);
	return n ? (Xr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Qr = class {
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
			if (n) Xn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Xn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Gn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Qn(r, t), t.append(bn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Gn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Jn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Gn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = wn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = bn();
			i.append(a), this.#n.set(e, {
				effect: Vn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Vn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else O && (this.anchor = k), this.#a(n);
	}
};
function $r(e) {
	Ke === null && ye("onMount"), We && Ke.l !== null ? ti(Ke).m.push(e) : Mn(() => {
		let t = U(e);
		if (typeof t == "function") return t;
	});
}
function ei(e) {
	Ke === null && ye("onDestroy"), $r(() => () => U(e));
}
function ti(e) {
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
	var i = new Qr(e), a = n ? T : 0;
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
	Bn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var ni = Symbol("NaN");
function ri(e, t, n) {
	O && Le();
	var r = new Qr(e), i = !Xe();
	Bn(() => {
		var e = t();
		e !== e && (e = ni), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function ii(e, t) {
	return t;
}
function ai(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Jn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					oi(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			Cn(d), d.append(u), e.items.clear();
		}
		oi(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function oi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ie, Qn(a, document.createDocumentFragment())) : Gn(t[i], n);
	}
}
var si;
function X(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = O ? Ie(/* @__PURE__ */ xn(u)) : u.appendChild(bn());
	}
	O && Le();
	var d = null, f = /* @__PURE__ */ j(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, li(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ie, di(d, null, s)) : Xn(d) : Jn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Bn(() => {
			p = H(f);
			var e = p.length;
			let a = !1;
			O && Be(s) === "[!" != (e === 0) && (s = ze(), Ie(s), Fe(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = M, v = wn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (s = k, a = !0, Fe(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && sn(S.v, b), S.i && sn(S.i, y), v && u.unskip_effect(S.e)) : (S = ui(l, h ? s : si ??= bn(), b, x, y, i, t, n), h || (S.e.f |= ie), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = Vn(() => o(s)) : (d = Vn(() => o(si ??= bn())), d.f |= ie)), e > c.size && xe("", "", ""), O && e > 0 && Ie(ze()), !h) if (m.set(u, c), v) {
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
function ci(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function li(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ci(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Xn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ie, _ === l) di(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (oi(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = ci(l.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			ai(e, w, te);
		}
	}
	a && $e(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ui(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? rn(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? rn(i) : null;
	return {
		v: c,
		i: l,
		e: Vn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function di(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Sn(r);
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
	O && Le();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function mi(e, t, n, r, a, o) {
	let s = O;
	O && Le();
	var c = null;
	O && k.nodeType === 1 && (c = k, Le());
	var l = O ? k : e, u = new Qr(l, !1);
	Bn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = O ? c : Tn(e, o), Rr(c, c), r) {
					var n = null;
					O && Kr(e) && c.append(n = document.createComment(""));
					var i = O ? /* @__PURE__ */ xn(c) : c.appendChild(bn());
					O && (i === null ? Fe(!1) : Ie(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			O && Ie(t);
		}), () => {};
	}, T), jn(() => {}), s && (Fe(!0), Ie(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function hi(e, t, n) {
	In(() => {
		var r = U(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			zn(() => {
				var e = n();
				W(e), i && He(a, e) && (a = e, r.update(e));
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
	var o = e[fe];
	if (O || o !== n || o === void 0) {
		var s = bi(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[fe] = n;
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
	var i = e[pe];
	if (O || i !== t) {
		var a = Ci(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[pe] = t;
	} else r && (Array.isArray(r) ? (wi(e, n?.[0], r[0]), wi(e, n?.[1], r[1], "important")) : wi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Ei(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return Ne();
		for (var r of e.options) r.selected = t.includes(ki(r));
		return;
	}
	for (r of e.options) if (pn(ki(r), t)) {
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
	}), jn(() => {
		t.disconnect();
	});
}
function Oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	yt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ki);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ki(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), In(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
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
var Ai = Symbol("is custom element"), ji = Symbol("is html"), Mi = _e ? "link" : "LINK", Ni = _e ? "progress" : "PROGRESS";
function Pi(e) {
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
		e[he] = n, $e(n), _t();
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
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ue] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && zi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Li(e) {
	return e[de] ??= {
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
	yt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Hi(e) ? Ui(a) : a, n(a), M !== null && r.add(M), await Cr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (O && e.defaultValue !== e.value || U(t) == null && e.value) && (n(Hi(e) ? Ui(e.value) : e.value), M !== null && r.add(M)), zn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		Hi(e) && n === Ui(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Vi(e, t, n = t) {
	yt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (O && e.defaultChecked !== e.checked || U(t) == null) && n(e.checked), zn(() => {
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
	r && r.set && (e[t] = n, jn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Gi(e, t) {
	return e === t || e?.[ce] === t;
}
function Ki(e = {}, t, n, r) {
	var i = Ke.r, a = V;
	return In(() => {
		var o, s;
		return zn(() => {
			o = s, s = r?.() || [], U(() => {
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
	let t = Ke, n = t.l.u;
	if (!n) return;
	let r = () => W(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Ot(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => H(i);
	}
	n.b.length && Pn(() => {
		Ji(t, r), y(n.b);
	}), Mn(() => {
		let e = U(() => n.m.map(v));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Mn(() => {
		Ji(t, r), y(n.a);
	});
}
function Ji(e, t) {
	if (e.l.s) for (let t of e.l.s) H(t);
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
function Xi(...e) {
	return new Proxy({ props: e }, Yi);
}
function $(e, t, n, r) {
	var i = !We || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ Ot(r), H(l)) : (c && (c = !1, s = o ? U(r) : r), s);
	let f;
	if (a) {
		var p = ce in e || le in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = mt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ee(t), f(m)));
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
	var v = !1, y = (n & 1 ? Ot : j)(() => (v = !1, g()));
	a && H(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? H(y) : i && a ? dn(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return tr && v || b.f & 16384 ? y.v : H(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ge();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Zi = /* @__PURE__ */ K("<button type=\"button\">＋</button>"), Qi = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), $i = /* @__PURE__ */ K("<option> </option>"), ea = /* @__PURE__ */ K("<span class=\"task-add-contract\"> </span>"), ta = /* @__PURE__ */ K("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), na = /* @__PURE__ */ K("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), ra = /* @__PURE__ */ K("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function ia(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ N(""), ee = /* @__PURE__ */ N(""), te = /* @__PURE__ */ N(u()?.creationDefaultValue ?? 4), ne = /* @__PURE__ */ N();
	async function T() {
		await Cr(), H(ne)?.focus?.();
	}
	function re(e) {
		e.preventDefault(), C()({
			title: H(w),
			summary: H(ee),
			priority: u().normalize(H(te), u().creationDefaultValue)
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
		l() && T();
	}), Ln(), qi();
	var ie = Hr(), D = I(ie), ae = (e) => {
		var t = Zi();
		z(() => {
			Z(t, 1, vi(H(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", H(r));
		}), G("click", t, function(...e) {
			x()?.apply(this, e);
		}), q(e, t);
	}, oe = (e) => {
		var t = ra(), r = F(t);
		Pi(r), Ki(r, (e) => P(ne, e), () => H(ne));
		var c = L(r, 2), l = (e) => {
			var t = Qi();
			ht(t), z(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Bi(t, () => H(ee), (e) => P(ee, e)), q(e, t);
		};
		Y(c, (e) => {
			H(n) && e(l);
		});
		var d = L(c, 2);
		X(d, 5, () => (W(u()), U(() => u().levels)), (e) => e.value, (e, t) => {
			var n = $i(), r = F(n, !0);
			A(n);
			var i = {};
			z((e) => {
				J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}, [() => (W(u()), H(t), U(() => u().format(H(t).value)))]), q(e, n);
		}), A(d);
		var f = L(d, 2), p = (e) => {
			var t = ea(), n = F(t, !0);
			A(t), z(() => J(n, _())), q(e, t);
		};
		Y(f, (e) => {
			H(n) && _() && e(p);
		});
		var g = L(f, 2), v = (e) => {
			var t = ta(), n = I(t), r = F(n, !0);
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
			var t = na(), n = I(t), r = F(n, !0);
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
			Z(t, 1, vi(H(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", H(n) ? 160 : 300), Q(r, "placeholder", H(i)), Q(r, "aria-label", H(a)), Q(d, "aria-label", H(o));
		}), jr("submit", t, re), G("keydown", t, E), Bi(r, () => H(w), (e) => P(w, e)), Oi(d, () => H(te), (e) => P(te, e)), q(e, t);
	};
	Y(D, (e) => {
		l() ? e(oe, -1) : e(ae);
	}), q(e, ie), Ye();
}
Mr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var aa = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), oa = /* @__PURE__ */ K("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), sa = /* @__PURE__ */ K("<div class=\"assessment-metric-grid\"></div>");
function ca(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = sa();
	X(r, 5, n, (e) => e.label, (e, t) => {
		var n = oa(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a), s = (e) => {
			var n = aa();
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
var la = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), ua = /* @__PURE__ */ K("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function da(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = ua(), a = F(i), o = F(a), s = (e) => {
		var t = la();
		z(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), q(e, t);
	};
	Y(o, (e) => {
		r() && e(s);
	});
	var c = L(o);
	A(a), pi(L(a, 2), t, "default", {}, null), A(i), z(() => J(c, ` ${n() ?? ""}`)), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var fa = /* @__PURE__ */ K("<span class=\"assessment-readout-summary\"> </span>"), pa = /* @__PURE__ */ K("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function ma(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = pa(), o = F(a), s = F(o, !0);
	A(o);
	var c = L(o, 2);
	pi(F(c), t, "badges", {}, null), A(c);
	var l = L(c, 2), u = (e) => {
		var t = fa(), n = F(t, !0);
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
var ha = /* @__PURE__ */ K("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ga(e, t) {
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
	qi();
	var _ = Hr(), v = I(_), y = (e) => {
		var n = ha(), l = F(n), d = F(l), f = F(d), _ = F(f, !0);
		A(f);
		var v = L(f, 2), y = F(v, !0);
		A(v), A(d);
		var b = L(d, 2);
		A(l), pi(L(l, 2), t, "default", { close: h }, null), A(n), Ki(n, (e) => P(u, e), () => H(u)), hi(n, (e) => p?.(e)), z(() => {
			Z(n, 1, vi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), J(_, a()), Q(v, "id", s()), J(y, o()), Q(b, "aria-label", c());
		}), jr("close", n, m), G("click", n, g), G("click", b, h), q(e, n);
	};
	Y(v, (e) => {
		n() && e(y);
	}), q(e, _), Ye();
}
Mr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var _a = /* @__PURE__ */ K("<span> </span>"), va = /* @__PURE__ */ K("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ya = /* @__PURE__ */ K("<!> <!> <!>", 1), ba = /* @__PURE__ */ K("<span slot=\"badges\"> </span>"), xa = /* @__PURE__ */ K("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), Sa = /* @__PURE__ */ K("<div class=\"cost-dialog-content\"><!></div>");
function Ca(e, t) {
	Je(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	qi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
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
				return H(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = Sa(), i = F(n), a = (e) => {
					var t = ya(), n = I(t);
					ma(n, {
						label: "估算成本",
						get value() {
							return W(s()), U(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Hr();
							X(I(n), 1, () => (W(s()), U(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = _a(), r = F(n, !0);
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
						ca(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						da(e, {
							heading: "尚未由人確認",
							children: (e, t) => {
								q(e, va());
							},
							$$slots: { default: !0 }
						});
					};
					Y(i, (e) => {
						W(s()), U(() => !s().humanConfirmed) && e(a);
					}), q(e, t);
				}, c = (e) => {
					var t = ya(), n = I(t);
					ma(n, {
						label: "估算總額",
						get value() {
							return W(o()), U(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ba(), r = F(n, !0);
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
						ca(r, { get metrics() {
							return H(e);
						} });
					}
					var i = L(r, 2), a = (e) => {
						da(e, {
							heading: "為什麼沒有資源判斷",
							children: (e, t) => {
								q(e, xa());
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
var wa = /* @__PURE__ */ K("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), Ta = /* @__PURE__ */ K("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), Ea = /* @__PURE__ */ K("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Da = /* @__PURE__ */ K("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Oa(e, t) {
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
	qi();
	var c = Da(), l = F(c), u = F(l), d = L(F(u), 2), f = F(d, !0);
	A(d), A(u), Re(2), A(l);
	var p = L(l, 2), m = (e) => {
		var t = wa(), r = F(t), i = L(F(r), 2), o = F(i, !0);
		A(i), A(r);
		var s = L(r, 2), c = L(F(s), 2), l = F(c, !0);
		A(c), A(s), A(t), z((e, t) => {
			J(o, e), J(l, t);
		}, [() => (W(n()), U(() => a(n().before))), () => (W(n()), U(() => a(n().after)))]), q(e, t);
	}, h = (e) => {
		q(e, Ta());
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
	var ee = L(C, 2), te = F(ee);
	A(ee), A(S), A(g);
	var ne = L(g, 2), T = F(ne), re = L(F(T)), E = F(re, !0);
	A(re), A(T);
	var ie = L(T, 2), D = L(F(ie)), ae = F(D, !0);
	A(D), A(ie), A(ne);
	var oe = L(ne, 2), se = (e) => {
		var t = Ea(), r = L(F(t), 1, !0);
		A(t), z(() => J(r, (W(n()), U(() => n().reason)))), q(e, t);
	};
	Y(oe, (e) => {
		W(n()), U(() => n().reason) && e(se);
	}), A(c), z((e, t, i, a) => {
		J(f, r()), J(y, (W(n()), U(() => n().current.label))), J(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (W(n()), U(() => `risk-${n().next.urgency ?? "none"}`))), J(w, (W(n()), U(() => n().next.label))), J(te, `剩餘容量 ${t ?? ""}`), J(E, i), J(ae, a);
	}, [
		() => (W(n()), U(() => o(n().current.remainingCapacityMinutes))),
		() => (W(n()), U(() => o(n().next.remainingCapacityMinutes))),
		() => (W(n()), U(() => s(n().capacityDelta))),
		() => (W(n()), U(() => s(n().balanceDelta)))
	]), q(e, c), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var ka = /* @__PURE__ */ K("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Aa(e, t) {
	Je(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N();
	$r(() => {
		H(o).showModal(), H(s).focus();
	});
	function c(e) {
		e.preventDefault(), r() || i()();
	}
	function l(e) {
		e.key !== "Escape" || r() || (e.preventDefault(), e.stopPropagation(), i()());
	}
	qi();
	var u = ka(), d = L(F(u), 2);
	Oa(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = L(d, 2), p = F(f);
	Ki(p, (e) => P(s, e), () => H(s));
	var m = L(p, 2), h = F(m, !0);
	A(m), A(f), A(u), Ki(u, (e) => P(o, e), () => H(o)), z(() => {
		p.disabled = r(), m.disabled = r(), J(h, r() ? "正在儲存…" : "確認儲存");
	}), jr("cancel", u, c), G("keydown", u, l), G("click", p, function(...e) {
		i()?.apply(this, e);
	}), G("click", m, function(...e) {
		a()?.apply(this, e);
	}), q(e, u), Ye();
}
Mr(["keydown", "click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/Diagnostics.svelte
var ja = /* @__PURE__ */ K("<div><strong> </strong> <p> </p></div>");
function Ma(e, t) {
	let n = $(t, "diagnostics", 24, () => []), r = {
		warning: "注意",
		error: "無法載入部分資料"
	};
	var i = Hr();
	X(I(i), 1, n, ii, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).level ?? "error")));
		var i = ja(), a = F(i), o = F(a, !0);
		A(a);
		var s = L(a, 2), c = F(s, !0);
		A(s), A(i), z(() => {
			Z(i, 1, `diagnostic diagnostic-${H(n)}`), J(o, (W(H(n)), U(() => r[H(n)] ?? r.error))), J(c, (H(t), U(() => H(t).message)));
		}), q(e, i);
	}), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Na = /* @__PURE__ */ K("<button type=\"button\"> </button>");
function Pa(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	R(() => W(a()), () => {
		P(n, a() === "edit");
	}), R(() => H(n), () => {
		P(r, H(n) ? "編輯模式" : "預覽模式");
	}), R(() => H(n), () => {
		P(i, H(n) ? "預覽模式" : "編輯模式");
	}), Ln(), qi();
	var d = Na();
	let f;
	var p = F(d, !0);
	A(d), z(() => {
		f = Z(d, 1, "view-mode-toggle editor-mode-dock", null, f, { "is-editing": H(n) }), Q(d, "aria-label", `切換到${H(i)}（目前為${H(r)}）`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), J(p, H(i));
	}), G("click", d, () => u()(H(n) ? "preview" : "edit")), q(e, d), Ye();
}
Mr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Fa = /* @__PURE__ */ K("<span></span>"), Ia = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), La = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>"), Ra = /* @__PURE__ */ K("<div role=\"toolbar\"></div>");
function za(e, t) {
	Je(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = !1, u = null, d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N();
	async function p() {
		let e = H(d);
		P(d, null), await Cr(), [...H(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function ee(e, t) {
		if (!H(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = H(s), r = g(t.currentTarget, t.clientX);
		m(), v(n, e.id, r);
	}
	function te() {
		m(), setTimeout(() => {
			l = !1;
		}, 0);
	}
	function ne(e, t) {
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
	function T(e, t) {
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
	}), Ln(), qi();
	var E = Ra();
	X(E, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ j(() => (H(t), U(() => H(t).sortable !== !1)));
		var r = La(), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i, 2), l = (e) => {
			var n = Fa();
			z(() => Z(n, 1, (H(t), U(() => `time-risk-dot ${H(t).dotClass ?? ""}`)))), q(e, n);
		};
		Y(o, (e) => {
			H(t), U(() => H(t).showDot) && e(l);
		});
		var u = L(o, 2), d = (e) => {
			q(e, Ia());
		};
		Y(u, (e) => {
			H(t), U(() => H(t).showChevron) && e(d);
		}), A(r), z((e) => {
			Z(r, 1, e), Q(r, "data-capsule-id", (H(t), U(() => H(t).id))), Q(r, "data-reorder-capsule", H(n) ? "true" : null), Q(r, "aria-pressed", (H(t), U(() => H(t).pressed ?? null))), Q(r, "aria-label", (H(t), U(() => H(t).ariaLabel ?? H(t).label))), Q(r, "aria-keyshortcuts", H(n) ? "Alt+ArrowLeft Alt+ArrowRight" : null), Q(r, "title", (H(t), U(() => H(t).title ?? null))), r.disabled = (H(t), U(() => H(t).disabled ?? !1)), Q(r, "draggable", H(n)), J(a, (H(t), U(() => H(t).label)));
		}, [() => (H(t), W(H(n)), H(s), H(c), U(() => `capsule-button ${H(t).className ?? ""} ${H(n) ? "capsule-sortable" : ""} ${H(s) === H(t).id ? "capsule-dragging" : ""} ${h(H(t).id, H(c))}`))]), G("click", r, (e) => b(H(t), e)), G("keydown", r, function(...e) {
			(H(n) ? (e) => x(H(t), e) : null)?.apply(this, e);
		}), jr("dragstart", r, function(...e) {
			(H(n) ? (e) => S(H(t), e) : null)?.apply(this, e);
		}), jr("dragover", r, function(...e) {
			(H(n) ? (e) => C(H(t), e) : null)?.apply(this, e);
		}), jr("dragleave", r, function(...e) {
			(H(n) ? (e) => w(H(t), e) : null)?.apply(this, e);
		}), jr("drop", r, function(...e) {
			(H(n) ? (e) => ee(H(t), e) : null)?.apply(this, e);
		}), jr("dragend", r, function(...e) {
			(H(n) ? te : null)?.apply(this, e);
		}), G("pointerdown", r, function(...e) {
			(H(n) ? (e) => ne(H(t), e) : null)?.apply(this, e);
		}), G("pointermove", r, function(...e) {
			(H(n) ? (e) => T(H(t), e) : null)?.apply(this, e);
		}), G("pointerup", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), jr("pointercancel", r, function(...e) {
			(H(n) ? re : null)?.apply(this, e);
		}), q(e, r);
	}), A(E), Ki(E, (e) => P(f, e), () => H(f)), z(() => {
		Z(E, 1, `horizontal-capsule-strip ${r()}`), Q(E, "aria-label", i());
	}), q(e, E), Ye();
}
Mr([
	"click",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ModuleCapsuleStrip.svelte
function Ba(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	R(() => W(a()), () => {
		P(n, new Map(a().map((e, t) => [e, t])));
	}), R(() => (W(i()), H(n), W(a())), () => {
		P(r, [...i()].sort((e, t) => (H(n).get(e.id) ?? a().length) - (H(n).get(t.id) ?? a().length)));
	}), Ln(), qi();
	var u = Hr(), d = I(u), f = (e) => {
		za(e, {
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
var Va = /* @__PURE__ */ K("<i></i>"), Ha = /* @__PURE__ */ K("<div role=\"img\"></div>"), Ua = /* @__PURE__ */ K("<progress max=\"100\"></progress>");
function Wa(e, t) {
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
	}), Ln(), qi();
	var f = Hr(), p = I(f), m = (e) => {
		var t = Ha();
		X(t, 5, () => H(r), ii, (e, t) => {
			var n = Va();
			z((e) => Z(n, 1, e), [() => (H(t), U(() => `progress-cell${u(H(t))}`))]), q(e, n);
		}), A(t), z(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), q(e, t);
	}, h = (e) => {
		var t = Ua();
		z(() => {
			Z(t, 1, `progress-meter ${c()}`), Fi(t, H(n)), Q(t, "aria-label", s());
		}), q(e, t);
	};
	Y(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), q(e, f), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Ga = /* @__PURE__ */ K("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Ka(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	R(() => (W(r()), W(i()), W(a()), W(o())), () => {
		P(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), Ln(), qi();
	var s = Ga(), c = I(s), l = F(c), u = F(l);
	A(l), A(c);
	var d = L(c, 2);
	{
		let e = /* @__PURE__ */ j(() => r() / 100);
		Wa(d, {
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
var qa = /* @__PURE__ */ K("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ja = /* @__PURE__ */ K("<p class=\"hero-summary\"> </p>");
function Ya(e, t) {
	Je(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	qi();
	var c = Hr(), l = I(c), u = (e) => {
		var t = qa();
		ht(t), z(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Fi(t, i());
		}), G("input", t, (e) => s()(e.currentTarget.value)), q(e, t);
	}, d = (e) => {
		var t = Ja(), r = F(t, !0);
		A(t), z(() => J(r, n())), q(e, t);
	};
	Y(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), q(e, c), Ye();
}
Mr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Xa = /* @__PURE__ */ K("<a class=\"scope-developer-link\"> </a>"), Za = /* @__PURE__ */ K("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function Qa(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Hr();
	X(I(i), 1, n, (e) => e.id, (e, t) => {
		var n = Za(), i = F(n), a = F(i, !0);
		A(i);
		var o = L(i, 2), s = (e) => {
			var n = Xa(), i = F(n, !0);
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
var $a = /* @__PURE__ */ K("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), eo = /* @__PURE__ */ K("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), to = /* @__PURE__ */ K("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function no(e, t) {
	Je(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	qi();
	var y = to(), b = I(y), x = F(b, !0);
	A(b);
	var S = L(b, 2), C = F(S), w = F(C, !0);
	A(C);
	var ee = L(C, 2), te = F(ee, !0);
	A(ee), A(S);
	var ne = L(S, 2), T = (e) => {
		var t = $a(), a = F(t, !0);
		A(t), z(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), J(a, i());
		}), G("click", t, () => r()(!n())), q(e, t);
	};
	Y(ne, (e) => {
		r() && e(T);
	});
	var re = L(ne, 2), E = (e) => {
		var t = eo(), n = I(t), r = F(n, !0);
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
		J(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), J(w, f()), Q(ee, "aria-label", `${p()}下一個修改`), ee.disabled = !c() || o(), J(te, p());
	}), G("click", C, function(...e) {
		g()?.apply(this, e);
	}), G("click", ee, function(...e) {
		_()?.apply(this, e);
	}), q(e, y), Ye();
}
Mr(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var ro = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function io(e, t) {
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
			id: ro,
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
		P(i, s().length > 0 ? s() : [ro, ...o().map((e) => e.id)]);
	}), R(() => (H(i), H(n), H(r), W(c()), W(p())), () => {
		P(a, H(i).map((e) => e === "__default__" ? H(n) : H(r).get(e)).filter(Boolean).map((e) => e === H(n) ? e : v(e, c(), p())));
	}), Ln(), qi();
	{
		let t = /* @__PURE__ */ j(() => `filter-strip ${f()}`);
		za(e, {
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
var ao = /* @__PURE__ */ K("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function oo(e, t) {
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
	}), Ln(), qi();
	var o = Hr();
	X(I(o), 1, () => H(n), (e) => e.status, (e, t) => {
		var n = ao(), r = F(n), i = F(r, !0);
		A(r);
		var a = L(r, 2), o = F(a, !0);
		A(a), A(n), z(() => {
			Z(n, 1, (H(t), U(() => `overview-card overview-${H(t).tone}`))), Q(n, "data-status", (H(t), U(() => H(t).status))), J(i, (H(t), U(() => H(t).value))), J(o, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), q(e, o), Ye();
}
//#endregion
//#region viewer/assets/card-disclosure-state.js
function so(e, t) {
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
function co(e, t, n, r) {
	try {
		(r ?? globalThis.sessionStorage).setItem(e, JSON.stringify({
			expanded: t,
			overrides: n
		}));
	} catch {}
}
//#endregion
//#region experiments/editor-svelte-spike/src/EyeIcon.svelte
var lo = /* @__PURE__ */ Br("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), uo = /* @__PURE__ */ Br("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), fo = /* @__PURE__ */ Br("<path d=\"M3 3l18 18\"></path>"), po = /* @__PURE__ */ Br("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function mo(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = po(), a = F(i), o = (e) => {
		q(e, lo());
	}, s = (e) => {
		var t = uo();
		Re(), q(e, t);
	};
	Y(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = L(a), l = (e) => {
		q(e, fo());
	};
	Y(c, (e) => {
		r() && e(l);
	}), A(i), q(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var ho = /* @__PURE__ */ K("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), go = /* @__PURE__ */ K("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function _o(e, t) {
	Je(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	qi();
	var l = go(), u = I(l);
	let d;
	var f = F(u), p = F(f), m = F(p, !0);
	A(p), A(f);
	var h = L(f, 2), g = (e) => {
		var t = ho(), n = F(t);
		{
			let e = /* @__PURE__ */ j(() => !r());
			mo(n, { get closed() {
				return H(e);
			} });
		}
		A(t), z(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), G("click", t, () => i()(!r())), q(e, t);
	};
	Y(h, (e) => {
		n() && e(g);
	}), pi(L(h, 2), t, "header", {}, null), A(u);
	var _ = L(u, 2);
	pi(F(_), t, "default", {}, null), A(_), z(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), J(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), G("click", f, () => c()(!a())), q(e, l), Ye();
}
Mr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var vo = /* @__PURE__ */ K("<span class=\"developer-next-label\">後續：</span> <span class=\"developer-next-action\"> </span>", 1), yo = /* @__PURE__ */ K("<span class=\"developer-expand-hint\">展開作法與方向</span>"), bo = /* @__PURE__ */ K("<!> <!>", 1), xo = /* @__PURE__ */ K("<li> </li>"), So = /* @__PURE__ */ K("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續</h4> <ul class=\"detail-list\"></ul></section>"), Co = /* @__PURE__ */ K("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), wo = /* @__PURE__ */ K("<code class=\"reference\"> </code>"), To = /* @__PURE__ */ K("<article class=\"decision-item\"><p> </p> <!></article>"), Eo = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Do = /* @__PURE__ */ K("<p> </p>"), Oo = /* @__PURE__ */ K("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), ko = /* @__PURE__ */ K("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Ao = /* @__PURE__ */ K("<div class=\"path-list\"></div>"), jo = /* @__PURE__ */ K("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Mo = /* @__PURE__ */ K("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function No(e, t) {
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
	}), Ln(), qi();
	var c = Hr(), l = I(c), u = (e) => {
		var t = Hr();
		mi(I(t), () => H(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = bo(), o = I(n);
			mi(o, () => H(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = bo(), i = I(n), o = (e) => {
					var t = vo(), n = L(I(t), 2), i = F(n, !0);
					A(n), z(() => J(i, H(r))), q(e, t);
				};
				Y(i, (e) => {
					H(r) && e(o);
				});
				var s = L(i, 2), c = (e) => {
					q(e, yo());
				};
				Y(s, (e) => {
					H(a) && e(c);
				}), q(t, n);
			});
			var c = L(o, 2), l = (e) => {
				var t = Mo(), n = L(F(t), 2), r = (e) => {
					var t = So(), n = L(F(t), 2);
					X(n, 5, () => H(i), ii, (e, t) => {
						var n = xo(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(n, (e) => {
					H(i), U(() => H(i).length) && e(r);
				});
				var a = L(n, 2), o = (e) => {
					var t = Co(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().blockers)), ii, (e, t) => {
						var n = xo(), r = F(n, !0);
						A(n), z(() => J(r, H(t))), q(e, n);
					}), A(n), A(t), q(e, t);
				};
				Y(a, (e) => {
					W(s()), U(() => s().blockers?.length) && e(o);
				});
				var c = L(a, 2), l = (e) => {
					var t = Eo(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().decisions)), ii, (e, t) => {
						var n = To(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = (e) => {
							var n = wo(), r = F(n, !0);
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
					var t = ko(), n = L(F(t), 2);
					X(n, 5, () => (W(s()), U(() => s().routes)), ii, (e, t) => {
						var n = Oo(), r = F(n), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r);
						var c = L(r, 2), l = (e) => {
							var n = Do(), r = F(n, !0);
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
					var t = jo(), n = L(F(t), 2), r = F(n);
					A(n);
					var i = L(n, 2), a = (e) => {
						var t = Do(), n = F(t);
						A(t), z(() => J(n, `Worktree: ${W(s()), U(() => s().claim.worktree) ?? ""}`)), q(e, t);
					};
					Y(i, (e) => {
						W(s()), U(() => s().claim.worktree) && e(a);
					});
					var o = L(i, 2), c = (e) => {
						var t = Ao();
						X(t, 5, () => (W(s()), U(() => s().claim.source_paths)), ii, (e, t) => {
							var n = wo(), r = F(n, !0);
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
//#region viewer/assets/inline-links.js
function Po(e) {
	if (!e || /[\u0000-\u0020\u007f\\]/u.test(e)) return null;
	try {
		let t = new URL(e, "https://taskprogress.invalid/");
		return ["http:", "https:"].includes(t.protocol) ? e : null;
	} catch {
		return null;
	}
}
function Fo(e) {
	let t = String(e ?? ""), n = [], r = /\[([^\]\n]+)\]\(/gu, i = 0, a;
	for (; a = r.exec(t);) {
		if (a.index > 0 && ["!", "\\"].includes(t[a.index - 1])) continue;
		let e = r.lastIndex, o = 1;
		for (; e < t.length && o && (t[e] === "(" && o++, t[e] === ")" && o--, t[e] !== "\n"); e++);
		if (o) continue;
		let s = Po(t.slice(r.lastIndex, e - 1));
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
function Io(e, t, { emphasis: n = !1 } = {}) {
	let r = e.createElement("a");
	return r.className = n ? "inline-link inline-link--emphasis" : "inline-link", r.setAttribute("href", t.href), r.setAttribute("rel", "noopener noreferrer"), r.textContent = t.text, r;
}
function Lo(e) {
	let t = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
	return Fo(e).map((e) => ({
		...e,
		units: e.href ? [e.text] : t ? Array.from(t.segment(e.text), (e) => e.segment) : Array.from(e.text)
	}));
}
//#endregion
//#region viewer/assets/expandable-text.js
function Ro(e, t = {}) {
	let n = e.ownerDocument, r = n.defaultView, i = n.createElement("div"), a = n.createElement("span"), o = n.createElement("button"), s = n.createElement("span"), c = n.createElement("span");
	c.className = "expandable-text__label", o.append(s, c), i.className = "expandable-text__content", o.className = "expandable-text__toggle", o.type = "button", e.classList.add("expandable-text"), i.append(a, o), e.append(i);
	let l = n.createElement("div"), u = n.createElement("span"), d = n.createElement("button");
	l.className = "expandable-text__content expandable-text__measure", l.setAttribute("aria-hidden", "true"), l.inert = !0, d.className = "expandable-text__toggle", l.append(u, d), e.append(l);
	let f, p = !1, m = 0, h = !1, g = [], _ = [], v = [], y = 0;
	function b(e) {
		return e.replaceChildren(), g.map((t) => {
			let r = t.href ? Io(n, t, { emphasis: f.emphasis }) : n.createElement("span");
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
		}, i && (g = Lo(t), y = g.reduce((e, t) => e + t.units.length, 0), _ = b(a), v = b(u), x(_, y)), S(), w();
	}
	function te() {
		p = !p, S(), w();
	}
	o.hidden = !0, o.addEventListener("click", te);
	let ne = new r.ResizeObserver(w);
	return ne.observe(i), n.fonts?.addEventListener("loadingdone", w), ee(t), {
		update: ee,
		destroy() {
			h = !0, r.cancelAnimationFrame(m), ne.disconnect(), n.fonts?.removeEventListener("loadingdone", w), o.removeEventListener("click", te), i.remove(), l.remove(), e.classList.remove("expandable-text");
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/ExpandableText.svelte
var zo = /* @__PURE__ */ K("<div></div>");
function Bo(e, t) {
	let n = $(t, "text", 8, ""), r = $(t, "lines", 8, 2), i = $(t, "moreLabel", 8, "…更多"), a = $(t, "lessLabel", 8, "收合"), o = $(t, "expanded", 8, !1), s = $(t, "emphasis", 8, !1);
	var c = zo();
	hi(c, (e, t) => Ro?.(e, t), () => ({
		text: n(),
		lines: r(),
		moreLabel: i(),
		lessLabel: a(),
		expanded: o(),
		emphasis: s()
	})), q(e, c);
}
//#endregion
//#region viewer/assets/item-reference.js
function Vo({ scopeId: e, taskId: t, item: n }) {
	return !e || !t || !n?.id || n.legacy ? null : `${e} › ${t} › ${n.id}`;
}
async function Ho(e, t = globalThis.document) {
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
var Uo = {
	created: "建立",
	started: "開始",
	updated: "修改",
	done: "完成",
	takeover: "接手",
	released: "釋放",
	disputed: "爭議"
};
function Wo(e, t) {
	let n = Math.floor((t - Date.parse(e)) / 6e4);
	if (!Number.isFinite(n)) return "";
	if (n < 1) return "剛剛";
	if (n < 60) return `${n} 分鐘前`;
	let r = Math.floor(n / 60);
	return r < 24 ? `${r} 小時前` : `${Math.floor(r / 24)} 天前`;
}
function Go(e, t = Date.now()) {
	return !Array.isArray(e) || !e.length ? "" : e.map((e) => {
		let n = e.session ? `${e.actor} (${e.session})` : e.actor, r = Wo(e.at, t), i = e.note ? `：${e.note}` : "";
		return `${Uo[e.event] ?? e.event}：${n}${r ? ` · ${r}` : ""}${i}`;
	}).join("\n");
}
var Ko = (e, t) => e > 0 && t > 0 ? e / t : 1;
function qo(e, t) {
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
			sx: Ko(i.width, e.offsetWidth),
			sy: Ko(i.height, e.offsetHeight)
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
Object.freeze({
	done: {
		label: "完成",
		tone: "success"
	},
	waiting: {
		label: "等待中",
		tone: "warning"
	},
	awaiting_user_dispute: {
		label: "待使用者（爭議）",
		tone: "warning"
	},
	conditions_to_revise: {
		label: "條件待修",
		tone: "warning"
	},
	needs_fix: {
		label: "需修正",
		tone: "danger"
	},
	awaiting_user: {
		label: "待使用者",
		tone: "warning"
	},
	awaiting_acceptance: {
		label: "待他驗",
		tone: "active"
	},
	in_progress: {
		label: "執行中",
		tone: "active"
	},
	not_started: {
		label: "未開始",
		tone: "muted"
	}
});
function Jo(e) {
	return Fo(e).map((e) => e.text).join("");
}
function Yo(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e ?? []) {
		let e = n.available ? n.href : null, r = e ?? `unreadable:${n.label}`;
		t.has(r) || t.set(r, {
			href: e,
			label: Jo(e ? n.card ?? n.label : n.label)
		});
	}
	return [...t.values()];
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Xo = /* @__PURE__ */ K("<button type=\"button\" class=\"item-row-grip\" draggable=\"true\" title=\"拖曳換位（限同優先級）\">⠿</button>"), Zo = /* @__PURE__ */ K("<span aria-hidden=\"true\"> </span>"), Qo = /* @__PURE__ */ K("<option> </option>"), $o = /* @__PURE__ */ K("<select class=\"inline-priority-select\"></select>"), es = /* @__PURE__ */ K("<span> </span>"), ts = /* @__PURE__ */ K("<span class=\"item-row-priority\"><!></span>"), ns = /* @__PURE__ */ K("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), rs = /* @__PURE__ */ K("<span class=\"item-next-capsule\" title=\"Next：這個 scope 現在該做的一件事；長按取消\">Next</span>"), is = /* @__PURE__ */ K("<span class=\"item-row-selected-label\">已選取</span>"), as = /* @__PURE__ */ K("<a class=\"document-source-link\"><span class=\"source-icon\" aria-hidden=\"true\"> </span> <span class=\"source-label\"> </span></a>"), os = /* @__PURE__ */ K("<span class=\"document-source-link source-unavailable\"><span class=\"source-icon\" aria-hidden=\"true\">⚠️</span> <span class=\"source-label\">來源不可用</span></span>"), ss = /* @__PURE__ */ K("<div class=\"item-row-text\"><!> <!> <!> <!></div>"), cs = /* @__PURE__ */ K("<button type=\"button\"> </button>"), ls = /* @__PURE__ */ K("<select class=\"inline-status-select\"></select>"), us = /* @__PURE__ */ K("<a> </a>"), ds = /* @__PURE__ */ K("<li><!></li>"), fs = /* @__PURE__ */ K("<ul class=\"wait-menu-list\"></ul>"), ps = /* @__PURE__ */ K("<span class=\"wait-menu\"><button type=\"button\" title=\"等待對象\" aria-haspopup=\"true\"> </button> <!></span>"), ms = /* @__PURE__ */ K("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), hs = /* @__PURE__ */ K("<li><!> <!> <div class=\"item-row-description\"><!></div> <!> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function gs(e, t) {
	Je(t, !1);
	let n = () => ft(E(), "$selection", r), [r, i] = pt(), a = /* @__PURE__ */ N(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = /* @__PURE__ */ N(), l = /* @__PURE__ */ N(), u = /* @__PURE__ */ N(), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(), m = /* @__PURE__ */ N(), h = /* @__PURE__ */ N(), g = /* @__PURE__ */ N(), _ = $(t, "taskId", 8), v = $(t, "field", 8), y = $(t, "item", 8), b = $(t, "editing", 8), x = $(t, "policy", 8), S = $(t, "onCommand", 8), C = $(t, "moduleCapsules", 24, () => []), w = $(t, "onModuleActivate", 8, () => {}), ee = $(t, "moduleOrder", 24, () => ["time"]), te = $(t, "onModuleReorder", 8, () => {}), ne = $(t, "leadItem", 8, !1), T = $(t, "reorder", 8, null), re = $(t, "scopeId", 8, null), E = $(t, "selection", 8, null), ie = $(t, "isNext", 8, !1), D = $(t, "onSetNext", 8, null);
	function ae() {
		D()?.({
			taskId: _(),
			itemId: y().id,
			clear: ie()
		});
	}
	function oe(e, t) {
		let n = null, r = (t) => {
			n?.dispose(), n = t ? qo(e, {
				capture: !1,
				accept: (e) => !e.target.closest("a, button, input, select, textarea, label, [contenteditable]"),
				onTrigger: ae
			}) : null;
		};
		return r(t), {
			update: r,
			destroy: () => n?.dispose()
		};
	}
	function se() {
		b() || P(o, Go(y().activity));
	}
	let ce = /* @__PURE__ */ N(""), le;
	async function ue() {
		clearTimeout(le);
		let e = E() ? await E().copyReferences(H(a)) : await Ho(H(a));
		P(ce, e ? "已複製" : "無法複製"), le = setTimeout(() => {
			P(ce, "");
		}, 1500);
	}
	let de = /* @__PURE__ */ N(x().normalize(y().priority, x().fallbackValue)), fe = $(t, "statuses", 24, () => []), pe = /* @__PURE__ */ N(y().status ?? (v() === "completed_items" ? "done" : "planned")), me = /* @__PURE__ */ N(!1);
	function he(e) {
		e !== H(f) && S()({
			type: "set-item-status",
			taskId: _(),
			field: v(),
			itemId: y().id,
			status: e
		});
	}
	function ge(e) {
		w()(e, {
			taskId: _(),
			itemId: y().id,
			itemTitle: y().title
		});
	}
	R(() => (W(b()), W(re()), W(_()), W(y())), () => {
		P(a, b() ? null : Vo({
			scopeId: re(),
			taskId: _(),
			item: y()
		}));
	}), R(() => (W(b()), W(y())), () => {
		P(o, b() ? "" : Go(y().activity));
	}), R(() => (H(a), W(E())), () => {
		P(s, !!(H(a) && E()));
	}), R(() => (H(s), n(), H(a)), () => {
		P(c, H(s) && !!n()?.keys.has(H(a)));
	}), R(() => (H(c), n()), () => {
		P(l, H(c) ? n().keys.size : 1);
	}), R(() => (W(x()), W(y())), () => {
		P(u, x().metadata(y().priority));
	}), R(() => (W(x()), W(y())), () => {
		P(d, x().format(y().priority));
	}), R(() => (W(x()), W(y())), () => {
		P(de, x().normalize(y().priority, x().fallbackValue));
	}), R(() => (W(y()), W(v())), () => {
		P(f, y().status ?? (v() === "completed_items" ? "done" : "planned"));
	}), R(() => H(f), () => {
		P(pe, H(f));
	}), R(() => (W(y()), W(fe()), H(f)), () => {
		P(p, y().derivedState && y().derivedState !== "done" ? {
			label: y().derivedStateLabel,
			tone: y().derivedStateTone
		} : fe().find((e) => e.value === H(f)) ?? {
			label: H(f),
			tone: "muted"
		});
	}), R(() => H(p), () => {
		P(m, H(p).label);
	}), R(() => (W(b()), W(y()), Yo), () => {
		P(h, !b() && y().derivedState === "waiting" ? Yo(y().pendingWaits) : []);
	}), R(() => H(h), () => {
		P(g, H(h).filter((e) => e.href));
	}), R(() => H(g), () => {
		H(g).length || P(me, !1);
	}), Ln(), qi();
	var _e = hs();
	let ve;
	var ye = F(_e), be = (e) => {
		var t = Xo();
		z(() => {
			Q(t, "data-item-ref", (W(_()), W(y()), U(() => `${_()}/${y().id}`))), Q(t, "aria-label", (W(y()), U(() => `移動「${y().title}」（Alt+↑／↓，限同優先級）`)));
		}), jr("dragstart", t, function(...e) {
			T().start?.apply(this, e);
		}), jr("dragend", t, function(...e) {
			T().end?.apply(this, e);
		}), G("keydown", t, function(...e) {
			T().keydown?.apply(this, e);
		}), q(e, t);
	}, xe = (e) => {
		var t = Zo(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, `item-row-marker item-row-marker-${H(f)}`), J(n, H(f) === "done" ? "✓" : "○");
		}), q(e, t);
	};
	Y(ye, (e) => {
		T() && b() ? e(be) : e(xe, -1);
	});
	var Se = L(ye, 2), Ce = (e) => {
		var t = ts(), n = F(t), r = (e) => {
			var t = $o();
			X(t, 5, () => (W(x()), U(() => x().levels)), (e) => e.value, (e, t) => {
				var n = Qo(), r = F(n, !0);
				A(n);
				var i = {};
				z((e) => {
					J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
				}, [() => (W(x()), H(t), U(() => x().format(H(t).value)))]), q(e, n);
			}), A(t), z(() => Q(t, "aria-label", (W(y()), U(() => `設定「${y().title}」的優先級`)))), G("change", t, () => S()({
				type: "set-item-field",
				taskId: _(),
				field: v(),
				itemId: y().id,
				property: "priority",
				value: Number(H(de))
			})), Oi(t, () => H(de), (e) => P(de, e)), q(e, t);
		}, i = (e) => {
			var t = es(), n = F(t, !0);
			A(t), z(() => {
				Z(t, 1, (H(u), U(() => `priority-badge priority-${H(u).tone}`))), J(n, H(d));
			}), q(e, t);
		};
		Y(n, (e) => {
			b() ? e(r) : e(i, -1);
		}), A(t), q(e, t);
	};
	Y(Se, (e) => {
		W(b()), H(f), H(u), W(x()), U(() => b() || H(f) !== "done" && H(u) && (!H(u).hidden || !x().labelsValid)) && e(Ce);
	});
	var we = L(Se, 2), Te = F(we), Ee = (e) => {
		var t = ns();
		Pi(t), z(() => {
			Q(t, "aria-label", (W(y()), U(() => `編輯子項目：${y().title}`))), Q(t, "title", (W(y()), U(() => y().title))), Fi(t, (W(y()), U(() => y().title)));
		}), G("input", t, (e) => S()({
			type: "set-item-field",
			taskId: _(),
			field: v(),
			itemId: y().id,
			property: "title",
			value: e.currentTarget.value
		})), q(e, t);
	}, De = (e) => {
		var t = ss(), n = F(t), r = (e) => {
			q(e, rs());
		};
		Y(n, (e) => {
			ie() && e(r);
		});
		var i = L(n, 2), a = (e) => {
			q(e, is());
		};
		Y(i, (e) => {
			H(c) && e(a);
		});
		var o = L(i, 2), s = (e) => {
			var t = Hr(), n = I(t), r = (e) => {
				var t = as(), n = F(t), r = F(n, !0);
				A(n);
				var i = L(n, 2), a = F(i, !0);
				A(i), A(t), z(() => {
					Q(t, "href", (W(y()), U(() => y().sourceRef.href))), Q(t, "title", (W(y()), U(() => y().sourceRef.title))), J(r, (W(y()), U(() => y().sourceRef.kind === "decision" ? "⚖" : y().sourceRef.manual ? "📋" : "🤖"))), J(a, (W(y()), U(() => y().sourceRef.label)));
				}), q(e, t);
			}, i = (e) => {
				var t = os();
				z(() => Q(t, "title", (W(y()), U(() => y().sourceRef.error ?? "來源無法讀取")))), q(e, t);
			};
			Y(n, (e) => {
				W(y()), U(() => y().sourceRef.available) ? e(r) : e(i, -1);
			}), q(e, t);
		};
		Y(o, (e) => {
			W(y()), U(() => y().sourceRef) && e(s);
		});
		var l = L(o, 2);
		{
			let e = /* @__PURE__ */ j(() => (W(y()), U(() => y().displayTitle ?? y().title)));
			Bo(l, {
				get text() {
					return H(e);
				},
				lines: 1,
				get expanded() {
					return ne();
				}
			});
		}
		A(t), q(e, t);
	};
	Y(Te, (e) => {
		b() ? e(Ee) : e(De, -1);
	}), A(we);
	var Oe = L(we, 2), ke = (e) => {
		var t = cs();
		let n;
		var r = F(t, !0);
		A(t), z(() => {
			n = Z(t, 1, "item-row-copy", null, n, {
				"is-done": H(ce),
				"is-copied": H(ce) === "已複製"
			}), Q(t, "data-item-ref", (W(_()), W(y()), U(() => `${_()}/${y().id}`))), Q(t, "tabindex", H(s) ? -1 : void 0), Q(t, "aria-label", (H(ce), H(l), W(y()), U(() => H(ce) || (H(l) > 1 ? `複製已選取的 ${H(l)} 項參照` : `複製「${y().title}」的參照`)))), Q(t, "title", H(ce) || (H(l) > 1 ? `複製已選取的 ${H(l)} 項參照` : H(a))), J(r, H(ce) === "已複製" ? "✓" : H(ce) ? "✕" : "⧉");
		}), G("click", t, ue), q(e, t);
	};
	Y(Oe, (e) => {
		H(a) && e(ke);
	});
	var Ae = L(Oe, 2), je = F(Ae);
	Ba(F(je), {
		get capsules() {
			return C();
		},
		get moduleOrder() {
			return ee();
		},
		onActivate: ge,
		get onReorder() {
			return te();
		}
	}), A(je);
	var Me = L(je, 2), Ne = F(Me), Pe = (e) => {
		var t = ls();
		X(t, 5, fe, (e) => e.value, (e, t) => {
			var n = Qo(), r = F(n, !0);
			A(n);
			var i = {};
			z(() => {
				J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
			}), q(e, n);
		}), A(t), z(() => Q(t, "aria-label", (W(y()), U(() => `設定「${y().title}」的狀態`)))), G("change", t, () => he(H(pe))), Oi(t, () => H(pe), (e) => P(pe, e)), q(e, t);
	}, O = (e) => {
		var t = us(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, (H(p), U(() => `item-status-capsule status-${H(p).tone} is-link`))), Q(t, "href", (H(g), U(() => H(g)[0].href))), Q(t, "title", (H(g), U(() => `開啟等待對象：${H(g)[0].label}`))), J(n, H(m));
		}), q(e, t);
	}, Fe = (e) => {
		var t = ps(), n = F(t), r = F(n, !0);
		A(n);
		var i = L(n, 2), a = (e) => {
			var t = fs();
			X(t, 5, () => H(h), ii, (e, t) => {
				var n = ds(), r = F(n), i = (e) => {
					var n = us(), r = F(n, !0);
					A(n), z(() => {
						Q(n, "href", (H(t), U(() => H(t).href))), J(r, (H(t), U(() => H(t).label)));
					}), G("click", n, (e) => e.stopPropagation()), q(e, n);
				}, a = (e) => {
					var n = es(), r = F(n);
					A(n), z(() => J(r, `${H(t), U(() => H(t).label) ?? ""}（無法讀取）`)), q(e, n);
				};
				Y(r, (e) => {
					H(t), U(() => H(t).href) ? e(i) : e(a, -1);
				}), A(n), q(e, n);
			}), A(t), q(e, t);
		};
		Y(i, (e) => {
			H(me) && e(a);
		}), A(t), z(() => {
			Z(n, 1, (H(p), U(() => `item-status-capsule status-${H(p).tone} is-link`))), Q(n, "aria-expanded", H(me)), J(r, H(m));
		}), G("focusout", t, (e) => {
			e.currentTarget.contains(e.relatedTarget) || P(me, !1);
		}), G("click", n, (e) => {
			e.stopPropagation(), P(me, !H(me));
		}), G("keydown", n, (e) => {
			e.key === "Escape" && P(me, !1);
		}), q(e, t);
	}, k = (e) => {
		var t = es(), n = F(t, !0);
		A(t), z(() => {
			Z(t, 1, (H(p), U(() => `item-status-capsule status-${H(p).tone}`))), J(n, H(m));
		}), q(e, t);
	};
	Y(Ne, (e) => {
		b() ? e(Pe) : (H(h), H(g), U(() => H(h).length === 1 && H(g).length === 1) ? e(O, 1) : (H(g), U(() => H(g).length) ? e(Fe, 2) : e(k, -1)));
	}), A(Me);
	var Ie = L(Me, 2), Le = (e) => {
		var t = ms(), n = F(t);
		A(t), z(() => Q(n, "aria-label", (W(y()), U(() => `刪除子項目：${y().title}`)))), G("click", n, () => S()({
			type: "delete-item",
			taskId: _(),
			field: v(),
			itemId: y().id
		})), q(e, t);
	};
	Y(Ie, (e) => {
		b() && e(Le);
	}), A(Ae), A(_e), hi(_e, (e, t) => oe?.(e, t), () => !!(D() && H(a) && !b())), z(() => {
		ve = Z(_e, 1, "editor-item-row", null, ve, {
			"editable-work-item": b(),
			"item-drop-before": b() && T()?.side === "before",
			"item-drop-after": b() && T()?.side === "after",
			"item-gap-before": !b() && T()?.side === "before",
			"item-gap-after": !b() && T()?.side === "after",
			"item-row-reorderable": !b() && !!T(),
			"item-row-dragging": !!T()?.dragging,
			"is-selected": H(c),
			"is-next": ie()
		}), Q(_e, "data-select-key", H(s) ? H(a) : void 0), Q(_e, "tabindex", H(s) ? 0 : void 0), Q(_e, "draggable", (W(b()), W(T()), U(() => !b() && T()?.armed ? "true" : void 0))), Q(_e, "title", H(o) || void 0);
	}), G("click", _e, function(...e) {
		(H(s) ? (e) => E().rowClick(H(a), e) : void 0)?.apply(this, e);
	}), jr("focus", _e, function(...e) {
		(H(s) ? () => E().rowFocus(H(a)) : void 0)?.apply(this, e);
	}), jr("pointerenter", _e, se), G("pointerdown", _e, function(...e) {
		(b() ? void 0 : T()?.arm)?.apply(this, e);
	}), G("pointerup", _e, function(...e) {
		(b() ? void 0 : T()?.disarm)?.apply(this, e);
	}), jr("dragstart", _e, function(...e) {
		(b() ? void 0 : T()?.start)?.apply(this, e);
	}), jr("dragend", _e, function(...e) {
		(b() ? void 0 : T()?.end)?.apply(this, e);
	}), G("keydown", _e, function(...e) {
		(b() ? void 0 : (e) => {
			if (e.shiftKey && e.key === "Enter" && D() && H(a) && e.target === e.currentTarget) {
				e.preventDefault(), ae();
				return;
			}
			T()?.keydown?.(e), !e.defaultPrevented && H(s) && E().rowKeydown(H(a), e);
		})?.apply(this, e);
	}), jr("dragover", _e, function(...e) {
		(T()?.over)?.apply(this, e);
	}), jr("dragleave", _e, function(...e) {
		(T()?.leave)?.apply(this, e);
	}), jr("drop", _e, function(...e) {
		(T()?.drop)?.apply(this, e);
	}), q(e, _e), Ye(), i();
}
Mr([
	"click",
	"pointerdown",
	"pointerup",
	"keydown",
	"change",
	"input",
	"focusout"
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
var _s = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(_s.levels.map((e) => [e.value, e])));
var vs = _s.fallbackValue;
function ys(e) {
	return _s.normalize(e, vs);
}
function bs(e) {
	return ys(typeof e == "object" && e && !Array.isArray(e) ? e.priority : void 0);
}
function xs(e) {
	return [...e ?? []].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, t) => bs(e.item) - bs(t.item) || e.index - t.index).map(({ item: e }) => e);
}
Object.freeze([
	"status",
	"summary",
	"completed_items",
	"pending_items",
	"progress",
	"priority"
]), Object.freeze(["done", "waiting"]);
function Ss(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Cs(e, t) {
	if (!t) return e;
	let n = (e ?? []).findIndex((e) => Ss(e) && e.id === t);
	return n <= 0 ? e : [
		e[n],
		...e.slice(0, n),
		...e.slice(n + 1)
	];
}
//#endregion
//#region experiments/editor-svelte-spike/src/CopyIdButton.svelte
var ws = /* @__PURE__ */ K("<button type=\"button\"> </button>");
function Ts(e, t) {
	Je(t, !1);
	let n = $(t, "id", 8), r = $(t, "label", 8), i = /* @__PURE__ */ N(""), a;
	async function o(e) {
		e.stopPropagation(), clearTimeout(a);
		let t = await Ho(n());
		P(i, t ? "已複製" : "無法複製"), a = setTimeout(() => {
			P(i, "");
		}, 1500);
	}
	qi();
	var s = ws();
	let c;
	var l = F(s, !0);
	A(s), z(() => {
		c = Z(s, 1, "task-id-copy", null, c, {
			"is-done": H(i),
			"is-copied": H(i) === "已複製"
		}), Q(s, "aria-label", H(i) || `複製「${r()}」的卡片 ID`), Q(s, "title", H(i) || n()), J(l, H(i) === "已複製" ? "✓" : H(i) ? "✕" : "⧉");
	}), G("click", s, o), q(e, s), Ye();
}
Mr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Es = /* @__PURE__ */ K("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Ds = /* @__PURE__ */ K("<div class=\"task-summary\"><!></div>"), Os = /* @__PURE__ */ K("<button type=\"button\" class=\"completed-more\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> </button>"), ks = /* @__PURE__ */ K("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul> <!></section>"), As = /* @__PURE__ */ K("<option> </option>"), js = /* @__PURE__ */ K("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Ms = /* @__PURE__ */ K("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Ns = /* @__PURE__ */ K("<div class=\"spike-add-shell\"><!></div>"), Ps = /* @__PURE__ */ K("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), Fs = /* @__PURE__ */ K("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), Is = /* @__PURE__ */ K("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Ls = /* @__PURE__ */ K("<!> <h3> </h3>", 1), Rs = /* @__PURE__ */ K("<span> </span>"), zs = /* @__PURE__ */ K("<div class=\"task-module-totals\"></div>"), Bs = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), Vs = /* @__PURE__ */ K("<article><!></article>");
function Hs(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "progress", 8), p = $(t, "editing", 8), m = $(t, "policy", 8), h = $(t, "onCommand", 8), g = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let _ = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), v = $(t, "onModuleActivate", 8, () => {}), y = $(t, "moduleOrder", 24, () => ["time"]), b = $(t, "onModuleReorder", 8, () => {}), x = $(t, "statusOrder", 24, () => ["done", "planned"]), S = $(t, "moduleTotals", 24, () => []), C = $(t, "lead", 8, !1), w = $(t, "scopeId", 8, null), ee = $(t, "reorderable", 8, !1), te = $(t, "onReorder", 8, () => {}), ne = $(t, "selection", 8, null), T = $(t, "nextItemId", 8, null), re = $(t, "onSetNext", 8, null), E = /* @__PURE__ */ N(!1), ie = [
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
	], D = /* @__PURE__ */ N(!1), ae = /* @__PURE__ */ N(""), oe = /* @__PURE__ */ N(m().creationDefaultValue), se = /* @__PURE__ */ N(""), ce = /* @__PURE__ */ N(d().status), le = /* @__PURE__ */ N(m().normalize(d().priority, m().fallbackValue));
	function ue() {
		P(D, !1), P(ae, ""), P(oe, m().creationDefaultValue), P(se, "");
	}
	let de = /* @__PURE__ */ N(null), fe = /* @__PURE__ */ N(null), pe = /* @__PURE__ */ N(null);
	function me() {
		P(de, null), P(fe, null), P(pe, null);
	}
	function he(e, t) {
		return m().normalize(e.priority, m().fallbackValue) === m().normalize(t.priority, m().fallbackValue);
	}
	function ge(e, t, n) {
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
	function _e(e, t, n, r, i) {
		let a = t.find((e) => e.id === n);
		return {
			side: r?.id === e.id ? r.after ? "after" : "before" : null,
			armed: i === e.id,
			dragging: n === e.id,
			arm(t) {
				p() || t.button !== 0 || t.pointerType !== "mouse" || t.target.closest("a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg") || P(pe, e.id);
			},
			disarm() {
				H(pe) === e.id && H(de) !== e.id && P(pe, null);
			},
			start(t) {
				t.stopPropagation(), P(de, e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			end: me,
			over(t) {
				if (!a || a.id === e.id || !he(a, e)) return;
				t.preventDefault(), t.stopPropagation(), t.dataTransfer.dropEffect = "move";
				let n = (t.currentTarget.querySelector(".item-row-description") ?? t.currentTarget).getBoundingClientRect();
				P(fe, {
					id: e.id,
					after: t.clientY >= n.top + n.height / 2
				});
			},
			leave(t) {
				!t.currentTarget.contains(t.relatedTarget) && H(fe)?.id === e.id && P(fe, null);
			},
			drop(t) {
				!a || H(fe)?.id !== e.id || (t.preventDefault(), t.stopPropagation(), ge(a.id, e.id, H(fe).after), me());
			},
			keydown(n) {
				if (!n.altKey || !["ArrowUp", "ArrowDown"].includes(n.key)) return;
				n.preventDefault(), n.stopPropagation();
				let r = t.filter((t) => t.id && he(t, e)), i = r[r.findIndex((t) => t.id === e.id) + (n.key === "ArrowUp" ? -1 : 1)];
				if (!i) return;
				let a = CSS.escape(`${d().id}/${e.id}`);
				Promise.resolve(ge(e.id, i.id, n.key === "ArrowDown")).then(() => Cr()).then(() => document.querySelector(`[data-item-ref="${a}"]`)?.focus());
			}
		};
	}
	function ve() {
		let e = g()(H(ae), Number(H(oe)));
		P(se, e.error), H(se) || ue();
	}
	R(() => (W(d()), W(T())), () => {
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
			items: Cs(xs(d().pending_items), T())
		}]);
	}), R(() => (H(n), W(x())), () => {
		P(r, [...H(n)].sort((e, t) => {
			let n = x().indexOf(e.status), r = x().indexOf(t.status);
			return (n < 0 ? x().length : n) - (r < 0 ? x().length : r);
		}));
	}), R(() => (W(m()), W(d())), () => {
		P(i, m().metadata(d().priority));
	}), R(() => W(d()), () => {
		P(ce, d().status);
	}), R(() => (W(m()), W(d())), () => {
		P(le, m().normalize(d().priority, m().fallbackValue));
	}), R(() => W(d()), () => {
		P(a, ie.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), R(() => (W(p()), H(D)), () => {
		!p() && H(D) && ue();
	}), R(() => W(p()), () => {
		p(), me();
	}), Ln(), qi();
	var ye = Vs(), be = F(ye);
	{
		let e = /* @__PURE__ */ j(() => (W(d()), U(() => `task-body-${d().id}`)));
		_o(be, {
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
				var n = Ps(), i = I(n), a = (e) => {
					var t = Es();
					ht(t), z(() => Fi(t, (W(d()), U(() => d().summary)))), G("input", t, (e) => h()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), q(e, t);
				}, o = (e) => {
					var t = Ds();
					Bo(F(t), {
						get text() {
							return W(d()), U(() => d().summary);
						},
						lines: 2,
						emphasis: !0
					}), A(t), q(e, t);
				};
				Y(i, (e) => {
					p() ? e(a) : e(o, -1);
				});
				var s = L(i, 2);
				{
					let e = /* @__PURE__ */ j(() => (W(d()), U(() => d().developer ?? null)));
					No(s, { get developer() {
						return H(e);
					} });
				}
				var c = L(s, 2), l = F(c);
				X(l, 1, () => H(r), (e) => e.status, (e, t) => {
					var n = Hr(), r = I(n), i = (e) => {
						var n = ks(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2);
						X(a, 7, () => (H(t), H(E), U(() => H(t).status === "done" && !H(E) ? H(t).items.slice(0, 1) : H(t).items)), (e) => e.id, (e, n, r) => {
							{
								let i = /* @__PURE__ */ j(() => (W(_()), H(n), U(() => _().get(H(n).id) ?? []))), a = /* @__PURE__ */ j(() => (W(C()), H(t), W(H(r)), H(n), W(T()), U(() => C() && H(t).status === "planned" && H(r) === 0 || H(n).id === T()))), o = /* @__PURE__ */ j(() => (H(n), W(T()), U(() => H(n).id === T()))), s = /* @__PURE__ */ j(() => (W(p()), H(n), W(re()), U(() => !p() && H(n).id && !H(n).legacy ? re() : null))), c = /* @__PURE__ */ j(() => p() ? null : ne()), l = /* @__PURE__ */ j(() => (W(p()), W(ee()), H(t), H(n), H(de), H(fe), H(pe), U(() => (p() || ee()) && H(t).status === "planned" && H(n).id && !H(n).legacy ? _e(H(n), H(t).items, H(de), H(fe), H(pe)) : null)));
								gs(e, {
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
										return p();
									},
									get policy() {
										return m();
									},
									get onCommand() {
										return h();
									},
									get moduleCapsules() {
										return H(i);
									},
									get statuses() {
										return ie;
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
										return H(a);
									},
									get isNext() {
										return H(o);
									},
									get onSetNext() {
										return H(s);
									},
									get scopeId() {
										return w();
									},
									get selection() {
										return H(c);
									},
									get reorder() {
										return H(l);
									}
								});
							}
						}), A(a);
						var o = L(a, 2), s = (e) => {
							var n = Os(), r = F(n), i = F(r);
							A(r);
							var a = L(r);
							A(n), z(() => {
								Q(n, "aria-expanded", H(E)), Q(n, "aria-controls", (W(d()), H(t), U(() => `task-${d().id}-${H(t).field}`))), Q(i, "d", H(E) ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"), J(a, ` ${H(E), H(t), U(() => H(E) ? "收合" : `顯示更多（${H(t).items.length - 1}項）`) ?? ""}`);
							}), G("click", n, () => P(E, !H(E))), q(e, n);
						};
						Y(o, (e) => {
							H(t), U(() => H(t).status === "done" && H(t).items.length > 1) && e(s);
						}), A(n), z(() => {
							Z(n, 1, (H(t), U(() => `detail-section ${H(t).className}`))), J(i, (H(t), U(() => H(t).title))), Q(a, "id", (W(d()), H(t), U(() => `task-${d().id}-${H(t).field}`)));
						}), q(e, n);
					};
					Y(r, (e) => {
						H(t), W(p()), U(() => H(t).items.length || p()) && e(i);
					}), q(e, n);
				});
				var u = L(l, 2), f = F(u), g = (e) => {
					var t = Ns(), n = F(t), r = (e) => {
						var t = js(), n = F(t);
						Pi(n);
						var r = L(n, 2);
						X(r, 5, () => (W(m()), U(() => m().levels)), (e) => e.value, (e, t) => {
							var n = As(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(m()), H(t), U(() => m().format(H(t).value)))]), q(e, n);
						}), A(r);
						var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = F(o, !0);
						A(o), A(t), z(() => {
							Q(o, "hidden", !H(se)), J(s, H(se));
						}), G("keydown", n, (e) => {
							e.key === "Enter" && ve(), e.key === "Escape" && ue();
						}), Bi(n, () => H(ae), (e) => P(ae, e)), Oi(r, () => H(oe), (e) => P(oe, e)), G("click", i, ve), G("click", a, ue), q(e, t);
					}, i = (e) => {
						var t = Ms();
						z(() => Q(t, "aria-label", (W(d()), U(() => `在「${d().title}」新增子項目`)))), G("click", t, () => {
							P(D, !0);
						}), q(e, t);
					};
					Y(n, (e) => {
						H(D) ? e(r) : e(i, -1);
					}), A(t), q(e, t);
				};
				Y(f, (e) => {
					p() && e(g);
				}), A(u), A(c), q(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = Bs(), r = F(n), i = F(r), o = (e) => {
						var t = Fs(), n = F(t);
						X(n, 5, () => ie, (e) => e.value, (e, t) => {
							var n = As(), r = F(n, !0);
							A(n);
							var i = {};
							z(() => {
								J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}), q(e, n);
						}), A(n);
						var r = L(n, 2);
						X(r, 5, () => (W(m()), U(() => m().levels)), (e) => e.value, (e, t) => {
							var n = As(), r = F(n, !0);
							A(n);
							var i = {};
							z((e) => {
								J(r, e), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
							}, [() => (W(m()), H(t), U(() => m().format(H(t).value)))]), q(e, n);
						}), A(r), A(t), z(() => {
							Q(n, "aria-label", (W(d()), U(() => `${d().title} 狀態`))), Q(r, "aria-label", (W(d()), U(() => `${d().title} 優先級`)));
						}), G("change", n, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "status",
							value: H(ce)
						})), Oi(n, () => H(ce), (e) => P(ce, e)), G("change", r, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(H(le))
						})), Oi(r, () => H(le), (e) => P(le, e)), q(e, t);
					};
					Y(i, (e) => {
						p() && e(o);
					});
					var s = L(i, 2), c = F(s), l = (e) => {
						var t = Is();
						Pi(t), z(() => {
							Q(t, "id", (W(d()), U(() => `task-${d().id}-title`))), Fi(t, (W(d()), U(() => d().title)));
						}), G("input", t, (e) => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), q(e, t);
					}, u = (e) => {
						var t = Ls(), n = I(t);
						Ts(n, {
							get id() {
								return W(d()), U(() => d().id);
							},
							get label() {
								return W(d()), U(() => d().title);
							}
						});
						var r = L(n, 2), i = F(r, !0);
						A(r), z(() => {
							Q(r, "id", (W(d()), U(() => `task-${d().id}-title`))), J(i, (W(d()), U(() => d().title)));
						}), q(e, t);
					};
					Y(c, (e) => {
						p() ? e(l) : e(u, -1);
					}), A(s);
					var g = L(s, 2), _ = (e) => {
						var t = zs();
						X(t, 5, S, (e) => e.id, (e, t) => {
							var n = Rs(), r = F(n, !0);
							A(n), z(() => {
								Z(n, 1, (H(t), U(() => `task-module-total task-module-total-${H(t).id}`))), J(r, (H(t), U(() => H(t).label)));
							}), q(e, n);
						}), A(t), q(e, t);
					};
					Y(g, (e) => {
						W(S()), U(() => S().length) && e(_);
					}), A(r);
					var v = L(r, 2), y = F(v), b = F(y);
					A(y);
					var x = L(y, 2), C = F(x, !0);
					A(x);
					var w = L(x, 2), ee = F(w, !0);
					A(w), A(v), A(n), z(() => {
						Q(y, "aria-label", (W(f()), U(() => `子項目完成 ${f().completed}，共 ${f().total}`))), J(b, `${W(f()), U(() => f().completed) ?? ""} / ${W(f()), U(() => f().total) ?? ""}`), Z(x, 1, (H(a), U(() => `status-badge status-${H(a).tone}`))), J(C, (H(a), U(() => H(a).label))), J(ee, (W(d()), U(() => d().id)));
					}), q(e, n);
				}
			}
		});
	}
	A(ye), z(() => {
		Z(ye, 1, (H(i), U(() => `task-card editor-task-card priority-${H(i)?.tone ?? "unspecified"}`))), Q(ye, "aria-labelledby", (W(d()), U(() => `task-${d().id}-title`)));
	}), q(e, ye), Ye();
}
Mr([
	"input",
	"click",
	"keydown",
	"change"
]);
//#endregion
//#region viewer/assets/icon-choice.js
function Us(e, t) {
	let n = e.filter((e) => e.kind !== "action");
	return n.length ? n[(n.findIndex((e) => e.id === t) + 1) % n.length].id : void 0;
}
function Ws(e, t, n) {
	return n === "adjacent" ? e.filter((e) => e.id !== t) : e;
}
//#endregion
//#region experiments/editor-svelte-spike/src/IconChoice.svelte
var Gs = /* @__PURE__ */ K("<button type=\"button\" tabindex=\"-1\"><!></button>"), Ks = /* @__PURE__ */ K("<div role=\"group\"></div>"), qs = /* @__PURE__ */ K("<div class=\"icon-choice\" role=\"group\"><button class=\"card-toolbar-icon\" type=\"button\"><!></button> <!></div>");
function Js(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(), m = /* @__PURE__ */ N(), h = /* @__PURE__ */ N(!1), g = /* @__PURE__ */ N(!1), _ = /* @__PURE__ */ N(!1), v = /* @__PURE__ */ N(null), y = /* @__PURE__ */ N(0), b = /* @__PURE__ */ N(0), x = /* @__PURE__ */ N(!1), S = /* @__PURE__ */ N(null), C = 0;
	function w(e = !1) {
		clearTimeout(H(m)), C++, H(S) !== null && H(f)?.hasPointerCapture(H(S)) && H(f).releasePointerCapture(H(S)), P(S, null), P(h, !1), P(g, !1), P(v, null), P(x, !1), e && H(f)?.focus();
	}
	function ee(e) {
		w(!0), u()(e);
	}
	async function te(e = !1) {
		if (!H(r).length) return;
		P(h, !0), P(x, !1);
		let t = ++C;
		if (await Cr(), !H(h) || t !== C || !H(p)) return;
		let n = H(f).getBoundingClientRect(), i = H(p).getBoundingClientRect(), o = [...H(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (P(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), P(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (P(y, n.right + 4), H(y) + i.width > window.innerWidth - 4 && P(y, n.left - i.width - 4), P(b, n.top + (n.height - i.height) / 2)) : (P(y, n.left + (n.width - i.width) / 2), P(b, n.bottom + 4), H(b) + i.height > window.innerHeight - 4 && P(b, n.top - i.height - 4)), P(y, Math.max(4, Math.min(H(y), window.innerWidth - i.width - 4))), P(b, Math.max(4, Math.min(H(b), window.innerHeight - i.height - 4))), P(x, !0), await Cr(), e && H(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function ne(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && H(p)?.contains(t) ? t.dataset.choice : null;
	}
	function T(e) {
		if (clearTimeout(H(m)), H(S) !== null) {
			if (H(g)) {
				let t = ne(e);
				P(_, !0), t === null ? w(!0) : ee(H(r).find((e) => String(e.id) === t).id);
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
			te(!0);
			return;
		}
		let n = [...H(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function E() {
		H(S) !== null && P(_, !0), w(H(d)?.contains(document.activeElement));
	}
	ei(() => clearTimeout(H(m))), R(() => (W(i()), W(a())), () => {
		P(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), R(() => (W(i()), W(a()), W(l())), () => {
		P(r, Ws(i(), a(), l()));
	}), Ln(), qi();
	var ie = qs();
	jr("pointerdown", mn, (e) => {
		H(d)?.contains(e.target) || w();
	}), jr("resize", mn, E), jr("blur", mn, E), jr("scroll", hn, (e) => {
		H(p)?.contains(e.target) || E();
	}, !0);
	var D = F(ie);
	let ae;
	pi(F(D), t, "icon", { get item() {
		return H(n);
	} }, null), A(D), Ki(D, (e) => P(f, e), () => H(f));
	var oe = L(D, 2), se = (e) => {
		var n = Ks();
		let i, s;
		X(n, 5, () => H(r), (e) => e.id, (e, n) => {
			var r = Gs();
			let i;
			pi(F(r), t, "icon", { get item() {
				return H(n);
			} }, null), A(r), z((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (H(n), U(() => H(n).id))), Q(r, "aria-label", (H(n), U(() => H(n).label))), Q(r, "title", (H(n), U(() => H(n).label))), Q(r, "aria-pressed", (H(n), W(a()), U(() => H(n).kind === "action" ? void 0 : H(n).id === a())));
			}, [() => ({ "icon-choice-hover": H(v) === String(H(n).id) })]), G("keydown", r, re), G("click", r, () => ee(H(n).id)), q(e, r);
		}), A(n), Ki(n, (e) => P(p, e), () => H(p)), z(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = Ti(n, "", s, {
				left: `${H(y)}px`,
				top: `${H(b)}px`,
				visibility: H(x) ? "visible" : "hidden"
			});
		}), q(e, n);
	};
	Y(oe, (e) => {
		H(h) && e(se);
	}), A(ie), Ki(ie, (e) => P(d, e), () => H(d)), z(() => {
		Q(ie, "aria-label", o()), Q(D, "aria-label", (W(o()), H(n), U(() => `${o()}：${H(n)?.label ?? ""}`))), Q(D, "aria-expanded", s() === "cycle" ? void 0 : H(h)), Q(D, "title", (W(o()), H(n), W(s()), U(() => `${o()}：${H(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), D.disabled = !H(n), ae = Ti(D, "", ae, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), G("focusout", ie, (e) => {
		H(d).contains(e.relatedTarget) || w();
	}), G("keydown", D, re), G("pointerdown", D, (e) => {
		e.button === 0 && (P(_, !1), !(s() === "cycle" || H(h)) && (P(S, e.pointerId), H(f).setPointerCapture(H(S)), clearTimeout(H(m)), P(m, setTimeout(() => {
			P(g, !0), te();
		}, 300))));
	}), G("pointermove", D, (e) => {
		H(g) && P(v, ne(e));
	}), G("pointerup", D, T), jr("pointercancel", D, E), G("click", D, () => {
		if (H(_)) {
			P(_, !1);
			return;
		}
		if (H(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") te(!0);
		else {
			let e = Us(i(), a());
			e !== void 0 && u()(e);
		}
	}), q(e, ie), Ye();
}
Mr([
	"focusout",
	"keydown",
	"pointerdown",
	"pointermove",
	"pointerup",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/VisibilityMenu.svelte
var Ys = /* @__PURE__ */ Br("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 10a9 9 0 1 1 2 8M3 4v6h6\"></path></svg>");
function Xs(e, t) {
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
	Js(e, {
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
			var r = Hr(), i = I(r), a = (e) => {
				q(e, Ys());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "closed"))), r = /* @__PURE__ */ j(() => (W(H(n)), U(() => H(n)?.id === "disabled")));
					mo(e, {
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
function Zs(e, t, n) {
	return t === "closed" ? !1 : t !== "enabled" || !n.includes(e);
}
function Qs(e, t, n) {
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
function $s(e, t) {
	let n = [...new Set(t)];
	if (!Array.isArray(e)) return n;
	let r = new Set(n), i = /* @__PURE__ */ new Set(), a = [];
	return e.forEach((e) => {
		!r.has(e) || i.has(e) || (i.add(e), a.push(e));
	}), n.forEach((e) => {
		i.has(e) || a.push(e);
	}), a;
}
function ec(e, t, n, r = !1) {
	if (t === n || !e.includes(t) || !e.includes(n)) return [...e];
	let i = e.filter((e) => e !== t), a = i.indexOf(n);
	return i.splice(a + +!!r, 0, t), i;
}
//#endregion
//#region viewer/assets/card-order.js
function tc(e, t) {
	return [t, ...e.filter((e) => e !== t)];
}
function nc(e, t, n, r = [], i = null) {
	let a = n === "free" ? rc(e, t) : n === "reverse" ? [...e].reverse() : e, o = new Map(e.map((e) => [e.id, e])), s = new Set(r), c = r.length ? [...s].filter((e) => o.has(e)).map((e) => o.get(e)).concat(a.filter((e) => !s.has(e.id))) : a;
	return i === null || !o.has(i) ? c : [o.get(i), ...c.filter((e) => e.id !== i)];
}
function rc(e, t) {
	if (!t) return e;
	let n = new Map(t.map((e, t) => [e, t]));
	return [...e].sort((e, r) => (n.get(e.id) ?? t.length) - (n.get(r.id) ?? t.length));
}
function ic(e, t, n, r, i, a) {
	let o = $s(t, e), s = new Set(n), c = ec(o.filter((e) => s.has(e)), r, i, a), l = 0;
	return o.map((e) => s.has(e) ? c[l++] : e);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardList.svelte
var ac = /* @__PURE__ */ Br("<path d=\"M4 5h15M4 10h8M4 15h17M4 20h11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>"), oc = /* @__PURE__ */ Br("<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"></path>", 1), sc = /* @__PURE__ */ Br("<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\"><!></svg>"), cc = /* @__PURE__ */ K("<button type=\"button\"><svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path d=\"M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button>"), lc = /* @__PURE__ */ K("<div role=\"group\" tabindex=\"0\"><!> <!></div>"), uc = /* @__PURE__ */ K("<p class=\"card-list-hidden\"><button type=\"button\" class=\"card-list-hidden-link\"> </button></p>"), dc = /* @__PURE__ */ K("<div class=\"card-list-controls\"><div class=\"card-list-heading\"><p class=\"section-kicker\">工作項目</p> <!></div> <div class=\"card-list-tools\"><button type=\"button\" class=\"card-toolbar-icon\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button> <!> <!> <span role=\"status\"> </span> <!></div></div> <div class=\"arrangeable-cards\"></div> <!>", 1);
function fc(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null), f = $(t, "nextId", 8, null), p = $(t, "hiddenCount", 8, 0), m = $(t, "onShowHidden", 8, null);
	function h(e = o()) {
		return nc(e, H(re), H(b), l() ? H(g) : [], f()).map((e) => e.id);
	}
	let g = /* @__PURE__ */ N([]), _ = null, v = $(t, "expanded", 8, !0), y = $(t, "onToggleAll", 8, () => {}), b = /* @__PURE__ */ N("forward"), x = [
		"forward",
		"reverse",
		"free"
	], S = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, C = /* @__PURE__ */ N("disabled"), w = /* @__PURE__ */ N([]);
	function ee() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: H(C),
				hiddenIds: H(w)
			}));
		} catch {}
	}
	function te(e) {
		let t = Qs(H(C), H(w), e);
		P(C, t.mode), P(w, t.hiddenIds), ge(), ee();
	}
	function ne(e, t) {
		P(w, t ? H(w).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...H(w), e])]), ge(), ee();
	}
	function T(e) {
		H(C) === "closed" && P(C, "enabled"), ne(e, !0);
	}
	let re = /* @__PURE__ */ N(null), E = /* @__PURE__ */ N(null), ie = /* @__PURE__ */ N(null), D = /* @__PURE__ */ N(null), ae = /* @__PURE__ */ N(null), oe = /* @__PURE__ */ N(), se = /* @__PURE__ */ N("");
	function ce(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (_ !== i) {
			if (_ = i, !n.includes(e)) {
				P(se, `找不到卡片 ID：${e}`);
				return;
			}
			P(g, tc(H(g), e)), T(e), le();
		}
	}
	function le() {
		if (!c()) {
			P(se, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(H(g))), P(se, "已記住本機釘選");
		} catch {
			P(se, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function ue(e) {
		ge(), P(g, H(g).includes(e) ? H(g).filter((t) => t !== e) : tc(H(g), e)), le();
	}
	function de(e) {
		if (_ = null, P(g, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			P(g, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (P(C, "disabled"), P(w, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			P(C, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), P(w, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (P(E, null), P(ie, null), P(D, null), P(ae, null), !e) {
			P(re, null), P(b, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			P(re, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			P(b, x.includes(n) ? n : H(re) ? "free" : "forward");
		} catch {
			P(re, null), P(b, "forward");
		}
	}
	function fe(e) {
		if (P(re, e), !c()) {
			P(se, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), P(se, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			P(se, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function pe(e) {
		if (ge(), P(b, e), P(se, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, H(b));
		} catch {
			P(se, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function me(e, t, n) {
		H(b) === "free" && (l() && (H(g).includes(e) || H(g).includes(t)) || e !== t && (fe(ic(s(), H(re), H(r).map((e) => e.id), e, t, n)), P(E, e), await Cr(), [...H(oe).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function he(e, t) {
		let n = H(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = H(r)[n + t];
		i && me(e, i.id, t > 0);
	}
	function ge() {
		P(ie, null), P(D, null), P(ae, null);
	}
	function _e(e, t) {
		if (l() && H(g).includes(e.id) || H(D) === null || H(D) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		P(ae, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	R(() => H(C), () => {
		P(n, H(C) === "enabled");
	}), R(() => (W(o()), H(re), H(b), W(l()), H(g), W(f()), W(d())), () => {
		P(i, rc(nc(o(), H(re), H(b), l() ? H(g) : [], f()), d()));
	}), R(() => (H(i), H(C), H(w), W(l()), H(g)), () => {
		P(r, H(i).filter((e) => Zs(e.id, H(C), H(w)) && !(l() && H(g).includes(e.id))));
	}), R(() => W(c()), () => {
		de(c());
	}), R(() => (H(i), H(C), H(w)), () => {
		P(a, H(i).find((e) => Zs(e.id, H(C), H(w)))?.id ?? null);
	}), R(() => (W(u()), W(c()), W(s()), W(l())), () => {
		ce(u(), c(), s(), l());
	}), Ln();
	var ve = {
		orderedIds: h,
		revealCard: T
	};
	qi();
	var ye = dc(), be = I(ye), xe = F(be);
	pi(L(F(xe), 2), t, "filters", {}, null), A(xe);
	var Se = L(xe, 2), Ce = F(Se), we = F(Ce), Te = F(we);
	A(we), A(Ce);
	var Ee = L(Ce, 2);
	{
		let e = /* @__PURE__ */ j(() => U(() => x.map((e) => ({
			id: e,
			label: S[e]
		}))));
		Js(Ee, {
			get items() {
				return H(e);
			},
			get value() {
				return H(b);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: pe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ j(() => t.item);
				var r = sc(), i = F(r), a = (e) => {
					q(e, ac());
				}, o = (e) => {
					var t = oc(), r = I(t), i = L(r);
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
	var De = L(Ee, 2);
	Xs(De, {
		get mode() {
			return H(C);
		},
		onChoose: te
	});
	var Oe = L(De, 2), ke = F(Oe, !0);
	A(Oe), pi(L(Oe, 2), t, "tools", {}, null), A(Se), A(be);
	var Ae = L(be, 2);
	X(Ae, 5, () => H(i), (e) => e.id, (e, r) => {
		var i = lc();
		let o;
		var s = F(i), c = (e) => {
			var t = cc();
			let n;
			var i = F(t), a = F(i);
			A(i), A(t), z((e, r, i, o, s) => {
				n = Z(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({
					"is-pinned": H(g).includes(H(r).id),
					"is-next": f() !== null && H(r).id === f()
				}),
				() => (H(g), H(r), U(() => H(g).includes(H(r).id) ? `取消釘選：${H(r).title}` : `釘選置頂：${H(r).title}`)),
				() => (H(g), H(r), U(() => H(g).includes(H(r).id))),
				() => (H(g), H(r), U(() => H(g).includes(H(r).id) ? "取消釘選" : "釘選置頂")),
				() => (H(g), H(r), W(f()), U(() => H(g).includes(H(r).id) || f() !== null && H(r).id === f() ? "currentColor" : "none"))
			]), G("click", t, () => ue(H(r).id)), q(e, t);
		};
		Y(s, (e) => {
			l() && e(c);
		});
		var u = L(s, 2);
		{
			let e = /* @__PURE__ */ j(() => (H(w), H(r), U(() => !H(w).includes(H(r).id))));
			pi(u, t, "default", {
				get item() {
					return H(r);
				},
				get lead() {
					return H(r), H(a), U(() => H(r).id === H(a));
				},
				get visibilityEnabled() {
					return H(n);
				},
				get visible() {
					return H(e);
				},
				onVisibleChange: (e) => ne(H(r).id, e)
			}, null);
		}
		A(i), z((e) => {
			Q(i, "hidden", e), o = Z(i, 1, "arrangeable-card", null, o, {
				"card-selected": H(E) === H(r).id,
				"card-drop-before": H(ae)?.id === H(r).id && !H(ae).after,
				"card-drop-after": H(ae)?.id === H(r).id && H(ae).after
			}), Q(i, "aria-label", (H(r), H(E), U(() => `${H(r).title}${H(E) === H(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (H(r), U(() => H(r).id))), Q(i, "draggable", (H(b), H(ie), H(r), U(() => H(b) === "free" && H(ie) === H(r).id)));
		}, [() => (W(Zs), H(r), H(C), H(w), U(() => !Zs(H(r).id, H(C), H(w))))]), G("pointerdown", i, (e) => {
			P(ie, null), e.button === 0 && (P(E, H(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (H(b) !== "free" || e.pointerType !== "mouse" || l() && H(g).includes(H(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || P(ie, H(r).id)));
		}), G("focusin", i, () => {
			P(E, H(r).id);
		}), G("input", i, () => {
			P(E, H(r).id);
		}), G("pointerup", i, () => {
			P(ie, null);
		}), G("keydown", i, (e) => {
			e.target === e.currentTarget && (e.key === "Enter" || e.key === " " ? (e.preventDefault(), P(E, H(r).id)) : e.key === "Escape" && P(E, null), H(b) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), he(H(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), jr("dragstart", i, (e) => {
			H(b) === "free" && H(ie) === H(r).id && e.target === e.currentTarget && (P(D, H(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(H(r).id)));
		}), jr("dragend", i, ge), jr("dragover", i, (e) => _e(H(r), e)), jr("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || P(ae, null);
		}), jr("drop", i, (e) => {
			H(D) !== null && H(ae)?.id === H(r).id && (e.preventDefault(), me(H(D), H(r).id, H(ae).after), ge());
		}), q(e, i);
	}), A(Ae), Ki(Ae, (e) => P(oe, e), () => H(oe));
	var je = L(Ae, 2), Me = (e) => {
		var t = uc(), n = F(t), r = F(n);
		A(n), A(t), z(() => J(r, `…顯示隱藏項目(${p() ?? ""})`)), G("click", n, function(...e) {
			m()?.apply(this, e);
		}), q(e, t);
	};
	return Y(je, (e) => {
		p() > 0 && m() && e(Me);
	}), z(() => {
		Q(Ce, "aria-label", v() ? "全部收合" : "全部展開"), Q(Ce, "title", v() ? "全部收合" : "全部展開"), Q(Te, "d", v() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), J(ke, H(se));
	}), G("click", Ce, () => y()(!v())), q(e, ye), Wi(t, "orderedIds", h), Wi(t, "revealCard", T), Ye(ve);
}
Mr([
	"click",
	"pointerdown",
	"focusin",
	"input",
	"pointerup",
	"keydown"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ReportPointerCard.svelte
var pc = /* @__PURE__ */ K("<li class=\"pointer-card-row\"><span class=\"pointer-card-row-title\"> </span> <span> </span></li>"), mc = /* @__PURE__ */ K("<div class=\"task-summary\"><!></div> <p class=\"pointer-card-progress\"> </p> <ul class=\"pointer-card-rows\"></ul>", 1), hc = /* @__PURE__ */ K("<a class=\"pointer-card-title-link\"> </a>"), gc = /* @__PURE__ */ K("<a class=\"pointer-card-badge\">開啟專案報告 →</a>"), _c = /* @__PURE__ */ K("<strong class=\"task-fraction\"> </strong>"), vc = /* @__PURE__ */ K("<span> </span>"), yc = /* @__PURE__ */ K("<span role=\"status\">讀取目標報告中…</span>"), bc = /* @__PURE__ */ K("<span class=\"pointer-card-error\" role=\"alert\"> </span>"), xc = /* @__PURE__ */ K("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-title-line\"><h3><!></h3></div> <!></div> <div class=\"task-header-meta\"><!> <!> <!> <!></div></header>"), Sc = /* @__PURE__ */ K("<article><!></article>");
function Cc(e, t) {
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
	}), Ln(), qi();
	var p = Sc(), m = F(p);
	{
		let e = /* @__PURE__ */ j(() => (W(l()), U(() => `task-body-${l().id}`)));
		_o(m, {
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
				var r = Hr(), i = I(r), a = (e) => {
					var t = mc(), r = I(t);
					Bo(F(r), {
						get text() {
							return H(n), U(() => H(n).summary);
						},
						emphasis: !0
					}), A(r);
					var i = L(r, 2), a = F(i);
					A(i);
					var o = L(i, 2);
					X(o, 5, () => (H(n), U(() => H(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ j(() => (H(t), U(() => f(H(t).status))));
						var r = pc(), i = F(r), a = F(i, !0);
						A(i);
						var o = L(i, 2), s = F(o, !0);
						A(o), A(r), z(() => {
							J(a, (H(t), U(() => H(t).title))), Z(o, 1, (W(H(n)), U(() => `status-badge status-${H(n).tone}`))), J(s, (W(H(n)), U(() => H(n).label)));
						}), q(e, r);
					}), A(o), z(() => {
						Q(i, "aria-label", (H(n), U(() => `子任務完成 ${H(n).progress.completed}，共 ${H(n).progress.total}`))), J(a, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}（${H(n), U(() => H(n).progress.percentage) ?? ""}%）`);
					}), q(e, t);
				};
				Y(i, (e) => {
					H(n) && e(a);
				}), q(e, r);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var i = xc(), a = F(i), o = F(a), s = F(o), c = F(s), d = (e) => {
						var t = hc(), n = F(t, !0);
						A(t), z(() => {
							Q(t, "href", (W(u()), U(() => u().openHref))), J(n, (W(l()), U(() => l().title)));
						}), q(e, t);
					}, f = (e) => {
						var t = Vr();
						z(() => J(t, (W(l()), U(() => l().title)))), q(e, t);
					};
					Y(c, (e) => {
						W(u()), U(() => u().openHref) ? e(d) : e(f, -1);
					}), A(s), A(o);
					var p = L(o, 2), m = (e) => {
						var t = gc();
						z(() => Q(t, "href", (W(u()), U(() => u().openHref)))), q(e, t);
					};
					Y(p, (e) => {
						W(u()), U(() => u().openHref) && e(m);
					}), A(a);
					var h = L(a, 2), g = F(h), _ = (e) => {
						var t = _c(), r = F(t);
						A(t), z(() => J(r, `${H(n), U(() => H(n).progress.completed) ?? ""} / ${H(n), U(() => H(n).progress.total) ?? ""}`)), q(e, t);
					};
					Y(g, (e) => {
						H(n) && e(_);
					});
					var v = L(g, 2), y = (e) => {
						var t = vc(), n = F(t, !0);
						A(t), z(() => {
							Z(t, 1, (H(r), U(() => `status-badge status-${H(r).tone}`))), J(n, (H(r), U(() => H(r).label)));
						}), q(e, t);
					};
					Y(v, (e) => {
						H(r) && e(y);
					});
					var b = L(v, 2), x = (e) => {
						q(e, yc());
					};
					Y(b, (e) => {
						W(u()), U(() => u().status === "loading") && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = bc(), n = F(t, !0);
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
var wc = /* @__PURE__ */ K("<span class=\"task-search\"><input type=\"search\" aria-label=\"搜尋任務卡名稱、摘要與子項\" placeholder=\"搜尋名稱、摘要、子項\"/> <svg class=\"task-search-icon\" viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><circle cx=\"7\" cy=\"7\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"></circle><path d=\"M10.4 10.4 14 14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg></span>"), Tc = /* @__PURE__ */ K("<p class=\"empty-state\"> </p>"), Ec = /* @__PURE__ */ K("<!> <!>", 1);
function Dc(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = $(t, "filters", 8, null), i = $(t, "tasks", 24, () => []), a = $(t, "allIds", 24, () => []), o = $(t, "cardStorageKey", 8, null), s = $(t, "requestedPin", 8, null), c = $(t, "scopeId", 8, null), l = $(t, "searchQuery", 8, ""), u = $(t, "onSearch", 8, null), d = $(t, "reorderable", 8, !1), f = $(t, "onReorder", 8, () => {}), p = $(t, "selection", 8, null), m = $(t, "progress", 24, () => ({})), h = $(t, "editing", 8, !1), g = $(t, "policy", 8), _ = $(t, "onCommand", 8, () => {}), v = $(t, "onAddItem", 8, () => {}), y = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), b = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), x = $(t, "onModuleActivate", 8, () => {}), S = $(t, "moduleOrder", 24, () => ["time"]), C = $(t, "onModuleReorder", 8, () => {}), w = $(t, "moduleTotals", 24, () => ({})), ee = $(t, "statusOrder", 24, () => ["done", "planned"]), te = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), ne = $(t, "pointerCards", 24, () => ({})), T = $(t, "nextTaskId", 8, null), re = $(t, "nextItemId", 8, null), E = $(t, "onSetNext", 8, null), ie = $(t, "hiddenCount", 8, 0), D = $(t, "onShowHidden", 8, null), ae = /* @__PURE__ */ N(!0), oe = /* @__PURE__ */ N({}), se = null;
	function ce(e, t) {
		!e || se === JSON.stringify([t, e]) || (se = JSON.stringify([t, e]), P(oe, {
			...H(oe),
			[e]: !0
		}));
	}
	function le(e) {
		se = null;
		let t = so(e);
		P(ae, t.expanded), P(oe, t.overrides);
	}
	function ue(e, t) {
		P(oe, {
			...H(oe),
			[e]: t
		}), co(H(n), H(ae), H(oe));
	}
	function de(e) {
		P(ae, e), P(oe, {}), co(H(n), H(ae), H(oe));
	}
	R(() => W(o()), () => {
		P(n, `taskprogress.disclosure:${o() ?? location.href}`);
	}), R(() => H(n), () => {
		le(H(n));
	}), R(() => (W(s()), H(n)), () => {
		ce(s(), H(n));
	}), Ln(), qi();
	var fe = Ec(), pe = I(fe);
	fc(pe, {
		pinEnabled: !0,
		get requestedPin() {
			return s();
		},
		get nextId() {
			return T();
		},
		get hiddenCount() {
			return ie();
		},
		get onShowHidden() {
			return D();
		},
		get expanded() {
			return H(ae);
		},
		onToggleAll: de,
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
				let n = /* @__PURE__ */ j(() => t.item), r = /* @__PURE__ */ j(() => t.lead), i = /* @__PURE__ */ j(() => t.visibilityEnabled), a = /* @__PURE__ */ j(() => t.visible), o = /* @__PURE__ */ j(() => t.onVisibleChange);
				var s = Hr(), l = I(s), u = (e) => {
					{
						let t = /* @__PURE__ */ j(() => (H(oe), W(H(n)), H(ae), U(() => H(oe)[H(n).id] ?? H(ae)))), r = /* @__PURE__ */ j(() => (W(ne()), W(H(n)), U(() => ne()[H(n).id] ?? { status: "loading" })));
						Cc(e, {
							get visibilityEnabled() {
								return H(i);
							},
							get visible() {
								return H(a);
							},
							get onVisibleChange() {
								return H(o);
							},
							get expanded() {
								return H(t);
							},
							onToggle: (e) => ue(H(n).id, e),
							get task() {
								return H(n);
							},
							get state() {
								return H(r);
							}
						});
					}
				}, te = (e) => {
					{
						let t = /* @__PURE__ */ j(() => (H(oe), W(H(n)), H(ae), U(() => H(oe)[H(n).id] ?? H(ae)))), s = /* @__PURE__ */ j(() => (W(y()), W(H(n)), U(() => y().get(H(n).id) ?? null))), l = /* @__PURE__ */ j(() => (W(w()), W(H(n)), U(() => w()[H(n).id] ?? [])));
						Hs(e, {
							get visibilityEnabled() {
								return H(i);
							},
							get visible() {
								return H(a);
							},
							get onVisibleChange() {
								return H(o);
							},
							get expanded() {
								return H(t);
							},
							onToggle: (e) => ue(H(n).id, e),
							get task() {
								return H(n);
							},
							get progress() {
								return W(m()), W(H(n)), U(() => m()[H(n).id]);
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
							onAddItem: (e, t) => v()(H(n).id, e, t),
							get timeTask() {
								return H(s);
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
								return H(l);
							},
							get lead() {
								return H(r);
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
				Y(l, (e) => {
					W(H(n)), U(() => H(n).kind === "report_pointer") ? e(u) : e(te, -1);
				}), q(e, s);
			},
			filters: (e, t) => {
				var n = Hr(), i = I(n), a = (e) => {
					io(e, Xi(r));
				};
				Y(i, (e) => {
					r() && e(a);
				}), q(e, n);
			},
			tools: (e, t) => {
				var n = Hr(), r = I(n), i = (e) => {
					var t = wc(), n = F(t);
					Pi(n), Re(2), A(t), z(() => Fi(n, l())), G("input", n, (e) => u()(e.currentTarget.value)), q(e, t);
				};
				Y(r, (e) => {
					u() && e(i);
				}), q(e, n);
			}
		}
	});
	var me = L(pe, 2), he = (e) => {
		var t = Tc(), n = F(t, !0);
		A(t), z(() => J(n, te())), q(e, t);
	};
	Y(me, (e) => {
		W(i()), U(() => !i().length) && e(he);
	}), q(e, fe), Ye();
}
Mr(["input"]);
//#endregion
//#region viewer/assets/theme-model.js
var Oc = [
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
], kc = Object.freeze({
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
var Ac = /^#[0-9a-f]{6}$/i;
function jc(e) {
	return typeof e == "string" && Ac.test(e);
}
function Mc(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = kc[n], i = { base: n };
	for (let e of Oc) {
		let n = t[e.key];
		i[e.key] = jc(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Nc(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Pc(e, t) {
	if (!jc(e) || !jc(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Nc(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Fc(e) {
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
	].filter(([, e, t]) => Pc(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var Ic = /* @__PURE__ */ K("<option> </option>"), Lc = /* @__PURE__ */ K("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), Rc = /* @__PURE__ */ K("<p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div>", 1), zc = /* @__PURE__ */ K("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <!>", 1);
function Bc(e, t) {
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ N(!1), p = /* @__PURE__ */ N([]), m = /* @__PURE__ */ N(a()), h = /* @__PURE__ */ N(o()?.base ?? s()), g = /* @__PURE__ */ N(v(Mc(H(h)))), _ = /* @__PURE__ */ N({ ...H(g) });
	function v(e) {
		return Object.fromEntries(Oc.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Mc(o().base, o()) : Mc(s())), P(f, !0);
	}
	function S() {
		P(f, !1);
	}
	function C(e) {
		y(Mc(e.currentTarget.value));
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
	function ee(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), P(g, {
			...H(g),
			[e.key]: n.value
		}), r && P(_, {
			...H(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function te() {
		P(m, a()), S();
	}
	function ne() {
		let e = H(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Mc(H(h), H(_))), S();
	}
	R(() => W(a()), () => {
		P(m, a());
	}), R(() => (H(h), H(_)), () => {
		P(n, Mc(H(h), H(_)));
	}), R(() => H(n), () => {
		P(r, Fc(H(n)));
	}), R(() => H(r), () => {
		P(i, H(r).length ? `注意：${H(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Ln(), qi();
	var T = zc(), re = I(T), E = L(F(re), 2);
	X(E, 5, () => u, (e) => e.value, (e, t) => {
		var n = Ic(), r = F(n, !0);
		A(n);
		var i = {};
		z(() => {
			J(r, (H(t), U(() => H(t).label))), i !== (i = (H(t), U(() => H(t).value))) && (n.value = (n.__value = (H(t), U(() => H(t).value))) ?? "");
		}), q(e, n);
	}), A(E), A(re), ga(L(re, 2), {
		get open() {
			return H(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: te,
		children: (e, t) => {
			var a = Rc(), o = L(I(a), 2), s = L(F(o), 2), c = F(s);
			c.value = c.__value = "light";
			var l = L(c);
			l.value = l.__value = "dark", A(s);
			var u;
			Di(s), A(o);
			var d = L(o, 2);
			X(d, 7, () => Oc, (e) => e.key, (e, t, r) => {
				var i = Lc(), a = F(i), o = F(a, !0);
				A(a);
				var s = L(a, 2), c = F(s);
				Pi(c);
				var l = L(c, 2);
				Pi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ki(l, (e, t) => on(p, H(p)[t] = e), (e) => H(p)?.[e], () => [H(r)]), A(s), A(i), z(() => {
					J(o, (H(t), U(() => H(t).label))), Q(c, "aria-label", (H(t), U(() => `${H(t).label}選色器`))), Fi(c, (H(n), H(t), U(() => H(n)[H(t).key]))), Q(l, "aria-label", (H(t), U(() => `${H(t).label}十六進位色碼`))), Fi(l, (H(g), H(t), U(() => H(g)[H(t).key])));
				}), G("input", c, (e) => w(H(t), H(r), e)), G("input", l, (e) => ee(H(t), e)), q(e, i);
			}), A(d);
			var f = L(d, 2);
			let m;
			var _ = F(f, !0);
			A(f);
			var v = L(f, 2), b = F(v), x = L(b, 4), S = L(x, 2);
			A(v), z(() => {
				u !== (u = H(h)) && (s.value = (s.__value = H(h)) ?? "", Ei(s, H(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": H(r).length > 0 }), J(_, H(i));
			}), G("change", s, C), G("click", b, () => y(Mc(H(h)))), G("click", x, te), G("click", S, ne), q(e, a);
		},
		$$slots: { default: !0 }
	}), G("change", E, b), Oi(E, () => H(m), (e) => P(m, e)), q(e, T), Ye();
}
Mr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/ManualEstimateEditor.svelte
var Vc = /* @__PURE__ */ K("<span> </span>"), Hc = /* @__PURE__ */ K("<label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label>"), Uc = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Wc = /* @__PURE__ */ K("<form class=\"spike-estimate-form\"><section class=\"spike-estimate-row\"><div class=\"spike-estimate-badges\"><span>預估工時</span> <!></div> <label class=\"spike-estimate-hours\"><span>人工工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label></section> <div class=\"time-item-rationale\"><!></div> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <div class=\"spike-estimate-actions\"><button type=\"submit\">套用工時草稿</button></div> <!></form>");
function Gc(e, t) {
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
	qi();
	var u = Wc(), d = F(u), f = F(d);
	X(L(F(f), 2), 1, () => (W(n()), U(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = Vc(), r = F(n, !0);
		A(n), z(() => {
			Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
		}), q(e, n);
	}), A(f);
	var p = L(f, 2), m = L(F(p), 2);
	Pi(m), A(p), A(d);
	var h = L(d, 2);
	da(F(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = Hc(), i = L(F(r), 2);
			Pi(i), A(r), z(() => Q(i, "aria-label", (W(n()), U(() => `「${n().title}」人工依據`)))), Bi(i, () => H(o), (e) => P(o, e)), q(e, r);
		},
		$$slots: { default: !0 }
	}), A(h);
	var g = L(h, 2), _ = F(g);
	Pi(_), Re(2), A(g);
	var v = L(g, 4), y = F(v);
	A(v);
	var b = L(v, 2), x = (e) => {
		var t = Uc(), n = F(t, !0);
		A(t), z(() => J(n, H(c))), q(e, t);
	};
	Y(b, (e) => {
		H(c) && e(x);
	}), A(u), z(() => {
		Q(m, "aria-label", (W(n()), U(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (W(n()), U(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (W(n()), U(() => `套用「${n().title}」人工估算草稿`)));
	}), jr("submit", u, (e) => {
		e.preventDefault(), l();
	}), Bi(m, () => H(a), (e) => P(a, e)), Vi(_, () => H(s), (e) => P(s, e)), q(e, u), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var Kc = /* @__PURE__ */ K("<label><input type=\"checkbox\"/> <span> </span></label>"), qc = /* @__PURE__ */ K("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), Jc = /* @__PURE__ */ K("<div class=\"spike-exception-list\"></div>"), Yc = /* @__PURE__ */ K("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), Xc = /* @__PURE__ */ K("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Zc = /* @__PURE__ */ K("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function Qc(e, t) {
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
	function ee(e) {
		P(_, H(_).filter((t) => t.key !== e)), x();
	}
	function te() {
		if (!H(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${H(u)}:00${e ?? b(H(u), r().timezone)}`;
	}
	function ne() {
		let e = i()({
			deliveryAt: te(),
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
	async function T() {
		ne().error || (o()(!1), await a()());
	}
	R(() => (H(f), H(p), H(m)), () => {
		P(n, 24 - Number(H(f)) - Number(H(p)) - Number(H(m)));
	}), Ln(), qi();
	var re = Zc(), E = F(re), ie = L(F(E), 6), D = F(ie);
	A(ie), A(E);
	var ae = L(E, 2), oe = F(ae), se = L(F(oe), 2), ce = F(se), le = L(F(ce));
	Pi(le), A(ce);
	var ue = L(ce, 2), de = L(F(ue));
	Pi(de), A(ue);
	var fe = L(ue, 2);
	A(se), A(oe);
	var pe = L(oe, 2), me = F(pe), he = L(F(me), 2);
	let ge;
	var _e = F(he);
	A(he), A(me);
	var ve = L(me, 2), ye = F(ve), be = L(F(ye));
	Pi(be), A(ye);
	var xe = L(ye, 2), Se = L(F(xe));
	Pi(Se), A(xe);
	var Ce = L(xe, 2), we = L(F(Ce));
	Pi(we), A(Ce), A(ve);
	var Te = L(ve, 2);
	X(L(F(Te), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = Kc(), r = F(n);
		Pi(r);
		var i = L(r, 2), a = F(i);
		A(i), A(n), z((e) => {
			Ii(r, e), J(a, `週${H(t), U(() => H(t).label) ?? ""}`);
		}, [() => (H(h), H(t), U(() => H(h).includes(H(t).value)))]), G("change", r, (e) => S(H(t).value, e.currentTarget.checked)), q(e, n);
	}), A(Te), A(pe);
	var Ee = L(pe, 2), De = F(Ee), Oe = L(F(De), 2);
	A(De);
	var ke = L(De, 2), Ae = (e) => {
		var t = Jc();
		X(t, 5, () => H(_), (e) => e.key, (e, t) => {
			var n = qc(), r = F(n), i = L(F(r));
			Pi(i), A(r);
			var a = L(r, 2), o = L(F(a));
			Pi(o), A(a);
			var s = L(a, 2), c = L(F(s));
			Pi(c), A(s);
			var l = L(s, 2);
			A(n), z(() => {
				Fi(i, (H(t), U(() => H(t).date))), Fi(o, (H(t), U(() => H(t).availableHours))), Fi(c, (H(t), U(() => H(t).publicLabel)));
			}), G("input", i, (e) => C(H(t).key, "date", e.currentTarget.value)), G("input", o, (e) => C(H(t).key, "availableHours", e.currentTarget.value)), G("input", c, (e) => C(H(t).key, "publicLabel", e.currentTarget.value)), G("click", l, () => ee(H(t).key)), q(e, n);
		}), A(t), q(e, t);
	}, je = (e) => {
		q(e, Yc());
	};
	Y(ke, (e) => {
		H(_), U(() => H(_).length) ? e(Ae) : e(je, -1);
	}), A(Ee);
	var Me = L(Ee, 2), Ne = F(Me), Pe = L(Ne, 2), O = (e) => {
		var t = Xc(), n = F(t, !0);
		A(t), z(() => J(n, H(v))), q(e, t);
	};
	Y(Pe, (e) => {
		H(v) && e(O);
	}), A(Me), A(ae), A(re), z((e) => {
		J(D, `時區：${W(r()), U(() => r().timezone) ?? ""}`), ge = Z(he, 1, "", null, ge, { invalid: !(H(n) > 0) }), J(_e, `工作 ${e ?? ""} hr`);
	}, [() => (H(n), U(() => Number.isFinite(H(n)) ? H(n) : "—"))]), G("input", le, x), Bi(le, () => H(u), (e) => P(u, e)), G("input", de, x), Bi(de, () => H(d), (e) => P(d, e)), G("click", fe, () => {
		P(u, ""), x();
	}), G("input", be, x), Bi(be, () => H(f), (e) => P(f, e)), G("input", Se, x), Bi(Se, () => H(p), (e) => P(p, e)), G("input", we, x), Bi(we, () => H(m), (e) => P(m, e)), G("click", Oe, w), G("click", Ne, T), q(e, re), Ye();
}
Mr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var $c = (e, t = _, n = _) => {
	var r = ol(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o, !0);
	A(o);
	var c = L(o, 2), l = F(c, !0);
	A(c), A(r), z((e) => {
		Z(r, 1, e), J(a, (t(), U(() => t().label))), J(s, (t(), U(() => t().value))), J(l, (t(), U(() => t().note)));
	}, [() => vi((n(), U(() => `time-evaluation-node ${n()}`.trim())))]), q(e, r);
}, el = (e, t = _) => {
	var n = cl();
	X(n, 5, t, ii, (e, t) => {
		var n = sl(), r = F(n), i = F(r), a = F(i, !0);
		A(i);
		var o = L(i), s = F(o, !0);
		A(o), A(r);
		var c = L(r, 2), l = F(c, !0);
		A(c), A(n), z(() => {
			J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
		}), q(e, n);
	}), A(n), q(e, n);
}, tl = (e, t = _) => {
	var n = ll();
	el(L(F(n), 2), t), A(n), q(e, n);
}, nl = (e, t = _, n = _) => {
	var r = ul(), i = F(r), a = F(i, !0);
	A(i);
	var o = L(i, 2), s = F(o), c = F(s);
	$c(c, () => (t(), U(() => t().engineeringLane.source)), () => ""), $c(L(c, 4), () => (t(), U(() => t().engineeringLane.result)), () => "time-evaluation-result"), A(s);
	var l = L(s, 2), u = F(l);
	$c(u, () => (t(), U(() => t().capacityLane.source)), () => ""), $c(L(u, 4), () => (t(), U(() => t().capacityLane.result)), () => "time-evaluation-result"), A(l), A(o);
	var d = L(o, 2);
	$c(L(F(d), 2), () => (t(), U(() => t().merge)), () => (t(), U(() => t().merge.className))), A(d);
	var f = L(d, 2), p = F(f);
	$c(p, () => (t(), U(() => t().risk.trend)), () => ""), $c(L(p, 4), () => (t(), U(() => t().risk.result)), () => (t(), U(() => t().risk.result.className))), A(f);
	var m = L(f, 2), h = F(m, !0);
	A(m), A(r), z(() => {
		Q(r, "hidden", !n()), J(a, (t(), U(() => t().intro))), J(h, (t(), U(() => t().note)));
	}), q(e, r);
}, rl = (e, t = _, n = _) => {
	var r = pl(), i = F(r);
	ca(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	da(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), U(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = dl(), i = I(r), a = F(i, !0);
			A(i);
			var o = L(i, 2), s = F(o, !0);
			A(o), z(() => {
				J(a, (t(), U(() => t().explanation.text))), J(s, (t(), U(() => t().explanation.formula)));
			}), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = fl(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), tl(L(o, 2), () => (t(), U(() => t().composition))), A(r), z(() => Q(r, "hidden", !n())), q(e, r);
}, il = (e, t = _, n = _) => {
	var r = gl(), i = L(F(r), 2);
	ca(i, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var a = L(i, 2);
	da(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = ml(), i = L(I(r), 2), a = F(i, !0);
			A(i), z(() => J(a, (t(), U(() => t().formulaCode)))), q(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = L(a, 2), s = F(o), c = F(s, !0);
	A(s);
	var l = L(s, 2), u = F(l), d = (e) => {
		var n = Hr();
		X(I(n), 1, () => (t(), U(() => t().exceptions)), ii, (e, t) => {
			var n = sl(), r = F(n), i = F(r), a = F(i, !0);
			A(i);
			var o = L(i), s = F(o, !0);
			A(o), A(r);
			var c = L(r, 2), l = F(c, !0);
			A(c), A(n), z(() => {
				J(a, (H(t), U(() => H(t).label))), J(s, (H(t), U(() => H(t).note))), J(l, (H(t), U(() => H(t).value)));
			}), q(e, n);
		}), q(e, n);
	}, f = (e) => {
		q(e, hl());
	};
	Y(u, (e) => {
		t(), U(() => t().exceptions) ? e(d) : e(f, -1);
	}), A(l), A(o), A(r), z(() => {
		Q(r, "hidden", !n()), J(c, (t(), U(() => t().exceptionsHeading)));
	}), q(e, r);
}, al = (e, t = _) => {
	var n = _l(), r = F(n), i = F(r, !0);
	A(r);
	var a = L(r, 2);
	ca(a, { get metrics() {
		return t(), U(() => t().metrics);
	} });
	var o = L(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = fl(), i = F(r, !0);
			A(r), z(() => J(i, (t(), U(() => t().calibrationText)))), q(e, r);
		},
		$$slots: { default: !0 }
	}), tl(L(o, 2), () => (t(), U(() => t().composition))), A(n), z(() => J(i, (t(), U(() => t().intro)))), q(e, n);
}, ol = /* @__PURE__ */ K("<div><span> </span> <strong> </strong> <small> </small></div>"), sl = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), cl = /* @__PURE__ */ K("<div class=\"time-source-list\"></div>"), ll = /* @__PURE__ */ K("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), ul = /* @__PURE__ */ K("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), dl = /* @__PURE__ */ K("<p> </p> <code class=\"time-formula\"> </code>", 1), fl = /* @__PURE__ */ K("<p> </p>"), pl = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), ml = /* @__PURE__ */ K("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), hl = /* @__PURE__ */ K("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), gl = /* @__PURE__ */ K("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), _l = /* @__PURE__ */ K("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), vl = /* @__PURE__ */ K("<span> </span>"), yl = /* @__PURE__ */ K("<!> <div class=\"time-item-rationale\"><!></div>", 1), bl = /* @__PURE__ */ K("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), xl = /* @__PURE__ */ K("<code class=\"time-formula\"> </code>"), Sl = /* @__PURE__ */ K("<code class=\"time-reference\"> </code>"), Cl = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), wl = /* @__PURE__ */ K("<span aria-hidden=\"true\"></span>"), Tl = /* @__PURE__ */ K("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), El = /* @__PURE__ */ K("<!> <!>", 1), Dl = /* @__PURE__ */ K("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), Ol = /* @__PURE__ */ K("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), kl = /* @__PURE__ */ K("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), Al = /* @__PURE__ */ K("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), jl = /* @__PURE__ */ K("<div class=\"time-dialog-content\"><!></div>");
function Ml(e, t) {
	Je(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ N([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await Cr(), H(g)[r]?.focus();
	}
	qi();
	{
		let t = /* @__PURE__ */ j(() => `關閉${i()}`);
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
				return H(t);
			},
			get onClose() {
				return c();
			},
			children: (e, t) => {
				var n = jl(), i = F(n), c = (e) => {
					var t = Cl(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var o = L(r, 2), c = F(o, !0);
					A(o), A(n);
					var u = L(n, 2), m = (e) => {
						var t = Hr();
						ri(I(t), () => (W(s()), W(f()), U(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ j(() => (W(s()), W(a()), U(() => ({
									...s(),
									title: a()
								}))));
								Gc(e, {
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
						var t = yl(), n = I(t);
						ma(n, {
							label: "預估工時",
							get value() {
								return W(s()), U(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Hr();
								X(I(n), 1, () => (W(s()), U(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = vl(), r = F(n, !0);
									A(n), z(() => {
										Z(n, 1, `assessment-source-badge source-${H(t), U(() => H(t).kind) ?? ""}`), J(r, (H(t), U(() => H(t).label)));
									}), q(e, n);
								}), q(e, n);
							} }
						});
						var r = L(n, 2);
						da(F(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = fl(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().rationale)))), q(e, n);
							},
							$$slots: { default: !0 }
						}), A(r), q(e, t);
					};
					Y(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = L(u, 2), _ = F(g);
					ca(_, { get metrics() {
						return W(s()), U(() => s().technical.metrics);
					} });
					var v = L(_, 2), y = (e) => {
						var t = bl(), n = F(t), r = F(n), i = F(r, !0);
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
						da(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = xl(), r = F(n, !0);
								A(n), z(() => J(r, (W(s()), U(() => s().technical.formula)))), q(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					Y(b, (e) => {
						W(s()), U(() => s().technical.formula) && e(x);
					});
					var S = L(b, 2), C = (e) => {
						var t = Sl(), n = F(t, !0);
						A(t), z(() => J(n, (W(s()), U(() => s().technical.reference)))), q(e, t);
					};
					Y(S, (e) => {
						W(s()), U(() => s().technical.reference) && e(C);
					}), A(g), A(t), z(() => {
						Z(r, 1, vi((W(s()), U(() => s().confidenceClass)))), J(i, (W(s()), U(() => s().confidenceLabel))), J(c, (W(s()), U(() => s().toggleLabel))), Q(g, "hidden", (W(s()), U(() => !s().detailsExpanded)));
					}), G("click", o, function(...e) {
						l()?.apply(this, e);
					}), q(e, t);
				}, v = (e) => {
					var t = Al(), n = F(t), r = F(n), i = F(r, !0);
					A(r);
					var a = L(r, 2), s = F(a, !0);
					A(a), A(n);
					var c = L(n, 2), f = F(c);
					X(f, 5, () => (W(o()), U(() => o().overview)), ii, (e, t) => {
						var n = Tl(), r = F(n), i = F(r, !0);
						A(r);
						var a = L(r, 2), o = F(a), s = (e) => {
							var n = wl();
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
						var t = Hr(), n = I(t), r = (e) => {
							var t = El(), n = I(t);
							Qc(n, {
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
								Oa(e, { get preview() {
									return h();
								} });
							};
							Y(r, (e) => {
								h() && e(i);
							}), q(e, t);
						}, i = (e) => {
							var t = Dl(), n = L(F(t), 4);
							A(t), G("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), q(e, t);
						};
						Y(n, (e) => {
							W(m()), U(() => m().hasConfig) ? e(r) : e(i, -1);
						}), q(e, t);
					}, S = (e) => {
						var t = kl(), n = I(t);
						X(n, 7, () => (W(o()), U(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = Ol(), i = F(r, !0);
							A(r), Ki(r, (e, t) => on(g, H(g)[t] = e), (e) => H(g)?.[e], () => [H(n)]), z(() => {
								Q(r, "id", (H(t), U(() => `time-${H(t).name}-tab`))), Q(r, "aria-controls", (H(t), U(() => `time-${H(t).name}-panel`))), Q(r, "aria-selected", (W(o()), H(t), U(() => o().activeTab === H(t).name))), Q(r, "tabindex", (W(o()), H(t), U(() => o().activeTab === H(t).name ? 0 : -1))), J(i, (H(t), U(() => H(t).label)));
							}), G("click", r, () => u()(H(t).name)), G("keydown", r, (e) => _(e, H(n), o().tabs)), q(e, r);
						}), A(n);
						var r = L(n, 2);
						nl(r, () => (W(o()), U(() => o().flow)), () => (W(o()), U(() => o().activeTab === "flow")));
						var i = L(r, 2);
						rl(i, () => (W(o()), U(() => o().engineering)), () => (W(o()), U(() => o().activeTab === "engineering"))), il(L(i, 2), () => (W(o()), U(() => o().capacity)), () => (W(o()), U(() => o().activeTab === "capacity"))), q(e, t);
					}, C = (e) => {
						al(e, () => (W(o()), U(() => o().estimateOnly)));
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
Mr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Nl = /* @__PURE__ */ K("<span class=\"time-risk-dot\"></span>"), Pl = /* @__PURE__ */ K("<span class=\"time-chevron\">›</span>"), Fl = /* @__PURE__ */ K("<button type=\"button\"><span> </span> <!> <!></button>");
function Il(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = Fl(), d = F(u), f = F(d, !0);
	A(d);
	var p = L(d, 2), m = (e) => {
		q(e, Nl());
	};
	Y(p, (e) => {
		s() && e(m);
	});
	var h = L(p, 2), g = (e) => {
		q(e, Pl());
	};
	Y(h, (e) => {
		c() && e(g);
	}), A(u), z(() => {
		Z(u, 1, vi(i())), Q(u, "hidden", n()), u.disabled = r(), Q(u, "aria-label", a()), J(f, o());
	}), G("click", u, function(...e) {
		l()?.apply(this, e);
	}), q(e, u);
}
Mr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-adapter.svelte.js
var Ll = {
	"task-list": Dc,
	"status-overview": oo,
	"status-filters": io,
	"project-progress": Ka,
	"report-summary": Ya,
	"mode-toggle": Pa,
	"save-bar": no,
	"add-control": ia,
	diagnostics: Ma,
	"scope-directory": Qa,
	"theme-control": Bc,
	"project-module-strip": Ba,
	"time-summary-button": Il,
	"time-dialog": Ml,
	"cost-dialog": Ca,
	"delivery-save-confirmation": Aa
}, Rl = {
	id: "svelte",
	regions: Object.keys(Ll),
	mount(e, t, n) {
		let r = dn({ ...n });
		return {
			component: qr(Ll[e], {
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
		Zr(e.component);
	}
};
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e(Rl);
//#endregion
