var p = Object.defineProperty;
var h = (o, t, r) => t in o ? p(o, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : o[t] = r;
var c = (o, t, r) => h(o, typeof t != "symbol" ? t + "" : t, r);
module.exports = { default: m };
class f {
  constructor(t = {}) {
    c(this, "options");
    this.options = {
      decimalSeparator: t.decimalSeparator ?? ".",
      thousandsSeparator: t.thousandsSeparator ?? "",
      fractionDigits: t.fractionDigits ?? 0,
      min: t.min ?? -1 / 0,
      max: t.max ?? 1 / 0
    };
  }
  format(t) {
    const { decimalSeparator: r, thousandsSeparator: e, fractionDigits: a } = this.options, n = t.toFixed(a).split(".");
    return n[0] = n[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      e ?? ""
    ), n.join(r);
  }
  parse(t) {
    const { decimalSeparator: r, thousandsSeparator: e } = this.options, a = t.trim();
    if (!new RegExp(
      `^[-]?[\\d${r}${e}]*$`,
      "g"
    ).test(a))
      return null;
    const n = a.replace(e, "").replace(r, ".");
    if (n === "")
      return null;
    const l = parseFloat(n);
    return isNaN(l) ? null : l;
  }
}
class d {
  processString(t) {
    let r = t;
    if (/\(/.test(t)) {
      let e = 0, a = -1, s = 0;
      for (; s < t.length; ) {
        const n = t[s];
        if (n === "(")
          a === -1 && (a = s), e++;
        else if (n === ")" && (e--, e === 0)) {
          const l = t.slice(a + 1, s), u = this.processString(l).toString();
          r = r.replace(`(${l})`, u), a = -1;
        }
        s++;
      }
    }
    return this.evaluate(this.processPercent(r)) ?? 0;
  }
  processPercent(t) {
    const r = /^(.*?)([+\-])(\d+(?:\.\d+)?%(?!\d))/;
    let e = t;
    for (; r.test(e); ) {
      const a = r.exec(e);
      if (!a)
        break;
      const [s, n] = a;
      /^-?\d+(?:\.\d+)?$/.test(n) ? e = e.replace(s, this.evaluate(s).toString()) : (e = e.replace(n, this.evaluate(n).toString()), e = this.processPercent(e));
    }
    return e;
  }
  evaluate(t) {
    return t = t.replace(/\*\*/g, "^"), t = t.replace(
      /(^-?\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g,
      "($1*0.01*$2)"
    ), t = t.replace(
      /(^-?\d+(?:\.\d+)?)([+\-])(\d+(?:\.\d+)?)%/g,
      "($1$2($1*$3*0.01))"
    ), t = t.replace(
      /(^-?\d+(?:\.\d+)?)(\/)(\d+(?:\.\d+)?)%/g,
      "$1$2($3*0.01)"
    ), t = t.replace(/(\d+(?:\.\d+)?)%/g, "($1*0.01)"), t = t.replace(/%/g, "*0.01"), this.evaluatePostfix(this.infixToPostfix(t));
  }
  infixToPostfix(t) {
    const r = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }, e = [], a = [];
    let s = [], n = null;
    const l = () => {
      s.length && (a.push(s.join("")), s = []);
    }, u = (i) => {
      if (l(), i === "(")
        e.push(i), n = null;
      else if (i === ")") {
        for (; e.length && e[e.length - 1] !== "("; )
          a.push(e.pop());
        e.length && e.pop();
      } else if (i === "-" && (n === null || n === "(" || n in r))
        s.push(i);
      else {
        for (; e.length && r[i] <= r[e[e.length - 1]]; )
          a.push(e.pop());
        e.push(i);
      }
      n = i;
    };
    for (const i of t)
      /[\d\.]/.test(i) ? (s.push(i), n = i) : (i in r || i === "(" || i === ")") && u(i);
    for (l(); e.length; )
      a.push(e.pop());
    return a;
  }
  evaluatePostfix(t) {
    let r = [];
    if (t.forEach((e) => {
      if (/^-?\d+(?:\.\d+)?$/.test(e))
        r.push(parseFloat(e));
      else {
        if (r.length < 2)
          throw new Error("Invalid expression");
        const a = r.pop(), s = r.pop();
        switch (e) {
          case "+":
            r.push(s + a);
            break;
          case "-":
            r.push(s - a);
            break;
          case "*":
            r.push(s * a);
            break;
          case "/":
            r.push(s / a);
            break;
          case "^":
            r.push(s ** a);
            break;
        }
      }
    }), r.length !== 1)
      throw new Error("Invalid expression");
    return r.pop();
  }
}
class m {
  constructor(t = {}) {
    c(this, "options");
    c(this, "numberFormatter");
    c(this, "expressionParser");
    this.options = {
      decimalSeparator: t.decimalSeparator ?? ".",
      thousandsSeparator: t.thousandsSeparator ?? "",
      fractionDigits: t.fractionDigits ?? 0,
      min: t.min ?? -1 / 0,
      max: t.max ?? 1 / 0
    }, this.numberFormatter = new f(this.options), this.expressionParser = new d();
  }
  format(t) {
    return this.numberFormatter.format(t);
  }
  parse(t) {
    return this.numberFormatter.parse(t);
  }
  calculate(t) {
    const r = t.replace(/\s/g, "").replace(/,/g, (this.options.decimalSeparator ?? ".").toString());
    if (r === "")
      return null;
    try {
      const e = this.expressionParser.processString(r);
      return this.formatResult(e);
    } catch (e) {
      return console.error(e), null;
    }
  }
  formatResult(t) {
    return Math.min(
      Math.max(
        parseFloat(t.toFixed(this.options.fractionDigits)),
        this.options.min
      ),
      this.options.max
    );
  }
}
export {
  m as default
};
