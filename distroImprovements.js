let inStr = ''
let aliases = [{old: "NSM2-US", new: "NSM2(US)"},{old: "NSM5-US", new: "NSM5(US)"}];
let palNum = document.getElementById('palletNumber')
if (palNum) {
  palNum.focus();
}
if (!palNum && document.getElementsByClassName('notmac first')[0]) {
  document.getElementsByClassName('notmac first')[0].focus();
}

let pallets = [];
let pallet = {
  palId: '',
  items : []
}
let i;
let dist;
for(let i = 0; i < 60; i++){
  pallet.items.push({name: '', carton: '', macs: []})
}
document.addEventListener('change', e => {
  if(e.target.name.includes('loadingGate')){
    dist = e.target.value;
    localStorage.setItem('distributor', dist);
  }
  if(e.target.name.includes('sku') ){ i = e.target.name.replace(/\D/g,'') }
  console.log(i)
  e.target.name == 'palletNumber' ? pallet.palId = e.target.value : null;
  e.target.name.includes('sku') ? pallet.items[i].name = e.target.value : null;
  e.target.name.includes('carton') ? pallet.items[i].carton = e.target.value: null;
  e.target.name.includes('macData') ? pallet.items[i].macs = e.target.value.split(',') : null;
  console.log(pallet)
})

if(document.getElementById('submittedScan')){document.getElementById('submittedScan').addEventListener('click', e => {
  // e.preventDefault() 
  let date = new Date();
  let index;
  for(const [i, item] of pallet.items.entries()){
    if(item.name == ''){
      index = i
      break
      
    }
  }
  console.log(index)
  pallet.items.splice(index, pallet.items.length);
  let string = generateString(pallet);
  download(`${localStorage.getItem('distributor')}_pallet#${pallet.palId}(${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}@${date.getHours()}:${date.getMinutes()}).txt`, string)
  // JSON.stringify(pallet)
})
}

const generateString = (obj) => {
  let fileStr = ''

  fileStr += `PALLET NO: ${obj.palId}\n------------------------------------------\n\n`
  for(let i of obj.items){
    fileStr += `ITEM:\t${i.name}\n\nCARTON:\t${i.carton}\n\nMAC ADDRESS(ES):\t`
    for(let mac of i.macs){
      fileStr += `${mac}\n`
      fileStr += `\t\t`
    }
    fileStr += '\n------------------------------------------\n\n'
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
          let date = new Date();
  let index;
  for(const [i, item] of pallet.items.entries()){
    if(item.name == ''){
      index = i
      break
      
    }
  }
  console.log(index)
  pallet.items.splice(index, pallet.items.length);
  let string = generateString(pallet);
  download(`${localStorage.getItem('distributor')}_pallet#${pallet.palId}(${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}@${date.getHours()}:${date.getMinutes()}).txt`, string)
  
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

