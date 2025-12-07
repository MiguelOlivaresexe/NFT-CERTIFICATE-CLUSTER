import axios from 'axios';

const API_URL = "http://localhost:5000/api/fake-smart-contracts";

const fakeTx = () => ({
  hash: `0x${Math.random().toString(16).substring(2, 66)}`, // Generate a random hex string for hash
  wait: async () => new Promise((resolve) => setTimeout(resolve, 300)),
});

export default class FakeDocumentNFT {
  constructor(adminAccount) {
    this.admin = adminAccount;
  }

  async DEFAULT_ADMIN_ROLE() {
    return "0x00";
  }

  async hasRole(role, account) {
    return account === this.admin;
  }

  async mintDocument(owner, cid, documentHash) {
    try {
      const response = await axios.post(API_URL, {
        cid,
        documentHash,
        owner,
        burned: false,
      });
      return { ...fakeTx(), tokenId: response.data.tokenId };
    } catch (error) {
      console.error("Error minting document:", error);
      throw error;
    }
  }

  async tokenMetadata(tokenId) {
    try {
      const response = await axios.get(`${API_URL}/${tokenId}`);
      const t = response.data;
      if (!t || t.burned) {
        return ["", "", "0x0000000000000000000000000000000000000000"];
      }
      return [t.cid, t.documentHash, t.owner];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return ["", "", "0x0000000000000000000000000000000000000000"];
      }
      console.error("Error fetching token metadata:", error);
      throw error;
    }
  }

  async getAllDocuments() {
    try {
      const response = await axios.get(API_URL);
      return response.data.filter(t => !t.burned);
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw error;
    }
  }

  async burnDocument(tokenId) {
    try {
      await axios.put(`${API_URL}/${tokenId}`, { burned: true, cid: "", documentHash: "" });
      return fakeTx();
    } catch (error) {
      console.error("Error burning document:", error);
      throw error;
    }
  }

  async safeTransferOwner(from, to, tokenId) {
    try {
      await axios.put(`${API_URL}/${tokenId}`, { owner: to });
      return fakeTx();
    } catch (error) {
      console.error("Error transferring owner:", error);
      throw error;
    }
  }
}
