let inStr = ''
let aliases = [{old: "NSM2-US", new: "NSM2(US)"},{old: "NSM5-US", new: "NSM5(US)"}];
let palNum = document.getElementById('palletNumber')
if (palNum) {
  palNum.focus();
}
if (!palNum && document.getElementsByClassName('notmac first')[0]) {
  document.getElementsByClassName('notmac first')[0].focus();
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
          let check = submitData();
        check ? document.getElementById('submittedScan').click() : null
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

