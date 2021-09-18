const ENDPOINT = 'https://neofura.ngd.network:1927';
const NEO = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
const BNEO = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
const BNEOADDR = 'NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos';
const FETCH = (ctr, method, args) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [ctr, method, args, [{ account: BNEO, scopes: "CalledByEntry", "allowedcontracts": [], "allowedgroups": [] }]], method: "invokefunction", jsonrpc: "2.0", id: 1 }) }).then(v => v.json())
const DISPLAY = (id, value) => { const element = document.createElement('code'); element.innerText = value; const title = document.getElementById(id); title.parentElement.insertBefore(element, title.nextSibling); }

new Promise(resolve => resolve(BNEO)).then(v => DISPLAY('bneo-script-hash', v));

new Promise(resolve => resolve(BNEOADDR)).then(v => DISPLAY('bneo-contract-address', v))

FETCH(BNEO, "totalSupply", []).then(console.log)
