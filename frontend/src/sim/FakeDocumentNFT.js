const STORAGE_KEY = 'fakeDocumentNFT';

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { nextId: 1, tokens: {} };
  try {
    return JSON.parse(raw);
  } catch {
    return { nextId: 1, tokens: {} };
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const randomHex = (len) => {
  const chars = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
};

const fakeTx = () => ({
  hash: `0x${randomHex(64)}`,
  wait: async () => new Promise((resolve) => setTimeout(resolve, 300))
});

export default class FakeDocumentNFT {
  constructor(adminAccount) {
    this.admin = adminAccount;
  }

  async DEFAULT_ADMIN_ROLE() {
    return '0x00';
  }

  async hasRole(role, account) {
    return account === this.admin;
  }

  async mintDocument(owner, cid, documentHash) {
    const state = loadState();
    const id = state.nextId;
    state.nextId = id + 1;
    state.tokens[id] = { cid, documentHash, owner, burned: false };
    saveState(state);
    return fakeTx();
  }

  async tokenMetadata(tokenId) {
    const state = loadState();
    const t = state.tokens[tokenId];
    if (!t || t.burned) return ['', '', '0x0000000000000000000000000000000000000000'];
    return [t.cid, t.documentHash, t.owner];
  }

  async burnDocument(tokenId) {
    const state = loadState();
    const t = state.tokens[tokenId];
    if (t) {
      t.burned = true;
      t.cid = '';
      t.documentHash = '';
      saveState(state);
    }
    return fakeTx();
  }

  async safeTransferOwner(from, to, tokenId) {
    const state = loadState();
    const t = state.tokens[tokenId];
    if (t && !t.burned) {
      t.owner = to;
      saveState(state);
    }
    return fakeTx();
  }
}