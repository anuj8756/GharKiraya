var CATS = [["all", "🏠", "All"], ["bed", "🛏️", "Bedroom"], ["living", "🛋️", "Living room"], ["app", "🧊", "Appliances"], ["work", "💻", "Work from home"]];
var P = [
    ["Queen bed with mattress", "bed", "🛏️", 1, 799, "Engineered wood, 6-inch mattress"],
    ["Wardrobe, 3-door", "bed", "🚪", 1, 549, "Lockable, mirror front"],
    ["3-seater sofa", "living", "🛋️", 2, 899, "Fabric, washable covers"],
    ["Coffee table", "living", "🪑", 1, 299, "Solid wood top"],
    ["Double door fridge", "app", "🧊", 3, 999, "260L, frost free"],
    ["Front-load washer", "app", "🧺", 3, 1099, "7 kg, fully automatic"],
    ["1.5 ton split AC", "app", "❄️", 4, 1499, "Inverter, 3 star"],
    ["Study desk and chair", "work", "💻", 1, 649, "Ergonomic, adjustable"],
    ["Monitor, 24-inch", "work", "🖥️", 1, 499, "Full HD IPS"]];
var T = [[3, 1], [6, .9], [12, .8]], cat = "all", ten = 6, cart = [];
function $(i) { return document.getElementById(i) }
function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN") }
function toast(m) { var t = $("toast"); t.textContent = m; t.className = "on"; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = "" }, 1800) }
function tabs() {
    $("cats").innerHTML = CATS.map(function (c) { return '<button class="cat" data-c="' + c[0] + '" aria-pressed="' + (cat == c[0]) + '"><span>' + c[1] + '</span>' + c[2] + '</button>' }).join("");
    $("tenure").innerHTML = T.map(function (t) { return '<button data-t="' + t[0] + '" aria-pressed="' + (ten == t[0]) + '">' + t[0] + ' months</button>' }).join("");
}
function render() {
    var f = T.filter(function (t) { return t[0] == ten })[0][1];
    $("grid").innerHTML = P.filter(function (p) { return cat == "all" || p[1] == cat }).map(function (p) {
        var r = Math.round(p[4] * f);
        return '<article class="prod"><div class="img" aria-hidden="true">' + p[2] + '</div><div class="b"><h3>' + p[0] + '</h3><div class="m">' + p[5] + '</div><div class="p">' + inr(r) + ' <small>/month</small></div><button class="btn" data-n="' + p[0] + '" data-p="' + r + '">Add to cart</button></div></article>'
    }).join("");
    $("showing").textContent = "Showing " + (cat == "all" ? "all products" : CATS.filter(function (c) { return c[0] == cat })[0][2].toLowerCase()) + " in " + $("city").value + " for " + ten + " months";
}
function cartCount() { return cart.reduce(function (s, i) { return s + i.qty }, 0) }
function renderCheckout() {
    $("cnt").textContent = cartCount();
    if (!cart.length) { $("coItems").innerHTML = '<p class="co-empty">Your cart is empty. Add a product first.</p>' }
    else { $("coItems").innerHTML = cart.map(function (i) { return '<div class="co-item"><span>' + i.name + (i.qty > 1 ? ' × ' + i.qty : '') + '</span><span>' + inr(i.price * i.qty) + '</span></div>' }).join("") }
    var total = cart.reduce(function (s, i) { return s + i.price * i.qty }, 0);
    $("coTotal").textContent = inr(total);
    $("coDep").textContent = inr(total);
    $("coTenNote").textContent = "for " + ten + " months, billed monthly";
    $("placeOrder").disabled = !cart.length;
}
function required(id, msg) { var v = $(id).value.trim(); $(id + "-e").textContent = v ? "" : msg; return !!v }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validPhone(v) { return /^[0-9+\-\s]{7,15}$/.test(v) }
function validPin(v) { return /^[0-9]{6}$/.test(v) }
document.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.c) { cat = b.dataset.c; tabs(); render() }
    else if (b.dataset.t) { ten = +b.dataset.t; tabs(); render(); renderCheckout() }
    else if (b.dataset.n) {
        var existing = cart.filter(function (i) { return i.name == b.dataset.n })[0];
        if (existing) existing.qty++; else cart.push({ name: b.dataset.n, price: +b.dataset.p, qty: 1 });
        $("cnt").textContent = cartCount(); toast(b.dataset.n + " added to cart");
    }
    else if (b.id == "cartBtn") { renderCheckout(); $("checkout").showModal() }
    else if (b.id == "coClose") { $("checkout").close() }
});
$("checkout").addEventListener("click", function (e) { if (e.target.id == "checkout") $("checkout").close() });
$("city").addEventListener("change", render);

$("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!cart.length) { toast("Add an item before checking out"); return }
    var ok = required("oName", "Enter your name");
    var ph = $("oPhone").value.trim(); $("oPhone-e").textContent = ph ? (validPhone(ph) ? "" : "Enter a valid phone number") : "Enter your phone number";
    ok = ok && ph && validPhone(ph);
    var pin = $("oPin").value.trim(); $("oPin-e").textContent = pin ? (validPin(pin) ? "" : "Enter a 6-digit pincode") : "Enter your pincode";
    ok = ok && pin && validPin(pin);
    ok = required("oAddr", "Enter a delivery address") && ok;
    if (!ok) return;
    toast("Order placed! We'll confirm by phone shortly.");
    cart = []; renderCheckout(); this.reset();
    setTimeout(function () { $("checkout").close() }, 900);
});

$("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = required("cName", "Enter your name");
    var em = $("cEmail").value.trim(); $("cEmail-e").textContent = em ? (validEmail(em) ? "" : "Enter a valid email") : "Enter your email";
    ok = ok && em && validEmail(em);
    var ph = $("cPhone").value.trim(); $("cPhone-e").textContent = (ph && !validPhone(ph)) ? "Enter a valid phone number" : "";
    ok = ok && (!ph || validPhone(ph));
    ok = required("cMsg", "Write a short message") && ok;
    if (!ok) return;
    toast("Message sent — we'll reply within a day.");
    this.reset();
});

tabs(); render(); renderCheckout();
