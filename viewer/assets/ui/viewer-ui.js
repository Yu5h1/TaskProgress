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
var b = 1024, x = 2048, S = 4096, C = 8192, ee = 16384, te = 32768, ne = 1 << 25, re = 65536, ie = 1 << 19, ae = 1 << 20, oe = 1 << 25, se = 65536, ce = 1 << 21, le = 1 << 22, ue = 1 << 23, de = Symbol("$state"), fe = Symbol("legacy props"), pe = Symbol(""), me = Symbol("attributes"), he = Symbol("class"), ge = Symbol("style"), _e = Symbol("text"), ve = Symbol("form reset"), ye = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), be = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function xe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Se(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ce(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function we() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Te(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ee() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function De(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Oe() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ke() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function je() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Me() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ne(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Pe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Fe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var w = !1;
function Ie(e) {
	w = e;
}
var T;
function E(e) {
	if (e === null) throw Ne(), t;
	return T = e;
}
function Le() {
	return E(/* @__PURE__ */ pn(T));
}
function D(e) {
	if (w) {
		if (/* @__PURE__ */ pn(T) !== null) throw Ne(), t;
		T = e;
	}
}
function Re(e = 1) {
	if (w) {
		for (var t = e, n = T; t--;) n = /* @__PURE__ */ pn(n);
		T = n;
	}
}
function ze(e = !0) {
	for (var t = 0, n = T;;) {
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
function Be(e) {
	if (!e || e.nodeType !== 8) throw Ne(), t;
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
var O = null;
function Ke(e) {
	O = e;
}
function qe(e, t = !1, n) {
	O = {
		p: O,
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
function Je(e) {
	var t = O, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Tn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, O = t.p, e ?? {};
}
function Ye() {
	return !We || O !== null && O.l === null;
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
	var t = V;
	if (t === null) return B.f |= ue, e;
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
function k(e, t) {
	e.f = e.f & nt | t;
}
function rt(e) {
	e.f & 512 || e.deps === null ? k(e, b) : k(e, S);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function it(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= se, it(t.deps));
}
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), it(e.deps), k(e, b);
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
	w && /* @__PURE__ */ fn(e) !== null && hn(e);
}
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ve]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = B, n = V;
	Jn(null), Yn(null);
	try {
		return e();
	} finally {
		Jn(t), Yn(n);
	}
}
function ft(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[ve];
	e[ve] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function pt(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Sn() && (W(n), jn(() => (t === 0 && (r = G(() => e(() => tn(n)))), t += 1, () => {
			Qe(() => {
				--t, t === 0 && (r?.(), r = void 0, tn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var mt = re | ie;
function ht(e, t, n, r) {
	new gt(e, t, n, r);
}
var gt = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = w ? T : null;
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
			var t = V;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = V.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Mn(() => {
			if (w) {
				let e = this.#t;
				Le();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, mt), w && (this.#e = T);
	}
	#g() {
		try {
			this.#a = R(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Qe(r), t && (this.#s = R(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Fe();
				return;
			}
			t = !0, n && je(), this.#s !== null && Rn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = R(() => e(this.#e)), Qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = N();
			e.append(t), this.#a = this.#S(() => R(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Rn(this.#o, () => {
				this.#o = null;
			}), this.#x(A));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = R(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Hn(this.#a, e);
				let t = this.#n.pending;
				this.#o = R(() => t(this.#e));
			} else this.#x(A);
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
		var t = V, n = B, r = O;
		Yn(this.#i), Jn(this.#i), Ke(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} catch (e) {
			return et(e), null;
		} finally {
			Yn(t), Jn(n), Ke(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Rn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Qe(() => {
			this.#d = !1, this.#m && $t(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), W(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		A?.is_fork ? (this.#a && A.skip_effect(this.#a), this.#o && A.skip_effect(this.#o), this.#s && A.skip_effect(this.#s), A.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), w && (E(this.#t), Re(), E(ze()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return R(() => {
						var r = V;
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
	var s = V, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
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
	var e = V, t = B, n = O, r = A;
	return function(i = !0) {
		Yn(e), Jn(t), Ke(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	Yn(null), Jn(null), Ke(null), e && A?.deactivate();
}
function bt() {
	var e = V, t = e.b, n = A, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var t = 2 | x;
	return V !== null && (V.f |= ie), {
		ctx: O,
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
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, t, r) {
	let i = V;
	i === null && xe();
	var a = void 0, o = Zt(n), s = !B, c = /* @__PURE__ */ new Set();
	return An(() => {
		var t = V, n = y();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var r = A;
		if (s) {
			if (t.f & 32768) var l = bt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(St);
			else for (let e of c.values()) e.reject(St);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== St && (r.activate(), t ? (o.f |= ue, $t(o, t)) : (o.f & 8388608 && (o.f ^= ue), $t(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Cn(() => {
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
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function Et(e) {
	var t, r = V, i = e.parent;
	if (!Gn && i !== null && e.v !== n && i.f & 24576) return Me(), e.v;
	Yn(i);
	try {
		e.f &= ~se, Tt(e), t = sr(e);
	} finally {
		Yn(r);
	}
	return t;
}
function Dt(e) {
	var t = Et(e);
	if (!e.equals(t) && (e.wv = ir(), (!A?.is_fork || e.deps === null) && (A === null ? e.v = t : (A.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null))) {
		k(e, b);
		return;
	}
	Gn || (Mt === null ? rt(e) : (Sn() || A?.is_fork) && Mt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(ye), t.ac = null;
	}), t.fn !== null && (t.teardown = g), lr(t, 0), Pn(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && ur(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, A = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
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
			for (var r of n.d) k(r, x), t(r);
			for (r of n.m) k(r, S), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Rt++ > 1e3 && (this.#x(), Ht());
		for (let e of this.#u) this.#d.delete(e), k(e, x), this.schedule(e);
		for (let e of this.#d) k(e, S), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = It = [], r = [], i = Lt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw qt(e), this.#h() || this.discard(), t;
		}
		if (A = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (It = null, Lt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Kt(e, t);
			i.length > 0 && A.#g();
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
		var s = A;
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
				a ? r.f ^= b : i & 4 ? t.push(r) : ar(r) && (i & 16 && this.#d.add(r), ur(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), k(i, x), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), A = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, r = !1) {
		e.v !== n && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, r]), Mt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		A = this;
	}
	deactivate() {
		A = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, A = this, this.#g();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, A = null, Mt = null, Yt.clear();
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
		if (A === null) {
			let t = A = new e();
			!Ft && !Pt && Qe(() => {
				t.#e || t.flush();
			});
		}
		return A;
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
			if (It !== null && t === V && (B === null || !(B.f & 2))) return;
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
		for (e && (A !== null && !A.is_fork && A.flush(), n = e());;) {
			if ($e(), A === null) return n;
			A.flush();
		}
	} finally {
		Pt = t;
	}
}
function Ht() {
	try {
		Ee();
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
			if (!(r.f & 24576) && ar(r) && (Ut = /* @__PURE__ */ new Set(), ur(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Ln(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || ur(n);
					}
				}
				Ut.clear();
			}
		}
		Ut = null;
	}
}
function Gt(e) {
	A.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), k(e, b);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	k(e, b);
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
	return Zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function j(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = Ue), We && n && O !== null && O.l !== null && (O.l.s ??= []).push(r), r;
}
function M(e, t, n = !1) {
	return B !== null && (!qn || B.f & 131072) && Ye() && B.f & 4325394 && (Xn === null || !Xn.has(e)) && Ae(), $t(e, n ? rn(t) : t, Lt);
}
function $t(e, t, n = null) {
	if (!e.equals(t)) {
		Yt.set(e, Gn ? t : e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Mt === null && rt(t);
		}
		e.wv = ir(), nn(e, x, n), Ye() && V !== null && V.f & 1024 && !(V.f & 96) && (Qn === null ? $n([e]) : Qn.push(e)), !r.is_fork && Jt.size > 0 && !Xt && en();
	}
	return t;
}
function en() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && k(e, S);
		let t;
		try {
			t = ar(e);
		} catch {
			t = !0;
		}
		t && ur(e);
	}
	Jt.clear();
}
function tn(e) {
	M(e, e.v + 1);
}
function nn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ye(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === V)) {
			var l = (c & x) === 0;
			if (l && k(s, t), c & 131072) Jt.add(s);
			else if (c & 2) {
				var u = s;
				Mt?.delete(u), c & 65536 || (c & 512 && (V === null || !(V.f & 2097152)) && (s.f |= se), nn(u, S, n));
			} else if (l) {
				var d = s;
				c & 16 && Ut !== null && Ut.add(d), n === null ? Gt(d) : n.push(d);
			}
		}
	}
}
function rn(e) {
	if (typeof e != "object" || !e || de in e) return e;
	let t = m(e);
	if (t !== f && t !== p) return e;
	var r = /* @__PURE__ */ new Map(), i = a(e), o = /* @__PURE__ */ Qt(0), s = null, c = nr, l = (e) => {
		if (nr === c) return e();
		var t = B, n = nr;
		Jn(null), rr(c);
		var r = e();
		return Jn(t), rr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Qt(e.length, s)), new Proxy(e, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Oe();
			var i = r.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ Qt(n.value, s);
				return r.set(t, e), e;
			}) : M(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = r.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ Qt(n, s));
					r.set(t, e), tn(o);
				}
			} else M(i, n), tn(o);
			return !0;
		},
		get(t, i, a) {
			if (i === de) return e;
			var o = r.get(i), c = i in t;
			if (o === void 0 && (!c || u(t, i)?.writable) && (o = l(() => /* @__PURE__ */ Qt(rn(c ? t[i] : n), s)), r.set(i, o)), o !== void 0) {
				var d = W(o);
				return d === n ? void 0 : d;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			var i = Reflect.getOwnPropertyDescriptor(e, t);
			if (i && "value" in i) {
				var a = r.get(t);
				a && (i.value = W(a));
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
			if (t === de) return !0;
			var i = r.get(t), a = i !== void 0 && i.v !== n || Reflect.has(e, t);
			return (i !== void 0 || V !== null && (!a || u(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ Qt(a ? rn(e[t]) : n, s)), r.set(t, i)), W(i) === n) ? !1 : a;
		},
		set(e, t, a, c) {
			var d = r.get(t), f = t in e;
			if (i && t === "length") for (var p = a; p < d.v; p += 1) {
				var m = r.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ Qt(n, s)), r.set(p + "", m)) : M(m, n);
			}
			if (d === void 0) (!f || u(e, t)?.writable) && (d = l(() => /* @__PURE__ */ Qt(void 0, s)), M(d, rn(a)), r.set(t, d));
			else {
				f = d.v !== n;
				var h = l(() => rn(a));
				M(d, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, a), !f) {
				if (i && typeof t == "string") {
					var _ = r.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && M(_, v + 1);
				}
				tn(o);
			}
			return !0;
		},
		ownKeys(e) {
			W(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== n;
			});
			for (var [i, a] of r) a.v !== n && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			ke();
		}
	});
}
function an(e) {
	try {
		if (typeof e == "object" && e && de in e) return e[de];
	} catch {}
	return e;
}
function on(e, t) {
	return Object.is(an(e), an(t));
}
var sn, cn, ln, un;
function dn() {
	if (sn === void 0) {
		sn = window, cn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		ln = u(t, "firstChild").get, un = u(t, "nextSibling").get, h(e) && (e[he] = void 0, e[me] = null, e[ge] = void 0, e.__e = void 0), h(n) && (n[_e] = void 0);
	}
}
function N(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function fn(e) {
	return ln.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return un.call(e);
}
function P(e, t) {
	if (!w) return /* @__PURE__ */ fn(e);
	var n = /* @__PURE__ */ fn(T);
	if (n === null) n = T.appendChild(N());
	else if (t && n.nodeType !== 3) {
		var r = N();
		return n?.before(r), E(r), r;
	}
	return t && vn(n), E(n), n;
}
function mn(e, t = !1) {
	if (!w) {
		var n = /* @__PURE__ */ fn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ pn(n) : n;
	}
	if (t) {
		if (T?.nodeType !== 3) {
			var r = N();
			return T?.before(r), E(r), r;
		}
		vn(T);
	}
	return T;
}
function F(e, t = 1, n = !1) {
	let r = w ? T : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ pn(r);
	if (!w) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = N();
			return r === null ? i?.after(a) : r.before(a), E(a), a;
		}
		vn(r);
	}
	return E(r), r;
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
	V === null && (B === null && Te(e), we()), Gn && Ce(e);
}
function bn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function xn(e, t) {
	var n = V;
	n !== null && n.f & 8192 && (e |= C);
	var r = {
		ctx: O,
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
	A?.register_created_effect(r);
	var i = r;
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			ur(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= re));
	}
	if (i !== null && (i.parent = n, n !== null && bn(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Sn() {
	return B !== null && !qn;
}
function Cn(e) {
	let t = xn(8, null);
	return k(t, b), t.teardown = e, t;
}
function wn(e) {
	yn("$effect");
	var t = V.f;
	if (!B && t & 32 && O !== null && !O.i) {
		var n = O;
		(n.e ??= []).push(e);
	} else return Tn(e);
}
function Tn(e) {
	return xn(4 | ae, e);
}
function En(e) {
	return yn("$effect.pre"), xn(8 | ae, e);
}
function Dn(e) {
	Bt.ensure();
	let t = xn(64 | ie, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Rn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function On(e) {
	return xn(4, e);
}
function I(e, t) {
	var n = O, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = jn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = V;
			try {
				Yn(n.parent), G(t);
			} finally {
				Yn(n);
			}
		}
	});
}
function kn() {
	var e = O;
	jn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && k(n, S), ar(n) && ur(n), t.ran = !1;
		}
	});
}
function An(e) {
	return xn(le | ie, e);
}
function jn(e, t = 0) {
	return xn(8 | t, e);
}
function L(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		xn(8, () => {
			e(...t.map(W));
		});
	});
}
function Mn(e, t = 0) {
	return xn(16 | t, e);
}
function R(e) {
	return xn(32 | ie, e);
}
function Nn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Gn, n = B;
		Kn(!0), Jn(null);
		try {
			t.call(null);
		} finally {
			Kn(e), Jn(n);
		}
	}
}
function Pn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dt(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function Fn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (In(e.nodes.start, e.nodes.end), n = !0), e.f |= ne, Pn(e, t && !n), lr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Nn(e), e.f ^= ne, e.f |= ee;
	var i = e.parent;
	i !== null && i.first !== null && Ln(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function In(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ pn(e);
		e.remove(), e = n;
	}
}
function Ln(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Rn(e, t, n = !0) {
	var r = [];
	zn(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function zn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= C;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				zn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Bn(e) {
	Vn(e, !0);
}
function Vn(e, t) {
	if (e.f & 8192) {
		e.f ^= C, e.f & 1024 || (k(e, x), Bt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Vn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Hn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ pn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Un = null, Wn = !1, Gn = !1;
function Kn(e) {
	Gn = e;
}
var B = null, qn = !1;
function Jn(e) {
	B = e;
}
var V = null;
function Yn(e) {
	V = e;
}
var Xn = null;
function Zn(e) {
	B !== null && (Xn ??= /* @__PURE__ */ new Set()).add(e);
}
var H = null, U = 0, Qn = null;
function $n(e) {
	Qn = e;
}
var er = 1, tr = 0, nr = tr;
function rr(e) {
	nr = e;
}
function ir() {
	return ++er;
}
function ar(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~se), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ar(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && k(e, b);
	}
	return !1;
}
function or(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Xn !== null && Xn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? or(a, t, !1) : t === a && (n ? k(a, x) : a.f & 1024 && k(a, S), Gt(a));
	}
}
function sr(e) {
	var t = H, n = U, r = Qn, i = B, a = Xn, o = O, s = qn, c = nr, l = e.f;
	H = null, U = 0, Qn = null, B = l & 96 ? null : e, Xn = null, Ke(e.ctx), qn = !1, nr = ++tr, e.ac !== null && (dt(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= ce;
		var u = e.fn, d = u();
		e.f |= te;
		var f = e.deps, p = A?.is_fork;
		if (H !== null) {
			var m;
			if (p || lr(e, U), f !== null && U > 0) for (f.length = U + H.length, m = 0; m < H.length; m++) f[U + m] = H[m];
			else e.deps = f = H;
			if (Sn() && e.f & 512) for (m = U; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && U < f.length && (lr(e, U), f.length = U);
		if (Ye() && Qn !== null && !qn && f !== null && !(e.f & 6146)) for (m = 0; m < Qn.length; m++) or(Qn[m], e);
		if (i !== null && i !== e) {
			if (tr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = tr;
			if (t !== null) for (let e of t) e.rv = tr;
			Qn !== null && (r === null ? r = Qn : r.push(...Qn));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (e) {
		return et(e);
	} finally {
		e.f ^= ce, H = t, U = n, Qn = r, B = i, Xn = a, Ke(o), qn = s, nr = c;
	}
}
function cr(e, t) {
	let r = t.reactions;
	if (r !== null) {
		var i = o.call(r, e);
		if (i !== -1) {
			var a = r.length - 1;
			a === 0 ? r = t.reactions = null : (r[i] = r[a], r.pop());
		}
	}
	if (r === null && t.f & 2 && (H === null || !s.call(H, t))) {
		var c = t;
		c.f & 512 && (c.f ^= 512, c.f &= ~se), c.v !== n && rt(c), c.ac !== null && dt(() => {
			c.ac.abort(ye), c.ac = null, k(c, x);
		}), Ot(c), lr(c, 0);
	}
}
function lr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) cr(e, n[r]);
}
function ur(e) {
	var t = e.f;
	if (!(t & 16384)) {
		k(e, b);
		var n = V, r = Wn;
		V = e, Wn = !(t & 96);
		try {
			t & 16777232 ? Fn(e) : Pn(e), Nn(e);
			var i = sr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = er;
		} finally {
			Wn = r, V = n;
		}
	}
}
async function dr() {
	await Promise.resolve(), Vt();
}
function W(e) {
	var t = !!(e.f & 2);
	if (Un?.add(e), B !== null && !qn && !(V !== null && V.f & 16384) && (Xn === null || !Xn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < tr && (e.rv = tr, H === null && n !== null && n[U] === e ? U++ : H === null ? H = [e] : H.push(e));
		else {
			B.deps ??= [], s.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : s.call(r, B) || r.push(B);
		}
	}
	if (Gn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Gn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || pr(i)) && (a = Et(i)), Yt.set(i, a), a;
		}
		var o = !(i.f & 512) && !qn && B !== null && (Wn || !!(B.f & 512)), c = (i.f & te) === 0;
		ar(i) && (o && (i.f |= 512), Dt(i)), o && !c && (kt(i), fr(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function fr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (kt(t), fr(t));
}
function pr(e) {
	if (e.v === n) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && pr(t)) return !0;
	return !1;
}
function G(e) {
	var t = qn;
	try {
		return qn = !0, e();
	} finally {
		qn = t;
	}
}
function K(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (de in e) mr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && de in n && mr(n);
		}
	}
}
function mr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			mr(e[n], t);
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
var hr = Symbol("events"), gr = /* @__PURE__ */ new Set(), _r = /* @__PURE__ */ new Set();
function q(e, t, n) {
	(t[hr] ??= {})[e] = n;
}
function vr(e) {
	for (var t = 0; t < e.length; t++) gr.add(e[t]);
	for (var n of _r) n(e);
}
var yr = null;
function br(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	yr = e;
	var o = 0, s = yr === e && e[hr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[hr] = t;
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
		Jn(null), Yn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[hr]?.[r];
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
			e[hr] = t, delete e.currentTarget, Jn(d), Yn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var xr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Sr(e) {
	return xr?.createHTML(e) ?? e;
}
function Cr(e) {
	var t = _n("template");
	return t.innerHTML = Sr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function wr(e, t) {
	var n = V;
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
		if (w) return wr(T, null), T;
		i === void 0 && (i = Cr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ fn(i)));
		var t = r || cn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ fn(t), s = t.lastChild;
			wr(o, s);
		} else wr(t, t);
		return t;
	};
}
function Tr() {
	if (w) return wr(T, null), T;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = N();
	return e.append(t, n), wr(t, n), e;
}
function Y(e, t) {
	if (w) {
		var n = V;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = T), Le();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Er = ["touchstart", "touchmove"];
function Dr(e) {
	return Er.includes(e);
}
var Or = [
	"textarea",
	"script",
	"style",
	"title"
];
function kr(e) {
	return Or.includes(e);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[_e] ??= e.nodeValue) && (e[_e] = n, e.nodeValue = `${n}`);
}
function Ar(e, t) {
	return Mr(e, t);
}
var jr = /* @__PURE__ */ new Map();
function Mr(e, { target: n, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: l }) {
	dn();
	var u = void 0, d = Dn(() => {
		var s = r ?? n.appendChild(N());
		ht(s, { pending: () => {} }, (n) => {
			qe({});
			var r = O;
			if (o && (r.c = o), a && (i.$$events = a), w && wr(n, null), u = e(n, i) || {}, w && (V.nodes.end = T, T === null || T.nodeType !== 8 || T.data !== "]")) throw Ne(), t;
			Je();
		}, l);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var t = 0; t < e.length; t++) {
				var r = e[t];
				if (!d.has(r)) {
					d.add(r);
					var i = Dr(r);
					for (let e of [n, document]) {
						var a = jr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), jr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, br, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(c(gr)), _r.add(f), () => {
			for (var e of d) for (let r of [n, document]) {
				var t = jr.get(r), i = t.get(e);
				--i == 0 ? (r.removeEventListener(e, br), t.delete(e), t.size === 0 && jr.delete(r)) : t.set(e, i);
			}
			_r.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Nr.set(u, d), u;
}
var Nr = /* @__PURE__ */ new WeakMap();
function Pr(e, t) {
	let n = Nr.get(e);
	return n ? (Nr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Fr = class {
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
			if (n) Bn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Bn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						Hn(r, t), t.append(N()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Rn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = A, r = gn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = N();
			i.append(a), this.#n.set(e, {
				effect: R(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, R(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else w && (this.anchor = T), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	w && (r = T, Le());
	var i = new Fr(e), a = n ? re : 0;
	function o(e, t) {
		if (w) {
			var n = Be(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ze();
				E(a), i.anchor = a, Ie(!1), i.ensure(e, t), Ie(!0);
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
function Ir(e, t) {
	return t;
}
function Lr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Rn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Rr(e, c(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var l = r.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			hn(d), d.append(u), e.items.clear();
		}
		Rr(e, t, !l);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Rr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= oe, Hn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var zr;
function Br(e, t, n, r, i, o = null) {
	var s = e, l = /* @__PURE__ */ new Map();
	if (t & 4) {
		var u = e;
		s = w ? E(/* @__PURE__ */ fn(u)) : u.appendChild(N());
	}
	w && Le();
	var d = null, f = /* @__PURE__ */ wt(() => {
		var e = n();
		return a(e) ? e : e == null ? [] : c(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Hr(v, p, s, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= oe, Wr(d, null, s)) : Bn(d) : Rn(d, () => {
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
			let a = !1;
			w && Be(s) === "[!" != (e === 0) && (s = ze(), E(s), Ie(!1), a = !0);
			for (var c = /* @__PURE__ */ new Set(), u = A, v = gn(), y = 0; y < e; y += 1) {
				w && T.nodeType === 8 && T.data === "]" && (s = T, a = !0, Ie(!1));
				var b = p[y], x = r(b, y), S = h ? null : l.get(x);
				S ? (S.v && $t(S.v, b), S.i && $t(S.i, y), v && u.unskip_effect(S.e)) : (S = Ur(l, h ? s : zr ??= N(), b, x, y, i, t, n), h || (S.e.f |= oe), l.set(x, S)), c.add(x);
			}
			if (e === 0 && o && !d && (h ? d = R(() => o(s)) : (d = R(() => o(zr ??= N())), d.f |= oe)), e > c.size && Se("", "", ""), w && e > 0 && E(ze()), !h) if (m.set(u, c), v) {
				for (let [e, t] of l) c.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			a && Ie(!0), W(f);
		}),
		flags: t,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, w && (s = T);
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
		if (_.f & 8192 && (Bn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= oe, _ === l) Wr(_, null, n);
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
		for (let t of e.outrogroups) t.pending.size === 0 && (Rr(e, c(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = Vr(l.next);
		var te = ee.length;
		if (te > 0) {
			var ne = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.fix();
			}
			Lr(e, ee, ne);
		}
	}
	a && Qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Ur(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ j(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: R(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Wr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ pn(r);
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
	let s = w;
	w && Le();
	var c = null;
	w && T.nodeType === 1 && (c = T, Le());
	var l = w ? T : e, u = new Fr(l, !1);
	Mn(() => {
		let e = t() || null;
		var o = a ? a() : n || e === "svg" ? i : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = w ? c : _n(e, o), wr(c, c), r) {
					var n = null;
					w && kr(e) && c.append(n = document.createComment(""));
					var i = w ? /* @__PURE__ */ fn(c) : c.appendChild(N());
					w && (i === null ? Ie(!1) : E(i)), r(c, i), n?.remove();
				}
				V.nodes.end = c, t.before(c);
			}
			w && E(t);
		}), () => {};
	}, re), Cn(() => {}), s && (Ie(!0), E(l));
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
	var o = e[he];
	if (w || o !== n || o === void 0) {
		var s = Jr(n, r, a);
		(!w || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[he] = n;
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
		if (!a(t)) return Pe();
		for (var r of e.options) r.selected = t.includes($r(r));
		return;
	}
	for (r of e.options) if (on($r(r), t)) {
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
	}), Cn(() => {
		t.disconnect();
	});
}
function Qr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ft(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), $r);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && $r(o);
		}
		n(a), e.__value = a, A !== null && r.add(A);
	}), On(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = A;
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
var ei = Symbol("is custom element"), ti = Symbol("is html"), ni = be ? "link" : "LINK", ri = be ? "progress" : "PROGRESS";
function ii(e) {
	if (w) {
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
		e[ve] = n, Qe(n), ut();
	}
}
function ai(e, t) {
	var n = oi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ri) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = oi(e);
	w && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ni) || i[t] !== (i[t] = n) && (t === "loading" && (e[pe] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ci(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function oi(e) {
	return e[me] ??= {
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
	ft(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = di(e) ? fi(a) : a, n(a), A !== null && r.add(A), await dr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (w && e.defaultValue !== e.value || G(t) == null && e.value) && (n(di(e) ? fi(e.value) : e.value), A !== null && r.add(A)), jn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = A;
			if (r.has(i)) return;
		}
		di(e) && n === fi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function ui(e, t, n = t) {
	ft(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (w && e.defaultChecked !== e.checked || G(t) == null) && n(e.checked), jn(() => {
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
	let t = O, n = t.l.u;
	if (!n) return;
	let r = () => K(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ xt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => W(i);
	}
	n.b.length && En(() => {
		mi(t, r), v(n.b);
	}), wn(() => {
		let e = G(() => n.m.map(_));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && wn(() => {
		mi(t, r), v(n.a);
	});
}
function mi(e, t) {
	if (e.l.s) for (let t of e.l.s) W(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !We || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, d = () => o && i ? (l ??= /* @__PURE__ */ xt(r), W(l)) : (c && (c = !1, s = o ? G(r) : r), s);
	let f;
	if (a) {
		var p = de in e || fe in e;
		f = u(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = st(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && De(t), f(m)));
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
	a && W(y);
	var b = V;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? W(y) : i && a ? rn(e) : e;
			return M(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return Gn && v || b.f & 16384 ? y.v : W(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ge();
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var hi = /* @__PURE__ */ J("<span class=\"developer-expand-hint\">展開作法與方向</span>"), gi = /* @__PURE__ */ J("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), _i = /* @__PURE__ */ J("<li> </li>"), vi = /* @__PURE__ */ J("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), yi = /* @__PURE__ */ J("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), bi = /* @__PURE__ */ J("<code class=\"reference\"> </code>"), xi = /* @__PURE__ */ J("<article class=\"decision-item\"><p> </p> <!></article>"), Si = /* @__PURE__ */ J("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Ci = /* @__PURE__ */ J("<p> </p>"), wi = /* @__PURE__ */ J("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), Ti = /* @__PURE__ */ J("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), Ei = /* @__PURE__ */ J("<div class=\"path-list\"></div>"), Di = /* @__PURE__ */ J("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), Oi = /* @__PURE__ */ J("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), ki = /* @__PURE__ */ J("<!> <!>", 1);
function Ai(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ j(), r = /* @__PURE__ */ j(), i = /* @__PURE__ */ j(), a = /* @__PURE__ */ j(), o = $(t, "developer", 8, null);
	I(() => K(o()), () => {
		M(n, o()?.next_steps ?? []);
	}), I(() => (K(o()), W(n)), () => {
		M(r, o()?.next_step ?? W(n)[0] ?? "尚未指定下一步");
	}), I(() => (K(o()), W(n)), () => {
		M(i, o()?.next_step ? W(n) : W(n).slice(1));
	}), I(() => (W(i), K(o())), () => {
		M(a, !!(W(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), kn(), pi();
	var s = Tr(), c = mn(s), l = (e) => {
		var t = Tr();
		Kr(mn(t), () => W(a) ? "details" : "section", !1, (e, t) => {
			Yr(e, 0, "developer-details");
			var n = ki(), s = mn(n);
			Kr(s, () => W(a) ? "summary" : "div", !1, (e, t) => {
				Yr(e, 0, "developer-summary");
				var n = gi(), i = F(mn(n), 2), o = P(i, !0);
				D(i);
				var s = F(i, 2), c = (e) => {
					Y(e, hi());
				};
				Z(s, (e) => {
					W(a) && e(c);
				}), L(() => X(o, W(r))), Y(t, n);
			});
			var c = F(s, 2), l = (e) => {
				var t = Oi(), n = F(P(t), 2), r = (e) => {
					var t = vi(), n = F(P(t), 2);
					Br(n, 5, () => W(i), Ir, (e, t) => {
						var n = _i(), r = P(n, !0);
						D(n), L(() => X(r, W(t))), Y(e, n);
					}), D(n), D(t), Y(e, t);
				};
				Z(n, (e) => {
					W(i), G(() => W(i).length) && e(r);
				});
				var a = F(n, 2), s = (e) => {
					var t = yi(), n = F(P(t), 2);
					Br(n, 5, () => (K(o()), G(() => o().blockers)), Ir, (e, t) => {
						var n = _i(), r = P(n, !0);
						D(n), L(() => X(r, W(t))), Y(e, n);
					}), D(n), D(t), Y(e, t);
				};
				Z(a, (e) => {
					K(o()), G(() => o().blockers?.length) && e(s);
				});
				var c = F(a, 2), l = (e) => {
					var t = Si(), n = F(P(t), 2);
					Br(n, 5, () => (K(o()), G(() => o().decisions)), Ir, (e, t) => {
						var n = xi(), r = P(n), i = P(r, !0);
						D(r);
						var a = F(r, 2), o = (e) => {
							var n = bi(), r = P(n, !0);
							D(n), L(() => X(r, (W(t), G(() => W(t).reference)))), Y(e, n);
						};
						Z(a, (e) => {
							W(t), G(() => W(t).reference) && e(o);
						}), D(n), L(() => X(i, (W(t), G(() => W(t).summary)))), Y(e, n);
					}), D(n), D(t), Y(e, t);
				};
				Z(c, (e) => {
					K(o()), G(() => o().decisions?.length) && e(l);
				});
				var u = F(c, 2), d = (e) => {
					var t = Ti(), n = F(P(t), 2);
					Br(n, 5, () => (K(o()), G(() => o().routes)), Ir, (e, t) => {
						var n = wi(), r = P(n), i = P(r), a = P(i, !0);
						D(i);
						var o = F(i, 2), s = P(o, !0);
						D(o), D(r);
						var c = F(r, 2), l = (e) => {
							var n = Ci(), r = P(n, !0);
							D(n), L(() => X(r, (W(t), G(() => W(t).reason)))), Y(e, n);
						};
						Z(c, (e) => {
							W(t), G(() => W(t).reason) && e(l);
						}), D(n), L(() => {
							X(a, (W(t), G(() => W(t).title))), Yr(o, 1, (W(t), G(() => `route-state route-${W(t).state}`))), X(s, (W(t), G(() => W(t).state)));
						}), Y(e, n);
					}), D(n), D(t), Y(e, t);
				};
				Z(u, (e) => {
					K(o()), G(() => o().routes?.length) && e(d);
				});
				var f = F(u, 2), p = (e) => {
					var t = Di(), n = F(P(t), 2), r = P(n);
					D(n);
					var i = F(n, 2), a = (e) => {
						var t = Ci(), n = P(t);
						D(t), L(() => X(n, `Worktree: ${K(o()), G(() => o().claim.worktree) ?? ""}`)), Y(e, t);
					};
					Z(i, (e) => {
						K(o()), G(() => o().claim.worktree) && e(a);
					});
					var s = F(i, 2), c = (e) => {
						var t = Ei();
						Br(t, 5, () => (K(o()), G(() => o().claim.source_paths)), Ir, (e, t) => {
							var n = bi(), r = P(n, !0);
							D(n), L(() => X(r, W(t))), Y(e, n);
						}), D(t), Y(e, t);
					};
					Z(s, (e) => {
						K(o()), G(() => o().claim.source_paths?.length) && e(c);
					}), D(t), L(() => X(r, `Agent: ${K(o()), G(() => o().claim.agent) ?? ""}`)), Y(e, t);
				};
				Z(f, (e) => {
					K(o()), G(() => o().claim) && e(p);
				}), D(t), Y(e, t);
			};
			Z(c, (e) => {
				W(a) && e(l);
			}), Y(t, n);
		}), Y(e, t);
	};
	Z(c, (e) => {
		o() && e(l);
	}), Y(e, s), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var ji = /* @__PURE__ */ J("<option> </option>"), Mi = /* @__PURE__ */ J("<button class=\"time-item-button\" type=\"button\"> </button>"), Ni = /* @__PURE__ */ J("<span class=\"time-item-button\"> </span>"), Pi = /* @__PURE__ */ J("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Fi = /* @__PURE__ */ J("<details class=\"spike-estimate-editor\"><summary><span>人工工時與依據</span> <small> </small></summary> <div class=\"spike-estimate-fields\"><label><span>工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <button type=\"button\">套用工時草稿</button> <!></div></details>"), Ii = /* @__PURE__ */ J("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button> <!>", 1), Li = /* @__PURE__ */ J("<span> </span>"), Ri = /* @__PURE__ */ J("<span class=\"spike-item-title\"> </span> <!> <!>", 1), zi = /* @__PURE__ */ J("<li><!></li>");
function Bi(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ j(), r = /* @__PURE__ */ j(), i = /* @__PURE__ */ j(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = $(t, "onTimeClick", 8, null), h = /* @__PURE__ */ j(f() ? String(f().likely_minutes / 60) : d() ? String(d().likely_minutes / 60) : ""), g = /* @__PURE__ */ j(f()?.human_note ?? ""), _ = /* @__PURE__ */ j(!!f()?.human_confirmed), v = /* @__PURE__ */ j("");
	function y() {
		let e = Number(W(h));
		if (!Number.isFinite(e) || e <= 0) {
			M(v, "工時必須大於 0。");
			return;
		}
		let t = p()?.({
			taskId: a(),
			itemId: s().id,
			likelyMinutes: Math.round(e * 60),
			humanNote: W(g),
			humanConfirmed: W(_)
		});
		M(v, t?.error ?? "");
	}
	I(() => (K(l()), K(s())), () => {
		M(n, l().metadata(s().priority));
	}), I(() => (K(l()), K(s())), () => {
		M(r, l().format(s().priority));
	}), I(() => K(d()), () => {
		M(i, d() ? d().label ?? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })} hr` : "");
	}), kn(), pi();
	var b = zi();
	let x;
	var S = P(b), C = (e) => {
		var t = Ii(), n = mn(t);
		ii(n);
		var r = F(n, 2);
		Br(r, 5, () => (K(l()), G(() => l().levels)), (e) => e.value, (e, t) => {
			var n = ji(), r = P(n, !0);
			D(n);
			var i = {};
			L((e) => {
				X(r, e), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
			}, [() => (K(l()), W(t), G(() => l().format(W(t).value)))]), Y(e, n);
		}), D(r);
		var c;
		Zr(r);
		var f = F(r, 2), b = (e) => {
			var t = Mi(), n = P(t, !0);
			D(t), L(() => {
				Q(t, "aria-label", (K(s()), W(i), G(() => `${s().title}，${W(i)}，查看估算依據`))), X(n, W(i));
			}), q("click", t, () => m()(s().id, s().title)), Y(e, t);
		}, x = (e) => {
			var t = Ni(), n = P(t, !0);
			D(t), L(() => {
				Q(t, "title", (K(d()), G(() => `目前分析：${d().likely_minutes} 分鐘`))), X(n, W(i));
			}), Y(e, t);
		};
		Z(f, (e) => {
			d() && m() ? e(b) : d() && e(x, 1);
		});
		var S = F(f, 2), C = F(S, 2), ee = (e) => {
			var t = Fi(), n = P(t), r = F(P(n), 2), i = P(r, !0);
			D(r), D(n);
			var a = F(n, 2), o = P(a), c = F(P(o), 2);
			ii(c), D(o);
			var l = F(o, 2), u = F(P(l), 2);
			ii(u), D(l);
			var d = F(l, 2), f = P(d);
			ii(f), Re(2), D(d);
			var p = F(d, 4), m = F(p, 2), b = (e) => {
				var t = Pi(), n = P(t, !0);
				D(t), L(() => X(n, W(v))), Y(e, t);
			};
			Z(m, (e) => {
				W(v) && e(b);
			}), D(a), D(t), L(() => {
				X(i, W(_) ? "已確認" : "未確認"), Q(c, "aria-label", (K(s()), G(() => `「${s().title}」人工工時（hr）`))), Q(u, "aria-label", (K(s()), G(() => `「${s().title}」人工依據`))), Q(f, "aria-label", (K(s()), G(() => `確認「${s().title}」的人工估算`))), Q(p, "aria-label", (K(s()), G(() => `套用「${s().title}」人工估算草稿`)));
			}), li(c, () => W(h), (e) => M(h, e)), li(u, () => W(g), (e) => M(g, e)), ui(f, () => W(_), (e) => M(_, e)), q("click", p, y), Y(e, t);
		};
		Z(C, (e) => {
			p() && e(ee);
		}), L(() => {
			Q(n, "aria-label", (K(s()), G(() => `編輯子項目：${s().title}`))), ai(n, (K(s()), G(() => s().title))), Q(r, "aria-label", (K(s()), G(() => `設定「${s().title}」的優先級`))), c !== (c = (K(s()), G(() => s().priority))) && (r.value = (r.__value = (K(s()), G(() => s().priority))) ?? "", Xr(r, (K(s()), G(() => s().priority)))), Q(S, "aria-label", (K(s()), G(() => `刪除子項目：${s().title}`)));
		}), q("input", n, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "title",
			value: e.currentTarget.value
		})), q("change", r, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "priority",
			value: Number(e.currentTarget.value)
		})), q("click", S, () => u()({
			type: "delete-item",
			taskId: a(),
			field: o(),
			itemId: s().id
		})), Y(e, t);
	}, ee = (e) => {
		var t = Ri(), a = mn(t), o = P(a, !0);
		D(a);
		var c = F(a, 2), u = (e) => {
			var t = Li(), i = P(t, !0);
			D(t), L(() => {
				Yr(t, 1, (W(n), G(() => `priority-badge priority-${W(n).tone}`))), X(i, W(r));
			}), Y(e, t);
		};
		Z(c, (e) => {
			W(n), K(l()), G(() => W(n) && (!W(n).hidden || !l().labelsValid)) && e(u);
		});
		var f = F(c, 2), p = (e) => {
			var t = Mi(), n = P(t, !0);
			D(t), L(() => {
				Q(t, "aria-label", (K(s()), W(i), G(() => `${s().title}，${W(i)}，查看估算依據`))), X(n, W(i));
			}), q("click", t, () => m()(s().id, s().title)), Y(e, t);
		}, h = (e) => {
			var t = Ni(), n = P(t, !0);
			D(t), L(() => {
				Q(t, "title", (K(d()), G(() => `目前分析：${d().likely_minutes} 分鐘`))), X(n, W(i));
			}), Y(e, t);
		};
		Z(f, (e) => {
			d() && m() ? e(p) : d() && e(h, 1);
		}), L(() => X(o, (K(s()), G(() => s().title)))), Y(e, t);
	};
	Z(S, (e) => {
		c() ? e(C) : e(ee, -1);
	}), D(b), L(() => x = Yr(b, 1, "editor-item-row", null, x, {
		"editable-work-item": c(),
		"has-estimate-editor": c() && p()
	})), Y(e, b), Je();
}
vr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Vi = /* @__PURE__ */ J("<option> </option>"), Hi = /* @__PURE__ */ J("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), Ui = /* @__PURE__ */ J("<span> </span>"), Wi = /* @__PURE__ */ J("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), Gi = /* @__PURE__ */ J("<h3> </h3>"), Ki = /* @__PURE__ */ J("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), qi = /* @__PURE__ */ J("<p class=\"task-summary\"> </p>"), Ji = /* @__PURE__ */ J("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Yi = /* @__PURE__ */ J("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Xi = /* @__PURE__ */ J("<button class=\"spike-add-button\" type=\"button\">＋</button>"), Zi = /* @__PURE__ */ J("<div class=\"spike-add-shell\"><!></div>"), Qi = /* @__PURE__ */ J("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function $i(e, t) {
	qe(t, !1);
	let n = /* @__PURE__ */ j(), r = /* @__PURE__ */ j(), i = /* @__PURE__ */ j(), a = /* @__PURE__ */ j(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
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
	], y = /* @__PURE__ */ j(!1), b = /* @__PURE__ */ j(""), x = /* @__PURE__ */ j(l().creationDefaultValue), S = /* @__PURE__ */ j("");
	function C() {
		M(y, !1), M(b, ""), M(x, l().creationDefaultValue), M(S, "");
	}
	function ee() {
		let e = d()(W(b), Number(W(x)));
		M(S, e.error), W(S) || C();
	}
	I(() => K(o()), () => {
		M(n, [{
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
	}), I(() => (W(n), K(g())), () => {
		M(r, [...W(n)].sort((e, t) => {
			let n = g().indexOf(e.status), r = g().indexOf(t.status);
			return (n < 0 ? g().length : n) - (r < 0 ? g().length : r);
		}));
	}), I(() => (K(l()), K(o())), () => {
		M(i, l().metadata(o().priority));
	}), I(() => K(o()), () => {
		M(a, v.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), I(() => (K(c()), W(y)), () => {
		!c() && W(y) && C();
	}), kn(), pi();
	var te = Qi(), ne = P(te), re = P(ne), ie = P(re), ae = P(ie), oe = P(ae, !0);
	D(ae);
	var se = F(ae, 2), ce = (e) => {
		var t = Hi(), n = mn(t);
		Br(n, 5, () => v, (e) => e.value, (e, t) => {
			var n = Vi(), r = P(n, !0);
			D(n);
			var i = {};
			L(() => {
				X(r, (W(t), G(() => W(t).label))), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
			}), Y(e, n);
		}), D(n);
		var r;
		Zr(n);
		var i = F(n, 2);
		Br(i, 5, () => (K(l()), G(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Vi(), r = P(n, !0);
			D(n);
			var i = {};
			L((e) => {
				X(r, e), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
			}, [() => (K(l()), W(t), G(() => l().format(W(t).value)))]), Y(e, n);
		}), D(i);
		var a;
		Zr(i), L(() => {
			Q(n, "aria-label", (K(o()), G(() => `${o().title} 狀態`))), r !== (r = (K(o()), G(() => o().status))) && (n.value = (n.__value = (K(o()), G(() => o().status))) ?? "", Xr(n, (K(o()), G(() => o().status)))), Q(i, "aria-label", (K(o()), G(() => `${o().title} 優先級`))), a !== (a = (K(o()), G(() => o().priority))) && (i.value = (i.__value = (K(o()), G(() => o().priority))) ?? "", Xr(i, (K(o()), G(() => o().priority))));
		}), q("change", n, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: e.currentTarget.value
		})), q("change", i, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(e.currentTarget.value)
		})), Y(e, t);
	}, le = (e) => {
		var t = Ui(), n = P(t, !0);
		D(t), L((e, r, a) => {
			Yr(t, 1, (W(i), G(() => `task-priority-badge priority-badge priority-${W(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), X(n, a);
		}, [
			() => (K(l()), K(o()), G(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (K(l()), K(o()), G(() => `優先級：${l().format(o().priority)}`)),
			() => (K(l()), K(o()), G(() => l().format(o().priority)))
		]), Y(e, t);
	};
	Z(se, (e) => {
		c() ? e(ce) : (W(i), K(l()), G(() => W(i) && (!W(i).hidden || !l().labelsValid)) && e(le, 1));
	}), D(ie);
	var ue = F(ie, 2), de = P(ue), fe = (e) => {
		var t = Wi();
		ii(t), L(() => {
			Q(t, "id", (K(o()), G(() => `task-${o().id}-title`))), ai(t, (K(o()), G(() => o().title)));
		}), q("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), Y(e, t);
	}, pe = (e) => {
		var t = Gi(), n = P(t, !0);
		D(t), L(() => {
			Q(t, "id", (K(o()), G(() => `task-${o().id}-title`))), X(n, (K(o()), G(() => o().title)));
		}), Y(e, t);
	};
	Z(de, (e) => {
		c() ? e(fe) : e(pe, -1);
	});
	var me = F(de, 2), he = P(me, !0);
	D(me), D(ue), D(re);
	var ge = F(re, 2), _e = P(ge), ve = P(_e);
	D(_e);
	var ye = F(_e, 2), be = P(ye, !0);
	D(ye), D(ge), D(ne);
	var xe = F(ne, 2), Se = (e) => {
		var t = Ki();
		ct(t), L(() => ai(t, (K(o()), G(() => o().summary)))), q("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), Y(e, t);
	}, Ce = (e) => {
		var t = qi(), n = P(t, !0);
		D(t), L(() => X(n, (K(o()), G(() => o().summary)))), Y(e, t);
	};
	Z(xe, (e) => {
		c() ? e(Se) : e(Ce, -1);
	});
	var we = F(xe, 2);
	{
		let e = /* @__PURE__ */ wt(() => (K(o()), G(() => o().developer ?? null)));
		Ai(we, { get developer() {
			return W(e);
		} });
	}
	var Te = F(we, 2), Ee = P(Te);
	Br(Ee, 1, () => W(r), (e) => e.status, (e, t) => {
		var n = Tr(), r = mn(n), i = (e) => {
			var n = Ji(), r = P(n), i = P(r, !0);
			D(r);
			var a = F(r, 2);
			Br(a, 5, () => (W(t), G(() => W(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ wt(() => (K(f()), W(n), G(() => f().get(W(n).id) ?? null))), i = /* @__PURE__ */ wt(() => (K(p()), W(n), G(() => p().get(W(n).id) ?? null)));
					Bi(e, {
						get taskId() {
							return K(o()), G(() => o().id);
						},
						get field() {
							return W(t), G(() => W(t).field);
						},
						get item() {
							return W(n);
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
							return W(r);
						},
						get activeEstimate() {
							return W(i);
						},
						get onManualEstimate() {
							return m();
						},
						get onTimeClick() {
							return h();
						}
					});
				}
			}), D(a), D(n), L(() => {
				Yr(n, 1, (W(t), G(() => `detail-section ${W(t).className}`))), X(i, (W(t), G(() => W(t).title)));
			}), Y(e, n);
		};
		Z(r, (e) => {
			W(t), K(c()), G(() => W(t).items.length || c()) && e(i);
		}), Y(e, n);
	});
	var De = F(Ee, 2), Oe = P(De), ke = (e) => {
		var t = Zi(), n = P(t), r = (e) => {
			var t = Yi(), n = P(t);
			ii(n);
			var r = F(n, 2);
			Br(r, 5, () => (K(l()), G(() => l().levels)), (e) => e.value, (e, t) => {
				var n = Vi(), r = P(n, !0);
				D(n);
				var i = {};
				L((e) => {
					X(r, e), i !== (i = (W(t), G(() => W(t).value))) && (n.value = (n.__value = (W(t), G(() => W(t).value))) ?? "");
				}, [() => (K(l()), W(t), G(() => l().format(W(t).value)))]), Y(e, n);
			}), D(r);
			var i = F(r, 2), a = F(i, 2), o = F(a, 2), s = P(o, !0);
			D(o), D(t), L(() => {
				Q(o, "hidden", !W(S)), X(s, W(S));
			}), q("keydown", n, (e) => {
				e.key === "Enter" && ee(), e.key === "Escape" && C();
			}), li(n, () => W(b), (e) => M(b, e)), Qr(r, () => W(x), (e) => M(x, e)), q("click", i, ee), q("click", a, C), Y(e, t);
		}, i = (e) => {
			var t = Xi();
			L(() => Q(t, "aria-label", (K(o()), G(() => `在「${o().title}」新增子項目`)))), q("click", t, () => {
				M(y, !0);
			}), Y(e, t);
		};
		Z(n, (e) => {
			W(y) ? e(r) : e(i, -1);
		}), D(t), Y(e, t);
	};
	Z(Oe, (e) => {
		c() && e(ke);
	}), D(De), D(Te), D(te), L(() => {
		Yr(te, 1, (W(a), G(() => `task-card editor-task-card status-${W(a).tone}`))), Q(te, "aria-labelledby", (K(o()), G(() => `task-${o().id}-title`))), Yr(ae, 1, (W(a), G(() => `status-badge status-${W(a).tone}`))), X(oe, (W(a), G(() => W(a).label))), Q(me, "hidden", !_()), X(he, _() ? `約需 ${_()}` : ""), Q(_e, "aria-label", (K(s()), G(() => `子項目完成 ${s().completed}，共 ${s().total}`))), X(ve, `${K(s()), G(() => s().completed) ?? ""} / ${K(s()), G(() => s().total) ?? ""}`), X(be, (K(o()), G(() => o().id)));
	}), Y(e, te), Je();
}
vr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var ea = /* @__PURE__ */ J("<p class=\"empty-state\"> </p>");
function ta(e, t) {
	qe(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), d = $(t, "onManualEstimate", 8, null), f = $(t, "onTimeClick", 8, null), p = $(t, "durations", 24, () => ({})), m = $(t, "statusOrder", 24, () => ["done", "planned"]), h = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	pi();
	var g = Tr(), _ = mn(g), v = (e) => {
		var t = Tr();
		Br(mn(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ wt(() => (K(c()), W(t), G(() => c().get(W(t).id) ?? null))), h = /* @__PURE__ */ wt(() => (K(p()), W(t), G(() => p()[W(t).id] ?? null)));
				$i(e, {
					get task() {
						return W(t);
					},
					get progress() {
						return K(r()), W(t), G(() => r()[W(t).id]);
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
					onAddItem: (e, n) => s()(W(t).id, e, n),
					get timeTask() {
						return W(n);
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
						return W(h);
					}
				});
			}
		}), Y(e, t);
	}, y = (e) => {
		var t = ea(), n = P(t, !0);
		D(t), L(() => X(n, h())), Y(e, t);
	};
	Z(_, (e) => {
		K(n()), G(() => n().length) ? e(v) : e(y, -1);
	}), Y(e, g), Je();
}
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
e({
	id: "svelte",
	mount(e, t) {
		let n = rn({ ...t });
		return {
			component: Ar(ta, {
				target: e,
				props: n
			}),
			state: n
		};
	},
	update(e, t) {
		return Object.assign(e.state, t), e;
	},
	destroy(e) {
		Pr(e.component);
	}
});
//#endregion
