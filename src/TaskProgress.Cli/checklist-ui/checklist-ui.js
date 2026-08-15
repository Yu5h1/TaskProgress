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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 65536, ee = 1 << 21, te = 1 << 22, ne = 1 << 23, D = Symbol("$state"), re = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
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
var we = {}, O = Symbol("uninitialized"), Te = "http://www.w3.org/1999/xhtml";
function Ee() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function De(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Oe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function ke() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var k = !1;
function Ae(e) {
	k = e;
}
var A;
function je(e) {
	if (e === null) throw De(), we;
	return A = e;
}
function Me() {
	return je(/* @__PURE__ */ cn(A));
}
function j(e) {
	if (k) {
		if (/* @__PURE__ */ cn(A) !== null) throw De(), we;
		A = e;
	}
}
function Ne(e = 1) {
	if (k) {
		for (var t = e, n = A; t--;) n = /* @__PURE__ */ cn(n);
		A = n;
	}
}
function Pe(e = !0) {
	for (var t = 0, n = A;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ cn(n);
		e && n.remove(), n = i;
	}
}
function Fe(e) {
	if (!e || e.nodeType !== 8) throw De(), we;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ie(e) {
	return e === this.v;
}
function Le(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Re(e) {
	return !Le(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var ze = !1;
function Be() {
	ze = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var M = null;
function Ve(e) {
	M = e;
}
function He(e, t = !1, n) {
	M = {
		p: M,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: ze && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ue(e) {
	var t = M, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, M = t.p, e ?? {};
}
function We() {
	return !ze || M !== null && M.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ge = [];
function Ke() {
	var e = Ge;
	Ge = [], p(e);
}
function qe(e) {
	if (Ge.length === 0 && !Ot) {
		var t = Ge;
		queueMicrotask(() => {
			t === Ge && Ke();
		});
	}
	Ge.push(e);
}
function Je(e) {
	var t = H;
	if (t === null) return V.f |= ne, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Ye(e, t);
}
function Ye(e, t) {
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
var Xe = ~(g | _ | h);
function N(e, t) {
	e.f = e.f & Xe | t;
}
function Ze(e) {
	e.f & 512 || e.deps === null ? N(e, h) : N(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Qe(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= E, Qe(t.deps));
}
function $e(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Qe(e.deps), N(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var et = !1;
function tt(e) {
	var t = et;
	try {
		return et = !1, [e(), et];
	} finally {
		et = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function nt(e) {
	k && /* @__PURE__ */ sn(e) !== null && un(e);
}
var rt = !1;
function it() {
	rt || (rt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function at(e) {
	var t = V, n = H;
	Gn(null), Kn(null);
	try {
		return e();
	} finally {
		Gn(t), Kn(n);
	}
}
function ot(e, t, n, r = n) {
	e.addEventListener(t, () => at(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), it();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function st(e) {
	let t = 0, n = Wt(0), r;
	return () => {
		_n() && (G(n), Dn(() => (t === 0 && (r = K(() => e(() => Yt(n)))), t += 1, () => {
			qe(() => {
				--t, t === 0 && (r?.(), r = void 0, Yt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ct = S | C;
function lt(e, t, n, r) {
	new ut(e, t, n, r);
}
var ut = class {
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
	#h = st(() => (this.#m = Wt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = On(() => {
			if (k) {
				let e = this.#t;
				Me();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ct), k && (this.#e = A);
	}
	#g() {
		try {
			this.#a = kn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		qe(r), t && (this.#s = kn(() => {
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
			t = !0, n && Ce(), this.#s !== null && Fn(this.#s, () => {
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
					Ye(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = kn(() => e(this.#e)), qe(() => {
			var e = this.#c = document.createDocumentFragment(), t = on();
			e.append(t), this.#a = this.#S(() => kn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Fn(this.#o, () => {
				this.#o = null;
			}), this.#x(P));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = kn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				zn(this.#a, e);
				let t = this.#n.pending;
				this.#o = kn(() => t(this.#e));
			} else this.#x(P);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		$e(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = H, n = V, r = M;
		Kn(this.#i), Gn(this.#i), Ve(this.#i.ctx);
		try {
			return Pt.ensure(), e();
		} catch (e) {
			return Je(e), null;
		} finally {
			Kn(t), Gn(n), Ve(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Fn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, qe(() => {
			this.#d = !1, this.#m && qt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), G(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), k && (je(this.#t), Ne(), je(Pe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return kn(() => {
						var r = H;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Ye(e, this.#i.parent), null;
				}
			}));
		};
		qe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Ye(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Ye(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function dt(e, t, n, r) {
	let i = We() ? ht : vt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = ft(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Ye(e, s);
			}
			pt();
		}
	}
	var d = mt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ _t(e))).then(u).catch((e) => Ye(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), pt();
	}) : f();
}
function ft() {
	var e = H, t = V, n = M, r = P;
	return function(i = !0) {
		Kn(e), Gn(t), Ve(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function pt(e = !0) {
	Kn(null), Gn(null), Ve(null), e && P?.deactivate();
}
function mt() {
	var e = H, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ht(e) {
	var t = 2 | g;
	return H !== null && (H.f |= C), {
		ctx: M,
		deps: null,
		effects: null,
		equals: Ie,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: O,
		wv: 0,
		parent: H,
		ac: null
	};
}
var gt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function _t(e, t, n) {
	let r = H;
	r === null && pe();
	var i = void 0, a = Wt(O), o = !V, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = H, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
			}).finally(pt);
		} catch (e) {
			n.reject(e), pt();
		}
		var c = P;
		if (o) {
			if (t.f & 32768) var l = mt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(gt);
			else for (let e of s.values()) e.reject(gt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== gt && (c.activate(), t ? (a.f |= ne, qt(a, t)) : (a.f & 8388608 && (a.f ^= ne), qt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), vn(() => {
		for (let e of s) e.reject(gt);
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
function vt(e) {
	let t = /* @__PURE__ */ ht(e);
	return t.equals = Re, t;
}
function yt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function bt(e) {
	var t, n = H, r = e.parent;
	if (!Hn && r !== null && e.v !== O && r.f & 24576) return Ee(), e.v;
	Kn(r);
	try {
		e.f &= ~E, yt(e), t = ir(e);
	} finally {
		Kn(n);
	}
	return t;
}
function xt(e) {
	var t = bt(e);
	if (!e.equals(t) && (e.wv = tr(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), Tt?.capture(e, t, !0)), e.deps === null))) {
		N(e, h);
		return;
	}
	Hn || (Et === null ? Ze(e) : (_n() || P?.is_fork) && Et.set(e, t));
}
function St(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && at(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), or(t, 0), jn(t));
}
function Ct(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && sr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var wt = null, P = null, Tt = null, Et = null, Dt = null, Ot = !1, kt = !1, At = null, jt = null, Mt = 0, Nt = 1, Pt = class e {
	id = Nt++;
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
		wt === null ? wt = this : (wt.#n = this, this.#t = wt), wt = this;
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
		this.#e = !0, Mt++ > 1e3 && (this.#x(), Ft());
		for (let e of this.#u) this.#d.delete(e), N(e, g), this.schedule(e);
		for (let e of this.#d) N(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = At = [], r = [], i = jt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Bt(e), this.#h() || this.discard(), t;
		}
		if (P = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (At = null, jt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) zt(e, t);
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
		this.#r.clear(), Tt = this, Lt(r), Lt(n), Tt = null, this.#s?.resolve();
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
				a ? r.f ^= h : i & 4 ? t.push(r) : nr(r) && (i & 16 && this.#d.add(r), sr(r));
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
		this.oncommit(() => e.discard()), e.#x(), P = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) $e(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== O && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Et?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		P = this;
	}
	deactivate() {
		P = null, Et = null;
	}
	flush() {
		try {
			kt = !0, P = this, this.#g();
		} finally {
			Mt = 0, Dt = null, At = null, jt = null, kt = !1, P = null, Et = null, Ht.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(gt);
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
		this.#m || (this.#m = !0, qe(() => {
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
			!kt && qe(() => {
				t.#e || t.flush();
			});
		}
		return P;
	}
	apply() {
		Et = null;
	}
	schedule(e) {
		if (Dt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (At !== null && t === H && (V === null || !(V.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? wt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ft() {
	try {
		ve();
	} catch (e) {
		Ye(e, Dt);
	}
}
var It = null;
function Lt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && nr(r) && (It = /* @__PURE__ */ new Set(), sr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Pn(r), It?.size > 0)) {
				Ht.clear();
				for (let e of It) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) It.has(n) && (It.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || sr(n);
					}
				}
				It.clear();
			}
		}
		It = null;
	}
}
function Rt(e) {
	P.schedule(e);
}
function zt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, h);
		for (var n = e.first; n !== null;) zt(n, t), n = n.next;
	}
}
function Bt(e) {
	N(e, h);
	for (var t = e.first; t !== null;) Bt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Vt = /* @__PURE__ */ new Set(), Ht = /* @__PURE__ */ new Map(), Ut = !1;
function Wt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ie,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Gt(e, t) {
	let n = Wt(e, t);
	return Jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t = !1, n = !0) {
	let r = Wt(e);
	return t || (r.equals = Re), ze && n && M !== null && M.l !== null && (M.l.s ??= []).push(r), r;
}
function Kt(e, t) {
	return I(e, K(() => G(e))), t;
}
function I(e, t, n = !1) {
	return V !== null && (!Wn || V.f & 131072) && We() && V.f & 4325394 && (qn === null || !qn.has(e)) && Se(), qt(e, n ? Zt(t) : t, jt);
}
function qt(e, t, n = null) {
	if (!e.equals(t)) {
		Ht.set(e, Hn ? t : e.v);
		var r = Pt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && bt(t), Et === null && Ze(t);
		}
		e.wv = tr(), Xt(e, g, n), We() && H !== null && H.f & 1024 && !(H.f & 96) && (Yn === null ? Xn([e]) : Yn.push(e)), !r.is_fork && Vt.size > 0 && !Ut && Jt();
	}
	return t;
}
function Jt() {
	Ut = !1;
	for (let e of Vt) {
		e.f & 1024 && N(e, _);
		let t;
		try {
			t = nr(e);
		} catch {
			t = !0;
		}
		t && sr(e);
	}
	Vt.clear();
}
function Yt(e) {
	I(e, e.v + 1);
}
function Xt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = We(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & g) === 0;
			if (l && N(s, t), c & 131072) Vt.add(s);
			else if (c & 2) {
				var u = s;
				Et?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= E), Xt(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && It !== null && It.add(d), n === null ? Rt(d) : n.push(d);
			}
		}
	}
}
function Zt(t) {
	if (typeof t != "object" || !t || D in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ Gt(0), u = null, d = $n, f = (e) => {
		if ($n === d) return e();
		var t = V, n = $n;
		Gn(null), er(d);
		var r = e();
		return Gn(t), er(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ Gt(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ Gt(n.value, u);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ Gt(O, u));
					r.set(t, e), Yt(o);
				}
			} else I(n, O), Yt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === D) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ Gt(Zt(s ? e[n] : O), u)), r.set(n, o)), o !== void 0) {
				var c = G(o);
				return c === O ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = G(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== O) return {
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
			var n = r.get(t), i = n !== void 0 && n.v !== O || Reflect.has(e, t);
			return (n !== void 0 || H !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ Gt(i ? Zt(e[t]) : O, u)), r.set(t, n)), G(n) === O) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ Gt(O, u)), r.set(d + "", p)) : I(p, O);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ Gt(void 0, u)), I(c, Zt(n)), r.set(t, c));
			else {
				l = c.v !== O;
				var m = f(() => Zt(n));
				I(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				Yt(o);
			}
			return !0;
		},
		ownKeys(e) {
			G(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== O;
			});
			for (var [n, i] of r) i.v !== O && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			xe();
		}
	});
}
function Qt(e) {
	try {
		if (typeof e == "object" && e && D in e) return e[D];
	} catch {}
	return e;
}
function $t(e, t) {
	return Object.is(Qt(e), Qt(t));
}
var en, tn, nn, rn;
function an() {
	if (en === void 0) {
		en = window, tn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		nn = a(t, "firstChild").get, rn = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
	}
}
function on(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function sn(e) {
	return nn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
function L(e, t) {
	if (!k) return /* @__PURE__ */ sn(e);
	var n = /* @__PURE__ */ sn(A);
	if (n === null) n = A.appendChild(on());
	else if (t && n.nodeType !== 3) {
		var r = on();
		return n?.before(r), je(r), r;
	}
	return t && pn(n), je(n), n;
}
function ln(e, t = !1) {
	if (!k) {
		var n = /* @__PURE__ */ sn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ cn(n) : n;
	}
	if (t) {
		if (A?.nodeType !== 3) {
			var r = on();
			return A?.before(r), je(r), r;
		}
		pn(A);
	}
	return A;
}
function R(e, t = 1, n = !1) {
	let r = k ? A : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ cn(r);
	if (!k) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = on();
			return r === null ? i?.after(a) : r.before(a), je(a), a;
		}
		pn(r);
	}
	return je(r), r;
}
function un(e) {
	e.textContent = "";
}
function dn() {
	return !1;
}
function fn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function pn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function mn(e) {
	H === null && (V === null && _e(e), ge()), Hn && he(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = H;
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
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) At === null ? Pt.ensure().schedule(r) : At.push(r);
	else if (t !== null) {
		try {
			sr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return V !== null && !Wn;
}
function vn(e) {
	let t = gn(8, null);
	return N(t, h), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = H.f;
	if (!V && t & 32 && M !== null && !M.i) {
		var n = M;
		(n.e ??= []).push(e);
	} else return bn(e);
}
function bn(e) {
	return gn(4 | w, e);
}
function xn(e) {
	return mn("$effect.pre"), gn(8 | w, e);
}
function Sn(e) {
	Pt.ensure();
	let t = gn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Fn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function Cn(e) {
	return gn(4, e);
}
function wn(e, t) {
	var n = M, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Dn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = H;
			try {
				Kn(n.parent), K(t);
			} finally {
				Kn(n);
			}
		}
	});
}
function Tn() {
	var e = M;
	Dn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && N(n, _), nr(n) && sr(n), t.ran = !1;
		}
	});
}
function En(e) {
	return gn(te | C, e);
}
function Dn(e, t = 0) {
	return gn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	dt(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(G));
		});
	});
}
function On(e, t = 0) {
	return gn(16 | t, e);
}
function kn(e) {
	return gn(32 | C, e);
}
function An(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Hn, n = V;
		Un(!0), Gn(null);
		try {
			t.call(null);
		} finally {
			Un(e), Gn(n);
		}
	}
}
function jn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && at(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Mn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Nn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, jn(e, t && !n), or(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	An(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Pn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Nn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ cn(e);
		e.remove(), e = n;
	}
}
function Pn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Fn(e, t, n = !0) {
	var r = [];
	In(e, r, !0);
	var i = () => {
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function In(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				In(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Ln(e) {
	Rn(e, !0);
}
function Rn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (N(e, g), Pt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Rn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function zn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ cn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Bn = null, Vn = !1, Hn = !1;
function Un(e) {
	Hn = e;
}
var V = null, Wn = !1;
function Gn(e) {
	V = e;
}
var H = null;
function Kn(e) {
	H = e;
}
var qn = null;
function Jn(e) {
	V !== null && (qn ??= /* @__PURE__ */ new Set()).add(e);
}
var U = null, W = 0, Yn = null;
function Xn(e) {
	Yn = e;
}
var Zn = 1, Qn = 0, $n = Qn;
function er(e) {
	$n = e;
}
function tr() {
	return ++Zn;
}
function nr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (nr(a) && xt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Et === null && N(e, h);
	}
	return !1;
}
function rr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(qn !== null && qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? rr(a, t, !1) : t === a && (n ? N(a, g) : a.f & 1024 && N(a, _), Rt(a));
	}
}
function ir(e) {
	var t = U, n = W, r = Yn, i = V, a = qn, o = M, s = Wn, c = $n, l = e.f;
	U = null, W = 0, Yn = null, V = l & 96 ? null : e, qn = null, Ve(e.ctx), Wn = !1, $n = ++Qn, e.ac !== null && (at(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= ee;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = P?.is_fork;
		if (U !== null) {
			var m;
			if (p || or(e, W), f !== null && W > 0) for (f.length = W + U.length, m = 0; m < U.length; m++) f[W + m] = U[m];
			else e.deps = f = U;
			if (_n() && e.f & 512) for (m = W; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && W < f.length && (or(e, W), f.length = W);
		if (We() && Yn !== null && !Wn && f !== null && !(e.f & 6146)) for (m = 0; m < Yn.length; m++) rr(Yn[m], e);
		if (i !== null && i !== e) {
			if (Qn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Qn;
			if (t !== null) for (let e of t) e.rv = Qn;
			Yn !== null && (r === null ? r = Yn : r.push(...Yn));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (e) {
		return Je(e);
	} finally {
		e.f ^= ee, U = t, W = n, Yn = r, V = i, qn = a, Ve(o), Wn = s, $n = c;
	}
}
function ar(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (U === null || !n.call(U, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== O && Ze(s), s.ac !== null && at(() => {
			s.ac.abort(ue), s.ac = null, N(s, g);
		}), St(s), or(s, 0);
	}
}
function or(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ar(e, n[r]);
}
function sr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, h);
		var n = H, r = Vn;
		H = e, Vn = !(t & 96);
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var i = ir(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Zn;
		} finally {
			Vn = r, H = n;
		}
	}
}
function G(e) {
	var t = !!(e.f & 2);
	if (Bn?.add(e), V !== null && !Wn && !(H !== null && H.f & 16384) && (qn === null || !qn.has(e))) {
		var r = V.deps;
		if (V.f & 2097152) e.rv < Qn && (e.rv = Qn, U === null && r !== null && r[W] === e ? W++ : U === null ? U = [e] : U.push(e));
		else {
			V.deps ??= [], n.call(V.deps, e) || V.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [V] : n.call(i, V) || i.push(V);
		}
	}
	if (Hn && Ht.has(e)) return Ht.get(e);
	if (t) {
		var a = e;
		if (Hn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || lr(a)) && (o = bt(a)), Ht.set(a, o), o;
		}
		var s = !(a.f & 512) && !Wn && V !== null && (Vn || !!(V.f & 512)), c = (a.f & b) === 0;
		nr(a) && (s && (a.f |= 512), xt(a)), s && !c && (Ct(a), cr(a));
	}
	if (Et?.has(e)) return Et.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function cr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Ct(t), cr(t));
}
function lr(e) {
	if (e.v === O) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Ht.has(t) || t.f & 2 && lr(t)) return !0;
	return !1;
}
function K(e) {
	var t = Wn;
	try {
		return Wn = !0, e();
	} finally {
		Wn = t;
	}
}
function ur(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (D in e) dr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && D in n && dr(n);
		}
	}
}
function dr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			dr(e[n], t);
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
var fr = ["touchstart", "touchmove"];
function pr(e) {
	return fr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var mr = Symbol("events"), hr = /* @__PURE__ */ new Set(), gr = /* @__PURE__ */ new Set();
function _r(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || xr.call(t, e), !e.cancelBubble) return at(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? qe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function vr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = _r(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		t.removeEventListener(e, o, a);
	});
}
function q(e, t, n) {
	(t[mr] ??= {})[e] = n;
}
function yr(e) {
	for (var t = 0; t < e.length; t++) hr.add(e[t]);
	for (var n of gr) n(e);
}
var br = null;
function xr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	br = e;
	var s = 0, c = br === e && e[mr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[mr] = t;
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
		Gn(null), Kn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[mr]?.[r];
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
			e[mr] = t, delete e.currentTarget, Gn(d), Kn(f);
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
	var t = fn("template");
	return t.innerHTML = Cr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Tr(e, t) {
	var n = H;
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
		if (k) return Tr(A, null), A;
		i === void 0 && (i = wr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ sn(i)));
		var t = r || tn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ sn(t), s = t.lastChild;
			Tr(o, s);
		} else Tr(t, t);
		return t;
	};
}
function Er() {
	if (k) return Tr(A, null), A;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = on();
	return e.append(t, n), Tr(t, n), e;
}
function Y(e, t) {
	if (k) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = A), Me();
		return;
	}
	e !== null && e.before(t);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Dr(e, t) {
	return kr(e, t);
}
var Or = /* @__PURE__ */ new Map();
function kr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	an();
	var l = void 0, u = Sn(() => {
		var s = n ?? t.appendChild(on());
		lt(s, { pending: () => {} }, (t) => {
			He({});
			var n = M;
			if (o && (n.c = o), a && (i.$$events = a), k && Tr(t, null), l = e(t, i) || {}, k && (H.nodes.end = A, A === null || A.nodeType !== 8 || A.data !== "]")) throw De(), we;
			Ue();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = pr(r);
					for (let e of [t, document]) {
						var a = Or.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Or.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, xr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(hr)), gr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Or.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, xr), r.delete(e), r.size === 0 && Or.delete(n)) : r.set(e, i);
			}
			gr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ar.set(l, u), l;
}
var Ar = /* @__PURE__ */ new WeakMap(), jr = class {
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
			if (n) Ln(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Ln(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
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
						zn(r, t), t.append(on()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Fn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = P, r = dn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = on();
			i.append(a), this.#n.set(e, {
				effect: kn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, kn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else k && (this.anchor = A), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Mr(e, t, n = !1) {
	var r;
	k && (r = A, Me());
	var i = new jr(e), a = n ? S : 0;
	function o(e, t) {
		if (k) {
			var n = Fe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Pe();
				je(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	On(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Nr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Fn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Pr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			un(d), d.append(u), e.items.clear();
		}
		Pr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Pr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, zn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Fr;
function Ir(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = k ? je(/* @__PURE__ */ sn(u)) : u.appendChild(on());
	}
	k && Me();
	var d = null, f = /* @__PURE__ */ vt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Rr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Br(d, null, c)) : Ln(d) : Fn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: On(() => {
			p = G(f);
			var e = p.length;
			let t = !1;
			k && Fe(c) === "[!" != (e === 0) && (c = Pe(), je(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = P, v = dn(), y = 0; y < e; y += 1) {
				k && A.nodeType === 8 && A.data === "]" && (c = A, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && qt(S.v, b), S.i && qt(S.i, y), v && u.unskip_effect(S.e)) : (S = zr(l, h ? c : Fr ??= on(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = kn(() => s(c)) : (d = kn(() => s(Fr ??= on())), d.f |= T)), e > r.size && me("", "", ""), k && e > 0 && je(Pe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && Ae(!0), G(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, k && (c = A);
}
function Lr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Rr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Lr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Ln(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Br(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Vr(e, d, _), Vr(e, _, y), Br(_, y, n), d = _, p = [], m = [], l = Lr(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Br(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Vr(e, S.prev, C.next), Vr(e, d, S), Vr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Br(_, l, n), Vr(e, _.prev, _.next), Vr(e, _, d === null ? e.effect.first : d.next), Vr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Lr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Lr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Pr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Lr(l.next);
		var E = w.length;
		if (E > 0) {
			var ee = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Nr(e, w, ee);
		}
	}
	o && qe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function zr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Wt(n) : /* @__PURE__ */ F(n, !1, !1) : null, l = o & 2 ? Wt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Br(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ cn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Vr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Hr = [..." 	\n\r\f\xA0\v﻿"];
function Ur(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Hr.includes(r[o - 1])) && (s === r.length || Hr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Wr(e, t, n, r, i, a) {
	var o = e[oe];
	if (k || o !== n || o === void 0) {
		var s = Ur(n, r, a);
		(!k || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Gr(t, n, r = !1) {
	if (t.multiple) {
		if (n == null) return;
		if (!e(n)) return Oe();
		for (var i of t.options) i.selected = n.includes(Jr(i));
		return;
	}
	for (i of t.options) if ($t(Jr(i), n)) {
		i.selected = !0;
		return;
	}
	(!r || n !== void 0) && (t.selectedIndex = -1);
}
function Kr(e) {
	var t = new MutationObserver(() => {
		"__value" in e && Gr(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), vn(() => {
		t.disconnect();
	});
}
function qr(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ot(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Jr);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Jr(o);
		}
		n(a), e.__value = a, P !== null && r.add(P);
	}), Cn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = P;
			if (r.has(o)) return;
		}
		if (Gr(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Jr(s), n(a));
		}
		e.__value = a, i = !1;
	}), Kr(e);
}
function Jr(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Yr = Symbol("is custom element"), Xr = Symbol("is html"), Zr = de ? "link" : "LINK", Qr = de ? "progress" : "PROGRESS";
function $r(e) {
	if (k) {
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
		e[le] = n, qe(n), it();
	}
}
function ei(e, t) {
	var n = ti(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Qr) && (e.value = t ?? "");
}
function Z(e, t, n, r) {
	var i = ti(e);
	k && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Zr) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && ri(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ti(e) {
	return e[ae] ??= {
		[Yr]: e.nodeName.includes("-"),
		[Xr]: e.namespaceURI === Te
	};
}
var ni = /* @__PURE__ */ new Map();
function ri(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ni.get(t);
	if (n) return n;
	ni.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ii(e, t) {
	return e === t || e?.[D] === t;
}
function ai(e = {}, t, n, r) {
	var i = M.r, a = H;
	return Cn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], K(() => {
				ii(n(...s), e) || (t(e, ...s), o && ii(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ii(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function oi(e = !1) {
	let t = M, n = t.l.u;
	if (!n) return;
	let r = () => ur(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ ht(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => G(i);
	}
	n.b.length && xn(() => {
		si(t, r), p(n.b);
	}), yn(() => {
		let e = K(() => n.m.map(f));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && yn(() => {
		si(t, r), p(n.a);
	});
}
function si(e, t) {
	if (e.l.s) for (let t of e.l.s) G(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Q(e, t, n, r) {
	var i = !ze || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ ht(r), G(u)) : (l && (l = !1, c = s ? K(r) : r), c);
	let f;
	if (o) {
		var p = D in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = tt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ye(t), f(m)));
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
	var v = !1, y = (n & 1 ? ht : vt)(() => (v = !1, g()));
	o && G(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? G(y) : i && o ? Zt(e) : e;
			return I(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Hn && v || b.f & 16384 ? y.v : G(y);
	});
}
function ci(e) {
	M === null && fe("onMount"), ze && M.l !== null ? li(M).m.push(e) : yn(() => {
		let t = K(e);
		if (typeof t == "function") return t;
	});
}
function li(e) {
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
})(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Be();
//#endregion
//#region viewer/assets/editor-transaction.js
function $(e) {
	return structuredClone(e);
}
function ui(e, { derive: t = () => ({}), historyLimit: n = 100 } = {}) {
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
function di(e, t, n) {
	let r = e.items.find((e) => e.id === t);
	if (!r) throw Error(`找不到 work item ${t}。`);
	let i = r.checks.find((e) => e.index === n);
	if (!i) throw Error(`找不到 work item ${t} 的 check ${n}。`);
	return {
		item: r,
		check: i
	};
}
function fi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => {
		e.status = e.checks.some((e) => e.status === "failed") ? "failed" : e.checks.every((e) => e.status === "passed") ? "passed" : "pending";
	}), t;
}
var pi = {
	pending: "passed",
	passed: "failed",
	failed: "pending"
};
function mi(e, t) {
	let { item: n, check: r } = di(e, t.workItemId, t.checkIndex);
	if (!r.isManual) throw Error("Agent check 是唯讀的。");
	if (t.type === "set-result" || t.type === "cycle-result") {
		let e = t.type === "cycle-result" ? pi[r.status] ?? "pending" : t.status;
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
	return n.status = n.checks.some((e) => e.status === "failed") ? "failed" : n.checks.every((e) => e.status === "passed") ? "passed" : "pending", e;
}
function hi(e) {
	let t = structuredClone(e);
	return t.items.forEach((e) => e.checks.forEach((e) => {
		e.persistedStatus = e.status, e.persistedObserved = e.observed ?? null;
	})), t;
}
function gi(e, t = {}) {
	let n = e.revision, r = ui(hi(e), {
		derive: fi,
		historyLimit: t.historyLimit
	});
	function i() {
		return Object.freeze({
			document: structuredClone(r.derived),
			dirty: r.dirty,
			history: r.history
		});
	}
	function a(e) {
		let t = e.type === "set-observed" ? `${e.type}:${e.workItemId}:${e.checkIndex}` : "";
		return r.apply(e, mi, t), i();
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
			return n = e.revision, r.commit(hi(e), { keepHistory: !0 }), i();
		}
	});
}
//#endregion
//#region viewer/assets/persistence-mode.js
var _i = "task-progress.cautious-mode.v1", vi = "自動儲存模式。", yi = "謹慎模式：修改後需按儲存。", bi = "有尚未儲存的變更。", xi = "即將自動儲存…", Si = "正在寫入…", Ci = "已儲存。", wi = "已放棄尚未儲存的變更。", Ti = "沒有需要儲存的變更。", Ei = "儲存失敗。", Di = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";
function Oi(e = globalThis.localStorage) {
	try {
		return e?.getItem(_i) === "true";
	} catch {
		return !1;
	}
}
function ki(e, t) {
	let n = t === !0;
	try {
		e?.setItem(_i, n ? "true" : "false");
	} catch {}
	return n;
}
function Ai({ session: e, save: t, storage: n = globalThis.localStorage ?? null, debounceMs: r = 400, debounceCommand: i = () => !1, timers: a = globalThis, onChange: o = () => {} } = {}) {
	if (!e || typeof e.snapshot != "function" || typeof e.dispatch != "function" || typeof e.prepareSave != "function") throw TypeError("Persistence controller 需要既有的 editor session。");
	if (typeof t != "function") throw TypeError("Persistence controller 需要 save 函式。");
	let s = Oi(n), c = "idle", l = s ? yi : vi, u = !1, d = null, f = Promise.resolve(), p = 0, m = () => e.snapshot();
	function h() {
		let e = m();
		return Object.freeze({
			document: e.document,
			dirty: e.dirty,
			history: e.history,
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
			n && (_("idle", Ti), g());
			return;
		}
		let r = e.prepareSave();
		if (r.errors.length) {
			_("incomplete", r.errors[0].message), g();
			return;
		}
		u = !1, _("saving", Si), g();
		try {
			let n = await t({
				revision: r.revision,
				results: r.results
			});
			e.commit(n), _("saved", Ci);
		} catch (e) {
			u = !0, _(e?.code === "revision_conflict" ? "conflict" : "error", e?.message ?? Ei);
		}
		g();
	}
	function b(e = !1) {
		return v(), p += 1, f = f.then(() => y(e)).catch((e) => {
			u = !0, _("error", e?.message ?? Ei), g();
		}).finally(() => {
			--p;
		}), f;
	}
	async function x() {
		for (let e = 0; e < 8; e += 1) if (d !== null && b(), await f, d === null && p === 0) return;
	}
	function S(e) {
		return s ? (u || _("draft", bi), null) : u ? null : e ? (v(), _("pending", xi), d = a.setTimeout(() => {
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
			if (m().dirty) return _("mode_blocked", Di), g(), h();
			s = !1;
		}
		return ki(n, s), u || _("idle", s ? yi : vi), g(), h();
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
			return v(), e.discard(), u = !1, _("idle", wi), g(), h();
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
var ji = "task-progress.theme.v1", Mi = [
	"system",
	"light",
	"dark",
	"custom"
], Ni = [
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
], Pi = Object.freeze({
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
}), Fi = Object.freeze({
	version: 1,
	mode: "system"
}), Ii = /^#[0-9a-f]{6}$/i;
function Li(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Ri(e) {
	return typeof e == "string" && Ii.test(e);
}
function zi(e = "light", t = {}) {
	let n = e === "dark" ? "dark" : "light", r = Pi[n], i = { base: n };
	for (let e of Ni) {
		let n = t[e.key];
		i[e.key] = Ri(n) ? n.toLowerCase() : r[e.key];
	}
	return i;
}
function Bi(e) {
	if (!Li(e) || e.version !== 1 || !Mi.includes(e.mode)) return { ...Fi };
	let t = {
		version: 1,
		mode: e.mode
	};
	return Li(e.custom) ? t.custom = zi(e.custom.base, e.custom) : e.mode === "custom" && (t.custom = zi()), t;
}
function Vi(e) {
	try {
		let t = e?.getItem(ji);
		return t ? Bi(JSON.parse(t)) : { ...Fi };
	} catch {
		return { ...Fi };
	}
}
function Hi(e, t) {
	let n = Bi(t);
	try {
		e?.setItem(ji, JSON.stringify(n));
	} catch {}
	return n;
}
function Ui(e) {
	try {
		return e?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function Wi(e, t) {
	let n = Bi(t);
	e.dataset.theme = n.mode;
	for (let t of Ni) e.style.removeProperty(t.cssVariable);
	if (delete e.dataset.themeBase, n.mode === "custom") {
		let t = n.custom ?? zi();
		e.dataset.themeBase = t.base;
		for (let n of Ni) e.style.setProperty(n.cssVariable, t[n.key]);
		e.style.colorScheme = t.base;
	} else n.mode === "system" ? e.style.colorScheme = "light dark" : e.style.colorScheme = n.mode;
	return n;
}
function Gi(e, t, n = "light") {
	let r = Bi(e), i = {
		version: 1,
		mode: t
	};
	return r.custom && (i.custom = r.custom), t === "custom" && !i.custom && (i.custom = zi(n)), Bi(i);
}
function Ki(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function qi(e, t) {
	if (!Ri(e) || !Ri(t)) return 1;
	let n = (e) => {
		let t = e.slice(1), n = [
			0,
			2,
			4
		].map((e) => Ki(Number.parseInt(t.slice(e, e + 2), 16)));
		return .2126 * n[0] + .7152 * n[1] + .0722 * n[2];
	}, r = n(e), i = n(t);
	return (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
}
function Ji(e) {
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
	].filter(([, e, t]) => qi(e, t) < 4.5).map(([e]) => `${e}對比低於 4.5:1`);
}
//#endregion
//#region viewer/assets/theme-control.js
function Yi({ root: e = globalThis.document?.documentElement, storage: t = globalThis.localStorage, matchMedia: n = globalThis.matchMedia?.bind(globalThis) } = {}) {
	let r = Vi(t);
	e && Wi(e, r);
	function i(n) {
		return r = Hi(t, n), e && Wi(e, r), r;
	}
	return {
		get mode() {
			return r.mode;
		},
		get custom() {
			return r.custom ?? null;
		},
		get systemScheme() {
			return Ui(n);
		},
		setMode(e) {
			return i(Gi(r, e, Ui(n)));
		},
		applyCustom(e) {
			return i({
				version: 1,
				mode: "custom",
				custom: zi(e?.base, e ?? {})
			});
		}
	};
}
//#endregion
//#region experiments/editor-svelte-spike/src/MarkerBox.svelte
var Xi = /* @__PURE__ */ J("<button type=\"button\"><span aria-hidden=\"true\"> </span></button>"), Zi = /* @__PURE__ */ J("<span role=\"img\"><span aria-hidden=\"true\"> </span></span>");
function Qi(e, t) {
	He(t, !1);
	let n = /* @__PURE__ */ F(), r = /* @__PURE__ */ F(), i = /* @__PURE__ */ F(), a = Q(t, "status", 8, "pending"), o = Q(t, "interactive", 8, !1), s = Q(t, "label", 8, ""), c = Q(t, "onCycle", 8, () => {}), l = {
		pending: "",
		passed: "✓",
		failed: "!"
	}, u = {
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	};
	wn(() => ur(a()), () => {
		I(n, l[a()] ?? "?");
	}), wn(() => ur(a()), () => {
		I(r, u[a()] ?? a());
	}), wn(() => (ur(s()), G(r)), () => {
		I(i, s() ? `${s()}：${G(r)}` : G(r));
	}), Tn();
	var d = Er(), f = ln(d), p = (e) => {
		var t = Xi(), r = L(t), o = L(r, !0);
		j(r), j(t), z(() => {
			Wr(t, 1, `marker-box marker-${a()} marker-box-button`), Z(t, "aria-label", `${G(i)}，點擊切換下一個結果`), X(o, G(n));
		}), q("click", t, function(...e) {
			c()?.apply(this, e);
		}), Y(e, t);
	}, m = (e) => {
		var t = Zi(), r = L(t), o = L(r, !0);
		j(r), j(t), z(() => {
			Wr(t, 1, `marker-box marker-${a()}`), Z(t, "aria-label", G(i)), X(o, G(n));
		}), Y(e, t);
	};
	Mr(f, (e) => {
		o() ? e(p) : e(m, -1);
	}), Y(e, d), Ue();
}
yr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/SaveBar.svelte
var $i = /* @__PURE__ */ J("<button class=\"secondary-button edit-mode-button\" type=\"button\"> </button>"), ea = /* @__PURE__ */ J("<button class=\"secondary-button edit-discard-button\" type=\"button\" aria-label=\"放棄全部修改並回到預覽模式\"> </button> <button class=\"primary-button edit-save-button\" type=\"button\"> </button>", 1), ta = /* @__PURE__ */ J("<span class=\"edit-save-status\" id=\"edit-save-status\" role=\"status\"> </span> <span class=\"edit-history-actions\"><button class=\"secondary-button edit-history-button\" type=\"button\"> </button> <button class=\"secondary-button edit-history-button\" type=\"button\"> </button></span> <!> <!>", 1);
function na(e, t) {
	He(t, !1);
	let n = Q(t, "cautious", 8, !0), r = Q(t, "onToggleCautious", 8, null), i = Q(t, "cautiousLabel", 8, "謹慎模式"), a = Q(t, "dirty", 8, !1), o = Q(t, "saving", 8, !1), s = Q(t, "canUndo", 8, !1), c = Q(t, "canRedo", 8, !1), l = Q(t, "message", 8, ""), u = Q(t, "buttonLabel", 8, "儲存"), d = Q(t, "savingLabel", 8, "正在儲存…"), f = Q(t, "undoLabel", 8, "復原"), p = Q(t, "redoLabel", 8, "重做"), m = Q(t, "discardLabel", 8, "放棄"), h = Q(t, "onSave", 8, () => {}), g = Q(t, "onUndo", 8, () => {}), _ = Q(t, "onRedo", 8, () => {}), v = Q(t, "onDiscard", 8, () => {});
	oi();
	var y = ta(), b = ln(y), x = L(b, !0);
	j(b);
	var S = R(b, 2), C = L(S), w = L(C, !0);
	j(C);
	var T = R(C, 2), E = L(T, !0);
	j(T), j(S);
	var ee = R(S, 2), te = (e) => {
		var t = $i(), a = L(t, !0);
		j(t), z(() => {
			Z(t, "aria-pressed", n()), Z(t, "aria-label", `${i()}：改為手動儲存與放棄`), t.disabled = o(), X(a, i());
		}), q("click", t, () => r()(!n())), Y(e, t);
	};
	Mr(ee, (e) => {
		r() && e(te);
	});
	var ne = R(ee, 2), D = (e) => {
		var t = ea(), n = ln(t), r = L(n, !0);
		j(n);
		var i = R(n, 2), s = L(i, !0);
		j(i), z(() => {
			n.disabled = o(), X(r, m()), i.disabled = !a() || o(), X(s, o() ? d() : u());
		}), q("click", n, function(...e) {
			v()?.apply(this, e);
		}), q("click", i, function(...e) {
			h()?.apply(this, e);
		}), Y(e, t);
	};
	Mr(ne, (e) => {
		n() && e(D);
	}), z(() => {
		X(x, l()), Z(C, "aria-label", `${f()}上一個修改`), C.disabled = !s() || o(), X(w, f()), Z(T, "aria-label", `${p()}下一個修改`), T.disabled = !c() || o(), X(E, p());
	}), q("click", C, function(...e) {
		g()?.apply(this, e);
	}), q("click", T, function(...e) {
		_()?.apply(this, e);
	}), Y(e, y), Ue();
}
yr(["click"]);
//#endregion
//#region experiments/editor-svelte-spike/src/ThemeControl.svelte
var ra = /* @__PURE__ */ J("<option> </option>"), ia = /* @__PURE__ */ J("<label class=\"theme-color-field\"><span> </span> <span class=\"theme-color-controls\"><input type=\"color\"/> <input type=\"text\" inputmode=\"text\" maxlength=\"7\"/></span></label>"), aa = /* @__PURE__ */ J("<label class=\"theme-picker\" for=\"theme-select\"><span>主題</span> <select id=\"theme-select\" aria-label=\"顯示主題\"></select></label> <dialog class=\"theme-dialog\" id=\"theme-dialog\" aria-labelledby=\"theme-dialog-title\"><div class=\"theme-dialog-heading\"><div><p class=\"section-kicker\">Custom theme</p> <h2 id=\"theme-dialog-title\">自訂 Viewer 顏色</h2></div> <button class=\"theme-close\" id=\"theme-close\" type=\"button\" aria-label=\"關閉自訂主題\"><span aria-hidden=\"true\">×</span></button></div> <p class=\"theme-dialog-description\">選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。</p> <label class=\"theme-base-field\" for=\"theme-custom-base\"><span>狀態色基底</span> <select id=\"theme-custom-base\"><option>亮色基底</option><option>暗色基底</option></select></label> <div class=\"theme-color-fields\" id=\"theme-color-fields\"></div> <p id=\"theme-dialog-status\" aria-live=\"polite\"> </p> <div class=\"theme-dialog-actions\"><button class=\"secondary-button\" id=\"theme-reset\" type=\"button\">恢復基底預設</button> <span class=\"theme-dialog-action-spacer\"></span> <button class=\"secondary-button\" id=\"theme-cancel\" type=\"button\">取消</button> <button class=\"primary-button\" id=\"theme-apply\" type=\"button\">套用自訂主題</button></div></dialog>", 1);
function oa(e, t) {
	He(t, !1);
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
	], d = /^#[0-9a-f]{6}$/i, f = /* @__PURE__ */ F(), p = /* @__PURE__ */ F([]), m = /* @__PURE__ */ F(a()), h = /* @__PURE__ */ F(o()?.base ?? s()), g = /* @__PURE__ */ F(v(zi(G(h)))), _ = /* @__PURE__ */ F({ ...G(g) });
	function v(e) {
		return Object.fromEntries(Ni.map((t) => [t.key, e[t.key]]));
	}
	function y(e) {
		I(h, e.base), I(g, v(e)), I(_, { ...G(g) });
		for (let e of G(p)) e?.setCustomValidity("");
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
		y(o() ? zi(o().base, o()) : zi(s())), typeof G(f).showModal == "function" ? G(f).showModal() : G(f).setAttribute("open", "");
	}
	function S() {
		G(f).open && G(f).close();
	}
	function C(e) {
		y(zi(e.currentTarget.value));
	}
	function w(e, t, n) {
		let r = n.currentTarget.value;
		I(g, {
			...G(g),
			[e.key]: r
		}), I(_, {
			...G(_),
			[e.key]: r
		}), G(p)[t]?.setCustomValidity("");
	}
	function T(e, t) {
		let n = t.currentTarget, r = d.test(n.value);
		n.setCustomValidity(r ? "" : "請輸入 #RRGGBB 格式的色碼"), I(g, {
			...G(g),
			[e.key]: n.value
		}), r && I(_, {
			...G(_),
			[e.key]: n.value.toLowerCase()
		});
	}
	function E() {
		I(m, a()), S();
	}
	function ee(e) {
		e.preventDefault(), E();
	}
	function te() {
		let e = G(p).find((e) => e && !e.checkValidity());
		if (e) {
			e.reportValidity();
			return;
		}
		l()(zi(G(h), G(_))), S();
	}
	wn(() => ur(a()), () => {
		I(m, a());
	}), wn(() => (G(h), G(_)), () => {
		I(n, zi(G(h), G(_)));
	}), wn(() => G(n), () => {
		I(r, Ji(G(n)));
	}), wn(() => G(r), () => {
		I(i, G(r).length ? `注意：${G(r).join("；")}。仍可套用，但可能較難閱讀。` : "目前的文字與背景色彩對比符合 4.5:1。");
	}), Tn(), oi();
	var ne = aa(), D = ln(ne), re = R(L(D), 2);
	Ir(re, 5, () => u, (e) => e.value, (e, t) => {
		var n = ra(), r = L(n, !0);
		j(n);
		var i = {};
		z(() => {
			X(r, (G(t), K(() => G(t).label))), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
		}), Y(e, n);
	}), j(re), j(D);
	var ie = R(D, 2), ae = L(ie), oe = R(L(ae), 2);
	j(ae);
	var se = R(ae, 4), ce = R(L(se), 2), le = L(ce);
	le.value = le.__value = "light";
	var ue = R(le);
	ue.value = ue.__value = "dark", j(ce);
	var de;
	Kr(ce), j(se);
	var fe = R(se, 2);
	Ir(fe, 7, () => Ni, (e) => e.key, (e, t, r) => {
		var i = ia(), a = L(i), o = L(a, !0);
		j(a);
		var s = R(a, 2), c = L(s);
		$r(c);
		var l = R(c, 2);
		$r(l), Z(l, "pattern", "#[0-9a-fA-F]{6}"), ai(l, (e, t) => Kt(p, G(p)[t] = e), (e) => G(p)?.[e], () => [G(r)]), j(s), j(i), z(() => {
			X(o, (G(t), K(() => G(t).label))), Z(c, "aria-label", (G(t), K(() => `${G(t).label}選色器`))), ei(c, (G(n), G(t), K(() => G(n)[G(t).key]))), Z(l, "aria-label", (G(t), K(() => `${G(t).label}十六進位色碼`))), ei(l, (G(g), G(t), K(() => G(g)[G(t).key])));
		}), q("input", c, (e) => w(G(t), G(r), e)), q("input", l, (e) => T(G(t), e)), Y(e, i);
	}), j(fe);
	var pe = R(fe, 2);
	let me;
	var he = L(pe, !0);
	j(pe);
	var ge = R(pe, 2), _e = L(ge), ve = R(_e, 4), ye = R(ve, 2);
	j(ge), j(ie), ai(ie, (e) => I(f, e), () => G(f)), z(() => {
		de !== (de = G(h)) && (ce.value = (ce.__value = G(h)) ?? "", Gr(ce, G(h))), me = Wr(pe, 1, "theme-dialog-status", null, me, { "theme-status-warning": G(r).length > 0 }), X(he, G(i));
	}), q("change", re, b), qr(re, () => G(m), (e) => I(m, e)), vr("cancel", ie, ee), q("click", oe, E), q("change", ce, C), q("click", _e, () => y(zi(G(h)))), q("click", ve, E), q("click", ye, te), Y(e, ne), Ue();
}
yr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-bridge.js
var sa = 1, ca = /* @__PURE__ */ new Set(["load", "save"]);
function la(e = globalThis.chrome?.webview) {
	if (!e || typeof e.postMessage != "function") throw Error("此頁面必須由 TaskProgress Checklist Desktop Host 開啟。");
	let t = 0, n = /* @__PURE__ */ new Map();
	e.addEventListener("message", (e) => {
		let t = e.data;
		if (!t || t.version !== sa || typeof t.id != "string") return;
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
		if (!ca.has(r)) return Promise.reject(/* @__PURE__ */ Error(`不支援的 Checklist bridge request：${r}`));
		let a = `checklist-${Date.now()}-${++t}`;
		return new Promise((t, o) => {
			n.set(a, {
				resolve: t,
				reject: o
			});
			let s = {
				version: sa,
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
var ua = /* @__PURE__ */ J("<p class=\"checklist-round\"> </p>"), da = /* @__PURE__ */ J("<p class=\"checklist-notice\" role=\"status\"> </p>"), fa = /* @__PURE__ */ J("<p class=\"checklist-notice checklist-error\" role=\"alert\"> </p>"), pa = /* @__PURE__ */ J("<small> </small>"), ma = /* @__PURE__ */ J("<div><dt>Reason</dt><dd> </dd></div>"), ha = /* @__PURE__ */ J("<div><dt>Observed</dt><dd> </dd></div>"), ga = /* @__PURE__ */ J("<div><dt>Resolved</dt><dd> </dd></div>"), _a = /* @__PURE__ */ J("<label class=\"checklist-observed\"><span>Observed</span> <textarea rows=\"3\" placeholder=\"記錄實際看到的結果\"></textarea></label>"), va = /* @__PURE__ */ J("<section><div class=\"checklist-check-heading\"><!> <strong> </strong> <span class=\"checklist-owner\"> </span></div> <dl><div><dt>Action</dt><dd> </dd></div> <div><dt>Expect</dt><dd> </dd></div> <!> <!> <!></dl> <!></section>"), ya = /* @__PURE__ */ J("<article><header class=\"checklist-item-header\"><!> <div><h2> </h2> <p> </p> <!></div> <span class=\"checklist-status\"> </span></header> <div class=\"checklist-checks\"></div></article>"), ba = /* @__PURE__ */ J("<section class=\"checklist-items\" aria-label=\"Implementation checklist items\"></section> <footer class=\"edit-save-bar\" aria-live=\"polite\"><!></footer>", 1), xa = /* @__PURE__ */ J("<main class=\"checklist-page\"><header class=\"checklist-header\"><div><p class=\"section-kicker\">Implementation Checklist</p> <h1> </h1> <!></div> <!></header> <!></main>");
function Sa(e, t) {
	He(t, !1);
	let n = null, r = /* @__PURE__ */ F(null), i = /* @__PURE__ */ F(!0), a = /* @__PURE__ */ F(""), o = /* @__PURE__ */ F("正在載入 Checklist…"), s = (e) => ({
		pending: "未執行",
		passed: "通過",
		failed: "失敗"
	})[e] ?? e, c = /* @__PURE__ */ new Set([
		"incomplete",
		"conflict",
		"error",
		"mode_blocked"
	]), l = (e) => e === "saving" ? "saving" : c.has(e) ? "error" : "clean", u = /* @__PURE__ */ F(null), d = /* @__PURE__ */ F({
		mode: "system",
		custom: null,
		systemScheme: "light"
	});
	function f() {
		I(d, {
			mode: G(u).mode,
			custom: G(u).custom,
			systemScheme: G(u).systemScheme
		});
	}
	ci(async () => {
		I(u, Yi()), f();
		try {
			let e = la();
			n = Ai({
				session: gi(await e.load()),
				save: e.save,
				debounceCommand: (e) => e.type === "set-observed",
				onChange: (e) => {
					I(r, e), I(o, e.message);
				}
			}), I(r, n.snapshot()), I(o, G(r).message);
		} catch (e) {
			I(a, e instanceof Error ? e.message : "Checklist 載入失敗。"), I(o, G(a));
		} finally {
			I(i, !1);
		}
	});
	function p(e) {
		try {
			n.dispatch(e), I(r, n.snapshot()), I(o, G(r).message);
		} catch (e) {
			I(o, e.message);
		}
	}
	function m(e, t) {
		p({
			type: "cycle-result",
			workItemId: e,
			checkIndex: t.index
		});
	}
	function h() {
		n.undo(), I(r, n.snapshot());
	}
	function g() {
		n.redo(), I(r, n.snapshot());
	}
	function _() {
		I(r, n.discard());
	}
	async function v() {
		await n.save(), I(r, n.snapshot());
	}
	async function y(e) {
		I(r, await n.setCautious(e));
	}
	oi();
	var b = xa(), x = L(b), S = L(x), C = R(L(S), 2), w = L(C, !0);
	j(C);
	var T = R(C, 2), E = (e) => {
		var t = ua(), n = L(t, !0);
		j(t), z(() => X(n, G(r).document.roundIdentity)), Y(e, t);
	};
	Mr(T, (e) => {
		G(r) && e(E);
	}), j(S);
	var ee = R(S, 2), te = (e) => {
		oa(e, {
			get mode() {
				return G(d).mode;
			},
			get custom() {
				return G(d).custom;
			},
			get systemScheme() {
				return G(d).systemScheme;
			},
			onModeChange: (e) => {
				G(u).setMode(e), f();
			},
			onApplyCustom: (e) => {
				G(u).applyCustom(e), f();
			}
		});
	};
	Mr(ee, (e) => {
		G(u) && e(te);
	}), j(x);
	var ne = R(x, 2), D = (e) => {
		var t = da(), n = L(t, !0);
		j(t), z(() => X(n, G(o))), Y(e, t);
	}, re = (e) => {
		var t = fa(), n = L(t, !0);
		j(t), z(() => X(n, G(a))), Y(e, t);
	}, ie = (e) => {
		var t = ba(), n = ln(t);
		Ir(n, 5, () => G(r).document.items, (e) => e.id, (e, t) => {
			var n = ya(), r = L(n), i = L(r);
			{
				let e = /* @__PURE__ */ vt(() => `工作項目 ${G(t).id}`);
				Qi(i, {
					get status() {
						return G(t).status;
					},
					get label() {
						return G(e);
					}
				});
			}
			var a = R(i, 2), o = L(a), c = L(o);
			j(o);
			var l = R(o, 2), u = L(l, !0);
			j(l);
			var d = R(l, 2), f = (e) => {
				var n = pa(), r = L(n);
				j(n), z((e) => X(r, `Depends on: ${e ?? ""}`), [() => G(t).dependsOn.join(", ")]), Y(e, n);
			};
			Mr(d, (e) => {
				G(t).dependsOn.length && e(f);
			}), j(a);
			var h = R(a, 2), g = L(h, !0);
			j(h), j(r);
			var _ = R(r, 2);
			Ir(_, 5, () => G(t).checks, (e) => e.index, (e, n) => {
				var r = va(), i = L(r), a = L(i);
				Qi(a, {
					get status() {
						return G(n).status;
					},
					get interactive() {
						return G(n).isManual;
					},
					get label() {
						return G(n).title;
					},
					onCycle: () => m(G(t).id, G(n))
				});
				var o = R(a, 2), s = L(o, !0);
				j(o);
				var c = R(o, 2), l = L(c, !0);
				j(c), j(i);
				var u = R(i, 2), d = L(u), f = R(L(d)), h = L(f, !0);
				j(f), j(d);
				var g = R(d, 2), _ = R(L(g)), v = L(_, !0);
				j(_), j(g);
				var y = R(g, 2), b = (e) => {
					var t = ma(), r = R(L(t)), i = L(r, !0);
					j(r), j(t), z(() => X(i, G(n).reason)), Y(e, t);
				};
				Mr(y, (e) => {
					G(n).reason && e(b);
				});
				var x = R(y, 2), S = (e) => {
					var t = ha(), r = R(L(t)), i = L(r, !0);
					j(r), j(t), z(() => X(i, G(n).observed)), Y(e, t);
				};
				Mr(x, (e) => {
					G(n).observed && !(G(n).isManual && G(n).status === "failed") && e(S);
				});
				var C = R(x, 2), w = (e) => {
					var t = ga(), r = R(L(t)), i = L(r, !0);
					j(r), j(t), z(() => X(i, G(n).resolved)), Y(e, t);
				};
				Mr(C, (e) => {
					G(n).resolved && e(w);
				}), j(u);
				var T = R(u, 2), E = (e) => {
					var r = _a(), i = R(L(r), 2);
					nt(i), j(r), z(() => ei(i, G(n).observed ?? "")), q("input", i, (e) => p({
						type: "set-observed",
						workItemId: G(t).id,
						checkIndex: G(n).index,
						value: e.currentTarget.value
					})), Y(e, r);
				};
				Mr(T, (e) => {
					G(n).isManual && G(n).status === "failed" && e(E);
				}), j(r), z(() => {
					Wr(r, 1, `checklist-check checklist-${G(n).status}`), X(s, G(n).title), X(l, G(n).isManual ? "需人工驗證" : "Agent"), X(h, G(n).action), X(v, G(n).expect);
				}), Y(e, r);
			}), j(_), j(n), z((e) => {
				Wr(n, 1, `checklist-item checklist-${G(t).status}`), X(c, `${G(t).id ?? ""}. ${G(t).title ?? ""}`), X(u, G(t).outcome), X(g, e);
			}, [() => s(G(t).status)]), Y(e, n);
		}), j(n);
		var i = R(n, 2);
		na(L(i), {
			get cautious() {
				return G(r).cautious;
			},
			onToggleCautious: y,
			get dirty() {
				return G(r).dirty;
			},
			get saving() {
				return G(r).saving;
			},
			get canUndo() {
				return G(r).history.canUndo;
			},
			get canRedo() {
				return G(r).history.canRedo;
			},
			get message() {
				return G(o);
			},
			onSave: v,
			onUndo: h,
			onRedo: g,
			onDiscard: _
		}), j(i), z((e) => {
			Z(i, "data-state", e), Z(i, "aria-busy", G(r).saving);
		}, [() => l(G(r).status)]), Y(e, t);
	};
	Mr(ne, (e) => {
		G(i) ? e(D) : G(r) ? e(ie, -1) : e(re, 1);
	}), j(b), z(() => X(w, G(r)?.document.fileName ?? "TaskProgress Checklist")), Y(e, b), Ue();
}
//#endregion
//#region experiments/editor-svelte-spike/src/checklist-main.js
yr(["input"]), Dr(Sa, { target: document.querySelector("#app") });
//#endregion
