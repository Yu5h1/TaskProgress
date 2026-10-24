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
var x = 1024, S = 2048, C = 4096, w = 8192, T = 16384, ee = 32768, te = 1 << 25, E = 65536, ne = 1 << 19, D = 1 << 20, O = 1 << 25, k = 65536, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("legacy props"), ce = Symbol(""), le = Symbol("attributes"), ue = Symbol("class"), de = Symbol("style"), fe = Symbol("text"), pe = Symbol("form reset"), me = new class extends Error {
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
	return Pe(/* @__PURE__ */ bn(j));
}
function M(e) {
	if (A) {
		if (/* @__PURE__ */ bn(j) !== null) throw Ae(), t;
		j = e;
	}
}
function Ie(e = 1) {
	if (A) {
		for (var t = e, n = j; t--;) n = /* @__PURE__ */ bn(n);
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
		var i = /* @__PURE__ */ bn(n);
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
		for (var r of n) jn(r);
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
	if (Ye.length === 0 && !Rt) {
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
	if (t === null) return tr.f |= ae, e;
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
//#region node_modules/svelte/src/store/utils.js
function ot(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), _;
	let r = W(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
//#endregion
//#region node_modules/svelte/src/store/shared/index.js
function st(e) {
	let t;
	return ot(e, (e) => t = e)(), t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ct = !1, lt = Symbol("unmounted");
function ut(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ F(void 0),
		unsubscribe: _
	};
	if (r.store !== e && !(lt in n)) if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = _;
	else {
		var i = !0;
		r.unsubscribe = ot(e, (e) => {
			i ? r.source.v = e : I(r.source, e);
		}), i = !1;
	}
	return e && lt in n ? st(e) : U(r.source);
}
function dt() {
	let e = {};
	function t() {
		kn(() => {
			for (var t in e) e[t].unsubscribe();
			l(e, lt, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function ft(e) {
	var t = ct;
	try {
		return ct = !1, [e(), ct];
	} finally {
		ct = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function pt(e) {
	A && /* @__PURE__ */ yn(e) !== null && xn(e);
}
var mt = !1;
function ht() {
	mt || (mt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[pe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function gt(e) {
	var t = tr, n = H;
	rr(null), ir(null);
	try {
		return e();
	} finally {
		rr(t), ir(n);
	}
}
function _t(e, t, n, r = n) {
	e.addEventListener(t, () => gt(n));
	let i = e[pe];
	e[pe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ht();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function vt(e) {
	let t = 0, n = tn(0), r;
	return () => {
		On() && (U(n), Ln(() => (t === 0 && (r = W(() => e(() => sn(n)))), t += 1, () => {
			Ze(() => {
				--t, t === 0 && (r?.(), r = void 0, sn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var yt = E | ne;
function bt(e, t, n, r) {
	new xt(e, t, n, r);
}
var xt = class {
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
	#h = vt(() => (this.#m = tn(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Rn(() => {
			if (A) {
				let e = this.#t;
				Fe();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, yt), A && (this.#e = j);
	}
	#g() {
		try {
			this.#a = zn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Ze(r), t && (this.#s = zn(() => {
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
			t = !0, n && Oe(), this.#s !== null && Kn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = zn(() => e(this.#e)), Ze(() => {
			var e = this.#c = document.createDocumentFragment(), t = vn();
			e.append(t), this.#a = this.#S(() => zn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Kn(this.#o, () => {
				this.#o = null;
			}), this.#x(P));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = zn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Xn(this.#a, e);
				let t = this.#n.pending;
				this.#o = zn(() => t(this.#e));
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
		var t = H, n = tr, r = We;
		ir(this.#i), rr(this.#i), Ge(this.#i.ctx);
		try {
			return Wt.ensure(), e();
		} catch (e) {
			return $e(e), null;
		} finally {
			ir(t), rr(n), Ge(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Kn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Ze(() => {
			this.#d = !1, this.#m && an(this.#m, this.#l);
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
		this.#a &&= (Un(this.#a), null), this.#o &&= (Un(this.#o), null), this.#s &&= (Un(this.#s), null), A && (Pe(this.#t), Ie(), Pe(Le()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return zn(() => {
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
function St(e, t, n, r) {
	let i = Je() ? Et : N;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = Ct(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				et(e, s);
			}
			wt();
		}
	}
	var d = Tt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Ot(e))).then(u).catch((e) => et(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), wt();
	}) : f();
}
function Ct() {
	var e = H, t = tr, n = We, r = P;
	return function(i = !0) {
		ir(e), rr(t), Ge(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function wt(e = !0) {
	ir(null), rr(null), Ge(null), e && P?.deactivate();
}
function Tt() {
	var e = H, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Et(e) {
	var t = 2 | S;
	return H !== null && (H.f |= ne), {
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
var Dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ot(e, t, r) {
	let i = H;
	i === null && ve();
	var a = void 0, o = tn(n), s = !tr, c = /* @__PURE__ */ new Set();
	return In(() => {
		var t = H, n = b();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== me && n.reject(e);
			}).finally(wt);
		} catch (e) {
			n.reject(e), wt();
		}
		var r = P;
		if (s) {
			if (t.f & 32768) var l = Tt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(Dt);
			else for (let e of c.values()) e.reject(Dt);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Dt && (r.activate(), t ? (o.f |= ae, an(o, t)) : (o.f & 8388608 && (o.f ^= ae), an(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), kn(() => {
		for (let e of c) e.reject(Dt);
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
	let t = /* @__PURE__ */ Et(e);
	return t.equals = Ve, t;
}
function kt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Un(t[n]);
	}
}
function At(e) {
	var t, r = H, i = e.parent;
	if (!$n && i !== null && e.v !== n && i.f & 24576) return ke(), e.v;
	ir(i);
	try {
		e.f &= ~k, kt(e), t = vr(e);
	} finally {
		ir(r);
	}
	return t;
}
function jt(e) {
	var t = At(e);
	if (!e.equals(t) && (e.wv = hr(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Ft?.capture(e, t, !0)), e.deps === null))) {
		nt(e, x);
		return;
	}
	$n || (It === null ? rt(e) : (On() || P?.is_fork) && It.set(e, t));
}
function Mt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && gt(() => {
		t.ac.abort(me), t.ac = null;
	}), t.fn !== null && (t.teardown = _), br(t, 0), Vn(t));
}
function Nt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && xr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Pt = null, P = null, Ft = null, It = null, Lt = null, Rt = !1, zt = !1, Bt = null, Vt = null, Ht = 0, Ut = 1, Wt = class e {
	id = Ut++;
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
		Pt === null ? Pt = this : (Pt.#n = this, this.#t = Pt), Pt = this;
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
		this.#e = !0, Ht++ > 1e3 && (this.#x(), Kt());
		for (let e of this.#u) this.#d.delete(e), nt(e, S), this.schedule(e);
		for (let e of this.#d) nt(e, C), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Bt = [], r = [], i = Vt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Zt(e), this.#h() || this.discard(), t;
		}
		if (P = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Bt = null, Vt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Xt(e, t);
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
		this.#r.clear(), Ft = this, Jt(r), Jt(n), Ft = null, this.#s?.resolve();
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
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), It?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, It = null;
	}
	flush() {
		try {
			zt = !0, P = this, this.#g();
		} finally {
			Ht = 0, Lt = null, Bt = null, Vt = null, zt = !1, P = null, It = null, $t.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Dt);
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
			!zt && !Rt && Ze(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		It = null;
	}
	schedule(e) {
		if (Lt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Bt !== null && t === H && (tr === null || !(tr.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Pt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Gt(e) {
	var t = Rt;
	Rt = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (Qe(), P === null) return n;
			P.flush();
		}
	} finally {
		Rt = t;
	}
}
function Kt() {
	try {
		Ce();
	} catch (e) {
		et(e, Lt);
	}
}
var qt = null;
function Jt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && gr(r) && (qt = /* @__PURE__ */ new Set(), xr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Gn(r), qt?.size > 0)) {
				$t.clear();
				for (let e of qt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) qt.has(n) && (qt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || xr(n);
					}
				}
				qt.clear();
			}
		}
		qt = null;
	}
}
function Yt(e) {
	P.schedule(e);
}
function Xt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), nt(e, x);
		for (var n = e.first; n !== null;) Xt(n, t), n = n.next;
	}
}
function Zt(e) {
	nt(e, x);
	for (var t = e.first; t !== null;) Zt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Qt = /* @__PURE__ */ new Set(), $t = /* @__PURE__ */ new Map(), en = !1;
function tn(e, t) {
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
function nn(e, t) {
	let n = tn(e, t);
	return or(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t = !1, n = !0) {
	let r = tn(e);
	return t || (r.equals = Ve), He && n && We !== null && We.l !== null && (We.l.s ??= []).push(r), r;
}
function rn(e, t) {
	return I(e, W(() => U(e))), t;
}
function I(e, t, n = !1) {
	return tr !== null && (!nr || tr.f & 131072) && Je() && tr.f & 4325394 && (ar === null || !ar.has(e)) && De(), an(e, n ? ln(t) : t, Vt);
}
function an(e, t, n = null) {
	if (!e.equals(t)) {
		$t.set(e, $n ? t : e.v);
		var r = Wt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && At(t), It === null && rt(t);
		}
		e.wv = hr(), cn(e, S, n), Je() && H !== null && H.f & 1024 && !(H.f & 96) && (lr === null ? ur([e]) : lr.push(e)), !r.is_fork && Qt.size > 0 && !en && on();
	}
	return t;
}
function on() {
	en = !1;
	for (let e of Qt) {
		e.f & 1024 && nt(e, C);
		let t;
		try {
			t = gr(e);
		} catch {
			t = !0;
		}
		t && xr(e);
	}
	Qt.clear();
}
function sn(e) {
	I(e, e.v + 1);
}
function cn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Je(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & S) === 0;
			if (l && nt(s, t), c & 131072) Qt.add(s);
			else if (c & 2) {
				var u = s;
				It?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= k), cn(u, C, n));
			} else if (l) {
				var d = s;
				c & 16 && qt !== null && qt.add(d), n === null ? Yt(d) : n.push(d);
			}
		}
	}
}
function ln(e) {
	if (typeof e != "object" || !e || oe in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ nn(0), s = null, c = pr, l = (e) => {
		if (pr === c) return e();
		var t = tr, n = pr;
		rr(null), mr(c);
		var r = e();
		return rr(t), mr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ nn(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Te();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ nn(n.value, s);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ nn(n, s));
					r.set(t, e), sn(o);
				}
			} else I(i, n), sn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === oe) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ nn(ln(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
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
			return (i !== void 0 || H !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ nn(a ? ln(e[t]) : n, s)), r.set(t, i)), U(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ nn(n, s)), r.set(p + "", m)) : I(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ nn(void 0, s)), I(d, ln(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => ln(a));
				I(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && I(_, v + 1);
				}
				sn(o);
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
function un(e) {
	try {
		if (typeof e == "object" && e && oe in e) return e[oe];
	} catch {}
	return e;
}
function dn(e, t) {
	return Object.is(un(e), un(t));
}
var fn, pn, mn, hn, gn;
function _n() {
	if (fn === void 0) {
		fn = window, pn = document, mn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		hn = u(t, "firstChild").get, gn = u(t, "nextSibling").get, h(e) && (e[ue] = void 0, e[le] = null, e[de] = void 0, e.__e = void 0), h(n) && (n[fe] = void 0);
	}
}
function vn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function yn(e) {
	return hn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function bn(e) {
	return gn.call(e);
}
function L(e, t) {
	if (!A) return /* @__PURE__ */ yn(e);
	var n = /* @__PURE__ */ yn(j);
	if (n === null) n = j.appendChild(vn());
	else if (t && n.nodeType !== 3) {
		var r = vn();
		return n?.before(r), Pe(r), r;
	}
	return t && wn(n), Pe(n), n;
}
function R(e, t = !1) {
	if (!A) {
		var n = /* @__PURE__ */ yn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ bn(n) : n;
	}
	if (t) {
		if (j?.nodeType !== 3) {
			var r = vn();
			return j?.before(r), Pe(r), r;
		}
		wn(j);
	}
	return j;
}
function z(e, t = 1, n = !1) {
	let r = A ? j : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ bn(r);
	if (!A) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = vn();
			return r === null ? i?.after(a) : r.before(a), Pe(a), a;
		}
		wn(r);
	}
	return Pe(r), r;
}
function xn(e) {
	e.textContent = "";
}
function Sn() {
	return !1;
}
function Cn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function wn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function Tn(e) {
	H === null && (tr === null && Se(e), xe()), $n && be(e);
}
function En(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Dn(e, t) {
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
	if (e & 4) Bt === null ? Wt.ensure().schedule(r) : Bt.push(r);
	else if (t !== null) {
		try {
			xr(r);
		} catch (e) {
			throw Un(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= E));
	}
	if (i !== null && (i.parent = n, n !== null && En(i, n), tr !== null && tr.f & 2 && !(e & 64))) {
		var a = tr;
		(a.effects ??= []).push(i);
	}
	return r;
}
function On() {
	return tr !== null && !nr;
}
function kn(e) {
	let t = Dn(8, null);
	return nt(t, x), t.teardown = e, t;
}
function An(e) {
	Tn("$effect");
	var t = H.f;
	if (!tr && t & 32 && We !== null && !We.i) {
		var n = We;
		(n.e ??= []).push(e);
	} else return jn(e);
}
function jn(e) {
	return Dn(4 | D, e);
}
function Mn(e) {
	return Tn("$effect.pre"), Dn(8 | D, e);
}
function Nn(e) {
	Wt.ensure();
	let t = Dn(64 | ne, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Kn(t, () => {
			Un(t), n(void 0);
		}) : (Un(t), n(void 0));
	});
}
function Pn(e) {
	return Dn(4, e);
}
function B(e, t) {
	var n = We, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Ln(() => {
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
function Fn() {
	var e = We;
	Ln(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && nt(n, C), gr(n) && xr(n), t.ran = !1;
		}
	});
}
function In(e) {
	return Dn(ie | ne, e);
}
function Ln(e, t = 0) {
	return Dn(8 | t, e);
}
function V(e, t = [], n = [], r = []) {
	St(r, t, n, (t) => {
		Dn(8, () => {
			e(...t.map(U));
		});
	});
}
function Rn(e, t = 0) {
	return Dn(16 | t, e);
}
function zn(e) {
	return Dn(32 | ne, e);
}
function Bn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = $n, n = tr;
		er(!0), rr(null);
		try {
			t.call(null);
		} finally {
			er(e), rr(n);
		}
	}
}
function Vn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && gt(() => {
			e.abort(me);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Un(n, t), n = r;
	}
}
function Hn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Un(t), t = n;
	}
}
function Un(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Wn(e.nodes.start, e.nodes.end), n = !0), e.f |= te, Vn(e, t && !n), br(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Bn(e), e.f ^= te, e.f |= T;
	var i = e.parent;
	i !== null && i.first !== null && Gn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Wn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ bn(e);
		e.remove(), e = n;
	}
}
function Gn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Kn(e, t, n = !0) {
	var r = [];
	qn(e, r, !0);
	var i = () => {
		n && Un(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function qn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= w;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				qn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Jn(e) {
	Yn(e, !0);
}
function Yn(e, t) {
	if (e.f & 8192) {
		e.f ^= w, e.f & 1024 || (nt(e, S), Wt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Yn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Xn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ bn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Zn = null, Qn = !1, $n = !1;
function er(e) {
	$n = e;
}
var tr = null, nr = !1;
function rr(e) {
	tr = e;
}
var H = null;
function ir(e) {
	H = e;
}
var ar = null;
function or(e) {
	tr !== null && (ar ??= /* @__PURE__ */ new Set()).add(e);
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
	if (t & 2 && (e.f &= ~k), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (gr(a) && jt(a), a.wv > e.wv) return !0;
		}
		t & 512 && It === null && nt(e, x);
	}
	return !1;
}
function _r(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(ar !== null && ar.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? _r(a, t, !1) : t === a && (n ? nt(a, S) : a.f & 1024 && nt(a, C), Yt(a));
	}
}
function vr(e) {
	var t = sr, n = cr, r = lr, i = tr, a = ar, o = We, s = nr, c = pr, l = e.f;
	sr = null, cr = 0, lr = null, tr = l & 96 ? null : e, ar = null, Ge(e.ctx), nr = !1, pr = ++fr, e.ac !== null && (gt(() => {
		e.ac.abort(me);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= ee;
		var f = e.deps, p = P?.is_fork;
		if (sr !== null) {
			var m;
			if (p || br(e, cr), f !== null && cr > 0) for (f.length = cr + sr.length, m = 0; m < sr.length; m++) f[cr + m] = sr[m];
			else e.deps = f = sr;
			if (On() && e.f & 512) for (m = cr; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && cr < f.length && (br(e, cr), f.length = cr);
		if (Je() && lr !== null && !nr && f !== null && !(e.f & 6146)) for (m = 0; m < lr.length; m++) _r(lr[m], e);
		if (i !== null && i !== e) {
			if (fr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = fr;
			if (t !== null) for (let e of t) e.rv = fr;
			lr !== null && (r === null ? r = lr : r.push(...lr));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (e) {
		return $e(e);
	} finally {
		e.f ^= re, sr = t, cr = n, lr = r, tr = i, ar = a, Ge(o), nr = s, pr = c;
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
		c.f & 512 && (c.f ^= 512, c.f &= ~k), c.v !== n && rt(c), c.ac !== null && gt(() => {
			c.ac.abort(me), c.ac = null, nt(c, S);
		}), Mt(c), br(c, 0);
	}
}
function br(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) yr(e, n[r]);
}
function xr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		nt(e, x);
		var n = H, r = Qn;
		H = e, Qn = !(t & 96);
		try {
			t & 16777232 ? Hn(e) : Vn(e), Bn(e);
			var i = vr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = dr;
		} finally {
			Qn = r, H = n;
		}
	}
}
async function Sr() {
	await Promise.resolve(), Gt();
}
function U(e) {
	var t = !!(e.f & 2);
	if (Zn?.add(e), tr !== null && !nr && !(H !== null && H.f & 16384) && (ar === null || !ar.has(e))) {
		var n = tr.deps;
		if (tr.f & 2097152) e.rv < fr && (e.rv = fr, sr === null && n !== null && n[cr] === e ? cr++ : sr === null ? sr = [e] : sr.push(e));
		else {
			tr.deps ??= [], s.call(tr.deps, e) || tr.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [tr] : s.call(r, tr) || r.push(tr);
		}
	}
	if ($n && $t.has(e)) return $t.get(e);
	if (t) {
		var i = e;
		if ($n) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || wr(i)) && (a = At(i)), $t.set(i, a), a;
		}
		var o = !(i.f & 512) && !nr && tr !== null && (Qn || !!(tr.f & 512)), c = (i.f & ee) === 0;
		gr(i) && (o && (i.f |= 512), jt(i)), o && !c && (Nt(i), Cr(i));
	}
	if (It?.has(e)) return It.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Nt(t), Cr(t));
}
function wr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if ($t.has(t) || t.f & 2 && wr(t)) return !0;
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
		if (oe in e) Tr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && Tr(n);
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
		if (r.capture || Nr.call(t, e), !e.cancelBubble) return gt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Ze(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Ar(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = kr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && kn(() => {
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
		var d = tr, f = H;
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
	var t = Cn("template");
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
		if (A) return Lr(j, null), j;
		i === void 0 && (i = Ir(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ yn(i)));
		var t = r || mn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ yn(t), s = t.lastChild;
			Lr(o, s);
		} else Lr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Rr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (A) return Lr(j, null), j;
		if (!o) {
			var e = /* @__PURE__ */ yn(Ir(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ yn(e);) o.appendChild(/* @__PURE__ */ yn(e));
			else o = /* @__PURE__ */ yn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ yn(t), r = t.lastChild;
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
	if (!A) {
		var t = vn(e + "");
		return Lr(t, t), t;
	}
	var n = j;
	return n.nodeType === 3 ? wn(n) : (n.before(n = vn()), Pe(n)), Lr(n, n), n;
}
function Vr() {
	if (A) return Lr(j, null), j;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = vn();
	return e.append(t, n), Lr(t, n), e;
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
	n !== (e[fe] ??= e.nodeValue) && (e[fe] = n, e.nodeValue = `${n}`);
}
function Kr(e, t) {
	return Jr(e, t);
}
var qr = /* @__PURE__ */ new Map();
function Jr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	_n();
	var u = void 0, d = Nn(() => {
		var s = r ?? n.appendChild(vn());
		bt(s, { pending: () => {} }, (n) => {
			Ke({});
			var r = We;
			if (o && (r.c = o), a && (i.$$events = a), A && Lr(n, null), u = e(n, i) || {}, A && (H.nodes.end = j, j === null || j.nodeType !== 8 || j.data !== "]")) throw Ae(), t;
			qe();
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
			if (n) Jn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Jn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Un(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Xn(r, t), t.append(vn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Un(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Kn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Un(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = P, r = Sn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = vn();
			i.append(a), this.#n.set(e, {
				effect: zn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, zn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else A && (this.anchor = j), this.#a(n);
	}
};
function Qr(e) {
	We === null && _e("onMount"), He && We.l !== null ? ei(We).m.push(e) : An(() => {
		let t = W(e);
		if (typeof t == "function") return t;
	});
}
function $r(e) {
	We === null && _e("onDestroy"), Qr(() => () => W(e));
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
	A && (r = j, Fe());
	var i = new Zr(e), a = n ? E : 0;
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
	Rn(() => {
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
	A && Fe();
	var r = new Zr(e), i = !Je();
	Rn(() => {
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
		Kn(n, () => {
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
			xn(d), d.append(u), e.items.clear();
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
		r?.has(a) ? (a.f |= O, Xn(a, document.createDocumentFragment())) : Un(t[i], n);
	}
}
var oi;
function si(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = A ? Pe(/* @__PURE__ */ yn(u)) : u.appendChild(vn());
	}
	A && Fe();
	var d = null, f = /* @__PURE__ */ N(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, li(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= O, di(d, null, s)) : Jn(d) : Kn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Rn(() => {
			p = U(f);
			var e = p.length;
			let a = !1;
			A && Re(s) === "[!" != (e === 0) && (s = Le(), Pe(s), Ne(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = P, v = Sn(), y = 0; y < e; y += 1) {
				A && j.nodeType === 8 && j.data === "]" && (s = j, a = !0, Ne(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && an(S.v, b), S.i && an(S.i, y), v && u.unskip_effect(S.e)) : (S = ui(l, h ? s : oi ??= vn(), b, x, y, i, t, n), h || (S.e.f |= O), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = zn(() => o(s)) : (d = zn(() => o(oi ??= vn())), d.f |= O)), e > c.size && ye("", "", ""), A && e > 0 && Pe(Le()), !h) if (m.set(u, c), v) {
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
function ci(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function li(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, l = ci(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Jn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= O, _ === l) di(_, null, n);
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
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			ii(e, w, ee);
		}
	}
	a && Ze(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ui(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? tn(n) : /* @__PURE__ */ F(n, !1, !1) : null, l = o & 2 ? tn(i) : null;
	return {
		v: c,
		i: l,
		e: zn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function di(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ bn(r);
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
	A && Fe();
	var a = t.$$slots?.[n], o = !1;
	a === !0 && (a = t[n === "default" ? "children" : n], o = !0), a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function mi(e, t, n, r, a, o) {
	let s = A;
	A && Fe();
	var c = null;
	A && j.nodeType === 1 && (c = j, Fe());
	var l = A ? j : e, u = new Zr(l, !1);
	Rn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = A ? c : Cn(e, o), Lr(c, c), r) {
					var n = null;
					A && Gr(e) && c.append(n = document.createComment(""));
					var i = A ? /* @__PURE__ */ yn(c) : c.appendChild(vn());
					A && (i === null ? Ne(!1) : Pe(i)), r(c, i), n?.remove();
				}
				H.nodes.end = c, t.before(c);
			}
			A && Pe(t);
		}), () => {};
	}, E), kn(() => {}), s && (Ne(!0), Pe(l));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function hi(e, t, n) {
	Pn(() => {
		var r = W(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Ln(() => {
				var e = n();
				G(e), i && Be(a, e) && (a = e, r.update(e));
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
	var o = e[ue];
	if (A || o !== n || o === void 0) {
		var s = bi(n, r, a);
		(!A || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ue] = n;
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
	var i = e[de];
	if (A || i !== t) {
		var a = Ci(t, r);
		(!A || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[de] = t;
	} else r && (Array.isArray(r) ? (wi(e, n?.[0], r[0]), wi(e, n?.[1], r[1], "important")) : wi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Ei(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!a(t)) return je();
		for (var r of e.options) r.selected = t.includes(ki(r));
		return;
	}
	for (r of e.options) if (dn(ki(r), t)) {
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
	}), kn(() => {
		t.disconnect();
	});
}
function Oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	_t(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ki);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ki(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), Pn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
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
var Ai = Symbol("is custom element"), ji = Symbol("is html"), Mi = he ? "link" : "LINK", Ni = he ? "progress" : "PROGRESS";
function Pi(e) {
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
		e[pe] = n, Ze(n), ht();
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
	A && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Mi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ce] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && zi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Li(e) {
	return e[le] ??= {
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
	_t(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Hi(e) ? Ui(a) : a, n(a), P !== null && r.add(P), await Sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (A && e.defaultValue !== e.value || W(t) == null && e.value) && (n(Hi(e) ? Ui(e.value) : e.value), P !== null && r.add(P)), Ln(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = P;
			if (r.has(i)) return;
		}
		Hi(e) && n === Ui(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Vi(e, t, n = t) {
	_t(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (A && e.defaultChecked !== e.checked || W(t) == null) && n(e.checked), Ln(() => {
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
	r && r.set && (e[t] = n, kn(() => {
		e[t] = null;
	}));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Gi(e, t) {
	return e === t || e?.[oe] === t;
}
function Ki(e = {}, t, n, r) {
	var i = We.r, a = H;
	return Pn(() => {
		var o, s;
		return Ln(() => {
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
	let t = We, n = t.l.u;
	if (!n) return;
	let r = () => G(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Et(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => U(i);
	}
	n.b.length && Mn(() => {
		Ji(t, r), y(n.b);
	}), An(() => {
		let e = W(() => n.m.map(v));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && An(() => {
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
function Xi(...e) {
	return new Proxy({ props: e }, Yi);
}
function $(e, t, n, r) {
	var i = !He || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ Et(r), U(l)) : (c && (c = !1, s = o ? W(r) : r), s);
	let f;
	if (a) {
		var p = oe in e || se in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ft(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && we(t), f(m)));
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
	var v = !1, y = (n & 1 ? Et : N)(() => (v = !1, g()));
	a && U(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? U(y) : i && a ? ln(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return $n && v || b.f & 16384 ? y.v : U(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ue();
//#endregion
//#region experiments/editor-svelte-spike/src/AddControl.svelte
var Zi = /* @__PURE__ */ q("<button type=\"button\">＋</button>"), Qi = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" rows=\"2\" maxlength=\"1000\"></textarea>"), $i = /* @__PURE__ */ q("<option> </option>"), ea = /* @__PURE__ */ q("<span class=\"task-add-contract\"> </span>"), ta = /* @__PURE__ */ q("<span class=\"inline-add-error\" role=\"alert\"> </span> <div class=\"inline-add-actions\"><button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button></div>", 1), na = /* @__PURE__ */ q("<button class=\"secondary-button inline-add-cancel\" type=\"button\"> </button> <button class=\"secondary-button\" type=\"submit\"> </button> <span class=\"inline-add-error\" role=\"alert\"> </span>", 1), ra = /* @__PURE__ */ q("<form><input class=\"inline-edit-input\" type=\"text\"/> <!> <select class=\"inline-priority-select\"></select> <!> <!></form>");
function ia(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F(), c = $(t, "kind", 8, "item"), l = $(t, "expanded", 8, !1), u = $(t, "policy", 8), d = $(t, "triggerAriaLabel", 8, ""), f = $(t, "titlePlaceholder", 8, ""), p = $(t, "titleAriaLabel", 8, ""), m = $(t, "summaryPlaceholder", 8, "任務描述（必填）"), h = $(t, "summaryAriaLabel", 8, "新任務描述"), g = $(t, "priorityAriaLabel", 8, ""), _ = $(t, "contractText", 8, ""), v = $(t, "submitLabel", 8, ""), y = $(t, "cancelLabel", 8, "取消"), b = $(t, "errorMessage", 8, ""), x = $(t, "onOpen", 8, () => {}), S = $(t, "onCancel", 8, () => {}), C = $(t, "onSubmit", 8, () => {}), w = /* @__PURE__ */ F(""), T = /* @__PURE__ */ F(""), ee = /* @__PURE__ */ F(u()?.creationDefaultValue ?? 4), te = /* @__PURE__ */ F();
	async function E() {
		await Sr(), U(te)?.focus?.();
	}
	function ne(e) {
		e.preventDefault(), C()({
			title: U(w),
			summary: U(T),
			priority: u().normalize(U(ee), u().creationDefaultValue)
		});
	}
	function D(e) {
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
	}), Fn(), qi();
	var O = Vr(), k = R(O), re = (e) => {
		var t = Zi();
		V(() => {
			Z(t, 1, vi(U(n) ? "task-add-trigger" : "inline-add-trigger")), Q(t, "aria-label", U(r));
		}), K("click", t, function(...e) {
			x()?.apply(this, e);
		}), J(e, t);
	}, ie = (e) => {
		var t = ra(), r = L(t);
		Pi(r), Ki(r, (e) => I(te, e), () => U(te));
		var c = z(r, 2), l = (e) => {
			var t = Qi();
			pt(t), V(() => {
				Q(t, "placeholder", m()), Q(t, "aria-label", h());
			}), Bi(t, () => U(T), (e) => I(T, e)), J(e, t);
		};
		X(c, (e) => {
			U(n) && e(l);
		});
		var d = z(c, 2);
		si(d, 5, () => (G(u()), W(() => u().levels)), (e) => e.value, (e, t) => {
			var n = $i(), r = L(n, !0);
			M(n);
			var i = {};
			V((e) => {
				Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}, [() => (G(u()), U(t), W(() => u().format(U(t).value)))]), J(e, n);
		}), M(d);
		var f = z(d, 2), p = (e) => {
			var t = ea(), n = L(t, !0);
			M(t), V(() => Y(n, _())), J(e, t);
		};
		X(f, (e) => {
			U(n) && _() && e(p);
		});
		var g = z(f, 2), v = (e) => {
			var t = ta(), n = R(t), r = L(n, !0);
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
			var t = na(), n = R(t), r = L(n, !0);
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
			Z(t, 1, vi(U(n) ? "task-add-form" : "inline-add-form")), Q(r, "maxlength", U(n) ? 160 : 300), Q(r, "placeholder", U(i)), Q(r, "aria-label", U(a)), Q(d, "aria-label", U(o));
		}), Ar("submit", t, ne), K("keydown", t, D), Bi(r, () => U(w), (e) => I(w, e)), Oi(d, () => U(ee), (e) => I(ee, e)), J(e, t);
	};
	X(k, (e) => {
		l() ? e(ie, -1) : e(re);
	}), J(e, O), qe();
}
jr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentMetricGrid.svelte
var aa = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), oa = /* @__PURE__ */ q("<div class=\"assessment-metric\"><span> </span> <strong><!> </strong></div>"), sa = /* @__PURE__ */ q("<div class=\"assessment-metric-grid\"></div>");
function ca(e, t) {
	let n = $(t, "metrics", 24, () => []);
	var r = sa();
	si(r, 5, n, (e) => e.label, (e, t) => {
		var n = oa(), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2), o = L(a), s = (e) => {
			var n = aa();
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
var la = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), ua = /* @__PURE__ */ q("<section class=\"assessment-note\"><h3><!> </h3> <!></section>");
function da(e, t) {
	let n = $(t, "heading", 8), r = $(t, "tone", 8, null);
	var i = ua(), a = L(i), o = L(a), s = (e) => {
		var t = la();
		V(() => Z(t, 1, `assessment-tone-dot assessment-tone-${r() ?? ""}`)), J(e, t);
	};
	X(o, (e) => {
		r() && e(s);
	});
	var c = z(o);
	M(a), pi(z(a, 2), t, "default", {}, null), M(i), V(() => Y(c, ` ${n() ?? ""}`)), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/AssessmentReadout.svelte
var fa = /* @__PURE__ */ q("<span class=\"assessment-readout-summary\"> </span>"), pa = /* @__PURE__ */ q("<section class=\"assessment-readout\"><span class=\"assessment-readout-label\"> </span> <span class=\"assessment-readout-badges\"><!></span> <!> <strong class=\"assessment-readout-value\"> </strong></section>");
function ma(e, t) {
	let n = $(t, "label", 8), r = $(t, "value", 8), i = $(t, "summary", 8, null);
	var a = pa(), o = L(a), s = L(o, !0);
	M(o);
	var c = z(o, 2);
	pi(L(c), t, "badges", {}, null), M(c);
	var l = z(c, 2), u = (e) => {
		var t = fa(), n = L(t, !0);
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
var ha = /* @__PURE__ */ q("<dialog><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\"> </p> <h2> </h2></div> <button class=\"theme-close\" type=\"button\"><span aria-hidden=\"true\">×</span></button></div> <!></dialog>");
function ga(e, t) {
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
	qi();
	var _ = Vr(), v = R(_), y = (e) => {
		var n = ha(), l = L(n), d = L(l), f = L(d), _ = L(f, !0);
		M(f);
		var v = z(f, 2), y = L(v, !0);
		M(v), M(d);
		var b = z(d, 2);
		M(l), pi(z(l, 2), t, "default", { close: h }, null), M(n), Ki(n, (e) => I(u, e), () => U(u)), hi(n, (e) => p?.(e)), V(() => {
			Z(n, 1, vi(i() ? `theme-dialog ${i()}` : "theme-dialog")), Q(n, "id", r()), Q(n, "aria-labelledby", s()), Y(_, a()), Q(v, "id", s()), Y(y, o()), Q(b, "aria-label", c());
		}), Ar("close", n, m), K("click", n, g), K("click", b, h), J(e, n);
	};
	X(v, (e) => {
		n() && e(y);
	}), J(e, _), qe();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/CostDialog.svelte
var _a = /* @__PURE__ */ q("<span> </span>"), va = /* @__PURE__ */ q("<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>"), ya = /* @__PURE__ */ q("<!> <!> <!>", 1), ba = /* @__PURE__ */ q("<span slot=\"badges\"> </span>"), xa = /* @__PURE__ */ q("<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，\n            因此在涵蓋率完整之前不宣稱預算充足與否。</p>"), Sa = /* @__PURE__ */ q("<div class=\"cost-dialog-content\"><!></div>");
function Ca(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, "project"), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "total", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {});
	qi();
	{
		let t = /* @__PURE__ */ N(() => `關閉${i()}`);
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
				var n = Sa(), i = L(n), a = (e) => {
					var t = ya(), n = R(t);
					ma(n, {
						label: "估算成本",
						get value() {
							return G(s()), W(() => s().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = Vr();
							si(R(n), 1, () => (G(s()), W(() => s().contributors)), (e) => e.kind, (e, t) => {
								var n = _a(), r = L(n, !0);
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
						ca(r, { get metrics() {
							return U(e);
						} });
					}
					var i = z(r, 2), a = (e) => {
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
					var t = ya(), n = R(t);
					ma(n, {
						label: "估算總額",
						get value() {
							return G(o()), W(() => o().exact);
						},
						$$slots: { badges: (e, t) => {
							var n = ba(), r = L(n, !0);
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
						ca(r, { get metrics() {
							return U(e);
						} });
					}
					var i = z(r, 2), a = (e) => {
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
				}), M(n), J(e, n);
			},
			$$slots: { default: !0 }
		});
	}
	qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliveryRiskPreview.svelte
var wa = /* @__PURE__ */ q("<dl class=\"spike-delivery-diff\"><div><dt>原交付日</dt> <dd> </dd></div> <div><dt>草稿交付日</dt> <dd> </dd></div></dl>"), Ta = /* @__PURE__ */ q("<p class=\"spike-capacity-preview-note\">交付日未變更；以下比較只反映工作容量草稿。</p>"), Ea = /* @__PURE__ */ q("<p class=\"spike-preview-reason\"><strong>修改原因：</strong> </p>"), Da = /* @__PURE__ */ q("<section class=\"spike-risk-preview\" aria-labelledby=\"delivery-risk-preview-title\"><div class=\"spike-risk-preview-heading\"><div><p class=\"spike-editor-kicker\">尚未寫入</p> <h3 id=\"delivery-risk-preview-title\"> </h3></div> <span class=\"spike-preview-badge\">預覽</span></div> <!> <div class=\"spike-risk-comparison\"><article><span>目前分析</span> <strong> </strong> <small> </small></article> <span class=\"spike-risk-arrow\" aria-hidden=\"true\">→</span> <article><span>草稿分析</span> <strong> </strong> <small> </small></article></div> <dl class=\"spike-risk-deltas\"><div><dt>容量變化</dt><dd> </dd></div> <div><dt>餘裕／缺口變化</dt><dd> </dd></div></dl> <!></section>");
function Oa(e, t) {
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
	qi();
	var c = Da(), l = L(c), u = L(l), d = z(L(u), 2), f = L(d, !0);
	M(d), M(u), Ie(2), M(l);
	var p = z(l, 2), m = (e) => {
		var t = wa(), r = L(t), i = z(L(r), 2), o = L(i, !0);
		M(i), M(r);
		var s = z(r, 2), c = z(L(s), 2), l = L(c, !0);
		M(c), M(s), M(t), V((e, t) => {
			Y(o, e), Y(l, t);
		}, [() => (G(n()), W(() => a(n().before))), () => (G(n()), W(() => a(n().after)))]), J(e, t);
	}, h = (e) => {
		J(e, Ta());
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
	var T = z(C, 2), ee = L(T);
	M(T), M(S), M(g);
	var te = z(g, 2), E = L(te), ne = z(L(E)), D = L(ne, !0);
	M(ne), M(E);
	var O = z(E, 2), k = z(L(O)), re = L(k, !0);
	M(k), M(O), M(te);
	var ie = z(te, 2), ae = (e) => {
		var t = Ea(), r = z(L(t), 1, !0);
		M(t), V(() => Y(r, (G(n()), W(() => n().reason)))), J(e, t);
	};
	X(ie, (e) => {
		G(n()), W(() => n().reason) && e(ae);
	}), M(c), V((e, t, i, a) => {
		Y(f, r()), Y(y, (G(n()), W(() => n().current.label))), Y(x, `剩餘容量 ${e ?? ""}`), Z(S, 1, (G(n()), W(() => `risk-${n().next.urgency ?? "none"}`))), Y(w, (G(n()), W(() => n().next.label))), Y(ee, `剩餘容量 ${t ?? ""}`), Y(D, i), Y(re, a);
	}, [
		() => (G(n()), W(() => o(n().current.remainingCapacityMinutes))),
		() => (G(n()), W(() => o(n().next.remainingCapacityMinutes))),
		() => (G(n()), W(() => s(n().capacityDelta))),
		() => (G(n()), W(() => s(n().balanceDelta)))
	]), J(e, c), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/DeliverySaveConfirmation.svelte
var ka = /* @__PURE__ */ q("<dialog class=\"spike-confirm-dialog\" aria-labelledby=\"delivery-confirm-title\"><div class=\"spike-confirm-copy\"><p class=\"spike-editor-kicker\">敏感資料確認</p> <h2 id=\"delivery-confirm-title\">確認儲存交付日變更？</h2> <p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div> <!> <div class=\"spike-confirm-actions\"><button type=\"button\">返回修改</button> <button class=\"spike-save-button\" type=\"button\"> </button></div></dialog>");
function Aa(e, t) {
	Ke(t, !1);
	let n = $(t, "preview", 8), r = $(t, "busy", 8, !1), i = $(t, "onBack", 8), a = $(t, "onConfirm", 8), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F();
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
	var u = ka(), d = z(L(u), 2);
	Oa(d, {
		get preview() {
			return n();
		},
		heading: "儲存影響確認"
	});
	var f = z(d, 2), p = L(f);
	Ki(p, (e) => I(s, e), () => U(s));
	var m = z(p, 2), h = L(m, !0);
	M(m), M(f), M(u), Ki(u, (e) => I(o, e), () => U(o)), V(() => {
		p.disabled = r(), m.disabled = r(), Y(h, r() ? "正在儲存…" : "確認儲存");
	}), Ar("cancel", u, c), K("keydown", u, l), K("click", p, function(...e) {
		i()?.apply(this, e);
	}), K("click", m, function(...e) {
		a()?.apply(this, e);
	}), J(e, u), qe();
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
	si(R(i), 1, n, ri, (e, t) => {
		let n = /* @__PURE__ */ N(() => (U(t), W(() => U(t).level ?? "error")));
		var i = ja(), a = L(i), o = L(a, !0);
		M(a);
		var s = z(a, 2), c = L(s, !0);
		M(s), M(i), V(() => {
			Z(i, 1, `diagnostic diagnostic-${U(n)}`), Y(o, (G(U(n)), W(() => r[U(n)] ?? r.error))), Y(c, (U(t), W(() => U(t).message)));
		}), J(e, i);
	}), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/ModeToggle.svelte
var Na = /* @__PURE__ */ q("<button type=\"button\"> </button>");
function Pa(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = $(t, "mode", 8, "preview"), o = $(t, "available", 8, !0), s = $(t, "disabled", 8, !1), c = $(t, "hideWhenUnavailable", 8, !1), l = $(t, "unavailableTitle", 8, ""), u = $(t, "onToggle", 8, () => {});
	B(() => G(a()), () => {
		I(n, a() === "edit");
	}), B(() => U(n), () => {
		I(r, U(n) ? "編輯模式" : "預覽模式");
	}), B(() => U(n), () => {
		I(i, U(n) ? "預覽模式" : "編輯模式");
	}), Fn(), qi();
	var d = Na();
	let f;
	var p = L(d, !0);
	M(d), V(() => {
		f = Z(d, 1, "view-mode-toggle editor-mode-dock", null, f, { "is-editing": U(n) }), Q(d, "aria-label", `切換到${U(i)}（目前為${U(r)}）`), d.disabled = s() || !o(), Q(d, "hidden", c() && !o()), Q(d, "title", o() ? "" : l()), Y(p, U(i));
	}), K("click", d, () => u()(U(n) ? "preview" : "edit")), J(e, d), qe();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte
var Fa = /* @__PURE__ */ q("<span></span>"), Ia = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), La = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>"), Ra = /* @__PURE__ */ q("<div role=\"toolbar\"></div>");
function za(e, t) {
	Ke(t, !1);
	let n = $(t, "items", 24, () => []), r = $(t, "className", 8, ""), i = $(t, "ariaLabel", 8, "可排序膠囊列"), a = $(t, "onActivate", 8, () => {}), o = $(t, "onReorder", 8, () => {}), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = !1, u = null, d = /* @__PURE__ */ F(null), f = /* @__PURE__ */ F();
	async function p() {
		let e = U(d);
		I(d, null), await Sr(), [...U(f)?.querySelectorAll("[data-capsule-id]") ?? []].find((t) => t.dataset.capsuleId === e)?.focus();
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
	function T(e, t) {
		if (!U(s) || e.sortable === !1) return;
		t.preventDefault();
		let n = U(s), r = g(t.currentTarget, t.clientX);
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
	function ne(e) {
		if (!u || u.pointerId !== e.pointerId) return;
		let t = u;
		u = null, e.currentTarget.releasePointerCapture?.(e.pointerId), m(), t.active && t.targetId && v(t.id, t.targetId, t.placeAfter), setTimeout(() => {
			l = !1;
		}, 0);
	}
	B(() => (G(n()), U(d)), () => {
		n() && U(d) && p();
	}), Fn(), qi();
	var D = Ra();
	si(D, 5, n, (e) => e.id, (e, t) => {
		let n = /* @__PURE__ */ N(() => (U(t), W(() => U(t).sortable !== !1)));
		var r = La(), i = L(r), a = L(i, !0);
		M(i);
		var o = z(i, 2), l = (e) => {
			var n = Fa();
			V(() => Z(n, 1, (U(t), W(() => `time-risk-dot ${U(t).dotClass ?? ""}`)))), J(e, n);
		};
		X(o, (e) => {
			U(t), W(() => U(t).showDot) && e(l);
		});
		var u = z(o, 2), d = (e) => {
			J(e, Ia());
		};
		X(u, (e) => {
			U(t), W(() => U(t).showChevron) && e(d);
		}), M(r), V((e) => {
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
			(U(n) ? (e) => T(U(t), e) : null)?.apply(this, e);
		}), Ar("dragend", r, function(...e) {
			(U(n) ? ee : null)?.apply(this, e);
		}), K("pointerdown", r, function(...e) {
			(U(n) ? (e) => te(U(t), e) : null)?.apply(this, e);
		}), K("pointermove", r, function(...e) {
			(U(n) ? (e) => E(U(t), e) : null)?.apply(this, e);
		}), K("pointerup", r, function(...e) {
			(U(n) ? ne : null)?.apply(this, e);
		}), Ar("pointercancel", r, function(...e) {
			(U(n) ? ne : null)?.apply(this, e);
		}), J(e, r);
	}), M(D), Ki(D, (e) => I(f, e), () => U(f)), V(() => {
		Z(D, 1, `horizontal-capsule-strip ${r()}`), Q(D, "aria-label", i());
	}), J(e, D), qe();
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
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "capsules", 24, () => []), a = $(t, "moduleOrder", 24, () => []), o = $(t, "className", 8, "item-module-strip"), s = $(t, "ariaLabel", 8, "子項目模組"), c = $(t, "onActivate", 8, () => {}), l = $(t, "onReorder", 8, () => {});
	B(() => G(a()), () => {
		I(n, new Map(a().map((e, t) => [e, t])));
	}), B(() => (G(i()), U(n), G(a())), () => {
		I(r, [...i()].sort((e, t) => (U(n).get(e.id) ?? a().length) - (U(n).get(t.id) ?? a().length)));
	}), Fn(), qi();
	var u = Vr(), d = R(u), f = (e) => {
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
	}), J(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProgressBar.svelte
var Va = /* @__PURE__ */ q("<i></i>"), Ha = /* @__PURE__ */ q("<div role=\"img\"></div>"), Ua = /* @__PURE__ */ q("<progress max=\"100\"></progress>");
function Wa(e, t) {
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
	}), Fn(), qi();
	var f = Vr(), p = R(f), m = (e) => {
		var t = Ha();
		si(t, 5, () => U(r), ri, (e, t) => {
			var n = Va();
			V((e) => Z(n, 1, e), [() => (U(t), W(() => `progress-cell${u(U(t))}`))]), J(e, n);
		}), M(t), V(() => {
			Z(t, 1, `progress-bar progress-bar-segmented ${c()}`), Q(t, "aria-label", s());
		}), J(e, t);
	}, h = (e) => {
		var t = Ua();
		V(() => {
			Z(t, 1, `progress-meter ${c()}`), Fi(t, U(n)), Q(t, "aria-label", s());
		}), J(e, t);
	};
	X(p, (e) => {
		i() === "segmented" ? e(m) : e(h, -1);
	}), J(e, f), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ProjectProgress.svelte
var Ga = /* @__PURE__ */ q("<div class=\"project-progress-label\"><strong id=\"project-progress-value\"> </strong></div> <!>", 1);
function Ka(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "percentage", 8, 0), i = $(t, "completed", 8, 0), a = $(t, "total", 8, 0), o = $(t, "cells", 24, () => []);
	B(() => (G(r()), G(i()), G(a()), G(o())), () => {
		I(n, `整體進度 ${r()}%，已完成 ${i()}，共 ${a()} 個進度單位；每格一個工作項目，共 ${o().length} 格，進行中 ${o().filter((e) => e === "active").length}，受阻 ${o().filter((e) => e === "failed").length}，已完成 ${o().filter((e) => e === "passed").length}，待處理 ${o().filter((e) => e === "pending").length}，不含已封存`);
	}), Fn(), qi();
	var s = Ga(), c = R(s), l = L(c), u = L(l);
	M(l), M(c);
	var d = z(c, 2);
	{
		let e = /* @__PURE__ */ N(() => r() / 100);
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
	V(() => Y(u, `整體約 ${r() ?? ""}%`)), J(e, s), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ReportSummary.svelte
var qa = /* @__PURE__ */ q("<textarea class=\"report-summary-input\" maxlength=\"1000\" rows=\"2\"></textarea>"), Ja = /* @__PURE__ */ q("<p class=\"hero-summary\"> </p>");
function Ya(e, t) {
	Ke(t, !1);
	let n = $(t, "text", 8, ""), r = $(t, "editable", 8, !1), i = $(t, "value", 8, ""), a = $(t, "placeholder", 8, ""), o = $(t, "label", 8, "報告摘要"), s = $(t, "onCommit", 8, () => {});
	qi();
	var c = Vr(), l = R(c), u = (e) => {
		var t = qa();
		pt(t), V(() => {
			Q(t, "aria-label", o()), Q(t, "placeholder", a()), Fi(t, i());
		}), K("input", t, (e) => s()(e.currentTarget.value)), J(e, t);
	}, d = (e) => {
		var t = Ja(), r = L(t, !0);
		M(t), V(() => Y(r, n())), J(e, t);
	};
	X(l, (e) => {
		r() ? e(u) : e(d, -1);
	}), J(e, c), qe();
}
jr(["input"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ScopeDirectory.svelte
var Xa = /* @__PURE__ */ q("<a class=\"scope-developer-link\"> </a>"), Za = /* @__PURE__ */ q("<article class=\"scope-entry\"><a class=\"scope-link\"> </a> <!></article>");
function Qa(e, t) {
	let n = $(t, "scopes", 24, () => []), r = $(t, "baseOnlyLabel", 8, "基本報告");
	var i = Vr();
	si(R(i), 1, n, (e) => e.id, (e, t) => {
		var n = Za(), i = L(n), a = L(i, !0);
		M(i);
		var o = z(i, 2), s = (e) => {
			var n = Xa(), i = L(n, !0);
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
var $a = /* @__PURE__ */ q("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), eo = /* @__PURE__ */ q("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), to = /* @__PURE__ */ q("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function no(e, t) {
	Ke(t, !1);
	let n = $(t, "cautious", 8, !1), r = $(t, "onToggleCautious", 8, null), i = $(t, "cautiousLabel", 8, "謹慎模式"), a = $(t, "dirty", 8, !1), o = $(t, "saving", 8, !1), s = $(t, "canUndo", 8, !1), c = $(t, "canRedo", 8, !1), l = $(t, "message", 8, ""), u = $(t, "buttonLabel", 8, "儲存"), d = $(t, "savingLabel", 8, "正在儲存…"), f = $(t, "undoLabel", 8, "復原"), p = $(t, "redoLabel", 8, "重做"), m = $(t, "discardLabel", 8, "放棄"), h = $(t, "onSave", 8, () => {}), g = $(t, "onUndo", 8, () => {}), _ = $(t, "onRedo", 8, () => {}), v = $(t, "onDiscard", 8, () => {});
	qi();
	var y = to(), b = R(y), x = L(b, !0);
	M(b);
	var S = z(b, 2), C = L(S), w = L(C, !0);
	M(C);
	var T = z(C, 2), ee = L(T, !0);
	M(T), M(S);
	var te = z(S, 2), E = (e) => {
		var t = $a(), a = L(t, !0);
		M(t), V(() => {
			Q(t, "aria-pressed", n()), Q(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), Y(a, i());
		}), K("click", t, () => r()(!n())), J(e, t);
	};
	X(te, (e) => {
		r() && e(E);
	});
	var ne = z(te, 2), D = (e) => {
		var t = eo(), n = R(t), r = L(n, !0);
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
	X(ne, (e) => {
		n() && e(D);
	}), V(() => {
		Y(x, l()), Q(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), Y(w, f()), Q(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), Y(ee, p());
	}), K("click", C, function(...e) {
		g()?.apply(this, e);
	}), K("click", T, function(...e) {
		_()?.apply(this, e);
	}), J(e, y), qe();
}
jr(["click"]);
//#endregion
//#region viewer/assets/filter-selection.js
var ro = "__default__";
//#endregion
//#region experiments/editor-svelte-spike/src/FilterStrip.svelte
function io(e, t) {
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
			id: ro,
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
		I(i, s().length > 0 ? s() : [ro, ...o().map((e) => e.id)]);
	}), B(() => (U(i), U(n), U(r), G(c()), G(p())), () => {
		I(a, U(i).map((e) => e === "__default__" ? U(n) : U(r).get(e)).filter(Boolean).map((e) => e === U(n) ? e : v(e, c(), p())));
	}), Fn(), qi();
	{
		let t = /* @__PURE__ */ N(() => `filter-strip ${f()}`);
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
	qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/StatusOverview.svelte
var ao = /* @__PURE__ */ q("<article><span class=\"overview-value\"> </span> <span class=\"overview-label\"> </span></article>");
function oo(e, t) {
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
	}), Fn(), qi();
	var o = Vr();
	si(R(o), 1, () => U(n), (e) => e.status, (e, t) => {
		var n = ao(), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2), o = L(a, !0);
		M(a), M(n), V(() => {
			Z(n, 1, (U(t), W(() => `overview-card overview-${U(t).tone}`))), Q(n, "data-status", (U(t), W(() => U(t).status))), Y(i, (U(t), W(() => U(t).value))), Y(o, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), J(e, o), qe();
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
var lo = /* @__PURE__ */ zr("<path d=\"M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3\"></path>"), uo = /* @__PURE__ */ zr("<path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", 1), fo = /* @__PURE__ */ zr("<path d=\"M3 3l18 18\"></path>"), po = /* @__PURE__ */ zr("<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><!><!></svg>");
function mo(e, t) {
	let n = $(t, "closed", 8, !1), r = $(t, "disabled", 8, !1);
	var i = po(), a = L(i), o = (e) => {
		J(e, lo());
	}, s = (e) => {
		var t = uo();
		Ie(), J(e, t);
	};
	X(a, (e) => {
		n() ? e(o) : e(s, -1);
	});
	var c = z(a), l = (e) => {
		J(e, fo());
	};
	X(c, (e) => {
		r() && e(l);
	}), M(i), J(e, i);
}
//#endregion
//#region experiments/editor-svelte-spike/src/CardDisclosure.svelte
var ho = /* @__PURE__ */ q("<button type=\"button\" class=\"card-visibility-toggle card-toolbar-icon\"><!></button>"), go = /* @__PURE__ */ q("<div><button type=\"button\" class=\"card-disclosure-toggle\"><span aria-hidden=\"true\"> </span></button> <!> <!></div> <div class=\"card-disclosure-body\"><!></div>", 1);
function _o(e, t) {
	Ke(t, !1);
	let n = $(t, "visibilityEnabled", 8, !1), r = $(t, "visible", 8, !0), i = $(t, "onVisibleChange", 8, () => {}), a = $(t, "expanded", 8, !0), o = $(t, "contentId", 8), s = $(t, "label", 8, "卡片"), c = $(t, "onToggle", 8, () => {});
	qi();
	var l = go(), u = R(l);
	let d;
	var f = L(u), p = L(f), m = L(p, !0);
	M(p), M(f);
	var h = z(f, 2), g = (e) => {
		var t = ho(), n = L(t);
		{
			let e = /* @__PURE__ */ N(() => !r());
			mo(n, { get closed() {
				return U(e);
			} });
		}
		M(t), V(() => {
			Q(t, "aria-pressed", r()), Q(t, "aria-label", `${r() ? "隱藏" : "顯示"} ${s()}`), Q(t, "title", r() ? "隱藏卡片" : "顯示卡片");
		}), K("click", t, () => i()(!r())), J(e, t);
	};
	X(h, (e) => {
		n() && e(g);
	}), pi(z(h, 2), t, "header", {}, null), M(u);
	var _ = z(u, 2);
	pi(L(_), t, "default", {}, null), M(_), V(() => {
		d = Z(u, 1, "card-disclosure-heading", null, d, { "card-disclosure-collapsed": !a() }), Q(f, "aria-expanded", a()), Q(f, "aria-controls", o()), Q(f, "aria-label", `${a() ? "收合" : "展開"} ${s()}`), Q(f, "title", a() ? "收合" : "展開"), Y(m, a() ? "▼" : "▶"), Q(_, "id", o()), Q(_, "hidden", !a());
	}), K("click", f, () => c()(!a())), J(e, l), qe();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var vo = /* @__PURE__ */ q("<span class=\"developer-next-label\">後續：</span> <span class=\"developer-next-action\"> </span>", 1), yo = /* @__PURE__ */ q("<span class=\"developer-expand-hint\">展開作法與方向</span>"), bo = /* @__PURE__ */ q("<!> <!>", 1), xo = /* @__PURE__ */ q("<li> </li>"), So = /* @__PURE__ */ q("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續</h4> <ul class=\"detail-list\"></ul></section>"), Co = /* @__PURE__ */ q("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), wo = /* @__PURE__ */ q("<code class=\"reference\"> </code>"), To = /* @__PURE__ */ q("<article class=\"decision-item\"><p> </p> <!></article>"), Eo = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Do = /* @__PURE__ */ q("<p> </p>"), Oo = /* @__PURE__ */ q("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), ko = /* @__PURE__ */ q("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Ao = /* @__PURE__ */ q("<div class=\"path-list\"></div>"), jo = /* @__PURE__ */ q("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Mo = /* @__PURE__ */ q("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>");
function No(e, t) {
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
	}), Fn(), qi();
	var c = Vr(), l = R(c), u = (e) => {
		var t = Vr();
		mi(R(t), () => U(a) ? "details" : "section", !1, (e, t) => {
			Z(e, 0, "developer-details");
			var n = bo(), o = R(n);
			mi(o, () => U(a) ? "summary" : "div", !1, (e, t) => {
				Z(e, 0, "developer-summary");
				var n = bo(), i = R(n), o = (e) => {
					var t = vo(), n = z(R(t), 2), i = L(n, !0);
					M(n), V(() => Y(i, U(r))), J(e, t);
				};
				X(i, (e) => {
					U(r) && e(o);
				});
				var s = z(i, 2), c = (e) => {
					J(e, yo());
				};
				X(s, (e) => {
					U(a) && e(c);
				}), J(t, n);
			});
			var c = z(o, 2), l = (e) => {
				var t = Mo(), n = z(L(t), 2), r = (e) => {
					var t = So(), n = z(L(t), 2);
					si(n, 5, () => U(i), ri, (e, t) => {
						var n = xo(), r = L(n, !0);
						M(n), V(() => Y(r, U(t))), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(n, (e) => {
					U(i), W(() => U(i).length) && e(r);
				});
				var a = z(n, 2), o = (e) => {
					var t = Co(), n = z(L(t), 2);
					si(n, 5, () => (G(s()), W(() => s().blockers)), ri, (e, t) => {
						var n = xo(), r = L(n, !0);
						M(n), V(() => Y(r, U(t))), J(e, n);
					}), M(n), M(t), J(e, t);
				};
				X(a, (e) => {
					G(s()), W(() => s().blockers?.length) && e(o);
				});
				var c = z(a, 2), l = (e) => {
					var t = Eo(), n = z(L(t), 2);
					si(n, 5, () => (G(s()), W(() => s().decisions)), ri, (e, t) => {
						var n = To(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = (e) => {
							var n = wo(), r = L(n, !0);
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
					var t = ko(), n = z(L(t), 2);
					si(n, 5, () => (G(s()), W(() => s().routes)), ri, (e, t) => {
						var n = Oo(), r = L(n), i = L(r), a = L(i, !0);
						M(i);
						var o = z(i, 2), s = L(o, !0);
						M(o), M(r);
						var c = z(r, 2), l = (e) => {
							var n = Do(), r = L(n, !0);
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
					var t = jo(), n = z(L(t), 2), r = L(n);
					M(n);
					var i = z(n, 2), a = (e) => {
						var t = Do(), n = L(t);
						M(t), V(() => Y(n, `Worktree: ${G(s()), W(() => s().claim.worktree) ?? ""}`)), J(e, t);
					};
					X(i, (e) => {
						G(s()), W(() => s().claim.worktree) && e(a);
					});
					var o = z(i, 2), c = (e) => {
						var t = Ao();
						si(t, 5, () => (G(s()), W(() => s().claim.source_paths)), ri, (e, t) => {
							var n = wo(), r = L(n, !0);
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
	function T(e = {}) {
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
	function ee() {
		p = !p, S(), w();
	}
	o.hidden = !0, o.addEventListener("click", ee);
	let te = new r.ResizeObserver(w);
	return te.observe(i), n.fonts?.addEventListener("loadingdone", w), T(t), {
		update: T,
		destroy() {
			h = !0, r.cancelAnimationFrame(m), te.disconnect(), n.fonts?.removeEventListener("loadingdone", w), o.removeEventListener("click", ee), i.remove(), l.remove(), e.classList.remove("expandable-text");
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/ExpandableText.svelte
var zo = /* @__PURE__ */ q("<div></div>");
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
	})), J(e, c);
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
function Xo(e) {
	let t = Yo([...e?.pendingWaits ?? [], ...e?.redoTargets ?? []]);
	if (e?.derivedState === "waiting") return t;
	let n = e?.sourceRef;
	if (n) {
		let e = n.available ? n.href : null;
		(!e || !t.some((t) => t.href === e)) && t.push({
			href: e,
			label: `${n.label}: ${n.task}`
		});
	}
	return t;
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Zo = /* @__PURE__ */ q("<button type=\"button\" class=\"item-row-grip\" draggable=\"true\" title=\"拖曳換位（限同優先級）\">⠿</button>"), Qo = /* @__PURE__ */ q("<span aria-hidden=\"true\"> </span>"), $o = /* @__PURE__ */ q("<option> </option>"), es = /* @__PURE__ */ q("<select class=\"inline-priority-select\"></select>"), ts = /* @__PURE__ */ q("<span> </span>"), ns = /* @__PURE__ */ q("<span class=\"item-row-priority\"><!></span>"), rs = /* @__PURE__ */ q("<input class=\"inline-edit-input\" maxlength=\"500\"/>"), is = /* @__PURE__ */ q("<span class=\"item-next-capsule\" title=\"Next：這個 scope 現在該做的一件事；長按取消\">Next</span>"), as = /* @__PURE__ */ q("<span class=\"item-row-selected-label\">已選取</span>"), os = /* @__PURE__ */ q("<a class=\"document-source-link\"><span class=\"source-icon\" aria-hidden=\"true\"> </span> <span class=\"source-label\"> </span></a>"), ss = /* @__PURE__ */ q("<span class=\"document-source-link source-unavailable\"><span class=\"source-icon\" aria-hidden=\"true\">⚠️</span> <span class=\"source-label\">來源不可用</span></span>"), cs = /* @__PURE__ */ q("<div class=\"item-row-text\"><!> <!> <!> <!></div>"), ls = /* @__PURE__ */ q("<button type=\"button\"> </button>"), us = /* @__PURE__ */ q("<select class=\"inline-status-select\"></select>"), ds = /* @__PURE__ */ q("<a> </a>"), fs = /* @__PURE__ */ q("<li><!></li>"), ps = /* @__PURE__ */ q("<ul class=\"wait-menu-list\"></ul>"), ms = /* @__PURE__ */ q("<span class=\"wait-menu\"><button type=\"button\" title=\"狀態對象\" aria-haspopup=\"true\"> </button> <!></span>"), hs = /* @__PURE__ */ q("<span class=\"item-row-action\"><button class=\"inline-delete-button\" type=\"button\">刪除</button></span>"), gs = /* @__PURE__ */ q("<li><!> <!> <div class=\"item-row-description\"><!></div> <!> <span class=\"item-row-utility-panel\"><span class=\"item-row-modules\"><!></span> <span class=\"item-row-status\"><!></span> <!></span></li>");
function _s(e, t) {
	Ke(t, !1);
	let n = () => ut(D(), "$selection", r), [r, i] = dt(), a = /* @__PURE__ */ F(), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ F(), c = /* @__PURE__ */ F(), l = /* @__PURE__ */ F(), u = /* @__PURE__ */ F(), d = /* @__PURE__ */ F(), f = /* @__PURE__ */ F(), p = /* @__PURE__ */ F(), m = /* @__PURE__ */ F(), h = /* @__PURE__ */ F(), g = /* @__PURE__ */ F(), _ = $(t, "taskId", 8), v = $(t, "field", 8), y = $(t, "item", 8), b = $(t, "editing", 8), x = $(t, "policy", 8), S = $(t, "onCommand", 8), C = $(t, "moduleCapsules", 24, () => []), w = $(t, "onModuleActivate", 8, () => {}), T = $(t, "moduleOrder", 24, () => ["time"]), ee = $(t, "onModuleReorder", 8, () => {}), te = $(t, "leadItem", 8, !1), E = $(t, "reorder", 8, null), ne = $(t, "scopeId", 8, null), D = $(t, "selection", 8, null), O = $(t, "isNext", 8, !1), k = $(t, "onSetNext", 8, null);
	function re() {
		k()?.({
			taskId: _(),
			itemId: y().id,
			clear: O()
		});
	}
	function ie(e, t) {
		let n = null, r = (t) => {
			n?.dispose(), n = t ? qo(e, {
				capture: !1,
				accept: (e) => !e.target.closest("a, button, input, select, textarea, label, [contenteditable]"),
				onTrigger: re
			}) : null;
		};
		return r(t), {
			update: r,
			destroy: () => n?.dispose()
		};
	}
	function ae() {
		b() || I(o, Go(y().activity));
	}
	let oe = /* @__PURE__ */ F(""), se;
	async function ce() {
		clearTimeout(se);
		let e = D() ? await D().copyReferences(U(a)) : await Ho(U(a));
		I(oe, e ? "已複製" : "無法複製"), se = setTimeout(() => {
			I(oe, "");
		}, 1500);
	}
	let le = /* @__PURE__ */ F(x().normalize(y().priority, x().fallbackValue)), ue = $(t, "statuses", 24, () => []), de = /* @__PURE__ */ F(y().status ?? (v() === "completed_items" ? "done" : "planned")), fe = /* @__PURE__ */ F(!1);
	function pe(e) {
		e !== U(f) && S()({
			type: "set-item-status",
			taskId: _(),
			field: v(),
			itemId: y().id,
			status: e
		});
	}
	function me(e) {
		w()(e, {
			taskId: _(),
			itemId: y().id,
			itemTitle: y().title
		});
	}
	B(() => (G(b()), G(ne()), G(_()), G(y())), () => {
		I(a, b() ? null : Vo({
			scopeId: ne(),
			taskId: _(),
			item: y()
		}));
	}), B(() => (G(b()), G(y())), () => {
		I(o, b() ? "" : Go(y().activity));
	}), B(() => (U(a), G(D())), () => {
		I(s, !!(U(a) && D()));
	}), B(() => (U(s), n(), U(a)), () => {
		I(c, U(s) && !!n()?.keys.has(U(a)));
	}), B(() => (U(c), n()), () => {
		I(l, U(c) ? n().keys.size : 1);
	}), B(() => (G(x()), G(y())), () => {
		I(u, x().metadata(y().priority));
	}), B(() => (G(x()), G(y())), () => {
		I(d, x().format(y().priority));
	}), B(() => (G(x()), G(y())), () => {
		I(le, x().normalize(y().priority, x().fallbackValue));
	}), B(() => (G(y()), G(v())), () => {
		I(f, y().status ?? (v() === "completed_items" ? "done" : "planned"));
	}), B(() => U(f), () => {
		I(de, U(f));
	}), B(() => (G(y()), G(ue()), U(f)), () => {
		I(p, y().derivedState && y().derivedState !== "done" ? {
			label: y().derivedStateLabel,
			tone: y().derivedStateTone
		} : ue().find((e) => e.value === U(f)) ?? {
			label: U(f),
			tone: "muted"
		});
	}), B(() => U(p), () => {
		I(m, U(p).label);
	}), B(() => (G(b()), G(y())), () => {
		I(h, b() ? [] : Xo(y()));
	}), B(() => U(h), () => {
		I(g, U(h).filter((e) => e.href));
	}), B(() => U(g), () => {
		U(g).length || I(fe, !1);
	}), Fn(), qi();
	var he = gs();
	let ge;
	var _e = L(he), ve = (e) => {
		var t = Zo();
		V(() => {
			Q(t, "data-item-ref", (G(_()), G(y()), W(() => `${_()}/${y().id}`))), Q(t, "aria-label", (G(y()), W(() => `移動「${y().title}」（Alt+↑／↓，限同優先級）`)));
		}), Ar("dragstart", t, function(...e) {
			E().start?.apply(this, e);
		}), Ar("dragend", t, function(...e) {
			E().end?.apply(this, e);
		}), K("keydown", t, function(...e) {
			E().keydown?.apply(this, e);
		}), J(e, t);
	}, ye = (e) => {
		var t = Qo(), n = L(t, !0);
		M(t), V(() => {
			Z(t, 1, `item-row-marker item-row-marker-${U(f)}`), Y(n, U(f) === "done" ? "✓" : "○");
		}), J(e, t);
	};
	X(_e, (e) => {
		E() && b() ? e(ve) : e(ye, -1);
	});
	var be = z(_e, 2), xe = (e) => {
		var t = ns(), n = L(t), r = (e) => {
			var t = es();
			si(t, 5, () => (G(x()), W(() => x().levels)), (e) => e.value, (e, t) => {
				var n = $o(), r = L(n, !0);
				M(n);
				var i = {};
				V((e) => {
					Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
				}, [() => (G(x()), U(t), W(() => x().format(U(t).value)))]), J(e, n);
			}), M(t), V(() => Q(t, "aria-label", (G(y()), W(() => `設定「${y().title}」的優先級`)))), K("change", t, () => S()({
				type: "set-item-field",
				taskId: _(),
				field: v(),
				itemId: y().id,
				property: "priority",
				value: Number(U(le))
			})), Oi(t, () => U(le), (e) => I(le, e)), J(e, t);
		}, i = (e) => {
			var t = ts(), n = L(t, !0);
			M(t), V(() => {
				Z(t, 1, (U(u), W(() => `priority-badge priority-${U(u).tone}`))), Y(n, U(d));
			}), J(e, t);
		};
		X(n, (e) => {
			b() ? e(r) : e(i, -1);
		}), M(t), J(e, t);
	};
	X(be, (e) => {
		G(b()), U(f), U(u), G(x()), W(() => b() || U(f) !== "done" && U(u) && (!U(u).hidden || !x().labelsValid)) && e(xe);
	});
	var Se = z(be, 2), Ce = L(Se), we = (e) => {
		var t = rs();
		Pi(t), V(() => {
			Q(t, "aria-label", (G(y()), W(() => `編輯子項目：${y().title}`))), Q(t, "title", (G(y()), W(() => y().title))), Fi(t, (G(y()), W(() => y().title)));
		}), K("input", t, (e) => S()({
			type: "set-item-field",
			taskId: _(),
			field: v(),
			itemId: y().id,
			property: "title",
			value: e.currentTarget.value
		})), J(e, t);
	}, Te = (e) => {
		var t = cs(), n = L(t), r = (e) => {
			J(e, is());
		};
		X(n, (e) => {
			O() && e(r);
		});
		var i = z(n, 2), a = (e) => {
			J(e, as());
		};
		X(i, (e) => {
			U(c) && e(a);
		});
		var o = z(i, 2), s = (e) => {
			var t = Vr(), n = R(t), r = (e) => {
				var t = os(), n = L(t), r = L(n, !0);
				M(n);
				var i = z(n, 2), a = L(i, !0);
				M(i), M(t), V(() => {
					Q(t, "href", (G(y()), W(() => y().sourceRef.href))), Q(t, "title", (G(y()), W(() => y().sourceRef.title))), Y(r, (G(y()), W(() => y().sourceRef.kind === "decision" ? "⚖" : y().sourceRef.manual ? "📋" : "🤖"))), Y(a, (G(y()), W(() => y().sourceRef.label)));
				}), J(e, t);
			}, i = (e) => {
				var t = ss();
				V(() => Q(t, "title", (G(y()), W(() => y().sourceRef.error ?? "來源無法讀取")))), J(e, t);
			};
			X(n, (e) => {
				G(y()), W(() => y().sourceRef.available) ? e(r) : e(i, -1);
			}), J(e, t);
		};
		X(o, (e) => {
			G(y()), W(() => y().sourceRef) && e(s);
		});
		var l = z(o, 2);
		{
			let e = /* @__PURE__ */ N(() => (G(y()), W(() => y().displayTitle ?? y().title)));
			Bo(l, {
				get text() {
					return U(e);
				},
				lines: 1,
				get expanded() {
					return te();
				}
			});
		}
		M(t), J(e, t);
	};
	X(Ce, (e) => {
		b() ? e(we) : e(Te, -1);
	}), M(Se);
	var Ee = z(Se, 2), De = (e) => {
		var t = ls();
		let n;
		var r = L(t, !0);
		M(t), V(() => {
			n = Z(t, 1, "item-row-copy", null, n, {
				"is-done": U(oe),
				"is-copied": U(oe) === "已複製"
			}), Q(t, "data-item-ref", (G(_()), G(y()), W(() => `${_()}/${y().id}`))), Q(t, "tabindex", U(s) ? -1 : void 0), Q(t, "aria-label", (U(oe), U(l), G(y()), W(() => U(oe) || (U(l) > 1 ? `複製已選取的 ${U(l)} 項參照` : `複製「${y().title}」的參照`)))), Q(t, "title", U(oe) || (U(l) > 1 ? `複製已選取的 ${U(l)} 項參照` : U(a))), Y(r, U(oe) === "已複製" ? "✓" : U(oe) ? "✕" : "⧉");
		}), K("click", t, ce), J(e, t);
	};
	X(Ee, (e) => {
		U(a) && e(De);
	});
	var Oe = z(Ee, 2), ke = L(Oe);
	Ba(L(ke), {
		get capsules() {
			return C();
		},
		get moduleOrder() {
			return T();
		},
		onActivate: me,
		get onReorder() {
			return ee();
		}
	}), M(ke);
	var Ae = z(ke, 2), je = L(Ae), Me = (e) => {
		var t = us();
		si(t, 5, ue, (e) => e.value, (e, t) => {
			var n = $o(), r = L(n, !0);
			M(n);
			var i = {};
			V(() => {
				Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
			}), J(e, n);
		}), M(t), V(() => Q(t, "aria-label", (G(y()), W(() => `設定「${y().title}」的狀態`)))), K("change", t, () => pe(U(de))), Oi(t, () => U(de), (e) => I(de, e)), J(e, t);
	}, A = (e) => {
		var t = ds(), n = L(t, !0);
		M(t), V(() => {
			Z(t, 1, (U(p), W(() => `item-status-capsule status-${U(p).tone} is-link`))), Q(t, "href", (U(g), W(() => U(g)[0].href))), Q(t, "title", (U(g), W(() => `開啟狀態對象：${U(g)[0].label}`))), Y(n, U(m));
		}), J(e, t);
	}, Ne = (e) => {
		var t = ms(), n = L(t), r = L(n, !0);
		M(n);
		var i = z(n, 2), a = (e) => {
			var t = ps();
			si(t, 5, () => U(h), ri, (e, t) => {
				var n = fs(), r = L(n), i = (e) => {
					var n = ds(), r = L(n, !0);
					M(n), V(() => {
						Q(n, "href", (U(t), W(() => U(t).href))), Y(r, (U(t), W(() => U(t).label)));
					}), K("click", n, (e) => e.stopPropagation()), J(e, n);
				}, a = (e) => {
					var n = ts(), r = L(n);
					M(n), V(() => Y(r, `${U(t), W(() => U(t).label) ?? ""}（無法讀取）`)), J(e, n);
				};
				X(r, (e) => {
					U(t), W(() => U(t).href) ? e(i) : e(a, -1);
				}), M(n), J(e, n);
			}), M(t), J(e, t);
		};
		X(i, (e) => {
			U(fe) && e(a);
		}), M(t), V(() => {
			Z(n, 1, (U(p), W(() => `item-status-capsule status-${U(p).tone} is-link`))), Q(n, "aria-expanded", U(fe)), Y(r, U(m));
		}), K("focusout", t, (e) => {
			e.currentTarget.contains(e.relatedTarget) || I(fe, !1);
		}), K("click", n, (e) => {
			e.stopPropagation(), I(fe, !U(fe));
		}), K("keydown", n, (e) => {
			e.key === "Escape" && I(fe, !1);
		}), J(e, t);
	}, j = (e) => {
		var t = ts(), n = L(t, !0);
		M(t), V(() => {
			Z(t, 1, (U(p), W(() => `item-status-capsule status-${U(p).tone}`))), Y(n, U(m));
		}), J(e, t);
	};
	X(je, (e) => {
		b() ? e(Me) : (U(h), U(g), W(() => U(h).length === 1 && U(g).length === 1) ? e(A, 1) : (U(g), W(() => U(g).length) ? e(Ne, 2) : e(j, -1)));
	}), M(Ae);
	var Pe = z(Ae, 2), Fe = (e) => {
		var t = hs(), n = L(t);
		M(t), V(() => Q(n, "aria-label", (G(y()), W(() => `刪除子項目：${y().title}`)))), K("click", n, () => S()({
			type: "delete-item",
			taskId: _(),
			field: v(),
			itemId: y().id
		})), J(e, t);
	};
	X(Pe, (e) => {
		b() && e(Fe);
	}), M(Oe), M(he), hi(he, (e, t) => ie?.(e, t), () => !!(k() && U(a) && !b())), V(() => {
		ge = Z(he, 1, "editor-item-row", null, ge, {
			"editable-work-item": b(),
			"item-drop-before": b() && E()?.side === "before",
			"item-drop-after": b() && E()?.side === "after",
			"item-gap-before": !b() && E()?.side === "before",
			"item-gap-after": !b() && E()?.side === "after",
			"item-row-reorderable": !b() && !!E(),
			"item-row-dragging": !!E()?.dragging,
			"is-selected": U(c),
			"is-next": O()
		}), Q(he, "data-select-key", U(s) ? U(a) : void 0), Q(he, "tabindex", U(s) ? 0 : void 0), Q(he, "draggable", (G(b()), G(E()), W(() => !b() && E()?.armed ? "true" : void 0))), Q(he, "title", U(o) || void 0);
	}), K("click", he, function(...e) {
		(U(s) ? (e) => D().rowClick(U(a), e) : void 0)?.apply(this, e);
	}), Ar("focus", he, function(...e) {
		(U(s) ? () => D().rowFocus(U(a)) : void 0)?.apply(this, e);
	}), Ar("pointerenter", he, ae), K("pointerdown", he, function(...e) {
		(b() ? void 0 : E()?.arm)?.apply(this, e);
	}), K("pointerup", he, function(...e) {
		(b() ? void 0 : E()?.disarm)?.apply(this, e);
	}), Ar("dragstart", he, function(...e) {
		(b() ? void 0 : E()?.start)?.apply(this, e);
	}), Ar("dragend", he, function(...e) {
		(b() ? void 0 : E()?.end)?.apply(this, e);
	}), K("keydown", he, function(...e) {
		(b() ? void 0 : (e) => {
			if (e.shiftKey && e.key === "Enter" && k() && U(a) && e.target === e.currentTarget) {
				e.preventDefault(), re();
				return;
			}
			E()?.keydown?.(e), !e.defaultPrevented && U(s) && D().rowKeydown(U(a), e);
		})?.apply(this, e);
	}), Ar("dragover", he, function(...e) {
		(E()?.over)?.apply(this, e);
	}), Ar("dragleave", he, function(...e) {
		(E()?.leave)?.apply(this, e);
	}), Ar("drop", he, function(...e) {
		(E()?.drop)?.apply(this, e);
	}), J(e, he), qe(), i();
}
jr([
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
var vs = globalThis.TaskProgressPriorityPolicy;
Object.freeze(Object.fromEntries(vs.levels.map((e) => [e.value, e])));
var ys = vs.fallbackValue;
function bs(e) {
	return vs.normalize(e, ys);
}
function xs(e) {
	return bs(typeof e == "object" && e && !Array.isArray(e) ? e.priority : void 0);
}
function Ss(e) {
	return [...e ?? []].map((e, t) => ({
		item: e,
		index: t
	})).sort((e, t) => xs(e.item) - xs(t.item) || e.index - t.index).map(({ item: e }) => e);
}
Object.freeze([
	"status",
	"summary",
	"completed_items",
	"pending_items",
	"progress",
	"priority"
]), Object.freeze([
	"done",
	"waiting",
	"in_progress"
]);
function Cs(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ws(e, t) {
	if (!t) return e;
	let n = (e ?? []).findIndex((e) => Cs(e) && e.id === t);
	return n <= 0 ? e : [
		e[n],
		...e.slice(0, n),
		...e.slice(n + 1)
	];
}
//#endregion
//#region experiments/editor-svelte-spike/src/CopyIdButton.svelte
var Ts = /* @__PURE__ */ q("<button type=\"button\"> </button>");
function Es(e, t) {
	Ke(t, !1);
	let n = $(t, "id", 8), r = $(t, "label", 8), i = /* @__PURE__ */ F(""), a;
	async function o(e) {
		e.stopPropagation(), clearTimeout(a);
		let t = await Ho(n());
		I(i, t ? "已複製" : "無法複製"), a = setTimeout(() => {
			I(i, "");
		}, 1500);
	}
	qi();
	var s = Ts();
	let c;
	var l = L(s, !0);
	M(s), V(() => {
		c = Z(s, 1, "task-id-copy", null, c, {
			"is-done": U(i),
			"is-copied": U(i) === "已複製"
		}), Q(s, "aria-label", U(i) || `複製「${r()}」的卡片 ID`), Q(s, "title", U(i) || n()), Y(l, U(i) === "已複製" ? "✓" : U(i) ? "✕" : "⧉");
	}), K("click", s, o), J(e, s), qe();
}
jr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Ds = /* @__PURE__ */ q("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Os = /* @__PURE__ */ q("<div class=\"task-summary\"><!></div>"), ks = /* @__PURE__ */ q("<button type=\"button\" class=\"completed-more\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> </button>"), As = /* @__PURE__ */ q("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul> <!></section>"), js = /* @__PURE__ */ q("<option> </option>"), Ms = /* @__PURE__ */ q("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Ns = /* @__PURE__ */ q("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Ps = /* @__PURE__ */ q("<div class=\"spike-add-shell\"><!></div>"), Fs = /* @__PURE__ */ q("<!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div>", 1), Is = /* @__PURE__ */ q("<div class=\"time-task-status-line\"><select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select></div>"), Ls = /* @__PURE__ */ q("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Rs = /* @__PURE__ */ q("<!> <h3> </h3>", 1), zs = /* @__PURE__ */ q("<span> </span>"), Bs = /* @__PURE__ */ q("<div class=\"task-module-totals\"></div>"), Vs = /* @__PURE__ */ q("<header slot=\"header\" class=\"task-header\"><div class=\"task-title-group\"><!> <div class=\"time-task-title-line\"><!></div> <!></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <span> </span> <code class=\"task-id\"> </code></div></header>"), Hs = /* @__PURE__ */ q("<article><!></article>");
function Us(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = $(t, "visibilityEnabled", 8, !1), s = $(t, "visible", 8, !0), c = $(t, "onVisibleChange", 8, () => {}), l = $(t, "expanded", 8, !0), u = $(t, "onToggle", 8, () => {}), d = $(t, "task", 8), f = $(t, "progress", 8), p = $(t, "editing", 8), m = $(t, "policy", 8), h = $(t, "onCommand", 8), g = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let _ = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), v = $(t, "onModuleActivate", 8, () => {}), y = $(t, "moduleOrder", 24, () => ["time"]), b = $(t, "onModuleReorder", 8, () => {}), x = $(t, "statusOrder", 24, () => ["done", "planned"]), S = $(t, "moduleTotals", 24, () => []), C = $(t, "lead", 8, !1), w = $(t, "scopeId", 8, null), T = $(t, "reorderable", 8, !1), ee = $(t, "onReorder", 8, () => {}), te = $(t, "selection", 8, null), E = $(t, "nextItemId", 8, null), ne = $(t, "onSetNext", 8, null), D = /* @__PURE__ */ F(!1), O = [
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
	], k = /* @__PURE__ */ F(!1), re = /* @__PURE__ */ F(""), ie = /* @__PURE__ */ F(m().creationDefaultValue), ae = /* @__PURE__ */ F(""), oe = /* @__PURE__ */ F(d().status), se = /* @__PURE__ */ F(m().normalize(d().priority, m().fallbackValue));
	function ce() {
		I(k, !1), I(re, ""), I(ie, m().creationDefaultValue), I(ae, "");
	}
	let le = /* @__PURE__ */ F(null), ue = /* @__PURE__ */ F(null), de = /* @__PURE__ */ F(null);
	function fe() {
		I(le, null), I(ue, null), I(de, null);
	}
	function pe(e, t) {
		return m().normalize(e.priority, m().fallbackValue) === m().normalize(t.priority, m().fallbackValue);
	}
	function me(e, t, n) {
		let r = (d().pending_items ?? []).map((e) => e?.id), i = r.filter((t) => t !== e);
		if (i.splice(i.indexOf(t) + +!!n, 0, e), i.every((e, t) => e === r[t])) return;
		let a = n ? { after: t } : { before: t };
		return p() ? h()({
			type: "reorder-item",
			taskId: d().id,
			itemId: e,
			position: a
		}) : ee()({
			taskId: d().id,
			itemId: e,
			position: a
		});
	}
	function he(e, t, n, r, i) {
		let a = t.find((e) => e.id === n);
		return {
			side: r?.id === e.id ? r.after ? "after" : "before" : null,
			armed: i === e.id,
			dragging: n === e.id,
			arm(t) {
				p() || t.button !== 0 || t.pointerType !== "mouse" || t.target.closest("a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg") || I(de, e.id);
			},
			disarm() {
				U(de) === e.id && U(le) !== e.id && I(de, null);
			},
			start(t) {
				t.stopPropagation(), I(le, e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e.id);
			},
			end: fe,
			over(t) {
				if (!a || a.id === e.id || !pe(a, e)) return;
				t.preventDefault(), t.stopPropagation(), t.dataTransfer.dropEffect = "move";
				let n = (t.currentTarget.querySelector(".item-row-description") ?? t.currentTarget).getBoundingClientRect();
				I(ue, {
					id: e.id,
					after: t.clientY >= n.top + n.height / 2
				});
			},
			leave(t) {
				!t.currentTarget.contains(t.relatedTarget) && U(ue)?.id === e.id && I(ue, null);
			},
			drop(t) {
				!a || U(ue)?.id !== e.id || (t.preventDefault(), t.stopPropagation(), me(a.id, e.id, U(ue).after), fe());
			},
			keydown(n) {
				if (!n.altKey || !["ArrowUp", "ArrowDown"].includes(n.key)) return;
				n.preventDefault(), n.stopPropagation();
				let r = t.filter((t) => t.id && pe(t, e)), i = r[r.findIndex((t) => t.id === e.id) + (n.key === "ArrowUp" ? -1 : 1)];
				if (!i) return;
				let a = CSS.escape(`${d().id}/${e.id}`);
				Promise.resolve(me(e.id, i.id, n.key === "ArrowDown")).then(() => Sr()).then(() => document.querySelector(`[data-item-ref="${a}"]`)?.focus());
			}
		};
	}
	function ge() {
		let e = g()(U(re), Number(U(ie)));
		I(ae, e.error), U(ae) || ce();
	}
	B(() => (G(d()), G(E())), () => {
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
			items: ws(Ss(d().pending_items), E())
		}]);
	}), B(() => (U(n), G(x())), () => {
		I(r, [...U(n)].sort((e, t) => {
			let n = x().indexOf(e.status), r = x().indexOf(t.status);
			return (n < 0 ? x().length : n) - (r < 0 ? x().length : r);
		}));
	}), B(() => (G(m()), G(d())), () => {
		I(i, m().metadata(d().priority));
	}), B(() => G(d()), () => {
		I(oe, d().status);
	}), B(() => (G(m()), G(d())), () => {
		I(se, m().normalize(d().priority, m().fallbackValue));
	}), B(() => G(d()), () => {
		I(a, O.find((e) => e.value === d().status) ?? {
			label: d().status,
			tone: "muted"
		});
	}), B(() => (G(p()), U(k)), () => {
		!p() && U(k) && ce();
	}), B(() => G(p()), () => {
		p(), fe();
	}), Fn(), qi();
	var _e = Hs(), ve = L(_e);
	{
		let e = /* @__PURE__ */ N(() => (G(d()), W(() => `task-body-${d().id}`)));
		_o(ve, {
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
				var n = Fs(), i = R(n), a = (e) => {
					var t = Ds();
					pt(t), V(() => Fi(t, (G(d()), W(() => d().summary)))), K("input", t, (e) => h()({
						type: "set-task-field",
						taskId: d().id,
						field: "summary",
						value: e.currentTarget.value
					})), J(e, t);
				}, o = (e) => {
					var t = Os();
					Bo(L(t), {
						get text() {
							return G(d()), W(() => d().summary);
						},
						lines: 2,
						emphasis: !0
					}), M(t), J(e, t);
				};
				X(i, (e) => {
					p() ? e(a) : e(o, -1);
				});
				var s = z(i, 2);
				{
					let e = /* @__PURE__ */ N(() => (G(d()), W(() => d().developer ?? null)));
					No(s, { get developer() {
						return U(e);
					} });
				}
				var c = z(s, 2), l = L(c);
				si(l, 1, () => U(r), (e) => e.status, (e, t) => {
					var n = Vr(), r = R(n), i = (e) => {
						var n = As(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2);
						si(a, 7, () => (U(t), U(D), W(() => U(t).status === "done" && !U(D) ? U(t).items.slice(0, 1) : U(t).items)), (e) => e.id, (e, n, r) => {
							{
								let i = /* @__PURE__ */ N(() => (G(_()), U(n), W(() => _().get(U(n).id) ?? []))), a = /* @__PURE__ */ N(() => (G(C()), U(t), G(U(r)), U(n), G(E()), W(() => C() && U(t).status === "planned" && U(r) === 0 || U(n).id === E()))), o = /* @__PURE__ */ N(() => (U(n), G(E()), W(() => U(n).id === E()))), s = /* @__PURE__ */ N(() => (G(p()), U(n), G(ne()), W(() => !p() && U(n).id && !U(n).legacy ? ne() : null))), c = /* @__PURE__ */ N(() => p() ? null : te()), l = /* @__PURE__ */ N(() => (G(p()), G(T()), U(t), U(n), U(le), U(ue), U(de), W(() => (p() || T()) && U(t).status === "planned" && U(n).id && !U(n).legacy ? he(U(n), U(t).items, U(le), U(ue), U(de)) : null)));
								_s(e, {
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
										return O;
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
						}), M(a);
						var o = z(a, 2), s = (e) => {
							var n = ks(), r = L(n), i = L(r);
							M(r);
							var a = z(r);
							M(n), V(() => {
								Q(n, "aria-expanded", U(D)), Q(n, "aria-controls", (G(d()), U(t), W(() => `task-${d().id}-${U(t).field}`))), Q(i, "d", U(D) ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"), Y(a, ` ${U(D), U(t), W(() => U(D) ? "收合" : `顯示更多（${U(t).items.length - 1}項）`) ?? ""}`);
							}), K("click", n, () => I(D, !U(D))), J(e, n);
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
					var t = Ps(), n = L(t), r = (e) => {
						var t = Ms(), n = L(t);
						Pi(n);
						var r = z(n, 2);
						si(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = js(), r = L(n, !0);
							M(n);
							var i = {};
							V((e) => {
								Y(r, e), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}, [() => (G(m()), U(t), W(() => m().format(U(t).value)))]), J(e, n);
						}), M(r);
						var i = z(r, 2), a = z(i, 2), o = z(a, 2), s = L(o, !0);
						M(o), M(t), V(() => {
							Q(o, "hidden", !U(ae)), Y(s, U(ae));
						}), K("keydown", n, (e) => {
							e.key === "Enter" && ge(), e.key === "Escape" && ce();
						}), Bi(n, () => U(re), (e) => I(re, e)), Oi(r, () => U(ie), (e) => I(ie, e)), K("click", i, ge), K("click", a, ce), J(e, t);
					}, i = (e) => {
						var t = Ns();
						V(() => Q(t, "aria-label", (G(d()), W(() => `在「${d().title}」新增子項目`)))), K("click", t, () => {
							I(k, !0);
						}), J(e, t);
					};
					X(n, (e) => {
						U(k) ? e(r) : e(i, -1);
					}), M(t), J(e, t);
				};
				X(f, (e) => {
					p() && e(g);
				}), M(u), M(c), J(e, n);
			},
			$$slots: {
				default: !0,
				header: (e, t) => {
					var n = Vs(), r = L(n), i = L(r), o = (e) => {
						var t = Is(), n = L(t);
						si(n, 5, () => O, (e) => e.value, (e, t) => {
							var n = js(), r = L(n, !0);
							M(n);
							var i = {};
							V(() => {
								Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
							}), J(e, n);
						}), M(n);
						var r = z(n, 2);
						si(r, 5, () => (G(m()), W(() => m().levels)), (e) => e.value, (e, t) => {
							var n = js(), r = L(n, !0);
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
							value: U(oe)
						})), Oi(n, () => U(oe), (e) => I(oe, e)), K("change", r, () => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "priority",
							value: Number(U(se))
						})), Oi(r, () => U(se), (e) => I(se, e)), J(e, t);
					};
					X(i, (e) => {
						p() && e(o);
					});
					var s = z(i, 2), c = L(s), l = (e) => {
						var t = Ls();
						Pi(t), V(() => {
							Q(t, "id", (G(d()), W(() => `task-${d().id}-title`))), Fi(t, (G(d()), W(() => d().title)));
						}), K("input", t, (e) => h()({
							type: "set-task-field",
							taskId: d().id,
							field: "title",
							value: e.currentTarget.value
						})), J(e, t);
					}, u = (e) => {
						var t = Rs(), n = R(t);
						Es(n, {
							get id() {
								return G(d()), W(() => d().id);
							},
							get label() {
								return G(d()), W(() => d().title);
							}
						});
						var r = z(n, 2), i = L(r, !0);
						M(r), V(() => {
							Q(r, "id", (G(d()), W(() => `task-${d().id}-title`))), Y(i, (G(d()), W(() => d().title)));
						}), J(e, t);
					};
					X(c, (e) => {
						p() ? e(l) : e(u, -1);
					}), M(s);
					var g = z(s, 2), _ = (e) => {
						var t = Bs();
						si(t, 5, S, (e) => e.id, (e, t) => {
							var n = zs(), r = L(n, !0);
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
					var w = z(x, 2), T = L(w, !0);
					M(w), M(v), M(n), V(() => {
						Q(y, "aria-label", (G(f()), W(() => `子項目完成 ${f().completed}，共 ${f().total}`))), Y(b, `${G(f()), W(() => f().completed) ?? ""} / ${G(f()), W(() => f().total) ?? ""}`), Z(x, 1, (U(a), W(() => `status-badge status-${U(a).tone}`))), Y(C, (U(a), W(() => U(a).label))), Y(T, (G(d()), W(() => d().id)));
					}), J(e, n);
				}
			}
		});
	}
	M(_e), V(() => {
		Z(_e, 1, (U(i), W(() => `task-card editor-task-card priority-${U(i)?.tone ?? "unspecified"}`))), Q(_e, "aria-labelledby", (G(d()), W(() => `task-${d().id}-title`)));
	}), J(e, _e), qe();
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
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = $(t, "items", 24, () => []), a = $(t, "value", 8), o = $(t, "label", 8, "選擇"), s = $(t, "interaction", 8, "picker"), c = $(t, "orientation", 8, "horizontal"), l = $(t, "placement", 8, "aligned"), u = $(t, "onChoose", 8, () => {}), d = /* @__PURE__ */ F(), f = /* @__PURE__ */ F(), p = /* @__PURE__ */ F(), m = /* @__PURE__ */ F(), h = /* @__PURE__ */ F(!1), g = /* @__PURE__ */ F(!1), _ = /* @__PURE__ */ F(!1), v = /* @__PURE__ */ F(null), y = /* @__PURE__ */ F(0), b = /* @__PURE__ */ F(0), x = /* @__PURE__ */ F(!1), S = /* @__PURE__ */ F(null), C = 0;
	function w(e = !1) {
		clearTimeout(U(m)), C++, U(S) !== null && U(f)?.hasPointerCapture(U(S)) && U(f).releasePointerCapture(U(S)), I(S, null), I(h, !1), I(g, !1), I(v, null), I(x, !1), e && U(f)?.focus();
	}
	function T(e) {
		w(!0), u()(e);
	}
	async function ee(e = !1) {
		if (!U(r).length) return;
		I(h, !0), I(x, !1);
		let t = ++C;
		if (await Sr(), !U(h) || t !== C || !U(p)) return;
		let n = U(f).getBoundingClientRect(), i = U(p).getBoundingClientRect(), o = [...U(p).querySelectorAll("button")], s = o.find((e) => e.dataset.choice === String(a())) ?? o[0], u = s.getBoundingClientRect();
		l() === "aligned" ? (I(y, n.left + n.width / 2 - (u.left - i.left + u.width / 2)), I(b, n.top + n.height / 2 - (u.top - i.top + u.height / 2))) : c() === "horizontal" ? (I(y, n.right + 4), U(y) + i.width > window.innerWidth - 4 && I(y, n.left - i.width - 4), I(b, n.top + (n.height - i.height) / 2)) : (I(y, n.left + (n.width - i.width) / 2), I(b, n.bottom + 4), U(b) + i.height > window.innerHeight - 4 && I(b, n.top - i.height - 4)), I(y, Math.max(4, Math.min(U(y), window.innerWidth - i.width - 4))), I(b, Math.max(4, Math.min(U(b), window.innerHeight - i.height - 4))), I(x, !0), await Sr(), e && U(h) && t === C && s.focus({ preventScroll: !0 });
	}
	function te(e) {
		let t = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-choice]");
		return t && U(p)?.contains(t) ? t.dataset.choice : null;
	}
	function E(e) {
		if (clearTimeout(U(m)), U(S) !== null) {
			if (U(g)) {
				let t = te(e);
				I(_, !0), t === null ? w(!0) : T(U(r).find((e) => String(e.id) === t).id);
			} else {
				let t = U(f).getBoundingClientRect();
				(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && (I(_, !0), w(!0));
			}
			I(S, null);
		}
	}
	function ne(e) {
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
			ee(!0);
			return;
		}
		let n = [...U(p).querySelectorAll("button")], r = n.indexOf(document.activeElement);
		n[e.key === "Home" ? 0 : e.key === "End" ? n.length - 1 : (r + (e.key === t[0] ? -1 : 1) + n.length) % n.length]?.focus();
	}
	function D() {
		U(S) !== null && I(_, !0), w(U(d)?.contains(document.activeElement));
	}
	$r(() => clearTimeout(U(m))), B(() => (G(i()), G(a())), () => {
		I(n, i().find((e) => e.id === a() && e.kind !== "action") ?? i().find((e) => e.kind !== "action"));
	}), B(() => (G(i()), G(a()), G(l())), () => {
		I(r, Gs(i(), a(), l()));
	}), Fn(), qi();
	var O = Js();
	Ar("pointerdown", fn, (e) => {
		U(d)?.contains(e.target) || w();
	}), Ar("resize", fn, D), Ar("blur", fn, D), Ar("scroll", pn, (e) => {
		U(p)?.contains(e.target) || D();
	}, !0);
	var k = L(O);
	let re;
	pi(L(k), t, "icon", { get item() {
		return U(n);
	} }, null), M(k), Ki(k, (e) => I(f, e), () => U(f));
	var ie = z(k, 2), ae = (e) => {
		var n = qs();
		let i, s;
		si(n, 5, () => U(r), (e) => e.id, (e, n) => {
			var r = Ks();
			let i;
			pi(L(r), t, "icon", { get item() {
				return U(n);
			} }, null), M(r), V((e) => {
				i = Z(r, 1, "card-toolbar-icon", null, i, e), Q(r, "data-choice", (U(n), W(() => U(n).id))), Q(r, "aria-label", (U(n), W(() => U(n).label))), Q(r, "title", (U(n), W(() => U(n).label))), Q(r, "aria-pressed", (U(n), G(a()), W(() => U(n).kind === "action" ? void 0 : U(n).id === a())));
			}, [() => ({ "icon-choice-hover": U(v) === String(U(n).id) })]), K("keydown", r, ne), K("click", r, () => T(U(n).id)), J(e, r);
		}), M(n), Ki(n, (e) => I(p, e), () => U(p)), V(() => {
			i = Z(n, 1, "icon-choice-options", null, i, { vertical: c() === "vertical" }), Q(n, "aria-label", `${o()}選項`), s = Ti(n, "", s, {
				left: `${U(y)}px`,
				top: `${U(b)}px`,
				visibility: U(x) ? "visible" : "hidden"
			});
		}), J(e, n);
	};
	X(ie, (e) => {
		U(h) && e(ae);
	}), M(O), Ki(O, (e) => I(d, e), () => U(d)), V(() => {
		Q(O, "aria-label", o()), Q(k, "aria-label", (G(o()), U(n), W(() => `${o()}：${U(n)?.label ?? ""}`))), Q(k, "aria-expanded", s() === "cycle" ? void 0 : U(h)), Q(k, "title", (G(o()), U(n), G(s()), W(() => `${o()}：${U(n)?.label ?? ""}；${s() === "both" ? "點擊切換，長按選擇" : s() === "cycle" ? "點擊切換" : "點擊或長按選擇"}`))), k.disabled = !U(n), re = Ti(k, "", re, { "touch-action": s() === "cycle" ? "auto" : "none" });
	}), K("focusout", O, (e) => {
		U(d).contains(e.relatedTarget) || w();
	}), K("keydown", k, ne), K("pointerdown", k, (e) => {
		e.button === 0 && (I(_, !1), !(s() === "cycle" || U(h)) && (I(S, e.pointerId), U(f).setPointerCapture(U(S)), clearTimeout(U(m)), I(m, setTimeout(() => {
			I(g, !0), ee();
		}, 300))));
	}), K("pointermove", k, (e) => {
		U(g) && I(v, te(e));
	}), K("pointerup", k, E), Ar("pointercancel", k, D), K("click", k, () => {
		if (U(_)) {
			I(_, !1);
			return;
		}
		if (U(h)) {
			w(!0);
			return;
		}
		if (s() === "picker") ee(!0);
		else {
			let e = Ws(i(), a());
			e !== void 0 && u()(e);
		}
	}), J(e, O), qe();
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
			let n = /* @__PURE__ */ N(() => t.item);
			var r = Vr(), i = R(r), a = (e) => {
				J(e, Xs());
			}, o = (e) => {
				{
					let t = /* @__PURE__ */ N(() => (G(U(n)), W(() => U(n)?.id === "closed"))), r = /* @__PURE__ */ N(() => (G(U(n)), W(() => U(n)?.id === "disabled")));
					mo(e, {
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
function rc(e, t, n, r = [], i = null) {
	let a = n === "free" ? ic(e, t) : n === "reverse" ? [...e].reverse() : e, o = new Map(e.map((e) => [e.id, e])), s = new Set(r), c = r.length ? [...s].filter((e) => o.has(e)).map((e) => o.get(e)).concat(a.filter((e) => !s.has(e.id))) : a;
	return i === null || !o.has(i) ? c : [o.get(i), ...c.filter((e) => e.id !== i)];
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
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ F(), o = $(t, "items", 24, () => []), s = $(t, "allIds", 24, () => []), c = $(t, "storageKey", 8), l = $(t, "pinEnabled", 8, !1), u = $(t, "requestedPin", 8, null), d = $(t, "heldOrder", 8, null), f = $(t, "onSelectionChange", 8, null), p = $(t, "nextId", 8, null), m = $(t, "hiddenCount", 8, 0), h = $(t, "onShowHidden", 8, null);
	function g(e = o()) {
		return rc(e, U(D), U(x), l() ? U(_) : [], p()).map((e) => e.id);
	}
	let _ = /* @__PURE__ */ F([]), v = null, y = $(t, "expanded", 8, !0), b = $(t, "onToggleAll", 8, () => {}), x = /* @__PURE__ */ F("forward"), S = [
		"forward",
		"reverse",
		"free"
	], C = {
		forward: "順排",
		reverse: "逆排",
		free: "自由排序（可拖曳）"
	}, w = /* @__PURE__ */ F("disabled"), T = /* @__PURE__ */ F([]);
	function ee() {
		if (c()) try {
			sessionStorage.setItem(`${c()}:visibility`, JSON.stringify({
				mode: U(w),
				hiddenIds: U(T)
			}));
		} catch {}
	}
	function te(e) {
		let t = $s(U(w), U(T), e);
		I(w, t.mode), I(T, t.hiddenIds), he(), ee();
	}
	function E(e, t) {
		I(T, t ? U(T).filter((t) => t !== e) : [.../* @__PURE__ */ new Set([...U(T), e])]), he(), ee();
	}
	function ne(e) {
		U(w) === "closed" && I(w, "enabled"), E(e, !0);
	}
	let D = /* @__PURE__ */ F(null), O = /* @__PURE__ */ F(null);
	Qr(() => {
		if (!f()) return;
		let e = (e) => {
			let t = e.target?.closest?.(".arrangeable-card");
			(!t || !U(ae)?.contains(t)) && I(O, null);
		}, t = () => {
			I(O, null);
		}, n = (e) => {
			e.key === "Escape" && !e.isComposing && ge();
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("focusin", e, !0), document.addEventListener("keydown", n, !0), window.addEventListener("blur", t), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("focusin", e, !0), document.removeEventListener("keydown", n, !0), window.removeEventListener("blur", t);
		};
	});
	let k = /* @__PURE__ */ F(null), re = /* @__PURE__ */ F(null), ie = /* @__PURE__ */ F(null), ae = /* @__PURE__ */ F(), oe = /* @__PURE__ */ F("");
	function se(e, t, n, r) {
		if (!r || !e || !n.length) return;
		let i = JSON.stringify([t, e]);
		if (v !== i) {
			if (v = i, !n.includes(e)) {
				I(oe, `找不到卡片 ID：${e}`);
				return;
			}
			I(_, nc(U(_), e)), ne(e), ce();
		}
	}
	function ce() {
		if (!c()) {
			I(oe, "釘選僅保留於本頁");
			return;
		}
		try {
			localStorage.setItem(`${c()}:pins`, JSON.stringify(U(_))), I(oe, "已記住本機釘選");
		} catch {
			I(oe, "此環境無法保存檢視設定；釘選僅保留於本頁");
		}
	}
	function le(e) {
		he(), I(_, U(_).includes(e) ? U(_).filter((t) => t !== e) : nc(U(_), e)), ce();
	}
	function ue(e) {
		if (v = null, I(_, []), e) try {
			let t = JSON.parse(localStorage.getItem(`${e}:pins`) ?? "null");
			I(_, Array.isArray(t) ? [...new Set(t.filter((e) => typeof e == "string" || typeof e == "number"))] : []);
		} catch {}
		if (I(w, "disabled"), I(T, []), e) try {
			let t = JSON.parse(sessionStorage.getItem(`${e}:visibility`));
			I(w, [
				"enabled",
				"closed",
				"disabled"
			].includes(t?.mode) ? t.mode : t?.enabled === !0 ? "enabled" : "disabled"), I(T, Array.isArray(t?.hiddenIds) ? t.hiddenIds : []);
		} catch {}
		if (I(O, null), I(k, null), I(re, null), I(ie, null), !e) {
			I(D, null), I(x, "forward");
			return;
		}
		try {
			let t = JSON.parse(localStorage.getItem(e) ?? "null");
			I(D, Array.isArray(t) ? t : null);
			let n = localStorage.getItem(`${e}:mode`);
			I(x, S.includes(n) ? n : U(D) ? "free" : "forward");
		} catch {
			I(D, null), I(x, "forward");
		}
	}
	function de(e) {
		if (I(D, e), !c()) {
			I(oe, "順序僅保留於本頁");
			return;
		}
		try {
			e ? localStorage.setItem(c(), JSON.stringify(e)) : localStorage.removeItem(c()), I(oe, e ? "已記住本機卡片順序" : "已還原排序");
		} catch {
			I(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	function fe(e) {
		if (he(), I(x, e), I(oe, ""), c()) try {
			localStorage.setItem(`${c()}:mode`, U(x));
		} catch {
			I(oe, "此環境無法保存檢視設定；順序僅保留於本頁");
		}
	}
	async function pe(e, t, n) {
		U(x) === "free" && (l() && (U(_).includes(e) || U(_).includes(t)) || e !== t && (de(ac(s(), U(D), U(r).map((e) => e.id), e, t, n)), f()?.(null), I(O, e), f()?.(U(O)), await Sr(), [...U(ae).querySelectorAll("[data-card-id]")].find((t) => t.dataset.cardId === String(e))?.focus()));
	}
	function me(e, t) {
		let n = U(r).findIndex((t) => t.id === e);
		if (n < 0) return;
		let i = U(r)[n + t];
		i && pe(e, i.id, t > 0);
	}
	function he() {
		I(k, null), I(re, null), I(ie, null);
	}
	function ge() {
		let e = document.activeElement;
		U(ae)?.contains(e) && e.blur?.(), I(O, null), he();
	}
	function _e(e, t) {
		if (l() && U(_).includes(e.id) || U(re) === null || U(re) === e.id) return;
		t.preventDefault(), t.dataTransfer.dropEffect = "move";
		let n = t.currentTarget.getBoundingClientRect();
		I(ie, {
			id: e.id,
			after: t.clientY >= n.top + n.height / 2
		});
	}
	B(() => U(w), () => {
		I(n, U(w) === "enabled");
	}), B(() => (G(o()), U(D), U(x), G(l()), U(_), G(p()), G(d())), () => {
		I(i, ic(rc(o(), U(D), U(x), l() ? U(_) : [], p()), d()));
	}), B(() => (U(i), U(w), U(T), G(l()), U(_)), () => {
		I(r, U(i).filter((e) => Qs(e.id, U(w), U(T)) && !(l() && U(_).includes(e.id))));
	}), B(() => (G(f()), U(O)), () => {
		f()?.(U(O));
	}), B(() => G(c()), () => {
		ue(c());
	}), B(() => (U(i), U(w), U(T)), () => {
		I(a, U(i).find((e) => Qs(e.id, U(w), U(T)))?.id ?? null);
	}), B(() => (G(u()), G(c()), G(s()), G(l())), () => {
		se(u(), c(), s(), l());
	}), Fn();
	var ve = {
		orderedIds: g,
		revealCard: ne
	};
	qi();
	var ye = fc(), be = R(ye), xe = L(be);
	pi(z(L(xe), 2), t, "filters", {}, null), M(xe);
	var Se = z(xe, 2), Ce = L(Se), we = L(Ce), Te = L(we);
	M(we), M(Ce);
	var Ee = z(Ce, 2);
	{
		let e = /* @__PURE__ */ N(() => W(() => S.map((e) => ({
			id: e,
			label: C[e]
		}))));
		Ys(Ee, {
			get items() {
				return U(e);
			},
			get value() {
				return U(x);
			},
			label: "排序",
			interaction: "both",
			orientation: "vertical",
			onChoose: fe,
			$$slots: { icon: (e, t) => {
				let n = /* @__PURE__ */ N(() => t.item);
				var r = cc(), i = L(r), a = (e) => {
					J(e, oc());
				}, o = (e) => {
					var t = sc(), r = R(t), i = z(r);
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
	var De = z(Ee, 2);
	Zs(De, {
		get mode() {
			return U(w);
		},
		onChoose: te
	});
	var Oe = z(De, 2), ke = L(Oe, !0);
	M(Oe), pi(z(Oe, 2), t, "tools", {}, null), M(Se), M(be);
	var Ae = z(be, 2);
	si(Ae, 5, () => U(i), (e) => e.id, (e, r) => {
		var i = uc();
		let o;
		var s = L(i), c = (e) => {
			var t = lc();
			let n;
			var i = L(t), a = L(i);
			M(i), M(t), V((e, r, i, o, s) => {
				n = Z(t, 1, "card-pin", null, n, e), Q(t, "aria-label", r), Q(t, "aria-pressed", i), Q(t, "title", o), Q(a, "fill", s);
			}, [
				() => ({
					"is-pinned": U(_).includes(U(r).id),
					"is-next": p() !== null && U(r).id === p()
				}),
				() => (U(_), U(r), W(() => U(_).includes(U(r).id) ? `取消釘選：${U(r).title}` : `釘選置頂：${U(r).title}`)),
				() => (U(_), U(r), W(() => U(_).includes(U(r).id))),
				() => (U(_), U(r), W(() => U(_).includes(U(r).id) ? "取消釘選" : "釘選置頂")),
				() => (U(_), U(r), G(p()), W(() => U(_).includes(U(r).id) || p() !== null && U(r).id === p() ? "currentColor" : "none"))
			]), K("click", t, () => le(U(r).id)), J(e, t);
		};
		X(s, (e) => {
			l() && e(c);
		});
		var u = z(s, 2);
		{
			let e = /* @__PURE__ */ N(() => (U(T), U(r), W(() => !U(T).includes(U(r).id))));
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
				onVisibleChange: (e) => E(U(r).id, e)
			}, null);
		}
		M(i), V((e) => {
			Q(i, "hidden", e), o = Z(i, 1, "arrangeable-card", null, o, {
				"card-selected": U(O) === U(r).id,
				"card-drop-before": U(ie)?.id === U(r).id && !U(ie).after,
				"card-drop-after": U(ie)?.id === U(r).id && U(ie).after
			}), Q(i, "aria-label", (U(r), U(O), W(() => `${U(r).title}${U(O) === U(r).id ? "，已選取" : ""}`))), Q(i, "data-card-id", (U(r), W(() => U(r).id))), Q(i, "draggable", (U(x), U(k), U(r), W(() => U(x) === "free" && U(k) === U(r).id)));
		}, [() => (G(Qs), U(r), U(w), U(T), W(() => !Qs(U(r).id, U(w), U(T))))]), K("pointerdown", i, (e) => {
			I(k, null), e.button === 0 && (I(O, U(r).id), !e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"]") && (U(x) !== "free" || e.pointerType !== "mouse" || l() && U(_).includes(U(r).id) || e.target.closest("button, a, input, textarea, select, label, [contenteditable], [role=\"button\"], [role=\"checkbox\"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg") || I(k, U(r).id)));
		}), K("focusin", i, () => {
			I(O, U(r).id);
		}), K("input", i, () => {
			I(O, U(r).id);
		}), K("pointerup", i, () => {
			I(k, null);
		}), K("keydown", i, (e) => {
			if (e.key === "Escape" && !e.isComposing) {
				ge();
				return;
			}
			e.target === e.currentTarget && ((e.key === "Enter" || e.key === " ") && (e.preventDefault(), I(O, U(r).id)), U(x) === "free" && e.target === e.currentTarget && e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key) && (e.preventDefault(), me(U(r).id, e.key === "ArrowUp" ? -1 : 1)));
		}), Ar("dragstart", i, (e) => {
			U(x) === "free" && U(k) === U(r).id && e.target === e.currentTarget && (I(re, U(r).id), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(U(r).id)));
		}), Ar("dragend", i, he), Ar("dragover", i, (e) => _e(U(r), e)), Ar("dragleave", i, (e) => {
			e.currentTarget.contains(e.relatedTarget) || I(ie, null);
		}), Ar("drop", i, (e) => {
			U(re) !== null && U(ie)?.id === U(r).id && (e.preventDefault(), pe(U(re), U(r).id, U(ie).after), he());
		}), J(e, i);
	}), M(Ae), Ki(Ae, (e) => I(ae, e), () => U(ae));
	var je = z(Ae, 2), Me = (e) => {
		var t = dc(), n = L(t), r = L(n);
		M(n), M(t), V(() => Y(r, `…顯示隱藏項目(${m() ?? ""})`)), K("click", n, function(...e) {
			h()?.apply(this, e);
		}), J(e, t);
	};
	return X(je, (e) => {
		m() > 0 && h() && e(Me);
	}), V(() => {
		Q(Ce, "aria-label", y() ? "全部收合" : "全部展開"), Q(Ce, "title", y() ? "全部收合" : "全部展開"), Q(Te, "d", y() ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"), Y(ke, U(oe));
	}), K("click", Ce, () => b()(!y())), J(e, ye), Wi(t, "orderedIds", g), Wi(t, "revealCard", ne), qe(ve);
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
	}), Fn(), qi();
	var p = Cc(), m = L(p);
	{
		let e = /* @__PURE__ */ N(() => (G(l()), W(() => `task-body-${l().id}`)));
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
				return U(e);
			},
			get label() {
				return G(l()), W(() => l().title);
			},
			children: (e, t) => {
				var r = Vr(), i = R(r), a = (e) => {
					var t = hc(), r = R(t);
					Bo(L(r), {
						get text() {
							return U(n), W(() => U(n).summary);
						},
						emphasis: !0
					}), M(r);
					var i = z(r, 2), a = L(i);
					M(i);
					var o = z(i, 2);
					si(o, 5, () => (U(n), W(() => U(n).rows)), (e) => e.id, (e, t) => {
						let n = /* @__PURE__ */ N(() => (U(t), W(() => f(U(t).status))));
						var r = mc(), i = L(r), a = L(i, !0);
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
					var i = Sc(), a = L(i), o = L(a), s = L(o), c = L(s), d = (e) => {
						var t = gc(), n = L(t, !0);
						M(t), V(() => {
							Q(t, "href", (G(u()), W(() => u().openHref))), Y(n, (G(l()), W(() => l().title)));
						}), J(e, t);
					}, f = (e) => {
						var t = Br();
						V(() => Y(t, (G(l()), W(() => l().title)))), J(e, t);
					};
					X(c, (e) => {
						G(u()), W(() => u().openHref) ? e(d) : e(f, -1);
					}), M(s), M(o);
					var p = z(o, 2), m = (e) => {
						var t = _c();
						V(() => Q(t, "href", (G(u()), W(() => u().openHref)))), J(e, t);
					};
					X(p, (e) => {
						G(u()), W(() => u().openHref) && e(m);
					}), M(a);
					var h = z(a, 2), g = L(h), _ = (e) => {
						var t = vc(), r = L(t);
						M(t), V(() => Y(r, `${U(n), W(() => U(n).progress.completed) ?? ""} / ${U(n), W(() => U(n).progress.total) ?? ""}`)), J(e, t);
					};
					X(g, (e) => {
						U(n) && e(_);
					});
					var v = z(g, 2), y = (e) => {
						var t = yc(), n = L(t, !0);
						M(t), V(() => {
							Z(t, 1, (U(r), W(() => `status-badge status-${U(r).tone}`))), Y(n, (U(r), W(() => U(r).label)));
						}), J(e, t);
					};
					X(v, (e) => {
						U(r) && e(y);
					});
					var b = z(v, 2), x = (e) => {
						J(e, bc());
					};
					X(b, (e) => {
						G(u()), W(() => u().status === "loading") && e(x);
					});
					var S = z(b, 2), C = (e) => {
						var t = xc(), n = L(t, !0);
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
var Tc = /* @__PURE__ */ q("<span class=\"task-search\"><input type=\"search\" aria-label=\"搜尋任務卡名稱、摘要與子項\" placeholder=\"搜尋名稱、摘要、子項\"/> <svg class=\"task-search-icon\" viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\"><circle cx=\"7\" cy=\"7\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"></circle><path d=\"M10.4 10.4 14 14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"></path></svg></span>"), Ec = /* @__PURE__ */ q("<p class=\"empty-state\"> </p>"), Dc = /* @__PURE__ */ q("<!> <!>", 1);
function Oc(e, t) {
	Ke(t, !1);
	let n = /* @__PURE__ */ F(), r = $(t, "filters", 8, null), i = $(t, "tasks", 24, () => []), a = $(t, "allIds", 24, () => []), o = $(t, "cardStorageKey", 8, null), s = $(t, "requestedPin", 8, null), c = $(t, "scopeId", 8, null), l = $(t, "searchQuery", 8, ""), u = $(t, "onSearch", 8, null), d = $(t, "reorderable", 8, !1), f = $(t, "onReorder", 8, () => {}), p = $(t, "selection", 8, null), m = $(t, "progress", 24, () => ({})), h = $(t, "editing", 8, !1), g = $(t, "policy", 8), _ = $(t, "onCommand", 8, () => {}), v = $(t, "onAddItem", 8, () => {}), y = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), b = $(t, "itemCapsules", 24, () => /* @__PURE__ */ new Map()), x = $(t, "onModuleActivate", 8, () => {}), S = $(t, "moduleOrder", 24, () => ["time"]), C = $(t, "onModuleReorder", 8, () => {}), w = $(t, "moduleTotals", 24, () => ({})), T = $(t, "statusOrder", 24, () => ["done", "planned"]), ee = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。"), te = $(t, "pointerCards", 24, () => ({})), E = $(t, "nextTaskId", 8, null), ne = $(t, "nextItemId", 8, null), D = $(t, "onSetNext", 8, null), O = $(t, "hiddenCount", 8, 0), k = $(t, "onShowHidden", 8, null), re = /* @__PURE__ */ F(!0), ie = /* @__PURE__ */ F({}), ae = null;
	function oe(e, t) {
		!e || ae === JSON.stringify([t, e]) || (ae = JSON.stringify([t, e]), I(ie, {
			...U(ie),
			[e]: !0
		}));
	}
	function se(e) {
		ae = null;
		let t = so(e);
		I(re, t.expanded), I(ie, t.overrides);
	}
	function ce(e, t) {
		I(ie, {
			...U(ie),
			[e]: t
		}), co(U(n), U(re), U(ie));
	}
	function le(e) {
		I(re, e), I(ie, {}), co(U(n), U(re), U(ie));
	}
	B(() => G(o()), () => {
		I(n, `taskprogress.disclosure:${o() ?? location.href}`);
	}), B(() => U(n), () => {
		se(U(n));
	}), B(() => (G(s()), U(n)), () => {
		oe(s(), U(n));
	}), Fn(), qi();
	var ue = Dc(), de = R(ue);
	pc(de, {
		pinEnabled: !0,
		get requestedPin() {
			return s();
		},
		get nextId() {
			return E();
		},
		get hiddenCount() {
			return O();
		},
		get onShowHidden() {
			return k();
		},
		get expanded() {
			return U(re);
		},
		onToggleAll: le,
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
				var s = Vr(), l = R(s), u = (e) => {
					{
						let t = /* @__PURE__ */ N(() => (U(ie), G(U(n)), U(re), W(() => U(ie)[U(n).id] ?? U(re)))), r = /* @__PURE__ */ N(() => (G(te()), G(U(n)), W(() => te()[U(n).id] ?? { status: "loading" })));
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
							onToggle: (e) => ce(U(n).id, e),
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
						let t = /* @__PURE__ */ N(() => (U(ie), G(U(n)), U(re), W(() => U(ie)[U(n).id] ?? U(re)))), s = /* @__PURE__ */ N(() => (G(y()), G(U(n)), W(() => y().get(U(n).id) ?? null))), l = /* @__PURE__ */ N(() => (G(w()), G(U(n)), W(() => w()[U(n).id] ?? [])));
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
							onToggle: (e) => ce(U(n).id, e),
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
								return T();
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
								return ne();
							},
							get onSetNext() {
								return D();
							}
						});
					}
				};
				X(l, (e) => {
					G(U(n)), W(() => U(n).kind === "report_pointer") ? e(u) : e(ee, -1);
				}), J(e, s);
			},
			filters: (e, t) => {
				var n = Vr(), i = R(n), a = (e) => {
					io(e, Xi(r));
				};
				X(i, (e) => {
					r() && e(a);
				}), J(e, n);
			},
			tools: (e, t) => {
				var n = Vr(), r = R(n), i = (e) => {
					var t = Tc(), n = L(t);
					Pi(n), Ie(2), M(t), V(() => Fi(n, l())), K("input", n, (e) => u()(e.currentTarget.value)), J(e, t);
				};
				X(r, (e) => {
					u() && e(i);
				}), J(e, n);
			}
		}
	});
	var fe = z(de, 2), pe = (e) => {
		var t = Ec(), n = L(t, !0);
		M(t), V(() => Y(n, ee())), J(e, t);
	};
	X(fe, (e) => {
		G(i()), W(() => !i().length) && e(pe);
	}), J(e, ue), qe();
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ F(!1), p = /* @__PURE__ */ F([]), m = /* @__PURE__ */ F(a()), h = /* @__PURE__ */ F(o()?.base ?? s()), g = /* @__PURE__ */ F(v(Nc(U(h)))), _ = /* @__PURE__ */ F({ ...U(g) });
	function v(e) {
		return Object.fromEntries(kc.map((t) => [t.key, e[t.key]]));
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
		y(o() ? Nc(o().base, o()) : Nc(s())), I(f, !0);
	}
	function S() {
		I(f, !1);
	}
	function C(e) {
		y(Nc(e.currentTarget.value));
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
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), I(g, {
			...U(g),
			[e.key]: n.value
		}), r && I(_, {
			...U(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function ee() {
		I(m, a()), S();
	}
	function te() {
		let e = U(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(Nc(U(h), U(_))), S();
	}
	B(() => G(a()), () => {
		I(m, a());
	}), B(() => (U(h), U(_)), () => {
		I(n, Nc(U(h), U(_)));
	}), B(() => U(n), () => {
		I(r, Ic(U(n)));
	}), B(() => U(r), () => {
		I(i, U(r).length ? `注意：${U(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Fn(), qi();
	var E = Bc(), ne = R(E), D = z(L(ne), 2);
	si(D, 5, () => u, (e) => e.value, (e, t) => {
		var n = Lc(), r = L(n, !0);
		M(n);
		var i = {};
		V(() => {
			Y(r, (U(t), W(() => U(t).label))), i !== (i = (U(t), W(() => U(t).value))) && (n.value = (n.__value = (U(t), W(() => U(t).value))) ?? "");
		}), J(e, n);
	}), M(D), M(ne), ga(z(ne, 2), {
		get open() {
			return U(f);
		},
		id: "theme-dialog",
		titleId: "theme-dialog-title",
		kicker: "Custom theme",
		title: "自訂 Viewer 顏色",
		closeLabel: "關閉自訂主題",
		onClose: ee,
		children: (e, t) => {
			var a = zc(), o = z(R(a), 2), s = z(L(o), 2), c = L(s);
			c.value = c.__value = "light";
			var l = z(c);
			l.value = l.__value = "dark", M(s);
			var u;
			Di(s), M(o);
			var d = z(o, 2);
			si(d, 7, () => kc, (e) => e.key, (e, t, r) => {
				var i = Rc(), a = L(i), o = L(a, !0);
				M(a);
				var s = z(a, 2), c = L(s);
				Pi(c);
				var l = z(c, 2);
				Pi(l), Q(l, "pattern", "#[0-9a-fA-F]{6}"), Ki(l, (e, t) => rn(p, U(p)[t] = e), (e) => U(p)?.[e], () => [U(r)]), M(s), M(i), V(() => {
					Y(o, (U(t), W(() => U(t).label))), Q(c, "aria-label", (U(t), W(() => `${U(t).label}選色器`))), Fi(c, (U(n), U(t), W(() => U(n)[U(t).key]))), Q(l, "aria-label", (U(t), W(() => `${U(t).label}十六進位色碼`))), Fi(l, (U(g), U(t), W(() => U(g)[U(t).key])));
				}), K("input", c, (e) => w(U(t), U(r), e)), K("input", l, (e) => T(U(t), e)), J(e, i);
			}), M(d);
			var f = z(d, 2);
			let m;
			var _ = L(f, !0);
			M(f);
			var v = z(f, 2), b = L(v), x = z(b, 4), S = z(x, 2);
			M(v), V(() => {
				u !== (u = U(h)) && (s.value = (s.__value = U(h)) ?? "", Ei(s, U(h))), m = Z(f, 1, "theme-dialog-status", null, m, { "theme-status-warning": U(r).length > 0 }), Y(_, U(i));
			}), K("change", s, C), K("click", b, () => y(Nc(U(h)))), K("click", x, ee), K("click", S, te), J(e, a);
		},
		$$slots: { default: !0 }
	}), K("change", D, b), Oi(D, () => U(m), (e) => I(m, e)), J(e, E), qe();
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
	qi();
	var u = Gc(), d = L(u), f = L(d);
	si(z(L(f), 2), 1, () => (G(n()), W(() => n().sourceBadges)), (e) => e.kind, (e, t) => {
		var n = Hc(), r = L(n, !0);
		M(n), V(() => {
			Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
		}), J(e, n);
	}), M(f);
	var p = z(f, 2), m = z(L(p), 2);
	Pi(m), M(p), M(d);
	var h = z(d, 2);
	da(L(h), {
		heading: "估算依據",
		children: (e, t) => {
			var r = Uc(), i = z(L(r), 2);
			Pi(i), M(r), V(() => Q(i, "aria-label", (G(n()), W(() => `「${n().title}」人工依據`)))), Bi(i, () => U(o), (e) => I(o, e)), J(e, r);
		},
		$$slots: { default: !0 }
	}), M(h);
	var g = z(h, 2), _ = L(g);
	Pi(_), Ie(2), M(g);
	var v = z(g, 4), y = L(v);
	M(v);
	var b = z(v, 2), x = (e) => {
		var t = Wc(), n = L(t, !0);
		M(t), V(() => Y(n, U(c))), J(e, t);
	};
	X(b, (e) => {
		U(c) && e(x);
	}), M(u), V(() => {
		Q(m, "aria-label", (G(n()), W(() => `「${n().title}」人工工時（hr）`))), Q(_, "aria-label", (G(n()), W(() => `確認「${n().title}」的人工估算`))), Q(y, "aria-label", (G(n()), W(() => `套用「${n().title}」人工估算草稿`)));
	}), Ar("submit", u, (e) => {
		e.preventDefault(), l();
	}), Bi(m, () => U(a), (e) => I(a, e)), Vi(_, () => U(s), (e) => I(s, e)), J(e, u), qe();
}
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSettingsEditor.svelte
var qc = /* @__PURE__ */ q("<label><input type=\"checkbox\"/> <span> </span></label>"), Jc = /* @__PURE__ */ q("<div class=\"spike-exception-row\"><label><span>日期</span><input type=\"date\"/></label> <label><span>可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>請假／例外說明</span><input maxlength=\"500\" placeholder=\"例如：不可工作\"/></label> <button class=\"spike-delete-exception\" type=\"button\">刪除</button></div>"), Yc = /* @__PURE__ */ q("<div class=\"spike-exception-list\"></div>"), Xc = /* @__PURE__ */ q("<p class=\"spike-empty-setting\">目前沒有休假或容量例外。</p>"), Zc = /* @__PURE__ */ q("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Qc = /* @__PURE__ */ q("<section class=\"spike-time-editor\" aria-labelledby=\"time-settings-title\"><div class=\"spike-time-editor-heading\"><p class=\"spike-editor-kicker\">時間設定</p> <h2 id=\"time-settings-title\">工作容量與交付日</h2> <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p> <p class=\"spike-timezone\"> </p></div> <div class=\"spike-time-settings-fields\"><section class=\"spike-delivery-settings\" aria-labelledby=\"delivery-settings-title\"><h3 id=\"delivery-settings-title\">交付日</h3> <div class=\"spike-delivery-controls\"><label><span>排他截止時間</span><input type=\"datetime-local\"/></label> <label class=\"spike-delivery-reason\"><span>修改原因（不填敏感原文）</span><input maxlength=\"500\" placeholder=\"例如：配合里程碑調整\"/></label> <button class=\"spike-subtle-button\" type=\"button\">設為未指定</button></div></section> <section class=\"spike-capacity-settings\" aria-labelledby=\"capacity-settings-title\"><div class=\"spike-setting-heading\"><h3 id=\"capacity-settings-title\">每日分配</h3> <strong> </strong></div> <div class=\"spike-allocation-fields\"><label><span>睡眠（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>生活（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label> <label><span>其他不可工作（hr）</span><input type=\"number\" min=\"0\" max=\"24\" step=\"0.5\"/></label></div> <fieldset class=\"spike-weekdays\"><legend>工作日</legend> <!></fieldset></section> <section class=\"spike-exception-settings\" aria-labelledby=\"exception-settings-title\"><div class=\"spike-setting-heading\"><div><h3 id=\"exception-settings-title\">休假與容量例外</h3> <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div> <button class=\"spike-subtle-button\" type=\"button\">＋ 新增例外</button></div> <!></section> <div class=\"spike-time-settings-actions\"><button type=\"button\">重新計算預覽</button> <!></div></div></section>");
function $c(e, t) {
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
	function T(e) {
		I(_, U(_).filter((t) => t.key !== e)), x();
	}
	function ee() {
		if (!U(u)) return "";
		let e = l.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
		return `${U(u)}:00${e ?? b(U(u), r().timezone)}`;
	}
	function te() {
		let e = i()({
			deliveryAt: ee(),
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
		te().error || (o()(!1), await a()());
	}
	B(() => (U(f), U(p), U(m)), () => {
		I(n, 24 - Number(U(f)) - Number(U(p)) - Number(U(m)));
	}), Fn(), qi();
	var ne = Qc(), D = L(ne), O = z(L(D), 6), k = L(O);
	M(O), M(D);
	var re = z(D, 2), ie = L(re), ae = z(L(ie), 2), oe = L(ae), se = z(L(oe));
	Pi(se), M(oe);
	var ce = z(oe, 2), le = z(L(ce));
	Pi(le), M(ce);
	var ue = z(ce, 2);
	M(ae), M(ie);
	var de = z(ie, 2), fe = L(de), pe = z(L(fe), 2);
	let me;
	var he = L(pe);
	M(pe), M(fe);
	var ge = z(fe, 2), _e = L(ge), ve = z(L(_e));
	Pi(ve), M(_e);
	var ye = z(_e, 2), be = z(L(ye));
	Pi(be), M(ye);
	var xe = z(ye, 2), Se = z(L(xe));
	Pi(Se), M(xe), M(ge);
	var Ce = z(ge, 2);
	si(z(L(Ce), 2), 1, () => s, (e) => e.value, (e, t) => {
		var n = qc(), r = L(n);
		Pi(r);
		var i = z(r, 2), a = L(i);
		M(i), M(n), V((e) => {
			Ii(r, e), Y(a, `週${U(t), W(() => U(t).label) ?? ""}`);
		}, [() => (U(h), U(t), W(() => U(h).includes(U(t).value)))]), K("change", r, (e) => S(U(t).value, e.currentTarget.checked)), J(e, n);
	}), M(Ce), M(de);
	var we = z(de, 2), Te = L(we), Ee = z(L(Te), 2);
	M(Te);
	var De = z(Te, 2), Oe = (e) => {
		var t = Yc();
		si(t, 5, () => U(_), (e) => e.key, (e, t) => {
			var n = Jc(), r = L(n), i = z(L(r));
			Pi(i), M(r);
			var a = z(r, 2), o = z(L(a));
			Pi(o), M(a);
			var s = z(a, 2), c = z(L(s));
			Pi(c), M(s);
			var l = z(s, 2);
			M(n), V(() => {
				Fi(i, (U(t), W(() => U(t).date))), Fi(o, (U(t), W(() => U(t).availableHours))), Fi(c, (U(t), W(() => U(t).publicLabel)));
			}), K("input", i, (e) => C(U(t).key, "date", e.currentTarget.value)), K("input", o, (e) => C(U(t).key, "availableHours", e.currentTarget.value)), K("input", c, (e) => C(U(t).key, "publicLabel", e.currentTarget.value)), K("click", l, () => T(U(t).key)), J(e, n);
		}), M(t), J(e, t);
	}, ke = (e) => {
		J(e, Xc());
	};
	X(De, (e) => {
		U(_), W(() => U(_).length) ? e(Oe) : e(ke, -1);
	}), M(we);
	var Ae = z(we, 2), je = L(Ae), Me = z(je, 2), A = (e) => {
		var t = Zc(), n = L(t, !0);
		M(t), V(() => Y(n, U(v))), J(e, t);
	};
	X(Me, (e) => {
		U(v) && e(A);
	}), M(Ae), M(re), M(ne), V((e) => {
		Y(k, `時區：${G(r()), W(() => r().timezone) ?? ""}`), me = Z(pe, 1, "", null, me, { invalid: !(U(n) > 0) }), Y(he, `工作 ${e ?? ""} hr`);
	}, [() => (U(n), W(() => Number.isFinite(U(n)) ? U(n) : "—"))]), K("input", se, x), Bi(se, () => U(u), (e) => I(u, e)), K("input", le, x), Bi(le, () => U(d), (e) => I(d, e)), K("click", ue, () => {
		I(u, ""), x();
	}), K("input", ve, x), Bi(ve, () => U(f), (e) => I(f, e)), K("input", be, x), Bi(be, () => U(p), (e) => I(p, e)), K("input", Se, x), Bi(Se, () => U(m), (e) => I(m, e)), K("click", Ee, w), K("click", je, E), J(e, ne), qe();
}
jr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeDialog.svelte
var el = (e, t = _, n = _) => {
	var r = sl(), i = L(r), a = L(i, !0);
	M(i);
	var o = z(i, 2), s = L(o, !0);
	M(o);
	var c = z(o, 2), l = L(c, !0);
	M(c), M(r), V((e) => {
		Z(r, 1, e), Y(a, (t(), W(() => t().label))), Y(s, (t(), W(() => t().value))), Y(l, (t(), W(() => t().note)));
	}, [() => vi((n(), W(() => `time-evaluation-node ${n()}`.trim())))]), J(e, r);
}, tl = (e, t = _) => {
	var n = ll();
	si(n, 5, t, ri, (e, t) => {
		var n = cl(), r = L(n), i = L(r), a = L(i, !0);
		M(i);
		var o = z(i), s = L(o, !0);
		M(o), M(r);
		var c = z(r, 2), l = L(c, !0);
		M(c), M(n), V(() => {
			Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
		}), J(e, n);
	}), M(n), J(e, n);
}, nl = (e, t = _) => {
	var n = ul();
	tl(z(L(n), 2), t), M(n), J(e, n);
}, rl = (e, t = _, n = _) => {
	var r = dl(), i = L(r), a = L(i, !0);
	M(i);
	var o = z(i, 2), s = L(o), c = L(s);
	el(c, () => (t(), W(() => t().engineeringLane.source)), () => ""), el(z(c, 4), () => (t(), W(() => t().engineeringLane.result)), () => "time-evaluation-result"), M(s);
	var l = z(s, 2), u = L(l);
	el(u, () => (t(), W(() => t().capacityLane.source)), () => ""), el(z(u, 4), () => (t(), W(() => t().capacityLane.result)), () => "time-evaluation-result"), M(l), M(o);
	var d = z(o, 2);
	el(z(L(d), 2), () => (t(), W(() => t().merge)), () => (t(), W(() => t().merge.className))), M(d);
	var f = z(d, 2), p = L(f);
	el(p, () => (t(), W(() => t().risk.trend)), () => ""), el(z(p, 4), () => (t(), W(() => t().risk.result)), () => (t(), W(() => t().risk.result.className))), M(f);
	var m = z(f, 2), h = L(m, !0);
	M(m), M(r), V(() => {
		Q(r, "hidden", !n()), Y(a, (t(), W(() => t().intro))), Y(h, (t(), W(() => t().note)));
	}), J(e, r);
}, il = (e, t = _, n = _) => {
	var r = ml(), i = L(r);
	ca(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = z(i, 2);
	da(a, {
		heading: "風險評估公式",
		get tone() {
			return t(), W(() => t().explanation.className);
		},
		children: (e, n) => {
			var r = fl(), i = R(r), a = L(i, !0);
			M(i);
			var o = z(i, 2), s = L(o, !0);
			M(o), V(() => {
				Y(a, (t(), W(() => t().explanation.text))), Y(s, (t(), W(() => t().explanation.formula)));
			}), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = z(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = pl(), i = L(r, !0);
			M(r), V(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), nl(z(o, 2), () => (t(), W(() => t().composition))), M(r), V(() => Q(r, "hidden", !n())), J(e, r);
}, al = (e, t = _, n = _) => {
	var r = _l(), i = z(L(r), 2);
	ca(i, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var a = z(i, 2);
	da(a, {
		heading: "每日容量公式",
		children: (e, n) => {
			var r = hl(), i = z(R(r), 2), a = L(i, !0);
			M(i), V(() => Y(a, (t(), W(() => t().formulaCode)))), J(e, r);
		},
		$$slots: { default: !0 }
	});
	var o = z(a, 2), s = L(o), c = L(s, !0);
	M(s);
	var l = z(s, 2), u = L(l), d = (e) => {
		var n = Vr();
		si(R(n), 1, () => (t(), W(() => t().exceptions)), ri, (e, t) => {
			var n = cl(), r = L(n), i = L(r), a = L(i, !0);
			M(i);
			var o = z(i), s = L(o, !0);
			M(o), M(r);
			var c = z(r, 2), l = L(c, !0);
			M(c), M(n), V(() => {
				Y(a, (U(t), W(() => U(t).label))), Y(s, (U(t), W(() => U(t).note))), Y(l, (U(t), W(() => U(t).value)));
			}), J(e, n);
		}), J(e, n);
	}, f = (e) => {
		J(e, gl());
	};
	X(u, (e) => {
		t(), W(() => t().exceptions) ? e(d) : e(f, -1);
	}), M(l), M(o), M(r), V(() => {
		Q(r, "hidden", !n()), Y(c, (t(), W(() => t().exceptionsHeading)));
	}), J(e, r);
}, ol = (e, t = _) => {
	var n = vl(), r = L(n), i = L(r, !0);
	M(r);
	var a = z(r, 2);
	ca(a, { get metrics() {
		return t(), W(() => t().metrics);
	} });
	var o = z(a, 2);
	da(o, {
		heading: "執行校準",
		children: (e, n) => {
			var r = pl(), i = L(r, !0);
			M(r), V(() => Y(i, (t(), W(() => t().calibrationText)))), J(e, r);
		},
		$$slots: { default: !0 }
	}), nl(z(o, 2), () => (t(), W(() => t().composition))), M(n), V(() => Y(i, (t(), W(() => t().intro)))), J(e, n);
}, sl = /* @__PURE__ */ q("<div><span> </span> <strong> </strong> <small> </small></div>"), cl = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong><p> </p></div> <span> </span></div>"), ll = /* @__PURE__ */ q("<div class=\"time-source-list\"></div>"), ul = /* @__PURE__ */ q("<section class=\"time-composition\"><h3>估算組成</h3> <!></section>"), dl = /* @__PURE__ */ q("<section class=\"time-tab-panel time-flow-panel\" id=\"time-flow-panel\" role=\"tabpanel\" aria-labelledby=\"time-flow-tab\"><p class=\"time-flow-intro\"> </p> <div class=\"time-flow-lanes\"><section class=\"time-flow-lane\" aria-label=\"工程估算路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section> <section class=\"time-flow-lane\" aria-label=\"工作容量路徑\"><!> <span class=\"time-flow-arrow\">→</span> <!></section></div> <div class=\"time-flow-merge\"><span class=\"time-flow-arrow\">↓</span> <!></div> <div class=\"time-flow-lane time-flow-risk\"><!> <span class=\"time-flow-arrow\">→</span> <!></div> <p class=\"time-flow-note\"> </p></section>"), fl = /* @__PURE__ */ q("<p> </p> <code class=\"time-formula\"> </code>", 1), pl = /* @__PURE__ */ q("<p> </p>"), ml = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-engineering-panel\" role=\"tabpanel\" aria-labelledby=\"time-engineering-tab\"><!> <!> <!> <!></section>"), hl = /* @__PURE__ */ q("<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p> <code class=\"time-formula\"> </code>", 1), gl = /* @__PURE__ */ q("<p class=\"time-empty-note\">目前沒有休假或其他容量例外。</p>"), _l = /* @__PURE__ */ q("<section class=\"time-tab-panel\" id=\"time-capacity-panel\" role=\"tabpanel\" aria-labelledby=\"time-capacity-tab\"><div class=\"time-capacity-toolbar\"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div> <!> <!> <section class=\"time-composition\"><h3> </h3> <div class=\"time-source-list\"><!></div></section></section>"), vl = /* @__PURE__ */ q("<section class=\"time-tab-panel time-estimate-only-panel\"><p class=\"time-flow-intro\"> </p> <!> <!> <!></section>"), yl = /* @__PURE__ */ q("<span> </span>"), bl = /* @__PURE__ */ q("<!> <div class=\"time-item-rationale\"><!></div>", 1), xl = /* @__PURE__ */ q("<div class=\"time-source-row\"><div><strong> </strong> <p> </p></div> <span> </span></div>"), Sl = /* @__PURE__ */ q("<code class=\"time-formula\"> </code>"), Cl = /* @__PURE__ */ q("<code class=\"time-reference\"> </code>"), wl = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <!> <section class=\"time-item-technical\"><!> <!> <!> <!></section></div>"), Tl = /* @__PURE__ */ q("<span aria-hidden=\"true\"></span>"), El = /* @__PURE__ */ q("<div class=\"time-report-field\"><span> </span> <strong><!> </strong></div>"), Dl = /* @__PURE__ */ q("<!> <!>", 1), Ol = /* @__PURE__ */ q("<section class=\"time-missing-config\" aria-labelledby=\"time-missing-config-title\"><h3 id=\"time-missing-config-title\">尚未建立工作容量設定</h3> <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p> <button type=\"button\">建立 8/8/8 預設設定</button></section>"), kl = /* @__PURE__ */ q("<button class=\"time-tab\" type=\"button\" role=\"tab\"> </button>"), Al = /* @__PURE__ */ q("<div class=\"time-tab-list\" role=\"tablist\" aria-label=\"進度報告詳細資訊\"></div> <!> <!> <!>", 1), jl = /* @__PURE__ */ q("<div><div class=\"time-detail-toolbar\"><span class=\"time-report-caption\"> </span> <button class=\"time-small-button\" type=\"button\"> </button></div> <section class=\"time-report-overview\"><div class=\"time-report-grid\"></div> <p class=\"time-report-updated\"> </p></section> <section class=\"time-project-details\"><!></section></div>"), Ml = /* @__PURE__ */ q("<div class=\"time-dialog-content\"><!></div>");
function Nl(e, t) {
	Ke(t, !1);
	let n = $(t, "open", 8, !1), r = $(t, "kind", 8, null), i = $(t, "kicker", 8, ""), a = $(t, "title", 8, ""), o = $(t, "project", 8, null), s = $(t, "item", 8, null), c = $(t, "onClose", 8, () => {}), l = $(t, "onToggleDetails", 8, () => {}), u = $(t, "onSetTab", 8, (e) => {}), d = $(t, "editing", 8, !1), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "timeSettings", 8, null), h = $(t, "deliveryPreview", 8, null), g = /* @__PURE__ */ F([]);
	async function _(e, t, n) {
		if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
		e.preventDefault();
		let r = (t + (e.key === "ArrowRight" ? 1 : -1) + n.length) % n.length;
		u()(n[r].name), await Sr(), U(g)[r]?.focus();
	}
	qi();
	{
		let t = /* @__PURE__ */ N(() => `關閉${i()}`);
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
				var n = Ml(), i = L(n), c = (e) => {
					var t = wl(), n = L(t), r = L(n), i = L(r, !0);
					M(r);
					var o = z(r, 2), c = L(o, !0);
					M(o), M(n);
					var u = z(n, 2), m = (e) => {
						var t = Vr();
						ni(R(t), () => (G(s()), G(f()), W(() => `${s().itemId}:${f()?.estimate_id ?? "analysis"}`)), (e) => {
							{
								let t = /* @__PURE__ */ N(() => (G(s()), G(a()), W(() => ({
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
						var t = bl(), n = R(t);
						ma(n, {
							label: "預估工時",
							get value() {
								return G(s()), W(() => s().likelyHoursLabel);
							},
							$$slots: { badges: (e, t) => {
								var n = Vr();
								si(R(n), 1, () => (G(s()), W(() => s().sourceBadges)), (e) => e.kind, (e, t) => {
									var n = yl(), r = L(n, !0);
									M(n), V(() => {
										Z(n, 1, `assessment-source-badge source-${U(t), W(() => U(t).kind) ?? ""}`), Y(r, (U(t), W(() => U(t).label)));
									}), J(e, n);
								}), J(e, n);
							} }
						});
						var r = z(n, 2);
						da(L(r), {
							heading: "估算依據",
							children: (e, t) => {
								var n = pl(), r = L(n, !0);
								M(n), V(() => Y(r, (G(s()), W(() => s().rationale)))), J(e, n);
							},
							$$slots: { default: !0 }
						}), M(r), J(e, t);
					};
					X(u, (e) => {
						d() && p() ? e(m) : e(h, -1);
					});
					var g = z(u, 2), _ = L(g);
					ca(_, { get metrics() {
						return G(s()), W(() => s().technical.metrics);
					} });
					var v = z(_, 2), y = (e) => {
						var t = xl(), n = L(t), r = L(n), i = L(r, !0);
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
						da(e, {
							heading: "固定公式",
							children: (e, t) => {
								var n = Sl(), r = L(n, !0);
								M(n), V(() => Y(r, (G(s()), W(() => s().technical.formula)))), J(e, n);
							},
							$$slots: { default: !0 }
						});
					};
					X(b, (e) => {
						G(s()), W(() => s().technical.formula) && e(x);
					});
					var S = z(b, 2), C = (e) => {
						var t = Cl(), n = L(t, !0);
						M(t), V(() => Y(n, (G(s()), W(() => s().technical.reference)))), J(e, t);
					};
					X(S, (e) => {
						G(s()), W(() => s().technical.reference) && e(C);
					}), M(g), M(t), V(() => {
						Z(r, 1, vi((G(s()), W(() => s().confidenceClass)))), Y(i, (G(s()), W(() => s().confidenceLabel))), Y(c, (G(s()), W(() => s().toggleLabel))), Q(g, "hidden", (G(s()), W(() => !s().detailsExpanded)));
					}), K("click", o, function(...e) {
						l()?.apply(this, e);
					}), J(e, t);
				}, v = (e) => {
					var t = jl(), n = L(t), r = L(n), i = L(r, !0);
					M(r);
					var a = z(r, 2), s = L(a, !0);
					M(a), M(n);
					var c = z(n, 2), f = L(c);
					si(f, 5, () => (G(o()), W(() => o().overview)), ri, (e, t) => {
						var n = El(), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = L(a), s = (e) => {
							var n = Tl();
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
						var t = Vr(), n = R(t), r = (e) => {
							var t = Dl(), n = R(t);
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
							var r = z(n, 2), i = (e) => {
								Oa(e, { get preview() {
									return h();
								} });
							};
							X(r, (e) => {
								h() && e(i);
							}), J(e, t);
						}, i = (e) => {
							var t = Ol(), n = z(L(t), 4);
							M(t), K("click", n, function(...e) {
								m().onInitializeConfig?.apply(this, e);
							}), J(e, t);
						};
						X(n, (e) => {
							G(m()), W(() => m().hasConfig) ? e(r) : e(i, -1);
						}), J(e, t);
					}, S = (e) => {
						var t = Al(), n = R(t);
						si(n, 7, () => (G(o()), W(() => o().tabs)), (e) => e.name, (e, t, n) => {
							var r = kl(), i = L(r, !0);
							M(r), Ki(r, (e, t) => rn(g, U(g)[t] = e), (e) => U(g)?.[e], () => [U(n)]), V(() => {
								Q(r, "id", (U(t), W(() => `time-${U(t).name}-tab`))), Q(r, "aria-controls", (U(t), W(() => `time-${U(t).name}-panel`))), Q(r, "aria-selected", (G(o()), U(t), W(() => o().activeTab === U(t).name))), Q(r, "tabindex", (G(o()), U(t), W(() => o().activeTab === U(t).name ? 0 : -1))), Y(i, (U(t), W(() => U(t).label)));
							}), K("click", r, () => u()(U(t).name)), K("keydown", r, (e) => _(e, U(n), o().tabs)), J(e, r);
						}), M(n);
						var r = z(n, 2);
						rl(r, () => (G(o()), W(() => o().flow)), () => (G(o()), W(() => o().activeTab === "flow")));
						var i = z(r, 2);
						il(i, () => (G(o()), W(() => o().engineering)), () => (G(o()), W(() => o().activeTab === "engineering"))), al(z(i, 2), () => (G(o()), W(() => o().capacity)), () => (G(o()), W(() => o().activeTab === "capacity"))), J(e, t);
					}, C = (e) => {
						ol(e, () => (G(o()), W(() => o().estimateOnly)));
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
jr(["click", "keydown"]);
//#endregion
//#region experiments/editor-svelte-spike/src/TimeSummaryButton.svelte
var Pl = /* @__PURE__ */ q("<span class=\"time-risk-dot\"></span>"), Fl = /* @__PURE__ */ q("<span class=\"time-chevron\">›</span>"), Il = /* @__PURE__ */ q("<button type=\"button\"><span> </span> <!> <!></button>");
function Ll(e, t) {
	let n = $(t, "hidden", 8, !0), r = $(t, "disabled", 8, !1), i = $(t, "className", 8, "time-summary-button"), a = $(t, "ariaLabel", 8, ""), o = $(t, "label", 8, ""), s = $(t, "showDot", 8, !1), c = $(t, "showChevron", 8, !1), l = $(t, "onClick", 8, () => {});
	var u = Il(), d = L(u), f = L(d, !0);
	M(d);
	var p = z(d, 2), m = (e) => {
		J(e, Pl());
	};
	X(p, (e) => {
		s() && e(m);
	});
	var h = z(p, 2), g = (e) => {
		J(e, Fl());
	};
	X(h, (e) => {
		c() && e(g);
	}), M(u), V(() => {
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
	"status-overview": oo,
	"status-filters": io,
	"project-progress": Ka,
	"report-summary": Ya,
	"mode-toggle": Pa,
	"save-bar": no,
	"add-control": ia,
	diagnostics: Ma,
	"scope-directory": Qa,
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
		let r = ln({ ...n });
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
