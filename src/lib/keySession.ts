// In-memory store for unlocked CryptoKey objects.
// Keys are held only in module-level variables — never written to localStorage,
// sessionStorage, or cookies. Cleared automatically on page refresh/tab close.

let _userPrivateKey: CryptoKey | null = null
let _userPublicKey: CryptoKey | null = null
let _adminPrivateKey: CryptoKey | null = null
let _adminPublicKey: CryptoKey | null = null

export const keySession = {
  setUserKeys(pub: CryptoKey, priv: CryptoKey) {
    _userPublicKey = pub
    _userPrivateKey = priv
  },
  getUserPrivateKey() {
    return _userPrivateKey
  },
  getUserPublicKey() {
    return _userPublicKey
  },

  setAdminPrivateKey(key: CryptoKey) {
    _adminPrivateKey = key
  },
  getAdminPrivateKey() {
    return _adminPrivateKey
  },

  setAdminPublicKey(key: CryptoKey) {
    _adminPublicKey = key
  },
  getAdminPublicKey() {
    return _adminPublicKey
  },

  isUserKeyLoaded() {
    return _userPrivateKey !== null
  },
  isAdminKeyLoaded() {
    return _adminPrivateKey !== null
  },

  clear() {
    _userPrivateKey = null
    _userPublicKey = null
    _adminPrivateKey = null
    _adminPublicKey = null
  },
}
