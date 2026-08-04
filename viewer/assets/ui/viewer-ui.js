//#region viewer/assets/ui-host.js
var e = /* @__PURE__ */ new Map(), t = null;
function n(e) {
	if (!e || typeof e != "object") throw TypeError("UI adapter 必須是物件。");
	if (typeof e.id != "string" || !e.id) throw TypeError("UI adapter 需要穩定的 id。");
	for (let t of [
		"mount",
		"update",
		"destroy"
	]) if (typeof e[t] != "function") throw TypeError(`UI adapter「${e.id}」缺少 ${t}()。`);
}
function r(r) {
	return n(r), e.set(r.id, r), t ??= r.id, r.id;
}
//#endregion
//#region node_modules/svelte/src/constants.js
var i = {}, a = Symbol("uninitialized"), o = "http://www.w3.org/1999/xhtml", s = "http://www.w3.org/2000/svg", c = Array.isArray, l = Array.prototype.indexOf, u = Array.prototype.includes, d = Array.from, f = Object.defineProperty, p = Object.getOwnPropertyDescriptor, m = Object.getOwnPropertyDescriptors, h = Object.prototype, g = Array.prototype, _ = Object.getPrototypeOf, v = Object.isExtensible, y = () => {};
function b(e) {
	return e();
}
function x(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function S() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var C = 1024, w = 2048, T = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, se = 1 << 25, ce = 65536, le = 1 << 21, ue = 1 << 22, de = 1 << 23, fe = Symbol("$state"), pe = Symbol("legacy props"), me = Symbol(""), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), ye = Symbol("form reset"), be = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), xe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Se() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ce(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function we(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Te() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ee(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function De() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Oe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function ke() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function je() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Me() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function Ne() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Pe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Fe() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Ie() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function Le(e) {
	E = e;
}
var D;
function O(e) {
	if (e === null) throw Pe(), i;
	return D = e;
}
function Re() {
	return O(/* @__PURE__ */ mn(D));
}
function k(e) {
	if (E) {
		if (/* @__PURE__ */ mn(D) !== null) throw Pe(), i;
		D = e;
	}
}
function ze(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ mn(n);
		D = n;
	}
}
function Be(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ mn(n);
		e && n.remove(), n = i;
	}
}
function Ve(e) {
	if (!e || e.nodeType !== 8) throw Pe(), i;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function He(e) {
	return e === this.v;
}
function Ue(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function We(e) {
	return !Ue(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Ge = !1;
function Ke() {
	Ge = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var A = null;
function qe(e) {
	A = e;
}
function Je(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: Ge && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function Ye(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, e ?? {};
}
function Xe() {
	return !Ge || A !== null && A.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ze = [];
function Qe() {
	var e = Ze;
	Ze = [], x(e);
}
function $e(e) {
	if (Ze.length === 0 && !Ft) {
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
	var t = H;
	if (t === null) return V.f |= de, e;
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
var rt = ~(w | T | C);
function j(e, t) {
	e.f = e.f & rt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? j(e, C) : j(e, T);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ce, at(t.deps));
}
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), at(e.deps), j(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var st = !1;
function ct(e) {
	var t = st;
	try {
		return st = !1, [e(), st];
	} finally {
		st = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function lt(e) {
	E && /* @__PURE__ */ pn(e) !== null && gn(e);
}
var ut = !1;
function dt() {
	ut || (ut = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ye]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ft(e) {
	var t = V, n = H;
	Xn(null), Zn(null);
	try {
		return e();
	} finally {
		Xn(t), Zn(n);
	}
}
function pt(e, t, n, r = n) {
	e.addEventListener(t, () => ft(n));
	let i = e[ye];
	e[ye] = i ? () => {
		i(), r(!0);
	} : () => r(!0), dt();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function mt(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		Cn() && (G(n), Mn(() => (t === 0 && (r = K(() => e(() => nn(n)))), t += 1, () => {
			$e(() => {
				--t, t === 0 && (r?.(), r = void 0, nn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ht = ie | ae;
function gt(e, t, n, r) {
	new _t(e, t, n, r);
}
var _t = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
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
	#h = mt(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Nn(() => {
			if (E) {
				let e = this.#t;
				Re();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ht), E && (this.#e = D);
	}
	#g() {
		try {
			this.#a = Pn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		$e(r), t && (this.#s = Pn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ie();
				return;
			}
			t = !0, n && Me(), this.#s !== null && Bn(this.#s, () => {
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
		e && (this.is_pending = !0, this.#o = Pn(() => e(this.#e)), $e(() => {
			var e = this.#c = document.createDocumentFragment(), t = F();
			e.append(t), this.#a = this.#S(() => Pn(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Pn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Wn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Pn(() => t(this.#e));
			} else this.#x(M);
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
		var t = H, n = V, r = A;
		Zn(this.#i), Xn(this.#i), qe(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} catch (e) {
			return tt(e), null;
		} finally {
			Zn(t), Xn(n), qe(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, $e(() => {
			this.#d = !1, this.#m && en(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), G(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (B(this.#a), null), this.#o &&= (B(this.#o), null), this.#s &&= (B(this.#s), null), E && (O(this.#t), ze(), O(Be()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Pn(() => {
						var r = H;
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
function vt(e, t, n, r) {
	let i = Xe() ? St : Tt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = yt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				nt(e, s);
			}
			bt();
		}
	}
	var d = xt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ wt(e))).then(u).catch((e) => nt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), bt();
	}) : f();
}
function yt() {
	var e = H, t = V, n = A, r = M;
	return function(i = !0) {
		Zn(e), Xn(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function bt(e = !0) {
	Zn(null), Xn(null), qe(null), e && M?.deactivate();
}
function xt() {
	var e = H, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	var t = 2 | w;
	return H !== null && (H.f |= ae), {
		ctx: A,
		deps: null,
		effects: null,
		equals: He,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: a,
		wv: 0,
		parent: H,
		ac: null
	};
}
var Ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function wt(e, t, n) {
	let r = H;
	r === null && Se();
	var i = void 0, o = Qt(a), s = !V, c = /* @__PURE__ */ new Set();
	return jn(() => {
		var t = H, n = S();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== be && n.reject(e);
			}).finally(bt);
		} catch (e) {
			n.reject(e), bt();
		}
		var a = M;
		if (s) {
			if (t.f & 32768) var l = xt();
			if (r.b?.is_rendered()) a.async_deriveds.get(t)?.reject(Ct);
			else for (let e of c.values()) e.reject(Ct);
			c.add(n), a.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== Ct && (a.activate(), t ? (o.f |= de, en(o, t)) : (o.f & 8388608 && (o.f ^= de), en(o, e)), a.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), wn(() => {
		for (let e of c) e.reject(Ct);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(o) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Tt(e) {
	let t = /* @__PURE__ */ St(e);
	return t.equals = We, t;
}
function Et(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) B(t[n]);
	}
}
function Dt(e) {
	var t, n = H, r = e.parent;
	if (!qn && r !== null && e.v !== a && r.f & 24576) return Ne(), e.v;
	Zn(r);
	try {
		e.f &= ~ce, Et(e), t = lr(e);
	} finally {
		Zn(n);
	}
	return t;
}
function Ot(e) {
	var t = Dt(e);
	if (!e.equals(t) && (e.wv = or(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null))) {
		j(e, C);
		return;
	}
	qn || (Nt === null ? it(e) : (Cn() || M?.is_fork) && Nt.set(e, t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ft(() => {
		t.ac.abort(be), t.ac = null;
	}), t.fn !== null && (t.teardown = y), dr(t, 0), In(t));
}
function At(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && fr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var jt = null, M = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
	id = Bt++;
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
		jt === null ? jt = this : (jt.#n = this, this.#t = jt), jt = this;
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
			for (var r of n.d) j(r, w), t(r);
			for (r of n.m) j(r, T), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, zt++ > 1e3 && (this.#x(), Ut());
		for (let e of this.#u) this.#d.delete(e), j(e, w), this.schedule(e);
		for (let e of this.#d) j(e, T), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Lt = [], r = [], i = Rt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Jt(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) qt(e, t);
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
		this.#r.clear(), Mt = this, Gt(r), Gt(n), Mt = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= C;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= C : i & 4 ? t.push(r) : sr(r) && (i & 16 && this.#d.add(r), fr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, w), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== a && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Nt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, Nt = null;
	}
	flush() {
		try {
			It = !0, M = this, this.#g();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, M = null, Nt = null, Xt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ct);
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
		return (this.#s ??= S()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!It && !Ft && $e(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		Nt = null;
	}
	schedule(e) {
		if (Pt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Lt !== null && t === H && (V === null || !(V.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= C;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? jt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft;
	Ft = !0;
	try {
		var n;
		for (e && (M !== null && !M.is_fork && M.flush(), n = e());;) {
			if (et(), M === null) return n;
			M.flush();
		}
	} finally {
		Ft = t;
	}
}
function Ut() {
	try {
		De();
	} catch (e) {
		nt(e, Pt);
	}
}
var Wt = null;
function Gt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && sr(r) && (Wt = /* @__PURE__ */ new Set(), fr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), Wt?.size > 0)) {
				Xt.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || fr(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	M.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, C);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	j(e, C);
	for (var t = e.first; t !== null;) Jt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Yt = /* @__PURE__ */ new Set(), Xt = /* @__PURE__ */ new Map(), Zt = !1;
function Qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: He,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t) {
	let n = Qt(e, t);
	return $n(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = We), Ge && n && A !== null && A.l !== null && (A.l.s ??= []).push(r), r;
}
function P(e, t, n = !1) {
	return V !== null && (!Yn || V.f & 131072) && Xe() && V.f & 4325394 && (Qn === null || !Qn.has(e)) && je(), en(e, n ? an(t) : t, Rt);
}
function en(e, t, n = null) {
	if (!e.equals(t)) {
		Xt.set(e, qn ? t : e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Dt(t), Nt === null && it(t);
		}
		e.wv = or(), rn(e, w, n), Xe() && H !== null && H.f & 1024 && !(H.f & 96) && (er === null ? tr([e]) : er.push(e)), !r.is_fork && Yt.size > 0 && !Zt && tn();
	}
	return t;
}
function tn() {
	Zt = !1;
	for (let e of Yt) {
		e.f & 1024 && j(e, T);
		let t;
		try {
			t = sr(e);
		} catch {
			t = !0;
		}
		t && fr(e);
	}
	Yt.clear();
}
function nn(e) {
	P(e, e.v + 1);
}
function rn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Xe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === H)) {
			var l = (c & w) === 0;
			if (l && j(s, t), c & 131072) Yt.add(s);
			else if (c & 2) {
				var u = s;
				Nt?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= ce), rn(u, T, n));
			} else if (l) {
				var d = s;
				c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
			}
		}
	}
}
function an(e) {
	if (typeof e != "object" || !e || fe in e) return e;
	let t = _(e);
	if (t !== h && t !== g) return e;
	var n = /* @__PURE__ */ new Map(), r = c(e), i = /* @__PURE__ */ $t(0), o = null, s = ir, l = (e) => {
		if (ir === s) return e();
		var t = V, n = ir;
		Xn(null), ar(s);
		var r = e();
		return Xn(t), ar(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ $t(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && ke();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ $t(r.value, o);
				return n.set(t, e), e;
			}) : P(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ $t(a, o));
					n.set(t, e), nn(i);
				}
			} else P(r, a), nn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === fe) return e;
			var s = n.get(r), c = r in t;
			if (s === void 0 && (!c || p(t, r)?.writable) && (s = l(() => /* @__PURE__ */ $t(an(c ? t[r] : a), o)), n.set(r, s)), s !== void 0) {
				var u = G(s);
				return u === a ? void 0 : u;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = G(i));
			} else if (r === void 0) {
				var o = n.get(t), s = o?.v;
				if (o !== void 0 && s !== a) return {
					enumerable: !0,
					configurable: !0,
					value: s,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === fe) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== a || Reflect.has(e, t);
			return (r !== void 0 || H !== null && (!i || p(e, t)?.writable)) && (r === void 0 && (r = l(() => /* @__PURE__ */ $t(i ? an(e[t]) : a, o)), n.set(t, r)), G(r) === a) ? !1 : i;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (r && t === "length") for (var f = s; f < u.v; f += 1) {
				var m = n.get(f + "");
				m === void 0 ? f in e && (m = l(() => /* @__PURE__ */ $t(a, o)), n.set(f + "", m)) : P(m, a);
			}
			if (u === void 0) (!d || p(e, t)?.writable) && (u = l(() => /* @__PURE__ */ $t(void 0, o)), P(u, an(s)), n.set(t, u));
			else {
				d = u.v !== a;
				var h = l(() => an(s));
				P(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (r && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && P(_, v + 1);
				}
				nn(i);
			}
			return !0;
		},
		ownKeys(e) {
			G(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== a;
			});
			for (var [r, o] of n) o.v !== a && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Ae();
		}
	});
}
function on(e) {
	try {
		if (typeof e == "object" && e && fe in e) return e[fe];
	} catch {}
	return e;
}
function sn(e, t) {
	return Object.is(on(e), on(t));
}
var cn, ln, un, dn;
function fn() {
	if (cn === void 0) {
		cn = window, ln = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		un = p(t, "firstChild").get, dn = p(t, "nextSibling").get, v(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), v(n) && (n[ve] = void 0);
	}
}
function F(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function pn(e) {
	return un.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function mn(e) {
	return dn.call(e);
}
function I(e, t) {
	if (!E) return /* @__PURE__ */ pn(e);
	var n = /* @__PURE__ */ pn(D);
	if (n === null) n = D.appendChild(F());
	else if (t && n.nodeType !== 3) {
		var r = F();
		return n?.before(r), O(r), r;
	}
	return t && yn(n), O(n), n;
}
function hn(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ pn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ mn(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = F();
			return D?.before(r), O(r), r;
		}
		yn(D);
	}
	return D;
}
function L(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ mn(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = F();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		yn(r);
	}
	return O(r), r;
}
function gn(e) {
	e.textContent = "";
}
function _n() {
	return !1;
}
function vn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function yn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function bn(e) {
	H === null && (V === null && Ee(e), Te()), qn && we(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: A,
		deps: null,
		nodes: null,
		f: e | w | 512,
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
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			fr(r);
		} catch (e) {
			throw B(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), V !== null && V.f & 2 && !(e & 64))) {
		var a = V;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return V !== null && !Yn;
}
function wn(e) {
	let t = Sn(8, null);
	return j(t, C), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = H.f;
	if (!V && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | oe, e);
}
function Dn(e) {
	return bn("$effect.pre"), Sn(8 | oe, e);
}
function On(e) {
	Vt.ensure();
	let t = Sn(64 | ae, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			B(t), n(void 0);
		}) : (B(t), n(void 0));
	});
}
function kn(e) {
	return Sn(4, e);
}
function R(e, t) {
	var n = A, r = {
		effect: null,
		ran: !1,
		deps: e
	};
	n.l.$.push(r), r.effect = Mn(() => {
		if (e(), !r.ran) {
			r.ran = !0;
			var n = H;
			try {
				Zn(n.parent), K(t);
			} finally {
				Zn(n);
			}
		}
	});
}
function An() {
	var e = A;
	Mn(() => {
		for (var t of e.l.$) {
			t.deps();
			var n = t.effect;
			n.f & 1024 && n.deps !== null && j(n, T), sr(n) && fr(n), t.ran = !1;
		}
	});
}
function jn(e) {
	return Sn(ue | ae, e);
}
function Mn(e, t = 0) {
	return Sn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	vt(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(G));
		});
	});
}
function Nn(e, t = 0) {
	return Sn(16 | t, e);
}
function Pn(e) {
	return Sn(32 | ae, e);
}
function Fn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = qn, n = V;
		Jn(!0), Xn(null);
		try {
			t.call(null);
		} finally {
			Jn(e), Xn(n);
		}
	}
}
function In(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ft(() => {
			e.abort(be);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : B(n, t), n = r;
	}
}
function Ln(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || B(t), t = n;
	}
}
function B(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= re, In(e, t && !n), dr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Fn(e), e.f ^= re, e.f |= te;
	var i = e.parent;
	i !== null && i.first !== null && zn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ mn(e);
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
		n && B(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Vn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
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
		e.f ^= ee, e.f & 1024 || (j(e, w), Vt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ mn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Gn = null, Kn = !1, qn = !1;
function Jn(e) {
	qn = e;
}
var V = null, Yn = !1;
function Xn(e) {
	V = e;
}
var H = null;
function Zn(e) {
	H = e;
}
var Qn = null;
function $n(e) {
	V !== null && (Qn ??= /* @__PURE__ */ new Set()).add(e);
}
var U = null, W = 0, er = null;
function tr(e) {
	er = e;
}
var nr = 1, rr = 0, ir = rr;
function ar(e) {
	ir = e;
}
function or() {
	return ++nr;
}
function sr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ce), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (sr(a) && Ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && j(e, C);
	}
	return !1;
}
function cr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Qn !== null && Qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? cr(a, t, !1) : t === a && (n ? j(a, w) : a.f & 1024 && j(a, T), Kt(a));
	}
}
function lr(e) {
	var t = U, n = W, r = er, i = V, a = Qn, o = A, s = Yn, c = ir, l = e.f;
	U = null, W = 0, er = null, V = l & 96 ? null : e, Qn = null, qe(e.ctx), Yn = !1, ir = ++rr, e.ac !== null && (ft(() => {
		e.ac.abort(be);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = e.deps, p = M?.is_fork;
		if (U !== null) {
			var m;
			if (p || dr(e, W), f !== null && W > 0) for (f.length = W + U.length, m = 0; m < U.length; m++) f[W + m] = U[m];
			else e.deps = f = U;
			if (Cn() && e.f & 512) for (m = W; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && W < f.length && (dr(e, W), f.length = W);
		if (Xe() && er !== null && !Yn && f !== null && !(e.f & 6146)) for (m = 0; m < er.length; m++) cr(er[m], e);
		if (i !== null && i !== e) {
			if (rr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = rr;
			if (t !== null) for (let e of t) e.rv = rr;
			er !== null && (r === null ? r = er : r.push(...er));
		}
		return e.f & 8388608 && (e.f ^= de), d;
	} catch (e) {
		return tt(e);
	} finally {
		e.f ^= le, U = t, W = n, er = r, V = i, Qn = a, qe(o), Yn = s, ir = c;
	}
}
function ur(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = l.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (U === null || !u.call(U, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512, o.f &= ~ce), o.v !== a && it(o), o.ac !== null && ft(() => {
			o.ac.abort(be), o.ac = null, j(o, w);
		}), kt(o), dr(o, 0);
	}
}
function dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ur(e, n[r]);
}
function fr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, C);
		var n = H, r = Kn;
		H = e, Kn = !(t & 96);
		try {
			t & 16777232 ? Ln(e) : In(e), Fn(e);
			var i = lr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = nr;
		} finally {
			Kn = r, H = n;
		}
	}
}
async function pr() {
	await Promise.resolve(), Ht();
}
function G(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), V !== null && !Yn && !(H !== null && H.f & 16384) && (Qn === null || !Qn.has(e))) {
		var n = V.deps;
		if (V.f & 2097152) e.rv < rr && (e.rv = rr, U === null && n !== null && n[W] === e ? W++ : U === null ? U = [e] : U.push(e));
		else {
			V.deps ??= [], u.call(V.deps, e) || V.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [V] : u.call(r, V) || r.push(V);
		}
	}
	if (qn && Xt.has(e)) return Xt.get(e);
	if (t) {
		var i = e;
		if (qn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || hr(i)) && (a = Dt(i)), Xt.set(i, a), a;
		}
		var o = !(i.f & 512) && !Yn && V !== null && (Kn || !!(V.f & 512)), s = (i.f & ne) === 0;
		sr(i) && (o && (i.f |= 512), Ot(i)), o && !s && (At(i), mr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (At(t), mr(t));
}
function hr(e) {
	if (e.v === a) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xt.has(t) || t.f & 2 && hr(t)) return !0;
	return !1;
}
function K(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
function q(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (fe in e) gr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && fe in n && gr(n);
		}
	}
}
function gr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			gr(e[n], t);
		} catch {}
		let n = _(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = m(n);
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
var _r = Symbol("events"), vr = /* @__PURE__ */ new Set(), yr = /* @__PURE__ */ new Set();
function br(e, t, n) {
	(t[_r] ??= {})[e] = n;
}
function xr(e) {
	for (var t = 0; t < e.length; t++) vr.add(e[t]);
	for (var n of yr) n(e);
}
var Sr = null;
function Cr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Sr = e;
	var o = 0, s = Sr === e && e[_r];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[_r] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		f(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = V, d = H;
		Xn(null), Zn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[_r]?.[r];
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
			e[_r] = t, delete e.currentTarget, Xn(u), Zn(d);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var wr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Tr(e) {
	return wr?.createHTML(e) ?? e;
}
function Er(e) {
	var t = vn("template");
	return t.innerHTML = Tr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Dr(e, t) {
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
		if (E) return Dr(D, null), D;
		i === void 0 && (i = Er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ pn(i)));
		var t = r || ln ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ pn(t), s = t.lastChild;
			Dr(o, s);
		} else Dr(t, t);
		return t;
	};
}
function Or() {
	if (E) return Dr(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = F();
	return e.append(t, n), Dr(t, n), e;
}
function Y(e, t) {
	if (E) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), Re();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var kr = ["touchstart", "touchmove"];
function Ar(e) {
	return kr.includes(e);
}
var jr = [
	"textarea",
	"script",
	"style",
	"title"
];
function Mr(e) {
	return jr.includes(e);
}
function X(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: n, props: r = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	fn();
	var l = void 0, u = On(() => {
		var s = n ?? t.appendChild(F());
		gt(s, { pending: () => {} }, (t) => {
			Je({});
			var n = A;
			if (o && (n.c = o), a && (r.$$events = a), E && Dr(t, null), l = e(t, r) || {}, E && (H.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw Pe(), i;
			Ye();
		}, c);
		var u = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = Ar(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Cr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(d(vr)), yr.add(f), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Cr), r.delete(e), r.size === 0 && Pr.delete(n)) : r.set(e, i);
			}
			yr.delete(f), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, u), l;
}
var Ir = /* @__PURE__ */ new WeakMap();
function Lr(e, t) {
	let n = Ir.get(e);
	return n ? (Ir.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Rr = class {
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
				r && (B(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Wn(r, t), t.append(F()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else B(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Bn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (B(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = _n();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = F();
			i.append(a), this.#n.set(e, {
				effect: Pn(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, Pn(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Z(e, t, n = !1) {
	var r;
	E && (r = D, Re());
	var i = new Rr(e), a = n ? ie : 0;
	function o(e, t) {
		if (E) {
			var n = Ve(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Be();
				O(a), i.anchor = a, Le(!1), i.ensure(e, t), Le(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Nn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function zr(e, t) {
	return t;
}
function Br(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Bn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Vr(e, d(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null;
		if (c) {
			var l = n, u = l.parentNode;
			gn(u), u.append(l), e.items.clear();
		}
		Vr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Vr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= se, Wn(a, document.createDocumentFragment())) : B(t[i], n);
	}
}
var Hr;
function Ur(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = E ? O(/* @__PURE__ */ pn(l)) : l.appendChild(F());
	}
	E && Re();
	var u = null, f = /* @__PURE__ */ Tt(() => {
		var e = n();
		return c(e) ? e : e == null ? [] : d(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = u, Gr(v, p, o, t, r), u !== null && (p.length === 0 ? u.f & 33554432 ? (u.f ^= se, qr(u, null, o)) : Hn(u) : Bn(u, () => {
			u = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Nn(() => {
			p = G(f);
			var e = p.length;
			let c = !1;
			E && Ve(o) === "[!" != (e === 0) && (o = Be(), O(o), Le(!1), c = !0);
			for (var l = /* @__PURE__ */ new Set(), d = M, v = _n(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (o = D, c = !0, Le(!1));
				var b = p[y], x = r(b, y), S = h ? null : s.get(x);
				S ? (S.v && en(S.v, b), S.i && en(S.i, y), v && d.unskip_effect(S.e)) : (S = Kr(s, h ? o : Hr ??= F(), b, x, y, i, t, n), h || (S.e.f |= se), s.set(x, S)), l.add(x);
			}
			if (e === 0 && a && !u && (h ? u = Pn(() => a(o)) : (u = Pn(() => a(Hr ??= F())), u.f |= se)), e > l.size && Ce("", "", ""), E && e > 0 && O(Be()), !h) if (m.set(d, l), v) {
				for (let [e, t] of s) l.has(e) || d.skip_effect(t.e);
				d.oncommit(g), d.ondiscard(_);
			} else g(d);
			c && Le(!0), G(f);
		}),
		flags: t,
		items: s,
		pending: m,
		outrogroups: null,
		fallback: u
	};
	h = !1, E && (o = D);
}
function Wr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Gr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Wr(e.effect.first), l, u = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Hn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= se, _ === c) qr(_, null, n);
		else {
			var y = u ? u.next : c;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Jr(e, u, _), Jr(e, _, y), qr(_, y, n), u = _, p = [], m = [], c = Wr(u.next);
			continue;
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					u = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) qr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					Jr(e, S.prev, C.next), Jr(e, u, S), Jr(e, C, b), c = b, u = C, --v, p = [], m = [];
				} else l.delete(_), qr(_, c, n), Jr(e, _.prev, _.next), Jr(e, _, u === null ? e.effect.first : u.next), Jr(e, u, _), u = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Wr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), u = _, c = Wr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Vr(e, d(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var w = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || w.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && w.push(c), c = Wr(c.next);
		var T = w.length;
		if (T > 0) {
			var ee = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Br(e, w, ee);
		}
	}
	a && $e(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Kr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ N(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
	return {
		v: c,
		i: l,
		e: Pn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function qr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ mn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Jr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function Yr(e, t, n, r, i, a) {
	let o = E;
	E && Re();
	var c = null;
	E && D.nodeType === 1 && (c = D, Re());
	var l = E ? D : e, u = new Rr(l, !1);
	Nn(() => {
		let e = t() || null;
		var a = i ? i() : n || e === "svg" ? s : void 0;
		if (e === null) {
			u.ensure(null, null);
			return;
		}
		return u.ensure(e, (t) => {
			if (e) {
				if (c = E ? c : vn(e, a), Dr(c, c), r) {
					var n = null;
					E && Mr(e) && c.append(n = document.createComment(""));
					var i = E ? /* @__PURE__ */ pn(c) : c.appendChild(F());
					E && (i === null ? Le(!1) : O(i)), r(c, i), n?.remove();
				}
				H.nodes.end = c, t.before(c);
			}
			E && O(t);
		}), () => {};
	}, ie), wn(() => {}), o && (Le(!0), O(l));
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Xr = [..." 	\n\r\f\xA0\v﻿"];
function Zr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Xr.includes(r[o - 1])) && (s === r.length || Xr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Qr(e, t, n, r, i, a) {
	var o = e[ge];
	if (E || o !== n || o === void 0) {
		var s = Zr(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ge] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function $r(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!c(t)) return Fe();
		for (var r of e.options) r.selected = t.includes(ni(r));
		return;
	}
	for (r of e.options) if (sn(ni(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function ei(e) {
	var t = new MutationObserver(() => {
		"__value" in e && $r(e, e.__value);
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), wn(() => {
		t.disconnect();
	});
}
function ti(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	pt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), ni);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && ni(o);
		}
		n(a), e.__value = a, M !== null && r.add(M);
	}), kn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = M;
			if (r.has(o)) return;
		}
		if ($r(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = ni(s), n(a));
		}
		e.__value = a, i = !1;
	}), ei(e);
}
function ni(e) {
	return "__value" in e ? e.__value : e.value;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ri = Symbol("is custom element"), ii = Symbol("is html"), ai = xe ? "link" : "LINK", oi = xe ? "progress" : "PROGRESS";
function si(e) {
	if (E) {
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
		e[ye] = n, $e(n), dt();
	}
}
function ci(e, t) {
	var n = li(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === oi) && (e.value = t ?? "");
}
function Q(e, t, n, r) {
	var i = li(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ai) || i[t] !== (i[t] = n) && (t === "loading" && (e[me] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && di(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function li(e) {
	return e[he] ??= {
		[ri]: e.nodeName.includes("-"),
		[ii]: e.namespaceURI === o
	};
}
var ui = /* @__PURE__ */ new Map();
function di(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ui.get(t);
	if (n) return n;
	ui.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = m(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = _(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function fi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	pt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = mi(e) ? hi(a) : a, n(a), M !== null && r.add(M), await pr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (E && e.defaultValue !== e.value || K(t) == null && e.value) && (n(mi(e) ? hi(e.value) : e.value), M !== null && r.add(M)), Mn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = M;
			if (r.has(i)) return;
		}
		mi(e) && n === hi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function pi(e, t, n = t) {
	pt(e, "change", (t) => {
		n(t ? e.defaultChecked : e.checked);
	}), (E && e.defaultChecked !== e.checked || K(t) == null) && n(e.checked), Mn(() => {
		e.checked = !!t();
	});
}
function mi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function hi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function gi(e = !1) {
	let t = A, n = t.l.u;
	if (!n) return;
	let r = () => q(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ St(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => G(i);
	}
	n.b.length && Dn(() => {
		_i(t, r), x(n.b);
	}), Tn(() => {
		let e = K(() => n.m.map(b));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Tn(() => {
		_i(t, r), x(n.a);
	});
}
function _i(e, t) {
	if (e.l.s) for (let t of e.l.s) G(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function $(e, t, n, r) {
	var i = !Ge || !!(n & 2), a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ St(r), G(l)) : (c && (c = !1, s = o ? K(r) : r), s);
	let d;
	if (a) {
		var f = fe in e || pe in e;
		d = p(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = ct(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Oe(t), d(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (d) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && d(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? St : Tt)(() => (v = !1, g()));
	a && G(y);
	var b = H;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? G(y) : i && a ? an(e) : e;
			return P(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return qn && v || b.f & 16384 ? y.v : G(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5"), Ke();
//#endregion
//#region experiments/editor-svelte-spike/src/DeveloperDetails.svelte
var vi = /* @__PURE__ */ J("<span class=\"developer-expand-hint\">展開作法與方向</span>"), yi = /* @__PURE__ */ J("<span class=\"developer-next-label\">Next Step :</span> <span class=\"developer-next-action\"> </span> <!>", 1), bi = /* @__PURE__ */ J("<li> </li>"), xi = /* @__PURE__ */ J("<section class=\"detail-section next-steps\"><h4 class=\"detail-heading\">後續動作</h4> <ul class=\"detail-list\"></ul></section>"), Si = /* @__PURE__ */ J("<section class=\"detail-section blockers\"><h4 class=\"detail-heading\">Blockers</h4> <ul class=\"detail-list\"></ul></section>"), Ci = /* @__PURE__ */ J("<code class=\"reference\"> </code>"), wi = /* @__PURE__ */ J("<article class=\"decision-item\"><p> </p> <!></article>"), Ti = /* @__PURE__ */ J("<section class=\"detail-section\"><h4 class=\"detail-heading\">Decisions</h4> <div class=\"decision-list\"></div></section>"), Ei = /* @__PURE__ */ J("<p> </p>"), Di = /* @__PURE__ */ J("<article class=\"route-item\"><div class=\"route-heading\"><strong> </strong> <span> </span></div> <!></article>"), Oi = /* @__PURE__ */ J("<section class=\"detail-section\"><h4 class=\"detail-heading\">Routes</h4> <div class=\"route-list\"></div></section>"), ki = /* @__PURE__ */ J("<div class=\"path-list\"></div>"), Ai = /* @__PURE__ */ J("<section class=\"detail-section claim-section\"><h4 class=\"detail-heading\">Claim</h4> <p> </p> <!> <!></section>"), ji = /* @__PURE__ */ J("<div class=\"developer-body\"><h4 class=\"developer-body-title\">作法與方向</h4> <!> <!> <!> <!> <!></div>"), Mi = /* @__PURE__ */ J("<!> <!>", 1);
function Ni(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "developer", 8, null);
	R(() => q(o()), () => {
		P(n, o()?.next_steps ?? []);
	}), R(() => (q(o()), G(n)), () => {
		P(r, o()?.next_step ?? G(n)[0] ?? "尚未指定下一步");
	}), R(() => (q(o()), G(n)), () => {
		P(i, o()?.next_step ? G(n) : G(n).slice(1));
	}), R(() => (G(i), q(o())), () => {
		P(a, !!(G(i).length || o()?.blockers?.length || o()?.decisions?.length || o()?.routes?.length || o()?.claim));
	}), An(), gi();
	var s = Or(), c = hn(s), l = (e) => {
		var t = Or();
		Yr(hn(t), () => G(a) ? "details" : "section", !1, (e, t) => {
			Qr(e, 0, "developer-details");
			var n = Mi(), s = hn(n);
			Yr(s, () => G(a) ? "summary" : "div", !1, (e, t) => {
				Qr(e, 0, "developer-summary");
				var n = yi(), i = L(hn(n), 2), o = I(i, !0);
				k(i);
				var s = L(i, 2), c = (e) => {
					Y(e, vi());
				};
				Z(s, (e) => {
					G(a) && e(c);
				}), z(() => X(o, G(r))), Y(t, n);
			});
			var c = L(s, 2), l = (e) => {
				var t = ji(), n = L(I(t), 2), r = (e) => {
					var t = xi(), n = L(I(t), 2);
					Ur(n, 5, () => G(i), zr, (e, t) => {
						var n = bi(), r = I(n, !0);
						k(n), z(() => X(r, G(t))), Y(e, n);
					}), k(n), k(t), Y(e, t);
				};
				Z(n, (e) => {
					G(i), K(() => G(i).length) && e(r);
				});
				var a = L(n, 2), s = (e) => {
					var t = Si(), n = L(I(t), 2);
					Ur(n, 5, () => (q(o()), K(() => o().blockers)), zr, (e, t) => {
						var n = bi(), r = I(n, !0);
						k(n), z(() => X(r, G(t))), Y(e, n);
					}), k(n), k(t), Y(e, t);
				};
				Z(a, (e) => {
					q(o()), K(() => o().blockers?.length) && e(s);
				});
				var c = L(a, 2), l = (e) => {
					var t = Ti(), n = L(I(t), 2);
					Ur(n, 5, () => (q(o()), K(() => o().decisions)), zr, (e, t) => {
						var n = wi(), r = I(n), i = I(r, !0);
						k(r);
						var a = L(r, 2), o = (e) => {
							var n = Ci(), r = I(n, !0);
							k(n), z(() => X(r, (G(t), K(() => G(t).reference)))), Y(e, n);
						};
						Z(a, (e) => {
							G(t), K(() => G(t).reference) && e(o);
						}), k(n), z(() => X(i, (G(t), K(() => G(t).summary)))), Y(e, n);
					}), k(n), k(t), Y(e, t);
				};
				Z(c, (e) => {
					q(o()), K(() => o().decisions?.length) && e(l);
				});
				var u = L(c, 2), d = (e) => {
					var t = Oi(), n = L(I(t), 2);
					Ur(n, 5, () => (q(o()), K(() => o().routes)), zr, (e, t) => {
						var n = Di(), r = I(n), i = I(r), a = I(i, !0);
						k(i);
						var o = L(i, 2), s = I(o, !0);
						k(o), k(r);
						var c = L(r, 2), l = (e) => {
							var n = Ei(), r = I(n, !0);
							k(n), z(() => X(r, (G(t), K(() => G(t).reason)))), Y(e, n);
						};
						Z(c, (e) => {
							G(t), K(() => G(t).reason) && e(l);
						}), k(n), z(() => {
							X(a, (G(t), K(() => G(t).title))), Qr(o, 1, (G(t), K(() => `route-state route-${G(t).state}`))), X(s, (G(t), K(() => G(t).state)));
						}), Y(e, n);
					}), k(n), k(t), Y(e, t);
				};
				Z(u, (e) => {
					q(o()), K(() => o().routes?.length) && e(d);
				});
				var f = L(u, 2), p = (e) => {
					var t = Ai(), n = L(I(t), 2), r = I(n);
					k(n);
					var i = L(n, 2), a = (e) => {
						var t = Ei(), n = I(t);
						k(t), z(() => X(n, `Worktree: ${q(o()), K(() => o().claim.worktree) ?? ""}`)), Y(e, t);
					};
					Z(i, (e) => {
						q(o()), K(() => o().claim.worktree) && e(a);
					});
					var s = L(i, 2), c = (e) => {
						var t = ki();
						Ur(t, 5, () => (q(o()), K(() => o().claim.source_paths)), zr, (e, t) => {
							var n = Ci(), r = I(n, !0);
							k(n), z(() => X(r, G(t))), Y(e, n);
						}), k(t), Y(e, t);
					};
					Z(s, (e) => {
						q(o()), K(() => o().claim.source_paths?.length) && e(c);
					}), k(t), z(() => X(r, `Agent: ${q(o()), K(() => o().claim.agent) ?? ""}`)), Y(e, t);
				};
				Z(f, (e) => {
					q(o()), K(() => o().claim) && e(p);
				}), k(t), Y(e, t);
			};
			Z(c, (e) => {
				G(a) && e(l);
			}), Y(t, n);
		}), Y(e, t);
	};
	Z(c, (e) => {
		o() && e(l);
	}), Y(e, s), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/ItemRow.svelte
var Pi = /* @__PURE__ */ J("<option> </option>"), Fi = /* @__PURE__ */ J("<span class=\"spike-time-capsule\"> </span>"), Ii = /* @__PURE__ */ J("<p class=\"spike-field-error\" role=\"alert\"> </p>"), Li = /* @__PURE__ */ J("<details class=\"spike-estimate-editor\"><summary><span>人工工時與依據</span> <small> </small></summary> <div class=\"spike-estimate-fields\"><label><span>工時（hr）</span> <input type=\"number\" min=\"0.02\" step=\"0.25\"/></label> <label class=\"spike-estimate-note\"><span>人工依據</span> <input maxlength=\"1000\" placeholder=\"例如：已拆解三個步驟\"/></label> <label class=\"spike-estimate-confirmation\"><input type=\"checkbox\"/> <span>人工確認此工時</span></label> <p class=\"spike-estimate-contract\">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p> <button type=\"button\">套用工時草稿</button> <!></div></details>"), Ri = /* @__PURE__ */ J("<input class=\"inline-edit-input\" maxlength=\"500\"/> <select class=\"inline-priority-select\"></select> <!> <button class=\"inline-delete-button\" type=\"button\">刪除</button> <!>", 1), zi = /* @__PURE__ */ J("<span> </span>"), Bi = /* @__PURE__ */ J("<span class=\"spike-item-title\"> </span> <!> <!>", 1), Vi = /* @__PURE__ */ J("<li><!></li>");
function Hi(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = $(t, "taskId", 8), o = $(t, "field", 8), s = $(t, "item", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "timeItem", 8, null), f = $(t, "activeEstimate", 8, null), p = $(t, "onManualEstimate", 8, null), m = /* @__PURE__ */ N(f() ? String(f().likely_minutes / 60) : d() ? String(d().likely_minutes / 60) : ""), h = /* @__PURE__ */ N(f()?.human_note ?? ""), g = /* @__PURE__ */ N(!!f()?.human_confirmed), _ = /* @__PURE__ */ N("");
	function v() {
		let e = Number(G(m));
		if (!Number.isFinite(e) || e <= 0) {
			P(_, "工時必須大於 0。");
			return;
		}
		let t = p()?.({
			taskId: a(),
			itemId: s().id,
			likelyMinutes: Math.round(e * 60),
			humanNote: G(h),
			humanConfirmed: G(g)
		});
		P(_, t?.error ?? "");
	}
	R(() => (q(l()), q(s())), () => {
		P(n, l().metadata(s().priority));
	}), R(() => (q(l()), q(s())), () => {
		P(r, l().format(s().priority));
	}), R(() => q(d()), () => {
		P(i, d() ? `${Number(d().display_hours).toLocaleString(void 0, { maximumFractionDigits: 2 })}h` : "");
	}), An(), gi();
	var y = Vi();
	let b;
	var x = I(y), S = (e) => {
		var t = Ri(), n = hn(t);
		si(n);
		var r = L(n, 2);
		Ur(r, 5, () => (q(l()), K(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Pi(), r = I(n, !0);
			k(n);
			var i = {};
			z((e) => {
				X(r, e), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
			}, [() => (q(l()), G(t), K(() => l().format(G(t).value)))]), Y(e, n);
		}), k(r);
		var c;
		ei(r);
		var f = L(r, 2), y = (e) => {
			var t = Fi(), n = I(t, !0);
			k(t), z(() => {
				Q(t, "title", (q(d()), K(() => `目前分析：${d().likely_minutes} 分鐘`))), X(n, G(i));
			}), Y(e, t);
		};
		Z(f, (e) => {
			d() && e(y);
		});
		var b = L(f, 2), x = L(b, 2), S = (e) => {
			var t = Li(), n = I(t), r = L(I(n), 2), i = I(r, !0);
			k(r), k(n);
			var a = L(n, 2), o = I(a), c = L(I(o), 2);
			si(c), k(o);
			var l = L(o, 2), u = L(I(l), 2);
			si(u), k(l);
			var d = L(l, 2), f = I(d);
			si(f), ze(2), k(d);
			var p = L(d, 4), y = L(p, 2), b = (e) => {
				var t = Ii(), n = I(t, !0);
				k(t), z(() => X(n, G(_))), Y(e, t);
			};
			Z(y, (e) => {
				G(_) && e(b);
			}), k(a), k(t), z(() => {
				X(i, G(g) ? "已確認" : "未確認"), Q(c, "aria-label", (q(s()), K(() => `「${s().title}」人工工時（hr）`))), Q(u, "aria-label", (q(s()), K(() => `「${s().title}」人工依據`))), Q(f, "aria-label", (q(s()), K(() => `確認「${s().title}」的人工估算`))), Q(p, "aria-label", (q(s()), K(() => `套用「${s().title}」人工估算草稿`)));
			}), fi(c, () => G(m), (e) => P(m, e)), fi(u, () => G(h), (e) => P(h, e)), pi(f, () => G(g), (e) => P(g, e)), br("click", p, v), Y(e, t);
		};
		Z(x, (e) => {
			p() && e(S);
		}), z(() => {
			Q(n, "aria-label", (q(s()), K(() => `編輯子項目：${s().title}`))), ci(n, (q(s()), K(() => s().title))), Q(r, "aria-label", (q(s()), K(() => `設定「${s().title}」的優先級`))), c !== (c = (q(s()), K(() => s().priority))) && (r.value = (r.__value = (q(s()), K(() => s().priority))) ?? "", $r(r, (q(s()), K(() => s().priority)))), Q(b, "aria-label", (q(s()), K(() => `刪除子項目：${s().title}`)));
		}), br("input", n, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "title",
			value: e.currentTarget.value
		})), br("change", r, (e) => u()({
			type: "set-item-field",
			taskId: a(),
			field: o(),
			itemId: s().id,
			property: "priority",
			value: Number(e.currentTarget.value)
		})), br("click", b, () => u()({
			type: "delete-item",
			taskId: a(),
			field: o(),
			itemId: s().id
		})), Y(e, t);
	}, C = (e) => {
		var t = Bi(), a = hn(t), o = I(a, !0);
		k(a);
		var c = L(a, 2), u = (e) => {
			var t = zi(), i = I(t, !0);
			k(t), z(() => {
				Qr(t, 1, (G(n), K(() => `priority-badge priority-${G(n).tone}`))), X(i, G(r));
			}), Y(e, t);
		};
		Z(c, (e) => {
			G(n), q(l()), K(() => G(n) && (!G(n).hidden || !l().labelsValid)) && e(u);
		});
		var f = L(c, 2), p = (e) => {
			var t = Fi(), n = I(t, !0);
			k(t), z(() => {
				Q(t, "title", (q(d()), K(() => `目前分析：${d().likely_minutes} 分鐘`))), X(n, G(i));
			}), Y(e, t);
		};
		Z(f, (e) => {
			d() && e(p);
		}), z(() => X(o, (q(s()), K(() => s().title)))), Y(e, t);
	};
	Z(x, (e) => {
		c() ? e(S) : e(C, -1);
	}), k(y), z(() => b = Qr(y, 1, "editor-item-row", null, b, {
		"editable-work-item": c(),
		"has-estimate-editor": c() && p()
	})), Y(e, y), Ye();
}
xr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskCard.svelte
var Ui = /* @__PURE__ */ J("<option> </option>"), Wi = /* @__PURE__ */ J("<select class=\"inline-status-select\"></select> <select class=\"inline-priority-select\"></select>", 1), Gi = /* @__PURE__ */ J("<span> </span>"), Ki = /* @__PURE__ */ J("<input class=\"task-title-input\" aria-label=\"任務名稱\" maxlength=\"160\"/>"), qi = /* @__PURE__ */ J("<h3> </h3>"), Ji = /* @__PURE__ */ J("<textarea class=\"task-summary-input\" aria-label=\"任務描述\" maxlength=\"1000\" rows=\"3\"></textarea>"), Yi = /* @__PURE__ */ J("<p class=\"task-summary\"> </p>"), Xi = /* @__PURE__ */ J("<section><h4 class=\"detail-heading\"> </h4> <ul class=\"detail-list\"></ul></section>"), Zi = /* @__PURE__ */ J("<div class=\"spike-add-form\"><input aria-label=\"新增子項目描述\" placeholder=\"新增待處理項目\" maxlength=\"500\"/> <select aria-label=\"新增子項目優先級\"></select> <button type=\"button\">新增</button> <button type=\"button\">取消</button> <p class=\"spike-field-error\" role=\"alert\"> </p></div>"), Qi = /* @__PURE__ */ J("<button class=\"spike-add-button\" type=\"button\">＋</button>"), $i = /* @__PURE__ */ J("<div class=\"spike-add-shell\"><!></div>"), ea = /* @__PURE__ */ J("<article><header class=\"task-header\"><div class=\"task-title-group\"><div class=\"time-task-status-line\"><span> </span> <!></div> <div class=\"time-task-title-line\"><!> <span class=\"task-duration\"> </span></div></div> <div class=\"task-header-meta\"><strong class=\"task-fraction\"> </strong> <code class=\"task-id\"> </code></div></header> <!> <!> <div class=\"work-columns\"><!> <section class=\"task-adder-section\"><!></section></div></article>");
function ta(e, t) {
	Je(t, !1);
	let n = /* @__PURE__ */ N(), r = /* @__PURE__ */ N(), i = /* @__PURE__ */ N(), a = /* @__PURE__ */ N(), o = $(t, "task", 8), s = $(t, "progress", 8), c = $(t, "editing", 8), l = $(t, "policy", 8), u = $(t, "onCommand", 8), d = $(t, "onAddItem", 8);
	$(t, "timeTask", 8, null);
	let f = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), p = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), m = $(t, "onManualEstimate", 8, null), h = $(t, "statusOrder", 24, () => ["done", "planned"]), g = $(t, "taskDuration", 8, null), _ = [
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
	], v = /* @__PURE__ */ N(!1), y = /* @__PURE__ */ N(""), b = /* @__PURE__ */ N(l().creationDefaultValue), x = /* @__PURE__ */ N("");
	function S() {
		P(v, !1), P(y, ""), P(b, l().creationDefaultValue), P(x, "");
	}
	function C() {
		let e = d()(G(y), Number(G(b)));
		P(x, e.error), G(x) || S();
	}
	R(() => q(o()), () => {
		P(n, [{
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
	}), R(() => (G(n), q(h())), () => {
		P(r, [...G(n)].sort((e, t) => {
			let n = h().indexOf(e.status), r = h().indexOf(t.status);
			return (n < 0 ? h().length : n) - (r < 0 ? h().length : r);
		}));
	}), R(() => (q(l()), q(o())), () => {
		P(i, l().metadata(o().priority));
	}), R(() => q(o()), () => {
		P(a, _.find((e) => e.value === o().status) ?? {
			label: o().status,
			tone: "muted"
		});
	}), R(() => (q(c()), G(v)), () => {
		!c() && G(v) && S();
	}), An(), gi();
	var w = ea(), T = I(w), ee = I(T), te = I(ee), ne = I(te), re = I(ne, !0);
	k(ne);
	var ie = L(ne, 2), ae = (e) => {
		var t = Wi(), n = hn(t);
		Ur(n, 5, () => _, (e) => e.value, (e, t) => {
			var n = Ui(), r = I(n, !0);
			k(n);
			var i = {};
			z(() => {
				X(r, (G(t), K(() => G(t).label))), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
			}), Y(e, n);
		}), k(n);
		var r;
		ei(n);
		var i = L(n, 2);
		Ur(i, 5, () => (q(l()), K(() => l().levels)), (e) => e.value, (e, t) => {
			var n = Ui(), r = I(n, !0);
			k(n);
			var i = {};
			z((e) => {
				X(r, e), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
			}, [() => (q(l()), G(t), K(() => l().format(G(t).value)))]), Y(e, n);
		}), k(i);
		var a;
		ei(i), z(() => {
			Q(n, "aria-label", (q(o()), K(() => `${o().title} 狀態`))), r !== (r = (q(o()), K(() => o().status))) && (n.value = (n.__value = (q(o()), K(() => o().status))) ?? "", $r(n, (q(o()), K(() => o().status)))), Q(i, "aria-label", (q(o()), K(() => `${o().title} 優先級`))), a !== (a = (q(o()), K(() => o().priority))) && (i.value = (i.__value = (q(o()), K(() => o().priority))) ?? "", $r(i, (q(o()), K(() => o().priority))));
		}), br("change", n, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "status",
			value: e.currentTarget.value
		})), br("change", i, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "priority",
			value: Number(e.currentTarget.value)
		})), Y(e, t);
	}, oe = (e) => {
		var t = Gi(), n = I(t, !0);
		k(t), z((e, r, a) => {
			Qr(t, 1, (G(i), K(() => `task-priority-badge priority-badge priority-${G(i).tone}`))), Q(t, "title", e), Q(t, "aria-label", r), X(n, a);
		}, [
			() => (q(l()), q(o()), K(() => `${l().format(o().priority)}；同一狀態內依優先級排序`)),
			() => (q(l()), q(o()), K(() => `優先級：${l().format(o().priority)}`)),
			() => (q(l()), q(o()), K(() => l().format(o().priority)))
		]), Y(e, t);
	};
	Z(ie, (e) => {
		c() ? e(ae) : (G(i), q(l()), K(() => G(i) && (!G(i).hidden || !l().labelsValid)) && e(oe, 1));
	}), k(te);
	var se = L(te, 2), ce = I(se), le = (e) => {
		var t = Ki();
		si(t), z(() => {
			Q(t, "id", (q(o()), K(() => `task-${o().id}-title`))), ci(t, (q(o()), K(() => o().title)));
		}), br("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "title",
			value: e.currentTarget.value
		})), Y(e, t);
	}, ue = (e) => {
		var t = qi(), n = I(t, !0);
		k(t), z(() => {
			Q(t, "id", (q(o()), K(() => `task-${o().id}-title`))), X(n, (q(o()), K(() => o().title)));
		}), Y(e, t);
	};
	Z(ce, (e) => {
		c() ? e(le) : e(ue, -1);
	});
	var de = L(ce, 2), fe = I(de, !0);
	k(de), k(se), k(ee);
	var pe = L(ee, 2), me = I(pe), he = I(me);
	k(me);
	var ge = L(me, 2), _e = I(ge, !0);
	k(ge), k(pe), k(T);
	var ve = L(T, 2), ye = (e) => {
		var t = Ji();
		lt(t), z(() => ci(t, (q(o()), K(() => o().summary)))), br("input", t, (e) => u()({
			type: "set-task-field",
			taskId: o().id,
			field: "summary",
			value: e.currentTarget.value
		})), Y(e, t);
	}, be = (e) => {
		var t = Yi(), n = I(t, !0);
		k(t), z(() => X(n, (q(o()), K(() => o().summary)))), Y(e, t);
	};
	Z(ve, (e) => {
		c() ? e(ye) : e(be, -1);
	});
	var xe = L(ve, 2);
	{
		let e = /* @__PURE__ */ Tt(() => (q(o()), K(() => o().developer ?? null)));
		Ni(xe, { get developer() {
			return G(e);
		} });
	}
	var Se = L(xe, 2), Ce = I(Se);
	Ur(Ce, 1, () => G(r), (e) => e.status, (e, t) => {
		var n = Or(), r = hn(n), i = (e) => {
			var n = Xi(), r = I(n), i = I(r, !0);
			k(r);
			var a = L(r, 2);
			Ur(a, 5, () => (G(t), K(() => G(t).items)), (e) => e.id, (e, n) => {
				{
					let r = /* @__PURE__ */ Tt(() => (q(f()), G(n), K(() => f().get(G(n).id) ?? null))), i = /* @__PURE__ */ Tt(() => (q(p()), G(n), K(() => p().get(G(n).id) ?? null)));
					Hi(e, {
						get taskId() {
							return q(o()), K(() => o().id);
						},
						get field() {
							return G(t), K(() => G(t).field);
						},
						get item() {
							return G(n);
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
							return G(r);
						},
						get activeEstimate() {
							return G(i);
						},
						get onManualEstimate() {
							return m();
						}
					});
				}
			}), k(a), k(n), z(() => {
				Qr(n, 1, (G(t), K(() => `detail-section ${G(t).className}`))), X(i, (G(t), K(() => G(t).title)));
			}), Y(e, n);
		};
		Z(r, (e) => {
			G(t), q(c()), K(() => G(t).items.length || c()) && e(i);
		}), Y(e, n);
	});
	var we = L(Ce, 2), Te = I(we), Ee = (e) => {
		var t = $i(), n = I(t), r = (e) => {
			var t = Zi(), n = I(t);
			si(n);
			var r = L(n, 2);
			Ur(r, 5, () => (q(l()), K(() => l().levels)), (e) => e.value, (e, t) => {
				var n = Ui(), r = I(n, !0);
				k(n);
				var i = {};
				z((e) => {
					X(r, e), i !== (i = (G(t), K(() => G(t).value))) && (n.value = (n.__value = (G(t), K(() => G(t).value))) ?? "");
				}, [() => (q(l()), G(t), K(() => l().format(G(t).value)))]), Y(e, n);
			}), k(r);
			var i = L(r, 2), a = L(i, 2), o = L(a, 2), s = I(o, !0);
			k(o), k(t), z(() => {
				Q(o, "hidden", !G(x)), X(s, G(x));
			}), br("keydown", n, (e) => {
				e.key === "Enter" && C(), e.key === "Escape" && S();
			}), fi(n, () => G(y), (e) => P(y, e)), ti(r, () => G(b), (e) => P(b, e)), br("click", i, C), br("click", a, S), Y(e, t);
		}, i = (e) => {
			var t = Qi();
			z(() => Q(t, "aria-label", (q(o()), K(() => `在「${o().title}」新增子項目`)))), br("click", t, () => {
				P(v, !0);
			}), Y(e, t);
		};
		Z(n, (e) => {
			G(v) ? e(r) : e(i, -1);
		}), k(t), Y(e, t);
	};
	Z(Te, (e) => {
		c() && e(Ee);
	}), k(we), k(Se), k(w), z(() => {
		Qr(w, 1, (G(a), K(() => `task-card editor-task-card status-${G(a).tone}`))), Q(w, "aria-labelledby", (q(o()), K(() => `task-${o().id}-title`))), Qr(ne, 1, (G(a), K(() => `status-badge status-${G(a).tone}`))), X(re, (G(a), K(() => G(a).label))), Q(de, "hidden", !g()), X(fe, g() ? `約需 ${g()}` : ""), Q(me, "aria-label", (q(s()), K(() => `子項目完成 ${s().completed}，共 ${s().total}`))), X(he, `${q(s()), K(() => s().completed) ?? ""} / ${q(s()), K(() => s().total) ?? ""}`), X(_e, (q(o()), K(() => o().id)));
	}), Y(e, w), Ye();
}
xr([
	"change",
	"input",
	"keydown",
	"click"
]);
//#endregion
//#region experiments/editor-svelte-spike/src/TaskList.svelte
var na = /* @__PURE__ */ J("<p class=\"empty-state\"> </p>");
function ra(e, t) {
	Je(t, !1);
	let n = $(t, "tasks", 24, () => []), r = $(t, "progress", 24, () => ({})), i = $(t, "editing", 8, !1), a = $(t, "policy", 8), o = $(t, "onCommand", 8, () => {}), s = $(t, "onAddItem", 8, () => {}), c = $(t, "timeTasks", 24, () => /* @__PURE__ */ new Map()), l = $(t, "timeItems", 24, () => /* @__PURE__ */ new Map()), u = $(t, "activeEstimates", 24, () => /* @__PURE__ */ new Map()), d = $(t, "onManualEstimate", 8, null), f = $(t, "emptyLabel", 8, "沒有符合目前篩選的工作項目。");
	gi();
	var p = Or(), m = hn(p), h = (e) => {
		var t = Or();
		Ur(hn(t), 1, n, (e) => e.id, (e, t) => {
			{
				let n = /* @__PURE__ */ Tt(() => (q(c()), G(t), K(() => c().get(G(t).id) ?? null)));
				ta(e, {
					get task() {
						return G(t);
					},
					get progress() {
						return q(r()), G(t), K(() => r()[G(t).id]);
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
					onAddItem: (e, n) => s()(G(t).id, e, n),
					get timeTask() {
						return G(n);
					},
					get timeItems() {
						return l();
					},
					get activeEstimates() {
						return u();
					},
					get onManualEstimate() {
						return d();
					}
				});
			}
		}), Y(e, t);
	}, g = (e) => {
		var t = na(), n = I(t, !0);
		k(t), z(() => X(n, f())), Y(e, t);
	};
	Z(m, (e) => {
		q(n()), K(() => n().length) ? e(h) : e(g, -1);
	}), Y(e, p), Ye();
}
//#endregion
//#region experiments/editor-svelte-spike/src/viewer-ui.js
r({
	id: "svelte",
	mount(e, t) {
		let n = an({ ...t });
		return {
			component: Nr(ra, {
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
		Lr(e.component);
	}
});
//#endregion
