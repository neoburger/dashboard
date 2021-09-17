new Promise(resolve => resolve('0x48c40d4666f93408be1bef038b6722404d9a4c2a')).then(v => {
  const value = document.createElement('code');
  value.innerText = v;
  const title = document.getElementById('bneo-script-hash');
  title.parentElement.insertBefore(value, title.nextSibling)
})

new Promise(resolve => resolve('NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos')).then(v => {
  const value = document.createElement('code');
  value.innerText = v;
  const title = document.getElementById('bneo-contract-address');
  title.parentElement.insertBefore(value, title.nextSibling)
})
const ENDPOINT = 'https://neofura.ngd.network:1927';
const BNEO = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
fetch(ENDPOINT, {
    method: 'POST', mode: 'cors', body: JSON.stringify({ params: [BNEO, "totalSupply", []], jsonrpc: "2.0", id: 1 })
}).then(console.log)
// cors test
