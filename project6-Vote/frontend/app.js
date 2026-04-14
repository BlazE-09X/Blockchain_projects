const address = "0x362d313fE39Dd9670425049f7D8e380849aF419a";
const abi = [
  "function vote(uint proposal)",
  "function giveRightToVote(address voter)",
  "function winnerName() view returns (bytes32)",
  "function proposals(uint) view returns (bytes32 name, uint voteCount)",
];

let contract;
let signer;

async function connect() {
  if (!window.ethereum) return alert("Install Metamask!");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(address, abi, signer);

  const userAddr = await signer.getAddress();
  document.getElementById("wallet").innerText = 
    userAddr.slice(0, 6) + "..." + userAddr.slice(-4);
  
  loadProposals();
}

async function loadProposals() {
  let html = "";
  try {
    for (let i = 0; i < 3; i++) {
      const p = await contract.proposals(i);
      ;
      html += `
        <div class="proposal-item">
          <medium style="color: var(--accent); font-weight: bold;">Кандидат №${i + 1}</medium>
          <h3>${name}</h3>
          <p style="color: #64748b">Голосов: <b>${p.voteCount}</b></p>
          <button onclick="vote(${i})">Голосовать</button>
        </div>
      `;
    }
    document.getElementById("proposals").innerHTML = html;
  } catch (e) {
    console.error("Ошибка загрузки:", e);
  }
}

async function vote(i) {
  try {
    const tx = await contract.vote(i);
    document.getElementById("status").innerText = "⏳ Транзакция отправлена...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Голос учтен!";
    loadProposals();
  } catch (e) {
    alert("Ошибка при голосовании");
  }
}

async function giveRight() {
  const addr = document.getElementById("addr").value;
  try {
    const tx = await contract.giveRightToVote(addr);
    await tx.wait();
    alert("Право успешно предоставлено!");
  } catch (e) {
    alert("Ошибка: проверьте, являетесь ли вы админом.");
  }
}

async function winner() {
  try {
    const w = await contract.winnerName();
    const name = ethers.decodeBytes32String(w);
    

    const displayName = name.replace(/Proposal/i, "Кандидат");
    
    document.getElementById("winner").innerText = "🎉 Победитель: " + displayName;
  } catch (e) {
    console.error("Ошибка при определении победителя:", e);
    alert("Не удалось определить победителя");
  }

}