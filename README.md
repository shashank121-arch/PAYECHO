# ZK PayEcho

Zero-Knowledge Salary Benchmarking dApp built for the Midnight Preview Testnet.

> [!NOTE]
> ### 🌐 Live Deployment Proofs (Midnight Preview Testnet)
> **Contract Address:** `02806c1326edbe4ecc853fd43765d7dbcb797167c4922443d1ac5e2cac60f292`  
> **Transaction Hash:** `0x082809c5ab5f4826819717f5a400e60ebb63a780c94e4bb0b3d87d34bd5360aa`

---

## Level 1 (New Moon): Foundation & Deployment

### Project Idea
ZK PayEcho allows employees to anonymously contribute to a public compensation dataset. The application proves that a user's exact salary falls into a specific tier without ever revealing the exact amount or their identity.

### Ledger vs Witness
- **Witness (Private Zone):** The exact salary value and user salt/identifier are local and never leave the device.
- **Ledger (Public Zone):** The on-chain state safely wraps around the calculated Band ID and nullifier, mapping `Band ID -> Total Count`.

### Setup Instructions
1. `npm install`
2. `npm run build:contract`
3. `proof-server --port 6300` (Local Midnight Proof Server)
4. `npm run dev`

### Deployment Proof
*(Drop your terminal screenshot here showing successful Lace deployment)*  
![Deployment Proof](assets/deployment-proof.png)

---

## Level 2 (Crescent Moon): Privacy & Connectivity

### 1AM Wallet Connection
The frontend connects securely to the 1AM Wallet browser extension utilizing `window.midnight.mn1am`. Connection establishes the current network provider and gives the frontend context for submission, without leaking the user's private data until a ZK circuit is invoked.

### Observable Privacy Behavior
Users browse the public ledger anonymously. When connecting a wallet, the UI state syncs, but absolutely zero personal data is transmitted off-client.

### UI Connected Proof
*(Drop your Liquid Glass UI connected screenshot here)*  
![UI Connected](assets/ui-connected.png)

---

## Level 3 (Half Moon): Deep Privacy Analysis

### Privacy Model Analysis (`disclose()`)
The circuit mathematically validates the salary, calculates the corresponding Salary Band, and hashes the secret salt to generate a one-way **nullifier**. Crucially, the Compact contract exclusively uses the `disclose()` function on the resulting Band ID, securely omitting the raw salary from the proof structure, rendering reverse-engineering of the amount impossible. Double-spending is prevented via the nullifier check.

### Test Suite Results
- ✔ UI Components Rendered (Liquid Glass Theme)
- ✔ Wallet Hooks Functional (`useMidnight.ts`)
- ✔ Contract Configuration Synced
- ✔ Simulated E2E Circuit Generation & Ledger Sync (Automated)

### ZK Proof Success Proof
*(Drop your Dashboard public ledger sync screenshot here)*  
![ZK Proof Success](assets/zk-proof-success.png)
