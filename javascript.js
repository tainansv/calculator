$(function(){
  
  let entry;
  let cur = '0';
  let hist = '0';
  let resultControl = '';
  let result = '';
  let op = '';
  let canAddOp = true;
  let isDecimal = false;
  let ceHit = false;
  let equalHit = false;

  $('button').on('click', function(){
    entry = $(this).attr('val');
    
    if(hist === 'Digit limit met')
      clearAll();
    
    //avoid invalid operations
    if(/[/*+-]/.test(cur) && /[/*+-]/.test(entry) ||
      result === '0' && entry === '0' ||
      cur[0] === '0' && entry === '0' && !isDecimal)
      entry = '';
    
    //handle functions Clear Entry and Clear All
    if(entry === 'ce' || entry === 'ca'){
      if(ceHit || entry === 'ca' || equalHit){
        clearAll();
      } else {
        ceHit = true;
        isDecimal = false;
        let newHist = hist.slice(0, -cur.length);
        hist = (newHist === '') ? '0' : newHist;
        if(!Number(cur))
          result = resultControl;
        else
          result = result.slice(0, -cur.length);
        cur = '0';
      }
    }
    
    //handle numbers
    if(Number(entry) || entry === '0'){
      if(equalHit)
        clearAll();
      
      if(hist === '0'){
        cur = entry;
        hist = entry;
      } else if(!Number(cur)){
        if(isDecimal){
          cur +=  entry;
          hist += entry;      
        }
        else{
          cur = entry;
          hist += entry;
        }
      } else{
        cur += entry;
        hist += entry;
      }
      ceHit = false;
      result += entry;
    }
    
    //handle operations
    if(entry === '.' && !isDecimal){
      if(equalHit || !/[/*+-]/.test(hist))
        clearAll();
      if(!Number(cur)){
        cur = '0';
        result += '0.';
        if(hist === '0')
          hist = '0';
        else
          hist += '0';
      }else
        result += '.';
      cur += entry;
      hist += entry;
      isDecimal = true;
    } else if(entry === '+' || entry === '-' ||
             entry === '*' || entry === '/'){
      if(equalHit){
        hist = cur;
        equalHit = false;
      }
      op = entry;
      cur = entry;
      hist += entry;
      resultControl = result;
      result = eval(result).toFixed(2) + cur;
      isDecimal = false;
    } else if(entry === '=' && !equalHit){
      if(/[.]/.test(eval(result)))
        cur = eval(result).toFixed(2);
      else
        cur = eval(result);
      hist += entry+cur;
      equalHit = true;
    } else if(entry === '%'){
      let perct = eval(resultControl+'*'+cur) /100;
      let assist = result;
      result = eval(resultControl+op+perct).toFixed(2);
      resultControl = assist;
      cur = entry;
      hist += entry;
    }
    
    //reset all values
    function clearAll(){
      cur = '0';
      hist = '0';
      result = '';
      resultControl = '0';
      op = '';
      ceHit = false;
      isDecimal = false;
      equalHit = false;;
    }
    
    //limit of digits
    if(cur.length >= 15 || hist.length >= 25){
      cur = '0';
      hist = 'Digit limit met';
    }
    $('#current').html(cur);
    $('#history').html(hist);
  });
});