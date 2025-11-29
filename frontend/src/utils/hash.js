import { ethers } from 'ethers';

export const sha256 = (data) => {
  const hash = ethers.sha256(data);
  return hash;
};