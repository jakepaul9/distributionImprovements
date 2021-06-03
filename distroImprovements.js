let inStr = ''
// let aliases = [{old: "NSM2-US", new: "NSM2(US)"},{old: "NSM5-US", new: "NSM5(US)"},{old: "NSM5-US", new: "NSM5(US)"}];
let palNum = document.getElementById('palletNumber')

//new
let pallets = [];
let pallet = {
  palId: '',
  items : []
}
let i, dist, order, scanner, stageNum
let title = '';
for(let i = 0; i < 60; i++){
  pallet.items.push({name: '', carton: '', macs: []})
}
//new

if (palNum) {
  palNum.focus();
}
if (!palNum && document.getElementsByClassName('notmac first')[0]) {
  document.getElementsByClassName('notmac first')[0].focus();
}

//new
document.addEventListener('change', e => {
  if(document.getElementsByTagName('center').length > 0){
    title = document.getElementsByTagName('center')[0].innerHTML.includes('Add Cartons to Pallet') ? 'EDIT-' : ''
    title = document.getElementsByTagName('center')[0].innerHTML.includes('Rescan last Pallet') ? 'RESCANNED-' : ''
  }
  // console.log(document.getElementsByTagName('center'))
  if(e.target.name == 'scanner'){
    scanner = e.target.value;
    localStorage.setItem('scanner', scanner.replace(/\s/g, ''));
  }
  if(e.target.name.includes('loadingGate')){
    dist = e.target.value;
    localStorage.setItem('distributor', dist.replace(/\s/g, ''));
  }
  if(e.target.name == 'group'){
    stageNum = e.target.value;
    localStorage.setItem('stageNum', stageNum);
  }
  if(e.target.name == 'order'){
    order = e.target.value;
    localStorage.setItem('orderNo', order.replace(/\s/g, ''));
  }
  if(e.target.name.includes('sku') ){ i = e.target.name.replace(/\D/g,'') }
  // console.log(i)
  e.target.name == 'palletNumber' ? (localStorage.setItem('palNum',e.target.value), pallet.palId = e.target.value) : null;
  e.target.name.includes('sku') ? pallet.items[e.target.name.replace(/\D/g,'')].name = e.target.value : null;
  e.target.name.includes('carton') ? pallet.items[e.target.name.replace(/\D/g,'')].carton = e.target.value: null;
  if(e.target.name.includes('macData')){ 
    let substr = e.target.value.substring(0,3) 
    let reg = `(${substr})[A-z0-9]{1,9}`
    let filter = new RegExp(String(reg),'g')
    pallet.items[e.target.name.replace(/\D/g,'')].macs = e.target.value.match(filter)
  }
  // console.log(pallet)
})

document.addEventListener('click', e => {
  if(e.target.className == 'purplebutton' && e.target.id !== 'startScanning'){
    // e.preventDefault();
    let prevScan = e.target.parentElement.childNodes
    let payload;
    for (let item of prevScan){
      if(item.name == 'payload'){
        payload = JSON.parse(item.value).params;
        console.log(payload)
        localStorage.setItem('distributor', payload.loadingGate)
        localStorage.setItem('scanner', payload.scanner)
        localStorage.setItem('stageNum', payload.group)
        localStorage.setItem('orderNo', payload.orders.join(','))
      }
    }
  }
})
if(document.getElementById('submittedScan')){
    document.getElementById('submittedScan').addEventListener('click', e => {
      // e.preventDefault() 
      let date = new Date();
      let index;
      for(const [i, item] of pallet.items.entries()){
        if(item.name == ''){
          index = i
          break
        }
      }
      // console.log(index)
      pallet.items.splice(index, pallet.items.length);
      let string = generateString(pallet);
      const month = date.toLocaleString('default', { month: 'long' });
      let day = `${date.getDate()}${month}${date.getFullYear()}`
      let time = `${date.getHours()}-${date.getMinutes()}`
      download(`${localStorage.getItem('distributor')}-${localStorage.getItem('orderNo')}-pallet#${localStorage.getItem('palNum')}-${title}(${day}@${time}).txt`, string)
      // JSON.stringify(pallet)
  })
}
const generateString = (obj) => {
  let date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  let day = `${date.getDate()}${month}${date.getFullYear()}`
  let fileStr = ''
  for(let i of obj.items){
    for(let mac of i.macs){
      fileStr += `Mac:${mac} Item:${i.name} Distributor:${localStorage.getItem('distributor')} Order(s):${localStorage.getItem('orderNo')} Date:${day} \n`
    }
  }
  return fileStr;
}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
//new

