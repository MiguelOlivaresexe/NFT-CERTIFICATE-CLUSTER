import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// @ts-ignore
let ipfs = null;
// if (projectId && projectSecret) {
//   ipfs = create({
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//       authorization: auth,
//     },
//   });
// }

export const uploadJsonToIpfs = async (json) => {
  if (!ipfs) {
    const id = `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(`ipfs-${id}`, JSON.stringify(json));
    return id;
  }
  // @ts-ignore
  const { cid } = await ipfs.add(JSON.stringify(json));
  return cid.toString();
};

export const uploadFileToIpfs = async (file) => {
  if (!ipfs) {
    const id = `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const buffer = await file.arrayBuffer();
    localStorage.setItem(
      `ipfs-${id}`,
      JSON.stringify({
        name: file.name,
        data: Array.from(new Uint8Array(buffer)),
      }),
    );
    return id;
  }
  // @ts-ignore
  const { cid } = await ipfs.add(file);
  return cid.toString();
};
