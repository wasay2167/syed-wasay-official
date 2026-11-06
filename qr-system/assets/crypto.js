/*
 * QR Pass - shared crypto module.
 * QR codes do NOT contain the plain number. They contain an AES-GCM encrypted,
 * authenticated payload, so a normal phone camera / Google Lens only sees gibberish.
 * Only this app's scanner (scan.html) can decrypt and read the number.
 *
 * IMPORTANT: change SECRET below before you deploy. Codes made with one secret
 * cannot be read by a scanner using a different secret.
 */
const QRC = (() => {
  const CONFIG = {
    SECRET: "change-this-secret-phrase-before-deploying",
    VERSION: "QRC1."
  };

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64u = {
    to(buf) {
      let s = "";
      new Uint8Array(buf).forEach(b => (s += String.fromCharCode(b)));
      return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    },
    from(str) {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
      return Uint8Array.from(atob(str), c => c.charCodeAt(0));
    }
  };

  let keyPromise = null;
  function getKey() {
    if (!keyPromise) {
      keyPromise = crypto.subtle
        .importKey("raw", enc.encode(CONFIG.SECRET), "PBKDF2", false, ["deriveKey"])
        .then(base =>
          crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: enc.encode("qr-pass-v1"), iterations: 100000, hash: "SHA-256" },
            base,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
          )
        );
    }
    return keyPromise;
  }

  // Encrypt an object -> short text that goes inside the QR code
  async function seal(obj) {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(
      await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)))
    );
    const out = new Uint8Array(iv.length + ct.length);
    out.set(iv);
    out.set(ct, iv.length);
    return CONFIG.VERSION + b64u.to(out);
  }

  // Decrypt text read from a QR code. Throws if it is not one of ours / was tampered with.
  async function open(text) {
    if (typeof text !== "string" || !text.startsWith(CONFIG.VERSION)) throw new Error("foreign");
    const raw = b64u.from(text.slice(CONFIG.VERSION.length));
    const key = await getKey();
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(0, 12) }, key, raw.slice(12));
    return JSON.parse(dec.decode(pt));
  }

  return { CONFIG, seal, open };
})();