document.addEventListener('keydown', e => {

  e.target.tagName != 'INPUT' && !(e.key.length > 1) ? inStr += e.key : null;
  if (e.key == 'Enter') {

    if (!palNum && !document.getElementsByTagName('H1')[0].innerHTML.includes('Add')) {
      // console.log(inStr)
      if (inStr.toUpperCase().includes('NEW_PAL')) {
        let newbtn = document.getElementsByClassName('greenbutton');
        if (newbtn.length > 0) {
          newbtn[0].click()
          inStr = ''
        }
      }
      if (inStr.toUpperCase().includes('FIX_PAL')) {
        let newbtn = document.getElementsByClassName('yellowbutton');
        if (newbtn.length > 0) {
          newbtn[0].click()
          inStr = ''
        }
      }

    } else if (e.target.value) {
      if (e.target.value.toUpperCase().includes('NEW_PAL')) {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase().replace('NEW_PAL', '')
      }
      if (e.target.value.toUpperCase().includes('FIX_PAL')) {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase().replace('FIX_PAL', '')
      }
      if (e.target.id != 'palletNumber') {
        // e.preventDefault()
      } else {
        if (e.target.value.toUpperCase().includes('BEGIN')) {
          e.target.value = e.target.value.toUpperCase().replace('BEGIN', '')
          document.getElementsByClassName('notmac first')[0].focus()
        } else {
          e.preventDefault()
        }
      }
      if (e.target.value.toUpperCase().includes('END_MAC')) {
        console.log(e.target.className)
        e.preventDefault();
        console.log('here11')
        if (e.target.className.includes('ismac')) {
          console.log('ismac')
          e.preventDefault();
          e.target.parentElement.parentElement.nextElementSibling.children[1].firstElementChild.focus()
        } else {
          e.preventDefault();
        }
        e.target.value = e.target.value.toUpperCase().replace('END_MAC', '')
      }
      if (e.target.value.toUpperCase().includes('BEGIN')) {
        if (e.target.id != 'palletNumber') {
          e.preventDefault();
        }
        e.target.value = e.target.value.toUpperCase().replace('BEGIN', '')
      }
      if (e.target.value.toUpperCase().includes('PAL_END')) {
        e.preventDefault();
        e.target.value = e.target.value.toUpperCase().replace('PAL_END', '')
//         submitData(e);
        document.getElementById('submittedScan').click()
      }
      if (e.target.value.includes('TAB>>')) {

        let temp = e.target.value
        let name = e.target.name.replace(/[0-9]/g, '');
        let nextName = ''
        let index = parseInt(e.target.name.replace(/\D/g, ''), 10);
        e.preventDefault();
        // e.select();
        e.target.value = temp.replace('TAB>>', '');
        name == "sku" ? nextName = "carton" : name == "carton" ? nextName = "macData" : name == "macData" ? (nextName = "sku", index++) : name == 'palletNumber' ? (nextName = 'sku', index = 0) : null
        document.getElementsByName(`${nextName}${index}`)[0].focus()

        // document.getElementsByName(`${nextName}${index}`)[0].select(ev => {ev.preventDefault();})
        // window.getSelection().removeAllRanges();
      } else if (e.target.value.includes('<<TAB')) {
        e.preventDefault();
        let name = e.target.name.replace(/[0-9]/g, '');
        let nextName = ''
        let index = parseInt(e.target.name.replace(/\D/g, ''), 10);
        e.target.value = e.target.value.replace('<<TAB', '');
        (name == "sku" && index > 0) ? (nextName = "macData", --index) : name == "carton" ? nextName = "sku" : name == "macData" ? nextName = "carton" : (name == 'sku' && index == 0) ? (nextName = 'palletNumber', index = '') : (name == 'sku' && index == 0 && !palNum) ? newName = sku : null
        console.log(`${nextName}${index}`)
        document.getElementsByName(`${nextName}${index}`)[0].focus()
      }
      if (e.target.value.includes('EDIT_CELL')) {
        e.preventDefault();
        e.target.value.length < 10 ? e.target.value = ` ${e.target.value.replace('EDIT_CELL', '')}` : e.target.value = e.target.value.replace('EDIT_CELL', '')
        e.target.select();
      } else {
        // e.preventDefault()
      }
      for(alias of aliases){
        if (e.target.value.toUpperCase().includes(alias.old)){
            e.target.value = alias.new
          break;
        }
      }
      
    }
    inStr = '';
  }
})

