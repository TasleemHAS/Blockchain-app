const txForm = document.getElementById("txForm");
const txTable = document.querySelector("#txTable tbody");
const ledgerDiv = document.getElementById("ledger");

txForm.onsubmit = async (e) => {
  e.preventDefault();
  const data = {
    sender: sender.value.trim(),
    recipient: recipient.value.trim(),
    amount: parseInt(amount.value)
  };

  if (!data.sender || !data.recipient || !data.amount) return alert("Please fill all fields");

  await fetch("/transactions/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  txForm.reset();
  loadPending();
};

// Load pending transactions
async function loadPending() {
  const res = await fetch("/transactions/pending");
  const txs = await res.json();

  txTable.innerHTML = "";
  txs.forEach(tx => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${tx.sender}</td><td>${tx.recipient}</td><td>${tx.amount}</td>`;
    txTable.appendChild(row);
  });
}

// Mine block
async function mine() {
  const res = await fetch("/mine");
  const data = await res.json();
  alert(data.message);
  loadPending();
  loadChain();
}

// Load blockchain
async function loadChain() {
  const res = await fetch("/chain");
  const chain = await res.json();

  ledgerDiv.innerHTML = "";
  chain.forEach(block => {
    const card = document.createElement("div");
    card.classList.add("block");
    card.innerHTML = `
      <h3>Block #${block.index}</h3>
      <p><strong>Proof:</strong> ${block.proof}</p>
      <p><strong>Previous Hash:</strong> ${block.previous_hash.slice(0, 20)}...</p>
      <h4>Transactions:</h4>
      <ul>${block.transactions.map(tx => `<li>${tx.sender} → ${tx.recipient} : ${tx.amount}</li>`).join('')}</ul>
    `;
    ledgerDiv.appendChild(card);
  });
}

// Initial load
loadPending();
loadChain();
