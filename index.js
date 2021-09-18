const ENDPOINT = 'https://neofura.ngd.network:1927';
const NEO = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
const GAS = '0xd2a4cff31913016155e38e474a2c06d08be276cf';
const BNEO = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';
const BNEOADDR = 'NPmdLGJN47EddqYcxixdGMhtkr7Z5w4Aos';
const SCRIPTAGENT = 'AAARwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAERwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAIRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAMRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAQRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAURwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAYRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAcRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAgRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAkRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAoRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAsRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAAwRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA0RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA4RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSAA8RwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABARwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABERwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABIRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABMRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtSABQRwB8MBWFnZW50DBQqTJpNQCJniwPvG74INPlmRg3ESEFifVtS'
const FETCHFUNC = (ctr, method, args) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [ctr, method, args, [{ account: BNEO, scopes: "CalledByEntry", "allowedcontracts": [], "allowedgroups": [] }]], method: "invokefunction", jsonrpc: "2.0", id: 1 }) }).then(v => v.json()).then(v => v.result)
const FETCHSCRIPT = (script) => fetch(ENDPOINT, { method: 'POST', body: JSON.stringify({ params: [script, [{ account: BNEO, scopes: "CalledByEntry", "allowedcontracts": [], "allowedgroups": [] }]], method: "invokescript", jsonrpc: "2.0", id: 1 }) }).then(v => v.json()).then(v => v.result)
const DISPLAY = (id, value) => { const element = document.createElement('code'); element.innerText = value; const title = document.getElementById(id); title.parentElement.insertBefore(element, title.nextSibling); }

new Promise(resolve => resolve(BNEO)).then(v => DISPLAY('bneo-script-hash', v));
new Promise(resolve => resolve(BNEOADDR)).then(v => DISPLAY('bneo-contract-address', v))
FETCHFUNC(BNEO, "totalSupply", []).then(v => DISPLAY('bneo-total-supply-multiplied-by-108', v.stack[0].value))
FETCHFUNC(GAS, "balanceOf", [{ "type": "Hash160", "value": BNEO }]).then(v => DISPLAY('total-unclaimed-gas-multiplied-by-108', v.stack[0].value))
FETCHFUNC(BNEO, "rPS", []).then(v => DISPLAY('gas-reward-per-neo-since-system-start-multiplied-by-108', v.stack[0].value))
FETCHSCRIPT(SCRIPTAGENT).then(v => console.log(v))
